import * as d3 from "d3";
import * as topojson from "topojson-client"
import { useEffect, useRef } from "react";


const Geopleth = ({ topodata, countydata, statedata, popdata, loading }) => {
  const ref = useRef()
  const us = topodata


  // Check that data was passed correctly
  // console.log(" chart, loading", loading)
  // console.log(" chart, geodata", geodata)
  // console.log(" chart, popdata", popdata)
  // console.log(" chart, statedata", statedata)
  // console.log(" chart, countydata", countydata)

  // set the dimensions and margins of the graph
  const margin = { top: 30, right: 30, bottom: 70, left: 60 }
  const width = 1060 - margin.left - margin.right
  const height = 800 - margin.top - margin.bottom

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

    // // quantiZe scale
    // const maxpop = d3.max(popdata.filter(p => p.COUNTY != '000').map(f => parseInt(f.POPESTIMATE2022)))
    // const color = d3.scaleQuantize([1, maxpop], d3.schemeBlues[9]);

    // quantiLe scale
    const color = d3.scaleQuantile(
      popdata.filter(p => p.COUNTY != '000').map(p => parseInt(p.POPESTIMATE2022)),
      d3.schemeBlues[9]
    )
    const path = d3.geoPath();
    // const valueformat = d => `${d.properties.name}, ${statemap.get(d.id.slice(0, 2)).properties.name}\n${valuemap.get(d.id)}`;
    const valuemap = new Map(popdata.map(p => [p.STATE + p.COUNTY, p.POPESTIMATE2022]));

    // The counties feature collection is all U.S. counties, each with a
    // five-digit FIPS identifier. The statemap lets us lookup the name of 
    // the state that contains a given county; a state’s two-digit identifier
    // corresponds to the first two digits of its counties’ identifiers.
    
    const counties = topojson.feature(countydata, countydata.objects.cb_2022_us_county_20m)
    const states = topojson.feature(statedata, statedata.objects.cb_2022_us_state_20m)
    const statemap = new Map(states.features.map(d => [d.properties.STATEFP, d]))

    // console.log(topojson.mesh(statedata, statedata.objects.cb_2022_us_state_20m, (a, b) => a !== b))
    // console.log(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    // console.log("o", topojson.feature(us, us.objects.counties).features)
    // console.log("n", topojson.feature(countydata, countydata.objects.cb_2022_us_county_20m).features)

    // The statemesh is just the internal borders between states, i.e.,
    // everything but the coastlines and country borders. This avoids an
    // additional stroke on the perimeter of the map, which would otherwise
    // mask intricate features such as islands and inlets. (Try removing
    // the last argument to topojson.mesh below to see the effect.)
    // const statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
    const statemesh = topojson.mesh(statedata, statedata.objects.cb_2022_us_state_20m, (a, b) => a !== b);

    // // Create a projection to adjust the size of the mesh
    // const projection = d3.geoAlbers()
    //   .fitSize([width, height], statemesh);
    
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
        .attr("d", path)
      .append("title")
        // .text(d => `${d.properties.name}, ${statemap.get(d.id.slice(0, 2)).properties.name}\n${valuemap.get(d.id)}%`);
      .text((d) => {
        return `${d.properties.NAMELSAD}, ${d.properties.STATE_NAME} (${d.properties.GEOID})\n${valuemap.get(d.id)}`
      });

    // States
    svg.append("path")
        .datum(statemesh)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

  })

  
  return ( <svg width={width} height={height} id="visualization" ref={ref}/> )
}


export default Geopleth
