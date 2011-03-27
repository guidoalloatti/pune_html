/* XML Functionality */
function testXML()
{
	loadValuesFromXml();
}

function loadValuesFromXml()
{
  $.ajax({
    type: "GET",
    url: xmlFileName,
    dataType: "xml",
    success: parseXml
  });
}

function parseXml(xml)
{

	$(xml).find("Tutoria").each(function()
	{
	  $("#log").append("\n"+$(this).find("Title").text());
	  $(this).find("Category").each(function()
	  {
		$("#log").append("\n"+$(this).text());
	  });
		$("#log").append("\n");
	});

	/*
  //find every Tutorial and print the author
  $(xml).find("Configuration").each(function()
  {
    $("#log").append("\n"+$(this).attr("Game"));
	//$("#log").append(": " + $(this).find("Title").text() + "<br />");
  });
  */
}



