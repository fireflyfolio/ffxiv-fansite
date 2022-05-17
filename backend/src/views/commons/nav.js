import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';

import Config from '../../config';
import Router from '../../router';
import { handleFetch } from '../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  el: '#nav',

  events: {
    'click a.nav': 'onNavClick',
    'click a.new': 'onNewClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
  },

  render: function () {
    this.$el.html(this.template.render('commons/nav.html'));
    return this;
  },

  onNavClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
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
});
