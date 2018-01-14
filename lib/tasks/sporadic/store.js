
var Sporadic = require("least-slack-scheduler").Tasks.Sporadic;

function createStoreTask(scheduler){
  function store({engine, key, fullDoc}){
    var {persistenceInfo} = fullDoc;
    var persistModule = engine.getPersistenceModule(persistenceInfo);
    persistModule.persist(key, persistenceInfo, fullDoc);
  }

  scheduler.addTask("store", new Sporadic({executionTime:1, deadlineTime:0, delegate:store}));
}

function createStoreJob(scheduler, engine, key, fullDoc){
   scheduler.releaseJob("store", {engine, key, fullDoc});
}


module.exports = {createStoreTask, createStoreJob}
