module.exports = function(grunt){
	var _ = require('lodash'),
        EOL = grunt.util.linefeed,
		path = require('path'),

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
            regexTagStart = regexTagStartTpl .replace(/%parseTag%/, function () { return parseTag });
            regexTagEnd = regexTagEndTpl .replace(/%parseTag%/, function () { return parseTag });
        }

        function getMasterifyTag(content, callback){

        }

		function transformContent(content, params, dest){
            var config = grunt.config();
            getMasterifyTag(content, function(tags, master){
                var masterSrc = params.masters[master];
                var masterContent = grunt.file.read(masterSrc);
                handlerMaster(masterContent, function(masterRaw, masterTags){
                    masterTags.forEach(function(masterTag){
                        if(!isEmptyObject(tags[masterTag])){

                        }
                    });
                });
            });

		}

		grunt.registerMultiTask('masterify', "Grunt Master HTML - build html page skeleton by using master template", function(){

			var params = this.options({
				masters:{},
				parseTag:'masterify'
			});

			setTagRegexes(params.parseTag);

			this.files.forEach(function(file){

				var dest = file.dest || '',
					destPath, content;
				file.src.forEach(function(src){
					if(isFileRegex.test(dest)){
						destPath = dest;
					}else{
						destPath = path.join(grunt.file.read(src), path.basename(src));
					}

					content = transformContent(grunt.file.read(src), params, dest);

					grunt.file.write(destPath, content);
					grunt.log.ok('File ' + destPath + 'created!');
				});
			});
		});

};
