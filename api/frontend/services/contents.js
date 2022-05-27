const { Pool } = require('pg');

const config = require('../../config');

/* Contents SQL */
async function fetchAll (params) {
  const pool = new Pool(config.db);

  const sqlLimit = `LIMIT ${params.limit} OFFSET ${params.offset}`;

  // Sort
  let sqlSort = 'c.update_date';

  switch (params.sort) {
    case 'title': sqlSort = 'c.title';
  }

  const sqlOrder = `ORDER BY ${sqlSort} ${params.sort_dir}`;

  // Filter by criteria
  let whereType = params.is_editorial ? 'AND c.type = 0 ' : 'AND c.type <> 0 ';
  if (params.type > -1 && !params.is_editorial) whereType += `AND c.type = ${params.type}`;

  let whereFocus = '';
  if (params.is_focus)
    whereFocus = `AND c.is_focus = ${params.is_focus}`;

  let wherePin = '';
  if (params.is_pin)
    whereFocus = `AND c.is_pin = ${params.is_pin}`;

  let whereSearch = '';
  if (params.search)
    whereSearch = `AND c.title ILIKE '%${params.search}%'`;

  // Filter by tag
  let joinTag = '';
  let whereTag = '';

  if (params.tag > -1) {
    joinTag = 'LEFT JOIN public.contents_tags ct ON c.id = ct.content_id';
    whereTag = `AND ct.tag_id = ${params.tag}`;
  }

  // Add body
  let selectBody = '';
  if (params.is_editorial) selectBody = ', c.body';

  // Define clauses
  let sql = `SELECT c.id, c.title, c.status, c.type, c.update_date, c.cover, c.items->'folder' AS folder ${selectBody}
    FROM public.contents c ${joinTag}
    WHERE c.status IN (1, 2) ${whereType} ${whereFocus} ${wherePin} ${whereSearch} ${whereTag} ${sqlOrder} ${sqlLimit}`;

  let sqlCount = `SELECT COUNT(*) AS total FROM public.contents c ${joinTag}
    WHERE c.status IN (1, 2) ${whereType} ${whereFocus} ${wherePin} ${whereSearch} ${whereTag}`;

  try {
    const result = await pool.query(sql);
    const resultCount = await pool.query(sqlCount);

    return {
      ...resultCount.rows[0],
      rows: result.rows,
    };
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
      FROM public.contents WHERE status IN (1, 2) AND id = $1`;
    const values = [params.id];
    const result = await pool.query(sql, values);

    return result.rows[0];
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

async function countType (params, type) {
  const pool = new Pool(config.db);

  // Filter by criteria
  let whereType = 'AND c.type <> 0 ';
  if (type >= 0) whereType += `AND c.type = ${type}`;

  let whereSearch = '';
  if (params.search)
    whereSearch = `AND title ILIKE '%${params.search}%'`;

  // Filter by tag
  let joinTag = '';
  let whereTag = '';

  if (params.tag > -1) {
    joinTag = 'LEFT JOIN public.contents_tags ct ON c.id = ct.content_id';
    whereTag = `AND ct.tag_id = ${params.tag}`;
  }

  try {
    const sql = `SELECT COUNT(*) AS total FROM public.contents c ${joinTag}
      WHERE c.status IN (1,2) ${whereType} ${whereSearch} ${whereTag}`;
    const result = await pool.query(sql);

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
      WHERE c.status IN (1, 2) AND c.type <> 0 AND r.status = 1 AND r.content_id = $1
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

/* Tags SQL */
async function fetchTags (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `SELECT t.id, t.label, t.total
      FROM public.contents c
      INNER JOIN public.contents_tags ct ON c.id = ct.content_id
      INNER JOIN public.tags t ON t.id = ct.tag_id
      WHERE c.status IN (1,2) AND c.type <> 0 AND c.id = $1
      ORDER BY t.total DESC, t.label ASC`;
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
  fetchAll, fetch, countType,
  fetchRelations, fetchTags,
};
