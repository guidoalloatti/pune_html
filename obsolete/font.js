
lastsec = "";
timeformat = "24";

function setColorScheme(scheme) {
	if(scheme=='glow') {
		on = "#333";
		off = "#3bb";
		document.getElementById('demowrap').style.background = "#4ce";
		document.getElementById('ampm').style.color = on;
	}
	else if(scheme=='tanfa') {
		on = "#872";
		off = "#dcc";
		document.getElementById('demowrap').style.background = "#edc";
		document.getElementById('ampm').style.color = on;
	}
	else if(scheme=='tanfa2') {
		on = "#777";
		off = "#f2dfdf";
		document.getElementById('demowrap').style.background = "#e7c3c6";
		document.getElementById('ampm').style.color = on;
	}
	else if(scheme=='red') {
		on = "#f00";
		off = "#700";
		document.getElementById('demowrap').style.background = "#444";
		document.getElementById('ampm').style.color = on;
	}
	else {
		on = "#0f0";
		off = "#363";
		document.getElementById('demowrap').style.background = "#444";
		document.getElementById('ampm').style.color = on;
	}
	
	upper_top = new Array(on,off,on,on,off,on,off,on,on,on);
	upper_rgh = new Array(on,on,on,on,on,off,off,on,on,on);
	upper_bot = new Array(off,off,on,on,on,on,on,off,on,on);
	upper_lef = new Array(on,off,off,off,on,on,on,off,on,on);
	
	lower_top = new Array(off,off,on,on,on,on,on,off,on,on);
	lower_rgh = new Array(on,on,off,on,on,on,on,on,on,on);
	lower_bot = new Array(on,off,on,on,off,on,on,off,on,on);
	lower_lef = new Array(on,off,on,off,off,off,on,off,on,off);
}

function lcd() {
	now = new Date();
	secs = now.getSeconds();
	mins = now.getMinutes();
	hrs = now.getHours();
	
	n = 2;
	if(timeformat == "12") {
		n = 0;
		if(hrs >= 12) {
			hrs = (hrs - 12 == 0 ? 12 : hrs - 12);
			n = 1;
		}
		if(hrs == 0) {
			hrs = 12;
		}
	}
	
	mins = (mins < 10 ? "0" + mins : mins) + "a";
	hrs = (hrs < 10 ? "0" + hrs : hrs) + "a";
	st = hrs.substring(0,1);
	nd = hrs.substring(1,2);
	rd = mins.substring(0,1);
	th = mins.substring(1,2);
	document.getElementById("dot_upper").style.borderColor = (lastsec == secs ? on : off);
	document.getElementById("dot_lower").style.borderColor = (lastsec == secs ? on : off);

	document.getElementById("first").getElementsByTagName("div")[0].style.borderColor = (st == 0 ? off : upper_top[st] + " " + upper_rgh[st] + " " + upper_bot[st] + " " + upper_lef[st]);
	document.getElementById("second").getElementsByTagName("div")[0].style.borderColor = upper_top[nd] + " " + upper_rgh[nd] + " " + upper_bot[nd] + " " + upper_lef[nd];
	document.getElementById("third").getElementsByTagName("div")[0].style.borderColor = upper_top[rd] + " " + upper_rgh[rd] + " " + upper_bot[rd] + " " + upper_lef[rd];
	document.getElementById("fourth").getElementsByTagName("div")[0].style.borderColor = upper_top[th] + " " + upper_rgh[th] + " " + upper_bot[th] + " " + upper_lef[th];

	
	document.getElementById("first").getElementsByTagName("div")[1].style.borderColor = (st == 0 ? off : lower_top[st] + " " + lower_rgh[st] + " " + lower_bot[st] + " " + lower_lef[st]);
	
	//document.getElementById("first").getElementsByTagName("div")[1].style.borderColor = lower_top[st] + " " + lower_rgh[st] + " " + lower_bot[st] + " " + lower_lef[st];
	document.getElementById("second").getElementsByTagName("div")[1].style.borderColor = lower_top[nd] + " " + lower_rgh[nd] + " " + lower_bot[nd] + " " + lower_lef[nd];
	document.getElementById("third").getElementsByTagName("div")[1].style.borderColor = lower_top[rd] + " " + lower_rgh[rd] + " " + lower_bot[rd] + " " + lower_lef[rd];
	document.getElementById("fourth").getElementsByTagName("div")[1].style.borderColor = lower_top[th] + " " + lower_rgh[th] + " " + lower_bot[th] + " " + lower_lef[th];
	
	document.getElementById("ampm").getElementsByTagName("div")[0].style.display = "none";
	document.getElementById("ampm").getElementsByTagName("div")[1].style.display = "none";
	document.getElementById("ampm").getElementsByTagName("div")[2].style.display = "none";
	document.getElementById("ampm").getElementsByTagName("div")[n].style.display = "block";
	
	lastsec = secs;
}

function toggle(which) {
	timeformat = which;
}

function start()
{
	setColorScheme('normal');
	foo = setInterval("lcd()",250);
}

$(document).ready(function()
{
	start();
});