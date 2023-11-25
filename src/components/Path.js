import * as d3 from "d3";

const Path = ({ feature, style, geoid, id, pop, onClick, onRightClick, onMouseEnter, onMouseLeave}) => {
  
  const projection = d3.geoAlbersUsa()
  const geoGenerator = d3.geoPath()
    .projection(projection)

  const attributes = Object.entries(feature.properties).reduce((acc, [key, val])=>{
    return {...acc, ["data-" + key.toLowerCase()] : val}
  }, {})


  return (  
    <path 
        d={geoGenerator(feature)}
        style={style}
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