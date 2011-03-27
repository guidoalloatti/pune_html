$(document).ready(function()
{
	var response = getConfigurations();
	$("#magic_area").text(response);
	//alert(response); //.hole_size);
}); 
 
function getConfigurations()
{ 
	var xhReq = new XMLHttpRequest();
	xhReq.open("GET", "ajaxTest.php", false);
	//xhReq.send(null);
	xhReq.send(null);
	
	var serverResponse 		= xhReq.responseText;
	//var serverStatus		= xhReq.status;
	//var serverStatusText 	= xhReq.statusText;
	eval(serverResponse);
	
	alert(hole_size);
	
	//return serverResponse;
	 
	/* 
	alert(	"Server Status: "+serverResponse+
			"\nserverStatus: "+serverStatus+
			"\nserverStatusText: "+serverStatusText); 
	*/
}