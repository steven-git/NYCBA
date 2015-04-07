'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Division Schema
 */
var DivisionSchema = new Schema({
	id : {type: Schema.ObjectId, required: false},
	name: String,
	seasonId: {type: Schema.ObjectId, required: false},
	startDay: Number,
	startDate: {type: Date, required: false},
	isScheduled: {type: Boolean, required: false},
	teams: [{
		teamId: Schema.ObjectId,
		index: Number,
		name: String,
		players: [{
			playerId: Schema.ObjectId,
			name: {
				first: String,
				last: String
			},
			isCaptain: Boolean,
			ppg: Number,
			rpg: Number,
			apg: Number,
			bpg: Number,
			spg: Number
		}],
		wins: Number,
		losses: Number,
		pct: Number,
		gb: Number,
		streak: {
			letter: String,
			number: Number,
		}
	}]
});


mongoose.model('Division', DivisionSchema);
