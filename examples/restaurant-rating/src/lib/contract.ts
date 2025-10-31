import { Contract, BrowserProvider } from 'ethers';

export const CONTRACT_ADDRESS = '0x0f3e553484dF29aF3423AD6E301b571a255b1142';

export const CONTRACT_ABI = [
  'function registerRestaurant(string memory _name, string memory _location) external returns (uint32)',
  'function submitReview(uint32 _restaurantId, uint8 _foodQuality, uint8 _service, uint8 _atmosphere, uint8 _priceValue, uint8 _overallRating, string memory _comment) external',
  'function getRestaurant(uint32 _restaurantId) external view returns (string memory name, string memory location, address restaurantOwner, bool isActive, uint32 totalReviews, uint256 createdAt)',
  'function getTotalCounts() external view returns (uint32 totalRestaurants, uint32 totalReviews)',
  'function hasReviewed(uint32 _restaurantId, address _user) external view returns (bool)',
  'event RestaurantRegistered(uint32 indexed restaurantId, string name, address indexed owner)',
  'event ReviewSubmitted(uint32 indexed reviewId, uint32 indexed restaurantId, address indexed reviewer)',
];

export function getContract(provider: BrowserProvider) {
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export async function getContractWithSigner(provider: BrowserProvider) {
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}
