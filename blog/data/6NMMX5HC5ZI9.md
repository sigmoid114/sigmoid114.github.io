> 结论全猜对了

[Link](https://codeforces.com/problemset/problem/1845/F)

两个人速度 $v_1>v_2$ ，那么他们相遇就有两种情况：

- 方向相反。则 $(v_1+v_2)t=2kl$ 。
- 方向相同。则 $(v_1-v_2)t=2kl$ 。

那么现在所有的 $t$ 就满足 $k\dfrac{2l}p$ 的形式。

对于同一个 $p$ ，碰面次数就是 $\dfrac{pt}{2l}$ 。显然不同的两个 $p$ 会在某些 $k$ 处同时相遇。于是就有猜想第一个结论，即所有这些时刻满足 $k\dfrac{2l}{\gcd(p_1,p_2)}$ 。

我们只要算出每个位置的容斥系数就能算出最后的结果。根据上面的结论，奇数个 $p$  的 $\gcd$ 的位置会 $+1$ ，而偶数个 $p$ 的 $\gcd$ 的位置会 $-1$ 。

仿照 $\gcd$ 计数的做法，我们将所有位置的容斥系数累加到它的因数的地方，然后就可以发现，似乎每个位置变成了：选奇数个它倍数的数的方案数，减去选偶数个它倍数的数的方案数（猜的），也就是有数是它倍数就是 $1$ ,否则就是 $0$ 。

然后关于如何求出所有的 $p$ ，我只能想到用多项式了。

然后 $p$ 的值域是 $\mathcal O(V)$ ，所以就可以 $\mathcal O(V\log V)$ 了。

```cpp
#include<iostream>
#include<cstdio>
#include<vector>
#include<algorithm>
#define poly vector<int>
using namespace std;
const int mod=1000000007;
int l,t; int n,m,ans;
int a[200005];
poly f;
namespace Poly{
	const int mod=998244353;
	int G[2];
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
	poly operator/(poly x,poly y){
		int n=x.size(),m=y.size();
		reverse(y.begin(),y.end()); x=x*y;
		for(int i=0;i<n;i+=1) x[i]=x[i+m-1];
		x.resize(n); return x;
	}
	void work(poly &f){
		G[0]=114514; G[1]=qp(G[0]);
		poly g=f,h=f/f; f=f*f;
		for(int i=0;i<g.size();i+=1){
			f[i<<1]=sub(f[i<<1],g[i]);
		}
		for(int i=0;i<h.size();i+=1){
			f[i]=add(f[i],h[i]);
		}
		return;
	}
}
inline void add(int &x,int y){
	if((x+=y)>=mod) x-=mod;
	return;
}
inline void sub(int &x,int y){
	if((x-=y)<0) x+=mod;
	return;
}
void solve(){
	scanf("%d%d",&l,&t); scanf("%d",&n);
	for(int i=1;i<=n;i+=1){
		scanf("%d",&a[i]); m=max(m,a[i]);
	}
	f.resize(m+1);
	for(int i=1;i<=n;i+=1) f[a[i]]=1;
	Poly::work(f); m=f.size()-1;
	for(int i=1;i<=m;i+=1) f[i]=(f[i]>0);
	for(int i=1;i<=m;i+=1){
		for(int j=i+i;j<=m;j+=i) f[i]+=f[j];
	}
	for(int i=1;i<=m;i+=1) f[i]=(f[i]>0);
	for(int i=m;i>=1;i-=1){
		for(int j=i+i;j<=m;j+=i) sub(f[i],f[j]);
	}
	for(int i=1;i<=m;i+=1){
		int cnt=1ll*t*i/2/l%mod;
		add(ans,1ll*cnt*f[i]%mod);
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