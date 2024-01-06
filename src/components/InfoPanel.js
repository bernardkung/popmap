
const InfoPanel = ({ showInfo, setShowInfo })=>{
  
  const handleClick = ()=>{
    setShowInfo(!showInfo)
  }

  const infoText = "Right click a county to select. Left click to build a group of counties with an equivalent population."

  return (
    <div 
      className="infoPanel"
      onClick={handleClick}
    >
      <img 
      className={"closeIcon infoIcon"}
        src={showInfo 
          ? process.env.PUBLIC_URL + '/info-close.svg'
          : process.env.PUBLIC_URL + '/info-icon.svg'
        } 
      />
      { infoText }
    </div>
  )
}

export default InfoPanel