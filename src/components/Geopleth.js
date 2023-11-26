import * as d3 from "d3";
import { render } from 'react-dom'
import * as topojson from "topojson-client"
import { useState, useEffect, useRef } from "react"
import Path from './Path'


const Geopleth = ({ topodata, countydata, statedata, popdata, pop, setPop, setLocation, setTooltipData }) => {
// Get React to render the svg and paths so that it's not contesting D3 for control of the DOM


  // Set the dimensions and margins of the graph
  const margin = { top: 0, right: 60, bottom: 60, left: 160 }
  const width = 900
  const height = 700

  // Dynamic dimensions
  // const [viewsize, setViewsize] = useState([window.innerWidth, window.innerHeight])
  const [activeId, setActiveId] = useState()
  const [neighborhood, setNeighborhood] = useState([])
  const [neighborhoodSeed, setNeighborhoodSeed] = useState()
  const [neighborMesh, setNeighborMesh] = useState()
  // const [tooltipData, setTooltipData] = useState<tooltipData | null>(null);
  // const [tooltipData, setTooltipData] = useState(null)
  // const [counties, setCounties]
  // const [states, setCounties]
  // const [projection, setProjection] = useState(d3.geoAlbersUsa())
  // const [counties, setCounties]

  // Define features and projections
  const counties = topojson.feature(countydata, countydata.objects.counties)
  const states = topojson.feature(statedata, statedata.objects.states)
  const projection = d3.geoAlbersUsa()
  const geoGenerator = d3.geoPath()
    .projection(projection)
  const neighbors = topojson.neighbors(countydata.objects.counties.geometries)
  const ids = counties.features.map(d => d.properties.GEOID)
  // Mapping function to crosswalk population and topojson
  const valuemap = new Map(popdata.map(p => [p.STATE + p.COUNTY, p.POPESTIMATE2022]));
  useEffect(()=>{
  }, [])

  

  function getNeighbors(geoids) {
    const getcontigs = geoids => {
      return geoids.map(geoid => {
        const index = neighbors[ids.indexOf(geoid)]
        const result = index.map(i => ids[i])
        return result
      }).flat(Infinity)
    }

    // List of all neighboring GEOIDS
    const contigs = getcontigs(geoids)
    // const neighborhoodIds = [...new Set(contigs.filter(c=>!geoids.includes(c)))]

    // List of all neighboring FEATURES
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
    
    // Get populations for each neighboring feature
    const neighborhoodPop = neighborhood
        .map(d=>[d.properties.GEOID, valuemap.get(d.properties.GEOID)])
    
    // Reduce each neighboring feature to geoid
    const neighborhoodIds = neighborhood.map(d=>d.properties.GEOID)
    
    return neighborhoodIds
  }

  function checkNeighbors(geoids, neighborGeoids, targetPop, totalPop) {
    // Loop through each neighbor and check if target pop has been reached
    for (let i = 0; i < neighborGeoids.length; i++) {
      const geoid = neighborGeoids[i]
      const countyPop = parseInt(valuemap.get(geoid))

      // Exit case: target pop exceeded
      if (countyPop + parseInt(totalPop) > parseInt(targetPop)) {
        return geoids
      } else {
        // Add the neighbor to array of geoids and increase the population
        totalPop += parseInt(countyPop)
        geoids.push(geoid)
      }
    }
    // If all counties have been checked
    // generate a new set of neighboring counties
    const newNeighbors = getNeighbors(geoids)
    
    // Second exit condition for error handling
    if (newNeighbors.length==0) {
      return geoids
    }

    return checkNeighbors(geoids, newNeighbors, targetPop, totalPop)
  }

  function buildNeighborhood(geoids, targetPop) {
    // Get unique neighboring geoids, sorted by population
    const neighborGeoids = getNeighbors(geoids)

    return checkNeighbors(geoids, neighborGeoids, targetPop, 0)
  }

  // Color Scales
  const neighborColor = d3.scaleQuantize([1,10], d3.schemeBlues[9])
  const inactiveColor = d3.scaleQuantize([1,10], d3.schemeGreys[9])
  const getBaseLog = (x, base) => Math.log(x) / Math.log(base)

  // Styles
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

  const activeCountyStyle = (d)=> { return {
    fill: "#FFC5FC",
    stroke: "#FF2EF8",
    strokeLinejoin:"round",
    strokeWidth:"2",
  }}

  const neighborCountyStyle = (d)=> { return {
    // fill: "#929FF0",
    fill: neighborColor(getBaseLog(valuemap.get(d.properties["GEOID"]), 10)),
    stroke: "#25B0BB",
    strokeLinejoin:"round",
    strokeWidth:"0.55",
  }}

  const inactiveCountyStyle = (d)=> { return {
    // fill: "#D0D0D0",
    fill: inactiveColor(getBaseLog(valuemap.get(d.properties["GEOID"]), 10)),
    stroke: "black",
    strokeLinejoin:"round",
    strokeWidth:"0.15",
  }}

  const stateStyle = {
    fill: "none",
    stroke: "black",
    strokeLinejoin:"round",
    strokeWidth:"0.55",
  }

  // Build a new neighborhood after a new seed is set
  useEffect(()=>{
    if (neighborhoodSeed) {
      setNeighborhood(buildNeighborhood([neighborhoodSeed], pop))
    }
  }, [neighborhoodSeed, activeId])
  
  // Define the outer mesh of the neighboorhood
  useEffect(()=>{
    const mesh = topojson.mesh(
      countydata, countydata.objects.counties, 
      (a, b) => {
        const aId = a.properties.GEOID
        const bId = b.properties.GEOID
        const test = (a !== b) && (
          (neighborhood.includes(aId)) && (!neighborhood.includes(bId)) ||
          (neighborhood.includes(bId)) && (!neighborhood.includes(aId))
        )
        return test
      }
    )
    setNeighborMesh(mesh)
  }, [neighborhood])

  // Determine which style to use for a path
  function selectStyle(d) {
    if (d.properties["GEOID"]==activeId) {
      return activeCountyStyle(d)
    } else if (neighborhood.includes(d.properties["GEOID"])) {
      return neighborCountyStyle(d)
    }
    return inactiveCountyStyle(d)
  }


  // Mouse functions
  const onClick = (e)=>{
    // Create a neighborhood of equivalent population
    const geoid = e.target.getAttribute('data-geoid')
    setNeighborhoodSeed(geoid)
    // setNeighborhood(buildNeighborhood([geoid], pop))
  } 

  const onRightClick = (e)=>{
    e.preventDefault()
    const geoid = e.target.getAttribute('data-geoid')
    const pop = e.target.getAttribute('data-pop')
    const countyName = counties.features.filter(c=>c.properties.GEOID==geoid)[0].properties.NAMELSAD
    // If Active County already exists
    if (geoid == activeId) {
      // Clear Active County
      setActiveId(null)
      setLocation(null)
      setPop(0)  
    // Clear Neighborhood

    } else {
      // Set a new Active County
      setActiveId(geoid)
      setLocation(`${countyName} (${geoid})`)
      setPop(parseInt(pop))
      // Re-calculate neighborhood if a neighborhood already exists
    }
  }
  
  const onMouseEnter = (e)=>{
    const properties = JSON.parse(e.target.getAttribute("data-properties"))
    console.log(e.target.getBBox())
    setTooltipData({
      "properties":properties,
      "box":e.target.getBBox(),
    })
  }

  const onMouseLeave = (e)=>{
    setTooltipData(null)
  }

  return (
    <div>
      {/* Tooltip */}

      <svg id="protopleth" style = {{ width: width, height:height }}>

        {/* Counties */}
        {counties.features.map(feature=>(
          <Path 
            feature={feature} 
            style={selectStyle(feature)} 
            key={"ID" + feature.properties["GEOID"]} 
            id={"ID" + feature.properties["GEOID"]}
            geoid={feature.properties["GEOID"]}
            pop={valuemap.get(feature.properties["GEOID"])}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onRightClick={onRightClick}
          />
        ))}

        {/* Neighborhood mesh */}
        <path 
          d={geoGenerator(neighborMesh)}
          style={{
              fill: "none",
              stroke: "#00EDFF",
              strokeLinejoin:"round",
              strokeWidth:"2",
            }}
          id={"mesh"}
        />    

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
  </div>
  )
}


export default Geopleth
