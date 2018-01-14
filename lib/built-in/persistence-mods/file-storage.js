var fs = require("fs");
var del = require("del");
var path = require("path");
var glob = require("glob");

var Persistence = require("../../persistence-module");

class FileStorage extends Persistence{
  constructor(storageDirectory){
    super("file-storage");
    this.storageDirectory = path.join(__dirname, storageDirectory || "./../../../temp")
  }

  onStartup(){
    return this.scan();
  }

  readFile(key){
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(this.storageDirectory, new Buffer(key).toString("base64")), "utf8", (err, file) => {
        if(err){
          resolve(undefined);
          return;
        }
        resolve(JSON.parse(file));
      });
    })

  }

  writeFile(key, doc){
    return new Promise((resolve, reject) => {

      fs.writeFile(path.join(this.storageDirectory, new Buffer(key).toString("base64")), JSON.stringify(doc, null, 2), (err, file) => {
        if(err){
          resolve(undefined);
          return;
        }
        resolve(file);
      });
    })
  }

  scan(){
    var filePaths = glob.sync(this.storageDirectory + "/*");
    var files = filePaths.map((filePath) => {
      let fp = filePath;
      return () => {
        return JSON.parse(fs.readFileSync(fp, "utf8"));
      }
    });

    return files;
  }

  getKeys(){
    var filePaths = glob.sync(this.storageDirectory + "/*");
    return filePaths.split("/")[filePaths.split("/").length - 1].map((fileName) => {
      return new Buffer(fileName, "base64").toString("utf8")
    });
  }

  async retry(key){
    var doc = await this.readFile(key);
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
    return this.writeFile(key, doc);
  }

  async remove(key){
    return del([path.join(this.storageDirectory, new Buffer(key).toString("base64"))])
  }

  async getRecord(key){
    return this.readFile(key)
  }
}

module.exports = FileStorage;
