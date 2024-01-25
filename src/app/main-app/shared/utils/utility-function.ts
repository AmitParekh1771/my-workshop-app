export default class Utils {


    static cyclicIterator(iterator: number, size: number, step: number = 1) {
      iterator = iterator + step;
      
      if(step == 0)
        return iterator;
      if(step > 0)
        iterator = iterator >= size ? 0 : iterator;
      else if(step < 0)
        iterator = iterator < 0 ? size-1 : iterator;

      return iterator;
    }


    static isSubsequence(a: string, b: string) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      let m = a.length, n = b.length;
      if(m<n || m==0 || n==0)
        return false;
      let i=0, j=0;
      for( ; i<m ; i++) {
        if(a[i] == b[j])
          ++j;
        if(j==n)
          return true;
      }
      return false;
    }


    static editDistance(a: string = '', b: string = ''): number {
      a = a.toLowerCase();
      b = b.toLowerCase();

      let m = a.length, n = b.length;

      if(m==0)
        return n;
      else if(n==0)
        return m;

      let dp = new Array(m+1);
      let i=0, j=0;

      for(i=0 ; i<=m ; ++i) {
        dp[i] = new Array(n+1);
      }

      for(i=0 ; i<=m ; ++i) {
        for(j=0 ; j<=n ; ++j) {
          if(i == 0) 
            dp[i][j] = j;
          else if(j == 0) 
            dp[i][j] = i;
          else if(a[i-1] == b[j-1])
            dp[i][j] = dp[i-1][j-1];
          else {
            dp[i][j] = 1 + this.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);
          }
        }
      }

      return dp[m][n];
    }

    static min(a: number, b: number, c: number) {
      return a>b ? (b>c ? c : b) : (a>c ? c : a);
    }
      
    static pad(num: number, size: number) {
      let numStr = num.toString();
      while (numStr.length < size) numStr = "0" + numStr;
      return numStr;
    }

    static timeLeft(from: Date, to: Date) {
      let res: {
        days: number,
        hours: number,
        minutes: number,
        seconds: number
      } | null = null;
      let timeDiff: number = Math.floor((to.valueOf() - from.valueOf()) / 1000);
      if(timeDiff <= 0)
        return res;
      res = {
        days: Math.floor(timeDiff / (24*60*60)),
        hours: Math.floor(timeDiff / (60*60)) % 24,
        minutes: Math.floor(timeDiff / 60) % 60,
        seconds: timeDiff % 60
      }
      return res;
    }

    static selectElement(
      item: HTMLElement | null, 
      selectFn: (arg: HTMLElement) => boolean
    ): HTMLElement | null {
      if(!item) return null;
      else if(selectFn(item)) return item;
      return this.selectElement(item.parentElement, selectFn)
    }

    static twoArrayIntersection<T>(arr1: T[], arr2: T[], index: (item: T) => string | number) {
      let res: T[] = [];
      const m = arr1.length, n = arr2.length;
      let indexIncluded: (string | number)[] = [];
      let i=0, j=0;

      for(let k=0 ; k<m+n ; ++k) {
        if(i < m) {
          res.push(arr1[i]);
          indexIncluded.push(index(arr1[i]));
          i++;
          continue;
        }
        if(!indexIncluded.includes(index(arr2[j]))) {
          res.push(arr2[j]);
          indexIncluded.push(index(arr2[j]));
        }
        j++;
      }
      
      return res;
    }
  
}