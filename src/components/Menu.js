
import MenuOption from './MenuOption' 


const Menu = ({ algorithm, setAlgorithm })=>{

  function handleChange(e) {
    setAlgorithm(e.target.value)
  }

  return (
    <div className={'algorithmMenu flexRow'}>
      <MenuOption 
        name={'basic'} 
        value={'basic'} 
        algorithm={algorithm}
        handleChange={handleChange}
      />
      <MenuOption
        name={'smallest'} 
        value={'smallest'} 
        algorithm={algorithm}
        handleChange={handleChange}
      />
      <MenuOption 
        name={'largest'} 
        value={'largest'} 
        algorithm={algorithm}
        handleChange={handleChange}
      />
    </div>
  )
}

export default Menu
