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

fetch("../json/articles.json")
    .then(res => res.text())
    .then(dat => {
        list=JSON.parse(dat).list;
        n=list.length;
        title=""; tags=[];
        for(var i=0;i<n;i+=1){
            if(list[i].id==filename){
                title=list[i].title;
                tags=list[i].tags;
                break;
            }
        }
        document.title=title+" - "+document.title;
        document.getElementById('title').innerHTML=title;
        m=tags.length; div=document.getElementById('tags');
        for(var i=0;i<m;i+=1){
            a=document.createElement('a');
            a.href="../list/"+tags[i].id+".html";
            a.innerHTML=tags[i].name;
            div.appendChild(a);
        }
        MathJax.typeset();
    })
    .catch(err => console.log('Error:', err));

fetch("../data/" + filename + ".md")
    .then(res => res.text())
    .then(dat => {
        hljs.highlightAll();
        marked.setOptions({
            highlight: function (code, lang) {
                return hljs.highlight(code, { language: lang }).value;
            }
        })
        document.getElementById('main').innerHTML = marked(dat);
        MathJax.typeset();
    })
    .catch(err => console.error('Error:', err));