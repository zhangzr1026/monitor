<?php
class TestModel extends Model {
	protected $tableName = 'info_hac_upgrade';
	
	protected $_map= array(
		'compatibility_version_name' => 'version_name',
	);
	
	protected $fields = array(
		'version_id:id', 'url_path', 'email', '_pk'=>'version_id'
	);
	
}
?>