const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("CrowdfundingPlatform", function () {
  let crowdfunding;
  let owner;
  let creator;
  let contributor1;
  let contributor2;

  const FUNDING_GOAL = ethers.parseEther("10");
  const DURATION_DAYS = 30;
  const MIN_CONTRIBUTION = ethers.parseEther("0.1");

  beforeEach(async function () {
    [owner, creator, contributor1, contributor2] = await ethers.getSigners();

    const CrowdfundingPlatform = await ethers.getContractFactory("CrowdfundingPlatform");
    crowdfunding = await CrowdfundingPlatform.deploy();
    await crowdfunding.waitForDeployment();
  });

  describe("Campaign Creation", function () {
    it("Should create a campaign successfully", async function () {
      const tx = await crowdfunding.connect(creator).createCampaign(
        "Test Campaign",
        "This is a test campaign description that is long enough to pass validation",
        "ipfs://test",
        FUNDING_GOAL,
        DURATION_DAYS,
        MIN_CONTRIBUTION,
        0
      );

      await expect(tx)
        .to.emit(crowdfunding, "CampaignCreated")
        .withArgs(0, creator.address, "Test Campaign", FUNDING_GOAL, await time.latest() + DURATION_DAYS * 24 * 60 * 60);

      const campaign = await crowdfunding.getCampaign(0);
      expect(campaign.title).to.equal("Test Campaign");
      expect(campaign.creator).to.equal(creator.address);
      expect(campaign.fundingGoal).to.equal(FUNDING_GOAL);
    });

    it("Should fail with empty title", async function () {
      await expect(
        crowdfunding.connect(creator).createCampaign(
          "",
          "Description",
          "ipfs://test",
          FUNDING_GOAL,
          DURATION_DAYS,
          0,
          0
        )
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should fail with zero funding goal", async function () {
      await expect(
        crowdfunding.connect(creator).createCampaign(
          "Test",
          "Description",
          "ipfs://test",
          0,
          DURATION_DAYS,
          0,
          0
        )
      ).to.be.revertedWith("Funding goal must be greater than 0");
    });
  });

  describe("Contributions", function () {
    let campaignId;

    beforeEach(async function () {
      const tx = await crowdfunding.connect(creator).createCampaign(
        "Test Campaign",
        "This is a test campaign description that is long enough to pass validation",
        "ipfs://test",
        FUNDING_GOAL,
        DURATION_DAYS,
        MIN_CONTRIBUTION,
        0
      );
      const receipt = await tx.wait();
      campaignId = 0;
    });

    it("Should allow contributions", async function () {
      const contributionAmount = ethers.parseEther("1");

      await expect(
        crowdfunding.connect(contributor1).contribute(campaignId, { value: contributionAmount })
      ).to.emit(crowdfunding, "ContributionMade")
        .withArgs(campaignId, contributor1.address, contributionAmount, contributionAmount);

      const campaign = await crowdfunding.getCampaign(campaignId);
      expect(campaign.totalRaised).to.equal(contributionAmount);

      const userContribution = await crowdfunding.getContribution(campaignId, contributor1.address);
      expect(userContribution).to.equal(contributionAmount);
    });

    it("Should reject contribution below minimum", async function () {
      const tooSmall = ethers.parseEther("0.05");

      await expect(
        crowdfunding.connect(contributor1).contribute(campaignId, { value: tooSmall })
      ).to.be.revertedWith("Below minimum contribution");
    });

    it("Should reject creator contributing to own campaign", async function () {
      await expect(
        crowdfunding.connect(creator).contribute(campaignId, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Creator cannot contribute to own campaign");
    });

    it("Should mark campaign as successful when goal reached", async function () {
      await crowdfunding.connect(contributor1).contribute(campaignId, { value: FUNDING_GOAL });

      const campaign = await crowdfunding.getCampaign(campaignId);
      expect(campaign.status).to.equal(1); // Successful
    });
  });

  describe("Fund Withdrawal", function () {
    let campaignId;

    beforeEach(async function () {
      await crowdfunding.connect(creator).createCampaign(
        "Test Campaign",
        "This is a test campaign description that is long enough to pass validation",
        "ipfs://test",
        FUNDING_GOAL,
        DURATION_DAYS,
        0,
        0
      );
      campaignId = 0;

      // Contribute to reach goal
      await crowdfunding.connect(contributor1).contribute(campaignId, { value: FUNDING_GOAL });
    });

    it("Should allow creator to withdraw funds from successful campaign", async function () {
      const balanceBefore = await ethers.provider.getBalance(creator.address);

      const tx = await crowdfunding.connect(creator).withdrawFunds(campaignId, 0);
      const receipt = await tx.wait();

      const balanceAfter = await ethers.provider.getBalance(creator.address);

      // Creator should receive funds minus platform fee and gas
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should not allow non-creator to withdraw", async function () {
      await expect(
        crowdfunding.connect(contributor1).withdrawFunds(campaignId, 0)
      ).to.be.revertedWith("Only creator can withdraw");
    });
  });

  describe("Refunds", function () {
    let campaignId;

    beforeEach(async function () {
      await crowdfunding.connect(creator).createCampaign(
        "Test Campaign",
        "This is a test campaign description that is long enough to pass validation",
        "ipfs://test",
        FUNDING_GOAL,
        DURATION_DAYS,
        0,
        0
      );
      campaignId = 0;

      // Contribute but don't reach goal
      await crowdfunding.connect(contributor1).contribute(campaignId, {
        value: ethers.parseEther("5")
      });
    });

    it("Should allow refund after failed campaign", async function () {
      // Fast forward past deadline
      await time.increase(DURATION_DAYS * 24 * 60 * 60 + 1);

      // Finalize campaign
      await crowdfunding.finalizeCampaign(campaignId);

      const balanceBefore = await ethers.provider.getBalance(contributor1.address);

      const tx = await crowdfunding.connect(contributor1).claimRefund(campaignId);
      const receipt = await tx.wait();

      const balanceAfter = await ethers.provider.getBalance(contributor1.address);

      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should not allow refund on active campaign", async function () {
      await expect(
        crowdfunding.connect(contributor1).claimRefund(campaignId)
      ).to.be.revertedWith("Refunds not available");
    });
  });

  describe("Platform Fee", function () {
    it("Should update platform fee", async function () {
      const newFee = 300; // 3%

      await expect(
        crowdfunding.connect(owner).updatePlatformFee(newFee)
      ).to.emit(crowdfunding, "PlatformFeeUpdated")
        .withArgs(newFee);

      const fee = await crowdfunding.platformFeePercentage();
      expect(fee).to.equal(newFee);
    });

    it("Should not allow fee over 5%", async function () {
      await expect(
        crowdfunding.connect(owner).updatePlatformFee(600)
      ).to.be.revertedWith("Fee cannot exceed 5%");
    });
  });
});
