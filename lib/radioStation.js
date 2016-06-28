var parseString = require('xml2js').parseString;
var http = require('http');

var cacheStations;

exports.init = function () {

    // Get Radio stations

    //Clear cacheStations
    cacheStations = [];

    var options = {
        hostname: Homey.env.VRADIO_STATIONS_HOST,
        path: Homey.env.VRADIO_STATIONS_PATH
    };

    var gsaReq = http.get(options, function (response) {
        var completeResponse = '';
        response.on('data', function (chunk) {
            completeResponse += chunk;
        });
        response.on('end', function() {
            parseString(completeResponse, function (err, result) {

                var source_artwork = Homey.env.VRADIO_ARTWORK_SOURCE;

                mapStations = result.radiostations.radiostation.map(function (item) {
                    //console.log(item);

                    return {
                        id: item.$.id,
                        name: item.naam[0],
                        streaming_url: item.streamingurl[0].replace(/(\r\n|\n|\r)/gm, '').replace('.m3u', ''),
                        radio_artwork_small: source_artwork + 'icon_links/' + item.logo[0],
                        radio_artwork_large: source_artwork + 'icon/' + item.logo[0]
                    };
                });
                
                // Homey don't support .pls radio stations
                var results = mapStations.filter(function(item){
                    return item.streaming_url.indexOf('.pls') == -1;
                });

                cacheStations = results;

                //console.dir(cacheStations);
            });
        })
    }).on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
};

exports.searchStations = function (query) {
    var results;

    name = query.toUpperCase();
    results = cacheStations.filter(function(entry) {
        return entry.name.toUpperCase().indexOf(name) !== -1;
    });
    return results;
};

exports.getStationById = function (id) {
    var results;

    results = cacheStations.filter(function(entry) {
        return entry.id == id;
    });

    if (results.length > 0)
    {
        return results[0];
    }
    else
    {
        Homey.error('Id not found');
    }
    return null;
};