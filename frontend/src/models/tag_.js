import Backbone from 'backbone';

import TagModel from "./tag";

export default Backbone.Collection.extend({
  parse: function (res) {
    return res.data;
  },
});
