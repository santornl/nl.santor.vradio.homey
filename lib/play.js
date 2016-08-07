var station = require('./radioStation');
var media = require('./media');
var trigger = require('./trigger');

exports.init = function () {
    var flow = Homey.manager('flow');
    flow.on('action.playRadio', onFlowActionPlay) ;
    flow.on('action.playRadio.source.autocomplete', onFlowActionPlayAutocomplete);
    flow.on('action.playUrlRadio', onFlowActionPlayUrl) ;
    flow.on('action.playUrlRadio.source.autocomplete', onFlowActionPlayAutocomplete);
};

function onFlowActionPlayAutocomplete (callback, value) {

    //Homey.log('search autocomplete', value);

    searchResults = station.searchStations(value.query).map(function (item) {
        return {
            id: item.id,
            image: item.radio_artwork_small,
            name: item.name,
            description: '',
            streaming_url: item.streaming_url,
            radio_artwork_large: item.radio_artwork_large
        };
    });
    
    callback(null, searchResults);
}

function onFlowActionPlay (callback, args) {

    //Homey.log('play args=', args);

    var item = args.source;

    if (item)
    {
        media.setTrack(item);
    }

    callback( null, true );
}

function onFlowActionPlayUrl (callback, args) {

    var item = args.source;

    if (item)
    {
        trigger.triggerRadioChanged(item, callback);
    }

    callback( null, true );
}