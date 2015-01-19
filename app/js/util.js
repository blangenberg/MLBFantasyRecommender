var util = util || {};

util.isSet = function(val) {
  return "undefined" !== typeof val && null !== val;
}

util.isNotSet = function(val) {
  return !this.isSet(val);
}

util.isBlank = function(val) {
  return this.isNotSet(val) || val.trim().length == 0;
}

util.isNotBlank = function(val) {
  return !this.isBlank(val);
}

util.safeParseInt = function(val, defaultVal) {
  if (this.isNotSet(defaultVal) || isNaN(defaultVal)) {
    defaultVal = 0;
  }
  if (this.isBlank(val) || isNaN(val)) {
    return defaultVal;
  }
  return parseInt(val);
};

util.safeParseFloat = function(val, defaultVal) {
  if (this.isNotSet(defaultVal) || isNaN(defaultVal)) {
    defaultVal = 0.0;
  }
  if (this.isBlank(val) || isNaN(val)) {
    return defaultVal;
  }
  return parseFloat(val);
}

util.CSVParser = (function() {
  /** private */
  var _defaultDelimiter = ",";

  /** public */
  return {
    /**
     * Attribution: http://stackoverflow.com/a/1293163/2343
     * This will parse a delimited string into an array of arrays.
     * The default delimiter is a comma, but this can be overridden in the third argument.
     * @param data              CSV data as a String
     * @param {ignoreFirstRow=} true|false remove the header row in the CSV from the results. Default is false.
     * @param {fieldDelim=}     field delimiter in the CSV. Default is comma.
     * @returns (*[])           2D array. The result may be a jagged array.
     */
    toArray: function (data, ignoreFirstRow, fieldDelim) {
      // ignoreFirstRow defaults to false
      ignoreFirstRow = true === ignoreFirstRow;

      // Check to see if the delimiter is defined. If not, then default to comma.
      fieldDelim = fieldDelim || _defaultDelimiter;

      // Create a regular expression to parse the CSV values.
      var objPattern = new RegExp((
          // Delimiters.
          "(\\" + fieldDelim + "|\\r?\\n|\\r|^)" +
          // Quoted fields.
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
          // Standard fields.
          "([^\"\\" + fieldDelim + "\\r\\n]*))"
          ),
          "gi"
      );


      // Create an array to hold our data. Give the array a default empty first row.
      var arrData = [[]];

      // Create an array to hold our individual pattern matching groups.
      var arrMatches = null;

      // Keep looping over the regular expression matches
      // until we can no longer find a match.
      while (arrMatches = objPattern.exec(data)) {
        
        // Get the delimiter that was found.
        var delimMatch = arrMatches[1];

        // Check to see if the given delimiter has a length (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know hat this delimiter is a row delimiter.
        if (delimMatch.length && delimMatch !== fieldDelim) {
          // Since we have reached a new row of data, add an empty row to our data array.
          arrData.push([]);
        }

        var valueMatch;

        // Now that we have our delimiter out of the way, let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
          // We found a quoted value. When we capture this value, unescape any double quotes.
          valueMatch = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
        } else {
          // We found a non-quoted value.
          valueMatch = arrMatches[3];
        }
        // Now that we have our value string, let's add it to the data array.
        arrData[arrData.length - 1].push(valueMatch);
      }

      if (ignoreFirstRow) {
        arrData.shift();
      }
      // Return the parsed data.
      return arrData;
    }
  }
})();