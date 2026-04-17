-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:3306
-- Létrehozás ideje: 2026. Ápr 17. 09:07
-- Kiszolgáló verziója: 10.11.16-MariaDB-cll-lve
-- PHP verzió: 8.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `kisalla9_webshop`
--
CREATE DATABASE IF NOT EXISTS `kisalla9_webshop` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `kisalla9_webshop`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `alkategoriak`
--

CREATE TABLE `alkategoriak` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `kategoria_id` tinyint(3) UNSIGNED NOT NULL,
  `slug` varchar(50) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `kep` varchar(255) DEFAULT NULL,
  `sorrend` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `alkategoriak`
--

INSERT INTO `alkategoriak` (`id`, `kategoria_id`, `slug`, `nev`, `kep`, `sorrend`) VALUES
(1, 1, 'poraz', 'Pórázok', 'https://media.zooplus.com/bilder/4/400/472900_pla_flexi_blackdesign_l_tape_5m_silver_hs_01_4.jpg', 1),
(2, 1, 'tal', 'Tálak', 'https://media.zooplus.com/bilder/9/400/348296_tiaki_feeding_bowl_1600_ml_functional_fg_2323_9.jpg', 2),
(3, 1, 'ham', 'Hámok', 'https://media.zooplus.com/bilder/3/400/65897_pla_julius_hs_01_3.jpg', 3),
(4, 1, 'bolha', 'Bolha- és kullancsírtók', 'https://petnet_images.storage.googleapis.com/small300/16/1678424950.webp', 4),
(5, 1, 'nyakorv', 'Nyakörvek', 'https://media.zooplus.com/bilder/4/400/_dsc9109_4.jpg', 5),
(6, 1, 'tap', 'Tápok', 'https://media.zooplus.com/bilder/2/400/82043_pla_brit_premiumbynature_sensitive_lamb_15kg_3_2.jpg', 6),
(7, 2, 'jatek', 'Játékok', 'https://media.zooplus.com/bilder/5/400/55406_PLA_Katzenspielzeug_Set_mit_Baellen___Maeusen_FG_DSC0362_5.jpg', 1),
(8, 2, 'tal', 'Tálak', 'https://media.zooplus.com/bilder/1/400/67333_pla_sincerepet_napf_little_fish_fg_7648_3_1.jpg', 2),
(10, 2, 'bolha', 'Bolhaírtó szerek', 'https://petnet_images.storage.googleapis.com/small300/17/1743380528.webp', 4),
(12, 2, 'tapm', 'Macska tápok', 'https://media.zooplus.com/bilder/2/400/324997_pla_nestle_purinaone_sterilcat_lachs_750g_hs_01_2.jpg', 6),
(13, 3, 'tap', 'Rágcsáló tápok', 'https://media.zooplus.com/bilder/6/400/63357_pla_versele_laga_cuni_adult_complete_kaninchen_1_75kg_hs_1_1_6.jpg', 1),
(14, 3, 'ketrec', 'Ketrec és felszerelések', 'https://media.zooplus.com/bilder/1/400/18817_PLA_skyline_Kleintierkaefig_Maxi_XXL_blau_1.jpg', 2),
(15, 3, 'alom', 'Almok', 'https://media.zooplus.com/bilder/6/400/64250_PLA_petlife_safebed_paper_shavings_6.jpg', 3),
(16, 3, 'jatek', 'Játékok', 'https://media.zooplus.com/bilder/2/400/84602_pla_jr_farm_baelle_set_2.jpg', 4),
(17, 4, 'tap', 'Hüllő tápok', 'https://petnet_images.storage.googleapis.com/small300/14/1449708035.webp', 1),
(18, 4, 'terrarium', 'Terrárium és felszerelések', 'https://petnet_images.storage.googleapis.com/small300/30/3095exoterraglassterrarium30x30x45cm02.webp', 2),
(19, 4, 'lampa', 'Melegítő lámpák', 'https://petnet_images.storage.googleapis.com/small300/13/1388329196.webp', 3),
(20, 5, 'tap', 'Madár tápok', 'https://media.zooplus.com/bilder/6/400/38434_pla_prestige_wellensittich_4kg_6.jpg?width=400&format=webp', 1),
(21, 5, 'ketrec', 'Kalitkák', 'https://media.zooplus.com/bilder/4/400/369411_pla_tiaki_grand_espace_fg_0239_4.jpg', 2),
(22, 5, 'jatek', 'Játékok', 'https://media.zooplus.com/bilder/3/400/377917_pla_tiaki_bird_ladder_fg_9871_3.jpg', 3),
(23, 6, 'tap', 'Hal tápok', 'https://media.zooplus.com/bilder/4/400/7741_pla_tetra_aqua_hs_01_4.jpg', 1),
(24, 6, 'akvariumok', 'Akvárium és felszerelések', 'https://petnet_images.storage.googleapis.com/small300/16/1601224421.webp', 2),
(25, 6, 'szuro', 'Szűrők és tartozékok', 'https://petnet_images.storage.googleapis.com/small300/97/970crystal3.webp', 3),
(27, 4, 'vitaminok', 'Vitaminok', 'https://petnet_images.storage.googleapis.com/small300/14/1491170594.webp', 4);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `fal_bejegyzesek`
--

CREATE TABLE `fal_bejegyzesek` (
  `id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `szoveg` text NOT NULL,
  `letrehozva` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `fal_bejegyzesek`
--

INSERT INTO `fal_bejegyzesek` (`id`, `felhasznalo_id`, `szoveg`, `letrehozva`) VALUES
(1, 9, 'Ez egy teszt bejegyzes a falon!', '2026-01-01 19:38:44'),
(2, 9, 'Remek üzlet csak ajánlani tudom.', '2026-01-01 19:43:21');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `felhasznalonev` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `jelszo_hash` varchar(255) NOT NULL,
  `keresztnev` varchar(100) DEFAULT NULL,
  `vezeteknev` varchar(100) DEFAULT NULL,
  `telefon` varchar(30) DEFAULT NULL,
  `iranyitoszam` varchar(20) DEFAULT NULL,
  `varos` varchar(100) DEFAULT NULL,
  `cim` text DEFAULT NULL,
  `admin` tinyint(1) DEFAULT 0,
  `tiltva` tinyint(1) NOT NULL DEFAULT 0,
  `tiltas_oka` varchar(255) DEFAULT NULL,
  `email_megerositve` tinyint(1) DEFAULT 0,
  `regisztralt` timestamp NOT NULL DEFAULT current_timestamp(),
  `frissitve` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`id`, `felhasznalonev`, `email`, `jelszo_hash`, `keresztnev`, `vezeteknev`, `telefon`, `iranyitoszam`, `varos`, `cim`, `admin`, `tiltva`, `tiltas_oka`, `email_megerositve`, `regisztralt`, `frissitve`) VALUES
(1, 'teszt_user_999', 'teszt999@example.com', '$2y$10$CIYycBAxXpK5sEm2nizFR.hw6j/SaPiQNt3eYe/Y2PMnwXbNVzN3.', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, 0, '2025-12-27 19:39:17', '2026-03-12 20:21:04'),
(2, 'e2e_20251228_135002', 'e2e_20251228_135002@example.com', '$2y$10$CIYycBAxXpK5sEm2nizFR.hw6j/SaPiQNt3eYe/Y2PMnwXbNVzN3.', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, 0, '2025-12-28 12:50:02', '2026-03-17 20:39:37'),
(5, 'order_20251228_135749', 'order_20251228_135749@example.com', '$2y$10$CIYycBAxXpK5sEm2nizFR.hw6j/SaPiQNt3eYe/Y2PMnwXbNVzN3.', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, 0, '2025-12-28 12:57:49', '2026-03-12 20:21:04'),
(9, 'akos@akos.hu', 'akos@akos.hu', '$2y$10$CIYycBAxXpK5sEm2nizFR.hw6j/SaPiQNt3eYe/Y2PMnwXbNVzN3.', 'akos@akos.hu', 'akos@akos.hu', 'akos@akos.hu', 'akos@akos.hu', 'akos@akos.hu', 'akos@akos.hu', 1, 0, NULL, 0, '2025-12-28 15:14:51', '2026-03-12 20:21:04'),
(10, 'test_admin_20260101143216', 'test_admin_20260101143216@test.hu', '$2y$10$CIYycBAxXpK5sEm2nizFR.hw6j/SaPiQNt3eYe/Y2PMnwXbNVzN3.', 'Test', 'Admin', NULL, NULL, NULL, NULL, 0, 0, NULL, 0, '2026-01-01 13:32:16', '2026-03-12 20:21:04'),
(16, 'nubsos123@gmail.com', 'nubsos123@gmail.com', '$2y$10$oqc755AZ9.iX5E/zGObJ2OQyCR3aPqrTOFKyYE8VJKDisSVAmoKP.', 'Lajos', 'Lajos', '06701234567', 'qq', 'qq', 'qq', 0, 0, NULL, 0, '2026-03-18 06:47:22', '2026-04-14 20:52:11'),
(18, 'TesztElek', 'teszte@gmail.hu', '$2y$10$7i91Vh8wP0ZFNEnaAreb6eBFL18qrwXLPBA3TzU94RPLJY7aNQi7K', 'Elek', 'Teszt', '+36 30 123 4567', '1234', 'Kukutyin', 'Világvége utca 1.', 0, 0, NULL, 0, '2026-03-24 11:18:21', '2026-03-24 11:18:21'),
(19, 'testuser', 'test@user.hu', '$2y$10$TMpdD55iThzMPP2mT9n98OHQDIjEOP.JhuUTK3RziG/yHuUAg4mru', 'User', 'Test', '+36 30 123 4567', '1234', 'Budapest', 'Teszt utca 1.', 0, 0, NULL, 0, '2026-03-29 11:32:13', '2026-04-08 10:51:37'),
(20, 'martin', 'martin@martin.hu', '$2y$10$IdYQyTjiVGUypbHpibvNReTVhlMSWKjvIFgukyi1kfpNa8Si/Vx8O', NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, NULL, 0, '2026-04-14 20:57:36', '2026-04-14 20:57:40'),
(21, 'dominika', 'dominika@dominika.hu', '$2y$10$IdYQyTjiVGUypbHpibvNReTVhlMSWKjvIFgukyi1kfpNa8Si/Vx8O', NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, NULL, 0, '2026-04-14 20:57:36', '2026-04-14 20:57:40');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jelszo_reset`
--

CREATE TABLE `jelszo_reset` (
  `id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `kod` varchar(6) NOT NULL,
  `lejar` datetime NOT NULL,
  `felhasznalva` tinyint(4) DEFAULT 0,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `jelszo_reset`
--

INSERT INTO `jelszo_reset` (`id`, `felhasznalo_id`, `kod`, `lejar`, `felhasznalva`, `letrehozva`) VALUES
(6, 9, '719427', '2026-01-02 18:04:47', 0, '2026-01-02 16:49:47'),
(20, 16, '781334', '2026-04-14 23:06:32', 1, '2026-04-14 20:51:32');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoriak`
--

CREATE TABLE `kategoriak` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `slug` varchar(30) NOT NULL,
  `nev` varchar(50) NOT NULL,
  `kep` varchar(255) DEFAULT NULL,
  `sorrend` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `kategoriak`
--

INSERT INTO `kategoriak` (`id`, `slug`, `nev`, `kep`, `sorrend`) VALUES
(1, 'kutya', 'Kutya', 'img/kutya.png', 1),
(2, 'macska', 'Macska', 'img/macska.png', 2),
(3, 'ragcsalo', 'Rágcsáló', 'img/ragcsalo.png', 3),
(4, 'hullo', 'Hüllő', 'img/hullo.png', 4),
(5, 'madar', 'Madár', 'img/madar.png', 5),
(6, 'hal', 'Hal', 'img/hal.png', 6);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kosar`
--

CREATE TABLE `kosar` (
  `felhasznalo_id` bigint(20) UNSIGNED NOT NULL,
  `termek_id` int(10) UNSIGNED NOT NULL,
  `mennyiseg` smallint(5) UNSIGNED NOT NULL DEFAULT 1,
  `hozzaadva` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kuponok`
--

CREATE TABLE `kuponok` (
  `id` int(11) NOT NULL,
  `kod` varchar(50) NOT NULL,
  `tipus` enum('szazalek','fix') DEFAULT 'szazalek',
  `ertek` decimal(10,2) NOT NULL,
  `min_osszeg` decimal(10,2) DEFAULT 0.00,
  `felhasznalasi_limit` int(11) DEFAULT NULL,
  `felhasznalva` int(11) DEFAULT 0,
  `felhasznalo_id` int(11) DEFAULT NULL,
  `ervenyes_kezdet` datetime DEFAULT current_timestamp(),
  `ervenyes_veg` datetime DEFAULT NULL,
  `aktiv` tinyint(1) DEFAULT 1,
  `letrehozva` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `kuponok`
--

INSERT INTO `kuponok` (`id`, `kod`, `tipus`, `ertek`, `min_osszeg`, `felhasznalasi_limit`, `felhasznalva`, `felhasznalo_id`, `ervenyes_kezdet`, `ervenyes_veg`, `aktiv`, `letrehozva`) VALUES
(1, 'HUSEG05', 'szazalek', 0.51, 0.00, 1, 0, NULL, '2026-01-02 13:49:03', '2026-01-04 13:16:00', 0, '2026-01-02 13:49:03'),
(4, 'nyar', 'fix', 1500.00, 2000.00, NULL, 0, NULL, '2026-03-18 07:57:14', '2026-03-22 11:56:00', 1, '2026-03-18 07:57:14');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kupon_hasznalatok`
--

CREATE TABLE `kupon_hasznalatok` (
  `id` int(11) NOT NULL,
  `kupon_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `rendeles_id` int(11) DEFAULT NULL,
  `hasznalva` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendelesek`
--

CREATE TABLE `rendelesek` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `felhasznalo_id` bigint(20) UNSIGNED NOT NULL,
  `rendeles_szam` varchar(30) NOT NULL,
  `statusz` enum('uj','feldolgozas','fizetve','kesz','storno') DEFAULT 'uj',
  `osszeg` int(10) UNSIGNED NOT NULL,
  `szallitasi_mod` varchar(100) DEFAULT NULL,
  `fizetesi_mod` varchar(100) DEFAULT NULL,
  `megjegyzes` text DEFAULT NULL,
  `szallitasi_nev` varchar(200) DEFAULT NULL,
  `szallitasi_cim` text DEFAULT NULL,
  `szallitasi_varos` varchar(100) DEFAULT NULL,
  `szallitasi_irsz` varchar(20) DEFAULT NULL,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp(),
  `frissitve` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `rendelesek`
--

INSERT INTO `rendelesek` (`id`, `felhasznalo_id`, `rendeles_szam`, `statusz`, `osszeg`, `szallitasi_mod`, `fizetesi_mod`, `megjegyzes`, `szallitasi_nev`, `szallitasi_cim`, `szallitasi_varos`, `szallitasi_irsz`, `letrehozva`, `frissitve`) VALUES
(5, 9, 'ORD-20260101-9A5EAE', 'kesz', 35960, 'Hazhozszallitas', 'Utanvet', '', 'anya', 'anyaanya', 'anya', 'anyaanya', '2026-01-01 18:04:41', '2026-03-31 05:52:57'),
(6, 9, 'ORD-20260102-3BB8BB', 'storno', 8990, 'Szemelyes atvetel', 'Bankkartya', 'lol', 'anya', 'anya', 'anya', 'anya', '2026-01-02 14:02:59', '2026-03-31 05:52:32'),
(9, 9, 'ORD-20260206-5B2A42', 'uj', 2500, 'Házhozszállítás', 'Utánvét', '', 'anya', 'anya', 'anya', 'ANYA', '2026-02-06 17:11:17', '2026-02-06 17:11:17'),
(13, 9, 'ORD-20260312-69A314', 'kesz', 8888, 'GLS futar', 'Bankkartya', '', 'sfgsds', 'sgsdgs', 'sdgsg', 'gds', '2026-03-12 20:44:06', '2026-03-31 05:52:29'),
(14, 9, 'ORD-20260312-B0FFD1', 'feldolgozas', 8990, 'GLS futar', 'Bankkartya', '', 'dfhdfd', 'dhhdf', 'hdhdh', 'hdhdhdfdf', '2026-03-12 21:28:43', '2026-03-31 05:52:26'),
(17, 9, 'ORD-20260317-017760', 'fizetve', 5678, 'GLS futar', 'Bankkartya', '', 'ewsdgsd', 'sgsg', 'gsdsdg', 'gsdgsdgsd', '2026-03-17 21:30:40', '2026-03-31 05:52:22'),
(18, 9, 'ORD-20260318-A3F277', 'kesz', 5678, 'GLS futar', 'Bankkartya', '', 'eteg', '852', 'wefghj', '132', '2026-03-18 06:26:50', '2026-03-31 05:52:20'),
(21, 9, 'ORD-20260321-67B71A', 'storno', 69488, 'Foxpost', 'Bankkartya', '', 'Ggh', 'Sz', 'Budapest ', '7uiz', '2026-03-21 11:09:58', '2026-03-31 05:52:14'),
(22, 18, 'ORD-20260324-4C387A', 'feldolgozas', 20550, 'Foxpost', 'Bankkartya', '', 'Teszt Elek', 'Világvége utca 1.', 'Kukutyin', '1234', '2026-03-24 11:21:56', '2026-03-25 09:34:25'),
(23, 9, 'ORD-20260328-C38A64', 'uj', 8990, 'GLS futar', 'Bankkartya', '', 'dfghjklé', '454', 'sdfghjk', '4210', '2026-03-28 15:40:44', '2026-03-28 15:40:44'),
(24, 9, 'ORD-20260330-53C24F', 'fizetve', 17980, 'GLS futar', 'Bankkartya', '', 'uzhsdfiuha', 'sdsdgds', 'dfadgsd', 'asfdsfs', '2026-03-30 16:31:33', '2026-03-31 05:52:07'),
(25, 9, 'ORD-20260414-8761AB', 'uj', 25600, 'GLS futar', 'Bankkartya', '', 'Minta Péter', 'Utca 1', 'Budapest', '1234', '2026-04-14 19:49:12', '2026-04-14 19:49:12');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles_tetelek`
--

CREATE TABLE `rendeles_tetelek` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rendeles_id` bigint(20) UNSIGNED NOT NULL,
  `termek_id` int(10) UNSIGNED NOT NULL,
  `termek_nev` varchar(255) NOT NULL,
  `ar` int(10) UNSIGNED NOT NULL,
  `mennyiseg` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `rendeles_tetelek`
--

INSERT INTO `rendeles_tetelek` (`id`, `rendeles_id`, `termek_id`, `termek_nev`, `ar`, `mennyiseg`) VALUES
(5, 5, 4, 'Rukka Kötélpóráz', 8990, 4),
(6, 6, 4, 'Rukka Kötélpóráz', 8990, 1),
(15, 14, 4, 'Rukka Kötélpóráz', 8990, 1),
(19, 17, 10, 'Teszt Termek 5', 5678, 1),
(20, 18, 10, 'Teszt Termek 5', 5678, 1),
(24, 21, 61, 'Smilla Sterilised gabonamentes lazac', 13000, 2),
(25, 21, 38, 'flexi New Classic szalagpóráz', 10100, 1),
(26, 21, 10, 'flexi Giant szalagpóráz', 12199, 2),
(27, 21, 4, 'Rukka Cord Tec póráz', 8990, 1),
(28, 22, 95, 'TIAKI természetes juta ülőrúd 1,9x45 cm', 2390, 4),
(29, 22, 88, 'Versele-Laga Prestige Papagáj 2x3kg', 10990, 1),
(30, 23, 4, 'Rukka Cord Tec póráz', 8990, 1),
(31, 24, 4, 'Rukka Cord Tec póráz', 8990, 2),
(32, 25, 114, 'Royal Canin Veterinary Canine Early Renal', 11710, 1),
(33, 25, 53, 'Brit Premium by Nature Adult Large', 13890, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE `termekek` (
  `id` int(10) UNSIGNED NOT NULL,
  `alkategoria_id` smallint(5) UNSIGNED NOT NULL,
  `nev` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `leiras` text DEFAULT NULL,
  `rovid_leiras` varchar(500) DEFAULT NULL,
  `ar` int(10) UNSIGNED NOT NULL,
  `akcios_ar` int(10) UNSIGNED DEFAULT NULL,
  `keszlet` int(10) UNSIGNED DEFAULT 999,
  `fo_kep` varchar(255) NOT NULL,
  `tobbi_kep` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tobbi_kep`)),
  `aktiv` tinyint(1) DEFAULT 1,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp(),
  `frissitve` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `termekek`
--

INSERT INTO `termekek` (`id`, `alkategoria_id`, `nev`, `slug`, `leiras`, `rovid_leiras`, `ar`, `akcios_ar`, `keszlet`, `fo_kep`, `tobbi_kep`, `aktiv`, `letrehozva`, `frissitve`) VALUES
(1, 6, 'Royal Canin Mini Adult', 'royal-canin-mini-adult', NULL, 'Prémium kutyatáp kistestű felnőtt kutyáknak', 6290, 4490, 46, 'https://media.zooplus.com/bilder/2/400/rc_shn_miniadult_mv_1_2.jpg?width=400&format=webp', '[]', 1, '2025-12-27 16:22:32', '2026-03-20 18:13:14'),
(2, 6, 'bosch Maxi Adult', 'bosch-adult-menue', NULL, 'Kiváló ár-érték arányú kutyatáp.', 18990, 0, 99, 'https://media.zooplus.com/bilder/1/400/70115_pla_bosch_maxiadult_15kg_2_1.jpg', '[]', 1, '2025-12-27 16:22:32', '2026-03-18 14:31:27'),
(3, 3, 'JULIUS-K9 Erőhám', 'julius-k9-eroharm', NULL, 'Profi kutyahám erős kutyáknak.', 15990, 13990, 30, 'https://media.zooplus.com/bilder/1/400/536296_pla_juliusk9_idc_hs_01_1.jpg?width=400&format=webp', '[]', 1, '2025-12-27 16:22:32', '2026-03-18 15:05:10'),
(4, 1, 'Rukka Cord Tec póráz', 'rukka-kotelpraz', NULL, 'Állítható kötélpóráz nagy kutyáknak', 8990, 0, 30, 'https://media.zooplus.com/bilder/9/400/598996_pla_rukka_cord_tec_lash_hs_01_9.jpg?width=400&format=webp', '[]', 1, '2025-12-27 16:22:32', '2026-03-30 16:31:33'),
(5, 2, 'Trixie kerámiatál, fekete', 'trixie-keramia-tal-szett', NULL, 'Elegáns kerámia tál kutyáknak. 400 ml, Ø 13 cm.', 1490, 0, 25, 'https://media.zooplus.com/bilder/4/400/611352_611353_pla_trixie_keramik_napf_schwarz_hs_01_4.jpg?width=400&format=webp', '[]', 1, '2025-12-27 16:22:32', '2026-03-18 15:02:04'),
(6, 12, 'Felix Fantastic Junior', 'felix-fantastic', NULL, 'Nedves macskatáp kölyök cicáknak.', 9160, 8560, 199, 'https://media.zooplus.com/bilder/9/400/171105_pla_nestlegermaindc_felix_sogut_junior_pouches_48x85g_hs_01_9.jpg', '[]', 1, '2025-12-27 16:22:32', '2026-03-20 18:41:06'),
(7, 7, 'KONG Kickeroo', 'kong-kickeroo', NULL, 'Népszerű macskajáték.', 4990, 3990, 58, 'https://media.zooplus.com/bilder/2/400/26806_PLA_Kong_Kickeroo_Giraffe_136111_kong_kickeroo_1_2.jpg?width=400&format=webp', '[]', 1, '2025-12-27 16:22:32', '2026-03-18 15:05:55'),
(8, 4, 'Frontline Combo', 'frontline-tri-act', NULL, 'Frontline Combo spot-on kullancs, bolha és tetvek ellen kutyáknak L 20-40kg 3db.', 8590, 0, 80, 'https://www.fressnapf.hu/img/86560/1396896/1396896.webp', '[]', 1, '2025-12-27 16:22:32', '2026-03-20 17:34:48'),
(9, 15, 'Petlife Safebed alom papírpehely', 'petlife-safebed-papirpehely', NULL, 'Alom növényi rostokból bármely rágcsálónak.', 3390, 0, 3, 'https://media.zooplus.com/bilder/6/400/64250_PLA_petlife_safebed_paper_shavings_6.jpg?width=400&format=webp', '[]', 1, '2025-12-27 16:22:32', '2026-03-18 14:42:01'),
(10, 1, 'flexi Giant szalagpóráz', 'teszt-termek-5', NULL, 'L, fekete/neonsárga, 8 m. Automata szalagpóráz max 50kg testtömegű kutyáknak.', 12199, 0, 110, 'https://media.zooplus.com/bilder/5/400/347496_pla_hundeleine_flexi_giantl_8m_hs_02_5.jpg?width=400&format=webp', '[]', 1, '2025-12-28 17:15:33', '2026-03-21 11:09:58'),
(11, 3, 'Feel Free puha kutyahám', 'we4twe', NULL, 'Hám kutyáknak kicsi önsúllyal, fényvisszaverő csíkokkal, optimális illeszkedési formával, enyhe nyúlású, nagyon stabil és lélegző, állítható tépőzárakkal, könnyű ráadni a kutyára; anyaga poliészter.', 4200, 0, 150, 'https://media.zooplus.com/bilder/4/400/46438_PLA_Hunde_Softgeschirr_Feel_Free___schwarz_M_FG_DSC8526_4.jpg?width=400&format=webp', '[]', 1, '2025-12-28 18:01:11', '2026-03-18 13:34:06'),
(12, 2, 'TIAKI Functional rozsdamentes acéltál', '222', NULL, 'Strapabíró etetőtál kutyáknak, fényes rozsdamentes acélból.', 1100, 0, 19, 'https://media.zooplus.com/bilder/9/400/348296_tiaki_feeding_bowl_1600_ml_functional_fg_2323_9.jpg?width=400&format=webp', '[]', 1, '2025-12-28 18:20:39', '2026-03-18 15:00:32'),
(13, 3, 'Trixie autós kutyahám', '2', NULL, 'Övhám kutyáknak, ideális autóban való biztonságos rögzítésre, vezetőhámként is használható, nyaknál-hasnál állítható, biztonsági övvel együtt (állítható), a legtöbb biztonsági öv csatjához illeszkedik.', 3600, 2499, 22, 'https://media.zooplus.com/bilder/3/400/839_840_12145_pla_trixie_auto_geschirr_f_r_hunde_hs1_3.jpg?width=400&format=webp', '[]', 1, '2025-12-28 18:21:45', '2026-03-18 13:37:24'),
(32, 4, 'Frontline Tri-Act', 'ham', NULL, 'L-es kutyáknak 20-40 kg között. A doboz 3 rácsepegetőt tartalmaz.', 9400, 0, 24, 'https://www.fressnapf.hu/img/86560/1245691/1000x1000/1245691.webp?time=1748602997', '[]', 1, '2026-03-17 20:39:14', '2026-03-20 17:35:46'),
(33, 15, 'Hugro RODIFLAX len alom', 'hugro-rodiflax-len-alom', NULL, 'Környezetbarát natúr alom kisállatoknak, 100% natúr lenből.', 5099, 4799, 16, 'https://media.zooplus.com/bilder/6/400/436096_pla_hugro_rodiflax_flachsstreu_leinenstreu_hs_01_6.jpg?width=400&format=webp', '[]', 1, '2026-03-18 14:43:21', '2026-03-18 14:43:21'),
(34, 15, 'Hugro kókuszalom', 'hugro-kokuszalom', NULL, 'Kiváló minőségű alom kisállatok és hüllők számára.', 9300, 0, 107, 'https://media.zooplus.com/bilder/4/400/504496_pla_hugro_kokosstreu_hs_01_4.jpg?width=400&format=webp', '[]', 1, '2026-03-18 14:45:13', '2026-03-18 14:45:13'),
(35, 13, 'Versele-Laga Cuni Adult Complete', 'versele-laga-cuni-adult-complete', NULL, 'Extrudált teljes értékű nyúleledel a Versele-Laga-tól őröletlen rostokkal.', 4299, 0, 120, 'https://media.zooplus.com/bilder/6/400/63357_pla_versele_laga_cuni_adult_complete_kaninchen_1_75kg_hs_1_1_6.jpg?width=400&format=webp', '[]', 1, '2026-03-18 14:46:42', '2026-03-18 14:46:42'),
(36, 13, 'Versele-Laga Crispy müzli nyulaknak', 'versele-laga-crispy-muzli-nyulaknak', NULL, 'Teljes értékű müzli törpenyulaknak magas rosttartalommal, minőségi magvakkal, zöldséggel, pelletekkel gazdagítva.', 3299, 2699, 45, 'https://media.zooplus.com/bilder/5/400/54014_PLA_Versele_Laga_Crispy_Muesli_Kaninchen_2_75kg_5.jpg?width=400&format=webp', '[]', 1, '2026-03-18 14:48:13', '2026-03-18 14:48:13'),
(37, 13, 'Vitakraft Menü Vital törpehörcsögeledel', 'vitakraft-menu-vital-torpehorcsogeledel', NULL, 'Fajnak megfelelő, komplett eledel törpehörcsögöknek, értékes, természetes alapanyagokból.', 1090, 0, 23, 'https://media.zooplus.com/bilder/2/400/513596_pla_vitakraft_menu_vital_zwerghamster_hs_01_2.jpg?width=400&format=webp', '[]', 1, '2026-03-18 14:50:16', '2026-03-18 14:54:12'),
(38, 1, 'flexi New Classic szalagpóráz', 'flexi-new-classic-szalagporaz', NULL, 'L, fekete, 8 m. Hosszú szalagpóráz kutyáknak, maximum 50 kg testsúlyig.', 10100, 0, 119, 'https://media.zooplus.com/bilder/4/400/198005_pla_flexi_newclassic_gurtleine_l_schwarz_hs_02_4.jpg?width=400&format=webp', '[]', 1, '2026-03-18 14:56:32', '2026-03-21 11:09:58'),
(39, 2, 'TIAKI Duo etetőállvány 2 kerámiatállal', 'tiaki-duo-etetoallvany-2-keramiatallal', NULL, 'Etetőpult kistestű kutyáknak, két higiénikus kerámiatállal, megemelt pozíció a kényelmes táplálkozásért.', 9300, 0, 130, 'https://media.zooplus.com/bilder/0/400/302496_pla_tiaki_napf_duo_grau_fg_6145_0.jpg?width=400&format=webp', '[]', 1, '2026-03-18 15:03:56', '2026-03-18 15:03:56'),
(40, 4, 'Advantix spot-on (4-10kg) x4', 'advantix-spot-on', NULL, 'Hatásos a bolhák, kullancsok, igazi szúnyogok, lepkeszúnyogok, szuronyos istállólegyek és szőrtetvek ellen.', 12990, 0, 15, 'https://www.fressnapf.hu/img/86560/1245257/496x496,r/1245257.webp?time=1744010996', '[]', 1, '2026-03-20 17:38:07', '2026-03-20 17:41:17'),
(41, 4, 'Advantix spot-on (<4kg) x4', 'advantix-spot-on-4kg-x4', NULL, 'Hatásos a bolhák, kullancsok, igazi szúnyogok, lepkeszúnyogok, szuronyos istállólegyek és szőrtetvek ellen.', 12000, 0, 24, 'https://www.fressnapf.hu/img/86560/1266255/1000x1000/1266255.webp?time=1743751473', '[]', 1, '2026-03-20 17:40:00', '2026-03-20 17:41:58'),
(42, 4, 'Advantix spot-on (10-25kg) 4x', 'advantix-spot-on-10-25kg-4x', NULL, 'Hatásos a bolhák, kullancsok, igazi szúnyogok, lepkeszúnyogok, szuronyos istállólegyek és szőrtetvek ellen.', 13900, 0, 8, 'https://www.fressnapf.hu/img/86560/1245258/1000x1000/1245258.webp?time=1744010996', '[]', 1, '2026-03-20 17:43:17', '2026-03-20 17:43:17'),
(43, 4, 'Advantix spot-on (25-40kg) 4x', 'advantix-spot-on-25-40kg-4x', NULL, 'Hatásos a bolhák, kullancsok, igazi szúnyogok, lepkeszúnyogok, szuronyos istállólegyek és szőrtetvek ellen.', 15100, 0, 10, 'https://www.fressnapf.hu/img/86560/1245259/1000x1000/1245259.webp?time=1744010996', '[]', 1, '2026-03-20 17:44:46', '2026-03-20 17:44:46'),
(44, 4, 'Advantix spot-on (40-60kg) 4x', 'advantix-spot-on-40-60kg-4x', NULL, 'Hatásos a bolhák, kullancsok, igazi szúnyogok, lepkeszúnyogok, szuronyos istállólegyek és szőrtetvek ellen.', 17000, 0, 5, 'https://www.fressnapf.hu/img/86560/1295842/1000x1000/1295842.webp?time=1744010997', '[]', 1, '2026-03-20 17:46:01', '2026-03-20 17:46:01'),
(45, 10, 'Advantage spot-on <4kg 1x', 'advantage-bolha-elleni-spot-on-4kg-1x', NULL, 'Rácsepegtető oldat macskák és nyulak bolhásságának megelőzésére és kezelésére.', 2500, 0, 13, 'https://www.fressnapf.hu/img/86560/1266258/1000x1000/1266258.webp?time=1744010997', '[]', 1, '2026-03-20 17:49:52', '2026-03-20 17:52:03'),
(46, 10, 'Advantage spot-on 4-8kg 1x', 'advantage-spot-on-4-8kg-1x', NULL, 'Rácsepegtető oldat macskák és nyulak bolhásságának megelőzésére és kezelésére.', 2700, 0, 24, 'https://www.fressnapf.hu/img/86560/1266259/1000x1000/1266259.webp?time=1744010997', '[]', 1, '2026-03-20 17:51:48', '2026-03-20 17:51:48'),
(47, 10, 'AdTab  12mg (0,5-2kg)', 'adtab-12mg', NULL, 'Kullancs, bolha és tetvek elleni rágótabletta macskák részére 1 hónapos védelem.', 3200, 0, 26, 'https://www.fressnapf.hu/img/86560/1658250/1000x1000/1658250.webp?time=1732196945', '[]', 1, '2026-03-20 17:55:35', '2026-03-20 18:00:41'),
(48, 10, 'AdTab 48mg (2-8kg)', 'adtab-48mg-2-8kg', NULL, 'Kullancs, bolha és tetvek elleni rágótabletta macskák részére 1 hónapos védelem.', 3600, 0, 26, 'https://www.fressnapf.hu/img/86560/1658251/496x496,r/1658251.webp?time=1732196944', '[]', 1, '2026-03-20 18:00:30', '2026-03-20 18:00:30'),
(49, 5, 'Trixie Premium fojtó nyakörv, fekete', 'trixie-premium-fojto-nyakorv-fekete', NULL, 'S–M méret: 30–40 cm nyakkörfogat, Sz 15 mm.', 1890, 0, 20, 'https://media.zooplus.com/bilder/2/400/200318_pla_trixie_premium_zugstopp_halsband_schwarz_hs_01_2.jpg', '[]', 1, '2026-03-20 18:03:28', '2026-03-20 18:03:28'),
(50, 5, 'Nomad Tales Calma nyakörv, sand', 'nomad-tales-calma-nyakorv-sand', NULL, 'S méret: 30 - 46 cm nyakerület, Sz 15 mm', 5390, 0, 10, 'https://media.zooplus.com/bilder/9/400/pla_326198_326200_326201_325903_326096_326097_nomad_tales_calma_halsbaender_fg_1609_9.jpg', '[]', 1, '2026-03-20 18:05:43', '2026-03-20 18:05:43'),
(51, 5, 'TIAKI Soft & Safe nyakörv, piros', 'tiaki-soft-safe-nyakorv-piros', NULL, 'XS méret: 25 - 35 cm nyakkörfogat, 40 mm széles', 2890, 0, 10, 'https://media.zooplus.com/bilder/7/400/323200_pla_soft_safe_fg_1209_7.jpg', '[]', 1, '2026-03-20 18:07:00', '2026-03-20 18:07:00'),
(52, 5, 'HUNTER London nyakörv, olívazöld', 'hunter-london-nyakorv-olivazold', NULL, 'L méret: 34-56 cm nyakkörfogat, Sz 20 mm', 1390, 0, 25, 'https://media.zooplus.com/bilder/3/400/164399_164197_pla_hunter_halsband_london_olivgruen_hs_01_3.jpg', '[]', 1, '2026-03-20 18:09:35', '2026-03-20 18:09:35'),
(53, 6, 'Brit Premium by Nature Adult Large', 'brit-premium-by-nature-adult-large', NULL, 'Fehérjében gazdag, teljes értékű eledel nagy méretű felnőtt kutyáknak. 15kg.', 13890, 0, 49, 'https://media.zooplus.com/bilder/5/400/82042_pla_brit_premiumbynature_adult_l_15kg_5.jpg', '[]', 1, '2026-03-20 18:14:43', '2026-04-14 19:49:12'),
(54, 6, 'Briantos Adult lazac & rizs 14kg', 'briantos-adult-lazac-rizs-14kg', NULL, 'Csemege lazac könnyen emészthető rizzsel prémium minőségben.', 10790, 0, 25, 'https://media.zooplus.com/bilder/0/400/briantos_adult_salmonrice_14kg_1000x1000_0.jpg', '[]', 1, '2026-03-20 18:15:39', '2026-03-20 18:15:39'),
(55, 7, 'Tollas játékpálca', 'tollas-jatekpalca', NULL, 'A hajlékony nyelű játékbot színes tollaival és a zörgős fóliával nagyon népszerű macskajáték.', 450, 0, 999, 'https://media.zooplus.com/bilder/3/400/59841_pla_katzenfederspiel_fg_4943_3.jpg', '[]', 1, '2026-03-20 18:18:32', '2026-03-20 18:18:32'),
(56, 7, 'Macskapeca tollboával', 'macskapeca-tollboaval', NULL, 'Garantált játékélmény macskának és gazdájának egyaránt.', 590, 0, 40, 'https://media.zooplus.com/bilder/5/400/58521_PLA_Katzenangel_Federboa_FG_DSC0755_5.jpg', '[]', 1, '2026-03-20 18:20:17', '2026-03-20 18:20:17'),
(57, 7, 'Trixie plüss egérke macskamentával', 'trixie-pluss-egerke-macskamentaval', NULL, 'Kedves kis szürke plüss játékegér macskamentával (catnip).', 490, 0, 50, 'https://media.zooplus.com/bilder/2/400/26383_PLA_Trixie_Plueschmaus_mit_Catnip_Katzenspielzeug_7_cm_2.jpg', '[]', 1, '2026-03-20 18:21:43', '2026-03-20 18:21:43'),
(58, 8, 'Macska etetőtál csúszásgátló aljzattal', 'macska-etetotal-csuszasgatlo-aljzattal', NULL, '200 ml, Ø 15 cm. Kis rozsdamentes acél tál aljzattal, tökéletes macska etetőtál.', 890, 0, 15, 'https://media.zooplus.com/bilder/2/400/28923_PLA_Rutschfester_Fressnapf_mit_Katzenmotiv_FG30_DSC2044_2.jpg', '[]', 1, '2026-03-20 18:25:23', '2026-03-20 18:25:23'),
(59, 8, 'Trixie talpas kerámiatál', 'trixie-talpas-keramiatal', NULL, '150 ml, Ø 13 cm. Elegáns kerámiatál macskáknak, kerek állólábbal.', 2390, 0, 13, 'https://media.zooplus.com/bilder/5/400/98398_pla_trixie_keramiknapf_mit_fur_katze_5.jpg', '[]', 1, '2026-03-20 18:26:38', '2026-03-20 18:26:38'),
(60, 8, 'TIAKI hármas tál vízadagolóval', 'tiaki-harmas-tal-vizadagoloval', NULL, 'Praktikus hármas tál macskák számára, két kivehető rozsdamentes acél tállal.', 3390, 0, 11, 'https://media.zooplus.com/bilder/4/400/486196_pla_tiaki_triple_feeder_fg_4762_4.jpg', '[]', 1, '2026-03-20 18:28:00', '2026-03-20 18:28:00'),
(61, 12, 'Smilla Sterilised gabonamentes lazac', 'smilla-sterilised-gabonamentes-lazac', NULL, 'Teljes értékű száraztáp speciális receptúrával az ivartalanított macskák anyagcsere-szükségleteinek megfelelően.', 13000, 0, 8, 'https://media.zooplus.com/bilder/6/400/2025_05_smilla_special_sterilised_gf_board_01_appversion_salmon_1000x1000_10kg_6.jpg', '[]', 1, '2026-03-20 18:33:42', '2026-03-21 11:09:58'),
(62, 12, 'Josera Nature Cat gabonamentes', 'josera-nature-cat-gabonamentes', NULL, 'Gabonamentes száraztáp érzékeny macskáknak sok szárnyassal, lazaccal, gyógynövény-kivonatokkal, zöldséggel, gyümölccsel.', 5590, 0, 10, 'https://media.zooplus.com/bilder/0/400/97904_pla_foodforplanet_josera_naturecat_2kg_0.jpg', '[]', 1, '2026-03-20 18:38:01', '2026-03-20 18:38:01'),
(63, 14, 'Skyline Maxi XL kisállatketrec', 'skyline-maxi-xl-kisallatketrec', NULL, 'Sötétkék: H 100 x Sz 54 x M 44 cm.', 16690, 0, 10, 'https://media.zooplus.com/bilder/1/400/401496_pla_skyline_kleintierkafig_maxixl_hs_01_1.jpg?width=400&format=webp', '[]', 1, '2026-03-24 07:39:56', '2026-03-24 07:39:56'),
(64, 14, 'Ferplast Rabbit 100 kisállatketrec', 'ferplast-rabbit-100-kisallatketrec', NULL, 'Szürke: kb. H 95 x Sz 57 x M 46 cm.', 23490, 0, 15, 'https://media.zooplus.com/bilder/7/400/54347_pla_ferplast_kleintierk_fig_rabbit_100_hs_01_7.jpg', '[]', 1, '2026-03-24 07:42:27', '2026-03-24 07:42:27'),
(65, 14, 'Fun Area Leon kisállat ketrec', 'fun-area-leon-kisallat-ketrec', NULL, 'A ketrec hörcsögök, futóegerek és egerek számára készült; alagútat, libikókát és forgókereket tartalmaz, mérete: H 67 x Sz 36,5 x M 65 cm, rácsok távolsága 6,72 mm.', 36690, 0, 12, 'https://media.zooplus.com/bilder/2/400/19614_pla_skyline_fun_area_leon_nagerk_fig_hs_01_2.jpg', '[]', 1, '2026-03-24 07:44:39', '2026-03-24 07:47:34'),
(66, 14, 'Savic Cubix Corner kisállatketrec', 'savic-cubix-corner-kisallatketrec', NULL, 'Helytakarékos L-alakú kisállatketrec nyulak és tengerimalacok számára, tágas, nagy ajtóval. H 148/100 x Sz 50 x M 63,5 cm.', 53290, 0, 5, 'https://media.zooplus.com/bilder/9/400/501698_pla_savic_cubix_corner_hs_01_9.jpg', '[]', 1, '2026-03-24 07:47:00', '2026-03-24 07:47:00'),
(67, 16, 'Trixie súlyzókészlet', 'trixie-sulyzokeszlet', NULL, 'Súlyzókészlet rágcsáláshoz és játszáshoz tengerimalacoknak és nyulaknak. Természetes kéreg, kíméletes fogkoptatást tesz lehetővé.', 890, 0, 25, 'https://media.zooplus.com/bilder/6/400/315798_pla_trixie_hantelset_hs_01_6.jpg', '[]', 1, '2026-03-24 07:49:32', '2026-03-24 07:49:32'),
(68, 16, 'JR Farm labda-trió', 'jr-farm-labda-trio', NULL, 'Játéklabda-szett kisállatoknak, 3 labda komplett ehető anyagokból, 100% természetes, rágcsálásra és játékra.', 1680, 0, 30, 'https://media.zooplus.com/bilder/2/400/84602_pla_jr_farm_baelle_set_2.jpg', '[]', 1, '2026-03-24 09:44:35', '2026-03-24 09:44:35'),
(69, 16, 'Kerbl Pet Native Snacks töltött alagút rágcsálóknak', 'kerbl-pet-native-snacks-toltott-alagut-ragcsaloknak', NULL, 'Kiváló minőségű ház rágcsálóknak, finom szénával töltve, aromás gyógynövényekkel & virágokkal bevonva, rágásra ösztönöz.', 3990, 0, 45, 'https://media.zooplus.com/bilder/7/400/605126_pla_kerbl_pet_native_snacks_kr_utertunnel_m_gef_llt_hs_01_7.jpg', '[]', 1, '2026-03-24 09:46:19', '2026-03-24 09:46:19'),
(70, 16, 'Kerbl vászonalagút rágcsálóknak', 'kerbl-vaszonalagut-ragcsaloknak', NULL, 'Izgalmas játékalagút kisállatok, például nyulak és tengerimalacok számára, három bejárattal a felfedezéshez és a játékhoz.', 5890, 0, 1, 'https://media.zooplus.com/bilder/4/400/605296_pla_kerbl_pet_nagertunnel_aus_leinen_50x18cm_hs_01_4.jpg', '[]', 1, '2026-03-24 09:47:28', '2026-03-24 09:48:21'),
(71, 23, 'TetraMin Flakes lemezes haltáp', 'tetramin-flakes-lemezes-haltap', NULL, 'Főeleség minden díszhal számára. Többféle lemez különféle süllyedési tulajdonságokkal.', 1690, 0, 25, 'https://media.zooplus.com/bilder/4/400/7741_pla_tetra_aqua_hs_01_4.jpg', '[]', 1, '2026-03-24 09:50:11', '2026-03-24 09:50:11'),
(72, 23, 'TetraPRO Colour Multi-Crisps lemezes haltáp (500 ml)', 'tetrapro-colour-multi-crisps-lemezes-haltap', NULL, 'Teljes értékű haltáp minden trópusi díszhalfajta számára. Színkoncentrátummal a gyönyörű természetes színekért.\nVitaminokban, tápanyagokban gazdag.', 5490, 0, 13, 'https://media.zooplus.com/bilder/5/400/18740_pla_tetrapro_colour_500ml_moq_96_zwingend_1000x1000_hs_01_5.jpg', '[]', 1, '2026-03-24 09:51:51', '2026-03-24 09:55:28'),
(73, 23, 'TetraPRO Energy Multi-Crisps lemezes haltáp (500 ml)', 'tetrapro-energy-multi-crisps-lemezes-haltap', NULL, 'Teljes értékű haltáp valamennyi trópusi díszhalfajta számára.\nInnovatív chipsformájú táp, kevésbé terheli a vizet.', 4590, 0, 9, 'https://media.zooplus.com/bilder/6/400/14498_pla_tetrapro_energy_flockenfutter_500ml_moq_96_zwingend_1000x1000_hs_01_6.jpg', '[]', 1, '2026-03-24 09:53:03', '2026-03-24 09:56:02'),
(74, 23, 'sera Goldy Nature (1000 ml, 210g)', 'sera-goldy-nature', NULL, 'Kiegyensúlyozott fő eleség kisebb aranyhalak és tenyészformáik számára, mindennapi etetésre akváriumban vagy kerti tóban.', 6000, 0, 22, 'https://media.zooplus.com/bilder/6/400/6890_pla_sera_goldy_nature_1_4kg_1000ml_6.jpg', '[]', 1, '2026-03-24 09:54:12', '2026-03-24 09:56:14'),
(75, 24, 'AquaEl Leddy 40 Day & Night szögletes akváriumkészlet Fekete 25L', 'aquael-leddy-40-day-night-szogletes-akvariumkeszlet-fekete-25l', NULL, 'Komplett akvárium készlet, szögletes előlappal, Day & Night LED világítással.', 32990, 0, 14, 'https://petnet_images.storage.googleapis.com/big/16/1601225603.webp', '[]', 1, '2026-03-24 09:58:51', '2026-03-24 09:58:51'),
(76, 24, 'AquaEl Leddy 60 Day & Night szögletes akváriumkészlet Fekete 54L', 'aquael-leddy-60-day-night-szogletes-akvariumkeszlet-fekete-54l', NULL, 'Komplett akvárium készlet, szögletes előlappal, Day & Night LED világítással.', 42990, 0, 5, 'https://petnet_images.storage.googleapis.com/small300/16/1601224421.webp', '[]', 1, '2026-03-24 10:00:11', '2026-03-24 10:00:11'),
(77, 24, ' Marina Betta Kit Modern Art miniakvárium 2L', 'marina-betta-kit-modern-art-miniakvarium-2l', NULL, 'Miniakvárium Betta (sziámi harcoshal) halak számára. Telepítéséhez csak egy halra és vízre lesz szüksége!', 3900, 0, 20, 'https://petnet_images.storage.googleapis.com/small300/81/8124hagenmarinabettakitmodernartminiakvarium.webp', '[]', 1, '2026-03-24 10:02:02', '2026-03-24 10:02:02'),
(78, 24, 'AquaEl Shrimp Set Day & Night LED ', 'aquael-shrimp-set-day-night-led', NULL, 'Speciálisan gyártott, különösen áttetsző üvegből készült komplett nano akvárium, amely ideális feltételeket biztosít a növények, garnélák és kishalak számára. Fehér 30x30x35cm.', 31990, 0, 6, 'https://petnet_images.storage.googleapis.com/small300/16/1603461182.webp', '[]', 1, '2026-03-24 10:03:57', '2026-03-24 10:03:57'),
(79, 25, 'AquaEl Turbo Filter 500 Professional', 'aquael-turbo-filter-500-professional', NULL, 'Szivacsszűrővel és kerámiatöltettel ellátott, biológiai szűrést is végző szűrőházzal is ellátott professzionális akváriumi belsőszűrő.', 9700, 0, 5, 'https://petnet_images.storage.googleapis.com/small300/14/1404204075.webp', '[]', 1, '2026-03-24 10:05:29', '2026-03-24 10:05:29'),
(80, 25, 'AquaEl Fan Mini Plus akváriumi belsőszűrő', 'aquael-fan-mini-plus-akvariumi-belsoszuro', NULL, 'Kicsi, hatékony és tetszetős akváriumszűrő, Ideális megoldás az akvárium vizének szűrésére és oxigénnel történő ellátására.', 6990, 0, 19, 'https://petnet_images.storage.googleapis.com/small300/17/1753809285.webp', '[]', 1, '2026-03-24 10:06:48', '2026-03-24 10:06:48'),
(81, 25, 'Hydor Crystal Filter 200 R10 akváriumszűrő', 'hydor-crystal-filter-200-r10-akvariumszuro', NULL, 'Hydor Crystal 3 Duo R10 akváriumszűrő - Akváriumi belső szűrő 120-200 literes akváriumokhoz.', 13990, 0, 21, 'https://petnet_images.storage.googleapis.com/small300/97/970crystal3.webp', '[]', 1, '2026-03-24 10:08:10', '2026-03-24 10:08:10'),
(82, 25, 'Tetra Tec HT akváriumfűtő 150W', 'tetra-tec-ht-akvariumfuto-150w', NULL, 'Automata akvárium fűtő. Kiváló minőségű, szabályozható akváriumi fűtő', 8499, 0, 999, 'https://petnet_images.storage.googleapis.com/small300/11/1118ht150futo.webp', '[]', 1, '2026-03-24 10:10:31', '2026-03-24 10:10:31'),
(83, 25, ' Tetra Tec APS 400 levegőztető légpumpa', 'tetra-tec-aps-400-levegozteto-legpumpa', NULL, 'akváriumlevegőztető légpumpa. Nagyon csendes és különösen erős légpumpa.', 14990, 0, 15, 'https://petnet_images.storage.googleapis.com/small300/10/1058aps400legpumpa.webp', '[]', 1, '2026-03-24 10:12:11', '2026-03-24 10:12:11'),
(84, 25, 'AquaEl Leddy Smart 2 Plant 6W', 'aquael-leddy-smart-2-plant-6w', NULL, 'A Nano akváriumok oldalára csíptethető, kompakt LED világítás, mindössze 6W-os fogyasztással.', 11990, 0, 7, 'https://petnet_images.storage.googleapis.com/small300/15/1570986878.webp', '[]', 1, '2026-03-24 10:13:35', '2026-03-24 10:13:35'),
(85, 25, 'AquaEl Leddy Tube Day & Night LED világítás csőmodul', 'aquael-leddy-tube-day-night-led-vilagitas-csomodul', NULL, 'Különleges élményt nyújtó, modern világítótest akváriumokhoz történő beépítésre. Három különböző üzemmód: nappali, alkonyati és éjjeli világítás!', 16990, 0, 999, 'https://petnet_images.storage.googleapis.com/small300/17/1753808399.webp', '[]', 1, '2026-03-24 10:15:32', '2026-03-24 10:15:32'),
(86, 20, 'Versele-Laga Prestige hullámos papagáj', 'versele-laga-prestige-hullamos-papagaj', NULL, 'Teljes értékű táp kis papagájoknak. Kiegyensúlyozott magkeverék kölessel, kanárimaggal, zabbal.', 4990, 3500, 45, 'https://media.zooplus.com/bilder/6/400/38434_pla_prestige_wellensittich_4kg_6.jpg?width=400&format=webp', '[]', 1, '2026-03-24 10:17:58', '2026-03-24 10:17:58'),
(87, 20, 'Versele-Laga Prestige Exoten', 'versele-laga-prestige-exoten', NULL, 'Prémium eleség-keverék minden egzotikus pintynek. Trópusi pintyek egyedi táplálékigényeire szabva. Természetes magvak és kölesfajták keveréke.', 5290, 0, 25, 'https://media.zooplus.com/bilder/3/400/64918_pla_prestige_exoten_4kg_3.jpg?width=400&format=webp', '[]', 1, '2026-03-24 10:19:49', '2026-03-24 10:19:49'),
(88, 20, 'Versele-Laga Prestige Papagáj 2x3kg', 'versele-laga-prestige-papagaj-2x3kg', NULL, 'Teljes értékű eledel papagájoknak. Klasszikus keverék diófélékkel és magvakkal.', 10990, 0, 12, 'https://media.zooplus.com/bilder/6/400/52543_pla_prestige_papagei_3kg_6.jpg', '[]', 1, '2026-03-24 10:21:34', '2026-03-24 11:21:56'),
(89, 20, 'Versele-Laga Prestige óriáspapagáj 2x4 kg', 'versele-laga-prestige-oriaspapagaj-2x4-kg', NULL, 'Kifejezetten nagy papagájok számára kifejlesztett madáreledel. Kiegyensúlyozott magkeverék.', 11590, 0, 29, 'https://media.zooplus.com/bilder/3/400/15524_pla_prestige_gro_sittich_4kg_3.jpg?width=400&format=webp', '[]', 1, '2026-03-24 10:22:40', '2026-03-24 10:22:40'),
(90, 21, 'TIAKI Grand Espace madárkalitka', 'tiaki-grand-espace-madarkalitka', NULL, 'Nagy kalitka különböző madárfajok számára, erős fémből, porbevonattal, 2 nagy elülső ajtóval a könnyű hozzáférésért, több kis oldalsó ajtóval.', 56990, 0, 8, 'https://media.zooplus.com/bilder/4/400/369411_pla_tiaki_grand_espace_fg_0239_4.jpg', '[]', 1, '2026-03-24 10:24:14', '2026-03-24 10:24:14'),
(91, 21, 'TIAKI Noble papagáj kalitka', 'tiaki-noble-papagaj-kalitka', NULL, 'Kalitka kis papagájok és más madárfajok számára, erős fémből, porbevonattal, nagy elülső ajtóval a könnyű hozzáférésért.\nH 82 x Sz 77,4 x M 164 cm.', 69890, 0, 2, 'https://media.zooplus.com/bilder/1/400/369520_pla_tiaki_noble_fg_0290_1.jpg?width=400&format=webp', '[]', 1, '2026-03-24 10:25:33', '2026-03-24 10:25:33'),
(92, 21, 'TIAKI madárkalitka H 79 x Sz 69,5 x M 167 cm', 'tiaki-madarkalitka-h-79-x-sz-69-5-x-m-167-cm', NULL, 'Tágas madárkalitka, nagy bejárati ajtóval és tetővel, 6 ülőrúddal és két eleség- és vízadagolóval, kihúzható aljtálcával, 360°-os görgőkön, rácstávolság: 10,2 mm.', 45790, 0, 7, 'https://media.zooplus.com/bilder/8/400/475098_pla_tiaki_bird_aviary_fg_2460_8.jpg', '[]', 1, '2026-03-24 10:26:48', '2026-03-24 10:26:48'),
(93, 22, 'TIAKI madárlétra (30,5x9x15 cm)', 'tiaki-madarletra-30-5x9x15-cm', NULL, 'Elegáns falétra kis és közepes méretű madárfajok számára.', 1090, 0, 36, 'https://media.zooplus.com/bilder/3/400/377917_pla_tiaki_bird_ladder_fg_9871_3.jpg', '[]', 1, '2026-03-24 10:29:32', '2026-03-24 10:29:32'),
(94, 22, 'TIAKI XL függőhíd 84x18 cm', 'tiaki-xl-fuggohid-84x18-cm', NULL, 'Színes függőhíd nagyobb madarak számára, természetes valódi fából.', 4790, 0, 40, 'https://media.zooplus.com/bilder/5/400/377914_pla_tiaki_suspension_bridge_xl_fg_9943_5.jpg', '[]', 1, '2026-03-24 10:30:49', '2026-03-24 10:30:49'),
(95, 22, 'TIAKI természetes juta ülőrúd 1,9x45 cm', 'tiaki-termeszetes-juta-ulorud-1-9x45-cm', NULL, 'Hajlítható ülőrúd bármely fajta madárnak, természetes jutakötélből.', 2390, 0, 41, 'https://media.zooplus.com/bilder/9/400/377930_pla_tiaki_jute_rope_perch_1_9cm_l_45cm_fg_0063_9.jpg', '[]', 1, '2026-03-24 10:32:06', '2026-03-24 11:21:56'),
(96, 17, 'ExoTerra Grasshoppers 34g', 'exoterra-grasshoppers-34g', NULL, 'Szöcske-konzerv táp rovarevő hüllők részére.\nGyártó: ExoTerra', 6590, 0, 4, 'https://petnet_images.storage.googleapis.com/small300/16/1694grasshoppers34g.webp', '[]', 1, '2026-03-24 10:34:51', '2026-03-24 10:47:07'),
(97, 17, 'ExoTerra Mealworms 34g', 'exoterra-mealworms-34g', NULL, 'Lisztkukac-Konzerv(lisztbogár-lárva) táp rovarevő hüllők részére.\n\nGyártó: ExoTerra', 6590, 0, 5, 'https://petnet_images.storage.googleapis.com/small300/16/1698mealworms34g.webp', '[]', 1, '2026-03-24 10:35:55', '2026-03-24 10:46:41'),
(98, 17, 'ExoTerra Cricket S 34g', 'exoterra-cricket-s-34g', NULL, 'Tücsök-konzerv, apró tücskökből rovarevő hüllők részére. Gyártó: ExoTerra', 6590, 0, 5, 'https://petnet_images.storage.googleapis.com/small300/16/1699cricketssmall34g.webp', '[]', 1, '2026-03-24 10:50:39', '2026-03-24 10:50:39'),
(99, 17, 'Trixie Pure Nature Gyógynövény Mix Hüllőknek 75g', 'trixie-pure-nature-gyogynoveny-mix-hulloknek-75g', NULL, 'Szárított gyógynövény keverék, táplálék kiegészítő hüllők részére.', 1990, 0, 50, 'https://petnet_images.storage.googleapis.com/small300/13/1343309699.webp', '[]', 1, '2026-03-24 10:51:52', '2026-03-24 10:51:52'),
(100, 17, 'ReptiPlanet Jelly Pots Mix with Vitamin A/C vegyes bogárzselé 8db', 'reptiplanet-jelly-pots-mix-with-vitamin-a-c-vegyes-bogarzsele-8db', NULL, 'Klasszikus és gyümölcsös ízesítésű \"bogárzselé\" csomag, mely ideális a nektárral és gyümölcsökkel táplálkozó hüllők és gerinctelenek számára.', 3290, 0, 20, 'https://petnet_images.storage.googleapis.com/small300/16/1644283090.webp', '[]', 1, '2026-03-24 10:53:02', '2026-03-24 10:53:02'),
(101, 18, 'ExoTerra Glass Terrarium Medium/Tall 60x45x60cm', 'exoterra-glass-terrarium-medium-tall-60x45x60cm', NULL, 'Az ExoTerra terrárium európai herpetológusok által tervezett, a hüllők és kétéltűek tartásához ideális terrárium.', 86500, 0, 6, 'https://petnet_images.storage.googleapis.com/small300/31/3100exoterraglassterrarium60x45x60cm02.webp', '[]', 1, '2026-03-24 10:55:03', '2026-03-24 10:55:03'),
(102, 18, ' ExoTerra Glass Terrarium Medium/X-Tall 60x45x90cm', 'exoterra-glass-terrarium-medium-x-tall-60x45x90cm', NULL, 'Minőségi kivitelű, minden terrarista igényeit kielégítő terrárium az Exo Terrától.', 137590, 0, 9, 'https://petnet_images.storage.googleapis.com/small300/12/12656exoterraglassterrarium45x45x60cm02.webp', '[]', 1, '2026-03-24 10:56:25', '2026-03-24 10:56:25'),
(103, 18, 'ExoTerra Glass Terrarium Small/Tall 45x45x60cm', 'exoterra-glass-terrarium-small-tall-45x45x60cm', NULL, 'Minőségi kivitelű, minden terrarista igényeit kielégítő terrárium az Exo Terrától.', 82290, 0, 9, 'https://petnet_images.storage.googleapis.com/small300/30/3097exoterraglassterrarium45x45x60cm02.webp', '[]', 1, '2026-03-24 10:57:32', '2026-03-24 10:57:32'),
(104, 18, 'ExoTerra Glass Terrarium Mini/Tall 30x30x45cm', 'exoterra-glass-terrarium-mini-tall-30x30x45cm', NULL, 'Minőségi kivitelű, minden terrarista igényeit kielégítő terrárium az Exo Terrától.', 37390, 0, 12, 'https://petnet_images.storage.googleapis.com/small300/30/3095exoterraglassterrarium30x30x45cm02.webp', '[]', 1, '2026-03-24 10:58:13', '2026-03-24 10:58:13'),
(105, 18, 'ExoTerra Faunarium műanyag box L 37x22x25cm', 'exoterra-faunarium-muanyag-box-l-37x22x25cm', NULL, 'Könnyen tisztítható műanyag szállítódoboz, bármely célra használható terráriumi hüllők, kétéltűek, rágcsálók és rovarok számára.', 6530, 0, 53, 'https://petnet_images.storage.googleapis.com/small300/15/1518439458.webp', '[]', 1, '2026-03-24 11:00:17', '2026-03-24 11:00:17'),
(106, 18, 'ExoTerra Faunarium lapos műanyag box L 46x30x17cm', 'exoterra-faunarium-lapos-muanyag-box-l-46x30x17cm', NULL, 'Könnyen tisztítható műanyag szállítódoboz, bármely célra használható terráriumi hüllők, kétéltűek, rágcsálók és rovarok számára.', 8630, 0, 34, 'https://petnet_images.storage.googleapis.com/small300/15/1518439602.webp', '[]', 1, '2026-03-24 11:01:12', '2026-03-24 11:01:12'),
(107, 18, 'ExoTerra Faunarium műanyag box S 23x15,5x17cm', 'exoterra-faunarium-muanyag-box-s-23x15-5x17cm', NULL, 'Könnyen tisztítható műanyag szállítódoboz, bármely célra használható terráriumi hüllők, kétéltűek, rágcsálók és rovarok számára.', 2690, 0, 42, 'https://petnet_images.storage.googleapis.com/small300/15/1518439354.webp', '[]', 1, '2026-03-24 11:02:03', '2026-03-24 11:02:03'),
(108, 18, 'ExoTerra Dripper Plant Small kaméleon itató 40cm', 'exoterra-dripper-plant-small-kameleon-itato-40cm', NULL, 'Művirág alakú, szívattyúról üzemelő itató, mely elsősorban kaméleonok számára biztosítja a csepegtetva történő itatást.', 25200, 0, 12, 'https://petnet_images.storage.googleapis.com/small300/14/1456100165.webp', '[]', 1, '2026-03-24 11:03:36', '2026-03-24 11:03:36'),
(109, 18, 'ExoTerra Feeding Dish Small etetőtál 15x12x2cm', 'exoterra-feeding-dish-small-etetotal-15x12x2cm', NULL, 'Az Exo Terra etető edényei kívülről természetes, szikla kinézetűek, belülről sima, nem gödrös felületűek.', 2550, 0, 32, 'https://petnet_images.storage.googleapis.com/small300/14/1456180417.webp', '[]', 1, '2026-03-24 11:04:25', '2026-03-24 11:04:25'),
(110, 18, 'ExoTerra Corner Plebble Water Dish Large sarok itatótál 16x18x5,5cm', 'exoterra-corner-plebble-water-dish-large-sarok-itatotal-16x18x5-5cm', NULL, 'Terráriumi itatótál, ami sarokba illik, így jól kihasználja a rendelkezésre álló teret.', 6850, 0, 16, 'https://petnet_images.storage.googleapis.com/small300/16/1698601534.webp', '[]', 1, '2026-03-24 11:05:15', '2026-03-24 11:05:15'),
(111, 19, ' ExoTerra Intense Basking Spot 50W', 'exoterra-intense-basking-spot-50w', NULL, 'Kifejezetten sütkérezéshez tervezett lámpa. A szűkített sugárnyaláb pontosan az adott területre irányítható.', 2490, 0, 25, 'https://petnet_images.storage.googleapis.com/small300/13/1388324542.webp', '[]', 1, '2026-03-24 11:06:45', '2026-03-24 11:06:45'),
(112, 19, 'ExoTerra Solar Glo napfényízzó 125W', 'exoterra-solar-glo-napfenyizzo-125w', NULL, 'Természetes napfényt pótló UV-B spektrumot tartalmazó izzó, a hüllők (növényevők) és kétéltűek számára.', 17900, 0, 16, 'https://petnet_images.storage.googleapis.com/small300/13/1388329196.webp', '[]', 1, '2026-03-24 11:07:47', '2026-03-24 11:07:47'),
(113, 19, ' ExoTerra Reptile UVB 150 Compact 13W', 'exoterra-reptile-uvb-150-compact-13w', NULL, 'Újgenerációs UVB/UVA izzó, minden félsivatagi és sivatagi terráriumi környezetet igénylő hüllő és kétéltű számára.', 8500, 0, 18, 'https://petnet_images.storage.googleapis.com/small300/13/1375090108.webp', '[]', 1, '2026-03-24 11:09:11', '2026-03-24 11:09:11'),
(114, 6, 'Royal Canin Veterinary Canine Early Renal', 'royal-canin-veterinary-canine-early-renal', NULL, 'Teljes értékű száraz diétás eledel felnőtt kutyáknak a veseműködés támogatására.', 21290, 11710, 22, 'https://media.zooplus.com/bilder/2/400/440507_mhi_royal_canin_veterinary_canine_early_renal_hs_02_2.jpg?width=400&format=webp', '[]', 1, '2026-03-24 11:16:11', '2026-04-14 19:49:12'),
(115, 12, 'PURINA ONE Sterilcat lazac', 'purina-one-sterilcat-lazac', NULL, '750g. Teljes értékű táp speciálisan ivartalanított macskáknak, fehérje- és omega zsírsavforrásként lazaccal.', 2290, 0, 50, 'https://media.zooplus.com/bilder/2/400/324997_pla_nestle_purinaone_sterilcat_lachs_750g_hs_01_2.jpg?width=400&format=webp', '[]', 1, '2026-03-31 08:06:21', '2026-03-31 08:06:21'),
(116, 12, 'PURINA ONE Junior', 'purina-one-junior', NULL, '1.4kg. Szárazeledel kiscicáknak és növekedésben lévő macskáknak (12 hónapos korig).', 3490, 0, 43, 'https://media.zooplus.com/bilder/4/400/383244_pla_netsle_purinaone_junior_huhn_hs_01_4.jpg', '[]', 1, '2026-03-31 08:08:11', '2026-03-31 08:08:11'),
(117, 17, 'ExoTerra Iguana Adult Soft Pellets', 'exoterra-iguana-adult-soft-pellets', NULL, '260g. Kifejezetten kifejlett leguánok és más növényevő gyíkok számára készült prémium összetevőkből álló táp.', 4590, 0, 13, 'https://petnet_images.storage.googleapis.com/small300/14/1449708035.webp', '[]', 1, '2026-03-31 08:14:10', '2026-03-31 08:14:10'),
(118, 27, 'Beaphar MultiVit multivitamin hüllőknek és teknősöknek', 'beaphar-multivit-multivitamin-hulloknek-es-teknosoknek', NULL, '20ml. Vitamincseppek ékszerteknősök és szárazföldi teknősök számára.', 2800, 0, 20, 'https://petnet_images.storage.googleapis.com/small300/14/1491170594.webp', '[]', 1, '2026-03-31 08:22:42', '2026-03-31 08:22:42'),
(119, 27, 'Panzi Kálciumos páncélerősítő teknősöknek', 'panzi-kalciumos-pancelerosito-teknosoknek', NULL, 'Terráriumi vízben oldódó kálciumblokk.', 1100, 0, 30, 'https://petnet_images.storage.googleapis.com/small300/92/9269panzikalciumospancelerositoviziteknosoknek10g.webp', '[]', 1, '2026-03-31 08:23:52', '2026-03-31 08:23:52'),
(120, 27, 'ReptiPlanet Calcium +D3 kálciumpor hüllőknek', 'reptiplanet-calcium-d3-kalciumpor-hulloknek', NULL, '125g. Finomra őrölt természetes kalcium, D3 vitaminnal kiegészítve. Minden életkorban adható.', 3690, 0, 10, 'https://petnet_images.storage.googleapis.com/small300/15/1589858356.webp', '[]', 1, '2026-03-31 08:24:49', '2026-03-31 08:24:49'),
(121, 27, ' ReptiPlanet Tortoise Calcium kálciumpor teknősöknek', 'reptiplanet-tortoise-calcium-kalciumpor-teknosoknek', NULL, '100g. Kiegészítő kálciumpor szárazföldi teknősök számára. Finomra őrölt kalcium, magnézium, és növényi örlemény kompozíció, a kiváló kondíció és az egészséges csontozat érdekében.', 2290, 0, 8, 'https://petnet_images.storage.googleapis.com/small300/15/1589800031.webp', '[]', 1, '2026-03-31 08:26:00', '2026-03-31 08:26:26'),
(122, 27, 'ExoTerra Calcium +D3 hüllőknek, kétéltűeknek', 'exoterra-calcium-d3-hulloknek-keteltueknek', NULL, '90g. Kálcium készítmény D3 vitamin kiegészítéssel, por formában, hüllők és kétéltűek számára egyaránt.', 3950, 0, 14, 'https://petnet_images.storage.googleapis.com/small300/13/1355244477.webp', '[]', 1, '2026-03-31 08:27:40', '2026-03-31 08:27:40'),
(123, 27, 'ExoTerra Multi Vitamin Powder Supplement hüllőknek kétéltűeknek', 'exoterra-multi-vitamin-powder-supplement-hulloknek-keteltueknek', NULL, '70g. Komplett multivitamin készítmény, por formában, hüllők és kétéltűek számára egyaránt.', 3950, 0, 23, 'https://petnet_images.storage.googleapis.com/small300/97/9731exo-terramultivitaminhulloknek70g.webp', '[]', 1, '2026-03-31 08:31:17', '2026-03-31 08:31:17');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termek_velemenyek`
--

CREATE TABLE `termek_velemenyek` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `termek_id` int(10) UNSIGNED NOT NULL,
  `felhasznalo_id` bigint(20) UNSIGNED DEFAULT NULL,
  `vendeg_nev` varchar(100) DEFAULT 'Névtelen vásárló',
  `ertekeles` tinyint(3) UNSIGNED NOT NULL CHECK (`ertekeles` in (1,2,3,4,5)),
  `cim` varchar(150) NOT NULL,
  `velemeny` text NOT NULL,
  `segitett_igen` int(10) UNSIGNED DEFAULT 0,
  `segitett_nem` int(10) UNSIGNED DEFAULT 0,
  `ellenorzott` tinyint(1) DEFAULT 0,
  `elfogadva` tinyint(1) DEFAULT 1,
  `datum` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `termek_velemenyek`
--

INSERT INTO `termek_velemenyek` (`id`, `termek_id`, `felhasznalo_id`, `vendeg_nev`, `ertekeles`, `cim`, `velemeny`, `segitett_igen`, `segitett_nem`, `ellenorzott`, `elfogadva`, `datum`) VALUES
(1, 1, NULL, 'Kovács Béla', 5, 'Szuper táp, a kutyám imádja!', 'A Royal Canin Mini Adult óta sokkal szebb a szőre a törpe uszkárnak, és végre nem válogatós többé. Nagyon ajánlom!', 0, 0, 1, 1, '2025-01-15 13:22:33'),
(2, 1, NULL, 'Szabó Anita', 4, 'Jó, de kicsit drága', 'Minősége kiváló, a kutyusom egészségesen tartja, de az árért több akció is elférne. Ettől függetlenül újra veszem.', 0, 0, 1, 1, '2025-03-22 08:11:45'),
(3, 3, NULL, 'Nagy István', 5, 'A legjobb hám, amit valaha vettem', 'A JULIUS-K9 erőhám piros XL tökéletesen illeskedik a németjuhászomra, végre nem húz annyira séta közben. Kötelező darab!', 0, 0, 1, 1, '2025-02-28 17:47:12'),
(4, 6, NULL, 'Kiss Eszter', 5, 'A macskám rajong érte', 'A Felix Fantastic duplán finom az egyetlen nedves táp, amit maradéktalanul megeszik a perzsa cicám. 10/10!', 0, 0, 1, 1, '2025-04-10 09:30:55'),
(5, 5, NULL, 'Tóth Gábor', 3, 'Elmegy, de van jobb is', 'A Trixie kerámia tálak szépek, de az állvány kicsit billeg. Közepes méretű kutyánál még oké, de nagyobbnál nem ajánlom.', 0, 0, 0, 1, '2025-05-19 18:05:21'),
(6, 8, NULL, 'Horváth Lili', 5, 'Végre nem vakarózik!', 'A Frontline Tri-Act után eltűntek a bolhák a spánielről, és még most, hónapok múlva sem jöttek vissza. Köszönöm!', 0, 0, 1, 1, '2025-06-30 14:18:44'),
(7, 2, NULL, 'Varga Tamás', 5, 'Ár-érték bajnok', 'Bosch Adult Menue 15 kg-os zsákot vettem, és a golden retrieverem szőre még sosem volt ilyen fényes. Profi választás!', 0, 0, 1, 1, '2025-07-12 11:55:19'),
(8, 7, NULL, 'Papp Réka', 2, 'Nem érte meg az árát', 'A KONG Kickeroo macskajátékot 2 nap alatt széttépte a maine coonom. Vártam tőle többet ennyi pénzért.', 0, 0, 1, 1, '2025-08-25 08:42:33'),
(9, 4, NULL, 'Molnár Péter', 5, 'Tökéletes póráz nagy kutyának', 'Rukka állítható kötélpóráz fekete – végre nem szakad el, és kényelmes a fogása is. 70 kg-os kaukázusi pásztorommal is bírja.', 0, 0, 1, 1, '2025-09-05 17:27:58'),
(10, 9, NULL, 'Fekete Zsanett', 5, 'A nyuszik imádják!', 'Petlife Safebed papírpehely alom a legjobb döntés volt a törpenyulaimnak. Pormentes, szagtalan, és nem eszik meg. Tökéletes!', 0, 0, 1, 1, '2025-11-28 07:19:07'),
(11, 1, NULL, 'Balogh Andrea', 5, 'Minden kutyának ajánlom!', 'Már a harmadik zsakot veszem ebből a tápból. A kutyám energikus és egészséges. Köszönöm!', 0, 0, 1, 1, '2025-12-10 14:30:22'),
(12, 3, NULL, 'Lakatos György', 4, 'Jó minőség, kicsit drága', 'A hám kiváló minőségű, de az ára elég magas. Viszont megéri, mert tartós.', 0, 0, 1, 1, '2025-12-15 09:45:11'),
(16, 95, 18, 'Névtelen vásárló', 5, 'Értékelés', 'Nagyon jó játék, a madaram imádja.', 0, 0, 0, 1, '2026-03-24 11:19:37'),
(17, 94, 19, 'Névtelen vásárló', 5, 'Imádom!', 'Nagyon jó termék imádja a nimfa papagájom.', 0, 0, 0, 1, '2026-03-31 08:39:37');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tiltott_szavak`
--

CREATE TABLE `tiltott_szavak` (
  `id` int(11) NOT NULL,
  `szo` varchar(100) NOT NULL,
  `hozzaadva` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `tiltott_szavak`
--

INSERT INTO `tiltott_szavak` (`id`, `szo`, `hozzaadva`) VALUES
(1, 'spam', '2026-01-01 20:05:57'),
(2, 'szar', '2026-01-01 20:05:57'),
(3, 'reklam', '2026-01-01 20:08:40'),
(4, 'scam', '2026-01-01 20:08:40'),
(5, 'fake', '2026-01-01 20:08:40'),
(6, 'hamis', '2026-01-01 20:08:40');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `uzenetek`
--

CREATE TABLE `uzenetek` (
  `id` int(11) NOT NULL,
  `kuldo_id` int(11) NOT NULL,
  `fogado_id` int(11) NOT NULL,
  `uzenet` text NOT NULL,
  `olvasott` tinyint(1) DEFAULT 0,
  `letrehozva` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `uzenetek`
--

INSERT INTO `uzenetek` (`id`, `kuldo_id`, `fogado_id`, `uzenet`, `olvasott`, `letrehozva`) VALUES
(1, 9, 16, 'hello', 1, '2026-04-14 22:51:17'),
(2, 16, 9, 'hello9', 1, '2026-04-14 22:53:42');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `alkategoriak`
--
ALTER TABLE `alkategoriak`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `egyedi_slug` (`kategoria_id`,`slug`);

--
-- A tábla indexei `fal_bejegyzesek`
--
ALTER TABLE `fal_bejegyzesek`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `felhasznalonev` (`felhasznalonev`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `jelszo_reset`
--
ALTER TABLE `jelszo_reset`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- A tábla indexei `kosar`
--
ALTER TABLE `kosar`
  ADD PRIMARY KEY (`felhasznalo_id`,`termek_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `kuponok`
--
ALTER TABLE `kuponok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kod` (`kod`);

--
-- A tábla indexei `kupon_hasznalatok`
--
ALTER TABLE `kupon_hasznalatok`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `rendelesek`
--
ALTER TABLE `rendelesek`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rendeles_szam` (`rendeles_szam`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`);

--
-- A tábla indexei `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rendeles_id` (`rendeles_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `termekek`
--
ALTER TABLE `termekek`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `egyedi_slug` (`slug`),
  ADD KEY `alkategoria_id` (`alkategoria_id`);

--
-- A tábla indexei `termek_velemenyek`
--
ALTER TABLE `termek_velemenyek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `idx_termek` (`termek_id`),
  ADD KEY `idx_ertekeles` (`ertekeles`);

--
-- A tábla indexei `tiltott_szavak`
--
ALTER TABLE `tiltott_szavak`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `szo` (`szo`);

--
-- A tábla indexei `uzenetek`
--
ALTER TABLE `uzenetek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_kuldo` (`kuldo_id`),
  ADD KEY `idx_fogado` (`fogado_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `alkategoriak`
--
ALTER TABLE `alkategoriak`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT a táblához `fal_bejegyzesek`
--
ALTER TABLE `fal_bejegyzesek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT a táblához `jelszo_reset`
--
ALTER TABLE `jelszo_reset`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT a táblához `kategoriak`
--
ALTER TABLE `kategoriak`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `kuponok`
--
ALTER TABLE `kuponok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `kupon_hasznalatok`
--
ALTER TABLE `kupon_hasznalatok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `rendelesek`
--
ALTER TABLE `rendelesek`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT a táblához `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT a táblához `termekek`
--
ALTER TABLE `termekek`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT a táblához `termek_velemenyek`
--
ALTER TABLE `termek_velemenyek`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT a táblához `tiltott_szavak`
--
ALTER TABLE `tiltott_szavak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `uzenetek`
--
ALTER TABLE `uzenetek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `alkategoriak`
--
ALTER TABLE `alkategoriak`
  ADD CONSTRAINT `alkategoriak_ibfk_1` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoriak` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `kosar`
--
ALTER TABLE `kosar`
  ADD CONSTRAINT `kosar_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kosar_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `rendelesek`
--
ALTER TABLE `rendelesek`
  ADD CONSTRAINT `rendelesek_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`);

--
-- Megkötések a táblához `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  ADD CONSTRAINT `rendeles_tetelek_ibfk_1` FOREIGN KEY (`rendeles_id`) REFERENCES `rendelesek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rendeles_tetelek_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`);

--
-- Megkötések a táblához `termekek`
--
ALTER TABLE `termekek`
  ADD CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`alkategoria_id`) REFERENCES `alkategoriak` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `termek_velemenyek`
--
ALTER TABLE `termek_velemenyek`
  ADD CONSTRAINT `termek_velemenyek_ibfk_1` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `termek_velemenyek_ibfk_2` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
