'use client';

import { useState, useCallback } from 'react';
import { BrowserProvider } from 'ethers';
import { getContractWithSigner } from '@/lib/contract';
import { Restaurant, ReviewFormData } from '@/types';

export function useRestaurant(provider: BrowserProvider | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const registerRestaurant = useCallback(
    async (name: string, location: string) => {
      if (!provider) throw new Error('Wallet not connected');

      setIsLoading(true);
      try {
        const contract = await getContractWithSigner(provider);
        const tx = await contract.registerRestaurant(name, location);
        await tx.wait();
        return tx;
      } finally {
        setIsLoading(false);
      }
    },
    [provider]
  );

  const submitReview = useCallback(
    async (reviewData: ReviewFormData) => {
      if (!provider) throw new Error('Wallet not connected');

      setIsLoading(true);
      try {
        const contract = await getContractWithSigner(provider);
        const tx = await contract.submitReview(
          reviewData.restaurantId,
          reviewData.foodQuality,
          reviewData.service,
          reviewData.atmosphere,
          reviewData.priceValue,
          reviewData.overallRating,
          reviewData.comment
        );
        await tx.wait();
        return tx;
      } finally {
        setIsLoading(false);
      }
    },
    [provider]
  );

  const loadRestaurants = useCallback(async () => {
    if (!provider) throw new Error('Wallet not connected');

    setIsLoading(true);
    try {
      const contract = await getContractWithSigner(provider);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const counts = await contract.getTotalCounts();
      const totalRestaurants = Number(counts.totalRestaurants);

      const restaurantList: Restaurant[] = [];

      for (let i = 1; i <= totalRestaurants; i++) {
        try {
          const restaurant = await contract.getRestaurant(i);
          const hasReviewed = await contract.hasReviewed(i, userAddress);

          restaurantList.push({
            id: i,
            name: restaurant.name,
            location: restaurant.location,
            owner: restaurant.restaurantOwner,
            isActive: restaurant.isActive,
            totalReviews: Number(restaurant.totalReviews),
            createdAt: Number(restaurant.createdAt),
          });
        } catch (error) {
          console.error(`Error loading restaurant ${i}:`, error);
        }
      }

      setRestaurants(restaurantList);
      return restaurantList;
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  const checkHasReviewed = useCallback(
    async (restaurantId: number, userAddress: string) => {
      if (!provider) throw new Error('Wallet not connected');

      const contract = await getContractWithSigner(provider);
      return await contract.hasReviewed(restaurantId, userAddress);
    },
    [provider]
  );

  return {
    isLoading,
    restaurants,
    registerRestaurant,
    submitReview,
    loadRestaurants,
    checkHasReviewed,
  };
}
