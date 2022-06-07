import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import LazyLoad from 'vanilla-lazyload';

import Config from '../../../config';
import Router from '../../../router';
import { dateOnly } from '../../../utils/date';
import { getStatus, getType, getTypeLabel } from '../../../utils/string';

export default Backbone.View.extend({
  template: Nunjucks,

  lazyLoadInstance: new LazyLoad(),

  events: {
    'click .start': 'onStartClick',
    'click .end': 'onEndClick',
    'click .previous': 'onPreviousClick',
    'click .next': 'onNextClick',
    'click .page': 'onPageClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
  },

  render: function (options) {
    this.setElement('#container');

    this.contents = options ? options.contents || this.contents : this.contents;

    this.totalPages = Math.ceil(this.contents.total / this.router.state.get('limit'));
    const page = this.router.state.get('page');
    const pages = this._makeRange(page, this.totalPages, this.router.state.get('range'));

    this.$el.html(this.template.render('pages/archive/container.html', {
      contents: this.contents,
      server: Config.api.server,
      page: page,
      pages: pages,
      state: this.router.state,
      dateOnly: dateOnly,
      getStatus: getStatus,
      getType: getType,
      getTypeLabel: getTypeLabel,
    }));

    this.lazyLoadInstance.update();

    return this;
  },

  onStartClick: function (e) {
    e.preventDefault();
    this.router.dispatcher.trigger('archive:pagination', 1);
  },

  onEndClick: function (e) {
    e.preventDefault();
    this.router.dispatcher.trigger('archive:pagination', this.totalPages);
  },

  onPreviousClick: function (e) {
    e.preventDefault();
    const page = Math.max(1, this.router.state.get('page') - 1);
    this.router.dispatcher.trigger('archive:pagination', page);
  },

  onNextClick: function (e) {
    e.preventDefault();
    const page = Math.min(this.totalPages, this.router.state.get('page') + 1);
    this.router.dispatcher.trigger('archive:pagination', page);
  },

  onPageClick: function (e) {
    e.preventDefault();
    const page = e.currentTarget.getAttribute('data-page');
    this.router.dispatcher.trigger('archive:pagination', page);
  },

  _makeRange: function (start, end, range) {
    let offsetRange = parseInt(start);
    let offsetPageMax = Math.max(1, end - range + 1);

    if (range > end) range = end;
    if (offsetPageMax > end) offsetPageMax = end;
    if (offsetRange > offsetPageMax) offsetRange = offsetPageMax;
    if (end < range) offsetRange = 1;

    return Array(range).fill(null).map((_, index) => offsetRange + index);
  },
});
