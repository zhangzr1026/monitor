<?php
/**
 * 
 * Info_Rserver
 * @author zhangzr1026
 *
 */
class RserverAction extends CommonAction
{
	public function index(){
		import("ORG.Util.Page"); // 导入分页类
		$pageUrl = ''; //用于搜索分页传递参数，保持条件进行分页
		$formAction = ''; //用于搜索,比$pageUrl少一个searchValue参数
		$searchValue = ''; //搜索的标题
		$cases = array();
		$p = isset($_GET['p'])?intval($_GET['p']):1;   //初始化分页
		
		//搜索在线状态
		if( isset($_REQUEST['state']) && $_REQUEST['state']!='' )
		{
			$state  = intval($_REQUEST['state']);
		    $cases['state']  = array('eq',"{$state}");
		    $pageUrl .= '/state/'.$state;
		}
		//搜索激活状态,按照是否有激活码来确定激活状态
		if( isset($_REQUEST['activation_code']) && $_REQUEST['activation_code']!='' )
		{
			$activation_code  = intval($_REQUEST['activation_code']);
			if($activation_code==1){
		    	$cases['activation_code']  = array('neq',"0");
			}
			else{
				$cases['activation_code']  = array('eq',"0");
			}
		    $pageUrl .= '/activation_code/'.$activation_code;
		}
		
		//搜索标题
		$formAction = $pageUrl; //form搜索不需要包括搜索结果
		if( isset($_REQUEST['searchValue']) && $_REQUEST['searchValue']!='' )
		{
			$searchValue  = $_REQUEST['searchValue'];
		    $cases['mac_address']  = array('eq',"{$searchValue}");
		    $pageUrl .= '/searchValue/'.$searchValue;
		}
		
		//获取数据
		$dmHAC       = D('info_rserver');
		$count         = $dmHAC->where($cases)->count();
		
		$Page         = new Page($count,ROWSPERPAGE);
		$show         = $Page->showPage($pageUrl);
		$list         = $dmHAC->where($cases)->order($order)->page($p.','.ROWSPERPAGE)->select();
		$this->additionalField($list);
		$this->assign( "formaction", $formAction );
		$this->assign( "page", $show );
		$this->assign ( "haclist", $list );
		$this->display();
	}
	
	private function additionalField(&$list){
		$m = new Model();	
		foreach ($list as &$val){
			$sql = "SELECT u.user_id, u.user_name, uh.* 
FROM inter_user_hac AS uh 
LEFT JOIN info_user AS u ON uh.info_user_user_id=u.user_id 
WHERE uh.info_hac_hac_id =".$val['hac_id'];
			$mlist = $m->query($sql);
			$tmpuser=array();
			if(!empty($mlist)){
				$i=1;
				foreach($mlist as $mval){
					$tmp=array();
					$tmp['user_name']=$mval["user_name"];
					$tmp['user_id']=$mval["user_id"];
					$tmp['info_user_user_id']=$mval["info_user_user_id"];
					array_push($tmpuser, $tmp);
				}
			}
			$val['info_user']=$tmpuser;
		}
		return true;
	}
}

?>
