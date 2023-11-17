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
  // const [viewsize, setViewsize] = useState([window.innerWidth, window.innerHeight])
  const [activeId, setActiveId] = useState()
  const [neighborIds, setNeighborIds] = useState([])
  
  // Define features and projections
  const counties = topojson.feature(countydata, countydata.objects.counties)
  const states = topojson.feature(statedata, statedata.objects.states)
  const projection = d3.geoAlbersUsa()
  const geoGenerator = d3.geoPath()
    .projection(projection)


  // Find neighboring counties
  const getNeighbors = (geoid)=>{
    const neighbors = topojson.neighbors(countydata.objects.counties.geometries)
    const ids = counties.features.map(d => d.properties.GEOID)

    const getcontig = id => {
      var result = [];
      var contig = neighbors[ids.indexOf(id)];
      result = contig.map(i => ids[i]);
      return result;
    }

    // // Returns the actual paths
    // const neighborhood = counties.features
    //   .filter(d =>
    //     getcontig(targetGEOID).includes(d.properties.GEOID)
    //   )
    const neighborhood = counties.features
      .filter(d =>
        getcontig(geoid).includes(d.properties.GEOID)
      )
      .map(d =>
        d.properties.GEOID
      )

    return neighborhood
    // return []
  }

  // Set styles for paths
  const countyStyle = {
    active: {
      fill: "green",
      stroke: "black",
      strokeLinejoin:"round",
      strokeWidth:"0.15",
    },
    neighbor: {
      fill: "blue",
      stroke: "black",
      strokeLinejoin:"round",
      strokeWidth:"0.15",
    },
    inactive: {
      fill: "white",
      stroke: "black",
      strokeLinejoin:"round",
      strokeWidth:"0.15",
    },
  }

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

  // Determine which style to use
  const selectStyle = (id)=>{
    if (id==activeId) {
      return activeCountyStyle
    } else if (neighborIds.includes(id)) {
      console.log("N", id, activeId)
      return neighborCountyStyle
    }
    return inactiveCountyStyle
  }


  // Mouse functions
  const onClick = (e)=>{
    const geoid = e.target.getAttribute('data-geoid')
    setNeighborIds(getNeighbors(geoid))
    console.log("new neighbors", neighborIds)
    if (geoid in neighborIds) {
      console.log("N", geoid, activeId)
    }
  } 

  const onRightClick = (e)=>{
    e.preventDefault()
    const geoid = e.target.getAttribute('data-geoid')
    if (geoid == activeId) {
      setActiveId(null)
    } else {
      setActiveId(geoid)
    }
  }

  const onMouseOver = (e)=>{
    // const geoid = e.target.getAttribute('data-geoid')
    // setNeighborIds(getNeighbors(geoid))
    // // const neighbors = getNeighbors(geoid)
    // console.log("New neighbors:", neighborIds)
    // console.log("mouseover")
  }

  return (
    <svg id="protopleth" style = {{ width: width, height:height }}>

      {/* Counties */}
      {counties.features.map(feature=>(
        <Path 
          feature={feature} 
          style={selectStyle(feature.properties["GEOID"])} 
          key={"ID" + feature.properties["GEOID"]} 
          id={"ID" + feature.properties["GEOID"]}
          geoid={feature.properties["GEOID"]}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onRightClick={onRightClick}
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
