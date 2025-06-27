-- Seed data for AI-Powered Asset Tokenization Platform

USE ai_tokenization_platform;

-- Insert sample users
INSERT INTO users (wallet_address, email, kyc_status) VALUES
('0x742d35Cc6634C0532925a3b8D4C9db96590c6C89', 'investor1@example.com', 'approved'),
('0x8ba1f109551bD432803012645Hac136c22C57B', 'investor2@example.com', 'approved'),
('0x1234567890123456789012345678901234567890', 'investor3@example.com', 'pending'),
('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 'investor4@example.com', 'approved');

-- Insert sample assets
INSERT INTO assets (asset_name, asset_type, description, location, owner_id, estimated_value, ai_valuation, confidence_score, risk_score, risk_level, status) VALUES
('Manhattan Office Complex', 'real-estate', 'Premium office building in downtown Manhattan with 50 floors and modern amenities', 'New York, NY, USA', 1, 2500000.00, 2650000.00, 92.5, 25.0, 'Low', 'tokenized'),
('Picasso Original Painting', 'art', 'Authentic Pablo Picasso painting from the Blue Period, professionally authenticated', 'Paris, France', 2, 1800000.00, 1750000.00, 88.0, 35.0, 'Medium', 'tokenized'),
('Tech Patent Portfolio', 'intellectual-property', 'Collection of 15 AI and blockchain-related patents with strong market potential', 'San Francisco, CA, USA', 1, 1200000.00, 1350000.00, 85.5, 40.0, 'Medium', 'approved'),
('Gold Reserve Vault', 'commodities', '1000 oz of certified gold bars stored in secure Swiss vault', 'Zurich, Switzerland', 3, 950000.00, 980000.00, 95.0, 15.0, 'Low', 'tokenized'),
('Luxury Yacht Collection', 'vehicles', 'Fleet of 3 luxury yachts including 120ft Sunseeker and 90ft Azimut', 'Monaco', 2, 3200000.00, 3100000.00, 90.0, 30.0, 'Medium', 'analyzing');

-- Insert sample tokens
INSERT INTO tokens (asset_id, contract_address, token_id, total_supply, current_price, market_cap) VALUES
(1, '0x742d35Cc6634C0532925a3b8D4C9db96590c6C89', '1', 1000, 2650.00, 2650000.00),
(2, '0x8ba1f109551bD432803012645Hac136c22C57B', '2', 500, 3500.00, 1750000.00),
(4, '0x1234567890123456789012345678901234567890', '4', 200, 4900.00, 980000.00);

-- Insert AI analysis history
INSERT INTO ai_analysis_history (asset_id, analysis_type, input_data, ai_response, confidence_score, model_version, processing_time_ms) VALUES
(1, 'valuation', '{"asset_type": "real-estate", "location": "Manhattan", "size": "50_floors"}', '{"valuation": 2650000, "factors": ["location_premium", "market_conditions", "building_quality"]}', 92.5, 'v2.1.0', 1250),
(2, 'risk_assessment', '{"asset_type": "art", "artist": "Picasso", "period": "Blue"}', '{"risk_score": 35, "factors": ["market_volatility", "authentication_risk", "storage_costs"]}', 88.0, 'v2.1.0', 980),
(3, 'market_prediction', '{"asset_type": "intellectual-property", "tech_sector": "AI_blockchain"}', '{"growth_potential": "high", "market_size": "expanding", "competition": "moderate"}', 85.5, 'v2.1.0', 1500),
(4, 'compliance_check', '{"asset_type": "commodities", "jurisdiction": "Switzerland"}', '{"status": "compliant", "regulations": ["AML", "KYC", "commodity_trading"]}', 95.0, 'v2.1.0', 750);

-- Insert smart contract transactions
INSERT INTO contract_transactions (contract_address, transaction_hash, function_name, parameters, gas_used, gas_price, status, block_number) VALUES
('0x742d35Cc6634C0532925a3b8D4C9db96590c6C89', '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', 'tokenizeAsset', '{"tokenId": 1, "valuation": 2650000, "supply": 1000}', 285000, 20000000000, 'success', 18500123),
('0x8ba1f109551bD432803012645Hac136c22C57B', '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'updateAIValuation', '{"tokenId": 2, "newValuation": 1750000}', 95000, 18000000000, 'success', 18500456),
('0x1234567890123456789012345678901234567890', '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321', 'setAIOracle', '{"tokenId": 4, "oracleAddress": "0xOracle123"}', 120000, 22000000000, 'success', 18500789);

-- Insert market data
INSERT INTO market_data (date, total_volume, total_assets, average_price, active_traders) VALUES
('2024-01-01', 12500000.00, 45, 850000.00, 1050),
('2024-02-01', 15200000.00, 52, 920000.00, 1150),
('2024-03-01', 18700000.00, 61, 980000.00, 1280),
('2024-04-01', 22100000.00, 68, 1050000.00, 1350),
('2024-05-01', 26800000.00, 74, 1120000.00, 1420),
('2024-06-01', 31500000.00, 82, 1180000.00, 1500);

-- Insert AI model performance metrics
INSERT INTO ai_model_metrics (model_name, model_version, accuracy_score, precision_score, recall_score, f1_score, training_date, evaluation_date) VALUES
('Asset_Valuation_Model', 'v2.1.0', 0.9250, 0.9180, 0.9320, 0.9249, '2024-01-15', '2024-06-01'),
('Risk_Assessment_Model', 'v2.0.5', 0.8850, 0.8920, 0.8780, 0.8849, '2024-02-01', '2024-06-01'),
('Market_Prediction_Model', 'v1.8.2', 0.8650, 0.8580, 0.8720, 0.8649, '2024-03-10', '2024-06-01'),
('Compliance_Check_Model', 'v3.0.1', 0.9650, 0.9700, 0.9600, 0.9650, '2024-01-20', '2024-06-01');

-- Insert compliance records
INSERT INTO compliance_records (asset_id, regulation_type, compliance_status, ai_assessment, human_review) VALUES
(1, 'Securities_Regulation', 'compliant', '{"score": 95, "factors": ["proper_documentation", "accredited_investors", "disclosure_complete"]}', '{"reviewer": "Legal_Team", "status": "approved", "notes": "All requirements met"}'),
(2, 'Art_Authentication', 'compliant', '{"score": 88, "factors": ["provenance_verified", "expert_authentication", "insurance_adequate"]}', '{"reviewer": "Art_Expert", "status": "approved", "notes": "Authenticity confirmed"}'),
(3, 'IP_Regulation', 'pending_review', '{"score": 85, "factors": ["patent_validity", "ownership_clear", "licensing_terms"]}', '{"reviewer": "IP_Lawyer", "status": "reviewing", "notes": "Additional documentation requested"}'),
(4, 'Commodity_Trading', 'compliant', '{"score": 98, "factors": ["storage_certified", "purity_verified", "chain_of_custody"]}', '{"reviewer": "Commodity_Expert", "status": "approved", "notes": "Exceeds all standards"}');

COMMIT;

SELECT 'Sample data inserted successfully!' as message;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_assets FROM assets;
SELECT COUNT(*) as total_tokens FROM tokens;
