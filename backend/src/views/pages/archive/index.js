import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContainerView from './container';
import OptionsView from './options';
import ContentCollection from '../../../models/content_';
import { handleFetchModel } from '../../../utils/auth';

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

    this.listenTo(this.router.state, 'change', this.onStateChange);
    this.listenTo(this.router.dispatcher, 'archive:pagination', (page) => this._refreshPagination(page));
  },

  render: function () {
    const limit = this.router.state.get('limit');
    const offset = (this.router.state.get('page') - 1) * limit;

    this.contents.url = Config.api.server + Config.api.backend.contents +
      `?sort=${this.router.state.get('sort')}&sort_dir=${this.router.state.get('sort_dir')}` +
      `&limit=${limit}&offset=${offset}`;

    const cb = () => {
      this.$el.html(this.template.render('pages/archive/index.html'));

      this.$('#nav').append(this.router.views.nav.render().el);
      this.$('#container').append(this.containerView.render({ contents: this.contents }).el);
      this.$('#options').append(this.optionsView.render().el);
    };

    handleFetchModel(this.contents, cb);

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
