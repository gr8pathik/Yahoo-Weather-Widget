# Yahoo Weather Widget

This yahoo weather widget is developed in core Javascript. No Libraires are used to develop this Widget.

Live Demo : http://codepen.io/gr8pathik/full/KNqBog

##How to use

Add a div element to a page with either an id to identify it.
```html
<body>
    <div id="weather-widget"></div>
</body>
```

Call the Yahoo Weather Widget function and provide the element ID and Location in the function paramater.
```js
yahooWeather({
    elementId : 'weather-widget',
    location: 'Fairfax, VA',
    // temperature: 'c', //Uncomment this if you need temprature in celcius
    //liveUpdate: true, //Uncomment this if you need to enable the live update of the weather. It will start updating the weather information in every one Hour.
    //liveUpdateInterval: 10000, //Uncomment this if you need to change the interval time of the live upate weather information. By default it is one hour. it will work only if the liveUpdate if true.
});
```

## Options

|Option| Is Required | Default Value | Description |
|------|-------------|---------------|-------------|
| elementId | Yes | No Default Value. If not provided then it will give error. | Div element id need to identify and inject the widget
| location | Yes | No Default Value. If not provided then it will give error. | Location is required to fetch the Weather information
| temperature | No | 'f' - Fahrenheit | If you want to change the temprature to Celcius then add 'c'.
| liveUpdate | No | false | Make it true if you need to enable the live update of the weather. It will start updating the weather information in every one Hour. You can change the interval of the live update with the liveUpdateInterval option. See below
| liveUpdateInterval | No | 1 * 60 * 60 * 1000 (One Hour) | if you need to change the interval time of the live upate weather information. By default it is one hour. it will work only if the liveUpdate if true.
