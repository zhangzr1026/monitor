<?php
class TestInterfaceModel extends Model {
	
	protected $IFId;
	protected $_connected;

	public function setIFId($IFId){
		$this->IFId	= $IFId;
	}

	public function __construct(){
		$IF_PARAM  = C('IF_PARAM');
		$conn = 'mysql://'.$IF_PARAM[$this->IFId]['IF_db']['IF_db_user'].':'.$IF_PARAM[$this->IFId]['IF_db']['IF_db_pwd'].'@'.$IF_PARAM[$this->IFId]['IF_db']['IF_db_host'].':'.$IF_PARAM[$this->IFId]['IF_db']['IF_db_port'].'/'.$IF_PARAM[$this->IFId]['IF_db']['IF_db_name'];
 		$this->_connected = M('','AdvModel');
 		$this->_connected->addConnect($conn,0);
 		$this->_connected->switchConnect(0);
	}

	public function addUser($username,$passwd){

		#$data['user_name']	= $username;
		#$data['password']	= md5($passwd);
		#$data['group_id']	= 0;
		#$data['email']		= $username;

		$id = $this->_connected->execute("insert into info_user(user_name,password,group_id,email,verification)values('".$username."','".$passwd."',0,'".$username."',1)");
		if($id){
			$id = $this->_connected->getLastInsID();
		}
		return $id;
	}

	public function getUser($username,$passwd){
		$data	=	array(
			'user_name'	=> $username,
			'password'	=> $passwd
		);

		$row = $this->_connected->table('info_user')->where($data)->find();
		return $row['user_id'];
	}

	public function addDeviceSn($uid,$device_sn){
		#$data['device_sn']	=	$device_sn;
		#$data['owner']		=	$username;
	
		#$id = $this->_connected->table('info_device')->add($data);
		$id = $this->_connected->execute("insert into info_device(device_sn,owner_id)values('".$device_sn."','".$uid."')");
		return $id;
	}

	public function getDeviceSn($uid,$device_sn){
		$data['device_sn']	=	$device_sn;
		$data['owner_id']		=	$uid;
	
		$row = $this->_connected->table('info_device')->where($data)->find();
		return $row;
	}

	public function addEP($uid,$ep_id){
		#$data['ep_id']		=	$ep_id;
		#$data['owner']		=	$username;

		#$id = $this->_connected->table('info_ep')->add($data);
		$id = $this->_connected->execute("insert into info_ep(ep_id,owner_id)values('".$ep_id."','".$uid."')");
		return $id;
	}

	public function getEP($uid,$ep_id){
		$data['ep_id']		=	$ep_id;
		$data['owner_id']		=	$uid;

		$row = $this->_connected->table('info_ep')->where($data)->find();
		return $row;
	}

	public function addAppKey($key,$secret,$uid){
		#$data['app_key']	=	$key;
		#$data['app_secret']	=	$secret;
		#$data['user_name']	=	$username;
		#$data['enable']		=	'Y';

		#$id	= $this->_connected->table('info_app_key')->add($data);
		$id	= $this->_connected->execute("insert into info_app_key(app_key,app_secret,user_id,enable)values('".$key."','".$secret."','".$uid."','Y')");
		return $id;
	}

	public function getAppKey($key,$secret,$uid){
		$data['app_key']	=	$key;
		$data['app_secret']	=	$secret;
		$data['user_id']	=	$uid;

		$row = $this->_connected->table('info_app_key')->where($data)->select();
		return $row;
	}

	public function getCheckNum($mobile){
		$row = $this->_connected->table('info_app_key')->where($data)->find();
		return $row;
	}
}
?>