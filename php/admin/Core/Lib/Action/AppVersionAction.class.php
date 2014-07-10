<?php
class AppVersionAction extends CommonAction
{
	public function index(){
		$appTag = D('Version')->getAppChannelTag();
		$list = D('Version')->getAllAppVerList();
		
		$this->assign ( "apptaglist", $appTag );
		$this->assign ( "appverlist", $list );
		$this->display();
	}

	public function savefile(){
		$filesInfo = array();
		$explain = $_REQUEST['explain'];
		$vernum = $_REQUEST['vernum'];
		$curver = $_REQUEST['curver'];
		$channel_tag = $_REQUEST['channel_tag'];

		import("ORG.Net.UploadFile");
		$upload = new UploadFile(); // 实例化上传类
		$upload->maxSize  = 16777216; // 设置附件上传大小,Bytes
		$upload->allowExts  = array(); // 设置附件上传类型
		$upload->savePath =  APPVER_UPLOAD_DIR; // 设置附件上传目录
		
		$upload->autoSub = TRUE;
		$upload->hashLevel = 2;
		$upload->saveRule = "time";

		if(!$upload->upload()) { // 上传错误提示错误信息
			$this->ajaxReturn(0,$upload->getErrorMsg(),0); 
		}else{ // 上传成功 获取上传文件信息
			$filesInfo =  $upload->getUploadFileInfo();
			if(!$channel_tag){
				$this->ajaxReturn(0,'渠道标签为空!',0); 
			}
			if(!$vernum){
				$this->ajaxReturn(0,'版本号为空!',0); 
			}
			$data['version_type']   = 0;
			$data['channel_tag']	= $channel_tag;
			$data['version_code']	= $vernum;
			$data['version_url']	=  str_replace("./","",dirname(APPVER_UPLOAD_DIR.$filesInfo[0]['savename']).'/'.$filesInfo[0]['name']);
			$data['version_desc']	= $explain;
			$data['update_type']	= '0';
			$data['upload_user']	= $this->UserName;

			mkdir(APPVER_UPLOAD_DIR);
			copy(APPVER_UPLOAD_DIR.$filesInfo[0]['savename'],dirname(APPVER_UPLOAD_DIR.$filesInfo[0]['savename']).'/'.$filesInfo[0]['name']);
			$id = D('Version')->addAppVerInfo($data);
			if($curver){
				$this->updateAppVersionById($id);
			}		
			if($id){
				$this->ajaxReturn(1,'版本上传成功',1);
			}
			$this->ajaxReturn(0,'版本上传失败',0);
		}
	}

	private function updateAppVersionById($id){
		#$curid = D('Version')->getAppCurVerId();
		#$old = D('Version')->updateAppVer($curid,'0');
		$new = D('Version')->updateAppVer($id,'1');
		if($new){
			return true;
		}
		return false;
	}

	public function updateAppVersion(){
		$id = $_REQUEST["appverid"];
		$result = $this->updateAppVersionById($id);
		if($result){
			$this->ajaxReturn(1,'发布成功!',1);
		}
		$this->ajaxReturn(1,'发布失败!',1);	
	}

}
?>