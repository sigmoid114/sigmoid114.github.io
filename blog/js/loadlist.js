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

fetch('../json/articles.json')
    .then(res => res.text())
    .then(dat => {
        list=JSON.parse(dat).list;
        n=list.length;
        flag=0;
        for(var i=0;i<n;i+=1){
            tags=list[i].tags;
            m=tags.length;
            for(var j=0;j<m;j+=1){
                if(tags[j].id==filename){
                    flag=1; break;
                }
            }
            if(!flag) continue;
            //
        }
    })
    .catch(err => console.log('Error:',err))