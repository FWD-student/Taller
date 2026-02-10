import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ServicioPublico from '../components/ServicioPublico/ServicioPublico'

function Servicios() {
  return (
    <div className="pageContainer">
      <Header/>
      <main className="pageContent">
        <ServicioPublico/>
      </main>
      <Footer/>
    </div>
  )
}

export default Servicios