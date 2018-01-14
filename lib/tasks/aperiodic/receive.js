
var Aperiodic = require("least-slack-scheduler").Tasks.Aperiodic;
var createExpireTask = require("../periodic/expires")
var createRetryTask = require("../periodic/retry")

function createReceiveTask(scheduler){
  function receive({engine, key, fullDoc}){
    var {forwardInfo, persistenceInfo} = fullDoc;
    var persistModule = engine.getPersistenceModule(persistenceInfo);
    var forwardModule = engine.getForwardModule(forwardInfo);
    var {doc, qos, forwardingInfo, persistenceInfo} = engine.breakDownDocument(fullDoc);
    var {expires, retryTime} = persistenceInfo
    this.releaseJob("store", {engine, key, fullDoc});
    this.releaseJob("forward", {key, engine, fullDoc})
    createRetryTask({key, retryTime, engine})
    createExpireTask({key, expires, engine});
  }

  scheduler.addTask("receive", new Aperiodic({executionTime:1, deadlineTime:0, delegate:receive}));
}

function createReceiveJob(scheduler, key, fullDoc, engine){
   scheduler.releaseJob("receive", {key, fullDoc,  engine});
}


module.exports = {createReceiveTask, createReceiveJob}
