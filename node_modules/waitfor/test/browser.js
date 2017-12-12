
const ASSERT = require("assert");
const GRUNT = require("grunt");


describe("waitfor (browser)", function() {

    it("should run tests", function(done) {

        GRUNT.initConfig({
            mocha: {
                all: {
                    options: {
                        reporter: "List"
                    },
                    src: [
                        "test/browser/runner.html"
                    ]
                }
            }
        });

        GRUNT.loadNpmTasks("grunt-mocha");

        GRUNT.registerInitTask('default', function() {
            GRUNT.task.run(["mocha"]);
        });
        GRUNT.tasks(['default'], {
            //debug: true
        }, function() {
            return done(null);
        });
    });

});
