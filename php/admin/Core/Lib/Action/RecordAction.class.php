<?php
/**
 * 
 * 统计信息
 * 
 *
 */

class RecordAction extends CommonAction
{
	public function index(){
		
		$model	= D('Record');
		$data	= $model->getAllRecordInfo();

		$this->assign( "recordlist", $data );
		$this->assign( "nav", 'record' );
		$this->assign( "sub", 'index' );
		$this->display();
   	}
   	
}
?>
