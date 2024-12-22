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
        ul=document.getElementById('list');
        for(var i=0;i<n;i+=1){
            a=document.createElement('a');
            a.href='./'+list[i].id+'.html';
            a.innerHTML=list[i].name;
            li=document.createElement('li');
            li.appendChild(a);
            ul.appendChild(li);
        }
    })
    .catch(err => console.log('Error:',err))