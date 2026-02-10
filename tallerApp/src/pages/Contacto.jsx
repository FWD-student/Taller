import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Contacta from '../components/Contacta/Contacta'

function Contacto() {
  return (
    <div className="pageContainer">
      <Header/>
      <main className="pageContent">
        <Contacta/>
      </main>
      <Footer/>
    </div>
  )
}

export default Contacto