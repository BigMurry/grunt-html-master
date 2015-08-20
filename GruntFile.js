module.exports = function(grunt){
	grunt.initConfig({
		masterify:{
			dist:{
				src: 'test/template.html',
				dest:'test/result.html',
				options:{
					masters:{
						master1:'test/master.html'
					}
				}
			}
		}	
	});

	grunt.loadTasks('tasks');
	
	grunt.registerTask('default',['masterify']);
};
