'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Player Schema
 */
var PlayerSchema = new Schema({
  	id : {type: Schema.ObjectId, required: false},
	name : {
		first: String,
		last: String
	},
	photoUrl : {type: String, required: false},
	bio : {type: String, required: false}
});


mongoose.model('Player', PlayerSchema);
