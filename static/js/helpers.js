/*
/ This is where all the element trigger and actions are located
*/
$(document).ready(function() {

  // Dialog open events
  $( "#create-game" ).click(function() { $( "#dialog-form" ).dialog( "open" ); });
  $( "#set-game" ).click(function() { $( "#dialog-form" ).dialog( "open" ); });

  // Toggle options and sounds visibility
  $("#open-new-game-settings").click(function(){  $("#game-settings-div").slideToggle("slow"); })

  // Close panels button actions
  $("#info-close-btn").click(function(){    $("#game-info-div").slideToggle(); })
  $("#log-close-btn").click(function(){     $("#game-details-div").slideToggle(); })
  $("#keys-close-btn").click(function(){    $("#show-keys-div").slideToggle(); })
  $("#sounds-close-btn").click(function(){  $("#sounds-menu").slideToggle(); })

  // Nav bar buttons action
  $("#toggle-log").click(function(){        $("#game-details-div").slideToggle("slow"); })
  $("#toggle-info").click(function(){       $("#game-info-div").slideToggle("slow"); })
  $("#toggle-keys").click(function(){       $("#show-keys-div").slideToggle("slow"); })
  $("#sounds-nav-bar").click(function(){    $("#sounds-menu").slideToggle("slow"); })

  // Triggers for playing the sounds on the nav bar menu elements
  $("#play-red-winning-shout").click(function(){    playSound("red") })
  $("#play-purple-winning-shout").click(function(){ playSound("purple") })
  $("#play-blue-winning-shout").click(function(){   playSound("blue") })
  $("#play-green-winning-shout").click(function(){  playSound("green") })
  $("#play-yellow-winning-shout").click(function(){ playSound("yellow") })
  $("#play-cyan-winning-shout").click(function(){   playSound("cyan") })
  $("#die-shout").click(function(){       playSound("die") })
  $("#yabass-shout").click(function(){    playSound("yabass") })
  $("#winning-shout").click(function(){   playSound("win") })
  $("#speeding-shout").click(function(){  playSound("speeding") })
  $("#pause-shout").click(function(){     playSound("pause") })
  $("#burp-shout").click(function(){      playSound("burp") })
})


function getWormColorByIndex(index) {
  switch(index) {
    case 0: return "red"; break;
    case 1: return "blue"; break;
    case 2: return "green"; break;
    case 3: return "purple"; break;
    case 4: return "cyan"; break;
    case 5: return "yellow"; break;
    default: return 100; break;
  }
}

// Gets the worm index by the color
function getWormIndexByColor(color) {
  color = color.toString();
  switch(color) {
    case "red": return 0; break;
    case "blue": return 1; break;
    case "green": return 2; break;
    case "purple": return 3; break;
    case "cyan": return 4; break;
    case "yellow": return 5; break;
    default: return 100; break;
  }
}

// This function shows the current worm info
function showWormInfo(currentWorm) {
  pause();
  console.log(  "color: "+currentWorm.color+
      "\nx: "+currentWorm.x+
      "\ny: "+currentWorm.y+
      "\nangle: "+currentWorm.angle+
      "\nalive: "+currentWorm.alive+
      "\nplaying: "+currentWorm.playing+
      "\nscore: "+currentWorm.score+
      "\nlength: "+currentWorm.length);
}  

// This function shows the information related with the selected picture
function showPixelInfo(currentWorm, imageArray) {
  console.log("current.x: "+currentWorm.x+
      "\ncurrent.y: "+currentWorm.y+
      "\nnext.x: "+x+
      "\nnext.y: "+y+
      "\nred: "+imageArray.data[0]+
      "\ngreen: "+imageArray.data[1]+
      "\nblue: "+imageArray.data[2]+
      "\nalpha: "+imageArray.data[3]+
      "\nlength: "+currentWorm.length);
} 

function setKeyHelp() {
  $.each(players, function(){
    if(this.playing) {
      // console.log("=============================")
      // console.log("into setKeyHelp: ")
      // console.log("The color is: " + this.color)
      // console.log("The left is: " + this.rightKey)
      // console.log("The right is: " + this.leftKey)
      currentKeys[i]["right"]
      $("#"+this.color+"KeyHelpRow").css("display", "block");
      $("#"+this.color+"RightButton").val(String.fromCharCode(this.rightKey));
      $("#"+this.color+"LeftButton").val(String.fromCharCode(this.leftKey));
    }
  });
}