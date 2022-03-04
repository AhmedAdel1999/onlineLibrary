import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams,useHistory } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import Ring from "react-cssfx-loading/lib/Ring"
import { DeleteAcount, logout, UpdateAccount, UserData,clearState, imgUpload } from "../../features/library/userSlice";
import { useToasts } from "react-toast-notifications";
import { fileUpload } from "../utils/uploadFiles";
import "./profile.css"

const Profile = () =>{
    
    const {userInfo,isError,isSuccess,isLoading,errorMsg} = useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const history = useHistory()
    const {id} = useParams()
    const { addToast:notify } = useToasts()
    const[file,setFile] = useState(null)
    const[user,setUser]=useState({ _id: userInfo._id,username:userInfo.username,email:userInfo.email,password:"",imageUser:userInfo.imageUser })
    let img


    useEffect(()=>{
        dispatch(clearState())
    },[])

    useEffect(()=>{
      if(file){
          if(file.size>1024*1024){
              notify(`you have to choose image with less size`,{
                  appearance: 'error',
                  autoDismiss:"true"
              })
              setFile(null)
          }
      }
    },[file])

    useEffect(()=>{
      const fun = async () =>{
        await dispatch(UserData(id))
        await dispatch(clearState())
        history.push("/")
      }
     if(isSuccess){
        notify(`profile has been updated!`,{
          appearance: 'success',
          autoDismiss:"true"
        })
        fun();
     }
     else if(isError){
        notify(`${errorMsg}`,{
          appearance: 'error',
          autoDismiss:"true"
        })
        dispatch(clearState())
     }
    },[isError,isSuccess])
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file) {
          await dispatch(imgUpload())
          const image = await fileUpload(file);
          img = image
        }
        let info={...user,imageUser:img}
        dispatch(UpdateAccount({id,info}))
    };

    const deleteYourAcount = async() =>{
      //eslint-disable-next-line no-restricted-globals
      if(confirm("Do you really want to delete your acount")==true){
        try {
          await dispatch(DeleteAcount(id))
          await dispatch(logout())
          window.location.href="/register"
        } catch (error) {
          notify(`${error}`,{
            appearance: 'error',
            autoDismiss:"true"
        })
        }
      }
    }
    return(
      <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit} >
          <div className="settingsPP">
            <h4>Profile Picture</h4>
            <div className="profilePic">
              <img
                src={file? URL.createObjectURL(file) :
              user.imageUser ?`${user.imageUser}`:
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                alt=""
              />
              <label htmlFor="fileInput">
                <FontAwesomeIcon icon={faUserCircle} />
              </label>
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>
          <div>
            <label>Username</label>
            <input
              type="text"
              placeholder={user.username}
              value={user.username}
              onChange={e=>setUser({...user,username:e.target.value})}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder={user.email}
              value={user.email}
              onChange={e=>setUser({...user,email:e.target.value})}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              onChange={e=>setUser({...user,password:e.target.value})}
            />
          </div>
          <div className="settingsSubmit">
            <button type="submit">
              <span>Update</span>
              {
                isLoading&&
                <Ring color="#FFF" width="25px" height="25px" duration="1s" />
              } 
            </button>
          </div>
        </form>
        <div className="deleteAcount"><button onClick={deleteYourAcount}>Delete Acount</button></div>
      </div>
    </div>
    )
}
export default Profile