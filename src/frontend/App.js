import './App.css';
import Header from './components/Header.js';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './components/Login.js'
import Home from './components/Home.js'
import ProductPage from './components/ProductPage.js'
import Checkout from './components/Checkout.js'
import Footer from './components/Footer.js'
import Signup from './components/Signup'
import Catalog from './components/Catalog.js'
import Account from './components/Account.js'
import {useEffect} from 'react'
import {useStateValue} from './StateProvider.js'
import UserService from "./utilities/UserService";



function App() {
  const [{loggedinuser}, dispatch] = useStateValue()
  useEffect( () => {
      //On startup, check if a cookie exists and initiate the login based on the cookie
      const getCookie = async () => {
          return await UserService.getCookie()
      }
      getCookie().then(res => {
          console.log(res)
          if(res.data.login){
              dispatch({
                  type: 'SET_LOGIN',
                  user: res.data.login.userInfo
              })
          } else{
              dispatch({
                  type: 'SET_LOGIN',
                  user: null
              })
          }
      }).catch(err => {
          console.error(err)
      })
  }, [])

  return (
      <Router>
        <div className="App">
            <Routes>
                <Route path="/product/:productId" element={
                    <div>
                        <Header/>
                        <ProductPage />
                        <Footer/>
                    </div>
                } />
                <Route path="/catalog/:search?" element={
                    <div>
                        <Header/>
                        <Catalog/>
                        <Footer/>
                    </div>
                } />
                <Route path="/checkout" element={
                    <div>
                        <Header/>
                        <Checkout/>
                        <Footer/>
                    </div>
                } />
                <Route path="/login" element={
                    <div>
                        <Login/>
                        <Footer/>
                    </div>
                }/>
                <Route path="/" element={
                    <div>
                        <Header/>
                        <Home/>
                        <Footer/>
                    </div>
                }/>
                <Route path="/signup" element={
                    <div>
                        <Signup/>
                        <Footer/>
                    </div>
                }/>
                <Route path="/account" element={
                    <div>
                        <Header />
                        <Account />
                        <Footer />
                    </div>
                } />
            </Routes>
        </div>
      </Router>
  );


}

export default App;
