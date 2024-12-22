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

var server=app.listen(1145,()=>{
	open('localhost:1145/blog','firefox');
	console.log('success');
})
