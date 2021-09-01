import './App.css';
import Header from './components/Header.js';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from './components/Login.js'
import Home from './components/Home.js'
import ProductPage from './components/ProductPage.js'
import Checkout from './components/Checkout.js'
import Footer from './components/Footer.js'
import Navlinks from './components/Navlinks.js'
import Catalog from './components/Catalog.js'
import {auth} from './Firebase.js'
import {useEffect} from 'react'
import {useStateValue} from './StateProvider.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'popper.js'
import 'bootstrap/dist/js/bootstrap.bundle.min'

function App() {
  const [{loggedinuser}, dispatch] = useStateValue()
  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((userauth) => {
          if(userauth){
              dispatch({
                  type: 'SET_LOGIN',
                  user: userauth
              })
          } else{
              dispatch({
                  type: 'SET_LOGIN',
                  user: null
              })
          }
      })
      return () => {
          unsubscribe();
      }
  }, [])


  return (
      <Router>
        <div className="App">
            <Switch>
                <Route path="/product/:id" render={(props) => (
                    <div>
                        <Header/>
                        <ProductPage {...props} />
                        <Footer/>
                    </div>
                )} />
                <Route path="/catalog">
                    <Header/>
                    <Catalog/>
                    <Footer/>
                </Route>
                <Route path="/checkout">
                    <Header/>
                    <Checkout/>
                    <Footer/>
                </Route>
                <Route path="/login">
                    <Login/>
                    <Footer/>
                </Route>
                <Route path="/">
                    <Header/>
                    <Navlinks/>
                    <Home/>
                    <Footer/>
                </Route>
            </Switch>
        </div>
      </Router>
  );


}

export default App;
