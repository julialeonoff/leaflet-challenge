const API_KEY = "finally remembered to take this out";

// Set up URL
// Dataset = All quakes past week
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grab data with d3
d3.json(url, function(response) {
    features(response.features);
});

function color(mag) {
    // Conditionals for magnitude
    if (mag >= 5) {
      return "red";
    }
    else if (mag >= 4) {
      return "peru";
    }
    else if (mag >= 3) {
     return "darkorange";
    }
    else if (mag >= 2) {
      return "yellow";
    }
    else if (mag >= 1) {
      return "yellowgreen";
    }
    else {
      return "green";
    }
};

function features(data) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p> Magnitude: " + feature.properties.mag + "</p><p>" + new Date(feature.properties.time) + "</p>");
    };

    function pointToLayer(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: feature.properties.mag * 5,
            fillOpacity: 0.8,
            color: "black",
            weight: .2,
            fillColor: color(feature.properties.mag)
          });
    }

    var earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    createMap(earthquakes);
};

function createMap(earthquakes) {
    var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    //var baseMaps = {
    //    "Light Map": lightmap,
    //};

     // Create overlay object to hold our overlay layer
     //var overlayMaps = {
     //   Earthquakes: earthquakes
     //};

    // Create a map object
    var myMap = L.map("map", {
        center: [39.50, -98.35],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    // Create the legend
    var legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += "<h4> Magnitude </h4>";
        div.innerHTML += '<i style="background: green"></i><span> 0 - 1 </span><br>';
        div.innerHTML += '<i style="background: yellowgreen"></i><span> 1 - 2 </span><br>';
        div.innerHTML += '<i style="background: yellow"></i><span> 2 - 3 </span><br>';
        div.innerHTML += '<i style="background: orange"></i><span> 3 - 4 </span><br>';
        div.innerHTML += '<i style="background: peru"></i><span> 4 - 5 </span><br>';
        div.innerHTML += '<i style="background: red"></i><span> 5+ </span><br>';
     
        return div;
    };
    legend.addTo(myMap);
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    //L.control.layers(baseMaps, overlayMaps, {
       // collapsed: false
    //.addTo(myMap);
};
