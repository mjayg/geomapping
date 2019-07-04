var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

function mkr_sz(mag) {
  return mag * 30000;
}

function mkr_color(mag) {
  if (mag <= 1) {
      return "#ADFF2F";
  } else if (mag <= 2) {
      return "#9ACD32";
  } else if (mag <= 3) {
      return "#FFFF00";
  } else if (mag <= 4) {
      return "#ffd700";
  } else if (mag <= 5) {
      return "#FFA500";
  } else {
      return "#FF0000";
  };
}

d3.json(link, function(data) {
  
  create_mapfeatures(data.features);
});

function create_mapfeatures(earthquakeData) {

  var quakez = L.geoJSON(earthquakeData, {
 
 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: mkr_sz(feature.properties.mag),
        fillColor: mkr_color(feature.properties.mag),
        fillOpacity: 0.5,
        stroke: false
    })
  }
  });
    


 
  createMap(quakez);
}

function createMap(quakez) {

  var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Matthew Gilmore",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Matthew Gilmore",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var b_maps = {
    "Satelite Map": satelitemap,
    "Dark Map": darkmap
  };

  var overLayEarthQuakeLayer = {
    Earthquakes: quakez
  };

 
  var myMap = L.map("map", {
    center: [40.757830302, -74.135666124],
    zoom: 3,
    layers: [satelitemap, quakez]
  });


  L.control.layers(b_maps, overLayEarthQuakeLayer, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + mkr_color(magnitudes[i] + 1) + '"></i>:   '
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}



  
