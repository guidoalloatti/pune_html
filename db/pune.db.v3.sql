SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: pune
--


-- --------------------------------------------------------

--
-- Table structure for table `keys`
--

DROP TABLE IF EXISTS `keys`;
DROP TABLE IF EXISTS `settings`;

CREATE TABLE `keys` (
  id int NOT NULL AUTO_INCREMENT,
  red_r int(11) NULL,
  red_l int(11) NULL,
  blue_r int(11) NULL,
  blue_l int(11) NULL,
  green_r int(11) NULL,
  green_l int(11) NULL,
  purple_r int(11) NULL,
  purple_l int(11) NULL,
  cyan_r int(11) NULL,
  cyan_l int(11) NULL,
  yellow_r int(11) NULL,
  yellow_l int(11) NULL,
  pause int(11) NULL,
  sound int(11) NULL,
  match_id int(11) NULL,
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `keys`
--

INSERT INTO `keys` VALUES(1, 56, 65, 876, 56, 987, 89, 67, 897, 67, 897, 65, 879, 546, 786, 0);

-- --------------------------------------------------------

--
-- Table structure for table `match`
--

CREATE TABLE `match` (
  id int NOT NULL AUTO_INCREMENT,
  player_1 tinyint(4) NOT NULL,
  player_2 tinyint(4) NOT NULL,
  player_3 tinyint(4) NOT NULL,
  player_4 tinyint(4) NOT NULL,
  player_5 tinyint(4) NOT NULL,
  player_6 tinyint(4) NOT NULL,
  hole_points VARCHAR(20) NULL,
  gap_space VARCHAR(20) NULL,
  start_speed VARCHAR(20) NULL,
  gap_size VARCHAR(20) NULL,
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `match`
--

