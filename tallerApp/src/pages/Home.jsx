import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Marcas from '../components/Marcas/Marcas'
import CompoDual from '../components/ComponenteDual/CompoDual'

function Home() {
  const location = useLocation()
  const servicioSeleccionado = location.state?.servicioSeleccionado

  return (
    <div>
        <Header/>
        <CompoDual servicioSeleccionado={servicioSeleccionado}/>
        <Marcas/>
        <Footer/>
    </div>
  )
}

export default Home