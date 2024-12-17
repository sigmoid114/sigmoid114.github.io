MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
    },
};

fetch('../json/tags.json')
    .then(res => res.text())
    .then(dat => {
        list=JSON.parse(dat).list;
        n=list.length;
        div=document.getElementById('list');
        for(var i=0;i<n;i+=1){
            a=document.createElement('a');
            a.href='./'+list[i].id+'.html';
            a.innerHTML=list[i].name;
            div.appendChild(a);
        }
    })
    .catch(err => console.log('Error:',err))