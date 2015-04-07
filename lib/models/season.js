'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Season Schema
 */
var SeasonSchema = new Schema({
	id : {type: Schema.ObjectId, required: false},
	name: String,
	startDate: {type: Date, required: false},
	status: Number //0 - future, 1 - current, 2 - past
});


mongoose.model('Season', SeasonSchema);
