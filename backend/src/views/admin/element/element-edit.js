import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';

import Router from '../../../router';
import { handleSaveModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'change #content-element-edit select': 'onSelectChange',
    'input #content-element-edit input': 'onInputInput',
    'click #content-element-edit .submit': 'onSubmitClick',
    'click #content-element-edit .cancel': 'onCancelClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.listenTo(this.router.dispatcher, 'content:element:edit', (id) => this._loadElementById(id));
  },

  render: function (options) {
    this.setElement('#tab-element-1-edit');

    this.content = options ? options.content || this.content : this.content;

    this.$el.html(this.template.render('admin/element/element-edit.html', { element: this.element }));

    return this;
  },

  onSelectChange: function (e) {
    const element = e.currentTarget;
    let value = element.options[element.selectedIndex].value;

    switch (element.attributes['data-type'].nodeValue) {
      case 'number':
        value = Number(element.options[element.selectedIndex].value);
        break;
      case 'boolean':
        value = element.options[element.selectedIndex].value === 'true';
        break;
    }

    this._updateElementMetadata(element, value);
  },

  onInputInput: function (e) {
    const element = e.currentTarget;
    let value = element.value;

    switch (element.attributes['data-type'].nodeValue) {
      case 'number':
        value = Number(element.value);
        break;
      case 'boolean':
        value = element.value === 'true';
        break;
    }

    this._updateElementMetadata(element, value);
  },

  onSubmitClick: function (e) {
    e.preventDefault();
    const cb = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      Toastr.success("L'élément a été mis à jour avec succès.");
      this.router.dispatcher.trigger('content:element:update');
      this.router.dispatcher.trigger('content:element:edit:cancel');
    };
    handleSaveModel(this.content, cb);
  },

  onCancelClick: function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.dispatcher.trigger('content:element:edit:cancel');
  },

  _loadElementById: function (id) {
    const items = this.content.get('items') ?? {};
    this.element = items.elements.find((element) => element.id === id);
    this.render();
  },

  _updateElementMetadata: function (element, value) {
    let meta, id;

    switch (element.attributes['data-meta-type'].nodeValue) {
      case 'typed':
        id = element.attributes['data-id'].nodeValue;
        meta = this.element.typed_metadata.find((item) => item.id === id);
        meta.value = value;
        break;
      case 'customized':
        id = element.attributes['data-id'].nodeValue;
        meta = this.element.customized_metadata.find((item) => item.id === id);
        meta.value = value;
        break;
      default:
        this.element[element.name] = value;
        break;
    }
  },
});
