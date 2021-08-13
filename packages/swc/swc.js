const swc = Npm.require("@swc/core");
const { ReifyPlugin } = require('./reifyPlugin')

class SWCCompilerClass {
    processFilesForTarget(files) {
        files.forEach((file) => {
            swc
                .transform(file.getContentsAsString(), {
                    plugin: m => new ReifyPlugin().visitProgram(m),
                    // Some options cannot be specified in .swcrc
                    filename: "input.js",
                    sourceMaps: true,
                    // Input files are treated as module by default.
                    isModule: false,
                    // All options below can be configured via .swcrc
                    jsc: {
                        parser: {
                            syntax: "ecmascript",
                        },
                        transform: {},
                    }
                })
                .then((output) => {
                    file.addJavaScript({
                        data: output.code,
                        path: `${file.getPathInPackage()}.js`
                    });
                })
                .catch((e) => {
                    console.log(`${file.getPathInPackage()}.js`)
                    console.log(e)
                });
        })
    }
}

SWCCompiler = SWCCompilerClass
