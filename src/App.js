import logo from './gcfLogo.png';
import './App.css';

import React from 'react';
import { useState,useEffect } from 'react';

import { Configuration, OpenAIApi } from 'openai';



import Formulario from './components/Formulario';
import Respuesta from './components/Respuesta';




function App() {

  const [pregunta, setPregunta] = useState('');

  const configuration = new Configuration({
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);
  const [storedValues, setStoredValues] = useState([]);



  const formSearch = (e) => {
    e.preventDefault();
  }


    const generarRespuesta = async (newQuestion, setNewQuestion) => {
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
          prompt: newQuestion,
      };
      const response = await openai.createCompletion(completeOptions);
      if (response.data.choices) {
        setStoredValues([
            {
                question: newQuestion,
                answer: response.data.choices[0].text,
            },
            ...storedValues,
        ]);
        setNewQuestion('');
    }
  };
  

  return (
    <div className="app bg-red-700 font-MyFontF">
         <section id='home' className='font-sans text-center mt-4 flex flex-col justify-center '>
      
      <div className="  mx-auto rounded-full w-15 h-15 relative overflow-hidden md:h-96 md:w-96 mb-2">
          <img className="mx-auto" src={logo} layout="fill" objectFit="cover" />
      </div>
    
      <h3 className='text-2xl md:text-2xl font-myFontF'>Lo se casi todo sobre el Granada CF ...</h3>
      <form onSubmit={formSearch}>
    <label for="chat" class="sr-only">Preguntame lo que quieras ...</label>
    <div class="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 m-5 ">
      
        <textarea value={pregunta} onChange={ (e) => setPregunta(e.target.value)} id="chat" rows="1" class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Preguntame lo que quieras ..."></textarea>
            <button type="submit" onClick={() => generarRespuesta(pregunta, setPregunta)} class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
            <svg aria-hidden="true" class="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            <span class="sr-only">Enviar</span>
            {storedValues.map((value, index) => {
                    return (
                        <div className="answer-section" key={index}>
                            <p className="question">{value.question}</p>
                            <p className="answer">{value.answer}</p>
                            <div className="copy-icon">
                                <i className="fa-solid fa-copy"></i>
                            </div>
                        </div>
                    );
                })}
        </button>
    </div>
</form>
      
      
  </section>
    </div>
  );
}

export default App;
