-- EcoChain Platform Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS ecochain_platform;
USE ecochain_platform;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255),
    kyc_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    eco_balance DECIMAL(18,8) DEFAULT 0,
    staked_eco DECIMAL(18,8) DEFAULT 0,
    total_carbon_offset DECIMAL(10,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Eco Actions table
CREATE TABLE eco_actions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action_type ENUM('energy', 'water', 'recycling', 'transport', 'planting') NOT NULL,
    description TEXT,
    eco_reward DECIMAL(10,4),
    carbon_offset DECIMAL(10,6),
    verification_method VARCHAR(255),
    verification_data JSON,
    status ENUM('pending', 'verified', 'rejected', 'completed') DEFAULT 'pending',
    iot_device_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Governance Proposals table
CREATE TABLE governance_proposals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    proposer_id INT,
    category ENUM('rewards', 'partnerships', 'technical', 'governance', 'tokenomics') NOT NULL,
    status ENUM('pending', 'active', 'passed', 'rejected', 'executed') DEFAULT 'pending',
    votes_for BIGINT DEFAULT 0,
    votes_against BIGINT DEFAULT 0,
    quorum_required BIGINT DEFAULT 10000000,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proposer_id) REFERENCES users(id)
);

-- Governance Votes table
CREATE TABLE governance_votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proposal_id INT,
    user_id INT,
    voting_power BIGINT,
    vote_choice BOOLEAN, -- TRUE for 'for', FALSE for 'against'
    transaction_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proposal_id) REFERENCES governance_proposals(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_vote (proposal_id, user_id)
);

-- Utility Payments table
CREATE TABLE utility_payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    provider_name VARCHAR(255),
    amount_usd DECIMAL(10,2),
    eco_tokens_used DECIMAL(18,8),
    exchange_rate DECIMAL(10,6),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    transaction_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Staking Records table
CREATE TABLE staking_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    amount_staked DECIMAL(18,8),
    staking_period_days INT DEFAULT 30,
    apy_rate DECIMAL(5,4),
    rewards_earned DECIMAL(18,8) DEFAULT 0,
    status ENUM('active', 'completed', 'withdrawn') DEFAULT 'active',
    staked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unstaked_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- IoT Device Registrations table
CREATE TABLE iot_devices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INT,
    device_type ENUM('smart_meter', 'water_sensor', 'air_quality', 'solar_panel', 'ev_charger') NOT NULL,
    location VARCHAR(255),
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    last_reading TIMESTAMP,
    calibration_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- IoT Data Readings table
CREATE TABLE iot_readings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id VARCHAR(255),
    reading_type VARCHAR(100),
    value DECIMAL(15,6),
    unit VARCHAR(20),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE,
    eco_reward_calculated DECIMAL(10,4) DEFAULT 0,
    FOREIGN KEY (device_id) REFERENCES iot_devices(device_id)
);

-- Platform Statistics table
CREATE TABLE platform_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    stat_date DATE UNIQUE,
    total_users INT DEFAULT 0,
    total_eco_distributed DECIMAL(20,8) DEFAULT 0,
    total_carbon_offset DECIMAL(15,6) DEFAULT 0,
    total_utility_payments DECIMAL(15,2) DEFAULT 0,
    active_proposals INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_eco_actions_user ON eco_actions(user_id);
CREATE INDEX idx_eco_actions_type ON eco_actions(action_type);
CREATE INDEX idx_eco_actions_status ON eco_actions(status);
CREATE INDEX idx_governance_votes_proposal ON governance_votes(proposal_id);
CREATE INDEX idx_iot_readings_device ON iot_readings(device_id);
CREATE INDEX idx_iot_readings_timestamp ON iot_readings(timestamp);
CREATE INDEX idx_utility_payments_user ON utility_payments(user_id);
CREATE INDEX idx_staking_records_user ON staking_records(user_id);

COMMIT;

SELECT 'EcoChain database schema created successfully!' as message;
