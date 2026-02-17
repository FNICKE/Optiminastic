-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 17, 2026 at 09:05 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wallet_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `email`, `created_at`) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Test User', 'test@example.com', '2026-02-17 07:10:46');

-- --------------------------------------------------------

--
-- Table structure for table `ledger_entries`
--

CREATE TABLE `ledger_entries` (
  `id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
  `wallet_id` char(36) NOT NULL,
  `type` enum('credit','debit','order') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `reference_id` char(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ledger_entries`
--

INSERT INTO `ledger_entries` (`id`, `client_id`, `wallet_id`, `type`, `amount`, `reference_id`, `created_at`) VALUES
('32d63a8e-dbcd-4ccc-8710-49a2f96c6953', '550e8400-e29b-41d4-a716-446655440000', 'c7daac11-0bcf-11f1-bd06-f854f651b992', 'order', 100.00, NULL, '2026-02-17 07:14:34'),
('8a328cd3-8de1-414c-a4f6-ac60c9bb79b8', '550e8400-e29b-41d4-a716-446655440000', 'c7daac11-0bcf-11f1-bd06-f854f651b992', 'order', 20.00, NULL, '2026-02-17 07:11:13'),
('9594ff7c-282a-459a-a2c9-044439025ba9', '550e8400-e29b-41d4-a716-446655440000', 'c7daac11-0bcf-11f1-bd06-f854f651b992', 'debit', 10.00, NULL, '2026-02-17 07:55:01'),
('975e7271-45ac-46ba-aa89-eb0bf2b7cced', '550e8400-e29b-41d4-a716-446655440000', 'c7daac11-0bcf-11f1-bd06-f854f651b992', 'order', 20.00, NULL, '2026-02-17 07:59:09'),
('ae18565d-85d3-4056-8e77-16f88794003a', '550e8400-e29b-41d4-a716-446655440000', 'c7daac11-0bcf-11f1-bd06-f854f651b992', 'credit', 250.00, NULL, '2026-02-17 07:24:05'),
('d293f3ec-a77f-4945-bd27-f1fe6efdf5bc', '550e8400-e29b-41d4-a716-446655440000', 'c7daac11-0bcf-11f1-bd06-f854f651b992', 'credit', 1000.00, NULL, '2026-02-17 07:59:59');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('created','fulfilled','failed') DEFAULT 'created',
  `fulfillment_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `client_id`, `amount`, `status`, `fulfillment_id`, `created_at`) VALUES
('1fb9de3f-af21-4983-ac8c-f49bf5d68fc5', '550e8400-e29b-41d4-a716-446655440000', 20.00, 'fulfilled', '101', '2026-02-17 07:11:13'),
('46cca552-bd58-469b-8ae9-b51866e171f9', '550e8400-e29b-41d4-a716-446655440000', 100.00, 'fulfilled', '101', '2026-02-17 07:14:34'),
('c0bad363-b8a4-491e-85b0-28c1cf108313', '550e8400-e29b-41d4-a716-446655440000', 20.00, 'fulfilled', '101', '2026-02-17 07:59:09');

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT 0.00 CHECK (`balance` >= 0),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `client_id`, `balance`, `updated_at`) VALUES
('c7daac11-0bcf-11f1-bd06-f854f651b992', '550e8400-e29b-41d4-a716-446655440000', 2100.00, '2026-02-17 07:59:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wallet_id` (`wallet_id`),
  ADD KEY `idx_ledger_client` (`client_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_orders_client` (`client_id`),
  ADD KEY `idx_orders_status` (`status`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `client_id` (`client_id`),
  ADD KEY `idx_wallet_client` (`client_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  ADD CONSTRAINT `ledger_entries_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ledger_entries_ibfk_2` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
