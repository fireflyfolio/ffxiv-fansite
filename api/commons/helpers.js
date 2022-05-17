const {
  CONTENT_TYPE_ARTICLE,
  CONTENT_TYPE_DATA,
  CONTENT_TYPE_PICTURE,
  CONTENT_TYPE_AUDIO,
  CONTENT_TYPE_VIDEO } = require('../commons/constants');

function getType (type) {
  switch (type) {
    case CONTENT_TYPE_ARTICLE: return 'article';
    case CONTENT_TYPE_DATA: return 'data';
    case CONTENT_TYPE_PICTURE: return 'picture';
    case CONTENT_TYPE_AUDIO: return 'audio';
    case CONTENT_TYPE_VIDEO: return 'video';
    default: return 'static';
  }
}

module.exports = {
  getType
}
