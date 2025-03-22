> 以后要是再让我遇到拼接合法多边形的题，我第一件事就是想想有什么 $\log$ 级别的结论。

[Link](https://codeforces.com/contest/1990/problem/F)

对于某个区间上的询问，考虑在这个区间上建出大根笛卡尔树。对于笛卡尔树上的一个点取遍它的子树一定是最优的，因此维护一下子树和。

如果某节点不能得出一个合法的多边形，那么这个节点的的值一定至少为子树和的两倍，那么它的子节点的值最大是这个节点的一半；否则这个节点代表的区间一定比子树节点的区间大，我们就不用再递归下去。

因此，这样建出的笛卡尔树的深度是 $\mathcal O(\log V)$ 级别的。这样的笛卡尔树我们完全可以把它当成 treap 来看待。

那么原问题中我们只要建立线段树，并维护每个区间的笛卡尔树就行了。复杂度 $\mathcal O(n\log n\log V)$ 。

```cpp
#include<iostream>
#include<cstdio>
#define ll long long
using namespace std;
int n,q;
ll a[200005];
int cnt,ls[14000005],rs[14000005];
ll mx[14000005],s[14000005];
int ans[14000005],siz[14000005];
int rt[800005];
int merge(int x,int y){
	if(!x||!y) return (x|y);
	int z=++cnt;
	mx[z]=max(mx[x],mx[y]);
	s[z]=s[x]+s[y];
	siz[z]=siz[x]+siz[y];
	if(mx[z]*2<s[z]){
		ans[z]=siz[z];
		return z;
	}
	if(mx[x]>mx[y]){
		ls[z]=ls[x];
		rs[z]=merge(rs[x],y);
	}
	else{
		ls[z]=merge(x,ls[y]);
		rs[z]=rs[y];
	}
	ans[z]=max(ans[ls[z]],ans[rs[z]]);
	return z;
}
int newnode(ll x){
	int k=++cnt; mx[k]=s[k]=x;
	siz[k]=1; ans[k]=-1;
	return k;
}
void build(int k,int l,int r){
	if(l==r){
		rt[k]=newnode(a[l]);
		return;
	}
	int mid=l+r>>1;
	build(k<<1,l,mid); build(k<<1|1,mid+1,r);
	rt[k]=merge(rt[k<<1],rt[k<<1|1]);
	return;
}
void modify(int k,int l,int r,int x,ll y){
	if(l==r){
		rt[k]=newnode(y); return;
	}
	int mid=l+r>>1;
	if(x<=mid) modify(k<<1,l,mid,x,y);
	else modify(k<<1|1,mid+1,r,x,y);
	rt[k]=merge(rt[k<<1],rt[k<<1|1]);
	return;
}
int query(int k,int l,int r,int L,int R){
	if(r<L||R<l||L>R) return 0;
	if(L<=l&&r<=R) return rt[k];
	int mid=l+r>>1;
	return merge(query(k<<1,l,mid,L,R),query(k<<1|1,mid+1,r,L,R));
}
void solve(){
	while(cnt){
		ls[cnt]=rs[cnt]=siz[cnt]=ans[cnt]=0;
		mx[cnt]=s[cnt]=0ll; cnt-=1;
	}
	scanf("%d%d",&n,&q); ans[0]=-1;
	for(int i=1;i<=n;i+=1) scanf("%lld",&a[i]);
	build(1,1,n);
	while(q--){
		int opt; scanf("%d",&opt);
		if(opt==1){
			int l,r; scanf("%d%d",&l,&r);
			printf("%d\n",ans[query(1,1,n,l,r)]);
		}
		else{
			int i; ll x; scanf("%d%lld",&i,&x);
			modify(1,1,n,i,x);
		}
	}
	return;
}
int main(){
	int t; scanf("%d",&t);
	while(t--) solve();
	return 0;
}
```

Thanks~