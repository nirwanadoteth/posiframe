"use client";
import type { CSSProperties, ReactElement } from "react";
import {
  Children,
  cloneElement,
  isValidElement,
  type PropsWithChildren,
  useLayoutEffect,
  useMemo,
} from "react";
import { useIsInMiniApp } from "@/hooks/use-is-in-mini-app";
import { useMiniApp } from "@/hooks/use-mini-app";

export type SafeAreaProps = PropsWithChildren<{
  asChild?: boolean;
}>;

/**
 * Renders children with safe area padding when running inside a Mini App.
 *
 * - Reads inset values from `MiniApp` `context.client.safeAreaInsets` and exposes them as
 *   CSS custom properties on `:root`/`html`:
 *   `--miniapp-safe-area-inset-top|right|bottom|left`.
 * - Uses those variables directly as pixel values via `var(..., 0px)`.
 * - When `asChild` is true, expects a single React element and merges the padding into the
 *   child's `style`. Otherwise, wraps `children` in a `div` that has the padding applied.
 * - If no `children` are provided, the component renders nothing but still ensures the
 *   CSS variables are set on `:root`.
 * - When not inside a Mini App, returns `children` unchanged and does not set variables.
 *
 * @param props
 * @param props.children React children to render.
 * @param props.asChild When true, merges safe-area padding into the single child's `style` instead of wrapping.
 */
export function SafeArea({ children, asChild }: SafeAreaProps) {
  const { context } = useMiniApp();
  const { isInMiniApp } = useIsInMiniApp();

  const safeAreaInsets = useMemo(() => {
    const { top, bottom, left, right } = context?.client?.safeAreaInsets || {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    return { top, bottom, left, right };
  }, [context]);

  useLayoutEffect(() => {
    if (!isInMiniApp) {
      return;
    }

    for (const [key, value] of Object.entries(safeAreaInsets)) {
      document.documentElement.style.setProperty(
        `--miniapp-safe-area-inset-${key}`,
        `${value}px`
      );
    }
  }, [safeAreaInsets, isInMiniApp]);

  const paddingStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: "var(--miniapp-safe-area-inset-top, 0px)",
      paddingRight: "var(--miniapp-safe-area-inset-right, 0px)",
      paddingBottom: "var(--miniapp-safe-area-inset-bottom, 0px)",
      paddingLeft: "var(--miniapp-safe-area-inset-left, 0px)",
    }),
    []
  );

  if (!isInMiniApp) {
    return children;
  }

  if (!children) {
    return null;
  }

  if (asChild) {
    if (!isValidElement(children)) {
      console.warn(
        "SafeArea: children is not a valid element. Returning children as is."
      );
      return children;
    }

    const onlyChild = Children.only(children) as ReactElement<{
      style?: CSSProperties;
    }>;

    const mergedStyle: CSSProperties = {
      ...onlyChild.props.style,
      ...paddingStyles,
    };

    return cloneElement(onlyChild, { style: mergedStyle });
  }

  return <div style={paddingStyles}>{children}</div>;
}
