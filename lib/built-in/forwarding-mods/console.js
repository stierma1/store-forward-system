var ForwardingModule = require("../../forwarding-module");

class Console extends ForwardingModule{
  constructor(){
    super("_console");
  }

  async forward(key, doc){
    console.log("forwarding", key, doc);
  }

  async retry(key, doc){
    console.log("retrying")
    return this.forward(key, doc);
  }

  async returnBack(){
    console.log(arguments)
  }
}

module.exports = Console;
