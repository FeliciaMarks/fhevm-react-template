const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(60));
  console.log("Private Restaurant Rating System - Deployment");
  console.log("=".repeat(60));

  // Get the network
  const network = await ethers.provider.getNetwork();
  console.log(`\nDeploying to network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
    console.error("\n❌ Error: Deployer account has no balance!");
    process.exit(1);
  }

  console.log("\n" + "-".repeat(60));
  console.log("Deploying PrivateRestaurantRating contract...");
  console.log("-".repeat(60));

  // Get the contract factory
  const PrivateRestaurantRating = await ethers.getContractFactory("PrivateRestaurantRating");

  // Deploy the contract
  const contract = await PrivateRestaurantRating.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`\n✅ PrivateRestaurantRating deployed to: ${contractAddress}`);

  // Get deployment transaction details
  const deploymentTx = contract.deploymentTransaction();
  if (deploymentTx) {
    console.log(`Transaction hash: ${deploymentTx.hash}`);
    console.log(`Block number: ${deploymentTx.blockNumber}`);
    console.log(`Gas used: ${deploymentTx.gasLimit ? deploymentTx.gasLimit.toString() : "N/A"}`);
  }

  // Verify initial state
  console.log("\n" + "-".repeat(60));
  console.log("Verifying deployment...");
  console.log("-".repeat(60));

  const owner = await contract.owner();
  const restaurantCounter = await contract.restaurantCounter();
  const reviewCounter = await contract.reviewCounter();

  console.log(`Contract owner: ${owner}`);
  console.log(`Initial restaurant counter: ${restaurantCounter}`);
  console.log(`Initial review counter: ${reviewCounter}`);

  // Save deployment information
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    transactionHash: deploymentTx ? deploymentTx.hash : null,
    blockNumber: deploymentTx ? deploymentTx.blockNumber : null,
    owner: owner,
    initialRestaurantCounter: Number(restaurantCounter),
    initialReviewCounter: Number(reviewCounter),
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info to file
  const deploymentFile = path.join(
    deploymentsDir,
    `${network.name}_${Date.now()}.json`
  );
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n📄 Deployment info saved to: ${deploymentFile}`);

  // Save latest deployment info
  const latestFile = path.join(deploymentsDir, `${network.name}_latest.json`);
  fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Latest deployment info saved to: ${latestFile}`);

  // Display Etherscan link (if on Sepolia)
  if (network.chainId === 11155111n) {
    console.log("\n" + "=".repeat(60));
    console.log("📊 Etherscan Links:");
    console.log("=".repeat(60));
    console.log(`Contract: https://sepolia.etherscan.io/address/${contractAddress}`);
    if (deploymentTx) {
      console.log(`Transaction: https://sepolia.etherscan.io/tx/${deploymentTx.hash}`);
    }
    console.log("\n⚠️  Remember to verify the contract source code:");
    console.log(`   npm run verify:sepolia`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Deployment completed successfully!");
  console.log("=".repeat(60));

  return {
    contract,
    contractAddress,
    deploymentInfo,
  };
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

module.exports = { main };
