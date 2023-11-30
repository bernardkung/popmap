import * as d3 from "d3";

const Path = ({ 
  feature, pop, geoid, id, 
  style, type, status, valuemap,
  onClick, onRightClick, onMouseEnter, onMouseLeave
}) => {
  
  const projection = d3.geoAlbersUsa()
  const geoGenerator = d3.geoPath()
    .projection(projection)

  // const attributes = Object.entries(feature.properties).reduce((acc, [key, val])=>{
  //   return {...acc, ["data-" + key.toLowerCase()] : val}
  // }, {})

  // Color Scales
  const neighborColor = d3.scaleQuantize([1,10], d3.schemeBlues[9])
  const inactiveColor = d3.scaleQuantize([1,10], d3.schemeGreys[9])
  const getBaseLog = (x, base) => Math.log(x) / Math.log(base)

  // Styles
  const styles = {
    county: {
      active: {
        fill: "#FFC5FC",
        stroke: "#FF2EF8",
        strokeLinejoin:"round",
        strokeWidth:"2",
      },
      neighbor: {
        fill: neighborColor(getBaseLog(valuemap.get(feature.properties["GEOID"]), 10)),
        stroke: "#25B0BB",
        strokeLinejoin:"round",
        strokeWidth:"0.55",
      },
      inactive: {
        fill: inactiveColor(getBaseLog(valuemap.get(feature.properties["GEOID"]), 10)),
        stroke: "black",
        strokeLinejoin:"round",
        strokeWidth:"0.15",
      },
    },
    state: {state : {
      fill: "none",
      stroke: "black",
      strokeLinejoin:"round",
      strokeWidth:"0.55",
    }}
  }

  const activeCountyStyle = (d)=> { return {
    fill: "#FFC5FC",
    stroke: "#FF2EF8",
    strokeLinejoin:"round",
    strokeWidth:"2",
  }}

  const neighborCountyStyle = (d)=> { return {
    // fill: "#929FF0",
    fill: neighborColor(getBaseLog(valuemap.get(d.properties["GEOID"]), 10)),
    stroke: "#25B0BB",
    strokeLinejoin:"round",
    strokeWidth:"0.55",
  }}

  const inactiveCountyStyle = (d)=> { return {
    // fill: "#D0D0D0",
    fill: inactiveColor(getBaseLog(valuemap.get(d.properties["GEOID"]), 10)),
    stroke: "black",
    strokeLinejoin:"round",
    strokeWidth:"0.15",
  }}

  const stateStyle = {
    fill: "none",
    stroke: "black",
    strokeLinejoin:"round",
    strokeWidth:"0.55",
  }

  console.log(status, type, styles[type][status])
  return (  
    <path 
        d={geoGenerator(feature)}
        style={styles[type][status]}
        onClick={onClick}
        id={id}
        data-pop={pop}
        data-geoid={geoid}
        // {...attributes}
        data-properties={JSON.stringify(feature.properties)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onContextMenu={onRightClick}
    />    
  )
}

export default Path