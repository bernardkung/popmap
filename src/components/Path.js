import * as d3 from "d3";

const Path = ({ 
  feature, pop, geoid, id, 
  geoGenerator, 
  type, status, valuemap,
  onClick, onRightClick, onMouseEnter, onMouseLeave
}) => {

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

  const properties = JSON.stringify({...feature.properties, POPESTIMATE2022: pop ? pop : null })

  return (  
    <path 
        d={geoGenerator(feature)}
        className={ `${type} ${status}` }
        style={styles[type][status]}
        onClick={onClick}
        id={id}
        data-pop={pop}
        data-geoid={geoid}
        data-properties={properties}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onContextMenu={onRightClick}
    />    
  )
}

export default Path