<?php
#	调试信息
@set_time_limit( 0 ) ;
ini_set( "memory_limit", '-1' ) ;
define( 'NO_CACHE_RUNTIME', True ) ;
#define('RUNTIME_ALLINONE', true);

#	定义项目名称和路径
define( 'APP_NAME', 'Core' ) ;
define( 'APP_PATH', './Core' ) ;
#加载配置文件
require ('./define.php');
#	修改Thinkphp常量 : 模板路径 . 缓存路径
define('RUNTIME_PATH','./Temp/');
//define( 'TMPL_PATH', './Templates/' ) ;
#	定义ThinkPHP框架路径(相对于入口文件)
define( 'THINK_PATH', '../ThinkPHP' ) ;
#	加载框架入口文件 
require (THINK_PATH . "/ThinkPHP.php") ;
#	实例化一个网站应用实例
App::run() ;
?>
