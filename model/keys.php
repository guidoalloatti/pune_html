<?php

require_once("base.php");

class Keys
{
	public $table;
	public function __construct(){
		$this->table 		= "keys";
	}
}

		/* Getting the get vars */
	$action 	= $_GET["action"];
	$id 		= $_GET["id"];
	$configs 	= $_GET["settings"];

	if($action == "query") {
		$keys = new Keys();
		$base = new Base($keys->table);
		$content = $base->getContent();
		echo json_encode($content);
	} else if ($action == "save") {
		$keys = new Keys();
		$base = new Base($keys->table);
		$content = $base->update($id, $configs);
		echo json_encode($content);
	}


?>