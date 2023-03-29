import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Allbooks, checkAll, deletebook,deleteAllbooks,clearState as clearBookState } from "../../features/library/booksSlice";
import { clearState } from "../../features/library/userSlice";
import { useToasts } from "react-toast-notifications";
import Loading from "../loading/Landing";
import Bookcard from "../bookCard/Bookcard";
import Authuser from "../utils/Userauth";
import "./home.css"

const Home = () =>{

    const {bookList,isSuccess:isSuc,isError:isErr,successMsg:sucMsg,errorMsg:errMsg} = useSelector((state)=>state.books)
    const {isError,isSuccess,errorMsg,successMsg} = useSelector((state)=>state.user)
    const categories = useSelector((state)=>state.category.categories)
    const[ischeck,setIscheck] = useState(false)
    const[checkAlll,setCheckAll] = useState(false)
    const { addToast:notify } = useToasts()
    const[val,setVal] = useState("")
    const dispatch = useDispatch();
    const isAdmin = Authuser()


    useEffect(()=>{
        dispatch(clearState())
        dispatch(clearBookState())
    },[])

    useEffect(()=>{
        const fun = async () =>{
            await dispatch(Allbooks())
            dispatch(clearState())
            dispatch(clearBookState())
        }
        if(isSuccess || isSuc){
            notify(`${successMsg || sucMsg}`,{
                appearance: 'success',
                autoDismiss:"true"
            })
            fun();
        }else if(isError || isErr){
            notify(`${errorMsg || errMsg}`,{
                appearance: 'error',
                autoDismiss:"true"
            })
            dispatch(clearState())
            dispatch(clearBookState())
        }
    },[isError,isSuccess,isErr,isSuc])

    const filteredBooks = () =>{
      if(val===""){
          return [...bookList]
      }else{
          return [...bookList.filter((ele)=>ele.category===val)]
      }
    }
    
    const deleteBook = async (bookId) =>{
        //eslint-disable-next-line no-restricted-globals
        if(confirm("Do you really want to delete this book")==true){
            await dispatch(deletebook(bookId))
        }
        
    }
    const checkAllBooks = async() =>{
       await dispatch(checkAll(!ischeck))
        setIscheck(!ischeck)
        setCheckAll(!checkAlll)
    }

    const deleteAll = async () =>{
        //eslint-disable-next-line no-restricted-globals
        if(confirm("Do you really want to delete thees books")==true){
           await dispatch(deleteAllbooks(bookList))  
           setCheckAll(false) 
        }
    }
    return(
        <div className="home-section">
            <div className="home-header">
                <div className="filtering">
                    <select onChange={(e)=>setVal(e.target.value)}>
                        <option value="">filter by category</option>
                        {categories.map((ele)=>{
                        return(
                            <option key={ele._id} value={ele._id}>{ele.name}</option>
                        )
                        })}
                    </select>
                </div>
                {
                    isAdmin&&
                    <div className="deleteing">
                        <div className="selectAll">
                           <span>selectAll:</span>
                           <input type="checkbox" checked={checkAlll} onChange={checkAllBooks} />
                        </div>
                        <button onClick={deleteAll}>deleteAll</button>
                    </div>
                }
            </div>
            {filteredBooks().length>0?
            <div className="books">
                {
                    filteredBooks().map((ele)=>{
                        return <Bookcard key={ele._id} id={ele._id}
                        category={ele.category} isCheck={ele.isCheck}
                        isAdmin={isAdmin} deleteBook={deleteBook}
                        imgSrc={ele.image} title={ele.title}
                        />
                    })
                }
            </div>
            :
            <Loading />
            }
        </div>
    )
}
export default Home;