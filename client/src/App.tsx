import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { sequence } from '0xsequence'
import { Button, TextInput, Box } from '@0xsequence/design-system'

function App() {
  
  const [init, setInit] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [number, setNumber] = useState<any>('')
  const [ethAuthProof, setEthAuthProof] = useState<any>('')
  const [address, setAddress] = useState<any>('')
  const [confirmed, setConfirmed] = useState<any>(false)

  React.useEffect(() => {
    if(!init){

      setInit(true)
    }
  }, [])

  // strength
  const [STR1hr, setSTR1hr] = useState(0)
  const [STR1day, setStrength1day] = useState<any>("-")
  const [STRPValue, setSTRPValue] = useState(0)

  // agility
  const [AGI1hr, setAGI1hr] = useState(0)
  const [AGI1day, setAGI1day] = useState<any>("-")
  const [AGIPValue, setAGIPValue] = useState(0)

  // wisdom
  const [WIS1hr, setWIS1hr] = useState(0)
  const [WIS1day, setWIS1day] = useState<any>("-")
  const [WISPValue, setWISPValue] = useState(0)

  // heart
  const [HRT1hr, setHRT1hr] = useState(0)
  const [HRT1day, setHRT1day] = useState<any>("-")
  const [HRTPValue, setHRTValue] = useState(0)

  // intellect
  const [INT1hr, setINT1hr] = useState(0)
  const [INT1day, setINT1day] = useState<any>("-")
  const [INTPValue, setINTPValue] = useState(0)

  sequence.initWallet({defaultNetwork: 'polygon'})

  const connect = async () => {
    const wallet = sequence.getWallet();
    const details = await wallet.connect({app: 'sky notifier', authorize: true})
    if(details.connected){
      setIsLoggedIn(true)
      setEthAuthProof(details.proof!.proofString)
      setAddress(details.session!.accountAddress)
    }
  }

  const getTVL = async () => {
    try{
      const res = await fetch('http://localhost:4000/live')
      const json = await res.json()
      console.log(json)
      setSTR1hr(json.tvl.str)
      setAGI1hr(json.tvl.agi)
      setWIS1hr(json.tvl.wis)
      setHRT1hr(json.tvl.hrt)
      setINT1hr(json.tvl.int)
  
      setSTRPValue(json.p_val_moon.str)
      setAGIPValue(json.p_val_moon.agi)
      setWISPValue(json.p_val_moon.wis)
      setHRTValue(json.p_val_moon.hrt)
      setINTPValue(json.p_val_moon.int)

    }catch(err) {
      console.log(err)
    }
  }

  const startPoll = async () => {
    try{
      getTVL()
      setInterval(() => {
        getTVL()
      }, 5000)
    }catch(err){
      console.log(err)
    }
  }

  const submitNumber = async () => {
    console.log(number)
    const res1 = await fetch("http://localhost:4000/signUp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ 
        number: number,
        email: 'mm@horizon.io',
        ethAuthProofString: ethAuthProof,
        wallet: address
      }),
    })

    if(res1.status == 200) {
      setConfirmed(true)
    } else {
      alert('something went wrong, try back another time')
    }
  }

  React.useEffect(() => {
    startPoll()
  }, [])
  return (
    <div className="App">
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <h1 style={{fontFamily: 'Barlow !important'}}>Sky Prisms TVL</h1>
      <br/>
      <br/>
      <br/>
      <br/>
      <div className="rectangle-container">
        <div className="rectangle">
            <img src="https://www.skyweaver.net/images/lore/STR.png" alt="Image 1"/>
            <table className="overlay-table">
              <tr>
                  <td>1 hr</td>
                  <td>{STR1hr.toFixed(2)}%</td>
              </tr>
              <tr>
                  <td>1 day</td>
                  <td>{STR1day == '-' ? STR1day : STR1day.toFixed(2) + "%"}</td>
              </tr>
              <tr>
                  <td>🌕</td>
                  <td>p-value {STRPValue  == null  ? "N/A" : STRPValue.toFixed(2)}</td>
              </tr>
            </table>
        </div>
        <div className="rectangle">
            <img src="https://www.skyweaver.net/images/lore/AGI.png" alt="Image 2"/>
            <table className="overlay-table">
              <tr>
                  <td>1 hr</td>
                  <td>{AGI1hr.toFixed(2)}%</td>
              </tr>
              <tr>
                  <td>1 day</td>
                  <td>{AGI1day == '-' ? AGI1day : AGI1day.toFixed(2) + "%"}</td>
              </tr>
              <tr>
                  <td>🌕</td>
                  <td>p-value {AGIPValue  == null ? 'N/A' : AGIPValue.toFixed(2)}</td>
              </tr>
            </table>
        </div>
        <div className="rectangle">
            <img src="https://www.skyweaver.net/images/lore/WIS.png" alt="Image 3"/>
            <table className="overlay-table">
              <tr>
                  <td>1 hr</td>
                  <td>{WIS1hr.toFixed(2)}%</td>
              </tr>
              <tr>
                  <td>1 day</td>
                  <td>{WIS1day == '-' ? WIS1day : WIS1day.toFixed(2) + "%"}</td>
              </tr>
              <tr>
                  <td>🌕</td>
                  <td>p-value {WISPValue  == null  ? 'N/A' : WISPValue.toFixed(2)}</td>
              </tr>
            </table>
        </div>
        <div className="rectangle">
            <img src="https://www.skyweaver.net/images/lore/HRT.png" alt="Image 4"/>
            <table className="overlay-table">
              <tr>
                  <td>1 hr</td>
                  <td>{HRT1hr.toFixed(2)}%</td>
              </tr>
              <tr>
                  <td>1 day</td>
                  <td>{HRT1day == '-' ? HRT1day : HRT1day.toFixed(2) + "%"}</td>
              </tr>
              <tr>
                  <td>🌕</td>
                  <td>p-value {HRTPValue  == null  ? "N/A" : HRTPValue.toFixed(2)}</td>
              </tr>
            </table>
        </div>
        <div className="rectangle">
            <img src="https://www.skyweaver.net/images/lore/INT.png" alt="Image 5"/>
            <table className="overlay-table">
              <tr>
                  <td>1 hr</td>
                  <td>{INT1hr.toFixed(2)}%</td>
              </tr>
              <tr>
                  <td>1 day</td>
                  <td>{INT1day == '-' ? INT1day : INT1day.toFixed(2) + "%"}</td>
              </tr>
              <tr>
                  <td>🌕</td>
                  <td>p-value {INTPValue == null ? "N/A" : INTPValue.toFixed(2)}</td>
              </tr>
            </table>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      {
        isLoggedIn 
        ? 
        ! confirmed ? 
          <>
            <h3 style={{fontFamily: 'Barlow !important'}}>Input your phone number for SMS</h3>
            <br/>
            <br/>

            <Box justifyContent='center'>
              <TextInput width='16' onChange={(evt: any) => {setNumber(evt.target.value)}}/>
            </Box>
            <br/>
            <br/>

            <div className="v1f8oh-0 iyKoKa" style={{width: '300px'}}>
            <div className="v1f8oh-2 kGJYNM" onClick={() => submitNumber()}>Submit</div>
            <div className="v1f8oh-3 BMCmJ inner-button"></div>
          </div>
          <br/>
            <br/>
            <br/>
            <br/>
          </>
          :
          <>
            <h3 style={{fontFamily: 'Barlow !important'}}>Succcess</h3>
          </>
        :
        <>
          <h3 style={{fontFamily: 'Barlow !important'}}>Free SMS Notifier</h3>
          <br/>
          <div className="v1f8oh-0 iyKoKa" style={{width: '300px'}}>
            <div className="v1f8oh-2 kGJYNM" onClick={() => connect()}>Sign Up</div>
            <div className="v1f8oh-3 BMCmJ inner-button"></div>
          </div>
        </>
      }
    </div>
  );
}

export default App;
