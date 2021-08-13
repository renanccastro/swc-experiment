Package.describe({
    name: 'swc',
    version: '0.0.1',
    summary: 'SWC backend',
    documentation: 'README.md'
});

Npm.depends({
    '@swc/core': '1.2.66',
    'reify': '0.20.12',
    'assert': '2.0.0',
    '@babel/types': '7.14.8',
    '@babel/traverse': '7.14.8'
});

Package.onUse(function (api) {
    api.use('modules')
    api.addFiles([
        'swc.js',
        'reifyPlugin.js',
    ], 'server');

    api.export('SWCCompiler', 'server');
    api.export('ReifyPlugin', 'server');
});
