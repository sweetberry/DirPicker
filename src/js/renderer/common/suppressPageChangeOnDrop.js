"use strict";

/**
 * documentノードに何かをドロップされた時のページ推移を抑制します。
 */
export function suppressPageChangeOnDrop () {

  /** documentにドラッグされた場合 / ドロップされた場合 */
  document.ondragover = document.ondrop = function ( e ) {
    // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする
    e.preventDefault();
    return false;
  };
}