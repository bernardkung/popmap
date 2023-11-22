import * as d3 from "d3";
import { render } from 'react-dom'
import * as topojson from "topojson-client"
import { useState, useEffect, useRef } from "react";
import geoAlbersUsaPr  from "./geoAlbersUsaPr";


const Geopleth = ({ topodata, countydata, statedata, popdata, setPop, setLocation }) => {

  // Check that data was passed correctly
  // console.log(" chart, loading", loading)
  // console.log(" chart, geodata", geodata)
  // console.log(" chart, popdata", popdata)
  // console.log(" chart, statedata", statedata)
  // console.log(" chart, countydata", countydata)
  
  // const ref = useRef()

  // Set the dimensions and margins of the graph
  const margin = { top: 0, right: 60, bottom: 60, left: 160 }
  const width = 900
  const height = 700
  
  const svg = d3
    .select(".container")
    .append("svg")
    .attr("id", "geopleth")
    .attr("width", width )
    .attr("height", height )
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  useEffect(()=>{ 
    // append the svg object to the body of the page

    // quantiLe color scale
    const color = d3.scaleQuantile(
      popdata.filter(p => p.COUNTY != '000').map(p => parseInt(p.POPESTIMATE2022)),
      d3.schemeBlues[9]
    )
    const path = d3.geoPath();
    const valuemap = new Map(popdata.map(p => [p.STATE + p.COUNTY, p.POPESTIMATE2022]));

    // // Define meshes & features 
    // States meshes & features 
    const states = topojson.feature(statedata, statedata.objects.states)
    const statemap = new Map(states.features.map(d => [d.properties.STATEFP, d]))
    const statemesh = topojson.mesh(statedata, statedata.objects.states, (a, b) => a !== b)
    const stateProjection = d3.geoAlbersUsa().fitSize([
        width - margin.left - margin.right, height - margin.top - margin.bottom,
      ], statemesh)
    // Counties meshes & features 
    const counties = topojson.feature(countydata, countydata.objects.counties)
    const countyProjection = d3.geoAlbersUsa().fitSize([
        width - margin.left - margin.right, height - margin.top - margin.bottom,
      ], statemesh)

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

      const neighborhood = counties.features.filter(d =>
        getcontig(targetGEOID).includes(d.properties.GEOID)
      )

      return neighborhood
    }
  
    // Mouse functions
    const mouseOver = (e, d)=>{
      d3.select(e.target)
        .transition()
        .duration(200)
        .style("fill", "pink")
      console.log("Active: " + e.target.getAttribute("active"))
    }

    const mouseLeave = (e, d)=>{
      d3.select(e.target)
        .transition()
        .duration(200)
        .style("fill", "white")
    }

    const mouseClick = (e, d)=>{
      const geoID = e.target.getAttribute("data-fips")
      // console.log("click", e.target.getAttribute("ID"))
      // Setpop
      setPop(e.target.getAttribute("data-population"))
      setLocation(`${e.target.getAttribute("data-namelsad")}, ${e.target.getAttribute("data-statename")}`)
      // Get neighbors
      const neighbors = getNeighbors(geoID)
      // Set neighbor colors
      neighbors.forEach(n=>{
        // console.log("Making #ID" + n.properties.GEOID + " green")
        d3.select("#ID" + n.properties.GEOID)
          .attr("fill", "green")
      })
      // Make the county active
      console.log(e.target)
    }

    // Draw Counties
    svg.append("g")
      .selectAll("path")
      .data(counties.features)
      .join("path")
        .attr("ID", d=>"#ID" + d.properties.GEOID)
        .attr("class", "county")
        .attr("fill", "white")
        .attr("stroke", "#282c34")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 0.15)
        .attr("d", d3.geoPath().projection(countyProjection))
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
        .on("click", mouseClick)
        .attr("data-fips", d=>d.properties.GEOID)
        .attr("data-population", d=>valuemap.get(d.properties.GEOID))
        .attr("data-namelsad", d=>d.properties.NAMELSAD)
        .attr("data-statename", d=>d.properties.STATE_NAME)
        .attr("active", false)
        .attr("neighbor", false)
      .append("title")
      .text(
        d => `${d.properties.NAMELSAD}, ${d.properties.STATE_NAME} (${d.properties.GEOID})\n${d3.format(",.2r")(valuemap.get(d.properties.GEOID))}`
      )

      // Draw States
      svg.append("g")
        .selectAll("path")
        .data(states.features)
        .join("path")
          .attr("fill", "none")
          .attr("stroke", "#333338")
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 0.5)
          .attr("d", d3.geoPath().projection(stateProjection))
    
  })

  // return ( svgelement )
  // return ( 
    // <svg 
    //   id="geopleth" 
    //   // ref={ref}
    //   width={width + margin.left + margin.right} 
    //   height={height + margin.top + margin.bottom} 
    // /> 
    // null
  // )
  
}


export default Geopleth
