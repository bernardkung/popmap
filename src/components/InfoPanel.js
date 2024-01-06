
const InfoPanel = ({ showInfo, setShowInfo })=>{
  
  const handleClick = ()=>{
    setShowInfo(!showInfo)
  }

  const infoText = "Right click a county to select a county. Left click to build a group of counties with an equivalent population."

  return (
    <div 
      className="infoPanel"
      onClick={handleClick}
    >
      { infoText }
    </div>
  )
}

export default InfoPanel