"use strict";

import BaseCollection from './baseCollection'
// noinspection JSUnresolvedVariable
import {LocalStorage} from 'backbone.localstorage'
import DirPickerTemplate from '../models/templateModel'

/**
 * Templateを束ねるコレクション
 */
export class TemplatesCollection extends BaseCollection {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );

    //eventsLoggerを有効化
    // this.debugEvents( 'CollectionsTemplates' );

    //noinspection JSUnusedGlobalSymbols
    /**
     * 永続先はlocalStorage、名前はdirPickerTemplatesCollection
     */
    this.localStorage = new LocalStorage( "dirPickerTemplatesCollection" );

    /**
     *
     * @type {TemplateModel}
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

const dirPickerTemplatesCollection = new TemplatesCollection();
dirPickerTemplatesCollection.fetch();
export default dirPickerTemplatesCollection;

