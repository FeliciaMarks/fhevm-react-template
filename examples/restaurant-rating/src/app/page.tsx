'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useRestaurant } from '@/hooks/useRestaurant';
import { initFHEVM } from '@/lib/fhevm';
import { Restaurant, ReviewFormData, StatusMessage } from '@/types';

export default function Home() {
  const { walletState, provider, connectWallet } = useWallet();
  const { isLoading, restaurants, registerRestaurant, submitReview, loadRestaurants, checkHasReviewed } = useRestaurant(provider);

  // Form states
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const [reviewRestaurantId, setReviewRestaurantId] = useState('');
  const [foodQuality, setFoodQuality] = useState('');
  const [service, setService] = useState('');
  const [atmosphere, setAtmosphere] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [overallRating, setOverallRating] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  // Status states
  const [registerStatus, setRegisterStatus] = useState<StatusMessage | null>(null);
  const [reviewStatus, setReviewStatus] = useState<StatusMessage | null>(null);
  const [reviewedRestaurants, setReviewedRestaurants] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (walletState.isConnected && provider) {
      initFHEVM().catch(console.error);
      loadRestaurants().catch(console.error);
    }
  }, [walletState.isConnected, provider, loadRestaurants]);

  useEffect(() => {
    // Check which restaurants the user has reviewed
    if (walletState.isConnected && walletState.address && restaurants.length > 0) {
      const checkReviews = async () => {
        const reviewed = new Set<number>();
        for (const restaurant of restaurants) {
          try {
            const hasReviewed = await checkHasReviewed(restaurant.id, walletState.address!);
            if (hasReviewed) {
              reviewed.add(restaurant.id);
            }
          } catch (error) {
            console.error(`Error checking review status for restaurant ${restaurant.id}:`, error);
          }
        }
        setReviewedRestaurants(reviewed);
      };
      checkReviews();
    }
  }, [walletState, restaurants, checkHasReviewed]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleRegisterRestaurant = async () => {
    try {
      const name = restaurantName.trim();
      const location = restaurantLocation.trim();

      if (!name || !location) {
        setRegisterStatus({ message: 'Please fill in all fields', type: 'error' });
        return;
      }

      if (!provider) {
        setRegisterStatus({ message: 'Please connect your wallet first', type: 'error' });
        return;
      }

      setRegisterStatus({ message: 'Registering restaurant...', type: 'info' });

      await registerRestaurant(name, location);

      setRegisterStatus({ message: 'Restaurant registered successfully!', type: 'success' });
      setRestaurantName('');
      setRestaurantLocation('');

      // Reload restaurants after a delay
      setTimeout(() => {
        loadRestaurants().catch(console.error);
      }, 2000);
    } catch (error: any) {
      console.error('Error registering restaurant:', error);
      setRegisterStatus({ message: `Failed to register restaurant: ${error.message}`, type: 'error' });
    }
  };

  const handleSubmitReview = async () => {
    try {
      const restaurantId = parseInt(reviewRestaurantId);
      const ratings = {
        foodQuality: parseInt(foodQuality),
        service: parseInt(service),
        atmosphere: parseInt(atmosphere),
        priceValue: parseInt(priceValue),
        overallRating: parseInt(overallRating),
      };

      // Validation
      if (!restaurantId || restaurantId < 1) {
        setReviewStatus({ message: 'Please enter a valid restaurant ID', type: 'error' });
        return;
      }

      const allRatings = [ratings.foodQuality, ratings.service, ratings.atmosphere, ratings.priceValue, ratings.overallRating];
      for (const rating of allRatings) {
        if (!rating || rating < 1 || rating > 10) {
          setReviewStatus({ message: 'All ratings must be between 1-10', type: 'error' });
          return;
        }
      }

      if (!provider) {
        setReviewStatus({ message: 'Please connect your wallet first', type: 'error' });
        return;
      }

      setReviewStatus({ message: 'Submitting encrypted review...', type: 'info' });

      const reviewData: ReviewFormData = {
        restaurantId,
        ...ratings,
        comment: reviewComment.trim(),
      };

      await submitReview(reviewData);

      setReviewStatus({ message: 'Review submitted successfully! Your ratings are encrypted and private.', type: 'success' });

      // Clear form
      setReviewRestaurantId('');
      setFoodQuality('');
      setService('');
      setAtmosphere('');
      setPriceValue('');
      setOverallRating('');
      setReviewComment('');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setReviewStatus({ message: `Failed to submit review: ${error.message}`, type: 'error' });
    }
  };

  const fillRestaurantId = (restaurantId: number) => {
    setReviewRestaurantId(restaurantId.toString());
    // Scroll to review form
    if (typeof window !== 'undefined') {
      const element = document.getElementById('reviewForm');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center text-white mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          🍽️ Private Restaurant Rating System
        </h1>
        <p className="text-lg md:text-xl opacity-90">
          Confidential dining experience reviews using homomorphic encryption
        </p>
      </div>

      {/* Wallet Connection */}
      <div className="text-center text-white mb-8">
        {!walletState.isConnected ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <button className="btn btn-secondary max-w-md" onClick={handleConnectWallet}>
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="status success max-w-2xl mx-auto">
            <strong>Connected:</strong> {walletState.address?.substring(0, 6)}...{walletState.address?.substring(38)}
            <br />
            <strong>Network:</strong> Chain ID {walletState.chainId}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Register Restaurant Card */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-cyan-500 pb-3">
            🏪 Register Restaurant
          </h2>
          <div className="form-group">
            <label htmlFor="restaurantName" className="label">
              Restaurant Name:
            </label>
            <input
              type="text"
              id="restaurantName"
              className="input-field"
              placeholder="Enter restaurant name"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="restaurantLocation" className="label">
              Location:
            </label>
            <input
              type="text"
              id="restaurantLocation"
              className="input-field"
              placeholder="Enter location"
              value={restaurantLocation}
              onChange={(e) => setRestaurantLocation(e.target.value)}
            />
          </div>
          <button
            className="btn"
            onClick={handleRegisterRestaurant}
            disabled={isLoading}
          >
            Register Restaurant
          </button>
          {registerStatus && (
            <div className={`status ${registerStatus.type}`}>
              {registerStatus.message}
            </div>
          )}
        </div>

        {/* Submit Review Card */}
        <div className="card" id="reviewForm">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-cyan-500 pb-3">
            ⭐ Submit Review
          </h2>
          <div className="form-group">
            <label htmlFor="reviewRestaurantId" className="label">
              Restaurant ID:
            </label>
            <input
              type="number"
              id="reviewRestaurantId"
              className="input-field"
              placeholder="Enter restaurant ID"
              min="1"
              value={reviewRestaurantId}
              onChange={(e) => setReviewRestaurantId(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="rating-item">
              <label className="label mb-0 mr-2">Food Quality:</label>
              <input
                type="number"
                id="foodQuality"
                className="input-field"
                min="1"
                max="10"
                placeholder="1-10"
                value={foodQuality}
                onChange={(e) => setFoodQuality(e.target.value)}
              />
            </div>
            <div className="rating-item">
              <label className="label mb-0 mr-2">Service:</label>
              <input
                type="number"
                id="service"
                className="input-field"
                min="1"
                max="10"
                placeholder="1-10"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
            </div>
            <div className="rating-item">
              <label className="label mb-0 mr-2">Atmosphere:</label>
              <input
                type="number"
                id="atmosphere"
                className="input-field"
                min="1"
                max="10"
                placeholder="1-10"
                value={atmosphere}
                onChange={(e) => setAtmosphere(e.target.value)}
              />
            </div>
            <div className="rating-item">
              <label className="label mb-0 mr-2">Price/Value:</label>
              <input
                type="number"
                id="priceValue"
                className="input-field"
                min="1"
                max="10"
                placeholder="1-10"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="overallRating" className="label">
              Overall Rating:
            </label>
            <input
              type="number"
              id="overallRating"
              className="input-field"
              min="1"
              max="10"
              placeholder="1-10"
              value={overallRating}
              onChange={(e) => setOverallRating(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reviewComment" className="label">
              Comment:
            </label>
            <textarea
              id="reviewComment"
              className="input-field min-h-[80px] resize-y"
              placeholder="Share your dining experience..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </div>

          <button
            className="btn"
            onClick={handleSubmitReview}
            disabled={isLoading}
          >
            Submit Review
          </button>
          {reviewStatus && (
            <div className={`status ${reviewStatus.type}`}>
              {reviewStatus.message}
            </div>
          )}
        </div>
      </div>

      {/* Restaurants List */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-cyan-500 pb-3">
          🍴 Restaurants
        </h2>
        <button
          className="btn btn-secondary"
          onClick={() => loadRestaurants()}
          disabled={isLoading}
        >
          Load Restaurants
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {restaurants.length === 0 ? (
            <p className="text-gray-600 col-span-full text-center py-8">
              No restaurants found. {walletState.isConnected ? 'Click "Load Restaurants" to fetch data.' : 'Please connect your wallet first.'}
            </p>
          ) : (
            restaurants.map((restaurant) => (
              <div key={restaurant.id} className="restaurant-item">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {restaurant.name}
                </h3>
                <div className="text-gray-600 italic mb-2">
                  📍 {restaurant.location}
                </div>
                <div className="flex justify-between text-gray-700 text-sm mb-2">
                  <span>Reviews: {restaurant.totalReviews}</span>
                  <span>ID: {restaurant.id}</span>
                </div>
                <div className="flex justify-between text-gray-700 text-sm mb-3">
                  <span>
                    Owner: {restaurant.owner.substring(0, 6)}...{restaurant.owner.substring(38)}
                  </span>
                  <span>{restaurant.isActive ? '✅ Active' : '❌ Inactive'}</span>
                </div>
                {reviewedRestaurants.has(restaurant.id) ? (
                  <div className="status info text-sm">
                    You have already reviewed this restaurant
                  </div>
                ) : (
                  <button
                    className="review-btn"
                    onClick={() => fillRestaurantId(restaurant.id)}
                  >
                    Review This Restaurant
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
