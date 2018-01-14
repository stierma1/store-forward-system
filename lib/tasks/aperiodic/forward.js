
var Aperiodic = require("least-slack-scheduler").Tasks.Aperiodic;

function createForwardTask(scheduler){
  function forward({engine, key, fullDoc}){
    var {forwardingInfo, doc} = fullDoc;
    var forwardModule = engine.getForwardModule(forwardingInfo);
    forwardModule.forward(key, doc);
  }

  scheduler.addTask("forward", new Aperiodic({executionTime:1, deadlineTime:0, delegate:forward}));
}

function createForwardJob(scheduler, key, fullDoc, engine){
   scheduler.releaseJob("forward", {key, fullDoc, engine});
}


module.exports = {createForwardTask, createForwardJob}
