import { useSelector } from "react-redux"
const Authuser = () =>{
    const userInfo = useSelector((state)=>state.user.userInfo)
    return userInfo.role===1?true:false
}
export default Authuser