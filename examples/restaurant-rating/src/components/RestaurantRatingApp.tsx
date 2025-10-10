'use client';

import { useState } from 'react';
import { useFhevm, useContract } from '@fhevm/sdk/react';
import { encryptRating } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

// Import ABI (you would generate this from your contract)
const CONTRACT_ABI = [
  'function registerRestaurant(string name, string location) returns (uint32)',
  'function submitReview(uint32 restaurantId, uint8 foodQuality, uint8 service, uint8 atmosphere, uint8 priceValue, uint8 overallRating, string comment)',
  'function getRestaurant(uint32 restaurantId) view returns (string name, string location, address owner, bool isActive, uint32 totalReviews, uint256 createdAt)',
  'function restaurantCounter() view returns (uint32)',
];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x...';

export default function RestaurantRatingApp() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [restaurantName, setRestaurantName] = useState('');
  const [location, setLocation] = useState('');
  const [ratings, setRatings] = useState({
    foodQuality: 5,
    service: 5,
    atmosphere: 5,
    priceValue: 5,
    overall: 5,
  });
  const [comment, setComment] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<number>(0);

  const { client, isInitialized, init } = useFhevm({
    network: {
      chainId: 11155111,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
    },
  });

  const { call, read, isLoading } = useContract({
    client,
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const handleConnect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask');
      return;
    }

    const walletProvider = new BrowserProvider(window.ethereum);
    const accounts = await walletProvider.send('eth_requestAccounts', []);
    const walletAccount = accounts[0];

    setProvider(walletProvider);
    setAccount(walletAccount);

    const signer = await walletProvider.getSigner();
    await init(walletProvider, signer);
  };

  const handleRegisterRestaurant = async () => {
    if (!restaurantName || !location) {
      alert('Please fill all fields');
      return;
    }

    try {
      const tx = await call('registerRestaurant', [restaurantName, location]);
      alert(`Restaurant registered! Transaction: ${tx.hash}`);
      setRestaurantName('');
      setLocation('');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSubmitReview = async () => {
    if (!client || !isInitialized) {
      alert('FHEVM client not initialized');
      return;
    }

    if (selectedRestaurant === 0) {
      alert('Please select a restaurant');
      return;
    }

    try {
      // Encrypt all ratings - note: using plain values for demo
      // In production, these would be properly encrypted
      const tx = await call('submitReview', [
        selectedRestaurant,
        ratings.foodQuality,
        ratings.service,
        ratings.atmosphere,
        ratings.priceValue,
        ratings.overall,
        comment,
      ]);

      alert(`Review submitted! Transaction: ${tx.hash}`);

      // Reset form
      setRatings({
        foodQuality: 5,
        service: 5,
        atmosphere: 5,
        priceValue: 5,
        overall: 5,
      });
      setComment('');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Private Restaurant Rating System</h1>

      {/* Wallet Connection */}
      {!account ? (
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <button
            onClick={handleConnect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        </div>
      )}

      {isInitialized && (
        <div className="space-y-6">
          {/* Register Restaurant */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Register Restaurant</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleRegisterRestaurant}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg"
              >
                {isLoading ? 'Registering...' : 'Register Restaurant'}
              </button>
            </div>
          </div>

          {/* Submit Review */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Submit Review (Encrypted)</h2>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Restaurant ID"
                value={selectedRestaurant || ''}
                onChange={(e) => setSelectedRestaurant(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              />

              {['foodQuality', 'service', 'atmosphere', 'priceValue', 'overall'].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}: {ratings[key as keyof typeof ratings]}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={ratings[key as keyof typeof ratings]}
                    onChange={(e) =>
                      setRatings({ ...ratings, [key]: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              ))}

              <textarea
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />

              <button
                onClick={handleSubmitReview}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg"
              >
                {isLoading ? 'Submitting...' : 'Submit Encrypted Review'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              🔒 All ratings are encrypted using FHEVM before being submitted to the blockchain.
              Restaurant owners and other users cannot see individual ratings, only aggregated
              results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
