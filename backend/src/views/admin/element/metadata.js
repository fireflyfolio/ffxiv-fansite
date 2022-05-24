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
    'click #content-metadata .submit': 'onSubmitClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.listenTo(this.router.dispatcher, 'content:metadata:delete', (content) => this.render({ content: content }));
  },

  render: function (options) {
    this.setElement('#tab-element-2');

    this.content = options ? options.content || this.content : this.content;

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
    this.render();
  },

  onMoveUpClick: function (e) {
    e.preventDefault();

    const { index, items } = this._findIndex(e);
    if (index <= 0) return;

    const meta = items.metadata.splice(index, 1)[0];
    items.metadata.splice(index - 1, 0, meta);

    // Reorder meta in existing elements
    if (items.elements) {
      items.elements.map((element) => {
        if (!element.customized_metadata) return element;

        const custom = element.customized_metadata.splice(index, 1)[0];
        element.customized_metadata.splice(index - 1, 0, custom);

        return element;
      });
    }

    this.render();
  },

  onMoveDownClick: function (e) {
    e.preventDefault();

    const { index, items } = this._findIndex(e);
    if (index >= items.metadata.length) return;

    const meta = items.metadata.splice(index, 1)[0];
    items.metadata.splice(index + 1, 0, meta);

    // Reorder meta in existing elements
    if (items.elements) {
      items.elements.map((element) => {
        if (!element.customized_metadata) return element;

        const custom = element.customized_metadata.splice(index, 1)[0];
        element.customized_metadata.splice(index + 1, 0, custom);

        return element;
      });
    }

    this.render();
  },

  onSubmitClick: function (e) {
    e.preventDefault();

    // Check if key or label is empty
    const nullKeys = this.content.get('items').metadata.filter((meta) => meta.key === '' || meta.label === '');
    if (nullKeys.length > 0) return Toastr.error('Une metadata ne doit pas avoir de clé ou de libellé vide.');

    let items = this.content.get('items') ?? {};
    if (!items.metadata) return;

    // Update or add metadata to existing elements
    items.metadata.map((metaRef) => {
      items.elements = items.elements.map((element) => {
        let metaExists = false;

        // Update existing metadata
        element.customized_metadata = element.customized_metadata.map((meta) => {
          if (meta.id === metaRef.id) {
            meta.key = metaRef.key;
            meta.label = metaRef.label;
            meta.type = metaRef.type;
            meta.default = metaRef.default;
            meta.is_active = metaRef.is_active;
            metaExists = true;
          }

          return meta;
        });

        // Add new metadata to element
        if (!metaExists) element.customized_metadata.push(metaRef);

        return element;
      });
    });

    this.content.set({ items: items });

    handleSaveModel(this.content, () => {
      Toastr.success('La métadata a été mise à jour avec succès.');
      this.router.dispatcher.trigger('content:element:update', this.content);
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
  },

  _findIndex: function (e) {
    const element = e.currentTarget;
    const id = element.attributes['data-id'].nodeValue;

    let items = this.content.get('items') ?? {};
    items.metadata = items.metadata ?? [];

    return { index: _.findIndex(items.metadata, (i) => i.id === id), items: items };
  },
});
