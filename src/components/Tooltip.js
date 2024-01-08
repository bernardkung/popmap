
const Tooltip = ({tooltipData}) => {
  if (!tooltipData) { return null }

  // console.log(tooltipData.properties)
  // const [ xPos, yPos, width, height ] = tooltipData.box
  // console.log("X", tooltipData.box.x - 160)

  return (
    <div className="tooltip" style={{
      left: tooltipData.box.x,
      top: tooltipData.box.y,
    }}>
      {tooltipData.properties.GEOID} {tooltipData.properties.NAMELSAD}
    </div>
  )
}

export default Tooltip