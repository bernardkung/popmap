
// Input:
// Seed: geoid, forms the core of a neighborhood
// neighbors: list of neighbors of each geoid
// Output:
// Neighborhood: List of geoids

function getNeighbors(geoids, countiesData, ascending=true) {
  const ids = Object.keys(countiesData)
  const neighbors = geoids
    .map(geoid => countiesData[geoid].neighbors) // Get neighbors
    .flat(Infinity) // Flatten array
    .filter((v,i,a)=>a.indexOf(v)==i) // Drop duplicates
    .filter(i=>!geoids.includes(i)) // Drop neighbors in provided geoids
    .sort((a, b)=>{
      const aPop = parseInt(countiesData[a].POPESTIMATE2022)
      const bPop = parseInt(countiesData[b].POPESTIMATE2022)
      return ascending 
        ? aPop < bPop ? -1 : aPop > bPop ? 1 : 0
        : aPop > bPop ? -1 : aPop < bPop ? 1 : 0
    })
    
  return neighbors
}

function buildNeighborhood(
  geoid, targetPop, counties, countiesData, valuemap, ids, neighbors
) {

  function checkNeighbors(
    geoids, neighborGeoids, targetPop, totalPop, countiesData, iter) {
    // Loop through each neighbor
    let added = 0
    for (let i = 0; i < neighborGeoids.length; i++) {
      const geoid = neighborGeoids[i]
      const countyPop = parseInt(countiesData[geoid].POPESTIMATE2022)


      // First Exit Condition: target pop exceeded
      if ( countyPop + parseInt(totalPop) > parseInt(targetPop) ) {
        // Second Exit Condition: no neighbors added
        if (added == 0) {
          return geoids
        }
        // New neighbors may exist, proceeds to below to build new neighbors  
        break

        // Add the neighbor to array of geoids, increase the population
      } else {
        totalPop = parseInt(totalPop) + parseInt(countyPop)
        geoids.push(geoid)
        added += 1
      }
    }
    // Generate a new set of neighboring counties
    const newNeighbors = getNeighbors(geoids, countiesData)
    // if there are no new neighbors, don't loop forever
    if (newNeighbors.length==0) {
      return geoids
    } 

    return checkNeighbors(geoids, newNeighbors, targetPop, totalPop, countiesData, iter+=1)
  }

  // Get unique neighboring geoids, sorted by population
  const neighborGeoids = getNeighbors([geoid], countiesData)
  // Get initial population of clicked county
  const initPop = valuemap.get(geoid)
  return checkNeighbors([geoid], neighborGeoids, targetPop, initPop, countiesData, 0)
}

export default buildNeighborhood