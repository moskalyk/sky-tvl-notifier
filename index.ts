import * as dotenv from "dotenv";

import { SequenceMetadataClient } from '@0xsequence/metadata'
import { request } from "graphql-request";
import twilio from "twilio";  

dotenv.config();

import mongoose from 'mongoose';
import { Stat } from './server/models/Stat'

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
  console.log('now here')
    console.log('Connected to MongoDB');
})
.catch(err => {
  console.log('here')
    console.error('Error connecting to MongoDB:', err);
});

function getPriceWithDeviation() {
  const millisecondsInCycle = 2555200 * 1000; // 2555200 seconds to milliseconds
  const currentTime = Date.now();
  const timeDifference = currentTime - 1689618660000;

  // Calculate the phase of the sine wave (ranging from 0 to 2 * Math.PI)
  const phase = (Math.PI * timeDifference) / millisecondsInCycle;

  // Calculate the deviation factor using the sine function (oscillating between -1 and 1)
  const deviationFactor = Math.sin(phase);

  // Calculate the deviation amount
  return 50 + 50 * deviationFactor;
}

class SkyHealth {
  client
  dataArray;
  metadataClient;
  from;
  numbers;

  constructor({ twilio_sid, twilio_auth_token, from, mode }) {
    this.client = twilio(twilio_sid, twilio_auth_token);
    this.dataArray = []
    this.metadataClient = new SequenceMetadataClient()
    this.from = from
    this.numbers = []
  }

  start(numbers: string[], time: number) {
    this.numbers.push(...numbers)
    setInterval(async () => {
      try {
        if(this.dataArray.length > 3) this.dataArray.shift()
        const tvl = await this.getTVLData();
        const prisms = await this.fitTVLtoPrisms(tvl)
        console.log('TVL')
        const tvlPrisms: any = this.aggregateTVLByPrism(prisms)

        const newStat = new Stat({ 
          moon_period: getPriceWithDeviation(), 
          aspects: [['1','X','0']], 
          time_type: '1hr', 
          tvl: {
            str : tvlPrisms.Strength, 
            agi: tvlPrisms.Agility, 
            wis: tvlPrisms.Wisdom, 
            hrt: tvlPrisms.Heart, 
            int: tvlPrisms.Intellect
          }
        });
        console.log(await newStat.save())

          const all = await Stat.find(
            { time_type: '1hr' }, null, { sort: { createdAt: -1 }, limit: 2 },
          );

        if(all.length >= 2){

        const calculatePercentageChange = (currentValue, previousValue) => {
            if (previousValue !== 0) {
                return ((currentValue - previousValue) / previousValue) * 100;
            } else {
                return 0;
            }
        };
    
        const result = {
            tvl: {
                str: calculatePercentageChange(all[0].tvl.str, all[1].tvl.str),
                agi: calculatePercentageChange(all[0].tvl.agi, all[1].tvl.agi),
                wis: calculatePercentageChange(all[0].tvl.wis, all[1].tvl.wis),
                hrt: calculatePercentageChange(all[0].tvl.hrt, all[1].tvl.hrt),
                int: calculatePercentageChange(all[0].tvl.int, all[1].tvl.int),
            },
        };
          console.log(this.numbers)
          this.numbers.map((number: string) => {
            const table = `
                Attribute   |   Average Change
            -----------|------------------
              Strength  |     ${result.tvl.str}%
              Agility       |     ${result.tvl.agi}%
              Wisdom   |     ${result.tvl.wis}%
              Heart        |     ${result.tvl.hrt}%
              Intellect    |     ${result.tvl.int}%
            
              If you've recieved this message by mistake reach out to mm@horizon.io
            `;
            this.client.messages
              .create({
                body: table,
                from: this.from,
                to: number
              })
              .then((message: any) => console.log(message.sid));
          })
        }

      }catch(err: any){
        console.log('an error occured')
        console.log(err)
      }
    }, time)
  }

  aggregateTVLByPrism(data) {
    const aggregatedTVL = {};
  
    for (const tokenId in data) {
      const { tvl, prism } = data[tokenId];
      
      if (aggregatedTVL.hasOwnProperty(prism)) {
        aggregatedTVL[prism] += parseInt(tvl);
      } else {
        aggregatedTVL[prism] = parseInt(tvl);
      }
    }
  
    return aggregatedTVL;
  }

  async getTVLData(){
    const tokenIds = []
    for(let i = 0; i < 5; i++) {
      const res1: any = await this.fetchNiftySwapTokens(i*400,400)
      tokenIds.push(...res1.tokens)
    }
    return tokenIds;
  }

  async fitTVLtoPrisms(tokens: any){
    let db = {}
    tokens.map((token: any) => {
      db[token.tokenId] = {
        tvl: token.totalValueLocked,
        prism: null
      }
    })

    for(let i = 0; i < Math.floor(tokens.length/50); i++){
      const tokenMetadata = await this.metadataClient.getTokenMetadata({
          chainID: 'polygon',
          contractAddress: '0x631998e91476DA5B870D741192fc5Cbc55F5a52E',
          tokenIDs: tokens.slice(i*50,50*(i+1)).map((tokenId: any) => tokenId.tokenId)
        })

        tokenMetadata.tokenMetadata.map((token: any) => {
          db[token.tokenId] = {
            tvl: db[token.tokenId].tvl,
            prism: token.properties.prism
          }
        })
    }
    return db;
  }

  calculatePercentageChange(dataArray) {
    const aggregatedChange = {};
  
    for (let i = 1; i < dataArray.length; i++) {
      const currentData = dataArray[i];
      const previousData = dataArray[i - 1];
  
      const currentValues = currentData.sky;
      const previousValues = previousData.sky;
  
      for (const stat in currentValues) {
        const currentValue = currentValues[stat];
        const previousValue = previousValues[stat];
  
        const change = currentValue - previousValue;
        const percentage = (change / previousValue) * 100;
  
        if (!aggregatedChange[stat]) {
          aggregatedChange[stat] = {
            totalChange: 0,
            count: 0
          };
        }
  
        aggregatedChange[stat].totalChange += percentage;
        aggregatedChange[stat].count++;
      }
    }
  
    for (const stat in aggregatedChange) {
      aggregatedChange[stat].averageChange = (aggregatedChange[stat].totalChange / aggregatedChange[stat].count).toFixed(2);
      delete aggregatedChange[stat].totalChange;
      delete aggregatedChange[stat].count;
    }
  
    return aggregatedChange;
  }

  async fetchNiftySwapTokens(skip: any, first: number) {
    const endpoint = "https://api.thegraph.com/subgraphs/name/niftyswap/niftyswap";
    const query = `
      query MyQuery {
        tokens(
          where: { exchangeAddress: "0x8bb759bb68995343ff1e9d57ac85ff5c5fb79334", totalValueLocked_gt: "0"},
          first: ${first},
          skip: ${skip}
        ) {
          tokenId
          totalValueLocked
        }
      }
    `;
    try {
      const data: any = await request(endpoint, query);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
}

export default SkyHealth;