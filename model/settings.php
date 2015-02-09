<?php

require_once("base.php");
class Settings 
{
	public $table;
	public function __construct() {
		$this->table = "match";
	}
}
function save($action, $id, $configs) {
	$settings = new Settings();
	$base = new Base($settings->table);
	$setting_exists = false;
	if($id != null && $id != '') 
		$setting_exists = $base->get_by_id($id);
	if($setting_exists)
		$content = $base->update($id, $configs);
	else
		$content = $base->insert($configs);
	$result = array("result" => $content); //, "gameId" => $setting_exists);
	echo json_encode($content);
}
function query($action, $id, $configs) {
	$settings = new Settings();
	$base = new Base($settings->table);
	$content = $base->getContent();
	echo json_encode($content);
}
/* Getting the get vars */
$action 	= $_GET["action"];
$id 		  = $_GET["id"];
$configs 	= $_GET["settings"];
if($action == "query") 			query($action, $id, $configs);
else if ($action == "save") save($action, $id, $configs);

?>