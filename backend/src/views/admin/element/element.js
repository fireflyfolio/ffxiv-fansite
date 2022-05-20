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
    'click #content-element .add': 'onAddClick',
    'click #content-element .move-up': 'onMoveUpClick',
    'click #content-element .move-down': 'onMoveDownClick',
    'click #content-element .move-top': 'onMoveTopClick',
    'click #content-element .move-bottom': 'onMoveBottomClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.listenTo(this.router.dispatcher, 'content:element:update', () => this.render());
  },

  render: function (options) {
    this.setElement('#tab-element-1');

    this.content = options ? options.content || this.content : this.content;

    this.$el.html(this.template.render('admin/element/element.html', { content: this.content }));

    return this;
  },

  onAddClick: function (e) {
    e.preventDefault();

    let items = this.content.get('items') ?? {};

    const element = {
      id: uuidv4(),
      is_active: true,
      cover: null,
      title: null,
      body: null,
      url: null,
      typed_metadata: this._initializeTypedMetadata(),
      customized_metadata: items.metadata ?? [],
    };

    items.elements = items.elements ?? [];
    items.elements.push(element);
    this.content.set({ items: items });

    handleSaveModel(this.content, () => {
      Toastr.success("L'élément a été ajouté avec succès.");
      this.router.dispatcher.trigger('content:element:update');
      this.render();
    });
  },

  onMoveUpClick: function (e) {
    e.preventDefault();

    const { index, items } = this._findIndex(e);
    if (index <= 0) return;

    const element = items.elements.splice(index, 1)[0];
    items.elements.splice(index - 1, 0, element);

    handleSaveModel(this.content, () => {
      Toastr.success("L'élément a été mis à jour avec succès.");
      this.router.dispatcher.trigger('content:element:update');
      this.render();
    });
  },

  onMoveDownClick: function (e) {
    e.preventDefault();

    const { index, items } = this._findIndex(e);
    if (index >= items.elements.length) return;

    const element = items.elements.splice(index, 1)[0];
    items.elements.splice(index + 1, 0, element);

    handleSaveModel(this.content, () => {
      Toastr.success("L'élément a été mis à jour avec succès.");
      this.router.dispatcher.trigger('content:element:update');
      this.render();
    });
  },

  onMoveTopClick: function (e) {
    e.preventDefault();

    const { index, items } = this._findIndex(e);
    if (index <= 0) return;

    const element = items.elements.splice(index, 1)[0];
    items.elements.unshift(element);

    handleSaveModel(this.content, () => {
      Toastr.success("L'élément a été mis à jour avec succès.");
      this.router.dispatcher.trigger('content:element:update');
      this.render();
    });
  },

  onMoveBottomClick: function (e) {
    e.preventDefault();

    const { index, items } = this._findIndex(e);
    if (index >= items.elements.length) return;

    const element = items.elements.splice(index, 1)[0];
    items.elements.push(element);

    handleSaveModel(this.content, () => {
      Toastr.success("L'élément a été mis à jour avec succès.");
      this.router.dispatcher.trigger('content:element:update');
      this.render();
    });
  },

  _initializeTypedMetadata: function () {
    return [
      {
        id: uuidv4(),
        key: 'author',
        label: 'Auteur',
        type: 'string',
        default: 'N/A',
        value: null,
      },
      {
        id: uuidv4(),
        key: 'duration',
        label: 'Durée',
        type: 'string',
        default: '0:00',
        value: null,
      },
    ];
  },

  _findIndex: function (e) {
    const element = e.currentTarget;
    const id = element.attributes['data-id'].nodeValue;

    let items = this.content.get('items') ?? {};
    items.elements = items.elements ?? [];

    return { index: _.findIndex(items.elements, (i) => i.id === id), items: items };
  },
});
