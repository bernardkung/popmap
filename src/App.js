import './App.css'
import * as d3 from "d3"
import BarChart from './components/BarChart'
import { useState, useEffect } from 'react'

function App() {

  const [dataset, setDataset] = useState()
  const [loading, setLoading] = useState(true)

  // On Load
  useEffect(()=>{
    Promise.all([
      d3.csv(
        "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv"
      )
    ])
    .then((dataset)=>{
      setDataset(dataset[0])
      setLoading(false)
    })
    return () => undefined
  }, [])

  useEffect(()=>{
    console.log("on state, data", dataset)
    console.log("on state, loading", loading)
  }, [dataset])

  return (
    <div class="container">
      { loading && <div>loading</div> }
      { !loading && <BarChart dataset={dataset} loading={loading} /> }
    </div>
  )
}


export default App;
