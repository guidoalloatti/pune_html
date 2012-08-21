-- phpMyAdmin SQL Dump
-- version 3.3.9.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 21, 2012 at 05:59 PM
-- Server version: 5.5.9
-- PHP Version: 5.3.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `pune`
--

-- --------------------------------------------------------

--
-- Table structure for table `keys`
--

CREATE TABLE `keys` (
  `id` int(11) NOT NULL,
  `red_r` int(11) NOT NULL,
  `red_l` int(11) NOT NULL,
  `blue_r` int(11) NOT NULL,
  `blue_l` int(11) NOT NULL,
  `green_r` int(11) NOT NULL,
  `green_l` int(11) NOT NULL,
  `purple_r` int(11) NOT NULL,
  `purple_l` int(11) NOT NULL,
  `cyan_r` int(11) NOT NULL,
  `cyan_l` int(11) NOT NULL,
  `yellow_r` int(11) NOT NULL,
  `yellow_l` int(11) NOT NULL,
  `pause` int(11) NOT NULL,
  `sound` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `keys`
--

INSERT INTO `keys` VALUES(1, 56, 65, 876, 56, 987, 89, 67, 897, 67, 897, 65, 879, 546, 786);

-- --------------------------------------------------------

--
-- Table structure for table `match`
--

CREATE TABLE `match` (
  `id` int(11) NOT NULL,
  `player_1` tinyint(4) NOT NULL,
  `player_2` tinyint(4) NOT NULL,
  `player_3` tinyint(4) NOT NULL,
  `player_4` tinyint(4) NOT NULL,
  `player_5` tinyint(4) NOT NULL,
  `player_6` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `match`
--

