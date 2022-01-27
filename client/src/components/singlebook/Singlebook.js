import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams,useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { AddToLibrary,clearState } from "../../features/library/userSlice";
import Bookcard from "../bookCard/Bookcard";
import Authuser from "../utils/Userauth";
import "./Singlebook.css"
const Singlebook = () =>{

    const{id}=useParams();
    const dispatch = useDispatch()
    const history = useHistory();
    const { addToast:notify } = useToasts()
    const isAdmin = Authuser();
    const {userId,token,Library,isError,isSuccess} = useSelector((state)=>state.user)
    const bookList = useSelector((state)=>state.books.bookList);
    const cuurentBook = [...bookList.filter((ele)=>ele._id===id)][0]
    const relatedBooks = [...bookList.filter((ele)=>ele.category===cuurentBook.category && ele._id!==id)]



    useEffect(()=>{
        dispatch(clearState())
    },[])

    useEffect(()=>{
        if(isSuccess){
            dispatch(clearState())
            notify(`Book Has Been Added To Library!`,{
                appearance: 'success',
                autoDismiss:"true"
            })
        }else if(isError){
            dispatch(clearState())
            notify(`Error!! Failed To Add Book To Library!`,{
                appearance: 'error',
                autoDismiss:"true"
            })
        }
    },[isError,isSuccess])

    const isbookinlib = () =>{
        let check=false
        Library.forEach(ele => {
          if(ele._id===cuurentBook._id){check=true}  
        });
        return check;
    }

    const addtolibrary = async () =>{
       if(token){
            if(isbookinlib()){
                notify(`Book Already In Library!`,{
                    appearance: 'info',
                    autoDismiss:"true"
                })
            }else{
                 dispatch(AddToLibrary({id:userId,bookdata:cuurentBook}))
            }
        }else{
            notify(`Please You Have To Login First!`,{
                appearance: 'warning',
                autoDismiss:"true"
              })
            history.push("/login")
       }
    }
    return(
        <div className="singlebook">
           <div className="bookview">
               <div className="book-img"><img src={`${cuurentBook.image}`}alt="" /></div>
               <div className="book-desc">
                   <h3>book description</h3>
                   <p>{cuurentBook.description}</p>
               </div>
           </div>
           <div className="book-routes">
                <button onClick={addtolibrary}>{isbookinlib()?"inlibrary":"Add To Library"}</button>
                <button onClick={()=>history.goBack()}>go back</button>
           </div>
           {relatedBooks.length>0?
           <div className="relatedbooks">
               <h3>Related Books:</h3>
               <div className="books-cards">
                   {
                        relatedBooks.map((ele)=>{
                            return <Bookcard key={ele._id} id={ele._id}
                            category={ele.category} isCheck={ele.isCheck}
                            isAdmin={isAdmin}
                            imgSrc={ele.image} title={ele.title}
                            />
                        })
                   }
               </div>
           </div>
           :
           null
           }
        </div>
    )
}
export default Singlebook