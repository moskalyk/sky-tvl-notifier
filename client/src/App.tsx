import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  // strength
  const [STR1hr, setSTR1hr] = useState(0)
  const [STR1day, setStrength1day] = useState(0)

  // agility
  const [AGI1hr, setAGI1hr] = useState(0)
  const [AGI1day, setAGI1day] = useState(0)

  // wisdom
  const [WIS1hr, setWIS1hr] = useState(0)
  const [WIS1day, setWIS1day] = useState(0)

  // heart
  const [HRT1hr, setHRT1hr] = useState(0)
  const [HRT1day, setHRT1day] = useState(0)

  // intellect
  const [INT1hr, setINT1hr] = useState(0)
  const [INT1day, setINT1day] = useState(0)

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
                  <td>{STR1day.toFixed(2)}%</td>
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
                  <td>{AGI1day.toFixed(2)}%</td>
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
                  <td>{WIS1day.toFixed(2)}%</td>
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
                  <td>{HRT1day.toFixed(2)}%</td>
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
                  <td>{INT1day.toFixed(2)}%</td>
              </tr>
            </table>
        </div>
    </div>
    </div>
  );
}

export default App;
