import * as d3 from "d3";
import { render } from 'react-dom'
import * as topojson from "topojson-client"
import { useState, useEffect, useRef } from "react"
import geoAlbersUsaPr  from "./geoAlbersUsaPr"
import Path from './Path'

const Protopleth = ({ topodata, countydata, statedata, popdata, setPop, setLocation }) => {
// Get React to render the svg and paths so that it's not contesting D3 for control of the DOM



  // Set the dimensions and margins of the graph
  const margin = { top: 0, right: 60, bottom: 60, left: 160 }
  const width = 900
  const height = 700

  // Dynamic dimensions
  const [viewsize, setViewsize] = useState([window.innerWidth, window.innerHeight])


  // Define features and projections
  const counties = topojson.feature(countydata, countydata.objects.counties)
  const states = topojson.feature(statedata, statedata.objects.states)
  const projection = d3.geoAlbersUsa()
  const geoGenerator = d3.geoPath()
    .projection(projection)

  const test_county = counties.features[0]


  const changeFill = ()=>{
    console.log(d3.select(".target"))
    d3.select(".target").style("fill", "green")
  }
  const onClick = (e)=>{
    console.log(e.target)
    changeFill(e)
  } 

  // <path 
  // d={geoGenerator(feature)}
  // key={"ID" + feature.properties.GEOID}
  // // className="pathPassive"
  // style={{
  //   fill: "white",
  //   stroke: "black",
  //   strokeLinejoin:"round",
  //   strokeWidth:"0.15",
  // }}
  // // fill="white"
  // // stroke="black"
  // // strokeLinejoin="round"
  // // strokeWidth="0.15"
  // onClick={onClick}
  const countyStyle = {
    fill: "white",
    stroke: "black",
    strokeLinejoin:"round",
    strokeWidth:"0.15",
  }

  const stateStyle = {
    fill: "none",
    stroke: "black",
    strokeLinejoin:"round",
    strokeWidth:"0.55",
  }


  return (
    <svg id="protopleth" style = {{ width: width, height:height }}>

      {/* Counties */}
      {counties.features.map(feature=>(
        <Path 
          feature={feature} 
          style={countyStyle} 
          key={"ID" + feature.properties["GEOID"]} 
        />
      ))}


      {/* States */}
      {states.features.map(feature=>(
        <Path 
          feature={feature} 
          style={stateStyle} 
          key={"ID" + feature.properties["STATEFP"]} 
          />
      ))}

    </svg>
  )
}


export default Protopleth
