"use strict";

var station = require('./lib/radioStation');
var play = require('./lib/play');
var media = require('./lib/media');

exports.init = function () {

	station.init();
	media.init();
	play.init();

	Homey.log("VRadio app ready...");
	
}