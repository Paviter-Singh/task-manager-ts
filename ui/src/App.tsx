import { Login } from './components/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DisplayTasks from './components/DisplayTasks';

import Home from './components/Home';
import Register from './components/Register';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/getTasks' element={<DisplayTasks />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
