> 神秘结论题

[Link](https://codeforces.com/problemset/problem/2108/F)

结论题当然要先说结论：如果存在某种推倒方案使得第 $i$ 个位置最终为 $x_i$ ，那么一定存在另一种推倒方案，使得对于 $y_i\le x_i$ 都能被得到。

考虑从前往后构造这种新的方案，如果前 $i-1$ 个位置已经固定了，接下来就是要把 $i$ 放在 $1\sim i-1$ 构成的排列的某个位置。我们发现 $i$ 放得越后面最后出来的 $y_i$ 会越小，而后面影响到的位置范围也越大。所以这样后面每个位置 $j$ 被影响到的次数一定能保证得到 $x_j$ ，因此 $y_j$ 也能被得到。

于是对于一个可以得到的 ${\rm MEX}$ ，比它更小的也一定可以，并且一定能构造出形如 $0,0,\cdots,0,1,2,\cdots, {\rm MEX}-1$ 的结果。

于是我们二分这个 ${\rm MEX}$ ，然后从前往后判断一遍每个位置行不行就好了。

可以用差分使复杂度达到 $\mathcal O(n\log n)$ 。

```cpp
#include<iostream>
#include<cstdio>
using namespace std;
int n;
int a[100005];
int c[100005];
int check(int m){
	for(int i=1;i<=n;i+=1) c[i]=0;
	for(int i=1;i<=n;i+=1){
		c[i]+=c[i-1];
		int b=max(0,m-1-n+i);
		if(c[i]<b) return 0;
		c[i+1]+=1;
		c[min(i+c[i]+a[i]-b,n)+1]-=1;
	}
	return 1;
}
void solve(){
	scanf("%d",&n);
	for(int i=1;i<=n;i+=1){
		scanf("%d",&a[i]);
	}
	int l=1,r=n,mid;
	while(l<r){
		mid=l+r+1>>1;
		if(check(mid)) l=mid;
		else r=mid-1;
	}
	printf("%d\n",l);
	return;
}
int main(){
	int t; scanf("%d",&t);
	while(t--) solve();
	return 0;
}
```

Thanks~