/**
* jQuery Tmpload Plugin v2.0
* 
* Copyright 2011, Mark Dalgleish
*
*
* Load and cache local and remote templates
*
*
* @author Mark Dalgleish
* @author Dumitru Glavan
* @link http://dumitruglavan.com
* @version 2.0
* @requires jQuery v1.5 or later
*
* Find source on GitHub: https://github.com/markdalgleish/tmpload
*
* This content is released under the MIT License
*   http://www.opensource.org/licenses/mit-license.php
*
*/
(function($, undefined) {
    
    $.tmpload = function(obj, url, options) {
        
        // Shortcut vars and options setup
        var self = this, templates = $.tmpload.templates, defaults = $.tmpload.defaults;
        options = $.extend(defaults, options);
        
        if (url === undefined) {
            //Declaring template(s)
            if (typeof obj === "object") {
                if (obj.length) {
                    //Array of declaration objects
                    for (var i = 0; i < obj.length; i++) {
                        templates[obj[i].name] = {
                            url: obj[i].url,
                            tpl: null
                        };
                    }
                } else {
                    //A single declaration object
                    templates[obj.name] = {
                        url: obj.url,
                        tpl: null
                    };
                }
            }
            //Loading the template
            else if (typeof obj === "string") {
                if (!templates[obj].tpl) {
                    //The template hasn't been loaded yet
                    
                    // Verify if the template is a local one and grab it by ID from DOM
                    if (templates[obj].url[0] === '#') {
                        var $tplElement = $(templates[obj].url);
                        if ($tplElement.length) {
                            templates[obj].tpl = options.tplWrapper ? options.tplWrapper($tplElement.text()) : $tplElement.text();
                            return templates[obj].tpl;
                        }
                    // If it's a remote template - do an ajax request to grab it
                    } else {
                        return $.Deferred(function(dfd) {
                            $.ajax($.extend(options, {
                                url: templates[obj].url,
                                success: function (d) {
                                    templates[obj].tpl = options.tplWrapper ? options.tplWrapper(d) : d;
                                    dfd.resolve(templates[obj].tpl);
                                },
                                error: function (d) {
                                    dfd.reject(d);
                                }
                            }));
                        }).promise();
                    }
                } else {
                    //The template has already been cached
                    return templates[obj].tpl;
                }
            }
        //Declaring a single template   
        } else {
            templates[obj] = {
                url: url,
                tpl: null
            };
        }
    };
    
    // Cache container
    $.tmpload.templates = {};
    
    // Default options
    $.tmpload.defaults = {
        cache: true,
        tplWrapper: null
    };
    
})(jQuery);