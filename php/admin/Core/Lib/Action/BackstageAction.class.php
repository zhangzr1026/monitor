<?php
class BackstageAction extends CommonAction
{
	public function index(){	
		$this->user();
	}

	//后台用户进入页
	public function user(){
		$user = D('Backstage')->getAllUserListInfo();	//通过BackstageMode取用户列表
		$role = D('Backstage')->getAllRoleListInfo();	//通过BackstageMode取角色列表
		$this->assign('userlist',$user);
		$this->assign('rolelist',$role);
		$this->display('user');
	}
	
	//通过ajax添加新的用户
	public function adduser(){
		$user_name = $_REQUEST['user_name'];
		$real_name = $_REQUEST['real_name'];
		$password  = $_REQUEST['password'];
		$role	   = $_REQUEST['user_role'];

		$result  = D('Backstage')->addUserInfo($user_name,$real_name,$password,$role);
		//ajax 返回信息
		if($result>0){
			$this->ajaxReturn("__APP__/Backstage/user",'用户添加成功',1);
		}
		else{
			$this->ajaxReturn(0,'用户添加失败',0);
		}
	
	}

	//进入角色列表页
	public function role(){
		$role = D('Backstage')->getAllRoleListInfo();  //通过BackstageMode取角色列表
		$app  = D('Backstage')->getAllAppListInfo();	//通过BackstageMode取应用列表
		$rolelist = array();
		if($role&&count($role)){
			foreach($role as $key => $value){
				$rolelist[$key]['role_name']=$value['role_name'];
				//角色可控制的应用在数据库以序列化存储，取出数据后需进行反序列化。
				$priv =unserialize($value['role_audit']);
				if(count($priv)) $rolelist[$key]['role_audit']=implode(',',$priv);
			}
		}
		$this->assign('rolelist',$rolelist);
		$this->assign('applist',$app);
		$this->display('role');
	}

	//通过ajax添加新的角色
	public function addrole(){
		$role_name = $_REQUEST['role_name'];
		$frm_tag = $_REQUEST['frm_tag'];
		//对角色可操作的应用数组进行序列化，方便其存入数据库中
		if($frm_tag){
			$tag = serialize($frm_tag);
		}else{
			$tag = serialize(array());
		}

		$profile = D('Backstage')->addRoleInfo($role_name,$tag);
		//ajax 返回信息
		if($profile>0){
			$this->ajaxReturn("__APP__/Backstage/role",'角色添加成功',1);
		}
		else{
			$this->ajaxReturn(0,'角色添加失败',0);
		}
	}

	//进入应用列表页
	public function app(){
		$app = D('Backstage')->getAllAppListInfo();	//通过BackstageMode取应用列表
		$this->assign('applist',$app);
		$this->display('app');
	}

	//通过ajax添加新的应用
	public function addapp(){
		$app_name = $_REQUEST['app_name'];
		$app_path = $_REQUEST['app_path'];

		$profile = D('Backstage')->addAppInfo($app_name,$app_path);
		//ajax 返回信息
		if($profile>0){
			$this->ajaxReturn("__APP__/Backstage/app",'应用添加成功',1);
		}
		else{
			$this->ajaxReturn(0,'应用添加失败',0);
		}
	}

}
?>