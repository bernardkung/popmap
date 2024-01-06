
const InfoButton = ({ showInfo, setShowInfo })=>{
  
  const handleClick = ()=>{
    setShowInfo(!showInfo)
  }

  return (
    <div 
      onClick={handleClick}
    >      
      <img 
        className="infoIcon"
        src={process.env.PUBLIC_URL + '/info-icon.svg'} 
      />
      info: { showInfo.toString() }
    </div>
  )
}

export default InfoButton