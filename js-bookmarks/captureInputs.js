(()=>{
	let excl=['image','submit','button','hidden','reset'];
	let v=JSON.parse(prompt('prev Vals?','[]'));
	let x=document.getElementsByTagName('input');
	let t,xt,xid,xv,err;
	for(let i=x.length-1;i>=0;i--)
	{
		xt=x[i].type;
		xid=x[i].id;
		xv=!((excl.indexOf(xid)>=0)||x[i].readonly||x[i].hidden||x[i].disabled||(xt=="hidden"));
		if((v[i]!==null)&&xv)
		{
			if(v[i]&&(xt!=v[i].id))
			{
				err=true;
				console.error(v[i]);
				continue;
			}
			t={
				'value':(x[i].value),
				'checked':(x[i].checked),
				'id':(x[i].id),
			};
			Object.assign(x[i],v[i]);
			v[i]=t;
		}
		else
		{
			v[i]=null;
		}
	}
	if(err)
	{
		alert('id mismatches logged');
	}
	t=JSON.stringify(v);
	console.log(t);
	alert(t);
})();