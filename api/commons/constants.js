module.exports = {
  CONTENT_STATUS_DRAFT: 0,
  CONTENT_STATUS_PUBLISH: 1,
  CONTENT_STATUS_PROTECTED: 2, // published and required a password but only title is shown
  CONTENT_STATUS_PRIVATE: 3, // published, required a password and nothing is shown

  CONTENT_TYPE_STATIC: 0,
  CONTENT_TYPE_ARTICLE: 1,
  CONTENT_TYPE_DATA: 2,
  CONTENT_TYPE_PICTURE: 3,
  CONTENT_TYPE_AUDIO: 4,
  CONTENT_TYPE_VIDEO: 5,

  TAG_TYPE_CATEGORY: 0,
  TAG_TYPE_CONTENT: 1,

  RES_STATUS_OK: 'OK',
  RES_STATUS_KO: 'KO',
  RES_MESSAGE_SUCCESS: 'Success',
}
