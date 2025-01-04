// hooks/useImageState.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import { apiService } from "@/api/api";
import { Token } from "@/constants/types";


export const useImageState = (address: string | undefined) => {
  const [images, setImages] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const refreshTimeout = useRef<NodeJS.Timeout>();


  const fetchImages = useCallback(async (): Promise<number> => {
    if (!address) return 0;
    const fetchedImages = await apiService.getDispopens(address);
    setImages(fetchedImages);
    return fetchedImages.length;
  }, [address]);


  const delayedRefresh = useCallback(async () => {
    setIsLoading(true);
    const initialLength = images?.length || 0;
    const newLength = await fetchImages();

    if (newLength > initialLength) {
      setIsLoading(false);
      return;
    }

    const delays = [6000]; // Customize as needed
    for (const delay of delays) {
      refreshTimeout.current = setTimeout(async () => {
        const num = await fetchImages();
        if (num > initialLength) {
          clearTimeout(refreshTimeout.current!);
          setIsLoading(false);
          return;
        }
        if (delay === delays[delays.length - 1]) setIsLoading(false);
      }, delay);
    }
  }, [images?.length, fetchImages]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchImages();
    } finally {
      setRefreshing(false);
    }
  }, [fetchImages]);

  useEffect(() => {
    if (isFocused) {
      delayedRefresh();
    }
  }, [isFocused, delayedRefresh]);



  useEffect(() => {
    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, []);

  return { images, isLoading, refreshing, fetchImages, onRefresh, delayedRefresh };
};
