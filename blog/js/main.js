const name="sigmoid114 的博客";
const intr="#define inf 1145141919";

function load_main() {
    document.title += " " + name;
    div = document.getElementsByClassName('name');
    for (var i = 0, n = div.length; i < n; i += 1) {
        div[i].innerHTML = name;
    }

    div = document.getElementsByClassName('intr');
    for (var i = 0, n = div.length; i < n; i += 1) {
        div[i].innerHTML = intr;
    }
}