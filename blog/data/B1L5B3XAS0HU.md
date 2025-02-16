> 数据结构专场，最后有一点小细节没处理好，痛失 AK 。
>
> 作为压轴题，只是比上一题难一点，并且两道题都需要再线段树上二分然后再维护一些东西。这题有个比较巧妙的均摊，所以稍稍记一下。

[Link](https://codeforces.com/problemset/problem/2064/F)

首先是一个常规套路，就是枚举这个区间的右端点然后分别计算每个右端点对应的左端点的个数，最后再加起来。

固定右端点之后，往前找分界点，不难想到用单调栈来维护分界点以后最大值的变化情况。右端点加进来之后为栈顶，而当分界点在 `stk[top-1]` 和 `stk[top]` 之间时，右半部分的最大值固定是右端点的值。

考虑从右端点开始不断往左找匹配的值，如果这个匹配的值右边第一个比他小的位置在 `stk[top-1]` 和 `stk[top]` 之间，那么就可以把分界点取在这个位置，从而使得这个匹配的值在分界点往左的一段区间内为最小值，于是这段区间必然都能成为左端点。

于是对于栈中的每一个元素都对应着几段能成为左端点的区间，我们把这些区间并起来就可以了。以上所有过程均能使用主席树+线段树的方法实现。

可以发现每次最多只有一个匹配的值位于 `stk[top-1]` 的左边，然后中间匹配的位置可能有很多。只要在跑单调栈的时候遇到等于的情况不弹出，那么每段区间对应的栈顶的变化一定是严格单调递增的，匹配的数也随着严格单调下降，那么每个数只会被考虑一次，因此复杂度就是 $\mathcal O(n\log n)$ 。

```cpp
#include<iostream>
#include<cstdio>
#include<algorithm>
#include<vector>
#define ll long long
using namespace std;
int n,m; ll ans;
int a[200005],p[200005];
int cnt,ls[4000005],rs[4000005],s[4000005];
int rt[200005];
int stk[200005],top;
vector<int>lf[200005],rg[200005];
int rst[800005],sum[800005];
bool cmp(int x,int y){
	return a[x]<a[y];
}
void build(int k,int l,int r){
	rst[k]=sum[k]=0;
	if(l==r) return;
	int mid=l+r>>1;
	build(k<<1,l,mid); build(k<<1|1,mid+1,r);
	return;
}
void update(int k,int l,int r,int L,int R,int x){
	if(r<L||R<l||L>R) return;
	if(L<=l&&r<=R){
		rst[k]+=x;
		if(rst[k]) sum[k]=r-l+1;
		else if(l==r) sum[k]=0;
		else sum[k]=sum[k<<1]+sum[k<<1|1];
		return;
	}
	int mid=l+r>>1;
	update(k<<1,l,mid,L,R,x); update(k<<1|1,mid+1,r,L,R,x);
	if(rst[k]) sum[k]=r-l+1;
	else sum[k]=sum[k<<1]+sum[k<<1|1];
	return;
}
int insert(int k1,int l,int r,int x){
	int k2=++cnt; s[k2]=s[k1]+1;
	ls[k2]=ls[k1]; rs[k2]=rs[k1];
	if(l==r) return k2;
	int mid=l+r>>1;
	if(x<=mid) ls[k2]=insert(ls[k1],l,mid,x);
	else rs[k2]=insert(rs[k1],mid+1,r,x);
	return k2;
}
int find(int k1,int k2,int l,int r,int R){
	if(s[k1]==s[k2]||R<l) return 0;
	if(l==r) return l;
	int mid=l+r>>1,id;
	if(id=find(rs[k1],rs[k2],mid+1,r,R)) return id;
	return find(ls[k1],ls[k2],l,mid,R);
}
int find1(int k1,int k2,int l,int r,int L){
	if(s[k1]==s[k2]||r<L) return n+1;
	if(l==r) return l;
	int mid=l+r>>1,id;
	if((id=find1(ls[k1],ls[k2],l,mid,L))<=n) return id;
	return find1(rs[k1],rs[k2],mid+1,r,L);
}
void solve(){
	scanf("%d%d",&n,&m);
	ans=0ll; top=0; build(1,1,n);
	while(cnt){
		ls[cnt]=rs[cnt]=0;
		s[cnt--]=0;
	}
	for(int i=1;i<=n;i+=1){
		scanf("%d",&a[i]); p[i]=i;
	}
	sort(p+1,p+n+1,cmp);
	for(int i=1,j=1;i<=n;i+=1){
		rt[i]=rt[i-1];
		while(j<=n&&a[p[j]]==i){
			rt[i]=insert(rt[i],1,n,p[j]);
			j+=1;
		}
	}
	for(int i=1;i<=n;i+=1){
		while(top&&a[i]>a[stk[top]]){
			int x=stk[top--],k=rg[x].size();
			for(int j=0;j<k;j+=1){
				update(1,1,n,lf[x][j],rg[x][j],-1);
			}
		}
		stk[++top]=i; rg[i].resize(0); lf[i].resize(0);
		if(a[i]<m&&m-a[i]<=n){
			int x=find(rt[m-a[i]],rt[m-a[i]-1],1,n,i-1),y;
			while(x&&find1(rt[m-a[i]-1],rt[0],1,n,x+1)>stk[top-1]){
				y=find(rt[m-a[i]-1],rt[0],1,n,x-1);
				rg[i].push_back(x); lf[i].push_back(y+1);
				update(1,1,n,y+1,x,1);
				x=find(rt[m-a[i]],rt[m-a[i]-1],1,n,y-1);
			}
		}
		ans+=sum[1];
	}
	printf("%lld\n",ans);
	return;
}
int main(){
	int t; scanf("%d",&t);
	while(t--) solve();
	return 0;
}
```

Thanks~