"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stat = void 0;
var mongoose_1 = require("mongoose");
var statSchema = new mongoose_1.default.Schema({
    moon_period: Number,
    aspects: [[String]],
    time_type: String,
    tvl: {
        str: Number,
        agi: Number,
        wis: Number,
        hrt: Number,
        int: Number
    },
    tvl_elements: {
        air: Number,
        dark: Number,
        fire: Number,
        earth: Number,
        light: Number,
        metal: Number,
        mind: Number,
        water: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
var Stat = mongoose_1.default.model('Stat', statSchema);
exports.Stat = Stat;
