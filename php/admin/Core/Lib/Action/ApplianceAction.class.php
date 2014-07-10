<?php
/**
 * 
 * Appliance
 * @author zhangzr1026
 *
 */
class ApplianceAction extends CommonAction
{
	public function categoryindex()
	{
		$list = M('manager_appliance_category')->select();
		$this->assign('list',$list);
		$this->assign('nav', 'ircode');
		$this->assign('sub', 'appliance');
		$this->display();
	}

	public function categoryadd()
	{
		$this->assign('nav', 'ircode');
		$this->assign('sub', 'appliance');
		$this->display();
	}
	
	public function categoryadding()
	{
		$cate_name = $_REQUEST['cate_name'];
		$data = array(
			'cate_name'=>$cate_name,
		);
		$profile = M('manager_appliance_category')->data($data)->add();
		if($profile>0){
			$this->assign("jumpUrl","__APP__/Appliance/categoryindex");
			$this->success("Add Succeed");
		}
		else{
			$this->error("Add Failed");
		}
	}
	
	public function categorydelete(){
		$cate_name = $_REQUEST['cate_name'];
		if(!isset($cate_name)){
			$this->error("Cate_name required");
			die();
		}
		$condition = array(
			'cate_name' => $cate_name,
		);
		$profile = M('manager_appliance_category')->where($condition)->delete();
		if($profile){
			$this->assign("jumpUrl","__APP__/Appliance/categoryindex/");
			$this->success("Delete Succeed");
		}
		else{
			$this->error("Edit Failed");
		}
	}
	
	public function brandindex()
	{
		$list = M('manager_appliance_brand')->select();
		$this->brandadditionalField($list);
		$this->assign('list',$list);
		$this->assign('nav', 'ircode');
		$this->assign('sub', 'brand');
		$this->display();
	}
	
	//每行添加一个对象
	private function brandadditionalField(&$list){
		$m = new Model();
		foreach ($list as &$val){
			$sql = "SELECT cb.cate_name
FROM manager_appliance_inter_cb AS cb
WHERE cb.brand_name ='".$val['brand_name']."'";
			$mlist = $m->query($sql);
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
	
	public function brandadd()
	{
		$this->assign('nav', 'ircode');
		$this->assign('sub', 'brand');
		$this->display();
	}
	
	public function brandadding()
	{
		$brand_name = $_REQUEST['brand_name'];
		$data = array(
			'brand_name'=>$brand_name,
		);
		$profile = M('manager_appliance_brand')->data($data)->add();
		if($profile>0){
			$this->assign("jumpUrl","__APP__/Appliance/brandindex");
			$this->success("Add Succeed");
		}
		else{
			$this->error("Add Failed");
		}
	}
	
	public function branddelete(){
		$brand_name = $_REQUEST['brand_name'];
		if(!isset($brand_name)){
			$this->error("Brand name required");
			die();
		}
		$condition = array(
			'brand_name' => $brand_name,
		);
		$profile_b = M('manager_appliance_brand')->where($condition)->delete();
		$profile_cb = M('manager_appliance_inter_cb')->where($condition)->delete(); //Delete Relationship
		if($profile_b){
			$this->assign("jumpUrl","__APP__/Appliance/brandindex/");
			$this->success("Delete Succeed");
		}
		else{
			$this->error("Edit Failed");
		}
	}
	
	//For binding appliance category 
	public function brandbindingindex()
	{
		$brand_name = $_REQUEST['brand_name'];
		$this->assign("brand_name",$brand_name);
		
		$list = M('manager_appliance_category')->select();
		$this->assign('cate_name_list',$list);
		
		$this->display();
	}
	
	public function brandbindingaction()
	{
		$cate_name = $_REQUEST['cate_name'];
		$brand_name = $_REQUEST['brand_name'];
		
		if(! $this->checkExists("manager_appliance_brand", "brand_name", $brand_name) )
		{
			$this->error("数据库中不存在此电器品牌,请先添加品牌名称,再进行绑定操作");
		}
		if(! $this->checkExists("manager_appliance_category", "cate_name", $cate_name) )
		{
			$this->error("数据库中不存在此电器类型,请先添加电器类型,再进行绑定操作");
		}
			
		
		$data = array(
			'cate_name'		=>$cate_name,
			'brand_name'	=>$brand_name,
		);
		
		$profile = M('manager_appliance_inter_cb')->data($data)->add();
		if($profile>0){
			$this->assign("jumpUrl","__APP__/Appliance/brandindex/searchtype/brand_name/searchValue/$brand_name");
		$this->success("Binding Succeed");
		}
		else{
			$this->error("Add Relationship between hac and user Failed");
		}
	}
	
	public function brandbindingdelete()
	{
		$cate_name = $_REQUEST['cate_name'];
		$brand_name = $_REQUEST['brand_name'];
		
		$condition = array(
			'cate_name' => $cate_name,
			'brand_name' => $brand_name,
		);
		
		//Delete Relationship
		$profile = M('manager_appliance_inter_cb')->where($condition)->delete();
		if($profile>0){
			$this->assign("jumpUrl","__APP__/Appliance/brandindex/searchtype/brand_name/searchValue/$brand_name");
			$this->success("Delete Succeed");
		}
		else{
			$this->error("Delete Failed");
		}
	}
	
	private function checkExists($table, $colname, $colvalue)
	{
		$condition = array(
			$colname => $colvalue,
		);
		$row = M($table)->where($condition)->find();
		if($row){
			return TRUE;	//Exists
		}
		else{
			return FALSE;	//NonExists
		}
	}
}
?>
