import * as d3 from "d3";
import { useState, useEffect } from "react";

const Path = ({ feature, style, id, geoid, pop, onClick, onRightClick, onMouseEnter, onMouseExit}) => {
  
  const projection = d3.geoAlbersUsa()
  const geoGenerator = d3.geoPath()
    .projection(projection)
  // console.log(feature.properties)

  const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )
  
  const keys = Object.keys(feature.properties)
  const attributes = keys.map((key)=>{return {["DATA-" + key]: feature.properties[key]}})
  
  // Object.keys(feature.properties).forEach((key)=>{
  //   // console.log({["data-" + key] : feature.properties[key]})
  //   return {["data-" + key] : feature.properties[key]}
  // })

  console.log("attr", attributes)

  return (  
    <path 
        d={geoGenerator(feature)}
        style={style}
        onClick={onClick}
        id={id}
        data-geoid={geoid}
        data-pop={pop}
        {...attributes}
        onMouseEnter={onMouseEnter}
        onMouseExit={onMouseExit}
        onContextMenu={onRightClick}
    />    
  )
}

export default Path