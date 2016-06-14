module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            appUrl: 'src/',
            distUrl: 'dist/',
            demoUrl: 'demo/'
        },
        meta: {
            version: '0.1.0',
            banner: '/*! PROJECT_NAME - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* author <%= pkg.author %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            'Licensed MIT */'
        },

        // concat js files
        concat: {
            basic_and_extras: {
                files: {
                    'demo/basic/noname.js': ['src/utils/*.js', 'src/errors.js', 'src/http.js', 'src/module-provider.js', 'src/view.js', 'src/route-provider.js', 'src/noname.js']
                }
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: './vendors',
                    layout: 'byType',
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },



        watch: {
            files: ['src/**/*.js'],
            tasks: ['concat'],
            options: {
                force: true,
                livereload: true
            }
        }
    });

    // Load the plugin that provides tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');



};
