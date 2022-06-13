
import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Toastr from 'toastr';

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
import { handleFetchModel, handleSaveModel } from '../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click a.tab-menu': 'onMenuClick',
    'click .delete': 'showDeleteModal',
    'click .cancel': 'hideDeleteModal',
    'click #content-element .edit': 'onElementEditClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.content = new ContentModel();
    this.relations = new RelationCollection();
    this.tags = new TagCollection();

    this.contentView = new ContentView();
    this.contentExtraView = new ContentExtraView();
    this.elementtView = new ElementView();
    this.elementEditView = new ElementEditView();
    this.elementMetadataView = new ElementMetadataView();
    this.elementFileView = new ElementFileView();
    this.relationView = new RelationView();
    this.tagView = new TagView();
    this.modalView = new ModalView();

    this.listenTo(this.router.dispatcher, 'admin:show:toggle', (id) => this.toggleAdminPanel(id));
    this.listenTo(this.router.dispatcher, 'content:element:update', () => this.hideDeleteModal());
    this.listenTo(this.router.dispatcher, 'content:element:delete:modal', (e) => this.showDeleteModal(e));
    this.listenTo(this.router.dispatcher, 'content:metadata:delete', () => this.hideDeleteModal());
    this.listenTo(this.router.dispatcher, 'content:file:delete', () => this.hideDeleteModal());
    this.listenTo(this.router.dispatcher, 'content:relation:update', () => this.hideDeleteModal());
    this.listenTo(this.router.dispatcher, 'content:tag:update', () => this.hideDeleteModal());
    this.listenTo(this.router.dispatcher, 'content:element:edit:cancel', () => this._cancelElementEdition());
    this.listenTo(this.router.dispatcher, 'content:editor:update', (data) => this._saveContentBody(data));
  },

  render: function (options) {
    this.setElement('#admin');

    this.id = options ? options.id || this.id : this.id;

    this.content.url = Config.api.server + Config.api.backend.contents + '/' + this.id;

    const cb = () => {
      this.$el.html(this.template.render('admin/index.html', { state: this.router.state }));

      this.$('#tab-content-1').append(this.contentView.render({ content: this.content }).el);
      this.$('#tab-content-2').append(this.contentExtraView.render({ content: this.content }).el);
      this.$('#tab-element-1').append(this.elementtView.render({ content: this.content }).el);
      this.$('#tab-element-1-edit').append(this.elementEditView.render({ content: this.content }).el);
      this.$('#tab-element-2').append(this.elementMetadataView.render({ content: this.content }).el);
      this.$('#tab-element-3').append(this.elementFileView.render({ content: this.content }).el);
      this.$('#tab-extra-1').append(this.relationView.render({ content: this.content, relations: this.relations }).el);
      this.$('#tab-extra-2').append(this.tagView.render({ content: this.content, tags: this.tags }).el);

      this.$(`#tab-content-2`).hide();
      this.$(`#tab-element-1-edit`).hide();
      this.$(`#tab-element-2`).hide();
      this.$(`#tab-element-3`).hide();
      this.$(`#tab-extra-2`).hide();
      this.$(`#tab-extra-3`).hide();

      this.toggleAdminPanel();
      this.toggleAdminPanel(1);
      this.toggleAdminPanel(2);
      this.toggleAdminPanel(3);
    };

    handleFetchModel(this.content, cb);

    return this;
  },

  toggleAdminPanel: function (id) {
    let show_admin = this.router.state.get('show_admin');

    if (!id) {
      if (show_admin)
        this.$('#wrapper').show();
      else
        this.$('#wrapper').hide();
    } else {
      show_admin = this.router.state.get('show_admin_panel' + id);

      if (show_admin)
        this.$('#admin-panel' + id).show();
      else
        this.$('#admin-panel' + id).hide();
    }
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
    const title = e.currentTarget.attributes['data-title'] ? e.currentTarget.attributes['data-title'].nodeValue : false;
    const cover = e.currentTarget.attributes['data-cover'] ? e.currentTarget.attributes['data-cover'].nodeValue : false;

    this.$('#modal-delete').empty();
    this.$('#modal-delete').append(this.modalView.render({
      content: this.content,
      relations: this.relations,
      tags: this.tags,
      id: id,
      type: type,
      title: title,
      cover: cover,
    }).el);

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

  _saveContentBody: function (data) {
    this.content.set({ body: data });
    handleSaveModel(this.content, () => Toastr.success('Le texte a été sauvegardé avec succès.'));
  },

  _cancelElementEdition: function () {
    this.$(`#tab-element-1-edit`).hide();
    this.$(`#tab-element-1`).show();
  },
});
