import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import LazyLoad from 'vanilla-lazyload';

import Config from '../../../config';
import Router from '../../../router';
import ContentCollection from '../../../models/content_';
import { handleFetchModel } from '../../../utils/auth';
import { getType } from '../../../utils/string';

export default Backbone.View.extend({
  template: Nunjucks,

  lazyLoadInstance: new LazyLoad(),

  events: {
    'click .previous': 'onPreviousClick',
    'click .next': 'onNextClick',
    'click .dot': 'onDotClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.contents = new ContentCollection();
  },

  render: function () {
    this.setElement(`#spotlight`);

    this.slideIndex = 1;
    this.contents.url = Config.api.server + Config.api.backend.contents + '?limit=20&is_focus=true';

    if (this.router.state.get('show_privacy')) this.contents.url += '&show_privacy=true';

    const cb = () => {
      this.$el.html(this.template.render('pages/home/spotlight.html', {
        contents: this.contents,
        server: Config.api.server,
        getType: getType,
      }));

      this.lazyLoadInstance.update();
      if (this.contents.length > 0) this._showSlides(this.slideIndex);
    };

    handleFetchModel(this.contents, cb);

    return this;
  },

  onPreviousClick: function (e) {
    e.preventDefault();
    this._showSlides(this.slideIndex -= 1);
  },

  onNextClick: function (e) {
    e.preventDefault();
    this._showSlides(this.slideIndex += 1);
  },

  onDotClick: function (e) {
    e.preventDefault();
    const n = e.currentTarget.attributes['data-slide'].nodeValue;
    this._showSlides(this.slideIndex = parseInt(n));
  },

  _showSlides: function (n) {
    let slides = document.getElementsByClassName('slide');
    let dots = document.getElementsByClassName('dot');

    if (!slides.length) return;
    if (n > slides.length) this.slideIndex = 1;
    if (n < 1) this.slideIndex = slides.length;

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[this.slideIndex - 1].style.display = "block";
    dots[this.slideIndex - 1].className += " active";

    clearTimeout(this.slideTimeout);
    this.slideTimeout = setTimeout(() => this._showSlides(this.slideIndex += 1), Config.spotlight.timeout);
  },
});
