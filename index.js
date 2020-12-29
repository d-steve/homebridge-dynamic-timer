var HttpWebHooksPlatform = require('./src/homekit/HttpWebHooksPlatform');
var HttpWebHookSensorAccessory = require('./src/homekit/accessories/HttpWebHookSensorAccessory');
var HttpWebHookLightBulbAccessory = require('./src/homekit/accessories/HttpWebHookLightBulbAccessory');

module.exports = function(homebridge) {
  homebridge.registerPlatform("homebridge-http-webhooks", "HttpWebHooks", HttpWebHooksPlatform);
  homebridge.registerAccessory("homebridge-http-webhooks", "HttpWebHookSensor", HttpWebHookSensorAccessory);
  homebridge.registerAccessory("homebridge-http-webhooks", "HttpWebHookLight", HttpWebHookLightBulbAccessory);
};
