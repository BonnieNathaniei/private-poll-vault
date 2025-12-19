import { task } from "hardhat/config";

task("create-session", "Create a new feedback session")
  .addParam("title", "The title of the proposal")
  .addParam("description", "Description of the feedback session")
  .addParam("starttime", "Start time as Unix timestamp")
  .addParam("endtime", "End time as Unix timestamp")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const [deployer] = await ethers.getSigners();

    const GovernanceFeedback = await ethers.getContractFactory("GovernanceFeedback");
    const governanceFeedback = GovernanceFeedback.attach("0xYourContractAddress"); // Replace with actual address

    const tx = await governanceFeedback.createSession(
      taskArgs.title,
      taskArgs.description,
      taskArgs.starttime,
      taskArgs.endtime
    );

    await tx.wait();
    console.log("Session created successfully");
  });

task("get-session-info", "Get information about a feedback session")
  .addParam("sessionid", "The session ID")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const GovernanceFeedback = await ethers.getContractFactory("GovernanceFeedback");
    const governanceFeedback = GovernanceFeedback.attach("0xYourContractAddress"); // Replace with actual address

    const sessionInfo = await governanceFeedback.getSessionInfo(taskArgs.sessionid);
    console.log("Session Info:", sessionInfo);
  });

task("get-session-count", "Get the total number of feedback sessions")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const GovernanceFeedback = await ethers.getContractFactory("GovernanceFeedback");
    const governanceFeedback = GovernanceFeedback.attach("0xYourContractAddress"); // Replace with actual address

    const count = await governanceFeedback.getSessionCount();
    console.log("Total sessions:", count.toString());
  });

task("request-finalize", "Request finalization of a feedback session")
  .addParam("sessionid", "The session ID to finalize")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const GovernanceFeedback = await ethers.getContractFactory("GovernanceFeedback");
    const governanceFeedback = GovernanceFeedback.attach("0xYourContractAddress"); // Replace with actual address

    const tx = await governanceFeedback.requestFinalize(taskArgs.sessionid);
    await tx.wait();
    console.log("Finalization requested successfully");
  });

task("get-results", "Get finalized results of a feedback session")
  .addParam("sessionid", "The session ID")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const GovernanceFeedback = await ethers.getContractFactory("GovernanceFeedback");
    const governanceFeedback = GovernanceFeedback.attach("0xYourContractAddress"); // Replace with actual address

    const results = await governanceFeedback.getResults(taskArgs.sessionid);
    console.log("Results:", {
      totalScore: results[0].toString(),
      feedbackCount: results[1].toString(),
      averageScore: results[2].toString()
    });
  });
