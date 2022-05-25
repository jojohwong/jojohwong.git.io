 // initialize basemmap
 mapboxgl.accessToken =
 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
 container: 'map', // container ID
 style: 'mapbox://styles/mapbox/light-v10', // style URL
 zoom: 3, // starting zoom
 center: [-100, 40] // starting center
});

// load data and add as layer
async function geojsonFetch() {
 let response = await fetch('assets/us-covid-2020-rates.geojson');
 let covidRates = await response.json();

 map.on('load', function loadingData() {
     map.addSource('covidRates', {
         type: 'geojson',
         data: covidRates
     });

     map.addLayer({
         'id': 'covidRates-layer',
         'type': 'fill',
         'source': 'covidRates',
         'paint': {
             'fill-color': [
                 'step',
                 ['get', 'rates'],
                 '#fff5f0',
                 20,
                 '#fee0d2',
                 40,
                 '#fcbba1',
                 60,
                 '#fc9272',
                 80,
                 '#fb6a4a',
                 100,
                 '#ef3b2c',
                 150,
                 '#cb181d',
                 200,
                 '#99000d'
             ],
             'fill-outline-color': '#BBBBBB',
             'fill-opacity': 0.7,
         }
     });

     const layers = [
         '0-20%',
         '20%-40%',
         '40%-60%',
         '60%-80%',
         '80%-100%',
         '100%-150%',
         '150%-200%',
         '200% and more'
     ];
     const colors = [
        '#fff5f0',
        '#fee0d2',
        '#fcbba1',
        '#fc9272',
        '#fb6a4a',
        '#ef3b2c',
        '#cb181d',
        '#99000d'
     ];

     // create legend
     const legend = document.getElementById('legend');
     legend.innerHTML = "<b>2020 Covid Rates<br>(people/sq.mi.)</b><br><br>";


     layers.forEach((layer, i) => {
         const color = colors[i];
         const item = document.createElement('div');
         const key = document.createElement('span');
         key.className = 'legend-key';
         key.style.backgroundColor = color;

         const value = document.createElement('span');
         value.innerHTML = `${layer}`;
         item.appendChild(key);
         item.appendChild(value);
         legend.appendChild(item);
     });
 });

 map.on('mousemove', ({point}) => {
     const state = map.queryRenderedFeatures(point, {
         layers: ['covidRates-layer']
     });
     document.getElementById('text-description').innerHTML = state.length ?
         `<h3>${state[0].properties.county}</h3><p><strong><em>${state[0].properties.rates}</strong> people per square mile</em></p>` :
         `<p>Hover over a state!</p>`;
 });
}

geojsonFetch();