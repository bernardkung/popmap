
// import closeIcon from '/info-close.svg'

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
        src={process.env.PUBLIC_URL + '/info-close.svg'} 
      />
      { infoText }
    </div>
  )
}

export default InfoPanel