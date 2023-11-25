
const Tooltip = ({interactionData}) => {
  if (!interactionData) { return null }

  console.log(interactionData.box)
  const { xPos, yPos, width, height } = interactionData.box

  return (
    <div className="tooltip" style={{
      left: xPos,
      top: yPos
    }}>
      {interactionData.properties.NAMELSAD}
    </div>
  )
}

export default Tooltip