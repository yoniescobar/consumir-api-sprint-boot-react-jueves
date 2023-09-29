import React from 'react'
// import CategoriaTable from './components/CategoriaTable'
// import Categoria from './components/Categoria'  
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import VerProductos from './components/VerProductos'
import CategoriaTable from './components/CategoriaTable'

const App = () => {
  return (
    <div className='container'>
      <h1 className='text-center'>Cosumir Api-Book  Spring Boot y React</h1>
      <h3 className='text-center py-3'>Muestra Listado de Categoria</h3>
      
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VerProductos />} />
        </Routes>
      </BrowserRouter>


    </div>
  )
}

export default App
