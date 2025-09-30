import React from 'react'
import Form from '../Form/Form'
import Carrusel from '../Carrusel/Carrusel'
import CarruselComentarios from '../CarruselComentarios/CarruselComentarios'
import '../ComponenteDual/compoDual.css'

function CompoDual({ servicioSeleccionado }) {
  return (
    <>
      <div className='bloque'>
        <div className='carrusel'>
          <Carrusel/>
        </div>
        <div className='form'>
          <Form servicioSeleccionado={servicioSeleccionado}/>
        </div>
      </div>

      <div className='bloqueComentarios'>
        <CarruselComentarios/>
      </div>
    </>
  )
}

export default CompoDual