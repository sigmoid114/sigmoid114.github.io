var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var fs=require('fs');
var cp=require('child_process');
var open=function(url,browser){
	cp.exec('start '+browser+' '+url,function(err,stdout,stderr){
		if(err) console.log('Error:',err);
	})
}
var git=function(cmd){
	cp.exec(`git ${cmd}`,(err,stdout,stderr)=>{
		if(err) console.log('Error:',err);
	});
}

app.use(express.json());
app.use('/blog',express.static('blog'));
app.use('/images',express.static('images'));
app.use('/backend',express.static('backend'));

var S={"message":"Success"};
var F={"message":"Failed"};

function rand_id(){
	var charset="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var m=charset.length,n=12; var id="";
	for(var i=0;i<n;i+=1){
		id+=charset[Math.floor(Math.random()*m)];
	}
	return id;
}

function get_time(){
	var time=new Date(); var s=time.getFullYear()+"-";
	s+=(time.getMonth()+1).toString().padStart(2,'0')+"-";
	s+=time.getDate().toString().padStart(2,'0')+" ";
	s+=time.getHours().toString().padStart(2,'0')+":";
	s+=time.getMinutes().toString().padStart(2,'0')+":";
	s+=time.getSeconds().toString().padStart(2,'0');
	return s;
}

function get_tag(tname){
	var list=fs.readFileSync('blog/json/tags.json');
	var t=JSON.parse(list).list; var n=t.length;
	for(var i=0;i<n;i+=1){
		if(t[i].name==tname) return t[i];
	}
	var tid=rand_id();
	var tag={
		"id":tid,
		"name":tname
	}
	t.push(tag);
	fs.copyFile('blog/templates/tag.html',`blog/list/${tid}.html`,(err)=>{
		if(err){
			console.log('Error:',err); return F;
		}
	});
	fs.writeFileSync('blog/json/tags.json',JSON.stringify({"list":t}),'utf8',(err)=>{
		if(err){
			console.log('Error:',err); return F;
		}
	});
	return tag;
}

function maintain_tags(a){
	var list=fs.readFileSync('blog/json/tags.json');
	var t=JSON.parse(list).list;
	console.log(t);
	var n=a.length,m=t.length; var vi={};
	var t_new=[]; var flag=0;
	for(var i=0;i<n;i+=1) vi[a[i].tag.id]=1;
	for(var i=0;i<m;i+=1){
		if(!vi[t[i].id]){
			fs.unlinkSync(`blog/list/${t[i].id}.html`); flag=1;
		}
		else t_new.push(t[i]);
	}
	if(flag){
		fs.writeFileSync('blog/json/tags.json',JSON.stringify({"list":t_new}),'utf8',(err)=>{
			if(err){
				console.log('Error:',err); return 0;
			}
		});
	}
	return 1;
}

app.get('/',(req,res)=>{
	var html=fs.readFileSync('index.html').toString();
	var n=html.length; var s="";
	for(var i=0;i<n;i+=1){
		s+=html[i];
		if(html[i-2]=='o'&&html[i-1]=='w'&&html[i]=='>'){
			s+="<a href=\"./backend/html/management.html\">博客管理</a>";
		}
	}
	res.send(s);
})

app.post('/get_article',(req,res)=>{
	var aid=req.body.aid; var flag=0;
	var list=fs.readFileSync('blog/json/articles.json');
	var a=JSON.parse(list).list; var n=a.length;
	var dat={
		"title":"",
		"tag":"",
		"markdown":""
	};
	for(var i=0;i<n;i+=1){
		if(a[i].id==aid){
			dat.title=a[i].title;
			dat.tag=a[i].tag;
			dat.toplevel=a[i].toplevel;
			flag=1; break;
		}
	}
	if(flag){
		dat.markdown=fs.readFileSync(`blog/data/${aid}.md`,'utf8');
	}
	res.json(dat);
})

app.post('/submit_article',(req,res)=>{
	var aid=req.body.aid; var flag=0;
	var markdown=req.body.markdown;
	var tag=get_tag(req.body.tag);
	if(tag==F) res.json(F);
	fs.writeFile(`blog/data/${aid}.md`,markdown,'utf8',(err)=>{
		if(err){
			console.log('Error:',err); res.json(F);
		}
	});
	var list=fs.readFileSync('blog/json/articles.json');
	var a=JSON.parse(list).list; var n=a.length;
	for(var i=0;i<n;i+=1){
		if(a[i].id==aid){
			a[i].title=req.body.title;
			a[i].tag=tag;
			a[i].toplevel=req.body.toplevel;
			flag=1; break;
		}
	}
	if(!flag){
		fs.copyFile('blog/templates/article.html',`blog/articles/${aid}.html`,(err)=>{
			if(err){
				console.log('Error:',err); res.json(F);
			}
		});
		a.unshift({
			"id":aid,
			"title":req.body.title,
			"time":get_time(),
			"tag":tag,
			"toplevel":req.body.toplevel
		});
	}
	fs.writeFile('blog/json/articles.json',JSON.stringify({"list":a}),'utf8',(err)=>{
		if(err){
			console.log('Error:',err); res.json(F);
		}
	});
	if(maintain_tags(a)) res.json(S);
	else res.json(F);
})

app.post('/get_articles',(req,res)=>{
	var list=fs.readFileSync('blog/json/articles.json');
	res.json(JSON.parse(list));
});

app.post('/delete_article',(req,res)=>{
	var aid=req.body.aid; var a_new=[];
	var list=fs.readFileSync('blog/json/articles.json');
	var a=JSON.parse(list).list; var n=a.length;
	fs.unlinkSync(`blog/data/${aid}.md`);
	fs.unlinkSync(`blog/articles/${aid}.html`);
	for(var i=0;i<n;i+=1){
		if(a[i].id!=aid) a_new.push(a[i]);
	}
	fs.writeFile('blog/json/articles.json',JSON.stringify({"list":a_new}),'utf8',(err)=>{
		if(err){
			console.log('Error:',err); res.json(F);
		}
	});
	if(maintain_tags(a_new)) res.json(S);
	else res.json(F);
})

app.get('/backend/editor/',(req,res)=>{
	var aid=rand_id();
	var html=fs.readFileSync('backend/html/editor.html').toString();
	var n=html.length,flag=0;
	var L="",R="";
	for(var i=0;i<n;i+=1){
		if(html[i]=='$') flag=1;
		else{
			if(!flag) L+=html[i];
			else R+=html[i];
		}
	}
	res.send(L+aid+R);
})

app.get('/backend/editor/:aid',(req,res,nxt)=>{
	var aid=req.params.aid;
	var html=fs.readFileSync('backend/html/editor.html').toString();
	var n=html.length,flag=0;
	var L="",R="";
	for(var i=0;i<n;i+=1){
		if(html[i]=='$') flag=1;
		else{
			if(!flag) L+=html[i];
			else R+=html[i];
		}
	}
	res.send(L+aid+R);
})

app.post('/update_all',(req,res)=>{
	console.log('wait...');
	cp.exec('update.bat',(err,stdout,stderr)=>{
		if(err){
			console.log('Error:',err);
			res.json(F);
		}
		else{
			console.log('ok');
			res.json(S);
		}
	});
})

var server=app.listen(1145,()=>{
	open('localhost:1145/','firefox');
	console.log('success');
})
