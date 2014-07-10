<?php
class BackstageModel extends Model {

	protected $_dbname	= 'vanelife_test';
	protected $_table;
	protected $_connected;
	protected $_port	= '3306';
 
	public function __construct(){

		//数据库连接操作，实例化$_connected;
		$conn = 'mysql://'.C('DB_USER').':'.C('DB_PWD').'@'.C('DB_HOST').':'.$this->_port.'/'.C('DB_BG_NAME');
 		$this->_connected = M('','AdvModel');
 		$this->_connected->addConnect($conn,1);
 		$this->_connected->switchConnect(1);
	}
	
	//获取后台注册用户的列表信息
	public function getAllUserListInfo(){
		$user = $this->_connected->table('manager_user')->field('user_name,nick_name,comment')->select();
		return $user;
	}

	public function delUserInfo($username=''){
		if($username==''){
			return false;
		}
		$condition=array(
			'user_name' => 	$username
		);
		$result = $this->_connected->table('manager_user')->where($condition)->delete();
		if($result>0){
			return true;
		}
		return false;
	}

	//增加用户信息
	public function addUserInfo($username,$realname,$password,$role){
		if(!$username || !$password || !$role){
			return false;
		}
		$data = array(
			'user_name'=>$username,
			'password'=>md5($password),
			'nick_name'=>$realname,
			'comment'=>$role,
		);
		$result = $this->_connected->table('manager_user')->data($data)->add();
		return $result;
	}

	//获得角色的列表信息
	public function getAllRoleListInfo(){
		$role = $this->_connected->table('manager_role')->select();
		return $role;
	}
	
	//获得某角色的具体信息
	public function getRoleInfo($rolename=''){
		if($rolename==''){
			return NUll;
		}
		$condition=array(
			'role_name' => 	$rolename
		);
		$result = $this->_connected->table('manager_role')->where($condition)->select();
		return $result;
	}

	//增加新的角色
	public function addRoleInfo($rolename,$tag){
		if(!$rolename || !$tag){
			return false;
		}
		$data = array(
			'role_name'		=> $rolename,
			'role_audit'	=> $tag
		);
		$result = $this->_connected->table('manager_role')->data($data)->add();
		return $result;
	}

	public function saveRoleInfo($rolename,$tag){
		if(!$rolename || !$tag){
			return false;
		}
		$condtion = array(
			'role_name'		=> $rolename,	
		);
		$data = array(
			'role_audit'	=> $tag
		);
		$result = $this->_connected->table('manager_role')->where($condtion)->data($data)->save();
		return $result;
	}

	//删除角色
	public function delRoleInfo($rolename){
		if(!$rolename){
			return false;
		}
		
		$condition=array(
			'role_name' => 	$rolename
		);

		$result = $this->_connected->table('manager_role')->where($condition)->delete();
		return $result;

	}

	//获取所有应用模块的列表信息
	public function getAllAppListInfo(){
		$app = $this->_connected->table('manager_app')->select();
		return $app;
	}

	//增加新应用
	public function addAppInfo($app_name,$app_path){
		if(!$app_name || !$app_path){
			return false;
		}
		$data = array(
			'app_name'=>$app_name,
			'app_url' =>$app_path 
		);
		$result = $this->_connected->table('manager_app')->data($data)->add();
		return $result;
	}

	//删除应用
	public function delAppInfo($app_name){
		if(!$app_name){
			return false;
		}
		$condition = array(
			'app_name' => $app_name,	
		);
		$result = $this->_connected->table('manager_app')->where($condition)->delete();
		return $result;
	}
}

?>