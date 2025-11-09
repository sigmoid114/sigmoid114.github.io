> 学到了，狠狠记录

[Link](https://codeforces.com/contest/1389/problem/F)

有一种做法是根据当前最右边同色连通块的范围 dp ，然后线段树维护，不够优雅。

考虑如果两个线段是 *bad* 的，就给他们之间连上一条边，然后由于一定是不同色的区间之间有连边，所以形成一张二分图。

我们要求的就是二分图的最大独立集，也就是总点数 $n$ 减去最大匹配。

直接跑网络流是过不去的，但求出最大匹配的方法可以贪。对于一个匹配，因为是在右端点更靠右的线段那里找到的，所以按右端点升序重排。现在有一个新的线段，很显然找到一个右端点最靠左的异色线段和它匹配是优的。

其实这种贪法还有另一种解释，那就是如果当前线段和之前某个线段不能放一起，那么也就是说这两个线段最多只选一个，可以看成这两个线段“抵消”了，答案就要 $-1$ 。选右端点最靠左的线段，是为了防止后面某个线段应该“抵消”掉当前被“抵消”的线段，然后当前线段其实应该“抵消”更前面的线段的情况。

用两个 `multiset` 维护就行了，复杂度 $\mathcal O(n\log n)$ 。

```cpp
#include<iostream>
#include<cstdio>
#include<algorithm>
#include<set>
using namespace std;
multiset<int>s[2];
int n,ans;
int l[200005],r[200005],c[200005];
int p[200005];
bool cmp(int i,int j){
	return r[i]<r[j];
}
void solve(){
	scanf("%d",&n); ans=n;
	for(int i=1;i<=n;i+=1){
		scanf("%d%d%d",&l[i],&r[i],&c[i]);
		c[i]-=1; p[i]=i;
	}
	sort(p+1,p+n+1,cmp);
	for(int k=1,i=p[k];k<=n;i=p[++k]){
		auto it=s[c[i]^1].lower_bound(l[i]);
		if(it==s[c[i]^1].end()){
			s[c[i]].insert(r[i]);
		}
		else{
			ans-=1; s[c[i]^1].erase(it);
		}
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