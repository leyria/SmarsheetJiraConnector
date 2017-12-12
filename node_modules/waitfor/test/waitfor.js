
((function() {

    function Tests(ASSERT, WAITFOR) {

		describe("waitfor", function() {

		    it("should be an object", function() {
		    	ASSERT.equal(typeof WAITFOR, "object");
		    });

		    it("should export `serial` function", function() {
		    	ASSERT.equal(typeof WAITFOR.serial, "function");
		    });

		    it("should export `parallel` function", function() {
		    	ASSERT.equal(typeof WAITFOR.parallel, "function");
		    });

		    describe("serial", function() {

			    it("should serialize workers", function(done) {
			    	var waitfor = WAITFOR.serial(done);
			    	var running = false;
			    	function worker(done) {
			    		if (running) throw new Error("Worker already running");
			    		running = true;
			    		return setTimeout(function() {
			    			running = false;
			    			return done();
			    		}, 10);
			    	}
		    		waitfor(worker);
		    		waitfor(worker);
		    		waitfor(worker);
			    });

			    it("should work for no workers", function(done) {
			    	var waitfor = WAITFOR.serial(done);
			    	waitfor();
			    });

			    it("should work for loops with arguments", function(done) {
			    	var waitfor = WAITFOR.serial(done);
			    	var counter = 0;
			    	for (var i=0 ; i<3 ; i++) {
			    		waitfor(i, function(j, done) {
			    			ASSERT.equal(i, 3);
			    			ASSERT.equal(j, counter);
			    			counter += 1;
			    			setTimeout(function() {
			    				return done();
			    			}, 10);
			    		});
			    	}
			    	waitfor();
			    });

			    it("should err if worker errs", function(done) {
			    	var waitfor = WAITFOR.serial(function(err) {
			    		ASSERT.equal(err.message, "error1");
			    		return done(null);
			    	});
			    	waitfor(function(done) {
			    		return done(new Error("error1"));
			    	});
			    });

			    it("should err if worker throws", function(done) {
			    	var waitfor = WAITFOR.serial(function(err) {
			    		ASSERT.equal(err.message, "error1");
			    		return done(null);
			    	});
			    	waitfor(function(done) {
			    		throw new Error("error1");
			    	});
			    });

		    });

		    describe("parallel", function() {

			    it("should parallelize workers", function(done) {
			    	var waitfor = WAITFOR.parallel(done);
			    	var running = 0;
			    	function worker(expected, done) {
			    		if (running !== expected) throw new Error(expected + " workers should already be running");
			    		running += 1;
			    		return setTimeout(function() {
				    		running -= 1;
			    			return done();
			    		}, 10);
			    	}
		    		waitfor(function(done) {
		    			worker(0, done);
		    		});
		    		waitfor(function(done) {
		    			worker(1, done);
		    		});
		    		waitfor(function(done) {
		    			worker(2, done);
		    		});
			    });    	

			    it("should work for no workers", function(done) {
			    	var waitfor = WAITFOR.parallel(done);
			    	waitfor();
			    });

			    it("should work for loops with arguments", function(done) {
			    	var waitfor = WAITFOR.parallel(done);
			    	var counter = 0;
			    	for (var i=0 ; i<3 ; i++) {
			    		waitfor(i, function(j, done) {
			    			ASSERT.equal(i, 3);
			    			ASSERT.equal(j, counter);
			    			counter += 1;
			    			setTimeout(function() {
			    				return done();
			    			}, 10);
			    		});
			    	}
			    	waitfor();
			    });

			    it("should err if worker errs", function(done) {
			    	var waitfor = WAITFOR.parallel(function(err) {
			    		ASSERT.equal(err.message, "error1");
			    		return done(null);
			    	});
			    	waitfor(function(done) {
			    		return done(new Error("error1"));
			    	});
			    });

			    it("should err if worker throws", function(done) {
			    	var waitfor = WAITFOR.parallel(function(err) {
			    		ASSERT.equal(err.message, "error1");
			    		return done(null);
			    	});
			    	waitfor(function(done) {
			    		throw new Error("error1");
			    	});
			    });
		    });

		});

    }

    // Check for AMD
    if (typeof define === "function") {
        define(["lib/waitfor"], function(WAITFOR) {
            Tests(
            	// Global provided by test harness
            	ASSERT,
            	WAITFOR
            );
        });
    } else
    // Assume NodeJS
    if (typeof exports === "object") {
        Tests(
        	require("assert"),
        	require("../waitfor")
        );
    }

})());
