
class FullDocument {
  constructor({doc, forwardingInfo, returnInfo, persistenceInfo, qos}){
    this.doc = doc || null;
    this.creationDateTime = new Date().toUTCString();
    this.qos = qos || "delivery";
    this.persistenceInfo = persistenceInfo || {};
    this.persistenceInfo.retryTime = this.persistenceInfo.retryTime || 1000 * 60 * 60;
    this.persistenceInfo.expires = this.persistenceInfo.expires || 1000 * 60 * 60 * 24;
    this.forwardingInfo = forwardingInfo || {};
    this.returnInfo = returnInfo || {};
  }

  clone(){
    return new FullDocument(this);
  }
}


module.exports = FullDocument
