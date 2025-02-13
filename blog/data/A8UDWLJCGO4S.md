> duel 的时候偶然遇到的 B 题，结果两人都不会，最后我靠 CD 赢下了比赛。
>
> 不难但是挺巧妙的一道题。

[Link](https://codeforces.com/problemset/problem/1770/C)

首先如果有两个数一样的话，那么无论加多少这两个数都是不互质的，所以直接输出 `NO` 。

如果存在两个数 $x,y$ ，加上 $k$ 之后不互质，则 $g=\gcd(x+k,y+k)>1$，那么必然有 $x\equiv y \pmod g$ 。那也就是说，如果存在一个可能的 $g$ ，将所有数按照除以 $g$ 的余数分类后，每个种类至少有 $2$ 个数，那么无论加上什么都总有一对数不互质，因此也是无解的。很显然只要枚举 $2\le g\le \left\lfloor\frac n2\right\rfloor$ 就行了。

那么剩下情况是否都是有解的呢？答案是肯定的。不难发现我们只要考虑为质数的 $g$ ，然后对于每个 $g$ 选取少于 $2$ 个数的余数，然后根据中国剩余定理就可以构造出这样一个 $k$ 。

```cpp
#include<iostream>
#include<cstdio>
#define ll long long
using namespace std;
int n; ll a[105];
int cnt[105];
void solve(){
	scanf("%d",&n);
	for(int i=1;i<=n;i+=1) scanf("%lld",&a[i]);
	for(int i=1;i<=n;i+=1){
		for(int j=1;j<i;j+=1){
			if(a[i]==a[j]){
				printf("NO\n");
				return;
			}
		}
	}
	for(int p=2;p<=n/2;p+=1){
		for(int i=0;i<p;i+=1) cnt[i]=0;
		for(int i=1;i<=n;i+=1) cnt[a[i]%p]+=1;
		int flag=0;
		for(int i=0;i<p;i+=1){
			if(cnt[i]<2) flag=1;
		}
		if(!flag){
			printf("NO\n");
			return;
		}
	}
	printf("YES\n");
	return;
}
int main(){
	int t; scanf("%d",&t);
	while(t--) solve();
	return 0;
}
```

Thanks~