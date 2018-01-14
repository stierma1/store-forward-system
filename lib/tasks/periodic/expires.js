
var Periodic = require("least-slack-scheduler").Tasks.Periodic;
var s= 0;
function createExpireTask({key, expires, engine}){
  async function removeModule(){
    var persistModule = await engine.getPersistenceModuleByKey(key);
    await persistModule.remove(key);
    this.removeTask("expires-" + key);
    this.removeTask("retry-" + key);
  }
   engine.scheduler.addTask("expires-" + key, new Periodic({releaseTime:expires, executionTime:1, period: 1, delegate:removeModule}));
}


module.exports = createExpireTask;
