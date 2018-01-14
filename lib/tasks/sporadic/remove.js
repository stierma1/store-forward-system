
var Sporadic = require("least-slack-scheduler").Tasks.Sporadic;

function createRemoveTask(scheduler){
  async function removeModule({engine, key}){

    var persistModule = await engine.getPersistenceModuleByKey(key);

    this.removeTask("expires-" + key);
    this.removeTask("retry-" + key);
    return persistModule.remove(key);
  }

  scheduler.addTask("remove", new Sporadic({executionTime:1, deadlineTime:0, delegate:removeModule}));
}

function createRemoveJob(key, engine, scheduler){
   scheduler.releaseJob("remove", {key, engine});
}


module.exports = {createRemoveTask, createRemoveJob}
