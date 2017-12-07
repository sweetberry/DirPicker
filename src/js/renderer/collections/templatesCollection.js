"use strict";

import _ from 'underscore';
import BaseCollection from './baseCollection'
// noinspection JSUnresolvedVariable
import {LocalStorage} from 'backbone.localstorage'
import TemplateModel from '../models/templateModel'

// noinspection NpmUsedModulesInstalled
import {remote} from 'electron'
import path from 'path'
import fse from 'fs-extra';
import fs from 'fs';

const USER_DATA_PATH = remote.app.getPath( 'userData' );
const TEMPLATES_FOLDER_PATH = path.join( USER_DATA_PATH, 'templates' );

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
    this.model = TemplateModel;

    //noinspection JSUnusedGlobalSymbols
    /**
     *
     * @type {string}
     */
    this.comparator = 'sort'

  }

  exportTemplates () {
    const templates = _.map( this.toJSON(), ( template ) => {
      return _.pick( template, 'name', 'path' );
    } );
    fs.writeFile( path.join( TEMPLATES_FOLDER_PATH, 'templates.json' ), JSON.stringify( templates, null, '  ' ) );
  }

  importTemplates () {
    const files = fs.readdirSync( TEMPLATES_FOLDER_PATH );
    const result = [];
    files.forEach( ( filename ) => {
      const ext = path.extname( filename );
      if (ext !== '.json') {
        return;
      }
      try {
        const _data = fs.readFileSync( path.join( TEMPLATES_FOLDER_PATH, filename ), 'utf8' );
        const data = JSON.parse( _data );

        if (!_.isArray( data )) {
          return
        }
        data.forEach( ( row ) => {
          if (_.isObject( row ) && _.has( row, 'name' ) && _.has( row, 'path' )) {
            result.push( row )
          }
        } )

      } catch (e) {
        console.error( e );
      }

    } );

    result.forEach( ( obj ) => {
      const existingModel = this.findWhere( {name: obj.name} );
      if (existingModel) {
        existingModel.save( obj, {wait: true} );
      } else {
        this.create( obj, {wait: true} );
      }
    } )
  }

  // noinspection JSMethodCanBeStatic
  openTemplatesFolder () {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    remote.shell.openItem( TEMPLATES_FOLDER_PATH );
  }
}

function ensureDefaultTemplates () {
  try {
    // noinspection JSUnresolvedFunction
    fse.statSync( TEMPLATES_FOLDER_PATH );
  } catch (e) {
    // noinspection JSUnresolvedFunction
    fse.copySync( path.join( remote.app.getAppPath(), 'templates' ), TEMPLATES_FOLDER_PATH );
  }
}

// 起動時に一度実行します
ensureDefaultTemplates();

const dirPickerTemplatesCollection = new TemplatesCollection();
dirPickerTemplatesCollection.fetch();
export default dirPickerTemplatesCollection;

