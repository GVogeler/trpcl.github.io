var ZIMT = ZIMT || {};

ZIMT.UTILS = ZIMT.UTILS || {};

/**
 * compFacetCount
 * 
 * compares the facetcout of two facets a and b. 
 * purpose use with Array.sort() 
 * 
 * @param a
 * @param b
 * @returns {Number}
 */

ZIMT.UTILS.compFacetCount = function( a, b ) {

    if(a.c > b.c) {return -1};
    if(a.c < b.c) {return 1};

    return 0;
}

/**
 * compMenu
 * 
 * Lifert die Sortierung für das linke Menü
 * .on
 * .c
 * (.displayname spielt hier keine Rolle)
 * 
 * @param a
 * @param b
 * @returns {Number}
 */

ZIMT.UTILS.compMenu = function(a, b) {

    if (a.on != b.on)
    {
        if ((a.on) && (!b.on))
        {
            return -1;
        } else
        {
            return 1;
        }
    } else
    {
        if (a.c > b.c)
        {
            return -1;
        } else if (a.c < b.c)
        {
            return 1;
        } else
        {
            return 0;
        }
    }

    return 0;
}


//ZIMT.UTILS.compMore = function(a, b) {
//
//    if (a.on != b.on)
//    {
//        if ((a.on) && (!b.on))
//        {
//            return -1;
//        } else
//        {
//            return 1;
//        }
//    } else
//    {
//        if (a.displayname > b.displayname)
//        {
//            return 1;
//        } else if (a.displayname < b.displayname)
//        {
//            return -1;
//        } else
//        {
//            return 0;
//        }
//    }
//
//    return 0;
//}


/**
 * isObjEmpty
 * 
 * test if Object is empty
 * 
 * @param obj
 * @returns {Boolean}
 */
ZIMT.UTILS.isObjEmpty = function( obj ) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

ZIMT.UTILS.isObjNOTEmpty = function( obj ) {
    return !ZIMT.UTILS.isObjEmpty ( obj );
} 

ZIMT.UTILS.initCollapse = function() {
    var __k, __v;
//    console.log( "initCollapse" );

    for (__k in ZIMT.DATA.StartValues.jCollapse) {
        __v = ZIMT.DATA.StartValues.jCollapse[__k];

        if (__v == "off")
        {
            jQuery( "#"+__k ).collapse( 'hide' );
        } else
        {
            jQuery( "#"+__k ).collapse( 'show' );
        }
    }

}

//============================================================================
// url params
//============================================================================

ZIMT.UTILS.UrlParams = ZIMT.UTILS.UrlParams || {};

ZIMT.UTILS.UrlParams.objParams = {};
ZIMT.UTILS.UrlParams.isParsed = false; //singelton

ZIMT.UTILS.UrlParams.init = function( urlSearch ) {
    if(ZIMT.UTILS.UrlParams.isParsed) {
        return;
    }
    ZIMT.UTILS.UrlParams.isParsed = true;

    var match;
    var pl = /\+/g;
    var search = /([^&=]+)=?([^&]*)/g;
    var decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
    var query  = urlSearch.substring(1);

    while(match = search.exec(query)) {
        ZIMT.UTILS.UrlParams.objParams[decode( match[1] )] = decode( match[2] );
    }

    // fallback
    if(!ZIMT.UTILS.UrlParams.objParams.hasOwnProperty( "locale" )) {
        ZIMT.UTILS.UrlParams.objParams.locale = ZIMT.DATA.DefaultValues.strDefaultLang;
    }
//    console.log( ZIMT.UTILS.UrlParams.objParams );
}



// ============================================================================
//     Facet Manager 
// ============================================================================


/**
 * {
 *    dc_contributor:
 *        {
 *            data:[
 *                {
 *                    name: "Universit�tsbibliothek",
 *                    displayname: "",
 *                    c: 428,
 *                    on: true
 *                    fq: 'dc_contributor:"Universit�tsbibliothek"'
 *                    f:"dc_contributor"
 *                },
 *                {
 *                    name: "Franz-Nabl-Institut f�r Literaturforschung",
 *                    displayname: "",
 *                    c: 428,
 *                    on: true
 *                }
 *            ],
 *            type: "field",
 *            allselected: false   // NEU true wenn alle facetten der gruppe auf on
 *        }
 * }
*/

ZIMT.UTILS.FacetManager = function() {
    this.__list = {}; // Liste aller Facetten mit aktuellen daten.
}

/**
 * sortGrp
 * 
 * @param grp group
 */
ZIMT.UTILS.FacetManager.prototype.sortGrp = function( grp ) {
    var __data = this.__list[grp].data; // data ist vom type array

    __data.sort( ZIMT.UTILS.compMenu );
}


/**
 * Exists item in Group
 * 
 * @param data (one facet group)
 * @parma name Name of the Item
 * 
 * @return item / false
 */

ZIMT.UTILS.FacetManager.prototype.itemExists = function( data, name) {
    // data : Array
    for (var i = 0; i < data.length; i++) {
        if(data[i].name === name) {
            return data[i];
        }
    }
    return false;
}

/**
 * push Item
 * 
 * Wenn die Gruppe nicht existiert wird sie angelegt
 * Wenn der Item nicht existiert wird er angelegt sonst nur der counter verändert.
 * 
 * @param type
 * @param grp
 * @param name
 * @param c counter
 */

ZIMT.UTILS.FacetManager.prototype.pushItem = function( type, grp, name, c) {
    this.setGroup( type, grp );
    this.setItem(grp, name, c);
}

/**
 * Wenn der item nicht existiert wird er angelegt, sonst wird nur c ver�ndert
 * 
 * @param grp
 * @param name
 * @param c counter
 */

ZIMT.UTILS.FacetManager.prototype.setItem = function (grp, name, c) {
    var __data = this.__list[grp].data;
    var __item = this.itemExists(__data, name);

    if(!__item) {
        __data.push({
        "name":name,
        "displayname": ZIMT.DATA.Session.langMgr.mkDisplayname( grp, name ),
        "c":c,
        "on": false,
        "fq": grp + ":" + name,
        "f": grp
        })
    }
    else {
        __item.c=c;
    }

}

ZIMT.UTILS.FacetManager.prototype.setItemOn = function ( grp, name ) {
    var type = "field";
    this.setGroup( type, grp )
    var __fieldData = this.__list[grp].data; // arr
    var __item = this.itemExists(__fieldData, name);

    if(!__item) {
        __fieldData.push({
        "name":name,
        "displayname": ZIMT.DATA.Session.langMgr.mkDisplayname( grp, name ),
        "c":0,
        "on": true,
        "fq": grp + ":" + name,
        "f": grp
        });
    }
    else {
        __item.on = true;
    }

}

ZIMT.UTILS.FacetManager.prototype.setItemOff = function( grp , name ) {
    var type = "field";
    this.setGroup( type, grp )
    var __fieldData = this.__list[grp].data; // arr
    var __item = this.itemExists(__fieldData, name);

    if(__item) { __item.on = false;}
}

/**
 * set up a Group of a given type
 * 
 * @param type Grouptyp e.g. "field" fieldfacet
 * @param grp  Groupname e.g. "dc_contributor"
 * 
 * @return false group allready exists/ true group was set up
 */
ZIMT.UTILS.FacetManager.prototype.setGroup = function( type, grp ) {
    if (this.__list.hasOwnProperty( grp )) 
    {
        return false;
    }
    else 
    {
        this.__list[grp] = { "data":[], "type":type, allselected: false } // NEU NEU NEU
        return true
    }
}


ZIMT.UTILS.FacetManager.prototype.toggleFacet = function(grp, name) {
    
    var __on = this.itemExists(this.getGroupData(grp), name);
// TODO: Dar�ber bei Zeiten nachdenken. Was passiert wenn der item nicht existiert.
    if (__on.on) {
        __on.on=false;
    } else {
        __on.on=true;
    }
}


ZIMT.UTILS.FacetManager.prototype.toggleGroupOn = function( grp ) {
    this.setGroup( "field", grp);

    var on = !this.isGroupAllselected( grp ); // NEU NEU NEU
    this.setGroupAllselected( grp, on );
    
    for (var i = 0; i < this.__list[grp].data.length; i++) {
        var f = this.__list[grp].data[i];
        // TODO: Das ein und aus schalten einer Facette 
        // muss unbedingt in eine eigene Funktion!!! (setItemOn)
        // (hmm... wenn item aus dem amodel kommt, ist davon auszugehen dass er existiert in __list)
        f.on = on;
    }
}

ZIMT.UTILS.FacetManager.prototype.setGroupOn = function( grp, on ) {
    this.setGroup( "field", grp);

    this.setGroupAllselected( grp, on );

    for (var i = 0; i < this.__list[grp].data.length; i++) {
        var f = this.__list[grp].data[i];
        // TODO: Das ein und aus schalten einer Facette 
        // muss unbedingt in eine eigene Funktion!!! (setItemOn)
        // (hmm... wenn item aus dem amodel kommt, ist davon auszugehen dass er existiert in __list)
        f.on = on;
    }
}


ZIMT.UTILS.FacetManager.prototype.setAllGroupsOn = function( on ) {
    var __fildFacets = ZIMT.DATA.DefaultValues.arrFildFacets;  // Liste mit den zu facetierenden Feldern

    for (var i = 0; i < __fildFacets.length; i++) {
        var __accGroup = __fildFacets[i];
        console.log( __accGroup + " -- " + on );
        this.setGroupOn( __accGroup, on );
    }

}

/**
 * get Group Data
 * 
 * @param grp Groupname
 * 
 * @return Array :[
 *              {
 *                  name: "Universit�tsbibliothek",
 *                  c: 428,
 *                  on: true
 *              },
 *              {
 *                  name: "Franz-Nabl-Institut f�r Literaturforschung",
 *                  c: 428,
 *                  on: true
 *              }
 *          ]
 */
ZIMT.UTILS.FacetManager.prototype.getGroupData = function( grp ) {
    if (this.__list[grp] === undefined) {
//        console.log("Error Group " + grp + " is empty!");
        return [];
    } else {
        return this.__list[grp].data;
    }
    return [];
}


ZIMT.UTILS.FacetManager.prototype.isGroupAllselected = function( grp ) {
    if (this.__list[grp] === undefined) {
//      console.log("Error isGroupAllselected " + grp + " is empty!");
      return false;
  } else {
      return this.__list[grp].allselected;
  }
}

ZIMT.UTILS.FacetManager.prototype.setGroupAllselected = function( grp, on ) {
    if (this.__list[grp] === undefined) {
      console.log("Error setGroupAllselected " + grp + " is empty!");
  } else {
      this.__list[grp].allselected = on;
  }
}


/**
 * get Group Metadata
 * 
 * @param grp Groupname
 * 
 * @return {
 *           all: [Anz. der         Facetten pro Gruppe],
 *           on:  [Anz. der aktiven Facetten pro Gruppe],
 *           bon: true/false (true sobald mind. eine Facette aktiv ist.)
 *         }
 */
ZIMT.UTILS.FacetManager.prototype.getGroupMetaData = function( grp ) {
    var result = {};
    var nrOn = 0;
    var bOn = false;
    
    if (this.__list[grp] === undefined) {
      console.log("Error Metadata Group " + grp + " is empty!");
      return [];
    } else 
    {
      for (var i = 0; i < this.__list[grp].data.length; i++) {
          if (this.__list[grp].data[i].on) {
            nrOn++;
          }
      }
      if(nrOn>0) { bOn=true; }

      result.all = this.__list[grp].data.length;
      result.on = nrOn;
      result.bon = bOn;

      
//      console.log(result);
      
      return result;
    }
  return []; // quanten magic
}


/**
 * get Filter Queries depending on a given group
 * 
 * @param grp groupname
 * 
 * @return string
 */
ZIMT.UTILS.FacetManager.prototype.getFilterQueries = function( grp ) {
    var __fildFacets = ZIMT.DATA.DefaultValues.arrFildFacets;  // Liste mit den zu facetierenden Feldern
    var __fqCollection = new ZIMT.UTILS.FilterQueryString();   // Filter Query Collection
    
    
    for (var i = 0; i < __fildFacets.length; i++) {
        var __accGroup = __fildFacets[i];
        var __accGroupData; // Array
        
        __accGroupData = this.getGroupData(__accGroup);

        if(grp != __accGroup) {
            for (var j = 0; j < __accGroupData.length; j++) {
                var __tmp = __accGroupData[j];
                
                if (__tmp.on) {
                    __fqCollection.pushItem( __tmp.f, __tmp.name );
                }
            }
        }
    }

    return __fqCollection.getString();
}


/**
 * getGroupSelectedItems
 * 
 * @param grp groupname
 * 
 * @returns array selectet items [array/strings]
 */
ZIMT.UTILS.FacetManager.prototype.getGroupSelectedItems = function( grp ) {
    var __arrItems = [];
    var __grpData = this.getGroupData( grp );
    
    for (var i = 0; i < __grpData.length; i++) {
        var __tmp = __grpData[i];
        if(__tmp.on){
            __arrItems.push( __tmp.name );
        }
    }
    
    return __arrItems;
}

// === Debug Facet Manager ====================================================

ZIMT.UTILS.FacetManager.prototype.serializeData = function() {
    console.log(JSON.stringify(this.__list));
//    console.log( this.__list );
}

/**
 * Debug Data
 */
ZIMT.UTILS.FacetManager.prototype.setDebugData = function() {
    this.__list["dc_contributor"] = {};
    this.__list["dc_contributor"]["data"] = [];
    this.__list["dc_contributor"]["type"] = "fieldfacet";
    this.__list["dc_contributor"]["data"].push( {
            name: "Universit�tsbibliothek",
            c: 428,
            on: true
    });
    this.__list["dc_contributor"]["data"].push( {
            name: "Franz-Nabl-Institut f�r Literaturforschung",
            c: 428,
            on: true
    });

}


//============================================================================
//    FilterQueryString
//============================================================================


/**
 * Collecting all elements of a filter query
 */
ZIMT.UTILS.FilterQueryString = function() {
    this.__queryArr = [];
}

ZIMT.UTILS.FilterQueryString.prototype.pushItem = function( filed, str) {
    this.__queryArr.push([filed, str]);
}
/**
 * get FieldCount
 * 
 * Wie oft kommt ein Feld in dem Array vor? (Das Array ist nach Field sortiert.)
 * 
 * @param arr
 * 
 * @param pos Position an der Field das erste mal vorkommt.
 * 
 * @returns {Number} Zählung begint bei 0! 
 */
ZIMT.UTILS.FilterQueryString.prototype.getFieldCount = function( arr, pos ) {
    var __type = arr[pos][0];
    var __intTmp = 0;
    for (var i = (pos+1); i < arr.length; i++) {
        if(__type == arr[i][0]) {
            __intTmp++
        }
        else {
            break;
        }
        
    }

    // Zählung begint bei 0! 
    // Wie bei array indizes.
    return __intTmp;
}

//Ok innerhalb der Gruppe "OR" über die Gruppengrenze hinweg aber "AND"!!!
ZIMT.UTILS.FilterQueryString.prototype.getString = function() {

    if(this.__queryArr.length > 0)
    {
        var __fieldCount = 0; // int

        this.__result = "&fq=";
        this.__tmp = ""

        for(var i = 0; i < this.__queryArr.length; i++) {
            this.__tmp += "(";
            var __item = this.__queryArr[i];
            __fieldCount = this.getFieldCount( this.__queryArr, i);
            if (__fieldCount == 0) {
                this.__tmp += __item[0] + ':"' + __item[1] + '"';
            } else { 
                for (var j = 0; j < (__fieldCount+1); j++) {
                    __item = this.__queryArr[i+j];
                    this.__tmp += __item[0] + ':"' + __item[1] + '"';
                    if(j < __fieldCount) { this.__tmp += " OR "; }
                }
                i += __fieldCount;
            }
            this.__tmp += ")";
            if(i < (this.__queryArr.length-1))  { this.__tmp += " AND "; }
      }

        this.__tmp = encodeURIComponent( this.__tmp );
        this.__result += this.__tmp;
        return this.__result;

    }
    else {
        return "";
    }
}


var ZIMT = ZIMT || {};

ZIMT.UTILS = ZIMT.UTILS || {};


ZIMT.UTILS.TimeManager = function() {
    this.__timeData = [-350, 2020]; // Fallback
    if(ZIMT.DATA.StartValues.timeRangeMin !== undefined) {
        this.__timeData[0] = ZIMT.DATA.StartValues.timeRangeMin;
    }
    if(ZIMT.DATA.StartValues.timeRangeMax !== undefined) {
        this.__timeData[1] = ZIMT.DATA.StartValues.timeRangeMax;
    }
}

ZIMT.UTILS.TimeManager.prototype.serializeData = function() {
    console.log( "{min:" + this.__timeData[0] + ",max:" + this.__timeData[1] + "}" );
}


ZIMT.UTILS.TimeManager.prototype.setMin = function( intMin ) {
    this.__timeData[0] = intMin;
}

ZIMT.UTILS.TimeManager.prototype.getMin = function() {
    return this.__timeData[0];
}

ZIMT.UTILS.TimeManager.prototype.setMax = function( intMax ) {
    this.__timeData[1] = intMax;
}

ZIMT.UTILS.TimeManager.prototype.getMax = function() {
    return this.__timeData[1];
}

ZIMT.UTILS.TimeManager.prototype.setTime = function( intArr ) {
    this.__timeData[0] = intArr[0];
    this.__timeData[1] = intArr[1];
}


ZIMT.UTILS.TimeManager.prototype.getFilterQueries = function( bRangeOn ) {

    // Bei deaktiviertem TimeRange ist dieser String leer. 
    // (Wir suchen ohne Zeiteinschränkung)
    if(!bRangeOn) {
        return "";
    }

    // Bei gleichstand hinteren Wert erhöhen.
    if (this.__timeData[0] == this.__timeData[1]) { 
        this.__timeData[1]++;
    }

    // Reihenfolge immer ordnen.
    if (this.__timeData[0] < this.__timeData[1]) {
        return "&fq={!field f=dct_created_yearrange op=Intersects}[" + this.__timeData[0] + " TO " + this.__timeData[1] + "]";
    } else {
        return "&fq={!field f=dct_created_yearrange op=Intersects}[" + this.__timeData[1] + " TO " + this.__timeData[0] + "]";
    }

}

// ============================================================================
// TimeRangeVisibilityManager
// ============================================================================

ZIMT.UTILS.TimeRangeVisibilityManager = function() {
    // this.__classVisibility;
}

ZIMT.UTILS.TimeRangeVisibilityManager.prototype.init = function( cV ) {
    // In JS können keine pointer auf strings in einem JS Objekt
    // übergeben werden. Nur Objekte und Arrays.
    // Daher this.__classVisibility.timerangeOnClass
    this.__classVisibility = cV;
}

ZIMT.UTILS.TimeRangeVisibilityManager.prototype.setShow = function() {
    this.__classVisibility.timerangeOnClass = "show";
}

    ZIMT.UTILS.TimeRangeVisibilityManager.prototype.setHide = function() {
        this.__classVisibility.timerangeOnClass = "hide";
    }

ZIMT.UTILS.TimeRangeVisibilityManager.prototype.debug = function() {
    console.log( this.__classVisibility.timerangeOnClass );
}


var ZIMT = ZIMT || {};

ZIMT.UTILS = ZIMT.UTILS || {};

ZIMT.UTILS.Querytext = ZIMT.UTILS.Querytext = function() {
	
	// === Const ==========================================================
	this.ENCODE = true;
	this.DONOTENCODE = false;

	this.ISQUERY    = true;
	this.ISNOTQUERY = false;  // Z.B. Zitat

	// === pseudo privat ===
	this.__bFirstTextQuery = true;
	this.__bIsHighlight = false;

	ZIMT.UTILS.initCollapse();

}

/**
 * 
 * @param strQ
 * @param bEncoded if true encode strQ
 * 
 * @returns querytext for solr
 */

ZIMT.UTILS.Querytext.prototype.__getTextQuery = function( strQ, bEncoded ) {
    var __tmp = "";
    if(!strQ) 
    {
        return "*";
    }
    else{
        // Den Doppelpunkt escapen
        __tmp = strQ.replace( ":", "\\:" );

        // Der Suchstring liegt zentral in rxData.query uncodiert
        // und nur wird hier codiert
        if(bEncoded) {
//            console.log( encodeURIComponent( __tmp ) );
            return encodeURIComponent( __tmp );
        }
        else
        {
            return strQ;
        }
        
    }
}


ZIMT.UTILS.Querytext.prototype.__getStartQueryPids = function() {
    if( (ZIMT.DATA.StartValues.arrStartQuery === undefined) ||
         ZIMT.DATA.StartValues.arrStartQuery.length == 0) {
        this.__bIsHighlight = false;
        return "*:*";
    }
    var tmp = ZIMT.DATA.StartValues.arrStartQuery[0];
    if(ZIMT.DATA.StartValues.arrStartQuery.length == 1) {
        return encodeURIComponent( tmp );
    }
    for (var i = 1; i < ZIMT.DATA.StartValues.arrStartQuery.length; i++) {
        var array_element = ZIMT.DATA.StartValues.arrStartQuery[i];
        tmp += " OR ";
        tmp += ZIMT.DATA.StartValues.arrStartQuery[i];
    }
    return encodeURIComponent( tmp );
}


// === pseudo public ===========================================================
ZIMT.UTILS.Querytext.prototype.getTextQuery4Query = function( strQ, bEncoded, bIsQuery ) {
    // strQ kommt hier immer uncodiert an. 

    if(this.__bFirstTextQuery)
    {
    	if (bIsQuery) {
    		this.__bFirstTextQuery = false;
            this.__bIsHighlight = true;
		}
        return this.__getStartQueryPids();
    }
    else
    {
        this.__bIsHighlight = false;
        return this.__getTextQuery( strQ, bEncoded );
    }
}

ZIMT.UTILS.Querytext.prototype.getTextQuery4Facet = function( strQ, bEncoded ) {
    return this.__getTextQuery( strQ, bEncoded );
}

ZIMT.UTILS.Querytext.prototype.isHighlight = function() {
    return this.__bIsHighlight;
}

ZIMT.UTILS.Querytext.prototype.turnOffHighlight = function() {

    this.__bFirstTextQuery = false;
    this.__bIsHighlight = false;
}

// dirty dirty dirty!
ZIMT.UTILS.Querytext.prototype.turnOnHighlight = function() {

    this.__bFirstTextQuery = true;
    this.__bIsHighlight = true;
}


/**
 * Configur Highlights
 * 
 * @param lObj location search object
 */
//DERZEIT NICHT IN VERWENDUNG
//ZIMT.UTILS.Querytext.prototype.configureHighlights = function( lObj ) {
//    if(ZIMT.UTILS.isObjNOTEmpty( lObj )) {
//        this.turnOffHighlight();
//    }
//}
var ZIMT = ZIMT || {};

ZIMT.UTILS = ZIMT.UTILS || {};


ZIMT.UTILS.PaginationManager = function() {
	this.__iStepSize = ZIMT.DATA.DefaultValues.iPagStepSize; // Anz der Items pro Page
	this.__nrVisPages = 7; // Anz. der in der Paginierung sichtbaren Seiten
	this.__nrPages = 0;
	this.__currentPage = 0;
	
	
	this.enumMode = {
		FIRST: 0,
		LAST: 1,
		IN: 2,
		SHORT: 3
	};
	
	this.__mode = this.enumMode.FIRST;
}

ZIMT.UTILS.PaginationManager.prototype.init = function() {
	this.__currentPage = 0;
}


/**
 * 
 * @param nrItems    Anz. der Items
 * @param currPage   die aktuelle Seite
 */

ZIMT.UTILS.PaginationManager.prototype.reset = function( nrItems, currPage ) {
	this.__nrPages = Math.ceil(nrItems/this.__iStepSize );
	
	this.decideType();
//	console.log( "Mode: " + this.__mode );
}

/**
 * set
 * 
 * Setzt die aktuelle Seite auf n
 * 
 * @param n     Nr. der aktuellen Seite (beginnend bei 0)
 */

ZIMT.UTILS.PaginationManager.prototype.set = function( n ) {
	this.__currentPage = n;
//	console.log( "current page: " + this.__currentPage );
}

ZIMT.UTILS.PaginationManager.prototype.up = function() {
	if (this.__currentPage < (this.__nrPages-1)) {
		this.__currentPage++;
	}
	else
	{
		console.log("ERROR PaginationManager: upper bound reached!");
	}
}

ZIMT.UTILS.PaginationManager.prototype.down = function() {
	if (this.__currentPage > 0 ) {
		this.__currentPage--;
	}
	else
	{
		console.log("ERROR PaginationManager: lower bound reached!");
	}
}

ZIMT.UTILS.PaginationManager.prototype.first = function() {
	
}

ZIMT.UTILS.PaginationManager.prototype.last = function() {
	
}

/**
 * Get Current Pagination
 * 
 * @returns {___anonymous1282_1283}
 * json Obj describing current pagination
 * {
 *    pag:
 *    [
 *      {
 *        page:1,
 *        link: "abc",
 *        nr:0
 *      },
 *      {
 *        page:2,
 *        link: "def",
 *        nr:1
 *      }
 *    ],
 *    pagvis: true
 * }
 */

ZIMT.UTILS.PaginationManager.prototype.getCurrPag = function() {
	var __result = { pag:[], pagvis: true};
	var __begin = {page:"«", link:"down", nr:0};
	var __end   = {page:"»", link:"up", nr:0};
	var __sp   = {page:"..", link:"..", nr:0};
	
	
	if(this.__isSinglePage()) __result.pagvis = false;
	
	if(this.__mode === this.enumMode.FIRST) {
		__result.pag.push( __begin );
		this.__getNumberItems( __result.pag );
		__result.pag.push( {page:"..", link:"..", nr:0} );
		__result.pag.push( __end );
	}
	else if (this.__mode === this.enumMode.LAST) 
	{
		__result.pag.push( __begin );
		__result.pag.push( {page:"..", link:"..", nr:0} );
		this.__getNumberItems( __result.pag );
		__result.pag.push( __end );
	}
	else if (this.__mode === this.enumMode.IN) 
	{
		__result.pag.push( __begin );
		__result.pag.push( {page:"..", link:"..", nr:0} );
		this.__getNumberItems( __result.pag );
		__result.pag.push( {page:"..", link:"..", nr:0} );
		__result.pag.push( __end );
	}
	else if (this.__mode === this.enumMode.SHORT) 
	{
		__result.pag.push( __begin );
		this.__getNumberItems( __result.pag );
		__result.pag.push( __end );
	}

	// test
//	__result.pag.push( __begin );
//	__result.pag.push( __sp );
//	__result.pag.push( {page:"..", link:"..", nr:7} );
//	__result.pag.push( {page:"..", link:"..", nr:7} );
//	this.__getNumberItems( __result.pag );
//	__result.pag.push( __sp );
//	__result.pag.push( __end );
//	console.log( __result );
	return __result;
}

/**
 * Get Current Page
 * 
 * Get the nuber of the current page. Starting with 0.
 * 
 */

ZIMT.UTILS.PaginationManager.prototype.getCurrPage = function() {
	return this.__currentPage;
}

ZIMT.UTILS.PaginationManager.prototype.getQuery = function() {
	var __first = this.__currentPage * this.__iStepSize;
//	console.log( "&start=" + __first + "&rows=" + this.__iStepSize );

	return "&start=" + __first + "&rows=" + this.__iStepSize;
}

ZIMT.UTILS.PaginationManager.prototype.__getItemText = function(i) {
	var tmp = {};
	tmp.page = (i+1);
	tmp.link = "set";
	tmp.nr = i;

	if(i == this.__currentPage) {
		tmp.class = "active"
	}

	return tmp;
}


ZIMT.UTILS.PaginationManager.prototype.__getNumberItems = function( arr ) {
	
	if(this.__mode === this.enumMode.FIRST) 
	{
		for (var i = 0; i < this.__nrPages; i++) {
			arr.push( this.__getItemText(i) );
			if ((i+1)>=this.__nrVisPages) break;
		}
	}
	else if (this.__mode === this.enumMode.LAST) 
	{
		var start = this.__nrPages - this.__nrVisPages
		for (var i = start; i < this.__nrPages; i++) {
			arr.push( this.__getItemText(i) );
			if ((i+1)>=this.__nrPages) break;
		}
	}
	else if (this.__mode === this.enumMode.IN) 
	{
		var start = this.__currentPage - 3; // 3 ... nrVisPages/2
		for (var i = start; i < this.__nrPages; i++) {
			arr.push( this.__getItemText(i) );
			if ((i+1)>=(this.__nrVisPages+start)) break;
		}
	}
	else if (this.__mode === this.enumMode.SHORT) 
	{
		for (var i = 0; i < this.__nrPages; i++) {
			arr.push( this.__getItemText(i) );
		}
	}
}

ZIMT.UTILS.PaginationManager.prototype.decideType = function() {
	if (this.__nrPages <= this.__nrVisPages) 
	{
		this.__mode = this.enumMode.SHORT;
	} 
	else if (this.__currentPage < (this.__nrVisPages-1))
	{
		this.__mode = this.enumMode.FIRST;
	} 
	else if (this.__currentPage > (this.__nrPages - this.__nrVisPages)) 
	{
		this.__mode = this.enumMode.LAST;
	} 
	else 
	{
		this.__mode = this.enumMode.IN;;
	}
}


ZIMT.UTILS.PaginationManager.prototype.__isSinglePage = function() {
	if(this.__nrPages == 1)
	{
		return true;
	} else {
		return false;
	}
}

// === general call from app ==================================================

ZIMT.UTILS.PaginationManager.prototype.onEV = function( str, n ) {
//	console.log( str + "  " + n );
	if (str === "up") {
//		console.log( "call up" );
		this.up();
	} else if (str == "down") {
//		console.log( "call down" );
		this.down();
	} else if (str == "set") {
//		console.log( "call set " + n );
		this.set( n );
	}
}
















var ZIMT = ZIMT || {};

ZIMT.UTILS = ZIMT.UTILS || {};


/**
 * {
 *     dc_type:
 *         {
 *             on: false,
 *             order: "asc",     #[asc/desc]
 *             name: "dc_type"
 *         },
 *     edm_place:
 *         {},
 *     dct_isPartOf:
 *         {}
 * }
 */

ZIMT.UTILS.SortManager = function( arrSA ) {
	this.__list = {};
	this.__arrSA = arrSA;
}

/**
 * __isItemSA
 * 
 * @param itmeSA
 * 
 * @returns boolean
 */

ZIMT.UTILS.SortManager.prototype.__isItemSA = function( itemSA ) {
	return this.__list.hasOwnProperty( itemSA );
}

// ============================================================

/**
 * init Sort Manager
 * 
 * @param arrSA  array searchables
 */

ZIMT.UTILS.SortManager.prototype.init = function() {
	var i = 0;

	for (i = 0; i < this.__arrSA.length; i++) {
		this.setSA( this.__arrSA[i] );
	}
}

/**
 * set Serachable
 * 
 * @param itemSA  name of sa
 * 
 * @retruns false if item exists
 */

ZIMT.UTILS.SortManager.prototype.setSA = function( itemSA) {
	if (this.__isItemSA( itemSA )) {
		return false;
	} else {
		this.__list[itemSA] = {};
		this.__list[itemSA]["on"] = false;
		this.__list[itemSA]["order"] = "asc";
		this.__list[itemSA]["name"] = itemSA;
		return true;
	}
}


ZIMT.UTILS.SortManager.prototype.getSAData = function( itemSA ) {
	var result  = {};
	var tmp;
	
	if (this.__isItemSA( itemSA )) {
		tmp = this.__list[itemSA];
		result["sa"] = true;
		result["on"]    = tmp.on;
		result["order"] = tmp.order;
		result["name"]  = tmp.name;
	} else {
		result["sa"] = false;
	}
	return result;
}

// === logic ===

ZIMT.UTILS.SortManager.prototype.toggleOrder = function( iName ) {
	if (!this.__isItemSA( iName )) {
		console.log( iName + "existiert nicht!" );
		return false;
	}

	if (this.getOrder( iName ) == "asc")
	{
		this.setOrder( iName, "desc" );
	}
	else
	{
		this.setOrder( iName, "asc" );
	}
}

ZIMT.UTILS.SortManager.prototype.toggleItem = function(iName) {
    if (!this.__isItemSA(iName))
    {
        console.log(iName + "existiert nicht!");
        return false;
    }

    if (this.isItemOn(iName))
    {
        this.unsetAll();
    } else
    {
        this.unsetAll();
        this.setItem(iName);
    }
}

ZIMT.UTILS.SortManager.prototype.unsetAll = function() {
	var i = 0;

	for (i = 0; i < this.__arrSA.length; i++) {
		this.unsetItem( this.__arrSA[i] );
		// TODO: für differenzierteres resetten unset verdoppeln:
		//       mit und ohne reihenfolge
		this.setOrder( this.__arrSA[i], "asc" );
	}
}

ZIMT.UTILS.SortManager.prototype.isItemOn = function( iName ) {
	if (this.__isItemSA( iName )) {
		return this.__list[iName].on ? true : false;
	} else {
		console.log( iName + "existiert nicht!" );
		return false;
	}
}

ZIMT.UTILS.SortManager.prototype.setItem = function( iName ) {
	if (this.__isItemSA( iName )) {
		this.__list[iName].on = true;
	} else {
		console.log( iName + "existiert nicht!" );
	}
}

ZIMT.UTILS.SortManager.prototype.unsetItem = function( iName ) {
	if (this.__isItemSA( iName )) {
		this.__list[iName].on = false;
	} else {
		console.log( iName + "existiert nicht!" );
	}
}

ZIMT.UTILS.SortManager.prototype.setOrder = function( iName, iOrder ) {
    this.__list[iName].order = iOrder;
}

ZIMT.UTILS.SortManager.prototype.getOrder = function( iName ) {
    return this.__list[iName].order;
}


ZIMT.UTILS.SortManager.prototype.getSortQuery = function() {
	var __bYesWeSort = false
	var __tmp = "&sort=";
	var __arrTmp = Object.keys( this.__list );
	var i = 0;

	for (i = 0; i < __arrTmp.length; i++) {
		if (this.isItemOn( __arrTmp[i] )) {
			__tmp += __arrTmp[i] + " " + this.__list[__arrTmp[i]].order;
			__bYesWeSort = true;
		}
	}

	if (__bYesWeSort) 
	{
		__tmp += ",score desc";
		return __tmp;
	}
	else 
	{
		return "";
	}
}

ZIMT.UTILS.SortManager.prototype.getSort = function() {
	var __bYesWeSort = false
	var __arrTmp = Object.keys( this.__list );
	var __tmp = {};
	
	for (i = 0; i < __arrTmp.length; i++) {
		if (this.isItemOn( __arrTmp[i] )) {
			__tmp.name = this.__list[__arrTmp[i]].name;
			__tmp.order = this.__list[__arrTmp[i]].order;
			__bYesWeSort = true;
		}
	}
	
	if (__bYesWeSort) 
	{
		return __tmp;
	}
	else
	{
		return false;
	}
}

// == DEBUG ==================================================
ZIMT.UTILS.SortManager.prototype.serializeData = function() {
	console.log( JSON.stringify( this.__list ) );
}

//ZIMT.UTILS.SortManager.prototype.setDebugData = function() {
//	console.log("setDebugData");
//	this.__list["dc_type"] = {};
//	this.__list["dc_type"]["on"] = true;
//	this.__list["dc_type"]["order"] = "asc";
//
//	this.__list["edm_place"] = {};
//	this.__list["edm_place"]["on"] = false;
//	this.__list["edm_place"]["order"] = "asc";
//
////	this.__list["dct_isPartOf"] = {};
////	this.__list["dct_isPartOf"]["on"] = false;
////	this.__list["dct_isPartOf"]["order"] = "asc";
//}


var ZIMT = ZIMT || {};

ZIMT.UTILS = ZIMT.UTILS || {};


ZIMT.UTILS.Lang = function() {
//    console.log( "construchtor Language Manager" );

    this.__lang = "";
    this.__htLang = {};             // Sprache
    this.__htLangFallback = {};
    this.__htColl = {};             // Sammlung dct_isPartOf
    this.__htCollFallback = {};
    this.__htInst = {};             // Institution dc_publisher
    this.__htInstFallback = {};
    this.__htDep = {};              // Abteilung dc_contributor
    this.__htDepFallback  = {};
    this.__htMed = {};             // Material dct_medium
    this.__htMedFallback = {};
    this.__htType = {};             // Kategorie dc_type
    this.__htTypeFallback = {};
    this.__htTemp = {};             // Periode dct_temporal
    this.__htTempFallback = {};


}

ZIMT.UTILS.Lang.prototype.init = function( lang ) {
//    console.log( "Language Manager initializing: " + lang );
    this.__lang = lang;
    this.__htLangFallback = ZIMT.DATA.StartValues.strLangDe;
    this.__htCollFallback = ZIMT.DATA.StartValues.strCollDe;
    this.__htInstFallback = ZIMT.DATA.StartValues.strInstDe;
    this.__htDepFallback  = ZIMT.DATA.StartValues.strDepDe;
    this.__htMedFallback  = ZIMT.DATA.StartValues.strMedDe;
    this.__htTypeFallback  = ZIMT.DATA.StartValues.strTypeDe;
    this.__htTempFallback  = ZIMT.DATA.StartValues.strTempDe;


    this.__linkHashTables();
}

ZIMT.UTILS.Lang.prototype.__linkHashTables = function() {

    if(this.__lang == "de") {
        this.__htLang = ZIMT.DATA.StartValues.strLangDe;
        this.__htColl = ZIMT.DATA.StartValues.strCollDe;
        this.__htInst = ZIMT.DATA.StartValues.strInstDe;
        this.__htDep  = ZIMT.DATA.StartValues.strDepDe;
        this.__htMed  = ZIMT.DATA.StartValues.strMedDe;
        this.__htType  = ZIMT.DATA.StartValues.strTypeDe;
        this.__htTemp  = ZIMT.DATA.StartValues.strTempDe;
    } else if (this.__lang == "en") {
        this.__htLang = ZIMT.DATA.StartValues.strLangEn;
        this.__htColl = ZIMT.DATA.StartValues.strCollEn;
        this.__htInst = ZIMT.DATA.StartValues.strInstEn;
        this.__htDep  = ZIMT.DATA.StartValues.strDepEn;
        this.__htMed  = ZIMT.DATA.StartValues.strMedEn;
        this.__htType  = ZIMT.DATA.StartValues.strTypeEn;
        this.__htTemp  = ZIMT.DATA.StartValues.strTempEn;
    } else {
        console.log( "ERROR: NO LANGUAGE SELECTED!" );
    }

}

/**
 * __replace
 * 
 * @param key
 * @param ht
 * @param htFallback
 * 
 * 
 * @return Die übersetzte Resource
 */
ZIMT.UTILS.Lang.prototype.__replace = function( key, ht, htFallback) {
    if (ht[key])
    {
        return ht[key];
    }
    else if (htFallback[key])                               // Fallback Level 1
    {
        if (ZIMT.DATA.DefaultValues.Debug == true) {
            return (htFallback[key] + " -- ERROR: english resource missing");
        }
        else {
            return htFallback[key];
        }
    }
    else                                                    // Fallback Level 2
    {
        if (ZIMT.DATA.DefaultValues.Debug == true) {        // Debug translations
            return (key + " -- ERROR: translation missing");
        }
        else {
            return key;
        }
    }
}

ZIMT.UTILS.Lang.prototype.mkDisplayname = function( grp, name ) {

    // derzeit nur dc_language
    if ("dc_language" == grp) {
        return this.__replace( name, this.__htLang, this.__htLangFallback );
    }
    else if ("dct_isPartOf" == grp) {
        return this.__replace( name, this.__htColl, this.__htCollFallback );
    }
    else if ("dc_publisher" == grp) {
        return this.__replace( name, this.__htInst, this.__htInstFallback );
    }
    else if ("dc_contributor" == grp) {
        return this.__replace( name, this.__htDep, this.__htDepFallback );
    }
    else if ("dct_medium" == grp) {
        return this.__replace( name, this.__htMed, this.__htMedFallback );
    }
    else if ("dc_type" == grp) {
        return this.__replace( name, this.__htType, this.__htTypeFallback );
    }
    else if ("dct_temporal" == grp) {
        return this.__replace( name, this.__htTemp, this.__htTempFallback );
    }
    else {
        return name;
    }



}



// === debug ==================================================================
ZIMT.UTILS.Lang.prototype.debug = function( grp, name ) {
    console.log( "debuging ZIMT.UTILS.Lang");
    console.log( this.__lang );
    console.log( this.mkDisplayname( "dc_language", "deu" ) );
    console.log( this.mkDisplayname( "dc_language", "ita" ) );

}
