import Routing from './routes/Routing.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'; //sin esto no funciona
import './App.css'

function App() {

  return (
    <div className="appContainer">
      <main className="mainContent">
        <Routing/>
      </main>
    </div>
  )
}

export default App