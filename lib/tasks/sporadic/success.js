

var Aperiodic = require("least-slack-scheduler").Tasks.Aperiodic;
var createExpireTask = require("../periodic/expires")
var createRetryTask = require("../periodic/retry")

function createSuccessTask(scheduler){
  async function success({engine, key, returnValue}){
    var persistModule = await engine.getPersistenceModuleByKey(key);
    var fullDoc = await persistModule.getRecord(key);
    if(!fullDoc){
      return;
    }
    var {returnInfo} = fullDoc;
    var forwardModule = engine.getForwardModule(returnInfo);

    forwardModule.returnBack(key, returnInfo, returnValue);
    this.releaseJob("remove", {key, engine});

  }

  scheduler.addTask("success", new Aperiodic({executionTime:1, deadlineTime:1, delegate:success}));
}

function createSuccesJob(scheduler, key, returnValue, engine){
   scheduler.releaseJob("success", {key, returnValue,  engine});
}

module.exports = {createSuccessTask, createSuccesJob}
