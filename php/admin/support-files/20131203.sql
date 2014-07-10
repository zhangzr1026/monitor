DROP TABLE IF EXISTS `manager_role`;
CREATE TABLE `manager_role` (
  `role_name` varchar(50) NOT NULL,
  `role_audit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `manager_app`;
CREATE TABLE `manager_app` (
  `app_name` varchar(100) NOT NULL,
  `app_url` varchar(255) NOT NULL,
  PRIMARY KEY (`app_name`,`app_url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of manager_app
-- ----------------------------
INSERT INTO `manager_app` VALUES ('业务支撑平台', 'Vocational');
INSERT INTO `manager_app` VALUES ('主控管理', 'Hac');
INSERT INTO `manager_app` VALUES ('后台主页', 'Index');
INSERT INTO `manager_app` VALUES ('后台管理', 'backstage');
INSERT INTO `manager_app` VALUES ('审核平台', 'Audit');
INSERT INTO `manager_app` VALUES ('数据统计', 'Record');
INSERT INTO `manager_app` VALUES ('服务器运维监控平台', 'Jcontrol');
INSERT INTO `manager_app` VALUES ('用户管理', 'User');
INSERT INTO `manager_app` VALUES ('红外管理-版本列表', 'IrCode');
INSERT INTO `manager_app` VALUES ('红外管理-电器', 'Appliance');
INSERT INTO `manager_app` VALUES ('红外管理-红外采集', 'IrCodeGather');