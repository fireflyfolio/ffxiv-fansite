import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';

import Config from '../../config';
import Router from '../../router';
import { handleFetch } from '../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click a.nav': 'onNavClick',
    'click a.admin': 'onAdminClick',
    'click a.new': 'onNewClick',
    'click a.quit': 'onQuitClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
  },

  render: function () {
    this.setElement('#nav');

    this.undelegateEvents();
    this.$el.html(this.template.render('commons/nav.html'));
    this.delegateEvents();

    return this;
  },

  onNavClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },

  onAdminClick: function (e) {
    e.preventDefault();
    this.router.dispatcher.trigger('admin:show:toggle');
  },

  onNewClick: function (e) {
    e.preventDefault();

    const cb = (data) => {
      Toastr.success('Le contenu a été créé avec succès.');
      this.router.navigate('/article/' + data.id, { trigger: true });
    };

    const options = {
      url: Config.api.server + Config.api.backend.contents,
      method: 'POST',
      callback: cb,
    };

    handleFetch(options);
  },

  onQuitClick: function (e) {
    window.location.href = '/';
  },
});
