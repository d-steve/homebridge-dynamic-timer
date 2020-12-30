var HttpWebHooksPlatform = require('./src/homekit/HttpWebHooksPlatform');
var HttpWebHookSensorAccessory = require('./src/homekit/accessories/HttpWebHookSensorAccessory');
var HttpWebHookLightBulbAccessory = require('./src/homekit/accessories/HttpWebHookLightBulbAccessory');

module.exports = function(homebridge) {
  homebridge.registerPlatform("homebridge-dynamic-timer", "dynamic-timer", HttpWebHooksPlatform);
  homebridge.registerAccessory("homebridge-dynamic-timer", "Sensor", HttpWebHookSensorAccessory);
  homebridge.registerAccessory("homebridge-dynamic-timer", "Light", HttpWebHookLightBulbAccessory);
};
