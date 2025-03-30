> 愿你有一天，能与你最重要的人重逢

[Link](https://codeforces.com/problemset/problem/2092/F)

考虑固定一个美丽值 $k$ ，那么它的段数将会是 $\mathcal O\left(\dfrac nk\right)$ 级别的。

对于一个段数，我们考虑能取到它的最长和最短前缀。让前一段结尾与后一段开头不同，并且最后一段尽量延伸，我们能得到最长的前缀；否则让前一段结尾和后一段开头尽可能相同，最后一段尽量短，我们就能得到最短的前缀。

根据上面的过程不难发现：
1. 固定 $k$ 能满足一个同一个段数的前缀一定是连续的一段，所以求出最长最短前缀后可以差分；
1. 对于一个前缀能满足一个段数的 $k$ 最多只有一个，也就是说不用担心数重；
1. 固定 $k$ 以后，最长最短前缀都会随着段数往后移，不难提前维护一些信息实现 $\mathcal O(1)$ 移动。

最终复杂度 $\mathcal O(n\log n)$ 。

```cpp
#include<iostream>
#include<cstdio>
using namespace std;
int n,m;
int s[1000005];
int a[1000005];
int p[1000005];
int ans[1000005];
void solve(){
	scanf("%d",&n); m=0;
	for(int i=1;i<=n;i+=1) scanf("%1d",&s[i]);
	for(int i=1;i<=n;i+=1) ans[i]=1;
	for(int i=1,j=1;i<=n;i=++j){
		while(j<n&&s[j+1]==s[i]) j+=1;
		a[++m]=j-i+1; p[m]=i; ans[j+1]-=1;
	}
	for(int k=2;k<=n;k+=1){
		for(int i=0,j=0;;){
			if(a[i]>1) i-=1;
			i+=k; j+=k;
			if(i>m) break;
			ans[p[i]]+=1;
			if(j<m) ans[p[j+1]]-=1;
		}
	}
	for(int i=1;i<=n;i+=1) ans[i]+=ans[i-1];
	for(int i=1;i<=n;i+=1) printf("%d ",ans[i]);
	printf("\n");
	return;
}
int main(){
	int t; scanf("%d",&t);
	while(t--) solve();
	return 0;
}
```

Thanks~