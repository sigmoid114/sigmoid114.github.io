> 这个转换是人能想到的？

[Link](https://codeforces.com/contest/1528/problem/F)

先不管 $b$ 的限制，考虑单纯只有 $a$ 的话要怎么做。

原本 $a$ 的限制条件并不是很好做，但是有如下等价的转换：考虑 $n+1$ 个座位围成一个圈，然后有 $n$ 个人要坐进来，第 $i$ 个人会从第 $a_i$ 个座位开始往右寻找第一个空座位并坐下。然后如果最后空出来的座位编号是 $n+1$ 的话那就等价于满足原本的条件了。

很显然每个位置空出来的方案数是一样的，因此只考虑 $a$ 的答案就是 $\dfrac{(n+1)^n}{n+1}=(n+1)^{n-1}$ 。

接下来考虑加上 $b$ 。 $b$ 就相当于选一个数 $x$ ，然后往 $x$ 出现在 $a$ 的所有位置里面挑就行了。而这个 $x$ 总共有 $n+1$ 种不同的选择，所以刚好能把要除的 $n+1$ 抵消掉。枚举 $x$ 出现的次数 $i$ ，于是就能得到最终答案的表达式

$$
\sum_{i=1}^n{n\choose i}n^{n-i}i^k
$$

然后观察到 $i^k$ 这一项 $i$ 比较大 $k$ 比较小，可以试着转换成下降幂

$$
\begin{aligned}
&\sum_{i=1}^n{n\choose i}n^{n-i}i^k\\\\
=&\sum_{i=1}^n{n\choose i}n^{n-i}\sum_{j=0}^k{k\brace j}{i\choose j}j!\\\\
=&\sum_{j=0}^k{k\brace j}j!\sum_{i=j}^n{n\choose i}{i\choose j}n^{n-i}\\\\
=&\sum_{j=0}^k{k\brace j}j!{n\choose j}\sum_{i=j}^n{n-j\choose i-j}n^{n-i}\\\\
=&\sum_{j=0}^k{k\brace j}j!{n\choose j}(n+1)^{n-j}
\end{aligned}
$$

然后卷积求一下第二类斯特林数就行了，复杂度 $\mathcal O(k\log k)$ 。

```cpp
#include<iostream>
#include<cstdio>
#include<vector>
#define mod 998244353
#define poly vector<int>
using namespace std;
int G[2];
int n,m,ans; poly f,g;
int inv[100005],fac[100005],invfac[100005];
inline int add(int x,int y){
	if((x+=y)>=mod) x-=mod;
	return x;
}
inline int sub(int x,int y){
	if((x-=y)<0) x+=mod;
	return x;
}
inline int qp(int x,int y=mod-2){
	int res=1;
	while(y){
		if(y&1) res=1ll*res*x%mod;
		x=1ll*x*x%mod; y>>=1;
	}
	return res;
}
void NTT(poly &a,int n){
	int x,y,w,wn;
	for(int i=(n>>1);i;i>>=1){
		wn=qp(G[0],(mod-1)/(i<<1));
		for(int j=0;j<n;j+=(i<<1)){
			w=1;
			for(int k=j;k<i+j;k+=1){
				x=a[k]; y=a[k+i];
				a[k]=add(x,y);
				a[k+i]=1ll*sub(x,y)*w%mod;
				w=1ll*w*wn%mod;
			}
		}
	}
	return;
}
void INTT(poly &a,int n){
	int x,y,w,wn;
	for(int i=1;i<n;i<<=1){
		wn=qp(G[1],(mod-1)/(i<<1));
		for(int j=0;j<n;j+=(i<<1)){
			w=1;
			for(int k=j;k<i+j;k+=1){
				x=a[k]; y=1ll*a[k+i]*w%mod;
				a[k]=add(x,y);
				a[k+i]=sub(x,y);
				w=1ll*w*wn%mod;
			}
		}
	}
	x=qp(n);
	for(int i=0;i<n;i+=1) a[i]=1ll*a[i]*x%mod;
	return;
}
poly operator*(poly x,poly y){
	int n=1,m=x.size()+y.size()-1;
	while(n<m) n<<=1;
	x.resize(n); y.resize(n);
	NTT(x,n); NTT(y,n);
	for(int i=0;i<n;i+=1) x[i]=1ll*x[i]*y[i]%mod;
	INTT(x,n); x.resize(m);
	return x;
}
void init(){
	G[0]=114514; G[1]=qp(G[0]);
	fac[0]=invfac[0]=inv[1]=fac[1]=invfac[1]=1;
	for(int i=2;i<=m;i+=1){
		inv[i]=1ll*inv[mod%i]*(mod-mod/i)%mod;
		fac[i]=1ll*fac[i-1]*i%mod;
		invfac[i]=1ll*invfac[i-1]*inv[i]%mod;
	}
	return;
}
void solve(){
	scanf("%d%d",&n,&m); init();
	f.resize(m+1); g.resize(m+1);
	for(int i=0;i<=m;i+=1){
		if(i&1) f[i]=sub(0,invfac[i]);
		else f[i]=invfac[i];
		g[i]=1ll*qp(i,m)*invfac[i]%mod;
	}
	int now=1; f=f*g;
	for(int i=0;i<=m&&i<=n;i+=1){
		int res=1ll*f[i]*qp(n+1,n-i)%mod;
		ans=add(ans,1ll*res*now%mod);
		now=1ll*now*(n-i)%mod;
	}
	printf("%d\n",ans);
	return;
}
int main(){
	solve();
	return 0;
}
```

Thanks~