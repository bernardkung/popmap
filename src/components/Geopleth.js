import * as d3 from "d3";
import { render } from 'react-dom'
import * as topojson from "topojson-client"
import { useState, useEffect, useRef } from "react"
import Path from './Path'


const Geopleth = ({ 
  topodata, countydata, statedata, popdata, pop, setPop, 
  setLocation, setTooltipData, setActiveCounty, setNeighbors,
  neighborhood, setNeighborhood,
}) => {
// Get React to render the svg and paths so that it's not contesting D3 for control of the DOM


  // Set the dimensions and margins of the graph
  const margin = { top: 0, right: 60, bottom: 60, left: 160 }
  const width = 900
  const height = 500

  // Dynamic dimensions
  // const [viewsize, setViewsize] = useState([window.innerWidth, window.innerHeight])
  const [activeId, setActiveId] = useState()
  // const [neighborhood, setNeighborhood] = useState([])
  const [neighborhoodSeed, setNeighborhoodSeed] = useState()
  const [neighborMesh, setNeighborMesh] = useState()

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
        .map(d=>{return {"geoid":d.properties.GEOID, "pop":valuemap.get(d.properties.GEOID)}})
    // console.log(neighborhoodPop)
    
    // Reduce each neighboring feature to geoid
    const neighborhoodIds = neighborhood.map(d=>d.properties.GEOID)
    return neighborhoodIds
  }

  function checkNeighbors(geoids, neighborGeoids, targetPop, totalPop) {
    // Loop through each neighbor and check if target pop has been reached

    // console.log(`Checking ${neighborGeoids.length} neighbors:`, neighborGeoids)

    for (let i = 0; i < neighborGeoids.length; i++) {
      const geoid = neighborGeoids[i]
      const countyPop = parseInt(valuemap.get(geoid))

      // console.log(`${geoid}// total:${totalPop} + pop:${countyPop} ; target:${targetPop}`)
      // console.log(`check:${countyPop + parseInt(totalPop) > parseInt(targetPop)}`)

      // Exit case: target pop exceeded
      if (countyPop + parseInt(totalPop) > parseInt(targetPop)) {
        return geoids
      } else {
        // Add the neighbor to array of geoids and increase the population
        totalPop = parseInt(totalPop) + parseInt(countyPop)
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
    // Get initial seed population
    const initPop = valuemap.get(geoids[0])
    return checkNeighbors(geoids, neighborGeoids, targetPop, initPop)
  }


  // Build a new neighborhood after a new seed is set
  useEffect(()=>{
    if (neighborhoodSeed) {
      setNeighborhood(buildNeighborhood([neighborhoodSeed], pop))
      // Set app neighbors
    }
  }, [neighborhoodSeed, activeId])
  
  // Define the outer mesh of the neighboorhood
  useEffect(()=>{
    // console.log("neighborhood", neighborhood)
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



  // Mouse functions
  const onClick = (e)=>{
    // Create a neighborhood of equivalent population
    const geoid = e.target.getAttribute('data-geoid')
    setNeighborhoodSeed(geoid)
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
      setActiveCounty(null)
      setLocation(null)
      setPop(0)  
      // Clear Neighborhood
      setNeighborhoodSeed(null)
    } else {
      // Set a new Active County
      setActiveId(geoid)
      setActiveCounty(e.target.getAttribute("data-properties"))
      setLocation(`${countyName} (${geoid})`)
      setPop(parseInt(pop))
      // Neighborhood will automatically retrigger based on activeId change
    }
  }
  
  const onMouseEnter = (e)=>{
    const properties = JSON.parse(e.target.getAttribute("data-properties"))
    // console.log("bbox", e.target.getBBox())
    // console.log("rect", e.target.getBoundingClientRect())
    // console.log(e.pageX, e.pageY)
    setTooltipData({
      "properties":properties,
      "box":e.target.getBoundingClientRect(),
      "dot":{
        "x":e.pageX, 
        "y":e.pageY
      }
    })
  }

  const onMouseLeave = (e)=>{
    setTooltipData(null)
  }

  return (
    <div>
      {/* Tooltip */}

      <svg id="choropleth" 
        style = {{ width: width, height:height }} 
      >


        {/* Counties */}
        {counties.features.map(feature=>(
          <Path 
            feature={feature}
            geoGenerator={geoGenerator} 
            type={"county"}
            status={ activeId==feature.properties['GEOID'] 
              ? "active" 
              : neighborhood.includes(feature.properties['GEOID'])
                ? "neighbor"
                : "inactive"
            }
            key={"ID" + feature.properties["GEOID"]} 
            id={"ID" + feature.properties["GEOID"]}
            geoid={feature.properties["GEOID"]}
            pop={valuemap.get(feature.properties["GEOID"])}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onRightClick={onRightClick}
            valuemap={valuemap}
          />
        ))}

        {/* States */}
        {states.features.map(feature=>(
          <Path 
            feature={feature} 
            geoGenerator={geoGenerator} 
            type={"state"}
            status={"state"}
            key={"ID" + feature.properties["STATEFP"]}
            id={"ID" + feature.properties["STATEFP"]} 
            valuemap={valuemap}
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
      </svg>
  </div>
  )
}


export default Geopleth
