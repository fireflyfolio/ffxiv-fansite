
import Backbone from 'backbone';
import _ from 'underscore';

import {
  CONTENT_TYPE_ARTICLE,
  CONTENT_TYPE_DATA,
  CONTENT_TYPE_PICTURE,
  CONTENT_TYPE_AUDIO,
  CONTENT_TYPE_VIDEO
} from './config/constants';

import SessionModel from './models/session';

import HomePage from './views/pages/home';
import SigninPage from './views/pages/signin';
import ArchivePage from './views/pages/archive';
import ArticlePage from './views/pages/article';
import AudioPage from './views/pages/audio';
import DataPage from './views/pages/data';
import PicturePage from './views/pages/picture';
import VideoPage from './views/pages/video';

import NavView from './views/commons/nav';
import MoreView from './views/commons/more';
import AdminView from './views/admin/index';

export default Backbone.Router.extend({
  routes: {
    '': 'home',
    'signin': 'signin',
    'archive': 'archive',
    'static/:id': 'article',
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
    this.views.nav = new NavView();
    this.views.more = new MoreView();
    this.views.admin = new AdminView();

    this.dispatcher.on('admin:show:toggle');
    this.dispatcher.on('content:update', (content) => content);
    this.dispatcher.on('content:element:edit', (id) => id);
    this.dispatcher.on('content:element:edit:cancel');
    this.dispatcher.on('content:element:update', (content) => content);
    this.dispatcher.on('content:metadata:delete', (content) => content);
    this.dispatcher.on('content:relation:update', (options) => options);
    this.dispatcher.on('content:tag:update', (options) => options);
    this.dispatcher.on('content:file:delete', (id) => id);
    this.dispatcher.on('content:editor:update', (body) => body);

    this.listenTo(this.dispatcher, 'content:update', (content) => {
      const id = content.get('id');

      switch (content.get('type')) {
        case CONTENT_TYPE_ARTICLE:
          this.article(id);
          break;
        case CONTENT_TYPE_DATA:
          this.data(id);
          break;
        case CONTENT_TYPE_PICTURE:
          this.picture(id);
          break;
        case CONTENT_TYPE_AUDIO:
          this.audio(id);
          break;
        case CONTENT_TYPE_VIDEO:
          this.video(id);
          break;
      }
    });
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
    this._getViewInstance('article', ArticlePage, { id: id });
  },

  audio: function (id) {
    this._getViewInstance('audio', AudioPage, { id: id });
  },

  data: function (id) {
    this._getViewInstance('data', DataPage, { id: id });
  },

  home: function () {
    this._getViewInstance('home', HomePage);
  },

  picture: function (id) {
    this._getViewInstance('picture', PicturePage, { id: id });
  },

  video: function (id) {
    this._getViewInstance('video', VideoPage, { id: id });
  },

  _getViewInstance: function (key, View, options = {}) {
    if (!this.views[key]) this.views[key] = new View({ el: 'main' });
    this.views[key].render(options);

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  },
});
