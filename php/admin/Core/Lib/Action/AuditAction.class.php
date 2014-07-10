<?php
class AuditAction extends CommonAction
{
	protected function dbinit(){
		$myConnect1 = 'mysql://root:root@localhost:3306/beta';
 		$objdb = M('','AdvModel');
 		$objdb->addConnect($myConnect1,1);
 		$objdb->switchConnect(1);
		return $objdb;	
	}

	public function index(){
		import("ORG.Util.Page");//导入分页类
		$p = isset($_GET['p'])?intval($_GET['p']):1;   //初始化分页
		$size = 10;
		$key				=	isset($_REQUEST['key'])?$_REQUEST['key']:'';
		$status				=	isset($_REQUEST['status'])?$_REQUEST['status']:'';
		$type				=	isset($_REQUEST['type'])?$_REQUEST['type']:'';
		$starttime			=	isset($_REQUEST['starttime'])?$_REQUEST['starttime']:'';
		$endtime			=	isset($_REQUEST['endtime'])?$_REQUEST['endtime']:'';
		$extparm			=	'';
		$wheretext			=	'1';
		if($type=='1'||$type=='2'){
			$extparm		.=	'&type='.$type;
			$wheretext		.=	' and group_id='.$type;
		}

		if($status=='0'||$status=='1'){
			$extparm		.=	'&status='.$status;
			$wheretext		.=	' and status='.$status;
		}
		
		if($starttime && $endtime){
			$stime=strtotime($starttime);
			$etime=strtotime($endtime);
			if($etime-$stime>=0){
				$extparm		.=	'&starttime='.$starttime.'&endtime='.$endtime;
				$wheretext		.=	' and apply_time>'.$stime.' and apply_time<'.$etime;
			}
		}
		if($key){
			$extparm		.=	'&key='.urlencode($key);
			$wheretext		.=	' and real_name=\''.$key.'\'';
		}
		ltrim($extparm ,'&');
		//$M		= M('beta.info_user');
		//$m = new Model();
		$m = $this ->dbinit();
		$ps = ($p-1)*$size;
		$sql = 'select a.*,b.name as province,c.name as city from beta.info_user a left join beta.info_area b on a.address_province=b.id left join beta.info_area c on a.address_city=c.id where '.$wheretext;
		$count = count($m->query($sql));
		$sql=$sql.' limit '.$ps.','.$size;
		$result=$m->query($sql);
		$Page = new Page($count,$size,$extparm);//实例化分页类传入总记录数和每页显示的记录数
	    $show = $Page->show();//分页显示输出
		$this->assign('r',$ps+1);
		$this->assign('p',$p);
		$this->assign("page",$show);
		$this->assign("openulist",$result);
		$this->assign("nav","Audit");
		$this->assign("sub","index");
		$this->display('openUser');	
	}

	public function doUserLock(){
		$email				=	$_REQUEST['um'];
		$do					=	$_REQUEST['md'];
		$p					=	$_REQUEST['p'];
		if(!$email){
			$this->redirect("Audit/index",array('p' => $p));
		}
		if($do=='unlock'){
			$status = 0;
		}
		elseif($do=='lock'){
			$status = 1;
		}else{
			$this->redirect("Audit/index",array('p' => $p));
		}

		$condition = array(
			'email' => 	$email
		);
		$data = array(
			'status'=> $status
		);
		//$m = new Model();
		$m = $this ->dbinit();
		$sql = 'update beta.info_user set status='.$status.' where email=\''.$email.'\'';
		$result=$m->query($sql);
		$this->redirect("Audit/index",array('p' => $p));
	}
	
	public function checkUser(){
		import("ORG.Util.Page");//导入分页类
		$p = isset($_GET['p'])?intval($_GET['p']):1;   //初始化分页
		$size = 10;
		$ps = ($p-1)*$size;
		//$m = new Model();
		$m = $this ->dbinit();
		$sql = 'select * from beta.info_user where verification=3';
		$count = count($m->query($sql));
		$sql = $sql.' limit '.$ps.','.$size;
		$result=$m->query($sql);
		$Page = new Page($count,$size);//实例化分页类传入总记录数和每页显示的记录数
	    $show = $Page->show();//分页显示输出
		
		$this->assign('r',$ps+1);
		$this->assign('checknum',$count);
		$this->assign("checklist",$result);
		$this->assign("page",$show);
		$this->assign("nav","Audit");
		$this->assign("sub","checkUser");
		$this->display('checkUser');	
	
	}

	public function checkUserDetail(){
		$email				=	$_REQUEST['um'];
		if(!$email){
			$this->redirect("Audit/checkUser");
		}
		//$m = new Model();
		$m = $this ->dbinit();
		$sql = 'select * from beta.info_user where email=\''.$email.'\' and verification=3';
		$result=$m->query($sql);
		if(!$result){
			$this->redirect("Audit/checkUser");
		}
		$sql = 'select name from beta.info_area where id='.$result['address_province'];
		$pro=$m->query($sql);
		if($pro) $result['address_province']=$pro['name'];
		$sql = 'select name from beta.info_area where id='.$result['address_city'];
		$ct=$m->query($sql);
		if($ct) $result['address_city']=$ct['name'];
		$this->assign("userDetail",$result[0]);
		$this->display('userDetail');	
	}

	public function doCheckUser(){
		$email				=	$_REQUEST['um'];
		$do					=	$_REQUEST['md'];

		if(!$email || !$do){
			$this->ajaxReturn('','审核失败',1);
			return;
		}
		//$m = new Model();
		$m = $this ->dbinit();
		if($do == 'pass' && $this->send_opener_email($email)){
			$sql = "update beta.info_user set verification=1 where email='".$email."'";
			$m->query($sql);
			$this->ajaxReturn('','审核成功',0);
			return;
		}
		if($do == 'fail' && $this->send_opener_email($email,false)){
			$sql = "update beta.info_user set verification=2 where email='".$email."'";
			$m->query($sql);
			$this->ajaxReturn('','审核成功',0);
			return;
		}
		$this->ajaxReturn('','审核失败',1);
		return;
	
	}

	private function send_opener_email($email,$key=true){
		if(!$email){
			return false;
		}
		//$m = new Model();
		$m = $this ->dbinit();
		$sql = 'select * from beta.info_user where email=\''.$email.'\'';
		$result = $m->query($sql);
		if(!$result){
			return true;
		}

		if($key){
			$app_key		= strtoupper(str_replace('-','',$this->uuid()));
			$app_secret		= strtoupper(str_replace('-','',$this->uuid()));
			$data['account']	= $email;
			$data['app_key']	= $app_key;
			$data['app_secret'] = $app_secret;
			$data['apply_time'] = date('Y-m-d H:i:s',$result[0]['apply_time']);
			$data['pass_time']  = date('Y-m-d H:i:s',time());
			$message = $this -> getContent($result[0]['real_name'],$data);
			if($this->sendCheckMail($email,'风向标开放平台审核结果',$message)){
				$sql = "insert into beta.info_app_key values('".$app_key."','".$app_secret."','".$email."','Y');";
				$m->query($sql);
				return true;
			}
		}
		
		if(!$key){
			$message = $this -> getContent($result[0]['real_name'],null);
			if($this->sendCheckMail($email,'风向标开放平台审核结果',$message)){
				return true;
			}		
		}
		return false;
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