// NO IIFE until we realy need it ;-)

var ZIMT = ZIMT || {};


ZIMT.DATA = ZIMT.DATA || {};
ZIMT.DATA.Session = ZIMT.DATA.Session || {};

ZIMT.DATA.Session.pid = "";
ZIMT.DATA.Session.place = "";

var app = angular.module("mltmod", []);



app.controller( "PlaceMltController", ["$http", "$q", "$httpParamSerializer",
    function($http, $q, $httpParamSerializer) {
    
    var rxData = this;
    rxData.mlt = {};

    this.dowhatever = function() {
        rxData.sendRequests( "place" );
//        rxData.sendRequests( "mlt" );
    }


 // === Evaluate ===============================================================

    this.evaluatePlaceRequest = function( __data ) {

        // TODO: Was passiert wenn edm_place leer ist?
        if(__data.response.docs[0].edm_place == "") {
            console.log( "ERROR Place is empty!" );
        }
        ZIMT.DATA.Session.place = __data.response.docs[0].edm_place;

        rxData.sendRequests( "mlt" );
    }

    this.evaluateMltRequest = function( __fld, __data ) {
        if(__data.response.numFound == 0) {
            console.log( "ERROR Response is empty!" );
        }

        var scoreBound = ZIMT.DATA.DefaultValues.MLT.Place.fLowerBound;
        var __lowerBound = scoreBound * __data.response.maxScore;
        var i = 0;
        var __arr = __data.response.docs;

        rxData.mlt[__fld] = {};
        rxData.mlt[__fld].maxscore = __data.response.maxScore;
        rxData.mlt[__fld].mlts = [];

        for(i = 0; i < __arr.length; i++) {
            // tatam tatam ein break.   das ginge aber mit einem while eleganter!
            if(__arr[i].score < __lowerBound) {break;}
            rxData.mlt[__fld].mlts.push( __arr[i] );
        }
        rxData.mlt[__fld].hits = rxData.mlt[__fld].mlts.length;
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
        var __str = ZIMT.DATA.DefaultValues.qRqh;
        __str += "?";
        return __str;
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
        this.sendRequests = function( __requestMode ) {
            var __maxReqLengthExceeded = false;
            var __tmp0 = "";
            var __tmp1 = "";
            var __promise0, __promise1;

            rxData.__mkSolrServerDebugString();

            if(__requestMode == "place") {
                __tmp0 = rxData.__getRequestStatic();
                __tmp0 += rxData.__getDefaultRqh();
                __tmp0 += "q=PID%3A" + encodeURIComponent( ZIMT.DATA.Session.pid );
                __tmp0 += "&fl=edm_place&wt=json";
                // DONE: UrlEncode? scheint ohne zu gehen derzeit
                // Das "=" darf nicht codiert werden!

                console.log( __tmp0 );
                __promise0 = $http({method: "GET", url: __tmp0, cache: "true"});

                $q.all([__promise0]).then(function( data ) 
                {
                    rxData.evaluatePlaceRequest( data[0].data );
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

                return true;
            }

            if(__requestMode="mlt") {
//                console.log( "=== MLT Request ===" );
                __tmp1 = rxData.__getRequestStatic();
                __tmp1 += rxData.__getMltRqu();
                __tmp1 += "q=PID%3A" + encodeURIComponent( ZIMT.DATA.Session.pid );
                __tmp1 += '&fq=edm_place%3A%22'
                    + encodeURIComponent( ZIMT.DATA.Session.place )
                    + '%22';
                __tmp1 += '&fl='
                    + encodeURIComponent( "PID,dc_type,dc_publischer,dc_title,dc_description,dc_language,dc_date,dct_temporal,dct_isPartOf,edm_place,edm_agent,score" );
                __tmp1 += "&wt=json&indent=true";

                console.log( __tmp1 );
                __promise1 = $http({method: "GET", url: __tmp1, cache: "true"});

                $q.all([__promise1]).then(function( data )
                        {
                            rxData.evaluateMltRequest( "place", data[0].data );
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

                return true;
            }

            console.log( "ähh.... something goes wrong" );
        }
// === END Send Request ========================================================
        
///******************************************************************************
// * === SUBMIT ===
// *****************************************************************************/
//    this.onSubmit = function() {
//         rxData.sendRequests();
//    }

/**
 * init Function
 * 
 * start über <body ... data-ng-init="rData.init()" >
 */

    this.init = function( __strPID ) {
//      console.log( "init" );
//      console.log( __strPID );
      ZIMT.DATA.Session.pid = __strPID.replace( ":", "\\:" );
      rxData.dowhatever();
    }

    }]);  // END PlaceMltController

