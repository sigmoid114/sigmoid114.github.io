> 小趣事：在高铁上无聊 vp 了一下，前六题全部一发通过。当时因为十分害怕构造不敢打，所以我差点成飞升批了。

[Link](https://codeforces.com/problemset/problem/2053/F)

首先证明一个小结论：同一行填同一个数。

**证明：**假设除了某一行之外其他地方都填好了，除了未填的位置外其他地方的贡献都算好了。然后在一个位置上填上一个数 $x$ 相当于加上相邻两行 $x$ 出现的次数。选择填出现次数最多的 $x$ 一定是最优的，所以这行全部填上 $x$ 。

然后我们逐行填数，假设第 $i$ 行填 $x$ 增加的贡献最多为 $f_{i,x}$ ，并将相邻两行 $x$ 出现次数记作 $g_{i,x}$ ，当前行未填个数记作 $c_i$ ，那么就有

$$
f_{i,x}=c_ig_{i,x}+\max\left(f_{i-1,x}+c_ic_{i-1},\max_{y\not=x}f_{i-1,y}\right)
$$

然后我们发现 $c_ic_{i-1}\ge0$ 所以可以把 $y\not=x$ 的条件去掉。

现在就相当于在所有 $x$ 的位置加上 $c_ic_{i-1}$ 然后和 $\max_yf_{i-1,y}$ 取 $\max$ ，最后再在所有 $x$ 的位置加上 $c_ig_{i,x}$ 。由于 $g_{i,x}$ 最多只在 $2m$ 个 $x$ 不等于 $0$ ，所以最多只有 $2m$ 个位置需要单点加。

线段树秒了，复杂度 $\mathcal O((n+k)\log k)$ 。

```cpp
#include<iostream>
#include<cstdio>
#include<algorithm>
#include<vector>
#define ll long long
using namespace std;
int n,m,N; ll ans;
vector<int>a[200005];
int c[200005];
namespace DS{
	ll mx[2400005],tag1[2400005],tag2[2400005];
	void build(int k,int l,int r){
		mx[k]=tag1[k]=tag2[k]=0ll;
		if(l==r) return;
		int mid=l+r>>1;
		build(k<<1,l,mid);
		build(k<<1|1,mid+1,r);
		return;
	}
	void mtag(int k,ll t1,ll t2){
		mx[k]=max(mx[k]+t1,t2);
		tag1[k]+=t1;
		tag2[k]=max(tag2[k]+t1,t2);
		return;
	}
	void pushdown(int k){
		mtag(k<<1,tag1[k],tag2[k]);
		mtag(k<<1|1,tag1[k],tag2[k]);
		tag1[k]=tag2[k]=0ll;
		return;
	}
	void add(int k,int l,int r,int x,ll y){
		if(l==r){
			mtag(k,y,0); return;
		}
		int mid=l+r>>1; pushdown(k);
		if(x<=mid) add(k<<1,l,mid,x,y);
		else add(k<<1|1,mid+1,r,x,y);
		mx[k]=max(mx[k<<1],mx[k<<1|1]);
		return;
	}
}
void solve(){
	scanf("%d%d%d",&n,&m,&N); ans=0ll;
	for(int i=1;i<=n;i+=1){
		a[i].resize(m+1); c[i]=0;
		a[i][0]=-2;
		for(int j=1;j<=m;j+=1){
			scanf("%d",&a[i][j]);
			if(a[i][j]==-1) c[i]+=1;
		}
		sort(a[i].begin(),a[i].end());
	}
	for(int i=1;i<n;i+=1){
		for(int l=1,r=0,j=1;l<=m&&j<=m;l=r+1){
			while(r<m){
				if(a[i+1][r+1]==a[i+1][l]) r+=1;
				else break;
			}
			if(a[i+1][l]==-1) continue;
			while(j<=m){
				if(a[i][j]<a[i+1][l]) j+=1;
				else if(a[i][j]==a[i+1][l]) ans+=1ll*(r-l+1),j+=1;
				else break;
			}
		}
	}
	DS::build(1,1,N);
	for(int i=1;i<=n;i+=1){
		DS::mtag(1,1ll*c[i]*c[i-1],DS::mx[1]);
		if(i>1){
			for(int l=1,r=0;l<=m;l=r+1){
				while(r<m){
					if(a[i-1][r+1]==a[i-1][l]) r+=1;
					else break;
				}
				if(a[i-1][l]==-1) continue;
				DS::add(1,1,N,a[i-1][l],1ll*c[i]*(r-l+1));
			}
		}
		if(i<n){
			for(int l=1,r=0;l<=m;l=r+1){
				while(r<m){
					if(a[i+1][r+1]==a[i+1][l]) r+=1;
					else break;
				}
				if(a[i+1][l]==-1) continue;
				DS::add(1,1,N,a[i+1][l],1ll*c[i]*(r-l+1));
			}
		}
	}
	ans+=DS::mx[1]; printf("%lld\n",ans);
	return;
}
int main(){
	int t; scanf("%d",&t);
	while(t--) solve();
	return 0;
}
```

Thanks~