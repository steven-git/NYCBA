'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Team Schema
 */
var TeamSchema = new Schema({
  	id : {type: Schema.ObjectId, required: false},
	name : String,
	players: {type: Array, required: false}
});


mongoose.model('Team', TeamSchema);
