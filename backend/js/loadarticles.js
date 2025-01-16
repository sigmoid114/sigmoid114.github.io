function loadarticles(){
    fetch('../../get_articles',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        }
    })
        .then(res=>res.json())
        .then(dat=>{
            var list=dat.list;
            list.forEach(atc => {
                var div=document.createElement('div');
                var edt=document.createElement('a');
                var del=document.createElement('a');
                div.innerHTML=atc.title;
                edt.classList.add("blue","right");
                edt.innerHTML="修改";
                edt.href=`../editor/${atc.id}`;
                del.classList.add("red","right");
                del.innerHTML="删除";
                del.addEventListener('click',()=>{
                    var r=confirm(`确认删除文章 ${atc.title} 吗？`);
                    if(r==true){
                        fetch('../../delete_article',{
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            body: JSON.stringify({'aid':atc.id})
                        })
                            .then(res=>res.json())
                            .then(dat=>{
                                window.location='./management.html';
                            })
                            .catch(err=>console.log('Error:',err))
                    }
                });
                div.appendChild(del);
                div.appendChild(edt);
                document.getElementById('content').appendChild(div);
            });
        })
        .catch(err=>console.log('Error:',err))
}

function update(){
    fetch('../../update_all',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        }
    })
        .then(res=>res.json())
        .then(dat=>{
            console.log(dat)
            alert(dat.message);
        })
        .catch(err=>console.log('Error:',err))
}

loadarticles();