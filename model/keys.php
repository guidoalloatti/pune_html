<?php

require_once("base.php");
class Keys
{
	public $table;
	public function __construct(){
		$this->table 		= "keys";
	}
}
function save($action, $id, $configs) {
	$keys = new Keys();
	$base = new Base($keys->table);
	$key_exists = false;
	if($id != null && $id != '') 
		$key_exists = $base->get_by_id($id);
	if($key_exists)
		$content = $base->update($id, $configs);
	else
		$content = $base->insert($configs);
	$result = array("result" => $content);
	echo json_encode($content);
}
function query($action, $id, $configs) {
	$keys = new Keys();
	$base = new Base($keys->table);
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