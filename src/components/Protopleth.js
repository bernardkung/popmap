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
  const [activePath, setActivePath] = useState()
  const [neighbors, setNeighbors] = useState([])
  
  // Define features and projections
  const counties = topojson.feature(countydata, countydata.objects.counties)
  const states = topojson.feature(statedata, statedata.objects.states)
  const projection = d3.geoAlbersUsa()
  const geoGenerator = d3.geoPath()
    .projection(projection)


  // Find neighboring counties
  const getNeighbors = (targetGEOID)=>{
    const neighbors = topojson.neighbors(countydata.objects.counties.geometries)
    const ids = counties.features.map(d => d.properties.GEOID)

    const getcontig = id => {
      var result = [];
      var contig = neighbors[ids.indexOf(id)];
      result = contig.map(i => ids[i]);
      return result;
    }

    const neighborhood = counties.features
      .filter(d =>
        getcontig(targetGEOID).includes(d.properties.GEOID)
      )
      .map(d=>"ID" + d.properties.GEOID)

    return neighborhood
  }

  // Set styles for paths
  const activeCountyStyle = {
    fill: "green",
    stroke: "black",
    strokeLinejoin:"round",
    strokeWidth:"0.15",
  }

  const neighborCountyStyle = {
    fill: "blue",
    stroke: "black",
    strokeLinejoin:"round",
    strokeWidth:"0.15",
  }

  const inactiveCountyStyle = {
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

  // Mouse functions
  const onClick = (e)=>{
    if (e.target.id == activePath) {
      setActivePath(null)
    } else {
      setActivePath(e.target.id)
    }
  } 

  const onMouseOver = (e)=>{
    const geoid = e.target.getAttribute('data-geoid')
    setNeighbors(getNeighbors(geoid))
    // const neighbors = getNeighbors(geoid)
    console.log("New neighbors:", neighbors)
  }

  // Determine which style to use
  const setStyle = (id)=>{
    if (id==activePath) {
      return activeCountyStyle
    } else if (id in neighbors) {
      console.log("N", id, activePath)
      return neighborCountyStyle
    }
    return inactiveCountyStyle
  }

  return (
    <svg id="protopleth" style = {{ width: width, height:height }}>

      {/* Counties */}
      {counties.features.map(feature=>(
        <Path 
          feature={feature} 
          style={setStyle("ID" + feature.properties["GEOID"])} 
          key={"ID" + feature.properties["GEOID"]} 
          id={"ID" + feature.properties["GEOID"]}
          geoid={feature.properties["GEOID"]}
          onClick={onClick}
          onMouseOver={onMouseOver}
        />
      ))}


      {/* States */}
      {states.features.map(feature=>(
        <Path 
          feature={feature} 
          style={stateStyle} 
          key={"ID" + feature.properties["STATEFP"]}
          id={"ID" + feature.properties["STATEFP"]} 
          // onClick={onClick}
          // onMouseover={onMouseover}
        />
      ))}

    </svg>
  )
}


export default Protopleth
