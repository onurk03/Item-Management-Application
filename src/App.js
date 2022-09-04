import './App.css';
import MainPage from './components/mainPage.js';
import React from "react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Item Manager</h1>
      </header>
      <main>
          <MainPage />
      </main>
    </div>
  );
}

export default App;
