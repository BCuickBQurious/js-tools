(()=>{
document.title="onChange:"+location.host;
let response='';
let xhr=new XMLHttpRequest();
function sendReq()
{
	xhr.open('GET',location.href);xhr.send();
}
setInterval(sendReq,5000);
function compareResponse()
{
	if(response!=xhr.responseText)
	{
		window.location.reload();
	}
	else
	{
		document.body.innerHTML=(new Date()).toString();
	}
};
xhr.onload=function()
{
	response=xhr.response;
	xhr.onload=compareResponse;
};
sendReq();
})();