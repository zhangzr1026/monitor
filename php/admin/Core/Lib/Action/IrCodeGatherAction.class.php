<?php
/**
 * 
 * IrCodeGather
 * @author zhangzr1026
 *
 */
class IrCodeGatherAction extends CommonAction
{
	public function index()
	{
		import("ORG.Util.Page"); // 导入分页类
		$pageUrl = ''; //用于搜索分页传递参数，保持条件进行分页
		$formAction = ''; //用于搜索,比$pageUrl少一个searchValue参数
		$searchValue = ''; //搜索的标题
		$cases = array();
		$p = isset($_GET['p'])?intval($_GET['p']):1;   //初始化分页
		$order=''; //排序方式
		
		//搜索条件:需求ID
		if( isset($_REQUEST['gid']) && $_REQUEST['gid']!='' )
		{
			$gid  = $_REQUEST['gid'];
			$cases['id']  =$gid;
		    $pageUrl .= '/gid/'.$gid;
		}
		
		//搜索条件:电器类型,电器品牌,电器型号
		if( isset($_REQUEST['cate_name']) && $_REQUEST['cate_name']!='' )
		{
			$cate_name  = $_REQUEST['cate_name'];
			$cases['cate_name']  =$cate_name;
		    $pageUrl .= '/cate_name/'.$cate_name;
		}
		
		if( isset($_REQUEST['brand_name']) && $_REQUEST['brand_name']!='' )
		{
			$brand_name  = $_REQUEST['brand_name'];
			$cases['brand_name']  =$brand_name;
		    $pageUrl .= '/brand_name/'.$brand_name;
		}
		
		if( isset($_REQUEST['model_name']) && $_REQUEST['model_name']!='' )
		{
			$model_name  = $_REQUEST['model_name'];
			$cases['model_name']  =$model_name;
		    $pageUrl .= '/model_name/'.$model_name;
		}
		
		//搜索激活状态,按照是否有激活码来确定激活状态
		if( isset($_REQUEST['schedule']) && $_REQUEST['schedule']!='' )
		{
			$schedule  = $_REQUEST['schedule'];
			$cases['schedule']  =$schedule;
		    $pageUrl .= '/schedule/'.$schedule;
		}
		
		//搜索标题
		//$formAction = $pageUrl; //form搜索不需要包括搜索结果
		if( isset($_REQUEST['searchValue']) && $_REQUEST['searchValue']!='' )
		{
			$searchValue  = $_REQUEST['searchValue'];
			$searchtype = $_REQUEST['searchType'];
		    $cases[$searchtype]  = array('eq',"{$searchValue}");
		    $pageUrl .= '/searchValue/'.$searchValue;
		}
		
		//排序方式
		$order='modify_date DESC';
		
		//统计信息
		//$this->assign( "statisticsOnlineHac", $this->statisticsOnlineHac() );
		
		//获取数据
		$DM			= D('manager_ircoder_gather');
		$count      = $DM->where($cases)->count();
		
		$Page       = new Page($count,ROWSPERPAGE);
		$show       = $Page->showPage($pageUrl);
		$list       = $DM->where($cases)->order($order)->page($p.','.ROWSPERPAGE)->select();
		$this->additionalField($list);
		//$this->additionalFieldForRserver($list);
		//$this->assign( "formaction", $formAction );
		$this->assign( "page", $show );
		$this->assign ( "haclist", $list );
		$this->assign( "nav", 'ircode' );
		$this->assign ( "sub", 'gather' );
		$this->assignSelectOption();
		$this->display();
	}

	public function add()
	{
		$this->assignSelectOption();
		$this->assign( "nav", 'ircode' );
		$this->assign ( "sub", 'gather' );
		$this->display();
	}
	
	private function assignSelectOption()
	{
		$cate_name_list = M('manager_appliance_category')->select();
		$this->assign('cate_name_list',$cate_name_list);
		
		$brand_name_list = array();
		if($cate_name_list)
		{
			$condition = array(
				'cate_name' => $cate_name_list[0]['cate_name'],
			);
			$brand_name_list = M('manager_appliance_inter_cb')->where($condition)->select();
		}
		$this->assign('brand_name_list',$brand_name_list);
	}
	
	public function adding(){
		$cate_name		= $_REQUEST['cate_name'];
		$brand_name		= $_REQUEST['brand_name'];
		$model_name		= strtolower($_REQUEST['model_name']);
		$publish_date 	= date("Y-m-d H:i:s");
		
		$data = array(
			'cate_name'		=> $cate_name,
			'brand_name'	=> $brand_name,
			'model_name'	=> $model_name,
			'modify_user'	=> $this->UserName,
			'publish_date'	=> $publish_date,
		);
		$profile = M('manager_ircoder_gather')->data($data)->add();
		if($profile>0){
			$this->assign("jumpUrl","__APP__/IrCodeGather/index/");
			$this->success("Add Succeed");
		}
		else{
			$this->error("Add Failed.(可能已存在相同的电器,请先查找一下确认无相同电器以后再进行操作)");
		}
	}
	
	public function setschedule1(){
		$this->editing("schedule", 1);
	}
	
	public function setschedule2(){
		$this->editing("schedule", 2);
	}
	
	public function setschedule3(){
		$this->editing("schedule", 3);
	}
	
	public function setstate(){
		$state = intval( $_REQUEST['state'] );
		if($state == 1 || $state ==0){
			$this->editing("state", $state);
		}
		else{
			$this->error("Wrong Value for statue");
		}
	}
	
	private function editing($argc,$argv){
		$gid = $_REQUEST['gid'];
		if(!isset($gid)){
			$this->error("IrCode gather id required");
			die();
		}
		$condition = array(
			'id' => $gid,
		);
		$data = array(
			$argc => $argv,
		);
		$profile = M('manager_ircoder_gather')->data($data)->where($condition)->save();
		if($profile){
			$this->assign("jumpUrl","__APP__/IrCodeGather/index/gid/$gid");
			$this->success("Edit Succeed");
		}
		else{
			$this->error("Edit Failed");
		}
	}
	
	//每行添加一个对象
	private function additionalField(&$list){
		foreach ($list as &$val){
			//
			$curschedule = $val['schedule'];
			$tmpflow=array();
			
				foreach( C('IRCODE_GATHER_FLOW') as $mval){
					$tmp=array();
					$tmp['id']=$mval["id"];
					$tmp['tag']=$mval["tag"];
					
					if( intval($mval["id"])>intval($curschedule) )
					{
						$tmp['enable']=TRUE;
					}
					else {
						$tmp['enable'] = $mval["enable"];
					}
					/*
					$tmp['user_id']=$mval["user_id"];
					$tmp['info_user_user_id']=$mval["info_user_user_id"];
					$tmp['share_priv'] =$mval["share_priv"]; 
					*/
					array_push($tmpflow, $tmp);
				}
				
			$val['schedule_flow']=$tmpflow;
			$val['schedule_num'] = count(C('IRCODE_GATHER_FLOW')) - 1; //总的流程数
		}
		return true;
	}

	public function getBrandByCate()
	{
		$cate_name = $_REQUEST['argc'];
		$response = "";
		$condition = array(
			'cate_name' => $cate_name,
		);
		$list = M('manager_appliance_inter_cb')->where($condition)->select();
		
		if($list){
			$count = 0;
			foreach($list as $val )
			{
				if( $count>0 && $count<count($list) )
					$response .= ",";
				$response .= $val["brand_name"];
				$count++;
			}
		}
		else{
			$response = "";
		}
		
		echo $response;
	}
	
	public function delete(){
		$gid = $_REQUEST['gid'];
		if(!isset($gid)){
			$this->error("gid required");
			die();
		}
		$condition = array(
			'id' 		=> $gid,
			'schedule'	=> 0,
		);
		$profile = M('manager_ircoder_gather')->where($condition)->delete();
		if($profile){
			//不配置jumpUrl,默认返回前一页$_SERVER['HTTP_REFERER']
			//$this->assign("jumpUrl","__APP__/Member/index/");
			$this->success("Delete Succeed");
		}
		else{
			$this->error("Edit Failed");
		}
	}
}
?>
