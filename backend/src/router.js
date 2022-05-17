
import Backbone from 'backbone';
import _ from 'underscore';

import SessionModel from './models/session';

import HomePage from './views/pages/home';
import SigninPage from './views/pages/signin';
import ArchivePage from './views/pages/archive';
import ArticlePage from './views/pages/article';
import AudioPage from './views/pages/audio';
import DataPage from './views/pages/data';
import PicturePage from './views/pages/picture';
import VideoPage from './views/pages/video';

export default Backbone.Router.extend({
  routes: {
    '': 'home',
    'signin': 'signin',
    'archive': 'archive',
    'article/:id': 'article',
    'audio/:id': 'audio',
    'data/:id': 'data',
    'picture/:id': 'picture',
    'video/:id': 'video',
  },

  views: {},
  session: new SessionModel(),
  dispatcher: _.clone(Backbone.Events),

  getInstance: function () {
    return this;
  },

  initialize: function () {
    this.dispatcher.on('content:element:edit', (id) => id);
    this.dispatcher.on('content:element:edit:cancel');
    this.dispatcher.on('content:element:update', (items) => items);
    this.dispatcher.on('content:metadata:delete');
    this.dispatcher.on('content:editor:update');
  },

  execute: function (callback, args, name) {
    if (!this.session.get('signedIn')) {
      this.signin();
      return false;
    }

    if (callback) callback.apply(this, args);
  },

  signin: function () {
    this.navigate('/signin');
    this._getViewInstance('signin', SigninPage);
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
