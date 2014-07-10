<?php
class VocationalAction extends CommonAction{
	
	public function index(){
		$this->report();
	}

	public function report(){
		$this->assign('nav','Vocational');
		$this->assign('sub','report');
		$this->display('report');
	}
}
?>