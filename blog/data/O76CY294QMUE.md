> 一种和正解完全不同的解法。

[Link](https://codeforces.com/contest/2043/problem/F)

题目等价于求区间内保留最少的数（至少一个），且所有数异或和为零的的方案数。

考虑一种朴素的 dp 思路：设 $f_{i,j,s}$ 表示前 $i$ 个数中保留了 $j$ 个数，并且保留的数异或为 $s$ 的方案数。转移的话只要考虑当前的数选不选就好了，单次转移的复杂度为 $\mathcal O(64n)$ 。

选择了一个数，相当于把这个数放入线性基当中。考虑线性基的过程，当一个数不能被放入，那么就意味着已经能使异或和为零了；否则放入 $6$ 轮之后，线性基就已经满了，那么下一个数就能使异或和为零。也就是说，我们只要考虑最多选 $7$ 个数的情况就行，那么转移的复杂度变成了 $\mathcal O(64\times 7)$ 。

总不可能每次询问都从 $l$ 到 $r$ 跑一次 dp，于是我们就自然想到要维护一个数据结构。再此之前，我们还需要快速合并两个 dp 数组。由于他是一维异或，另一维求和，所以不难想到用类似于子集卷积的方法来快速合并，复杂度为 $\mathcal O(64\times7\times7)$ 。

但是我们发现这个合并的复杂度是高于转移复杂度的，所以我们要使得这种合并的操作尽可能的少。所以可以考虑用一种类似于点分治的方法，把每个询问打到最短的包含整个询问的区间，然后每个区间维护分别从中间往左和往右的 dp 数组。这样每次询问合并一次就行了。

为了省空间可以离线。最终的复杂度就是 $\mathcal O(64\times 7n\log n+64\times7\times7 q)$ 。

注意一些小细节，就比如可能方案数刚好被模数整除之类的。

```cpp
#include<iostream>
#include<cstdio>
#include<vector>
#define mod 998244353
#define inv2 499122177
using namespace std;
int n,q;
int a[100005];
struct sth{
	int l,r;
}p[100005];
int ans[100005][2];
int f[50005][1<<6][8],g[50005][1<<6][8];
int vf[50005][1<<6][8],vg[50005][1<<6][8];
vector<int>b[400005];
int f1[8][1<<6],f2[8][1<<6],f3[8][1<<6];
int g1[8][1<<6],g2[8][1<<6],g3[8][1<<6];
inline int add(int x,int y){
	if((x+=y)>=mod) x-=mod;
	return x;
}
inline int sub(int x,int y){
	if((x-=y)<0) x+=mod;
	return x;
}
void ins(int k,int l,int r,int L,int R,int id){
	if(r<L||R<l||L>R) return;
	int mid=l+r>>1;
	if(L<=mid+1&&mid<=R){
		b[k].push_back(id);
		return;
	}
	ins(k<<1,l,mid,L,R,id);
	ins(k<<1|1,mid+1,r,L,R,id);
	return;
}
void FWT(int *f){
	int x,y;
	for(int i=1;i<64;i<<=1){
		for(int j=0;j<64;j+=(i<<1)){
			for(int k=j;k<i+j;k+=1){
				x=f[k]; y=f[k+i];
				f[k]=add(x,y);
				f[k+i]=sub(x,y);
			}
		}
	}
	return;
}
void IFWT(int *f){
	int x,y;
	for(int i=1;i<64;i<<=1){
		for(int j=0;j<64;j+=(i<<1)){
			for(int k=j;k<i+j;k+=1){
				x=f[k]; y=f[k+i];
				f[k]=1ll*add(x,y)*inv2%mod;
				f[k+i]=1ll*sub(x,y)*inv2%mod;
			}
		}
	}
	return;
}
void work(int k,int l,int r){
	int t=b[k].size();
	int mid=l+r>>1;
	if(t){
		f[0][0][0]=g[0][0][0]=1;
		vf[0][0][0]=vg[0][0][0]=1;
		for(int i=mid;i>=l;i-=1){
			int x=mid-i+1;
			for(int s=0;s<64;s+=1){
				for(int j=0;j<8;j+=1){
					f[x][s][j]=f[x-1][s][j];
					vf[x][s][j]=vf[x-1][s][j];
				}
			}
			for(int s=0;s<64;s+=1){
				for(int j=1;j<8;j+=1){
					f[x][s][j]=add(f[x][s][j],f[x-1][s^a[i]][j-1]);
					vf[x][s][j]|=vf[x-1][s^a[i]][j-1];
				}
			}
		}
		for(int i=mid+1;i<=r;i+=1){
			int x=i-mid;
			for(int s=0;s<64;s+=1){
				for(int j=0;j<8;j+=1){
					g[x][s][j]=g[x-1][s][j];
					vg[x][s][j]=vg[x-1][s][j];
				}
			}
			for(int s=0;s<64;s+=1){
				for(int j=1;j<8;j+=1){
					g[x][s][j]=add(g[x][s][j],g[x-1][s^a[i]][j-1]);
					vg[x][s][j]|=vg[x-1][s^a[i]][j-1];
				}
			}
		}
		for(int i=0;i<t;i+=1){
			int x=b[k][i],L=mid-p[x].l+1,R=p[x].r-mid;
			for(int s=0;s<64;s+=1){
				for(int j=0;j<8;j+=1){
					f1[j][s]=f[L][s][j];
					f2[j][s]=g[R][s][j];
					g1[j][s]=vf[L][s][j];
					g2[j][s]=vg[R][s][j];
					f3[j][s]=g3[j][s]=0;
				}
			}
			for(int j=0;j<8;j+=1){
				FWT(f1[j]); FWT(f2[j]); FWT(g1[j]); FWT(g2[j]);
			}
			for(int i1=0;i1<8;i1+=1){
				for(int i2=0;i1+i2<8;i2+=1){
					if(!i1&&!i2) continue;
					for(int s=0;s<64;s+=1){
						f3[i1+i2][s]=add(f3[i1+i2][s],1ll*f1[i1][s]*f2[i2][s]%mod);
						g3[i1+i2][s]=add(g3[i1+i2][s],1ll*g1[i1][s]*g2[i2][s]%mod);
					}
				}
			}
			ans[x][0]=-1;
			for(int j=1;j<8;j+=1){
				IFWT(f3[j]); IFWT(g3[j]);
				if(f3[j][0]||g3[j][0]){
					ans[x][0]=(p[x].r-p[x].l+1-j);
					ans[x][1]=f3[j][0]; break;
				}
			}
		}
	}
	if(l==r) return;
	work(k<<1,l,mid); work(k<<1|1,mid+1,r);
	return;
}
void solve(){
	scanf("%d%d",&n,&q);
	for(int i=1;i<=n;i+=1) scanf("%d",&a[i]);
	for(int i=1;i<=q;i+=1){
		scanf("%d%d",&p[i].l,&p[i].r);
		ins(1,1,n,p[i].l,p[i].r,i);
	}
	work(1,1,n);
	for(int i=1;i<=q;i+=1){
		if(~ans[i][0]) printf("%d %d\n",ans[i][0],ans[i][1]);
		else printf("-1\n");
	}
	return;
}
int main(){
	solve();
	return 0;
}
```

Thanks~