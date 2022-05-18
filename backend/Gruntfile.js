module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      options: {
        transform: [
          ['combynify', { root: './src/views' }],
          'babelify'
        ],
        watch: true
      },
      development: {
        options: {
          browserifyOptions: {
            debug: true
          }
        },
        src: 'src/index.js',
        dest: 'build/js/sources.js'
      },
      production: {
        options: {
          browserifyOptions: {
            transform: [
              ['browserify-replace', {
                replace: [
                  { from: /http:\/\/localhost:4000/ig, to: 'https://api.littlebigfamily.com' }
                ]
              }]
            ]
          }
        },
        src: 'src/index.js',
        dest: 'build/js/sources.js',
      }
    },
    clean: {
      build: [
        'build/',
        'dist/',
      ],
      release: [
        'dist/libs/lightbox2/',
        'dist/libs/mediabox/',
        'dist/libs/icons/',
        'dist/libs/toastr/',
      ]
    },
    connect: {
      options: {
        hostname: '0.0.0.0',
        port: 8000
      },
      development: {},
      release: {
        options: {
          keepalive: true,
          base: 'dist'
        }
      },
      test: {
        options: {
          port: 8001
        }
      }
    },
    copy: {
      release: {
        files: [
          {
            cwd: 'src/',
            src: 'assets/**',
            dest: 'dist/',
            expand: true
          },
          {
            cwd: 'src/',
            src: 'libs/**',
            dest: 'dist/',
            expand: true
          },
          {
            src: '*.ico',
            dest: 'dist/',
            expand: true
          },
          {
            src: '.htaccess',
            dest: 'dist/',
            expand: true
          },
          {
            src: 'static/samples/**',
            dest: 'dist/',
            expand: true
          },
        ]
      }
    },
    cssmin: {
      release: {
        files: {
          'dist/styles.min.css': [
            'src/styles/index.css',
            'src/libs/mediabox/index.css',
            'src/libs/icons/index.css',
            'src/libs/toastr/index.css',
            'build/css/src/libs/lightbox2/index.css',
          ]
        }
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      development: [
        'src/**/*.js'
      ]
    },
    processhtml: {
      release: {
        files: {
          'dist/index.html': ['index.html']
        }
      }
    },
    nunjucks: {
      precompile: {
        baseDir: 'src/views/',
        src: 'src/views/**/*.html',
        dest: 'build/js/templates.js',
      }
    },
    uglify: {
      options: {
        banner: "/*! main.min.js file */\n"
      },
      build: {
        src: ['build/js/templates.js', 'build/js/sources.js'],
        dest: "dist/main.min.js"
      }
    },
    watch: {
      development: {
        options: {
          spawn: false,
          livereload: true
        },
        tasks: ['jshint', 'nunjucks'],
        files: [
          'dist/sources.js',
          'src/**/*',
          'index.html',
          'package.json'
        ]
      }
    },
    'string-replace': {
      dist: {
        files: {
          'build/css/': ['src/libs/lightbox2/index.css'],
        },
        options: {
          replacements: [{
            pattern: /\.\/images\//ig,
            replacement: '/libs/lightbox2/images/'
          }]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nunjucks');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('development', [
    'jshint',
    'browserify:development',
    'connect:development',
    'watch'
  ]);

  grunt.registerTask('production', [
    'clean:build',
    'jshint',
    'browserify:production',
    'nunjucks',
    'processhtml',
    'copy',
    'string-replace',
    'cssmin',
    'uglify',
    'clean:release',
  ]);

  grunt.registerTask('default', ['development']);
}
