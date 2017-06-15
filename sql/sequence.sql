SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS mvnndata DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

use mvnndata;

-- ----------------------------
--  Table structure for `seqMysql`
-- ----------------------------
DROP TABLE IF EXISTS `seqMysql`;
CREATE TABLE `seqMysql` (
  `seqname` varchar(50) NOT NULL,
  `currentValue` bigint(20) NOT NULL,
  `increment` int(11) NOT NULL DEFAULT '1',
  `max` bigint(20) NOT NULL DEFAULT '99999999',
  PRIMARY KEY (`seqname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `seqMysql`
-- ----------------------------
BEGIN;
INSERT INTO `seqMysql` VALUES ('userIDSeq', '0', '1', '99999999');
COMMIT;

-- ----------------------------
--  Function structure for `currval`
-- ----------------------------
DROP FUNCTION IF EXISTS `currval`;
delimiter ;;
CREATE DEFINER=`root`@`%` FUNCTION `currval`(seq_name VARCHAR(50)) RETURNS int(11)
BEGIN
  DECLARE current INTEGER;
  SET current = 0;
  SELECT currentValue INTO current
  FROM seqMysql
  WHERE seqname = seq_name;
  RETURN current;
END
 ;;
delimiter ;

-- ----------------------------
--  Function structure for `nextval`
-- ----------------------------
DROP FUNCTION IF EXISTS `nextval`;
delimiter ;;
CREATE DEFINER=`root`@`%` FUNCTION `nextval`(seq_name VARCHAR(50)) RETURNS int(11)
BEGIN
  UPDATE seqMysql
    SET currentValue = CASE
    WHEN currentValue + increment > max THEN 1
    ELSE currentValue + increment
    END
  WHERE seqname =  seq_name;
  RETURN currval(seq_name);
END
 ;;
delimiter ;

-- ----------------------------
--  Function structure for `setval`
-- ----------------------------
DROP FUNCTION IF EXISTS `setval`;
delimiter ;;
CREATE DEFINER=`root`@`%` FUNCTION `setval`(seq_name VARCHAR(50), value INTEGER) RETURNS int(11)
BEGIN
   UPDATE seqMysql
   SET currentValue = value
   WHERE seqname = seq_name;
   RETURN currval(seq_name);
END
 ;;
delimiter ;
