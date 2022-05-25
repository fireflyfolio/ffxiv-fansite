import {
  CONTENT_STATUS_DRAFT,
  CONTENT_STATUS_PRIVATE,
  CONTENT_STATUS_PROTECTED,
  CONTENT_STATUS_SECRET,
  CONTENT_TYPE_ARTICLE,
  CONTENT_TYPE_AUDIO,
  CONTENT_TYPE_DATA,
  CONTENT_TYPE_PICTURE,
  CONTENT_TYPE_STATIC,
  CONTENT_TYPE_VIDEO
} from "../config/constants";

function getStatus (value) {
  switch (value) {
    case CONTENT_STATUS_DRAFT:
      return 'brouillon';
    case CONTENT_STATUS_PROTECTED:
      return 'protégé';
    case CONTENT_STATUS_PRIVATE:
      return 'privé';
    case CONTENT_STATUS_SECRET:
      return 'secret';
  }

  return 'public';
}

function getType (value) {
  switch (parseInt(value)) {
    case CONTENT_TYPE_STATIC:
      return 'static';
    case CONTENT_TYPE_ARTICLE:
      return 'article';
    case CONTENT_TYPE_PICTURE:
      return 'picture';
    case CONTENT_TYPE_DATA:
      return 'data';
    case CONTENT_TYPE_AUDIO:
      return 'audio';
    case CONTENT_TYPE_VIDEO:
      return 'video';
  }

  return '';
}

function getTypeLabel (value) {
  switch (parseInt(value)) {
    case CONTENT_TYPE_STATIC:
      return 'Statique';
    case CONTENT_TYPE_ARTICLE:
      return 'Article';
    case CONTENT_TYPE_PICTURE:
      return 'Image';
    case CONTENT_TYPE_DATA:
      return 'Collection';
    case CONTENT_TYPE_AUDIO:
      return 'Musique';
    case CONTENT_TYPE_VIDEO:
      return 'Vidéo';
  }

  return '';
}

export {
  getStatus,
  getTypeLabel,
  getType,
};
