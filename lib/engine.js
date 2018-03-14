var FullDocument = require("./full-document");
var NullForwarding = require("./built-in/forwarding-mods/null");
var NullPersistence = require("./built-in/persistence-mods/null");
var LeastSlackScheduler = require("least-slack-scheduler").LeastSlackScheduler;

var createRetryTask  = require("./tasks/periodic/retry");
var createExpireTask = require("./tasks/periodic/expires");
var {createRemoveTask} = require("./tasks/sporadic/remove");
var {createStoreTask} = require("./tasks/sporadic/store");
var {createReceiveTask} = require("./tasks/aperiodic/receive");
var {createForwardTask} = require("./tasks/aperiodic/forward");
var {createSuccessTask} = require("./tasks/sporadic/success");

class Engine{
  constructor(forwardModules, persistModules, maxConcurrent){
    this.forwardModules = forwardModules;
    this.persistModules = persistModules;
    this.scheduler = new LeastSlackScheduler({maxConcurrent: maxConcurrent || 1});
    createRemoveTask(this.scheduler);
    createStoreTask(this.scheduler);
    createReceiveTask(this.scheduler);
    createForwardTask(this.scheduler);
    createSuccessTask(this.scheduler);
    this.nullPersistence = new NullPersistence();
    this.nullForward = new NullForwarding();
  }

  async startUp(){
    var startUpFiles = this.persistModules.reduce((red, pM) => {
      return red.concat(pM.onStartup());
    }, []);
    for(var docClosure of startUpFiles){
      var doc = await docClosure();
      var key = doc.key;
      this.receive(key, doc);
    }
  }

  breakDownDocument(doc){
    return new FullDocument(doc)
  }

  getForwardModule(forwardingInfo){
    if(forwardingInfo === undefined || forwardingInfo === null){
      return this.nullForward
    }

    var [mod] = this.forwardModules.filter((mod) => {
      return forwardingInfo.type === mod.routeName
    });

    if(mod === null || mod === undefined){
      return this.nullForward;
    }

    return mod;
  }

  getPersistenceModule(persistenceInfo){
    if(persistenceInfo === undefined || persistenceInfo === null){
      return this.nullPersistence
    }
    var [mod] = this.persistModules.filter((mod) => {
      return persistenceInfo.type === mod.routeName
    });

    if(mod === null || mod === undefined){
      return this.nullPersistence;
    }

    return mod;
  }

  async getPersistenceModuleByKey(key){
    for(var mod of this.persistModules){
      if(await mod.getRecord(key)){
        return mod
      }
    }

    return this.nullPersistence;
  }

  receive(key, fullDoc){
    this.scheduler.releaseJob("receive", {key, fullDoc,  engine:this});
  }

  success(key, returnValue){
    this.scheduler.releaseJob("success", {key, returnValue,  engine:this})
  }
}

module.exports = Engine;
