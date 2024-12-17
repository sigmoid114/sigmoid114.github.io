MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
    },
};
function write(dat) {
    hljs.highlightAll();
    marked.setOptions({
        highlight: function (code, lang) {
            return hljs.highlight(code, { language: lang }).value;
        }
    })
    document.getElementById('main').innerHTML = marked(dat);
    MathJax.typeset();
}
var path = window.location.pathname;
var filename = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
fetch("../data/" + filename + ".md")
    .then(res => res.text())
    .then(dat => write(dat))
    .catch(err => console.error('Error:', err));