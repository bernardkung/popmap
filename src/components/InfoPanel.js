
const InfoPanel = ({ showInfo, setShowInfo })=>{
  
  const handleClick = ()=>{
    setShowInfo(!showInfo)
  }

  const infoText = "Right click a county to select. Left click to build a group of counties with an equivalent population."

  return (
    <div 
      className="infoPanel flexCol centerText"
      onClick={handleClick}
    >
      <img 
      className={"closeIcon infoIcon"}
        src={showInfo 
          ? process.env.PUBLIC_URL + '/info-close.svg'
          : process.env.PUBLIC_URL + '/info-icon.svg'
        } 
      />
      <p><span className="pinkText">Right click</span> to select a <span className="pinkText">county</span>.</p>
      <p><span className="blueText">Left click</span> to build a <span className="blueText">group of counties</span> with an equivalent population.</p>
      <p color="#a7a7a7">Click anywhere to exit!</p>
    </div>
  )
}

export default InfoPanel