import React from 'react';
import './App.css';

import AutocompleteInput from './components/AutocompleteInput';
import logo from './images/logo.png';

function App() {
  return (
    <div className="app">
      <img className="app__logo" src={logo} alt="Logo" />
      <AutocompleteInput />
    </div>
  );
}

export default App;
