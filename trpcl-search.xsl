<?xml version="1.0" encoding="UTF-8"?>

<!-- 
    Project: GAMS Projekttemplate
    Company: ZIM-ACDH (Zentrum für Informationsmodellierung - Austrian Centre for Digital Humanities)
    Author: Hans Clausen, Maximilian Müller, Gerlinde Schneider, Martina Semlak, Christian Steiner, Elisabeth Steiner
    Last update: 2015
 -->

<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:s="http://www.w3.org/2001/sw/DataAccess/rf1/result" xmlns="http://www.w3.org/1999/xhtml"
	xmlns:t="http://www.tei-c.org/ns/1.0" xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
	xmlns:dc="http://purl.org/dc/elements/1.1/" exclude-result-prefixes="#all">

	<xsl:include href="tpcl-static.xsl"/>



	<xsl:output method="xml" doctype-system="about:legacy-compat" encoding="UTF-8" indent="no"/>


	<xsl:template name="content">
		<section class="row">

			<xsl:call-template name="box1"/>
		</section>
	</xsl:template>

	<xsl:template name="box1">
		<article class="col-md-6 ">
			<div class="card">
				<div class="card-body">

					<xsl:apply-templates
						select="document(concat('/context:', $projectAbbr, '/SEARCH_HELP'))/t:TEI/t:text/t:body/t:div"/>
					<!-- wenn es eine erweiterte Suche gibt, hier mit choose auf advanced testen und das template aufrufen, dass das Suchformular erzeugt -->

				</div>

			</div>
		</article>
		<article class="col-md-6 ">
			<div class="card">
				<div class="card-body">

					<div id="search">
						<!--Aufruf der Funktion für die Ausgabe des Kopfs-->
						<xsl:call-template name="createHead"/>

						<xsl:if test="sparql/results/result">
							<ol class="result">
								<xsl:for-each select="sparql/results/result">
									<xsl:sort select="member/@uri"/>
									<xsl:call-template name="createResults"/>
								</xsl:for-each>
							</ol>
						</xsl:if>

						<!--Aufruf der Funktion für die Ausgabe der Navigationsleiste-->
						<xsl:for-each select="sparql/navigation/navElements">
							<xsl:call-template name="createNavigation"/>
						</xsl:for-each>
					</div>
				</div>
			</div>
		</article>
		

	</xsl:template>



	<!--Kopf-->
	<xsl:template name="createHead">

		<h3>
			<xsl:value-of select="$projectTitle"/>
		</h3>

		<xsl:choose>
			<xsl:when test="error/errmsg">
				<h4 class="resultsFor">
					<xsl:choose>
						<xsl:when test="error/errmsg[@msgid = 'InternalError']">
							<xsl:text>Bei der Suche ist ein Problem aufgetreten.</xsl:text>
						</xsl:when>
						<xsl:when test="error/errmsg[@msgid = 'StartsWithWildcard']">
							<xsl:text>Der Suchbegriff darf nicht mit * oder ? beginnen.</xsl:text>
						</xsl:when>
						<xsl:when test="error/errmsg[@msgid = 'QueryTooShort']">
							<xsl:text>Der Suchbegriff ist zu kurz (mindestens 3 Zeichen)</xsl:text>
						</xsl:when>
						<xsl:when test="error/errmsg[@msgid = 'MissingQuery']">
							<xsl:text>Fehlender Wert: Es muss ein Suchbegriff angegeben werden!</xsl:text>
						</xsl:when>
						<xsl:when test="error/errmsg[@msgid = 'lucene']">
							<xsl:text>Es ist ein Fehler bei der Suche aufgetreten. Bitte überprüfen Sie Ihre Eingabe.</xsl:text>
						</xsl:when>
					</xsl:choose>
				</h4>
			</xsl:when>

			<xsl:otherwise>
				<p>
					<xsl:text>Suchergebnisse für</xsl:text>
					<xsl:text>: </xsl:text>

					<!--<xsl:choose>
						<xsl:when test="contains($search, 'simple')">-->
					<xsl:value-of select="$query"/>
					<!--</xsl:when>-->
					<!--<xsl:when test="$search = 'advanced'">
							<xsl:if test="$query">
								<xsl:value-of select="$query"/>
							</xsl:if>-->
					<!-- hier werden die suchbegriffe ausgegeben, die der user eingegeben hat, für ein muster siehe kommentar unten -->
					<!--
								hier werden die suchbegriffe ausgegeben, die der user eingegeben hat
								<xsl:if test="$gattung != ''">
								<xsl:value-of select="$gattung"/>

								<xsl:if test="$sprache != '' or $fundort != '' or $konkordanz!='' or $query2 != ''">
									<xsl:text>, </xsl:text>
								</xsl:if>
							</xsl:if>
							<xsl:if test="$sprache != ''">
								<xsl:value-of select="$sprache"/>

								<xsl:if test="$fundort != '' or $konkordanz!='' or $query2 != ''">
									<xsl:text>, </xsl:text>
								</xsl:if>
							</xsl:if>
							-->
					<!--</xsl:when>-->
					<!--					</xsl:choose>-->
				</p>
				<p>
					<xsl:text>Anzahl der gefundenen Einträge</xsl:text>
					<xsl:text>: </xsl:text>
					<xsl:choose>
						<xsl:when test="$hitTotal != ''">
							<xsl:value-of select="$hitTotal"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>0</xsl:text>
						</xsl:otherwise>
					</xsl:choose>
				</p>
			</xsl:otherwise>
		</xsl:choose>

		<xsl:if test="$hitTotal > 0">
			<p>
				<!--Ausgabe welche Treffer der User gerade sieht-->
				<xsl:text>[</xsl:text>
				<xsl:text>Treffer</xsl:text>
				<xsl:text> </xsl:text>
				<xsl:value-of select="$hitsFrom"/>
				<xsl:text>-</xsl:text>
				<xsl:value-of select="$hitsTo"/>
				<xsl:text>]</xsl:text>
			</p>
		</xsl:if>
	</xsl:template>

	<!--Ausgabe der Ergebnisliste-->
	<xsl:template name="createResults">
		<xsl:variable name="url" select="concat('/', member/@uri)"/>

		<!--Die Trefferquote wird auf 2 Kommastellen gerundet-->
		<xsl:variable name="score" select="round(score * 100) div 100"/>

		<!--Ausgabe der Grafik und des Objekttitels-->
		<li
			style="position:relative;overflow:hidden;border-bottom:dotted 1px;padding:5px 0 5px 0;margin:5px 0 5px 0;">
			<xsl:if test="position() = last() and $hitTotal &lt; 10">
				<xsl:attribute name="style">
					<xsl:text>border-bottom:none;</xsl:text>
				</xsl:attribute>
			</xsl:if>

			<xsl:choose>
				<xsl:when test="position() mod 2 = 0">
					<xsl:attribute name="class">
						<xsl:text>results odd</xsl:text>
					</xsl:attribute>
				</xsl:when>
				<xsl:otherwise>
					<xsl:attribute name="class">
						<xsl:text>results even</xsl:text>
					</xsl:attribute>
				</xsl:otherwise>
			</xsl:choose>
			<a>
				<xsl:attribute name="href">
					<xsl:value-of select="concat('/', member/@uri)"/>

				</xsl:attribute>
				<img width="100" height="80"
					style="float: left; padding-right: 10px; padding-bottom:5px;">
					<xsl:attribute name="src">
						<xsl:value-of select="concat('/', member/@uri, '/THUMBNAIL')"/>

					</xsl:attribute>

					<xsl:attribute name="alt">
						<xsl:value-of select="memberTitle"/>
					</xsl:attribute>
				</img>
			</a>

			<span style="vertical-align: top; padding-right: 2em;">
				<a>
					<xsl:attribute name="href">

						<xsl:value-of select="concat('/', member/@uri)"/>

					</xsl:attribute>


					<xsl:value-of select="memberTitle"/>

				</a>
			</span>
			<br/>
			<span style="font-size:0.8em;color:black;">
				<a>
					<xsl:attribute name="href">
						<xsl:value-of select="concat('/', member/@uri)"/>

					</xsl:attribute>
					<xsl:text>Permalink: </xsl:text><xsl:value-of select="concat('/', member/@uri)"/>

				</a>

			</span>
			<!--<span class="pdf" style="position: absolute; bottom: 0; right: 0; padding:5px;">
				<a target="_blank">
					<xsl:attribute name="href">
						<xsl:value-of select="concat($server, '/', member/@uri, '/TEI_SOURCE')"/>

					</xsl:attribute>
					<img src="/templates/img/tei_icon.jpg" 
						height="18" alt="TEI-Dokument" title="TEI-Dokument"/>
				</a>
				<a target="_blank" style="margin-left:5px;">
					<xsl:attribute name="href">
						<xsl:value-of select="concat($server, '/', member/@uri, '/LIDO_SOURCE')"/>
					</xsl:attribute>
					<img src="/templates/img/lido_icon.png" 
						height="18" alt="LIDO-Dokument" title="LIDO-Dokument"/>
				</a>
				<a target="_blank" style="margin-left:5px;">
					<xsl:attribute name="href">
						<xsl:value-of select="concat($server, '/', member/@uri, '/sdef:TEI/getPDF')"/>
						<!-\- ggfs. auf lido umstellen -\->

					</xsl:attribute>
					<img src="/age/img/pdf_icon.gif"  height="18"
						alt="Druckversion" title="Druckversion"/>
				</a>
			</span>-->

		</li>
	</xsl:template>



	<!--Ausgabe der Navigationsleiste-->
	<xsl:template name="createNavigation">

		<xsl:if test="$hitTotal > 0">
			<div id="search-navi">
				<!--Schaltflächen zur Navigation, falls mehr als 0 Suchergebnisse gefunden wurden-->
				<p>
					<span class="back" style="margin-right:3px;">
						<xsl:if test="first">
							<xsl:choose>
								<xsl:when test="first/@href">
									<a>
										<xsl:attribute name="href">
											<xsl:text>search</xsl:text>
											<!--  -->
											<xsl:value-of
												select="substring-after(first/@href, 'search')"/>
											<!--<xsl:if test="$search = 'advanced'">
												<xsl:text>&amp;search=advanced</xsl:text>
											</xsl:if>
											<xsl:if test="$search = 'simple'">
												<xsl:text>&amp;search=simple</xsl:text>
											</xsl:if>-->

										</xsl:attribute>
										<xsl:text>|&#171;</xsl:text>
										<xsl:text>&#160;</xsl:text>
									</a>
								</xsl:when>
								<xsl:otherwise>
									<span class="nofunc">
										<xsl:text>|&#171;</xsl:text>
										<xsl:text>&#160;</xsl:text>
									</span>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:if>

						<xsl:if test="back">
							<xsl:choose>
								<xsl:when test="back/@href">
									<a>
										<xsl:attribute name="href">
											<xsl:text>search</xsl:text>
											<!--  -->
											<xsl:value-of
												select="substring-after(back/@href, 'search')"/>
											<!--	<xsl:if test="$search = 'advanced'">
												<xsl:text>&amp;search=advanced</xsl:text>
											</xsl:if>
											<xsl:if test="$search = 'simple'">
												<xsl:text>&amp;search=simple</xsl:text>
											</xsl:if>
-->
										</xsl:attribute>
										<xsl:text>« zurück</xsl:text>

									</a>
								</xsl:when>
								<xsl:otherwise>
									<span class="nofunc">
										<xsl:text>« zurück</xsl:text>
										<xsl:text>&#160;</xsl:text>
									</span>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:if>
					</span>

					<xsl:for-each select="pages/page">
						<xsl:choose>
							<xsl:when test="@href">
								<a>
									<xsl:attribute name="href">
										<xsl:text>search</xsl:text>
										<!--  -->
										<xsl:value-of select="substring-after(@href, 'search')"/>
										<!--		<xsl:if test="$search = 'advanced'">
											<xsl:text>&amp;search=advanced</xsl:text>
										</xsl:if>
										<xsl:if test="$search = 'simple'">
											<xsl:text>&amp;search=simple</xsl:text>
										</xsl:if>-->

									</xsl:attribute>
									<xsl:value-of select="@num"/>
								</a>
								<xsl:text>&#160;</xsl:text>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="@num"/>
								<xsl:text>&#160;</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>

					<span class="forward" style="margin-left:3px;">
						<xsl:if test="forward">
							<xsl:choose>
								<xsl:when test="forward/@href">
									<a>
										<xsl:attribute name="href">
											<xsl:text>search</xsl:text>
											<!--  -->
											<xsl:value-of
												select="substring-after(forward/@href, 'search')"/>
											<!--<xsl:if test="$search = 'advanced'">
												<xsl:text>&amp;search=advanced</xsl:text>
											</xsl:if>
											<xsl:if test="$search = 'simple'">
												<xsl:text>&amp;search=simple</xsl:text>
											</xsl:if>-->

										</xsl:attribute>
										<xsl:text>weiter »&#160;</xsl:text>
									</a>
								</xsl:when>
								<xsl:otherwise>
									<span class="nofunc">
										<xsl:text>weiter »&#160;</xsl:text>
									</span>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:if>

						<xsl:if test="last">
							<xsl:choose>
								<xsl:when test="last/@href">
									<a>
										<xsl:attribute name="href">
											<xsl:text>search</xsl:text>
											<!--  -->
											<xsl:value-of
												select="substring-after(last/@href, 'search')"/>
											<!--<xsl:if test="$search = 'advanced'">
												<xsl:text>&amp;search=advanced</xsl:text>
											</xsl:if>
											<xsl:if test="$search = 'simple'">
												<xsl:text>&amp;search=simple</xsl:text>
											</xsl:if>-->

										</xsl:attribute>
										<xsl:text>&#187;|</xsl:text>
									</a>
								</xsl:when>
								<xsl:otherwise>
									<span class="nofunc">
										<xsl:text>&#187;|</xsl:text>
									</span>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:if>
					</span>
				</p>
			</div>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
