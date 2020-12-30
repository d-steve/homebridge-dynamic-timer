const Constants = require('../Constants');
const Server = require('../Server');

var HttpWebHookSensorAccessory = require('./accessories/HttpWebHookSensorAccessory');
var HttpWebHookLightBulbAccessory = require('./accessories/HttpWebHookLightBulbAccessory');

var Service, Characteristic;

function HttpWebHooksPlatform(log, config, homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  this.log = log;
  this.cacheDirectory = config["cache_directory"] || Constants.DEFAULT_CACHE_DIR;
  this.storage = require('node-persist');
  this.storage.initSync({
    dir : this.cacheDirectory
  });

  this.sensors = config["sensors"] || [];
  this.lights = config["lights"] || [];

  this.server = new Server(Service, Characteristic, this, config);
};

HttpWebHooksPlatform.prototype.accessories = function(callback) {
  var accessories = [];

  for (var i = 0; i < this.sensors.length; i++) {
    var sensor = new HttpWebHookSensorAccessory(Service, Characteristic, this, this.sensors[i]);
    accessories.push(sensor);
  }

  for (var i = 0; i < this.lights.length; i++) {
    var lightAccessory = new HttpWebHookLightBulbAccessory(Service, Characteristic, this, this.lights[i]);
    accessories.push(lightAccessory);
  }

  this.server.setAccessories(accessories);
  this.server.start();

  callback(accessories);
};

module.exports = HttpWebHooksPlatform;
