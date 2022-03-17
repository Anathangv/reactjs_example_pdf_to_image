import { useState, useRef} from 'react';
import './App.css';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [image, setImage] = useState<any | null>();
  const [pdf, setPdf] = useState();

  const myCanvasRef = useRef(null);

  function attachFile({ target }: any) {
    const file = target.files[0];
    setPdf(file);
  }

  function pageLoad() {
    if(myCanvasRef.current){
      const canvas = myCanvasRef.current as HTMLCanvasElement;
      const imageBase64 = canvas.toDataURL('image/png');
      setImage(imageBase64);

      //case necessary to convert image base64 to Blob
      var imageInBlob = DataURIToBlob(image);
      console.log('imageInBlob',imageInBlob);
    }
  }

  function DataURIToBlob(dataURI: any) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]
  
    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++){
      ia[i] = byteString.charCodeAt(i)
    }

    return new Blob([ia], { type: mimeString })
  }

  return (
    <div className="App">
      <input
        id="file-upload"
        type="file"
        onChange={(e) => attachFile(e)}
        accept=".pdf"
      />

      <div style={{ borderTop: '1px solid black' }}>
        <h2>Imagem</h2>
        <img
          id="image-generated"
          src={image}
          alt="pdfImage"
          style={{ width: 100, height: 100 }}
        />
      </div>

      <div style={{ borderTop: '1px solid black' }}>
        <h2>Pdf</h2>
        <div style={{ display: 'inline-block'}}>
          <Document
            file={pdf}
            renderMode={'canvas'}
          >
            <Page
              pageNumber={pageNumber}
              canvasRef={myCanvasRef}
              onRenderSuccess={pageLoad}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}

export default App;
