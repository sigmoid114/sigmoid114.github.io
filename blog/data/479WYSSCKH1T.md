> 让我看看这场 jiangly 掉大分的 div1 是怎么回事。

[Link](https://codeforces.com/contest/1580/problem/C)

每种有的车是否需要维护具有周期性，而周期长的时候周期数就少了，因此可以往根号分治那边想。

当 $T=x+y\le B$ 时， 对 $T$ 取模后为 $y$ 种不同余数的时间答案会 $+1$ ，因此直接维护 $B$ 种周期下所有余数的答案。修改时直接枚举 $y$ 种余数，查询时枚举 $B$ 种周期，这部分复杂度 $\mathcal O(B)$ 。

当 $T>B$ 时，就变成了 $\mathcal O\left(\dfrac mB\right)$ 段区间加。这部分可以直接用差分前缀和来搞，而不需要其它数据结构。

取 $B=\sqrt m$ ，复杂度就是 $\mathcal O((n+m)\sqrt m)$ 。

```cpp
#include<iostream>
#include<cstdio>
using namespace std;
const int B=450;
int n,m;
int p[200005],q[200005];
int s[200005],lst[200005];
int t[B+5][B+5];
void solve(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=n;i+=1){
		scanf("%d%d",&p[i],&q[i]);
	}
	for(int i=1;i<=m;i+=1){
		int o,k; scanf("%d%d",&o,&k);
		if(p[k]+q[k]>B){
			if(o==1){
				for(int j=i+p[k];j<=m;j+=(p[k]+q[k])){
					s[j]+=1;
					if(j+q[k]<=m) s[j+q[k]]-=1;
				}
				lst[k]=i;
			}
			else{
				for(int j=lst[k]+p[k];j<=m;j+=(p[k]+q[k])){
					if(j+q[k]<i) continue;
					if(j<i) s[i]-=1;
					else s[j]-=1;
					if(j+q[k]<=m) s[j+q[k]]+=1;
				}
			}
		}
		else{
			if(o==1){
				for(int j=i+p[k];j<i+p[k]+q[k];j+=1){
					t[p[k]+q[k]][j%(p[k]+q[k])]+=1;
				}
				lst[k]=i;
			}
			else{
				for(int j=lst[k]+p[k];j<lst[k]+p[k]+q[k];j+=1){
					t[p[k]+q[k]][j%(p[k]+q[k])]-=1;
				}
			}
		}
		int ans=(s[i]+=s[i-1]);
		for(int j=1;j<=B;j+=1) ans+=t[j][i%j];
		printf("%d\n",ans);
	}
	return;
}
int main(){
	solve();
	return 0;
}
```

Thanks~