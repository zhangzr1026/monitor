<?php
/**
 * 
 * Profile
 * @author zhangzr1026
 *
 */
class ProfileAction extends CommonAction
{
	public function index(){
		$condition = array(
			'user_name' => $this->UserName,
		);
		$profile = M('manager_user')->where($condition)->find();
		$this->assign('profile',$profile);
		$this->display();
	}
	
	public function editing(){
/*		$user_name = $_REQUEST['user_name'];
		if(!isset($user_name)){
			$this->error("user_name required");
			die();
		}*/
		$condition = array(
			'user_name' => $this->UserName,
		);
		$data = array(
			//'nick_name'=>$_REQUEST['nick_name'],
			'comment'=>$_REQUEST['comment'],
		);
		$profile = M('manager_user')->data($data)->where($condition)->save();
		if($profile){
			$this->success("Edit Succeed");
		}
		else{
			$this->error("Edit Failed");
		}
	}
	
	public function modifypwd(){
		$this->display();
	}
	
	public function modifyingpwd(){
		$new_password = $_REQUEST['new_password'];
		$new_password_repeat = $_REQUEST['new_password_repeat'];
		if($new_password != $new_password_repeat){
			$this->error("两次密码不一致");
		}
		
		$condition = array(
			'user_name' => $this->UserName,
		);
		$data = array(
			'password'=>md5($_REQUEST['new_password']),
		);
		$profile = M('manager_user')->data($data)->where($condition)->save();
		if($profile){
			$this->success("修改成功,请重新登录");
		}
		else{
			$this->error("Edit Failed");
		}
	}
}
?>
