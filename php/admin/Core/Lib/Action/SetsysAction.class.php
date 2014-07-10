<?php
class SetsysAction extends CommonAction
{
	public function index(){
		
		$this->editPwd();
	}

	public function editPwd(){
		$this->assign("nav","setsys");
		$this->assign("sub","index");
		$this->display();
	}

	public function savePwd(){
		$user_name = $_REQUEST['user_name'];
		$old_pwd   = $_REQUEST['old_pwd'];
		$new_pwd   = $_REQUEST['new_pwd'];

		$condition = array(
			'user_name' => 	$user_name,
			'password'  =>  md5($old_pwd)
		);
		$user = M('manager_user')->where($condition)->select();
		if($user){
			$result = M('manager_user')->where(array('user_name'=>$user_name))->data(array('password' =>md5($new_pwd)))->save(); // 根据条件保存修改的数据	
			if($result){
				$this->ajaxReturn('','修改成功',0);
				return;
			}
		}
		$this->ajaxReturn('','修改失败',1);
		return;
	}
}
?>