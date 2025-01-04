> 考完高代：我有抑郁症
> 独立做出紫构造：我治好了我的抑郁症

CF 的定数 $2100$ 有些低了，洛谷上是紫的，但这是一道神题我懂得欣赏。

首先二进制的 $1$ 的个数变化有些杂乱无章，但题目中的区间 $(n,2n]$ 似乎又提示着什么。我们发现把 $n$ 往后移一位，我们在失去了一个 $n+1$ 的同时又同时获得了一个 $2(n+1)$ ，这两个数二进制下的 $1$ 的个数是一样的。

也就是说，对于一个固定的 $k$ ，二进制中 $1$ 的个数为 $k$ 的数的数量是随 $n$ 单调不减的，所以上二分查找。现在我们只需要对固定的 $n,k$ 寻找 $m$ 就好了，不难想到数位 dp。

```cpp
#include<iostream>
#include<cstdio>
#include<cstring>
#define ll long long
#define ans f[bt][lmt][cnt]
using namespace std;
ll m; int k;
ll num;
ll f[64][2][65];
ll solve(int bt,int lmt,int cnt){
	if(cnt<0) return 0ll;
	if(bt==-1&&cnt==0) return 1ll;
	if(~ans) return ans;
	else ans=0;
	for(int i=0;i<=(lmt?(num>>bt&1):1);i+=1){
		ans+=solve(bt-1,lmt&&(i==(num>>bt&1)),cnt-i);
	}
	return ans;
}
ll check(ll lmt){
	num=lmt<<1; memset(f,-1,sizeof(f));
	ll res=solve(63,1,k);
	num=lmt; memset(f,-1,sizeof(f));
	res-=solve(63,1,k);
	return res;
}
int main(){
	scanf("%lld%d",&m,&k);
	ll l=1,r=1e18,mid;
	while(l<r){
		mid=l+r>>1;
		if(check(mid)>=m) r=mid;
		else l=mid+1;
	}
	printf("%lld\n",l);
	return 0;
}
```

Thanks~