$(function() {
			// a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
			$("#dialog:ui-dialog").dialog( "destroy" );

			function updateTips( t ) {
				tips
					.text( t )
					.addClass( "ui-state-highlight" );
				setTimeout(function() {
					tips.removeClass( "ui-state-highlight", 1500 );
				}, 500 );
			}

			function checkLength( o, n, min, max ) {
				if ( o.val().length > max || o.val().length < min ) {
					o.addClass( "ui-state-error" );
					updateTips( "Length of " + n + " must be between " +
						min + " and " + max + "." );
					return false;
				} else {
					return true;
				}
			}

			function checkRegexp( o, regexp, n ) {
				if ( !( regexp.test( o.val() ) ) ) {
					o.addClass( "ui-state-error" );
					updateTips( n );
					return false;
				} else {
					return true;
				}
			}

			$("#dialog-form").dialog({
				autoOpen: false,
				height: 530,
				width: 420,
				modal: true,
				buttons: {
					"Create a game": function() {
						if(validateNewGame()) {
							$(this).dialog( "close" );
							$(".demo").hide();
							$("#canvas_div").show();
							gameHasStarted = true;
							startGame();
						}
					},
					"Save Settings": function() {
						save();
						alert("Settings saved!");
						$(this).dialog( "save" );
					},
					"Cancel": function() {
						$(this).dialog( "close" );
					}
				},
				close: function() {

				}
			});

			$( "#create-game" ).click(function() { $( "#dialog-form" ).dialog( "open" ); });
			$( "#set-game" ).click(function() { $( "#dialog-form" ).dialog( "open" ); });

		function validateNewGame() {
			/*
			 * TODO: Validations
			 *       Validate 2 worms minimun
			 *       Validate worms have both keys
			 *       Validate worms don't repeat keys
			 */

			var checked = 0;
			var isValid = true;
			var playing = new Array();
			var message = "The game cannot be started! Why?";
			var keys = new Array();

			$('input[type=checkbox]').each(function(){
				if(this.checked) {
					//console.log($(this))
					playing.push(this);
					checked++;
				}
			});

			if(checked < 2) {
				message += "\n * You need at least 2 worms to play!";
				isValid = false;
			}

			if(isValid) {
				var playingColors = new Array();
				$.each(playing, function(){
					
					var color = $(this).attr("name");
					playingColors.push(color);
										
					if($("#"+color+"LeftInput").val() == "") {
						message += "\n * The left key for the "+color+" worm is not defined!";
						isValid = false;
					} else {
						keys.push($("#"+color+"LeftInput").val());
						$.each(currentKeys, function(index, object) {	
							if(object.color == color) object.left = $("#"+color+"LeftInput").attr("name")
						});
					}

					if($("#"+color+"RightInput").val() == "") {
						message += "\n * The right key for the "+color+" worm is not defined!";
						isValid = false;
					} else {
						keys.push($("#"+color+"RightInput").val());
						$.each(currentKeys, function(index, object) {	
							if(object.color == color) object.right = $("#"+color+"RightInput").attr("name")						
						});
					}
				});
			}
			
			startGame(playingColors);

			if(isValid) {
				var duplicates = find_duplicates(keys);
				$.each(duplicates, function(){
					message += "\n * The key "+ this + " is duplicated!";
					isValid = false;
				});
			}

			if(!isValid) alert(message);
			return isValid;
		}

		function find_duplicates(arr) {
			var len = arr.length, out=[], counts={};
			for (var i=0;i<len;i++) {
				var item = arr[i];
				var count = counts[item];
				counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
			}
			for (var item in counts) {
			if(counts[item] > 1)
				out.push(item);
			}
			return out;
		}
		
		function setPlayingWorms(){
		
			console.log("Play");
		}
});