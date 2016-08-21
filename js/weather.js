var refreshId = 0;

function GetWeather(location) {

    $("#weatherTable").empty();

    if(location === undefined || location.length === 0 ) {
        return;
    }

    $.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"+location+"%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function (data) {

        var city = data.query.results.channel.location.city;
        var forecast = data.query.results.channel.item.forecast;
        var currentTemp = data.query.results.channel.item.condition.temp;
        
        var latitude =  data.query.results.channel.item.lat;
        var longitude = data.query.results.channel.item.long;

        UpdateAstronomy(latitude, longitude);

        $("#forecastName").text("Forecast for: "+ data.query.results.channel.location.city + " - " + data.query.results.channel.location.country);
        $("#refreshTime").text("Last published: " + data.query.results.channel.item.pubDate);
        $("#currentConditions").text("Currently: " + currentTemp +" ℉");        

        forecast.forEach(forecastDay => {
            var lowType = GetTempType(forecastDay.low);
            var highType = GetTempType(forecastDay.high);

            $("#weatherTable").append('<tr><td>'+ forecastDay.date +'</td> <td>	<span class="icon icon-record" color="'+ highType +'"> </span>'+ forecastDay.high +'</td> <td><span class="icon icon-record" color="'+ lowType +'"> </span>'+ forecastDay.low +'</td> <td>'+ forecastDay.text +'</td> ')
        });
        
        clearInterval(refreshId);
        refreshId = setInterval(function() {UpdateAstronomy(latitude, longitude); },1000);
      
    });
};

//From humanize duration documentation
var shortEnglishHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      y: function() { return 'y' },
      mo: function() { return 'mo' },
      w: function() { return 'w' },
      d: function() { return 'd' },
      h: function() { return 'hr' },
      m: function() { return 'm' },
      s: function() { return 's' },
      ms: function() { return 'ms' },
    }
  }
})

function UpdateAstronomy(latitude, longitude) {
    
    var currentTime = Date.now();
    var tomorrowTime = Date.now() + 86400000;

    var solarInfo = SunCalc.getTimes(currentTime, /*Number*/ latitude, /*Number*/ longitude);
    var solarInfoTomorrow = SunCalc.getTimes(tomorrowTime, /*Number*/ latitude, /*Number*/ longitude);

    var sunrise = solarInfo.sunrise.getTime();
    var sunset = solarInfo.sunset.getTime();
    var tomorrowSunrise = solarInfoTomorrow.sunrise.getTime();

    //Before sunrise
    if(currentTime < sunrise) {
        var duration = new moment.duration(sunrise - currentTime);
        $('#sunStageInfo').text("Sunrise: " + shortEnglishHumanizer(duration, { round: true })); 
        return;
    }

    //After sunrise, before sunset
    if(currentTime >= sunrise && currentTime < sunset) {
        var duration = new moment.duration(sunset - currentTime);
        $('#sunStageInfo').text("Sunset: " + shortEnglishHumanizer(duration, { round: true }));
        return;
    }

    //After sunset - before tomorrow sunrise
    if(currentTime >= sunset && currentTime < tomorrowSunrise) {
        var duration = new moment.duration(tomorrowSunrise - currentTime);
        $('#sunStageInfo').text("Sunrise: " + shortEnglishHumanizer(duration, { round: true }));
        return;
    }

}

function GetTempType(temperature) {

    if(temperature >= 80) {
        return "red"
    }

    if(temperature >= 70) {
        return "orange"
    }

    if(temperature >= 55) {
        return "green"
    }
    return "blue"
};

function RegisterHandlers() {
    $("#searchButton").click(function() {

        var location = $("#searchLocation").val();

        GetWeather(location);
    });

}

