export type CircuitState="closed"|"open"|"half-open";
export class CircuitBreaker{
 private state:CircuitState="closed";private failures=0;private openedAt=0;
 constructor(private readonly threshold=5,private readonly resetMs=30000){}
 canExecute(now=Date.now()){if(this.state==="open"&&now-this.openedAt>=this.resetMs){this.state="half-open";return true}return this.state!=="open"}
 recordSuccess(){this.failures=0;this.state="closed"}
 recordFailure(now=Date.now()){this.failures++;if(this.failures>=this.threshold){this.state="open";this.openedAt=now}}
 getState(){return this.state}
}
