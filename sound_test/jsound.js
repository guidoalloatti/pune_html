$(document).ready(function() {
  
  alert("entro");
  
  $("#jpId").jPlayer( {
    ready: function () {
      // Directly access this instance's jPlayer methods. (Does not support chaining.)
      this.setFile("../sounds/die.mp3", "..sounds/die.ogg"); // Defines the counterpart mp3 and ogg files
      this.play(); // Auto-Plays the file
    },
    oggSupport: true
  });
});