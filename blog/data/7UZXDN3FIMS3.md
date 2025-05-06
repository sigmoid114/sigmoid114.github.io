> 非常困难题目

[Link](https://codeforces.com/problemset/problem/1861/F)

很显然对于每个人，能拿的牌的总数是固定的，记作 $r_i$ 。

首先枚举第 $i$ 个人的第 $j$ 种牌的数目最多，那么具体的牌数则是能取就取，即 $\min(r_i,b_j)$ 。因为每次把第 $i$ 个人另一种牌换成 $j$ ，会使得最大值 $+1$ ，而同时最多只会让另一个人的最大值变化一，答案一定不会减少。

假设其他人的最大值在 $k$ 以内，如果某个 $k$ 是合法的，那么 $k+1$ 一定也是合法的，所以我们考虑二分这个 $k$ 。考虑网络流，建图如下（先把第 $i$ 个人要拿的第 $j$ 种牌拿走）：
1. $S$ 向每种牌 $j$ 连边，容量为 $b_j$ ；
2. 每种牌向除了 $i$ 以外的每个人 $i'$ 连边，容量为 $k-a_{i',j}$ ；
3. 每个人向 $T$ 连边，容量为 $r_{i'}$ 。
当最大流等于 $\sum r_{i'}$ 时就是合法的。

然而我们当然不能每次都把图建出来跑一遍最大流，于是我们考虑有什么别的办法把最大流算出来。

根据经典结论我们相当于要计算最小割。先把 $S$ 连的一些边删掉，假设删掉的边连向的花色的集合为 $A$ ，那么对于 $i'$ ，要么把 $r_{i'}$ 断开，要么把不在 $A$ 中的花色与他相连的边全部断开，也就是说当前方案的取值为：

$$
\sum_{j\in A}b_j+\sum_{i'}\min\left(r_{i'},\sum_{j\not\in A}b_{i',j}\right)
$$

左边的部分可以每次二分时计算，右边预处理出所有人的然后再减去 $i$ 的。注意到每个人对于同一个 $A$ 的贡献都是一段一次函数和一段常数，所以可以用二阶差分预处理。

复杂度为 $\mathcal O(16\cdot2^4\cdot n\log V+2^4\cdot V)$ 。

```cpp
#include<iostream>
#include<cstdio>
#define inf 1145141919
using namespace std;
int n,m,v;
int a[50005][4],b[4];
int r[50005],sr;
int f[1<<4][2000005];
int pc[1<<4];
int pre[50005],suf[50005];
void init(){
	for(int i=1;i<=n;i+=1){
		for(int j=0;j<4;j+=1){
			v=max(v,a[i][j]+b[j]);
			r[i]+=a[i][j];
			pre[i]=max(pre[i],a[i][j]);
		}
		suf[i]=pre[i]; sr+=(r[i]=m/n-r[i]);
		pre[i]=max(pre[i],pre[i-1]);
	}
	for(int i=n;i>=1;i-=1) suf[i]=max(suf[i],suf[i+1]);
	for(int s=0;s<(1<<4);s+=1){
		pc[s]=pc[s>>1]+(s&1);
		if(pc[s]==4) break;
		for(int i=1;i<=n;i+=1){
			int k,sa=0,d;
			for(int j=0;j<4;j+=1){
				if(s>>j&1) continue;
				sa+=a[i][j];
			}
			k=(r[i]+sa)/(4-pc[s]);
			d=r[i]-k*(4-pc[s])+sa;
			f[s][0]-=sa;
			f[s][1]+=4-pc[s]+sa;
			f[s][k+1]+=d-4+pc[s];
			f[s][k+2]-=d;
		}
		for(int i=1;i<=v;i+=1) f[s][i]+=f[s][i-1];
		for(int i=1;i<=v;i+=1) f[s][i]+=f[s][i-1];
		/*printf("!!%d\n",s);
		for(int i=0;i<=v;i+=1) printf("%d ",f[s][i]);
		printf("\n");*/
	}
	return;
}
void work(){
	for(int i=1;i<=n;i+=1){
		int ans=0;
		for(int j=0;j<4;j+=1){
			int d=min(b[j],r[i]);
			int L=max(pre[i-1],suf[i+1]),R=a[i][j]+d,mid;
			while(L<R){
				int mn=inf; mid=L+R>>1;
				for(int s=0;s<(1<<4);s+=1){
					int sum=0,now=0;
					for(int k=0;k<4;k+=1){
						if(s>>k&1) sum+=b[k]-(j==k)*d;
						else now+=mid-a[i][k];
					}
					mn=min(mn,sum-min(now,r[i])+f[s][mid]);
				}
				if(mn==sr-r[i]) R=mid;
				else L=mid+1;
			}
			ans=max(ans,a[i][j]+d-L);
		}
		printf("%d ",ans);
	}
	printf("\n");
	return;
}
void solve(){
	scanf("%d",&n); m=0;
	for(int i=1;i<=n;i+=1){
		for(int j=0;j<4;j+=1){
			scanf("%d",&a[i][j]); m+=a[i][j];
		}
	}
	for(int i=0;i<4;i+=1){
		scanf("%d",&b[i]); m+=b[i];
	}
	init(); work();
	return;
}
int main(){
	solve();
	return 0;
}
```

Thanks~