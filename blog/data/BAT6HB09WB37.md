> 为什么我的解法总是跟别人不一样。

[Link](https://codeforces.com/problemset/problem/1574/F)

首先的话，如果一个 $A$ 里面有两个相同的数字，那么显然 $A$ 是不可能出现的。而如果 $A$ 中的某个数字出现了，那必须整个 $A$ 都完整出现。

然后 $A$ 中的某个数字可能会导致另外一个数组也要完整出现。所以就相当于有一些不同的 $A$ 拼接起来组成一段连续出现的数。

我们枚举开头的数字。如果开头的数字在某些 $A$ 的中间位置出现，那么这个数字肯定不能作为开头。然后我们找到以这个数字作为开头的某个 $A$ 并顺着 $A$ 往后枚举数字。

假设当前的数字为 $x$ ，考虑所有包含 $x$ 的 $A'$ 。如果 $A'$ 第一次出现，那么 $x$ 一定要作为 $A'$ 的开头，不然这说明 $A'$ 的 $x$ 前面与当前的串拼接不起来。然后我们判断 $A'$ 能不能拼接就好了。这里可以把所有 $A$ 连起来然后跑后缀数组求 lcp 。

假设能拼接起来，如果 $A'$ 的长度大于 $A$ 的剩余长度，那我们把 $A$ 换成 $A'$ 然后继续往后枚举 $x$ 。

还有一种情况，就是 $A'$ 在当前考虑的数字段第一次出现，但它在之前出现过，那么说明拼接 $A'$ 肯定得拼接之前那个不合法的数字段，所以这种情况也是不合法的。

可以证明，只要每个 $x$ 在任何一个 $A$ 中出现最多一次，那么一个连续数字段中每个 $A$ 最多也只会被考虑一次，否则的话当前考虑的数字段一定会在枚举到第一个重复出现的位置之前判断出非法。所以就能在 $\mathcal O(\sum c\log\sum c)$ 求出所有连续段的长度。

求出长度之后，考虑 dp 就是枚举所有长度以前的位置并且求和，于是就想到了用卷积优化。设 $F(x)$ 为一个多项式，其中第 $k$ 项系数为长度为 $k$ 的数字段的个数，然后 $G(x)$ 表示答案的多项式，那么根据 dp 的转移就是 $G(x)F(x)=G(x)-1$ ，也就是说 $G(x)=\dfrac1{1-F(x)}$ 。

```cpp
#include<iostream>
#include<cstdio>
#include<vector>
#define mod 998244353
#define poly vector<int>
using namespace std;
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
namespace Poly{
	int G[2];
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
	poly pinv(poly f,int n){
		poly g;
		if(n==1){
			g.push_back(qp(f[0]));
			return g;
		}
		g=pinv(f,n+1>>1);
		f.resize(n); f=f*g; f.resize(n);
		for(int i=0;i<n;i+=1) f[i]=sub(0,f[i]);
		f[0]=add(f[0],2); g=g*f; g.resize(n);
		return g;
	}
	void init(){
		G[0]=114514; G[1]=qp(G[0]);
		return;
	}
}
const int N=300000;
int s[N+5];
namespace SA{
	int n,sa[N*2+5],rnk[N*2+5],cnt[N*2+5];
	int a[N*2+5],b[N*2+5],h[N+5];
	int lg[N+5],p[N+5];
	int f[N+5][25];
	void init(int m){
		for(int i=0;i<=m;i+=1) cnt[i]=0;
		for(int i=1;i<=n;i+=1) cnt[rnk[i]=s[i]]+=1;
		for(int i=1;i<=m;i+=1) cnt[i]+=cnt[i-1];
		for(int i=n;i>=1;i-=1) sa[cnt[rnk[i]]--]=i;
		for(int j=1;j<=n;j<<=1){
			for(int i=0;i<=m;i+=1) cnt[i]=0;
			for(int i=1;i<=n;i+=1) cnt[b[i]=rnk[i+j]]+=1;
			for(int i=1;i<=m;i+=1) cnt[i]+=cnt[i-1];
			for(int i=n;i>=1;i-=1) a[cnt[b[sa[i]]]--]=sa[i];
			for(int i=0;i<=m;i+=1) cnt[i]=0;
			for(int i=1;i<=n;i+=1) cnt[b[i]=rnk[i]]+=1;
			for(int i=1;i<=m;i+=1) cnt[i]+=cnt[i-1];
			for(int i=n;i>=1;i-=1) sa[cnt[b[a[i]]]--]=a[i];
			m=0;
			for(int i=1;i<=n;i+=1){
				if(b[sa[i]]!=b[sa[i-1]]||b[sa[i]+j]!=b[sa[i-1]+j]) m+=1;
				rnk[sa[i]]=m;
			}
			if(n==m) break;
		}
		for(int i=1;i<=n;i+=1){
			h[rnk[i]]=max(h[rnk[i-1]]-1,0);
			while(s[i+h[rnk[i]]]==s[sa[rnk[i]-1]+h[rnk[i]]]) h[rnk[i]]+=1;
		}
		return;
	}
	void work(int m){
		init(m);
		for(int i=1;i<=n;i+=1) p[i]=rnk[i];
		for(int i=1;i<=n;i+=1) f[i][0]=h[i];
		for(int i=2;i<=n;i+=1) lg[i]=lg[i>>1]+1;
		for(int j=1;j<=lg[n];j+=1){
			for(int i=1;i+(1<<j)-1<=n;i+=1){
				f[i][j]=min(f[i][j-1],f[i+(1<<j-1)][j-1]);
			}
		}
		return;
	}
	int lcp(int x,int y){
		if(x==y) return n-x+1;
		int l=p[x],r=p[y];
		if(l>r) swap(l,r);
		int k=lg[r-(l++)];
		return min(f[l][k],f[r-(1<<k)+1][k]);
	}
}
int n,m,k;
int c[300005],p[300005];
int a[300005];
int ban[300005],vi[300005],cnt;
vector<int>oc[300005];
poly f;
void solve(){
	scanf("%d%d%d",&n,&m,&k);
	f.resize(m+1); f[0]=1;
	for(int i=1;i<=n;i+=1){
		scanf("%d",&c[i]); p[i+1]=p[i]+c[i];
		for(int j=1;j<=c[i];j+=1){
			int x; scanf("%d",&x);
			s[p[i]+j]=x;
			if(j>1) ban[x]=1;
			else a[i]=x;
			oc[x].push_back(i);
		}
	}
	SA::n=p[n+1]; SA::work(k);
	for(int i=1;i<=k;i+=1){
		if(ban[i]) continue;
		int len=0,x=i,y=0,ni=0,nj=1; cnt+=1;
		while(1){
			int flag=1;
			for(int j=0;j<oc[x].size();j+=1){
				if(j&&oc[x][j]==oc[x][j-1]){
					flag=0; break;
				}
				if(vi[oc[x][j]]){
					if(vi[oc[x][j]]==cnt) continue;
					else{
						flag=0; break;
					}
				}
				vi[oc[x][j]]=cnt;
				if(x!=a[oc[x][j]]){
					flag=0; break;
				}
				if(ni){
					if(SA::lcp(p[ni]+nj,p[oc[x][j]]+1)<min(c[ni]-nj+1,c[oc[x][j]])){
						flag=0; break;
					}
					if(c[ni]-nj<c[oc[x][j]]-1) ni=oc[x][j],nj=1;
				}
				else ni=oc[x][j],nj=1;
			}
			if(!flag){
				len=0; break;
			}
			len+=1;
			if((++nj)>c[ni]) break;
			x=s[p[ni]+nj];
		}
		if(!len) continue;
		f[len]=sub(f[len],1);
	}
	Poly::init(); f=Poly::pinv(f,m+1);
	printf("%d\n",f[m]);
	return;
}
int main(){
	solve();
	return 0;
}
```

Thanks~