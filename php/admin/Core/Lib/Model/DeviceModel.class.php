<?php
class DeviceModel extends Model {
	
	//获取所有Hac的列表信息
	public function getAllDevListInfo(){
		
		$result = M('info_device')->field('device_id,device_sn,owner,topic_device,topic_app,online_status')->limit(200)->select();
		return $result;

	}

	public function getDeviceById($deviceid){
		$result = M('info_device')->where('device_id='.$deviceid)->select();
		return $result;
	}

	//根据dev的id获取关联的用户信息
	public function getUserByDeviceId($dev_id){
		if(!$dev_id){
			return null;
		}
		$model = new Model();
		$result = $model->table('inter_user_dev uh')->join('info_user u on uh.user_id=u.user_id')->field('u.user_id, uh.device_id')->where('uh.device_id ='.$dev_id)->select();
		return $result;
	}

	public function getAllDevVerList(){
		$result = M('info_software_version')->where('version_type=1')->order('version_id desc')->select();
		return $result;
	
	}

	public function addDevVerInfo($data){
		 $id = M('info_software_version')->add($data);
		return $id;
	}

	public function getDevChannelTag(){
		$result = M('info_software_tag')->where('version_type=1')->select();
		return $result;
	}

	public function updateDevVer($verid,$type){
		if(!$verid){
			return false;
		}		
		$data = array(
			'update_type'	=> $type,
		);
		$result = M('info_software_version')->data($data)->where('version_id='.$verid.' and version_type=1')->save();
		return $result;
	}

	public function delDevVer($verid){
		if(!$verid){
			return false;
		}
		$result = M('info_software_version')->where('version_id='.$verid)->delete();
		return $result;
	}
	
	public function getDevCurVerId(){
		
		$result = M('info_software_version')->where('update_type=\'1\' and version_type=1')->find();
		return $result['version_id'];	
	}

	public function addDevChannelTag($tag){
		if(!$tag){ return 0;}
		$data['version_type'] = 1;
		$data['tag_name'] = $tag;
		$id = M('info_software_tag')->add($data);
		return $id;
	}

	public function delDevChannelTag($tag){
		if(!$tag){ return false;}
		$result = M('info_software_tag')->where('version_type=1 and tag_name=\''.$tag.'\'')->delete();
		return $result;
	}
	
	public function isExistTag($tag){
		$result = M('info_software_tag')->where('version_type=1 and tag_name=\''.$tag.'\'')->find();
		if(count($result)){
			return true;
		}
		return false;
	}

	public function getEpListByDeviceId($deviceid){
		$result = M('info_ep')->where('device_id='.$deviceid)->select();
		return $result;
	}

	public function getEpListByEpId($epid){
		$result = M('info_ep')->where('ep_id=\''.$epid.'\'')->select();
		return $result;
	}

	public function getDpListByDeviceAndEpId($deviceid,$epid){
		$result = M('info_dp')->where('device_id='.$deviceid.' and ep_id=\''.$epid.'\'')->select();
		return $result;
	}

	public function getDpInfoByDpId($dpid){
		$row = M('info_dp')->where('dp_id='.$dpid)->find();
		return $row;
	}

}
?>