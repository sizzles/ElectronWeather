# ElectronWeather
Small app with electron and photon
Allows you to search and bring back the next few days forecast for a city.

Helped from github:connors/photon great photon boilerplate

It can be built using electron packager. For example - running on the windows command line:

electron-packager <source_directory> "Weather" --platform=win32 --arch=x64

The data is populated from the Yahoo public endpoint - for example:
https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

Available for non-commercial use and upto 2000 api calls per day.
