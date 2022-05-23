const { Pool } = require('pg');

const config = require('../../config');

/* Contents SQL */
async function fetchAll (params) {
  const pool = new Pool(config.db);

  const values = [];
  const limit = `LIMIT ${params.limit} OFFSET ${params.offset}`;

  // Sort
  let sort = 'update_date';

  switch (params.sort) {
    case 'title': sort = 'title';
  }

  const order = `ORDER BY ${sort} ${params.sort_dir}`;

  // Filter by criteria
  let type = '';
  if (params.type) type = `AND type = ${params.type}`;

  let focus = '';
  if (params.is_focus)
    focus = `AND is_focus = ${params.is_focus}`;

  let pin = '';
  if (params.is_pin)
    focus = `AND is_pin = ${params.is_pin}`;

  // Define clauses
  let sql = `SELECT id, title, status, type, update_date FROM public.contents
    WHERE status IN (1, 2) AND type <> 0 ${type} ${focus} ${pin} ${order} ${limit}`;

  try {
    const result = await pool.query(sql, values);
    return result.rows;
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

async function fetch (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `SELECT id, title, summary, body, items, cover
      FROM public.contents WHERE status = 1 AND id = $1`;
    const values = [params.id];
    const result = await pool.query(sql, values);

    return result.rows[0];
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

/* Relations SQL */
async function fetchRelations (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `SELECT r.relation_id AS id, c.type, c.title
      FROM public.contents_relations r
      LEFT JOIN public.contents c ON c.id = r.relation_id
      WHERE r.status = 1 AND r.content_id = $1
      ORDER BY r.position ASC`;
    const values = [params.id];
    const result = await pool.query(sql, values);

    return result.rows;
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

module.exports = {
  fetchAll,
  fetch,
  fetchRelations,
};
