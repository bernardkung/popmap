
const MenuOption = ({name, value, algorithm, handleChange })=>{
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <div>
      <input 
        type="radio" 
        className="algorithmOption" 
        name={ name }
        id={ value } 
        value={ value }
        checked={ algorithm == value }
        onChange={handleChange}
      />
      <label htmlFor={ value }>{ capitalize(value) }</label>
      
    </div>
  )
}

export default MenuOption
