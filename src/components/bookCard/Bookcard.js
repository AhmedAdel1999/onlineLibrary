import React,{useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { checkoneBook } from "../../features/library/booksSlice";
import { AddToLibrary,clearState } from "../../features/library/userSlice";
import "./bookCard.css"
const Bookcard = ({id,category,title,imgSrc,isAdmin,isCheck,deleteBook}) =>{

    const categories = useSelector((state)=>state.category.categories)
    const {Library,userId,token,isError,isSuccess} = useSelector((state)=>state.user)
    const bookList = useSelector((state)=>state.books.bookList)
    const cuurentBook = [...bookList.filter((ele)=>ele._id===id)][0]
    const { addToast:notify } = useToasts()
    const dispatch = useDispatch()
    const history = useHistory()

    const catchCategory = (id) =>{
        let cat;
        categories.forEach(ele => {
            if(ele._id===id){
                cat=ele.name
            }
        });
        return cat;
    }

    const checkAbook = () =>{
       dispatch(checkoneBook(id))
    }

    const isbookinlib = () =>{
        let check=false
        Library.forEach(ele => {
          if(ele._id===id){check=true}  
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
        <div className="bookcard">
            <div className="bookimg">
                <img src={`${imgSrc}`} alt=""/>
                {isAdmin?
                <input type="checkbox" checked={isCheck} onChange={checkAbook} />
                :
                null
                }
                <span>{catchCategory(category)}</span>
            </div>
            <h3>{title}</h3>
            {
                isAdmin?
                <div className="routes">
                  <Link to={`/upload/${id}`}>Edit</Link>
                  <button onClick={()=>deleteBook(id)}>Delete</button>
                </div>
                :
                <div className="routes">
                  <Link to={`/singlebook/${id}`}>View</Link>
                  <button onClick={addtolibrary}>{isbookinlib()?"inlibrary":"Add To Library"}</button>   
                </div>
            }
        </div>
    )
}
export default Bookcard;