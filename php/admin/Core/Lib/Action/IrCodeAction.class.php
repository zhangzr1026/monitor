<?php

class IrCodeAction extends CommonAction
{
	public function index(){
		
		$model = D('IrCode');
		//统计信息
		$ircodeid = $model->getCurVerIrCodeId();
		//获取数据
		$list	= $model->getAllIrCodeListInfo();
		$this->additionalField($list);

		$condition = array('schedule'	=> 0);
		$ir = $model->getIrGather($condition);
		
		$this->assign("gather_list", $ir);
		$this->assign( "curVerInSer", $ircodeid );	
		$this->assign ( "ircodelist", $list );
		$this->display('irCode');
	}
	
	private function additionalField(&$list){
		$m = new Model();
		foreach ($list as &$val){
			$mlist = D('IrCode')->getIrCodeInfoById($val['ircode_id']);
			$tmpgather=array();
			if(!empty($mlist)){
				foreach($mlist as $mval){
					$tmp=array();
					$tmp['gid']=$mval["gid"];
					$tmp['cate_name']=$mval["cate_name"];
					$tmp['brand_name']=$mval["brand_name"];
					$tmp['model_name'] =$mval["model_name"]; 
					array_push($tmpgather, $tmp);
				}
			}
			$val['gather']		= $tmpgather;
			$val['gather_num']	= count($mlist)-1; 
		}
		return true;
	}

	public function irgather(){
	
		$model= D('IrCode');
		$condtion =array();
		if(isset($_REQUEST['id'])&&$_REQUEST['id']){
			$condtion['id'] = $_REQUEST['id'];
		}
		if(isset($_REQUEST['cate_name'])&&$_REQUEST['cate_name']){
			$condtion['cate_name'] = $_REQUEST['cate_name'];
		}
		if(isset($_REQUEST['brand_name'])&&$_REQUEST['brand_name']){
			$condtion['brand_name'] = $_REQUEST['brand_name'];
		}
		if(isset($_REQUEST['model_name'])&&$_REQUEST['model_name']){
			$condtion['model_name'] = $_REQUEST['model_name'];
		}
		$list = $model->getAllIrGatherListInfo($condtion);
		$this->additionalIrGatherField($list);
		$this->assign ( "haclist", $list );

		$cate_name_list = $model->getAppliance();
		$this->assign('cate_name_list',$cate_name_list);

		$brand_name_list = array();
		if($cate_name_list)
		{
			$brand_name_list = $model->getBrandInAppliance($cate_name_list[0]['cate_name']);
		}
		$this->assign('brand_name_list',$brand_name_list);

		$this->display('irGather');

	}

	public function getbrand()
	{
		$cate_name = $_REQUEST['argc'];
		$model= D('IrCode');
		$response = "";
		$list = $model->getBrandInAppliance($cate_name);
		
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

	//每行添加一个对象
	private function additionalIrGatherField(&$list){

		foreach ($list as &$val){
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
					array_push($tmpflow, $tmp);
				}				
			$val['schedule_flow']=$tmpflow;
			$val['schedule_num'] = count(C('IRCODE_GATHER_FLOW')) - 1; //总的流程数
		}
		return true;

	}

	public function setschedule(){
		$gid		= $_REQUEST['gid'];
		$status		= $_REQUEST['status'];
		if(!isset($gid) || !isset($status)){
			$this->ajaxReturn(0,'参数错误!',0);
			exit();
		}
		$condition = array(
			'id' => $gid,
		);
		$data = array(
			'schedule' => $status,
		);

		$result = D('IrCode')->editIrGatherInfo($data,$condition);

		if($result){
			$this->ajaxReturn(1,'操作成功!',1);
			exit();
		}
		$this->ajaxReturn(0,'操作失败!',0);
	
	}


	public function setstate(){
		$state		= intval( $_REQUEST['state'] );
		$gid		= $_REQUEST['gid'];
		if($state == 1 || $state ==0){
			$condition = array(
				'id' => $gid,
			);
			$data = array(
				'state' => $state,
			);
			$result = D('IrCode')->editIrGatherInfo($data,$condition);
			if($result){
				$this->ajaxReturn(1,'操作成功!',1);
				exit();
			}
			$this->ajaxReturn(0,'操作失败!',0);
			exit();
		}
		$this->ajaxReturn(0,'参数错误!',0);

	}
	
	public function delIrGather(){
		$gid		= $_REQUEST['gid'];
		$result = D('IrCode')->delIrGatherInfo($gid);
		if($result){
			$this->ajaxReturn(1,'操作成功!',1);
			exit();
		}
		$this->ajaxReturn(0,'操作失败!',0);
	}

	function delCategory(){
		$cate_name = $_REQUEST['cate_name'];
		if(!$cate_name){
			$this->ajaxReturn(0,'删除失败',0);
		}
		$result = D('IrCode')->delCategory($cate_name);
		if($result){
			$this->ajaxReturn(1,'删除成功',1);
		}
		$this->ajaxReturn(0,'删除失败',0);
	}
	
	public function category(){
	
		$list = D('IrCode')->getAppliance();
		$this->assign('list',$list);
		$this->display('category');
	
	}

	public function brand(){
		$model = D('IrCode');
		$list = $model->getBrand();
		$this->brandadditionalField($list);
		$this->assign('list',$list);
		$cate_name_list = $model->getAppliance();
		$this->assign('cate_name_list',$cate_name_list);
		$this->display('brand');
	}

	public function addbrand(){
		$brand_name = $_REQUEST['new_brand_name'];
		$is = D('IrCode')->isExistBrand($brand_name);
		if($is){
			$this->ajaxReturn(0,'品牌已存在',0);
		}
		$result = D('IrCode')->addBrand($brand_name);
		if($result){
			$this->ajaxReturn(1,'品牌添加成功',1);
		}
		else{
			$this->ajaxReturn(0,'品牌添加失败',0);
		}
	}

	public function branddelete(){
		$brand_name = $_REQUEST['brand_name'];
		$model = D('IrCode');
		$profile_b = $model->delBrand($brand_name);
		$profile_cb = $model->delBrandBind($brand_name); //Delete Relationship
		if($profile_b){
			$this->ajaxReturn(1,'品牌删除成功',1);
		}
		else{
			$this->ajaxReturn(0,'品牌删除失败',0);
		}
	}

		//每行添加一个对象
	private function brandadditionalField(&$list){
		$m = new Model();
		foreach ($list as &$val){
			$mlist = D('IrCode')->getApplianceInBrand($val['brand_name']);
			$tmpcate=array();
			if(!empty($mlist)){
				$i=1;
				foreach($mlist as $mval){
					$tmp=array();
					$tmp['cate_name']=$mval["cate_name"];
					array_push($tmpcate, $tmp);
				}
			}
			$val['cate_name_list']=$tmpcate;
			$val['cate_name_num'] = count($mlist) - 1; //总的流程数
		}
		return true;
	}

	public function brandbindcate(){
		$cate_name = $_REQUEST['cate_name'];
		$brand_name = $_REQUEST['brand_name'];

		$result = D('IrCode')->addBrandBindCate($cate_name,$brand_name);
		if($result){
			$this->ajaxReturn(1,'关联成功',1);
		}
		$this->ajaxReturn(0,'关联失败',0);
	}

	public function delbrandbindcate()
	{
		$cate_name = $_REQUEST['cate_name'];
		$brand_name = $_REQUEST['brand_name'];
		
		//Delete Relationship
		$profile = D('IrCode')->delBrandBindCate($cate_name,$brand_name);
		if($profile>0){
			$this->ajaxReturn(1,'关联删除成功',1);
		}
		else{
			$this->ajaxReturn(0,'关联删除失败',0);
		}
	}

	public function addcatgory(){
		$cate_name = $_REQUEST['cate_name'];
		if(!$cate_name){
			$this->ajaxReturn(0,'添加失败',0);
		}
		$result = D('IrCode')->addCategory($cate_name);
		if($result){
			$this->ajaxReturn(1,'添加成功',1);
		}
		$this->ajaxReturn(0,'添加失败',0);

	}
	
	public function uploadirversion(){		
		//Initial
		$filesInfo = array();
		$comment = $_REQUEST['comment'];
		$g=$_REQUEST['gid'];
		if($g){
			$gatherIds = explode(',',$g);
		}else{
			$gatherIds = array();
		}
		import("ORG.Net.UploadFile");
		$upload = new UploadFile(); // 实例化上传类
		$upload->maxSize  =  16777216; // 设置附件上传大小,Bytes
		$upload->allowExts  = array(); // 设置附件上传类型
		$upload->savePath =  IRCODE_UPLOAD_DIR; // 设置附件上传目录
		
		$upload->autoSub = TRUE;
		$upload->hashLevel = 2;
		$upload->saveRule = "time";
		
		//Upload
		if(!$upload->upload()) { // 上传错误提示错误信息

			$this->ajaxReturn(0,$upload->getErrorMsg(),0);
		
		}else{ // 上传成功 获取上传文件信息
			$filesInfo =  $upload->getUploadFileInfo();
			
			$profile = D('IrCode')->addIrCodeInfo($filesInfo[0]['savename'],$comment,$this->UserName);
			if($profile>0){
				foreach($gatherIds AS $key => $val)
				{
					$this->updateRelateGather($val, $profile);						//Update manager_ircoder_gather 
				}
				$this->ajaxReturn(1,'上传成功',1);
			}
			else{
				$this->ajaxReturn(0,'上传失败',0);
			}
		}
	}
	
	private function updateRelateGather($gid,$ircode_id)
	{
		$condition = array(
			'id' => $gid
		);
		$data = array(
			'ircode_id' => $ircode_id,
			'schedule'	=> 1
		);
		#$profile = M('manager_ircoder_gather')->data($data)->where($condition)->save();
		$profile =D('IrCode')->editIrGatherInfo($data,$condition,'manager_ircoder_gather');
		return $profile;
	}
	
	public function download()
	{
		$ircode_id = $_REQUEST['ircode_id'];
		
		$row =D('IrCode')->getIrCodeInfo($ircode_id);
		
		if($row){
			$file_name		= $row["download_url"];
			$publish_date	= substr($row["publish_date"], 0, 10);
			
			$path = "./UploadFile/ircode/".$row["download_url"];
			force_download("irCode_Ver".$ircode_id."_".$publish_date.".zip", file_get_contents($path));
		}else{
			header ('location:'.$_SERVER["HTTP_REFERER"] );
		}
	} 
	
	public function updateServerIrCode()
	{
		/*
		 * Get infomation
		 */
		$newVer = $_REQUEST["ircode_id"];
		$model =  D('IrCode');
		$oldVer = $model->getCurVerIrCodeId();
		$filepath = "";
		$tempDir = "./Temp/ircode/";
		$tempFile = $tempDir."ircode_full.zip";
		$command = ""; //Shell Command
		
		$row = $model->getIrCodeInfo($newVer);
		if($row){
			$filepath = IRCODE_UPLOAD_DIR.$row["download_url"];
		}
		else{
			$this->ajaxReturn(0,'数据不存在',0);
		}		
		
		/*
		 * To do update script.This step is very slow.please wait patiently.
		 */
		//unzip 
		exec("mkdir $tempDir -p");
	    exec("cp $filepath $tempFile -f");
	    exec("unzip -o $tempFile -d $tempDir");
	    exec("unzip -o ".$tempDir.IRCODE_PROTOCOL." -d ".$tempDir);
	    
	    //copy files to vapi	
		if(defined("AUTO_DEPLOY_TO_VAPI") && AUTO_DEPLOY_TO_VAPI)
		{
			$command = "cp $tempDir"."protocol/"." ".IRCODE_VAPI_PATH_PROTOCOL." -R";
	    		exec($command);
		  	$command = "cp $tempDir".IRCODE_SCAN." ".			IRCODE_VAPI_PATH_SCAN." -R";
		    	exec($command);
		}
		
	    //copy files to Forwarding Server
	    //This is done by shell script with crontab On 
	    if(defined("AUTO_DEPLOY_TO_IS") && AUTO_DEPLOY_TO_IS)
	    {
	    	$command = "cp $tempDir"."protocol/"." ".IRCODE_IS_PATH_PROTOCOL." -R";
	    		exec($command);
	    }
			
	    	
		/*
		 * Update Database
		 */
		$condition = array('ircode_id' => $oldVer,);
		$data = array(
			'in_service' => 0,//去掉老版本标记
		);
		#$result4old = M('manager_ircoder')->data($data)->where($condition)->save();

		$old = $model->editIrGatherInfo($data,$condition,'manager_ircoder');
		
		$condition = array('ircode_id' => $newVer,);
		$data = array(
			'in_service' => 1,//给新版本添加标记
		);
		#$result4new = M('manager_ircoder')->data($data)->where($condition)->save();
		$new =  $model->editIrGatherInfo($data,$condition,'manager_ircoder');
		
		if($old && $new){
			$this->ajaxReturn(1,'更新操作成功',1);
		}
		else {
			$this->ajaxReturn(0,'更新操作失败',0);
		}
		
	}

	public function addirgather(){
		$cate_name		= $_REQUEST['cate_name'];
		$brand_name		= $_REQUEST['brand_name'];
		$model_name		= strtolower($_REQUEST['model_name']);
		$publish_date 	= date("Y-m-d H:i:s");
		$user			= $this->UserName;

		if(!$cate_name){
			$this->ajaxReturn(0,'电器类型为空',0);
		}
		if(!$brand_name){
			$this->ajaxReturn(0,'电器品牌为空',0);
		}
		if(!$model_name){
			$this->ajaxReturn(0,'电器型号为空',0);
		}

		$result = D('IrCode')->addIrGather($cate_name,$brand_name,$model_name,$user,$date);
		if($result){
			$this->ajaxReturn(1,'新增需求添加成功',1);
		}
		$this->ajaxReturn(0,'新增需求添加失败',0);
	}
}
?>
