import { useState } from 'react';
import { Login } from './components/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DisplayTasks from './components/DisplayTasks';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/getTasks' element={<DisplayTasks />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
