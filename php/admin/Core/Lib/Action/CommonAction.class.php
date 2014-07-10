<?php

class CommonAction extends Action
{
	protected $browser;
	protected $userName;

	protected $_dbname	= 'vanelife_test';
	protected $_table;
	protected $_connected;
	protected $_port	= '3306';
 
	private function inintdb(){

		//数据库连接操作，实例化$_connected;
		$conn = 'mysql://'.C('DB_USER').':'.C('DB_PWD').'@'.C('DB_HOST').':'.$this->_port.'/'.C('DB_BG_NAME');
 		$this->_connected = M('','AdvModel');
 		$this->_connected->addConnect($conn,1);
 		$this->_connected->switchConnect(1);
	}


	protected function _initialize(){
		//登录
		import('Think.Util.Session');
		SESSION::start();
		$this->inintdb();
		$this->checkLogin();
		//$this->checkPermision();
		$this->isPermision();
		//$this->getUserInfo();
		$this->recordLog();

		//检测浏览器
		if(strpos($_SERVER['HTTP_USER_AGENT'],"iPhone")){
			$this->browser = 'iphone';
		}
		else{
			$this->browser = 'other';
		}
		$this->assign('browser',$this->browser);
	}

	function checkLogin()
	{
	
		if(!isset($_SESSION['user']) && !isset($_REQUEST["user"])){
			$this->redirect('Login/index');
		}else{
			$this->UserName = trim($_SESSION ["user"])=="" 		? trim($_REQUEST["user"]) : trim($_SESSION ["user"]);
			$MD5Password	= trim($_SESSION ["password"])==""	? trim($_REQUEST["pass"]) : trim($_SESSION ["password"]);

			/* 管理员 */
			if($this->UserName==ADMINUSR && $MD5Password==md5(ADMINPWD))
			{
				return;
			}

			if(MODULE_NAME == 'beginTestAll'){
				return;
			}
			/* 数据库查帐号密码 */
			else{
			 	$condition['user_name'] = $this->UserName ;
				$result = $this->_connected->table('manager_user')->where( $condition )->find();
				if( !empty($result) && $MD5Password == $result['password'] )
				{
					return;
				}
			}
		}
		
		//验证失败
		$this->redirect('Login/index');
	}

	function isPermision(){
		if($this->UserName == ADMINUSR || MODULE_NAME == 'beginTestAll'){
			$this->assign('privUser',ADMINUSR);
			return;
		}
		$condition = array(
				'user_name' 	=> $this->UserName
			);
		$result = $this->_connected->table('manager_user')->where($condition)->find();
		$this->assign('user_name',$this->UserName);
		$condition = array(
				'role_name' 	=> $result['comment']
			);
		$result = $this->_connected->table('manager_role')->where($condition)->find();
		if(empty($result)){
				$this->assign("message","Permission Denied");
				$this->error("You're not permit to do this operation");
		}
		$priv =unserialize($result['role_audit']);
		$condition = array(
				'app_url' 	=> MODULE_NAME
			);
		$result = $this->_connected->table('manager_app')->where($condition)->find();
		$md_app = $result['app_name'];
		if($result&&!in_array($md_app,$priv)){
		   $this->assign("message","Permission Denied");
			$this->error("You're not permit to do this operation");
		}
		$this->assign('priv',$priv);
		
	}

	
	//记录操作日志
	function recordLog()
	{
		$data = array(
			'user_name'		=>$this->UserName,
			'http_module'	=>MODULE_NAME,
			'http_action'	=>ACTION_NAME,
			'http_request'	=>$_REQUEST,
		);
		$result = $this->_connected->table('manager_log')->data($data)->add();
		if($result>0){
			return;
		}
		else{
			$this->error("Log Failed");
		}
	}

}

?>
