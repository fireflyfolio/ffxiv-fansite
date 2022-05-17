import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import { v4 as uuidv4 } from 'uuid';
import _ from 'underscore';
import Toastr from 'toastr';

import Router from '../../../router';
import { handleSaveModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'change #content-metadata select': 'onSelectChange',
    'input #content-metadata input': 'onInputInput',
    'click #content-metadata .add': 'onAddClick',
    'click #content-metadata .move-up': 'onMoveUpClick',
    'click #content-metadata .move-down': 'onMoveDownClick',
  },

  initialize: function (options) {
    this.content = options.content;

    this.router = Router.prototype.getInstance();

    this.listenTo(this.router.dispatcher, 'content:metadata:delete', () => this.render());
  },

  render: function () {
    this.$el.html(this.template.render('admin/element/metadata.html', { content: this.content }));

    return this;
  },

  onSelectChange: function (e) {
    this._updateMeta(e);
  },

  onInputInput: function (e) {
    this._updateMeta(e);
  },

  onAddClick: function (e) {
    e.preventDefault();

    const meta = {
      id: uuidv4(),
      key: '',
      label: '',
      type: 'string',
      default: '',
      is_active: true,
      value: null,
    };

    let items = this.content.get('items') ?? {};
    items.metadata = items.metadata ?? [];
    items.metadata.push(meta);
    this.content.set({ items: items });

    handleSaveModel(this.content, () => {
      Toastr.success('La métadata a été ajoutée avec succès.');
      this.render();
    });
  },

  onMoveUpClick: function (e) {
    e.preventDefault();

    const { index, items } = this._findIndex(e);
    if (index <= 0) return;

    const meta = items.metadata.splice(index, 1)[0];
    items.metadata.splice(index - 1, 0, meta);

    handleSaveModel(this.content, () => {
      Toastr.success('La métadata a été mise à jour avec succès.');
      this.render();
    });
  },

  onMoveDownClick: function (e) {
    e.preventDefault();

    const { index, items } = this._findIndex(e);
    if (index >= items.metadata.length) return;

    const meta = items.metadata.splice(index, 1)[0];
    items.metadata.splice(index + 1, 0, meta);

    handleSaveModel(this.content, () => {
      Toastr.success('La métadata a été mise à jour avec succès.');
      this.render();
    });
  },

  _updateMeta: function (e) {
    const element = e.currentTarget;
    const id = element.attributes['data-id'].nodeValue;
    const items = this.content.get('items');
    const meta = items.metadata.find((item) => item.id === id);

    let value = (element.type === 'checkbox') ? element.checked : element.value;
    if (element.type === 'select') value = element.options[element.selectedIndex].value;

    meta[element.name] = value;
    handleSaveModel(this.content, () => Toastr.success('La métadata a été mise à jour avec succès.'));
  },

  _findIndex: function (e) {
    const element = e.currentTarget;
    const id = element.attributes['data-id'].nodeValue;

    let items = this.content.get('items') ?? {};
    items.metadata = items.metadata ?? [];

    return { index: _.findIndex(items.metadata, (i) => i.id === id), items: items };
  },
});
