// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title EcoChain Token Contract
 * @dev ERC20 token for the EcoChain sustainability platform
 * Features: Eco action rewards, staking, governance, utility payments
 */
contract EcoChain is ERC20, Ownable, ReentrancyGuard, Pausable {
    
    // Token configuration
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant COMMUNITY_REWARDS_ALLOCATION = 400_000_000 * 10**18; // 40%
    uint256 public constant ECOSYSTEM_DEVELOPMENT_ALLOCATION = 300_000_000 * 10**18; // 30%
    uint256 public constant INVESTOR_ALLOCATION = 200_000_000 * 10**18; // 20%
    uint256 public constant TEAM_ALLOCATION = 100_000_000 * 10**18; // 10%
    
    // Staking configuration
    uint256 public stakingAPY = 1250; // 12.50% (basis points)
    uint256 public constant MIN_STAKE_AMOUNT = 100 * 10**18; // 100 ECO minimum
    uint256 public constant STAKING_PERIOD = 30 days;
    
    // Eco action tracking
    struct EcoAction {
        address user;
        string actionType;
        uint256 reward;
        uint256 carbonOffset;
        uint256 timestamp;
        bool verified;
    }
    
    // Staking tracking
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastRewardTime;
        uint256 accumulatedRewards;
    }
    
    // Governance
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    // State variables
    mapping(address => StakeInfo) public stakes;
    mapping(address => uint256) public ecoActionCount;
    mapping(address => uint256) public totalCarbonOffset;
    mapping(address => bool) public authorizedRewarders;
    mapping(uint256 => Proposal) public proposals;
    
    EcoAction[] public ecoActions;
    uint256 public totalStaked;
    uint256 public totalRewardsDistributed;
    uint256 public proposalCount;
    uint256 public constant PROPOSAL_DURATION = 7 days;
    uint256 public constant QUORUM_PERCENTAGE = 10; // 10% of total supply
    
    // Events
    event EcoActionRewarded(address indexed user, string actionType, uint256 reward, uint256 carbonOffset);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event StakingRewardsClaimed(address indexed user, uint256 rewards);
    event ProposalCreated(uint256 indexed proposalId, string title, address proposer);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event UtilityPayment(address indexed user, string provider, uint256 amount);
    
    constructor() ERC20("EcoChain", "ECO") {
        _mint(msg.sender, TOTAL_SUPPLY);
        authorizedRewarders[msg.sender] = true;
    }
    
    // Eco Action Rewards
    function rewardEcoAction(
        address user,
        string memory actionType,
        uint256 rewardAmount,
        uint256 carbonOffset
    ) external onlyAuthorizedRewarder whenNotPaused {
        require(user != address(0), "Invalid user address");
        require(rewardAmount > 0, "Reward must be positive");
        require(balanceOf(address(this)) >= rewardAmount, "Insufficient contract balance");
        
        _transfer(address(this), user, rewardAmount);
        
        ecoActions.push(EcoAction({
            user: user,
            actionType: actionType,
            reward: rewardAmount,
            carbonOffset: carbonOffset,
            timestamp: block.timestamp,
            verified: true
        }));
        
        ecoActionCount[user]++;
        totalCarbonOffset[user] += carbonOffset;
        totalRewardsDistributed += rewardAmount;
        
        emit EcoActionRewarded(user, actionType, rewardAmount, carbonOffset);
    }
    
    // Staking Functions
    function stakeTokens(uint256 amount) external nonReentrant whenNotPaused {
        require(amount >= MIN_STAKE_AMOUNT, "Amount below minimum stake");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Claim any pending rewards first
        if (stakes[msg.sender].amount > 0) {
            _claimStakingRewards(msg.sender);
        }
        
        _transfer(msg.sender, address(this), amount);
        
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].startTime = block.timestamp;
        stakes[msg.sender].lastRewardTime = block.timestamp;
        totalStaked += amount;
        
        emit TokensStaked(msg.sender, amount);
    }
    
    function unstakeTokens(uint256 amount) external nonReentrant whenNotPaused {
        require(stakes[msg.sender].amount >= amount, "Insufficient staked amount");
        require(
            block.timestamp >= stakes[msg.sender].startTime + STAKING_PERIOD,
            "Staking period not completed"
        );
        
        // Claim rewards before unstaking
        _claimStakingRewards(msg.sender);
        
        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;
        
        _transfer(address(this), msg.sender, amount);
        
        emit TokensUnstaked(msg.sender, amount);
    }
    
    function claimStakingRewards() external nonReentrant whenNotPaused {
        _claimStakingRewards(msg.sender);
    }
    
    function _claimStakingRewards(address user) internal {
        StakeInfo storage stake = stakes[user];
        require(stake.amount > 0, "No tokens staked");
        
        uint256 timeStaked = block.timestamp - stake.lastRewardTime;
        uint256 rewards = (stake.amount * stakingAPY * timeStaked) / (365 days * 10000);
        
        if (rewards > 0) {
            stake.accumulatedRewards += rewards;
            stake.lastRewardTime = block.timestamp;
            
            // Mint new tokens as staking rewards
            _mint(user, rewards);
            
            emit StakingRewardsClaimed(user, rewards);
        }
    }
    
    // Governance Functions
    function createProposal(
        string memory title,
        string memory description
    ) external returns (uint256) {
        require(balanceOf(msg.sender) >= 1000 * 10**18, "Minimum 1000 ECO required to propose");
        
        proposalCount++;
        Proposal storage proposal = proposals[proposalCount];
        proposal.id = proposalCount;
        proposal.title = title;
        proposal.description = description;
        proposal.endTime = block.timestamp + PROPOSAL_DURATION;
        
        emit ProposalCreated(proposalCount, title, msg.sender);
        return proposalCount;
    }
    
    function vote(uint256 proposalId, bool support) external {
        require(proposalId <= proposalCount && proposalId > 0, "Invalid proposal");
        require(block.timestamp < proposals[proposalId].endTime, "Voting period ended");
        require(!proposals[proposalId].hasVoted[msg.sender], "Already voted");
        
        uint256 votingPower = balanceOf(msg.sender) + stakes[msg.sender].amount;
        require(votingPower > 0, "No voting power");
        
        proposals[proposalId].hasVoted[msg.sender] = true;
        
        if (support) {
            proposals[proposalId].votesFor += votingPower;
        } else {
            proposals[proposalId].votesAgainst += votingPower;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votingPower);
    }
    
    // Utility Payment Function
    function payUtilityBill(
        string memory provider,
        uint256 amount
    ) external whenNotPaused {
        require(amount > 0, "Amount must be positive");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _burn(msg.sender, amount);
        
        emit UtilityPayment(msg.sender, provider, amount);
    }
    
    // Admin Functions
    function setAuthorizedRewarder(address rewarder, bool authorized) external onlyOwner {
        authorizedRewarders[rewarder] = authorized;
    }
    
    function setStakingAPY(uint256 newAPY) external onlyOwner {
        require(newAPY <= 5000, "APY cannot exceed 50%"); // Max 50% APY
        stakingAPY = newAPY;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= balanceOf(address(this)), "Insufficient contract balance");
        _transfer(address(this), owner(), amount);
    }
    
    // View Functions
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 pendingRewards,
        uint256 accumulatedRewards
    ) {
        StakeInfo storage stake = stakes[user];
        amount = stake.amount;
        startTime = stake.startTime;
        accumulatedRewards = stake.accumulatedRewards;
        
        if (stake.amount > 0) {
            uint256 timeStaked = block.timestamp - stake.lastRewardTime;
            pendingRewards = (stake.amount * stakingAPY * timeStaked) / (365 days * 10000);
        }
    }
    
    function getEcoActionHistory(address user) external view returns (
        uint256 actionCount,
        uint256 totalRewards,
        uint256 totalCarbon
    ) {
        actionCount = ecoActionCount[user];
        totalCarbon = totalCarbonOffset[user];
        
        for (uint256 i = 0; i < ecoActions.length; i++) {
            if (ecoActions[i].user == user) {
                totalRewards += ecoActions[i].reward;
            }
        }
    }
    
    function getProposalInfo(uint256 proposalId) external view returns (
        string memory title,
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 endTime,
        bool executed
    ) {
        require(proposalId <= proposalCount && proposalId > 0, "Invalid proposal");
        Proposal storage proposal = proposals[proposalId];
        
        return (
            proposal.title,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.endTime,
            proposal.executed
        );
    }
    
    function getPlatformStats() external view returns (
        uint256 totalSupply_,
        uint256 totalStaked_,
        uint256 totalRewards,
        uint256 totalActions,
        uint256 totalProposals
    ) {
        return (
            totalSupply(),
            totalStaked,
            totalRewardsDistributed,
            ecoActions.length,
            proposalCount
        );
    }
    
    // Modifiers
    modifier onlyAuthorizedRewarder() {
        require(authorizedRewarders[msg.sender], "Not authorized to reward");
        _;
    }
    
    // Override required by Solidity
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
