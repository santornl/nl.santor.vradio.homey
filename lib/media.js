var station = require('./radioStation')

exports.init = function () {
    Homey.manager('media').on('search', onMediaSearch);
    Homey.manager('media').on('play', onMediaPlay);
};

exports.setTrack = setTrack;

function onMediaSearch (parsedQuery, callback) {

    //Homey.log('parsedQuery', parsedQuery);

    if (!parsedQuery.query) {
        callback([]);
        return;
    }

    var searchQuery = parsedQuery.query;

    if( parsedQuery.fuzzyCategory.artist || parsedQuery.fuzzyCategory.album || parsedQuery.fuzzyCategory.track ) {
        searchQuery = parsedQuery.fuzzy;
    }

    searchResults = station.searchStations(searchQuery).map(function (item) {
            return {
                type: 'track',
                id: item.id,
                title: item.name,
                album: false,
                artist: 'VRadio',
                artwork: item.radio_artwork_small,
                duration: 0,
                confidence: 0.5
            };
        });

    //Homey.log('SearchResults:', searchResults);

    callback(searchResults);
}

function onMediaPlay(id, callback) {

    setTrack(station.getStationById(id));

    callback(null, true);
}

function setTrack (item) {

    //Homey.log('setTrack: ' + item.streaming_url);

    Homey.manager('media').setTrack({
        //type        : 'track',
        id			: item.id,
        title		: item.name,
        artist		: null,
        album		: null,
        duration	: -1,
        artwork		: item.radio_artwork_large,
        stream_url	: item.streaming_url
    });
}