import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../config';
import Router from '../../router';
import ContentModel from '../../models/content';
import RelationCollection from '../../models/content_relation_';
import TagCollection from '../../models/content_tag_';
import ContentView from './content/content';
import ContentExtraView from './content/extra';
import ElementView from './element/element';
import ElementEditView from './element/element-edit';
import ElementMetadataView from './element/metadata';
import ElementFileView from './element/file';
import TagView from './extra/tag';
import RelationView from './extra/relation';
import ModalView from './modal';
import { handleFetchModel } from '../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  el: '#admin',

  events: {
    'click a.tab-menu': 'onMenuClick',
    'click .delete': 'showDeleteModal',
    'click .cancel': 'hideDeleteModal',
    'click #content-element .edit': 'onElementEditClick',
  },

  initialize: function (options) {
    this.id = options.id;

    this.router = Router.prototype.getInstance();
    this.content = new ContentModel();
    this.relations = new RelationCollection();
    this.tags = new TagCollection();

    this.listenTo(this.router.dispatcher, 'content:element:update', () => this.hideDeleteModal());
    this.listenTo(this.router.dispatcher, 'content:metadata:delete', () => this.hideDeleteModal());
    this.listenTo(this.router.dispatcher, 'content:element:edit:cancel', () => this._cancelElementEdition());
  },

  render: function () {
    this.content.url = Config.api.server + Config.api.backend.contents + '/' + this.id;

    const cb = () => {
      this.$el.html(this.template.render('admin/index.html'));

      const contentView = new ContentView({ content: this.content });
      this.$('#tab-content-1').append(contentView.render().el);

      const contentExtraView = new ContentExtraView({ content: this.content });
      this.$('#tab-content-2').append(contentExtraView.render().el);

      const elementtView = new ElementView({ content: this.content });
      this.$('#tab-element-1').append(elementtView.render().el);

      const elementEditView = new ElementEditView({ content: this.content });
      this.$('#tab-element-1-edit').append(elementEditView.render().el);

      const elementMetadataView = new ElementMetadataView({ content: this.content });
      this.$('#tab-element-2').append(elementMetadataView.render().el);

      const elementFileView = new ElementFileView({ content: this.content });
      this.$('#tab-element-3').append(elementFileView.render().el);

      const relationView = new RelationView({ content: this.content, relations: this.relations });
      this.$('#tab-extra-1').append(relationView.render().el);

      const tagView = new TagView({ content: this.content, tags: this.tags });
      this.$('#tab-extra-2').append(tagView.render().el);

      this.modalView = new ModalView({ content: this.content, relations: this.relations, tags: this.tags });

      this.$(`#tab-content-2`).hide();
      this.$(`#tab-element-1-edit`).hide();
      this.$(`#tab-element-2`).hide();
      this.$(`#tab-element-3`).hide();
      this.$(`#tab-extra-2`).hide();
      this.$(`#tab-extra-3`).hide();
    };

    handleFetchModel(this.content, cb);

    return this;
  },

  onMenuClick: function (e) {
    e.preventDefault();

    this.$(e.currentTarget).parent().parent().find('.pure-menu-item').removeClass('pure-menu-selected');
    this.$(e.currentTarget).parent().toggleClass('pure-menu-selected');

    const tab = e.currentTarget.attributes['data-tab'].nodeValue;
    const index = e.currentTarget.attributes['data-tab-index'].nodeValue;

    this.$(`#tab-${tab}-1`).hide();
    this.$(`#tab-${tab}-1-edit`).hide();
    this.$(`#tab-${tab}-2`).hide();
    this.$(`#tab-${tab}-3`).hide();
    this.$(`#tab-${tab}-${index}`).show();
  },

  showDeleteModal: function (e) {
    e.preventDefault();

    const id = e.currentTarget.attributes['data-id'].nodeValue;
    const type = e.currentTarget.attributes['data-type'].nodeValue;

    this.$('#modal-data').append(this.modalView.render({ id: id, type: type }).el);

    const modal = document.getElementById('modal-delete');
    modal.style.display = 'block';
    modal.scrollTo({ top: 0, behavior: 'smooth' });
  },

  hideDeleteModal: function (e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('modal-delete');
    modal.style.display = 'none';
  },

  onElementEditClick: function (e) {
    e.preventDefault();

    const element = e.currentTarget;
    const id = element.attributes['data-id'].nodeValue;

    this.router.dispatcher.trigger('content:element:edit', id);

    this.$(`#tab-element-1`).hide();
    this.$(`#tab-element-1-edit`).show();
  },

  _cancelElementEdition: function () {
    this.$(`#tab-element-1-edit`).hide();
    this.$(`#tab-element-1`).show();
  },
});
