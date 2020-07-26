import React, { useState } from 'react';

function App() {
  let nombres = ['athletic', 'real', 'osasuna'];
  let [equipos, setEquipos] = useState(nombres);

  // let equiposJSX = [
  //   <li>{equipos[0]}</li>,
  //   <li>{equipos[1]}</li>,
  //   <li>{equipos[2]}</li>,
  // ]
 
  // let equiposJSX = [];
  // for(let i = 0; i < equipos.length; i++){
  //   let equipo = equipos[i];
  //   let elemento = <li>{equipo}</li>
  //   equiposJSX.push(elemento);
  // }

  // let equiposJSX = equipos.map(function(equipo) {
  //   return <li>{equipo}</li>;
  // });

  // let equiposJSX = equipos.map((equipo) => <li>{equipo}</li>);

  return (
    <div>
      <ol>
        {/* {equiposJSX} */}
        {equipos.map((equipo) => <li>{equipo}</li>)}
        {/* <li>{equipos[0]}</li>
        <li>{equipos[1]}</li>
        <li>{equipos[2]}</li> */}
      </ol>
    </div>
  )
}

export default App;