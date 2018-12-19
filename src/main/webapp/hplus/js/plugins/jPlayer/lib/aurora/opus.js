(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
        var Module;
        if (!Module) Module = (typeof Module !== "undefined" ? Module : null) || {};
        var moduleOverrides = {};
        for (var key in Module) {
            if (Module.hasOwnProperty(key)) {
                moduleOverrides[key] = Module[key]
            }
        }
        var ENVIRONMENT_IS_NODE = typeof process === "object" && typeof require === "function";
        var ENVIRONMENT_IS_WEB = typeof window === "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
        var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (ENVIRONMENT_IS_NODE) {
            if (!Module["print"]) Module["print"] = function print(x) {
                process["stdout"].write(x + "\n")
            };
            if (!Module["printErr"]) Module["printErr"] = function printErr(x) {
                process["stderr"].write(x + "\n")
            };
            var nodeFS = require("fs");
            var nodePath = require("path");
            Module["read"] = function read(filename, binary) {
                filename = nodePath["normalize"](filename);
                var ret = nodeFS["readFileSync"](filename);
                if (!ret && filename != nodePath["resolve"](filename)) {
                    filename = path.join(__dirname, "..", "src", filename);
                    ret = nodeFS["readFileSync"](filename)
                }
                if (ret && !binary) ret = ret.toString();
                return ret
            };
            Module["readBinary"] = function readBinary(filename) {
                return Module["read"](filename, true)
            };
            Module["load"] = function load(f) {
                globalEval(read(f))
            };
            Module["thisProgram"] = process["argv"][1];
            Module["arguments"] = process["argv"].slice(2);
            module["exports"] = Module
        } else if (ENVIRONMENT_IS_SHELL) {
            if (!Module["print"]) Module["print"] = print;
            if (typeof printErr != "undefined") Module["printErr"] = printErr;
            if (typeof read != "undefined") {
                Module["read"] = read
            } else {
                Module["read"] = function read() {
                    throw"no read() available (jsc?)"
                }
            }
            Module["readBinary"] = function readBinary(f) {
                return read(f, "binary")
            };
            if (typeof scriptArgs != "undefined") {
                Module["arguments"] = scriptArgs
            } else if (typeof arguments != "undefined") {
                Module["arguments"] = arguments
            }
            this["Module"] = Module
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            Module["read"] = function read(url) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.send(null);
                return xhr.responseText
            };
            if (typeof arguments != "undefined") {
                Module["arguments"] = arguments
            }
            if (typeof console !== "undefined") {
                if (!Module["print"]) Module["print"] = function print(x) {
                    console.log(x)
                };
                if (!Module["printErr"]) Module["printErr"] = function printErr(x) {
                    console.log(x)
                }
            } else {
                var TRY_USE_DUMP = false;
                if (!Module["print"]) Module["print"] = TRY_USE_DUMP && typeof dump !== "undefined" ? (function (x) {
                    dump(x)
                }) : (function (x) {
                })
            }
            if (ENVIRONMENT_IS_WEB) {
                window["Module"] = Module
            } else {
                Module["load"] = importScripts
            }
        } else {
            throw"Unknown runtime environment. Where are we?"
        }
        function globalEval(x) {
            eval.call(null, x)
        }
        if (!Module["load"] == "undefined" && Module["read"]) {
            Module["load"] = function load(f) {
                globalEval(Module["read"](f))
            }
        }
        if (!Module["print"]) {
            Module["print"] = (function () {
            })
        }
        if (!Module["printErr"]) {
            Module["printErr"] = Module["print"]
        }
        if (!Module["arguments"]) {
            Module["arguments"] = []
        }
        Module.print = Module["print"];
        Module.printErr = Module["printErr"];
        Module["preRun"] = [];
        Module["postRun"] = [];
        for (var key in moduleOverrides) {
            if (moduleOverrides.hasOwnProperty(key)) {
                Module[key] = moduleOverrides[key]
            }
        }
        var Runtime = {
            setTempRet0: (function (value) {
                tempRet0 = value
            }),
            getTempRet0: (function () {
                return tempRet0
            }),
            stackSave: (function () {
                return STACKTOP
            }),
            stackRestore: (function (stackTop) {
                STACKTOP = stackTop
            }),
            forceAlign: (function (target, quantum) {
                quantum = quantum || 4;
                if (quantum == 1) return target;
                if (isNumber(target) && isNumber(quantum)) {
                    return Math.ceil(target / quantum) * quantum
                } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
                    return "(((" + target + ")+" + (quantum - 1) + ")&" + -quantum + ")"
                }
                return "Math.ceil((" + target + ")/" + quantum + ")*" + quantum
            }),
            isNumberType: (function (type) {
                return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES
            }),
            isPointerType: function isPointerType(type) {
                return type[type.length - 1] == "*"
            },
            isStructType: function isStructType(type) {
                if (isPointerType(type)) return false;
                if (isArrayType(type)) return true;
                if (/<?\{ ?[^}]* ?\}>?/.test(type)) return true;
                return type[0] == "%"
            },
            INT_TYPES: {"i1": 0, "i8": 0, "i16": 0, "i32": 0, "i64": 0},
            FLOAT_TYPES: {"float": 0, "double": 0},
            or64: (function (x, y) {
                var l = x | 0 | (y | 0);
                var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
                return l + h
            }),
            and64: (function (x, y) {
                var l = (x | 0) & (y | 0);
                var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
                return l + h
            }),
            xor64: (function (x, y) {
                var l = (x | 0) ^ (y | 0);
                var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
                return l + h
            }),
            getNativeTypeSize: (function (type) {
                switch (type) {
                    case"i1":
                    case"i8":
                        return 1;
                    case"i16":
                        return 2;
                    case"i32":
                        return 4;
                    case"i64":
                        return 8;
                    case"float":
                        return 4;
                    case"double":
                        return 8;
                    default: {
                        if (type[type.length - 1] === "*") {
                            return Runtime.QUANTUM_SIZE
                        } else if (type[0] === "i") {
                            var bits = parseInt(type.substr(1));
                            assert(bits % 8 === 0);
                            return bits / 8
                        } else {
                            return 0
                        }
                    }
                }
            }),
            getNativeFieldSize: (function (type) {
                return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE)
            }),
            dedup: function dedup(items, ident) {
                var seen = {};
                if (ident) {
                    return items.filter((function (item) {
                        if (seen[item[ident]]) return false;
                        seen[item[ident]] = true;
                        return true
                    }))
                } else {
                    return items.filter((function (item) {
                        if (seen[item]) return false;
                        seen[item] = true;
                        return true
                    }))
                }
            },
            set: function set() {
                var args = typeof arguments[0] === "object" ? arguments[0] : arguments;
                var ret = {};
                for (var i = 0; i < args.length; i++) {
                    ret[args[i]] = 0
                }
                return ret
            },
            STACK_ALIGN: 8,
            getAlignSize: (function (type, size, vararg) {
                if (!vararg && (type == "i64" || type == "double")) return 8;
                if (!type) return Math.min(size, 8);
                return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE)
            }),
            calculateStructAlignment: function calculateStructAlignment(type) {
                type.flatSize = 0;
                type.alignSize = 0;
                var diffs = [];
                var prev = -1;
                var index = 0;
                type.flatIndexes = type.fields.map((function (field) {
                    index++;
                    var size, alignSize;
                    if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
                        size = Runtime.getNativeTypeSize(field);
                        alignSize = Runtime.getAlignSize(field, size)
                    } else if (Runtime.isStructType(field)) {
                        if (field[1] === "0") {
                            size = 0;
                            if (Types.types[field]) {
                                alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize)
                            } else {
                                alignSize = type.alignSize || QUANTUM_SIZE
                            }
                        } else {
                            size = Types.types[field].flatSize;
                            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize)
                        }
                    } else if (field[0] == "b") {
                        size = field.substr(1) | 0;
                        alignSize = 1
                    } else if (field[0] === "<") {
                        size = alignSize = Types.types[field].flatSize
                    } else if (field[0] === "i") {
                        size = alignSize = parseInt(field.substr(1)) / 8;
                        assert(size % 1 === 0, "cannot handle non-byte-size field " + field)
                    } else {
                        assert(false, "invalid type for calculateStructAlignment")
                    }
                    if (type.packed) alignSize = 1;
                    type.alignSize = Math.max(type.alignSize, alignSize);
                    var curr = Runtime.alignMemory(type.flatSize, alignSize);
                    type.flatSize = curr + size;
                    if (prev >= 0) {
                        diffs.push(curr - prev)
                    }
                    prev = curr;
                    return curr
                }));
                if (type.name_ && type.name_[0] === "[") {
                    type.flatSize = parseInt(type.name_.substr(1)) * type.flatSize / 2
                }
                type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
                if (diffs.length == 0) {
                    type.flatFactor = type.flatSize
                } else if (Runtime.dedup(diffs).length == 1) {
                    type.flatFactor = diffs[0]
                }
                type.needsFlattening = type.flatFactor != 1;
                return type.flatIndexes
            },
            generateStructInfo: (function (struct, typeName, offset) {
                var type, alignment;
                if (typeName) {
                    offset = offset || 0;
                    type = (typeof Types === "undefined" ? Runtime.typeInfo : Types.types)[typeName];
                    if (!type) return null;
                    if (type.fields.length != struct.length) {
                        printErr("Number of named fields must match the type for " + typeName + ": possibly duplicate struct names. Cannot return structInfo");
                        return null
                    }
                    alignment = type.flatIndexes
                } else {
                    var type = {
                        fields: struct.map((function (item) {
                            return item[0]
                        }))
                    };
                    alignment = Runtime.calculateStructAlignment(type)
                }
                var ret = {__size__: type.flatSize};
                if (typeName) {
                    struct.forEach((function (item, i) {
                        if (typeof item === "string") {
                            ret[item] = alignment[i] + offset
                        } else {
                            var key;
                            for (var k in item) key = k;
                            ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i])
                        }
                    }))
                } else {
                    struct.forEach((function (item, i) {
                        ret[item[1]] = alignment[i]
                    }))
                }
                return ret
            }),
            dynCall: (function (sig, ptr, args) {
                if (args && args.length) {
                    if (!args.splice) args = Array.prototype.slice.call(args);
                    args.splice(0, 0, ptr);
                    return Module["dynCall_" + sig].apply(null, args)
                } else {
                    return Module["dynCall_" + sig].call(null, ptr)
                }
            }),
            functionPointers: [],
            addFunction: (function (func) {
                for (var i = 0; i < Runtime.functionPointers.length; i++) {
                    if (!Runtime.functionPointers[i]) {
                        Runtime.functionPointers[i] = func;
                        return 2 * (1 + i)
                    }
                }
                throw"Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."
            }),
            removeFunction: (function (index) {
                Runtime.functionPointers[(index - 2) / 2] = null
            }),
            getAsmConst: (function (code, numArgs) {
                if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
                var func = Runtime.asmConstCache[code];
                if (func) return func;
                var args = [];
                for (var i = 0; i < numArgs; i++) {
                    args.push(String.fromCharCode(36) + i)
                }
                var source = Pointer_stringify(code);
                if (source[0] === '"') {
                    if (source.indexOf('"', 1) === source.length - 1) {
                        source = source.substr(1, source.length - 2)
                    } else {
                        abort("invalid EM_ASM input |" + source + "|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)")
                    }
                }
                try {
                    var evalled = eval("(function(" + args.join(",") + "){ " + source + " })")
                } catch (e) {
                    Module.printErr("error in executing inline EM_ASM code: " + e + " on: \n\n" + source + "\n\nwith args |" + args + "| (make sure to use the right one out of EM_ASM, EM_ASM_ARGS, etc.)");
                    throw e
                }
                return Runtime.asmConstCache[code] = evalled
            }),
            warnOnce: (function (text) {
                if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
                if (!Runtime.warnOnce.shown[text]) {
                    Runtime.warnOnce.shown[text] = 1;
                    Module.printErr(text)
                }
            }),
            funcWrappers: {},
            getFuncWrapper: (function (func, sig) {
                assert(sig);
                if (!Runtime.funcWrappers[func]) {
                    Runtime.funcWrappers[func] = function dynCall_wrapper() {
                        return Runtime.dynCall(sig, func, arguments)
                    }
                }
                return Runtime.funcWrappers[func]
            }),
            UTF8Processor: (function () {
                var buffer = [];
                var needed = 0;
                this.processCChar = (function (code) {
                    code = code & 255;
                    if (buffer.length == 0) {
                        if ((code & 128) == 0) {
                            return String.fromCharCode(code)
                        }
                        buffer.push(code);
                        if ((code & 224) == 192) {
                            needed = 1
                        } else if ((code & 240) == 224) {
                            needed = 2
                        } else {
                            needed = 3
                        }
                        return ""
                    }
                    if (needed) {
                        buffer.push(code);
                        needed--;
                        if (needed > 0) return ""
                    }
                    var c1 = buffer[0];
                    var c2 = buffer[1];
                    var c3 = buffer[2];
                    var c4 = buffer[3];
                    var ret;
                    if (buffer.length == 2) {
                        ret = String.fromCharCode((c1 & 31) << 6 | c2 & 63)
                    } else if (buffer.length == 3) {
                        ret = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
                    } else {
                        var codePoint = (c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63;
                        ret = String.fromCharCode(Math.floor((codePoint - 65536) / 1024) + 55296, (codePoint - 65536) % 1024 + 56320)
                    }
                    buffer.length = 0;
                    return ret
                });
                this.processJSString = function processJSString(string) {
                    string = unescape(encodeURIComponent(string));
                    var ret = [];
                    for (var i = 0; i < string.length; i++) {
                        ret.push(string.charCodeAt(i))
                    }
                    return ret
                }
            }),
            getCompilerSetting: (function (name) {
                throw"You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"
            }),
            stackAlloc: (function (size) {
                var ret = STACKTOP;
                STACKTOP = STACKTOP + size | 0;
                STACKTOP = STACKTOP + 7 & -8;
                return ret
            }),
            staticAlloc: (function (size) {
                var ret = STATICTOP;
                STATICTOP = STATICTOP + size | 0;
                STATICTOP = STATICTOP + 7 & -8;
                return ret
            }),
            dynamicAlloc: (function (size) {
                var ret = DYNAMICTOP;
                DYNAMICTOP = DYNAMICTOP + size | 0;
                DYNAMICTOP = DYNAMICTOP + 7 & -8;
                if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();
                return ret
            }),
            alignMemory: (function (size, quantum) {
                var ret = size = Math.ceil(size / (quantum ? quantum : 8)) * (quantum ? quantum : 8);
                return ret
            }),
            makeBigInt: (function (low, high, unsigned) {
                var ret = unsigned ? +(low >>> 0) + +(high >>> 0) * +4294967296 : +(low >>> 0) + +(high | 0) * +4294967296;
                return ret
            }),
            GLOBAL_BASE: 8,
            QUANTUM_SIZE: 4,
            __dummy__: 0
        };
        Module["Runtime"] = Runtime;
        var __THREW__ = 0;
        var ABORT = false;
        var EXITSTATUS = 0;
        var undef = 0;
        var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS,
            tempBigIntP, tempBigIntD, tempDouble, tempFloat;
        var tempI64, tempI64b;
        var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
        function assert(condition, text) {
            if (!condition) {
                abort("Assertion failed: " + text)
            }
        }
        var globalScope = this;
        function getCFunc(ident) {
            var func = Module["_" + ident];
            if (!func) {
                try {
                    func = eval("_" + ident)
                } catch (e) {
                }
            }
            assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)");
            return func
        }
        var cwrap, ccall;
        ((function () {
            var stack = 0;
            var JSfuncs = {
                "stackSave": (function () {
                    stack = Runtime.stackSave()
                }), "stackRestore": (function () {
                    Runtime.stackRestore(stack)
                }), "arrayToC": (function (arr) {
                    var ret = Runtime.stackAlloc(arr.length);
                    writeArrayToMemory(arr, ret);
                    return ret
                }), "stringToC": (function (str) {
                    var ret = 0;
                    if (str !== null && str !== undefined && str !== 0) {
                        ret = Runtime.stackAlloc(str.length + 1);
                        writeStringToMemory(str, ret)
                    }
                    return ret
                })
            };
            var toC = {"string": JSfuncs["stringToC"], "array": JSfuncs["arrayToC"]};
            ccall = function ccallFunc(ident, returnType, argTypes, args) {
                var func = getCFunc(ident);
                var cArgs = [];
                if (args) {
                    for (var i = 0; i < args.length; i++) {
                        var converter = toC[argTypes[i]];
                        if (converter) {
                            if (stack === 0) stack = Runtime.stackSave();
                            cArgs[i] = converter(args[i])
                        } else {
                            cArgs[i] = args[i]
                        }
                    }
                }
                var ret = func.apply(null, cArgs);
                if (returnType === "string") ret = Pointer_stringify(ret);
                if (stack !== 0) JSfuncs["stackRestore"]();
                return ret
            };
            var sourceRegex = /^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;
            function parseJSFunc(jsfunc) {
                var parsed = jsfunc.toString().match(sourceRegex).slice(1);
                return {arguments: parsed[0], body: parsed[1], returnValue: parsed[2]}
            }
            var JSsource = {};
            for (var fun in JSfuncs) {
                if (JSfuncs.hasOwnProperty(fun)) {
                    JSsource[fun] = parseJSFunc(JSfuncs[fun])
                }
            }
            cwrap = function cwrap(ident, returnType, argTypes) {
                var cfunc = getCFunc(ident);
                var numericArgs = argTypes.every((function (type) {
                    return type === "number"
                }));
                var numericRet = returnType !== "string";
                if (numericRet && numericArgs) {
                    return cfunc
                }
                var argNames = argTypes.map((function (x, i) {
                    return "$" + i
                }));
                var funcstr = "(function(" + argNames.join(",") + ") {";
                var nargs = argTypes.length;
                if (!numericArgs) {
                    funcstr += JSsource["stackSave"].body + ";";
                    for (var i = 0; i < nargs; i++) {
                        var arg = argNames[i], type = argTypes[i];
                        if (type === "number") continue;
                        var convertCode = JSsource[type + "ToC"];
                        funcstr += "var " + convertCode.arguments + " = " + arg + ";";
                        funcstr += convertCode.body + ";";
                        funcstr += arg + "=" + convertCode.returnValue + ";"
                    }
                }
                var cfuncname = parseJSFunc((function () {
                    return cfunc
                })).returnValue;
                funcstr += "var ret = " + cfuncname + "(" + argNames.join(",") + ");";
                if (!numericRet) {
                    var strgfy = parseJSFunc((function () {
                        return Pointer_stringify
                    })).returnValue;
                    funcstr += "ret = " + strgfy + "(ret);"
                }
                if (!numericArgs) {
                    funcstr += JSsource["stackRestore"].body + ";"
                }
                funcstr += "return ret})";
                return eval(funcstr)
            }
        }))();
        Module["cwrap"] = cwrap;
        Module["ccall"] = ccall;
        function setValue(ptr, value, type, noSafe) {
            type = type || "i8";
            if (type.charAt(type.length - 1) === "*") type = "i32";
            switch (type) {
                case"i1":
                    HEAP8[ptr >> 0] = value;
                    break;
                case"i8":
                    HEAP8[ptr >> 0] = value;
                    break;
                case"i16":
                    HEAP16[ptr >> 1] = value;
                    break;
                case"i32":
                    HEAP32[ptr >> 2] = value;
                    break;
                case"i64":
                    tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= +1 ? tempDouble > +0 ? (Math_min(+Math_floor(tempDouble / +4294967296), +4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / +4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
                    break;
                case"float":
                    HEAPF32[ptr >> 2] = value;
                    break;
                case"double":
                    HEAPF64[ptr >> 3] = value;
                    break;
                default:
                    abort("invalid type for setValue: " + type)
            }
        }
        Module["setValue"] = setValue;
        function getValue(ptr, type, noSafe) {
            type = type || "i8";
            if (type.charAt(type.length - 1) === "*") type = "i32";
            switch (type) {
                case"i1":
                    return HEAP8[ptr >> 0];
                case"i8":
                    return HEAP8[ptr >> 0];
                case"i16":
                    return HEAP16[ptr >> 1];
                case"i32":
                    return HEAP32[ptr >> 2];
                case"i64":
                    return HEAP32[ptr >> 2];
                case"float":
                    return HEAPF32[ptr >> 2];
                case"double":
                    return HEAPF64[ptr >> 3];
                default:
                    abort("invalid type for setValue: " + type)
            }
            return null
        }
        Module["getValue"] = getValue;
        var ALLOC_NORMAL = 0;
        var ALLOC_STACK = 1;
        var ALLOC_STATIC = 2;
        var ALLOC_DYNAMIC = 3;
        var ALLOC_NONE = 4;
        Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
        Module["ALLOC_STACK"] = ALLOC_STACK;
        Module["ALLOC_STATIC"] = ALLOC_STATIC;
        Module["ALLOC_DYNAMIC"] = ALLOC_DYNAMIC;
        Module["ALLOC_NONE"] = ALLOC_NONE;
        function allocate(slab, types, allocator, ptr) {
            var zeroinit, size;
            if (typeof slab === "number") {
                zeroinit = true;
                size = slab
            } else {
                zeroinit = false;
                size = slab.length
            }
            var singleType = typeof types === "string" ? types : null;
            var ret;
            if (allocator == ALLOC_NONE) {
                ret = ptr
            } else {
                ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length))
            }
            if (zeroinit) {
                var ptr = ret, stop;
                assert((ret & 3) == 0);
                stop = ret + (size & ~3);
                for (; ptr < stop; ptr += 4) {
                    HEAP32[ptr >> 2] = 0
                }
                stop = ret + size;
                while (ptr < stop) {
                    HEAP8[ptr++ >> 0] = 0
                }
                return ret
            }
            if (singleType === "i8") {
                if (slab.subarray || slab.slice) {
                    HEAPU8.set(slab, ret)
                } else {
                    HEAPU8.set(new Uint8Array(slab), ret)
                }
                return ret
            }
            var i = 0, type, typeSize, previousType;
            while (i < size) {
                var curr = slab[i];
                if (typeof curr === "function") {
                    curr = Runtime.getFunctionIndex(curr)
                }
                type = singleType || types[i];
                if (type === 0) {
                    i++;
                    continue
                }
                if (type == "i64") type = "i32";
                setValue(ret + i, curr, type);
                if (previousType !== type) {
                    typeSize = Runtime.getNativeTypeSize(type);
                    previousType = type
                }
                i += typeSize
            }
            return ret
        }
        Module["allocate"] = allocate;
        function Pointer_stringify(ptr, length) {
            var hasUtf = false;
            var t;
            var i = 0;
            while (1) {
                t = HEAPU8[ptr + i >> 0];
                if (t >= 128) hasUtf = true; else if (t == 0 && !length) break;
                i++;
                if (length && i == length) break
            }
            if (!length) length = i;
            var ret = "";
            if (!hasUtf) {
                var MAX_CHUNK = 1024;
                var curr;
                while (length > 0) {
                    curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
                    ret = ret ? ret + curr : curr;
                    ptr += MAX_CHUNK;
                    length -= MAX_CHUNK
                }
                return ret
            }
            var utf8 = new Runtime.UTF8Processor;
            for (i = 0; i < length; i++) {
                t = HEAPU8[ptr + i >> 0];
                ret += utf8.processCChar(t)
            }
            return ret
        }
        Module["Pointer_stringify"] = Pointer_stringify;
        function UTF16ToString(ptr) {
            var i = 0;
            var str = "";
            while (1) {
                var codeUnit = HEAP16[ptr + i * 2 >> 1];
                if (codeUnit == 0) return str;
                ++i;
                str += String.fromCharCode(codeUnit)
            }
        }
        Module["UTF16ToString"] = UTF16ToString;
        function stringToUTF16(str, outPtr) {
            for (var i = 0; i < str.length; ++i) {
                var codeUnit = str.charCodeAt(i);
                HEAP16[outPtr + i * 2 >> 1] = codeUnit
            }
            HEAP16[outPtr + str.length * 2 >> 1] = 0
        }
        Module["stringToUTF16"] = stringToUTF16;
        function UTF32ToString(ptr) {
            var i = 0;
            var str = "";
            while (1) {
                var utf32 = HEAP32[ptr + i * 4 >> 2];
                if (utf32 == 0) return str;
                ++i;
                if (utf32 >= 65536) {
                    var ch = utf32 - 65536;
                    str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                } else {
                    str += String.fromCharCode(utf32)
                }
            }
        }
        Module["UTF32ToString"] = UTF32ToString;
        function stringToUTF32(str, outPtr) {
            var iChar = 0;
            for (var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
                var codeUnit = str.charCodeAt(iCodeUnit);
                if (codeUnit >= 55296 && codeUnit <= 57343) {
                    var trailSurrogate = str.charCodeAt(++iCodeUnit);
                    codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023
                }
                HEAP32[outPtr + iChar * 4 >> 2] = codeUnit;
                ++iChar
            }
            HEAP32[outPtr + iChar * 4 >> 2] = 0
        }
        Module["stringToUTF32"] = stringToUTF32;
        function demangle(func) {
            var i = 3;
            var basicTypes = {
                "v": "void",
                "b": "bool",
                "c": "char",
                "s": "short",
                "i": "int",
                "l": "long",
                "f": "float",
                "d": "double",
                "w": "wchar_t",
                "a": "signed char",
                "h": "unsigned char",
                "t": "unsigned short",
                "j": "unsigned int",
                "m": "unsigned long",
                "x": "long long",
                "y": "unsigned long long",
                "z": "..."
            };
            var subs = [];
            var first = true;
            function dump(x) {
                if (x) Module.print(x);
                Module.print(func);
                var pre = "";
                for (var a = 0; a < i; a++) pre += " ";
                Module.print(pre + "^")
            }
            function parseNested() {
                i++;
                if (func[i] === "K") i++;
                var parts = [];
                while (func[i] !== "E") {
                    if (func[i] === "S") {
                        i++;
                        var next = func.indexOf("_", i);
                        var num = func.substring(i, next) || 0;
                        parts.push(subs[num] || "?");
                        i = next + 1;
                        continue
                    }
                    if (func[i] === "C") {
                        parts.push(parts[parts.length - 1]);
                        i += 2;
                        continue
                    }
                    var size = parseInt(func.substr(i));
                    var pre = size.toString().length;
                    if (!size || !pre) {
                        i--;
                        break
                    }
                    var curr = func.substr(i + pre, size);
                    parts.push(curr);
                    subs.push(curr);
                    i += pre + size
                }
                i++;
                return parts
            }
            function parse(rawList, limit, allowVoid) {
                limit = limit || Infinity;
                var ret = "", list = [];
                function flushList() {
                    return "(" + list.join(", ") + ")"
                }
                var name;
                if (func[i] === "N") {
                    name = parseNested().join("::");
                    limit--;
                    if (limit === 0) return rawList ? [name] : name
                } else {
                    if (func[i] === "K" || first && func[i] === "L") i++;
                    var size = parseInt(func.substr(i));
                    if (size) {
                        var pre = size.toString().length;
                        name = func.substr(i + pre, size);
                        i += pre + size
                    }
                }
                first = false;
                if (func[i] === "I") {
                    i++;
                    var iList = parse(true);
                    var iRet = parse(true, 1, true);
                    ret += iRet[0] + " " + name + "<" + iList.join(", ") + ">"
                } else {
                    ret = name
                }
                paramLoop:while (i < func.length && limit-- > 0) {
                    var c = func[i++];
                    if (c in basicTypes) {
                        list.push(basicTypes[c])
                    } else {
                        switch (c) {
                            case"P":
                                list.push(parse(true, 1, true)[0] + "*");
                                break;
                            case"R":
                                list.push(parse(true, 1, true)[0] + "&");
                                break;
                            case"L": {
                                i++;
                                var end = func.indexOf("E", i);
                                var size = end - i;
                                list.push(func.substr(i, size));
                                i += size + 2;
                                break
                            }
                            case"A": {
                                var size = parseInt(func.substr(i));
                                i += size.toString().length;
                                if (func[i] !== "_") throw"?";
                                i++;
                                list.push(parse(true, 1, true)[0] + " [" + size + "]");
                                break
                            }
                            case"E":
                                break paramLoop;
                            default:
                                ret += "?" + c;
                                break paramLoop
                        }
                    }
                }
                if (!allowVoid && list.length === 1 && list[0] === "void") list = [];
                if (rawList) {
                    if (ret) {
                        list.push(ret + "?")
                    }
                    return list
                } else {
                    return ret + flushList()
                }
            }
            try {
                if (func == "Object._main" || func == "_main") {
                    return "main()"
                }
                if (typeof func === "number") func = Pointer_stringify(func);
                if (func[0] !== "_") return func;
                if (func[1] !== "_") return func;
                if (func[2] !== "Z") return func;
                switch (func[3]) {
                    case"n":
                        return "operator new()";
                    case"d":
                        return "operator delete()"
                }
                return parse()
            } catch (e) {
                return func
            }
        }
        function demangleAll(text) {
            return text.replace(/__Z[\w\d_]+/g, (function (x) {
                var y = demangle(x);
                return x === y ? x : x + " [" + y + "]"
            }))
        }
        function stackTrace() {
            var stack = (new Error).stack;
            return stack ? demangleAll(stack) : "(no stack trace available)"
        }
        var PAGE_SIZE = 4096;
        function alignMemoryPage(x) {
            return x + 4095 & -4096
        }
        var HEAP;
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false;
        var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0;
        var DYNAMIC_BASE = 0, DYNAMICTOP = 0;
        function enlargeMemory() {
            abort("Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.")
        }
        var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
        var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
        var FAST_MEMORY = Module["FAST_MEMORY"] || 2097152;
        var totalMemory = 4096;
        while (totalMemory < TOTAL_MEMORY || totalMemory < 2 * TOTAL_STACK) {
            if (totalMemory < 16 * 1024 * 1024) {
                totalMemory *= 2
            } else {
                totalMemory += 16 * 1024 * 1024
            }
        }
        if (totalMemory !== TOTAL_MEMORY) {
            Module.printErr("increasing TOTAL_MEMORY to " + totalMemory + " to be more reasonable");
            TOTAL_MEMORY = totalMemory
        }
        assert(typeof Int32Array !== "undefined" && typeof Float64Array !== "undefined" && !!(new Int32Array(1))["subarray"] && !!(new Int32Array(1))["set"], "JS engine does not provide full typed array support");
        var buffer = new ArrayBuffer(TOTAL_MEMORY);
        HEAP8 = new Int8Array(buffer);
        HEAP16 = new Int16Array(buffer);
        HEAP32 = new Int32Array(buffer);
        HEAPU8 = new Uint8Array(buffer);
        HEAPU16 = new Uint16Array(buffer);
        HEAPU32 = new Uint32Array(buffer);
        HEAPF32 = new Float32Array(buffer);
        HEAPF64 = new Float64Array(buffer);
        HEAP32[0] = 255;
        assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, "Typed arrays 2 must be run on a little-endian system");
        Module["HEAP"] = HEAP;
        Module["HEAP8"] = HEAP8;
        Module["HEAP16"] = HEAP16;
        Module["HEAP32"] = HEAP32;
        Module["HEAPU8"] = HEAPU8;
        Module["HEAPU16"] = HEAPU16;
        Module["HEAPU32"] = HEAPU32;
        Module["HEAPF32"] = HEAPF32;
        Module["HEAPF64"] = HEAPF64;
        function callRuntimeCallbacks(callbacks) {
            while (callbacks.length > 0) {
                var callback = callbacks.shift();
                if (typeof callback == "function") {
                    callback();
                    continue
                }
                var func = callback.func;
                if (typeof func === "number") {
                    if (callback.arg === undefined) {
                        Runtime.dynCall("v", func)
                    } else {
                        Runtime.dynCall("vi", func, [callback.arg])
                    }
                } else {
                    func(callback.arg === undefined ? null : callback.arg)
                }
            }
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATEXIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        function preRun() {
            if (Module["preRun"]) {
                if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                while (Module["preRun"].length) {
                    addOnPreRun(Module["preRun"].shift())
                }
            }
            callRuntimeCallbacks(__ATPRERUN__)
        }
        function ensureInitRuntime() {
            if (runtimeInitialized) return;
            runtimeInitialized = true;
            callRuntimeCallbacks(__ATINIT__)
        }
        function preMain() {
            callRuntimeCallbacks(__ATMAIN__)
        }
        function exitRuntime() {
            callRuntimeCallbacks(__ATEXIT__);
            runtimeInitialized = false
        }
        function postRun() {
            if (Module["postRun"]) {
                if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                while (Module["postRun"].length) {
                    addOnPostRun(Module["postRun"].shift())
                }
            }
            callRuntimeCallbacks(__ATPOSTRUN__)
        }
        function addOnPreRun(cb) {
            __ATPRERUN__.unshift(cb)
        }
        Module["addOnPreRun"] = Module.addOnPreRun = addOnPreRun;
        function addOnInit(cb) {
            __ATINIT__.unshift(cb)
        }
        Module["addOnInit"] = Module.addOnInit = addOnInit;
        function addOnPreMain(cb) {
            __ATMAIN__.unshift(cb)
        }
        Module["addOnPreMain"] = Module.addOnPreMain = addOnPreMain;
        function addOnExit(cb) {
            __ATEXIT__.unshift(cb)
        }
        Module["addOnExit"] = Module.addOnExit = addOnExit;
        function addOnPostRun(cb) {
            __ATPOSTRUN__.unshift(cb)
        }
        Module["addOnPostRun"] = Module.addOnPostRun = addOnPostRun;
        function intArrayFromString(stringy, dontAddNull, length) {
            var ret = (new Runtime.UTF8Processor).processJSString(stringy);
            if (length) {
                ret.length = length
            }
            if (!dontAddNull) {
                ret.push(0)
            }
            return ret
        }
        Module["intArrayFromString"] = intArrayFromString;
        function intArrayToString(array) {
            var ret = [];
            for (var i = 0; i < array.length; i++) {
                var chr = array[i];
                if (chr > 255) {
                    chr &= 255
                }
                ret.push(String.fromCharCode(chr))
            }
            return ret.join("")
        }
        Module["intArrayToString"] = intArrayToString;
        function writeStringToMemory(string, buffer, dontAddNull) {
            var array = intArrayFromString(string, dontAddNull);
            var i = 0;
            while (i < array.length) {
                var chr = array[i];
                HEAP8[buffer + i >> 0] = chr;
                i = i + 1
            }
        }
        Module["writeStringToMemory"] = writeStringToMemory;
        function writeArrayToMemory(array, buffer) {
            for (var i = 0; i < array.length; i++) {
                HEAP8[buffer + i >> 0] = array[i]
            }
        }
        Module["writeArrayToMemory"] = writeArrayToMemory;
        function writeAsciiToMemory(str, buffer, dontAddNull) {
            for (var i = 0; i < str.length; i++) {
                HEAP8[buffer + i >> 0] = str.charCodeAt(i)
            }
            if (!dontAddNull) HEAP8[buffer + str.length >> 0] = 0
        }
        Module["writeAsciiToMemory"] = writeAsciiToMemory;
        function unSign(value, bits, ignore) {
            if (value >= 0) {
                return value
            }
            return bits <= 32 ? 2 * Math.abs(1 << bits - 1) + value : Math.pow(2, bits) + value
        }
        function reSign(value, bits, ignore) {
            if (value <= 0) {
                return value
            }
            var half = bits <= 32 ? Math.abs(1 << bits - 1) : Math.pow(2, bits - 1);
            if (value >= half && (bits <= 32 || value > half)) {
                value = -2 * half + value
            }
            return value
        }
        if (!Math["imul"] || Math["imul"](4294967295, 5) !== -5) Math["imul"] = function imul(a, b) {
            var ah = a >>> 16;
            var al = a & 65535;
            var bh = b >>> 16;
            var bl = b & 65535;
            return al * bl + (ah * bl + al * bh << 16) | 0
        };
        Math.imul = Math["imul"];
        var Math_abs = Math.abs;
        var Math_cos = Math.cos;
        var Math_sin = Math.sin;
        var Math_tan = Math.tan;
        var Math_acos = Math.acos;
        var Math_asin = Math.asin;
        var Math_atan = Math.atan;
        var Math_atan2 = Math.atan2;
        var Math_exp = Math.exp;
        var Math_log = Math.log;
        var Math_sqrt = Math.sqrt;
        var Math_ceil = Math.ceil;
        var Math_floor = Math.floor;
        var Math_pow = Math.pow;
        var Math_imul = Math.imul;
        var Math_fround = Math.fround;
        var Math_min = Math.min;
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function addRunDependency(id) {
            runDependencies++;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies)
            }
        }
        Module["addRunDependency"] = addRunDependency;
        function removeRunDependency(id) {
            runDependencies--;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies)
            }
            if (runDependencies == 0) {
                if (runDependencyWatcher !== null) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null
                }
                if (dependenciesFulfilled) {
                    var callback = dependenciesFulfilled;
                    dependenciesFulfilled = null;
                    callback()
                }
            }
        }
        Module["removeRunDependency"] = removeRunDependency;
        Module["preloadedImages"] = {};
        Module["preloadedAudios"] = {};
        var memoryInitializer = null;
        STATIC_BASE = 8;
        STATICTOP = STATIC_BASE + Runtime.alignMemory(19883);
        __ATINIT__.push();
        allocate([0, 64, 202, 69, 27, 76, 255, 82, 130, 90, 179, 98, 162, 107, 96, 117, 0, 1, 1, 1, 2, 3, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3, 0, 3, 12, 15, 48, 51, 60, 63, 192, 195, 204, 207, 240, 243, 252, 255, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 3, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 2, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 7, 0, 0, 0, 12, 0, 0, 0, 3, 0, 0, 0, 11, 0, 0, 0, 4, 0, 0, 0, 14, 0, 0, 0, 1, 0, 0, 0, 9, 0, 0, 0, 6, 0, 0, 0, 13, 0, 0, 0, 2, 0, 0, 0, 10, 0, 0, 0, 5, 0, 0, 0, 64, 39, 200, 27, 152, 16, 96, 59, 80, 34, 0, 0, 96, 102, 208, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 254, 1, 0, 1, 255, 0, 254, 0, 253, 2, 0, 1, 255, 0, 254, 0, 253, 3, 0, 1, 255, 2, 1, 0, 0, 0, 0, 0, 0, 25, 23, 2, 0, 0, 0, 0, 0, 126, 124, 119, 109, 87, 41, 19, 9, 4, 2, 0, 0, 0, 0, 0, 0, 72, 1, 0, 0, 8, 4, 0, 0, 196, 6, 0, 0, 124, 9, 0, 0, 48, 12, 0, 0, 224, 14, 0, 0, 140, 17, 0, 0, 244, 18, 0, 0, 176, 19, 0, 0, 36, 20, 0, 0, 112, 20, 0, 0, 168, 20, 0, 0, 200, 20, 0, 0, 224, 20, 0, 0, 236, 20, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 5, 0, 0, 0, 7, 0, 0, 0, 9, 0, 0, 0, 11, 0, 0, 0, 13, 0, 0, 0, 15, 0, 0, 0, 17, 0, 0, 0, 19, 0, 0, 0, 21, 0, 0, 0, 23, 0, 0, 0, 25, 0, 0, 0, 27, 0, 0, 0, 29, 0, 0, 0, 31, 0, 0, 0, 33, 0, 0, 0, 35, 0, 0, 0, 37, 0, 0, 0, 39, 0, 0, 0, 41, 0, 0, 0, 43, 0, 0, 0, 45, 0, 0, 0, 47, 0, 0, 0, 49, 0, 0, 0, 51, 0, 0, 0, 53, 0, 0, 0, 55, 0, 0, 0, 57, 0, 0, 0, 59, 0, 0, 0, 61, 0, 0, 0, 63, 0, 0, 0, 65, 0, 0, 0, 67, 0, 0, 0, 69, 0, 0, 0, 71, 0, 0, 0, 73, 0, 0, 0, 75, 0, 0, 0, 77, 0, 0, 0, 79, 0, 0, 0, 81, 0, 0, 0, 83, 0, 0, 0, 85, 0, 0, 0, 87, 0, 0, 0, 89, 0, 0, 0, 91, 0, 0, 0, 93, 0, 0, 0, 95, 0, 0, 0, 97, 0, 0, 0, 99, 0, 0, 0, 101, 0, 0, 0, 103, 0, 0, 0, 105, 0, 0, 0, 107, 0, 0, 0, 109, 0, 0, 0, 111, 0, 0, 0, 113, 0, 0, 0, 115, 0, 0, 0, 117, 0, 0, 0, 119, 0, 0, 0, 121, 0, 0, 0, 123, 0, 0, 0, 125, 0, 0, 0, 127, 0, 0, 0, 129, 0, 0, 0, 131, 0, 0, 0, 133, 0, 0, 0, 135, 0, 0, 0, 137, 0, 0, 0, 139, 0, 0, 0, 141, 0, 0, 0, 143, 0, 0, 0, 145, 0, 0, 0, 147, 0, 0, 0, 149, 0, 0, 0, 151, 0, 0, 0, 153, 0, 0, 0, 155, 0, 0, 0, 157, 0, 0, 0, 159, 0, 0, 0, 161, 0, 0, 0, 163, 0, 0, 0, 165, 0, 0, 0, 167, 0, 0, 0, 169, 0, 0, 0, 171, 0, 0, 0, 173, 0, 0, 0, 175, 0, 0, 0, 177, 0, 0, 0, 179, 0, 0, 0, 181, 0, 0, 0, 183, 0, 0, 0, 185, 0, 0, 0, 187, 0, 0, 0, 189, 0, 0, 0, 191, 0, 0, 0, 193, 0, 0, 0, 195, 0, 0, 0, 197, 0, 0, 0, 199, 0, 0, 0, 201, 0, 0, 0, 203, 0, 0, 0, 205, 0, 0, 0, 207, 0, 0, 0, 209, 0, 0, 0, 211, 0, 0, 0, 213, 0, 0, 0, 215, 0, 0, 0, 217, 0, 0, 0, 219, 0, 0, 0, 221, 0, 0, 0, 223, 0, 0, 0, 225, 0, 0, 0, 227, 0, 0, 0, 229, 0, 0, 0, 231, 0, 0, 0, 233, 0, 0, 0, 235, 0, 0, 0, 237, 0, 0, 0, 239, 0, 0, 0, 241, 0, 0, 0, 243, 0, 0, 0, 245, 0, 0, 0, 247, 0, 0, 0, 249, 0, 0, 0, 251, 0, 0, 0, 253, 0, 0, 0, 255, 0, 0, 0, 1, 1, 0, 0, 3, 1, 0, 0, 5, 1, 0, 0, 7, 1, 0, 0, 9, 1, 0, 0, 11, 1, 0, 0, 13, 1, 0, 0, 15, 1, 0, 0, 17, 1, 0, 0, 19, 1, 0, 0, 21, 1, 0, 0, 23, 1, 0, 0, 25, 1, 0, 0, 27, 1, 0, 0, 29, 1, 0, 0, 31, 1, 0, 0, 33, 1, 0, 0, 35, 1, 0, 0, 37, 1, 0, 0, 39, 1, 0, 0, 41, 1, 0, 0, 43, 1, 0, 0, 45, 1, 0, 0, 47, 1, 0, 0, 49, 1, 0, 0, 51, 1, 0, 0, 53, 1, 0, 0, 55, 1, 0, 0, 57, 1, 0, 0, 59, 1, 0, 0, 61, 1, 0, 0, 63, 1, 0, 0, 65, 1, 0, 0, 67, 1, 0, 0, 69, 1, 0, 0, 71, 1, 0, 0, 73, 1, 0, 0, 75, 1, 0, 0, 77, 1, 0, 0, 79, 1, 0, 0, 81, 1, 0, 0, 83, 1, 0, 0, 85, 1, 0, 0, 87, 1, 0, 0, 89, 1, 0, 0, 91, 1, 0, 0, 93, 1, 0, 0, 95, 1, 0, 0, 13, 0, 0, 0, 25, 0, 0, 0, 41, 0, 0, 0, 61, 0, 0, 0, 85, 0, 0, 0, 113, 0, 0, 0, 145, 0, 0, 0, 181, 0, 0, 0, 221, 0, 0, 0, 9, 1, 0, 0, 57, 1, 0, 0, 109, 1, 0, 0, 165, 1, 0, 0, 225, 1, 0, 0, 33, 2, 0, 0, 101, 2, 0, 0, 173, 2, 0, 0, 249, 2, 0, 0, 73, 3, 0, 0, 157, 3, 0, 0, 245, 3, 0, 0, 81, 4, 0, 0, 177, 4, 0, 0, 21, 5, 0, 0, 125, 5, 0, 0, 233, 5, 0, 0, 89, 6, 0, 0, 205, 6, 0, 0, 69, 7, 0, 0, 193, 7, 0, 0, 65, 8, 0, 0, 197, 8, 0, 0, 77, 9, 0, 0, 217, 9, 0, 0, 105, 10, 0, 0, 253, 10, 0, 0, 149, 11, 0, 0, 49, 12, 0, 0, 209, 12, 0, 0, 117, 13, 0, 0, 29, 14, 0, 0, 201, 14, 0, 0, 121, 15, 0, 0, 45, 16, 0, 0, 229, 16, 0, 0, 161, 17, 0, 0, 97, 18, 0, 0, 37, 19, 0, 0, 237, 19, 0, 0, 185, 20, 0, 0, 137, 21, 0, 0, 93, 22, 0, 0, 53, 23, 0, 0, 17, 24, 0, 0, 241, 24, 0, 0, 213, 25, 0, 0, 189, 26, 0, 0, 169, 27, 0, 0, 153, 28, 0, 0, 141, 29, 0, 0, 133, 30, 0, 0, 129, 31, 0, 0, 129, 32, 0, 0, 133, 33, 0, 0, 141, 34, 0, 0, 153, 35, 0, 0, 169, 36, 0, 0, 189, 37, 0, 0, 213, 38, 0, 0, 241, 39, 0, 0, 17, 41, 0, 0, 53, 42, 0, 0, 93, 43, 0, 0, 137, 44, 0, 0, 185, 45, 0, 0, 237, 46, 0, 0, 37, 48, 0, 0, 97, 49, 0, 0, 161, 50, 0, 0, 229, 51, 0, 0, 45, 53, 0, 0, 121, 54, 0, 0, 201, 55, 0, 0, 29, 57, 0, 0, 117, 58, 0, 0, 209, 59, 0, 0, 49, 61, 0, 0, 149, 62, 0, 0, 253, 63, 0, 0, 105, 65, 0, 0, 217, 66, 0, 0, 77, 68, 0, 0, 197, 69, 0, 0, 65, 71, 0, 0, 193, 72, 0, 0, 69, 74, 0, 0, 205, 75, 0, 0, 89, 77, 0, 0, 233, 78, 0, 0, 125, 80, 0, 0, 21, 82, 0, 0, 177, 83, 0, 0, 81, 85, 0, 0, 245, 86, 0, 0, 157, 88, 0, 0, 73, 90, 0, 0, 249, 91, 0, 0, 173, 93, 0, 0, 101, 95, 0, 0, 33, 97, 0, 0, 225, 98, 0, 0, 165, 100, 0, 0, 109, 102, 0, 0, 57, 104, 0, 0, 9, 106, 0, 0, 221, 107, 0, 0, 181, 109, 0, 0, 145, 111, 0, 0, 113, 113, 0, 0, 85, 115, 0, 0, 61, 117, 0, 0, 41, 119, 0, 0, 25, 121, 0, 0, 13, 123, 0, 0, 5, 125, 0, 0, 1, 127, 0, 0, 1, 129, 0, 0, 5, 131, 0, 0, 13, 133, 0, 0, 25, 135, 0, 0, 41, 137, 0, 0, 61, 139, 0, 0, 85, 141, 0, 0, 113, 143, 0, 0, 145, 145, 0, 0, 181, 147, 0, 0, 221, 149, 0, 0, 9, 152, 0, 0, 57, 154, 0, 0, 109, 156, 0, 0, 165, 158, 0, 0, 225, 160, 0, 0, 33, 163, 0, 0, 101, 165, 0, 0, 173, 167, 0, 0, 249, 169, 0, 0, 73, 172, 0, 0, 157, 174, 0, 0, 245, 176, 0, 0, 81, 179, 0, 0, 177, 181, 0, 0, 21, 184, 0, 0, 125, 186, 0, 0, 233, 188, 0, 0, 89, 191, 0, 0, 205, 193, 0, 0, 69, 196, 0, 0, 193, 198, 0, 0, 65, 201, 0, 0, 197, 203, 0, 0, 77, 206, 0, 0, 217, 208, 0, 0, 105, 211, 0, 0, 253, 213, 0, 0, 149, 216, 0, 0, 49, 219, 0, 0, 209, 221, 0, 0, 117, 224, 0, 0, 29, 227, 0, 0, 201, 229, 0, 0, 121, 232, 0, 0, 45, 235, 0, 0, 229, 237, 0, 0, 161, 240, 0, 0, 63, 0, 0, 0, 129, 0, 0, 0, 231, 0, 0, 0, 121, 1, 0, 0, 63, 2, 0, 0, 65, 3, 0, 0, 135, 4, 0, 0, 25, 6, 0, 0, 255, 7, 0, 0, 65, 10, 0, 0, 231, 12, 0, 0, 249, 15, 0, 0, 127, 19, 0, 0, 129, 23, 0, 0, 7, 28, 0, 0, 25, 33, 0, 0, 191, 38, 0, 0, 1, 45, 0, 0, 231, 51, 0, 0, 121, 59, 0, 0, 191, 67, 0, 0, 193, 76, 0, 0, 135, 86, 0, 0, 25, 97, 0, 0, 127, 108, 0, 0, 193, 120, 0, 0, 231, 133, 0, 0, 249, 147, 0, 0, 255, 162, 0, 0, 1, 179, 0, 0, 7, 196, 0, 0, 25, 214, 0, 0, 63, 233, 0, 0, 129, 253, 0, 0, 231, 18, 1, 0, 121, 41, 1, 0, 63, 65, 1, 0, 65, 90, 1, 0, 135, 116, 1, 0, 25, 144, 1, 0, 255, 172, 1, 0, 65, 203, 1, 0, 231, 234, 1, 0, 249, 11, 2, 0, 127, 46, 2, 0, 129, 82, 2, 0, 7, 120, 2, 0, 25, 159, 2, 0, 191, 199, 2, 0, 1, 242, 2, 0, 231, 29, 3, 0, 121, 75, 3, 0, 191, 122, 3, 0, 193, 171, 3, 0, 135, 222, 3, 0, 25, 19, 4, 0, 127, 73, 4, 0, 193, 129, 4, 0, 231, 187, 4, 0, 249, 247, 4, 0, 255, 53, 5, 0, 1, 118, 5, 0, 7, 184, 5, 0, 25, 252, 5, 0, 63, 66, 6, 0, 129, 138, 6, 0, 231, 212, 6, 0, 121, 33, 7, 0, 63, 112, 7, 0, 65, 193, 7, 0, 135, 20, 8, 0, 25, 106, 8, 0, 255, 193, 8, 0, 65, 28, 9, 0, 231, 120, 9, 0, 249, 215, 9, 0, 127, 57, 10, 0, 129, 157, 10, 0, 7, 4, 11, 0, 25, 109, 11, 0, 191, 216, 11, 0, 1, 71, 12, 0, 231, 183, 12, 0, 121, 43, 13, 0, 191, 161, 13, 0, 193, 26, 14, 0, 135, 150, 14, 0, 25, 21, 15, 0, 127, 150, 15, 0, 193, 26, 16, 0, 231, 161, 16, 0, 249, 43, 17, 0, 255, 184, 17, 0, 1, 73, 18, 0, 7, 220, 18, 0, 25, 114, 19, 0, 63, 11, 20, 0, 129, 167, 20, 0, 231, 70, 21, 0, 121, 233, 21, 0, 63, 143, 22, 0, 65, 56, 23, 0, 135, 228, 23, 0, 25, 148, 24, 0, 255, 70, 25, 0, 65, 253, 25, 0, 231, 182, 26, 0, 249, 115, 27, 0, 127, 52, 28, 0, 129, 248, 28, 0, 7, 192, 29, 0, 25, 139, 30, 0, 191, 89, 31, 0, 1, 44, 32, 0, 231, 1, 33, 0, 121, 219, 33, 0, 191, 184, 34, 0, 193, 153, 35, 0, 135, 126, 36, 0, 25, 103, 37, 0, 127, 83, 38, 0, 193, 67, 39, 0, 231, 55, 40, 0, 249, 47, 41, 0, 255, 43, 42, 0, 1, 44, 43, 0, 7, 48, 44, 0, 25, 56, 45, 0, 63, 68, 46, 0, 129, 84, 47, 0, 231, 104, 48, 0, 121, 129, 49, 0, 63, 158, 50, 0, 65, 191, 51, 0, 135, 228, 52, 0, 25, 14, 54, 0, 255, 59, 55, 0, 65, 110, 56, 0, 231, 164, 57, 0, 249, 223, 58, 0, 127, 31, 60, 0, 129, 99, 61, 0, 7, 172, 62, 0, 25, 249, 63, 0, 191, 74, 65, 0, 1, 161, 66, 0, 231, 251, 67, 0, 121, 91, 69, 0, 191, 191, 70, 0, 193, 40, 72, 0, 135, 150, 73, 0, 25, 9, 75, 0, 127, 128, 76, 0, 193, 252, 77, 0, 231, 125, 79, 0, 249, 3, 81, 0, 255, 142, 82, 0, 1, 31, 84, 0, 7, 180, 85, 0, 25, 78, 87, 0, 63, 237, 88, 0, 129, 145, 90, 0, 231, 58, 92, 0, 121, 233, 93, 0, 63, 157, 95, 0, 65, 86, 97, 0, 135, 20, 99, 0, 25, 216, 100, 0, 255, 160, 102, 0, 65, 111, 104, 0, 231, 66, 106, 0, 249, 27, 108, 0, 127, 250, 109, 0, 65, 1, 0, 0, 169, 2, 0, 0, 9, 5, 0, 0, 193, 8, 0, 0, 65, 14, 0, 0, 9, 22, 0, 0, 169, 32, 0, 0, 193, 46, 0, 0, 1, 65, 0, 0, 41, 88, 0, 0, 9, 117, 0, 0, 129, 152, 0, 0, 129, 195, 0, 0, 9, 247, 0, 0, 41, 52, 1, 0, 1, 124, 1, 0, 193, 207, 1, 0, 169, 48, 2, 0, 9, 160, 2, 0, 65, 31, 3, 0, 193, 175, 3, 0, 9, 83, 4, 0, 169, 10, 5, 0, 65, 216, 5, 0, 129, 189, 6, 0, 41, 188, 7, 0, 9, 214, 8, 0, 1, 13, 10, 0, 1, 99, 11, 0, 9, 218, 12, 0, 41, 116, 14, 0, 129, 51, 16, 0, 65, 26, 18, 0, 169, 42, 20, 0, 9, 103, 22, 0, 193, 209, 24, 0, 65, 109, 27, 0, 9, 60, 30, 0, 169, 64, 33, 0, 193, 125, 36, 0, 1, 246, 39, 0, 41, 172, 43, 0, 9, 163, 47, 0, 129, 221, 51, 0, 129, 94, 56, 0, 9, 41, 61, 0, 41, 64, 66, 0, 1, 167, 71, 0, 193, 96, 77, 0, 169, 112, 83, 0, 9, 218, 89, 0, 65, 160, 96, 0, 193, 198, 103, 0, 9, 81, 111, 0, 169, 66, 119, 0, 65, 159, 127, 0, 129, 106, 136, 0, 41, 168, 145, 0, 9, 92, 155, 0, 1, 138, 165, 0, 1, 54, 176, 0, 9, 100, 187, 0, 41, 24, 199, 0, 129, 86, 211, 0, 65, 35, 224, 0, 169, 130, 237, 0, 9, 121, 251, 0, 193, 10, 10, 1, 65, 60, 25, 1, 9, 18, 41, 1, 169, 144, 57, 1, 193, 188, 74, 1, 1, 155, 92, 1, 41, 48, 111, 1, 9, 129, 130, 1, 129, 146, 150, 1, 129, 105, 171, 1, 9, 11, 193, 1, 41, 124, 215, 1, 1, 194, 238, 1, 193, 225, 6, 2, 169, 224, 31, 2, 9, 196, 57, 2, 65, 145, 84, 2, 193, 77, 112, 2, 9, 255, 140, 2, 169, 170, 170, 2, 65, 86, 201, 2, 129, 7, 233, 2, 41, 196, 9, 3, 9, 146, 43, 3, 1, 119, 78, 3, 1, 121, 114, 3, 9, 158, 151, 3, 41, 236, 189, 3, 129, 105, 229, 3, 65, 28, 14, 4, 169, 10, 56, 4, 9, 59, 99, 4, 193, 179, 143, 4, 65, 123, 189, 4, 9, 152, 236, 4, 169, 16, 29, 5, 193, 235, 78, 5, 1, 48, 130, 5, 41, 228, 182, 5, 9, 15, 237, 5, 129, 183, 36, 6, 129, 228, 93, 6, 9, 157, 152, 6, 41, 232, 212, 6, 1, 205, 18, 7, 193, 82, 82, 7, 169, 128, 147, 7, 9, 94, 214, 7, 65, 242, 26, 8, 193, 68, 97, 8, 9, 93, 169, 8, 169, 66, 243, 8, 65, 253, 62, 9, 129, 148, 140, 9, 41, 16, 220, 9, 9, 120, 45, 10, 1, 212, 128, 10, 1, 44, 214, 10, 9, 136, 45, 11, 41, 240, 134, 11, 129, 108, 226, 11, 65, 5, 64, 12, 169, 194, 159, 12, 9, 173, 1, 13, 193, 204, 101, 13, 65, 42, 204, 13, 9, 206, 52, 14, 169, 192, 159, 14, 193, 10, 13, 15, 1, 181, 124, 15, 41, 200, 238, 15, 9, 77, 99, 16, 129, 76, 218, 16, 129, 207, 83, 17, 9, 223, 207, 17, 41, 132, 78, 18, 1, 200, 207, 18, 193, 179, 83, 19, 169, 80, 218, 19, 9, 168, 99, 20, 65, 195, 239, 20, 193, 171, 126, 21, 9, 107, 16, 22, 169, 10, 165, 22, 65, 148, 60, 23, 129, 17, 215, 23, 41, 140, 116, 24, 9, 14, 21, 25, 1, 161, 184, 25, 1, 79, 95, 26, 9, 34, 9, 27, 41, 36, 182, 27, 129, 95, 102, 28, 65, 222, 25, 29, 169, 170, 208, 29, 9, 207, 138, 30, 193, 85, 72, 31, 65, 73, 9, 32, 9, 180, 205, 32, 169, 160, 149, 33, 193, 25, 97, 34, 1, 42, 48, 35, 41, 220, 2, 36, 9, 59, 217, 36, 129, 81, 179, 37, 147, 6, 0, 0, 69, 14, 0, 0, 15, 28, 0, 0, 17, 51, 0, 0, 91, 87, 0, 0, 13, 142, 0, 0, 119, 221, 0, 0, 57, 77, 1, 0, 99, 230, 1, 0, 149, 179, 2, 0, 31, 193, 3, 0, 33, 29, 5, 0, 171, 215, 6, 0, 221, 2, 9, 0, 7, 179, 11, 0, 201, 254, 14, 0, 51, 255, 18, 0, 229, 207, 23, 0, 47, 143, 29, 0, 49, 94, 36, 0, 251, 96, 44, 0, 173, 190, 53, 0, 151, 161, 64, 0, 89, 55, 77, 0, 3, 177, 91, 0, 53, 67, 108, 0, 63, 38, 127, 0, 65, 150, 148, 0, 75, 211, 172, 0, 125, 33, 200, 0, 39, 201, 230, 0, 233, 22, 9, 1, 211, 91, 47, 1, 133, 237, 89, 1, 79, 38, 137, 1, 81, 101, 189, 1, 155, 14, 247, 1, 77, 139, 54, 2, 183, 73, 124, 2, 121, 189, 200, 2, 163, 95, 28, 3, 213, 174, 119, 3, 95, 47, 219, 3, 97, 107, 71, 4, 235, 242, 188, 4, 29, 92, 60, 5, 71, 67, 198, 5, 9, 75, 91, 6, 115, 28, 252, 6, 37, 103, 169, 7, 111, 225, 99, 8, 113, 72, 44, 9, 59, 96, 3, 10, 237, 243, 233, 10, 215, 213, 224, 11, 153, 223, 232, 12, 67, 242, 2, 14, 117, 246, 47, 15, 127, 220, 112, 16, 129, 156, 198, 17, 139, 54, 50, 19, 189, 178, 180, 20, 103, 33, 79, 22, 41, 155, 2, 24, 19, 65, 208, 25, 197, 60, 185, 27, 143, 192, 190, 29, 145, 7, 226, 31, 219, 85, 36, 34, 141, 248, 134, 36, 247, 69, 11, 39, 185, 157, 178, 41, 227, 104, 126, 44, 21, 26, 112, 47, 159, 45, 137, 50, 161, 41, 203, 53, 43, 158, 55, 57, 93, 37, 208, 60, 135, 99, 150, 64, 73, 7, 140, 68, 179, 201, 178, 72, 101, 110, 12, 77, 175, 195, 154, 81, 177, 162, 95, 86, 123, 239, 92, 91, 45, 153, 148, 96, 23, 154, 8, 102, 217, 247, 186, 107, 131, 195, 173, 113, 181, 25, 227, 119, 191, 34, 93, 126, 29, 35, 0, 0, 113, 77, 0, 0, 145, 156, 0, 0, 253, 38, 1, 0, 101, 12, 2, 0, 233, 119, 3, 0, 153, 162, 5, 0, 53, 214, 8, 0, 45, 112, 13, 0, 225, 228, 19, 0, 33, 195, 28, 0, 237, 183, 40, 0, 117, 146, 56, 0, 89, 72, 77, 0, 41, 250, 103, 0, 37, 248, 137, 0, 61, 199, 180, 0, 81, 38, 234, 0, 177, 19, 44, 1, 221, 210, 124, 1, 133, 242, 222, 1, 201, 82, 85, 2, 185, 43, 227, 2, 21, 20, 140, 3, 77, 8, 84, 4, 193, 113, 63, 5, 65, 46, 83, 6, 205, 151, 148, 7, 149, 140, 9, 9, 57, 119, 184, 10, 73, 87, 168, 12, 5, 202, 224, 14, 93, 19, 106, 17, 49, 39, 77, 20, 209, 178, 147, 23, 189, 38, 72, 27, 165, 192, 117, 31, 169, 149, 40, 36, 217, 156, 109, 41, 245, 185, 82, 47, 109, 200, 230, 53, 161, 166, 57, 61, 97, 65, 92, 69, 173, 159, 96, 78, 181, 238, 89, 88, 25, 142, 92, 99, 105, 28, 126, 111, 229, 131, 213, 124, 255, 189, 0, 0, 1, 168, 1, 0, 143, 107, 3, 0, 241, 158, 6, 0, 63, 35, 12, 0, 193, 61, 21, 0, 143, 182, 35, 0, 241, 252, 57, 0, 255, 81, 91, 0, 1, 250, 139, 0, 15, 117, 209, 0, 113, 191, 50, 1, 63, 154, 184, 1, 193, 220, 109, 2, 15, 207, 95, 3, 113, 142, 158, 4, 255, 123, 61, 6, 1, 182, 83, 8, 143, 156, 252, 10, 241, 97, 88, 14, 63, 167, 140, 18, 193, 37, 197, 23, 143, 101, 52, 30, 241, 129, 20, 38, 255, 251, 167, 47, 1, 156, 58, 59, 15, 98, 34, 73, 113, 134, 192, 89, 63, 138, 130, 109, 193, 88, 227, 132, 1, 14, 4, 0, 145, 33, 9, 0, 17, 44, 19, 0, 65, 238, 37, 0, 65, 79, 71, 0, 145, 67, 128, 0, 17, 247, 221, 0, 1, 70, 115, 1, 1, 146, 90, 2, 17, 1, 184, 3, 145, 53, 188, 5, 65, 143, 167, 8, 65, 6, 206, 12, 17, 178, 155, 18, 145, 15, 154, 26, 1, 26, 118, 37, 1, 76, 7, 52, 145, 158, 87, 71, 17, 157, 172, 96, 65, 166, 145, 129, 35, 81, 22, 0, 197, 158, 50, 0, 23, 185, 107, 0, 153, 246, 216, 0, 107, 137, 160, 1, 13, 196, 254, 2, 31, 1, 80, 5, 33, 217, 29, 9, 51, 108, 48, 15, 213, 162, 164, 24, 167, 103, 8, 39, 41, 253, 125, 60, 123, 181, 231, 91, 29, 119, 29, 137, 175, 160, 45, 201, 173, 142, 123, 0, 137, 230, 25, 1, 57, 150, 94, 2, 61, 22, 216, 4, 181, 99, 119, 9, 225, 40, 198, 17, 33, 3, 52, 32, 117, 72, 130, 56, 125, 87, 87, 96, 191, 91, 175, 2, 129, 216, 39, 6, 247, 132, 94, 13, 233, 254, 173, 27, 127, 139, 235, 54, 129, 183, 229, 104, 23, 3, 156, 193, 193, 12, 255, 14, 57, 106, 133, 34, 25, 238, 145, 75, 129, 120, 43, 158, 51, 225, 9, 84, 149, 139, 0, 0, 55, 152, 0, 0, 255, 165, 0, 0, 4, 181, 0, 0, 103, 197, 0, 0, 69, 215, 0, 0, 193, 234, 0, 0, 255, 255, 0, 0, 135, 90, 41, 45, 61, 244, 163, 6, 104, 253, 0, 0, 0, 0, 0, 0, 96, 21, 0, 0, 0, 0, 0, 0, 128, 187, 0, 0, 120, 0, 0, 0, 21, 0, 0, 0, 21, 0, 0, 0, 205, 108, 0, 0, 0, 16, 0, 32, 200, 21, 0, 0, 3, 0, 0, 0, 8, 0, 0, 0, 120, 0, 0, 0, 11, 0, 0, 0, 248, 21, 0, 0, 224, 22, 0, 0, 16, 23, 0, 0, 128, 7, 0, 0, 3, 0, 0, 0, 0, 24, 0, 0, 56, 24, 0, 0, 112, 24, 0, 0, 168, 24, 0, 0, 224, 24, 0, 0, 136, 1, 0, 0, 240, 38, 0, 0, 200, 39, 0, 0, 80, 41, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 10, 0, 12, 0, 14, 0, 16, 0, 20, 0, 24, 0, 28, 0, 34, 0, 40, 0, 48, 0, 60, 0, 78, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 90, 80, 75, 69, 63, 56, 49, 40, 34, 29, 20, 18, 10, 0, 0, 0, 0, 0, 0, 0, 0, 110, 100, 90, 84, 78, 71, 65, 58, 51, 45, 39, 32, 26, 20, 12, 0, 0, 0, 0, 0, 0, 118, 110, 103, 93, 86, 80, 75, 70, 65, 59, 53, 47, 40, 31, 23, 15, 4, 0, 0, 0, 0, 126, 119, 112, 104, 95, 89, 83, 78, 72, 66, 60, 54, 47, 39, 32, 25, 17, 12, 1, 0, 0, 134, 127, 120, 114, 103, 97, 91, 85, 78, 72, 66, 60, 54, 47, 41, 35, 29, 23, 16, 10, 1, 144, 137, 130, 124, 113, 107, 101, 95, 88, 82, 76, 70, 64, 57, 51, 45, 39, 33, 26, 15, 1, 152, 145, 138, 132, 123, 117, 111, 105, 98, 92, 86, 80, 74, 67, 61, 55, 49, 43, 36, 20, 1, 162, 155, 148, 142, 133, 127, 121, 115, 108, 102, 96, 90, 84, 77, 71, 65, 59, 53, 46, 30, 1, 172, 165, 158, 152, 143, 137, 131, 125, 118, 112, 106, 100, 94, 87, 81, 75, 69, 63, 56, 45, 20, 200, 200, 200, 200, 200, 200, 200, 200, 198, 193, 188, 183, 178, 173, 168, 163, 158, 153, 148, 129, 104, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 8, 0, 8, 0, 8, 0, 16, 0, 16, 0, 16, 0, 21, 0, 21, 0, 24, 0, 29, 0, 34, 0, 36, 0, 0, 0, 0, 0, 0, 0, 2, 0, 20, 0, 55, 0, 108, 0, 178, 0, 10, 1, 116, 1, 238, 1, 123, 2, 24, 3, 198, 3, 133, 4, 85, 5, 54, 6, 39, 7, 41, 8, 58, 9, 91, 10, 140, 11, 204, 12, 27, 14, 121, 15, 229, 16, 95, 18, 230, 19, 123, 21, 28, 23, 202, 24, 132, 26, 73, 28, 25, 30, 243, 31, 215, 33, 196, 35, 185, 37, 183, 39, 188, 41, 199, 43, 216, 45, 239, 47, 10, 50, 41, 52, 75, 54, 111, 56, 149, 58, 187, 60, 226, 62, 8, 65, 45, 67, 80, 69, 111, 71, 139, 73, 163, 75, 181, 77, 194, 79, 200, 81, 199, 83, 190, 85, 173, 87, 147, 89, 111, 91, 66, 93, 10, 95, 198, 96, 120, 98, 29, 100, 183, 101, 67, 103, 195, 104, 54, 106, 156, 107, 245, 108, 64, 110, 125, 111, 173, 112, 207, 113, 227, 114, 234, 115, 228, 116, 208, 117, 176, 118, 130, 119, 72, 120, 1, 121, 175, 121, 81, 122, 231, 122, 114, 123, 243, 123, 105, 124, 214, 124, 57, 125, 148, 125, 229, 125, 47, 126, 114, 126, 173, 126, 225, 126, 16, 127, 56, 127, 92, 127, 122, 127, 149, 127, 171, 127, 189, 127, 205, 127, 217, 127, 228, 127, 236, 127, 242, 127, 246, 127, 250, 127, 252, 127, 254, 127, 255, 127, 255, 127, 255, 127, 255, 127, 255, 127, 255, 127, 224, 1, 0, 0, 68, 68, 0, 0, 8, 0, 0, 0, 255, 255, 255, 255, 5, 0, 96, 0, 3, 0, 32, 0, 4, 0, 8, 0, 2, 0, 4, 0, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 52, 0, 0, 112, 42, 0, 0, 240, 0, 0, 0, 68, 68, 0, 0, 7, 0, 0, 0, 1, 0, 0, 0, 5, 0, 48, 0, 3, 0, 16, 0, 4, 0, 4, 0, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 224, 50, 0, 0, 112, 42, 0, 0, 120, 0, 0, 0, 68, 68, 0, 0, 6, 0, 0, 0, 2, 0, 0, 0, 5, 0, 24, 0, 3, 0, 8, 0, 2, 0, 4, 0, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 49, 0, 0, 112, 42, 0, 0, 60, 0, 0, 0, 68, 68, 0, 0, 5, 0, 0, 0, 3, 0, 0, 0, 5, 0, 12, 0, 3, 0, 4, 0, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 248, 41, 0, 0, 112, 42, 0, 0, 255, 127, 255, 127, 255, 127, 254, 127, 253, 127, 251, 127, 249, 127, 247, 127, 244, 127, 241, 127, 238, 127, 234, 127, 230, 127, 226, 127, 221, 127, 216, 127, 210, 127, 205, 127, 198, 127, 192, 127, 185, 127, 178, 127, 170, 127, 162, 127, 154, 127, 145, 127, 136, 127, 127, 127, 117, 127, 107, 127, 97, 127, 86, 127, 75, 127, 64, 127, 52, 127, 40, 127, 27, 127, 14, 127, 1, 127, 244, 126, 230, 126, 216, 126, 201, 126, 186, 126, 171, 126, 155, 126, 139, 126, 123, 126, 106, 126, 89, 126, 72, 126, 54, 126, 36, 126, 18, 126, 255, 125, 236, 125, 217, 125, 197, 125, 177, 125, 157, 125, 136, 125, 115, 125, 93, 125, 71, 125, 49, 125, 27, 125, 4, 125, 237, 124, 213, 124, 189, 124, 165, 124, 140, 124, 115, 124, 90, 124, 65, 124, 39, 124, 12, 124, 242, 123, 215, 123, 188, 123, 160, 123, 132, 123, 104, 123, 75, 123, 46, 123, 17, 123, 243, 122, 213, 122, 183, 122, 152, 122, 121, 122, 90, 122, 58, 122, 26, 122, 250, 121, 217, 121, 184, 121, 151, 121, 117, 121, 83, 121, 49, 121, 14, 121, 235, 120, 200, 120, 164, 120, 128, 120, 92, 120, 55, 120, 18, 120, 237, 119, 199, 119, 161, 119, 123, 119, 84, 119, 45, 119, 6, 119, 222, 118, 182, 118, 142, 118, 101, 118, 61, 118, 19, 118, 234, 117, 192, 117, 150, 117, 107, 117, 64, 117, 21, 117, 234, 116, 190, 116, 146, 116, 101, 116, 56, 116, 11, 116, 222, 115, 176, 115, 130, 115, 84, 115, 37, 115, 246, 114, 199, 114, 151, 114, 103, 114, 55, 114, 6, 114, 214, 113, 164, 113, 115, 113, 65, 113, 15, 113, 220, 112, 170, 112, 119, 112, 67, 112, 16, 112, 220, 111, 167, 111, 115, 111, 62, 111, 9, 111, 211, 110, 157, 110, 103, 110, 49, 110, 250, 109, 195, 109, 140, 109, 84, 109, 28, 109, 228, 108, 172, 108, 115, 108, 58, 108, 0, 108, 199, 107, 141, 107, 82, 107, 24, 107, 221, 106, 162, 106, 102, 106, 42, 106, 238, 105, 178, 105, 117, 105, 56, 105, 251, 104, 190, 104, 128, 104, 66, 104, 4, 104, 197, 103, 134, 103, 71, 103, 7, 103, 200, 102, 135, 102, 71, 102, 7, 102, 198, 101, 132, 101, 67, 101, 1, 101, 191, 100, 125, 100, 58, 100, 248, 99, 180, 99, 113, 99, 45, 99, 234, 98, 165, 98, 97, 98, 28, 98, 215, 97, 146, 97, 76, 97, 6, 97, 192, 96, 122, 96, 51, 96, 237, 95, 165, 95, 94, 95, 22, 95, 206, 94, 134, 94, 62, 94, 245, 93, 172, 93, 99, 93, 26, 93, 208, 92, 134, 92, 60, 92, 241, 91, 166, 91, 91, 91, 16, 91, 197, 90, 121, 90, 45, 90, 225, 89, 148, 89, 72, 89, 251, 88, 173, 88, 96, 88, 18, 88, 196, 87, 118, 87, 40, 87, 217, 86, 138, 86, 59, 86, 236, 85, 156, 85, 76, 85, 252, 84, 172, 84, 91, 84, 11, 84, 186, 83, 104, 83, 23, 83, 197, 82, 115, 82, 33, 82, 207, 81, 124, 81, 41, 81, 214, 80, 131, 80, 48, 80, 220, 79, 136, 79, 52, 79, 224, 78, 139, 78, 54, 78, 225, 77, 140, 77, 55, 77, 225, 76, 139, 76, 53, 76, 223, 75, 136, 75, 50, 75, 219, 74, 132, 74, 44, 74, 213, 73, 125, 73, 37, 73, 205, 72, 117, 72, 28, 72, 196, 71, 107, 71, 18, 71, 184, 70, 95, 70, 5, 70, 171, 69, 81, 69, 247, 68, 157, 68, 66, 68, 231, 67, 140, 67, 49, 67, 214, 66, 122, 66, 31, 66, 195, 65, 103, 65, 10, 65, 174, 64, 81, 64, 244, 63, 151, 63, 58, 63, 221, 62, 127, 62, 34, 62, 196, 61, 102, 61, 8, 61, 169, 60, 75, 60, 236, 59, 141, 59, 46, 59, 207, 58, 112, 58, 16, 58, 177, 57, 81, 57, 241, 56, 145, 56, 49, 56, 208, 55, 112, 55, 15, 55, 174, 54, 77, 54, 236, 53, 138, 53, 41, 53, 199, 52, 102, 52, 4, 52, 162, 51, 63, 51, 221, 50, 123, 50, 24, 50, 181, 49, 82, 49, 239, 48, 140, 48, 41, 48, 198, 47, 98, 47, 254, 46, 154, 46, 55, 46, 210, 45, 110, 45, 10, 45, 166, 44, 65, 44, 220, 43, 120, 43, 19, 43, 174, 42, 72, 42, 227, 41, 126, 41, 24, 41, 179, 40, 77, 40, 231, 39, 129, 39, 27, 39, 181, 38, 79, 38, 232, 37, 130, 37, 27, 37, 181, 36, 78, 36, 231, 35, 128, 35, 25, 35, 178, 34, 74, 34, 227, 33, 124, 33, 20, 33, 172, 32, 69, 32, 221, 31, 117, 31, 13, 31, 165, 30, 61, 30, 213, 29, 108, 29, 4, 29, 155, 28, 51, 28, 202, 27, 97, 27, 249, 26, 144, 26, 39, 26, 190, 25, 85, 25, 236, 24, 130, 24, 25, 24, 176, 23, 70, 23, 221, 22, 115, 22, 10, 22, 160, 21, 54, 21, 205, 20, 99, 20, 249, 19, 143, 19, 37, 19, 187, 18, 81, 18, 231, 17, 124, 17, 18, 17, 168, 16, 61, 16, 211, 15, 105, 15, 254, 14, 148, 14, 41, 14, 190, 13, 84, 13, 233, 12, 126, 12, 20, 12, 169, 11, 62, 11, 211, 10, 104, 10, 254, 9, 147, 9, 40, 9, 189, 8, 82, 8, 231, 7, 124, 7, 17, 7, 166, 6, 58, 6, 207, 5, 100, 5, 249, 4, 142, 4, 35, 4, 184, 3, 76, 3, 225, 2, 118, 2, 11, 2, 160, 1, 52, 1, 201, 0, 94, 0, 243, 255, 135, 255, 28, 255, 177, 254, 70, 254, 218, 253, 111, 253, 4, 253, 153, 252, 46, 252, 194, 251, 87, 251, 236, 250, 129, 250, 22, 250, 171, 249, 64, 249, 213, 248, 106, 248, 255, 247, 147, 247, 41, 247, 190, 246, 83, 246, 232, 245, 125, 245, 18, 245, 167, 244, 60, 244, 210, 243, 103, 243, 252, 242, 145, 242, 39, 242, 188, 241, 82, 241, 231, 240, 125, 240, 18, 240, 168, 239, 62, 239, 211, 238, 105, 238, 255, 237, 149, 237, 43, 237, 193, 236, 87, 236, 237, 235, 131, 235, 25, 235, 175, 234, 70, 234, 220, 233, 114, 233, 9, 233, 159, 232, 54, 232, 205, 231, 99, 231, 250, 230, 145, 230, 40, 230, 191, 229, 86, 229, 237, 228, 132, 228, 28, 228, 179, 227, 75, 227, 226, 226, 122, 226, 17, 226, 169, 225, 65, 225, 217, 224, 113, 224, 9, 224, 161, 223, 58, 223, 210, 222, 107, 222, 3, 222, 156, 221, 53, 221, 205, 220, 102, 220, 255, 219, 153, 219, 50, 219, 203, 218, 101, 218, 254, 217, 152, 217, 50, 217, 203, 216, 101, 216, 255, 215, 154, 215, 52, 215, 206, 214, 105, 214, 4, 214, 158, 213, 57, 213, 212, 212, 111, 212, 11, 212, 166, 211, 65, 211, 221, 210, 121, 210, 20, 210, 176, 209, 77, 209, 233, 208, 133, 208, 34, 208, 190, 207, 91, 207, 248, 206, 149, 206, 50, 206, 207, 205, 109, 205, 10, 205, 168, 204, 70, 204, 228, 203, 130, 203, 32, 203, 191, 202, 93, 202, 252, 201, 155, 201, 58, 201, 217, 200, 120, 200, 24, 200, 183, 199, 87, 199, 247, 198, 151, 198, 55, 198, 216, 197, 120, 197, 25, 197, 186, 196, 91, 196, 252, 195, 157, 195, 63, 195, 225, 194, 131, 194, 37, 194, 199, 193, 105, 193, 12, 193, 174, 192, 81, 192, 244, 191, 152, 191, 59, 191, 223, 190, 130, 190, 38, 190, 203, 189, 111, 189, 19, 189, 184, 188, 93, 188, 2, 188, 167, 187, 77, 187, 242, 186, 152, 186, 62, 186, 228, 185, 139, 185, 49, 185, 216, 184, 127, 184, 38, 184, 205, 183, 117, 183, 29, 183, 197, 182, 109, 182, 21, 182, 190, 181, 102, 181, 15, 181, 185, 180, 98, 180, 12, 180, 181, 179, 95, 179, 10, 179, 180, 178, 95, 178, 9, 178, 181, 177, 96, 177, 11, 177, 183, 176, 99, 176, 15, 176, 187, 175, 104, 175, 21, 175, 194, 174, 111, 174, 29, 174, 202, 173, 120, 173, 38, 173, 213, 172, 131, 172, 50, 172, 225, 171, 144, 171, 64, 171, 240, 170, 160, 170, 80, 170, 0, 170, 177, 169, 98, 169, 19, 169, 197, 168, 118, 168, 40, 168, 218, 167, 141, 167, 63, 167, 242, 166, 165, 166, 89, 166, 12, 166, 192, 165, 116, 165, 40, 165, 221, 164, 146, 164, 71, 164, 252, 163, 178, 163, 104, 163, 30, 163, 212, 162, 139, 162, 66, 162, 249, 161, 176, 161, 104, 161, 32, 161, 216, 160, 144, 160, 73, 160, 2, 160, 187, 159, 116, 159, 46, 159, 232, 158, 162, 158, 93, 158, 24, 158, 211, 157, 142, 157, 74, 157, 5, 157, 194, 156, 126, 156, 59, 156, 248, 155, 181, 155, 114, 155, 48, 155, 238, 154, 173, 154, 107, 154, 42, 154, 233, 153, 169, 153, 104, 153, 41, 153, 233, 152, 169, 152, 106, 152, 43, 152, 237, 151, 175, 151, 113, 151, 51, 151, 245, 150, 184, 150, 123, 150, 63, 150, 3, 150, 199, 149, 139, 149, 80, 149, 20, 149, 218, 148, 159, 148, 101, 148, 43, 148, 241, 147, 184, 147, 127, 147, 70, 147, 14, 147, 214, 146, 158, 146, 102, 146, 47, 146, 248, 145, 193, 145, 139, 145, 85, 145, 31, 145, 234, 144, 181, 144, 128, 144, 76, 144, 23, 144, 227, 143, 176, 143, 125, 143, 74, 143, 23, 143, 229, 142, 178, 142, 129, 142, 79, 142, 30, 142, 237, 141, 189, 141, 141, 141, 93, 141, 45, 141, 254, 140, 207, 140, 161, 140, 114, 140, 68, 140, 23, 140, 233, 139, 188, 139, 144, 139, 99, 139, 55, 139, 11, 139, 224, 138, 181, 138, 138, 138, 96, 138, 54, 138, 12, 138, 226, 137, 185, 137, 144, 137, 104, 137, 64, 137, 24, 137, 240, 136, 201, 136, 162, 136, 124, 136, 85, 136, 48, 136, 10, 136, 229, 135, 192, 135, 155, 135, 119, 135, 83, 135, 47, 135, 12, 135, 233, 134, 199, 134, 164, 134, 130, 134, 97, 134, 64, 134, 31, 134, 254, 133, 222, 133, 190, 133, 158, 133, 127, 133, 96, 133, 66, 133, 35, 133, 5, 133, 232, 132, 203, 132, 174, 132, 145, 132, 117, 132, 89, 132, 62, 132, 34, 132, 7, 132, 237, 131, 211, 131, 185, 131, 159, 131, 134, 131, 109, 131, 85, 131, 61, 131, 37, 131, 14, 131, 246, 130, 224, 130, 201, 130, 179, 130, 157, 130, 136, 130, 115, 130, 94, 130, 74, 130, 54, 130, 34, 130, 15, 130, 252, 129, 233, 129, 215, 129, 197, 129, 179, 129, 162, 129, 145, 129, 129, 129, 113, 129, 97, 129, 81, 129, 66, 129, 51, 129, 37, 129, 23, 129, 9, 129, 251, 128, 238, 128, 226, 128, 213, 128, 201, 128, 189, 128, 178, 128, 167, 128, 156, 128, 146, 128, 136, 128, 127, 128, 117, 128, 109, 128, 100, 128, 92, 128, 84, 128, 76, 128, 69, 128, 62, 128, 56, 128, 50, 128, 44, 128, 39, 128, 34, 128, 29, 128, 25, 128, 21, 128, 17, 128, 14, 128, 11, 128, 8, 128, 6, 128, 4, 128, 3, 128, 1, 128, 1, 128, 1, 128, 255, 127, 255, 127, 253, 127, 249, 127, 244, 127, 238, 127, 230, 127, 220, 127, 210, 127, 198, 127, 184, 127, 169, 127, 153, 127, 135, 127, 116, 127, 96, 127, 74, 127, 50, 127, 26, 127, 0, 127, 228, 126, 199, 126, 169, 126, 137, 126, 104, 126, 70, 126, 34, 126, 253, 125, 214, 125, 174, 125, 133, 125, 90, 125, 46, 125, 1, 125, 210, 124, 162, 124, 112, 124, 61, 124, 9, 124, 212, 123, 157, 123, 100, 123, 42, 123, 239, 122, 179, 122, 117, 122, 54, 122, 246, 121, 180, 121, 113, 121, 44, 121, 231, 120, 160, 120, 87, 120, 13, 120, 194, 119, 118, 119, 40, 119, 217, 118, 137, 118, 55, 118, 229, 117, 144, 117, 59, 117, 228, 116, 140, 116, 51, 116, 216, 115, 124, 115, 31, 115, 193, 114, 97, 114, 0, 114, 158, 113, 59, 113, 214, 112, 112, 112, 9, 112, 161, 111, 55, 111, 205, 110, 97, 110, 243, 109, 133, 109, 21, 109, 164, 108, 50, 108, 191, 107, 75, 107, 213, 106, 95, 106, 231, 105, 110, 105, 244, 104, 120, 104, 252, 103, 126, 103, 255, 102, 127, 102, 254, 101, 124, 101, 249, 100, 117, 100, 239, 99, 105, 99, 225, 98, 88, 98, 206, 97, 68, 97, 184, 96, 43, 96, 157, 95, 13, 95, 125, 94, 236, 93, 90, 93, 199, 92, 50, 92, 157, 91, 7, 91, 112, 90, 215, 89, 62, 89, 164, 88, 9, 88, 108, 87, 207, 86, 49, 86, 146, 85, 242, 84, 81, 84, 175, 83, 13, 83, 105, 82, 197, 81, 31, 81, 121, 80, 210, 79, 41, 79, 128, 78, 215, 77, 44, 77, 128, 76, 212, 75, 39, 75, 121, 74, 202, 73, 26, 73, 106, 72, 185, 71, 7, 71, 84, 70, 160, 69, 236, 68, 55, 68, 129, 67, 202, 66, 19, 66, 91, 65, 162, 64, 233, 63, 47, 63, 116, 62, 184, 61, 252, 60, 63, 60, 130, 59, 195, 58, 4, 58, 69, 57, 133, 56, 196, 55, 3, 55, 65, 54, 126, 53, 187, 52, 247, 51, 51, 51, 110, 50, 169, 49, 227, 48, 29, 48, 86, 47, 142, 46, 198, 45, 253, 44, 52, 44, 107, 43, 161, 42, 214, 41, 12, 41, 64, 40, 116, 39, 168, 38, 219, 37, 14, 37, 65, 36, 115, 35, 165, 34, 214, 33, 7, 33, 56, 32, 104, 31, 152, 30, 199, 29, 247, 28, 38, 28, 84, 27, 131, 26, 177, 25, 222, 24, 12, 24, 57, 23, 102, 22, 147, 21, 191, 20, 236, 19, 24, 19, 67, 18, 111, 17, 155, 16, 198, 15, 241, 14, 28, 14, 71, 13, 113, 12, 156, 11, 198, 10, 240, 9, 26, 9, 68, 8, 110, 7, 152, 6, 194, 5, 236, 4, 21, 4, 63, 3, 105, 2, 146, 1, 188, 0, 229, 255, 15, 255, 56, 254, 98, 253, 139, 252, 181, 251, 223, 250, 8, 250, 50, 249, 92, 248, 134, 247, 176, 246, 218, 245, 5, 245, 47, 244, 89, 243, 132, 242, 175, 241, 218, 240, 5, 240, 48, 239, 92, 238, 136, 237, 179, 236, 223, 235, 12, 235, 56, 234, 101, 233, 146, 232, 191, 231, 237, 230, 27, 230, 73, 229, 119, 228, 166, 227, 213, 226, 4, 226, 52, 225, 100, 224, 148, 223, 197, 222, 246, 221, 40, 221, 89, 220, 140, 219, 190, 218, 241, 217, 37, 217, 89, 216, 141, 215, 194, 214, 247, 213, 45, 213, 99, 212, 153, 211, 208, 210, 8, 210, 64, 209, 121, 208, 178, 207, 235, 206, 38, 206, 96, 205, 156, 204, 216, 203, 20, 203, 81, 202, 143, 201, 205, 200, 12, 200, 75, 199, 139, 198, 204, 197, 13, 197, 79, 196, 146, 195, 213, 194, 25, 194, 93, 193, 163, 192, 233, 191, 47, 191, 119, 190, 191, 189, 8, 189, 82, 188, 156, 187, 231, 186, 51, 186, 127, 185, 205, 184, 27, 184, 106, 183, 186, 182, 10, 182, 92, 181, 174, 180, 1, 180, 85, 179, 169, 178, 255, 177, 85, 177, 172, 176, 5, 176, 94, 175, 183, 174, 18, 174, 110, 173, 203, 172, 40, 172, 134, 171, 230, 170, 70, 170, 167, 169, 9, 169, 108, 168, 209, 167, 54, 167, 156, 166, 3, 166, 107, 165, 212, 164, 62, 164, 168, 163, 20, 163, 129, 162, 240, 161, 95, 161, 207, 160, 64, 160, 178, 159, 37, 159, 154, 158, 15, 158, 133, 157, 253, 156, 118, 156, 239, 155, 106, 155, 230, 154, 99, 154, 225, 153, 96, 153, 225, 152, 98, 152, 229, 151, 105, 151, 238, 150, 116, 150, 251, 149, 132, 149, 13, 149, 152, 148, 36, 148, 177, 147, 63, 147, 207, 146, 95, 146, 241, 145, 132, 145, 25, 145, 174, 144, 69, 144, 221, 143, 118, 143, 17, 143, 172, 142, 73, 142, 231, 141, 135, 141, 39, 141, 201, 140, 109, 140, 17, 140, 183, 139, 94, 139, 6, 139, 176, 138, 90, 138, 7, 138, 180, 137, 99, 137, 19, 137, 196, 136, 119, 136, 43, 136, 224, 135, 151, 135, 79, 135, 8, 135, 194, 134, 126, 134, 60, 134, 250, 133, 186, 133, 123, 133, 62, 133, 2, 133, 199, 132, 142, 132, 86, 132, 31, 132, 234, 131, 182, 131, 131, 131, 82, 131, 34, 131, 244, 130, 198, 130, 155, 130, 112, 130, 71, 130, 32, 130, 250, 129, 213, 129, 177, 129, 143, 129, 111, 129, 79, 129, 49, 129, 21, 129, 250, 128, 224, 128, 200, 128, 177, 128, 155, 128, 135, 128, 116, 128, 99, 128, 83, 128, 68, 128, 55, 128, 44, 128, 33, 128, 24, 128, 17, 128, 11, 128, 6, 128, 2, 128, 1, 128, 255, 127, 252, 127, 243, 127, 229, 127, 208, 127, 182, 127, 151, 127, 114, 127, 71, 127, 23, 127, 225, 126, 165, 126, 100, 126, 30, 126, 209, 125, 128, 125, 41, 125, 204, 124, 106, 124, 3, 124, 150, 123, 35, 123, 171, 122, 46, 122, 172, 121, 36, 121, 151, 120, 4, 120, 108, 119, 207, 118, 45, 118, 134, 117, 217, 116, 40, 116, 113, 115, 181, 114, 244, 113, 46, 113, 99, 112, 148, 111, 191, 110, 230, 109, 7, 109, 36, 108, 60, 107, 80, 106, 95, 105, 105, 104, 110, 103, 111, 102, 108, 101, 100, 100, 88, 99, 71, 98, 50, 97, 25, 96, 251, 94, 218, 93, 180, 92, 138, 91, 93, 90, 43, 89, 245, 87, 188, 86, 126, 85, 61, 84, 248, 82, 176, 81, 100, 80, 20, 79, 193, 77, 107, 76, 17, 75, 180, 73, 84, 72, 240, 70, 138, 69, 32, 68, 179, 66, 68, 65, 210, 63, 92, 62, 228, 60, 106, 59, 237, 57, 109, 56, 235, 54, 102, 53, 223, 51, 86, 50, 202, 48, 61, 47, 173, 45, 27, 44, 136, 42, 242, 40, 91, 39, 194, 37, 39, 36, 139, 34, 237, 32, 78, 31, 173, 29, 12, 28, 104, 26, 196, 24, 31, 23, 120, 21, 209, 19, 41, 18, 128, 16, 214, 14, 44, 13, 129, 11, 213, 9, 42, 8, 125, 6, 209, 4, 36, 3, 119, 1, 202, 255, 29, 254, 113, 252, 196, 250, 24, 249, 107, 247, 192, 245, 20, 244, 105, 242, 191, 240, 22, 239, 109, 237, 197, 235, 30, 234, 120, 232, 211, 230, 47, 229, 140, 227, 234, 225, 74, 224, 171, 222, 14, 221, 114, 219, 216, 217, 63, 216, 168, 214, 19, 213, 128, 211, 239, 209, 96, 208, 211, 206, 72, 205, 191, 203, 57, 202, 181, 200, 51, 199, 180, 197, 55, 196, 189, 194, 70, 193, 210, 191, 96, 190, 241, 188, 133, 187, 28, 186, 183, 184, 84, 183, 244, 181, 152, 180, 63, 179, 234, 177, 151, 176, 73, 175, 254, 173, 182, 172, 114, 171, 50, 170, 246, 168, 189, 167, 136, 166, 88, 165, 43, 164, 2, 163, 221, 161, 189, 160, 160, 159, 136, 158, 116, 157, 101, 156, 90, 155, 83, 154, 80, 153, 83, 152, 89, 151, 101, 150, 117, 149, 137, 148, 163, 147, 193, 146, 228, 145, 11, 145, 56, 144, 105, 143, 160, 142, 219, 141, 28, 141, 97, 140, 172, 139, 251, 138, 80, 138, 170, 137, 9, 137, 109, 136, 215, 135, 70, 135, 186, 134, 51, 134, 178, 133, 54, 133, 192, 132, 79, 132, 227, 131, 125, 131, 28, 131, 193, 130, 107, 130, 27, 130, 208, 129, 139, 129, 75, 129, 17, 129, 221, 128, 174, 128, 133, 128, 97, 128, 67, 128, 42, 128, 23, 128, 10, 128, 2, 128, 255, 127, 242, 127, 205, 127, 146, 127, 65, 127, 217, 126, 92, 126, 200, 125, 29, 125, 93, 124, 136, 123, 156, 122, 155, 121, 133, 120, 89, 119, 24, 118, 195, 116, 90, 115, 220, 113, 74, 112, 164, 110, 235, 108, 31, 107, 64, 105, 79, 103, 75, 101, 54, 99, 15, 97, 215, 94, 143, 92, 55, 90, 206, 87, 86, 85, 207, 82, 58, 80, 151, 77, 230, 74, 40, 72, 93, 69, 134, 66, 163, 63, 181, 60, 189, 57, 186, 54, 174, 51, 153, 48, 123, 45, 85, 42, 40, 39, 244, 35, 185, 32, 121, 29, 52, 26, 234, 22, 156, 19, 75, 16, 247, 12, 160, 9, 72, 6, 239, 2, 149, 255, 59, 252, 226, 248, 138, 245, 52, 242, 225, 238, 144, 235, 67, 232, 250, 228, 182, 225, 119, 222, 63, 219, 12, 216, 225, 212, 189, 209, 161, 206, 142, 203, 132, 200, 132, 197, 142, 194, 163, 191, 195, 188, 239, 185, 40, 183, 109, 180, 191, 177, 31, 175, 141, 172, 10, 170, 150, 167, 50, 165, 221, 162, 153, 160, 102, 158, 67, 156, 50, 154, 51, 152, 70, 150, 108, 148, 165, 146, 241, 144, 80, 143, 195, 141, 74, 140, 229, 138, 149, 137, 90, 136, 52, 135, 35, 134, 39, 133, 65, 132, 113, 131, 182, 130, 17, 130, 131, 129, 11, 129, 168, 128, 93, 128, 39, 128, 9, 128, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 41, 0, 41, 0, 82, 0, 82, 0, 123, 0, 164, 0, 200, 0, 222, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 41, 0, 41, 0, 41, 0, 123, 0, 123, 0, 123, 0, 164, 0, 164, 0, 240, 0, 10, 1, 27, 1, 39, 1, 41, 0, 41, 0, 41, 0, 41, 0, 41, 0, 41, 0, 41, 0, 41, 0, 123, 0, 123, 0, 123, 0, 123, 0, 240, 0, 240, 0, 240, 0, 10, 1, 10, 1, 49, 1, 62, 1, 72, 1, 80, 1, 123, 0, 123, 0, 123, 0, 123, 0, 123, 0, 123, 0, 123, 0, 123, 0, 240, 0, 240, 0, 240, 0, 240, 0, 49, 1, 49, 1, 49, 1, 62, 1, 62, 1, 87, 1, 95, 1, 102, 1, 108, 1, 240, 0, 240, 0, 240, 0, 240, 0, 240, 0, 240, 0, 240, 0, 240, 0, 49, 1, 49, 1, 49, 1, 49, 1, 87, 1, 87, 1, 87, 1, 95, 1, 95, 1, 114, 1, 120, 1, 126, 1, 131, 1, 0, 0, 0, 0, 0, 0, 40, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 40, 15, 23, 28, 31, 34, 36, 38, 39, 41, 42, 43, 44, 45, 46, 47, 47, 49, 50, 51, 52, 53, 54], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
        allocate([55, 55, 57, 58, 59, 60, 61, 62, 63, 63, 65, 66, 67, 68, 69, 70, 71, 71, 40, 20, 33, 41, 48, 53, 57, 61, 64, 66, 69, 71, 73, 75, 76, 78, 80, 82, 85, 87, 89, 91, 92, 94, 96, 98, 101, 103, 105, 107, 108, 110, 112, 114, 117, 119, 121, 123, 124, 126, 128, 40, 23, 39, 51, 60, 67, 73, 79, 83, 87, 91, 94, 97, 100, 102, 105, 107, 111, 115, 118, 121, 124, 126, 129, 131, 135, 139, 142, 145, 148, 150, 153, 155, 159, 163, 166, 169, 172, 174, 177, 179, 35, 28, 49, 65, 78, 89, 99, 107, 114, 120, 126, 132, 136, 141, 145, 149, 153, 159, 165, 171, 176, 180, 185, 189, 192, 199, 205, 211, 216, 220, 225, 229, 232, 239, 245, 251, 21, 33, 58, 79, 97, 112, 125, 137, 148, 157, 166, 174, 182, 189, 195, 201, 207, 217, 227, 235, 243, 251, 17, 35, 63, 86, 106, 123, 139, 152, 165, 177, 187, 197, 206, 214, 222, 230, 237, 250, 25, 31, 55, 75, 91, 105, 117, 128, 138, 146, 154, 161, 168, 174, 180, 185, 190, 200, 208, 215, 222, 229, 235, 240, 245, 255, 16, 36, 65, 89, 110, 128, 144, 159, 173, 185, 196, 207, 217, 226, 234, 242, 250, 11, 41, 74, 103, 128, 151, 172, 191, 209, 225, 241, 255, 9, 43, 79, 110, 138, 163, 186, 207, 227, 246, 12, 39, 71, 99, 123, 144, 164, 182, 198, 214, 228, 241, 253, 9, 44, 81, 113, 142, 168, 192, 214, 235, 255, 7, 49, 90, 127, 160, 191, 220, 247, 6, 51, 95, 134, 170, 203, 234, 7, 47, 87, 123, 155, 184, 212, 237, 6, 52, 97, 137, 174, 208, 240, 5, 57, 106, 151, 192, 231, 5, 59, 111, 158, 202, 243, 5, 55, 103, 147, 187, 224, 5, 60, 113, 161, 206, 248, 4, 65, 122, 175, 224, 4, 67, 127, 182, 234, 224, 224, 224, 224, 224, 224, 224, 224, 160, 160, 160, 160, 185, 185, 185, 178, 178, 168, 134, 61, 37, 224, 224, 224, 224, 224, 224, 224, 224, 240, 240, 240, 240, 207, 207, 207, 198, 198, 183, 144, 66, 40, 160, 160, 160, 160, 160, 160, 160, 160, 185, 185, 185, 185, 193, 193, 193, 183, 183, 172, 138, 64, 38, 240, 240, 240, 240, 240, 240, 240, 240, 207, 207, 207, 207, 204, 204, 204, 193, 193, 180, 143, 66, 40, 185, 185, 185, 185, 185, 185, 185, 185, 193, 193, 193, 193, 193, 193, 193, 183, 183, 172, 138, 65, 39, 207, 207, 207, 207, 207, 207, 207, 207, 204, 204, 204, 204, 201, 201, 201, 188, 188, 176, 141, 66, 40, 193, 193, 193, 193, 193, 193, 193, 193, 193, 193, 193, 193, 194, 194, 194, 184, 184, 173, 139, 65, 39, 204, 204, 204, 204, 204, 204, 204, 204, 201, 201, 201, 201, 198, 198, 198, 187, 187, 175, 140, 66, 40, 0, 0, 12, 0, 24, 0, 36, 0, 48, 0, 4, 0, 16, 0, 28, 0, 40, 0, 52, 0, 8, 0, 20, 0, 32, 0, 44, 0, 56, 0, 1, 0, 13, 0, 25, 0, 37, 0, 49, 0, 5, 0, 17, 0, 29, 0, 41, 0, 53, 0, 9, 0, 21, 0, 33, 0, 45, 0, 57, 0, 2, 0, 14, 0, 26, 0, 38, 0, 50, 0, 6, 0, 18, 0, 30, 0, 42, 0, 54, 0, 10, 0, 22, 0, 34, 0, 46, 0, 58, 0, 3, 0, 15, 0, 27, 0, 39, 0, 51, 0, 7, 0, 19, 0, 31, 0, 43, 0, 55, 0, 11, 0, 23, 0, 35, 0, 47, 0, 59, 0, 255, 127, 0, 0, 254, 127, 83, 254, 245, 127, 166, 252, 231, 127, 249, 250, 212, 127, 77, 249, 186, 127, 161, 247, 155, 127, 246, 245, 119, 127, 74, 244, 76, 127, 159, 242, 29, 127, 245, 240, 232, 126, 75, 239, 173, 126, 163, 237, 108, 126, 251, 235, 39, 126, 84, 234, 219, 125, 173, 232, 138, 125, 7, 231, 51, 125, 99, 229, 216, 124, 193, 227, 119, 124, 30, 226, 16, 124, 125, 224, 164, 123, 223, 222, 51, 123, 65, 221, 187, 122, 166, 219, 62, 122, 12, 218, 189, 121, 114, 216, 54, 121, 220, 214, 169, 120, 71, 213, 23, 120, 180, 211, 128, 119, 35, 210, 228, 118, 147, 208, 66, 118, 4, 207, 155, 117, 121, 205, 240, 116, 240, 203, 62, 116, 106, 202, 137, 115, 229, 200, 206, 114, 99, 199, 13, 114, 229, 197, 72, 113, 103, 196, 125, 112, 237, 194, 174, 111, 118, 193, 219, 110, 0, 192, 2, 110, 143, 190, 36, 109, 33, 189, 66, 108, 180, 187, 90, 107, 75, 186, 110, 106, 227, 184, 126, 105, 128, 183, 136, 104, 33, 182, 142, 103, 196, 180, 145, 102, 106, 179, 141, 101, 21, 178, 134, 100, 194, 176, 122, 99, 115, 175, 106, 98, 40, 174, 86, 97, 223, 172, 61, 96, 155, 171, 33, 95, 90, 170, 255, 93, 30, 169, 218, 92, 229, 167, 177, 91, 175, 166, 131, 90, 125, 165, 82, 89, 80, 164, 29, 88, 39, 163, 228, 86, 1, 162, 167, 85, 224, 160, 102, 84, 196, 159, 34, 83, 171, 158, 218, 81, 150, 157, 142, 80, 135, 156, 64, 79, 123, 155, 237, 77, 115, 154, 151, 76, 113, 153, 61, 75, 115, 152, 226, 73, 120, 151, 129, 72, 132, 150, 29, 71, 146, 149, 182, 69, 167, 148, 77, 68, 191, 147, 226, 66, 220, 146, 115, 65, 254, 145, 1, 64, 38, 145, 140, 62, 82, 144, 20, 61, 131, 143, 154, 59, 185, 142, 30, 58, 243, 141, 158, 56, 51, 141, 28, 55, 120, 140, 152, 53, 195, 139, 17, 52, 18, 139, 137, 50, 101, 138, 252, 48, 190, 137, 110, 47, 29, 137, 224, 45, 128, 136, 78, 44, 233, 135, 187, 42, 87, 135, 38, 41, 202, 134, 143, 39, 68, 134, 246, 37, 194, 133, 91, 36, 70, 133, 191, 34, 207, 132, 34, 33, 92, 132, 131, 31, 241, 131, 226, 29, 138, 131, 65, 28, 40, 131, 159, 26, 205, 130, 249, 24, 118, 130, 85, 23, 37, 130, 173, 21, 218, 129, 7, 20, 148, 129, 95, 18, 83, 129, 182, 16, 25, 129, 12, 15, 227, 128, 98, 13, 180, 128, 183, 11, 138, 128, 12, 10, 101, 128, 96, 8, 70, 128, 180, 6, 44, 128, 7, 5, 26, 128, 92, 3, 11, 128, 174, 1, 2, 128, 0, 0, 1, 128, 83, 254, 2, 128, 166, 252, 11, 128, 249, 250, 25, 128, 77, 249, 44, 128, 161, 247, 70, 128, 246, 245, 101, 128, 74, 244, 137, 128, 159, 242, 180, 128, 245, 240, 227, 128, 75, 239, 24, 129, 163, 237, 83, 129, 251, 235, 148, 129, 84, 234, 217, 129, 173, 232, 37, 130, 7, 231, 118, 130, 99, 229, 205, 130, 193, 227, 40, 131, 30, 226, 137, 131, 125, 224, 240, 131, 223, 222, 92, 132, 65, 221, 205, 132, 166, 219, 69, 133, 12, 218, 194, 133, 114, 216, 67, 134, 220, 214, 202, 134, 71, 213, 87, 135, 180, 211, 233, 135, 35, 210, 128, 136, 147, 208, 28, 137, 4, 207, 190, 137, 121, 205, 101, 138, 240, 203, 16, 139, 106, 202, 194, 139, 229, 200, 119, 140, 99, 199, 50, 141, 229, 197, 243, 141, 103, 196, 184, 142, 237, 194, 131, 143, 118, 193, 82, 144, 0, 192, 37, 145, 143, 190, 254, 145, 33, 189, 220, 146, 180, 187, 190, 147, 75, 186, 166, 148, 227, 184, 146, 149, 128, 183, 130, 150, 33, 182, 120, 151, 196, 180, 114, 152, 106, 179, 111, 153, 21, 178, 115, 154, 194, 176, 122, 155, 115, 175, 134, 156, 40, 174, 150, 157, 223, 172, 170, 158, 155, 171, 195, 159, 90, 170, 223, 160, 30, 169, 1, 162, 229, 167, 38, 163, 175, 166, 79, 164, 125, 165, 125, 165, 80, 164, 174, 166, 39, 163, 227, 167, 1, 162, 28, 169, 224, 160, 89, 170, 196, 159, 154, 171, 171, 158, 222, 172, 150, 157, 38, 174, 135, 156, 114, 175, 123, 155, 192, 176, 115, 154, 19, 178, 113, 153, 105, 179, 115, 152, 195, 180, 120, 151, 30, 182, 132, 150, 127, 183, 146, 149, 227, 184, 167, 148, 74, 186, 191, 147, 179, 187, 220, 146, 30, 189, 254, 145, 141, 190, 38, 145, 255, 191, 82, 144, 116, 193, 131, 143, 236, 194, 185, 142, 102, 196, 243, 141, 226, 197, 51, 141, 98, 199, 120, 140, 228, 200, 195, 139, 104, 202, 18, 139, 239, 203, 101, 138, 119, 205, 190, 137, 4, 207, 29, 137, 146, 208, 128, 136, 32, 210, 233, 135, 178, 211, 87, 135, 69, 213, 202, 134, 218, 214, 68, 134, 113, 216, 194, 133, 10, 218, 70, 133, 165, 219, 207, 132, 65, 221, 92, 132, 222, 222, 241, 131, 125, 224, 138, 131, 30, 226, 40, 131, 191, 227, 205, 130, 97, 229, 118, 130, 7, 231, 37, 130, 171, 232, 218, 129, 83, 234, 148, 129, 249, 235, 83, 129, 161, 237, 25, 129, 74, 239, 227, 128, 244, 240, 180, 128, 158, 242, 138, 128, 73, 244, 101, 128, 244, 245, 70, 128, 160, 247, 44, 128, 76, 249, 26, 128, 249, 250, 11, 128, 164, 252, 2, 128, 82, 254, 1, 128, 0, 0, 2, 128, 173, 1, 11, 128, 90, 3, 25, 128, 7, 5, 44, 128, 179, 6, 70, 128, 95, 8, 101, 128, 10, 10, 137, 128, 182, 11, 180, 128, 97, 13, 227, 128, 11, 15, 24, 129, 181, 16, 83, 129, 93, 18, 148, 129, 5, 20, 217, 129, 172, 21, 37, 130, 83, 23, 118, 130, 249, 24, 205, 130, 157, 26, 40, 131, 63, 28, 137, 131, 226, 29, 240, 131, 131, 31, 92, 132, 33, 33, 205, 132, 191, 34, 69, 133, 90, 36, 194, 133, 244, 37, 67, 134, 142, 39, 202, 134, 36, 41, 87, 135, 185, 42, 233, 135, 76, 44, 128, 136, 221, 45, 28, 137, 109, 47, 190, 137, 252, 48, 101, 138, 135, 50, 16, 139, 16, 52, 194, 139, 150, 53, 119, 140, 27, 55, 50, 141, 157, 56, 243, 141, 27, 58, 184, 142, 153, 59, 131, 143, 19, 61, 82, 144, 138, 62, 37, 145, 0, 64, 254, 145, 113, 65, 220, 146, 223, 66, 190, 147, 76, 68, 166, 148, 181, 69, 146, 149, 29, 71, 130, 150, 128, 72, 120, 151, 223, 73, 114, 152, 60, 75, 111, 153, 150, 76, 115, 154, 235, 77, 122, 155, 62, 79, 134, 156, 141, 80, 150, 157, 216, 81, 170, 158, 33, 83, 195, 159, 101, 84, 223, 160, 166, 85, 1, 162, 226, 86, 38, 163, 27, 88, 79, 164, 81, 89, 125, 165, 131, 90, 174, 166, 176, 91, 227, 167, 217, 92, 28, 169, 255, 93, 89, 170, 32, 95, 154, 171, 60, 96, 222, 172, 85, 97, 38, 174, 106, 98, 114, 175, 121, 99, 192, 176, 133, 100, 19, 178, 141, 101, 105, 179, 143, 102, 195, 180, 141, 103, 30, 182, 136, 104, 127, 183, 124, 105, 227, 184, 110, 106, 74, 186, 89, 107, 179, 187, 65, 108, 30, 189, 36, 109, 141, 190, 2, 110, 255, 191, 218, 110, 116, 193, 174, 111, 236, 194, 125, 112, 102, 196, 71, 113, 226, 197, 13, 114, 98, 199, 205, 114, 228, 200, 136, 115, 104, 202, 61, 116, 239, 203, 238, 116, 119, 205, 155, 117, 4, 207, 66, 118, 146, 208, 227, 118, 32, 210, 128, 119, 178, 211, 23, 120, 69, 213, 169, 120, 218, 214, 54, 121, 113, 216, 188, 121, 10, 218, 62, 122, 165, 219, 186, 122, 65, 221, 49, 123, 222, 222, 164, 123, 125, 224, 15, 124, 30, 226, 118, 124, 191, 227, 216, 124, 97, 229, 51, 125, 7, 231, 138, 125, 171, 232, 219, 125, 83, 234, 38, 126, 249, 235, 108, 126, 161, 237, 173, 126, 74, 239, 231, 126, 244, 240, 29, 127, 158, 242, 76, 127, 73, 244, 118, 127, 244, 245, 155, 127, 160, 247, 186, 127, 76, 249, 212, 127, 249, 250, 230, 127, 164, 252, 245, 127, 82, 254, 254, 127, 0, 0, 255, 127, 173, 1, 254, 127, 90, 3, 245, 127, 7, 5, 231, 127, 179, 6, 212, 127, 95, 8, 186, 127, 10, 10, 155, 127, 182, 11, 119, 127, 97, 13, 76, 127, 11, 15, 29, 127, 181, 16, 232, 126, 93, 18, 173, 126, 5, 20, 108, 126, 172, 21, 39, 126, 83, 23, 219, 125, 249, 24, 138, 125, 157, 26, 51, 125, 63, 28, 216, 124, 226, 29, 119, 124, 131, 31, 16, 124, 33, 33, 164, 123, 191, 34, 51, 123, 90, 36, 187, 122, 244, 37, 62, 122, 142, 39, 189, 121, 36, 41, 54, 121, 185, 42, 169, 120, 76, 44, 23, 120, 221, 45, 128, 119, 109, 47, 228, 118, 252, 48, 66, 118, 135, 50, 155, 117, 16, 52, 240, 116, 150, 53, 62, 116, 27, 55, 137, 115, 157, 56, 206, 114, 27, 58, 13, 114, 153, 59, 72, 113, 19, 61, 125, 112, 138, 62, 174, 111, 0, 64, 219, 110, 113, 65, 2, 110, 223, 66, 36, 109, 76, 68, 66, 108, 181, 69, 90, 107, 29, 71, 110, 106, 128, 72, 126, 105, 223, 73, 136, 104, 60, 75, 142, 103, 150, 76, 145, 102, 235, 77, 141, 101, 62, 79, 134, 100, 141, 80, 122, 99, 216, 81, 106, 98, 33, 83, 86, 97, 101, 84, 61, 96, 166, 85, 33, 95, 226, 86, 255, 93, 27, 88, 218, 92, 81, 89, 177, 91, 131, 90, 131, 90, 176, 91, 82, 89, 217, 92, 29, 88, 255, 93, 228, 86, 32, 95, 167, 85, 60, 96, 102, 84, 85, 97, 34, 83, 106, 98, 218, 81, 121, 99, 142, 80, 133, 100, 64, 79, 141, 101, 237, 77, 143, 102, 151, 76, 141, 103, 61, 75, 136, 104, 226, 73, 124, 105, 129, 72, 110, 106, 29, 71, 89, 107, 182, 69, 65, 108, 77, 68, 36, 109, 226, 66, 2, 110, 115, 65, 218, 110, 1, 64, 174, 111, 140, 62, 125, 112, 20, 61, 71, 113, 154, 59, 13, 114, 30, 58, 205, 114, 158, 56, 136, 115, 28, 55, 61, 116, 152, 53, 238, 116, 17, 52, 155, 117, 137, 50, 66, 118, 252, 48, 227, 118, 110, 47, 128, 119, 224, 45, 23, 120, 78, 44, 169, 120, 187, 42, 54, 121, 38, 41, 188, 121, 143, 39, 62, 122, 246, 37, 186, 122, 91, 36, 49, 123, 191, 34, 164, 123, 34, 33, 15, 124, 131, 31, 118, 124, 226, 29, 216, 124, 65, 28, 51, 125, 159, 26, 138, 125, 249, 24, 219, 125, 85, 23, 38, 126, 173, 21, 108, 126, 7, 20, 173, 126, 95, 18, 231, 126, 182, 16, 29, 127, 12, 15, 76, 127, 98, 13, 118, 127, 183, 11, 155, 127, 12, 10, 186, 127, 96, 8, 212, 127, 180, 6, 230, 127, 7, 5, 245, 127, 92, 3, 254, 127, 174, 1, 0, 0, 24, 0, 48, 0, 72, 0, 96, 0, 8, 0, 32, 0, 56, 0, 80, 0, 104, 0, 16, 0, 40, 0, 64, 0, 88, 0, 112, 0, 4, 0, 28, 0, 52, 0, 76, 0, 100, 0, 12, 0, 36, 0, 60, 0, 84, 0, 108, 0, 20, 0, 44, 0, 68, 0, 92, 0, 116, 0, 1, 0, 25, 0, 49, 0, 73, 0, 97, 0, 9, 0, 33, 0, 57, 0, 81, 0, 105, 0, 17, 0, 41, 0, 65, 0, 89, 0, 113, 0, 5, 0, 29, 0, 53, 0, 77, 0, 101, 0, 13, 0, 37, 0, 61, 0, 85, 0, 109, 0, 21, 0, 45, 0, 69, 0, 93, 0, 117, 0, 2, 0, 26, 0, 50, 0, 74, 0, 98, 0, 10, 0, 34, 0, 58, 0, 82, 0, 106, 0, 18, 0, 42, 0, 66, 0, 90, 0, 114, 0, 6, 0, 30, 0, 54, 0, 78, 0, 102, 0, 14, 0, 38, 0, 62, 0, 86, 0, 110, 0, 22, 0, 46, 0, 70, 0, 94, 0, 118, 0, 3, 0, 27, 0, 51, 0, 75, 0, 99, 0, 11, 0, 35, 0, 59, 0, 83, 0, 107, 0, 19, 0, 43, 0, 67, 0, 91, 0, 115, 0, 7, 0, 31, 0, 55, 0, 79, 0, 103, 0, 15, 0, 39, 0, 63, 0, 87, 0, 111, 0, 23, 0, 47, 0, 71, 0, 95, 0, 119, 0, 0, 0, 48, 0, 96, 0, 144, 0, 192, 0, 16, 0, 64, 0, 112, 0, 160, 0, 208, 0, 32, 0, 80, 0, 128, 0, 176, 0, 224, 0, 4, 0, 52, 0, 100, 0, 148, 0, 196, 0, 20, 0, 68, 0, 116, 0, 164, 0, 212, 0, 36, 0, 84, 0, 132, 0, 180, 0, 228, 0, 8, 0, 56, 0, 104, 0, 152, 0, 200, 0, 24, 0, 72, 0, 120, 0, 168, 0, 216, 0, 40, 0, 88, 0, 136, 0, 184, 0, 232, 0, 12, 0, 60, 0, 108, 0, 156, 0, 204, 0, 28, 0, 76, 0, 124, 0, 172, 0, 220, 0, 44, 0, 92, 0, 140, 0, 188, 0, 236, 0, 1, 0, 49, 0, 97, 0, 145, 0, 193, 0, 17, 0, 65, 0, 113, 0, 161, 0, 209, 0, 33, 0, 81, 0, 129, 0, 177, 0, 225, 0, 5, 0, 53, 0, 101, 0, 149, 0, 197, 0, 21, 0, 69, 0, 117, 0, 165, 0, 213, 0, 37, 0, 85, 0, 133, 0, 181, 0, 229, 0, 9, 0, 57, 0, 105, 0, 153, 0, 201, 0, 25, 0, 73, 0, 121, 0, 169, 0, 217, 0, 41, 0, 89, 0, 137, 0, 185, 0, 233, 0, 13, 0, 61, 0, 109, 0, 157, 0, 205, 0, 29, 0, 77, 0, 125, 0, 173, 0, 221, 0, 45, 0, 93, 0, 141, 0, 189, 0, 237, 0, 2, 0, 50, 0, 98, 0, 146, 0, 194, 0, 18, 0, 66, 0, 114, 0, 162, 0, 210, 0, 34, 0, 82, 0, 130, 0, 178, 0, 226, 0, 6, 0, 54, 0, 102, 0, 150, 0, 198, 0, 22, 0, 70, 0, 118, 0, 166, 0, 214, 0, 38, 0, 86, 0, 134, 0, 182, 0, 230, 0, 10, 0, 58, 0, 106, 0, 154, 0, 202, 0, 26, 0, 74, 0, 122, 0, 170, 0, 218, 0, 42, 0, 90, 0, 138, 0, 186, 0, 234, 0, 14, 0, 62, 0, 110, 0, 158, 0, 206, 0, 30, 0, 78, 0, 126, 0, 174, 0, 222, 0, 46, 0, 94, 0, 142, 0, 190, 0, 238, 0, 3, 0, 51, 0, 99, 0, 147, 0, 195, 0, 19, 0, 67, 0, 115, 0, 163, 0, 211, 0, 35, 0, 83, 0, 131, 0, 179, 0, 227, 0, 7, 0, 55, 0, 103, 0, 151, 0, 199, 0, 23, 0, 71, 0, 119, 0, 167, 0, 215, 0, 39, 0, 87, 0, 135, 0, 183, 0, 231, 0, 11, 0, 59, 0, 107, 0, 155, 0, 203, 0, 27, 0, 75, 0, 123, 0, 171, 0, 219, 0, 43, 0, 91, 0, 139, 0, 187, 0, 235, 0, 15, 0, 63, 0, 111, 0, 159, 0, 207, 0, 31, 0, 79, 0, 127, 0, 175, 0, 223, 0, 47, 0, 95, 0, 143, 0, 191, 0, 239, 0, 0, 0, 96, 0, 192, 0, 32, 1, 128, 1, 32, 0, 128, 0, 224, 0, 64, 1, 160, 1, 64, 0, 160, 0, 0, 1, 96, 1, 192, 1, 8, 0, 104, 0, 200, 0, 40, 1, 136, 1, 40, 0, 136, 0, 232, 0, 72, 1, 168, 1, 72, 0, 168, 0, 8, 1, 104, 1, 200, 1, 16, 0, 112, 0, 208, 0, 48, 1, 144, 1, 48, 0, 144, 0, 240, 0, 80, 1, 176, 1, 80, 0, 176, 0, 16, 1, 112, 1, 208, 1, 24, 0, 120, 0, 216, 0, 56, 1, 152, 1, 56, 0, 152, 0, 248, 0, 88, 1, 184, 1, 88, 0, 184, 0, 24, 1, 120, 1, 216, 1, 4, 0, 100, 0, 196, 0, 36, 1, 132, 1, 36, 0, 132, 0, 228, 0, 68, 1, 164, 1, 68, 0, 164, 0, 4, 1, 100, 1, 196, 1, 12, 0, 108, 0, 204, 0, 44, 1, 140, 1, 44, 0, 140, 0, 236, 0, 76, 1, 172, 1, 76, 0, 172, 0, 12, 1, 108, 1, 204, 1, 20, 0, 116, 0, 212, 0, 52, 1, 148, 1, 52, 0, 148, 0, 244, 0, 84, 1, 180, 1, 84, 0, 180, 0, 20, 1, 116, 1, 212, 1, 28, 0, 124, 0, 220, 0, 60, 1, 156, 1, 60, 0, 156, 0, 252, 0, 92, 1, 188, 1, 92, 0, 188, 0, 28, 1, 124, 1, 220, 1, 1, 0, 97, 0, 193, 0, 33, 1, 129, 1, 33, 0, 129, 0, 225, 0, 65, 1, 161, 1, 65, 0, 161, 0, 1, 1, 97, 1, 193, 1, 9, 0, 105, 0, 201, 0, 41, 1, 137, 1, 41, 0, 137, 0, 233, 0, 73, 1, 169, 1, 73, 0, 169, 0, 9, 1, 105, 1, 201, 1, 17, 0, 113, 0, 209, 0, 49, 1, 145, 1, 49, 0, 145, 0, 241, 0, 81, 1, 177, 1, 81, 0, 177, 0, 17, 1, 113, 1, 209, 1, 25, 0, 121, 0, 217, 0, 57, 1, 153, 1, 57, 0, 153, 0, 249, 0, 89, 1, 185, 1, 89, 0, 185, 0, 25, 1, 121, 1, 217, 1, 5, 0, 101, 0, 197, 0, 37, 1, 133, 1, 37, 0, 133, 0, 229, 0, 69, 1, 165, 1, 69, 0, 165, 0, 5, 1, 101, 1, 197, 1, 13, 0, 109, 0, 205, 0, 45, 1, 141, 1, 45, 0, 141, 0, 237, 0, 77, 1, 173, 1, 77, 0, 173, 0, 13, 1, 109, 1, 205, 1, 21, 0, 117, 0, 213, 0, 53, 1, 149, 1, 53, 0, 149, 0, 245, 0, 85, 1, 181, 1, 85, 0, 181, 0, 21, 1, 117, 1, 213, 1, 29, 0, 125, 0, 221, 0, 61, 1, 157, 1, 61, 0, 157, 0, 253, 0, 93, 1, 189, 1, 93, 0, 189, 0, 29, 1, 125, 1, 221, 1, 2, 0, 98, 0, 194, 0, 34, 1, 130, 1, 34, 0, 130, 0, 226, 0, 66, 1, 162, 1, 66, 0, 162, 0, 2, 1, 98, 1, 194, 1, 10, 0, 106, 0, 202, 0, 42, 1, 138, 1, 42, 0, 138, 0, 234, 0, 74, 1, 170, 1, 74, 0, 170, 0, 10, 1, 106, 1, 202, 1, 18, 0, 114, 0, 210, 0, 50, 1, 146, 1, 50, 0, 146, 0, 242, 0, 82, 1, 178, 1, 82, 0, 178, 0, 18, 1, 114, 1, 210, 1, 26, 0, 122, 0, 218, 0, 58, 1, 154, 1, 58, 0, 154, 0, 250, 0, 90, 1, 186, 1, 90, 0, 186, 0, 26, 1, 122, 1, 218, 1, 6, 0, 102, 0, 198, 0, 38, 1, 134, 1, 38, 0, 134, 0, 230, 0, 70, 1, 166, 1, 70, 0, 166, 0, 6, 1, 102, 1, 198, 1, 14, 0, 110, 0, 206, 0, 46, 1, 142, 1, 46, 0, 142, 0, 238, 0, 78, 1, 174, 1, 78, 0, 174, 0, 14, 1, 110, 1, 206, 1, 22, 0, 118, 0, 214, 0, 54, 1, 150, 1, 54, 0, 150, 0, 246, 0, 86, 1, 182, 1, 86, 0, 182, 0, 22, 1, 118, 1, 214, 1, 30, 0, 126, 0, 222, 0, 62, 1, 158, 1, 62, 0, 158, 0, 254, 0, 94, 1, 190, 1, 94, 0, 190, 0, 30, 1, 126, 1, 222, 1, 3, 0, 99, 0, 195, 0, 35, 1, 131, 1, 35, 0, 131, 0, 227, 0, 67, 1, 163, 1, 67, 0, 163, 0, 3, 1, 99, 1, 195, 1, 11, 0, 107, 0, 203, 0, 43, 1, 139, 1, 43, 0, 139, 0, 235, 0, 75, 1, 171, 1, 75, 0, 171, 0, 11, 1, 107, 1, 203, 1, 19, 0, 115, 0, 211, 0, 51, 1, 147, 1, 51, 0, 147, 0, 243, 0, 83, 1, 179, 1, 83, 0, 179, 0, 19, 1, 115, 1, 211, 1, 27, 0, 123, 0, 219, 0, 59, 1, 155, 1, 59, 0, 155, 0, 251, 0, 91, 1, 187, 1, 91, 0, 187, 0, 27, 1, 123, 1, 219, 1, 7, 0, 103, 0, 199, 0, 39, 1, 135, 1, 39, 0, 135, 0, 231, 0, 71, 1, 167, 1, 71, 0, 167, 0, 7, 1, 103, 1, 199, 1, 15, 0, 111, 0, 207, 0, 47, 1, 143, 1, 47, 0, 143, 0, 239, 0, 79, 1, 175, 1, 79, 0, 175, 0, 15, 1, 111, 1, 207, 1, 23, 0, 119, 0, 215, 0, 55, 1, 151, 1, 55, 0, 151, 0, 247, 0, 87, 1, 183, 1, 87, 0, 183, 0, 23, 1, 119, 1, 215, 1, 31, 0, 127, 0, 223, 0, 63, 1, 159, 1, 63, 0, 159, 0, 255, 0, 95, 1, 191, 1, 95, 0, 191, 0, 31, 1, 127, 1, 223, 1, 103, 100, 92, 85, 81, 77, 72, 70, 78, 75, 73, 71, 78, 74, 69, 72, 70, 74, 76, 71, 60, 60, 60, 60, 60, 0, 0, 0, 0, 0, 0, 0, 72, 127, 65, 129, 66, 128, 65, 128, 64, 128, 62, 128, 64, 128, 64, 128, 92, 78, 92, 79, 92, 78, 90, 79, 116, 41, 115, 40, 114, 40, 132, 26, 132, 26, 145, 17, 161, 12, 176, 10, 177, 11, 24, 179, 48, 138, 54, 135, 54, 132, 53, 134, 56, 133, 55, 132, 55, 132, 61, 114, 70, 96, 74, 88, 75, 88, 87, 74, 89, 66, 91, 67, 100, 59, 108, 50, 120, 40, 122, 37, 97, 43, 78, 50, 83, 78, 84, 81, 88, 75, 86, 74, 87, 71, 90, 73, 93, 74, 93, 74, 109, 40, 114, 36, 117, 34, 117, 34, 143, 17, 145, 18, 146, 19, 162, 12, 165, 10, 178, 7, 189, 6, 190, 8, 177, 9, 23, 178, 54, 115, 63, 102, 66, 98, 69, 99, 74, 89, 71, 91, 73, 91, 78, 89, 86, 80, 92, 66, 93, 64, 102, 59, 103, 60, 104, 60, 117, 52, 123, 44, 138, 35, 133, 31, 97, 38, 77, 45, 61, 90, 93, 60, 105, 42, 107, 41, 110, 45, 116, 38, 113, 38, 112, 38, 124, 26, 132, 27, 136, 19, 140, 20, 155, 14, 159, 16, 158, 18, 170, 13, 177, 10, 187, 8, 192, 6, 175, 9, 159, 10, 21, 178, 59, 110, 71, 86, 75, 85, 84, 83, 91, 66, 88, 73, 87, 72, 92, 75, 98, 72, 105, 58, 107, 54, 115, 52, 114, 55, 112, 56, 129, 51, 132, 40, 150, 33, 140, 29, 98, 35, 77, 42, 42, 121, 96, 66, 108, 43, 111, 40, 117, 44, 123, 32, 120, 36, 119, 33, 127, 33, 134, 34, 139, 21, 147, 23, 152, 20, 158, 25, 154, 26, 166, 21, 173, 16, 184, 13, 184, 10, 150, 13, 139, 15, 22, 178, 63, 114, 74, 82, 84, 83, 92, 82, 103, 62, 96, 72, 96, 67, 101, 73, 107, 72, 113, 55, 118, 52, 125, 52, 118, 52, 117, 55, 135, 49, 137, 39, 157, 32, 145, 29, 97, 33, 77, 40, 0, 115, 0, 102, 0, 83, 0, 64, 195, 117, 10, 87, 92, 47, 154, 25, 2, 1, 0, 0, 0, 0, 0, 0, 0, 8, 13, 16, 19, 21, 23, 24, 26, 27, 28, 29, 30, 31, 32, 32, 33, 34, 34, 35, 36, 36, 37, 37, 15, 0, 0, 0, 10, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 15, 8, 7, 4, 11, 12, 3, 2, 13, 10, 5, 6, 9, 14, 1, 0, 9, 6, 3, 4, 5, 8, 1, 2, 7, 0, 0, 0, 0, 0, 0, 184, 126, 154, 121, 0, 0, 0, 0, 154, 121, 102, 102, 0, 0, 0, 0, 184, 126, 51, 115, 0, 0, 0, 0, 6, 0, 0, 0, 4, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 255, 1, 255, 2, 254, 2, 254, 3, 253, 0, 1, 0, 1, 255, 2, 255, 2, 254, 3, 254, 3, 0, 2, 255, 255, 255, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 255, 2, 1, 0, 1, 1, 0, 0, 255, 255, 0, 0, 0, 0, 0, 0, 1, 255, 0, 1, 255, 0, 255, 1, 254, 2, 254, 254, 2, 253, 2, 3, 253, 252, 3, 252, 4, 4, 251, 5, 250, 251, 6, 249, 6, 5, 8, 247, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 255, 1, 0, 0, 1, 255, 0, 1, 255, 255, 1, 255, 2, 1, 255, 2, 254, 254, 2, 254, 2, 2, 3, 253, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 255, 1, 0, 0, 2, 1, 255, 2, 255, 255, 2, 255, 2, 2, 255, 3, 254, 254, 254, 3, 0, 1, 0, 0, 1, 0, 1, 255, 2, 255, 2, 255, 2, 3, 254, 3, 254, 254, 4, 4, 253, 5, 253, 252, 6, 252, 6, 5, 251, 8, 250, 251, 249, 9, 6, 0, 3, 0, 7, 3, 0, 1, 10, 0, 2, 6, 18, 10, 12, 0, 4, 0, 2, 0, 0, 0, 9, 4, 7, 4, 0, 3, 12, 7, 7, 0, 210, 6, 138, 58, 171, 152, 0, 0, 198, 26, 169, 100, 246, 216, 0, 0, 42, 175, 213, 201, 207, 255, 64, 0, 17, 0, 99, 255, 97, 1, 16, 254, 163, 0, 39, 43, 189, 86, 217, 255, 6, 0, 91, 0, 86, 255, 186, 0, 23, 0, 128, 252, 192, 24, 216, 77, 237, 255, 220, 255, 102, 0, 167, 255, 232, 255, 72, 1, 73, 252, 8, 10, 37, 62, 0, 0, 0, 0, 0, 0, 135, 199, 61, 201, 64, 0, 128, 0, 134, 255, 36, 0, 54, 1, 0, 253, 72, 2, 51, 36, 69, 69, 12, 0, 128, 0, 18, 0, 114, 255, 32, 1, 139, 255, 159, 252, 27, 16, 123, 56, 104, 2, 13, 200, 246, 255, 39, 0, 58, 0, 210, 255, 172, 255, 120, 0, 184, 0, 197, 254, 227, 253, 4, 5, 4, 21, 64, 35, 0, 0, 0, 0, 230, 62, 198, 196, 243, 255, 0, 0, 20, 0, 26, 0, 5, 0, 225, 255, 213, 255, 252, 255, 65, 0, 90, 0, 7, 0, 99, 255, 8, 255, 212, 255, 81, 2, 47, 6, 52, 10, 199, 12, 228, 87, 5, 197, 3, 0, 242, 255, 236, 255, 241, 255, 2, 0, 25, 0, 37, 0, 25, 0, 240, 255, 185, 255, 149, 255, 177, 255, 50, 0, 36, 1, 111, 2, 214, 3, 8, 5, 184, 5, 148, 107, 103, 196, 17, 0, 12, 0, 8, 0, 1, 0, 246, 255, 234, 255, 226, 255, 224, 255, 234, 255, 3, 0, 44, 0, 100, 0, 168, 0, 243, 0, 61, 1, 125, 1, 173, 1, 199, 1, 189, 0, 168, 253, 105, 2, 103, 119, 117, 0, 97, 255, 210, 251, 8, 116, 52, 0, 221, 0, 168, 246, 116, 110, 252, 255, 17, 2, 234, 242, 229, 102, 208, 255, 246, 2, 140, 240, 165, 93, 176, 255, 137, 3, 117, 239, 6, 83, 157, 255, 204, 3, 130, 239, 102, 71, 149, 255, 199, 3, 139, 240, 39, 59, 153, 255, 128, 3, 97, 242, 174, 46, 165, 255, 5, 3, 207, 244, 94, 34, 185, 255, 99, 2, 161, 247, 152, 22, 210, 255, 169, 1, 161, 250, 180, 11, 0, 32, 254, 31, 246, 31, 234, 31, 216, 31, 194, 31, 168, 31, 136, 31, 98, 31, 58, 31, 10, 31, 216, 30, 160, 30, 98, 30, 34, 30, 220, 29, 144, 29, 66, 29, 238, 28, 150, 28, 58, 28, 216, 27, 114, 27, 10, 27, 156, 26, 42, 26, 180, 25, 58, 25, 188, 24, 60, 24, 182, 23, 46, 23, 160, 22, 16, 22, 126, 21, 232, 20, 78, 20, 176, 19, 16, 19, 110, 18, 200, 17, 30, 17, 116, 16, 198, 15, 22, 15, 100, 14, 174, 13, 248, 12, 64, 12, 132, 11, 200, 10, 10, 10, 74, 9, 138, 8, 198, 7, 2, 7, 62, 6, 120, 5, 178, 4, 234, 3, 34, 3, 90, 2, 146, 1, 202, 0, 0, 0, 54, 255, 110, 254, 166, 253, 222, 252, 22, 252, 78, 251, 136, 250, 194, 249, 254, 248, 58, 248, 118, 247, 182, 246, 246, 245, 56, 245, 124, 244, 192, 243, 8, 243, 82, 242, 156, 241, 234, 240, 58, 240, 140, 239, 226, 238, 56, 238, 146, 237, 240, 236, 80, 236, 178, 235, 24, 235, 130, 234, 240, 233, 96, 233, 210, 232, 74, 232, 196, 231, 68, 231, 198, 230, 76, 230, 214, 229, 100, 229, 246, 228, 142, 228, 40, 228, 198, 227, 106, 227, 18, 227, 190, 226, 112, 226, 36, 226, 222, 225, 158, 225, 96, 225, 40, 225, 246, 224, 198, 224, 158, 224, 120, 224, 88, 224, 62, 224, 40, 224, 22, 224, 10, 224, 2, 224, 0, 224, 0, 0, 0, 0, 0, 0, 179, 99, 0, 0, 0, 0, 0, 0, 71, 56, 43, 30, 21, 12, 6, 0, 199, 165, 144, 124, 109, 96, 84, 71, 61, 51, 42, 32, 23, 15, 8, 0, 241, 225, 211, 199, 187, 175, 164, 153, 142, 132, 123, 114, 105, 96, 88, 80, 72, 64, 57, 50, 44, 38, 33, 29, 24, 20, 16, 12, 9, 5, 2, 0, 240, 61, 0, 0, 248, 61, 0, 0, 8, 62, 0, 0, 0, 0, 0, 0, 4, 6, 24, 7, 5, 0, 0, 2, 0, 0, 12, 28, 41, 13, 252, 247, 15, 42, 25, 14, 1, 254, 62, 41, 247, 246, 37, 65, 252, 3, 250, 4, 66, 7, 248, 16, 14, 38, 253, 33, 13, 22, 39, 23, 12, 255, 36, 64, 27, 250, 249, 10, 55, 43, 17, 1, 1, 8, 1, 1, 6, 245, 74, 53, 247, 244, 55, 76, 244, 8, 253, 3, 93, 27, 252, 26, 39, 59, 3, 248, 2, 0, 77, 11, 9, 248, 22, 44, 250, 7, 40, 9, 26, 3, 9, 249, 20, 101, 249, 4, 3, 248, 42, 26, 0, 241, 33, 68, 2, 23, 254, 55, 46, 254, 15, 3, 255, 21, 16, 41, 250, 27, 61, 39, 5, 245, 42, 88, 4, 1, 254, 60, 65, 6, 252, 255, 251, 73, 56, 1, 247, 19, 94, 29, 247, 0, 12, 99, 6, 4, 8, 237, 102, 46, 243, 3, 2, 13, 3, 2, 9, 235, 84, 72, 238, 245, 46, 104, 234, 8, 18, 38, 48, 23, 0, 240, 70, 83, 235, 11, 5, 245, 117, 22, 248, 250, 23, 117, 244, 3, 3, 248, 95, 28, 4, 246, 15, 77, 60, 241, 255, 4, 124, 2, 252, 3, 38, 84, 24, 231, 2, 13, 42, 13, 31, 21, 252, 56, 46, 255, 255, 35, 79, 243, 19, 249, 65, 88, 247, 242, 20, 4, 81, 49, 227, 20, 0, 75, 3, 239, 5, 247, 44, 92, 248, 1, 253, 22, 69, 31, 250, 95, 41, 244, 5, 39, 67, 16, 252, 1, 0, 250, 120, 55, 220, 243, 44, 122, 4, 232, 81, 5, 11, 3, 7, 2, 0, 9, 10, 88, 56, 62, 0, 0, 96, 62, 0, 0, 176, 62, 0, 0, 0, 0, 0, 0, 12, 35, 60, 83, 108, 132, 157, 180, 206, 228, 15, 32, 55, 77, 101, 125, 151, 175, 201, 225, 19, 42, 66, 89, 114, 137, 162, 184, 209, 230, 12, 25, 50, 72, 97, 120, 147, 172, 200, 223, 26, 44, 69, 90, 114, 135, 159, 180, 205, 225, 13, 22, 53, 80, 106, 130, 156, 180, 205, 228, 15, 25, 44, 64, 90, 115, 142, 168, 196, 222, 19, 24, 62, 82, 100, 120, 145, 168, 190, 214, 22, 31, 50, 79, 103, 120, 151, 170, 203, 227, 21, 29, 45, 65, 106, 124, 150, 171, 196, 224, 30, 49, 75, 97, 121, 142, 165, 186, 209, 229, 19, 25, 52, 70, 93, 116, 143, 166, 192, 219, 26, 34, 62, 75, 97, 118, 145, 167, 194, 217, 25, 33, 56, 70, 91, 113, 143, 165, 196, 223, 21, 34, 51, 72, 97, 117, 145, 171, 196, 222, 20, 29, 50, 67, 90, 117, 144, 168, 197, 221, 22, 31, 48, 66, 95, 117, 146, 168, 196, 222, 24, 33, 51, 77, 116, 134, 158, 180, 200, 224, 21, 28, 70, 87, 106, 124, 149, 170, 194, 217, 26, 33, 53, 64, 83, 117, 152, 173, 204, 225, 27, 34, 65, 95, 108, 129, 155, 174, 210, 225, 20, 26, 72, 99, 113, 131, 154, 176, 200, 219, 34, 43, 61, 78, 93, 114, 155, 177, 205, 229, 23, 29, 54, 97, 124, 138, 163, 179, 209, 229, 30, 38, 56, 89, 118, 129, 158, 178, 200, 231, 21, 29, 49, 63, 85, 111, 142, 163, 193, 222, 27, 48, 77, 103, 133, 158, 179, 196, 215, 232, 29, 47, 74, 99, 124, 151, 176, 198, 220, 237, 33, 42, 61, 76, 93, 121, 155, 174, 207, 225, 29, 53, 87, 112, 136, 154, 170, 188, 208, 227, 24, 30, 52, 84, 131, 150, 166, 186, 203, 229, 37, 48, 64, 84, 104, 118, 156, 177, 201, 230, 212, 178, 148, 129, 108, 96, 85, 82, 79, 77, 61, 59, 57, 56, 51, 49, 48, 45, 42, 41, 40, 38, 36, 34, 31, 30, 21, 12, 10, 3, 1, 0, 255, 245, 244, 236, 233, 225, 217, 203, 190, 176, 175, 161, 149, 136, 125, 114, 102, 91, 81, 71, 60, 52, 43, 35, 28, 20, 19, 18, 12, 11, 5, 0, 179, 138, 140, 148, 151, 149, 153, 151, 163, 116, 67, 82, 59, 92, 72, 100, 89, 92, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 99, 66, 36, 36, 34, 36, 34, 34, 34, 34, 83, 69, 36, 52, 34, 116, 102, 70, 68, 68, 176, 102, 68, 68, 34, 65, 85, 68, 84, 36, 116, 141, 152, 139, 170, 132, 187, 184, 216, 137, 132, 249, 168, 185, 139, 104, 102, 100, 68, 68, 178, 218, 185, 185, 170, 244, 216, 187, 187, 170, 244, 187, 187, 219, 138, 103, 155, 184, 185, 137, 116, 183, 155, 152, 136, 132, 217, 184, 184, 170, 164, 217, 171, 155, 139, 244, 169, 184, 185, 170, 164, 216, 223, 218, 138, 214, 143, 188, 218, 168, 244, 141, 136, 155, 170, 168, 138, 220, 219, 139, 164, 219, 202, 216, 137, 168, 186, 246, 185, 139, 116, 185, 219, 185, 138, 100, 100, 134, 100, 102, 34, 68, 68, 100, 68, 168, 203, 221, 218, 168, 167, 154, 136, 104, 70, 164, 246, 171, 137, 139, 137, 155, 218, 219, 139, 255, 254, 253, 238, 14, 3, 2, 1, 0, 255, 254, 252, 218, 35, 3, 2, 1, 0, 255, 254, 250, 208, 59, 4, 2, 1, 0, 255, 254, 246, 194, 71, 10, 2, 1, 0, 255, 252, 236, 183, 82, 8, 2, 1, 0, 255, 252, 235, 180, 90, 17, 2, 1, 0, 255, 248, 224, 171, 97, 30, 4, 1, 0, 255, 254, 236, 173, 95, 37, 7, 1, 0, 255, 255, 255, 131, 6, 145, 255, 255, 255, 255, 255, 236, 93, 15, 96, 255, 255, 255, 255, 255, 194, 83, 25, 71, 221, 255, 255, 255, 255, 162, 73, 34, 66, 162, 255, 255, 255, 210, 126, 73, 43, 57, 173, 255, 255, 255, 201, 125, 71, 48, 58, 130, 255, 255, 255, 166, 110, 73, 57, 62, 104, 210, 255, 255, 251, 123, 65, 55, 68, 100, 171, 255, 250, 0, 3, 0, 6, 0, 3, 0, 3, 0, 3, 0, 4, 0, 3, 0, 3, 0, 3, 0, 205, 1, 0, 0, 32, 0, 10, 0, 20, 46, 100, 1, 96, 63, 0, 0, 160, 64, 0, 0, 224, 64, 0, 0, 248, 64, 0, 0, 152, 65, 0, 0, 224, 65, 0, 0, 40, 66, 0, 0, 0, 0, 0, 0, 7, 23, 38, 54, 69, 85, 100, 116, 131, 147, 162, 178, 193, 208, 223, 239, 13, 25, 41, 55, 69, 83, 98, 112, 127, 142, 157, 171, 187, 203, 220, 236, 15, 21, 34, 51, 61, 78, 92, 106, 126, 136, 152, 167, 185, 205, 225, 240, 10, 21, 36, 50, 63, 79, 95, 110, 126, 141, 157, 173, 189, 205, 221, 237, 17, 20, 37, 51, 59, 78, 89, 107, 123, 134, 150, 164, 184, 205, 224, 240, 10, 15, 32, 51, 67, 81, 96, 112, 129, 142, 158, 173, 189, 204, 220, 236, 8, 21, 37, 51, 65, 79, 98, 113, 126, 138, 155, 168, 179, 192, 209, 218, 12, 15, 34, 55, 63, 78, 87, 108, 118, 131, 148, 167, 185, 203, 219, 236, 16, 19, 32, 36, 56, 79, 91, 108, 118, 136, 154, 171, 186, 204, 220, 237, 11, 28, 43, 58, 74, 89, 105, 120, 135, 150, 165, 180, 196, 211, 226, 241, 6, 16, 33, 46, 60, 75, 92, 107, 123, 137, 156, 169, 185, 199, 214, 225, 11, 19, 30, 44, 57, 74, 89, 105, 121, 135, 152, 169, 186, 202, 218, 234, 12, 19, 29, 46, 57, 71, 88, 100, 120, 132, 148, 165, 182, 199, 216, 233, 17, 23, 35, 46, 56, 77, 92, 106, 123, 134, 152, 167, 185, 204, 222, 237, 14, 17, 45, 53, 63, 75, 89, 107, 115, 132, 151, 171, 188, 206, 221, 240, 9, 16, 29, 40, 56, 71, 88, 103, 119, 137, 154, 171, 189, 205, 222, 237, 16, 19, 36, 48, 57, 76, 87, 105, 118, 132, 150, 167, 185, 202, 218, 236, 12, 17, 29, 54, 71, 81, 94, 104, 126, 136, 149, 164, 182, 201, 221, 237, 15, 28, 47, 62, 79, 97, 115, 129, 142, 155, 168, 180, 194, 208, 223, 238, 8, 14, 30, 45, 62, 78, 94, 111, 127, 143, 159, 175, 192, 207, 223, 239, 17, 30, 49, 62, 79, 92, 107, 119, 132, 145, 160, 174, 190, 204, 220, 235, 14, 19, 36, 45, 61, 76, 91, 108, 121, 138, 154, 172, 189, 205, 222, 238, 12, 18, 31, 45, 60, 76, 91, 107, 123, 138, 154, 171, 187, 204, 221, 236, 13, 17, 31, 43, 53, 70, 83, 103, 114, 131, 149, 167, 185, 203, 220, 237, 17, 22, 35, 42, 58, 78, 93, 110, 125, 139, 155, 170, 188, 206, 224, 240, 8, 15, 34, 50, 67, 83, 99, 115, 131, 146, 162, 178, 193, 209, 224, 239, 13, 16, 41, 66, 73, 86, 95, 111, 128, 137, 150, 163, 183, 206, 225, 241, 17, 25, 37, 52, 63, 75, 92, 102, 119, 132, 144, 160, 175, 191, 212, 231, 19, 31, 49, 65, 83, 100, 117, 133, 147, 161, 174, 187, 200, 213, 227, 242, 18, 31, 52, 68, 88, 103, 117, 126, 138, 149, 163, 177, 192, 207, 223, 239, 16, 29, 47, 61, 76, 90, 106, 119, 133, 147, 161, 176, 193, 209, 224, 240, 15, 21, 35, 50, 61, 73, 86, 97, 110, 119, 129, 141, 175, 198, 218, 237, 225, 204, 201, 184, 183, 175, 158, 154, 153, 135, 119, 115, 113, 110, 109, 99, 98, 95, 79, 68, 52, 50, 48, 45, 43, 32, 31, 27, 18, 10, 3, 0, 255, 251, 235, 230, 212, 201, 196, 182, 167, 166, 163, 151, 138, 124, 110, 104, 90, 78, 76, 70, 69, 57, 45, 34, 24, 21, 11, 6, 5, 4, 3, 0, 175, 148, 160, 176, 178, 173, 174, 164, 177, 174, 196, 182, 198, 192, 182, 68, 62, 66, 60, 72, 117, 85, 90, 118, 136, 151, 142, 160, 142, 155, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 100, 102, 102, 68, 68, 36, 34, 96, 164, 107, 158, 185, 180, 185, 139, 102, 64, 66, 36, 34, 34, 0, 1, 32, 208, 139, 141, 191, 152, 185, 155, 104, 96, 171, 104, 166, 102, 102, 102, 132, 1, 0, 0, 0, 0, 16, 16, 0, 80, 109, 78, 107, 185, 139, 103, 101, 208, 212, 141, 139, 173, 153, 123, 103, 36, 0, 0, 0, 0, 0, 0, 1, 48, 0, 0, 0, 0, 0, 0, 32, 68, 135, 123, 119, 119, 103, 69, 98, 68, 103, 120, 118, 118, 102, 71, 98, 134, 136, 157, 184, 182, 153, 139, 134, 208, 168, 248, 75, 189, 143, 121, 107, 32, 49, 34, 34, 34, 0, 17, 2, 210, 235, 139, 123, 185, 137, 105, 134, 98, 135, 104, 182, 100, 183, 171, 134, 100, 70, 68, 70, 66, 66, 34, 131, 64, 166, 102, 68, 36, 2, 1, 0, 134, 166, 102, 68, 34, 34, 66, 132, 212, 246, 158, 139, 107, 107, 87, 102, 100, 219, 125, 122, 137, 118, 103, 132, 114, 135, 137, 105, 171, 106, 50, 34, 164, 214, 141, 143, 185, 151, 121, 103, 192, 34, 0, 0, 0, 0, 0, 1, 208, 109, 74, 187, 134, 249, 159, 137, 102, 110, 154, 118, 87, 101, 119, 101, 0, 2, 0, 36, 36, 66, 68, 35, 96, 164, 102, 100, 36, 0, 2, 33, 167, 138, 174, 102, 100, 84, 2, 2, 100, 107, 120, 119, 36, 197, 24, 0, 255, 254, 253, 244, 12, 3, 2, 1, 0, 255, 254, 252, 224, 38, 3, 2, 1, 0, 255, 254, 251, 209, 57, 4, 2, 1, 0, 255, 254, 244, 195, 69, 4, 2, 1, 0, 255, 251, 232, 184, 84, 7, 2, 1, 0, 255, 254, 240, 186, 86, 14, 2, 1, 0, 255, 254, 239, 178, 91, 30, 5, 1, 0, 255, 248, 227, 177, 100, 19, 2, 1, 0, 255, 255, 255, 156, 4, 154, 255, 255, 255, 255, 255, 227, 102, 15, 92, 255, 255, 255, 255, 255, 213, 83, 24, 72, 236, 255, 255, 255, 255, 150, 76, 33, 63, 214, 255, 255, 255, 190, 121, 77, 43, 55, 185, 255, 255, 255, 245, 137, 71, 43, 59, 139, 255, 255, 255, 255, 131, 66, 50, 66, 107, 194, 255, 255, 166, 116, 76, 55, 53, 125, 255, 255, 100, 0, 3, 0, 40, 0, 3, 0, 3, 0, 3, 0, 5, 0, 14, 0, 14, 0, 10, 0, 11, 0, 3, 0, 8, 0, 9, 0, 7, 0, 3, 0, 91, 1, 0, 0, 0, 0, 0, 0, 32, 0, 16, 0, 102, 38, 171, 1, 104, 66, 0, 0, 104, 68, 0, 0, 168, 68, 0, 0, 200, 68, 0, 0, 200, 69, 0, 0, 16, 70, 0, 0, 88, 70, 0, 0, 0, 0, 0, 0, 224, 112, 44, 15, 3, 2, 1, 0, 254, 237, 192, 132, 70, 23, 4, 0, 255, 252, 226, 155, 61, 11, 2, 0, 250, 245, 234, 203, 71, 50, 42, 38, 35, 33, 31, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 92, 202, 190, 216, 182, 223, 154, 226, 156, 230, 120, 236, 122, 244, 204, 252, 52, 3, 134, 11, 136, 19, 100, 25, 102, 29, 74, 32, 66, 39, 164, 53, 249, 247, 246, 245, 244, 234, 210, 202, 201, 200, 197, 174, 82, 59, 56, 55, 54, 46, 22, 12, 11, 10, 9, 7, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 203, 150, 0, 0, 0, 0, 0, 0, 215, 195, 166, 125, 110, 82, 0, 0, 56, 71, 0, 0, 64, 71, 0, 0, 120, 0, 0, 0, 0, 0, 0, 0, 128, 64, 0, 0, 0, 0, 0, 0, 232, 158, 10, 0, 0, 0, 0, 0, 230, 0, 0, 0, 0, 0, 0, 0, 243, 221, 192, 181, 0, 0, 0, 0, 100, 0, 240, 0, 32, 0, 100, 0, 205, 60, 0, 48, 0, 32, 0, 0, 171, 85, 0, 0, 0, 0, 0, 0, 192, 128, 64, 0, 0, 0, 0, 0, 205, 154, 102, 51, 0, 0, 0, 0, 213, 171, 128, 85, 43, 0, 0, 0, 224, 192, 160, 128, 96, 64, 32, 0, 100, 40, 16, 7, 3, 1, 0, 0, 253, 250, 244, 233, 212, 182, 150, 131, 120, 110, 98, 85, 72, 60, 49, 40, 32, 25, 19, 15, 13, 11, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 210, 208, 206, 203, 199, 193, 183, 168, 142, 104, 74, 52, 37, 27, 20, 14, 10, 6, 4, 2, 0, 0, 0, 0, 223, 201, 183, 167, 152, 138, 124, 111, 98, 88, 79, 70, 62, 56, 50, 44, 39, 35, 31, 27, 24, 21, 18, 16, 14, 12, 10, 8, 6, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 188, 176, 155, 138, 119, 97, 67, 43, 26, 10, 0, 0, 0, 0, 0, 0, 165, 119, 80, 61, 47, 35, 27, 20, 14, 9, 4, 0, 0, 0, 0, 0, 113, 63, 0, 0, 0, 0, 0, 0, 125, 51, 26, 18, 15, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 198, 105, 45, 22, 15, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 213, 162, 116, 83, 59, 43, 32, 24, 18, 15, 12, 9, 7, 6, 5, 3, 2, 0, 239, 187, 116, 59, 28, 16, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 250, 229, 188, 135, 86, 51, 30, 19, 13, 10, 8, 6, 5, 4, 3, 2, 1, 0, 249, 235, 213, 185, 156, 128, 103, 83, 66, 53, 42, 33, 26, 21, 17, 13, 10, 0, 254, 249, 235, 206, 164, 118, 77, 46, 27, 16, 10, 7, 5, 4, 3, 2, 1, 0, 255, 253, 249, 239, 220, 191, 156, 119, 85, 57, 37, 23, 15, 10, 6, 4, 2, 0, 255, 253, 251, 246, 237, 223, 203, 179, 152, 124, 98, 75, 55, 40, 29, 21, 15, 0, 255, 254, 253, 247, 220, 162, 106, 67, 42, 28, 18, 12, 9, 6, 4, 3, 2, 0, 0, 0, 0, 0, 241, 190, 178, 132, 87, 74, 41, 14, 0, 223, 193, 157, 140, 106, 57, 39, 18, 0, 0, 0, 0, 0, 0, 0, 128, 0, 214, 42, 0, 235, 128, 21, 0, 244, 184, 72, 11, 0, 248, 214, 128, 42, 7, 0, 248, 225, 170, 80, 25, 5, 0, 251, 236, 198, 126, 54, 18, 3, 0, 250, 238, 211, 159, 82, 35, 15, 5, 0, 250, 231, 203, 168, 128, 88, 53, 25, 6, 0, 252, 238, 216, 185, 148, 108, 71, 40, 18, 4, 0, 253, 243, 225, 199, 166, 128, 90, 57, 31, 13, 3, 0, 254, 246, 233, 212, 183, 147, 109, 73, 44, 23, 10, 2, 0, 255, 250, 240, 223, 198, 166, 128, 90, 58, 33, 16, 6, 1, 0, 255, 251, 244, 231, 210, 181, 146, 110, 75, 46, 25, 12, 5, 1, 0, 255, 253, 248, 238, 221, 196, 164, 128, 92, 60, 35, 18, 8, 3, 1, 0, 255, 253, 249, 242, 229, 208, 180, 146, 110, 76, 48, 27, 14, 7, 3, 1, 0, 129, 0, 207, 50, 0, 236, 129, 20, 0, 245, 185, 72, 10, 0, 249, 213, 129, 42, 6, 0, 250, 226, 169, 87, 27, 4, 0, 251, 233, 194, 130, 62, 20, 4, 0, 250, 236, 207, 160, 99, 47, 17, 3, 0, 255, 240, 217, 182, 131, 81, 41, 11, 1, 0, 255, 254, 233, 201, 159, 107, 61, 20, 2, 1, 0, 255, 249, 233, 206, 170, 128, 86, 50, 23, 7, 1, 0, 255, 250, 238, 217, 186, 148, 108, 70, 39, 18, 6, 1, 0, 255, 252, 243, 226, 200, 166, 128, 90, 56, 30, 13, 4, 1, 0, 255, 252, 245, 231, 209, 180, 146, 110, 76, 47, 25, 11, 4, 1, 0, 255, 253, 248, 237, 219, 194, 163, 128, 93, 62, 37, 19, 8, 3, 1, 0, 255, 254, 250, 241, 226, 205, 177, 145, 111, 79, 51, 30, 15, 6, 2, 1, 0, 129, 0, 203, 54, 0, 234, 129, 23, 0, 245, 184, 73, 10, 0, 250, 215, 129, 41, 5, 0, 252, 232, 173, 86, 24, 3, 0, 253, 240, 200, 129, 56, 15, 2, 0, 253, 244, 217, 164, 94, 38, 10, 1, 0, 253, 245, 226, 189, 132, 71, 27, 7, 1, 0, 253, 246, 231, 203, 159, 105, 56, 23, 6, 1, 0, 255, 248, 235, 213, 179, 133, 85, 47, 19, 5, 1, 0, 255, 254, 243, 221, 194, 159, 117, 70, 37, 12, 2, 1, 0, 255, 254, 248, 234, 208, 171, 128, 85, 48, 22, 8, 2, 1, 0, 255, 254, 250, 240, 220, 189, 149, 107, 67, 36, 16, 6, 2, 1, 0, 255, 254, 251, 243, 227, 201, 166, 128, 90, 55, 29, 13, 5, 2, 1, 0, 255, 254, 252, 246, 234, 213, 183, 147, 109, 73, 43, 22, 10, 4, 2, 1, 0, 130, 0, 200, 58, 0, 231, 130, 26, 0, 244, 184, 76, 12, 0, 249, 214, 130, 43, 6, 0, 252, 232, 173, 87, 24, 3, 0, 253, 241, 203, 131, 56, 14, 2, 0, 254, 246, 221, 167, 94, 35, 8, 1, 0, 254, 249, 232, 193, 130, 65, 23, 5, 1, 0, 255, 251, 239, 211, 162, 99, 45, 15, 4, 1, 0, 255, 251, 243, 223, 186, 131, 74, 33, 11, 3, 1, 0, 255, 252, 245, 230, 202, 158, 105, 57, 24, 8, 2, 1, 0, 255, 253, 247, 235, 214, 179, 132, 84, 44, 19, 7, 2, 1, 0, 255, 254, 250, 240, 223, 196, 159, 112, 69, 36, 15, 6, 2, 1, 0, 255, 254, 253, 245, 231, 209, 176, 136, 93, 55, 27, 11, 3, 2, 1, 0, 255, 254, 253, 252, 239, 221, 194, 158, 117, 76, 42, 18, 4, 3, 2, 1, 0, 0, 0, 2, 5, 9, 14, 20, 27, 35, 44, 54, 65, 77, 90, 104, 119, 135, 0, 0, 0, 0, 0, 0, 0, 254, 49, 67, 77, 82, 93, 99, 198, 11, 18, 24, 31, 36, 45, 255, 46, 66, 78, 87, 94, 104, 208, 14, 21, 32, 42, 51, 66, 255, 94, 104, 109, 112, 115, 118, 248, 53, 69, 80, 88, 95, 102, 0, 0, 0, 0, 0, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE + 10240);
        var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
        assert(tempDoublePtr % 8 == 0);
        function copyTempFloat(ptr) {
            HEAP8[tempDoublePtr] = HEAP8[ptr];
            HEAP8[tempDoublePtr + 1] = HEAP8[ptr + 1];
            HEAP8[tempDoublePtr + 2] = HEAP8[ptr + 2];
            HEAP8[tempDoublePtr + 3] = HEAP8[ptr + 3]
        }
        function copyTempDouble(ptr) {
            HEAP8[tempDoublePtr] = HEAP8[ptr];
            HEAP8[tempDoublePtr + 1] = HEAP8[ptr + 1];
            HEAP8[tempDoublePtr + 2] = HEAP8[ptr + 2];
            HEAP8[tempDoublePtr + 3] = HEAP8[ptr + 3];
            HEAP8[tempDoublePtr + 4] = HEAP8[ptr + 4];
            HEAP8[tempDoublePtr + 5] = HEAP8[ptr + 5];
            HEAP8[tempDoublePtr + 6] = HEAP8[ptr + 6];
            HEAP8[tempDoublePtr + 7] = HEAP8[ptr + 7]
        }
        Module["_bitshift64Ashr"] = _bitshift64Ashr;
        var ___errno_state = 0;
        function ___setErrNo(value) {
            HEAP32[___errno_state >> 2] = value;
            return value
        }
        var ERRNO_CODES = {
            EPERM: 1,
            ENOENT: 2,
            ESRCH: 3,
            EINTR: 4,
            EIO: 5,
            ENXIO: 6,
            E2BIG: 7,
            ENOEXEC: 8,
            EBADF: 9,
            ECHILD: 10,
            EAGAIN: 11,
            EWOULDBLOCK: 11,
            ENOMEM: 12,
            EACCES: 13,
            EFAULT: 14,
            ENOTBLK: 15,
            EBUSY: 16,
            EEXIST: 17,
            EXDEV: 18,
            ENODEV: 19,
            ENOTDIR: 20,
            EISDIR: 21,
            EINVAL: 22,
            ENFILE: 23,
            EMFILE: 24,
            ENOTTY: 25,
            ETXTBSY: 26,
            EFBIG: 27,
            ENOSPC: 28,
            ESPIPE: 29,
            EROFS: 30,
            EMLINK: 31,
            EPIPE: 32,
            EDOM: 33,
            ERANGE: 34,
            ENOMSG: 42,
            EIDRM: 43,
            ECHRNG: 44,
            EL2NSYNC: 45,
            EL3HLT: 46,
            EL3RST: 47,
            ELNRNG: 48,
            EUNATCH: 49,
            ENOCSI: 50,
            EL2HLT: 51,
            EDEADLK: 35,
            ENOLCK: 37,
            EBADE: 52,
            EBADR: 53,
            EXFULL: 54,
            ENOANO: 55,
            EBADRQC: 56,
            EBADSLT: 57,
            EDEADLOCK: 35,
            EBFONT: 59,
            ENOSTR: 60,
            ENODATA: 61,
            ETIME: 62,
            ENOSR: 63,
            ENONET: 64,
            ENOPKG: 65,
            EREMOTE: 66,
            ENOLINK: 67,
            EADV: 68,
            ESRMNT: 69,
            ECOMM: 70,
            EPROTO: 71,
            EMULTIHOP: 72,
            EDOTDOT: 73,
            EBADMSG: 74,
            ENOTUNIQ: 76,
            EBADFD: 77,
            EREMCHG: 78,
            ELIBACC: 79,
            ELIBBAD: 80,
            ELIBSCN: 81,
            ELIBMAX: 82,
            ELIBEXEC: 83,
            ENOSYS: 38,
            ENOTEMPTY: 39,
            ENAMETOOLONG: 36,
            ELOOP: 40,
            EOPNOTSUPP: 95,
            EPFNOSUPPORT: 96,
            ECONNRESET: 104,
            ENOBUFS: 105,
            EAFNOSUPPORT: 97,
            EPROTOTYPE: 91,
            ENOTSOCK: 88,
            ENOPROTOOPT: 92,
            ESHUTDOWN: 108,
            ECONNREFUSED: 111,
            EADDRINUSE: 98,
            ECONNABORTED: 103,
            ENETUNREACH: 101,
            ENETDOWN: 100,
            ETIMEDOUT: 110,
            EHOSTDOWN: 112,
            EHOSTUNREACH: 113,
            EINPROGRESS: 115,
            EALREADY: 114,
            EDESTADDRREQ: 89,
            EMSGSIZE: 90,
            EPROTONOSUPPORT: 93,
            ESOCKTNOSUPPORT: 94,
            EADDRNOTAVAIL: 99,
            ENETRESET: 102,
            EISCONN: 106,
            ENOTCONN: 107,
            ETOOMANYREFS: 109,
            EUSERS: 87,
            EDQUOT: 122,
            ESTALE: 116,
            ENOTSUP: 95,
            ENOMEDIUM: 123,
            EILSEQ: 84,
            EOVERFLOW: 75,
            ECANCELED: 125,
            ENOTRECOVERABLE: 131,
            EOWNERDEAD: 130,
            ESTRPIPE: 86
        };
        function _sysconf(name) {
            switch (name) {
                case 30:
                    return PAGE_SIZE;
                case 132:
                case 133:
                case 12:
                case 137:
                case 138:
                case 15:
                case 235:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                case 149:
                case 13:
                case 10:
                case 236:
                case 153:
                case 9:
                case 21:
                case 22:
                case 159:
                case 154:
                case 14:
                case 77:
                case 78:
                case 139:
                case 80:
                case 81:
                case 79:
                case 82:
                case 68:
                case 67:
                case 164:
                case 11:
                case 29:
                case 47:
                case 48:
                case 95:
                case 52:
                case 51:
                case 46:
                    return 200809;
                case 27:
                case 246:
                case 127:
                case 128:
                case 23:
                case 24:
                case 160:
                case 161:
                case 181:
                case 182:
                case 242:
                case 183:
                case 184:
                case 243:
                case 244:
                case 245:
                case 165:
                case 178:
                case 179:
                case 49:
                case 50:
                case 168:
                case 169:
                case 175:
                case 170:
                case 171:
                case 172:
                case 97:
                case 76:
                case 32:
                case 173:
                case 35:
                    return -1;
                case 176:
                case 177:
                case 7:
                case 155:
                case 8:
                case 157:
                case 125:
                case 126:
                case 92:
                case 93:
                case 129:
                case 130:
                case 131:
                case 94:
                case 91:
                    return 1;
                case 74:
                case 60:
                case 69:
                case 70:
                case 4:
                    return 1024;
                case 31:
                case 42:
                case 72:
                    return 32;
                case 87:
                case 26:
                case 33:
                    return 2147483647;
                case 34:
                case 1:
                    return 47839;
                case 38:
                case 36:
                    return 99;
                case 43:
                case 37:
                    return 2048;
                case 0:
                    return 2097152;
                case 3:
                    return 65536;
                case 28:
                    return 32768;
                case 44:
                    return 32767;
                case 75:
                    return 16384;
                case 39:
                    return 1e3;
                case 89:
                    return 700;
                case 71:
                    return 256;
                case 40:
                    return 255;
                case 2:
                    return 100;
                case 180:
                    return 64;
                case 25:
                    return 20;
                case 5:
                    return 16;
                case 6:
                    return 6;
                case 73:
                    return 4;
                case 84: {
                    if (typeof navigator === "object") return navigator["hardwareConcurrency"] || 1;
                    return 1
                }
            }
            ___setErrNo(ERRNO_CODES.EINVAL);
            return -1
        }
        var ctlz_i8 = allocate([8, 7, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "i8", ALLOC_STATIC);
        Module["_llvm_ctlz_i32"] = _llvm_ctlz_i32;
        Module["_memset"] = _memset;
        function _abort() {
            Module["abort"]()
        }
        Module["_strlen"] = _strlen;
        function _emscripten_memcpy_big(dest, src, num) {
            HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
            return dest
        }
        Module["_memcpy"] = _memcpy;
        Module["_i64Add"] = _i64Add;
        function _llvm_stackrestore(p) {
            var self = _llvm_stacksave;
            var ret = self.LLVM_SAVEDSTACKS[p];
            self.LLVM_SAVEDSTACKS.splice(p, 1);
            Runtime.stackRestore(ret)
        }
        function _sbrk(bytes) {
            var self = _sbrk;
            if (!self.called) {
                DYNAMICTOP = alignMemoryPage(DYNAMICTOP);
                self.called = true;
                assert(Runtime.dynamicAlloc);
                self.alloc = Runtime.dynamicAlloc;
                Runtime.dynamicAlloc = (function () {
                    abort("cannot dynamically allocate, sbrk now has control")
                })
            }
            var ret = DYNAMICTOP;
            if (bytes != 0) self.alloc(bytes);
            return ret
        }
        function _llvm_stacksave() {
            var self = _llvm_stacksave;
            if (!self.LLVM_SAVEDSTACKS) {
                self.LLVM_SAVEDSTACKS = []
            }
            self.LLVM_SAVEDSTACKS.push(Runtime.stackSave());
            return self.LLVM_SAVEDSTACKS.length - 1
        }
        Module["_memmove"] = _memmove;
        function ___errno_location() {
            return ___errno_state
        }
        function _abs() {
            return Math_abs.apply(null, arguments)
        }
        var ERRNO_MESSAGES = {
            0: "Success",
            1: "Not super-user",
            2: "No such file or directory",
            3: "No such process",
            4: "Interrupted system call",
            5: "I/O error",
            6: "No such device or address",
            7: "Arg list too long",
            8: "Exec format error",
            9: "Bad file number",
            10: "No children",
            11: "No more processes",
            12: "Not enough core",
            13: "Permission denied",
            14: "Bad address",
            15: "Block device required",
            16: "Mount device busy",
            17: "File exists",
            18: "Cross-device link",
            19: "No such device",
            20: "Not a directory",
            21: "Is a directory",
            22: "Invalid argument",
            23: "Too many open files in system",
            24: "Too many open files",
            25: "Not a typewriter",
            26: "Text file busy",
            27: "File too large",
            28: "No space left on device",
            29: "Illegal seek",
            30: "Read only file system",
            31: "Too many links",
            32: "Broken pipe",
            33: "Math arg out of domain of func",
            34: "Math result not representable",
            35: "File locking deadlock error",
            36: "File or path name too long",
            37: "No record locks available",
            38: "Function not implemented",
            39: "Directory not empty",
            40: "Too many symbolic links",
            42: "No message of desired type",
            43: "Identifier removed",
            44: "Channel number out of range",
            45: "Level 2 not synchronized",
            46: "Level 3 halted",
            47: "Level 3 reset",
            48: "Link number out of range",
            49: "Protocol driver not attached",
            50: "No CSI structure available",
            51: "Level 2 halted",
            52: "Invalid exchange",
            53: "Invalid request descriptor",
            54: "Exchange full",
            55: "No anode",
            56: "Invalid request code",
            57: "Invalid slot",
            59: "Bad font file fmt",
            60: "Device not a stream",
            61: "No data (for no delay io)",
            62: "Timer expired",
            63: "Out of streams resources",
            64: "Machine is not on the network",
            65: "Package not installed",
            66: "The object is remote",
            67: "The link has been severed",
            68: "Advertise error",
            69: "Srmount error",
            70: "Communication error on send",
            71: "Protocol error",
            72: "Multihop attempted",
            73: "Cross mount point (not really error)",
            74: "Trying to read unreadable message",
            75: "Value too large for defined data type",
            76: "Given log. name not unique",
            77: "f.d. invalid for this operation",
            78: "Remote address changed",
            79: "Can   access a needed shared lib",
            80: "Accessing a corrupted shared lib",
            81: ".lib section in a.out corrupted",
            82: "Attempting to link in too many libs",
            83: "Attempting to exec a shared library",
            84: "Illegal byte sequence",
            86: "Streams pipe error",
            87: "Too many users",
            88: "Socket operation on non-socket",
            89: "Destination address required",
            90: "Message too long",
            91: "Protocol wrong type for socket",
            92: "Protocol not available",
            93: "Unknown protocol",
            94: "Socket type not supported",
            95: "Not supported",
            96: "Protocol family not supported",
            97: "Address family not supported by protocol family",
            98: "Address already in use",
            99: "Address not available",
            100: "Network interface is not configured",
            101: "Network is unreachable",
            102: "Connection reset by network",
            103: "Connection aborted",
            104: "Connection reset by peer",
            105: "No buffer space available",
            106: "Socket is already connected",
            107: "Socket is not connected",
            108: "Can't send after socket shutdown",
            109: "Too many references",
            110: "Connection timed out",
            111: "Connection refused",
            112: "Host is down",
            113: "Host is unreachable",
            114: "Socket already connected",
            115: "Connection already in progress",
            116: "Stale file handle",
            122: "Quota exceeded",
            123: "No medium (in tape drive)",
            125: "Operation canceled",
            130: "Previous owner died",
            131: "State not recoverable"
        };
        var TTY = {
            ttys: [], init: (function () {
            }), shutdown: (function () {
            }), register: (function (dev, ops) {
                TTY.ttys[dev] = {input: [], output: [], ops: ops};
                FS.registerDevice(dev, TTY.stream_ops)
            }), stream_ops: {
                open: (function (stream) {
                    var tty = TTY.ttys[stream.node.rdev];
                    if (!tty) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                    }
                    stream.tty = tty;
                    stream.seekable = false
                }), close: (function (stream) {
                    if (stream.tty.output.length) {
                        stream.tty.ops.put_char(stream.tty, 10)
                    }
                }), read: (function (stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.get_char) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
                    }
                    var bytesRead = 0;
                    for (var i = 0; i < length; i++) {
                        var result;
                        try {
                            result = stream.tty.ops.get_char(stream.tty)
                        } catch (e) {
                            throw new FS.ErrnoError(ERRNO_CODES.EIO)
                        }
                        if (result === undefined && bytesRead === 0) {
                            throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                        }
                        if (result === null || result === undefined) break;
                        bytesRead++;
                        buffer[offset + i] = result
                    }
                    if (bytesRead) {
                        stream.node.timestamp = Date.now()
                    }
                    return bytesRead
                }), write: (function (stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.put_char) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
                    }
                    for (var i = 0; i < length; i++) {
                        try {
                            stream.tty.ops.put_char(stream.tty, buffer[offset + i])
                        } catch (e) {
                            throw new FS.ErrnoError(ERRNO_CODES.EIO)
                        }
                    }
                    if (length) {
                        stream.node.timestamp = Date.now()
                    }
                    return i
                })
            }, default_tty_ops: {
                get_char: (function (tty) {
                    if (!tty.input.length) {
                        var result = null;
                        if (ENVIRONMENT_IS_NODE) {
                            result = process["stdin"]["read"]();
                            if (!result) {
                                if (process["stdin"]["_readableState"] && process["stdin"]["_readableState"]["ended"]) {
                                    return null
                                }
                                return undefined
                            }
                        } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                            result = window.prompt("Input: ");
                            if (result !== null) {
                                result += "\n"
                            }
                        } else if (typeof readline == "function") {
                            result = readline();
                            if (result !== null) {
                                result += "\n"
                            }
                        }
                        if (!result) {
                            return null
                        }
                        tty.input = intArrayFromString(result, true)
                    }
                    return tty.input.shift()
                }), put_char: (function (tty, val) {
                    if (val === null || val === 10) {
                        Module["print"](tty.output.join(""));
                        tty.output = []
                    } else {
                        tty.output.push(TTY.utf8.processCChar(val))
                    }
                })
            }, default_tty1_ops: {
                put_char: (function (tty, val) {
                    if (val === null || val === 10) {
                        Module["printErr"](tty.output.join(""));
                        tty.output = []
                    } else {
                        tty.output.push(TTY.utf8.processCChar(val))
                    }
                })
            }
        };
        var MEMFS = {
            ops_table: null, mount: (function (mount) {
                return MEMFS.createNode(null, "/", 16384 | 511, 0)
            }), createNode: (function (parent, name, mode, dev) {
                if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (!MEMFS.ops_table) {
                    MEMFS.ops_table = {
                        dir: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                lookup: MEMFS.node_ops.lookup,
                                mknod: MEMFS.node_ops.mknod,
                                rename: MEMFS.node_ops.rename,
                                unlink: MEMFS.node_ops.unlink,
                                rmdir: MEMFS.node_ops.rmdir,
                                readdir: MEMFS.node_ops.readdir,
                                symlink: MEMFS.node_ops.symlink
                            }, stream: {llseek: MEMFS.stream_ops.llseek}
                        },
                        file: {
                            node: {getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr},
                            stream: {
                                llseek: MEMFS.stream_ops.llseek,
                                read: MEMFS.stream_ops.read,
                                write: MEMFS.stream_ops.write,
                                allocate: MEMFS.stream_ops.allocate,
                                mmap: MEMFS.stream_ops.mmap
                            }
                        },
                        link: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                readlink: MEMFS.node_ops.readlink
                            }, stream: {}
                        },
                        chrdev: {
                            node: {getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr},
                            stream: FS.chrdev_stream_ops
                        }
                    }
                }
                var node = FS.createNode(parent, name, mode, dev);
                if (FS.isDir(node.mode)) {
                    node.node_ops = MEMFS.ops_table.dir.node;
                    node.stream_ops = MEMFS.ops_table.dir.stream;
                    node.contents = {}
                } else if (FS.isFile(node.mode)) {
                    node.node_ops = MEMFS.ops_table.file.node;
                    node.stream_ops = MEMFS.ops_table.file.stream;
                    node.usedBytes = 0;
                    node.contents = null
                } else if (FS.isLink(node.mode)) {
                    node.node_ops = MEMFS.ops_table.link.node;
                    node.stream_ops = MEMFS.ops_table.link.stream
                } else if (FS.isChrdev(node.mode)) {
                    node.node_ops = MEMFS.ops_table.chrdev.node;
                    node.stream_ops = MEMFS.ops_table.chrdev.stream
                }
                node.timestamp = Date.now();
                if (parent) {
                    parent.contents[name] = node
                }
                return node
            }), getFileDataAsRegularArray: (function (node) {
                if (node.contents && node.contents.subarray) {
                    var arr = [];
                    for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
                    return arr
                }
                return node.contents
            }), getFileDataAsTypedArray: (function (node) {
                if (node.contents && node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
                return new Uint8Array(node.contents)
            }), expandFileStorage: (function (node, newCapacity) {
                if (node.contents && node.contents.subarray && newCapacity > node.contents.length) {
                    node.contents = MEMFS.getFileDataAsRegularArray(node);
                    node.usedBytes = node.contents.length
                }
                if (!node.contents || node.contents.subarray) {
                    var prevCapacity = node.contents ? node.contents.buffer.byteLength : 0;
                    if (prevCapacity >= newCapacity) return;
                    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
                    newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) | 0);
                    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(newCapacity);
                    if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
                    return
                }
                if (!node.contents && newCapacity > 0) node.contents = [];
                while (node.contents.length < newCapacity) node.contents.push(0)
            }), resizeFileStorage: (function (node, newSize) {
                if (node.usedBytes == newSize) return;
                if (newSize == 0) {
                    node.contents = null;
                    node.usedBytes = 0;
                    return
                }
                if (!node.contents || node.contents.subarray) {
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(new ArrayBuffer(newSize));
                    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
                    node.usedBytes = newSize;
                    return
                }
                if (!node.contents) node.contents = [];
                if (node.contents.length > newSize) node.contents.length = newSize; else while (node.contents.length < newSize) node.contents.push(0);
                node.usedBytes = newSize
            }), node_ops: {
                getattr: (function (node) {
                    var attr = {};
                    attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                    attr.ino = node.id;
                    attr.mode = node.mode;
                    attr.nlink = 1;
                    attr.uid = 0;
                    attr.gid = 0;
                    attr.rdev = node.rdev;
                    if (FS.isDir(node.mode)) {
                        attr.size = 4096
                    } else if (FS.isFile(node.mode)) {
                        attr.size = node.usedBytes
                    } else if (FS.isLink(node.mode)) {
                        attr.size = node.link.length
                    } else {
                        attr.size = 0
                    }
                    attr.atime = new Date(node.timestamp);
                    attr.mtime = new Date(node.timestamp);
                    attr.ctime = new Date(node.timestamp);
                    attr.blksize = 4096;
                    attr.blocks = Math.ceil(attr.size / attr.blksize);
                    return attr
                }), setattr: (function (node, attr) {
                    if (attr.mode !== undefined) {
                        node.mode = attr.mode
                    }
                    if (attr.timestamp !== undefined) {
                        node.timestamp = attr.timestamp
                    }
                    if (attr.size !== undefined) {
                        MEMFS.resizeFileStorage(node, attr.size)
                    }
                }), lookup: (function (parent, name) {
                    throw FS.genericErrors[ERRNO_CODES.ENOENT]
                }), mknod: (function (parent, name, mode, dev) {
                    return MEMFS.createNode(parent, name, mode, dev)
                }), rename: (function (old_node, new_dir, new_name) {
                    if (FS.isDir(old_node.mode)) {
                        var new_node;
                        try {
                            new_node = FS.lookupNode(new_dir, new_name)
                        } catch (e) {
                        }
                        if (new_node) {
                            for (var i in new_node.contents) {
                                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                            }
                        }
                    }
                    delete old_node.parent.contents[old_node.name];
                    old_node.name = new_name;
                    new_dir.contents[new_name] = old_node;
                    old_node.parent = new_dir
                }), unlink: (function (parent, name) {
                    delete parent.contents[name]
                }), rmdir: (function (parent, name) {
                    var node = FS.lookupNode(parent, name);
                    for (var i in node.contents) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                    }
                    delete parent.contents[name]
                }), readdir: (function (node) {
                    var entries = [".", ".."];
                    for (var key in node.contents) {
                        if (!node.contents.hasOwnProperty(key)) {
                            continue
                        }
                        entries.push(key)
                    }
                    return entries
                }), symlink: (function (parent, newname, oldpath) {
                    var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
                    node.link = oldpath;
                    return node
                }), readlink: (function (node) {
                    if (!FS.isLink(node.mode)) {
                        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                    }
                    return node.link
                })
            }, stream_ops: {
                read: (function (stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= stream.node.usedBytes) return 0;
                    var size = Math.min(stream.node.usedBytes - position, length);
                    assert(size >= 0);
                    if (size > 8 && contents.subarray) {
                        buffer.set(contents.subarray(position, position + size), offset)
                    } else {
                        for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i]
                    }
                    return size
                }), write: (function (stream, buffer, offset, length, position, canOwn) {
                    if (!length) return 0;
                    var node = stream.node;
                    node.timestamp = Date.now();
                    if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                        if (canOwn) {
                            node.contents = buffer.subarray(offset, offset + length);
                            node.usedBytes = length;
                            return length
                        } else if (node.usedBytes === 0 && position === 0) {
                            node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
                            node.usedBytes = length;
                            return length
                        } else if (position + length <= node.usedBytes) {
                            node.contents.set(buffer.subarray(offset, offset + length), position);
                            return length
                        }
                    }
                    MEMFS.expandFileStorage(node, position + length);
                    if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position); else for (var i = 0; i < length; i++) {
                        node.contents[position + i] = buffer[offset + i]
                    }
                    node.usedBytes = Math.max(node.usedBytes, position + length);
                    return length
                }), llseek: (function (stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            position += stream.node.usedBytes
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                    }
                    stream.ungotten = [];
                    stream.position = position;
                    return position
                }), allocate: (function (stream, offset, length) {
                    MEMFS.expandFileStorage(stream.node, offset + length);
                    stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
                }), mmap: (function (stream, buffer, offset, length, position, prot, flags) {
                    if (!FS.isFile(stream.node.mode)) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                    }
                    var ptr;
                    var allocated;
                    var contents = stream.node.contents;
                    if (!(flags & 2) && (contents.buffer === buffer || contents.buffer === buffer.buffer)) {
                        allocated = false;
                        ptr = contents.byteOffset
                    } else {
                        if (position > 0 || position + length < stream.node.usedBytes) {
                            if (contents.subarray) {
                                contents = contents.subarray(position, position + length)
                            } else {
                                contents = Array.prototype.slice.call(contents, position, position + length)
                            }
                        }
                        allocated = true;
                        ptr = _malloc(length);
                        if (!ptr) {
                            throw new FS.ErrnoError(ERRNO_CODES.ENOMEM)
                        }
                        buffer.set(contents, ptr)
                    }
                    return {ptr: ptr, allocated: allocated}
                })
            }
        };
        var IDBFS = {
            dbs: {}, indexedDB: (function () {
                return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
            }), DB_VERSION: 21, DB_STORE_NAME: "FILE_DATA", mount: (function (mount) {
                return MEMFS.mount.apply(null, arguments)
            }), syncfs: (function (mount, populate, callback) {
                IDBFS.getLocalSet(mount, (function (err, local) {
                    if (err) return callback(err);
                    IDBFS.getRemoteSet(mount, (function (err, remote) {
                        if (err) return callback(err);
                        var src = populate ? remote : local;
                        var dst = populate ? local : remote;
                        IDBFS.reconcile(src, dst, callback)
                    }))
                }))
            }), getDB: (function (name, callback) {
                var db = IDBFS.dbs[name];
                if (db) {
                    return callback(null, db)
                }
                var req;
                try {
                    req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION)
                } catch (e) {
                    return callback(e)
                }
                req.onupgradeneeded = (function (e) {
                    var db = e.target.result;
                    var transaction = e.target.transaction;
                    var fileStore;
                    if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                        fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME)
                    } else {
                        fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME)
                    }
                    fileStore.createIndex("timestamp", "timestamp", {unique: false})
                });
                req.onsuccess = (function () {
                    db = req.result;
                    IDBFS.dbs[name] = db;
                    callback(null, db)
                });
                req.onerror = (function () {
                    callback(this.error)
                })
            }), getLocalSet: (function (mount, callback) {
                var entries = {};
                function isRealDir(p) {
                    return p !== "." && p !== ".."
                }
                function toAbsolute(root) {
                    return (function (p) {
                        return PATH.join2(root, p)
                    })
                }
                var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
                while (check.length) {
                    var path = check.pop();
                    var stat;
                    try {
                        stat = FS.stat(path)
                    } catch (e) {
                        return callback(e)
                    }
                    if (FS.isDir(stat.mode)) {
                        check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))
                    }
                    entries[path] = {timestamp: stat.mtime}
                }
                return callback(null, {type: "local", entries: entries})
            }), getRemoteSet: (function (mount, callback) {
                var entries = {};
                IDBFS.getDB(mount.mountpoint, (function (err, db) {
                    if (err) return callback(err);
                    var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
                    transaction.onerror = (function () {
                        callback(this.error)
                    });
                    var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                    var index = store.index("timestamp");
                    index.openKeyCursor().onsuccess = (function (event) {
                        var cursor = event.target.result;
                        if (!cursor) {
                            return callback(null, {type: "remote", db: db, entries: entries})
                        }
                        entries[cursor.primaryKey] = {timestamp: cursor.key};
                        cursor.continue()
                    })
                }))
            }), loadLocalEntry: (function (path, callback) {
                var stat, node;
                try {
                    var lookup = FS.lookupPath(path);
                    node = lookup.node;
                    stat = FS.stat(path)
                } catch (e) {
                    return callback(e)
                }
                if (FS.isDir(stat.mode)) {
                    return callback(null, {timestamp: stat.mtime, mode: stat.mode})
                } else if (FS.isFile(stat.mode)) {
                    node.contents = MEMFS.getFileDataAsTypedArray(node);
                    return callback(null, {timestamp: stat.mtime, mode: stat.mode, contents: node.contents})
                } else {
                    return callback(new Error("node type not supported"))
                }
            }), storeLocalEntry: (function (path, entry, callback) {
                try {
                    if (FS.isDir(entry.mode)) {
                        FS.mkdir(path, entry.mode)
                    } else if (FS.isFile(entry.mode)) {
                        FS.writeFile(path, entry.contents, {encoding: "binary", canOwn: true})
                    } else {
                        return callback(new Error("node type not supported"))
                    }
                    FS.utime(path, entry.timestamp, entry.timestamp)
                } catch (e) {
                    return callback(e)
                }
                callback(null)
            }), removeLocalEntry: (function (path, callback) {
                try {
                    var lookup = FS.lookupPath(path);
                    var stat = FS.stat(path);
                    if (FS.isDir(stat.mode)) {
                        FS.rmdir(path)
                    } else if (FS.isFile(stat.mode)) {
                        FS.unlink(path)
                    }
                } catch (e) {
                    return callback(e)
                }
                callback(null)
            }), loadRemoteEntry: (function (store, path, callback) {
                var req = store.get(path);
                req.onsuccess = (function (event) {
                    callback(null, event.target.result)
                });
                req.onerror = (function () {
                    callback(this.error)
                })
            }), storeRemoteEntry: (function (store, path, entry, callback) {
                var req = store.put(entry, path);
                req.onsuccess = (function () {
                    callback(null)
                });
                req.onerror = (function () {
                    callback(this.error)
                })
            }), removeRemoteEntry: (function (store, path, callback) {
                var req = store.delete(path);
                req.onsuccess = (function () {
                    callback(null)
                });
                req.onerror = (function () {
                    callback(this.error)
                })
            }), reconcile: (function (src, dst, callback) {
                var total = 0;
                var create = [];
                Object.keys(src.entries).forEach((function (key) {
                    var e = src.entries[key];
                    var e2 = dst.entries[key];
                    if (!e2 || e.timestamp > e2.timestamp) {
                        create.push(key);
                        total++
                    }
                }));
                var remove = [];
                Object.keys(dst.entries).forEach((function (key) {
                    var e = dst.entries[key];
                    var e2 = src.entries[key];
                    if (!e2) {
                        remove.push(key);
                        total++
                    }
                }));
                if (!total) {
                    return callback(null)
                }
                var errored = false;
                var completed = 0;
                var db = src.type === "remote" ? src.db : dst.db;
                var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
                var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                function done(err) {
                    if (err) {
                        if (!done.errored) {
                            done.errored = true;
                            return callback(err)
                        }
                        return
                    }
                    if (++completed >= total) {
                        return callback(null)
                    }
                }
                transaction.onerror = (function () {
                    done(this.error)
                });
                create.sort().forEach((function (path) {
                    if (dst.type === "local") {
                        IDBFS.loadRemoteEntry(store, path, (function (err, entry) {
                            if (err) return done(err);
                            IDBFS.storeLocalEntry(path, entry, done)
                        }))
                    } else {
                        IDBFS.loadLocalEntry(path, (function (err, entry) {
                            if (err) return done(err);
                            IDBFS.storeRemoteEntry(store, path, entry, done)
                        }))
                    }
                }));
                remove.sort().reverse().forEach((function (path) {
                    if (dst.type === "local") {
                        IDBFS.removeLocalEntry(path, done)
                    } else {
                        IDBFS.removeRemoteEntry(store, path, done)
                    }
                }))
            })
        };
        var NODEFS = {
            isWindows: false,
            staticInit: (function () {
                NODEFS.isWindows = !!process.platform.match(/^win/)
            }),
            mount: (function (mount) {
                assert(ENVIRONMENT_IS_NODE);
                return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0)
            }),
            createNode: (function (parent, name, mode, dev) {
                if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var node = FS.createNode(parent, name, mode);
                node.node_ops = NODEFS.node_ops;
                node.stream_ops = NODEFS.stream_ops;
                return node
            }),
            getMode: (function (path) {
                var stat;
                try {
                    stat = fs.lstatSync(path);
                    if (NODEFS.isWindows) {
                        stat.mode = stat.mode | (stat.mode & 146) >> 1
                    }
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
                return stat.mode
            }),
            realPath: (function (node) {
                var parts = [];
                while (node.parent !== node) {
                    parts.push(node.name);
                    node = node.parent
                }
                parts.push(node.mount.opts.root);
                parts.reverse();
                return PATH.join.apply(null, parts)
            }),
            flagsToPermissionStringMap: {
                0: "r",
                1: "r+",
                2: "r+",
                64: "r",
                65: "r+",
                66: "r+",
                129: "rx+",
                193: "rx+",
                514: "w+",
                577: "w",
                578: "w+",
                705: "wx",
                706: "wx+",
                1024: "a",
                1025: "a",
                1026: "a+",
                1089: "a",
                1090: "a+",
                1153: "ax",
                1154: "ax+",
                1217: "ax",
                1218: "ax+",
                4096: "rs",
                4098: "rs+"
            },
            flagsToPermissionString: (function (flags) {
                if (flags in NODEFS.flagsToPermissionStringMap) {
                    return NODEFS.flagsToPermissionStringMap[flags]
                } else {
                    return flags
                }
            }),
            node_ops: {
                getattr: (function (node) {
                    var path = NODEFS.realPath(node);
                    var stat;
                    try {
                        stat = fs.lstatSync(path)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                    if (NODEFS.isWindows && !stat.blksize) {
                        stat.blksize = 4096
                    }
                    if (NODEFS.isWindows && !stat.blocks) {
                        stat.blocks = (stat.size + stat.blksize - 1) / stat.blksize | 0
                    }
                    return {
                        dev: stat.dev,
                        ino: stat.ino,
                        mode: stat.mode,
                        nlink: stat.nlink,
                        uid: stat.uid,
                        gid: stat.gid,
                        rdev: stat.rdev,
                        size: stat.size,
                        atime: stat.atime,
                        mtime: stat.mtime,
                        ctime: stat.ctime,
                        blksize: stat.blksize,
                        blocks: stat.blocks
                    }
                }), setattr: (function (node, attr) {
                    var path = NODEFS.realPath(node);
                    try {
                        if (attr.mode !== undefined) {
                            fs.chmodSync(path, attr.mode);
                            node.mode = attr.mode
                        }
                        if (attr.timestamp !== undefined) {
                            var date = new Date(attr.timestamp);
                            fs.utimesSync(path, date, date)
                        }
                        if (attr.size !== undefined) {
                            fs.truncateSync(path, attr.size)
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), lookup: (function (parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    var mode = NODEFS.getMode(path);
                    return NODEFS.createNode(parent, name, mode)
                }), mknod: (function (parent, name, mode, dev) {
                    var node = NODEFS.createNode(parent, name, mode, dev);
                    var path = NODEFS.realPath(node);
                    try {
                        if (FS.isDir(node.mode)) {
                            fs.mkdirSync(path, node.mode)
                        } else {
                            fs.writeFileSync(path, "", {mode: node.mode})
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                    return node
                }), rename: (function (oldNode, newDir, newName) {
                    var oldPath = NODEFS.realPath(oldNode);
                    var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
                    try {
                        fs.renameSync(oldPath, newPath)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), unlink: (function (parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    try {
                        fs.unlinkSync(path)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), rmdir: (function (parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    try {
                        fs.rmdirSync(path)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), readdir: (function (node) {
                    var path = NODEFS.realPath(node);
                    try {
                        return fs.readdirSync(path)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), symlink: (function (parent, newName, oldPath) {
                    var newPath = PATH.join2(NODEFS.realPath(parent), newName);
                    try {
                        fs.symlinkSync(oldPath, newPath)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), readlink: (function (node) {
                    var path = NODEFS.realPath(node);
                    try {
                        return fs.readlinkSync(path)
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                })
            },
            stream_ops: {
                open: (function (stream) {
                    var path = NODEFS.realPath(stream.node);
                    try {
                        if (FS.isFile(stream.node.mode)) {
                            stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags))
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), close: (function (stream) {
                    try {
                        if (FS.isFile(stream.node.mode) && stream.nfd) {
                            fs.closeSync(stream.nfd)
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), read: (function (stream, buffer, offset, length, position) {
                    var nbuffer = new Buffer(length);
                    var res;
                    try {
                        res = fs.readSync(stream.nfd, nbuffer, 0, length, position)
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                    if (res > 0) {
                        for (var i = 0; i < res; i++) {
                            buffer[offset + i] = nbuffer[i]
                        }
                    }
                    return res
                }), write: (function (stream, buffer, offset, length, position) {
                    var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
                    var res;
                    try {
                        res = fs.writeSync(stream.nfd, nbuffer, 0, length, position)
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                    return res
                }), llseek: (function (stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            try {
                                var stat = fs.fstatSync(stream.nfd);
                                position += stat.size
                            } catch (e) {
                                throw new FS.ErrnoError(ERRNO_CODES[e.code])
                            }
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                    }
                    stream.position = position;
                    return position
                })
            }
        };
        var _stdin = allocate(1, "i32*", ALLOC_STATIC);
        var _stdout = allocate(1, "i32*", ALLOC_STATIC);
        var _stderr = allocate(1, "i32*", ALLOC_STATIC);
        function _fflush(stream) {
        }
        var FS = {
            root: null,
            mounts: [],
            devices: [null],
            streams: [],
            nextInode: 1,
            nameTable: null,
            currentPath: "/",
            initialized: false,
            ignorePermissions: true,
            trackingDelegate: {},
            tracking: {openFlags: {READ: 1, WRITE: 2}},
            ErrnoError: null,
            genericErrors: {},
            handleFSError: (function (e) {
                if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
                return ___setErrNo(e.errno)
            }),
            lookupPath: (function (path, opts) {
                path = PATH.resolve(FS.cwd(), path);
                opts = opts || {};
                var defaults = {follow_mount: true, recurse_count: 0};
                for (var key in defaults) {
                    if (opts[key] === undefined) {
                        opts[key] = defaults[key]
                    }
                }
                if (opts.recurse_count > 8) {
                    throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                }
                var parts = PATH.normalizeArray(path.split("/").filter((function (p) {
                    return !!p
                })), false);
                var current = FS.root;
                var current_path = "/";
                for (var i = 0; i < parts.length; i++) {
                    var islast = i === parts.length - 1;
                    if (islast && opts.parent) {
                        break
                    }
                    current = FS.lookupNode(current, parts[i]);
                    current_path = PATH.join2(current_path, parts[i]);
                    if (FS.isMountpoint(current)) {
                        if (!islast || islast && opts.follow_mount) {
                            current = current.mounted.root
                        }
                    }
                    if (!islast || opts.follow) {
                        var count = 0;
                        while (FS.isLink(current.mode)) {
                            var link = FS.readlink(current_path);
                            current_path = PATH.resolve(PATH.dirname(current_path), link);
                            var lookup = FS.lookupPath(current_path, {recurse_count: opts.recurse_count});
                            current = lookup.node;
                            if (count++ > 40) {
                                throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                            }
                        }
                    }
                }
                return {path: current_path, node: current}
            }),
            getPath: (function (node) {
                var path;
                while (true) {
                    if (FS.isRoot(node)) {
                        var mount = node.mount.mountpoint;
                        if (!path) return mount;
                        return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
                    }
                    path = path ? node.name + "/" + path : node.name;
                    node = node.parent
                }
            }),
            hashName: (function (parentid, name) {
                var hash = 0;
                for (var i = 0; i < name.length; i++) {
                    hash = (hash << 5) - hash + name.charCodeAt(i) | 0
                }
                return (parentid + hash >>> 0) % FS.nameTable.length
            }),
            hashAddNode: (function (node) {
                var hash = FS.hashName(node.parent.id, node.name);
                node.name_next = FS.nameTable[hash];
                FS.nameTable[hash] = node
            }),
            hashRemoveNode: (function (node) {
                var hash = FS.hashName(node.parent.id, node.name);
                if (FS.nameTable[hash] === node) {
                    FS.nameTable[hash] = node.name_next
                } else {
                    var current = FS.nameTable[hash];
                    while (current) {
                        if (current.name_next === node) {
                            current.name_next = node.name_next;
                            break
                        }
                        current = current.name_next
                    }
                }
            }),
            lookupNode: (function (parent, name) {
                var err = FS.mayLookup(parent);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                var hash = FS.hashName(parent.id, name);
                for (var node = FS.nameTable[hash]; node; node = node.name_next) {
                    var nodeName = node.name;
                    if (node.parent.id === parent.id && nodeName === name) {
                        return node
                    }
                }
                return FS.lookup(parent, name)
            }),
            createNode: (function (parent, name, mode, rdev) {
                if (!FS.FSNode) {
                    FS.FSNode = (function (parent, name, mode, rdev) {
                        if (!parent) {
                            parent = this
                        }
                        this.parent = parent;
                        this.mount = parent.mount;
                        this.mounted = null;
                        this.id = FS.nextInode++;
                        this.name = name;
                        this.mode = mode;
                        this.node_ops = {};
                        this.stream_ops = {};
                        this.rdev = rdev
                    });
                    FS.FSNode.prototype = {};
                    var readMode = 292 | 73;
                    var writeMode = 146;
                    Object.defineProperties(FS.FSNode.prototype, {
                        read: {
                            get: (function () {
                                return (this.mode & readMode) === readMode
                            }), set: (function (val) {
                                val ? this.mode |= readMode : this.mode &= ~readMode
                            })
                        }, write: {
                            get: (function () {
                                return (this.mode & writeMode) === writeMode
                            }), set: (function (val) {
                                val ? this.mode |= writeMode : this.mode &= ~writeMode
                            })
                        }, isFolder: {
                            get: (function () {
                                return FS.isDir(this.mode)
                            })
                        }, isDevice: {
                            get: (function () {
                                return FS.isChrdev(this.mode)
                            })
                        }
                    })
                }
                var node = new FS.FSNode(parent, name, mode, rdev);
                FS.hashAddNode(node);
                return node
            }),
            destroyNode: (function (node) {
                FS.hashRemoveNode(node)
            }),
            isRoot: (function (node) {
                return node === node.parent
            }),
            isMountpoint: (function (node) {
                return !!node.mounted
            }),
            isFile: (function (mode) {
                return (mode & 61440) === 32768
            }),
            isDir: (function (mode) {
                return (mode & 61440) === 16384
            }),
            isLink: (function (mode) {
                return (mode & 61440) === 40960
            }),
            isChrdev: (function (mode) {
                return (mode & 61440) === 8192
            }),
            isBlkdev: (function (mode) {
                return (mode & 61440) === 24576
            }),
            isFIFO: (function (mode) {
                return (mode & 61440) === 4096
            }),
            isSocket: (function (mode) {
                return (mode & 49152) === 49152
            }),
            flagModes: {
                "r": 0,
                "rs": 1052672,
                "r+": 2,
                "w": 577,
                "wx": 705,
                "xw": 705,
                "w+": 578,
                "wx+": 706,
                "xw+": 706,
                "a": 1089,
                "ax": 1217,
                "xa": 1217,
                "a+": 1090,
                "ax+": 1218,
                "xa+": 1218
            },
            modeStringToFlags: (function (str) {
                var flags = FS.flagModes[str];
                if (typeof flags === "undefined") {
                    throw new Error("Unknown file open mode: " + str)
                }
                return flags
            }),
            flagsToPermissionString: (function (flag) {
                var accmode = flag & 2097155;
                var perms = ["r", "w", "rw"][accmode];
                if (flag & 512) {
                    perms += "w"
                }
                return perms
            }),
            nodePermissions: (function (node, perms) {
                if (FS.ignorePermissions) {
                    return 0
                }
                if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
                    return ERRNO_CODES.EACCES
                } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
                    return ERRNO_CODES.EACCES
                } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
                    return ERRNO_CODES.EACCES
                }
                return 0
            }),
            mayLookup: (function (dir) {
                return FS.nodePermissions(dir, "x")
            }),
            mayCreate: (function (dir, name) {
                try {
                    var node = FS.lookupNode(dir, name);
                    return ERRNO_CODES.EEXIST
                } catch (e) {
                }
                return FS.nodePermissions(dir, "wx")
            }),
            mayDelete: (function (dir, name, isdir) {
                var node;
                try {
                    node = FS.lookupNode(dir, name)
                } catch (e) {
                    return e.errno
                }
                var err = FS.nodePermissions(dir, "wx");
                if (err) {
                    return err
                }
                if (isdir) {
                    if (!FS.isDir(node.mode)) {
                        return ERRNO_CODES.ENOTDIR
                    }
                    if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                        return ERRNO_CODES.EBUSY
                    }
                } else {
                    if (FS.isDir(node.mode)) {
                        return ERRNO_CODES.EISDIR
                    }
                }
                return 0
            }),
            mayOpen: (function (node, flags) {
                if (!node) {
                    return ERRNO_CODES.ENOENT
                }
                if (FS.isLink(node.mode)) {
                    return ERRNO_CODES.ELOOP
                } else if (FS.isDir(node.mode)) {
                    if ((flags & 2097155) !== 0 || flags & 512) {
                        return ERRNO_CODES.EISDIR
                    }
                }
                return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
            }),
            MAX_OPEN_FDS: 4096,
            nextfd: (function (fd_start, fd_end) {
                fd_start = fd_start || 0;
                fd_end = fd_end || FS.MAX_OPEN_FDS;
                for (var fd = fd_start; fd <= fd_end; fd++) {
                    if (!FS.streams[fd]) {
                        return fd
                    }
                }
                throw new FS.ErrnoError(ERRNO_CODES.EMFILE)
            }),
            getStream: (function (fd) {
                return FS.streams[fd]
            }),
            createStream: (function (stream, fd_start, fd_end) {
                if (!FS.FSStream) {
                    FS.FSStream = (function () {
                    });
                    FS.FSStream.prototype = {};
                    Object.defineProperties(FS.FSStream.prototype, {
                        object: {
                            get: (function () {
                                return this.node
                            }), set: (function (val) {
                                this.node = val
                            })
                        }, isRead: {
                            get: (function () {
                                return (this.flags & 2097155) !== 1
                            })
                        }, isWrite: {
                            get: (function () {
                                return (this.flags & 2097155) !== 0
                            })
                        }, isAppend: {
                            get: (function () {
                                return this.flags & 1024
                            })
                        }
                    })
                }
                var newStream = new FS.FSStream;
                for (var p in stream) {
                    newStream[p] = stream[p]
                }
                stream = newStream;
                var fd = FS.nextfd(fd_start, fd_end);
                stream.fd = fd;
                FS.streams[fd] = stream;
                return stream
            }),
            closeStream: (function (fd) {
                FS.streams[fd] = null
            }),
            getStreamFromPtr: (function (ptr) {
                return FS.streams[ptr - 1]
            }),
            getPtrForStream: (function (stream) {
                return stream ? stream.fd + 1 : 0
            }),
            chrdev_stream_ops: {
                open: (function (stream) {
                    var device = FS.getDevice(stream.node.rdev);
                    stream.stream_ops = device.stream_ops;
                    if (stream.stream_ops.open) {
                        stream.stream_ops.open(stream)
                    }
                }), llseek: (function () {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                })
            },
            major: (function (dev) {
                return dev >> 8
            }),
            minor: (function (dev) {
                return dev & 255
            }),
            makedev: (function (ma, mi) {
                return ma << 8 | mi
            }),
            registerDevice: (function (dev, ops) {
                FS.devices[dev] = {stream_ops: ops}
            }),
            getDevice: (function (dev) {
                return FS.devices[dev]
            }),
            getMounts: (function (mount) {
                var mounts = [];
                var check = [mount];
                while (check.length) {
                    var m = check.pop();
                    mounts.push(m);
                    check.push.apply(check, m.mounts)
                }
                return mounts
            }),
            syncfs: (function (populate, callback) {
                if (typeof populate === "function") {
                    callback = populate;
                    populate = false
                }
                var mounts = FS.getMounts(FS.root.mount);
                var completed = 0;
                function done(err) {
                    if (err) {
                        if (!done.errored) {
                            done.errored = true;
                            return callback(err)
                        }
                        return
                    }
                    if (++completed >= mounts.length) {
                        callback(null)
                    }
                }
                mounts.forEach((function (mount) {
                    if (!mount.type.syncfs) {
                        return done(null)
                    }
                    mount.type.syncfs(mount, populate, done)
                }))
            }),
            mount: (function (type, opts, mountpoint) {
                var root = mountpoint === "/";
                var pseudo = !mountpoint;
                var node;
                if (root && FS.root) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                } else if (!root && !pseudo) {
                    var lookup = FS.lookupPath(mountpoint, {follow_mount: false});
                    mountpoint = lookup.path;
                    node = lookup.node;
                    if (FS.isMountpoint(node)) {
                        throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                    }
                    if (!FS.isDir(node.mode)) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                    }
                }
                var mount = {type: type, opts: opts, mountpoint: mountpoint, mounts: []};
                var mountRoot = type.mount(mount);
                mountRoot.mount = mount;
                mount.root = mountRoot;
                if (root) {
                    FS.root = mountRoot
                } else if (node) {
                    node.mounted = mount;
                    if (node.mount) {
                        node.mount.mounts.push(mount)
                    }
                }
                return mountRoot
            }),
            unmount: (function (mountpoint) {
                var lookup = FS.lookupPath(mountpoint, {follow_mount: false});
                if (!FS.isMountpoint(lookup.node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var node = lookup.node;
                var mount = node.mounted;
                var mounts = FS.getMounts(mount);
                Object.keys(FS.nameTable).forEach((function (hash) {
                    var current = FS.nameTable[hash];
                    while (current) {
                        var next = current.name_next;
                        if (mounts.indexOf(current.mount) !== -1) {
                            FS.destroyNode(current)
                        }
                        current = next
                    }
                }));
                node.mounted = null;
                var idx = node.mount.mounts.indexOf(mount);
                assert(idx !== -1);
                node.mount.mounts.splice(idx, 1)
            }),
            lookup: (function (parent, name) {
                return parent.node_ops.lookup(parent, name)
            }),
            mknod: (function (path, mode, dev) {
                var lookup = FS.lookupPath(path, {parent: true});
                var parent = lookup.node;
                var name = PATH.basename(path);
                var err = FS.mayCreate(parent, name);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.mknod) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                return parent.node_ops.mknod(parent, name, mode, dev)
            }),
            create: (function (path, mode) {
                mode = mode !== undefined ? mode : 438;
                mode &= 4095;
                mode |= 32768;
                return FS.mknod(path, mode, 0)
            }),
            mkdir: (function (path, mode) {
                mode = mode !== undefined ? mode : 511;
                mode &= 511 | 512;
                mode |= 16384;
                return FS.mknod(path, mode, 0)
            }),
            mkdev: (function (path, mode, dev) {
                if (typeof dev === "undefined") {
                    dev = mode;
                    mode = 438
                }
                mode |= 8192;
                return FS.mknod(path, mode, dev)
            }),
            symlink: (function (oldpath, newpath) {
                var lookup = FS.lookupPath(newpath, {parent: true});
                var parent = lookup.node;
                var newname = PATH.basename(newpath);
                var err = FS.mayCreate(parent, newname);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.symlink) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                return parent.node_ops.symlink(parent, newname, oldpath)
            }),
            rename: (function (old_path, new_path) {
                var old_dirname = PATH.dirname(old_path);
                var new_dirname = PATH.dirname(new_path);
                var old_name = PATH.basename(old_path);
                var new_name = PATH.basename(new_path);
                var lookup, old_dir, new_dir;
                try {
                    lookup = FS.lookupPath(old_path, {parent: true});
                    old_dir = lookup.node;
                    lookup = FS.lookupPath(new_path, {parent: true});
                    new_dir = lookup.node
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                if (old_dir.mount !== new_dir.mount) {
                    throw new FS.ErrnoError(ERRNO_CODES.EXDEV)
                }
                var old_node = FS.lookupNode(old_dir, old_name);
                var relative = PATH.relative(old_path, new_dirname);
                if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                relative = PATH.relative(new_path, old_dirname);
                if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                }
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name)
                } catch (e) {
                }
                if (old_node === new_node) {
                    return
                }
                var isdir = FS.isDir(old_node.mode);
                var err = FS.mayDelete(old_dir, old_name, isdir);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                err = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!old_dir.node_ops.rename) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                if (new_dir !== old_dir) {
                    err = FS.nodePermissions(old_dir, "w");
                    if (err) {
                        throw new FS.ErrnoError(err)
                    }
                }
                try {
                    if (FS.trackingDelegate["willMovePath"]) {
                        FS.trackingDelegate["willMovePath"](old_path, new_path)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
                }
                FS.hashRemoveNode(old_node);
                try {
                    old_dir.node_ops.rename(old_node, new_dir, new_name)
                } catch (e) {
                    throw e
                } finally {
                    FS.hashAddNode(old_node)
                }
                try {
                    if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
                }
            }),
            rmdir: (function (path) {
                var lookup = FS.lookupPath(path, {parent: true});
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var err = FS.mayDelete(parent, name, true);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.rmdir) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                try {
                    if (FS.trackingDelegate["willDeletePath"]) {
                        FS.trackingDelegate["willDeletePath"](path)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
                }
                parent.node_ops.rmdir(parent, name);
                FS.destroyNode(node);
                try {
                    if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
                }
            }),
            readdir: (function (path) {
                var lookup = FS.lookupPath(path, {follow: true});
                var node = lookup.node;
                if (!node.node_ops.readdir) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                }
                return node.node_ops.readdir(node)
            }),
            unlink: (function (path) {
                var lookup = FS.lookupPath(path, {parent: true});
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var err = FS.mayDelete(parent, name, false);
                if (err) {
                    if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.unlink) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                try {
                    if (FS.trackingDelegate["willDeletePath"]) {
                        FS.trackingDelegate["willDeletePath"](path)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
                }
                parent.node_ops.unlink(parent, name);
                FS.destroyNode(node);
                try {
                    if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
                }
            }),
            readlink: (function (path) {
                var lookup = FS.lookupPath(path);
                var link = lookup.node;
                if (!link.node_ops.readlink) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                return link.node_ops.readlink(link)
            }),
            stat: (function (path, dontFollow) {
                var lookup = FS.lookupPath(path, {follow: !dontFollow});
                var node = lookup.node;
                if (!node.node_ops.getattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                return node.node_ops.getattr(node)
            }),
            lstat: (function (path) {
                return FS.stat(path, true)
            }),
            chmod: (function (path, mode, dontFollow) {
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, {follow: !dontFollow});
                    node = lookup.node
                } else {
                    node = path
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                node.node_ops.setattr(node, {mode: mode & 4095 | node.mode & ~4095, timestamp: Date.now()})
            }),
            lchmod: (function (path, mode) {
                FS.chmod(path, mode, true)
            }),
            fchmod: (function (fd, mode) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                FS.chmod(stream.node, mode)
            }),
            chown: (function (path, uid, gid, dontFollow) {
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, {follow: !dontFollow});
                    node = lookup.node
                } else {
                    node = path
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                node.node_ops.setattr(node, {timestamp: Date.now()})
            }),
            lchown: (function (path, uid, gid) {
                FS.chown(path, uid, gid, true)
            }),
            fchown: (function (fd, uid, gid) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                FS.chown(stream.node, uid, gid)
            }),
            truncate: (function (path, len) {
                if (len < 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, {follow: true});
                    node = lookup.node
                } else {
                    node = path
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
                }
                if (!FS.isFile(node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var err = FS.nodePermissions(node, "w");
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                node.node_ops.setattr(node, {size: len, timestamp: Date.now()})
            }),
            ftruncate: (function (fd, len) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                FS.truncate(stream.node, len)
            }),
            utime: (function (path, atime, mtime) {
                var lookup = FS.lookupPath(path, {follow: true});
                var node = lookup.node;
                node.node_ops.setattr(node, {timestamp: Math.max(atime, mtime)})
            }),
            open: (function (path, flags, mode, fd_start, fd_end) {
                if (path === "") {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }
                flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
                mode = typeof mode === "undefined" ? 438 : mode;
                if (flags & 64) {
                    mode = mode & 4095 | 32768
                } else {
                    mode = 0
                }
                var node;
                if (typeof path === "object") {
                    node = path
                } else {
                    path = PATH.normalize(path);
                    try {
                        var lookup = FS.lookupPath(path, {follow: !(flags & 131072)});
                        node = lookup.node
                    } catch (e) {
                    }
                }
                if (flags & 64) {
                    if (node) {
                        if (flags & 128) {
                            throw new FS.ErrnoError(ERRNO_CODES.EEXIST)
                        }
                    } else {
                        node = FS.mknod(path, mode, 0)
                    }
                }
                if (!node) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }
                if (FS.isChrdev(node.mode)) {
                    flags &= ~512
                }
                var err = FS.mayOpen(node, flags);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (flags & 512) {
                    FS.truncate(node, 0)
                }
                flags &= ~(128 | 512);
                var stream = FS.createStream({
                    node: node,
                    path: FS.getPath(node),
                    flags: flags,
                    seekable: true,
                    position: 0,
                    stream_ops: node.stream_ops,
                    ungotten: [],
                    error: false
                }, fd_start, fd_end);
                if (stream.stream_ops.open) {
                    stream.stream_ops.open(stream)
                }
                if (Module["logReadFiles"] && !(flags & 1)) {
                    if (!FS.readFiles) FS.readFiles = {};
                    if (!(path in FS.readFiles)) {
                        FS.readFiles[path] = 1;
                        Module["printErr"]("read file: " + path)
                    }
                }
                try {
                    if (FS.trackingDelegate["onOpenFile"]) {
                        var trackingFlags = 0;
                        if ((flags & 2097155) !== 1) {
                            trackingFlags |= FS.tracking.openFlags.READ
                        }
                        if ((flags & 2097155) !== 0) {
                            trackingFlags |= FS.tracking.openFlags.WRITE
                        }
                        FS.trackingDelegate["onOpenFile"](path, trackingFlags)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message)
                }
                return stream
            }),
            close: (function (stream) {
                try {
                    if (stream.stream_ops.close) {
                        stream.stream_ops.close(stream)
                    }
                } catch (e) {
                    throw e
                } finally {
                    FS.closeStream(stream.fd)
                }
            }),
            llseek: (function (stream, offset, whence) {
                if (!stream.seekable || !stream.stream_ops.llseek) {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                }
                return stream.stream_ops.llseek(stream, offset, whence)
            }),
            read: (function (stream, buffer, offset, length, position) {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
                }
                if (!stream.stream_ops.read) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var seeking = true;
                if (typeof position === "undefined") {
                    position = stream.position;
                    seeking = false
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                }
                var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
                if (!seeking) stream.position += bytesRead;
                return bytesRead
            }),
            write: (function (stream, buffer, offset, length, position, canOwn) {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
                }
                if (!stream.stream_ops.write) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if (stream.flags & 1024) {
                    FS.llseek(stream, 0, 2)
                }
                var seeking = true;
                if (typeof position === "undefined") {
                    position = stream.position;
                    seeking = false
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                }
                var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
                if (!seeking) stream.position += bytesWritten;
                try {
                    if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + e.message)
                }
                return bytesWritten
            }),
            allocate: (function (stream, offset, length) {
                if (offset < 0 || length <= 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                }
                if (!stream.stream_ops.allocate) {
                    throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)
                }
                stream.stream_ops.allocate(stream, offset, length)
            }),
            mmap: (function (stream, buffer, offset, length, position, prot, flags) {
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(ERRNO_CODES.EACCES)
                }
                if (!stream.stream_ops.mmap) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                }
                return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags)
            }),
            ioctl: (function (stream, cmd, arg) {
                if (!stream.stream_ops.ioctl) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTTY)
                }
                return stream.stream_ops.ioctl(stream, cmd, arg)
            }),
            readFile: (function (path, opts) {
                opts = opts || {};
                opts.flags = opts.flags || "r";
                opts.encoding = opts.encoding || "binary";
                if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                    throw new Error('Invalid encoding type "' + opts.encoding + '"')
                }
                var ret;
                var stream = FS.open(path, opts.flags);
                var stat = FS.stat(path);
                var length = stat.size;
                var buf = new Uint8Array(length);
                FS.read(stream, buf, 0, length, 0);
                if (opts.encoding === "utf8") {
                    ret = "";
                    var utf8 = new Runtime.UTF8Processor;
                    for (var i = 0; i < length; i++) {
                        ret += utf8.processCChar(buf[i])
                    }
                } else if (opts.encoding === "binary") {
                    ret = buf
                }
                FS.close(stream);
                return ret
            }),
            writeFile: (function (path, data, opts) {
                opts = opts || {};
                opts.flags = opts.flags || "w";
                opts.encoding = opts.encoding || "utf8";
                if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                    throw new Error('Invalid encoding type "' + opts.encoding + '"')
                }
                var stream = FS.open(path, opts.flags, opts.mode);
                if (opts.encoding === "utf8") {
                    var utf8 = new Runtime.UTF8Processor;
                    var buf = new Uint8Array(utf8.processJSString(data));
                    FS.write(stream, buf, 0, buf.length, 0, opts.canOwn)
                } else if (opts.encoding === "binary") {
                    FS.write(stream, data, 0, data.length, 0, opts.canOwn)
                }
                FS.close(stream)
            }),
            cwd: (function () {
                return FS.currentPath
            }),
            chdir: (function (path) {
                var lookup = FS.lookupPath(path, {follow: true});
                if (!FS.isDir(lookup.node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                }
                var err = FS.nodePermissions(lookup.node, "x");
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                FS.currentPath = lookup.path
            }),
            createDefaultDirectories: (function () {
                FS.mkdir("/tmp")
            }),
            createDefaultDevices: (function () {
                FS.mkdir("/dev");
                FS.registerDevice(FS.makedev(1, 3), {
                    read: (function () {
                        return 0
                    }), write: (function () {
                        return 0
                    })
                });
                FS.mkdev("/dev/null", FS.makedev(1, 3));
                TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
                TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
                FS.mkdev("/dev/tty", FS.makedev(5, 0));
                FS.mkdev("/dev/tty1", FS.makedev(6, 0));
                var random_device;
                if (typeof crypto !== "undefined") {
                    var randomBuffer = new Uint8Array(1);
                    random_device = (function () {
                        crypto.getRandomValues(randomBuffer);
                        return randomBuffer[0]
                    })
                } else if (ENVIRONMENT_IS_NODE) {
                    random_device = (function () {
                        return require("crypto").randomBytes(1)[0]
                    })
                } else {
                    random_device = (function () {
                        return Math.floor(Math.random() * 256)
                    })
                }
                FS.createDevice("/dev", "random", random_device);
                FS.createDevice("/dev", "urandom", random_device);
                FS.mkdir("/dev/shm");
                FS.mkdir("/dev/shm/tmp")
            }),
            createStandardStreams: (function () {
                if (Module["stdin"]) {
                    FS.createDevice("/dev", "stdin", Module["stdin"])
                } else {
                    FS.symlink("/dev/tty", "/dev/stdin")
                }
                if (Module["stdout"]) {
                    FS.createDevice("/dev", "stdout", null, Module["stdout"])
                } else {
                    FS.symlink("/dev/tty", "/dev/stdout")
                }
                if (Module["stderr"]) {
                    FS.createDevice("/dev", "stderr", null, Module["stderr"])
                } else {
                    FS.symlink("/dev/tty1", "/dev/stderr")
                }
                var stdin = FS.open("/dev/stdin", "r");
                HEAP32[_stdin >> 2] = FS.getPtrForStream(stdin);
                assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
                var stdout = FS.open("/dev/stdout", "w");
                HEAP32[_stdout >> 2] = FS.getPtrForStream(stdout);
                assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
                var stderr = FS.open("/dev/stderr", "w");
                HEAP32[_stderr >> 2] = FS.getPtrForStream(stderr);
                assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")")
            }),
            ensureErrnoError: (function () {
                if (FS.ErrnoError) return;
                FS.ErrnoError = function ErrnoError(errno) {
                    this.errno = errno;
                    for (var key in ERRNO_CODES) {
                        if (ERRNO_CODES[key] === errno) {
                            this.code = key;
                            break
                        }
                    }
                    this.message = ERRNO_MESSAGES[errno]
                };
                FS.ErrnoError.prototype = new Error;
                FS.ErrnoError.prototype.constructor = FS.ErrnoError;
                [ERRNO_CODES.ENOENT].forEach((function (code) {
                    FS.genericErrors[code] = new FS.ErrnoError(code);
                    FS.genericErrors[code].stack = "<generic error, no stack>"
                }))
            }),
            staticInit: (function () {
                FS.ensureErrnoError();
                FS.nameTable = new Array(4096);
                FS.mount(MEMFS, {}, "/");
                FS.createDefaultDirectories();
                FS.createDefaultDevices()
            }),
            init: (function (input, output, error) {
                assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
                FS.init.initialized = true;
                FS.ensureErrnoError();
                Module["stdin"] = input || Module["stdin"];
                Module["stdout"] = output || Module["stdout"];
                Module["stderr"] = error || Module["stderr"];
                FS.createStandardStreams()
            }),
            quit: (function () {
                FS.init.initialized = false;
                for (var i = 0; i < FS.streams.length; i++) {
                    var stream = FS.streams[i];
                    if (!stream) {
                        continue
                    }
                    FS.close(stream)
                }
            }),
            getMode: (function (canRead, canWrite) {
                var mode = 0;
                if (canRead) mode |= 292 | 73;
                if (canWrite) mode |= 146;
                return mode
            }),
            joinPath: (function (parts, forceRelative) {
                var path = PATH.join.apply(null, parts);
                if (forceRelative && path[0] == "/") path = path.substr(1);
                return path
            }),
            absolutePath: (function (relative, base) {
                return PATH.resolve(base, relative)
            }),
            standardizePath: (function (path) {
                return PATH.normalize(path)
            }),
            findObject: (function (path, dontResolveLastLink) {
                var ret = FS.analyzePath(path, dontResolveLastLink);
                if (ret.exists) {
                    return ret.object
                } else {
                    ___setErrNo(ret.error);
                    return null
                }
            }),
            analyzePath: (function (path, dontResolveLastLink) {
                try {
                    var lookup = FS.lookupPath(path, {follow: !dontResolveLastLink});
                    path = lookup.path
                } catch (e) {
                }
                var ret = {
                    isRoot: false,
                    exists: false,
                    error: 0,
                    name: null,
                    path: null,
                    object: null,
                    parentExists: false,
                    parentPath: null,
                    parentObject: null
                };
                try {
                    var lookup = FS.lookupPath(path, {parent: true});
                    ret.parentExists = true;
                    ret.parentPath = lookup.path;
                    ret.parentObject = lookup.node;
                    ret.name = PATH.basename(path);
                    lookup = FS.lookupPath(path, {follow: !dontResolveLastLink});
                    ret.exists = true;
                    ret.path = lookup.path;
                    ret.object = lookup.node;
                    ret.name = lookup.node.name;
                    ret.isRoot = lookup.path === "/"
                } catch (e) {
                    ret.error = e.errno
                }
                return ret
            }),
            createFolder: (function (parent, name, canRead, canWrite) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                var mode = FS.getMode(canRead, canWrite);
                return FS.mkdir(path, mode)
            }),
            createPath: (function (parent, path, canRead, canWrite) {
                parent = typeof parent === "string" ? parent : FS.getPath(parent);
                var parts = path.split("/").reverse();
                while (parts.length) {
                    var part = parts.pop();
                    if (!part) continue;
                    var current = PATH.join2(parent, part);
                    try {
                        FS.mkdir(current)
                    } catch (e) {
                    }
                    parent = current
                }
                return current
            }),
            createFile: (function (parent, name, properties, canRead, canWrite) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                var mode = FS.getMode(canRead, canWrite);
                return FS.create(path, mode)
            }),
            createDataFile: (function (parent, name, data, canRead, canWrite, canOwn) {
                var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
                var mode = FS.getMode(canRead, canWrite);
                var node = FS.create(path, mode);
                if (data) {
                    if (typeof data === "string") {
                        var arr = new Array(data.length);
                        for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
                        data = arr
                    }
                    FS.chmod(node, mode | 146);
                    var stream = FS.open(node, "w");
                    FS.write(stream, data, 0, data.length, 0, canOwn);
                    FS.close(stream);
                    FS.chmod(node, mode)
                }
                return node
            }),
            createDevice: (function (parent, name, input, output) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                var mode = FS.getMode(!!input, !!output);
                if (!FS.createDevice.major) FS.createDevice.major = 64;
                var dev = FS.makedev(FS.createDevice.major++, 0);
                FS.registerDevice(dev, {
                    open: (function (stream) {
                        stream.seekable = false
                    }), close: (function (stream) {
                        if (output && output.buffer && output.buffer.length) {
                            output(10)
                        }
                    }), read: (function (stream, buffer, offset, length, pos) {
                        var bytesRead = 0;
                        for (var i = 0; i < length; i++) {
                            var result;
                            try {
                                result = input()
                            } catch (e) {
                                throw new FS.ErrnoError(ERRNO_CODES.EIO)
                            }
                            if (result === undefined && bytesRead === 0) {
                                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                            }
                            if (result === null || result === undefined) break;
                            bytesRead++;
                            buffer[offset + i] = result
                        }
                        if (bytesRead) {
                            stream.node.timestamp = Date.now()
                        }
                        return bytesRead
                    }), write: (function (stream, buffer, offset, length, pos) {
                        for (var i = 0; i < length; i++) {
                            try {
                                output(buffer[offset + i])
                            } catch (e) {
                                throw new FS.ErrnoError(ERRNO_CODES.EIO)
                            }
                        }
                        if (length) {
                            stream.node.timestamp = Date.now()
                        }
                        return i
                    })
                });
                return FS.mkdev(path, mode, dev)
            }),
            createLink: (function (parent, name, target, canRead, canWrite) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                return FS.symlink(target, path)
            }),
            forceLoadFile: (function (obj) {
                if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
                var success = true;
                if (typeof XMLHttpRequest !== "undefined") {
                    throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
                } else if (Module["read"]) {
                    try {
                        obj.contents = intArrayFromString(Module["read"](obj.url), true);
                        obj.usedBytes = obj.contents.length
                    } catch (e) {
                        success = false
                    }
                } else {
                    throw new Error("Cannot load without read() or XMLHttpRequest.")
                }
                if (!success) ___setErrNo(ERRNO_CODES.EIO);
                return success
            }),
            createLazyFile: (function (parent, name, url, canRead, canWrite) {
                function LazyUint8Array() {
                    this.lengthKnown = false;
                    this.chunks = []
                }
                LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
                    if (idx > this.length - 1 || idx < 0) {
                        return undefined
                    }
                    var chunkOffset = idx % this.chunkSize;
                    var chunkNum = Math.floor(idx / this.chunkSize);
                    return this.getter(chunkNum)[chunkOffset]
                };
                LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
                    this.getter = getter
                };
                LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
                    var xhr = new XMLHttpRequest;
                    xhr.open("HEAD", url, false);
                    xhr.send(null);
                    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                    var datalength = Number(xhr.getResponseHeader("Content-length"));
                    var header;
                    var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                    var chunkSize = 1024 * 1024;
                    if (!hasByteServing) chunkSize = datalength;
                    var doXHR = (function (from, to) {
                        if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                        if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
                        var xhr = new XMLHttpRequest;
                        xhr.open("GET", url, false);
                        if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                        if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
                        if (xhr.overrideMimeType) {
                            xhr.overrideMimeType("text/plain; charset=x-user-defined")
                        }
                        xhr.send(null);
                        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                        if (xhr.response !== undefined) {
                            return new Uint8Array(xhr.response || [])
                        } else {
                            return intArrayFromString(xhr.responseText || "", true)
                        }
                    });
                    var lazyArray = this;
                    lazyArray.setDataGetter((function (chunkNum) {
                        var start = chunkNum * chunkSize;
                        var end = (chunkNum + 1) * chunkSize - 1;
                        end = Math.min(end, datalength - 1);
                        if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                            lazyArray.chunks[chunkNum] = doXHR(start, end)
                        }
                        if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
                        return lazyArray.chunks[chunkNum]
                    }));
                    this._length = datalength;
                    this._chunkSize = chunkSize;
                    this.lengthKnown = true
                };
                if (typeof XMLHttpRequest !== "undefined") {
                    if (!ENVIRONMENT_IS_WORKER) throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                    var lazyArray = new LazyUint8Array;
                    Object.defineProperty(lazyArray, "length", {
                        get: (function () {
                            if (!this.lengthKnown) {
                                this.cacheLength()
                            }
                            return this._length
                        })
                    });
                    Object.defineProperty(lazyArray, "chunkSize", {
                        get: (function () {
                            if (!this.lengthKnown) {
                                this.cacheLength()
                            }
                            return this._chunkSize
                        })
                    });
                    var properties = {isDevice: false, contents: lazyArray}
                } else {
                    var properties = {isDevice: false, url: url}
                }
                var node = FS.createFile(parent, name, properties, canRead, canWrite);
                if (properties.contents) {
                    node.contents = properties.contents
                } else if (properties.url) {
                    node.contents = null;
                    node.url = properties.url
                }
                Object.defineProperty(node, "usedBytes", {
                    get: (function () {
                        return this.contents.length
                    })
                });
                var stream_ops = {};
                var keys = Object.keys(node.stream_ops);
                keys.forEach((function (key) {
                    var fn = node.stream_ops[key];
                    stream_ops[key] = function forceLoadLazyFile() {
                        if (!FS.forceLoadFile(node)) {
                            throw new FS.ErrnoError(ERRNO_CODES.EIO)
                        }
                        return fn.apply(null, arguments)
                    }
                }));
                stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
                    if (!FS.forceLoadFile(node)) {
                        throw new FS.ErrnoError(ERRNO_CODES.EIO)
                    }
                    var contents = stream.node.contents;
                    if (position >= contents.length) return 0;
                    var size = Math.min(contents.length - position, length);
                    assert(size >= 0);
                    if (contents.slice) {
                        for (var i = 0; i < size; i++) {
                            buffer[offset + i] = contents[position + i]
                        }
                    } else {
                        for (var i = 0; i < size; i++) {
                            buffer[offset + i] = contents.get(position + i)
                        }
                    }
                    return size
                };
                node.stream_ops = stream_ops;
                return node
            }),
            createPreloadedFile: (function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
                Browser.init();
                var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
                function processData(byteArray) {
                    function finish(byteArray) {
                        if (!dontCreateFile) {
                            FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
                        }
                        if (onload) onload();
                        removeRunDependency("cp " + fullname)
                    }
                    var handled = false;
                    Module["preloadPlugins"].forEach((function (plugin) {
                        if (handled) return;
                        if (plugin["canHandle"](fullname)) {
                            plugin["handle"](byteArray, fullname, finish, (function () {
                                if (onerror) onerror();
                                removeRunDependency("cp " + fullname)
                            }));
                            handled = true
                        }
                    }));
                    if (!handled) finish(byteArray)
                }
                addRunDependency("cp " + fullname);
                if (typeof url == "string") {
                    Browser.asyncLoad(url, (function (byteArray) {
                        processData(byteArray)
                    }), onerror)
                } else {
                    processData(url)
                }
            }),
            indexedDB: (function () {
                return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
            }),
            DB_NAME: (function () {
                return "EM_FS_" + window.location.pathname
            }),
            DB_VERSION: 20,
            DB_STORE_NAME: "FILE_DATA",
            saveFilesToDB: (function (paths, onload, onerror) {
                onload = onload || (function () {
                });
                onerror = onerror || (function () {
                });
                var indexedDB = FS.indexedDB();
                try {
                    var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
                } catch (e) {
                    return onerror(e)
                }
                openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
                    console.log("creating db");
                    var db = openRequest.result;
                    db.createObjectStore(FS.DB_STORE_NAME)
                };
                openRequest.onsuccess = function openRequest_onsuccess() {
                    var db = openRequest.result;
                    var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
                    var files = transaction.objectStore(FS.DB_STORE_NAME);
                    var ok = 0, fail = 0, total = paths.length;
                    function finish() {
                        if (fail == 0) onload(); else onerror()
                    }
                    paths.forEach((function (path) {
                        var putRequest = files.put(FS.analyzePath(path).object.contents, path);
                        putRequest.onsuccess = function putRequest_onsuccess() {
                            ok++;
                            if (ok + fail == total) finish()
                        };
                        putRequest.onerror = function putRequest_onerror() {
                            fail++;
                            if (ok + fail == total) finish()
                        }
                    }));
                    transaction.onerror = onerror
                };
                openRequest.onerror = onerror
            }),
            loadFilesFromDB: (function (paths, onload, onerror) {
                onload = onload || (function () {
                });
                onerror = onerror || (function () {
                });
                var indexedDB = FS.indexedDB();
                try {
                    var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
                } catch (e) {
                    return onerror(e)
                }
                openRequest.onupgradeneeded = onerror;
                openRequest.onsuccess = function openRequest_onsuccess() {
                    var db = openRequest.result;
                    try {
                        var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
                    } catch (e) {
                        onerror(e);
                        return
                    }
                    var files = transaction.objectStore(FS.DB_STORE_NAME);
                    var ok = 0, fail = 0, total = paths.length;
                    function finish() {
                        if (fail == 0) onload(); else onerror()
                    }
                    paths.forEach((function (path) {
                        var getRequest = files.get(path);
                        getRequest.onsuccess = function getRequest_onsuccess() {
                            if (FS.analyzePath(path).exists) {
                                FS.unlink(path)
                            }
                            FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                            ok++;
                            if (ok + fail == total) finish()
                        };
                        getRequest.onerror = function getRequest_onerror() {
                            fail++;
                            if (ok + fail == total) finish()
                        }
                    }));
                    transaction.onerror = onerror
                };
                openRequest.onerror = onerror
            })
        };
        var PATH = {
            splitPath: (function (filename) {
                var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                return splitPathRe.exec(filename).slice(1)
            }), normalizeArray: (function (parts, allowAboveRoot) {
                var up = 0;
                for (var i = parts.length - 1; i >= 0; i--) {
                    var last = parts[i];
                    if (last === ".") {
                        parts.splice(i, 1)
                    } else if (last === "..") {
                        parts.splice(i, 1);
                        up++
                    } else if (up) {
                        parts.splice(i, 1);
                        up--
                    }
                }
                if (allowAboveRoot) {
                    for (; up--; up) {
                        parts.unshift("..")
                    }
                }
                return parts
            }), normalize: (function (path) {
                var isAbsolute = path.charAt(0) === "/", trailingSlash = path.substr(-1) === "/";
                path = PATH.normalizeArray(path.split("/").filter((function (p) {
                    return !!p
                })), !isAbsolute).join("/");
                if (!path && !isAbsolute) {
                    path = "."
                }
                if (path && trailingSlash) {
                    path += "/"
                }
                return (isAbsolute ? "/" : "") + path
            }), dirname: (function (path) {
                var result = PATH.splitPath(path), root = result[0], dir = result[1];
                if (!root && !dir) {
                    return "."
                }
                if (dir) {
                    dir = dir.substr(0, dir.length - 1)
                }
                return root + dir
            }), basename: (function (path) {
                if (path === "/") return "/";
                var lastSlash = path.lastIndexOf("/");
                if (lastSlash === -1) return path;
                return path.substr(lastSlash + 1)
            }), extname: (function (path) {
                return PATH.splitPath(path)[3]
            }), join: (function () {
                var paths = Array.prototype.slice.call(arguments, 0);
                return PATH.normalize(paths.join("/"))
            }), join2: (function (l, r) {
                return PATH.normalize(l + "/" + r)
            }), resolve: (function () {
                var resolvedPath = "", resolvedAbsolute = false;
                for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                    var path = i >= 0 ? arguments[i] : FS.cwd();
                    if (typeof path !== "string") {
                        throw new TypeError("Arguments to path.resolve must be strings")
                    } else if (!path) {
                        continue
                    }
                    resolvedPath = path + "/" + resolvedPath;
                    resolvedAbsolute = path.charAt(0) === "/"
                }
                resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((function (p) {
                    return !!p
                })), !resolvedAbsolute).join("/");
                return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
            }), relative: (function (from, to) {
                from = PATH.resolve(from).substr(1);
                to = PATH.resolve(to).substr(1);
                function trim(arr) {
                    var start = 0;
                    for (; start < arr.length; start++) {
                        if (arr[start] !== "") break
                    }
                    var end = arr.length - 1;
                    for (; end >= 0; end--) {
                        if (arr[end] !== "") break
                    }
                    if (start > end) return [];
                    return arr.slice(start, end - start + 1)
                }
                var fromParts = trim(from.split("/"));
                var toParts = trim(to.split("/"));
                var length = Math.min(fromParts.length, toParts.length);
                var samePartsLength = length;
                for (var i = 0; i < length; i++) {
                    if (fromParts[i] !== toParts[i]) {
                        samePartsLength = i;
                        break
                    }
                }
                var outputParts = [];
                for (var i = samePartsLength; i < fromParts.length; i++) {
                    outputParts.push("..")
                }
                outputParts = outputParts.concat(toParts.slice(samePartsLength));
                return outputParts.join("/")
            })
        };
        var Browser = {
            mainLoop: {
                scheduler: null,
                method: "",
                shouldPause: false,
                paused: false,
                queue: [],
                pause: (function () {
                    Browser.mainLoop.shouldPause = true
                }),
                resume: (function () {
                    if (Browser.mainLoop.paused) {
                        Browser.mainLoop.paused = false;
                        Browser.mainLoop.scheduler()
                    }
                    Browser.mainLoop.shouldPause = false
                }),
                updateStatus: (function () {
                    if (Module["setStatus"]) {
                        var message = Module["statusMessage"] || "Please wait...";
                        var remaining = Browser.mainLoop.remainingBlockers;
                        var expected = Browser.mainLoop.expectedBlockers;
                        if (remaining) {
                            if (remaining < expected) {
                                Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")")
                            } else {
                                Module["setStatus"](message)
                            }
                        } else {
                            Module["setStatus"]("")
                        }
                    }
                }),
                runIter: (function (func) {
                    if (ABORT) return;
                    if (Module["preMainLoop"]) {
                        var preRet = Module["preMainLoop"]();
                        if (preRet === false) {
                            return
                        }
                    }
                    try {
                        func()
                    } catch (e) {
                        if (e instanceof ExitStatus) {
                            return
                        } else {
                            if (e && typeof e === "object" && e.stack) Module.printErr("exception thrown: " + [e, e.stack]);
                            throw e
                        }
                    }
                    if (Module["postMainLoop"]) Module["postMainLoop"]()
                })
            },
            isFullScreen: false,
            pointerLock: false,
            moduleContextCreatedCallbacks: [],
            workers: [],
            init: (function () {
                if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
                if (Browser.initted) return;
                Browser.initted = true;
                try {
                    new Blob;
                    Browser.hasBlobConstructor = true
                } catch (e) {
                    Browser.hasBlobConstructor = false;
                    console.log("warning: no blob constructor, cannot create blobs with mimetypes")
                }
                Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null;
                Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL : undefined;
                if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
                    console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
                    Module.noImageDecoding = true
                }
                var imagePlugin = {};
                imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
                    return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name)
                };
                imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
                    var b = null;
                    if (Browser.hasBlobConstructor) {
                        try {
                            b = new Blob([byteArray], {type: Browser.getMimetype(name)});
                            if (b.size !== byteArray.length) {
                                b = new Blob([(new Uint8Array(byteArray)).buffer], {type: Browser.getMimetype(name)})
                            }
                        } catch (e) {
                            Runtime.warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder")
                        }
                    }
                    if (!b) {
                        var bb = new Browser.BlobBuilder;
                        bb.append((new Uint8Array(byteArray)).buffer);
                        b = bb.getBlob()
                    }
                    var url = Browser.URLObject.createObjectURL(b);
                    var img = new Image;
                    img.onload = function img_onload() {
                        assert(img.complete, "Image " + name + " could not be decoded");
                        var canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        Module["preloadedImages"][name] = canvas;
                        Browser.URLObject.revokeObjectURL(url);
                        if (onload) onload(byteArray)
                    };
                    img.onerror = function img_onerror(event) {
                        console.log("Image " + url + " could not be decoded");
                        if (onerror) onerror()
                    };
                    img.src = url
                };
                Module["preloadPlugins"].push(imagePlugin);
                var audioPlugin = {};
                audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
                    return !Module.noAudioDecoding && name.substr(-4) in {".ogg": 1, ".wav": 1, ".mp3": 1}
                };
                audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
                    var done = false;
                    function finish(audio) {
                        if (done) return;
                        done = true;
                        Module["preloadedAudios"][name] = audio;
                        if (onload) onload(byteArray)
                    }
                    function fail() {
                        if (done) return;
                        done = true;
                        Module["preloadedAudios"][name] = new Audio;
                        if (onerror) onerror()
                    }
                    if (Browser.hasBlobConstructor) {
                        try {
                            var b = new Blob([byteArray], {type: Browser.getMimetype(name)})
                        } catch (e) {
                            return fail()
                        }
                        var url = Browser.URLObject.createObjectURL(b);
                        var audio = new Audio;
                        audio.addEventListener("canplaythrough", (function () {
                            finish(audio)
                        }), false);
                        audio.onerror = function audio_onerror(event) {
                            if (done) return;
                            console.log("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");
                            function encode64(data) {
                                var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                                var PAD = "=";
                                var ret = "";
                                var leftchar = 0;
                                var leftbits = 0;
                                for (var i = 0; i < data.length; i++) {
                                    leftchar = leftchar << 8 | data[i];
                                    leftbits += 8;
                                    while (leftbits >= 6) {
                                        var curr = leftchar >> leftbits - 6 & 63;
                                        leftbits -= 6;
                                        ret += BASE[curr]
                                    }
                                }
                                if (leftbits == 2) {
                                    ret += BASE[(leftchar & 3) << 4];
                                    ret += PAD + PAD
                                } else if (leftbits == 4) {
                                    ret += BASE[(leftchar & 15) << 2];
                                    ret += PAD
                                }
                                return ret
                            }
                            audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
                            finish(audio)
                        };
                        audio.src = url;
                        Browser.safeSetTimeout((function () {
                            finish(audio)
                        }), 1e4)
                    } else {
                        return fail()
                    }
                };
                Module["preloadPlugins"].push(audioPlugin);
                var canvas = Module["canvas"];
                function pointerLockChange() {
                    Browser.pointerLock = document["pointerLockElement"] === canvas || document["mozPointerLockElement"] === canvas || document["webkitPointerLockElement"] === canvas || document["msPointerLockElement"] === canvas
                }
                if (canvas) {
                    canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (function () {
                    });
                    canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || (function () {
                    });
                    canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
                    document.addEventListener("pointerlockchange", pointerLockChange, false);
                    document.addEventListener("mozpointerlockchange", pointerLockChange, false);
                    document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
                    document.addEventListener("mspointerlockchange", pointerLockChange, false);
                    if (Module["elementPointerLock"]) {
                        canvas.addEventListener("click", (function (ev) {
                            if (!Browser.pointerLock && canvas.requestPointerLock) {
                                canvas.requestPointerLock();
                                ev.preventDefault()
                            }
                        }), false)
                    }
                }
            }),
            createContext: (function (canvas, useWebGL, setInModule, webGLContextAttributes) {
                if (useWebGL && Module.ctx) return Module.ctx;
                var ctx;
                var errorInfo = "?";
                function onContextCreationError(event) {
                    errorInfo = event.statusMessage || errorInfo
                }
                try {
                    if (useWebGL) {
                        var contextAttributes = {antialias: false, alpha: false};
                        if (webGLContextAttributes) {
                            for (var attribute in webGLContextAttributes) {
                                contextAttributes[attribute] = webGLContextAttributes[attribute]
                            }
                        }
                        canvas.addEventListener("webglcontextcreationerror", onContextCreationError, false);
                        try {
                            ["experimental-webgl", "webgl"].some((function (webglId) {
                                return ctx = canvas.getContext(webglId, contextAttributes)
                            }))
                        } finally {
                            canvas.removeEventListener("webglcontextcreationerror", onContextCreationError, false)
                        }
                    } else {
                        ctx = canvas.getContext("2d")
                    }
                    if (!ctx) throw":("
                } catch (e) {
                    Module.print("Could not create canvas: " + [errorInfo, e]);
                    return null
                }
                if (useWebGL) {
                    canvas.style.backgroundColor = "black"
                }
                if (setInModule) {
                    if (!useWebGL) assert(typeof GLctx === "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
                    Module.ctx = ctx;
                    if (useWebGL) GLctx = ctx;
                    Module.useWebGL = useWebGL;
                    Browser.moduleContextCreatedCallbacks.forEach((function (callback) {
                        callback()
                    }));
                    Browser.init()
                }
                return ctx
            }),
            destroyContext: (function (canvas, useWebGL, setInModule) {
            }),
            fullScreenHandlersInstalled: false,
            lockPointer: undefined,
            resizeCanvas: undefined,
            requestFullScreen: (function (lockPointer, resizeCanvas) {
                Browser.lockPointer = lockPointer;
                Browser.resizeCanvas = resizeCanvas;
                if (typeof Browser.lockPointer === "undefined") Browser.lockPointer = true;
                if (typeof Browser.resizeCanvas === "undefined") Browser.resizeCanvas = false;
                var canvas = Module["canvas"];
                function fullScreenChange() {
                    Browser.isFullScreen = false;
                    var canvasContainer = canvas.parentNode;
                    if ((document["webkitFullScreenElement"] || document["webkitFullscreenElement"] || document["mozFullScreenElement"] || document["mozFullscreenElement"] || document["fullScreenElement"] || document["fullscreenElement"] || document["msFullScreenElement"] || document["msFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
                        canvas.cancelFullScreen = document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["webkitCancelFullScreen"] || document["msExitFullscreen"] || document["exitFullscreen"] || (function () {
                        });
                        canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
                        if (Browser.lockPointer) canvas.requestPointerLock();
                        Browser.isFullScreen = true;
                        if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize()
                    } else {
                        canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                        canvasContainer.parentNode.removeChild(canvasContainer);
                        if (Browser.resizeCanvas) Browser.setWindowedCanvasSize()
                    }
                    if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullScreen);
                    Browser.updateCanvasDimensions(canvas)
                }
                if (!Browser.fullScreenHandlersInstalled) {
                    Browser.fullScreenHandlersInstalled = true;
                    document.addEventListener("fullscreenchange", fullScreenChange, false);
                    document.addEventListener("mozfullscreenchange", fullScreenChange, false);
                    document.addEventListener("webkitfullscreenchange", fullScreenChange, false);
                    document.addEventListener("MSFullscreenChange", fullScreenChange, false)
                }
                var canvasContainer = document.createElement("div");
                canvas.parentNode.insertBefore(canvasContainer, canvas);
                canvasContainer.appendChild(canvas);
                canvasContainer.requestFullScreen = canvasContainer["requestFullScreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullScreen"] ? (function () {
                    canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])
                }) : null);
                canvasContainer.requestFullScreen()
            }),
            nextRAF: 0,
            fakeRequestAnimationFrame: (function (func) {
                var now = Date.now();
                if (Browser.nextRAF === 0) {
                    Browser.nextRAF = now + 1e3 / 60
                } else {
                    while (now + 2 >= Browser.nextRAF) {
                        Browser.nextRAF += 1e3 / 60
                    }
                }
                var delay = Math.max(Browser.nextRAF - now, 0);
                setTimeout(func, delay)
            }),
            requestAnimationFrame: function requestAnimationFrame(func) {
                if (typeof window === "undefined") {
                    Browser.fakeRequestAnimationFrame(func)
                } else {
                    if (!window.requestAnimationFrame) {
                        window.requestAnimationFrame = window["requestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"] || Browser.fakeRequestAnimationFrame
                    }
                    window.requestAnimationFrame(func)
                }
            },
            safeCallback: (function (func) {
                return (function () {
                    if (!ABORT) return func.apply(null, arguments)
                })
            }),
            safeRequestAnimationFrame: (function (func) {
                return Browser.requestAnimationFrame((function () {
                    if (!ABORT) func()
                }))
            }),
            safeSetTimeout: (function (func, timeout) {
                Module["noExitRuntime"] = true;
                return setTimeout((function () {
                    if (!ABORT) func()
                }), timeout)
            }),
            safeSetInterval: (function (func, timeout) {
                Module["noExitRuntime"] = true;
                return setInterval((function () {
                    if (!ABORT) func()
                }), timeout)
            }),
            getMimetype: (function (name) {
                return {
                    "jpg": "image/jpeg",
                    "jpeg": "image/jpeg",
                    "png": "image/png",
                    "bmp": "image/bmp",
                    "ogg": "audio/ogg",
                    "wav": "audio/wav",
                    "mp3": "audio/mpeg"
                }[name.substr(name.lastIndexOf(".") + 1)]
            }),
            getUserMedia: (function (func) {
                if (!window.getUserMedia) {
                    window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"]
                }
                window.getUserMedia(func)
            }),
            getMovementX: (function (event) {
                return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0
            }),
            getMovementY: (function (event) {
                return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0
            }),
            getMouseWheelDelta: (function (event) {
                var delta = 0;
                switch (event.type) {
                    case"DOMMouseScroll":
                        delta = event.detail;
                        break;
                    case"mousewheel":
                        delta = -event.wheelDelta;
                        break;
                    case"wheel":
                        delta = event.deltaY;
                        break;
                    default:
                        throw"unrecognized mouse wheel event: " + event.type
                }
                return Math.max(-1, Math.min(1, delta))
            }),
            mouseX: 0,
            mouseY: 0,
            mouseMovementX: 0,
            mouseMovementY: 0,
            touches: {},
            lastTouches: {},
            calculateMouseEvent: (function (event) {
                if (Browser.pointerLock) {
                    if (event.type != "mousemove" && "mozMovementX" in event) {
                        Browser.mouseMovementX = Browser.mouseMovementY = 0
                    } else {
                        Browser.mouseMovementX = Browser.getMovementX(event);
                        Browser.mouseMovementY = Browser.getMovementY(event)
                    }
                    if (typeof SDL != "undefined") {
                        Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
                        Browser.mouseY = SDL.mouseY + Browser.mouseMovementY
                    } else {
                        Browser.mouseX += Browser.mouseMovementX;
                        Browser.mouseY += Browser.mouseMovementY
                    }
                } else {
                    var rect = Module["canvas"].getBoundingClientRect();
                    var cw = Module["canvas"].width;
                    var ch = Module["canvas"].height;
                    var scrollX = typeof window.scrollX !== "undefined" ? window.scrollX : window.pageXOffset;
                    var scrollY = typeof window.scrollY !== "undefined" ? window.scrollY : window.pageYOffset;
                    if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                        var touch = event.touch;
                        if (touch === undefined) {
                            return
                        }
                        var adjustedX = touch.pageX - (scrollX + rect.left);
                        var adjustedY = touch.pageY - (scrollY + rect.top);
                        adjustedX = adjustedX * (cw / rect.width);
                        adjustedY = adjustedY * (ch / rect.height);
                        var coords = {x: adjustedX, y: adjustedY};
                        if (event.type === "touchstart") {
                            Browser.lastTouches[touch.identifier] = coords;
                            Browser.touches[touch.identifier] = coords
                        } else if (event.type === "touchend" || event.type === "touchmove") {
                            Browser.lastTouches[touch.identifier] = Browser.touches[touch.identifier];
                            Browser.touches[touch.identifier] = {x: adjustedX, y: adjustedY}
                        }
                        return
                    }
                    var x = event.pageX - (scrollX + rect.left);
                    var y = event.pageY - (scrollY + rect.top);
                    x = x * (cw / rect.width);
                    y = y * (ch / rect.height);
                    Browser.mouseMovementX = x - Browser.mouseX;
                    Browser.mouseMovementY = y - Browser.mouseY;
                    Browser.mouseX = x;
                    Browser.mouseY = y
                }
            }),
            xhrLoad: (function (url, onload, onerror) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = function xhr_onload() {
                    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                        onload(xhr.response)
                    } else {
                        onerror()
                    }
                };
                xhr.onerror = onerror;
                xhr.send(null)
            }),
            asyncLoad: (function (url, onload, onerror, noRunDep) {
                Browser.xhrLoad(url, (function (arrayBuffer) {
                    assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
                    onload(new Uint8Array(arrayBuffer));
                    if (!noRunDep) removeRunDependency("al " + url)
                }), (function (event) {
                    if (onerror) {
                        onerror()
                    } else {
                        throw'Loading data file "' + url + '" failed.'
                    }
                }));
                if (!noRunDep) addRunDependency("al " + url)
            }),
            resizeListeners: [],
            updateResizeListeners: (function () {
                var canvas = Module["canvas"];
                Browser.resizeListeners.forEach((function (listener) {
                    listener(canvas.width, canvas.height)
                }))
            }),
            setCanvasSize: (function (width, height, noUpdates) {
                var canvas = Module["canvas"];
                Browser.updateCanvasDimensions(canvas, width, height);
                if (!noUpdates) Browser.updateResizeListeners()
            }),
            windowedWidth: 0,
            windowedHeight: 0,
            setFullScreenCanvasSize: (function () {
                if (typeof SDL != "undefined") {
                    var flags = HEAPU32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2];
                    flags = flags | 8388608;
                    HEAP32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2] = flags
                }
                Browser.updateResizeListeners()
            }),
            setWindowedCanvasSize: (function () {
                if (typeof SDL != "undefined") {
                    var flags = HEAPU32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2];
                    flags = flags & ~8388608;
                    HEAP32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2] = flags
                }
                Browser.updateResizeListeners()
            }),
            updateCanvasDimensions: (function (canvas, wNative, hNative) {
                if (wNative && hNative) {
                    canvas.widthNative = wNative;
                    canvas.heightNative = hNative
                } else {
                    wNative = canvas.widthNative;
                    hNative = canvas.heightNative
                }
                var w = wNative;
                var h = hNative;
                if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
                    if (w / h < Module["forcedAspectRatio"]) {
                        w = Math.round(h * Module["forcedAspectRatio"])
                    } else {
                        h = Math.round(w / Module["forcedAspectRatio"])
                    }
                }
                if ((document["webkitFullScreenElement"] || document["webkitFullscreenElement"] || document["mozFullScreenElement"] || document["mozFullscreenElement"] || document["fullScreenElement"] || document["fullscreenElement"] || document["msFullScreenElement"] || document["msFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
                    var factor = Math.min(screen.width / w, screen.height / h);
                    w = Math.round(w * factor);
                    h = Math.round(h * factor)
                }
                if (Browser.resizeCanvas) {
                    if (canvas.width != w) canvas.width = w;
                    if (canvas.height != h) canvas.height = h;
                    if (typeof canvas.style != "undefined") {
                        canvas.style.removeProperty("width");
                        canvas.style.removeProperty("height")
                    }
                } else {
                    if (canvas.width != wNative) canvas.width = wNative;
                    if (canvas.height != hNative) canvas.height = hNative;
                    if (typeof canvas.style != "undefined") {
                        if (w != wNative || h != hNative) {
                            canvas.style.setProperty("width", w + "px", "important");
                            canvas.style.setProperty("height", h + "px", "important")
                        } else {
                            canvas.style.removeProperty("width");
                            canvas.style.removeProperty("height")
                        }
                    }
                }
            })
        };
        function _time(ptr) {
            var ret = Math.floor(Date.now() / 1e3);
            if (ptr) {
                HEAP32[ptr >> 2] = ret
            }
            return ret
        }
        ___errno_state = Runtime.staticAlloc(4);
        HEAP32[___errno_state >> 2] = 0;
        Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) {
            Browser.requestFullScreen(lockPointer, resizeCanvas)
        };
        Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
            Browser.requestAnimationFrame(func)
        };
        Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
            Browser.setCanvasSize(width, height, noUpdates)
        };
        Module["pauseMainLoop"] = function Module_pauseMainLoop() {
            Browser.mainLoop.pause()
        };
        Module["resumeMainLoop"] = function Module_resumeMainLoop() {
            Browser.mainLoop.resume()
        };
        Module["getUserMedia"] = function Module_getUserMedia() {
            Browser.getUserMedia()
        };
        FS.staticInit();
        __ATINIT__.unshift({
            func: (function () {
                if (!Module["noFSInit"] && !FS.init.initialized) FS.init()
            })
        });
        __ATMAIN__.push({
            func: (function () {
                FS.ignorePermissions = false
            })
        });
        __ATEXIT__.push({
            func: (function () {
                FS.quit()
            })
        });
        Module["FS_createFolder"] = FS.createFolder;
        Module["FS_createPath"] = FS.createPath;
        Module["FS_createDataFile"] = FS.createDataFile;
        Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
        Module["FS_createLazyFile"] = FS.createLazyFile;
        Module["FS_createLink"] = FS.createLink;
        Module["FS_createDevice"] = FS.createDevice;
        __ATINIT__.unshift({
            func: (function () {
                TTY.init()
            })
        });
        __ATEXIT__.push({
            func: (function () {
                TTY.shutdown()
            })
        });
        TTY.utf8 = new Runtime.UTF8Processor;
        if (ENVIRONMENT_IS_NODE) {
            var fs = require("fs");
            NODEFS.staticInit()
        }
        STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
        staticSealed = true;
        STACK_MAX = STACK_BASE + 5242880;
        DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
        assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");
        var cttz_i8 = allocate([8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0], "i8", ALLOC_DYNAMIC);
        var Math_min = Math.min;
        function asmPrintInt(x, y) {
            Module.print("int " + x + "," + y)
        }
        function asmPrintFloat(x, y) {
            Module.print("float " + x + "," + y)
        }
        var asm = (function (global, env, buffer) {
// EMSCRIPTEN_START_ASM
"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.cttz_i8|0;var n=env.ctlz_i8|0;var o=0;var p=0;var q=0;var r=0;var s=+env.NaN,t=+env.Infinity;var u=0,v=0,w=0,x=0,y=0.0,z=0,A=0,B=0,C=0.0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=global.Math.floor;var O=global.Math.abs;var P=global.Math.sqrt;var Q=global.Math.pow;var R=global.Math.cos;var S=global.Math.sin;var T=global.Math.tan;var U=global.Math.acos;var V=global.Math.asin;var W=global.Math.atan;var X=global.Math.atan2;var Y=global.Math.exp;var Z=global.Math.log;var _=global.Math.ceil;var $=global.Math.imul;var aa=env.abort;var ba=env.assert;var ca=env.asmPrintInt;var da=env.asmPrintFloat;var ea=env.min;var fa=env._fflush;var ga=env._abort;var ha=env.___setErrNo;var ia=env._llvm_stacksave;var ja=env._sbrk;var ka=env._time;var la=env._abs;var ma=env._emscripten_memcpy_big;var na=env._llvm_stackrestore;var oa=env._sysconf;var pa=env.___errno_location;var qa=0.0;
// EMSCRIPTEN_START_FUNCS
            function ra(a) {
                a = a | 0;
                var b = 0;
                b = i;
                i = i + a | 0;
                i = i + 7 & -8;
                return b | 0
            }
            function sa() {
                return i | 0
            }
            function ta(a) {
                a = a | 0;
                i = a
            }
            function ua(a, b) {
                a = a | 0;
                b = b | 0;
                if ((o | 0) == 0) {
                    o = a;
                    p = b
                }
            }
            function va(b) {
                b = b | 0;
                a[k >> 0] = a[b >> 0];
                a[k + 1 >> 0] = a[b + 1 >> 0];
                a[k + 2 >> 0] = a[b + 2 >> 0];
                a[k + 3 >> 0] = a[b + 3 >> 0]
            }
            function wa(b) {
                b = b | 0;
                a[k >> 0] = a[b >> 0];
                a[k + 1 >> 0] = a[b + 1 >> 0];
                a[k + 2 >> 0] = a[b + 2 >> 0];
                a[k + 3 >> 0] = a[b + 3 >> 0];
                a[k + 4 >> 0] = a[b + 4 >> 0];
                a[k + 5 >> 0] = a[b + 5 >> 0];
                a[k + 6 >> 0] = a[b + 6 >> 0];
                a[k + 7 >> 0] = a[b + 7 >> 0]
            }
            function xa(a) {
                a = a | 0;
                D = a
            }
            function ya() {
                return D | 0
            }
            function za(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                a = ($(1664525, c[d >> 2] | 0) | 0) + 1013904223 | 0;
                i = b;
                return a | 0
            }
            function Aa(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                a = 32 - (We(c[d >> 2] | 0) | 0) - 1 & 65535;
                i = b;
                return a | 0
            }
            function Ba(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                if ((c[d >> 2] | 0) <= 0) {
                    a = 0
                } else {
                    a = (Aa(c[d >> 2] | 0) | 0) << 16 >> 16
                }
                i = b;
                return a & 65535 | 0
            }
            function Ca(d, e, f, g, h, j, k, l, m) {
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                m = m | 0;
                var n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0,
                    B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
                q = i;
                i = i + 80 | 0;
                H = q + 8 | 0;
                D = q + 44 | 0;
                B = q + 24 | 0;
                z = q + 28 | 0;
                o = q + 12 | 0;
                A = q + 40 | 0;
                u = q + 48 | 0;
                G = q + 56 | 0;
                F = q + 64 | 0;
                n = q + 32 | 0;
                p = q + 68 | 0;
                w = q + 4 | 0;
                C = q;
                E = q + 36 | 0;
                v = q + 16 | 0;
                x = q + 20 | 0;
                y = q + 52 | 0;
                s = q + 72 | 0;
                t = q + 74 | 0;
                r = q + 60 | 0;
                c[H >> 2] = d;
                c[D >> 2] = e;
                c[B >> 2] = f;
                c[z >> 2] = g;
                c[o >> 2] = h;
                c[A >> 2] = j;
                c[u >> 2] = k;
                c[G >> 2] = l;
                c[F >> 2] = m;
                c[v >> 2] = c[(c[H >> 2] | 0) + 24 >> 2];
                c[p >> 2] = $(c[u >> 2] | 0, c[(c[H >> 2] | 0) + 36 >> 2] | 0) | 0;
                c[w >> 2] = $(c[u >> 2] | 0, b[(c[v >> 2] | 0) + (c[A >> 2] << 1) >> 1] | 0) | 0;
                if ((c[G >> 2] | 0) != 1) {
                    if ((c[w >> 2] | 0) < ((c[p >> 2] | 0) / (c[G >> 2] | 0) | 0 | 0)) {
                        m = c[w >> 2] | 0
                    } else {
                        m = (c[p >> 2] | 0) / (c[G >> 2] | 0) | 0
                    }
                    c[w >> 2] = m
                }
                if ((c[F >> 2] | 0) != 0) {
                    c[w >> 2] = 0;
                    c[A >> 2] = 0;
                    c[o >> 2] = 0
                }
                c[C >> 2] = c[B >> 2];
                c[E >> 2] = (c[D >> 2] | 0) + (($(c[u >> 2] | 0, b[(c[v >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0) | 0) << 1);
                c[n >> 2] = 0;
                while (1) {
                    if ((c[n >> 2] | 0) >= ($(c[u >> 2] | 0, b[(c[v >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0) | 0)) {
                        break
                    }
                    H = c[C >> 2] | 0;
                    c[C >> 2] = H + 4;
                    c[H >> 2] = 0;
                    c[n >> 2] = (c[n >> 2] | 0) + 1
                }
                c[n >> 2] = c[o >> 2];
                while (1) {
                    if ((c[n >> 2] | 0) >= (c[A >> 2] | 0)) {
                        break
                    }
                    c[x >> 2] = $(c[u >> 2] | 0, b[(c[v >> 2] | 0) + (c[n >> 2] << 1) >> 1] | 0) | 0;
                    c[y >> 2] = $(c[u >> 2] | 0, b[(c[v >> 2] | 0) + ((c[n >> 2] | 0) + 1 << 1) >> 1] | 0) | 0;
                    b[t >> 1] = (b[(c[z >> 2] | 0) + (c[n >> 2] << 1) >> 1] | 0) + (((a[14464 + (c[n >> 2] | 0) >> 0] & 65535) << 6 & 65535) << 16 >> 16);
                    c[r >> 2] = 16 - (b[t >> 1] >> 10);
                    if ((c[r >> 2] | 0) > 31) {
                        c[r >> 2] = 0;
                        b[s >> 1] = 0
                    } else {
                        b[s >> 1] = Da(b[t >> 1] & 1023) | 0
                    }
                    if ((c[r >> 2] | 0) < 0) {
                        if ((c[r >> 2] | 0) < -2) {
                            b[s >> 1] = 32767;
                            c[r >> 2] = -2
                        }
                        do {
                            d = c[E >> 2] | 0;
                            c[E >> 2] = d + 2;
                            d = $(b[d >> 1] | 0, b[s >> 1] | 0) | 0;
                            d = d << 0 - (c[r >> 2] | 0);
                            H = c[C >> 2] | 0;
                            c[C >> 2] = H + 4;
                            c[H >> 2] = d;
                            H = (c[x >> 2] | 0) + 1 | 0;
                            c[x >> 2] = H
                        } while ((H | 0) < (c[y >> 2] | 0))
                    } else {
                        do {
                            d = c[E >> 2] | 0;
                            c[E >> 2] = d + 2;
                            d = $(b[d >> 1] | 0, b[s >> 1] | 0) | 0;
                            d = d >> c[r >> 2];
                            H = c[C >> 2] | 0;
                            c[C >> 2] = H + 4;
                            c[H >> 2] = d;
                            H = (c[x >> 2] | 0) + 1 | 0;
                            c[x >> 2] = H
                        } while ((H | 0) < (c[y >> 2] | 0))
                    }
                    c[n >> 2] = (c[n >> 2] | 0) + 1
                }
                Xe((c[B >> 2] | 0) + (c[w >> 2] << 2) | 0, 0, (c[p >> 2] | 0) - (c[w >> 2] | 0) << 2 | 0) | 0;
                i = q;

            }
            function Da(a) {
                a = a | 0;
                var c = 0, d = 0, f = 0;
                c = i;
                i = i + 16 | 0;
                f = c + 2 | 0;
                d = c;
                b[f >> 1] = a;
                b[d >> 1] = e[f >> 1] << 4;
                a = (16383 + ((($(b[d >> 1] | 0, (22804 + ((($(b[d >> 1] | 0, (14819 + (((b[d >> 1] | 0) * 10204 >> 15 & 65535) << 16 >> 16) & 65535) << 16 >> 16) | 0) >> 15 & 65535) << 16 >> 16) & 65535) << 16 >> 16) | 0) >> 15 & 65535) << 16 >> 16) & 65535) << 16 >> 16;
                i = c;
                return a | 0
            }
            function Ea(a, e, f, g, h, j, k, l, m, n, o, p, q) {
                a = a | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                m = m | 0;
                n = n | 0;
                o = o | 0;
                p = p | 0;
                q = q | 0;
                var r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0,
                    F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0,
                    T = 0, U = 0, V = 0, W = 0;
                N = i;
                i = i + 128 | 0;
                H = N + 56 | 0;
                F = N + 84 | 0;
                x = N + 40 | 0;
                A = N + 44 | 0;
                w = N + 4 | 0;
                r = N + 16 | 0;
                W = N + 20 | 0;
                V = N + 24 | 0;
                M = N + 28 | 0;
                Q = N + 72 | 0;
                P = N + 80 | 0;
                R = N + 88 | 0;
                J = N + 96 | 0;
                y = N + 48 | 0;
                v = N + 52 | 0;
                t = N + 100 | 0;
                z = N + 60 | 0;
                u = N + 64 | 0;
                B = N + 104 | 0;
                D = N + 106 | 0;
                S = N + 68 | 0;
                E = N + 32 | 0;
                T = N + 36 | 0;
                U = N + 76 | 0;
                I = N;
                s = N + 110 | 0;
                O = N + 112 | 0;
                K = N + 92 | 0;
                C = N + 108 | 0;
                G = N + 12 | 0;
                L = N + 8 | 0;
                c[H >> 2] = a;
                c[F >> 2] = e;
                c[x >> 2] = f;
                c[A >> 2] = g;
                c[w >> 2] = h;
                c[r >> 2] = j;
                c[W >> 2] = k;
                c[V >> 2] = l;
                c[M >> 2] = m;
                c[Q >> 2] = n;
                c[P >> 2] = o;
                c[R >> 2] = p;
                c[J >> 2] = q;
                c[v >> 2] = c[W >> 2];
                while (1) {
                    if ((c[v >> 2] | 0) >= (c[V >> 2] | 0)) {
                        break
                    }
                    c[u >> 2] = (b[(c[(c[H >> 2] | 0) + 24 >> 2] | 0) + ((c[v >> 2] | 0) + 1 << 1) >> 1] | 0) - (b[(c[(c[H >> 2] | 0) + 24 >> 2] | 0) + (c[v >> 2] << 1) >> 1] | 0);
                    W = Fa(1 + (c[(c[R >> 2] | 0) + (c[v >> 2] << 2) >> 2] | 0) | 0, (b[(c[(c[H >> 2] | 0) + 24 >> 2] | 0) + ((c[v >> 2] | 0) + 1 << 1) >> 1] | 0) - (b[(c[(c[H >> 2] | 0) + 24 >> 2] | 0) + (c[v >> 2] << 1) >> 1] | 0) | 0) | 0;
                    c[S >> 2] = W >>> (c[A >> 2] | 0);
                    c[T >> 2] = (Ga(0 - (((c[S >> 2] & 65535) << 7 & 65535) << 16 >> 16) & 65535) | 0) >> 1;
                    b[B >> 1] = (((32767 < (c[T >> 2] | 0) ? 32767 : c[T >> 2] | 0) >> 16 & 65535) << 16 >> 16 << 14 << 1) + (((32767 < (c[T >> 2] | 0) ? 32767 : c[T >> 2] | 0) & 65535 & 65535) << 14 >> 15);
                    c[U >> 2] = c[u >> 2] << c[A >> 2];
                    c[E >> 2] = (Aa(c[U >> 2] | 0) | 0) << 16 >> 16 >> 1;
                    c[U >> 2] = c[U >> 2] << (7 - (c[E >> 2] | 0) << 1);
                    b[D >> 1] = lc(c[U >> 2] | 0) | 0;
                    c[y >> 2] = 0;
                    do {
                        c[G >> 2] = 0;
                        W = $(c[y >> 2] | 0, c[(c[H >> 2] | 0) + 8 >> 2] | 0) | 0;
                        b[s >> 1] = b[(c[Q >> 2] | 0) + (W + (c[v >> 2] | 0) << 1) >> 1] | 0;
                        W = $(c[y >> 2] | 0, c[(c[H >> 2] | 0) + 8 >> 2] | 0) | 0;
                        b[O >> 1] = b[(c[P >> 2] | 0) + (W + (c[v >> 2] | 0) << 1) >> 1] | 0;
                        if ((c[w >> 2] | 0) == 1) {
                            if ((b[s >> 1] | 0) > (b[(c[Q >> 2] | 0) + ((c[(c[H >> 2] | 0) + 8 >> 2] | 0) + (c[v >> 2] | 0) << 1) >> 1] | 0)) {
                                q = b[s >> 1] | 0
                            } else {
                                q = b[(c[Q >> 2] | 0) + ((c[(c[H >> 2] | 0) + 8 >> 2] | 0) + (c[v >> 2] | 0) << 1) >> 1] | 0
                            }
                            b[s >> 1] = q << 16 >> 16;
                            if ((b[O >> 1] | 0) > (b[(c[P >> 2] | 0) + ((c[(c[H >> 2] | 0) + 8 >> 2] | 0) + (c[v >> 2] | 0) << 1) >> 1] | 0)) {
                                q = b[O >> 1] | 0
                            } else {
                                q = b[(c[P >> 2] | 0) + ((c[(c[H >> 2] | 0) + 8 >> 2] | 0) + (c[v >> 2] | 0) << 1) >> 1] | 0
                            }
                            b[O >> 1] = q << 16 >> 16
                        }
                        W = $(c[y >> 2] | 0, c[(c[H >> 2] | 0) + 8 >> 2] | 0) | 0;
                        c[K >> 2] = (b[(c[M >> 2] | 0) + (W + (c[v >> 2] | 0) << 1) >> 1] | 0) - (((b[s >> 1] | 0) < (b[O >> 1] | 0) ? b[s >> 1] | 0 : b[O >> 1] | 0) << 16 >> 16);
                        c[K >> 2] = 0 > (c[K >> 2] | 0) ? 0 : c[K >> 2] | 0;
                        if ((c[K >> 2] | 0) < 16384) {
                            c[L >> 2] = (Ga(0 - ((c[K >> 2] & 65535) << 16 >> 16) & 65535) | 0) >> 1;
                            b[C >> 1] = (16383 < (c[L >> 2] | 0) ? 16383 : c[L >> 2] | 0) << 1
                        } else {
                            b[C >> 1] = 0
                        }
                        if ((c[A >> 2] | 0) == 3) {
                            if (23169 < (b[C >> 1] | 0)) {
                                q = 23169
                            } else {
                                q = b[C >> 1] | 0
                            }
                            b[C >> 1] = ((q & 65535) << 16 >> 16) * 23170 >> 14
                        }
                        b[C >> 1] = ((b[B >> 1] | 0) < (b[C >> 1] | 0) ? b[B >> 1] | 0 : b[C >> 1] | 0) << 16 >> 16 >> 1;
                        W = ($(b[D >> 1] | 0, b[C >> 1] | 0) | 0) >> 15;
                        b[C >> 1] = W >> c[E >> 2];
                        W = (c[F >> 2] | 0) + (($(c[y >> 2] | 0, c[r >> 2] | 0) | 0) << 1) | 0;
                        c[I >> 2] = W + (b[(c[(c[H >> 2] | 0) + 24 >> 2] | 0) + (c[v >> 2] << 1) >> 1] << c[A >> 2] << 1);
                        c[z >> 2] = 0;
                        while (1) {
                            if ((c[z >> 2] | 0) >= (1 << c[A >> 2] | 0)) {
                                break
                            }
                            W = $(c[v >> 2] | 0, c[w >> 2] | 0) | 0;
                            if ((d[(c[x >> 2] | 0) + (W + (c[y >> 2] | 0)) >> 0] & 1 << c[z >> 2] | 0) == 0) {
                                c[t >> 2] = 0;
                                while (1) {
                                    if ((c[t >> 2] | 0) >= (c[u >> 2] | 0)) {
                                        break
                                    }
                                    c[J >> 2] = za(c[J >> 2] | 0) | 0;
                                    W = b[C >> 1] | 0;
                                    b[(c[I >> 2] | 0) + ((c[t >> 2] << c[A >> 2]) + (c[z >> 2] | 0) << 1) >> 1] = (c[J >> 2] & 32768 | 0) != 0 ? W : 0 - W | 0;
                                    c[t >> 2] = (c[t >> 2] | 0) + 1
                                }
                                c[G >> 2] = 1
                            }
                            c[z >> 2] = (c[z >> 2] | 0) + 1
                        }
                        if ((c[G >> 2] | 0) != 0) {
                            Oc(c[I >> 2] | 0, c[u >> 2] << c[A >> 2], 32767)
                        }
                        W = (c[y >> 2] | 0) + 1 | 0;
                        c[y >> 2] = W
                    } while ((W | 0) < (c[w >> 2] | 0));
                    c[v >> 2] = (c[v >> 2] | 0) + 1
                }
                i = N;

            }
            function Fa(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0;
                f = i;
                i = i + 16 | 0;
                e = f + 4 | 0;
                d = f;
                c[e >> 2] = a;
                c[d >> 2] = b;
                i = f;
                return ((c[e >> 2] | 0) >>> 0) / ((c[d >> 2] | 0) >>> 0) | 0 | 0
            }
            function Ga(a) {
                a = a | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0;
                d = i;
                i = i + 16 | 0;
                e = d + 4 | 0;
                g = d + 10 | 0;
                f = d;
                h = d + 8 | 0;
                b[g >> 1] = a;
                c[f >> 2] = b[g >> 1] >> 10;
                if ((c[f >> 2] | 0) > 14) {
                    c[e >> 2] = 2130706432;
                    h = c[e >> 2] | 0;
                    i = d;
                    return h | 0
                }
                if ((c[f >> 2] | 0) < -15) {
                    c[e >> 2] = 0;
                    h = c[e >> 2] | 0;
                    i = d;
                    return h | 0
                }
                b[h >> 1] = Da((b[g >> 1] | 0) - (((c[f >> 2] & 65535) << 10 & 65535) << 16 >> 16) & 65535) | 0;
                g = b[h >> 1] | 0;
                a = 0 - (c[f >> 2] | 0) - 2 | 0;
                if ((0 - (c[f >> 2] | 0) - 2 | 0) > 0) {
                    f = g >> a
                } else {
                    f = g << 0 - a
                }
                c[e >> 2] = f;
                h = c[e >> 2] | 0;
                i = d;
                return h | 0
            }
            function Ha(a, d, e) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
                k = i;
                i = i + 32 | 0;
                l = k + 8 | 0;
                h = k + 16 | 0;
                f = k + 20 | 0;
                j = k + 24 | 0;
                g = k + 4 | 0;
                m = k;
                n = k + 12 | 0;
                c[l >> 2] = a;
                c[h >> 2] = d;
                c[f >> 2] = e;
                c[h >> 2] = c[h >> 2] >> 1;
                c[j >> 2] = 0;
                while (1) {
                    if ((c[j >> 2] | 0) >= (c[f >> 2] | 0)) {
                        break
                    }
                    c[g >> 2] = 0;
                    while (1) {
                        if ((c[g >> 2] | 0) >= (c[h >> 2] | 0)) {
                            break
                        }
                        a = $(c[f >> 2] << 1, c[g >> 2] | 0) | 0;
                        c[m >> 2] = (b[(c[l >> 2] | 0) + (a + (c[j >> 2] | 0) << 1) >> 1] | 0) * 23170;
                        a = $(c[f >> 2] | 0, (c[g >> 2] << 1) + 1 | 0) | 0;
                        c[n >> 2] = (b[(c[l >> 2] | 0) + (a + (c[j >> 2] | 0) << 1) >> 1] | 0) * 23170;
                        a = $(c[f >> 2] << 1, c[g >> 2] | 0) | 0;
                        b[(c[l >> 2] | 0) + (a + (c[j >> 2] | 0) << 1) >> 1] = (c[m >> 2] | 0) + (c[n >> 2] | 0) + 16384 >> 15;
                        a = $(c[f >> 2] | 0, (c[g >> 2] << 1) + 1 | 0) | 0;
                        b[(c[l >> 2] | 0) + (a + (c[j >> 2] | 0) << 1) >> 1] = (c[m >> 2] | 0) - (c[n >> 2] | 0) + 16384 >> 15;
                        c[g >> 2] = (c[g >> 2] | 0) + 1
                    }
                    c[j >> 2] = (c[j >> 2] | 0) + 1
                }
                i = k;

            }
            function Ia(e, f, g, h, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y) {
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                m = m | 0;
                n = n | 0;
                o = o | 0;
                p = p | 0;
                q = q | 0;
                r = r | 0;
                s = s | 0;
                t = t | 0;
                u = u | 0;
                v = v | 0;
                w = w | 0;
                x = x | 0;
                y = y | 0;
                var z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0,
                    N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0, _ = 0,
                    aa = 0, ba = 0, ca = 0, da = 0, ea = 0, fa = 0, ga = 0, ha = 0, ja = 0, ka = 0, la = 0, ma = 0,
                    oa = 0, pa = 0, qa = 0, ra = 0, sa = 0, ta = 0, ua = 0, va = 0, wa = 0, xa = 0, ya = 0, za = 0;
                D = i;
                i = i + 240 | 0;
                xa = D + 96 | 0;
                ea = D + 92 | 0;
                ha = D + 84 | 0;
                Y = D + 200 | 0;
                wa = D + 224 | 0;
                ba = D + 216 | 0;
                K = D + 20 | 0;
                ya = D + 24 | 0;
                la = D + 28 | 0;
                za = D + 32 | 0;
                U = D + 36 | 0;
                E = D + 40 | 0;
                G = D + 44 | 0;
                da = D + 48 | 0;
                ta = D + 52 | 0;
                ra = D + 56 | 0;
                va = D + 60 | 0;
                z = D + 64 | 0;
                sa = D + 68 | 0;
                B = D + 72 | 0;
                F = D + 196 | 0;
                ka = D + 204 | 0;
                P = D + 212 | 0;
                Z = D + 220 | 0;
                oa = D + 228 | 0;
                X = D + 232 | 0;
                V = D + 100 | 0;
                O = D + 104 | 0;
                T = D + 108 | 0;
                fa = D + 112 | 0;
                I = D + 116 | 0;
                R = D + 120 | 0;
                ca = D + 124 | 0;
                qa = D + 128 | 0;
                C = D + 168 | 0;
                ua = D + 172 | 0;
                ja = D + 176 | 0;
                S = D + 180 | 0;
                ma = D + 184 | 0;
                Q = D + 188 | 0;
                aa = D + 16 | 0;
                _ = D + 8 | 0;
                W = D;
                J = D + 12 | 0;
                L = D + 4 | 0;
                pa = D + 192 | 0;
                N = D + 76 | 0;
                M = D + 80 | 0;
                H = D + 208 | 0;
                ga = D + 88 | 0;
                c[xa >> 2] = e;
                c[ea >> 2] = f;
                c[ha >> 2] = g;
                c[Y >> 2] = h;
                c[wa >> 2] = j;
                c[ba >> 2] = k;
                c[K >> 2] = l;
                c[ya >> 2] = m;
                c[la >> 2] = n;
                c[za >> 2] = o;
                c[U >> 2] = p;
                c[E >> 2] = q;
                c[G >> 2] = r;
                c[da >> 2] = s;
                c[ta >> 2] = t;
                c[ra >> 2] = u;
                c[va >> 2] = v;
                c[z >> 2] = w;
                c[sa >> 2] = x;
                c[B >> 2] = y;
                c[P >> 2] = c[(c[ea >> 2] | 0) + 24 >> 2];
                c[fa >> 2] = 1;
                c[I >> 2] = (c[ba >> 2] | 0) != 0 ? 2 : 1;
                c[ca >> 2] = ((c[xa >> 2] | 0) != 0 ^ 1) & 1;
                c[O >> 2] = 1 << c[z >> 2];
                c[V >> 2] = (c[za >> 2] | 0) != 0 ? c[O >> 2] | 0 : 1;
                c[R >> 2] = $(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[ha >> 2] << 1) >> 1] | 0) | 0;
                f = $(c[O >> 2] | 0, b[(c[P >> 2] | 0) + ((c[(c[ea >> 2] | 0) + 8 >> 2] | 0) - 1 << 1) >> 1] | 0) | 0;
                f = $(c[I >> 2] | 0, f - (c[R >> 2] | 0) | 0) | 0;
                c[C >> 2] = ia() | 0;
                e = i;
                i = i + ((2 * f | 0) + 15 & -16) | 0;
                c[Z >> 2] = e;
                e = (c[Z >> 2] | 0) + (($(c[O >> 2] | 0, b[(c[P >> 2] | 0) + ((c[(c[ea >> 2] | 0) + 8 >> 2] | 0) - 1 << 1) >> 1] | 0) | 0) << 1) | 0;
                c[oa >> 2] = e + (0 - (c[R >> 2] | 0) << 1);
                c[X >> 2] = (c[wa >> 2] | 0) + (($(c[O >> 2] | 0, b[(c[P >> 2] | 0) + ((c[(c[ea >> 2] | 0) + 8 >> 2] | 0) - 1 << 1) >> 1] | 0) | 0) << 1);
                c[T >> 2] = 0;
                c[qa + 32 >> 2] = c[ya >> 2];
                c[qa + 24 >> 2] = c[va >> 2];
                c[qa >> 2] = c[xa >> 2];
                c[qa + 12 >> 2] = c[G >> 2];
                c[qa + 4 >> 2] = c[ea >> 2];
                c[qa + 36 >> 2] = c[c[B >> 2] >> 2];
                c[qa + 16 >> 2] = c[U >> 2];
                c[F >> 2] = c[ha >> 2];
                while (1) {
                    if ((c[F >> 2] | 0) >= (c[Y >> 2] | 0)) {
                        break
                    }
                    c[Q >> 2] = -1;
                    c[W >> 2] = 0;
                    c[qa + 8 >> 2] = c[F >> 2];
                    c[pa >> 2] = (c[F >> 2] | 0) == ((c[Y >> 2] | 0) - 1 | 0) & 1;
                    c[aa >> 2] = (c[wa >> 2] | 0) + (($(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[F >> 2] << 1) >> 1] | 0) | 0) << 1);
                    if ((c[ba >> 2] | 0) != 0) {
                        c[_ >> 2] = (c[ba >> 2] | 0) + (($(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[F >> 2] << 1) >> 1] | 0) | 0) << 1)
                    } else {
                        c[_ >> 2] = 0
                    }
                    za = $(c[O >> 2] | 0, b[(c[P >> 2] | 0) + ((c[F >> 2] | 0) + 1 << 1) >> 1] | 0) | 0;
                    c[S >> 2] = za - ($(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[F >> 2] << 1) >> 1] | 0) | 0);
                    c[ua >> 2] = Gb(c[va >> 2] | 0) | 0;
                    if ((c[F >> 2] | 0) != (c[ha >> 2] | 0)) {
                        c[ra >> 2] = (c[ra >> 2] | 0) - (c[ua >> 2] | 0)
                    }
                    c[ka >> 2] = (c[ta >> 2] | 0) - (c[ua >> 2] | 0) - 1;
                    c[qa + 28 >> 2] = c[ka >> 2];
                    if ((c[F >> 2] | 0) <= ((c[sa >> 2] | 0) - 1 | 0)) {
                        if (3 < ((c[sa >> 2] | 0) - (c[F >> 2] | 0) | 0)) {
                            g = 3
                        } else {
                            g = (c[sa >> 2] | 0) - (c[F >> 2] | 0) | 0
                        }
                        c[ma >> 2] = Ja(c[ra >> 2] | 0, g) | 0;
                        if (((c[ka >> 2] | 0) + 1 | 0) < ((c[(c[la >> 2] | 0) + (c[F >> 2] << 2) >> 2] | 0) + (c[ma >> 2] | 0) | 0)) {
                            g = (c[ka >> 2] | 0) + 1 | 0
                        } else {
                            g = (c[(c[la >> 2] | 0) + (c[F >> 2] << 2) >> 2] | 0) + (c[ma >> 2] | 0) | 0
                        }
                        do {
                            if (16383 >= (g | 0)) {
                                if (((c[ka >> 2] | 0) + 1 | 0) < ((c[(c[la >> 2] | 0) + (c[F >> 2] << 2) >> 2] | 0) + (c[ma >> 2] | 0) | 0)) {
                                    g = (c[ka >> 2] | 0) + 1 | 0;
                                    break
                                } else {
                                    g = (c[(c[la >> 2] | 0) + (c[F >> 2] << 2) >> 2] | 0) + (c[ma >> 2] | 0) | 0;
                                    break
                                }
                            } else {
                                g = 16383
                            }
                        } while (0);
                        do {
                            if (0 <= (g | 0)) {
                                if (((c[ka >> 2] | 0) + 1 | 0) < ((c[(c[la >> 2] | 0) + (c[F >> 2] << 2) >> 2] | 0) + (c[ma >> 2] | 0) | 0)) {
                                    g = (c[ka >> 2] | 0) + 1 | 0
                                } else {
                                    g = (c[(c[la >> 2] | 0) + (c[F >> 2] << 2) >> 2] | 0) + (c[ma >> 2] | 0) | 0
                                }
                                if (16383 >= (g | 0)) {
                                    if (((c[ka >> 2] | 0) + 1 | 0) < ((c[(c[la >> 2] | 0) + (c[F >> 2] << 2) >> 2] | 0) + (c[ma >> 2] | 0) | 0)) {
                                        g = (c[ka >> 2] | 0) + 1 | 0;
                                        break
                                    } else {
                                        g = (c[(c[la >> 2] | 0) + (c[F >> 2] << 2) >> 2] | 0) + (c[ma >> 2] | 0) | 0;
                                        break
                                    }
                                } else {
                                    g = 16383
                                }
                            } else {
                                g = 0
                            }
                        } while (0);
                        c[ja >> 2] = g
                    } else {
                        c[ja >> 2] = 0
                    }
                    do {
                        if ((c[ca >> 2] | 0) != 0 ? (za = $(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[F >> 2] << 1) >> 1] | 0) | 0, (za - (c[S >> 2] | 0) | 0) >= ($(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[ha >> 2] << 1) >> 1] | 0) | 0)) : 0) {
                            if ((c[fa >> 2] | 0) == 0 ? (c[T >> 2] | 0) != 0 : 0) {
                                break
                            }
                            c[T >> 2] = c[F >> 2]
                        }
                    } while (0);
                    c[W >> 2] = c[(c[da >> 2] | 0) + (c[F >> 2] << 2) >> 2];
                    c[qa + 20 >> 2] = c[W >> 2];
                    if ((c[F >> 2] | 0) >= (c[(c[ea >> 2] | 0) + 12 >> 2] | 0)) {
                        c[aa >> 2] = c[Z >> 2];
                        if ((c[ba >> 2] | 0) != 0) {
                            c[_ >> 2] = c[Z >> 2]
                        }
                        c[X >> 2] = 0
                    }
                    if ((c[F >> 2] | 0) == ((c[Y >> 2] | 0) - 1 | 0)) {
                        c[X >> 2] = 0
                    }
                    do {
                        if ((c[T >> 2] | 0) != 0) {
                            if (((c[U >> 2] | 0) == 3 ? (c[V >> 2] | 0) <= 1 : 0) ? (c[W >> 2] | 0) >= 0 : 0) {
                                A = 51;
                                break
                            }
                            za = $(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[T >> 2] << 1) >> 1] | 0) | 0;
                            if (0 > (za - (c[R >> 2] | 0) - (c[S >> 2] | 0) | 0)) {
                                g = 0
                            } else {
                                g = $(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[T >> 2] << 1) >> 1] | 0) | 0;
                                g = g - (c[R >> 2] | 0) - (c[S >> 2] | 0) | 0
                            }
                            c[Q >> 2] = g;
                            c[N >> 2] = c[T >> 2];
                            do {
                                ya = c[O >> 2] | 0;
                                za = (c[N >> 2] | 0) + -1 | 0;
                                c[N >> 2] = za;
                                za = $(ya, b[(c[P >> 2] | 0) + (za << 1) >> 1] | 0) | 0
                            } while ((za | 0) > ((c[Q >> 2] | 0) + (c[R >> 2] | 0) | 0));
                            c[M >> 2] = (c[T >> 2] | 0) - 1;
                            do {
                                ya = c[O >> 2] | 0;
                                za = (c[M >> 2] | 0) + 1 | 0;
                                c[M >> 2] = za;
                                za = $(ya, b[(c[P >> 2] | 0) + (za << 1) >> 1] | 0) | 0
                            } while ((za | 0) < ((c[Q >> 2] | 0) + (c[R >> 2] | 0) + (c[S >> 2] | 0) | 0));
                            c[L >> 2] = 0;
                            c[J >> 2] = 0;
                            c[H >> 2] = c[N >> 2];
                            do {
                                za = ($(c[H >> 2] | 0, c[I >> 2] | 0) | 0) + 0 | 0;
                                c[J >> 2] = c[J >> 2] | d[(c[K >> 2] | 0) + za >> 0];
                                za = $(c[H >> 2] | 0, c[I >> 2] | 0) | 0;
                                c[L >> 2] = c[L >> 2] | d[(c[K >> 2] | 0) + (za + (c[I >> 2] | 0) - 1) >> 0];
                                za = (c[H >> 2] | 0) + 1 | 0;
                                c[H >> 2] = za
                            } while ((za | 0) < (c[M >> 2] | 0))
                        } else {
                            A = 51
                        }
                    } while (0);
                    if ((A | 0) == 51) {
                        A = 0;
                        za = (1 << c[V >> 2]) - 1 | 0;
                        c[L >> 2] = za;
                        c[J >> 2] = za
                    }
                    a:do {
                        if (((c[E >> 2] | 0) != 0 ? (c[F >> 2] | 0) == (c[G >> 2] | 0) : 0) ? (c[E >> 2] = 0, (c[ca >> 2] | 0) != 0) : 0) {
                            c[ga >> 2] = 0;
                            while (1) {
                                za = $(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[F >> 2] << 1) >> 1] | 0) | 0;
                                if ((c[ga >> 2] | 0) >= (za - (c[R >> 2] | 0) | 0)) {
                                    break a
                                }
                                b[(c[Z >> 2] | 0) + (c[ga >> 2] << 1) >> 1] = (b[(c[Z >> 2] | 0) + (c[ga >> 2] << 1) >> 1] | 0) + (b[(c[oa >> 2] | 0) + (c[ga >> 2] << 1) >> 1] | 0) >> 1;
                                c[ga >> 2] = (c[ga >> 2] | 0) + 1
                            }
                        }
                    } while (0);
                    if ((c[E >> 2] | 0) != 0) {
                        if ((c[Q >> 2] | 0) != -1) {
                            g = (c[Z >> 2] | 0) + (c[Q >> 2] << 1) | 0
                        } else {
                            g = 0
                        }
                        if ((c[pa >> 2] | 0) != 0) {
                            y = 0
                        } else {
                            y = (c[Z >> 2] | 0) + (($(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[F >> 2] << 1) >> 1] | 0) | 0) << 1) | 0;
                            y = y + (0 - (c[R >> 2] | 0) << 1) | 0
                        }
                        c[J >> 2] = Ka(qa, c[aa >> 2] | 0, c[S >> 2] | 0, (c[ja >> 2] | 0) / 2 | 0, c[V >> 2] | 0, g, c[z >> 2] | 0, y, 32767, c[X >> 2] | 0, c[J >> 2] | 0) | 0;
                        if ((c[Q >> 2] | 0) != -1) {
                            y = (c[oa >> 2] | 0) + (c[Q >> 2] << 1) | 0
                        } else {
                            y = 0
                        }
                        if ((c[pa >> 2] | 0) != 0) {
                            g = 0
                        } else {
                            g = (c[oa >> 2] | 0) + (($(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[F >> 2] << 1) >> 1] | 0) | 0) << 1) | 0;
                            g = g + (0 - (c[R >> 2] | 0) << 1) | 0
                        }
                        c[L >> 2] = Ka(qa, c[_ >> 2] | 0, c[S >> 2] | 0, (c[ja >> 2] | 0) / 2 | 0, c[V >> 2] | 0, y, c[z >> 2] | 0, g, 32767, c[X >> 2] | 0, c[L >> 2] | 0) | 0
                    } else {
                        g = c[aa >> 2] | 0;
                        if ((c[_ >> 2] | 0) != 0) {
                            if ((c[Q >> 2] | 0) != -1) {
                                w = (c[Z >> 2] | 0) + (c[Q >> 2] << 1) | 0
                            } else {
                                w = 0
                            }
                            if ((c[pa >> 2] | 0) != 0) {
                                y = 0
                            } else {
                                y = (c[Z >> 2] | 0) + (($(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[F >> 2] << 1) >> 1] | 0) | 0) << 1) | 0;
                                y = y + (0 - (c[R >> 2] | 0) << 1) | 0
                            }
                            c[J >> 2] = La(qa, g, c[_ >> 2] | 0, c[S >> 2] | 0, c[ja >> 2] | 0, c[V >> 2] | 0, w, c[z >> 2] | 0, y, c[X >> 2] | 0, c[J >> 2] | c[L >> 2]) | 0
                        } else {
                            if ((c[Q >> 2] | 0) != -1) {
                                w = (c[Z >> 2] | 0) + (c[Q >> 2] << 1) | 0
                            } else {
                                w = 0
                            }
                            if ((c[pa >> 2] | 0) != 0) {
                                y = 0
                            } else {
                                y = (c[Z >> 2] | 0) + (($(c[O >> 2] | 0, b[(c[P >> 2] | 0) + (c[F >> 2] << 1) >> 1] | 0) | 0) << 1) | 0;
                                y = y + (0 - (c[R >> 2] | 0) << 1) | 0
                            }
                            c[J >> 2] = Ka(qa, g, c[S >> 2] | 0, c[ja >> 2] | 0, c[V >> 2] | 0, w, c[z >> 2] | 0, y, 32767, c[X >> 2] | 0, c[J >> 2] | c[L >> 2]) | 0
                        }
                        c[L >> 2] = c[J >> 2]
                    }
                    za = ($(c[F >> 2] | 0, c[I >> 2] | 0) | 0) + 0 | 0;
                    a[(c[K >> 2] | 0) + za >> 0] = c[J >> 2];
                    za = $(c[F >> 2] | 0, c[I >> 2] | 0) | 0;
                    a[(c[K >> 2] | 0) + (za + (c[I >> 2] | 0) - 1) >> 0] = c[L >> 2];
                    c[ra >> 2] = (c[ra >> 2] | 0) + ((c[(c[la >> 2] | 0) + (c[F >> 2] << 2) >> 2] | 0) + (c[ua >> 2] | 0));
                    c[fa >> 2] = (c[ja >> 2] | 0) > (c[S >> 2] << 3 | 0) & 1;
                    c[F >> 2] = (c[F >> 2] | 0) + 1
                }
                c[c[B >> 2] >> 2] = c[qa + 36 >> 2];
                na(c[C >> 2] | 0);
                i = D;

            }
            function Ja(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0;
                f = i;
                i = i + 16 | 0;
                e = f + 4 | 0;
                d = f;
                c[e >> 2] = a;
                c[d >> 2] = b;
                i = f;
                return (c[e >> 2] | 0) / (c[d >> 2] | 0) | 0 | 0
            }
            function Ka(a, e, f, g, h, j, k, l, m, n, o) {
                a = a | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                m = m | 0;
                n = n | 0;
                o = o | 0;
                var p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0,
                    D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0;
                H = i;
                i = i + 112 | 0;
                q = H + 92 | 0;
                u = H + 4 | 0;
                t = H;
                E = H + 40 | 0;
                s = H + 76 | 0;
                v = H + 16 | 0;
                F = H + 20 | 0;
                G = H + 24 | 0;
                r = H + 64 | 0;
                p = H + 98 | 0;
                N = H + 80 | 0;
                I = H + 88 | 0;
                L = H + 44 | 0;
                z = H + 48 | 0;
                B = H + 52 | 0;
                C = H + 56 | 0;
                y = H + 8 | 0;
                w = H + 60 | 0;
                D = H + 28 | 0;
                A = H + 12 | 0;
                J = H + 32 | 0;
                x = H + 68 | 0;
                K = H + 36 | 0;
                M = H + 84 | 0;
                P = H + 72 | 0;
                O = H + 96 | 0;
                c[u >> 2] = a;
                c[t >> 2] = e;
                c[E >> 2] = f;
                c[s >> 2] = g;
                c[v >> 2] = h;
                c[F >> 2] = j;
                c[G >> 2] = k;
                c[r >> 2] = l;
                b[p >> 1] = m;
                c[N >> 2] = n;
                c[I >> 2] = o;
                c[L >> 2] = c[E >> 2];
                c[z >> 2] = c[E >> 2];
                c[C >> 2] = c[v >> 2];
                c[y >> 2] = 0;
                c[w >> 2] = 0;
                c[A >> 2] = 0;
                c[J >> 2] = ((c[c[u >> 2] >> 2] | 0) != 0 ^ 1) & 1;
                c[K >> 2] = c[c[u >> 2] >> 2];
                c[M >> 2] = c[(c[u >> 2] | 0) + 20 >> 2];
                c[D >> 2] = (c[C >> 2] | 0) == 1 & 1;
                c[z >> 2] = Fa(c[z >> 2] | 0, c[v >> 2] | 0) | 0;
                if ((c[E >> 2] | 0) == 1) {
                    c[q >> 2] = Ma(c[u >> 2] | 0, c[t >> 2] | 0, 0, c[s >> 2] | 0, c[r >> 2] | 0) | 0;
                    a = c[q >> 2] | 0;
                    i = H;
                    return a | 0
                }
                if ((c[M >> 2] | 0) > 0) {
                    c[w >> 2] = c[M >> 2]
                }
                a:do {
                    if ((c[N >> 2] | 0) != 0 ? (c[F >> 2] | 0) != 0 : 0) {
                        do {
                            if ((c[w >> 2] | 0) == 0) {
                                if ((c[z >> 2] & 1 | 0) == 0 ? (c[M >> 2] | 0) < 0 : 0) {
                                    break
                                }
                                if ((c[C >> 2] | 0) <= 1) {
                                    break a
                                }
                            }
                        } while (0);
                        Ze(c[N >> 2] | 0, c[F >> 2] | 0, (c[E >> 2] << 1) + 0 | 0) | 0;
                        c[F >> 2] = c[N >> 2]
                    }
                } while (0);
                c[x >> 2] = 0;
                while (1) {
                    if ((c[x >> 2] | 0) >= (c[w >> 2] | 0)) {
                        break
                    }
                    if ((c[K >> 2] | 0) != 0) {
                        Ha(c[t >> 2] | 0, c[E >> 2] >> c[x >> 2], 1 << c[x >> 2])
                    }
                    if ((c[F >> 2] | 0) != 0) {
                        Ha(c[F >> 2] | 0, c[E >> 2] >> c[x >> 2], 1 << c[x >> 2])
                    }
                    c[I >> 2] = d[24 + (c[I >> 2] & 15) >> 0] | d[24 + (c[I >> 2] >> 4) >> 0] << 2;
                    c[x >> 2] = (c[x >> 2] | 0) + 1
                }
                c[v >> 2] = c[v >> 2] >> c[w >> 2];
                c[z >> 2] = c[z >> 2] << c[w >> 2];
                while (1) {
                    if ((c[z >> 2] & 1 | 0) != 0) {
                        break
                    }
                    if ((c[M >> 2] | 0) >= 0) {
                        break
                    }
                    if ((c[K >> 2] | 0) != 0) {
                        Ha(c[t >> 2] | 0, c[z >> 2] | 0, c[v >> 2] | 0)
                    }
                    if ((c[F >> 2] | 0) != 0) {
                        Ha(c[F >> 2] | 0, c[z >> 2] | 0, c[v >> 2] | 0)
                    }
                    c[I >> 2] = c[I >> 2] | c[I >> 2] << c[v >> 2];
                    c[v >> 2] = c[v >> 2] << 1;
                    c[z >> 2] = c[z >> 2] >> 1;
                    c[y >> 2] = (c[y >> 2] | 0) + 1;
                    c[M >> 2] = (c[M >> 2] | 0) + 1
                }
                c[C >> 2] = c[v >> 2];
                c[B >> 2] = c[z >> 2];
                if ((c[C >> 2] | 0) > 1) {
                    if ((c[K >> 2] | 0) != 0) {
                        Va(c[t >> 2] | 0, c[z >> 2] >> c[w >> 2], c[C >> 2] << c[w >> 2], c[D >> 2] | 0)
                    }
                    if ((c[F >> 2] | 0) != 0) {
                        Va(c[F >> 2] | 0, c[z >> 2] >> c[w >> 2], c[C >> 2] << c[w >> 2], c[D >> 2] | 0)
                    }
                }
                c[A >> 2] = Wa(c[u >> 2] | 0, c[t >> 2] | 0, c[E >> 2] | 0, c[s >> 2] | 0, c[v >> 2] | 0, c[F >> 2] | 0, c[G >> 2] | 0, b[p >> 1] | 0, c[I >> 2] | 0) | 0;
                if ((c[J >> 2] | 0) != 0) {
                    if ((c[C >> 2] | 0) > 1) {
                        Xa(c[t >> 2] | 0, c[z >> 2] >> c[w >> 2], c[C >> 2] << c[w >> 2], c[D >> 2] | 0)
                    }
                    c[z >> 2] = c[B >> 2];
                    c[v >> 2] = c[C >> 2];
                    c[x >> 2] = 0;
                    while (1) {
                        if ((c[x >> 2] | 0) >= (c[y >> 2] | 0)) {
                            break
                        }
                        c[v >> 2] = c[v >> 2] >> 1;
                        c[z >> 2] = c[z >> 2] << 1;
                        c[A >> 2] = c[A >> 2] | (c[A >> 2] | 0) >>> (c[v >> 2] | 0);
                        Ha(c[t >> 2] | 0, c[z >> 2] | 0, c[v >> 2] | 0);
                        c[x >> 2] = (c[x >> 2] | 0) + 1
                    }
                    c[x >> 2] = 0;
                    while (1) {
                        if ((c[x >> 2] | 0) >= (c[w >> 2] | 0)) {
                            break
                        }
                        c[A >> 2] = d[40 + (c[A >> 2] | 0) >> 0] | 0;
                        Ha(c[t >> 2] | 0, c[L >> 2] >> c[x >> 2], 1 << c[x >> 2]);
                        c[x >> 2] = (c[x >> 2] | 0) + 1
                    }
                    c[v >> 2] = c[v >> 2] << c[w >> 2];
                    b:do {
                        if ((c[r >> 2] | 0) != 0) {
                            b[O >> 1] = mc(c[L >> 2] << 22) | 0;
                            c[P >> 2] = 0;
                            while (1) {
                                if ((c[P >> 2] | 0) >= (c[L >> 2] | 0)) {
                                    break b
                                }
                                a = ($(b[O >> 1] | 0, b[(c[t >> 2] | 0) + (c[P >> 2] << 1) >> 1] | 0) | 0) >> 15 & 65535;
                                b[(c[r >> 2] | 0) + (c[P >> 2] << 1) >> 1] = a;
                                c[P >> 2] = (c[P >> 2] | 0) + 1
                            }
                        }
                    } while (0);
                    c[A >> 2] = c[A >> 2] & (1 << c[v >> 2]) - 1
                }
                c[q >> 2] = c[A >> 2];
                a = c[q >> 2] | 0;
                i = H;
                return a | 0
            }
            function La(a, d, e, f, g, h, j, k, l, m, n) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                m = m | 0;
                n = n | 0;
                var o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0,
                    C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0,
                    Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0;
                G = i;
                i = i + 160 | 0;
                A = G + 84 | 0;
                u = G + 128 | 0;
                t = G + 64 | 0;
                s = G + 76 | 0;
                x = G + 72 | 0;
                L = G + 36 | 0;
                C = G + 40 | 0;
                D = G + 44 | 0;
                E = G + 48 | 0;
                q = G + 52 | 0;
                F = G + 56 | 0;
                J = G + 108 | 0;
                W = G + 116 | 0;
                X = G + 124 | 0;
                v = G + 132 | 0;
                w = G + 148 | 0;
                o = G + 150 | 0;
                y = G + 144 | 0;
                z = G + 88 | 0;
                B = G + 92 | 0;
                H = G + 96 | 0;
                M = G + 100 | 0;
                I = G + 32 | 0;
                K = G + 28 | 0;
                V = G;
                S = G + 24 | 0;
                N = G + 104 | 0;
                U = G + 60 | 0;
                R = G + 112 | 0;
                P = G + 68 | 0;
                Q = G + 120 | 0;
                T = G + 136 | 0;
                O = G + 152 | 0;
                r = G + 80 | 0;
                p = G + 140 | 0;
                c[u >> 2] = a;
                c[t >> 2] = d;
                c[s >> 2] = e;
                c[x >> 2] = f;
                c[L >> 2] = g;
                c[C >> 2] = h;
                c[D >> 2] = j;
                c[E >> 2] = k;
                c[q >> 2] = l;
                c[F >> 2] = m;
                c[J >> 2] = n;
                c[W >> 2] = 0;
                c[X >> 2] = 0;
                c[v >> 2] = 0;
                b[w >> 1] = 0;
                b[o >> 1] = 0;
                c[y >> 2] = 0;
                c[z >> 2] = ((c[c[u >> 2] >> 2] | 0) != 0 ^ 1) & 1;
                c[N >> 2] = c[c[u >> 2] >> 2];
                c[U >> 2] = c[(c[u >> 2] | 0) + 24 >> 2];
                if ((c[x >> 2] | 0) == 1) {
                    c[A >> 2] = Ma(c[u >> 2] | 0, c[t >> 2] | 0, c[s >> 2] | 0, c[L >> 2] | 0, c[q >> 2] | 0) | 0;
                    a = c[A >> 2] | 0;
                    i = G;
                    return a | 0
                }
                c[S >> 2] = c[J >> 2];
                Na(c[u >> 2] | 0, V, c[t >> 2] | 0, c[s >> 2] | 0, c[x >> 2] | 0, L, c[C >> 2] | 0, c[C >> 2] | 0, c[E >> 2] | 0, 1, J);
                c[v >> 2] = c[V >> 2];
                c[W >> 2] = c[V + 4 >> 2];
                c[X >> 2] = c[V + 8 >> 2];
                c[M >> 2] = c[V + 12 >> 2];
                c[I >> 2] = c[V + 16 >> 2];
                c[K >> 2] = c[V + 20 >> 2];
                b[w >> 1] = c[W >> 2];
                b[o >> 1] = c[X >> 2];
                do {
                    if ((c[x >> 2] | 0) == 2) {
                        c[P >> 2] = 0;
                        c[B >> 2] = c[L >> 2];
                        c[H >> 2] = 0;
                        c[H >> 2] = (c[I >> 2] | 0) != 0 & (c[I >> 2] | 0) != 16384 ? 8 : 0;
                        c[B >> 2] = (c[B >> 2] | 0) - (c[H >> 2] | 0);
                        c[R >> 2] = (c[I >> 2] | 0) > 8192 & 1;
                        a = (c[u >> 2] | 0) + 28 | 0;
                        c[a >> 2] = (c[a >> 2] | 0) - ((c[K >> 2] | 0) + (c[H >> 2] | 0));
                        c[Q >> 2] = (c[R >> 2] | 0) != 0 ? c[s >> 2] | 0 : c[t >> 2] | 0;
                        c[T >> 2] = (c[R >> 2] | 0) != 0 ? c[t >> 2] | 0 : c[s >> 2] | 0;
                        do {
                            if ((c[H >> 2] | 0) != 0) {
                                if ((c[N >> 2] | 0) != 0) {
                                    a = $(b[c[Q >> 2] >> 1] | 0, b[(c[T >> 2] | 0) + 2 >> 1] | 0) | 0;
                                    c[P >> 2] = (a - ($(b[(c[Q >> 2] | 0) + 2 >> 1] | 0, b[c[T >> 2] >> 1] | 0) | 0) | 0) < 0 & 1;
                                    Yb(c[U >> 2] | 0, c[P >> 2] | 0, 1);
                                    break
                                } else {
                                    c[P >> 2] = Rb(c[U >> 2] | 0, 1) | 0;
                                    break
                                }
                            }
                        } while (0);
                        c[P >> 2] = 1 - (c[P >> 2] << 1);
                        c[y >> 2] = Ka(c[u >> 2] | 0, c[Q >> 2] | 0, c[x >> 2] | 0, c[B >> 2] | 0, c[C >> 2] | 0, c[D >> 2] | 0, c[E >> 2] | 0, c[q >> 2] | 0, 32767, c[F >> 2] | 0, c[S >> 2] | 0) | 0;
                        a = ($(0 - (c[P >> 2] | 0) | 0, b[(c[Q >> 2] | 0) + 2 >> 1] | 0) | 0) & 65535;
                        b[c[T >> 2] >> 1] = a;
                        a = ($(c[P >> 2] | 0, b[c[Q >> 2] >> 1] | 0) | 0) & 65535;
                        b[(c[T >> 2] | 0) + 2 >> 1] = a;
                        if ((c[z >> 2] | 0) != 0) {
                            a = ($(b[w >> 1] | 0, b[c[t >> 2] >> 1] | 0) | 0) >> 15 & 65535;
                            b[c[t >> 2] >> 1] = a;
                            a = ($(b[w >> 1] | 0, b[(c[t >> 2] | 0) + 2 >> 1] | 0) | 0) >> 15 & 65535;
                            b[(c[t >> 2] | 0) + 2 >> 1] = a;
                            a = ($(b[o >> 1] | 0, b[c[s >> 2] >> 1] | 0) | 0) >> 15 & 65535;
                            b[c[s >> 2] >> 1] = a;
                            a = ($(b[o >> 1] | 0, b[(c[s >> 2] | 0) + 2 >> 1] | 0) | 0) >> 15 & 65535;
                            b[(c[s >> 2] | 0) + 2 >> 1] = a;
                            b[O >> 1] = b[c[t >> 2] >> 1] | 0;
                            b[c[t >> 2] >> 1] = (b[O >> 1] | 0) - (b[c[s >> 2] >> 1] | 0);
                            b[c[s >> 2] >> 1] = (b[O >> 1] | 0) + (b[c[s >> 2] >> 1] | 0);
                            b[O >> 1] = b[(c[t >> 2] | 0) + 2 >> 1] | 0;
                            b[(c[t >> 2] | 0) + 2 >> 1] = (b[O >> 1] | 0) - (b[(c[s >> 2] | 0) + 2 >> 1] | 0);
                            b[(c[s >> 2] | 0) + 2 >> 1] = (b[O >> 1] | 0) + (b[(c[s >> 2] | 0) + 2 >> 1] | 0)
                        }
                    } else {
                        N = c[L >> 2] | 0;
                        if ((c[L >> 2] | 0) >= (((c[L >> 2] | 0) - (c[M >> 2] | 0) | 0) / 2 | 0 | 0)) {
                            N = (N - (c[M >> 2] | 0) | 0) / 2 | 0
                        }
                        if (0 <= (N | 0)) {
                            N = c[L >> 2] | 0;
                            if ((c[L >> 2] | 0) >= (((c[L >> 2] | 0) - (c[M >> 2] | 0) | 0) / 2 | 0 | 0)) {
                                N = (N - (c[M >> 2] | 0) | 0) / 2 | 0
                            }
                        } else {
                            N = 0
                        }
                        c[B >> 2] = N;
                        c[H >> 2] = (c[L >> 2] | 0) - (c[B >> 2] | 0);
                        a = (c[u >> 2] | 0) + 28 | 0;
                        c[a >> 2] = (c[a >> 2] | 0) - (c[K >> 2] | 0);
                        c[r >> 2] = c[(c[u >> 2] | 0) + 28 >> 2];
                        K = c[u >> 2] | 0;
                        if ((c[B >> 2] | 0) >= (c[H >> 2] | 0)) {
                            c[y >> 2] = Ka(K, c[t >> 2] | 0, c[x >> 2] | 0, c[B >> 2] | 0, c[C >> 2] | 0, c[D >> 2] | 0, c[E >> 2] | 0, c[q >> 2] | 0, 32767, c[F >> 2] | 0, c[J >> 2] | 0) | 0;
                            c[r >> 2] = (c[B >> 2] | 0) - ((c[r >> 2] | 0) - (c[(c[u >> 2] | 0) + 28 >> 2] | 0));
                            if ((c[r >> 2] | 0) > 24 ? (c[I >> 2] | 0) != 0 : 0) {
                                c[H >> 2] = (c[H >> 2] | 0) + ((c[r >> 2] | 0) - 24)
                            }
                            a = Ka(c[u >> 2] | 0, c[s >> 2] | 0, c[x >> 2] | 0, c[H >> 2] | 0, c[C >> 2] | 0, 0, c[E >> 2] | 0, 0, b[o >> 1] | 0, 0, c[J >> 2] >> c[C >> 2]) | 0;
                            c[y >> 2] = c[y >> 2] | a;
                            break
                        } else {
                            c[y >> 2] = Ka(K, c[s >> 2] | 0, c[x >> 2] | 0, c[H >> 2] | 0, c[C >> 2] | 0, 0, c[E >> 2] | 0, 0, b[o >> 1] | 0, 0, c[J >> 2] >> c[C >> 2]) | 0;
                            c[r >> 2] = (c[H >> 2] | 0) - ((c[r >> 2] | 0) - (c[(c[u >> 2] | 0) + 28 >> 2] | 0));
                            if ((c[r >> 2] | 0) > 24 ? (c[I >> 2] | 0) != 16384 : 0) {
                                c[B >> 2] = (c[B >> 2] | 0) + ((c[r >> 2] | 0) - 24)
                            }
                            a = Ka(c[u >> 2] | 0, c[t >> 2] | 0, c[x >> 2] | 0, c[B >> 2] | 0, c[C >> 2] | 0, c[D >> 2] | 0, c[E >> 2] | 0, c[q >> 2] | 0, 32767, c[F >> 2] | 0, c[J >> 2] | 0) | 0;
                            c[y >> 2] = c[y >> 2] | a;
                            break
                        }
                    }
                } while (0);
                a:do {
                    if ((c[z >> 2] | 0) != 0) {
                        if ((c[x >> 2] | 0) != 2) {
                            Oa(c[t >> 2] | 0, c[s >> 2] | 0, b[w >> 1] | 0, c[x >> 2] | 0)
                        }
                        if ((c[v >> 2] | 0) != 0) {
                            c[p >> 2] = 0;
                            while (1) {
                                if ((c[p >> 2] | 0) >= (c[x >> 2] | 0)) {
                                    break a
                                }
                                b[(c[s >> 2] | 0) + (c[p >> 2] << 1) >> 1] = 0 - (b[(c[s >> 2] | 0) + (c[p >> 2] << 1) >> 1] | 0);
                                c[p >> 2] = (c[p >> 2] | 0) + 1
                            }
                        }
                    }
                } while (0);
                c[A >> 2] = c[y >> 2];
                a = c[A >> 2] | 0;
                i = G;
                return a | 0
            }
            function Ma(a, d, e, f, g) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                var h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0;
                q = i;
                i = i + 48 | 0;
                r = q + 4 | 0;
                j = q + 16 | 0;
                l = q + 36 | 0;
                s = q;
                k = q + 32 | 0;
                h = q + 40 | 0;
                n = q + 44 | 0;
                o = q + 24 | 0;
                m = q + 20 | 0;
                u = q + 8 | 0;
                t = q + 12 | 0;
                p = q + 28 | 0;
                c[r >> 2] = a;
                c[j >> 2] = d;
                c[l >> 2] = e;
                c[s >> 2] = f;
                c[k >> 2] = g;
                c[h >> 2] = ((c[c[r >> 2] >> 2] | 0) != 0 ^ 1) & 1;
                c[m >> 2] = c[j >> 2];
                c[u >> 2] = c[c[r >> 2] >> 2];
                c[t >> 2] = c[(c[r >> 2] | 0) + 24 >> 2];
                c[o >> 2] = (c[l >> 2] | 0) != 0 & 1;
                c[n >> 2] = 0;
                do {
                    c[p >> 2] = 0;
                    if ((c[(c[r >> 2] | 0) + 28 >> 2] | 0) >= 8) {
                        if ((c[u >> 2] | 0) != 0) {
                            c[p >> 2] = (b[c[m >> 2] >> 1] | 0) < 0 & 1;
                            Yb(c[t >> 2] | 0, c[p >> 2] | 0, 1)
                        } else {
                            c[p >> 2] = Rb(c[t >> 2] | 0, 1) | 0
                        }
                        a = (c[r >> 2] | 0) + 28 | 0;
                        c[a >> 2] = (c[a >> 2] | 0) - 8;
                        c[s >> 2] = (c[s >> 2] | 0) - 8
                    }
                    if ((c[h >> 2] | 0) != 0) {
                        b[c[m >> 2] >> 1] = (c[p >> 2] | 0) != 0 ? -16384 : 16384
                    }
                    c[m >> 2] = c[l >> 2];
                    a = (c[n >> 2] | 0) + 1 | 0;
                    c[n >> 2] = a
                } while ((a | 0) < (1 + (c[o >> 2] | 0) | 0));
                if ((c[k >> 2] | 0) == 0) {
                    i = q;
                    return 1
                }
                b[c[k >> 2] >> 1] = b[c[j >> 2] >> 1] >> 4;
                i = q;
                return 1
            }
            function Na(a, d, e, f, g, h, j, k, l, m, n) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                m = m | 0;
                n = n | 0;
                var o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0,
                    C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0,
                    Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0, _ = 0, aa = 0;
                u = i;
                i = i + 160 | 0;
                V = u + 72 | 0;
                v = u + 56 | 0;
                G = u + 4 | 0;
                F = u + 52 | 0;
                y = u + 140 | 0;
                r = u + 68 | 0;
                C = u + 20 | 0;
                U = u + 24 | 0;
                aa = u + 28 | 0;
                D = u + 32 | 0;
                o = u + 36 | 0;
                H = u + 40 | 0;
                s = u + 44 | 0;
                x = u + 48 | 0;
                z = u + 112 | 0;
                A = u + 120 | 0;
                q = u + 128 | 0;
                X = u + 136 | 0;
                Y = u + 144 | 0;
                B = u + 148 | 0;
                w = u + 76 | 0;
                t = u + 80 | 0;
                I = u + 84 | 0;
                E = u + 88 | 0;
                Z = u + 92 | 0;
                p = u + 96 | 0;
                J = u + 100 | 0;
                N = u + 104 | 0;
                M = u + 12 | 0;
                O = u;
                L = u + 8 | 0;
                S = u + 108 | 0;
                R = u + 116 | 0;
                Q = u + 60 | 0;
                P = u + 124 | 0;
                T = u + 16 | 0;
                _ = u + 64 | 0;
                W = u + 132 | 0;
                c[V >> 2] = a;
                c[v >> 2] = d;
                c[G >> 2] = e;
                c[F >> 2] = f;
                c[y >> 2] = g;
                c[r >> 2] = h;
                c[C >> 2] = j;
                c[U >> 2] = k;
                c[aa >> 2] = l;
                c[D >> 2] = m;
                c[o >> 2] = n;
                c[s >> 2] = 0;
                c[w >> 2] = 0;
                c[t >> 2] = c[c[V >> 2] >> 2];
                c[I >> 2] = c[(c[V >> 2] | 0) + 4 >> 2];
                c[E >> 2] = c[(c[V >> 2] | 0) + 8 >> 2];
                c[Z >> 2] = c[(c[V >> 2] | 0) + 12 >> 2];
                c[p >> 2] = c[(c[V >> 2] | 0) + 24 >> 2];
                c[J >> 2] = c[(c[V >> 2] | 0) + 32 >> 2];
                c[X >> 2] = (b[(c[(c[I >> 2] | 0) + 48 >> 2] | 0) + (c[E >> 2] << 1) >> 1] | 0) + (c[aa >> 2] << 3);
                if ((c[D >> 2] | 0) != 0) {
                    n = (c[y >> 2] | 0) == 2
                } else {
                    n = 0
                }
                c[Y >> 2] = (c[X >> 2] >> 1) - (n ? 16 : 4);
                c[H >> 2] = Qa(c[y >> 2] | 0, c[c[r >> 2] >> 2] | 0, c[Y >> 2] | 0, c[X >> 2] | 0, c[D >> 2] | 0) | 0;
                if ((c[D >> 2] | 0) != 0 ? (c[E >> 2] | 0) >= (c[Z >> 2] | 0) : 0) {
                    c[H >> 2] = 1
                }
                if ((c[t >> 2] | 0) != 0) {
                    c[s >> 2] = Qc(c[G >> 2] | 0, c[F >> 2] | 0, c[D >> 2] | 0, c[y >> 2] | 0) | 0
                }
                c[B >> 2] = Gb(c[p >> 2] | 0) | 0;
                do {
                    if ((c[H >> 2] | 0) != 1) {
                        if ((c[t >> 2] | 0) != 0) {
                            c[s >> 2] = ($(c[s >> 2] | 0, c[H >> 2] | 0) | 0) + 8192 >> 14
                        }
                        do {
                            if ((c[D >> 2] | 0) != 0 ? (c[y >> 2] | 0) > 2 : 0) {
                                c[N >> 2] = 3;
                                c[M >> 2] = c[s >> 2];
                                c[O >> 2] = (c[H >> 2] | 0) / 2 | 0;
                                P = $(c[N >> 2] | 0, (c[O >> 2] | 0) + 1 | 0) | 0;
                                c[L >> 2] = P + (c[O >> 2] | 0);
                                P = c[p >> 2] | 0;
                                if ((c[t >> 2] | 0) != 0) {
                                    if ((c[M >> 2] | 0) <= (c[O >> 2] | 0)) {
                                        Q = $(c[N >> 2] | 0, c[M >> 2] | 0) | 0
                                    } else {
                                        Q = (c[M >> 2] | 0) - 1 - (c[O >> 2] | 0) + ($((c[O >> 2] | 0) + 1 | 0, c[N >> 2] | 0) | 0) | 0
                                    }
                                    if ((c[M >> 2] | 0) <= (c[O >> 2] | 0)) {
                                        M = $(c[N >> 2] | 0, (c[M >> 2] | 0) + 1 | 0) | 0
                                    } else {
                                        M = (c[M >> 2] | 0) - (c[O >> 2] | 0) + ($((c[O >> 2] | 0) + 1 | 0, c[N >> 2] | 0) | 0) | 0
                                    }
                                    Tb(P, Q, M, c[L >> 2] | 0);
                                    break
                                }
                                c[S >> 2] = Kb(P, c[L >> 2] | 0) | 0;
                                if ((c[S >> 2] | 0) < ($((c[O >> 2] | 0) + 1 | 0, c[N >> 2] | 0) | 0)) {
                                    c[M >> 2] = (c[S >> 2] | 0) / (c[N >> 2] | 0) | 0
                                } else {
                                    c[M >> 2] = (c[O >> 2] | 0) + 1 + ((c[S >> 2] | 0) - ($((c[O >> 2] | 0) + 1 | 0, c[N >> 2] | 0) | 0))
                                }
                                if ((c[M >> 2] | 0) <= (c[O >> 2] | 0)) {
                                    P = $(c[N >> 2] | 0, c[M >> 2] | 0) | 0
                                } else {
                                    P = (c[M >> 2] | 0) - 1 - (c[O >> 2] | 0) + ($((c[O >> 2] | 0) + 1 | 0, c[N >> 2] | 0) | 0) | 0
                                }
                                if ((c[M >> 2] | 0) <= (c[O >> 2] | 0)) {
                                    N = $(c[N >> 2] | 0, (c[M >> 2] | 0) + 1 | 0) | 0
                                } else {
                                    N = (c[M >> 2] | 0) - (c[O >> 2] | 0) + ($((c[O >> 2] | 0) + 1 | 0, c[N >> 2] | 0) | 0) | 0
                                }
                                Nb(c[p >> 2] | 0, P, N, c[L >> 2] | 0);
                                c[s >> 2] = c[M >> 2]
                            } else {
                                K = 31
                            }
                        } while (0);
                        do {
                            if ((K | 0) == 31) {
                                if ((c[U >> 2] | 0) <= 1 ? (c[D >> 2] | 0) == 0 : 0) {
                                    c[R >> 2] = 1;
                                    c[Q >> 2] = $((c[H >> 2] >> 1) + 1 | 0, (c[H >> 2] >> 1) + 1 | 0) | 0;
                                    if ((c[t >> 2] | 0) == 0) {
                                        c[T >> 2] = 0;
                                        c[_ >> 2] = Kb(c[p >> 2] | 0, c[Q >> 2] | 0) | 0;
                                        if ((c[_ >> 2] | 0) < (($(c[H >> 2] >> 1, (c[H >> 2] >> 1) + 1 | 0) | 0) >> 1 | 0)) {
                                            c[s >> 2] = ((hc((c[_ >> 2] << 3) + 1 | 0) | 0) - 1 | 0) >>> 1;
                                            c[R >> 2] = (c[s >> 2] | 0) + 1;
                                            c[T >> 2] = ($(c[s >> 2] | 0, (c[s >> 2] | 0) + 1 | 0) | 0) >> 1
                                        } else {
                                            aa = (c[H >> 2] | 0) + 1 << 1;
                                            c[s >> 2] = (aa - (hc(((c[Q >> 2] | 0) - (c[_ >> 2] | 0) - 1 << 3) + 1 | 0) | 0) | 0) >>> 1;
                                            c[R >> 2] = (c[H >> 2] | 0) + 1 - (c[s >> 2] | 0);
                                            c[T >> 2] = (c[Q >> 2] | 0) - (($((c[H >> 2] | 0) + 1 - (c[s >> 2] | 0) | 0, (c[H >> 2] | 0) + 2 - (c[s >> 2] | 0) | 0) | 0) >> 1)
                                        }
                                        Nb(c[p >> 2] | 0, c[T >> 2] | 0, (c[T >> 2] | 0) + (c[R >> 2] | 0) | 0, c[Q >> 2] | 0);
                                        break
                                    }
                                    if ((c[s >> 2] | 0) <= (c[H >> 2] >> 1 | 0)) {
                                        K = (c[s >> 2] | 0) + 1 | 0
                                    } else {
                                        K = (c[H >> 2] | 0) + 1 - (c[s >> 2] | 0) | 0
                                    }
                                    c[R >> 2] = K;
                                    if ((c[s >> 2] | 0) <= (c[H >> 2] >> 1 | 0)) {
                                        K = ($(c[s >> 2] | 0, (c[s >> 2] | 0) + 1 | 0) | 0) >> 1
                                    } else {
                                        K = (c[Q >> 2] | 0) - (($((c[H >> 2] | 0) + 1 - (c[s >> 2] | 0) | 0, (c[H >> 2] | 0) + 2 - (c[s >> 2] | 0) | 0) | 0) >> 1) | 0
                                    }
                                    c[P >> 2] = K;
                                    Tb(c[p >> 2] | 0, c[P >> 2] | 0, (c[P >> 2] | 0) + (c[R >> 2] | 0) | 0, c[Q >> 2] | 0);
                                    break
                                }
                                K = c[p >> 2] | 0;
                                if ((c[t >> 2] | 0) != 0) {
                                    Xb(K, c[s >> 2] | 0, (c[H >> 2] | 0) + 1 | 0);
                                    break
                                } else {
                                    c[s >> 2] = Qb(K, (c[H >> 2] | 0) + 1 | 0) | 0;
                                    break
                                }
                            }
                        } while (0);
                        c[s >> 2] = Fa(c[s >> 2] << 14, c[H >> 2] | 0) | 0;
                        if ((c[t >> 2] | 0) != 0 ? (c[D >> 2] | 0) != 0 : 0) {
                            if ((c[s >> 2] | 0) == 0) {
                                Ra(c[I >> 2] | 0, c[G >> 2] | 0, c[F >> 2] | 0, c[J >> 2] | 0, c[E >> 2] | 0, c[y >> 2] | 0);
                                break
                            } else {
                                Sa(c[G >> 2] | 0, c[F >> 2] | 0, c[y >> 2] | 0);
                                break
                            }
                        }
                    } else {
                        if ((c[D >> 2] | 0) != 0) {
                            if ((c[t >> 2] | 0) != 0) {
                                c[w >> 2] = (c[s >> 2] | 0) > 8192 & 1;
                                a:do {
                                    if ((c[w >> 2] | 0) != 0) {
                                        c[W >> 2] = 0;
                                        while (1) {
                                            if ((c[W >> 2] | 0) >= (c[y >> 2] | 0)) {
                                                break a
                                            }
                                            b[(c[F >> 2] | 0) + (c[W >> 2] << 1) >> 1] = 0 - (b[(c[F >> 2] | 0) + (c[W >> 2] << 1) >> 1] | 0);
                                            c[W >> 2] = (c[W >> 2] | 0) + 1
                                        }
                                    }
                                } while (0);
                                Ra(c[I >> 2] | 0, c[G >> 2] | 0, c[F >> 2] | 0, c[J >> 2] | 0, c[E >> 2] | 0, c[y >> 2] | 0)
                            }
                            do {
                                if ((c[c[r >> 2] >> 2] | 0) > 16 ? (c[(c[V >> 2] | 0) + 28 >> 2] | 0) > 16 : 0) {
                                    D = c[p >> 2] | 0;
                                    if ((c[t >> 2] | 0) != 0) {
                                        Wb(D, c[w >> 2] | 0, 2);
                                        break
                                    } else {
                                        c[w >> 2] = Ob(D, 2) | 0;
                                        break
                                    }
                                } else {
                                    K = 65
                                }
                            } while (0);
                            if ((K | 0) == 65) {
                                c[w >> 2] = 0
                            }
                            c[s >> 2] = 0
                        }
                    }
                } while (0);
                aa = Gb(c[p >> 2] | 0) | 0;
                c[q >> 2] = aa - (c[B >> 2] | 0);
                aa = c[r >> 2] | 0;
                c[aa >> 2] = (c[aa >> 2] | 0) - (c[q >> 2] | 0);
                if ((c[s >> 2] | 0) == 0) {
                    c[z >> 2] = 32767;
                    c[A >> 2] = 0;
                    aa = c[o >> 2] | 0;
                    c[aa >> 2] = c[aa >> 2] & (1 << c[C >> 2]) - 1;
                    c[x >> 2] = -16384;
                    aa = c[w >> 2] | 0;
                    a = c[v >> 2] | 0;
                    c[a >> 2] = aa;
                    a = c[z >> 2] | 0;
                    aa = c[v >> 2] | 0;
                    aa = aa + 4 | 0;
                    c[aa >> 2] = a;
                    aa = c[A >> 2] | 0;
                    a = c[v >> 2] | 0;
                    a = a + 8 | 0;
                    c[a >> 2] = aa;
                    a = c[x >> 2] | 0;
                    aa = c[v >> 2] | 0;
                    aa = aa + 12 | 0;
                    c[aa >> 2] = a;
                    aa = c[s >> 2] | 0;
                    a = c[v >> 2] | 0;
                    a = a + 16 | 0;
                    c[a >> 2] = aa;
                    a = c[q >> 2] | 0;
                    aa = c[v >> 2] | 0;
                    aa = aa + 20 | 0;
                    c[aa >> 2] = a;
                    i = u;
                    return
                }
                if ((c[s >> 2] | 0) == 16384) {
                    c[z >> 2] = 0;
                    c[A >> 2] = 32767;
                    aa = c[o >> 2] | 0;
                    c[aa >> 2] = c[aa >> 2] & (1 << c[C >> 2]) - 1 << c[C >> 2];
                    c[x >> 2] = 16384;
                    aa = c[w >> 2] | 0;
                    a = c[v >> 2] | 0;
                    c[a >> 2] = aa;
                    a = c[z >> 2] | 0;
                    aa = c[v >> 2] | 0;
                    aa = aa + 4 | 0;
                    c[aa >> 2] = a;
                    aa = c[A >> 2] | 0;
                    a = c[v >> 2] | 0;
                    a = a + 8 | 0;
                    c[a >> 2] = aa;
                    a = c[x >> 2] | 0;
                    aa = c[v >> 2] | 0;
                    aa = aa + 12 | 0;
                    c[aa >> 2] = a;
                    aa = c[s >> 2] | 0;
                    a = c[v >> 2] | 0;
                    a = a + 16 | 0;
                    c[a >> 2] = aa;
                    a = c[q >> 2] | 0;
                    aa = c[v >> 2] | 0;
                    aa = aa + 20 | 0;
                    c[aa >> 2] = a;
                    i = u;

                } else {
                    c[z >> 2] = (Ta(c[s >> 2] & 65535) | 0) << 16 >> 16;
                    c[A >> 2] = (Ta(16384 - (c[s >> 2] | 0) & 65535) | 0) << 16 >> 16;
                    aa = ((c[y >> 2] | 0) - 1 << 7 & 65535) << 16 >> 16;
                    c[x >> 2] = 16384 + ($(aa, ((Ua(c[A >> 2] | 0, c[z >> 2] | 0) | 0) & 65535) << 16 >> 16) | 0) >> 15;
                    aa = c[w >> 2] | 0;
                    a = c[v >> 2] | 0;
                    c[a >> 2] = aa;
                    a = c[z >> 2] | 0;
                    aa = c[v >> 2] | 0;
                    aa = aa + 4 | 0;
                    c[aa >> 2] = a;
                    aa = c[A >> 2] | 0;
                    a = c[v >> 2] | 0;
                    a = a + 8 | 0;
                    c[a >> 2] = aa;
                    a = c[x >> 2] | 0;
                    aa = c[v >> 2] | 0;
                    aa = aa + 12 | 0;
                    c[aa >> 2] = a;
                    aa = c[s >> 2] | 0;
                    a = c[v >> 2] | 0;
                    a = a + 16 | 0;
                    c[a >> 2] = aa;
                    a = c[q >> 2] | 0;
                    aa = c[v >> 2] | 0;
                    aa = aa + 20 | 0;
                    c[aa >> 2] = a;
                    i = u;

                }
            }
            function Oa(a, d, e, f) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0,
                    v = 0, w = 0, x = 0, y = 0;
                s = i;
                i = i + 64 | 0;
                l = s + 48 | 0;
                n = s;
                k = s + 56 | 0;
                j = s + 16 | 0;
                o = s + 32 | 0;
                w = s + 40 | 0;
                x = s + 44 | 0;
                v = s + 24 | 0;
                u = s + 20 | 0;
                y = s + 58 | 0;
                q = s + 4 | 0;
                h = s + 28 | 0;
                t = s + 12 | 0;
                p = s + 8 | 0;
                r = s + 36 | 0;
                g = s + 54 | 0;
                m = s + 52 | 0;
                c[l >> 2] = a;
                c[n >> 2] = d;
                b[k >> 1] = e;
                c[j >> 2] = f;
                c[w >> 2] = 0;
                c[x >> 2] = 0;
                Pa(c[n >> 2] | 0, c[l >> 2] | 0, c[n >> 2] | 0, c[j >> 2] | 0, w, x);
                a = ($(b[k >> 1] | 0, (c[w >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                c[w >> 2] = a + (($(b[k >> 1] | 0, c[w >> 2] & 65535 & 65535) | 0) >> 15);
                b[y >> 1] = b[k >> 1] >> 1;
                a = $(b[y >> 1] | 0, b[y >> 1] | 0) | 0;
                c[v >> 2] = a + (c[x >> 2] | 0) - (c[w >> 2] << 1);
                a = $(b[y >> 1] | 0, b[y >> 1] | 0) | 0;
                c[u >> 2] = a + (c[x >> 2] | 0) + (c[w >> 2] << 1);
                if ((c[u >> 2] | 0) >= 161061 ? (c[v >> 2] | 0) >= 161061 : 0) {
                    c[q >> 2] = (Aa(c[v >> 2] | 0) | 0) << 16 >> 16 >> 1;
                    c[h >> 2] = (Aa(c[u >> 2] | 0) | 0) << 16 >> 16 >> 1;
                    v = c[v >> 2] | 0;
                    f = (c[q >> 2] | 0) - 7 << 1;
                    if (((c[q >> 2] | 0) - 7 << 1 | 0) > 0) {
                        f = v >> f
                    } else {
                        f = v << 0 - f
                    }
                    c[t >> 2] = f;
                    c[p >> 2] = (lc(c[t >> 2] | 0) | 0) << 16 >> 16;
                    f = c[u >> 2] | 0;
                    u = (c[h >> 2] | 0) - 7 << 1;
                    if (((c[h >> 2] | 0) - 7 << 1 | 0) > 0) {
                        u = f >> u
                    } else {
                        u = f << 0 - u
                    }
                    c[t >> 2] = u;
                    c[r >> 2] = (lc(c[t >> 2] | 0) | 0) << 16 >> 16;
                    if ((c[q >> 2] | 0) < 7) {
                        c[q >> 2] = 7
                    }
                    if ((c[h >> 2] | 0) < 7) {
                        c[h >> 2] = 7
                    }
                    c[o >> 2] = 0;
                    while (1) {
                        if ((c[o >> 2] | 0) >= (c[j >> 2] | 0)) {
                            break
                        }
                        b[m >> 1] = 16384 + ($(b[k >> 1] | 0, b[(c[l >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0) | 0) >> 15;
                        b[g >> 1] = b[(c[n >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0;
                        y = $((c[p >> 2] & 65535) << 16 >> 16, ((b[m >> 1] | 0) - (b[g >> 1] | 0) & 65535) << 16 >> 16) | 0;
                        b[(c[l >> 2] | 0) + (c[o >> 2] << 1) >> 1] = y + (1 << (c[q >> 2] | 0) + 1 >> 1) >> (c[q >> 2] | 0) + 1;
                        y = $((c[r >> 2] & 65535) << 16 >> 16, ((b[m >> 1] | 0) + (b[g >> 1] | 0) & 65535) << 16 >> 16) | 0;
                        b[(c[n >> 2] | 0) + (c[o >> 2] << 1) >> 1] = y + (1 << (c[h >> 2] | 0) + 1 >> 1) >> (c[h >> 2] | 0) + 1;
                        c[o >> 2] = (c[o >> 2] | 0) + 1
                    }
                    i = s;
                    return
                }
                Ze(c[n >> 2] | 0, c[l >> 2] | 0, (c[j >> 2] << 1) + 0 | 0) | 0;
                i = s;

            }
            function Pa(a, d, e, f, g, h) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0;
                m = i;
                i = i + 48 | 0;
                j = m + 28 | 0;
                r = m + 16 | 0;
                s = m + 4 | 0;
                p = m + 8 | 0;
                q = m + 32 | 0;
                l = m;
                o = m + 12 | 0;
                n = m + 24 | 0;
                k = m + 20 | 0;
                c[j >> 2] = a;
                c[r >> 2] = d;
                c[s >> 2] = e;
                c[p >> 2] = f;
                c[q >> 2] = g;
                c[l >> 2] = h;
                c[n >> 2] = 0;
                c[k >> 2] = 0;
                c[o >> 2] = 0;
                while (1) {
                    h = c[n >> 2] | 0;
                    if ((c[o >> 2] | 0) >= (c[p >> 2] | 0)) {
                        break
                    }
                    c[n >> 2] = h + ($(b[(c[j >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0, b[(c[r >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0) | 0);
                    c[k >> 2] = (c[k >> 2] | 0) + ($(b[(c[j >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0, b[(c[s >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0) | 0);
                    c[o >> 2] = (c[o >> 2] | 0) + 1
                }
                c[c[q >> 2] >> 2] = h;
                c[c[l >> 2] >> 2] = c[k >> 2];
                i = m;

            }
            function Qa(a, d, e, f, g) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                var h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0;
                h = i;
                i = i + 32 | 0;
                p = h + 4 | 0;
                m = h + 16 | 0;
                o = h + 8 | 0;
                n = h + 20 | 0;
                q = h + 28 | 0;
                k = h;
                j = h + 12 | 0;
                l = h + 24 | 0;
                c[p >> 2] = a;
                c[m >> 2] = d;
                c[o >> 2] = e;
                c[n >> 2] = f;
                c[q >> 2] = g;
                c[l >> 2] = (c[p >> 2] << 1) - 1;
                if ((c[q >> 2] | 0) != 0 ? (c[p >> 2] | 0) == 2 : 0) {
                    c[l >> 2] = (c[l >> 2] | 0) + -1
                }
                q = (c[m >> 2] | 0) + ($(c[l >> 2] | 0, c[o >> 2] | 0) | 0) | 0;
                c[j >> 2] = Ja(q, c[l >> 2] | 0) | 0;
                if (((c[m >> 2] | 0) - (c[n >> 2] | 0) - 32 | 0) < (c[j >> 2] | 0)) {
                    l = (c[m >> 2] | 0) - (c[n >> 2] | 0) - 32 | 0
                } else {
                    l = c[j >> 2] | 0
                }
                c[j >> 2] = l;
                c[j >> 2] = 64 < (c[j >> 2] | 0) ? 64 : c[j >> 2] | 0;
                if ((c[j >> 2] | 0) < 4) {
                    c[k >> 2] = 1;
                    q = c[k >> 2] | 0;
                    i = h;
                    return q | 0
                } else {
                    c[k >> 2] = b[8 + ((c[j >> 2] & 7) << 1) >> 1] >> 14 - (c[j >> 2] >> 3);
                    c[k >> 2] = (c[k >> 2] | 0) + 1 >> 1 << 1;
                    q = c[k >> 2] | 0;
                    i = h;
                    return q | 0
                }
                return 0
            }
            function Ra(a, d, e, f, g, h) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0,
                    x = 0, y = 0, z = 0;
                u = i;
                i = i + 64 | 0;
                y = u + 20 | 0;
                l = u + 8 | 0;
                n = u + 16 | 0;
                x = u + 32 | 0;
                z = u + 28 | 0;
                p = u;
                w = u + 12 | 0;
                q = u + 24 | 0;
                j = u + 38 | 0;
                k = u + 46 | 0;
                s = u + 44 | 0;
                r = u + 42 | 0;
                t = u + 40 | 0;
                v = u + 4 | 0;
                o = u + 36 | 0;
                m = u + 48 | 0;
                c[y >> 2] = a;
                c[l >> 2] = d;
                c[n >> 2] = e;
                c[x >> 2] = f;
                c[z >> 2] = g;
                c[p >> 2] = h;
                c[w >> 2] = c[z >> 2];
                h = c[w >> 2] | 0;
                if ((c[(c[x >> 2] | 0) + (c[w >> 2] << 2) >> 2] | 0) > (c[(c[x >> 2] | 0) + ((c[w >> 2] | 0) + (c[(c[y >> 2] | 0) + 8 >> 2] | 0) << 2) >> 2] | 0)) {
                    h = c[(c[x >> 2] | 0) + (h << 2) >> 2] | 0
                } else {
                    h = c[(c[x >> 2] | 0) + (h + (c[(c[y >> 2] | 0) + 8 >> 2] | 0) << 2) >> 2] | 0
                }
                c[v >> 2] = ((Ba(h) | 0) << 16 >> 16) - 13;
                g = c[(c[x >> 2] | 0) + (c[w >> 2] << 2) >> 2] | 0;
                h = c[v >> 2] | 0;
                if ((c[v >> 2] | 0) > 0) {
                    h = g >> h
                } else {
                    h = g << 0 - h
                }
                b[s >> 1] = h;
                x = c[(c[x >> 2] | 0) + ((c[w >> 2] | 0) + (c[(c[y >> 2] | 0) + 8 >> 2] | 0) << 2) >> 2] | 0;
                w = c[v >> 2] | 0;
                if ((c[v >> 2] | 0) > 0) {
                    v = x >> w
                } else {
                    v = x << 0 - w
                }
                b[r >> 1] = v;
                z = 1 + ($(b[s >> 1] | 0, b[s >> 1] | 0) | 0) | 0;
                b[t >> 1] = 1 + (mc(z + ($(b[r >> 1] | 0, b[r >> 1] | 0) | 0) | 0) | 0);
                b[j >> 1] = (b[s >> 1] << 14 | 0) / (b[t >> 1] | 0) | 0;
                b[k >> 1] = (b[r >> 1] << 14 | 0) / (b[t >> 1] | 0) | 0;
                c[q >> 2] = 0;
                while (1) {
                    if ((c[q >> 2] | 0) >= (c[p >> 2] | 0)) {
                        break
                    }
                    b[m >> 1] = b[(c[l >> 2] | 0) + (c[q >> 2] << 1) >> 1] | 0;
                    b[o >> 1] = b[(c[n >> 2] | 0) + (c[q >> 2] << 1) >> 1] | 0;
                    z = $(b[j >> 1] | 0, b[m >> 1] | 0) | 0;
                    z = z + ($(b[k >> 1] | 0, b[o >> 1] | 0) | 0) >> 14 & 65535;
                    b[(c[l >> 2] | 0) + (c[q >> 2] << 1) >> 1] = z;
                    c[q >> 2] = (c[q >> 2] | 0) + 1
                }
                i = u;

            }
            function Sa(a, d, e) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0;
                f = i;
                i = i + 32 | 0;
                j = f + 20 | 0;
                l = f + 16 | 0;
                h = f + 12 | 0;
                g = f + 8 | 0;
                m = f + 4 | 0;
                k = f;
                c[j >> 2] = a;
                c[l >> 2] = d;
                c[h >> 2] = e;
                c[g >> 2] = 0;
                while (1) {
                    if ((c[g >> 2] | 0) >= (c[h >> 2] | 0)) {
                        break
                    }
                    c[k >> 2] = (b[(c[j >> 2] | 0) + (c[g >> 2] << 1) >> 1] | 0) * 23170;
                    c[m >> 2] = (b[(c[l >> 2] | 0) + (c[g >> 2] << 1) >> 1] | 0) * 23170;
                    b[(c[j >> 2] | 0) + (c[g >> 2] << 1) >> 1] = (c[k >> 2] | 0) + (c[m >> 2] | 0) >> 15;
                    b[(c[l >> 2] | 0) + (c[g >> 2] << 1) >> 1] = (c[m >> 2] | 0) - (c[k >> 2] | 0) >> 15;
                    c[g >> 2] = (c[g >> 2] | 0) + 1
                }
                i = f;

            }
            function Ta(a) {
                a = a | 0;
                var d = 0, e = 0, f = 0, g = 0;
                e = i;
                i = i + 16 | 0;
                g = e + 6 | 0;
                f = e;
                d = e + 4 | 0;
                b[g >> 1] = a;
                c[f >> 2] = 4096 + ($(b[g >> 1] | 0, b[g >> 1] | 0) | 0) >> 13;
                b[d >> 1] = c[f >> 2];
                b[d >> 1] = 32767 - (b[d >> 1] | 0) + (16384 + ($(b[d >> 1] | 0, ((16384 + ($(b[d >> 1] | 0, (8277 + (16384 + ($(-626, b[d >> 1] | 0) | 0) >> 15) & 65535) << 16 >> 16) | 0) >> 15) + -7651 & 65535) << 16 >> 16) | 0) >> 15);
                i = e;
                return 1 + (b[d >> 1] | 0) & 65535 | 0
            }
            function Ua(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0;
                d = i;
                i = i + 16 | 0;
                f = d + 12 | 0;
                e = d + 8 | 0;
                g = d + 4 | 0;
                h = d;
                c[f >> 2] = a;
                c[e >> 2] = b;
                c[g >> 2] = 32 - (We(c[e >> 2] | 0) | 0);
                c[h >> 2] = 32 - (We(c[f >> 2] | 0) | 0);
                c[e >> 2] = c[e >> 2] << 15 - (c[g >> 2] | 0);
                c[f >> 2] = c[f >> 2] << 15 - (c[h >> 2] | 0);
                a = ((c[h >> 2] | 0) - (c[g >> 2] | 0) << 11) + (16384 + ($((c[f >> 2] & 65535) << 16 >> 16, ((16384 + ($((c[f >> 2] & 65535) << 16 >> 16, -2597) | 0) >> 15) + 7932 & 65535) << 16 >> 16) | 0) >> 15) | 0;
                a = a - (16384 + ($((c[e >> 2] & 65535) << 16 >> 16, ((16384 + ($((c[e >> 2] & 65535) << 16 >> 16, -2597) | 0) >> 15) + 7932 & 65535) << 16 >> 16) | 0) >> 15) | 0;
                i = d;
                return a | 0
            }
            function Va(a, d, e, f) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0;
                k = i;
                i = i + 48 | 0;
                n = k + 28 | 0;
                m = k + 16 | 0;
                o = k + 4 | 0;
                q = k + 8 | 0;
                g = k + 32 | 0;
                l = k;
                h = k + 12 | 0;
                j = k + 24 | 0;
                p = k + 20 | 0;
                c[n >> 2] = a;
                c[m >> 2] = d;
                c[o >> 2] = e;
                c[q >> 2] = f;
                c[h >> 2] = $(c[m >> 2] | 0, c[o >> 2] | 0) | 0;
                a = c[h >> 2] | 0;
                c[j >> 2] = ia() | 0;
                f = i;
                i = i + ((2 * a | 0) + 15 & -16) | 0;
                if ((c[q >> 2] | 0) != 0) {
                    c[p >> 2] = 56 + (c[o >> 2] << 2) + -8;
                    c[g >> 2] = 0;
                    while (1) {
                        if ((c[g >> 2] | 0) >= (c[o >> 2] | 0)) {
                            break
                        }
                        c[l >> 2] = 0;
                        while (1) {
                            if ((c[l >> 2] | 0) >= (c[m >> 2] | 0)) {
                                break
                            }
                            a = $(c[l >> 2] | 0, c[o >> 2] | 0) | 0;
                            q = $(c[(c[p >> 2] | 0) + (c[g >> 2] << 2) >> 2] | 0, c[m >> 2] | 0) | 0;
                            b[f + (q + (c[l >> 2] | 0) << 1) >> 1] = b[(c[n >> 2] | 0) + (a + (c[g >> 2] | 0) << 1) >> 1] | 0;
                            c[l >> 2] = (c[l >> 2] | 0) + 1
                        }
                        c[g >> 2] = (c[g >> 2] | 0) + 1
                    }
                    a = c[n >> 2] | 0;
                    d = c[h >> 2] | 0;
                    d = d << 1;
                    q = 0;
                    q = d + q | 0;
                    Ze(a | 0, f | 0, q | 0) | 0;
                    q = c[j >> 2] | 0;
                    na(q | 0);
                    i = k;

                } else {
                    c[g >> 2] = 0;
                    while (1) {
                        if ((c[g >> 2] | 0) >= (c[o >> 2] | 0)) {
                            break
                        }
                        c[l >> 2] = 0;
                        while (1) {
                            if ((c[l >> 2] | 0) >= (c[m >> 2] | 0)) {
                                break
                            }
                            a = $(c[l >> 2] | 0, c[o >> 2] | 0) | 0;
                            q = $(c[g >> 2] | 0, c[m >> 2] | 0) | 0;
                            b[f + (q + (c[l >> 2] | 0) << 1) >> 1] = b[(c[n >> 2] | 0) + (a + (c[g >> 2] | 0) << 1) >> 1] | 0;
                            c[l >> 2] = (c[l >> 2] | 0) + 1
                        }
                        c[g >> 2] = (c[g >> 2] | 0) + 1
                    }
                    a = c[n >> 2] | 0;
                    d = c[h >> 2] | 0;
                    d = d << 1;
                    q = 0;
                    q = d + q | 0;
                    Ze(a | 0, f | 0, q | 0) | 0;
                    q = c[j >> 2] | 0;
                    na(q | 0);
                    i = k;

                }
            }
            function Wa(a, e, f, g, h, j, k, l, m) {
                a = a | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                m = m | 0;
                var n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0,
                    B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0,
                    P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0;
                n = i;
                i = i + 176 | 0;
                t = n + 152 | 0;
                s = n + 56 | 0;
                r = n + 44 | 0;
                G = n + 132 | 0;
                q = n + 140 | 0;
                u = n + 16 | 0;
                F = n + 20 | 0;
                p = n + 158 | 0;
                z = n + 28 | 0;
                Y = n + 32 | 0;
                N = n + 36 | 0;
                V = n + 40 | 0;
                P = n + 96 | 0;
                Q = n + 128 | 0;
                E = n + 136 | 0;
                v = n + 160 | 0;
                C = n + 162 | 0;
                o = n + 64 | 0;
                U = n + 68 | 0;
                D = n + 72 | 0;
                I = n + 76 | 0;
                W = n + 80 | 0;
                X = n + 84 | 0;
                L = n + 12 | 0;
                K = n + 4 | 0;
                w = n;
                A = n + 8 | 0;
                J = n + 88 | 0;
                B = n + 92 | 0;
                H = n + 48 | 0;
                O = n + 104 | 0;
                y = n + 52 | 0;
                x = n + 60 | 0;
                M = n + 148 | 0;
                S = n + 144 | 0;
                R = n + 24 | 0;
                T = n + 156 | 0;
                c[t >> 2] = a;
                c[s >> 2] = e;
                c[r >> 2] = f;
                c[G >> 2] = g;
                c[q >> 2] = h;
                c[u >> 2] = j;
                c[F >> 2] = k;
                b[p >> 1] = l;
                c[z >> 2] = m;
                c[P >> 2] = 0;
                c[Q >> 2] = 0;
                c[E >> 2] = c[q >> 2];
                b[v >> 1] = 0;
                b[C >> 1] = 0;
                c[o >> 2] = 0;
                c[U >> 2] = ((c[c[t >> 2] >> 2] | 0) != 0 ^ 1) & 1;
                c[D >> 2] = 0;
                c[I >> 2] = c[c[t >> 2] >> 2];
                c[W >> 2] = c[(c[t >> 2] | 0) + 4 >> 2];
                c[X >> 2] = c[(c[t >> 2] | 0) + 8 >> 2];
                c[L >> 2] = c[(c[t >> 2] | 0) + 16 >> 2];
                c[K >> 2] = c[(c[t >> 2] | 0) + 24 >> 2];
                a = $((c[F >> 2] | 0) + 1 | 0, c[(c[W >> 2] | 0) + 8 >> 2] | 0) | 0;
                c[Y >> 2] = (c[(c[W >> 2] | 0) + 92 >> 2] | 0) + (b[(c[(c[W >> 2] | 0) + 88 >> 2] | 0) + (a + (c[X >> 2] | 0) << 1) >> 1] | 0);
                if (((c[F >> 2] | 0) != -1 ? (c[G >> 2] | 0) > ((d[(c[Y >> 2] | 0) + (d[c[Y >> 2] >> 0] | 0) >> 0] | 0) + 12 | 0) : 0) ? (c[r >> 2] | 0) > 2 : 0) {
                    c[y >> 2] = 0;
                    c[r >> 2] = c[r >> 2] >> 1;
                    c[D >> 2] = (c[s >> 2] | 0) + (c[r >> 2] << 1);
                    c[F >> 2] = (c[F >> 2] | 0) - 1;
                    if ((c[q >> 2] | 0) == 1) {
                        c[z >> 2] = c[z >> 2] & 1 | c[z >> 2] << 1
                    }
                    c[q >> 2] = (c[q >> 2] | 0) + 1 >> 1;
                    Na(c[t >> 2] | 0, O, c[s >> 2] | 0, c[D >> 2] | 0, c[r >> 2] | 0, G, c[q >> 2] | 0, c[E >> 2] | 0, c[F >> 2] | 0, 0, z);
                    c[P >> 2] = c[O + 4 >> 2];
                    c[Q >> 2] = c[O + 8 >> 2];
                    c[J >> 2] = c[O + 12 >> 2];
                    c[B >> 2] = c[O + 16 >> 2];
                    c[H >> 2] = c[O + 20 >> 2];
                    b[v >> 1] = c[P >> 2];
                    b[C >> 1] = c[Q >> 2];
                    do {
                        if ((c[E >> 2] | 0) > 1 ? (c[B >> 2] & 16383 | 0) != 0 : 0) {
                            I = c[J >> 2] | 0;
                            if ((c[B >> 2] | 0) > 8192) {
                                c[J >> 2] = (c[J >> 2] | 0) - (I >> 4 - (c[F >> 2] | 0));
                                break
                            }
                            if (0 < (I + (c[r >> 2] << 3 >> 5 - (c[F >> 2] | 0)) | 0)) {
                                I = 0
                            } else {
                                I = (c[J >> 2] | 0) + (c[r >> 2] << 3 >> 5 - (c[F >> 2] | 0)) | 0
                            }
                            c[J >> 2] = I
                        }
                    } while (0);
                    I = c[G >> 2] | 0;
                    if ((c[G >> 2] | 0) >= (((c[G >> 2] | 0) - (c[J >> 2] | 0) | 0) / 2 | 0 | 0)) {
                        I = (I - (c[J >> 2] | 0) | 0) / 2 | 0
                    }
                    if (0 <= (I | 0)) {
                        I = c[G >> 2] | 0;
                        if ((c[G >> 2] | 0) >= (((c[G >> 2] | 0) - (c[J >> 2] | 0) | 0) / 2 | 0 | 0)) {
                            I = (I - (c[J >> 2] | 0) | 0) / 2 | 0
                        }
                    } else {
                        I = 0
                    }
                    c[w >> 2] = I;
                    c[A >> 2] = (c[G >> 2] | 0) - (c[w >> 2] | 0);
                    Y = (c[t >> 2] | 0) + 28 | 0;
                    c[Y >> 2] = (c[Y >> 2] | 0) - (c[H >> 2] | 0);
                    if ((c[u >> 2] | 0) != 0) {
                        c[y >> 2] = (c[u >> 2] | 0) + (c[r >> 2] << 1)
                    }
                    c[x >> 2] = c[(c[t >> 2] | 0) + 28 >> 2];
                    G = c[t >> 2] | 0;
                    if ((c[w >> 2] | 0) >= (c[A >> 2] | 0)) {
                        Y = 16384 + ($(b[p >> 1] | 0, b[v >> 1] | 0) | 0) >> 15 & 65535;
                        c[o >> 2] = Wa(G, c[s >> 2] | 0, c[r >> 2] | 0, c[w >> 2] | 0, c[q >> 2] | 0, c[u >> 2] | 0, c[F >> 2] | 0, Y, c[z >> 2] | 0) | 0;
                        c[x >> 2] = (c[w >> 2] | 0) - ((c[x >> 2] | 0) - (c[(c[t >> 2] | 0) + 28 >> 2] | 0));
                        if ((c[x >> 2] | 0) > 24 ? (c[B >> 2] | 0) != 0 : 0) {
                            c[A >> 2] = (c[A >> 2] | 0) + ((c[x >> 2] | 0) - 24)
                        }
                        Y = 16384 + ($(b[p >> 1] | 0, b[C >> 1] | 0) | 0) >> 15 & 65535;
                        Y = Wa(c[t >> 2] | 0, c[D >> 2] | 0, c[r >> 2] | 0, c[A >> 2] | 0, c[q >> 2] | 0, c[y >> 2] | 0, c[F >> 2] | 0, Y, c[z >> 2] >> c[q >> 2]) | 0;
                        c[o >> 2] = c[o >> 2] | Y << (c[E >> 2] >> 1);
                        Y = c[o >> 2] | 0;
                        i = n;
                        return Y | 0
                    } else {
                        Y = 16384 + ($(b[p >> 1] | 0, b[C >> 1] | 0) | 0) >> 15 & 65535;
                        Y = Wa(G, c[D >> 2] | 0, c[r >> 2] | 0, c[A >> 2] | 0, c[q >> 2] | 0, c[y >> 2] | 0, c[F >> 2] | 0, Y, c[z >> 2] >> c[q >> 2]) | 0;
                        c[o >> 2] = Y << (c[E >> 2] >> 1);
                        c[x >> 2] = (c[A >> 2] | 0) - ((c[x >> 2] | 0) - (c[(c[t >> 2] | 0) + 28 >> 2] | 0));
                        if ((c[x >> 2] | 0) > 24 ? (c[B >> 2] | 0) != 16384 : 0) {
                            c[w >> 2] = (c[w >> 2] | 0) + ((c[x >> 2] | 0) - 24)
                        }
                        Y = 16384 + ($(b[p >> 1] | 0, b[v >> 1] | 0) | 0) >> 15 & 65535;
                        Y = Wa(c[t >> 2] | 0, c[s >> 2] | 0, c[r >> 2] | 0, c[w >> 2] | 0, c[q >> 2] | 0, c[u >> 2] | 0, c[F >> 2] | 0, Y, c[z >> 2] | 0) | 0;
                        c[o >> 2] = c[o >> 2] | Y;
                        Y = c[o >> 2] | 0;
                        i = n;
                        return Y | 0
                    }
                }
                c[N >> 2] = Ya(c[W >> 2] | 0, c[X >> 2] | 0, c[F >> 2] | 0, c[G >> 2] | 0) | 0;
                c[V >> 2] = Za(c[W >> 2] | 0, c[X >> 2] | 0, c[F >> 2] | 0, c[N >> 2] | 0) | 0;
                Y = (c[t >> 2] | 0) + 28 | 0;
                c[Y >> 2] = (c[Y >> 2] | 0) - (c[V >> 2] | 0);
                while (1) {
                    if ((c[(c[t >> 2] | 0) + 28 >> 2] | 0) >= 0) {
                        break
                    }
                    if ((c[N >> 2] | 0) <= 0) {
                        break
                    }
                    Y = (c[t >> 2] | 0) + 28 | 0;
                    c[Y >> 2] = (c[Y >> 2] | 0) + (c[V >> 2] | 0);
                    c[N >> 2] = (c[N >> 2] | 0) + -1;
                    c[V >> 2] = Za(c[W >> 2] | 0, c[X >> 2] | 0, c[F >> 2] | 0, c[N >> 2] | 0) | 0;
                    Y = (c[t >> 2] | 0) + 28 | 0;
                    c[Y >> 2] = (c[Y >> 2] | 0) - (c[V >> 2] | 0)
                }
                if ((c[N >> 2] | 0) != 0) {
                    c[M >> 2] = _a(c[N >> 2] | 0) | 0;
                    s = c[s >> 2] | 0;
                    r = c[r >> 2] | 0;
                    t = c[M >> 2] | 0;
                    u = c[L >> 2] | 0;
                    q = c[q >> 2] | 0;
                    v = c[K >> 2] | 0;
                    if ((c[I >> 2] | 0) != 0) {
                        c[o >> 2] = Ic(s, r, t, u, q, v) | 0;
                        Y = c[o >> 2] | 0;
                        i = n;
                        return Y | 0
                    } else {
                        c[o >> 2] = Mc(s, r, t, u, q, v, b[p >> 1] | 0) | 0;
                        Y = c[o >> 2] | 0;
                        i = n;
                        return Y | 0
                    }
                }
                if ((c[U >> 2] | 0) == 0) {
                    Y = c[o >> 2] | 0;
                    i = n;
                    return Y | 0
                }
                c[R >> 2] = (1 << c[q >> 2]) - 1;
                c[z >> 2] = c[z >> 2] & c[R >> 2];
                if ((c[z >> 2] | 0) == 0) {
                    Xe(c[s >> 2] | 0, 0, c[r >> 2] << 1 | 0) | 0;
                    Y = c[o >> 2] | 0;
                    i = n;
                    return Y | 0
                }
                Y = (c[u >> 2] | 0) == 0;
                c[S >> 2] = 0;
                if (Y) {
                    while (1) {
                        if ((c[S >> 2] | 0) >= (c[r >> 2] | 0)) {
                            break
                        }
                        Y = za(c[(c[t >> 2] | 0) + 36 >> 2] | 0) | 0;
                        c[(c[t >> 2] | 0) + 36 >> 2] = Y;
                        b[(c[s >> 2] | 0) + (c[S >> 2] << 1) >> 1] = c[(c[t >> 2] | 0) + 36 >> 2] >> 20;
                        c[S >> 2] = (c[S >> 2] | 0) + 1
                    }
                    c[o >> 2] = c[R >> 2]
                } else {
                    while (1) {
                        if ((c[S >> 2] | 0) >= (c[r >> 2] | 0)) {
                            break
                        }
                        Y = za(c[(c[t >> 2] | 0) + 36 >> 2] | 0) | 0;
                        c[(c[t >> 2] | 0) + 36 >> 2] = Y;
                        b[T >> 1] = 4;
                        Y = b[T >> 1] | 0;
                        b[T >> 1] = (c[(c[t >> 2] | 0) + 36 >> 2] & 32768 | 0) != 0 ? Y : 0 - Y | 0;
                        b[(c[s >> 2] | 0) + (c[S >> 2] << 1) >> 1] = (b[(c[u >> 2] | 0) + (c[S >> 2] << 1) >> 1] | 0) + (b[T >> 1] | 0);
                        c[S >> 2] = (c[S >> 2] | 0) + 1
                    }
                    c[o >> 2] = c[z >> 2]
                }
                Oc(c[s >> 2] | 0, c[r >> 2] | 0, b[p >> 1] | 0);
                Y = c[o >> 2] | 0;
                i = n;
                return Y | 0
            }
            function Xa(a, d, e, f) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0;
                k = i;
                i = i + 48 | 0;
                o = k + 28 | 0;
                n = k + 16 | 0;
                g = k + 4 | 0;
                q = k + 8 | 0;
                l = k + 32 | 0;
                m = k;
                h = k + 12 | 0;
                j = k + 24 | 0;
                p = k + 20 | 0;
                c[o >> 2] = a;
                c[n >> 2] = d;
                c[g >> 2] = e;
                c[q >> 2] = f;
                c[h >> 2] = $(c[n >> 2] | 0, c[g >> 2] | 0) | 0;
                a = c[h >> 2] | 0;
                c[j >> 2] = ia() | 0;
                f = i;
                i = i + ((2 * a | 0) + 15 & -16) | 0;
                if ((c[q >> 2] | 0) != 0) {
                    c[p >> 2] = 56 + (c[g >> 2] << 2) + -8;
                    c[l >> 2] = 0;
                    while (1) {
                        if ((c[l >> 2] | 0) >= (c[g >> 2] | 0)) {
                            break
                        }
                        c[m >> 2] = 0;
                        while (1) {
                            e = c[l >> 2] | 0;
                            if ((c[m >> 2] | 0) >= (c[n >> 2] | 0)) {
                                break
                            }
                            a = $(c[(c[p >> 2] | 0) + (e << 2) >> 2] | 0, c[n >> 2] | 0) | 0;
                            q = $(c[m >> 2] | 0, c[g >> 2] | 0) | 0;
                            b[f + (q + (c[l >> 2] | 0) << 1) >> 1] = b[(c[o >> 2] | 0) + (a + (c[m >> 2] | 0) << 1) >> 1] | 0;
                            c[m >> 2] = (c[m >> 2] | 0) + 1
                        }
                        c[l >> 2] = e + 1
                    }
                    a = c[o >> 2] | 0;
                    d = c[h >> 2] | 0;
                    d = d << 1;
                    q = 0;
                    q = d + q | 0;
                    Ze(a | 0, f | 0, q | 0) | 0;
                    q = c[j >> 2] | 0;
                    na(q | 0);
                    i = k;

                } else {
                    c[l >> 2] = 0;
                    while (1) {
                        if ((c[l >> 2] | 0) >= (c[g >> 2] | 0)) {
                            break
                        }
                        c[m >> 2] = 0;
                        while (1) {
                            p = c[l >> 2] | 0;
                            if ((c[m >> 2] | 0) >= (c[n >> 2] | 0)) {
                                break
                            }
                            a = $(p, c[n >> 2] | 0) | 0;
                            q = $(c[m >> 2] | 0, c[g >> 2] | 0) | 0;
                            b[f + (q + (c[l >> 2] | 0) << 1) >> 1] = b[(c[o >> 2] | 0) + (a + (c[m >> 2] | 0) << 1) >> 1] | 0;
                            c[m >> 2] = (c[m >> 2] | 0) + 1
                        }
                        c[l >> 2] = p + 1
                    }
                    a = c[o >> 2] | 0;
                    d = c[h >> 2] | 0;
                    d = d << 1;
                    q = 0;
                    q = d + q | 0;
                    Ze(a | 0, f | 0, q | 0) | 0;
                    q = c[j >> 2] | 0;
                    na(q | 0);
                    i = k;

                }
            }
            function Ya(a, e, f, g) {
                a = a | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                var h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0;
                j = i;
                i = i + 48 | 0;
                h = j;
                r = j + 16 | 0;
                q = j + 28 | 0;
                s = j + 4 | 0;
                l = j + 32 | 0;
                p = j + 36 | 0;
                n = j + 12 | 0;
                k = j + 24 | 0;
                m = j + 20 | 0;
                o = j + 8 | 0;
                c[r >> 2] = a;
                c[q >> 2] = e;
                c[s >> 2] = f;
                c[l >> 2] = g;
                c[s >> 2] = (c[s >> 2] | 0) + 1;
                a = $(c[s >> 2] | 0, c[(c[r >> 2] | 0) + 8 >> 2] | 0) | 0;
                c[m >> 2] = (c[(c[r >> 2] | 0) + 92 >> 2] | 0) + (b[(c[(c[r >> 2] | 0) + 88 >> 2] | 0) + (a + (c[q >> 2] | 0) << 1) >> 1] | 0);
                c[n >> 2] = 0;
                c[k >> 2] = d[c[m >> 2] >> 0] | 0;
                c[l >> 2] = (c[l >> 2] | 0) + -1;
                c[p >> 2] = 0;
                while (1) {
                    if ((c[p >> 2] | 0) >= 6) {
                        break
                    }
                    c[o >> 2] = (c[n >> 2] | 0) + (c[k >> 2] | 0) + 1 >> 1;
                    g = c[o >> 2] | 0;
                    if ((d[(c[m >> 2] | 0) + (c[o >> 2] | 0) >> 0] | 0) >= (c[l >> 2] | 0)) {
                        c[k >> 2] = g
                    } else {
                        c[n >> 2] = g
                    }
                    c[p >> 2] = (c[p >> 2] | 0) + 1
                }
                if ((c[n >> 2] | 0) == 0) {
                    o = -1
                } else {
                    o = d[(c[m >> 2] | 0) + (c[n >> 2] | 0) >> 0] | 0
                }
                if (((c[l >> 2] | 0) - o | 0) <= ((d[(c[m >> 2] | 0) + (c[k >> 2] | 0) >> 0] | 0) - (c[l >> 2] | 0) | 0)) {
                    c[h >> 2] = c[n >> 2];
                    s = c[h >> 2] | 0;
                    i = j;
                    return s | 0
                } else {
                    c[h >> 2] = c[k >> 2];
                    s = c[h >> 2] | 0;
                    i = j;
                    return s | 0
                }
                return 0
            }
            function Za(a, e, f, g) {
                a = a | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                var h = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
                h = i;
                i = i + 32 | 0;
                m = h + 16 | 0;
                l = h + 12 | 0;
                n = h + 8 | 0;
                k = h + 4 | 0;
                j = h;
                c[m >> 2] = a;
                c[l >> 2] = e;
                c[n >> 2] = f;
                c[k >> 2] = g;
                c[n >> 2] = (c[n >> 2] | 0) + 1;
                a = $(c[n >> 2] | 0, c[(c[m >> 2] | 0) + 8 >> 2] | 0) | 0;
                c[j >> 2] = (c[(c[m >> 2] | 0) + 92 >> 2] | 0) + (b[(c[(c[m >> 2] | 0) + 88 >> 2] | 0) + (a + (c[l >> 2] | 0) << 1) >> 1] | 0);
                if ((c[k >> 2] | 0) == 0) {
                    n = 0;
                    i = h;
                    return n | 0
                }
                n = (d[(c[j >> 2] | 0) + (c[k >> 2] | 0) >> 0] | 0) + 1 | 0;
                i = h;
                return n | 0
            }
            function _a(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                a = c[d >> 2] | 0;
                if ((c[d >> 2] | 0) < 8) {
                    i = b;
                    return a | 0
                }
                a = 8 + (a & 7) << (c[d >> 2] >> 3) - 1;
                i = b;
                return a | 0
            }
            function $a(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0;
                d = i;
                i = i + 16 | 0;
                e = d + 4 | 0;
                b = d;
                c[e >> 2] = a;
                a = c[e >> 2] | 0;
                if ((a | 0) == 48e3) {
                    c[b >> 2] = 1
                } else if ((a | 0) == 24e3) {
                    c[b >> 2] = 2
                } else if ((a | 0) == 16e3) {
                    c[b >> 2] = 3
                } else if ((a | 0) == 12e3) {
                    c[b >> 2] = 4
                } else if ((a | 0) == 8e3) {
                    c[b >> 2] = 6
                } else {
                    c[b >> 2] = 0
                }
                i = d;
                return c[b >> 2] | 0
            }
            function ab(a, d, e, f, g, h, j, k, l, m, n) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                m = m | 0;
                n = n | 0;
                var o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0,
                    C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0;
                F = i;
                i = i + 80 | 0;
                p = F + 32 | 0;
                q = F + 36 | 0;
                D = F + 20 | 0;
                t = F + 12 | 0;
                r = F + 44 | 0;
                K = F + 72 | 0;
                x = F + 66 | 0;
                L = F + 52 | 0;
                M = F + 8 | 0;
                A = F + 4 | 0;
                y = F + 28 | 0;
                s = F + 56 | 0;
                C = F + 60 | 0;
                E = F + 74 | 0;
                o = F + 70 | 0;
                u = F + 62 | 0;
                v = F + 68 | 0;
                w = F + 64 | 0;
                z = F + 24 | 0;
                H = F + 16 | 0;
                G = F;
                I = F + 48 | 0;
                J = F + 40 | 0;
                B = F + 76 | 0;
                c[p >> 2] = a;
                c[q >> 2] = d;
                c[D >> 2] = e;
                c[t >> 2] = f;
                c[r >> 2] = g;
                b[K >> 1] = h;
                b[x >> 1] = j;
                c[L >> 2] = k;
                c[M >> 2] = l;
                c[A >> 2] = m;
                c[y >> 2] = n;
                if ((b[K >> 1] | 0) == 0 ? (b[x >> 1] | 0) == 0 : 0) {
                    if ((c[q >> 2] | 0) == (c[p >> 2] | 0)) {
                        i = F;
                        return
                    }
                    $e(c[p >> 2] | 0, c[q >> 2] | 0, (c[r >> 2] << 2) + 0 | 0) | 0;
                    i = F;
                    return
                }
                b[C >> 1] = 16384 + ($(b[K >> 1] | 0, b[176 + ((c[L >> 2] | 0) * 6 | 0) >> 1] | 0) | 0) >> 15;
                b[E >> 1] = 16384 + ($(b[K >> 1] | 0, b[178 + ((c[L >> 2] | 0) * 6 | 0) >> 1] | 0) | 0) >> 15;
                b[o >> 1] = 16384 + ($(b[K >> 1] | 0, b[180 + ((c[L >> 2] | 0) * 6 | 0) >> 1] | 0) | 0) >> 15;
                b[u >> 1] = 16384 + ($(b[x >> 1] | 0, b[176 + ((c[M >> 2] | 0) * 6 | 0) >> 1] | 0) | 0) >> 15;
                b[v >> 1] = 16384 + ($(b[x >> 1] | 0, b[178 + ((c[M >> 2] | 0) * 6 | 0) >> 1] | 0) | 0) >> 15;
                b[w >> 1] = 16384 + ($(b[x >> 1] | 0, b[180 + ((c[M >> 2] | 0) * 6 | 0) >> 1] | 0) | 0) >> 15;
                c[H >> 2] = c[(c[q >> 2] | 0) + (0 - (c[t >> 2] | 0) + 1 << 2) >> 2];
                c[G >> 2] = c[(c[q >> 2] | 0) + (0 - (c[t >> 2] | 0) << 2) >> 2];
                c[I >> 2] = c[(c[q >> 2] | 0) + (0 - (c[t >> 2] | 0) - 1 << 2) >> 2];
                c[J >> 2] = c[(c[q >> 2] | 0) + (0 - (c[t >> 2] | 0) - 2 << 2) >> 2];
                if (((b[K >> 1] | 0) == (b[x >> 1] | 0) ? (c[D >> 2] | 0) == (c[t >> 2] | 0) : 0) ? (c[L >> 2] | 0) == (c[M >> 2] | 0) : 0) {
                    c[y >> 2] = 0
                }
                c[s >> 2] = 0;
                while (1) {
                    if ((c[s >> 2] | 0) >= (c[y >> 2] | 0)) {
                        break
                    }
                    c[z >> 2] = c[(c[q >> 2] | 0) + ((c[s >> 2] | 0) - (c[t >> 2] | 0) + 2 << 2) >> 2];
                    b[B >> 1] = ($(b[(c[A >> 2] | 0) + (c[s >> 2] << 1) >> 1] | 0, b[(c[A >> 2] | 0) + (c[s >> 2] << 1) >> 1] | 0) | 0) >> 15;
                    d = (($((32767 - (b[B >> 1] | 0) & 65535) << 16 >> 16, b[C >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    d = ($(d, (c[(c[q >> 2] | 0) + ((c[s >> 2] | 0) - (c[D >> 2] | 0) << 2) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    e = (($((32767 - (b[B >> 1] | 0) & 65535) << 16 >> 16, b[C >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    e = (c[(c[q >> 2] | 0) + (c[s >> 2] << 2) >> 2] | 0) + (d + (($(e, c[(c[q >> 2] | 0) + ((c[s >> 2] | 0) - (c[D >> 2] | 0) << 2) >> 2] & 65535 & 65535) | 0) >> 15)) | 0;
                    d = (($((32767 - (b[B >> 1] | 0) & 65535) << 16 >> 16, b[E >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    d = ($(d, ((c[(c[q >> 2] | 0) + ((c[s >> 2] | 0) - (c[D >> 2] | 0) + 1 << 2) >> 2] | 0) + (c[(c[q >> 2] | 0) + ((c[s >> 2] | 0) - (c[D >> 2] | 0) - 1 << 2) >> 2] | 0) >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    a = (($((32767 - (b[B >> 1] | 0) & 65535) << 16 >> 16, b[E >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    a = e + (d + (($(a, (c[(c[q >> 2] | 0) + ((c[s >> 2] | 0) - (c[D >> 2] | 0) + 1 << 2) >> 2] | 0) + (c[(c[q >> 2] | 0) + ((c[s >> 2] | 0) - (c[D >> 2] | 0) - 1 << 2) >> 2] | 0) & 65535 & 65535) | 0) >> 15)) | 0;
                    d = (($((32767 - (b[B >> 1] | 0) & 65535) << 16 >> 16, b[o >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    d = ($(d, ((c[(c[q >> 2] | 0) + ((c[s >> 2] | 0) - (c[D >> 2] | 0) + 2 << 2) >> 2] | 0) + (c[(c[q >> 2] | 0) + ((c[s >> 2] | 0) - (c[D >> 2] | 0) - 2 << 2) >> 2] | 0) >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    e = (($((32767 - (b[B >> 1] | 0) & 65535) << 16 >> 16, b[o >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    e = a + (d + (($(e, (c[(c[q >> 2] | 0) + ((c[s >> 2] | 0) - (c[D >> 2] | 0) + 2 << 2) >> 2] | 0) + (c[(c[q >> 2] | 0) + ((c[s >> 2] | 0) - (c[D >> 2] | 0) - 2 << 2) >> 2] | 0) & 65535 & 65535) | 0) >> 15)) | 0;
                    d = (($(b[B >> 1] | 0, b[u >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    d = ($(d, (c[G >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    a = (($(b[B >> 1] | 0, b[u >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    a = e + (d + (($(a, c[G >> 2] & 65535 & 65535) | 0) >> 15)) | 0;
                    d = (($(b[B >> 1] | 0, b[v >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    d = ($(d, ((c[H >> 2] | 0) + (c[I >> 2] | 0) >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    e = (($(b[B >> 1] | 0, b[v >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    e = a + (d + (($(e, (c[H >> 2] | 0) + (c[I >> 2] | 0) & 65535 & 65535) | 0) >> 15)) | 0;
                    d = (($(b[B >> 1] | 0, b[w >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    d = ($(d, ((c[z >> 2] | 0) + (c[J >> 2] | 0) >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    a = (($(b[B >> 1] | 0, b[w >> 1] | 0) | 0) >> 15 & 65535) << 16 >> 16;
                    a = e + (d + (($(a, (c[z >> 2] | 0) + (c[J >> 2] | 0) & 65535 & 65535) | 0) >> 15)) | 0;
                    c[(c[p >> 2] | 0) + (c[s >> 2] << 2) >> 2] = a;
                    c[J >> 2] = c[I >> 2];
                    c[I >> 2] = c[G >> 2];
                    c[G >> 2] = c[H >> 2];
                    c[H >> 2] = c[z >> 2];
                    c[s >> 2] = (c[s >> 2] | 0) + 1
                }
                if ((b[x >> 1] | 0) != 0) {
                    bb((c[p >> 2] | 0) + (c[s >> 2] << 2) | 0, (c[q >> 2] | 0) + (c[s >> 2] << 2) | 0, c[t >> 2] | 0, (c[r >> 2] | 0) - (c[s >> 2] | 0) | 0, b[u >> 1] | 0, b[v >> 1] | 0, b[w >> 1] | 0);
                    i = F;
                    return
                }
                if ((c[q >> 2] | 0) == (c[p >> 2] | 0)) {
                    i = F;
                    return
                }
                $e((c[p >> 2] | 0) + (c[y >> 2] << 2) | 0, (c[q >> 2] | 0) + (c[y >> 2] << 2) | 0, ((c[r >> 2] | 0) - (c[y >> 2] | 0) << 2) + 0 | 0) | 0;
                i = F;

            }
            function bb(a, d, e, f, g, h, j) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                var k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0;
                t = i;
                i = i + 48 | 0;
                x = t + 36 | 0;
                n = t + 16 | 0;
                o = t + 4 | 0;
                m = t + 8 | 0;
                q = t + 40 | 0;
                s = t + 42 | 0;
                v = t + 44 | 0;
                p = t + 24 | 0;
                k = t + 20 | 0;
                r = t + 28 | 0;
                u = t + 12 | 0;
                w = t;
                l = t + 32 | 0;
                c[x >> 2] = a;
                c[n >> 2] = d;
                c[o >> 2] = e;
                c[m >> 2] = f;
                b[q >> 1] = g;
                b[s >> 1] = h;
                b[v >> 1] = j;
                c[w >> 2] = c[(c[n >> 2] | 0) + (0 - (c[o >> 2] | 0) - 2 << 2) >> 2];
                c[u >> 2] = c[(c[n >> 2] | 0) + (0 - (c[o >> 2] | 0) - 1 << 2) >> 2];
                c[r >> 2] = c[(c[n >> 2] | 0) + (0 - (c[o >> 2] | 0) << 2) >> 2];
                c[k >> 2] = c[(c[n >> 2] | 0) + (0 - (c[o >> 2] | 0) + 1 << 2) >> 2];
                c[l >> 2] = 0;
                while (1) {
                    if ((c[l >> 2] | 0) >= (c[m >> 2] | 0)) {
                        break
                    }
                    c[p >> 2] = c[(c[n >> 2] | 0) + ((c[l >> 2] | 0) - (c[o >> 2] | 0) + 2 << 2) >> 2];
                    a = ($(b[q >> 1] | 0, (c[r >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    a = (c[(c[n >> 2] | 0) + (c[l >> 2] << 2) >> 2] | 0) + (a + (($(b[q >> 1] | 0, c[r >> 2] & 65535 & 65535) | 0) >> 15)) | 0;
                    d = ($(b[s >> 1] | 0, ((c[k >> 2] | 0) + (c[u >> 2] | 0) >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    d = a + (d + (($(b[s >> 1] | 0, (c[k >> 2] | 0) + (c[u >> 2] | 0) & 65535 & 65535) | 0) >> 15)) | 0;
                    a = ($(b[v >> 1] | 0, ((c[p >> 2] | 0) + (c[w >> 2] | 0) >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    a = d + (a + (($(b[v >> 1] | 0, (c[p >> 2] | 0) + (c[w >> 2] | 0) & 65535 & 65535) | 0) >> 15)) | 0;
                    c[(c[x >> 2] | 0) + (c[l >> 2] << 2) >> 2] = a;
                    c[w >> 2] = c[u >> 2];
                    c[u >> 2] = c[r >> 2];
                    c[r >> 2] = c[k >> 2];
                    c[k >> 2] = c[p >> 2];
                    c[l >> 2] = (c[l >> 2] | 0) + 1
                }
                i = t;

            }
            function cb(a, e, f, g) {
                a = a | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                var h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0;
                m = i;
                i = i + 32 | 0;
                k = m + 20 | 0;
                o = m + 16 | 0;
                l = m + 12 | 0;
                n = m + 8 | 0;
                j = m + 4 | 0;
                h = m;
                c[k >> 2] = a;
                c[o >> 2] = e;
                c[l >> 2] = f;
                c[n >> 2] = g;
                c[j >> 2] = 0;
                while (1) {
                    if ((c[j >> 2] | 0) >= (c[(c[k >> 2] | 0) + 8 >> 2] | 0)) {
                        break
                    }
                    c[h >> 2] = (b[(c[(c[k >> 2] | 0) + 24 >> 2] | 0) + ((c[j >> 2] | 0) + 1 << 1) >> 1] | 0) - (b[(c[(c[k >> 2] | 0) + 24 >> 2] | 0) + (c[j >> 2] << 1) >> 1] | 0) << c[l >> 2];
                    a = $(c[(c[k >> 2] | 0) + 8 >> 2] | 0, (c[l >> 2] << 1) + (c[n >> 2] | 0) - 1 | 0) | 0;
                    a = $((d[(c[(c[k >> 2] | 0) + 96 >> 2] | 0) + (a + (c[j >> 2] | 0)) >> 0] | 0) + 64 | 0, c[n >> 2] | 0) | 0;
                    a = ($(a, c[h >> 2] | 0) | 0) >> 2;
                    c[(c[o >> 2] | 0) + (c[j >> 2] << 2) >> 2] = a;
                    c[j >> 2] = (c[j >> 2] | 0) + 1
                }
                i = m;

            }
            function db(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0;
                b = i;
                i = i + 16 | 0;
                d = b + 4 | 0;
                e = b;
                c[d >> 2] = a;
                c[e >> 2] = qc(48e3, 960, 0) | 0;
                a = eb(c[e >> 2] | 0, c[d >> 2] | 0) | 0;
                i = b;
                return a | 0
            }
            function eb(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0;
                e = i;
                i = i + 16 | 0;
                f = e + 8 | 0;
                g = e + 4 | 0;
                d = e;
                c[f >> 2] = a;
                c[g >> 2] = b;
                a = 84 + (($(c[g >> 2] | 0, 2048 + (c[(c[f >> 2] | 0) + 4 >> 2] | 0) | 0) | 0) - 1 << 2) | 0;
                c[d >> 2] = a + ((c[g >> 2] | 0) * 24 << 1) + (c[(c[f >> 2] | 0) + 8 >> 2] << 3 << 1);
                i = e;
                return c[d >> 2] | 0
            }
            function fb(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0;
                e = i;
                i = i + 32 | 0;
                f = e + 16 | 0;
                j = e + 12 | 0;
                h = e + 8 | 0;
                k = e + 4 | 0;
                g = e;
                c[j >> 2] = a;
                c[h >> 2] = b;
                c[k >> 2] = d;
                b = c[j >> 2] | 0;
                a = qc(48e3, 960, 0) | 0;
                c[g >> 2] = gb(b, a, c[k >> 2] | 0) | 0;
                if ((c[g >> 2] | 0) != 0) {
                    c[f >> 2] = c[g >> 2];
                    k = c[f >> 2] | 0;
                    i = e;
                    return k | 0
                }
                k = $a(c[h >> 2] | 0) | 0;
                c[(c[j >> 2] | 0) + 16 >> 2] = k;
                if ((c[(c[j >> 2] | 0) + 16 >> 2] | 0) == 0) {
                    c[f >> 2] = -1;
                    k = c[f >> 2] | 0;
                    i = e;
                    return k | 0
                } else {
                    c[f >> 2] = 0;
                    k = c[f >> 2] | 0;
                    i = e;
                    return k | 0
                }
                return 0
            }
            function gb(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0;
                e = i;
                i = i + 32 | 0;
                f = e + 16 | 0;
                g = e + 12 | 0;
                h = e + 8 | 0;
                j = e + 4 | 0;
                c[g >> 2] = a;
                c[h >> 2] = b;
                c[j >> 2] = d;
                if ((c[j >> 2] | 0) < 0 | (c[j >> 2] | 0) > 2) {
                    c[f >> 2] = -1;
                    a = c[f >> 2] | 0;
                    i = e;
                    return a | 0
                }
                if ((c[g >> 2] | 0) == 0) {
                    c[f >> 2] = -7;
                    a = c[f >> 2] | 0;
                    i = e;
                    return a | 0
                } else {
                    a = c[g >> 2] | 0;
                    Xe(a | 0, 0, eb(c[h >> 2] | 0, c[j >> 2] | 0) | 0) | 0;
                    c[c[g >> 2] >> 2] = c[h >> 2];
                    c[(c[g >> 2] | 0) + 4 >> 2] = c[(c[h >> 2] | 0) + 4 >> 2];
                    a = c[j >> 2] | 0;
                    c[(c[g >> 2] | 0) + 8 >> 2] = a;
                    c[(c[g >> 2] | 0) + 12 >> 2] = a;
                    c[(c[g >> 2] | 0) + 16 >> 2] = 1;
                    c[(c[g >> 2] | 0) + 20 >> 2] = 0;
                    c[(c[g >> 2] | 0) + 24 >> 2] = c[(c[c[g >> 2] >> 2] | 0) + 12 >> 2];
                    c[(c[g >> 2] | 0) + 28 >> 2] = 1;
                    a = vb() | 0;
                    c[(c[g >> 2] | 0) + 32 >> 2] = a;
                    c[(c[g >> 2] | 0) + 48 >> 2] = 0;
                    ob(c[g >> 2] | 0, 4028, e) | 0;
                    c[f >> 2] = 0;
                    a = c[f >> 2] | 0;
                    i = e;
                    return a | 0
                }
                return 0
            }
            function hb(a, d, e, f, g, h, j) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                var k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0,
                    y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0,
                    M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0,
                    _ = 0, aa = 0, ba = 0, ca = 0, da = 0, ea = 0, fa = 0, ga = 0, ha = 0, ja = 0, ka = 0, la = 0,
                    ma = 0, oa = 0, pa = 0, qa = 0, ra = 0;
                C = i;
                i = i + 288 | 0;
                p = C + 164 | 0;
                t = C + 148 | 0;
                pa = C + 8 | 0;
                k = C + 4 | 0;
                l = C + 240 | 0;
                F = C + 264 | 0;
                A = C + 156 | 0;
                E = C + 24 | 0;
                u = C + 28 | 0;
                B = C + 32 | 0;
                v = C + 36 | 0;
                P = C + 40 | 0;
                _ = C + 44 | 0;
                qa = C + 48 | 0;
                aa = C + 96 | 0;
                m = C + 104 | 0;
                ra = C + 112 | 0;
                n = C + 116 | 0;
                x = C + 120 | 0;
                y = C + 124 | 0;
                G = C + 128 | 0;
                X = C + 132 | 0;
                N = C + 136 | 0;
                la = C + 140 | 0;
                q = C + 244 | 0;
                J = C + 252 | 0;
                H = C + 260 | 0;
                o = C + 268 | 0;
                w = C + 272 | 0;
                V = C + 276 | 0;
                Q = C + 168 | 0;
                Z = C + 172 | 0;
                K = C + 176 | 0;
                L = C + 280 | 0;
                R = C + 184 | 0;
                Y = C + 188 | 0;
                ba = C + 192 | 0;
                T = C + 196 | 0;
                ca = C + 200 | 0;
                da = C + 204 | 0;
                M = C + 208 | 0;
                S = C + 212 | 0;
                W = C + 216 | 0;
                U = C + 220 | 0;
                O = C + 224 | 0;
                z = C + 228 | 0;
                D = C + 232 | 0;
                I = C + 16 | 0;
                ka = C;
                oa = C + 12 | 0;
                ma = C + 236 | 0;
                r = C + 144 | 0;
                ja = C + 248 | 0;
                ha = C + 152 | 0;
                fa = C + 256 | 0;
                ea = C + 20 | 0;
                ga = C + 160 | 0;
                s = C + 180 | 0;
                c[t >> 2] = a;
                c[pa >> 2] = d;
                c[k >> 2] = e;
                c[l >> 2] = f;
                c[F >> 2] = g;
                c[A >> 2] = h;
                c[E >> 2] = j;
                c[q >> 2] = c[(c[t >> 2] | 0) + 8 >> 2];
                c[R >> 2] = 0;
                c[Y >> 2] = 0;
                c[W >> 2] = 0;
                c[O >> 2] = c[(c[t >> 2] | 0) + 12 >> 2];
                c[z >> 2] = c[c[t >> 2] >> 2];
                c[D >> 2] = c[(c[z >> 2] | 0) + 8 >> 2];
                c[I >> 2] = c[(c[z >> 2] | 0) + 4 >> 2];
                c[ka >> 2] = c[(c[z >> 2] | 0) + 24 >> 2];
                c[o >> 2] = c[(c[t >> 2] | 0) + 20 >> 2];
                c[w >> 2] = c[(c[t >> 2] | 0) + 24 >> 2];
                c[F >> 2] = $(c[F >> 2] | 0, c[(c[t >> 2] | 0) + 16 >> 2] | 0) | 0;
                c[ra >> 2] = (c[t >> 2] | 0) + 80 + (($(2048 + (c[I >> 2] | 0) | 0, c[q >> 2] | 0) | 0) << 2);
                c[n >> 2] = (c[ra >> 2] | 0) + ((c[q >> 2] | 0) * 24 << 1);
                c[x >> 2] = (c[n >> 2] | 0) + (c[D >> 2] << 1 << 1);
                c[y >> 2] = (c[x >> 2] | 0) + (c[D >> 2] << 1 << 1);
                c[G >> 2] = (c[y >> 2] | 0) + (c[D >> 2] << 1 << 1);
                c[J >> 2] = 0;
                while (1) {
                    if ((c[J >> 2] | 0) > (c[(c[z >> 2] | 0) + 28 >> 2] | 0)) {
                        break
                    }
                    if ((c[(c[z >> 2] | 0) + 36 >> 2] << c[J >> 2] | 0) == (c[F >> 2] | 0)) {
                        break
                    }
                    c[J >> 2] = (c[J >> 2] | 0) + 1
                }
                if ((c[J >> 2] | 0) > (c[(c[z >> 2] | 0) + 28 >> 2] | 0)) {
                    c[p >> 2] = -1;
                    ra = c[p >> 2] | 0;
                    i = C;
                    return ra | 0
                }
                c[H >> 2] = 1 << c[J >> 2];
                if (!((c[k >> 2] | 0) < 0 | (c[k >> 2] | 0) > 1275) ? (c[l >> 2] | 0) != 0 : 0) {
                    c[v >> 2] = $(c[H >> 2] | 0, c[(c[z >> 2] | 0) + 36 >> 2] | 0) | 0;
                    c[u >> 2] = 0;
                    do {
                        ra = (c[t >> 2] | 0) + 80 + (($(c[u >> 2] | 0, 2048 + (c[I >> 2] | 0) | 0) | 0) << 2) | 0;
                        c[aa + (c[u >> 2] << 2) >> 2] = ra;
                        c[m + (c[u >> 2] << 2) >> 2] = (c[aa + (c[u >> 2] << 2) >> 2] | 0) + 8192 + (0 - (c[v >> 2] | 0) << 2);
                        ra = (c[u >> 2] | 0) + 1 | 0;
                        c[u >> 2] = ra
                    } while ((ra | 0) < (c[q >> 2] | 0));
                    c[V >> 2] = c[w >> 2];
                    if ((c[V >> 2] | 0) > (c[(c[z >> 2] | 0) + 12 >> 2] | 0)) {
                        c[V >> 2] = c[(c[z >> 2] | 0) + 12 >> 2]
                    }
                    if ((c[pa >> 2] | 0) != 0 ? (c[k >> 2] | 0) > 1 : 0) {
                        if ((c[A >> 2] | 0) == 0) {
                            Hb(qa, c[pa >> 2] | 0, c[k >> 2] | 0);
                            c[A >> 2] = qa
                        }
                        a:do {
                            if ((c[O >> 2] | 0) == 1) {
                                c[B >> 2] = 0;
                                while (1) {
                                    if ((c[B >> 2] | 0) >= (c[D >> 2] | 0)) {
                                        break a
                                    }
                                    if ((b[(c[n >> 2] | 0) + (c[B >> 2] << 1) >> 1] | 0) > (b[(c[n >> 2] | 0) + ((c[D >> 2] | 0) + (c[B >> 2] | 0) << 1) >> 1] | 0)) {
                                        pa = b[(c[n >> 2] | 0) + (c[B >> 2] << 1) >> 1] | 0
                                    } else {
                                        pa = b[(c[n >> 2] | 0) + ((c[D >> 2] | 0) + (c[B >> 2] | 0) << 1) >> 1] | 0
                                    }
                                    b[(c[n >> 2] | 0) + (c[B >> 2] << 1) >> 1] = pa << 16 >> 16;
                                    c[B >> 2] = (c[B >> 2] | 0) + 1
                                }
                            }
                        } while (0);
                        c[ba >> 2] = c[k >> 2] << 3;
                        c[ca >> 2] = kb(c[A >> 2] | 0) | 0;
                        do {
                            if ((c[ca >> 2] | 0) < (c[ba >> 2] | 0)) {
                                if ((c[ca >> 2] | 0) == 1) {
                                    c[U >> 2] = Ob(c[A >> 2] | 0, 15) | 0;
                                    break
                                } else {
                                    c[U >> 2] = 0;
                                    break
                                }
                            } else {
                                c[U >> 2] = 1
                            }
                        } while (0);
                        if ((c[U >> 2] | 0) != 0) {
                            c[ca >> 2] = c[k >> 2] << 3;
                            qa = c[ca >> 2] | 0;
                            qa = qa - (kb(c[A >> 2] | 0) | 0) | 0;
                            ra = (c[A >> 2] | 0) + 20 | 0;
                            c[ra >> 2] = (c[ra >> 2] | 0) + qa
                        }
                        b[L >> 1] = 0;
                        c[K >> 2] = 0;
                        c[M >> 2] = 0;
                        if ((c[o >> 2] | 0) == 0 ? ((c[ca >> 2] | 0) + 16 | 0) <= (c[ba >> 2] | 0) : 0) {
                            if ((Ob(c[A >> 2] | 0, 1) | 0) != 0) {
                                c[ma >> 2] = Qb(c[A >> 2] | 0, 6) | 0;
                                ra = 16 << c[ma >> 2];
                                c[K >> 2] = ra + (Rb(c[A >> 2] | 0, 4 + (c[ma >> 2] | 0) | 0) | 0) - 1;
                                c[oa >> 2] = Rb(c[A >> 2] | 0, 3) | 0;
                                ra = (kb(c[A >> 2] | 0) | 0) + 2 | 0;
                                if ((ra | 0) <= (c[ba >> 2] | 0)) {
                                    c[M >> 2] = Pb(c[A >> 2] | 0, 232, 2) | 0
                                }
                                b[L >> 1] = ((c[oa >> 2] | 0) + 1 | 0) * 3072
                            }
                            c[ca >> 2] = kb(c[A >> 2] | 0) | 0
                        }
                        if ((c[J >> 2] | 0) > 0 ? ((c[ca >> 2] | 0) + 3 | 0) <= (c[ba >> 2] | 0) : 0) {
                            c[N >> 2] = Ob(c[A >> 2] | 0, 3) | 0;
                            c[ca >> 2] = kb(c[A >> 2] | 0) | 0
                        } else {
                            c[N >> 2] = 0
                        }
                        if ((c[N >> 2] | 0) != 0) {
                            c[X >> 2] = c[H >> 2]
                        } else {
                            c[X >> 2] = 0
                        }
                        if (((c[ca >> 2] | 0) + 3 | 0) <= (c[ba >> 2] | 0)) {
                            ma = Ob(c[A >> 2] | 0, 3) | 0
                        } else {
                            ma = 0
                        }
                        c[la >> 2] = ma;
                        Cc(c[z >> 2] | 0, c[o >> 2] | 0, c[w >> 2] | 0, c[n >> 2] | 0, c[la >> 2] | 0, c[A >> 2] | 0, c[O >> 2] | 0, c[J >> 2] | 0);
                        ra = c[D >> 2] | 0;
                        c[r >> 2] = ia() | 0;
                        la = i;
                        i = i + ((4 * ra | 0) + 15 & -16) | 0;
                        lb(c[o >> 2] | 0, c[w >> 2] | 0, c[N >> 2] | 0, la, c[J >> 2] | 0, c[A >> 2] | 0);
                        c[ca >> 2] = kb(c[A >> 2] | 0) | 0;
                        c[P >> 2] = 2;
                        if (((c[ca >> 2] | 0) + 4 | 0) <= (c[ba >> 2] | 0)) {
                            c[P >> 2] = Pb(c[A >> 2] | 0, 240, 5) | 0
                        }
                        oa = i;
                        i = i + ((4 * (c[D >> 2] | 0) | 0) + 15 & -16) | 0;
                        cb(c[z >> 2] | 0, oa, c[J >> 2] | 0, c[O >> 2] | 0);
                        ma = i;
                        i = i + ((4 * (c[D >> 2] | 0) | 0) + 15 & -16) | 0;
                        c[da >> 2] = 6;
                        c[ba >> 2] = c[ba >> 2] << 3;
                        c[ca >> 2] = Gb(c[A >> 2] | 0) | 0;
                        c[B >> 2] = c[o >> 2];
                        while (1) {
                            if ((c[B >> 2] | 0) >= (c[w >> 2] | 0)) {
                                break
                            }
                            pa = $(c[O >> 2] | 0, (b[(c[ka >> 2] | 0) + ((c[B >> 2] | 0) + 1 << 1) >> 1] | 0) - (b[(c[ka >> 2] | 0) + (c[B >> 2] << 1) >> 1] | 0) | 0) | 0;
                            c[ja >> 2] = pa << c[J >> 2];
                            pa = c[ja >> 2] | 0;
                            if ((c[ja >> 2] << 3 | 0) < ((48 > (c[ja >> 2] | 0) ? 48 : c[ja >> 2] | 0) | 0)) {
                                pa = pa << 3
                            } else {
                                pa = 48 > (pa | 0) ? 48 : c[ja >> 2] | 0
                            }
                            c[ha >> 2] = pa;
                            c[fa >> 2] = c[da >> 2];
                            c[ea >> 2] = 0;
                            while (1) {
                                if (((c[ca >> 2] | 0) + (c[fa >> 2] << 3) | 0) >= (c[ba >> 2] | 0)) {
                                    break
                                }
                                if ((c[ea >> 2] | 0) >= (c[oa + (c[B >> 2] << 2) >> 2] | 0)) {
                                    break
                                }
                                c[ga >> 2] = Ob(c[A >> 2] | 0, c[fa >> 2] | 0) | 0;
                                c[ca >> 2] = Gb(c[A >> 2] | 0) | 0;
                                if ((c[ga >> 2] | 0) == 0) {
                                    break
                                }
                                c[ea >> 2] = (c[ea >> 2] | 0) + (c[ha >> 2] | 0);
                                c[ba >> 2] = (c[ba >> 2] | 0) - (c[ha >> 2] | 0);
                                c[fa >> 2] = 1
                            }
                            c[ma + (c[B >> 2] << 2) >> 2] = c[ea >> 2];
                            if ((c[ea >> 2] | 0) > 0) {
                                if (2 > ((c[da >> 2] | 0) - 1 | 0)) {
                                    pa = 2
                                } else {
                                    pa = (c[da >> 2] | 0) - 1 | 0
                                }
                                c[da >> 2] = pa
                            }
                            c[B >> 2] = (c[B >> 2] | 0) + 1
                        }
                        da = i;
                        i = i + ((4 * (c[D >> 2] | 0) | 0) + 15 & -16) | 0;
                        if (((c[ca >> 2] | 0) + 48 | 0) <= (c[ba >> 2] | 0)) {
                            ba = Pb(c[A >> 2] | 0, 248, 7) | 0
                        } else {
                            ba = 5
                        }
                        c[Z >> 2] = ba;
                        ra = c[k >> 2] << 3 << 3;
                        c[_ >> 2] = ra - (Gb(c[A >> 2] | 0) | 0) - 1;
                        do {
                            if ((c[N >> 2] | 0) != 0) {
                                if ((c[J >> 2] | 0) < 2) {
                                    ba = 0;
                                    break
                                }
                                ba = (c[_ >> 2] | 0) >= ((c[J >> 2] | 0) + 2 << 3 | 0)
                            } else {
                                ba = 0
                            }
                        } while (0);
                        c[S >> 2] = ba ? 8 : 0;
                        c[_ >> 2] = (c[_ >> 2] | 0) - (c[S >> 2] | 0);
                        ba = i;
                        i = i + ((4 * (c[D >> 2] | 0) | 0) + 15 & -16) | 0;
                        ca = i;
                        i = i + ((4 * (c[D >> 2] | 0) | 0) + 15 & -16) | 0;
                        c[Q >> 2] = Fc(c[z >> 2] | 0, c[o >> 2] | 0, c[w >> 2] | 0, ma, oa, c[Z >> 2] | 0, R, Y, c[_ >> 2] | 0, T, ba, da, ca, c[O >> 2] | 0, c[J >> 2] | 0, c[A >> 2] | 0, 0, 0, 0) | 0;
                        Dc(c[z >> 2] | 0, c[o >> 2] | 0, c[w >> 2] | 0, c[n >> 2] | 0, da, c[A >> 2] | 0, c[O >> 2] | 0);
                        c[u >> 2] = 0;
                        do {
                            $e(c[aa + (c[u >> 2] << 2) >> 2] | 0, (c[aa + (c[u >> 2] << 2) >> 2] | 0) + (c[v >> 2] << 2) | 0, (2048 - (c[v >> 2] | 0) + ((c[I >> 2] | 0) / 2 | 0) << 2) + 0 | 0) | 0;
                            ra = (c[u >> 2] | 0) + 1 | 0;
                            c[u >> 2] = ra
                        } while ((ra | 0) < (c[q >> 2] | 0));
                        ra = $(c[O >> 2] | 0, c[D >> 2] | 0) | 0;
                        _ = i;
                        i = i + ((1 * ra | 0) + 15 & -16) | 0;
                        ra = $(c[O >> 2] | 0, c[v >> 2] | 0) | 0;
                        Z = i;
                        i = i + ((2 * ra | 0) + 15 & -16) | 0;
                        if ((c[O >> 2] | 0) == 2) {
                            aa = Z + (c[v >> 2] << 1) | 0
                        } else {
                            aa = 0
                        }
                        Ia(0, c[z >> 2] | 0, c[o >> 2] | 0, c[w >> 2] | 0, Z, aa, _, 0, ba, c[X >> 2] | 0, c[P >> 2] | 0, c[Y >> 2] | 0, c[R >> 2] | 0, la, (c[k >> 2] << 6) - (c[S >> 2] | 0) | 0, c[T >> 2] | 0, c[A >> 2] | 0, c[J >> 2] | 0, c[Q >> 2] | 0, (c[t >> 2] | 0) + 36 | 0);
                        if ((c[S >> 2] | 0) > 0) {
                            c[W >> 2] = Rb(c[A >> 2] | 0, 1) | 0
                        }
                        e = c[z >> 2] | 0;
                        d = c[o >> 2] | 0;
                        a = c[w >> 2] | 0;
                        qa = c[n >> 2] | 0;
                        ra = c[k >> 2] << 3;
                        ra = ra - (kb(c[A >> 2] | 0) | 0) | 0;
                        Ec(e, d, a, qa, da, ca, ra, c[A >> 2] | 0, c[O >> 2] | 0);
                        if ((c[W >> 2] | 0) != 0) {
                            Ea(c[z >> 2] | 0, Z, _, c[J >> 2] | 0, c[O >> 2] | 0, c[v >> 2] | 0, c[o >> 2] | 0, c[w >> 2] | 0, c[n >> 2] | 0, c[x >> 2] | 0, c[y >> 2] | 0, ba, c[(c[t >> 2] | 0) + 36 >> 2] | 0)
                        }
                        b:do {
                            if ((c[U >> 2] | 0) != 0) {
                                c[B >> 2] = 0;
                                while (1) {
                                    if ((c[B >> 2] | 0) >= ($(c[O >> 2] | 0, c[D >> 2] | 0) | 0)) {
                                        break b
                                    }
                                    b[(c[n >> 2] | 0) + (c[B >> 2] << 1) >> 1] = -28672;
                                    c[B >> 2] = (c[B >> 2] | 0) + 1
                                }
                            }
                        } while (0);
                        mb(c[z >> 2] | 0, Z, m, c[n >> 2] | 0, c[o >> 2] | 0, c[V >> 2] | 0, c[O >> 2] | 0, c[q >> 2] | 0, c[N >> 2] | 0, c[J >> 2] | 0, c[(c[t >> 2] | 0) + 16 >> 2] | 0, c[U >> 2] | 0);
                        c[u >> 2] = 0;
                        do {
                            if ((c[(c[t >> 2] | 0) + 52 >> 2] | 0) > 15) {
                                P = c[(c[t >> 2] | 0) + 52 >> 2] | 0
                            } else {
                                P = 15
                            }
                            c[(c[t >> 2] | 0) + 52 >> 2] = P;
                            if ((c[(c[t >> 2] | 0) + 56 >> 2] | 0) > 15) {
                                P = c[(c[t >> 2] | 0) + 56 >> 2] | 0
                            } else {
                                P = 15
                            }
                            c[(c[t >> 2] | 0) + 56 >> 2] = P;
                            ab(c[m + (c[u >> 2] << 2) >> 2] | 0, c[m + (c[u >> 2] << 2) >> 2] | 0, c[(c[t >> 2] | 0) + 56 >> 2] | 0, c[(c[t >> 2] | 0) + 52 >> 2] | 0, c[(c[z >> 2] | 0) + 36 >> 2] | 0, b[(c[t >> 2] | 0) + 62 >> 1] | 0, b[(c[t >> 2] | 0) + 60 >> 1] | 0, c[(c[t >> 2] | 0) + 68 >> 2] | 0, c[(c[t >> 2] | 0) + 64 >> 2] | 0, c[(c[z >> 2] | 0) + 52 >> 2] | 0, c[I >> 2] | 0);
                            if ((c[J >> 2] | 0) != 0) {
                                ab((c[m + (c[u >> 2] << 2) >> 2] | 0) + (c[(c[z >> 2] | 0) + 36 >> 2] << 2) | 0, (c[m + (c[u >> 2] << 2) >> 2] | 0) + (c[(c[z >> 2] | 0) + 36 >> 2] << 2) | 0, c[(c[t >> 2] | 0) + 52 >> 2] | 0, c[K >> 2] | 0, (c[v >> 2] | 0) - (c[(c[z >> 2] | 0) + 36 >> 2] | 0) | 0, b[(c[t >> 2] | 0) + 60 >> 1] | 0, b[L >> 1] | 0, c[(c[t >> 2] | 0) + 64 >> 2] | 0, c[M >> 2] | 0, c[(c[z >> 2] | 0) + 52 >> 2] | 0, c[I >> 2] | 0)
                            }
                            ra = (c[u >> 2] | 0) + 1 | 0;
                            c[u >> 2] = ra
                        } while ((ra | 0) < (c[q >> 2] | 0));
                        c[(c[t >> 2] | 0) + 56 >> 2] = c[(c[t >> 2] | 0) + 52 >> 2];
                        b[(c[t >> 2] | 0) + 62 >> 1] = b[(c[t >> 2] | 0) + 60 >> 1] | 0;
                        c[(c[t >> 2] | 0) + 68 >> 2] = c[(c[t >> 2] | 0) + 64 >> 2];
                        c[(c[t >> 2] | 0) + 52 >> 2] = c[K >> 2];
                        b[(c[t >> 2] | 0) + 60 >> 1] = b[L >> 1] | 0;
                        c[(c[t >> 2] | 0) + 64 >> 2] = c[M >> 2];
                        if ((c[J >> 2] | 0) != 0) {
                            c[(c[t >> 2] | 0) + 56 >> 2] = c[(c[t >> 2] | 0) + 52 >> 2];
                            b[(c[t >> 2] | 0) + 62 >> 1] = b[(c[t >> 2] | 0) + 60 >> 1] | 0;
                            c[(c[t >> 2] | 0) + 68 >> 2] = c[(c[t >> 2] | 0) + 64 >> 2]
                        }
                        if ((c[O >> 2] | 0) == 1) {
                            Ze((c[n >> 2] | 0) + (c[D >> 2] << 1) | 0, c[n >> 2] | 0, (c[D >> 2] << 1) + 0 | 0) | 0
                        }
                        c:do {
                            if ((c[N >> 2] | 0) != 0) {
                                c[B >> 2] = 0;
                                while (1) {
                                    if ((c[B >> 2] | 0) >= (c[D >> 2] << 1 | 0)) {
                                        break c
                                    }
                                    G = c[B >> 2] | 0;
                                    if ((b[(c[x >> 2] | 0) + (c[B >> 2] << 1) >> 1] | 0) < (b[(c[n >> 2] | 0) + (c[B >> 2] << 1) >> 1] | 0)) {
                                        G = b[(c[x >> 2] | 0) + (G << 1) >> 1] | 0
                                    } else {
                                        G = b[(c[n >> 2] | 0) + (G << 1) >> 1] | 0
                                    }
                                    b[(c[x >> 2] | 0) + (c[B >> 2] << 1) >> 1] = G << 16 >> 16;
                                    c[B >> 2] = (c[B >> 2] | 0) + 1
                                }
                            } else {
                                Ze(c[y >> 2] | 0, c[x >> 2] | 0, (c[D >> 2] << 1 << 1) + 0 | 0) | 0;
                                Ze(c[x >> 2] | 0, c[n >> 2] | 0, (c[D >> 2] << 1 << 1) + 0 | 0) | 0;
                                c[B >> 2] = 0;
                                while (1) {
                                    if ((c[B >> 2] | 0) >= (c[D >> 2] << 1 | 0)) {
                                        break c
                                    }
                                    I = c[B >> 2] | 0;
                                    if (((b[(c[G >> 2] | 0) + (c[B >> 2] << 1) >> 1] | 0) + (c[H >> 2] | 0) | 0) < (b[(c[n >> 2] | 0) + (c[B >> 2] << 1) >> 1] | 0)) {
                                        I = (b[(c[G >> 2] | 0) + (I << 1) >> 1] | 0) + (c[H >> 2] | 0) | 0
                                    } else {
                                        I = b[(c[n >> 2] | 0) + (I << 1) >> 1] | 0
                                    }
                                    b[(c[G >> 2] | 0) + (c[B >> 2] << 1) >> 1] = I;
                                    c[B >> 2] = (c[B >> 2] | 0) + 1
                                }
                            }
                        } while (0);
                        c[u >> 2] = 0;
                        do {
                            c[B >> 2] = 0;
                            while (1) {
                                if ((c[B >> 2] | 0) >= (c[o >> 2] | 0)) {
                                    break
                                }
                                ra = $(c[u >> 2] | 0, c[D >> 2] | 0) | 0;
                                b[(c[n >> 2] | 0) + (ra + (c[B >> 2] | 0) << 1) >> 1] = 0;
                                ra = $(c[u >> 2] | 0, c[D >> 2] | 0) | 0;
                                b[(c[y >> 2] | 0) + (ra + (c[B >> 2] | 0) << 1) >> 1] = -28672;
                                ra = $(c[u >> 2] | 0, c[D >> 2] | 0) | 0;
                                b[(c[x >> 2] | 0) + (ra + (c[B >> 2] | 0) << 1) >> 1] = -28672;
                                c[B >> 2] = (c[B >> 2] | 0) + 1
                            }
                            c[B >> 2] = c[w >> 2];
                            while (1) {
                                G = c[u >> 2] | 0;
                                if ((c[B >> 2] | 0) >= (c[D >> 2] | 0)) {
                                    break
                                }
                                ra = $(G, c[D >> 2] | 0) | 0;
                                b[(c[n >> 2] | 0) + (ra + (c[B >> 2] | 0) << 1) >> 1] = 0;
                                ra = $(c[u >> 2] | 0, c[D >> 2] | 0) | 0;
                                b[(c[y >> 2] | 0) + (ra + (c[B >> 2] | 0) << 1) >> 1] = -28672;
                                ra = $(c[u >> 2] | 0, c[D >> 2] | 0) | 0;
                                b[(c[x >> 2] | 0) + (ra + (c[B >> 2] | 0) << 1) >> 1] = -28672;
                                c[B >> 2] = (c[B >> 2] | 0) + 1
                            }
                            ra = G + 1 | 0;
                            c[u >> 2] = ra
                        } while ((ra | 0) < 2);
                        c[(c[t >> 2] | 0) + 36 >> 2] = c[(c[A >> 2] | 0) + 28 >> 2];
                        jb(m, c[l >> 2] | 0, c[v >> 2] | 0, c[q >> 2] | 0, c[(c[t >> 2] | 0) + 16 >> 2] | 0, (c[z >> 2] | 0) + 16 | 0, (c[t >> 2] | 0) + 72 | 0, c[E >> 2] | 0);
                        c[(c[t >> 2] | 0) + 48 >> 2] = 0;
                        ra = kb(c[A >> 2] | 0) | 0;
                        if ((ra | 0) > (c[k >> 2] << 3 | 0)) {
                            c[p >> 2] = -3;
                            c[s >> 2] = 1
                        } else {
                            if ((nb(c[A >> 2] | 0) | 0) != 0) {
                                c[(c[t >> 2] | 0) + 40 >> 2] = 1
                            }
                            c[p >> 2] = (c[F >> 2] | 0) / (c[(c[t >> 2] | 0) + 16 >> 2] | 0) | 0;
                            c[s >> 2] = 1
                        }
                        na(c[r >> 2] | 0);
                        ra = c[p >> 2] | 0;
                        i = C;
                        return ra | 0
                    }
                    ib(c[t >> 2] | 0, c[v >> 2] | 0, c[J >> 2] | 0);
                    jb(m, c[l >> 2] | 0, c[v >> 2] | 0, c[q >> 2] | 0, c[(c[t >> 2] | 0) + 16 >> 2] | 0, (c[z >> 2] | 0) + 16 | 0, (c[t >> 2] | 0) + 72 | 0, c[E >> 2] | 0);
                    c[p >> 2] = (c[F >> 2] | 0) / (c[(c[t >> 2] | 0) + 16 >> 2] | 0) | 0;
                    ra = c[p >> 2] | 0;
                    i = C;
                    return ra | 0
                }
                c[p >> 2] = -1;
                ra = c[p >> 2] | 0;
                i = C;
                return ra | 0
            }
            function ib(a, d, e) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0,
                    u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0,
                    I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0,
                    W = 0, X = 0, Y = 0, Z = 0, _ = 0, aa = 0, ba = 0, ca = 0, da = 0, ea = 0, fa = 0, ga = 0, ha = 0,
                    ja = 0;
                o = i;
                i = i + 2464 | 0;
                k = o + 20 | 0;
                l = o + 80 | 0;
                r = o + 4 | 0;
                n = o + 248 | 0;
                f = o + 256 | 0;
                j = o + 76 | 0;
                g = o + 272 | 0;
                E = o + 24 | 0;
                B = o + 32 | 0;
                x = o + 36 | 0;
                ha = o + 40 | 0;
                ja = o + 44 | 0;
                v = o + 48 | 0;
                p = o + 52 | 0;
                z = o + 56 | 0;
                h = o + 60 | 0;
                H = o + 64 | 0;
                m = o + 236 | 0;
                ga = o + 244 | 0;
                M = o + 252 | 0;
                D = o + 260 | 0;
                w = o + 264 | 0;
                y = o + 184 | 0;
                F = o + 188 | 0;
                C = o + 192 | 0;
                A = o + 2384 | 0;
                u = o + 200 | 0;
                s = o + 204 | 0;
                t = o + 208 | 0;
                da = o + 212 | 0;
                X = o + 2442 | 0;
                P = o + 220 | 0;
                fa = o + 224 | 0;
                S = o + 336 | 0;
                R = o + 2444 | 0;
                Q = o + 280 | 0;
                G = o + 68 | 0;
                J = o + 232 | 0;
                T = o + 72 | 0;
                K = o + 240 | 0;
                aa = o + 8 | 0;
                O = o;
                ca = o + 84 | 0;
                ba = o + 288 | 0;
                V = o + 16 | 0;
                W = o + 228 | 0;
                Y = o + 12 | 0;
                _ = o + 216 | 0;
                Z = o + 2446 | 0;
                U = o + 2448 | 0;
                N = o + 2392 | 0;
                q = o + 196 | 0;
                L = o + 284 | 0;
                I = o + 282 | 0;
                ea = o + 2440 | 0;
                c[k >> 2] = a;
                c[l >> 2] = d;
                c[r >> 2] = e;
                c[j >> 2] = c[(c[k >> 2] | 0) + 8 >> 2];
                c[p >> 2] = c[c[k >> 2] >> 2];
                c[z >> 2] = c[(c[p >> 2] | 0) + 8 >> 2];
                c[h >> 2] = c[(c[p >> 2] | 0) + 4 >> 2];
                c[M >> 2] = c[(c[p >> 2] | 0) + 24 >> 2];
                c[n >> 2] = 0;
                do {
                    a = (c[k >> 2] | 0) + 80 + (($(c[n >> 2] | 0, 2048 + (c[h >> 2] | 0) | 0) | 0) << 2) | 0;
                    c[g + (c[n >> 2] << 2) >> 2] = a;
                    c[E + (c[n >> 2] << 2) >> 2] = (c[g + (c[n >> 2] << 2) >> 2] | 0) + 8192 + (0 - (c[l >> 2] | 0) << 2);
                    a = (c[n >> 2] | 0) + 1 | 0;
                    c[n >> 2] = a
                } while ((a | 0) < (c[j >> 2] | 0));
                c[B >> 2] = (c[k >> 2] | 0) + 80 + (($(2048 + (c[h >> 2] | 0) | 0, c[j >> 2] | 0) | 0) << 2);
                c[x >> 2] = (c[B >> 2] | 0) + ((c[j >> 2] | 0) * 24 << 1);
                c[ha >> 2] = (c[x >> 2] | 0) + (c[z >> 2] << 1 << 1);
                c[ja >> 2] = (c[ha >> 2] | 0) + (c[z >> 2] << 1 << 1);
                c[v >> 2] = (c[ja >> 2] | 0) + (c[z >> 2] << 1 << 1);
                c[m >> 2] = c[(c[k >> 2] | 0) + 48 >> 2];
                c[H >> 2] = c[(c[k >> 2] | 0) + 20 >> 2];
                if ((c[m >> 2] | 0) >= 5) {
                    e = 1
                } else {
                    e = (c[H >> 2] | 0) != 0
                }
                c[ga >> 2] = e & 1;
                if ((c[ga >> 2] | 0) != 0) {
                    c[y >> 2] = c[(c[k >> 2] | 0) + 24 >> 2];
                    if ((c[y >> 2] | 0) < (c[(c[p >> 2] | 0) + 12 >> 2] | 0)) {
                        q = c[y >> 2] | 0
                    } else {
                        q = c[(c[p >> 2] | 0) + 12 >> 2] | 0
                    }
                    do {
                        if ((c[H >> 2] | 0) <= (q | 0)) {
                            if ((c[y >> 2] | 0) < (c[(c[p >> 2] | 0) + 12 >> 2] | 0)) {
                                q = c[y >> 2] | 0;
                                break
                            } else {
                                q = c[(c[p >> 2] | 0) + 12 >> 2] | 0;
                                break
                            }
                        } else {
                            q = c[H >> 2] | 0
                        }
                    } while (0);
                    c[F >> 2] = q;
                    a = $(c[j >> 2] | 0, c[l >> 2] | 0) | 0;
                    c[C >> 2] = ia() | 0;
                    q = i;
                    i = i + ((2 * a | 0) + 15 & -16) | 0;
                    if ((c[m >> 2] | 0) >= 5) {
                        c[w >> 2] = c[v >> 2]
                    } else {
                        b[A >> 1] = (c[m >> 2] | 0) == 0 ? 1536 : 512;
                        c[n >> 2] = 0;
                        do {
                            c[f >> 2] = c[H >> 2];
                            while (1) {
                                if ((c[f >> 2] | 0) >= (c[y >> 2] | 0)) {
                                    break
                                }
                                a = $(c[n >> 2] | 0, c[z >> 2] | 0) | 0;
                                a = (c[x >> 2] | 0) + (a + (c[f >> 2] | 0) << 1) | 0;
                                b[a >> 1] = (b[a >> 1] | 0) - (b[A >> 1] | 0);
                                c[f >> 2] = (c[f >> 2] | 0) + 1
                            }
                            a = (c[n >> 2] | 0) + 1 | 0;
                            c[n >> 2] = a
                        } while ((a | 0) < (c[j >> 2] | 0));
                        c[w >> 2] = c[x >> 2]
                    }
                    c[D >> 2] = c[(c[k >> 2] | 0) + 36 >> 2];
                    c[n >> 2] = 0;
                    while (1) {
                        if ((c[n >> 2] | 0) >= (c[j >> 2] | 0)) {
                            break
                        }
                        c[f >> 2] = c[H >> 2];
                        while (1) {
                            if ((c[f >> 2] | 0) >= (c[F >> 2] | 0)) {
                                break
                            }
                            a = $(c[l >> 2] | 0, c[n >> 2] | 0) | 0;
                            c[s >> 2] = a + (b[(c[M >> 2] | 0) + (c[f >> 2] << 1) >> 1] << c[r >> 2]);
                            c[t >> 2] = (b[(c[M >> 2] | 0) + ((c[f >> 2] | 0) + 1 << 1) >> 1] | 0) - (b[(c[M >> 2] | 0) + (c[f >> 2] << 1) >> 1] | 0) << c[r >> 2];
                            c[u >> 2] = 0;
                            while (1) {
                                if ((c[u >> 2] | 0) >= (c[t >> 2] | 0)) {
                                    break
                                }
                                c[D >> 2] = za(c[D >> 2] | 0) | 0;
                                b[q + ((c[s >> 2] | 0) + (c[u >> 2] | 0) << 1) >> 1] = c[D >> 2] >> 20;
                                c[u >> 2] = (c[u >> 2] | 0) + 1
                            }
                            Oc(q + (c[s >> 2] << 1) | 0, c[t >> 2] | 0, 32767);
                            c[f >> 2] = (c[f >> 2] | 0) + 1
                        }
                        c[n >> 2] = (c[n >> 2] | 0) + 1
                    }
                    c[(c[k >> 2] | 0) + 36 >> 2] = c[D >> 2];
                    c[n >> 2] = 0;
                    do {
                        $e(c[g + (c[n >> 2] << 2) >> 2] | 0, (c[g + (c[n >> 2] << 2) >> 2] | 0) + (c[l >> 2] << 2) | 0, (2048 - (c[l >> 2] | 0) + (c[h >> 2] >> 1) << 2) + 0 | 0) | 0;
                        a = (c[n >> 2] | 0) + 1 | 0;
                        c[n >> 2] = a
                    } while ((a | 0) < (c[j >> 2] | 0));
                    mb(c[p >> 2] | 0, q, E, c[w >> 2] | 0, c[H >> 2] | 0, c[F >> 2] | 0, c[j >> 2] | 0, c[j >> 2] | 0, 0, c[r >> 2] | 0, c[(c[k >> 2] | 0) + 16 >> 2] | 0, 0);
                    na(c[C >> 2] | 0);
                    d = c[m >> 2] | 0;
                    d = d + 1 | 0;
                    a = c[k >> 2] | 0;
                    a = a + 48 | 0;
                    c[a >> 2] = d;
                    i = o;
                    return
                }
                b[X >> 1] = 32767;
                if ((c[m >> 2] | 0) == 0) {
                    a = rb(g, c[j >> 2] | 0, c[(c[k >> 2] | 0) + 32 >> 2] | 0) | 0;
                    c[P >> 2] = a;
                    c[(c[k >> 2] | 0) + 44 >> 2] = a
                } else {
                    c[P >> 2] = c[(c[k >> 2] | 0) + 44 >> 2];
                    b[X >> 1] = 26214
                }
                a = c[h >> 2] | 0;
                c[fa >> 2] = ia() | 0;
                r = i;
                i = i + ((4 * a | 0) + 15 & -16) | 0;
                c[da >> 2] = c[(c[p >> 2] | 0) + 52 >> 2];
                c[n >> 2] = 0;
                do {
                    c[G >> 2] = 0;
                    c[J >> 2] = c[g + (c[n >> 2] << 2) >> 2];
                    c[f >> 2] = 0;
                    while (1) {
                        if ((c[f >> 2] | 0) >= 1024) {
                            break
                        }
                        b[S + (c[f >> 2] << 1) >> 1] = (c[(c[J >> 2] | 0) + (1024 + (c[f >> 2] | 0) << 2) >> 2] | 0) + 2048 >> 12;
                        c[f >> 2] = (c[f >> 2] | 0) + 1
                    }
                    if ((c[m >> 2] | 0) == 0) {
                        Ab(S, ca, c[da >> 2] | 0, c[h >> 2] | 0, 24, 1024, c[(c[k >> 2] | 0) + 32 >> 2] | 0) | 0;
                        c[ca >> 2] = (c[ca >> 2] | 0) + (c[ca >> 2] >> 13);
                        c[f >> 2] = 1;
                        while (1) {
                            if ((c[f >> 2] | 0) > 24) {
                                break
                            }
                            a = (($(c[f >> 2] << 1, c[f >> 2] | 0) | 0) & 65535) << 16 >> 16;
                            a = ($(a, (c[ca + (c[f >> 2] << 2) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                            d = (($(c[f >> 2] << 1, c[f >> 2] | 0) | 0) & 65535) << 16 >> 16;
                            d = a + (($(d, c[ca + (c[f >> 2] << 2) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                            a = ca + (c[f >> 2] << 2) | 0;
                            c[a >> 2] = (c[a >> 2] | 0) - d;
                            c[f >> 2] = (c[f >> 2] | 0) + 1
                        }
                        wb((c[B >> 2] | 0) + ((c[n >> 2] | 0) * 24 << 1) | 0, ca, 24)
                    }
                    if ((c[P >> 2] << 1 | 0) < 1024) {
                        p = c[P >> 2] << 1
                    } else {
                        p = 1024
                    }
                    c[aa >> 2] = p;
                    c[f >> 2] = 0;
                    while (1) {
                        if ((c[f >> 2] | 0) >= 24) {
                            break
                        }
                        b[ba + (c[f >> 2] << 1) >> 1] = (c[(c[J >> 2] | 0) + (2048 - (c[aa >> 2] | 0) - 1 - (c[f >> 2] | 0) << 2) >> 2] | 0) + 2048 >> 12;
                        c[f >> 2] = (c[f >> 2] | 0) + 1
                    }
                    xb(S + 2048 + (0 - (c[aa >> 2] | 0) << 1) | 0, (c[B >> 2] | 0) + ((c[n >> 2] | 0) * 24 << 1) | 0, S + 2048 + (0 - (c[aa >> 2] | 0) << 1) | 0, c[aa >> 2] | 0, 24, ba);
                    c[V >> 2] = 1;
                    c[W >> 2] = 1;
                    if (0 > (((sb(tb(S + (1024 - (c[aa >> 2] | 0) << 1) | 0, c[aa >> 2] | 0) | 0) | 0) << 16 >> 16 << 1) - 20 | 0)) {
                        p = 0
                    } else {
                        p = ((sb(tb(S + (1024 - (c[aa >> 2] | 0) << 1) | 0, c[aa >> 2] | 0) | 0) | 0) << 16 >> 16 << 1) - 20 | 0
                    }
                    c[_ >> 2] = p;
                    c[Y >> 2] = c[aa >> 2] >> 1;
                    c[f >> 2] = 0;
                    while (1) {
                        if ((c[f >> 2] | 0) >= (c[Y >> 2] | 0)) {
                            break
                        }
                        b[Z >> 1] = b[S + (1024 - (c[Y >> 2] | 0) + (c[f >> 2] | 0) << 1) >> 1] | 0;
                        a = $(b[Z >> 1] | 0, b[Z >> 1] | 0) | 0;
                        c[V >> 2] = (c[V >> 2] | 0) + (a >> c[_ >> 2]);
                        b[Z >> 1] = b[S + (1024 - (c[Y >> 2] << 1) + (c[f >> 2] | 0) << 1) >> 1] | 0;
                        a = $(b[Z >> 1] | 0, b[Z >> 1] | 0) | 0;
                        c[W >> 2] = (c[W >> 2] | 0) + (a >> c[_ >> 2]);
                        c[f >> 2] = (c[f >> 2] | 0) + 1
                    }
                    c[V >> 2] = (c[V >> 2] | 0) < (c[W >> 2] | 0) ? c[V >> 2] | 0 : c[W >> 2] | 0;
                    b[R >> 1] = mc(ic(c[V >> 2] >> 1, c[W >> 2] | 0) | 0) | 0;
                    $e(c[J >> 2] | 0, (c[J >> 2] | 0) + (c[l >> 2] << 2) | 0, (2048 - (c[l >> 2] | 0) << 2) + 0 | 0) | 0;
                    c[T >> 2] = 1024 - (c[P >> 2] | 0);
                    c[K >> 2] = (c[l >> 2] | 0) + (c[h >> 2] | 0);
                    b[Q >> 1] = ($(b[X >> 1] | 0, b[R >> 1] | 0) | 0) >> 15;
                    c[O >> 2] = 0;
                    c[f >> 2] = 0;
                    while (1) {
                        if ((c[f >> 2] | 0) >= (c[K >> 2] | 0)) {
                            break
                        }
                        if ((c[O >> 2] | 0) >= (c[P >> 2] | 0)) {
                            c[O >> 2] = (c[O >> 2] | 0) - (c[P >> 2] | 0);
                            b[Q >> 1] = ($(b[Q >> 1] | 0, b[R >> 1] | 0) | 0) >> 15
                        }
                        a = ($(b[Q >> 1] | 0, b[S + ((c[T >> 2] | 0) + (c[O >> 2] | 0) << 1) >> 1] | 0) | 0) >> 15 << 12;
                        c[(c[J >> 2] | 0) + (2048 - (c[l >> 2] | 0) + (c[f >> 2] | 0) << 2) >> 2] = a;
                        b[U >> 1] = (c[(c[J >> 2] | 0) + (1024 - (c[l >> 2] | 0) + (c[T >> 2] | 0) + (c[O >> 2] | 0) << 2) >> 2] | 0) + 2048 >> 12;
                        a = ($(b[U >> 1] | 0, b[U >> 1] | 0) | 0) >> 8;
                        c[G >> 2] = (c[G >> 2] | 0) + a;
                        c[f >> 2] = (c[f >> 2] | 0) + 1;
                        c[O >> 2] = (c[O >> 2] | 0) + 1
                    }
                    c[f >> 2] = 0;
                    while (1) {
                        if ((c[f >> 2] | 0) >= 24) {
                            break
                        }
                        b[N + (c[f >> 2] << 1) >> 1] = (c[(c[J >> 2] | 0) + (2048 - (c[l >> 2] | 0) - 1 - (c[f >> 2] | 0) << 2) >> 2] | 0) + 2048 >> 12;
                        c[f >> 2] = (c[f >> 2] | 0) + 1
                    }
                    zb((c[J >> 2] | 0) + 8192 + (0 - (c[l >> 2] | 0) << 2) | 0, (c[B >> 2] | 0) + ((c[n >> 2] | 0) * 24 << 1) | 0, (c[J >> 2] | 0) + 8192 + (0 - (c[l >> 2] | 0) << 2) | 0, c[K >> 2] | 0, 24, N);
                    c[q >> 2] = 0;
                    c[f >> 2] = 0;
                    while (1) {
                        if ((c[f >> 2] | 0) >= (c[K >> 2] | 0)) {
                            break
                        }
                        b[L >> 1] = (c[(c[J >> 2] | 0) + (2048 - (c[l >> 2] | 0) + (c[f >> 2] | 0) << 2) >> 2] | 0) + 2048 >> 12;
                        a = ($(b[L >> 1] | 0, b[L >> 1] | 0) | 0) >> 8;
                        c[q >> 2] = (c[q >> 2] | 0) + a;
                        c[f >> 2] = (c[f >> 2] | 0) + 1
                    }
                    a:do {
                        if ((c[G >> 2] | 0) > (c[q >> 2] >> 2 | 0)) {
                            if ((c[G >> 2] | 0) < (c[q >> 2] | 0)) {
                                b[I >> 1] = mc(ic((c[G >> 2] >> 1) + 1 | 0, (c[q >> 2] | 0) + 1 | 0) | 0) | 0;
                                c[f >> 2] = 0;
                                while (1) {
                                    if ((c[f >> 2] | 0) >= (c[h >> 2] | 0)) {
                                        break
                                    }
                                    b[ea >> 1] = 32767 - (($(b[(c[da >> 2] | 0) + (c[f >> 2] << 1) >> 1] | 0, (32767 - (b[I >> 1] | 0) & 65535) << 16 >> 16) | 0) >> 15);
                                    a = ($(b[ea >> 1] | 0, (c[(c[J >> 2] | 0) + (2048 - (c[l >> 2] | 0) + (c[f >> 2] | 0) << 2) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                                    a = a + (($(b[ea >> 1] | 0, c[(c[J >> 2] | 0) + (2048 - (c[l >> 2] | 0) + (c[f >> 2] | 0) << 2) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                                    c[(c[J >> 2] | 0) + (2048 - (c[l >> 2] | 0) + (c[f >> 2] | 0) << 2) >> 2] = a;
                                    c[f >> 2] = (c[f >> 2] | 0) + 1
                                }
                                c[f >> 2] = c[h >> 2];
                                while (1) {
                                    if ((c[f >> 2] | 0) >= (c[K >> 2] | 0)) {
                                        break a
                                    }
                                    a = ($(b[I >> 1] | 0, (c[(c[J >> 2] | 0) + (2048 - (c[l >> 2] | 0) + (c[f >> 2] | 0) << 2) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                                    a = a + (($(b[I >> 1] | 0, c[(c[J >> 2] | 0) + (2048 - (c[l >> 2] | 0) + (c[f >> 2] | 0) << 2) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                                    c[(c[J >> 2] | 0) + (2048 - (c[l >> 2] | 0) + (c[f >> 2] | 0) << 2) >> 2] = a;
                                    c[f >> 2] = (c[f >> 2] | 0) + 1
                                }
                            }
                        } else {
                            c[f >> 2] = 0;
                            while (1) {
                                if ((c[f >> 2] | 0) >= (c[K >> 2] | 0)) {
                                    break a
                                }
                                c[(c[J >> 2] | 0) + (2048 - (c[l >> 2] | 0) + (c[f >> 2] | 0) << 2) >> 2] = 0;
                                c[f >> 2] = (c[f >> 2] | 0) + 1
                            }
                        }
                    } while (0);
                    ab(r, (c[J >> 2] | 0) + 8192 | 0, c[(c[k >> 2] | 0) + 52 >> 2] | 0, c[(c[k >> 2] | 0) + 52 >> 2] | 0, c[h >> 2] | 0, 0 - (b[(c[k >> 2] | 0) + 60 >> 1] | 0) & 65535, 0 - (b[(c[k >> 2] | 0) + 60 >> 1] | 0) & 65535, c[(c[k >> 2] | 0) + 64 >> 2] | 0, c[(c[k >> 2] | 0) + 64 >> 2] | 0, 0, 0);
                    c[f >> 2] = 0;
                    while (1) {
                        if ((c[f >> 2] | 0) >= ((c[h >> 2] | 0) / 2 | 0 | 0)) {
                            break
                        }
                        d = ($(b[(c[da >> 2] | 0) + (c[f >> 2] << 1) >> 1] | 0, (c[r + ((c[h >> 2] | 0) - 1 - (c[f >> 2] | 0) << 2) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        d = d + (($(b[(c[da >> 2] | 0) + (c[f >> 2] << 1) >> 1] | 0, c[r + ((c[h >> 2] | 0) - 1 - (c[f >> 2] | 0) << 2) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                        a = ($(b[(c[da >> 2] | 0) + ((c[h >> 2] | 0) - (c[f >> 2] | 0) - 1 << 1) >> 1] | 0, (c[r + (c[f >> 2] << 2) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        a = d + (a + (($(b[(c[da >> 2] | 0) + ((c[h >> 2] | 0) - (c[f >> 2] | 0) - 1 << 1) >> 1] | 0, c[r + (c[f >> 2] << 2) >> 2] & 65535 & 65535) | 0) >> 15)) | 0;
                        c[(c[J >> 2] | 0) + (2048 + (c[f >> 2] | 0) << 2) >> 2] = a;
                        c[f >> 2] = (c[f >> 2] | 0) + 1
                    }
                    a = (c[n >> 2] | 0) + 1 | 0;
                    c[n >> 2] = a
                } while ((a | 0) < (c[j >> 2] | 0));
                na(c[fa >> 2] | 0);
                d = c[m >> 2] | 0;
                d = d + 1 | 0;
                a = c[k >> 2] | 0;
                a = a + 48 | 0;
                c[a >> 2] = d;
                i = o;

            }
            function jb(a, d, e, f, g, h, j, k) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                var l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0,
                    z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0;
                t = i;
                i = i + 80 | 0;
                D = t + 36 | 0;
                E = t + 24 | 0;
                x = t + 44 | 0;
                v = t + 60 | 0;
                q = t + 12 | 0;
                F = t + 16 | 0;
                l = t + 48 | 0;
                r = t + 56 | 0;
                y = t + 64 | 0;
                o = t + 68 | 0;
                w = t + 72 | 0;
                A = t + 76 | 0;
                s = t;
                n = t + 4 | 0;
                m = t + 40 | 0;
                p = t + 20 | 0;
                u = t + 52 | 0;
                C = t + 28 | 0;
                z = t + 32 | 0;
                B = t + 8 | 0;
                c[D >> 2] = a;
                c[E >> 2] = d;
                c[x >> 2] = e;
                c[v >> 2] = f;
                c[q >> 2] = g;
                c[F >> 2] = h;
                c[l >> 2] = j;
                c[r >> 2] = k;
                c[w >> 2] = 0;
                a = c[x >> 2] | 0;
                c[s >> 2] = ia() | 0;
                k = i;
                i = i + ((4 * a | 0) + 15 & -16) | 0;
                b[A >> 1] = b[c[F >> 2] >> 1] | 0;
                c[o >> 2] = (c[x >> 2] | 0) / (c[q >> 2] | 0) | 0;
                c[y >> 2] = 0;
                do {
                    c[u >> 2] = c[(c[l >> 2] | 0) + (c[y >> 2] << 2) >> 2];
                    c[m >> 2] = c[(c[D >> 2] | 0) + (c[y >> 2] << 2) >> 2];
                    c[p >> 2] = (c[E >> 2] | 0) + (c[y >> 2] << 1);
                    a:do {
                        if ((c[q >> 2] | 0) <= 1) {
                            F = (c[r >> 2] | 0) != 0;
                            c[n >> 2] = 0;
                            if (F) {
                                while (1) {
                                    if ((c[n >> 2] | 0) >= (c[x >> 2] | 0)) {
                                        break a
                                    }
                                    c[z >> 2] = (c[(c[m >> 2] | 0) + (c[n >> 2] << 2) >> 2] | 0) + (c[u >> 2] | 0) + 0;
                                    a = ($(b[A >> 1] | 0, (c[z >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                                    c[u >> 2] = a + (($(b[A >> 1] | 0, c[z >> 2] & 65535 & 65535) | 0) >> 15);
                                    a = $(c[n >> 2] | 0, c[v >> 2] | 0) | 0;
                                    a = b[(c[p >> 2] | 0) + (a << 1) >> 1] | 0;
                                    a = pb(a + ((qb(c[z >> 2] | 0) | 0) << 16 >> 16) | 0) | 0;
                                    F = $(c[n >> 2] | 0, c[v >> 2] | 0) | 0;
                                    b[(c[p >> 2] | 0) + (F << 1) >> 1] = a;
                                    c[n >> 2] = (c[n >> 2] | 0) + 1
                                }
                            } else {
                                while (1) {
                                    if ((c[n >> 2] | 0) >= (c[x >> 2] | 0)) {
                                        break a
                                    }
                                    c[B >> 2] = (c[(c[m >> 2] | 0) + (c[n >> 2] << 2) >> 2] | 0) + (c[u >> 2] | 0) + 0;
                                    a = ($(b[A >> 1] | 0, (c[B >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                                    c[u >> 2] = a + (($(b[A >> 1] | 0, c[B >> 2] & 65535 & 65535) | 0) >> 15);
                                    a = qb(c[B >> 2] | 0) | 0;
                                    F = $(c[n >> 2] | 0, c[v >> 2] | 0) | 0;
                                    b[(c[p >> 2] | 0) + (F << 1) >> 1] = a;
                                    c[n >> 2] = (c[n >> 2] | 0) + 1
                                }
                            }
                        } else {
                            c[n >> 2] = 0;
                            while (1) {
                                if ((c[n >> 2] | 0) >= (c[x >> 2] | 0)) {
                                    break
                                }
                                c[C >> 2] = (c[(c[m >> 2] | 0) + (c[n >> 2] << 2) >> 2] | 0) + (c[u >> 2] | 0) + 0;
                                F = ($(b[A >> 1] | 0, (c[C >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                                c[u >> 2] = F + (($(b[A >> 1] | 0, c[C >> 2] & 65535 & 65535) | 0) >> 15);
                                c[k + (c[n >> 2] << 2) >> 2] = c[C >> 2];
                                c[n >> 2] = (c[n >> 2] | 0) + 1
                            }
                            c[w >> 2] = 1
                        }
                    } while (0);
                    c[(c[l >> 2] | 0) + (c[y >> 2] << 2) >> 2] = c[u >> 2];
                    b:do {
                        if ((c[w >> 2] | 0) != 0) {
                            F = (c[r >> 2] | 0) != 0;
                            c[n >> 2] = 0;
                            if (F) {
                                while (1) {
                                    if ((c[n >> 2] | 0) >= (c[o >> 2] | 0)) {
                                        break b
                                    }
                                    a = $(c[n >> 2] | 0, c[v >> 2] | 0) | 0;
                                    a = b[(c[p >> 2] | 0) + (a << 1) >> 1] | 0;
                                    a = pb(a + ((qb(c[k + (($(c[n >> 2] | 0, c[q >> 2] | 0) | 0) << 2) >> 2] | 0) | 0) << 16 >> 16) | 0) | 0;
                                    F = $(c[n >> 2] | 0, c[v >> 2] | 0) | 0;
                                    b[(c[p >> 2] | 0) + (F << 1) >> 1] = a;
                                    c[n >> 2] = (c[n >> 2] | 0) + 1
                                }
                            } else {
                                while (1) {
                                    if ((c[n >> 2] | 0) >= (c[o >> 2] | 0)) {
                                        break b
                                    }
                                    a = qb(c[k + (($(c[n >> 2] | 0, c[q >> 2] | 0) | 0) << 2) >> 2] | 0) | 0;
                                    F = $(c[n >> 2] | 0, c[v >> 2] | 0) | 0;
                                    b[(c[p >> 2] | 0) + (F << 1) >> 1] = a;
                                    c[n >> 2] = (c[n >> 2] | 0) + 1
                                }
                            }
                        }
                    } while (0);
                    F = (c[y >> 2] | 0) + 1 | 0;
                    c[y >> 2] = F
                } while ((F | 0) < (c[v >> 2] | 0));
                na(c[s >> 2] | 0);
                i = t;

            }
            function kb(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                a = c[(c[d >> 2] | 0) + 20 >> 2] | 0;
                a = a - (32 - (We(c[(c[d >> 2] | 0) + 28 >> 2] | 0) | 0)) | 0;
                i = b;
                return a | 0
            }
            function lb(b, d, e, f, g, h) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0,
                    x = 0;
                t = i;
                i = i + 64 | 0;
                m = t + 24 | 0;
                l = t + 20 | 0;
                r = t + 44 | 0;
                x = t + 36 | 0;
                j = t + 32 | 0;
                n = t + 40 | 0;
                q = t + 48 | 0;
                u = t + 52 | 0;
                o = t + 8 | 0;
                p = t + 4 | 0;
                s = t + 28 | 0;
                k = t + 12 | 0;
                w = t;
                v = t + 16 | 0;
                c[m >> 2] = b;
                c[l >> 2] = d;
                c[r >> 2] = e;
                c[x >> 2] = f;
                c[j >> 2] = g;
                c[n >> 2] = h;
                c[w >> 2] = c[(c[n >> 2] | 0) + 4 >> 2] << 3;
                c[v >> 2] = kb(c[n >> 2] | 0) | 0;
                c[k >> 2] = (c[r >> 2] | 0) != 0 ? 2 : 4;
                if ((c[j >> 2] | 0) > 0) {
                    h = ((c[v >> 2] | 0) + (c[k >> 2] | 0) + 1 | 0) >>> 0 <= (c[w >> 2] | 0) >>> 0
                } else {
                    h = 0
                }
                c[p >> 2] = h & 1;
                c[w >> 2] = (c[w >> 2] | 0) - (c[p >> 2] | 0);
                c[u >> 2] = 0;
                c[s >> 2] = 0;
                c[q >> 2] = c[m >> 2];
                while (1) {
                    if ((c[q >> 2] | 0) >= (c[l >> 2] | 0)) {
                        break
                    }
                    if (((c[v >> 2] | 0) + (c[k >> 2] | 0) | 0) >>> 0 <= (c[w >> 2] | 0) >>> 0) {
                        b = Ob(c[n >> 2] | 0, c[k >> 2] | 0) | 0;
                        c[u >> 2] = c[u >> 2] ^ b;
                        c[v >> 2] = kb(c[n >> 2] | 0) | 0;
                        c[s >> 2] = c[s >> 2] | c[u >> 2]
                    }
                    c[(c[x >> 2] | 0) + (c[q >> 2] << 2) >> 2] = c[u >> 2];
                    c[k >> 2] = (c[r >> 2] | 0) != 0 ? 4 : 5;
                    c[q >> 2] = (c[q >> 2] | 0) + 1
                }
                c[o >> 2] = 0;
                if ((c[p >> 2] | 0) != 0 ? (a[200 + (c[j >> 2] << 3) + ((c[r >> 2] << 2) + 0 + (c[s >> 2] | 0)) >> 0] | 0) != (a[200 + (c[j >> 2] << 3) + ((c[r >> 2] << 2) + 2 + (c[s >> 2] | 0)) >> 0] | 0) : 0) {
                    c[o >> 2] = Ob(c[n >> 2] | 0, 1) | 0
                }
                c[q >> 2] = c[m >> 2];
                while (1) {
                    if ((c[q >> 2] | 0) >= (c[l >> 2] | 0)) {
                        break
                    }
                    c[(c[x >> 2] | 0) + (c[q >> 2] << 2) >> 2] = a[200 + (c[j >> 2] << 3) + ((c[r >> 2] << 2) + (c[o >> 2] << 1) + (c[(c[x >> 2] | 0) + (c[q >> 2] << 2) >> 2] | 0)) >> 0] | 0;
                    c[q >> 2] = (c[q >> 2] | 0) + 1
                }
                i = t;

            }
            function mb(a, b, d, e, f, g, h, j, k, l, m, n) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                m = m | 0;
                n = n | 0;
                var o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0,
                    C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0;
                A = i;
                i = i + 112 | 0;
                u = A + 92 | 0;
                y = A + 84 | 0;
                s = A + 40 | 0;
                z = A + 44 | 0;
                o = A;
                B = A + 16 | 0;
                L = A + 20 | 0;
                K = A + 24 | 0;
                N = A + 28 | 0;
                M = A + 72 | 0;
                D = A + 80 | 0;
                E = A + 88 | 0;
                J = A + 96 | 0;
                I = A + 48 | 0;
                C = A + 52 | 0;
                q = A + 56 | 0;
                r = A + 60 | 0;
                F = A + 8 | 0;
                t = A + 64 | 0;
                w = A + 12 | 0;
                H = A + 32 | 0;
                v = A + 68 | 0;
                G = A + 36 | 0;
                x = A + 76 | 0;
                p = A + 4 | 0;
                c[u >> 2] = a;
                c[y >> 2] = b;
                c[s >> 2] = d;
                c[z >> 2] = e;
                c[o >> 2] = f;
                c[B >> 2] = g;
                c[L >> 2] = h;
                c[K >> 2] = j;
                c[N >> 2] = k;
                c[M >> 2] = l;
                c[D >> 2] = m;
                c[E >> 2] = n;
                c[v >> 2] = c[(c[u >> 2] | 0) + 4 >> 2];
                c[H >> 2] = c[(c[u >> 2] | 0) + 8 >> 2];
                c[F >> 2] = c[(c[u >> 2] | 0) + 36 >> 2] << c[M >> 2];
                a = c[F >> 2] | 0;
                c[G >> 2] = ia() | 0;
                n = i;
                i = i + ((4 * a | 0) + 15 & -16) | 0;
                c[C >> 2] = 1 << c[M >> 2];
                if ((c[N >> 2] | 0) != 0) {
                    c[r >> 2] = c[C >> 2];
                    c[t >> 2] = c[(c[u >> 2] | 0) + 36 >> 2];
                    c[w >> 2] = c[(c[u >> 2] | 0) + 28 >> 2]
                } else {
                    c[r >> 2] = 1;
                    c[t >> 2] = c[(c[u >> 2] | 0) + 36 >> 2] << c[M >> 2];
                    c[w >> 2] = (c[(c[u >> 2] | 0) + 28 >> 2] | 0) - (c[M >> 2] | 0)
                }
                if ((c[K >> 2] | 0) == 2 ? (c[L >> 2] | 0) == 1 : 0) {
                    Ca(c[u >> 2] | 0, c[y >> 2] | 0, n, c[z >> 2] | 0, c[o >> 2] | 0, c[B >> 2] | 0, c[C >> 2] | 0, c[D >> 2] | 0, c[E >> 2] | 0);
                    c[x >> 2] = (c[(c[s >> 2] | 0) + 4 >> 2] | 0) + (((c[v >> 2] | 0) / 2 | 0) << 2);
                    Ze(c[x >> 2] | 0, n | 0, (c[F >> 2] << 2) + 0 | 0) | 0;
                    c[q >> 2] = 0;
                    while (1) {
                        if ((c[q >> 2] | 0) >= (c[r >> 2] | 0)) {
                            break
                        }
                        N = (c[c[s >> 2] >> 2] | 0) + (($(c[t >> 2] | 0, c[q >> 2] | 0) | 0) << 2) | 0;
                        pc((c[u >> 2] | 0) + 56 | 0, (c[x >> 2] | 0) + (c[q >> 2] << 2) | 0, N, c[(c[u >> 2] | 0) + 52 >> 2] | 0, c[v >> 2] | 0, c[w >> 2] | 0, c[r >> 2] | 0);
                        c[q >> 2] = (c[q >> 2] | 0) + 1
                    }
                    c[q >> 2] = 0;
                    while (1) {
                        if ((c[q >> 2] | 0) >= (c[r >> 2] | 0)) {
                            break
                        }
                        N = (c[(c[s >> 2] | 0) + 4 >> 2] | 0) + (($(c[t >> 2] | 0, c[q >> 2] | 0) | 0) << 2) | 0;
                        pc((c[u >> 2] | 0) + 56 | 0, n + (c[q >> 2] << 2) | 0, N, c[(c[u >> 2] | 0) + 52 >> 2] | 0, c[v >> 2] | 0, c[w >> 2] | 0, c[r >> 2] | 0);
                        c[q >> 2] = (c[q >> 2] | 0) + 1
                    }
                    N = c[G >> 2] | 0;
                    na(N | 0);
                    i = A;
                    return
                }
                if ((c[K >> 2] | 0) == 1 ? (c[L >> 2] | 0) == 2 : 0) {
                    c[p >> 2] = (c[c[s >> 2] >> 2] | 0) + (((c[v >> 2] | 0) / 2 | 0) << 2);
                    Ca(c[u >> 2] | 0, c[y >> 2] | 0, n, c[z >> 2] | 0, c[o >> 2] | 0, c[B >> 2] | 0, c[C >> 2] | 0, c[D >> 2] | 0, c[E >> 2] | 0);
                    Ca(c[u >> 2] | 0, (c[y >> 2] | 0) + (c[F >> 2] << 1) | 0, c[p >> 2] | 0, (c[z >> 2] | 0) + (c[H >> 2] << 1) | 0, c[o >> 2] | 0, c[B >> 2] | 0, c[C >> 2] | 0, c[D >> 2] | 0, c[E >> 2] | 0);
                    c[I >> 2] = 0;
                    while (1) {
                        if ((c[I >> 2] | 0) >= (c[F >> 2] | 0)) {
                            break
                        }
                        c[n + (c[I >> 2] << 2) >> 2] = (c[n + (c[I >> 2] << 2) >> 2] | 0) + (c[(c[p >> 2] | 0) + (c[I >> 2] << 2) >> 2] | 0) >> 1;
                        c[I >> 2] = (c[I >> 2] | 0) + 1
                    }
                    c[q >> 2] = 0;
                    while (1) {
                        if ((c[q >> 2] | 0) >= (c[r >> 2] | 0)) {
                            break
                        }
                        N = (c[c[s >> 2] >> 2] | 0) + (($(c[t >> 2] | 0, c[q >> 2] | 0) | 0) << 2) | 0;
                        pc((c[u >> 2] | 0) + 56 | 0, n + (c[q >> 2] << 2) | 0, N, c[(c[u >> 2] | 0) + 52 >> 2] | 0, c[v >> 2] | 0, c[w >> 2] | 0, c[r >> 2] | 0);
                        c[q >> 2] = (c[q >> 2] | 0) + 1
                    }
                    N = c[G >> 2] | 0;
                    na(N | 0);
                    i = A;
                    return
                }
                c[J >> 2] = 0;
                do {
                    a = (c[y >> 2] | 0) + (($(c[J >> 2] | 0, c[F >> 2] | 0) | 0) << 1) | 0;
                    N = (c[z >> 2] | 0) + (($(c[J >> 2] | 0, c[H >> 2] | 0) | 0) << 1) | 0;
                    Ca(c[u >> 2] | 0, a, n, N, c[o >> 2] | 0, c[B >> 2] | 0, c[C >> 2] | 0, c[D >> 2] | 0, c[E >> 2] | 0);
                    c[q >> 2] = 0;
                    while (1) {
                        if ((c[q >> 2] | 0) >= (c[r >> 2] | 0)) {
                            break
                        }
                        N = (c[(c[s >> 2] | 0) + (c[J >> 2] << 2) >> 2] | 0) + (($(c[t >> 2] | 0, c[q >> 2] | 0) | 0) << 2) | 0;
                        pc((c[u >> 2] | 0) + 56 | 0, n + (c[q >> 2] << 2) | 0, N, c[(c[u >> 2] | 0) + 52 >> 2] | 0, c[v >> 2] | 0, c[w >> 2] | 0, c[r >> 2] | 0);
                        c[q >> 2] = (c[q >> 2] | 0) + 1
                    }
                    N = (c[J >> 2] | 0) + 1 | 0;
                    c[J >> 2] = N
                } while ((N | 0) < (c[K >> 2] | 0));
                N = c[G >> 2] | 0;
                na(N | 0);
                i = A;

            }
            function nb(a) {
                a = a | 0;
                var b = 0, d = 0;
                d = i;
                i = i + 16 | 0;
                b = d;
                c[b >> 2] = a;
                i = d;
                return c[(c[b >> 2] | 0) + 44 >> 2] | 0
            }
            function ob(a, d, e) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0,
                    u = 0, v = 0, w = 0, x = 0, y = 0;
                g = i;
                i = i + 96 | 0;
                f = g + 32 | 0;
                j = g + 24 | 0;
                y = g + 44 | 0;
                l = g + 64 | 0;
                k = g + 12 | 0;
                m = g + 40 | 0;
                n = g + 48 | 0;
                o = g + 56 | 0;
                p = g + 80 | 0;
                q = g + 84 | 0;
                t = g + 8 | 0;
                s = g + 4 | 0;
                r = g;
                h = g + 36 | 0;
                u = g + 16 | 0;
                v = g + 20 | 0;
                w = g + 52 | 0;
                x = g + 28 | 0;
                c[j >> 2] = a;
                c[y >> 2] = d;
                c[l >> 2] = e;
                a:do {
                    switch (c[y >> 2] | 0) {
                        case 10010: {
                            a = c[l >> 2] | 0;
                            y = c[a >> 2] | 0;
                            c[l >> 2] = a + 4;
                            c[k >> 2] = y;
                            if ((c[k >> 2] | 0) >= 0 ? (c[k >> 2] | 0) < (c[(c[c[j >> 2] >> 2] | 0) + 8 >> 2] | 0) : 0) {
                                c[(c[j >> 2] | 0) + 20 >> 2] = c[k >> 2];
                                h = 24
                            } else {
                                h = 25
                            }
                            break
                        }
                        case 10012: {
                            a = c[l >> 2] | 0;
                            y = c[a >> 2] | 0;
                            c[l >> 2] = a + 4;
                            c[m >> 2] = y;
                            if ((c[m >> 2] | 0) >= 1 ? (c[m >> 2] | 0) <= (c[(c[c[j >> 2] >> 2] | 0) + 8 >> 2] | 0) : 0) {
                                c[(c[j >> 2] | 0) + 24 >> 2] = c[m >> 2];
                                h = 24
                            } else {
                                h = 25
                            }
                            break
                        }
                        case 10008: {
                            a = c[l >> 2] | 0;
                            y = c[a >> 2] | 0;
                            c[l >> 2] = a + 4;
                            c[n >> 2] = y;
                            if ((c[n >> 2] | 0) < 1 | (c[n >> 2] | 0) > 2) {
                                h = 25
                            } else {
                                c[(c[j >> 2] | 0) + 12 >> 2] = c[n >> 2];
                                h = 24
                            }
                            break
                        }
                        case 10007: {
                            a = c[l >> 2] | 0;
                            y = c[a >> 2] | 0;
                            c[l >> 2] = a + 4;
                            c[o >> 2] = y;
                            if ((c[o >> 2] | 0) == 0) {
                                h = 25
                            } else {
                                c[c[o >> 2] >> 2] = c[(c[j >> 2] | 0) + 40 >> 2];
                                c[(c[j >> 2] | 0) + 40 >> 2] = 0;
                                h = 24
                            }
                            break
                        }
                        case 4027: {
                            a = c[l >> 2] | 0;
                            y = c[a >> 2] | 0;
                            c[l >> 2] = a + 4;
                            c[p >> 2] = y;
                            if ((c[p >> 2] | 0) == 0) {
                                h = 25
                            } else {
                                c[c[p >> 2] >> 2] = (c[(c[j >> 2] | 0) + 4 >> 2] | 0) / (c[(c[j >> 2] | 0) + 16 >> 2] | 0) | 0;
                                h = 24
                            }
                            break
                        }
                        case 4028: {
                            c[t >> 2] = (c[j >> 2] | 0) + 80 + (($(2048 + (c[(c[j >> 2] | 0) + 4 >> 2] | 0) | 0, c[(c[j >> 2] | 0) + 8 >> 2] | 0) | 0) << 2);
                            c[s >> 2] = (c[t >> 2] | 0) + ((c[(c[j >> 2] | 0) + 8 >> 2] | 0) * 24 << 1);
                            c[r >> 2] = (c[s >> 2] | 0) + (c[(c[c[j >> 2] >> 2] | 0) + 8 >> 2] << 1 << 1);
                            c[h >> 2] = (c[r >> 2] | 0) + (c[(c[c[j >> 2] >> 2] | 0) + 8 >> 2] << 1 << 1);
                            Xe((c[j >> 2] | 0) + 36 | 0, 0, (eb(c[c[j >> 2] >> 2] | 0, c[(c[j >> 2] | 0) + 8 >> 2] | 0) | 0) - ((c[j >> 2] | 0) + 36 - (c[j >> 2] | 0)) | 0) | 0;
                            c[q >> 2] = 0;
                            while (1) {
                                if ((c[q >> 2] | 0) >= (c[(c[c[j >> 2] >> 2] | 0) + 8 >> 2] << 1 | 0)) {
                                    h = 24;
                                    break a
                                }
                                b[(c[h >> 2] | 0) + (c[q >> 2] << 1) >> 1] = -28672;
                                b[(c[r >> 2] | 0) + (c[q >> 2] << 1) >> 1] = -28672;
                                c[q >> 2] = (c[q >> 2] | 0) + 1
                            }
                        }
                        case 4033: {
                            a = c[l >> 2] | 0;
                            y = c[a >> 2] | 0;
                            c[l >> 2] = a + 4;
                            c[u >> 2] = y;
                            if ((c[u >> 2] | 0) == 0) {
                                h = 25
                            } else {
                                c[c[u >> 2] >> 2] = c[(c[j >> 2] | 0) + 52 >> 2];
                                h = 24
                            }
                            break
                        }
                        case 10015: {
                            a = c[l >> 2] | 0;
                            y = c[a >> 2] | 0;
                            c[l >> 2] = a + 4;
                            c[v >> 2] = y;
                            if ((c[v >> 2] | 0) == 0) {
                                h = 25
                            } else {
                                c[c[v >> 2] >> 2] = c[c[j >> 2] >> 2];
                                h = 24
                            }
                            break
                        }
                        case 10016: {
                            y = c[l >> 2] | 0;
                            h = c[y >> 2] | 0;
                            c[l >> 2] = y + 4;
                            c[w >> 2] = h;
                            c[(c[j >> 2] | 0) + 28 >> 2] = c[w >> 2];
                            h = 24;
                            break
                        }
                        case 4031: {
                            a = c[l >> 2] | 0;
                            y = c[a >> 2] | 0;
                            c[l >> 2] = a + 4;
                            c[x >> 2] = y;
                            if ((c[x >> 2] | 0) == 0) {
                                h = 25
                            } else {
                                c[c[x >> 2] >> 2] = c[(c[j >> 2] | 0) + 36 >> 2];
                                h = 24
                            }
                            break
                        }
                        default: {
                            c[f >> 2] = -5;
                            y = c[f >> 2] | 0;
                            i = g;
                            return y | 0
                        }
                    }
                } while (0);
                if ((h | 0) == 24) {
                    c[f >> 2] = 0;
                    y = c[f >> 2] | 0;
                    i = g;
                    return y | 0
                } else if ((h | 0) == 25) {
                    c[f >> 2] = -1;
                    y = c[f >> 2] | 0;
                    i = g;
                    return y | 0
                }
                return 0
            }
            function pb(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                if ((c[d >> 2] | 0) <= 32767) {
                    if ((c[d >> 2] | 0) < -32768) {
                        a = -32768
                    } else {
                        a = (c[d >> 2] & 65535) << 16 >> 16
                    }
                } else {
                    a = 32767
                }
                i = b;
                return a & 65535 | 0
            }
            function qb(a) {
                a = a | 0;
                var b = 0, d = 0;
                d = i;
                i = i + 16 | 0;
                b = d;
                c[b >> 2] = a;
                c[b >> 2] = (c[b >> 2] | 0) + 2048 >> 12;
                c[b >> 2] = (c[b >> 2] | 0) > -32768 ? c[b >> 2] | 0 : -32768;
                c[b >> 2] = (c[b >> 2] | 0) < 32767 ? c[b >> 2] | 0 : 32767;
                i = d;
                return c[b >> 2] & 65535 | 0
            }
            function rb(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0;
                f = i;
                i = i + 2064 | 0;
                k = f + 12 | 0;
                j = f + 8 | 0;
                g = f + 4 | 0;
                e = f;
                h = f + 16 | 0;
                c[k >> 2] = a;
                c[j >> 2] = b;
                c[g >> 2] = d;
                rc(c[k >> 2] | 0, h, 2048, c[j >> 2] | 0, c[g >> 2] | 0);
                yc(h + 720 | 0, h, 1328, 620, e, c[g >> 2] | 0);
                c[e >> 2] = 720 - (c[e >> 2] | 0);
                i = f;
                return c[e >> 2] | 0
            }
            function sb(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                if ((c[d >> 2] | 0) <= 0) {
                    a = 0
                } else {
                    a = (ub(c[d >> 2] | 0) | 0) << 16 >> 16
                }
                i = b;
                return a & 65535 | 0
            }
            function tb(a, d) {
                a = a | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0;
                f = i;
                i = i + 16 | 0;
                h = f + 8 | 0;
                k = f + 4 | 0;
                e = f;
                j = f + 14 | 0;
                g = f + 12 | 0;
                c[h >> 2] = a;
                c[k >> 2] = d;
                b[j >> 1] = 0;
                b[g >> 1] = 0;
                c[e >> 2] = 0;
                while (1) {
                    d = b[j >> 1] | 0;
                    if ((c[e >> 2] | 0) >= (c[k >> 2] | 0)) {
                        break
                    }
                    if ((d | 0) > (b[(c[h >> 2] | 0) + (c[e >> 2] << 1) >> 1] | 0)) {
                        d = b[j >> 1] | 0
                    } else {
                        d = b[(c[h >> 2] | 0) + (c[e >> 2] << 1) >> 1] | 0
                    }
                    b[j >> 1] = d << 16 >> 16;
                    if ((b[g >> 1] | 0) < (b[(c[h >> 2] | 0) + (c[e >> 2] << 1) >> 1] | 0)) {
                        d = b[g >> 1] | 0
                    } else {
                        d = b[(c[h >> 2] | 0) + (c[e >> 2] << 1) >> 1] | 0
                    }
                    b[g >> 1] = d << 16 >> 16;
                    c[e >> 2] = (c[e >> 2] | 0) + 1
                }
                if ((d | 0) > (0 - (b[g >> 1] | 0) | 0)) {
                    a = b[j >> 1] | 0;
                    i = f;
                    return a | 0
                } else {
                    a = 0 - (b[g >> 1] | 0) | 0;
                    i = f;
                    return a | 0
                }
                return 0
            }
            function ub(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                a = 32 - (We(c[d >> 2] | 0) | 0) - 1 & 65535;
                i = b;
                return a | 0
            }
            function vb() {
                return 0
            }
            function wb(a, d, e) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0;
                m = i;
                i = i + 144 | 0;
                r = m + 128 | 0;
                l = m + 16 | 0;
                h = m;
                g = m + 120 | 0;
                f = m + 124 | 0;
                j = m + 132 | 0;
                k = m + 12 | 0;
                n = m + 24 | 0;
                q = m + 20 | 0;
                o = m + 8 | 0;
                p = m + 4 | 0;
                c[r >> 2] = a;
                c[l >> 2] = d;
                c[h >> 2] = e;
                c[k >> 2] = c[c[l >> 2] >> 2];
                c[g >> 2] = 0;
                while (1) {
                    if ((c[g >> 2] | 0) >= (c[h >> 2] | 0)) {
                        break
                    }
                    c[n + (c[g >> 2] << 2) >> 2] = 0;
                    c[g >> 2] = (c[g >> 2] | 0) + 1
                }
                a:do {
                    if ((c[c[l >> 2] >> 2] | 0) != 0) {
                        c[g >> 2] = 0;
                        while (1) {
                            if ((c[g >> 2] | 0) >= (c[h >> 2] | 0)) {
                                break a
                            }
                            c[q >> 2] = 0;
                            c[f >> 2] = 0;
                            while (1) {
                                if ((c[f >> 2] | 0) >= (c[g >> 2] | 0)) {
                                    break
                                }
                                a = ($((c[n + (c[f >> 2] << 2) >> 2] >> 16 & 65535) << 16 >> 16, (c[(c[l >> 2] | 0) + ((c[g >> 2] | 0) - (c[f >> 2] | 0) << 2) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                                a = a + (($((c[n + (c[f >> 2] << 2) >> 2] >> 16 & 65535) << 16 >> 16, c[(c[l >> 2] | 0) + ((c[g >> 2] | 0) - (c[f >> 2] | 0) << 2) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                                a = a + (($((c[(c[l >> 2] | 0) + ((c[g >> 2] | 0) - (c[f >> 2] | 0) << 2) >> 2] >> 16 & 65535) << 16 >> 16, c[n + (c[f >> 2] << 2) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                                c[q >> 2] = (c[q >> 2] | 0) + a;
                                c[f >> 2] = (c[f >> 2] | 0) + 1
                            }
                            c[q >> 2] = (c[q >> 2] | 0) + (c[(c[l >> 2] | 0) + ((c[g >> 2] | 0) + 1 << 2) >> 2] >> 3);
                            c[j >> 2] = 0 - (ic(c[q >> 2] << 3, c[k >> 2] | 0) | 0);
                            c[n + (c[g >> 2] << 2) >> 2] = c[j >> 2] >> 3;
                            c[f >> 2] = 0;
                            while (1) {
                                if ((c[f >> 2] | 0) >= ((c[g >> 2] | 0) + 1 >> 1 | 0)) {
                                    break
                                }
                                c[o >> 2] = c[n + (c[f >> 2] << 2) >> 2];
                                c[p >> 2] = c[n + ((c[g >> 2] | 0) - 1 - (c[f >> 2] | 0) << 2) >> 2];
                                a = ($((c[j >> 2] >> 16 & 65535) << 16 >> 16, (c[p >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                                a = a + (($((c[j >> 2] >> 16 & 65535) << 16 >> 16, c[p >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                                a = (c[o >> 2] | 0) + (a + (($((c[p >> 2] >> 16 & 65535) << 16 >> 16, c[j >> 2] & 65535 & 65535) | 0) >> 15)) | 0;
                                c[n + (c[f >> 2] << 2) >> 2] = a;
                                a = ($((c[j >> 2] >> 16 & 65535) << 16 >> 16, (c[o >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                                a = a + (($((c[j >> 2] >> 16 & 65535) << 16 >> 16, c[o >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                                a = (c[p >> 2] | 0) + (a + (($((c[o >> 2] >> 16 & 65535) << 16 >> 16, c[j >> 2] & 65535 & 65535) | 0) >> 15)) | 0;
                                c[n + ((c[g >> 2] | 0) - 1 - (c[f >> 2] | 0) << 2) >> 2] = a;
                                c[f >> 2] = (c[f >> 2] | 0) + 1
                            }
                            a = ($((c[j >> 2] >> 16 & 65535) << 16 >> 16, (c[j >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                            a = a + (($((c[j >> 2] >> 16 & 65535) << 16 >> 16, c[j >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                            a = (a + (($((c[j >> 2] >> 16 & 65535) << 16 >> 16, c[j >> 2] & 65535 & 65535) | 0) >> 15) >> 16 & 65535) << 16 >> 16;
                            a = ($(a, (c[k >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                            d = ($((c[j >> 2] >> 16 & 65535) << 16 >> 16, (c[j >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                            d = d + (($((c[j >> 2] >> 16 & 65535) << 16 >> 16, c[j >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                            d = (d + (($((c[j >> 2] >> 16 & 65535) << 16 >> 16, c[j >> 2] & 65535 & 65535) | 0) >> 15) >> 16 & 65535) << 16 >> 16;
                            d = a + (($(d, c[k >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                            a = ($((c[j >> 2] >> 16 & 65535) << 16 >> 16, (c[j >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                            a = a + (($((c[j >> 2] >> 16 & 65535) << 16 >> 16, c[j >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                            c[k >> 2] = (c[k >> 2] | 0) - (d + (($((c[k >> 2] >> 16 & 65535) << 16 >> 16, a + (($((c[j >> 2] >> 16 & 65535) << 16 >> 16, c[j >> 2] & 65535 & 65535) | 0) >> 15) & 65535 & 65535) | 0) >> 15));
                            if ((c[k >> 2] | 0) < (c[c[l >> 2] >> 2] >> 10 | 0)) {
                                break a
                            }
                            c[g >> 2] = (c[g >> 2] | 0) + 1
                        }
                    }
                } while (0);
                c[g >> 2] = 0;
                while (1) {
                    if ((c[g >> 2] | 0) >= (c[h >> 2] | 0)) {
                        break
                    }
                    b[(c[r >> 2] | 0) + (c[g >> 2] << 1) >> 1] = (c[n + (c[g >> 2] << 2) >> 2] | 0) + 32768 >> 16;
                    c[g >> 2] = (c[g >> 2] | 0) + 1
                }
                i = m;
            }
            function xb(a, d, e, f, g, h) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0;
                p = i;
                i = i + 64 | 0;
                j = p + 48 | 0;
                u = p + 28 | 0;
                o = p;
                n = p + 40 | 0;
                q = p + 44 | 0;
                t = p + 52 | 0;
                m = p + 24 | 0;
                l = p + 36 | 0;
                r = p + 32 | 0;
                s = p + 8 | 0;
                k = p + 4 | 0;
                c[j >> 2] = a;
                c[u >> 2] = d;
                c[o >> 2] = e;
                c[n >> 2] = f;
                c[q >> 2] = g;
                c[t >> 2] = h;
                e = c[q >> 2] | 0;
                c[r >> 2] = ia() | 0;
                f = i;
                i = i + ((2 * e | 0) + 15 & -16) | 0;
                e = i;
                i = i + ((2 * ((c[n >> 2] | 0) + (c[q >> 2] | 0) | 0) | 0) + 15 & -16) | 0;
                c[m >> 2] = 0;
                while (1) {
                    if ((c[m >> 2] | 0) >= (c[q >> 2] | 0)) {
                        break
                    }
                    b[f + (c[m >> 2] << 1) >> 1] = b[(c[u >> 2] | 0) + ((c[q >> 2] | 0) - (c[m >> 2] | 0) - 1 << 1) >> 1] | 0;
                    c[m >> 2] = (c[m >> 2] | 0) + 1
                }
                c[m >> 2] = 0;
                while (1) {
                    if ((c[m >> 2] | 0) >= (c[q >> 2] | 0)) {
                        break
                    }
                    b[e + (c[m >> 2] << 1) >> 1] = b[(c[t >> 2] | 0) + ((c[q >> 2] | 0) - (c[m >> 2] | 0) - 1 << 1) >> 1] | 0;
                    c[m >> 2] = (c[m >> 2] | 0) + 1
                }
                c[m >> 2] = 0;
                while (1) {
                    if ((c[m >> 2] | 0) >= (c[n >> 2] | 0)) {
                        break
                    }
                    b[e + ((c[m >> 2] | 0) + (c[q >> 2] | 0) << 1) >> 1] = b[(c[j >> 2] | 0) + (c[m >> 2] << 1) >> 1] | 0;
                    c[m >> 2] = (c[m >> 2] | 0) + 1
                }
                c[m >> 2] = 0;
                while (1) {
                    if ((c[m >> 2] | 0) >= (c[q >> 2] | 0)) {
                        break
                    }
                    b[(c[t >> 2] | 0) + (c[m >> 2] << 1) >> 1] = b[(c[j >> 2] | 0) + ((c[n >> 2] | 0) - (c[m >> 2] | 0) - 1 << 1) >> 1] | 0;
                    c[m >> 2] = (c[m >> 2] | 0) + 1
                }
                c[m >> 2] = 0;
                while (1) {
                    if ((c[m >> 2] | 0) >= ((c[n >> 2] | 0) - 3 | 0)) {
                        break
                    }
                    c[s + 0 >> 2] = 0;
                    c[s + 4 >> 2] = 0;
                    c[s + 8 >> 2] = 0;
                    c[s + 12 >> 2] = 0;
                    yb(f, e + (c[m >> 2] << 1) | 0, s, c[q >> 2] | 0);
                    if (((b[(c[j >> 2] | 0) + (c[m >> 2] << 1) >> 1] | 0) + ((c[s >> 2] | 0) + 2048 >> 12) | 0) <= 32767) {
                        if (((b[(c[j >> 2] | 0) + (c[m >> 2] << 1) >> 1] | 0) + ((c[s >> 2] | 0) + 2048 >> 12) | 0) < -32768) {
                            t = -32768
                        } else {
                            t = (b[(c[j >> 2] | 0) + (c[m >> 2] << 1) >> 1] | 0) + ((c[s >> 2] | 0) + 2048 >> 12) | 0
                        }
                    } else {
                        t = 32767
                    }
                    b[(c[o >> 2] | 0) + (c[m >> 2] << 1) >> 1] = t;
                    if (((b[(c[j >> 2] | 0) + ((c[m >> 2] | 0) + 1 << 1) >> 1] | 0) + ((c[s + 4 >> 2] | 0) + 2048 >> 12) | 0) <= 32767) {
                        if (((b[(c[j >> 2] | 0) + ((c[m >> 2] | 0) + 1 << 1) >> 1] | 0) + ((c[s + 4 >> 2] | 0) + 2048 >> 12) | 0) < -32768) {
                            t = -32768
                        } else {
                            t = (b[(c[j >> 2] | 0) + ((c[m >> 2] | 0) + 1 << 1) >> 1] | 0) + ((c[s + 4 >> 2] | 0) + 2048 >> 12) | 0
                        }
                    } else {
                        t = 32767
                    }
                    b[(c[o >> 2] | 0) + ((c[m >> 2] | 0) + 1 << 1) >> 1] = t;
                    if (((b[(c[j >> 2] | 0) + ((c[m >> 2] | 0) + 2 << 1) >> 1] | 0) + ((c[s + 8 >> 2] | 0) + 2048 >> 12) | 0) <= 32767) {
                        if (((b[(c[j >> 2] | 0) + ((c[m >> 2] | 0) + 2 << 1) >> 1] | 0) + ((c[s + 8 >> 2] | 0) + 2048 >> 12) | 0) < -32768) {
                            t = -32768
                        } else {
                            t = (b[(c[j >> 2] | 0) + ((c[m >> 2] | 0) + 2 << 1) >> 1] | 0) + ((c[s + 8 >> 2] | 0) + 2048 >> 12) | 0
                        }
                    } else {
                        t = 32767
                    }
                    b[(c[o >> 2] | 0) + ((c[m >> 2] | 0) + 2 << 1) >> 1] = t;
                    if (((b[(c[j >> 2] | 0) + ((c[m >> 2] | 0) + 3 << 1) >> 1] | 0) + ((c[s + 12 >> 2] | 0) + 2048 >> 12) | 0) <= 32767) {
                        if (((b[(c[j >> 2] | 0) + ((c[m >> 2] | 0) + 3 << 1) >> 1] | 0) + ((c[s + 12 >> 2] | 0) + 2048 >> 12) | 0) < -32768) {
                            t = -32768
                        } else {
                            t = (b[(c[j >> 2] | 0) + ((c[m >> 2] | 0) + 3 << 1) >> 1] | 0) + ((c[s + 12 >> 2] | 0) + 2048 >> 12) | 0
                        }
                    } else {
                        t = 32767
                    }
                    b[(c[o >> 2] | 0) + ((c[m >> 2] | 0) + 3 << 1) >> 1] = t;
                    c[m >> 2] = (c[m >> 2] | 0) + 4
                }
                while (1) {
                    if ((c[m >> 2] | 0) >= (c[n >> 2] | 0)) {
                        break
                    }
                    c[k >> 2] = 0;
                    c[l >> 2] = 0;
                    while (1) {
                        if ((c[l >> 2] | 0) >= (c[q >> 2] | 0)) {
                            break
                        }
                        c[k >> 2] = (c[k >> 2] | 0) + ($(b[f + (c[l >> 2] << 1) >> 1] | 0, b[e + ((c[m >> 2] | 0) + (c[l >> 2] | 0) << 1) >> 1] | 0) | 0);
                        c[l >> 2] = (c[l >> 2] | 0) + 1
                    }
                    if (((b[(c[j >> 2] | 0) + (c[m >> 2] << 1) >> 1] | 0) + ((c[k >> 2] | 0) + 2048 >> 12) | 0) <= 32767) {
                        if (((b[(c[j >> 2] | 0) + (c[m >> 2] << 1) >> 1] | 0) + ((c[k >> 2] | 0) + 2048 >> 12) | 0) < -32768) {
                            s = -32768
                        } else {
                            s = (b[(c[j >> 2] | 0) + (c[m >> 2] << 1) >> 1] | 0) + ((c[k >> 2] | 0) + 2048 >> 12) | 0
                        }
                    } else {
                        s = 32767
                    }
                    b[(c[o >> 2] | 0) + (c[m >> 2] << 1) >> 1] = s;
                    c[m >> 2] = (c[m >> 2] | 0) + 1
                }
                na(c[r >> 2] | 0);
                i = p;
            }
            function yb(a, d, e, f) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0;
                p = i;
                i = i + 48 | 0;
                h = p + 8 | 0;
                k = p + 12 | 0;
                m = p + 16 | 0;
                r = p + 4 | 0;
                q = p;
                g = p + 26 | 0;
                l = p + 24 | 0;
                n = p + 22 | 0;
                o = p + 20 | 0;
                u = p + 28 | 0;
                t = p + 30 | 0;
                s = p + 32 | 0;
                j = p + 34 | 0;
                c[h >> 2] = a;
                c[k >> 2] = d;
                c[m >> 2] = e;
                c[r >> 2] = f;
                b[o >> 1] = 0;
                a = c[k >> 2] | 0;
                c[k >> 2] = a + 2;
                b[g >> 1] = b[a >> 1] | 0;
                a = c[k >> 2] | 0;
                c[k >> 2] = a + 2;
                b[l >> 1] = b[a >> 1] | 0;
                a = c[k >> 2] | 0;
                c[k >> 2] = a + 2;
                b[n >> 1] = b[a >> 1] | 0;
                c[q >> 2] = 0;
                while (1) {
                    if ((c[q >> 2] | 0) >= ((c[r >> 2] | 0) - 3 | 0)) {
                        break
                    }
                    a = c[h >> 2] | 0;
                    c[h >> 2] = a + 2;
                    b[u >> 1] = b[a >> 1] | 0;
                    a = c[k >> 2] | 0;
                    c[k >> 2] = a + 2;
                    b[o >> 1] = b[a >> 1] | 0;
                    a = (c[c[m >> 2] >> 2] | 0) + ($(b[u >> 1] | 0, b[g >> 1] | 0) | 0) | 0;
                    c[c[m >> 2] >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) + ($(b[u >> 1] | 0, b[l >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 4 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 8 >> 2] | 0) + ($(b[u >> 1] | 0, b[n >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 8 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 12 >> 2] | 0) + ($(b[u >> 1] | 0, b[o >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 12 >> 2] = a;
                    a = c[h >> 2] | 0;
                    c[h >> 2] = a + 2;
                    b[u >> 1] = b[a >> 1] | 0;
                    a = c[k >> 2] | 0;
                    c[k >> 2] = a + 2;
                    b[g >> 1] = b[a >> 1] | 0;
                    a = (c[c[m >> 2] >> 2] | 0) + ($(b[u >> 1] | 0, b[l >> 1] | 0) | 0) | 0;
                    c[c[m >> 2] >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) + ($(b[u >> 1] | 0, b[n >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 4 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 8 >> 2] | 0) + ($(b[u >> 1] | 0, b[o >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 8 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 12 >> 2] | 0) + ($(b[u >> 1] | 0, b[g >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 12 >> 2] = a;
                    a = c[h >> 2] | 0;
                    c[h >> 2] = a + 2;
                    b[u >> 1] = b[a >> 1] | 0;
                    a = c[k >> 2] | 0;
                    c[k >> 2] = a + 2;
                    b[l >> 1] = b[a >> 1] | 0;
                    a = (c[c[m >> 2] >> 2] | 0) + ($(b[u >> 1] | 0, b[n >> 1] | 0) | 0) | 0;
                    c[c[m >> 2] >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) + ($(b[u >> 1] | 0, b[o >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 4 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 8 >> 2] | 0) + ($(b[u >> 1] | 0, b[g >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 8 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 12 >> 2] | 0) + ($(b[u >> 1] | 0, b[l >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 12 >> 2] = a;
                    a = c[h >> 2] | 0;
                    c[h >> 2] = a + 2;
                    b[u >> 1] = b[a >> 1] | 0;
                    a = c[k >> 2] | 0;
                    c[k >> 2] = a + 2;
                    b[n >> 1] = b[a >> 1] | 0;
                    a = (c[c[m >> 2] >> 2] | 0) + ($(b[u >> 1] | 0, b[o >> 1] | 0) | 0) | 0;
                    c[c[m >> 2] >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) + ($(b[u >> 1] | 0, b[g >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 4 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 8 >> 2] | 0) + ($(b[u >> 1] | 0, b[l >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 8 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 12 >> 2] | 0) + ($(b[u >> 1] | 0, b[n >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 12 >> 2] = a;
                    c[q >> 2] = (c[q >> 2] | 0) + 4
                }
                a = c[q >> 2] | 0;
                c[q >> 2] = a + 1;
                if ((a | 0) < (c[r >> 2] | 0)) {
                    a = c[h >> 2] | 0;
                    c[h >> 2] = a + 2;
                    b[t >> 1] = b[a >> 1] | 0;
                    a = c[k >> 2] | 0;
                    c[k >> 2] = a + 2;
                    b[o >> 1] = b[a >> 1] | 0;
                    a = (c[c[m >> 2] >> 2] | 0) + ($(b[t >> 1] | 0, b[g >> 1] | 0) | 0) | 0;
                    c[c[m >> 2] >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) + ($(b[t >> 1] | 0, b[l >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 4 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 8 >> 2] | 0) + ($(b[t >> 1] | 0, b[n >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 8 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 12 >> 2] | 0) + ($(b[t >> 1] | 0, b[o >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 12 >> 2] = a
                }
                a = c[q >> 2] | 0;
                c[q >> 2] = a + 1;
                if ((a | 0) < (c[r >> 2] | 0)) {
                    a = c[h >> 2] | 0;
                    c[h >> 2] = a + 2;
                    b[s >> 1] = b[a >> 1] | 0;
                    a = c[k >> 2] | 0;
                    c[k >> 2] = a + 2;
                    b[g >> 1] = b[a >> 1] | 0;
                    a = (c[c[m >> 2] >> 2] | 0) + ($(b[s >> 1] | 0, b[l >> 1] | 0) | 0) | 0;
                    c[c[m >> 2] >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) + ($(b[s >> 1] | 0, b[n >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 4 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 8 >> 2] | 0) + ($(b[s >> 1] | 0, b[o >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 8 >> 2] = a;
                    a = (c[(c[m >> 2] | 0) + 12 >> 2] | 0) + ($(b[s >> 1] | 0, b[g >> 1] | 0) | 0) | 0;
                    c[(c[m >> 2] | 0) + 12 >> 2] = a
                }
                if ((c[q >> 2] | 0) >= (c[r >> 2] | 0)) {
                    i = p;
                    return
                }
                a = c[h >> 2] | 0;
                c[h >> 2] = a + 2;
                b[j >> 1] = b[a >> 1] | 0;
                a = c[k >> 2] | 0;
                c[k >> 2] = a + 2;
                b[l >> 1] = b[a >> 1] | 0;
                a = (c[c[m >> 2] >> 2] | 0) + ($(b[j >> 1] | 0, b[n >> 1] | 0) | 0) | 0;
                c[c[m >> 2] >> 2] = a;
                a = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) + ($(b[j >> 1] | 0, b[o >> 1] | 0) | 0) | 0;
                c[(c[m >> 2] | 0) + 4 >> 2] = a;
                a = (c[(c[m >> 2] | 0) + 8 >> 2] | 0) + ($(b[j >> 1] | 0, b[g >> 1] | 0) | 0) | 0;
                c[(c[m >> 2] | 0) + 8 >> 2] = a;
                a = (c[(c[m >> 2] | 0) + 12 >> 2] | 0) + ($(b[j >> 1] | 0, b[l >> 1] | 0) | 0) | 0;
                c[(c[m >> 2] | 0) + 12 >> 2] = a;
                i = p;
            }
            function zb(a, d, e, f, g, h) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0;
                p = i;
                i = i + 64 | 0;
                o = p + 48 | 0;
                t = p + 28 | 0;
                r = p;
                q = p + 40 | 0;
                m = p + 44 | 0;
                u = p + 52 | 0;
                l = p + 24 | 0;
                n = p + 36 | 0;
                s = p + 32 | 0;
                k = p + 8 | 0;
                j = p + 4 | 0;
                c[o >> 2] = a;
                c[t >> 2] = d;
                c[r >> 2] = e;
                c[q >> 2] = f;
                c[m >> 2] = g;
                c[u >> 2] = h;
                h = c[m >> 2] | 0;
                c[s >> 2] = ia() | 0;
                g = i;
                i = i + ((2 * h | 0) + 15 & -16) | 0;
                h = i;
                i = i + ((2 * ((c[q >> 2] | 0) + (c[m >> 2] | 0) | 0) | 0) + 15 & -16) | 0;
                c[l >> 2] = 0;
                while (1) {
                    if ((c[l >> 2] | 0) >= (c[m >> 2] | 0)) {
                        break
                    }
                    b[g + (c[l >> 2] << 1) >> 1] = b[(c[t >> 2] | 0) + ((c[m >> 2] | 0) - (c[l >> 2] | 0) - 1 << 1) >> 1] | 0;
                    c[l >> 2] = (c[l >> 2] | 0) + 1
                }
                c[l >> 2] = 0;
                while (1) {
                    if ((c[l >> 2] | 0) >= (c[m >> 2] | 0)) {
                        break
                    }
                    b[h + (c[l >> 2] << 1) >> 1] = 0 - (b[(c[u >> 2] | 0) + ((c[m >> 2] | 0) - (c[l >> 2] | 0) - 1 << 1) >> 1] | 0);
                    c[l >> 2] = (c[l >> 2] | 0) + 1
                }
                while (1) {
                    if ((c[l >> 2] | 0) >= ((c[q >> 2] | 0) + (c[m >> 2] | 0) | 0)) {
                        break
                    }
                    b[h + (c[l >> 2] << 1) >> 1] = 0;
                    c[l >> 2] = (c[l >> 2] | 0) + 1
                }
                c[l >> 2] = 0;
                while (1) {
                    if ((c[l >> 2] | 0) >= ((c[q >> 2] | 0) - 3 | 0)) {
                        break
                    }
                    c[k >> 2] = c[(c[o >> 2] | 0) + (c[l >> 2] << 2) >> 2];
                    c[k + 4 >> 2] = c[(c[o >> 2] | 0) + ((c[l >> 2] | 0) + 1 << 2) >> 2];
                    c[k + 8 >> 2] = c[(c[o >> 2] | 0) + ((c[l >> 2] | 0) + 2 << 2) >> 2];
                    c[k + 12 >> 2] = c[(c[o >> 2] | 0) + ((c[l >> 2] | 0) + 3 << 2) >> 2];
                    yb(g, h + (c[l >> 2] << 1) | 0, k, c[m >> 2] | 0);
                    b[h + ((c[l >> 2] | 0) + (c[m >> 2] | 0) << 1) >> 1] = 0 - (((c[k >> 2] | 0) + 2048 >> 12 & 65535) << 16 >> 16);
                    c[(c[r >> 2] | 0) + (c[l >> 2] << 2) >> 2] = c[k >> 2];
                    c[k + 4 >> 2] = (c[k + 4 >> 2] | 0) + ($(b[h + ((c[l >> 2] | 0) + (c[m >> 2] | 0) << 1) >> 1] | 0, b[c[t >> 2] >> 1] | 0) | 0);
                    b[h + ((c[l >> 2] | 0) + (c[m >> 2] | 0) + 1 << 1) >> 1] = 0 - (((c[k + 4 >> 2] | 0) + 2048 >> 12 & 65535) << 16 >> 16);
                    c[(c[r >> 2] | 0) + ((c[l >> 2] | 0) + 1 << 2) >> 2] = c[k + 4 >> 2];
                    c[k + 8 >> 2] = (c[k + 8 >> 2] | 0) + ($(b[h + ((c[l >> 2] | 0) + (c[m >> 2] | 0) + 1 << 1) >> 1] | 0, b[c[t >> 2] >> 1] | 0) | 0);
                    c[k + 8 >> 2] = (c[k + 8 >> 2] | 0) + ($(b[h + ((c[l >> 2] | 0) + (c[m >> 2] | 0) << 1) >> 1] | 0, b[(c[t >> 2] | 0) + 2 >> 1] | 0) | 0);
                    b[h + ((c[l >> 2] | 0) + (c[m >> 2] | 0) + 2 << 1) >> 1] = 0 - (((c[k + 8 >> 2] | 0) + 2048 >> 12 & 65535) << 16 >> 16);
                    c[(c[r >> 2] | 0) + ((c[l >> 2] | 0) + 2 << 2) >> 2] = c[k + 8 >> 2];
                    c[k + 12 >> 2] = (c[k + 12 >> 2] | 0) + ($(b[h + ((c[l >> 2] | 0) + (c[m >> 2] | 0) + 2 << 1) >> 1] | 0, b[c[t >> 2] >> 1] | 0) | 0);
                    c[k + 12 >> 2] = (c[k + 12 >> 2] | 0) + ($(b[h + ((c[l >> 2] | 0) + (c[m >> 2] | 0) + 1 << 1) >> 1] | 0, b[(c[t >> 2] | 0) + 2 >> 1] | 0) | 0);
                    c[k + 12 >> 2] = (c[k + 12 >> 2] | 0) + ($(b[h + ((c[l >> 2] | 0) + (c[m >> 2] | 0) << 1) >> 1] | 0, b[(c[t >> 2] | 0) + 4 >> 1] | 0) | 0);
                    b[h + ((c[l >> 2] | 0) + (c[m >> 2] | 0) + 3 << 1) >> 1] = 0 - (((c[k + 12 >> 2] | 0) + 2048 >> 12 & 65535) << 16 >> 16);
                    c[(c[r >> 2] | 0) + ((c[l >> 2] | 0) + 3 << 2) >> 2] = c[k + 12 >> 2];
                    c[l >> 2] = (c[l >> 2] | 0) + 4
                }
                while (1) {
                    if ((c[l >> 2] | 0) >= (c[q >> 2] | 0)) {
                        break
                    }
                    c[j >> 2] = c[(c[o >> 2] | 0) + (c[l >> 2] << 2) >> 2];
                    c[n >> 2] = 0;
                    while (1) {
                        if ((c[n >> 2] | 0) >= (c[m >> 2] | 0)) {
                            break
                        }
                        a = $(b[g + (c[n >> 2] << 1) >> 1] | 0, b[h + ((c[l >> 2] | 0) + (c[n >> 2] | 0) << 1) >> 1] | 0) | 0;
                        c[j >> 2] = (c[j >> 2] | 0) - a;
                        c[n >> 2] = (c[n >> 2] | 0) + 1
                    }
                    b[h + ((c[l >> 2] | 0) + (c[m >> 2] | 0) << 1) >> 1] = (c[j >> 2] | 0) + 2048 >> 12;
                    c[(c[r >> 2] | 0) + (c[l >> 2] << 2) >> 2] = c[j >> 2];
                    c[l >> 2] = (c[l >> 2] | 0) + 1
                }
                c[l >> 2] = 0;
                while (1) {
                    if ((c[l >> 2] | 0) >= (c[m >> 2] | 0)) {
                        break
                    }
                    b[(c[u >> 2] | 0) + (c[l >> 2] << 1) >> 1] = c[(c[r >> 2] | 0) + ((c[q >> 2] | 0) - (c[l >> 2] | 0) - 1 << 2) >> 2];
                    c[l >> 2] = (c[l >> 2] | 0) + 1
                }
                na(c[s >> 2] | 0);
                i = p;
            }
            function Ab(a, d, e, f, g, h, j) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                var k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0,
                    y = 0, z = 0, A = 0, B = 0;
                n = i;
                i = i + 80 | 0;
                z = n + 32 | 0;
                q = n + 24 | 0;
                B = n + 44 | 0;
                A = n + 60 | 0;
                p = n + 12 | 0;
                t = n + 40 | 0;
                x = n + 56 | 0;
                o = n + 64 | 0;
                u = n + 68 | 0;
                v = n + 8 | 0;
                s = n + 4 | 0;
                w = n;
                m = n + 36 | 0;
                y = n + 16 | 0;
                r = n + 20 | 0;
                k = n + 52 | 0;
                l = n + 28 | 0;
                c[z >> 2] = a;
                c[q >> 2] = d;
                c[B >> 2] = e;
                c[A >> 2] = f;
                c[p >> 2] = g;
                c[t >> 2] = h;
                c[n + 48 >> 2] = j;
                c[v >> 2] = (c[t >> 2] | 0) - (c[p >> 2] | 0);
                a = c[t >> 2] | 0;
                c[m >> 2] = ia() | 0;
                j = i;
                i = i + ((2 * a | 0) + 15 & -16) | 0;
                if ((c[A >> 2] | 0) == 0) {
                    c[w >> 2] = c[z >> 2]
                } else {
                    c[o >> 2] = 0;
                    while (1) {
                        if ((c[o >> 2] | 0) >= (c[t >> 2] | 0)) {
                            break
                        }
                        b[j + (c[o >> 2] << 1) >> 1] = b[(c[z >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0;
                        c[o >> 2] = (c[o >> 2] | 0) + 1
                    }
                    c[o >> 2] = 0;
                    while (1) {
                        if ((c[o >> 2] | 0) >= (c[A >> 2] | 0)) {
                            break
                        }
                        a = ($(b[(c[z >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0, b[(c[B >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0) | 0) >> 15 & 65535;
                        b[j + (c[o >> 2] << 1) >> 1] = a;
                        a = ($(b[(c[z >> 2] | 0) + ((c[t >> 2] | 0) - (c[o >> 2] | 0) - 1 << 1) >> 1] | 0, b[(c[B >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0) | 0) >> 15 & 65535;
                        b[j + ((c[t >> 2] | 0) - (c[o >> 2] | 0) - 1 << 1) >> 1] = a;
                        c[o >> 2] = (c[o >> 2] | 0) + 1
                    }
                    c[w >> 2] = j
                }
                c[s >> 2] = 0;
                c[y >> 2] = 1 + (c[t >> 2] << 7);
                if ((c[t >> 2] & 1 | 0) != 0) {
                    a = ($(b[c[w >> 2] >> 1] | 0, b[c[w >> 2] >> 1] | 0) | 0) >> 9;
                    c[y >> 2] = (c[y >> 2] | 0) + a
                }
                c[o >> 2] = c[t >> 2] & 1;
                while (1) {
                    if ((c[o >> 2] | 0) >= (c[t >> 2] | 0)) {
                        break
                    }
                    a = ($(b[(c[w >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0, b[(c[w >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0) | 0) >> 9;
                    c[y >> 2] = (c[y >> 2] | 0) + a;
                    a = ($(b[(c[w >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] | 0, b[(c[w >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] | 0) | 0) >> 9;
                    c[y >> 2] = (c[y >> 2] | 0) + a;
                    c[o >> 2] = (c[o >> 2] | 0) + 2
                }
                c[s >> 2] = ((Bb(c[y >> 2] | 0) | 0) << 16 >> 16) - 30 + 10;
                c[s >> 2] = (c[s >> 2] | 0) / 2 | 0;
                if ((c[s >> 2] | 0) > 0) {
                    c[o >> 2] = 0;
                    while (1) {
                        if ((c[o >> 2] | 0) >= (c[t >> 2] | 0)) {
                            break
                        }
                        b[j + (c[o >> 2] << 1) >> 1] = (b[(c[w >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0) + (1 << c[s >> 2] >> 1) >> c[s >> 2];
                        c[o >> 2] = (c[o >> 2] | 0) + 1
                    }
                    c[w >> 2] = j
                } else {
                    c[s >> 2] = 0
                }
                vc(c[w >> 2] | 0, c[w >> 2] | 0, c[q >> 2] | 0, c[v >> 2] | 0, (c[p >> 2] | 0) + 1 | 0) | 0;
                c[u >> 2] = 0;
                while (1) {
                    if ((c[u >> 2] | 0) > (c[p >> 2] | 0)) {
                        break
                    }
                    c[o >> 2] = (c[u >> 2] | 0) + (c[v >> 2] | 0);
                    c[x >> 2] = 0;
                    while (1) {
                        y = c[x >> 2] | 0;
                        if ((c[o >> 2] | 0) >= (c[t >> 2] | 0)) {
                            break
                        }
                        c[x >> 2] = y + ($(b[(c[w >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0, b[(c[w >> 2] | 0) + ((c[o >> 2] | 0) - (c[u >> 2] | 0) << 1) >> 1] | 0) | 0);
                        c[o >> 2] = (c[o >> 2] | 0) + 1
                    }
                    a = (c[q >> 2] | 0) + (c[u >> 2] << 2) | 0;
                    c[a >> 2] = (c[a >> 2] | 0) + y;
                    c[u >> 2] = (c[u >> 2] | 0) + 1
                }
                c[s >> 2] = c[s >> 2] << 1;
                if ((c[s >> 2] | 0) <= 0) {
                    a = c[q >> 2] | 0;
                    c[a >> 2] = (c[a >> 2] | 0) + (1 << 0 - (c[s >> 2] | 0))
                }
                t = c[c[q >> 2] >> 2] | 0;
                if ((c[c[q >> 2] >> 2] | 0) < 268435456) {
                    c[r >> 2] = 29 - (32 - (We(t | 0) | 0));
                    c[o >> 2] = 0;
                    while (1) {
                        if ((c[o >> 2] | 0) > (c[p >> 2] | 0)) {
                            break
                        }
                        c[(c[q >> 2] | 0) + (c[o >> 2] << 2) >> 2] = c[(c[q >> 2] | 0) + (c[o >> 2] << 2) >> 2] << c[r >> 2];
                        c[o >> 2] = (c[o >> 2] | 0) + 1
                    }
                    c[s >> 2] = (c[s >> 2] | 0) - (c[r >> 2] | 0);
                    a = c[s >> 2] | 0;
                    c[l >> 2] = 1;
                    d = c[m >> 2] | 0;
                    na(d | 0);
                    i = n;
                    return a | 0
                }
                if ((t | 0) < 536870912) {
                    a = c[s >> 2] | 0;
                    c[l >> 2] = 1;
                    d = c[m >> 2] | 0;
                    na(d | 0);
                    i = n;
                    return a | 0
                }
                c[k >> 2] = 1;
                if ((c[c[q >> 2] >> 2] | 0) >= 1073741824) {
                    c[k >> 2] = (c[k >> 2] | 0) + 1
                }
                c[o >> 2] = 0;
                while (1) {
                    if ((c[o >> 2] | 0) > (c[p >> 2] | 0)) {
                        break
                    }
                    c[(c[q >> 2] | 0) + (c[o >> 2] << 2) >> 2] = c[(c[q >> 2] | 0) + (c[o >> 2] << 2) >> 2] >> c[k >> 2];
                    c[o >> 2] = (c[o >> 2] | 0) + 1
                }
                c[s >> 2] = (c[s >> 2] | 0) + (c[k >> 2] | 0);
                a = c[s >> 2] | 0;
                c[l >> 2] = 1;
                d = c[m >> 2] | 0;
                na(d | 0);
                i = n;
                return a | 0
            }
            function Bb(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                a = 32 - (We(c[d >> 2] | 0) | 0) - 1 & 65535;
                i = b;
                return a | 0
            }
            function Cb(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0;
                f = i;
                i = i + 16 | 0;
                j = f + 12 | 0;
                h = f + 8 | 0;
                g = f + 4 | 0;
                k = f;
                c[j >> 2] = a;
                c[h >> 2] = b;
                c[g >> 2] = d;
                c[k >> 2] = e;
                e = c[k >> 2] | 0;
                a = Db(c[h >> 2] | 0, c[j >> 2] | 0) | 0;
                d = c[(c[264 + (((c[h >> 2] | 0) < (c[g >> 2] | 0) ? c[h >> 2] | 0 : c[g >> 2] | 0) << 2) >> 2] | 0) + (((c[h >> 2] | 0) > (c[g >> 2] | 0) ? c[h >> 2] | 0 : c[g >> 2] | 0) << 2) >> 2] | 0;
                if ((c[h >> 2] | 0) > ((c[g >> 2] | 0) + 1 | 0)) {
                    b = c[h >> 2] | 0
                } else {
                    b = (c[g >> 2] | 0) + 1 | 0
                }
                if ((c[h >> 2] | 0) < ((c[g >> 2] | 0) + 1 | 0)) {
                    k = c[h >> 2] | 0;
                    k = 264 + (k << 2) | 0;
                    k = c[k >> 2] | 0;
                    k = k + (b << 2) | 0;
                    k = c[k >> 2] | 0;
                    k = d + k | 0;
                    Xb(e, a, k);
                    i = f;
                } else {
                    k = (c[g >> 2] | 0) + 1 | 0;
                    k = 264 + (k << 2) | 0;
                    k = c[k >> 2] | 0;
                    k = k + (b << 2) | 0;
                    k = c[k >> 2] | 0;
                    k = d + k | 0;
                    Xb(e, a, k);
                    i = f;
                }
            }
            function Db(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0;
                h = i;
                i = i + 32 | 0;
                f = h + 16 | 0;
                d = h + 12 | 0;
                e = h + 8 | 0;
                j = h + 4 | 0;
                g = h;
                c[f >> 2] = a;
                c[d >> 2] = b;
                c[j >> 2] = (c[f >> 2] | 0) - 1;
                c[e >> 2] = (c[(c[d >> 2] | 0) + (c[j >> 2] << 2) >> 2] | 0) < 0 & 1;
                c[g >> 2] = O(c[(c[d >> 2] | 0) + (c[j >> 2] << 2) >> 2] | 0) | 0;
                do {
                    c[j >> 2] = (c[j >> 2] | 0) + -1;
                    if (((c[f >> 2] | 0) - (c[j >> 2] | 0) | 0) > (c[g >> 2] | 0)) {
                        b = (c[f >> 2] | 0) - (c[j >> 2] | 0) | 0
                    } else {
                        b = c[g >> 2] | 0
                    }
                    if (((c[f >> 2] | 0) - (c[j >> 2] | 0) | 0) < (c[g >> 2] | 0)) {
                        a = (c[f >> 2] | 0) - (c[j >> 2] | 0) | 0
                    } else {
                        a = c[g >> 2] | 0
                    }
                    c[e >> 2] = (c[e >> 2] | 0) + (c[(c[264 + (a << 2) >> 2] | 0) + (b << 2) >> 2] | 0);
                    a = O(c[(c[d >> 2] | 0) + (c[j >> 2] << 2) >> 2] | 0) | 0;
                    c[g >> 2] = (c[g >> 2] | 0) + a;
                    if ((c[(c[d >> 2] | 0) + (c[j >> 2] << 2) >> 2] | 0) < 0) {
                        if (((c[f >> 2] | 0) - (c[j >> 2] | 0) | 0) > ((c[g >> 2] | 0) + 1 | 0)) {
                            b = (c[f >> 2] | 0) - (c[j >> 2] | 0) | 0
                        } else {
                            b = (c[g >> 2] | 0) + 1 | 0
                        }
                        if (((c[f >> 2] | 0) - (c[j >> 2] | 0) | 0) < ((c[g >> 2] | 0) + 1 | 0)) {
                            a = (c[f >> 2] | 0) - (c[j >> 2] | 0) | 0
                        } else {
                            a = (c[g >> 2] | 0) + 1 | 0
                        }
                        c[e >> 2] = (c[e >> 2] | 0) + (c[(c[264 + (a << 2) >> 2] | 0) + (b << 2) >> 2] | 0)
                    }
                } while ((c[j >> 2] | 0) > 0);
                i = h;
                return c[e >> 2] | 0
            }
            function Eb(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0;
                j = i;
                i = i + 16 | 0;
                h = j + 12 | 0;
                f = j + 8 | 0;
                g = j + 4 | 0;
                k = j;
                c[h >> 2] = a;
                c[f >> 2] = b;
                c[g >> 2] = d;
                c[k >> 2] = e;
                e = c[f >> 2] | 0;
                b = c[g >> 2] | 0;
                if ((c[f >> 2] | 0) > ((c[g >> 2] | 0) + 1 | 0)) {
                    d = c[f >> 2] | 0
                } else {
                    d = (c[g >> 2] | 0) + 1 | 0
                }
                if ((c[f >> 2] | 0) < ((c[g >> 2] | 0) + 1 | 0)) {
                    a = c[f >> 2] | 0
                } else {
                    a = (c[g >> 2] | 0) + 1 | 0
                }
                a = Qb(c[k >> 2] | 0, (c[(c[264 + (((c[f >> 2] | 0) < (c[g >> 2] | 0) ? c[f >> 2] | 0 : c[g >> 2] | 0) << 2) >> 2] | 0) + (((c[f >> 2] | 0) > (c[g >> 2] | 0) ? c[f >> 2] | 0 : c[g >> 2] | 0) << 2) >> 2] | 0) + (c[(c[264 + (a << 2) >> 2] | 0) + (d << 2) >> 2] | 0) | 0) | 0;
                a = Fb(e, b, a, c[h >> 2] | 0) | 0;
                i = j;
                return a | 0
            }
            function Fb(a, d, e, f) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0;
                o = i;
                i = i + 48 | 0;
                r = o;
                n = o + 16 | 0;
                g = o + 4 | 0;
                l = o + 8 | 0;
                h = o + 32 | 0;
                j = o + 36 | 0;
                p = o + 12 | 0;
                k = o + 40 | 0;
                m = o + 20 | 0;
                s = o + 28 | 0;
                q = o + 24 | 0;
                c[r >> 2] = a;
                c[n >> 2] = d;
                c[g >> 2] = e;
                c[l >> 2] = f;
                c[m >> 2] = 0;
                while (1) {
                    f = c[n >> 2] | 0;
                    if ((c[r >> 2] | 0) <= 2) {
                        break
                    }
                    e = c[r >> 2] | 0;
                    do {
                        if ((f | 0) >= (c[r >> 2] | 0)) {
                            c[q >> 2] = c[264 + (e << 2) >> 2];
                            c[h >> 2] = c[(c[q >> 2] | 0) + ((c[n >> 2] | 0) + 1 << 2) >> 2];
                            c[j >> 2] = 0 - ((c[g >> 2] | 0) >>> 0 >= (c[h >> 2] | 0) >>> 0 & 1);
                            c[g >> 2] = (c[g >> 2] | 0) - (c[h >> 2] & c[j >> 2]);
                            c[p >> 2] = c[n >> 2];
                            c[s >> 2] = c[(c[q >> 2] | 0) + (c[r >> 2] << 2) >> 2];
                            a:do {
                                if ((c[s >> 2] | 0) >>> 0 > (c[g >> 2] | 0) >>> 0) {
                                    c[n >> 2] = c[r >> 2];
                                    do {
                                        a = c[r >> 2] | 0;
                                        d = (c[n >> 2] | 0) + -1 | 0;
                                        c[n >> 2] = d;
                                        c[h >> 2] = c[(c[264 + (d << 2) >> 2] | 0) + (a << 2) >> 2]
                                    } while ((c[h >> 2] | 0) >>> 0 > (c[g >> 2] | 0) >>> 0)
                                } else {
                                    c[h >> 2] = c[(c[q >> 2] | 0) + (c[n >> 2] << 2) >> 2];
                                    while (1) {
                                        if (!((c[h >> 2] | 0) >>> 0 > (c[g >> 2] | 0) >>> 0)) {
                                            break a
                                        }
                                        c[n >> 2] = (c[n >> 2] | 0) + -1;
                                        c[h >> 2] = c[(c[q >> 2] | 0) + (c[n >> 2] << 2) >> 2]
                                    }
                                }
                            } while (0);
                            c[g >> 2] = (c[g >> 2] | 0) - (c[h >> 2] | 0);
                            b[k >> 1] = (c[p >> 2] | 0) - (c[n >> 2] | 0) + (c[j >> 2] | 0) ^ c[j >> 2];
                            d = b[k >> 1] | 0;
                            a = c[l >> 2] | 0;
                            c[l >> 2] = a + 4;
                            c[a >> 2] = d;
                            c[m >> 2] = (c[m >> 2] | 0) + ($(b[k >> 1] | 0, b[k >> 1] | 0) | 0)
                        } else {
                            c[h >> 2] = c[(c[264 + (c[n >> 2] << 2) >> 2] | 0) + (e << 2) >> 2];
                            c[s >> 2] = c[(c[264 + ((c[n >> 2] | 0) + 1 << 2) >> 2] | 0) + (c[r >> 2] << 2) >> 2];
                            if ((c[h >> 2] | 0) >>> 0 <= (c[g >> 2] | 0) >>> 0 ? (c[g >> 2] | 0) >>> 0 < (c[s >> 2] | 0) >>> 0 : 0) {
                                c[g >> 2] = (c[g >> 2] | 0) - (c[h >> 2] | 0);
                                a = c[l >> 2] | 0;
                                c[l >> 2] = a + 4;
                                c[a >> 2] = 0;
                                break
                            }
                            c[j >> 2] = 0 - ((c[g >> 2] | 0) >>> 0 >= (c[s >> 2] | 0) >>> 0 & 1);
                            c[g >> 2] = (c[g >> 2] | 0) - (c[s >> 2] & c[j >> 2]);
                            c[p >> 2] = c[n >> 2];
                            do {
                                a = c[r >> 2] | 0;
                                d = (c[n >> 2] | 0) + -1 | 0;
                                c[n >> 2] = d;
                                c[h >> 2] = c[(c[264 + (d << 2) >> 2] | 0) + (a << 2) >> 2]
                            } while ((c[h >> 2] | 0) >>> 0 > (c[g >> 2] | 0) >>> 0);
                            c[g >> 2] = (c[g >> 2] | 0) - (c[h >> 2] | 0);
                            b[k >> 1] = (c[p >> 2] | 0) - (c[n >> 2] | 0) + (c[j >> 2] | 0) ^ c[j >> 2];
                            d = b[k >> 1] | 0;
                            a = c[l >> 2] | 0;
                            c[l >> 2] = a + 4;
                            c[a >> 2] = d;
                            c[m >> 2] = (c[m >> 2] | 0) + ($(b[k >> 1] | 0, b[k >> 1] | 0) | 0)
                        }
                    } while (0);
                    c[r >> 2] = (c[r >> 2] | 0) + -1
                }
                c[h >> 2] = (f << 1) + 1;
                c[j >> 2] = 0 - ((c[g >> 2] | 0) >>> 0 >= (c[h >> 2] | 0) >>> 0 & 1);
                c[g >> 2] = (c[g >> 2] | 0) - (c[h >> 2] & c[j >> 2]);
                c[p >> 2] = c[n >> 2];
                c[n >> 2] = ((c[g >> 2] | 0) + 1 | 0) >>> 1;
                if ((c[n >> 2] | 0) == 0) {
                    d = c[p >> 2] | 0;
                    a = c[n >> 2] | 0;
                    a = d - a | 0;
                    d = c[j >> 2] | 0;
                    d = a + d | 0;
                    a = c[j >> 2] | 0;
                    a = d ^ a;
                    a = a & 65535;
                    b[k >> 1] = a;
                    a = b[k >> 1] | 0;
                    a = a << 16 >> 16;
                    d = c[l >> 2] | 0;
                    e = d + 4 | 0;
                    c[l >> 2] = e;
                    c[d >> 2] = a;
                    d = c[m >> 2] | 0;
                    a = b[k >> 1] | 0;
                    a = a << 16 >> 16;
                    e = b[k >> 1] | 0;
                    e = e << 16 >> 16;
                    e = $(a, e) | 0;
                    e = d + e | 0;
                    c[m >> 2] = e;
                    e = c[g >> 2] | 0;
                    e = 0 - e | 0;
                    c[j >> 2] = e;
                    e = c[n >> 2] | 0;
                    d = c[j >> 2] | 0;
                    d = e + d | 0;
                    e = c[j >> 2] | 0;
                    e = d ^ e;
                    e = e & 65535;
                    b[k >> 1] = e;
                    e = b[k >> 1] | 0;
                    e = e << 16 >> 16;
                    d = c[l >> 2] | 0;
                    c[d >> 2] = e;
                    d = c[m >> 2] | 0;
                    e = b[k >> 1] | 0;
                    e = e << 16 >> 16;
                    a = b[k >> 1] | 0;
                    a = a << 16 >> 16;
                    a = $(e, a) | 0;
                    a = d + a | 0;
                    c[m >> 2] = a;
                    a = c[m >> 2] | 0;
                    i = o;
                    return a | 0
                }
                c[g >> 2] = (c[g >> 2] | 0) - ((c[n >> 2] << 1) - 1);
                d = c[p >> 2] | 0;
                a = c[n >> 2] | 0;
                a = d - a | 0;
                d = c[j >> 2] | 0;
                d = a + d | 0;
                a = c[j >> 2] | 0;
                a = d ^ a;
                a = a & 65535;
                b[k >> 1] = a;
                a = b[k >> 1] | 0;
                a = a << 16 >> 16;
                d = c[l >> 2] | 0;
                e = d + 4 | 0;
                c[l >> 2] = e;
                c[d >> 2] = a;
                d = c[m >> 2] | 0;
                a = b[k >> 1] | 0;
                a = a << 16 >> 16;
                e = b[k >> 1] | 0;
                e = e << 16 >> 16;
                e = $(a, e) | 0;
                e = d + e | 0;
                c[m >> 2] = e;
                e = c[g >> 2] | 0;
                e = 0 - e | 0;
                c[j >> 2] = e;
                e = c[n >> 2] | 0;
                d = c[j >> 2] | 0;
                d = e + d | 0;
                e = c[j >> 2] | 0;
                e = d ^ e;
                e = e & 65535;
                b[k >> 1] = e;
                e = b[k >> 1] | 0;
                e = e << 16 >> 16;
                d = c[l >> 2] | 0;
                c[d >> 2] = e;
                d = c[m >> 2] | 0;
                e = b[k >> 1] | 0;
                e = e << 16 >> 16;
                a = b[k >> 1] | 0;
                a = a << 16 >> 16;
                a = $(e, a) | 0;
                a = d + a | 0;
                c[m >> 2] = a;
                a = c[m >> 2] | 0;
                i = o;
                return a | 0
            }
            function Gb(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0;
                e = i;
                i = i + 32 | 0;
                h = e + 16 | 0;
                d = e + 12 | 0;
                g = e + 8 | 0;
                b = e + 4 | 0;
                f = e;
                c[h >> 2] = a;
                c[d >> 2] = c[(c[h >> 2] | 0) + 20 >> 2] << 3;
                c[b >> 2] = 32 - (We(c[(c[h >> 2] | 0) + 28 >> 2] | 0) | 0);
                c[g >> 2] = (c[(c[h >> 2] | 0) + 28 >> 2] | 0) >>> ((c[b >> 2] | 0) - 16 | 0);
                c[f >> 2] = ((c[g >> 2] | 0) >>> 12) - 8;
                c[f >> 2] = (c[f >> 2] | 0) + ((c[g >> 2] | 0) >>> 0 > (c[5416 + (c[f >> 2] << 2) >> 2] | 0) >>> 0 & 1);
                c[b >> 2] = (c[b >> 2] << 3) + (c[f >> 2] | 0);
                i = e;
                return (c[d >> 2] | 0) - (c[b >> 2] | 0) | 0
            }
            function Hb(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0;
                e = i;
                i = i + 16 | 0;
                f = e + 8 | 0;
                h = e + 4 | 0;
                g = e;
                c[f >> 2] = a;
                c[h >> 2] = b;
                c[g >> 2] = d;
                c[c[f >> 2] >> 2] = c[h >> 2];
                c[(c[f >> 2] | 0) + 4 >> 2] = c[g >> 2];
                c[(c[f >> 2] | 0) + 8 >> 2] = 0;
                c[(c[f >> 2] | 0) + 12 >> 2] = 0;
                c[(c[f >> 2] | 0) + 16 >> 2] = 0;
                c[(c[f >> 2] | 0) + 20 >> 2] = 9;
                c[(c[f >> 2] | 0) + 24 >> 2] = 0;
                c[(c[f >> 2] | 0) + 28 >> 2] = 128;
                a = Ib(c[f >> 2] | 0) | 0;
                c[(c[f >> 2] | 0) + 40 >> 2] = a;
                c[(c[f >> 2] | 0) + 32 >> 2] = (c[(c[f >> 2] | 0) + 28 >> 2] | 0) - 1 - (c[(c[f >> 2] | 0) + 40 >> 2] >> 1);
                c[(c[f >> 2] | 0) + 44 >> 2] = 0;
                Jb(c[f >> 2] | 0);
                i = e;
            }
            function Ib(a) {
                a = a | 0;
                var b = 0, e = 0, f = 0;
                b = i;
                i = i + 16 | 0;
                e = b;
                c[e >> 2] = a;
                if (!((c[(c[e >> 2] | 0) + 24 >> 2] | 0) >>> 0 < (c[(c[e >> 2] | 0) + 4 >> 2] | 0) >>> 0)) {
                    e = 0;
                    i = b;
                    return e | 0
                }
                f = (c[e >> 2] | 0) + 24 | 0;
                a = c[f >> 2] | 0;
                c[f >> 2] = a + 1;
                e = d[(c[c[e >> 2] >> 2] | 0) + a >> 0] | 0;
                i = b;
                return e | 0
            }
            function Jb(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0;
                b = i;
                i = i + 16 | 0;
                d = b + 4 | 0;
                e = b;
                c[d >> 2] = a;
                while (1) {
                    if (!((c[(c[d >> 2] | 0) + 28 >> 2] | 0) >>> 0 <= 8388608)) {
                        break
                    }
                    a = (c[d >> 2] | 0) + 20 | 0;
                    c[a >> 2] = (c[a >> 2] | 0) + 8;
                    a = (c[d >> 2] | 0) + 28 | 0;
                    c[a >> 2] = c[a >> 2] << 8;
                    c[e >> 2] = c[(c[d >> 2] | 0) + 40 >> 2];
                    a = Ib(c[d >> 2] | 0) | 0;
                    c[(c[d >> 2] | 0) + 40 >> 2] = a;
                    c[e >> 2] = (c[e >> 2] << 8 | c[(c[d >> 2] | 0) + 40 >> 2]) >> 1;
                    c[(c[d >> 2] | 0) + 32 >> 2] = (c[(c[d >> 2] | 0) + 32 >> 2] << 8) + (255 & ~c[e >> 2]) & 2147483647
                }
                i = b;
            }
            function Kb(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0;
                f = i;
                i = i + 16 | 0;
                g = f + 8 | 0;
                e = f + 4 | 0;
                d = f;
                c[g >> 2] = a;
                c[e >> 2] = b;
                a = Lb(c[(c[g >> 2] | 0) + 28 >> 2] | 0, c[e >> 2] | 0) | 0;
                c[(c[g >> 2] | 0) + 36 >> 2] = a;
                c[d >> 2] = ((c[(c[g >> 2] | 0) + 32 >> 2] | 0) >>> 0) / ((c[(c[g >> 2] | 0) + 36 >> 2] | 0) >>> 0) | 0;
                i = f;
                return (c[e >> 2] | 0) - ((c[d >> 2] | 0) + 1 + ((c[e >> 2] | 0) - ((c[d >> 2] | 0) + 1) & 0 - ((c[e >> 2] | 0) >>> 0 < ((c[d >> 2] | 0) + 1 | 0) >>> 0 & 1))) | 0
            }
            function Lb(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0;
                f = i;
                i = i + 16 | 0;
                e = f + 4 | 0;
                d = f;
                c[e >> 2] = a;
                c[d >> 2] = b;
                i = f;
                return ((c[e >> 2] | 0) >>> 0) / ((c[d >> 2] | 0) >>> 0) | 0 | 0
            }
            function Mb(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0;
                f = i;
                i = i + 16 | 0;
                g = f + 8 | 0;
                e = f + 4 | 0;
                d = f;
                c[g >> 2] = a;
                c[e >> 2] = b;
                c[(c[g >> 2] | 0) + 36 >> 2] = (c[(c[g >> 2] | 0) + 28 >> 2] | 0) >>> (c[e >> 2] | 0);
                c[d >> 2] = ((c[(c[g >> 2] | 0) + 32 >> 2] | 0) >>> 0) / ((c[(c[g >> 2] | 0) + 36 >> 2] | 0) >>> 0) | 0;
                i = f;
                return (1 << c[e >> 2]) - ((c[d >> 2] | 0) + 1 + ((1 << c[e >> 2]) - ((c[d >> 2] | 0) + 1) & 0 - (1 << c[e >> 2] >>> 0 < ((c[d >> 2] | 0) + 1 | 0) >>> 0 & 1))) | 0
            }
            function Nb(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                f = i;
                i = i + 32 | 0;
                g = f + 16 | 0;
                h = f + 12 | 0;
                j = f + 8 | 0;
                l = f + 4 | 0;
                k = f;
                c[g >> 2] = a;
                c[h >> 2] = b;
                c[j >> 2] = d;
                c[l >> 2] = e;
                c[k >> 2] = $(c[(c[g >> 2] | 0) + 36 >> 2] | 0, (c[l >> 2] | 0) - (c[j >> 2] | 0) | 0) | 0;
                e = (c[g >> 2] | 0) + 32 | 0;
                c[e >> 2] = (c[e >> 2] | 0) - (c[k >> 2] | 0);
                e = c[g >> 2] | 0;
                if ((c[h >> 2] | 0) >>> 0 > 0) {
                    a = $(c[e + 36 >> 2] | 0, (c[j >> 2] | 0) - (c[h >> 2] | 0) | 0) | 0;
                    l = c[g >> 2] | 0;
                    l = l + 28 | 0;
                    c[l >> 2] = a;
                    l = c[g >> 2] | 0;
                    Jb(l);
                    i = f;
                } else {
                    a = (c[e + 28 >> 2] | 0) - (c[k >> 2] | 0) | 0;
                    l = c[g >> 2] | 0;
                    l = l + 28 | 0;
                    c[l >> 2] = a;
                    l = c[g >> 2] | 0;
                    Jb(l);
                    i = f;
                }
            }
            function Ob(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0;
                g = i;
                i = i + 32 | 0;
                e = g + 20 | 0;
                k = g + 16 | 0;
                h = g + 12 | 0;
                j = g + 8 | 0;
                d = g + 4 | 0;
                f = g;
                c[e >> 2] = a;
                c[k >> 2] = b;
                c[h >> 2] = c[(c[e >> 2] | 0) + 28 >> 2];
                c[j >> 2] = c[(c[e >> 2] | 0) + 32 >> 2];
                c[d >> 2] = (c[h >> 2] | 0) >>> (c[k >> 2] | 0);
                c[f >> 2] = (c[j >> 2] | 0) >>> 0 < (c[d >> 2] | 0) >>> 0 & 1;
                if ((c[f >> 2] | 0) == 0) {
                    c[(c[e >> 2] | 0) + 32 >> 2] = (c[j >> 2] | 0) - (c[d >> 2] | 0)
                }
                if ((c[f >> 2] | 0) != 0) {
                    a = c[d >> 2] | 0;
                    k = c[e >> 2] | 0;
                    k = k + 28 | 0;
                    c[k >> 2] = a;
                    k = c[e >> 2] | 0;
                    Jb(k);
                    k = c[f >> 2] | 0;
                    i = g;
                    return k | 0
                } else {
                    a = (c[h >> 2] | 0) - (c[d >> 2] | 0) | 0;
                    k = c[e >> 2] | 0;
                    k = k + 28 | 0;
                    c[k >> 2] = a;
                    k = c[e >> 2] | 0;
                    Jb(k);
                    k = c[f >> 2] | 0;
                    i = g;
                    return k | 0
                }
                return 0
            }
            function Pb(a, b, e) {
                a = a | 0;
                b = b | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0;
                f = i;
                i = i + 32 | 0;
                h = f + 4 | 0;
                n = f + 16 | 0;
                o = f + 8 | 0;
                m = f + 20 | 0;
                k = f + 28 | 0;
                g = f;
                j = f + 12 | 0;
                l = f + 24 | 0;
                c[h >> 2] = a;
                c[n >> 2] = b;
                c[o >> 2] = e;
                c[g >> 2] = c[(c[h >> 2] | 0) + 28 >> 2];
                c[k >> 2] = c[(c[h >> 2] | 0) + 32 >> 2];
                c[m >> 2] = (c[g >> 2] | 0) >>> (c[o >> 2] | 0);
                c[l >> 2] = -1;
                do {
                    c[j >> 2] = c[g >> 2];
                    a = c[m >> 2] | 0;
                    o = (c[l >> 2] | 0) + 1 | 0;
                    c[l >> 2] = o;
                    c[g >> 2] = $(a, d[(c[n >> 2] | 0) + o >> 0] | 0) | 0
                } while ((c[k >> 2] | 0) >>> 0 < (c[g >> 2] | 0) >>> 0);
                c[(c[h >> 2] | 0) + 32 >> 2] = (c[k >> 2] | 0) - (c[g >> 2] | 0);
                c[(c[h >> 2] | 0) + 28 >> 2] = (c[j >> 2] | 0) - (c[g >> 2] | 0);
                Jb(c[h >> 2] | 0);
                i = f;
                return c[l >> 2] | 0
            }
            function Qb(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                d = i;
                i = i + 32 | 0;
                e = d + 8 | 0;
                h = d + 16 | 0;
                g = d + 20 | 0;
                l = d + 24 | 0;
                f = d + 4 | 0;
                k = d;
                j = d + 12 | 0;
                c[h >> 2] = a;
                c[g >> 2] = b;
                c[g >> 2] = (c[g >> 2] | 0) + -1;
                c[k >> 2] = 32 - (We(c[g >> 2] | 0) | 0);
                if ((c[k >> 2] | 0) <= 8) {
                    c[g >> 2] = (c[g >> 2] | 0) + 1;
                    c[f >> 2] = Kb(c[h >> 2] | 0, c[g >> 2] | 0) | 0;
                    Nb(c[h >> 2] | 0, c[f >> 2] | 0, (c[f >> 2] | 0) + 1 | 0, c[g >> 2] | 0);
                    c[e >> 2] = c[f >> 2];
                    a = c[e >> 2] | 0;
                    i = d;
                    return a | 0
                }
                c[k >> 2] = (c[k >> 2] | 0) - 8;
                c[l >> 2] = ((c[g >> 2] | 0) >>> (c[k >> 2] | 0)) + 1;
                c[f >> 2] = Kb(c[h >> 2] | 0, c[l >> 2] | 0) | 0;
                Nb(c[h >> 2] | 0, c[f >> 2] | 0, (c[f >> 2] | 0) + 1 | 0, c[l >> 2] | 0);
                a = c[f >> 2] << c[k >> 2];
                c[j >> 2] = a | (Rb(c[h >> 2] | 0, c[k >> 2] | 0) | 0);
                if ((c[j >> 2] | 0) >>> 0 <= (c[g >> 2] | 0) >>> 0) {
                    c[e >> 2] = c[j >> 2];
                    a = c[e >> 2] | 0;
                    i = d;
                    return a | 0
                } else {
                    c[(c[h >> 2] | 0) + 44 >> 2] = 1;
                    c[e >> 2] = c[g >> 2];
                    a = c[e >> 2] | 0;
                    i = d;
                    return a | 0
                }
                return 0
            }
            function Rb(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0;
                j = i;
                i = i + 32 | 0;
                h = j + 16 | 0;
                e = j + 12 | 0;
                d = j + 8 | 0;
                g = j + 4 | 0;
                f = j;
                c[h >> 2] = a;
                c[e >> 2] = b;
                c[d >> 2] = c[(c[h >> 2] | 0) + 12 >> 2];
                c[g >> 2] = c[(c[h >> 2] | 0) + 16 >> 2];
                if ((c[g >> 2] | 0) >>> 0 < (c[e >> 2] | 0) >>> 0) {
                    do {
                        a = Sb(c[h >> 2] | 0) | 0;
                        c[d >> 2] = c[d >> 2] | a << c[g >> 2];
                        c[g >> 2] = (c[g >> 2] | 0) + 8
                    } while ((c[g >> 2] | 0) <= 24)
                }
                c[f >> 2] = c[d >> 2] & (1 << c[e >> 2]) - 1;
                c[d >> 2] = (c[d >> 2] | 0) >>> (c[e >> 2] | 0);
                c[g >> 2] = (c[g >> 2] | 0) - (c[e >> 2] | 0);
                c[(c[h >> 2] | 0) + 12 >> 2] = c[d >> 2];
                c[(c[h >> 2] | 0) + 16 >> 2] = c[g >> 2];
                a = (c[h >> 2] | 0) + 20 | 0;
                c[a >> 2] = (c[a >> 2] | 0) + (c[e >> 2] | 0);
                i = j;
                return c[f >> 2] | 0
            }
            function Sb(a) {
                a = a | 0;
                var b = 0, e = 0, f = 0, g = 0;
                b = i;
                i = i + 16 | 0;
                e = b;
                c[e >> 2] = a;
                if (!((c[(c[e >> 2] | 0) + 8 >> 2] | 0) >>> 0 < (c[(c[e >> 2] | 0) + 4 >> 2] | 0) >>> 0)) {
                    e = 0;
                    i = b;
                    return e | 0
                }
                f = c[(c[e >> 2] | 0) + 4 >> 2] | 0;
                g = (c[e >> 2] | 0) + 8 | 0;
                a = (c[g >> 2] | 0) + 1 | 0;
                c[g >> 2] = a;
                e = d[(c[c[e >> 2] >> 2] | 0) + (f - a) >> 0] | 0;
                i = b;
                return e | 0
            }
            function Tb(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                f = i;
                i = i + 32 | 0;
                g = f + 16 | 0;
                h = f + 12 | 0;
                j = f + 8 | 0;
                l = f + 4 | 0;
                k = f;
                c[g >> 2] = a;
                c[h >> 2] = b;
                c[j >> 2] = d;
                c[l >> 2] = e;
                c[k >> 2] = Ub(c[(c[g >> 2] | 0) + 28 >> 2] | 0, c[l >> 2] | 0) | 0;
                if ((c[h >> 2] | 0) >>> 0 > 0) {
                    b = (c[(c[g >> 2] | 0) + 28 >> 2] | 0) - ($(c[k >> 2] | 0, (c[l >> 2] | 0) - (c[h >> 2] | 0) | 0) | 0) | 0;
                    a = (c[g >> 2] | 0) + 32 | 0;
                    c[a >> 2] = (c[a >> 2] | 0) + b;
                    a = $(c[k >> 2] | 0, (c[j >> 2] | 0) - (c[h >> 2] | 0) | 0) | 0;
                    c[(c[g >> 2] | 0) + 28 >> 2] = a;
                    a = c[g >> 2] | 0;
                    Vb(a);
                    i = f;
                } else {
                    b = $(c[k >> 2] | 0, (c[l >> 2] | 0) - (c[j >> 2] | 0) | 0) | 0;
                    a = (c[g >> 2] | 0) + 28 | 0;
                    c[a >> 2] = (c[a >> 2] | 0) - b;
                    a = c[g >> 2] | 0;
                    Vb(a);
                    i = f;
                }
            }
            function Ub(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0;
                f = i;
                i = i + 16 | 0;
                e = f + 4 | 0;
                d = f;
                c[e >> 2] = a;
                c[d >> 2] = b;
                i = f;
                return ((c[e >> 2] | 0) >>> 0) / ((c[d >> 2] | 0) >>> 0) | 0 | 0
            }
            function Vb(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                while (1) {
                    if (!((c[(c[d >> 2] | 0) + 28 >> 2] | 0) >>> 0 <= 8388608)) {
                        break
                    }
                    _b(c[d >> 2] | 0, (c[(c[d >> 2] | 0) + 32 >> 2] | 0) >>> 23);
                    c[(c[d >> 2] | 0) + 32 >> 2] = c[(c[d >> 2] | 0) + 32 >> 2] << 8 & 2147483647;
                    a = (c[d >> 2] | 0) + 28 | 0;
                    c[a >> 2] = c[a >> 2] << 8;
                    a = (c[d >> 2] | 0) + 20 | 0;
                    c[a >> 2] = (c[a >> 2] | 0) + 8
                }
                i = b;
            }
            function Wb(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                e = i;
                i = i + 32 | 0;
                f = e + 20 | 0;
                j = e + 16 | 0;
                l = e + 12 | 0;
                g = e + 8 | 0;
                h = e + 4 | 0;
                k = e;
                c[f >> 2] = a;
                c[j >> 2] = b;
                c[l >> 2] = d;
                c[g >> 2] = c[(c[f >> 2] | 0) + 28 >> 2];
                c[k >> 2] = c[(c[f >> 2] | 0) + 32 >> 2];
                c[h >> 2] = (c[g >> 2] | 0) >>> (c[l >> 2] | 0);
                c[g >> 2] = (c[g >> 2] | 0) - (c[h >> 2] | 0);
                if ((c[j >> 2] | 0) != 0) {
                    c[(c[f >> 2] | 0) + 32 >> 2] = (c[k >> 2] | 0) + (c[g >> 2] | 0)
                }
                c[(c[f >> 2] | 0) + 28 >> 2] = (c[j >> 2] | 0) != 0 ? c[h >> 2] | 0 : c[g >> 2] | 0;
                Vb(c[f >> 2] | 0);
                i = e;
            }
            function Xb(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                e = i;
                i = i + 32 | 0;
                h = e + 20 | 0;
                g = e + 16 | 0;
                l = e + 12 | 0;
                j = e + 8 | 0;
                k = e + 4 | 0;
                f = e;
                c[h >> 2] = a;
                c[g >> 2] = b;
                c[l >> 2] = d;
                c[l >> 2] = (c[l >> 2] | 0) + -1;
                c[f >> 2] = 32 - (We(c[l >> 2] | 0) | 0);
                if ((c[f >> 2] | 0) > 8) {
                    c[f >> 2] = (c[f >> 2] | 0) - 8;
                    c[j >> 2] = ((c[l >> 2] | 0) >>> (c[f >> 2] | 0)) + 1;
                    c[k >> 2] = (c[g >> 2] | 0) >>> (c[f >> 2] | 0);
                    Tb(c[h >> 2] | 0, c[k >> 2] | 0, (c[k >> 2] | 0) + 1 | 0, c[j >> 2] | 0);
                    Yb(c[h >> 2] | 0, c[g >> 2] & (1 << c[f >> 2]) - 1, c[f >> 2] | 0);
                    i = e;
                } else {
                    Tb(c[h >> 2] | 0, c[g >> 2] | 0, (c[g >> 2] | 0) + 1 | 0, (c[l >> 2] | 0) + 1 | 0);
                    i = e;
                }
            }
            function Yb(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0;
                k = i;
                i = i + 32 | 0;
                j = k + 16 | 0;
                f = k + 12 | 0;
                h = k + 8 | 0;
                e = k + 4 | 0;
                g = k;
                c[j >> 2] = a;
                c[f >> 2] = b;
                c[h >> 2] = d;
                c[e >> 2] = c[(c[j >> 2] | 0) + 12 >> 2];
                c[g >> 2] = c[(c[j >> 2] | 0) + 16 >> 2];
                if (((c[g >> 2] | 0) + (c[h >> 2] | 0) | 0) >>> 0 > 32) {
                    do {
                        b = Zb(c[j >> 2] | 0, c[e >> 2] & 255) | 0;
                        a = (c[j >> 2] | 0) + 44 | 0;
                        c[a >> 2] = c[a >> 2] | b;
                        c[e >> 2] = (c[e >> 2] | 0) >>> 8;
                        c[g >> 2] = (c[g >> 2] | 0) - 8
                    } while ((c[g >> 2] | 0) >= 8)
                }
                c[e >> 2] = c[e >> 2] | c[f >> 2] << c[g >> 2];
                c[g >> 2] = (c[g >> 2] | 0) + (c[h >> 2] | 0);
                c[(c[j >> 2] | 0) + 12 >> 2] = c[e >> 2];
                c[(c[j >> 2] | 0) + 16 >> 2] = c[g >> 2];
                a = (c[j >> 2] | 0) + 20 | 0;
                c[a >> 2] = (c[a >> 2] | 0) + (c[h >> 2] | 0);
                i = k;
            }
            function Zb(b, d) {
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0;
                e = i;
                i = i + 16 | 0;
                f = e + 8 | 0;
                g = e + 4 | 0;
                h = e;
                c[g >> 2] = b;
                c[h >> 2] = d;
                if (((c[(c[g >> 2] | 0) + 24 >> 2] | 0) + (c[(c[g >> 2] | 0) + 8 >> 2] | 0) | 0) >>> 0 >= (c[(c[g >> 2] | 0) + 4 >> 2] | 0) >>> 0) {
                    c[f >> 2] = -1;
                    b = c[f >> 2] | 0;
                    i = e;
                    return b | 0
                } else {
                    d = c[h >> 2] & 255;
                    h = c[(c[g >> 2] | 0) + 4 >> 2] | 0;
                    j = (c[g >> 2] | 0) + 8 | 0;
                    b = (c[j >> 2] | 0) + 1 | 0;
                    c[j >> 2] = b;
                    a[(c[c[g >> 2] >> 2] | 0) + (h - b) >> 0] = d;
                    c[f >> 2] = 0;
                    b = c[f >> 2] | 0;
                    i = e;
                    return b | 0
                }
                return 0
            }
            function _b(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0;
                d = i;
                i = i + 16 | 0;
                e = d + 12 | 0;
                h = d + 8 | 0;
                f = d + 4 | 0;
                g = d;
                c[e >> 2] = a;
                c[h >> 2] = b;
                if ((c[h >> 2] | 0) == 255) {
                    a = (c[e >> 2] | 0) + 36 | 0;
                    c[a >> 2] = (c[a >> 2] | 0) + 1;
                    i = d;
                    return
                }
                c[f >> 2] = c[h >> 2] >> 8;
                if ((c[(c[e >> 2] | 0) + 40 >> 2] | 0) >= 0) {
                    b = $b(c[e >> 2] | 0, (c[(c[e >> 2] | 0) + 40 >> 2] | 0) + (c[f >> 2] | 0) | 0) | 0;
                    a = (c[e >> 2] | 0) + 44 | 0;
                    c[a >> 2] = c[a >> 2] | b
                }
                if ((c[(c[e >> 2] | 0) + 36 >> 2] | 0) >>> 0 > 0) {
                    c[g >> 2] = 255 + (c[f >> 2] | 0) & 255;
                    do {
                        a = $b(c[e >> 2] | 0, c[g >> 2] | 0) | 0;
                        f = (c[e >> 2] | 0) + 44 | 0;
                        c[f >> 2] = c[f >> 2] | a;
                        f = (c[e >> 2] | 0) + 36 | 0;
                        a = (c[f >> 2] | 0) + -1 | 0;
                        c[f >> 2] = a
                    } while (a >>> 0 > 0)
                }
                c[(c[e >> 2] | 0) + 40 >> 2] = c[h >> 2] & 255;
                i = d;
            }
            function $b(b, d) {
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0;
                e = i;
                i = i + 16 | 0;
                f = e + 8 | 0;
                g = e + 4 | 0;
                h = e;
                c[g >> 2] = b;
                c[h >> 2] = d;
                if (((c[(c[g >> 2] | 0) + 24 >> 2] | 0) + (c[(c[g >> 2] | 0) + 8 >> 2] | 0) | 0) >>> 0 >= (c[(c[g >> 2] | 0) + 4 >> 2] | 0) >>> 0) {
                    c[f >> 2] = -1;
                    b = c[f >> 2] | 0;
                    i = e;
                    return b | 0
                } else {
                    h = c[h >> 2] & 255;
                    d = (c[g >> 2] | 0) + 24 | 0;
                    b = c[d >> 2] | 0;
                    c[d >> 2] = b + 1;
                    a[(c[c[g >> 2] >> 2] | 0) + b >> 0] = h;
                    c[f >> 2] = 0;
                    b = c[f >> 2] | 0;
                    i = e;
                    return b | 0
                }
                return 0
            }
            function ac(a, d) {
                a = a | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0;
                l = i;
                i = i + 80 | 0;
                k = l + 60 | 0;
                f = l + 48 | 0;
                e = l + 4 | 0;
                g = l + 8 | 0;
                o = l + 64 | 0;
                n = l;
                h = l + 16 | 0;
                j = l + 56 | 0;
                m = l + 52 | 0;
                c[k >> 2] = a;
                c[f >> 2] = d;
                if ((c[(c[k >> 2] | 0) + 12 >> 2] | 0) > 0) {
                    d = c[(c[k >> 2] | 0) + 12 >> 2] | 0
                } else {
                    d = 0
                }
                c[m >> 2] = d;
                c[h >> 2] = 1;
                c[n >> 2] = 0;
                do {
                    c[o >> 2] = b[(c[k >> 2] | 0) + 16 + (c[n >> 2] << 1 << 1) >> 1] | 0;
                    c[g >> 2] = b[(c[k >> 2] | 0) + 16 + ((c[n >> 2] << 1) + 1 << 1) >> 1] | 0;
                    a = $(c[h + (c[n >> 2] << 2) >> 2] | 0, c[o >> 2] | 0) | 0;
                    c[h + ((c[n >> 2] | 0) + 1 << 2) >> 2] = a;
                    c[n >> 2] = (c[n >> 2] | 0) + 1
                } while ((c[g >> 2] | 0) != 1);
                c[g >> 2] = b[(c[k >> 2] | 0) + 16 + ((c[n >> 2] << 1) - 1 << 1) >> 1] | 0;
                c[j >> 2] = (c[n >> 2] | 0) - 1;
                while (1) {
                    if ((c[j >> 2] | 0) < 0) {
                        break
                    }
                    if ((c[j >> 2] | 0) != 0) {
                        c[e >> 2] = b[(c[k >> 2] | 0) + 16 + ((c[j >> 2] << 1) - 1 << 1) >> 1] | 0
                    } else {
                        c[e >> 2] = 1
                    }
                    n = b[(c[k >> 2] | 0) + 16 + (c[j >> 2] << 1 << 1) >> 1] | 0;
                    if ((n | 0) == 2) {
                        bc(c[f >> 2] | 0, c[g >> 2] | 0, c[h + (c[j >> 2] << 2) >> 2] | 0)
                    } else if ((n | 0) == 3) {
                        dc(c[f >> 2] | 0, c[h + (c[j >> 2] << 2) >> 2] << c[m >> 2], c[k >> 2] | 0, c[g >> 2] | 0, c[h + (c[j >> 2] << 2) >> 2] | 0, c[e >> 2] | 0)
                    } else if ((n | 0) == 5) {
                        ec(c[f >> 2] | 0, c[h + (c[j >> 2] << 2) >> 2] << c[m >> 2], c[k >> 2] | 0, c[g >> 2] | 0, c[h + (c[j >> 2] << 2) >> 2] | 0, c[e >> 2] | 0)
                    } else if ((n | 0) == 4) {
                        cc(c[f >> 2] | 0, c[h + (c[j >> 2] << 2) >> 2] << c[m >> 2], c[k >> 2] | 0, c[g >> 2] | 0, c[h + (c[j >> 2] << 2) >> 2] | 0, c[e >> 2] | 0)
                    }
                    c[g >> 2] = c[e >> 2];
                    c[j >> 2] = (c[j >> 2] | 0) + -1
                }
                i = l;
            }
            function bc(a, d, e) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0;
                f = i;
                i = i + 32 | 0;
                j = f + 4 | 0;
                h = f + 8 | 0;
                k = f + 24 | 0;
                g = f;
                m = f + 28 | 0;
                l = f + 16 | 0;
                c[j >> 2] = a;
                c[f + 12 >> 2] = d;
                c[h >> 2] = e;
                b[m >> 1] = 23170;
                c[g >> 2] = 0;
                while (1) {
                    if ((c[g >> 2] | 0) >= (c[h >> 2] | 0)) {
                        break
                    }
                    c[k >> 2] = (c[j >> 2] | 0) + 32;
                    a = c[k >> 2] | 0;
                    c[l + 0 >> 2] = c[a + 0 >> 2];
                    c[l + 4 >> 2] = c[a + 4 >> 2];
                    c[c[k >> 2] >> 2] = (c[c[j >> 2] >> 2] | 0) - (c[l >> 2] | 0);
                    c[(c[k >> 2] | 0) + 4 >> 2] = (c[(c[j >> 2] | 0) + 4 >> 2] | 0) - (c[l + 4 >> 2] | 0);
                    c[c[j >> 2] >> 2] = (c[c[j >> 2] >> 2] | 0) + (c[l >> 2] | 0);
                    c[(c[j >> 2] | 0) + 4 >> 2] = (c[(c[j >> 2] | 0) + 4 >> 2] | 0) + (c[l + 4 >> 2] | 0);
                    a = ($(b[m >> 1] | 0, ((c[(c[k >> 2] | 0) + 8 >> 2] | 0) + (c[(c[k >> 2] | 0) + 12 >> 2] | 0) >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    c[l >> 2] = a + (($(b[m >> 1] | 0, (c[(c[k >> 2] | 0) + 8 >> 2] | 0) + (c[(c[k >> 2] | 0) + 12 >> 2] | 0) & 65535 & 65535) | 0) >> 15);
                    a = ($(b[m >> 1] | 0, ((c[(c[k >> 2] | 0) + 12 >> 2] | 0) - (c[(c[k >> 2] | 0) + 8 >> 2] | 0) >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    c[l + 4 >> 2] = a + (($(b[m >> 1] | 0, (c[(c[k >> 2] | 0) + 12 >> 2] | 0) - (c[(c[k >> 2] | 0) + 8 >> 2] | 0) & 65535 & 65535) | 0) >> 15);
                    c[(c[k >> 2] | 0) + 8 >> 2] = (c[(c[j >> 2] | 0) + 8 >> 2] | 0) - (c[l >> 2] | 0);
                    c[(c[k >> 2] | 0) + 12 >> 2] = (c[(c[j >> 2] | 0) + 12 >> 2] | 0) - (c[l + 4 >> 2] | 0);
                    c[(c[j >> 2] | 0) + 8 >> 2] = (c[(c[j >> 2] | 0) + 8 >> 2] | 0) + (c[l >> 2] | 0);
                    c[(c[j >> 2] | 0) + 12 >> 2] = (c[(c[j >> 2] | 0) + 12 >> 2] | 0) + (c[l + 4 >> 2] | 0);
                    c[l >> 2] = c[(c[k >> 2] | 0) + 20 >> 2];
                    c[l + 4 >> 2] = 0 - (c[(c[k >> 2] | 0) + 16 >> 2] | 0);
                    c[(c[k >> 2] | 0) + 16 >> 2] = (c[(c[j >> 2] | 0) + 16 >> 2] | 0) - (c[l >> 2] | 0);
                    c[(c[k >> 2] | 0) + 20 >> 2] = (c[(c[j >> 2] | 0) + 20 >> 2] | 0) - (c[l + 4 >> 2] | 0);
                    c[(c[j >> 2] | 0) + 16 >> 2] = (c[(c[j >> 2] | 0) + 16 >> 2] | 0) + (c[l >> 2] | 0);
                    c[(c[j >> 2] | 0) + 20 >> 2] = (c[(c[j >> 2] | 0) + 20 >> 2] | 0) + (c[l + 4 >> 2] | 0);
                    a = ($(b[m >> 1] | 0, ((c[(c[k >> 2] | 0) + 28 >> 2] | 0) - (c[(c[k >> 2] | 0) + 24 >> 2] | 0) >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    c[l >> 2] = a + (($(b[m >> 1] | 0, (c[(c[k >> 2] | 0) + 28 >> 2] | 0) - (c[(c[k >> 2] | 0) + 24 >> 2] | 0) & 65535 & 65535) | 0) >> 15);
                    a = ($(b[m >> 1] | 0, (0 - (c[(c[k >> 2] | 0) + 28 >> 2] | 0) - (c[(c[k >> 2] | 0) + 24 >> 2] | 0) >> 16 & 65535) << 16 >> 16) | 0) << 1;
                    c[l + 4 >> 2] = a + (($(b[m >> 1] | 0, 0 - (c[(c[k >> 2] | 0) + 28 >> 2] | 0) - (c[(c[k >> 2] | 0) + 24 >> 2] | 0) & 65535 & 65535) | 0) >> 15);
                    c[(c[k >> 2] | 0) + 24 >> 2] = (c[(c[j >> 2] | 0) + 24 >> 2] | 0) - (c[l >> 2] | 0);
                    c[(c[k >> 2] | 0) + 28 >> 2] = (c[(c[j >> 2] | 0) + 28 >> 2] | 0) - (c[l + 4 >> 2] | 0);
                    c[(c[j >> 2] | 0) + 24 >> 2] = (c[(c[j >> 2] | 0) + 24 >> 2] | 0) + (c[l >> 2] | 0);
                    c[(c[j >> 2] | 0) + 28 >> 2] = (c[(c[j >> 2] | 0) + 28 >> 2] | 0) + (c[l + 4 >> 2] | 0);
                    c[j >> 2] = (c[j >> 2] | 0) + 64;
                    c[g >> 2] = (c[g >> 2] | 0) + 1
                }
                i = f;
            }
            function cc(a, d, e, f, g, h) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0,
                    x = 0, y = 0, z = 0, A = 0;
                u = i;
                i = i + 128 | 0;
                m = u + 112 | 0;
                A = u + 92 | 0;
                t = u + 72 | 0;
                q = u + 76 | 0;
                l = u + 60 | 0;
                s = u + 88 | 0;
                k = u + 96 | 0;
                n = u + 104 | 0;
                o = u + 120 | 0;
                p = u + 56 | 0;
                x = u + 8 | 0;
                j = u + 80 | 0;
                v = u;
                w = u + 64 | 0;
                y = u + 84 | 0;
                z = u + 68 | 0;
                r = u + 100 | 0;
                c[m >> 2] = a;
                c[A >> 2] = d;
                c[t >> 2] = e;
                c[q >> 2] = f;
                c[l >> 2] = g;
                c[s >> 2] = h;
                if ((c[q >> 2] | 0) == 1) {
                    c[k >> 2] = 0;
                    while (1) {
                        if ((c[k >> 2] | 0) >= (c[l >> 2] | 0)) {
                            break
                        }
                        c[n >> 2] = (c[c[m >> 2] >> 2] | 0) - (c[(c[m >> 2] | 0) + 16 >> 2] | 0);
                        c[n + 4 >> 2] = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) - (c[(c[m >> 2] | 0) + 20 >> 2] | 0);
                        c[c[m >> 2] >> 2] = (c[c[m >> 2] >> 2] | 0) + (c[(c[m >> 2] | 0) + 16 >> 2] | 0);
                        c[(c[m >> 2] | 0) + 4 >> 2] = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) + (c[(c[m >> 2] | 0) + 20 >> 2] | 0);
                        c[o >> 2] = (c[(c[m >> 2] | 0) + 8 >> 2] | 0) + (c[(c[m >> 2] | 0) + 24 >> 2] | 0);
                        c[o + 4 >> 2] = (c[(c[m >> 2] | 0) + 12 >> 2] | 0) + (c[(c[m >> 2] | 0) + 28 >> 2] | 0);
                        c[(c[m >> 2] | 0) + 16 >> 2] = (c[c[m >> 2] >> 2] | 0) - (c[o >> 2] | 0);
                        c[(c[m >> 2] | 0) + 20 >> 2] = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) - (c[o + 4 >> 2] | 0);
                        c[c[m >> 2] >> 2] = (c[c[m >> 2] >> 2] | 0) + (c[o >> 2] | 0);
                        c[(c[m >> 2] | 0) + 4 >> 2] = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) + (c[o + 4 >> 2] | 0);
                        c[o >> 2] = (c[(c[m >> 2] | 0) + 8 >> 2] | 0) - (c[(c[m >> 2] | 0) + 24 >> 2] | 0);
                        c[o + 4 >> 2] = (c[(c[m >> 2] | 0) + 12 >> 2] | 0) - (c[(c[m >> 2] | 0) + 28 >> 2] | 0);
                        c[(c[m >> 2] | 0) + 8 >> 2] = (c[n >> 2] | 0) + (c[o + 4 >> 2] | 0);
                        c[(c[m >> 2] | 0) + 12 >> 2] = (c[n + 4 >> 2] | 0) - (c[o >> 2] | 0);
                        c[(c[m >> 2] | 0) + 24 >> 2] = (c[n >> 2] | 0) - (c[o + 4 >> 2] | 0);
                        c[(c[m >> 2] | 0) + 28 >> 2] = (c[n + 4 >> 2] | 0) + (c[o >> 2] | 0);
                        c[m >> 2] = (c[m >> 2] | 0) + 32;
                        c[k >> 2] = (c[k >> 2] | 0) + 1
                    }
                    i = u;
                    return
                }
                c[y >> 2] = c[q >> 2] << 1;
                c[z >> 2] = (c[q >> 2] | 0) * 3;
                c[r >> 2] = c[m >> 2];
                c[k >> 2] = 0;
                while (1) {
                    if ((c[k >> 2] | 0) >= (c[l >> 2] | 0)) {
                        break
                    }
                    c[m >> 2] = (c[r >> 2] | 0) + (($(c[k >> 2] | 0, c[s >> 2] | 0) | 0) << 3);
                    a = c[(c[t >> 2] | 0) + 52 >> 2] | 0;
                    c[j >> 2] = a;
                    c[v >> 2] = a;
                    c[w >> 2] = a;
                    c[p >> 2] = 0;
                    while (1) {
                        if ((c[p >> 2] | 0) >= (c[q >> 2] | 0)) {
                            break
                        }
                        a = ($(b[c[j >> 2] >> 1] | 0, (c[(c[m >> 2] | 0) + (c[q >> 2] << 3) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        a = a + (($(b[c[j >> 2] >> 1] | 0, c[(c[m >> 2] | 0) + (c[q >> 2] << 3) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                        d = ($(b[(c[j >> 2] | 0) + 2 >> 1] | 0, (c[(c[m >> 2] | 0) + (c[q >> 2] << 3) + 4 >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[x >> 2] = a - (d + (($(b[(c[j >> 2] | 0) + 2 >> 1] | 0, c[(c[m >> 2] | 0) + (c[q >> 2] << 3) + 4 >> 2] & 65535 & 65535) | 0) >> 15));
                        d = ($(b[(c[j >> 2] | 0) + 2 >> 1] | 0, (c[(c[m >> 2] | 0) + (c[q >> 2] << 3) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        d = d + (($(b[(c[j >> 2] | 0) + 2 >> 1] | 0, c[(c[m >> 2] | 0) + (c[q >> 2] << 3) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                        a = ($(b[c[j >> 2] >> 1] | 0, (c[(c[m >> 2] | 0) + (c[q >> 2] << 3) + 4 >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[x + 4 >> 2] = d + (a + (($(b[c[j >> 2] >> 1] | 0, c[(c[m >> 2] | 0) + (c[q >> 2] << 3) + 4 >> 2] & 65535 & 65535) | 0) >> 15));
                        a = ($(b[c[v >> 2] >> 1] | 0, (c[(c[m >> 2] | 0) + (c[y >> 2] << 3) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        a = a + (($(b[c[v >> 2] >> 1] | 0, c[(c[m >> 2] | 0) + (c[y >> 2] << 3) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                        d = ($(b[(c[v >> 2] | 0) + 2 >> 1] | 0, (c[(c[m >> 2] | 0) + (c[y >> 2] << 3) + 4 >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[x + 8 >> 2] = a - (d + (($(b[(c[v >> 2] | 0) + 2 >> 1] | 0, c[(c[m >> 2] | 0) + (c[y >> 2] << 3) + 4 >> 2] & 65535 & 65535) | 0) >> 15));
                        d = ($(b[(c[v >> 2] | 0) + 2 >> 1] | 0, (c[(c[m >> 2] | 0) + (c[y >> 2] << 3) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        d = d + (($(b[(c[v >> 2] | 0) + 2 >> 1] | 0, c[(c[m >> 2] | 0) + (c[y >> 2] << 3) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                        a = ($(b[c[v >> 2] >> 1] | 0, (c[(c[m >> 2] | 0) + (c[y >> 2] << 3) + 4 >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[x + 12 >> 2] = d + (a + (($(b[c[v >> 2] >> 1] | 0, c[(c[m >> 2] | 0) + (c[y >> 2] << 3) + 4 >> 2] & 65535 & 65535) | 0) >> 15));
                        a = ($(b[c[w >> 2] >> 1] | 0, (c[(c[m >> 2] | 0) + (c[z >> 2] << 3) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        a = a + (($(b[c[w >> 2] >> 1] | 0, c[(c[m >> 2] | 0) + (c[z >> 2] << 3) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                        d = ($(b[(c[w >> 2] | 0) + 2 >> 1] | 0, (c[(c[m >> 2] | 0) + (c[z >> 2] << 3) + 4 >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[x + 16 >> 2] = a - (d + (($(b[(c[w >> 2] | 0) + 2 >> 1] | 0, c[(c[m >> 2] | 0) + (c[z >> 2] << 3) + 4 >> 2] & 65535 & 65535) | 0) >> 15));
                        d = ($(b[(c[w >> 2] | 0) + 2 >> 1] | 0, (c[(c[m >> 2] | 0) + (c[z >> 2] << 3) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        d = d + (($(b[(c[w >> 2] | 0) + 2 >> 1] | 0, c[(c[m >> 2] | 0) + (c[z >> 2] << 3) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                        a = ($(b[c[w >> 2] >> 1] | 0, (c[(c[m >> 2] | 0) + (c[z >> 2] << 3) + 4 >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[x + 20 >> 2] = d + (a + (($(b[c[w >> 2] >> 1] | 0, c[(c[m >> 2] | 0) + (c[z >> 2] << 3) + 4 >> 2] & 65535 & 65535) | 0) >> 15));
                        c[x + 40 >> 2] = (c[c[m >> 2] >> 2] | 0) - (c[x + 8 >> 2] | 0);
                        c[x + 44 >> 2] = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) - (c[x + 12 >> 2] | 0);
                        c[c[m >> 2] >> 2] = (c[c[m >> 2] >> 2] | 0) + (c[x + 8 >> 2] | 0);
                        c[(c[m >> 2] | 0) + 4 >> 2] = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) + (c[x + 12 >> 2] | 0);
                        c[x + 24 >> 2] = (c[x >> 2] | 0) + (c[x + 16 >> 2] | 0);
                        c[x + 28 >> 2] = (c[x + 4 >> 2] | 0) + (c[x + 20 >> 2] | 0);
                        c[x + 32 >> 2] = (c[x >> 2] | 0) - (c[x + 16 >> 2] | 0);
                        c[x + 36 >> 2] = (c[x + 4 >> 2] | 0) - (c[x + 20 >> 2] | 0);
                        c[(c[m >> 2] | 0) + (c[y >> 2] << 3) >> 2] = (c[c[m >> 2] >> 2] | 0) - (c[x + 24 >> 2] | 0);
                        c[(c[m >> 2] | 0) + (c[y >> 2] << 3) + 4 >> 2] = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) - (c[x + 28 >> 2] | 0);
                        c[j >> 2] = (c[j >> 2] | 0) + (c[A >> 2] << 2);
                        c[v >> 2] = (c[v >> 2] | 0) + (c[A >> 2] << 1 << 2);
                        c[w >> 2] = (c[w >> 2] | 0) + ((c[A >> 2] | 0) * 3 << 2);
                        c[c[m >> 2] >> 2] = (c[c[m >> 2] >> 2] | 0) + (c[x + 24 >> 2] | 0);
                        c[(c[m >> 2] | 0) + 4 >> 2] = (c[(c[m >> 2] | 0) + 4 >> 2] | 0) + (c[x + 28 >> 2] | 0);
                        c[(c[m >> 2] | 0) + (c[q >> 2] << 3) >> 2] = (c[x + 40 >> 2] | 0) + (c[x + 36 >> 2] | 0);
                        c[(c[m >> 2] | 0) + (c[q >> 2] << 3) + 4 >> 2] = (c[x + 44 >> 2] | 0) - (c[x + 32 >> 2] | 0);
                        c[(c[m >> 2] | 0) + (c[z >> 2] << 3) >> 2] = (c[x + 40 >> 2] | 0) - (c[x + 36 >> 2] | 0);
                        c[(c[m >> 2] | 0) + (c[z >> 2] << 3) + 4 >> 2] = (c[x + 44 >> 2] | 0) + (c[x + 32 >> 2] | 0);
                        c[m >> 2] = (c[m >> 2] | 0) + 8;
                        c[p >> 2] = (c[p >> 2] | 0) + 1
                    }
                    c[k >> 2] = (c[k >> 2] | 0) + 1
                }
                i = u;
            }
            function dc(a, d, e, f, g, h) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0,
                    x = 0;
                s = i;
                i = i + 96 | 0;
                l = s + 8 | 0;
                q = s + 16 | 0;
                w = s + 76 | 0;
                m = s;
                x = s + 72 | 0;
                v = s + 80 | 0;
                u = s + 84 | 0;
                j = s + 88 | 0;
                p = s + 4 | 0;
                k = s + 24 | 0;
                o = s + 12 | 0;
                n = s + 32 | 0;
                r = s + 92 | 0;
                t = s + 20 | 0;
                c[l >> 2] = a;
                c[q >> 2] = d;
                c[w >> 2] = e;
                c[m >> 2] = f;
                c[x >> 2] = g;
                c[v >> 2] = h;
                c[p >> 2] = c[m >> 2] << 1;
                c[t >> 2] = c[l >> 2];
                b[r >> 1] = -16384;
                b[r + 2 >> 1] = -28378;
                c[u >> 2] = 0;
                while (1) {
                    if ((c[u >> 2] | 0) >= (c[x >> 2] | 0)) {
                        break
                    }
                    c[l >> 2] = (c[t >> 2] | 0) + (($(c[u >> 2] | 0, c[v >> 2] | 0) | 0) << 3);
                    a = c[(c[w >> 2] | 0) + 52 >> 2] | 0;
                    c[o >> 2] = a;
                    c[k >> 2] = a;
                    c[j >> 2] = c[m >> 2];
                    do {
                        a = ($(b[c[k >> 2] >> 1] | 0, (c[(c[l >> 2] | 0) + (c[m >> 2] << 3) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        a = a + (($(b[c[k >> 2] >> 1] | 0, c[(c[l >> 2] | 0) + (c[m >> 2] << 3) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                        d = ($(b[(c[k >> 2] | 0) + 2 >> 1] | 0, (c[(c[l >> 2] | 0) + (c[m >> 2] << 3) + 4 >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[n + 8 >> 2] = a - (d + (($(b[(c[k >> 2] | 0) + 2 >> 1] | 0, c[(c[l >> 2] | 0) + (c[m >> 2] << 3) + 4 >> 2] & 65535 & 65535) | 0) >> 15));
                        d = ($(b[(c[k >> 2] | 0) + 2 >> 1] | 0, (c[(c[l >> 2] | 0) + (c[m >> 2] << 3) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        d = d + (($(b[(c[k >> 2] | 0) + 2 >> 1] | 0, c[(c[l >> 2] | 0) + (c[m >> 2] << 3) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                        a = ($(b[c[k >> 2] >> 1] | 0, (c[(c[l >> 2] | 0) + (c[m >> 2] << 3) + 4 >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[n + 12 >> 2] = d + (a + (($(b[c[k >> 2] >> 1] | 0, c[(c[l >> 2] | 0) + (c[m >> 2] << 3) + 4 >> 2] & 65535 & 65535) | 0) >> 15));
                        a = ($(b[c[o >> 2] >> 1] | 0, (c[(c[l >> 2] | 0) + (c[p >> 2] << 3) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        a = a + (($(b[c[o >> 2] >> 1] | 0, c[(c[l >> 2] | 0) + (c[p >> 2] << 3) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                        d = ($(b[(c[o >> 2] | 0) + 2 >> 1] | 0, (c[(c[l >> 2] | 0) + (c[p >> 2] << 3) + 4 >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[n + 16 >> 2] = a - (d + (($(b[(c[o >> 2] | 0) + 2 >> 1] | 0, c[(c[l >> 2] | 0) + (c[p >> 2] << 3) + 4 >> 2] & 65535 & 65535) | 0) >> 15));
                        d = ($(b[(c[o >> 2] | 0) + 2 >> 1] | 0, (c[(c[l >> 2] | 0) + (c[p >> 2] << 3) >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        d = d + (($(b[(c[o >> 2] | 0) + 2 >> 1] | 0, c[(c[l >> 2] | 0) + (c[p >> 2] << 3) >> 2] & 65535 & 65535) | 0) >> 15) | 0;
                        a = ($(b[c[o >> 2] >> 1] | 0, (c[(c[l >> 2] | 0) + (c[p >> 2] << 3) + 4 >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[n + 20 >> 2] = d + (a + (($(b[c[o >> 2] >> 1] | 0, c[(c[l >> 2] | 0) + (c[p >> 2] << 3) + 4 >> 2] & 65535 & 65535) | 0) >> 15));
                        c[n + 24 >> 2] = (c[n + 8 >> 2] | 0) + (c[n + 16 >> 2] | 0);
                        c[n + 28 >> 2] = (c[n + 12 >> 2] | 0) + (c[n + 20 >> 2] | 0);
                        c[n >> 2] = (c[n + 8 >> 2] | 0) - (c[n + 16 >> 2] | 0);
                        c[n + 4 >> 2] = (c[n + 12 >> 2] | 0) - (c[n + 20 >> 2] | 0);
                        c[k >> 2] = (c[k >> 2] | 0) + (c[q >> 2] << 2);
                        c[o >> 2] = (c[o >> 2] | 0) + (c[q >> 2] << 1 << 2);
                        c[(c[l >> 2] | 0) + (c[m >> 2] << 3) >> 2] = (c[c[l >> 2] >> 2] | 0) - (c[n + 24 >> 2] >> 1);
                        c[(c[l >> 2] | 0) + (c[m >> 2] << 3) + 4 >> 2] = (c[(c[l >> 2] | 0) + 4 >> 2] | 0) - (c[n + 28 >> 2] >> 1);
                        a = ($(b[r + 2 >> 1] | 0, (c[n >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[n >> 2] = a + (($(b[r + 2 >> 1] | 0, c[n >> 2] & 65535 & 65535) | 0) >> 15);
                        a = ($(b[r + 2 >> 1] | 0, (c[n + 4 >> 2] >> 16 & 65535) << 16 >> 16) | 0) << 1;
                        c[n + 4 >> 2] = a + (($(b[r + 2 >> 1] | 0, c[n + 4 >> 2] & 65535 & 65535) | 0) >> 15);
                        c[c[l >> 2] >> 2] = (c[c[l >> 2] >> 2] | 0) + (c[n + 24 >> 2] | 0);
                        c[(c[l >> 2] | 0) + 4 >> 2] = (c[(c[l >> 2] | 0) + 4 >> 2] | 0) + (c[n + 28 >> 2] | 0);
                        c[(c[l >> 2] | 0) + (c[p >> 2] << 3) >> 2] = (c[(c[l >> 2] | 0) + (c[m >> 2] << 3) >> 2] | 0) + (c[n + 4 >> 2] | 0);
                        c[(c[l >> 2] | 0) + (c[p >> 2] << 3) + 4 >> 2] = (c[(c[l >> 2] | 0) + (c[m >> 2] << 3) + 4 >> 2] | 0) - (c[n >> 2] | 0);
                        a = (c[l >> 2] | 0) + (c[m >> 2] << 3) | 0;
                        c[a >> 2] = (c[a >> 2] | 0) - (c[n + 4 >> 2] | 0);
                        a = (c[l >> 2] | 0) + (c[m >> 2] << 3) + 4 | 0;
                        c[a >> 2] = (c[a >> 2] | 0) + (c[n >> 2] | 0);
                        c[l >> 2] = (c[l >> 2] | 0) + 8;
                        a = (c[j >> 2] | 0) + -1 | 0;
                        c[j >> 2] = a
                    } while ((a | 0) != 0);
                    c[u >> 2] = (c[u >> 2] | 0) + 1
                }
                i = s;
            }
            function Pd(d, e, f, g, h, j, k) {
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                var l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0,
                    z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0,
                    N = 0, O = 0, P = 0, Q = 0;
                u = i;
                i = i + 784 | 0;
                l = u + 64 | 0;
                Q = u + 48 | 0;
                x = u + 44 | 0;
                s = u + 108 | 0;
                P = u + 100 | 0;
                G = u + 16 | 0;
                q = u + 20 | 0;
                C = u + 24 | 0;
                D = u + 28 | 0;
                v = u + 32 | 0;
                t = u + 36 | 0;
                A = u + 96 | 0;
                w = u + 104 | 0;
                N = u + 112 | 0;
                r = u + 120 | 0;
                F = u + 128 | 0;
                B = u + 68 | 0;
                n = u + 72 | 0;
                o = u + 76 | 0;
                I = u + 80 | 0;
                y = u + 84 | 0;
                E = u + 12 | 0;
                O = u + 8 | 0;
                M = u + 136 | 0;
                L = u + 4 | 0;
                p = u;
                J = u + 40 | 0;
                H = u + 92 | 0;
                m = u + 52 | 0;
                z = u + 88 | 0;
                c[Q >> 2] = d;
                c[x >> 2] = e;
                c[s >> 2] = f;
                c[P >> 2] = g;
                c[G >> 2] = h;
                c[q >> 2] = j;
                c[C >> 2] = k;
                c[t >> 2] = 0;
                c[A >> 2] = 0;
                c[F + 0 >> 2] = 0;
                c[F + 4 >> 2] = 0;
                c[n >> 2] = c[Q >> 2];
                c[o >> 2] = c[n >> 2];
                a:do {
                    if ((c[P >> 2] | 0) != 0) {
                        c[v >> 2] = 0;
                        while (1) {
                            if ((c[v >> 2] | 0) >= (c[(c[x >> 2] | 0) + 4 >> 2] | 0)) {
                                break a
                            }
                            c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2388 >> 2] = 0;
                            c[v >> 2] = (c[v >> 2] | 0) + 1
                        }
                    }
                } while (0);
                if ((c[(c[x >> 2] | 0) + 4 >> 2] | 0) > (c[(c[n >> 2] | 0) + 8536 >> 2] | 0)) {
                    Q = be((c[o >> 2] | 0) + 4260 | 0) | 0;
                    c[A >> 2] = (c[A >> 2] | 0) + Q
                }
                if ((c[(c[x >> 2] | 0) + 4 >> 2] | 0) == 1 ? (c[(c[n >> 2] | 0) + 8536 >> 2] | 0) == 2 : 0) {
                    j = (c[(c[x >> 2] | 0) + 12 >> 2] | 0) == ((c[(c[o >> 2] | 0) + 2316 >> 2] | 0) * 1e3 | 0)
                } else {
                    j = 0
                }
                c[y >> 2] = j & 1;
                b:do {
                    if ((c[(c[o >> 2] | 0) + 2388 >> 2] | 0) == 0) {
                        c[v >> 2] = 0;
                        c:while (1) {
                            if ((c[v >> 2] | 0) >= (c[(c[x >> 2] | 0) + 4 >> 2] | 0)) {
                                break b
                            }
                            do {
                                if ((c[(c[x >> 2] | 0) + 16 >> 2] | 0) == 0) {
                                    c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2392 >> 2] = 1;
                                    c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2324 >> 2] = 2
                                } else {
                                    if ((c[(c[x >> 2] | 0) + 16 >> 2] | 0) == 10) {
                                        c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2392 >> 2] = 1;
                                        c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2324 >> 2] = 2;
                                        break
                                    }
                                    if ((c[(c[x >> 2] | 0) + 16 >> 2] | 0) == 20) {
                                        c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2392 >> 2] = 1;
                                        c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2324 >> 2] = 4;
                                        break
                                    }
                                    if ((c[(c[x >> 2] | 0) + 16 >> 2] | 0) == 40) {
                                        c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2392 >> 2] = 2;
                                        c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2324 >> 2] = 4;
                                        break
                                    }
                                    if ((c[(c[x >> 2] | 0) + 16 >> 2] | 0) != 60) {
                                        K = 23;
                                        break c
                                    }
                                    c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2392 >> 2] = 3;
                                    c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2324 >> 2] = 4
                                }
                            } while (0);
                            c[O >> 2] = (c[(c[x >> 2] | 0) + 12 >> 2] >> 10) + 1;
                            if ((c[O >> 2] | 0) != 8 & (c[O >> 2] | 0) != 12 & (c[O >> 2] | 0) != 16) {
                                K = 25;
                                break
                            }
                            Q = Zd((c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) | 0, c[O >> 2] | 0, c[(c[x >> 2] | 0) + 8 >> 2] | 0) | 0;
                            c[A >> 2] = (c[A >> 2] | 0) + Q;
                            c[v >> 2] = (c[v >> 2] | 0) + 1
                        }
                        if ((K | 0) == 23) {
                            c[l >> 2] = -203;
                            Q = c[l >> 2] | 0;
                            i = u;
                            return Q | 0
                        } else if ((K | 0) == 25) {
                            c[l >> 2] = -200;
                            Q = c[l >> 2] | 0;
                            i = u;
                            return Q | 0
                        }
                    }
                } while (0);
                do {
                    if ((c[c[x >> 2] >> 2] | 0) == 2 ? (c[(c[x >> 2] | 0) + 4 >> 2] | 0) == 2 : 0) {
                        if ((c[(c[n >> 2] | 0) + 8532 >> 2] | 0) != 1 ? (c[(c[n >> 2] | 0) + 8536 >> 2] | 0) != 1 : 0) {
                            break
                        }
                        Q = (c[n >> 2] | 0) + 8520 | 0;
                        b[Q + 0 >> 1] = 0;
                        b[Q + 2 >> 1] = 0;
                        Q = (c[n >> 2] | 0) + 8528 | 0;
                        b[Q + 0 >> 1] = 0;
                        b[Q + 2 >> 1] = 0;
                        Ze((c[o >> 2] | 0) + 6692 | 0, (c[o >> 2] | 0) + 2432 | 0, 300) | 0
                    }
                } while (0);
                c[(c[n >> 2] | 0) + 8532 >> 2] = c[c[x >> 2] >> 2];
                c[(c[n >> 2] | 0) + 8536 >> 2] = c[(c[x >> 2] | 0) + 4 >> 2];
                if ((c[(c[x >> 2] | 0) + 8 >> 2] | 0) <= 48e3 ? (c[(c[x >> 2] | 0) + 8 >> 2] | 0) >= 8e3 : 0) {
                    d:do {
                        if ((c[s >> 2] | 0) != 1 ? (c[(c[o >> 2] | 0) + 2388 >> 2] | 0) == 0 : 0) {
                            c[v >> 2] = 0;
                            while (1) {
                                if ((c[v >> 2] | 0) >= (c[(c[x >> 2] | 0) + 4 >> 2] | 0)) {
                                    break
                                }
                                c[D >> 2] = 0;
                                while (1) {
                                    Q = (c[D >> 2] | 0) < (c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2392 >> 2] | 0);
                                    O = Ob(c[G >> 2] | 0, 1) | 0;
                                    if (!Q) {
                                        break
                                    }
                                    c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2404 + (c[D >> 2] << 2) >> 2] = O;
                                    c[D >> 2] = (c[D >> 2] | 0) + 1
                                }
                                c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2416 >> 2] = O;
                                c[v >> 2] = (c[v >> 2] | 0) + 1
                            }
                            c[v >> 2] = 0;
                            while (1) {
                                if ((c[v >> 2] | 0) >= (c[(c[x >> 2] | 0) + 4 >> 2] | 0)) {
                                    break
                                }
                                Q = (c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2420 | 0;
                                c[Q + 0 >> 2] = 0;
                                c[Q + 4 >> 2] = 0;
                                c[Q + 8 >> 2] = 0;
                                e:do {
                                    if ((c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2416 >> 2] | 0) != 0) {
                                        if ((c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2392 >> 2] | 0) == 1) {
                                            c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2420 >> 2] = 1;
                                            break
                                        }
                                        c[N >> 2] = (Pb(c[G >> 2] | 0, c[18248 + ((c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2392 >> 2] | 0) - 2 << 2) >> 2] | 0, 8) | 0) + 1;
                                        c[D >> 2] = 0;
                                        while (1) {
                                            if ((c[D >> 2] | 0) >= (c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2392 >> 2] | 0)) {
                                                break e
                                            }
                                            c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2420 + (c[D >> 2] << 2) >> 2] = c[N >> 2] >> c[D >> 2] & 1;
                                            c[D >> 2] = (c[D >> 2] | 0) + 1
                                        }
                                    }
                                } while (0);
                                c[v >> 2] = (c[v >> 2] | 0) + 1
                            }
                            if ((c[s >> 2] | 0) == 0) {
                                c[D >> 2] = 0;
                                while (1) {
                                    if ((c[D >> 2] | 0) >= (c[(c[o >> 2] | 0) + 2392 >> 2] | 0)) {
                                        break d
                                    }
                                    c[v >> 2] = 0;
                                    while (1) {
                                        N = c[D >> 2] | 0;
                                        if ((c[v >> 2] | 0) >= (c[(c[x >> 2] | 0) + 4 >> 2] | 0)) {
                                            break
                                        }
                                        if ((c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2420 + (N << 2) >> 2] | 0) != 0) {
                                            do {
                                                if ((c[(c[x >> 2] | 0) + 4 >> 2] | 0) == 2) {
                                                    if ((c[v >> 2] | 0) != 0) {
                                                        break
                                                    }
                                                    qe(c[G >> 2] | 0, F);
                                                    if ((c[(c[o >> 2] | 0) + 6680 + (c[D >> 2] << 2) >> 2] | 0) != 0) {
                                                        break
                                                    }
                                                    re(c[G >> 2] | 0, t)
                                                }
                                            } while (0);
                                            do {
                                                if ((c[D >> 2] | 0) > 0) {
                                                    if ((c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2420 + ((c[D >> 2] | 0) - 1 << 2) >> 2] | 0) == 0) {
                                                        K = 65;
                                                        break
                                                    }
                                                    c[L >> 2] = 2
                                                } else {
                                                    K = 65
                                                }
                                            } while (0);
                                            if ((K | 0) == 65) {
                                                K = 0;
                                                c[L >> 2] = 0
                                            }
                                            Vd((c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) | 0, c[G >> 2] | 0, c[D >> 2] | 0, 1, c[L >> 2] | 0);
                                            Yd(c[G >> 2] | 0, M, a[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2765 >> 0] | 0, a[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2766 >> 0] | 0, c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2328 >> 2] | 0)
                                        }
                                        c[v >> 2] = (c[v >> 2] | 0) + 1
                                    }
                                    c[D >> 2] = N + 1
                                }
                            }
                        }
                    } while (0);
                    f:do {
                        if ((c[(c[x >> 2] | 0) + 4 >> 2] | 0) == 2) {
                            do {
                                if ((c[s >> 2] | 0) != 0) {
                                    if ((c[s >> 2] | 0) == 2 ? (c[(c[o >> 2] | 0) + 2420 + (c[(c[o >> 2] | 0) + 2388 >> 2] << 2) >> 2] | 0) == 1 : 0) {
                                        break
                                    }
                                    c[v >> 2] = 0;
                                    while (1) {
                                        if ((c[v >> 2] | 0) >= 2) {
                                            break f
                                        }
                                        c[F + (c[v >> 2] << 2) >> 2] = b[(c[n >> 2] | 0) + 8520 + (c[v >> 2] << 1) >> 1] | 0;
                                        c[v >> 2] = (c[v >> 2] | 0) + 1
                                    }
                                }
                            } while (0);
                            qe(c[G >> 2] | 0, F);
                            if (!((c[s >> 2] | 0) == 0 ? (c[(c[o >> 2] | 0) + 6664 + (c[(c[o >> 2] | 0) + 2388 >> 2] << 2) >> 2] | 0) == 0 : 0)) {
                                K = 75
                            }
                            do {
                                if ((K | 0) == 75) {
                                    if ((c[s >> 2] | 0) == 2 ? (c[(c[o >> 2] | 0) + 6680 + (c[(c[o >> 2] | 0) + 2388 >> 2] << 2) >> 2] | 0) == 0 : 0) {
                                        break
                                    }
                                    c[t >> 2] = 0;
                                    break f
                                }
                            } while (0);
                            re(c[G >> 2] | 0, t)
                        }
                    } while (0);
                    if (((c[(c[x >> 2] | 0) + 4 >> 2] | 0) == 2 ? (c[t >> 2] | 0) == 0 : 0) ? (c[(c[n >> 2] | 0) + 8540 >> 2] | 0) == 1 : 0) {
                        Xe((c[n >> 2] | 0) + 5608 | 0, 0, 960) | 0;
                        L = (c[n >> 2] | 0) + 5544 | 0;
                        K = L + 64 | 0;
                        do {
                            c[L >> 2] = 0;
                            L = L + 4 | 0
                        } while ((L | 0) < (K | 0));
                        c[(c[n >> 2] | 0) + 6568 >> 2] = 100;
                        a[(c[n >> 2] | 0) + 6572 >> 0] = 10;
                        c[(c[n >> 2] | 0) + 8424 >> 2] = 0;
                        c[(c[n >> 2] | 0) + 6636 >> 2] = 1
                    }
                    Q = $(c[(c[x >> 2] | 0) + 12 >> 2] | 0, c[(c[x >> 2] | 0) + 4 >> 2] | 0) | 0;
                    c[E >> 2] = (Q | 0) < ($(c[(c[x >> 2] | 0) + 8 >> 2] | 0, c[c[x >> 2] >> 2] | 0) | 0) & 1;
                    if ((c[E >> 2] | 0) != 0) {
                        K = 1
                    } else {
                        K = $(c[(c[x >> 2] | 0) + 4 >> 2] | 0, (c[(c[o >> 2] | 0) + 2328 >> 2] | 0) + 2 | 0) | 0
                    }
                    c[p >> 2] = ia() | 0;
                    L = i;
                    i = i + ((2 * K | 0) + 15 & -16) | 0;
                    if ((c[E >> 2] | 0) != 0) {
                        c[r >> 2] = c[q >> 2];
                        c[r + 4 >> 2] = (c[q >> 2] | 0) + (c[(c[o >> 2] | 0) + 2328 >> 2] << 1) + 4
                    } else {
                        c[r >> 2] = L;
                        c[r + 4 >> 2] = L + (c[(c[o >> 2] | 0) + 2328 >> 2] << 1) + 4
                    }
                    if ((c[s >> 2] | 0) == 0) {
                        c[I >> 2] = ((c[t >> 2] | 0) != 0 ^ 1) & 1
                    } else {
                        if ((c[(c[n >> 2] | 0) + 8540 >> 2] | 0) != 0) {
                            if ((c[(c[x >> 2] | 0) + 4 >> 2] | 0) == 2 ? (c[s >> 2] | 0) == 2 : 0) {
                                K = (c[(c[o >> 2] | 0) + 6680 + (c[(c[o >> 2] | 0) + 6648 >> 2] << 2) >> 2] | 0) == 1
                            } else {
                                K = 0
                            }
                        } else {
                            K = 1
                        }
                        c[I >> 2] = K & 1
                    }
                    c[v >> 2] = 0;
                    while (1) {
                        if ((c[v >> 2] | 0) >= (c[(c[x >> 2] | 0) + 4 >> 2] | 0)) {
                            break
                        }
                        if ((c[v >> 2] | 0) != 0 ? (c[I >> 2] | 0) == 0 : 0) {
                            Xe((c[r + (c[v >> 2] << 2) >> 2] | 0) + 4 | 0, 0, c[w >> 2] << 1 | 0) | 0
                        } else {
                            c[J >> 2] = (c[(c[o >> 2] | 0) + 2388 >> 2] | 0) - (c[v >> 2] | 0);
                            g:do {
                                if ((c[J >> 2] | 0) <= 0) {
                                    c[H >> 2] = 0
                                } else {
                                    if ((c[s >> 2] | 0) == 2) {
                                        c[H >> 2] = (c[(c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2420 + ((c[J >> 2] | 0) - 1 << 2) >> 2] | 0) != 0 ? 2 : 0;
                                        break
                                    }
                                    do {
                                        if ((c[v >> 2] | 0) > 0) {
                                            if ((c[(c[n >> 2] | 0) + 8540 >> 2] | 0) == 0) {
                                                break
                                            }
                                            c[H >> 2] = 1;
                                            break g
                                        }
                                    } while (0);
                                    c[H >> 2] = 2
                                }
                            } while (0);
                            Q = Ud((c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) | 0, c[G >> 2] | 0, (c[r + (c[v >> 2] << 2) >> 2] | 0) + 4 | 0, w, c[s >> 2] | 0, c[H >> 2] | 0) | 0;
                            c[A >> 2] = (c[A >> 2] | 0) + Q
                        }
                        Q = (c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2388 | 0;
                        c[Q >> 2] = (c[Q >> 2] | 0) + 1;
                        c[v >> 2] = (c[v >> 2] | 0) + 1
                    }
                    if ((c[c[x >> 2] >> 2] | 0) == 2 ? (c[(c[x >> 2] | 0) + 4 >> 2] | 0) == 2 : 0) {
                        pe((c[n >> 2] | 0) + 8520 | 0, c[r >> 2] | 0, c[r + 4 >> 2] | 0, F, c[(c[o >> 2] | 0) + 2316 >> 2] | 0, c[w >> 2] | 0)
                    } else {
                        Q = c[r >> 2] | 0;
                        P = (c[n >> 2] | 0) + 8524 | 0;
                        b[Q + 0 >> 1] = b[P + 0 >> 1] | 0;
                        b[Q + 2 >> 1] = b[P + 2 >> 1] | 0;
                        Q = (c[n >> 2] | 0) + 8524 | 0;
                        P = (c[r >> 2] | 0) + (c[w >> 2] << 1) | 0;
                        b[Q + 0 >> 1] = b[P + 0 >> 1] | 0;
                        b[Q + 2 >> 1] = b[P + 2 >> 1] | 0
                    }
                    Q = $(c[w >> 2] | 0, c[(c[x >> 2] | 0) + 8 >> 2] | 0) | 0;
                    c[c[C >> 2] >> 2] = (Q | 0) / (((c[(c[o >> 2] | 0) + 2316 >> 2] & 65535) << 16 >> 16) * 1e3 | 0) | 0;
                    if ((c[c[x >> 2] >> 2] | 0) == 2) {
                        F = c[c[C >> 2] >> 2] | 0
                    } else {
                        F = 1
                    }
                    G = i;
                    i = i + ((2 * F | 0) + 15 & -16) | 0;
                    if ((c[c[x >> 2] >> 2] | 0) == 2) {
                        c[B >> 2] = G
                    } else {
                        c[B >> 2] = c[q >> 2]
                    }
                    if ((c[E >> 2] | 0) != 0) {
                        F = $(c[(c[x >> 2] | 0) + 4 >> 2] | 0, (c[(c[o >> 2] | 0) + 2328 >> 2] | 0) + 2 | 0) | 0
                    } else {
                        F = 1
                    }
                    G = i;
                    i = i + ((2 * F | 0) + 15 & -16) | 0;
                    if ((c[E >> 2] | 0) != 0) {
                        Q = ($(c[(c[x >> 2] | 0) + 4 >> 2] | 0, (c[(c[o >> 2] | 0) + 2328 >> 2] | 0) + 2 | 0) | 0) << 1;
                        Ze(G | 0, c[q >> 2] | 0, Q + 0 | 0) | 0;
                        c[r >> 2] = G;
                        c[r + 4 >> 2] = G + (c[(c[o >> 2] | 0) + 2328 >> 2] << 1) + 4
                    }
                    c[v >> 2] = 0;
                    while (1) {
                        E = c[x >> 2] | 0;
                        if ((c[c[x >> 2] >> 2] | 0) < (c[(c[x >> 2] | 0) + 4 >> 2] | 0)) {
                            E = c[E >> 2] | 0
                        } else {
                            E = c[E + 4 >> 2] | 0
                        }
                        if ((c[v >> 2] | 0) >= (E | 0)) {
                            break
                        }
                        Q = ee((c[o >> 2] | 0) + ((c[v >> 2] | 0) * 4260 | 0) + 2432 | 0, c[B >> 2] | 0, (c[r + (c[v >> 2] << 2) >> 2] | 0) + 2 | 0, c[w >> 2] | 0) | 0;
                        c[A >> 2] = (c[A >> 2] | 0) + Q;
                        h:do {
                            if ((c[c[x >> 2] >> 2] | 0) == 2) {
                                c[D >> 2] = 0;
                                while (1) {
                                    if ((c[D >> 2] | 0) >= (c[c[C >> 2] >> 2] | 0)) {
                                        break h
                                    }
                                    b[(c[q >> 2] | 0) + ((c[v >> 2] | 0) + (c[D >> 2] << 1) << 1) >> 1] = b[(c[B >> 2] | 0) + (c[D >> 2] << 1) >> 1] | 0;
                                    c[D >> 2] = (c[D >> 2] | 0) + 1
                                }
                            }
                        } while (0);
                        c[v >> 2] = (c[v >> 2] | 0) + 1
                    }
                    i:do {
                        if ((c[c[x >> 2] >> 2] | 0) == 2) {
                            if ((c[(c[x >> 2] | 0) + 4 >> 2] | 0) != 1) {
                                break
                            }
                            if ((c[y >> 2] | 0) != 0) {
                                Q = ee((c[o >> 2] | 0) + 6692 | 0, c[B >> 2] | 0, (c[r >> 2] | 0) + 2 | 0, c[w >> 2] | 0) | 0;
                                c[A >> 2] = (c[A >> 2] | 0) + Q;
                                c[D >> 2] = 0;
                                while (1) {
                                    if ((c[D >> 2] | 0) >= (c[c[C >> 2] >> 2] | 0)) {
                                        break i
                                    }
                                    b[(c[q >> 2] | 0) + (1 + (c[D >> 2] << 1) << 1) >> 1] = b[(c[B >> 2] | 0) + (c[D >> 2] << 1) >> 1] | 0;
                                    c[D >> 2] = (c[D >> 2] | 0) + 1
                                }
                            } else {
                                c[D >> 2] = 0;
                                while (1) {
                                    if ((c[D >> 2] | 0) >= (c[c[C >> 2] >> 2] | 0)) {
                                        break i
                                    }
                                    b[(c[q >> 2] | 0) + (1 + (c[D >> 2] << 1) << 1) >> 1] = b[(c[q >> 2] | 0) + (0 + (c[D >> 2] << 1) << 1) >> 1] | 0;
                                    c[D >> 2] = (c[D >> 2] | 0) + 1
                                }
                            }
                        }
                    } while (0);
                    if ((c[(c[o >> 2] | 0) + 4164 >> 2] | 0) == 2) {
                        c[m + 0 >> 2] = c[14952 >> 2];
                        c[m + 4 >> 2] = c[14956 >> 2];
                        c[m + 8 >> 2] = c[14960 >> 2];
                        Q = $(c[(c[o >> 2] | 0) + 2308 >> 2] | 0, c[m + ((c[(c[o >> 2] | 0) + 2316 >> 2] | 0) - 8 >> 2 << 2) >> 2] | 0) | 0;
                        c[(c[x >> 2] | 0) + 20 >> 2] = Q
                    } else {
                        c[(c[x >> 2] | 0) + 20 >> 2] = 0
                    }
                    j:do {
                        if ((c[s >> 2] | 0) == 1) {
                            c[D >> 2] = 0;
                            while (1) {
                                if ((c[D >> 2] | 0) >= (c[(c[n >> 2] | 0) + 8536 >> 2] | 0)) {
                                    break j
                                }
                                a[(c[n >> 2] | 0) + ((c[D >> 2] | 0) * 4260 | 0) + 2312 >> 0] = 10;
                                c[D >> 2] = (c[D >> 2] | 0) + 1
                            }
                        } else {
                            c[(c[n >> 2] | 0) + 8540 >> 2] = c[t >> 2]
                        }
                    } while (0);
                    c[l >> 2] = c[A >> 2];
                    c[z >> 2] = 1;
                    na(c[p >> 2] | 0);
                    Q = c[l >> 2] | 0;
                    i = u;
                    return Q | 0
                }
                c[A >> 2] = -200;
                c[l >> 2] = c[A >> 2];
                Q = c[l >> 2] | 0;
                i = u;
                return Q | 0
            }
            function Qd(d, e, f, g) {
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                var h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0,
                    w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0,
                    K = 0;
                F = i;
                i = i + 144 | 0;
                B = F + 48 | 0;
                p = F + 40 | 0;
                k = F;
                I = F + 84 | 0;
                x = F + 4 | 0;
                n = F + 16 | 0;
                h = F + 20 | 0;
                A = F + 24 | 0;
                m = F + 28 | 0;
                z = F + 72 | 0;
                t = F + 80 | 0;
                q = F + 88 | 0;
                s = F + 92 | 0;
                l = F + 96 | 0;
                r = F + 104 | 0;
                C = F + 56 | 0;
                D = F + 60 | 0;
                u = F + 8 | 0;
                v = F + 64 | 0;
                w = F + 12 | 0;
                H = F + 32 | 0;
                G = F + 68 | 0;
                j = F + 36 | 0;
                y = F + 76 | 0;
                o = F + 44 | 0;
                E = F + 52 | 0;
                c[B >> 2] = d;
                c[p >> 2] = e;
                c[k >> 2] = f;
                c[I >> 2] = g;
                c[h >> 2] = 0;
                g = c[(c[B >> 2] | 0) + 2336 >> 2] | 0;
                c[E >> 2] = ia() | 0;
                f = i;
                i = i + ((2 * g | 0) + 15 & -16) | 0;
                g = i;
                i = i + ((4 * ((c[(c[B >> 2] | 0) + 2336 >> 2] | 0) + (c[(c[B >> 2] | 0) + 2328 >> 2] | 0) | 0) | 0) + 15 & -16) | 0;
                d = i;
                i = i + ((4 * (c[(c[B >> 2] | 0) + 2332 >> 2] | 0) | 0) + 15 & -16) | 0;
                e = i;
                i = i + ((4 * ((c[(c[B >> 2] | 0) + 2332 >> 2] | 0) + 16 | 0) | 0) + 15 & -16) | 0;
                c[G >> 2] = b[18296 + (a[(c[B >> 2] | 0) + 2765 >> 0] >> 1 << 2) + (a[(c[B >> 2] | 0) + 2766 >> 0] << 1) >> 1] | 0;
                if ((a[(c[B >> 2] | 0) + 2767 >> 0] | 0) < 4) {
                    c[z >> 2] = 1
                } else {
                    c[z >> 2] = 0
                }
                c[H >> 2] = a[(c[B >> 2] | 0) + 2770 >> 0] | 0;
                c[x >> 2] = 0;
                while (1) {
                    if ((c[x >> 2] | 0) >= (c[(c[B >> 2] | 0) + 2328 >> 2] | 0)) {
                        break
                    }
                    c[H >> 2] = 907633515 + ($(c[H >> 2] | 0, 196314165) | 0);
                    c[(c[B >> 2] | 0) + 4 + (c[x >> 2] << 2) >> 2] = b[(c[I >> 2] | 0) + (c[x >> 2] << 1) >> 1] << 14;
                    K = (c[B >> 2] | 0) + 4 + (c[x >> 2] << 2) | 0;
                    J = c[K >> 2] | 0;
                    if ((c[(c[B >> 2] | 0) + 4 + (c[x >> 2] << 2) >> 2] | 0) <= 0) {
                        if ((J | 0) < 0) {
                            K = (c[B >> 2] | 0) + 4 + (c[x >> 2] << 2) | 0;
                            c[K >> 2] = (c[K >> 2] | 0) + 1280
                        }
                    } else {
                        c[K >> 2] = J - 1280
                    }
                    K = (c[B >> 2] | 0) + 4 + (c[x >> 2] << 2) | 0;
                    c[K >> 2] = (c[K >> 2] | 0) + (c[G >> 2] << 4);
                    if ((c[H >> 2] | 0) < 0) {
                        c[(c[B >> 2] | 0) + 4 + (c[x >> 2] << 2) >> 2] = 0 - (c[(c[B >> 2] | 0) + 4 + (c[x >> 2] << 2) >> 2] | 0)
                    }
                    c[H >> 2] = (c[H >> 2] | 0) + (b[(c[I >> 2] | 0) + (c[x >> 2] << 1) >> 1] | 0);
                    c[x >> 2] = (c[x >> 2] | 0) + 1
                }
                I = e + 0 | 0;
                H = (c[B >> 2] | 0) + 1284 | 0;
                G = I + 64 | 0;
                do {
                    c[I >> 2] = c[H >> 2];
                    I = I + 4 | 0;
                    H = H + 4 | 0
                } while ((I | 0) < (G | 0));
                c[y >> 2] = (c[B >> 2] | 0) + 4;
                c[l >> 2] = c[k >> 2];
                c[m >> 2] = c[(c[B >> 2] | 0) + 2336 >> 2];
                c[n >> 2] = 0;
                while (1) {
                    if ((c[n >> 2] | 0) >= (c[(c[B >> 2] | 0) + 2324 >> 2] | 0)) {
                        break
                    }
                    c[o >> 2] = d;
                    c[q >> 2] = (c[p >> 2] | 0) + 32 + (c[n >> 2] >> 1 << 5);
                    Ze(r | 0, c[q >> 2] | 0, c[(c[B >> 2] | 0) + 2340 >> 2] << 1 | 0) | 0;
                    c[s >> 2] = (c[p >> 2] | 0) + 96 + ((c[n >> 2] | 0) * 5 << 1);
                    c[t >> 2] = a[(c[B >> 2] | 0) + 2765 >> 0] | 0;
                    c[u >> 2] = c[(c[p >> 2] | 0) + 16 + (c[n >> 2] << 2) >> 2] >> 6;
                    c[v >> 2] = Rd(c[(c[p >> 2] | 0) + 16 + (c[n >> 2] << 2) >> 2] | 0, 47) | 0;
                    a:do {
                        if ((c[(c[p >> 2] | 0) + 16 + (c[n >> 2] << 2) >> 2] | 0) != (c[c[B >> 2] >> 2] | 0)) {
                            c[w >> 2] = Sd(c[c[B >> 2] >> 2] | 0, c[(c[p >> 2] | 0) + 16 + (c[n >> 2] << 2) >> 2] | 0, 16) | 0;
                            c[x >> 2] = 0;
                            while (1) {
                                if ((c[x >> 2] | 0) >= 16) {
                                    break a
                                }
                                K = $(c[w >> 2] >> 16, (c[e + (c[x >> 2] << 2) >> 2] & 65535) << 16 >> 16) | 0;
                                K = K + (($(c[w >> 2] & 65535, (c[e + (c[x >> 2] << 2) >> 2] & 65535) << 16 >> 16) | 0) >> 16) | 0;
                                K = K + ($(c[w >> 2] | 0, (c[e + (c[x >> 2] << 2) >> 2] >> 15) + 1 >> 1) | 0) | 0;
                                c[e + (c[x >> 2] << 2) >> 2] = K;
                                c[x >> 2] = (c[x >> 2] | 0) + 1
                            }
                        } else {
                            c[w >> 2] = 65536
                        }
                    } while (0);
                    c[c[B >> 2] >> 2] = c[(c[p >> 2] | 0) + 16 + (c[n >> 2] << 2) >> 2];
                    if ((((c[(c[B >> 2] | 0) + 4160 >> 2] | 0) != 0 ? (c[(c[B >> 2] | 0) + 4164 >> 2] | 0) == 2 : 0) ? (a[(c[B >> 2] | 0) + 2765 >> 0] | 0) != 2 : 0) ? (c[n >> 2] | 0) < 2 : 0) {
                        K = c[s >> 2] | 0;
                        b[K + 0 >> 1] = 0;
                        b[K + 2 >> 1] = 0;
                        b[K + 4 >> 1] = 0;
                        b[K + 6 >> 1] = 0;
                        b[K + 8 >> 1] = 0;
                        b[(c[s >> 2] | 0) + 4 >> 1] = 4096;
                        c[t >> 2] = 2;
                        c[(c[p >> 2] | 0) + (c[n >> 2] << 2) >> 2] = c[(c[B >> 2] | 0) + 2308 >> 2]
                    }
                    b:do {
                        if ((c[t >> 2] | 0) == 2) {
                            c[h >> 2] = c[(c[p >> 2] | 0) + (c[n >> 2] << 2) >> 2];
                            do {
                                if ((c[n >> 2] | 0) != 0) {
                                    if ((c[n >> 2] | 0) == 2 ? (c[z >> 2] | 0) != 0 : 0) {
                                        break
                                    }
                                    if ((c[w >> 2] | 0) == 65536) {
                                        break b
                                    }
                                    c[x >> 2] = 0;
                                    while (1) {
                                        if ((c[x >> 2] | 0) >= ((c[h >> 2] | 0) + 2 | 0)) {
                                            break b
                                        }
                                        K = $(c[w >> 2] >> 16, (c[g + ((c[m >> 2] | 0) - (c[x >> 2] | 0) - 1 << 2) >> 2] & 65535) << 16 >> 16) | 0;
                                        K = K + (($(c[w >> 2] & 65535, (c[g + ((c[m >> 2] | 0) - (c[x >> 2] | 0) - 1 << 2) >> 2] & 65535) << 16 >> 16) | 0) >> 16) | 0;
                                        K = K + ($(c[w >> 2] | 0, (c[g + ((c[m >> 2] | 0) - (c[x >> 2] | 0) - 1 << 2) >> 2] >> 15) + 1 >> 1) | 0) | 0;
                                        c[g + ((c[m >> 2] | 0) - (c[x >> 2] | 0) - 1 << 2) >> 2] = K;
                                        c[x >> 2] = (c[x >> 2] | 0) + 1
                                    }
                                }
                            } while (0);
                            c[A >> 2] = (c[(c[B >> 2] | 0) + 2336 >> 2] | 0) - (c[h >> 2] | 0) - (c[(c[B >> 2] | 0) + 2340 >> 2] | 0) - 2;
                            if ((c[n >> 2] | 0) == 2) {
                                Ze((c[B >> 2] | 0) + 1348 + (c[(c[B >> 2] | 0) + 2336 >> 2] << 1) | 0, c[k >> 2] | 0, c[(c[B >> 2] | 0) + 2332 >> 2] << 1 << 1 | 0) | 0
                            }
                            K = (c[A >> 2] | 0) + ($(c[n >> 2] | 0, c[(c[B >> 2] | 0) + 2332 >> 2] | 0) | 0) | 0;
                            ad(f + (c[A >> 2] << 1) | 0, (c[B >> 2] | 0) + 1348 + (K << 1) | 0, c[q >> 2] | 0, (c[(c[B >> 2] | 0) + 2336 >> 2] | 0) - (c[A >> 2] | 0) | 0, c[(c[B >> 2] | 0) + 2340 >> 2] | 0);
                            if ((c[n >> 2] | 0) == 0) {
                                K = $(c[v >> 2] >> 16, (c[(c[p >> 2] | 0) + 136 >> 2] & 65535) << 16 >> 16) | 0;
                                c[v >> 2] = K + (($(c[v >> 2] & 65535, (c[(c[p >> 2] | 0) + 136 >> 2] & 65535) << 16 >> 16) | 0) >> 16) << 2
                            }
                            c[x >> 2] = 0;
                            while (1) {
                                if ((c[x >> 2] | 0) >= ((c[h >> 2] | 0) + 2 | 0)) {
                                    break b
                                }
                                K = $(c[v >> 2] >> 16, b[f + ((c[(c[B >> 2] | 0) + 2336 >> 2] | 0) - (c[x >> 2] | 0) - 1 << 1) >> 1] | 0) | 0;
                                K = K + (($(c[v >> 2] & 65535, b[f + ((c[(c[B >> 2] | 0) + 2336 >> 2] | 0) - (c[x >> 2] | 0) - 1 << 1) >> 1] | 0) | 0) >> 16) | 0;
                                c[g + ((c[m >> 2] | 0) - (c[x >> 2] | 0) - 1 << 2) >> 2] = K;
                                c[x >> 2] = (c[x >> 2] | 0) + 1
                            }
                        }
                    } while (0);
                    c:do {
                        if ((c[t >> 2] | 0) == 2) {
                            c[j >> 2] = g + ((c[m >> 2] | 0) - (c[h >> 2] | 0) + 2 << 2);
                            c[x >> 2] = 0;
                            while (1) {
                                if ((c[x >> 2] | 0) >= (c[(c[B >> 2] | 0) + 2332 >> 2] | 0)) {
                                    break c
                                }
                                c[C >> 2] = 2;
                                K = $(c[c[j >> 2] >> 2] >> 16, b[c[s >> 2] >> 1] | 0) | 0;
                                c[C >> 2] = (c[C >> 2] | 0) + (K + (($(c[c[j >> 2] >> 2] & 65535, b[c[s >> 2] >> 1] | 0) | 0) >> 16));
                                K = $(c[(c[j >> 2] | 0) + -4 >> 2] >> 16, b[(c[s >> 2] | 0) + 2 >> 1] | 0) | 0;
                                c[C >> 2] = (c[C >> 2] | 0) + (K + (($(c[(c[j >> 2] | 0) + -4 >> 2] & 65535, b[(c[s >> 2] | 0) + 2 >> 1] | 0) | 0) >> 16));
                                K = $(c[(c[j >> 2] | 0) + -8 >> 2] >> 16, b[(c[s >> 2] | 0) + 4 >> 1] | 0) | 0;
                                c[C >> 2] = (c[C >> 2] | 0) + (K + (($(c[(c[j >> 2] | 0) + -8 >> 2] & 65535, b[(c[s >> 2] | 0) + 4 >> 1] | 0) | 0) >> 16));
                                K = $(c[(c[j >> 2] | 0) + -12 >> 2] >> 16, b[(c[s >> 2] | 0) + 6 >> 1] | 0) | 0;
                                c[C >> 2] = (c[C >> 2] | 0) + (K + (($(c[(c[j >> 2] | 0) + -12 >> 2] & 65535, b[(c[s >> 2] | 0) + 6 >> 1] | 0) | 0) >> 16));
                                K = $(c[(c[j >> 2] | 0) + -16 >> 2] >> 16, b[(c[s >> 2] | 0) + 8 >> 1] | 0) | 0;
                                c[C >> 2] = (c[C >> 2] | 0) + (K + (($(c[(c[j >> 2] | 0) + -16 >> 2] & 65535, b[(c[s >> 2] | 0) + 8 >> 1] | 0) | 0) >> 16));
                                c[j >> 2] = (c[j >> 2] | 0) + 4;
                                c[(c[o >> 2] | 0) + (c[x >> 2] << 2) >> 2] = (c[(c[y >> 2] | 0) + (c[x >> 2] << 2) >> 2] | 0) + (c[C >> 2] << 1);
                                c[g + (c[m >> 2] << 2) >> 2] = c[(c[o >> 2] | 0) + (c[x >> 2] << 2) >> 2] << 1;
                                c[m >> 2] = (c[m >> 2] | 0) + 1;
                                c[x >> 2] = (c[x >> 2] | 0) + 1
                            }
                        } else {
                            c[o >> 2] = c[y >> 2]
                        }
                    } while (0);
                    c[x >> 2] = 0;
                    while (1) {
                        if ((c[x >> 2] | 0) >= (c[(c[B >> 2] | 0) + 2332 >> 2] | 0)) {
                            break
                        }
                        c[D >> 2] = c[(c[B >> 2] | 0) + 2340 >> 2] >> 1;
                        K = $(c[e + (16 + (c[x >> 2] | 0) - 1 << 2) >> 2] >> 16, b[r >> 1] | 0) | 0;
                        c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 1 << 2) >> 2] & 65535, b[r >> 1] | 0) | 0) >> 16));
                        K = $(c[e + (16 + (c[x >> 2] | 0) - 2 << 2) >> 2] >> 16, b[r + 2 >> 1] | 0) | 0;
                        c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 2 << 2) >> 2] & 65535, b[r + 2 >> 1] | 0) | 0) >> 16));
                        K = $(c[e + (16 + (c[x >> 2] | 0) - 3 << 2) >> 2] >> 16, b[r + 4 >> 1] | 0) | 0;
                        c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 3 << 2) >> 2] & 65535, b[r + 4 >> 1] | 0) | 0) >> 16));
                        K = $(c[e + (16 + (c[x >> 2] | 0) - 4 << 2) >> 2] >> 16, b[r + 6 >> 1] | 0) | 0;
                        c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 4 << 2) >> 2] & 65535, b[r + 6 >> 1] | 0) | 0) >> 16));
                        K = $(c[e + (16 + (c[x >> 2] | 0) - 5 << 2) >> 2] >> 16, b[r + 8 >> 1] | 0) | 0;
                        c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 5 << 2) >> 2] & 65535, b[r + 8 >> 1] | 0) | 0) >> 16));
                        K = $(c[e + (16 + (c[x >> 2] | 0) - 6 << 2) >> 2] >> 16, b[r + 10 >> 1] | 0) | 0;
                        c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 6 << 2) >> 2] & 65535, b[r + 10 >> 1] | 0) | 0) >> 16));
                        K = $(c[e + (16 + (c[x >> 2] | 0) - 7 << 2) >> 2] >> 16, b[r + 12 >> 1] | 0) | 0;
                        c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 7 << 2) >> 2] & 65535, b[r + 12 >> 1] | 0) | 0) >> 16));
                        K = $(c[e + (16 + (c[x >> 2] | 0) - 8 << 2) >> 2] >> 16, b[r + 14 >> 1] | 0) | 0;
                        c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 8 << 2) >> 2] & 65535, b[r + 14 >> 1] | 0) | 0) >> 16));
                        K = $(c[e + (16 + (c[x >> 2] | 0) - 9 << 2) >> 2] >> 16, b[r + 16 >> 1] | 0) | 0;
                        c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 9 << 2) >> 2] & 65535, b[r + 16 >> 1] | 0) | 0) >> 16));
                        K = $(c[e + (16 + (c[x >> 2] | 0) - 10 << 2) >> 2] >> 16, b[r + 18 >> 1] | 0) | 0;
                        c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 10 << 2) >> 2] & 65535, b[r + 18 >> 1] | 0) | 0) >> 16));
                        if ((c[(c[B >> 2] | 0) + 2340 >> 2] | 0) == 16) {
                            K = $(c[e + (16 + (c[x >> 2] | 0) - 11 << 2) >> 2] >> 16, b[r + 20 >> 1] | 0) | 0;
                            c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 11 << 2) >> 2] & 65535, b[r + 20 >> 1] | 0) | 0) >> 16));
                            K = $(c[e + (16 + (c[x >> 2] | 0) - 12 << 2) >> 2] >> 16, b[r + 22 >> 1] | 0) | 0;
                            c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 12 << 2) >> 2] & 65535, b[r + 22 >> 1] | 0) | 0) >> 16));
                            K = $(c[e + (16 + (c[x >> 2] | 0) - 13 << 2) >> 2] >> 16, b[r + 24 >> 1] | 0) | 0;
                            c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 13 << 2) >> 2] & 65535, b[r + 24 >> 1] | 0) | 0) >> 16));
                            K = $(c[e + (16 + (c[x >> 2] | 0) - 14 << 2) >> 2] >> 16, b[r + 26 >> 1] | 0) | 0;
                            c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 14 << 2) >> 2] & 65535, b[r + 26 >> 1] | 0) | 0) >> 16));
                            K = $(c[e + (16 + (c[x >> 2] | 0) - 15 << 2) >> 2] >> 16, b[r + 28 >> 1] | 0) | 0;
                            c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 15 << 2) >> 2] & 65535, b[r + 28 >> 1] | 0) | 0) >> 16));
                            K = $(c[e + (16 + (c[x >> 2] | 0) - 16 << 2) >> 2] >> 16, b[r + 30 >> 1] | 0) | 0;
                            c[D >> 2] = (c[D >> 2] | 0) + (K + (($(c[e + (16 + (c[x >> 2] | 0) - 16 << 2) >> 2] & 65535, b[r + 30 >> 1] | 0) | 0) >> 16))
                        }
                        c[e + (16 + (c[x >> 2] | 0) << 2) >> 2] = (c[(c[o >> 2] | 0) + (c[x >> 2] << 2) >> 2] | 0) + (c[D >> 2] << 4);
                        K = $(c[e + (16 + (c[x >> 2] | 0) << 2) >> 2] >> 16, (c[u >> 2] & 65535) << 16 >> 16) | 0;
                        K = K + (($(c[e + (16 + (c[x >> 2] | 0) << 2) >> 2] & 65535, (c[u >> 2] & 65535) << 16 >> 16) | 0) >> 16) | 0;
                        if (((K + ($(c[e + (16 + (c[x >> 2] | 0) << 2) >> 2] | 0, (c[u >> 2] >> 15) + 1 >> 1) | 0) >> 7) + 1 >> 1 | 0) <= 32767) {
                            K = $(c[e + (16 + (c[x >> 2] | 0) << 2) >> 2] >> 16, (c[u >> 2] & 65535) << 16 >> 16) | 0;
                            K = K + (($(c[e + (16 + (c[x >> 2] | 0) << 2) >> 2] & 65535, (c[u >> 2] & 65535) << 16 >> 16) | 0) >> 16) | 0;
                            if (((K + ($(c[e + (16 + (c[x >> 2] | 0) << 2) >> 2] | 0, (c[u >> 2] >> 15) + 1 >> 1) | 0) >> 7) + 1 >> 1 | 0) < -32768) {
                                G = -32768
                            } else {
                                G = $(c[e + (16 + (c[x >> 2] | 0) << 2) >> 2] >> 16, (c[u >> 2] & 65535) << 16 >> 16) | 0;
                                G = G + (($(c[e + (16 + (c[x >> 2] | 0) << 2) >> 2] & 65535, (c[u >> 2] & 65535) << 16 >> 16) | 0) >> 16) | 0;
                                G = (G + ($(c[e + (16 + (c[x >> 2] | 0) << 2) >> 2] | 0, (c[u >> 2] >> 15) + 1 >> 1) | 0) >> 7) + 1 >> 1
                            }
                        } else {
                            G = 32767
                        }
                        b[(c[l >> 2] | 0) + (c[x >> 2] << 1) >> 1] = G;
                        c[x >> 2] = (c[x >> 2] | 0) + 1
                    }
                    I = e + 0 | 0;
                    H = e + (c[(c[B >> 2] | 0) + 2332 >> 2] << 2) + 0 | 0;
                    G = I + 64 | 0;
                    do {
                        c[I >> 2] = c[H >> 2];
                        I = I + 4 | 0;
                        H = H + 4 | 0
                    } while ((I | 0) < (G | 0));
                    c[y >> 2] = (c[y >> 2] | 0) + (c[(c[B >> 2] | 0) + 2332 >> 2] << 2);
                    c[l >> 2] = (c[l >> 2] | 0) + (c[(c[B >> 2] | 0) + 2332 >> 2] << 1);
                    c[n >> 2] = (c[n >> 2] | 0) + 1
                }
                I = (c[B >> 2] | 0) + 1284 | 0;
                H = e + 0 | 0;
                G = I + 64 | 0;
                do {
                    c[I >> 2] = c[H >> 2];
                    I = I + 4 | 0;
                    H = H + 4 | 0
                } while ((I | 0) < (G | 0));
                na(c[E >> 2] | 0);
                i = F;

            }
            function Rd(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
                d = i;
                i = i + 48 | 0;
                e = d + 28 | 0;
                n = d + 16 | 0;
                h = d + 4 | 0;
                j = d + 8 | 0;
                f = d + 32 | 0;
                k = d;
                m = d + 12 | 0;
                l = d + 24 | 0;
                g = d + 20 | 0;
                c[n >> 2] = a;
                c[h >> 2] = b;
                b = c[n >> 2] | 0;
                c[j >> 2] = (Td((c[n >> 2] | 0) > 0 ? b : 0 - b | 0) | 0) - 1;
                c[m >> 2] = c[n >> 2] << c[j >> 2];
                c[k >> 2] = 536870911 / (c[m >> 2] >> 16 | 0) | 0;
                c[g >> 2] = c[k >> 2] << 16;
                b = $(c[m >> 2] >> 16, (c[k >> 2] & 65535) << 16 >> 16) | 0;
                c[l >> 2] = 536870912 - (b + (($(c[m >> 2] & 65535, (c[k >> 2] & 65535) << 16 >> 16) | 0) >> 16)) << 3;
                b = $(c[l >> 2] >> 16, (c[k >> 2] & 65535) << 16 >> 16) | 0;
                b = (c[g >> 2] | 0) + (b + (($(c[l >> 2] & 65535, (c[k >> 2] & 65535) << 16 >> 16) | 0) >> 16)) | 0;
                c[g >> 2] = b + ($(c[l >> 2] | 0, (c[k >> 2] >> 15) + 1 >> 1) | 0);
                c[f >> 2] = 61 - (c[j >> 2] | 0) - (c[h >> 2] | 0);
                b = c[f >> 2] | 0;
                if ((c[f >> 2] | 0) > 0) {
                    if ((b | 0) < 32) {
                        c[e >> 2] = c[g >> 2] >> c[f >> 2];
                        n = c[e >> 2] | 0;
                        i = d;
                        return n | 0
                    } else {
                        c[e >> 2] = 0;
                        n = c[e >> 2] | 0;
                        i = d;
                        return n | 0
                    }
                }
                h = c[g >> 2] | 0;
                a = 0 - (c[f >> 2] | 0) | 0;
                do {
                    if ((-2147483648 >> 0 - b | 0) > (2147483647 >> 0 - (c[f >> 2] | 0) | 0)) {
                        if ((h | 0) > (-2147483648 >> a | 0)) {
                            g = -2147483648 >> 0 - (c[f >> 2] | 0);
                            break
                        }
                        if ((c[g >> 2] | 0) < (2147483647 >> 0 - (c[f >> 2] | 0) | 0)) {
                            g = 2147483647 >> 0 - (c[f >> 2] | 0);
                            break
                        } else {
                            g = c[g >> 2] | 0;
                            break
                        }
                    } else {
                        if ((h | 0) > (2147483647 >> a | 0)) {
                            g = 2147483647 >> 0 - (c[f >> 2] | 0);
                            break
                        }
                        if ((c[g >> 2] | 0) < (-2147483648 >> 0 - (c[f >> 2] | 0) | 0)) {
                            g = -2147483648 >> 0 - (c[f >> 2] | 0);
                            break
                        } else {
                            g = c[g >> 2] | 0;
                            break
                        }
                    }
                } while (0);
                c[e >> 2] = g << 0 - (c[f >> 2] | 0);
                n = c[e >> 2] | 0;
                i = d;
                return n | 0
            }
            function Sd(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0;
                g = i;
                i = i + 48 | 0;
                e = g + 36 | 0;
                q = g + 16 | 0;
                p = g;
                j = g + 28 | 0;
                l = g + 32 | 0;
                k = g + 40 | 0;
                f = g + 12 | 0;
                m = g + 24 | 0;
                n = g + 20 | 0;
                o = g + 8 | 0;
                h = g + 4 | 0;
                c[q >> 2] = a;
                c[p >> 2] = b;
                c[j >> 2] = d;
                a = c[q >> 2] | 0;
                c[l >> 2] = (Td((c[q >> 2] | 0) > 0 ? a : 0 - a | 0) | 0) - 1;
                c[n >> 2] = c[q >> 2] << c[l >> 2];
                a = c[p >> 2] | 0;
                c[k >> 2] = (Td((c[p >> 2] | 0) > 0 ? a : 0 - a | 0) | 0) - 1;
                c[o >> 2] = c[p >> 2] << c[k >> 2];
                c[m >> 2] = 536870911 / (c[o >> 2] >> 16 | 0) | 0;
                a = $(c[n >> 2] >> 16, (c[m >> 2] & 65535) << 16 >> 16) | 0;
                c[h >> 2] = a + (($(c[n >> 2] & 65535, (c[m >> 2] & 65535) << 16 >> 16) | 0) >> 16);
                a = c[n >> 2] | 0;
                d = c[o >> 2] | 0;
                b = c[h >> 2] | 0;
                b = hf(d | 0, ((d | 0) < 0) << 31 >> 31 | 0, b | 0, ((b | 0) < 0) << 31 >> 31 | 0) | 0;
                b = Ve(b | 0, D | 0, 32) | 0;
                c[n >> 2] = a - (b << 3);
                b = $(c[n >> 2] >> 16, (c[m >> 2] & 65535) << 16 >> 16) | 0;
                c[h >> 2] = (c[h >> 2] | 0) + (b + (($(c[n >> 2] & 65535, (c[m >> 2] & 65535) << 16 >> 16) | 0) >> 16));
                c[f >> 2] = 29 + (c[l >> 2] | 0) - (c[k >> 2] | 0) - (c[j >> 2] | 0);
                b = c[f >> 2] | 0;
                if ((c[f >> 2] | 0) >= 0) {
                    if ((b | 0) < 32) {
                        c[e >> 2] = c[h >> 2] >> c[f >> 2];
                        q = c[e >> 2] | 0;
                        i = g;
                        return q | 0
                    } else {
                        c[e >> 2] = 0;
                        q = c[e >> 2] | 0;
                        i = g;
                        return q | 0
                    }
                }
                a = c[h >> 2] | 0;
                d = 0 - (c[f >> 2] | 0) | 0;
                do {
                    if ((-2147483648 >> 0 - b | 0) > (2147483647 >> 0 - (c[f >> 2] | 0) | 0)) {
                        if ((a | 0) > (-2147483648 >> d | 0)) {
                            h = -2147483648 >> 0 - (c[f >> 2] | 0);
                            break
                        }
                        if ((c[h >> 2] | 0) < (2147483647 >> 0 - (c[f >> 2] | 0) | 0)) {
                            h = 2147483647 >> 0 - (c[f >> 2] | 0);
                            break
                        } else {
                            h = c[h >> 2] | 0;
                            break
                        }
                    } else {
                        if ((a | 0) > (2147483647 >> d | 0)) {
                            h = 2147483647 >> 0 - (c[f >> 2] | 0);
                            break
                        }
                        if ((c[h >> 2] | 0) < (-2147483648 >> 0 - (c[f >> 2] | 0) | 0)) {
                            h = -2147483648 >> 0 - (c[f >> 2] | 0);
                            break
                        } else {
                            h = c[h >> 2] | 0;
                            break
                        }
                    }
                } while (0);
                c[e >> 2] = h << 0 - (c[f >> 2] | 0);
                q = c[e >> 2] | 0;
                i = g;
                return q | 0
            }
            function Td(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                if ((c[d >> 2] | 0) == 0) {
                    d = 32;
                    i = b;
                    return d | 0
                }
                d = 32 - (32 - (We(c[d >> 2] | 0) | 0)) | 0;
                i = b;
                return d | 0
            }
            function Ud(b, d, e, f, g, h) {
                b


= b | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0;
                q = i;
                i = i + 192 | 0;
                s = q + 172 | 0;
                t = q + 152 | 0;
                m = q;
                p = q + 164 | 0;
                u = q + 168 | 0;
                v = q + 176 | 0;
                o = q + 148 | 0;
                l = q + 160 | 0;
                r = q + 156 | 0;
                n = q + 8 | 0;
                j = q + 4 | 0;
                c[s >> 2] = b;
                c[t >> 2] = d;
                c[m >> 2] = e;
                c[p >> 2] = f;
                c[u >> 2] = g;
                c[v >> 2] = h;
                c[r >> 2] = 0;
                c[o >> 2] = c[(c[s >> 2] | 0) + 2328 >> 2];
                c[n + 136 >> 2] = 0;
                do {
                    if ((c[u >> 2] | 0) == 0) {
                        k = 4
                    } else {
                        if ((c[u >> 2] | 0) == 2 ? (c[(c[s >> 2] | 0) + 2420 + (c[(c[s >> 2] | 0) + 2388 >> 2] << 2) >> 2] | 0) == 1 : 0) {
                            k = 4;
                            break
                        }
                        vd(c[s >> 2] | 0, n, c[m >> 2] | 0, 1)
                    }
                } while (0);
                if ((k | 0) == 4) {
                    d = (c[o >> 2] | 0) + 16 - 1 & -16;
                    c[j >> 2] = ia() | 0;
                    b = i;
                    i = i + ((2 * d | 0) + 15 & -16) | 0;
                    Vd(c[s >> 2] | 0, c[t >> 2] | 0, c[(c[s >> 2] | 0) + 2388 >> 2] | 0, c[u >> 2] | 0, c[v >> 2] | 0);
                    Yd(c[t >> 2] | 0, b, a[(c[s >> 2] | 0) + 2765 >> 0] | 0, a[(c[s >> 2] | 0) + 2766 >> 0] | 0, c[(c[s >> 2] | 0) + 2328 >> 2] | 0);
                    Wd(c[s >> 2] | 0, n, c[v >> 2] | 0);
                    Qd(c[s >> 2] | 0, n, c[m >> 2] | 0, b);
                    vd(c[s >> 2] | 0, n, c[m >> 2] | 0, 0);
                    c[(c[s >> 2] | 0) + 4160 >> 2] = 0;
                    c[(c[s >> 2] | 0) + 4164 >> 2] = a[(c[s >> 2] | 0) + 2765 >> 0] | 0;
                    c[(c[s >> 2] | 0) + 2376 >> 2] = 0;
                    na(c[j >> 2] | 0)
                }
                c[l >> 2] = (c[(c[s >> 2] | 0) + 2336 >> 2] | 0) - (c[(c[s >> 2] | 0) + 2328 >> 2] | 0);
                $e((c[s >> 2] | 0) + 1348 | 0, (c[s >> 2] | 0) + 1348 + (c[(c[s >> 2] | 0) + 2328 >> 2] << 1) | 0, c[l >> 2] << 1 | 0) | 0;
                Ze((c[s >> 2] | 0) + 1348 + (c[l >> 2] << 1) | 0, c[m >> 2] | 0, c[(c[s >> 2] | 0) + 2328 >> 2] << 1 | 0) | 0;
                Wc(c[s >> 2] | 0, n, c[m >> 2] | 0, c[o >> 2] | 0);
                yd(c[s >> 2] | 0, c[m >> 2] | 0, c[o >> 2] | 0);
                c[(c[s >> 2] | 0) + 2308 >> 2] = c[n + ((c[(c[s >> 2] | 0) + 2324 >> 2] | 0) - 1 << 2) >> 2];
                c[c[p >> 2] >> 2] = c[o >> 2];
                i = q;
                return c[r >> 2] | 0
            }
            function Vd(d, e, f, g, h) {
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0;
                l = i;
                i = i + 96 | 0;
                r = l + 36 | 0;
                o = l + 4 | 0;
                u = l + 28 | 0;
                v = l + 16 | 0;
                p = l + 32 | 0;
                k = l;
                m = l + 12 | 0;
                s = l + 24 | 0;
                n = l + 20 | 0;
                j = l + 8 | 0;
                q = l + 40 | 0;
                t = l + 72 | 0;
                c[r >> 2] = d;
                c[o >> 2] = e;
                c[u >> 2] = f;
                c[v >> 2] = g;
                c[p >> 2] = h;
                if ((c[v >> 2] | 0) == 0 ? (c[(c[r >> 2] | 0) + 2404 + (c[u >> 2] << 2) >> 2] | 0) == 0 : 0) {
                    c[s >> 2] = Pb(c[o >> 2] | 0, 18280, 8) | 0
                } else {
                    c[s >> 2] = (Pb(c[o >> 2] | 0, 18272, 8) | 0) + 2
                }
                a[(c[r >> 2] | 0) + 2765 >> 0] = c[s >> 2] >> 1;
                a[(c[r >> 2] | 0) + 2766 >> 0] = c[s >> 2] & 1;
                h = c[o >> 2] | 0;
                if ((c[p >> 2] | 0) == 2) {
                    v = (Pb(h, 18112, 8) | 0) & 255;
                    a[(c[r >> 2] | 0) + 2736 >> 0] = v
                } else {
                    u = (Pb(h, 18088 + (a[(c[r >> 2] | 0) + 2765 >> 0] << 3) | 0, 8) | 0) << 3 & 255;
                    a[(c[r >> 2] | 0) + 2736 >> 0] = u;
                    u = ((Pb(c[o >> 2] | 0, 18344, 8) | 0) & 255) << 24 >> 24;
                    v = (c[r >> 2] | 0) + 2736 | 0;
                    a[v >> 0] = (a[v >> 0] | 0) + u
                }
                c[k >> 2] = 1;
                while (1) {
                    h = c[o >> 2] | 0;
                    if ((c[k >> 2] | 0) >= (c[(c[r >> 2] | 0) + 2324 >> 2] | 0)) {
                        break
                    }
                    v = (Pb(h, 18112, 8) | 0) & 255;
                    a[(c[r >> 2] | 0) + 2736 + (c[k >> 2] | 0) >> 0] = v;
                    c[k >> 2] = (c[k >> 2] | 0) + 1
                }
                v = $(a[(c[r >> 2] | 0) + 2765 >> 0] >> 1, b[c[(c[r >> 2] | 0) + 2732 >> 2] >> 1] | 0) | 0;
                v = (Pb(h, (c[(c[(c[r >> 2] | 0) + 2732 >> 2] | 0) + 12 >> 2] | 0) + v | 0, 8) | 0) & 255;
                a[(c[r >> 2] | 0) + 2744 >> 0] = v;
                td(q, t, c[(c[r >> 2] | 0) + 2732 >> 2] | 0, a[(c[r >> 2] | 0) + 2744 >> 0] | 0);
                c[k >> 2] = 0;
                while (1) {
                    if ((c[k >> 2] | 0) >= (b[(c[(c[r >> 2] | 0) + 2732 >> 2] | 0) + 2 >> 1] | 0)) {
                        break
                    }
                    c[s >> 2] = Pb(c[o >> 2] | 0, (c[(c[(c[r >> 2] | 0) + 2732 >> 2] | 0) + 24 >> 2] | 0) + (b[q + (c[k >> 2] << 1) >> 1] | 0) | 0, 8) | 0;
                    if ((c[s >> 2] | 0) != 0) {
                        if ((c[s >> 2] | 0) == 8) {
                            v = Pb(c[o >> 2] | 0, 18352, 8) | 0;
                            c[s >> 2] = (c[s >> 2] | 0) + v
                        }
                    } else {
                        v = Pb(c[o >> 2] | 0, 18352, 8) | 0;
                        c[s >> 2] = (c[s >> 2] | 0) - v
                    }
                    a[(c[r >> 2] | 0) + 2744 + ((c[k >> 2] | 0) + 1) >> 0] = (c[s >> 2] | 0) - 4;
                    c[k >> 2] = (c[k >> 2] | 0) + 1
                }
                if ((c[(c[r >> 2] | 0) + 2324 >> 2] | 0) == 4) {
                    v = (Pb(c[o >> 2] | 0, 18288, 8) | 0) & 255;
                    a[(c[r >> 2] | 0) + 2767 >> 0] = v
                } else {
                    a[(c[r >> 2] | 0) + 2767 >> 0] = 4
                }
                if ((a[(c[r >> 2] | 0) + 2765 >> 0] | 0) != 2) {
                    v = c[r >> 2] | 0;
                    v = v + 2736 | 0;
                    v = v + 29 | 0;
                    v = a[v >> 0] | 0;
                    v = v << 24 >> 24;
                    u = c[r >> 2] | 0;
                    u = u + 2396 | 0;
                    c[u >> 2] = v;
                    u = c[o >> 2] | 0;
                    u = Pb(u, 18320, 8) | 0;
                    u = u & 255;
                    v = c[r >> 2] | 0;
                    v = v + 2736 | 0;
                    v = v + 34 | 0;
                    a[v >> 0] = u;
                    i = l;
                    return
                }
                c[n >> 2] = 1;
                if (((c[p >> 2] | 0) == 2 ? (c[(c[r >> 2] | 0) + 2396 >> 2] | 0) == 2 : 0) ? (c[j >> 2] = ((Pb(c[o >> 2] | 0, 18392, 8) | 0) & 65535) << 16 >> 16, (c[j >> 2] | 0) > 0) : 0) {
                    c[j >> 2] = (c[j >> 2] | 0) - 9;
                    b[(c[r >> 2] | 0) + 2762 >> 1] = (b[(c[r >> 2] | 0) + 2400 >> 1] | 0) + (c[j >> 2] | 0);
                    c[n >> 2] = 0
                }
                if ((c[n >> 2] | 0) != 0) {
                    u = ((Pb(c[o >> 2] | 0, 18360, 8) | 0) & 65535) << 16 >> 16;
                    u = ($(u, c[(c[r >> 2] | 0) + 2316 >> 2] >> 1) | 0) & 65535;
                    b[(c[r >> 2] | 0) + 2762 >> 1] = u;
                    u = ((Pb(c[o >> 2] | 0, c[(c[r >> 2] | 0) + 2380 >> 2] | 0, 8) | 0) & 65535) << 16 >> 16;
                    v = (c[r >> 2] | 0) + 2762 | 0;
                    b[v >> 1] = (b[v >> 1] | 0) + u
                }
                b[(c[r >> 2] | 0) + 2400 >> 1] = b[(c[r >> 2] | 0) + 2762 >> 1] | 0;
                v = (Pb(c[o >> 2] | 0, c[(c[r >> 2] | 0) + 2384 >> 2] | 0, 8) | 0) & 255;
                a[(c[r >> 2] | 0) + 2764 >> 0] = v;
                v = (Pb(c[o >> 2] | 0, 15848, 8) | 0) & 255;
                a[(c[r >> 2] | 0) + 2768 >> 0] = v;
                c[m >> 2] = 0;
                while (1) {
                    if ((c[m >> 2] | 0) >= (c[(c[r >> 2] | 0) + 2324 >> 2] | 0)) {
                        break
                    }
                    v = (Pb(c[o >> 2] | 0, c[15912 + (a[(c[r >> 2] | 0) + 2768 >> 0] << 2) >> 2] | 0, 8) | 0) & 255;
                    a[(c[r >> 2] | 0) + 2740 + (c[m >> 2] | 0) >> 0] = v;
                    c[m >> 2] = (c[m >> 2] | 0) + 1
                }
                if ((c[p >> 2] | 0) == 0) {
                    v = (Pb(c[o >> 2] | 0, 18264, 8) | 0) & 255;
                    a[(c[r >> 2] | 0) + 2769 >> 0] = v;
                    v = c[r >> 2] | 0;
                    v = v + 2736 | 0;
                    v = v + 29 | 0;
                    v = a[v >> 0] | 0;
                    v = v << 24 >> 24;
                    u = c[r >> 2] | 0;
                    u = u + 2396 | 0;
                    c[u >> 2] = v;
                    u = c[o >> 2] | 0;
                    u = Pb(u, 18320, 8) | 0;
                    u = u & 255;
                    v = c[r >> 2] | 0;
                    v = v + 2736 | 0;
                    v = v + 34 | 0;
                    a[v >> 0] = u;
                    i = l;

                } else {
                    a[(c[r >> 2] | 0) + 2769 >> 0] = 0;
                    v = c[r >> 2] | 0;
                    v = v + 2736 | 0;
                    v = v + 29 | 0;
                    v = a[v >> 0] | 0;
                    v = v << 24 >> 24;
                    u = c[r >> 2] | 0;
                    u = u + 2396 | 0;
                    c[u >> 2] = v;
                    u = c[o >> 2] | 0;
                    u = Pb(u, 18320, 8) | 0;
                    u = u & 255;
                    v = c[r >> 2] | 0;
                    v = v + 2736 | 0;
                    v = v + 34 | 0;
                    a[v >> 0] = u;
                    i = l;

                }
            }
            function Wd(d, e, f) {
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0;
                j = i;
                i = i + 96 | 0;
                h = j + 4 | 0;
                m = j + 16 | 0;
                q = j + 12 | 0;
                o = j + 8 | 0;
                l = j + 24 | 0;
                p = j;
                g = j + 32 | 0;
                n = j + 64 | 0;
                k = j + 20 | 0;
                c[h >> 2] = d;
                c[m >> 2] = e;
                c[q >> 2] = f;
                $d((c[m >> 2] | 0) + 16 | 0, (c[h >> 2] | 0) + 2736 | 0, (c[h >> 2] | 0) + 2312 | 0, (c[q >> 2] | 0) == 2 & 1, c[(c[h >> 2] | 0) + 2324 >> 2] | 0);
                kd(g, (c[h >> 2] | 0) + 2744 | 0, c[(c[h >> 2] | 0) + 2732 >> 2] | 0);
                fd((c[m >> 2] | 0) + 64 | 0, g, c[(c[h >> 2] | 0) + 2340 >> 2] | 0);
                if ((c[(c[h >> 2] | 0) + 2376 >> 2] | 0) == 1) {
                    a[(c[h >> 2] | 0) + 2767 >> 0] = 4
                }
                if ((a[(c[h >> 2] | 0) + 2767 >> 0] | 0) < 4) {
                    c[o >> 2] = 0;
                    while (1) {
                        if ((c[o >> 2] | 0) >= (c[(c[h >> 2] | 0) + 2340 >> 2] | 0)) {
                            break
                        }
                        q = (b[(c[h >> 2] | 0) + 2344 + (c[o >> 2] << 1) >> 1] | 0) + (($(a[(c[h >> 2] | 0) + 2767 >> 0] | 0, (b[g + (c[o >> 2] << 1) >> 1] | 0) - (b[(c[h >> 2] | 0) + 2344 + (c[o >> 2] << 1) >> 1] | 0) | 0) | 0) >> 2) & 65535;
                        b[n + (c[o >> 2] << 1) >> 1] = q;
                        c[o >> 2] = (c[o >> 2] | 0) + 1
                    }
                    fd((c[m >> 2] | 0) + 32 | 0, n, c[(c[h >> 2] | 0) + 2340 >> 2] | 0)
                } else {
                    Ze((c[m >> 2] | 0) + 32 | 0, (c[m >> 2] | 0) + 64 | 0, c[(c[h >> 2] | 0) + 2340 >> 2] << 1 | 0) | 0
                }
                Ze((c[h >> 2] | 0) + 2344 | 0, g | 0, c[(c[h >> 2] | 0) + 2340 >> 2] << 1 | 0) | 0;
                if ((c[(c[h >> 2] | 0) + 4160 >> 2] | 0) != 0) {
                    Kd((c[m >> 2] | 0) + 32 | 0, c[(c[h >> 2] | 0) + 2340 >> 2] | 0, 63570);
                    Kd((c[m >> 2] | 0) + 64 | 0, c[(c[h >> 2] | 0) + 2340 >> 2] | 0, 63570)
                }
                if ((a[(c[h >> 2] | 0) + 2765 >> 0] | 0) != 2) {
                    Xe(c[m >> 2] | 0, 0, c[(c[h >> 2] | 0) + 2324 >> 2] << 2 | 0) | 0;
                    Xe((c[m >> 2] | 0) + 96 | 0, 0, (c[(c[h >> 2] | 0) + 2324 >> 2] | 0) * 5 << 1 | 0) | 0;
                    a[(c[h >> 2] | 0) + 2768 >> 0] = 0;
                    c[(c[m >> 2] | 0) + 136 >> 2] = 0;
                    i = j;
                    return
                }
                Xd(b[(c[h >> 2] | 0) + 2762 >> 1] | 0, a[(c[h >> 2] | 0) + 2764 >> 0] | 0, c[m >> 2] | 0, c[(c[h >> 2] | 0) + 2316 >> 2] | 0, c[(c[h >> 2] | 0) + 2324 >> 2] | 0);
                c[k >> 2] = c[16208 + (a[(c[h >> 2] | 0) + 2768 >> 0] << 2) >> 2];
                c[l >> 2] = 0;
                while (1) {
                    if ((c[l >> 2] | 0) >= (c[(c[h >> 2] | 0) + 2324 >> 2] | 0)) {
                        break
                    }
                    c[p >> 2] = a[(c[h >> 2] | 0) + 2740 + (c[l >> 2] | 0) >> 0] | 0;
                    c[o >> 2] = 0;
                    while (1) {
                        if ((c[o >> 2] | 0) >= 5) {
                            break
                        }
                        b[(c[m >> 2] | 0) + 96 + (((c[l >> 2] | 0) * 5 | 0) + (c[o >> 2] | 0) << 1) >> 1] = a[(c[k >> 2] | 0) + (((c[p >> 2] | 0) * 5 | 0) + (c[o >> 2] | 0)) >> 0] << 7;
                        c[o >> 2] = (c[o >> 2] | 0) + 1
                    }
                    c[l >> 2] = (c[l >> 2] | 0) + 1
                }
                c[p >> 2] = a[(c[h >> 2] | 0) + 2769 >> 0] | 0;
                c[(c[m >> 2] | 0) + 136 >> 2] = b[18304 + (c[p >> 2] << 1) >> 1] | 0;
                i = j;

            }
            function Xd(d, e, f, g, h) {
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0;
                s = i;
                i = i + 48 | 0;
                u = s + 36 | 0;
                o = s + 38 | 0;
                j = s + 8 | 0;
                t = s + 20 | 0;
                k = s + 28 | 0;
                m = s + 32 | 0;
                p = s + 12 | 0;
                q = s + 24 | 0;
                r = s + 4 | 0;
                l = s;
                n = s + 16 | 0;
                b[u >> 1] = d;
                a[o >> 0] = e;
                c[j >> 2] = f;
                c[t >> 2] = g;
                c[k >> 2] = h;
                h = (c[k >> 2] | 0) == 4;
                do {
                    if ((c[t >> 2] | 0) == 8) {
                        if (h) {
                            c[n >> 2] = 15e3;
                            c[l >> 2] = 11;
                            break
                        } else {
                            c[n >> 2] = 14968;
                            c[l >> 2] = 3;
                            break
                        }
                    } else {
                        if (h) {
                            c[n >> 2] = 15048;
                            c[l >> 2] = 34;
                            break
                        } else {
                            c[n >> 2] = 14976;
                            c[l >> 2] = 12;
                            break
                        }
                    }
                } while (0);
                c[q >> 2] = (c[t >> 2] & 65535) << 16 >> 16 << 1;
                c[r >> 2] = ((c[t >> 2] & 65535) << 16 >> 16) * 18;
                c[m >> 2] = (c[q >> 2] | 0) + (b[u >> 1] | 0);
                c[p >> 2] = 0;
                while (1) {
                    if ((c[p >> 2] | 0) >= (c[k >> 2] | 0)) {
                        break
                    }
                    t = $(c[p >> 2] | 0, c[l >> 2] | 0) | 0;
                    c[(c[j >> 2] | 0) + (c[p >> 2] << 2) >> 2] = (c[m >> 2] | 0) + (a[(c[n >> 2] | 0) + (t + (a[o >> 0] | 0)) >> 0] | 0);
                    t = c[(c[j >> 2] | 0) + (c[p >> 2] << 2) >> 2] | 0;
                    do {
                        if ((c[q >> 2] | 0) > (c[r >> 2] | 0)) {
                            if ((t | 0) > (c[q >> 2] | 0)) {
                                t = c[q >> 2] | 0;
                                break
                            }
                            if ((c[(c[j >> 2] | 0) + (c[p >> 2] << 2) >> 2] | 0) < (c[r >> 2] | 0)) {
                                t = c[r >> 2] | 0;
                                break
                            } else {
                                t = c[(c[j >> 2] | 0) + (c[p >> 2] << 2) >> 2] | 0;
                                break
                            }
                        } else {
                            if ((t | 0) > (c[r >> 2] | 0)) {
                                t = c[r >> 2] | 0;
                                break
                            }
                            if ((c[(c[j >> 2] | 0) + (c[p >> 2] << 2) >> 2] | 0) < (c[q >> 2] | 0)) {
                                t = c[q >> 2] | 0;
                                break
                            } else {
                                t = c[(c[j >> 2] | 0) + (c[p >> 2] << 2) >> 2] | 0;
                                break
                            }
                        }
                    } while (0);
                    c[(c[j >> 2] | 0) + (c[p >> 2] << 2) >> 2] = t;
                    c[p >> 2] = (c[p >> 2] | 0) + 1
                }
                i = s;

            }
            function Yd(a, d, e, f, g) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                var h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0,
                    w = 0, x = 0, y = 0;
                o = i;
                i = i + 224 | 0;
                u = o + 84 | 0;
                q = o + 180 | 0;
                l = o + 200 | 0;
                m = o + 208 | 0;
                k = o + 188 | 0;
                h = o + 196 | 0;
                w = o + 204 | 0;
                t = o + 212 | 0;
                j = o + 216 | 0;
                v = o + 80 | 0;
                r = o + 184 | 0;
                y = o + 88 | 0;
                n = o;
                p = o + 96 | 0;
                s = o + 192 | 0;
                x = o + 176 | 0;
                c[u >> 2] = a;
                c[q >> 2] = d;
                c[l >> 2] = e;
                c[m >> 2] = f;
                c[k >> 2] = g;
                c[y >> 2] = Pb(c[u >> 2] | 0, 18680 + ((c[l >> 2] >> 1) * 9 | 0) | 0, 8) | 0;
                c[j >> 2] = c[k >> 2] >> 4;
                if ((c[j >> 2] << 4 | 0) < (c[k >> 2] | 0)) {
                    c[j >> 2] = (c[j >> 2] | 0) + 1
                }
                c[x >> 2] = 18496 + ((c[y >> 2] | 0) * 18 | 0);
                c[h >> 2] = 0;
                while (1) {
                    if ((c[h >> 2] | 0) >= (c[j >> 2] | 0)) {
                        break
                    }
                    c[p + (c[h >> 2] << 2) >> 2] = 0;
                    a = Pb(c[u >> 2] | 0, c[x >> 2] | 0, 8) | 0;
                    c[n + (c[h >> 2] << 2) >> 2] = a;
                    while (1) {
                        g = c[h >> 2] | 0;
                        if ((c[n + (c[h >> 2] << 2) >> 2] | 0) != 17) {
                            break
                        }
                        a = p + (g << 2) | 0;
                        c[a >> 2] = (c[a >> 2] | 0) + 1;
                        a = Pb(c[u >> 2] | 0, ((c[p + (c[h >> 2] << 2) >> 2] | 0) == 10 & 1) + 18658 | 0, 8) | 0;
                        c[n + (c[h >> 2] << 2) >> 2] = a
                    }
                    c[h >> 2] = g + 1
                }
                c[h >> 2] = 0;
                while (1) {
                    if ((c[h >> 2] | 0) >= (c[j >> 2] | 0)) {
                        break
                    }
                    x = (c[q >> 2] | 0) + ((c[h >> 2] & 65535) << 16 >> 16 << 4 << 1) | 0;
                    if ((c[n + (c[h >> 2] << 2) >> 2] | 0) > 0) {
                        me(x, c[u >> 2] | 0, c[n + (c[h >> 2] << 2) >> 2] | 0)
                    } else {
                        g = x + 0 | 0;
                        x = g + 32 | 0;
                        do {
                            b[g >> 1] = 0;
                            g = g + 2 | 0
                        } while ((g | 0) < (x | 0))
                    }
                    c[h >> 2] = (c[h >> 2] | 0) + 1
                }
                c[h >> 2] = 0;
                while (1) {
                    if ((c[h >> 2] | 0) >= (c[j >> 2] | 0)) {
                        break
                    }
                    if ((c[p + (c[h >> 2] << 2) >> 2] | 0) > 0) {
                        c[r >> 2] = c[p + (c[h >> 2] << 2) >> 2];
                        c[s >> 2] = (c[q >> 2] | 0) + ((c[h >> 2] & 65535) << 16 >> 16 << 4 << 1);
                        c[t >> 2] = 0;
                        while (1) {
                            if ((c[t >> 2] | 0) >= 16) {
                                break
                            }
                            c[v >> 2] = b[(c[s >> 2] | 0) + (c[t >> 2] << 1) >> 1] | 0;
                            c[w >> 2] = 0;
                            while (1) {
                                x = c[v >> 2] | 0;
                                if ((c[w >> 2] | 0) >= (c[r >> 2] | 0)) {
                                    break
                                }
                                c[v >> 2] = x << 1;
                                a = Pb(c[u >> 2] | 0, 18256, 8) | 0;
                                c[v >> 2] = (c[v >> 2] | 0) + a;
                                c[w >> 2] = (c[w >> 2] | 0) + 1
                            }
                            b[(c[s >> 2] | 0) + (c[t >> 2] << 1) >> 1] = x;
                            c[t >> 2] = (c[t >> 2] | 0) + 1
                        }
                        a = n + (c[h >> 2] << 2) | 0;
                        c[a >> 2] = c[a >> 2] | c[r >> 2] << 5
                    }
                    c[h >> 2] = (c[h >> 2] | 0) + 1
                }
                Md(c[u >> 2] | 0, c[q >> 2] | 0, c[k >> 2] | 0, c[l >> 2] | 0, c[m >> 2] | 0, n);
                i = o;

            }
            function Zd(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                f = i;
                i = i + 32 | 0;
                g = f + 16 | 0;
                h = f + 12 | 0;
                l = f + 8 | 0;
                j = f + 4 | 0;
                k = f;
                c[g >> 2] = b;
                c[h >> 2] = d;
                c[l >> 2] = e;
                c[k >> 2] = 0;
                c[(c[g >> 2] | 0) + 2332 >> 2] = ((c[h >> 2] & 65535) << 16 >> 16) * 5;
                c[j >> 2] = $((c[(c[g >> 2] | 0) + 2324 >> 2] & 65535) << 16 >> 16, (c[(c[g >> 2] | 0) + 2332 >> 2] & 65535) << 16 >> 16) | 0;
                if (!((c[(c[g >> 2] | 0) + 2316 >> 2] | 0) == (c[h >> 2] | 0) ? (c[(c[g >> 2] | 0) + 2320 >> 2] | 0) == (c[l >> 2] | 0) : 0)) {
                    b = de((c[g >> 2] | 0) + 2432 | 0, ((c[h >> 2] & 65535) << 16 >> 16) * 1e3 | 0, c[l >> 2] | 0, 0) | 0;
                    c[k >> 2] = (c[k >> 2] | 0) + b;
                    c[(c[g >> 2] | 0) + 2320 >> 2] = c[l >> 2]
                }
                if ((c[(c[g >> 2] | 0) + 2316 >> 2] | 0) == (c[h >> 2] | 0) ? (c[j >> 2] | 0) == (c[(c[g >> 2] | 0) + 2328 >> 2] | 0) : 0) {
                    b = c[k >> 2] | 0;
                    i = f;
                    return b | 0
                }
                l = (c[(c[g >> 2] | 0) + 2324 >> 2] | 0) == 4;
                d = (c[g >> 2] | 0) + 2384 | 0;
                do {
                    if ((c[h >> 2] | 0) == 8) {
                        if (l) {
                            c[d >> 2] = 18456;
                            break
                        } else {
                            c[d >> 2] = 18488;
                            break
                        }
                    } else {
                        if (l) {
                            c[d >> 2] = 18416;
                            break
                        } else {
                            c[d >> 2] = 18472;
                            break
                        }
                    }
                } while (0);
                if ((c[(c[g >> 2] | 0) + 2316 >> 2] | 0) != (c[h >> 2] | 0)) {
                    c[(c[g >> 2] | 0) + 2336 >> 2] = ((c[h >> 2] & 65535) << 16 >> 16) * 20;
                    d = (c[g >> 2] | 0) + 2340 | 0;
                    if ((c[h >> 2] | 0) == 8 | (c[h >> 2] | 0) == 12) {
                        c[d >> 2] = 10;
                        c[(c[g >> 2] | 0) + 2732 >> 2] = 16960
                    } else {
                        c[d >> 2] = 16;
                        c[(c[g >> 2] | 0) + 2732 >> 2] = 18048
                    }
                    do {
                        if ((c[h >> 2] | 0) != 16) {
                            if ((c[h >> 2] | 0) == 12) {
                                c[(c[g >> 2] | 0) + 2380 >> 2] = 18336;
                                break
                            }
                            if ((c[h >> 2] | 0) == 8) {
                                c[(c[g >> 2] | 0) + 2380 >> 2] = 18320
                            }
                        } else {
                            c[(c[g >> 2] | 0) + 2380 >> 2] = 18344
                        }
                    } while (0);
                    c[(c[g >> 2] | 0) + 2376 >> 2] = 1;
                    c[(c[g >> 2] | 0) + 2308 >> 2] = 100;
                    a[(c[g >> 2] | 0) + 2312 >> 0] = 10;
                    c[(c[g >> 2] | 0) + 4164 >> 2] = 0;
                    Xe((c[g >> 2] | 0) + 1348 | 0, 0, 960) | 0;
                    l = (c[g >> 2] | 0) + 1284 | 0;
                    d = l + 64 | 0;
                    do {
                        c[l >> 2] = 0;
                        l = l + 4 | 0
                    } while ((l | 0) < (d | 0))
                }
                c[(c[g >> 2] | 0) + 2316 >> 2] = c[h >> 2];
                c[(c[g >> 2] | 0) + 2328 >> 2] = c[j >> 2];
                b = c[k >> 2] | 0;
                i = f;
                return b | 0
            }
            function _d(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0;
                f = i;
                i = i + 16 | 0;
                e = f + 4 | 0;
                d = f;
                c[e >> 2] = a;
                c[d >> 2] = b;
                i = f;
                return ((c[e >> 2] | 0) < (c[d >> 2] | 0) ? c[e >> 2] | 0 : c[d >> 2] | 0) | 0
            }
            function $d(b, d, e, f, g) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                var h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0;
                q = i;
                i = i + 32 | 0;
                p = q + 4 | 0;
                l = q + 16 | 0;
                k = q + 8 | 0;
                n = q + 20 | 0;
                o = q + 28 | 0;
                m = q;
                r = q + 12 | 0;
                h = q + 24 | 0;
                c[p >> 2] = b;
                c[l >> 2] = d;
                c[k >> 2] = e;
                c[n >> 2] = f;
                c[o >> 2] = g;
                c[m >> 2] = 0;
                while (1) {
                    if ((c[m >> 2] | 0) >= (c[o >> 2] | 0)) {
                        break
                    }
                    if ((c[m >> 2] | 0) == 0 ? (c[n >> 2] | 0) == 0 : 0) {
                        b = (ae(a[(c[l >> 2] | 0) + (c[m >> 2] | 0) >> 0] | 0, (a[c[k >> 2] >> 0] | 0) - 16 | 0) | 0) & 255;
                        a[c[k >> 2] >> 0] = b
                    } else {
                        j = 6
                    }
                    do {
                        if ((j | 0) == 6) {
                            j = 0;
                            c[r >> 2] = (a[(c[l >> 2] | 0) + (c[m >> 2] | 0) >> 0] | 0) + -4;
                            c[h >> 2] = 8 + (a[c[k >> 2] >> 0] | 0);
                            g = c[r >> 2] | 0;
                            if ((c[r >> 2] | 0) > (c[h >> 2] | 0)) {
                                b = c[k >> 2] | 0;
                                a[b >> 0] = (a[b >> 0] | 0) + ((g << 1) - (c[h >> 2] | 0));
                                break
                            } else {
                                b = c[k >> 2] | 0;
                                a[b >> 0] = (a[b >> 0] | 0) + g;
                                break
                            }
                        }
                    } while (0);
                    if ((a[c[k >> 2] >> 0] | 0) <= 63) {
                        if ((a[c[k >> 2] >> 0] | 0) < 0) {
                            g = 0
                        } else {
                            g = a[c[k >> 2] >> 0] | 0
                        }
                    } else {
                        g = 63
                    }
                    a[c[k >> 2] >> 0] = g;
                    b = ce(_d(((a[c[k >> 2] >> 0] << 16 >> 16) * 29 | 0) + ((a[c[k >> 2] >> 0] << 16 >> 16) * 7281 >> 16) + 2090 | 0, 3967) | 0) | 0;
                    c[(c[p >> 2] | 0) + (c[m >> 2] << 2) >> 2] = b;
                    c[m >> 2] = (c[m >> 2] | 0) + 1
                }
                i = q;

            }
            function ae(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0;
                f = i;
                i = i + 16 | 0;
                e = f + 4 | 0;
                d = f;
                c[e >> 2] = a;
                c[d >> 2] = b;
                i = f;
                return ((c[e >> 2] | 0) > (c[d >> 2] | 0) ? c[e >> 2] | 0 : c[d >> 2] | 0) | 0
            }
            function be(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                Xe(c[d >> 2] | 0, 0, 4260) | 0;
                c[(c[d >> 2] | 0) + 2376 >> 2] = 1;
                c[c[d >> 2] >> 2] = 65536;
                Vc(c[d >> 2] | 0);
                ud(c[d >> 2] | 0);
                i = b;
                return 0
            }
            function ce(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0;
                b = i;
                i = i + 16 | 0;
                d = b + 12 | 0;
                e = b + 8 | 0;
                f = b + 4 | 0;
                g = b;
                c[e >> 2] = a;
                if ((c[e >> 2] | 0) < 0) {
                    c[d >> 2] = 0;
                    h = c[d >> 2] | 0;
                    i = b;
                    return h | 0
                }
                if ((c[e >> 2] | 0) >= 3967) {
                    c[d >> 2] = 2147483647;
                    h = c[d >> 2] | 0;
                    i = b;
                    return h | 0
                }
                c[f >> 2] = 1 << (c[e >> 2] >> 7);
                c[g >> 2] = c[e >> 2] & 127;
                h = c[f >> 2] | 0;
                a = c[f >> 2] | 0;
                if ((c[e >> 2] | 0) < 2048) {
                    e = $(($((c[g >> 2] & 65535) << 16 >> 16, (128 - (c[g >> 2] | 0) & 65535) << 16 >> 16) | 0) >> 16, -174) | 0;
                    c[f >> 2] = h + (($(a, (c[g >> 2] | 0) + (e + (($(($((c[g >> 2] & 65535) << 16 >> 16, (128 - (c[g >> 2] | 0) & 65535) << 16 >> 16) | 0) & 65535, -174) | 0) >> 16)) | 0) | 0) >> 7)
                } else {
                    e = $(($((c[g >> 2] & 65535) << 16 >> 16, (128 - (c[g >> 2] | 0) & 65535) << 16 >> 16) | 0) >> 16, -174) | 0;
                    c[f >> 2] = h + ($(a >> 7, (c[g >> 2] | 0) + (e + (($(($((c[g >> 2] & 65535) << 16 >> 16, (128 - (c[g >> 2] | 0) & 65535) << 16 >> 16) | 0) & 65535, -174) | 0) >> 16)) | 0) | 0)
                }
                c[d >> 2] = c[f >> 2];
                h = c[d >> 2] | 0;
                i = b;
                return h | 0
            }
            function de(b, d, e, f) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
                l = i;
                i = i + 32 | 0;
                k = l + 20 | 0;
                j = l + 16 | 0;
                m = l + 12 | 0;
                h = l + 8 | 0;
                n = l + 4 | 0;
                g = l;
                c[j >> 2] = b;
                c[m >> 2] = d;
                c[h >> 2] = e;
                c[n >> 2] = f;
                Xe(c[j >> 2] | 0, 0, 300) | 0;
                e = (c[m >> 2] | 0) != 8e3 & (c[m >> 2] | 0) != 12e3 & (c[m >> 2] | 0) != 16e3;
                do {
                    if ((c[n >> 2] | 0) != 0) {
                        if (!(e & (c[m >> 2] | 0) != 24e3 & (c[m >> 2] | 0) != 48e3) ? !((c[h >> 2] | 0) != 8e3 & (c[h >> 2] | 0) != 12e3 & (c[h >> 2] | 0) != 16e3) : 0) {
                            c[(c[j >> 2] | 0) + 292 >> 2] = a[15184 + ((((c[m >> 2] >> 12) - ((c[m >> 2] | 0) > 16e3 & 1) >> ((c[m >> 2] | 0) > 24e3 & 1)) - 1 | 0) * 3 | 0) + (((c[h >> 2] >> 12) - ((c[h >> 2] | 0) > 16e3 & 1) >> ((c[h >> 2] | 0) > 24e3 & 1)) - 1) >> 0] | 0;
                            break
                        }
                        c[k >> 2] = -1;
                        n = c[k >> 2] | 0;
                        i = l;
                        return n | 0
                    } else {
                        if (!e ? !((c[h >> 2] | 0) != 8e3 & (c[h >> 2] | 0) != 12e3 & (c[h >> 2] | 0) != 16e3 & (c[h >> 2] | 0) != 24e3 & (c[h >> 2] | 0) != 48e3) : 0) {
                            c[(c[j >> 2] | 0) + 292 >> 2] = a[15200 + ((((c[m >> 2] >> 12) - ((c[m >> 2] | 0) > 16e3 & 1) >> ((c[m >> 2] | 0) > 24e3 & 1)) - 1 | 0) * 5 | 0) + (((c[h >> 2] >> 12) - ((c[h >> 2] | 0) > 16e3 & 1) >> ((c[h >> 2] | 0) > 24e3 & 1)) - 1) >> 0] | 0;
                            break
                        }
                        c[k >> 2] = -1;
                        n = c[k >> 2] | 0;
                        i = l;
                        return n | 0
                    }
                } while (0);
                c[(c[j >> 2] | 0) + 284 >> 2] = (c[m >> 2] | 0) / 1e3 | 0;
                c[(c[j >> 2] | 0) + 288 >> 2] = (c[h >> 2] | 0) / 1e3 | 0;
                c[(c[j >> 2] | 0) + 268 >> 2] = (c[(c[j >> 2] | 0) + 284 >> 2] | 0) * 10;
                c[g >> 2] = 0;
                f = c[h >> 2] | 0;
                e = c[m >> 2] | 0;
                do {
                    if ((c[h >> 2] | 0) > (c[m >> 2] | 0)) {
                        d = (c[j >> 2] | 0) + 264 | 0;
                        if ((f | 0) == (e << 1 | 0)) {
                            c[d >> 2] = 1;
                            break
                        } else {
                            c[d >> 2] = 2;
                            c[g >> 2] = 1;
                            break
                        }
                    } else {
                        d = (c[j >> 2] | 0) + 264 | 0;
                        if ((f | 0) >= (e | 0)) {
                            c[d >> 2] = 0;
                            break
                        }
                        c[d >> 2] = 3;
                        if ((c[h >> 2] << 2 | 0) == ((c[m >> 2] | 0) * 3 | 0)) {
                            c[(c[j >> 2] | 0) + 280 >> 2] = 3;
                            c[(c[j >> 2] | 0) + 276 >> 2] = 18;
                            c[(c[j >> 2] | 0) + 296 >> 2] = 15232;
                            break
                        }
                        if (((c[h >> 2] | 0) * 3 | 0) == (c[m >> 2] << 1 | 0)) {
                            c[(c[j >> 2] | 0) + 280 >> 2] = 2;
                            c[(c[j >> 2] | 0) + 276 >> 2] = 18;
                            c[(c[j >> 2] | 0) + 296 >> 2] = 15296;
                            break
                        }
                        if ((c[h >> 2] << 1 | 0) == (c[m >> 2] | 0)) {
                            c[(c[j >> 2] | 0) + 280 >> 2] = 1;
                            c[(c[j >> 2] | 0) + 276 >> 2] = 24;
                            c[(c[j >> 2] | 0) + 296 >> 2] = 15336;
                            break
                        }
                        if (((c[h >> 2] | 0) * 3 | 0) == (c[m >> 2] | 0)) {
                            c[(c[j >> 2] | 0) + 280 >> 2] = 1;
                            c[(c[j >> 2] | 0) + 276 >> 2] = 36;
                            c[(c[j >> 2] | 0) + 296 >> 2] = 15368;
                            break
                        }
                        if ((c[h >> 2] << 2 | 0) == (c[m >> 2] | 0)) {
                            c[(c[j >> 2] | 0) + 280 >> 2] = 1;
                            c[(c[j >> 2] | 0) + 276 >> 2] = 36;
                            c[(c[j >> 2] | 0) + 296 >> 2] = 15408;
                            break
                        }
                        if (((c[h >> 2] | 0) * 6 | 0) == (c[m >> 2] | 0)) {
                            c[(c[j >> 2] | 0) + 280 >> 2] = 1;
                            c[(c[j >> 2] | 0) + 276 >> 2] = 36;
                            c[(c[j >> 2] | 0) + 296 >> 2] = 15448;
                            break
                        }
                        c[k >> 2] = -1;
                        n = c[k >> 2] | 0;
                        i = l;
                        return n | 0
                    }
                } while (0);
                c[(c[j >> 2] | 0) + 272 >> 2] = ((c[m >> 2] << 14 + (c[g >> 2] | 0) | 0) / (c[h >> 2] | 0) | 0) << 2;
                while (1) {
                    n = $(c[(c[j >> 2] | 0) + 272 >> 2] >> 16, (c[h >> 2] & 65535) << 16 >> 16) | 0;
                    n = n + (($(c[(c[j >> 2] | 0) + 272 >> 2] & 65535, (c[h >> 2] & 65535) << 16 >> 16) | 0) >> 16) | 0;
                    n = n + ($(c[(c[j >> 2] | 0) + 272 >> 2] | 0, (c[h >> 2] >> 15) + 1 >> 1) | 0) | 0;
                    if ((n | 0) >= (c[m >> 2] << c[g >> 2] | 0)) {
                        break
                    }
                    n = (c[j >> 2] | 0) + 272 | 0;
                    c[n >> 2] = (c[n >> 2] | 0) + 1
                }
                c[k >> 2] = 0;
                n = c[k >> 2] | 0;
                i = l;
                return n | 0
            }
            function ee(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                k = i;
                i = i + 32 | 0;
                g = k + 16 | 0;
                l = k + 12 | 0;
                j = k + 8 | 0;
                h = k + 4 | 0;
                f = k;
                c[g >> 2] = a;
                c[l >> 2] = b;
                c[j >> 2] = d;
                c[h >> 2] = e;
                c[f >> 2] = (c[(c[g >> 2] | 0) + 284 >> 2] | 0) - (c[(c[g >> 2] | 0) + 292 >> 2] | 0);
                Ze((c[g >> 2] | 0) + 168 + (c[(c[g >> 2] | 0) + 292 >> 2] << 1) | 0, c[j >> 2] | 0, c[f >> 2] << 1 | 0) | 0;
                e = c[(c[g >> 2] | 0) + 264 >> 2] | 0;
                if ((e | 0) == 2) {
                    ge(c[g >> 2] | 0, c[l >> 2] | 0, (c[g >> 2] | 0) + 168 | 0, c[(c[g >> 2] | 0) + 284 >> 2] | 0);
                    ge(c[g >> 2] | 0, (c[l >> 2] | 0) + (c[(c[g >> 2] | 0) + 288 >> 2] << 1) | 0, (c[j >> 2] | 0) + (c[f >> 2] << 1) | 0, (c[h >> 2] | 0) - (c[(c[g >> 2] | 0) + 284 >> 2] | 0) | 0)
                } else if ((e | 0) == 3) {
                    ie(c[g >> 2] | 0, c[l >> 2] | 0, (c[g >> 2] | 0) + 168 | 0, c[(c[g >> 2] | 0) + 284 >> 2] | 0);
                    ie(c[g >> 2] | 0, (c[l >> 2] | 0) + (c[(c[g >> 2] | 0) + 288 >> 2] << 1) | 0, (c[j >> 2] | 0) + (c[f >> 2] << 1) | 0, (c[h >> 2] | 0) - (c[(c[g >> 2] | 0) + 284 >> 2] | 0) | 0)
                } else if ((e | 0) == 1) {
                    le(c[g >> 2] | 0, c[l >> 2] | 0, (c[g >> 2] | 0) + 168 | 0, c[(c[g >> 2] | 0) + 284 >> 2] | 0);
                    le(c[g >> 2] | 0, (c[l >> 2] | 0) + (c[(c[g >> 2] | 0) + 288 >> 2] << 1) | 0, (c[j >> 2] | 0) + (c[f >> 2] << 1) | 0, (c[h >> 2] | 0) - (c[(c[g >> 2] | 0) + 284 >> 2] | 0) | 0)
                } else {
                    Ze(c[l >> 2] | 0, (c[g >> 2] | 0) + 168 | 0, c[(c[g >> 2] | 0) + 284 >> 2] << 1 | 0) | 0;
                    Ze((c[l >> 2] | 0) + (c[(c[g >> 2] | 0) + 288 >> 2] << 1) | 0, (c[j >> 2] | 0) + (c[f >> 2] << 1) | 0, (c[h >> 2] | 0) - (c[(c[g >> 2] | 0) + 284 >> 2] | 0) << 1 | 0) | 0
                }
                Ze((c[g >> 2] | 0) + 168 | 0, (c[j >> 2] | 0) + ((c[h >> 2] | 0) - (c[(c[g >> 2] | 0) + 292 >> 2] | 0) << 1) | 0, c[(c[g >> 2] | 0) + 292 >> 2] << 1 | 0) | 0;
                i = k;
                return 0
            }
            function fe(a, d, e, f, g) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                var h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
                n = i;
                i = i + 32 | 0;
                l = n + 8 | 0;
                o = n + 16 | 0;
                m = n + 20 | 0;
                p = n + 24 | 0;
                k = n + 4 | 0;
                j = n;
                h = n + 12 | 0;
                c[l >> 2] = a;
                c[o >> 2] = d;
                c[m >> 2] = e;
                c[p >> 2] = f;
                c[k >> 2] = g;
                c[j >> 2] = 0;
                while (1) {
                    if ((c[j >> 2] | 0) >= (c[k >> 2] | 0)) {
                        break
                    }
                    c[h >> 2] = (c[c[l >> 2] >> 2] | 0) + (b[(c[m >> 2] | 0) + (c[j >> 2] << 1) >> 1] << 8);
                    c[(c[o >> 2] | 0) + (c[j >> 2] << 2) >> 2] = c[h >> 2];
                    c[h >> 2] = c[h >> 2] << 2;
                    a = $(c[h >> 2] >> 16, b[c[p >> 2] >> 1] | 0) | 0;
                    a = (c[(c[l >> 2] | 0) + 4 >> 2] | 0) + (a + (($(c[h >> 2] & 65535, b[c[p >> 2] >> 1] | 0) | 0) >> 16)) | 0;
                    c[c[l >> 2] >> 2] = a;
                    a = $(c[h >> 2] >> 16, b[(c[p >> 2] | 0) + 2 >> 1] | 0) | 0;
                    a = a + (($(c[h >> 2] & 65535, b[(c[p >> 2] | 0) + 2 >> 1] | 0) | 0) >> 16) | 0;
                    c[(c[l >> 2] | 0) + 4 >> 2] = a;
                    c[j >> 2] = (c[j >> 2] | 0) + 1
                }
                i = n;

            }
            function ge(a, d, e, f) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0;
                k = i;
                i = i + 48 | 0;
                q = k + 28 | 0;
                g = k + 16 | 0;
                l = k + 4 | 0;
                p = k + 8 | 0;
                n = k + 32 | 0;
                h = k;
                m = k + 12 | 0;
                o = k + 24 | 0;
                j = k + 20 | 0;
                c[q >> 2] = a;
                c[g >> 2] = d;
                c[l >> 2] = e;
                c[p >> 2] = f;
                c[n >> 2] = c[q >> 2];
                a = (c[(c[n >> 2] | 0) + 268 >> 2] << 1) + 8 | 0;
                c[j >> 2] = ia() | 0;
                f = i;
                i = i + ((2 * a | 0) + 15 & -16) | 0;
                a = (c[n >> 2] | 0) + 24 | 0;
                b[f + 0 >> 1] = b[a + 0 >> 1] | 0;
                b[f + 2 >> 1] = b[a + 2 >> 1] | 0;
                b[f + 4 >> 1] = b[a + 4 >> 1] | 0;
                b[f + 6 >> 1] = b[a + 6 >> 1] | 0;
                b[f + 8 >> 1] = b[a + 8 >> 1] | 0;
                b[f + 10 >> 1] = b[a + 10 >> 1] | 0;
                b[f + 12 >> 1] = b[a + 12 >> 1] | 0;
                b[f + 14 >> 1] = b[a + 14 >> 1] | 0;
                c[o >> 2] = c[(c[n >> 2] | 0) + 272 >> 2];
                while (1) {
                    if ((c[p >> 2] | 0) < (c[(c[n >> 2] | 0) + 268 >> 2] | 0)) {
                        e = c[p >> 2] | 0
                    } else {
                        e = c[(c[n >> 2] | 0) + 268 >> 2] | 0
                    }
                    c[h >> 2] = e;
                    ke(c[n >> 2] | 0, f + 16 | 0, c[l >> 2] | 0, c[h >> 2] | 0);
                    c[m >> 2] = c[h >> 2] << 17;
                    c[g >> 2] = he(c[g >> 2] | 0, f, c[m >> 2] | 0, c[o >> 2] | 0) | 0;
                    c[l >> 2] = (c[l >> 2] | 0) + (c[h >> 2] << 1);
                    c[p >> 2] = (c[p >> 2] | 0) - (c[h >> 2] | 0);
                    if ((c[p >> 2] | 0) <= 0) {
                        break
                    }
                    q = f + (c[h >> 2] << 1 << 1) | 0;
                    b[f + 0 >> 1] = b[q + 0 >> 1] | 0;
                    b[f + 2 >> 1] = b[q + 2 >> 1] | 0;
                    b[f + 4 >> 1] = b[q + 4 >> 1] | 0;
                    b[f + 6 >> 1] = b[q + 6 >> 1] | 0;
                    b[f + 8 >> 1] = b[q + 8 >> 1] | 0;
                    b[f + 10 >> 1] = b[q + 10 >> 1] | 0;
                    b[f + 12 >> 1] = b[q + 12 >> 1] | 0;
                    b[f + 14 >> 1] = b[q + 14 >> 1] | 0
                }
                q = (c[n >> 2] | 0) + 24 | 0;
                a = f + (c[h >> 2] << 1 << 1) | 0;
                b[q + 0 >> 1] = b[a + 0 >> 1] | 0;
                b[q + 2 >> 1] = b[a + 2 >> 1] | 0;
                b[q + 4 >> 1] = b[a + 4 >> 1] | 0;
                b[q + 6 >> 1] = b[a + 6 >> 1] | 0;
                b[q + 8 >> 1] = b[a + 8 >> 1] | 0;
                b[q + 10 >> 1] = b[a + 10 >> 1] | 0;
                b[q + 12 >> 1] = b[a + 12 >> 1] | 0;
                b[q + 14 >> 1] = b[a + 14 >> 1] | 0;
                na(c[j >> 2] | 0);
                i = k;

            }
            function he(a, d, e, f) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
                n = i;
                i = i + 32 | 0;
                h = n + 4 | 0;
                m = n + 16 | 0;
                o = n + 8 | 0;
                p = n + 20 | 0;
                k = n + 28 | 0;
                j = n;
                g = n + 12 | 0;
                l = n + 24 | 0;
                c[h >> 2] = a;
                c[m >> 2] = d;
                c[o >> 2] = e;
                c[p >> 2] = f;
                c[k >> 2] = 0;
                while (1) {
                    if ((c[k >> 2] | 0) >= (c[o >> 2] | 0)) {
                        break
                    }
                    c[l >> 2] = (((c[k >> 2] & 65535) >> 16) * 12 | 0) + ((c[k >> 2] & 65535) * 12 >> 16);
                    c[g >> 2] = (c[m >> 2] | 0) + (c[k >> 2] >> 16 << 1);
                    c[j >> 2] = $(b[c[g >> 2] >> 1] | 0, b[15488 + (c[l >> 2] << 3) >> 1] | 0) | 0;
                    c[j >> 2] = (c[j >> 2] | 0) + ($(b[(c[g >> 2] | 0) + 2 >> 1] | 0, b[15490 + (c[l >> 2] << 3) >> 1] | 0) | 0);
                    c[j >> 2] = (c[j >> 2] | 0) + ($(b[(c[g >> 2] | 0) + 4 >> 1] | 0, b[15492 + (c[l >> 2] << 3) >> 1] | 0) | 0);
                    c[j >> 2] = (c[j >> 2] | 0) + ($(b[(c[g >> 2] | 0) + 6 >> 1] | 0, b[15494 + (c[l >> 2] << 3) >> 1] | 0) | 0);
                    c[j >> 2] = (c[j >> 2] | 0) + ($(b[(c[g >> 2] | 0) + 8 >> 1] | 0, b[15494 + (11 - (c[l >> 2] | 0) << 3) >> 1] | 0) | 0);
                    c[j >> 2] = (c[j >> 2] | 0) + ($(b[(c[g >> 2] | 0) + 10 >> 1] | 0, b[15492 + (11 - (c[l >> 2] | 0) << 3) >> 1] | 0) | 0);
                    c[j >> 2] = (c[j >> 2] | 0) + ($(b[(c[g >> 2] | 0) + 12 >> 1] | 0, b[15490 + (11 - (c[l >> 2] | 0) << 3) >> 1] | 0) | 0);
                    c[j >> 2] = (c[j >> 2] | 0) + ($(b[(c[g >> 2] | 0) + 14 >> 1] | 0, b[15488 + (11 - (c[l >> 2] | 0) << 3) >> 1] | 0) | 0);
                    if (((c[j >> 2] >> 14) + 1 >> 1 | 0) <= 32767) {
                        if (((c[j >> 2] >> 14) + 1 >> 1 | 0) < -32768) {
                            f = -32768
                        } else {
                            f = (c[j >> 2] >> 14) + 1 >> 1
                        }
                    } else {
                        f = 32767
                    }
                    a = c[h >> 2] | 0;
                    c[h >> 2] = a + 2;
                    b[a >> 1] = f;
                    c[k >> 2] = (c[k >> 2] | 0) + (c[p >> 2] | 0)
                }
                i = n;
                return c[h >> 2] | 0
            }
            function ie(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0;
                j = i;
                i = i + 48 | 0;
                q = j;
                m = j + 16 | 0;
                k = j + 28 | 0;
                p = j + 4 | 0;
                n = j + 32 | 0;
                g = j + 36 | 0;
                l = j + 12 | 0;
                o = j + 24 | 0;
                f = j + 20 | 0;
                h = j + 8 | 0;
                c[q >> 2] = a;
                c[m >> 2] = b;
                c[k >> 2] = d;
                c[p >> 2] = e;
                c[n >> 2] = c[q >> 2];
                a = (c[(c[n >> 2] | 0) + 268 >> 2] | 0) + (c[(c[n >> 2] | 0) + 276 >> 2] | 0) | 0;
                c[h >> 2] = ia() | 0;
                e = i;
                i = i + ((4 * a | 0) + 15 & -16) | 0;
                Ze(e | 0, (c[n >> 2] | 0) + 24 | 0, c[(c[n >> 2] | 0) + 276 >> 2] << 2 | 0) | 0;
                c[f >> 2] = (c[(c[n >> 2] | 0) + 296 >> 2] | 0) + 4;
                c[o >> 2] = c[(c[n >> 2] | 0) + 272 >> 2];
                while (1) {
                    if ((c[p >> 2] | 0) < (c[(c[n >> 2] | 0) + 268 >> 2] | 0)) {
                        d = c[p >> 2] | 0
                    } else {
                        d = c[(c[n >> 2] | 0) + 268 >> 2] | 0
                    }
                    c[g >> 2] = d;
                    fe(c[n >> 2] | 0, e + (c[(c[n >> 2] | 0) + 276 >> 2] << 2) | 0, c[k >> 2] | 0, c[(c[n >> 2] | 0) + 296 >> 2] | 0, c[g >> 2] | 0);
                    c[l >> 2] = c[g >> 2] << 16;
                    c[m >> 2] = je(c[m >> 2] | 0, e, c[f >> 2] | 0, c[(c[n >> 2] | 0) + 276 >> 2] | 0, c[(c[n >> 2] | 0) + 280 >> 2] | 0, c[l >> 2] | 0, c[o >> 2] | 0) | 0;
                    c[k >> 2] = (c[k >> 2] | 0) + (c[g >> 2] << 1);
                    c[p >> 2] = (c[p >> 2] | 0) - (c[g >> 2] | 0);
                    if ((c[p >> 2] | 0) <= 1) {
                        break
                    }
                    Ze(e | 0, e + (c[g >> 2] << 2) | 0, c[(c[n >> 2] | 0) + 276 >> 2] << 2 | 0) | 0
                }
                Ze((c[n >> 2] | 0) + 24 | 0, e + (c[g >> 2] << 2) | 0, c[(c[n >> 2] | 0) + 276 >> 2] << 2 | 0) | 0;
                na(c[h >> 2] | 0);
                i = j;

            }
            function je(a, d, e, f, g, h, j) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                var k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0;
                q = i;
                i = i + 48 | 0;
                r = q + 4 | 0;
                n = q + 16 | 0;
                s = q + 36 | 0;
                w = q;
                v = q + 32 | 0;
                k = q + 40 | 0;
                l = q + 44 | 0;
                o = q + 24 | 0;
                m = q + 20 | 0;
                p = q + 8 | 0;
                u = q + 12 | 0;
                t = q + 28 | 0;
                c[r >> 2] = a;
                c[n >> 2] = d;
                c[s >> 2] = e;
                c[w >> 2] = f;
                c[v >> 2] = g;
                c[k >> 2] = h;
                c[l >> 2] = j;
                j = c[w >> 2] | 0;
                if ((j | 0) == 18) {
                    c[o >> 2] = 0;
                    while (1) {
                        if ((c[o >> 2] | 0) >= (c[k >> 2] | 0)) {
                            break
                        }
                        c[p >> 2] = (c[n >> 2] | 0) + (c[o >> 2] >> 16 << 2);
                        w = $((c[o >> 2] & 65535) >> 16, (c[v >> 2] & 65535) << 16 >> 16) | 0;
                        c[u >> 2] = w + (($(c[o >> 2] & 65535, (c[v >> 2] & 65535) << 16 >> 16) | 0) >> 16);
                        c[t >> 2] = (c[s >> 2] | 0) + ((c[u >> 2] | 0) * 9 << 1);
                        w = $(c[c[p >> 2] >> 2] >> 16, b[c[t >> 2] >> 1] | 0) | 0;
                        c[m >> 2] = w + (($(c[c[p >> 2] >> 2] & 65535, b[c[t >> 2] >> 1] | 0) | 0) >> 16);
                        w = $(c[(c[p >> 2] | 0) + 4 >> 2] >> 16, b[(c[t >> 2] | 0) + 2 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 4 >> 2] & 65535, b[(c[t >> 2] | 0) + 2 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 8 >> 2] >> 16, b[(c[t >> 2] | 0) + 4 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 8 >> 2] & 65535, b[(c[t >> 2] | 0) + 4 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 12 >> 2] >> 16, b[(c[t >> 2] | 0) + 6 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 12 >> 2] & 65535, b[(c[t >> 2] | 0) + 6 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 16 >> 2] >> 16, b[(c[t >> 2] | 0) + 8 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 16 >> 2] & 65535, b[(c[t >> 2] | 0) + 8 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 20 >> 2] >> 16, b[(c[t >> 2] | 0) + 10 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 20 >> 2] & 65535, b[(c[t >> 2] | 0) + 10 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 24 >> 2] >> 16, b[(c[t >> 2] | 0) + 12 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 24 >> 2] & 65535, b[(c[t >> 2] | 0) + 12 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 28 >> 2] >> 16, b[(c[t >> 2] | 0) + 14 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 28 >> 2] & 65535, b[(c[t >> 2] | 0) + 14 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 32 >> 2] >> 16, b[(c[t >> 2] | 0) + 16 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 32 >> 2] & 65535, b[(c[t >> 2] | 0) + 16 >> 1] | 0) | 0) >> 16));
                        c[t >> 2] = (c[s >> 2] | 0) + (((c[v >> 2] | 0) - 1 - (c[u >> 2] | 0) | 0) * 9 << 1);
                        w = $(c[(c[p >> 2] | 0) + 68 >> 2] >> 16, b[c[t >> 2] >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 68 >> 2] & 65535, b[c[t >> 2] >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 64 >> 2] >> 16, b[(c[t >> 2] | 0) + 2 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 64 >> 2] & 65535, b[(c[t >> 2] | 0) + 2 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 60 >> 2] >> 16, b[(c[t >> 2] | 0) + 4 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 60 >> 2] & 65535, b[(c[t >> 2] | 0) + 4 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 56 >> 2] >> 16, b[(c[t >> 2] | 0) + 6 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 56 >> 2] & 65535, b[(c[t >> 2] | 0) + 6 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 52 >> 2] >> 16, b[(c[t >> 2] | 0) + 8 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 52 >> 2] & 65535, b[(c[t >> 2] | 0) + 8 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 48 >> 2] >> 16, b[(c[t >> 2] | 0) + 10 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 48 >> 2] & 65535, b[(c[t >> 2] | 0) + 10 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 44 >> 2] >> 16, b[(c[t >> 2] | 0) + 12 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 44 >> 2] & 65535, b[(c[t >> 2] | 0) + 12 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 40 >> 2] >> 16, b[(c[t >> 2] | 0) + 14 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 40 >> 2] & 65535, b[(c[t >> 2] | 0) + 14 >> 1] | 0) | 0) >> 16));
                        w = $(c[(c[p >> 2] | 0) + 36 >> 2] >> 16, b[(c[t >> 2] | 0) + 16 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($(c[(c[p >> 2] | 0) + 36 >> 2] & 65535, b[(c[t >> 2] | 0) + 16 >> 1] | 0) | 0) >> 16));
                        if (((c[m >> 2] >> 5) + 1 >> 1 | 0) <= 32767) {
                            if (((c[m >> 2] >> 5) + 1 >> 1 | 0) < -32768) {
                                j = -32768
                            } else {
                                j = (c[m >> 2] >> 5) + 1 >> 1
                            }
                        } else {
                            j = 32767
                        }
                        w = c[r >> 2] | 0;
                        c[r >> 2] = w + 2;
                        b[w >> 1] = j;
                        c[o >> 2] = (c[o >> 2] | 0) + (c[l >> 2] | 0)
                    }
                    w = c[r >> 2] | 0;
                    i = q;
                    return w | 0
                } else if ((j | 0) == 24) {
                    c[o >> 2] = 0;
                    while (1) {
                        if ((c[o >> 2] | 0) >= (c[k >> 2] | 0)) {
                            break
                        }
                        c[p >> 2] = (c[n >> 2] | 0) + (c[o >> 2] >> 16 << 2);
                        w = $((c[c[p >> 2] >> 2] | 0) + (c[(c[p >> 2] | 0) + 92 >> 2] | 0) >> 16, b[c[s >> 2] >> 1] | 0) | 0;
                        c[m >> 2] = w + (($((c[c[p >> 2] >> 2] | 0) + (c[(c[p >> 2] | 0) + 92 >> 2] | 0) & 65535, b[c[s >> 2] >> 1] | 0) | 0) >> 16);
                        w = $((c[(c[p >> 2] | 0) + 4 >> 2] | 0) + (c[(c[p >> 2] | 0) + 88 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 2 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 4 >> 2] | 0) + (c[(c[p >> 2] | 0) + 88 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 2 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 8 >> 2] | 0) + (c[(c[p >> 2] | 0) + 84 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 4 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 8 >> 2] | 0) + (c[(c[p >> 2] | 0) + 84 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 4 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 12 >> 2] | 0) + (c[(c[p >> 2] | 0) + 80 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 6 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 12 >> 2] | 0) + (c[(c[p >> 2] | 0) + 80 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 6 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 16 >> 2] | 0) + (c[(c[p >> 2] | 0) + 76 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 8 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 16 >> 2] | 0) + (c[(c[p >> 2] | 0) + 76 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 8 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 20 >> 2] | 0) + (c[(c[p >> 2] | 0) + 72 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 10 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 20 >> 2] | 0) + (c[(c[p >> 2] | 0) + 72 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 10 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 24 >> 2] | 0) + (c[(c[p >> 2] | 0) + 68 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 12 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 24 >> 2] | 0) + (c[(c[p >> 2] | 0) + 68 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 12 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 28 >> 2] | 0) + (c[(c[p >> 2] | 0) + 64 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 14 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 28 >> 2] | 0) + (c[(c[p >> 2] | 0) + 64 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 14 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 32 >> 2] | 0) + (c[(c[p >> 2] | 0) + 60 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 16 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 32 >> 2] | 0) + (c[(c[p >> 2] | 0) + 60 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 16 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 36 >> 2] | 0) + (c[(c[p >> 2] | 0) + 56 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 18 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 36 >> 2] | 0) + (c[(c[p >> 2] | 0) + 56 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 18 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 40 >> 2] | 0) + (c[(c[p >> 2] | 0) + 52 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 20 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 40 >> 2] | 0) + (c[(c[p >> 2] | 0) + 52 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 20 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 44 >> 2] | 0) + (c[(c[p >> 2] | 0) + 48 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 22 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 44 >> 2] | 0) + (c[(c[p >> 2] | 0) + 48 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 22 >> 1] | 0) | 0) >> 16));
                        if (((c[m >> 2] >> 5) + 1 >> 1 | 0) <= 32767) {
                            if (((c[m >> 2] >> 5) + 1 >> 1 | 0) < -32768) {
                                t = -32768
                            } else {
                                t = (c[m >> 2] >> 5) + 1 >> 1
                            }
                        } else {
                            t = 32767
                        }
                        w = c[r >> 2] | 0;
                        c[r >> 2] = w + 2;
                        b[w >> 1] = t;
                        c[o >> 2] = (c[o >> 2] | 0) + (c[l >> 2] | 0)
                    }
                    w = c[r >> 2] | 0;
                    i = q;
                    return w | 0
                } else if ((j | 0) == 36) {
                    c[o >> 2] = 0;
                    while (1) {
                        if ((c[o >> 2] | 0) >= (c[k >> 2] | 0)) {
                            break
                        }
                        c[p >> 2] = (c[n >> 2] | 0) + (c[o >> 2] >> 16 << 2);
                        w = $((c[c[p >> 2] >> 2] | 0) + (c[(c[p >> 2] | 0) + 140 >> 2] | 0) >> 16, b[c[s >> 2] >> 1] | 0) | 0;
                        c[m >> 2] = w + (($((c[c[p >> 2] >> 2] | 0) + (c[(c[p >> 2] | 0) + 140 >> 2] | 0) & 65535, b[c[s >> 2] >> 1] | 0) | 0) >> 16);
                        w = $((c[(c[p >> 2] | 0) + 4 >> 2] | 0) + (c[(c[p >> 2] | 0) + 136 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 2 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 4 >> 2] | 0) + (c[(c[p >> 2] | 0) + 136 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 2 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 8 >> 2] | 0) + (c[(c[p >> 2] | 0) + 132 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 4 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 8 >> 2] | 0) + (c[(c[p >> 2] | 0) + 132 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 4 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 12 >> 2] | 0) + (c[(c[p >> 2] | 0) + 128 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 6 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 12 >> 2] | 0) + (c[(c[p >> 2] | 0) + 128 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 6 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 16 >> 2] | 0) + (c[(c[p >> 2] | 0) + 124 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 8 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 16 >> 2] | 0) + (c[(c[p >> 2] | 0) + 124 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 8 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 20 >> 2] | 0) + (c[(c[p >> 2] | 0) + 120 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 10 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 20 >> 2] | 0) + (c[(c[p >> 2] | 0) + 120 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 10 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 24 >> 2] | 0) + (c[(c[p >> 2] | 0) + 116 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 12 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 24 >> 2] | 0) + (c[(c[p >> 2] | 0) + 116 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 12 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 28 >> 2] | 0) + (c[(c[p >> 2] | 0) + 112 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 14 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 28 >> 2] | 0) + (c[(c[p >> 2] | 0) + 112 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 14 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 32 >> 2] | 0) + (c[(c[p >> 2] | 0) + 108 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 16 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 32 >> 2] | 0) + (c[(c[p >> 2] | 0) + 108 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 16 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 36 >> 2] | 0) + (c[(c[p >> 2] | 0) + 104 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 18 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 36 >> 2] | 0) + (c[(c[p >> 2] | 0) + 104 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 18 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 40 >> 2] | 0) + (c[(c[p >> 2] | 0) + 100 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 20 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 40 >> 2] | 0) + (c[(c[p >> 2] | 0) + 100 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 20 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 44 >> 2] | 0) + (c[(c[p >> 2] | 0) + 96 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 22 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 44 >> 2] | 0) + (c[(c[p >> 2] | 0) + 96 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 22 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 48 >> 2] | 0) + (c[(c[p >> 2] | 0) + 92 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 24 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 48 >> 2] | 0) + (c[(c[p >> 2] | 0) + 92 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 24 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 52 >> 2] | 0) + (c[(c[p >> 2] | 0) + 88 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 26 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 52 >> 2] | 0) + (c[(c[p >> 2] | 0) + 88 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 26 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 56 >> 2] | 0) + (c[(c[p >> 2] | 0) + 84 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 28 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 56 >> 2] | 0) + (c[(c[p >> 2] | 0) + 84 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 28 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 60 >> 2] | 0) + (c[(c[p >> 2] | 0) + 80 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 30 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 60 >> 2] | 0) + (c[(c[p >> 2] | 0) + 80 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 30 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 64 >> 2] | 0) + (c[(c[p >> 2] | 0) + 76 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 32 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 64 >> 2] | 0) + (c[(c[p >> 2] | 0) + 76 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 32 >> 1] | 0) | 0) >> 16));
                        w = $((c[(c[p >> 2] | 0) + 68 >> 2] | 0) + (c[(c[p >> 2] | 0) + 72 >> 2] | 0) >> 16, b[(c[s >> 2] | 0) + 34 >> 1] | 0) | 0;
                        c[m >> 2] = (c[m >> 2] | 0) + (w + (($((c[(c[p >> 2] | 0) + 68 >> 2] | 0) + (c[(c[p >> 2] | 0) + 72 >> 2] | 0) & 65535, b[(c[s >> 2] | 0) + 34 >> 1] | 0) | 0) >> 16));
                        if (((c[m >> 2] >> 5) + 1 >> 1 | 0) <= 32767) {
                            if (((c[m >> 2] >> 5) + 1 >> 1 | 0) < -32768) {
                                t = -32768
                            } else {
                                t = (c[m >> 2] >> 5) + 1 >> 1
                            }
                        } else {
                            t = 32767
                        }
                        w = c[r >> 2] | 0;
                        c[r >> 2] = w + 2;
                        b[w >> 1] = t;
                        c[o >> 2] = (c[o >> 2] | 0) + (c[l >> 2] | 0)
                    }
                    w = c[r >> 2] | 0;
                    i = q;
                    return w | 0
                } else {
                    w = c[r >> 2] | 0;
                    i = q;
                    return w | 0
                }
                return 0
            }
            function ke(a, d, e, f) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0;
                o = i;
                i = i + 48 | 0;
                l = o;
                m = o + 16 | 0;
                q = o + 28 | 0;
                r = o + 4 | 0;
                j = o + 32 | 0;
                k = o + 36 | 0;
                h = o + 12 | 0;
                p = o + 24 | 0;
                g = o + 20 | 0;
                n = o + 8 | 0;
                c[l >> 2] = a;
                c[m >> 2] = d;
                c[q >> 2] = e;
                c[r >> 2] = f;
                c[j >> 2] = 0;
                while (1) {
                    if ((c[j >> 2] | 0) >= (c[r >> 2] | 0)) {
                        break
                    }
                    c[k >> 2] = b[(c[q >> 2] | 0) + (c[j >> 2] << 1) >> 1] << 10;
                    c[g >> 2] = (c[k >> 2] | 0) - (c[c[l >> 2] >> 2] | 0);
                    a = $(c[g >> 2] >> 16, b[7608] | 0) | 0;
                    c[n >> 2] = a + (($(c[g >> 2] & 65535, b[7608] | 0) | 0) >> 16);
                    c[h >> 2] = (c[c[l >> 2] >> 2] | 0) + (c[n >> 2] | 0);
                    c[c[l >> 2] >> 2] = (c[k >> 2] | 0) + (c[n >> 2] | 0);
                    c[g >> 2] = (c[h >> 2] | 0) - (c[(c[l >> 2] | 0) + 4 >> 2] | 0);
                    a = $(c[g >> 2] >> 16, b[15218 >> 1] | 0) | 0;
                    c[n >> 2] = a + (($(c[g >> 2] & 65535, b[15218 >> 1] | 0) | 0) >> 16);
                    c[p >> 2] = (c[(c[l >> 2] | 0) + 4 >> 2] | 0) + (c[n >> 2] | 0);
                    c[(c[l >> 2] | 0) + 4 >> 2] = (c[h >> 2] | 0) + (c[n >> 2] | 0);
                    c[g >> 2] = (c[p >> 2] | 0) - (c[(c[l >> 2] | 0) + 8 >> 2] | 0);
                    a = $(c[g >> 2] >> 16, b[15220 >> 1] | 0) | 0;
                    c[n >> 2] = (c[g >> 2] | 0) + (a + (($(c[g >> 2] & 65535, b[15220 >> 1] | 0) | 0) >> 16));
                    c[h >> 2] = (c[(c[l >> 2] | 0) + 8 >> 2] | 0) + (c[n >> 2] | 0);
                    c[(c[l >> 2] | 0) + 8 >> 2] = (c[p >> 2] | 0) + (c[n >> 2] | 0);
                    if (((c[h >> 2] >> 9) + 1 >> 1 | 0) <= 32767) {
                        if (((c[h >> 2] >> 9) + 1 >> 1 | 0) < -32768) {
                            f = -32768
                        } else {
                            f = (c[h >> 2] >> 9) + 1 >> 1
                        }
                    } else {
                        f = 32767
                    }
                    b[(c[m >> 2] | 0) + (c[j >> 2] << 1 << 1) >> 1] = f;
                    c[g >> 2] = (c[k >> 2] | 0) - (c[(c[l >> 2] | 0) + 12 >> 2] | 0);
                    a = $(c[g >> 2] >> 16, b[7612] | 0) | 0;
                    c[n >> 2] = a + (($(c[g >> 2] & 65535, b[7612] | 0) | 0) >> 16);
                    c[h >> 2] = (c[(c[l >> 2] | 0) + 12 >> 2] | 0) + (c[n >> 2] | 0);
                    c[(c[l >> 2] | 0) + 12 >> 2] = (c[k >> 2] | 0) + (c[n >> 2] | 0);
                    c[g >> 2] = (c[h >> 2] | 0) - (c[(c[l >> 2] | 0) + 16 >> 2] | 0);
                    a = $(c[g >> 2] >> 16, b[15226 >> 1] | 0) | 0;
                    c[n >> 2] = a + (($(c[g >> 2] & 65535, b[15226 >> 1] | 0) | 0) >> 16);
                    c[p >> 2] = (c[(c[l >> 2] | 0) + 16 >> 2] | 0) + (c[n >> 2] | 0);
                    c[(c[l >> 2] | 0) + 16 >> 2] = (c[h >> 2] | 0) + (c[n >> 2] | 0);
                    c[g >> 2] = (c[p >> 2] | 0) - (c[(c[l >> 2] | 0) + 20 >> 2] | 0);
                    a = $(c[g >> 2] >> 16, b[15228 >> 1] | 0) | 0;
                    c[n >> 2] = (c[g >> 2] | 0) + (a + (($(c[g >> 2] & 65535, b[15228 >> 1] | 0) | 0) >> 16));
                    c[h >> 2] = (c[(c[l >> 2] | 0) + 20 >> 2] | 0) + (c[n >> 2] | 0);
                    c[(c[l >> 2] | 0) + 20 >> 2] = (c[p >> 2] | 0) + (c[n >> 2] | 0);
                    if (((c[h >> 2] >> 9) + 1 >> 1 | 0) <= 32767) {
                        if (((c[h >> 2] >> 9) + 1 >> 1 | 0) < -32768) {
                            f = -32768
                        } else {
                            f = (c[h >> 2] >> 9) + 1 >> 1
                        }
                    } else {
                        f = 32767
                    }
                    b[(c[m >> 2] | 0) + ((c[j >> 2] << 1) + 1 << 1) >> 1] = f;
                    c[j >> 2] = (c[j >> 2] | 0) + 1
                }
                i = o;

            }
            function le(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                f = i;
                i = i + 32 | 0;
                l = f + 16 | 0;
                j = f + 12 | 0;
                h = f + 8 | 0;
                g = f + 4 | 0;
                k = f;
                c[l >> 2] = a;
                c[j >> 2] = b;
                c[h >> 2] = d;
                c[g >> 2] = e;
                c[k >> 2] = c[l >> 2];
                ke(c[k >> 2] | 0, c[j >> 2] | 0, c[h >> 2] | 0, c[g >> 2] | 0);
                i = f;

            }
            function me(a, d, e) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0;
                f = i;
                i = i + 48 | 0;
                j = f + 8 | 0;
                h = f + 4 | 0;
                m = f;
                l = f + 40 | 0;
                k = f + 32 | 0;
                g = f + 16 | 0;
                c[j >> 2] = a;
                c[h >> 2] = d;
                c[m >> 2] = e;
                ne(l, l + 2 | 0, c[h >> 2] | 0, c[m >> 2] | 0, 19160);
                ne(k, k + 2 | 0, c[h >> 2] | 0, b[l >> 1] | 0, 19008);
                ne(g, g + 2 | 0, c[h >> 2] | 0, b[k >> 1] | 0, 18856);
                ne(c[j >> 2] | 0, (c[j >> 2] | 0) + 2 | 0, c[h >> 2] | 0, b[g >> 1] | 0, 18704);
                ne((c[j >> 2] | 0) + 4 | 0, (c[j >> 2] | 0) + 6 | 0, c[h >> 2] | 0, b[g + 2 >> 1] | 0, 18704);
                ne(g + 4 | 0, g + 6 | 0, c[h >> 2] | 0, b[k + 2 >> 1] | 0, 18856);
                ne((c[j >> 2] | 0) + 8 | 0, (c[j >> 2] | 0) + 10 | 0, c[h >> 2] | 0, b[g + 4 >> 1] | 0, 18704);
                ne((c[j >> 2] | 0) + 12 | 0, (c[j >> 2] | 0) + 14 | 0, c[h >> 2] | 0, b[g + 6 >> 1] | 0, 18704);
                ne(k + 4 | 0, k + 6 | 0, c[h >> 2] | 0, b[l + 2 >> 1] | 0, 19008);
                ne(g + 8 | 0, g + 10 | 0, c[h >> 2] | 0, b[k + 4 >> 1] | 0, 18856);
                ne((c[j >> 2] | 0) + 16 | 0, (c[j >> 2] | 0) + 18 | 0, c[h >> 2] | 0, b[g + 8 >> 1] | 0, 18704);
                ne((c[j >> 2] | 0) + 20 | 0, (c[j >> 2] | 0) + 22 | 0, c[h >> 2] | 0, b[g + 10 >> 1] | 0, 18704);
                ne(g + 12 | 0, g + 14 | 0, c[h >> 2] | 0, b[k + 6 >> 1] | 0, 18856);
                ne((c[j >> 2] | 0) + 24 | 0, (c[j >> 2] | 0) + 26 | 0, c[h >> 2] | 0, b[g + 12 >> 1] | 0, 18704);
                ne((c[j >> 2] | 0) + 28 | 0, (c[j >> 2] | 0) + 30 | 0, c[h >> 2] | 0, b[g + 14 >> 1] | 0, 18704);
                i = f;

            }
            function ne(a, e, f, g, h) {
                a = a | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0;
                n = i;
                i = i + 32 | 0;
                l = n + 16 | 0;
                k = n + 12 | 0;
                o = n + 8 | 0;
                m = n + 4 | 0;
                j = n;
                c[l >> 2] = a;
                c[k >> 2] = e;
                c[o >> 2] = f;
                c[m >> 2] = g;
                c[j >> 2] = h;
                if ((c[m >> 2] | 0) > 0) {
                    a = (Pb(c[o >> 2] | 0, (c[j >> 2] | 0) + (d[19312 + (c[m >> 2] | 0) >> 0] | 0) | 0, 8) | 0) & 65535;
                    b[c[l >> 2] >> 1] = a;
                    b[c[k >> 2] >> 1] = (c[m >> 2] | 0) - (b[c[l >> 2] >> 1] | 0);
                    i = n;

                } else {
                    b[c[l >> 2] >> 1] = 0;
                    b[c[k >> 2] >> 1] = 0;
                    i = n;

                }
            }
            function oe(a, d) {
                a = a | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0;
                e = i;
                i = i + 32 | 0;
                f = e + 16 | 0;
                k = e + 12 | 0;
                h = e + 8 | 0;
                g = e + 4 | 0;
                j = e;
                c[f >> 2] = a;
                c[k >> 2] = d;
                c[g >> 2] = 1;
                while (1) {
                    if ((c[g >> 2] | 0) >= (c[k >> 2] | 0)) {
                        break
                    }
                    c[h >> 2] = b[(c[f >> 2] | 0) + (c[g >> 2] << 1) >> 1] | 0;
                    c[j >> 2] = (c[g >> 2] | 0) - 1;
                    while (1) {
                        if ((c[j >> 2] | 0) < 0) {
                            break
                        }
                        if ((c[h >> 2] | 0) >= (b[(c[f >> 2] | 0) + (c[j >> 2] << 1) >> 1] | 0)) {
                            break
                        }
                        b[(c[f >> 2] | 0) + ((c[j >> 2] | 0) + 1 << 1) >> 1] = b[(c[f >> 2] | 0) + (c[j >> 2] << 1) >> 1] | 0;
                        c[j >> 2] = (c[j >> 2] | 0) + -1
                    }
                    b[(c[f >> 2] | 0) + ((c[j >> 2] | 0) + 1 << 1) >> 1] = c[h >> 2];
                    c[g >> 2] = (c[g >> 2] | 0) + 1
                }
                i = e;

            }
            function pe(a, d, e, f, g, h) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0,
                    x = 0;
                k = i;
                i = i + 64 | 0;
                q = k + 24 | 0;
                p = k + 20 | 0;
                l = k + 44 | 0;
                t = k + 36 | 0;
                u = k + 32 | 0;
                j = k + 40 | 0;
                o = k + 48 | 0;
                x = k + 52 | 0;
                v = k + 8 | 0;
                w = k + 4 | 0;
                m = k + 28 | 0;
                n = k + 12 | 0;
                r = k;
                s = k + 16 | 0;
                c[q >> 2] = a;
                c[p >> 2] = d;
                c[l >> 2] = e;
                c[t >> 2] = f;
                c[u >> 2] = g;
                c[j >> 2] = h;
                a = c[p >> 2] | 0;
                d = (c[q >> 2] | 0) + 4 | 0;
                b[a + 0 >> 1] = b[d + 0 >> 1] | 0;
                b[a + 2 >> 1] = b[d + 2 >> 1] | 0;
                a = c[l >> 2] | 0;
                d = (c[q >> 2] | 0) + 8 | 0;
                b[a + 0 >> 1] = b[d + 0 >> 1] | 0;
                b[a + 2 >> 1] = b[d + 2 >> 1] | 0;
                a = (c[q >> 2] | 0) + 4 | 0;
                d = (c[p >> 2] | 0) + (c[j >> 2] << 1) | 0;
                b[a + 0 >> 1] = b[d + 0 >> 1] | 0;
                b[a + 2 >> 1] = b[d + 2 >> 1] | 0;
                a = (c[q >> 2] | 0) + 8 | 0;
                d = (c[l >> 2] | 0) + (c[j >> 2] << 1) | 0;
                b[a + 0 >> 1] = b[d + 0 >> 1] | 0;
                b[a + 2 >> 1] = b[d + 2 >> 1] | 0;
                c[r >> 2] = b[c[q >> 2] >> 1] | 0;
                c[s >> 2] = b[(c[q >> 2] | 0) + 2 >> 1] | 0;
                c[x >> 2] = 65536 / (c[u >> 2] << 3 | 0) | 0;
                c[v >> 2] = (($(((c[c[t >> 2] >> 2] | 0) - (b[c[q >> 2] >> 1] | 0) & 65535) << 16 >> 16, (c[x >> 2] & 65535) << 16 >> 16) | 0) >> 15) + 1 >> 1;
                c[w >> 2] = (($(((c[(c[t >> 2] | 0) + 4 >> 2] | 0) - (b[(c[q >> 2] | 0) + 2 >> 1] | 0) & 65535) << 16 >> 16, (c[x >> 2] & 65535) << 16 >> 16) | 0) >> 15) + 1 >> 1;
                c[o >> 2] = 0;
                while (1) {
                    if ((c[o >> 2] | 0) >= (c[u >> 2] << 3 | 0)) {
                        break
                    }
                    c[r >> 2] = (c[r >> 2] | 0) + (c[v >> 2] | 0);
                    c[s >> 2] = (c[s >> 2] | 0) + (c[w >> 2] | 0);
                    c[m >> 2] = (b[(c[p >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0) + (b[(c[p >> 2] | 0) + ((c[o >> 2] | 0) + 2 << 1) >> 1] | 0) + (b[(c[p >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] << 1) << 9;
                    x = $(c[m >> 2] >> 16, (c[r >> 2] & 65535) << 16 >> 16) | 0;
                    c[m >> 2] = (b[(c[l >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] << 8) + (x + (($(c[m >> 2] & 65535, (c[r >> 2] & 65535) << 16 >> 16) | 0) >> 16));
                    x = $(b[(c[p >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] << 11 >> 16, (c[s >> 2] & 65535) << 16 >> 16) | 0;
                    c[m >> 2] = (c[m >> 2] | 0) + (x + (($(b[(c[p >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] << 11 & 65535, (c[s >> 2] & 65535) << 16 >> 16) | 0) >> 16));
                    if (((c[m >> 2] >> 7) + 1 >> 1 | 0) <= 32767) {
                        if (((c[m >> 2] >> 7) + 1 >> 1 | 0) < -32768) {
                            h = -32768
                        } else {
                            h = (c[m >> 2] >> 7) + 1 >> 1
                        }
                    } else {
                        h = 32767
                    }
                    b[(c[l >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] = h;
                    c[o >> 2] = (c[o >> 2] | 0) + 1
                }
                c[r >> 2] = c[c[t >> 2] >> 2];
                c[s >> 2] = c[(c[t >> 2] | 0) + 4 >> 2];
                c[o >> 2] = c[u >> 2] << 3;
                while (1) {
                    if ((c[o >> 2] | 0) >= (c[j >> 2] | 0)) {
                        break
                    }
                    c[m >> 2] = (b[(c[p >> 2] | 0) + (c[o >> 2] << 1) >> 1] | 0) + (b[(c[p >> 2] | 0) + ((c[o >> 2] | 0) + 2 << 1) >> 1] | 0) + (b[(c[p >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] << 1) << 9;
                    x = $(c[m >> 2] >> 16, (c[r >> 2] & 65535) << 16 >> 16) | 0;
                    c[m >> 2] = (b[(c[l >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] << 8) + (x + (($(c[m >> 2] & 65535, (c[r >> 2] & 65535) << 16 >> 16) | 0) >> 16));
                    x = $(b[(c[p >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] << 11 >> 16, (c[s >> 2] & 65535) << 16 >> 16) | 0;
                    c[m >> 2] = (c[m >> 2] | 0) + (x + (($(b[(c[p >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] << 11 & 65535, (c[s >> 2] & 65535) << 16 >> 16) | 0) >> 16));
                    if (((c[m >> 2] >> 7) + 1 >> 1 | 0) <= 32767) {
                        if (((c[m >> 2] >> 7) + 1 >> 1 | 0) < -32768) {
                            u = -32768
                        } else {
                            u = (c[m >> 2] >> 7) + 1 >> 1
                        }
                    } else {
                        u = 32767
                    }
                    b[(c[l >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] = u;
                    c[o >> 2] = (c[o >> 2] | 0) + 1
                }
                b[c[q >> 2] >> 1] = c[c[t >> 2] >> 2];
                b[(c[q >> 2] | 0) + 2 >> 1] = c[(c[t >> 2] | 0) + 4 >> 2];
                c[o >> 2] = 0;
                while (1) {
                    if ((c[o >> 2] | 0) >= (c[j >> 2] | 0)) {
                        break
                    }
                    c[m >> 2] = (b[(c[p >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] | 0) + (b[(c[l >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] | 0);
                    c[n >> 2] = (b[(c[p >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] | 0) - (b[(c[l >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] | 0);
                    if ((c[m >> 2] | 0) > 32767) {
                        q = 32767
                    } else {
                        q = (c[m >> 2] | 0) < -32768 ? -32768 : c[m >> 2] | 0
                    }
                    b[(c[p >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] = q;
                    if ((c[n >> 2] | 0) > 32767) {
                        q = 32767
                    } else {
                        q = (c[n >> 2] | 0) < -32768 ? -32768 : c[n >> 2] | 0
                    }
                    b[(c[l >> 2] | 0) + ((c[o >> 2] | 0) + 1 << 1) >> 1] = q;
                    c[o >> 2] = (c[o >> 2] | 0) + 1
                }
                i = k;

            }
            function qe(a, d) {
                a = a | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                f = i;
                i = i + 48 | 0;
                l = f + 40 | 0;
                e = f + 36 | 0;
                g = f + 32 | 0;
                h = f + 8 | 0;
                j = f + 4 | 0;
                k = f;
                c[l >> 2] = a;
                c[e >> 2] = d;
                c[g >> 2] = Pb(c[l >> 2] | 0, 18192, 8) | 0;
                c[h + 8 >> 2] = (c[g >> 2] | 0) / 5 | 0;
                c[h + 20 >> 2] = (c[g >> 2] | 0) - ((c[h + 8 >> 2] | 0) * 5 | 0);
                c[g >> 2] = 0;
                while (1) {
                    if ((c[g >> 2] | 0) >= 2) {
                        break
                    }
                    a = Pb(c[l >> 2] | 0, 18312, 8) | 0;
                    c[h + ((c[g >> 2] | 0) * 12 | 0) >> 2] = a;
                    a = Pb(c[l >> 2] | 0, 18328, 8) | 0;
                    c[h + ((c[g >> 2] | 0) * 12 | 0) + 4 >> 2] = a;
                    c[g >> 2] = (c[g >> 2] | 0) + 1
                }
                c[g >> 2] = 0;
                while (1) {
                    if ((c[g >> 2] | 0) >= 2) {
                        break
                    }
                    a = h + ((c[g >> 2] | 0) * 12 | 0) | 0;
                    c[a >> 2] = (c[a >> 2] | 0) + ((c[h + ((c[g >> 2] | 0) * 12 | 0) + 8 >> 2] | 0) * 3 | 0);
                    c[j >> 2] = b[18160 + (c[h + ((c[g >> 2] | 0) * 12 | 0) >> 2] << 1) >> 1] | 0;
                    c[k >> 2] = (((b[18160 + ((c[h + ((c[g >> 2] | 0) * 12 | 0) >> 2] | 0) + 1 << 1) >> 1] | 0) - (c[j >> 2] | 0) >> 16) * 6554 | 0) + (((b[18160 + ((c[h + ((c[g >> 2] | 0) * 12 | 0) >> 2] | 0) + 1 << 1) >> 1] | 0) - (c[j >> 2] | 0) & 65535) * 6554 >> 16);
                    a = (c[j >> 2] | 0) + ($((c[k >> 2] & 65535) << 16 >> 16, ((c[h + ((c[g >> 2] | 0) * 12 | 0) + 4 >> 2] << 1) + 1 & 65535) << 16 >> 16) | 0) | 0;
                    c[(c[e >> 2] | 0) + (c[g >> 2] << 2) >> 2] = a;
                    c[g >> 2] = (c[g >> 2] | 0) + 1
                }
                a = c[e >> 2] | 0;
                c[a >> 2] = (c[a >> 2] | 0) - (c[(c[e >> 2] | 0) + 4 >> 2] | 0);
                i = f;

            }
            function re(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0;
                d = i;
                i = i + 16 | 0;
                f = d + 4 | 0;
                e = d;
                c[f >> 2] = a;
                c[e >> 2] = b;
                a = Pb(c[f >> 2] | 0, 18224, 8) | 0;
                c[c[e >> 2] >> 2] = a;
                i = d;

            }
            function se(a, d, e, f) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0;
                l = i;
                i = i + 32 | 0;
                k = l + 4 | 0;
                h = l + 16 | 0;
                m = l + 8 | 0;
                p = l + 20 | 0;
                g = l + 28 | 0;
                n = l;
                o = l + 12 | 0;
                j = l + 24 | 0;
                c[k >> 2] = a;
                c[h >> 2] = d;
                c[m >> 2] = e;
                c[p >> 2] = f;
                c[j >> 2] = 0;
                c[n >> 2] = 0;
                c[p >> 2] = (c[p >> 2] | 0) + -1;
                c[g >> 2] = 0;
                while (1) {
                    if ((c[g >> 2] | 0) >= (c[p >> 2] | 0)) {
                        break
                    }
                    c[j >> 2] = (c[j >> 2] | 0) + ($(b[(c[m >> 2] | 0) + (c[g >> 2] << 1) >> 1] | 0, b[(c[m >> 2] | 0) + (c[g >> 2] << 1) >> 1] | 0) | 0);
                    c[j >> 2] = (c[j >> 2] | 0) + ($(b[(c[m >> 2] | 0) + ((c[g >> 2] | 0) + 1 << 1) >> 1] | 0, b[(c[m >> 2] | 0) + ((c[g >> 2] | 0) + 1 << 1) >> 1] | 0) | 0);
                    if ((c[j >> 2] | 0) < 0) {
                        q = 4;
                        break
                    }
                    c[g >> 2] = (c[g >> 2] | 0) + 2
                }
                if ((q | 0) == 4) {
                    c[j >> 2] = (c[j >> 2] | 0) >>> 2;
                    c[n >> 2] = 2;
                    c[g >> 2] = (c[g >> 2] | 0) + 2
                }
                while (1) {
                    q = c[g >> 2] | 0;
                    if ((c[g >> 2] | 0) >= (c[p >> 2] | 0)) {
                        break
                    }
                    c[o >> 2] = $(b[(c[m >> 2] | 0) + (q << 1) >> 1] | 0, b[(c[m >> 2] | 0) + (c[g >> 2] << 1) >> 1] | 0) | 0;
                    c[o >> 2] = (c[o >> 2] | 0) + ($(b[(c[m >> 2] | 0) + ((c[g >> 2] | 0) + 1 << 1) >> 1] | 0, b[(c[m >> 2] | 0) + ((c[g >> 2] | 0) + 1 << 1) >> 1] | 0) | 0);
                    c[j >> 2] = (c[j >> 2] | 0) + ((c[o >> 2] | 0) >>> (c[n >> 2] | 0));
                    if ((c[j >> 2] | 0) < 0) {
                        c[j >> 2] = (c[j >> 2] | 0) >>> 2;
                        c[n >> 2] = (c[n >> 2] | 0) + 2
                    }
                    c[g >> 2] = (c[g >> 2] | 0) + 2
                }
                if ((q | 0) == (c[p >> 2] | 0)) {
                    c[o >> 2] = $(b[(c[m >> 2] | 0) + (c[g >> 2] << 1) >> 1] | 0, b[(c[m >> 2] | 0) + (c[g >> 2] << 1) >> 1] | 0) | 0;
                    c[j >> 2] = (c[j >> 2] | 0) + (c[o >> 2] >> c[n >> 2])
                }
                if ((c[j >> 2] & -1073741824 | 0) == 0) {
                    a = c[n >> 2] | 0;
                    d = c[h >> 2] | 0;
                    c[d >> 2] = a;
                    d = c[j >> 2] | 0;
                    a = c[k >> 2] | 0;
                    c[a >> 2] = d;
                    i = l;
                    return
                }
                c[j >> 2] = (c[j >> 2] | 0) >>> 2;
                c[n >> 2] = (c[n >> 2] | 0) + 2;
                a = c[n >> 2] | 0;
                d = c[h >> 2] | 0;
                c[d >> 2] = a;
                d = c[j >> 2] | 0;
                a = c[k >> 2] | 0;
                c[a >> 2] = d;
                i = l;

            }
            function te(b, e) {
                b = b | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0;
                g = i;
                i = i + 16 | 0;
                j = g + 8 | 0;
                h = g + 4 | 0;
                f = g;
                c[j >> 2] = b;
                c[h >> 2] = e;
                b = d[c[j >> 2] >> 0] | 0;
                if ((a[c[j >> 2] >> 0] & 128 | 0) != 0) {
                    c[f >> 2] = b >> 3 & 3;
                    c[f >> 2] = (c[h >> 2] << c[f >> 2] | 0) / 400 | 0;
                    e = c[f >> 2] | 0;
                    i = g;
                    return e | 0
                }
                j = d[c[j >> 2] >> 0] | 0;
                if ((b & 96 | 0) != 96) {
                    c[f >> 2] = j >> 3 & 3;
                    h = c[h >> 2] | 0;
                    if ((c[f >> 2] | 0) == 3) {
                        c[f >> 2] = (h * 60 | 0) / 1e3 | 0;
                        e = c[f >> 2] | 0;
                        i = g;
                        return e | 0
                    } else {
                        c[f >> 2] = (h << c[f >> 2] | 0) / 100 | 0;
                        e = c[f >> 2] | 0;
                        i = g;
                        return e | 0
                    }
                } else {
                    h = c[h >> 2] | 0;
                    if ((j & 8 | 0) != 0) {
                        h = (h | 0) / 50 | 0
                    } else {
                        h = (h | 0) / 100 | 0
                    }
                    c[f >> 2] = h;
                    e = c[f >> 2] | 0;
                    i = g;
                    return e | 0
                }
                return 0
            }
            function ue(e, f, g, h, j, k, l, m) {
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                m = m | 0;
                var n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0,
                    B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0;
                D = i;
                i = i + 80 | 0;
                p = D + 36 | 0;
                r = D + 24 | 0;
                B = D + 44 | 0;
                E = D + 60 | 0;
                n = D + 12 | 0;
                s = D + 16 | 0;
                v = D + 48 | 0;
                x = D + 56 | 0;
                q = D + 64 | 0;
                t = D + 68 | 0;
                y = D + 72 | 0;
                u = D + 8 | 0;
                C = D;
                G = D + 76 | 0;
                F = D + 77 | 0;
                J = D + 20 | 0;
                z = D + 52 | 0;
                A = D + 28 | 0;
                w = D + 32 | 0;
                H = D + 40 | 0;
                I = D + 4 | 0;
                c[r >> 2] = e;
                c[B >> 2] = f;
                c[E >> 2] = g;
                c[n >> 2] = h;
                c[s >> 2] = j;
                c[v >> 2] = k;
                c[x >> 2] = l;
                c[q >> 2] = m;
                c[A >> 2] = 0;
                c[w >> 2] = c[r >> 2];
                if ((c[v >> 2] | 0) == 0) {
                    c[p >> 2] = -1;
                    e = c[p >> 2] | 0;
                    i = D;
                    return e | 0
                }
                c[J >> 2] = te(c[r >> 2] | 0, 48e3) | 0;
                c[C >> 2] = 0;
                m = c[r >> 2] | 0;
                c[r >> 2] = m + 1;
                a[F >> 0] = a[m >> 0] | 0;
                c[B >> 2] = (c[B >> 2] | 0) + -1;
                c[z >> 2] = c[B >> 2];
                m = a[F >> 0] & 3;
                a:do {
                    if ((m | 0) == 1) {
                        c[u >> 2] = 2;
                        c[C >> 2] = 1;
                        if ((c[E >> 2] | 0) == 0) {
                            if ((c[B >> 2] & 1 | 0) == 0) {
                                c[z >> 2] = (c[B >> 2] | 0) / 2 | 0;
                                b[c[v >> 2] >> 1] = c[z >> 2];
                                break
                            }
                            c[p >> 2] = -4;
                            e = c[p >> 2] | 0;
                            i = D;
                            return e | 0
                        }
                    } else if ((m | 0) == 2) {
                        c[u >> 2] = 2;
                        c[y >> 2] = ve(c[r >> 2] | 0, c[B >> 2] | 0, c[v >> 2] | 0) | 0;
                        c[B >> 2] = (c[B >> 2] | 0) - (c[y >> 2] | 0);
                        if ((b[c[v >> 2] >> 1] | 0) >= 0 ? (b[c[v >> 2] >> 1] | 0) <= (c[B >> 2] | 0) : 0) {
                            c[r >> 2] = (c[r >> 2] | 0) + (c[y >> 2] | 0);
                            c[z >> 2] = (c[B >> 2] | 0) - (b[c[v >> 2] >> 1] | 0);
                            break
                        }
                        c[p >> 2] = -4;
                        e = c[p >> 2] | 0;
                        i = D;
                        return e | 0
                    } else if ((m | 0) == 0) {
                        c[u >> 2] = 1
                    } else {
                        if ((c[B >> 2] | 0) < 1) {
                            c[p >> 2] = -4;
                            e = c[p >> 2] | 0;
                            i = D;
                            return e | 0
                        }
                        e = c[r >> 2] | 0;
                        c[r >> 2] = e + 1;
                        a[G >> 0] = a[e >> 0] | 0;
                        c[u >> 2] = a[G >> 0] & 63;
                        if ((c[u >> 2] | 0) > 0 ? ($(c[J >> 2] | 0, c[u >> 2] | 0) | 0) <= 5760 : 0) {
                            c[B >> 2] = (c[B >> 2] | 0) + -1;
                            b:do {
                                if ((a[G >> 0] & 64 | 0) != 0) {
                                    while (1) {
                                        if ((c[B >> 2] | 0) <= 0) {
                                            break
                                        }
                                        e = c[r >> 2] | 0;
                                        c[r >> 2] = e + 1;
                                        c[H >> 2] = d[e >> 0] | 0;
                                        c[B >> 2] = (c[B >> 2] | 0) + -1;
                                        c[I >> 2] = (c[H >> 2] | 0) == 255 ? 254 : c[H >> 2] | 0;
                                        c[B >> 2] = (c[B >> 2] | 0) - (c[I >> 2] | 0);
                                        c[A >> 2] = (c[A >> 2] | 0) + (c[I >> 2] | 0);
                                        if ((c[H >> 2] | 0) != 255) {
                                            break b
                                        }
                                    }
                                    c[p >> 2] = -4;
                                    e = c[p >> 2] | 0;
                                    i = D;
                                    return e | 0
                                }
                            } while (0);
                            if ((c[B >> 2] | 0) < 0) {
                                c[p >> 2] = -4;
                                e = c[p >> 2] | 0;
                                i = D;
                                return e | 0
                            }
                            c[C >> 2] = ((a[G >> 0] & 128 | 0) != 0 ^ 1) & 1;
                            if ((c[C >> 2] | 0) != 0) {
                                if ((c[E >> 2] | 0) != 0) {
                                    break
                                }
                                c[z >> 2] = (c[B >> 2] | 0) / (c[u >> 2] | 0) | 0;
                                e = $(c[z >> 2] | 0, c[u >> 2] | 0) | 0;
                                if ((e | 0) != (c[B >> 2] | 0)) {
                                    c[p >> 2] = -4;
                                    e = c[p >> 2] | 0;
                                    i = D;
                                    return e | 0
                                }
                                c[t >> 2] = 0;
                                while (1) {
                                    if ((c[t >> 2] | 0) >= ((c[u >> 2] | 0) - 1 | 0)) {
                                        break a
                                    }
                                    b[(c[v >> 2] | 0) + (c[t >> 2] << 1) >> 1] = c[z >> 2];
                                    c[t >> 2] = (c[t >> 2] | 0) + 1
                                }
                            }
                            c[z >> 2] = c[B >> 2];
                            c[t >> 2] = 0;
                            while (1) {
                                if ((c[t >> 2] | 0) >= ((c[u >> 2] | 0) - 1 | 0)) {
                                    break
                                }
                                c[y >> 2] = ve(c[r >> 2] | 0, c[B >> 2] | 0, (c[v >> 2] | 0) + (c[t >> 2] << 1) | 0) | 0;
                                c[B >> 2] = (c[B >> 2] | 0) - (c[y >> 2] | 0);
                                if ((b[(c[v >> 2] | 0) + (c[t >> 2] << 1) >> 1] | 0) < 0) {
                                    o = 29;
                                    break
                                }
                                if ((b[(c[v >> 2] | 0) + (c[t >> 2] << 1) >> 1] | 0) > (c[B >> 2] | 0)) {
                                    o = 29;
                                    break
                                }
                                c[r >> 2] = (c[r >> 2] | 0) + (c[y >> 2] | 0);
                                c[z >> 2] = (c[z >> 2] | 0) - ((c[y >> 2] | 0) + (b[(c[v >> 2] | 0) + (c[t >> 2] << 1) >> 1] | 0));
                                c[t >> 2] = (c[t >> 2] | 0) + 1
                            }
                            if ((o | 0) == 29) {
                                c[p >> 2] = -4;
                                e = c[p >> 2] | 0;
                                i = D;
                                return e | 0
                            }
                            if ((c[z >> 2] | 0) >= 0) {
                                break
                            }
                            c[p >> 2] = -4;
                            e = c[p >> 2] | 0;
                            i = D;
                            return e | 0
                        }
                        c[p >> 2] = -4;
                        e = c[p >> 2] | 0;
                        i = D;
                        return e | 0
                    }
                } while (0);
                c:do {
                    if ((c[E >> 2] | 0) != 0) {
                        c[y >> 2] = ve(c[r >> 2] | 0, c[B >> 2] | 0, (c[v >> 2] | 0) + (c[u >> 2] << 1) + -2 | 0) | 0;
                        c[B >> 2] = (c[B >> 2] | 0) - (c[y >> 2] | 0);
                        if ((b[(c[v >> 2] | 0) + ((c[u >> 2] | 0) - 1 << 1) >> 1] | 0) >= 0 ? (b[(c[v >> 2] | 0) + ((c[u >> 2] | 0) - 1 << 1) >> 1] | 0) <= (c[B >> 2] | 0) : 0) {
                            c[r >> 2] = (c[r >> 2] | 0) + (c[y >> 2] | 0);
                            if ((c[C >> 2] | 0) == 0) {
                                if (((c[y >> 2] | 0) + (b[(c[v >> 2] | 0) + ((c[u >> 2] | 0) - 1 << 1) >> 1] | 0) | 0) <= (c[z >> 2] | 0)) {
                                    break
                                }
                                c[p >> 2] = -4;
                                e = c[p >> 2] | 0;
                                i = D;
                                return e | 0
                            }
                            e = $(b[(c[v >> 2] | 0) + ((c[u >> 2] | 0) - 1 << 1) >> 1] | 0, c[u >> 2] | 0) | 0;
                            if ((e | 0) > (c[B >> 2] | 0)) {
                                c[p >> 2] = -4;
                                e = c[p >> 2] | 0;
                                i = D;
                                return e | 0
                            }
                            c[t >> 2] = 0;
                            while (1) {
                                if ((c[t >> 2] | 0) >= ((c[u >> 2] | 0) - 1 | 0)) {
                                    break c
                                }
                                b[(c[v >> 2] | 0) + (c[t >> 2] << 1) >> 1] = b[(c[v >> 2] | 0) + ((c[u >> 2] | 0) - 1 << 1) >> 1] | 0;
                                c[t >> 2] = (c[t >> 2] | 0) + 1
                            }
                        }
                        c[p >> 2] = -4;
                        e = c[p >> 2] | 0;
                        i = D;
                        return e | 0
                    } else {
                        if ((c[z >> 2] | 0) <= 1275) {
                            b[(c[v >> 2] | 0) + ((c[u >> 2] | 0) - 1 << 1) >> 1] = c[z >> 2];
                            break
                        }
                        c[p >> 2] = -4;
                        e = c[p >> 2] | 0;
                        i = D;
                        return e | 0
                    }
                } while (0);
                if ((c[x >> 2] | 0) != 0) {
                    c[c[x >> 2] >> 2] = (c[r >> 2] | 0) - (c[w >> 2] | 0)
                }
                c[t >> 2] = 0;
                while (1) {
                    if ((c[t >> 2] | 0) >= (c[u >> 2] | 0)) {
                        break
                    }
                    if ((c[s >> 2] | 0) != 0) {
                        c[(c[s >> 2] | 0) + (c[t >> 2] << 2) >> 2] = c[r >> 2]
                    }
                    c[r >> 2] = (c[r >> 2] | 0) + (b[(c[v >> 2] | 0) + (c[t >> 2] << 1) >> 1] | 0);
                    c[t >> 2] = (c[t >> 2] | 0) + 1
                }
                if ((c[q >> 2] | 0) != 0) {
                    c[c[q >> 2] >> 2] = (c[A >> 2] | 0) + ((c[r >> 2] | 0) - (c[w >> 2] | 0))
                }
                if ((c[n >> 2] | 0) != 0) {
                    a[c[n >> 2] >> 0] = a[F >> 0] | 0
                }
                c[p >> 2] = c[u >> 2];
                e = c[p >> 2] | 0;
                i = D;
                return e | 0
            }
            function ve(a, e, f) {
                a = a | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0;
                g = i;
                i = i + 16 | 0;
                h = g + 12 | 0;
                k = g + 8 | 0;
                l = g + 4 | 0;
                j = g;
                c[k >> 2] = a;
                c[l >> 2] = e;
                c[j >> 2] = f;
                if ((c[l >> 2] | 0) < 1) {
                    b[c[j >> 2] >> 1] = -1;
                    c[h >> 2] = -1;
                    a = c[h >> 2] | 0;
                    i = g;
                    return a | 0
                }
                if ((d[c[k >> 2] >> 0] | 0 | 0) < 252) {
                    b[c[j >> 2] >> 1] = d[c[k >> 2] >> 0] | 0;
                    c[h >> 2] = 1;
                    a = c[h >> 2] | 0;
                    i = g;
                    return a | 0
                }
                if ((c[l >> 2] | 0) < 2) {
                    b[c[j >> 2] >> 1] = -1;
                    c[h >> 2] = -1;
                    a = c[h >> 2] | 0;
                    i = g;
                    return a | 0
                } else {
                    b[c[j >> 2] >> 1] = ((d[(c[k >> 2] | 0) + 1 >> 0] | 0) << 2) + (d[c[k >> 2] >> 0] | 0);
                    c[h >> 2] = 2;
                    a = c[h >> 2] | 0;
                    i = g;
                    return a | 0
                }
                return 0
            }
            function we(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0;
                b = i;
                i = i + 32 | 0;
                d = b + 16 | 0;
                f = b + 12 | 0;
                e = b + 8 | 0;
                g = b + 4 | 0;
                h = b;
                c[f >> 2] = a;
                if ((c[f >> 2] | 0) < 1 | (c[f >> 2] | 0) > 2) {
                    c[d >> 2] = 0;
                    h = c[d >> 2] | 0;
                    i = b;
                    return h | 0
                }
                c[h >> 2] = Nd(e) | 0;
                if ((c[h >> 2] | 0) != 0) {
                    c[d >> 2] = 0;
                    h = c[d >> 2] | 0;
                    i = b;
                    return h | 0
                } else {
                    c[e >> 2] = xe(c[e >> 2] | 0) | 0;
                    c[g >> 2] = db(c[f >> 2] | 0) | 0;
                    h = xe(76) | 0;
                    c[d >> 2] = h + (c[e >> 2] | 0) + (c[g >> 2] | 0);
                    h = c[d >> 2] | 0;
                    i = b;
                    return h | 0
                }
                return 0
            }
            function xe(a) {
                a = a | 0;
                var b = 0, d = 0;
                d = i;
                i = i + 16 | 0;
                b = d;
                c[b >> 2] = a;
                i = d;
                return (c[b >> 2] | 0) + 4 - 1 & -4 | 0
            }
            function ye(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0;
                k = i;
                i = i + 48 | 0;
                h = k;
                f = k + 24 | 0;
                j = k + 20 | 0;
                e = k + 8 | 0;
                l = k + 16 | 0;
                o = k + 4 | 0;
                g = k + 12 | 0;
                m = k + 28 | 0;
                n = k + 32 | 0;
                c[j >> 2] = a;
                c[e >> 2] = b;
                c[l >> 2] = d;
                if (!((c[e >> 2] | 0) != 48e3 & (c[e >> 2] | 0) != 24e3 & (c[e >> 2] | 0) != 16e3 & (c[e >> 2] | 0) != 12e3 & (c[e >> 2] | 0) != 8e3) ? !((c[l >> 2] | 0) != 1 & (c[l >> 2] | 0) != 2) : 0) {
                    a = c[j >> 2] | 0;
                    Xe(a | 0, 0, we(c[l >> 2] | 0) | 0) | 0;
                    c[m >> 2] = Nd(n) | 0;
                    if ((c[m >> 2] | 0) != 0) {
                        c[f >> 2] = -3;
                        a = c[f >> 2] | 0;
                        i = k;
                        return a | 0
                    }
                    c[n >> 2] = xe(c[n >> 2] | 0) | 0;
                    a = xe(76) | 0;
                    c[(c[j >> 2] | 0) + 4 >> 2] = a;
                    c[c[j >> 2] >> 2] = (c[(c[j >> 2] | 0) + 4 >> 2] | 0) + (c[n >> 2] | 0);
                    c[o >> 2] = (c[j >> 2] | 0) + (c[(c[j >> 2] | 0) + 4 >> 2] | 0);
                    c[g >> 2] = (c[j >> 2] | 0) + (c[c[j >> 2] >> 2] | 0);
                    a = c[l >> 2] | 0;
                    c[(c[j >> 2] | 0) + 8 >> 2] = a;
                    c[(c[j >> 2] | 0) + 44 >> 2] = a;
                    c[(c[j >> 2] | 0) + 12 >> 2] = c[e >> 2];
                    c[(c[j >> 2] | 0) + 24 >> 2] = c[(c[j >> 2] | 0) + 12 >> 2];
                    c[(c[j >> 2] | 0) + 16 >> 2] = c[(c[j >> 2] | 0) + 8 >> 2];
                    c[m >> 2] = Od(c[o >> 2] | 0) | 0;
                    if ((c[m >> 2] | 0) != 0) {
                        c[f >> 2] = -3;
                        a = c[f >> 2] | 0;
                        i = k;
                        return a | 0
                    }
                    c[m >> 2] = fb(c[g >> 2] | 0, c[e >> 2] | 0, c[l >> 2] | 0) | 0;
                    if ((c[m >> 2] | 0) != 0) {
                        c[f >> 2] = -3;
                        a = c[f >> 2] | 0;
                        i = k;
                        return a | 0
                    } else {
                        a = c[g >> 2] | 0;
                        c[h >> 2] = 0;
                        ob(a, 10016, h) | 0;
                        c[(c[j >> 2] | 0) + 56 >> 2] = 0;
                        c[(c[j >> 2] | 0) + 60 >> 2] = (c[e >> 2] | 0) / 400 | 0;
                        c[f >> 2] = 0;
                        a = c[f >> 2] | 0;
                        i = k;
                        return a | 0
                    }
                }
                c[f >> 2] = -1;
                a = c[f >> 2] | 0;
                i = k;
                return a | 0
            }
            function ze(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                f = i;
                i = i + 32 | 0;
                e = f + 20 | 0;
                k = f + 16 | 0;
                l = f + 12 | 0;
                g = f + 8 | 0;
                j = f + 4 | 0;
                h = f;
                c[k >> 2] = a;
                c[l >> 2] = b;
                c[g >> 2] = d;
                if (!((c[k >> 2] | 0) != 48e3 & (c[k >> 2] | 0) != 24e3 & (c[k >> 2] | 0) != 16e3 & (c[k >> 2] | 0) != 12e3 & (c[k >> 2] | 0) != 8e3) ? !((c[l >> 2] | 0) != 1 & (c[l >> 2] | 0) != 2) : 0) {
                    c[h >> 2] = Ae(we(c[l >> 2] | 0) | 0) | 0;
                    if ((c[h >> 2] | 0) == 0) {
                        if ((c[g >> 2] | 0) != 0) {
                            c[c[g >> 2] >> 2] = -7
                        }
                        c[e >> 2] = 0;
                        a = c[e >> 2] | 0;
                        i = f;
                        return a | 0
                    }
                    c[j >> 2] = ye(c[h >> 2] | 0, c[k >> 2] | 0, c[l >> 2] | 0) | 0;
                    if ((c[g >> 2] | 0) != 0) {
                        c[c[g >> 2] >> 2] = c[j >> 2]
                    }
                    if ((c[j >> 2] | 0) != 0) {
                        Be(c[h >> 2] | 0);
                        c[h >> 2] = 0
                    }
                    c[e >> 2] = c[h >> 2];
                    a = c[e >> 2] | 0;
                    i = f;
                    return a | 0
                }
                if ((c[g >> 2] | 0) != 0) {
                    c[c[g >> 2] >> 2] = -1
                }
                c[e >> 2] = 0;
                a = c[e >> 2] | 0;
                i = f;
                return a | 0
            }
            function Ae(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                a = Se(c[d >> 2] | 0) | 0;
                i = b;
                return a | 0
            }
            function Be(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                Te(c[d >> 2] | 0);
                i = b;

            }
            function Ce(a, d, e, f, g, h, j, k, l) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                var m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0,
                    A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0;
                r = i;
                i = i + 208 | 0;
                n = r + 44 | 0;
                p = r + 4 | 0;
                M = r;
                H = r + 76 | 0;
                o = r + 36 | 0;
                q = r + 16 | 0;
                G = r + 20 | 0;
                I = r + 24 | 0;
                K = r + 64 | 0;
                C = r + 72 | 0;
                v = r + 80 | 0;
                E = r + 84 | 0;
                L = r + 88 | 0;
                F = r + 48 | 0;
                J = r + 192 | 0;
                A = r + 8 | 0;
                z = r + 56 | 0;
                y = r + 28 | 0;
                B = r + 60 | 0;
                u = r + 96 | 0;
                s = r + 32 | 0;
                t = r + 68 | 0;
                w = r + 40 | 0;
                D = r + 12 | 0;
                x = r + 52 | 0;
                c[p >> 2] = a;
                c[M >> 2] = d;
                c[H >> 2] = e;
                c[o >> 2] = f;
                c[q >> 2] = g;
                c[G >> 2] = h;
                c[I >> 2] = j;
                c[K >> 2] = k;
                c[C >> 2] = l;
                if ((c[G >> 2] | 0) < 0 | (c[G >> 2] | 0) > 1) {
                    c[n >> 2] = -1;
                    a = c[n >> 2] | 0;
                    i = r;
                    return a | 0
                }
                if (!(((c[G >> 2] | 0) == 0 ? (c[H >> 2] | 0) != 0 : 0) ? (c[M >> 2] | 0) != 0 : 0)) {
                    m = 6
                }
                if ((m | 0) == 6 ? ((c[q >> 2] | 0) % ((c[(c[p >> 2] | 0) + 12 >> 2] | 0) / 400 | 0 | 0) | 0 | 0) != 0 : 0) {
                    c[n >> 2] = -1;
                    a = c[n >> 2] | 0;
                    i = r;
                    return a | 0
                }
                if ((c[H >> 2] | 0) != 0 ? (c[M >> 2] | 0) != 0 : 0) {
                    if ((c[H >> 2] | 0) < 0) {
                        c[n >> 2] = -1;
                        a = c[n >> 2] | 0;
                        i = r;
                        return a | 0
                    }
                    c[y >> 2] = Fe(c[M >> 2] | 0) | 0;
                    c[z >> 2] = Ge(c[M >> 2] | 0) | 0;
                    c[A >> 2] = te(c[M >> 2] | 0, c[(c[p >> 2] | 0) + 12 >> 2] | 0) | 0;
                    c[B >> 2] = He(c[M >> 2] | 0) | 0;
                    c[L >> 2] = ue(c[M >> 2] | 0, c[H >> 2] | 0, c[I >> 2] | 0, J, 0, u, F, c[K >> 2] | 0) | 0;
                    if ((c[L >> 2] | 0) < 0) {
                        c[n >> 2] = c[L >> 2];
                        a = c[n >> 2] | 0;
                        i = r;
                        return a | 0
                    }
                    c[M >> 2] = (c[M >> 2] | 0) + (c[F >> 2] | 0);
                    if ((c[G >> 2] | 0) == 0) {
                        a = $(c[L >> 2] | 0, c[A >> 2] | 0) | 0;
                        if ((a | 0) > (c[q >> 2] | 0)) {
                            c[n >> 2] = -2;
                            a = c[n >> 2] | 0;
                            i = r;
                            return a | 0
                        }
                        c[(c[p >> 2] | 0) + 52 >> 2] = c[y >> 2];
                        c[(c[p >> 2] | 0) + 48 >> 2] = c[z >> 2];
                        c[(c[p >> 2] | 0) + 60 >> 2] = c[A >> 2];
                        c[(c[p >> 2] | 0) + 44 >> 2] = c[B >> 2];
                        c[E >> 2] = 0;
                        c[v >> 2] = 0;
                        while (1) {
                            if ((c[v >> 2] | 0) >= (c[L >> 2] | 0)) {
                                m = 37;
                                break
                            }
                            a = (c[o >> 2] | 0) + (($(c[E >> 2] | 0, c[(c[p >> 2] | 0) + 8 >> 2] | 0) | 0) << 1) | 0;
                            c[x >> 2] = De(c[p >> 2] | 0, c[M >> 2] | 0, b[u + (c[v >> 2] << 1) >> 1] | 0, a, (c[q >> 2] | 0) - (c[E >> 2] | 0) | 0, 0) | 0;
                            if ((c[x >> 2] | 0) < 0) {
                                m = 35;
                                break
                            }
                            c[M >> 2] = (c[M >> 2] | 0) + (b[u + (c[v >> 2] << 1) >> 1] | 0);
                            c[E >> 2] = (c[E >> 2] | 0) + (c[x >> 2] | 0);
                            c[v >> 2] = (c[v >> 2] | 0) + 1
                        }
                        if ((m | 0) == 35) {
                            c[n >> 2] = c[x >> 2];
                            a = c[n >> 2] | 0;
                            i = r;
                            return a | 0
                        } else if ((m | 0) == 37) {
                            c[(c[p >> 2] | 0) + 68 >> 2] = c[E >> 2];
                            Ee() | 0;
                            c[n >> 2] = c[E >> 2];
                            a = c[n >> 2] | 0;
                            i = r;
                            return a | 0
                        }
                    }
                    if (((c[q >> 2] | 0) >= (c[A >> 2] | 0) ? (c[y >> 2] | 0) != 1002 : 0) ? (c[(c[p >> 2] | 0) + 52 >> 2] | 0) != 1002 : 0) {
                        c[w >> 2] = c[(c[p >> 2] | 0) + 68 >> 2];
                        if (((c[q >> 2] | 0) - (c[A >> 2] | 0) | 0) != 0 ? (c[D >> 2] = Ce(c[p >> 2] | 0, 0, 0, c[o >> 2] | 0, (c[q >> 2] | 0) - (c[A >> 2] | 0) | 0, 0, 0, 0, c[C >> 2] | 0) | 0, (c[D >> 2] | 0) < 0) : 0) {
                            c[(c[p >> 2] | 0) + 68 >> 2] = c[w >> 2];
                            c[n >> 2] = c[D >> 2];
                            a = c[n >> 2] | 0;
                            i = r;
                            return a | 0
                        }
                        c[(c[p >> 2] | 0) + 52 >> 2] = c[y >> 2];
                        c[(c[p >> 2] | 0) + 48 >> 2] = c[z >> 2];
                        c[(c[p >> 2] | 0) + 60 >> 2] = c[A >> 2];
                        c[(c[p >> 2] | 0) + 44 >> 2] = c[B >> 2];
                        a = (c[o >> 2] | 0) + (($(c[(c[p >> 2] | 0) + 8 >> 2] | 0, (c[q >> 2] | 0) - (c[A >> 2] | 0) | 0) | 0) << 1) | 0;
                        c[D >> 2] = De(c[p >> 2] | 0, c[M >> 2] | 0, b[u >> 1] | 0, a, c[A >> 2] | 0, 1) | 0;
                        if ((c[D >> 2] | 0) < 0) {
                            c[n >> 2] = c[D >> 2];
                            a = c[n >> 2] | 0;
                            i = r;
                            return a | 0
                        } else {
                            Ee() | 0;
                            c[(c[p >> 2] | 0) + 68 >> 2] = c[q >> 2];
                            c[n >> 2] = c[q >> 2];
                            a = c[n >> 2] | 0;
                            i = r;
                            return a | 0
                        }
                    }
                    c[n >> 2] = Ce(c[p >> 2] | 0, 0, 0, c[o >> 2] | 0, c[q >> 2] | 0, 0, 0, 0, c[C >> 2] | 0) | 0;
                    a = c[n >> 2] | 0;
                    i = r;
                    return a | 0
                }
                c[s >> 2] = 0;
                while (1) {
                    u = (c[o >> 2] | 0) + (($(c[s >> 2] | 0, c[(c[p >> 2] | 0) + 8 >> 2] | 0) | 0) << 1) | 0;
                    c[t >> 2] = De(c[p >> 2] | 0, 0, 0, u, (c[q >> 2] | 0) - (c[s >> 2] | 0) | 0, 0) | 0;
                    u = c[t >> 2] | 0;
                    if ((c[t >> 2] | 0) < 0) {
                        m = 12;
                        break
                    }
                    c[s >> 2] = (c[s >> 2] | 0) + u;
                    if ((c[s >> 2] | 0) >= (c[q >> 2] | 0)) {
                        m = 14;
                        break
                    }
                }
                if ((m | 0) == 12) {
                    c[n >> 2] = u;
                    a = c[n >> 2] | 0;
                    i = r;
                    return a | 0
                } else if ((m | 0) == 14) {
                    Ee() | 0;
                    c[(c[p >> 2] | 0) + 68 >> 2] = c[s >> 2];
                    c[n >> 2] = c[s >> 2];
                    a = c[n >> 2] | 0;
                    i = r;
                    return a | 0
                }
                return 0
            }
            function De(d, e, f, g, h, j) {
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                var k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0,
                    y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0,
                    M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0,
                    _ = 0, aa = 0, ba = 0, ca = 0, da = 0, ea = 0, fa = 0;
                k = i;
                i = i + 240 | 0;
                P = k;
                n = k + 128 | 0;
                l = k + 124 | 0;
                J = k + 208 | 0;
                w = k + 216 | 0;
                o = k + 200 | 0;
                s = k + 20 | 0;
                L = k + 24 | 0;
                _ = k + 28 | 0;
                K = k + 32 | 0;
                B = k + 36 | 0;
                Z = k + 40 | 0;
                r = k + 44 | 0;
                v = k + 48 | 0;
                ba = k + 96 | 0;
                ca = k + 8 | 0;
                U = k + 104 | 0;
                ea = k + 108 | 0;
                S = k + 112 | 0;
                T = k + 196 | 0;
                m = k + 204 | 0;
                C = k + 212 | 0;
                H = k + 220 | 0;
                D = k + 224 | 0;
                u = k + 228 | 0;
                F = k + 140 | 0;
                x = k + 144 | 0;
                G = k + 148 | 0;
                N = k + 152 | 0;
                E = k + 156 | 0;
                da = k + 160 | 0;
                y = k + 164 | 0;
                O = k + 168 | 0;
                z = k + 172 | 0;
                Q = k + 176 | 0;
                fa = k + 180 | 0;
                p = k + 184 | 0;
                q = k + 16 | 0;
                W = k + 12 | 0;
                X = k + 188 | 0;
                Y = k + 100 | 0;
                aa = k + 136 | 0;
                V = k + 116 | 0;
                I = k + 192 | 0;
                R = k + 232 | 0;
                M = k + 120 | 0;
                t = k + 132 | 0;
                A = k + 4 | 0;
                c[l >> 2] = d;
                c[J >> 2] = e;
                c[w >> 2] = f;
                c[o >> 2] = g;
                c[s >> 2] = h;
                c[L >> 2] = j;
                c[Z >> 2] = 0;
                c[r >> 2] = 0;
                c[S >> 2] = 0;
                c[H >> 2] = 0;
                c[u >> 2] = 0;
                c[F >> 2] = 0;
                c[x >> 2] = 0;
                c[z >> 2] = 0;
                c[_ >> 2] = (c[l >> 2] | 0) + (c[(c[l >> 2] | 0) + 4 >> 2] | 0);
                c[K >> 2] = (c[l >> 2] | 0) + (c[c[l >> 2] >> 2] | 0);
                c[y >> 2] = (c[(c[l >> 2] | 0) + 12 >> 2] | 0) / 50 | 0;
                c[da >> 2] = c[y >> 2] >> 1;
                c[E >> 2] = c[da >> 2] >> 1;
                c[N >> 2] = c[E >> 2] >> 1;
                if ((c[s >> 2] | 0) < (c[N >> 2] | 0)) {
                    c[n >> 2] = -2;
                    d = c[n >> 2] | 0;
                    i = k;
                    return d | 0
                }
                if ((c[s >> 2] | 0) < (((c[(c[l >> 2] | 0) + 12 >> 2] | 0) / 25 | 0) * 3 | 0)) {
                    j = c[s >> 2] | 0
                } else {
                    j = ((c[(c[l >> 2] | 0) + 12 >> 2] | 0) / 25 | 0) * 3 | 0
                }
                c[s >> 2] = j;
                if ((c[w >> 2] | 0) <= 1) {
                    c[J >> 2] = 0;
                    if ((c[s >> 2] | 0) < (c[(c[l >> 2] | 0) + 60 >> 2] | 0)) {
                        j = c[s >> 2] | 0
                    } else {
                        j = c[(c[l >> 2] | 0) + 60 >> 2] | 0
                    }
                    c[s >> 2] = j
                }
                do {
                    if ((c[J >> 2] | 0) == 0) {
                        c[m >> 2] = c[s >> 2];
                        c[C >> 2] = c[(c[l >> 2] | 0) + 56 >> 2];
                        if ((c[C >> 2] | 0) == 0) {
                            c[B >> 2] = 0;
                            while (1) {
                                if ((c[B >> 2] | 0) >= ($(c[m >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0) | 0)) {
                                    break
                                }
                                b[(c[o >> 2] | 0) + (c[B >> 2] << 1) >> 1] = 0;
                                c[B >> 2] = (c[B >> 2] | 0) + 1
                            }
                            c[n >> 2] = c[m >> 2];
                            d = c[n >> 2] | 0;
                            i = k;
                            return d | 0
                        }
                        if ((c[m >> 2] | 0) > (c[y >> 2] | 0)) {
                            while (1) {
                                c[fa >> 2] = De(c[l >> 2] | 0, 0, 0, c[o >> 2] | 0, (c[m >> 2] | 0) < (c[y >> 2] | 0) ? c[m >> 2] | 0 : c[y >> 2] | 0, 0) | 0;
                                p = c[fa >> 2] | 0;
                                if ((c[fa >> 2] | 0) < 0) {
                                    fa = 20;
                                    break
                                }
                                d = $(p, c[(c[l >> 2] | 0) + 8 >> 2] | 0) | 0;
                                c[o >> 2] = (c[o >> 2] | 0) + (d << 1);
                                c[m >> 2] = (c[m >> 2] | 0) - (c[fa >> 2] | 0);
                                if ((c[m >> 2] | 0) <= 0) {
                                    fa = 22;
                                    break
                                }
                            }
                            if ((fa | 0) == 20) {
                                c[n >> 2] = p;
                                d = c[n >> 2] | 0;
                                i = k;
                                return d | 0
                            } else if ((fa | 0) == 22) {
                                c[n >> 2] = c[s >> 2];
                                d = c[n >> 2] | 0;
                                i = k;
                                return d | 0
                            }
                        }
                        if ((c[m >> 2] | 0) < (c[y >> 2] | 0)) {
                            if ((c[m >> 2] | 0) > (c[da >> 2] | 0)) {
                                c[m >> 2] = c[da >> 2];
                                break
                            }
                            if (((c[C >> 2] | 0) != 1e3 ? (c[m >> 2] | 0) > (c[E >> 2] | 0) : 0) ? (c[m >> 2] | 0) < (c[da >> 2] | 0) : 0) {
                                c[m >> 2] = c[E >> 2]
                            }
                        }
                    } else {
                        c[m >> 2] = c[(c[l >> 2] | 0) + 60 >> 2];
                        c[C >> 2] = c[(c[l >> 2] | 0) + 52 >> 2];
                        Hb(v, c[J >> 2] | 0, c[w >> 2] | 0)
                    }
                } while (0);
                if ((c[C >> 2] | 0) != 1002) {
                    fa = (c[s >> 2] | 0) >= (c[da >> 2] | 0)
                } else {
                    fa = 0
                }
                c[Q >> 2] = fa & 1;
                c[U >> 2] = 1;
                c[ea >> 2] = 1;
                do {
                    if ((c[J >> 2] | 0) != 0 ? (c[(c[l >> 2] | 0) + 56 >> 2] | 0) > 0 : 0) {
                        if (!(((c[C >> 2] | 0) == 1002 ? (c[(c[l >> 2] | 0) + 56 >> 2] | 0) != 1002 : 0) ? (c[(c[l >> 2] | 0) + 64 >> 2] | 0) == 0 : 0)) {
                            if ((c[C >> 2] | 0) == 1002) {
                                break
                            }
                            if ((c[(c[l >> 2] | 0) + 56 >> 2] | 0) != 1002) {
                                break
                            }
                        }
                        c[H >> 2] = 1;
                        fa = $(c[E >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0) | 0;
                        if ((c[C >> 2] | 0) == 1002) {
                            c[ea >> 2] = fa;
                            break
                        } else {
                            c[U >> 2] = fa;
                            break
                        }
                    }
                } while (0);
                d = c[ea >> 2] | 0;
                c[p >> 2] = ia() | 0;
                ea = i;
                i = i + ((2 * d | 0) + 15 & -16) | 0;
                if ((c[H >> 2] | 0) != 0 ? (c[C >> 2] | 0) == 1002 : 0) {
                    c[S >> 2] = ea;
                    De(c[l >> 2] | 0, 0, 0, c[S >> 2] | 0, (c[E >> 2] | 0) < (c[m >> 2] | 0) ? c[E >> 2] | 0 : c[m >> 2] | 0, 0) | 0
                }
                a:do {
                    if ((c[m >> 2] | 0) > (c[s >> 2] | 0)) {
                        c[n >> 2] = -1;
                        c[q >> 2] = 1
                    } else {
                        c[s >> 2] = c[m >> 2];
                        if ((c[C >> 2] | 0) != 1002 ? (c[Q >> 2] | 0) == 0 : 0) {
                            da = $((c[da >> 2] | 0) > (c[s >> 2] | 0) ? c[da >> 2] | 0 : c[s >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0) | 0
                        } else {
                            da = 1
                        }
                        c[ca >> 2] = da;
                        da = i;
                        i = i + ((2 * (c[ca >> 2] | 0) | 0) + 15 & -16) | 0;
                        b:do {
                            if ((c[C >> 2] | 0) != 1002) {
                                if ((c[Q >> 2] | 0) != 0) {
                                    c[Y >> 2] = c[o >> 2]
                                } else {
                                    c[Y >> 2] = da
                                }
                                if ((c[(c[l >> 2] | 0) + 56 >> 2] | 0) == 1002) {
                                    Od(c[_ >> 2] | 0) | 0
                                }
                                if (10 > (((c[m >> 2] | 0) * 1e3 | 0) / (c[(c[l >> 2] | 0) + 12 >> 2] | 0) | 0 | 0)) {
                                    ca = 10
                                } else {
                                    ca = ((c[m >> 2] | 0) * 1e3 | 0) / (c[(c[l >> 2] | 0) + 12 >> 2] | 0) | 0
                                }
                                c[(c[l >> 2] | 0) + 32 >> 2] = ca;
                                do {
                                    if ((c[J >> 2] | 0) != 0) {
                                        c[(c[l >> 2] | 0) + 20 >> 2] = c[(c[l >> 2] | 0) + 44 >> 2];
                                        ca = c[l >> 2] | 0;
                                        if ((c[C >> 2] | 0) != 1e3) {
                                            c[ca + 28 >> 2] = 16e3;
                                            break
                                        }
                                        ea = c[l >> 2] | 0;
                                        if ((c[ca + 48 >> 2] | 0) == 1101) {
                                            c[ea + 28 >> 2] = 8e3;
                                            break
                                        }
                                        if ((c[ea + 48 >> 2] | 0) == 1102) {
                                            c[(c[l >> 2] | 0) + 28 >> 2] = 12e3;
                                            break
                                        } else {
                                            c[(c[l >> 2] | 0) + 28 >> 2] = 16e3;
                                            break
                                        }
                                    }
                                } while (0);
                                if ((c[J >> 2] | 0) == 0) {
                                    ca = 1
                                } else {
                                    ca = c[L >> 2] << 1
                                }
                                c[W >> 2] = ca;
                                c[X >> 2] = 0;
                                c:while (1) {
                                    c[aa >> 2] = (c[X >> 2] | 0) == 0 & 1;
                                    c[Z >> 2] = Pd(c[_ >> 2] | 0, (c[l >> 2] | 0) + 16 | 0, c[W >> 2] | 0, c[aa >> 2] | 0, v, c[Y >> 2] | 0, ba) | 0;
                                    d:do {
                                        if ((c[Z >> 2] | 0) != 0) {
                                            if ((c[W >> 2] | 0) == 0) {
                                                break c
                                            }
                                            c[ba >> 2] = c[s >> 2];
                                            c[B >> 2] = 0;
                                            while (1) {
                                                if ((c[B >> 2] | 0) >= ($(c[s >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0) | 0)) {
                                                    break d
                                                }
                                                b[(c[Y >> 2] | 0) + (c[B >> 2] << 1) >> 1] = 0;
                                                c[B >> 2] = (c[B >> 2] | 0) + 1
                                            }
                                        }
                                    } while (0);
                                    d = $(c[ba >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0) | 0;
                                    c[Y >> 2] = (c[Y >> 2] | 0) + (d << 1);
                                    c[X >> 2] = (c[X >> 2] | 0) + (c[ba >> 2] | 0);
                                    if ((c[X >> 2] | 0) >= (c[s >> 2] | 0)) {
                                        break b
                                    }
                                }
                                c[n >> 2] = -3;
                                c[q >> 2] = 1;
                                break a
                            }
                        } while (0);
                        c[D >> 2] = 0;
                        if ((((c[L >> 2] | 0) == 0 ? (c[C >> 2] | 0) != 1002 : 0) ? (c[J >> 2] | 0) != 0 : 0) ? (d = (Ne(v) | 0) + 17 | 0, (d + (((c[(c[l >> 2] | 0) + 52 >> 2] | 0) == 1001 & 1) * 20 | 0) | 0) <= (c[w >> 2] << 3 | 0)) : 0) {
                            if ((c[C >> 2] | 0) == 1001) {
                                c[u >> 2] = Ob(v, 12) | 0
                            } else {
                                c[u >> 2] = 1
                            }
                            if ((c[u >> 2] | 0) != 0) {
                                c[x >> 2] = Ob(v, 1) | 0;
                                if ((c[C >> 2] | 0) == 1001) {
                                    W = (Qb(v, 256) | 0) + 2 | 0
                                } else {
                                    W = c[w >> 2] | 0;
                                    W = W - ((Ne(v) | 0) + 7 >> 3) | 0
                                }
                                c[F >> 2] = W;
                                c[w >> 2] = (c[w >> 2] | 0) - (c[F >> 2] | 0);
                                d = c[w >> 2] << 3;
                                if ((d | 0) < (Ne(v) | 0)) {
                                    c[w >> 2] = 0;
                                    c[F >> 2] = 0;
                                    c[u >> 2] = 0
                                }
                                d = v + 4 | 0;
                                c[d >> 2] = (c[d >> 2] | 0) - (c[F >> 2] | 0)
                            }
                        }
                        if ((c[C >> 2] | 0) != 1002) {
                            c[D >> 2] = 17
                        }
                        c[V >> 2] = 21;
                        switch (c[(c[l >> 2] | 0) + 48 >> 2] | 0) {
                            case 1101: {
                                c[V >> 2] = 13;
                                break
                            }
                            case 1103:
                            case 1102: {
                                c[V >> 2] = 17;
                                break
                            }
                            case 1104: {
                                c[V >> 2] = 19;
                                break
                            }
                            case 1105: {
                                c[V >> 2] = 21;
                                break
                            }
                            default: {
                            }
                        }
                        d = c[K >> 2] | 0;
                        c[P >> 2] = c[V >> 2];
                        ob(d, 10012, P) | 0;
                        d = c[K >> 2] | 0;
                        c[P >> 2] = c[(c[l >> 2] | 0) + 44 >> 2];
                        ob(d, 10008, P) | 0;
                        if ((c[u >> 2] | 0) != 0) {
                            c[H >> 2] = 0;
                            c[U >> 2] = 1
                        }
                        V = i;
                        i = i + ((2 * (c[U >> 2] | 0) | 0) + 15 & -16) | 0;
                        if ((c[H >> 2] | 0) != 0 ? (c[C >> 2] | 0) != 1002 : 0) {
                            c[S >> 2] = V;
                            De(c[l >> 2] | 0, 0, 0, c[S >> 2] | 0, (c[E >> 2] | 0) < (c[m >> 2] | 0) ? c[E >> 2] | 0 : c[m >> 2] | 0, 0) | 0
                        }
                        if ((c[u >> 2] | 0) != 0) {
                            U = $(c[E >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0) | 0
                        } else {
                            U = 1
                        }
                        c[T >> 2] = U;
                        U = i;
                        i = i + ((2 * (c[T >> 2] | 0) | 0) + 15 & -16) | 0;
                        if ((c[u >> 2] | 0) != 0 ? (c[x >> 2] | 0) != 0 : 0) {
                            d = c[K >> 2] | 0;
                            c[P >> 2] = 0;
                            ob(d, 10010, P) | 0;
                            hb(c[K >> 2] | 0, (c[J >> 2] | 0) + (c[w >> 2] | 0) | 0, c[F >> 2] | 0, U, c[E >> 2] | 0, 0, 0) | 0;
                            d = c[K >> 2] | 0;
                            c[P >> 2] = z + (((z - z | 0) / 4 | 0) << 2);
                            ob(d, 4031, P) | 0
                        }
                        d = c[K >> 2] | 0;
                        c[P >> 2] = c[D >> 2];
                        ob(d, 10010, P) | 0;
                        e:do {
                            if ((c[C >> 2] | 0) != 1e3) {
                                c[I >> 2] = (c[y >> 2] | 0) < (c[s >> 2] | 0) ? c[y >> 2] | 0 : c[s >> 2] | 0;
                                do {
                                    if ((c[C >> 2] | 0) != (c[(c[l >> 2] | 0) + 56 >> 2] | 0)) {
                                        if ((c[(c[l >> 2] | 0) + 56 >> 2] | 0) <= 0) {
                                            break
                                        }
                                        if ((c[(c[l >> 2] | 0) + 64 >> 2] | 0) != 0) {
                                            break
                                        }
                                        ob(c[K >> 2] | 0, 4028, P) | 0
                                    }
                                } while (0);
                                c[r >> 2] = hb(c[K >> 2] | 0, (c[L >> 2] | 0) != 0 ? 0 : c[J >> 2] | 0, c[w >> 2] | 0, c[o >> 2] | 0, c[I >> 2] | 0, v, c[Q >> 2] | 0) | 0
                            } else {
                                a[R + 0 >> 0] = a[19384 >> 0] | 0;
                                a[R + 1 >> 0] = a[19385 >> 0] | 0;
                                f:do {
                                    if ((c[Q >> 2] | 0) == 0) {
                                        c[B >> 2] = 0;
                                        while (1) {
                                            if ((c[B >> 2] | 0) >= ($(c[s >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0) | 0)) {
                                                break f
                                            }
                                            b[(c[o >> 2] | 0) + (c[B >> 2] << 1) >> 1] = 0;
                                            c[B >> 2] = (c[B >> 2] | 0) + 1
                                        }
                                    }
                                } while (0);
                                if ((c[(c[l >> 2] | 0) + 56 >> 2] | 0) != 1001) {
                                    break
                                }
                                do {
                                    if ((c[u >> 2] | 0) != 0) {
                                        if ((c[x >> 2] | 0) == 0) {
                                            break
                                        }
                                        if ((c[(c[l >> 2] | 0) + 64 >> 2] | 0) != 0) {
                                            break e
                                        }
                                    }
                                } while (0);
                                d = c[K >> 2] | 0;
                                c[P >> 2] = 0;
                                ob(d, 10010, P) | 0;
                                hb(c[K >> 2] | 0, R, 2, c[o >> 2] | 0, c[N >> 2] | 0, 0, c[Q >> 2] | 0) | 0
                            }
                        } while (0);
                        g:do {
                            if ((c[C >> 2] | 0) != 1002) {
                                if ((c[Q >> 2] | 0) != 0) {
                                    break
                                }
                                c[B >> 2] = 0;
                                while (1) {
                                    if ((c[B >> 2] | 0) >= ($(c[s >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0) | 0)) {
                                        break g
                                    }
                                    d = Oe((b[(c[o >> 2] | 0) + (c[B >> 2] << 1) >> 1] | 0) + (b[da + (c[B >> 2] << 1) >> 1] | 0) | 0) | 0;
                                    b[(c[o >> 2] | 0) + (c[B >> 2] << 1) >> 1] = d;
                                    c[B >> 2] = (c[B >> 2] | 0) + 1
                                }
                            }
                        } while (0);
                        d = c[K >> 2] | 0;
                        c[P >> 2] = M + (((M - M | 0) / 4 | 0) << 2);
                        ob(d, 10015, P) | 0;
                        c[O >> 2] = c[(c[M >> 2] | 0) + 52 >> 2];
                        do {
                            if ((c[u >> 2] | 0) != 0) {
                                if ((c[x >> 2] | 0) != 0) {
                                    break
                                }
                                ob(c[K >> 2] | 0, 4028, P) | 0;
                                f = c[K >> 2] | 0;
                                c[P >> 2] = 0;
                                ob(f, 10010, P) | 0;
                                hb(c[K >> 2] | 0, (c[J >> 2] | 0) + (c[w >> 2] | 0) | 0, c[F >> 2] | 0, U, c[E >> 2] | 0, 0, 0) | 0;
                                f = c[K >> 2] | 0;
                                c[P >> 2] = z + (((z - z | 0) / 4 | 0) << 2);
                                ob(f, 4031, P) | 0;
                                f = (c[o >> 2] | 0) + (($(c[(c[l >> 2] | 0) + 8 >> 2] | 0, (c[s >> 2] | 0) - (c[N >> 2] | 0) | 0) | 0) << 1) | 0;
                                e = U + (($(c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[N >> 2] | 0) | 0) << 1) | 0;
                                d = (c[o >> 2] | 0) + (($(c[(c[l >> 2] | 0) + 8 >> 2] | 0, (c[s >> 2] | 0) - (c[N >> 2] | 0) | 0) | 0) << 1) | 0;
                                Pe(f, e, d, c[N >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[O >> 2] | 0, c[(c[l >> 2] | 0) + 12 >> 2] | 0)
                            }
                        } while (0);
                        do {
                            if ((c[u >> 2] | 0) != 0) {
                                if ((c[x >> 2] | 0) == 0) {
                                    break
                                }
                                c[G >> 2] = 0;
                                while (1) {
                                    if ((c[G >> 2] | 0) >= (c[(c[l >> 2] | 0) + 8 >> 2] | 0)) {
                                        break
                                    }
                                    c[B >> 2] = 0;
                                    while (1) {
                                        if ((c[B >> 2] | 0) >= (c[N >> 2] | 0)) {
                                            break
                                        }
                                        e = $(c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[B >> 2] | 0) | 0;
                                        d = $(c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[B >> 2] | 0) | 0;
                                        b[(c[o >> 2] | 0) + (d + (c[G >> 2] | 0) << 1) >> 1] = b[U + (e + (c[G >> 2] | 0) << 1) >> 1] | 0;
                                        c[B >> 2] = (c[B >> 2] | 0) + 1
                                    }
                                    c[G >> 2] = (c[G >> 2] | 0) + 1
                                }
                                f = U + (($(c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[N >> 2] | 0) | 0) << 1) | 0;
                                e = (c[o >> 2] | 0) + (($(c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[N >> 2] | 0) | 0) << 1) | 0;
                                d = (c[o >> 2] | 0) + (($(c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[N >> 2] | 0) | 0) << 1) | 0;
                                Pe(f, e, d, c[N >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[O >> 2] | 0, c[(c[l >> 2] | 0) + 12 >> 2] | 0)
                            }
                        } while (0);
                        do {
                            if ((c[H >> 2] | 0) != 0) {
                                if ((c[m >> 2] | 0) < (c[E >> 2] | 0)) {
                                    Pe(c[S >> 2] | 0, c[o >> 2] | 0, c[o >> 2] | 0, c[N >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[O >> 2] | 0, c[(c[l >> 2] | 0) + 12 >> 2] | 0);
                                    break
                                }
                                c[B >> 2] = 0;
                                while (1) {
                                    if ((c[B >> 2] | 0) >= ($(c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[N >> 2] | 0) | 0)) {
                                        break
                                    }
                                    b[(c[o >> 2] | 0) + (c[B >> 2] << 1) >> 1] = b[(c[S >> 2] | 0) + (c[B >> 2] << 1) >> 1] | 0;
                                    c[B >> 2] = (c[B >> 2] | 0) + 1
                                }
                                f = (c[S >> 2] | 0) + (($(c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[N >> 2] | 0) | 0) << 1) | 0;
                                e = (c[o >> 2] | 0) + (($(c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[N >> 2] | 0) | 0) << 1) | 0;
                                d = (c[o >> 2] | 0) + (($(c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[N >> 2] | 0) | 0) << 1) | 0;
                                Pe(f, e, d, c[N >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0, c[O >> 2] | 0, c[(c[l >> 2] | 0) + 12 >> 2] | 0)
                            }
                        } while (0);
                        h:do {
                            if ((c[(c[l >> 2] | 0) + 40 >> 2] | 0) != 0) {
                                c[t >> 2] = Qe(16384 + (((c[(c[l >> 2] | 0) + 40 >> 2] & 65535) << 16 >> 16) * 21771 | 0) >> 15 & 65535) | 0;
                                c[B >> 2] = 0;
                                while (1) {
                                    if ((c[B >> 2] | 0) >= ($(c[s >> 2] | 0, c[(c[l >> 2] | 0) + 8 >> 2] | 0) | 0)) {
                                        break h
                                    }
                                    d = $(b[(c[o >> 2] | 0) + (c[B >> 2] << 1) >> 1] | 0, (c[t >> 2] >> 16 & 65535) << 16 >> 16) | 0;
                                    c[A >> 2] = d + (($(b[(c[o >> 2] | 0) + (c[B >> 2] << 1) >> 1] | 0, c[t >> 2] & 65535 & 65535) | 0) + 32768 >> 16);
                                    if ((c[A >> 2] | 0) > 32767) {
                                        y = 32767
                                    } else {
                                        y = (c[A >> 2] | 0) < -32767 ? -32767 : c[A >> 2] | 0
                                    }
                                    b[(c[o >> 2] | 0) + (c[B >> 2] << 1) >> 1] = y;
                                    c[B >> 2] = (c[B >> 2] | 0) + 1
                                }
                            }
                        } while (0);
                        if ((c[w >> 2] | 0) <= 1) {
                            c[(c[l >> 2] | 0) + 72 >> 2] = 0
                        } else {
                            c[(c[l >> 2] | 0) + 72 >> 2] = c[v + 28 >> 2] ^ c[z >> 2]
                        }
                        c[(c[l >> 2] | 0) + 56 >> 2] = c[C >> 2];
                        if ((c[u >> 2] | 0) != 0) {
                            o = (c[x >> 2] | 0) != 0 ^ 1
                        } else {
                            o = 0
                        }
                        c[(c[l >> 2] | 0) + 64 >> 2] = o & 1;
                        if ((c[r >> 2] | 0) >= 0) {
                            Ee() | 0
                        }
                        c[n >> 2] = (c[r >> 2] | 0) < 0 ? c[r >> 2] | 0 : c[m >> 2] | 0;
                        c[q >> 2] = 1
                    }
                } while (0);
                na(c[p >> 2] | 0);
                d = c[n >> 2] | 0;
                i = k;
                return d | 0
            }
            function Ee() {
                return 0
            }
            function Fe(b) {
                b = b | 0;
                var d = 0, e = 0, f = 0;
                e = i;
                i = i + 16 | 0;
                f = e + 4 | 0;
                d = e;
                c[f >> 2] = b;
                do {
                    if ((a[c[f >> 2] >> 0] & 128 | 0) == 0) {
                        if ((a[c[f >> 2] >> 0] & 96 | 0) == 96) {
                            c[d >> 2] = 1001;
                            break
                        } else {
                            c[d >> 2] = 1e3;
                            break
                        }
                    } else {
                        c[d >> 2] = 1002
                    }
                } while (0);
                i = e;
                return c[d >> 2] | 0
            }
            function Ge(b) {
                b = b | 0;
                var e = 0, f = 0, g = 0;
                e = i;
                i = i + 16 | 0;
                g = e + 4 | 0;
                f = e;
                c[g >> 2] = b;
                b = d[c[g >> 2] >> 0] | 0;
                if ((a[c[g >> 2] >> 0] & 128 | 0) != 0) {
                    b = 1102 + (b >> 5 & 3) | 0;
                    c[f >> 2] = b;
                    c[f >> 2] = (c[f >> 2] | 0) == 1102 ? 1101 : b;
                    b = c[f >> 2] | 0;
                    i = e;
                    return b | 0
                }
                g = d[c[g >> 2] >> 0] | 0;
                if ((b & 96 | 0) == 96) {
                    c[f >> 2] = (g & 16 | 0) != 0 ? 1105 : 1104;
                    b = c[f >> 2] | 0;
                    i = e;
                    return b | 0
                } else {
                    c[f >> 2] = 1101 + (g >> 5 & 3);
                    b = c[f >> 2] | 0;
                    i = e;
                    return b | 0
                }
                return 0
            }
            function He(b) {
                b = b | 0;
                var d = 0, e = 0;
                e = i;
                i = i + 16 | 0;
                d = e;
                c[d >> 2] = b;
                i = e;
                return ((a[c[d >> 2] >> 0] & 4 | 0) != 0 ? 2 : 1) | 0
            }
            function Ie(a, d, e, f, h, j) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                h = h | 0;
                j = j | 0;
                var k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0;
                t = i;
                i = i + 48 | 0;
                q = t + 4 | 0;
                r = t + 16 | 0;
                s = t + 36 | 0;
                l = t;
                v = t + 32 | 0;
                k = t + 40 | 0;
                u = t + 44 | 0;
                n = t + 24 | 0;
                m = t + 20 | 0;
                w = t + 8 | 0;
                p = t + 12 | 0;
                o = t + 28 | 0;
                c[r >> 2] = a;
                c[s >> 2] = d;
                c[l >> 2] = e;
                c[v >> 2] = f;
                c[k >> 2] = h;
                c[u >> 2] = j;
                if ((c[k >> 2] | 0) <= 0) {
                    c[q >> 2] = -1;
                    a = c[q >> 2] | 0;
                    i = t;
                    return a | 0
                }
                do {
                    if (((c[s >> 2] | 0) != 0 ? (c[l >> 2] | 0) > 0 : 0) ? (c[u >> 2] | 0) == 0 : 0) {
                        c[w >> 2] = Je(c[r >> 2] | 0, c[s >> 2] | 0, c[l >> 2] | 0) | 0;
                        if ((c[w >> 2] | 0) > 0) {
                            c[k >> 2] = (c[k >> 2] | 0) < (c[w >> 2] | 0) ? c[k >> 2] | 0 : c[w >> 2] | 0;
                            break
                        }
                        c[q >> 2] = -4;
                        a = c[q >> 2] | 0;
                        i = t;
                        return a | 0
                    }
                } while (0);
                a = $(c[k >> 2] | 0, c[(c[r >> 2] | 0) + 8 >> 2] | 0) | 0;
                c[p >> 2] = ia() | 0;
                w = i;
                i = i + ((2 * a | 0) + 15 & -16) | 0;
                c[n >> 2] = Ce(c[r >> 2] | 0, c[s >> 2] | 0, c[l >> 2] | 0, w, c[k >> 2] | 0, c[u >> 2] | 0, 0, 0, 0) | 0;
                a:do {
                    if ((c[n >> 2] | 0) > 0) {
                        c[m >> 2] = 0;
                        while (1) {
                            if ((c[m >> 2] | 0) >= ($(c[n >> 2] | 0, c[(c[r >> 2] | 0) + 8 >> 2] | 0) | 0)) {
                                break a
                            }
                            g[(c[v >> 2] | 0) + (c[m >> 2] << 2) >> 2] = +(b[w + (c[m >> 2] << 1) >> 1] | 0) * 30517578125.0e-15;
                            c[m >> 2] = (c[m >> 2] | 0) + 1
                        }
                    }
                } while (0);
                c[q >> 2] = c[n >> 2];
                c[o >> 2] = 1;
                na(c[p >> 2] | 0);
                a = c[q >> 2] | 0;
                i = t;
                return a | 0
            }
            function Je(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0;
                e = i;
                i = i + 16 | 0;
                f = e + 8 | 0;
                h = e + 4 | 0;
                g = e;
                c[f >> 2] = a;
                c[h >> 2] = b;
                c[g >> 2] = d;
                a = Me(c[h >> 2] | 0, c[g >> 2] | 0, c[(c[f >> 2] | 0) + 12 >> 2] | 0) | 0;
                i = e;
                return a | 0
            }
            function Ke(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                Be(c[d >> 2] | 0);
                i = b;
            }
            function Le(b, d) {
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0;
                f = i;
                i = i + 16 | 0;
                e = f + 12 | 0;
                g = f + 8 | 0;
                h = f + 4 | 0;
                j = f;
                c[g >> 2] = b;
                c[h >> 2] = d;
                do {
                    if ((c[h >> 2] | 0) >= 1) {
                        c[j >> 2] = a[c[g >> 2] >> 0] & 3;
                        if ((c[j >> 2] | 0) == 0) {
                            c[e >> 2] = 1;
                            break
                        }
                        if ((c[j >> 2] | 0) != 3) {
                            c[e >> 2] = 2;
                            break
                        }
                        if ((c[h >> 2] | 0) < 2) {
                            c[e >> 2] = -4;
                            break
                        } else {
                            c[e >> 2] = a[(c[g >> 2] | 0) + 1 >> 0] & 63;
                            break
                        }
                    } else {
                        c[e >> 2] = -1
                    }
                } while (0);
                i = f;
                return c[e >> 2] | 0
            }
            function Me(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                e = i;
                i = i + 32 | 0;
                f = e + 20 | 0;
                h = e + 16 | 0;
                l = e + 12 | 0;
                j = e + 8 | 0;
                g = e + 4 | 0;
                k = e;
                c[h >> 2] = a;
                c[l >> 2] = b;
                c[j >> 2] = d;
                c[k >> 2] = Le(c[h >> 2] | 0, c[l >> 2] | 0) | 0;
                d = c[k >> 2] | 0;
                if ((c[k >> 2] | 0) < 0) {
                    c[f >> 2] = d;
                    l = c[f >> 2] | 0;
                    i = e;
                    return l | 0
                }
                c[g >> 2] = $(d, te(c[h >> 2] | 0, c[j >> 2] | 0) | 0) | 0;
                if (((c[g >> 2] | 0) * 25 | 0) > ((c[j >> 2] | 0) * 3 | 0)) {
                    c[f >> 2] = -4;
                    l = c[f >> 2] | 0;
                    i = e;
                    return l | 0
                } else {
                    c[f >> 2] = c[g >> 2];
                    l = c[f >> 2] | 0;
                    i = e;
                    return l | 0
                }
                return 0
            }
            function Ne(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                a = c[(c[d >> 2] | 0) + 20 >> 2] | 0;
                a = a - (32 - (We(c[(c[d >> 2] | 0) + 28 >> 2] | 0) | 0)) | 0;
                i = b;
                return a | 0
            }
            function Oe(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                i = i + 16 | 0;
                d = b;
                c[d >> 2] = a;
                if ((c[d >> 2] | 0) <= 32767) {
                    if ((c[d >> 2] | 0) < -32768) {
                        a = -32768
                    } else {
                        a = (c[d >> 2] & 65535) << 16 >> 16
                    }
                } else {
                    a = 32767
                }
                i = b;
                return a & 65535 | 0
            }
            function Pe(a, d, e, f, g, h, j) {
                a = a | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                var k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0;
                s = i;
                i = i + 48 | 0;
                t = s + 36 | 0;
                k = s + 16 | 0;
                u = s + 28 | 0;
                m = s + 4 | 0;
                o = s + 32 | 0;
                q = s;
                v = s + 12 | 0;
                l = s + 24 | 0;
                n = s + 20 | 0;
                p = s + 8 | 0;
                r = s + 40 | 0;
                c[t >> 2] = a;
                c[k >> 2] = d;
                c[u >> 2] = e;
                c[m >> 2] = f;
                c[o >> 2] = g;
                c[q >> 2] = h;
                c[v >> 2] = j;
                c[p >> 2] = 48e3 / (c[v >> 2] | 0) | 0;
                c[n >> 2] = 0;
                while (1) {
                    if ((c[n >> 2] | 0) >= (c[o >> 2] | 0)) {
                        break
                    }
                    c[l >> 2] = 0;
                    while (1) {
                        if ((c[l >> 2] | 0) >= (c[m >> 2] | 0)) {
                            break
                        }
                        a = $(c[l >> 2] | 0, c[p >> 2] | 0) | 0;
                        v = $(c[l >> 2] | 0, c[p >> 2] | 0) | 0;
                        b[r >> 1] = ($(b[(c[q >> 2] | 0) + (a << 1) >> 1] | 0, b[(c[q >> 2] | 0) + (v << 1) >> 1] | 0) | 0) >> 15;
                        v = $(c[l >> 2] | 0, c[o >> 2] | 0) | 0;
                        v = $(b[r >> 1] | 0, b[(c[k >> 2] | 0) + (v + (c[n >> 2] | 0) << 1) >> 1] | 0) | 0;
                        a = $(c[l >> 2] | 0, c[o >> 2] | 0) | 0;
                        a = v + ($((32767 - (b[r >> 1] | 0) & 65535) << 16 >> 16, b[(c[t >> 2] | 0) + (a + (c[n >> 2] | 0) << 1) >> 1] | 0) | 0) >> 15 & 65535;
                        v = $(c[l >> 2] | 0, c[o >> 2] | 0) | 0;
                        b[(c[u >> 2] | 0) + (v + (c[n >> 2] | 0) << 1) >> 1] = a;
                        c[l >> 2] = (c[l >> 2] | 0) + 1
                    }
                    c[n >> 2] = (c[n >> 2] | 0) + 1
                }
                i = s;
            }
            function Qe(a) {
                a = a | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0;
                d = i;
                i = i + 16 | 0;
                e = d + 4 | 0;
                g = d + 10 | 0;
                f = d;
                h = d + 8 | 0;
                b[g >> 1] = a;
                c[f >> 2] = b[g >> 1] >> 10;
                if ((c[f >> 2] | 0) > 14) {
                    c[e >> 2] = 2130706432;
                    h = c[e >> 2] | 0;
                    i = d;
                    return h | 0
                }
                if ((c[f >> 2] | 0) < -15) {
                    c[e >> 2] = 0;
                    h = c[e >> 2] | 0;
                    i = d;
                    return h | 0
                }
                b[h >> 1] = Re((b[g >> 1] | 0) - (((c[f >> 2] & 65535) << 10 & 65535) << 16 >> 16) & 65535) | 0;
                g = b[h >> 1] | 0;
                a = 0 - (c[f >> 2] | 0) - 2 | 0;
                if ((0 - (c[f >> 2] | 0) - 2 | 0) > 0) {
                    f = g >> a
                } else {
                    f = g << 0 - a
                }
                c[e >> 2] = f;
                h = c[e >> 2] | 0;
                i = d;
                return h | 0
            }
            function Re(a) {
                a = a | 0;
                var c = 0, d = 0, f = 0;
                c = i;
                i = i + 16 | 0;
                f = c + 2 | 0;
                d = c;
                b[f >> 1] = a;
                b[d >> 1] = e[f >> 1] << 4;
                a = (16383 + ((($(b[d >> 1] | 0, (22804 + ((($(b[d >> 1] | 0, (14819 + (((b[d >> 1] | 0) * 10204 >> 15 & 65535) << 16 >> 16) & 65535) << 16 >> 16) | 0) >> 15 & 65535) << 16 >> 16) & 65535) << 16 >> 16) | 0) >> 15 & 65535) << 16 >> 16) & 65535) << 16 >> 16;
                i = c;
                return a | 0
            }
            function Se(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0,
                    r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0,
                    F = 0, G = 0, H = 0;
                b = i;
                do {
                    if (a >>> 0 < 245) {
                        if (a >>> 0 < 11) {
                            a = 16
                        } else {
                            a = a + 11 & -8
                        }
                        v = a >>> 3;
                        p = c[4848] | 0;
                        w = p >>> v;
                        if ((w & 3 | 0) != 0) {
                            h = (w & 1 ^ 1) + v | 0;
                            g = h << 1;
                            e = 19432 + (g << 2) | 0;
                            g = 19432 + (g + 2 << 2) | 0;
                            j = c[g >> 2] | 0;
                            d = j + 8 | 0;
                            f = c[d >> 2] | 0;
                            do {
                                if ((e | 0) != (f | 0)) {
                                    if (f >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                        ga()
                                    }
                                    k = f + 12 | 0;
                                    if ((c[k >> 2] | 0) == (j | 0)) {
                                        c[k >> 2] = e;
                                        c[g >> 2] = f;
                                        break
                                    } else {
                                        ga()
                                    }
                                } else {
                                    c[4848] = p & ~(1 << h)
                                }
                            } while (0);
                            H = h << 3;
                            c[j + 4 >> 2] = H | 3;
                            H = j + (H | 4) | 0;
                            c[H >> 2] = c[H >> 2] | 1;
                            H = d;
                            i = b;
                            return H | 0
                        }
                        if (a >>> 0 > (c[19400 >> 2] | 0) >>> 0) {
                            if ((w | 0) != 0) {
                                h = 2 << v;
                                h = w << v & (h | 0 - h);
                                h = (h & 0 - h) + -1 | 0;
                                d = h >>> 12 & 16;
                                h = h >>> d;
                                f = h >>> 5 & 8;
                                h = h >>> f;
                                g = h >>> 2 & 4;
                                h = h >>> g;
                                e = h >>> 1 & 2;
                                h = h >>> e;
                                j = h >>> 1 & 1;
                                j = (f | d | g | e | j) + (h >>> j) | 0;
                                h = j << 1;
                                e = 19432 + (h << 2) | 0;
                                h = 19432 + (h + 2 << 2) | 0;
                                g = c[h >> 2] | 0;
                                d = g + 8 | 0;
                                f = c[d >> 2] | 0;
                                do {
                                    if ((e | 0) != (f | 0)) {
                                        if (f >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                            ga()
                                        }
                                        k = f + 12 | 0;
                                        if ((c[k >> 2] | 0) == (g | 0)) {
                                            c[k >> 2] = e;
                                            c[h >> 2] = f;
                                            break
                                        } else {
                                            ga()
                                        }
                                    } else {
                                        c[4848] = p & ~(1 << j)
                                    }
                                } while (0);
                                h = j << 3;
                                f = h - a | 0;
                                c[g + 4 >> 2] = a | 3;
                                e = g + a | 0;
                                c[g + (a | 4) >> 2] = f | 1;
                                c[g + h >> 2] = f;
                                h = c[19400 >> 2] | 0;
                                if ((h | 0) != 0) {
                                    g = c[19412 >> 2] | 0;
                                    k = h >>> 3;
                                    j = k << 1;
                                    h = 19432 + (j << 2) | 0;
                                    l = c[4848] | 0;
                                    k = 1 << k;
                                    if ((l & k | 0) != 0) {
                                        j = 19432 + (j + 2 << 2) | 0;
                                        k = c[j >> 2] | 0;
                                        if (k >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                            ga()
                                        } else {
                                            D = j;
                                            C = k
                                        }
                                    } else {
                                        c[4848] = l | k;
                                        D = 19432 + (j + 2 << 2) | 0;
                                        C = h
                                    }
                                    c[D >> 2] = g;
                                    c[C + 12 >> 2] = g;
                                    c[g + 8 >> 2] = C;
                                    c[g + 12 >> 2] = h
                                }
                                c[19400 >> 2] = f;
                                c[19412 >> 2] = e;
                                H = d;
                                i = b;
                                return H | 0
                            }
                            p = c[19396 >> 2] | 0;
                            if ((p | 0) != 0) {
                                e = (p & 0 - p) + -1 | 0;
                                G = e >>> 12 & 16;
                                e = e >>> G;
                                F = e >>> 5 & 8;
                                e = e >>> F;
                                H = e >>> 2 & 4;
                                e = e >>> H;
                                f = e >>> 1 & 2;
                                e = e >>> f;
                                d = e >>> 1 & 1;
                                d = c[19696 + ((F | G | H | f | d) + (e >>> d) << 2) >> 2] | 0;
                                e = (c[d + 4 >> 2] & -8) - a | 0;
                                f = d;
                                while (1) {
                                    g = c[f + 16 >> 2] | 0;
                                    if ((g | 0) == 0) {
                                        g = c[f + 20 >> 2] | 0;
                                        if ((g | 0) == 0) {
                                            break
                                        }
                                    }
                                    f = (c[g + 4 >> 2] & -8) - a | 0;
                                    H = f >>> 0 < e >>> 0;
                                    e = H ? f : e;
                                    f = g;
                                    d = H ? g : d
                                }
                                h = c[19408 >> 2] | 0;
                                if (d >>> 0 < h >>> 0) {
                                    ga()
                                }
                                f = d + a | 0;
                                if (!(d >>> 0 < f >>> 0)) {
                                    ga()
                                }
                                g = c[d + 24 >> 2] | 0;
                                k = c[d + 12 >> 2] | 0;
                                do {
                                    if ((k | 0) == (d | 0)) {
                                        k = d + 20 | 0;
                                        j = c[k >> 2] | 0;
                                        if ((j | 0) == 0) {
                                            k = d + 16 | 0;
                                            j = c[k >> 2] | 0;
                                            if ((j | 0) == 0) {
                                                B = 0;
                                                break
                                            }
                                        }
                                        while (1) {
                                            l = j + 20 | 0;
                                            m = c[l >> 2] | 0;
                                            if ((m | 0) != 0) {
                                                j = m;
                                                k = l;
                                                continue
                                            }
                                            m = j + 16 | 0;
                                            l = c[m >> 2] | 0;
                                            if ((l | 0) == 0) {
                                                break
                                            } else {
                                                j = l;
                                                k = m
                                            }
                                        }
                                        if (k >>> 0 < h >>> 0) {
                                            ga()
                                        } else {
                                            c[k >> 2] = 0;
                                            B = j;
                                            break
                                        }
                                    } else {
                                        j = c[d + 8 >> 2] | 0;
                                        if (j >>> 0 < h >>> 0) {
                                            ga()
                                        }
                                        h = j + 12 | 0;
                                        if ((c[h >> 2] | 0) != (d | 0)) {
                                            ga()
                                        }
                                        l = k + 8 | 0;
                                        if ((c[l >> 2] | 0) == (d | 0)) {
                                            c[h >> 2] = k;
                                            c[l >> 2] = j;
                                            B = k;
                                            break
                                        } else {
                                            ga()
                                        }
                                    }
                                } while (0);
                                do {
                                    if ((g | 0) != 0) {
                                        h = c[d + 28 >> 2] | 0;
                                        j = 19696 + (h << 2) | 0;
                                        if ((d | 0) == (c[j >> 2] | 0)) {
                                            c[j >> 2] = B;
                                            if ((B | 0) == 0) {
                                                c[19396 >> 2] = c[19396 >> 2] & ~(1 << h);
                                                break
                                            }
                                        } else {
                                            if (g >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                ga()
                                            }
                                            h = g + 16 | 0;
                                            if ((c[h >> 2] | 0) == (d | 0)) {
                                                c[h >> 2] = B
                                            } else {
                                                c[g + 20 >> 2] = B
                                            }
                                            if ((B | 0) == 0) {
                                                break
                                            }
                                        }
                                        if (B >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                            ga()
                                        }
                                        c[B + 24 >> 2] = g;
                                        g = c[d + 16 >> 2] | 0;
                                        do {
                                            if ((g | 0) != 0) {
                                                if (g >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                    ga()
                                                } else {
                                                    c[B + 16 >> 2] = g;
                                                    c[g + 24 >> 2] = B;
                                                    break
                                                }
                                            }
                                        } while (0);
                                        g = c[d + 20 >> 2] | 0;
                                        if ((g | 0) != 0) {
                                            if (g >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                ga()
                                            } else {
                                                c[B + 20 >> 2] = g;
                                                c[g + 24 >> 2] = B;
                                                break
                                            }
                                        }
                                    }
                                } while (0);
                                if (e >>> 0 < 16) {
                                    H = e + a | 0;
                                    c[d + 4 >> 2] = H | 3;
                                    H = d + (H + 4) | 0;
                                    c[H >> 2] = c[H >> 2] | 1
                                } else {
                                    c[d + 4 >> 2] = a | 3;
                                    c[d + (a | 4) >> 2] = e | 1;
                                    c[d + (e + a) >> 2] = e;
                                    h = c[19400 >> 2] | 0;
                                    if ((h | 0) != 0) {
                                        g = c[19412 >> 2] | 0;
                                        l = h >>> 3;
                                        j = l << 1;
                                        h = 19432 + (j << 2) | 0;
                                        k = c[4848] | 0;
                                        l = 1 << l;
                                        if ((k & l | 0) != 0) {
                                            j = 19432 + (j + 2 << 2) | 0;
                                            k = c[j >> 2] | 0;
                                            if (k >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                ga()
                                            } else {
                                                A = j;
                                                z = k
                                            }
                                        } else {
                                            c[4848] = k | l;
                                            A = 19432 + (j + 2 << 2) | 0;
                                            z = h
                                        }
                                        c[A >> 2] = g;
                                        c[z + 12 >> 2] = g;
                                        c[g + 8 >> 2] = z;
                                        c[g + 12 >> 2] = h
                                    }
                                    c[19400 >> 2] = e;
                                    c[19412 >> 2] = f
                                }
                                H = d + 8 | 0;
                                i = b;
                                return H | 0
                            }
                        }
                    } else {
                        if (!(a >>> 0 > 4294967231)) {
                            z = a + 11 | 0;
                            a = z & -8;
                            B = c[19396 >> 2] | 0;
                            if ((B | 0) != 0) {
                                A = 0 - a | 0;
                                z = z >>> 8;
                                if ((z | 0) != 0) {
                                    if (a >>> 0 > 16777215) {
                                        C = 31
                                    } else {
                                        G = (z + 1048320 | 0) >>> 16 & 8;
                                        H = z << G;
                                        F = (H + 520192 | 0) >>> 16 & 4;
                                        H = H << F;
                                        C = (H + 245760 | 0) >>> 16 & 2;
                                        C = 14 - (F | G | C) + (H << C >>> 15) | 0;
                                        C = a >>> (C + 7 | 0) & 1 | C << 1
                                    }
                                } else {
                                    C = 0
                                }
                                D = c[19696 + (C << 2) >> 2] | 0;
                                a:do {
                                    if ((D | 0) == 0) {
                                        F = 0;
                                        z = 0
                                    } else {
                                        if ((C | 0) == 31) {
                                            z = 0
                                        } else {
                                            z = 25 - (C >>> 1) | 0
                                        }
                                        F = 0;
                                        E = a << z;
                                        z = 0;
                                        while (1) {
                                            H = c[D + 4 >> 2] & -8;
                                            G = H - a | 0;
                                            if (G >>> 0 < A >>> 0) {
                                                if ((H | 0) == (a | 0)) {
                                                    A = G;
                                                    F = D;
                                                    z = D;
                                                    break a
                                                } else {
                                                    A = G;
                                                    z = D
                                                }
                                            }
                                            H = c[D + 20 >> 2] | 0;
                                            D = c[D + (E >>> 31 << 2) + 16 >> 2] | 0;
                                            F = (H | 0) == 0 | (H | 0) == (D | 0) ? F : H;
                                            if ((D | 0) == 0) {
                                                break
                                            } else {
                                                E = E << 1
                                            }
                                        }
                                    }
                                } while (0);
                                if ((F | 0) == 0 & (z | 0) == 0) {
                                    H = 2 << C;
                                    B = B & (H | 0 - H);
                                    if ((B | 0) == 0) {
                                        break
                                    }
                                    H = (B & 0 - B) + -1 | 0;
                                    D = H >>> 12 & 16;
                                    H = H >>> D;
                                    C = H >>> 5 & 8;
                                    H = H >>> C;
                                    E = H >>> 2 & 4;
                                    H = H >>> E;
                                    G = H >>> 1 & 2;
                                    H = H >>> G;
                                    F = H >>> 1 & 1;
                                    F = c[19696 + ((C | D | E | G | F) + (H >>> F) << 2) >> 2] | 0
                                }
                                if ((F | 0) != 0) {
                                    while (1) {
                                        H = (c[F + 4 >> 2] & -8) - a | 0;
                                        B = H >>> 0 < A >>> 0;
                                        A = B ? H : A;
                                        z = B ? F : z;
                                        B = c[F + 16 >> 2] | 0;
                                        if ((B | 0) != 0) {
                                            F = B;
                                            continue
                                        }
                                        F = c[F + 20 >> 2] | 0;
                                        if ((F | 0) == 0) {
                                            break
                                        }
                                    }
                                }
                                if ((z | 0) != 0 ? A >>> 0 < ((c[19400 >> 2] | 0) - a | 0) >>> 0 : 0) {
                                    f = c[19408 >> 2] | 0;
                                    if (z >>> 0 < f >>> 0) {
                                        ga()
                                    }
                                    d = z + a | 0;
                                    if (!(z >>> 0 < d >>> 0)) {
                                        ga()
                                    }
                                    e = c[z + 24 >> 2] | 0;
                                    h = c[z + 12 >> 2] | 0;
                                    do {
                                        if ((h | 0) == (z | 0)) {
                                            h = z + 20 | 0;
                                            g = c[h >> 2] | 0;
                                            if ((g | 0) == 0) {
                                                h = z + 16 | 0;
                                                g = c[h >> 2] | 0;
                                                if ((g | 0) == 0) {
                                                    x = 0;
                                                    break
                                                }
                                            }
                                            while (1) {
                                                j = g + 20 | 0;
                                                k = c[j >> 2] | 0;
                                                if ((k | 0) != 0) {
                                                    g = k;
                                                    h = j;
                                                    continue
                                                }
                                                j = g + 16 | 0;
                                                k = c[j >> 2] | 0;
                                                if ((k | 0) == 0) {
                                                    break
                                                } else {
                                                    g = k;
                                                    h = j
                                                }
                                            }
                                            if (h >>> 0 < f >>> 0) {
                                                ga()
                                            } else {
                                                c[h >> 2] = 0;
                                                x = g;
                                                break
                                            }
                                        } else {
                                            g = c[z + 8 >> 2] | 0;
                                            if (g >>> 0 < f >>> 0) {
                                                ga()
                                            }
                                            f = g + 12 | 0;
                                            if ((c[f >> 2] | 0) != (z | 0)) {
                                                ga()
                                            }
                                            j = h + 8 | 0;
                                            if ((c[j >> 2] | 0) == (z | 0)) {
                                                c[f >> 2] = h;
                                                c[j >> 2] = g;
                                                x = h;
                                                break
                                            } else {
                                                ga()
                                            }
                                        }
                                    } while (0);
                                    do {
                                        if ((e | 0) != 0) {
                                            g = c[z + 28 >> 2] | 0;
                                            f = 19696 + (g << 2) | 0;
                                            if ((z | 0) == (c[f >> 2] | 0)) {
                                                c[f >> 2] = x;
                                                if ((x | 0) == 0) {
                                                    c[19396 >> 2] = c[19396 >> 2] & ~(1 << g);
                                                    break
                                                }
                                            } else {
                                                if (e >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                    ga()
                                                }
                                                f = e + 16 | 0;
                                                if ((c[f >> 2] | 0) == (z | 0)) {
                                                    c[f >> 2] = x
                                                } else {
                                                    c[e + 20 >> 2] = x
                                                }
                                                if ((x | 0) == 0) {
                                                    break
                                                }
                                            }
                                            if (x >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                ga()
                                            }
                                            c[x + 24 >> 2] = e;
                                            e = c[z + 16 >> 2] | 0;
                                            do {
                                                if ((e | 0) != 0) {
                                                    if (e >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                        ga()
                                                    } else {
                                                        c[x + 16 >> 2] = e;
                                                        c[e + 24 >> 2] = x;
                                                        break
                                                    }
                                                }
                                            } while (0);
                                            e = c[z + 20 >> 2] | 0;
                                            if ((e | 0) != 0) {
                                                if (e >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                    ga()
                                                } else {
                                                    c[x + 20 >> 2] = e;
                                                    c[e + 24 >> 2] = x;
                                                    break
                                                }
                                            }
                                        }
                                    } while (0);
                                    b:do {
                                        if (!(A >>> 0 < 16)) {
                                            c[z + 4 >> 2] = a | 3;
                                            c[z + (a | 4) >> 2] = A | 1;
                                            c[z + (A + a) >> 2] = A;
                                            f = A >>> 3;
                                            if (A >>> 0 < 256) {
                                                h = f << 1;
                                                e = 19432 + (h << 2) | 0;
                                                g = c[4848] | 0;
                                                f = 1 << f;
                                                do {
                                                    if ((g & f | 0) == 0) {
                                                        c[4848] = g | f;
                                                        w = 19432 + (h + 2 << 2) | 0;
                                                        v = e
                                                    } else {
                                                        f = 19432 + (h + 2 << 2) | 0;
                                                        g = c[f >> 2] | 0;
                                                        if (!(g >>> 0 < (c[19408 >> 2] | 0) >>> 0)) {
                                                            w = f;
                                                            v = g;
                                                            break
                                                        }
                                                        ga()
                                                    }
                                                } while (0);
                                                c[w >> 2] = d;
                                                c[v + 12 >> 2] = d;
                                                c[z + (a + 8) >> 2] = v;
                                                c[z + (a + 12) >> 2] = e;
                                                break
                                            }
                                            e = A >>> 8;
                                            if ((e | 0) != 0) {
                                                if (A >>> 0 > 16777215) {
                                                    e = 31
                                                } else {
                                                    G = (e + 1048320 | 0) >>> 16 & 8;
                                                    H = e << G;
                                                    F = (H + 520192 | 0) >>> 16 & 4;
                                                    H = H << F;
                                                    e = (H + 245760 | 0) >>> 16 & 2;
                                                    e = 14 - (F | G | e) + (H << e >>> 15) | 0;
                                                    e = A >>> (e + 7 | 0) & 1 | e << 1
                                                }
                                            } else {
                                                e = 0
                                            }
                                            f = 19696 + (e << 2) | 0;
                                            c[z + (a + 28) >> 2] = e;
                                            c[z + (a + 20) >> 2] = 0;
                                            c[z + (a + 16) >> 2] = 0;
                                            h = c[19396 >> 2] | 0;
                                            g = 1 << e;
                                            if ((h & g | 0) == 0) {
                                                c[19396 >> 2] = h | g;
                                                c[f >> 2] = d;
                                                c[z + (a + 24) >> 2] = f;
                                                c[z + (a + 12) >> 2] = d;
                                                c[z + (a + 8) >> 2] = d;
                                                break
                                            }
                                            f = c[f >> 2] | 0;
                                            if ((e | 0) == 31) {
                                                e = 0
                                            } else {
                                                e = 25 - (e >>> 1) | 0
                                            }
                                            c:do {
                                                if ((c[f + 4 >> 2] & -8 | 0) != (A | 0)) {
                                                    e = A << e;
                                                    while (1) {
                                                        g = f + (e >>> 31 << 2) + 16 | 0;
                                                        h = c[g >> 2] | 0;
                                                        if ((h | 0) == 0) {
                                                            break
                                                        }
                                                        if ((c[h + 4 >> 2] & -8 | 0) == (A | 0)) {
                                                            p = h;
                                                            break c
                                                        } else {
                                                            e = e << 1;
                                                            f = h
                                                        }
                                                    }
                                                    if (g >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                        ga()
                                                    } else {
                                                        c[g >> 2] = d;
                                                        c[z + (a + 24) >> 2] = f;
                                                        c[z + (a + 12) >> 2] = d;
                                                        c[z + (a + 8) >> 2] = d;
                                                        break b
                                                    }
                                                } else {
                                                    p = f
                                                }
                                            } while (0);
                                            f = p + 8 | 0;
                                            e = c[f >> 2] | 0;
                                            g = c[19408 >> 2] | 0;
                                            if (p >>> 0 < g >>> 0) {
                                                ga()
                                            }
                                            if (e >>> 0 < g >>> 0) {
                                                ga()
                                            } else {
                                                c[e + 12 >> 2] = d;
                                                c[f >> 2] = d;
                                                c[z + (a + 8) >> 2] = e;
                                                c[z + (a + 12) >> 2] = p;
                                                c[z + (a + 24) >> 2] = 0;
                                                break
                                            }
                                        } else {
                                            H = A + a | 0;
                                            c[z + 4 >> 2] = H | 3;
                                            H = z + (H + 4) | 0;
                                            c[H >> 2] = c[H >> 2] | 1
                                        }
                                    } while (0);
                                    H = z + 8 | 0;
                                    i = b;
                                    return H | 0
                                }
                            }
                        } else {
                            a = -1
                        }
                    }
                } while (0);
                p = c[19400 >> 2] | 0;
                if (!(a >>> 0 > p >>> 0)) {
                    e = p - a | 0;
                    d = c[19412 >> 2] | 0;
                    if (e >>> 0 > 15) {
                        c[19412 >> 2] = d + a;
                        c[19400 >> 2] = e;
                        c[d + (a + 4) >> 2] = e | 1;
                        c[d + p >> 2] = e;
                        c[d + 4 >> 2] = a | 3
                    } else {
                        c[19400 >> 2] = 0;
                        c[19412 >> 2] = 0;
                        c[d + 4 >> 2] = p | 3;
                        H = d + (p + 4) | 0;
                        c[H >> 2] = c[H >> 2] | 1
                    }
                    H = d + 8 | 0;
                    i = b;
                    return H | 0
                }
                p = c[19404 >> 2] | 0;
                if (a >>> 0 < p >>> 0) {
                    G = p - a | 0;
                    c[19404 >> 2] = G;
                    H = c[19416 >> 2] | 0;
                    c[19416 >> 2] = H + a;
                    c[H + (a + 4) >> 2] = G | 1;
                    c[H + 4 >> 2] = a | 3;
                    H = H + 8 | 0;
                    i = b;
                    return H | 0
                }
                do {
                    if ((c[4966] | 0) == 0) {
                        p = oa(30) | 0;
                        if ((p + -1 & p | 0) == 0) {
                            c[19872 >> 2] = p;
                            c[19868 >> 2] = p;
                            c[19876 >> 2] = -1;
                            c[19880 >> 2] = -1;
                            c[19884 >> 2] = 0;
                            c[19836 >> 2] = 0;
                            c[4966] = (ka(0) | 0) & -16 ^ 1431655768;
                            break
                        } else {
                            ga()
                        }
                    }
                } while (0);
                w = a + 48 | 0;
                p = c[19872 >> 2] | 0;
                x = a + 47 | 0;
                z = p + x | 0;
                p = 0 - p | 0;
                v = z & p;
                if (!(v >>> 0 > a >>> 0)) {
                    H = 0;
                    i = b;
                    return H | 0
                }
                A = c[19832 >> 2] | 0;
                if ((A | 0) != 0 ? (G = c[19824 >> 2] | 0, H = G + v | 0, H >>> 0 <= G >>> 0 | H >>> 0 > A >>> 0) : 0) {
                    H = 0;
                    i = b;
                    return H | 0
                }
                d:do {
                    if ((c[19836 >> 2] & 4 | 0) == 0) {
                        B = c[19416 >> 2] | 0;
                        e:do {
                            if ((B | 0) != 0) {
                                A = 19840 | 0;
                                while (1) {
                                    C = c[A >> 2] | 0;
                                    if (!(C >>> 0 > B >>> 0) ? (y = A + 4 | 0, (C + (c[y >> 2] | 0) | 0) >>> 0 > B >>> 0) : 0) {
                                        break
                                    }
                                    A = c[A + 8 >> 2] | 0;
                                    if ((A | 0) == 0) {
                                        o = 182;
                                        break e
                                    }
                                }
                                if ((A | 0) != 0) {
                                    B = z - (c[19404 >> 2] | 0) & p;
                                    if (B >>> 0 < 2147483647) {
                                        p = ja(B | 0) | 0;
                                        A = (p | 0) == ((c[A >> 2] | 0) + (c[y >> 2] | 0) | 0);
                                        y = p;
                                        z = B;
                                        p = A ? p : -1;
                                        A = A ? B : 0;
                                        o = 191
                                    } else {
                                        A = 0
                                    }
                                } else {
                                    o = 182
                                }
                            } else {
                                o = 182
                            }
                        } while (0);
                        do {
                            if ((o | 0) == 182) {
                                p = ja(0) | 0;
                                if ((p | 0) != (-1 | 0)) {
                                    z = p;
                                    A = c[19868 >> 2] | 0;
                                    y = A + -1 | 0;
                                    if ((y & z | 0) == 0) {
                                        A = v
                                    } else {
                                        A = v - z + (y + z & 0 - A) | 0
                                    }
                                    y = c[19824 >> 2] | 0;
                                    z = y + A | 0;
                                    if (A >>> 0 > a >>> 0 & A >>> 0 < 2147483647) {
                                        H = c[19832 >> 2] | 0;
                                        if ((H | 0) != 0 ? z >>> 0 <= y >>> 0 | z >>> 0 > H >>> 0 : 0) {
                                            A = 0;
                                            break
                                        }
                                        y = ja(A | 0) | 0;
                                        o = (y | 0) == (p | 0);
                                        z = A;
                                        p = o ? p : -1;
                                        A = o ? A : 0;
                                        o = 191
                                    } else {
                                        A = 0
                                    }
                                } else {
                                    A = 0
                                }
                            }
                        } while (0);
                        f:do {
                            if ((o | 0) == 191) {
                                o = 0 - z | 0;
                                if ((p | 0) != (-1 | 0)) {
                                    q = A;
                                    o = 202;
                                    break d
                                }
                                do {
                                    if ((y | 0) != (-1 | 0) & z >>> 0 < 2147483647 & z >>> 0 < w >>> 0 ? (u = c[19872 >> 2] | 0, u = x - z + u & 0 - u, u >>> 0 < 2147483647) : 0) {
                                        if ((ja(u | 0) | 0) == (-1 | 0)) {
                                            ja(o | 0) | 0;
                                            break f
                                        } else {
                                            z = u + z | 0;
                                            break
                                        }
                                    }
                                } while (0);
                                if ((y | 0) != (-1 | 0)) {
                                    p = y;
                                    q = z;
                                    o = 202;
                                    break d
                                }
                            }
                        } while (0);
                        c[19836 >> 2] = c[19836 >> 2] | 4;
                        o = 199
                    } else {
                        A = 0;
                        o = 199
                    }
                } while (0);
                if ((((o | 0) == 199 ? v >>> 0 < 2147483647 : 0) ? (t = ja(v | 0) | 0, s = ja(0) | 0, (s | 0) != (-1 | 0) & (t | 0) != (-1 | 0) & t >>> 0 < s >>> 0) : 0) ? (r = s - t | 0, q = r >>> 0 > (a + 40 | 0) >>> 0, q) : 0) {
                    p = t;
                    q = q ? r : A;
                    o = 202
                }
                if ((o | 0) == 202) {
                    r = (c[19824 >> 2] | 0) + q | 0;
                    c[19824 >> 2] = r;
                    if (r >>> 0 > (c[19828 >> 2] | 0) >>> 0) {
                        c[19828 >> 2] = r
                    }
                    r = c[19416 >> 2] | 0;
                    g:do {
                        if ((r | 0) != 0) {
                            v = 19840 | 0;
                            while (1) {
                                t = c[v >> 2] | 0;
                                u = v + 4 | 0;
                                s = c[u >> 2] | 0;
                                if ((p | 0) == (t + s | 0)) {
                                    o = 214;
                                    break
                                }
                                w = c[v + 8 >> 2] | 0;
                                if ((w | 0) == 0) {
                                    break
                                } else {
                                    v = w
                                }
                            }
                            if (((o | 0) == 214 ? (c[v + 12 >> 2] & 8 | 0) == 0 : 0) ? r >>> 0 >= t >>> 0 & r >>> 0 < p >>> 0 : 0) {
                                c[u >> 2] = s + q;
                                d = (c[19404 >> 2] | 0) + q | 0;
                                e = r + 8 | 0;
                                if ((e & 7 | 0) == 0) {
                                    e = 0
                                } else {
                                    e = 0 - e & 7
                                }
                                H = d - e | 0;
                                c[19416 >> 2] = r + e;
                                c[19404 >> 2] = H;
                                c[r + (e + 4) >> 2] = H | 1;
                                c[r + (d + 4) >> 2] = 40;
                                c[19420 >> 2] = c[19880 >> 2];
                                break
                            }
                            if (p >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                c[19408 >> 2] = p
                            }
                            t = p + q | 0;
                            s = 19840 | 0;
                            while (1) {
                                if ((c[s >> 2] | 0) == (t | 0)) {
                                    o = 224;
                                    break
                                }
                                u = c[s + 8 >> 2] | 0;
                                if ((u | 0) == 0) {
                                    break
                                } else {
                                    s = u
                                }
                            }
                            if ((o | 0) == 224 ? (c[s + 12 >> 2] & 8 | 0) == 0 : 0) {
                                c[s >> 2] = p;
                                h = s + 4 | 0;
                                c[h >> 2] = (c[h >> 2] | 0) + q;
                                h = p + 8 | 0;
                                if ((h & 7 | 0) == 0) {
                                    h = 0
                                } else {
                                    h = 0 - h & 7
                                }
                                j = p + (q + 8) | 0;
                                if ((j & 7 | 0) == 0) {
                                    n = 0
                                } else {
                                    n = 0 - j & 7
                                }
                                o = p + (n + q) | 0;
                                j = h + a | 0;
                                k = p + j | 0;
                                m = o - (p + h) - a | 0;
                                c[p + (h + 4) >> 2] = a | 3;
                                h:do {
                                    if ((o | 0) != (c[19416 >> 2] | 0)) {
                                        if ((o | 0) == (c[19412 >> 2] | 0)) {
                                            H = (c[19400 >> 2] | 0) + m | 0;
                                            c[19400 >> 2] = H;
                                            c[19412 >> 2] = k;
                                            c[p + (j + 4) >> 2] = H | 1;
                                            c[p + (H + j) >> 2] = H;
                                            break
                                        }
                                        r = q + 4 | 0;
                                        t = c[p + (r + n) >> 2] | 0;
                                        if ((t & 3 | 0) == 1) {
                                            a = t & -8;
                                            s = t >>> 3;
                                            i:do {
                                                if (!(t >>> 0 < 256)) {
                                                    l = c[p + ((n | 24) + q) >> 2] | 0;
                                                    u = c[p + (q + 12 + n) >> 2] | 0;
                                                    do {
                                                        if ((u | 0) == (o | 0)) {
                                                            u = n | 16;
                                                            t = p + (r + u) | 0;
                                                            s = c[t >> 2] | 0;
                                                            if ((s | 0) == 0) {
                                                                t = p + (u + q) | 0;
                                                                s = c[t >> 2] | 0;
                                                                if ((s | 0) == 0) {
                                                                    g = 0;
                                                                    break
                                                                }
                                                            }
                                                            while (1) {
                                                                u = s + 20 | 0;
                                                                v = c[u >> 2] | 0;
                                                                if ((v | 0) != 0) {
                                                                    s = v;
                                                                    t = u;
                                                                    continue
                                                                }
                                                                u = s + 16 | 0;
                                                                v = c[u >> 2] | 0;
                                                                if ((v | 0) == 0) {
                                                                    break
                                                                } else {
                                                                    s = v;
                                                                    t = u
                                                                }
                                                            }
                                                            if (t >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                                ga()
                                                            } else {
                                                                c[t >> 2] = 0;
                                                                g = s;
                                                                break
                                                            }
                                                        } else {
                                                            t = c[p + ((n | 8) + q) >> 2] | 0;
                                                            if (t >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                                ga()
                                                            }
                                                            v = t + 12 | 0;
                                                            if ((c[v >> 2] | 0) != (o | 0)) {
                                                                ga()
                                                            }
                                                            s = u + 8 | 0;
                                                            if ((c[s >> 2] | 0) == (o | 0)) {
                                                                c[v >> 2] = u;
                                                                c[s >> 2] = t;
                                                                g = u;
                                                                break
                                                            } else {
                                                                ga()
                                                            }
                                                        }
                                                    } while (0);
                                                    if ((l | 0) == 0) {
                                                        break
                                                    }
                                                    t = c[p + (q + 28 + n) >> 2] | 0;
                                                    s = 19696 + (t << 2) | 0;
                                                    do {
                                                        if ((o | 0) != (c[s >> 2] | 0)) {
                                                            if (l >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                                ga()
                                                            }
                                                            s = l + 16 | 0;
                                                            if ((c[s >> 2] | 0) == (o | 0)) {
                                                                c[s >> 2] = g
                                                            } else {
                                                                c[l + 20 >> 2] = g
                                                            }
                                                            if ((g | 0) == 0) {
                                                                break i
                                                            }
                                                        } else {
                                                            c[s >> 2] = g;
                                                            if ((g | 0) != 0) {
                                                                break
                                                            }
                                                            c[19396 >> 2] = c[19396 >> 2] & ~(1 << t);
                                                            break i
                                                        }
                                                    } while (0);
                                                    if (g >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                        ga()
                                                    }
                                                    c[g + 24 >> 2] = l;
                                                    l = n | 16;
                                                    o = c[p + (l + q) >> 2] | 0;
                                                    do {
                                                        if ((o | 0) != 0) {
                                                            if (o >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                                ga()
                                                            } else {
                                                                c[g + 16 >> 2] = o;
                                                                c[o + 24 >> 2] = g;
                                                                break
                                                            }
                                                        }
                                                    } while (0);
                                                    l = c[p + (r + l) >> 2] | 0;
                                                    if ((l | 0) == 0) {
                                                        break
                                                    }
                                                    if (l >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                        ga()
                                                    } else {
                                                        c[g + 20 >> 2] = l;
                                                        c[l + 24 >> 2] = g;
                                                        break
                                                    }
                                                } else {
                                                    r = c[p + ((n | 8) + q) >> 2] | 0;
                                                    g = c[p + (q + 12 + n) >> 2] | 0;
                                                    t = 19432 + (s << 1 << 2) | 0;
                                                    do {
                                                        if ((r | 0) != (t | 0)) {
                                                            if (r >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                                ga()
                                                            }
                                                            if ((c[r + 12 >> 2] | 0) == (o | 0)) {
                                                                break
                                                            }
                                                            ga()
                                                        }
                                                    } while (0);
                                                    if ((g | 0) == (r | 0)) {
                                                        c[4848] = c[4848] & ~(1 << s);
                                                        break
                                                    }
                                                    do {
                                                        if ((g | 0) == (t | 0)) {
                                                            l = g + 8 | 0
                                                        } else {
                                                            if (g >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                                ga()
                                                            }
                                                            s = g + 8 | 0;
                                                            if ((c[s >> 2] | 0) == (o | 0)) {
                                                                l = s;
                                                                break
                                                            }
                                                            ga()
                                                        }
                                                    } while (0);
                                                    c[r + 12 >> 2] = g;
                                                    c[l >> 2] = r
                                                }
                                            } while (0);
                                            o = p + ((a | n) + q) | 0;
                                            m = a + m | 0
                                        }
                                        g = o + 4 | 0;
                                        c[g >> 2] = c[g >> 2] & -2;
                                        c[p + (j + 4) >> 2] = m | 1;
                                        c[p + (m + j) >> 2] = m;
                                        g = m >>> 3;
                                        if (m >>> 0 < 256) {
                                            m = g << 1;
                                            d = 19432 + (m << 2) | 0;
                                            l = c[4848] | 0;
                                            g = 1 << g;
                                            do {
                                                if ((l & g | 0) == 0) {
                                                    c[4848] = l | g;
                                                    f = 19432 + (m + 2 << 2) | 0;
                                                    e = d
                                                } else {
                                                    l = 19432 + (m + 2 << 2) | 0;
                                                    g = c[l >> 2] | 0;
                                                    if (!(g >>> 0 < (c[19408 >> 2] | 0) >>> 0)) {
                                                        f = l;
                                                        e = g;
                                                        break
                                                    }
                                                    ga()
                                                }
                                            } while (0);
                                            c[f >> 2] = k;
                                            c[e + 12 >> 2] = k;
                                            c[p + (j + 8) >> 2] = e;
                                            c[p + (j + 12) >> 2] = d;
                                            break
                                        }
                                        e = m >>> 8;
                                        do {
                                            if ((e | 0) == 0) {
                                                e = 0
                                            } else {
                                                if (m >>> 0 > 16777215) {
                                                    e = 31;
                                                    break
                                                }
                                                G = (e + 1048320 | 0) >>> 16 & 8;
                                                H = e << G;
                                                F = (H + 520192 | 0) >>> 16 & 4;
                                                H = H << F;
                                                e = (H + 245760 | 0) >>> 16 & 2;
                                                e = 14 - (F | G | e) + (H << e >>> 15) | 0;
                                                e = m >>> (e + 7 | 0) & 1 | e << 1
                                            }
                                        } while (0);
                                        l = 19696 + (e << 2) | 0;
                                        c[p + (j + 28) >> 2] = e;
                                        c[p + (j + 20) >> 2] = 0;
                                        c[p + (j + 16) >> 2] = 0;
                                        f = c[19396 >> 2] | 0;
                                        g = 1 << e;
                                        if ((f & g | 0) == 0) {
                                            c[19396 >> 2] = f | g;
                                            c[l >> 2] = k;
                                            c[p + (j + 24) >> 2] = l;
                                            c[p + (j + 12) >> 2] = k;
                                            c[p + (j + 8) >> 2] = k;
                                            break
                                        }
                                        l = c[l >> 2] | 0;
                                        if ((e | 0) == 31) {
                                            e = 0
                                        } else {
                                            e = 25 - (e >>> 1) | 0
                                        }
                                        j:do {
                                            if ((c[l + 4 >> 2] & -8 | 0) != (m | 0)) {
                                                e = m << e;
                                                while (1) {
                                                    g = l + (e >>> 31 << 2) + 16 | 0;
                                                    f = c[g >> 2] | 0;
                                                    if ((f | 0) == 0) {
                                                        break
                                                    }
                                                    if ((c[f + 4 >> 2] & -8 | 0) == (m | 0)) {
                                                        d = f;
                                                        break j
                                                    } else {
                                                        e = e << 1;
                                                        l = f
                                                    }
                                                }
                                                if (g >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                                    ga()
                                                } else {
                                                    c[g >> 2] = k;
                                                    c[p + (j + 24) >> 2] = l;
                                                    c[p + (j + 12) >> 2] = k;
                                                    c[p + (j + 8) >> 2] = k;
                                                    break h
                                                }
                                            } else {
                                                d = l
                                            }
                                        } while (0);
                                        f = d + 8 | 0;
                                        e = c[f >> 2] | 0;
                                        g = c[19408 >> 2] | 0;
                                        if (d >>> 0 < g >>> 0) {
                                            ga()
                                        }
                                        if (e >>> 0 < g >>> 0) {
                                            ga()
                                        } else {
                                            c[e + 12 >> 2] = k;
                                            c[f >> 2] = k;
                                            c[p + (j + 8) >> 2] = e;
                                            c[p + (j + 12) >> 2] = d;
                                            c[p + (j + 24) >> 2] = 0;
                                            break
                                        }
                                    } else {
                                        H = (c[19404 >> 2] | 0) + m | 0;
                                        c[19404 >> 2] = H;
                                        c[19416 >> 2] = k;
                                        c[p + (j + 4) >> 2] = H | 1
                                    }
                                } while (0);
                                H = p + (h | 8) | 0;
                                i = b;
                                return H | 0
                            }
                            e = 19840 | 0;
                            while (1) {
                                d = c[e >> 2] | 0;
                                if (!(d >>> 0 > r >>> 0) ? (n = c[e + 4 >> 2] | 0, m = d + n | 0, m >>> 0 > r >>> 0) : 0) {
                                    break
                                }
                                e = c[e + 8 >> 2] | 0
                            }
                            e = d + (n + -39) | 0;
                            if ((e & 7 | 0) == 0) {
                                e = 0
                            } else {
                                e = 0 - e & 7
                            }
                            d = d + (n + -47 + e) | 0;
                            d = d >>> 0 < (r + 16 | 0) >>> 0 ? r : d;
                            e = d + 8 | 0;
                            f = p + 8 | 0;
                            if ((f & 7 | 0) == 0) {
                                f = 0
                            } else {
                                f = 0 - f & 7
                            }
                            H = q + -40 - f | 0;
                            c[19416 >> 2] = p + f;
                            c[19404 >> 2] = H;
                            c[p + (f + 4) >> 2] = H | 1;
                            c[p + (q + -36) >> 2] = 40;
                            c[19420 >> 2] = c[19880 >> 2];
                            c[d + 4 >> 2] = 27;
                            c[e + 0 >> 2] = c[19840 >> 2];
                            c[e + 4 >> 2] = c[19844 >> 2];
                            c[e + 8 >> 2] = c[19848 >> 2];
                            c[e + 12 >> 2] = c[19852 >> 2];
                            c[19840 >> 2] = p;
                            c[19844 >> 2] = q;
                            c[19852 >> 2] = 0;
                            c[19848 >> 2] = e;
                            e = d + 28 | 0;
                            c[e >> 2] = 7;
                            if ((d + 32 | 0) >>> 0 < m >>> 0) {
                                do {
                                    H = e;
                                    e = e + 4 | 0;
                                    c[e >> 2] = 7
                                } while ((H + 8 | 0) >>> 0 < m >>> 0)
                            }
                            if ((d | 0) != (r | 0)) {
                                d = d - r | 0;
                                e = r + (d + 4) | 0;
                                c[e >> 2] = c[e >> 2] & -2;
                                c[r + 4 >> 2] = d | 1;
                                c[r + d >> 2] = d;
                                e = d >>> 3;
                                if (d >>> 0 < 256) {
                                    g = e << 1;
                                    d = 19432 + (g << 2) | 0;
                                    f = c[4848] | 0;
                                    e = 1 << e;
                                    do {
                                        if ((f & e | 0) == 0) {
                                            c[4848] = f | e;
                                            k = 19432 + (g + 2 << 2) | 0;
                                            j = d
                                        } else {
                                            f = 19432 + (g + 2 << 2) | 0;
                                            e = c[f >> 2] | 0;
                                            if (!(e >>> 0 < (c[19408 >> 2] | 0) >>> 0)) {
                                                k = f;
                                                j = e;
                                                break
                                            }
                                            ga()
                                        }
                                    } while (0);
                                    c[k >> 2] = r;
                                    c[j + 12 >> 2] = r;
                                    c[r + 8 >> 2] = j;
                                    c[r + 12 >> 2] = d;
                                    break
                                }
                                e = d >>> 8;
                                if ((e | 0) != 0) {
                                    if (d >>> 0 > 16777215) {
                                        e = 31
                                    } else {
                                        G = (e + 1048320 | 0) >>> 16 & 8;
                                        H = e << G;
                                        F = (H + 520192 | 0) >>> 16 & 4;
                                        H = H << F;
                                        e = (H + 245760 | 0) >>> 16 & 2;
                                        e = 14 - (F | G | e) + (H << e >>> 15) | 0;
                                        e = d >>> (e + 7 | 0) & 1 | e << 1
                                    }
                                } else {
                                    e = 0
                                }
                                j = 19696 + (e << 2) | 0;
                                c[r + 28 >> 2] = e;
                                c[r + 20 >> 2] = 0;
                                c[r + 16 >> 2] = 0;
                                f = c[19396 >> 2] | 0;
                                g = 1 << e;
                                if ((f & g | 0) == 0) {
                                    c[19396 >> 2] = f | g;
                                    c[j >> 2] = r;
                                    c[r + 24 >> 2] = j;
                                    c[r + 12 >> 2] = r;
                                    c[r + 8 >> 2] = r;
                                    break
                                }
                                f = c[j >> 2] | 0;
                                if ((e | 0) == 31) {
                                    e = 0
                                } else {
                                    e = 25 - (e >>> 1) | 0
                                }
                                k:do {
                                    if ((c[f + 4 >> 2] & -8 | 0) != (d | 0)) {
                                        e = d << e;
                                        while (1) {
                                            j = f + (e >>> 31 << 2) + 16 | 0;
                                            g = c[j >> 2] | 0;
                                            if ((g | 0) == 0) {
                                                break
                                            }
                                            if ((c[g + 4 >> 2] & -8 | 0) == (d | 0)) {
                                                h = g;
                                                break k
                                            } else {
                                                e = e << 1;
                                                f = g
                                            }
                                        }
                                        if (j >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                            ga()
                                        } else {
                                            c[j >> 2] = r;
                                            c[r + 24 >> 2] = f;
                                            c[r + 12 >> 2] = r;
                                            c[r + 8 >> 2] = r;
                                            break g
                                        }
                                    } else {
                                        h = f
                                    }
                                } while (0);
                                f = h + 8 | 0;
                                e = c[f >> 2] | 0;
                                d = c[19408 >> 2] | 0;
                                if (h >>> 0 < d >>> 0) {
                                    ga()
                                }
                                if (e >>> 0 < d >>> 0) {
                                    ga()
                                } else {
                                    c[e + 12 >> 2] = r;
                                    c[f >> 2] = r;
                                    c[r + 8 >> 2] = e;
                                    c[r + 12 >> 2] = h;
                                    c[r + 24 >> 2] = 0;
                                    break
                                }
                            }
                        } else {
                            H = c[19408 >> 2] | 0;
                            if ((H | 0) == 0 | p >>> 0 < H >>> 0) {
                                c[19408 >> 2] = p
                            }
                            c[19840 >> 2] = p;
                            c[19844 >> 2] = q;
                            c[19852 >> 2] = 0;
                            c[19428 >> 2] = c[4966];
                            c[19424 >> 2] = -1;
                            d = 0;
                            do {
                                H = d << 1;
                                G = 19432 + (H << 2) | 0;
                                c[19432 + (H + 3 << 2) >> 2] = G;
                                c[19432 + (H + 2 << 2) >> 2] = G;
                                d = d + 1 | 0
                            } while ((d | 0) != 32);
                            d = p + 8 | 0;
                            if ((d & 7 | 0) == 0) {
                                d = 0
                            } else {
                                d = 0 - d & 7
                            }
                            H = q + -40 - d | 0;
                            c[19416 >> 2] = p + d;
                            c[19404 >> 2] = H;
                            c[p + (d + 4) >> 2] = H | 1;
                            c[p + (q + -36) >> 2] = 40;
                            c[19420 >> 2] = c[19880 >> 2]
                        }
                    } while (0);
                    d = c[19404 >> 2] | 0;
                    if (d >>> 0 > a >>> 0) {
                        G = d - a | 0;
                        c[19404 >> 2] = G;
                        H = c[19416 >> 2] | 0;
                        c[19416 >> 2] = H + a;
                        c[H + (a + 4) >> 2] = G | 1;
                        c[H + 4 >> 2] = a | 3;
                        H = H + 8 | 0;
                        i = b;
                        return H | 0
                    }
                }
                c[(pa() | 0) >> 2] = 12;
                H = 0;
                i = b;
                return H | 0
            }
            function Te(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0,
                    r = 0, s = 0, t = 0, u = 0, v = 0, w = 0;
                b = i;
                if ((a | 0) == 0) {
                    i = b;
                    return
                }
                q = a + -8 | 0;
                r = c[19408 >> 2] | 0;
                if (q >>> 0 < r >>> 0) {
                    ga()
                }
                o = c[a + -4 >> 2] | 0;
                n = o & 3;
                if ((n | 0) == 1) {
                    ga()
                }
                j = o & -8;
                h = a + (j + -8) | 0;
                do {
                    if ((o & 1 | 0) == 0) {
                        u = c[q >> 2] | 0;
                        if ((n | 0) == 0) {
                            i = b;
                            return
                        }
                        q = -8 - u | 0;
                        o = a + q | 0;
                        n = u + j | 0;
                        if (o >>> 0 < r >>> 0) {
                            ga()
                        }
                        if ((o | 0) == (c[19412 >> 2] | 0)) {
                            d = a + (j + -4) | 0;
                            if ((c[d >> 2] & 3 | 0) != 3) {
                                d = o;
                                m = n;
                                break
                            }
                            c[19400 >> 2] = n;
                            c[d >> 2] = c[d >> 2] & -2;
                            c[a + (q + 4) >> 2] = n | 1;
                            c[h >> 2] = n;
                            i = b;
                            return
                        }
                        t = u >>> 3;
                        if (u >>> 0 < 256) {
                            d = c[a + (q + 8) >> 2] | 0;
                            m = c[a + (q + 12) >> 2] | 0;
                            p = 19432 + (t << 1 << 2) | 0;
                            if ((d | 0) != (p | 0)) {
                                if (d >>> 0 < r >>> 0) {
                                    ga()
                                }
                                if ((c[d + 12 >> 2] | 0) != (o | 0)) {
                                    ga()
                                }
                            }
                            if ((m | 0) == (d | 0)) {
                                c[4848] = c[4848] & ~(1 << t);
                                d = o;
                                m = n;
                                break
                            }
                            if ((m | 0) != (p | 0)) {
                                if (m >>> 0 < r >>> 0) {
                                    ga()
                                }
                                p = m + 8 | 0;
                                if ((c[p >> 2] | 0) == (o | 0)) {
                                    s = p
                                } else {
                                    ga()
                                }
                            } else {
                                s = m + 8 | 0
                            }
                            c[d + 12 >> 2] = m;
                            c[s >> 2] = d;
                            d = o;
                            m = n;
                            break
                        }
                        s = c[a + (q + 24) >> 2] | 0;
                        t = c[a + (q + 12) >> 2] | 0;
                        do {
                            if ((t | 0) == (o | 0)) {
                                u = a + (q + 20) | 0;
                                t = c[u >> 2] | 0;
                                if ((t | 0) == 0) {
                                    u = a + (q + 16) | 0;
                                    t = c[u >> 2] | 0;
                                    if ((t | 0) == 0) {
                                        p = 0;
                                        break
                                    }
                                }
                                while (1) {
                                    w = t + 20 | 0;
                                    v = c[w >> 2] | 0;
                                    if ((v | 0) != 0) {
                                        t = v;
                                        u = w;
                                        continue
                                    }
                                    v = t + 16 | 0;
                                    w = c[v >> 2] | 0;
                                    if ((w | 0) == 0) {
                                        break
                                    } else {
                                        t = w;
                                        u = v
                                    }
                                }
                                if (u >>> 0 < r >>> 0) {
                                    ga()
                                } else {
                                    c[u >> 2] = 0;
                                    p = t;
                                    break
                                }
                            } else {
                                u = c[a + (q + 8) >> 2] | 0;
                                if (u >>> 0 < r >>> 0) {
                                    ga()
                                }
                                r = u + 12 | 0;
                                if ((c[r >> 2] | 0) != (o | 0)) {
                                    ga()
                                }
                                v = t + 8 | 0;
                                if ((c[v >> 2] | 0) == (o | 0)) {
                                    c[r >> 2] = t;
                                    c[v >> 2] = u;
                                    p = t;
                                    break
                                } else {
                                    ga()
                                }
                            }
                        } while (0);
                        if ((s | 0) != 0) {
                            t = c[a + (q + 28) >> 2] | 0;
                            r = 19696 + (t << 2) | 0;
                            if ((o | 0) == (c[r >> 2] | 0)) {
                                c[r >> 2] = p;
                                if ((p | 0) == 0) {
                                    c[19396 >> 2] = c[19396 >> 2] & ~(1 << t);
                                    d = o;
                                    m = n;
                                    break
                                }
                            } else {
                                if (s >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                    ga()
                                }
                                r = s + 16 | 0;
                                if ((c[r >> 2] | 0) == (o | 0)) {
                                    c[r >> 2] = p
                                } else {
                                    c[s + 20 >> 2] = p
                                }
                                if ((p | 0) == 0) {
                                    d = o;
                                    m = n;
                                    break
                                }
                            }
                            if (p >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                ga()
                            }
                            c[p + 24 >> 2] = s;
                            r = c[a + (q + 16) >> 2] | 0;
                            do {
                                if ((r | 0) != 0) {
                                    if (r >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                        ga()
                                    } else {
                                        c[p + 16 >> 2] = r;
                                        c[r + 24 >> 2] = p;
                                        break
                                    }
                                }
                            } while (0);
                            q = c[a + (q + 20) >> 2] | 0;
                            if ((q | 0) != 0) {
                                if (q >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                    ga()
                                } else {
                                    c[p + 20 >> 2] = q;
                                    c[q + 24 >> 2] = p;
                                    d = o;
                                    m = n;
                                    break
                                }
                            } else {
                                d = o;
                                m = n
                            }
                        } else {
                            d = o;
                            m = n
                        }
                    } else {
                        d = q;
                        m = j
                    }
                } while (0);
                if (!(d >>> 0 < h >>> 0)) {
                    ga()
                }
                n = a + (j + -4) | 0;
                o = c[n >> 2] | 0;
                if ((o & 1 | 0) == 0) {
                    ga()
                }
                if ((o & 2 | 0) == 0) {
                    if ((h | 0) == (c[19416 >> 2] | 0)) {
                        w = (c[19404 >> 2] | 0) + m | 0;
                        c[19404 >> 2] = w;
                        c[19416 >> 2] = d;
                        c[d + 4 >> 2] = w | 1;
                        if ((d | 0) != (c[19412 >> 2] | 0)) {
                            i = b;
                            return
                        }
                        c[19412 >> 2] = 0;
                        c[19400 >> 2] = 0;
                        i = b;
                        return
                    }
                    if ((h | 0) == (c[19412 >> 2] | 0)) {
                        w = (c[19400 >> 2] | 0) + m | 0;
                        c[19400 >> 2] = w;
                        c[19412 >> 2] = d;
                        c[d + 4 >> 2] = w | 1;
                        c[d + w >> 2] = w;
                        i = b;
                        return
                    }
                    m = (o & -8) + m | 0;
                    n = o >>> 3;
                    do {
                        if (!(o >>> 0 < 256)) {
                            l = c[a + (j + 16) >> 2] | 0;
                            q = c[a + (j | 4) >> 2] | 0;
                            do {
                                if ((q | 0) == (h | 0)) {
                                    o = a + (j + 12) | 0;
                                    n = c[o >> 2] | 0;
                                    if ((n | 0) == 0) {
                                        o = a + (j + 8) | 0;
                                        n = c[o >> 2] | 0;
                                        if ((n | 0) == 0) {
                                            k = 0;
                                            break
                                        }
                                    }
                                    while (1) {
                                        p = n + 20 | 0;
                                        q = c[p >> 2] | 0;
                                        if ((q | 0) != 0) {
                                            n = q;
                                            o = p;
                                            continue
                                        }
                                        p = n + 16 | 0;
                                        q = c[p >> 2] | 0;
                                        if ((q | 0) == 0) {
                                            break
                                        } else {
                                            n = q;
                                            o = p
                                        }
                                    }
                                    if (o >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                        ga()
                                    } else {
                                        c[o >> 2] = 0;
                                        k = n;
                                        break
                                    }
                                } else {
                                    o = c[a + j >> 2] | 0;
                                    if (o >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                        ga()
                                    }
                                    p = o + 12 | 0;
                                    if ((c[p >> 2] | 0) != (h | 0)) {
                                        ga()
                                    }
                                    n = q + 8 | 0;
                                    if ((c[n >> 2] | 0) == (h | 0)) {
                                        c[p >> 2] = q;
                                        c[n >> 2] = o;
                                        k = q;
                                        break
                                    } else {
                                        ga()
                                    }
                                }
                            } while (0);
                            if ((l | 0) != 0) {
                                n = c[a + (j + 20) >> 2] | 0;
                                o = 19696 + (n << 2) | 0;
                                if ((h | 0) == (c[o >> 2] | 0)) {
                                    c[o >> 2] = k;
                                    if ((k | 0) == 0) {
                                        c[19396 >> 2] = c[19396 >> 2] & ~(1 << n);
                                        break
                                    }
                                } else {
                                    if (l >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                        ga()
                                    }
                                    n = l + 16 | 0;
                                    if ((c[n >> 2] | 0) == (h | 0)) {
                                        c[n >> 2] = k
                                    } else {
                                        c[l + 20 >> 2] = k
                                    }
                                    if ((k | 0) == 0) {
                                        break
                                    }
                                }
                                if (k >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                    ga()
                                }
                                c[k + 24 >> 2] = l;
                                h = c[a + (j + 8) >> 2] | 0;
                                do {
                                    if ((h | 0) != 0) {
                                        if (h >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                            ga()
                                        } else {
                                            c[k + 16 >> 2] = h;
                                            c[h + 24 >> 2] = k;
                                            break
                                        }
                                    }
                                } while (0);
                                h = c[a + (j + 12) >> 2] | 0;
                                if ((h | 0) != 0) {
                                    if (h >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                        ga()
                                    } else {
                                        c[k + 20 >> 2] = h;
                                        c[h + 24 >> 2] = k;
                                        break
                                    }
                                }
                            }
                        } else {
                            k = c[a + j >> 2] | 0;
                            a = c[a + (j | 4) >> 2] | 0;
                            j = 19432 + (n << 1 << 2) | 0;
                            if ((k | 0) != (j | 0)) {
                                if (k >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                    ga()
                                }
                                if ((c[k + 12 >> 2] | 0) != (h | 0)) {
                                    ga()
                                }
                            }
                            if ((a | 0) == (k | 0)) {
                                c[4848] = c[4848] & ~(1 << n);
                                break
                            }
                            if ((a | 0) != (j | 0)) {
                                if (a >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                    ga()
                                }
                                j = a + 8 | 0;
                                if ((c[j >> 2] | 0) == (h | 0)) {
                                    l = j
                                } else {
                                    ga()
                                }
                            } else {
                                l = a + 8 | 0
                            }
                            c[k + 12 >> 2] = a;
                            c[l >> 2] = k
                        }
                    } while (0);
                    c[d + 4 >> 2] = m | 1;
                    c[d + m >> 2] = m;
                    if ((d | 0) == (c[19412 >> 2] | 0)) {
                        c[19400 >> 2] = m;
                        i = b;
                        return
                    }
                } else {
                    c[n >> 2] = o & -2;
                    c[d + 4 >> 2] = m | 1;
                    c[d + m >> 2] = m
                }
                h = m >>> 3;
                if (m >>> 0 < 256) {
                    a = h << 1;
                    e = 19432 + (a << 2) | 0;
                    j = c[4848] | 0;
                    h = 1 << h;
                    if ((j & h | 0) != 0) {
                        h = 19432 + (a + 2 << 2) | 0;
                        a = c[h >> 2] | 0;
                        if (a >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                            ga()
                        } else {
                            f = h;
                            g = a
                        }
                    } else {
                        c[4848] = j | h;
                        f = 19432 + (a + 2 << 2) | 0;
                        g = e
                    }
                    c[f >> 2] = d;
                    c[g + 12 >> 2] = d;
                    c[d + 8 >> 2] = g;
                    c[d + 12 >> 2] = e;
                    i = b;
                    return
                }
                f = m >>> 8;
                if ((f | 0) != 0) {
                    if (m >>> 0 > 16777215) {
                        f = 31
                    } else {
                        v = (f + 1048320 | 0) >>> 16 & 8;
                        w = f << v;
                        u = (w + 520192 | 0) >>> 16 & 4;
                        w = w << u;
                        f = (w + 245760 | 0) >>> 16 & 2;
                        f = 14 - (u | v | f) + (w << f >>> 15) | 0;
                        f = m >>> (f + 7 | 0) & 1 | f << 1
                    }
                } else {
                    f = 0
                }
                g = 19696 + (f << 2) | 0;
                c[d + 28 >> 2] = f;
                c[d + 20 >> 2] = 0;
                c[d + 16 >> 2] = 0;
                a = c[19396 >> 2] | 0;
                h = 1 << f;
                a:do {
                    if ((a & h | 0) != 0) {
                        g = c[g >> 2] | 0;
                        if ((f | 0) == 31) {
                            f = 0
                        } else {
                            f = 25 - (f >>> 1) | 0
                        }
                        b:do {
                            if ((c[g + 4 >> 2] & -8 | 0) != (m | 0)) {
                                f = m << f;
                                a = g;
                                while (1) {
                                    h = a + (f >>> 31 << 2) + 16 | 0;
                                    g = c[h >> 2] | 0;
                                    if ((g | 0) == 0) {
                                        break
                                    }
                                    if ((c[g + 4 >> 2] & -8 | 0) == (m | 0)) {
                                        e = g;
                                        break b
                                    } else {
                                        f = f << 1;
                                        a = g
                                    }
                                }
                                if (h >>> 0 < (c[19408 >> 2] | 0) >>> 0) {
                                    ga()
                                } else {
                                    c[h >> 2] = d;
                                    c[d + 24 >> 2] = a;
                                    c[d + 12 >> 2] = d;
                                    c[d + 8 >> 2] = d;
                                    break a
                                }
                            } else {
                                e = g
                            }
                        } while (0);
                        g = e + 8 | 0;
                        f = c[g >> 2] | 0;
                        h = c[19408 >> 2] | 0;
                        if (e >>> 0 < h >>> 0) {
                            ga()
                        }
                        if (f >>> 0 < h >>> 0) {
                            ga()
                        } else {
                            c[f + 12 >> 2] = d;
                            c[g >> 2] = d;
                            c[d + 8 >> 2] = f;
                            c[d + 12 >> 2] = e;
                            c[d + 24 >> 2] = 0;
                            break
                        }
                    } else {
                        c[19396 >> 2] = a | h;
                        c[g >> 2] = d;
                        c[d + 24 >> 2] = g;
                        c[d + 12 >> 2] = d;
                        c[d + 8 >> 2] = d
                    }
                } while (0);
                w = (c[19424 >> 2] | 0) + -1 | 0;
                c[19424 >> 2] = w;
                if ((w | 0) == 0) {
                    d = 19848 | 0
                } else {
                    i = b;
                    return
                }
                while (1) {
                    d = c[d >> 2] | 0;
                    if ((d | 0) == 0) {
                        break
                    } else {
                        d = d + 8 | 0
                    }
                }
                c[19424 >> 2] = -1;
                i = b;
            }
            function Ue() {
            }
            function Ve(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                if ((c | 0) < 32) {
                    D = b >> c;
                    return a >>> c | (b & (1 << c) - 1) << 32 - c
                }
                D = (b | 0) < 0 ? -1 : 0;
                return b >> c - 32 | 0
            }
            function We(b) {
                b = b | 0;
                var c = 0;
                c = a[n + (b >>> 24) >> 0] | 0;
                if ((c | 0) < 8) return c | 0;
                c = a[n + (b >> 16 & 255) >> 0] | 0;
                if ((c | 0) < 8) return c + 8 | 0;
                c = a[n + (b >> 8 & 255) >> 0] | 0;
                if ((c | 0) < 8) return c + 16 | 0;
                return (a[n + (b & 255) >> 0] | 0) + 24 | 0
            }
            function Xe(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, i = 0;
                f = b + e | 0;
                if ((e | 0) >= 20) {
                    d = d & 255;
                    i = b & 3;
                    h = d | d << 8 | d << 16 | d << 24;
                    g = f & ~3;
                    if (i) {
                        i = b + 4 - i | 0;
                        while ((b | 0) < (i | 0)) {
                            a[b >> 0] = d;
                            b = b + 1 | 0
                        }
                    }
                    while ((b | 0) < (g | 0)) {
                        c[b >> 2] = h;
                        b = b + 4 | 0
                    }
                }
                while ((b | 0) < (f | 0)) {
                    a[b >> 0] = d;
                    b = b + 1 | 0
                }
                return b - e | 0
            }
            function Ye(b) {
                b = b | 0;
                var c = 0;
                c = b;
                while (a[c >> 0] | 0) {
                    c = c + 1 | 0
                }
                return c - b | 0
            }
            function Ze(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0;
                if ((e | 0) >= 4096) return ma(b | 0, d | 0, e | 0) | 0;
                f = b | 0;
                if ((b & 3) == (d & 3)) {
                    while (b & 3) {
                        if ((e | 0) == 0) return f | 0;
                        a[b >> 0] = a[d >> 0] | 0;
                        b = b + 1 | 0;
                        d = d + 1 | 0;
                        e = e - 1 | 0
                    }
                    while ((e | 0) >= 4) {
                        c[b >> 2] = c[d >> 2];
                        b = b + 4 | 0;
                        d = d + 4 | 0;
                        e = e - 4 | 0
                    }
                }
                while ((e | 0) > 0) {
                    a[b >> 0] = a[d >> 0] | 0;
                    b = b + 1 | 0;
                    d = d + 1 | 0;
                    e = e - 1 | 0
                }
                return f | 0
            }
            function _e(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                c = a + c >>> 0;
                return (D = b + d + (c >>> 0 < a >>> 0 | 0) >>> 0, c | 0) | 0
            }
            function $e(b, c, d) {
                b = b | 0;
                c = c | 0;
                d = d | 0;
                var e = 0;
                if ((c | 0) < (b | 0) & (b | 0) < (c + d | 0)) {
                    e = b;
                    c = c + d | 0;
                    b = b + d | 0;
                    while ((d | 0) > 0) {
                        b = b - 1 | 0;
                        c = c - 1 | 0;
                        d = d - 1 | 0;
                        a[b >> 0] = a[c >> 0] | 0
                    }
                    b = e
                } else {
                    Ze(b, c, d) | 0
                }
                return b | 0
            }
            function af(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                b = b - d - (c >>> 0 > a >>> 0 | 0) >>> 0;
                return (D = b, a - c >>> 0 | 0) | 0
            }
            function bf(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                if ((c | 0) < 32) {
                    D = b << c | (a & (1 << c) - 1 << 32 - c) >>> 32 - c;
                    return a << c
                }
                D = a << c - 32;
                return 0
            }
            function cf(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                if ((c | 0) < 32) {
                    D = b >>> c;
                    return a >>> c | (b & (1 << c) - 1) << 32 - c
                }
                D = 0;
                return b >>> c - 32 | 0
            }
            function df(b) {
                b = b | 0;
                var c = 0;
                c = a[m + (b & 255) >> 0] | 0;
                if ((c | 0) < 8) return c | 0;
                c = a[m + (b >> 8 & 255) >> 0] | 0;
                if ((c | 0) < 8) return c + 8 | 0;
                c = a[m + (b >> 16 & 255) >> 0] | 0;
                if ((c | 0) < 8) return c + 16 | 0;
                return (a[m + (b >>> 24) >> 0] | 0) + 24 | 0
            }
            function ef(a, b) {
                a = a | 0;
                b = b | 0;
                var c = 0, d = 0, e = 0, f = 0;
                f = a & 65535;
                d = b & 65535;
                c = $(d, f) | 0;
                e = a >>> 16;
                d = (c >>> 16) + ($(d, e) | 0) | 0;
                b = b >>> 16;
                a = $(b, f) | 0;
                return (D = (d >>> 16) + ($(b, e) | 0) + (((d & 65535) + a | 0) >>> 16) | 0, d + a << 16 | c & 65535 | 0) | 0
            }
            function ff(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
                j = b >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
                i = ((b | 0) < 0 ? -1 : 0) >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
                f = d >> 31 | ((d | 0) < 0 ? -1 : 0) << 1;
                e = ((d | 0) < 0 ? -1 : 0) >> 31 | ((d | 0) < 0 ? -1 : 0) << 1;
                h = af(j ^ a, i ^ b, j, i) | 0;
                g = D;
                b = f ^ j;
                a = e ^ i;
                a = af((lf(h, g, af(f ^ c, e ^ d, f, e) | 0, D, 0) | 0) ^ b, D ^ a, b, a) | 0;
                return a | 0
            }
            function gf(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                f = i;
                i = i + 8 | 0;
                j = f | 0;
                h = b >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
                g = ((b | 0) < 0 ? -1 : 0) >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
                l = e >> 31 | ((e | 0) < 0 ? -1 : 0) << 1;
                k = ((e | 0) < 0 ? -1 : 0) >> 31 | ((e | 0) < 0 ? -1 : 0) << 1;
                b = af(h ^ a, g ^ b, h, g) | 0;
                a = D;
                lf(b, a, af(l ^ d, k ^ e, l, k) | 0, D, j) | 0;
                a = af(c[j >> 2] ^ h, c[j + 4 >> 2] ^ g, h, g) | 0;
                b = D;
                i = f;
                return (D = b, a) | 0
            }
            function hf(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                var e = 0, f = 0;
                e = a;
                f = c;
                a = ef(e, f) | 0;
                c = D;
                return (D = ($(b, f) | 0) + ($(d, e) | 0) + c | c & 0, a | 0 | 0) | 0
            }
            function jf(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                a = lf(a, b, c, d, 0) | 0;
                return a | 0
            }
            function kf(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0;
                g = i;
                i = i + 8 | 0;
                f = g | 0;
                lf(a, b, d, e, f) | 0;
                i = g;
                return (D = c[f + 4 >> 2] | 0, c[f >> 2] | 0) | 0
            }
            function lf(a, b, d, e, f) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
                h = a;
                j = b;
                i = j;
                l = d;
                g = e;
                k = g;
                if ((i | 0) == 0) {
                    g = (f | 0) != 0;
                    if ((k | 0) == 0) {
                        if (g) {
                            c[f >> 2] = (h >>> 0) % (l >>> 0);
                            c[f + 4 >> 2] = 0
                        }
                        k = 0;
                        m = (h >>> 0) / (l >>> 0) >>> 0;
                        return (D = k, m) | 0
                    } else {
                        if (!g) {
                            l = 0;
                            m = 0;
                            return (D = l, m) | 0
                        }
                        c[f >> 2] = a | 0;
                        c[f + 4 >> 2] = b & 0;
                        l = 0;
                        m = 0;
                        return (D = l, m) | 0
                    }
                }
                m = (k | 0) == 0;
                do {
                    if ((l | 0) != 0) {
                        if (!m) {
                            k = (We(k | 0) | 0) - (We(i | 0) | 0) | 0;
                            if (k >>> 0 <= 31) {
                                m = k + 1 | 0;
                                l = 31 - k | 0;
                                a = k - 31 >> 31;
                                j = m;
                                b = h >>> (m >>> 0) & a | i << l;
                                a = i >>> (m >>> 0) & a;
                                k = 0;
                                l = h << l;
                                break
                            }
                            if ((f | 0) == 0) {
                                l = 0;
                                m = 0;
                                return (D = l, m) | 0
                            }
                            c[f >> 2] = a | 0;
                            c[f + 4 >> 2] = j | b & 0;
                            l = 0;
                            m = 0;
                            return (D = l, m) | 0
                        }
                        k = l - 1 | 0;
                        if ((k & l | 0) != 0) {
                            l = (We(l | 0) | 0) + 33 - (We(i | 0) | 0) | 0;
                            p = 64 - l | 0;
                            m = 32 - l | 0;
                            n = m >> 31;
                            o = l - 32 | 0;
                            a = o >> 31;
                            j = l;
                            b = m - 1 >> 31 & i >>> (o >>> 0) | (i << m | h >>> (l >>> 0)) & a;
                            a = a & i >>> (l >>> 0);
                            k = h << p & n;
                            l = (i << p | h >>> (o >>> 0)) & n | h << m & l - 33 >> 31;
                            break
                        }
                        if ((f | 0) != 0) {
                            c[f >> 2] = k & h;
                            c[f + 4 >> 2] = 0
                        }
                        if ((l | 0) == 1) {
                            o = j | b & 0;
                            p = a | 0 | 0;
                            return (D = o, p) | 0
                        } else {
                            p = df(l | 0) | 0;
                            o = i >>> (p >>> 0) | 0;
                            p = i << 32 - p | h >>> (p >>> 0) | 0;
                            return (D = o, p) | 0
                        }
                    } else {
                        if (m) {
                            if ((f | 0) != 0) {
                                c[f >> 2] = (i >>> 0) % (l >>> 0);
                                c[f + 4 >> 2] = 0
                            }
                            o = 0;
                            p = (i >>> 0) / (l >>> 0) >>> 0;
                            return (D = o, p) | 0
                        }
                        if ((h | 0) == 0) {
                            if ((f | 0) != 0) {
                                c[f >> 2] = 0;
                                c[f + 4 >> 2] = (i >>> 0) % (k >>> 0)
                            }
                            o = 0;
                            p = (i >>> 0) / (k >>> 0) >>> 0;
                            return (D = o, p) | 0
                        }
                        l = k - 1 | 0;
                        if ((l & k | 0) == 0) {
                            if ((f | 0) != 0) {
                                c[f >> 2] = a | 0;
                                c[f + 4 >> 2] = l & i | b & 0
                            }
                            o = 0;
                            p = i >>> ((df(k | 0) | 0) >>> 0);
                            return (D = o, p) | 0
                        }
                        k = (We(k | 0) | 0) - (We(i | 0) | 0) | 0;
                        if (k >>> 0 <= 30) {
                            a = k + 1 | 0;
                            l = 31 - k | 0;
                            j = a;
                            b = i << l | h >>> (a >>> 0);
                            a = i >>> (a >>> 0);
                            k = 0;
                            l = h << l;
                            break
                        }
                        if ((f | 0) == 0) {
                            o = 0;
                            p = 0;
                            return (D = o, p) | 0
                        }
                        c[f >> 2] = a | 0;
                        c[f + 4 >> 2] = j | b & 0;
                        o = 0;
                        p = 0;
                        return (D = o, p) | 0
                    }
                } while (0);
                if ((j | 0) == 0) {
                    g = l;
                    e = 0;
                    i = 0
                } else {
                    h = d | 0 | 0;
                    g = g | e & 0;
                    e = _e(h, g, -1, -1) | 0;
                    d = D;
                    i = 0;
                    do {
                        m = l;
                        l = k >>> 31 | l << 1;
                        k = i | k << 1;
                        m = b << 1 | m >>> 31 | 0;
                        n = b >>> 31 | a << 1 | 0;
                        af(e, d, m, n) | 0;
                        p = D;
                        o = p >> 31 | ((p | 0) < 0 ? -1 : 0) << 1;
                        i = o & 1;
                        b = af(m, n, o & h, (((p | 0) < 0 ? -1 : 0) >> 31 | ((p | 0) < 0 ? -1 : 0) << 1) & g) | 0;
                        a = D;
                        j = j - 1 | 0
                    } while ((j | 0) != 0);
                    g = l;
                    e = 0
                }
                h = 0;
                if ((f | 0) != 0) {
                    c[f >> 2] = b;
                    c[f + 4 >> 2] = a
                }
                o = (k | 0) >>> 31 | (g | h) << 1 | (h << 1 | k >>> 31) & 0 | e;
                p = (k << 1 | 0 >>> 31) & -2 | i;
                return (D = o, p) | 0
            }




// EMSCRIPTEN_END_FUNCS
return{_strlen:Ye,_free:Te,_opus_decoder_create:ze,_i64Add:_e,_memmove:$e,_opus_decode_float:Ie,_bitshift64Ashr:Ve,_memset:Xe,_malloc:Se,_opus_decoder_destroy:Ke,_memcpy:Ze,_llvm_ctlz_i32:We,runPostSets:Ue,stackAlloc:ra,stackSave:sa,stackRestore:ta,setThrew:ua,setTempRet0:xa,getTempRet0:ya}
// EMSCRIPTEN_END_ASM

})({"Math":Math,"Int8Array":Int8Array,"Int16Array":Int16Array,"Int32Array":Int32Array,"Uint8Array":Uint8Array,"Uint16Array":Uint16Array,"Uint32Array":Uint32Array,"Float32Array":Float32Array,"Float64Array":Float64Array},{"abort":abort,"assert":assert,"asmPrintInt":asmPrintInt,"asmPrintFloat":asmPrintFloat,"min":Math_min,"_fflush":_fflush,"_abort":_abort,"___setErrNo":___setErrNo,"_llvm_stacksave":_llvm_stacksave,"_sbrk":_sbrk,"_time":_time,"_abs":_abs,"_emscripten_memcpy_big":_emscripten_memcpy_big,"_llvm_stackrestore":_llvm_stackrestore,"_sysconf":_sysconf,"___errno_location":___errno_location,"STACKTOP":STACKTOP,"STACK_MAX":STACK_MAX,"tempDoublePtr":tempDoublePtr,"ABORT":ABORT,"cttz_i8":cttz_i8,"ctlz_i8":ctlz_i8,"NaN":NaN,"Infinity":Infinity},buffer);var _strlen=Module["_strlen"]=asm["_strlen"];var _free=Module["_free"]=asm["_free"];var _opus_decoder_create=Module["_opus_decoder_create"]=asm["_opus_decoder_create"];var _i64Add=Module["_i64Add"]=asm["_i64Add"];var _memmove=Module["_memmove"]=asm["_memmove"];var _opus_decode_float=Module["_opus_decode_float"]=asm["_opus_decode_float"];var _bitshift64Ashr=Module["_bitshift64Ashr"]=asm["_bitshift64Ashr"];var _memset=Module["_memset"]=asm["_memset"];var _malloc=Module["_malloc"]=asm["_malloc"];var _opus_decoder_destroy=Module["_opus_decoder_destroy"]=asm["_opus_decoder_destroy"];var _memcpy=Module["_memcpy"]=asm["_memcpy"];var _llvm_ctlz_i32=Module["_llvm_ctlz_i32"]=asm["_llvm_ctlz_i32"];var runPostSets=Module["runPostSets"]=asm["runPostSets"];Runtime.stackAlloc=asm["stackAlloc"];Runtime.stackSave=asm["stackSave"];Runtime.stackRestore=asm["stackRestore"];Runtime.setTempRet0=asm["setTempRet0"];Runtime.getTempRet0=asm["getTempRet0"];var i64Math=(function(){var goog={math:{}};goog.math.Long=(function(low,high){this.low_=low|0;this.high_=high|0});goog.math.Long.IntCache_={};goog.math.Long.fromInt=(function(value){if(-128<=value&&value<128){var cachedObj=goog.math.Long.IntCache_[value];if(cachedObj){return cachedObj}}var obj=new goog.math.Long(value|0,value<0?-1:0);if(-128<=value&&value<128){goog.math.Long.IntCache_[value]=obj}return obj});goog.math.Long.fromNumber=(function(value){if(isNaN(value)||!isFinite(value)){return goog.math.Long.ZERO}else if(value<=-goog.math.Long.TWO_PWR_63_DBL_){return goog.math.Long.MIN_VALUE}else if(value+1>=goog.math.Long.TWO_PWR_63_DBL_){return goog.math.Long.MAX_VALUE}else if(value<0){return goog.math.Long.fromNumber(-value).negate()}else{return new goog.math.Long(value%goog.math.Long.TWO_PWR_32_DBL_|0,value/goog.math.Long.TWO_PWR_32_DBL_|0)}});goog.math.Long.fromBits=(function(lowBits,highBits){return new goog.math.Long(lowBits,highBits)});goog.math.Long.fromString=(function(str,opt_radix){if(str.length==0){throw Error("number format error: empty string")}var radix=opt_radix||10;if(radix<2||36<radix){throw Error("radix out of range: "+radix)}if(str.charAt(0)=="-"){return goog.math.Long.fromString(str.substring(1),radix).negate()}else if(str.indexOf("-")>=0){throw Error('number format error: interior "-" character: '+str)}var radixToPower=goog.math.Long.fromNumber(Math.pow(radix,8));var result=goog.math.Long.ZERO;for(var i=0;i<str.length;i+=8){var size=Math.min(8,str.length-i);var value=parseInt(str.substring(i,i+size),radix);if(size<8){var power=goog.math.Long.fromNumber(Math.pow(radix,size));result=result.multiply(power).add(goog.math.Long.fromNumber(value))}else{result=result.multiply(radixToPower);result=result.add(goog.math.Long.fromNumber(value))}}return result});goog.math.Long.TWO_PWR_16_DBL_=1<<16;goog.math.Long.TWO_PWR_24_DBL_=1<<24;goog.math.Long.TWO_PWR_32_DBL_=goog.math.Long.TWO_PWR_16_DBL_*goog.math.Long.TWO_PWR_16_DBL_;goog.math.Long.TWO_PWR_31_DBL_=goog.math.Long.TWO_PWR_32_DBL_/2;goog.math.Long.TWO_PWR_48_DBL_=goog.math.Long.TWO_PWR_32_DBL_*goog.math.Long.TWO_PWR_16_DBL_;goog.math.Long.TWO_PWR_64_DBL_=goog.math.Long.TWO_PWR_32_DBL_*goog.math.Long.TWO_PWR_32_DBL_;goog.math.Long.TWO_PWR_63_DBL_=goog.math.Long.TWO_PWR_64_DBL_/2;goog.math.Long.ZERO=goog.math.Long.fromInt(0);goog.math.Long.ONE=goog.math.Long.fromInt(1);goog.math.Long.NEG_ONE=goog.math.Long.fromInt(-1);goog.math.Long.MAX_VALUE=goog.math.Long.fromBits(4294967295|0,2147483647|0);goog.math.Long.MIN_VALUE=goog.math.Long.fromBits(0,2147483648|0);goog.math.Long.TWO_PWR_24_=goog.math.Long.fromInt(1<<24);goog.math.Long.prototype.toInt=(function(){return this.low_});goog.math.Long.prototype.toNumber=(function(){return this.high_*goog.math.Long.TWO_PWR_32_DBL_+this.getLowBitsUnsigned()});goog.math.Long.prototype.toString=(function(opt_radix){var radix=opt_radix||10;if(radix<2||36<radix){throw Error("radix out of range: "+radix)}if(this.isZero()){return"0"}if(this.isNegative()){if(this.equals(goog.math.Long.MIN_VALUE)){var radixLong=goog.math.Long.fromNumber(radix);var div=this.div(radixLong);var rem=div.multiply(radixLong).subtract(this);return div.toString(radix)+rem.toInt().toString(radix)}else{return"-"+this.negate().toString(radix)}}var radixToPower=goog.math.Long.fromNumber(Math.pow(radix,6));var rem=this;var result="";while(true){var remDiv=rem.div(radixToPower);var intval=rem.subtract(remDiv.multiply(radixToPower)).toInt();var digits=intval.toString(radix);rem=remDiv;if(rem.isZero()){return digits+result}else{while(digits.length<6){digits="0"+digits}result=""+digits+result}}});goog.math.Long.prototype.getHighBits=(function(){return this.high_});goog.math.Long.prototype.getLowBits=(function(){return this.low_});goog.math.Long.prototype.getLowBitsUnsigned=(function(){return this.low_>=0?this.low_:goog.math.Long.TWO_PWR_32_DBL_+this.low_});goog.math.Long.prototype.getNumBitsAbs=(function(){if(this.isNegative()){if(this.equals(goog.math.Long.MIN_VALUE)){return 64}else{return this.negate().getNumBitsAbs()}}else{var val=this.high_!=0?this.high_:this.low_;for(var bit=31;bit>0;bit--){if((val&1<<bit)!=0){break}}return this.high_!=0?bit+33:bit+1}});goog.math.Long.prototype.isZero=(function(){return this.high_==0&&this.low_==0});goog.math.Long.prototype.isNegative=(function(){return this.high_<0});goog.math.Long.prototype.isOdd=(function(){return(this.low_&1)==1});goog.math.Long.prototype.equals=(function(other){return this.high_==other.high_&&this.low_==other.low_});goog.math.Long.prototype.notEquals=(function(other){return this.high_!=other.high_||this.low_!=other.low_});goog.math.Long.prototype.lessThan=(function(other){return this.compare(other)<0});goog.math.Long.prototype.lessThanOrEqual=(function(other){return this.compare(other)<=0});goog.math.Long.prototype.greaterThan=(function(other){return this.compare(other)>0});goog.math.Long.prototype.greaterThanOrEqual=(function(other){return this.compare(other)>=0});goog.math.Long.prototype.compare=(function(other){if(this.equals(other)){return 0}var thisNeg=this.isNegative();var otherNeg=other.isNegative();if(thisNeg&&!otherNeg){return-1}if(!thisNeg&&otherNeg){return 1}if(this.subtract(other).isNegative()){return-1}else{return 1}});goog.math.Long.prototype.negate=(function(){if(this.equals(goog.math.Long.MIN_VALUE)){return goog.math.Long.MIN_VALUE}else{return this.not().add(goog.math.Long.ONE)}});goog.math.Long.prototype.add=(function(other){var a48=this.high_>>>16;var a32=this.high_&65535;var a16=this.low_>>>16;var a00=this.low_&65535;var b48=other.high_>>>16;var b32=other.high_&65535;var b16=other.low_>>>16;var b00=other.low_&65535;var c48=0,c32=0,c16=0,c00=0;c00+=a00+b00;c16+=c00>>>16;c00&=65535;c16+=a16+b16;c32+=c16>>>16;c16&=65535;c32+=a32+b32;c48+=c32>>>16;c32&=65535;c48+=a48+b48;c48&=65535;return goog.math.Long.fromBits(c16<<16|c00,c48<<16|c32)});goog.math.Long.prototype.subtract=(function(other){return this.add(other.negate())});goog.math.Long.prototype.multiply=(function(other){if(this.isZero()){return goog.math.Long.ZERO}else if(other.isZero()){return goog.math.Long.ZERO}if(this.equals(goog.math.Long.MIN_VALUE)){return other.isOdd()?goog.math.Long.MIN_VALUE:goog.math.Long.ZERO}else if(other.equals(goog.math.Long.MIN_VALUE)){return this.isOdd()?goog.math.Long.MIN_VALUE:goog.math.Long.ZERO}if(this.isNegative()){if(other.isNegative()){return this.negate().multiply(other.negate())}else{return this.negate().multiply(other).negate()}}else if(other.isNegative()){return this.multiply(other.negate()).negate()}if(this.lessThan(goog.math.Long.TWO_PWR_24_)&&other.lessThan(goog.math.Long.TWO_PWR_24_)){return goog.math.Long.fromNumber(this.toNumber()*other.toNumber())}var a48=this.high_>>>16;var a32=this.high_&65535;var a16=this.low_>>>16;var a00=this.low_&65535;var b48=other.high_>>>16;var b32=other.high_&65535;var b16=other.low_>>>16;var b00=other.low_&65535;var c48=0,c32=0,c16=0,c00=0;c00+=a00*b00;c16+=c00>>>16;c00&=65535;c16+=a16*b00;c32+=c16>>>16;c16&=65535;c16+=a00*b16;c32+=c16>>>16;c16&=65535;c32+=a32*b00;c48+=c32>>>16;c32&=65535;c32+=a16*b16;c48+=c32>>>16;c32&=65535;c32+=a00*b32;c48+=c32>>>16;c32&=65535;c48+=a48*b00+a32*b16+a16*b32+a00*b48;c48&=65535;return goog.math.Long.fromBits(c16<<16|c00,c48<<16|c32)});goog.math.Long.prototype.div=(function(other){if(other.isZero()){throw Error("division by zero")}else if(this.isZero()){return goog.math.Long.ZERO}if(this.equals(goog.math.Long.MIN_VALUE)){if(other.equals(goog.math.Long.ONE)||other.equals(goog.math.Long.NEG_ONE)){return goog.math.Long.MIN_VALUE}else if(other.equals(goog.math.Long.MIN_VALUE)){return goog.math.Long.ONE}else{var halfThis=this.shiftRight(1);var approx=halfThis.div(other).shiftLeft(1);if(approx.equals(goog.math.Long.ZERO)){return other.isNegative()?goog.math.Long.ONE:goog.math.Long.NEG_ONE}else{var rem=this.subtract(other.multiply(approx));var result=approx.add(rem.div(other));return result}}}else if(other.equals(goog.math.Long.MIN_VALUE)){return goog.math.Long.ZERO}if(this.isNegative()){if(other.isNegative()){return this.negate().div(other.negate())}else{return this.negate().div(other).negate()}}else if(other.isNegative()){return this.div(other.negate()).negate()}var res=goog.math.Long.ZERO;var rem=this;while(rem.greaterThanOrEqual(other)){var approx=Math.max(1,Math.floor(rem.toNumber()/other.toNumber()));var log2=Math.ceil(Math.log(approx)/Math.LN2);var delta=log2<=48?1:Math.pow(2,log2-48);var approxRes=goog.math.Long.fromNumber(approx);var approxRem=approxRes.multiply(other);while(approxRem.isNegative()||approxRem.greaterThan(rem)){approx-=delta;approxRes=goog.math.Long.fromNumber(approx);approxRem=approxRes.multiply(other)}if(approxRes.isZero()){approxRes=goog.math.Long.ONE}res=res.add(approxRes);rem=rem.subtract(approxRem)}return res});goog.math.Long.prototype.modulo=(function(other){return this.subtract(this.div(other).multiply(other))});goog.math.Long.prototype.not=(function(){return goog.math.Long.fromBits(~this.low_,~this.high_)});goog.math.Long.prototype.and=(function(other){return goog.math.Long.fromBits(this.low_&other.low_,this.high_&other.high_)});goog.math.Long.prototype.or=(function(other){return goog.math.Long.fromBits(this.low_|other.low_,this.high_|other.high_)});goog.math.Long.prototype.xor=(function(other){return goog.math.Long.fromBits(this.low_^other.low_,this.high_^other.high_)});goog.math.Long.prototype.shiftLeft=(function(numBits){numBits&=63;if(numBits==0){return this}else{var low=this.low_;if(numBits<32){var high=this.high_;return goog.math.Long.fromBits(low<<numBits,high<<numBits|low>>>32-numBits)}else{return goog.math.Long.fromBits(0,low<<numBits-32)}}});goog.math.Long.prototype.shiftRight=(function(numBits){numBits&=63;if(numBits==0){return this}else{var high=this.high_;if(numBits<32){var low=this.low_;return goog.math.Long.fromBits(low>>>numBits|high<<32-numBits,high>>numBits)}else{return goog.math.Long.fromBits(high>>numBits-32,high>=0?0:-1)}}});goog.math.Long.prototype.shiftRightUnsigned=(function(numBits){numBits&=63;if(numBits==0){return this}else{var high=this.high_;if(numBits<32){var low=this.low_;return goog.math.Long.fromBits(low>>>numBits|high<<32-numBits,high>>>numBits)}else if(numBits==32){return goog.math.Long.fromBits(high,0)}else{return goog.math.Long.fromBits(high>>>numBits-32,0)}}});var navigator={appName:"Modern Browser"};var dbits;var canary=0xdeadbeefcafe;var j_lm=(canary&16777215)==15715070;function BigInteger(a,b,c){if(a!=null)if("number"==typeof a)this.fromNumber(a,b,c);else if(b==null&&"string"!=typeof a)this.fromString(a,256);else this.fromString(a,b)}function nbi(){return new BigInteger(null)}function am1(i,x,w,j,c,n){while(--n>=0){var v=x*this[i++]+w[j]+c;c=Math.floor(v/67108864);w[j++]=v&67108863}return c}function am2(i,x,w,j,c,n){var xl=x&32767,xh=x>>15;while(--n>=0){var l=this[i]&32767;var h=this[i++]>>15;var m=xh*l+h*xl;l=xl*l+((m&32767)<<15)+w[j]+(c&1073741823);c=(l>>>30)+(m>>>15)+xh*h+(c>>>30);w[j++]=l&1073741823}return c}function am3(i,x,w,j,c,n){var xl=x&16383,xh=x>>14;while(--n>=0){var l=this[i]&16383;var h=this[i++]>>14;var m=xh*l+h*xl;l=xl*l+((m&16383)<<14)+w[j]+c;c=(l>>28)+(m>>14)+xh*h;w[j++]=l&268435455}return c}if(j_lm&&navigator.appName=="Microsoft Internet Explorer"){BigInteger.prototype.am=am2;dbits=30}else if(j_lm&&navigator.appName!="Netscape"){BigInteger.prototype.am=am1;dbits=26}else{BigInteger.prototype.am=am3;dbits=28}BigInteger.prototype.DB=dbits;BigInteger.prototype.DM=(1<<dbits)-1;BigInteger.prototype.DV=1<<dbits;var BI_FP=52;BigInteger.prototype.FV=Math.pow(2,BI_FP);BigInteger.prototype.F1=BI_FP-dbits;BigInteger.prototype.F2=2*dbits-BI_FP;var BI_RM="0123456789abcdefghijklmnopqrstuvwxyz";var BI_RC=[];var rr,vv;rr="0".charCodeAt(0);for(vv=0;vv<=9;++vv)BI_RC[rr++]=vv;rr="a".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;rr="A".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;function int2char(n){return BI_RM.charAt(n)}function intAt(s,i){var c=BI_RC[s.charCodeAt(i)];return c==null?-1:c}function bnpCopyTo(r){for(var i=this.t-1;i>=0;--i)r[i]=this[i];r.t=this.t;r.s=this.s}function bnpFromInt(x){this.t=1;this.s=x<0?-1:0;if(x>0)this[0]=x;else if(x<-1)this[0]=x+DV;else this.t=0}function nbv(i){var r=nbi();r.fromInt(i);return r}function bnpFromString(s,b){var k;if(b==16)k=4;else if(b==8)k=3;else if(b==256)k=8;else if(b==2)k=1;else if(b==32)k=5;else if(b==4)k=2;else{this.fromRadix(s,b);return}this.t=0;this.s=0;var i=s.length,mi=false,sh=0;while(--i>=0){var x=k==8?s[i]&255:intAt(s,i);if(x<0){if(s.charAt(i)=="-")mi=true;continue}mi=false;if(sh==0)this[this.t++]=x;else if(sh+k>this.DB){this[this.t-1]|=(x&(1<<this.DB-sh)-1)<<sh;this[this.t++]=x>>this.DB-sh}else this[this.t-1]|=x<<sh;sh+=k;if(sh>=this.DB)sh-=this.DB}if(k==8&&(s[0]&128)!=0){this.s=-1;if(sh>0)this[this.t-1]|=(1<<this.DB-sh)-1<<sh}this.clamp();if(mi)BigInteger.ZERO.subTo(this,this)}function bnpClamp(){var c=this.s&this.DM;while(this.t>0&&this[this.t-1]==c)--this.t}function bnToString(b){if(this.s<0)return"-"+this.negate().toString(b);var k;if(b==16)k=4;else if(b==8)k=3;else if(b==2)k=1;else if(b==32)k=5;else if(b==4)k=2;else return this.toRadix(b);var km=(1<<k)-1,d,m=false,r="",i=this.t;var p=this.DB-i*this.DB%k;if(i-->0){if(p<this.DB&&(d=this[i]>>p)>0){m=true;r=int2char(d)}while(i>=0){if(p<k){d=(this[i]&(1<<p)-1)<<k-p;d|=this[--i]>>(p+=this.DB-k)}else{d=this[i]>>(p-=k)&km;if(p<=0){p+=this.DB;--i}}if(d>0)m=true;if(m)r+=int2char(d)}}return m?r:"0"}function bnNegate(){var r=nbi();BigInteger.ZERO.subTo(this,r);return r}function bnAbs(){return this.s<0?this.negate():this}function bnCompareTo(a){var r=this.s-a.s;if(r!=0)return r;var i=this.t;r=i-a.t;if(r!=0)return this.s<0?-r:r;while(--i>=0)if((r=this[i]-a[i])!=0)return r;return 0}function nbits(x){var r=1,t;if((t=x>>>16)!=0){x=t;r+=16}if((t=x>>8)!=0){x=t;r+=8}if((t=x>>4)!=0){x=t;r+=4}if((t=x>>2)!=0){x=t;r+=2}if((t=x>>1)!=0){x=t;r+=1}return r}function bnBitLength(){if(this.t<=0)return 0;return this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM)}function bnpDLShiftTo(n,r){var i;for(i=this.t-1;i>=0;--i)r[i+n]=this[i];for(i=n-1;i>=0;--i)r[i]=0;r.t=this.t+n;r.s=this.s}function bnpDRShiftTo(n,r){for(var i=n;i<this.t;++i)r[i-n]=this[i];r.t=Math.max(this.t-n,0);r.s=this.s}function bnpLShiftTo(n,r){var bs=n%this.DB;var cbs=this.DB-bs;var bm=(1<<cbs)-1;var ds=Math.floor(n/this.DB),c=this.s<<bs&this.DM,i;for(i=this.t-1;i>=0;--i){r[i+ds+1]=this[i]>>cbs|c;c=(this[i]&bm)<<bs}for(i=ds-1;i>=0;--i)r[i]=0;r[ds]=c;r.t=this.t+ds+1;r.s=this.s;r.clamp()}function bnpRShiftTo(n,r){r.s=this.s;var ds=Math.floor(n/this.DB);if(ds>=this.t){r.t=0;return}var bs=n%this.DB;var cbs=this.DB-bs;var bm=(1<<bs)-1;r[0]=this[ds]>>bs;for(var i=ds+1;i<this.t;++i){r[i-ds-1]|=(this[i]&bm)<<cbs;r[i-ds]=this[i]>>bs}if(bs>0)r[this.t-ds-1]|=(this.s&bm)<<cbs;r.t=this.t-ds;r.clamp()}function bnpSubTo(a,r){var i=0,c=0,m=Math.min(a.t,this.t);while(i<m){c+=this[i]-a[i];r[i++]=c&this.DM;c>>=this.DB}if(a.t<this.t){c-=a.s;while(i<this.t){c+=this[i];r[i++]=c&this.DM;c>>=this.DB}c+=this.s}else{c+=this.s;while(i<a.t){c-=a[i];r[i++]=c&this.DM;c>>=this.DB}c-=a.s}r.s=c<0?-1:0;if(c<-1)r[i++]=this.DV+c;else if(c>0)r[i++]=c;r.t=i;r.clamp()}function bnpMultiplyTo(a,r){var x=this.abs(),y=a.abs();var i=x.t;r.t=i+y.t;while(--i>=0)r[i]=0;for(i=0;i<y.t;++i)r[i+x.t]=x.am(0,y[i],r,i,0,x.t);r.s=0;r.clamp();if(this.s!=a.s)BigInteger.ZERO.subTo(r,r)}function bnpSquareTo(r){var x=this.abs();var i=r.t=2*x.t;while(--i>=0)r[i]=0;for(i=0;i<x.t-1;++i){var c=x.am(i,x[i],r,2*i,0,1);if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1))>=x.DV){r[i+x.t]-=x.DV;r[i+x.t+1]=1}}if(r.t>0)r[r.t-1]+=x.am(i,x[i],r,2*i,0,1);r.s=0;r.clamp()}function bnpDivRemTo(m,q,r){var pm=m.abs();if(pm.t<=0)return;var pt=this.abs();if(pt.t<pm.t){if(q!=null)q.fromInt(0);if(r!=null)this.copyTo(r);return}if(r==null)r=nbi();var y=nbi(),ts=this.s,ms=m.s;var nsh=this.DB-nbits(pm[pm.t-1]);if(nsh>0){pm.lShiftTo(nsh,y);pt.lShiftTo(nsh,r)}else{pm.copyTo(y);pt.copyTo(r)}var ys=y.t;var y0=y[ys-1];if(y0==0)return;var yt=y0*(1<<this.F1)+(ys>1?y[ys-2]>>this.F2:0);var d1=this.FV/yt,d2=(1<<this.F1)/yt,e=1<<this.F2;var i=r.t,j=i-ys,t=q==null?nbi():q;y.dlShiftTo(j,t);if(r.compareTo(t)>=0){r[r.t++]=1;r.subTo(t,r)}BigInteger.ONE.dlShiftTo(ys,t);t.subTo(y,y);while(y.t<ys)y[y.t++]=0;while(--j>=0){var qd=r[--i]==y0?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);if((r[i]+=y.am(0,qd,r,j,0,ys))<qd){y.dlShiftTo(j,t);r.subTo(t,r);while(r[i]<--qd)r.subTo(t,r)}}if(q!=null){r.drShiftTo(ys,q);if(ts!=ms)BigInteger.ZERO.subTo(q,q)}r.t=ys;r.clamp();if(nsh>0)r.rShiftTo(nsh,r);if(ts<0)BigInteger.ZERO.subTo(r,r)}function bnMod(a){var r=nbi();this.abs().divRemTo(a,null,r);if(this.s<0&&r.compareTo(BigInteger.ZERO)>0)a.subTo(r,r);return r}function Classic(m){this.m=m}function cConvert(x){if(x.s<0||x.compareTo(this.m)>=0)return x.mod(this.m);else return x}function cRevert(x){return x}function cReduce(x){x.divRemTo(this.m,null,x)}function cMulTo(x,y,r){x.multiplyTo(y,r);this.reduce(r)}function cSqrTo(x,r){x.squareTo(r);this.reduce(r)}Classic.prototype.convert=cConvert;Classic.prototype.revert=cRevert;Classic.prototype.reduce=cReduce;Classic.prototype.mulTo=cMulTo;Classic.prototype.sqrTo=cSqrTo;function bnpInvDigit(){if(this.t<1)return 0;var x=this[0];if((x&1)==0)return 0;var y=x&3;y=y*(2-(x&15)*y)&15;y=y*(2-(x&255)*y)&255;y=y*(2-((x&65535)*y&65535))&65535;y=y*(2-x*y%this.DV)%this.DV;return y>0?this.DV-y:-y}function Montgomery(m){this.m=m;this.mp=m.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<m.DB-15)-1;this.mt2=2*m.t}function montConvert(x){var r=nbi();x.abs().dlShiftTo(this.m.t,r);r.divRemTo(this.m,null,r);if(x.s<0&&r.compareTo(BigInteger.ZERO)>0)this.m.subTo(r,r);return r}function montRevert(x){var r=nbi();x.copyTo(r);this.reduce(r);return r}function montReduce(x){while(x.t<=this.mt2)x[x.t++]=0;for(var i=0;i<this.m.t;++i){var j=x[i]&32767;var u0=j*this.mpl+((j*this.mph+(x[i]>>15)*this.mpl&this.um)<<15)&x.DM;j=i+this.m.t;x[j]+=this.m.am(0,u0,x,i,0,this.m.t);while(x[j]>=x.DV){x[j]-=x.DV;x[++j]++}}x.clamp();x.drShiftTo(this.m.t,x);if(x.compareTo(this.m)>=0)x.subTo(this.m,x)}function montSqrTo(x,r){x.squareTo(r);this.reduce(r)}function montMulTo(x,y,r){x.multiplyTo(y,r);this.reduce(r)}Montgomery.prototype.convert=montConvert;Montgomery.prototype.revert=montRevert;Montgomery.prototype.reduce=montReduce;Montgomery.prototype.mulTo=montMulTo;Montgomery.prototype.sqrTo=montSqrTo;function bnpIsEven(){return(this.t>0?this[0]&1:this.s)==0}function bnpExp(e,z){if(e>4294967295||e<1)return BigInteger.ONE;var r=nbi(),r2=nbi(),g=z.convert(this),i=nbits(e)-1;g.copyTo(r);while(--i>=0){z.sqrTo(r,r2);if((e&1<<i)>0)z.mulTo(r2,g,r);else{var t=r;r=r2;r2=t}}return z.revert(r)}function bnModPowInt(e,m){var z;if(e<256||m.isEven())z=new Classic(m);else z=new Montgomery(m);return this.exp(e,z)}BigInteger.prototype.copyTo=bnpCopyTo;BigInteger.prototype.fromInt=bnpFromInt;BigInteger.prototype.fromString=bnpFromString;BigInteger.prototype.clamp=bnpClamp;BigInteger.prototype.dlShiftTo=bnpDLShiftTo;BigInteger.prototype.drShiftTo=bnpDRShiftTo;BigInteger.prototype.lShiftTo=bnpLShiftTo;BigInteger.prototype.rShiftTo=bnpRShiftTo;BigInteger.prototype.subTo=bnpSubTo;BigInteger.prototype.multiplyTo=bnpMultiplyTo;BigInteger.prototype.squareTo=bnpSquareTo;BigInteger.prototype.divRemTo=bnpDivRemTo;BigInteger.prototype.invDigit=bnpInvDigit;BigInteger.prototype.isEven=bnpIsEven;BigInteger.prototype.exp=bnpExp;BigInteger.prototype.toString=bnToString;BigInteger.prototype.negate=bnNegate;BigInteger.prototype.abs=bnAbs;BigInteger.prototype.compareTo=bnCompareTo;BigInteger.prototype.bitLength=bnBitLength;BigInteger.prototype.mod=bnMod;BigInteger.prototype.modPowInt=bnModPowInt;BigInteger.ZERO=nbv(0);BigInteger.ONE=nbv(1);function bnpFromRadix(s,b){this.fromInt(0);if(b==null)b=10;var cs=this.chunkSize(b);var d=Math.pow(b,cs),mi=false,j=0,w=0;for(var i=0;i<s.length;++i){var x=intAt(s,i);if(x<0){if(s.charAt(i)=="-"&&this.signum()==0)mi=true;continue}w=b*w+x;if(++j>=cs){this.dMultiply(d);this.dAddOffset(w,0);j=0;w=0}}if(j>0){this.dMultiply(Math.pow(b,j));this.dAddOffset(w,0)}if(mi)BigInteger.ZERO.subTo(this,this)}function bnpChunkSize(r){return Math.floor(Math.LN2*this.DB/Math.log(r))}function bnSigNum(){if(this.s<0)return-1;else if(this.t<=0||this.t==1&&this[0]<=0)return 0;else return 1}function bnpDMultiply(n){this[this.t]=this.am(0,n-1,this,0,0,this.t);++this.t;this.clamp()}function bnpDAddOffset(n,w){if(n==0)return;while(this.t<=w)this[this.t++]=0;this[w]+=n;while(this[w]>=this.DV){this[w]-=this.DV;if(++w>=this.t)this[this.t++]=0;++this[w]}}function bnpToRadix(b){if(b==null)b=10;if(this.signum()==0||b<2||b>36)return"0";var cs=this.chunkSize(b);var a=Math.pow(b,cs);var d=nbv(a),y=nbi(),z=nbi(),r="";this.divRemTo(d,y,z);while(y.signum()>0){r=(a+z.intValue()).toString(b).substr(1)+r;y.divRemTo(d,y,z)}return z.intValue().toString(b)+r}function bnIntValue(){if(this.s<0){if(this.t==1)return this[0]-this.DV;else if(this.t==0)return-1}else if(this.t==1)return this[0];else if(this.t==0)return 0;return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]}function bnpAddTo(a,r){var i=0,c=0,m=Math.min(a.t,this.t);while(i<m){c+=this[i]+a[i];r[i++]=c&this.DM;c>>=this.DB}if(a.t<this.t){c+=a.s;while(i<this.t){c+=this[i];r[i++]=c&this.DM;c>>=this.DB}c+=this.s}else{c+=this.s;while(i<a.t){c+=a[i];r[i++]=c&this.DM;c>>=this.DB}c+=a.s}r.s=c<0?-1:0;if(c>0)r[i++]=c;else if(c<-1)r[i++]=this.DV+c;r.t=i;r.clamp()}BigInteger.prototype.fromRadix=bnpFromRadix;BigInteger.prototype.chunkSize=bnpChunkSize;BigInteger.prototype.signum=bnSigNum;BigInteger.prototype.dMultiply=bnpDMultiply;BigInteger.prototype.dAddOffset=bnpDAddOffset;BigInteger.prototype.toRadix=bnpToRadix;BigInteger.prototype.intValue=bnIntValue;BigInteger.prototype.addTo=bnpAddTo;var Wrapper={abs:(function(l,h){var x=new goog.math.Long(l,h);var ret;if(x.isNegative()){ret=x.negate()}else{ret=x}HEAP32[tempDoublePtr>>2]=ret.low_;HEAP32[tempDoublePtr+4>>2]=ret.high_}),ensureTemps:(function(){if(Wrapper.ensuredTemps)return;Wrapper.ensuredTemps=true;Wrapper.two32=new BigInteger;Wrapper.two32.fromString("4294967296",10);Wrapper.two64=new BigInteger;Wrapper.two64.fromString("18446744073709551616",10);Wrapper.temp1=new BigInteger;Wrapper.temp2=new BigInteger}),lh2bignum:(function(l,h){var a=new BigInteger;a.fromString(h.toString(),10);var b=new BigInteger;a.multiplyTo(Wrapper.two32,b);var c=new BigInteger;c.fromString(l.toString(),10);var d=new BigInteger;c.addTo(b,d);return d}),stringify:(function(l,h,unsigned){var ret=(new goog.math.Long(l,h)).toString();if(unsigned&&ret[0]=="-"){Wrapper.ensureTemps();var bignum=new BigInteger;bignum.fromString(ret,10);ret=new BigInteger;Wrapper.two64.addTo(bignum,ret);ret=ret.toString(10)}return ret}),fromString:(function(str,base,min,max,unsigned){Wrapper.ensureTemps();var bignum=new BigInteger;bignum.fromString(str,base);var bigmin=new BigInteger;bigmin.fromString(min,10);var bigmax=new BigInteger;bigmax.fromString(max,10);if(unsigned&&bignum.compareTo(BigInteger.ZERO)<0){var temp=new BigInteger;bignum.addTo(Wrapper.two64,temp);bignum=temp}var error=false;if(bignum.compareTo(bigmin)<0){bignum=bigmin;error=true}else if(bignum.compareTo(bigmax)>0){bignum=bigmax;error=true}var ret=goog.math.Long.fromString(bignum.toString());HEAP32[tempDoublePtr>>2]=ret.low_;HEAP32[tempDoublePtr+4>>2]=ret.high_;if(error)throw"range error"})};return Wrapper})();if(memoryInitializer){if(ENVIRONMENT_IS_NODE||ENVIRONMENT_IS_SHELL){var data=Module["readBinary"](memoryInitializer);HEAPU8.set(data,STATIC_BASE)}else{addRunDependency("memory initializer");Browser.asyncLoad(memoryInitializer,(function(data){HEAPU8.set(data,STATIC_BASE);removeRunDependency("memory initializer")}),(function(data){throw"could not load memory initializer "+memoryInitializer}))}}function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}ExitStatus.prototype=new Error;ExitStatus.prototype.constructor=ExitStatus;var initialStackTop;var preloadStartTime=null;var calledMain=false;dependenciesFulfilled=function runCaller(){if(!Module["calledRun"]&&shouldRunNow)run();if(!Module["calledRun"])dependenciesFulfilled=runCaller};Module["callMain"]=Module.callMain=function callMain(args){assert(runDependencies==0,"cannot call main when async dependencies remain! (listen on __ATMAIN__)");assert(__ATPRERUN__.length==0,"cannot call main when preRun functions remain to be called");args=args||[];ensureInitRuntime();var argc=args.length+1;function pad(){for(var i=0;i<4-1;i++){argv.push(0)}}var argv=[allocate(intArrayFromString(Module["thisProgram"]||"/bin/this.program"),"i8",ALLOC_NORMAL)];pad();for(var i=0;i<argc-1;i=i+1){argv.push(allocate(intArrayFromString(args[i]),"i8",ALLOC_NORMAL));pad()}argv.push(0);argv=allocate(argv,"i32",ALLOC_NORMAL);initialStackTop=STACKTOP;try{var ret=Module["_main"](argc,argv,0);if(!Module["noExitRuntime"]){exit(ret)}}catch(e){if(e instanceof ExitStatus){}else if(e=="SimulateInfiniteLoop"){Module["noExitRuntime"]=true;}else{if(e&&typeof e==="object"&&e.stack)Module.printErr("exception thrown: "+[e,e.stack]);throw e}}finally{calledMain=true}};function run(args){args=args||Module["arguments"];if(preloadStartTime===null)preloadStartTime=Date.now();if(runDependencies>0){Module.printErr("run() called, but dependencies remain, so not running");return}preRun();if(runDependencies>0)return;if(Module["calledRun"])return;function doRun(){if(Module["calledRun"])return;Module["calledRun"]=true;ensureInitRuntime();preMain();if(ENVIRONMENT_IS_WEB&&preloadStartTime!==null){Module.printErr("pre-main prep time: "+(Date.now()-preloadStartTime)+" ms")}if(Module["_main"]&&shouldRunNow){Module["callMain"](args)}postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout((function(){setTimeout((function(){Module["setStatus"]("")}),1);if(!ABORT)doRun()}),1)}else{doRun()}}Module["run"]=Module.run=run;function exit(status){ABORT=true;EXITSTATUS=status;STACKTOP=initialStackTop;exitRuntime();throw new ExitStatus(status)}Module["exit"]=Module.exit=exit;function abort(text){if(text){Module.print(text);Module.printErr(text)}ABORT=true;EXITSTATUS=1;var extra="\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";throw"abort() at "+stackTrace()+extra}Module["abort"]=Module.abort=abort;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}var shouldRunNow=true;if(Module["noInitialRun"]){shouldRunNow=false}run();




module.exports = Module

},{}],2:[function(require,module,exports){
exports.OpusDecoder = require('./src/decoder');
exports.OggDemuxer  = require('./src/demuxer');

},{"./src/decoder":3,"./src/demuxer":4}],3:[function(require,module,exports){
var AV = (typeof window !== "undefined" ? window.AV : typeof global !== "undefined" ? global.AV : null);
var opus = require('../build/libopus');

var OpusDecoder = AV.Decoder.extend(function() {
  AV.Decoder.register('opus', this);
  
  this.prototype.init = function() {
    this.buflen = 4096;
    this.buf = opus._malloc(this.buflen);
    
    this.outlen = 4096;
    this.outbuf = opus._malloc(this.outlen * this.format.channelsPerFrame * 4);
    this.f32 = this.outbuf >> 2;
    
    this.opus = opus._opus_decoder_create(this.format.sampleRate, this.format.channelsPerFrame, this.buf);
  };
  
  this.prototype.readChunk = function() {
    if (!this.stream.available(1))
      throw new AV.UnderflowError();
    
    var list = this.stream.list;
    var packet = list.first;
    list.advance();
    
    if (this.buflen < packet.length) {
      this.buf = opus._realloc(this.buf, packet.length);
      this.buflen = packet.length;
    }
    
    opus.HEAPU8.set(packet.data, this.buf);
    
    var len = opus._opus_decode_float(this.opus, this.buf, packet.length, this.outbuf, this.outlen, 0);
    if (len < 0)
      throw new Error("Opus decoding error: " + len);
      
    var samples = opus.HEAPF32.subarray(this.f32, this.f32 + len * this.format.channelsPerFrame);
    return new Float32Array(samples);
  };
  
  this.prototype.destroy = function() {
    this._super();
    opus._free(this.buf);
    opus._free(this.outbuf);
    opus._opus_decoder_destroy(this.opus);
    
    this.buf = null;
    this.outbuf = null;
    this.opus = null;
  };
});

module.exports = OpusDecoder;

},{"../build/libopus":1}],4:[function(require,module,exports){
var AV = (typeof window !== "undefined" ? window.AV : typeof global !== "undefined" ? global.AV : null);
var OggDemuxer = (typeof window !== "undefined" ? window.AV.OggDemuxer : typeof global !== "undefined" ? global.AV.OggDemuxer : null);

OggDemuxer.plugins.push({
  magic: "OpusHead",
  
  readHeaders: function(packet) {
    if (packet[8] !== 1)
      throw new Error("Unknown opus version");
    
    this.emit('format', {
      formatID: 'opus',
      sampleRate: 48000,
      channelsPerFrame: packet[9],
      floatingPoint: true
    });
    
    return true;
  },
  
  readPacket: function(packet) {
    var tag = packet.subarray(0, 8);
    if (String.fromCharCode.apply(String, tag) === "OpusTags") {
      var stream = AV.Stream.fromBuffer(new AV.Buffer(packet));
      stream.advance(8);
      
      var metadata = {};
      var len = stream.readUInt32(true);
      metadata.vendor = stream.readString(len);
      
      var length = stream.readUInt32(true);
      
      for (var i = 0; i < length; i++) {
        len = stream.readUInt32(true);
        var str = stream.readString(len, 'utf8'),
          idx = str.indexOf('=');
          
        metadata[str.slice(0, idx).toLowerCase()] = str.slice(idx + 1);
      }
      
      this.emit('metadata', metadata);
    } else {
      this.emit('data', new AV.Buffer(packet));
    }
  }
});

module.exports = OggDemuxer;

},{}]},{},[2]);