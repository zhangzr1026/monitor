<?php
/**
 * 
 * 程序配置
 */
return array(
	//'配置项'=>'配置值'
	'APP_DEBUG' 		=> false,
	'HTML_CACHE_ON'		=> false,
	'TMPL_CACHE_ON'		=> false,
	'ACTION_CACHE_ON'	=> false,
	'DB_FIELD_CACHE'	=> false,

	/* DataBase设置 */
	'DB_TYPE' 				=> 'mysql' , 
	'DB_HOST' 				=> '192.168.1.19' , 
	'DB_USER' 				=> 'admin' , 
	'DB_PWD' 				=> 'admin' , 
	'DB_PORT' 				=> '3306' , 
	'DB_NAME' 				=> 'vaneserver',
	'DB_PREFIX' 				=> '',

	'DB_BG_NAME'			=> 'vanelife_test',    //后台登录用户的数据库

	//'URL_MODEL'				=> '2',

	'DEFAULT_THEME'      => 'newstyle',
	
	//红外流程
	'IRCODE_GATHER_FLOW'=> array(
		array(
			"id"	=> 0,
			"tag" 	=> "已需求",
			"enable"=> FALSE,
		),
		array(
			"id"	=> 1,
			"tag" 	=> "已采集",
			"enable"=> FALSE,
		),
		array(
			"id"	=> 2,
			"tag" 	=> "已测试",
			"enable"=> FALSE,
		)
	),

	'IF_PARAM'				=> array(         //接口测试参数配置，通过添加数组数据增加测试参数
		array(
			'IF_url'	=>  'http://192.168.1.12:5555',  //'http://test.api.vanelife.com',				  //接口的地址(域名)
			'IF_db'		=> array(			  //接口所在数据库的配置
				'IF_db_host' => '192.168.1.19',			  //数据库主机
				'IF_db_user' => 'admin',			  //数据库的用户名
				'IF_db_pwd'  => 'admin',			  //数据库的密码
				'IF_db_port' => '3306',
				'IF_db_name' => 'vaneserver'	  //数据库名
			),
			'IF_user_account' => 'vinterface@163.com',	  //测试的用户账户(申请开放平台时注册的用户)
			'IF_user_pwd'	  => 't12345678',		  //测试的用户密码
			'IF_app_key'	  => 'FFA044B0A6FA791ED5378C12C75F09CE',
			'IF_app_secret'	  => '9AC672D4290F80E34E2DFB60D166E853',
			'IF_device_sn'	  => 'device13878482471',						//device+时间戳+1
			'IF_device_key'	  => '123456',
			'IF_device_info'  => '',
			'IF_device_status' => array(
				'battery'	=> 70,
				'signal'	=> 40,
				'online'	=> true
			),
			'IF_access_id'	=> '',
			'IF_ep_id'		=> 'ep13878540101',				//ep+时间戳+1
			'IF_ep_type'	=> 0,
			'IF_ep_info'	=> '',
			'IF_ep_status'	=> array(
				'battery'	=> 70,
				'signal'	=> 40,
				'online'	=> true
			),
			'IF_dp_id'		=> '001',
			'IF_dp_info'	=> '',
			'IF_dp_mode'	=> 'rw',
			'IF_dp_type'	=> 'raw',
			'IF_dp_schema'	=> '',
			'IF_dp_desc'	=> '',
			'IF_dp_name'	=> 'dp_data.txt',				//数据索引，上传的文件名
			
			'IF_start'		=> '2014-05-24T14:36:19',
			'IF_end'		=> '2014-05-29T14:36:19',

			'IF_upload_dp'	=> '@/var/www/dp_data.txt',			//需上传的传感器文件地址，需绝对地址。


			
			/************** 以下是新增的接口参数配置 *********************/
			//'IF_new_url'		    => 'http://192.168.1.19:6001',                //新接口的测试地址

			'user_mobile_num'		=> '13588888888',
			'user_mobile_checknum'	=> '66',
			'user_passwd'			=> 't12345678',
			'user_old_passwd'		=> 't12345678',
			'user_new_passwd'		=> 't12345678',

			'user_token'			=> '',											//token在用户登录时会自动生成，并对其余接口的token参数补齐

			'gw_list'				=> '[{"app_id":"app_id_data","meta_datas":"ffdfd"}]',
			'gw_updatelist'			=> '[{"old_app_id":"old_app_id_data","new_app_id":"new_app_id_data","meta_datas": "yyyyy"}]',

			'app_id_list'			=> '[{"app_id":"app_id_data"}]',

			'configfile'			=> '/var/www/dp_data.txt',                          //必须绝对路径

			'comment'				=> 'upload test',

			'mode_content'			=> '{"desc":"this is test","actions":[{"dest":{"access_id":"access_id_data","ep_id":"ep13878540101","dp_id":1},"cmd":"raw data command with base64 encode or json string with schema format","desc": "write your description for this config here"}],"rules":[{"rule_id":372,"property":{"enable":"true"}}],"alerts": [{"type":2,"message":"房门异常打开"}]}',			
			'mode_content_bak'		=> '{"desc":"this is test","actions":[{"dest":{"access_id":"access_id_data","ep_id":"ep_id_data","dp_id":dp_id_data},"cmd":"raw data command with base64 encode or json string with schema format","desc": "write your description for this config here"}],"rules":[{"rule_id":372,"property":{"enable":"true"}}],"alerts": [{"type":2,"message":"房门异常打开"}]}',
			
			'mode_desc'				=> 'this is a test',
			'mode_id'				=> '5733462',
			'mode_list'				=> '[{"mode_id":72}]',

			'rule_content'			=> '{"desc":"xxxx联动","condition":[{"args":[{"type":"self","data":{"access_id":"access_id_data","ep_id":"ep13878540101","dp_id":1}},{"type":"data","data":{"R":115, "G": 20,"B":40}}],"method":">","desc": "当xxx时"}],"modes":[{"mode_id":5733462}]}',
			'rule_content_bak'		=> '{"desc":"xxxx联动","condition":[{"args":[{"type":"self","data":{"access_id":"access_id_data","ep_id":"ep_id_data","dp_id":dp_id_data}},{"type":"data","data":{"R":115, "G": 20,"B":40}}],"method":">","desc": "当xxx时"}],"modes":[{"mode_id":5733462}]}',
			'rule_id'				=> '319',
			'rule_list'				=> '[{"rule_id":321}]',
			'rule_propery'			=> '[{"rule_id":319,"propery":{"enable":true}}]',

			'protocol_id'			=> '01002001',

			'channel_tag'			=> '',
			'version_type'			=> '',
			'current_version'		=> '',
			
			'source'				=> '',
			'info_name'				=> '',
			'info_content'			=> '',
			'info_id'				=> '',
			
		),
	),
	
	
	
);

?>
