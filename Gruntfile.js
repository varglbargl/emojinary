module.exports = function(grunt) {
  // 1. All configuration goes here
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'src/emojinary.js',
          'src/SplashController.js',
          'src/LobbyController.js',
          'src/GameController.js'
        ],
        dest: 'public/src/build.js'
      }
    },

    uglify: {
      build: {
        src: 'public/src/build.js',
        dest: 'public/src/build.js'
      }
    }
  });

  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['concat', 'uglify']);

};
