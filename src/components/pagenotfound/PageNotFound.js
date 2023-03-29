import React from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import "./pagenotfound.css"
const PageNotFound = () =>{
    const history = useHistory()
    return(
        <div className="notfound">
            <div>
                <h3>Error 404 <FontAwesomeIcon icon={faExclamationTriangle} /></h3>
                <p>Page Not Found try to login!</p>
                <button onClick={()=>history.goBack()}>
                  go back
                </button>
            </div>
        </div>
    )
}
export default PageNotFound