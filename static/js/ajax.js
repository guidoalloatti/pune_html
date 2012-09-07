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


			$.each(data, function() {
				$.each(this, function(key, val) {
					if(		key == "player_1" && val == 1) { players[0] = true; worms[0].playing = true; }
					else if(key == "player_2" && val == 1) { players[1] = true; worms[1].playing = true; }
					else if(key == "player_3" && val == 1) { players[2] = true; worms[2].playing = true; }
					else if(key == "player_4" && val == 1) { players[3] = true; worms[3].playing = true; }
					else if(key == "player_5" && val == 1) { players[4] = true; worms[4].playing = true; }
					else if(key == "player_6" && val == 1) { players[5] = true; worms[5].playing = true; }
				});
			});

			settings['id'] = data['id'];

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

