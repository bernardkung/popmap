import * as d3 from "d3";
import { useState, useEffect } from "react";

const Path = ({ feature, style, id, geoid, pop, onClick, onRightClick, onMouseEnter, onMouseExit}) => {
  
  const projection = d3.geoAlbersUsa()
  const geoGenerator = d3.geoPath()
    .projection(projection)

  const properties = feature.properties

  console.log(Object.keys({...properties}).map((key)=>(
      {["DATA-" + key]: feature.properties[key]}
    )).reduce(
      (obj, item) => Object.assign(obj, { [item.key]: item.value }), {})
  )

  const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )
  
  const keys = Object.keys(feature.properties)
  const attributes = keys.map((key)=>(
    {["DATA-" + key]: feature.properties[key]}
  ))
  
  // Object.keys(feature.properties).forEach((key)=>{
  //   // console.log({["data-" + key] : feature.properties[key]})
  //   return {["data-" + key] : feature.properties[key]}
  // })

  // Start with an object
  // Create a new object
  // Keys have "data-" prepended
  // Values are the same

  function mouseTest() {
    const props = feature.properties
    console.log(props)
  }

  return (  
    <path 
        d={geoGenerator(feature)}
        style={style}
        onClick={onClick}
        id={id}
        data-geoid={geoid}
        data-pop={pop}
        // {...attributes}
        onMouseEnter={mouseTest}
        onMouseExit={onMouseExit}
        onContextMenu={onRightClick}
    />    
  )
}

export default Path