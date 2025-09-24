import React from 'react'
import Header from '../components/Header/Header'
import Form from '../components/Form/Form'
import Footer from '../components/Footer/Footer'
import Marcas from '../components/Marcas/Marcas'

function Home() {
  return (
    <div>
        <Header/>
        <Form/>
        <Marcas/>
        <Footer/>
    </div>
  )
}

export default Home