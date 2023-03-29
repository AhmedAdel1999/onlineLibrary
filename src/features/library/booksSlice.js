import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/utils/baseUrl';
const initialState = {
  bookList:[],
  isError:false,
  isSuccess:false,
  isLoading:false,
  errorMsg:"",
  successMsg:"",
  status: 'idle',
};

export const Addbook =createAsyncThunk(
  "books/Addbook",
  async(obj,{rejectWithValue,fulfillWithValue})=>{
    try {
      let response = await axiosInstance.post(`/bookList/add`,obj)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const Updatebook =createAsyncThunk(
  "books/Updatebook",
  async(obj,{fulfillWithValue,rejectWithValue})=>{
    const {id,bookdata}=obj
    try {
      let response = await axiosInstance.put(`/booklist/edit/${id}`,{...bookdata})
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const Allbooks =createAsyncThunk(
  "books/Allbooks",
  async()=>{
    try {
      let response = await axiosInstance.get(`/bookList`)
      return await response.data
    } catch (error) {
      return error.response
    }
  }
)
export const deletebook =createAsyncThunk(
  "books/deletebook",
  async(id,{rejectWithValue,fulfillWithValue})=>{
    try {
      let response = await axiosInstance.delete(`/booklist/${id}`)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const deleteAllbooks =createAsyncThunk(
  "books/deleteAllbooks",
  async(bookList,{rejectWithValue,fulfillWithValue})=>{
    let testCheack=false
    for (let i = 0; i < bookList.length; i++) {
      try {
        if(bookList[i].isCheck){
          testCheack=true
          let response = await axiosInstance.delete(`/booklist/${bookList[i]._id}`)
        }
      } catch (error) {
        return rejectWithValue(error.response)
      }
    }
    if(testCheack===false){
      return rejectWithValue(false)
    }else{
      return fulfillWithValue(true)
    }
  }
)

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearState:((state)=>{
      state.isError=false;
      state.isSuccess=false;
      state.isLoading=false
      state.errorMsg="";
      state.successMsg=""
    }),
    imgOrFileUpload:((state)=>{
      state.isLoading=true
    }),
    checkAll:((state,action)=>{
      let newbookList=[]
      state.bookList.forEach((ele)=>{
        let newbook={...ele,isCheck:action.payload}
        newbookList.push(newbook)
      })
      state.bookList=[...newbookList]
    }),
    checkoneBook:((state,action)=>{
      state.bookList.forEach((ele)=>{
        if(ele._id===action.payload){
          ele.isCheck=!ele.isCheck
        }
      })
    })
  },
  extraReducers:{
    //Add book
    [Addbook.pending]:((state)=>{
      state.isLoading=true;
    }),
    [Addbook.fulfilled]:((state)=>{
      state.isSuccess=true;
      state.isLoading=false;
      state.successMsg=`A New Book Has Been Added Successfully`
    }),
    [Addbook.rejected]:((state)=>{
      state.isError=true;
      state.isLoading=false;
      state.errorMsg=`Error!! Failed To Add New Book`
    }),

    //update book
    [Updatebook.pending]:((state)=>{
      state.isLoading=true;
    }),
    [Updatebook.fulfilled]:((state)=>{
      state.isSuccess=true;
      state.isLoading=false;
      state.successMsg=`A Book Has Been Updated Successfully`
    }),
    [Updatebook.rejected]:((state)=>{
      state.isError=true;
      state.isLoading=false;
      state.errorMsg=`Error!! Failed To Update This Book`
    }),

    //delete book
    [deletebook.fulfilled]:((state)=>{
      state.isSuccess=true;
      state.successMsg=`A Book Has Been Deleted Successfully`
    }),
    [deletebook.rejected]:((state)=>{
      state.isError=true;
      state.errorMsg=`Error!! Failed To Delete This Book`
    }),

    //delete All books
    [deleteAllbooks.fulfilled]:((state)=>{
      console.log("hi")
      state.isSuccess=true;
      state.successMsg=`All Books Has Been Deleted Successfully`
    }),
    [deleteAllbooks.rejected]:((state,action)=>{
      state.isError=true;
      state.errorMsg=action.payload===false?`Error!! You Have To Select Books To Delete!`:`Error!! Failed To Delete Thees Books!`
    }),

    //get all books
    [Allbooks.fulfilled]:((state,action)=>{
      state.bookList=[...action.payload];
    }),
  },
});
export const{checkAll,checkoneBook,clearState,imgOrFileUpload}=booksSlice.actions
export default booksSlice.reducer;
