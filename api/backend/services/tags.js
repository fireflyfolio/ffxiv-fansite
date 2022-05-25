const { Pool } = require('pg');

const config = require('../../config');

async function fetchAll () {
  const pool = new Pool(config.db);

  try {
    const result = await pool.query('SELECT id, label, total FROM public.tags');

    return result.rows;
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

module.exports = {
  fetchAll,
};
