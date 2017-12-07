"use strict";

import Marionette from 'backbone.marionette';
import RootView from './views/rootView'

import 'bootstrap';
import 'bootstrap-3-typeahead';
import './common/setupMenu';

const App = new Marionette.Application();

App.on( "start", ()=> {
  App.rootView = new RootView();
  App.rootView.render();
  Backbone.history.start();
} );

App.start();
