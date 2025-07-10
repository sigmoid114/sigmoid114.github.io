> 第 $114514$ 次结束之后发现问题，只能说下次一定。
>
> 差的最后一点是用 $-1$ 表示无穷大但是更新最终答案的时候忘记特判 $-1$ 了，警钟长鸣。

[Link](https://codeforces.com/problemset/problem/1519/F)

假设现在 Alice 已经决定好要上哪些锁了，然后 Bob 要怎么做使得收益最大。这很显然是一个最大权闭合子图的模型。

具体地，从源点向每个箱子连一条流量为 $a$ 的边，然后从每个锁向汇点连流量为 $b$ 的边。然后如果给第 $i$ 个箱子上了第 $j$ 把锁，就在它们之间连流量无限的边。如果跑出来的最大流大于等于所有 $a$ 的和，那么说明这种情况下 Alice 会赢的。

当然我们不能真的枚举 Alice 的每一种方案然后跑网络流。注意到数据范围中仅仅和网络流有关的范围都非常小，所以可以猜测网络流的状态数一定不会多，然后整体做法就是一个类似于 dp 套 dp 的东西。

先考虑如何把常规的网络流跑法改成 dp 。注意到这是一个二分图比较特殊，所以我们可以依次加入每个箱子，然后考虑它的所有流量会流向那些锁。由于 $a,b\le 4,m\le 6$ ，所以流向哪些锁的方案数非常少。然后这时候自然而然想到把所有锁剩余的流量用五进制数表示，因此总共最多只有 $5^6-1$ 种不同的状态。

除了锁流量剩余状态以外，还要记录一下已经流了多少流量（或者还差多少流量能超过 $a$ 的和）。

最后就可以愉快地 dp 了。

复杂度就是一堆东西乘起来，实际上远远跑不满，反正就能过。

```cpp
#include<iostream>
#include<cstdio>
#include<cstring>
#include<vector>
using namespace std;
int n,m;
int a[7],b[7];
int p[7],sa,sb;
int c[10][10];
int f[7][25][15625],ans;
vector<int>sta[5];
inline void updt(int &x,int y){
	if(!(~x)||x>y) x=y;
	return;
}
void solve(){
	scanf("%d%d",&n,&m); p[0]=1; ans=-1;
	for(int i=1;i<m;i+=1) p[i]=p[i-1]*5;
	for(int i=0;i<n;i+=1) scanf("%d",&a[i]),sa+=a[i];
	for(int i=0;i<m;i+=1) scanf("%d",&b[i]),sb+=b[i]*p[i];
	for(int i=0;i<n;i+=1){
		for(int j=0;j<m;j+=1) scanf("%d",&c[i][j]);
	}
	for(int s=0;s<=sb;s+=1){
		int t=0;
		for(int i=0;i<m;i+=1){
			t+=s/p[i]%5;
		}
		if(t>4) continue;
		sta[t].push_back(s);
	}
	memset(f,-1,sizeof(f)); f[0][sa][sb]=0;
	for(int i=0;i<n;i+=1){
		for(int r=0;r<=sa;r+=1){
			for(int s=0;s<=sb;s+=1){
				if(!(~f[i][r][s])) continue;
				for(int j=0;j<=a[i];j+=1){
					for(int k=0;k<sta[j].size();k+=1){
						int w=0;
						for(int l=0;l<m;l+=1){
							int x=sta[j][k]/p[l]%5;
							int y=s/p[l]%5;
							if(x>y){
								w=-1; break;
							}
							if(x) w+=c[i][l];
						}
						if(~w) updt(f[i+1][max(0,r-j)][s-sta[j][k]],f[i][r][s]+w);
					}
				}
			}
		}
	}
	for(int s=0;s<=sb;s+=1){
		if(~f[n][0][s]) updt(ans,f[n][0][s]);
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