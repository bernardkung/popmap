import { active } from "d3"


const Datacard = ({ activeCounty }) => {

  if (!activeCounty) {return null}
  const data = JSON.parse(activeCounty)
  // console.log("<>", data, activeCounty["NAMELSAD"])
  // console.log(parseInt(data.POPESTIMATE2022).toLocaleString('en-US'))

  return (
    <div className="datacard">
      <span className="countyName">{ data.NAMELSAD }</span>
      <span className="stateName">{ data.STATE_NAME }</span>
      
      <span className="geoid">({ data.GEOID })</span>
      <div className="population">
        <p className="value">{ parseInt(data.POPESTIMATE2022).toLocaleString('en-US') }</p>
        <p className="label">population</p>
      </div>
    </div>
  )
}

export default Datacard