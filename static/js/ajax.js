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
					for( var i = 0; i < 6; i++ ) {
						if(key == "player_"+(i+1)) {
							if( typeof(worms[i]) == undefined ) { //|| typeof(worms[i] == "undefined") ) {
								startWorm(getWormColorByIndex(i));
							}
							if(val == 1) {
								players[i] = true;
								worms[i].playing = true;
								// worms[i].alive = true;
								// $("#"+worms[i].color+"Controls").show();
							}
						}
					}
				});
			});

			startWorms();
			startRound();

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
			console.log("Id: " + data.id);
			console.log("Sql: " + data.sqlResult);
			gameId = data.id;
		},
		error: function(data){
			//console.log("The Ajax Call was has a error, the error text is: ");
			console.log("============= saveSettings: AJAX ERROR ==========");
			console.log(data.responseText);
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
			console.log("Id: " + data.id);
			console.log("Sql: " + data.sqlResult);
			keyId = data.id;
		},
		error: function(data){
			//console.log("The Ajax Call was has a error, the error text is: ");
			console.log("============= saveKeys: AJAX ERROR ==========");
			console.log(data.responseText);
		}
	})
}

