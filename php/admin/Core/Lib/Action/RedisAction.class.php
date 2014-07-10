<?php
class RedisAction extends CommonAction
{
	public function index(){
		$redis = new Redis();  
		try{
			$redis->connect(REDIS_IP,REDIS_PORT);
			//$auth = $redis->auth('123456');
			$isParam_a = $redis->get('isParam_a');
			$isParam_b = $redis->get('isParam_b');
			$this->assign("isParam_a",$isParam_a);
			$this->assign("isParam_b",$isParam_b);

			$this->assign("nav","Audit");
			$this->assign("sub","Redis");
			$this -> display();
		}catch(Exception $e){
			echo 'connect fail';
			return;
		}
	}
	
	public  function setRedis(){
		$name = $_REQUEST['name'];
		$value = $_REQUEST['value'];
		if($name && $value){
			$redis = new Redis();  
			$redis->connect(REDIS_IP,REDIS_PORT);
			$redis->delete($name);
			$redis->set($name,$value);
		}
		echo 'set success';
	}
}
?>