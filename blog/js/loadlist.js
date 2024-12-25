MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
    },
};
var path = window.location.pathname;
var filename = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
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

function cmp(a,b){
    if(a.toplevel==b.toplevel) return a.time>b.time;
    return a.toplevel>b.toplevel;
}

function sort(a,l,r){
    if(l==r) return [a[l]];
    var mid=l+r>>1;
    var L=sort(a,l,mid),R=sort(a,mid+1,r);
    var p=0,q=0; b=[];
    for(var i=0;i<=r-l;i+=1){
        if(p==mid-l+1) b.push(R[q++]);
        else if(q==r-mid) b.push(L[p++]);
        else if(cmp(L[p],R[q])) b.push(L[p++]);
        else b.push(R[q++]);
    }
    return b;
}

fetch('../json/articles.json')
    .then(res => res.text())
    .then(dat => {
        var list=JSON.parse(dat).list;
        var n=list.length; list=sort(list,0,n-1);
        console.log(list);
        var div=document.getElementById('content');
        list.forEach(atc => {
            tag=atc.tag;
            if(filename=="/blog/list/"||filename=="index"||tag.id==filename){
                var a=document.createElement('a');
                a.href=`../articles/${atc.id}.html`;
                var article=document.createElement('div');
                var son1=document.createElement('div');
                son1.innerHTML=atc.title;
                var son2=document.createElement('div');
                info=`| posted on ${atc.time} | under `;
                grandson=document.createElement('a');
                grandson.href=`../list/${tag.id}.html`;
                grandson.innerHTML=tag.name;
                info+=grandson.outerHTML+" ";
                son2.innerHTML=info;
                var son3=document.createElement('div');
                fetch(`../data/${atc.id}.md`)
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
        });
        //MathJax.typeset();
    })
    .catch(err => console.log('Error:',err))

fetch('../json/tags.json')
    .then(res => res.text())
    .then(dat => {
        var list=JSON.parse(dat).list;
        var n=list.length;
        for(var i=0;i<n;i+=1) {
            if(list[i].id==filename) {
                document.title="文章列表 - "+list[i].name+" - "+document.title;
                break;
            }
        }
    })
    .catch(err => console.log('Error:', err));