<?php
class OpenInterfaceAction extends CommonAction
{

	public function index(){
		$this->assign("nav","Audit");
		$this->assign("sub","OpenInterface");
		$profile = M('info_setting_interface')->select();
		$domain = $profile[0]['dimain'];
		$app_key = $profile[0]['app_key'];
		$app_secret = $profile[0]['app_secret'];
		foreach($profile as $key => $value){
			$data[$value['id']] = unserialize($value['param_value']);
		}
		$this->assign("domain",$domain);
		$this->assign("app_key",$app_key);
		$this->assign("app_secret",$app_secret);
		$this->assign("data",$data);
		$this->display();	
	}
	
	private function curlquest($url,$data=array(),$header=1,$method='POST'){
		//$fields = $data;
		$fields_string='';
		foreach($data as $key=>$value) {
			$fields_string .= $key.'='.$value.'&' ;
		}
		rtrim($fields_string ,'&');
		$ch = curl_init() ;
		curl_setopt($ch, CURLOPT_URL,$url);
		curl_setopt($ch, CURLOPT_HEADER, $header);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
		curl_setopt($ch, CURLOPT_POST,count($data));
		curl_setopt($ch, CURLOPT_POSTFIELDS,$fields_string);
		$result = curl_exec($ch) ;		
		$status = curl_getinfo($ch, CURLINFO_HTTP_CODE); 
		curl_close($ch);
		if($status == 403 || $status == 404 ){
			return $status;
		}
		return $result;	
	}
	
	public function test(){
		$url = $_REQUEST['interface_url'];
		unset($_REQUEST['interface_url']);
		$key = $_REQUEST['app_key'];
		unset($_REQUEST['app_key']);
		$secret = $_REQUEST['app_secret'];
		unset($_REQUEST['app_secret']);
		$data = array();
		foreach($_REQUEST as $key1 =>$value){
			if($value){
				$data[$key1]=$value;
			}
		}
		//$data = $_REQUEST;
		$date =date('Y-m-d H:i:s',time());
		$time = str_replace(' ','T',$date);
		$default = array('key'=>$key,'timestamp'=>$time);
		$sgindata = array_merge($data,$default);
		$default['signature'] = $this->createSign ($sgindata,$secret);
		//print_r(array_merge($data,$default));exit;
		echo $this->curlquest($url,array_merge($data,$default));
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

	public function beginTestAll(){
		$amq_url = 'http://localhost:8161/api/message/InterfaceError?type=queue';
		$userpwd = 'admin:admin';
		$profile = M('info_setting_interface')->select();
		$model = D('Interface');
		$model -> setParamsData(array('device_sn'=>'device13878482471','device_key'=>'123456'));
		$success_data = '';
		$fail_data = '';
		$i=1;
		foreach($profile as $k => $value){
			$param = unserialize($value['param_value']);
			$url = $value['dimain'].$param['interface_url'];
			unset($param['interface_url']);
			$key = $value['app_key'];
			$secret = $value['app_secret'];
			$dkey = array_keys($param);
			$data = $model -> getParamsData($dkey);
			//$data = $_REQUEST;
			$date =date('Y-m-d H:i:s',time());
			$time = str_replace(' ','T',$date);
			$default = array('key'=>$key,'timestamp'=>$time);
			$sgindata = array_merge($data,$default);
			$default['signature'] = $this->createSign ($sgindata,$secret);
			$fail_data = '';
			if($k == '12'){
				$result = '';
			}else{
				$result = $this->curlquest($url,array_merge($data,$default),0);
				if($result == 403){
					$fail_data = '<p style="font-size:24px;color:red">请求的测试地址出错，请检查！</p>';
				}
				if($result == 404){
					$fail_data =$this -> getPrintHtml($i,$url,$this->array2string(array_merge($data,$default)),'请求的页面不存在','red');
				}

			}		
			if($result && $result != 404){
				$res = (array)json_decode($result);
				if(isset($res['error_code'])){
					$fail_data = $this -> getPrintHtml($i,$url,$this->array2string(array_merge($data,$default)),$result,'red');
				}else{
					if($k=='0'){
						$model -> setParamsData($res);
					}
				}
			}
			$i++;
			if($fail_data){
				$amq_data = array('body' => $fail_data);
				$this -> alert_activemq($amq_url,$userpwd,$amq_data);
			}
		}
		
	}
	
	public function setParam(){
		$pid = $_REQUEST['pid'];
		unset($_REQUEST['pid']);
		$data = serialize($_REQUEST);
		$m = new Model();
		//$result = M('manager_role')->where(array('role_name' =>	$role_name))->data(array('role_audit'	=> $tag))->save();
		$sql = "update info_setting_interface set param_value = '".$data."' where id=".$pid;
		$result=$m->query($sql);
		echo true;
	}

	public function setParam1(){
		$domain = $_REQUEST['domainurl'];
		$app_key = $_REQUEST['app_key'];
		$app_secret = $_REQUEST['app_secret'];
		$m = new Model();
		//$result = M('manager_role')->where(array('role_name' =>	$role_name))->data(array('role_audit'	=> $tag))->save();
		$sql = "update info_setting_interface set `dimain`='".$domain."',`app_key`='".$app_key."',`app_secret`='".$app_secret."'";
		$result=$m->query($sql);
		echo true;
	}

	private function write_log($log_path,$msg)
	{
		$filepath = $log_path.'log-'.date('Y-m-d').'.php';
		$message  = '';

		if ( ! $fp = @fopen($filepath, 'a+'))
		{
			return FALSE;
		}

		$message .= date('Y-m-d H:i:s'). ' --> '.$msg."\r\n\r\n";

		flock($fp, LOCK_EX);
		fwrite($fp, $message);
		flock($fp, LOCK_UN);
		fclose($fp);

		@chmod($filepath, 0777);
		return TRUE;
	}

	function testAllInterface(){
		$ifid = $_REQUEST['ifid'];
		$t	  = $_REQUEST['t'];
		$profile = array();
		if($t){
			if($ifid){
				 $pos = strpos($ifid, ',');
				 if($pos){
					 $id = explode(',',$ifid);
					 foreach($id as $id_k => $id_val){
						$result = M('info_setting_interface')->where(array('id'=>$id_val))->select();	
						$profile[$id_k] = $result[0];
					 }
				 }else{
					$result = M('info_setting_interface')->where(array('id'=>$ifid))->select();
					$profile[0] = $result[0];
				 }
			}else{
				echo '<p style="font-size:24px;color:red">没有选择要测试的接口!</p>';exit;
			}		
		}else{
			$profile = M('info_setting_interface')->select();
		}
		$model = D('Interface');
		$model -> setParamsData(array('device_sn'=>'device13878482471','device_key'=>'123456'));
		$success_data = '';
		$fail_data = '';
		$i=1;
		foreach($profile as $k => $value){
			$param = unserialize($value['param_value']);
			$url = $value['dimain'].$param['interface_url'];
			unset($param['interface_url']);
			$key = $value['app_key'];
			$secret = $value['app_secret'];
			$dkey = array_keys($param);
			$data = $model -> getParamsData($dkey);
			//$data = $_REQUEST;
			$date =date('Y-m-d H:i:s',time());
			$time = str_replace(' ','T',$date);
			$default = array('key'=>$key,'timestamp'=>$time);
			$sgindata = array_merge($data,$default);
			$default['signature'] = $this->createSign ($sgindata,$secret);
			if($k == '12'){
				$result = '';
			}else{
				$result = $this->curlquest($url,array_merge($data,$default),0);
				if($result == 403){
					echo '<p style="font-size:24px;color:red">请求的测试地址出错，请检查！</p>';exit;
				}
				if($result == 404){
					$fail_data .=$this -> getPrintHtml($i,$url,$this->array2string(array_merge($data,$default)),'请求的页面不存在','red');
				}

			}		
			if($result && $result != 404){
				$res = (array)json_decode($result);
				if(isset($res['error_code'])){
					$fail_data .=$this -> getPrintHtml($i,$url,$this->array2string(array_merge($data,$default)),$result,'red');
				}else{
					if($k=='0'){
						$model -> setParamsData($res);
					}
					$success_data .=$this -> getPrintHtml($i,$url,$this->array2string(array_merge($data,$default)),$result,'green');
				}
			}else{
				$success_data .=$this -> getPrintHtml($i,$url,$this->array2string(array_merge($data,$default)),'','green');
			}
			$i++;
		}
		if($fail_data){
			$fail_data=rtrim($fail_data ,'<hr/ color="#CCCCCC" style="border:1px dashed;">').'<br/><br/>';
			echo '<p style="color:red;font-size:20px;">测试失败接口如下:</p><hr/ style="border:1px solid;color:#CCCCCC">'.$fail_data;
			echo '<br/><hr/ style="border:2px double;color:#00FFFF" ><br/>';
		}

		if($success_data){
			$success_data=rtrim($success_data ,'<hr/ color="#CCCCCC" style="border:1px dashed;">').'<br/><br/>';
			echo '<p style="color:green;font-size:20px;">测试成功接口如下:</p><hr/ style="border:1px solid;color:#CCCCCC">'.$success_data;
		}	
	}

	private function getPrintHtml($id,$url,$content,$result,$color){
		$string = '<B>接口编号</B>:'.$id.';<br/><B>请求的url</B>:<B>'.$url.'</B>;<br/><B>请求参数</B>:'.$content.';<br/>';
		if($result){
			$string .= '<B>请求结果</B>:<p style="color:'.$color.'">'.$result.'</p>';
		}
		$string .= '<br/><br/><hr/  style="border:1px dashed;color:#CCCCCC">';
		return $string;
	
	}

	private function array2string($data){
		$fields_string = '';
		foreach($data as $key=>$value) {
			$fields_string .= $key.'='.$value.';' ;
		}
		return rtrim($fields_string ,';');
	}

	private function alert_activemq($url,$userpwd,$data,$type='send'){
		$string = '';
		if($type == 'send'){
			foreach($data as $key=>$value) {
				$string .= $key.'='.$value.'&' ;
			}
		}
		$ch = curl_init() ;
		curl_setopt($ch, CURLOPT_URL,$url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		if($type == 'send'){
			curl_setopt($ch, CURLOPT_POST,count($data));
			curl_setopt($ch, CURLOPT_POSTFIELDS,$string) ;
		}
		curl_setopt($ch, CURLOPT_USERPWD, $userpwd);
		curl_setopt($ch, CURLOPT_UNRESTRICTED_AUTH, 1);
		$result = curl_exec($ch) ;
		curl_close($ch);
		return $result;
	}
}
?>
