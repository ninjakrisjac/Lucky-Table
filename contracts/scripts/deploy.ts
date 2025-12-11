import { ethers } from "hardhat";

async function main() {
  console.log("Deploying LuckyTable...");

  const LuckyTable = await ethers.getContractFactory("LuckyTable");
  const luckyTable = await LuckyTable.deploy();

  await luckyTable.waitForDeployment();

  const address = await luckyTable.getAddress();
  console.log(`LuckyTable deployed to: ${address}`);
  console.log(`\nVerify with:\nnpx hardhat verify --network sepolia ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

