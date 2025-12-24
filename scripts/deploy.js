const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment to", hre.network.name);
  console.log("=====================================");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("=====================================");

  // Deploy CrowdfundingPlatform
  console.log("📦 Deploying CrowdfundingPlatform...");
  const CrowdfundingPlatform = await hre.ethers.getContractFactory("CrowdfundingPlatform");
  const crowdfundingPlatform = await CrowdfundingPlatform.deploy();

  await crowdfundingPlatform.waitForDeployment();
  const contractAddress = await crowdfundingPlatform.getAddress();

  console.log("✅ CrowdfundingPlatform deployed to:", contractAddress);
  console.log("=====================================");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  const deploymentPath = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }

  const filename = `${hre.network.name}-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentPath, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📄 Deployment info saved to:", filename);

  // Update .env.local if it exists
  const envPath = path.join(__dirname, "../.env.local");
  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  // Update or add contract address
  const contractAddressLine = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`;
  if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
      contractAddressLine
    );
  } else {
    envContent += `\n${contractAddressLine}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("✅ Updated .env.local with contract address");
  console.log("=====================================");

  // Wait for block confirmations before verification
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Waiting for 5 block confirmations...");
    await crowdfundingPlatform.deploymentTransaction().wait(5);
    console.log("✅ Confirmations completed");
    console.log("=====================================");

    // Verify contract on Basescan (using Etherscan API V2)
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("🔍 Verifying contract on Basescan...");
      console.log("ℹ️  Using Etherscan API V2 (works for 60+ EVM chains)");
      try {
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: [],
        });
        console.log("✅ Contract verified successfully on Basescan");
      } catch (error) {
        if (error.message.includes("Already Verified")) {
          console.log("ℹ️  Contract already verified");
        } else {
          console.error("❌ Verification failed:", error.message);
        }
      }
    } else {
      console.log("⚠️  Skipping verification (ETHERSCAN_API_KEY not set)");
      console.log("ℹ️  Get your free API key: https://docs.etherscan.io/getting-an-api-key");
    }
  }

  console.log("=====================================");
  console.log("🎉 Deployment completed successfully!");
  console.log("=====================================");
  console.log("📋 Next steps:");
  console.log("1. Update your frontend with the contract address");
  console.log("2. Test the contract on the network");
  console.log("3. Share the contract address with your users");
  console.log("=====================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
