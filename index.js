var HttpWebHooksPlatform = require('./src/homekit/HttpWebHooksPlatform');
var HttpWebHookSensorAccessory = require('./src/homekit/accessories/HttpWebHookSensorAccessory');
var HttpWebHookLightBulbAccessory = require('./src/homekit/accessories/HttpWebHookLightBulbAccessory');

module.exports = function(homebridge) {
  homebridge.registerPlatform("homebridge-http-webhooks-countdown", "HttpWebHooks-countdown", HttpWebHooksPlatform);
  homebridge.registerAccessory("homebridge-http-webhooks-countdown", "HttpWebHookSensor-countdown", HttpWebHookSensorAccessory);
  homebridge.registerAccessory("homebridge-http-webhooks-countdown", "HttpWebHookLight-countdown", HttpWebHookLightBulbAccessory);
};
