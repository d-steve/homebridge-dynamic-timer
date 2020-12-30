# homebridge-dynamic-timer

This is fork of [benzman81/homebridge-http-webhooks](https://github.com/benzman81/homebridge-http-webhooks) with modifications to the LightBulb and Light Sensor types for decrementing the values in order to use them as dynamic countdown timers. Other accessories have been removed.

The main purpose for this is to allow you to set dynamic countdown timers to be used to trigger Home Automations in HomeKit.

LightBulb 
- Pro: main benefit is that you can create Home Automations using the Home app for when the light bulb turns off.
- Con: the Home app expects the value to be a percentage of full brightness, so by default, the Home app will show 100% until the timer falls below 100 minutes left. You can use the "brightness_factor" config parameter to adjust this (ex: set brightness_factor to 10 to show brightness as the percent remaining out of 1000).

Light Sensor 
- Pro: main benefit is that the sensor lux value will show the exact value instead of trying to fit it into a range of 0-100%.
- Con: the Home app cannot create Home Automations triggered by light sensors. Use a 3rd party iOS app (ex: Eve for Homekit, Controller for HomeKit) to create Home Automations for light sensors. Note: once created, the actions can then be modified within the Home app.

By default, the timer will run once a minute and decrement the value by 1. Use the following config parameters to change this:

  - tick: The interval (in ms).
  - step: How much to decrement value by each interval. Set to 0 to disable.
  - relative: for LightBulb only. When 1, display brightness as a percent of originally set value remaining instead of number of intervals remaining. Default 0

Below is the remainder of the forked README.md file with changes to reflect modifications:

# Installation
1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-dynamic-timer`
3. Update your configuration file. See sample-config.json snippet below.
4. Restart HomeBridge.

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

## Light
For lights the value for `NEWSTATE` is either `true` for on or `false` for off.

# Trigger action

## Light
For lights you can trigger a url of any system for switching the light on or off.

# Update a numeric accessory
To update a numeric accessory you need to call the url `http://yourHomebridgeServerIp:webhook_port/?accessoryId=theAccessoryIdToUpdate&value=NEWVALUE`

## Light sensor
For light sensors the value for `NEWVALUE` is the new light intensity in lux (as float).

## Light (brightness)
For light brightness the value for `NEWVALUE` is the new light brightness (as integer, between 0 and 100 with respect to brightness factor).

# Configuration
Example config.json:
```
    {
        "platforms": [
            {
                "platform": "dynamic-timer",
                "webhook_port": "51888",
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
                        "id": "sensor8",
                        "name": "Sensor name 8",
                        "tick": 60000, // (optional, default 60000). The interval (number of ticks in ms) to decrement. 
                        "step": 1, // (optional, default 1). How much to decrement value by this much each interval. Set to 0 to disable.
                        "type": "light"
                    }
                ],
                "lights": [
                    {
                        "id": "light1",
                        "name": "Light name 1",
                        "tick": 60000, // (optional, default 60000). The interval (number of ticks in ms) to decrement. 
                        "step": 1, // (optional, default 1). How much to decrement value by this much each interval. Set to 0 to disable.
                        "relative": 0, // (optional, default 0). Display remaining time as percentage of time remaining instead of number of intervals left.
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
                ]
            }
        ]
    }
```

## Cache directory storage (cache_directory)
The cache directory is used to cache the state of the accessories. It must point to a **valid** and **empty** directory and the user that runs homebridge must have **write access**.

Docker users will need to specify a writable path (ex: /homebridge/.node-persist/storage) or it will fail to load with "EACCES: permission denied".

## HTTPS
If you want to create a secure connection for the webhooks you need to enable it by setting *https* to true. Then a self signed
ssl certificate will be created automatically and a secure connection will be used. If you want to use your own generated ssl
certificate you can do this by setting the values for *https_keyfile* and *https_certfile* to the corresponding file paths.
