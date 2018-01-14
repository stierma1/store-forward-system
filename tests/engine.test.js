
var Engine = require("./../lib/engine");
var MemoryPersistence = require("./../lib/built-in/persistence-mods/memory");
var ConsoleForward = require("./../lib/built-in/forwarding-mods/console");

test("engine should construct", () => {
  var engine = new Engine([],[],{});
  expect(engine).not.toBe(undefined);
});


test("engine should work", () => {
  var engine = new Engine([new ConsoleForward()], [new MemoryPersistence()], {});
  engine.receive("test", {
    forwardingInfo: {
      type:"console"
    },
    returnInfo: {
      type:"console"
    },
    persistenceInfo: {
      type: "memory",
      expires:1000,
      retryTime: 1000
    },
    doc:"Yes",
    qos:"stuff"
  });

  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  });
})
