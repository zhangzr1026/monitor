<?php

class DeviceAction extends CommonAction
{
	public function index(){

		$deviceid = $_REQUEST['deviceid'];
		if(intval($deviceid)){
			$list		=	D('Device')->getDeviceById($deviceid);
		}else{
			$list		=	D('Device')->getAllDevListInfo();
		}
		
		$this->additionalField($list);
		
		$this->assign ( "devlist", $list );
		$this->display();

	}

	public function upgrade(){

		$result=D('Device')->getAllDevVerList();
		$devTag = D('Device')->getDevChannelTag();

		$this->assign ( "tagNum", count($devTag)+1);
		$this->assign ( "devtaglist", $devTag );
		$this->assign ( "devupgradelist", $result );
		$this->display('upgrade');

	}

	public function endpoint(){
		$deviceid = $_REQUEST['deviceid'];
		$epid	  = $_REQUEST['epid'];
		if($epid){
			$eplist   = D('Device')->getEpListByEpId($epid);
		}else{
			$eplist   = D('Device')->getEpListByDeviceId($deviceid);
		}				

		$this->assign ("eplist", $eplist);
		$this->display('endpoint');
	}

	public function datapoint(){
		$deviceid = $_REQUEST['deviceid'];
		$epid	  = $_REQUEST['epid'];
		
		$dplist   = D('Device')->getDpListByDeviceAndEpId($deviceid,$epid);

		$this->assign ("deviceid", $deviceid);
		$this->assign ("dplist", $dplist);
		$this->display('datapoint');

	}

	public function dpinfo(){
		$dpid	= $_REQUEST['dpid'];
		
		$dpinfo = D('Device')->getDpInfoByDpId($dpid);
		
		$this->assign ("dpinfo", $dpinfo);
		$this->display('dpinfo');

	}

	//每行添加一个对象
	private function additionalField(&$list){

		foreach ($list as &$val){
			$mlist = D('Device')->getUserByDeviceId($val['device_id']);
			$tmpuser=array();
			if(!empty($mlist)){
				foreach($mlist as $mval){
					$tmp=array();
					$tmp['user_id']				= $mval["user_id"];
					$tmp['device_id']			= $mval["device_id"];
					array_push($tmpuser, $tmp);
				}
			}
			$val['info_user']=$tmpuser;
		}
		return true;

	}
	
	public function savefile(){
		$filesInfo = array();
		$explain = $_REQUEST['explain'];
		$vernum = $_REQUEST['vernum'];
		$curver = $_REQUEST['curver'];
		$channel_tag = $_REQUEST['channel_tag'];

		import("ORG.Net.UploadFile");
		$upload = new UploadFile(); // 实例化上传类
		$upload->maxSize  = 16777216 ; // 设置附件上传大小,Bytes
		$upload->allowExts  = array(); // 设置附件上传类型
		$upload->savePath = DEVVER_UPLOAD_DIR; // 设置附件上传目录
		
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
			$data['version_type']   = 1;
			$data['channel_tag']	= $channel_tag;
			$data['version_code']	= $vernum;
			$data['version_url']	= str_replace("./","",dirname(DEVVER_UPLOAD_DIR.$filesInfo[0]['savename']).'/'.$filesInfo[0]['name']);
			$data['version_desc']	= $explain;
			$data['update_type']	= '0';
			$data['upload_user']	= $this->UserName;

			mkdir(DEVVER_UPLOAD_DIR);
			copy(DEVVER_UPLOAD_DIR.$filesInfo[0]['savename'],dirname(DEVVER_UPLOAD_DIR.$filesInfo[0]['savename']).'/'.$filesInfo[0]['name']);
			$id = D('Device')->addDevVerInfo($data);
			if($curver){
				$this->updateDevVersionById($id);
			}		
			if($id){
				$this->ajaxReturn(1,'版本上传成功',1);
			}
			$this->ajaxReturn(0,'版本上传失败',0);
		}
	}

	private function updateDevVersionById($id){
		#$curid = D('Device')->getDevCurVerId();
		#$old = D('Device')->updateDevVer($curid,'0');
		$new = D('Device')->updateDevVer($id,'1');
		if($new){
			return true;
		}
		return false;
	}

	public function updateDevVersion(){
		$id = $_REQUEST["devverid"];
		$result = $this->updateDevVersionById($id);
		if($result){
			$this->ajaxReturn(1,'发布成功!',1);
		}
		$this->ajaxReturn(1,'发布失败!',1);	
	}

	public function delDevVersion(){
		$id = $_REQUEST["devverid"];
		$result = D('Device')->delDevVer($id);
		if($result){
			$this->ajaxReturn(1,'版本删除成功!',1);
		}
		$this->ajaxReturn(1,'版本删除失败!',1);	
	}

	public function opDevTag(){
		$type = $_REQUEST["type"];
		$tag  = $_REQUEST["tag"];
		if($type=='add'){
		   $isTag = D('Device')->isExistTag($tag);
		   if($isTag){
				$this->ajaxReturn(0,'该标签已存在!',0);
		   }
		   $id = D('Device')->addDevChannelTag($tag);
		   if($id){
				$this->ajaxReturn(1,'渠道添加成功!',1);
		   }else{
				$this->ajaxReturn(0,'渠道添加失败!',0);
		   }
		}
		if($type == 'del'){
			$result = D('Device')->delDevChannelTag($tag);
			if($result){
				$this->ajaxReturn(1,'渠道删除成功!',1);
			}else{
				$this->ajaxReturn(0,'渠道删除失败!',0);
			}
		}
	}

	public function download(){
		$dpid	= $_REQUEST['dpid'];		
		$dpinfo = D('Device')->getDpInfoByDpId($dpid);
        $this->force_download('dp_data.txt', $dpinfo['data_value']);
	}

	private function force_download($filename = '', $data = '')
	{
		$mimes = array(	'hqx'	=>	'application/mac-binhex40',
				'cpt'	=>	'application/mac-compactpro',
				'csv'	=>	array('text/x-comma-separated-values', 'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel', 'application/x-csv', 'text/x-csv', 'text/csv', 'application/csv', 'application/excel', 'application/vnd.msexcel'),
				'bin'	=>	'application/macbinary',
				'dms'	=>	'application/octet-stream',
				'lha'	=>	'application/octet-stream',
				'lzh'	=>	'application/octet-stream',
				'exe'	=>	array('application/octet-stream', 'application/x-msdownload'),
				'class'	=>	'application/octet-stream',
				'psd'	=>	'application/x-photoshop',
				'so'	=>	'application/octet-stream',
				'sea'	=>	'application/octet-stream',
				'dll'	=>	'application/octet-stream',
				'oda'	=>	'application/oda',
				'pdf'	=>	array('application/pdf', 'application/x-download'),
				'ai'	=>	'application/postscript',
				'eps'	=>	'application/postscript',
				'ps'	=>	'application/postscript',
				'smi'	=>	'application/smil',
				'smil'	=>	'application/smil',
				'mif'	=>	'application/vnd.mif',
				'xls'	=>	array('application/excel', 'application/vnd.ms-excel', 'application/msexcel'),
				'ppt'	=>	array('application/powerpoint', 'application/vnd.ms-powerpoint'),
				'wbxml'	=>	'application/wbxml',
				'wmlc'	=>	'application/wmlc',
				'dcr'	=>	'application/x-director',
				'dir'	=>	'application/x-director',
				'dxr'	=>	'application/x-director',
				'dvi'	=>	'application/x-dvi',
				'gtar'	=>	'application/x-gtar',
				'gz'	=>	'application/x-gzip',
				'php'	=>	'application/x-httpd-php',
				'php4'	=>	'application/x-httpd-php',
				'php3'	=>	'application/x-httpd-php',
				'phtml'	=>	'application/x-httpd-php',
				'phps'	=>	'application/x-httpd-php-source',
				'js'	=>	'application/x-javascript',
				'swf'	=>	'application/x-shockwave-flash',
				'sit'	=>	'application/x-stuffit',
				'tar'	=>	'application/x-tar',
				'tgz'	=>	array('application/x-tar', 'application/x-gzip-compressed'),
				'xhtml'	=>	'application/xhtml+xml',
				'xht'	=>	'application/xhtml+xml',
				'zip'	=>  array('application/x-zip', 'application/zip', 'application/x-zip-compressed'),
				'mid'	=>	'audio/midi',
				'midi'	=>	'audio/midi',
				'mpga'	=>	'audio/mpeg',
				'mp2'	=>	'audio/mpeg',
				'mp3'	=>	array('audio/mpeg', 'audio/mpg', 'audio/mpeg3', 'audio/mp3'),
				'aif'	=>	'audio/x-aiff',
				'aiff'	=>	'audio/x-aiff',
				'aifc'	=>	'audio/x-aiff',
				'ram'	=>	'audio/x-pn-realaudio',
				'rm'	=>	'audio/x-pn-realaudio',
				'rpm'	=>	'audio/x-pn-realaudio-plugin',
				'ra'	=>	'audio/x-realaudio',
				'rv'	=>	'video/vnd.rn-realvideo',
				'wav'	=>	array('audio/x-wav', 'audio/wave', 'audio/wav'),
				'bmp'	=>	array('image/bmp', 'image/x-windows-bmp'),
				'gif'	=>	'image/gif',
				'jpeg'	=>	array('image/jpeg', 'image/pjpeg'),
				'jpg'	=>	array('image/jpeg', 'image/pjpeg'),
				'jpe'	=>	array('image/jpeg', 'image/pjpeg'),
				'png'	=>	array('image/png',  'image/x-png'),
				'tiff'	=>	'image/tiff',
				'tif'	=>	'image/tiff',
				'css'	=>	'text/css',
				'html'	=>	'text/html',
				'htm'	=>	'text/html',
				'shtml'	=>	'text/html',
				'txt'	=>	'text/plain',
				'text'	=>	'text/plain',
				'log'	=>	array('text/plain', 'text/x-log'),
				'rtx'	=>	'text/richtext',
				'rtf'	=>	'text/rtf',
				'xml'	=>	'text/xml',
				'xsl'	=>	'text/xml',
				'mpeg'	=>	'video/mpeg',
				'mpg'	=>	'video/mpeg',
				'mpe'	=>	'video/mpeg',
				'qt'	=>	'video/quicktime',
				'mov'	=>	'video/quicktime',
				'avi'	=>	'video/x-msvideo',
				'movie'	=>	'video/x-sgi-movie',
				'doc'	=>	'application/msword',
				'docx'	=>	array('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'),
				'xlsx'	=>	array('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'),
				'word'	=>	array('application/msword', 'application/octet-stream'),
				'xl'	=>	'application/excel',
				'eml'	=>	'message/rfc822',
				'json' => array('application/json', 'text/json')
		);

		if ($filename == '')
		{
			return FALSE;
		}

		// Try to determine if the filename includes a file extension.
		// We need it in order to set the MIME type
		if (FALSE === strpos($filename, '.'))
		{
			return FALSE;
		}

		// Grab the file extension
		$x = explode('.', $filename);
		$extension = end($x);

		// Load the mime types

		// Set a default mime if we can't find it
		if ( ! isset($mimes[$extension]))
		{
			$mime = 'application/octet-stream';
		}
		else
		{
			$mime = (is_array($mimes[$extension])) ? $mimes[$extension][0] : $mimes[$extension];
		}

		// Generate the server headers
		if (strpos($_SERVER['HTTP_USER_AGENT'], "MSIE") !== FALSE)
		{
			header('Content-Type: "'.$mime.'"');
			header('Content-Disposition: attachment; filename="'.$filename.'"');
			header('Expires: 0');
			header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
			header("Content-Transfer-Encoding: binary");
			header('Pragma: public');
			header("Content-Length: ".strlen($data));
		}
		else
		{
			header('Content-Type: "'.$mime.'"');
			header('Content-Disposition: attachment; filename="'.$filename.'"');
			header("Content-Transfer-Encoding: binary");
			header('Expires: 0');
			header('Pragma: no-cache');
			header("Content-Length: ".strlen($data));
		}

		exit($data);
	}
}
?>
