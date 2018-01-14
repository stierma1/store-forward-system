var Engine = require("./lib/engine");
var MemoryPersistence = require("./lib/built-in/persistence-mods/memory");
var FileStorage = require("./lib/built-in/persistence-mods/file-storage");
var ConsoleForward = require("./lib/built-in/forwarding-mods/console");

var engine = new Engine([new ConsoleForward()], [new FileStorage()], 1);

engine.startUp();
/*
engine.receive("test", {
  forwardingInfo: {
    type:"_console"
  },
  returnInfo: {
    type:"_console"
  },
  persistenceInfo: {
    type: "file-storage",
    expires:3000,
    retryTime: 1000
  },
  doc:"Yes",
  qos:"fail"
});*/
