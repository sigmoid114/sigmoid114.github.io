> 可能是因为最近遇到和 $\log$ 有关的结论比较多，所以不知道为什么就想出来了。
>
> 可惜的是少考虑了出现相等的数的情况。

[Link](https://codeforces.com/contest/1983/problem/F)

枚举所有的 $j$ 并考虑哪些 $i$ 能够被计入答案。对于 $i_1<i_2<j$ 如果有 $a_{i_1}\oplus a_j$ 与 $a_{i_2}\oplus a_j$ 的二进制最高位相同，那么 $a_{i_1}\oplus a_{i_2}$ 一定是比二者都要小的，也就是说如果选 $i_1,j$ 的话一定不如选 $i_1,i_2$ 优。

这也就是说，对于每个 $a_i\oplus a_j$ 最高位相同的 $i$ 我们只用考虑最右边的就行了，这部分字典树秒了。然后就得到了 $\mathcal O(n\log V)$ 个数对。

接下来我们将这些数对按异或从小到大排序，然后加入所有包含这个数对且没被加入的区间。这相当于平面上每次对一个矩形染色，然后维护有色点的数量，这部分不难用数据结构维护。

复杂度 $\mathcal O(n\log n\log V)$ 。

```cpp
#include<iostream>
#include<cstdio>
#include<algorithm>
#include<set>
#define ll long long
using namespace std;
int n,m; ll rk;
int a[100005];
int cnt,ch[3100005][2],mx[3100005];
int R[100005];
set<int>s;
set<int>::iterator it;
struct sth{
	int l,r,x;
}p[3100005];
bool operator<(sth u,sth v){
	return u.x<v.x;
}
int stk[100005],top;
ll query(int l,int r){
	int x=l; it=s.lower_bound(l);
	if(R[*it]<=r) return 0ll;
	ll res=0ll; R[l]=R[*it];
	while(R[l]>=r){
		res+=1ll*(l-(*(--it)))*(R[l]-r); R[l]=r;
		if(R[l=*it]>=r) stk[++top]=l;
	}
	while(top) s.erase(stk[top--]);
	s.insert(x);
	return res;
}
void solve(){
	while(cnt){
		ch[cnt][0]=ch[cnt][1]=0;
		mx[cnt--]=0;
	}
	scanf("%d%lld",&n,&rk);
	m=0; cnt=1;
	for(int i=1;i<=n;i+=1) scanf("%d",&a[i]);
	for(int i=1;i<=n;i+=1){
		int k=1;
		for(int j=29;j>=0;j-=1){
			int c=(a[i]>>j&1),t;
			if(t=mx[ch[k][c^1]]){
				p[++m]=(sth){t,i,a[i]^a[t]};
			}
			if(!ch[k][c]) ch[k][c]=++cnt;
			k=ch[k][c];
			if(!j&&(t=mx[k])){
				p[++m]=(sth){t,i,a[i]^a[t]};
			}
			mx[k]=i;
		}
	}
	sort(p+1,p+m+1); s.clear();
	s.insert(0); s.insert(n);
	for(int i=1;i<=n;i+=1) R[i]=n+1;
	for(int i=1;i<=m;i+=1){
		if((rk-=query(p[i].l,p[i].r))<=0){
			printf("%d\n",p[i].x);
			break;
		}
	}
	return;
}
int main(){
	int t; scanf("%d",&t);
	while(t--) solve();
	return 0;
}
```

Thanks~