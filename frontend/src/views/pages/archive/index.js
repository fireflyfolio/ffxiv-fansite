import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContainerView from './container';
import OptionsView from './options';
import TagView from './tag';
import ContentCollection from '../../../models/content_';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #archive a.ba': 'onClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.contents = new ContentCollection();

    this.containerView = new ContainerView();
    this.optionsView = new OptionsView();
    this.tagView = new TagView();

    this.listenTo(this.router.dispatcher, 'archive:pagination', (page) => this._refreshPagination(page));
    this.listenTo(this.router.dispatcher, 'archive:options', () => this.render());
  },

  render: function () {
    const limit = this.router.state.get('limit');
    const offset = (this.router.state.get('page') - 1) * limit;
    const type = this.router.state.get('type');
    const search = this.router.state.get('search');
    const tag = this.router.state.get('tag');

    this.contents.url = Config.api.server + Config.api.contents +
      `?sort=${this.router.state.get('sort')}&sort_dir=${this.router.state.get('sort_dir')}` +
      `&limit=${limit}&offset=${offset}`;

    if (type !== '-1') this.contents.url += `&type=${type}`;
    if (search !== '-1') this.contents.url += `&search=${search}`;
    if (tag !== '-1') this.contents.url += `&tag=${tag}`;

    this.contents.fetch().then(() => {
      this.$el.html(this.template.render('pages/archive/index.html'));

      this.$('#nav').append(this.router.views.nav.render().el);
      this.$('#container').append(this.containerView.render({ contents: this.contents }).el);
      this.$('#options').append(this.optionsView.render().el);
      this.$('#tag').append(this.tagView.render().el);
    });

    return this;
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },

  _refreshPagination: function (page) {
    this.router.state.set({ page: page });
    this.render();
  }
});
