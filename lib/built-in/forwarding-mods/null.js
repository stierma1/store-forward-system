var ForwardingModule = require("../../forwarding-module");

class Null extends ForwardingModule{
  constructor(){
    super(null)
  }

  async forward(){

  }

  async retry(){

  }

  async returnBack(){

  }
}

module.exports = Null;
