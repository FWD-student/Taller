import React from 'react'
import Form from '../Form/Form'
import Carrusel from '../Carrusel/Carrusel'
import '../ComponenteDual/compoDual.css'

function CompoDual() {
  return (
    <div className='bloque'>
        <div className='carrusel'>
            <Carrusel/>
        </div>
        <div className='form'>
            <Form/>
        </div>
    </div>
  )
}

export default CompoDual