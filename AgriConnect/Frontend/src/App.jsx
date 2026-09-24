import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SignUpComponent from './components/Signup';
import LoginComponent from './components/Login';
import FarmingHomePage from './components/Home';
import Marketplace from './components/MarketPlace';
import ProductManager from './components/AddProduct';
import UserSignup from './components/Users/userSignup';
import AddPost from './components/AddPosts';
import Dashboard from './components/Dashboard';
import Chatbot from './component2/Chatbot';
import OrderMessage from './components/OrderMessage';
import MyOrdersUser from './components/MyOrdersUsers';
import BlogDetail from './component2/BlogDetail';
import BlogList from './component2/BlogList';
import CreateBlog from './component2/CreateBlog';
import BlogManager from './component2/BlogManager';
import UpdateBlog from './component2/UpdateBlog';
import Weather from './components/Weather2';
import WeatherDashboard from './component2/WeatherDashboard';
import Weather2 from './components/Weather2';
import HomePage from './component2/HeroSection';
import FarmingWebsites from './components/ConnectGov';
// import WeatherDashboard from './component2/WeatherDashboard';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage/>}></Route>
          <Route path='/weather' element={<Weather2/>}></Route>
          <Route path='/userSignup' element={<UserSignup />}></Route>
          <Route path='/marketplace' element={<Marketplace />}></Route>
          <Route path='/speakeasy' element={<>Easy</>}></Route>
          <Route path='/signup' element={<SignUpComponent />}></Route>
          <Route path='/login' element={<LoginComponent />}></Route>
          <Route path='/userProducts' element={<ProductManager />}></Route>
          <Route path='/userPosts' element={<AddPost />}></Route>
          <Route path='/addProducts' element={<ProductManager />}></Route>
          <Route path='/userOrders' element={<MyOrdersUser />}></Route>
          <Route path='/OrderMessage' element={<OrderMessage />}></Route>
          <Route path='/MyOrdersUser' element={<MyOrdersUser />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path="/blogsList" element={<BlogList />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path='/chatbot' element={<Chatbot />} />
          <Route path="/manage-blogs" element={<BlogManager />} />
          <Route path="/update/:id" element={<UpdateBlog />} />
          <Route path="/connectGov" element={<FarmingWebsites/>} />


        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

