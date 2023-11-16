import * as d3 from "d3";
import { useState, useEffect } from "react";

const Path = ({ feature, style }) => {
  
  const [checked, setChecked] = useState(false)
  const [pathDiv, setPathDiv] = useState()

  // console.log(style)

  const projection = d3.geoAlbersUsa()
  const geoGenerator = d3.geoPath()
    .projection(projection)

  const onClick=(e)=>{
    console.log(e.target)
    console.log(checked + "=>" + !checked)
    setChecked(checked => !checked)
  }
  
  useEffect(()=>{
    const countyStyle = {
      fill: checked ? "green" : "white",
      stroke: "black",
      strokeLinejoin:"round",
      strokeWidth:"0.15",
    }
  
  }, [checked])
  const stateStyle = {
    fill: "none",
    stroke: "black",
    strokeLinejoin:"round",
    strokeWidth:"0.55",
  }

  useEffect(()=>{
  })
  
  // console.log("ID" + feature.properties[keyProp])

  return (      <path 
    d={geoGenerator(feature)}
    style={style}
    onClick={onClick}
    checked={checked}
  />
  )
}

export default Path