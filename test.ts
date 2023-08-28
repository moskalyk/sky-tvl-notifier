import * as dotenv from "dotenv";

dotenv.config();

import SkyHealth from './index';

(async () => {

    // create sky object
    const sky = new SkyHealth({
        twilio_sid: process!.env.TWILIO_ACCOUNT_SID, 
        twilio_auth_token: process!.env.TWILIO_AUTH_TOKEN, 
        mode: 'prisms',
        from: process.env.TWILIO_FROM
    })

    // params
    const phoneNumber = '+16479140157';
    const time = 60000*60

    // start timer
    sky.start([phoneNumber], time)

    sky.numbers.push(phoneNumber)

})()