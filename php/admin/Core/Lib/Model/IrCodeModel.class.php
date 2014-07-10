<?php
class IrCodeModel extends Model {

	protected $_dbname	= 'vanelife_test';
	protected $_table;
	protected $_connected;
	protected $_port	= '3306';
 
	public function __construct(){

		//数据库连接操作，实例化$_connected;
		$conn = 'mysql://'.C('DB_USER').':'.C('DB_PWD').'@'.C('DB_HOST').':'.$this->_port.'/'.C('DB_BG_NAME');
 		$this->_connected = M('','AdvModel');
 		$this->_connected->addConnect($conn,1);
 		$this->_connected->switchConnect(1);
	}

	//获取已上传的红外数据的各版本的列表信息
	public function getAllIrCodeListInfo(){
	
		$result = $this->_connected->table('manager_ircoder')->order('ircode_id desc')->select();
		return $result;

	}

	public function getIrCodeInfo($ircode_id){
		$row = $this->_connected->table('manager_ircoder')->where('ircode_id='.$ircode_id)->find();
		return $row;
	}

	public function addIrCodeInfo($download_url,$comment,$owner){
		$result = $this->_connected->execute("insert into manager_ircoder(in_service,download_url,comment,owner)values(0,'".$download_url."','".$comment."','".$owner."')");
		if($result){
			return $this->_connected->getLastInsID();
		}
		return 0;
	}

	//获取服务器当前正在使用的红外的版本编号
	public function getCurVerIrCodeId(){
	
		$condition = array(
			'in_service' => TRUE,
		);
		$row = $this->_connected->table('manager_ircoder')->where($condition)->field('ircode_id')->find();
		if($row){
			return $row["ircode_id"];
		}
		return 0;

	}

	//根据版本编号获取该红外的基本信息
	public function getIrCodeInfoById($ircode_id){
		
		if(!$ircode_id){
			return null;
		}
		$result = $this->_connected->table('manager_ircoder_gather')->field('id gid,cate_name,brand_name,model_name')->where('ircode_id ='.$ircode_id)->select();
		return $result;

	}

	//红外采集需求列表信息
	public function getAllIrGatherListInfo($condition){
	
		$result = $this->_connected->table('manager_ircoder_gather')->where($condition)->order('modify_date desc')->select();
		return $result;
	
	}

	public function getIrGather($condition){
		$result = $this->_connected->table('manager_ircoder_gather')->where($condition)->order('modify_date desc')->select();
		return $result;
	}

	//红外采集信息编辑
	public function editIrGatherInfo($data,$condition,$table='manager_ircoder_gather'){
		$sql = 'UPDATE '.$table.' SET';
		foreach($data as $key => $val){
			$sql=$sql.' '.$key.'=\''.$val.'\',';
		}
		$sql = rtrim($sql,',');
		$sql = $sql.' where 1';
		foreach($condition as $k =>$v){
			$sql = $sql.' and '.$k.'=\''.$v.'\'';
		}
		$result = $this->_connected->execute($sql);
		if($result){
			return true;
		}
		else{
			return false;
		}
	}

	//红外采集信息删除
	public function delIrGatherInfo($id){
		if(!$id){
			return false;
		}
		$condition = array(
			'id' 		=> $id,
			'schedule'	=> 0,
		);
		$result = $this->_connected->table('manager_ircoder_gather')->where($condition)->delete();
		if($result){
			return true;
		}
		return false;
	}

	public function getAppliance(){

		return $this->_connected->table('manager_appliance_category')->select();

	}

	public function getBrand(){
		
		return $this->_connected->table('manager_appliance_brand')->select();
	}

	public function getBrandInAppliance($cat_name){

		return $this->_connected->table('manager_appliance_inter_cb')->where('cate_name=\''.$cat_name.'\'')->select();

	}

	public function getApplianceInBrand($brand_name){
		return $this->_connected->table('manager_appliance_inter_cb')->where('brand_name=\''.$brand_name.'\'')->select();
	} 

	public function addCategory($cate_name){
		return $this->_connected->execute('insert into manager_appliance_category(cate_name)values(\''.$cate_name.'\')');
	}

	public function delCategory($cate_name){
		return $this->_connected->execute('delete from manager_appliance_category where cate_name=\''.$cate_name.'\'');
	}

	public function addBrandBindCate($cate_name,$brand_name){
		return $this->_connected->execute('insert into manager_appliance_inter_cb(cate_name,brand_name)values(\''.$cate_name.'\',\''.$brand_name.'\')');	
	}

	public function delBrandBindCate($cate_name,$brand_name){
		return $this->_connected->execute('delete from manager_appliance_inter_cb where cate_name=\''.$cate_name.'\' and brand_name=\''.$brand_name.'\'');
	}

	public function delBrand($brand_name){
		return $this->_connected->execute('delete from manager_appliance_brand where brand_name=\''.$brand_name.'\'');
	}

	public function delBrandBind($brand_name){
		return $this->_connected->execute('delete from manager_appliance_inter_cb where brand_name=\''.$brand_name.'\'');
	}

	public function isExistBrand($brand_name){
		return $this->_connected->table('manager_appliance_brand')->where('brand_name=\''.$brand_name.'\'')->select();
	}

	public function addBrand($brand_name){
		return $this->_connected->execute('insert into manager_appliance_brand(brand_name)values(\''.$brand_name.'\')');	
	}

	public function addIrGather($cate_name,$brand_name,$model_name,$user,$date){
		return $this->_connected->execute('insert into manager_ircoder_gather(cate_name,brand_name,model_name,modify_user,publish_date)values(\''.$cate_name.'\',\''.$brand_name.'\',\''.$model_name.'\',\''.$user.'\',\''.$date.'\')');
	}
}
?>