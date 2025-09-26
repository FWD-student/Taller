import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Marcas from '../components/Marcas/Marcas'
import CompoDual from '../components/ComponenteDual/CompoDual'

function Home() {
  return (
    <div>
        <Header/>
        <CompoDual/>
        <Marcas/>
        <Footer/>
    </div>
  )
}

export default Home