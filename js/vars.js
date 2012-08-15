
/* Game Vars */
var showMessages = false;
var holeSize = 30;
var spaceBetweenHoles = 100;
var isNewRound = false;
var roundNumber = 0;
var onPause = false;
var wormsAlive;
var scoreToWin;
var maxScore = 0;
var wormHasCrush = false;
var imageArray;
var soundOn = true;
var winningWorm;
var longestWormSize;
var longestWorm;
var wormIsInHole = false;

/* How Will Worm Move */
var speedingChance = 500;
var startingSpeed = 15;		/* How fast will worms start moving */
var speedingIncrementSpeed = 5;
var intervalMiliSeconds = 1000;
var speed = 10;
var basicFPSValue = 20;
var fps; 					/* Is defined by speed+basicFPSValue */
var wormSize = 4; 			/* The size of the circle */
var angleStepSize = 1; 		/* How much will it turn */
var sizeMultiplier = 2;		/* How much will the worm move every interval */
var currentRound = 0;		/* Set initial value for round, previous start */
var histotyDotsSaved = 10000;

/* Canvas and Js Vars */
var xMax = 640; //800;
var yMax = 480; //600;
var angleMax = 360;
var interval;
var context;
var marker;
var keyCode;
var i;
var score_x = 13;
var score_y = 42;

/* Math Vars */
var sin;
var cos;
var angle;
var x;
var y;

/* Information Vars */
var message = '';
var actionCounter = 0;

/* Marker Vars */
var xMarker = 0; //xMax+5;
var yMarker = 0;
var wMarker = yMax/6;
var hMarker = yMax/6;

/* Arrays Declarations */
var keysBeenPressed = new Array(512);
var worms = new Array(6);
var players = new Array(6);
var colors = new Array(6); 
var rgbColors = new Array(6);

/* XML Settings */
var xmlFileDir = "/xml";
var xmlFileName = "xml_jquery.xml"
//var xmlFileName = "config.xml"

/* Variables Declarations Finished */