import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("====================================================");
  console.log("🐾 Deploying PawShelter to Botchain MAINNET (Chain ID: 677)");
  console.log("====================================================");

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer Address: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} BOT`);

  const feeData = await ethers.provider.getFeeData();
  console.log(`Network Gas Price: ${feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, "gwei") : "unknown"} Gwei`);

  // Use the lowest possible gas price (network minimum)
  const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
  console.log(`Using lowest allowed Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`);

  const PawShelter = await ethers.getContractFactory("PawShelter");
  console.log("Submitting deployment transaction with lowest fee...");

  const pawShelter = await PawShelter.deploy({
    gasPrice: gasPrice,
  });

  const deployTx = pawShelter.deploymentTransaction();
  console.log(`Transaction Hash: ${deployTx?.hash}`);
  console.log("Waiting for block confirmation on Botchain Mainnet...");

  await pawShelter.waitForDeployment();
  const contractAddress = await pawShelter.getAddress();

  const receipt = await deployTx?.wait();
  const gasUsed = receipt?.gasUsed || 0n;
  const totalCost = gasUsed * gasPrice;

  console.log("====================================================");
  console.log(`🎉 PawShelter deployed to Botchain Mainnet successfully!`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Gas Used: ${gasUsed.toString()} units`);
  console.log(`Total Fee Paid: ${ethers.formatEther(totalCost)} BOT`);
  console.log(`Block Explorer: https://scan.botchain.ai/address/${contractAddress}`);
  console.log("====================================================");

  // Save to deployed-address-mainnet.json
  const deploymentInfo = {
    address: contractAddress,
    network: "Botchain Mainnet",
    chainId: 677,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    transactionHash: deployTx?.hash,
    gasUsed: gasUsed.toString(),
    gasPriceGwei: ethers.formatUnits(gasPrice, "gwei"),
    totalCostBOT: ethers.formatEther(totalCost),
    explorer: `https://scan.botchain.ai/address/${contractAddress}`,
  };

  const outputPath = path.join(process.cwd(), "deployed-address-mainnet.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Saved deployment info to: ${outputPath}`);

  // Update .env automatically
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    if (envContent.includes("NEXT_PUBLIC_PAWSHELTER_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_PAWSHELTER_CONTRACT_ADDRESS=.*/g,
        `NEXT_PUBLIC_PAWSHELTER_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_PAWSHELTER_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    if (envContent.includes("BOTCHAIN_RPC_URL=")) {
      envContent = envContent.replace(
        /BOTCHAIN_RPC_URL=.*/g,
        `BOTCHAIN_RPC_URL=https://rpc.botchain.ai`
      );
    }
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated .env with mainnet contract address.`);
  }
}

main().catch((error) => {
  console.error("Mainnet deployment failed:", error);
  process.exitCode = 1;
});

