import './App.css'
import * as d3 from "d3"
import Geopleth from './components/Geopleth'
import Tooltip from './components/Tooltip'
import { useState, useEffect } from 'react'

function App() {

  const [topodata, setTopodata] = useState()
  const [countydata, setCountydata] = useState()
  const [statedata, setStatedata] = useState()
  const [popdata, setPopdata] = useState()
  const [loading, setLoading] = useState(true)

  const [location, setLocation] = useState("none")
  const [pop, setPop] = useState(0)
  
  const [tooltipData, setTooltipData] = useState()
  const [activeCounty, setActiveCounty] = useState()
  const [neighbors, setNeighbors] = useState([])

  
  // Set the dimensions and margins of the graph
  const margin = { top: 0, right: 60, bottom: 60, left: 160 }
  const width = 900
  const height = 700
  
  // On Load
  useEffect(()=>{
    Promise.all([
      d3.json("./data/counties-albers-10m.json"),
      d3.json("./data/cb_2022_us_county_20m.json"),
      d3.json("./data/cb_2022_us_state_20m.json"),
      d3.csv("./data/co-est2022-alldata.csv"),
    ])
    .then(([ topojson, countyjson, statejson, popcsv ]) => {
      setTopodata(topojson)
      setCountydata(countyjson)
      setStatedata(statejson)
      setPopdata(popcsv)
      // Manually connect AK and HI to the 48 contiguous states

      setLoading(false)
    })
    return () => undefined
  }, [])

  

  return (
    <div class="container">

      <div className="header">
        <div id="location">{location}</div>
        <div id="pop">{pop}</div>
      </div>

      <Tooltip tooltipData={tooltipData} />

      { !loading && <Geopleth 
          topodata={topodata} 
          countydata={countydata} 
          statedata={statedata} 
          popdata={popdata} 
          pop={pop}
          setPop={setPop}
          setLocation={setLocation}
          setTooltipData={setTooltipData}
        /> }
    </div>
  )
}


export default App;
