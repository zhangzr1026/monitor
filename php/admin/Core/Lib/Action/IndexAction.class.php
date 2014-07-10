<?php
// 本文档自动生成，仅供测试运行
class IndexAction extends CommonAction
{
    /**
    +----------------------------------------------------------
    * 默认操作
    +----------------------------------------------------------
    */
	public function index()
    {
	$authority=0;
	if(0==$authority)
    	//$this->redirect('Member/index');
    	//$this->assign('member',M('member')->order('lastname DESC')->select());
		$this->assign( "nav", 'index' );
		$this->assign ( "sub", 'index' );
        $this->display();
    }
    
	public function checkin()
    {
//    	$this->assign('member',M('member')->select());
//        $this->display();
    }
    
    public function env()
    {
        $this->display(THINK_PATH.'/Tpl/Autoindex/hello.html');
    }

    /**
    +----------------------------------------------------------
    * 探针模式
    +----------------------------------------------------------
    */
    public function checkEnv()
    {
        load('pointer',THINK_PATH.'/Tpl/Autoindex');//载入探针函数
        $env_table = check_env();//根据当前函数获取当前环境
        echo $env_table;
    }

    public function test()
    {
    	$hacid = "000C29D137C1";
    	$algorithm = "sha1";
    	echo $this->generate_hac_activation_code($hacid,$algorithm);
    }

	function generate_hac_activation_code($hacid, $algorithm='sha1'){
		$code = base64_encode(hash($algorithm, strtoupper($hacid), true));
		$find = array('=','/','\\','*','&',':','\'','+','-','\0');
		$code = str_replace($find, '', $code);
	    $charArray = str_split($code);
	    $code = $charArray[1].$charArray[4].$charArray[13].$charArray[16].$charArray[20].$charArray[23];
	    return $code;
	}

}
?>
