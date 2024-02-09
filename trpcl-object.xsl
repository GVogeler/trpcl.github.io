<?xml version="1.0" encoding="UTF-8"?>

<!-- 
    Project: GAMS Projekttemplate
    Company: ZIM-ACDH (Zentrum für Informationsmodellierung - Austrian Centre for Digital Humanities)
 -->

<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:s="http://www.w3.org/2001/sw/DataAccess/rf1/result" xmlns="http://www.w3.org/1999/xhtml"
    xmlns:t="http://www.tei-c.org/ns/1.0" xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
    xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:lido="http://www.lido-schema.org" xmlns:oai="http://www.openarchives.org/OAI/2.0/" exclude-result-prefixes="#all">

    <!--
        - This is included via static
        <xsl:include href="/lib/3.0/gamsJS/1.x/gamsjs_wippets/widget_injection.xsl"/>
    -->
    
    <xsl:include href="tpcl-static.xsl"/>

    <!--<xsl:output method="xml" doctype-system="about:legacy-compat" encoding="UTF-8" indent="no"/>-->
    
  

    <xsl:template name="content">
        <!--für den edition viewer wird das hier eingebunden. bilder müssen im TEI und als datenströme vorhanden sein und ein METS erstellt worden sein. -->
        <xsl:if test="$mode = 'view:editionobject' or $mode=''">
            <section class="row">                                    
                
                        <article class="col-md-6">  
                            <div class="card">
                                <div class="card-body">
                                    <xsl:apply-templates select="//t:body"/>
                                </div>
                            </div>
                        </article>
                
                    <article class="col-md-6" style="margin-top:30px;">
                        <div class="sticky-top" style="top:67px; z-index:100;">
                            <div id="vwr-content" class="toc"
                                style="background-color: #E8E8E8; height:700px;" >
                                <xsl:text> </xsl:text>    
                            </div>
                            <xsl:variable name="Desc" select="t:TEI/t:teiHeader/t:fileDesc/t:sourceDesc/t:msDesc"/>
                            <div class="MsInfo"><xsl:apply-templates select="$Desc/t:msIdentifier/t:settlement"/><xsl:text>, </xsl:text><xsl:value-of select="$Desc/t:msIdentifier/t:institution"/><xsl:if test="$Desc/t:msIdentifier/t:repository"><xsl:text>, </xsl:text><xsl:value-of select="$Desc/t:msIdentifier/t:repository"/></xsl:if><xsl:text>, </xsl:text><xsl:value-of select="$Desc/t:msIdentifier/t:idno"/>
                            </div>
                        </div>
                        
                        <script type="text/javascript" src="{$gamsAssetsRootPath}/lib/editionviewer/openseadragon.js">//</script>
                        <script type="text/javascript" src="{$gamsAssetsRootPath}/lib/editionviewer/bs-scroll-the-edition.js">//</script>
                        <script type="text/javascript" src="{$gamsAssetsRootPath}/lib/editionviewer/gamsEdition.js">//</script>
                        <script type="text/javascript">
                            gamsOsd({
                            id: "vwr-content",
                            prefixUrl: "/osdviewer/images/",
                            showNavigator: false,
                            sequenceMode: true,
                            initialPage: 1,
                            defaultZoomLevel:   0,
                            showSequenceControl: true,
                            showReferenceStrip: false,
                            showRotationControl: false,
                            referenceStripScroll: "horizontal",
                            pid:"<xsl:value-of select="concat('/',$teipid)"/>"
                            });
                        </script>
                    </article>
                
            </section>
        </xsl:if>
        
       <xsl:if test="$mode='view:otherobject'">
           <section class="row">                                    
               
               <article class="col-md-6">
                   <div class="card">
                       <div class="card-body">
                           <h3 class="objekt">Objekbeschreibung</h3>
                           
                           <table class="table table-hover table-light">
                               
                               <tbody>
                                   <tr>
                                       <td class="color">Objekt:</td>
                                       <td>
                                           <xsl:value-of select="//t:titleStmt/t:title"/>
                                       </td>
                                   </tr>
                                   <tr>
                                       <td class="color">Beschreibung:</td>
                                       <td>Absatz Absatz Absatz Absatz Absatz Absatz Absatz Absatz Absatz
                                           Absatz Absatz TEEEEEEEEEEEEEST Absatz </td>
                                   </tr>
                                   <tr>
                                       <td class="color">Datum:</td>
                                       <td>14.04.1774</td>
                                   </tr>
                                   <tr>
                                       <td class="color">Kommentar</td>
                                       <td>11110011</td>
                                   </tr>
                                   <tr>
                                       <td class="color">Ort:</td>
                                       <td>Absatz Absatz Absatz Absatz Absatz Absatz Absatz Absatz Absatz
                                           Absatz Absatz Absatz Absatz </td>
                                   </tr>
                                   <tr>
                                       <td class="color">Copyright:</td>
                                       <td>14.04.1774</td>
                                   </tr>
                                   <tr>
                                       <td class="color">Heinz:</td>
                                       <td>11110011</td>
                                   </tr>
                                   <tr>
                                       <td class="color">Strunz:</td>
                                       <td>Absatz Absatz Absatz Absatz Absatz Absatz Absatz Absatz Absatz
                                           Absatz Absatz Absatz Absatz </td>
                                   </tr>
                                   <tr>
                                       <td class="color">Kunz:</td>
                                       <td>14.04.1774</td>
                                   </tr>
                               </tbody>
                           </table>
                       </div>
                   </div>
               </article>
               
               <article class="col-md-6" style="margin-top:30px;">
                   <div class="sticky-top" style="top:67px; z-index:100;">
                       <div id="vwr-content" class="toc"
                           style="background-color: #E8E8E8; height:700px;" >
                           <xsl:text> </xsl:text>    
                       </div>
                   </div>
                   <!--Diese Pfadreferenzen sind okay weil sie aus dem Image ausgeliefert werden! Keine lokalen Ordner/Files nötig.-->
                   <script type="text/javascript" src="/osdviewer/openseadragon.js"><xsl:text> </xsl:text></script>
                   <script type="text/javascript" src="/osdviewer/gamsOsd.js"><xsl:text> </xsl:text></script>
                   <script type="text/javascript">
                       gamsOsd({
                       id: "vwr-content",
                       prefixUrl: "/osdviewer/images/",
                       showNavigator: true,
                       sequenceMode: true,
                       showReferenceStrip: true,
                       showRotationControl: true,
                       showIiifLabels: true,
                       referenceStripScroll: "horizontal",
                       pid:"<xsl:value-of select="concat('/',$teipid)"/>"
                       });
                   </script>
               </article>
               
           </section>
       </xsl:if>
       <xsl:if test="$mode='queryform'">
            
            <xsl:call-template name="form"/>
            
       </xsl:if>
    
        
    
    </xsl:template>
    
    <!--########### für mode=queryform relevant ###########-->
    <xsl:template name="form">
        <doc xmlns="http://www.oxygenxml.com/ns/doc/xsl">
            <desc>
                <h1>Widget Query-Form</h1>
                <p>Martina Scholger, Georg Vogeler</p>
                <p>Auf Ebene html: form anzuwenden.</p>
                <p>Das Wippet enthät ein Formular, in dem alle üblichen Formularfelder in $[0-9]+ umgewandelt werden, um dann als Platzhalter in Query-Objekten eingesetzt werden zu können.</p>
                <p>Beim Abschicken des Formulars werden alle Formularelemente ausgelesen und in eine Reihe von $x-Parametern ("$1|Wert") mit Semikolon getrennt umgewandelt.</p>
                <p>Das Formular ruft dann das aktuelle Objekt auf und übergibt ihm die Parameter als ?params=...</p>
                <p>Zum Debuggen wird vorher der params-Wert in einem Alert ausgegeben. Im Einsatz also bitte alle //Debug-Zeilen im search.js löschen.</p>
                <p>Beispiel: <a href="#">Beispiel-Link</a></p>
                <p>Voraussetzung: jQuery (wenn auch nur der Bequemlichkeit halber)</p>
                <p>Bootstrag ist egal, derzeit mit Boostrap 4 gestylt.</p>
            </desc>
            <depends>
                jQuery
                Einbindung von ./search.js
            </depends>
            <return>form</return>
        </doc>
        <script type="application/javascript" src="/gamsdev/vogeler/fulltext/search.js"><xsl:text> </xsl:text></script>
        <form action="{document-uri(/)}" id="suche" method="get">
            <!-- Text Feld -->
            <div class="form-group">
                <label for="formGroupExampleInput">Feldbeschriftung 1 (Texteingabe):</label>
                <input name="$text" type="text" class="form-control" id="formGroupExampleInput" placeholder="Hier Text eingeben" />
            </div>
            <!-- Text area -->
            <div class="form-group">
                <label for="formGroupExampleTextArea">Feldbeschriftung 2 (Texteingabe: Textfeld):</label>
                <textarea name="$text" type="text" class="form-control" id="formGroupExampleTextArea" placeholder="Hier laengeren Text eingeben" ><xsl:text> </xsl:text></textarea>
            </div>
            <!-- Select -->
            <div class="form-group">
                <label for="exampleFormControlSelect1">Feldbeschriftung 3 (Auswahlliste, genau 1 Wert):</label>
                <select name="$select" class="form-control" id="exampleFormControlSelect1">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
            </div>
            <!-- Multiple Select -->
            <div class="form-group">
                <label for="exampleFormControlSelect2">Feldbeschriftung 4 (Mehrfache Auswahl):</label>
                <select name="$multiple" multiple="multiple" class="form-control" id="exampleFormControlSelect2">
                    <option value="$multiple1">1</option>
                    <option value="$multiple2">2</option>
                    <option value="$multiple3">3</option>
                    <option value="$multiple4">4</option>
                    <option value="$multiple5">5</option>
                </select>
            </div>
            <!-- Checkbox -->
            <div class="form-check">
                <input name="$check1" class="form-check-input" type="checkbox" value="$check1" id="defaultCheck1" />
                <label class="form-check-label" for="defaultCheck1">
                    Checkbox 1
                </label>
            </div>
            <div class="form-check">
                <input name="$check2" class="form-check-input" type="checkbox" value="$check2" id="defaultCheck2" />
                <label class="form-check-label" for="defaultCheck2">
                    Checkbox 2
                </label>
            </div>
            <!-- Radiobutton -->
            <div class="form-check">
                <label>Entweder oder:</label>
                <input name="$radio1" class="form-check-input" type="radio" id="exampleRadios1" value="option1a" checked="checked" />
                <label class="form-check-label" for="exampleRadios1">
                    Wert 1
                </label>
                <input name="$radio1" class="form-check-input" type="radio" id="exampleRadios2" value="option1b" />
                <label class="form-check-label" for="exampleRadios2">
                    Wert 2
                </label>
            </div>
            <!-- Radiobutton -->
            <div class="form-check">
                <label>Entweder oder, oder doch?</label>
                <input name="$radio2" class="form-check-input" type="radio" id="exampleRadios3" value="option2-1" />
                <label class="form-check-label" for="exampleRadios3">
                    Wert A
                </label>
                <input name="$radio2" class="form-check-input" type="radio" id="exampleRadios4" value="option2-2" />
                <label class="form-check-label" for="exampleRadios4">
                    Wert B
                </label>
                <input name="$radio2" class="form-check-input" type="radio" id="exampleRadios5" value="option2-1" checked="checked" />
                <label class="form-check-label" for="exampleRadios5">
                    Wert C
                </label>
            </div>
            <p>
                <input type="submit"/>
            </p>
        </form>
    </xsl:template>
    <!--############## END query form ########################-->
    
    
    <!--################Ab hier für Edition Viewer relevant######################-->
    <!-- Seitenumbruch kennzeichnen, Seitenzahl auslesen, Folio auslesen -->
    <xsl:template match="t:pb">
        <span class="page" level="{@xml:id}" id="{@xml:id}">
            <span class="pageNumber">
                <xsl:call-template name="pageNumber">
                    <xsl:with-param name="number" select="@n"/>
                </xsl:call-template>
            </span>
        </span> 
    </xsl:template>
    <xsl:template name="pageNumber">
        <xsl:param name="number"/>
        <xsl:choose>
            <xsl:when test="starts-with($number, '0')">
                <xsl:variable name="saveNumber" select="substring-after($number, '0')"/>
                <xsl:call-template name="pageNumber">
                    <xsl:with-param name="number" select="$saveNumber"/>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <b>
                    <xsl:text>[</xsl:text>
                    <xsl:value-of select="$number"/>
                    <xsl:text>]</xsl:text>
                </b>
            </xsl:otherwise>
            
        </xsl:choose>
    </xsl:template>
    <xsl:template match="t:lb[@n]">  
        <!-- Zeilennummern schreiben  -->   
        <xsl:if test="not(@n='N001')"><br/></xsl:if><span class="bold"><xsl:value-of select="substring-after(@n,'N0')"/><xsl:text>: </xsl:text></span>
        <xsl:apply-templates/>
    </xsl:template> 
    <xsl:template match="t:lb[not(@n)]">    
        <br/>       
    </xsl:template>
   <!-- ################ END Edition Viewer ################-->
</xsl:stylesheet>
