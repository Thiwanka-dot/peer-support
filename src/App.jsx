import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home/Home'
import About from './Pages/About/About'
import Features from './Pages/Features/Features'
import Contact from './Pages/Contact/Contact'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Dashboard from './User/Dashboard/Dashboard'
import Peer from './User/Peer/Peer'
import Community from './User/Community/Community'
import Chat from './User/Chat/Chat'
import OTP from './Components/OTP/OTP'
import ForgotPass from './Components/ForgotPass/ForgotPass'
import ResetPass from './Components/ResetPass/ResetPass'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import AdminDashboard from './Admin/AdminDashboard/AdminDashboard'
import UserList from './Admin/UserList/UserList'
import AdminManagement from './Admin/AdminManagement/AdminManagement'
import AdminCommunity from './Admin/AdminCommunity/AdminCommunity'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/features' element={<Features />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route 
          path="/user" 
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path='/peer' element={<Peer/>} />
        <Route path='/community' element={<Community/>} />
        <Route path='/chat' element={<Chat/>} />
        <Route path='/otp' element={<OTP />} />
        <Route path='/forgot-password' element={<ForgotPass />} />
        <Route path='/reset-password' element={<ResetPass />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path='/admin-userList' element={<UserList/>}/>
        <Route path='/admin-management' element={<AdminManagement/>}/>
        <Route path='/admin-community' element={<AdminCommunity/>}/>
      </Routes>
    </>
  )
}

export default App
