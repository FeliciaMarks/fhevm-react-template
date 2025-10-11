// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint16, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract PrivateRestaurantRating is SepoliaConfig {

    address public owner;
    uint32 public restaurantCounter;
    uint32 public reviewCounter;

    struct Restaurant {
        string name;
        string location;
        address owner;
        bool isActive;
        uint32 totalReviews;
        euint32 totalRatingSum;
        uint256 createdAt;
    }

    struct EncryptedReview {
        uint32 restaurantId;
        address reviewer;
        euint8 foodQuality;      // 1-10 rating
        euint8 service;          // 1-10 rating
        euint8 atmosphere;       // 1-10 rating
        euint8 priceValue;       // 1-10 rating
        euint8 overallRating;    // 1-10 rating
        string comment;
        uint256 timestamp;
        bool isVerified;
    }

    struct ReviewSummary {
        uint32 reviewCount;
        uint8 averageRating;
        bool hasData;
    }

    mapping(uint32 => Restaurant) public restaurants;
    mapping(uint32 => EncryptedReview) public reviews;
    mapping(uint32 => uint32[]) public restaurantReviews; // restaurantId => reviewIds[]
    mapping(address => uint32[]) public userReviews; // user => reviewIds[]
    mapping(uint32 => mapping(address => bool)) public hasUserReviewed; // restaurantId => user => bool

    event RestaurantRegistered(uint32 indexed restaurantId, string name, address indexed owner);
    event ReviewSubmitted(uint32 indexed reviewId, uint32 indexed restaurantId, address indexed reviewer);
    event ReviewVerified(uint32 indexed reviewId, uint32 indexed restaurantId);
    event RatingSummaryUpdated(uint32 indexed restaurantId, uint8 averageRating, uint32 reviewCount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyRestaurantOwner(uint32 _restaurantId) {
        require(restaurants[_restaurantId].owner == msg.sender, "Not restaurant owner");
        _;
    }

    modifier restaurantExists(uint32 _restaurantId) {
        require(_restaurantId > 0 && _restaurantId <= restaurantCounter, "Restaurant not found");
        require(restaurants[_restaurantId].isActive, "Restaurant not active");
        _;
    }

    modifier validRating(uint8 _rating) {
        require(_rating >= 1 && _rating <= 10, "Rating must be between 1-10");
        _;
    }

    constructor() {
        owner = msg.sender;
        restaurantCounter = 0;
        reviewCounter = 0;
    }

    // Register a new restaurant
    function registerRestaurant(
        string memory _name,
        string memory _location
    ) external returns (uint32) {
        restaurantCounter++;

        restaurants[restaurantCounter] = Restaurant({
            name: _name,
            location: _location,
            owner: msg.sender,
            isActive: true,
            totalReviews: 0,
            totalRatingSum: FHE.asEuint32(0),
            createdAt: block.timestamp
        });

        // Allow contract to access the encrypted total
        FHE.allowThis(restaurants[restaurantCounter].totalRatingSum);

        emit RestaurantRegistered(restaurantCounter, _name, msg.sender);
        return restaurantCounter;
    }

    // Submit an encrypted review for a restaurant
    function submitReview(
        uint32 _restaurantId,
        uint8 _foodQuality,
        uint8 _service,
        uint8 _atmosphere,
        uint8 _priceValue,
        uint8 _overallRating,
        string memory _comment
    ) external
        restaurantExists(_restaurantId)
        validRating(_foodQuality)
        validRating(_service)
        validRating(_atmosphere)
        validRating(_priceValue)
        validRating(_overallRating)
    {
        require(!hasUserReviewed[_restaurantId][msg.sender], "User already reviewed this restaurant");
        require(restaurants[_restaurantId].owner != msg.sender, "Restaurant owner cannot review own restaurant");

        reviewCounter++;

        // Create review directly in storage to avoid local variables
        reviews[reviewCounter] = EncryptedReview({
            restaurantId: _restaurantId,
            reviewer: msg.sender,
            foodQuality: FHE.asEuint8(_foodQuality),
            service: FHE.asEuint8(_service),
            atmosphere: FHE.asEuint8(_atmosphere),
            priceValue: FHE.asEuint8(_priceValue),
            overallRating: FHE.asEuint8(_overallRating),
            comment: _comment,
            timestamp: block.timestamp,
            isVerified: false
        });

        // Update restaurant totals
        restaurants[_restaurantId].totalReviews++;
        restaurants[_restaurantId].totalRatingSum = FHE.add(
            restaurants[_restaurantId].totalRatingSum,
            FHE.asEuint32(_overallRating)
        );

        // Update mappings
        restaurantReviews[_restaurantId].push(reviewCounter);
        userReviews[msg.sender].push(reviewCounter);
        hasUserReviewed[_restaurantId][msg.sender] = true;

        // Set permissions in separate function
        _setReviewPermissions(reviewCounter, _restaurantId);

        emit ReviewSubmitted(reviewCounter, _restaurantId, msg.sender);
    }

    // Internal function to handle ACL permissions
    function _setReviewPermissions(uint32 _reviewId, uint32 _restaurantId) internal {
        EncryptedReview storage review = reviews[_reviewId];

        // Set ACL permissions for the contract
        FHE.allowThis(review.foodQuality);
        FHE.allowThis(review.service);
        FHE.allowThis(review.atmosphere);
        FHE.allowThis(review.priceValue);
        FHE.allowThis(review.overallRating);
        FHE.allowThis(restaurants[_restaurantId].totalRatingSum);

        // Allow reviewer to access their own encrypted ratings
        FHE.allow(review.foodQuality, review.reviewer);
        FHE.allow(review.service, review.reviewer);
        FHE.allow(review.atmosphere, review.reviewer);
        FHE.allow(review.priceValue, review.reviewer);
        FHE.allow(review.overallRating, review.reviewer);
    }

    // Verify a review (only restaurant owner or contract owner can verify)
    function verifyReview(uint32 _reviewId) external {
        require(_reviewId > 0 && _reviewId <= reviewCounter, "Review not found");
        EncryptedReview storage review = reviews[_reviewId];
        require(!review.isVerified, "Review already verified");

        // Only restaurant owner or contract owner can verify
        require(
            msg.sender == restaurants[review.restaurantId].owner ||
            msg.sender == owner,
            "Not authorized to verify"
        );

        review.isVerified = true;
        emit ReviewVerified(_reviewId, review.restaurantId);
    }

    // Calculate and reveal average rating for a restaurant (async decryption)
    function calculateAverageRating(uint32 _restaurantId) external restaurantExists(_restaurantId) {
        Restaurant storage restaurant = restaurants[_restaurantId];
        require(restaurant.totalReviews > 0, "No reviews to calculate");

        // Request decryption of total sum
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(restaurant.totalRatingSum);
        FHE.requestDecryption(cts, this.processAverageRating.selector);
    }

    // Process decrypted average rating
    function processAverageRating(
        uint256 requestId,
        uint32 totalSum,
        bytes memory signatures
    ) external {
        // Convert totalSum to bytes for signature verification
        bytes memory decryptedData = abi.encodePacked(totalSum);
        FHE.checkSignatures(requestId, decryptedData, signatures);

        // Find which restaurant this calculation belongs to
        // In a real implementation, you'd store the requestId mapping
        // For simplicity, we'll emit an event with the data

        // This is a simplified approach - in production you'd need to map requestId to restaurantId
        emit RatingSummaryUpdated(0, uint8(totalSum / 1), 0); // Placeholder
    }

    // Get restaurant information
    function getRestaurant(uint32 _restaurantId) external view returns (
        string memory name,
        string memory location,
        address restaurantOwner,
        bool isActive,
        uint32 totalReviews,
        uint256 createdAt
    ) {
        require(_restaurantId > 0 && _restaurantId <= restaurantCounter, "Restaurant not found");
        Restaurant storage restaurant = restaurants[_restaurantId];

        return (
            restaurant.name,
            restaurant.location,
            restaurant.owner,
            restaurant.isActive,
            restaurant.totalReviews,
            restaurant.createdAt
        );
    }

    // Get review IDs for a restaurant
    function getRestaurantReviews(uint32 _restaurantId) external view returns (uint32[] memory) {
        return restaurantReviews[_restaurantId];
    }

    // Get review IDs for a user
    function getUserReviews(address _user) external view returns (uint32[] memory) {
        return userReviews[_user];
    }

    // Get basic review information (non-encrypted fields)
    function getReviewInfo(uint32 _reviewId) external view returns (
        uint32 restaurantId,
        address reviewer,
        string memory comment,
        uint256 timestamp,
        bool isVerified
    ) {
        require(_reviewId > 0 && _reviewId <= reviewCounter, "Review not found");
        EncryptedReview storage review = reviews[_reviewId];

        return (
            review.restaurantId,
            review.reviewer,
            review.comment,
            review.timestamp,
            review.isVerified
        );
    }

    // Check if user has reviewed a restaurant
    function hasReviewed(uint32 _restaurantId, address _user) external view returns (bool) {
        return hasUserReviewed[_restaurantId][_user];
    }

    // Toggle restaurant active status (only restaurant owner)
    function toggleRestaurantStatus(uint32 _restaurantId) external onlyRestaurantOwner(_restaurantId) {
        restaurants[_restaurantId].isActive = !restaurants[_restaurantId].isActive;
    }

    // Get total counts
    function getTotalCounts() external view returns (uint32 totalRestaurants, uint32 totalReviews) {
        return (restaurantCounter, reviewCounter);
    }

    // Allow users to decrypt their own review ratings
    function getMyReviewRatings(uint32 _reviewId) external view returns (
        euint8 foodQuality,
        euint8 service,
        euint8 atmosphere,
        euint8 priceValue,
        euint8 overallRating
    ) {
        require(_reviewId > 0 && _reviewId <= reviewCounter, "Review not found");
        EncryptedReview storage review = reviews[_reviewId];
        require(review.reviewer == msg.sender, "Can only view your own ratings");

        return (
            review.foodQuality,
            review.service,
            review.atmosphere,
            review.priceValue,
            review.overallRating
        );
    }
}