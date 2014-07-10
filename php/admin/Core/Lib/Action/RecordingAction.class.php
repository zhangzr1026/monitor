<?php
/**
 * 
 * Info_Hac
 * @author zhangzr1026
 *
 */
class RecordingAction extends CommonAction
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
		$dmHAC       = D('info_hac');
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
	
	public function activecode(){
		$activeCode = "111";
		$this->activecodeGenerater("BC6A299C4BDC",$activeCode);
		echo $activeCode;
	}
	
	private function activecodeGenerater($serialNumber,&$activeCode){
		$code = base64_encode(  hash('md5', strtoupper($serialNumber), true));
        $find = array('=','/','\\','*','&',':','\'','+','-','\0');
        $code = str_replace($find, '', $code);
	    $charArray = str_split($code);
	    $activeCode = $charArray[1].$charArray[4].$charArray[13].$charArray[16].$charArray[20].$charArray[23];
		return true;
	}
}

?>
