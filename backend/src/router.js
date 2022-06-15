
import Backbone from 'backbone';
import Cookies from 'js-cookie';
import _ from 'underscore';

import {
  CONTENT_TYPE_ARTICLE,
  CONTENT_TYPE_DATA,
  CONTENT_TYPE_PICTURE,
  CONTENT_TYPE_AUDIO,
  CONTENT_TYPE_VIDEO
} from './config/constants';

import SessionModel from './models/session';
import StateModel from './models/state';

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
import TagView from './views/commons/tag';
import AdminView from './views/admin/index';

import Config from './config';
import { refreshTokens } from './utils/auth';

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
  state: new StateModel(),
  dispatcher: _.clone(Backbone.Events),

  getInstance: function () {
    return this;
  },

  preinitialize: function () {
    this.session.set({
      signedIn: Cookies.get('session.signedIn') ?? false,
      accessToken: Cookies.get('session.accessToken') ?? null,
      refreshToken: Cookies.get('session.refreshToken') ?? null,
      maintainSession: Cookies.get('session.maintainSession') ?? false,
    });

    if (this.session.get('maintainSession') === 'true') {
      clearTimeout(this.session.get('sessionTimeout'));
      this.session.set({ sessionTimeout: setTimeout(() => refreshTokens(), Config.session.timeout) });
    }
  },

  initialize: function () {
    this.views.nav = new NavView();
    this.views.more = new MoreView();
    this.views.tag = new TagView();
    this.views.admin = new AdminView();

    this.dispatcher.on('admin:show:toggle', (id) => id);
    this.dispatcher.on('contents:privacy');
    this.dispatcher.on('content:update', (content) => content);
    this.dispatcher.on('content:element:edit', (id) => id);
    this.dispatcher.on('content:element:delete:modal', (e) => e);
    this.dispatcher.on('content:element:edit:cancel');
    this.dispatcher.on('content:element:update', (content) => content);
    this.dispatcher.on('content:element:delete:picture', (id) => id);
    this.dispatcher.on('content:metadata:delete', (content) => content);
    this.dispatcher.on('content:relation:update', (options) => options);
    this.dispatcher.on('content:tag:update', (options) => options);
    this.dispatcher.on('content:file:delete', (id) => id);
    this.dispatcher.on('content:editor:update', (body) => body);
    this.dispatcher.on('archive:pagination', (page) => page);
    this.dispatcher.on('archive:options');

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

    window.onscroll = () => {
      const top = document.getElementById('top');

      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
        top.style.display = "block";
      else
        top.style.display = "none";
    };
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

    window.scrollTo({ top: 0 });
  },
});
