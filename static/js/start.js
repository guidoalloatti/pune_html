// Starting New Game 
startNewGame = function () {
  //if(doValidate) {
    if(validateNewGame()) {
      // Hide Stuff
      $("#start-body").hide()
      $(".demo").hide()

      // Start game no te yet and close dialog
      gameHasStarted = false
      $("#dialog-form").dialog("close")
      
      // Show Stuff
      $("#canvas_div").show()
      $("#background").show()
      $("#show-options").show()
      $("#sounds-nav-bar").show()
      $("#toggle-log").show()

      // Do the countdown trick
      $("#count_3").show()
      setTimeout(function(){ $("#count_3").hide(); $("#count_2").show() }, 1000)
      setTimeout(function(){ $("#count_2").hide(); $("#count_1").show() }, 2000)
      setTimeout(function(){ $("#count_1").hide() }, 3000)
      setTimeout(function(){ startGame(playingColors); gameHasStarted = true }, 3000)
    }
  //}
}