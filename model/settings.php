<?php

require_once("base.php");


class Settings
{
	public $table;
	public function __construct(){
		$this->table 		= "match";
	}
}

	/* Getting the get vars */
	$action 	= $_GET["action"];
	$id 		= $_GET["id"];
	$configs 	= $_GET["settings"];

	if($action == "query") {
		$settings = new Settings();
		$base = new Base($settings->table);
		$content = $base->getContent();
		echo json_encode($content);
	} else if ($action == "save") {
		$settings = new Settings();
		$base = new Base($settings->table);
		$content = $base->update($id, $configs);
		echo json_encode($content);
	}

?>