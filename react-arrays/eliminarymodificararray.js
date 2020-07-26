import React, { useState } from 'react';

function App() {
  let nombres = ['athletic', 'real', 'osasuna'];
  let [equipos, setEquipos] = useState(nombres);
  function cambiarArray() {
    // setEquipos(['bilbao basket', 'gipuzkoa basket', 'baskonia']);
    // equipos.push('eibar');

    // let nuevosEquipos = equipos;
    // nuevosEquipos.push('eibar');

    // let nuevosEquipos = [];
    // for(let i = 0; i < equipos.length; i++) {
    //   let equipo = equipos[i];
    //   nuevosEquipos.push(equipo);
    // }

    // let nuevosEquipos = equipos.slice(0);
    let nuevosEquipos = [...equipos, 'eibar'];
   
   
   
   
   
   
   
    let equiposFiltrados = [];
    for(let i = 0; i < equipos.length; i++) {
      if(equipos[i] !== 'real') {
        equiposFiltrados.push(equipos[i])
      }
    }
    let equiposfilter = equipos.filter(function(equipo) {
      if(equipo !== 'real') {
        return true;
      } else {
        return false;
      }
    });
    equipos.filter()
    setEquipos(nuevosEquipos);
  }
  return (
    <div>
      <ol>
        {equipos.map((equipo) => <li>{equipo}</li>)}
      </ol>
      <button onClick={cambiarArray}>Cambiar array</button>
    </div>
  )
}

export default App;
