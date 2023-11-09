import * as d3 from "d3";
import { useEffect, useRef } from "react";


const BarChart = ({ dataset, loading }) => {
  const ref = useRef()

  console.log("bar chart, data", dataset)
  console.log("bar chart, loading", loading)
  dataset.map((d) => console.log("d", d))

  useEffect(()=>{

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        dataset.map((d) => {
          return d.Country
        })
      )
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("mybar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.Country);
      })
      .attr("y", function (d) {
        return y(d.Value);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        console.log("h", height-y(d.Value))
        return height - y(d.Value)
      })
      .attr("fill", "#69b3a2")
    
    }, [dataset])  
  
  return (<svg width={460} height={400} id="visualization" ref={ref}/>)

}


export default BarChart
