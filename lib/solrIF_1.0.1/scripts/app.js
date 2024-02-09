// NO IIFE until we realy need it ;-)

var ZIMT = ZIMT || {};

ZIMT.DATA = ZIMT.DATA || {};
ZIMT.DATA.Session = ZIMT.DATA.Session || {};
ZIMT.DATA.Session.Ist = ZIMT.DATA.Session.Ist || {};

ZIMT.DATA.Session.facetMgr = new ZIMT.UTILS.FacetManager();
ZIMT.DATA.Session.timeMgr = new ZIMT.UTILS.TimeManager();
ZIMT.DATA.Session.pagMgr = new ZIMT.UTILS.PaginationManager();
ZIMT.DATA.Session.queryMgr = new ZIMT.UTILS.Querytext();
ZIMT.DATA.Session.sortMgr = new ZIMT.UTILS.SortManager( ZIMT.DATA.DefaultValues.arrSearchAbles );
ZIMT.DATA.Session.langMgr = new ZIMT.UTILS.Lang(); // muss unbedingt mit einer sprache initialisiert werden.
ZIMT.DATA.Session.trvisMgr = new ZIMT.UTILS.TimeRangeVisibilityManager();

ZIMT.DATA.Session.ctimeSlider = new Slider('#zeitregler', {});

var app = angular.module("ssearch", []);


var DefaultValues = DefaultValues || {};

app.config(function($locationProvider) {
    $locationProvider.html5Mode(false); // das ist der default wert
});

// ============================================================================
// R Data Controller
// ============================================================================


app.controller("RDataController", ["$scope", "$http", "$q", "$location", "$httpParamSerializer", "$interval", "$window",
    function($scope, $http, $q, $location, $httpParamSerializer, $interval, $window) {

    // 
    var rxData = this;
    rxData.result = {};      // Antwort des SolR servers
    rxData.facets = {};      // Liste aller Facetten mit zugehörigen Daten.
    rxData.sas    = {};      // Liste aller Searchables
    rxData.pagination = {};  // Liste anzuzeigender Paginierung
    rxData.timerange = { 
            min: ZIMT.DATA.StartValues.timeRangeMin, 
            max: ZIMT.DATA.StartValues.timeRangeMax
            };
    rxData.stati = {};
    rxData.stati.highlight = false;
    rxData.stati.timerangeON = false;
    rxData.stati.timerangeOnClass = "hide"; // ???
    ZIMT.DATA.Session.trvisMgr.init( rxData.stati );

    rxData.cite = ""; // String der das Zitat enthält

    rxData.result.response = {};  // ???

    // Parse window.location.search (das ist vor dem hash)
    ZIMT.UTILS.UrlParams.init( $window.location.search );
    ZIMT.DATA.Session.langMgr.init( ZIMT.UTILS.UrlParams.objParams.locale );


// ACHTUNG setAttribute und setValue sind NICHT DAS SELBE!
    ZIMT.DATA.Session.ctimeSlider.setAttribute( "min", ZIMT.DATA.StartValues.timeRangeMin );
    ZIMT.DATA.Session.ctimeSlider.setAttribute( "max", ZIMT.DATA.StartValues.timeRangeMax );
    ZIMT.DATA.Session.ctimeSlider.setValue( 
            [ZIMT.DATA.StartValues.timeRangeMin,
             ZIMT.DATA.StartValues.timeRangeMax
             ] );

// ============================================================================

    this.sync2amodl = function() {

        var __fildFacets = ZIMT.DATA.DefaultValues.arrFildFacets;
        var __arrSAs = ZIMT.DATA.DefaultValues.arrSearchAbles;
        var i = 0;

        var __saGroup = "";

        // === filed facetes ===
        for (i = 0; i < __fildFacets.length; i++) {

            var __fGroup = __fildFacets[i];
            var __arr = ZIMT.DATA.Session.facetMgr.getGroupData( __fGroup );

            rxData.facets[__fGroup] = {};
            rxData.facets[__fGroup].facets = [];
            rxData.facets[__fGroup].md = ZIMT.DATA.Session.facetMgr.getGroupMetaData( __fGroup );
            rxData.facets[__fGroup].allselected = ZIMT.DATA.Session.facetMgr.isGroupAllselected( __fGroup );

            for (var j = 0; j < __arr.length; j++) {
                rxData.facets[__fGroup].facets.push ({
                        name:__arr[j].name,                 // Anzeigename
                        displayname:__arr[j].displayname,   // Anzeigename
                        c:__arr[j].c,                       // Anzahl
                        on:__arr[j].on,                     // Ist angehackt
                        grp:__fGroup,                       // Feldgruppen Name
                        fq:__arr[j].fq                      // Filter Query
                });
            }
        }

        // === sa ===
        for (i = 0; i < __arrSAs.length; i++)
        {
            __saGroup = __arrSAs[i];
            rxData.sas[__saGroup] =  {}
            rxData.sas[__saGroup].sa = ZIMT.DATA.Session.sortMgr.getSAData( __saGroup );
        }

        // === stati ===
        rxData.stati.highlight = ZIMT.DATA.Session.queryMgr.isHighlight();
        rxData.pagination = ZIMT.DATA.Session.pagMgr.getCurrPag();
    }

// === Evaluate ===============================================================

/**
 * evaluateFacetRequestFieldFacet
 * 
 * @param grp
 *            groupname [str]
 * @param data
 *            solr answer
 */
    this.evaluateFacetRequestFieldFacet = function( grp, data) {
// console.log(Object.keys( data.facet_counts.facet_fields[grp] ).length);
        if(Object.keys( data.facet_counts.facet_fields[grp] ).length > 0)
        {
            for (var i = 0; i < data.facet_counts.facet_fields[grp].length; i+=2) {
                ZIMT.DATA.Session.facetMgr.pushItem( 
                        "field", grp, 
                        data.facet_counts.facet_fields[grp][i], 
                        data.facet_counts.facet_fields[grp][i+1]
                );
            }
            // Nachdem alle Items gepusht sind muss die Gruppe NEU sortiert
			// werden.
            ZIMT.DATA.Session.facetMgr.sortGrp( grp );
        }
    } 

/**
 * evaluateQueryRequest
 * 
 * @param data
 */

    this.evaluateQueryRequest = function(data) {
        rxData.result.response= data.response;
        
        ZIMT.DATA.Session.pagMgr.reset( rxData.result.response.numFound, 0 );
                    // Bei jedem submit wieder bei null anfangen ^^^
    }

    /***************************************************************************
	 * Provides the static portion of the Solr Rest Request using only default
	 * values.
	 **************************************************************************/
    
    this.__getRequestStatic = function() {
        var __tmpStr = ZIMT.DATA.DefaultValues.qProtocol;
        __tmpStr += ZIMT.DATA.DefaultValues.qHost;
        __tmpStr += ZIMT.DATA.DefaultValues.qCore;
        return __tmpStr;
    }

    this.__getDefaultRqh = function() {
    	var str = ZIMT.DATA.DefaultValues.qRqh;
    	str += "?";
    	return str;
    }

    this.__getMltRqu = function() {
        var __str = ZIMT.DATA.DefaultValues.qMltRqh;
        __str += "?";
        return __str;
    }

    this.__mkSolrServerDebugString = function() {
        rxData.dbgSolrServer = rxData.__getRequestStatic() +
            rxData.__getDefaultRqh();
        rxData.dbgSolrServerMlt = rxData.__getRequestStatic() +
            rxData.__getMltRqu();
	}

/******************************************************************************
 * send all Requests
 * 
 *****************************************************************************/
    this.sendRequests = function() {
    	var __maxReqLengthExceeded = false;

        var __facetProp = "&facet=true&facet.limit=-1&facet.sort=count";

        rxData.__mkSolrServerDebugString();

        // === text ===
        var __tmp0 = rxData.__getRequestStatic();
        __tmp0 += rxData.__getDefaultRqh();
        __tmp0 += "q=" + ZIMT.DATA.Session.queryMgr.getTextQuery4Query(
        		rxData.query,
        		ZIMT.DATA.Session.queryMgr.ENCODE,
        		ZIMT.DATA.Session.queryMgr.ISQUERY
        		);
        __tmp0 += "&wt=json&indent=true";
// __tmp0 += "&rows=10";
        __tmp0 += ZIMT.DATA.Session.pagMgr.getQuery();
        __tmp0 += ZIMT.DATA.Session.facetMgr.getFilterQueries( "text" ); // "text"
																			// ist
																			// hier
																			// nur
																			// ein
																			// dummy!
        __tmp0 += ZIMT.DATA.Session.timeMgr.getFilterQueries( rxData.stati.timerangeON );
        __tmp0 += ZIMT.DATA.Session.sortMgr.getSortQuery();
        console.log(__tmp0);

        // === dc_contributor ===
        var __tmp1 = rxData.__getRequestStatic();
        __tmp1 += rxData.__getDefaultRqh();
        __tmp1 += "q=" + ZIMT.DATA.Session.queryMgr.getTextQuery4Facet( rxData.query, ZIMT.DATA.Session.queryMgr.ENCODE );
        __tmp1 += "&wt=json&indent=true";
        __tmp1 += __facetProp;
        __tmp1 += "&rows=0"; // Jetzt nur keinen Inhalt ;-)
        __tmp1 += "&facet.field=dc_contributor";
// rxData.getData(__tmp1, rxData.evaluateFacetRequestDC_Contributor);
        __tmp1 += ZIMT.DATA.Session.facetMgr.getFilterQueries( "dc_contributor" );
        __tmp1 += ZIMT.DATA.Session.timeMgr.getFilterQueries( rxData.stati.timerangeON );
        // console.log(__tmp1);

        // === dc_publisher ===
        var __tmp2 = rxData.__getRequestStatic();
        __tmp2 += rxData.__getDefaultRqh();
        __tmp2 += "q=" + ZIMT.DATA.Session.queryMgr.getTextQuery4Facet( rxData.query, ZIMT.DATA.Session.queryMgr.ENCODE );
        __tmp2 += "&wt=json&indent=true";
        __tmp2 += __facetProp;
        __tmp2 += "&rows=0"; // Jetzt nur keinen Inhalt ;-)
        __tmp2 += "&facet.field=dc_publisher";
// rxData.getData(__tmp2, rxData.evaluateFacetRequestDC_Publisher);
        __tmp2 += ZIMT.DATA.Session.facetMgr.getFilterQueries( "dc_publisher" );
        __tmp2 += ZIMT.DATA.Session.timeMgr.getFilterQueries( rxData.stati.timerangeON );

        // === edm_place ===
        var __tmp3 = rxData.__getRequestStatic();
        __tmp3 += rxData.__getDefaultRqh();
        __tmp3 += "q=" + ZIMT.DATA.Session.queryMgr.getTextQuery4Facet( rxData.query, ZIMT.DATA.Session.queryMgr.ENCODE );
        __tmp3 += "&wt=json&indent=true";
        __tmp3 += __facetProp;
        __tmp3 += "&rows=0"; // Jetzt nur keinen Inhalt ;-)
        __tmp3 += "&facet.field=edm_place";
        __tmp3 += ZIMT.DATA.Session.facetMgr.getFilterQueries( "edm_place" );
        __tmp3 += ZIMT.DATA.Session.timeMgr.getFilterQueries( rxData.stati.timerangeON );
// console.log(__tmp3);

        // === dc_language ===
        var __tmp4 = rxData.__getRequestStatic();
        __tmp4 += rxData.__getDefaultRqh();
        __tmp4 += "q=" + ZIMT.DATA.Session.queryMgr.getTextQuery4Facet( rxData.query, ZIMT.DATA.Session.queryMgr.ENCODE );
        __tmp4 += "&wt=json&indent=true";
        __tmp4 += __facetProp;
        __tmp4 += "&rows=0"; // Jetzt nur keinen Inhalt ;-)
        __tmp4 += "&facet.field=dc_language";
// rxData.getData(__tmp4, rxData.evaluateFacetRequestDC_Publisher);
        __tmp4 += ZIMT.DATA.Session.facetMgr.getFilterQueries( "dc_language" );
        __tmp4 += ZIMT.DATA.Session.timeMgr.getFilterQueries( rxData.stati.timerangeON );

        // === dc_type ===
        var __tmp5 = rxData.__getRequestStatic();
        __tmp5 += rxData.__getDefaultRqh();
        __tmp5 += "q=" + ZIMT.DATA.Session.queryMgr.getTextQuery4Facet( rxData.query, ZIMT.DATA.Session.queryMgr.ENCODE );
        __tmp5 += "&wt=json&indent=true";
        __tmp5 += __facetProp;
        __tmp5 += "&rows=0"; // Jetzt nur keinen Inhalt ;-)
        __tmp5 += "&facet.field=dc_type";
        __tmp5 += ZIMT.DATA.Session.facetMgr.getFilterQueries( "dc_type" );
        __tmp5 += ZIMT.DATA.Session.timeMgr.getFilterQueries( rxData.stati.timerangeON );

        // === dct_medium ===
        var __tmp6 = rxData.__getRequestStatic();
        __tmp6 += rxData.__getDefaultRqh();
        __tmp6 += "q=" + ZIMT.DATA.Session.queryMgr.getTextQuery4Facet( rxData.query, ZIMT.DATA.Session.queryMgr.ENCODE );
        __tmp6 += "&wt=json&indent=true";
        __tmp6 += __facetProp;
        __tmp6 += "&rows=0"; // Jetzt nur keinen Inhalt ;-)
        __tmp6 += "&facet.field=dct_medium";
        __tmp6 += ZIMT.DATA.Session.facetMgr.getFilterQueries( "dct_medium" );
        __tmp6 += ZIMT.DATA.Session.timeMgr.getFilterQueries( rxData.stati.timerangeON );

        // === dct_temporal ===
        var __tmp7 = rxData.__getRequestStatic();
        __tmp7 += rxData.__getDefaultRqh();
        __tmp7 += "q=" + ZIMT.DATA.Session.queryMgr.getTextQuery4Facet( rxData.query, ZIMT.DATA.Session.queryMgr.ENCODE );
        __tmp7 += "&wt=json&indent=true";
        __tmp7 += __facetProp;
        __tmp7 += "&rows=0"; // Jetzt nur keinen Inhalt ;-)
        __tmp7 += "&facet.field=dct_temporal";
        __tmp7 += ZIMT.DATA.Session.facetMgr.getFilterQueries( "dct_temporal" );
        __tmp7 += ZIMT.DATA.Session.timeMgr.getFilterQueries( rxData.stati.timerangeON );

        // === edm_agent ===
        var __tmp8 = rxData.__getRequestStatic();
        __tmp8 += rxData.__getDefaultRqh();
        __tmp8 += "q=" + ZIMT.DATA.Session.queryMgr.getTextQuery4Facet( rxData.query, ZIMT.DATA.Session.queryMgr.ENCODE );
        __tmp8 += "&wt=json&indent=true";
        __tmp8 += __facetProp;
        __tmp8 += "&rows=0"; // Jetzt nur keinen Inhalt ;-)
        __tmp8 += "&facet.field=edm_agent";
        __tmp8 += ZIMT.DATA.Session.facetMgr.getFilterQueries( "edm_agent" );
        __tmp8 += ZIMT.DATA.Session.timeMgr.getFilterQueries( rxData.stati.timerangeON );

        // === dct_isPartOf ===
        var __tmp9 = rxData.__getRequestStatic();
        __tmp9 += rxData.__getDefaultRqh();
        __tmp9 += "q=" + ZIMT.DATA.Session.queryMgr.getTextQuery4Facet( rxData.query, ZIMT.DATA.Session.queryMgr.ENCODE );
        __tmp9 += "&wt=json&indent=true";
        __tmp9 += __facetProp;
        __tmp9 += "&rows=0"; // Jetzt nur keinen Inhalt ;-)
        __tmp9 += "&facet.field=dct_isPartOf";
        __tmp9 += ZIMT.DATA.Session.facetMgr.getFilterQueries( "dct_isPartOf" );
        __tmp9 += ZIMT.DATA.Session.timeMgr.getFilterQueries( rxData.stati.timerangeON );

//		if(ZIMT.DATA.DefaultValues.Debug){
//			console.log(  "maxlength: " + ZIMT.DATA.DefaultValues.maxReqLength);
//			console.log( "length  0 : " + __tmp0.length );
//			console.log( "length  1 : " + __tmp1.length );
//			console.log( "length  2 : " + __tmp2.length );
//			console.log( "length  3 : " + __tmp3.length );
//			console.log( "length  4 : " + __tmp4.length );
//			console.log( "length  5 : " + __tmp5.length );
//			console.log( "length  6 : " + __tmp6.length );
//			console.log( "length  7 : " + __tmp7.length );
//			console.log( "length  8 : " + __tmp8.length );
//			console.log( "length  9 : " + __tmp9.length );
//		}





		if(__tmp0.length > ZIMT.DATA.DefaultValues.maxReqLength ||
				__tmp1.length > ZIMT.DATA.DefaultValues.maxReqLength ||
				__tmp2.length > ZIMT.DATA.DefaultValues.maxReqLength ||
				__tmp3.length > ZIMT.DATA.DefaultValues.maxReqLength ||
				__tmp4.length > ZIMT.DATA.DefaultValues.maxReqLength ||
				__tmp5.length > ZIMT.DATA.DefaultValues.maxReqLength ||
				__tmp6.length > ZIMT.DATA.DefaultValues.maxReqLength ||
				__tmp7.length > ZIMT.DATA.DefaultValues.maxReqLength ||
				__tmp8.length > ZIMT.DATA.DefaultValues.maxReqLength ||
				__tmp9.length > ZIMT.DATA.DefaultValues.maxReqLength
			)
		{
			__maxReqLengthExceeded = true;
			console.log("BINGO");
        	alert( "Maximum HTTP GET Request Length exceeded!" );

		}
		else
		{
//console.log("SCHWEIGEN");
			
	        var __promise0 = $http({method: "GET", url: __tmp0, cache: "true"});
	        var __promise1 = $http({method: "GET", url: __tmp1, cache: "true"});
	        var __promise2 = $http({method: "GET", url: __tmp2, cache: "true"});
	        var __promise3 = $http({method: "GET", url: __tmp3, cache: "true"});
	        var __promise4 = $http({method: "GET", url: __tmp4, cache: "true"});
	        var __promise5 = $http({method: "GET", url: __tmp5, cache: "true"});
	        var __promise6 = $http({method: "GET", url: __tmp6, cache: "true"});
	        var __promise7 = $http({method: "GET", url: __tmp7, cache: "true"});
	        var __promise8 = $http({method: "GET", url: __tmp8, cache: "true"});
	        var __promise9 = $http({method: "GET", url: __tmp9, cache: "true"});

	        // === Sync All Promises ===
	        $q.all([__promise0, __promise1, __promise2, __promise3, __promise4, __promise5, __promise6, __promise7, __promise8, __promise9]).then(function(data)
	        {
	            rxData.evaluateQueryRequest(data[0].data);
	            // >>>>>>>>>>> Ersetzen in response.docs [--Array--] dc_language [--Array--]
	            // => Wir Brauchen ein Service, dass in einem Array einen String durch einen
	            // anderen ersetzt
	            rxData.evaluateFacetRequestFieldFacet( "dc_contributor", data[1].data );
	            rxData.evaluateFacetRequestFieldFacet( "dc_publisher", data[2].data );
	            rxData.evaluateFacetRequestFieldFacet( "edm_place", data[3].data );
	            // >>>>>>>>>>> Ersetzen in facet_counts.facet_fields.dc_language
	            // >>>>>>>>>>> Das ist ein Array in dem jedes zweite Feld ersetzt werden
	            // soll.
	            // >>>>>>>>>>> AUCH in data[0] ersetzen
	            rxData.evaluateFacetRequestFieldFacet( "dc_language", data[4].data );
	            rxData.evaluateFacetRequestFieldFacet( "dc_type", data[5].data );
	            rxData.evaluateFacetRequestFieldFacet( "dct_medium", data[6].data );
	            rxData.evaluateFacetRequestFieldFacet( "dct_temporal", data[7].data );
	            rxData.evaluateFacetRequestFieldFacet( "edm_agent", data[8].data );
	            rxData.evaluateFacetRequestFieldFacet( "dct_isPartOf", data[9].data );
	
	            rxData.sync2amodl();
	            
	        },
	        function(reason) {
	            console.log("failed:");
	            console.log(reason);
	            alert( "Error " + reason.status + ": " + reason.statusText );
	        },
	        function(update) {
	            console.log("got notification:");
	            console.log(update);
	        }
	        );
		}

// === END Send Request ========================================================





    }

// === Register evhs
// ==================================================================================
    
    ZIMT.DATA.Session.ctimeSlider.on("slideStop", function( ev ) {
        rxData.onChangeSetTimeRange( ev );
    });
// END Register evhs

	// =======================================================
    // === pseudo event handler
	// =======================================================

    // === Facet ===

    this.onChangeFacetGrp = function($event, name, fq, grp) {
        ZIMT.DATA.Session.facetMgr.toggleFacet(grp, name);
//        rxData.sync2amodl();
        this.onSubmit();
    }

// Unused?
//    this.onToggleFacetGrp = function( grp ) {
//        ZIMT.DATA.Session.facetMgr.toggleGroupOn( grp );
//        rxData.sync2amodl();
//    }

    this.onUnsetFacetGrp = function( grp ) {
        ZIMT.DATA.Session.facetMgr.setGroupOn( grp, false );
//        rxData.sync2amodl();
        this.onSubmit();
    }


    this.onToggleAllFacets = function( on ) {
        ZIMT.DATA.Session.facetMgr.setAllGroupsOn( on );
        rxData.sync2amodl();
    }

    this.onUnsetAllFacets = function() {
            ZIMT.DATA.Session.facetMgr.setAllGroupsOn( false );
            this.onSubmit();
        }

    // === Reset ===

    this.onResetQuerystring = function() {
        rxData.query = "";
        this.onSubmit();
    }

    this.onResetSort = function() {
        ZIMT.DATA.Session.sortMgr.unsetAll();
        this.onSubmit();
    }

    this.onResetTimeslider = function() {
        this.__resetTimeSlider();
        this.onSubmit();
    }

    this.onResetForm = function() {
      rxData.query = "";
      ZIMT.DATA.Session.facetMgr.setAllGroupsOn( false );
      ZIMT.DATA.Session.sortMgr.unsetAll();
      this.__resetTimeSlider();
      ZIMT.UTILS.initCollapse();

      this.onSubmit();
  }

    // === hmmm ===

    this.onTestSomething = function() {
//        console.log("Testsomething!");
        ZIMT.UTILS.initCollapse();
    }

    // === SA ===

    this.onChangeSAItem = function( $event, name ) {
//		console.log( "onChangeSAItem" );
		ZIMT.DATA.Session.sortMgr.toggleItem( name );
		this.onSubmit();
	}
    
    this.onToggleSAOrder = function( $event, name ) {
//    	console.log("onToggleSAOrder");
    	ZIMT.DATA.Session.sortMgr.toggleOrder( name )

        // Hier ein kleines Tänzchen mit dem Teufel
        if (ZIMT.DATA.Session.sortMgr.isItemOn( name ))
        {
            this.onSubmit();
        } else
        {
            this.sync2amodl();
        }
    }

    // === Pagination ===

    this.pag = function( str, n ) {
    	ZIMT.DATA.Session.pagMgr.onEV(str, n);
// this.onSubmit(); // TODO: Die Reihenfolge ist noch nicht ganz zu ende gedacht
    	//rxData.sendRequests(); // SO JETZT NEU writelocation
    	rxData.writeLocation();
	}


    // === Time Range ===

    // TODO:
    // ng-model="rData.stati.timerangeON"
    // und
    // ng-click="rData.onChangeRangeslideron()
    // => Zusammenführen!
    this.onChangeRangeslideron = function() {
//        console.log( rxData.stati.timerangeON );
        if (rxData.stati.timerangeON)
        {
            ZIMT.DATA.Session.trvisMgr.setShow();
        } else
        {
            ZIMT.DATA.Session.trvisMgr.setHide();
        }
        this.onSubmit();
    }

// unused
// this.onChangeSetTimeMin = function( intMin ) {
// ZIMT.DATA.Session.timeMgr.setMin( intMin );
// console.log("min: " + intMin);
// }
//
// this.onChangeSetTimeMax = function( intMax ) {
// ZIMT.DATA.Session.timeMgr.setMax( intMax );
// }

    this.onChangeSetTimeRange = function( intArr ) {
        ZIMT.DATA.Session.timeMgr.setTime( intArr );
        rxData.timerange.min = intArr[0];
        rxData.timerange.max = intArr[1];

        this.onSubmit();
        $scope.$apply();
    }

    this.onChangeTimeRangeMin = function() {
// console.log( rxData.timerange.min );
        ZIMT.DATA.Session.timeMgr.setMin( rxData.timerange.min );
        ZIMT.DATA.Session.ctimeSlider.setValue( 
                [rxData.timerange.min,
                 ZIMT.DATA.Session.ctimeSlider.getValue()[1]] 
        );
        this.istNeedSubmit();
//        this.onSubmit();
    }

    this.onChangeTimeRangeMax = function() {
// console.log( "max: " + rxData.timerange.max );
        ZIMT.DATA.Session.timeMgr.setMax( rxData.timerange.max );
        ZIMT.DATA.Session.ctimeSlider.setValue( 
                [ZIMT.DATA.Session.ctimeSlider.getValue()[0],
                 rxData.timerange.max]
        );
        this.istNeedSubmit();
//        this.onSubmit();
    }

    // === 13 ===

    this.onKey = function( ev ) {
		if (ev.keyCode == 13) {
			this.onSubmit();
		}
	}

/**
 * Location Change Success Event
 * 
 * NUR dieser Event TRIGGERT sendRequest! Das ist neu seit der Verwendung von
 * "location".
 */
    $scope.$on('$locationChangeSuccess', function() {
        $scope.actualLocation = $location.path();
        console.log( "locationChangeSuccess" );
        ZIMT.DATA.Session.sortMgr.init();
        rxData.readLocation( $location.search() );
        rxData.sendRequests();
        rxData.istStart();
    });



/******************************************************************************
 * === SUBMIT ===
 *****************************************************************************/
    this.onSubmit = function() {
        ZIMT.DATA.Session.pagMgr.init();
        rxData.writeLocation();

        // rxData.sendRequests(); ==> Hängt jetzt am locationChangeSuccess
		// event!
    }

// ==================================================================================
// === Init
// ==================================================================================

/**
 * init Function
 * 
 * start über <body ... data-ng-init="rData.init()" >
 */
//    DERZEIT NICHT IN VERWENDUNG
//    this.init = function() {
//    	console.log("init");
//        var __locObj = $location.search();
//        ZIMT.DATA.Session.queryMgr.configureHighlights( __locObj );
//        rxData.readLocation( __locObj );
//    }


//==================================================================================
// Location Stuff
//==================================================================================

this.readLocation = function( lObj ) {

	if(ZIMT.UTILS.isObjNOTEmpty( lObj )) {
		// ja jetzt mach irgendwas
		ZIMT.DATA.Session.queryMgr.turnOffHighlight();
		console.log( lObj );

		// dirty dirty dirty!
		if (lObj.hasOwnProperty("xh") && lObj.xh==1 )
        {
            //console.log("===> high light datam datam datam.");
            // TODO: Was ist mit den Facetten?
            //       - Das geht aus irgendeinem Gunde, auch wenn ich es nicht verstehe.
            // TODO: Was ist mit dem Unterschied neuladen vs submitbutton
            //       - Bei submit passiert garnichts, weil der benutzer nicht in die location schreiben darf.

            lObj = { xh:"1" }; // Hmm? call by reference vs call by value???
            ZIMT.DATA.Session.queryMgr.turnOnHighlight();
            ZIMT.UTILS.initCollapse();
        }
	}
//	else
//    {
//	    console.log( "es ist leer" );
//    }

    var __arrField = [];     // Array der einzuschaltenden Feldfacetten
    var __objAllFields = {}; // Alle Facetten einer Gruppe (GroupData)
    var __field = "";        // Name der Facettengruppe (die vom typ feld
								// ist) alias grp
    var __tmpLength = 0;
    var __item = "";         // Ein Element aus einem Array in Location
    var __fieldHttpGet = ""; // Feldname in der Form wie er in einem Array in
								// Location vorkommt

    // Facets
    for (var i = 0; i < ZIMT.DATA.DefaultValues.arrFildFacets.length; i++) {
        __field = ZIMT.DATA.DefaultValues.arrFildFacets[i];
        __fieldHttpGet = __field + "[]";
        if(lObj.hasOwnProperty( __fieldHttpGet ))
        {
            if(lObj[__fieldHttpGet].constructor === Array) {
                __arrField = lObj[__fieldHttpGet];
            } else if (lObj[__fieldHttpGet].constructor === String) {
                // String2Array
                __arrField = [lObj[__fieldHttpGet]];
            } else { 
                console.log( "Error: something is wrong!" );
            }

            __objAllFields = ZIMT.DATA.Session.facetMgr.getGroupData( __field ); // Gibt
																					// es
																					// bereits
																					// Felder
																					// die
																					// wieder
																					// zurückgesetzt
																					// werden
																					// müssen?
            __tmpLength = __objAllFields.length; // javascript casting! macht
													// den Zwischenschritt nötig

            if(__tmpLength > 0){
                ZIMT.DATA.Session.facetMgr.setGroupOn( __field, false );
            } // else { // es sind keine einträge in der Gruppe/Feld vorhanden
				// }
            for (var j = 0; j < __arrField.length; j++) {
                __item = __arrField[j];
                ZIMT.DATA.Session.facetMgr.setItemOn( __field, __item );
            }
        }
        else {
            // Alle Facetten in __field abschalten.
            ZIMT.DATA.Session.facetMgr.setGroupOn( __field, false );
        }
    } // END for Facets


    // Querry
    if (lObj.hasOwnProperty( "q" )) 
    {

//        if(lObj["q"].substring( 0, 5 ) == "text:") { // IE kennt "startsWith"
//														// nicht!
//														// if(lObj["q"].startsWith(
//														// "text:" ))
//            rxData.query = lObj["q"].substring( 5, lObj["q"].length );
//            // AngularJS decodiert die Umlaute die es aus dem Hash liest.
//            // In rxData.query liegt der String unkodiert mit Umlauten vor!
//        }
//        else
//        {
//            console.log( "Error: fehler in suchstring" );
//        }
    	rxData.query = lObj["q"];

    }
    else {
        // query löschen
        rxData.query = "";
    }

    // Timerange
    if(lObj.hasOwnProperty( "timerangeon" ) && lObj["timerangeon"]) {
        rxData.stati.timerangeON = true;
        ZIMT.DATA.Session.trvisMgr.setShow();
        if(lObj.hasOwnProperty( "timerangemin" )) {
            ZIMT.DATA.Session.timeMgr.setMin( lObj["timerangemin"] );
            rxData.timerange.min = parseInt( lObj["timerangemin"] );
            ZIMT.DATA.Session.ctimeSlider.setValue(
                    [rxData.timerange.min,
                     ZIMT.DATA.Session.ctimeSlider.getValue()[1]]
            );
        }
// else ist überflüssig die defaultwerte sollten irgendwo vorhanden sein ??
// else
// {
// console.log( "min: " + ZIMT.DATA.StartValues.timeRangeMin );
// ZIMT.DATA.Session.timeMgr.setMin(ZIMT.DATA.StartValues.timeRangeMin );
// }
        if(lObj.hasOwnProperty( "timerangemax" )) {
            ZIMT.DATA.Session.timeMgr.setMax( lObj["timerangemax"] );
            rxData.timerange.max = parseInt( lObj["timerangemax"] );
            ZIMT.DATA.Session.ctimeSlider.setValue(
                    [ZIMT.DATA.Session.ctimeSlider.getValue()[0],
                     rxData.timerange.max]
            );
        }
// else ist überflüssig die defaultwerte sollten irgendwo vorhanden sein ??
// else
// {
// console.log( "max: " + ZIMT.DATA.StartValues.timeRangeMax );
// }
    }
    else {
        rxData.stati.timerangeON = false;
    }

    // SA
    if (lObj.hasOwnProperty("sa"))
    {
        ZIMT.DATA.Session.sortMgr.setItem( lObj["sa"] );
        if (lObj.hasOwnProperty( "sao" ))
        {
            ZIMT.DATA.Session.sortMgr.setOrder( lObj["sa"], lObj["sao"] );
        } else
        {
            ZIMT.DATA.Session.sortMgr.setOrder( lObj["sa"], "asc" );
        }
    } else
    { // jetzt alles ausschalten
        ZIMT.DATA.Session.sortMgr.unsetAll();
    }

    if (lObj.hasOwnProperty( "x" )) {
//		console.log( "Has Property page: " + lObj["page"] );
        ZIMT.DATA.Session.pagMgr.set( lObj["x"] );
	}

    rxData.calcCite();
} // END readLocation

this.writeLocation = function() {
    // TODO: Abklären wofür das sein soll?
    var __locSearch = {};
    var __tmpSelected = "";
    // END TODO

    __locSearch = rxData.calcLocation();


    // Write to location
    $location.path( "" );
    $location.search( __locSearch );
}

this.calcLocation = function( cite ) {
    var __locSearch = {};
    var __tmpSelected = "";
    var __tmpSA;

    // query
    __locSearch.q = ZIMT.DATA.Session.queryMgr.getTextQuery4Query(
    		rxData.query,
    		ZIMT.DATA.Session.queryMgr.DONOTENCODE,
    		ZIMT.DATA.Session.queryMgr.ISNOTQUERY
    		);

    // timerange
    if (rxData.stati.timerangeON) {
      __locSearch.timerangeon = rxData.stati.timerangeON;
      __locSearch.timerangemin = ZIMT.DATA.Session.timeMgr.getMin();
      __locSearch.timerangemax = ZIMT.DATA.Session.timeMgr.getMax();
    }

    // facets
    ZIMT.DATA.DefaultValues.arrFildFacets.forEach( function( elem ) {
        __tmpSelected = ZIMT.DATA.Session.facetMgr.getGroupSelectedItems( elem );
        var __tmpSelectedLength = __tmpSelected.length;
        if(__tmpSelectedLength > 0) {
            __locSearch[elem+"[]"] = __tmpSelected;
        }
    });

    if(cite)
    {
    	return __locSearch;
    }

    // SA
    __tmpSA = ZIMT.DATA.Session.sortMgr.getSort();
    if(__tmpSA) 
    {
    	__locSearch["sa"] = __tmpSA.name;
    	__locSearch["sao"] = __tmpSA.order;
    }

    // page
    __locSearch.x = ZIMT.DATA.Session.pagMgr.getCurrPage();
    return __locSearch;
}

// END Location Stuff ==============================================================

//==================================================================================
// Interval Submit Timer
//==================================================================================

ZIMT.DATA.Session.Ist.iInterval = 3000; // [ms]
ZIMT.DATA.Session.Ist.intervalHandle = null;
ZIMT.DATA.Session.Ist.bNeedSubmit = false;


this.istStart = function() {
//    console.log( "start Interval" );
//    console.log( ZIMT.DATA.Session.Ist.intervalHandle );
    if (!ZIMT.DATA.Session.Ist.intervalHandle)  // pseudo singelton
    {
        ZIMT.DATA.Session.Ist.intervalHandle = $interval(
                rxData.__istDoInterval,
                ZIMT.DATA.Session.Ist.iInterval
                );
    }
}

this.istStop = function() {
    console.log( "stop Interval" );
    $interval.cancel( ZIMT.DATA.Session.Ist.intervalHandle );
    ZIMT.DATA.Session.Ist.intervalHandle = null;
}

this.istNeedSubmit = function() {
    ZIMT.DATA.Session.Ist.bNeedSubmit = true;
}

this.__istDoInterval = function() {
//    console.log( "Do Interval" );
    if (ZIMT.DATA.Session.Ist.bNeedSubmit)
    {
        rxData.__istAction();
        console.log( "ist Action" );
        ZIMT.DATA.Session.Ist.bNeedSubmit = false;
    }
}

this.__istAction = function() {
    this.onSubmit();
}

// END Interval Submit Timer =======================================================

//==================================================================================
// Filters and Comperators for use in Angular
//==================================================================================

// gunters hirnkrebs generator
this.filterAlphabet = function(strSearch) {
//    var strRe = "(^|\\s)" + strSearch + ".*";
    var strRe = "(^| |-)" + strSearch + ".*";
    if (strSearch == undefined) {
        return function() {
            return true;
        }
    } else {
        return function(name) {
            var re = new RegExp(strRe, "i");
            return name.name.match(re) ? true : false;
        }
    }
}

/**
 * compMore
 * 
 * Sortierung für die "Mehr Ansicht" (modal)
 * 
 * (Liefert die "Angular orderBy expression")
 */

this.compMore = function( item1 ) {
    var strTmp = "";
    if(item1.on) {
        strTmp = "   ";
    }

    return (strTmp + item1.displayname);
}

/**
 * compMoreComperator
 * 
 * Sortierung für die "Mehr Ansicht" (modal)
 * 
 * (Liefert den "Angular orderBy comperator")
 */


this.compMoreComperator = function(v1, v2) {

    // If we don't get strings, just compare by index
    if (v1.type !== 'string' || v2.type !== 'string') {
      return (v1.index < v2.index) ? -1 : 1;
    }

    // Compare strings alphabetically, taking locale into account
    return v1.value.localeCompare(v2.value);
}

// END  Filter =====================================================================

//==================================================================================
// Bill Namenlos
//==================================================================================


this.calcCite = function() {
	rxData.cite = window.location.origin;
	rxData.cite += window.location.pathname;
	rxData.cite += "#/?";
	rxData.cite += $httpParamSerializer(rxData.calcLocation( true ));
}

this.__resetTimeSlider = function() {
    ZIMT.DATA.Session.ctimeSlider.setValue(
            [ZIMT.DATA.StartValues.timeRangeMin,
             ZIMT.DATA.StartValues.timeRangeMax
             ] );

    rxData.timerange = {
            min: ZIMT.DATA.StartValues.timeRangeMin,
            max: ZIMT.DATA.StartValues.timeRangeMax
            };

    ZIMT.DATA.Session.timeMgr.setTime(
            [
                ZIMT.DATA.StartValues.timeRangeMin,
                ZIMT.DATA.StartValues.timeRangeMax
            ]);

    rxData.stati.timerangeON = false;
}

// ==================================================================================
// Debug
// ==================================================================================
    this.debug = function( abc ) {
// this.init();
      console.log( "Debug" );
      
// rxData.sendRequests();
// rxData.sync2amodl();

      console.log( ZIMT.DATA.Session.sortMgr );
//      ZIMT.DATA.Session.sortMgr.setDebugData();
//      ZIMT.DATA.Session.sortMgr.init( ZIMT.DATA.DefaultValues.arrSearchAbles );
      ZIMT.DATA.Session.sortMgr.serializeData();
      
      

 console.log( rxData );

  }

  this.debug2 = function() {
// ZIMT.DATA.Session.facetMgr.setDebugData();
      ZIMT.DATA.Session.facetMgr.serializeData();
      
// // === Test Filter Query String ===
// var test = new ZIMT.UTILS.FilterQueryString();
// test.pushItem( "dc_contributor", "Franz-Nabl-Institut f�r Literaturforschung"
// );
// test.pushItem( "dc_contributor", "Institut f�r Alte Geschichte und
// Altertumskunde" );
// test.pushItem( "dc_publisher", "Di�zesanarchiv Graz-Seckau" );
// console.log( test.getString() );
//      
// var test = 0;
// console.log( test.getString() );
      
      
  }
    
}]); // END RDataController
