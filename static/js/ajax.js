function getDbKeys() {
	$.ajax({ 
		data: "", 
		type: "GET", 
		dataType: "json", 
		url: rootDir+"/model/keys.php",
		async: true,
		success: function(data){
			console.log("Ajax Success");
			showAjaxData(data);
		},
		error: function(data){
			console.log("Ajax Error");
			console.log(data);
		}
	});
}
