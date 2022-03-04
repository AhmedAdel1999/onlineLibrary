import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes,faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'
import { useToasts } from "react-toast-notifications";
import Ring from "react-cssfx-loading/lib/Ring"
import { Addbook, Updatebook,clearState,Allbooks, imgOrFileUpload } from "../../features/library/booksSlice";
import { useParams,useHistory } from "react-router";
import { fileUpload } from "../utils/uploadFiles";
import axiosInstance from "../utils/baseUrl";
import "./upload.css"


const Upload = () =>{

    const categories = useSelector((state)=>state.category.categories)
    const {bookList,isError,isSuccess,isLoading,errorMsg,successMsg} = useSelector((state)=>state.books)
    const{id}=useParams()
    const dispatch = useDispatch();
    const { addToast:notify } = useToasts()
    const history = useHistory()
    const[file,setFile]=useState(null)
    const[image,setImage]=useState(null)
    const[Edit,setEdit]=useState(false)
    const[data,setData]=useState({description:"",title:"",category:categories.length!==0?categories[0]._id:"",})
    let filename=data.filename?data.filename:null
    let img=data.image?data.image:null
    let size

    useEffect(()=>{
      if(id){
         setData({...[...bookList.filter((ele)=>ele._id===id)][0]})
         setImage([...bookList.filter((ele)=>ele._id===id)][0].image)
         setEdit(!Edit)
      }
    },[])

    useEffect(()=>{
        if(image){
            if(image.size>1024*1024){
                notify(`you have to choose image with less size`,{
                    appearance: 'error',
                    autoDismiss:"true"
                })
                setImage(null)
            }
        }
    },[image])

    useEffect(()=>{
        dispatch(clearState())
    },[])

    useEffect(()=>{
        const fun = async () =>{
            await dispatch(Allbooks())
            await dispatch(clearState())
            notify(`${successMsg}`,{
                appearance: 'success',
                autoDismiss:"true"
            })
            history.push("/")
        }
      if(isSuccess){
        fun(); 
      }else if(isError){
        notify(`${errorMsg}`,{
            appearance: 'error',
            autoDismiss:"true"
        })
        dispatch(clearState())
      }
    },[isError,isSuccess])

    const handelChange =  (e) =>{
       setData({...data,
        [e.target.name]:e.target.value
    })
    }

    const handelSubmit = async (e) =>{
      e.preventDefault();
      if(file||(image&&typeof(image)==="object")){ 
        const filedata =new FormData();
        filedata.append("file", file);
        if(file){size=file.size}
        try {
            if(image&&file===null){
                await dispatch(imgOrFileUpload())
                const res = await fileUpload(image)
                img= res
            }else if(file&&image===null){
                await dispatch(imgOrFileUpload())
                const ress= await axiosInstance.post('/upload', filedata)
                filename=await ress.data.filename
            }else if(file&&image){
                await dispatch(imgOrFileUpload())
                const res = await fileUpload(image)
                img= res
                const ress= await axiosInstance.post('/upload', filedata)
                filename=await ress.data.filename
            }else{
                notify(`you have to choose image and pdf file together`,{
                    appearance: 'error',
                    autoDismiss:"true"
                })
            }
            
        } catch (error) {
            notify(`${error}`,{
                appearance: 'error',
                autoDismiss:"true"
            })
        }
      }

        if(Edit){
        dispatch(Updatebook({id:id,bookdata:{...data,image:img,filename:filename,size:size}}))
        }else{
        if(file===null || image===null || data.title==="" || data.category==="" || data.description===""){
            notify(`you have to fill all fields with data`,{
                appearance: 'error',
                autoDismiss:"true"
            })
            dispatch(clearState())
        }else{
            dispatch(Addbook({...data,image:img,filename:filename,size:size}))
        }
        }
    }
    return(
        <div className="create-section">
          <form onSubmit={handelSubmit}>
            <div className="img-box">
            {
                image?
                <React.Fragment>
                    <img src={Edit?typeof(image)==="object"?`${URL.createObjectURL(image)}`:`${image}`:`${URL.createObjectURL(image)}`} />
                    <span><FontAwesomeIcon icon={faTimes} onClick={()=>setImage(null)} /></span>
                </React.Fragment>
                :
                <React.Fragment>
                    <label htmlFor="img">+</label>
                    <input style={{display:"none"}} id="img" type="file" onChange={e=>setImage(e.target.files[0])} />
                </React.Fragment>
            } 
            </div>
            <div className="pdfUpload">
               <label htmlFor="pdf">Add Pdf File</label>
               <input 
               type="file" 
               id="pdf"
               style={{display:"none"}}
               onChange={e=>setFile(e.target.files[0])}
               />
               <p>
                  {Edit?`${data.filename}`:file?`${file.name}`:"no file chosen"}
                </p>
            </div>
             <input type="text" placeholder="Title" value={data.title} name="title" onChange={handelChange} />
             <textarea type="text" placeholder=" Write Book Description" value={data.description} name="description" onChange={handelChange} />
             <select value={data.category} name="category" onChange={handelChange}>
                {categories.map((ele)=>{
                    return(
                        <option key={ele._id} value={ele._id}>{ele.name}</option>
                    )
                })}
             </select>
             <button type="submit">
             {
                Edit?
                <React.Fragment>
                    <span>Update</span>
                    {
                    isLoading&&
                    <Ring color="#FFF" width="25px" height="25px" duration="1s" />
                    } 
                </React.Fragment>
                :
                <React.Fragment>
                    <span>Upload</span>
                    {
                    isLoading&&
                    <Ring color="#FFF" width="25px" height="25px" duration="1s" />
                    } 
                    
                </React.Fragment>
            }
             </button>
          </form>
          <button className="backward" onClick={()=>history.goBack()}>
            <FontAwesomeIcon icon={faLongArrowAltLeft} />
          </button>
        </div>
    )
}
export default Upload;