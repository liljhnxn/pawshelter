require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function main() {
  const rpcUrl = process.env.BOTCHAIN_RPC_URL || 'https://rpc.botchain.ai';
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const contractAddress = process.env.NEXT_PUBLIC_PAWSHELTER_CONTRACT_ADDRESS || '0xBF87827AF27574Bc6594D18450E1e9b20523B2D6';
  const artifactPath = path.join(__dirname, '../artifacts/contracts/PawShelter.sol/PawShelter.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const pk1 = process.env.PRIVATE_KEY;
  const pk2 = process.env.PRIVATE_KEY_2;
  const pk3 = process.env.PRIVATE_KEY_3;

  if (!pk1 || !pk2 || !pk3) {
    throw new Error('Please configure PRIVATE_KEY, PRIVATE_KEY_2, and PRIVATE_KEY_3 in .env');
  }

  const wallet1 = new ethers.Wallet(pk1, provider);
  const wallet2 = new ethers.Wallet(pk2, provider);
  const wallet3 = new ethers.Wallet(pk3, provider);

  const contract1 = new ethers.Contract(contractAddress, artifact.abi, wallet1);
  const contract2 = new ethers.Contract(contractAddress, artifact.abi, wallet2);
  const contract3 = new ethers.Contract(contractAddress, artifact.abi, wallet3);

  console.log('=== Checking Balances ===');
  const b1 = await provider.getBalance(wallet1.address);
  const b2 = await provider.getBalance(wallet2.address);
  const b3 = await provider.getBalance(wallet3.address);
  console.log(`Wallet 1 (${wallet1.address}): ${ethers.formatEther(b1)} BOT`);
  console.log(`Wallet 2 (${wallet2.address}): ${ethers.formatEther(b2)} BOT`);
  console.log(`Wallet 3 (${wallet3.address}): ${ethers.formatEther(b3)} BOT`);

  const initialPets = await contract1.totalPetsListed();
  console.log(`Initial total pets listed: ${initialPets.toString()}`);

  const results = [];
  const gasPrice = ethers.parseUnits('20', 'gwei');

  // Interaction 1: Wallet 1 lists Pet #1
  console.log('\n--- Interaction 1 (Wallet 1): listPet #1 ---');
  const tx1 = await contract1.listPet(
    'Barnaby',
    'Golden Retriever',
    2,
    'Friendly, affectionate Golden Retriever mix looking for a loving home with a yard.',
    'San Francisco, CA',
    'ipfs://bafybeihdwdcefgh4dqkjv67',
    { gasPrice, gasLimit: 400000 }
  );
  console.log(`Tx1 sent: ${tx1.hash}`);
  const receipt1 = await tx1.wait();
  console.log(`Tx1 confirmed in block ${receipt1.blockNumber} (Gas used: ${receipt1.gasUsed.toString()})`);
  const petId1 = (await contract1.totalPetsListed()).toString();
  results.push({
    interaction: 1,
    action: 'listPet',
    wallet: wallet1.address,
    txHash: tx1.hash,
    blockNumber: receipt1.blockNumber,
    gasUsed: receipt1.gasUsed.toString(),
    details: `Pet #${petId1}: Barnaby (Golden Retriever)`
  });

  // Interaction 2: Wallet 2 expresses interest in Pet #1
  console.log('\n--- Interaction 2 (Wallet 2): expressInterest for Pet #1 ---');
  const tx2 = await contract2.expressInterest(
    petId1,
    'adoptions@botchain.ai',
    'Experienced dog owner with large fenced yard and active outdoor lifestyle.',
    { gasPrice, gasLimit: 400000 }
  );
  console.log(`Tx2 sent: ${tx2.hash}`);
  const receipt2 = await tx2.wait();
  console.log(`Tx2 confirmed in block ${receipt2.blockNumber} (Gas used: ${receipt2.gasUsed.toString()})`);
  results.push({
    interaction: 2,
    action: 'expressInterest',
    wallet: wallet2.address,
    txHash: tx2.hash,
    blockNumber: receipt2.blockNumber,
    gasUsed: receipt2.gasUsed.toString(),
    details: `Expressed interest in Pet #${petId1}`
  });

  // Interaction 3: Wallet 1 approves Wallet 2 as adopter
  console.log('\n--- Interaction 3 (Wallet 1): approveAdopter for Pet #1 ---');
  const tx3 = await contract1.approveAdopter(petId1, wallet2.address, { gasPrice, gasLimit: 400000 });
  console.log(`Tx3 sent: ${tx3.hash}`);
  const receipt3 = await tx3.wait();
  console.log(`Tx3 confirmed in block ${receipt3.blockNumber} (Gas used: ${receipt3.gasUsed.toString()})`);
  results.push({
    interaction: 3,
    action: 'approveAdopter',
    wallet: wallet1.address,
    txHash: tx3.hash,
    blockNumber: receipt3.blockNumber,
    gasUsed: receipt3.gasUsed.toString(),
    details: `Approved ${wallet2.address} for Pet #${petId1}`
  });

  // Interaction 4: Wallet 2 finalizes adoption of Pet #1
  console.log('\n--- Interaction 4 (Wallet 2): markAsAdopted for Pet #1 ---');
  const tx4 = await contract2.markAsAdopted(petId1, { gasPrice, gasLimit: 400000 });
  console.log(`Tx4 sent: ${tx4.hash}`);
  const receipt4 = await tx4.wait();
  console.log(`Tx4 confirmed in block ${receipt4.blockNumber} (Gas used: ${receipt4.gasUsed.toString()})`);
  results.push({
    interaction: 4,
    action: 'markAsAdopted',
    wallet: wallet2.address,
    txHash: tx4.hash,
    blockNumber: receipt4.blockNumber,
    gasUsed: receipt4.gasUsed.toString(),
    details: `Finalized adoption for Pet #${petId1}`
  });

  // Interaction 5: Wallet 3 lists Pet #2
  console.log('\n--- Interaction 5 (Wallet 3): listPet #2 ---');
  const tx5 = await contract3.listPet(
    'Luna',
    'Calico Cat',
    1,
    'Playful indoor kitten vaccinated and litter trained, loves sunny window sills.',
    'Seattle, WA',
    'ipfs://bafybeicatz1234567890',
    { gasPrice, gasLimit: 400000 }
  );
  console.log(`Tx5 sent: ${tx5.hash}`);
  const receipt5 = await tx5.wait();
  console.log(`Tx5 confirmed in block ${receipt5.blockNumber} (Gas used: ${receipt5.gasUsed.toString()})`);
  const petId2 = (await contract3.totalPetsListed()).toString();
  results.push({
    interaction: 5,
    action: 'listPet',
    wallet: wallet3.address,
    txHash: tx5.hash,
    blockNumber: receipt5.blockNumber,
    gasUsed: receipt5.gasUsed.toString(),
    details: `Pet #${petId2}: Luna (Calico Cat)`
  });

  console.log('\n=== Summary of Interactions ===');
  console.log(JSON.stringify(results, null, 2));

  const stats = await contract1.getPlatformStats();
  console.log('\n=== Final PawShelter Stats ===');
  console.log(`Total Pets Listed: ${stats[0].toString()}`);
  console.log(`Total Pets Adopted: ${stats[1].toString()}`);
  console.log(`Total Active Listings: ${stats[2].toString()}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
