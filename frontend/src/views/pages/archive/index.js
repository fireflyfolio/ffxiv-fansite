import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import ContainerView from './container';
import OptionsView from './options';
import StateModel from '../../../models/state';
import ContentCollection from '../../../models/content_';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click #archive a.ba': 'onClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.state = new StateModel();
    this.contents = new ContentCollection();

    this.containerView = new ContainerView();
    this.optionsView = new OptionsView();
  },

  render: function () {
    this.contents.url = Config.api.server + Config.api.contents +
      `?sort=${this.state.get('sort')}&sort_dir=${this.state.get('sort_dir')}&limit=100`;

    this.contents.fetch().then(() => {
      this.$el.html(this.template.render('pages/archive/index.html'));

      this.$('#nav').append(this.router.views.nav.render().el);
      this.$('#container').append(this.containerView.render({ contents: this.contents }).el);
      this.$('#options').append(this.optionsView.render({ state: this.state }).el);
    });

    return this;
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },
});
