import * as d3 from "d3";
import * as topojson from "topojson-client"
import { useEffect, useRef } from "react";


const Choropleth = ({ geodata, popdata, loading }) => {
  const ref = useRef()
  const us = geodata

  // // Check that data was passed correctly
  // console.log(" chart, loading", loading)
  // console.log(" chart, geodata", geodata)
  // console.log(" chart, popdata", popdata)


  useEffect(()=>{
    // const svg = d3.create("svg")
    //   .attr("width", 975)
    //   .attr("height", 610)
    //   .attr("viewBox", [0, 0, 975, 610])
    //   .attr("style", "max-width: 100%; height: auto;");

    const svg = d3.select(ref.current)
      .attr("width", 975)
      .attr("height", 610)
      .attr("viewBox", [0, 0, 975, 610])
      .attr("style", "max-width: 100%; height: auto;");

    const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9]);
    const path = d3.geoPath();
    const format = d => `${d}%`;
    const valuemap = new Map(popdata.map(p => [p.STATE + p.COUNTY, p.POPESTIMATE2022]));

    // The counties feature collection is all U.S. counties, each with a
    // five-digit FIPS identifier. The statemap lets us lookup the name of 
    // the state that contains a given county; a state’s two-digit identifier
    // corresponds to the first two digits of its counties’ identifiers.
    const counties = topojson.feature(us, us.objects.counties);
    const states = topojson.feature(us, us.objects.states);
    const statemap = new Map(states.features.map(d => [d.id, d]));

    // The statemesh is just the internal borders between states, i.e.,
    // everything but the coastlines and country borders. This avoids an
    // additional stroke on the perimeter of the map, which would otherwise
    // mask intricate features such as islands and inlets. (Try removing
    // the last argument to topojson.mesh below to see the effect.)
    const statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);

    // svg.append("g")
    //     .attr("transform", "translate(610,20)")
    //     .append(() => Legend(color, {title: "Unemployment rate (%)", width: 260}));

    svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .join("path")
        .attr("fill", d => color(valuemap.get(d.id)))
        .attr("d", path)
      .append("title")
        .text(d => `${d.properties.name}, ${statemap.get(d.id.slice(0, 2)).properties.name}\n${valuemap.get(d.id)}%`);

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

  }, [ geodata, popdata ])

  
  return ( <svg></svg> )
}


export default Choropleth
