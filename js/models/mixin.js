//noinspection JSUnusedGlobalSymbols
module.exports = {
  /**
   * @this {Backbone.Model}
   * @param {string} name
   * @returns {string}
   */
  makeUniqueName: function ( name ) {
    var dstName = name;
    if (this.collection && !this.collection.isUniqueName( name )) {
      var inc = 2;
      do {
        var tempName = name + '_' + inc;
        inc++;
      } while (!this.collection.isUniqueName( tempName ));
      dstName = tempName;
    }
    return dstName;
  }
};
