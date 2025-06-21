// src/components/DisasterList.jsx
import React, { useEffect, useState } from 'react';

const DisasterList = () => {
  const [disasters, setDisasters] = useState([]);

  const loadDisasters = async () => {
    const res = await fetch('https://citymall-backend-rjs7.onrender.com');
    const data = await res.json();
    setDisasters(data);
  };

  useEffect(() => {
    loadDisasters();
  }, []);

  return (
    <div>
      <h2>All Disasters</h2>
      <ul>
        {disasters.map((d) => (
          <li key={d.id}>
            <strong>{d.title}</strong> — {d.description} <br />
            <small>{d.tags?.join(', ')}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisasterList;
