> 赛时直接冲 F2 去了，结果做法是错的，甚至不能过 F1 ……
>
> 过了若干天才想出正解，鉴定为好题。

[Link](https://codeforces.com/problemset/problem/2107/F2)

首先考虑一种策略，就是把前面某个 $a_i$ 交换到 $n$ 的位置，然后每次再把这个 $a_i$ 往前交换，直到某个 $j$ 换成前面的某个数 $a_k$ 。

那么就能想到有 $j<i$ ，不然的话由于 $n-i+j-k\ge n-k$，而且肯定有 $a_k$ 更小，这样不如直接把 $a_k$ 换到 $n$ 的位置。

假设 $f_i$ 表示某个前缀的答案，那么就有：

$$
f_n=n-i+a_i+(n-j-1)(a_i+1)=n(a_i+2)+f_j-(a_i+1)j-i-1
$$

并且有 $0\le j<i\le n$ 。

对于每个 $i$ ，最优的 $j$ 显然是固定的，只要使得 $f_j-(a_i+1)j$ 最小就行。这部分就是维护一堆直线的凸包，由于斜率的单调性，可以采用单调栈。

这样 $i$ 对于后面位置的贡献就是一条直线了，直接李超树。

```cpp
#include<iostream>
#include<cstdio>
#define db double
#define ll long long
#define inf 1145141145141919810
using namespace std;
int n;
int a[1000005];
int stk[1000005],top;
ll f[1000005];
namespace T{
	int A[4000005]; ll B[4000005];
	void build(int k,int l,int r){
		A[k]=0; B[k]=inf;
		if(l==r) return;
		int mid=l+r>>1;
		build(k<<1,l,mid); build(k<<1|1,mid+1,r);
		return;
	}
	void update(int k,int l,int r,int a,ll b){
		if(l==r){
			if(1ll*a*l+b<1ll*A[k]*l+B[k]){
				A[k]=a; B[k]=b;
			}
			return;
		}
		int mid=l+r>>1;
		if(1ll*a*mid+b<1ll*A[k]*mid+B[k]){
			swap(a,A[k]); swap(b,B[k]);
		}
		if(A[k]<a) update(k<<1,l,mid,a,b);
		else update(k<<1|1,mid+1,r,a,b);
		return;
	}
	ll query(int k,int l,int r,int x){
		ll res=1ll*A[k]*x+B[k];
		if(l==r) return res;
		int mid=l+r>>1;
		if(x<=mid) res=min(res,query(k<<1,l,mid,x));
		else res=min(res,query(k<<1|1,mid+1,r,x));
		return res;
	}
}
db slp(int i,int j){
	return 1.0*(f[j]-f[i])/(j-i);
}
int find(int x){
	int l=0,r=top,mid;
	while(l<r){
		mid=l+r+1>>1;
		if(slp(stk[mid-1],stk[mid])<=x) l=mid;
		else r=mid-1;
	}
	return stk[l];
}
void solve(){
	scanf("%d",&n); T::build(1,1,n); top=0;
	for(int i=1;i<=n;i+=1) scanf("%d",&a[i]);
	for(int i=1;i<=n;i+=1){
		int j=find(a[i]+1);
		ll now=f[j]-1ll*(a[i]+1)*j-i-1;
		T::update(1,1,n,a[i]+2,now);
		f[i]=T::query(1,1,n,i);
		while(top&&slp(stk[top],i)<=slp(stk[top-1],stk[top])) top-=1;
		stk[++top]=i;
	}
	printf("%lld\n",f[n]);
	return;
}
int main(){
	int t; scanf("%d",&t);
	while(t--) solve();
	return 0;
}
```

Thanks~