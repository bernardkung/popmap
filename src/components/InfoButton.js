
const InfoButton = ({ showInfo, setShowInfo })=>{
  
  const handleClick = ()=>{
    setShowInfo(!showInfo)
  }

  return (
    <div 
      onClick={handleClick}
    >
      info: { showInfo.toString() }
    </div>
  )
}

export default InfoButton