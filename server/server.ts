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

function categorizeValue(input) {
    switch (input) {
      case "str":
      case "agi":
      case "wis":
      case "hrt":
      case "int":
        return 0;
      case "agi_str":
      case "wis_str":
      case "hrt_str":
      case "int_str":
      case "agi_wis":
      case "agi_hrt":
      case "agi_int":
      case "hrt_wis":
      case "int_wis":
      case "int_hrt":
        return 1;
      case "light":
      case "mind":
      case "metal":
      case "water":
      case "air":
      case "earth":
      case "dark":
        return 2;
      default:
        return -1; // Return -1 for unknown inputs
    }
  }
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
    origin: ['http://216.128.179.88:3000', 'http://localhost:3000'],
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

app.get('/fire', async (req: any, res: any) => {
    const all = await Stat.find(
        { time_type: '1hr' }, null, { sort: { createdAt: -1 }, limit: 25 },
    );

    let results = {
        tvl_elements: {
            air: [],
            dark: [],
            earth: [],
            fire: [],
            light: [],
            metal: [],
            mind: [],
            water: []
        },
        tvl : {
            str: [],
            agi: [],
            wis: [],
            hrt: [],
            int: []
        }
    }

    let shouldBreak = false;

    const calculatePercentageChange = (currentValue, previousValue) => {
        if (previousValue !== 0) {
            return ((currentValue - previousValue) / previousValue) * 100;
        } else {
            return 0;
        }
    }

    all.map((el: any, i: number) => {
        if (shouldBreak) {
            return; // Skip further iterations
        }
    
        if (i === 23) {
            shouldBreak = true; // Set the flag to break
            return;
        }

        // elements
        results.tvl_elements.air.push(calculatePercentageChange(all[i]!.tvl_elements!.air, all[i+1]!.tvl_elements!.air!))
        results.tvl_elements.dark.push(calculatePercentageChange(all[i]!.tvl_elements!.dark, all[i+1]!.tvl_elements!.dark!))
        results.tvl_elements.earth.push(calculatePercentageChange(all[i]!.tvl_elements!.earth, all[i+1]!.tvl_elements!.earth!))
        results.tvl_elements.fire.push(calculatePercentageChange(all[i]!.tvl_elements!.fire, all[i+1]!.tvl_elements!.fire!))
        results.tvl_elements.light.push(calculatePercentageChange(all[i]!.tvl_elements!.light, all[i+1]!.tvl_elements!.light!))
        results.tvl_elements.metal.push(calculatePercentageChange(all[i]!.tvl_elements!.metal, all[i+1]!.tvl_elements!.metal!))
        results.tvl_elements.mind.push(calculatePercentageChange(all[i]!.tvl_elements!.mind, all[i+1]!.tvl_elements!.mind!))
        results.tvl_elements.water.push(calculatePercentageChange(all[i]!.tvl_elements!.water, all[i+1]!.tvl_elements!.water!))
        
        //prisms
        results.tvl.str.push(calculatePercentageChange(all[i]!.tvl!.str, all[i+1]!.tvl!.str!))
        results.tvl.agi.push(calculatePercentageChange(all[i]!.tvl!.agi, all[i+1]!.tvl!.agi!))
        results.tvl.wis.push(calculatePercentageChange(all[i]!.tvl!.wis, all[i+1]!.tvl!.wis!))
        results.tvl.hrt.push(calculatePercentageChange(all[i]!.tvl!.hrt, all[i+1]!.tvl!.hrt!))
        results.tvl.int.push(calculatePercentageChange(all[i]!.tvl!.int, all[i+1]!.tvl!.int!))

    })

    // console.log(results)

    // const result = {
    //     tvl: {
    //         str: calculatePercentageChange(all[0]!.tvl!.str, all[1]!.tvl!.str),
    //         agi: calculatePercentageChange(all[0]!.tvl!.agi, all[1]!.tvl!.agi),
    //         wis: calculatePercentageChange(all[0]!.tvl!.wis, all[1]!.tvl!.wis),
    //         hrt: calculatePercentageChange(all[0]!.tvl!.hrt, all[1]!.tvl!.hrt),
    //         int: calculatePercentageChange(all[0]!.tvl!.int, all[1]!.tvl!.int),
    //     },
    //     p_val_moon: {
    //         // todo: optimize
    //         str: await calculatePValue(all, 'str'),
    //         agi: await calculatePValue(all, 'agi'),
    //         wis: await calculatePValue(all, 'wis'),
    //         hrt: await calculatePValue(all, 'hrt'),
    //         int: await calculatePValue(all, 'int')
    //     },
    //     tvl_elements: {
    //         air: calculatePercentageChange(all[0]!.tvl_elements!.air, all[1]!.tvl_elements!.air!),
    //         dark: calculatePercentageChange(all[0]!.tvl_elements!.dark, all[1]!.tvl_elements!.dark!),
    //         earth: calculatePercentageChange(all[0]!.tvl_elements!.earth, all[1]!.tvl_elements!.earth!),
    //         fire: calculatePercentageChange(all[0]!.tvl_elements!.fire, all[1]!.tvl_elements!.fire!),
    //         light: calculatePercentageChange(all[0]!.tvl_elements!.light, all[1]!.tvl_elements!.light!),
    //         metal: calculatePercentageChange(all[0]!.tvl_elements!.metal, all[1]!.tvl_elements!.metal!),
    //         mind: calculatePercentageChange(all[0]!.tvl_elements!.mind, all[1]!.tvl_elements!.mind!),
    //         water: calculatePercentageChange(all[0]!.tvl_elements!.water, all[1]!.tvl_elements!.water!)
    //     }
    // };
    // res.send(results);

    function cumulativeSumUsingReduce(arr) {
    return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    function findKeyWithHighestValue(obj) {
        let maxKey = null;
        let maxValue = -Infinity;
      
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (value > maxValue) {
              maxValue = value;
              maxKey = key;
            }
          }
        }
      
        return maxKey;
      }

    function calculateValue(data) {
        const elementTotals = {
          air: 0,
          dark: 0,
          earth: 0,
          fire: 0,
          light: 0,
          metal: 0,
          mind: 0,
          water: 0
        };
      
        const tvlTotals = {
          str: 0,
          agi: 0,
          wis: 0,
          hrt: 0,
          int: 0
        };

        const dualTotals = {
            agi_str: 0,
            wis_str: 0,
            hrt_str: 0,
            int_str: 0,
            agi_wis: 0,
            agi_hrt: 0,
            agi_int: 0,
            hrt_wis: 0,
            int_wis: 0,
            int_hrt: 0
        }
      
        // Your original data
        const originalData = [
            "air, wis_str, agi_wis, int_hrt, agi_hrt",
            "agi_str, air, str, wis",
            "agi_str, light, hrt, int_str",
            "hrt, int, dark",
            "hrt_str, dark, light, mind",
            "mind, str, wis_str, agi",
        ];
      
        // Iterate through each line in the original data
        const total = {
            0: 0,
            1: 0,
            2: 0,
            3: 0, 
            4: 0,
            5: 0
        }

        originalData.forEach((line, i) => {
          const traits = line.split(', ');
          traits.forEach((trait) => {
            if(categorizeValue(trait) == 0){
                // prism
                total[i] = total[i] + Number(cumulativeSumUsingReduce(data.tvl[trait]))
            } else if (categorizeValue(trait) == 1) {
                const prism = trait.split('_')
                // dual
                total[i] = total[i] + Number(cumulativeSumUsingReduce(data.tvl[prism[0]])) + Number(cumulativeSumUsingReduce(data.tvl[prism[1]]))
            } else {
                // elements
                total[i] = total[i]+Number(cumulativeSumUsingReduce(data.tvl_elements[trait]))
            }
          });
        });
        console.log(total)
        return findKeyWithHighestValue(total);
      }
      
      // Call the function with your data
      const result = calculateValue(results);
      console.log(`Value: ${result}`);
      res.send({fire_state: result})
})

app.get('/load', async (req,res) => {
    const raw = [[1,1,1,1,1],[5,5,5,5,5]]
    for(let i = 0; i < raw.length; i++){
        const newStat = new Stat({ moon_period: 0, aspects: [['1','X','0']], time_type: '1hr', tvl: {str : raw[i][0], agi: raw[i][1], wis: raw[i][0], hrt: raw[i][1], int: raw[i][0]}});
        await newStat.save()
    }
    res.sendStatus(200)
})

app.get('/trend', async (req: any, res: any) => {
    const all = await Stat.find(
        {}, null, { sort: { createdAt: -1}, limit: 24*7 },
    );

    const tvlData = {
      str: [],
      agi: [],
      wis: [],
      hrt: [],
      int: [],
    };

    all.forEach((stat: any) => {
      const { str, agi, wis, hrt, int } = stat.tvl;
      tvlData.str.unshift(str);
      tvlData.agi.unshift(agi);
      tvlData.wis.unshift(wis);
      tvlData.hrt.unshift(hrt);
      tvlData.int.unshift(int);
    });

    // console.log(tvlData);
    res.send({tvl: tvlData})
})

app.listen(PORT, async () => {
    console.log(`listening on port: ${PORT}`)
})