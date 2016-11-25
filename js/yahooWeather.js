function yahooWeather(options){
	'use strict'
	options.temperature = options.temperature || 'f'; //if temperature need in celcuis then change it to 'c';
    options.liveUpdate = (options.liveUpdate === true)?options.liveUpdate: false; //Use this if you need to enable the live update of the weather. It will start updating the weather information in every one minute.
    options.liveUpdateInterval =  (typeof options.liveUpdateInterval == 'number')?options.liveUpdateInterval: 1 * 60 * 60 * 1000; //Use this if you need to change the interval time of the live upate weather information. By default it is one hour. it will work only if the liveUpdate if true.
	var constantsVars = {
		apiURL: 'https://query.yahooapis.com/v1/public/yql?q=' + escape('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+options.location+'") and u="'+options.temperature+'"') + '&format=json&env=store://datatables.org/alltableswithke',
        loadingTemplate: '<div class="weather-widget-loading">Loading...</div>',
        errorTemplate: '<div class="weather-widget-error"><strong>Error:</strong><br/>{{errorMessage}}</div>',
        htmlTemplate: '<div class="weather-widget-title">{{title}}</div>\
                       <div class="weather-widget-current-conditions">\
                           <div class="weather-widget-current-temp">{{currentTemp}}&deg;</div>\
                           <div class="weather-widget-current-image-container">\
                               <div class="weather-widget-current-image"><img src="{{imageURL}}" /></div>\
                               <div class="weather-widget-current-image-text">{{imageText}}</div>\
                           </div>\
                           <div class="weather-widget-today-sun-info">\
                            <div class="weather-widget-today-sun-text">SUN</div>\
                            <div class="weather-widget-today-sunrise">7:19 am</div>\
                            <div class="weather-widget-today-sunset">5:30 pm</div>\
                          </div>\
                       </div>\
                       <div class="weather-widget-forecast">\
                           {{forecastItems}}\
                       </div>',
        forecastItemTemplate: '<div class="weather-widget-forecast-item">\
                                   <div class="weather-widget-forecast-day">{{forecastDay}}</div>\
                                   <div class="weather-widget-forecast-temp">{{forecastHigh}}&deg; / {{forecastLow}}&deg;</div>\
                               </div>'
	}
	var currentElement = null;
	function initialize(){
		if(options.elementId == null){
			displayError('Please provide element id in the widget parameter.', true)
			return;
		}
		currentElement = document.getElementById(options.elementId);
		if(currentElement == null){
			displayError('Element you provided dose\'t exist in DOM!', true)
			return;
		}
		currentElement.className += " weather-widget-center weather-widget";
        currentElement.innerHTML = constantsVars.loadingTemplate;
		if(!options.location){
			displayError('Please provide proper location in the widget parameter. e.g. : Fairfax, VA')
			return;
		}
		getWeatherData();
		if(options.liveUpdate === true) setInterval(getWeatherData, options.liveUpdateInterval);
	}
	function getWeatherData(){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			var response;
			if(xhr.readyState === 4 && xhr.status === 200){
				response = JSON.parse(xhr.responseText);
				console.log("Received response", response);
				if(response.query && response.query.count > 0 && response.query.results && response.query.results.channel && response.query.results.channel.item && response.query.results.channel.item && response.query.results.channel.location){
	            	parseWidget(response.query.results.channel)
				}else{
					displayError("Weather information not found.");
					return;
				}
			}

		}

		xhr.open('GET', constantsVars.apiURL, true);
		xhr.send();
	}

	function displayError(msg, fakeDiv){
		msg = msg || 'Some Issue';
		var errorHtml = constantsVars.errorTemplate.replace("{{errorMessage}}", msg);
		if(fakeDiv === true){
			var errorElement = document.createElement('div');
			errorElement.className += " weather-widget-center weather-widget";
			errorElement.innerHTML = errorHtml;
			document.body.appendChild(errorElement);
		}else{
			currentElement.innerHTML = errorHtml;
		}
	}

	function parseWidget(weatherData){
		var title = weatherData.location.city + ", " + weatherData.location.region;
		var forecastItems = '';
		if(weatherData.item.forecast.length > 0){
            var forecastData = weatherData.item.forecast.slice(0, 5);
	        for (var i = 0; i < forecastData.length; i++) {
	            var forecast = forecastData[i];
	            forecastItems += constantsVars.forecastItemTemplate
	                                 .replace("{{forecastDay}}", forecast.day)
	                                 .replace("{{forecastHigh}}", forecast.high)
	                                 .replace("{{forecastLow}}", forecast.low);
	        }
        }
		var html = constantsVars.htmlTemplate
								.replace("{{title}}", title)
								.replace("{{currentTemp}}", weatherData.item.condition.temp)
								.replace("{{imageURL}}", 'http://l.yimg.com/a/i/us/we/52/' + weatherData.item.condition.code + '.gif')
								.replace("{{imageText}}", weatherData.item.condition.text)
								.replace("{{forecastItems}}", forecastItems);
		currentElement.innerHTML = html;
	}

	initialize();
}