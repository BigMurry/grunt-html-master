module.exports = function (grunt) {
    var _ = require('lodash'),
        EOL = grunt.util.linefeed,
        path = require('path'),
        beautify = require('js-beautify'),

    //Tags Regular Expressions
        regexTagStartTpl = "<!--\\s*%parseTag%:(\\w+)\\s*([^\\s]*)\\s*-->", // <!-- masterify:{type} {name} -->
        regexTagEndTpl = "<!--\\s*\\/%parseTag%\\s*-->", // <!-- /masterigy -->,
        regexTagStart = '',
        regexTagEnd = '',
        isFileRegex = /\.(\w+){2,4}$/;

    function isEmptyObject(obj) {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }

    function setTagRegexes(parseTag) {
        regexTagStart = regexTagStartTpl.replace(/%parseTag%/, function () {
            return parseTag
        });
        regexTagEnd = regexTagEndTpl.replace(/%parseTag%/, function () {
            return parseTag
        });
    }

    function getMasterifyTag(content, callback) {
        var lines = content.replace(/\r\n/g, '\n').split('\n'),
            tag = false,
            tags = [],
            last;
        lines.forEach(function (l) {
            var tagStart = l.match(new RegExp(regexTagStart)),
                tagEnd = new RegExp(regexTagEnd).test(l);
            if (tagStart) {
                tag = true;
                last = {
                    type: tagStart[1],
                    name: tagStart[2],
                    lines: []
                };
                tags.push(last);
            }
            if (tag && tagEnd) {
                last.lines.push(l);
                tag = false;
            }
            if (tag && last) {
                last.lines.push(l);
            }
        });
        if (callback && typeof callback === 'function') {
            return callback(tags);
        }
    }

    function transformContent(content, params, dest) {
        var raw = content;
        var frag = getMasterifyTag(content, function (tags) {
            var frag = {};
            tags.forEach(function (tag) {
                if (tag.type === 'master') {
                    frag[tag.type] = tag.name;
                } else if(tag.type === 'fortag') {
                    frag[tag.name] = tag.lines.slice(1,tag.lines.length-1).join(EOL);
                }
            });
            return frag;
        });
        if (!frag['master']) {
            return raw;
        } else {
            var masterSrc = params.masters[frag['master']];
            var masterContent = grunt.file.read(masterSrc).toString();
            return masterContent.replace(new RegExp(regexTagStart, 'g'), function (_, type, tag) {
                if (type !== 'tag') {
                    return '';
                } else {
                    return frag[tag];
                }
            });
        }
    }

    grunt.registerMultiTask('masterify', "Grunt Master HTML - build html page skeleton by using master template", function () {

        var params = this.options({
            beautify:false,
            masters: {},
            parseTag: 'masterify'
        });
        grunt.log.debug('passed params: \n'+ JSON.stringify(params));
        setTagRegexes(params.parseTag);

        this.files.forEach(function (file) {

            var dest = file.dest || '',
                destPath, content;
            file.src.forEach(function (src) {
                if (isFileRegex.test(dest)) {
                    destPath = dest;
                } else {
                    destPath = path.join(dest, path.basename(src));
                }

                grunt.log.debug('start transform: ' + src);
                content = transformContent(grunt.file.read(src), params, dest);
                grunt.log.debug('end transform: ' + src);

                if(params.beautify){
                    content = beautify.html(content, _.isObject(params.beautify)?params.beautity:{});
                }
                grunt.file.write(destPath, content);
                grunt.log.ok('File ' + destPath + 'created!');
            });
        });
    });

};
