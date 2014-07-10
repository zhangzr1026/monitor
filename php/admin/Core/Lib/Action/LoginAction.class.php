<?php
/**
 * 
 * 登录
 * @author zhangzr1026
 *
 */
class LoginAction extends Action
{
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
	//初始化
	public function _initialize()
    {
		import('Think.Util.Session');
		SESSION::start();
		$this->inintdb();
    }
    
	public function index(){
		$user = Session::get('user');
		if($user){
			redirect(U("Index/index/"));
		}
	    $this->display();
	}
	
	function checkLogin()
	{
		$Username = trim ( $_POST ["user"] );
		$Password = trim ( $_POST ["pass"] );
	
		if(!isset($Username)||!strlen($Username))
		{
			//$this->error("用户名不能为空！");
			 $this->ajaxReturn('', "用户名不能为空", 1);
		}
		elseif(!isset($Password)||!strlen($Password))
		{
			//$this->error("密码不能为空！");
			$this->ajaxReturn('', "密码不能为空", 1);	
		}
		
		$flagLogin = FALSE;
		//$response = "";
		/* 管理员 */
		if($Username==ADMINUSR && $Password==ADMINPWD)
		{
			$flagLogin = TRUE;
			//$ajaxresponse = "{'success':true}";
			
		}
		/* 数据库查帐号密码 */
		else{
			
		 	$condition['user_name'] = $Username ;
			$result = $this->_connected->table('manager_user')->where( $condition )->find();
			
			if( empty($result) )
			{
				//$response = "用户不存在";
				//$ajaxresponse = "{errors:[{id:'user', msg:'用户不存在'}]}";
				$this->ajaxReturn('', "用户不存在或密码错误", 1);	
			}
			elseif( md5($Password) != $result['password'] )
			{
				//$response = "密码错误";
				//$ajaxresponse = "{errors:[{id:'user', msg:'密码错误'}]}";
				$this->ajaxReturn('', "用户不存在或密码错误", 1);	
			}
			else
			{
				$flagLogin = TRUE;
				//$ajaxresponse = "{'success':true}";
				//$this->ajaxReturn(U("Index/index/"), "登录成功,正在为您跳转...", 0);	
			}
		}
		
		if($flagLogin == TRUE){
			Session::set('user',$Username);
			Session::set('password',md5($Password));
			//$this->assign("jumpUrl","__APP__/Index/index/");
			//$this->success("登录成功！");
			$this->ajaxReturn(U("Index/index/"), "登录成功,正在为您跳转...", 0);	
		}
		/*else{
			$this->error($response);
		}*/
		
	}
	
	function LoginOut()
	{
		Session::destroy();	
		$this->redirect("Login/index");
	}
}

?>
