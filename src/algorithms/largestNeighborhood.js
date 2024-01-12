
// Input:
// Seed: geoid, forms the core of a neighborhood
// neighbors: list of neighbors of each geoid
// Output:
// Neighborhood: List of geoids

function getNeighbors(geoids, counties, neighbors, ids, valuemap, ascending=true) {
  
  const getcontigs = geoids => {
    return geoids.map(geoid => {
      const index = neighbors[ids.indexOf(geoid)]
      const result = index.map(i => ids[i])
      return result
    }).flat(Infinity)
  }

  // List of all neighboring FEATURES
  const neighborhood = counties.features
    // Filter for neighbors
    .filter(d => getcontigs(geoids).includes(d.properties.GEOID))
    // Remove original array
    .filter(d => !geoids.includes(d.properties.GEOID))
    .sort((a, b)=>{
      const aPop = parseInt(valuemap.get(a.properties.GEOID))
      const bPop = parseInt(valuemap.get(b.properties.GEOID))
      return ascending 
        ? aPop < bPop ? -1 : aPop > bPop ? 1 : 0
        : aPop > bPop ? -1 : aPop < bPop ? 1 : 0
    })
  
  // Get populations for each neighboring feature
  // const neighborhoodPop = neighborhood
  //     .map(d=>{return {"geoid":d.properties.GEOID, "pop":valuemap.get(d.properties.GEOID)}})
  // console.log(neighborhoodPop)
  
  // Reduce each neighboring feature to geoid
  const neighborhoodIds = neighborhood.map(d=>d.properties.GEOID)
  return neighborhoodIds
}

function buildNeighborhood(geoid, targetPop, counties, valuemap, ids, neighbors) {
  function checkNeighbors(geoids, neighborGeoids, targetPop, totalPop, counties, valuemap, ids, neighbors) {
    // Loop through each neighbor
    let added = 0
    for (let i = 0; i < neighborGeoids.length; i++) {
      const geoid = neighborGeoids[i]
      const countyPop = parseInt(valuemap.get(geoid))
      
      // First Exit Condition: target pop exceeded
      if (countyPop + parseInt(totalPop) > parseInt(targetPop)) {
        // Second Exit Condition: no neighbors added
        if (added == 0) {
          return geoids
        }
        // New neighbors may exist, proceeds to below to build new neighbors
        
      
        // Add the neighbor to array of geoids, increase the population
      } else {
        
        totalPop = parseInt(totalPop) + parseInt(countyPop)
        geoids.push(geoid)
        added += 1
      }
    }
    // Generate a new set of neighboring counties
    console.log(ids)
    
    console.log(counties)
    const newNeighbors = getNeighbors(geoids, counties, neighbors, ids, valuemap)
    
    // Error handling condition
    if (newNeighbors.length==0) {
      return geoids
    }

    return checkNeighbors(geoids, newNeighbors, targetPop, totalPop, counties, valuemap, ids, neighbors)
  }

  // Get unique neighboring geoids, sorted by population
  const neighborGeoids = getNeighbors([geoid], counties, neighbors, ids, valuemap)
  // Get initial population of clicked county
  const initPop = valuemap.get(geoid)
  return checkNeighbors([geoid], neighborGeoids, targetPop, initPop, valuemap, neighbors)
}

export default buildNeighborhood