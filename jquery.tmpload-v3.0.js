(function($) {
    
    $.tmpload = function (options) {
        var self = this, html = null;
        
        options = $.extend({}, $.tmpload.defaults, options);
        
        // Cache a template in the memory
        self.cacheTemplate = function (cacheId, content) {
            $.tmpload.templates[cacheId] = content;
            return cacheId;
        };
        
        // Get a template from memory cache
        self.getCachedTemplate = function (cacheId) {
            return $.tmpload.templates[cacheId];
        };
        
        // Find a template in the DOM, load and cache it
        // Compile the template if a template engine specified
        self.loadLocalTemplate = function (templateId, cacheTemplate, tplWrapper) {
            var $localTemplate = $('#' + templateId);
            
            if ($localTemplate.length) {
                html = tplWrapper ? tplWrapper($localTemplate.html()) : $localTemplate.html();
                cacheTemplate && self.cacheTemplate(templateId, html);
                return html;
            } else {
                var exception = {
                    name: 'Template not found',
                    error: 'A local template with the id "' + options.id + '" could not be found in the DOM.'
                };
                throw exception;
            }
        };
        
        // Request a remote template, load and cache it
        // Compile the template if a template engine specified
        self.loadRemoteTemplate = function (templateUrl, loadCallback, cacheTemplate, tplWrapper) {
            return $.ajax({
                        url: templateUrl,
                        success: function (response) {
                            response = tplWrapper ? tplWrapper(response) : response;
                            cacheTemplate && self.cacheTemplate(templateUrl, response);
                            return $.isFunction(loadCallback) && loadCallback.call(self, response);
                        }
                    });
        };
        
        // Make a template id work without #
        options.id = options.id && options.id.replace(/^#/, '');
        
        // Decide how to load the template - by id or url
        var cacheKey = options.url || options.id;
        
        // Throw an exceptino if no id or url is specified
        if (!cacheKey) {
            throw {
                name: 'Invalid template',
                error: 'A template name or url should be specified.'
            };
        }
        
        // Search for a cached template if wanted
        if (options.cache) {
            html = self.getCachedTemplate(cacheKey);
            if (html) {
                if ($.isFunction(options.onLoad)) {
                    return options.onLoad.call(self, html);
                }
                return html;
            }
        }
        
        // Grab a remote template or a local one
        if (options.url) {
            return self.loadRemoteTemplate(options.url, options.onLoad, options.cache, options.tplWrapper);
        } else {
            return self.loadLocalTemplate(options.id, options.cache, options.tplWrapper);
        }
    };
    
    // Cache container
    $.tmpload.templates = {};
    
    // Default options
    $.tmpload.defaults = {
        id: null,
        url: null,
        cache: true,
        onLoad: null,
        tplWrapper: null
    };
    
})(jQuery);