
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
        src={process.env.PUBLIC_URL + '/how_to3.svg'} 
      />

    </div>
  )
}

export default InfoButton