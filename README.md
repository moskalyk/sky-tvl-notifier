# sky-tvl-notifier
example
```js
    // create sky object
    const sky = new SkyHealth({
        twilio_sid: process!.env.TWILIO_ACCOUNT_SID, 
        twilio_auth_token: process!.env.TWILIO_AUTH_TOKEN, 
        mode: 'prisms',
        from: process.env.TWILIO_FROM
    })

    // params
    const phoneNumber = '+16475555555';
    const time = 60000*60

    // start timer
    sky.start([phoneNumber], time)

    sky.numbers.push(phoneNumber)
```
### units of measure
- 1hr or 24hr (morning / evening)
- moon phase p-value
- aspects prism prediction as multi-variate binary encoding
- pace by % relative or $ equivalence
