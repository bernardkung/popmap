import * as d3 from "d3";
import * as topojson from "topojson-client"
import { useState, useEffect, useRef } from "react";


const Geopleth = ({ topodata, countydata, statedata, popdata, loading }) => {

  
  // set the dimensions and margins of the graph
  const margin = { top: 30, right: 160, bottom: 70, left: 60 }
  const width = 1060 - margin.left - margin.right
  const height = 800 - margin.top - margin.bottom

  const ref = useRef()
  // const [ svgelement, setSvgelement ] = useState(<svg width={width} height={height} id="geopleth" ref={ref}/>)


  // Check that data was passed correctly
  // console.log(" chart, loading", loading)
  // console.log(" chart, geodata", geodata)
  // console.log(" chart, popdata", popdata)
  // console.log(" chart, statedata", statedata)
  // console.log(" chart, countydata", countydata)

  useEffect(()=>{ 
    
    // us.features.map(d => {
    //   console.log(
    //     d.properties.GEOID, 
    //     d.properties.STATEFP, 
    //     d.properties.COUNTYFP, 
    //     d.properties.NAMELSAD,
    //   )
    // })

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // quantiLe scale
    const color = d3.scaleQuantile(
      popdata.filter(p => p.COUNTY != '000').map(p => parseInt(p.POPESTIMATE2022)),
      d3.schemeBlues[9]
    )
    const path = d3.geoPath();
    const valuemap = new Map(popdata.map(p => [p.STATE + p.COUNTY, p.POPESTIMATE2022]));

    // The counties feature collection is all U.S. counties, each with a
    // five-digit FIPS identifier. The statemap lets us lookup the name of 
    // the state that contains a given county; a state’s two-digit identifier
    // corresponds to the first two digits of its counties’ identifiers.
    
    const counties = topojson.feature(countydata, countydata.objects.counties)
    const states = topojson.feature(statedata, statedata.objects.states)
    const statemap = new Map(states.features.map(d => [d.properties.STATEFP, d]))
    const statemesh = topojson.mesh(statedata, statedata.objects.states, (a, b) => a !== b)
    // Projection for scaling
    const projection = d3.geoAlbers().fitSize([
        width - margin.left - margin.right, 
        height - margin.top - margin.bottom,
      ], statemesh)

    // // Add a legend
    // svg.append("g")
    //     .attr("transform", "translate(610,20)")
    //     .append(() => Legend(color, {title: "Unemployment rate (%)", width: 260}));

    // Counties
    svg.append("g")
      .selectAll("path")
      .data(counties.features)
      .join("path")
        .attr("fill", d => {
          // console.log(color(valuemap.get(d.properties.GEOID)))
          return color(valuemap.get(d.properties.GEOID))
        })
        .attr("d", d3.geoPath().projection(projection))
      .append("title")
      .text((d) => {
        if (!valuemap.get(d.GEOID)) {
          console.log(d.GEOID)
        }
        return `${d.properties.NAMELSAD}, ${d.properties.STATE_NAME} (${d.properties.GEOID})\n${d3.format(",.2r")(valuemap.get(d.properties.GEOID))}`
      });

    // States
    svg.append("path")
        .datum(statemesh)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", d3.geoPath().projection(projection))
        // .attr("d", path)

  })

  // return ( svgelement )
  return ( <svg width={width} height={height} id="geopleth" ref={ref}/> )
}


export default Geopleth
