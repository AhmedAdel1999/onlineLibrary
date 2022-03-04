import React,{useState} from "react";
import {Link,NavLink} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faTimes } from '@fortawesome/free-solid-svg-icons'
import { useSelector,useDispatch } from "react-redux";
import { logout } from "../../features/library/userSlice";
import { useMediaQuery } from "react-responsive";
import "./navbar.css"

const Navroute = () =>{

    const {userInfo,userId,token} = useSelector((state)=>state.user)   
    const isAdmin = userInfo.role===1?true:false
    const isShowToggle = useMediaQuery({maxWidth:992})
    const[toggle,setToggle]=useState(false)
    const fa = `${userInfo.imageUser}`
    const dispatch = useDispatch();

    const handelLogout = async() =>{
        await dispatch(logout())
        setToggle(false)
        window.location.href="/"
    }
    let nav = ()=>{
        if(token && !isAdmin){
            return(
                <React.Fragment>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/">Home</NavLink></li>
                    <li><NavLink onClick={()=>setToggle(false)} to={`/library/${userId}`}>Library{userInfo.booklibrary?userInfo.booklibrary.length:null}</NavLink></li>
                    <li><Link to="/" onClick={handelLogout}>Logout</Link></li>
                    <li>
                        <NavLink onClick={()=>setToggle(false)} exact to={`/profile/${userInfo._id}`}>
                        <img src={userInfo.imageUser?`${fa}`
                         :"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="" />
                        </NavLink>
                    </li>
                </React.Fragment>
            )
        }else if(token && isAdmin){
            return(
                <React.Fragment>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/">Home</NavLink></li>
                    <li><NavLink onClick={()=>setToggle(false)} to="/upload">Upload</NavLink></li>
                    <li><NavLink onClick={()=>setToggle(false)} exact to="/category">Categories</NavLink></li>
                    <li><Link to="/" onClick={handelLogout}>Logout</Link></li>
                    <li>
                        <NavLink onClick={()=>setToggle(false)} exact to={`/profile/${userInfo._id}`}>
                        <img src={userInfo.imageUser?`${fa}`
                        :"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="" />
                        </NavLink>
                    </li>
                </React.Fragment>
            )
        }else{
            return(
                <React.Fragment>
                        <li><NavLink onClick={()=>setToggle(false)} exact to="/">Home</NavLink></li>
                        <li><NavLink onClick={()=>setToggle(false)} exact to="/login">Login</NavLink></li>
                        <li><NavLink onClick={()=>setToggle(false)} exact to="/register">Register</NavLink></li>                       
                </React.Fragment>
            )
        }
    }
    let style={
        overflow:toggle?"visible":"hidden",
        height:isShowToggle===false?"auto":toggle===true?token?isAdmin?"200px":"160px":"120px":"0px"
    }
    return(
        <div className="navbar-section">
           <div className="logo">
                <NavLink onClick={()=>setToggle(false)} to="/">
                    LibraryApp
                </NavLink>
           </div>
           {
               isShowToggle&&
               <div className="toggel" onClick={()=>setToggle(!toggle)}>
                   {
                       toggle?
                       <FontAwesomeIcon icon={faTimes} />
                       :
                       <FontAwesomeIcon icon={faBars} />
                   }
               </div>
           }
            <ul className="links" style={{...style}}>
               {nav()}
            </ul>
        </div>
    )
}
export default Navroute;