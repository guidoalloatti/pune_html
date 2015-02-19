$(function() {
	// a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
	$("#dialog:ui-dialog").dialog( "destroy" );

	$("#dialog-form").dialog({
		autoOpen: false,
		height: 480,
		width: 380,
		modal: true,
		buttons: {
			"Create a game": function() { startNewGame() },
			// "Save Settings": function() { save(); },
			"Close": function() { $(this).dialog("close") }
		},
		close: function(){}
	});

	validateNewGame = function() {
		var checked = 0
		var isValid = true
		var playing = new Array()
		var message = "The game cannot be started! Why?"
		var keys = new Array()

		$('input[type=checkbox]').each(function(){
			if(this.checked) {
				playing.push(this)
				checked++
			}
		});

		holePoints = $("#hole_points").val()
		modalSpeed = $("#modal_speed").val()
		gapSpacing = $("#gap_spacing").val()
		gapSizing  = $("#gap_sizing").val()

		if(checked < 2) {
			message += "\n * You need at least 2 worms to play!"
			isValid = false
		}

		if(isValid) {
			playingColors = new Array()
			$.each(playing, function(){
				
				var color = $(this).attr("name")
				playingColors.push(color)
									
				if($("#"+color+"LeftInput").val() == "") {
					message += "\n * The left key for the "+color+" worm is not defined!"
					isValid = false
				} else {
					keys.push($("#"+color+"LeftInput").val())
					$.each(currentKeys, function(index, object) {	
						if(object.color == color) object.left = $("#"+color+"LeftInput").attr("name")
					})
				}

				if($("#"+color+"RightInput").val() == "") {
					message += "\n * The right key for the "+color+" worm is not defined!"
					isValid = false
				} else {
					keys.push($("#"+color+"RightInput").val())
					$.each(currentKeys, function(index, object) {	
						if(object.color == color) object.right = $("#"+color+"RightInput").attr("name")						
					})
				}
			})
		}

		if(isValid) {
			var duplicates = find_duplicates(keys)
			$.each(duplicates, function(){
				message += "\n * The key "+ this + " is duplicated!"
				isValid = false
			})
		}

		if(!isValid) alert(message)
		return isValid
	}

	find_duplicates = function (arr) {
		var len = arr.length, out=[], counts={}
		for (var i=0;i<len;i++) {
			var item = arr[i]
			var count = counts[item]
			counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1
		}
		for (var item in counts) {
		if(counts[item] > 1)
			out.push(item)
		}
		return out
	}
})