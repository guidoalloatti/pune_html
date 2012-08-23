<?php

class Base
{
	public $host; 		//		= "localhost";
	public $user; 		//		= "root";
	public $pass; 		//		= "root";
	public $db;			//		= "pune";
	public $link;
	public $results;
	public $table;
	public $fields;
	public $sqlQuery; 	//		= "SELECT * FROM `$table`;";
	public $sqlResult;
	public $descQuery;	//		= "DESC `$table`;";
	public $descResult;
	public $content;

	public function __construct($table){
		$this->content 		= array();
		$this->fields 		= array();
		$this->host 		= "localhost";
		$this->user 		= "root";
		//$this->pass 		= "";
		$this->pass 		= "root";
		$this->db 			= "pune";
		$this->table 		= $table;
		$this->descQuery 	= "DESC `$this->table`;";
		$this->sqlQuery		= "SELECT * FROM `$this->table` WHERE id = 1;";
	}

	public function mySqlConnect() {
		$this->link = mysql_connect($this->host, $this->user, $this->pass);
		if (!$this->link) {
			die('Could not connect: ' . mysql_error());
		}
	}

	public function mySqlDBSelect(){
		if (!mysql_select_db($this->db)) {
			die('Could not select database: ' . mysql_error());
		}
	}

	public function getResults($query) {
		$result = mysql_query($query);
		if (!$result) {
			die('Could not query:' . mysql_error());
		}
		return $result;
	}

	public function getContent() {
		/* DB Connect and Schema Selected */
		$this->mySqlConnect();
		$this->mySqlDBSelect();
		$this->getTableFields();


		$this->sqlResult = $this->getResults($this->sqlQuery);
		while($row = mysql_fetch_array($this->sqlResult)) {
			foreach($this->fields as $field) {
				array_push($this->content, array($field => $row[$field]));
			}
		}
		/* DB Connection Close */
		$this->mySqlClose();
		return $this->content;
	}

	public function mySqlClose() {
		mysql_close($this->link);
	}

	public function getTableFields() {
		$this->descResult = $this->getResults($this->descQuery);
		while($row = mysql_fetch_array($this->descResult)) {
			array_push($this->fields, $row["Field"]);
		}
	}

	function mySqlUpdate($sql) {
		$this->mySqlConnect();
		$this->mySqlDBSelect();
		if (!mysql_query($sql, $this->link)) {
			$message = "Error trying to execute: " . $sql . " Mysql Error is: " . mysql_error();
			return $message;
		}
		$this->mySqlClose();
		return "Success: 1 row updated. Executed query: '".$sql."'";
	}

	public function insert($values) {

	}

	public function update($id, $settings) {
		$values = "";
		$i = 0;
		foreach($settings as $key=>$value) {
			if($value == "true") 		$value = 1;
			else if ($value == "false")	$value = 0;
			$values .= $key." = '".$value."'";
			$i++;
			if($i < count($settings))
				$values .= ", ";
		}
		$sql = "UPDATE `$this->table` SET $values WHERE id = $id;";
		$message = $this->mySqlUpdate($sql);
		return $message;
	}

}

?>