import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';

import Router from '../../../router';
import { handleSaveModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'change #content-edit select': 'onSelectChange',
    'input #content-edit input, textarea': 'onInputInput',
    'click #content-edit .submit': 'onSubmitClick',
  },

  initialize: function (options) {
    this.content = options.content;

    this.router = Router.prototype.getInstance();
  },

  render: function () {
    this.$el.html(this.template.render('admin/content/content.html', { content: this.content }));
    return this;
  },

  onSelectChange: function (e) {
    const element = e.currentTarget;
    this.content.set(element.name, Number(element.options[element.selectedIndex].value));
  },

  onInputInput: function (e) {
    const element = e.currentTarget;
    this.content.set(element.name, element.value);
  },

  onSubmitClick: function (e) {
    e.preventDefault();
    const cb = () => {
      Toastr.success('Le contenu a été mis à jour avec succès.');
      this.router.dispatcher.trigger('content:element:update', this.content.get('items'));
    };
    handleSaveModel(this.content, cb);
  },
});
