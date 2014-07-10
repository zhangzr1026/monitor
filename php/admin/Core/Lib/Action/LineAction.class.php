<?php
// 本文档自动生成，仅供测试运行
class LineAction extends CommonAction
{

	public function index()
    {
		$result = D('Line')->getLineConfigList();
		$this->assign("lineConf",$result);
        $this->display();
    }

	public function mode(){
		$result = D('Line')->getLineModeList();
		$this->assign("lineMode",$result);
        $this->display('mode');
	}

	public function lineinfo(){
		$config_id = $_REQUEST['config_id'];

		$model = D('Line');
		$info = array();

		$info['desc'] = $model->getLineConfigDesc($config_id);

		$condtion = $model->getLineCondtion($config_id);
		foreach($condtion as $key => $value){
			$arg_dp			=  $model->getLineCondArgDp($config_id,$value['condition_id']);
			$arg_data		=  $model->getLineCondArgData($config_id,$value['condition_id']);
			$data['args']   =  array_merge($arg_dp,$arg_data);
			$data['method'] =  $value['method'];
			$data['desc']   =  $value['description'];
			$info['condition'][]=$data;
		}

		$mode = $model->getModeChain($config_id);
		foreach($mode as $key => $value){
			$m['mode_id']		= $value['mode_id'];
			$info['modes'][]	= $m;
		}
			
		$this->assign('info',json_encode($info));
		$this->display('lineinfo');
	}

	public function modeinfo(){
		$mode_id = $_REQUEST['mode_id'];
		$model = D('Line');
		$info = array();

		$info['desc']=$model->getLineModeDesc($mode_id);

		$actions = $model->getLineActionControl($mode_id);
		if(count($actions)){
			foreach($actions as $key => $value){
				$action['dest']['access_id']  = $value['device_id'];
				$action['dest']['ep_id']	  = $value['ep_id'];
				$action['dest']['dp_id']	  = $value['dp_id'];
				$action['cmd']				  = $value['command'];
				$action['desc']				  = $value['description'];
				
				$info['actions'][]		      = $action;
			}
		}else{
			$info['actions'] = array();
		}
		

		$rules = $model->getLineActionConfig($mode_id);
		if(count($rules)){
			foreach($rules as $key =>$value){
				$rule['rule_id']						= $value['config_id'];
				$rule['property'][$value['property']]	= $value['value'];
				$info['rules'][]						= $rule;
			}
		}else{
			$info['rules'] = array();
		}
		

		$alerts = $model->getLineActionAlert($mode_id);
		if(count($alerts)){
			foreach($alerts as $key =>$value){
				$alert['type']		= $value['type'];
				$alert['message']	= $value['message'];
				$info['alerts'][]  = $alert;
			}
		}else{
			$info['alerts'] = array();
		}
		
		$this->assign('info',json_encode($info));
		$this->display('modeinfo');

	}

}
?>
