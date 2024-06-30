import { Route, Routes } from 'react-router-dom'
import GameTable from './screens/GameTable '
import GameBoard from './screens/GameBoard'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<GameTable/>} />
        <Route path='/game' element={<GameBoard/>} />
      </Routes>
    </div>
  )
}

export default App
