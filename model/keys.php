<?php

require_once("base.php");

class Keys
{
	public $table;
	public function __construct(){
		$this->table 		= "keys";
	}
}

$keys = new Keys();
$base = new Base($keys->table);
$content = $base->getContent();
echo json_encode($content);
?>