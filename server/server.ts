import * as dotenv from "dotenv";

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import SkyHealth from '../index';
import { auth, signUp } from '.';

dotenv.config();

import { db } from './db'
import mongoose from 'mongoose';
import { Stat } from './models/Stat'
import ss from 'simple-statistics'

var username = 'mm';
var password = process.env.PASSWORD;
var hosts = 'lon5-c14-0.mongo.objectrocket.com:43793,lon5-c14-1.mongo.objectrocket.com:43793,lon5-c14-2.mongo.objectrocket.com:43793';
var database = 'erc721';
var options = '?replicaSet=faf5ae88bece406282f758108bb2641e';
var connectionString = 'mongodb://' + username + ':' + password + '@' + hosts + '/' + database + options;

// Connect to the remote MongoDB database
console.log(connectionString)
mongoose.connect(connectionString)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// create sky object
const sky = new SkyHealth({
    twilio_sid: process!.env.TWILIO_ACCOUNT_SID, 
    twilio_auth_token: process!.env.TWILIO_AUTH_TOKEN, 
    mode: 'prisms',
    from: process.env.TWILIO_FROM
})

sky.start([], 60000*60)

const fullStream = db.createReadStream();

(async () => {
    // await Stat.deleteMany({}); console.log('cleaned database')
    for await (const obj of fullStream) {
        console.log(obj)
        sky.numbers.push(obj.number)
    }
})();

const isValidPhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^(\+1)?\d{3}\d{3}\d{4}$/;
    return phoneRegex.test(phoneNumber);
};

const PORT = process.env.PORT || 4000
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
};
  
app.use(cors(corsOptions));
app.use(bodyParser.json())

const ethauthproofandnumber = async (req: any, res: any, next: any) => {
    console.log('Middleware executed');
    if(isValidPhoneNumber(req.body.number) && await auth(req.body.wallet, req.body.ethAuthProofString)){
        next(); // Call next to pass control to the next middleware
    } else {
        res.send(400)
    }
};

app.post('/signUp', ethauthproofandnumber, async (req: any, res: any) => {
    try{
        const tx = await signUp(
                            req.body.number,
                            req.body.email,
                        )
        res.send({tx: tx, status: 200})
    }catch(e){
        res.send({msg: e, status: 500})
    }
})

app.get('/live', async (req: any, res: any) => {
    const all = await Stat.find(
        { time_type: '1hr' }, null, { sort: { createdAt: -1 }, limit: 2 },
    );
    if (all.length < 2) {
        res.status(400).send("Not enough data to calculate average change.");
        return;
    }
    const calculatePercentageChange = (currentValue, previousValue) => {
        if (previousValue !== 0) {
            return ((currentValue - previousValue) / previousValue) * 100;
        } else {
            return 0;
        }
    };

    const calculatePValue = async (values: any, prism: string) => {
        const all = await Stat.find(
            {}, null, { sort: { createdAt: -1}, limit: 1000 },
        );
        const tvlValues = all.map(entry => entry.tvl[prism]);
        const moonPeriodValues = all.map(entry => entry.moon_period);
        console.log(tvlValues)
        console.log(moonPeriodValues)
        const p = ss.sampleCorrelation(tvlValues, moonPeriodValues);
        console.log("sample:", p);
        return p
    }

    const result = {
        tvl: {
            str: calculatePercentageChange(all[0]!.tvl!.str, all[1]!.tvl!.str),
            agi: calculatePercentageChange(all[0]!.tvl!.agi, all[1]!.tvl!.agi),
            wis: calculatePercentageChange(all[0]!.tvl!.wis, all[1]!.tvl!.wis),
            hrt: calculatePercentageChange(all[0]!.tvl!.hrt, all[1]!.tvl!.hrt),
            int: calculatePercentageChange(all[0]!.tvl!.int, all[1]!.tvl!.int),
        },
        p_val_moon: {
            // todo: optimize
            str: await calculatePValue(all, 'str'),
            agi: await calculatePValue(all, 'agi'),
            wis: await calculatePValue(all, 'wis'),
            hrt: await calculatePValue(all, 'hrt'),
            int: await calculatePValue(all, 'int')
        },
        tvl_elements: {
            air: calculatePercentageChange(all[0]!.tvl_elements!.air, all[1]!.tvl_elements!.air!),
            dark: calculatePercentageChange(all[0]!.tvl_elements!.dark, all[1]!.tvl_elements!.dark!),
            earth: calculatePercentageChange(all[0]!.tvl_elements!.earth, all[1]!.tvl_elements!.earth!),
            fire: calculatePercentageChange(all[0]!.tvl_elements!.fire, all[1]!.tvl_elements!.fire!),
            light: calculatePercentageChange(all[0]!.tvl_elements!.light, all[1]!.tvl_elements!.light!),
            metal: calculatePercentageChange(all[0]!.tvl_elements!.metal, all[1]!.tvl_elements!.metal!),
            mind: calculatePercentageChange(all[0]!.tvl_elements!.mind, all[1]!.tvl_elements!.mind!),
            water: calculatePercentageChange(all[0]!.tvl_elements!.water, all[1]!.tvl_elements!.water!)
        }
    };
    res.send(result);
})

app.get('/load', async (req,res) => {
    const raw = [[1,1,1,1,1],[5,5,5,5,5]]
    for(let i = 0; i < raw.length; i++){
        const newStat = new Stat({ moon_period: 0, aspects: [['1','X','0']], time_type: '1hr', tvl: {str : raw[i][0], agi: raw[i][1], wis: raw[i][0], hrt: raw[i][1], int: raw[i][0]}});
        await newStat.save()
    }
    res.sendStatus(200)
})

app.listen(PORT, async () => {
    console.log(`listening on port: ${PORT}`)
})