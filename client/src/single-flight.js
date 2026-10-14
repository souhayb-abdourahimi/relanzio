export function createSingleFlight(){
  let active=false;
  return {
    get active(){return active},
    async run(task){
      if(active)return false;
      active=true;
      try{await task();return true}
      finally{active=false}
    }
  };
}
