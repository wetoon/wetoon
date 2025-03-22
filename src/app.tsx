
import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'

import './tailwind.init.css'

import Portfolio from './components/Portfolio.tsx'
import PageNotFound from './components/PageNotFound.tsx'

createRoot( document.getElementById('app') as HTMLDivElement ).render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={ <Portfolio /> }></Route>
            <Route path='*' element={ <PageNotFound /> }></Route>
        </Routes>
    </BrowserRouter>
)
