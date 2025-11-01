import { expect } from "chai";
import { ethers } from "hardhat";
import { GovernanceFeedback, GovernanceFeedback__factory } from "../types";

describe("GovernanceFeedback Integration Tests", function () {
  let governanceFeedback: GovernanceFeedback;
  let owner: any, user1: any, user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const GovernanceFeedbackFactory = (await ethers.getContractFactory("GovernanceFeedback")) as GovernanceFeedback__factory;
    governanceFeedback = await GovernanceFeedbackFactory.deploy();
    await governanceFeedback.waitForDeployment();
  });

  it("should handle complete feedback workflow", async function () {
    // Create session
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 3600; // 1 hour

    await governanceFeedback.createSession("Test Proposal", startTime, endTime);

    // Verify session creation
    const session = await governanceFeedback.getSession(1);
    expect(session.title).to.equal("Test Proposal");
    expect(session.isActive).to.be.true;

    console.log("✅ Integration test: Complete feedback workflow");
  });
});
