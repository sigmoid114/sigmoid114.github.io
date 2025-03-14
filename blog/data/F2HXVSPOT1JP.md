> 近期打得最烂的一场 vp ， D 题有个小细节没想到，然后 E 题不知道为什么也想不出来。
>
> 躺在床上突发奇想找到了一个 E 的解法，然后在梦里把 E1 E2 都切了。第二天也是成功复刻梦里的情景。
>
> 所以这场虽然只有 3 题，但实际上我有 ak 的实力 qwq 。

[Link](https://codeforces.com/contest/1998/problem/E2)

对于一个像保留到最后的点，显然最优的做法是让它不断往左往右扩展，然后就能得到一个必要条件：对于每一个包含这个点的区间，都能向外扩展。

然后不难发现，这个条件也是充分的！于是我们可以找到所有不能扩展的区间，然后给区间中的点删掉就行了。删点不难用数据结构维护。

我们考虑现在已经得到了 $[1,i-1]$ 的结果，然后现在加入 $a_i$ 并求出 $[1,i]$ 的结果。

然后不能扩展又分三种情况。第一种是左端到头的，这种就直接判断是否有 $s_{i-1}<a_i$ 。

第二种是两面包夹。这种情况以为着区间的右端点已经被确定了，然后考虑左端点的个数。不难发现，只要往左碰到一个过不去的点，然后继续往左考虑时和就被翻倍了，也就是说，最多只有 $\mathcal O(\log m)$ 个这样的区间，其中 $m$ 为所有 $a_i$ 的最大值。于是只要不断往左找然后找到满足区间和 $<a_i$ 的最大区间就好了。

最后一种是右端到头，此时类似于上一种情况，只是少了右端的约束。注意这种情况并不能直接继承到 $i+1$ ，所以不能真的把这个区间的点删掉，而只需要求区间左端点的左边有多少没被删除的点就好了。

提交的代码全部都用线段树维护了，复杂度是 $\mathcal O(n\log m\log n)$ 。但其实并不需要线段树，因为你发现 $i-1$ 不能成为左端点的 $i$ 也必然不行，因此理论上能做到 $\mathcal O(n\log m)$ 。

```cpp
#include<iostream>
#include<cstdio>
#define ll long long
using namespace std;
int n,m,ans;
int a[200005];
ll s[200005];
namespace T1{
	ll mn[800005],tag[800005];
	void build(int k,int l,int r){
		mn[k]=tag[k]=0;
		if(l==r) return;
		int mid=l+r>>1;
		build(k<<1,l,mid);
		build(k<<1|1,mid+1,r);
		return;
	}
	void mtag(int k,ll x){
		mn[k]+=x; tag[k]+=x;
		return;
	}
	void pushdown(int k){
		if(tag[k]){
			mtag(k<<1,tag[k]);
			mtag(k<<1|1,tag[k]);
			tag[k]=0;
		}
		return;
	}
	void insert(int k,int l,int r,int x,ll y){
		if(l==r){
			mn[k]=y; return;
		}
		int mid=l+r>>1; pushdown(k);
		if(x<=mid) insert(k<<1,l,mid,x,y);
		else insert(k<<1|1,mid+1,r,x,y);
		mn[k]=min(mn[k<<1],mn[k<<1|1]);
		return;
	}
	void update(int k,int l,int r,int L,int R,ll x){
		if(r<L||R<l||L>R) return;
		if(L<=l&&r<=R) return mtag(k,x);
		int mid=l+r>>1; pushdown(k);
		update(k<<1,l,mid,L,R,x);
		update(k<<1|1,mid+1,r,L,R,x);
		mn[k]=min(mn[k<<1],mn[k<<1|1]);
		return;
	}
	int find(int k,int l,int r,int R){
		if(R<l||mn[k]>=0) return 0;
		if(l==r) return l;
		int mid=l+r>>1,id; pushdown(k);
		if(id=find(k<<1|1,mid+1,r,R)) return id;
		return find(k<<1,l,mid,R);
	}
}
namespace T2{
	int sum[800005],tag[800005];
	void build(int k,int l,int r){
		sum[k]=r-l+1; tag[k]=0;
		if(l==r) return;
		int mid=l+r>>1;
		build(k<<1,l,mid);
		build(k<<1|1,mid+1,r);
		return;
	}
	void update(int k,int l,int r,int L,int R){
		if(r<L||R<l||L>R||tag[k]) return;
		//if(k==1) printf("[%d,%d]\n",L,R);
		if(L<=l&&r<=R){
			tag[k]=1; sum[k]=0;
			return;
		}
		int mid=l+r>>1;
		update(k<<1,l,mid,L,R);
		update(k<<1|1,mid+1,r,L,R);
		sum[k]=sum[k<<1]+sum[k<<1|1];
		return;
	}
	int query(int k,int l,int r,int L,int R){
		if(r<L||R<l||L>R||tag[k]) return 0;
		if(L<=l&&r<=R) return sum[k];
		int mid=l+r>>1;
		return query(k<<1,l,mid,L,R)+query(k<<1|1,mid+1,r,L,R);
	}
}
void solve(){
	scanf("%d%d",&n,&m);
	T1::build(1,1,n); T2::build(1,1,n);
	for(int i=1,j,k;i<=n;i+=1){
		scanf("%d",&a[i]); s[i]=s[i-1]+a[i];
		if(s[i-1]<a[i]) T2::update(1,1,n,1,i-1);
		for(j=T1::find(1,1,n,i-2),k=0;j;j=T1::find(1,1,n,j-1)){
			if(s[i-1]-s[j]<a[i]) k=j+1;
		}
		if(k) T2::update(1,1,n,k,i-1);
		T1::insert(1,1,n,i,-a[i]); T1::update(1,1,n,1,i-1,a[i]);
		for(j=T1::find(1,1,n,i-1),k=i;j;k=j,j=T1::find(1,1,n,j-1));
		if(i>=m) printf("%d ",T2::query(1,1,n,1,k));
	}
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