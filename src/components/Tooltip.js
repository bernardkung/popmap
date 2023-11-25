
const Tooltip = ({tooltipData}) => {
  if (!tooltipData) { return null }

  console.log(tooltipData.properties)
  // const [ xPos, yPos, width, height ] = tooltipData.box
  // console.log("X", tooltipData.box.x - 160)

  return (
    <div className="tooltip" style={{
      left: tooltipData.box.x - 110,
      top: tooltipData.box.y + 60,
    }}>
      {tooltipData.properties.GEOID} {tooltipData.properties.NAMELSAD}
    </div>
  )
}

export default Tooltip