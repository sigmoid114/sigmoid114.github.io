> 我只对现实世界绝望过，却未对自己绝望过！

[Link](https://codeforces.com/contest/1988/problem/D)

等价于给每个点分配一些数字，使得相同数字不能被同一条边连着，使得分配的数字乘上点的权值总和最小。

一个很显然的想法是直接在树上 dp 。设 $f_{x,i}$ 为点 $x$ 分配数字 $i$ 的结果，然后前后缀优化一下就能做到 $\mathcal O(nm)$ ，其中 $m$ 为最大用到的分配的数字。

显然取 $m=n$ 一定能保证正确性，然而直觉告诉我， $m$ 可以变得更小！

一个点如果取到 $m$ ，那么和它相连的点中至少有一个是 $m-1$ ，否则这个点取到 $m-1$ 一定会更优。接着至少又有两个点分别与这两个点相连取到 $m-2$ ，然后以此类推，就会发现 $m$ 是 $\mathcal O(\log n)$ 级别的。

最后就能在 $\mathcal O(n\log n)$ 的复杂度解决问题。

```cpp
#include<iostream>
#include<cstdio>
#define ll long long
using namespace std;
int n,m;
ll a[300005];
ll f[300005][25],p[300005][25],s[300005][25];
int tot,to[600005],nxt[600005],lst[300005];
void add(int x,int y){
	to[++tot]=y;
	nxt[tot]=lst[x];
	lst[x]=tot;
	return;
}
ll calc(int x,int j){
	if(j==1) return s[x][j+1];
	if(j==m) return p[x][j-1];
	return min(p[x][j-1],s[x][j+1]);
}
void dfs(int x,int fa){
	int y;
	for(int j=1;j<=m;j+=1) f[x][j]=a[x]*j;
	for(int i=lst[x];i;i=nxt[i]){
		if((y=to[i])==fa) continue; dfs(y,x);
		for(int j=1;j<=m;j+=1) f[x][j]+=calc(y,j);
	}
	p[x][1]=f[x][1]; s[x][m]=f[x][m];
	for(int j=2;j<=m;j+=1){
		p[x][j]=min(p[x][j-1],f[x][j]);
	}
	for(int j=m-1;j>=1;j-=1){
		s[x][j]=min(s[x][j+1],f[x][j]);
	}
	return;
}
void solve(){
	scanf("%d",&n); tot=0;
	for(m=1;(1<<m-1)<n;m+=1);
	for(int i=1;i<=n;i+=1) scanf("%lld",&a[i]);
	for(int i=1;i<=n;i+=1) lst[i]=0;
	for(int i=2;i<=n;i+=1){
		int x,y; scanf("%d%d",&x,&y);
		add(x,y); add(y,x);
	}
	dfs(1,0); printf("%lld\n",p[1][m]);
	return;
}
int main(){
	int t; scanf("%d",&t);
	while(t--) solve();
	return 0;
}
```

Thanks~