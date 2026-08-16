(function (global) {
  'use strict';

  var SHEETS = ['Locations', 'Stdtesting', 'Localization'];

  function responseTable(response) {
    if (response.status !== 'ok' || !response.table) {
      throw new Error(response.errors && response.errors[0] ? response.errors[0].detailed_message : 'Google Sheets query failed.');
    }
    return response.table;
  }

  function tableToRecords(table) {
    var columns = table.cols.map(function (column) { return column.label; });
    return table.rows.map(function (row) {
      var record = {};
      columns.forEach(function (name, index) {
        var cell = row.c[index];
        record[name] = cell && cell.v !== null ? cell.v : '';
      });
      return record;
    });
  }

  function loadSheet(workbookId, sheetName) {
    // The Visualization endpoint does not send CORS headers, so use its
    // documented responseHandler (JSONP) support instead of fetch().
    var callbackName = '__igmSheet' + Math.random().toString(36).slice(2);
    var url = 'https://docs.google.com/spreadsheets/d/' + encodeURIComponent(workbookId) +
      '/gviz/tq?tqx=' + encodeURIComponent('out:json;responseHandler:' + callbackName) +
      '&headers=1&sheet=' + encodeURIComponent(sheetName);

    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      var timeout = setTimeout(function () {
        cleanup();
        reject(new Error(sheetName + ' timed out.'));
      }, 15000);

      function cleanup() {
        clearTimeout(timeout);
        if (script.parentNode) script.parentNode.removeChild(script);
        try { delete global[callbackName]; } catch (e) { global[callbackName] = undefined; }
      }

      global[callbackName] = function (response) {
        cleanup();
        try {
          resolve(tableToRecords(responseTable(response)));
        } catch (error) {
          reject(error);
        }
      };
      script.onerror = function () {
        cleanup();
        reject(new Error(sheetName + ' could not be loaded.'));
      };
      script.src = url;
      document.head.appendChild(script);
    });
  }

  global.loadSiteData = function (workbookId) {
    return Promise.all(SHEETS.map(function (name) {
      return loadSheet(workbookId, name);
    })).then(function (results) {
      var data = {};
      SHEETS.forEach(function (name, index) { data[name] = results[index]; });
      return data;
    });
  };
}(window));
