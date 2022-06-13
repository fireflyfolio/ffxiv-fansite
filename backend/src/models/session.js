import Backbone from 'backbone';

export default Backbone.Model.extend({
  defaults: function () {
    return {
      signedIn: false,
      accessToken: null,
      refreshToken: null,
      sessionTimeout: null,
    };
  }
});
