var Persistence = require("../../persistence-module");

class Memory extends Persistence{
  constructor(){
    super("memory");
    this.inMemory = {};
  }

  onStartup(){
      return [];
  }

  async scan(){
    var vals = [];

    for(var i in this.inMemory){
      vals.push(this.inMemory[i]);
    }

    return vals;
  }

  async retry(key){
    var doc = this.inMemory[key];
    if(doc){
      doc.nextRetry = Date.now() + doc.retryTime;
    }
    return doc;
  }

  async persist(key, persistenceInfo, doc){
    var {expires, retryTime} = persistenceInfo;
    var time = Date.now();
    doc.creationTime = time;
    doc.expiresAt = time + expires;
    doc.nextRetry = time + retryTime;
    doc.expires = expires;
    doc.retryTime = retryTime;
    doc.key = key;
    this.inMemory[key] = doc;
  }

  async remove(key){
    delete this.inMemory[key];
  }

  async getRecord(key){
    return this.inMemory[key];
  }

}

module.exports = Memory;
