// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title CrowdfundingPlatform
 * @dev Decentralized crowdfunding platform with milestone-based fund release
 * @notice Allows users to create campaigns, contribute ETH, and manage fund distribution
 */
contract CrowdfundingPlatform is Ownable, ReentrancyGuard, Pausable {

    // Campaign status enumeration
    enum CampaignStatus {
        Active,      // Campaign is accepting contributions
        Successful,  // Campaign reached its goal
        Failed,      // Campaign expired without reaching goal
        Cancelled    // Campaign was cancelled by creator
    }

    // Milestone structure for gradual fund release
    struct Milestone {
        string description;
        uint256 percentage;  // Percentage of funds to release (in basis points, e.g., 2500 = 25%)
        bool released;
    }

    // Campaign structure
    struct Campaign {
        uint256 id;
        address payable creator;
        string title;
        string description;
        string metadataURI;
        uint256 fundingGoal;
        uint256 deadline;
        uint256 totalRaised;
        uint256 minContribution;
        uint256 maxContribution;
        CampaignStatus status;
        uint256 createdAt;
        bool hasMilestones;
        uint256 fundsWithdrawn;
    }

    // State variables
    uint256 private _campaignIdCounter;
    uint256 public platformFeePercentage = 250; // 2.5% in basis points
    uint256 private constant BASIS_POINTS = 10000;

    // Mappings
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Milestone[]) public campaignMilestones;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => address[]) private campaignContributors;
    mapping(address => uint256[]) private userCreatedCampaigns;
    mapping(address => uint256[]) private userContributions;

    // Events
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 fundingGoal,
        uint256 deadline
    );

    event ContributionMade(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount,
        uint256 totalRaised
    );

    event CampaignStatusUpdated(
        uint256 indexed campaignId,
        CampaignStatus status
    );

    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount,
        uint256 milestoneIndex
    );

    event RefundClaimed(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );

    event CampaignUpdated(
        uint256 indexed campaignId,
        string description,
        string metadataURI
    );

    event PlatformFeeUpdated(uint256 newFee);

    event MilestoneReleased(
        uint256 indexed campaignId,
        uint256 milestoneIndex,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Creates a new crowdfunding campaign
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _metadataURI URI for campaign metadata/images
     * @param _fundingGoal Target funding amount in wei
     * @param _durationInDays Campaign duration in days
     * @param _minContribution Minimum contribution amount (0 for no minimum)
     * @param _maxContribution Maximum contribution amount (0 for no maximum)
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _metadataURI,
        uint256 _fundingGoal,
        uint256 _durationInDays,
        uint256 _minContribution,
        uint256 _maxContribution
    ) external whenNotPaused returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_fundingGoal > 0, "Funding goal must be greater than 0");
        require(_durationInDays > 0 && _durationInDays <= 365, "Duration must be between 1-365 days");
        require(_maxContribution == 0 || _maxContribution >= _minContribution, "Invalid contribution limits");

        uint256 campaignId = _campaignIdCounter++;
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);

        campaigns[campaignId] = Campaign({
            id: campaignId,
            creator: payable(msg.sender),
            title: _title,
            description: _description,
            metadataURI: _metadataURI,
            fundingGoal: _fundingGoal,
            deadline: deadline,
            totalRaised: 0,
            minContribution: _minContribution,
            maxContribution: _maxContribution,
            status: CampaignStatus.Active,
            createdAt: block.timestamp,
            hasMilestones: false,
            fundsWithdrawn: 0
        });

        userCreatedCampaigns[msg.sender].push(campaignId);

        emit CampaignCreated(campaignId, msg.sender, _title, _fundingGoal, deadline);

        return campaignId;
    }

    /**
     * @dev Adds milestones to a campaign for gradual fund release
     * @param _campaignId Campaign ID
     * @param _descriptions Array of milestone descriptions
     * @param _percentages Array of percentage values (must sum to 10000 = 100%)
     */
    function addMilestones(
        uint256 _campaignId,
        string[] memory _descriptions,
        uint256[] memory _percentages
    ) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator can add milestones");
        require(campaign.status == CampaignStatus.Active, "Campaign not active");
        require(campaign.totalRaised == 0, "Cannot add milestones after contributions");
        require(_descriptions.length == _percentages.length, "Array length mismatch");
        require(!campaign.hasMilestones, "Milestones already set");

        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < _percentages.length; i++) {
            require(_percentages[i] > 0, "Percentage must be greater than 0");
            totalPercentage += _percentages[i];

            campaignMilestones[_campaignId].push(Milestone({
                description: _descriptions[i],
                percentage: _percentages[i],
                released: false
            }));
        }

        require(totalPercentage == BASIS_POINTS, "Percentages must sum to 100%");
        campaign.hasMilestones = true;
    }

    /**
     * @dev Contribute ETH to a campaign
     * @param _campaignId Campaign ID to contribute to
     */
    function contribute(uint256 _campaignId) external payable nonReentrant whenNotPaused {
        Campaign storage campaign = campaigns[_campaignId];

        require(campaign.status == CampaignStatus.Active, "Campaign not active");
        require(block.timestamp < campaign.deadline, "Campaign deadline passed");
        require(msg.value > 0, "Contribution must be greater than 0");
        require(msg.sender != campaign.creator, "Creator cannot contribute to own campaign");

        if (campaign.minContribution > 0) {
            require(msg.value >= campaign.minContribution, "Below minimum contribution");
        }

        if (campaign.maxContribution > 0) {
            require(
                contributions[_campaignId][msg.sender] + msg.value <= campaign.maxContribution,
                "Exceeds maximum contribution"
            );
        }

        // Track new contributors
        if (contributions[_campaignId][msg.sender] == 0) {
            campaignContributors[_campaignId].push(msg.sender);
            userContributions[msg.sender].push(_campaignId);
        }

        contributions[_campaignId][msg.sender] += msg.value;
        campaign.totalRaised += msg.value;

        emit ContributionMade(_campaignId, msg.sender, msg.value, campaign.totalRaised);

        // Automatically mark as successful if goal reached
        if (campaign.totalRaised >= campaign.fundingGoal) {
            campaign.status = CampaignStatus.Successful;
            emit CampaignStatusUpdated(_campaignId, CampaignStatus.Successful);
        }
    }

    /**
     * @dev Withdraw funds from successful campaign (with or without milestones)
     * @param _campaignId Campaign ID
     * @param _milestoneIndex Milestone index (ignored if no milestones)
     */
    function withdrawFunds(uint256 _campaignId, uint256 _milestoneIndex) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];

        require(msg.sender == campaign.creator, "Only creator can withdraw");
        require(campaign.status == CampaignStatus.Successful, "Campaign not successful");

        uint256 amountToWithdraw;

        if (campaign.hasMilestones) {
            require(_milestoneIndex < campaignMilestones[_campaignId].length, "Invalid milestone");
            Milestone storage milestone = campaignMilestones[_campaignId][_milestoneIndex];
            require(!milestone.released, "Milestone already released");

            amountToWithdraw = (campaign.totalRaised * milestone.percentage) / BASIS_POINTS;
            milestone.released = true;

            emit MilestoneReleased(_campaignId, _milestoneIndex, amountToWithdraw);
        } else {
            require(campaign.fundsWithdrawn == 0, "Funds already withdrawn");
            amountToWithdraw = campaign.totalRaised;
        }

        // Calculate and deduct platform fee
        uint256 platformFee = (amountToWithdraw * platformFeePercentage) / BASIS_POINTS;
        uint256 creatorAmount = amountToWithdraw - platformFee;

        campaign.fundsWithdrawn += amountToWithdraw;

        // Transfer funds
        (bool successCreator, ) = campaign.creator.call{value: creatorAmount}("");
        require(successCreator, "Transfer to creator failed");

        if (platformFee > 0) {
            (bool successOwner, ) = owner().call{value: platformFee}("");
            require(successOwner, "Transfer to owner failed");
        }

        emit FundsWithdrawn(_campaignId, campaign.creator, creatorAmount, _milestoneIndex);
    }

    /**
     * @dev Claim refund for failed or cancelled campaign
     * @param _campaignId Campaign ID
     */
    function claimRefund(uint256 _campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];

        require(
            campaign.status == CampaignStatus.Failed ||
            campaign.status == CampaignStatus.Cancelled,
            "Refunds not available"
        );

        uint256 contributedAmount = contributions[_campaignId][msg.sender];
        require(contributedAmount > 0, "No contribution to refund");

        contributions[_campaignId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: contributedAmount}("");
        require(success, "Refund transfer failed");

        emit RefundClaimed(_campaignId, msg.sender, contributedAmount);
    }

    /**
     * @dev Finalize expired campaign (mark as failed if goal not reached)
     * @param _campaignId Campaign ID
     */
    function finalizeCampaign(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];

        require(campaign.status == CampaignStatus.Active, "Campaign not active");
        require(block.timestamp >= campaign.deadline, "Campaign not expired");

        if (campaign.totalRaised >= campaign.fundingGoal) {
            campaign.status = CampaignStatus.Successful;
        } else {
            campaign.status = CampaignStatus.Failed;
        }

        emit CampaignStatusUpdated(_campaignId, campaign.status);
    }

    /**
     * @dev Cancel campaign (only if no contributions yet)
     * @param _campaignId Campaign ID
     */
    function cancelCampaign(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];

        require(msg.sender == campaign.creator, "Only creator can cancel");
        require(campaign.status == CampaignStatus.Active, "Campaign not active");
        require(campaign.totalRaised == 0, "Cannot cancel campaign with contributions");

        campaign.status = CampaignStatus.Cancelled;
        emit CampaignStatusUpdated(_campaignId, CampaignStatus.Cancelled);
    }

    /**
     * @dev Update campaign metadata (description and URI only)
     * @param _campaignId Campaign ID
     * @param _description New description
     * @param _metadataURI New metadata URI
     */
    function updateCampaign(
        uint256 _campaignId,
        string memory _description,
        string memory _metadataURI
    ) external {
        Campaign storage campaign = campaigns[_campaignId];

        require(msg.sender == campaign.creator, "Only creator can update");
        require(campaign.status == CampaignStatus.Active, "Campaign not active");

        campaign.description = _description;
        campaign.metadataURI = _metadataURI;

        emit CampaignUpdated(_campaignId, _description, _metadataURI);
    }

    // ========== VIEW FUNCTIONS ==========

    /**
     * @dev Get campaign details
     */
    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        return campaigns[_campaignId];
    }

    /**
     * @dev Get campaign milestones
     */
    function getCampaignMilestones(uint256 _campaignId) external view returns (Milestone[] memory) {
        return campaignMilestones[_campaignId];
    }

    /**
     * @dev Get user's contribution to a campaign
     */
    function getContribution(uint256 _campaignId, address _contributor) external view returns (uint256) {
        return contributions[_campaignId][_contributor];
    }

    /**
     * @dev Get all contributors for a campaign
     */
    function getCampaignContributors(uint256 _campaignId) external view returns (address[] memory) {
        return campaignContributors[_campaignId];
    }

    /**
     * @dev Get campaigns created by a user
     */
    function getUserCreatedCampaigns(address _user) external view returns (uint256[] memory) {
        return userCreatedCampaigns[_user];
    }

    /**
     * @dev Get campaigns a user has contributed to
     */
    function getUserContributions(address _user) external view returns (uint256[] memory) {
        return userContributions[_user];
    }

    /**
     * @dev Get total number of campaigns
     */
    function getTotalCampaigns() external view returns (uint256) {
        return _campaignIdCounter;
    }

    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 totalCampaigns,
        uint256 totalFundsRaised,
        uint256 successfulCampaigns
    ) {
        totalCampaigns = _campaignIdCounter;
        totalFundsRaised = 0;
        successfulCampaigns = 0;

        for (uint256 i = 0; i < _campaignIdCounter; i++) {
            totalFundsRaised += campaigns[i].totalRaised;
            if (campaigns[i].status == CampaignStatus.Successful) {
                successfulCampaigns++;
            }
        }
    }

    // ========== ADMIN FUNCTIONS ==========

    /**
     * @dev Update platform fee percentage (only owner)
     * @param _newFeePercentage New fee in basis points (e.g., 250 = 2.5%)
     */
    function updatePlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 500, "Fee cannot exceed 5%");
        platformFeePercentage = _newFeePercentage;
        emit PlatformFeeUpdated(_newFeePercentage);
    }

    /**
     * @dev Pause the contract (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}
