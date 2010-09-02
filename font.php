<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"

 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html id="www-tanfa-co-uk"> 
<head> 
<meta http-equiv="content-type" content="text/html; charset=iso-8859-1" /> 
<title>Digital LCD Working Clock :: CSS Border Design</title> 
<link rel="shortcut icon" href="../../favicon.ico" /> 
<meta name="description" content="CSS Design, Style and Fun, the musings of Claire Campbell, a Woman of CSS." /> 
<meta name="keywords" content="CSS digital clock Border Design javascript working" /> 
<meta name="author" content="Claire Campbell" /> 
<link href="../../tanfa.css" rel="stylesheet" type="text/css"> 
<link href="clock-working.css" rel="stylesheet" type="text/css"> 
</head> 
<body id="demopage" class="m13"> 
<div id="wrapper"> 
<div id="masthead"> 
<p><span>CSS Design and style... the possibilities</span><a href="../../index.html" title="CSS... possibilites"><img src="../../images/s.gif" alt="CSS Design and style... the possibilities" /></a></p> 
</div> 
<div id="content"> 
<h1 id="toptitle"><span>CSS Border Art -  Working Clock</span></h1> 
<h2>CSS Working LCD Digital Clock</h2> 
<div id="demospace"></div> 
<p>Based on Maurício Samy Silva's <a href="clock.html" title="Maurício's Border Clock">Digital Clock</a> - A good friend of mine produced this skinnable working version!</p> 
<p>Rainer, you did a great job - Thank you. <img src="../../images/smilies/grin.gif" width="10" height="10" alt="{grin}" /></p> 
 
<div id="demowrap"> 
	<div id="first"> 
		<div class="upper"></div> 
		<div class="lower"></div> 
	</div> 
	<div id="second"> 
		<div class="upper"></div> 
		<div class="lower"></div> 
	</div> 
  <div id="dot_upper"> </div> 
  <div id="dot_lower"> </div> 
	<div id="third"> 
		<div class="upper"></div> 
		<div class="lower"></div> 
	</div> 
	<div id="fourth"> 
		<div class="upper"></div> 
		<div class="lower"></div> 
	</div> 
 	<div id="ampm"> 
		<div>AM</div> 
		<div>PM</div> 
		<div>24</div> 
	</div> 
<div id="selector"> 
<ul> 
<li><a href="clock-working.html#" onclick="javascript:toggle('12');">12</a>/<a href="clock-working.html#" onclick="javascript:toggle('24');">24</a><br /></li> 
<li><strong>Color Scheme:</strong></li> 
<li><a href="clock-working.html#" onclick="javascript:setColorScheme('green');">Green (Default)</a></li> 
<li><a href="clock-working.html#" onclick="javascript:setColorScheme('red');">Red</a></li> 
<li><a href="clock-working.html#" onclick="javascript:setColorScheme('glow');">Glowing</a></li> 
<li><a href="clock-working.html#" onclick="javascript:setColorScheme('tanfa');">Tanfa - V.1</a></li> 
<li><a href="clock-working.html#" onclick="javascript:setColorScheme('tanfa2');">Tanfa - V.2</a></li> 
</ul> 
</div> 
</div> 
 
<script type="text/javascript"> 
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
 
setColorScheme('normal');
foo = setInterval("lcd()",250);
</script> 
 
<p><strong>Related:</strong> <a href="http://www.thorstenvock.de/digiClock.php" title="Thorsten Vock">Thorsten Vock</a> also has a similiar transformation on his site.</p> 
<div id="borderrelated"><div> 
<p><strong>Related: More Examples</strong></p> 
<ul> 
<li><a href="ukflag.html" title="UK Flag drwn with Borders"">UK Flag with Borders</a> - by - <a href="http://www.maujor.com/index.php" title="Maurício Samy Silva">Maurício Samy Silva</a></li> 
<li><a href="keyboard.html" title="Windows Keyboard layout">Windows Keyboard Layout</a> - by - <a href="http://www.seoconsultants.com/" title="SEO Consultants">SEO Consultants</a></li> 
<li><a href="clock-working.html" title="Working CSS Border LCD Clock">Working - Border LCD Clock</a> - by - <a href="http://bluewidgets.wordpress.com/" title="Rainer �?hlfors">Rainer �?hlfors</a></li> 
<li><a href="clock.html" title="CSS Border Digital Clock">Digital Clock</a> - by - <a href="http://www.maujor.com/index.php" title="Maurício Samy Silva">Maurício Samy Silva</a></li> 
<li><a href="xmas.html" title="CSS Christmas Greetings">Christmas Greetings</a> - by - <a href="http://www.cssplay.com" title="Stu's Site">Stu Nicholls</a></li> 
<li><a href="lampa.html" title="CSS Lampa">CSS Lampa</a> - by - <a href="http://css-lampa.mraveniste.org/" title="Jan's Site">Jan Bien</a></li> 
<li><a href="mondriaan1.html" title="Mondriaan Composition">Mondriaan Composition</a> - by - <a href="http://www.markschenk.com/cssexp/mondriaan/mondriaan.html" title="Mark's Site">Mark Schenk</a></li> 
<li><a href="snooker-table.html" title="Snooker Table">Snooker Table</a> - by - <a href="../../index.html" title="Claire's Site">Claire Campbell</a></li> 
<li><a href="computer.html" title="Desktop Computer">Desktop Computer</a> - by - David House</li> 
<li><a href="stacked-cubes.html" title="Stacked Cubes like Q*bert">Stacked Cubes</a> - by - Jack Ratcliff</li> 
<li><a href="night-life.html" title="I Love The Night Life">Night Life Scene</a> - by - <a href="http://www.intersmash.com/" title="Ro's Site">Ro London</a></li> 
<li><a href="house.html" title="CSS House">House with CSS Borders</a> - by - <a href="http://www.designdetector.com/" title="Chris's Site">Chris Hester</a></li> 
<li><a href="cube.html" title="CSS Cube">A Simple Cube</a> - by - <a href="../../index.html" title="Claire's Site">Claire Campbell</a></li> 
<li><a href="window.html" title="CSS Window - C Hester">Window with Borders</a> - by - <a href="http://www.designdetector.com/" title="Chris's Site">Chris Hester</a></li> 
</ul> 
</div></div> 
 
<p class="borderindex">&#171;&#171; 
<a href="clock.html" title="Digital Clock">Digital Clock</a> 
<span>|</span> 
<a href="index.html" title="CSS Borders Index of Featured Examples"><acronym title="Cascading Style Sheets">CSS</acronym> Border Art Index</a> 
<span>|</span> 
<a href="keyboard.html" title="Windows Keyboard">Windows Keyboard</a> 
&#187;&#187;</p> 
 
<div class="gooads" style="height: 95px;"> 
<script type="text/javascript"><!--
google_ad_client = "pub-1690082991082204";
google_ad_width = 728;
google_ad_height = 90;
google_ad_format = "728x90_as";
google_ad_channel ="";
google_color_border = "FFFFFF";
google_color_bg = "FFFFFF";
google_color_link = "800000";
google_color_url = "660000";
google_color_text = "000000";
//--></script> 
<script type="text/javascript"

  src="http://pagead2.googlesyndication.com/pagead/show_ads.js"> 
</script> 
</div> 
 
</div><!-- sidebar or content --> 
<div id="footer"> 
<p>Claire "Suzy" Campbell &#171;<a href="../../index.html" title="tanfa">tanfa.co.uk</a>&#187; &#169; 2003-2009</p> 
</div><!-- footer --> 
</div><!-- wrapper --> 
<script type="text/javascript"> 
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script> 
<script type="text/javascript"> 
try {
var pageTracker = _gat._getTracker("UA-8413615-1");
pageTracker._trackPageview();
} catch(err) {}</script> 
</body> 
</html>