"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "posiframe_statistics";

type Statistics = {
  totalAnalyses: number;
  negativeCount: number;
  positiveCount: number;
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
};

export function useStatistics(): UseStatisticsReturn {
  const [statistics, setStatistics] = useState<Statistics>(DEFAULT_STATISTICS);
  const [isLoading, setIsLoading] = useState(true);

  // Load statistics on mount
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem(STORAGE_KEY);
      if (storedStats) {
        const parsed = JSON.parse(storedStats) as Statistics;
        setStatistics(parsed);
      }
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatistics = useCallback((isNegative: boolean) => {
    setStatistics((prev) => {
      const updated: Statistics = {
        totalAnalyses: prev.totalAnalyses + 1,
        negativeCount: isNegative ? prev.negativeCount + 1 : prev.negativeCount,
        positiveCount: isNegative ? prev.positiveCount : prev.positiveCount + 1,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore - localStorage may throw in private browsing
      }
      return updated;
    });
  }, []);

  const resetStatistics = useCallback(() => {
    setStatistics(DEFAULT_STATISTICS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore - localStorage may throw in private browsing
    }
  }, []);

  return {
    statistics,
    updateStatistics,
    resetStatistics,
    isLoading,
  };
}
