import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOne, UpdateLibrary } from "../../features/library/userSlice";
import { Table } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import "./library.css"


const Library = () =>{
    const {id} = useParams();
    const dispatch = useDispatch()
    const Library = useSelector((state)=>state.user.Library)
    const bookList = useSelector((state)=>state.books.bookList)
    console.log(Library)

    const updateLib = () =>{
        let newLib=[]
        Library.forEach(ele => {
            let test = false
           if(bookList.length>0){
                bookList.forEach((x)=>{
                    if(ele._id===x._id){
                        test=true
                        newLib.push(x)
                    }
                })
                if(test===false){newLib.push(ele)}
           }else{
               newLib.push(ele)
           }
        });
        return newLib
    }
    useEffect(()=>{
        if(Library.length>0){
            dispatch(UpdateLibrary({id:id,bookdata:updateLib()}))
        }
    },[])
    
    const download=async (filename) => {
        axios({
            url: `https://onlinelibraryapi.onrender.com/pdf/${filename}`,
            method: 'GET',
            responseType: 'blob', // important
            }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));        
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}.pdf`);
            document.body.appendChild(link);
            link.click();
        });
    }
    const clearLibrary = () =>{
      let Finalbooks = []
      //eslint-disable-next-line no-restricted-globals
      if(confirm("Do you really want to delete all books")==true){
        dispatch(DeleteOne({id:id,bookdata:Finalbooks}))
      }
    }
    const deleteOne = (bookid) =>{
      let Finalbooks = [...Library.filter((ele)=>ele._id!==bookid)]
      //eslint-disable-next-line no-restricted-globals
      if(confirm("Do you really want to delete this book")==true){
        dispatch(DeleteOne({id:id,bookdata:Finalbooks}))
      }
    }
    const calcSize = (size)=>{
       let KB = (size/1024).toFixed(0);
       let MB = (size/1048576).toFixed(0);
       let GB = (size/1073741824).toFixed(0);
       if(KB<=999){
           return `${KB}KB`
       }else if(MB<=999){
        return `${MB}MB`
       }else{
        return `${GB}GB`
       }
    }
    return(
        <div className="library">
            {Library.length>0?
            <table className="table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Size</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
                {
                    Library.map((ele)=>{
                       return(
                        <tr key={ele._id}>
                          <td><div><img src={`${ele.image}`} alt=""/></div></td>
                          <td><div>{calcSize(ele.size)}</div></td>
                          <td><div>{ele.title}</div></td>
                          <td>
                               <div>
                               <button onClick={()=>download(ele.filename)}>Download</button>
                               <button onClick={()=>deleteOne(ele._id)}>Delete</button>
                               <Link to={`/viewpdf/${ele.filename}`}>
                               <button>View</button>
                               </Link>
                               </div>
                          </td>
                        </tr> 
                       )
                    })
                }
            </tbody>
          </table>
          :<p>Library Have No Items Yet</p>}
            {Library.length>0?<div><button onClick={clearLibrary}>Clear All</button></div>:null}
        </div>
    )
}
export default Library;

