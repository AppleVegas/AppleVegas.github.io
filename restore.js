function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	    vars[key] = value;
	});
	//console.log(vars)
	return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
    	var param = getUrlVars()[parameter];
    		if (param)
    		{
    			//console.log(param)
    			urlparameter = param;
    		}
        }
    //console.log(urlparameter)
    return urlparameter;
}
var lie = "";
function go()
{
	window.location.href = lie;
}

function encrypts(val)
{
	var readyuval = "";
	var jsonse = sjcl.encrypt("minecraft", val);
	readyuval = btoa(jsonse);

	return readyuval;
}

function generate()
{
	var uval = document.getElementById("ugly").value
	document.getElementById("uglier").value = "applevegas.github.io/restore.html?restore=" + encrypts(uval);
	document.getElementById("uglier").style.visibility = 'visible';
	document.getElementById("uglierc").style.visibility = 'visible';
}

var urla = getUrlParam("restore", "no_info");
//console.log(urla)
if (urla == "no_info")
{
	document.getElementById("go").remove();
}
else
{
	document.getElementById("encrypt").remove();
	//var templie = JSON.stringify(JSON.parse(atob(urla)));
	lie = sjcl.decrypt("minecraft", atob(urla));
	//console.log(templie)
	document.getElementById("linker").href = lie;
}