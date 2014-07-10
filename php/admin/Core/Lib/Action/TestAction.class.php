<?php
/**
 * 
 * 会员查询：
 * @author zhangzr1026
 *
 */
class TestAction extends CommonAction
{
	public function index(){
		$xmlrules = "<?xml?>";
		echo convert_xml_to_json($xmlrules);
	}
	
	public function convert_xml_to_json($xmlrules){
		try{
			$xmlrules = str_replace('"', '', $xmlrules);
			$xmlrules = (array) simplexml_load_string($xmlrules, 'SimpleXMLElement', LIBXML_COMPACT);
			//print_r($xmlrules);
			$jsonrules = json_encode($xmlrules);
			//$jsonrules = preg_replace("/\"(\d{1,2})\"/i", "\${1}", $jsonrules);
			return $jsonrules;
		}
		catch(Exception $e){
			log_message('error', 'invalid xml format: '.$e->getMessage());
			return '{}';
		}
	}
}

?>