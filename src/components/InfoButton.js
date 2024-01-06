
const InfoButton = ({ showInfo, setShowInfo })=>{
  
  const handleClick = ()=>{
    setShowInfo(!showInfo)
  }

  return (
    <div 
      className="infoButton"
      onClick={handleClick}
    >      
      <img 
        className="infoIcon"
        src={process.env.PUBLIC_URL + '/info-icon.svg'} 
      />

    </div>
  )
}

export default InfoButton