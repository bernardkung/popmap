import * as d3 from "d3";

const Path = ({ feature, style, id, pop, onClick, onRightClick, onMouseEnter, onMouseExit}) => {
  
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
        {...attributes}
        onMouseEnter={mouseTest}
        onMouseExit={onMouseExit}
        onContextMenu={onRightClick}
    />    
  )
}

export default Path