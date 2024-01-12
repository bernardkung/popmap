import * as d3 from "d3";
import { render } from 'react-dom'
import * as topojson from "topojson-client"
import { useState, useEffect, useRef } from "react"
import Path from './Path'
import buildNeighborhood from "../algorithms/buildNeighborhood";

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
  const countiesData = Object.assign( ...ids.map( (k,i) => ({
    [k]:{
      POPESTIMATE2022: valuemap.get(k),
      neighbors: neighbors[i].map(n=>ids[n])
    }
  }) ))

  // Build a new neighborhood after a new seed is set
  useEffect(()=>{
    if (neighborhoodSeed) {
      setNeighborhood(buildNeighborhood(neighborhoodSeed, pop, countiesData))
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
    // Set a new Active County
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
