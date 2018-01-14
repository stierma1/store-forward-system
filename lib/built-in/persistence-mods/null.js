var Persistence = require("../../persistence-module");

class Null extends Persistence{
  constructor(){
    super(null);
  }

  onStartup(){
      return [];
  }

  async scan(){

    return [];
  }

  async retry(key){

  }

  async persist(key, persistenceInfo, fullDoc){

  }

  async remove(key){

  }

  async getRecord(key){
    return undefined
  }

}

module.exports = Null;
