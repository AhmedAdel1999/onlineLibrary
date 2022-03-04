import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/utils/baseUrl';
const initialState = {
  token:null,
  userId:"",
  isError:false,
  isSuccess:false,
  isLoading:false,
  errorMsg:"",
  successMsg:"",
  userInfo:{},
  Library:[],
  status: 'idle',
};

export const joinUser = createAsyncThunk(
  "user/joinUser",
  async(values,{fulfillWithValue,rejectWithValue})=>{
     try {
      let response = await axiosInstance.post("/user/register",values)
      return fulfillWithValue( await response.data)
     } catch (error) {
       return rejectWithValue(error.response)
     }
  }
)

export const login = createAsyncThunk(
  "user/login",
  async(values,{fulfillWithValue,rejectWithValue})=>{
     try {
      let response = await axiosInstance.post("/user/login",values)
      return fulfillWithValue( await response.data)
     } catch (error) {
       return rejectWithValue(error.response)
     }
  }
)

export const UpdateAccount =createAsyncThunk(
  "user/UpdateAccount",
  async({id,info},{rejectWithValue,fulfillWithValue})=>{
    try {
      let response = await axiosInstance.put(`/user/edituser/${id}`,{...info})
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)

export const DeleteAcount =createAsyncThunk(
  "user/DeleteAcount",
  async(id,{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.delete(`/user/delete/${id}`)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const UserData =createAsyncThunk(
  "user/UserData",
  async(id,{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.get(`/user/${id}`)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const AddToLibrary =createAsyncThunk(
  "user/AddToLibrary",
  async({id,bookdata},{rejectWithValue,fulfillWithValue})=>{
    try {
      let response = await axiosInstance.post(`/user/addtolibrary/${id}`,bookdata)
     console.log(response)
      return fulfillWithValue(await response.data.booklibrary)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const UpdateLibrary =createAsyncThunk(
  "user/UpdateLibrary",
  async({id,bookdata},{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.put(`/user/updatelibrary/${id}`,bookdata)
      return fulfillWithValue(await response.data.booklibrary)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const DeleteOne =createAsyncThunk(
  "user/DeleteOne",
  async({id,bookdata},{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await axiosInstance.put(`/user/deletefromlibrary/${id}`,bookdata)
      return fulfillWithValue(await response.data.booklibrary)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout:((state)=>{
      state.token=null;
      state.userInfo={}
      state.Library=[]
      state.userId=""
    }),
    imgUpload:((state)=>{
      state.isLoading=true
    }),
    clearState:((state)=>{
      state.isError=false;
      state.isSuccess=false;
      state.errorMsg="";
      state.successMsg=""
    })
  },
  extraReducers:{
    //register user
    [joinUser.pending]:((state)=>{
      state.isLoading=true;
    }),
    [joinUser.fulfilled]:((state)=>{
      state.isSuccess=true;
      state.isLoading=false;
    }),
    [joinUser.rejected]:((state,action)=>{
      state.isError=true;
      state.isLoading=false;
      state.errorMsg=`${action.payload.data.msg}`
    }),

    //login user
    [login.pending]:((state,action)=>{
      state.isLoading=true;
    }),
    [login.fulfilled]:((state,action)=>{
      state.isSuccess=true;
      state.isLoading=false;
      state.userId=action.payload.id;
      state.token=action.payload.token;
    }),
    [login.rejected]:((state,action)=>{
      state.isError=true;
      state.isLoading=false;
      state.errorMsg=`${action.payload.data.msg}`
    }),

    //update account
    [UpdateAccount.pending]:((state)=>{
      state.isLoading=true;
    }),
    [UpdateAccount.fulfilled]:((state)=>{
      state.isSuccess=true;
      state.isLoading=false;
    }),
    [UpdateAccount.rejected]:((state,action)=>{
      state.isError=true;
      state.isLoading=false;
      state.errorMsg=`${action.payload.data.msg}`
    }),

    //delete your account
    [DeleteAcount.fulfilled]:((state)=>{
      state.Library=[];
      state.userInfo={}
    }),

    //get user data
    [UserData.fulfilled]:((state,action)=>{
      state.userInfo={...action.payload};
      state.Library=[...action.payload.booklibrary]
    }),

    //Add book to library
    [AddToLibrary.fulfilled]:((state,action)=>{
      state.userInfo={...state.userInfo,booklibrary:[...action.payload]}
      state.Library=[...action.payload]
      state.isSuccess=true;
      state.successMsg=`Book Has Been Added To Library!`
    }),
    [AddToLibrary.rejected]:((state)=>{
      state.isError=true;
      state.errorMsg=`Error!! Failed To Add Book To Library!`
    }),

    //update the library
    [UpdateLibrary.fulfilled]:((state,action)=>{
      state.Library=[...action.payload];
      state.userInfo={...state.userInfo,booklibrary:[...action.payload]}
    }),

    //delete item from library
    [DeleteOne.fulfilled]:((state,action)=>{
      state.Library=[...action.payload];
      state.userInfo={...state.userInfo,booklibrary:[...action.payload]}
    }),
    
  },
});

export const {logout,clearState,imgUpload} = userSlice.actions
export default userSlice.reducer;
