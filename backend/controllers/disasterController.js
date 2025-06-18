const { supabase } = require("../supabase/supabaseClient");
const { emitDisasterUpdate } = require("../utils/websocket");

exports.createDisaster = async (req, res) => {
  try {
    const { title, location_name, description, tags, owner_id } = req.body;
    const { data, error } = await supabase
      .from("disasters")
      .insert({ title, location_name, description, tags, owner_id })
      .select();

    if (error) throw error;

    emitDisasterUpdate("created", data[0]);
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDisasters = async (req, res) => {
  try {
    const { tag } = req.query;
    let query = supabase.from("disasters").select("*");
    if (tag) query = query.contains("tags", [tag]);

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDisaster = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("disasters")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;

    emitDisasterUpdate("updated", data[0]);
    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDisaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("disasters")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;

    emitDisasterUpdate("deleted", data[0]);
    res.status(200).json({ message: "Disaster deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
