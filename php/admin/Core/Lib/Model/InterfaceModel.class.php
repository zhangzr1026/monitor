<?php
class InterfaceModel extends Model {
	
	//the next are the AllInterface's param data or data struct; 
	protected $device_sn = 'device13878482471';
	protected $device_key = '123456';
	protected $device_desc;
	protected $device_status;

	protected $access_id;

	protected $ep_id = 'ep13878540101';
	protected $ep_type = 0;
	protected $ep_desc;
	protected $ep_status;

	protected $dp_id = '001';
	protected $dp_mode = 'rw';
	protected $dp_type = 'raw';
	protected $dp_schema = '';
	protected $dp_desc = '';
	protected $dp_name = 'dp_mode';

	protected $start = '2013-11-24T14:36:19';
	protected $end = '2013-12-24T14:36:19';

	protected $vendor = 'Vane';
	protected $ver_hw = '1.0';
	protected $ver_sw = '1.0';
	protected $model  = 'SM01';
	protected $desc   = '';

	protected $battery= 70;
	protected $signal = 40;
	protected $online = true;

	protected $dev_id = '';
	protected $app_id = '';

	public function getDevEpDesc(){
		$descData = array('vendor'=>$this->vendor,'ver_hw'=>$this->ver_hw,'ver_sw'=>$this->ver_sw,'model'=>$this->model);
		return json_encode($descData);
	}

	public function getDevEpStatus(){
		$statusData = array('battery'=>$this->battery,'signal'=>$this->signal,'online'=>$this->online);
		return json_encode($statusData);
	}

	public function setParamsData($data){
		if(!$data){
			return;
		}
		if(is_array($data)){
			foreach($data as $key => $value){
				if(isset($this->$key)){
					$this -> $key = $value;
				}
			}	
		}else{
			$string = explode("=",$data);
			$this -> $string[0] = $string[1];
		}
	}

	public function getParamsData($keyarr=array()){
		$this -> setAaccessId();
		$this -> device_desc	= $this -> getDevEpDesc();
		$this -> ep_desc		= $this -> getDevEpDesc();
		$this -> device_status	= $this -> getDevEpStatus();
		$this -> ep_status		= $this -> getDevEpStatus();
		$paramsArr = array();
		foreach($keyarr as $k => $arr){
			if(isset($this->$arr) && $this->$arr){
				$paramsArr[$arr] = $this->$arr;
			}
		}
		return $paramsArr;
	}

	public function setAaccessId(){
		if($this -> dev_id){
			$this -> access_id = $this -> dev_id;
			return;
		}
		if($this -> app_id){
			$this -> access_id = $this -> app_id;
			return;
		}
		$this -> access_id = '';
		return;
	}
}
?>