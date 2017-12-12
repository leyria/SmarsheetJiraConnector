
((function() {

    function Waitfor(exports) {

        var status = {};
        exports._status = status;

        exports.serial = function(callback) {
            var id = new Date().getTime();
            var running = false;
            var queue = [];
            var error = undefined;
            return function waitFor() {
                function runOrQueueWorker(name, args) {
                    if (running === false) {
                        runWorker(name, args);
                    }
                    else {
                        queue.push(function() {
                            runWorker(name, args);
                        });
                    }
                }
                function runWorker(name, args) {
                    running = true;
                    var worker = args.pop();
                    args.push(function(cont) {
                        status[id][name] = "done";
                        if (cont === false) {
                            queue = [];
                            running = false;
                            callback(error);
                        } else
                        if(typeof cont === "undefined" || cont === true || cont === null) {
                            if (queue.length > 0) {
                                queue.shift()();
                            } else {
                                running = false;
                                if(callback) callback(error);
                            }
                        } else {
                            error = cont;
                            if (callback) {
                                callback(error);
                                callback = false;
                            }
                        }
                    });
                    if (!status[id]) {
                        status[id] = {};
                    }
                    status[id][name] = "pending";
                    exports.setImmediate(function() {
                        try {
                            worker.apply(null, args);
                        } catch(err) {
                            args[args.length-1](err);
                        }
                    });
                }
                var args = Array.prototype.slice.call(arguments);
                if (args.length === 0) {
                    if (running === false && callback) {
                        callback(error);
                    }
                } else
                if (args.length === 1 && typeof args[0] === "string") {
                    return function waitFor() {
                        runOrQueueWorker(args[0], Array.prototype.slice.call(arguments));
                    }
                } else {
                    runOrQueueWorker(new Date().getTime(), args);
                }
            };    
        }


        exports.parallel = function(callback) {
            var id = new Date().getTime();
            var c = 0;
            var error = undefined;
            return function waitFor() {
                function runWorker(name, args) {
                    var worker = args.pop();
                    args.push(function(err) {
                        if (err) {
                            error = err;
                            if (typeof error === "object") {
                                if (!error.stack) error.stack = new Error(error.message + " (occurred somewhere prior to this stack)").stack;
                            } else {
                                error = new Error(JSON.stringify(error) + " (occurred somewhere prior to this stack)");
                            }
                        }
                        c -= 1;
                        status[id][name] = "done";
                        if (c === 0 && callback) {
                            callback(error);
                            callback = false;
                        } else
                        if (error && callback) {
                            callback(error);
                            callback = false;
                        }
                    });
                    c += 1;
                    if (!status[id]) {
                        status[id] = {};
                    }
                    status[id][name] = "pending";
                    exports.setImmediate(function() {
                        try {
                            worker.apply(null, args);
                        } catch(err) {
                            args[args.length-1](err);
                        }
                    });
                }
                var args = Array.prototype.slice.call(arguments);
                if (args.length === 0) {
                    if (c === 0 && callback) {
                        callback(error);
                    }
                } else
                if (args.length === 1 && typeof args[0] === "string") {
                    return function waitFor() {
                        runWorker(args[0], Array.prototype.slice.call(arguments));
                    }
                } else {
                    runWorker(new Date().getTime(), args);
                }
            };    
        }
    }

    // Check for AMD
    if (typeof define === "function") {
        define(function() {
            var exports = {
                setImmediate: function(callback) {
                    return setTimeout(callback, 0);
                }
            };
            Waitfor(exports);
            return exports;
        });
    } else
    // Assume NodeJS
    if (typeof exports === "object") {
        require("setimmediate");
        exports.setImmediate = setImmediate;
        Waitfor(exports);
    }

})());
