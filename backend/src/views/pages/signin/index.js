import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'input input': 'onInputInput',
    'click #signin .submit': 'onSubmitClick',
    'keydown input': 'onKeydown',
  },

  initialize: function () {
    this.username = null;
    this.password = null;

    this.router = Router.prototype.getInstance();
  },

  render: function () {
    this.$el.html(this.template.render('pages/signin/index.html'));
    this.delegateEvents();

    return this;
  },

  onInputInput: function (e) {
    const element = e.currentTarget;
    this[element.name] = element.value;
  },

  onSubmitClick: function (e) {
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);

    fetch(Config.api.server + Config.api.backend.auth + '/signin', { method: 'POST', body: formData })
      .then((res) => res.json())
      .then((json) => {
        if (!json.data) return false;

        this.undelegateEvents();

        this.router.session.set({
          signedIn: true,
          accessToken: json.data.accessToken,
          refreshToken: json.data.refreshToken,
        });

        this.router.navigate('/', { trigger: true });
      });
  },

  onKeydown: function (e) {
    if (e.keyCode === 13) this.onSubmitClick(e);
  }
});
