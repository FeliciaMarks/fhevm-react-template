# Private Restaurant Rating System

A confidential dining experience review platform built with Fully Homomorphic Encryption (FHE) technology, ensuring complete privacy for restaurant ratings and reviews.

## 🌟 Overview

The Private Restaurant Rating System revolutionizes how diners share their dining experiences by leveraging cutting-edge homomorphic encryption. Users can submit honest, detailed restaurant reviews while maintaining complete confidentiality of their ratings. Restaurant owners can benefit from aggregate feedback without compromising individual reviewer privacy.

## 🔐 Core Concept

### Fully Homomorphic Encryption (FHE)

This platform utilizes FHE smart contracts to enable computations on encrypted data without ever decrypting it. When users submit ratings for food quality, service, atmosphere, and value, these ratings are encrypted on-chain and remain confidential throughout their lifecycle.

**Key Benefits:**
- **Complete Privacy**: Individual ratings remain encrypted and private
- **Honest Feedback**: Reviewers can provide authentic opinions without fear of retaliation
- **Aggregate Insights**: Restaurant owners can derive meaningful analytics from encrypted data
- **Tamper-Proof**: Blockchain ensures ratings cannot be altered or deleted

### How It Works

1. **Restaurant Registration**: Restaurant owners register their establishments on-chain
2. **Encrypted Reviews**: Diners submit multi-dimensional ratings (food quality, service, atmosphere, price/value) that are automatically encrypted
3. **Privacy-Preserving Analytics**: Aggregate statistics are computed directly on encrypted data
4. **Verifiable Trust**: All interactions are recorded on the blockchain while maintaining confidentiality

## 🎯 Features

### For Reviewers
- Submit comprehensive ratings across multiple dimensions
- Add written comments about dining experiences
- Complete anonymity of individual ratings
- One review per restaurant per user to prevent spam

### For Restaurant Owners
- Register and manage restaurant profiles
- Receive authentic feedback without bias
- Track total review counts
- Build reputation through transparent aggregate metrics

### Multi-Dimensional Rating System
- **Food Quality**: Taste, presentation, freshness
- **Service**: Attentiveness, professionalism, timing
- **Atmosphere**: Ambiance, cleanliness, comfort
- **Price/Value**: Worth for money, portion sizes

## 🏗️ Technical Architecture

### Smart Contract
Built on fhEVM (Fully Homomorphic Encryption Virtual Machine) using Zama's encryption library.

**Contract Address**: `0x0f3e553484dF29aF3423AD6E301b571a255b1142`

### Core Functions
- `registerRestaurant()`: Register a new restaurant with name and location
- `submitReview()`: Submit encrypted ratings and comments
- `getRestaurant()`: Retrieve restaurant details and review count
- `hasReviewed()`: Check if a user has already reviewed a specific restaurant

## 🎬 Demo

**Live Application**: [https://private-restaurant-rating.vercel.app/](https://private-restaurant-rating.vercel.app/)

**PrivateRestaurantRating.mp4**: See the platform in action with a complete walkthrough of restaurant registration, review submission, and privacy features.

## 🚀 Getting Started

### Prerequisites
- MetaMask or compatible Web3 wallet
- Access to Zama fhEVM testnet
- Test tokens for transaction fees

### Using the Platform

1. **Connect Wallet**: Click "Connect Wallet" to link your Web3 wallet
2. **Browse Restaurants**: View registered restaurants and their review counts
3. **Register a Restaurant** (Optional): Add your restaurant to the platform
4. **Submit a Review**: Select a restaurant and provide ratings across all dimensions
5. **View Confirmation**: Receive confirmation that your encrypted review was submitted

## 🔒 Privacy Guarantees

- **End-to-End Encryption**: Ratings are encrypted client-side before submission
- **Zero-Knowledge Computation**: Aggregate statistics computed without decrypting individual data
- **Immutable Records**: Blockchain ensures review integrity
- **No Personal Data Storage**: Only wallet addresses and encrypted ratings are stored

## 🌐 Use Cases

### Restaurant Industry
- Fine dining establishments seeking authentic feedback
- Chain restaurants monitoring service quality across locations
- New restaurants building initial reputation

### Food Tourism
- Travel platforms integrating confidential local recommendations
- Food critics providing unbiased reviews
- Culinary tour operators curating experiences

### Quality Assurance
- Anonymous employee feedback on workplace dining
- Corporate cafeteria improvement programs
- Catering service evaluation

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Blockchain**: Ethereum-compatible fhEVM
- **Encryption**: Zama fhevmjs library
- **Web3**: Ethers.js v5.7.2
- **Deployment**: Vercel

## 📊 Smart Contract Events

- `RestaurantRegistered`: Emitted when a new restaurant is added
- `ReviewSubmitted`: Emitted when an encrypted review is successfully submitted

## 🔗 Links


- **Live Demo**: [https://private-restaurant-rating.vercel.app/](https://private-restaurant-rating.vercel.app/)
- **Zama Documentation**: [https://docs.zama.ai](https://docs.zama.ai)

## 🤝 Contributing

We welcome contributions to enhance the Private Restaurant Rating System! Whether it's adding new features, improving the UI/UX, or optimizing smart contracts, your input is valuable.

## 🙏 Acknowledgments

Built with [Zama's fhEVM](https://docs.zama.ai/fhevm) technology, enabling fully homomorphic encryption on the Ethereum Virtual Machine.

---

**Empowering honest feedback through privacy-preserving technology** 🍽️🔐
