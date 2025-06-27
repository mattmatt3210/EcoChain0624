-- Seed data for EcoChain Platform

USE ecochain_platform;

-- Insert sample users
INSERT INTO users (wallet_address, email, kyc_status, eco_balance, staked_eco, total_carbon_offset) VALUES
('0x742d35Cc6634C0532925a3b8D4C9db96590c6C89', 'eco.warrior@example.com', 'approved', 1247.50000000, 500.00000000, 2.8500),
('0x8ba1f109551bD432803012645Hac136c22C57B', 'green.investor@example.com', 'approved', 2890.75000000, 1200.00000000, 4.2300),
('0x1234567890123456789012345678901234567890', 'climate.activist@example.com', 'approved', 567.25000000, 200.00000000, 1.5600),
('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 'sustainability.expert@example.com', 'approved', 3456.80000000, 800.00000000, 6.7800);

-- Insert sample eco actions
INSERT INTO eco_actions (user_id, action_type, description, eco_reward, carbon_offset, verification_method, status, iot_device_id, verified_at) VALUES
(1, 'energy', 'Reduced electricity usage by 15% this week', 25.0000, 0.120000, 'Smart Meter IoT', 'verified', 'SM001', '2024-06-20 10:30:00'),
(1, 'transport', 'Used public transport for 5 consecutive days', 40.0000, 0.250000, 'GPS Tracking', 'verified', 'GPS001', '2024-06-19 14:15:00'),
(2, 'recycling', 'Recycled 15kg of plastic waste', 30.0000, 0.100000, 'Partner Verification', 'verified', NULL, '2024-06-18 09:45:00'),
(3, 'water', 'Reduced water consumption by 20%', 20.0000, 0.080000, 'Water Sensor IoT', 'verified', 'WS001', '2024-06-17 16:20:00'),
(4, 'planting', 'Planted 10 trees in community garden', 50.0000, 0.350000, 'Photo Verification', 'verified', NULL, '2024-06-16 11:00:00');

-- Insert governance proposals
INSERT INTO governance_proposals (title, description, proposer_id, category, status, votes_for, votes_against, start_date, end_date) VALUES
('Increase Eco Action Rewards by 25%', 'Proposal to increase the $ECO token rewards for verified eco-friendly actions by 25% to incentivize more participation in sustainability initiatives.', 1, 'rewards', 'active', 12500000, 3200000, '2024-06-15 00:00:00', '2024-07-15 23:59:59'),
('Partnership with Tesla for EV Charging', 'Establish a strategic partnership with Tesla to allow $ECO token payments at Supercharger stations, promoting electric vehicle adoption.', 2, 'partnerships', 'active', 8900000, 6100000, '2024-06-20 00:00:00', '2024-07-20 23:59:59'),
('Upgrade to Polygon zkEVM', 'Migrate the platform to Polygon zkEVM for enhanced scalability, lower costs, and improved privacy features.', 4, 'technical', 'passed', 18500000, 2100000, '2024-06-01 00:00:00', '2024-06-30 23:59:59'),
('Implement Carbon Credit Staking', 'Allow users to stake $CCT tokens to earn additional rewards while supporting long-term carbon offset commitments.', 3, 'tokenomics', 'pending', 0, 0, NULL, NULL);

-- Insert governance votes
INSERT INTO governance_votes (proposal_id, user_id, voting_power, vote_choice, transaction_hash) VALUES
(1, 1, 1747, TRUE, '0xvote1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'),
(1, 2, 4090, TRUE, '0xvote567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'),
(2, 1, 1747, FALSE, '0xvote890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234'),
(2, 3, 767, TRUE, '0xvoteabcdef1234567890abcdef1234567890abcdef1234567890abcdef123456'),
(3, 4, 4256, TRUE, '0xvotedef1234567890abcdef1234567890abcdef1234567890abcdef1234567890');

-- Insert utility payments
INSERT INTO utility_payments (user_id, provider_name, amount_usd, eco_tokens_used, exchange_rate, payment_status, transaction_hash) VALUES
(1, 'Green Energy Co.', 125.00, 187.00000000, 0.668449, 'completed', '0xpay1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'),
(1, 'EcoWater Utilities', 89.00, 133.00000000, 0.669173, 'completed', '0xpay567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'),
(2, 'Solar Power Inc.', 156.00, 234.00000000, 0.666667, 'completed', '0xpay890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234'),
(3, 'Wind Energy Corp.', 78.50, 117.00000000, 0.671795, 'completed', '0xpayabcdef1234567890abcdef1234567890abcdef1234567890abcdef123456'),
(4, 'Green Energy Co.', 203.00, 304.00000000, 0.667763, 'completed', '0xpaydef1234567890abcdef1234567890abcdef1234567890abcdef1234567890');

-- Insert staking records
INSERT INTO staking_records (user_id, amount_staked, staking_period_days, apy_rate, rewards_earned, status, staked_at) VALUES
(1, 500.00000000, 30, 0.1250, 23.50000000, 'active', '2024-05-20 10:00:00'),
(2, 1200.00000000, 90, 0.1350, 89.25000000, 'active', '2024-04-15 14:30:00'),
(3, 200.00000000, 30, 0.1250, 8.75000000, 'active', '2024-06-01 09:15:00'),
(4, 800.00000000, 60, 0.1300, 45.60000000, 'active', '2024-05-10 16:45:00');

-- Insert IoT devices
INSERT INTO iot_devices (device_id, user_id, device_type, location, status, last_reading, calibration_date) VALUES
('SM001', 1, 'smart_meter', 'New York, NY', 'active', '2024-06-21 08:00:00', '2024-01-15 10:00:00'),
('WS001', 3, 'water_sensor', 'San Francisco, CA', 'active', '2024-06-21 07:45:00', '2024-02-20 14:30:00'),
('GPS001', 1, 'ev_charger', 'New York, NY', 'active', '2024-06-20 18:30:00', '2024-03-10 11:15:00'),
('AQ001', 2, 'air_quality', 'Los Angeles, CA', 'active', '2024-06-21 09:15:00', '2024-01-25 09:00:00'),
('SP001', 4, 'solar_panel', 'Phoenix, AZ', 'active', '2024-06-21 12:00:00', '2024-04-05 13:20:00');

-- Insert IoT readings
INSERT INTO iot_readings (device_id, reading_type, value, unit, timestamp, processed, eco_reward_calculated) VALUES
('SM001', 'energy_consumption', 245.750000, 'kWh', '2024-06-21 08:00:00', TRUE, 25.0000),
('SM001', 'energy_consumption', 238.200000, 'kWh', '2024-06-20 08:00:00', TRUE, 22.0000),
('WS001', 'water_usage', 1250.500000, 'liters', '2024-06-21 07:45:00', TRUE, 20.0000),
('GPS001', 'distance_traveled', 45.200000, 'km', '2024-06-20 18:30:00', TRUE, 40.0000),
('AQ001', 'pm2.5_level', 12.300000, 'μg/m³', '2024-06-21 09:15:00', FALSE, 0.0000),
('SP001', 'energy_generated', 156.750000, 'kWh', '2024-06-21 12:00:00', TRUE, 35.0000);

-- Insert platform statistics
INSERT INTO platform_stats (stat_date, total_users, total_eco_distributed, total_carbon_offset, total_utility_payments, active_proposals) VALUES
('2024-06-01', 45892, 12500000.00000000, 8934567.500000, 1250000.00, 3),
('2024-06-15', 47234, 13200000.00000000, 9245678.750000, 1340000.00, 2),
('2024-06-21', 48567, 13850000.00000000, 9567890.250000, 1420000.00, 2);

COMMIT;

SELECT 'EcoChain sample data inserted successfully!' as message;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_eco_actions FROM eco_actions;
SELECT COUNT(*) as total_proposals FROM governance_proposals;
SELECT COUNT(*) as total_iot_devices FROM iot_devices;
