/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : cAuth

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/10/2017 22:22:52 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `cSessionInfo`
-- ----------------------------
DROP TABLE IF EXISTS `cSessionInfo`;
CREATE TABLE `cSessionInfo` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';

-- ----------------------------
--  Table structure for `user_info`
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wx_img` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` int(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `real_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cancel_muster_match` varchar(3000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `muster_match` varchar(3000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `regret_join_match` varchar(3000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `join_match` varchar(3000) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目用户信息';

-- ----------------------------
--  Table structure for `matchs`
-- ----------------------------
DROP TABLE IF EXISTS `matchs`;
CREATE TABLE `matchs` (
  `match_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `joinChangeTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `infoChangeTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `leader` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_numbers` int(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `min_numbers` int(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `canceled_reason` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `members` varchar(3000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `match_tips` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`match_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目比赛信息';

SET FOREIGN_KEY_CHECKS = 1;
