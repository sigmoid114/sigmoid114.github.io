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
        n=list.length; title=""; info=""; tag={};
        for(var i=0;i<n;i+=1){
            if(list[i].id==filename){
                title=list[i].title;
                info="posted on "+list[i].time+" | under ";
                tag=list[i].tag;
                break;
            }
        }
        document.title=title+" - "+document.title;
        document.getElementById('title').innerHTML=title;
        div=document.getElementById('tag');
        a=document.createElement('a');
        a.href="../list/"+tag.id+".html";
        a.innerHTML=tag.name;
        info+=a.outerHTML+" ";
        info+="|";
        div.innerHTML=info;
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