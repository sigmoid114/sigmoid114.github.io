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

app.use(express.json());
app.use('/blog',express.static('blog'));
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
	fs.writeFile('blog/json/tags.json',JSON.stringify({"list":t}),'utf8',(err)=>{
		if(err){
			console.log('Error:',err); return F;
		}
	});
	return tag;
}

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
	res.json(S);
})

app.post('/get_articles',(req,res)=>{
	var list=fs.readFileSync('blog/json/articles.json');
	res.json(JSON.parse(list));
});

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

var server=app.listen(1145,()=>{
	//open('localhost:1145/blog','firefox');
	console.log('success');
})
