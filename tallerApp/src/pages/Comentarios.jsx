import React from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ComentariosUsers from '../components/ComentariosUsers/ComentariosUsers'

function Comentarios() {
  return (
    <div className="pageContainer">
      <Header />
      <main className="pageContent">
        <ComentariosUsers />
      </main>
      <Footer />
    </div>
  )
}

export default Comentarios