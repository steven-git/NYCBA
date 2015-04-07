'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Game Schema
 */
var GameSchema = new Schema({
	id : {type: Schema.ObjectId, required: false},
	divisionId: {type: Schema.ObjectId, required: false},
	weekNumber: Number,
	day: String,
	date: {type: Date, required: false},
	isPlayed: {type: Boolean, default: false},
	timeSlot: String,
	team1: Number,
	team2: Number,
	team1Scores: {
		teamId: {type: Schema.ObjectId, required: false},
		name: {type: String, required: false},
		points: {type: Number, required: false},
		hasWon: {type: Boolean, required: false},
		players: {type: Array, required: false}
	},
	team2Scores: {
		teamId: {type: Schema.ObjectId, required: false},
		name: {type: String, required: false},
		points: {type: Number, required: false},
		hasWon: {type: Boolean, required: false},
		players: {type: Array, required: false}
	}
});


mongoose.model('Game', GameSchema);
