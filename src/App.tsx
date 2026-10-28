import { Routes, Route } from 'react-router-dom'
import Shell from './components/Shell'
import HomePage from './pages/Home'
import Cardapio from './pages/Cardapio'
import Restaurante from './pages/Restaurante'
import Reservas from './pages/Reservas'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<HomePage />} />
        <Route path="cardapio" element={<Cardapio />} />
        <Route path="o-restaurante" element={<Restaurante />} />
        <Route path="reservas" element={<Reservas />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  )
}
