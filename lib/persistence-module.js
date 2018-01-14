

class PersistenceModule{
  constructor(routeName){
    this.routeName = routeName
  }

  onStartup(){
      throw new Error("TODO")
  }

  async scan(){

    throw new Error("TODO")
  }

  async retry(key){
    throw new Error("TODO")
  }

  async persist(key, persistenceInfo, fullDoc){
    throw new Error("TODO")
  }

  async remove(key){
    throw new Error("TODO")
  }

  async getRecord(key){
    throw new Error("TODO")
  }

}

module.exports = PersistenceModule;
