import './App.css'
import * as d3 from "d3"
import BarChart from './components/BarChart'
import Choropleth from './components/Choropleth'
import { useState, useEffect } from 'react'

function App() {

  const [geodata, setGeodata] = useState()
  const [popdata, setPopdata] = useState()
  const [loading, setLoading] = useState(true)

  // On Load
  useEffect(()=>{
    Promise.all([
      d3.json("./data/counties-albers-10m.json"),
      d3.csv("./data/co-est2022-alldata.csv", (c)=>{
        // console.log(c)
        return(c)
      }),
    ])
    .then(([ geojson, popcsv ]) => {
      setGeodata(geojson)
      setPopdata(popcsv)
      setLoading(false)
    })
    return () => undefined
  }, [])

  // // Check that data loaded
  // useEffect(()=>{
  //   console.log("on state, loading", loading)
  //   console.log("on state, geodata", geodata)
  //   console.log("on state, popdata", popdata)
  // }, [geodata, popdata])

  return (
    <div class="container">
      { loading && <div>loading</div> }
      { !loading && <Choropleth geodata={geodata} popdata={popdata} loading={loading}/> }
    </div>
  )
}


export default App;
