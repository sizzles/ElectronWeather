function GetWeather(location) {

    $("#weatherTable").empty();

    if(location === undefined || location.length === 0 ) {
        return;
    }

    $.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"+location+"%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function (data) {

        $("#forecastName").text("Forecast for: "+ data.query.results.channel.location.city + " - " + data.query.results.channel.location.country);
        $("#refreshTime").text("Last published: " + data.query.results.channel.item.pubDate);

        var city = data.query.results.channel.location.city;
        var forecast = data.query.results.channel.item.forecast;
    
        forecast.forEach(forecastDay => {
            var lowType = GetTempType(forecastDay.low);
            var highType = GetTempType(forecastDay.high);

            $("#weatherTable").append('<tr><td>'+ forecastDay.date +'</td> <td>	<span class="icon icon-record" color="'+ highType +'"> </span>'+ forecastDay.high +'</td> <td><span class="icon icon-record" color="'+ lowType +'"> </span>'+ forecastDay.low +'</td> <td>'+ forecastDay.text +'</td> ')
        })
      
    });
};

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

