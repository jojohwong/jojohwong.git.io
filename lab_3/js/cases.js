mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    zoom: 3, // starting zoom
    center: [-100, 40] // starting center
});

const layers = [
    500,
    1000,
    2000,
    5000,
    10000,
    50000,
    100000
];

const colors = [
    '#edf8fb',
    '#bfd3e6',
    '#9ebcda',
    '#8c96c6',
    '#8c6bb1',
    '#88419d',
    '#6e016b'
];

const radii = [2, 4, 6, 8, 10,12,14];

async function geojsonFetch() {
    let response = await fetch('assets/us-covid-2020-counts.geojson');
    let covidCount = await response.json()

    map.on('load', function loadingData() {

        map.addSource('covidCount', {
            type: 'geojson',
            data: covidCount
        });

        map.addLayer({
            'id': 'covidCount-layer',
            'type': 'circle',
            'source': 'covidCount',
            'minizoom': 5,
            'paint': {
                'circle-radius': {
                    'property': 'cases',
                    'stops': [
                        [{
                            zoom: 5,
                            value: layers[0]
                        }, radii[0]],
                        [{
                            zoom: 5,
                            value: layers[1]
                        }, radii[1]],
                        [{
                            zoom: 5,
                            value: layers[2]
                        }, radii[2]],
                        [{
                            zoom: 5,
                            value: layers[3]
                        }, radii[3]],
                        [{
                            zoom: 5,
                            value: layers[4]
                        }, radii[4]],
                        [{
                            zoom: 5,
                            value: layers[5]
                        }, radii[5]],
                        [{
                            zoom: 5,
                            value: layers[6]
                        }, radii[6]]
                    ]
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': [
                        [layers[0], colors[0]],
                        [layers[1], colors[1]],
                        [layers[2], colors[2]],
                        [layers[3], colors[3]],
                        [layers[4], colors[4]],
                        [layers[5], colors[5]],
                        [layers[6], colors[6]]
                    ]
                },
                'circle-opacity': 0.7
                

            }
        });
    });


    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Covid Case Counts<br></b><br>";

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

map.on('click', 'covidCount-layer', (event) => {
    new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>Covid Cases</strong> ${event.features[0].properties.cases}`)
        .addTo(map);
});

// });

}

geojsonFetch();