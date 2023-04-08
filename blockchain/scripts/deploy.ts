import { ethers } from "hardhat";

async function main() {
  const Game = await ethers.getContractFactory("MyToken");
  const game = await Game.deploy();

  await game.deployed();

  console.log(`Contract deployed to ${game.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
