
const Tooltip = ({tooltipData}) => {
  if (!tooltipData) { return null }

  // console.log(tooltipData.properties)
  // const [ xPos, yPos, width, height ] = tooltipData.box
  // console.log("X", tooltipData.box.x - 160)

  return (
    <div className="tooltip" style={{
      left: tooltipData.box.left,
      top: tooltipData.box.top,
    }}>
      <strong>{ tooltipData.properties.NAMELSAD }</strong>
      <br />
      ( {tooltipData.properties.GEOID} )
      <br />
      { tooltipData.properties.POPESTIMATE2022 }
    </div>
  )
}

export default Tooltip