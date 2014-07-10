<?php
class VersionModel extends Model {

	public function getAllAppVerList(){	
		$result = M('info_software_version')->where('version_type=0')->order('version_id desc')->select();
		return $result;
	}

	public function addAppVerInfo($data){
		 $id = M('info_software_version')->add($data);
		return $id;
	}

	public function getAppChannelTag(){
		$result = M('info_software_tag')->where('version_type=0')->select();
		return $result;
	}

	public function updateAppVer($verid,$type){
		if(!$verid){
			return false;
		}		
		$data = array(
			'update_type'	=> $type,
		);
		$result = M('info_software_version')->data($data)->where('version_id='.$verid.' and version_type=0')->save();
		return $result;
	}
	
	public function getAppCurVerId(){
		
		$result = M('info_software_version')->where('update_type=\'1\' and version_type=0')->find();
		return $result['version_id'];	
	}
}
?>