import logo from './logo.svg';
import './App.css';
import Tenable from './Tenable';
import React, { useState, useEffect, setState } from 'react';

import { init,  AuthType, Page, EmbedEvent, Action, HostEvent} from '@thoughtspot/visual-embed-sdk';

function App() {
  const[showTenable, setShowTenable] = useState(false)
  const [worksheet,setWorksheet] = useState('fec33004-d42b-44aa-b74c-b33aa47132f0')
  useEffect(() => {
    init({
      thoughtSpotHost: "https://se-thoughtspot-cloud.thoughtspot.cloud/#",
      authType: AuthType.None,
    });
  }, [])
  function toggleShowTenable(){
    setShowTenable(!showTenable)
  }
  return (
    <div className="App">
      <div className="sectionTitle">1. Worksheet ID</div>
      <div style={{display:'flex',flexDirection:'row',alignItems:'center',marginLeft:'15px',marginTop:'15px'}}>
      <input style={{height:'20px',width:'250px',marginRight:'5px'}} value={worksheet} onChange={(e)=>setWorksheet(e.target.value)}></input>
      <div onClick={toggleShowTenable}>Go!</div>
      </div>
      {showTenable ? <Tenable worksheet={worksheet}></Tenable> : null}
    </div>
  );
}

export default App;
