module.exports = function(grunt){
	grunt.initConfig({
		destdir:'test/dist',
		masterify:{
			dist:{
				src: ['test/pages/**/*.html'],
				dest:'<%= destdir %>',
				options:{
					beautify:true,
					masters:{
						master1:'test/masters/master1.html',
						master2:'test/masters/master2.html'
					}
				}
			}
		}	
	});

	grunt.loadTasks('tasks');
	
	grunt.registerTask('default',['masterify']);
};
