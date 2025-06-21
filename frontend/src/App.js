// src/App.js
import React, { useState } from 'react';
import CreateDisasterForm from './components/CreateDisasterForm';
import DisasterList from './components/DisasterList';

function App() {
  const [reload, setReload] = useState(false);

  const triggerReload = () => setReload(!reload);

  return (
    <div style={{ padding: 20 }}>
      <CreateDisasterForm onCreated={triggerReload} />
      <DisasterList key={reload} />
    </div>
  );
}

export default App;
