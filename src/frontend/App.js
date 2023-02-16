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
import {auth} from './Firebase.js'
import {useEffect} from 'react'
import {useStateValue} from './StateProvider.js'
import UserService from "./utilities/UserService";



function App() {
  const [{loggedinuser}, dispatch] = useStateValue()
  useEffect( () => {
      const getCookie = async () => {
          const cookieInfo = await UserService.getCookie()
          return cookieInfo

      }
      getCookie().then(res => {
          console.log(res)
          if(res.data.login){
              dispatch({
                  type: 'SET_LOGIN',
                  user: res.data.login
              })
          } else{
              dispatch({
                  type: 'SET_LOGIN',
                  user: null
              })
          }
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
                <Route path="/catalog" element={
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
            </Routes>
        </div>
      </Router>
  );


}

export default App;
