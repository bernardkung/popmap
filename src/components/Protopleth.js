import * as d3 from "d3";
import { render } from 'react-dom'
import * as topojson from "topojson-client"
import { useState, useEffect, useRef } from "react";
import geoAlbersUsaPr  from "./geoAlbersUsaPr";


const Protopleth = ({ topodata, countydata, statedata, popdata, setPop, setLocation }) => {
// Get React to render the svg and paths so that it's not contesting D3 for control of the DOM


  // Set the dimensions and margins of the graph
  const margin = { top: 0, right: 60, bottom: 60, left: 160 }
  const width = 900
  const height = 700

  // Define meshes & features 
  const counties = topojson.feature(countydata, countydata.objects.counties)
  const states = topojson.feature(statedata, statedata.objects.states)
  const statemap = new Map(states.features.map(d => [d.properties.STATEFP, d]))
  const statemesh = topojson.mesh(statedata, statedata.objects.states, (a, b) => a !== b)
  const valuemap = new Map(popdata.map(p => [p.STATE + p.COUNTY, p.POPESTIMATE2022]));
  // Projection for scaling
  const projection = d3.geoAlbersUsa().fitSize([
      width - margin.left - margin.right, height - margin.top - margin.bottom,
    ], statemesh)
  const path = d3.geoPath().projection(projection)

  console.log(counties.features)
  return (
    <svg id="choropleth" style = {{ height: height, width: width}}>
      {/* Counties */}
      {counties.features.map(d=>(
        <path 
          d={
            d3.geoPath().projection(d3.geoAlbersUsa())
          }
          key={"ID" + d.properties.GEOID}
          fill="white"
          stroke="black"
          strokeLinejoin="round"
          strokeWidth="0.15"
        />
      ))}
      {/* States */}
      {states.features.map(d=>(
        <path
          key={"ID" + d.properties.STATEFP}
          fill="none"
          stroke="black"
          strokeLinejoin="round"
          strokeWidth="0.5"
        />
      ))

      }
    </svg>
  )

  


  // // Draw States
  // svg.append("path")
  //     .datum(statemesh)
  //     .attr("fill", "none")
  //     .attr("stroke", "black")
  //     .attr("stroke-linejoin", "round")
  //     .attr("d", d3.geoPath().projection(projection))

  // // Draw Counties
  // svg.append("g")
  //   .selectAll("path")
  //   .data(counties.features)
  //   // .join("path")
  //   .join(
  //     enter => enter.append("path"),
  //     update => update
  //       .attr("fill", "green")
  //   )
  //     .attr("ID", d=>"#ID" + d.properties.GEOID)
  //     .attr("class", "county")
  //     .attr("fill", "white")
  //     .attr("stroke", "#282c34")
  //     .attr("stroke-linejoin", "round")
  //     .attr("stroke-width", 0.25)
  //     .attr("d", d3.geoPath().projection(projection))
  //     .on("mouseover", mouseOver)
  //     .on("mouseleave", mouseLeave)
  //     .on("click", mouseClick)
  //     .attr("data-fips", d=>d.properties.GEOID)
  //     .attr("data-population", d=>valuemap.get(d.properties.GEOID))
  //     .attr("data-namelsad", d=>d.properties.NAMELSAD)
  //     .attr("data-statename", d=>d.properties.STATE_NAME)
  //     .attr("active", false)
  //     .attr("neighbor", false)
  //   .append("title")
  //   .text(
  //     d => `${d.properties.NAMELSAD}, ${d.properties.STATE_NAME} (${d.properties.GEOID})\n${d3.format(",.2r")(valuemap.get(d.properties.GEOID))}`
  //   )




}


export default Protopleth
