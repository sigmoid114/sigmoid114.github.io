function loadeditor(id){
    fetch('../../get_markdown',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'id':id})
    })
        .then(res=>res.json())
        .then(dat=>{
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

function submit(id){
    fetch('../../submit_markdown',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            'id':id,
            'markdown':document.getElementById('editormd').value
        })
    })
        .then(res=>res.json())
        .then(dat=>{
            alert(dat.message);
        })
        .catch(err=>console.log('Error',err))
}