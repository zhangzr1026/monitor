<?php
/**
 * 
 * 会员查询：
 * @author zhangzr1026
 *
 */
class UserAction extends CommonAction
{
	public function index(){
		
		$list         = D('User')->getAllUserList();
		$this->assign ( "userlist", $list );
		$this->display();
	}

	public function getuserinfo(){
		$p = isset($_GET['p'])?intval($_GET['p']):1;
		$r = isset($_GET['r'])?intval($_GET['r']):10;
		$data = D('User')->getUserList($p,$r);
		echo json_encode($data);
	}

	public function info(){
	
		$uid	= $_REQUEST['uid'];
		$info	= D('User')->getUserInfoById($uid);
		$groupid= $info['group_id'];
		$this->assign ( "uInfo", $info );
		if($groupid == 1){
			$this->personal($uid);
		}
		if($groupid == 2){			
			$province = D('user')->getAreaName($info['address_province']); 
			$city	  = D('user')->getAreaName($info['address_city']);
			$appkeyinfo = 	D('user')->getAppKeyInfo($info['user_name']);
			$this->assign ( "appkeyInfo", $appkeyinfo );
			$this->assign ( "province", $province );
			$this->assign ( "city", $city );
			$this->developer($uid);
		}
		if($groupid == 3){
			$this->enterprise($uid);
		}
		
	}

	public function auditUser(){
		$uid				=	$_REQUEST['uid'];
		$type				=	$_REQUEST['type'];

		if(!$uid || !$type){
			$this->ajaxReturn(0,'审核操作失败',0);
			return;
		}

		$info	= D('User')->getUserInfoById($uid);
		if($info['verification']==0){
			$this->ajaxReturn(0,'该用户未提交审核申请！',0);
			return;
		}

		if($type==1){
			$app_key		= strtoupper(str_replace('-','',$this->uuid()));
			$app_secret		= strtoupper(str_replace('-','',$this->uuid()));
			$data['account']	= $email;
			$data['app_key']	= $app_key;
			$data['app_secret'] = $app_secret;
			$data['apply_time'] = date('Y-m-d H:i:s',$result[0]['apply_time']);
			$data['pass_time']  = date('Y-m-d H:i:s',time());
			$message = $this -> getContent($info['real_name'],$data);
			$this->sendCheckMail($info['email'],'风向标开放平台审核结果',$message);
			$d['app_key']		= $app_key;
			$d['app_secret']		= $app_secret;
			$d['user_name']		= $info['user_name'];
			$d['enable']			= 'Y';
			$result = M('info_app_key')->add($d);
			D('User')->updateVerific($uid,1);
			$this->ajaxReturn(1,'审核操作成功',1);
			return;
		}
		if($type==2){
			$message = $this -> getContent($info['email'],null);
			if($this->sendCheckMail($info['email'],'风向标开放平台审核结果',$message)){
				D('User')->updateVerific($uid,2);
				$this->ajaxReturn(1,'审核操作成功',1);
				return;
			}
			$this->ajaxReturn(0,'审核操作失败',0);
			return;
		}
		$this->ajaxReturn(0,'审核操作失败',0);
		return;

	}

	private function personal($uid){
		$model  = D('User');
		$conf	= $model->getUserConfFileById($uid);
		$token	= $model->getUserTokenById($uid);
		$dev    = $model->getUserDevById($uid);

		$line   = $model->getLineUser($uid);
		$mode   = $model->getModeUser($uid);
	
		$this->assign ( "uConf", $conf );
		$this->assign ( "uToken", $token );
		$this->assign ( "numToken", count($token));
		$this->assign ( "uDev", $dev );
		$this->assign ( "numDev", count($dev));
		$this->assign ( "uLine", $line );
		$this->assign ( "numLine", count($line));
		$this->assign ( "uMode", $mode );
		$this->assign ( "numMode", count($mode));
		
		$this->display('info');
	} 

	private function developer($uid){
		$this->display('developer');
	}

	private function enterprise($uid){
		$this->display('enterprise');
	}

	public function download(){
		$uid   = $_REQUEST['uid'];
		$conf  = D('User')->getFileContentById($uid);
        $this->force_download($conf['file_name'], $conf['file_content']);
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

		if ($filename == '' OR $data == '')
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

	private function getContent($nuserame,$data=array()){
		
		$content = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta charset="utf-8">
		<style>
		#v_mail{ display:inline-block;position:relative; box-shadow:0 0 3px rgba(0, 0, 0, 0.2); -moz-border-radius:4px; border-radius:4px; color:rgba(0,0,0, 0.8); text-shadow:0 1px 0 #fff;}
		#v_mail::before, #v_mail::after{ position:absolute; content:""; top:10px; bottom:15px; left:10px; width:50%; box-shadow:0 15px 10px rgba(0, 0, 0, 0.5); -webkit-transform: rotate(-3deg); -moz-transform:rotate(-3deg); -o-transform:rotate(-3deg); -ms-transform:rotate(-3deg); transform:rotate(-3deg); z-index:-1;}
		#v_mail::after{ right:10px; left:auto; -webkit-transform:rotate(3deg); -moz-transform:rotate(3deg);-o-transform:rotate(3deg); -ms-transform:rotate(3deg); transform: rotate(3deg);}
		</style></head><body style="background-color:#f5f5f5;">
	<div id="v_mail" style="margin:50px; padding:20px; width:700px;border: 1px solid #cccccc;font-family:Microsoft Yahei;font-size:15px;background-color:#fff;">
		<div style="margin:0 auto;color:#555; font:16px/26px;border-bottom: 4px solid #00aae7;width:680px;">
			<a href="http://test.vanelife.com" style="display:block;width:210px;height:77px;position:relative;left:20px;top:14px;background:url(http://test.vanelife.com/assets/v2/css/images/vanelogo.png) no-repeat;"></a>
		</div>
		<div style="padding-left:15px;padding-right:15px;">		
			<p>亲爱的&nbsp;<span style="color:#00aae7;">'.$nuserame.'</span></p>';
			if(count($data)>0){
				$content .= '<p>恭喜你开通风向标开放平台。以下是你的开发者的信息，请妥善保管，请勿向第三方泄漏个人信息，如有疑问，请联系风向标公司。</p>
			<p>您的开发者账号：<span style="color:#00aae7;">'.$data['account'].'</span></p><p><span style="color:#00aae7;">app_key：</span>'.$data['app_key'].'</p>
			<p><span style="color:#00aae7;">app_secret：</span>'.$data['app_secret'].'</p>
			<p><span style="font-size:14px;color:#898a8a;">申请时间：'.$data['apply_time'].'</span></p>
			<p><span style="font-size:14px;color:#898a8a;">审批通过时间：'.$data['pass_time'].'</span></p>';			
			}else{
				$content .= '<p>恭喜你开通风向标开放平台。由于信息不实等原因系统无法审批通过你的申请，请把用户姓名、邮箱、手机号、所在地区几个信息核实后再次提交申请.</p>';
			
			}
			$content .= '<br><p>祝愉快<br>您在风向标的朋友.</p></div><div style="border-top:1px solid #cccccc;font-family:arial;font-size:13px;color:#acaaaa;text-align:right;padding-right:15px;">
			<p>Copyright&copy;2013 VANE Inc. 保留所有权利</p></div></div></body></html>';
			
		return $content;
	
	}

	private function uuid($prefix  =  '')  
	{  
		$chars  = md5(uniqid(mt_rand(), true));  
		$uuid   =  substr ( $chars ,0,8) .  '-' ;  
		$uuid  .=  substr ( $chars ,8,4) .  '-' ;  
		$uuid  .=  substr ( $chars ,12,4) .  '-' ;  
		$uuid  .=  substr ( $chars ,16,4) .  '-' ;  
		$uuid  .=  substr ( $chars ,20,12);  
		return   $prefix  .  $uuid ;  
	} 

	private function sendCheckMail($to,$subject,$message){
		vendor('Smtp.email');
	
		$smtpserver 	= "smtp.vanelife.com";//SMTP服务器
		$smtpserverport = 25;//SMTP服务器端口
		$smtpusermail 	= "open_api@vanelife.com";//SMTP服务器的用户邮箱
		$smtpemailto 	= $to;//发送给谁
		$smtpemail	= explode("@",$smtpemailto);
		//$bcc 	= "yangqike@vanelife.com";
		$bcc = "";

		$mailsubject = $subject;
		$mailbody =  $message;
		//邮件内容
		
		$smtpuser = "open_api@vanelife.com";//SMTP服务器的用户帐号
		$smtppass = "vane.open";//SMTP服务器的用户密码
		$mailtype = "HTML";//邮件格式（HTML/TXT）,TXT为文本邮件
		$smtp = new smtp($smtpserver,$smtpserverport,true,$smtpuser,$smtppass);//这里面的一个true是表示使用身份验证,否则不使用身份验证.
		$smtp->debug = FALSE;//是否显示发送的调试信息
		$mailmsg=$smtp->sendmail($smtpemailto, $smtpusermail, $mailsubject, $mailbody, $mailtype,'',$bcc);
		if($mailmsg[$smtpemailto]){
			return true;
		}
		return false;
	}

}

?>