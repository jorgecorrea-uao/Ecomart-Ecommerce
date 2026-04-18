import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import { AuthProvider} from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
            <Navbar></Navbar>
            <Routes>
                <Route path='/' element={<Navigate to={"/login"}></Navigate>}></Route>
                <Route path='/login' element={<Login></Login>}></Route>
                <Route path='/register' element={<Register></Register>}></Route>
                <Route
                path='./Home'
                element={<ProtectedRoute><Home></Home></ProtectedRoute>}>
                </Route>
            </Routes>
        </BrowserRouter>
        </AuthProvider>
        
    )
}

export default App


