import * as d3 from "d3";
import { render } from 'react-dom'
import * as topojson from "topojson-client"
import { useState, useEffect, useRef } from "react";
import geoAlbersUsaPr  from "./geoAlbersUsaPr";


const Geopleth = ({ topodata, countydata, statedata, popdata, loading }) => {

  // Check that data was passed correctly
  // console.log(" chart, loading", loading)
  // console.log(" chart, geodata", geodata)
  // console.log(" chart, popdata", popdata)
  // console.log(" chart, statedata", statedata)
  // console.log(" chart, countydata", countydata)
  
  const ref = useRef()

  // Set the dimensions and margins of the graph
  const margin = { top: 30, right: 160, bottom: 70, left: 60 }
  const width = 1060 - margin.left - margin.right
  const height = 800 - margin.top - margin.bottom
  
  // Mouse functions
  const mouseover = (event, d)=>{
    console.log("mouseover", d)
    console.log(this)
    d3.select(this)
      .transition()
      .duration(200)
      .style("fill", "pink")
      .style("stroke", "black")
    return
  }
  const mouseleave = (event, d)=>{
    return
  }

  useEffect(()=>{ 
    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // quantiLe color scale
    const color = d3.scaleQuantile(
      popdata.filter(p => p.COUNTY != '000').map(p => parseInt(p.POPESTIMATE2022)),
      d3.schemeBlues[9]
    )
    const path = d3.geoPath();
    const valuemap = new Map(popdata.map(p => [p.STATE + p.COUNTY, p.POPESTIMATE2022]));

    // Define meshes & features 
    const counties = topojson.feature(countydata, countydata.objects.counties)
    const states = topojson.feature(statedata, statedata.objects.states)
    const statemap = new Map(states.features.map(d => [d.properties.STATEFP, d]))
    const statemesh = topojson.mesh(statedata, statedata.objects.states, (a, b) => a !== b)
    // Projection for scaling
    const projection = d3.geoAlbersUsa().fitSize([
        width - margin.left - margin.right, 
        height - margin.top - margin.bottom,
      ], statemesh)

    // Draw States
    svg.append("path")
        .datum(statemesh)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("d", d3.geoPath().projection(projection))

    // Draw Counties
    svg.append("g")
      .selectAll("path")
      .data(counties.features)
      .enter()
      .append("path")
      // .join("path")
        // .attr("fill", d => color(valuemap.get(d.properties.GEOID)))
        .attr("fill", "white")
        .attr("d", d3.geoPath().projection(projection))
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .attr("data-fips", d=>d.properties.GEOID)
        .attr("data-population", d=>valuemap.get(d.properties.GEOID))
      .append("title")
      .text(
        d => `${d.properties.NAMELSAD}, ${d.properties.STATE_NAME} (${d.properties.GEOID})\n${d3.format(",.2r")(valuemap.get(d.properties.GEOID))}`
      )
      .attr("class", "county")
  })

  // return ( svgelement )
  return ( <svg width={width} height={height} id="geopleth" ref={ref}/> )
  
}


export default Geopleth
