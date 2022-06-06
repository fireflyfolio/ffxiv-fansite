import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContainerView from './container';
import OptionsView from './options';
import TagView from './tag';
import ExtraView from './extra';
import ContentCollection from '../../../models/content_';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #archive a.ba': 'onClick',
    'click #archive #settings .toggle': 'onToggleSettingsClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.contents = new ContentCollection();

    this.containerView = new ContainerView();
    this.optionsView = new OptionsView();
    this.tagView = new TagView();
    this.extraView = new ExtraView();

    this.listenTo(this.router.dispatcher, 'archive:pagination', (page) => this._refreshPagination(page));
    this.listenTo(this.router.dispatcher, 'archive:options', () => this.render());
    this.listenTo(this.router.dispatcher, 'contents:privacy', () => this.render());
  },

  render: function () {
    const limit = this.router.state.get('limit');
    const offset = (this.router.state.get('page') - 1) * limit;
    const type = this.router.state.get('type');
    const status = this.router.state.get('status');
    const search = this.router.state.get('search');
    const tag = this.router.state.get('tag');

    this.contents.url = Config.api.server + Config.api.backend.contents +
      `?sort=${this.router.state.get('sort')}&sort_dir=${this.router.state.get('sort_dir')}` +
      `&limit=${limit}&offset=${offset}&is_archive=true`;

    if (this.router.state.get('show_privacy')) this.contents.url += '&show_privacy=true';

    if (type !== '-1') this.contents.url += `&type=${type}`;
    if (status !== '-1') this.contents.url += `&status=${status}`;
    if (search !== '-1') this.contents.url += `&search=${search}`;
    if (tag !== '-1') this.contents.url += `&tag=${tag}`;

    const cb = () => {
      this.$el.html(this.template.render('pages/archive/index.html'));

      this.$('#nav').append(this.router.views.nav.render().el);
      this.$('#container').append(this.containerView.render({ contents: this.contents }).el);
      this.$('#options').append(this.optionsView.render().el);
      this.$('#tag').append(this.tagView.render().el);
      this.$('#extra').append(this.extraView.render().el);

      if (this.router.state.get('show_settings'))
        this.$('#settings .wrapper').show();
      else
        this.$('#settings .wrapper').hide();

      this._refreshSettingsToggle();
    };

    handleFetchModel(this.contents, cb);

    return this;
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },

  onToggleSettingsClick: function (e) {
    e.preventDefault();
    this.$('#settings .wrapper').toggle();
    this._refreshSettingsToggle();
  },

  _refreshPagination: function (page) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.state.set({ page: page });
    this.render();
  },

  _refreshSettingsToggle: function () {
    if (this.$('#settings .wrapper').is(':visible')) {
      this.$('#settings .toggle i').removeClass('icon-arrow-up');
      this.$('#settings .toggle i').addClass('icon-arrow-down');
      this.router.state.set({ show_settings: true });
    } else {
      this.$('#settings .toggle i').addClass('icon-arrow-up');
      this.$('#settings .toggle i').removeClass('icon-arrow-down');
      this.router.state.set({ show_settings: false });
    }
  }
});
