"use strict";

// noinspection NpmUsedModulesInstalled
import {ipcRenderer} from 'electron'
// noinspection NpmUsedModulesInstalled
import {clipboard} from 'electron'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

export default class Commands {

  static writeClipboard ( text ) {
    //noinspection JSUnresolvedFunction
    clipboard.writeText( text );
  }

  static sendErrorToMain ( e ) {
    //noinspection JSUnresolvedFunction
    ipcRenderer.sendSync( 'error-message', ` (;´Д\`)y─┛~~ \n\n${e.message}` );
  }

  static createDirectory ( targetPath ) {
    try {
      mkdirp.sync( targetPath );
      open( targetPath );
    } catch (e) {
      this.sendErrorToMain( e );
    }
  }

  static getFolderStats ( targetPath ) {
    const dest = {};
    try {
      let stats = fs.statSync( targetPath );
      dest.isExist = true;
      dest.isFolder = stats.isDirectory();
    } catch (e) {
      if (e.code === 'ENOENT') {
        dest.isExist = false;
      }
    }
    dest.path = path.normalize( targetPath );
    dest.isAbs = path.isAbsolute( targetPath );
    return dest;
  }

}
