
import { useState, useEffect } from "react"
import Dataslot from "./Dataslot"

const Datacard = ({ activeCounty, neighborhood, countydata }) => {

  const [ activeLoaded, setActiveLoaded ] = useState(false)
  const [ neighborhoodLoaded, setNeighborhoodLoaded ] = useState(false)
  const [ countyProperties, setCountyProperties ] = useState()
  // const [ activeData, setActiveData ] = useState()
  const [ activeData, setActiveData ] = useState({
    NAMELSAD: null,
    STATE_NAME: null,
    GEOID: null,
    pop: null,
    landArea: null,
    waterArea: null,
    totalArea: null,
    density: null,
  })
  const [ neighborData, setNeighborData ] = useState({
    nAtotal: null,
  })

  const mToMi = 0.0000003861

  const prettify = (value, sig = 0, locale="en-US")=>{
    if (value) {
      return value.toLocaleString(locale, {maximumFractionDigits: sig})
    }
    return null
  }

  // Check if data is loaded
  useEffect(()=>{
    if (activeCounty) {setActiveLoaded(true)}
    if (neighborhood.length > 0) {setNeighborhoodLoaded(true)}
  }, [activeCounty, neighborhood])
  
  // Once county data loads in (always does, but still)
  useEffect(()=>{
    if (countydata) {
      setCountyProperties(countydata.objects.counties.geometries.map(c=>c.properties))
    }
  }, [ countydata ])


  // Active Data Infrastructure
  useEffect(()=>{
    if (activeLoaded) {
      const activeData = JSON.parse(activeCounty)

      const NAMELSAD = activeData.NAMELSAD
      const STATE_NAME = activeData.STATE_NAME
      const GEOID = activeData.GEOID
      const pop = parseInt(activeData.POPESTIMATE2022)
      const landArea = parseInt(activeData.ALAND) * mToMi
      const waterArea = parseInt(activeData.AWATER) * mToMi
      const totalArea = ( parseInt(activeData.ALAND) + parseInt(activeData.AWATER) ) * mToMi
      const density = pop/totalArea
      setActiveData({
        NAMELSAD, STATE_NAME, GEOID,
        pop, landArea, waterArea, totalArea, density
      })

    }
  }, [ activeCounty ])

  // Neighbor Data Infrastructure
  useEffect(()=>{
    if (neighborhoodLoaded) {
      const nProperties = countyProperties.filter(c=>neighborhood.includes(c.GEOID))
      
      const nALand = nProperties.reduce((acc, neighbor) => acc + parseInt(neighbor.ALAND), 0)
      const nAWater = nProperties.reduce((acc, neighbor) => acc + parseInt(neighbor.AWATER), 0)
      const nATotal = ( nALand + nAWater ) * mToMi
      
      setNeighborData({ nALand, nAWater, nATotal })

    }
  }, [neighborhood])


  return (
    <div className="datacard">
      <span className="countyName">{ activeData.NAMELSAD}</span>
      <span className="stateName">{ activeData.STATE_NAME }</span>
      
      {/* <span className="geoid">({ data.GEOID })</span> */}

      <hr className="subhr" />
      

      <Dataslot 
        id="population"
        value={ prettify(activeData.pop) }
        label="population"
      />
      <Dataslot 
        id="area"
        value={ prettify(activeData.totalArea) }
        label="land (mi²)"
      />
      <Dataslot 
        id="density"
        value={ prettify(activeData.density, 1) }
        label="density (people/mi²)"
      />
      <hr className="mainhr" />

      <span className="countyName">Equivalent</span>
      <hr className="subhr"/>
      <Dataslot 
        id="neighborhoodArea"
        value={ prettify(neighborData.nATotal) }
        label="area (mi²)"
      />

    </div>
  )
}

export default Datacard