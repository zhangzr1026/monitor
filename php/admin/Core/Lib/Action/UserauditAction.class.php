<?php
/**
 * 
 * 会员查询：
 * @author zhangzr1026
 *
 */
class UserauditAction extends Action
{

	public function auditUser(){
		$email				=	$_REQUEST['email'];
		$type				=	1;

		if(!$email || !$type){
			#$this->ajaxReturn(1,'审核操作失败',1);
			echo json_encode(array('status' => 1, 'text' => '审核失败'));
			return;
		}

		#$info	= D('User')->getUserInfoById($uid);
		$info   = D('User')->getUserInfoByEmail($email);
		$uid    = $info['user_id'];
		if($info['verification']==0){
			#$this->ajaxReturn(0,'该用户未提交审核申请！',0);
			echo json_encode(array('status' => 0, 'text' => '该用户未提交审核申请！'));
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
			$d['user_id']		= $uid;
			$d['enable']			= 'Y';
			$result = M('info_app_key')->add($d);
			D('User')->updateVerific($uid,1);
			#$this->ajaxReturn(1,'审核操作成功',1);
			echo json_encode(array('status' => 0, 'text' => '审核成功'));
			return;
		}
		if($type==2){
			$message = $this -> getContent($info['email'],null);
			if($this->sendCheckMail($info['email'],'风向标开放平台审核结果',$message)){
				D('User')->updateVerific($uid,2);
				$this->ajaxReturn(1,'审核成功',1);
				return;
			}
			$this->ajaxReturn(0,'审核失败',0);
			return;
		}
		#$this->ajaxReturn(0,'审核操作失败',0);
		echo json_encode(array('status' => 1, 'text' => '审核失败'));
		return;

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