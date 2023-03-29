import React from "react";
import { useParams } from "react-router-dom";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { Worker,Viewer } from "@react-pdf-viewer/core"
//import PDFViewer from 'pdf-viewer-reactjs'
const PdfViewer = () =>{
    const {url} = useParams();
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return(
    <div className="pdfviewer" style={{flexBasis:"100%"}}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
        <Viewer
         fileUrl={`https://onlinelibraryapi.onrender.com/pdf/${url}`}
         plugins={[defaultLayoutPluginInstance,]}
        />
        </Worker>
        
    </div>
  )
}
export default PdfViewer;
