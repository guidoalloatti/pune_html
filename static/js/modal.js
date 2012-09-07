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

			function newGame() {
				$(".demo").hide();
				$("#canvas_div").show();
				startGame();
			}

			$( "#dialog-form" ).dialog({
				autoOpen: false,
				height: 520,
				width: 420,
				modal: true,
				buttons: {
					"Create a game": function() {
						$(this).dialog( "close" );
						newGame();
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

		});