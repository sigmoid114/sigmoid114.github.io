> 重要的是无论我们选择哪条路，都要担负起选择的责任。  ——蜂蜜与四叶草

[Link](https://codeforces.com/contest/1363/problem/F)

一次 rotate 操作就是把一个字符移动到前面某个位置，其它字符相对位置保持不变。在最优策略下，一个字符最多只用被移动到前面一次。称不被移动到前面的字符为**不动的**（不过它有可能被移动到后面）。

求最小代价的话，其实可以求出最大的不动的字符的个数，最后用 $|s|$ 减去它。

不动的字符相对的位置关系一定是保持不变的，也就是说最后 $s$ 中不动的字符构成的子序列，必然也是 $t$ 中的某个子序列。

假设某个不动的 $s_i$ 对应 $t_j$ ，由于 $s_i$ 只能通过它后面的字符移动到它前面达到后移的效果，所以有个限制就是 $i\le j$ 。

但只有这个限制并不能保证 $s_i$ 最后能到达 $t_j$ 的位置。把 $s_i$ 后面恰好 $j-i$ 个字符移动到前面之后，需要让 $s_i$ 后面字符构成的可重集，等于 $t_i$ 后面字符构成的可重集。把那些移动到前面的字符塞回到后面，另一个限制就是前者要包含后者了。

于是就可以愉快的 dp 了。限制是一个后缀，所以可以从后往前（其实限制前缀从前往后也可以）。设 $f_{i,j}$ 为考虑完 $t_{i\dots n}$ 和 $s_{j\dots n}$ 的最大不动字符的个数。

考虑从 $f_{i+1,j}$ 转移到 $f_{i,*}$ ，按 $t_i$ 是否对应不动的字符分成两类。
1. $t_i$ 对应不动的字符。找到最大的 $k<j$ 使得 $s_k=t_i$ ，然后 $f_{i,k}\leftarrow f_{i+1,j}+1$ 。至于为什么是最大的 $k$ ，因为这样能给后面留下更多的选择，所以是不劣的。
1. $t_i$ 对应被移动到前面的字符，同理找到最大的 $k\le j$ 满足字符可重集的限制，然后 $f_{i,k}\leftarrow f_{i+1,j}$ 。

找 $k$ 是可以预处理的。复杂度 $\mathcal O(|s|^2)$ 。

```cpp
#include<iostream>
#include<cstdio>
using namespace std;
int n;
int c[26];
char s[2005],t[2005];
int lst[2005],p[2005][26];
int lmt[2005];
int f[2005][2005];
int check(){
	for(int i=0;i<26;i+=1){
		if(c[i]<0) return 0;
	}
	return 1;
}
void solve(){
	scanf("%d",&n);
	scanf("%s%s",s+1,t+1);
	for(int i=0;i<26;i+=1) c[i]=0;
	for(int i=1;i<=n;i+=1){
		c[s[i]-'a']+=1; c[t[i]-'a']-=1;
	}
	for(int i=0;i<26;i+=1){
		if(c[i]){
			printf("-1\n"); return;
		}
	}
	for(int j=0;j<26;j+=1) lst[j]=0;
	for(int i=1;i<=n+1;i+=1){
		for(int j=0;j<26;j+=1) p[i][j]=lst[j];
		if(i<=n) lst[s[i]-'a']=i;
	}
	for(int i=0;i<26;i+=1) c[i]=0;
	for(int i=n,j=n+1;i>=1;i-=1){
		c[t[i]-'a']-=1;
		while(!check()) c[s[--j]-'a']+=1;
		lmt[i]=j;
	}
	lmt[n+1]=n+1;
	for(int i=1;i<=n+1;i+=1){
		for(int j=1;j<=n+1;j+=1) f[i][j]=0;
	}
	for(int i=n;i>=1;i-=1){
		for(int j=lmt[i+1];j>=1;j-=1){
			int k=p[j][t[i]-'a'];
			if(k) f[i][k]=max(f[i][k],f[i+1][j]+1);
			k=min(j,lmt[i]);
			f[i][k]=max(f[i][k],f[i+1][j]);
		}
	}
	printf("%d\n",n-f[1][1]);
	return;
}
int main(){
	int t; scanf("%d",&t);
	while(t--) solve();
	return 0;
}
```

Thanks~