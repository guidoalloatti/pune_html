<?php

require_once("base.php");

class Settings
{
	public $table;
	public function __construct(){
		$this->table 		= "match";
	}
}

$settings = new Settings();
$base = new Base($settings->table);
$content = $base->getContent();
echo json_encode($content);

?>