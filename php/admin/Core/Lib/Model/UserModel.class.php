<?php
class UserModel extends Model {
	
	public function getAllUserList(){
		$result = M('info_user')->field('user_id,user_name,group_id,email,mobile,create_time')->order('user_id desc')->select();
		return $result;
	}

	public function getUserList($page,$rows){
		$model = M('info_user');
		$result = $model->page($page.','.$rows)->order('user_id desc')->select();
		return $result; 
	}

	public function getUserInfoById($uid){
		$result = M('info_user')->where('user_id='.$uid)->find();
		return $result;
	}
	
	public function getUserInfoByEmail($email){
		$result = M('info_user')->where('email=\''.$email.'\'')->find();
		return $result;
	}

	public function getUserConfFileById($uid){
		$model = new Model();
		$result = $model->table('info_user_config uc')->join('info_file f on uc.file_id = f.id')->field('f.id,f.file_name,f.insert_time,f.fastdfs_id')->where('uc.user_id='.$uid)->find();
		return $result;
	}

	public function getUserTokenById($uid){
		$result = M('info_user_token')->where('user_id='.$uid)->order('create_time desc')->select();
		return $result;
	}

	public function getUserDevById($uid){
		$model = new Model();
		$result = $model->table('inter_user_dev ud')->join('info_device d on ud.device_id = d.device_id')->field('d.device_id,d.device_sn')->where('ud.user_id='.$uid)->select();
		return $result;
	}

	public function getFileContentById($uid){
		$model = new Model();
		$result = $model->table('info_user_config uc')->join('info_file f on uc.file_id = f.id')->field('f.id,f.file_name,f.file_content')->where('uc.user_id='.$uid)->find();
		return $result;
	}

	public function getAreaName($id){
		$row = M('info_area')->where('id='.$id)->find();
		return $row['name'];
	}

	public function updateVerific($uid,$v){
		$data['verification'] = $v;
		$condition['user_id'] = $uid;
		$result = M('info_user')->data($data)->where($condition)->save();
		return $result;
	}
	
	public function getAppKeyInfo($username){
		$row = M('info_app_key')->where('user_name=\''.$username.'\'')->find();
		return $row;
	}

	public function getLineUser($uid){
		$result = M('line_config')->where('user_id='.$uid)->select();
		return $result;
	}

	public function getModeUser($uid){
		$result = M('line_mode')->where('user_id='.$uid)->select();
		return $result;
	}

}
?>