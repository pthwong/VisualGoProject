-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 25, 2023 at 11:09 PM
-- Server version: 10.3.32-MariaDB
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `VisualGoDB`
--
CREATE DATABASE IF NOT EXISTS `VisualGoDB` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `VisualGoDB`;

-- --------------------------------------------------------

--
-- Table structure for table `District`
--

DROP TABLE IF EXISTS `District`;
CREATE TABLE IF NOT EXISTS `District` (
  `districtID` varchar(3) NOT NULL,
  `districtName` varchar(50) NOT NULL,
  PRIMARY KEY (`districtID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `District`
--

INSERT INTO `District` (`districtID`, `districtName`) VALUES
('CEW', '中西'),
('EAS', '東'),
('HOK', '香港'),
('ISL', '離島'),
('KOC', '九龍城'),
('KWA', '葵青'),
('KWT', '觀塘'),
('NOR', '北'),
('SAK', '西貢'),
('SHT', '沙田'),
('SOU', '南區'),
('SSP', '深水埗'),
('TAP', '大埔'),
('TSW', '荃灣'),
('TUM', '屯門'),
('WAC', '灣仔'),
('WTS', '黃大仙'),
('YTM', '油尖旺'),
('YUL', '元朗');

-- --------------------------------------------------------

--
-- Table structure for table `News`
--

DROP TABLE IF EXISTS `News`;
CREATE TABLE IF NOT EXISTS `News` (
  `postID` int(11) NOT NULL AUTO_INCREMENT,
  `postTitle` varchar(100) NOT NULL,
  `postDescribe` varchar(2000) DEFAULT NULL,
  `postStartDateTime` datetime NOT NULL,
  `postEndDateTime` datetime NOT NULL,
  `postBuilding` varchar(50) DEFAULT NULL,
  `districtID` varchar(3) NOT NULL,
  `vtEmail` varchar(50) NOT NULL,
  PRIMARY KEY (`postID`),
  KEY `FK_News_vtEmail` (`vtEmail`) USING BTREE,
  KEY `FK_News_districtID` (`districtID`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `News`
--

INSERT INTO `News` (`postID`, `postTitle`, `postDescribe`, `postStartDateTime`, `postEndDateTime`, `postBuilding`, `districtID`, `vtEmail`) VALUES
(1, 'B樓食水暫停供應', '緊急維修', '2023-05-20 18:00:00', '2023-05-21 06:00:00', '茵翠苑', 'EAS', 'test@gmail.com'),
(2, '使用2023年第一期消費券', '2023年4月16日開始', '2023-04-16 00:00:00', '2023-07-16 00:00:00', '', 'HOK', 'test@gmail.com'),
(3, '12座13樓食水暫停供應', '例行維修', '2023-05-20 13:00:00', '2023-05-20 18:00:00', '采頤花園', 'WTS', 'test@gmail.com'),
(4, 'C樓食水暫停供應', '例行維修', '2022-04-29 20:10:51', '2022-04-30 20:10:51', NULL, 'WTS', 'test@gmail.com'),
(65, 'HelloWorld', NULL, '2023-05-06 09:36:00', '2023-05-06 09:40:00', '15W大樓', 'SHT', 'test@gmail.com'),
(67, 'HelloWorld', 'XXXX', '2023-05-06 09:36:00', '2023-05-06 09:40:00', '15W大樓', 'SHT', 'test@gmail.com'),
(68, 'Water problem', 'Water prob?', '2023-05-06 10:39:00', '2023-05-06 14:00:00', '+WOO 嘉湖一期', 'YUL', 'test@gmail.com'),
(71, 'HelloWorld11', '', '2023-05-06 12:30:00', '2023-05-09 13:30:00', '+WOO 嘉湖二期', 'YUL', 'visualgo202205@gmail.com'),
(72, 'HelloWorld', '', '2023-05-06 08:40:00', '2023-05-06 09:00:00', NULL, 'SSP', 'test@gmail.com'),
(73, 'HelloWorld2', 'Test', '2023-05-06 08:50:00', '2023-05-07 08:50:00', NULL, 'WTS', 'test@gmail.com'),
(74, 'Hello', '', '2023-05-06 21:00:00', '2023-05-07 23:00:00', NULL, 'KWT', 'test@gmail.com'),
(75, '000', '', '2023-05-07 14:24:00', '2023-05-07 14:29:00', NULL, 'WTS', 'test@gmail.com'),
(77, 'Testing fire', 'Fire alarm', '2023-05-08 18:00:38', '2023-05-08 20:00:45', '1亞太中心', 'KWT', 'visualgo202205@gmail.com'),
(78, 'Testing', '', '2023-05-15 17:15:00', '2023-05-15 18:00:00', '108商場', 'TAP', 'test@gmail.com'),
(79, '測試', '', '2023-05-12 18:52:15', '2023-05-12 19:52:19', '1-5座停車場', 'ISL', 'visualgo202205@gmail.com'),
(80, '爆水管', '', '2023-05-21 17:30:00', '2023-05-21 23:00:00', '彩虹邨', 'WTS', 'test@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `Nutrition`
--

DROP TABLE IF EXISTS `Nutrition`;
CREATE TABLE IF NOT EXISTS `Nutrition` (
  `nutritionID` int(50) NOT NULL AUTO_INCREMENT,
  `productBarcode` varchar(20) NOT NULL,
  `ingredients` varchar(200) DEFAULT NULL,
  `servings` varchar(100) DEFAULT NULL,
  `energy` varchar(10) DEFAULT NULL,
  `energy_kcal` varchar(10) DEFAULT NULL,
  `fat` varchar(10) DEFAULT NULL,
  `saturated_fat` varchar(10) DEFAULT NULL,
  `trans_fat` varchar(10) DEFAULT NULL,
  `cholesterol` varchar(10) DEFAULT NULL,
  `carbohydrates` varchar(10) DEFAULT NULL,
  `sugars` varchar(10) DEFAULT NULL,
  `fiber` varchar(10) DEFAULT NULL,
  `proteins` varchar(10) DEFAULT NULL,
  `sodium` varchar(10) DEFAULT NULL,
  `vitamin_a` varchar(10) DEFAULT NULL,
  `vitamin_c` varchar(10) DEFAULT NULL,
  `calcium` varchar(10) DEFAULT NULL,
  `iron` varchar(10) DEFAULT NULL,
  `vtEmail` varchar(50) NOT NULL,
  PRIMARY KEY (`nutritionID`),
  KEY `FK_Nutrition_productBarcode` (`productBarcode`),
  KEY `vtEmail` (`vtEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Nutrition`
--

INSERT INTO `Nutrition` (`nutritionID`, `productBarcode`, `ingredients`, `servings`, `energy`, `energy_kcal`, `fat`, `saturated_fat`, `trans_fat`, `cholesterol`, `carbohydrates`, `sugars`, `fiber`, `proteins`, `sodium`, `vitamin_a`, `vitamin_c`, `calcium`, `iron`, `vtEmail`) VALUES
(1, '7313161311360', '', '每100克', '1200千焦', '280千卡', '27克', '2克', '', '', '8.4克', '7克', '', '0.8克', '0.16克', '', '', '', '', 'test@gmail.com'),
(2, '726003023326', '醋(米, 水), 酸度調節劑, 食用色素(E129)', '每100克', '67千焦耳', '16千卡', '0克', '0克', '0克', '1克', '0克', '0克', '0克', '0.6克', '473毫克', '', '', '', '', 'test@gmail.com'),
(3, '4902555207032', '', '每100克', '745千焦', '178千卡', '0克', '0克', '', '', '44克', '42克', '', '0.59克', '12.8毫克', '', '', '', '', 'test@gmail.com'),
(4, '078895128789', '水, 鹽, 大豆, 白糖, 小麥粉, 色素(E150a) , 增味劑(E631, E627)', '每100克', '61千焦', '67千卡', '0克', '0克', '', '', '13.33克', '13.33克', '0克', '6.67克', '7.67克', '', '', '', '', 'test@gmail.com'),
(5, '7613034626844', '麥 巧克力', '每100克', '1625千焦', '385千卡', '4.6克', '1.4克', '', '', '73.3克', '24.9克', '9克', '8.6克', '0.088克', '', '', '0.483克', '0.012克', 'test@gmail.com'),
(6, '078895210118', '', '每100克', '3487千焦', '833.33千卡', '93.33克', '15克', '0克', '0克', '0克', '0克', '0克', '0克', '0克', '0克', '0克', '0克', '0克', 'test@gmail.com'),
(7, '8715700407760', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'test@gmail.com'),
(8, '4892214252445', '茶', '', '0', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'test@gmail.com'),
(9, '078895132908', '', '每100克', '402千焦', '96千卡', '0.5克', '0.1克', '0克', '', '12克', '8.9克', '', '9.6克', '6.68克', '', '', '', '', 'test@gmail.com'),
(11, '078895121599', '大豆油、江瑤柱、中華火腿（豬肉、鹽）水、乾蝦、蠔油（水、白糖、鹽、蠔汁（蠔、水、鹽）、改性粟米澱粉、色素（E150a））、鮑魚、辣椒、水、大蒜、白糖、香料、鹽。含大豆、甲殼類動物製品、天然存在亞硫酸鹽。', '10克', '64千卡', '', '6.2克', '1.1克', '0.1克', '', '0.6克', '0.3克', '', '', '149毫克', '', '', '', '', 'test@gmail.com'),
(12, '9300644121156', '', '每100克', '5大卡', '', '0.2公克', '0.2公克', '0公克', '0毫克', '0.3公克', '0公克', '', '0.6公克', '470毫克', '', '', '', '', 'test@gmail.com'),
(13, '4891133140550', '', '-', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'test@gmail.com'),
(14, '8857125746519', '', '盒', '390kcal', '', '5g', '3g', '0g', '', '70g', '3g', '', '16g', '510mg', '', '', '', '', 'test@gmail.com'),
(20, '4892688881776', '', '', '', '100千卡', '4.9克', '', '0克', '', '13.6克', '1.8 g', '0.3 克', '', '161毫克', '', '', '', '', 'test@gmail.com'),
(21, '6914557181119', '', '30克', '', '162千卡', '9.3克', '4.1克', '0克', '0毫克', '18.5克', '0.2克', '1.1克', '0.9克', '200毫克', '', '', '', '', 'test@gmail.com'),
(22, '4891118075501', '', '', '1573', '101 kcal', '3.4 g', '1.5 g', '', '', '54 g', '', '1.9 g', '', '39 mg', '', '', '', '', 'test@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
CREATE TABLE IF NOT EXISTS `Product` (
  `productBarcode` varchar(20) NOT NULL,
  `productBrand` varchar(200) DEFAULT NULL,
  `productName` varchar(200) NOT NULL,
  `productDesc` varchar(200) DEFAULT NULL,
  `productCountry` varchar(200) DEFAULT NULL,
  `productUnit` varchar(200) DEFAULT NULL,
  `tagName` varchar(50) DEFAULT NULL,
  `bestBefore` date DEFAULT NULL,
  `eatBefore` date DEFAULT NULL,
  `useBefore` date DEFAULT NULL,
  `vtEmail` varchar(50) NOT NULL,
  PRIMARY KEY (`productBarcode`),
  KEY `vtEmail` (`vtEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Product`
--

INSERT INTO `Product` (`productBarcode`, `productBrand`, `productName`, `productDesc`, `productCountry`, `productUnit`, `tagName`, `bestBefore`, `eatBefore`, `useBefore`, `vtEmail`) VALUES
('', '', '', '', '', '', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('011210000018', 'Tabasco,Mc. Ilhenny Co.', '經典Tabasco', '經典Tabasco', '美國', '59毫升', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('078895121599', '李錦記', '李錦記極品鮑魚XO醬 80克', '李錦記極品鮑魚XO醬選用上等火腿、干貝(江瑤柱)、乾蝦及鮑魚等精製而成。瑤柱味鮮，鮑魚味美。食法變化多端，此醬既為餐前或伴酒小食之極品，亦適合伴食各款佳餚、點心、粉麵、粥品及日本壽司，更可用於烹調任何菜式，炒飯等。', '中國', '81克', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('078895126396', '李錦記', '特鮮生抽', '', '', '', 'SoySauce', NULL, NULL, NULL, 'test@gmail.com'),
('078895128789', '李錦記', '李錦記鮮味生抽 500ml', '信心保證', '中國', '500毫升', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('078895132908', '李錦記', '李錦記雙璜醇釀頭抽 500毫升', '李錦記雙璜醇釀頭抽，嚴選上乘豉油代替鹽水，以古法雙重發酵，經歷6個月天然釀造，完全不用添加劑，亦能倍發濃郁豉香，雙倍鮮味，吃得加倍安心。', '中國', '500毫升', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('078895149739', '李錦記', '李錦記辣椒醬直立唧唧裝 160克', '李錦記辣椒醬，其特點為酸辛帶辣，伴食肉類，海鮮或蔬菜必令胃口大增，亦可配炒粉麵、雞肉、豆腐或各式點心，別具滋味。', '中國', '160克', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('078895210118', '李錦記', '李錦記純香芝麻油 115毫升', '李錦記純正芝麻油，100%純正，香味特濃。涼拌、灼菜、醃肉或做湯羮都不能欠缺它。', '中國', '115毫升', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('078895406528', '李錦記', '李錦記XO醬80克 X6件', '李錦記XO醬選用上等干貝(江瑤柱)、幹蝦等材料精製而成，食法千變萬化。XO醬既為餐前或伴酒小食之極品，亦適合伴食各款佳餚、中式點心、粉面、粥品及日本壽司，更可用於烹調肉類、蔬菜、海鮮、豆腐、炒飯等等。', '中國', '70克', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('4571153080721', 'GYUKAKU', 'GYUKAKU', NULL, 'Japan', NULL, '', '2024-01-15', NULL, NULL, 'test@gmail.com'),
('4890008100231', '可口可樂', '「可口可樂」汽水500毫升', '「可口可樂」汽水500毫升', '香港', '500毫升', '', NULL, NULL, NULL, 'test@gmail.com'),
('4890008109302', '零系可口可樂', '「零系可口可樂」汽水 330毫升', '「零系可口可樂」汽水 330毫升', '香港', '330毫升', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('4891028164616', '維他', '檸檬茶375毫升', NULL, '香港', '375毫升', 'LemonTea', NULL, NULL, NULL, 'test@gmail.com'),
('4891118075501', NULL, 'Koko Krunch Breakfast Cereal Bar', NULL, NULL, '', '', NULL, NULL, NULL, 'test@gmail.com'),
('4891133140550', '屈臣氏', '蒸餾水', '給你安心承諾', '', '430ML', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('4891133140895', '屈臣氏', '屈臣氏蒸餾水(800毫升)', NULL, '香港', '800 毫升', '', NULL, NULL, NULL, 'test@gmail.com'),
('4892214252445', '道地', '道地極品清。烏龍茶 500毫升', '樽裝', '中國', '500毫升', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('4892368640006', NULL, 'AXION Ultra Washer', NULL, NULL, '500 ml', '', NULL, NULL, '2024-03-30', 'test@gmail.com'),
('4892688881776', '明輝', '明輝印尼蝦片（原味）', NULL, '香港', '20克', '', '2023-07-19', NULL, NULL, 'test@gmail.com'),
('4894251001567', 'ITO', 'ITO 芝麻梳打餅', 'ITO 芝麻梳打餅  480g 12x1', '中國', '1個', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('4894251003240', '菓子町園道', '黑芝麻梳打餅', '黑芝麻梳打餅', '中國', '360克', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('4895157218226', '私+呵護', '殺菌消毒濕紙巾10片(酒精)', '殺菌消毒濕紙巾10片(酒精)', '中國', '10 件', '', '2025-03-08', NULL, NULL, 'test@gmail.com'),
('4897007720156', '康而健 都市漢方', '康而健 都市漢方 肉蓯蓉60粒', '調節身體機能\n固本培元\n補腰養腎\n舒解腰膝酸軟', '香港', '230克', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('4897007720217', '康而健 健知己', '康而健 健知己 巴西綠蜂膠液30ml', '殺菌、消炎、提升免疫力、抗氧化、延緩衰老、喉嚨不適、牙齦不適、口瘡、痱滋、胃部不適、強化肝臟、鎮定安神、消除疲勞\n\n純天然蜂膠提取、不含人工色素及防腐劑', '巴西', '220克', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('4897087270008', '雅和然', '雅和然原生除菌液 - 60ml', '60ml ', '香港', '60 毫升', '', '2023-09-08', NULL, NULL, 'test@gmail.com'),
('4897087270015', '雅和然', '雅和然原生除菌液 - 250ml', '250ml ', '香港', '250 毫升', '', '2023-05-19', NULL, NULL, 'test@gmail.com'),
('4897878920020', '日清出前一丁', '日清出前一丁棒烏冬鰹魚湯味烏冬', '烏冬', '香港', '159 克', '', '2023-09-28', NULL, NULL, 'test@gmail.com'),
('4898828011058', '家樂牌', '雞粉', '', '', '', 'ChickenPowder', NULL, NULL, NULL, 'test@gmail.com'),
('4898828031018', '家樂牌', '鷹栗粉', '含有二氧化硫', '中國', '210克', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('4898828031025', '家樂牌', '鷹粟粉', '', '', '', 'CornStarch', NULL, NULL, NULL, 'test@gmail.com'),
('4902555207032', '不二家', '白桃汁', '花蜜pêche', '', '380 GM', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('6901012021387', '鷹金錢', '豆豉鯪魚', '', '', '', 'FriedDace', NULL, NULL, NULL, 'test@gmail.com'),
('6914557181119', '珍珍', '珍珍薯圈（煙肉味）', NULL, '香港', '30克', '', '2023-06-20', NULL, NULL, 'test@gmail.com'),
('726003023326', '同珍', '大紅浙醋', '百年經典 香港製造', '中國香港', '300毫升', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('7313161311360', 'Rydbergs', 'Rydberg Rodbetssallad (Rydberg的紅沙拉)', '', '', '200 g', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('7613034626844', 'Nestlé', 'Nestle Chocapic Cereals 430g (雀巢Chocapic穀物430g)', '', '法國', '430 g', NULL, NULL, NULL, NULL, 'visualgo202205@gmail.com'),
('8715700407760', 'Heinz', 'Tomato Ketchup BIO (番茄醬)', '', '', '580克', NULL, NULL, NULL, NULL, 'visualgo202205@gmail.com'),
('8809446380330', NULL, 'Wet Tissue', NULL, NULL, '', '', NULL, NULL, NULL, 'test@gmail.com'),
('8850329073610', 'Meiji', 'Meiji Milk', NULL, 'Japan', '976 ml', '', NULL, NULL, NULL, 'visualgo202205@gmail.com'),
('8857125746519', 'CHIMDOO', '泰國茉莉花香米配馬沙文咖哩雞即食飯', '', '泰國', '260g', NULL, NULL, NULL, NULL, 'visualgo202205@gmail.com'),
('8887259882388', 'eg-pro', '新加坡鮮雞蛋', '', '', '10\'S', NULL, NULL, NULL, NULL, 'visualgo202205@gmail.com'),
('889497000164', 'Juicy Juice,Harvest Hill Beverage Company', 'Peach apple juice (桃蘋果汁)', '', '美國', '', NULL, NULL, NULL, NULL, 'test@gmail.com'),
('9300644121156', '史雲生', '清雞湯', '靚雞熬足3小時', '中國', '500毫升', 'ChickenSoup', NULL, NULL, NULL, 'test@gmail.com'),
('9555768900105', 'Musang', 'White Coffee', 'Coffee', 'Malaysia', '300g', NULL, NULL, NULL, NULL, 'test@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `VisuallyImpairedUser`
--

DROP TABLE IF EXISTS `VisuallyImpairedUser`;
CREATE TABLE IF NOT EXISTS `VisuallyImpairedUser` (
  `viEmail` varchar(50) NOT NULL,
  `viPw` varchar(50) NOT NULL,
  `viName` varchar(100) NOT NULL,
  `districtID` varchar(3) NOT NULL,
  `viBuilding` varchar(50) DEFAULT '未設定',
  PRIMARY KEY (`viEmail`),
  KEY `FK_VisuallyImpairedUser_districtID` (`districtID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `VisuallyImpairedUser`
--

INSERT INTO `VisuallyImpairedUser` (`viEmail`, `viPw`, `viName`, `districtID`, `viBuilding`) VALUES
('adobexdgroup4@gmail.com', '12345678', 'John', 'WTS', '未設定'),
('guest@gmail.com', 'visualgo', '訪客', 'WTS', '未設定'),
('test@gmail.com', '12345678', 'Nathan', 'WTS', '乘龍閣'),
('visualgo202201@gmail.com', '12345678', 'May', 'WTS', '趣園樓'),
('visualgo202202@gmail.com', '12345678', 'John', 'WTS', '茵翠苑');

-- --------------------------------------------------------

--
-- Table structure for table `VolunteerUser`
--

DROP TABLE IF EXISTS `VolunteerUser`;
CREATE TABLE IF NOT EXISTS `VolunteerUser` (
  `vtEmail` varchar(50) NOT NULL,
  `vtPw` varchar(50) NOT NULL,
  `vtName` varchar(100) NOT NULL,
  `districtID` varchar(3) DEFAULT NULL,
  `vtBuilding` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`vtEmail`),
  KEY `FK_VolunteerUser_districtID` (`districtID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `VolunteerUser`
--

INSERT INTO `VolunteerUser` (`vtEmail`, `vtPw`, `vtName`, `districtID`, `vtBuilding`) VALUES
('test@gmail.com', '12345678', 'Jason', 'KWA', '乘龍閣'),
('visualgo202205@gmail.com', '12345678', 'Mary', 'SSP', '富欣花園');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Product`
--
ALTER TABLE `Product` ADD FULLTEXT KEY `productBarcode` (`productBarcode`,`productBrand`,`productName`,`productDesc`,`productCountry`,`productUnit`,`tagName`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `News`
--
ALTER TABLE `News`
  ADD CONSTRAINT `FK_News_districtID` FOREIGN KEY (`districtID`) REFERENCES `District` (`districtID`),
  ADD CONSTRAINT `FK_News_vtEmail` FOREIGN KEY (`vtEmail`) REFERENCES `VolunteerUser` (`vtEmail`);

--
-- Constraints for table `Nutrition`
--
ALTER TABLE `Nutrition`
  ADD CONSTRAINT `FK_Nutrition_productBarcode` FOREIGN KEY (`productBarcode`) REFERENCES `Product` (`productBarcode`),
  ADD CONSTRAINT `Nutrition_ibfk_1` FOREIGN KEY (`vtEmail`) REFERENCES `VolunteerUser` (`vtEmail`);

--
-- Constraints for table `Product`
--
ALTER TABLE `Product`
  ADD CONSTRAINT `Product_ibfk_1` FOREIGN KEY (`vtEmail`) REFERENCES `VolunteerUser` (`vtEmail`);

--
-- Constraints for table `VisuallyImpairedUser`
--
ALTER TABLE `VisuallyImpairedUser`
  ADD CONSTRAINT `FK_ VisuallyImpairedUser_districtID` FOREIGN KEY (`districtID`) REFERENCES `District` (`districtID`);

--
-- Constraints for table `VolunteerUser`
--
ALTER TABLE `VolunteerUser`
  ADD CONSTRAINT `FK_VolunteerUser_districtID` FOREIGN KEY (`districtID`) REFERENCES `District` (`districtID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
