function getDbKeys(source, id) {
	$.ajax({ 
		data: { id : "id", action : "query"},
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
		data: { id : id, action : "query" },
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

function saveSettings(id, settings) {
	$.ajax({
		data: { id : id, settings : settings, action : "save" },
		type: "GET",
		dataType: "json",
		url: "/model/settings.php",
		async: true,
		success: function(data){
			//console.log("Ajax Success: saveSettings!");
			console.log("============= saveSettings: AJAX SUCCESS ==========");
			console.log(data);
		},
		error: function(data){
			//console.log("The Ajax Call was has a error, the error text is: ");
			console.log("============= saveSettings: AJAX ERROR ==========");
			console.log(data);
		}
	})
}

function saveKeys(id, keys) {
	$.ajax({
		data: { id : id, settings : keys, action : "save" },
		type: "GET",
		dataType: "json",
		url: "/model/keys.php",
		async: true,
		success: function(data){
			//console.log("Ajax Success: saveSettings!");
			console.log("============= saveKeys: AJAX SUCCESS ==========");
			console.log(data);
		},
		error: function(data){
			//console.log("The Ajax Call was has a error, the error text is: ");
			console.log("============= saveKeys: AJAX ERROR ==========");
			console.log(data);
		}
	})
}

