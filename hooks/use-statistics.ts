"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { storage } from "@/lib/storage";

type Statistics = {
  totalAnalyses: number;
  negativeCount: number;
  positiveCount: number;
  streakCount: number;
  lastRefinedDate: string | null; // ISO YYYY-MM-DD
};

type UseStatisticsReturn = {
  statistics: Statistics;
  updateStatistics: (isNegative: boolean) => void;
  resetStatistics: () => void;
  isLoading: boolean;
};

const DEFAULT_STATISTICS: Statistics = {
  totalAnalyses: 0,
  negativeCount: 0,
  positiveCount: 0,
  streakCount: 0,
  lastRefinedDate: null,
};

export function useStatistics(): UseStatisticsReturn {
  const [statistics, setStatistics] = useState<Statistics>(DEFAULT_STATISTICS);
  const [isLoading, setIsLoading] = useState(true);

  // Load statistics on mount
  useEffect(() => {
    try {
      const storedStats = storage.getItem(STORAGE_KEYS.STATISTICS);
      if (storedStats) {
        const parsed = JSON.parse(storedStats) as Partial<Statistics>;
        // Merge with default to handle schema migrations for existing users
        setStatistics({
          ...DEFAULT_STATISTICS,
          ...parsed,
          // Ensure these exist even if parsed object is old version
          streakCount: parsed.streakCount ?? DEFAULT_STATISTICS.streakCount,
          lastRefinedDate:
            parsed.lastRefinedDate ?? DEFAULT_STATISTICS.lastRefinedDate,
        });
      }
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatistics = useCallback((isNegative: boolean) => {
    const today = new Date().toISOString().split("T")[0] as string;

    setStatistics((prev) => {
      let newStreak = prev.streakCount;
      const lastDate = prev.lastRefinedDate;

      if (lastDate !== today) {
        if (lastDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          if (lastDate === yesterdayStr) {
            newStreak += 1;
          } else {
            newStreak = 1; // Reset if missed a day (or more)
          }
        } else {
          newStreak = 1; // First time
        }
      }
      // If lastDate === today, streak remains same

      const updated: Statistics = {
        totalAnalyses: prev.totalAnalyses + 1,
        negativeCount: isNegative ? prev.negativeCount + 1 : prev.negativeCount,
        positiveCount: isNegative ? prev.positiveCount : prev.positiveCount + 1,
        streakCount: newStreak,
        lastRefinedDate: today,
      };

      storage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetStatistics = useCallback(() => {
    setStatistics(DEFAULT_STATISTICS);
    storage.removeItem(STORAGE_KEYS.STATISTICS);
  }, []);

  return {
    statistics,
    updateStatistics,
    resetStatistics,
    isLoading,
  };
}
