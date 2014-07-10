<?php
class TestInterfaceAction extends CommonAction
{
	public function index(){
		#$k = isset($_REQUEST['k'])?$_REQUEST['k']:0;
		$k  = 0;
		#$IF_param = C('IF_PARAM');
		$row = $this->_connected->table('info_interface')->where('id=1')->find();
		if($row && is_array($row)){
			$IF_param  = unserialize($row['param_value']);	
		}else{
			$IF_param	= C('IF_PARAM');
		}		
		#$IF_param[$k]['IF_device_desc']		= json_encode($IF_param[$k]['IF_device_desc']);
		$IF_param[$k]['IF_device_status']	= json_encode($IF_param[$k]['IF_device_status']);
		#$IF_param[$k]['IF_ep_desc']			= json_encode($IF_param[$k]['IF_ep_desc']);
		$IF_param[$k]['IF_ep_status']		= json_encode($IF_param[$k]['IF_ep_status']);

		//$this->initdata($k);

		$n = $k+1;
		$this->assign('if_key',$k);
		$this->assign('if_n',$n);
		$this->assign('if_pm',$IF_param);
		$this->assign("if_param",$IF_param[$k]);
		$this->display();
	}

	private function initdata($k){
		
		$model = D('TestInterface');
		$param = C('IF_PARAM');
		$data  = $param[$k];

		$model->setIFId($k);

		$uid = $model->getUser($data['IF_user_account'],$data['IF_user_pwd']);
		
		if(!$user){
			 $uid=$model->addUser($data['IF_user_account'],$data['IF_user_pwd']);
		}

		$appkey	=	$model->getAppKey($data['IF_app_key'],$data['IF_app_secret'],$uid);
		 
		if(!$appkey){
			$model->addAppKey($data['IF_app_key'],$data['IF_app_secret'],$uid);
		}

		$device = $model->getDeviceSn($uid,$data['IF_device_sn']);
		if(!$device){
			$model->addDeviceSn($uid,$data['IF_device_sn']);
		}

		$ep = $model->getEP($uid,$data['IF_ep_id']);
		if(!$ep){
			$model->addEP($uid,$data['IF_ep_id']);
		}

	} 

	public function test(){
		#$IF_param	= C('IF_PARAM');
		
		$row = $this->_connected->table('info_interface')->where('id=1')->find();
		if($row && is_array($row)){
			$IF_param  = unserialize($row['param_value']);	
		}else{
			$IF_param	= C('IF_PARAM');
		}
		
		$if_id      = $_REQUEST['id'];
 		$if_k		= $_REQUEST['k'];
		$url 		= $_REQUEST['if_url'];
		#$url		= $IF_param[$if_k]['IF_url'].$_REQUEST['if_url'];
		#$key		= $IF_param[$if_k]['IF_app_key'];
		#$secret	= $IF_param[$if_k]['IF_app_secret'];
		$key		= $_REQUEST['app_key'];
		$secret		= $_REQUEST['app_secret'];

		unset($_REQUEST['k']);
		unset($_REQUEST['if_url']);
		unset($_REQUEST['id']);
		unset($_REQUEST['app_key']);
		unset($_REQUEST['app_secret']);

		$data = array();
		foreach($_REQUEST as $k =>$v){
			if($v){
				$data[$k]=$v;
			}
		}

		$date =date('Y-m-d H:i:s',time());
		$time = str_replace(' ','T',$date);
		$default = array('key'=>$key,'timestamp'=>$time);
		$sgindata = array_merge($data,$default);	
		$default['signature'] = $this->createSign ($sgindata,$secret);
		if($if_id==13){
			$default['dp_data'] = $IF_param[$if_k]['IF_upload_dp'];
		}
		$result = $this->curlquest($url,array_merge($data,$default));

		if($if_id==1){
			$r = $this->curlquest($url,array_merge($data,$default),0);
			if(trim($r)){
				$d = (array)json_decode(trim($r));
				$access_id = $d['dev_id'];
				$app_id    = $d['app_id'];
				$return = array('info'=> $result,'access_id' => $access_id,'app_id'=>$app_id);
				echo json_encode($return);
				return;
			}
		}
		echo $result;
	}


	public function testnew(){
		#$IF_param	= C('IF_PARAM');
		
		$row = $this->_connected->table('info_interface')->where('id=1')->find();
		if($row && is_array($row)){
			$IF_param   = unserialize($row['param_value']);	
		}else{
			$IF_param	= C('IF_PARAM');
		}

		$if_id      = $_REQUEST['id'];
 		$if_k		= $_REQUEST['k'];
		#$url		= $IF_param[$if_k]['IF_url'].$_REQUEST['if_url'];
		$url		= $_REQUEST['if_url'];

		unset($_REQUEST['k']);
		unset($_REQUEST['if_url']);
		unset($_REQUEST['id']);

		$data = array();
		foreach($_REQUEST as $k =>$v){
			if($v){
				$data[$k]=$v;
			}
		}


		if($if_id==22){
			$r = $this->curlquest($url,$data,0);
			if(trim($r)){
				$d = (array)json_decode(trim($r));
				$user_token = $d['user_token'];
				$return = array('info'=> $r,'user_token' => $user_token);
				echo json_encode($return);
				return;
			}
		}elseif($if_id==20){
			return "";
		}	
		elseif($if_id==27 || $if_id==37){
			$fields_string='';
			foreach($data as $key=>$value) {
				$fields_string .= $key.'='.$value.'&' ;
			}
			$fields_string = rtrim($fields_string ,'&');
			$result = $this->curlquest($url.'?'.$fields_string);
		}
		else{
			if($if_id==30){
				$data['bin']='@'.$data['configfile'];
			}
			$result = $this->curlquest($url,$data);
		}
		echo $result;

	}

	private function curlquest($url,$data=array(),$header=1,$method='POST'){
		$ch = curl_init() ;
		curl_setopt($ch, CURLOPT_URL,$url);
		curl_setopt($ch, CURLOPT_HEADER, $header);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
		curl_setopt($ch, CURLOPT_POST,1);
		curl_setopt($ch, CURLOPT_POSTFIELDS,$data);
		$result = curl_exec($ch) ;		
		$status = curl_getinfo($ch, CURLINFO_HTTP_CODE); 
		curl_close($ch);
		return $result;	
	}

	private  function createSign ($paramArr,$app_secret) {
		$sign = '';
		ksort($paramArr);
		foreach ($paramArr as $key => $val) {
				$sign .= $key.$val;
		}
		$sign .= $app_secret;
		$sign  = strtoupper(md5($sign));
		return $sign;
	}
	
	public function setIFParameter(){		
		$row = $this->_connected->table('info_interface')->where('id=1')->find();
		if($row && is_array($row)){
			$if_param = unserialize($row['param_value']);		
			foreach($_REQUEST as $key => $value){
				$if_param[0][$key]	= $value;				
			}
			
			$result = $this->_connected->execute('update info_interface set param_value =\''.serialize($if_param).'\' where id=1');
			if($result){
				$this->ajaxReturn(1, "设置成功", 1);
			}else{
				$this->ajaxReturn(0, "设置失败", 0);
			}
		}else{
			$if_param = C('IF_PARAM');
			foreach($_REQUEST as $key => $value){
				$if_param[0][$key]	= $value;				
			}
			
			$result = $this->_connected->execute('insert into info_interface(id,param_value)values(1,\''.serialize($if_param).'\')');
			if($result){
				$this->ajaxReturn(1, "设置成功", 1);
			}else{
				$this->ajaxReturn(0, "设置失败", 0);
			}
		}
		$this->ajaxReturn(0, "设置失败", 0);
	}
}
?>
