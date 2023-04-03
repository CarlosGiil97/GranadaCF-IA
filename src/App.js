import logo from './gr.png';
import logo1 from './loscarmenes.png';
import './App.css';

import React from 'react';
import { useState,useEffect } from 'react';

import { Configuration, OpenAIApi } from 'openai';

import Formulario from './components/Formulario';
import Respuesta from './components/Respuesta';

//PARA LAS NOTIFICACIONES
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {

  const [pregunta, setPregunta] = useState('');

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  const openai = new OpenAIApi(configuration);
  const [storedValues, setStoredValues] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);


  const notify = () => toast.error('Esta pregunta no está relacionada con el Granada CF , lo siento 😕', {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    });

    const notifyQuota = () => toast.error('Lo siento se ha superado la quota de peticiones gratuita de Open AI 🥴🥴', {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });;


    const generarRespuesta = async () => {

      //PARCHE AL EXCEDER LA QUITA DE OPENAI
      notifyQuota();
      setShowSpinner(false)
      return;

      setShowSpinner(true)
      setStoredValues([]) //limpio siempre la respuesta anterior
      //compruebo que siempre en la pregunta contenga la palabra granada
      let minus = pregunta.toLowerCase();
      if(!minus.includes('granada')){
        notify();
        setShowSpinner(false)
        return;
      }
      

      let options = {
          model: 'text-davinci-003',
          temperature: 0,
          max_tokens: 100,
          top_p: 1,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          stop: ['/'],
      };

      let completeOptions = {
          ...options,
          prompt: pregunta,
      };

      const response = await openai.createCompletion(completeOptions);

      if (response.data.choices) {
        setStoredValues([
            {
                question: pregunta,
                answer: response.data.choices[0].text,
            },
            
        ]);
        setShowSpinner(false)
    }
  };
  
  

  return (
    <>

<nav class="flex items-center justify-between flex-wrap bg-red-800 p-6 font-myFontF">
  <div class="flex items-center flex-shrink-0 text-white mr-6">
  <div className="flex items-center justify-center w-16 h-16 border-2 border-red-500 rounded-full bg-white">
      <img className="rounded-full w-12 h-12" src={logo} alt="Avatar" />
    </div>    
  <span class="font-semibold text-xl tracking-tight ml-1">Granada CF IA 💻</span>
  </div>

  
</nav>

<div className="flex flex-col justify-center items-center">
  <img src={logo1} alt="Imagen" className="mt-2" />
  
    <div className="flex justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 m-5 ">
      
        <textarea  value={pregunta} onChange={ (e) => setPregunta(e.target.value)} id="chat" rows="1" className="border-gray-300 block mx-4 p-2.5  text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Preguntame lo que quieras ..."></textarea>
            <button type="submit" onClick={() => generarRespuesta()} className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
            <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            <span className="sr-only">Enviar</span>
        </button>

      
    </div>
    {showSpinner == true ? 
      <>
        <div className="flex justify-between justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
            
            </div>
        </div>
      </> : ''}


      {storedValues.map((value, index) => {
                    return (
                        <div className="answer-section" key={index}>
                           
                            <p className="answer">{value.answer}</p>
                            <div className="copy-icon">
                                <i className="fa-solid fa-copy"></i>
                            </div>
                        </div>
                    );
                })}
   
   
    <ToastContainer position="top-center" autoClose={1500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"
/>

  </div>


{/* <div className="flex flex-row font-myFontF">
  <div className="w-1/2 sm:w-2/2 flex items-center justify-center">
    <img className="rounded-full mt-3" src={logo1} alt="Los Carmenes" />
  </div>
  <div className="w-1/2 sm:w-2/2 items-center justify-center">
  <label for="chat" className="sr-only">Preguntame lo que quieras ...</label>
    <div className="flex justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 m-5 ">
      
        <textarea  value={pregunta} onChange={ (e) => setPregunta(e.target.value)} id="chat" rows="1" className="border-gray-300 block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Preguntame lo que quieras ..."></textarea>
            <button type="submit" onClick={() => generarRespuesta()} className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
            <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            <span className="sr-only">Enviar</span>
        </button>

      
    </div>
    {showSpinner == true ? 
      <>
        <div className="flex justify-between justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
            
            </div>
        </div>
      </> : ''}


      {storedValues.map((value, index) => {
                    return (
                        <div className="answer-section" key={index}>
                           
                            <p className="answer">{value.answer}</p>
                            <div className="copy-icon">
                                <i className="fa-solid fa-copy"></i>
                            </div>
                        </div>
                    );
                })}
   
   
    <ToastContainer position="top-center" autoClose={1500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"
/>

  </div>
</div> */}

      {/* <nav className="flex justify-between flex-wrap bg-red-900 p-6">
  <div className="flex justify-between flex-shrink-0 mr-6">
    <center>
    <div className="flex justify-between justify-center w-16 h-16 border-2 border-red-500 rounded-full bg-white">
      <img className="rounded-full w-12 h-12" src={logo} alt="Avatar" />
    </div>
    </center>
    
  </div>
  <div className="w-full block flex-grow lg:flex lg:justify-between lg:w-auto">
    <div className="text-sm lg:flex-grow">
      <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
        Link 1
      </a>
      <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
        Link 2
      </a>
    </div>
    <div>
      <a href="#" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-red-900 hover:bg-white mt-4 lg:mt-0">
        Button
      </a>
    </div>
  </div>
</nav> */}
    </>

    
  );
//     <div className="min-h-screen bg-red-700 font-MyFontF flex flex-col justify-center justify-between">
//       <div className="flex flex-col justify-center justify-between">

      
//       <div className="  mt-3 mx-auto rounded-full w-15 h-15 relative  overflow-hidden md:h-96 md:w-96 mb-2">
//           <img className="mx-auto" src={logo} layout="fill" objectFit="cover" />
//       </div>
    
//       <h3 className='text-4xl md:text-2xl font-myFontF text-white '>Lo se casi todo sobre el Granada CF ...</h3>
      

  
//     </div>
//     </div>
  //);
}

export default App;
