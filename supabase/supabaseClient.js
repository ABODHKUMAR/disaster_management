const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection by fetching from a table (replace 'your_table' with an actual table name)
async function testConnection() {
  try {
    const { data, error } = await supabase.from('your_table').select().limit(1);
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