function loadeditor(aid){
    fetch('../../get_article',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'aid':aid})
    })
        .then(res=>res.json())
        .then(dat=>{
            console.log(dat);
            document.getElementById('title').value=dat.title;
            document.getElementById('tag').value=dat.tag.name;
            editormd("editor",{
                width:"100%",
                height:"100%",
                tex:true,
                markdown: dat.markdown,
                path:"../editor.md/lib/"
            });
        })
        .catch(err=>console.log('Error:',err))
}

function submit(aid){
    fetch('../../submit_article',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            'aid':aid,
            'markdown':document.getElementById('editormd').value,
            'title':document.getElementById('title').value,
            'tag':document.getElementById('tag').value,
            'toplevel':document.getElementById('toplevel').value
        })
    })
        .then(res=>res.json())
        .then(dat=>{
            alert(dat.message);
        })
        .catch(err=>console.log('Error',err))
}