'use strict';

var
  LIVERELOAD_PORT = 35730,
  lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
  }),
  mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.initConfig({
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass']
      },
      livereload: {
        files: [
          '{,*/}*.html',
          '{,*/*/}*.html',
          '{,*/*/*/}*.html',
          '{,*/}*.js',
          '{,*/*/}*.js',
          '{,*/*/*/}*.js',
          '{,*/*/*/*/}*.js',
          '{,*/}*.css',
          '{,*/*/}*.css',
          '{,*/*/*/}*.css'
        ],
        options: {
          livereload: LIVERELOAD_PORT
        }
      }
    },
    connect: {
      options: {
        protocol: 'http',
        port: 80,
        hostname: '0.0.0.0',
        logger: 'dev'
      },
      proxies: [],
      livereload: {
        options: {
          middleware: function(connect) {
            return [lrSnippet, mountFolder(connect, './')];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>/'
      }
    },
    sass: {
      dev: {
        options: {
          style: 'expanded',
          compass: true
        },
        files: {
          'app/css/style.css': 'sass/style.scss'
        }
      },
      dist: {
        options: {
          style: 'expanded',
          compass: true
        },
        files: {
          'app/css/style.css': 'sass/style.scss'
        }
      }
    }
  });

  grunt.registerTask('server', function() {
    grunt.task.run([
      'connect:livereload',
      'open',
      'watch'
    ]);
  });


  // grunt.registerTask('default', ['sass']);
  grunt.registerTask('default', ['server']);
};