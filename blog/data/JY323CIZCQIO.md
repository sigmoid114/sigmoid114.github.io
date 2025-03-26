> 离线维护 SCC ，不像是我能想出的东西

[Link](https://codeforces.com/contest/1989/problem/F)

如果某个点限定了颜色，那么就意味着行和列一定有一个先后顺序，那么行和列之间连一条有向边，表示谁先和后。如果构成了强连通分量，那么这里面的行和列一定都要同时执行；每个强连通分量分开执行显然更优。

然后问题就变成了维护每次加边后的强连通分量。对于一条边如果当前不在强连通分量里，那么在此之前这条边存不存在都没关系；否则，这条边连接的两点在之后一定在同一个强连通分量内。

也就是说，每条边是否有用是有单调性的，这启示我们能用二分。但每次二分都要用到其他边的信息，因此可以采取整体二分的思路。

具体地，假设当前**时间**的区间为 $[l,r]$ ，并且 $l$ 以前的强连通分量已经求出来了，然后就可以对在 $\rm mid$ 时间以前的边跑一遍 Tarjan ，并判断这些边是否在 $\rm mid$ 以前被加入强连通分量。如果是的话就把这些边扔进 $[l,{\rm mid}]$ 的区间内，否则扔到后面。

到了 $l=r$ 的时候，此时所有边都是恰好在这个时刻加入某个强连通分量的，因此只要并查集合并就好了。

复杂度 $\mathcal O(q\log q)$ 。

```cpp
#include<iostream>
#include<cstdio>
#define ll long long
using namespace std;
int n,m,q; ll ans;
struct edge{
	int x,y;
}e[200005];
namespace DSU{
	int fa[400005],siz[400005];
	void init(){
		for(int i=1;i<=n+m;i+=1){
			fa[i]=i; siz[i]=1;
		}
		return;
	}
	int find(int x){
		return fa[x]==x?x:fa[x]=find(fa[x]);
	}
	inline ll calc(int x){
		if(x==1) return 0;
		return 1ll*x*x;
	}
	void merge(int x,int y){
		x=find(x); y=find(y);
		if(x==y) return;
		ans-=calc(siz[x]); ans-=calc(siz[y]);
		ans+=calc(siz[fa[x]=y]+=siz[x]);
		return;
	}
}
namespace SCC{
	int tot,to[200005],nxt[200005],lst[400005];
	int cnt,dfn[400005],low[400005],vi[400005];
	int top,stk[400005],num,col[400005];
	int t,a[200005][2];
	void add(int x,int y){
		to[++tot]=y;
		nxt[tot]=lst[x];
		lst[x]=tot;
		return;
	}
	void init(){
		tot=cnt=top=num=t=0; return;
	}
	void insert(int x,int y){
		lst[x]=dfn[x]=low[x]=col[x]=0;
		lst[y]=dfn[y]=low[y]=col[y]=0;
		a[++t][0]=x; a[t][1]=y;
		return;
	}
	void dfs(int x){
		int y; dfn[x]=low[x]=++cnt; vi[stk[++top]=x]=1;
		for(int i=lst[x];i;i=nxt[i]){
			if(dfn[y=to[i]]){
				if(vi[y]) low[x]=min(low[x],dfn[y]);
			}
			else{
				dfs(y); low[x]=min(low[x],low[y]);
			}
		}
		if(dfn[x]==low[x]){
			col[x]=++num;
			while(stk[top]!=x){
				col[stk[top]]=num;
				vi[stk[top--]]=0;
			}
			vi[stk[top--]]=0;
		}
		return;
	}
	void work(){
		for(int i=1;i<=t;i+=1){
			add(a[i][0],a[i][1]);
		}
		for(int i=1;i<=t;i+=1){
			if(!dfn[a[i][0]]) dfs(a[i][0]);
		}
		return;
	}
	int check(int x,int y){
		return col[x]==col[y];
	}
}
int p[200005],pl[200005],pr[200005];
void solve(int l,int r,int L,int R){
	if(l==r){
		if(l<=q){
			for(int i=L;i<=R;i+=1){
				DSU::merge(e[p[i]].x,e[p[i]].y);
			}
			printf("%lld\n",ans);
		}
		return;
	}
	int mid=l+r>>1; SCC::init();
	for(int i=L;i<=R;i+=1){
		if(p[i]<=mid){
			int x=DSU::find(e[p[i]].x);
			int y=DSU::find(e[p[i]].y);
			SCC::insert(x,y);
		}
	}
	int tl=0,tr=0; SCC::work();
	for(int i=L;i<=R;i+=1){
		if(p[i]<=mid){
			int x=DSU::find(e[p[i]].x);
			int y=DSU::find(e[p[i]].y);
			if(SCC::check(x,y)) pl[++tl]=p[i];
			else pr[++tr]=p[i];
		}
		else pr[++tr]=p[i];
	}
	for(int i=1;i<=tl;i+=1) p[L+i-1]=pl[i];
	for(int i=1;i<=tr;i+=1) p[L+tl+i-1]=pr[i];
	solve(l,mid,L,L+tl-1); solve(mid+1,r,L+tl,R);
	return;
}
void solve(){
	scanf("%d%d%d",&n,&m,&q);
	for(int i=1;i<=q;i+=1){
		int x,y; char s[5]; p[i]=i;
		scanf("%d%d%s",&x,&y,s);
		if(s[0]=='R') e[i]=(edge){x,y+n};
		else e[i]=(edge){y+n,x};
	}
	DSU::init(); solve(1,q+1,1,q);
	return;
}
int main(){
	solve();
	return 0;
}
```

Thanks~