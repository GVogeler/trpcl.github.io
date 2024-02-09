<?xml version="1.0" encoding="UTF-8"?>
<!-- 
    Project: GAMS Projekttemplate
    Company: ZIM-ACDH (Zentrum für Informationsmodellierung - Austrian Centre for Digital Humanities)
    Author: Hans Clausen, Gerlinde Schneider, Martina Scholger, Christian Steiner, Elisabeth Steiner, Sebastian Stoff
    Last update: 2020 (Update gamsJS)
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
	xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
	xmlns:s="http://www.w3.org/2001/sw/DataAccess/rf1/result" xmlns="http://www.w3.org/1999/xhtml"
	xmlns:t="http://www.tei-c.org/ns/1.0" xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
	xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:lido="http://www.lido-schema.org"
	xmlns:bibtex="http://bibtexml.sf.net/" exclude-result-prefixes="#all">
	<!--<xsl:output method="xml" doctype-system="about:legacy-compat" encoding="UTF-8" indent="no"/>-->
	<!-- häufig verwendete variablen... -->
	<xsl:param name="mode"/>
	<xsl:param name="search"/>
	<xsl:variable name="model"
		select="substring-after(/s:sparql/s:results/s:result/s:model/@uri, '/')"/>
		<xsl:variable name="cid">
			<!-- das ist der pid des contextes, kommt aus dem sparql (ggfs. query anpassen) - wenn keine objekte zugeordnet sind, gibt es ihn nicht! -->
			<xsl:value-of select="/s:sparql/s:results/s:result[1]/s:cid"/>
		</xsl:variable>
		<xsl:variable name="teipid">
			<xsl:value-of select="//t:idno[@type = 'PID']"/>
		</xsl:variable>
		<xsl:variable name="lidopid">
			<xsl:value-of select="//lido:lidoRecID"/>
		</xsl:variable>
		<!--variablen für Suchergebnisse-->
		<xsl:variable name="query" select="sparql/head/query"/>
		<xsl:variable name="hitTotal" select="/sparql/head/hitTotal"/>
		<xsl:variable name="hitPageStart" select="/sparql/head/hitPageStart"/>
		<xsl:variable name="hitPageSize" select="/sparql/head/hitPageSize"/>
		<xsl:variable name="hitsFrom" select="sparql/navigation/hits/from"/>
		<xsl:variable name="hitsTo" select="sparql/navigation/hits/to"/>
		<!-- GAMS global variables -->
		<xsl:variable name="zim">Zentrum für Informationsmodellierung - Austrian Centre for Digital
			Humanities</xsl:variable>
			<xsl:variable name="zim-acdh">ZIM-ACDH</xsl:variable>
			<xsl:variable name="gams">Geisteswissenschaftliches Asset Management System</xsl:variable>
			<xsl:variable name="uniGraz">Universität Graz</xsl:variable>
	<!-- ***
		*********
		project-specific variables
		*********
		*** -->
		<doc xmlns="http://www.oxygenxml.com/ns/doc/xsl">
			<desc>trpcl</desc>
		</doc>
		<xsl:variable name="projectAbbr">trpcl</xsl:variable>
	<xsl:variable name="projectRootPath" select="'https://raw.githubusercontent.com/GVogeler/trpcl/test-git2gams'"/>
		<doc xmlns="http://www.oxygenxml.com/ns/doc/xsl">
			<desc>C:/Users/Cookie/gams-local/gams-data/apache/trpcl</desc>
		</doc>
	<xsl:variable name="gamsAssetsRootPath" select="'http://gams-staging.uni-graz.at/assets'"/>
		<xsl:variable name="projectTitle">
			<xsl:text>Korespondenca Jožefine in Fidelija Terpinc (1823-1875)</xsl:text>
		</xsl:variable>
		<xsl:variable name="subTitle">
			<xsl:text>Digitalna izdaja pisem Zgodovinskega arhiva Ljubljana</xsl:text>
		</xsl:variable>
		<!-- gesamtes css ist in dieser Datei zusammengefasst mit Ausnahme der Navigation -->
		<xsl:variable name="projectCss">
			<xsl:value-of select="concat($projectRootPath, '/css/', $projectAbbr, '.css')"/>
		</xsl:variable>
		<!--css für die navigation-->
		<xsl:variable name="projectNav">
			<xsl:value-of select="concat($projectRootPath, '/css/navbar.css')"/>
		</xsl:variable>
		<!--xsl für die suchansicht-->
		<xsl:variable name="searchXsl">
			<xsl:value-of select="concat($projectRootPath, '/', $projectAbbr, '-search.xsl')"
				/>
			</xsl:variable>
			<xsl:template match="/">
				<html lang="de">
					<head>
						<meta charset="utf-8"/>
						<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
						<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
						<meta name="description" content=""/>
						<!-- Projektbeschreibung eingeben -->
						<!-- evtl. noch mehr Meta Tags aus Dublin Core, schema.org oder Open Graph -->
						<meta name="publisher"
							content="Zentrum für Informationsmodellierung - Austrian Centre for Digital Humanities"/>
							<meta name="content-language" content="de"/>
							<!--Projekttitel-->
							<title>
								<xsl:value-of select="$projectTitle"/>
							</title>
							<!-- Bootstrap core CSS -->
							<link href="{$gamsAssetsRootPath}/lib/bootstrap/bootstrap-5.0.2-dist/css/bootstrap.min.css" rel="stylesheet"/>
							<!-- CSS only of fontawesome / currently on version 6 /  -->
							<link href="{$gamsAssetsRootPath}/lib/fa/all.min.css" rel="stylesheet"/>
							<!-- Custom styles for this template -->
							<link href="{$projectCss}" rel="stylesheet" type="text/css"/>
							<link href="{$projectNav}" rel="stylesheet" type="text/css"/>
							<!-- jQuery core JavaScript ================================================== -->
							<script type="text/javascript" src="{$gamsAssetsRootPath}/lib/jquery/jquery-3.6.0.min.js"><xsl:text> </xsl:text></script>
							<!-- Bootstrap core JavaScript ================================================== -->
							<script type="text/javascript" src="{$gamsAssetsRootPath}/lib/bootstrap/bootstrap-5.0.2-dist/js/bootstrap.bundle.min.js"><xsl:text> </xsl:text></script>
				<!-- 
					GamsJs inclusion  
				-->
				<script src="{$gamsAssetsRootPath}/lib/gamsJS/1.x/gams.js" type="text/javascript"><xsl:text> </xsl:text></script>
			</head>
			<body>
				<header>
					<div class="container">
						<div class="row flex">
							<div class="col-10">
								<h1>
									<xsl:value-of select="$projectTitle"/>
								</h1>
								<h2>
									<xsl:value-of select="$subTitle"/>
								</h2>
							</div>
							<div class="col-2">
								<!-- 1 statt 4 -->
							</div>
						</div>
					</div>
				</header>
				<nav class="navbar navbar-expand-md navbar-dark sticky-top">
					<div class="container">
						<a class="navbar-brand d-md-none" href="#">Navigation</a>
						<button class="navbar-toggler" type="button" data-toggle="collapse"
							data-target="#navbarCollapse" aria-controls="navbarCollapse"
							aria-expanded="false" aria-label="Toggle navigation">
							<span class="navbar-toggler-icon"><xsl:text> </xsl:text></span>
						</button>
						<div id="navbarCollapse" class="collapse navbar-collapse">
							<ul class="navbar-nav mr-auto">
								<li class="nav-item">
									<xsl:if test="$mode = ''">
										<xsl:attribute name="class">nav-item active</xsl:attribute>
									</xsl:if>
									<a class="nav-link"
										href="/context:{$projectAbbr}"
										>Domov <span class="sr-only">(current)</span>
										</a>
								</li>
								<li class="nav-item">
										<xsl:if test="$mode = 'project'">
											<xsl:attribute name="class">nav-item active</xsl:attribute>
										</xsl:if>
										<a class="nav-link"
											href="/archive/objects/context:{$projectAbbr}/methods/sdef:Context/get?mode=project"
											>O projektu</a>
								</li>															
								<li class="nav-item">
										<xsl:if test="$mode = 'list_letters'">
												<xsl:attribute name="class">nav-item active</xsl:attribute>
										</xsl:if>
										<a class="nav-link"
												href="/archive/objects/context:{$projectAbbr}/methods/sdef:Context/get?mode=list_letters"
											>Pisma</a>
								</li>
								<li class="nav-item">	
										<xsl:if test="$mode = 'osebe'">
											<xsl:attribute name="class">nav-item active</xsl:attribute>
										</xsl:if>								
										<a class="nav-link"
													href="/archive/objects/context:{$projectAbbr}/methods/sdef:Context/get?mode=osebe"
											>Korespodenti</a>
								</li>
								<li class="nav-item">	
										<xsl:if test="$mode = 'kraji'">
											<xsl:attribute name="class">nav-item active</xsl:attribute>
										</xsl:if>
										<a class="nav-link"
										href="/archive/objects/context:{$projectAbbr}/methods/sdef:Context/get?mode=kraji"
											>Lokacije</a>
								</li>
								<!--<li class="nav-item">
									<xsl:if test="$mode = (concat('context:', $projectAbbr))">
										<xsl:attribute name="class">nav-item active</xsl:attribute>
									</xsl:if>
									<a class="nav-link"
										href="/o:trpcl.1"
										>primer pisma</a>
									</li>	-->
								</ul>						
							</div>
							<!-- /.navbar-collapse -->
						</div>
						<!-- /.container -->
					</nav>
					<main class="container">
						<xsl:choose>
						<!-- <xsl:when test="$mode = ''">
							<!-/- einstiegsseite für projektkontext -/->
							<section class="row">
								<article class="col-md-5">
									<div class="card" data-mh="group1">
										<div class="card-body">
											<blockquote class="card-blockquote">
												<h3>Lorem 222Ipsum</h3>
												<h4>Lorem Ipsum dolor sit amet</h4>
												<p> Lorem ipsum dolor sit amet, consetetur
												sadipscing elitr, sed diam nonumy eirmod tempor
												invidunt ut labore et dolore magna aliquyam erat,
												sed diam voluptua. At vero eos et accusam et justo
												duo dolores et ea rebum. Stet clita kasd
												gubergren, no sea takimata sanctus est Lorem ipsum
												dolor sit amet. </p>
												<p> Duis autem vel eum iriure dolor in hendrerit in
												vulputate velit esse molestie consequat, vel illum
												dolore eu feugiat nulla facilisis at vero eros et
												accumsan et iusto odio dignissim qui blandit
												praesent luptatum zzril delenit augue duis dolore
												te feugait nulla facilisi. Lorem ipsum dolor sit
												amet, consectetuer adipiscing elit, sed diam
												nonummy nibh euismod tincidunt ut laoreet dolore
												magna aliquam erat volutpat. </p>
											</blockquote>
										</div>
									</div>
								</article>
								<article class="col-md-4">
									<div class="card" data-mh="group1">
										<div class="card-body">
											<blockquote class="card-blockquote">
												<h3>Lorem Ipsum</h3>
												<h4>Lorem Ipsum dolor sit amet</h4>
												<p> Lorem ipsum dolor sit amet, consetetur
												sadipscing elitr, sed diam nonumy eirmod tempor
												invidunt ut labore et dolore magna aliquyam erat,
												sed diam voluptua. At vero eos et accusam et justo
												duo dolores et ea rebum. Stet clita kasd
												gubergren, no sea takimata sanctus est Lorem ipsum
												dolor sit amet. Lorem ipsum dolor sit amet,
												consetetur sadipscing elitr, sed diam nonumy
												eirmod tempor invidunt ut labore et dolore magna
												aliquyam erat, sed diam voluptua. At vero eos et
												accusam et justo duo dolores et ea rebum. Stet
												clita kasd gubergren, no sea takimata sanctus est
												Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
												amet, consetetur sadipscing elitr, sed diam nonumy
												eirmod tempor invidunt ut labore et dolore magna
												aliquyam erat, sed diam voluptua. At vero eos et
												accusam et justo duo dolores et ea rebum. Stet
												clita kasd gubergren, no sea takimata sanctus est
												Lorem ipsum dolor sit amet. </p>
											</blockquote>
										</div>
									</div>
								</article>
								<article class="col-md-3">
									<!-/- card mit image verbessern -/->
									<div class="card">
										<img class="card-img-top" src="{$gamsAssetsRootPath}/img/4-esel.jpg"
											alt="Card image cap"/>
										<div class="card-body">
											<h4 class="card-title">Card title</h4>
											<p class="card-text">Some quick example text to build on
												the card title and make up the bulk of the card's
												content.</p>
											<a href="#!" class="btn btn-dark">Go somewhere</a>
										</div>
									</div>
								</article>
							</section>
							<section class="row">
								<article class="col-md-10">
									<div class="card" data-mh="group2">
										<div class="card-body">
											<blockquote class="card-blockquote">
												<p>Lorem ipsum dolor sit amet, consectetur
												adipiscing elit. Integer posuere erat a ante.</p>
											</blockquote>
										</div>
									</div>
								</article>
								<article class="col-md-2">
									<div class="card" data-mh="group2">
										<div class="card-body">
											<blockquote class="card-blockquote">
												<p>Lorem ipsum dolor sit amet, consectetur
												adipiscing elit. Integer posuere erat a ante.</p>
											</blockquote>
										</div>
									</div>
								</article>
							</section>
							<section class="row">
								<article class="col-md-6">
									<div class="card" data-mh="group3">
										<div class="card-body">
											<blockquote class="card-blockquote">
												<h3>Tester</h3>
												<h4>Testo</h4>
												<p>Testi</p>
											</blockquote>
										</div>
									</div>
								</article>
								<article class="col-md-6">
									<!-/- carousel und card einbauen -/->
									<div class="card" data-mh="group3">
										<div id="carouselExampleIndicators" class="carousel slide"
											data-ride="carousel">
											<ol class="carousel-indicators">
												<li data-target="#carouselExampleIndicators"
												data-slide-to="0" class="active"/>
												<li data-target="#carouselExampleIndicators"
												data-slide-to="1"/>
											</ol>
											<div class="carousel-inner" role="listbox">
												<div class="carousel-item active">
												<img class="d-block w-100"
												src="/assets/img/4-esel.jpg"
												data-src="holder.js/900x400?theme=social"
												alt="First slide"/>
												</div>
												<div class="carousel-item">
												<img class="d-block w-100"
												src="/assets/img/4-esel.jpg"
												data-src="holder.js/900x400?theme=industrial"
												alt="Second slide"/>
												</div>
											</div>
											<a class="carousel-control-prev"
												href="#carouselExampleIndicators" role="button"
												data-slide="prev">
												<span class="carousel-control-prev-icon"
												aria-hidden="true"/>
												<span class="sr-only">Previous</span>
											</a>
											<a class="carousel-control-next"
												href="#carouselExampleIndicators" role="button"
												data-slide="next">
												<span class="carousel-control-next-icon"
												aria-hidden="true"/>
												<span class="sr-only">Next</span>
											</a>
										</div>
										<div class="card-body">
											<h4 class="card-title">Card title</h4>
											<p class="card-text">Some quick example text to build on
												the card title and make up the bulk of the card's
												content.</p>
											<a href="#!" class="btn btn-dark">Go somewhere</a>
										</div>
									</div>
								</article>
							</section>
						</xsl:when>-->
						<xsl:when test="$mode = 'imprint'">
							<!-- impressum, liegt in einem TEI-Datenstrom auf Projektkontext, auch für andere statische datenströme wie about, einleitung, etc. -->
							<section class="row">
								<article class="col-md-12">
									<div class="card mb-3 text-center border-dark">
										<div class="card-body">
											<xsl:apply-templates
												select="document(concat('/context:', $projectAbbr, '/IMPRINT'))/t:TEI/t:text/t:body/t:div"
												/>
											</div>
										</div>
									</article>
								</section>
							</xsl:when>
							<xsl:when test="$mode = 'searchHelp'">
								<!-- Hilfe für die Suche, liegt in einem TEI-Datenstrom auf Projektkontext, auch für andere statische datenströme wie about, einleitung, etc. -->
								<section class="row">
									<article class="col-md-12">
										<div class="card">
											<div class="card-body">
												<xsl:apply-templates
													select="document(concat('/context:', $projectAbbr, '/SEARCH_HELP'))/t:TEI/t:text/t:body/t:div"
													/>
												</div>
											</div>
										</article>
									</section>
								</xsl:when>
								<xsl:when test="$mode = 'project'">
									<section class="row">
										<article class="col-md-4 area_navigator d-md-block">
											<div class="card sticky-contents">
												<div class="card-body">
													<h2>Projekt</h2>
													<ul class="toc">
														<li><a href="#about">O projektu</a></li>
														<li><a href="#goal">Cilji projekta</a></li>
														<li><a href="#workflow">Delovni proces</a></li>
														<li><a href="#fm">Upravljanje z datotekami</a></li>
														<li><a href="#access">Dostopnost</a></li>
													</ul>
												</div>
											</div>
										</article>
										<article class="col-md-8">
											<div class="card" data-mh="group1">
												<div class="card-body">
													<div id="about">	
														<h3>O projektu</h3>												
														<p> <a href="https://www.zal-lj.si/">Historical Archive of Ljubljana</a> is keeping a fond (archival unit of collection) Graščine Fužine (SI_ZAL_LJU/0296; german Herrschaft Fužine). Part of that fond contains a correspondence between members of family Terpinc and their social circle. The collection of 319 letter and 2 travelogues from 19 century, initial scattered, were collected by the archive. The collection of letters is dated between 1825-1858, are written in old gothic font and German language. As primary historical source, they cover the local history of city Ljubljana in the mid 19 century. Majority of letter is corresponded between the spouse Fidelio and Josephina Terpinc (born Češko).</p>
														<p>Korespondenca je bila že fizično objavljena v (<a href="http://www.arhivsko-drustvo.si/wp-content/uploads/2019/01/Viri-št.-41.pdf">Viri št. 41</a>). Ta zajema le del korespondence, ki je ohranjena v Zgodovinskem arhivu Ljubljana v fondu Graščina Fužine (SI_ZAL_LJU/0296). Glavnina pisem je urejena v škatlah 35 in 35a v 12 ovojih. Gre za pisma med sorodniki in prijatelji, le nekaj malega je poslovnih pisem.</p>
														<p>Zaradi obsežnosti je korespondenca vsebinsko razdeljena na družinsko (primarno) in ostalo (sekundarno). Primarna je pomembnejša, ker je nastala znotraj (sorodstveno) tesneje povezanega kroga ljudi, v ospredju pa so način komunikacije, teme »pogovorov« in osebnostne značilnosti ter nagnjenja posameznikov, ki so na ta način jasneje in bolj osebno predstavljeni. Sekundarna korespondenca (pisma prijateljev in znancev) je časovno bolj razpršena, saj obsega daljše obdobje (1823–1875), pogosto nima »rdeče niti« pogovorov oz. dogodkov, korespondenti pa so med seboj v različno intenzivnih stikih. Ta pisma bodo počakala na objavo v prihodnje.</p>
														<p>Transkripcije pisem v publikaciji Viri so označene z zaporednimi številkami, ki se ujemajo z digitalizati originalov na tej spletni strani. Oboji si sledijo kronološko, medtem ko je originalno gradivo v fondu Graščina Fužine urejeno glede na korespondente.</p>
													</div>	
													<div id="goal">	
														<h3>Project Goal</h3> 
														<ol>
															<li>
																<h2>Archival Source Publishing</h2>
																<p>
																	With the existence of a partial printed edition of letters, the idea arose to create a digital version of the letter collection.
																</p>
																<p>
																	With the creation of a digital edition, we aim to make archival materials more widely available for researchers, scholars, enthusiasts, and students through new digital media. Not everybody reads old gothic font. We can add extra interactive information to the text to help understand the text better (abbreviations, descriptions of people, places). There is also the “problem of being lost in the crowd”. If the archival materials are not properly described, equipped with proper metadata, they can be easily missed when searched for. We can even say they “don’t exist”. This is a way to put some important materials more into focus.
																</p>
																<p>
																	With that, the goal is to offer a user a letter facsimile with transcription of the annotated text. The annotation's main purpose is to offer a reader additional information for easier understanding of the content in the scope of historical distance. The goal is to present letters through the prism of time, space, and people involved.
																</p>
																<blockquote>
																	<p>“The primary aim of the annotations is to bridge the historic distance between the present reader and the author and recipients of the letters so that the text is comprehensible and readable. The annotations focus on filling any gaps in the knowledge of the readers of this edition. In writing the annotations, we took account of what our predecessors have done with the letters.”</p>
																	<footer>Source: <a href="http://vangoghletters.org/vg/about_5.html">vangoghletters.org</a></footer>
																</blockquote>
															</li>
															<li>
																<h2>Easier Management of Collection</h2>
																<p>
																	Easier management of the collection with features such as advanced search, annotation, correspsearch, etc., gives countless options for advanced and faster processing of the letters not only for the users but also for the manager of the collection. This is especially important when thinking of organizing the structure of physical letters. The digital version gives us the option to present letters either through a timeline (from the earliest to the newest letter) or by correspondents (there are more than only two senders and receivers).
																</p>
															</li>
															<li>
																<h2>Connecting the Letter Edition</h2>
																<p>
																	Using the <code>&lt;correspDesc&gt;</code> tag in the context of Correspondence Metadata Interchange Format and correspSearch web service can give the letter collection additional value. Not only do we put letters in context, but we also give them structural organization form and show relationships and connections between individual letters. Additionally, it gives us the possibility to create CMIF format in the future with which we can put the letters of a single collection in the context of others' letters with CMIF standard applied.
																</p>
															</li>
															<li>
																<h2>Preserving the Original</h2>
																<p>
																	If people use a digital edition instead of the original physical papers, the state of the original can be preserved better. Less physical usage means a better condition of the original for the future.
																</p>
															</li>
															<li>
																<h2>Availability</h2>
																<p>
																	With a digital edition, we make materials accessible all the time (literally 24/7). So more users can use the same material at the same time.
																</p>
															</li>
															<li>
																<h2>Long-time Preservation</h2>
																<p>
																	With creating a digital adequate copy of the original material, we can also think of long-time preservation of the material. As paper is slowly disintegrating through time, a digital copy does not. There are other problems with digital preservation, which can be better explained in the MA. We can always follow the logic: better to have two objects to preserve than only one or none.
																</p>
															</li>
															<li>
																<h2>Creating a Workflow for Archive, Including Archive Personnel</h2>
																<p>
																	Creating an example “pilot project” on how to make a digital edition with limited sources in the archive. With that example workflow, other editions can be then derived from it. Including employees of the archive in the working group to help adapt materials. With that, building a digital culture inside the archive. Sharing awareness of possible open source, available digital tools (Transkribus), and technologies (XML, XSLT, web technologies).
																</p>
															</li>
														</ol>
													</div>											
													<div id="workflow">	
														<h3>Workflow</h3>
														<ol>
															<li>
																<h2>Digitization</h2>
																<p>
																	The letters were digitized in-house with a scanner EPSON DS-50000 in .tiff format with 300 dpi.
																</p>
															</li>
															<li>
																<h2>Transcribing</h2>
																<p>
																	As the letters are written in old gothic font, they were transcribed for the first part of the published printed edition. Those transcribed letters were then used to build an HTR model with the software Transkribus (<a href="https://transkribus.eu/Transkribus/">transkribus.eu</a>). The letters were imported into the program with the built-in import tool. Each letter was run through layout analysis (which defines the text area of the digitized letter), and the transcribed text was then copy-pasted to the connected letter and checked.
																</p>
																<p>
																	The HTR model was built for automatic transcription using 65 letters (21,189 words). The CER (Character Error Rate) is recorded at 5.06%. We can advocate the invested time for building a model with the time savings when transcribing the "still not transcribed letters." The first is the automatic transcription of the letter with the HTR model. Then the letter is manually checked and corrected, a so-called semi-automatic transcribing. With additional letters transcribed and manually checked, we can then develop a better and more efficient HTR model.
																</p>
															</li>
															<li>
																<h2>Exporting TEI XML</h2>
																<p>
																	Transkribus offers customizable export options. Main options are "Server export" and "Client export". Both options offer .pdf, TEI, DOCX, simple TXT exports. One difference is in TEI export (which was important for the export process in this project). "Server export" doesn’t allow any preference changes to TEI export, on the other hand, "Client export" allows changes to zone tags (defining which zone to use, either region, line, word, or no zone) and also tags for a line break (option between <code>&lt;l&gt;</code> and <code>&lt;lb&gt;</code> tag). There is also an option to include the image name as the xml:id attribute in the <code>&lt;pb&gt;</code> tag.
																</p>
																<p>
																	When using "server export," the export tool sometimes provided unfinished results (empty .xml files, the reason why was not discovered). In the project, the export was done with the "client export" option, letter by letter with predefined options (Zone per line; Image names as <code>&lt;pb&gt;</code> xml:id; Line breaks <code>&lt;lb&gt;</code>).
																</p>
															</li>
															<li>
																<h2>Adapting the XML File</h2>
																<p>
																	The exported .xml was TEI compliant; however, some adjustments were needed to be done to become the desired form of a letter, which affects the end process of publishing the letters online.
																</p>
																<p>
																	The xml_modification.xsl was created to use XSLT transformation. The file is available in materials and it is commented for understanding.
																</p>
																<p>
																	Main adjustments of the xml_modification.xsl are:
																</p>
																<ul>
																	<li>Copying the prepared external header in each letter with <code>&lt;fileDesc&gt;</code> and <code>&lt;profileDesc&gt;</code> information (the information that are the same for each letter)</li>
																	<li>Adding <code>&lt;div type=”letter”&gt;</code> and <code>&lt;p&gt;</code> tags to represent the letter form</li>
																	<li>Removing the repeating <code>&lt;facsimile tag&gt;</code> and copying its xml:id attribute into <code>&lt;surface&gt;</code> tag for each .jpg file</li>
																</ul>
															</li>
															<li>
																<h2>Manual Annotating</h2>
																<p>
																	Examples of already published digital edition were researched. Main sources:
																	<ul>
																		<li><a href="https://ride.i-d-e.de/issues/issue-10/">ride.i-d-e.de</a></li>
																		<li><a href="https://encoding-correspondence.bbaw.de/v1/">encoding-correspondence.bbaw.de</a></li>
																		<li><a href="https://journals.openedition.org/jtei/1742">journals.openedition.org</a></li>
																		<li><a href="http://vangoghletters.org">vangoghletters.org</a></li>
																		<li><a href="https://edition-humboldt.de/">edition-humboldt.de</a></li>
																		<li><a href="https://www.jeanpaul-edition.de/">jeanpaul-edition.de</a></li>
																	</ul>
																</p>
																<p>
																	A standalone document (Annotation.docx; part of materials) was created as an internal guideline. In the document are noted the main used annotations, examples, and rules on how to use them.
																</p>
																<p>
																	Here ends the step that was done for the project.
																</p>
															</li>
															<li>
																<h2>Publishing</h2>
																<p>
																	The next step is the form and means of how to publish the letters. That part still needs to be put into a practical example.
																</p>
															</li>
														</ol>
													</div>
													<div id="fm">	
														<h3>Files Managment</h3> 
													</div>
													<div id="access">	
														<h3>Accesibility</h3> 
													</div>											
												</div>
											</div>
										</article>
									</section>
								</xsl:when>
								<xsl:when test="$mode = 'list_letters'">
									<section class="row">
										<article class="col-md-12 ">
											<div class="card">
												<div class="card-body">
													<div id="results">
														<ol class="result">
															<xsl:call-template name="results"/>
														</ol>
													</div>
												</div>
											</div>
										</article>													
									</section>						
								</xsl:when>
								<xsl:when test="$mode = 'osebe'">
									<section class="row">
										<article class="col-md-12 ">
											<div class="card">
												<div class="card-body">
													<p>TEST osebe</p>
												</div>
											</div>
										</article>													
									</section>						
								</xsl:when>
								<xsl:when test="$mode = 'kraji'">
									<section class="row">
										<article class="col-md-12 ">
											<div class="card">
												<div class="card-body">
													<p>TEST kraji</p>
												</div>
											</div>
										</article>													
									</section>						
								</xsl:when>
								<xsl:when test="$mode = 'about'">
									<section class="row">
										<article class="col-md-12 ">
											<div class="card">
												<div class="card-body">
													<h3>Informacije o odgovornosti</h3>
        <div>  
          <p> Jože Glavič (<a target="_blank" href="mailto:joze.glavic@zal-lj.si">joze.glavic@zal-lj.si</a>) <br/>Zgodovinski arhiv Ljubljana</p>
          <p> Zgodovinski arhiv Ljubljana Enota za Dolenjsko in Belo krajino <br/> Skalickega ulica 1 (grad Grm)<br/> 8000 Novo mesto<br/> Slovenija<br/> Tel: +386 40 854 376<br/></p>
          <p>Digitalna izdaja objave pisem je bila izdelana v okviru zaključne naloge magisterska študija digitalne humanistike v okviru Univerze v Grazu (Avstrija). Naloga je bila izvedena pod mentorstvom Univ.-Prof. Dr.phil. M.A. Georg Vogelerja. Trenutno je objavljeno le del pisem. Korpus pisem se bo postpoma dopolnjeval.</p>
          <p> Vso odgovornost za tehnično izvedbo in spremna besedila nosi avtor te spletne strani. Originalno transkripcijo pisem s spremno študijo je opravila Nataša Budna Kodrič. Ta so bila objavljena v <a href="http://www.arhivsko-drustvo.si/wp-content/uploads/2019/01/Viri-št.-41.pdf">Viri št. 41</a>. Anotacijo in opremljanje z metapodatki je opravil Jože Glavič.</p>
        </div>        
        <div>
          <h3>Tehnična infrastruktura</h3>
          <p>
            <a target="_blank" href="https://gams.uni-graz.at/"> GAMS-Geisteswissenschaftliches Asset Management
              System </a>
          <p>
            <a target="_blank" href="http://informationsmodellierung.uni-graz.at"> Zentrum für
              Informationsmodellierung - Austrian Centre for Digital Humanities </a>
          </p>
          </p>
        </div>
        <div>
          <h3>Identifikacija</h3>
          <p> Permalink: tbd<br/> Handle: tbd </p>
        </div>       
      
												</div>
											</div>
										</article>													
									</section>						
								</xsl:when>
								<xsl:when test="$mode = 'search'">
									<!-- muss auch im project-search kopiert werden, damit die felderbox auch bei den ergebnissen stehen bleibt. wenn ein projekt keine erweiterte suche hat, kann man das ignorieren -->
									<section class="row">
										<article class="col-md-5">
											<div class="card">
												<div class="card-body">
													<div class="advancedSearch">
														<h3>Erweiterte Suche</h3>
														<div id="backStart">
															<form method="get" name="g3search" role="form"
																action="/search/gsearch">
																<!-- ////////////////////// -->
																<div class="input-group form-group">
																	<input type="text" class="form-control"
																		placeholder="Volltextsuche" id="query2"
																		name="query"/>
																		<div class="input-group-append">
																			<span class="input-group-text" id="basic-addon">
																				<a
																					href="/archive/objects/context:{$projectAbbr}/methods/sdef:Context/get?mode=searchHelp"
																					>?</a>
																				</span>
																			</div>
																		</div>
																		<!-- ////////////////////// -->
																		<div class="form-group">
																			<label for="exampleSelect1">Example select</label>
																			<select class="form-control" id="exampleSelect1">
																				<option>1</option>
																				<option>2</option>
																				<option>3</option>
																				<option>4</option>
																				<option>5</option>
																			</select>
																		</div>
																		<!-- ////////////////////// -->
																		<div class="form-group">
																			<label for="exampleSelect2">Mutiple select list
																				(hold shift to select more than one):</label>
																				<select multiple="multiple" class="form-control"
																					id="sel2" name="sellist2">
																					<option>1</option>
																					<option>2</option>
																					<option>3</option>
																					<option>4</option>
																					<option>5</option>
																				</select>
																			</div>
																			<!-- ////////////////////// -->
																			<div class="form-group">
																				<label for="exampleTextarea">Example
																					textarea</label>
																					<textarea class="form-control"
																						id="exampleTextarea" rows="3">
																						<xsl:text> </xsl:text>
																					</textarea>
																				</div>
																				<fieldset class="form-group">
																					<legend>Radio buttons</legend>
																					<div class="form-check">
																						<label class="form-check-label">
																							<input type="radio" class="form-check-input"
																								name="optionsRadios" id="optionsRadios1"
																								value="option1"/> 1 </label>
																							</div>
																							<div class="form-check">
																								<label class="form-check-label">
																									<input type="radio" class="form-check-input"
																										name="optionsRadios" id="optionsRadios2"
																										value="option2"/> 2 </label>
																									</div>
																									<div class="form-check disabled">
																										<label class="form-check-label">
																											<input type="radio" class="form-check-input"
																												name="optionsRadios" id="optionsRadios3"
																												value="option3"/> 3 </label>
																											</div>
																										</fieldset>
																										<div class="form-group">
																											<button type="submit" class="btn btn-default"
																												>Suche</button>
																												<xsl:text> </xsl:text>
																												<button type="reset" class="btn btn-default"
																													>Zurücksetzen</button>
																												</div>
																												<input type="hidden" name="hitPageSize"
																													id="hitPageSize" value="10"/>
																													<input type="hidden" name="hitPageStart"
																														id="hitPageStart" value="1"/>
																														<input type="hidden" id="pid" name="pid"
																															value="epsg"/>
																															<input type="hidden" id="mode" value="search"/>
																															<input type="hidden" name="search"
																																value="advanced"/>
																																<input type="hidden" name="x2">
																																	<xsl:attribute name="value">
																																		<xsl:value-of select="$searchXsl"/>
																																	</xsl:attribute>
																																</input>
																															</form>
												<!--<form method="get" name="g3search" role="form" action="/search/gsearch">
												
												<div class="form-group">
												<div class="input-group">
												<input type="text" class="form-control"
												placeholder="Volltextsuche" id="query2"
												name="query"/>
												<span class="input-group-addon">
												<a
												href="/archive/objects/context:{$projectAbbr}/methods/sdef:Context/get?mode=searchHelp"
												>?</a>
												</span>
												</div>
												</div>
												<div class="form-group">
												<label for="selectbasic">Select Basic</label>
												<select id="selectbasic" name="selectbasic"
												class="form-control">
												<option value="1">Option one</option>
												<option value="2">Option two</option>
												</select>
												</div>
												<div class="form-group">
												<label for="selectbasic">Select Multiple</label>
												<select multiple="" class="form-control">
												<option>1</option>
												<option>2</option>
												<option>3</option>
												<option>4</option>
												<option>5</option>
												</select>
												</div>
													
													
												<div class="form-group">
												<label class="radio-inline">
												<input type="radio" name="inlineRadioOptions"
												id="inlineRadio1" value="option1"/> 1 </label>
												<label class="radio-inline">
												<input type="radio" name="inlineRadioOptions"
												id="inlineRadio2" value="option2"/> 2 </label>
												<label class="radio-inline">
												<input type="radio" name="inlineRadioOptions"
												id="inlineRadio3" value="option3"/> 3 </label>
												</div>
													
													
													
												<div class="form-group">
												<button type="submit" class="btn btn-default"
												>Suche</button>
												<xsl:text> </xsl:text>
												<button type="reset" class="btn btn-default"
												>Zurücksetzen</button>
												</div>
												<input type="hidden" name="hitPageSize"
												id="hitPageSize" value="10"/>
												<input type="hidden" name="hitPageStart"
												id="hitPageStart" value="1"/>
												<input type="hidden" id="pid" name="pid"
												value="epsg"/>
												<input type="hidden" id="mode" value="search"/>
												<input type="hidden" name="search"
												value="advanced"/>
												<input type="hidden" name="x2">
												<xsl:attribute name="value">
												<xsl:value-of select="$searchXsl"/>
												</xsl:attribute>
												</input>
											</form>-->
										</div>
									</div>
								</div>
							</div>
						</article>
					</section>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="content"/>
				</xsl:otherwise>
			</xsl:choose>
		</main>
		<footer class="footer">
			<div class="container">
				<div class="row">
					<div class="col-md-6">
						<h6>Dodatne informacije</h6>
						<p>									
							<a
								href="/archive/objects/context:{$projectAbbr}/methods/sdef:Context/get?mode=about"
								>Informacije o odgovornosti</a>
							</p>
							<div class="icons">
								<a href="/" target="_blank">
									<img class="footer_icons"
										src="{$gamsAssetsRootPath}/img/gamslogo_weiss.gif" height="48"
										title="{$gams}" alt="{$gams}"/>
									</a>
									<a href="https://informationsmodellierung.uni-graz.at/"
										target="_blank">
										<img class="footer_icons" src="{$gamsAssetsRootPath}/img/ZIM_weiss.png"
											height="48" title="{$zim-acdh}" alt="{$zim-acdh}"/>
										</a>
										<a href="http://creativecommons.org/licenses/by-nc/4.0/"
											target="_blank">
											<img class="footer_icons" src="{$gamsAssetsRootPath}/img/by-nc.png"
												height="45" title="Lizenz" alt="Lizenz"/>
											</a>
										</div>
									</div>
									<div class="col-md-6">
										<h6>Kontakt</h6>
										<p>Zgodovinski arhiv Ljubljana <br/>Trdinova ulica 4 <br/>1001 Ljubljana 
										<br/>Slovenija
									</p>
									<p>
										<a href="mailto:zal@zal-lj.si">zal@zal-lj.si</a> <br/>
										Jože Glavič, <a href="mailto:joze.glavic@zal-lj.si">joze.glavic@zal-lj.si</a> 
									</p>
								</div>
							</div>
						</div>
					</footer>
				</body>
			</html>
		</xsl:template>
	</xsl:stylesheet>
