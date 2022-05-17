import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';

import Router from '../../../router';
import { handleSaveModel } from '../../../utils/auth';
import { format } from '../../../utils/date';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'input #content-extra input': 'onInputInput',
    'click #content-extra .submit': 'onSubmitClick',
  },

  initialize: function (options) {
    this.content = options.content;

    this.router = Router.prototype.getInstance();
  },

  render: function () {
    this.$el.html(this.template.render('admin/content/extra.html', { content: this.content, format: format }));

    return this;
  },

  onInputInput: function (e) {
    const element = e.currentTarget;
    let value = (element.type === 'checkbox') ? element.checked : element.value;
    this.content.set(element.name, value);
  },

  onSubmitClick: function (e) {
    e.preventDefault();
    const cb = () => {
      Toastr.success('Le contenu a été mis à jour avec succès.');
      this.router.dispatcher.trigger('content:element:update', this.content.items);
    };
    handleSaveModel(this.content, cb);
  },
});
