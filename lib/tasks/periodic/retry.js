var Periodic = require("least-slack-scheduler").Tasks.Periodic;

function createRetryTask({key, retryTime, engine}){
  async function retryModule(){
    var persistModule = await engine.getPersistenceModuleByKey(key);
    var fullDoc = await persistModule.getRecord(key);

    if(!fullDoc){
      this.releaseJob("remove", {engine, key})
      return;
    }

    persistModule.retry(key).then((fullDoc) => {
      if(fullDoc){
      var {forwardingInfo} = fullDoc;
      var forwardModule = engine.getForwardModule(forwardingInfo);

        var {doc, qos} = fullDoc;
        forwardModule.retry(key, doc).then(() => {
          if(qos === "delivery"){
            engine.success(key, "delivered");
          }
        })
      }
    })
  }

  engine.scheduler.addTask("retry-" + key, new Periodic({releaseTime:retryTime, executionTime:1, period: retryTime, delegate:retryModule}));
}


module.exports = createRetryTask;
