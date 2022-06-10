import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Router from '../../../router';
import SpotlightView from './spotlight';
import EditorialView from './editorial';
import LatestView from './latest';
import HighlightingView from './highlighting';

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
    'click a.link': 'onClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.spotlightView = new SpotlightView();
    this.editorialView = new EditorialView();
    this.latestView = new LatestView();
    this.articleView = new HighlightingView();
    this.dataView = new HighlightingView();
    this.pictureView = new HighlightingView();
    this.audioView = new HighlightingView();
    this.videoView = new HighlightingView();
  },

  render: function () {
    this.$el.html(this.template.render('pages/home/index.html'));

    this.$('#nav').append(this.router.views.nav.render().el);
    this.$('#spotlight').append(this.spotlightView.render().el);
    this.$('#editorial').append(this.editorialView.render().el);
    this.$('#latest').append(this.latestView.render().el);
    this.$('#highlighting-1').append(this.articleView.render({ type: CONTENT_TYPE_ARTICLE }).el);
    this.$('#highlighting-2').append(this.dataView.render({ type: CONTENT_TYPE_DATA }).el);
    this.$('#highlighting-3').append(this.pictureView.render({ type: CONTENT_TYPE_PICTURE }).el);
    this.$('#highlighting-4').append(this.audioView.render({ type: CONTENT_TYPE_AUDIO }).el);
    this.$('#highlighting-5').append(this.videoView.render({ type: CONTENT_TYPE_VIDEO }).el);

    window.scrollTo({ top: 0 });

    return this;
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },
});
