import * as d3 from "d3";
import { render } from 'react-dom'
import * as topojson from "topojson-client"
import { useState, useEffect, useRef } from "react"
import geoAlbersUsaPr  from "./geoAlbersUsaPr"
import Path from './Path'

const Geopleth = ({ topodata, countydata, statedata, popdata, pop, setPop, setLocation }) => {
// Get React to render the svg and paths so that it's not contesting D3 for control of the DOM

  console.log(countydata)

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
  const neighbors = topojson.neighbors(countydata.objects.counties.geometries)
  const ids = counties.features.map(d => d.properties.GEOID)
  // const neighborDict = ids.map((x,i)=>{return {[x]: neighbors[i]}})
  // Mapping function to crosswalk population and topojson
  const valuemap = new Map(popdata.map(p => [p.STATE + p.COUNTY, p.POPESTIMATE2022]));

  // Find neighboring counties
  const getNeighbors = (geoid)=>{
    // const neighbors = topojson.neighbors(countydata.objects.counties.geometries)
    // const ids = counties.features.map(d => d.properties.GEOID)
    const getcontig = id => {
      // const result = [];
      const contig = neighbors[ids.indexOf(id)];
      const result = contig.map(i => ids[i]);
      return result;
    }

    const neighborhood = counties.features
      .filter(d => getcontig(geoid).includes(d.properties.GEOID))
      .map(d => d.properties.GEOID)

    return neighborhood
  }

  const getArrayNeighbors = (geoids)=>{
    const getcontigs = geoids => {
      return geoids.map(geoid => {
        const index = neighbors[ids.indexOf(geoid)]
        const result = index.map(i => ids[i])
        return result
      }).flat(Infinity)
      // return contigs
    }

    // List of all neighboring GEOIDS
    const contigs = getcontigs(geoids)
    // const neighborhoodIds = [...new Set(contigs.filter(c=>!geoids.includes(c)))]

    // List of all neighboring FEATURES, and reduced to only GEOIDS
    const neighborhood = counties.features
      // Filter for neighbors
      .filter(d => getcontigs(geoids).includes(d.properties.GEOID))
      // Remove original array
      .filter(d => !geoids.includes(d.properties.GEOID))
      .sort((a, b)=>{
        const aPop = parseInt(valuemap.get(a.properties.GEOID))
        const bPop = parseInt(valuemap.get(b.properties.GEOID)) 
        return aPop < bPop ? -1 : aPop > bPop ? 1 : 0
      })
      // .map(d => d.properties.GEOID)
      
    const neighborhoodPop = neighborhood
        .map(d=>[d.properties.GEOID, valuemap.get(d.properties.GEOID)])
    console.log("neighborhood", neighborhoodPop)

    const neighborhoodIds = neighborhood.map(d=>d.properties.GEOID)
    // return neighborhoodIds
    return neighborhoodIds
  }

  const checkCounties = (geoids, neighborGeoids, targetPop, totalPop)=>{
    console.log("checking", geoids, "target:", targetPop, "total:", totalPop )
    // Loop through each neighbor and check if target pop has been reached
    for (let i = 0; i < neighborGeoids.length; i++) {
      const geoid = neighborGeoids[i]
      const countyPop = parseInt(valuemap.get(geoid))
      console.log("loop", "geoid:", geoid, "pop:", countyPop, "target:", targetPop, "total:", totalPop )
      // Exit case: target pop exceeded
      if (countyPop + parseInt(totalPop) > parseInt(targetPop)) {
        console.log("exiting", geoids, "target:", targetPop, "total:", totalPop )
        return geoids
      } else {
        // Add the neighbor to array of geoids and increase the population
        totalPop += parseInt(countyPop)
        geoids.push(geoid)
      }
    }
    console.log("results", geoids, "target:", targetPop, "total:", totalPop )
    // If all counties have been checked
    // generate a new set of neighboring counties
    const newNeighbors = getArrayNeighbors(geoids)
    console.log("new neighbors", newNeighbors)
    // Second exit condition for error handling
    if (newNeighbors.length==0) {
      console.log("exiting", geoids, "target:", targetPop, "total:", totalPop )
      return geoids
    }
    return checkCounties(geoids, newNeighbors, targetPop, totalPop)
    // return geoids
  }

  const getAdjacent = (geoids, targetPop)=>{
    // Use the counties array to identify all items in the neighbors array
    // Should end up with an array of current neighbors
    // already unique and sorted by ascending pop
    const neighborGeoids = getArrayNeighbors(geoids)
    // return neighborGeoids

    // console.log("adjacent", checkCounties(geoids, neighborGeoids, targetPop, 0))
    return checkCounties(geoids, neighborGeoids, targetPop, 0)
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
      return neighborCountyStyle
    }
    return inactiveCountyStyle
  }


  // Mouse functions
  const onClick = (e)=>{
    const geoid = e.target.getAttribute('data-geoid')
    // const pop = e.target.getAttribute('data-pop')
    // console.log("click", geoid, pop)
    setNeighborIds(getAdjacent([geoid], pop))
  } 

  const onRightClick = (e)=>{
    e.preventDefault()
    const geoid = e.target.getAttribute('data-geoid')
    const pop = e.target.getAttribute('data-pop')
    console.log('op', geoid, pop)
    if (geoid == activeId) {
      setActiveId(null)
      setLocation(null)
      setPop(0)
    } else {
      setActiveId(geoid)
      setLocation(counties.features.filter(c=>c.properties.GEOID==geoid)[0].properties.NAMELSAD)
      setPop(parseInt(pop))
    }
  }
  
  const onMouseOver = (e)=>{
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
          pop={valuemap.get(feature.properties["GEOID"])}
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
        />
      ))}

    </svg>
  )
}


export default Geopleth
