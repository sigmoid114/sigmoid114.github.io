> 听好了：你能所能看到的并不是这个博客的全部，可以访问[这里](https://github.com/sigmoid114/sigmoid114.github.io)从而一睹这个博客的真实面貌。

## $\clubsuit$为什么会搭建这个博客

1. 为了复刻洛谷博客。曾经的洛谷博客简洁而不失美观，是我也是无数 OIer 的最爱。然而后来洛谷因为神秘原因把博客爆改改成了文章区，简洁而失去美观，我还是喜欢我的洛谷博客。于是高三的我就立志在大学按照洛谷博客搭一个。

1. 我选的是计算机专业，我是大学生。我认为一个学期不能只为了期末的分数努力，应该干点像这个专业干的事。如果一个学期之后只有看起来不错的分数，那真的就废了。

## $\clubsuit$这真的只是由几个页面组成的静态网站吗？

是但不完全是。 `.github.io` 只支持展示静态页面，但如果真的只是几个静态页面的话，我初二就能干出来。所以我就额外写了一个本地的服务器用来编写文章，这也是整个项目的精髓。这样一来，博客就更方便维护了。

## $\clubsuit$与洛谷博客的比较

虽说是复刻洛谷博客，但也并非百分百复刻，还是有很大差别的。

很多地方都是根据之前洛谷博客的截图写的样式，但是有很多细节我无从得知，所以整体上看一样，但有一些小地方是不太一样的。

然后就是导航栏上的一些功能，最右边的搜索完全只是个摆设，可以用来刷新界面，因为洛谷博客的搜索我没用过所以我不知道是用来干嘛的。“首页”原本指向的是洛谷的首页，但我把它设置成我博客的首页；“分类”是洛谷博客没有的，加上是为了方便根据标签浏览不同文章。

点赞评论之类的都没有了，因为这是 Github 上的静态页面所以暂时没能找到方案，除非我可以氪金买个服务器，但我觉得没必要，评论点赞其实也没必要~~因为不会有几个人来看的~~。

## $\clubsuit$项目的实现

似乎一切都是围绕着文章的存储进行的。

首先展示出来的一定是 `html` ，然而每篇文章除了 `markdown` 以外的其他部分是完全一致的。所以只要实现通过 `javascript` 将 `markdown` 转换成 `html` 并嵌入文章中，那么理论上每篇文章的 `html` 源码都将完全一致。于是我采用了 `marked.js` 渲染主要内容，`highlight.js` 渲染代码，`mathjax` 渲染公式，那么就能完全实现 `markdown` 到 `html` 的转换。

我不希望文件名出现中文，所以我给每个文章配备了一个随机生成的包含大写字母和数字的 `id` 作为  `markdown` 和 `html` 的文件名，然后用一个 `json` 存储所有文章的信息，然后就可以让 `javascript` 通过 `html` 的文件名找到相应的 `markdown` 以及文章信息，从而能在 `github.io` 展示出完整的页面。

文章分类的存储也类似，只不过少了 `markdown` 部分。

至于博客后台，由于可以本地编辑，所以就可以采取动态网站设计的思路。服务器使用 `node.js` 并采取 `express` 框架，博客后台的页面只需向本地服务器发送一些请求，就能能方便地实现博客文件的读写增删。文章的 `html` 只需要直接从模板区读取然后改个名复制到文章对应的文件夹， `markdown` 源码发送到服务器然后写入对应 `md` 文件，其他信息直接修改 `json` 中的内容。

文章增删以及修改都可能导致文章分类集合发生改变，因此我写了个函数来维护，使得至少出现过一次的分类有对应的 `html` 以及 `json` 中的信息。

## $\clubsuit$总结/后续

博客搭建是我在本学期靠前的时候决定的，然而由于各方面技术的不足所以一直往后咕。后来和另外几个人一起搭建了一个小论坛，才算大致搞懂网站各个方面的原理。在确定了根据我已掌握的技术能搭成一个方便维护的博客之后才正式开工。

然后有些细节仍未完善，比如公式不能加颜色，图片的上传没找到比较方便的方案（但我写博客基本不带图片就是了），之后可能时不时要小修小补一下。

总的来说，这是我第一个独立完成的项目，之后我也希望能学到更多技术，独立或合作实现更多项目捏。