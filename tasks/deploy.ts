import { task } from "hardhat/config";

task("deploy-governance", "Deploy GovernanceFeedback contract")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const GovernanceFeedback = await hre.ethers.getContractFactory("GovernanceFeedback");
    const governanceFeedback = await GovernanceFeedback.deploy();

    await governanceFeedback.waitForDeployment();

    console.log("GovernanceFeedback deployed to:", await governanceFeedback.getAddress());
  });
