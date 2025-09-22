import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'

function Routing() {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/' element = {<Home/>}/>             
            </Routes>
        </Router>
    </div>
  )
}

export default Routing