import { SequenceMetadataClient } from '@0xsequence/metadata'
import { request } from "graphql-request";
import twilio from "twilio";  

class SkyHealth {
  client
  dataArray;
  metadataClient;
  from;

  constructor({ twilio_sid, twilio_auth_token, from, mode }) {
    this.client = twilio(twilio_sid, twilio_auth_token);
    this.dataArray = []
    this.metadataClient = new SequenceMetadataClient()
    this.from = from
  }

  start(numbers: string[], time: number) {
    setInterval(async () => {
      try {
        if(this.dataArray.length > 3) this.dataArray.shift()
        const tvl = await this.getTVLData();
        const prisms = await this.fitTVLtoPrisms(tvl)
        this.dataArray.push({sky: this.aggregateTVLByPrism(prisms)})
        const percentageChangeArray: any = this.calculatePercentageChange(this.dataArray);
        console.log(percentageChangeArray)
        if (Object.keys(percentageChangeArray).length > 0) {
          numbers.map((number: string) => {
            const table = `
                Attribute   |   Average Change
            -----------|------------------
              Strength  |     ${percentageChangeArray.Strength.averageChange}%
              Agility       |     ${percentageChangeArray.Agility.averageChange}%
              Wisdom   |     ${percentageChangeArray.Wisdom.averageChange}%
              Heart        |     ${percentageChangeArray.Heart.averageChange}%
              Intellect    |     ${percentageChangeArray.Intellect.averageChange}%
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