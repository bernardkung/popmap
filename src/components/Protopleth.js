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
    const neighborhoodIds = [...new Set(contigs.filter(c=>!geoids.includes(c)))]

    // List of all neighboring FEATURES, and reduced to only GEOIDS
    const neighborhood = counties.features
      // Filter for neighbors
      .filter(d => getcontigs(geoids).includes(d.properties.GEOID))
      // Remove original array
      .filter(d => !geoids.includes(d.properties.GEOID))
      .map(d => d.properties.GEOID)

    return neighborhood
  }

  const checkCounties = (totalPop, targetPop, counties )=>{
    counties.forEach(county =>{
      const countyPop = valuemap(county.properties.GEOID)
      // Exit case
      if (countyPop + totalPop > targetPop) {
        return counties
      } else {
        totalPop += countyPop
        counties.push(county)
      }
      // If all counties have been checked
      // generate a new set of neighboring counties

      return checkCounties(totalPop, targetPop, counties)
    })
  }

  const getAdjacent = (geoids, targetPop)=>{
    console.log("adj", geoids, targetPop)
    return getArrayNeighbors(geoids)
    // Use the counties array to identify all items in the neighbors array
    // Should end up with an array of current neighbors

    // Remove duplicates

    // Sort by population

    // Loop through all current neighbors
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
    const pop = e.target.getAttribute('data-pop')
    // console.log("click", geoid, pop)
    setNeighborIds(getAdjacent([geoid], pop))
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
          // onClick={onClick}
          // onMouseover={onMouseover}
        />
      ))}

    </svg>
  )
}


export default Protopleth
