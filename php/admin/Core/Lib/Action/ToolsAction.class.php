<?php
/**
 * 
 * @author zhangzr1026
 *
 */
class ToolsAction extends CommonAction
{
	//For active hac  with Share_priv'Y'
	public function activeindex()
	{
		$serial_number = $_REQUEST['serial_number'];
		$user_name = $_REQUEST['user_name'];
		$this->assign("serial_number",$serial_number);
		$this->assign("user_name",$user_name);
		$this->display();
	}

	public function activeaction()
	{
		$serial_number = $_REQUEST['serial_number'];
		$user_name = $_REQUEST['user_name'];
		$shar_priv = 'Y';
		$active_code = generate_hac_activation_code($serial_number);
		
		$this->bind($serial_number, $user_name, $shar_priv);
		$this->active($serial_number,$active_code);		
		
		$this->assign("jumpUrl","__APP__/Hac/index/searchtype/serial_number/searchValue/$serial_number");
		$this->success("Active Succeed");
	}
	

	//For binding user with Share_priv'N'
	public function bindingindex()
	{
		$serial_number = $_REQUEST['serial_number'];
		$user_name = $_REQUEST['user_name'];
		$this->assign("serial_number",$serial_number);
		$this->assign("user_name",$user_name);
		$this->display();
	}
	
	public function bindingaction()
	{
		$serial_number = $_REQUEST['serial_number'];
		$user_name = $_REQUEST['user_name'];
		$shar_priv = 'N';
		
		$this->bind($serial_number, $user_name, $shar_priv);
		
		$this->assign("jumpUrl","__APP__/Hac/index/searchtype/serial_number/searchValue/$serial_number");
		$this->success("Binding Succeed");
	}
	
	//remove active
	public function activeremove()
	{
		$serial_number = $_REQUEST['serial_number'];
		$hac_id = $this->gethacidByserialnumber($serial_number);
		
		$condition = array(
			'info_hac_hac_id' => $hac_id,
		);
		
		//Set Active Code to "0"
		$this->active($serial_number,"0");
		
		//Delete All users
		$profile = M('inter_user_hac')->where($condition)->delete();
		if($profile>0){
			$this->assign("jumpUrl","__APP__/Hac/index/searchtype/serial_number/searchValue/$serial_number");
			$this->success("Delete Succeed");
		}
		else{
			$this->error("Delete Failed");
		}
	}
	
	//common functions
	private function active($serial_number,$active_code)
	{
		//Update info_hac
		$condition = array(
			'serial_number'	=>$serial_number,
		);
		$data = array(
			'activation_code'=>$active_code,
		);
		
		$profile = M('info_hac')->where($condition)->save($data);
		if($profile>0){
			//Succeed
			//$this->assign("jumpUrl","__APP__/Hac/index/searchtype/serial_number/searchValue/$serial_number");
			//$this->success("Add Succeed");
		}
		else{
			$this->error("General Code Failed");
		}
	}
	
	private function bind($serial_number,$user_name,$shar_priv)
	{
		//Add inter_user_hac
		$serial_number = $_REQUEST['serial_number'];
		$user_name = $_REQUEST['user_name'];
		$hac_id = $this->gethacidByserialnumber($serial_number);
		$user_id = $this->getuseridByusername($user_name);
		
		$data = array(
			'hac_sn'		=>$serial_number,
			'user_name'			=>$user_name,
			'info_user_user_id' =>$user_id,
			'info_hac_hac_id'	=>$hac_id,
			'share_priv'		=> $shar_priv,
		);
		
		$profile = M('inter_user_hac')->data($data)->add();
		if($profile>0){
			//SUCCESS
			//$this->assign("jumpUrl","__APP__/Hac/index/searchtype/serial_number/searchValue/$serial_number");
			//$this->success("Add Succeed");
		}
		else{
			$this->error("Add Relationship between hac and user Failed");
		}
	}
	
	private function gethacidByserialnumber($serial_number)
	{
		$condition = array(
			'serial_number' => $serial_number,
		);
		$row = M('info_hac')->field('hac_id')->where($condition)->find();	
		if(!$row){
			$this->error("Cant find match serial number");
			die();
		}
		return $row["hac_id"];
	}
	
	private function getuseridByusername($username)
	{
		$condition = array(
			'user_name' => $username,
		);
		$row = M('info_user')->field('user_id')->where($condition)->find();	
		if(!$row){
			$this->error("Cant find match username");
			die();
		}
		return $row["user_id"];
	}
}
?>
