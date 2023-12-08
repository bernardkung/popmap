
const Dataslot = ({ id, value, label }) => {
  if (!id) {
    return null
  }
  return (
    <div className="dataslot" id={ id }>
      <p className="value">{ value }</p>
      <p className="label"> { label }</p>
    </div>
  )
}

export default Dataslot