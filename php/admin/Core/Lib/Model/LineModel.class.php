<?php
class LineModel extends Model {
	
	//获取联动列表
	public function getLineConfigList(){
		$result = M('line_config')->order('create_time desc')->select();
		return $result;
	}

	//获取联动描述信息
	public function getLineConfigDesc($config_id){
		$row = M('line_config')->where('config_id='.$config_id)->find();
		return $row['config_desc'];
	}

	//获取模式列表
	public function getLineModeList(){
		$result = M('line_mode')->order('create_time desc')->select();
		return $result;
	}

	//获取模式描述信息
	public function getLineModeDesc($mode_id){
		$row = M('line_mode')->where('mode_id='.$mode_id)->find();
		return $row['mode_desc'];
	}

	//以下是联动的相关详情
	public function getLineCondtion($config_id){
		$result = M('line_condition')->where('config_id='.$config_id)->select();
		return $result;
	}

	public function getLineCondArgDp($config_id,$cond_id){
		$data = array();
		$result = M('line_cond_arg_dp')->where('config_id='.$config_id.' and condition_id='.$cond_id)->select();
		foreach($result as $key => $value){
			$data1['type']					= "self";
			$data1['data']['access_id']		= $value['device_id'];
			$data1['data']['ep_id']			= $value['ep_id'];
			$data1['data']['dp_id']			= $value['dp_id'];
			$data[]							= $data1;
		}
		return $data;
	}

	public function getLineCondArgData($config_id,$cond_id){
		$data = array();
		$result = M('line_cond_arg_data')->where('config_id='.$config_id.' and condition_id='.$cond_id)->select();
		foreach($result as $key => $value){
			$data1['type']					= "data";
			$data1['data']					= json_decode($value['data']);
			$data[]							= $data1;
		}
		return $data;
	}

	//以下是模式的相关详情
	public function getLineActionConfig($mode_id){
		$result = M('line_action_config')->where('mode_id='.$mode_id)->select();
		return $result;
	}

	public function getLineActionAlert($mode_id){
		$result = M('line_action_alert')->where('mode_id='.$mode_id)->select();
		return $result;
	}

	public function getLineActionControl($mode_id){
		$result = M('line_action_control')->where('mode_id='.$mode_id)->select();
		return $result;
	}

	public function getModeChain($config_id){
		$result = M('line_mode_chain')->where('config_id='.$config_id)->select();
		return $result;
	}

}
?>