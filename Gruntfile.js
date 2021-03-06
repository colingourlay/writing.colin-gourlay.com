var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    watch: {
      dist: {
        files: ['dist/**'],
        options: {
          livereload: true
        }
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build']
      },
      compass: {
        files: ['src/styles/**'],
        tasks: ['compass']
      },
      writing: {
        files: ['src/posts/**', 'src/templates/**'],
        tasks: ['writing']
      },
      copy: {
        files: ['src/images/**', 'src/styles/**.css', 'src/styles/webfonts/**', 'src/scripts/**', 'src/favicon.ico'],
        tasks: ['copy']
      }
    },

    writing: {
      dist: {
        meta: {
          title: 'Writing - Colin Gourlay',
          description: 'A collection of writing by full-stack web developer Colin Gourlay',
          author: 'Colin Gourlay',
          url: 'http://writing.colin-gourlay.com',
          lang: 'en'
        },
        templates: 'src/templates',
        posts: 'src/posts',
        dest: 'dist'
      }
    },

    connect: {
      dist: {
        options: {
          port: 8080,
          hostname: 'localhost',
          middleware: function (connect) {
            return [
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
              mountFolder(connect, 'dist'),
              mountFolder(connect, 'src')
            ];
          }
        }
      }
    },

    open: {
      dist: {
        path: 'http://<%= connect.dist.options.hostname %>:<%= connect.dist.options.port %>'
      }
    },

    clean: {
      dist: 'dist'
    },

    compass: {
      options: {
        sassDir: 'src/styles',
        cssDir: 'dist/styles',
        outputStyle: 'compressed',
        environment: 'production'
      },
      dist: {}
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src',
          dest: 'dist',
          src: [
            'images/**',
            'styles/**.css',
            'styles/webfonts/**',
            'scripts/**',
            'favicon.ico'
          ]
        }]
      }
    },

    ftpush: {
      webfaction: {
        auth: {
          host: 'colingourlay.webfactional.com',
          port: 21,
          authKey: 'webfaction'
        },
        src: 'dist',
        dest: 'webapps/writing_colingourlay'
      }
    }

  });

  grunt.registerTask('build', [
    'clean',
    'compass',
    'writing',
    'copy'
  ]);

  grunt.registerTask('server', [
    'build',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('deploy', [
    'ftpush:webfaction'
  ]);

  grunt.registerTask('default', 'server');
};
