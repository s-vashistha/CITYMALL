const { supabase } = require('../supabaseClient');
const axios = require('axios');

// POST /disasters
const createDisaster = async (req, res) => {
  const { title, location_name, description, tags, owner_id } = req.body;

  const { data, error } = await supabase.from('disasters').insert([{
    title,
    location_name,
    description,
    tags,
    owner_id,
    created_at: new Date().toISOString(),
    audit_trail: [{
      action: 'create',
      user_id: owner_id,
      timestamp: new Date().toISOString()
    }]
  }]);

  if (error) return res.status(400).json({ error });

  req.app.get('io').emit('disaster_updated', data);
  res.json(data);
};

// GET /disasters
const getDisasters = async (req, res) => {
  const tag = req.query.tag;
  let query = supabase.from('disasters').select('*');
  if (tag) query = query.contains('tags', [tag]);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error });

  res.json(data);
};

// PUT /disasters/:id
const updateDisaster = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('disasters')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error });

  req.app.get('io').emit('disaster_updated', data);
  res.json(data);
};

// DELETE /disasters/:id
const deleteDisaster = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('disasters')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error });

  req.app.get('io').emit('disaster_updated', { id, deleted: true });
  res.json({ success: true });
};

// GET /:id/resources?lat=...&lon=...
const getResourcesNearby = async (req, res) => {
  const { lat, lon } = req.query;
  const radius = 10000; // meters

  const { data, error } = await supabase.rpc('find_nearby_resources', {
    lat: parseFloat(lat),
    lon: parseFloat(lon),
    radius
  });

  if (error) return res.status(500).json({ error });

  req.app.get('io').emit('resources_updated', data);
  res.json(data);
};

// GET /:id/social-media
const getSocialMedia = async (req, res) => {
  const mockPosts = [
    { user: 'citizen1', post: '#flood Need food in East Delhi' },
    { user: 'helper2', post: 'Rescue underway in Andheri West #MumbaiFloods' }
  ];

  req.app.get('io').emit('social_media_updated', mockPosts);
  res.json(mockPosts);
};

// POST /geocode
const geocodeLocation = async (req, res) => {
  const { description } = req.body;

  // Mock Gemini call (replace with actual if needed)
  const location_name = "Manhattan, NYC"; // You could call Gemini here

  try {
    const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location_name,
        format: 'json'
      }
    });

    if (!geoRes.data || geoRes.data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const { lat, lon } = geoRes.data[0];
    res.json({ location_name, lat, lon });

  } catch (err) {
    res.status(500).json({ error: 'Failed to geocode location' });
  }
};

// POST /disasters/:id/verify-image
const verifyImage = async (req, res) => {
  const { image_url } = req.body;

  // Step 1: Check Supabase cache
  const cacheKey = `verify:${image_url}`;
  const now = new Date().toISOString();

  const { data: cached, error: cacheError } = await supabase
    .from('cache')
    .select('*')
    .eq('key', cacheKey)
    .lt('expires_at', new Date(Date.now() + 3600000).toISOString())
    .single();

  if (cached) return res.json({ verification: cached.value });

  // Step 2: Call Gemini (mocked for now)
  const verification = {
    status: 'likely authentic',
    notes: 'Image shows flooding consistent with known locations'
  };

  // Step 3: Store in cache
  await supabase.from('cache').insert([{
    key: cacheKey,
    value: verification,
    expires_at: new Date(Date.now() + 3600000).toISOString()
  }]);

  res.json({ verification });
};


module.exports = {
  createDisaster,
  getDisasters,
  updateDisaster,
  deleteDisaster,
  getResourcesNearby,
  getSocialMedia,
  geocodeLocation,
  verifyImage
};
