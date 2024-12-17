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
url1='./json/articles.json';
if(filename!='index') url1='.'+url1;

fetch(url1)
    .then(res => res.text())
    .then(dat => {
        list=JSON.parse(dat).list;
        n=list.length;
        div=document.getElementById('list');
        for(var i=0;i<n;i+=1){
            flag=(filename=='index');
            tags=list[i].tags;
            m=tags.length;
            for(var j=0;j<m;j+=1){
                if(tags[j].id==filename){
                    flag=1; break;
                }
            }
            if(!flag) continue;
            href="./articles/"+list[i].title+".html";
            if(filename!='index') href='.'+href;
            a=document.createElement('a');
            a.href=href;
            article=document.createElement('div');
            son1=document.createElement('div');
            son1.innerHTML=list[i].title;
            son2=document.createElement('div');
            for(var j=0;j<m;j+=1){
                grandson=document.createElement('div');
                grandson.innerHTML=tags[j].name;
                son2.appendChild(grandson);
            }
            a.appendChild(son1);
            a.appendChild(son2);
            div.appendChild(a);
        }
        MathJax.typeset();
    })
    .catch(err => console.log('Error:',err))

if(filename!='index') {
    fetch('../json/tags.json')
        .then(res => res.text())
        .then(dat => {
            list=JSON.parse(dat).list;
            n=list.length;
            for(var i=0;i<n;i+=1) {
                if(list[i].id==filename) {
                    document.title="文章列表 - "+list[i].name;
                    document.getElementById('title').innerHTML="文章列表 - "+list[i].name;
                    break;
                }
            }
        })
        .catch(err => console.log('Error:', err));
}