"use strict";

import DirPickerCollectionBase from './dirPickerCollectionBase';
import BackboneLocalStorage from 'backbone.localstorage';
import DirPickerTemplate from '../models/dirPickerTemplate';

/**
 * Templateを束ねるコレクション
 */
export default class DirPickerTemplates extends DirPickerCollectionBase {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );

    //noinspection JSUnusedGlobalSymbols
    /**
     * 永続先はlocalStorage、名前はdirPickerTemplatesCollection
     */
    this.localStorage = new BackboneLocalStorage( "dirPickerTemplatesCollection" );

    /**
     *
     * @type {DirPickerTemplate}
     */
    this.model = DirPickerTemplate;

    //noinspection JSUnusedGlobalSymbols
    /**
     *
     * @type {string}
     */
    this.comparator = 'sort'

  }

  //noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols
  /**
   *
   * @param {object} [attr]
   * @param {object} [options]
   */
  initialize ( attr, options ) {
    this.debugEvents( 'CollectionsTemplates' );
  }

}

const dirPickerTemplatesCollection = new DirPickerTemplates();
dirPickerTemplatesCollection.fetch();
export default dirPickerTemplatesCollection;

