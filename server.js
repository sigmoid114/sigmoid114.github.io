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

app.post('/get_article',(req,res)=>{
	var id=req.body.id; var flag=0;
	var list=fs.readFileSync('blog/json/articles.json');
	var a=JSON.parse(list).list; var n=a.length;
	var dat={
		"title":"",
		"tag":"",
		"markdown":""
	};
	for(var i=0;i<n;i+=1){
		if(a[i].id==id){
			dat.title=a[i].title;
			dat.tag=a[i].tag;
			flag=1; break;
		}
	}
	if(flag){
		dat.markdown=fs.readFileSync('blog/data/'+id+'.md','utf8');
	}
	res.json(dat);
})

app.post('/submit_article',(req,res)=>{
	id=req.body.id;
	markdown=req.body.markdown;
	fs.writeFile(`blog/data/${id}.md`,markdown,'utf8',(err)=>{
		if(err){
			console.log('Error:',err);
			res.json(F);
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
