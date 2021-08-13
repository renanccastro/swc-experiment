Package.describe({
    name: 'swc-compiler',
    version: '0.0.1',
    summary: 'Compiler plugin that uses swc as a backend',
    documentation: 'README.md'
});

Package.registerBuildPlugin({
    name: 'swc-compiler',
    use: ['swc'],
    sources: ['plugin.js']
});

Package.onUse(function (api) {
    api.use('isobuild:compiler-plugin@1.0.0');
    api.use('swc');
    api.use('modules')
    // Runtime support for Meteor 1.5 dynamic import(...) syntax.
    api.imply('dynamic-import');
    api.imply('modules');


    api.addFiles([
        'plugin.js',
    ], 'server');

});
