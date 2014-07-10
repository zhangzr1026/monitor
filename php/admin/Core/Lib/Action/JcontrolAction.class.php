<?php
class JcontrolAction extends CommonAction
{
	protected function dbinit(){
		$myConnect1 = 'mysql://root:root@localhost:3306/test';
 		$objdb = M('','AdvModel');
 		$objdb->addConnect($myConnect1,1);
 		$objdb->switchConnect(1);
		return $objdb;	
	}
	public function index(){
		$this->assign('nav','Jcontrol');
		$this->assign('sub','index');
		$this->display();
	}

	public function getJsonData(){
		date_default_timezone_set("PRC");
		$myhour = date('H');
		$start =	 $myhour - 6 <0	?	 0 : $myhour-6;
		$end	  =  $myhour + 6 >24?	24: $myhour+6;
		$myData = array();
		for($i=0;$i<$end-$start;$i++){
			$myData[$i]		= array();
			$myData[$i][0]	= $i+$start;
			$myData[$i][1]	= rand(0,100);
		}
		echo json_encode($myData);	
	}
}
?>