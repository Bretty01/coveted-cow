import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './frontend/App';
import reportWebVitals from './frontend/reportWebVitals';
import { StateProvider } from './frontend/StateProvider.js'
import reducer, { initialState } from './frontend/reducer.js'

ReactDOM.render(
  <React.StrictMode>
      <StateProvider initialState={initialState} reducer={reducer}>
          <App />
      </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
