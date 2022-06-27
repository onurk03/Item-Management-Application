import './App.css';
import Items from './items.js';
import React from "react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Item Manager</h1>
      </header>
      <main>
          <Items />
      </main>
    </div>
  );
}

export default App;
