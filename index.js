var Engine = require("./lib/engine");
var MemoryPersistence = require("./lib/built-in/persistence-mods/memory");
var FileStoragePersistence = require("./lib/built-in/persistence-mods/file-storage");
var ForwardingModule = require("./lib/engine");
var PersistenceModule = require("./lib/persistence-module");
var FullDocument = require("./lib/full-document");

module.exports = {
  Engine,
  MemoryPersistence,
  FileStoragePersistence,
  Abstractions: {
    ForwardingModule,
    PersistenceModule,
    FullDocument
  }
}
