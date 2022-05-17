const fs = require('fs').promises;

async function exists (file) {
  try {
    await fs.access(file);
  } catch (e) {
    return false;
  }

  return true;
}

module.exports = {
  exists,
}
