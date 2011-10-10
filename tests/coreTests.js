var localTplToLoad = 'local-template';
var remoteTplToLoad = 'remote-template';
var remoteTplUrl = '../templates/test-template.html';

module("Core functionality",
    {
        setup: function() {
            
        },
        teardown: function() {
            
        }
    }
);

test("Local template gets loaded and returned", function () {
    var html = $.tmpload({id: localTplToLoad});
    equal($('#' + localTplToLoad).html(), html, 'The content of the loaded template is the same as the one from the DOM.');
});

test("The template name can begin with a # char", function () {
    var html = $.tmpload({id: '#' + localTplToLoad});
    equal($('#' + localTplToLoad).html(), html, 'The content of the loaded template is the same as the one from the DOM.');
});

test("An exception should be raised if the a template id or url was not specified", function () {
    var exception = {
        name: 'Invalid template',
        error: 'A template name or url should be specified.'
    };
    raises(function () {$.tmpload();}, function (err) {return err.name === exception.name;}, 'Raises error on template key not found');
});

test("An exception should be raised if the template is not found in the DOM", function () {
    var exception = {
        name: 'Template not found',
        error: 'A local template with the id "unexistent-template" could not be found in the DOM.'
    };
    raises(function () {$.tmpload({id: 'unexistent-template'});}, function (err) {return err.name === exception.name;}, 'Raises error on template not found');
});

asyncTest("Remote template gets loaded and returned", function () {
    $.tmpload({
        url: remoteTplUrl,
        onLoad: function (template) {
            equal(template, $('#' + remoteTplToLoad).html().replace("&gt;", '>').replace("&lt;", '<'), 'The content of the remote loaded template is the same as the one from the DOM.');
            start();
        }
    });
});

asyncTest("The template should be cached when queryed the second time", function () {
    equal($.tmpload.templates[remoteTplUrl], $('#' + remoteTplToLoad).html().replace("&gt;", '>').replace("&lt;", '<'), 'The template exists in memory cache.');
    $.tmpload({
        url: remoteTplUrl,
        onLoad: function (template) {
            equal(template, $('#' + remoteTplToLoad).html().replace("&gt;", '>').replace("&lt;", '<'), 'The content of the remote loaded template is the same as the one from the DOM.');
            start();
        }
    });
});

test("A compiled template object should be returned if specified in the options", function () {
    delete $.tmpload.templates[localTplToLoad];
    var compiledObject = $.tmpload({id: localTplToLoad, tplWrapper: _.template});
    equal($('#' + localTplToLoad).html().replace('<%=name %>', 'Dumitru'), compiledObject({name: 'Dumitru'}), 'The content of the compiled template is the same as the one from the DOM and has the "name" var replaced by "Dumitru".');
});