const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);


async function testConnection() {
  try {
    const { data, error } = await supabase.from('disasters').select().limit(1);
    if (error) {
      console.log('Supabase connection failed:', error.message);
    } else {
      console.log('Supabase connected successfully!');
    }
  } catch (err) {
    console.log('Supabase connection error:', err.message);
  }
}


if (require.main === module) {
  testConnection();
}

module.exports = { supabase };