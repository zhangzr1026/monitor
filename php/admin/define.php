<?php
# 整站域名定义
define( 'PROJECT_URL', 'http://hacdev.vanelife.com/admin/' );

/* SMTP配置 */
//define('SMTPSERVER', 'mail.wasu.com.cn' );		//SMTP服务器
//define('SMTPSERVERPORT', '25' );				//SMTP服务器端口
//define('SMTPUSERMAIL', '"test" <vip_wasu@wasu.com.cn>' );//SMTP服务器的用户邮箱
//define('SMTPUSER', 'vip_wasu@wasu.com.cn' );	//SMTP服务器的用户帐号
//define('SMTPPASS', 'wasu1800' );				//SMTP服务器的用户密码
define('SMTPSERVER', 'smtp.163.com.' );		//SMTP服务器
define('SMTPSERVERPORT', '25' );				//SMTP服务器端口
define('SMTPUSERMAIL', '"Zhang" <zhangzr1026@163.com>' );//SMTP服务器的用户邮箱
define('SMTPUSER', 'zhangzr1026@163.com' );	//SMTP服务器的用户帐号
define('SMTPPASS', 'xxx');

//分页配置
define('ROWSPERPAGE', '10');

//简单登录配置
define('ADMINUSR', 'admin');
define('ADMINPWD', 'admin');

//产品首次发布时间
define('FIRST_PUBLISH_DATE',"2013-01-30");

//红外码相关
define('IRCODE_UPLOAD_DIR',"./UploadFile/ircode/");	//红外上传目录,请不要修改这个值

define('APPVER_UPLOAD_DIR',"./UploadFile/appver/"); //app版本目录
define('APPVER_DOWNLOAD_DIR',"./Temp/appver/"); //app版本下载目录

define('DEVVER_UPLOAD_DIR',"./UploadFile/devver/"); //dev版本目录
define('DEVVER_DOWNLOAD_DIR',"./Temp/devver/"); //dev版本下载目录

define('IRCODE_SCAN',"scan_protocol.zip");			//上传的红外压缩包解压出来的搜索库压缩包文件名
define('IRCODE_PROTOCOL',"protocol.zip");		//上传的红外压缩包解压出来的红外库压缩包名

define('AUTO_DEPLOY_TO_VAPI',TRUE);	//VAPI自动部署开关
define('IRCODE_VAPI_PATH_SCAN',"/var/www/vapi/data/light/");		//vapi红外库文件夹存储路径,更新的  "搜索库压缩包" 会拷贝到这个目录下
define('IRCODE_VAPI_PATH_PROTOCOL',"/var/www/vapi/data/");	//vapi红外库文件夹存储路径,更新的 "红外库" 会拷贝到这个目录下

define('AUTO_DEPLOY_TO_IS',FALSE);	//ForwardServer自动部署开关
define('IRCODE_IS_PATH_PROTOCOL',"/home/lucas/FowardingServer/");

define('REDIS_IP','127.0.0.1');
define('REDIS_PORT',6379);