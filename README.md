# homebridge-http-webhooks-countdown

This is fork of [benzman81/homebridge-http-webhooks](https://github.com/benzman81/homebridge-http-webhooks) with modifications to the LightBulb and Light Sensor types for decrementing the values in order to use them as dynamic countdown timers. No changes for any other types.

The main purpose for this is to allow you to set dynamic countdown timers to be used to trigger Home Automations in HomeKit.

LightBulb 
- Pro: main benefit is that you can create Home Automations using the Home app.
- Pro: the timer can be paused/unpaused by turning off/on the light without changing the brightness.
- Con: the Home app expects the value to be a percentage of full brightness, so by default, the Home app will show 100% until the timer falls below 100 minutes left. You can use the "brightness_factor" config parameter to adjust this (ex: set brightness_factor to 10 to show brightness as the percent remaining out of 1000).

Light Sensor 
- Pro: main benefit is that the sensor lux value will show the exact value instead of trying to fit it into a range of 0-100%.
- Con: the Home app cannot create Home Automations triggered by light sensors. Use a 3rd party iOS app (ex: Eve for Homekit, Controller for HomeKit) to create Home Automations for light sensors. Note: once created, the actions can then be modified within the Home app.

By default, the timer will run once a minute and decrement the value by 1. Use the following config parameters to change this:

  tick: The interval (number of ticks in ms)
  step: How much to decrement value by this much each interval. Set to 0 to disable.

Below is the remainder of the forked README.md file with modfications to installation steps and to add config parameters for "tick" and "step".

# homebridge-http-webhooks

A http plugin with support of webhooks for [Homebridge](https://github.com/nfarina/homebridge).

The plugin gets its states from any system that is calling the url to trigger a state change.

Currently supports contact, motion, occupancy, smoke sensors, switches, push buttons, lights (only on/off and brightness), temperature sensors, humidity sensors, thermostats and leak sensors.

# Installation
1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-http-webhooks`
3. Update your configuration file. See sample-config.json snippet below.
4. Navigate to your homebridge/node_modules/homebridge-http-webhooks/src/homekit/accessories/ directory.
5. For LightBulbs: Replace the HttpWebHookLightBulbAccessory.js file with the one from this project (under src/homekit/accessories).
6. For Light Sensors: Replace the HttpWebHookSensorAccessory.js file with the one from this project (under src/homekit/accessories).
7. Restart HomeBridge.

# Retrieve state
To retrieve the current state you need to call the url `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToTrigger`
The returned JSON format is:
```
    {
        "success": true,
        "state": cachedState
    }
```

# Trigger change for boolean accessory
To trigger a change of a boolean accessory you need to call the url `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToTrigger&state=NEWSTATE`

## Contact sensor
For contact sensors the value for `NEWSTATE` is either `true` for contact or `false` for no contact. If `autoRelease` is used, than the state will be released after `autoReleaseTime`, if not set 5 seconds.

## Motion sensor
For motion sensors the value for `NEWSTATE` is either `true` for motion detection or `false` for no motion. If `autoRelease` is used, than the state will be released `autoReleaseTime`, if not set 5 seconds.

## Occupancy sensor
For occupancy sensors the value for `NEWSTATE` is either `true` for occupancy detection or 'false' for no occupancy. If `autoRelease` is used, than the state will be released `autoReleaseTime`, if not set 5 seconds.

## Smoke sensor
For smoke sensors the value for `NEWSTATE` is either `true` for smoke detection or `false` for no smoke.

## Switch
For switches the value for `NEWSTATE` is either `true` for on or `false` for off.

## Push button
For push buttons the value for `NEWSTATE` is `true`. The button will be released automatically.

## Light
For lights the value for `NEWSTATE` is either `true` for on or `false` for off.

## Outlet
For outlets the value for `NEWSTATE` is either `true` for on or `false` for off.

### Outlet in use
For outlets the additional state `stateOutletInUse` is available. The value for `NEWSTATE` is either `true` for on or `false` for off and
can be changed by calling the url `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToTrigger&stateOutletInUse=NEWSTATE`

# Trigger action

## Switch
For switches you can trigger a url of any system for switching the switch on or off.

## Push button
For push buttons you can trigger a url of any system for "pushing the button. The button will be released automatically.

## Light
For lights you can trigger a url of any system for switching the light on or off.

## Outlet
For outlets you can trigger a url of any system for switching the outlet on or off.

# Update a numeric accessory
To update a numeric accessory you need to call the url `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&value=NEWVALUE`

## Temperature sensor
For temperature sensors the value for `NEWVALUE` is the new temperature reading.

## Light sensor
For light sensors the value for `NEWVALUE` is the new light intensity in lux (as float).

## Humidity sensor
For humidity sensors the value for `NEWVALUE` is the new relative humidity percentage reading.

## Air Quality sensor
For air quality sensors the value for `NEWVALUE` is the new air quality value (Between 1-5, 1 Excellent).

## Leak sensor
For leak sensors the value for `NEWVALUE` is the new leak state value (1 for leak, 0 for dry).

## Light (brightness)
For light brightness the value for `NEWVALUE` is the new light brightness (as integer, between 0 and 100 with respect to brightness factor).

# Thermostat
To update a thermostat you can update four different values:
* Current temperature reading: `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&currenttemperature=NEWVALUE`
* Target temperature: `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&targettemperature=NEWVALUE`
* Current state (Off=0 / Heating=1 / Cooling=2): `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&currentstate=NEWVALUE`
* Target state (Off=0 / Heat=1 / Cool=2 / Auto=3): `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&targetstate=NEWVALUE`

# Security System
To update the state of security, you can update two different values:
* Current state (Stay=0 / Away=1 / Night=2 / Disarmed=3 / Triggered=4): `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&currentstate=NEWVALUE`
* Target state (Stay=0 / Away=1 / Night=2 / Disarm=3): `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&targetstate=NEWVALUE`

# Garage Door opener
To update a garage door opener you can update three different values:
* Current door state (Open=0 / Closed=1 / Opening=2 / Closing=3 / Stopped=4): `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&currentdoorstate=NEWVALUE`
* Target door state (Open=0 / Closed=1): `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&targetdoorstate=NEWVALUE`
* Obstruction detected (No=0 / Yes=1): `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&obstructiondetected=NEWVALUE`

# Stateless switch
Stateless switches requires 3 parameters accessoryId, buttonName and the event to trigger:
* Single press = 0
* Double press = 1
* Long press = 2

`http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&buttonName=theButtonName&event=EVENT`

# Lock mechanism
To update a lock mechanism you can update two different values:

Current lock state (unsecured=0 /secured=1 / jammed=2 /unknown=3 ): http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&lockcurrentstate=NEWVALUE
Target lock state (unsecured=0 / secured=1): http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&locktargetstate=NEWVALUE

# Window Coverings
To update a window coverings you can update three different values:
* Current position (%): `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&currentposition=%s` (%s is replaced by corresponding current position)
* Target position (%): `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&targetposition=%s` (%s is replaced by corresponding target position)
Setting of target position you can realize by send link to: open, 20%, 40%, 60% 80% and close
* Position State (Decreasing=0 / Increasing=1 / Stopped=2): `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&positionstate=0 (1 or 2)` (position state is not mandatory and not fully tested yet)

If you dont use callbacks to let your covering give feedback of current position back to homekit you can set "auto_set_current_position" to true.


# Configuration
Example config.json:
```
    {
        "platforms": [
            {
                "platform": "HttpWebHooks",
                "webhook_port": "51828",
                "webhook_listen_host": "::", // (optional, default: "0.0.0.0")
                "webhook_enable_cors": true, // (optional, default: false)
                "cache_directory": "./.node-persist/storage", // (optional, default: "./.node-persist/storage")
                "http_auth_user": "test", // (optional, only if you like to secure your api)
                "http_auth_pass": "test", // (optional, only if you like to secure your api)
                "https": true, // (beta state, optional, only if you like to secure your api using ssl certificate)
                "https_keyfile": "/pathToKeyFile/server.key", // (beta state, optional, only if you like to secure your api using ssl certificate)
                "https_certfile": "/pathToKeyFile/server.cert", // (beta state, optional, only if you like to secure your api using ssl certificate)
                "sensors": [
                    {
                        "id": "sensor1",
                        "name": "Sensor name 1",
                        "type": "contact",
                        "autoRelease": false, // (optional)
                        "autoReleaseTime": 7500 // (optional, in ms)
                    },
                    {
                        "id": "sensor2",
                        "name": "Sensor name 2",
                        "type": "motion",
                        "autoRelease": false, // (optional)
                        "autoReleaseTime": 7500 // (optional, in ms)
                    },
                    {
                        "id": "sensor3",
                        "name": "Sensor name 3",
                        "type": "occupancy",
                        "autoRelease": false, // (optional)
                        "autoReleaseTime": 7500 // (optional, in ms)
                    },
                    {
                        "id": "sensor4",
                        "name": "Sensor name 4",
                        "type": "smoke"
                    },
                    {
                        "id": "sensor5",
                        "name": "Sensor name 5",
                        "type": "temperature"
                    },
                    {
                        "id": "sensor6",
                        "name": "Sensor name 6",
                        "type": "humidity"
                    },
                    {
                        "id": "sensor7",
                        "name": "Sensor name 7",
                        "type": "airquality"
                    },
                    {
                        "id": "sensor8",
                        "name": "Sensor name 8",
                        "tick": 60000, // (optional, default 60000). The interval (number of ticks in ms) to decrement. 
                        "step": 1, // (optional, default 1). How much to decrement value by this much each interval. Set to 0 to disable.
                        "type": "light"
                    },
                    {
                        "id": "sensor9",
                        "name": "Sensor name 9",
                        "type": "leak"
                    }
                ],
                "switches": [
                    {
                        "id": "switch1",
                        "name": "Switch name 1",
                        "rejectUnauthorized": false, // (optional)
                        "on_url": "your url to switch the switch on", // (optional)
                        "on_method": "GET", // (optional)
                        "on_body": "{ \"on\" : true }", // (optional only for POST and PUT; use "on_form" for x-www-form-urlencoded JSON)
                        "on_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "off_url": "your url to switch the switch off", // (optional)
                        "off_method": "GET", // (optional)
                        "off_body": "{ \"on\": false }", // (optional only for POST and PUT; use "off_form" for x-www-form-urlencoded JSON)
                        "off_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}" // (optional)
                    }
                ],
                "pushbuttons": [
                    {
                        "id": "pushbutton1",
                        "name": "Push button name 1",
                        "rejectUnauthorized": false, // (optional)
                        "push_url": "your url to be called on push", // (optional)
                        "push_method": "GET", // (optional)
                        "push_body": "{ \"push\": true }", // (optional only for POST and PUT; use "push_form" for x-www-form-urlencoded JSON)
                        "push_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}" // (optional)
                    }
                ],
                "lights": [
                    {
                        "id": "light1",
                        "name": "Light name 1",
                        "tick": 60000, // (optional, default 60000). The interval (number of ticks in ms) to decrement. 
                        "step": 1, // (optional, default 1). How much to decrement value by this much each interval. Set to 0 to disable.
                        "rejectUnauthorized": false, // (optional)
                        "on_url": "your url to switch the light on", // (optional)
                        "on_method": "GET", // (optional)
                        "on_body": "{ \"on\" : true }", // (optional only for POST and PUT; use "on_form" for x-www-form-urlencoded JSON)
                        "on_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "off_url": "your url to switch the light off", // (optional)
                        "off_method": "GET", // (optional)
                        "off_body": "{ \"on\": false }", // (optional only for POST and PUT; use "off_form" for x-www-form-urlencoded JSON)
                        "off_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "brightness_url": "your url to change the light brightness", // (optional)
                        "brightness_method": "GET", // (optional)
                        "brightness_body": "{ \"on\" : %statusPlaceholder, \"bri\" : %brightnessPlaceholder}", // (optional only for POST and PUT; use "brightness_form" for x-www-form-urlencoded JSON, variables are replaced on the fly)
                        "brightness_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "brightness_factor": 2.55 // (optional to convert homekit brightness to target system brightness)
                    }
                ],
                "thermostats": [
                    {
                        "id": "thermostat1",
                        "name": "Thermostat name 1",
                        "rejectUnauthorized": false, // (optional)
                        "set_target_temperature_url": "http://127.0.0.1/thermostatscript.php?targettemperature=%f",        // %f is replaced by the target temperature
                        "set_target_temperature_method": "GET", // (optional)
                        "set_target_temperature_body": "{ \"on\" : true }", // (optional only for POST and PUT; use "set_target_temperature_form" for x-www-form-urlencoded JSON)
                        "set_target_temperature_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "set_target_heating_cooling_state_url": "http://127.0.0.1/thermostatscript.php?targetstate=%b",     // %b is replaced by the target state
                        "set_target_heating_cooling_state_method": "GET", // (optional)
                        "set_target_heating_cooling_state_body": "{ \"on\" : true }", // (optional only for POST and PUT; use "set_target_heating_cooling_state_form" for x-www-form-urlencoded JSON)
                        "set_target_heating_cooling_state_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}" // (optional)
                    }
                ],
                "outlets": [
                    {
                        "id": "outlet1",
                        "name": "Outlet name 1",
                        "rejectUnauthorized": false, // (optional)
                        "on_url": "your url to switch the outlet on", // (optional)
                        "on_method": "GET", // (optional)
                        "on_body": "{ \"on\" : true }", // (optional only for POST and PUT; use "on_form" for x-www-form-urlencoded JSON)
                        "on_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "off_url": "your url to switch the outlet off", // (optional)
                        "off_method": "GET", // (optional)
                        "off_body": "{ \"on\": false }", // (optional only for POST and PUT; use "off_form" for x-www-form-urlencoded JSON)
                        "off_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}" // (optional)
                    }
                ],
                "security": [
                    {
                        "id": "security1",
                        "name": "Security System",
                        "rejectUnauthorized": false, // (optional)
                        "set_state_url": "http://localhost/security/mode/%d", // %d is replaced by the target state
                        "set_state_method": "GET", // (optional)
                        "set_state_body": "{ \"on\": true }", // (optional only for POST and PUT; use "set_state_form" for x-www-form-urlencoded JSON)
                        "set_state_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}" // (optional)
                    }
                ],
                "garagedooropeners": [
                    {
                        "id": "garagedooropener1",
                        "name": "Garage Door Opener name 1",
                        "rejectUnauthorized": false, // (optional)
                        "open_url" : "your url to open the garage door", // (optional)
                        "open_method" : "GET", // (optional)
                        "open_body": "{ \"open\": true }", // (optional only for POST and PUT; use "open_form" for x-www-form-urlencoded JSON)
                        "open_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "close_url" : "your url to close the garage door", // (optional)
                        "close_method" : "GET", // (optional)
                        "close_body": "{ \"open\": false }", // (optional only for POST and PUT; use "close_form" for x-www-form-urlencoded JSON)
                        "close_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}" // (optional)
                    }
                ],
                "statelessswitches": [
                    {
                    "id": "statelessswitch1",
                    "name": "Stateless Switch 1",
                    "buttons": [//the buttons of the switch
                        {
                            "name": "Button1" // (The name does not appear in Home app but appear in Eve app)
                        },
                        {
                            "name": "Button2", // (The name does not appear in Home app but appear in Eve app)
                            "double_press": false, // (you can disable a type of action)
                            "long_press": false
                        }
                    ]
                    }
                ],
                "windowcoverings": [
                    {
                        "id": "windowcovering1",
                        "name": "Some Window Cover",
                        "rejectUnauthorized": false, // (optional)
                        "open_url" : "http://your.url/to/open",
                        "open_method" : "GET", // (optional)
                        "open_body": "{ \"open\": true }", // (optional only for POST and PUT; use "open_form" for x-www-form-urlencoded JSON)
                        "open_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "open_80_url" : "http://your.url/to/open80%",
                        "open_80_method" : "GET", // (optional)
                        "open_80_body": "{ \"open\": true }", // (optional only for POST and PUT; use "open_80_form" for x-www-form-urlencoded JSON)
                        "open_80_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "open_60_url" : "http://your.url/to/open60%",
                        "open_60_method" : "GET", // (optional)
                        "open_60_body": "{ \"open\": true }", // (optional only for POST and PUT; use "open_60_form" for x-www-form-urlencoded JSON)
                        "open_60_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "open_40_url" : "http://your.url/to/open40%",
                        "open_40_method" : "GET", // (optional)
                        "open_40_body": "{ \"open\": true }", // (optional only for POST and PUT; use "open_40_form" for x-www-form-urlencoded JSON)
                        "open_40_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "open_20_url" : "http://your.url/to/open20%",
                        "open_20_method" : "GET", // (optional)
                        "open_20_body": "{ \"open\": true }", // (optional only for POST and PUT; use "open_20_form" for x-www-form-urlencoded JSON)
                        "open_20_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "close_url" : "http://your.url/to/close",
                        "close_method" : "GET", // (optional)
                        "close_body": "{ \"open\": false }", // (optional only for POST and PUT; use "close_form" for x-www-form-urlencoded JSON)
                        "close_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "auto_set_current_position": true // (optional, default: false)
                     }
                ],
                "lockmechanisms": [
                    {
                        "id": "doorlock1",
                        "name": "Door",
                        "rejectUnauthorized": false, // (optional)
                        "open_url" : "your url to open the garage door", // (optional)
                        "open_method" : "GET",// (optional)
                        "open_body": "{ \"open\": true }", // (optional only for POST and PUT; use "open_form" for x-www-form-urlencoded JSON)
                        "open_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}", // (optional)
                        "close_url" : "your url to close the garage door", // (optional)
                        "close_method" : "GET", // (optional)
                        "close_body": "{ \"open\": false }", // (optional only for POST and PUT; use "close_form" for x-www-form-urlencoded JSON)
                        "close_headers": "{\"Authorization\": \"Bearer ABCDEFGH\", \"Content-Type\": \"application/json\"}" // (optional)
                    }
                ]
            }
        ]
    }
```

## Cache directory storage (cache_directory)
The cache directory is used to cache the state of the accessories. It must point to a **valid** and **empty** directory and the user that runs homebridge must have **write access**.

## HTTPS
If you want to create a secure connection for the webhooks you need to enable it by setting *https* to true. Then a self signed
ssl certificate will be created automatically and a secure connection will be used. If you want to use your own generated ssl
certificate you can do this by setting the values for *https_keyfile* and *https_certfile* to the corresponding file paths.
