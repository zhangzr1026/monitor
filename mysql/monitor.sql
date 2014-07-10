-- phpMyAdmin SQL Dump
-- version 4.0.3
-- http://www.phpmyadmin.net
--
-- 主机: 192.168.1.19
-- 生成日期: 2014 年 04 月 15 日 02:41
-- 服务器版本: 5.5.3-m3-log
-- PHP 版本: 5.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `monitor`
--
CREATE DATABASE IF NOT EXISTS `monitor` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `monitor`;

-- --------------------------------------------------------

--
-- 表的结构 `info_disk`
--

DROP TABLE IF EXISTS `info_disk`;
CREATE TABLE IF NOT EXISTS `info_disk` (
  `disk_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键主键',
  `host_id` int(11) NOT NULL,
  `disk_name` varchar(20) DEFAULT NULL COMMENT '磁盘名称',
  `disk_capacity` decimal(20,2) NOT NULL DEFAULT '0.00' COMMENT 'fdisk -l (MB)',
  `gmt_create` datetime NOT NULL COMMENT '插入时间',
  `gmt_update` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`disk_id`),
  KEY `host_id` (`host_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='文件系统磁盘巡检统计表' AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `info_disk`
--

INSERT INTO `info_disk` (`disk_id`, `host_id`, `disk_name`, `disk_capacity`, `gmt_create`, `gmt_update`) VALUES
(1, 1, 'sda', 146.00, '2014-04-03 00:00:00', '2014-04-03 00:00:00');

-- --------------------------------------------------------

--
-- 表的结构 `info_disk_history`
--

DROP TABLE IF EXISTS `info_disk_history`;
CREATE TABLE IF NOT EXISTS `info_disk_history` (
  `real_time` datetime NOT NULL,
  `disk_id` int(11) NOT NULL COMMENT '主键主键',
  `type` varchar(6) NOT NULL DEFAULT 'normal' COMMENT '采样类型:normal(正常采样),day(每天平均值),week(每周平均值),month(每周平均值)',
  `rsec` decimal(20,2) DEFAULT '0.00' COMMENT '每秒读(KB)',
  `wsec` decimal(20,2) DEFAULT '0.00' COMMENT '每秒写(KB)',
  `await` decimal(20,2) DEFAULT '0.00' COMMENT '响应时间(ms)',
  `util` decimal(5,2) DEFAULT '0.00' COMMENT '设备IO繁忙百分比',
  PRIMARY KEY (`disk_id`,`type`,`real_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文件系统磁盘巡检统计表';

--
-- 转存表中的数据 `info_disk_history`
--

INSERT INTO `info_disk_history` (`real_time`, `disk_id`, `type`, `rsec`, `wsec`, `await`, `util`) VALUES
('0000-00-00 00:00:00', 1, 'normal', 0.00, 431876.00, 117576.00, 9.99);

-- --------------------------------------------------------

--
-- 表的结构 `info_filesystem`
--

DROP TABLE IF EXISTS `info_filesystem`;
CREATE TABLE IF NOT EXISTS `info_filesystem` (
  `filesystem_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `host_id` int(11) NOT NULL,
  `filesystem_name` varchar(128) DEFAULT NULL COMMENT '文件系统名称',
  `mounted_on` varchar(128) DEFAULT NULL COMMENT '挂载路径',
  `total_size` decimal(20,2) DEFAULT NULL COMMENT '目录大小(MB)',
  `used_size` decimal(20,2) DEFAULT NULL COMMENT '已用大小(MB)',
  `space_used_percent` decimal(5,2) DEFAULT NULL COMMENT 'space已用百分比 示例：78.99',
  `gmt_create` datetime NOT NULL COMMENT '插入时间',
  `gmt_update` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`filesystem_id`),
  KEY `host_id` (`host_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='文件系统磁盘巡检统计表' AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `info_filesystem`
--

INSERT INTO `info_filesystem` (`filesystem_id`, `host_id`, `filesystem_name`, `mounted_on`, `total_size`, `used_size`, `space_used_percent`, `gmt_create`, `gmt_update`) VALUES
(1, 1, '/dev/mapper/vg_vaneserver-lv_root', '/', 431876.00, 117576.00, 99.99, '2014-04-03 00:00:00', '2014-04-03 00:00:00');

-- --------------------------------------------------------

--
-- 表的结构 `info_filesystem_history`
--

DROP TABLE IF EXISTS `info_filesystem_history`;
CREATE TABLE IF NOT EXISTS `info_filesystem_history` (
  `real_time` datetime NOT NULL,
  `filesystem_id` int(11) NOT NULL,
  `type` varchar(6) NOT NULL DEFAULT 'normal' COMMENT '采样类型:normal(正常采样),day(每天平均值),week(每周平均值),month(每周平均值)',
  `total_size` decimal(20,2) DEFAULT NULL COMMENT '目录大小(MB)',
  `used_size` decimal(20,2) DEFAULT NULL COMMENT '已用大小(MB)',
  `space_used_percent` decimal(5,2) DEFAULT NULL COMMENT 'space已用百分比 示例：78.99',
  PRIMARY KEY (`filesystem_id`,`type`,`real_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文件系统磁盘巡检统计表';

--
-- 转存表中的数据 `info_filesystem_history`
--

INSERT INTO `info_filesystem_history` (`real_time`, `filesystem_id`, `type`, `total_size`, `used_size`, `space_used_percent`) VALUES
('2014-04-15 06:10:01', 1, 'normal', 431876.00, 117576.00, 9.99);

-- --------------------------------------------------------

--
-- 表的结构 `info_host`
--

DROP TABLE IF EXISTS `info_host`;
CREATE TABLE IF NOT EXISTS `info_host` (
  `host_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `hostname` varchar(80) DEFAULT NULL COMMENT '主机名称',
  `last_hours` bigint(8) DEFAULT '0' COMMENT '在线时长',
  `cpu_usage` varchar(16) DEFAULT NULL,
  `os_load` float(7,2) DEFAULT NULL,
  `hostip` varchar(16) NOT NULL COMMENT '机器的固定ip',
  `dracip` varchar(16) DEFAULT '127.0.0.1' COMMENT '服务器dracip',
  `dracuser` varchar(10) DEFAULT 'root' COMMENT 'drac操作帐号',
  `dracpasswd` varchar(256) DEFAULT 'mima123456' COMMENT 'drac帐号密码',
  `os_type` varchar(128) DEFAULT NULL COMMENT 'linux|aix|hp-ux',
  `kernel` varchar(128) DEFAULT NULL COMMENT '通过【uname -r】获取',
  `distribute_id` varchar(128) DEFAULT NULL COMMENT '记录操作系统的发行版本',
  `physical_mem` mediumint(11) DEFAULT NULL COMMENT '单位mb',
  `swap_size` mediumint(11) DEFAULT NULL COMMENT '单位mb',
  `cpu_ghz` varchar(64) DEFAULT NULL COMMENT 'cpu频率(GHZ)',
  `cpu_model_name` varchar(128) DEFAULT NULL COMMENT 'cpu厂商信息',
  `cpu_num` smallint(6) DEFAULT NULL COMMENT 'cpu数量【逻辑】',
  `status` varchar(8) NOT NULL DEFAULT 'online' COMMENT 'offline|online',
  `offline_time` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `online_time` datetime DEFAULT NULL,
  `ssh_port` int(10) DEFAULT NULL COMMENT 'ssh建立的端口，默认为22',
  `gmt_create` datetime DEFAULT NULL,
  `gmt_update` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`host_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `info_host`
--

INSERT INTO `info_host` (`host_id`, `hostname`, `last_hours`, `cpu_usage`, `os_load`, `hostip`, `dracip`, `dracuser`, `dracpasswd`, `os_type`, `kernel`, `distribute_id`, `physical_mem`, `swap_size`, `cpu_ghz`, `cpu_model_name`, `cpu_num`, `status`, `offline_time`, `description`, `online_time`, `ssh_port`, `gmt_create`, `gmt_update`) VALUES
(1, 'server11', 5, '83.6', 1.20, '10.0.0.11', '127.0.0.1', 'root', 'qguard123456', 'linux', '2.6.32-279.9.1.el6.x86_64', 'ubuntu', 8052, 8192, '2133', 'Intel', 4, 'online', '2014-04-01 00:00:00', '入口服务器', '2014-04-03 13:42:07', 22, '2014-04-01 00:00:00', '2014-04-03 00:00:00');

-- --------------------------------------------------------

--
-- 表的结构 `info_host_history`
--

DROP TABLE IF EXISTS `info_host_history`;
CREATE TABLE IF NOT EXISTS `info_host_history` (
  `real_time` datetime NOT NULL,
  `host_id` int(10) unsigned NOT NULL,
  `type` varchar(6) NOT NULL DEFAULT 'normal' COMMENT '采样类型:normal(正常采样),day(每天平均值),week(每周平均值),month(每周平均值)',
  `load_average` float(7,2) NOT NULL DEFAULT '0.00' COMMENT 'top',
  `cpu_user` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '百分比',
  `cpu_sys` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '百分比',
  `cpu_nice` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '百分比',
  `cpu_idle` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '百分比',
  `cpu_iowait` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '百分比',
  `memory_used` int(11) DEFAULT '0' COMMENT 'free (MB)',
  `memory_free` int(11) NOT NULL DEFAULT '0',
  `memory_buffers` int(11) NOT NULL DEFAULT '0',
  `memory_cached` int(11) NOT NULL DEFAULT '0',
  `swap_used` int(11) NOT NULL DEFAULT '0',
  `swap_free` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`host_id`,`type`,`real_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='memory,cpu infomation';

--
-- 转存表中的数据 `info_host_history`
--

INSERT INTO `info_host_history` (`real_time`, `host_id`, `type`, `load_average`, `cpu_user`, `cpu_sys`, `cpu_nice`, `cpu_idle`, `cpu_iowait`, `memory_used`, `memory_free`, `memory_buffers`, `memory_cached`, `swap_used`, `swap_free`) VALUES
('2014-04-30 00:00:00', 1, 'normal', 0.00, 0.00, 0.00, 0.00, 97.00, 0.00, 1, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `info_networkcard`
--

DROP TABLE IF EXISTS `info_networkcard`;
CREATE TABLE IF NOT EXISTS `info_networkcard` (
  `networkcard_id` int(11) NOT NULL AUTO_INCREMENT,
  `host_id` int(11) NOT NULL,
  `networkcard_name` varchar(20) DEFAULT NULL COMMENT 'ifconfig',
  `ip_address` varchar(16) DEFAULT NULL,
  `gmt_create` datetime DEFAULT NULL COMMENT '插入时间',
  `gmt_update` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`networkcard_id`),
  KEY `host_id` (`host_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='文件系统磁盘巡检统计表' AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `info_networkcard`
--

INSERT INTO `info_networkcard` (`networkcard_id`, `host_id`, `networkcard_name`, `ip_address`, `gmt_create`, `gmt_update`) VALUES
(1, 1, 'sda', '146', '2014-04-03 00:00:00', '2014-04-03 00:00:00');

-- --------------------------------------------------------

--
-- 表的结构 `info_networkcard_history`
--

DROP TABLE IF EXISTS `info_networkcard_history`;
CREATE TABLE IF NOT EXISTS `info_networkcard_history` (
  `real_time` datetime NOT NULL,
  `networkcard_id` int(11) NOT NULL COMMENT 'sar  -n DEV',
  `type` varchar(6) NOT NULL DEFAULT 'normal' COMMENT '采样类型:normal(正常采样),day(每天平均值),week(每周平均值),month(每周平均值)',
  `rxpck` decimal(20,2) DEFAULT '0.00' COMMENT '每秒接收(packet)',
  `txpck` decimal(20,2) DEFAULT '0.00' COMMENT '每秒发送(packet)',
  `rxkb` decimal(20,2) DEFAULT '0.00' COMMENT '每秒接收(KB)',
  `txkb` decimal(20,2) DEFAULT '0.00' COMMENT '每秒发送(KB)',
  PRIMARY KEY (`networkcard_id`),
  KEY `host_id` (`type`),
  KEY `host_id_2` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文件系统磁盘巡检统计表';

--
-- 转存表中的数据 `info_networkcard_history`
--

INSERT INTO `info_networkcard_history` (`real_time`, `networkcard_id`, `type`, `rxpck`, `txpck`, `rxkb`, `txkb`) VALUES
('0000-00-00 00:00:00', 1, '1', 0.00, 431876.00, 117576.00, 29.00);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
