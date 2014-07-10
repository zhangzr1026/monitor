<?php
class RecordModel extends Model {
	
	protected $_table = 'info_record';

	protected $_dbname	= 'vanelife_test';
	protected $_connected;
	protected $_port	= '3306';
 
	public function __construct(){

		//数据库连接操作，实例化$_connected;
		$conn = 'mysql://'.C('DB_USER').':'.C('DB_PWD').'@'.C('DB_HOST').':'.$this->_port.'/'.C('DB_BG_NAME');
 		$this->_connected = M('','AdvModel');
 		$this->_connected->addConnect($conn,1);
 		$this->_connected->switchConnect(1);
	}

	public function setTable($table){

		$this->_table = $table;

	}

	public function getTable(){

		return $this->_table;

	}
	
	public function getAllRecordInfo(){
		$table	= $this->getTable(); 
		$model	= $this->_connected->table($table);

		$result	= $model->order('insert_time DESC')->select();

		return $result;
	}
	
	public function getActivedHacNum(){

		$this->setTable('info_hac');
		$table	= $this->getTable(); 
		$model	= $this->_connected->table($table);

		$cases['activation_code']  = array('neq',"0");

		$count  = $model->where($cases)->count();

		return $count;
	
	}

	public function getOnlineHacNum(){

   		$this->setTable('info_hac');
		$table	= $this->getTable(); 
		$model	= $this->_connected->table($table);

		$cases['state']  = array('eq',"1");

		$count         = $model->where($cases)->count();

		return $count;
   	}

	public function getUserNum(){
 
		$this->setTable('info_user');
		$table	= $this->getTable(); 
		$model	= $this->_connected->table($table);

		$cases['is_valid']  = array('eq',"1");
		$cases['created_time']  = array('gt',FIRST_PUBLISH_DATE);

		$count         = $model->where($cases)->count();

		return $count;
   	}

}

?>