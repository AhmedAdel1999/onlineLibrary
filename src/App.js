import React, { useEffect, useState } from 'react';
import {BrowserRouter,Route,Switch} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import Register from './components/auth/Register';
import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import Upload from './components/upload/Upload';
import Library from './components/library/Library';
import Login from './components/auth/Login';
import Navroute from './components/navbar/Navroute';
import PageNotFound from './components/pagenotfound/PageNotFound';
import Categories from './components/category/Categories';
import { UserData } from './features/library/userSlice';
import Authuser from './components/utils/Userauth';
import Singlebook from './components/singlebook/Singlebook';
import PdfViewer from './components/pdfComp/pdfComp';
import ScrollButton from './components/scrollbutton/scrollButton';
import { Allbooks } from './features/library/booksSlice';
import { ourCategory } from './features/library/categorySlice';
import './App.css';





const App = () => {
  const token= useSelector((state)=>state.user.token)
  const userId= useSelector((state)=>state.user.userId)
  const[AppHeight,setAppHeight]=useState(`100vh`)
  const isAdmin = Authuser()
  const dispatch = useDispatch()
  
  useEffect(()=>{
     if(token){
      dispatch(UserData(userId))
     }
     dispatch(Allbooks())
     dispatch(ourCategory())
     setAppHeight(`${window.innerHeight - 2}px`)
  },[token])

  
  return (
    <BrowserRouter>
      <div className="App" style={{height:AppHeight}}>
        <Navroute/>
        <ScrollButton />
        <Switch>
        <Route path="/" exact strict component={Home} />
          <Route path="/register" exact strict component={Register} />
          <Route path="/login" exact strict component={Login} />
          <Route path="/upload" exact strict component={isAdmin?Upload:PageNotFound} />
          <Route path="/upload/:id" exact strict component={isAdmin?Upload:PageNotFound} />
          <Route path="/library/:id" exact strict component={token?Library:PageNotFound} />
          <Route path="/profile/:id" exact strict component={token?Profile:PageNotFound} />
          <Route path="/singlebook/:id" exact strict component={Singlebook} />
          <Route path="/viewpdf/:url" exact strict component={PdfViewer} />
          <Route path="/category" exact strict component={isAdmin?Categories:PageNotFound} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
        
