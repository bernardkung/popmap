import './App.css'
import * as d3 from "d3"
import BarChart from './components/BarChart'
import Protopleth from './components/Protopleth'
import Geopleth from './components/Geopleth'
import { useState, useEffect } from 'react'

function App() {

  const [topodata, setTopodata] = useState()
  const [countydata, setCountydata] = useState()
  const [statedata, setStatedata] = useState()
  const [popdata, setPopdata] = useState()
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState("none")
  const [pop, setPop] = useState(0)
  const [geoplethdiv, setGeoplethdiv] = useState(<div>no div</div>)

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
      setLoading(false)
    })
    return () => undefined
  }, [])

  // Check that data loaded
  // useEffect(()=>{
    // console.log("on state, loading", loading)
    // console.log("on state, topodata", topodata)
    // console.log("on state, countydata", countydata)
    // console.log("on state, statedata", statedata)
    // console.log("on state, popdata", popdata)
  // })

  // useEffect(()=>{
  //   if (!loading) {
  //     setGeoplethdiv(
  //       <Geopleth 
  //         topodata={topodata} 
  //         countydata={countydata} 
  //         statedata={statedata} 
  //         popdata={popdata} 
  //         setPop={setPop}
  //         setLocation={setLocation}
  //         setGeoplethdiv={setGeoplethdiv}
  //       />
  //     )
  //   }
  // }, [loading])

  return (
    <div class="container">
      <div id="pop">{pop}</div>
      <div id="location">{location}</div>
      {/* { loading && <div>loading</div> } */}
      { !loading && <Geopleth 
        topodata={topodata} 
        countydata={countydata} 
        statedata={statedata} 
        popdata={popdata} 
        setPop={setPop}
        setLocation={setLocation}
      /> }
      { !loading && <Protopleth 
        topodata={topodata} 
        countydata={countydata} 
        statedata={statedata} 
        popdata={popdata} 
        setPop={setPop}
        setLocation={setLocation}
      /> }
    </div>
  )
}


export default App;
