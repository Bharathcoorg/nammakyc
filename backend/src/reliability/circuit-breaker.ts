export type CircuitState="closed"|"open"|"half-open";

export class CircuitBreaker {
  private state:CircuitState="closed";
  private failures=0;
  private openedAt=0;
  private halfOpenProbeInFlight=false;

  constructor(private readonly threshold=5,private readonly resetMs=30000){}

  canExecute(now=Date.now()):boolean{
    if(this.state==="open"){
      if(now-this.openedAt<this.resetMs) return false;
      this.state="half-open";
      this.halfOpenProbeInFlight=false;
    }
    if(this.state==="half-open"){
      if(this.halfOpenProbeInFlight) return false;
      this.halfOpenProbeInFlight=true;
      return true;
    }
    return true;
  }

  recordSuccess(){
    this.failures=0;
    this.state="closed";
    this.halfOpenProbeInFlight=false;
  }

  recordFailure(now=Date.now()){
    this.halfOpenProbeInFlight=false;
    this.failures++;
    if(this.state==="half-open"||this.failures>=this.threshold){
      this.state="open";
      this.openedAt=now;
    }
  }

  getState(){return this.state}
}