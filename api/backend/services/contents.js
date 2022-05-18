const { Pool } = require('pg');

const config = require('../../config');
const { CONTENT_STATUS_DRAFT, CONTENT_TYPE_ARTICLE } = require('../../commons/constants');

/* Contents SQL */
async function fetchAll (params) {
  const pool = new Pool(config.db);

  const values = [];
  const limit = `LIMIT ${params.limit} OFFSET ${params.offset}`;

  // Sort
  let sort = 'creation_date';

  switch (params.sort) {
    case 'title': sort = 'title';
  }

  const order = `ORDER BY ${sort} ${params.sort_dir}`;

  // Filter by type
  let type = '';

  if (params.type) {
    type = `AND type = $1`;
    values.push(params.type);
  }

  // Define clauses
  let sql = `SELECT id, title, type FROM public.contents
    WHERE type <> 0 ${type} ${order} ${limit}`;

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
    const sql = `SELECT id, status, type, creation_date, update_date,
        title, summary, body, is_focus, is_pin, password, cover, items
      FROM public.contents WHERE id = $1`;
    const values = [params.id];
    const result = await pool.query(sql, values);

    return result.rows[0];
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

async function create () {
  const pool = new Pool(config.db);

  try {
    const sql = `INSERT INTO public.contents (status, type, title) VALUES ($1, $2, $3) RETURNING id`;
    const values = [CONTENT_STATUS_DRAFT, CONTENT_TYPE_ARTICLE, 'New title'];
    const result = await pool.query(sql, values);

    return result.rows[0];
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

async function update (data) {
  const pool = new Pool(config.db);

  const values = [
    data.id, data.status, data.type, data.title, data.summary,
    data.cover, data.is_focus, data.is_pin,
    data.body, data.items
  ];

  let password = '';

  if (data.password) {
    password = 'password = $11,';
    values.push(data.password);
  }

  try {
    const sql = `UPDATE public.contents SET
        status = $2, type = $3, title = $4, summary = $5,
        cover = $6, is_focus = $7, is_pin = $8,
        body = $9, items = $10, ${password}
        update_date = NOW()
      WHERE id = $1`;

    const result = await pool.query(sql, values);

    return { rowCount: result.rowCount };
  } catch (e) {
    console.error(e);
    throw new InternalError(dbMessage.DB_ERROR);
  } finally {
    pool.end();
  }
}

async function remove (data) {
  const pool = new Pool(config.db);

  try {
    const sql = `DELETE FROM public.contents WHERE id = $1`;
    const values = [data.id];
    const result = await pool.query(sql, values);

    return { rowCount: result.rowCount };
  } catch (e) {
    console.error(e)
    throw new InternalError(dbMessage.DB_ERROR);
  } finally {
    pool.end();
  }
}

/* Relations SQL */
async function fetchRelations (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `SELECT r.relation_id AS id, r.position, r.status, c.type, c.title
      FROM public.contents_relations r
      LEFT JOIN public.contents c ON c.id = r.relation_id
      WHERE r.content_id = $1
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

async function createRelations (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `INSERT INTO public.contents_relations (content_id, relation_id, position, status) VALUES ($1, $2, $3, $4)`;
    const values = [params.id, params.relation_id, params.position, params.status];
    const result = await pool.query(sql, values);

    return { rowCount: result.rowCount };
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

async function updateRelations (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `UPDATE public.contents_relations SET position = $3, status = $4 WHERE content_id = $1 AND relation_id = $2`;
    const values = [params.id, params.rid, params.position, params.status];
    const result = await pool.query(sql, values);

    return { rowCount: result.rowCount };
  } catch (e) {
    console.error(e);
    return { rowCount: 0 };
  } finally {
    await pool.end();
  }
}

async function removeRelations (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `DELETE FROM public.contents_relations WHERE content_id = $1 AND relation_id = $2`;
    const values = [params.id, params.rid];
    const result = await pool.query(sql, values);

    return { rowCount: result.rowCount };
  } catch (e) {
    console.error(e)
    throw new InternalError(dbMessage.DB_ERROR);
  } finally {
    pool.end();
  }
}

async function removeRelationsByContent (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `DELETE FROM public.contents_relations WHERE content_id = $1 OR relation_id = $1`;
    const values = [params.id];
    const result = await pool.query(sql, values);

    return { rowCount: result.rowCount };
  } catch (e) {
    console.error(e)
    throw new InternalError(dbMessage.DB_ERROR);
  } finally {
    pool.end();
  }
}

/* Tags SQL */
async function fetchTags (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `SELECT t.id, t.label, t.total
      FROM public.contents_tags c
      LEFT JOIN public.tags t ON t.id = c.tag_id
      WHERE c.content_id = $1
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

async function createTags (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `INSERT INTO public.tags (label, total) VALUES ($1, 1) RETURNING id`;
    const values = [params.label];
    const result = await pool.query(sql, values);

    return result.rows[0];
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

async function updateTags (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `UPDATE public.tags SET label = $2, total = $3 WHERE id = $1`;
    const values = [params.tid, params.label, params.total];
    const result = await pool.query(sql, values);

    return { rowCount: result.rowCount };
  } catch (e) {
    console.error(e);
    return { rowCount: 0 };
  } finally {
    await pool.end();
  }
}

async function removeTags (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `DELETE FROM public.tags WHERE id = $1`;
    const values = [params.tid];
    const result = await pool.query(sql, values);

    return { rowCount: result.rowCount };
  } catch (e) {
    console.error(e)
    throw new InternalError(dbMessage.DB_ERROR);
  } finally {
    pool.end();
  }
}

async function fetchTagById (id) {
  const pool = new Pool(config.db);

  try {
    const sql = `SELECT * FROM public.tags WHERE id = $1`;
    const values = [id];
    const result = await pool.query(sql, values);

    return result.rows[0];
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

async function fetchTagByLabel (label) {
  const pool = new Pool(config.db);

  try {
    const sql = `SELECT * FROM public.tags WHERE label LIKE $1`;
    const values = [label];
    const result = await pool.query(sql, values);

    return result.rows[0];
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

async function fetchTagByContent (id, tid) {
  const pool = new Pool(config.db);

  try {
    const sql = `SELECT * FROM public.contents_tags WHERE content_id = $1 AND tag_id = $2`;
    const values = [id, tid];
    const result = await pool.query(sql, values);

    return result.rows[0];
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

async function createTagByContent (id, tid) {
  const pool = new Pool(config.db);

  try {
    const sql = `INSERT INTO public.contents_tags (content_id, tag_id) VALUES ($1, $2) RETURNING tag_id`;
    const values = [id, tid];
    const result = await pool.query(sql, values);

    return result.rows[0];
  } catch (e) {
    console.error(e);
    return { rowCount: 0 };
  } finally {
    await pool.end();
  }
}

async function removeTagFromContent (id, tid) {
  const pool = new Pool(config.db);

  try {
    const sql = `DELETE FROM public.contents_tags WHERE content_id = $1 AND tag_id = $2`;
    const values = [id, tid];
    const result = await pool.query(sql, values);

    return { rowCount: result.rowCount };
  } catch (e) {
    console.error(e)
    throw new InternalError(dbMessage.DB_ERROR);
  } finally {
    pool.end();
  }
}

async function removeTagsFromContent (params) {
  const pool = new Pool(config.db);

  try {
    const sql = `DELETE FROM public.contents_tags WHERE content_id = $1`;
    const values = [params.id];
    const result = await pool.query(sql, values);

    return { rowCount: result.rowCount };
  } catch (e) {
    console.error(e)
    throw new InternalError(dbMessage.DB_ERROR);
  } finally {
    pool.end();
  }
}

module.exports = {
  fetchAll, fetch, create, update, remove,
  fetchRelations, createRelations, updateRelations, removeRelations, removeRelationsByContent,
  fetchTags, createTags, updateTags, removeTags,
  fetchTagById, fetchTagByLabel, fetchTagByContent, createTagByContent, removeTagFromContent, removeTagsFromContent,
};
