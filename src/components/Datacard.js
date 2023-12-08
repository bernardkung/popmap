import { active } from "d3"

const Datacard = ({ activeCounty }) => {

  if (!activeCounty) {return null}
  const data = JSON.parse(activeCounty)
  // console.log("<>", data, activeCounty["NAMELSAD"])
  // console.log(parseInt(data.POPESTIMATE2022).toLocaleString('en-US'))
  const pop = parseInt(data.POPESTIMATE2022)
  const landArea = parseInt(data.ALAND) * 0.0000003861
  const waterArea = parseInt(data.AWATER) * 0.0000003861
  const totalArea = ( parseInt(data.ALAND) + parseInt(data.AWATER) ) * 0.0000003861 

  return (
    <div className="datacard">
      <span className="countyName">{ data.NAMELSAD }</span>
      <span className="stateName">{ data.STATE_NAME }</span>
      
      <span className="geoid">({ data.GEOID })</span>

      <hr />
      
      <div className="dataslot" id="population">
        <p className="value">{ pop.toLocaleString('en-US') }</p>
        <p className="label">population</p>
      </div>

      <div className="dataslot" id="area">
        <p className="value">{ totalArea.toFixed(0).toLocaleString('en-US') } </p>
        <p className="label">land (mi²)</p>
      </div>

      <div className="dataslot" id="density">
        <p className="value">{ (pop/totalArea).toFixed(1).toLocaleString('en-US') } </p>
        <p className="label">density (pop/mi²)</p>
      </div>

    </div>
  )
}

export default Datacard