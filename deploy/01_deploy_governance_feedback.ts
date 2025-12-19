import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  console.log("Deploying GovernanceFeedback contract with account:", deployer);

  const governanceFeedback = await deploy("GovernanceFeedback", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("GovernanceFeedback deployed to:", governanceFeedback.address);

  // Verify contract if not on localhost
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    try {
      await hre.run("verify:verify", {
        address: governanceFeedback.address,
        constructorArguments: [],
      });
    } catch (error) {
      console.log("Verification failed:", error);
    }
  }
};

export default func;
func.tags = ["GovernanceFeedback"];
