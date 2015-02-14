'use strict';

var
  LIVERELOAD_PORT = 35730,
  lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
  }),
  modRewrite = require('connect-modrewrite'),
  proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest,
  mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-ngmin');

  grunt.initConfig({
    watch: {
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
            return [proxySnippet, lrSnippet, mountFolder(connect, './')];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>/'
      }
    },

    // ngmin: {
    //   controllers: {
    //     src: ['lifesalestool/scripts/controllers/**/*.js'],
    //     dest: 'dist-ngmin/lifesalestool/controllers/'
    //   },
    //   directives: {
    //     src: ['lifesalestool/scripts/directives/**/*.js'],
    //     dest: 'dist-ngmin/lifesalestool/directives.js'
    //   }
    // }
  });

  grunt.registerTask('server', function() {
    grunt.task.run([
      'configureProxies:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('default', ['server']);
};