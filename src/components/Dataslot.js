
const Dataslot = ({ id, type, value, label }) => {
  if (!id) {
    return null
  }
  return (
    <div className={"dataslot " + type} id={ id }>
      <p className={"value " + type}>{ value }</p>
      <p className={"label " + type}> { label }</p>
    </div>
  )
}

export default Dataslot