import React,  {useState}from 'react';


function App() {
  let equipe = ['athletic', 'real', 'osasuna'];

  let  [nombre,setNombre]= useState("")
function Cambio(event) {

  setNombre(event.target.value)
  
}

let  [equipo,setEquipo]= useState(equipe)

function añadir() {

  setEquipo([...equipo, nombre])
  
}

const mostrar=equipo.map((equips) => <li>{equips}</li>)

  return (
    <div className="App">
    <input type="text"
    value={nombre}
    onChange={Cambio}      />
     <p>{mostrar}</p>

     <button onClick={añadir}>añade un equipo nuevo</button>
     
    
    </div>
  );
}

export default App;
