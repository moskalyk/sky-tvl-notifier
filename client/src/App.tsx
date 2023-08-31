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

  // elements
  const [air, setAir] = useState(0)
  const [dark, setDark] = useState(0)
  const [earth, setEarth] = useState(0)
  const [fire, setFire] = useState(0)
  const [light, setLight] = useState(0)
  const [metal, setMetal] = useState(0)
  const [mind, setMind] = useState(0)
  const [water, setWater] = useState(0)

  const [hidden, setHidden] = useState<boolean>(true)

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

      // set tvls for prisms
      setSTR1hr(json.tvl.str)
      setAGI1hr(json.tvl.agi)
      setWIS1hr(json.tvl.wis)
      setHRT1hr(json.tvl.hrt)
      setINT1hr(json.tvl.int)
      
      // set pvalues
      setSTRPValue(json.p_val_moon.str)
      setAGIPValue(json.p_val_moon.agi)
      setWISPValue(json.p_val_moon.wis)
      setHRTValue(json.p_val_moon.hrt)
      setINTPValue(json.p_val_moon.int)

      // set tvls for elements
      setAir(json.tvl_elements.air)
      setDark(json.tvl_elements.dark)
      setEarth(json.tvl_elements.earth)
      setFire(json.tvl_elements.fire)
      setLight(json.tvl_elements.light)
      setMetal(json.tvl_elements.metal)
      setMind(json.tvl_elements.metal)
      setWater(json.tvl_elements.water)

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

  React.useEffect(() => {
    
    // Function to check scroll position and set the boolean flag
    function checkScrollPosition() {
      const scrollPosition = window.scrollY || window.pageYOffset; // Get current scroll position
      // const windowHeight = window.innerHeight; // Get the height of the viewport
      const windowHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight); // Get the full page height
      const scrollThreshold = windowHeight * 0.08; // 20% of viewport height

      if (scrollPosition >= scrollThreshold) {
        setHidden(false)
        console.log('here')
      } else {
        setHidden(true)
        console.log(scrollThreshold)
        console.log(scrollPosition)
      }
    }
    // Attach the event listener to the scroll event
    window.addEventListener('scroll', checkScrollPosition);
    // Call the function initially to set the flag based on initial scroll position
    checkScrollPosition();

    if (window.innerWidth <= 768) {
      // Code to run when on a mobile device
      console.log("Mobile device detected");
      setHidden(false)
    } 
  }, [hidden])

  return (
    <div className="App">
      <br/>
      <br/>
      <br/>
      <br/>
      { !hidden ? <div style={{position: 'fixed', bottom: '40px', left: '22vw'}}>
      <span style={{left: '-70px', padding: '0px', position: 'absolute'}}>1 hr</span>

      <div style={{width: '20px', position:'absolute', left: '0px' , bottom: '5px'}}  className="Sprinkles_marginLeft_8px_base__cc72q5mr IconSprinkles_height_14px_base__u4w7ikf IconSprinkles_IconStyle__u4w7ik0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" className="horizon-icon IconSprinkles_height_14px_base__u4w7ikf"><path fill="rgb(113, 198, 184)" d="M27.53,11a13.31,13.31,0,0,1,15.9,1.73A16.57,16.57,0,0,0,29.44,4h0A16.55,16.55,0,0,0,13.51,26.89,13.28,13.28,0,0,1,7.06,12.27,16.57,16.57,0,0,0,34.28,31.09,13.28,13.28,0,0,1,24.84,44a16.57,16.57,0,0,0,2.69-33ZM25.19,28.48a5.48,5.48,0,0,1-5.61-5.38.88.88,0,0,1,0-.23,5.5,5.5,0,0,1,11-.15v.15A5.48,5.48,0,0,1,25.19,28.48Z"></path></svg></div>
      <span style={{left: '-8px', padding: '0px', position: 'absolute'}}>{air.toFixed(2)}%</span>

      <div style={{width: '20px', position:'absolute', left: '100px' , bottom: '5px'}}  className="Sprinkles_marginLeft_8px_base__cc72q5mr IconSprinkles_height_14px_base__u4w7ikf IconSprinkles_IconStyle__u4w7ik0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" className="horizon-icon IconSprinkles_height_14px_base__u4w7ikf"><path fill="rgb(109, 58, 112)" d="M24,6h0A18,18,0,1,0,42,24,18,18,0,0,0,24,6ZM11.4,24A12.58,12.58,0,0,1,30.48,13.21H30.3a10.8,10.8,0,0,0,0,21.6h.18A12.58,12.58,0,0,1,11.4,24Z"></path></svg></div>
      <span style={{left: '92px', padding: '0px', position: 'absolute'}}>{dark.toFixed(2)}%</span>
      
      <div style={{width: '20px', position:'absolute', left: '200px', bottom: '5px'}} className="Sprinkles_marginLeft_8px_base__cc72q5mr IconSprinkles_height_14px_base__u4w7ikf IconSprinkles_IconStyle__u4w7ik0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" className="horizon-icon IconSprinkles_height_14px_base__u4w7ikf"><path fill="rgb(50, 193, 30)" d="M42.79,14.5C30.48,14.5,25.7,21.77,24,29.16,22.3,21.77,17.52,14.5,5.21,14.5c0,0-1.14,10,7.63,12,13,3,11.37,10,5.37,18H29.79c-6-8-7.63-15,5.37-18C43.93,24.48,42.79,14.5,42.79,14.5Z"></path><path fill="rgb(50, 193, 30)" d="M24,21.11a19,19,0,0,1,5.11-5.6,18.92,18.92,0,0,0-5.29-12,18.89,18.89,0,0,0-5.28,11.75A18.83,18.83,0,0,1,24,21.11Z"></path></svg></div>
      <span style={{left: '192px', padding: '0px', position: 'absolute'}}>{earth.toFixed(2)}%</span>

      <div style={{width: '20px', position:'absolute', left: '300px' , bottom: '5px'}} className="Sprinkles_marginLeft_8px_base__cc72q5mr IconSprinkles_height_14px_base__u4w7ikf IconSprinkles_IconStyle__u4w7ik0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" className="horizon-icon IconSprinkles_height_14px_base__u4w7ikf"><path fill="rgb(244, 11, 11)" d="M19.87,4c11.79,5.48,14.06,12.81,9.42,21.34,4.28-2.3,6.13-5.68,4.33-10.59C37.75,17.52,39.93,23,39.84,29c-.13,7.93-4.21,12.89-9.4,15a10.9,10.9,0,0,0,1.72-6c0-5.08-3.27-9.25-7.46-9.73a5.83,5.83,0,1,1-8.63,6.59A11.45,11.45,0,0,0,15.63,38a10.92,10.92,0,0,0,1.47,5.56C12.16,41.25,8.33,36.35,8.17,29c-.13-5.75,2.09-9.55,7.15-12.32-1.91,3.58-1.17,7.74.87,9.47C14.85,17.4,28.14,12.66,19.88,4h0Z"></path></svg></div>
      <span style={{left: '292px', padding: '0px', position: 'absolute'}}>{fire.toFixed(2)}%</span>

      <div style={{width: '20px', position:'absolute', left: '400px' , bottom: '5px'}}  className="Sprinkles_marginLeft_8px_base__cc72q5mr IconSprinkles_height_14px_base__u4w7ikf IconSprinkles_IconStyle__u4w7ik0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" className="horizon-icon IconSprinkles_height_14px_base__u4w7ikf"><path fill="rgb(221, 191, 42)" d="M43.71,23.52l-8.25-4.35,2.82-8.76a.56.56,0,0,0-.69-.69l-8.76,2.82L24.48,4.29a.54.54,0,0,0-1,0l-4.35,8.25L10.41,9.72a.56.56,0,0,0-.69.69l2.82,8.76L4.29,23.52a.54.54,0,0,0,0,1l8.25,4.35L9.72,37.59a.56.56,0,0,0,.69.69l8.76-2.82,4.35,8.25a.54.54,0,0,0,1,0l4.35-8.25,8.76,2.82a.56.56,0,0,0,.69-.69l-2.82-8.76,8.25-4.35a.54.54,0,0,0,0-1Zm-14.16,6A7.85,7.85,0,1,1,31.85,24,7.8,7.8,0,0,1,29.55,29.55Z"></path></svg></div>
      <span style={{left: '392px', padding: '0px', position: 'absolute'}}>{light.toFixed(2)}%</span>
      
      <div style={{width: '20px', position:'absolute', left: '500px' , bottom: '5px'}} className="Sprinkles_marginLeft_8px_base__cc72q5mr IconSprinkles_height_14px_base__u4w7ikf IconSprinkles_IconStyle__u4w7ik0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" className="horizon-icon IconSprinkles_height_14px_base__u4w7ikf"><path fill="rgb(181, 181, 143)" d="M24.2,14l7.37,10.17L23.8,34,16.43,23.87,24.2,14m.19-10-.53.68L9.22,23.35l-.3.38.29.4L23.1,43.31l.51.69.53-.68L38.78,24.65l.3-.38-.29-.4L24.9,4.7,24.39,4Z"></path></svg></div>
      <span style={{left: '492px', padding: '0px', position: 'absolute'}}>{metal.toFixed(2)}%</span>
     
      
      <div style={{width: '20px', position:'absolute', left: '600px' , bottom: '5px'}}  className="Sprinkles_marginLeft_8px_base__cc72q5mr IconSprinkles_height_14px_base__u4w7ikf IconSprinkles_IconStyle__u4w7ik0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" className="horizon-icon IconSprinkles_height_14px_base__u4w7ikf"><path fill="rgb(136, 48, 239)" d="M40.74,26.33c-.46-1.87-2.26-4.54-3.72-6.52C38.48,8.77,31.91,4,21.21,4A13.6,13.6,0,0,0,7.26,17.49c0,7,3.25,10.23,6.45,13.54A32.44,32.44,0,0,1,11,44h17.7a16.9,16.9,0,0,1,.17-7.85c1.66-.06,5.38.87,7.71.41a16.77,16.77,0,0,0,.93-4.65V31l.93-.47a27.09,27.09,0,0,0,0-3.72C38.88,26.79,40.28,26.79,40.74,26.33ZM22,25c-5,0-9-3.36-9-7.5S17,10,22,10s9,3.36,9,7.5S27,25,22,25Z"></path></svg></div>
      <span style={{left: '592px', padding: '0px', position: 'absolute'}}>{mind.toFixed(2)}%</span>
     
      <div style={{width: '20px', position:'absolute', left: '700px' , bottom: '5px'}} className="Sprinkles_marginLeft_8px_base__cc72q5mr IconSprinkles_height_14px_base__u4w7ikf IconSprinkles_IconStyle__u4w7ik0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" className="horizon-icon IconSprinkles_height_14px_base__u4w7ikf"><path fill="rgb(98, 153, 232)" d="M24,18c1.05,1.92,2.06,3.67,3,5.28,1.71,2.95,3.32,5.73,3.69,7.23a5.56,5.56,0,0,1-1,5A7.12,7.12,0,0,1,24,38a7.13,7.13,0,0,1-5.73-2.56,5.57,5.57,0,0,1-.95-5c.38-1.5,2-4.28,3.69-7.23.93-1.61,1.94-3.36,3-5.28M24,4C19,16.5,12.75,24,11.5,29c-2,8.13,4.22,15,12.5,15s14.51-7,12.5-15C35.25,24,29,16.5,24,4Z"></path></svg></div>
      <span style={{left: '692px', padding: '0px', position: 'absolute'}}>{water.toFixed(2)}%</span>
      
      </div> : null }
      <br/>
      <img style={{width: '50px', marginLeft: '-32px', position:'absolute'}} src="https://www.skyweaver.net/images/skyweaver-symbol.svg"></img>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <h1 style={{fontFamily: 'Barlow !important'}}>Sky Prisms TVL</h1>
      <br/>
      <br/>
      <div className="rectangle-container">
        <div className="rectangle">
            <img src="https://www.skyweaver.net/images/lore/STR.png" alt="Image 1"/>
            <table className="overlay-table">
              <tr>
                  <td>1 hr</td>
                  <td>{STR1hr.toFixed(3)}%</td>
              </tr>
              {/* <tr>
                  <td>1 day</td>
                  <td>{STR1day == '-' ? STR1day : STR1day.toFixed(2) + "%"}</td>
              </tr> */}
              <tr>
                  <td>🌕</td>
                  <td>{STRPValue  == null  ? "N/A" : STRPValue.toFixed(2)}</td>
              </tr>
            </table>
        </div>
        <div className="rectangle">
            <img src="https://www.skyweaver.net/images/lore/AGI.png" alt="Image 2"/>
            <table className="overlay-table">
              <tr>
                  <td>1 hr</td>
                  <td>{AGI1hr.toFixed(3)}%</td>
              </tr>
              {/* <tr>
                  <td>1 day</td>
                  <td>{AGI1day == '-' ? AGI1day : AGI1day.toFixed(2) + "%"}</td>
              </tr> */}
              <tr>
                  <td>🌕</td>
                  <td>{AGIPValue  == null ? 'N/A' : AGIPValue.toFixed(2)}</td>
              </tr>
            </table>
        </div>
        <div className="rectangle">
            <img src="https://www.skyweaver.net/images/lore/WIS.png" alt="Image 3"/>
            <table className="overlay-table">
              <tr>
                  <td>1 hr</td>
                  <td>{WIS1hr.toFixed(3)}%</td>
              </tr>
              {/* <tr>
                  <td>1 day</td>
                  <td>{WIS1day == '-' ? WIS1day : WIS1day.toFixed(2) + "%"}</td>
              </tr> */}
              <tr>
                  <td>🌕</td>
                  <td>{WISPValue  == null  ? 'N/A' : WISPValue.toFixed(2)}</td>
              </tr>
            </table>
        </div>
        <div className="rectangle">
            <img src="https://www.skyweaver.net/images/lore/HRT.png" alt="Image 4"/>
            <table className="overlay-table">
              <tr>
                  <td>1 hr</td>
                  <td>{HRT1hr.toFixed(3)}%</td>
              </tr>
              {/* <tr>
                  <td>1 day</td>
                  <td>{HRT1day == '-' ? HRT1day : HRT1day.toFixed(2) + "%"}</td>
              </tr> */}
              <tr>
                  <td>🌕</td>
                  <td>{HRTPValue  == null  ? "N/A" : HRTPValue.toFixed(2)}</td>
              </tr>
            </table>
        </div>
        <div className="rectangle">
            <img src="https://www.skyweaver.net/images/lore/INT.png" alt="Image 5"/>
            <table className="overlay-table">
              <tr>
                  <td>1 hr</td>
                  <td>{INT1hr.toFixed(3)}%</td>
              </tr>
              {/* <tr>
                  <td>1 day</td>
                  <td>{INT1day == '-' ? INT1day : INT1day.toFixed(2) + "%"}</td>
              </tr> */}
              <tr>
                  <td>🌕</td>
                  <td>{INTPValue == null ? "N/A" : INTPValue.toFixed(2)}</td>
              </tr>
            </table>
        </div>
      </div>
      <br/>
      <br/>
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
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>
  );
}

export default App;
