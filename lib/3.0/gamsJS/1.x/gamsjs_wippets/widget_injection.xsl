<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0" exclude-result-prefixes="#all">
    
    <doc xmlns="http://www.oxygenxml.com/ns/doc/xsl" id="injectTripleForm">
        <desc>Handles injection of gamsJs-environment's Triple Form. Creates a form according to given configuration object 
            that specifies the creation of an html formular. Eeach form-field is linked to an "$" subparameter inside 
            the REST "params" pathvariable.  
            Creates the required render element and handles the assignment of the javascript configuration object. 
            External Dependencies:
            - Bootstrap 4 (css only)
            - Customization via external CSS and JSON Schema.
        </desc>
        <param name="config">Configuration object for the Triple Form</param>
        <param name="addContainerInternally">Undefined | Defined : If '' = no parameter given, then the template will render the widget's container.</param>
    </doc>
    <xsl:template name="injectTripleForm">
        <xsl:param required="no" name="config"/>
        <xsl:param required="no" name="addContainerInternally"/>
        <xsl:variable name="widgetId">GAMS_WIDGET_TRIPLEFORM</xsl:variable>
        
        <!-- 01. Handle creation of external HTML requirements.-->
        <xsl:call-template name="_addExternalHtml">
            <xsl:with-param name="widgetId"><xsl:value-of select="$widgetId"/></xsl:with-param>
            <xsl:with-param name="widgetConfig"><xsl:value-of select="$config"/></xsl:with-param>
            <xsl:with-param name="addContainerOnCall"><xsl:value-of select="$addContainerInternally"/></xsl:with-param>
        </xsl:call-template>
        
        <!-- 02. Add link + script tags via dependencyMap.xml -->
        <xsl:call-template name="_loadDependencies">
            <xsl:with-param name="widgetName"><xsl:value-of select="$widgetId"/></xsl:with-param>
        </xsl:call-template>
        
    </xsl:template>
    
  
    <doc xmlns="http://www.oxygenxml.com/ns/doc/xsl" id="injectGdasMApp">
        <desc>Handles injection of gamsJs's GdasMApp. Renders the map application according to  given
            configuration object. Relies on GDAS-GeoJson. 
            Creates the required render element and handles the assignment of the javascript configuration object. 
            External Dependencies:
            - Bootstrap 4 (css only)
            - Customization via external CSS and JSON Schema. 
        </desc>
        <param name="config">Configuration object for the triple form.</param>
        <param name="addContainerInternally">Undefined | Defined : If '' = no parameter given, then the template will render the widget's container.</param>
    </doc>
    <xsl:template name="injectGdasMApp">
        <xsl:param required="no" name="config"/>
        <xsl:param required="no" name="addContainerInternally"/>
        <xsl:variable name="widgetId">GAMS_WIDGET_GDASMAPP</xsl:variable>
        
        <!-- 01. Handle creation of external HTML requirements.-->
        <xsl:call-template name="_addExternalHtml">
            <xsl:with-param name="widgetId"><xsl:value-of select="$widgetId"/></xsl:with-param>
            <xsl:with-param name="widgetConfig"><xsl:value-of select="$config"/></xsl:with-param>
            <xsl:with-param name="addContainerOnCall"><xsl:value-of select="$addContainerInternally"/></xsl:with-param>
        </xsl:call-template>
        
        <!-- 02. Add link + script tags via dependencyMap.xml -->
        <xsl:call-template name="_loadDependencies">
            <xsl:with-param name="widgetName">GAMS_WIDGET_GDASMAPP</xsl:with-param>
        </xsl:call-template>
        
    </xsl:template>
    
    <doc xmlns="http://www.oxygenxml.com/ns/doc/xsl" id="injectCalendar">
        <desc>Handles injection of gamsJs's ZIMCalendar. Renders the calendar application according to  given
            configuration object. Relies on specific JSON. 
            Creates the required render element and handles the assignment of the javascript configuration object. 
            External Dependencies:
            - Bootstrap 4 (css only)
            - Customization via external CSS and JSON Schema.
        </desc>
        <param name="config">Configuration object for the triple form (see: )</param>
        <param name="addContainerInternally">Undefined | Defined : If '' = no parameter given, then the template will render the widget's container.</param>
    </doc>
    <xsl:template name="injectCalendar">
        <xsl:param required="no" name="config"/>
        <xsl:param required="no" name="addContainerInternally"/>
        <xsl:variable name="widgetId">GAMS_WIDGET_CALENDAR</xsl:variable>
        
        <!-- 01. Handle creation of external HTML requirements.-->
        <xsl:call-template name="_addExternalHtml">
            <xsl:with-param name="widgetId"><xsl:value-of select="$widgetId"/></xsl:with-param>
            <xsl:with-param name="widgetConfig"><xsl:value-of select="$config"/></xsl:with-param>
            <xsl:with-param name="addContainerOnCall"><xsl:value-of select="$addContainerInternally"/></xsl:with-param>
        </xsl:call-template>
        
        <!-- 02. Add link + script tags via dependencyMap.xml -->
        <xsl:call-template name="_loadDependencies">
            <xsl:with-param name="widgetName" select="$widgetId"></xsl:with-param>
        </xsl:call-template>
    </xsl:template>
    
    
    <doc xmlns="http://www.oxygenxml.com/ns/doc/xsl" id="_loadDependencies">
        <desc>
            Intern function that loads needed dependencies for the widgets. Requests a dependencyMap.xml and loads
            stated files into html.
        </desc>
        <param name="widgetName">Name / id of widget to be called from the dependencyMap.xml</param>
    </doc>
    <xsl:template name="_loadDependencies">
        <xsl:param required="yes" name="widgetName"></xsl:param>
        <xsl:variable name="depMapPath">
            <xsl:value-of select="'/lib/3.0/gamsJS/1.x/gamsjs_wippets/dependencyMap.xml'"/>
        </xsl:variable>
        <xsl:for-each select="document($depMapPath)/widgets/widget[@id=$widgetName]/dependencies//*">
            <xsl:copy-of select="current()"></xsl:copy-of>
        </xsl:for-each>
    </xsl:template>
    
    <doc xmlns="http://www.oxygenxml.com/ns/doc/xsl" id="_addExternalHtml">
        <desc>
            Intern function that handles assignment of required html content for the 
            individual widgets.
        </desc>
        <param name="widgetId">Id of the widget container</param>
        <param name="widgetConfig">JSON based config for the widget</param>
        <param name="addContainerOnCall">Undefined | Defined : If '' renders element with given widgetId.</param>
    </doc>
    <xsl:template name="_addExternalHtml">
        <xsl:param required="yes" name="widgetId"></xsl:param>
        <xsl:param required="no" name="widgetConfig"></xsl:param>
        <xsl:param required="no" name="addContainerOnCall"/>
        
        <!-- 01. Add container if chosen -->
        <xsl:if test="$addContainerOnCall = ''">
            <div id="{$widgetId}"><xsl:text> </xsl:text></div>    
        </xsl:if>
        
        <!-- 02. If a config was given assign to window object -->
        <xsl:if test="$widgetConfig != ''">
            <script>
                window.<xsl:value-of select="$widgetId"/> = <xsl:value-of select="$widgetConfig"/>
            </script>
        </xsl:if>
    </xsl:template>
    
</xsl:stylesheet>