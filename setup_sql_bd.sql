SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Structure de la table `alerts`
--

CREATE TABLE `alerts` (
  `id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `alert_type` varchar(50) DEFAULT NULL,
  `severity` varchar(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `alerts`
--

INSERT INTO `alerts` (`id`, `location_id`, `alert_type`, `severity`, `title`, `description`, `start_time`, `end_time`, `is_active`, `created_at`) VALUES
(1, 1, 'sailing', 'low', 'Safe to sail today', 'Perfect sailing conditions with moderate winds', '2025-10-04 16:45:44', '2025-10-05 16:45:44', 1, '2025-10-04 15:45:44'),
(2, 2, 'wind', 'medium', 'Strong winds tomorrow morning', 'Wind speeds expected to reach 25-30 km/h', '2025-10-05 16:45:44', '2025-10-06 16:45:44', 1, '2025-10-04 15:45:44'),
(3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-10-04 15:53:53'),
(4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-10-04 15:53:58');

-- --------------------------------------------------------

--
-- Structure de la table `chat_history`
--

CREATE TABLE `chat_history` (
  `id` int(11) NOT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `user_message` text DEFAULT NULL,
  `ai_response` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `locations`
--

INSERT INTO `locations` (`id`, `name`, `latitude`, `longitude`, `country`, `region`, `created_at`) VALUES
(1, 'Essaouira', 31.50850000, -9.75950000, 'Morocco', 'Atlantic Coast', '2025-10-04 15:42:54'),
(2, 'Rabat Coast', 33.97160000, -6.84980000, 'Morocco', 'Atlantic Coast', '2025-10-04 15:42:54'),
(3, 'Casablanca Coast', 33.57310000, -7.58980000, 'Morocco', 'Atlantic Coast', '2025-10-04 15:42:54'),
(4, 'Agadir', 30.42780000, -9.59810000, 'Morocco', 'Atlantic Coast', '2025-10-04 15:42:54');

-- --------------------------------------------------------

--
-- Structure de la table `ocean_conditions`
--

CREATE TABLE `ocean_conditions` (
  `id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `time` time DEFAULT NULL,
  `wind_speed` decimal(5,2) DEFAULT NULL,
  `wave_height` decimal(5,2) DEFAULT NULL,
  `sea_surface_temp` decimal(5,2) DEFAULT NULL,
  `air_temp` decimal(5,2) DEFAULT NULL,
  `precipitation` decimal(5,2) DEFAULT NULL,
  `visibility` decimal(5,2) DEFAULT NULL,
  `current_speed` decimal(5,2) DEFAULT NULL,
  `safety_status` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ocean_conditions`
--

INSERT INTO `ocean_conditions` (`id`, `location_id`, `date`, `time`, `wind_speed`, `wave_height`, `sea_surface_temp`, `air_temp`, `precipitation`, `visibility`, `current_speed`, `safety_status`, `created_at`) VALUES
(1, 1, '2025-10-04', '16:43:17', 12.00, 2.50, 18.00, 22.00, NULL, NULL, NULL, 'Safe', '2025-10-04 15:43:17'),
(2, 2, '2025-10-04', '16:43:17', 15.00, 3.00, 19.00, 23.00, NULL, NULL, NULL, 'Caution', '2025-10-04 15:43:17'),
(3, 3, '2025-10-04', '16:43:17', 10.00, 2.00, 18.00, 21.00, NULL, NULL, NULL, 'Safe', '2025-10-04 15:43:17'),
(4, 4, '2025-10-04', '16:43:17', 8.00, 1.50, 20.00, 24.00, NULL, NULL, NULL, 'Safe', '2025-10-04 15:43:17');

-- --------------------------------------------------------

--
-- Structure de la table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `alert_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`alert_types`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`);

--
-- Index pour la table `chat_history`
--
ALTER TABLE `chat_history`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `ocean_conditions`
--
ALTER TABLE `ocean_conditions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_location_date` (`location_id`,`date`);

--
-- Index pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `chat_history`
--
ALTER TABLE `chat_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `ocean_conditions`
--
ALTER TABLE `ocean_conditions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `alerts`
--
ALTER TABLE `alerts`
  ADD CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Contraintes pour la table `ocean_conditions`
--
ALTER TABLE `ocean_conditions`
  ADD CONSTRAINT `ocean_conditions_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Contraintes pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
