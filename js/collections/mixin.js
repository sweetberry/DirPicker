module.exports = {
  /**
   * @this {Backbone.Collection}
   * @param name
   * @returns {boolean}
   */
  isUniqueName: function ( name ) {
    return !_.find( this.models, function ( model ) {
      return model.get( 'name' ) == name;
    } );
  }
};
