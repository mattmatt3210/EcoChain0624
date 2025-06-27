-- AI-Powered Asset Tokenization Platform Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS ai_tokenization_platform;
USE ai_tokenization_platform;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255),
    kyc_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Assets table
CREATE TABLE assets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_name VARCHAR(255) NOT NULL,
    asset_type ENUM('real-estate', 'art', 'intellectual-property', 'commodities', 'vehicles') NOT NULL,
    description TEXT,
    location VARCHAR(255),
    owner_id INT,
    estimated_value DECIMAL(15,2),
    ai_valuation DECIMAL(15,2),
    confidence_score DECIMAL(5,2),
    risk_score DECIMAL(5,2),
    risk_level ENUM('Low', 'Medium', 'High'),
    status ENUM('pending', 'analyzing', 'approved', 'tokenized', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Tokens table
CREATE TABLE tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT,
    contract_address VARCHAR(42),
    token_id VARCHAR(255),
    total_supply BIGINT,
    current_price DECIMAL(15,2),
    market_cap DECIMAL(20,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id)
);

-- AI Analysis History
CREATE TABLE ai_analysis_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT,
    analysis_type ENUM('valuation', 'risk_assessment', 'market_prediction', 'compliance_check'),
    input_data JSON,
    ai_response JSON,
    confidence_score DECIMAL(5,2),
    model_version VARCHAR(50),
    processing_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id)
);

-- Smart Contract Transactions
CREATE TABLE contract_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contract_address VARCHAR(42),
    transaction_hash VARCHAR(66),
    function_name VARCHAR(100),
    parameters JSON,
    gas_used BIGINT,
    gas_price DECIMAL(20,0),
    status ENUM('pending', 'success', 'failed'),
    block_number BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market Data
CREATE TABLE market_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    total_volume DECIMAL(20,2),
    total_assets INT,
    average_price DECIMAL(15,2),
    active_traders INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Model Performance Metrics
CREATE TABLE ai_model_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    model_name VARCHAR(100),
    model_version VARCHAR(50),
    accuracy_score DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    training_date DATE,
    evaluation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compliance Records
CREATE TABLE compliance_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT,
    regulation_type VARCHAR(100),
    compliance_status ENUM('compliant', 'non_compliant', 'pending_review'),
    ai_assessment JSON,
    human_review JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id)
);

-- Create indexes for better performance
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_tokens_contract ON tokens(contract_address);
CREATE INDEX idx_transactions_hash ON contract_transactions(transaction_hash);
CREATE INDEX idx_market_data_date ON market_data(date);
CREATE INDEX idx_ai_analysis_asset ON ai_analysis_history(asset_id);

COMMIT;

SELECT 'Database schema created successfully!' as message;
