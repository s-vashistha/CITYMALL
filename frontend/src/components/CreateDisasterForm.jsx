// src/components/CreateDisasterForm.jsx
import React, { useState } from 'react';

const CreateDisasterForm = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://disaster-response-backend-uk7i.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        location_name: locationName,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
        owner_id: 'netrunnerX',
      }),
    });

    const data = await response.json();
    console.log('Created:', data);
    onCreated();
    setTitle('');
    setLocationName('');
    setDescription('');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Disaster</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br />
      <input placeholder="Location Name" value={locationName} onChange={(e) => setLocationName(e.target.value)} /><br />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br />
      <input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} /><br />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateDisasterForm;
