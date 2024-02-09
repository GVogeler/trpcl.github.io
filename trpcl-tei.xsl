<?xml version="1.0" encoding="UTF-8"?>
<!-- 
    Project: GAMS Projekttemplate
    Company: ZIM-ACDH (Zentrum für Informationsmodellierung - Austrian Centre for Digital Humanities)
 -->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:s="http://www.w3.org/2001/sw/DataAccess/rf1/result" xmlns="http://www.w3.org/1999/xhtml"
    xmlns:t="http://www.tei-c.org/ns/1.0" xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
    xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:lido="http://www.lido-schema.org" 
    xmlns:teix="http://www.tei-c.org/ns/Examples"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:oai="http://www.openarchives.org/OAI/2.0/" exclude-result-prefixes="#all">
    
    <xsl:include href="tpcl-static.xsl"/>
    
    
    <!--///////////////////////////////////////////////////////////////////-->
    <!--Stylesheet for presenting the trasncribed letters of family Terpinc-->
    <!--///////////////////////////////////////////////////////////////////--> 
    
    <xsl:output method="xml" indent="yes" encoding="UTF-8"/>
    
    
    
    <xsl:template name="content">
        <section class="row">
            
            
            <!--////////////Letter sender and reciever - correspDesc//////--> 
            
            <div>Od:               
                <xsl:apply-templates select="//tei:correspAction[@type='sent']/tei:persName"/> 
                iz: 
                <xsl:apply-templates select="//tei:correspAction[@type='sent']/tei:placeName"/>
                poslano:<xsl:apply-templates select="//tei:correspAction[@type='sent']/tei:date"/>
            </div>  
            <div>Od:              
                <xsl:apply-templates select="//tei:correspAction[@type='received']/tei:persName"/> 
                iz: 
                <xsl:apply-templates select="//tei:correspAction[@type='received']/tei:placeName"/>
                prejeto: 
                <xsl:apply-templates select="//tei:correspAction[@type='received']/tei:date"/>
            </div>   
            <div class="col-7">
                <xsl:apply-templates select="//tei:text"/>
		    </div>  
            <div class="col">
                <xsl:apply-templates select="//tei:text"/>
            </div> 
        </section>
    </xsl:template>  
    
    
    
    <!--after content-->
    
    
    
    
    
    
    
    <!--Page number of a letter-->
    <xsl:template match="//tei:pb">
        <xsl:for-each select=".">
            <br/>
            <br/>
            <h2 class="mb-2" id="{@xml:id}">
                <xsl:value-of select="@n"/>
            </h2>
        </xsl:for-each>
    </xsl:template>
    
     
    <!--letter styling based on the tei encoding-->
    
    <xsl:template match="tei:opener">         
        <div class="opener-{@rend}" >            
            <xsl:apply-templates/>
        </div> 
    </xsl:template> 
    
    <xsl:template match="tei:closer">         
        <div class="closer-{@rend}" >            
            <xsl:apply-templates/>
        </div> 
    </xsl:template> 
    
    
    <xsl:template match="tei:placeName">         
        <span class="placename" >
            <xsl:apply-templates/>
        </span> 
    </xsl:template> 
    
    <xsl:template match="tei:persName">         
        <span class="persname" >
            <xsl:apply-templates/>
        </span> 
    </xsl:template>    
    
    
    
</xsl:stylesheet>
