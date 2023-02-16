// Creating the map object centered in a way to
// get the majority of the world in the initial start up
var myMap = L.map("map", {
    center: [15, 0],
    zoom: 3
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Setting up the link.
  const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";
 
  
    
  // Getting our GeoJSON data and setting up all our variables
  d3.json(link).then((data) => {
    console.log(data);  

    function depthColor(depth) {
    if (depth < 10) return "#00ff00";
    else if (depth < 30) return "#adff2f";
    else if (depth < 50) return "#ffae1a";
    else if (depth < 70) return "#ff6500";
    else if (depth < 90) return "#ff1a32";
    else return "#e60018";      
    }
    
    var equakeinfo = data.features

    // checking that all information was pulled correctly
    console.log(equakeinfo)
    
    //looping through data to find variables needed for the mapping
    for (var i = 0; i < equakeinfo.length; i++) {
        var location = equakeinfo[i].geometry;
        var depth = (location.coordinates[2]);
        var metadata = equakeinfo[i].properties;
        var popupinfo = `<h3>${metadata.place}</h3><hr>
        Magnitude: ${metadata.mag}<br>
        Depth: ${depth} km <br>
        Date: ${new Date(metadata.time)}<br>`;
        
    // setting up the circle marker using location and depth data optained above
        if (location) {
        L.circle([location.coordinates[1],location.coordinates[0]],{
            stroke: true,
            weight: 1,
            fillOpacity: 0.5,
            color: "#000000",
            fillColor: depthColor(depth),
            radius: (metadata.mag * 15000),
            }).addTo(myMap)
            .bindPopup(popupinfo);
        }
    }

    // setting up the legend for the map
        var legend = L.control({
            position: "bottomright"
        });

        legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
            var depths = [-10, 10, 30, 50, 70, 90];
            var colors = ["#00ff00", "#adff2f", "#ffae1a", "#ff6500", "#ff1a32", "#e60018"];
            var labels = [];

        for (var i = 0; i < depths.length; i++){
            labels.push(
                "<i style ='background: " + colors[i] + "'></i> " +
                depths[i] + (depths[i+1] ? "&ndash;" + depths[i+1] + "<br>" :  "+")
            )
        }
        div.innerHTML = labels.join('');
        return div;
    }
    // adding legend to the map 
    legend.addTo(myMap);
    
});
