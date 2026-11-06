import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("----------------------------------------------------");
  console.log("🐾 Deploying PawShelter Contract to Botchain Testnet");
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} ETH`);

  const PawShelter = await ethers.getContractFactory("PawShelter");
  console.log("Deploying contract...");
  const pawShelter = await PawShelter.deploy();

  await pawShelter.waitForDeployment();
  const contractAddress = await pawShelter.getAddress();

  console.log("----------------------------------------------------");
  console.log(`✅ PawShelter deployed successfully!`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Block Explorer: https://scan.bohr.life/address/${contractAddress}`);
  console.log("----------------------------------------------------");

  // Save the address to a deployed-address.json file for frontend convenience
  const deploymentInfo = {
    address: contractAddress,
    network: "Botchain Testnet",
    chainId: 968,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  const outputPath = path.join(process.cwd(), "deployed-address.json");
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
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated .env with NEXT_PUBLIC_PAWSHELTER_CONTRACT_ADDRESS=${contractAddress}`);
  }

  // Seed with initial example pets if on testnet or local hardhat
  const networkName = (await ethers.provider.getNetwork()).name;
  console.log(`Connected network: ${networkName}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
