const { Pool } = require('pg');

const config = require('../../config');

async function fetch (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `SELECT id, settings FROM admin.users WHERE username = $1 AND password = $2`;
    const values = [params.username, params.password];
    const result = await pool.query(sql, values);

    return result.rows[0];
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

async function fetchById (id) {
  const pool = new Pool(config.db);

  try {
    const sql = `SELECT id, settings FROM admin.users WHERE id = $1`;
    const values = [id];
    const result = await pool.query(sql, values);

    return result.rows[0];
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

module.exports = {
  fetch, fetchById,
};
