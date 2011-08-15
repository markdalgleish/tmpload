/*
tmpload jQuery Plugin v1.1
Copyright 2011, Mark Dalgleish

This content is released under the MIT License
github.com/markdalgleish/tmpload/blob/master/MIT-LICENSE.txt
*/
(function($, undefined) {
    //Template cache
    var templates = {};

    $.tmpload = function(obj, url) {
        if (url === undefined) {
            //Declaring template(s)
            if (typeof obj === "object") {
                if (obj.length) {
                    //Array of declaration objects
                    for (var i = 0; i < obj.length; i++) {
                        templates[obj[i].name] = obj[i].url;
                    }
                } else {
                    //A single declaration object
                    templates[obj.name] = obj.url;
                }
            }
            //Loading the template
            else if (typeof obj === "string") {
                if (typeof templates[obj] === "string") {
                    //The template hasn't been loaded yet
                    return templates[obj] = $.Deferred(function(dfd) {
                        $.get(templates[obj]).success(function(d) {
                            dfd.resolve($.template(obj, d));
                        }).error(function(d) {
                            dfd.reject(d);
                        });
                    }).promise();
                } else {
                    //The template has already been cached
                    return templates[obj];
                }
            }
        //Declaring a single template
        } else {
            templates[obj] = url;
        }
    };
})(jQuery);