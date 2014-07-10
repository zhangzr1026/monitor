<?php
class BossAction extends CommonAction{
	
	public function index(){
		$this->report();
	}

	public function report(){
		$this->assign('nav','Boss');
		$this->assign('sub','report');
		$this->display('report');
	}
}
?>