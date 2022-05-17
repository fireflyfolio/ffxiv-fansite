import Backbone from 'backbone';

import HomePage from './views/pages/home/index';
import ArchivePage from './views/pages/archive/index';
import ArticlePage from './views/pages/article/index';
import AudioPage from './views/pages/audio/index';
import DataPage from './views/pages/data/index';
import PicturePage from './views/pages/picture/index';
import VideoPage from './views/pages/video/index';

export default Backbone.Router.extend({
  routes: {
    '': 'home',
    'archive': 'archive',
    'article/:id': 'article',
    'audio/:id': 'audio',
    'data/:id': 'data',
    'picture/:id': 'picture',
    'video/:id': 'video',
  },

  views: {},

  getInstance: function () {
    return this;
  },

  archive: function () {
    this._getViewInstance('archive', ArchivePage);
  },

  article: function (id) {
    this._getViewInstance('article', ArticlePage, { id: id ?? 1 });
  },

  audio: function (id) {
    this._getViewInstance('audio', AudioPage, { id: id ?? 4 });
  },

  data: function (id) {
    this._getViewInstance('data', DataPage, { id: id ?? 5 });
  },

  home: function () {
    this._getViewInstance('home', HomePage);
  },

  picture: function (id) {
    this._getViewInstance('picture', PicturePage, { id: id ?? 2 });
  },

  video: function (id) {
    this._getViewInstance('video', VideoPage, { id: id ?? 3 });
  },

  _getViewInstance: function (key, View, options = {}) {
    if (!this.views[key]) this.views[key] = new View({ el: 'main' });
    this.views[key].render(options);

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  },
});
