import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
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

const Stat = mongoose.model('Stat', statSchema);

export {
    Stat
}