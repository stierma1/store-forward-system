
class ForwardingModule{
  constructor(routeName){
    this.routeName = routeName
  }

  async forward(){
    throw new Error("TODO")
  }

  async retry(){
    throw new Error("TODO")
  }

  async returnBack(){
    throw new Error("TODO")
  }
}

module.exports = ForwardingModule;
