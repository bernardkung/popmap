
import { useState, useEffect } from "react"
import Dataslot from "./Dataslot"

const Datacard = ({ activeCounty, neighborhood, countydata, popdata }) => {

  const [ activeLoaded, setActiveLoaded ] = useState(false)
  const [ neighborhoodLoaded, setNeighborhoodLoaded ] = useState(false)
  const [ popLoaded, setPoploaded ] = useState(false)
  const [ countyProperties, setCountyProperties ] = useState()
  const [ popdict, setPopdict ] = useState()
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
  
  // Once population data loads in
  useEffect(()=>{
    if (popdata) {
      setPopdict(
        popdata.reduce((dict, p) => (dict[p.STATE + p.COUNTY] = p, dict), {})
      )
      setPoploaded(true)
    }
  }, [ popdata ])

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
    if (neighborhoodLoaded && popLoaded) {
      const nProperties = countyProperties.filter(c=>neighborhood.includes(c.GEOID))
      
      const nALand = nProperties.reduce((acc, neighbor) => acc + parseInt(neighbor.ALAND), 0)
      const nAWater = nProperties.reduce((acc, neighbor) => acc + parseInt(neighbor.AWATER), 0)
      const nATotal = ( nALand + nAWater ) * mToMi

      const nPop = neighborhood
        .map(n => popdict[n].POPESTIMATE2022)
        .reduce((acc, val)=>acc + parseInt(val), 0)
      const nDensity = nPop/nATotal

      setNeighborData({ nALand, nAWater, nATotal, nPop, nDensity })

    }
  }, [neighborhood])



  return (
    <div className="datacard">
      <div className="active half">

        <span className="mainlabel active">{ activeData.NAMELSAD}</span>
        <span className="sublabel active">Equivalent</span>

        {/* <span className="geoid">({ data.GEOID })</span> */}

        <hr className="subhr" />
      
        <Dataslot 
          type="active"
          id="population"
          value={ prettify(activeData.pop) }
          label="population"
        />
        <Dataslot 
          id="area"
          type="active"
          value={ prettify(activeData.totalArea) }
          label="land (mi²)"
        />
        <Dataslot 
          id="density"
          type="active"
          value={ prettify(activeData.density, 1) }
          label="density (people/mi²)"
        />

      </div>
      
      <div className="neighbor half">

        <span className="mainlabel neighbor">{ activeData.STATE_NAME }</span>
        <span className="sublabel neighbor">{neighborhood.length} Counties</span>

        <hr className="subhr"/>
        <Dataslot 
          id="neighborhoodPopulation"
          type="neighbor"
          value={ prettify(neighborData.nPop) }
          label="population"
        />
        <Dataslot 
          id="neighborhoodArea"
          type="neighbor"
          value={ prettify(neighborData.nATotal) }
          label="area (mi²)"
        />
        <Dataslot 
          id="neighborhoodDensity"
          type="neighbor"
          value={ prettify(neighborData.nDensity) }
          label="density (people/mi²)"
        />

      </div>

    </div>
  )
}

export default Datacard