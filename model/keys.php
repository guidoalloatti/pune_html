<?php

class Keys
{
	public $host; 		//		= "localhost";
	public $user; 		//		= "root";
	public $pass; 		//		= "root";
	public $db;			//		= "pune";
	public $table;		//		= "keys";
	public $sqlQuery; 	//		= "SELECT * FROM `$table`;";
	public $descQuery;	//		= "DESC `$table`;";
	public $link;

	public function __construct(){
		$this->host 		= "localhost";
		$this->user 		= "root";
		$this->pass 		= "";  //root
		$this->db 			= "pune";
		$this->table 		= "keys";
		$this->descQuery 	= "DESC `$this->table`;";
		$this->sqlQuery		= "SELECT * FROM `$this->table`;";
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
		$fields = $this->getTableFields();
		$content = array();
		$result = $this->getResults($this->sqlQuery);
		while($row = mysql_fetch_array($result)) {
			foreach($fields as $field) {
				array_push($content, array($field => $row[$field]));
			}
		}
		/* DB Connection Close */
		$this->mySqlClose();

		return $content;
	}

	public function mySqlClose() {
		mysql_close($this->link);
	}

	public function getTableFields() {
		$descResult = $this->getResults($this->descQuery);
		$fields = array();
		while($row = mysql_fetch_array($descResult)) {
			array_push($fields, $row["Field"]);
		}
		return $fields;
	}
}

$keys = new Keys();
$content = $keys->getContent();
echo json_encode($content);

//echo "<pre>";
//var_dump($content);
//echo "</pre>";




?>