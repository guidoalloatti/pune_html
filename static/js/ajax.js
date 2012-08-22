function getDbKeys(source) {
	$.ajax({ 
		data: "", 
		type: "GET", 
		dataType: "json", 
		url: rootDir+"/model/keys.php",
		async: true,
		success: function(data){
			showAjaxData(data, source);
		},
		error: function(data){
			console.log("The Ajax Call was has a error, the error text is: ");
			console.log(data.responseText);
		}
	});
}

function getDbSettings(id) {
	$.ajax({
		data: "",
		type: "GET",
		dataType: "json",
		url: "/model/settings.php",
		async: true,
		success: function(data){
			console.log("Ajax Success!");
			showSettingsData(data);
		},
		error: function(data){
			console.log("The Ajax Call was has a error, the error text is: ");
			console.log(data.responseText);
		}
	});
}
