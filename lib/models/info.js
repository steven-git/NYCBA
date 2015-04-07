'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Info Schema
 */
var InfoSchema = new Schema({
	timeSlots: Array,
	gameDay: Array,
	teamGames: Array
});


mongoose.model('Info', InfoSchema);
