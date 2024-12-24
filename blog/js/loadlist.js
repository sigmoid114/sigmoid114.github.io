MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
    },
};
path = window.location.pathname;
filename = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
console.log(filename);

function cut(s){
    n=s.length; t="";
    for(var i=0;i<n&&i<100;i+=1){
        if(s[i]=='<') t+="&lt;";
        else if(s[i]=='>') t+="&gt;"
        else t+=s[i];
    }
    if(n>100) t+='...';
    return t;
}

fetch('../json/articles.json')
    .then(res => res.text())
    .then(dat => {
        list=JSON.parse(dat).list;
        n=list.length;
        div=document.getElementById('content');
        for(var i=0;i<n;i+=1){
            tag=list[i].tag;
            flag=(filename=="/blog/list/"||filename=="index");
            if(tag.id==filename) flag=1;
            if(!flag) continue;
            a=document.createElement('a');
            a.href="../articles/"+list[i].id+".html";
            article=document.createElement('div');
            son1=document.createElement('div');
            son1.innerHTML=list[i].title;
            son2=document.createElement('div');
            info="| posted on "+list[i].time+" | under ";
            grandson=document.createElement('a');
            grandson.href="../list/"+tag.id+".html";
            grandson.innerHTML=tag.name;
            info+=grandson.outerHTML+" ";
            son2.innerHTML=info;
            son3=document.createElement('div');
            fetch("../data/"+list[i].id+'.md')
                .then(res1 => res1.text())
                .then(dat1 => son3.innerHTML=cut(dat1))
                .catch(err1 => console.log('Error:',err1))
            son1.classList.add('title');
            son2.classList.add('tag');
            son3.classList.add('main');
            a.appendChild(son1);
            a.appendChild(son2);
            a.appendChild(son3);
            a.classList.add('text-area');
            div.appendChild(a);
        }
        MathJax.typeset();
    })
    .catch(err => console.log('Error:',err))

fetch('../json/tags.json')
    .then(res => res.text())
    .then(dat => {
        list=JSON.parse(dat).list;
        n=list.length;
        for(var i=0;i<n;i+=1) {
            if(list[i].id==filename) {
                document.title="文章列表 - "+list[i].name+" - "+document.title;
                break;
            }
        }
    })
    .catch(err => console.log('Error:', err));