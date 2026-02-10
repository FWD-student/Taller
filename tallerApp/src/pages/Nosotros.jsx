import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Conocenos from '../components/Conocenos/Conocenos'

function Nosotros() {
  return (
    <div className="pageContainer">
      <Header/>
      <main className="pageContent">
        <Conocenos/>
      </main>
      <Footer/>
    </div>
  )
}

export default Nosotros