"use strict";

import DirPickerCollectionBase from './dirPickerCollectionBase';
import BackboneLocalStorage from 'backbone.localstorage';
import DirPickerTemplate from '../models/dirPickerTemplate';

/**
 * Templateを束ねるコレクション
 */
export class DirPickerTemplates extends DirPickerCollectionBase {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );

    //eventsLoggerを有効化
    this.debugEvents( 'CollectionsTemplates' );

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

}

const dirPickerTemplatesCollection = new DirPickerTemplates();
dirPickerTemplatesCollection.fetch();
export default dirPickerTemplatesCollection;

