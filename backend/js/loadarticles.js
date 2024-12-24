function loadarticles(){
    fetch('../../get_articles',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
    })
        .then(res=>res.json())
        .then(dat=>{
            var list=dat.list;
            var n=list.length;
            for(var i=0;i<n;i+=1){
                a=document.createElement('a');
                a.href=`../editor/${list[i].id}`;
                a.innerHTML=list[i].title;
                document.getElementById('content').appendChild(a);
            }
        })
        .catch(err=>console.log('Error:',err))
}
loadarticles();