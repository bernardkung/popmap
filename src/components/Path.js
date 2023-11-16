import * as d3 from "d3";
import { useState, useEffect } from "react";

const Path = ({ feature, style, onClick, id, geoid, onMouseOver }) => {
  
  const projection = d3.geoAlbersUsa()
  const geoGenerator = d3.geoPath()
    .projection(projection)

  if (style.fill=="blue") {console.log(geoid)}
  return (  
    <path 
        d={geoGenerator(feature)}
        style={style}
        onClick={onClick}
        id={id}
        data-geoid={geoid}
        onMouseOver={onMouseOver}
    />    
  )
}

export default Path