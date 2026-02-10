import React from 'react'
import Administracion from '../components/Administracion/Administracion'
import Header from '../components/Header/Header'

function Admin() {
  return (
    <div className="pageContainer">
      <Header/>
      <main className="pageContent">
        <Administracion/>
      </main>
    </div>
  )
}

export default Admin