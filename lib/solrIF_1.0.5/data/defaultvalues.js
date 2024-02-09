var ZIMT = ZIMT || {};
ZIMT.DATA = ZIMT.DATA || {};

ZIMT.DATA.DefaultValues = ZIMT.DATA.DefaultValues || {};
ZIMT.DATA.DefaultValues.MLT = ZIMT.DATA.DefaultValues.MLT || {};
ZIMT.DATA.DefaultValues.MLT.Place = ZIMT.DATA.DefaultValues.MLT.Place || {};

ZIMT.DATA.DefaultValues.Debug = true;

// === Query Default Values ===
ZIMT.DATA.DefaultValues.qProtocol = "https://";
ZIMT.DATA.DefaultValues.qHost = "192.168.56.18/solr/";
ZIMT.DATA.DefaultValues.qCore = "pardusglossa/search/";
ZIMT.DATA.DefaultValues.qRqh =   "select";
ZIMT.DATA.DefaultValues.qMltRqh =   "mlt2";


ZIMT.DATA.DefaultValues.qFormat = "&wt=json&indent=true";  // Result Format
ZIMT.DATA.DefaultValues.qAlways = "&facet=true";           // Facet Always true
ZIMT.DATA.DefaultValues.qDefaultQuery = "q=*:*";           // Default Query  no "&" for the first parameter

// === Default Language ===
ZIMT.DATA.DefaultValues.strDefaultLang = "de";

// === Schrittweite für paginierung ===
ZIMT.DATA.DefaultValues.iPagStepSize = 10;

// === MLT Parameter ===
ZIMT.DATA.DefaultValues.MLT.Place.fLowerBound = 0.85; // 0.85 .. -15%

// ====== Intern ======
// - arrFildFacets: wird derzeit nur in sync2amodl() benutzt
ZIMT.DATA.DefaultValues.arrFildFacets = ["dc_contributor", "dc_publisher", "edm_place", "dc_language", "dc_type", "dct_medium", "dct_temporal", "edm_agent", "dct_isPartOf"];

ZIMT.DATA.DefaultValues.arrSearchAbles = [
    ["dc_contributor", "str"],
    ["dc_publisher", "str"],
    ["dc_type", "str"],
    ["dct_temporal", "str"],
    ["edm_place", "str"],
    ["dct_isPartOf", "str"],
    ["dct_created_sort", "nr"]
    ];

// dct_created .. ungeeignet -> dct_created_sort
// ==========================
// dc_language .. multivalued
// dct_medium  .. multivalued
// edm_agent   .. multivalued

ZIMT.DATA.DefaultValues.maxReqLength=8190;
