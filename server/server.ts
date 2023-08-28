import * as dotenv from "dotenv";

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import SkyHealth from '../index';
import { auth, signUp } from '.';

dotenv.config();

import { db } from './db'

// create sky object
const sky = new SkyHealth({
    twilio_sid: process!.env.TWILIO_ACCOUNT_SID, 
    twilio_auth_token: process!.env.TWILIO_AUTH_TOKEN, 
    mode: 'prisms',
    from: process.env.TWILIO_FROM
})

sky.start([], 10000)

const fullStream = db.createReadStream();

(async () => {
    for await (const obj of fullStream) {
        console.log(obj)
        sky.numbers.push(obj.number)
    }
})();


const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^(\+1-)?\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
};

const PORT = process.env.PORT || 4000
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
};
  
app.use(cors(corsOptions));
app.use(bodyParser.json())

const ethauthproofandnumber = (req, res, next) => {
    console.log('Middleware executed');
    if(isValidPhoneNumber(req.body.number) && auth(req.body.wallet, req.body.ethAuthProofString)){
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

app.listen(PORT, async () => {
    console.log(`listening on port: ${PORT}`)
})