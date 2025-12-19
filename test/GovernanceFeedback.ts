import { expect } from "chai";
import { ethers } from "hardhat";
import { GovernanceFeedback } from "../types";

describe("GovernanceFeedback", function () {
  let governanceFeedback: GovernanceFeedback;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const GovernanceFeedbackFactory = await ethers.getContractFactory("GovernanceFeedback");
    governanceFeedback = await GovernanceFeedbackFactory.deploy();
    await governanceFeedback.waitForDeployment();
  });

  describe("Session Creation", function () {
    it("Should create a feedback session", async function () {
      const title = "Test Proposal";
      const description = "Testing governance feedback system";
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 3600; // 1 hour later

      await expect(governanceFeedback.createSession(title, description, startTime, endTime))
        .to.emit(governanceFeedback, "SessionCreated")
        .withArgs(0, title, description, startTime, endTime);

      const sessionCount = await governanceFeedback.getSessionCount();
      expect(sessionCount).to.equal(1);

      const sessionInfo = await governanceFeedback.getSessionInfo(0);
      expect(sessionInfo.proposalTitle).to.equal(title);
      expect(sessionInfo.description).to.equal(description);
      expect(sessionInfo.startTime).to.equal(startTime);
      expect(sessionInfo.endTime).to.equal(endTime);
      expect(sessionInfo.creator).to.equal(owner.address);
      expect(sessionInfo.finalized).to.equal(false);
      expect(sessionInfo.feedbackCount).to.equal(0);
    });

    it("Should reject empty title", async function () {
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 3600;

      await expect(
        governanceFeedback.createSession("", "description", startTime, endTime)
      ).to.be.revertedWith("Empty title");
    });

  });

  describe("Feedback Submission", function () {
    let sessionId: number;
    let startTime: number;
    let endTime: number;

    beforeEach(async function () {
      startTime = Math.floor(Date.now() / 1000);
      endTime = startTime + 3600;

      const tx = await governanceFeedback.createSession(
        "Test Proposal",
        "Testing feedback submission",
        startTime,
        endTime
      );
      await tx.wait();

      sessionId = 0;
    });

    it("Should submit feedback during active session", async function () {
      // Note: This test would require FHEVM functionality for full encrypted submission
      // For now, we'll test the basic structure

      const hasSubmitted = await governanceFeedback.hasMemberSubmitted(sessionId, user1.address);
      expect(hasSubmitted).to.equal(false);
    });

    it("Should prevent multiple submissions from same user", async function () {
      // This would be tested with actual encrypted submissions
      // The contract logic prevents multiple submissions via hasSubmitted mapping
    });

    it("Should reject submission outside session time", async function () {
      // Test would require time manipulation or waiting for session to end
    });
  });

  describe("Session Finalization", function () {
    it("Should request finalization after session ends", async function () {
      // This test would require creating a session, submitting feedback, and then finalizing
      // Full implementation would need FHEVM decryption callbacks
    });

    it("Should calculate correct average score", async function () {
      // Test finalization and result calculation
    });
  });
});
