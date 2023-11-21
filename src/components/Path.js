import * as d3 from "d3";
import { useState, useEffect } from "react";

const Path = ({ feature, style, onClick, id, geoid, pop, onMouseOver, onRightClick }) => {
  
  const projection = d3.geoAlbersUsa()
  const geoGenerator = d3.geoPath()
    .projection(projection)

  return (  
    <path 
        d={geoGenerator(feature)}
        style={style}
        onClick={onClick}
        id={id}
        data-geoid={geoid}
        data-pop={pop}
        onMouseOver={onMouseOver}
        onContextMenu={onRightClick}
    />    
  )
}

export default Path