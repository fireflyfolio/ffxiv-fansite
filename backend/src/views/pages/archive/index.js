import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import _ from 'underscore';

import Config from '../../../config';
import Router from '../../../router';
import NavView from '../../commons/nav';
import SectionView from './section';
import OptionsView from './options';
import StateModel from '../../../models/state';
import ContentCollection from '../../../models/content_';
import { handleFetchModel } from '../../../utils/auth';

import {
  CONTENT_TYPE_ARTICLE,
  CONTENT_TYPE_AUDIO,
  CONTENT_TYPE_DATA,
  CONTENT_TYPE_PICTURE,
  CONTENT_TYPE_VIDEO
} from '../../../config/constants';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #archive a.ba': 'onClick',
    'click a.as': 'onSectionClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.state = new StateModel();

    this.listenTo(this.state, 'change', this.onStateChange);
  },

  onStateChange: function (e) {
    this.doRequest();
  },

  render: function () {
    this.$el.html(this.template.render('pages/archive/index.html'));

    const navView = new NavView();
    this.$('#nav').append(navView.render().el);

    this.doRequest();
    return this;
  },

  doRequest: function () {
    const sections = [
      {
        name: 'Article',
        type_label: 'article',
        type_id: CONTENT_TYPE_ARTICLE,
        total: 0
      },
      {
        name: 'Image',
        type_label: 'picture',
        type_id: CONTENT_TYPE_PICTURE,
        total: 0
      },
      {
        name: 'Collection',
        type_label: 'data',
        type_id: CONTENT_TYPE_DATA,
        total: 0
      },
      {
        name: 'Vidéo',
        type_label: 'video',
        type_id: CONTENT_TYPE_VIDEO,
        total: 0
      },
      {
        name: 'Musique',
        type_label: 'audio',
        type_id: CONTENT_TYPE_AUDIO,
        total: 0
      },
    ];

    let fn = (section) => {
      const content = new ContentCollection();
      content.url = Config.api.server + Config.api.backend.contents +
        `?type=${section.type_id}&sort=${this.state.get('sort')}&sort_dir=${this.state.get('sort_dir')}&limit=20`;

      return new Promise((resolve) => {
        const cb = () => {
          const sectionView = new SectionView({ section: section, items: content });
          const sectionId = '#' + section.type_label;
          this.$(sectionId).empty();
          this.$(sectionId).append(sectionView.render().el);

          section.total = content.length;
          resolve();
        };

        handleFetchModel(content, cb);
      });
    };

    let actions = sections.map(fn);
    let results = Promise.all(actions);

    results.then(() => {
      const optionsView = new OptionsView({ sections: sections, state: this.state });
      this.$('#options').replaceWith(optionsView.render().el);
    });
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },

  onSectionClick: function (e) {
    e.preventDefault();
    const anchor_name = e.currentTarget.getAttribute('data-anchor');
    const anchor = document.getElementById(anchor_name);
    window.scrollTo({ top: anchor.offsetTop, behavior: 'smooth' });
  },
});
