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
    <div className="pageContainer">
      <Header/>
      <main className="pageContent">
        <CompoDual servicioSeleccionado={servicioSeleccionado}/>
        <Marcas/>
      </main>
      <Footer/>
    </div>
  )
}

export default Home