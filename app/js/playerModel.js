var PlayerModel = PlayerModel || {};
PlayerModel = (function() {
  /** private */
  var _cleanPlayerName = function(name) {
        var lastChar = name[name.length - 1];
        if ("*" == lastChar || "#" == lastChar) {
          return name.substr(0, name.length - 1);
        }
        return name;
      },

      _PLAYER_TYPE_BATTER = 1,
      _PLAYER_TYPE_PITCHER = 2,

      _createEmptyPlayer = function() {
        return {
          name: "Unknown",
          team: "NA",
          league: "NA",
          position: "1",

          isPitcher: function() {
            return this.position.indexOf("1") > -1;
          },

          isBatter: function() {
            return !this.isPitcher();
          },

          getPlayerType: function() {
            return this.isPitcher() ? _PLAYER_TYPE_PITCHER : _PLAYER_TYPE_BATTER;
          }
        }
      },

      _createEmptyBatter = function() {
        return $.extend(_createEmptyPlayer(), {
          number: 0,
          G: 0,
          PA: 0,
          AB: 0,
          R: 0,
          H: 0,
          DBL: 0,
          TPL: 0,
          HR: 0,
          RBI: 0,
          SB: 0,
          CS: 0,
          BB: 0,
          SO: 0,
          BA: 0.0,
          OBP: 0.0,
          SLG: 0.0,
          OPS: 0.0,
          OPS_P: 0,
          TB: 0,
          GDP: 0,
          HBP: 0,
          SH: 0,
          SF: 0,
          IBB: 0
        });
      },

      _createEmptyPitcher = function() {
        //Rk,Name,Age,Tm,Lg,W,L,W-L%,ERA,G,GS,GF,CG,SHO,SV,IP,H,R,ER,HR,BB,IBB,SO,HBP,BK,WP,BF,ERA+,FIP,WHIP,H9,HR9,BB9,SO9,SO/W
        return $.extend(_createEmptyPlayer(), {
          age: 0,
          W: 0,
          L: 0,
          WL_PCT: 0,
          ERA: 0.0,
          G: 0,
          GS: 0,
          GF: 0,
          CG: 0,
          SHO: 0,
          SV: 0,
          IP: 0,
          H: 0,
          R: 0,
          ER: 0,
          HR: 0,
          BB: 0,
          IBB: 0,
          SO: 0,
          HBP: 0,
          BK: 0,
          WP: 0,
          BF: 0,
          ERA_P: 0,
          FIP: 0.0,
          WHIP: 0.0,
          H_9: 0.0,
          HR_9: 0.0,
          BB_9: 0.0,
          SO_9: 0.0,
          SO_W: 0.0
        });
      },

      _csvRowToBatter = function(rowArray) {
        //data: "1013,David Ortiz*,38,BOS,AL,142,602,518,59,136,27,0,35,104,0,0,75,95,.263,.355,.517,.873,143,268,18,3,0,6,22,*D/3",
        if (rowArray.length < 30) {
          console.log("Malformed data row. Expected 30 values for a batter.");
          return null;
        }
        var batter = _createEmptyBatter();
        //RK (field 0) is meaningless. Skip it.
        batter.name = _cleanPlayerName(rowArray[1]);
        batter.number = util.safeParseInt(rowArray[2]);
        batter.team = rowArray[3];
        batter.league = rowArray[4];
        batter.G = rowArray[5];
        batter.PA = rowArray[6];
        batter.AB = util.safeParseInt(rowArray[7]);
        batter.R = util.safeParseInt(rowArray[8]);
        batter.H = util.safeParseInt(rowArray[9]);
        batter.DBL = util.safeParseInt(rowArray[10]);
        batter.TPL = util.safeParseInt(rowArray[11]);
        batter.HR = util.safeParseInt(rowArray[12]);
        batter.RBI = util.safeParseInt(rowArray[13]);
        batter.SB = util.safeParseInt(rowArray[14]);
        batter.CS = util.safeParseInt(rowArray[15]);
        batter.BB = util.safeParseInt(rowArray[16]);
        batter.SO = util.safeParseInt(rowArray[17]);
        batter.BA = util.safeParseFloat(rowArray[18]);;
        batter.OBP = util.safeParseFloat(rowArray[19]);;
        batter.SLG = util.safeParseFloat(rowArray[20]);;
        batter.OPS = util.safeParseFloat(rowArray[21]);;
        batter.OPS_P = util.safeParseInt(rowArray[22]);
        batter.TB = util.safeParseInt(rowArray[23]);
        batter.GDP = util.safeParseInt(rowArray[24]);
        batter.HBP = util.safeParseInt(rowArray[25]);
        batter.SH = util.safeParseInt(rowArray[26]);
        batter.SF = util.safeParseInt(rowArray[27]);
        batter.IBB = util.safeParseInt(rowArray[28]);
        batter.position = rowArray[29];
        return batter;
      },

      _csvRowToPitcher = function(rowArray) {
        //Rk,Name,Age,Tm,Lg,W,L,W-L%,ERA,G,GS,GF,CG,SHO,SV,IP,H,R,ER,HR,BB,IBB,SO,HBP,BK,WP,BF,ERA+,FIP,WHIP,H9,HR9,BB9,SO9,SO/W
        if (rowArray.length < 34) {
          console.log("Malformed data row. Expected 34 fields for a pitcher.");
          return null;
        }
        var pitcher = _createEmptyPitcher();
        //RK (field 0) is meaningless. Skip it.
        pitcher.name = _cleanPlayerName(rowArray[1]);
        pitcher.age = util.safeParseInt(rowArray[2]);
        pitcher.team = rowArray[3];
        pitcher.league = rowArray[4];
        pitcher.W = util.safeParseInt(rowArray[5]);
        pitcher.L = util.safeParseInt(rowArray[6]);
        pitcher.WL_PCT = util.safeParseFloat(rowArray[7]);
        pitcher.ERA = util.safeParseFloat(rowArray[8]);
        pitcher.G = util.safeParseInt(rowArray[9]);
        pitcher.GS = util.safeParseInt(rowArray[10]);
        pitcher.GF = util.safeParseInt(rowArray[11]);
        pitcher.CG = util.safeParseInt(rowArray[12]);
        pitcher.SHO = util.safeParseInt(rowArray[13]);
        pitcher.SV = util.safeParseInt(rowArray[14]);
        pitcher.IP = util.safeParseInt(rowArray[15]);
        pitcher.H = util.safeParseInt(rowArray[16]);
        pitcher.R = util.safeParseInt(rowArray[17]);
        pitcher.ER = util.safeParseInt(rowArray[18]);
        pitcher.HR = util.safeParseInt(rowArray[19]);
        pitcher.BB = util.safeParseInt(rowArray[20]);
        pitcher.IBB = util.safeParseInt(rowArray[21]);
        pitcher.SO = util.safeParseInt(rowArray[22]);
        pitcher.HBP = util.safeParseInt(rowArray[23]);
        pitcher.BK = util.safeParseInt(rowArray[24]);
        pitcher.WP = util.safeParseInt(rowArray[25]);
        pitcher.BF = util.safeParseInt(rowArray[26]);
        pitcher.ERA_P = util.safeParseInt(rowArray[27]);
        pitcher.FIP = util.safeParseFloat(rowArray[28]);
        pitcher.WHIP = util.safeParseFloat(rowArray[29]);
        pitcher.HR_9 = util.safeParseFloat(rowArray[28]);
        pitcher.BB_9 = util.safeParseFloat(rowArray[29]);
        pitcher.SO_9 = util.safeParseFloat(rowArray[28]);
        pitcher.SO_W = util.safeParseFloat(rowArray[29]);
        pitcher.pitcherType = pitcher.GS / pitcher.G > 0.75 ? "SP" : "RP"
        return pitcher;
      },

      _csvToPlayers = function(csv, playerType) {
        var simpleArr = util.CSVParser.toArray(csv, true);
        var players = [];
        for (var i = 0; i < simpleArr.length; i++) {
          var p = _PLAYER_TYPE_PITCHER == playerType ?
              _csvRowToPitcher(simpleArr[i]) :
              _csvRowToBatter(simpleArr[i]);
          try {
            if (null !== p && p.getPlayerType() == playerType) {
              players.push(p);
            }
          }
          catch (e) {
            console.log(e);
          }
        }
        return players;
      };

  /** public */
  return {
    csvToBatters: function(csv) {
      return _csvToPlayers(csv, _PLAYER_TYPE_BATTER);
    },

    csvToPitchers: function(csv) {
      return _csvToPlayers(csv, _PLAYER_TYPE_PITCHER);
    }
  }
})();