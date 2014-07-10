<?php
/**
 * 
 * Manager_User
 * @author zhangzr1026
 *
 */
class ManagerAction extends CommonAction
{	
	public function getActionByModule()
	{
		$manager_priv_module = $_REQUEST['argc'];
		$response = "ALL";
		
		foreach(C('PRIVILEGE') as $k_m=>$v_m )
		{
			if($manager_priv_module == $k_m){
				foreach($v_m as $k_a=>$v_a)
				{
					$response .= "," . $v_a;
				}
			}
		}
		echo $response;
	}
	
	public function index(){		
		import("ORG.Util.Page"); // 导入分页类
		$pageUrl = ''; //用于搜索分页传递参数，保持条件进行分页
		$searchValue = ''; //搜索的标题
		$cases = array();
		$p = isset($_GET['p'])?intval($_GET['p']):1;   //初始化分页
				
		//搜索标题
		if( isset($_REQUEST['searchtype']) && $_REQUEST['searchtype']!='' )
		{
			$searchValue  = $_REQUEST['searchValue'];
			$cases['user_name']  = array('eq',$searchValue);
		    $pageUrl .= '/searchValue/'.$searchValue;
		}
		
		//获取数据
		$dmUser       = D('manager_user');
		$count         = $dmUser->where($cases)->count();
		
		$Page         = new Page($count,ROWSPERPAGE);
		$show         = $Page->showPage($pageUrl);
		$list         = $dmUser->where($cases)->order($order)->page($p.','.ROWSPERPAGE)->select();

		$this->assign( "page", $show );
		$this->assign ( "userlist", $list );
		$this->assign ( "nav", 'manager' );
		$this->assign ( "sub", 'index' );
		$this->display();
	}
	
	//统计在线用户
	private function statisticsOnlineHac(){
		$m = new Model();
		$sql = "SELECT count(*) AS count FROM `cache_hac_bev`";
		$mlist = $m->query($sql);
		$count = $mlist[0]["count"];
		return $count;
	}

	public function profile(){
		$hacsn = $_REQUEST['hacsn'];
		if(!isset($hacsn)){
			$this->error("hac serial number required");
			die();
		}
		$condition = array(
			'serial_number' => $hacsn,
		);
		$profile = M('info_hac')->where($condition)->find();
		$this->assign('profile',$profile);
		$this->display();
	}
	
	public function add(){
		$manager_user_name = $_REQUEST["manager_user_name"];
		$this->assign('manager_user_name',$manager_user_name);
		$this->assign ( "nav", 'manager' );
		$this->assign ( "sub", 'index' );
		$this->display();
	}
	
	public function adding(){
		$manager_user_name	= $_REQUEST['manager_user_name'];
		$manager_password	= $_REQUEST['manager_password'];
		$manager_nick_name	= $_REQUEST['manager_nick_name'];
		$manager_comment	= $_REQUEST['manager_comment'];
		
		if($manager_user_name == ADMINUSR)
			$this->error("Can't create Administrator!");
		
		$data = array(
			'user_name'	=>$manager_user_name,
			'password'	=>md5($manager_password),
			'nick_name'	=>$manager_nick_name,
			'comment'	=>$manager_comment,
		);
		$result = M('manager_user')->data($data)->add();
		if($result>0)
		{
			if( $this->addPriv($manager_user_name, "Index", "index") )
			{
				$this->assign("jumpUrl","__APP__/Manager/addPrivIndex/manager_user_name/$manager_user_name");
				$this->success("Add User Succeed");
			}
			else {
				$this->assign("jumpUrl","__APP__/Manager/addPrivIndex/manager_user_name/$manager_user_name");
				$this->error("Add Basic Privilege Failed");
			}
		}
		else{
			$this->error("Add failed");
		}
	}
	
	public function addPrivIndex(){
		$manager_user_name = $_REQUEST["manager_user_name"];
		$condition['user_name']  = array('eq',$manager_user_name);
		$userprivlist = M("manager_operation_privilege")->where($condition)->select();
		
		for($i=0; $i<count($userprivlist); $i++)
		{
			if( $userprivlist[$i]["http_module"]==$temp )
				$userprivlist[$i]["display_module"] = "";
			else
			{
				$temp =  $userprivlist[$i]["http_module"];
				$userprivlist[$i]["display_module"] = $userprivlist[$i]["http_module"];
			}
		}

		$this->assign('userprivlist',$userprivlist);
		$this->assign('manager_user_name',$manager_user_name);
		$this->assign('privilege',C('PRIVILEGE'));
		$this->display();
	}
	
	
	private function addPriv($UserName, $ModulePriv, $ActionPriv)
	{
		$data = array(
			'user_name'=>$UserName,
			'http_module'=>$ModulePriv,
			'http_action'=>$ActionPriv,
		);
		$result = M('manager_operation_privilege')->data($data)->add();
		if($result>0)
			return TRUE;
		else
			return FALSE;
	}
	
	public function addingPriv(){
		$manager_user_name = $_REQUEST['manager_user_name'];
		$manager_priv_module = $_REQUEST['manager_privilege_moudle'];
		$manager_priv_action = $_REQUEST['manager_privilege_action'];
		
		//首页权限
		$this->addPriv($manager_user_name, "Index", "index");	
		
		//所有权限
		if($manager_priv_module == "ALL")
		{
			foreach(C('PRIVILEGE') as $k_m=>$v_m )
			{
				foreach($v_m as $k_a=>$v_a)
				{
					$this->addPriv($manager_user_name, $k_m, $v_a );
				}
				
			}
		}
		else{
		//单个Module的所有权限
			if($manager_priv_action == "ALL")
			{
				foreach(C('PRIVILEGE')[$manager_priv_module] as $k_a=>$v_a)
				{
					$this->addPriv($manager_user_name, $manager_priv_module, $v_a );
				}
			}
		//单个Action权限
			else{
				$this->addPriv($manager_user_name, $manager_priv_module, $manager_priv_action);	
			}
			
		}
		$this->assign("jumpUrl","__APP__/Manager/addPrivIndex/manager_user_name/$manager_user_name");
		$this->success("Privilege Edit Finished");

	}
	
	public function copyPrivIndex(){
		$from_user_name = $_REQUEST["from_user_name"];
		$to_user_name 	= $_REQUEST["to_user_name"];
		
		$this->assign('from_user_name',$from_user_name);
		$this->assign('to_user_name',$to_user_name);
		$this->display();
	}
	
	public function copyingPriv(){
		$from_user_name = $_REQUEST["from_user_name"];
		$to_user_name 	= $_REQUEST["to_user_name"];
		
		$condition = array(
			'user_name' => $from_user_name,
		);
		$list = M('manager_operation_privilege')->where($condition)->select();
		if($list){
			foreach($list as $val )
			{
				$http_module = $val["http_module"];
				$http_action = $val["http_action"];
				$this->addPriv($to_user_name, $http_module, $http_action );
			}
			$this->assign("jumpUrl","__APP__/Manager/addPrivIndex/manager_user_name/$to_user_name");
			$this->success("Privilege Copy From '$from_user_name' To '$to_user_name' Finished");
		}
		else{
			$this->error("Edit Failed");
		}
	}
	
	public function edit(){
		$uid = $_REQUEST['uid'];
		if(!isset($uid)){
			$this->error("uid required");
			die();
		}
		$condition = array(
			'id' => $uid,
		);
		$profile = M('member')->where($condition)->find();
		$this->assign('profile',$profile);
		$this->display();
	}
	
	public function editing(){
		$uid = $_REQUEST['uid'];
		if(!isset($uid)){
			$this->error("uid required");
			die();
		}
		$condition = array(
			'id' => $uid,
		);
		$data = array(
			'lastname'=>$_REQUEST['lastname'],
			'firstname'=>$_REQUEST['firstname'],
			'cnname'=>$_REQUEST['cnname'],
			'sponsor'=>$_REQUEST['sponsor'],
			'email'=>$_REQUEST['email'],
			'mobile'=>$_REQUEST['mobile'],
			'phone'=>$_REQUEST['phone'],
			'qq'=>$_REQUEST['qq'],
			'level'=>$_REQUEST['level'],
			't_member'=>$_REQUEST['t_member'],
			'ismember'=>$_REQUEST['ismember'],
		);
		$profile = M('member')->data($data)->where($condition)->save();
		if($profile){
			$this->assign("jumpUrl","__APP__/Member/edit/uid/$uid");
			$this->success("Edit Succeed");
		}
		else{
			$this->error("Edit Failed");
		}
	}
	
	public function delete(){
		$manager_user_name = $_REQUEST['manager_user_name'];
		if(!isset($manager_user_name)){
			$this->error("User Name required");
			die();
		}
		$condition = array(
			'user_name' => $manager_user_name,
		);
		
		$result_relationship = M('manager_operation_privilege')->where($condition)->delete();
		$result = M('manager_user')->where($condition)->delete();
		
		if($result){
			$this->assign("jumpUrl","__APP__/Manager/index/");
			$this->success("Delete Succeed");
		}
		else{
			$this->error("Delete Failed");
		}
	}
	
	public function deletingPriv(){
		$manager_user_name = $_REQUEST['manager_user_name'];
		$manager_module_priv = $_REQUEST['manager_module_priv'];
		$manager_action_priv = $_REQUEST['manager_action_priv'];
		
		if(empty($manager_user_name) || empty($manager_module_priv) || empty($manager_action_priv)){
			$this->error("Arguement required");
		}
		
		if($this->deletePriv($manager_user_name, $manager_module_priv, $manager_action_priv)){
			$this->assign("jumpUrl","__APP__/Manager/addPrivIndex/manager_user_name/$manager_user_name");
			$this->success("Delete Succeed");
		}
		else{
			$this->error("Delete Failed");
		}
	}
	
	public function deletePriv($UserName, $ModulePriv, $ActionPriv){
		$condition = array(
			'user_name' 	=> $UserName,
			'http_module'	=> $ModulePriv,
			'http_action'	=> $ActionPriv,
		);
		
		$result = M('manager_operation_privilege')->where($condition)->delete();
		
		if($result){
			return TRUE;
		}
		else{
			return FALSE;
		}
	}
	
	private function addBasePriv($UserName, $ModulePriv, $ActionPriv){
		$this->addPriv($manager_user_name, "Index", "index");
	}
}
?>
