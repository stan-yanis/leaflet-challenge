// Declares a constant variable named url and assigns it a string value. This string represents the URL from which you're fetching JSON data.
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Uses d3.json() to fetch JSON data from a specified URL and logs the loaded data to the console.
d3.json(url).then(function(data) {
    console.log("Loaded JSON data:", data);
    let features = data.features;
    console.log(features);


//Map Object
let myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
});


//Layer Object
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Adding a legend
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  let div = L.DomUtil.create('div', 'legend');
  let depthRanges = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700];
  
  div.innerHTML += '<h4>Depth Legend</h4>';


  // Loop through depth ranges and create a colored square for each
  for (let i = 0; i < depthRanges.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(depthRanges[i] + 1) + '"></i> ' +
          depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(myMap);


features.forEach(function(earthquake) {
    let coordinates = earthquake.geometry.coordinates;
    let latitude = coordinates[1];
    let longitude = coordinates[0];

    let magnitude = earthquake.properties.mag;
    let depth = coordinates[2]

    // Calculate marker size based on magnitude
    let markerSize = magnitude * 5;

    // Calculate marker color based on depth
    let markerColor = getColor(depth);

    // Create a marker with size and color
    let marker = L.circleMarker([latitude, longitude], {
        radius: markerSize,
        fillColor: markerColor,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(myMap);


    // Create a popup with additional information
    let popupContent = `
    <strong>Magnitude:</strong> ${magnitude} Mw<br>
    <strong>Depth:</strong> ${depth} km<br>
    <strong>Location:</strong> ${earthquake.properties.place}
    `;



    marker.bindPopup(popupContent);
});

}).catch(function(error) {
    console.error('Error fetching earthquake data:', error);
});


// Function to determine marker color based on depth
function getColor(depth) {
    // Customize the color scale based on your preferences
    let colorScale = d3.scaleLinear()
        // .domain method sets the input range of values,
        // .range method sets the corresponding output range of colors in the color scale.
        .domain([0, 700])  // the domain based on the actual depth range in the data

        // 0 corresponds to '#00ff00' (green):
        // When the input value (depth) is 0,the scale returns the starting color of the range,
        // which is green.
        // 700 corresponds to '#ff0000' (red):
        // When the input value (depth) is 700, the scale returns the ending color of the range,
        // which is red.
        .range(['#00ff00', '#ff0000']);    

    return colorScale(depth);

}



    
  




