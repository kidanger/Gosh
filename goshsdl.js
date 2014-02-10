// Note: Some Emscripten settings will significantly limit the speed of the generated code.
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  if (!Module['printErr']) Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };

  var nodeFS = require('fs');
  var nodePath = require('path');

  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };

  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };

  Module['load'] = function load(f) {
    globalEval(read(f));
  };

  Module['arguments'] = process['argv'].slice(2);

  module['exports'] = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }

  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  this['Module'] = Module;

  eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (ENVIRONMENT_IS_WEB) {
    this['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}



// === Auto-generated preamble library stuff ===

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (vararg) return 8;
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_ && type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      assert(args.length == sig.length-1);
      return FUNCTION_TABLE[ptr].apply(null, args);
    } else {
      assert(sig.length == 1);
      return FUNCTION_TABLE[ptr]();
    }
  },
  addFunction: function (func) {
    var table = FUNCTION_TABLE;
    var ret = table.length;
    assert(ret % 2 === 0);
    table.push(func);
    for (var i = 0; i < 2-1; i++) table.push(0);
    return ret;
  },
  removeFunction: function (index) {
    var table = FUNCTION_TABLE;
    table[index] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    code = Pointer_stringify(code);
    if (code[0] === '"') {
      // tolerate EM_ASM("..code..") even though EM_ASM(..code..) is correct
      if (code.indexOf('"', 1) === code.length-1) {
        code = code.substr(1, code.length-2);
      } else {
        // something invalid happened, e.g. EM_ASM("..code($0)..", input)
        abort('invalid EM_ASM input |' + code + '|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)');
      }
    }
    return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + code + ' })'); // new Function does not allow upvars in node
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;

      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }

      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }

      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + (assert(!staticSealed),size))|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + (assert(DYNAMICTOP > 0),size))|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((low>>>0)+((high>>>0)*4294967296)) : ((low>>>0)+((high|0)*4294967296))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}


Module['Runtime'] = Runtime;









//========================================
// Runtime essentials
//========================================

var __THREW__ = 0; // Used in checking for thrown exceptions.
var setjmpId = 1; // Used in setjmp/longjmp
var setjmpLabels = {};

var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}

// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}

// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;

// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,Math_abs(tempDouble) >= 1 ? (tempDouble > 0 ? Math_min(Math_floor((tempDouble)/4294967296), 4294967295)>>>0 : (~~(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296)))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;

// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    assert(type, 'Must know what type to store in allocate!');

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
Module['allocate'] = allocate;

function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    assert(ptr + i < TOTAL_MEMORY);
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }

  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    assert(ptr + i < TOTAL_MEMORY);
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
}
Module['stringToUTF16'] = stringToUTF16;

// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;

function demangle(func) {
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    var i = 3;
    // params, etc.
    var basicTypes = {
      'v': 'void',
      'b': 'bool',
      'c': 'char',
      's': 'short',
      'i': 'int',
      'l': 'long',
      'f': 'float',
      'd': 'double',
      'w': 'wchar_t',
      'a': 'signed char',
      'h': 'unsigned char',
      't': 'unsigned short',
      'j': 'unsigned int',
      'm': 'unsigned long',
      'x': 'long long',
      'y': 'unsigned long long',
      'z': '...'
    };
    function dump(x) {
      //return;
      if (x) Module.print(x);
      Module.print(func);
      var pre = '';
      for (var a = 0; a < i; a++) pre += ' ';
      Module.print (pre + '^');
    }
    var subs = [];
    function parseNested() {
      i++;
      if (func[i] === 'K') i++; // ignore const
      var parts = [];
      while (func[i] !== 'E') {
        if (func[i] === 'S') { // substitution
          i++;
          var next = func.indexOf('_', i);
          var num = func.substring(i, next) || 0;
          parts.push(subs[num] || '?');
          i = next+1;
          continue;
        }
        if (func[i] === 'C') { // constructor
          parts.push(parts[parts.length-1]);
          i += 2;
          continue;
        }
        var size = parseInt(func.substr(i));
        var pre = size.toString().length;
        if (!size || !pre) { i--; break; } // counter i++ below us
        var curr = func.substr(i + pre, size);
        parts.push(curr);
        subs.push(curr);
        i += pre + size;
      }
      i++; // skip E
      return parts;
    }
    var first = true;
    function parse(rawList, limit, allowVoid) { // main parser
      limit = limit || Infinity;
      var ret = '', list = [];
      function flushList() {
        return '(' + list.join(', ') + ')';
      }
      var name;
      if (func[i] === 'N') {
        // namespaced N-E
        name = parseNested().join('::');
        limit--;
        if (limit === 0) return rawList ? [name] : name;
      } else {
        // not namespaced
        if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
        var size = parseInt(func.substr(i));
        if (size) {
          var pre = size.toString().length;
          name = func.substr(i + pre, size);
          i += pre + size;
        }
      }
      first = false;
      if (func[i] === 'I') {
        i++;
        var iList = parse(true);
        var iRet = parse(true, 1, true);
        ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
      } else {
        ret = name;
      }
      paramLoop: while (i < func.length && limit-- > 0) {
        //dump('paramLoop');
        var c = func[i++];
        if (c in basicTypes) {
          list.push(basicTypes[c]);
        } else {
          switch (c) {
            case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
            case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
            case 'L': { // literal
              i++; // skip basic type
              var end = func.indexOf('E', i);
              var size = end - i;
              list.push(func.substr(i, size));
              i += size + 2; // size + 'EE'
              break;
            }
            case 'A': { // array
              var size = parseInt(func.substr(i));
              i += size.toString().length;
              if (func[i] !== '_') throw '?';
              i++; // skip _
              list.push(parse(true, 1, true)[0] + ' [' + size + ']');
              break;
            }
            case 'E': break paramLoop;
            default: ret += '?' + c; break paramLoop;
          }
        }
      }
      if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
      return rawList ? list : ret + flushList();
    }
    return parse();
  } catch(e) {
    return func;
  }
}

function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}

function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}

// Memory management

var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}

var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk

function enlargeMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.');
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;


// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');

var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);

// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');

Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;

function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}

function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;

// Tools

// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;

// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr;
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;

function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];


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

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            Module.printErr('still waiting on run dependencies:');
          }
          Module.printErr('dependency: ' + dep);
        }
        if (shown) {
          Module.printErr('(end of list)');
        }
      }, 10000);
    }
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


var memoryInitializer = null;

// === Body ===



STATIC_BASE = 8;

STATICTOP = STATIC_BASE + 2040;


/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });

var _stderr;
var _stderr=_stderr=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);;





































































































































































/* memory initializer */ allocate([16,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,12,0,0,0,20,0,0,0,64,0,0,0,0,0,0,0,255,255,255,0,0,0,0,0,98,108,97,110,99,0,0,0,91,37,115,58,37,100,93,9,80,108,97,116,101,97,117,32,105,100,101,110,116,105,113,117,101,10,0,0,0,0,0,0,65,108,195,169,97,116,111,105,114,101,0,0,0,0,0,0,110,111,105,114,0,0,0,0,105,110,105,116,105,97,108,105,115,101,114,95,111,114,100,105,0,0,0,0,0,0,0,0,80,114,111,103,114,97,109,109,101,32,58,0,0,0,0,0,71,97,103,110,97,110,116,32,58,32,37,115,32,40,37,115,41,32,37,46,49,102,32,45,32,37,46,49,102,0,0,0,110,111,101,117,100,0,0,0,78,111,109,32,58,0,0,0,115,97,117,118,101,103,97,114,100,101,114,0,0,0,0,0,67,111,117,108,101,117,114,32,105,110,118,97,108,105,100,101,32,39,37,99,39,32,101,110,32,37,100,44,37,100,10,0,79,114,100,105,110,97,116,101,117,114,0,0,0,0,0,0,83,97,117,118,101,103,97,114,100,101,114,0,0,0,0,0,37,99,0,0,0,0,0,0,72,117,109,97,105,110,0,0,76,97,32,114,195,169,99,117,112,195,169,114,97,116,105,111,110,32,100,101,32,108,97,32,102,111,110,99,116,105,111,110,32,37,115,32,97,32,195,169,99,104,111,117,195,169,101,46,10,0,0,0,0,0,0,0,80,97,115,115,101,114,32,115,111,110,32,116,111,117,114,0,114,0,0,0,0,0,0,0,106,32,60,32,112,108,97,116,101,97,117,45,62,116,97,105,108,108,101,0,0,0,0,0,65,117,32,116,111,117,114,32,100,101,32,37,115,0,0,0,74,111,117,101,117,114,32,110,111,105,114,32,58,0,0,0,110,111,116,105,102,105,99,97,116,105,111,110,95,99,111,117,112,95,111,114,100,105,0,0,82,101,116,111,117,114,32,109,101,110,117,0,0,0,0,0,82,101,116,111,117,114,0,0,37,100,10,0,0,0,0,0,105,32,60,32,112,108,97,116,101,97,117,45,62,116,97,105,108,108,101,0,0,0,0,0,67,104,97,114,103,101,114,0,91,37,115,58,37,100,93,9,80,97,114,116,105,101,32,116,101,114,109,105,110,195,169,101,10,0,0,0,0,0,0,0,47,104,111,109,101,47,97,110,103,101,114,47,100,101,118,47,71,111,115,104,47,114,101,115,115,111,117,114,99,101,115,47,97,114,105,97,108,46,116,116,102,0,0,0,0,0,0,0,114,101,109,112,108,97,99,101,114,95,112,108,97,116,101,97,117,95,111,114,100,105,0,0,80,97,114,116,105,101,32,116,101,114,109,105,110,195,169,101,32,33,0,0,0,0,0,0,67,104,97,114,103,101,114,0,73,109,112,111,115,115,105,98,108,101,32,100,101,32,99,104,97,114,103,101,114,32,108,97,32,112,97,114,116,105,101,32,33,0,0,0,0,0,0,0,114,97,110,100,111,109,0,0,106,32,62,61,32,48,0,0,103,110,117,103,111,0,0,0,105,100,95,116,101,120,116,105,110,112,117,116,32,61,61,32,78,85,77,95,84,69,88,84,73,78,80,85,84,83,0,0,74,111,117,101,114,0,0,0,46,46,47,46,46,47,46,46,47,115,114,99,47,103,111,47,112,97,114,116,105,101,46,99,0,0,0,0,0,0,0,0,105,100,95,103,114,111,117,112,101,32,61,61,32,78,85,77,95,71,82,79,85,80,69,83,0,0,0,0,0,0,0,0,106,111,117,101,114,95,99,111,117,112,95,111,114,100,105,0,105,100,95,98,111,117,116,111,110,32,61,61,32,78,85,77,95,66,79,85,84,79,78,83,0,0,0,0,0,0,0,0,91,37,115,58,37,100,93,9,73,110,105,116,105,97,108,105,115,97,116,105,111,110,32,100,117,32,98,111,116,114,97,110,100,111,109,10,0,0,0,0,46,46,47,46,46,47,46,46,47,115,114,99,47,103,111,115,104,95,101,110,115,101,109,98,108,101,46,99,0,0,0,0,46,46,47,46,46,47,46,46,47,115,114,99,47,115,100,108,47,109,101,110,117,46,99,0,110,111,101,117,100,0,0,0,110,111,101,117,100,0,0,0,105,100,95,108,97,98,101,108,32,61,61,32,78,85,77,95,76,65,66,69,76,83,0,0,72,97,110,100,105,99,97,112,32,58,0,0,0,0,0,0,119,0,0,0,0,0,0,0,80,105,101,114,114,101,32,100,101,32,104,97,110,100,105,99,97,112,0,0,0,0,0,0,49,57,120,49,57,0,0,0,47,117,115,114,47,108,111,99,97,108,47,115,104,97,114,101,47,103,111,115,104,47,97,114,105,97,108,46,116,116,102,0,49,51,120,49,51,0,0,0,83,97,105,115,105,114,32,108,101,32,110,111,109,32,100,101,32,108,97,32,112,97,114,116,105,101,32,58,0,0,0,0,57,120,57,0,0,0,0,0,81,117,105,116,116,101,114,0,46,46,47,46,46,47,46,46,47,115,114,99,47,111,114,100,105,110,97,116,101,117,114,115,47,114,97,110,100,111,109,47,109,97,105,110,46,99,0,0,46,46,47,46,46,47,46,46,47,115,114,99,47,103,111,115,104,95,101,110,115,101,109,98,108,101,46,99,0,0,0,0,46,46,47,46,46,47,46,46,47,115,114,99,47,103,111,115,104,95,101,110,115,101,109,98,108,101,46,99,0,0,0,0,37,99,37,115,10,37,115,10,0,0,0,0,0,0,0,0,46,46,47,46,46,47,46,46,47,115,114,99,47,103,111,47,112,108,97,116,101,97,117,46,99,0,0,0,0,0,0,0,105,32,62,61,32,48,0,0,84,97,105,108,108,101,32,58,0,0,0,0,0,0,0,0,74,111,117,101,117,114,32,98,108,97,110,99,32,58,0,0,71,111,115,104,0,0,0,0,81,117,105,116,116,101,33,10,0,0,0,0,0,0,0,0,112,108,97,116,101,97,117,95,115,101,116,0,0,0,0,0,112,108,97,116,101,97,117,95,103,101,116,0,0,0,0,0,101,110,115,101,109,98,108,101,95,112,111,115,105,116,105,111,110,95,103,101,116,0,0,0,101,110,115,101,109,98,108,101,95,112,108,97,116,101,97,117,95,103,101,116,0,0,0,0,101,110,115,101,109,98,108,101,95,99,104,97,105,110,101,95,103,101,116,0,0,0,0,0,99,114,101,101,114,95,109,101,110,117,0,0,0,0,0,0,255,255,0,0,0,0,0,0,40,2,0,0,40,4,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
function runPostSets() {


}

var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}


  var _llvm_dbg_declare=undefined;

  
  
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value;
      return value;
    }
  
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 0777, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
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
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 0777 | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            assert(buffer.length);
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = {};
        for (var key in src.files) {
          if (!src.files.hasOwnProperty(key)) continue;
          var e = src.files[key];
          var e2 = dst.files[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create[key] = e;
            total++;
          }
        }
  
        var remove = {};
        for (var key in dst.files) {
          if (!dst.files.hasOwnProperty(key)) continue;
          var e = dst.files[key];
          var e2 = src.files[key];
          if (!e2) {
            remove[key] = e;
            total++;
          }
        }
  
        if (!total) {
          // early out
          return callback(null);
        }
  
        var completed = 0;
        function done(err) {
          if (err) return callback(err);
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        // create a single transaction to handle and IDB reads / writes we'll need to do
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        transaction.onerror = function transaction_onerror() { callback(this.error); };
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        for (var path in create) {
          if (!create.hasOwnProperty(path)) continue;
          var entry = create[path];
  
          if (dst.type === 'local') {
            // save file to local
            try {
              if (FS.isDir(entry.mode)) {
                FS.mkdir(path, entry.mode);
              } else if (FS.isFile(entry.mode)) {
                var stream = FS.open(path, 'w+', 0666);
                FS.write(stream, entry.contents, 0, entry.contents.length, 0, true /* canOwn */);
                FS.close(stream);
              }
              done(null);
            } catch (e) {
              return done(e);
            }
          } else {
            // save file to IDB
            var req = store.put(entry, path);
            req.onsuccess = function req_onsuccess() { done(null); };
            req.onerror = function req_onerror() { done(this.error); };
          }
        }
  
        for (var path in remove) {
          if (!remove.hasOwnProperty(path)) continue;
          var entry = remove[path];
  
          if (dst.type === 'local') {
            // delete file from local
            try {
              if (FS.isDir(entry.mode)) {
                // TODO recursive delete?
                FS.rmdir(path);
              } else if (FS.isFile(entry.mode)) {
                FS.unlink(path);
              }
              done(null);
            } catch (e) {
              return done(e);
            }
          } else {
            // delete file from IDB
            var req = store.delete(path);
            req.onsuccess = function req_onsuccess() { done(null); };
            req.onerror = function req_onerror() { done(this.error); };
          }
        }
      },getLocalSet:function (mount, callback) {
        var files = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint)
          .filter(isRealDir)
          .map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat, node;
  
          try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path)
              .filter(isRealDir)
              .map(toAbsolute(path)));
  
            files[path] = { mode: stat.mode, timestamp: stat.mtime };
          } else if (FS.isFile(stat.mode)) {
            files[path] = { contents: node.contents, mode: stat.mode, timestamp: stat.mtime };
          } else {
            return callback(new Error('node type not supported'));
          }
        }
  
        return callback(null, { type: 'local', files: files });
      },getDB:function (name, callback) {
        // look it up in the cache
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        req.onupgradeneeded = function req_onupgradeneeded() {
          db = req.result;
          db.createObjectStore(IDBFS.DB_STORE_NAME);
        };
        req.onsuccess = function req_onsuccess() {
          db = req.result;
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function req_onerror() {
          callback(this.error);
        };
      },getRemoteSet:function (mount, callback) {
        var files = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function transaction_onerror() { callback(this.error); };
  
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          store.openCursor().onsuccess = function store_openCursor_onsuccess(event) {
            var cursor = event.target.result;
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, files: files });
            }
  
            files[cursor.key] = cursor.value;
            cursor.continue();
          };
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
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
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          stream.position = position;
          return position;
        }}};
  
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[null],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || { recurse_count: 0 };
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            current = current.mount.root;
          }
  
          // follow symlinks
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
            this.parent = null;
            this.mount = null;
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            FS.hashAddNode(this);
          };
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          FS.FSNode.prototype = {};
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
        return new FS.FSNode(parent, name, mode, rdev);
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 1;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        if (stream.__proto__) {
          // reuse the object
          stream.__proto__ = FS.FSStream.prototype;
        } else {
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
        }
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        var completed = 0;
        var total = FS.mounts.length;
        function done(err) {
          if (err) {
            return callback(err);
          }
          if (++completed >= total) {
            callback(null);
          }
        };
  
        // sync all mounts
        for (var i = 0; i < FS.mounts.length; i++) {
          var mount = FS.mounts[i];
          if (!mount.type.syncfs) {
            done(null);
            continue;
          }
          mount.type.syncfs(mount, populate, done);
        }
      },mount:function (type, opts, mountpoint) {
        var lookup;
        if (mountpoint) {
          lookup = FS.lookupPath(mountpoint, { follow: false });
          mountpoint = lookup.path;  // use the absolute path
        }
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          root: null
        };
        // create a root node for the fs
        var root = type.mount(mount);
        root.mount = mount;
        mount.root = root;
        // assign the mount info to the mountpoint's node
        if (lookup) {
          lookup.node.mount = mount;
          lookup.node.mounted = true;
          // compatibility update FS.root if we mount to /
          if (mountpoint === '/') {
            FS.root = mount.root;
          }
        }
        // add to our cached list of mounts
        FS.mounts.push(mount);
        return root;
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 0666;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 0777;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 0666;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path, { follow: false });
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 0666 : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0);
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=stdin.fd;
        assert(stdin.fd === 1, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=stdout.fd;
        assert(stdout.fd === 2, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=stderr.fd;
        assert(stderr.fd === 3, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
          if (this.stack) this.stack = demangleAll(this.stack);
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.root = FS.createNode(null, '/', 16384 | 0777, 0);
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
  
              if (!hasByteServing) chunkSize = datalength;
  
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
  
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
  
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
  
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            assert(typeof url == 'string', 'createObjectURL must return a url as a string');
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
        // Canvas event setup
  
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
  
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
  
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
  
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
  
  
            var errorInfo = '?';
            function onContextCreationError(event) {
              errorInfo = event.statusMessage || errorInfo;
            }
            canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
            try {
              ['experimental-webgl', 'webgl'].some(function(webglId) {
                return ctx = canvas.getContext(webglId, contextAttributes);
              });
            } finally {
              canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            }
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
  
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          GLctx = Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
  
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
  
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
          // and we have no viable fallback.
          assert((typeof scrollX !== 'undefined') && (typeof scrollY !== 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (scrollX + rect.left);
              y = t.pageY - (scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (scrollX + rect.left);
            y = event.pageY - (scrollY + rect.top);
          }
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};var SDL={defaults:{width:320,height:200,copyOnLock:true},version:null,surfaces:{},canvasPool:[],events:[],fonts:[null],audios:[null],rwops:[null],music:{audio:null,volume:1},mixerFrequency:22050,mixerFormat:32784,mixerNumChannels:2,mixerChunkSize:1024,channelMinimumNumber:0,GL:false,glAttributes:{0:3,1:3,2:2,3:0,4:0,5:1,6:16,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:1,16:0,17:0,18:0},keyboardState:null,keyboardMap:{},canRequestFullscreen:false,isRequestingFullscreen:false,textInput:false,startTime:null,initFlags:0,buttonState:0,modState:0,DOMButtons:[0,0,0],DOMEventToSDLEvent:{},keyCodes:{16:1249,17:1248,18:1250,33:1099,34:1102,37:1104,38:1106,39:1103,40:1105,46:127,96:1112,97:1113,98:1114,99:1115,100:1116,101:1117,102:1118,103:1119,104:1120,105:1121,112:1082,113:1083,114:1084,115:1085,116:1086,117:1087,118:1088,119:1089,120:1090,121:1091,122:1092,123:1093,173:45,188:44,190:46,191:47,192:96},scanCodes:{8:42,9:43,13:40,27:41,32:44,44:54,46:55,47:56,48:39,49:30,50:31,51:32,52:33,53:34,54:35,55:36,56:37,57:38,59:51,61:46,91:47,92:49,93:48,96:52,97:4,98:5,99:6,100:7,101:8,102:9,103:10,104:11,105:12,106:13,107:14,108:15,109:16,110:17,111:18,112:19,113:20,114:21,115:22,116:23,117:24,118:25,119:26,120:27,121:28,122:29,305:224,308:226},loadRect:function (rect) {
        return {
          x: HEAP32[((rect + 0)>>2)],
          y: HEAP32[((rect + 4)>>2)],
          w: HEAP32[((rect + 8)>>2)],
          h: HEAP32[((rect + 12)>>2)]
        };
      },loadColorToCSSRGB:function (color) {
        var rgba = HEAP32[((color)>>2)];
        return 'rgb(' + (rgba&255) + ',' + ((rgba >> 8)&255) + ',' + ((rgba >> 16)&255) + ')';
      },loadColorToCSSRGBA:function (color) {
        var rgba = HEAP32[((color)>>2)];
        return 'rgba(' + (rgba&255) + ',' + ((rgba >> 8)&255) + ',' + ((rgba >> 16)&255) + ',' + (((rgba >> 24)&255)/255) + ')';
      },translateColorToCSSRGBA:function (rgba) {
        return 'rgba(' + (rgba&0xff) + ',' + (rgba>>8 & 0xff) + ',' + (rgba>>16 & 0xff) + ',' + (rgba>>>24)/0xff + ')';
      },translateRGBAToCSSRGBA:function (r, g, b, a) {
        return 'rgba(' + (r&0xff) + ',' + (g&0xff) + ',' + (b&0xff) + ',' + (a&0xff)/255 + ')';
      },translateRGBAToColor:function (r, g, b, a) {
        return r | g << 8 | b << 16 | a << 24;
      },makeSurface:function (width, height, flags, usePageCanvas, source, rmask, gmask, bmask, amask) {
        flags = flags || 0;
        var surf = _malloc(60);  // SDL_Surface has 15 fields of quantum size
        var buffer = _malloc(width*height*4); // TODO: only allocate when locked the first time
        var pixelFormat = _malloc(44);
        flags |= 1; // SDL_HWSURFACE - this tells SDL_MUSTLOCK that this needs to be locked
  
        //surface with SDL_HWPALETTE flag is 8bpp surface (1 byte)
        var is_SDL_HWPALETTE = flags & 0x00200000;
        var bpp = is_SDL_HWPALETTE ? 1 : 4;
  
        HEAP32[((surf)>>2)]=flags;        // SDL_Surface.flags
        HEAP32[(((surf)+(4))>>2)]=pixelFormat;// SDL_Surface.format TODO
        HEAP32[(((surf)+(8))>>2)]=width;        // SDL_Surface.w
        HEAP32[(((surf)+(12))>>2)]=height;       // SDL_Surface.h
        HEAP32[(((surf)+(16))>>2)]=width * bpp;      // SDL_Surface.pitch, assuming RGBA or indexed for now,
                                                                                 // since that is what ImageData gives us in browsers
        HEAP32[(((surf)+(20))>>2)]=buffer;     // SDL_Surface.pixels
        HEAP32[(((surf)+(36))>>2)]=0;     // SDL_Surface.offset
  
        HEAP32[(((surf)+(56))>>2)]=1;
  
        HEAP32[((pixelFormat)>>2)]=0 /* XXX missing C define SDL_PIXELFORMAT_RGBA8888 */;// SDL_PIXELFORMAT_RGBA8888
        HEAP32[(((pixelFormat)+(4))>>2)]=0;// TODO
        HEAP8[(((pixelFormat)+(8))|0)]=bpp * 8;
        HEAP8[(((pixelFormat)+(9))|0)]=bpp;
  
        HEAP32[(((pixelFormat)+(12))>>2)]=rmask || 0x000000ff;
        HEAP32[(((pixelFormat)+(16))>>2)]=gmask || 0x0000ff00;
        HEAP32[(((pixelFormat)+(20))>>2)]=bmask || 0x00ff0000;
        HEAP32[(((pixelFormat)+(24))>>2)]=amask || 0xff000000;
  
        // Decide if we want to use WebGL or not
        var useWebGL = (flags & 0x04000000) != 0; // SDL_OPENGL
        SDL.GL = SDL.GL || useWebGL;
        var canvas;
        if (!usePageCanvas) {
          if (SDL.canvasPool.length > 0) {
            canvas = SDL.canvasPool.pop();
          } else {
            canvas = document.createElement('canvas');
          }
          canvas.width = width;
          canvas.height = height;
        } else {
          canvas = Module['canvas'];
        }
  
        var webGLContextAttributes = {
          antialias: ((SDL.glAttributes[13 /*SDL_GL_MULTISAMPLEBUFFERS*/] != 0) && (SDL.glAttributes[14 /*SDL_GL_MULTISAMPLESAMPLES*/] > 1)),
          depth: (SDL.glAttributes[6 /*SDL_GL_DEPTH_SIZE*/] > 0),
          stencil: (SDL.glAttributes[7 /*SDL_GL_STENCIL_SIZE*/] > 0)
        };
  
        var ctx = Browser.createContext(canvas, useWebGL, usePageCanvas, webGLContextAttributes);
  
        SDL.surfaces[surf] = {
          width: width,
          height: height,
          canvas: canvas,
          ctx: ctx,
          surf: surf,
          buffer: buffer,
          pixelFormat: pixelFormat,
          alpha: 255,
          flags: flags,
          locked: 0,
          usePageCanvas: usePageCanvas,
          source: source,
  
          isFlagSet: function(flag) {
            return flags & flag;
          }
        };
  
        return surf;
      },copyIndexedColorData:function (surfData, rX, rY, rW, rH) {
        // HWPALETTE works with palette
        // setted by SDL_SetColors
        if (!surfData.colors) {
          return;
        }
  
        var fullWidth  = Module['canvas'].width;
        var fullHeight = Module['canvas'].height;
  
        var startX  = rX || 0;
        var startY  = rY || 0;
        var endX    = (rW || (fullWidth - startX)) + startX;
        var endY    = (rH || (fullHeight - startY)) + startY;
  
        var buffer  = surfData.buffer;
        var data    = surfData.image.data;
        var colors  = surfData.colors;
  
        for (var y = startY; y < endY; ++y) {
          var indexBase = y * fullWidth;
          var colorBase = indexBase * 4;
          for (var x = startX; x < endX; ++x) {
            // HWPALETTE have only 256 colors (not rgba)
            var index = HEAPU8[((buffer + indexBase + x)|0)] * 3;
            var colorOffset = colorBase + x * 4;
  
            data[colorOffset   ] = colors[index   ];
            data[colorOffset +1] = colors[index +1];
            data[colorOffset +2] = colors[index +2];
            //unused: data[colorOffset +3] = color[index +3];
          }
        }
      },freeSurface:function (surf) {
        var refcountPointer = surf + 56;
        var refcount = HEAP32[((refcountPointer)>>2)];
        if (refcount > 1) {
          HEAP32[((refcountPointer)>>2)]=refcount - 1;
          return;
        }
  
        var info = SDL.surfaces[surf];
        if (!info.usePageCanvas && info.canvas) SDL.canvasPool.push(info.canvas);
        _free(info.buffer);
        _free(info.pixelFormat);
        _free(surf);
        SDL.surfaces[surf] = null;
      },touchX:0,touchY:0,savedKeydown:null,receiveEvent:function (event) {
        switch(event.type) {
          case 'touchstart':
            event.preventDefault();
            var touch = event.touches[0];
            touchX = touch.pageX;
            touchY = touch.pageY;
            var event = {
              type: 'mousedown',
              button: 0,
              pageX: touchX,
              pageY: touchY
            };
            SDL.DOMButtons[0] = 1;
            SDL.events.push(event);
            break;
          case 'touchmove':
            event.preventDefault();
            var touch = event.touches[0];
            touchX = touch.pageX;
            touchY = touch.pageY;
            event = {
              type: 'mousemove',
              button: 0,
              pageX: touchX,
              pageY: touchY
            };
            SDL.events.push(event);
            break;
          case 'touchend':
            event.preventDefault();
            event = {
              type: 'mouseup',
              button: 0,
              pageX: touchX,
              pageY: touchY
            };
            SDL.DOMButtons[0] = 0;
            SDL.events.push(event);
            break;
          case 'mousemove':
            if (Browser.pointerLock) {
              // workaround for firefox bug 750111
              if ('mozMovementX' in event) {
                event['movementX'] = event['mozMovementX'];
                event['movementY'] = event['mozMovementY'];
              }
              // workaround for Firefox bug 782777
              if (event['movementX'] == 0 && event['movementY'] == 0) {
                // ignore a mousemove event if it doesn't contain any movement info
                // (without pointer lock, we infer movement from pageX/pageY, so this check is unnecessary)
                event.preventDefault();
                return;
              }
            }
            // fall through
          case 'keydown': case 'keyup': case 'keypress': case 'mousedown': case 'mouseup': case 'DOMMouseScroll': case 'mousewheel':
            // If we preventDefault on keydown events, the subsequent keypress events
            // won't fire. However, it's fine (and in some cases necessary) to
            // preventDefault for keys that don't generate a character. Otherwise,
            // preventDefault is the right thing to do in general.
            if (event.type !== 'keydown' || (event.keyCode === 8 /* backspace */ || event.keyCode === 9 /* tab */)) {
              event.preventDefault();
            }
  
            if (event.type == 'DOMMouseScroll' || event.type == 'mousewheel') {
              var button = (event.type == 'DOMMouseScroll' ? event.detail : -event.wheelDelta) > 0 ? 4 : 3;
              var event2 = {
                type: 'mousedown',
                button: button,
                pageX: event.pageX,
                pageY: event.pageY
              };
              SDL.events.push(event2);
              event = {
                type: 'mouseup',
                button: button,
                pageX: event.pageX,
                pageY: event.pageY
              };
            } else if (event.type == 'mousedown') {
              SDL.DOMButtons[event.button] = 1;
            } else if (event.type == 'mouseup') {
              // ignore extra ups, can happen if we leave the canvas while pressing down, then return,
              // since we add a mouseup in that case
              if (!SDL.DOMButtons[event.button]) {
                return;
              }
  
              SDL.DOMButtons[event.button] = 0;
            }
  
            // We can only request fullscreen as the result of user input.
            // Due to this limitation, we toggle a boolean on keydown which
            // SDL_WM_ToggleFullScreen will check and subsequently set another
            // flag indicating for us to request fullscreen on the following
            // keyup. This isn't perfect, but it enables SDL_WM_ToggleFullScreen
            // to work as the result of a keypress (which is an extremely
            // common use case).
            if (event.type === 'keydown') {
              SDL.canRequestFullscreen = true;
            } else if (event.type === 'keyup') {
              if (SDL.isRequestingFullscreen) {
                Module['requestFullScreen'](true, true);
                SDL.isRequestingFullscreen = false;
              }
              SDL.canRequestFullscreen = false;
            }
  
            // SDL expects a unicode character to be passed to its keydown events.
            // Unfortunately, the browser APIs only provide a charCode property on
            // keypress events, so we must backfill in keydown events with their
            // subsequent keypress event's charCode.
            if (event.type === 'keypress' && SDL.savedKeydown) {
              // charCode is read-only
              SDL.savedKeydown.keypressCharCode = event.charCode;
              SDL.savedKeydown = null;
            } else if (event.type === 'keydown') {
              SDL.savedKeydown = event;
            }
  
            // Don't push keypress events unless SDL_StartTextInput has been called.
            if (event.type !== 'keypress' || SDL.textInput) {
              SDL.events.push(event);
            }
            break;
          case 'mouseout':
            // Un-press all pressed mouse buttons, because we might miss the release outside of the canvas
            for (var i = 0; i < 3; i++) {
              if (SDL.DOMButtons[i]) {
                SDL.events.push({
                  type: 'mouseup',
                  button: i,
                  pageX: event.pageX,
                  pageY: event.pageY
                });
                SDL.DOMButtons[i] = 0;
              }
            }
            event.preventDefault();
            break;
          case 'blur':
          case 'visibilitychange': {
            // Un-press all pressed keys: TODO
            for (var code in SDL.keyboardMap) {
              SDL.events.push({
                type: 'keyup',
                keyCode: SDL.keyboardMap[code]
              });
            }
            event.preventDefault();
            break;
          }
          case 'unload':
            if (Browser.mainLoop.runner) {
              SDL.events.push(event);
              // Force-run a main event loop, since otherwise this event will never be caught!
              Browser.mainLoop.runner();
            }
            return;
          case 'resize':
            SDL.events.push(event);
            // manually triggered resize event doesn't have a preventDefault member
            if (event.preventDefault) {
              event.preventDefault();
            }
            break;
        }
        if (SDL.events.length >= 10000) {
          Module.printErr('SDL event queue full, dropping events');
          SDL.events = SDL.events.slice(0, 10000);
        }
        return;
      },handleEvent:function (event) {
        if (event.handled) return;
        event.handled = true;
  
        switch (event.type) {
          case 'keydown': case 'keyup': {
            var down = event.type === 'keydown';
            var code = event.keyCode;
            if (code >= 65 && code <= 90) {
              code += 32; // make lowercase for SDL
            } else {
              code = SDL.keyCodes[event.keyCode] || event.keyCode;
            }
  
            HEAP8[(((SDL.keyboardState)+(code))|0)]=down;
            // TODO: lmeta, rmeta, numlock, capslock, KMOD_MODE, KMOD_RESERVED
            SDL.modState = (HEAP8[(((SDL.keyboardState)+(1248))|0)] ? 0x0040 | 0x0080 : 0) | // KMOD_LCTRL & KMOD_RCTRL
              (HEAP8[(((SDL.keyboardState)+(1249))|0)] ? 0x0001 | 0x0002 : 0) | // KMOD_LSHIFT & KMOD_RSHIFT
              (HEAP8[(((SDL.keyboardState)+(1250))|0)] ? 0x0100 | 0x0200 : 0); // KMOD_LALT & KMOD_RALT
  
            if (down) {
              SDL.keyboardMap[code] = event.keyCode; // save the DOM input, which we can use to unpress it during blur
            } else {
              delete SDL.keyboardMap[code];
            }
  
            break;
          }
          case 'mousedown': case 'mouseup':
            if (event.type == 'mousedown') {
              // SDL_BUTTON(x) is defined as (1 << ((x)-1)).  SDL buttons are 1-3,
              // and DOM buttons are 0-2, so this means that the below formula is
              // correct.
              SDL.buttonState |= 1 << event.button;
            } else if (event.type == 'mouseup') {
              SDL.buttonState &= ~(1 << event.button);
            }
            // fall through
          case 'mousemove': {
            Browser.calculateMouseEvent(event);
            break;
          }
        }
      },makeCEvent:function (event, ptr) {
        if (typeof event === 'number') {
          // This is a pointer to a native C event that was SDL_PushEvent'ed
          _memcpy(ptr, event, 28); // XXX
          return;
        }
  
        SDL.handleEvent(event);
  
        switch (event.type) {
          case 'keydown': case 'keyup': {
            var down = event.type === 'keydown';
            //Module.print('Received key event: ' + event.keyCode);
            var key = event.keyCode;
            if (key >= 65 && key <= 90) {
              key += 32; // make lowercase for SDL
            } else {
              key = SDL.keyCodes[event.keyCode] || event.keyCode;
            }
            var scan;
            if (key >= 1024) {
              scan = key - 1024;
            } else {
              scan = SDL.scanCodes[key] || key;
            }
  
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(8))|0)]=down ? 1 : 0;
            HEAP8[(((ptr)+(9))|0)]=0; // TODO
            HEAP32[(((ptr)+(12))>>2)]=scan;
            HEAP32[(((ptr)+(16))>>2)]=key;
            HEAP16[(((ptr)+(20))>>1)]=SDL.modState;
            // some non-character keys (e.g. backspace and tab) won't have keypressCharCode set, fill in with the keyCode.
            HEAP32[(((ptr)+(24))>>2)]=event.keypressCharCode || key;
  
            break;
          }
          case 'keypress': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            // Not filling in windowID for now
            var cStr = intArrayFromString(String.fromCharCode(event.charCode));
            for (var i = 0; i < cStr.length; ++i) {
              HEAP8[(((ptr)+(8 + i))|0)]=cStr[i];
            }
            break;
          }
          case 'mousedown': case 'mouseup': case 'mousemove': {
            if (event.type != 'mousemove') {
              var down = event.type === 'mousedown';
              HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
              HEAP8[(((ptr)+(8))|0)]=event.button+1; // DOM buttons are 0-2, SDL 1-3
              HEAP8[(((ptr)+(9))|0)]=down ? 1 : 0;
              HEAP32[(((ptr)+(12))>>2)]=Browser.mouseX;
              HEAP32[(((ptr)+(16))>>2)]=Browser.mouseY;
            } else {
              HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
              HEAP8[(((ptr)+(8))|0)]=SDL.buttonState;
              HEAP32[(((ptr)+(12))>>2)]=Browser.mouseX;
              HEAP32[(((ptr)+(16))>>2)]=Browser.mouseY;
              HEAP32[(((ptr)+(20))>>2)]=Browser.mouseMovementX;
              HEAP32[(((ptr)+(24))>>2)]=Browser.mouseMovementY;
            }
            break;
          }
          case 'unload': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            break;
          }
          case 'resize': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)]=event.w;
            HEAP32[(((ptr)+(8))>>2)]=event.h;
            break;
          }
          case 'joystick_button_up': case 'joystick_button_down': {
            var state = event.type === 'joystick_button_up' ? 0 : 1;
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(4))|0)]=event.index;
            HEAP8[(((ptr)+(5))|0)]=event.button;
            HEAP8[(((ptr)+(6))|0)]=state;
            break;
          }
          case 'joystick_axis_motion': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(4))|0)]=event.index;
            HEAP8[(((ptr)+(5))|0)]=event.axis;
            HEAP32[(((ptr)+(8))>>2)]=SDL.joystickAxisValueConversion(event.value);
            break;
          }
          default: throw 'Unhandled SDL event: ' + event.type;
        }
      },estimateTextWidth:function (fontData, text) {
        var h = fontData.size;
        var fontString = h + 'px "' + fontData.name + '"';
        var tempCtx = SDL.ttfContext;
        assert(tempCtx, 'TTF_Init must have been called');
        tempCtx.save();
        tempCtx.font = fontString;
        var ret = tempCtx.measureText(text).width | 0;
        tempCtx.restore();
        return ret;
      },allocateChannels:function (num) { // called from Mix_AllocateChannels and init
        if (SDL.numChannels && SDL.numChannels >= num && num != 0) return;
        SDL.numChannels = num;
        SDL.channels = [];
        for (var i = 0; i < num; i++) {
          SDL.channels[i] = {
            audio: null,
            volume: 1.0
          };
        }
      },setGetVolume:function (info, volume) {
        if (!info) return 0;
        var ret = info.volume * 128; // MIX_MAX_VOLUME
        if (volume != -1) {
          info.volume = volume / 128;
          if (info.audio) info.audio.volume = info.volume;
        }
        return ret;
      },debugSurface:function (surfData) {
        console.log('dumping surface ' + [surfData.surf, surfData.source, surfData.width, surfData.height]);
        var image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
        var data = image.data;
        var num = Math.min(surfData.width, surfData.height);
        for (var i = 0; i < num; i++) {
          console.log('   diagonal ' + i + ':' + [data[i*surfData.width*4 + i*4 + 0], data[i*surfData.width*4 + i*4 + 1], data[i*surfData.width*4 + i*4 + 2], data[i*surfData.width*4 + i*4 + 3]]);
        }
      },joystickEventState:1,lastJoystickState:{},joystickNamePool:{},recordJoystickState:function (joystick, state) {
        // Standardize button state.
        var buttons = new Array(state.buttons.length);
        for (var i = 0; i < state.buttons.length; i++) {
          buttons[i] = SDL.getJoystickButtonState(state.buttons[i]);
        }
  
        SDL.lastJoystickState[joystick] = {
          buttons: buttons,
          axes: state.axes.slice(0),
          timestamp: state.timestamp,
          index: state.index,
          id: state.id
        };
      },getJoystickButtonState:function (button) {
        if (typeof button === 'object') {
          // Current gamepad API editor's draft (Firefox Nightly)
          // https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html#idl-def-GamepadButton
          return button.pressed;
        } else {
          // Current gamepad API working draft (Firefox / Chrome Stable)
          // http://www.w3.org/TR/2012/WD-gamepad-20120529/#gamepad-interface
          return button > 0;
        }
      },queryJoysticks:function () {
        for (var joystick in SDL.lastJoystickState) {
          var state = SDL.getGamepad(joystick - 1);
          var prevState = SDL.lastJoystickState[joystick];
          // Check only if the timestamp has differed.
          // NOTE: Timestamp is not available in Firefox.
          if (typeof state.timestamp !== 'number' || state.timestamp !== prevState.timestamp) {
            var i;
            for (i = 0; i < state.buttons.length; i++) {
              var buttonState = SDL.getJoystickButtonState(state.buttons[i]);
              // NOTE: The previous state already has a boolean representation of
              //       its button, so no need to standardize its button state here.
              if (buttonState !== prevState.buttons[i]) {
                // Insert button-press event.
                SDL.events.push({
                  type: buttonState ? 'joystick_button_down' : 'joystick_button_up',
                  joystick: joystick,
                  index: joystick - 1,
                  button: i
                });
              }
            }
            for (i = 0; i < state.axes.length; i++) {
              if (state.axes[i] !== prevState.axes[i]) {
                // Insert axes-change event.
                SDL.events.push({
                  type: 'joystick_axis_motion',
                  joystick: joystick,
                  index: joystick - 1,
                  axis: i,
                  value: state.axes[i]
                });
              }
            }
  
            SDL.recordJoystickState(joystick, state);
          }
        }
      },joystickAxisValueConversion:function (value) {
        // Ensures that 0 is 0, 1 is 32767, and -1 is 32768.
        return Math.ceil(((value+1) * 32767.5) - 32768);
      },getGamepads:function () {
        var fcn = navigator.getGamepads || navigator.webkitGamepads || navigator.mozGamepads || navigator.gamepads || navigator.webkitGetGamepads;
        if (fcn !== undefined) {
          // The function must be applied on the navigator object.
          return fcn.apply(navigator);
        } else {
          return [];
        }
      },getGamepad:function (deviceIndex) {
        var gamepads = SDL.getGamepads();
        if (gamepads.length > deviceIndex && deviceIndex >= 0) {
          return gamepads[deviceIndex];
        }
        return null;
      }};function _SDL_PollEvent(ptr) {
      if (SDL.initFlags & 0x200 && SDL.joystickEventState) {
        // If SDL_INIT_JOYSTICK was supplied AND the joystick system is configured
        // to automatically query for events, query for joystick events.
        SDL.queryJoysticks();
      }
      if (SDL.events.length === 0) return 0;
      if (ptr) {
        SDL.makeCEvent(SDL.events.shift(), ptr);
      }
      return 1;
    }

  function _SDL_Flip(surf) {
      // We actually do this in Unlock, since the screen surface has as its canvas
      // backing the page canvas element
    }

  
  
  
  
  
  
  var _mkport=undefined;var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 0777, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
  
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
  
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
  
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
  
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
  
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
  
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
  
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {headers: {'websocket-protocol': ['binary']}} : ['binary'];
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
  
  
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
  
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
  
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
  
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
  
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
  
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
  
  
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
  
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
  
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
  
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
  
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
  
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
  
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
  
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
  
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
  
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
  
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
  
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
  
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
  
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
  
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
  
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
  
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
  
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
  
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
  
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
  
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
  
  
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
  
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  
  
  function _strlen(ptr) {
      ptr = ptr|0;
      var curr = 0;
      curr = ptr;
      while (HEAP8[(curr)]) {
        curr = (curr + 1)|0;
      }
      return (curr - ptr)|0;
    }
  
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
  
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
  
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
  
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          }
          if (precision === -1) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
  
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
  
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
  
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
  
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
  
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
  
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
  
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
  
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
  
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
  
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
  
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
  
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }function _printf(format, varargs) {
      // int printf(const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var stdout = HEAP32[((_stdout)>>2)];
      return _fprintf(stdout, format, varargs);
    }

  function _emscripten_cancel_main_loop() {
      Browser.mainLoop.scheduler = null;
      Browser.mainLoop.shouldPause = true;
    }

  function _SDL_Init(initFlags) {
      SDL.startTime = Date.now();
      SDL.initFlags = initFlags;
  
      // capture all key events. we just keep down and up, but also capture press to prevent default actions
      if (!Module['doNotCaptureKeyboard']) {
        document.addEventListener("keydown", SDL.receiveEvent);
        document.addEventListener("keyup", SDL.receiveEvent);
        document.addEventListener("keypress", SDL.receiveEvent);
        window.addEventListener("blur", SDL.receiveEvent);
        document.addEventListener("visibilitychange", SDL.receiveEvent);
      }
  
      if (initFlags & 0x200) {
        // SDL_INIT_JOYSTICK
        // Firefox will not give us Joystick data unless we register this NOP
        // callback.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=936104
        addEventListener("gamepadconnected", function() {});
      }
  
      window.addEventListener("unload", SDL.receiveEvent);
      SDL.keyboardState = _malloc(0x10000); // Our SDL needs 512, but 64K is safe for older SDLs
      _memset(SDL.keyboardState, 0, 0x10000);
      // Initialize this structure carefully for closure
      SDL.DOMEventToSDLEvent['keydown'] = 0x300 /* SDL_KEYDOWN */;
      SDL.DOMEventToSDLEvent['keyup'] = 0x301 /* SDL_KEYUP */;
      SDL.DOMEventToSDLEvent['keypress'] = 0x303 /* SDL_TEXTINPUT */;
      SDL.DOMEventToSDLEvent['mousedown'] = 0x401 /* SDL_MOUSEBUTTONDOWN */;
      SDL.DOMEventToSDLEvent['mouseup'] = 0x402 /* SDL_MOUSEBUTTONUP */;
      SDL.DOMEventToSDLEvent['mousemove'] = 0x400 /* SDL_MOUSEMOTION */;
      SDL.DOMEventToSDLEvent['unload'] = 0x100 /* SDL_QUIT */;
      SDL.DOMEventToSDLEvent['resize'] = 0x7001 /* SDL_VIDEORESIZE/SDL_EVENT_COMPAT2 */;
      // These are not technically DOM events; the HTML gamepad API is poll-based.
      // However, we define them here, as the rest of the SDL code assumes that
      // all SDL events originate as DOM events.
      SDL.DOMEventToSDLEvent['joystick_axis_motion'] = 0x600 /* SDL_JOYAXISMOTION */;
      SDL.DOMEventToSDLEvent['joystick_button_down'] = 0x603 /* SDL_JOYBUTTONDOWN */;
      SDL.DOMEventToSDLEvent['joystick_button_up'] = 0x604 /* SDL_JOYBUTTONUP */;
      return 0; // success
    }

  
  
  function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      return _write(stream, s, _strlen(s));
    }
  
  function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr;
      var ret = _write(stream, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _puts(s) {
      // int puts(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/puts.html
      // NOTE: puts() always writes an extra newline.
      var stdout = HEAP32[((_stdout)>>2)];
      var ret = _fputs(s, stdout);
      if (ret < 0) {
        return ret;
      } else {
        var newlineRet = _fputc(10, stdout);
        return (newlineRet < 0) ? -1 : ret + 1;
      }
    }
  
  
  function _strerror_r(errnum, strerrbuf, buflen) {
      if (errnum in ERRNO_MESSAGES) {
        if (ERRNO_MESSAGES[errnum].length > buflen - 1) {
          return ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          var msg = ERRNO_MESSAGES[errnum];
          writeAsciiToMemory(msg, strerrbuf);
          return 0;
        }
      } else {
        return ___setErrNo(ERRNO_CODES.EINVAL);
      }
    }function _strerror(errnum) {
      if (!_strerror.buffer) _strerror.buffer = _malloc(256);
      _strerror_r(errnum, _strerror.buffer, 256);
      return _strerror.buffer;
    }
  
  function ___errno_location() {
      return ___errno_state;
    }function _perror(s) {
      // void perror(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/perror.html
      var stdout = HEAP32[((_stdout)>>2)];
      if (s) {
        _fputs(s, stdout);
        _fputc(58, stdout);
        _fputc(32, stdout);
      }
      var errnum = HEAP32[((___errno_location())>>2)];
      _puts(_strerror(errnum));
    }

  function _SDL_GetError() {
      if (!SDL.errorMessage) {
        SDL.errorMessage = allocate(intArrayFromString("unknown SDL-emscripten error"), 'i8', ALLOC_NORMAL);
      }
      return SDL.errorMessage;
    }

  
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }

  function _atexit(func, arg) {
      __ATEXIT__.unshift({ func: func, arg: arg });
    }

  function _SDL_Quit() {
      for (var i = 0; i < SDL.numChannels; ++i) {
        if (SDL.channels[i].audio) {
          SDL.channels[i].audio.pause();
        }
      }
      if (SDL.music.audio) {
        SDL.music.audio.pause();
      }
      Module.print('SDL_Quit called (and ignored)');
    }

  function _TTF_Init() {
      var canvas = document.createElement('canvas');
      SDL.ttfContext = canvas.getContext('2d');
      return 0;
    }

  function _SDL_SetVideoMode(width, height, depth, flags) {
      ['mousedown', 'mouseup', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mouseout'].forEach(function(event) {
        Module['canvas'].addEventListener(event, SDL.receiveEvent, true);
      });
  
      // (0,0) means 'use fullscreen' in native; in Emscripten, use the current canvas size.
      if (width == 0 && height == 0) {
        var canvas = Module['canvas'];
        width = canvas.width;
        height = canvas.height;
      }
  
      Browser.setCanvasSize(width, height, true);
      // Free the old surface first.
      if (SDL.screen) {
        SDL.freeSurface(SDL.screen);
        SDL.screen = null;
      }
      SDL.screen = SDL.makeSurface(width, height, flags, true, 'screen');
      if (!SDL.addedResizeListener) {
        SDL.addedResizeListener = true;
        Browser.resizeListeners.push(function(w, h) {
          SDL.receiveEvent({
            type: 'resize',
            w: w,
            h: h
          });
        });
      }
      return SDL.screen;
    }

  function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop) {
      Module['noExitRuntime'] = true;
  
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
          Browser.mainLoop.updateStatus();
          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }
        if (Browser.mainLoop.shouldPause) {
          // catch pauses from non-main loop sources
          Browser.mainLoop.paused = true;
          Browser.mainLoop.shouldPause = false;
          return;
        }
  
        // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
        // VBO double-buffering and reduce GPU stalls.
  
        if (Module['preMainLoop']) {
          Module['preMainLoop']();
        }
  
        try {
          Runtime.dynCall('v', func);
        } catch (e) {
          if (e instanceof ExitStatus) {
            return;
          } else {
            if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
            throw e;
          }
        }
  
        if (Module['postMainLoop']) {
          Module['postMainLoop']();
        }
  
        if (Browser.mainLoop.shouldPause) {
          // catch pauses from the main loop itself
          Browser.mainLoop.paused = true;
          Browser.mainLoop.shouldPause = false;
          return;
        }
        Browser.mainLoop.scheduler();
      }
      if (fps && fps > 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          setTimeout(Browser.mainLoop.runner, 1000/fps); // doing this each time means that on exception, we stop
        }
      } else {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        }
      }
      Browser.mainLoop.scheduler();
  
      if (simulateInfiniteLoop) {
        throw 'SimulateInfiniteLoop';
      }
    }

  
  function _memcpy(dest, src, num) {
      dest = dest|0; src = src|0; num = num|0;
      var ret = 0;
      ret = dest|0;
      if ((dest&3) == (src&3)) {
        while (dest & 3) {
          if ((num|0) == 0) return ret|0;
          HEAP8[(dest)]=HEAP8[(src)];
          dest = (dest+1)|0;
          src = (src+1)|0;
          num = (num-1)|0;
        }
        while ((num|0) >= 4) {
          HEAP32[((dest)>>2)]=HEAP32[((src)>>2)];
          dest = (dest+4)|0;
          src = (src+4)|0;
          num = (num-4)|0;
        }
      }
      while ((num|0) > 0) {
        HEAP8[(dest)]=HEAP8[(src)];
        dest = (dest+1)|0;
        src = (src+1)|0;
        num = (num-1)|0;
      }
      return ret|0;
    }var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;

  function _SDL_FreeSurface(surf) {
      if (surf) SDL.freeSurface(surf);
    }


  function _isalnum(chr) {
      return (chr >= 48 && chr <= 57) ||
             (chr >= 97 && chr <= 122) ||
             (chr >= 65 && chr <= 90);
    }

  function _toupper(chr) {
      if (chr >= 97 && chr <= 122) {
        return chr - 97 + 65;
      } else {
        return chr;
      }
    }

  function ___assert_fail(condition, filename, line, func) {
      ABORT = true;
      throw 'Assertion failed: ' + Pointer_stringify(condition) + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + stackTrace();
    }

  function _strcpy(pdest, psrc) {
      pdest = pdest|0; psrc = psrc|0;
      var i = 0;
      do {
        HEAP8[(((pdest+i)|0)|0)]=HEAP8[(((psrc+i)|0)|0)];
        i = (i+1)|0;
      } while (HEAP8[(((psrc)+(i-1))|0)]);
      return pdest|0;
    }

  
  
  
  function _isspace(chr) {
      return (chr == 32) || (chr >= 9 && chr <= 13);
    }function __parseInt(str, endptr, base, min, max, bits, unsign) {
      // Skip space.
      while (_isspace(HEAP8[(str)])) str++;
  
      // Check for a plus/minus sign.
      var multiplier = 1;
      if (HEAP8[(str)] == 45) {
        multiplier = -1;
        str++;
      } else if (HEAP8[(str)] == 43) {
        str++;
      }
  
      // Find base.
      var finalBase = base;
      if (!finalBase) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            finalBase = 16;
            str += 2;
          } else {
            finalBase = 8;
            str++;
          }
        }
      } else if (finalBase==16) {
        if (HEAP8[(str)] == 48) {
          if (HEAP8[((str+1)|0)] == 120 ||
              HEAP8[((str+1)|0)] == 88) {
            str += 2;
          }
        }
      }
      if (!finalBase) finalBase = 10;
  
      // Get digits.
      var chr;
      var ret = 0;
      while ((chr = HEAP8[(str)]) != 0) {
        var digit = parseInt(String.fromCharCode(chr), finalBase);
        if (isNaN(digit)) {
          break;
        } else {
          ret = ret * finalBase + digit;
          str++;
        }
      }
  
      // Apply sign.
      ret *= multiplier;
  
      // Set end pointer.
      if (endptr) {
        HEAP32[((endptr)>>2)]=str;
      }
  
      // Unsign if needed.
      if (unsign) {
        if (Math.abs(ret) > max) {
          ret = max;
          ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          ret = unSign(ret, bits);
        }
      }
  
      // Validate range.
      if (ret > max || ret < min) {
        ret = ret > max ? max : min;
        ___setErrNo(ERRNO_CODES.ERANGE);
      }
  
      if (bits == 64) {
        return tempRet0 = (tempDouble=ret,Math_abs(tempDouble) >= 1 ? (tempDouble > 0 ? Math_min(Math_floor((tempDouble)/4294967296), 4294967295)>>>0 : (~~(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296)))>>>0) : 0),ret>>>0;
      }
  
      return ret;
    }function _strtol(str, endptr, base) {
      return __parseInt(str, endptr, base, -2147483648, 2147483647, 32);  // LONG_MIN, LONG_MAX.
    }function _atoi(ptr) {
      return _strtol(ptr, null, 10);
    }

  function _rand() {
      return Math.floor(Math.random()*0x80000000);
    }

  function _SDL_MapRGB(fmt, r, g, b) {
      // Canvas screens are always RGBA. We assume the machine is little-endian.
      return r&0xff|(g&0xff)<<8|(b&0xff)<<16|0xff000000;
    }

  function _SDL_FillRect(surf, rect, color) {
      var surfData = SDL.surfaces[surf];
      assert(!surfData.locked); // but we could unlock and re-lock if we must..
  
      if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
        //in SDL_HWPALETTE color is index (0..255)
        //so we should translate 1 byte value to
        //32 bit canvas
        var index = color * 3;
        color = SDL.translateRGBAToColor(surfData.colors[index], surfData.colors[index +1], surfData.colors[index +2], 255);
      }
  
      var r = rect ? SDL.loadRect(rect) : { x: 0, y: 0, w: surfData.width, h: surfData.height };
      surfData.ctx.save();
      surfData.ctx.fillStyle = SDL.translateColorToCSSRGBA(color);
      surfData.ctx.fillRect(r.x, r.y, r.w, r.h);
      surfData.ctx.restore();
      return 0;
    }

  
  function _TTF_RenderText_Solid(font, text, color) {
      // XXX the font and color are ignored
      text = Pointer_stringify(text) || ' '; // if given an empty string, still return a valid surface
      var fontData = SDL.fonts[font];
      var w = SDL.estimateTextWidth(fontData, text);
      var h = fontData.size;
      var color = SDL.loadColorToCSSRGB(color); // XXX alpha breaks fonts?
      var fontString = h + 'px "' + fontData.name + '"';
      var surf = SDL.makeSurface(w, h, 0, false, 'text:' + text); // bogus numbers..
      var surfData = SDL.surfaces[surf];
      surfData.ctx.save();
      surfData.ctx.fillStyle = color;
      surfData.ctx.font = fontString;
      surfData.ctx.textBaseline = 'top';
      surfData.ctx.fillText(text, 0, 0);
      surfData.ctx.restore();
      return surf;
    }var _TTF_RenderText_Blended=_TTF_RenderText_Solid;

  
  function _SDL_LockSurface(surf) {
      var surfData = SDL.surfaces[surf];
  
      surfData.locked++;
      if (surfData.locked > 1) return 0;
  
      // Mark in C/C++-accessible SDL structure
      // SDL_Surface has the following fields: Uint32 flags, SDL_PixelFormat *format; int w, h; Uint16 pitch; void *pixels; ...
      // So we have fields all of the same size, and 5 of them before us.
      // TODO: Use macros like in library.js
      HEAP32[(((surf)+(20))>>2)]=surfData.buffer;
  
      if (surf == SDL.screen && Module.screenIsReadOnly && surfData.image) return 0;
  
      surfData.image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
      if (surf == SDL.screen) {
        var data = surfData.image.data;
        var num = data.length;
        for (var i = 0; i < num/4; i++) {
          data[i*4+3] = 255; // opacity, as canvases blend alpha
        }
      }
  
      if (SDL.defaults.copyOnLock) {
        // Copy pixel data to somewhere accessible to 'C/C++'
        if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
          // If this is neaded then
          // we should compact the data from 32bpp to 8bpp index.
          // I think best way to implement this is use
          // additional colorMap hash (color->index).
          // Something like this:
          //
          // var size = surfData.width * surfData.height;
          // var data = '';
          // for (var i = 0; i<size; i++) {
          //   var color = SDL.translateRGBAToColor(
          //     surfData.image.data[i*4   ],
          //     surfData.image.data[i*4 +1],
          //     surfData.image.data[i*4 +2],
          //     255);
          //   var index = surfData.colorMap[color];
          //   HEAP8[(((surfData.buffer)+(i))|0)]=index;
          // }
          throw 'CopyOnLock is not supported for SDL_LockSurface with SDL_HWPALETTE flag set' + new Error().stack;
        } else {
        HEAPU8.set(surfData.image.data, surfData.buffer);
        }
      }
  
      return 0;
    }function _SDL_UpperBlit(src, srcrect, dst, dstrect) {
      var srcData = SDL.surfaces[src];
      var dstData = SDL.surfaces[dst];
      var sr, dr;
      if (srcrect) {
        sr = SDL.loadRect(srcrect);
      } else {
        sr = { x: 0, y: 0, w: srcData.width, h: srcData.height };
      }
      if (dstrect) {
        dr = SDL.loadRect(dstrect);
      } else {
        dr = { x: 0, y: 0, w: -1, h: -1 };
      }
      var oldAlpha = dstData.ctx.globalAlpha;
      dstData.ctx.globalAlpha = srcData.alpha/255;
      dstData.ctx.drawImage(srcData.canvas, sr.x, sr.y, sr.w, sr.h, dr.x, dr.y, sr.w, sr.h);
      dstData.ctx.globalAlpha = oldAlpha;
      if (dst != SDL.screen) {
        // XXX As in IMG_Load, for compatibility we write out |pixels|
        console.log('WARNING: copying canvas data to memory for compatibility');
        _SDL_LockSurface(dst);
        dstData.locked--; // The surface is not actually locked in this hack
      }
      return 0;
    }

  function _TTF_OpenFont(filename, size) {
      filename = FS.standardizePath(Pointer_stringify(filename));
      var id = SDL.fonts.length;
      SDL.fonts.push({
        name: filename, // but we don't actually do anything with it..
        size: size
      });
      return id;
    }

  function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, Math.max(n - 1, 0));
      if (s < 0) {
        s = -s;
        var buf = _malloc(limit+1);
        HEAP32[((s)>>2)]=buf;
        s = buf;
      }
      for (var i = 0; i < limit; i++) {
        HEAP8[(((s)+(i))|0)]=result[i];
      }
      if (limit < n || (n === undefined)) HEAP8[(((s)+(i))|0)]=0;
      return result.length;
    }

  
  function _memset(ptr, value, num) {
      ptr = ptr|0; value = value|0; num = num|0;
      var stop = 0, value4 = 0, stop4 = 0, unaligned = 0;
      stop = (ptr + num)|0;
      if ((num|0) >= 20) {
        // This is unaligned, but quite large, so work hard to get to aligned settings
        value = value & 0xff;
        unaligned = ptr & 3;
        value4 = value | (value << 8) | (value << 16) | (value << 24);
        stop4 = stop & ~3;
        if (unaligned) {
          unaligned = (ptr + 4 - unaligned)|0;
          while ((ptr|0) < (unaligned|0)) { // no need to check for stop, since we have large num
            HEAP8[(ptr)]=value;
            ptr = (ptr+1)|0;
          }
        }
        while ((ptr|0) < (stop4|0)) {
          HEAP32[((ptr)>>2)]=value4;
          ptr = (ptr+4)|0;
        }
      }
      while ((ptr|0) < (stop|0)) {
        HEAP8[(ptr)]=value;
        ptr = (ptr+1)|0;
      }
      return (ptr-num)|0;
    }var _llvm_memset_p0i8_i32=_memset;

  function _memcmp(p1, p2, num) {
      p1 = p1|0; p2 = p2|0; num = num|0;
      var i = 0, v1 = 0, v2 = 0;
      while ((i|0) < (num|0)) {
        v1 = HEAPU8[(((p1)+(i))|0)];
        v2 = HEAPU8[(((p2)+(i))|0)];
        if ((v1|0) != (v2|0)) return ((v1|0) > (v2|0) ? 1 : -1)|0;
        i = (i+1)|0;
      }
      return 0;
    }

  
  var DLFCN={functionTable:[],registerFunctions:function (asm, num, sigs, jsModule) {
        // use asm module dynCall_* from functionTable
        if (num % 2 == 1) num++; // keep pointers even
        var table = DLFCN.functionTable;
        var from = table.length;
        assert(from % 2 == 0);
        for (var i = 0; i < num; i++) {
          table[from + i] = {};
          sigs.forEach(function(sig) { // TODO: new Function etc.
            var full = 'dynCall_' + sig;
            table[from + i][sig] = function dynCall_sig() {
              arguments[0] -= from;
              return asm[full].apply(null, arguments);
            }
          });
        }
  
        if (jsModule.cleanups) {
          var newLength = table.length;
          jsModule.cleanups.push(function() {
            if (table.length === newLength) {
              table.length = from; // nothing added since, just shrink
            } else {
              // something was added above us, clear and leak the span
              for (var i = 0; i < num; i++) {
                table[from + i] = null;
              }
            }
            while (table.length > 0 && table[table.length-1] === null) table.pop();
          });
        }
  
        // patch js module dynCall_* to use functionTable
        sigs.forEach(function(sig) {
          jsModule['dynCall_' + sig] = function dynCall_sig() {
            return table[arguments[0]][sig].apply(null, arguments);
          };
        });
      },error:null,errorMsg:null,loadedLibs:{},loadedLibNames:{}};
  
  
  
  
  var _environ=allocate(1, "i32*", ALLOC_STATIC);var ___environ=_environ;function ___buildEnvironment(env) {
      // WARNING: Arbitrary limit!
      var MAX_ENV_VALUES = 64;
      var TOTAL_ENV_SIZE = 1024;
  
      // Statically allocate memory for the environment.
      var poolPtr;
      var envPtr;
      if (!___buildEnvironment.called) {
        ___buildEnvironment.called = true;
        // Set default values. Use string keys for Closure Compiler compatibility.
        ENV['USER'] = 'root';
        ENV['PATH'] = '/';
        ENV['PWD'] = '/';
        ENV['HOME'] = '/home/emscripten';
        ENV['LANG'] = 'en_US.UTF-8';
        ENV['_'] = './this.program';
        // Allocate memory.
        poolPtr = allocate(TOTAL_ENV_SIZE, 'i8', ALLOC_STATIC);
        envPtr = allocate(MAX_ENV_VALUES * 4,
                          'i8*', ALLOC_STATIC);
        HEAP32[((envPtr)>>2)]=poolPtr;
        HEAP32[((_environ)>>2)]=envPtr;
      } else {
        envPtr = HEAP32[((_environ)>>2)];
        poolPtr = HEAP32[((envPtr)>>2)];
      }
  
      // Collect key=value lines.
      var strings = [];
      var totalSize = 0;
      for (var key in env) {
        if (typeof env[key] === 'string') {
          var line = key + '=' + env[key];
          strings.push(line);
          totalSize += line.length;
        }
      }
      if (totalSize > TOTAL_ENV_SIZE) {
        throw new Error('Environment size exceeded TOTAL_ENV_SIZE!');
      }
  
      // Make new.
      var ptrSize = 4;
      for (var i = 0; i < strings.length; i++) {
        var line = strings[i];
        writeAsciiToMemory(line, poolPtr);
        HEAP32[(((envPtr)+(i * ptrSize))>>2)]=poolPtr;
        poolPtr += line.length + 1;
      }
      HEAP32[(((envPtr)+(strings.length * ptrSize))>>2)]=0;
    }var ENV={};function _dlopen(filename, flag) {
      // void *dlopen(const char *file, int mode);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/dlopen.html
      filename = filename === 0 ? '__self__' : (ENV['LD_LIBRARY_PATH'] || '/') + Pointer_stringify(filename);
  
  
      if (DLFCN.loadedLibNames[filename]) {
        // Already loaded; increment ref count and return.
        var handle = DLFCN.loadedLibNames[filename];
        DLFCN.loadedLibs[handle].refcount++;
        return handle;
      }
  
      if (filename === '__self__') {
        var handle = -1;
        var lib_module = Module;
        var cached_functions = SYMBOL_TABLE;
      } else {
        var target = FS.findObject(filename);
        if (!target || target.isFolder || target.isDevice) {
          DLFCN.errorMsg = 'Could not find dynamic lib: ' + filename;
          return 0;
        } else {
          FS.forceLoadFile(target);
          var lib_data = intArrayToString(target.contents);
        }
  
        try {
          var lib_module = eval(lib_data)(
            FUNCTION_TABLE.length,
            Module
          );
        } catch (e) {
          Module.printErr('Error in loading dynamic library: ' + e);
          DLFCN.errorMsg = 'Could not evaluate dynamic lib: ' + filename;
          return 0;
        }
  
        // Not all browsers support Object.keys().
        var handle = 1;
        for (var key in DLFCN.loadedLibs) {
          if (DLFCN.loadedLibs.hasOwnProperty(key)) handle++;
        }
  
        // We don't care about RTLD_NOW and RTLD_LAZY.
        if (flag & 256) { // RTLD_GLOBAL
          for (var ident in lib_module) {
            if (lib_module.hasOwnProperty(ident)) {
              Module[ident] = lib_module[ident];
            }
          }
        }
  
        var cached_functions = {};
      }
      DLFCN.loadedLibs[handle] = {
        refcount: 1,
        name: filename,
        module: lib_module,
        cached_functions: cached_functions
      };
      DLFCN.loadedLibNames[filename] = handle;
  
      return handle;
    }

  function _dlclose(handle) {
      // int dlclose(void *handle);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/dlclose.html
      if (!DLFCN.loadedLibs[handle]) {
        DLFCN.errorMsg = 'Tried to dlclose() unopened handle: ' + handle;
        return 1;
      } else {
        var lib_record = DLFCN.loadedLibs[handle];
        if (--lib_record.refcount == 0) {
          if (lib_record.module.cleanups) {
            lib_record.module.cleanups.forEach(function(cleanup) { cleanup() });
          }
          delete DLFCN.loadedLibNames[lib_record.name];
          delete DLFCN.loadedLibs[handle];
        }
        return 0;
      }
    }

  function _dlsym(handle, symbol) {
      // void *dlsym(void *restrict handle, const char *restrict name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/dlsym.html
      symbol = '_' + Pointer_stringify(symbol);
  
      if (!DLFCN.loadedLibs[handle]) {
        DLFCN.errorMsg = 'Tried to dlsym() from an unopened handle: ' + handle;
        return 0;
      } else {
        var lib = DLFCN.loadedLibs[handle];
        // self-dlopen means that lib.module is not a superset of
        // cached_functions, so check the latter first
        if (lib.cached_functions.hasOwnProperty(symbol)) {
          return lib.cached_functions[symbol];
        } else {
          if (!lib.module.hasOwnProperty(symbol)) {
            DLFCN.errorMsg = ('Tried to lookup unknown symbol "' + symbol +
                                   '" in dynamic lib: ' + lib.name);
            return 0;
          } else {
            var result = lib.module[symbol];
            if (typeof result == 'function') {
              result = Runtime.addFunction(result);
              lib.cached_functions = result;
            }
            return result;
          }
        }
      }
    }

  
  function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 512;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 1024;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var ret = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return (ret == -1) ? 0 : ret;
    }

  
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        FS.close(stream);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      var stream = FS.getStream(fildes);
      if (stream) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      _fsync(stream);
      return _close(stream);
    }

  var _putc=_fputc;


  
  
  
  function _recv(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _read(fd, buf, len);
    }
  
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStream(stream);
      if (!streamObj) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return 0;
      }
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)|0)]=streamObj.ungotten.pop();
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(stream, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return Math.floor(bytesRead / size);
    }function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) return -1;
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _fread(_fgetc.ret, 1, 1, stream);
      if (ret == 0) {
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAPU8[((_fgetc.ret)|0)];
      }
    }

  function _fgets(s, n, stream) {
      // char *fgets(char *restrict s, int n, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgets.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) return 0;
      if (streamObj.error || streamObj.eof) return 0;
      var byte_;
      for (var i = 0; i < n - 1 && byte_ != 10; i++) {
        byte_ = _fgetc(stream);
        if (byte_ == -1) {
          if (streamObj.error || (streamObj.eof && i == 0)) return 0;
          else if (streamObj.eof) break;
        }
        HEAP8[(((s)+(i))|0)]=byte_;
      }
      HEAP8[(((s)+(i))|0)]=0;
      return s;
    }

  function _htonl(value) {
      return ((value & 0xff) << 24) + ((value & 0xff00) << 8) +
             ((value & 0xff0000) >>> 8) + ((value & 0xff000000) >>> 24);
    }


  
  
  function __getFloat(text) {
      return /^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?/.exec(text);
    }function __scanString(format, get, unget, varargs) {
      if (!__scanString.whiteSpace) {
        __scanString.whiteSpace = {};
        __scanString.whiteSpace[32] = 1;
        __scanString.whiteSpace[9] = 1;
        __scanString.whiteSpace[10] = 1;
        __scanString.whiteSpace[11] = 1;
        __scanString.whiteSpace[12] = 1;
        __scanString.whiteSpace[13] = 1;
      }
      // Supports %x, %4x, %d.%d, %lld, %s, %f, %lf.
      // TODO: Support all format specifiers.
      format = Pointer_stringify(format);
      var soFar = 0;
      if (format.indexOf('%n') >= 0) {
        // need to track soFar
        var _get = get;
        get = function get() {
          soFar++;
          return _get();
        }
        var _unget = unget;
        unget = function unget() {
          soFar--;
          return _unget();
        }
      }
      var formatIndex = 0;
      var argsi = 0;
      var fields = 0;
      var argIndex = 0;
      var next;
  
      mainLoop:
      for (var formatIndex = 0; formatIndex < format.length;) {
        if (format[formatIndex] === '%' && format[formatIndex+1] == 'n') {
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          HEAP32[((argPtr)>>2)]=soFar;
          formatIndex += 2;
          continue;
        }
  
        if (format[formatIndex] === '%') {
          var nextC = format.indexOf('c', formatIndex+1);
          if (nextC > 0) {
            var maxx = 1;
            if (nextC > formatIndex+1) {
              var sub = format.substring(formatIndex+1, nextC);
              maxx = parseInt(sub);
              if (maxx != sub) maxx = 0;
            }
            if (maxx) {
              var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
              argIndex += Runtime.getAlignSize('void*', null, true);
              fields++;
              for (var i = 0; i < maxx; i++) {
                next = get();
                HEAP8[((argPtr++)|0)]=next;
              }
              formatIndex += nextC - formatIndex + 1;
              continue;
            }
          }
        }
  
        // handle %[...]
        if (format[formatIndex] === '%' && format.indexOf('[', formatIndex+1) > 0) {
          var match = /\%([0-9]*)\[(\^)?(\]?[^\]]*)\]/.exec(format.substring(formatIndex));
          if (match) {
            var maxNumCharacters = parseInt(match[1]) || Infinity;
            var negateScanList = (match[2] === '^');
            var scanList = match[3];
  
            // expand "middle" dashs into character sets
            var middleDashMatch;
            while ((middleDashMatch = /([^\-])\-([^\-])/.exec(scanList))) {
              var rangeStartCharCode = middleDashMatch[1].charCodeAt(0);
              var rangeEndCharCode = middleDashMatch[2].charCodeAt(0);
              for (var expanded = ''; rangeStartCharCode <= rangeEndCharCode; expanded += String.fromCharCode(rangeStartCharCode++));
              scanList = scanList.replace(middleDashMatch[1] + '-' + middleDashMatch[2], expanded);
            }
  
            var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
            argIndex += Runtime.getAlignSize('void*', null, true);
            fields++;
  
            for (var i = 0; i < maxNumCharacters; i++) {
              next = get();
              if (negateScanList) {
                if (scanList.indexOf(String.fromCharCode(next)) < 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              } else {
                if (scanList.indexOf(String.fromCharCode(next)) >= 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              }
            }
  
            // write out null-terminating character
            HEAP8[((argPtr++)|0)]=0;
            formatIndex += match[0].length;
            
            continue;
          }
        }      
        // remove whitespace
        while (1) {
          next = get();
          if (next == 0) return fields;
          if (!(next in __scanString.whiteSpace)) break;
        }
        unget();
  
        if (format[formatIndex] === '%') {
          formatIndex++;
          var suppressAssignment = false;
          if (format[formatIndex] == '*') {
            suppressAssignment = true;
            formatIndex++;
          }
          var maxSpecifierStart = formatIndex;
          while (format[formatIndex].charCodeAt(0) >= 48 &&
                 format[formatIndex].charCodeAt(0) <= 57) {
            formatIndex++;
          }
          var max_;
          if (formatIndex != maxSpecifierStart) {
            max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
          }
          var long_ = false;
          var half = false;
          var longLong = false;
          if (format[formatIndex] == 'l') {
            long_ = true;
            formatIndex++;
            if (format[formatIndex] == 'l') {
              longLong = true;
              formatIndex++;
            }
          } else if (format[formatIndex] == 'h') {
            half = true;
            formatIndex++;
          }
          var type = format[formatIndex];
          formatIndex++;
          var curr = 0;
          var buffer = [];
          // Read characters according to the format. floats are trickier, they may be in an unfloat state in the middle, then be a valid float later
          if (type == 'f' || type == 'e' || type == 'g' ||
              type == 'F' || type == 'E' || type == 'G') {
            next = get();
            while (next > 0 && (!(next in __scanString.whiteSpace)))  {
              buffer.push(String.fromCharCode(next));
              next = get();
            }
            var m = __getFloat(buffer.join(''));
            var last = m ? m[0].length : 0;
            for (var i = 0; i < buffer.length - last + 1; i++) {
              unget();
            }
            buffer.length = last;
          } else {
            next = get();
            var first = true;
            
            // Strip the optional 0x prefix for %x.
            if ((type == 'x' || type == 'X') && (next == 48)) {
              var peek = get();
              if (peek == 120 || peek == 88) {
                next = get();
              } else {
                unget();
              }
            }
            
            while ((curr < max_ || isNaN(max_)) && next > 0) {
              if (!(next in __scanString.whiteSpace) && // stop on whitespace
                  (type == 's' ||
                   ((type === 'd' || type == 'u' || type == 'i') && ((next >= 48 && next <= 57) ||
                                                                     (first && next == 45))) ||
                   ((type === 'x' || type === 'X') && (next >= 48 && next <= 57 ||
                                     next >= 97 && next <= 102 ||
                                     next >= 65 && next <= 70))) &&
                  (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) { // Stop when we read something that is coming up
                buffer.push(String.fromCharCode(next));
                next = get();
                curr++;
                first = false;
              } else {
                break;
              }
            }
            unget();
          }
          if (buffer.length === 0) return 0;  // Failure.
          if (suppressAssignment) continue;
  
          var text = buffer.join('');
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          switch (type) {
            case 'd': case 'u': case 'i':
              if (half) {
                HEAP16[((argPtr)>>1)]=parseInt(text, 10);
              } else if (longLong) {
                (tempI64 = [parseInt(text, 10)>>>0,(tempDouble=parseInt(text, 10),Math_abs(tempDouble) >= 1 ? (tempDouble > 0 ? Math_min(Math_floor((tempDouble)/4294967296), 4294967295)>>>0 : (~~(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296)))>>>0) : 0)],HEAP32[((argPtr)>>2)]=tempI64[0],HEAP32[(((argPtr)+(4))>>2)]=tempI64[1]);
              } else {
                HEAP32[((argPtr)>>2)]=parseInt(text, 10);
              }
              break;
            case 'X':
            case 'x':
              HEAP32[((argPtr)>>2)]=parseInt(text, 16);
              break;
            case 'F':
            case 'f':
            case 'E':
            case 'e':
            case 'G':
            case 'g':
            case 'E':
              // fallthrough intended
              if (long_) {
                HEAPF64[((argPtr)>>3)]=parseFloat(text);
              } else {
                HEAPF32[((argPtr)>>2)]=parseFloat(text);
              }
              break;
            case 's':
              var array = intArrayFromString(text);
              for (var j = 0; j < array.length; j++) {
                HEAP8[(((argPtr)+(j))|0)]=array[j];
              }
              break;
          }
          fields++;
        } else if (format[formatIndex].charCodeAt(0) in __scanString.whiteSpace) {
          next = get();
          while (next in __scanString.whiteSpace) {
            if (next <= 0) break mainLoop;  // End of input.
            next = get();
          }
          unget(next);
          formatIndex++;
        } else {
          // Not a specifier.
          next = get();
          if (format[formatIndex].charCodeAt(0) !== next) {
            unget(next);
            break mainLoop;
          }
          formatIndex++;
        }
      }
      return fields;
    }
  
  function _ungetc(c, stream) {
      // int ungetc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ungetc.html
      stream = FS.getStream(stream);
      if (!stream) {
        return -1;
      }
      if (c === -1) {
        // do nothing for EOF character
        return c;
      }
      c = unSign(c & 0xFF);
      stream.ungotten.push(c);
      stream.eof = false;
      return c;
    }function _fscanf(stream, format, varargs) {
      // int fscanf(FILE *restrict stream, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) {
        return -1;
      }
      var buffer = [];
      function get() {
        var c = _fgetc(stream);
        buffer.push(c);
        return c;
      };
      function unget() {
        _ungetc(buffer.pop(), stream);
      };
      return __scanString(format, get, unget, varargs);
    }



  var _ntohl=_htonl;

  function _srand(seed) {}

  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }

  function _abort() {
      Module['abort']();
    }

  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }

  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
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
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }






FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
___buildEnvironment(ENV);
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

staticSealed = true; // seal the static portion of memory

STACK_MAX = STACK_BASE + 5242880;

DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");



var FUNCTION_TABLE = [0,0,_menu_bouton_jouer,0,_charger_ordinateur,0,_ensemble_colore_createIterateur,0,_ensemble_chaine_supprimer_tete,0,_event_charger,0,_ensemble_colore_next,0,_detruire_ensemble_colore,0,_utiliser_event_groupe_radio,0,_utiliser_event_bouton,0,_ensemble_plateau_nombre_elements,0,_ensemble_position_nombre_elements,0,_detruire_textinput,0,_charger_plateau_texte,0,_plateau_determiner_chaine,0,_ensemble_plateau_createIterateur,0,_charger_partie,0,_jouer_bouton_passer,0,_creer_ensemble_colore,0,_creer_textinput,0,_afficher_menu,0,_afficher_jouer,0,_menu_bouton_charger,0,_creer_menu,0,_afficher_groupe_radio,0,_detruire_plateau,0,_free,0,_plateau_load_data,0,_creer_radio,0,_ensemble_chaine_ajouter,0,_territoire_appartient,0,_detruire_ensemble_position,0,_try_realloc_chunk,0,_mise_a_jour_menu,0,_ensemble_chaine_get,0,_lesYeuxDeLaChaine,0,_plateau_set_at,0,_plateau_capture_chaines,0,_position_bas,0,_main,0,_plateau_est_identique,0,_partie_informer_ordinateur,0,_afficher_bouton,0,_ensemble_position_vide,0,_afficher_radio,0,_partie_jouer_coup,0,_ensemble_colore_vide,0,_detruire_label,0,_position,0,_draw_surface,0,_ensemble_plateau_get,0,_ensemble_chaine_next,0,_menu_radio_type_joueur,0,_ensemble_colore_set_couleur,0,_plateau_copie,0,_ensemble_colore_nombre_elements,0,_sdl_handle_events,0,_ensemble_plateau_appartient,0,_creer_label,0,_ensemble_position_supprimer_tete,0,_jouer_bouton_retour,0,_detruire_ensemble_plateau,0,_ordinateur_remplacer_plateau,0,_position_gauche,0,_get_color,0,_afficher_textinput,0,_utiliser_event_radio,0,_ensemble_position_ajouter,0,_plateau_get,0,_creer_groupe_radio,0,_creer_partie,0,_ensemble_position_createIterateur,0,_partie_en_cours_de_handicap,0,_determiner_libertes,0,_afficher_label,0,_plateau_set,0,_ensemble_plateau_ajouter,0,_jouer_coup_ordi,0,_charger_partie_fichier,0,_afficher_charger,0,_ensemble_colore_ajouter,0,_jouer_bouton_sauvegarder,0,_get_position_depuis_ecran,0,_position_droite,0,_menu_bouton_quitter,0,_mise_a_jour_charger,0,_ensemble_plateau_supprimer_tete,0,_partie_rejouer_coup,0,_SDL_Quit,0,_get_marge,0,_mise_a_jour_textinput,0,_ensemble_position_next,0,_ensemble_colore_positions,0,_ensemble_position_get,0,_initialiser_ordi,0,_event_menu,0,_creer_bouton,0,_mise_a_jour_jouer,0,_set_state,0,_event_jouer,0,_sauvegarder_partie,0,_ordinateur_jouer_coup,0,_creer_charger,0,_ensemble_position_appartient,0,_text_surface,0,_plateau_get_taille,0,_sauvegarder_partie_fichier,0,_plateau_data,0,_get_position_vers_ecran,0,_creer_plateau,0,_dispose_chunk,0,_malloc,0,_creer_ensemble_position,0,_creer_ensemble_plateau,0,_ensemble_chaine_createIterateur,0,_detruire_partie,0,_charger_plateau,0,_ordinateur_notifier_coup,0,_update,0,_ensemble_chaine_vide,0,_charger_bouton_charger,0,_ensemble_plateau_next,0,_utiliser_event_textinput,0,_construction_function,0,_gosh_free,0,_position_haut,0,_set_color,0,_gosh_alloc_size,0,_charger_bouton_retour,0,_initialisation_partie,0,_ensemble_chaine_appartient,0,_sauvegarder_plateau,0,_ensemble_plateau_vide,0,_ensemble_colore_couleur,0,_recuperer_fonction,0,_detruire_charger,0,_plateau_realiser_capture,0,_creer_ensemble_chaine,0,_afficher_sauvegarder,0,_question_coherante,0,_plateau_data_size,0,_partie_jouer_ordinateur,0,_plateau_clone,0,_draw_rect,0,_realloc,0,_refresh,0,_groupe_radio_ajouter,0,_partie_score_joueurs,0,_impl_get_nbCases,0,_partie_annuler_coup,0,_plateau_get_at,0,_mise_a_jour_bouton,0,_gosh_realloc_size,0,_determiner_territoire,0,_position_est_valide,0,_detruire_ensemble_chaine,0,_detruire_jouer,0,_charger_plateau_binaire,0,_get_font,0,_detruire_bouton,0,_ensemble_chaine_nombre_elements,0,_ensemble_colore_appartient,0,_creer_jouer,0];
var SYMBOL_TABLE = {_menu_bouton_jouer: 2, _charger_ordinateur: 4, _ensemble_colore_createIterateur: 6, _ensemble_chaine_supprimer_tete: 8, _event_charger: 10, _ensemble_chaine_vide: 238, _ensemble_colore_next: 12, _ensemble_plateau_ajouter: 152, _utiliser_event_groupe_radio: 16, _utiliser_event_bouton: 18, _ensemble_position_nombre_elements: 22, _detruire_textinput: 24, _charger_plateau_texte: 26, _plateau_determiner_chaine: 28, _ensemble_plateau_createIterateur: 30, _charger_partie: 32, _plateau_set_nbPosParCase: 8, _jouer_bouton_passer: 34, _creer_ensemble_colore: 36, _creer_textinput: 38, _afficher_menu: 40, _afficher_jouer: 42, _plateau_data: 214, _afficher_groupe_radio: 48, _detruire_plateau: 50, _free: 52, _plateau_load_data: 54, _creer_radio: 56, _ensemble_chaine_ajouter: 58, _territoire_appartient: 60, _detruire_ensemble_position: 62, _try_realloc_chunk: 64, _mise_a_jour_menu: 66, _afficher_textinput: 130, _lesYeuxDeLaChaine: 70, _plateau_set_at: 72, _plateau_capture_chaines: 74, _position_bas: 76, _main: 78, _plateau_est_identique: 80, _partie_informer_ordinateur: 82, _POSITION_INVALIDE: 1488, _mparams: 1520, _ensemble_position_vide: 86, _afficher_radio: 88, _detruire_label: 94, _position: 96, _draw_surface: 98, _ensemble_plateau_get: 100, _ensemble_chaine_next: 102, _FONT_FILENAMES: 1496, _menu_radio_type_joueur: 104, _ensemble_colore_set_couleur: 106, _plateau_copie: 108, _get_font_fonts: 1552, _refresh: 290, _ensemble_colore_nombre_elements: 110, _sdl_handle_events: 112, _ensemble_plateau_appartient: 114, _creer_ensemble_plateau: 226, _creer_label: 116, _detruire_bouton: 318, _position_droite: 166, _plateau_get_taille: 210, _jouer_bouton_retour: 120, _detruire_ensemble_plateau: 122, _partie_score_joueurs: 294, _position_gauche: 126, _get_color: 128, _ensemble_chaine_get: 68, _utiliser_event_radio: 132, _ensemble_position_ajouter: 134, _plateau_get: 136, _window: 1504, _creer_groupe_radio: 138, _creer_partie: 140, _ensemble_position_createIterateur: 142, _partie_en_cours_de_handicap: 144, _determiner_libertes: 146, _afficher_label: 148, _plateau_set: 150, _detruire_ensemble_colore: 14, _jouer_coup_ordi: 154, _charger_partie_fichier: 156, _afficher_charger: 158, _ensemble_colore_ajouter: 160, _jouer_bouton_sauvegarder: 162, _get_position_depuis_ecran: 164, _ensemble_position_supprimer_tete: 118, _menu_bouton_quitter: 168, _mise_a_jour_charger: 170, _font_sizes: 24, _afficher_bouton: 84, _ensemble_plateau_supprimer_tete: 172, _get_marge: 178, _mise_a_jour_textinput: 180, _ensemble_position_next: 182, _partie_jouer_coup: 90, _ensemble_position_get: 186, _ensemble_plateau_nombre_elements: 20, _event_menu: 190, _creer_bouton: 192, _mise_a_jour_jouer: 194, _creer_menu: 46, _event_jouer: 198, _sauvegarder_partie: 200, _SDL_Quit: 176, _ordinateur_jouer_coup: 202, _creer_charger: 204, _ensemble_position_appartient: 206, _text_surface: 208, _ensemble_colore_vide: 92, _sauvegarder_partie_fichier: 212, _menu_bouton_charger: 44, _get_position_vers_ecran: 216, _creer_plateau: 218, _gosh_realloc_size: 304, _dispose_chunk: 220, __gm_: 1576, _determiner_territoire: 306, _color: 40, _ensemble_chaine_createIterateur: 228, _detruire_partie: 230, _plateau_get_nbPosParCase: 16, _charger_plateau: 232, _ordinateur_notifier_coup: 234, _update: 236, _partie_rejouer_coup: 174, _charger_bouton_charger: 240, _state: 1512, _ensemble_plateau_next: 242, _utiliser_event_textinput: 244, _construction_function: 246, _gosh_free: 248, _position_haut: 250, _ensemble_colore_positions: 184, _set_color: 252, _gosh_alloc_size: 254, _charger_bouton_retour: 256, _initialisation_partie: 258, _llvm_used: 1544, _ensemble_chaine_appartient: 260, _sauvegarder_plateau: 262, _ensemble_plateau_vide: 264, _ensemble_colore_couleur: 266, _recuperer_fonction: 268, _detruire_charger: 270, _creer_ensemble_chaine: 274, _afficher_sauvegarder: 276, _question_coherante: 278, _plateau_data_size: 280, _partie_jouer_ordinateur: 282, _plateau_clone: 284, _draw_rect: 286, _realloc: 288, _initialiser_ordi: 188, _groupe_radio_ajouter: 292, _ordinateur_remplacer_plateau: 124, _impl_get_nbCases: 296, _partie_annuler_coup: 298, _plateau_get_at: 300, _mise_a_jour_bouton: 302, _set_state: 196, _creer_ensemble_position: 224, _position_est_valide: 308, _detruire_ensemble_chaine: 310, _detruire_jouer: 312, _malloc: 222, _charger_plateau_binaire: 314, _get_font: 316, _plateau_realiser_capture: 272, _ensemble_chaine_nombre_elements: 320, _ensemble_colore_appartient: 322, _creer_jouer: 324};
// EMSCRIPTEN_START_FUNCS

function _sdl_handle_events($state){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+48)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $event=sp;
 $1=$state;
  //@line 57 "../../../src/sdl/main.c"
 while(1) {
  var $3=_SDL_PollEvent($event); //@line 57 "../../../src/sdl/main.c"
  var $4=($3|0)!=0; //@line 57 "../../../src/sdl/main.c"
   //@line 57 "../../../src/sdl/main.c"
  if (!($4)) {
   break;
  }
  var $6=$event; //@line 58 "../../../src/sdl/main.c"
  var $7=HEAP32[(($6)>>2)]; //@line 58 "../../../src/sdl/main.c"
  switch (($7|0)) {
  case 256: {
   var $9=$1; //@line 60 "../../../src/sdl/main.c"
   var $10=(($9)|0); //@line 60 "../../../src/sdl/main.c"
   HEAP8[($10)]=1; //@line 60 "../../../src/sdl/main.c"
    //@line 61 "../../../src/sdl/main.c"
   break;
  }
  case 768: {
   var $12=$1; //@line 63 "../../../src/sdl/main.c"
   var $13=(($12+8)|0); //@line 63 "../../../src/sdl/main.c"
   var $14=HEAP32[(($13)>>2)]; //@line 63 "../../../src/sdl/main.c"
   var $15=($14|0)!=0; //@line 63 "../../../src/sdl/main.c"
    //@line 63 "../../../src/sdl/main.c"
   if ($15) {
    var $17=$1; //@line 64 "../../../src/sdl/main.c"
    var $18=(($17+8)|0); //@line 64 "../../../src/sdl/main.c"
    var $19=HEAP32[(($18)>>2)]; //@line 64 "../../../src/sdl/main.c"
    var $20=$1; //@line 64 "../../../src/sdl/main.c"
    FUNCTION_TABLE[$19]($20,$event); //@line 64 "../../../src/sdl/main.c"
     //@line 64 "../../../src/sdl/main.c"
   }
    //@line 65 "../../../src/sdl/main.c"
   break;
  }
  case 769: {
    //@line 67 "../../../src/sdl/main.c"
   break;
  }
  case 1024: {
   var $24=$1; //@line 69 "../../../src/sdl/main.c"
   var $25=(($24+12)|0); //@line 69 "../../../src/sdl/main.c"
   var $26=HEAP32[(($25)>>2)]; //@line 69 "../../../src/sdl/main.c"
   var $27=($26|0)!=0; //@line 69 "../../../src/sdl/main.c"
    //@line 69 "../../../src/sdl/main.c"
   if ($27) {
    var $29=$1; //@line 70 "../../../src/sdl/main.c"
    var $30=(($29+12)|0); //@line 70 "../../../src/sdl/main.c"
    var $31=HEAP32[(($30)>>2)]; //@line 70 "../../../src/sdl/main.c"
    var $32=$1; //@line 70 "../../../src/sdl/main.c"
    FUNCTION_TABLE[$31]($32,$event); //@line 70 "../../../src/sdl/main.c"
     //@line 70 "../../../src/sdl/main.c"
   }
    //@line 71 "../../../src/sdl/main.c"
   break;
  }
  case 1025: {
   var $35=$1; //@line 73 "../../../src/sdl/main.c"
   var $36=(($35+16)|0); //@line 73 "../../../src/sdl/main.c"
   var $37=HEAP32[(($36)>>2)]; //@line 73 "../../../src/sdl/main.c"
   var $38=($37|0)!=0; //@line 73 "../../../src/sdl/main.c"
    //@line 73 "../../../src/sdl/main.c"
   if ($38) {
    var $40=$1; //@line 74 "../../../src/sdl/main.c"
    var $41=(($40+16)|0); //@line 74 "../../../src/sdl/main.c"
    var $42=HEAP32[(($41)>>2)]; //@line 74 "../../../src/sdl/main.c"
    var $43=$1; //@line 74 "../../../src/sdl/main.c"
    FUNCTION_TABLE[$42]($43,$event); //@line 74 "../../../src/sdl/main.c"
     //@line 74 "../../../src/sdl/main.c"
   }
    //@line 75 "../../../src/sdl/main.c"
   break;
  }
  case 1026: {
   var $46=$1; //@line 77 "../../../src/sdl/main.c"
   var $47=(($46+20)|0); //@line 77 "../../../src/sdl/main.c"
   var $48=HEAP32[(($47)>>2)]; //@line 77 "../../../src/sdl/main.c"
   var $49=($48|0)!=0; //@line 77 "../../../src/sdl/main.c"
    //@line 77 "../../../src/sdl/main.c"
   if ($49) {
    var $51=$1; //@line 78 "../../../src/sdl/main.c"
    var $52=(($51+20)|0); //@line 78 "../../../src/sdl/main.c"
    var $53=HEAP32[(($52)>>2)]; //@line 78 "../../../src/sdl/main.c"
    var $54=$1; //@line 78 "../../../src/sdl/main.c"
    FUNCTION_TABLE[$53]($54,$event); //@line 78 "../../../src/sdl/main.c"
     //@line 78 "../../../src/sdl/main.c"
   }
    //@line 79 "../../../src/sdl/main.c"
   break;
  }
  default: {
  }
  }
   //@line 81 "../../../src/sdl/main.c"
 }
 STACKTOP=sp;return; //@line 82 "../../../src/sdl/main.c"
}


function _set_state($newstate){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$newstate;
 var $2=$1; //@line 86 "../../../src/sdl/main.c"
 HEAP32[((1512)>>2)]=$2; //@line 86 "../../../src/sdl/main.c"
 STACKTOP=sp;return; //@line 87 "../../../src/sdl/main.c"
}


function _update(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $dt;
 var $1=HEAP32[((1512)>>2)]; //@line 94 "../../../src/sdl/main.c"
 _sdl_handle_events($1); //@line 94 "../../../src/sdl/main.c"
 $dt=0.016666666666666666; //@line 96 "../../../src/sdl/main.c"
 var $2=HEAP32[((1512)>>2)]; //@line 97 "../../../src/sdl/main.c"
 var $3=(($2+24)|0); //@line 97 "../../../src/sdl/main.c"
 var $4=HEAP32[(($3)>>2)]; //@line 97 "../../../src/sdl/main.c"
 var $5=($4|0)!=0; //@line 97 "../../../src/sdl/main.c"
  //@line 97 "../../../src/sdl/main.c"
 if ($5) {
  var $7=HEAP32[((1512)>>2)]; //@line 98 "../../../src/sdl/main.c"
  var $8=(($7+24)|0); //@line 98 "../../../src/sdl/main.c"
  var $9=HEAP32[(($8)>>2)]; //@line 98 "../../../src/sdl/main.c"
  var $10=HEAP32[((1512)>>2)]; //@line 98 "../../../src/sdl/main.c"
  var $11=$dt; //@line 98 "../../../src/sdl/main.c"
  FUNCTION_TABLE[$9]($10,$11); //@line 98 "../../../src/sdl/main.c"
   //@line 98 "../../../src/sdl/main.c"
 }
 _set_color(40,40,40); //@line 100 "../../../src/sdl/main.c"
 var $13=HEAP32[((1504)>>2)]; //@line 101 "../../../src/sdl/main.c"
 _draw_rect($13,0,0,800,680); //@line 101 "../../../src/sdl/main.c"
 var $14=HEAP32[((1512)>>2)]; //@line 102 "../../../src/sdl/main.c"
 var $15=(($14+4)|0); //@line 102 "../../../src/sdl/main.c"
 var $16=HEAP32[(($15)>>2)]; //@line 102 "../../../src/sdl/main.c"
 var $17=HEAP32[((1512)>>2)]; //@line 102 "../../../src/sdl/main.c"
 var $18=HEAP32[((1504)>>2)]; //@line 102 "../../../src/sdl/main.c"
 FUNCTION_TABLE[$16]($17,$18); //@line 102 "../../../src/sdl/main.c"
 var $19=HEAP32[((1504)>>2)]; //@line 104 "../../../src/sdl/main.c"
 var $20=_SDL_Flip($19); //@line 104 "../../../src/sdl/main.c"
 var $21=HEAP32[((1512)>>2)]; //@line 106 "../../../src/sdl/main.c"
 var $22=(($21)|0); //@line 106 "../../../src/sdl/main.c"
 var $23=HEAP8[($22)]; //@line 106 "../../../src/sdl/main.c"
 var $24=(($23)&1); //@line 106 "../../../src/sdl/main.c"
  //@line 106 "../../../src/sdl/main.c"
 if (!($24)) {
  STACKTOP=sp;return; //@line 112 "../../../src/sdl/main.c"
 }
 var $26=_printf(1352,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 1)|0,STACKTOP = (((STACKTOP)+7)&-8),(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=0,tempVarArgs)); STACKTOP=tempVarArgs; //@line 107 "../../../src/sdl/main.c"
 _emscripten_cancel_main_loop(); //@line 109 "../../../src/sdl/main.c"
  //@line 111 "../../../src/sdl/main.c"
 STACKTOP=sp;return; //@line 112 "../../../src/sdl/main.c"
}


function _main($argc,$argv){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 $1=0;
 $2=$argc;
 $3=$argv;
 var $4=$2; //@line 116 "../../../src/sdl/main.c"
 var $5=$3; //@line 117 "../../../src/sdl/main.c"
  //@line 118 "../../../src/sdl/main.c"
 var $7=_SDL_Init(65535); //@line 118 "../../../src/sdl/main.c"
 var $8=($7|0)==0; //@line 118 "../../../src/sdl/main.c"
  //@line 118 "../../../src/sdl/main.c"
 if (!($8)) {
  var $10=_SDL_GetError(); //@line 118 "../../../src/sdl/main.c"
  _perror($10); //@line 118 "../../../src/sdl/main.c"
  _exit(1); //@line 118 "../../../src/sdl/main.c"
  throw "Reached an unreachable!"; //@line 118 "../../../src/sdl/main.c"
 }
  //@line 118 "../../../src/sdl/main.c"
 var $13=_atexit(176); //@line 119 "../../../src/sdl/main.c"
  //@line 121 "../../../src/sdl/main.c"
 var $15=_TTF_Init(); //@line 121 "../../../src/sdl/main.c"
 var $16=($15|0)==0; //@line 121 "../../../src/sdl/main.c"
  //@line 121 "../../../src/sdl/main.c"
 if (!($16)) {
  var $18=_SDL_GetError(); //@line 121 "../../../src/sdl/main.c"
  _perror($18); //@line 121 "../../../src/sdl/main.c"
  _exit(1); //@line 121 "../../../src/sdl/main.c"
  throw "Reached an unreachable!"; //@line 121 "../../../src/sdl/main.c"
 }
  //@line 121 "../../../src/sdl/main.c"
 var $21=_SDL_SetVideoMode(800,680,32,138412033); //@line 123 "../../../src/sdl/main.c"
 HEAP32[((1504)>>2)]=$21; //@line 123 "../../../src/sdl/main.c"
  //@line 124 "../../../src/sdl/main.c"
 var $23=HEAP32[((1504)>>2)]; //@line 124 "../../../src/sdl/main.c"
 var $24=($23|0)!=0; //@line 124 "../../../src/sdl/main.c"
  //@line 124 "../../../src/sdl/main.c"
 if (!($24)) {
  var $26=_SDL_GetError(); //@line 124 "../../../src/sdl/main.c"
  _perror($26); //@line 124 "../../../src/sdl/main.c"
  _exit(1); //@line 124 "../../../src/sdl/main.c"
  throw "Reached an unreachable!"; //@line 124 "../../../src/sdl/main.c"
 }
  //@line 124 "../../../src/sdl/main.c"
 var $29=_creer_menu(); //@line 126 "../../../src/sdl/main.c"
 HEAP32[((1512)>>2)]=$29; //@line 126 "../../../src/sdl/main.c"
 _emscripten_set_main_loop((236),0,1); //@line 129 "../../../src/sdl/main.c"
 STACKTOP=sp;return 0; //@line 137 "../../../src/sdl/main.c"
}
Module["_main"] = _main;

function _creer_groupe_radio($nombre){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $groupe;
 $1=$nombre;
 var $2=_gosh_alloc_size(28); //@line 87 "../../../src/sdl/radio.c"
 var $3=$2; //@line 87 "../../../src/sdl/radio.c"
 $groupe=$3; //@line 87 "../../../src/sdl/radio.c"
 var $4=$1; //@line 88 "../../../src/sdl/radio.c"
 var $5=$groupe; //@line 88 "../../../src/sdl/radio.c"
 var $6=(($5)|0); //@line 88 "../../../src/sdl/radio.c"
 HEAP32[(($6)>>2)]=$4; //@line 88 "../../../src/sdl/radio.c"
 var $7=$groupe; //@line 89 "../../../src/sdl/radio.c"
 var $8=(($7+4)|0); //@line 89 "../../../src/sdl/radio.c"
 HEAP32[(($8)>>2)]=0; //@line 89 "../../../src/sdl/radio.c"
 var $9=$1; //@line 90 "../../../src/sdl/radio.c"
 var $10=($9<<2); //@line 90 "../../../src/sdl/radio.c"
 var $11=_gosh_alloc_size($10); //@line 90 "../../../src/sdl/radio.c"
 var $12=$11; //@line 90 "../../../src/sdl/radio.c"
 var $13=$groupe; //@line 90 "../../../src/sdl/radio.c"
 var $14=(($13+8)|0); //@line 90 "../../../src/sdl/radio.c"
 HEAP32[(($14)>>2)]=$12; //@line 90 "../../../src/sdl/radio.c"
 var $15=$groupe; //@line 91 "../../../src/sdl/radio.c"
 var $16=(($15+12)|0); //@line 91 "../../../src/sdl/radio.c"
 HEAP32[(($16)>>2)]=-1; //@line 91 "../../../src/sdl/radio.c"
 var $17=$groupe; //@line 92 "../../../src/sdl/radio.c"
 var $18=(($17+20)|0); //@line 92 "../../../src/sdl/radio.c"
 HEAP32[(($18)>>2)]=0; //@line 92 "../../../src/sdl/radio.c"
 var $19=$groupe; //@line 93 "../../../src/sdl/radio.c"
 var $20=(($19+24)|0); //@line 93 "../../../src/sdl/radio.c"
 HEAP32[(($20)>>2)]=0; //@line 93 "../../../src/sdl/radio.c"
 var $21=$groupe; //@line 94 "../../../src/sdl/radio.c"
 var $22=(($21+16)|0); //@line 94 "../../../src/sdl/radio.c"
 HEAP8[($22)]=1; //@line 94 "../../../src/sdl/radio.c"
 var $23=$groupe; //@line 95 "../../../src/sdl/radio.c"
 STACKTOP=sp;return $23; //@line 95 "../../../src/sdl/radio.c"
}


function _groupe_radio_ajouter($groupe,$texte,$x,$y){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $4;
 var $radio;
 $1=$groupe;
 $2=$texte;
 $3=$x;
 $4=$y;
 var $5=$2; //@line 100 "../../../src/sdl/radio.c"
 var $6=$3; //@line 100 "../../../src/sdl/radio.c"
 var $7=$4; //@line 100 "../../../src/sdl/radio.c"
 var $8=_creer_radio($5,$6,$7); //@line 100 "../../../src/sdl/radio.c"
 $radio=$8; //@line 100 "../../../src/sdl/radio.c"
 var $9=$1; //@line 101 "../../../src/sdl/radio.c"
 var $10=(($9+4)|0); //@line 101 "../../../src/sdl/radio.c"
 var $11=HEAP32[(($10)>>2)]; //@line 101 "../../../src/sdl/radio.c"
 var $12=($11|0)==0; //@line 101 "../../../src/sdl/radio.c"
  //@line 101 "../../../src/sdl/radio.c"
 if ($12) {
  var $14=$1; //@line 102 "../../../src/sdl/radio.c"
  var $15=(($14+12)|0); //@line 102 "../../../src/sdl/radio.c"
  HEAP32[(($15)>>2)]=0; //@line 102 "../../../src/sdl/radio.c"
  var $16=$radio; //@line 103 "../../../src/sdl/radio.c"
  var $17=(($16+24)|0); //@line 103 "../../../src/sdl/radio.c"
  HEAP8[($17)]=1; //@line 103 "../../../src/sdl/radio.c"
   //@line 104 "../../../src/sdl/radio.c"
 }
 var $19=$radio; //@line 105 "../../../src/sdl/radio.c"
 var $20=$1; //@line 105 "../../../src/sdl/radio.c"
 var $21=(($20+4)|0); //@line 105 "../../../src/sdl/radio.c"
 var $22=HEAP32[(($21)>>2)]; //@line 105 "../../../src/sdl/radio.c"
 var $23=((($22)+(1))|0); //@line 105 "../../../src/sdl/radio.c"
 HEAP32[(($21)>>2)]=$23; //@line 105 "../../../src/sdl/radio.c"
 var $24=$1; //@line 105 "../../../src/sdl/radio.c"
 var $25=(($24+8)|0); //@line 105 "../../../src/sdl/radio.c"
 var $26=HEAP32[(($25)>>2)]; //@line 105 "../../../src/sdl/radio.c"
 var $27=(($26+($22<<2))|0); //@line 105 "../../../src/sdl/radio.c"
 HEAP32[(($27)>>2)]=$19; //@line 105 "../../../src/sdl/radio.c"
 STACKTOP=sp;return; //@line 106 "../../../src/sdl/radio.c"
}


function _creer_radio($texte,$x,$y){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $radio;
 var $4=sp;
 $1=$texte;
 $2=$x;
 $3=$y;
 var $5=_gosh_alloc_size(28); //@line 144 "../../../src/sdl/radio.c"
 var $6=$5; //@line 144 "../../../src/sdl/radio.c"
 $radio=$6; //@line 144 "../../../src/sdl/radio.c"
 var $7=$1; //@line 145 "../../../src/sdl/radio.c"
 var $8=_text_surface($7,1); //@line 145 "../../../src/sdl/radio.c"
 var $9=$radio; //@line 145 "../../../src/sdl/radio.c"
 var $10=(($9)|0); //@line 145 "../../../src/sdl/radio.c"
 HEAP32[(($10)>>2)]=$8; //@line 145 "../../../src/sdl/radio.c"
 var $11=$2; //@line 146 "../../../src/sdl/radio.c"
 var $12=($11|0); //@line 146 "../../../src/sdl/radio.c"
 var $13=$radio; //@line 146 "../../../src/sdl/radio.c"
 var $14=(($13+4)|0); //@line 146 "../../../src/sdl/radio.c"
 HEAPF32[(($14)>>2)]=$12; //@line 146 "../../../src/sdl/radio.c"
 var $15=$3; //@line 147 "../../../src/sdl/radio.c"
 var $16=($15|0); //@line 147 "../../../src/sdl/radio.c"
 var $17=$radio; //@line 147 "../../../src/sdl/radio.c"
 var $18=(($17+8)|0); //@line 147 "../../../src/sdl/radio.c"
 HEAPF32[(($18)>>2)]=$16; //@line 147 "../../../src/sdl/radio.c"
 var $19=$radio; //@line 148 "../../../src/sdl/radio.c"
 var $20=(($19)|0); //@line 148 "../../../src/sdl/radio.c"
 var $21=HEAP32[(($20)>>2)]; //@line 148 "../../../src/sdl/radio.c"
 var $22=(($21+8)|0); //@line 148 "../../../src/sdl/radio.c"
 var $23=HEAP32[(($22)>>2)]; //@line 148 "../../../src/sdl/radio.c"
 var $24=$radio; //@line 148 "../../../src/sdl/radio.c"
 var $25=(($24+12)|0); //@line 148 "../../../src/sdl/radio.c"
 HEAP32[(($25)>>2)]=$23; //@line 148 "../../../src/sdl/radio.c"
 var $26=$radio; //@line 149 "../../../src/sdl/radio.c"
 var $27=(($26)|0); //@line 149 "../../../src/sdl/radio.c"
 var $28=HEAP32[(($27)>>2)]; //@line 149 "../../../src/sdl/radio.c"
 var $29=(($28+12)|0); //@line 149 "../../../src/sdl/radio.c"
 var $30=HEAP32[(($29)>>2)]; //@line 149 "../../../src/sdl/radio.c"
 var $31=$radio; //@line 149 "../../../src/sdl/radio.c"
 var $32=(($31+16)|0); //@line 149 "../../../src/sdl/radio.c"
 HEAP32[(($32)>>2)]=$30; //@line 149 "../../../src/sdl/radio.c"
 var $33=$radio; //@line 150 "../../../src/sdl/radio.c"
 var $34=(($33+20)|0); //@line 150 "../../../src/sdl/radio.c"
 _get_color($4); //@line 150 "../../../src/sdl/radio.c"
 var $35=$34; //@line 150 "../../../src/sdl/radio.c"
 var $36=$4; //@line 150 "../../../src/sdl/radio.c"
 assert(4 % 1 === 0);HEAP8[($35)]=HEAP8[($36)];HEAP8[((($35)+(1))|0)]=HEAP8[((($36)+(1))|0)];HEAP8[((($35)+(2))|0)]=HEAP8[((($36)+(2))|0)];HEAP8[((($35)+(3))|0)]=HEAP8[((($36)+(3))|0)]; //@line 150 "../../../src/sdl/radio.c"
 var $37=$radio; //@line 151 "../../../src/sdl/radio.c"
 var $38=(($37+24)|0); //@line 151 "../../../src/sdl/radio.c"
 HEAP8[($38)]=0; //@line 151 "../../../src/sdl/radio.c"
 var $39=$radio; //@line 152 "../../../src/sdl/radio.c"
 var $40=(($39+25)|0); //@line 152 "../../../src/sdl/radio.c"
 HEAP8[($40)]=0; //@line 152 "../../../src/sdl/radio.c"
 var $41=$radio; //@line 153 "../../../src/sdl/radio.c"
 STACKTOP=sp;return $41; //@line 153 "../../../src/sdl/radio.c"
}


function _afficher_groupe_radio($surface,$groupe){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $i;
 $1=$surface;
 $2=$groupe;
 var $3=$2; //@line 110 "../../../src/sdl/radio.c"
 var $4=(($3+16)|0); //@line 110 "../../../src/sdl/radio.c"
 var $5=HEAP8[($4)]; //@line 110 "../../../src/sdl/radio.c"
 var $6=(($5)&1); //@line 110 "../../../src/sdl/radio.c"
  //@line 110 "../../../src/sdl/radio.c"
 if (!($6)) {
  STACKTOP=sp;return; //@line 115 "../../../src/sdl/radio.c"
 }
 $i=0; //@line 111 "../../../src/sdl/radio.c"
  //@line 111 "../../../src/sdl/radio.c"
 while(1) {
  var $9=$i; //@line 111 "../../../src/sdl/radio.c"
  var $10=$2; //@line 111 "../../../src/sdl/radio.c"
  var $11=(($10)|0); //@line 111 "../../../src/sdl/radio.c"
  var $12=HEAP32[(($11)>>2)]; //@line 111 "../../../src/sdl/radio.c"
  var $13=($9|0)<($12|0); //@line 111 "../../../src/sdl/radio.c"
   //@line 111 "../../../src/sdl/radio.c"
  if (!($13)) {
   break;
  }
  var $15=$1; //@line 112 "../../../src/sdl/radio.c"
  var $16=$i; //@line 112 "../../../src/sdl/radio.c"
  var $17=$2; //@line 112 "../../../src/sdl/radio.c"
  var $18=(($17+8)|0); //@line 112 "../../../src/sdl/radio.c"
  var $19=HEAP32[(($18)>>2)]; //@line 112 "../../../src/sdl/radio.c"
  var $20=(($19+($16<<2))|0); //@line 112 "../../../src/sdl/radio.c"
  var $21=HEAP32[(($20)>>2)]; //@line 112 "../../../src/sdl/radio.c"
  _afficher_radio($15,$21); //@line 112 "../../../src/sdl/radio.c"
   //@line 113 "../../../src/sdl/radio.c"
  var $23=$i; //@line 111 "../../../src/sdl/radio.c"
  var $24=((($23)+(1))|0); //@line 111 "../../../src/sdl/radio.c"
  $i=$24; //@line 111 "../../../src/sdl/radio.c"
   //@line 111 "../../../src/sdl/radio.c"
 }
  //@line 114 "../../../src/sdl/radio.c"
 STACKTOP=sp;return; //@line 115 "../../../src/sdl/radio.c"
}


function _afficher_radio($on,$radio){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $w;
 var $border;
 $1=$on;
 $2=$radio;
 var $3=$2; //@line 158 "../../../src/sdl/radio.c"
 var $4=(($3)|0); //@line 158 "../../../src/sdl/radio.c"
 var $5=HEAP32[(($4)>>2)]; //@line 158 "../../../src/sdl/radio.c"
 var $6=(($5+12)|0); //@line 158 "../../../src/sdl/radio.c"
 var $7=HEAP32[(($6)>>2)]; //@line 158 "../../../src/sdl/radio.c"
 var $8=($7|0); //@line 158 "../../../src/sdl/radio.c"
 var $9=($8)*((0.5)); //@line 158 "../../../src/sdl/radio.c"
 var $10=(($9)&-1); //@line 158 "../../../src/sdl/radio.c"
 $w=$10; //@line 158 "../../../src/sdl/radio.c"
 $border=2; //@line 159 "../../../src/sdl/radio.c"
 _set_color(200,200,200); //@line 160 "../../../src/sdl/radio.c"
 var $11=$1; //@line 161 "../../../src/sdl/radio.c"
 var $12=$2; //@line 161 "../../../src/sdl/radio.c"
 var $13=(($12+4)|0); //@line 161 "../../../src/sdl/radio.c"
 var $14=HEAPF32[(($13)>>2)]; //@line 161 "../../../src/sdl/radio.c"
 var $15=(($14)&-1); //@line 161 "../../../src/sdl/radio.c"
 var $16=$2; //@line 161 "../../../src/sdl/radio.c"
 var $17=(($16+8)|0); //@line 161 "../../../src/sdl/radio.c"
 var $18=HEAPF32[(($17)>>2)]; //@line 161 "../../../src/sdl/radio.c"
 var $19=$18; //@line 161 "../../../src/sdl/radio.c"
 var $20=$w; //@line 161 "../../../src/sdl/radio.c"
 var $21=($20|0); //@line 161 "../../../src/sdl/radio.c"
 var $22=($21)*((0.5)); //@line 161 "../../../src/sdl/radio.c"
 var $23=($19)+($22); //@line 161 "../../../src/sdl/radio.c"
 var $24=(($23)&-1); //@line 161 "../../../src/sdl/radio.c"
 var $25=$w; //@line 161 "../../../src/sdl/radio.c"
 var $26=$w; //@line 161 "../../../src/sdl/radio.c"
 _draw_rect($11,$15,$24,$25,$26); //@line 161 "../../../src/sdl/radio.c"
 var $27=$2; //@line 162 "../../../src/sdl/radio.c"
 var $28=(($27+24)|0); //@line 162 "../../../src/sdl/radio.c"
 var $29=HEAP8[($28)]; //@line 162 "../../../src/sdl/radio.c"
 var $30=(($29)&1); //@line 162 "../../../src/sdl/radio.c"
  //@line 162 "../../../src/sdl/radio.c"
 if ($30) {
  var $32=$2; //@line 163 "../../../src/sdl/radio.c"
  var $33=(($32+25)|0); //@line 163 "../../../src/sdl/radio.c"
  var $34=HEAP8[($33)]; //@line 163 "../../../src/sdl/radio.c"
  var $35=(($34)&1); //@line 163 "../../../src/sdl/radio.c"
   //@line 163 "../../../src/sdl/radio.c"
  if ($35) {
   _set_color(150,100,100); //@line 164 "../../../src/sdl/radio.c"
    //@line 165 "../../../src/sdl/radio.c"
  } else {
   _set_color(50,50,50); //@line 166 "../../../src/sdl/radio.c"
  }
   //@line 168 "../../../src/sdl/radio.c"
 } else {
  var $40=$2; //@line 168 "../../../src/sdl/radio.c"
  var $41=(($40+25)|0); //@line 168 "../../../src/sdl/radio.c"
  var $42=HEAP8[($41)]; //@line 168 "../../../src/sdl/radio.c"
  var $43=(($42)&1); //@line 168 "../../../src/sdl/radio.c"
   //@line 168 "../../../src/sdl/radio.c"
  if ($43) {
   _set_color(100,100,100); //@line 169 "../../../src/sdl/radio.c"
    //@line 170 "../../../src/sdl/radio.c"
  }
 }
 var $47=$1; //@line 171 "../../../src/sdl/radio.c"
 var $48=$2; //@line 171 "../../../src/sdl/radio.c"
 var $49=(($48+4)|0); //@line 171 "../../../src/sdl/radio.c"
 var $50=HEAPF32[(($49)>>2)]; //@line 171 "../../../src/sdl/radio.c"
 var $51=$border; //@line 171 "../../../src/sdl/radio.c"
 var $52=($51|0); //@line 171 "../../../src/sdl/radio.c"
 var $53=($50)+($52); //@line 171 "../../../src/sdl/radio.c"
 var $54=(($53)&-1); //@line 171 "../../../src/sdl/radio.c"
 var $55=$2; //@line 171 "../../../src/sdl/radio.c"
 var $56=(($55+8)|0); //@line 171 "../../../src/sdl/radio.c"
 var $57=HEAPF32[(($56)>>2)]; //@line 171 "../../../src/sdl/radio.c"
 var $58=$57; //@line 171 "../../../src/sdl/radio.c"
 var $59=$w; //@line 171 "../../../src/sdl/radio.c"
 var $60=($59|0); //@line 171 "../../../src/sdl/radio.c"
 var $61=($60)*((0.5)); //@line 171 "../../../src/sdl/radio.c"
 var $62=($58)+($61); //@line 171 "../../../src/sdl/radio.c"
 var $63=$border; //@line 171 "../../../src/sdl/radio.c"
 var $64=($63|0); //@line 171 "../../../src/sdl/radio.c"
 var $65=($62)+($64); //@line 171 "../../../src/sdl/radio.c"
 var $66=(($65)&-1); //@line 171 "../../../src/sdl/radio.c"
 var $67=$w; //@line 171 "../../../src/sdl/radio.c"
 var $68=$border; //@line 171 "../../../src/sdl/radio.c"
 var $69=($68<<1); //@line 171 "../../../src/sdl/radio.c"
 var $70=((($67)-($69))|0); //@line 171 "../../../src/sdl/radio.c"
 var $71=$w; //@line 171 "../../../src/sdl/radio.c"
 var $72=$border; //@line 171 "../../../src/sdl/radio.c"
 var $73=($72<<1); //@line 171 "../../../src/sdl/radio.c"
 var $74=((($71)-($73))|0); //@line 171 "../../../src/sdl/radio.c"
 _draw_rect($47,$54,$66,$70,$74); //@line 171 "../../../src/sdl/radio.c"
 var $75=$1; //@line 172 "../../../src/sdl/radio.c"
 var $76=$2; //@line 172 "../../../src/sdl/radio.c"
 var $77=(($76)|0); //@line 172 "../../../src/sdl/radio.c"
 var $78=HEAP32[(($77)>>2)]; //@line 172 "../../../src/sdl/radio.c"
 var $79=$2; //@line 172 "../../../src/sdl/radio.c"
 var $80=(($79+4)|0); //@line 172 "../../../src/sdl/radio.c"
 var $81=HEAPF32[(($80)>>2)]; //@line 172 "../../../src/sdl/radio.c"
 var $82=$w; //@line 172 "../../../src/sdl/radio.c"
 var $83=($82|0); //@line 172 "../../../src/sdl/radio.c"
 var $84=($81)+($83); //@line 172 "../../../src/sdl/radio.c"
 var $85=($84)+(2); //@line 172 "../../../src/sdl/radio.c"
 var $86=(($85)&-1); //@line 172 "../../../src/sdl/radio.c"
 var $87=$2; //@line 172 "../../../src/sdl/radio.c"
 var $88=(($87+8)|0); //@line 172 "../../../src/sdl/radio.c"
 var $89=HEAPF32[(($88)>>2)]; //@line 172 "../../../src/sdl/radio.c"
 var $90=(($89)&-1); //@line 172 "../../../src/sdl/radio.c"
 _draw_surface($75,$78,$86,$90,0); //@line 172 "../../../src/sdl/radio.c"
 STACKTOP=sp;return; //@line 173 "../../../src/sdl/radio.c"
}


function _utiliser_event_groupe_radio($groupe,$event){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $event; $event=STACKTOP;STACKTOP = (STACKTOP + 48)|0;(assert((STACKTOP|0) < (STACK_MAX|0))|0);(_memcpy($event, tempParam, 48)|0);
 var $1;
 var $i;
 var $radio;
 var $etait_coche;
 $1=$groupe;
 $i=0; //@line 119 "../../../src/sdl/radio.c"
  //@line 119 "../../../src/sdl/radio.c"
 while(1) {
  var $3=$i; //@line 119 "../../../src/sdl/radio.c"
  var $4=$1; //@line 119 "../../../src/sdl/radio.c"
  var $5=(($4)|0); //@line 119 "../../../src/sdl/radio.c"
  var $6=HEAP32[(($5)>>2)]; //@line 119 "../../../src/sdl/radio.c"
  var $7=($3|0)<($6|0); //@line 119 "../../../src/sdl/radio.c"
   //@line 119 "../../../src/sdl/radio.c"
  if (!($7)) {
   break;
  }
  var $9=$i; //@line 120 "../../../src/sdl/radio.c"
  var $10=$1; //@line 120 "../../../src/sdl/radio.c"
  var $11=(($10+8)|0); //@line 120 "../../../src/sdl/radio.c"
  var $12=HEAP32[(($11)>>2)]; //@line 120 "../../../src/sdl/radio.c"
  var $13=(($12+($9<<2))|0); //@line 120 "../../../src/sdl/radio.c"
  var $14=HEAP32[(($13)>>2)]; //@line 120 "../../../src/sdl/radio.c"
  $radio=$14; //@line 120 "../../../src/sdl/radio.c"
  var $15=$radio; //@line 121 "../../../src/sdl/radio.c"
  var $16=(($15+24)|0); //@line 121 "../../../src/sdl/radio.c"
  var $17=HEAP8[($16)]; //@line 121 "../../../src/sdl/radio.c"
  var $18=(($17)&1); //@line 121 "../../../src/sdl/radio.c"
  var $19=($18&1); //@line 121 "../../../src/sdl/radio.c"
  $etait_coche=$19; //@line 121 "../../../src/sdl/radio.c"
  var $20=$radio; //@line 122 "../../../src/sdl/radio.c"
  _utiliser_event_radio($20,$event); //@line 122 "../../../src/sdl/radio.c"
  var $21=$etait_coche; //@line 123 "../../../src/sdl/radio.c"
  var $22=(($21)&1); //@line 123 "../../../src/sdl/radio.c"
   //@line 123 "../../../src/sdl/radio.c"
  do {
   if (!($22)) {
    var $24=$radio; //@line 123 "../../../src/sdl/radio.c"
    var $25=(($24+24)|0); //@line 123 "../../../src/sdl/radio.c"
    var $26=HEAP8[($25)]; //@line 123 "../../../src/sdl/radio.c"
    var $27=(($26)&1); //@line 123 "../../../src/sdl/radio.c"
     //@line 123 "../../../src/sdl/radio.c"
    if (!($27)) {
     break;
    }
    var $29=$1; //@line 124 "../../../src/sdl/radio.c"
    var $30=(($29+12)|0); //@line 124 "../../../src/sdl/radio.c"
    var $31=HEAP32[(($30)>>2)]; //@line 124 "../../../src/sdl/radio.c"
    var $32=($31|0)!=-1; //@line 124 "../../../src/sdl/radio.c"
     //@line 124 "../../../src/sdl/radio.c"
    if ($32) {
     var $34=$1; //@line 125 "../../../src/sdl/radio.c"
     var $35=(($34+12)|0); //@line 125 "../../../src/sdl/radio.c"
     var $36=HEAP32[(($35)>>2)]; //@line 125 "../../../src/sdl/radio.c"
     var $37=$1; //@line 125 "../../../src/sdl/radio.c"
     var $38=(($37+8)|0); //@line 125 "../../../src/sdl/radio.c"
     var $39=HEAP32[(($38)>>2)]; //@line 125 "../../../src/sdl/radio.c"
     var $40=(($39+($36<<2))|0); //@line 125 "../../../src/sdl/radio.c"
     var $41=HEAP32[(($40)>>2)]; //@line 125 "../../../src/sdl/radio.c"
     var $42=(($41+24)|0); //@line 125 "../../../src/sdl/radio.c"
     HEAP8[($42)]=0; //@line 125 "../../../src/sdl/radio.c"
      //@line 125 "../../../src/sdl/radio.c"
    }
    var $44=$i; //@line 126 "../../../src/sdl/radio.c"
    var $45=$1; //@line 126 "../../../src/sdl/radio.c"
    var $46=(($45+12)|0); //@line 126 "../../../src/sdl/radio.c"
    HEAP32[(($46)>>2)]=$44; //@line 126 "../../../src/sdl/radio.c"
    var $47=$1; //@line 127 "../../../src/sdl/radio.c"
    var $48=(($47+20)|0); //@line 127 "../../../src/sdl/radio.c"
    var $49=HEAP32[(($48)>>2)]; //@line 127 "../../../src/sdl/radio.c"
    var $50=($49|0)!=0; //@line 127 "../../../src/sdl/radio.c"
     //@line 127 "../../../src/sdl/radio.c"
    if ($50) {
     var $52=$1; //@line 128 "../../../src/sdl/radio.c"
     var $53=(($52+20)|0); //@line 128 "../../../src/sdl/radio.c"
     var $54=HEAP32[(($53)>>2)]; //@line 128 "../../../src/sdl/radio.c"
     var $55=$1; //@line 128 "../../../src/sdl/radio.c"
     var $56=$1; //@line 128 "../../../src/sdl/radio.c"
     var $57=(($56+24)|0); //@line 128 "../../../src/sdl/radio.c"
     var $58=HEAP32[(($57)>>2)]; //@line 128 "../../../src/sdl/radio.c"
     FUNCTION_TABLE[$54]($55,$58); //@line 128 "../../../src/sdl/radio.c"
      //@line 129 "../../../src/sdl/radio.c"
    }
     //@line 130 "../../../src/sdl/radio.c"
   }
  } while(0);
   //@line 131 "../../../src/sdl/radio.c"
  var $62=$i; //@line 119 "../../../src/sdl/radio.c"
  var $63=((($62)+(1))|0); //@line 119 "../../../src/sdl/radio.c"
  $i=$63; //@line 119 "../../../src/sdl/radio.c"
   //@line 119 "../../../src/sdl/radio.c"
 }
 STACKTOP=sp;return; //@line 132 "../../../src/sdl/radio.c"
}


function _utiliser_event_radio($radio,$event){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $event; $event=STACKTOP;STACKTOP = (STACKTOP + 48)|0;(assert((STACKTOP|0) < (STACK_MAX|0))|0);(_memcpy($event, tempParam, 48)|0);
 var $1;
 var $w;
 $1=$radio;
 var $2=$1; //@line 177 "../../../src/sdl/radio.c"
 var $3=(($2)|0); //@line 177 "../../../src/sdl/radio.c"
 var $4=HEAP32[(($3)>>2)]; //@line 177 "../../../src/sdl/radio.c"
 var $5=(($4+12)|0); //@line 177 "../../../src/sdl/radio.c"
 var $6=HEAP32[(($5)>>2)]; //@line 177 "../../../src/sdl/radio.c"
 $w=$6; //@line 177 "../../../src/sdl/radio.c"
 var $7=$event; //@line 181 "../../../src/sdl/radio.c"
 var $8=HEAP32[(($7)>>2)]; //@line 181 "../../../src/sdl/radio.c"
 var $9=($8|0)==1025; //@line 181 "../../../src/sdl/radio.c"
  //@line 181 "../../../src/sdl/radio.c"
 if ($9) {
  var $11=$1; //@line 182 "../../../src/sdl/radio.c"
  var $12=(($11+4)|0); //@line 182 "../../../src/sdl/radio.c"
  var $13=HEAPF32[(($12)>>2)]; //@line 182 "../../../src/sdl/radio.c"
  var $14=$event; //@line 182 "../../../src/sdl/radio.c"
  var $15=(($14+12)|0); //@line 182 "../../../src/sdl/radio.c"
  var $16=HEAP32[(($15)>>2)]; //@line 182 "../../../src/sdl/radio.c"
  var $17=($16|0); //@line 182 "../../../src/sdl/radio.c"
  var $18=$13<$17; //@line 182 "../../../src/sdl/radio.c"
   //@line 182 "../../../src/sdl/radio.c"
  do {
   if ($18) {
    var $20=$event; //@line 182 "../../../src/sdl/radio.c"
    var $21=(($20+12)|0); //@line 182 "../../../src/sdl/radio.c"
    var $22=HEAP32[(($21)>>2)]; //@line 182 "../../../src/sdl/radio.c"
    var $23=($22|0); //@line 182 "../../../src/sdl/radio.c"
    var $24=$1; //@line 182 "../../../src/sdl/radio.c"
    var $25=(($24+4)|0); //@line 182 "../../../src/sdl/radio.c"
    var $26=HEAPF32[(($25)>>2)]; //@line 182 "../../../src/sdl/radio.c"
    var $27=$w; //@line 182 "../../../src/sdl/radio.c"
    var $28=($27|0); //@line 182 "../../../src/sdl/radio.c"
    var $29=($26)+($28); //@line 182 "../../../src/sdl/radio.c"
    var $30=$23<$29; //@line 182 "../../../src/sdl/radio.c"
     //@line 182 "../../../src/sdl/radio.c"
    if (!($30)) {
     break;
    }
    var $32=$1; //@line 182 "../../../src/sdl/radio.c"
    var $33=(($32+8)|0); //@line 182 "../../../src/sdl/radio.c"
    var $34=HEAPF32[(($33)>>2)]; //@line 182 "../../../src/sdl/radio.c"
    var $35=$event; //@line 182 "../../../src/sdl/radio.c"
    var $36=(($35+16)|0); //@line 182 "../../../src/sdl/radio.c"
    var $37=HEAP32[(($36)>>2)]; //@line 182 "../../../src/sdl/radio.c"
    var $38=($37|0); //@line 182 "../../../src/sdl/radio.c"
    var $39=$34<$38; //@line 182 "../../../src/sdl/radio.c"
     //@line 182 "../../../src/sdl/radio.c"
    if (!($39)) {
     break;
    }
    var $41=$event; //@line 182 "../../../src/sdl/radio.c"
    var $42=(($41+16)|0); //@line 182 "../../../src/sdl/radio.c"
    var $43=HEAP32[(($42)>>2)]; //@line 182 "../../../src/sdl/radio.c"
    var $44=($43|0); //@line 182 "../../../src/sdl/radio.c"
    var $45=$1; //@line 182 "../../../src/sdl/radio.c"
    var $46=(($45+8)|0); //@line 182 "../../../src/sdl/radio.c"
    var $47=HEAPF32[(($46)>>2)]; //@line 182 "../../../src/sdl/radio.c"
    var $48=$w; //@line 182 "../../../src/sdl/radio.c"
    var $49=($48|0); //@line 182 "../../../src/sdl/radio.c"
    var $50=($47)+($49); //@line 182 "../../../src/sdl/radio.c"
    var $51=$44<$50; //@line 182 "../../../src/sdl/radio.c"
     //@line 182 "../../../src/sdl/radio.c"
    if (!($51)) {
     break;
    }
    var $53=$event; //@line 183 "../../../src/sdl/radio.c"
    var $54=(($53+8)|0); //@line 183 "../../../src/sdl/radio.c"
    var $55=HEAP8[($54)]; //@line 183 "../../../src/sdl/radio.c"
    var $56=($55&255); //@line 183 "../../../src/sdl/radio.c"
    var $57=($56|0)==1; //@line 183 "../../../src/sdl/radio.c"
     //@line 183 "../../../src/sdl/radio.c"
    if ($57) {
     var $59=$1; //@line 184 "../../../src/sdl/radio.c"
     var $60=(($59+24)|0); //@line 184 "../../../src/sdl/radio.c"
     HEAP8[($60)]=1; //@line 184 "../../../src/sdl/radio.c"
      //@line 185 "../../../src/sdl/radio.c"
    }
     //@line 186 "../../../src/sdl/radio.c"
   }
  } while(0);
   //@line 187 "../../../src/sdl/radio.c"
  STACKTOP=sp;return; //@line 195 "../../../src/sdl/radio.c"
 }
 var $64=$event; //@line 187 "../../../src/sdl/radio.c"
 var $65=HEAP32[(($64)>>2)]; //@line 187 "../../../src/sdl/radio.c"
 var $66=($65|0)==1024; //@line 187 "../../../src/sdl/radio.c"
  //@line 187 "../../../src/sdl/radio.c"
 if ($66) {
  var $68=$1; //@line 188 "../../../src/sdl/radio.c"
  var $69=(($68+4)|0); //@line 188 "../../../src/sdl/radio.c"
  var $70=HEAPF32[(($69)>>2)]; //@line 188 "../../../src/sdl/radio.c"
  var $71=$event; //@line 188 "../../../src/sdl/radio.c"
  var $72=(($71+12)|0); //@line 188 "../../../src/sdl/radio.c"
  var $73=HEAP32[(($72)>>2)]; //@line 188 "../../../src/sdl/radio.c"
  var $74=($73|0); //@line 188 "../../../src/sdl/radio.c"
  var $75=$70<$74; //@line 188 "../../../src/sdl/radio.c"
   //@line 188 "../../../src/sdl/radio.c"
  do {
   if ($75) {
    var $77=$event; //@line 188 "../../../src/sdl/radio.c"
    var $78=(($77+12)|0); //@line 188 "../../../src/sdl/radio.c"
    var $79=HEAP32[(($78)>>2)]; //@line 188 "../../../src/sdl/radio.c"
    var $80=($79|0); //@line 188 "../../../src/sdl/radio.c"
    var $81=$1; //@line 188 "../../../src/sdl/radio.c"
    var $82=(($81+4)|0); //@line 188 "../../../src/sdl/radio.c"
    var $83=HEAPF32[(($82)>>2)]; //@line 188 "../../../src/sdl/radio.c"
    var $84=$w; //@line 188 "../../../src/sdl/radio.c"
    var $85=($84|0); //@line 188 "../../../src/sdl/radio.c"
    var $86=($83)+($85); //@line 188 "../../../src/sdl/radio.c"
    var $87=$80<$86; //@line 188 "../../../src/sdl/radio.c"
     //@line 188 "../../../src/sdl/radio.c"
    if (!($87)) {
     label = 16;
     break;
    }
    var $89=$1; //@line 188 "../../../src/sdl/radio.c"
    var $90=(($89+8)|0); //@line 188 "../../../src/sdl/radio.c"
    var $91=HEAPF32[(($90)>>2)]; //@line 188 "../../../src/sdl/radio.c"
    var $92=$event; //@line 188 "../../../src/sdl/radio.c"
    var $93=(($92+16)|0); //@line 188 "../../../src/sdl/radio.c"
    var $94=HEAP32[(($93)>>2)]; //@line 188 "../../../src/sdl/radio.c"
    var $95=($94|0); //@line 188 "../../../src/sdl/radio.c"
    var $96=$91<$95; //@line 188 "../../../src/sdl/radio.c"
     //@line 188 "../../../src/sdl/radio.c"
    if (!($96)) {
     label = 16;
     break;
    }
    var $98=$event; //@line 188 "../../../src/sdl/radio.c"
    var $99=(($98+16)|0); //@line 188 "../../../src/sdl/radio.c"
    var $100=HEAP32[(($99)>>2)]; //@line 188 "../../../src/sdl/radio.c"
    var $101=($100|0); //@line 188 "../../../src/sdl/radio.c"
    var $102=$1; //@line 188 "../../../src/sdl/radio.c"
    var $103=(($102+8)|0); //@line 188 "../../../src/sdl/radio.c"
    var $104=HEAPF32[(($103)>>2)]; //@line 188 "../../../src/sdl/radio.c"
    var $105=$w; //@line 188 "../../../src/sdl/radio.c"
    var $106=($105|0); //@line 188 "../../../src/sdl/radio.c"
    var $107=($104)+($106); //@line 188 "../../../src/sdl/radio.c"
    var $108=$101<$107; //@line 188 "../../../src/sdl/radio.c"
     //@line 188 "../../../src/sdl/radio.c"
    if (!($108)) {
     label = 16;
     break;
    }
    var $110=$1; //@line 189 "../../../src/sdl/radio.c"
    var $111=(($110+25)|0); //@line 189 "../../../src/sdl/radio.c"
    HEAP8[($111)]=1; //@line 189 "../../../src/sdl/radio.c"
     //@line 190 "../../../src/sdl/radio.c"
   } else {
    label = 16;
   }
  } while(0);
  if (label == 16) {
   var $113=$1; //@line 191 "../../../src/sdl/radio.c"
   var $114=(($113+25)|0); //@line 191 "../../../src/sdl/radio.c"
   HEAP8[($114)]=0; //@line 191 "../../../src/sdl/radio.c"
  }
   //@line 193 "../../../src/sdl/radio.c"
 }
 STACKTOP=sp;return; //@line 195 "../../../src/sdl/radio.c"
}


function _creer_textinput($x,$y,$w,$h,$taillemax){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $4;
 var $5;
 var $textinput;
 var $6=sp;
 $1=$x;
 $2=$y;
 $3=$w;
 $4=$h;
 $5=$taillemax;
 var $7=_gosh_alloc_size(48); //@line 35 "../../../src/sdl/textinput.c"
 var $8=$7; //@line 35 "../../../src/sdl/textinput.c"
 $textinput=$8; //@line 35 "../../../src/sdl/textinput.c"
 var $9=$textinput; //@line 36 "../../../src/sdl/textinput.c"
 var $10=(($9)|0); //@line 36 "../../../src/sdl/textinput.c"
 HEAP32[(($10)>>2)]=0; //@line 36 "../../../src/sdl/textinput.c"
 var $11=$1; //@line 37 "../../../src/sdl/textinput.c"
 var $12=$textinput; //@line 37 "../../../src/sdl/textinput.c"
 var $13=(($12+16)|0); //@line 37 "../../../src/sdl/textinput.c"
 HEAP32[(($13)>>2)]=$11; //@line 37 "../../../src/sdl/textinput.c"
 var $14=$2; //@line 38 "../../../src/sdl/textinput.c"
 var $15=$textinput; //@line 38 "../../../src/sdl/textinput.c"
 var $16=(($15+20)|0); //@line 38 "../../../src/sdl/textinput.c"
 HEAP32[(($16)>>2)]=$14; //@line 38 "../../../src/sdl/textinput.c"
 var $17=$3; //@line 39 "../../../src/sdl/textinput.c"
 var $18=$textinput; //@line 39 "../../../src/sdl/textinput.c"
 var $19=(($18+24)|0); //@line 39 "../../../src/sdl/textinput.c"
 HEAP32[(($19)>>2)]=$17; //@line 39 "../../../src/sdl/textinput.c"
 var $20=$4; //@line 40 "../../../src/sdl/textinput.c"
 var $21=$textinput; //@line 40 "../../../src/sdl/textinput.c"
 var $22=(($21+28)|0); //@line 40 "../../../src/sdl/textinput.c"
 HEAP32[(($22)>>2)]=$20; //@line 40 "../../../src/sdl/textinput.c"
 var $23=$5; //@line 41 "../../../src/sdl/textinput.c"
 var $24=$textinput; //@line 41 "../../../src/sdl/textinput.c"
 var $25=(($24+4)|0); //@line 41 "../../../src/sdl/textinput.c"
 HEAP32[(($25)>>2)]=$23; //@line 41 "../../../src/sdl/textinput.c"
 var $26=$5; //@line 42 "../../../src/sdl/textinput.c"
 var $27=$26; //@line 42 "../../../src/sdl/textinput.c"
 var $28=_gosh_alloc_size($27); //@line 42 "../../../src/sdl/textinput.c"
 var $29=$textinput; //@line 42 "../../../src/sdl/textinput.c"
 var $30=(($29+12)|0); //@line 42 "../../../src/sdl/textinput.c"
 HEAP32[(($30)>>2)]=$28; //@line 42 "../../../src/sdl/textinput.c"
 var $31=$textinput; //@line 43 "../../../src/sdl/textinput.c"
 var $32=(($31+8)|0); //@line 43 "../../../src/sdl/textinput.c"
 HEAP32[(($32)>>2)]=0; //@line 43 "../../../src/sdl/textinput.c"
 var $33=$textinput; //@line 44 "../../../src/sdl/textinput.c"
 var $34=(($33+40)|0); //@line 44 "../../../src/sdl/textinput.c"
 HEAPF64[(($34)>>3)]=0; //@line 44 "../../../src/sdl/textinput.c"
 var $35=$textinput; //@line 45 "../../../src/sdl/textinput.c"
 var $36=(($35+32)|0); //@line 45 "../../../src/sdl/textinput.c"
 _get_color($6); //@line 45 "../../../src/sdl/textinput.c"
 var $37=$36; //@line 45 "../../../src/sdl/textinput.c"
 var $38=$6; //@line 45 "../../../src/sdl/textinput.c"
 assert(4 % 1 === 0);HEAP8[($37)]=HEAP8[($38)];HEAP8[((($37)+(1))|0)]=HEAP8[((($38)+(1))|0)];HEAP8[((($37)+(2))|0)]=HEAP8[((($38)+(2))|0)];HEAP8[((($37)+(3))|0)]=HEAP8[((($38)+(3))|0)]; //@line 45 "../../../src/sdl/textinput.c"
 var $39=$textinput; //@line 46 "../../../src/sdl/textinput.c"
 var $40=(($39+36)|0); //@line 46 "../../../src/sdl/textinput.c"
 HEAP8[($40)]=0; //@line 46 "../../../src/sdl/textinput.c"
 var $41=$textinput; //@line 47 "../../../src/sdl/textinput.c"
 var $42=(($41+37)|0); //@line 47 "../../../src/sdl/textinput.c"
 HEAP8[($42)]=0; //@line 47 "../../../src/sdl/textinput.c"
 var $43=$textinput; //@line 48 "../../../src/sdl/textinput.c"
 STACKTOP=sp;return $43; //@line 48 "../../../src/sdl/textinput.c"
}


function _afficher_textinput($on,$ti){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $border;
 var $freq;
 var $blink;
 var $border1;
 var $pitch;
 $1=$on;
 $2=$ti;
 var $3=$2; //@line 53 "../../../src/sdl/textinput.c"
 var $4=(($3+36)|0); //@line 53 "../../../src/sdl/textinput.c"
 var $5=HEAP8[($4)]; //@line 53 "../../../src/sdl/textinput.c"
 var $6=(($5)&1); //@line 53 "../../../src/sdl/textinput.c"
  //@line 53 "../../../src/sdl/textinput.c"
 if ($6) {
  var $8=$2; //@line 54 "../../../src/sdl/textinput.c"
  var $9=(($8+32)|0); //@line 54 "../../../src/sdl/textinput.c"
  var $10=(($9)|0); //@line 54 "../../../src/sdl/textinput.c"
  var $11=HEAP8[($10)]; //@line 54 "../../../src/sdl/textinput.c"
  var $12=($11&255); //@line 54 "../../../src/sdl/textinput.c"
  var $13=(((($12|0))/(2))&-1); //@line 54 "../../../src/sdl/textinput.c"
  var $14=$2; //@line 54 "../../../src/sdl/textinput.c"
  var $15=(($14+32)|0); //@line 54 "../../../src/sdl/textinput.c"
  var $16=(($15+1)|0); //@line 54 "../../../src/sdl/textinput.c"
  var $17=HEAP8[($16)]; //@line 54 "../../../src/sdl/textinput.c"
  var $18=($17&255); //@line 54 "../../../src/sdl/textinput.c"
  var $19=(((($18|0))/(2))&-1); //@line 54 "../../../src/sdl/textinput.c"
  var $20=$2; //@line 54 "../../../src/sdl/textinput.c"
  var $21=(($20+32)|0); //@line 54 "../../../src/sdl/textinput.c"
  var $22=(($21+2)|0); //@line 54 "../../../src/sdl/textinput.c"
  var $23=HEAP8[($22)]; //@line 54 "../../../src/sdl/textinput.c"
  var $24=($23&255); //@line 54 "../../../src/sdl/textinput.c"
  var $25=(((($24|0))/(2))&-1); //@line 54 "../../../src/sdl/textinput.c"
  _set_color($13,$19,$25); //@line 54 "../../../src/sdl/textinput.c"
   //@line 55 "../../../src/sdl/textinput.c"
 } else {
  var $27=$2; //@line 56 "../../../src/sdl/textinput.c"
  var $28=(($27+32)|0); //@line 56 "../../../src/sdl/textinput.c"
  var $29=(($28)|0); //@line 56 "../../../src/sdl/textinput.c"
  var $30=HEAP8[($29)]; //@line 56 "../../../src/sdl/textinput.c"
  var $31=($30&255); //@line 56 "../../../src/sdl/textinput.c"
  var $32=($31<<1); //@line 56 "../../../src/sdl/textinput.c"
  var $33=255<($32|0); //@line 56 "../../../src/sdl/textinput.c"
   //@line 56 "../../../src/sdl/textinput.c"
  if ($33) {
    //@line 56 "../../../src/sdl/textinput.c"
   var $43=255;
  } else {
   var $36=$2; //@line 56 "../../../src/sdl/textinput.c"
   var $37=(($36+32)|0); //@line 56 "../../../src/sdl/textinput.c"
   var $38=(($37)|0); //@line 56 "../../../src/sdl/textinput.c"
   var $39=HEAP8[($38)]; //@line 56 "../../../src/sdl/textinput.c"
   var $40=($39&255); //@line 56 "../../../src/sdl/textinput.c"
   var $41=($40<<1); //@line 56 "../../../src/sdl/textinput.c"
    //@line 56 "../../../src/sdl/textinput.c"
   var $43=$41;
  }
  var $43; //@line 56 "../../../src/sdl/textinput.c"
  var $44=$2; //@line 56 "../../../src/sdl/textinput.c"
  var $45=(($44+32)|0); //@line 56 "../../../src/sdl/textinput.c"
  var $46=(($45+1)|0); //@line 56 "../../../src/sdl/textinput.c"
  var $47=HEAP8[($46)]; //@line 56 "../../../src/sdl/textinput.c"
  var $48=($47&255); //@line 56 "../../../src/sdl/textinput.c"
  var $49=($48<<1); //@line 56 "../../../src/sdl/textinput.c"
  var $50=255<($49|0); //@line 56 "../../../src/sdl/textinput.c"
   //@line 56 "../../../src/sdl/textinput.c"
  if ($50) {
    //@line 56 "../../../src/sdl/textinput.c"
   var $60=255;
  } else {
   var $53=$2; //@line 56 "../../../src/sdl/textinput.c"
   var $54=(($53+32)|0); //@line 56 "../../../src/sdl/textinput.c"
   var $55=(($54+1)|0); //@line 56 "../../../src/sdl/textinput.c"
   var $56=HEAP8[($55)]; //@line 56 "../../../src/sdl/textinput.c"
   var $57=($56&255); //@line 56 "../../../src/sdl/textinput.c"
   var $58=($57<<1); //@line 56 "../../../src/sdl/textinput.c"
    //@line 56 "../../../src/sdl/textinput.c"
   var $60=$58;
  }
  var $60; //@line 56 "../../../src/sdl/textinput.c"
  var $61=$2; //@line 56 "../../../src/sdl/textinput.c"
  var $62=(($61+32)|0); //@line 56 "../../../src/sdl/textinput.c"
  var $63=(($62+2)|0); //@line 56 "../../../src/sdl/textinput.c"
  var $64=HEAP8[($63)]; //@line 56 "../../../src/sdl/textinput.c"
  var $65=($64&255); //@line 56 "../../../src/sdl/textinput.c"
  var $66=($65<<1); //@line 56 "../../../src/sdl/textinput.c"
  var $67=255<($66|0); //@line 56 "../../../src/sdl/textinput.c"
   //@line 56 "../../../src/sdl/textinput.c"
  if ($67) {
    //@line 56 "../../../src/sdl/textinput.c"
   var $77=255;
  } else {
   var $70=$2; //@line 56 "../../../src/sdl/textinput.c"
   var $71=(($70+32)|0); //@line 56 "../../../src/sdl/textinput.c"
   var $72=(($71+2)|0); //@line 56 "../../../src/sdl/textinput.c"
   var $73=HEAP8[($72)]; //@line 56 "../../../src/sdl/textinput.c"
   var $74=($73&255); //@line 56 "../../../src/sdl/textinput.c"
   var $75=($74<<1); //@line 56 "../../../src/sdl/textinput.c"
    //@line 56 "../../../src/sdl/textinput.c"
   var $77=$75;
  }
  var $77; //@line 56 "../../../src/sdl/textinput.c"
  _set_color($43,$60,$77); //@line 56 "../../../src/sdl/textinput.c"
 }
 var $79=$1; //@line 60 "../../../src/sdl/textinput.c"
 var $80=$2; //@line 60 "../../../src/sdl/textinput.c"
 var $81=(($80+16)|0); //@line 60 "../../../src/sdl/textinput.c"
 var $82=HEAP32[(($81)>>2)]; //@line 60 "../../../src/sdl/textinput.c"
 var $83=$2; //@line 60 "../../../src/sdl/textinput.c"
 var $84=(($83+20)|0); //@line 60 "../../../src/sdl/textinput.c"
 var $85=HEAP32[(($84)>>2)]; //@line 60 "../../../src/sdl/textinput.c"
 var $86=$2; //@line 60 "../../../src/sdl/textinput.c"
 var $87=(($86+24)|0); //@line 60 "../../../src/sdl/textinput.c"
 var $88=HEAP32[(($87)>>2)]; //@line 60 "../../../src/sdl/textinput.c"
 var $89=$2; //@line 60 "../../../src/sdl/textinput.c"
 var $90=(($89+28)|0); //@line 60 "../../../src/sdl/textinput.c"
 var $91=HEAP32[(($90)>>2)]; //@line 60 "../../../src/sdl/textinput.c"
 _draw_rect($79,$82,$85,$88,$91); //@line 60 "../../../src/sdl/textinput.c"
 var $92=$2; //@line 62 "../../../src/sdl/textinput.c"
 var $93=(($92+32)|0); //@line 62 "../../../src/sdl/textinput.c"
 var $94=(($93)|0); //@line 62 "../../../src/sdl/textinput.c"
 var $95=HEAP8[($94)]; //@line 62 "../../../src/sdl/textinput.c"
 var $96=($95&255); //@line 62 "../../../src/sdl/textinput.c"
 var $97=$2; //@line 62 "../../../src/sdl/textinput.c"
 var $98=(($97+32)|0); //@line 62 "../../../src/sdl/textinput.c"
 var $99=(($98+1)|0); //@line 62 "../../../src/sdl/textinput.c"
 var $100=HEAP8[($99)]; //@line 62 "../../../src/sdl/textinput.c"
 var $101=($100&255); //@line 62 "../../../src/sdl/textinput.c"
 var $102=$2; //@line 62 "../../../src/sdl/textinput.c"
 var $103=(($102+32)|0); //@line 62 "../../../src/sdl/textinput.c"
 var $104=(($103+2)|0); //@line 62 "../../../src/sdl/textinput.c"
 var $105=HEAP8[($104)]; //@line 62 "../../../src/sdl/textinput.c"
 var $106=($105&255); //@line 62 "../../../src/sdl/textinput.c"
 _set_color($96,$101,$106); //@line 62 "../../../src/sdl/textinput.c"
 $border=2; //@line 63 "../../../src/sdl/textinput.c"
 var $107=$1; //@line 64 "../../../src/sdl/textinput.c"
 var $108=$2; //@line 64 "../../../src/sdl/textinput.c"
 var $109=(($108+16)|0); //@line 64 "../../../src/sdl/textinput.c"
 var $110=HEAP32[(($109)>>2)]; //@line 64 "../../../src/sdl/textinput.c"
 var $111=$border; //@line 64 "../../../src/sdl/textinput.c"
 var $112=((($110)+($111))|0); //@line 64 "../../../src/sdl/textinput.c"
 var $113=$2; //@line 64 "../../../src/sdl/textinput.c"
 var $114=(($113+20)|0); //@line 64 "../../../src/sdl/textinput.c"
 var $115=HEAP32[(($114)>>2)]; //@line 64 "../../../src/sdl/textinput.c"
 var $116=$border; //@line 64 "../../../src/sdl/textinput.c"
 var $117=((($115)+($116))|0); //@line 64 "../../../src/sdl/textinput.c"
 var $118=$2; //@line 64 "../../../src/sdl/textinput.c"
 var $119=(($118+24)|0); //@line 64 "../../../src/sdl/textinput.c"
 var $120=HEAP32[(($119)>>2)]; //@line 64 "../../../src/sdl/textinput.c"
 var $121=$border; //@line 64 "../../../src/sdl/textinput.c"
 var $122=($121<<1); //@line 64 "../../../src/sdl/textinput.c"
 var $123=((($120)-($122))|0); //@line 64 "../../../src/sdl/textinput.c"
 var $124=$2; //@line 64 "../../../src/sdl/textinput.c"
 var $125=(($124+28)|0); //@line 64 "../../../src/sdl/textinput.c"
 var $126=HEAP32[(($125)>>2)]; //@line 64 "../../../src/sdl/textinput.c"
 var $127=$border; //@line 64 "../../../src/sdl/textinput.c"
 var $128=($127<<1); //@line 64 "../../../src/sdl/textinput.c"
 var $129=((($126)-($128))|0); //@line 64 "../../../src/sdl/textinput.c"
 _draw_rect($107,$112,$117,$123,$129); //@line 64 "../../../src/sdl/textinput.c"
 var $130=$2; //@line 66 "../../../src/sdl/textinput.c"
 var $131=(($130+37)|0); //@line 66 "../../../src/sdl/textinput.c"
 var $132=HEAP8[($131)]; //@line 66 "../../../src/sdl/textinput.c"
 var $133=(($132)&1); //@line 66 "../../../src/sdl/textinput.c"
  //@line 66 "../../../src/sdl/textinput.c"
 if ($133) {
  $freq=2; //@line 67 "../../../src/sdl/textinput.c"
  var $135=$2; //@line 68 "../../../src/sdl/textinput.c"
  var $136=(($135+40)|0); //@line 68 "../../../src/sdl/textinput.c"
  var $137=HEAPF64[(($136)>>3)]; //@line 68 "../../../src/sdl/textinput.c"
  var $138=($137)*(1000); //@line 68 "../../../src/sdl/textinput.c"
  var $139=(($138)&-1); //@line 68 "../../../src/sdl/textinput.c"
  var $140=$freq; //@line 68 "../../../src/sdl/textinput.c"
  var $141=(1000)/($140); //@line 68 "../../../src/sdl/textinput.c"
  var $142=(($141)&-1); //@line 68 "../../../src/sdl/textinput.c"
  var $143=(((($139|0))/(($142|0)))&-1); //@line 68 "../../../src/sdl/textinput.c"
  var $144=(((($143|0))%(2))&-1); //@line 68 "../../../src/sdl/textinput.c"
  var $145=($144|0)!=0; //@line 68 "../../../src/sdl/textinput.c"
  var $146=($145&1); //@line 68 "../../../src/sdl/textinput.c"
  $blink=$146; //@line 68 "../../../src/sdl/textinput.c"
  var $147=$blink; //@line 69 "../../../src/sdl/textinput.c"
  var $148=(($147)&1); //@line 69 "../../../src/sdl/textinput.c"
   //@line 69 "../../../src/sdl/textinput.c"
  if ($148) {
   _set_color(20,20,20); //@line 70 "../../../src/sdl/textinput.c"
   $border1=2; //@line 71 "../../../src/sdl/textinput.c"
   var $150=$2; //@line 72 "../../../src/sdl/textinput.c"
   var $151=(($150+8)|0); //@line 72 "../../../src/sdl/textinput.c"
   var $152=HEAP32[(($151)>>2)]; //@line 72 "../../../src/sdl/textinput.c"
   var $153=($152|0)>0; //@line 72 "../../../src/sdl/textinput.c"
    //@line 72 "../../../src/sdl/textinput.c"
   if ($153) {
    var $155=$2; //@line 72 "../../../src/sdl/textinput.c"
    var $156=(($155)|0); //@line 72 "../../../src/sdl/textinput.c"
    var $157=HEAP32[(($156)>>2)]; //@line 72 "../../../src/sdl/textinput.c"
    var $158=(($157+8)|0); //@line 72 "../../../src/sdl/textinput.c"
    var $159=HEAP32[(($158)>>2)]; //@line 72 "../../../src/sdl/textinput.c"
    var $160=($159|0); //@line 72 "../../../src/sdl/textinput.c"
    var $161=$2; //@line 72 "../../../src/sdl/textinput.c"
    var $162=(($161+12)|0); //@line 72 "../../../src/sdl/textinput.c"
    var $163=HEAP32[(($162)>>2)]; //@line 72 "../../../src/sdl/textinput.c"
    var $164=_strlen($163); //@line 72 "../../../src/sdl/textinput.c"
    var $165=($164>>>0); //@line 72 "../../../src/sdl/textinput.c"
    var $166=($160)/($165); //@line 72 "../../../src/sdl/textinput.c"
     //@line 72 "../../../src/sdl/textinput.c"
    var $169=$166;
   } else {
     //@line 72 "../../../src/sdl/textinput.c"
    var $169=0;
   }
   var $169; //@line 72 "../../../src/sdl/textinput.c"
   $pitch=$169; //@line 72 "../../../src/sdl/textinput.c"
   var $170=$1; //@line 73 "../../../src/sdl/textinput.c"
   var $171=$2; //@line 73 "../../../src/sdl/textinput.c"
   var $172=(($171+16)|0); //@line 73 "../../../src/sdl/textinput.c"
   var $173=HEAP32[(($172)>>2)]; //@line 73 "../../../src/sdl/textinput.c"
   var $174=$border1; //@line 73 "../../../src/sdl/textinput.c"
   var $175=((($173)+($174))|0); //@line 73 "../../../src/sdl/textinput.c"
   var $176=($175|0); //@line 73 "../../../src/sdl/textinput.c"
   var $177=$2; //@line 73 "../../../src/sdl/textinput.c"
   var $178=(($177+8)|0); //@line 73 "../../../src/sdl/textinput.c"
   var $179=HEAP32[(($178)>>2)]; //@line 73 "../../../src/sdl/textinput.c"
   var $180=($179|0); //@line 73 "../../../src/sdl/textinput.c"
   var $181=$pitch; //@line 73 "../../../src/sdl/textinput.c"
   var $182=($180)*($181); //@line 73 "../../../src/sdl/textinput.c"
   var $183=($176)+($182); //@line 73 "../../../src/sdl/textinput.c"
   var $184=(($183)&-1); //@line 73 "../../../src/sdl/textinput.c"
   var $185=$2; //@line 73 "../../../src/sdl/textinput.c"
   var $186=(($185+20)|0); //@line 73 "../../../src/sdl/textinput.c"
   var $187=HEAP32[(($186)>>2)]; //@line 73 "../../../src/sdl/textinput.c"
   var $188=$border1; //@line 73 "../../../src/sdl/textinput.c"
   var $189=((($187)+($188))|0); //@line 73 "../../../src/sdl/textinput.c"
   var $190=$2; //@line 73 "../../../src/sdl/textinput.c"
   var $191=(($190+28)|0); //@line 73 "../../../src/sdl/textinput.c"
   var $192=HEAP32[(($191)>>2)]; //@line 73 "../../../src/sdl/textinput.c"
   var $193=$border1; //@line 73 "../../../src/sdl/textinput.c"
   var $194=($193<<1); //@line 73 "../../../src/sdl/textinput.c"
   var $195=((($192)-($194))|0); //@line 73 "../../../src/sdl/textinput.c"
   _draw_rect($170,$184,$189,5,$195); //@line 73 "../../../src/sdl/textinput.c"
    //@line 74 "../../../src/sdl/textinput.c"
  }
   //@line 75 "../../../src/sdl/textinput.c"
 }
 var $198=$2; //@line 76 "../../../src/sdl/textinput.c"
 var $199=(($198)|0); //@line 76 "../../../src/sdl/textinput.c"
 var $200=HEAP32[(($199)>>2)]; //@line 76 "../../../src/sdl/textinput.c"
 var $201=($200|0)!=0; //@line 76 "../../../src/sdl/textinput.c"
  //@line 76 "../../../src/sdl/textinput.c"
 if (!($201)) {
  STACKTOP=sp;return; //@line 78 "../../../src/sdl/textinput.c"
 }
 var $203=$1; //@line 77 "../../../src/sdl/textinput.c"
 var $204=$2; //@line 77 "../../../src/sdl/textinput.c"
 var $205=(($204)|0); //@line 77 "../../../src/sdl/textinput.c"
 var $206=HEAP32[(($205)>>2)]; //@line 77 "../../../src/sdl/textinput.c"
 var $207=$2; //@line 77 "../../../src/sdl/textinput.c"
 var $208=(($207+16)|0); //@line 77 "../../../src/sdl/textinput.c"
 var $209=HEAP32[(($208)>>2)]; //@line 77 "../../../src/sdl/textinput.c"
 var $210=((($209)+(1))|0); //@line 77 "../../../src/sdl/textinput.c"
 var $211=$2; //@line 77 "../../../src/sdl/textinput.c"
 var $212=(($211+20)|0); //@line 77 "../../../src/sdl/textinput.c"
 var $213=HEAP32[(($212)>>2)]; //@line 77 "../../../src/sdl/textinput.c"
 _draw_surface($203,$206,$210,$213,0); //@line 77 "../../../src/sdl/textinput.c"
  //@line 77 "../../../src/sdl/textinput.c"
 STACKTOP=sp;return; //@line 78 "../../../src/sdl/textinput.c"
}


function _mise_a_jour_textinput($ti,$dt){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 $1=$ti;
 $2=$dt;
 var $3=$2; //@line 82 "../../../src/sdl/textinput.c"
 var $4=$1; //@line 82 "../../../src/sdl/textinput.c"
 var $5=(($4+40)|0); //@line 82 "../../../src/sdl/textinput.c"
 var $6=HEAPF64[(($5)>>3)]; //@line 82 "../../../src/sdl/textinput.c"
 var $7=($6)+($3); //@line 82 "../../../src/sdl/textinput.c"
 HEAPF64[(($5)>>3)]=$7; //@line 82 "../../../src/sdl/textinput.c"
 STACKTOP=sp;return; //@line 83 "../../../src/sdl/textinput.c"
}


function _utiliser_event_textinput($ti,$event){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $event; $event=STACKTOP;STACKTOP = (STACKTOP + 48)|0;(assert((STACKTOP|0) < (STACK_MAX|0))|0);(_memcpy($event, tempParam, 48)|0);
 var $1;
 var $c;
 $1=$ti;
 var $2=$event; //@line 102 "../../../src/sdl/textinput.c"
 var $3=HEAP32[(($2)>>2)]; //@line 102 "../../../src/sdl/textinput.c"
 var $4=($3|0)==1024; //@line 102 "../../../src/sdl/textinput.c"
  //@line 102 "../../../src/sdl/textinput.c"
 if ($4) {
  var $6=$1; //@line 103 "../../../src/sdl/textinput.c"
  var $7=(($6+16)|0); //@line 103 "../../../src/sdl/textinput.c"
  var $8=HEAP32[(($7)>>2)]; //@line 103 "../../../src/sdl/textinput.c"
  var $9=$event; //@line 103 "../../../src/sdl/textinput.c"
  var $10=(($9+12)|0); //@line 103 "../../../src/sdl/textinput.c"
  var $11=HEAP32[(($10)>>2)]; //@line 103 "../../../src/sdl/textinput.c"
  var $12=($8|0)<($11|0); //@line 103 "../../../src/sdl/textinput.c"
   //@line 103 "../../../src/sdl/textinput.c"
  do {
   if ($12) {
    var $14=$event; //@line 103 "../../../src/sdl/textinput.c"
    var $15=(($14+12)|0); //@line 103 "../../../src/sdl/textinput.c"
    var $16=HEAP32[(($15)>>2)]; //@line 103 "../../../src/sdl/textinput.c"
    var $17=$1; //@line 103 "../../../src/sdl/textinput.c"
    var $18=(($17+16)|0); //@line 103 "../../../src/sdl/textinput.c"
    var $19=HEAP32[(($18)>>2)]; //@line 103 "../../../src/sdl/textinput.c"
    var $20=$1; //@line 103 "../../../src/sdl/textinput.c"
    var $21=(($20+24)|0); //@line 103 "../../../src/sdl/textinput.c"
    var $22=HEAP32[(($21)>>2)]; //@line 103 "../../../src/sdl/textinput.c"
    var $23=((($19)+($22))|0); //@line 103 "../../../src/sdl/textinput.c"
    var $24=($16|0)<($23|0); //@line 103 "../../../src/sdl/textinput.c"
     //@line 103 "../../../src/sdl/textinput.c"
    if (!($24)) {
     label = 7;
     break;
    }
    var $26=$1; //@line 103 "../../../src/sdl/textinput.c"
    var $27=(($26+20)|0); //@line 103 "../../../src/sdl/textinput.c"
    var $28=HEAP32[(($27)>>2)]; //@line 103 "../../../src/sdl/textinput.c"
    var $29=$event; //@line 103 "../../../src/sdl/textinput.c"
    var $30=(($29+16)|0); //@line 103 "../../../src/sdl/textinput.c"
    var $31=HEAP32[(($30)>>2)]; //@line 103 "../../../src/sdl/textinput.c"
    var $32=($28|0)<($31|0); //@line 103 "../../../src/sdl/textinput.c"
     //@line 103 "../../../src/sdl/textinput.c"
    if (!($32)) {
     label = 7;
     break;
    }
    var $34=$event; //@line 103 "../../../src/sdl/textinput.c"
    var $35=(($34+16)|0); //@line 103 "../../../src/sdl/textinput.c"
    var $36=HEAP32[(($35)>>2)]; //@line 103 "../../../src/sdl/textinput.c"
    var $37=$1; //@line 103 "../../../src/sdl/textinput.c"
    var $38=(($37+20)|0); //@line 103 "../../../src/sdl/textinput.c"
    var $39=HEAP32[(($38)>>2)]; //@line 103 "../../../src/sdl/textinput.c"
    var $40=$1; //@line 103 "../../../src/sdl/textinput.c"
    var $41=(($40+28)|0); //@line 103 "../../../src/sdl/textinput.c"
    var $42=HEAP32[(($41)>>2)]; //@line 103 "../../../src/sdl/textinput.c"
    var $43=((($39)+($42))|0); //@line 103 "../../../src/sdl/textinput.c"
    var $44=($36|0)<($43|0); //@line 103 "../../../src/sdl/textinput.c"
     //@line 103 "../../../src/sdl/textinput.c"
    if (!($44)) {
     label = 7;
     break;
    }
    var $46=$1; //@line 104 "../../../src/sdl/textinput.c"
    var $47=(($46+36)|0); //@line 104 "../../../src/sdl/textinput.c"
    HEAP8[($47)]=1; //@line 104 "../../../src/sdl/textinput.c"
     //@line 105 "../../../src/sdl/textinput.c"
   } else {
    label = 7;
   }
  } while(0);
  if (label == 7) {
   var $49=$1; //@line 106 "../../../src/sdl/textinput.c"
   var $50=(($49+36)|0); //@line 106 "../../../src/sdl/textinput.c"
   HEAP8[($50)]=0; //@line 106 "../../../src/sdl/textinput.c"
  }
   //@line 108 "../../../src/sdl/textinput.c"
  STACKTOP=sp;return; //@line 136 "../../../src/sdl/textinput.c"
 }
 var $53=$event; //@line 108 "../../../src/sdl/textinput.c"
 var $54=HEAP32[(($53)>>2)]; //@line 108 "../../../src/sdl/textinput.c"
 var $55=($54|0)==1025; //@line 108 "../../../src/sdl/textinput.c"
  //@line 108 "../../../src/sdl/textinput.c"
 if ($55) {
  var $57=$1; //@line 109 "../../../src/sdl/textinput.c"
  var $58=(($57+16)|0); //@line 109 "../../../src/sdl/textinput.c"
  var $59=HEAP32[(($58)>>2)]; //@line 109 "../../../src/sdl/textinput.c"
  var $60=$event; //@line 109 "../../../src/sdl/textinput.c"
  var $61=(($60+12)|0); //@line 109 "../../../src/sdl/textinput.c"
  var $62=HEAP32[(($61)>>2)]; //@line 109 "../../../src/sdl/textinput.c"
  var $63=($59|0)<($62|0); //@line 109 "../../../src/sdl/textinput.c"
   //@line 109 "../../../src/sdl/textinput.c"
  do {
   if ($63) {
    var $65=$event; //@line 109 "../../../src/sdl/textinput.c"
    var $66=(($65+12)|0); //@line 109 "../../../src/sdl/textinput.c"
    var $67=HEAP32[(($66)>>2)]; //@line 109 "../../../src/sdl/textinput.c"
    var $68=$1; //@line 109 "../../../src/sdl/textinput.c"
    var $69=(($68+16)|0); //@line 109 "../../../src/sdl/textinput.c"
    var $70=HEAP32[(($69)>>2)]; //@line 109 "../../../src/sdl/textinput.c"
    var $71=$1; //@line 109 "../../../src/sdl/textinput.c"
    var $72=(($71+24)|0); //@line 109 "../../../src/sdl/textinput.c"
    var $73=HEAP32[(($72)>>2)]; //@line 109 "../../../src/sdl/textinput.c"
    var $74=((($70)+($73))|0); //@line 109 "../../../src/sdl/textinput.c"
    var $75=($67|0)<($74|0); //@line 109 "../../../src/sdl/textinput.c"
     //@line 109 "../../../src/sdl/textinput.c"
    if (!($75)) {
     label = 17;
     break;
    }
    var $77=$1; //@line 109 "../../../src/sdl/textinput.c"
    var $78=(($77+20)|0); //@line 109 "../../../src/sdl/textinput.c"
    var $79=HEAP32[(($78)>>2)]; //@line 109 "../../../src/sdl/textinput.c"
    var $80=$event; //@line 109 "../../../src/sdl/textinput.c"
    var $81=(($80+16)|0); //@line 109 "../../../src/sdl/textinput.c"
    var $82=HEAP32[(($81)>>2)]; //@line 109 "../../../src/sdl/textinput.c"
    var $83=($79|0)<($82|0); //@line 109 "../../../src/sdl/textinput.c"
     //@line 109 "../../../src/sdl/textinput.c"
    if (!($83)) {
     label = 17;
     break;
    }
    var $85=$event; //@line 109 "../../../src/sdl/textinput.c"
    var $86=(($85+16)|0); //@line 109 "../../../src/sdl/textinput.c"
    var $87=HEAP32[(($86)>>2)]; //@line 109 "../../../src/sdl/textinput.c"
    var $88=$1; //@line 109 "../../../src/sdl/textinput.c"
    var $89=(($88+20)|0); //@line 109 "../../../src/sdl/textinput.c"
    var $90=HEAP32[(($89)>>2)]; //@line 109 "../../../src/sdl/textinput.c"
    var $91=$1; //@line 109 "../../../src/sdl/textinput.c"
    var $92=(($91+28)|0); //@line 109 "../../../src/sdl/textinput.c"
    var $93=HEAP32[(($92)>>2)]; //@line 109 "../../../src/sdl/textinput.c"
    var $94=((($90)+($93))|0); //@line 109 "../../../src/sdl/textinput.c"
    var $95=($87|0)<($94|0); //@line 109 "../../../src/sdl/textinput.c"
     //@line 109 "../../../src/sdl/textinput.c"
    if (!($95)) {
     label = 17;
     break;
    }
    var $97=$event; //@line 110 "../../../src/sdl/textinput.c"
    var $98=(($97+8)|0); //@line 110 "../../../src/sdl/textinput.c"
    var $99=HEAP8[($98)]; //@line 110 "../../../src/sdl/textinput.c"
    var $100=($99&255); //@line 110 "../../../src/sdl/textinput.c"
    var $101=($100|0)==1; //@line 110 "../../../src/sdl/textinput.c"
     //@line 110 "../../../src/sdl/textinput.c"
    if ($101) {
     var $103=$1; //@line 111 "../../../src/sdl/textinput.c"
     var $104=(($103+37)|0); //@line 111 "../../../src/sdl/textinput.c"
     HEAP8[($104)]=1; //@line 111 "../../../src/sdl/textinput.c"
      //@line 112 "../../../src/sdl/textinput.c"
    }
     //@line 113 "../../../src/sdl/textinput.c"
   } else {
    label = 17;
   }
  } while(0);
  if (label == 17) {
   var $107=$1; //@line 114 "../../../src/sdl/textinput.c"
   var $108=(($107+37)|0); //@line 114 "../../../src/sdl/textinput.c"
   HEAP8[($108)]=0; //@line 114 "../../../src/sdl/textinput.c"
  }
   //@line 116 "../../../src/sdl/textinput.c"
 } else {
  var $111=$event; //@line 116 "../../../src/sdl/textinput.c"
  var $112=HEAP32[(($111)>>2)]; //@line 116 "../../../src/sdl/textinput.c"
  var $113=($112|0)==768; //@line 116 "../../../src/sdl/textinput.c"
   //@line 116 "../../../src/sdl/textinput.c"
  do {
   if ($113) {
    var $115=$1; //@line 116 "../../../src/sdl/textinput.c"
    var $116=(($115+37)|0); //@line 116 "../../../src/sdl/textinput.c"
    var $117=HEAP8[($116)]; //@line 116 "../../../src/sdl/textinput.c"
    var $118=(($117)&1); //@line 116 "../../../src/sdl/textinput.c"
     //@line 116 "../../../src/sdl/textinput.c"
    if (!($118)) {
     break;
    }
    var $120=$event; //@line 117 "../../../src/sdl/textinput.c"
    var $121=(($120+12)|0); //@line 117 "../../../src/sdl/textinput.c"
    var $122=(($121+4)|0); //@line 117 "../../../src/sdl/textinput.c"
    var $123=HEAP32[(($122)>>2)]; //@line 117 "../../../src/sdl/textinput.c"
    $c=$123; //@line 117 "../../../src/sdl/textinput.c"
    var $124=$c; //@line 118 "../../../src/sdl/textinput.c"
    var $125=($124|0)==8; //@line 118 "../../../src/sdl/textinput.c"
     //@line 118 "../../../src/sdl/textinput.c"
    if ($125) {
     var $127=$1; //@line 119 "../../../src/sdl/textinput.c"
     var $128=(($127+8)|0); //@line 119 "../../../src/sdl/textinput.c"
     var $129=HEAP32[(($128)>>2)]; //@line 119 "../../../src/sdl/textinput.c"
     var $130=($129|0)>0; //@line 119 "../../../src/sdl/textinput.c"
      //@line 119 "../../../src/sdl/textinput.c"
     if ($130) {
      var $132=$1; //@line 120 "../../../src/sdl/textinput.c"
      var $133=(($132+8)|0); //@line 120 "../../../src/sdl/textinput.c"
      var $134=HEAP32[(($133)>>2)]; //@line 120 "../../../src/sdl/textinput.c"
      var $135=((($134)-(1))|0); //@line 120 "../../../src/sdl/textinput.c"
      HEAP32[(($133)>>2)]=$135; //@line 120 "../../../src/sdl/textinput.c"
      var $136=$1; //@line 120 "../../../src/sdl/textinput.c"
      var $137=(($136+12)|0); //@line 120 "../../../src/sdl/textinput.c"
      var $138=HEAP32[(($137)>>2)]; //@line 120 "../../../src/sdl/textinput.c"
      var $139=(($138+$135)|0); //@line 120 "../../../src/sdl/textinput.c"
      HEAP8[($139)]=0; //@line 120 "../../../src/sdl/textinput.c"
      var $140=$1; //@line 121 "../../../src/sdl/textinput.c"
      _refresh($140); //@line 121 "../../../src/sdl/textinput.c"
       //@line 122 "../../../src/sdl/textinput.c"
     }
      //@line 123 "../../../src/sdl/textinput.c"
    } else {
     var $143=$c; //@line 123 "../../../src/sdl/textinput.c"
     var $144=($143|0)>=1122; //@line 123 "../../../src/sdl/textinput.c"
      //@line 123 "../../../src/sdl/textinput.c"
     do {
      if ($144) {
       var $146=$c; //@line 123 "../../../src/sdl/textinput.c"
       var $147=($146|0)<=1121; //@line 123 "../../../src/sdl/textinput.c"
        //@line 123 "../../../src/sdl/textinput.c"
       if (!($147)) {
        break;
       }
       var $149=$c; //@line 124 "../../../src/sdl/textinput.c"
       var $150=((($149)+(48))|0); //@line 124 "../../../src/sdl/textinput.c"
       var $151=((($150)-(1122))|0); //@line 124 "../../../src/sdl/textinput.c"
       $c=$151; //@line 124 "../../../src/sdl/textinput.c"
        //@line 125 "../../../src/sdl/textinput.c"
      }
     } while(0);
    }
    var $154=$c; //@line 126 "../../../src/sdl/textinput.c"
    var $155=_isalnum($154); //@line 126 "../../../src/sdl/textinput.c"
    var $156=($155|0)!=0; //@line 126 "../../../src/sdl/textinput.c"
     //@line 126 "../../../src/sdl/textinput.c"
    if ($156) {
     var $158=$1; //@line 127 "../../../src/sdl/textinput.c"
     var $159=(($158+8)|0); //@line 127 "../../../src/sdl/textinput.c"
     var $160=HEAP32[(($159)>>2)]; //@line 127 "../../../src/sdl/textinput.c"
     var $161=$1; //@line 127 "../../../src/sdl/textinput.c"
     var $162=(($161+4)|0); //@line 127 "../../../src/sdl/textinput.c"
     var $163=HEAP32[(($162)>>2)]; //@line 127 "../../../src/sdl/textinput.c"
     var $164=((($163)-(1))|0); //@line 127 "../../../src/sdl/textinput.c"
     var $165=($160|0)<($164|0); //@line 127 "../../../src/sdl/textinput.c"
      //@line 127 "../../../src/sdl/textinput.c"
     if ($165) {
      var $167=$event; //@line 128 "../../../src/sdl/textinput.c"
      var $168=(($167+12)|0); //@line 128 "../../../src/sdl/textinput.c"
      var $169=(($168+8)|0); //@line 128 "../../../src/sdl/textinput.c"
      var $170=HEAP16[(($169)>>1)]; //@line 128 "../../../src/sdl/textinput.c"
      var $171=($170&65535); //@line 128 "../../../src/sdl/textinput.c"
      var $172=$171&3; //@line 128 "../../../src/sdl/textinput.c"
      var $173=($172|0)!=0; //@line 128 "../../../src/sdl/textinput.c"
       //@line 128 "../../../src/sdl/textinput.c"
      if ($173) {
       var $175=$c; //@line 129 "../../../src/sdl/textinput.c"
       var $176=_toupper($175); //@line 129 "../../../src/sdl/textinput.c"
       $c=$176; //@line 129 "../../../src/sdl/textinput.c"
        //@line 129 "../../../src/sdl/textinput.c"
      }
      var $178=$c; //@line 130 "../../../src/sdl/textinput.c"
      var $179=(($178)&255); //@line 130 "../../../src/sdl/textinput.c"
      var $180=$1; //@line 130 "../../../src/sdl/textinput.c"
      var $181=(($180+8)|0); //@line 130 "../../../src/sdl/textinput.c"
      var $182=HEAP32[(($181)>>2)]; //@line 130 "../../../src/sdl/textinput.c"
      var $183=((($182)+(1))|0); //@line 130 "../../../src/sdl/textinput.c"
      HEAP32[(($181)>>2)]=$183; //@line 130 "../../../src/sdl/textinput.c"
      var $184=$1; //@line 130 "../../../src/sdl/textinput.c"
      var $185=(($184+12)|0); //@line 130 "../../../src/sdl/textinput.c"
      var $186=HEAP32[(($185)>>2)]; //@line 130 "../../../src/sdl/textinput.c"
      var $187=(($186+$182)|0); //@line 130 "../../../src/sdl/textinput.c"
      HEAP8[($187)]=$179; //@line 130 "../../../src/sdl/textinput.c"
      var $188=$1; //@line 131 "../../../src/sdl/textinput.c"
      _refresh($188); //@line 131 "../../../src/sdl/textinput.c"
       //@line 132 "../../../src/sdl/textinput.c"
     }
      //@line 133 "../../../src/sdl/textinput.c"
    }
     //@line 134 "../../../src/sdl/textinput.c"
   }
  } while(0);
 }
 STACKTOP=sp;return; //@line 136 "../../../src/sdl/textinput.c"
}


function _refresh($ti){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$ti;
 var $2=$1; //@line 87 "../../../src/sdl/textinput.c"
 var $3=(($2)|0); //@line 87 "../../../src/sdl/textinput.c"
 var $4=HEAP32[(($3)>>2)]; //@line 87 "../../../src/sdl/textinput.c"
 var $5=($4|0)!=0; //@line 87 "../../../src/sdl/textinput.c"
  //@line 87 "../../../src/sdl/textinput.c"
 if ($5) {
  var $7=$1; //@line 88 "../../../src/sdl/textinput.c"
  var $8=(($7)|0); //@line 88 "../../../src/sdl/textinput.c"
  var $9=HEAP32[(($8)>>2)]; //@line 88 "../../../src/sdl/textinput.c"
  _SDL_FreeSurface($9); //@line 88 "../../../src/sdl/textinput.c"
  var $10=$1; //@line 89 "../../../src/sdl/textinput.c"
  var $11=(($10)|0); //@line 89 "../../../src/sdl/textinput.c"
  HEAP32[(($11)>>2)]=0; //@line 89 "../../../src/sdl/textinput.c"
   //@line 90 "../../../src/sdl/textinput.c"
 }
 var $13=$1; //@line 91 "../../../src/sdl/textinput.c"
 var $14=(($13+8)|0); //@line 91 "../../../src/sdl/textinput.c"
 var $15=HEAP32[(($14)>>2)]; //@line 91 "../../../src/sdl/textinput.c"
 var $16=($15|0)>0; //@line 91 "../../../src/sdl/textinput.c"
  //@line 91 "../../../src/sdl/textinput.c"
 if (!($16)) {
  STACKTOP=sp;return; //@line 95 "../../../src/sdl/textinput.c"
 }
 _set_color(0,0,0); //@line 92 "../../../src/sdl/textinput.c"
 var $18=$1; //@line 93 "../../../src/sdl/textinput.c"
 var $19=(($18+12)|0); //@line 93 "../../../src/sdl/textinput.c"
 var $20=HEAP32[(($19)>>2)]; //@line 93 "../../../src/sdl/textinput.c"
 var $21=_text_surface($20,1); //@line 93 "../../../src/sdl/textinput.c"
 var $22=$1; //@line 93 "../../../src/sdl/textinput.c"
 var $23=(($22)|0); //@line 93 "../../../src/sdl/textinput.c"
 HEAP32[(($23)>>2)]=$21; //@line 93 "../../../src/sdl/textinput.c"
  //@line 94 "../../../src/sdl/textinput.c"
 STACKTOP=sp;return; //@line 95 "../../../src/sdl/textinput.c"
}


function _detruire_textinput($ti){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$ti;
 var $2=$1; //@line 140 "../../../src/sdl/textinput.c"
 var $3=(($2)|0); //@line 140 "../../../src/sdl/textinput.c"
 var $4=HEAP32[(($3)>>2)]; //@line 140 "../../../src/sdl/textinput.c"
 var $5=($4|0)!=0; //@line 140 "../../../src/sdl/textinput.c"
  //@line 140 "../../../src/sdl/textinput.c"
 if ($5) {
  var $7=$1; //@line 141 "../../../src/sdl/textinput.c"
  var $8=(($7)|0); //@line 141 "../../../src/sdl/textinput.c"
  var $9=HEAP32[(($8)>>2)]; //@line 141 "../../../src/sdl/textinput.c"
  _SDL_FreeSurface($9); //@line 141 "../../../src/sdl/textinput.c"
   //@line 142 "../../../src/sdl/textinput.c"
 }
 var $11=$1; //@line 143 "../../../src/sdl/textinput.c"
 var $12=(($11+12)|0); //@line 143 "../../../src/sdl/textinput.c"
 var $13=HEAP32[(($12)>>2)]; //@line 143 "../../../src/sdl/textinput.c"
 _gosh_free($13); //@line 143 "../../../src/sdl/textinput.c"
 var $14=$1; //@line 144 "../../../src/sdl/textinput.c"
 var $15=$14; //@line 144 "../../../src/sdl/textinput.c"
 _gosh_free($15); //@line 144 "../../../src/sdl/textinput.c"
 STACKTOP=sp;return; //@line 145 "../../../src/sdl/textinput.c"
}


function _creer_label($text,$x,$y,$align,$size){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $4;
 var $5;
 var $label;
 var $6=sp;
 $1=$text;
 $2=$x;
 $3=$y;
 $4=$align;
 $5=$size;
 var $7=_gosh_alloc_size(32); //@line 31 "../../../src/sdl/label.c"
 var $8=$7; //@line 31 "../../../src/sdl/label.c"
 $label=$8; //@line 31 "../../../src/sdl/label.c"
 var $9=$1; //@line 32 "../../../src/sdl/label.c"
 var $10=$5; //@line 32 "../../../src/sdl/label.c"
 var $11=_text_surface($9,$10); //@line 32 "../../../src/sdl/label.c"
 var $12=$label; //@line 32 "../../../src/sdl/label.c"
 var $13=(($12)|0); //@line 32 "../../../src/sdl/label.c"
 HEAP32[(($13)>>2)]=$11; //@line 32 "../../../src/sdl/label.c"
 var $14=$2; //@line 33 "../../../src/sdl/label.c"
 var $15=$label; //@line 33 "../../../src/sdl/label.c"
 var $16=(($15+4)|0); //@line 33 "../../../src/sdl/label.c"
 HEAP32[(($16)>>2)]=$14; //@line 33 "../../../src/sdl/label.c"
 var $17=$3; //@line 34 "../../../src/sdl/label.c"
 var $18=$label; //@line 34 "../../../src/sdl/label.c"
 var $19=(($18+8)|0); //@line 34 "../../../src/sdl/label.c"
 HEAP32[(($19)>>2)]=$17; //@line 34 "../../../src/sdl/label.c"
 var $20=$label; //@line 35 "../../../src/sdl/label.c"
 var $21=(($20)|0); //@line 35 "../../../src/sdl/label.c"
 var $22=HEAP32[(($21)>>2)]; //@line 35 "../../../src/sdl/label.c"
 var $23=(($22+8)|0); //@line 35 "../../../src/sdl/label.c"
 var $24=HEAP32[(($23)>>2)]; //@line 35 "../../../src/sdl/label.c"
 var $25=$label; //@line 35 "../../../src/sdl/label.c"
 var $26=(($25+12)|0); //@line 35 "../../../src/sdl/label.c"
 HEAP32[(($26)>>2)]=$24; //@line 35 "../../../src/sdl/label.c"
 var $27=$label; //@line 36 "../../../src/sdl/label.c"
 var $28=(($27)|0); //@line 36 "../../../src/sdl/label.c"
 var $29=HEAP32[(($28)>>2)]; //@line 36 "../../../src/sdl/label.c"
 var $30=(($29+12)|0); //@line 36 "../../../src/sdl/label.c"
 var $31=HEAP32[(($30)>>2)]; //@line 36 "../../../src/sdl/label.c"
 var $32=$label; //@line 36 "../../../src/sdl/label.c"
 var $33=(($32+16)|0); //@line 36 "../../../src/sdl/label.c"
 HEAP32[(($33)>>2)]=$31; //@line 36 "../../../src/sdl/label.c"
 var $34=$4; //@line 37 "../../../src/sdl/label.c"
 var $35=$label; //@line 37 "../../../src/sdl/label.c"
 var $36=(($35+20)|0); //@line 37 "../../../src/sdl/label.c"
 HEAP32[(($36)>>2)]=$34; //@line 37 "../../../src/sdl/label.c"
 var $37=$label; //@line 38 "../../../src/sdl/label.c"
 var $38=(($37+24)|0); //@line 38 "../../../src/sdl/label.c"
 _get_color($6); //@line 38 "../../../src/sdl/label.c"
 var $39=$38; //@line 38 "../../../src/sdl/label.c"
 var $40=$6; //@line 38 "../../../src/sdl/label.c"
 assert(4 % 1 === 0);HEAP8[($39)]=HEAP8[($40)];HEAP8[((($39)+(1))|0)]=HEAP8[((($40)+(1))|0)];HEAP8[((($39)+(2))|0)]=HEAP8[((($40)+(2))|0)];HEAP8[((($39)+(3))|0)]=HEAP8[((($40)+(3))|0)]; //@line 38 "../../../src/sdl/label.c"
 var $41=$label; //@line 39 "../../../src/sdl/label.c"
 var $42=(($41+28)|0); //@line 39 "../../../src/sdl/label.c"
 HEAP8[($42)]=1; //@line 39 "../../../src/sdl/label.c"
 var $43=$label; //@line 40 "../../../src/sdl/label.c"
 STACKTOP=sp;return $43; //@line 40 "../../../src/sdl/label.c"
}


function _afficher_label($on,$label){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 $1=$on;
 $2=$label;
 var $3=$2; //@line 45 "../../../src/sdl/label.c"
 var $4=(($3+28)|0); //@line 45 "../../../src/sdl/label.c"
 var $5=HEAP8[($4)]; //@line 45 "../../../src/sdl/label.c"
 var $6=(($5)&1); //@line 45 "../../../src/sdl/label.c"
  //@line 45 "../../../src/sdl/label.c"
 if (!($6)) {
  STACKTOP=sp;return; //@line 48 "../../../src/sdl/label.c"
 }
 var $8=$1; //@line 46 "../../../src/sdl/label.c"
 var $9=$2; //@line 46 "../../../src/sdl/label.c"
 var $10=(($9)|0); //@line 46 "../../../src/sdl/label.c"
 var $11=HEAP32[(($10)>>2)]; //@line 46 "../../../src/sdl/label.c"
 var $12=$2; //@line 46 "../../../src/sdl/label.c"
 var $13=(($12+4)|0); //@line 46 "../../../src/sdl/label.c"
 var $14=HEAP32[(($13)>>2)]; //@line 46 "../../../src/sdl/label.c"
 var $15=$2; //@line 46 "../../../src/sdl/label.c"
 var $16=(($15+8)|0); //@line 46 "../../../src/sdl/label.c"
 var $17=HEAP32[(($16)>>2)]; //@line 46 "../../../src/sdl/label.c"
 var $18=$2; //@line 46 "../../../src/sdl/label.c"
 var $19=(($18+20)|0); //@line 46 "../../../src/sdl/label.c"
 var $20=HEAP32[(($19)>>2)]; //@line 46 "../../../src/sdl/label.c"
 _draw_surface($8,$11,$14,$17,$20); //@line 46 "../../../src/sdl/label.c"
  //@line 47 "../../../src/sdl/label.c"
 STACKTOP=sp;return; //@line 48 "../../../src/sdl/label.c"
}


function _detruire_label($label){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$label;
 var $2=$1; //@line 52 "../../../src/sdl/label.c"
 var $3=(($2)|0); //@line 52 "../../../src/sdl/label.c"
 var $4=HEAP32[(($3)>>2)]; //@line 52 "../../../src/sdl/label.c"
 _SDL_FreeSurface($4); //@line 52 "../../../src/sdl/label.c"
 var $5=$1; //@line 53 "../../../src/sdl/label.c"
 var $6=$5; //@line 53 "../../../src/sdl/label.c"
 _gosh_free($6); //@line 53 "../../../src/sdl/label.c"
 STACKTOP=sp;return; //@line 54 "../../../src/sdl/label.c"
}


function _creer_menu(){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $state;
 var $menu;
 var $id_groupe;
 var $id_label;
 var $id_bouton;
 var $id_textinput;
 var $bouton;
 var $initx;
 var $y;
 var $x;
 var $groupe_type_j1;
 var $groupe_programme_j1;
 var $groupe_type_j2;
 var $groupe_programme_j2;
 var $groupe_taille;
 var $1=_gosh_alloc_size(32); //@line 139 "../../../src/sdl/menu.c"
 var $2=$1; //@line 139 "../../../src/sdl/menu.c"
 $state=$2; //@line 139 "../../../src/sdl/menu.c"
 var $3=_gosh_alloc_size(80); //@line 140 "../../../src/sdl/menu.c"
 var $4=$3; //@line 140 "../../../src/sdl/menu.c"
 $menu=$4; //@line 140 "../../../src/sdl/menu.c"
 var $5=$menu; //@line 141 "../../../src/sdl/menu.c"
 var $6=$5; //@line 141 "../../../src/sdl/menu.c"
 var $7=$state; //@line 141 "../../../src/sdl/menu.c"
 var $8=(($7+28)|0); //@line 141 "../../../src/sdl/menu.c"
 HEAP32[(($8)>>2)]=$6; //@line 141 "../../../src/sdl/menu.c"
 var $9=$state; //@line 142 "../../../src/sdl/menu.c"
 var $10=(($9)|0); //@line 142 "../../../src/sdl/menu.c"
 HEAP8[($10)]=0; //@line 142 "../../../src/sdl/menu.c"
 var $11=$state; //@line 143 "../../../src/sdl/menu.c"
 var $12=(($11+4)|0); //@line 143 "../../../src/sdl/menu.c"
 HEAP32[(($12)>>2)]=40; //@line 143 "../../../src/sdl/menu.c"
 var $13=$state; //@line 144 "../../../src/sdl/menu.c"
 var $14=(($13+12)|0); //@line 144 "../../../src/sdl/menu.c"
 HEAP32[(($14)>>2)]=190; //@line 144 "../../../src/sdl/menu.c"
 var $15=$state; //@line 145 "../../../src/sdl/menu.c"
 var $16=(($15+16)|0); //@line 145 "../../../src/sdl/menu.c"
 HEAP32[(($16)>>2)]=190; //@line 145 "../../../src/sdl/menu.c"
 var $17=$state; //@line 146 "../../../src/sdl/menu.c"
 var $18=(($17+20)|0); //@line 146 "../../../src/sdl/menu.c"
 HEAP32[(($18)>>2)]=190; //@line 146 "../../../src/sdl/menu.c"
 var $19=$state; //@line 147 "../../../src/sdl/menu.c"
 var $20=(($19+8)|0); //@line 147 "../../../src/sdl/menu.c"
 HEAP32[(($20)>>2)]=190; //@line 147 "../../../src/sdl/menu.c"
 var $21=$state; //@line 148 "../../../src/sdl/menu.c"
 var $22=(($21+24)|0); //@line 148 "../../../src/sdl/menu.c"
 HEAP32[(($22)>>2)]=66; //@line 148 "../../../src/sdl/menu.c"
 _set_color(200,50,50); //@line 150 "../../../src/sdl/menu.c"
 var $23=_creer_label(1344,400,68,2,2); //@line 151 "../../../src/sdl/menu.c"
 var $24=$menu; //@line 151 "../../../src/sdl/menu.c"
 var $25=(($24)|0); //@line 151 "../../../src/sdl/menu.c"
 HEAP32[(($25)>>2)]=$23; //@line 151 "../../../src/sdl/menu.c"
 $id_groupe=0; //@line 153 "../../../src/sdl/menu.c"
 $id_label=0; //@line 154 "../../../src/sdl/menu.c"
 $id_bouton=0; //@line 155 "../../../src/sdl/menu.c"
 $id_textinput=0; //@line 156 "../../../src/sdl/menu.c"
 _set_color(255,10,10); //@line 158 "../../../src/sdl/menu.c"
 var $26=_creer_bouton(1144,80,612,100,30); //@line 159 "../../../src/sdl/menu.c"
 $bouton=$26; //@line 159 "../../../src/sdl/menu.c"
 var $27=$bouton; //@line 160 "../../../src/sdl/menu.c"
 var $28=(($27+40)|0); //@line 160 "../../../src/sdl/menu.c"
 HEAP32[(($28)>>2)]=168; //@line 160 "../../../src/sdl/menu.c"
 var $29=$state; //@line 161 "../../../src/sdl/menu.c"
 var $30=$29; //@line 161 "../../../src/sdl/menu.c"
 var $31=$bouton; //@line 161 "../../../src/sdl/menu.c"
 var $32=(($31+44)|0); //@line 161 "../../../src/sdl/menu.c"
 HEAP32[(($32)>>2)]=$30; //@line 161 "../../../src/sdl/menu.c"
 var $33=$bouton; //@line 162 "../../../src/sdl/menu.c"
 var $34=$id_bouton; //@line 162 "../../../src/sdl/menu.c"
 var $35=((($34)+(1))|0); //@line 162 "../../../src/sdl/menu.c"
 $id_bouton=$35; //@line 162 "../../../src/sdl/menu.c"
 var $36=$menu; //@line 162 "../../../src/sdl/menu.c"
 var $37=(($36+36)|0); //@line 162 "../../../src/sdl/menu.c"
 var $38=(($37+($34<<2))|0); //@line 162 "../../../src/sdl/menu.c"
 HEAP32[(($38)>>2)]=$33; //@line 162 "../../../src/sdl/menu.c"
 _set_color(10,200,10); //@line 164 "../../../src/sdl/menu.c"
 var $39=_creer_bouton(752,480,475,100,30); //@line 165 "../../../src/sdl/menu.c"
 $bouton=$39; //@line 165 "../../../src/sdl/menu.c"
 var $40=$bouton; //@line 166 "../../../src/sdl/menu.c"
 var $41=(($40+40)|0); //@line 166 "../../../src/sdl/menu.c"
 HEAP32[(($41)>>2)]=2; //@line 166 "../../../src/sdl/menu.c"
 var $42=$state; //@line 167 "../../../src/sdl/menu.c"
 var $43=$42; //@line 167 "../../../src/sdl/menu.c"
 var $44=$bouton; //@line 167 "../../../src/sdl/menu.c"
 var $45=(($44+44)|0); //@line 167 "../../../src/sdl/menu.c"
 HEAP32[(($45)>>2)]=$43; //@line 167 "../../../src/sdl/menu.c"
 var $46=$bouton; //@line 168 "../../../src/sdl/menu.c"
 var $47=$id_bouton; //@line 168 "../../../src/sdl/menu.c"
 var $48=((($47)+(1))|0); //@line 168 "../../../src/sdl/menu.c"
 $id_bouton=$48; //@line 168 "../../../src/sdl/menu.c"
 var $49=$menu; //@line 168 "../../../src/sdl/menu.c"
 var $50=(($49+36)|0); //@line 168 "../../../src/sdl/menu.c"
 var $51=(($50+($47<<2))|0); //@line 168 "../../../src/sdl/menu.c"
 HEAP32[(($51)>>2)]=$46; //@line 168 "../../../src/sdl/menu.c"
 _set_color(50,50,200); //@line 170 "../../../src/sdl/menu.c"
 var $52=_creer_bouton(512,560,612,100,30); //@line 171 "../../../src/sdl/menu.c"
 $bouton=$52; //@line 171 "../../../src/sdl/menu.c"
 var $53=$bouton; //@line 172 "../../../src/sdl/menu.c"
 var $54=(($53+40)|0); //@line 172 "../../../src/sdl/menu.c"
 HEAP32[(($54)>>2)]=44; //@line 172 "../../../src/sdl/menu.c"
 var $55=$state; //@line 173 "../../../src/sdl/menu.c"
 var $56=$55; //@line 173 "../../../src/sdl/menu.c"
 var $57=$bouton; //@line 173 "../../../src/sdl/menu.c"
 var $58=(($57+44)|0); //@line 173 "../../../src/sdl/menu.c"
 HEAP32[(($58)>>2)]=$56; //@line 173 "../../../src/sdl/menu.c"
 var $59=$bouton; //@line 174 "../../../src/sdl/menu.c"
 var $60=$id_bouton; //@line 174 "../../../src/sdl/menu.c"
 var $61=((($60)+(1))|0); //@line 174 "../../../src/sdl/menu.c"
 $id_bouton=$61; //@line 174 "../../../src/sdl/menu.c"
 var $62=$menu; //@line 174 "../../../src/sdl/menu.c"
 var $63=(($62+36)|0); //@line 174 "../../../src/sdl/menu.c"
 var $64=(($63+($60<<2))|0); //@line 174 "../../../src/sdl/menu.c"
 HEAP32[(($64)>>2)]=$59; //@line 174 "../../../src/sdl/menu.c"
 _set_color(255,255,255); //@line 176 "../../../src/sdl/menu.c"
 $initx=140; //@line 178 "../../../src/sdl/menu.c"
 $y=156; //@line 179 "../../../src/sdl/menu.c"
 var $65=$initx; //@line 181 "../../../src/sdl/menu.c"
 $x=$65; //@line 181 "../../../src/sdl/menu.c"
 var $66=$x; //@line 186 "../../../src/sdl/menu.c"
 var $67=$y; //@line 186 "../../../src/sdl/menu.c"
 var $68=_creer_label(416,$66,$67,0,1); //@line 186 "../../../src/sdl/menu.c"
 var $69=$id_label; //@line 186 "../../../src/sdl/menu.c"
 var $70=$menu; //@line 186 "../../../src/sdl/menu.c"
 var $71=(($70+4)|0); //@line 186 "../../../src/sdl/menu.c"
 var $72=(($71+($69<<2))|0); //@line 186 "../../../src/sdl/menu.c"
 HEAP32[(($72)>>2)]=$68; //@line 186 "../../../src/sdl/menu.c"
 var $73=$id_label; //@line 187 "../../../src/sdl/menu.c"
 var $74=$menu; //@line 187 "../../../src/sdl/menu.c"
 var $75=(($74+4)|0); //@line 187 "../../../src/sdl/menu.c"
 var $76=(($75+($73<<2))|0); //@line 187 "../../../src/sdl/menu.c"
 var $77=HEAP32[(($76)>>2)]; //@line 187 "../../../src/sdl/menu.c"
 var $78=(($77+12)|0); //@line 187 "../../../src/sdl/menu.c"
 var $79=HEAP32[(($78)>>2)]; //@line 187 "../../../src/sdl/menu.c"
 var $80=((($79)+(50))|0); //@line 187 "../../../src/sdl/menu.c"
 var $81=$x; //@line 187 "../../../src/sdl/menu.c"
 var $82=((($81)+($80))|0); //@line 187 "../../../src/sdl/menu.c"
 $x=$82; //@line 187 "../../../src/sdl/menu.c"
 var $83=$id_label; //@line 188 "../../../src/sdl/menu.c"
 var $84=((($83)+(1))|0); //@line 188 "../../../src/sdl/menu.c"
 $id_label=$84; //@line 188 "../../../src/sdl/menu.c"
 var $85=_creer_groupe_radio(2); //@line 189 "../../../src/sdl/menu.c"
 $groupe_type_j1=$85; //@line 189 "../../../src/sdl/menu.c"
 var $86=$groupe_type_j1; //@line 190 "../../../src/sdl/menu.c"
 var $87=$x; //@line 190 "../../../src/sdl/menu.c"
 var $88=$y; //@line 190 "../../../src/sdl/menu.c"
 _groupe_radio_ajouter($86,288,$87,$88); //@line 190 "../../../src/sdl/menu.c"
 var $89=$groupe_type_j1; //@line 191 "../../../src/sdl/menu.c"
 var $90=$x; //@line 191 "../../../src/sdl/menu.c"
 var $91=((($90)+(100))|0); //@line 191 "../../../src/sdl/menu.c"
 var $92=$y; //@line 191 "../../../src/sdl/menu.c"
 _groupe_radio_ajouter($89,248,$91,$92); //@line 191 "../../../src/sdl/menu.c"
 var $93=$groupe_type_j1; //@line 192 "../../../src/sdl/menu.c"
 var $94=(($93+20)|0); //@line 192 "../../../src/sdl/menu.c"
 HEAP32[(($94)>>2)]=104; //@line 192 "../../../src/sdl/menu.c"
 var $95=$state; //@line 193 "../../../src/sdl/menu.c"
 var $96=$95; //@line 193 "../../../src/sdl/menu.c"
 var $97=$groupe_type_j1; //@line 193 "../../../src/sdl/menu.c"
 var $98=(($97+24)|0); //@line 193 "../../../src/sdl/menu.c"
 HEAP32[(($98)>>2)]=$96; //@line 193 "../../../src/sdl/menu.c"
 var $99=$groupe_type_j1; //@line 194 "../../../src/sdl/menu.c"
 var $100=$id_groupe; //@line 194 "../../../src/sdl/menu.c"
 var $101=((($100)+(1))|0); //@line 194 "../../../src/sdl/menu.c"
 $id_groupe=$101; //@line 194 "../../../src/sdl/menu.c"
 var $102=$menu; //@line 194 "../../../src/sdl/menu.c"
 var $103=(($102+48)|0); //@line 194 "../../../src/sdl/menu.c"
 var $104=(($103+($100<<2))|0); //@line 194 "../../../src/sdl/menu.c"
 HEAP32[(($104)>>2)]=$99; //@line 194 "../../../src/sdl/menu.c"
 var $105=$initx; //@line 196 "../../../src/sdl/menu.c"
 $x=$105; //@line 196 "../../../src/sdl/menu.c"
 var $106=$y; //@line 197 "../../../src/sdl/menu.c"
 var $107=((($106)+(30))|0); //@line 197 "../../../src/sdl/menu.c"
 $y=$107; //@line 197 "../../../src/sdl/menu.c"
 var $108=$x; //@line 198 "../../../src/sdl/menu.c"
 var $109=$y; //@line 198 "../../../src/sdl/menu.c"
 var $110=_creer_label(192,$108,$109,0,1); //@line 198 "../../../src/sdl/menu.c"
 var $111=$id_label; //@line 198 "../../../src/sdl/menu.c"
 var $112=((($111)+(1))|0); //@line 198 "../../../src/sdl/menu.c"
 $id_label=$112; //@line 198 "../../../src/sdl/menu.c"
 var $113=$menu; //@line 198 "../../../src/sdl/menu.c"
 var $114=(($113+4)|0); //@line 198 "../../../src/sdl/menu.c"
 var $115=(($114+($111<<2))|0); //@line 198 "../../../src/sdl/menu.c"
 HEAP32[(($115)>>2)]=$110; //@line 198 "../../../src/sdl/menu.c"
 _set_color(150,150,150); //@line 199 "../../../src/sdl/menu.c"
 var $116=$x; //@line 200 "../../../src/sdl/menu.c"
 var $117=((($116)+(80))|0); //@line 200 "../../../src/sdl/menu.c"
 var $118=$y; //@line 200 "../../../src/sdl/menu.c"
 var $119=_creer_textinput($117,$118,300,20,12); //@line 200 "../../../src/sdl/menu.c"
 var $120=$id_textinput; //@line 200 "../../../src/sdl/menu.c"
 var $121=$menu; //@line 200 "../../../src/sdl/menu.c"
 var $122=(($121+68)|0); //@line 200 "../../../src/sdl/menu.c"
 var $123=(($122+($120<<2))|0); //@line 200 "../../../src/sdl/menu.c"
 HEAP32[(($123)>>2)]=$119; //@line 200 "../../../src/sdl/menu.c"
 var $124=$id_textinput; //@line 201 "../../../src/sdl/menu.c"
 var $125=((($124)+(1))|0); //@line 201 "../../../src/sdl/menu.c"
 $id_textinput=$125; //@line 201 "../../../src/sdl/menu.c"
 _set_color(255,255,255); //@line 202 "../../../src/sdl/menu.c"
 var $126=$y; //@line 205 "../../../src/sdl/menu.c"
 var $127=((($126)+(30))|0); //@line 205 "../../../src/sdl/menu.c"
 $y=$127; //@line 205 "../../../src/sdl/menu.c"
 var $128=$x; //@line 206 "../../../src/sdl/menu.c"
 var $129=$y; //@line 206 "../../../src/sdl/menu.c"
 var $130=_creer_label(136,$128,$129,0,1); //@line 206 "../../../src/sdl/menu.c"
 var $131=$id_label; //@line 206 "../../../src/sdl/menu.c"
 var $132=$menu; //@line 206 "../../../src/sdl/menu.c"
 var $133=(($132+4)|0); //@line 206 "../../../src/sdl/menu.c"
 var $134=(($133+($131<<2))|0); //@line 206 "../../../src/sdl/menu.c"
 HEAP32[(($134)>>2)]=$130; //@line 206 "../../../src/sdl/menu.c"
 var $135=$id_label; //@line 207 "../../../src/sdl/menu.c"
 var $136=$menu; //@line 207 "../../../src/sdl/menu.c"
 var $137=(($136+4)|0); //@line 207 "../../../src/sdl/menu.c"
 var $138=(($137+($135<<2))|0); //@line 207 "../../../src/sdl/menu.c"
 var $139=HEAP32[(($138)>>2)]; //@line 207 "../../../src/sdl/menu.c"
 var $140=(($139+28)|0); //@line 207 "../../../src/sdl/menu.c"
 HEAP8[($140)]=0; //@line 207 "../../../src/sdl/menu.c"
 var $141=$id_label; //@line 208 "../../../src/sdl/menu.c"
 var $142=$menu; //@line 208 "../../../src/sdl/menu.c"
 var $143=(($142+4)|0); //@line 208 "../../../src/sdl/menu.c"
 var $144=(($143+($141<<2))|0); //@line 208 "../../../src/sdl/menu.c"
 var $145=HEAP32[(($144)>>2)]; //@line 208 "../../../src/sdl/menu.c"
 var $146=(($145+12)|0); //@line 208 "../../../src/sdl/menu.c"
 var $147=HEAP32[(($146)>>2)]; //@line 208 "../../../src/sdl/menu.c"
 var $148=((($147)+(50))|0); //@line 208 "../../../src/sdl/menu.c"
 var $149=$x; //@line 208 "../../../src/sdl/menu.c"
 var $150=((($149)+($148))|0); //@line 208 "../../../src/sdl/menu.c"
 $x=$150; //@line 208 "../../../src/sdl/menu.c"
 var $151=$id_label; //@line 209 "../../../src/sdl/menu.c"
 var $152=((($151)+(1))|0); //@line 209 "../../../src/sdl/menu.c"
 $id_label=$152; //@line 209 "../../../src/sdl/menu.c"
 var $153=_creer_groupe_radio(1); //@line 215 "../../../src/sdl/menu.c"
 $groupe_programme_j1=$153; //@line 215 "../../../src/sdl/menu.c"
 var $154=$groupe_programme_j1; //@line 216 "../../../src/sdl/menu.c"
 var $155=$x; //@line 216 "../../../src/sdl/menu.c"
 var $156=((($155)+(100))|0); //@line 216 "../../../src/sdl/menu.c"
 var $157=$y; //@line 216 "../../../src/sdl/menu.c"
 _groupe_radio_ajouter($154,88,$156,$157); //@line 216 "../../../src/sdl/menu.c"
 var $158=$groupe_programme_j1; //@line 218 "../../../src/sdl/menu.c"
 var $159=(($158+16)|0); //@line 218 "../../../src/sdl/menu.c"
 HEAP8[($159)]=0; //@line 218 "../../../src/sdl/menu.c"
 var $160=$groupe_programme_j1; //@line 219 "../../../src/sdl/menu.c"
 var $161=$id_groupe; //@line 219 "../../../src/sdl/menu.c"
 var $162=((($161)+(1))|0); //@line 219 "../../../src/sdl/menu.c"
 $id_groupe=$162; //@line 219 "../../../src/sdl/menu.c"
 var $163=$menu; //@line 219 "../../../src/sdl/menu.c"
 var $164=(($163+48)|0); //@line 219 "../../../src/sdl/menu.c"
 var $165=(($164+($161<<2))|0); //@line 219 "../../../src/sdl/menu.c"
 HEAP32[(($165)>>2)]=$160; //@line 219 "../../../src/sdl/menu.c"
 var $166=$initx; //@line 221 "../../../src/sdl/menu.c"
 $x=$166; //@line 221 "../../../src/sdl/menu.c"
 var $167=$y; //@line 222 "../../../src/sdl/menu.c"
 var $168=((($167)+(60))|0); //@line 222 "../../../src/sdl/menu.c"
 $y=$168; //@line 222 "../../../src/sdl/menu.c"
 var $169=$x; //@line 228 "../../../src/sdl/menu.c"
 var $170=$y; //@line 228 "../../../src/sdl/menu.c"
 var $171=_creer_label(1328,$169,$170,0,1); //@line 228 "../../../src/sdl/menu.c"
 var $172=$id_label; //@line 228 "../../../src/sdl/menu.c"
 var $173=$menu; //@line 228 "../../../src/sdl/menu.c"
 var $174=(($173+4)|0); //@line 228 "../../../src/sdl/menu.c"
 var $175=(($174+($172<<2))|0); //@line 228 "../../../src/sdl/menu.c"
 HEAP32[(($175)>>2)]=$171; //@line 228 "../../../src/sdl/menu.c"
 var $176=$id_label; //@line 229 "../../../src/sdl/menu.c"
 var $177=$menu; //@line 229 "../../../src/sdl/menu.c"
 var $178=(($177+4)|0); //@line 229 "../../../src/sdl/menu.c"
 var $179=(($178+($176<<2))|0); //@line 229 "../../../src/sdl/menu.c"
 var $180=HEAP32[(($179)>>2)]; //@line 229 "../../../src/sdl/menu.c"
 var $181=(($180+12)|0); //@line 229 "../../../src/sdl/menu.c"
 var $182=HEAP32[(($181)>>2)]; //@line 229 "../../../src/sdl/menu.c"
 var $183=((($182)+(50))|0); //@line 229 "../../../src/sdl/menu.c"
 var $184=$x; //@line 229 "../../../src/sdl/menu.c"
 var $185=((($184)+($183))|0); //@line 229 "../../../src/sdl/menu.c"
 $x=$185; //@line 229 "../../../src/sdl/menu.c"
 var $186=$id_label; //@line 230 "../../../src/sdl/menu.c"
 var $187=((($186)+(1))|0); //@line 230 "../../../src/sdl/menu.c"
 $id_label=$187; //@line 230 "../../../src/sdl/menu.c"
 var $188=_creer_groupe_radio(2); //@line 231 "../../../src/sdl/menu.c"
 $groupe_type_j2=$188; //@line 231 "../../../src/sdl/menu.c"
 var $189=$groupe_type_j2; //@line 232 "../../../src/sdl/menu.c"
 var $190=$x; //@line 232 "../../../src/sdl/menu.c"
 var $191=$y; //@line 232 "../../../src/sdl/menu.c"
 _groupe_radio_ajouter($189,288,$190,$191); //@line 232 "../../../src/sdl/menu.c"
 var $192=$groupe_type_j2; //@line 233 "../../../src/sdl/menu.c"
 var $193=$x; //@line 233 "../../../src/sdl/menu.c"
 var $194=((($193)+(100))|0); //@line 233 "../../../src/sdl/menu.c"
 var $195=$y; //@line 233 "../../../src/sdl/menu.c"
 _groupe_radio_ajouter($192,248,$194,$195); //@line 233 "../../../src/sdl/menu.c"
 var $196=$groupe_type_j2; //@line 234 "../../../src/sdl/menu.c"
 var $197=(($196+20)|0); //@line 234 "../../../src/sdl/menu.c"
 HEAP32[(($197)>>2)]=104; //@line 234 "../../../src/sdl/menu.c"
 var $198=$state; //@line 235 "../../../src/sdl/menu.c"
 var $199=$198; //@line 235 "../../../src/sdl/menu.c"
 var $200=$groupe_type_j2; //@line 235 "../../../src/sdl/menu.c"
 var $201=(($200+24)|0); //@line 235 "../../../src/sdl/menu.c"
 HEAP32[(($201)>>2)]=$199; //@line 235 "../../../src/sdl/menu.c"
 var $202=$groupe_type_j2; //@line 236 "../../../src/sdl/menu.c"
 var $203=$id_groupe; //@line 236 "../../../src/sdl/menu.c"
 var $204=((($203)+(1))|0); //@line 236 "../../../src/sdl/menu.c"
 $id_groupe=$204; //@line 236 "../../../src/sdl/menu.c"
 var $205=$menu; //@line 236 "../../../src/sdl/menu.c"
 var $206=(($205+48)|0); //@line 236 "../../../src/sdl/menu.c"
 var $207=(($206+($203<<2))|0); //@line 236 "../../../src/sdl/menu.c"
 HEAP32[(($207)>>2)]=$202; //@line 236 "../../../src/sdl/menu.c"
 var $208=$initx; //@line 238 "../../../src/sdl/menu.c"
 $x=$208; //@line 238 "../../../src/sdl/menu.c"
 var $209=$y; //@line 239 "../../../src/sdl/menu.c"
 var $210=((($209)+(30))|0); //@line 239 "../../../src/sdl/menu.c"
 $y=$210; //@line 239 "../../../src/sdl/menu.c"
 var $211=$x; //@line 240 "../../../src/sdl/menu.c"
 var $212=$y; //@line 240 "../../../src/sdl/menu.c"
 var $213=_creer_label(192,$211,$212,0,1); //@line 240 "../../../src/sdl/menu.c"
 var $214=$id_label; //@line 240 "../../../src/sdl/menu.c"
 var $215=((($214)+(1))|0); //@line 240 "../../../src/sdl/menu.c"
 $id_label=$215; //@line 240 "../../../src/sdl/menu.c"
 var $216=$menu; //@line 240 "../../../src/sdl/menu.c"
 var $217=(($216+4)|0); //@line 240 "../../../src/sdl/menu.c"
 var $218=(($217+($214<<2))|0); //@line 240 "../../../src/sdl/menu.c"
 HEAP32[(($218)>>2)]=$213; //@line 240 "../../../src/sdl/menu.c"
 _set_color(150,150,150); //@line 241 "../../../src/sdl/menu.c"
 var $219=$x; //@line 242 "../../../src/sdl/menu.c"
 var $220=((($219)+(80))|0); //@line 242 "../../../src/sdl/menu.c"
 var $221=$y; //@line 242 "../../../src/sdl/menu.c"
 var $222=_creer_textinput($220,$221,300,20,12); //@line 242 "../../../src/sdl/menu.c"
 var $223=$id_textinput; //@line 242 "../../../src/sdl/menu.c"
 var $224=$menu; //@line 242 "../../../src/sdl/menu.c"
 var $225=(($224+68)|0); //@line 242 "../../../src/sdl/menu.c"
 var $226=(($225+($223<<2))|0); //@line 242 "../../../src/sdl/menu.c"
 HEAP32[(($226)>>2)]=$222; //@line 242 "../../../src/sdl/menu.c"
 var $227=$id_textinput; //@line 243 "../../../src/sdl/menu.c"
 var $228=((($227)+(1))|0); //@line 243 "../../../src/sdl/menu.c"
 $id_textinput=$228; //@line 243 "../../../src/sdl/menu.c"
 _set_color(255,255,255); //@line 244 "../../../src/sdl/menu.c"
 var $229=$y; //@line 247 "../../../src/sdl/menu.c"
 var $230=((($229)+(30))|0); //@line 247 "../../../src/sdl/menu.c"
 $y=$230; //@line 247 "../../../src/sdl/menu.c"
 var $231=$x; //@line 248 "../../../src/sdl/menu.c"
 var $232=$y; //@line 248 "../../../src/sdl/menu.c"
 var $233=_creer_label(136,$231,$232,0,1); //@line 248 "../../../src/sdl/menu.c"
 var $234=$id_label; //@line 248 "../../../src/sdl/menu.c"
 var $235=$menu; //@line 248 "../../../src/sdl/menu.c"
 var $236=(($235+4)|0); //@line 248 "../../../src/sdl/menu.c"
 var $237=(($236+($234<<2))|0); //@line 248 "../../../src/sdl/menu.c"
 HEAP32[(($237)>>2)]=$233; //@line 248 "../../../src/sdl/menu.c"
 var $238=$id_label; //@line 249 "../../../src/sdl/menu.c"
 var $239=$menu; //@line 249 "../../../src/sdl/menu.c"
 var $240=(($239+4)|0); //@line 249 "../../../src/sdl/menu.c"
 var $241=(($240+($238<<2))|0); //@line 249 "../../../src/sdl/menu.c"
 var $242=HEAP32[(($241)>>2)]; //@line 249 "../../../src/sdl/menu.c"
 var $243=(($242+28)|0); //@line 249 "../../../src/sdl/menu.c"
 HEAP8[($243)]=0; //@line 249 "../../../src/sdl/menu.c"
 var $244=$id_label; //@line 250 "../../../src/sdl/menu.c"
 var $245=$menu; //@line 250 "../../../src/sdl/menu.c"
 var $246=(($245+4)|0); //@line 250 "../../../src/sdl/menu.c"
 var $247=(($246+($244<<2))|0); //@line 250 "../../../src/sdl/menu.c"
 var $248=HEAP32[(($247)>>2)]; //@line 250 "../../../src/sdl/menu.c"
 var $249=(($248+12)|0); //@line 250 "../../../src/sdl/menu.c"
 var $250=HEAP32[(($249)>>2)]; //@line 250 "../../../src/sdl/menu.c"
 var $251=((($250)+(50))|0); //@line 250 "../../../src/sdl/menu.c"
 var $252=$x; //@line 250 "../../../src/sdl/menu.c"
 var $253=((($252)+($251))|0); //@line 250 "../../../src/sdl/menu.c"
 $x=$253; //@line 250 "../../../src/sdl/menu.c"
 var $254=$id_label; //@line 251 "../../../src/sdl/menu.c"
 var $255=((($254)+(1))|0); //@line 251 "../../../src/sdl/menu.c"
 $id_label=$255; //@line 251 "../../../src/sdl/menu.c"
 var $256=_creer_groupe_radio(1); //@line 257 "../../../src/sdl/menu.c"
 $groupe_programme_j2=$256; //@line 257 "../../../src/sdl/menu.c"
 var $257=$groupe_programme_j2; //@line 258 "../../../src/sdl/menu.c"
 var $258=$x; //@line 258 "../../../src/sdl/menu.c"
 var $259=((($258)+(100))|0); //@line 258 "../../../src/sdl/menu.c"
 var $260=$y; //@line 258 "../../../src/sdl/menu.c"
 _groupe_radio_ajouter($257,88,$259,$260); //@line 258 "../../../src/sdl/menu.c"
 var $261=$groupe_programme_j2; //@line 260 "../../../src/sdl/menu.c"
 var $262=(($261+16)|0); //@line 260 "../../../src/sdl/menu.c"
 HEAP8[($262)]=0; //@line 260 "../../../src/sdl/menu.c"
 var $263=$groupe_programme_j2; //@line 261 "../../../src/sdl/menu.c"
 var $264=$id_groupe; //@line 261 "../../../src/sdl/menu.c"
 var $265=((($264)+(1))|0); //@line 261 "../../../src/sdl/menu.c"
 $id_groupe=$265; //@line 261 "../../../src/sdl/menu.c"
 var $266=$menu; //@line 261 "../../../src/sdl/menu.c"
 var $267=(($266+48)|0); //@line 261 "../../../src/sdl/menu.c"
 var $268=(($267+($264<<2))|0); //@line 261 "../../../src/sdl/menu.c"
 HEAP32[(($268)>>2)]=$263; //@line 261 "../../../src/sdl/menu.c"
 var $269=$initx; //@line 263 "../../../src/sdl/menu.c"
 $x=$269; //@line 263 "../../../src/sdl/menu.c"
 var $270=$y; //@line 264 "../../../src/sdl/menu.c"
 var $271=((($270)+(60))|0); //@line 264 "../../../src/sdl/menu.c"
 $y=$271; //@line 264 "../../../src/sdl/menu.c"
 var $272=$x; //@line 267 "../../../src/sdl/menu.c"
 var $273=$y; //@line 267 "../../../src/sdl/menu.c"
 var $274=_creer_label(1312,$272,$273,0,1); //@line 267 "../../../src/sdl/menu.c"
 var $275=$id_label; //@line 267 "../../../src/sdl/menu.c"
 var $276=$menu; //@line 267 "../../../src/sdl/menu.c"
 var $277=(($276+4)|0); //@line 267 "../../../src/sdl/menu.c"
 var $278=(($277+($275<<2))|0); //@line 267 "../../../src/sdl/menu.c"
 HEAP32[(($278)>>2)]=$274; //@line 267 "../../../src/sdl/menu.c"
 var $279=$id_label; //@line 268 "../../../src/sdl/menu.c"
 var $280=$menu; //@line 268 "../../../src/sdl/menu.c"
 var $281=(($280+4)|0); //@line 268 "../../../src/sdl/menu.c"
 var $282=(($281+($279<<2))|0); //@line 268 "../../../src/sdl/menu.c"
 var $283=HEAP32[(($282)>>2)]; //@line 268 "../../../src/sdl/menu.c"
 var $284=(($283+12)|0); //@line 268 "../../../src/sdl/menu.c"
 var $285=HEAP32[(($284)>>2)]; //@line 268 "../../../src/sdl/menu.c"
 var $286=((($285)+(50))|0); //@line 268 "../../../src/sdl/menu.c"
 var $287=$x; //@line 268 "../../../src/sdl/menu.c"
 var $288=((($287)+($286))|0); //@line 268 "../../../src/sdl/menu.c"
 $x=$288; //@line 268 "../../../src/sdl/menu.c"
 var $289=$id_label; //@line 269 "../../../src/sdl/menu.c"
 var $290=((($289)+(1))|0); //@line 269 "../../../src/sdl/menu.c"
 $id_label=$290; //@line 269 "../../../src/sdl/menu.c"
 var $291=_creer_groupe_radio(3); //@line 270 "../../../src/sdl/menu.c"
 $groupe_taille=$291; //@line 270 "../../../src/sdl/menu.c"
 var $292=$groupe_taille; //@line 271 "../../../src/sdl/menu.c"
 var $293=$x; //@line 271 "../../../src/sdl/menu.c"
 var $294=$y; //@line 271 "../../../src/sdl/menu.c"
 _groupe_radio_ajouter($292,1136,$293,$294); //@line 271 "../../../src/sdl/menu.c"
 var $295=$groupe_taille; //@line 272 "../../../src/sdl/menu.c"
 var $296=$x; //@line 272 "../../../src/sdl/menu.c"
 var $297=((($296)+(100))|0); //@line 272 "../../../src/sdl/menu.c"
 var $298=$y; //@line 272 "../../../src/sdl/menu.c"
 _groupe_radio_ajouter($295,1096,$297,$298); //@line 272 "../../../src/sdl/menu.c"
 var $299=$groupe_taille; //@line 273 "../../../src/sdl/menu.c"
 var $300=$x; //@line 273 "../../../src/sdl/menu.c"
 var $301=((($300)+(200))|0); //@line 273 "../../../src/sdl/menu.c"
 var $302=$y; //@line 273 "../../../src/sdl/menu.c"
 _groupe_radio_ajouter($299,1056,$301,$302); //@line 273 "../../../src/sdl/menu.c"
 var $303=$groupe_taille; //@line 274 "../../../src/sdl/menu.c"
 var $304=$id_groupe; //@line 274 "../../../src/sdl/menu.c"
 var $305=((($304)+(1))|0); //@line 274 "../../../src/sdl/menu.c"
 $id_groupe=$305; //@line 274 "../../../src/sdl/menu.c"
 var $306=$menu; //@line 274 "../../../src/sdl/menu.c"
 var $307=(($306+48)|0); //@line 274 "../../../src/sdl/menu.c"
 var $308=(($307+($304<<2))|0); //@line 274 "../../../src/sdl/menu.c"
 HEAP32[(($308)>>2)]=$303; //@line 274 "../../../src/sdl/menu.c"
 var $309=$initx; //@line 276 "../../../src/sdl/menu.c"
 $x=$309; //@line 276 "../../../src/sdl/menu.c"
 var $310=$y; //@line 277 "../../../src/sdl/menu.c"
 var $311=((($310)+(30))|0); //@line 277 "../../../src/sdl/menu.c"
 $y=$311; //@line 277 "../../../src/sdl/menu.c"
 var $312=$x; //@line 280 "../../../src/sdl/menu.c"
 var $313=$y; //@line 280 "../../../src/sdl/menu.c"
 var $314=_creer_label(1008,$312,$313,0,1); //@line 280 "../../../src/sdl/menu.c"
 var $315=$id_label; //@line 280 "../../../src/sdl/menu.c"
 var $316=$menu; //@line 280 "../../../src/sdl/menu.c"
 var $317=(($316+4)|0); //@line 280 "../../../src/sdl/menu.c"
 var $318=(($317+($315<<2))|0); //@line 280 "../../../src/sdl/menu.c"
 HEAP32[(($318)>>2)]=$314; //@line 280 "../../../src/sdl/menu.c"
 var $319=$id_label; //@line 281 "../../../src/sdl/menu.c"
 var $320=$menu; //@line 281 "../../../src/sdl/menu.c"
 var $321=(($320+4)|0); //@line 281 "../../../src/sdl/menu.c"
 var $322=(($321+($319<<2))|0); //@line 281 "../../../src/sdl/menu.c"
 var $323=HEAP32[(($322)>>2)]; //@line 281 "../../../src/sdl/menu.c"
 var $324=(($323+12)|0); //@line 281 "../../../src/sdl/menu.c"
 var $325=HEAP32[(($324)>>2)]; //@line 281 "../../../src/sdl/menu.c"
 var $326=((($325)+(20))|0); //@line 281 "../../../src/sdl/menu.c"
 var $327=$x; //@line 281 "../../../src/sdl/menu.c"
 var $328=((($327)+($326))|0); //@line 281 "../../../src/sdl/menu.c"
 $x=$328; //@line 281 "../../../src/sdl/menu.c"
 var $329=$id_label; //@line 282 "../../../src/sdl/menu.c"
 var $330=((($329)+(1))|0); //@line 282 "../../../src/sdl/menu.c"
 $id_label=$330; //@line 282 "../../../src/sdl/menu.c"
 _set_color(150,150,150); //@line 283 "../../../src/sdl/menu.c"
 var $331=$x; //@line 284 "../../../src/sdl/menu.c"
 var $332=$y; //@line 284 "../../../src/sdl/menu.c"
 var $333=_creer_textinput($331,$332,60,20,3); //@line 284 "../../../src/sdl/menu.c"
 var $334=$id_textinput; //@line 284 "../../../src/sdl/menu.c"
 var $335=$menu; //@line 284 "../../../src/sdl/menu.c"
 var $336=(($335+68)|0); //@line 284 "../../../src/sdl/menu.c"
 var $337=(($336+($334<<2))|0); //@line 284 "../../../src/sdl/menu.c"
 HEAP32[(($337)>>2)]=$333; //@line 284 "../../../src/sdl/menu.c"
 var $338=$id_textinput; //@line 285 "../../../src/sdl/menu.c"
 var $339=((($338)+(1))|0); //@line 285 "../../../src/sdl/menu.c"
 $id_textinput=$339; //@line 285 "../../../src/sdl/menu.c"
 var $340=$id_label; //@line 287 "../../../src/sdl/menu.c"
 var $341=($340|0)==8; //@line 287 "../../../src/sdl/menu.c"
  //@line 287 "../../../src/sdl/menu.c"
 if ($341) {
  var $345=0;
 } else {
  ___assert_fail(984,944,287,1472); //@line 287 "../../../src/sdl/menu.c"
  throw "Reached an unreachable!"; //@line 287 "../../../src/sdl/menu.c"
   //@line 287 "../../../src/sdl/menu.c"
 }
 var $345;
 var $346=($345&1); //@line 287 "../../../src/sdl/menu.c"
 var $347=$id_bouton; //@line 288 "../../../src/sdl/menu.c"
 var $348=($347|0)==3; //@line 288 "../../../src/sdl/menu.c"
  //@line 288 "../../../src/sdl/menu.c"
 if ($348) {
  var $352=1;
 } else {
  ___assert_fail(840,944,288,1472); //@line 288 "../../../src/sdl/menu.c"
  throw "Reached an unreachable!"; //@line 288 "../../../src/sdl/menu.c"
   //@line 288 "../../../src/sdl/menu.c"
 }
 var $352;
 var $353=($352&1); //@line 288 "../../../src/sdl/menu.c"
 var $354=$id_groupe; //@line 289 "../../../src/sdl/menu.c"
 var $355=($354|0)==5; //@line 289 "../../../src/sdl/menu.c"
  //@line 289 "../../../src/sdl/menu.c"
 if ($355) {
  var $359=1;
 } else {
  ___assert_fail(792,944,289,1472); //@line 289 "../../../src/sdl/menu.c"
  throw "Reached an unreachable!"; //@line 289 "../../../src/sdl/menu.c"
   //@line 289 "../../../src/sdl/menu.c"
 }
 var $359;
 var $360=($359&1); //@line 289 "../../../src/sdl/menu.c"
 var $361=$id_textinput; //@line 290 "../../../src/sdl/menu.c"
 var $362=($361|0)==3; //@line 290 "../../../src/sdl/menu.c"
  //@line 290 "../../../src/sdl/menu.c"
 if ($362) {
  var $366=1;
  var $366;
  var $367=($366&1); //@line 290 "../../../src/sdl/menu.c"
  var $368=$state; //@line 291 "../../../src/sdl/menu.c"
  STACKTOP=sp;return $368; //@line 291 "../../../src/sdl/menu.c"
 }
 ___assert_fail(720,944,290,1472); //@line 290 "../../../src/sdl/menu.c"
 throw "Reached an unreachable!"; //@line 290 "../../../src/sdl/menu.c"
  //@line 290 "../../../src/sdl/menu.c"
 var $366;
 var $367=($366&1); //@line 290 "../../../src/sdl/menu.c"
 var $368=$state; //@line 291 "../../../src/sdl/menu.c"
 STACKTOP=sp;return $368; //@line 291 "../../../src/sdl/menu.c"
}


function _afficher_menu($state,$surface){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $menu;
 var $i;
 var $l;
 var $i1;
 var $b;
 var $i2;
 var $g;
 var $i3;
 var $ti;
 $1=$state;
 $2=$surface;
 var $3=$1; //@line 320 "../../../src/sdl/menu.c"
 var $4=(($3+28)|0); //@line 320 "../../../src/sdl/menu.c"
 var $5=HEAP32[(($4)>>2)]; //@line 320 "../../../src/sdl/menu.c"
 var $6=$5; //@line 320 "../../../src/sdl/menu.c"
 $menu=$6; //@line 320 "../../../src/sdl/menu.c"
 var $7=$2; //@line 321 "../../../src/sdl/menu.c"
 var $8=$menu; //@line 321 "../../../src/sdl/menu.c"
 var $9=(($8)|0); //@line 321 "../../../src/sdl/menu.c"
 var $10=HEAP32[(($9)>>2)]; //@line 321 "../../../src/sdl/menu.c"
 _afficher_label($7,$10); //@line 321 "../../../src/sdl/menu.c"
 _set_color(50,50,50); //@line 322 "../../../src/sdl/menu.c"
 var $11=$2; //@line 323 "../../../src/sdl/menu.c"
 _draw_rect($11,120,136,560,408); //@line 323 "../../../src/sdl/menu.c"
 $i=0; //@line 324 "../../../src/sdl/menu.c"
  //@line 324 "../../../src/sdl/menu.c"
 while(1) {
  var $13=$i; //@line 324 "../../../src/sdl/menu.c"
  var $14=($13|0)<8; //@line 324 "../../../src/sdl/menu.c"
   //@line 324 "../../../src/sdl/menu.c"
  if (!($14)) {
   break;
  }
  var $16=$i; //@line 325 "../../../src/sdl/menu.c"
  var $17=$menu; //@line 325 "../../../src/sdl/menu.c"
  var $18=(($17+4)|0); //@line 325 "../../../src/sdl/menu.c"
  var $19=(($18+($16<<2))|0); //@line 325 "../../../src/sdl/menu.c"
  var $20=HEAP32[(($19)>>2)]; //@line 325 "../../../src/sdl/menu.c"
  $l=$20; //@line 325 "../../../src/sdl/menu.c"
  var $21=$2; //@line 326 "../../../src/sdl/menu.c"
  var $22=$l; //@line 326 "../../../src/sdl/menu.c"
  _afficher_label($21,$22); //@line 326 "../../../src/sdl/menu.c"
   //@line 327 "../../../src/sdl/menu.c"
  var $24=$i; //@line 324 "../../../src/sdl/menu.c"
  var $25=((($24)+(1))|0); //@line 324 "../../../src/sdl/menu.c"
  $i=$25; //@line 324 "../../../src/sdl/menu.c"
   //@line 324 "../../../src/sdl/menu.c"
 }
 $i1=0; //@line 328 "../../../src/sdl/menu.c"
  //@line 328 "../../../src/sdl/menu.c"
 while(1) {
  var $28=$i1; //@line 328 "../../../src/sdl/menu.c"
  var $29=($28|0)<3; //@line 328 "../../../src/sdl/menu.c"
   //@line 328 "../../../src/sdl/menu.c"
  if (!($29)) {
   break;
  }
  var $31=$i1; //@line 329 "../../../src/sdl/menu.c"
  var $32=$menu; //@line 329 "../../../src/sdl/menu.c"
  var $33=(($32+36)|0); //@line 329 "../../../src/sdl/menu.c"
  var $34=(($33+($31<<2))|0); //@line 329 "../../../src/sdl/menu.c"
  var $35=HEAP32[(($34)>>2)]; //@line 329 "../../../src/sdl/menu.c"
  $b=$35; //@line 329 "../../../src/sdl/menu.c"
  var $36=$2; //@line 330 "../../../src/sdl/menu.c"
  var $37=$b; //@line 330 "../../../src/sdl/menu.c"
  _afficher_bouton($36,$37); //@line 330 "../../../src/sdl/menu.c"
   //@line 331 "../../../src/sdl/menu.c"
  var $39=$i1; //@line 328 "../../../src/sdl/menu.c"
  var $40=((($39)+(1))|0); //@line 328 "../../../src/sdl/menu.c"
  $i1=$40; //@line 328 "../../../src/sdl/menu.c"
   //@line 328 "../../../src/sdl/menu.c"
 }
 $i2=0; //@line 332 "../../../src/sdl/menu.c"
  //@line 332 "../../../src/sdl/menu.c"
 while(1) {
  var $43=$i2; //@line 332 "../../../src/sdl/menu.c"
  var $44=($43|0)<5; //@line 332 "../../../src/sdl/menu.c"
   //@line 332 "../../../src/sdl/menu.c"
  if (!($44)) {
   break;
  }
  var $46=$i2; //@line 333 "../../../src/sdl/menu.c"
  var $47=$menu; //@line 333 "../../../src/sdl/menu.c"
  var $48=(($47+48)|0); //@line 333 "../../../src/sdl/menu.c"
  var $49=(($48+($46<<2))|0); //@line 333 "../../../src/sdl/menu.c"
  var $50=HEAP32[(($49)>>2)]; //@line 333 "../../../src/sdl/menu.c"
  $g=$50; //@line 333 "../../../src/sdl/menu.c"
  var $51=$2; //@line 334 "../../../src/sdl/menu.c"
  var $52=$g; //@line 334 "../../../src/sdl/menu.c"
  _afficher_groupe_radio($51,$52); //@line 334 "../../../src/sdl/menu.c"
   //@line 335 "../../../src/sdl/menu.c"
  var $54=$i2; //@line 332 "../../../src/sdl/menu.c"
  var $55=((($54)+(1))|0); //@line 332 "../../../src/sdl/menu.c"
  $i2=$55; //@line 332 "../../../src/sdl/menu.c"
   //@line 332 "../../../src/sdl/menu.c"
 }
 $i3=0; //@line 336 "../../../src/sdl/menu.c"
  //@line 336 "../../../src/sdl/menu.c"
 while(1) {
  var $58=$i3; //@line 336 "../../../src/sdl/menu.c"
  var $59=($58|0)<3; //@line 336 "../../../src/sdl/menu.c"
   //@line 336 "../../../src/sdl/menu.c"
  if (!($59)) {
   break;
  }
  var $61=$i3; //@line 337 "../../../src/sdl/menu.c"
  var $62=$menu; //@line 337 "../../../src/sdl/menu.c"
  var $63=(($62+68)|0); //@line 337 "../../../src/sdl/menu.c"
  var $64=(($63+($61<<2))|0); //@line 337 "../../../src/sdl/menu.c"
  var $65=HEAP32[(($64)>>2)]; //@line 337 "../../../src/sdl/menu.c"
  $ti=$65; //@line 337 "../../../src/sdl/menu.c"
  var $66=$2; //@line 338 "../../../src/sdl/menu.c"
  var $67=$ti; //@line 338 "../../../src/sdl/menu.c"
  _afficher_textinput($66,$67); //@line 338 "../../../src/sdl/menu.c"
   //@line 339 "../../../src/sdl/menu.c"
  var $69=$i3; //@line 336 "../../../src/sdl/menu.c"
  var $70=((($69)+(1))|0); //@line 336 "../../../src/sdl/menu.c"
  $i3=$70; //@line 336 "../../../src/sdl/menu.c"
   //@line 336 "../../../src/sdl/menu.c"
 }
 STACKTOP=sp;return; //@line 340 "../../../src/sdl/menu.c"
}


function _event_menu($state,$event){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $event; $event=STACKTOP;STACKTOP = (STACKTOP + 48)|0;(assert((STACKTOP|0) < (STACK_MAX|0))|0);(_memcpy($event, tempParam, 48)|0);
 var $1;
 var $menu;
 var $i;
 var $b;
 var $i1;
 var $g;
 var $i2;
 var $ti;
 $1=$state;
 var $2=$1; //@line 344 "../../../src/sdl/menu.c"
 var $3=(($2+28)|0); //@line 344 "../../../src/sdl/menu.c"
 var $4=HEAP32[(($3)>>2)]; //@line 344 "../../../src/sdl/menu.c"
 var $5=$4; //@line 344 "../../../src/sdl/menu.c"
 $menu=$5; //@line 344 "../../../src/sdl/menu.c"
 $i=0; //@line 345 "../../../src/sdl/menu.c"
  //@line 345 "../../../src/sdl/menu.c"
 while(1) {
  var $7=$i; //@line 345 "../../../src/sdl/menu.c"
  var $8=($7|0)<3; //@line 345 "../../../src/sdl/menu.c"
   //@line 345 "../../../src/sdl/menu.c"
  if (!($8)) {
   break;
  }
  var $10=$i; //@line 346 "../../../src/sdl/menu.c"
  var $11=$menu; //@line 346 "../../../src/sdl/menu.c"
  var $12=(($11+36)|0); //@line 346 "../../../src/sdl/menu.c"
  var $13=(($12+($10<<2))|0); //@line 346 "../../../src/sdl/menu.c"
  var $14=HEAP32[(($13)>>2)]; //@line 346 "../../../src/sdl/menu.c"
  $b=$14; //@line 346 "../../../src/sdl/menu.c"
  var $15=$b; //@line 347 "../../../src/sdl/menu.c"
  _utiliser_event_bouton($15,$event); //@line 347 "../../../src/sdl/menu.c"
   //@line 348 "../../../src/sdl/menu.c"
  var $17=$i; //@line 345 "../../../src/sdl/menu.c"
  var $18=((($17)+(1))|0); //@line 345 "../../../src/sdl/menu.c"
  $i=$18; //@line 345 "../../../src/sdl/menu.c"
   //@line 345 "../../../src/sdl/menu.c"
 }
 $i1=0; //@line 349 "../../../src/sdl/menu.c"
  //@line 349 "../../../src/sdl/menu.c"
 while(1) {
  var $21=$i1; //@line 349 "../../../src/sdl/menu.c"
  var $22=($21|0)<5; //@line 349 "../../../src/sdl/menu.c"
   //@line 349 "../../../src/sdl/menu.c"
  if (!($22)) {
   break;
  }
  var $24=$i1; //@line 350 "../../../src/sdl/menu.c"
  var $25=$menu; //@line 350 "../../../src/sdl/menu.c"
  var $26=(($25+48)|0); //@line 350 "../../../src/sdl/menu.c"
  var $27=(($26+($24<<2))|0); //@line 350 "../../../src/sdl/menu.c"
  var $28=HEAP32[(($27)>>2)]; //@line 350 "../../../src/sdl/menu.c"
  $g=$28; //@line 350 "../../../src/sdl/menu.c"
  var $29=$g; //@line 351 "../../../src/sdl/menu.c"
  _utiliser_event_groupe_radio($29,$event); //@line 351 "../../../src/sdl/menu.c"
   //@line 352 "../../../src/sdl/menu.c"
  var $31=$i1; //@line 349 "../../../src/sdl/menu.c"
  var $32=((($31)+(1))|0); //@line 349 "../../../src/sdl/menu.c"
  $i1=$32; //@line 349 "../../../src/sdl/menu.c"
   //@line 349 "../../../src/sdl/menu.c"
 }
 $i2=0; //@line 353 "../../../src/sdl/menu.c"
  //@line 353 "../../../src/sdl/menu.c"
 while(1) {
  var $35=$i2; //@line 353 "../../../src/sdl/menu.c"
  var $36=($35|0)<3; //@line 353 "../../../src/sdl/menu.c"
   //@line 353 "../../../src/sdl/menu.c"
  if (!($36)) {
   break;
  }
  var $38=$i2; //@line 354 "../../../src/sdl/menu.c"
  var $39=$menu; //@line 354 "../../../src/sdl/menu.c"
  var $40=(($39+68)|0); //@line 354 "../../../src/sdl/menu.c"
  var $41=(($40+($38<<2))|0); //@line 354 "../../../src/sdl/menu.c"
  var $42=HEAP32[(($41)>>2)]; //@line 354 "../../../src/sdl/menu.c"
  $ti=$42; //@line 354 "../../../src/sdl/menu.c"
  var $43=$ti; //@line 355 "../../../src/sdl/menu.c"
  _utiliser_event_textinput($43,$event); //@line 355 "../../../src/sdl/menu.c"
   //@line 356 "../../../src/sdl/menu.c"
  var $45=$i2; //@line 353 "../../../src/sdl/menu.c"
  var $46=((($45)+(1))|0); //@line 353 "../../../src/sdl/menu.c"
  $i2=$46; //@line 353 "../../../src/sdl/menu.c"
   //@line 353 "../../../src/sdl/menu.c"
 }
 STACKTOP=sp;return; //@line 357 "../../../src/sdl/menu.c"
}


function _mise_a_jour_menu($state,$dt){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $menu;
 var $i;
 var $b;
 var $i1;
 var $ti;
 $1=$state;
 $2=$dt;
 var $3=$1; //@line 361 "../../../src/sdl/menu.c"
 var $4=(($3+28)|0); //@line 361 "../../../src/sdl/menu.c"
 var $5=HEAP32[(($4)>>2)]; //@line 361 "../../../src/sdl/menu.c"
 var $6=$5; //@line 361 "../../../src/sdl/menu.c"
 $menu=$6; //@line 361 "../../../src/sdl/menu.c"
 $i=0; //@line 362 "../../../src/sdl/menu.c"
  //@line 362 "../../../src/sdl/menu.c"
 while(1) {
  var $8=$i; //@line 362 "../../../src/sdl/menu.c"
  var $9=($8|0)<3; //@line 362 "../../../src/sdl/menu.c"
   //@line 362 "../../../src/sdl/menu.c"
  if (!($9)) {
   break;
  }
  var $11=$i; //@line 363 "../../../src/sdl/menu.c"
  var $12=$menu; //@line 363 "../../../src/sdl/menu.c"
  var $13=(($12+36)|0); //@line 363 "../../../src/sdl/menu.c"
  var $14=(($13+($11<<2))|0); //@line 363 "../../../src/sdl/menu.c"
  var $15=HEAP32[(($14)>>2)]; //@line 363 "../../../src/sdl/menu.c"
  $b=$15; //@line 363 "../../../src/sdl/menu.c"
  var $16=$b; //@line 364 "../../../src/sdl/menu.c"
  var $17=$2; //@line 364 "../../../src/sdl/menu.c"
  _mise_a_jour_bouton($16,$17); //@line 364 "../../../src/sdl/menu.c"
   //@line 365 "../../../src/sdl/menu.c"
  var $19=$i; //@line 362 "../../../src/sdl/menu.c"
  var $20=((($19)+(1))|0); //@line 362 "../../../src/sdl/menu.c"
  $i=$20; //@line 362 "../../../src/sdl/menu.c"
   //@line 362 "../../../src/sdl/menu.c"
 }
 $i1=0; //@line 366 "../../../src/sdl/menu.c"
  //@line 366 "../../../src/sdl/menu.c"
 while(1) {
  var $23=$i1; //@line 366 "../../../src/sdl/menu.c"
  var $24=($23|0)<3; //@line 366 "../../../src/sdl/menu.c"
   //@line 366 "../../../src/sdl/menu.c"
  if (!($24)) {
   break;
  }
  var $26=$i1; //@line 367 "../../../src/sdl/menu.c"
  var $27=$menu; //@line 367 "../../../src/sdl/menu.c"
  var $28=(($27+68)|0); //@line 367 "../../../src/sdl/menu.c"
  var $29=(($28+($26<<2))|0); //@line 367 "../../../src/sdl/menu.c"
  var $30=HEAP32[(($29)>>2)]; //@line 367 "../../../src/sdl/menu.c"
  $ti=$30; //@line 367 "../../../src/sdl/menu.c"
  var $31=$ti; //@line 368 "../../../src/sdl/menu.c"
  var $32=$2; //@line 368 "../../../src/sdl/menu.c"
  _mise_a_jour_textinput($31,$32); //@line 368 "../../../src/sdl/menu.c"
   //@line 369 "../../../src/sdl/menu.c"
  var $34=$i1; //@line 366 "../../../src/sdl/menu.c"
  var $35=((($34)+(1))|0); //@line 366 "../../../src/sdl/menu.c"
  $i1=$35; //@line 366 "../../../src/sdl/menu.c"
   //@line 366 "../../../src/sdl/menu.c"
 }
 STACKTOP=sp;return; //@line 370 "../../../src/sdl/menu.c"
}


function _menu_bouton_quitter($bouton,$data){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $state;
 $1=$bouton;
 $2=$data;
 var $3=$1; //@line 374 "../../../src/sdl/menu.c"
 var $4=$2; //@line 375 "../../../src/sdl/menu.c"
 var $5=$4; //@line 375 "../../../src/sdl/menu.c"
 $state=$5; //@line 375 "../../../src/sdl/menu.c"
 var $6=$state; //@line 376 "../../../src/sdl/menu.c"
 var $7=(($6)|0); //@line 376 "../../../src/sdl/menu.c"
 HEAP8[($7)]=1; //@line 376 "../../../src/sdl/menu.c"
 STACKTOP=sp;return; //@line 377 "../../../src/sdl/menu.c"
}


function _menu_bouton_jouer($bouton,$data){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $state;
 var $menu;
 var $partie;
 var $new_state;
 $1=$bouton;
 $2=$data;
 var $3=$1; //@line 423 "../../../src/sdl/menu.c"
 var $4=$2; //@line 424 "../../../src/sdl/menu.c"
 var $5=$4; //@line 424 "../../../src/sdl/menu.c"
 $state=$5; //@line 424 "../../../src/sdl/menu.c"
 var $6=$state; //@line 425 "../../../src/sdl/menu.c"
 var $7=(($6+28)|0); //@line 425 "../../../src/sdl/menu.c"
 var $8=HEAP32[(($7)>>2)]; //@line 425 "../../../src/sdl/menu.c"
 var $9=$8; //@line 425 "../../../src/sdl/menu.c"
 $menu=$9; //@line 425 "../../../src/sdl/menu.c"
 var $10=_creer_partie(); //@line 427 "../../../src/sdl/menu.c"
 $partie=$10; //@line 427 "../../../src/sdl/menu.c"
 var $11=$partie; //@line 428 "../../../src/sdl/menu.c"
 var $12=$menu; //@line 428 "../../../src/sdl/menu.c"
 var $13=$12; //@line 428 "../../../src/sdl/menu.c"
 _initialisation_partie($11,246,$13); //@line 428 "../../../src/sdl/menu.c"
 var $14=$state; //@line 430 "../../../src/sdl/menu.c"
 var $15=$partie; //@line 430 "../../../src/sdl/menu.c"
 var $16=_creer_jouer($14,$15); //@line 430 "../../../src/sdl/menu.c"
 $new_state=$16; //@line 430 "../../../src/sdl/menu.c"
 var $17=$new_state; //@line 431 "../../../src/sdl/menu.c"
 _set_state($17); //@line 431 "../../../src/sdl/menu.c"
 STACKTOP=sp;return; //@line 432 "../../../src/sdl/menu.c"
}


function _menu_bouton_charger($bouton,$data){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $state;
 var $new_state;
 $1=$bouton;
 $2=$data;
 var $3=$1; //@line 436 "../../../src/sdl/menu.c"
 var $4=$2; //@line 437 "../../../src/sdl/menu.c"
 var $5=$4; //@line 437 "../../../src/sdl/menu.c"
 $state=$5; //@line 437 "../../../src/sdl/menu.c"
 var $6=$state; //@line 438 "../../../src/sdl/menu.c"
 var $7=_creer_charger($6); //@line 438 "../../../src/sdl/menu.c"
 $new_state=$7; //@line 438 "../../../src/sdl/menu.c"
 var $8=$new_state; //@line 439 "../../../src/sdl/menu.c"
 _set_state($8); //@line 439 "../../../src/sdl/menu.c"
 STACKTOP=sp;return; //@line 440 "../../../src/sdl/menu.c"
}


function _menu_radio_type_joueur($groupe,$data){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $state;
 var $menu;
 var $groupe_prog;
 var $label;
 $1=$groupe;
 $2=$data;
 var $3=$2; //@line 444 "../../../src/sdl/menu.c"
 var $4=$3; //@line 444 "../../../src/sdl/menu.c"
 $state=$4; //@line 444 "../../../src/sdl/menu.c"
 var $5=$state; //@line 445 "../../../src/sdl/menu.c"
 var $6=(($5+28)|0); //@line 445 "../../../src/sdl/menu.c"
 var $7=HEAP32[(($6)>>2)]; //@line 445 "../../../src/sdl/menu.c"
 var $8=$7; //@line 445 "../../../src/sdl/menu.c"
 $menu=$8; //@line 445 "../../../src/sdl/menu.c"
 var $9=$1; //@line 448 "../../../src/sdl/menu.c"
 var $10=$menu; //@line 448 "../../../src/sdl/menu.c"
 var $11=(($10+48)|0); //@line 448 "../../../src/sdl/menu.c"
 var $12=(($11)|0); //@line 448 "../../../src/sdl/menu.c"
 var $13=HEAP32[(($12)>>2)]; //@line 448 "../../../src/sdl/menu.c"
 var $14=($9|0)==($13|0); //@line 448 "../../../src/sdl/menu.c"
  //@line 448 "../../../src/sdl/menu.c"
 if ($14) {
  $groupe_prog=1; //@line 449 "../../../src/sdl/menu.c"
  $label=2; //@line 450 "../../../src/sdl/menu.c"
   //@line 451 "../../../src/sdl/menu.c"
 } else {
  $groupe_prog=3; //@line 452 "../../../src/sdl/menu.c"
  $label=5; //@line 453 "../../../src/sdl/menu.c"
 }
 var $18=$1; //@line 455 "../../../src/sdl/menu.c"
 var $19=(($18+12)|0); //@line 455 "../../../src/sdl/menu.c"
 var $20=HEAP32[(($19)>>2)]; //@line 455 "../../../src/sdl/menu.c"
 var $21=($20|0)==0; //@line 455 "../../../src/sdl/menu.c"
  //@line 455 "../../../src/sdl/menu.c"
 if ($21) {
  var $23=$groupe_prog; //@line 456 "../../../src/sdl/menu.c"
  var $24=$menu; //@line 456 "../../../src/sdl/menu.c"
  var $25=(($24+48)|0); //@line 456 "../../../src/sdl/menu.c"
  var $26=(($25+($23<<2))|0); //@line 456 "../../../src/sdl/menu.c"
  var $27=HEAP32[(($26)>>2)]; //@line 456 "../../../src/sdl/menu.c"
  var $28=(($27+16)|0); //@line 456 "../../../src/sdl/menu.c"
  HEAP8[($28)]=0; //@line 456 "../../../src/sdl/menu.c"
  var $29=$label; //@line 457 "../../../src/sdl/menu.c"
  var $30=$menu; //@line 457 "../../../src/sdl/menu.c"
  var $31=(($30+4)|0); //@line 457 "../../../src/sdl/menu.c"
  var $32=(($31+($29<<2))|0); //@line 457 "../../../src/sdl/menu.c"
  var $33=HEAP32[(($32)>>2)]; //@line 457 "../../../src/sdl/menu.c"
  var $34=(($33+28)|0); //@line 457 "../../../src/sdl/menu.c"
  HEAP8[($34)]=0; //@line 457 "../../../src/sdl/menu.c"
   //@line 458 "../../../src/sdl/menu.c"
  STACKTOP=sp;return; //@line 462 "../../../src/sdl/menu.c"
 } else {
  var $36=$groupe_prog; //@line 459 "../../../src/sdl/menu.c"
  var $37=$menu; //@line 459 "../../../src/sdl/menu.c"
  var $38=(($37+48)|0); //@line 459 "../../../src/sdl/menu.c"
  var $39=(($38+($36<<2))|0); //@line 459 "../../../src/sdl/menu.c"
  var $40=HEAP32[(($39)>>2)]; //@line 459 "../../../src/sdl/menu.c"
  var $41=(($40+16)|0); //@line 459 "../../../src/sdl/menu.c"
  HEAP8[($41)]=1; //@line 459 "../../../src/sdl/menu.c"
  var $42=$label; //@line 460 "../../../src/sdl/menu.c"
  var $43=$menu; //@line 460 "../../../src/sdl/menu.c"
  var $44=(($43+4)|0); //@line 460 "../../../src/sdl/menu.c"
  var $45=(($44+($42<<2))|0); //@line 460 "../../../src/sdl/menu.c"
  var $46=HEAP32[(($45)>>2)]; //@line 460 "../../../src/sdl/menu.c"
  var $47=(($46+28)|0); //@line 460 "../../../src/sdl/menu.c"
  HEAP8[($47)]=1; //@line 460 "../../../src/sdl/menu.c"
  STACKTOP=sp;return; //@line 462 "../../../src/sdl/menu.c"
 }
}


function _construction_function($question,$partie,$userdata){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $menu;
 var $id;
 var $taille;
 var $handicap;
 $1=$question;
 $2=$partie;
 $3=$userdata;
 var $4=$3; //@line 381 "../../../src/sdl/menu.c"
 var $5=$4; //@line 381 "../../../src/sdl/menu.c"
 $menu=$5; //@line 381 "../../../src/sdl/menu.c"
 var $6=$1; //@line 382 "../../../src/sdl/menu.c"
 switch (($6|0)) {
 case 3: {
  var $8=$menu; //@line 384 "../../../src/sdl/menu.c"
  var $9=(($8+48)|0); //@line 384 "../../../src/sdl/menu.c"
  var $10=(($9+8)|0); //@line 384 "../../../src/sdl/menu.c"
  var $11=HEAP32[(($10)>>2)]; //@line 384 "../../../src/sdl/menu.c"
  var $12=(($11+12)|0); //@line 384 "../../../src/sdl/menu.c"
  var $13=HEAP32[(($12)>>2)]; //@line 384 "../../../src/sdl/menu.c"
  var $14=($13|0)==0; //@line 384 "../../../src/sdl/menu.c"
  var $15=($14?0:1); //@line 384 "../../../src/sdl/menu.c"
  var $16=$2; //@line 384 "../../../src/sdl/menu.c"
  var $17=(($16+4)|0); //@line 384 "../../../src/sdl/menu.c"
  var $18=(($17)|0); //@line 384 "../../../src/sdl/menu.c"
  var $19=(($18)|0); //@line 384 "../../../src/sdl/menu.c"
  HEAP32[(($19)>>2)]=$15; //@line 384 "../../../src/sdl/menu.c"
   //@line 385 "../../../src/sdl/menu.c"
  STACKTOP=sp;return 1; //@line 419 "../../../src/sdl/menu.c"
  break;
 }
 case 4: {
  var $21=$2; //@line 387 "../../../src/sdl/menu.c"
  var $22=(($21+4)|0); //@line 387 "../../../src/sdl/menu.c"
  var $23=(($22)|0); //@line 387 "../../../src/sdl/menu.c"
  var $24=(($23+4)|0); //@line 387 "../../../src/sdl/menu.c"
  var $25=(($24)|0); //@line 387 "../../../src/sdl/menu.c"
  var $26=$menu; //@line 387 "../../../src/sdl/menu.c"
  var $27=(($26+68)|0); //@line 387 "../../../src/sdl/menu.c"
  var $28=(($27+4)|0); //@line 387 "../../../src/sdl/menu.c"
  var $29=HEAP32[(($28)>>2)]; //@line 387 "../../../src/sdl/menu.c"
  var $30=(($29+12)|0); //@line 387 "../../../src/sdl/menu.c"
  var $31=HEAP32[(($30)>>2)]; //@line 387 "../../../src/sdl/menu.c"
  var $32=_strcpy($25,$31); //@line 387 "../../../src/sdl/menu.c"
   //@line 388 "../../../src/sdl/menu.c"
  STACKTOP=sp;return 1; //@line 419 "../../../src/sdl/menu.c"
  break;
 }
 case 5: {
  var $34=$menu; //@line 390 "../../../src/sdl/menu.c"
  var $35=(($34+48)|0); //@line 390 "../../../src/sdl/menu.c"
  var $36=(($35+12)|0); //@line 390 "../../../src/sdl/menu.c"
  var $37=HEAP32[(($36)>>2)]; //@line 390 "../../../src/sdl/menu.c"
  var $38=(($37+12)|0); //@line 390 "../../../src/sdl/menu.c"
  var $39=HEAP32[(($38)>>2)]; //@line 390 "../../../src/sdl/menu.c"
  var $40=($39|0)==0; //@line 390 "../../../src/sdl/menu.c"
  var $41=($40?712:696); //@line 390 "../../../src/sdl/menu.c"
  var $42=_charger_ordinateur($41); //@line 390 "../../../src/sdl/menu.c"
  var $43=$2; //@line 390 "../../../src/sdl/menu.c"
  var $44=(($43+4)|0); //@line 390 "../../../src/sdl/menu.c"
  var $45=(($44)|0); //@line 390 "../../../src/sdl/menu.c"
  var $46=(($45+16)|0); //@line 390 "../../../src/sdl/menu.c"
  HEAP32[(($46)>>2)]=$42; //@line 390 "../../../src/sdl/menu.c"
   //@line 392 "../../../src/sdl/menu.c"
  STACKTOP=sp;return 1; //@line 419 "../../../src/sdl/menu.c"
  break;
 }
 case 0: {
  var $48=$menu; //@line 395 "../../../src/sdl/menu.c"
  var $49=(($48+48)|0); //@line 395 "../../../src/sdl/menu.c"
  var $50=(($49)|0); //@line 395 "../../../src/sdl/menu.c"
  var $51=HEAP32[(($50)>>2)]; //@line 395 "../../../src/sdl/menu.c"
  var $52=(($51+12)|0); //@line 395 "../../../src/sdl/menu.c"
  var $53=HEAP32[(($52)>>2)]; //@line 395 "../../../src/sdl/menu.c"
  var $54=($53|0)==0; //@line 395 "../../../src/sdl/menu.c"
  var $55=($54?0:1); //@line 395 "../../../src/sdl/menu.c"
  var $56=$2; //@line 395 "../../../src/sdl/menu.c"
  var $57=(($56+4)|0); //@line 395 "../../../src/sdl/menu.c"
  var $58=(($57+20)|0); //@line 395 "../../../src/sdl/menu.c"
  var $59=(($58)|0); //@line 395 "../../../src/sdl/menu.c"
  HEAP32[(($59)>>2)]=$55; //@line 395 "../../../src/sdl/menu.c"
   //@line 396 "../../../src/sdl/menu.c"
  STACKTOP=sp;return 1; //@line 419 "../../../src/sdl/menu.c"
  break;
 }
 case 1: {
  var $61=$2; //@line 398 "../../../src/sdl/menu.c"
  var $62=(($61+4)|0); //@line 398 "../../../src/sdl/menu.c"
  var $63=(($62+20)|0); //@line 398 "../../../src/sdl/menu.c"
  var $64=(($63+4)|0); //@line 398 "../../../src/sdl/menu.c"
  var $65=(($64)|0); //@line 398 "../../../src/sdl/menu.c"
  var $66=$menu; //@line 398 "../../../src/sdl/menu.c"
  var $67=(($66+68)|0); //@line 398 "../../../src/sdl/menu.c"
  var $68=(($67)|0); //@line 398 "../../../src/sdl/menu.c"
  var $69=HEAP32[(($68)>>2)]; //@line 398 "../../../src/sdl/menu.c"
  var $70=(($69+12)|0); //@line 398 "../../../src/sdl/menu.c"
  var $71=HEAP32[(($70)>>2)]; //@line 398 "../../../src/sdl/menu.c"
  var $72=_strcpy($65,$71); //@line 398 "../../../src/sdl/menu.c"
   //@line 399 "../../../src/sdl/menu.c"
  STACKTOP=sp;return 1; //@line 419 "../../../src/sdl/menu.c"
  break;
 }
 case 2: {
  var $74=$menu; //@line 401 "../../../src/sdl/menu.c"
  var $75=(($74+48)|0); //@line 401 "../../../src/sdl/menu.c"
  var $76=(($75+4)|0); //@line 401 "../../../src/sdl/menu.c"
  var $77=HEAP32[(($76)>>2)]; //@line 401 "../../../src/sdl/menu.c"
  var $78=(($77+12)|0); //@line 401 "../../../src/sdl/menu.c"
  var $79=HEAP32[(($78)>>2)]; //@line 401 "../../../src/sdl/menu.c"
  var $80=($79|0)==0; //@line 401 "../../../src/sdl/menu.c"
  var $81=($80?712:696); //@line 401 "../../../src/sdl/menu.c"
  var $82=_charger_ordinateur($81); //@line 401 "../../../src/sdl/menu.c"
  var $83=$2; //@line 401 "../../../src/sdl/menu.c"
  var $84=(($83+4)|0); //@line 401 "../../../src/sdl/menu.c"
  var $85=(($84+20)|0); //@line 401 "../../../src/sdl/menu.c"
  var $86=(($85+16)|0); //@line 401 "../../../src/sdl/menu.c"
  HEAP32[(($86)>>2)]=$82; //@line 401 "../../../src/sdl/menu.c"
   //@line 403 "../../../src/sdl/menu.c"
  STACKTOP=sp;return 1; //@line 419 "../../../src/sdl/menu.c"
  break;
 }
 case 6: {
  var $88=$menu; //@line 406 "../../../src/sdl/menu.c"
  var $89=(($88+48)|0); //@line 406 "../../../src/sdl/menu.c"
  var $90=(($89+16)|0); //@line 406 "../../../src/sdl/menu.c"
  var $91=HEAP32[(($90)>>2)]; //@line 406 "../../../src/sdl/menu.c"
  var $92=(($91+12)|0); //@line 406 "../../../src/sdl/menu.c"
  var $93=HEAP32[(($92)>>2)]; //@line 406 "../../../src/sdl/menu.c"
  $id=$93; //@line 406 "../../../src/sdl/menu.c"
  var $94=$id; //@line 407 "../../../src/sdl/menu.c"
  var $95=($94|0)==0; //@line 407 "../../../src/sdl/menu.c"
   //@line 407 "../../../src/sdl/menu.c"
  if ($95) {
    //@line 407 "../../../src/sdl/menu.c"
   var $102=9;
  } else {
   var $98=$id; //@line 407 "../../../src/sdl/menu.c"
   var $99=($98|0)==1; //@line 407 "../../../src/sdl/menu.c"
   var $100=($99?13:19); //@line 407 "../../../src/sdl/menu.c"
    //@line 407 "../../../src/sdl/menu.c"
   var $102=$100;
  }
  var $102; //@line 407 "../../../src/sdl/menu.c"
  $taille=$102; //@line 407 "../../../src/sdl/menu.c"
  var $103=$taille; //@line 408 "../../../src/sdl/menu.c"
  var $104=_creer_plateau($103); //@line 408 "../../../src/sdl/menu.c"
  var $105=$2; //@line 408 "../../../src/sdl/menu.c"
  var $106=(($105)|0); //@line 408 "../../../src/sdl/menu.c"
  HEAP32[(($106)>>2)]=$104; //@line 408 "../../../src/sdl/menu.c"
   //@line 409 "../../../src/sdl/menu.c"
  STACKTOP=sp;return 1; //@line 419 "../../../src/sdl/menu.c"
  break;
 }
 case 7: {
  var $108=$menu; //@line 412 "../../../src/sdl/menu.c"
  var $109=(($108+68)|0); //@line 412 "../../../src/sdl/menu.c"
  var $110=(($109+8)|0); //@line 412 "../../../src/sdl/menu.c"
  var $111=HEAP32[(($110)>>2)]; //@line 412 "../../../src/sdl/menu.c"
  var $112=(($111+12)|0); //@line 412 "../../../src/sdl/menu.c"
  var $113=HEAP32[(($112)>>2)]; //@line 412 "../../../src/sdl/menu.c"
  var $114=_atoi($113); //@line 412 "../../../src/sdl/menu.c"
  $handicap=$114; //@line 412 "../../../src/sdl/menu.c"
  var $115=$handicap; //@line 413 "../../../src/sdl/menu.c"
  var $116=$2; //@line 413 "../../../src/sdl/menu.c"
  var $117=(($116+44)|0); //@line 413 "../../../src/sdl/menu.c"
  HEAP32[(($117)>>2)]=$115; //@line 413 "../../../src/sdl/menu.c"
   //@line 414 "../../../src/sdl/menu.c"
  STACKTOP=sp;return 1; //@line 419 "../../../src/sdl/menu.c"
  break;
 }
 default: {
   //@line 416 "../../../src/sdl/menu.c"
  STACKTOP=sp;return 1; //@line 419 "../../../src/sdl/menu.c"
 }
 }
}


function _creer_charger($parent){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $state;
 var $charger;
 var $x;
 var $bouton;
 $1=$parent;
 var $2=_gosh_alloc_size(32); //@line 103 "../../../src/sdl/charger.c"
 var $3=$2; //@line 103 "../../../src/sdl/charger.c"
 $state=$3; //@line 103 "../../../src/sdl/charger.c"
 var $4=_gosh_alloc_size(32); //@line 104 "../../../src/sdl/charger.c"
 var $5=$4; //@line 104 "../../../src/sdl/charger.c"
 $charger=$5; //@line 104 "../../../src/sdl/charger.c"
 var $6=$charger; //@line 105 "../../../src/sdl/charger.c"
 var $7=$6; //@line 105 "../../../src/sdl/charger.c"
 var $8=$state; //@line 105 "../../../src/sdl/charger.c"
 var $9=(($8+28)|0); //@line 105 "../../../src/sdl/charger.c"
 HEAP32[(($9)>>2)]=$7; //@line 105 "../../../src/sdl/charger.c"
 var $10=$state; //@line 106 "../../../src/sdl/charger.c"
 var $11=(($10)|0); //@line 106 "../../../src/sdl/charger.c"
 HEAP8[($11)]=0; //@line 106 "../../../src/sdl/charger.c"
 var $12=$state; //@line 107 "../../../src/sdl/charger.c"
 var $13=(($12+4)|0); //@line 107 "../../../src/sdl/charger.c"
 HEAP32[(($13)>>2)]=158; //@line 107 "../../../src/sdl/charger.c"
 var $14=$state; //@line 108 "../../../src/sdl/charger.c"
 var $15=(($14+24)|0); //@line 108 "../../../src/sdl/charger.c"
 HEAP32[(($15)>>2)]=170; //@line 108 "../../../src/sdl/charger.c"
 var $16=$state; //@line 109 "../../../src/sdl/charger.c"
 var $17=(($16+12)|0); //@line 109 "../../../src/sdl/charger.c"
 HEAP32[(($17)>>2)]=10; //@line 109 "../../../src/sdl/charger.c"
 var $18=$state; //@line 110 "../../../src/sdl/charger.c"
 var $19=(($18+16)|0); //@line 110 "../../../src/sdl/charger.c"
 HEAP32[(($19)>>2)]=10; //@line 110 "../../../src/sdl/charger.c"
 var $20=$state; //@line 111 "../../../src/sdl/charger.c"
 var $21=(($20+20)|0); //@line 111 "../../../src/sdl/charger.c"
 HEAP32[(($21)>>2)]=10; //@line 111 "../../../src/sdl/charger.c"
 var $22=$state; //@line 112 "../../../src/sdl/charger.c"
 var $23=(($22+8)|0); //@line 112 "../../../src/sdl/charger.c"
 HEAP32[(($23)>>2)]=10; //@line 112 "../../../src/sdl/charger.c"
 var $24=$1; //@line 113 "../../../src/sdl/charger.c"
 var $25=$charger; //@line 113 "../../../src/sdl/charger.c"
 var $26=(($25)|0); //@line 113 "../../../src/sdl/charger.c"
 HEAP32[(($26)>>2)]=$24; //@line 113 "../../../src/sdl/charger.c"
 _set_color(50,50,150); //@line 115 "../../../src/sdl/charger.c"
 var $27=_creer_label(648,400,68,2,2); //@line 116 "../../../src/sdl/charger.c"
 var $28=$charger; //@line 116 "../../../src/sdl/charger.c"
 var $29=(($28+4)|0); //@line 116 "../../../src/sdl/charger.c"
 HEAP32[(($29)>>2)]=$27; //@line 116 "../../../src/sdl/charger.c"
 _set_color(200,200,200); //@line 117 "../../../src/sdl/charger.c"
 $x=120; //@line 118 "../../../src/sdl/charger.c"
 var $30=$x; //@line 119 "../../../src/sdl/charger.c"
 var $31=((($30)+(10))|0); //@line 119 "../../../src/sdl/charger.c"
 var $32=_creer_label(1104,$31,204,0,1); //@line 119 "../../../src/sdl/charger.c"
 var $33=$charger; //@line 119 "../../../src/sdl/charger.c"
 var $34=(($33+8)|0); //@line 119 "../../../src/sdl/charger.c"
 HEAP32[(($34)>>2)]=$32; //@line 119 "../../../src/sdl/charger.c"
 _set_color(250,20,20); //@line 121 "../../../src/sdl/charger.c"
 var $35=_creer_label(656,400,340,2,1); //@line 122 "../../../src/sdl/charger.c"
 var $36=$charger; //@line 122 "../../../src/sdl/charger.c"
 var $37=(($36+12)|0); //@line 122 "../../../src/sdl/charger.c"
 HEAP32[(($37)>>2)]=$35; //@line 122 "../../../src/sdl/charger.c"
 var $38=$charger; //@line 123 "../../../src/sdl/charger.c"
 var $39=(($38+12)|0); //@line 123 "../../../src/sdl/charger.c"
 var $40=HEAP32[(($39)>>2)]; //@line 123 "../../../src/sdl/charger.c"
 var $41=(($40+28)|0); //@line 123 "../../../src/sdl/charger.c"
 HEAP8[($41)]=0; //@line 123 "../../../src/sdl/charger.c"
 _set_color(100,100,100); //@line 125 "../../../src/sdl/charger.c"
 var $42=$x; //@line 126 "../../../src/sdl/charger.c"
 var $43=((($42)+(200))|0); //@line 126 "../../../src/sdl/charger.c"
 var $44=_creer_textinput($43,272,200,25,16); //@line 126 "../../../src/sdl/charger.c"
 var $45=$charger; //@line 126 "../../../src/sdl/charger.c"
 var $46=(($45+16)|0); //@line 126 "../../../src/sdl/charger.c"
 HEAP32[(($46)>>2)]=$44; //@line 126 "../../../src/sdl/charger.c"
 _set_color(50,250,50); //@line 130 "../../../src/sdl/charger.c"
 var $47=_creer_bouton(648,480,475,100,30); //@line 131 "../../../src/sdl/charger.c"
 $bouton=$47; //@line 131 "../../../src/sdl/charger.c"
 var $48=$bouton; //@line 132 "../../../src/sdl/charger.c"
 var $49=(($48+40)|0); //@line 132 "../../../src/sdl/charger.c"
 HEAP32[(($49)>>2)]=240; //@line 132 "../../../src/sdl/charger.c"
 var $50=$state; //@line 133 "../../../src/sdl/charger.c"
 var $51=$50; //@line 133 "../../../src/sdl/charger.c"
 var $52=$bouton; //@line 133 "../../../src/sdl/charger.c"
 var $53=(($52+44)|0); //@line 133 "../../../src/sdl/charger.c"
 HEAP32[(($53)>>2)]=$51; //@line 133 "../../../src/sdl/charger.c"
 var $54=$bouton; //@line 134 "../../../src/sdl/charger.c"
 var $55=$charger; //@line 134 "../../../src/sdl/charger.c"
 var $56=(($55+20)|0); //@line 134 "../../../src/sdl/charger.c"
 var $57=(($56)|0); //@line 134 "../../../src/sdl/charger.c"
 HEAP32[(($57)>>2)]=$54; //@line 134 "../../../src/sdl/charger.c"
 _set_color(155,50,50); //@line 136 "../../../src/sdl/charger.c"
 var $58=_creer_bouton(472,80,612,100,30); //@line 137 "../../../src/sdl/charger.c"
 $bouton=$58; //@line 137 "../../../src/sdl/charger.c"
 var $59=$bouton; //@line 138 "../../../src/sdl/charger.c"
 var $60=(($59+40)|0); //@line 138 "../../../src/sdl/charger.c"
 HEAP32[(($60)>>2)]=256; //@line 138 "../../../src/sdl/charger.c"
 var $61=$state; //@line 139 "../../../src/sdl/charger.c"
 var $62=$61; //@line 139 "../../../src/sdl/charger.c"
 var $63=$bouton; //@line 139 "../../../src/sdl/charger.c"
 var $64=(($63+44)|0); //@line 139 "../../../src/sdl/charger.c"
 HEAP32[(($64)>>2)]=$62; //@line 139 "../../../src/sdl/charger.c"
 var $65=$bouton; //@line 140 "../../../src/sdl/charger.c"
 var $66=$charger; //@line 140 "../../../src/sdl/charger.c"
 var $67=(($66+20)|0); //@line 140 "../../../src/sdl/charger.c"
 var $68=(($67+4)|0); //@line 140 "../../../src/sdl/charger.c"
 HEAP32[(($68)>>2)]=$65; //@line 140 "../../../src/sdl/charger.c"
 var $69=$charger; //@line 142 "../../../src/sdl/charger.c"
 var $70=(($69+28)|0); //@line 142 "../../../src/sdl/charger.c"
 HEAP8[($70)]=0; //@line 142 "../../../src/sdl/charger.c"
 var $71=$state; //@line 144 "../../../src/sdl/charger.c"
 STACKTOP=sp;return $71; //@line 144 "../../../src/sdl/charger.c"
}


function _afficher_charger($state,$surface){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $charger;
 var $i;
 var $b;
 $1=$state;
 $2=$surface;
 var $3=$1; //@line 164 "../../../src/sdl/charger.c"
 var $4=(($3+28)|0); //@line 164 "../../../src/sdl/charger.c"
 var $5=HEAP32[(($4)>>2)]; //@line 164 "../../../src/sdl/charger.c"
 var $6=$5; //@line 164 "../../../src/sdl/charger.c"
 $charger=$6; //@line 164 "../../../src/sdl/charger.c"
 _set_color(50,50,50); //@line 165 "../../../src/sdl/charger.c"
 var $7=$2; //@line 166 "../../../src/sdl/charger.c"
 _draw_rect($7,120,136,560,408); //@line 166 "../../../src/sdl/charger.c"
 var $8=$2; //@line 167 "../../../src/sdl/charger.c"
 var $9=$charger; //@line 167 "../../../src/sdl/charger.c"
 var $10=(($9+4)|0); //@line 167 "../../../src/sdl/charger.c"
 var $11=HEAP32[(($10)>>2)]; //@line 167 "../../../src/sdl/charger.c"
 _afficher_label($8,$11); //@line 167 "../../../src/sdl/charger.c"
 var $12=$2; //@line 168 "../../../src/sdl/charger.c"
 var $13=$charger; //@line 168 "../../../src/sdl/charger.c"
 var $14=(($13+8)|0); //@line 168 "../../../src/sdl/charger.c"
 var $15=HEAP32[(($14)>>2)]; //@line 168 "../../../src/sdl/charger.c"
 _afficher_label($12,$15); //@line 168 "../../../src/sdl/charger.c"
 var $16=$2; //@line 169 "../../../src/sdl/charger.c"
 var $17=$charger; //@line 169 "../../../src/sdl/charger.c"
 var $18=(($17+12)|0); //@line 169 "../../../src/sdl/charger.c"
 var $19=HEAP32[(($18)>>2)]; //@line 169 "../../../src/sdl/charger.c"
 _afficher_label($16,$19); //@line 169 "../../../src/sdl/charger.c"
 var $20=$2; //@line 170 "../../../src/sdl/charger.c"
 var $21=$charger; //@line 170 "../../../src/sdl/charger.c"
 var $22=(($21+16)|0); //@line 170 "../../../src/sdl/charger.c"
 var $23=HEAP32[(($22)>>2)]; //@line 170 "../../../src/sdl/charger.c"
 _afficher_textinput($20,$23); //@line 170 "../../../src/sdl/charger.c"
 $i=0; //@line 171 "../../../src/sdl/charger.c"
  //@line 171 "../../../src/sdl/charger.c"
 while(1) {
  var $25=$i; //@line 171 "../../../src/sdl/charger.c"
  var $26=($25|0)<2; //@line 171 "../../../src/sdl/charger.c"
   //@line 171 "../../../src/sdl/charger.c"
  if (!($26)) {
   break;
  }
  var $28=$i; //@line 172 "../../../src/sdl/charger.c"
  var $29=$charger; //@line 172 "../../../src/sdl/charger.c"
  var $30=(($29+20)|0); //@line 172 "../../../src/sdl/charger.c"
  var $31=(($30+($28<<2))|0); //@line 172 "../../../src/sdl/charger.c"
  var $32=HEAP32[(($31)>>2)]; //@line 172 "../../../src/sdl/charger.c"
  $b=$32; //@line 172 "../../../src/sdl/charger.c"
  var $33=$2; //@line 173 "../../../src/sdl/charger.c"
  var $34=$b; //@line 173 "../../../src/sdl/charger.c"
  _afficher_bouton($33,$34); //@line 173 "../../../src/sdl/charger.c"
   //@line 174 "../../../src/sdl/charger.c"
  var $36=$i; //@line 171 "../../../src/sdl/charger.c"
  var $37=((($36)+(1))|0); //@line 171 "../../../src/sdl/charger.c"
  $i=$37; //@line 171 "../../../src/sdl/charger.c"
   //@line 171 "../../../src/sdl/charger.c"
 }
 STACKTOP=sp;return; //@line 175 "../../../src/sdl/charger.c"
}


function _mise_a_jour_charger($state,$dt){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $charger;
 var $i;
 var $offset;
 $1=$state;
 $2=$dt;
 var $3=$1; //@line 179 "../../../src/sdl/charger.c"
 var $4=(($3+28)|0); //@line 179 "../../../src/sdl/charger.c"
 var $5=HEAP32[(($4)>>2)]; //@line 179 "../../../src/sdl/charger.c"
 var $6=$5; //@line 179 "../../../src/sdl/charger.c"
 $charger=$6; //@line 179 "../../../src/sdl/charger.c"
 var $7=$charger; //@line 180 "../../../src/sdl/charger.c"
 var $8=(($7+16)|0); //@line 180 "../../../src/sdl/charger.c"
 var $9=HEAP32[(($8)>>2)]; //@line 180 "../../../src/sdl/charger.c"
 var $10=$2; //@line 180 "../../../src/sdl/charger.c"
 _mise_a_jour_textinput($9,$10); //@line 180 "../../../src/sdl/charger.c"
 $i=0; //@line 181 "../../../src/sdl/charger.c"
  //@line 181 "../../../src/sdl/charger.c"
 while(1) {
  var $12=$i; //@line 181 "../../../src/sdl/charger.c"
  var $13=($12|0)<2; //@line 181 "../../../src/sdl/charger.c"
   //@line 181 "../../../src/sdl/charger.c"
  if (!($13)) {
   break;
  }
  var $15=$i; //@line 182 "../../../src/sdl/charger.c"
  var $16=$charger; //@line 182 "../../../src/sdl/charger.c"
  var $17=(($16+20)|0); //@line 182 "../../../src/sdl/charger.c"
  var $18=(($17+($15<<2))|0); //@line 182 "../../../src/sdl/charger.c"
  var $19=HEAP32[(($18)>>2)]; //@line 182 "../../../src/sdl/charger.c"
  var $20=$2; //@line 182 "../../../src/sdl/charger.c"
  _mise_a_jour_bouton($19,$20); //@line 182 "../../../src/sdl/charger.c"
   //@line 182 "../../../src/sdl/charger.c"
  var $22=$i; //@line 181 "../../../src/sdl/charger.c"
  var $23=((($22)+(1))|0); //@line 181 "../../../src/sdl/charger.c"
  $i=$23; //@line 181 "../../../src/sdl/charger.c"
   //@line 181 "../../../src/sdl/charger.c"
 }
 var $25=$charger; //@line 183 "../../../src/sdl/charger.c"
 var $26=(($25+28)|0); //@line 183 "../../../src/sdl/charger.c"
 var $27=HEAP8[($26)]; //@line 183 "../../../src/sdl/charger.c"
 var $28=(($27)&1); //@line 183 "../../../src/sdl/charger.c"
  //@line 183 "../../../src/sdl/charger.c"
 if (!($28)) {
  STACKTOP=sp;return; //@line 194 "../../../src/sdl/charger.c"
 }
 var $30=_rand(); //@line 185 "../../../src/sdl/charger.c"
 var $31=($30|0); //@line 185 "../../../src/sdl/charger.c"
 var $32=($31)/(2147483648); //@line 185 "../../../src/sdl/charger.c"
 var $33=($32)*(11); //@line 185 "../../../src/sdl/charger.c"
 var $34=($33)-(5); //@line 185 "../../../src/sdl/charger.c"
 $offset=$34; //@line 185 "../../../src/sdl/charger.c"
 var $35=$offset; //@line 186 "../../../src/sdl/charger.c"
 var $36=$35; //@line 186 "../../../src/sdl/charger.c"
 var $37=($36)+(400); //@line 186 "../../../src/sdl/charger.c"
 var $38=(($37)&-1); //@line 186 "../../../src/sdl/charger.c"
 var $39=$charger; //@line 186 "../../../src/sdl/charger.c"
 var $40=(($39+12)|0); //@line 186 "../../../src/sdl/charger.c"
 var $41=HEAP32[(($40)>>2)]; //@line 186 "../../../src/sdl/charger.c"
 var $42=(($41+4)|0); //@line 186 "../../../src/sdl/charger.c"
 HEAP32[(($42)>>2)]=$38; //@line 186 "../../../src/sdl/charger.c"
 var $43=_rand(); //@line 187 "../../../src/sdl/charger.c"
 var $44=($43|0); //@line 187 "../../../src/sdl/charger.c"
 var $45=($44)/(2147483648); //@line 187 "../../../src/sdl/charger.c"
 var $46=($45)*(11); //@line 187 "../../../src/sdl/charger.c"
 var $47=($46)-(5); //@line 187 "../../../src/sdl/charger.c"
 $offset=$47; //@line 187 "../../../src/sdl/charger.c"
 var $48=$offset; //@line 188 "../../../src/sdl/charger.c"
 var $49=$48; //@line 188 "../../../src/sdl/charger.c"
 var $50=($49)+(340); //@line 188 "../../../src/sdl/charger.c"
 var $51=(($50)&-1); //@line 188 "../../../src/sdl/charger.c"
 var $52=$charger; //@line 188 "../../../src/sdl/charger.c"
 var $53=(($52+12)|0); //@line 188 "../../../src/sdl/charger.c"
 var $54=HEAP32[(($53)>>2)]; //@line 188 "../../../src/sdl/charger.c"
 var $55=(($54+8)|0); //@line 188 "../../../src/sdl/charger.c"
 HEAP32[(($55)>>2)]=$51; //@line 188 "../../../src/sdl/charger.c"
 var $56=_rand(); //@line 190 "../../../src/sdl/charger.c"
 var $57=($56|0); //@line 190 "../../../src/sdl/charger.c"
 var $58=($57)/(2147483648); //@line 190 "../../../src/sdl/charger.c"
 var $59=$58; //@line 190 "../../../src/sdl/charger.c"
 var $60=$2; //@line 190 "../../../src/sdl/charger.c"
 var $61=$59<$60; //@line 190 "../../../src/sdl/charger.c"
  //@line 190 "../../../src/sdl/charger.c"
 if ($61) {
  var $63=$charger; //@line 191 "../../../src/sdl/charger.c"
  var $64=(($63+28)|0); //@line 191 "../../../src/sdl/charger.c"
  HEAP8[($64)]=0; //@line 191 "../../../src/sdl/charger.c"
   //@line 192 "../../../src/sdl/charger.c"
 }
  //@line 193 "../../../src/sdl/charger.c"
 STACKTOP=sp;return; //@line 194 "../../../src/sdl/charger.c"
}


function _event_charger($state,$event){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $event; $event=STACKTOP;STACKTOP = (STACKTOP + 48)|0;(assert((STACKTOP|0) < (STACK_MAX|0))|0);(_memcpy($event, tempParam, 48)|0);
 var $1;
 var $charger;
 var $i;
 var $b;
 $1=$state;
 var $2=$1; //@line 198 "../../../src/sdl/charger.c"
 var $3=(($2+28)|0); //@line 198 "../../../src/sdl/charger.c"
 var $4=HEAP32[(($3)>>2)]; //@line 198 "../../../src/sdl/charger.c"
 var $5=$4; //@line 198 "../../../src/sdl/charger.c"
 $charger=$5; //@line 198 "../../../src/sdl/charger.c"
 var $6=$charger; //@line 199 "../../../src/sdl/charger.c"
 var $7=(($6+16)|0); //@line 199 "../../../src/sdl/charger.c"
 var $8=HEAP32[(($7)>>2)]; //@line 199 "../../../src/sdl/charger.c"
 _utiliser_event_textinput($8,$event); //@line 199 "../../../src/sdl/charger.c"
 var $9=$charger; //@line 200 "../../../src/sdl/charger.c"
 var $10=(($9+16)|0); //@line 200 "../../../src/sdl/charger.c"
 var $11=HEAP32[(($10)>>2)]; //@line 200 "../../../src/sdl/charger.c"
 var $12=(($11+37)|0); //@line 200 "../../../src/sdl/charger.c"
 var $13=HEAP8[($12)]; //@line 200 "../../../src/sdl/charger.c"
 var $14=(($13)&1); //@line 200 "../../../src/sdl/charger.c"
  //@line 200 "../../../src/sdl/charger.c"
 if ($14) {
  var $16=$charger; //@line 201 "../../../src/sdl/charger.c"
  var $17=(($16+12)|0); //@line 201 "../../../src/sdl/charger.c"
  var $18=HEAP32[(($17)>>2)]; //@line 201 "../../../src/sdl/charger.c"
  var $19=(($18+28)|0); //@line 201 "../../../src/sdl/charger.c"
  HEAP8[($19)]=0; //@line 201 "../../../src/sdl/charger.c"
  var $20=$charger; //@line 202 "../../../src/sdl/charger.c"
  var $21=(($20+28)|0); //@line 202 "../../../src/sdl/charger.c"
  HEAP8[($21)]=0; //@line 202 "../../../src/sdl/charger.c"
   //@line 203 "../../../src/sdl/charger.c"
 }
 $i=0; //@line 204 "../../../src/sdl/charger.c"
  //@line 204 "../../../src/sdl/charger.c"
 while(1) {
  var $24=$i; //@line 204 "../../../src/sdl/charger.c"
  var $25=($24|0)<2; //@line 204 "../../../src/sdl/charger.c"
   //@line 204 "../../../src/sdl/charger.c"
  if (!($25)) {
   break;
  }
  var $27=$i; //@line 205 "../../../src/sdl/charger.c"
  var $28=$charger; //@line 205 "../../../src/sdl/charger.c"
  var $29=(($28+20)|0); //@line 205 "../../../src/sdl/charger.c"
  var $30=(($29+($27<<2))|0); //@line 205 "../../../src/sdl/charger.c"
  var $31=HEAP32[(($30)>>2)]; //@line 205 "../../../src/sdl/charger.c"
  $b=$31; //@line 205 "../../../src/sdl/charger.c"
  var $32=$b; //@line 206 "../../../src/sdl/charger.c"
  _utiliser_event_bouton($32,$event); //@line 206 "../../../src/sdl/charger.c"
   //@line 207 "../../../src/sdl/charger.c"
  var $34=$i; //@line 204 "../../../src/sdl/charger.c"
  var $35=((($34)+(1))|0); //@line 204 "../../../src/sdl/charger.c"
  $i=$35; //@line 204 "../../../src/sdl/charger.c"
   //@line 204 "../../../src/sdl/charger.c"
 }
 STACKTOP=sp;return; //@line 208 "../../../src/sdl/charger.c"
}


function _charger_bouton_charger($bouton,$data){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $state;
 var $charger;
 var $partie;
 var $jeu;
 $1=$bouton;
 $2=$data;
 var $3=$1; //@line 221 "../../../src/sdl/charger.c"
 var $4=$2; //@line 222 "../../../src/sdl/charger.c"
 var $5=$4; //@line 222 "../../../src/sdl/charger.c"
 $state=$5; //@line 222 "../../../src/sdl/charger.c"
 var $6=$state; //@line 223 "../../../src/sdl/charger.c"
 var $7=(($6+28)|0); //@line 223 "../../../src/sdl/charger.c"
 var $8=HEAP32[(($7)>>2)]; //@line 223 "../../../src/sdl/charger.c"
 var $9=$8; //@line 223 "../../../src/sdl/charger.c"
 $charger=$9; //@line 223 "../../../src/sdl/charger.c"
 var $10=$charger; //@line 224 "../../../src/sdl/charger.c"
 var $11=(($10+16)|0); //@line 224 "../../../src/sdl/charger.c"
 var $12=HEAP32[(($11)>>2)]; //@line 224 "../../../src/sdl/charger.c"
 var $13=(($12+12)|0); //@line 224 "../../../src/sdl/charger.c"
 var $14=HEAP32[(($13)>>2)]; //@line 224 "../../../src/sdl/charger.c"
 var $15=_charger_partie_fichier($14); //@line 224 "../../../src/sdl/charger.c"
 $partie=$15; //@line 224 "../../../src/sdl/charger.c"
 var $16=$partie; //@line 225 "../../../src/sdl/charger.c"
 var $17=($16|0)!=0; //@line 225 "../../../src/sdl/charger.c"
  //@line 225 "../../../src/sdl/charger.c"
 if ($17) {
  var $19=$charger; //@line 226 "../../../src/sdl/charger.c"
  var $20=(($19)|0); //@line 226 "../../../src/sdl/charger.c"
  var $21=HEAP32[(($20)>>2)]; //@line 226 "../../../src/sdl/charger.c"
  var $22=$partie; //@line 226 "../../../src/sdl/charger.c"
  var $23=_creer_jouer($21,$22); //@line 226 "../../../src/sdl/charger.c"
  $jeu=$23; //@line 226 "../../../src/sdl/charger.c"
  var $24=$jeu; //@line 227 "../../../src/sdl/charger.c"
  _set_state($24); //@line 227 "../../../src/sdl/charger.c"
  var $25=$state; //@line 228 "../../../src/sdl/charger.c"
  _detruire_charger($25); //@line 228 "../../../src/sdl/charger.c"
   //@line 229 "../../../src/sdl/charger.c"
  STACKTOP=sp;return; //@line 233 "../../../src/sdl/charger.c"
 } else {
  var $27=$charger; //@line 230 "../../../src/sdl/charger.c"
  var $28=(($27+12)|0); //@line 230 "../../../src/sdl/charger.c"
  var $29=HEAP32[(($28)>>2)]; //@line 230 "../../../src/sdl/charger.c"
  var $30=(($29+28)|0); //@line 230 "../../../src/sdl/charger.c"
  HEAP8[($30)]=1; //@line 230 "../../../src/sdl/charger.c"
  var $31=$charger; //@line 231 "../../../src/sdl/charger.c"
  var $32=(($31+28)|0); //@line 231 "../../../src/sdl/charger.c"
  HEAP8[($32)]=1; //@line 231 "../../../src/sdl/charger.c"
  STACKTOP=sp;return; //@line 233 "../../../src/sdl/charger.c"
 }
}


function _charger_bouton_retour($bouton,$data){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $state;
 var $charger;
 $1=$bouton;
 $2=$data;
 var $3=$1; //@line 212 "../../../src/sdl/charger.c"
 var $4=$2; //@line 213 "../../../src/sdl/charger.c"
 var $5=$4; //@line 213 "../../../src/sdl/charger.c"
 $state=$5; //@line 213 "../../../src/sdl/charger.c"
 var $6=$state; //@line 214 "../../../src/sdl/charger.c"
 var $7=(($6+28)|0); //@line 214 "../../../src/sdl/charger.c"
 var $8=HEAP32[(($7)>>2)]; //@line 214 "../../../src/sdl/charger.c"
 var $9=$8; //@line 214 "../../../src/sdl/charger.c"
 $charger=$9; //@line 214 "../../../src/sdl/charger.c"
 var $10=$charger; //@line 215 "../../../src/sdl/charger.c"
 var $11=(($10)|0); //@line 215 "../../../src/sdl/charger.c"
 var $12=HEAP32[(($11)>>2)]; //@line 215 "../../../src/sdl/charger.c"
 _set_state($12); //@line 215 "../../../src/sdl/charger.c"
 var $13=$state; //@line 216 "../../../src/sdl/charger.c"
 _detruire_charger($13); //@line 216 "../../../src/sdl/charger.c"
 STACKTOP=sp;return; //@line 217 "../../../src/sdl/charger.c"
}


function _detruire_charger($state){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $charger;
 var $i;
 var $b;
 $1=$state;
 var $2=$1; //@line 149 "../../../src/sdl/charger.c"
 var $3=(($2+28)|0); //@line 149 "../../../src/sdl/charger.c"
 var $4=HEAP32[(($3)>>2)]; //@line 149 "../../../src/sdl/charger.c"
 var $5=$4; //@line 149 "../../../src/sdl/charger.c"
 $charger=$5; //@line 149 "../../../src/sdl/charger.c"
 var $6=$charger; //@line 150 "../../../src/sdl/charger.c"
 var $7=(($6+4)|0); //@line 150 "../../../src/sdl/charger.c"
 var $8=HEAP32[(($7)>>2)]; //@line 150 "../../../src/sdl/charger.c"
 _detruire_label($8); //@line 150 "../../../src/sdl/charger.c"
 var $9=$charger; //@line 151 "../../../src/sdl/charger.c"
 var $10=(($9+8)|0); //@line 151 "../../../src/sdl/charger.c"
 var $11=HEAP32[(($10)>>2)]; //@line 151 "../../../src/sdl/charger.c"
 _detruire_label($11); //@line 151 "../../../src/sdl/charger.c"
 var $12=$charger; //@line 152 "../../../src/sdl/charger.c"
 var $13=(($12+12)|0); //@line 152 "../../../src/sdl/charger.c"
 var $14=HEAP32[(($13)>>2)]; //@line 152 "../../../src/sdl/charger.c"
 _detruire_label($14); //@line 152 "../../../src/sdl/charger.c"
 var $15=$charger; //@line 153 "../../../src/sdl/charger.c"
 var $16=(($15+16)|0); //@line 153 "../../../src/sdl/charger.c"
 var $17=HEAP32[(($16)>>2)]; //@line 153 "../../../src/sdl/charger.c"
 _detruire_textinput($17); //@line 153 "../../../src/sdl/charger.c"
 $i=0; //@line 154 "../../../src/sdl/charger.c"
  //@line 154 "../../../src/sdl/charger.c"
 while(1) {
  var $19=$i; //@line 154 "../../../src/sdl/charger.c"
  var $20=($19|0)<2; //@line 154 "../../../src/sdl/charger.c"
   //@line 154 "../../../src/sdl/charger.c"
  if (!($20)) {
   break;
  }
  var $22=$i; //@line 155 "../../../src/sdl/charger.c"
  var $23=$charger; //@line 155 "../../../src/sdl/charger.c"
  var $24=(($23+20)|0); //@line 155 "../../../src/sdl/charger.c"
  var $25=(($24+($22<<2))|0); //@line 155 "../../../src/sdl/charger.c"
  var $26=HEAP32[(($25)>>2)]; //@line 155 "../../../src/sdl/charger.c"
  $b=$26; //@line 155 "../../../src/sdl/charger.c"
  var $27=$b; //@line 156 "../../../src/sdl/charger.c"
  _detruire_bouton($27); //@line 156 "../../../src/sdl/charger.c"
   //@line 157 "../../../src/sdl/charger.c"
  var $29=$i; //@line 154 "../../../src/sdl/charger.c"
  var $30=((($29)+(1))|0); //@line 154 "../../../src/sdl/charger.c"
  $i=$30; //@line 154 "../../../src/sdl/charger.c"
   //@line 154 "../../../src/sdl/charger.c"
 }
 var $32=$1; //@line 158 "../../../src/sdl/charger.c"
 var $33=(($32+28)|0); //@line 158 "../../../src/sdl/charger.c"
 var $34=HEAP32[(($33)>>2)]; //@line 158 "../../../src/sdl/charger.c"
 _gosh_free($34); //@line 158 "../../../src/sdl/charger.c"
 var $35=$1; //@line 159 "../../../src/sdl/charger.c"
 var $36=$35; //@line 159 "../../../src/sdl/charger.c"
 _gosh_free($36); //@line 159 "../../../src/sdl/charger.c"
 STACKTOP=sp;return; //@line 160 "../../../src/sdl/charger.c"
}


function _set_color($r,$g,$b){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 $1=$r;
 $2=$g;
 $3=$b;
 var $4=$1; //@line 62 "../../../src/sdl/tools.c"
 var $5=(($4)&255); //@line 62 "../../../src/sdl/tools.c"
 HEAP8[(40)]=$5; //@line 62 "../../../src/sdl/tools.c"
 var $6=$2; //@line 63 "../../../src/sdl/tools.c"
 var $7=(($6)&255); //@line 63 "../../../src/sdl/tools.c"
 HEAP8[(41)]=$7; //@line 63 "../../../src/sdl/tools.c"
 var $8=$3; //@line 64 "../../../src/sdl/tools.c"
 var $9=(($8)&255); //@line 64 "../../../src/sdl/tools.c"
 HEAP8[(42)]=$9; //@line 64 "../../../src/sdl/tools.c"
 STACKTOP=sp;return; //@line 65 "../../../src/sdl/tools.c"
}


function _get_color($agg_result){
 var label=0;

 var $1=$agg_result; //@line 69 "../../../src/sdl/tools.c"
 assert(4 % 1 === 0);HEAP8[($1)]=HEAP8[(40)];HEAP8[((($1)+(1))|0)]=HEAP8[(41)];HEAP8[((($1)+(2))|0)]=HEAP8[(42)];HEAP8[((($1)+(3))|0)]=HEAP8[(43)]; //@line 69 "../../../src/sdl/tools.c"
 return; //@line 69 "../../../src/sdl/tools.c"
}


function _draw_rect($surface,$x,$y,$w,$h){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $4;
 var $5;
 var $rect=sp;
 var $c;
 $1=$surface;
 $2=$x;
 $3=$y;
 $4=$w;
 $5=$h;
 var $6=(($rect)|0); //@line 74 "../../../src/sdl/tools.c"
 var $7=$2; //@line 74 "../../../src/sdl/tools.c"
 HEAP32[(($6)>>2)]=$7; //@line 74 "../../../src/sdl/tools.c"
 var $8=(($rect+4)|0); //@line 74 "../../../src/sdl/tools.c"
 var $9=$3; //@line 74 "../../../src/sdl/tools.c"
 HEAP32[(($8)>>2)]=$9; //@line 74 "../../../src/sdl/tools.c"
 var $10=(($rect+8)|0); //@line 74 "../../../src/sdl/tools.c"
 var $11=$4; //@line 74 "../../../src/sdl/tools.c"
 HEAP32[(($10)>>2)]=$11; //@line 74 "../../../src/sdl/tools.c"
 var $12=(($rect+12)|0); //@line 74 "../../../src/sdl/tools.c"
 var $13=$5; //@line 74 "../../../src/sdl/tools.c"
 HEAP32[(($12)>>2)]=$13; //@line 74 "../../../src/sdl/tools.c"
 var $14=$1; //@line 75 "../../../src/sdl/tools.c"
 var $15=(($14+4)|0); //@line 75 "../../../src/sdl/tools.c"
 var $16=HEAP32[(($15)>>2)]; //@line 75 "../../../src/sdl/tools.c"
 var $17=HEAP8[(40)]; //@line 75 "../../../src/sdl/tools.c"
 var $18=HEAP8[(41)]; //@line 75 "../../../src/sdl/tools.c"
 var $19=HEAP8[(42)]; //@line 75 "../../../src/sdl/tools.c"
 var $20=_SDL_MapRGB($16,$17,$18,$19); //@line 75 "../../../src/sdl/tools.c"
 $c=$20; //@line 75 "../../../src/sdl/tools.c"
 var $21=$1; //@line 76 "../../../src/sdl/tools.c"
 var $22=$c; //@line 76 "../../../src/sdl/tools.c"
 var $23=_SDL_FillRect($21,$rect,$22); //@line 76 "../../../src/sdl/tools.c"
 STACKTOP=sp;return; //@line 77 "../../../src/sdl/tools.c"
}


function _text_surface($text,$size){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $font;
 var $surface;
 $1=$text;
 $2=$size;
 var $3=$2; //@line 81 "../../../src/sdl/tools.c"
 var $4=_get_font($3); //@line 81 "../../../src/sdl/tools.c"
 $font=$4; //@line 81 "../../../src/sdl/tools.c"
 var $5=$font; //@line 83 "../../../src/sdl/tools.c"
 var $6=$1; //@line 83 "../../../src/sdl/tools.c"
 var $7=_TTF_RenderText_Solid($5,$6,40); //@line 83 "../../../src/sdl/tools.c"
 $surface=$7; //@line 83 "../../../src/sdl/tools.c"
 var $8=$surface; //@line 87 "../../../src/sdl/tools.c"
 STACKTOP=sp;return $8; //@line 87 "../../../src/sdl/tools.c"
}


function _get_font($size){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $i;
 var $p;
 $1=$size;
 var $2=$1; //@line 107 "../../../src/sdl/tools.c"
 $i=$2; //@line 107 "../../../src/sdl/tools.c"
 var $3=$i; //@line 108 "../../../src/sdl/tools.c"
 var $4=((1552+($3<<2))|0); //@line 108 "../../../src/sdl/tools.c"
 var $5=HEAP32[(($4)>>2)]; //@line 108 "../../../src/sdl/tools.c"
 var $6=($5|0)!=0; //@line 108 "../../../src/sdl/tools.c"
  //@line 108 "../../../src/sdl/tools.c"
 if ($6) {
  var $41=$i; //@line 116 "../../../src/sdl/tools.c"
  var $42=((1552+($41<<2))|0); //@line 116 "../../../src/sdl/tools.c"
  var $43=HEAP32[(($42)>>2)]; //@line 116 "../../../src/sdl/tools.c"
  STACKTOP=sp;return $43; //@line 116 "../../../src/sdl/tools.c"
 }
 $p=0; //@line 109 "../../../src/sdl/tools.c"
  //@line 110 "../../../src/sdl/tools.c"
 while(1) {
  var $9=$i; //@line 110 "../../../src/sdl/tools.c"
  var $10=((1552+($9<<2))|0); //@line 110 "../../../src/sdl/tools.c"
  var $11=HEAP32[(($10)>>2)]; //@line 110 "../../../src/sdl/tools.c"
  var $12=($11|0)!=0; //@line 110 "../../../src/sdl/tools.c"
   //@line 110 "../../../src/sdl/tools.c"
  if ($12) {
   var $17=0;
  } else {
   var $14=$p; //@line 110 "../../../src/sdl/tools.c"
   var $15=($14>>>0)<2; //@line 110 "../../../src/sdl/tools.c"
   var $17=$15;
  }
  var $17;
  if (!($17)) {
   break;
  }
  var $19=$p; //@line 111 "../../../src/sdl/tools.c"
  var $20=((1496+($19<<2))|0); //@line 111 "../../../src/sdl/tools.c"
  var $21=HEAP32[(($20)>>2)]; //@line 111 "../../../src/sdl/tools.c"
  var $22=$i; //@line 111 "../../../src/sdl/tools.c"
  var $23=((24+($22<<2))|0); //@line 111 "../../../src/sdl/tools.c"
  var $24=HEAP32[(($23)>>2)]; //@line 111 "../../../src/sdl/tools.c"
  var $25=_TTF_OpenFont($21,$24); //@line 111 "../../../src/sdl/tools.c"
  var $26=$i; //@line 111 "../../../src/sdl/tools.c"
  var $27=((1552+($26<<2))|0); //@line 111 "../../../src/sdl/tools.c"
  HEAP32[(($27)>>2)]=$25; //@line 111 "../../../src/sdl/tools.c"
  var $28=$p; //@line 112 "../../../src/sdl/tools.c"
  var $29=((($28)+(1))|0); //@line 112 "../../../src/sdl/tools.c"
  $p=$29; //@line 112 "../../../src/sdl/tools.c"
   //@line 113 "../../../src/sdl/tools.c"
 }
  //@line 114 "../../../src/sdl/tools.c"
 var $32=$i; //@line 114 "../../../src/sdl/tools.c"
 var $33=((1552+($32<<2))|0); //@line 114 "../../../src/sdl/tools.c"
 var $34=HEAP32[(($33)>>2)]; //@line 114 "../../../src/sdl/tools.c"
 var $35=($34|0)!=0; //@line 114 "../../../src/sdl/tools.c"
  //@line 114 "../../../src/sdl/tools.c"
 if (!($35)) {
  var $37=_SDL_GetError(); //@line 114 "../../../src/sdl/tools.c"
  _perror($37); //@line 114 "../../../src/sdl/tools.c"
  _exit(1); //@line 114 "../../../src/sdl/tools.c"
  throw "Reached an unreachable!"; //@line 114 "../../../src/sdl/tools.c"
 }
  //@line 114 "../../../src/sdl/tools.c"
  //@line 115 "../../../src/sdl/tools.c"
 var $41=$i; //@line 116 "../../../src/sdl/tools.c"
 var $42=((1552+($41<<2))|0); //@line 116 "../../../src/sdl/tools.c"
 var $43=HEAP32[(($42)>>2)]; //@line 116 "../../../src/sdl/tools.c"
 STACKTOP=sp;return $43; //@line 116 "../../../src/sdl/tools.c"
}


function _draw_surface($on,$from,$x,$y,$align){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $4;
 var $5;
 var $dest=sp;
 $1=$on;
 $2=$from;
 $3=$x;
 $4=$y;
 $5=$align;
 var $6=(($dest)|0); //@line 92 "../../../src/sdl/tools.c"
 var $7=$3; //@line 92 "../../../src/sdl/tools.c"
 HEAP32[(($6)>>2)]=$7; //@line 92 "../../../src/sdl/tools.c"
 var $8=(($dest+4)|0); //@line 92 "../../../src/sdl/tools.c"
 var $9=$4; //@line 92 "../../../src/sdl/tools.c"
 HEAP32[(($8)>>2)]=$9; //@line 92 "../../../src/sdl/tools.c"
 var $10=(($dest+8)|0); //@line 92 "../../../src/sdl/tools.c"
 HEAP32[(($10)>>2)]=0; //@line 92 "../../../src/sdl/tools.c"
 var $11=(($dest+12)|0); //@line 92 "../../../src/sdl/tools.c"
 HEAP32[(($11)>>2)]=0; //@line 92 "../../../src/sdl/tools.c"
 var $12=$5; //@line 93 "../../../src/sdl/tools.c"
 var $13=($12|0)==1; //@line 93 "../../../src/sdl/tools.c"
  //@line 93 "../../../src/sdl/tools.c"
 if ($13) {
  var $15=$2; //@line 94 "../../../src/sdl/tools.c"
  var $16=(($15+8)|0); //@line 94 "../../../src/sdl/tools.c"
  var $17=HEAP32[(($16)>>2)]; //@line 94 "../../../src/sdl/tools.c"
  var $18=(((($17|0))/(2))&-1); //@line 94 "../../../src/sdl/tools.c"
  var $19=(($dest)|0); //@line 94 "../../../src/sdl/tools.c"
  var $20=HEAP32[(($19)>>2)]; //@line 94 "../../../src/sdl/tools.c"
  var $21=((($20)-($18))|0); //@line 94 "../../../src/sdl/tools.c"
  HEAP32[(($19)>>2)]=$21; //@line 94 "../../../src/sdl/tools.c"
   //@line 95 "../../../src/sdl/tools.c"
  var $53=$2; //@line 101 "../../../src/sdl/tools.c"
  var $54=$1; //@line 101 "../../../src/sdl/tools.c"
  var $55=_SDL_UpperBlit($53,0,$54,$dest); //@line 101 "../../../src/sdl/tools.c"
  STACKTOP=sp;return; //@line 102 "../../../src/sdl/tools.c"
 }
 var $23=$5; //@line 95 "../../../src/sdl/tools.c"
 var $24=($23|0)==2; //@line 95 "../../../src/sdl/tools.c"
  //@line 95 "../../../src/sdl/tools.c"
 if ($24) {
  var $26=$2; //@line 96 "../../../src/sdl/tools.c"
  var $27=(($26+8)|0); //@line 96 "../../../src/sdl/tools.c"
  var $28=HEAP32[(($27)>>2)]; //@line 96 "../../../src/sdl/tools.c"
  var $29=(((($28|0))/(2))&-1); //@line 96 "../../../src/sdl/tools.c"
  var $30=(($dest)|0); //@line 96 "../../../src/sdl/tools.c"
  var $31=HEAP32[(($30)>>2)]; //@line 96 "../../../src/sdl/tools.c"
  var $32=((($31)-($29))|0); //@line 96 "../../../src/sdl/tools.c"
  HEAP32[(($30)>>2)]=$32; //@line 96 "../../../src/sdl/tools.c"
  var $33=$2; //@line 97 "../../../src/sdl/tools.c"
  var $34=(($33+12)|0); //@line 97 "../../../src/sdl/tools.c"
  var $35=HEAP32[(($34)>>2)]; //@line 97 "../../../src/sdl/tools.c"
  var $36=(((($35|0))/(2))&-1); //@line 97 "../../../src/sdl/tools.c"
  var $37=(($dest+4)|0); //@line 97 "../../../src/sdl/tools.c"
  var $38=HEAP32[(($37)>>2)]; //@line 97 "../../../src/sdl/tools.c"
  var $39=((($38)-($36))|0); //@line 97 "../../../src/sdl/tools.c"
  HEAP32[(($37)>>2)]=$39; //@line 97 "../../../src/sdl/tools.c"
   //@line 98 "../../../src/sdl/tools.c"
 } else {
  var $41=$5; //@line 98 "../../../src/sdl/tools.c"
  var $42=($41|0)==3; //@line 98 "../../../src/sdl/tools.c"
   //@line 98 "../../../src/sdl/tools.c"
  if ($42) {
   var $44=$2; //@line 99 "../../../src/sdl/tools.c"
   var $45=(($44+8)|0); //@line 99 "../../../src/sdl/tools.c"
   var $46=HEAP32[(($45)>>2)]; //@line 99 "../../../src/sdl/tools.c"
   var $47=(($dest)|0); //@line 99 "../../../src/sdl/tools.c"
   var $48=HEAP32[(($47)>>2)]; //@line 99 "../../../src/sdl/tools.c"
   var $49=((($48)-($46))|0); //@line 99 "../../../src/sdl/tools.c"
   HEAP32[(($47)>>2)]=$49; //@line 99 "../../../src/sdl/tools.c"
    //@line 100 "../../../src/sdl/tools.c"
  }
 }
 var $53=$2; //@line 101 "../../../src/sdl/tools.c"
 var $54=$1; //@line 101 "../../../src/sdl/tools.c"
 var $55=_SDL_UpperBlit($53,0,$54,$dest); //@line 101 "../../../src/sdl/tools.c"
 STACKTOP=sp;return; //@line 102 "../../../src/sdl/tools.c"
}


function _creer_jouer($parent,$partie){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+80)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $state;
 var $jouer;
 var $buf=sp;
 var $bouton;
 $1=$parent;
 $2=$partie;
 var $3=_gosh_alloc_size(32); //@line 118 "../../../src/sdl/jouer.c"
 var $4=$3; //@line 118 "../../../src/sdl/jouer.c"
 $state=$4; //@line 118 "../../../src/sdl/jouer.c"
 var $5=$state; //@line 119 "../../../src/sdl/jouer.c"
 var $6=(($5+4)|0); //@line 119 "../../../src/sdl/jouer.c"
 HEAP32[(($6)>>2)]=42; //@line 119 "../../../src/sdl/jouer.c"
 var $7=_gosh_alloc_size(52); //@line 120 "../../../src/sdl/jouer.c"
 var $8=$7; //@line 120 "../../../src/sdl/jouer.c"
 $jouer=$8; //@line 120 "../../../src/sdl/jouer.c"
 var $9=$1; //@line 121 "../../../src/sdl/jouer.c"
 var $10=$jouer; //@line 121 "../../../src/sdl/jouer.c"
 var $11=(($10)|0); //@line 121 "../../../src/sdl/jouer.c"
 HEAP32[(($11)>>2)]=$9; //@line 121 "../../../src/sdl/jouer.c"
 var $12=$2; //@line 122 "../../../src/sdl/jouer.c"
 var $13=$jouer; //@line 122 "../../../src/sdl/jouer.c"
 var $14=(($13+4)|0); //@line 122 "../../../src/sdl/jouer.c"
 HEAP32[(($14)>>2)]=$12; //@line 122 "../../../src/sdl/jouer.c"
 var $15=$2; //@line 123 "../../../src/sdl/jouer.c"
 var $16=(($15)|0); //@line 123 "../../../src/sdl/jouer.c"
 var $17=HEAP32[(($16)>>2)]; //@line 123 "../../../src/sdl/jouer.c"
 var $18=_plateau_get_taille($17); //@line 123 "../../../src/sdl/jouer.c"
 var $19=$jouer; //@line 123 "../../../src/sdl/jouer.c"
 var $20=(($19+8)|0); //@line 123 "../../../src/sdl/jouer.c"
 HEAP32[(($20)>>2)]=$18; //@line 123 "../../../src/sdl/jouer.c"
 var $21=$jouer; //@line 124 "../../../src/sdl/jouer.c"
 var $22=$21; //@line 124 "../../../src/sdl/jouer.c"
 var $23=$state; //@line 124 "../../../src/sdl/jouer.c"
 var $24=(($23+28)|0); //@line 124 "../../../src/sdl/jouer.c"
 HEAP32[(($24)>>2)]=$22; //@line 124 "../../../src/sdl/jouer.c"
 var $25=$state; //@line 125 "../../../src/sdl/jouer.c"
 var $26=(($25+24)|0); //@line 125 "../../../src/sdl/jouer.c"
 HEAP32[(($26)>>2)]=194; //@line 125 "../../../src/sdl/jouer.c"
 var $27=$state; //@line 126 "../../../src/sdl/jouer.c"
 var $28=(($27+12)|0); //@line 126 "../../../src/sdl/jouer.c"
 HEAP32[(($28)>>2)]=198; //@line 126 "../../../src/sdl/jouer.c"
 var $29=$state; //@line 127 "../../../src/sdl/jouer.c"
 var $30=(($29+16)|0); //@line 127 "../../../src/sdl/jouer.c"
 HEAP32[(($30)>>2)]=198; //@line 127 "../../../src/sdl/jouer.c"
 var $31=$state; //@line 128 "../../../src/sdl/jouer.c"
 var $32=(($31+20)|0); //@line 128 "../../../src/sdl/jouer.c"
 HEAP32[(($32)>>2)]=198; //@line 128 "../../../src/sdl/jouer.c"
 var $33=$state; //@line 129 "../../../src/sdl/jouer.c"
 var $34=(($33+8)|0); //@line 129 "../../../src/sdl/jouer.c"
 HEAP32[(($34)>>2)]=198; //@line 129 "../../../src/sdl/jouer.c"
 _set_color(230,200,150); //@line 133 "../../../src/sdl/jouer.c"
 var $35=(($buf)|0); //@line 134 "../../../src/sdl/jouer.c"
 var $36=$2; //@line 134 "../../../src/sdl/jouer.c"
 var $37=(($36+4)|0); //@line 134 "../../../src/sdl/jouer.c"
 var $38=(($37+20)|0); //@line 134 "../../../src/sdl/jouer.c"
 var $39=(($38+4)|0); //@line 134 "../../../src/sdl/jouer.c"
 var $40=(($39)|0); //@line 134 "../../../src/sdl/jouer.c"
 var $41=_snprintf($35,76,400,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$40,tempVarArgs)); STACKTOP=tempVarArgs; //@line 134 "../../../src/sdl/jouer.c"
 var $42=(($buf)|0); //@line 135 "../../../src/sdl/jouer.c"
 var $43=_creer_label($42,400,68,2,2); //@line 135 "../../../src/sdl/jouer.c"
 var $44=$jouer; //@line 135 "../../../src/sdl/jouer.c"
 var $45=(($44+12)|0); //@line 135 "../../../src/sdl/jouer.c"
 var $46=(($45+4)|0); //@line 135 "../../../src/sdl/jouer.c"
 HEAP32[(($46)>>2)]=$43; //@line 135 "../../../src/sdl/jouer.c"
 var $47=(($buf)|0); //@line 136 "../../../src/sdl/jouer.c"
 var $48=$2; //@line 136 "../../../src/sdl/jouer.c"
 var $49=(($48+4)|0); //@line 136 "../../../src/sdl/jouer.c"
 var $50=(($49)|0); //@line 136 "../../../src/sdl/jouer.c"
 var $51=(($50+4)|0); //@line 136 "../../../src/sdl/jouer.c"
 var $52=(($51)|0); //@line 136 "../../../src/sdl/jouer.c"
 var $53=_snprintf($47,76,400,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$52,tempVarArgs)); STACKTOP=tempVarArgs; //@line 136 "../../../src/sdl/jouer.c"
 var $54=(($buf)|0); //@line 137 "../../../src/sdl/jouer.c"
 var $55=_creer_label($54,400,68,2,2); //@line 137 "../../../src/sdl/jouer.c"
 var $56=$jouer; //@line 137 "../../../src/sdl/jouer.c"
 var $57=(($56+12)|0); //@line 137 "../../../src/sdl/jouer.c"
 var $58=(($57)|0); //@line 137 "../../../src/sdl/jouer.c"
 HEAP32[(($58)>>2)]=$55; //@line 137 "../../../src/sdl/jouer.c"
 var $59=_creer_label(1032,400,68,2,2); //@line 138 "../../../src/sdl/jouer.c"
 var $60=$jouer; //@line 138 "../../../src/sdl/jouer.c"
 var $61=(($60+20)|0); //@line 138 "../../../src/sdl/jouer.c"
 HEAP32[(($61)>>2)]=$59; //@line 138 "../../../src/sdl/jouer.c"
 var $62=_creer_label(624,400,68,2,2); //@line 139 "../../../src/sdl/jouer.c"
 var $63=$jouer; //@line 139 "../../../src/sdl/jouer.c"
 var $64=(($63+24)|0); //@line 139 "../../../src/sdl/jouer.c"
 HEAP32[(($64)>>2)]=$62; //@line 139 "../../../src/sdl/jouer.c"
 _set_color(155,50,50); //@line 141 "../../../src/sdl/jouer.c"
 var $65=_creer_bouton(456,10,550,140,30); //@line 142 "../../../src/sdl/jouer.c"
 $bouton=$65; //@line 142 "../../../src/sdl/jouer.c"
 var $66=$bouton; //@line 143 "../../../src/sdl/jouer.c"
 var $67=(($66+40)|0); //@line 143 "../../../src/sdl/jouer.c"
 HEAP32[(($67)>>2)]=120; //@line 143 "../../../src/sdl/jouer.c"
 var $68=$state; //@line 144 "../../../src/sdl/jouer.c"
 var $69=$68; //@line 144 "../../../src/sdl/jouer.c"
 var $70=$bouton; //@line 144 "../../../src/sdl/jouer.c"
 var $71=(($70+44)|0); //@line 144 "../../../src/sdl/jouer.c"
 HEAP32[(($71)>>2)]=$69; //@line 144 "../../../src/sdl/jouer.c"
 var $72=$bouton; //@line 145 "../../../src/sdl/jouer.c"
 var $73=$jouer; //@line 145 "../../../src/sdl/jouer.c"
 var $74=(($73+36)|0); //@line 145 "../../../src/sdl/jouer.c"
 HEAP32[(($74)>>2)]=$72; //@line 145 "../../../src/sdl/jouer.c"
 _set_color(255,255,255); //@line 147 "../../../src/sdl/jouer.c"
 var $75=_creer_bouton(352,600,102,150,30); //@line 148 "../../../src/sdl/jouer.c"
 $bouton=$75; //@line 148 "../../../src/sdl/jouer.c"
 var $76=$bouton; //@line 149 "../../../src/sdl/jouer.c"
 var $77=(($76+40)|0); //@line 149 "../../../src/sdl/jouer.c"
 HEAP32[(($77)>>2)]=34; //@line 149 "../../../src/sdl/jouer.c"
 var $78=$state; //@line 150 "../../../src/sdl/jouer.c"
 var $79=$78; //@line 150 "../../../src/sdl/jouer.c"
 var $80=$bouton; //@line 150 "../../../src/sdl/jouer.c"
 var $81=(($80+44)|0); //@line 150 "../../../src/sdl/jouer.c"
 HEAP32[(($81)>>2)]=$79; //@line 150 "../../../src/sdl/jouer.c"
 var $82=$bouton; //@line 151 "../../../src/sdl/jouer.c"
 var $83=$jouer; //@line 151 "../../../src/sdl/jouer.c"
 var $84=(($83+32)|0); //@line 151 "../../../src/sdl/jouer.c"
 HEAP32[(($84)>>2)]=$82; //@line 151 "../../../src/sdl/jouer.c"
 _set_color(255,255,255); //@line 153 "../../../src/sdl/jouer.c"
 var $85=_creer_bouton(264,600,632,150,30); //@line 154 "../../../src/sdl/jouer.c"
 $bouton=$85; //@line 154 "../../../src/sdl/jouer.c"
 var $86=$bouton; //@line 155 "../../../src/sdl/jouer.c"
 var $87=(($86+40)|0); //@line 155 "../../../src/sdl/jouer.c"
 HEAP32[(($87)>>2)]=162; //@line 155 "../../../src/sdl/jouer.c"
 var $88=$state; //@line 156 "../../../src/sdl/jouer.c"
 var $89=$88; //@line 156 "../../../src/sdl/jouer.c"
 var $90=$bouton; //@line 156 "../../../src/sdl/jouer.c"
 var $91=(($90+44)|0); //@line 156 "../../../src/sdl/jouer.c"
 HEAP32[(($91)>>2)]=$89; //@line 156 "../../../src/sdl/jouer.c"
 var $92=$bouton; //@line 157 "../../../src/sdl/jouer.c"
 var $93=(($92+36)|0); //@line 157 "../../../src/sdl/jouer.c"
 HEAP8[($93)]=0; //@line 157 "../../../src/sdl/jouer.c"
 var $94=$bouton; //@line 158 "../../../src/sdl/jouer.c"
 var $95=$jouer; //@line 158 "../../../src/sdl/jouer.c"
 var $96=(($95+44)|0); //@line 158 "../../../src/sdl/jouer.c"
 HEAP32[(($96)>>2)]=$94; //@line 158 "../../../src/sdl/jouer.c"
 _set_color(150,150,150); //@line 160 "../../../src/sdl/jouer.c"
 var $97=_creer_textinput(400,639,180,20,16); //@line 161 "../../../src/sdl/jouer.c"
 var $98=$jouer; //@line 161 "../../../src/sdl/jouer.c"
 var $99=(($98+40)|0); //@line 161 "../../../src/sdl/jouer.c"
 HEAP32[(($99)>>2)]=$97; //@line 161 "../../../src/sdl/jouer.c"
 var $100=$jouer; //@line 163 "../../../src/sdl/jouer.c"
 var $101=(($100+48)|0); //@line 163 "../../../src/sdl/jouer.c"
 var $102=$101; //@line 163 "../../../src/sdl/jouer.c"
 assert(4 % 1 === 0);HEAP8[($102)]=HEAP8[(1488)];HEAP8[((($102)+(1))|0)]=HEAP8[(1489)];HEAP8[((($102)+(2))|0)]=HEAP8[(1490)];HEAP8[((($102)+(3))|0)]=HEAP8[(1491)]; //@line 163 "../../../src/sdl/jouer.c"
 var $103=$state; //@line 165 "../../../src/sdl/jouer.c"
 STACKTOP=sp;return $103; //@line 165 "../../../src/sdl/jouer.c"
}


function _afficher_jouer($state,$surface){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+64)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $jouer;
 var $partie;
 var $taille;
 var $x1;
 var $y1;
 var $w;
 var $pixel_par_case;
 var $interbordure;
 var $bordure;
 var $x;
 var $y;
 var $taille_stone;
 var $taille_stone2;
 var $hov=sp;
 var $chaine;
 var $libertes;
 var $yeux;
 var $x2;
 var $y3;
 var $pos=(sp)+(8);
 var $c;
 var $draw;
 var $marge;
 var $sx=(sp)+(16);
 var $sy=(sp)+(24);
 var $sx4=(sp)+(32);
 var $sy5=(sp)+(40);
 var $sx6=(sp)+(48);
 var $sy7=(sp)+(56);
 $1=$state;
 $2=$surface;
 var $3=$1; //@line 269 "../../../src/sdl/jouer.c"
 var $4=(($3+28)|0); //@line 269 "../../../src/sdl/jouer.c"
 var $5=HEAP32[(($4)>>2)]; //@line 269 "../../../src/sdl/jouer.c"
 var $6=$5; //@line 269 "../../../src/sdl/jouer.c"
 $jouer=$6; //@line 269 "../../../src/sdl/jouer.c"
 var $7=$jouer; //@line 270 "../../../src/sdl/jouer.c"
 var $8=(($7+4)|0); //@line 270 "../../../src/sdl/jouer.c"
 var $9=HEAP32[(($8)>>2)]; //@line 270 "../../../src/sdl/jouer.c"
 $partie=$9; //@line 270 "../../../src/sdl/jouer.c"
 var $10=$jouer; //@line 271 "../../../src/sdl/jouer.c"
 var $11=(($10+8)|0); //@line 271 "../../../src/sdl/jouer.c"
 var $12=HEAP32[(($11)>>2)]; //@line 271 "../../../src/sdl/jouer.c"
 $taille=$12; //@line 271 "../../../src/sdl/jouer.c"
 $x1=160; //@line 273 "../../../src/sdl/jouer.c"
 $y1=136; //@line 274 "../../../src/sdl/jouer.c"
 var $13=$x1; //@line 275 "../../../src/sdl/jouer.c"
 var $14=($13|0); //@line 275 "../../../src/sdl/jouer.c"
 var $15=(640)-($14); //@line 275 "../../../src/sdl/jouer.c"
 var $16=$y1; //@line 275 "../../../src/sdl/jouer.c"
 var $17=($16|0); //@line 275 "../../../src/sdl/jouer.c"
 var $18=(544)-($17); //@line 275 "../../../src/sdl/jouer.c"
 var $19=$15>$18; //@line 275 "../../../src/sdl/jouer.c"
  //@line 275 "../../../src/sdl/jouer.c"
 if ($19) {
  var $21=$x1; //@line 275 "../../../src/sdl/jouer.c"
  var $22=($21|0); //@line 275 "../../../src/sdl/jouer.c"
  var $23=(640)-($22); //@line 275 "../../../src/sdl/jouer.c"
   //@line 275 "../../../src/sdl/jouer.c"
  var $29=$23;
 } else {
  var $25=$y1; //@line 275 "../../../src/sdl/jouer.c"
  var $26=($25|0); //@line 275 "../../../src/sdl/jouer.c"
  var $27=(544)-($26); //@line 275 "../../../src/sdl/jouer.c"
   //@line 275 "../../../src/sdl/jouer.c"
  var $29=$27;
 }
 var $29; //@line 275 "../../../src/sdl/jouer.c"
 var $30=(($29)&-1); //@line 275 "../../../src/sdl/jouer.c"
 $w=$30; //@line 275 "../../../src/sdl/jouer.c"
 var $31=$w; //@line 276 "../../../src/sdl/jouer.c"
 var $32=$taille; //@line 276 "../../../src/sdl/jouer.c"
 var $33=(((($31|0))%(($32|0)))&-1); //@line 276 "../../../src/sdl/jouer.c"
 var $34=$w; //@line 276 "../../../src/sdl/jouer.c"
 var $35=((($34)-($33))|0); //@line 276 "../../../src/sdl/jouer.c"
 $w=$35; //@line 276 "../../../src/sdl/jouer.c"
 var $36=$w; //@line 277 "../../../src/sdl/jouer.c"
 var $37=$taille; //@line 277 "../../../src/sdl/jouer.c"
 var $38=(((($36|0))/(($37|0)))&-1); //@line 277 "../../../src/sdl/jouer.c"
 $pixel_par_case=$38; //@line 277 "../../../src/sdl/jouer.c"
 $interbordure=2; //@line 278 "../../../src/sdl/jouer.c"
 var $39=$w; //@line 279 "../../../src/sdl/jouer.c"
 var $40=$pixel_par_case; //@line 279 "../../../src/sdl/jouer.c"
 var $41=$taille; //@line 279 "../../../src/sdl/jouer.c"
 var $42=((($41)-(1))|0); //@line 279 "../../../src/sdl/jouer.c"
 var $43=(Math_imul($40,$42)|0); //@line 279 "../../../src/sdl/jouer.c"
 var $44=((($39)-($43))|0); //@line 279 "../../../src/sdl/jouer.c"
 var $45=(((($44|0))/(2))&-1); //@line 279 "../../../src/sdl/jouer.c"
 $bordure=$45; //@line 279 "../../../src/sdl/jouer.c"
 _set_color(240,174,95); //@line 282 "../../../src/sdl/jouer.c"
 var $46=$2; //@line 283 "../../../src/sdl/jouer.c"
 var $47=$x1; //@line 283 "../../../src/sdl/jouer.c"
 var $48=$y1; //@line 283 "../../../src/sdl/jouer.c"
 var $49=$w; //@line 283 "../../../src/sdl/jouer.c"
 var $50=$w; //@line 283 "../../../src/sdl/jouer.c"
 _draw_rect($46,$47,$48,$49,$50); //@line 283 "../../../src/sdl/jouer.c"
 _set_color(30,30,30); //@line 286 "../../../src/sdl/jouer.c"
 $x=0; //@line 287 "../../../src/sdl/jouer.c"
  //@line 287 "../../../src/sdl/jouer.c"
 while(1) {
  var $52=$x; //@line 287 "../../../src/sdl/jouer.c"
  var $53=$taille; //@line 287 "../../../src/sdl/jouer.c"
  var $54=($52|0)<($53|0); //@line 287 "../../../src/sdl/jouer.c"
   //@line 287 "../../../src/sdl/jouer.c"
  if (!($54)) {
   break;
  }
  var $56=$2; //@line 288 "../../../src/sdl/jouer.c"
  var $57=$x1; //@line 288 "../../../src/sdl/jouer.c"
  var $58=$bordure; //@line 288 "../../../src/sdl/jouer.c"
  var $59=((($57)+($58))|0); //@line 288 "../../../src/sdl/jouer.c"
  var $60=$x; //@line 288 "../../../src/sdl/jouer.c"
  var $61=$pixel_par_case; //@line 288 "../../../src/sdl/jouer.c"
  var $62=(Math_imul($60,$61)|0); //@line 288 "../../../src/sdl/jouer.c"
  var $63=((($59)+($62))|0); //@line 288 "../../../src/sdl/jouer.c"
  var $64=$interbordure; //@line 288 "../../../src/sdl/jouer.c"
  var $65=(((($64|0))/(2))&-1); //@line 288 "../../../src/sdl/jouer.c"
  var $66=((($63)-($65))|0); //@line 288 "../../../src/sdl/jouer.c"
  var $67=$y1; //@line 288 "../../../src/sdl/jouer.c"
  var $68=$bordure; //@line 288 "../../../src/sdl/jouer.c"
  var $69=((($67)+($68))|0); //@line 288 "../../../src/sdl/jouer.c"
  var $70=$interbordure; //@line 288 "../../../src/sdl/jouer.c"
  var $71=$pixel_par_case; //@line 288 "../../../src/sdl/jouer.c"
  var $72=$taille; //@line 288 "../../../src/sdl/jouer.c"
  var $73=((($72)-(1))|0); //@line 288 "../../../src/sdl/jouer.c"
  var $74=(Math_imul($71,$73)|0); //@line 288 "../../../src/sdl/jouer.c"
  _draw_rect($56,$66,$69,$70,$74); //@line 288 "../../../src/sdl/jouer.c"
   //@line 292 "../../../src/sdl/jouer.c"
  var $76=$x; //@line 287 "../../../src/sdl/jouer.c"
  var $77=((($76)+(1))|0); //@line 287 "../../../src/sdl/jouer.c"
  $x=$77; //@line 287 "../../../src/sdl/jouer.c"
   //@line 287 "../../../src/sdl/jouer.c"
 }
 $y=0; //@line 293 "../../../src/sdl/jouer.c"
  //@line 293 "../../../src/sdl/jouer.c"
 while(1) {
  var $80=$y; //@line 293 "../../../src/sdl/jouer.c"
  var $81=$taille; //@line 293 "../../../src/sdl/jouer.c"
  var $82=($80|0)<($81|0); //@line 293 "../../../src/sdl/jouer.c"
   //@line 293 "../../../src/sdl/jouer.c"
  if (!($82)) {
   break;
  }
  var $84=$2; //@line 294 "../../../src/sdl/jouer.c"
  var $85=$x1; //@line 294 "../../../src/sdl/jouer.c"
  var $86=$bordure; //@line 294 "../../../src/sdl/jouer.c"
  var $87=((($85)+($86))|0); //@line 294 "../../../src/sdl/jouer.c"
  var $88=$y1; //@line 294 "../../../src/sdl/jouer.c"
  var $89=$bordure; //@line 294 "../../../src/sdl/jouer.c"
  var $90=((($88)+($89))|0); //@line 294 "../../../src/sdl/jouer.c"
  var $91=$y; //@line 294 "../../../src/sdl/jouer.c"
  var $92=$pixel_par_case; //@line 294 "../../../src/sdl/jouer.c"
  var $93=(Math_imul($91,$92)|0); //@line 294 "../../../src/sdl/jouer.c"
  var $94=((($90)+($93))|0); //@line 294 "../../../src/sdl/jouer.c"
  var $95=$interbordure; //@line 294 "../../../src/sdl/jouer.c"
  var $96=(((($95|0))/(2))&-1); //@line 294 "../../../src/sdl/jouer.c"
  var $97=((($94)-($96))|0); //@line 294 "../../../src/sdl/jouer.c"
  var $98=$pixel_par_case; //@line 294 "../../../src/sdl/jouer.c"
  var $99=$taille; //@line 294 "../../../src/sdl/jouer.c"
  var $100=((($99)-(1))|0); //@line 294 "../../../src/sdl/jouer.c"
  var $101=(Math_imul($98,$100)|0); //@line 294 "../../../src/sdl/jouer.c"
  var $102=$interbordure; //@line 294 "../../../src/sdl/jouer.c"
  _draw_rect($84,$87,$97,$101,$102); //@line 294 "../../../src/sdl/jouer.c"
   //@line 298 "../../../src/sdl/jouer.c"
  var $104=$y; //@line 293 "../../../src/sdl/jouer.c"
  var $105=((($104)+(1))|0); //@line 293 "../../../src/sdl/jouer.c"
  $y=$105; //@line 293 "../../../src/sdl/jouer.c"
   //@line 293 "../../../src/sdl/jouer.c"
 }
 var $107=$taille; //@line 300 "../../../src/sdl/jouer.c"
 var $108=($107|0)==9; //@line 300 "../../../src/sdl/jouer.c"
  //@line 300 "../../../src/sdl/jouer.c"
 if ($108) {
   //@line 300 "../../../src/sdl/jouer.c"
  var $115=30;
 } else {
  var $111=$taille; //@line 300 "../../../src/sdl/jouer.c"
  var $112=($111|0)==13; //@line 300 "../../../src/sdl/jouer.c"
  var $113=($112?24:16); //@line 300 "../../../src/sdl/jouer.c"
   //@line 300 "../../../src/sdl/jouer.c"
  var $115=$113;
 }
 var $115; //@line 300 "../../../src/sdl/jouer.c"
 $taille_stone=$115; //@line 300 "../../../src/sdl/jouer.c"
 var $116=$taille_stone; //@line 301 "../../../src/sdl/jouer.c"
 var $117=(((($116|0))/(4))&-1); //@line 301 "../../../src/sdl/jouer.c"
 $taille_stone2=$117; //@line 301 "../../../src/sdl/jouer.c"
 var $118=$jouer; //@line 302 "../../../src/sdl/jouer.c"
 var $119=(($118+48)|0); //@line 302 "../../../src/sdl/jouer.c"
 var $120=$hov; //@line 302 "../../../src/sdl/jouer.c"
 var $121=$119; //@line 302 "../../../src/sdl/jouer.c"
 assert(4 % 1 === 0);HEAP8[($120)]=HEAP8[($121)];HEAP8[((($120)+(1))|0)]=HEAP8[((($121)+(1))|0)];HEAP8[((($120)+(2))|0)]=HEAP8[((($121)+(2))|0)];HEAP8[((($120)+(3))|0)]=HEAP8[((($121)+(3))|0)]; //@line 302 "../../../src/sdl/jouer.c"
 var $122=_position_est_valide($hov); //@line 303 "../../../src/sdl/jouer.c"
  //@line 303 "../../../src/sdl/jouer.c"
 if ($122) {
  var $124=$partie; //@line 304 "../../../src/sdl/jouer.c"
  var $125=(($124)|0); //@line 304 "../../../src/sdl/jouer.c"
  var $126=HEAP32[(($125)>>2)]; //@line 304 "../../../src/sdl/jouer.c"
  var $127=_plateau_determiner_chaine($126,$hov); //@line 304 "../../../src/sdl/jouer.c"
   //@line 304 "../../../src/sdl/jouer.c"
  var $130=$127;
 } else {
   //@line 304 "../../../src/sdl/jouer.c"
  var $130=0;
 }
 var $130; //@line 304 "../../../src/sdl/jouer.c"
 $chaine=$130; //@line 304 "../../../src/sdl/jouer.c"
 var $131=$chaine; //@line 305 "../../../src/sdl/jouer.c"
 var $132=($131|0)!=0; //@line 305 "../../../src/sdl/jouer.c"
  //@line 305 "../../../src/sdl/jouer.c"
 if ($132) {
  var $134=$partie; //@line 305 "../../../src/sdl/jouer.c"
  var $135=(($134)|0); //@line 305 "../../../src/sdl/jouer.c"
  var $136=HEAP32[(($135)>>2)]; //@line 305 "../../../src/sdl/jouer.c"
  var $137=$chaine; //@line 305 "../../../src/sdl/jouer.c"
  var $138=_determiner_libertes($136,$137); //@line 305 "../../../src/sdl/jouer.c"
   //@line 305 "../../../src/sdl/jouer.c"
  var $141=$138;
 } else {
   //@line 305 "../../../src/sdl/jouer.c"
  var $141=0;
 }
 var $141; //@line 305 "../../../src/sdl/jouer.c"
 $libertes=$141; //@line 305 "../../../src/sdl/jouer.c"
 var $142=$chaine; //@line 306 "../../../src/sdl/jouer.c"
 var $143=($142|0)!=0; //@line 306 "../../../src/sdl/jouer.c"
  //@line 306 "../../../src/sdl/jouer.c"
 if ($143) {
  var $145=$chaine; //@line 306 "../../../src/sdl/jouer.c"
  var $146=$partie; //@line 306 "../../../src/sdl/jouer.c"
  var $147=(($146)|0); //@line 306 "../../../src/sdl/jouer.c"
  var $148=HEAP32[(($147)>>2)]; //@line 306 "../../../src/sdl/jouer.c"
  var $149=_lesYeuxDeLaChaine($145,$148); //@line 306 "../../../src/sdl/jouer.c"
   //@line 306 "../../../src/sdl/jouer.c"
  var $152=$149;
 } else {
   //@line 306 "../../../src/sdl/jouer.c"
  var $152=0;
 }
 var $152; //@line 306 "../../../src/sdl/jouer.c"
 $yeux=$152; //@line 306 "../../../src/sdl/jouer.c"
 $x2=0; //@line 307 "../../../src/sdl/jouer.c"
  //@line 307 "../../../src/sdl/jouer.c"
 while(1) {
  var $154=$x2; //@line 307 "../../../src/sdl/jouer.c"
  var $155=$taille; //@line 307 "../../../src/sdl/jouer.c"
  var $156=($154|0)<($155|0); //@line 307 "../../../src/sdl/jouer.c"
   //@line 307 "../../../src/sdl/jouer.c"
  if (!($156)) {
   break;
  }
  $y3=0; //@line 308 "../../../src/sdl/jouer.c"
   //@line 308 "../../../src/sdl/jouer.c"
  while(1) {
   var $159=$y3; //@line 308 "../../../src/sdl/jouer.c"
   var $160=$taille; //@line 308 "../../../src/sdl/jouer.c"
   var $161=($159|0)<($160|0); //@line 308 "../../../src/sdl/jouer.c"
    //@line 308 "../../../src/sdl/jouer.c"
   if (!($161)) {
    break;
   }
   var $163=$x2; //@line 309 "../../../src/sdl/jouer.c"
   var $164=$y3; //@line 309 "../../../src/sdl/jouer.c"
   var $165=$taille; //@line 309 "../../../src/sdl/jouer.c"
   _position($pos,$163,$164,$165); //@line 309 "../../../src/sdl/jouer.c"
   var $166=$partie; //@line 310 "../../../src/sdl/jouer.c"
   var $167=(($166)|0); //@line 310 "../../../src/sdl/jouer.c"
   var $168=HEAP32[(($167)>>2)]; //@line 310 "../../../src/sdl/jouer.c"
   var $169=$x2; //@line 310 "../../../src/sdl/jouer.c"
   var $170=$y3; //@line 310 "../../../src/sdl/jouer.c"
   var $171=_plateau_get($168,$169,$170); //@line 310 "../../../src/sdl/jouer.c"
   $c=$171; //@line 310 "../../../src/sdl/jouer.c"
   $draw=0; //@line 311 "../../../src/sdl/jouer.c"
   var $172=$c; //@line 312 "../../../src/sdl/jouer.c"
   var $173=($172|0)!=0; //@line 312 "../../../src/sdl/jouer.c"
    //@line 312 "../../../src/sdl/jouer.c"
   if ($173) {
    var $175=$c; //@line 313 "../../../src/sdl/jouer.c"
    var $176=($175|0)==1; //@line 313 "../../../src/sdl/jouer.c"
     //@line 313 "../../../src/sdl/jouer.c"
    if ($176) {
     _set_color(210,210,210); //@line 314 "../../../src/sdl/jouer.c"
      //@line 315 "../../../src/sdl/jouer.c"
    } else {
     _set_color(40,40,40); //@line 316 "../../../src/sdl/jouer.c"
    }
    $draw=1; //@line 318 "../../../src/sdl/jouer.c"
     //@line 319 "../../../src/sdl/jouer.c"
   } else {
    var $181=_position_est_valide($hov); //@line 319 "../../../src/sdl/jouer.c"
     //@line 319 "../../../src/sdl/jouer.c"
    do {
     if ($181) {
      var $183=(($hov)|0); //@line 319 "../../../src/sdl/jouer.c"
      var $184=HEAP8[($183)]; //@line 319 "../../../src/sdl/jouer.c"
      var $185=(($184<<24)>>24); //@line 319 "../../../src/sdl/jouer.c"
      var $186=$x2; //@line 319 "../../../src/sdl/jouer.c"
      var $187=($185|0)==($186|0); //@line 319 "../../../src/sdl/jouer.c"
       //@line 319 "../../../src/sdl/jouer.c"
      if (!($187)) {
       break;
      }
      var $189=(($hov+1)|0); //@line 319 "../../../src/sdl/jouer.c"
      var $190=HEAP8[($189)]; //@line 319 "../../../src/sdl/jouer.c"
      var $191=(($190<<24)>>24); //@line 319 "../../../src/sdl/jouer.c"
      var $192=$y3; //@line 319 "../../../src/sdl/jouer.c"
      var $193=($191|0)==($192|0); //@line 319 "../../../src/sdl/jouer.c"
       //@line 319 "../../../src/sdl/jouer.c"
      if (!($193)) {
       break;
      }
      var $195=$partie; //@line 320 "../../../src/sdl/jouer.c"
      var $196=(($195+52)|0); //@line 320 "../../../src/sdl/jouer.c"
      var $197=HEAP32[(($196)>>2)]; //@line 320 "../../../src/sdl/jouer.c"
      var $198=($197|0)==0; //@line 320 "../../../src/sdl/jouer.c"
       //@line 320 "../../../src/sdl/jouer.c"
      if ($198) {
       _set_color(240,240,240); //@line 321 "../../../src/sdl/jouer.c"
        //@line 322 "../../../src/sdl/jouer.c"
      } else {
       _set_color(20,20,20); //@line 323 "../../../src/sdl/jouer.c"
      }
      $draw=1; //@line 325 "../../../src/sdl/jouer.c"
       //@line 326 "../../../src/sdl/jouer.c"
     }
    } while(0);
   }
   var $204=$taille; //@line 327 "../../../src/sdl/jouer.c"
   var $205=($204|0)==9; //@line 327 "../../../src/sdl/jouer.c"
   var $206=($205?2:3); //@line 327 "../../../src/sdl/jouer.c"
   $marge=$206; //@line 327 "../../../src/sdl/jouer.c"
   var $207=$draw; //@line 328 "../../../src/sdl/jouer.c"
   var $208=(($207)&1); //@line 328 "../../../src/sdl/jouer.c"
    //@line 328 "../../../src/sdl/jouer.c"
   if ($208) {
    var $210=$jouer; //@line 331 "../../../src/sdl/jouer.c"
    var $211=$x2; //@line 331 "../../../src/sdl/jouer.c"
    var $212=$y3; //@line 331 "../../../src/sdl/jouer.c"
    _get_position_vers_ecran($210,$211,$212,$sx,$sy); //@line 331 "../../../src/sdl/jouer.c"
    var $213=$taille_stone; //@line 332 "../../../src/sdl/jouer.c"
    var $214=(((($213|0))/(2))&-1); //@line 332 "../../../src/sdl/jouer.c"
    var $215=HEAP32[(($sx)>>2)]; //@line 332 "../../../src/sdl/jouer.c"
    var $216=((($215)-($214))|0); //@line 332 "../../../src/sdl/jouer.c"
    HEAP32[(($sx)>>2)]=$216; //@line 332 "../../../src/sdl/jouer.c"
    var $217=$taille_stone; //@line 333 "../../../src/sdl/jouer.c"
    var $218=(((($217|0))/(2))&-1); //@line 333 "../../../src/sdl/jouer.c"
    var $219=HEAP32[(($sy)>>2)]; //@line 333 "../../../src/sdl/jouer.c"
    var $220=((($219)-($218))|0); //@line 333 "../../../src/sdl/jouer.c"
    HEAP32[(($sy)>>2)]=$220; //@line 333 "../../../src/sdl/jouer.c"
    var $221=$2; //@line 334 "../../../src/sdl/jouer.c"
    var $222=HEAP32[(($sx)>>2)]; //@line 334 "../../../src/sdl/jouer.c"
    var $223=HEAP32[(($sy)>>2)]; //@line 334 "../../../src/sdl/jouer.c"
    var $224=$taille_stone; //@line 334 "../../../src/sdl/jouer.c"
    var $225=$taille_stone; //@line 334 "../../../src/sdl/jouer.c"
    _draw_rect($221,$222,$223,$224,$225); //@line 334 "../../../src/sdl/jouer.c"
     //@line 335 "../../../src/sdl/jouer.c"
   } else {
    var $227=$x2; //@line 335 "../../../src/sdl/jouer.c"
    var $228=$taille; //@line 335 "../../../src/sdl/jouer.c"
    var $229=_get_marge($227,$228); //@line 335 "../../../src/sdl/jouer.c"
    var $230=$marge; //@line 335 "../../../src/sdl/jouer.c"
    var $231=($229|0)==($230|0); //@line 335 "../../../src/sdl/jouer.c"
     //@line 335 "../../../src/sdl/jouer.c"
    if ($231) {
     label = 45;
    } else {
     var $233=$x2; //@line 335 "../../../src/sdl/jouer.c"
     var $234=$taille; //@line 335 "../../../src/sdl/jouer.c"
     var $235=(((($234|0))/(2))&-1); //@line 335 "../../../src/sdl/jouer.c"
     var $236=($233|0)==($235|0); //@line 335 "../../../src/sdl/jouer.c"
      //@line 335 "../../../src/sdl/jouer.c"
     if ($236) {
      label = 45;
     }
    }
    do {
     if (label == 45) {
      label = 0;
      var $238=$y3; //@line 336 "../../../src/sdl/jouer.c"
      var $239=$taille; //@line 336 "../../../src/sdl/jouer.c"
      var $240=_get_marge($238,$239); //@line 336 "../../../src/sdl/jouer.c"
      var $241=$marge; //@line 336 "../../../src/sdl/jouer.c"
      var $242=($240|0)==($241|0); //@line 336 "../../../src/sdl/jouer.c"
       //@line 336 "../../../src/sdl/jouer.c"
      if (!($242)) {
       var $244=$y3; //@line 336 "../../../src/sdl/jouer.c"
       var $245=$taille; //@line 336 "../../../src/sdl/jouer.c"
       var $246=(((($245|0))/(2))&-1); //@line 336 "../../../src/sdl/jouer.c"
       var $247=($244|0)==($246|0); //@line 336 "../../../src/sdl/jouer.c"
        //@line 336 "../../../src/sdl/jouer.c"
       if (!($247)) {
        break;
       }
      }
      var $249=$jouer; //@line 339 "../../../src/sdl/jouer.c"
      var $250=$x2; //@line 339 "../../../src/sdl/jouer.c"
      var $251=$y3; //@line 339 "../../../src/sdl/jouer.c"
      _get_position_vers_ecran($249,$250,$251,$sx4,$sy5); //@line 339 "../../../src/sdl/jouer.c"
      _set_color(0,0,0); //@line 340 "../../../src/sdl/jouer.c"
      var $252=$2; //@line 341 "../../../src/sdl/jouer.c"
      var $253=HEAP32[(($sx4)>>2)]; //@line 341 "../../../src/sdl/jouer.c"
      var $254=((($253)-(3))|0); //@line 341 "../../../src/sdl/jouer.c"
      var $255=HEAP32[(($sy5)>>2)]; //@line 341 "../../../src/sdl/jouer.c"
      var $256=((($255)-(3))|0); //@line 341 "../../../src/sdl/jouer.c"
      _draw_rect($252,$254,$256,6,6); //@line 341 "../../../src/sdl/jouer.c"
       //@line 342 "../../../src/sdl/jouer.c"
     }
    } while(0);
   }
   $draw=0; //@line 345 "../../../src/sdl/jouer.c"
   var $259=$chaine; //@line 346 "../../../src/sdl/jouer.c"
   var $260=($259|0)!=0; //@line 346 "../../../src/sdl/jouer.c"
    //@line 346 "../../../src/sdl/jouer.c"
   do {
    if ($260) {
     var $262=$chaine; //@line 346 "../../../src/sdl/jouer.c"
     var $263=(($262+16)|0); //@line 346 "../../../src/sdl/jouer.c"
     var $264=HEAP32[(($263)>>2)]; //@line 346 "../../../src/sdl/jouer.c"
     var $265=$chaine; //@line 346 "../../../src/sdl/jouer.c"
     var $266=FUNCTION_TABLE[$264]($265,$pos); //@line 346 "../../../src/sdl/jouer.c"
      //@line 346 "../../../src/sdl/jouer.c"
     if (!($266)) {
      label = 52;
      break;
     }
     _set_color(120,120,120); //@line 347 "../../../src/sdl/jouer.c"
     $draw=1; //@line 348 "../../../src/sdl/jouer.c"
      //@line 349 "../../../src/sdl/jouer.c"
    } else {
     label = 52;
    }
   } while(0);
   if (label == 52) {
    label = 0;
    var $269=$yeux; //@line 349 "../../../src/sdl/jouer.c"
    var $270=($269|0)!=0; //@line 349 "../../../src/sdl/jouer.c"
     //@line 349 "../../../src/sdl/jouer.c"
    do {
     if ($270) {
      var $272=$yeux; //@line 349 "../../../src/sdl/jouer.c"
      var $273=(($272+16)|0); //@line 349 "../../../src/sdl/jouer.c"
      var $274=HEAP32[(($273)>>2)]; //@line 349 "../../../src/sdl/jouer.c"
      var $275=$yeux; //@line 349 "../../../src/sdl/jouer.c"
      var $276=FUNCTION_TABLE[$274]($275,$pos); //@line 349 "../../../src/sdl/jouer.c"
       //@line 349 "../../../src/sdl/jouer.c"
      if (!($276)) {
       label = 55;
       break;
      }
      _set_color(255,130,130); //@line 350 "../../../src/sdl/jouer.c"
      $draw=1; //@line 351 "../../../src/sdl/jouer.c"
       //@line 352 "../../../src/sdl/jouer.c"
     } else {
      label = 55;
     }
    } while(0);
    if (label == 55) {
     label = 0;
     var $279=$libertes; //@line 352 "../../../src/sdl/jouer.c"
     var $280=($279|0)!=0; //@line 352 "../../../src/sdl/jouer.c"
      //@line 352 "../../../src/sdl/jouer.c"
     do {
      if ($280) {
       var $282=$libertes; //@line 352 "../../../src/sdl/jouer.c"
       var $283=(($282+16)|0); //@line 352 "../../../src/sdl/jouer.c"
       var $284=HEAP32[(($283)>>2)]; //@line 352 "../../../src/sdl/jouer.c"
       var $285=$libertes; //@line 352 "../../../src/sdl/jouer.c"
       var $286=FUNCTION_TABLE[$284]($285,$pos); //@line 352 "../../../src/sdl/jouer.c"
        //@line 352 "../../../src/sdl/jouer.c"
       if (!($286)) {
        break;
       }
       _set_color(200,40,40); //@line 353 "../../../src/sdl/jouer.c"
       $draw=1; //@line 354 "../../../src/sdl/jouer.c"
        //@line 355 "../../../src/sdl/jouer.c"
      }
     } while(0);
    }
   }
   var $291=$draw; //@line 356 "../../../src/sdl/jouer.c"
   var $292=(($291)&1); //@line 356 "../../../src/sdl/jouer.c"
    //@line 356 "../../../src/sdl/jouer.c"
   if ($292) {
    var $294=$jouer; //@line 358 "../../../src/sdl/jouer.c"
    var $295=$x2; //@line 358 "../../../src/sdl/jouer.c"
    var $296=$y3; //@line 358 "../../../src/sdl/jouer.c"
    _get_position_vers_ecran($294,$295,$296,$sx6,$sy7); //@line 358 "../../../src/sdl/jouer.c"
    var $297=$taille_stone2; //@line 359 "../../../src/sdl/jouer.c"
    var $298=(((($297|0))/(2))&-1); //@line 359 "../../../src/sdl/jouer.c"
    var $299=HEAP32[(($sx6)>>2)]; //@line 359 "../../../src/sdl/jouer.c"
    var $300=((($299)-($298))|0); //@line 359 "../../../src/sdl/jouer.c"
    HEAP32[(($sx6)>>2)]=$300; //@line 359 "../../../src/sdl/jouer.c"
    var $301=$taille_stone2; //@line 360 "../../../src/sdl/jouer.c"
    var $302=(((($301|0))/(2))&-1); //@line 360 "../../../src/sdl/jouer.c"
    var $303=HEAP32[(($sy7)>>2)]; //@line 360 "../../../src/sdl/jouer.c"
    var $304=((($303)-($302))|0); //@line 360 "../../../src/sdl/jouer.c"
    HEAP32[(($sy7)>>2)]=$304; //@line 360 "../../../src/sdl/jouer.c"
    var $305=$2; //@line 361 "../../../src/sdl/jouer.c"
    var $306=HEAP32[(($sx6)>>2)]; //@line 361 "../../../src/sdl/jouer.c"
    var $307=HEAP32[(($sy7)>>2)]; //@line 361 "../../../src/sdl/jouer.c"
    var $308=$taille_stone2; //@line 361 "../../../src/sdl/jouer.c"
    var $309=$taille_stone2; //@line 361 "../../../src/sdl/jouer.c"
    _draw_rect($305,$306,$307,$308,$309); //@line 361 "../../../src/sdl/jouer.c"
     //@line 362 "../../../src/sdl/jouer.c"
   }
    //@line 363 "../../../src/sdl/jouer.c"
   var $312=$y3; //@line 308 "../../../src/sdl/jouer.c"
   var $313=((($312)+(1))|0); //@line 308 "../../../src/sdl/jouer.c"
   $y3=$313; //@line 308 "../../../src/sdl/jouer.c"
    //@line 308 "../../../src/sdl/jouer.c"
  }
   //@line 364 "../../../src/sdl/jouer.c"
  var $316=$x2; //@line 307 "../../../src/sdl/jouer.c"
  var $317=((($316)+(1))|0); //@line 307 "../../../src/sdl/jouer.c"
  $x2=$317; //@line 307 "../../../src/sdl/jouer.c"
   //@line 307 "../../../src/sdl/jouer.c"
 }
 var $319=$chaine; //@line 365 "../../../src/sdl/jouer.c"
 var $320=($319|0)!=0; //@line 365 "../../../src/sdl/jouer.c"
  //@line 365 "../../../src/sdl/jouer.c"
 if ($320) {
  var $322=$chaine; //@line 366 "../../../src/sdl/jouer.c"
  _detruire_ensemble_colore($322); //@line 366 "../../../src/sdl/jouer.c"
   //@line 366 "../../../src/sdl/jouer.c"
 }
 var $324=$libertes; //@line 367 "../../../src/sdl/jouer.c"
 var $325=($324|0)!=0; //@line 367 "../../../src/sdl/jouer.c"
  //@line 367 "../../../src/sdl/jouer.c"
 if ($325) {
  var $327=$libertes; //@line 368 "../../../src/sdl/jouer.c"
  _detruire_ensemble_position($327); //@line 368 "../../../src/sdl/jouer.c"
   //@line 368 "../../../src/sdl/jouer.c"
 }
 var $329=$yeux; //@line 369 "../../../src/sdl/jouer.c"
 var $330=($329|0)!=0; //@line 369 "../../../src/sdl/jouer.c"
  //@line 369 "../../../src/sdl/jouer.c"
 if ($330) {
  var $332=$yeux; //@line 370 "../../../src/sdl/jouer.c"
  _detruire_ensemble_position($332); //@line 370 "../../../src/sdl/jouer.c"
   //@line 370 "../../../src/sdl/jouer.c"
 }
 var $334=$partie; //@line 372 "../../../src/sdl/jouer.c"
 var $335=(($334+49)|0); //@line 372 "../../../src/sdl/jouer.c"
 var $336=HEAP8[($335)]; //@line 372 "../../../src/sdl/jouer.c"
 var $337=(($336)&1); //@line 372 "../../../src/sdl/jouer.c"
  //@line 372 "../../../src/sdl/jouer.c"
 if ($337) {
  var $357=$2; //@line 379 "../../../src/sdl/jouer.c"
  var $358=$jouer; //@line 379 "../../../src/sdl/jouer.c"
  var $359=(($358+24)|0); //@line 379 "../../../src/sdl/jouer.c"
  var $360=HEAP32[(($359)>>2)]; //@line 379 "../../../src/sdl/jouer.c"
  _afficher_label($357,$360); //@line 379 "../../../src/sdl/jouer.c"
  var $361=$2; //@line 380 "../../../src/sdl/jouer.c"
  var $362=$jouer; //@line 380 "../../../src/sdl/jouer.c"
  var $363=(($362+28)|0); //@line 380 "../../../src/sdl/jouer.c"
  var $364=HEAP32[(($363)>>2)]; //@line 380 "../../../src/sdl/jouer.c"
  _afficher_label($361,$364); //@line 380 "../../../src/sdl/jouer.c"
  var $366=$2; //@line 382 "../../../src/sdl/jouer.c"
  var $367=$jouer; //@line 382 "../../../src/sdl/jouer.c"
  var $368=(($367+36)|0); //@line 382 "../../../src/sdl/jouer.c"
  var $369=HEAP32[(($368)>>2)]; //@line 382 "../../../src/sdl/jouer.c"
  _afficher_bouton($366,$369); //@line 382 "../../../src/sdl/jouer.c"
  var $370=$2; //@line 383 "../../../src/sdl/jouer.c"
  var $371=$jouer; //@line 383 "../../../src/sdl/jouer.c"
  var $372=(($371+32)|0); //@line 383 "../../../src/sdl/jouer.c"
  var $373=HEAP32[(($372)>>2)]; //@line 383 "../../../src/sdl/jouer.c"
  _afficher_bouton($370,$373); //@line 383 "../../../src/sdl/jouer.c"
  var $374=$2; //@line 384 "../../../src/sdl/jouer.c"
  var $375=$jouer; //@line 384 "../../../src/sdl/jouer.c"
  var $376=(($375+40)|0); //@line 384 "../../../src/sdl/jouer.c"
  var $377=HEAP32[(($376)>>2)]; //@line 384 "../../../src/sdl/jouer.c"
  _afficher_textinput($374,$377); //@line 384 "../../../src/sdl/jouer.c"
  var $378=$2; //@line 385 "../../../src/sdl/jouer.c"
  var $379=$jouer; //@line 385 "../../../src/sdl/jouer.c"
  var $380=(($379+44)|0); //@line 385 "../../../src/sdl/jouer.c"
  var $381=HEAP32[(($380)>>2)]; //@line 385 "../../../src/sdl/jouer.c"
  _afficher_bouton($378,$381); //@line 385 "../../../src/sdl/jouer.c"
  STACKTOP=sp;return; //@line 386 "../../../src/sdl/jouer.c"
 }
 var $339=$partie; //@line 373 "../../../src/sdl/jouer.c"
 var $340=_partie_en_cours_de_handicap($339); //@line 373 "../../../src/sdl/jouer.c"
  //@line 373 "../../../src/sdl/jouer.c"
 if ($340) {
  var $342=$2; //@line 374 "../../../src/sdl/jouer.c"
  var $343=$jouer; //@line 374 "../../../src/sdl/jouer.c"
  var $344=(($343+20)|0); //@line 374 "../../../src/sdl/jouer.c"
  var $345=HEAP32[(($344)>>2)]; //@line 374 "../../../src/sdl/jouer.c"
  _afficher_label($342,$345); //@line 374 "../../../src/sdl/jouer.c"
   //@line 375 "../../../src/sdl/jouer.c"
 } else {
  var $347=$2; //@line 376 "../../../src/sdl/jouer.c"
  var $348=$partie; //@line 376 "../../../src/sdl/jouer.c"
  var $349=(($348+52)|0); //@line 376 "../../../src/sdl/jouer.c"
  var $350=HEAP32[(($349)>>2)]; //@line 376 "../../../src/sdl/jouer.c"
  var $351=$jouer; //@line 376 "../../../src/sdl/jouer.c"
  var $352=(($351+12)|0); //@line 376 "../../../src/sdl/jouer.c"
  var $353=(($352+($350<<2))|0); //@line 376 "../../../src/sdl/jouer.c"
  var $354=HEAP32[(($353)>>2)]; //@line 376 "../../../src/sdl/jouer.c"
  _afficher_label($347,$354); //@line 376 "../../../src/sdl/jouer.c"
 }
  //@line 378 "../../../src/sdl/jouer.c"
 var $366=$2; //@line 382 "../../../src/sdl/jouer.c"
 var $367=$jouer; //@line 382 "../../../src/sdl/jouer.c"
 var $368=(($367+36)|0); //@line 382 "../../../src/sdl/jouer.c"
 var $369=HEAP32[(($368)>>2)]; //@line 382 "../../../src/sdl/jouer.c"
 _afficher_bouton($366,$369); //@line 382 "../../../src/sdl/jouer.c"
 var $370=$2; //@line 383 "../../../src/sdl/jouer.c"
 var $371=$jouer; //@line 383 "../../../src/sdl/jouer.c"
 var $372=(($371+32)|0); //@line 383 "../../../src/sdl/jouer.c"
 var $373=HEAP32[(($372)>>2)]; //@line 383 "../../../src/sdl/jouer.c"
 _afficher_bouton($370,$373); //@line 383 "../../../src/sdl/jouer.c"
 var $374=$2; //@line 384 "../../../src/sdl/jouer.c"
 var $375=$jouer; //@line 384 "../../../src/sdl/jouer.c"
 var $376=(($375+40)|0); //@line 384 "../../../src/sdl/jouer.c"
 var $377=HEAP32[(($376)>>2)]; //@line 384 "../../../src/sdl/jouer.c"
 _afficher_textinput($374,$377); //@line 384 "../../../src/sdl/jouer.c"
 var $378=$2; //@line 385 "../../../src/sdl/jouer.c"
 var $379=$jouer; //@line 385 "../../../src/sdl/jouer.c"
 var $380=(($379+44)|0); //@line 385 "../../../src/sdl/jouer.c"
 var $381=HEAP32[(($380)>>2)]; //@line 385 "../../../src/sdl/jouer.c"
 _afficher_bouton($378,$381); //@line 385 "../../../src/sdl/jouer.c"
 STACKTOP=sp;return; //@line 386 "../../../src/sdl/jouer.c"
}


function _mise_a_jour_jouer($state,$dt){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+280)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $jouer;
 var $partie;
 var $scores=sp;
 var $gagnant;
 var $buffer=(sp)+(8);
 var $3=(sp)+(264);
 var $j;
 var $4=(sp)+(272);
 $1=$state;
 $2=$dt;
 var $5=$2; //@line 187 "../../../src/sdl/jouer.c"
 var $6=$1; //@line 188 "../../../src/sdl/jouer.c"
 var $7=(($6+28)|0); //@line 188 "../../../src/sdl/jouer.c"
 var $8=HEAP32[(($7)>>2)]; //@line 188 "../../../src/sdl/jouer.c"
 var $9=$8; //@line 188 "../../../src/sdl/jouer.c"
 $jouer=$9; //@line 188 "../../../src/sdl/jouer.c"
 var $10=$jouer; //@line 189 "../../../src/sdl/jouer.c"
 var $11=(($10+4)|0); //@line 189 "../../../src/sdl/jouer.c"
 var $12=HEAP32[(($11)>>2)]; //@line 189 "../../../src/sdl/jouer.c"
 $partie=$12; //@line 189 "../../../src/sdl/jouer.c"
 var $13=$partie; //@line 190 "../../../src/sdl/jouer.c"
 var $14=(($13+49)|0); //@line 190 "../../../src/sdl/jouer.c"
 var $15=HEAP8[($14)]; //@line 190 "../../../src/sdl/jouer.c"
 var $16=(($15)&1); //@line 190 "../../../src/sdl/jouer.c"
  //@line 190 "../../../src/sdl/jouer.c"
 if (!($16)) {
  var $18=$partie; //@line 191 "../../../src/sdl/jouer.c"
  var $19=(($18+52)|0); //@line 191 "../../../src/sdl/jouer.c"
  var $20=HEAP32[(($19)>>2)]; //@line 191 "../../../src/sdl/jouer.c"
  var $21=$partie; //@line 191 "../../../src/sdl/jouer.c"
  var $22=(($21+4)|0); //@line 191 "../../../src/sdl/jouer.c"
  var $23=(($22+((($20)*(20))&-1))|0); //@line 191 "../../../src/sdl/jouer.c"
  var $24=(($23)|0); //@line 191 "../../../src/sdl/jouer.c"
  var $25=HEAP32[(($24)>>2)]; //@line 191 "../../../src/sdl/jouer.c"
  var $26=($25|0)==1; //@line 191 "../../../src/sdl/jouer.c"
   //@line 191 "../../../src/sdl/jouer.c"
  if ($26) {
   var $28=$partie; //@line 192 "../../../src/sdl/jouer.c"
   _partie_jouer_ordinateur($28); //@line 192 "../../../src/sdl/jouer.c"
    //@line 193 "../../../src/sdl/jouer.c"
  }
   //@line 194 "../../../src/sdl/jouer.c"
 }
 var $31=$partie; //@line 195 "../../../src/sdl/jouer.c"
 var $32=(($31+49)|0); //@line 195 "../../../src/sdl/jouer.c"
 var $33=HEAP8[($32)]; //@line 195 "../../../src/sdl/jouer.c"
 var $34=(($33)&1); //@line 195 "../../../src/sdl/jouer.c"
  //@line 195 "../../../src/sdl/jouer.c"
 if ($34) {
  var $36=$jouer; //@line 196 "../../../src/sdl/jouer.c"
  var $37=(($36+28)|0); //@line 196 "../../../src/sdl/jouer.c"
  var $38=HEAP32[(($37)>>2)]; //@line 196 "../../../src/sdl/jouer.c"
  var $39=($38|0)==0; //@line 196 "../../../src/sdl/jouer.c"
   //@line 196 "../../../src/sdl/jouer.c"
  if ($39) {
   var $41=$partie; //@line 198 "../../../src/sdl/jouer.c"
   var $42=(($scores)|0); //@line 198 "../../../src/sdl/jouer.c"
   _partie_score_joueurs($41,$42,7.5); //@line 198 "../../../src/sdl/jouer.c"
   var $43=(($scores+4)|0); //@line 199 "../../../src/sdl/jouer.c"
   var $44=HEAPF32[(($43)>>2)]; //@line 199 "../../../src/sdl/jouer.c"
   var $45=(($scores)|0); //@line 199 "../../../src/sdl/jouer.c"
   var $46=HEAPF32[(($45)>>2)]; //@line 199 "../../../src/sdl/jouer.c"
   var $47=$44>$46; //@line 199 "../../../src/sdl/jouer.c"
   var $48=($47?1:0); //@line 199 "../../../src/sdl/jouer.c"
   $gagnant=$48; //@line 199 "../../../src/sdl/jouer.c"
   var $49=$buffer; //@line 201 "../../../src/sdl/jouer.c"
   _memset($49, 0, 256)|0; //@line 201 "../../../src/sdl/jouer.c"
   var $50=(($buffer)|0); //@line 202 "../../../src/sdl/jouer.c"
   var $51=$gagnant; //@line 202 "../../../src/sdl/jouer.c"
   var $52=$partie; //@line 202 "../../../src/sdl/jouer.c"
   var $53=(($52+4)|0); //@line 202 "../../../src/sdl/jouer.c"
   var $54=(($53+((($51)*(20))&-1))|0); //@line 202 "../../../src/sdl/jouer.c"
   var $55=(($54+4)|0); //@line 202 "../../../src/sdl/jouer.c"
   var $56=(($55)|0); //@line 202 "../../../src/sdl/jouer.c"
   var $57=$gagnant; //@line 202 "../../../src/sdl/jouer.c"
   var $58=($57|0)==1; //@line 202 "../../../src/sdl/jouer.c"
   var $59=($58?104:48); //@line 202 "../../../src/sdl/jouer.c"
   var $60=(($scores+4)|0); //@line 202 "../../../src/sdl/jouer.c"
   var $61=HEAPF32[(($60)>>2)]; //@line 202 "../../../src/sdl/jouer.c"
   var $62=$61; //@line 202 "../../../src/sdl/jouer.c"
   var $63=(($scores)|0); //@line 202 "../../../src/sdl/jouer.c"
   var $64=HEAPF32[(($63)>>2)]; //@line 202 "../../../src/sdl/jouer.c"
   var $65=$64; //@line 202 "../../../src/sdl/jouer.c"
   var $66=_snprintf($50,256,152,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 32)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$56,HEAP32[(((tempVarArgs)+(8))>>2)]=$59,HEAPF64[(((tempVarArgs)+(16))>>3)]=$62,HEAPF64[(((tempVarArgs)+(24))>>3)]=$65,tempVarArgs)); STACKTOP=tempVarArgs; //@line 202 "../../../src/sdl/jouer.c"
   _set_color(200,200,200); //@line 206 "../../../src/sdl/jouer.c"
   var $67=(($buffer)|0); //@line 207 "../../../src/sdl/jouer.c"
   var $68=_creer_label($67,240,646,2,1); //@line 207 "../../../src/sdl/jouer.c"
   var $69=$jouer; //@line 207 "../../../src/sdl/jouer.c"
   var $70=(($69+28)|0); //@line 207 "../../../src/sdl/jouer.c"
   HEAP32[(($70)>>2)]=$68; //@line 207 "../../../src/sdl/jouer.c"
   _set_color(100,200,100); //@line 209 "../../../src/sdl/jouer.c"
   var $71=$jouer; //@line 210 "../../../src/sdl/jouer.c"
   var $72=(($71+36)|0); //@line 210 "../../../src/sdl/jouer.c"
   var $73=HEAP32[(($72)>>2)]; //@line 210 "../../../src/sdl/jouer.c"
   var $74=(($73+28)|0); //@line 210 "../../../src/sdl/jouer.c"
   _get_color($3); //@line 210 "../../../src/sdl/jouer.c"
   var $75=$74; //@line 210 "../../../src/sdl/jouer.c"
   var $76=$3; //@line 210 "../../../src/sdl/jouer.c"
   assert(4 % 1 === 0);HEAP8[($75)]=HEAP8[($76)];HEAP8[((($75)+(1))|0)]=HEAP8[((($76)+(1))|0)];HEAP8[((($75)+(2))|0)]=HEAP8[((($76)+(2))|0)];HEAP8[((($75)+(3))|0)]=HEAP8[((($76)+(3))|0)]; //@line 210 "../../../src/sdl/jouer.c"
   var $77=$jouer; //@line 212 "../../../src/sdl/jouer.c"
   var $78=(($77+32)|0); //@line 212 "../../../src/sdl/jouer.c"
   var $79=HEAP32[(($78)>>2)]; //@line 212 "../../../src/sdl/jouer.c"
   var $80=(($79+36)|0); //@line 212 "../../../src/sdl/jouer.c"
   HEAP8[($80)]=0; //@line 212 "../../../src/sdl/jouer.c"
    //@line 213 "../../../src/sdl/jouer.c"
  }
   //@line 214 "../../../src/sdl/jouer.c"
 }
 var $83=$partie; //@line 217 "../../../src/sdl/jouer.c"
 var $84=(($83+52)|0); //@line 217 "../../../src/sdl/jouer.c"
 var $85=HEAP32[(($84)>>2)]; //@line 217 "../../../src/sdl/jouer.c"
 $j=$85; //@line 217 "../../../src/sdl/jouer.c"
 var $86=$j; //@line 218 "../../../src/sdl/jouer.c"
 var $87=($86|0)==1; //@line 218 "../../../src/sdl/jouer.c"
  //@line 218 "../../../src/sdl/jouer.c"
 if ($87) {
  _set_color(100,100,100); //@line 219 "../../../src/sdl/jouer.c"
   //@line 219 "../../../src/sdl/jouer.c"
 } else {
  _set_color(200,200,200); //@line 221 "../../../src/sdl/jouer.c"
 }
 var $91=$jouer; //@line 222 "../../../src/sdl/jouer.c"
 var $92=(($91+32)|0); //@line 222 "../../../src/sdl/jouer.c"
 var $93=HEAP32[(($92)>>2)]; //@line 222 "../../../src/sdl/jouer.c"
 var $94=(($93+28)|0); //@line 222 "../../../src/sdl/jouer.c"
 _get_color($4); //@line 222 "../../../src/sdl/jouer.c"
 var $95=$94; //@line 222 "../../../src/sdl/jouer.c"
 var $96=$4; //@line 222 "../../../src/sdl/jouer.c"
 assert(4 % 1 === 0);HEAP8[($95)]=HEAP8[($96)];HEAP8[((($95)+(1))|0)]=HEAP8[((($96)+(1))|0)];HEAP8[((($95)+(2))|0)]=HEAP8[((($96)+(2))|0)];HEAP8[((($95)+(3))|0)]=HEAP8[((($96)+(3))|0)]; //@line 222 "../../../src/sdl/jouer.c"
 var $97=$jouer; //@line 224 "../../../src/sdl/jouer.c"
 var $98=(($97+32)|0); //@line 224 "../../../src/sdl/jouer.c"
 var $99=HEAP32[(($98)>>2)]; //@line 224 "../../../src/sdl/jouer.c"
 var $100=$2; //@line 224 "../../../src/sdl/jouer.c"
 _mise_a_jour_bouton($99,$100); //@line 224 "../../../src/sdl/jouer.c"
 var $101=$jouer; //@line 225 "../../../src/sdl/jouer.c"
 var $102=(($101+36)|0); //@line 225 "../../../src/sdl/jouer.c"
 var $103=HEAP32[(($102)>>2)]; //@line 225 "../../../src/sdl/jouer.c"
 var $104=$2; //@line 225 "../../../src/sdl/jouer.c"
 _mise_a_jour_bouton($103,$104); //@line 225 "../../../src/sdl/jouer.c"
 var $105=$jouer; //@line 226 "../../../src/sdl/jouer.c"
 var $106=(($105+44)|0); //@line 226 "../../../src/sdl/jouer.c"
 var $107=HEAP32[(($106)>>2)]; //@line 226 "../../../src/sdl/jouer.c"
 var $108=$2; //@line 226 "../../../src/sdl/jouer.c"
 _mise_a_jour_bouton($107,$108); //@line 226 "../../../src/sdl/jouer.c"
 var $109=$jouer; //@line 227 "../../../src/sdl/jouer.c"
 var $110=(($109+40)|0); //@line 227 "../../../src/sdl/jouer.c"
 var $111=HEAP32[(($110)>>2)]; //@line 227 "../../../src/sdl/jouer.c"
 var $112=$2; //@line 227 "../../../src/sdl/jouer.c"
 _mise_a_jour_textinput($111,$112); //@line 227 "../../../src/sdl/jouer.c"
 STACKTOP=sp;return; //@line 228 "../../../src/sdl/jouer.c"
}


function _event_jouer($state,$event){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+40)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $event; $event=STACKTOP;STACKTOP = (STACKTOP + 48)|0;(assert((STACKTOP|0) < (STACK_MAX|0))|0);(_memcpy($event, tempParam, 48)|0);
 var $1;
 var $jouer;
 var $2=sp;
 var $b;
 var $pos=(sp)+(8);
 var $coup=(sp)+(16);
 var $coup1=(sp)+(24);
 var $coup2=(sp)+(32);
 $1=$state;
 var $3=$1; //@line 395 "../../../src/sdl/jouer.c"
 var $4=(($3+28)|0); //@line 395 "../../../src/sdl/jouer.c"
 var $5=HEAP32[(($4)>>2)]; //@line 395 "../../../src/sdl/jouer.c"
 var $6=$5; //@line 395 "../../../src/sdl/jouer.c"
 $jouer=$6; //@line 395 "../../../src/sdl/jouer.c"
 var $7=$jouer; //@line 396 "../../../src/sdl/jouer.c"
 var $8=(($7+40)|0); //@line 396 "../../../src/sdl/jouer.c"
 var $9=HEAP32[(($8)>>2)]; //@line 396 "../../../src/sdl/jouer.c"
 _utiliser_event_textinput($9,$event); //@line 396 "../../../src/sdl/jouer.c"
 var $10=$jouer; //@line 397 "../../../src/sdl/jouer.c"
 var $11=(($10+40)|0); //@line 397 "../../../src/sdl/jouer.c"
 var $12=HEAP32[(($11)>>2)]; //@line 397 "../../../src/sdl/jouer.c"
 var $13=(($12+37)|0); //@line 397 "../../../src/sdl/jouer.c"
 var $14=HEAP8[($13)]; //@line 397 "../../../src/sdl/jouer.c"
 var $15=(($14)&1); //@line 397 "../../../src/sdl/jouer.c"
  //@line 397 "../../../src/sdl/jouer.c"
 if ($15) {
  var $17=$jouer; //@line 398 "../../../src/sdl/jouer.c"
  _afficher_sauvegarder($17); //@line 398 "../../../src/sdl/jouer.c"
   //@line 399 "../../../src/sdl/jouer.c"
  STACKTOP=sp;return; //@line 440 "../../../src/sdl/jouer.c"
 }
 var $19=$event; //@line 401 "../../../src/sdl/jouer.c"
 var $20=HEAP32[(($19)>>2)]; //@line 401 "../../../src/sdl/jouer.c"
 var $21=($20|0)==1024; //@line 401 "../../../src/sdl/jouer.c"
  //@line 401 "../../../src/sdl/jouer.c"
 if ($21) {
  var $23=$jouer; //@line 402 "../../../src/sdl/jouer.c"
  var $24=(($23+48)|0); //@line 402 "../../../src/sdl/jouer.c"
  var $25=$jouer; //@line 402 "../../../src/sdl/jouer.c"
  var $26=$event; //@line 402 "../../../src/sdl/jouer.c"
  var $27=(($26+12)|0); //@line 402 "../../../src/sdl/jouer.c"
  var $28=HEAP32[(($27)>>2)]; //@line 402 "../../../src/sdl/jouer.c"
  var $29=$event; //@line 402 "../../../src/sdl/jouer.c"
  var $30=(($29+16)|0); //@line 402 "../../../src/sdl/jouer.c"
  var $31=HEAP32[(($30)>>2)]; //@line 402 "../../../src/sdl/jouer.c"
  _get_position_depuis_ecran($2,$25,$28,$31); //@line 402 "../../../src/sdl/jouer.c"
  var $32=$24; //@line 402 "../../../src/sdl/jouer.c"
  var $33=$2; //@line 402 "../../../src/sdl/jouer.c"
  assert(4 % 1 === 0);HEAP8[($32)]=HEAP8[($33)];HEAP8[((($32)+(1))|0)]=HEAP8[((($33)+(1))|0)];HEAP8[((($32)+(2))|0)]=HEAP8[((($33)+(2))|0)];HEAP8[((($32)+(3))|0)]=HEAP8[((($33)+(3))|0)]; //@line 402 "../../../src/sdl/jouer.c"
   //@line 403 "../../../src/sdl/jouer.c"
 } else {
  var $35=$event; //@line 403 "../../../src/sdl/jouer.c"
  var $36=HEAP32[(($35)>>2)]; //@line 403 "../../../src/sdl/jouer.c"
  var $37=($36|0)==1026; //@line 403 "../../../src/sdl/jouer.c"
   //@line 403 "../../../src/sdl/jouer.c"
  if ($37) {
   var $39=$event; //@line 404 "../../../src/sdl/jouer.c"
   var $40=(($39+8)|0); //@line 404 "../../../src/sdl/jouer.c"
   var $41=HEAP8[($40)]; //@line 404 "../../../src/sdl/jouer.c"
   var $42=($41&255); //@line 404 "../../../src/sdl/jouer.c"
   $b=$42; //@line 404 "../../../src/sdl/jouer.c"
   var $43=$b; //@line 405 "../../../src/sdl/jouer.c"
   var $44=($43|0)==1; //@line 405 "../../../src/sdl/jouer.c"
    //@line 405 "../../../src/sdl/jouer.c"
   if ($44) {
    var $46=$jouer; //@line 406 "../../../src/sdl/jouer.c"
    var $47=$event; //@line 406 "../../../src/sdl/jouer.c"
    var $48=(($47+12)|0); //@line 406 "../../../src/sdl/jouer.c"
    var $49=HEAP32[(($48)>>2)]; //@line 406 "../../../src/sdl/jouer.c"
    var $50=$event; //@line 406 "../../../src/sdl/jouer.c"
    var $51=(($50+16)|0); //@line 406 "../../../src/sdl/jouer.c"
    var $52=HEAP32[(($51)>>2)]; //@line 406 "../../../src/sdl/jouer.c"
    _get_position_depuis_ecran($pos,$46,$49,$52); //@line 406 "../../../src/sdl/jouer.c"
    var $53=_position_est_valide($pos); //@line 407 "../../../src/sdl/jouer.c"
     //@line 407 "../../../src/sdl/jouer.c"
    if ($53) {
     var $55=(($coup)|0); //@line 408 "../../../src/sdl/jouer.c"
     var $56=$55; //@line 408 "../../../src/sdl/jouer.c"
     var $57=$pos; //@line 408 "../../../src/sdl/jouer.c"
     assert(4 % 1 === 0);HEAP8[($56)]=HEAP8[($57)];HEAP8[((($56)+(1))|0)]=HEAP8[((($57)+(1))|0)];HEAP8[((($56)+(2))|0)]=HEAP8[((($57)+(2))|0)];HEAP8[((($56)+(3))|0)]=HEAP8[((($57)+(3))|0)]; //@line 408 "../../../src/sdl/jouer.c"
     var $58=$jouer; //@line 409 "../../../src/sdl/jouer.c"
     var $59=(($58+4)|0); //@line 409 "../../../src/sdl/jouer.c"
     var $60=HEAP32[(($59)>>2)]; //@line 409 "../../../src/sdl/jouer.c"
     var $61=_partie_jouer_coup($60,$coup); //@line 409 "../../../src/sdl/jouer.c"
     var $62=$jouer; //@line 410 "../../../src/sdl/jouer.c"
     _afficher_sauvegarder($62); //@line 410 "../../../src/sdl/jouer.c"
      //@line 411 "../../../src/sdl/jouer.c"
    }
     //@line 412 "../../../src/sdl/jouer.c"
   } else {
    var $65=$b; //@line 412 "../../../src/sdl/jouer.c"
    var $66=($65|0)==2; //@line 412 "../../../src/sdl/jouer.c"
     //@line 412 "../../../src/sdl/jouer.c"
    if ($66) {
     var $68=(($coup1)|0); //@line 414 "../../../src/sdl/jouer.c"
     var $69=$68; //@line 414 "../../../src/sdl/jouer.c"
     assert(4 % 1 === 0);HEAP8[($69)]=HEAP8[(1488)];HEAP8[((($69)+(1))|0)]=HEAP8[(1489)];HEAP8[((($69)+(2))|0)]=HEAP8[(1490)];HEAP8[((($69)+(3))|0)]=HEAP8[(1491)]; //@line 414 "../../../src/sdl/jouer.c"
     var $70=$jouer; //@line 415 "../../../src/sdl/jouer.c"
     var $71=(($70+4)|0); //@line 415 "../../../src/sdl/jouer.c"
     var $72=HEAP32[(($71)>>2)]; //@line 415 "../../../src/sdl/jouer.c"
     var $73=_partie_jouer_coup($72,$coup1); //@line 415 "../../../src/sdl/jouer.c"
     var $74=$jouer; //@line 416 "../../../src/sdl/jouer.c"
     _afficher_sauvegarder($74); //@line 416 "../../../src/sdl/jouer.c"
      //@line 417 "../../../src/sdl/jouer.c"
    } else {
     var $76=$b; //@line 417 "../../../src/sdl/jouer.c"
     var $77=($76|0)==4; //@line 417 "../../../src/sdl/jouer.c"
      //@line 417 "../../../src/sdl/jouer.c"
     if ($77) {
      var $79=$jouer; //@line 418 "../../../src/sdl/jouer.c"
      var $80=(($79+4)|0); //@line 418 "../../../src/sdl/jouer.c"
      var $81=HEAP32[(($80)>>2)]; //@line 418 "../../../src/sdl/jouer.c"
      var $82=_partie_annuler_coup($81); //@line 418 "../../../src/sdl/jouer.c"
      var $83=$jouer; //@line 419 "../../../src/sdl/jouer.c"
      _afficher_sauvegarder($83); //@line 419 "../../../src/sdl/jouer.c"
       //@line 420 "../../../src/sdl/jouer.c"
     } else {
      var $85=$b; //@line 420 "../../../src/sdl/jouer.c"
      var $86=($85|0)==5; //@line 420 "../../../src/sdl/jouer.c"
       //@line 420 "../../../src/sdl/jouer.c"
      if ($86) {
       var $88=$jouer; //@line 421 "../../../src/sdl/jouer.c"
       var $89=(($88+4)|0); //@line 421 "../../../src/sdl/jouer.c"
       var $90=HEAP32[(($89)>>2)]; //@line 421 "../../../src/sdl/jouer.c"
       var $91=_partie_rejouer_coup($90); //@line 421 "../../../src/sdl/jouer.c"
       var $92=$jouer; //@line 422 "../../../src/sdl/jouer.c"
       _afficher_sauvegarder($92); //@line 422 "../../../src/sdl/jouer.c"
        //@line 423 "../../../src/sdl/jouer.c"
      }
     }
    }
   }
    //@line 424 "../../../src/sdl/jouer.c"
  } else {
   var $98=$event; //@line 424 "../../../src/sdl/jouer.c"
   var $99=HEAP32[(($98)>>2)]; //@line 424 "../../../src/sdl/jouer.c"
   var $100=($99|0)==768; //@line 424 "../../../src/sdl/jouer.c"
    //@line 424 "../../../src/sdl/jouer.c"
   if ($100) {
    var $102=$event; //@line 425 "../../../src/sdl/jouer.c"
    var $103=(($102+12)|0); //@line 425 "../../../src/sdl/jouer.c"
    var $104=(($103+4)|0); //@line 425 "../../../src/sdl/jouer.c"
    var $105=HEAP32[(($104)>>2)]; //@line 425 "../../../src/sdl/jouer.c"
    var $106=($105|0)==112; //@line 425 "../../../src/sdl/jouer.c"
     //@line 425 "../../../src/sdl/jouer.c"
    if ($106) {
     var $108=(($coup2)|0); //@line 426 "../../../src/sdl/jouer.c"
     var $109=$108; //@line 426 "../../../src/sdl/jouer.c"
     assert(4 % 1 === 0);HEAP8[($109)]=HEAP8[(1488)];HEAP8[((($109)+(1))|0)]=HEAP8[(1489)];HEAP8[((($109)+(2))|0)]=HEAP8[(1490)];HEAP8[((($109)+(3))|0)]=HEAP8[(1491)]; //@line 426 "../../../src/sdl/jouer.c"
     var $110=$jouer; //@line 427 "../../../src/sdl/jouer.c"
     var $111=(($110+4)|0); //@line 427 "../../../src/sdl/jouer.c"
     var $112=HEAP32[(($111)>>2)]; //@line 427 "../../../src/sdl/jouer.c"
     var $113=_partie_jouer_coup($112,$coup2); //@line 427 "../../../src/sdl/jouer.c"
     var $114=$jouer; //@line 428 "../../../src/sdl/jouer.c"
     _afficher_sauvegarder($114); //@line 428 "../../../src/sdl/jouer.c"
      //@line 429 "../../../src/sdl/jouer.c"
    } else {
     var $116=$event; //@line 429 "../../../src/sdl/jouer.c"
     var $117=(($116+12)|0); //@line 429 "../../../src/sdl/jouer.c"
     var $118=(($117+4)|0); //@line 429 "../../../src/sdl/jouer.c"
     var $119=HEAP32[(($118)>>2)]; //@line 429 "../../../src/sdl/jouer.c"
     var $120=($119|0)==97; //@line 429 "../../../src/sdl/jouer.c"
      //@line 429 "../../../src/sdl/jouer.c"
     if ($120) {
      var $122=$jouer; //@line 430 "../../../src/sdl/jouer.c"
      var $123=(($122+4)|0); //@line 430 "../../../src/sdl/jouer.c"
      var $124=HEAP32[(($123)>>2)]; //@line 430 "../../../src/sdl/jouer.c"
      var $125=_partie_annuler_coup($124); //@line 430 "../../../src/sdl/jouer.c"
      var $126=$jouer; //@line 431 "../../../src/sdl/jouer.c"
      _afficher_sauvegarder($126); //@line 431 "../../../src/sdl/jouer.c"
       //@line 432 "../../../src/sdl/jouer.c"
     } else {
      var $128=$event; //@line 432 "../../../src/sdl/jouer.c"
      var $129=(($128+12)|0); //@line 432 "../../../src/sdl/jouer.c"
      var $130=(($129+4)|0); //@line 432 "../../../src/sdl/jouer.c"
      var $131=HEAP32[(($130)>>2)]; //@line 432 "../../../src/sdl/jouer.c"
      var $132=($131|0)==114; //@line 432 "../../../src/sdl/jouer.c"
       //@line 432 "../../../src/sdl/jouer.c"
      if ($132) {
       var $134=$jouer; //@line 433 "../../../src/sdl/jouer.c"
       var $135=(($134+4)|0); //@line 433 "../../../src/sdl/jouer.c"
       var $136=HEAP32[(($135)>>2)]; //@line 433 "../../../src/sdl/jouer.c"
       var $137=_partie_rejouer_coup($136); //@line 433 "../../../src/sdl/jouer.c"
       var $138=$jouer; //@line 434 "../../../src/sdl/jouer.c"
       _afficher_sauvegarder($138); //@line 434 "../../../src/sdl/jouer.c"
        //@line 435 "../../../src/sdl/jouer.c"
      }
     }
    }
     //@line 436 "../../../src/sdl/jouer.c"
   }
  }
 }
 var $145=$jouer; //@line 437 "../../../src/sdl/jouer.c"
 var $146=(($145+32)|0); //@line 437 "../../../src/sdl/jouer.c"
 var $147=HEAP32[(($146)>>2)]; //@line 437 "../../../src/sdl/jouer.c"
 _utiliser_event_bouton($147,$event); //@line 437 "../../../src/sdl/jouer.c"
 var $148=$jouer; //@line 438 "../../../src/sdl/jouer.c"
 var $149=(($148+44)|0); //@line 438 "../../../src/sdl/jouer.c"
 var $150=HEAP32[(($149)>>2)]; //@line 438 "../../../src/sdl/jouer.c"
 _utiliser_event_bouton($150,$event); //@line 438 "../../../src/sdl/jouer.c"
 var $151=$jouer; //@line 439 "../../../src/sdl/jouer.c"
 var $152=(($151+36)|0); //@line 439 "../../../src/sdl/jouer.c"
 var $153=HEAP32[(($152)>>2)]; //@line 439 "../../../src/sdl/jouer.c"
 _utiliser_event_bouton($153,$event); //@line 439 "../../../src/sdl/jouer.c"
  //@line 440 "../../../src/sdl/jouer.c"
 STACKTOP=sp;return; //@line 440 "../../../src/sdl/jouer.c"
}


function _jouer_bouton_retour($bouton,$data){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $state;
 var $jouer;
 $1=$bouton;
 $2=$data;
 var $3=$1; //@line 444 "../../../src/sdl/jouer.c"
 var $4=$2; //@line 445 "../../../src/sdl/jouer.c"
 var $5=$4; //@line 445 "../../../src/sdl/jouer.c"
 $state=$5; //@line 445 "../../../src/sdl/jouer.c"
 var $6=$state; //@line 446 "../../../src/sdl/jouer.c"
 var $7=(($6+28)|0); //@line 446 "../../../src/sdl/jouer.c"
 var $8=HEAP32[(($7)>>2)]; //@line 446 "../../../src/sdl/jouer.c"
 var $9=$8; //@line 446 "../../../src/sdl/jouer.c"
 $jouer=$9; //@line 446 "../../../src/sdl/jouer.c"
 var $10=$jouer; //@line 447 "../../../src/sdl/jouer.c"
 var $11=(($10+4)|0); //@line 447 "../../../src/sdl/jouer.c"
 var $12=HEAP32[(($11)>>2)]; //@line 447 "../../../src/sdl/jouer.c"
 _detruire_partie($12); //@line 447 "../../../src/sdl/jouer.c"
 var $13=$jouer; //@line 448 "../../../src/sdl/jouer.c"
 var $14=(($13)|0); //@line 448 "../../../src/sdl/jouer.c"
 var $15=HEAP32[(($14)>>2)]; //@line 448 "../../../src/sdl/jouer.c"
 _set_state($15); //@line 448 "../../../src/sdl/jouer.c"
 var $16=$state; //@line 449 "../../../src/sdl/jouer.c"
 _detruire_jouer($16); //@line 449 "../../../src/sdl/jouer.c"
 STACKTOP=sp;return; //@line 450 "../../../src/sdl/jouer.c"
}


function _jouer_bouton_passer($bouton,$data){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $state;
 var $jouer;
 var $coup=sp;
 $1=$bouton;
 $2=$data;
 var $3=$1; //@line 454 "../../../src/sdl/jouer.c"
 var $4=$2; //@line 455 "../../../src/sdl/jouer.c"
 var $5=$4; //@line 455 "../../../src/sdl/jouer.c"
 $state=$5; //@line 455 "../../../src/sdl/jouer.c"
 var $6=$state; //@line 456 "../../../src/sdl/jouer.c"
 var $7=(($6+28)|0); //@line 456 "../../../src/sdl/jouer.c"
 var $8=HEAP32[(($7)>>2)]; //@line 456 "../../../src/sdl/jouer.c"
 var $9=$8; //@line 456 "../../../src/sdl/jouer.c"
 $jouer=$9; //@line 456 "../../../src/sdl/jouer.c"
 var $10=(($coup)|0); //@line 458 "../../../src/sdl/jouer.c"
 var $11=$10; //@line 458 "../../../src/sdl/jouer.c"
 assert(4 % 1 === 0);HEAP8[($11)]=HEAP8[(1488)];HEAP8[((($11)+(1))|0)]=HEAP8[(1489)];HEAP8[((($11)+(2))|0)]=HEAP8[(1490)];HEAP8[((($11)+(3))|0)]=HEAP8[(1491)]; //@line 458 "../../../src/sdl/jouer.c"
 var $12=$jouer; //@line 459 "../../../src/sdl/jouer.c"
 var $13=(($12+4)|0); //@line 459 "../../../src/sdl/jouer.c"
 var $14=HEAP32[(($13)>>2)]; //@line 459 "../../../src/sdl/jouer.c"
 var $15=_partie_jouer_coup($14,$coup); //@line 459 "../../../src/sdl/jouer.c"
 STACKTOP=sp;return; //@line 460 "../../../src/sdl/jouer.c"
}


function _jouer_bouton_sauvegarder($bouton,$data){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $state;
 var $jouer;
 $1=$bouton;
 $2=$data;
 var $3=$1; //@line 464 "../../../src/sdl/jouer.c"
 var $4=$2; //@line 465 "../../../src/sdl/jouer.c"
 var $5=$4; //@line 465 "../../../src/sdl/jouer.c"
 $state=$5; //@line 465 "../../../src/sdl/jouer.c"
 var $6=$state; //@line 466 "../../../src/sdl/jouer.c"
 var $7=(($6+28)|0); //@line 466 "../../../src/sdl/jouer.c"
 var $8=HEAP32[(($7)>>2)]; //@line 466 "../../../src/sdl/jouer.c"
 var $9=$8; //@line 466 "../../../src/sdl/jouer.c"
 $jouer=$9; //@line 466 "../../../src/sdl/jouer.c"
 var $10=$jouer; //@line 467 "../../../src/sdl/jouer.c"
 var $11=(($10+40)|0); //@line 467 "../../../src/sdl/jouer.c"
 var $12=HEAP32[(($11)>>2)]; //@line 467 "../../../src/sdl/jouer.c"
 var $13=(($12+12)|0); //@line 467 "../../../src/sdl/jouer.c"
 var $14=HEAP32[(($13)>>2)]; //@line 467 "../../../src/sdl/jouer.c"
 var $15=$jouer; //@line 467 "../../../src/sdl/jouer.c"
 var $16=(($15+4)|0); //@line 467 "../../../src/sdl/jouer.c"
 var $17=HEAP32[(($16)>>2)]; //@line 467 "../../../src/sdl/jouer.c"
 var $18=_sauvegarder_partie_fichier($14,$17); //@line 467 "../../../src/sdl/jouer.c"
  //@line 467 "../../../src/sdl/jouer.c"
 if ($18) {
  var $20=$jouer; //@line 468 "../../../src/sdl/jouer.c"
  var $21=(($20+44)|0); //@line 468 "../../../src/sdl/jouer.c"
  var $22=HEAP32[(($21)>>2)]; //@line 468 "../../../src/sdl/jouer.c"
  var $23=(($22+36)|0); //@line 468 "../../../src/sdl/jouer.c"
  HEAP8[($23)]=0; //@line 468 "../../../src/sdl/jouer.c"
   //@line 469 "../../../src/sdl/jouer.c"
  STACKTOP=sp;return; //@line 472 "../../../src/sdl/jouer.c"
 } else {
  _perror(200); //@line 470 "../../../src/sdl/jouer.c"
  STACKTOP=sp;return; //@line 472 "../../../src/sdl/jouer.c"
 }
}


function _detruire_jouer($state){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $jouer;
 $1=$state;
 var $2=$1; //@line 170 "../../../src/sdl/jouer.c"
 var $3=(($2+28)|0); //@line 170 "../../../src/sdl/jouer.c"
 var $4=HEAP32[(($3)>>2)]; //@line 170 "../../../src/sdl/jouer.c"
 var $5=$4; //@line 170 "../../../src/sdl/jouer.c"
 $jouer=$5; //@line 170 "../../../src/sdl/jouer.c"
 var $6=$jouer; //@line 171 "../../../src/sdl/jouer.c"
 var $7=(($6+12)|0); //@line 171 "../../../src/sdl/jouer.c"
 var $8=(($7)|0); //@line 171 "../../../src/sdl/jouer.c"
 var $9=HEAP32[(($8)>>2)]; //@line 171 "../../../src/sdl/jouer.c"
 _detruire_label($9); //@line 171 "../../../src/sdl/jouer.c"
 var $10=$jouer; //@line 172 "../../../src/sdl/jouer.c"
 var $11=(($10+12)|0); //@line 172 "../../../src/sdl/jouer.c"
 var $12=(($11+4)|0); //@line 172 "../../../src/sdl/jouer.c"
 var $13=HEAP32[(($12)>>2)]; //@line 172 "../../../src/sdl/jouer.c"
 _detruire_label($13); //@line 172 "../../../src/sdl/jouer.c"
 var $14=$jouer; //@line 173 "../../../src/sdl/jouer.c"
 var $15=(($14+20)|0); //@line 173 "../../../src/sdl/jouer.c"
 var $16=HEAP32[(($15)>>2)]; //@line 173 "../../../src/sdl/jouer.c"
 _detruire_label($16); //@line 173 "../../../src/sdl/jouer.c"
 var $17=$jouer; //@line 174 "../../../src/sdl/jouer.c"
 var $18=(($17+24)|0); //@line 174 "../../../src/sdl/jouer.c"
 var $19=HEAP32[(($18)>>2)]; //@line 174 "../../../src/sdl/jouer.c"
 _detruire_label($19); //@line 174 "../../../src/sdl/jouer.c"
 var $20=$jouer; //@line 175 "../../../src/sdl/jouer.c"
 var $21=(($20+28)|0); //@line 175 "../../../src/sdl/jouer.c"
 var $22=HEAP32[(($21)>>2)]; //@line 175 "../../../src/sdl/jouer.c"
 var $23=($22|0)!=0; //@line 175 "../../../src/sdl/jouer.c"
  //@line 175 "../../../src/sdl/jouer.c"
 if ($23) {
  var $25=$jouer; //@line 176 "../../../src/sdl/jouer.c"
  var $26=(($25+28)|0); //@line 176 "../../../src/sdl/jouer.c"
  var $27=HEAP32[(($26)>>2)]; //@line 176 "../../../src/sdl/jouer.c"
  _detruire_label($27); //@line 176 "../../../src/sdl/jouer.c"
   //@line 176 "../../../src/sdl/jouer.c"
 }
 var $29=$jouer; //@line 177 "../../../src/sdl/jouer.c"
 var $30=(($29+36)|0); //@line 177 "../../../src/sdl/jouer.c"
 var $31=HEAP32[(($30)>>2)]; //@line 177 "../../../src/sdl/jouer.c"
 _detruire_bouton($31); //@line 177 "../../../src/sdl/jouer.c"
 var $32=$jouer; //@line 178 "../../../src/sdl/jouer.c"
 var $33=(($32+40)|0); //@line 178 "../../../src/sdl/jouer.c"
 var $34=HEAP32[(($33)>>2)]; //@line 178 "../../../src/sdl/jouer.c"
 _detruire_textinput($34); //@line 178 "../../../src/sdl/jouer.c"
 var $35=$jouer; //@line 179 "../../../src/sdl/jouer.c"
 var $36=(($35+44)|0); //@line 179 "../../../src/sdl/jouer.c"
 var $37=HEAP32[(($36)>>2)]; //@line 179 "../../../src/sdl/jouer.c"
 _detruire_bouton($37); //@line 179 "../../../src/sdl/jouer.c"
 var $38=$jouer; //@line 181 "../../../src/sdl/jouer.c"
 var $39=$38; //@line 181 "../../../src/sdl/jouer.c"
 _gosh_free($39); //@line 181 "../../../src/sdl/jouer.c"
 var $40=$1; //@line 182 "../../../src/sdl/jouer.c"
 var $41=$40; //@line 182 "../../../src/sdl/jouer.c"
 _gosh_free($41); //@line 182 "../../../src/sdl/jouer.c"
 STACKTOP=sp;return; //@line 183 "../../../src/sdl/jouer.c"
}


function _get_position_depuis_ecran($agg_result,$jouer,$x,$y){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $pos=sp;
 var $x1;
 var $y1;
 var $w;
 var $pixel_par_case;
 var $bordure;
 var $4=(sp)+(8);
 $1=$jouer;
 $2=$x;
 $3=$y;
 $x1=160; //@line 233 "../../../src/sdl/jouer.c"
 $y1=136; //@line 234 "../../../src/sdl/jouer.c"
 var $5=$2; //@line 235 "../../../src/sdl/jouer.c"
 var $6=$x1; //@line 235 "../../../src/sdl/jouer.c"
 var $7=($5|0)<($6|0); //@line 235 "../../../src/sdl/jouer.c"
  //@line 235 "../../../src/sdl/jouer.c"
 do {
  if (!($7)) {
   var $9=$3; //@line 235 "../../../src/sdl/jouer.c"
   var $10=$y1; //@line 235 "../../../src/sdl/jouer.c"
   var $11=($9|0)<($10|0); //@line 235 "../../../src/sdl/jouer.c"
    //@line 235 "../../../src/sdl/jouer.c"
   if ($11) {
    break;
   }
   var $15=$x1; //@line 238 "../../../src/sdl/jouer.c"
   var $16=($15|0); //@line 238 "../../../src/sdl/jouer.c"
   var $17=(640)-($16); //@line 238 "../../../src/sdl/jouer.c"
   var $18=$y1; //@line 238 "../../../src/sdl/jouer.c"
   var $19=($18|0); //@line 238 "../../../src/sdl/jouer.c"
   var $20=(544)-($19); //@line 238 "../../../src/sdl/jouer.c"
   var $21=$17>$20; //@line 238 "../../../src/sdl/jouer.c"
    //@line 238 "../../../src/sdl/jouer.c"
   if ($21) {
    var $23=$x1; //@line 238 "../../../src/sdl/jouer.c"
    var $24=($23|0); //@line 238 "../../../src/sdl/jouer.c"
    var $25=(640)-($24); //@line 238 "../../../src/sdl/jouer.c"
     //@line 238 "../../../src/sdl/jouer.c"
    var $31=$25;
   } else {
    var $27=$y1; //@line 238 "../../../src/sdl/jouer.c"
    var $28=($27|0); //@line 238 "../../../src/sdl/jouer.c"
    var $29=(544)-($28); //@line 238 "../../../src/sdl/jouer.c"
     //@line 238 "../../../src/sdl/jouer.c"
    var $31=$29;
   }
   var $31; //@line 238 "../../../src/sdl/jouer.c"
   var $32=(($31)&-1); //@line 238 "../../../src/sdl/jouer.c"
   $w=$32; //@line 238 "../../../src/sdl/jouer.c"
   var $33=$w; //@line 239 "../../../src/sdl/jouer.c"
   var $34=$1; //@line 239 "../../../src/sdl/jouer.c"
   var $35=(($34+8)|0); //@line 239 "../../../src/sdl/jouer.c"
   var $36=HEAP32[(($35)>>2)]; //@line 239 "../../../src/sdl/jouer.c"
   var $37=(((($33|0))%(($36|0)))&-1); //@line 239 "../../../src/sdl/jouer.c"
   var $38=$w; //@line 239 "../../../src/sdl/jouer.c"
   var $39=((($38)-($37))|0); //@line 239 "../../../src/sdl/jouer.c"
   $w=$39; //@line 239 "../../../src/sdl/jouer.c"
   var $40=$w; //@line 240 "../../../src/sdl/jouer.c"
   var $41=$1; //@line 240 "../../../src/sdl/jouer.c"
   var $42=(($41+8)|0); //@line 240 "../../../src/sdl/jouer.c"
   var $43=HEAP32[(($42)>>2)]; //@line 240 "../../../src/sdl/jouer.c"
   var $44=(((($40|0))/(($43|0)))&-1); //@line 240 "../../../src/sdl/jouer.c"
   $pixel_par_case=$44; //@line 240 "../../../src/sdl/jouer.c"
   var $45=$w; //@line 241 "../../../src/sdl/jouer.c"
   var $46=$pixel_par_case; //@line 241 "../../../src/sdl/jouer.c"
   var $47=$1; //@line 241 "../../../src/sdl/jouer.c"
   var $48=(($47+8)|0); //@line 241 "../../../src/sdl/jouer.c"
   var $49=HEAP32[(($48)>>2)]; //@line 241 "../../../src/sdl/jouer.c"
   var $50=((($49)-(1))|0); //@line 241 "../../../src/sdl/jouer.c"
   var $51=(Math_imul($46,$50)|0); //@line 241 "../../../src/sdl/jouer.c"
   var $52=((($45)-($51))|0); //@line 241 "../../../src/sdl/jouer.c"
   var $53=(((($52|0))/(2))&-1); //@line 241 "../../../src/sdl/jouer.c"
   $bordure=$53; //@line 241 "../../../src/sdl/jouer.c"
   var $54=$2; //@line 242 "../../../src/sdl/jouer.c"
   var $55=$x1; //@line 242 "../../../src/sdl/jouer.c"
   var $56=((($54)-($55))|0); //@line 242 "../../../src/sdl/jouer.c"
   var $57=$bordure; //@line 242 "../../../src/sdl/jouer.c"
   var $58=((($56)-($57))|0); //@line 242 "../../../src/sdl/jouer.c"
   var $59=$pixel_par_case; //@line 242 "../../../src/sdl/jouer.c"
   var $60=(((($59|0))/(2))&-1); //@line 242 "../../../src/sdl/jouer.c"
   var $61=((($58)+($60))|0); //@line 242 "../../../src/sdl/jouer.c"
   var $62=$pixel_par_case; //@line 242 "../../../src/sdl/jouer.c"
   var $63=(((($61|0))/(($62|0)))&-1); //@line 242 "../../../src/sdl/jouer.c"
   var $64=$3; //@line 242 "../../../src/sdl/jouer.c"
   var $65=$y1; //@line 242 "../../../src/sdl/jouer.c"
   var $66=((($64)-($65))|0); //@line 242 "../../../src/sdl/jouer.c"
   var $67=$bordure; //@line 242 "../../../src/sdl/jouer.c"
   var $68=((($66)-($67))|0); //@line 242 "../../../src/sdl/jouer.c"
   var $69=$pixel_par_case; //@line 242 "../../../src/sdl/jouer.c"
   var $70=(((($69|0))/(2))&-1); //@line 242 "../../../src/sdl/jouer.c"
   var $71=((($68)+($70))|0); //@line 242 "../../../src/sdl/jouer.c"
   var $72=$pixel_par_case; //@line 242 "../../../src/sdl/jouer.c"
   var $73=(((($71|0))/(($72|0)))&-1); //@line 242 "../../../src/sdl/jouer.c"
   var $74=$1; //@line 242 "../../../src/sdl/jouer.c"
   var $75=(($74+8)|0); //@line 242 "../../../src/sdl/jouer.c"
   var $76=HEAP32[(($75)>>2)]; //@line 242 "../../../src/sdl/jouer.c"
   _position($4,$63,$73,$76); //@line 242 "../../../src/sdl/jouer.c"
   var $77=$pos; //@line 242 "../../../src/sdl/jouer.c"
   var $78=$4; //@line 242 "../../../src/sdl/jouer.c"
   assert(4 % 1 === 0);HEAP8[($77)]=HEAP8[($78)];HEAP8[((($77)+(1))|0)]=HEAP8[((($78)+(1))|0)];HEAP8[((($77)+(2))|0)]=HEAP8[((($78)+(2))|0)];HEAP8[((($77)+(3))|0)]=HEAP8[((($78)+(3))|0)]; //@line 242 "../../../src/sdl/jouer.c"
   var $79=$agg_result; //@line 245 "../../../src/sdl/jouer.c"
   var $80=$pos; //@line 245 "../../../src/sdl/jouer.c"
   assert(4 % 1 === 0);HEAP8[($79)]=HEAP8[($80)];HEAP8[((($79)+(1))|0)]=HEAP8[((($80)+(1))|0)];HEAP8[((($79)+(2))|0)]=HEAP8[((($80)+(2))|0)];HEAP8[((($79)+(3))|0)]=HEAP8[((($80)+(3))|0)]; //@line 245 "../../../src/sdl/jouer.c"
    //@line 245 "../../../src/sdl/jouer.c"
   STACKTOP=sp;return; //@line 246 "../../../src/sdl/jouer.c"
  }
 } while(0);
 var $13=$agg_result; //@line 236 "../../../src/sdl/jouer.c"
 assert(4 % 1 === 0);HEAP8[($13)]=HEAP8[(1488)];HEAP8[((($13)+(1))|0)]=HEAP8[(1489)];HEAP8[((($13)+(2))|0)]=HEAP8[(1490)];HEAP8[((($13)+(3))|0)]=HEAP8[(1491)]; //@line 236 "../../../src/sdl/jouer.c"
  //@line 236 "../../../src/sdl/jouer.c"
 STACKTOP=sp;return; //@line 246 "../../../src/sdl/jouer.c"
}


function _get_position_vers_ecran($jouer,$x,$y,$sx,$sy){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $4;
 var $5;
 var $x1;
 var $y1;
 var $w;
 var $pixel_par_case;
 var $bordure;
 $1=$jouer;
 $2=$x;
 $3=$y;
 $4=$sx;
 $5=$sy;
 $x1=160; //@line 249 "../../../src/sdl/jouer.c"
 $y1=136; //@line 250 "../../../src/sdl/jouer.c"
 var $6=$x1; //@line 251 "../../../src/sdl/jouer.c"
 var $7=($6|0); //@line 251 "../../../src/sdl/jouer.c"
 var $8=(640)-($7); //@line 251 "../../../src/sdl/jouer.c"
 var $9=$y1; //@line 251 "../../../src/sdl/jouer.c"
 var $10=($9|0); //@line 251 "../../../src/sdl/jouer.c"
 var $11=(544)-($10); //@line 251 "../../../src/sdl/jouer.c"
 var $12=$8>$11; //@line 251 "../../../src/sdl/jouer.c"
  //@line 251 "../../../src/sdl/jouer.c"
 if ($12) {
  var $14=$x1; //@line 251 "../../../src/sdl/jouer.c"
  var $15=($14|0); //@line 251 "../../../src/sdl/jouer.c"
  var $16=(640)-($15); //@line 251 "../../../src/sdl/jouer.c"
   //@line 251 "../../../src/sdl/jouer.c"
  var $22=$16;
 } else {
  var $18=$y1; //@line 251 "../../../src/sdl/jouer.c"
  var $19=($18|0); //@line 251 "../../../src/sdl/jouer.c"
  var $20=(544)-($19); //@line 251 "../../../src/sdl/jouer.c"
   //@line 251 "../../../src/sdl/jouer.c"
  var $22=$20;
 }
 var $22; //@line 251 "../../../src/sdl/jouer.c"
 var $23=(($22)&-1); //@line 251 "../../../src/sdl/jouer.c"
 $w=$23; //@line 251 "../../../src/sdl/jouer.c"
 var $24=$w; //@line 252 "../../../src/sdl/jouer.c"
 var $25=$1; //@line 252 "../../../src/sdl/jouer.c"
 var $26=(($25+8)|0); //@line 252 "../../../src/sdl/jouer.c"
 var $27=HEAP32[(($26)>>2)]; //@line 252 "../../../src/sdl/jouer.c"
 var $28=(((($24|0))%(($27|0)))&-1); //@line 252 "../../../src/sdl/jouer.c"
 var $29=$w; //@line 252 "../../../src/sdl/jouer.c"
 var $30=((($29)-($28))|0); //@line 252 "../../../src/sdl/jouer.c"
 $w=$30; //@line 252 "../../../src/sdl/jouer.c"
 var $31=$w; //@line 253 "../../../src/sdl/jouer.c"
 var $32=$1; //@line 253 "../../../src/sdl/jouer.c"
 var $33=(($32+8)|0); //@line 253 "../../../src/sdl/jouer.c"
 var $34=HEAP32[(($33)>>2)]; //@line 253 "../../../src/sdl/jouer.c"
 var $35=(((($31|0))/(($34|0)))&-1); //@line 253 "../../../src/sdl/jouer.c"
 $pixel_par_case=$35; //@line 253 "../../../src/sdl/jouer.c"
 var $36=$w; //@line 254 "../../../src/sdl/jouer.c"
 var $37=$pixel_par_case; //@line 254 "../../../src/sdl/jouer.c"
 var $38=$1; //@line 254 "../../../src/sdl/jouer.c"
 var $39=(($38+8)|0); //@line 254 "../../../src/sdl/jouer.c"
 var $40=HEAP32[(($39)>>2)]; //@line 254 "../../../src/sdl/jouer.c"
 var $41=((($40)-(1))|0); //@line 254 "../../../src/sdl/jouer.c"
 var $42=(Math_imul($37,$41)|0); //@line 254 "../../../src/sdl/jouer.c"
 var $43=((($36)-($42))|0); //@line 254 "../../../src/sdl/jouer.c"
 var $44=(((($43|0))/(2))&-1); //@line 254 "../../../src/sdl/jouer.c"
 $bordure=$44; //@line 254 "../../../src/sdl/jouer.c"
 var $45=$x1; //@line 255 "../../../src/sdl/jouer.c"
 var $46=$bordure; //@line 255 "../../../src/sdl/jouer.c"
 var $47=((($45)+($46))|0); //@line 255 "../../../src/sdl/jouer.c"
 var $48=$2; //@line 255 "../../../src/sdl/jouer.c"
 var $49=$pixel_par_case; //@line 255 "../../../src/sdl/jouer.c"
 var $50=(Math_imul($48,$49)|0); //@line 255 "../../../src/sdl/jouer.c"
 var $51=((($47)+($50))|0); //@line 255 "../../../src/sdl/jouer.c"
 var $52=$4; //@line 255 "../../../src/sdl/jouer.c"
 HEAP32[(($52)>>2)]=$51; //@line 255 "../../../src/sdl/jouer.c"
 var $53=$y1; //@line 256 "../../../src/sdl/jouer.c"
 var $54=$bordure; //@line 256 "../../../src/sdl/jouer.c"
 var $55=((($53)+($54))|0); //@line 256 "../../../src/sdl/jouer.c"
 var $56=$3; //@line 256 "../../../src/sdl/jouer.c"
 var $57=$pixel_par_case; //@line 256 "../../../src/sdl/jouer.c"
 var $58=(Math_imul($56,$57)|0); //@line 256 "../../../src/sdl/jouer.c"
 var $59=((($55)+($58))|0); //@line 256 "../../../src/sdl/jouer.c"
 var $60=$5; //@line 256 "../../../src/sdl/jouer.c"
 HEAP32[(($60)>>2)]=$59; //@line 256 "../../../src/sdl/jouer.c"
 STACKTOP=sp;return; //@line 257 "../../../src/sdl/jouer.c"
}


function _afficher_sauvegarder($jouer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$jouer;
 var $2=$1; //@line 390 "../../../src/sdl/jouer.c"
 var $3=(($2+40)|0); //@line 390 "../../../src/sdl/jouer.c"
 var $4=HEAP32[(($3)>>2)]; //@line 390 "../../../src/sdl/jouer.c"
 var $5=(($4+12)|0); //@line 390 "../../../src/sdl/jouer.c"
 var $6=HEAP32[(($5)>>2)]; //@line 390 "../../../src/sdl/jouer.c"
 var $7=(($6)|0); //@line 390 "../../../src/sdl/jouer.c"
 var $8=HEAP8[($7)]; //@line 390 "../../../src/sdl/jouer.c"
 var $9=(($8<<24)>>24); //@line 390 "../../../src/sdl/jouer.c"
 var $10=($9|0)!=0; //@line 390 "../../../src/sdl/jouer.c"
 var $11=$1; //@line 390 "../../../src/sdl/jouer.c"
 var $12=(($11+44)|0); //@line 390 "../../../src/sdl/jouer.c"
 var $13=HEAP32[(($12)>>2)]; //@line 390 "../../../src/sdl/jouer.c"
 var $14=(($13+36)|0); //@line 390 "../../../src/sdl/jouer.c"
 var $15=($10&1); //@line 390 "../../../src/sdl/jouer.c"
 HEAP8[($14)]=$15; //@line 390 "../../../src/sdl/jouer.c"
 STACKTOP=sp;return; //@line 391 "../../../src/sdl/jouer.c"
}


function _get_marge($i,$taille){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 $2=$i;
 $3=$taille;
 var $4=$2; //@line 261 "../../../src/sdl/jouer.c"
 var $5=$3; //@line 261 "../../../src/sdl/jouer.c"
 var $6=(((($5|0))/(2))&-1); //@line 261 "../../../src/sdl/jouer.c"
 var $7=($4|0)<($6|0); //@line 261 "../../../src/sdl/jouer.c"
  //@line 261 "../../../src/sdl/jouer.c"
 if ($7) {
  var $9=$2; //@line 262 "../../../src/sdl/jouer.c"
  $1=$9; //@line 262 "../../../src/sdl/jouer.c"
   //@line 262 "../../../src/sdl/jouer.c"
  var $16=$1; //@line 265 "../../../src/sdl/jouer.c"
  STACKTOP=sp;return $16; //@line 265 "../../../src/sdl/jouer.c"
 } else {
  var $11=$3; //@line 264 "../../../src/sdl/jouer.c"
  var $12=$2; //@line 264 "../../../src/sdl/jouer.c"
  var $13=((($11)-($12))|0); //@line 264 "../../../src/sdl/jouer.c"
  var $14=((($13)-(1))|0); //@line 264 "../../../src/sdl/jouer.c"
  $1=$14; //@line 264 "../../../src/sdl/jouer.c"
   //@line 264 "../../../src/sdl/jouer.c"
  var $16=$1; //@line 265 "../../../src/sdl/jouer.c"
  STACKTOP=sp;return $16; //@line 265 "../../../src/sdl/jouer.c"
 }
}


function _creer_bouton($text,$x,$y,$w,$h){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $4;
 var $5;
 var $bouton;
 var $6=sp;
 $1=$text;
 $2=$x;
 $3=$y;
 $4=$w;
 $5=$h;
 var $7=_gosh_alloc_size(52); //@line 31 "../../../src/sdl/bouton.c"
 var $8=$7; //@line 31 "../../../src/sdl/bouton.c"
 $bouton=$8; //@line 31 "../../../src/sdl/bouton.c"
 var $9=$1; //@line 32 "../../../src/sdl/bouton.c"
 var $10=_text_surface($9,1); //@line 32 "../../../src/sdl/bouton.c"
 var $11=$bouton; //@line 32 "../../../src/sdl/bouton.c"
 var $12=(($11)|0); //@line 32 "../../../src/sdl/bouton.c"
 HEAP32[(($12)>>2)]=$10; //@line 32 "../../../src/sdl/bouton.c"
 var $13=$2; //@line 33 "../../../src/sdl/bouton.c"
 var $14=($13|0); //@line 33 "../../../src/sdl/bouton.c"
 var $15=$bouton; //@line 33 "../../../src/sdl/bouton.c"
 var $16=(($15+4)|0); //@line 33 "../../../src/sdl/bouton.c"
 HEAPF32[(($16)>>2)]=$14; //@line 33 "../../../src/sdl/bouton.c"
 var $17=$3; //@line 34 "../../../src/sdl/bouton.c"
 var $18=($17|0); //@line 34 "../../../src/sdl/bouton.c"
 var $19=$bouton; //@line 34 "../../../src/sdl/bouton.c"
 var $20=(($19+8)|0); //@line 34 "../../../src/sdl/bouton.c"
 HEAPF32[(($20)>>2)]=$18; //@line 34 "../../../src/sdl/bouton.c"
 var $21=$2; //@line 35 "../../../src/sdl/bouton.c"
 var $22=($21|0); //@line 35 "../../../src/sdl/bouton.c"
 var $23=$bouton; //@line 35 "../../../src/sdl/bouton.c"
 var $24=(($23+12)|0); //@line 35 "../../../src/sdl/bouton.c"
 HEAPF32[(($24)>>2)]=$22; //@line 35 "../../../src/sdl/bouton.c"
 var $25=$3; //@line 36 "../../../src/sdl/bouton.c"
 var $26=($25|0); //@line 36 "../../../src/sdl/bouton.c"
 var $27=$bouton; //@line 36 "../../../src/sdl/bouton.c"
 var $28=(($27+16)|0); //@line 36 "../../../src/sdl/bouton.c"
 HEAPF32[(($28)>>2)]=$26; //@line 36 "../../../src/sdl/bouton.c"
 var $29=$4; //@line 37 "../../../src/sdl/bouton.c"
 var $30=$bouton; //@line 37 "../../../src/sdl/bouton.c"
 var $31=(($30+20)|0); //@line 37 "../../../src/sdl/bouton.c"
 HEAP32[(($31)>>2)]=$29; //@line 37 "../../../src/sdl/bouton.c"
 var $32=$5; //@line 38 "../../../src/sdl/bouton.c"
 var $33=$bouton; //@line 38 "../../../src/sdl/bouton.c"
 var $34=(($33+24)|0); //@line 38 "../../../src/sdl/bouton.c"
 HEAP32[(($34)>>2)]=$32; //@line 38 "../../../src/sdl/bouton.c"
 var $35=$bouton; //@line 39 "../../../src/sdl/bouton.c"
 var $36=(($35+36)|0); //@line 39 "../../../src/sdl/bouton.c"
 HEAP8[($36)]=1; //@line 39 "../../../src/sdl/bouton.c"
 var $37=$bouton; //@line 40 "../../../src/sdl/bouton.c"
 var $38=(($37+28)|0); //@line 40 "../../../src/sdl/bouton.c"
 _get_color($6); //@line 40 "../../../src/sdl/bouton.c"
 var $39=$38; //@line 40 "../../../src/sdl/bouton.c"
 var $40=$6; //@line 40 "../../../src/sdl/bouton.c"
 assert(4 % 1 === 0);HEAP8[($39)]=HEAP8[($40)];HEAP8[((($39)+(1))|0)]=HEAP8[((($40)+(1))|0)];HEAP8[((($39)+(2))|0)]=HEAP8[((($40)+(2))|0)];HEAP8[((($39)+(3))|0)]=HEAP8[((($40)+(3))|0)]; //@line 40 "../../../src/sdl/bouton.c"
 var $41=$bouton; //@line 41 "../../../src/sdl/bouton.c"
 var $42=(($41+48)|0); //@line 41 "../../../src/sdl/bouton.c"
 HEAP8[($42)]=0; //@line 41 "../../../src/sdl/bouton.c"
 var $43=$bouton; //@line 42 "../../../src/sdl/bouton.c"
 var $44=(($43+49)|0); //@line 42 "../../../src/sdl/bouton.c"
 HEAP8[($44)]=0; //@line 42 "../../../src/sdl/bouton.c"
 var $45=$bouton; //@line 43 "../../../src/sdl/bouton.c"
 var $46=(($45+32)|0); //@line 43 "../../../src/sdl/bouton.c"
 HEAPF32[(($46)>>2)]=0; //@line 43 "../../../src/sdl/bouton.c"
 var $47=$bouton; //@line 44 "../../../src/sdl/bouton.c"
 STACKTOP=sp;return $47; //@line 44 "../../../src/sdl/bouton.c"
}


function _afficher_bouton($on,$bouton){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 $1=$on;
 $2=$bouton;
 var $3=$2; //@line 48 "../../../src/sdl/bouton.c"
 var $4=(($3+36)|0); //@line 48 "../../../src/sdl/bouton.c"
 var $5=HEAP8[($4)]; //@line 48 "../../../src/sdl/bouton.c"
 var $6=(($5)&1); //@line 48 "../../../src/sdl/bouton.c"
  //@line 48 "../../../src/sdl/bouton.c"
 if (!($6)) {
   //@line 49 "../../../src/sdl/bouton.c"
  STACKTOP=sp;return; //@line 61 "../../../src/sdl/bouton.c"
 }
 var $9=$2; //@line 50 "../../../src/sdl/bouton.c"
 var $10=(($9+48)|0); //@line 50 "../../../src/sdl/bouton.c"
 var $11=HEAP8[($10)]; //@line 50 "../../../src/sdl/bouton.c"
 var $12=(($11)&1); //@line 50 "../../../src/sdl/bouton.c"
  //@line 50 "../../../src/sdl/bouton.c"
 if ($12) {
  var $14=$2; //@line 51 "../../../src/sdl/bouton.c"
  var $15=(($14+28)|0); //@line 51 "../../../src/sdl/bouton.c"
  var $16=(($15)|0); //@line 51 "../../../src/sdl/bouton.c"
  var $17=HEAP8[($16)]; //@line 51 "../../../src/sdl/bouton.c"
  var $18=($17&255); //@line 51 "../../../src/sdl/bouton.c"
  var $19=(((($18|0))/(2))&-1); //@line 51 "../../../src/sdl/bouton.c"
  var $20=$2; //@line 51 "../../../src/sdl/bouton.c"
  var $21=(($20+28)|0); //@line 51 "../../../src/sdl/bouton.c"
  var $22=(($21+1)|0); //@line 51 "../../../src/sdl/bouton.c"
  var $23=HEAP8[($22)]; //@line 51 "../../../src/sdl/bouton.c"
  var $24=($23&255); //@line 51 "../../../src/sdl/bouton.c"
  var $25=(((($24|0))/(2))&-1); //@line 51 "../../../src/sdl/bouton.c"
  var $26=$2; //@line 51 "../../../src/sdl/bouton.c"
  var $27=(($26+28)|0); //@line 51 "../../../src/sdl/bouton.c"
  var $28=(($27+2)|0); //@line 51 "../../../src/sdl/bouton.c"
  var $29=HEAP8[($28)]; //@line 51 "../../../src/sdl/bouton.c"
  var $30=($29&255); //@line 51 "../../../src/sdl/bouton.c"
  var $31=(((($30|0))/(2))&-1); //@line 51 "../../../src/sdl/bouton.c"
  _set_color($19,$25,$31); //@line 51 "../../../src/sdl/bouton.c"
   //@line 52 "../../../src/sdl/bouton.c"
 } else {
  var $33=$2; //@line 53 "../../../src/sdl/bouton.c"
  var $34=(($33+28)|0); //@line 53 "../../../src/sdl/bouton.c"
  var $35=(($34)|0); //@line 53 "../../../src/sdl/bouton.c"
  var $36=HEAP8[($35)]; //@line 53 "../../../src/sdl/bouton.c"
  var $37=($36&255); //@line 53 "../../../src/sdl/bouton.c"
  var $38=($37<<1); //@line 53 "../../../src/sdl/bouton.c"
  var $39=255<($38|0); //@line 53 "../../../src/sdl/bouton.c"
   //@line 53 "../../../src/sdl/bouton.c"
  if ($39) {
    //@line 53 "../../../src/sdl/bouton.c"
   var $49=255;
  } else {
   var $42=$2; //@line 53 "../../../src/sdl/bouton.c"
   var $43=(($42+28)|0); //@line 53 "../../../src/sdl/bouton.c"
   var $44=(($43)|0); //@line 53 "../../../src/sdl/bouton.c"
   var $45=HEAP8[($44)]; //@line 53 "../../../src/sdl/bouton.c"
   var $46=($45&255); //@line 53 "../../../src/sdl/bouton.c"
   var $47=($46<<1); //@line 53 "../../../src/sdl/bouton.c"
    //@line 53 "../../../src/sdl/bouton.c"
   var $49=$47;
  }
  var $49; //@line 53 "../../../src/sdl/bouton.c"
  var $50=$2; //@line 53 "../../../src/sdl/bouton.c"
  var $51=(($50+28)|0); //@line 53 "../../../src/sdl/bouton.c"
  var $52=(($51+1)|0); //@line 53 "../../../src/sdl/bouton.c"
  var $53=HEAP8[($52)]; //@line 53 "../../../src/sdl/bouton.c"
  var $54=($53&255); //@line 53 "../../../src/sdl/bouton.c"
  var $55=($54<<1); //@line 53 "../../../src/sdl/bouton.c"
  var $56=255<($55|0); //@line 53 "../../../src/sdl/bouton.c"
   //@line 53 "../../../src/sdl/bouton.c"
  if ($56) {
    //@line 53 "../../../src/sdl/bouton.c"
   var $66=255;
  } else {
   var $59=$2; //@line 53 "../../../src/sdl/bouton.c"
   var $60=(($59+28)|0); //@line 53 "../../../src/sdl/bouton.c"
   var $61=(($60+1)|0); //@line 53 "../../../src/sdl/bouton.c"
   var $62=HEAP8[($61)]; //@line 53 "../../../src/sdl/bouton.c"
   var $63=($62&255); //@line 53 "../../../src/sdl/bouton.c"
   var $64=($63<<1); //@line 53 "../../../src/sdl/bouton.c"
    //@line 53 "../../../src/sdl/bouton.c"
   var $66=$64;
  }
  var $66; //@line 53 "../../../src/sdl/bouton.c"
  var $67=$2; //@line 53 "../../../src/sdl/bouton.c"
  var $68=(($67+28)|0); //@line 53 "../../../src/sdl/bouton.c"
  var $69=(($68+2)|0); //@line 53 "../../../src/sdl/bouton.c"
  var $70=HEAP8[($69)]; //@line 53 "../../../src/sdl/bouton.c"
  var $71=($70&255); //@line 53 "../../../src/sdl/bouton.c"
  var $72=($71<<1); //@line 53 "../../../src/sdl/bouton.c"
  var $73=255<($72|0); //@line 53 "../../../src/sdl/bouton.c"
   //@line 53 "../../../src/sdl/bouton.c"
  if ($73) {
    //@line 53 "../../../src/sdl/bouton.c"
   var $83=255;
  } else {
   var $76=$2; //@line 53 "../../../src/sdl/bouton.c"
   var $77=(($76+28)|0); //@line 53 "../../../src/sdl/bouton.c"
   var $78=(($77+2)|0); //@line 53 "../../../src/sdl/bouton.c"
   var $79=HEAP8[($78)]; //@line 53 "../../../src/sdl/bouton.c"
   var $80=($79&255); //@line 53 "../../../src/sdl/bouton.c"
   var $81=($80<<1); //@line 53 "../../../src/sdl/bouton.c"
    //@line 53 "../../../src/sdl/bouton.c"
   var $83=$81;
  }
  var $83; //@line 53 "../../../src/sdl/bouton.c"
  _set_color($49,$66,$83); //@line 53 "../../../src/sdl/bouton.c"
 }
 var $85=$1; //@line 57 "../../../src/sdl/bouton.c"
 var $86=$2; //@line 57 "../../../src/sdl/bouton.c"
 var $87=(($86+4)|0); //@line 57 "../../../src/sdl/bouton.c"
 var $88=HEAPF32[(($87)>>2)]; //@line 57 "../../../src/sdl/bouton.c"
 var $89=(($88)&-1); //@line 57 "../../../src/sdl/bouton.c"
 var $90=$2; //@line 57 "../../../src/sdl/bouton.c"
 var $91=(($90+8)|0); //@line 57 "../../../src/sdl/bouton.c"
 var $92=HEAPF32[(($91)>>2)]; //@line 57 "../../../src/sdl/bouton.c"
 var $93=(($92)&-1); //@line 57 "../../../src/sdl/bouton.c"
 var $94=$2; //@line 57 "../../../src/sdl/bouton.c"
 var $95=(($94+20)|0); //@line 57 "../../../src/sdl/bouton.c"
 var $96=HEAP32[(($95)>>2)]; //@line 57 "../../../src/sdl/bouton.c"
 var $97=$2; //@line 57 "../../../src/sdl/bouton.c"
 var $98=(($97+24)|0); //@line 57 "../../../src/sdl/bouton.c"
 var $99=HEAP32[(($98)>>2)]; //@line 57 "../../../src/sdl/bouton.c"
 _draw_rect($85,$89,$93,$96,$99); //@line 57 "../../../src/sdl/bouton.c"
 var $100=$2; //@line 58 "../../../src/sdl/bouton.c"
 var $101=(($100+28)|0); //@line 58 "../../../src/sdl/bouton.c"
 var $102=(($101)|0); //@line 58 "../../../src/sdl/bouton.c"
 var $103=HEAP8[($102)]; //@line 58 "../../../src/sdl/bouton.c"
 var $104=($103&255); //@line 58 "../../../src/sdl/bouton.c"
 var $105=(((($104|0))/(3))&-1); //@line 58 "../../../src/sdl/bouton.c"
 var $106=$2; //@line 58 "../../../src/sdl/bouton.c"
 var $107=(($106+28)|0); //@line 58 "../../../src/sdl/bouton.c"
 var $108=(($107+1)|0); //@line 58 "../../../src/sdl/bouton.c"
 var $109=HEAP8[($108)]; //@line 58 "../../../src/sdl/bouton.c"
 var $110=($109&255); //@line 58 "../../../src/sdl/bouton.c"
 var $111=(((($110|0))/(3))&-1); //@line 58 "../../../src/sdl/bouton.c"
 var $112=$2; //@line 58 "../../../src/sdl/bouton.c"
 var $113=(($112+28)|0); //@line 58 "../../../src/sdl/bouton.c"
 var $114=(($113+2)|0); //@line 58 "../../../src/sdl/bouton.c"
 var $115=HEAP8[($114)]; //@line 58 "../../../src/sdl/bouton.c"
 var $116=($115&255); //@line 58 "../../../src/sdl/bouton.c"
 var $117=(((($116|0))/(3))&-1); //@line 58 "../../../src/sdl/bouton.c"
 _set_color($105,$111,$117); //@line 58 "../../../src/sdl/bouton.c"
 var $118=$1; //@line 59 "../../../src/sdl/bouton.c"
 var $119=$2; //@line 59 "../../../src/sdl/bouton.c"
 var $120=(($119+4)|0); //@line 59 "../../../src/sdl/bouton.c"
 var $121=HEAPF32[(($120)>>2)]; //@line 59 "../../../src/sdl/bouton.c"
 var $122=($121)+(2); //@line 59 "../../../src/sdl/bouton.c"
 var $123=(($122)&-1); //@line 59 "../../../src/sdl/bouton.c"
 var $124=$2; //@line 59 "../../../src/sdl/bouton.c"
 var $125=(($124+8)|0); //@line 59 "../../../src/sdl/bouton.c"
 var $126=HEAPF32[(($125)>>2)]; //@line 59 "../../../src/sdl/bouton.c"
 var $127=($126)+(2); //@line 59 "../../../src/sdl/bouton.c"
 var $128=(($127)&-1); //@line 59 "../../../src/sdl/bouton.c"
 var $129=$2; //@line 59 "../../../src/sdl/bouton.c"
 var $130=(($129+20)|0); //@line 59 "../../../src/sdl/bouton.c"
 var $131=HEAP32[(($130)>>2)]; //@line 59 "../../../src/sdl/bouton.c"
 var $132=((($131)-(4))|0); //@line 59 "../../../src/sdl/bouton.c"
 var $133=$2; //@line 59 "../../../src/sdl/bouton.c"
 var $134=(($133+24)|0); //@line 59 "../../../src/sdl/bouton.c"
 var $135=HEAP32[(($134)>>2)]; //@line 59 "../../../src/sdl/bouton.c"
 var $136=((($135)-(4))|0); //@line 59 "../../../src/sdl/bouton.c"
 _draw_rect($118,$123,$128,$132,$136); //@line 59 "../../../src/sdl/bouton.c"
 var $137=$1; //@line 60 "../../../src/sdl/bouton.c"
 var $138=$2; //@line 60 "../../../src/sdl/bouton.c"
 var $139=(($138)|0); //@line 60 "../../../src/sdl/bouton.c"
 var $140=HEAP32[(($139)>>2)]; //@line 60 "../../../src/sdl/bouton.c"
 var $141=$2; //@line 60 "../../../src/sdl/bouton.c"
 var $142=(($141+4)|0); //@line 60 "../../../src/sdl/bouton.c"
 var $143=HEAPF32[(($142)>>2)]; //@line 60 "../../../src/sdl/bouton.c"
 var $144=$2; //@line 60 "../../../src/sdl/bouton.c"
 var $145=(($144+20)|0); //@line 60 "../../../src/sdl/bouton.c"
 var $146=HEAP32[(($145)>>2)]; //@line 60 "../../../src/sdl/bouton.c"
 var $147=(((($146|0))/(2))&-1); //@line 60 "../../../src/sdl/bouton.c"
 var $148=($147|0); //@line 60 "../../../src/sdl/bouton.c"
 var $149=($143)+($148); //@line 60 "../../../src/sdl/bouton.c"
 var $150=(($149)&-1); //@line 60 "../../../src/sdl/bouton.c"
 var $151=$2; //@line 60 "../../../src/sdl/bouton.c"
 var $152=(($151+8)|0); //@line 60 "../../../src/sdl/bouton.c"
 var $153=HEAPF32[(($152)>>2)]; //@line 60 "../../../src/sdl/bouton.c"
 var $154=$2; //@line 60 "../../../src/sdl/bouton.c"
 var $155=(($154+24)|0); //@line 60 "../../../src/sdl/bouton.c"
 var $156=HEAP32[(($155)>>2)]; //@line 60 "../../../src/sdl/bouton.c"
 var $157=(((($156|0))/(2))&-1); //@line 60 "../../../src/sdl/bouton.c"
 var $158=($157|0); //@line 60 "../../../src/sdl/bouton.c"
 var $159=($153)+($158); //@line 60 "../../../src/sdl/bouton.c"
 var $160=(($159)&-1); //@line 60 "../../../src/sdl/bouton.c"
 _draw_surface($137,$140,$150,$160,2); //@line 60 "../../../src/sdl/bouton.c"
  //@line 61 "../../../src/sdl/bouton.c"
 STACKTOP=sp;return; //@line 61 "../../../src/sdl/bouton.c"
}


function _mise_a_jour_bouton($bouton,$dt){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 $1=$bouton;
 $2=$dt;
 var $3=$1; //@line 65 "../../../src/sdl/bouton.c"
 var $4=(($3+49)|0); //@line 65 "../../../src/sdl/bouton.c"
 var $5=HEAP8[($4)]; //@line 65 "../../../src/sdl/bouton.c"
 var $6=(($5)&1); //@line 65 "../../../src/sdl/bouton.c"
  //@line 65 "../../../src/sdl/bouton.c"
 do {
  if (!($6)) {
   var $8=$1; //@line 65 "../../../src/sdl/bouton.c"
   var $9=(($8+32)|0); //@line 65 "../../../src/sdl/bouton.c"
   var $10=HEAPF32[(($9)>>2)]; //@line 65 "../../../src/sdl/bouton.c"
   var $11=$10==0; //@line 65 "../../../src/sdl/bouton.c"
    //@line 65 "../../../src/sdl/bouton.c"
   if (!($11)) {
    break;
   }
   var $13=$1; //@line 66 "../../../src/sdl/bouton.c"
   var $14=(($13+12)|0); //@line 66 "../../../src/sdl/bouton.c"
   var $15=HEAPF32[(($14)>>2)]; //@line 66 "../../../src/sdl/bouton.c"
   var $16=$1; //@line 66 "../../../src/sdl/bouton.c"
   var $17=(($16+4)|0); //@line 66 "../../../src/sdl/bouton.c"
   var $18=HEAPF32[(($17)>>2)]; //@line 66 "../../../src/sdl/bouton.c"
   var $19=($15)-($18); //@line 66 "../../../src/sdl/bouton.c"
   var $20=$19; //@line 66 "../../../src/sdl/bouton.c"
   var $21=($20)*((0.1)); //@line 66 "../../../src/sdl/bouton.c"
   var $22=$1; //@line 66 "../../../src/sdl/bouton.c"
   var $23=(($22+4)|0); //@line 66 "../../../src/sdl/bouton.c"
   var $24=HEAPF32[(($23)>>2)]; //@line 66 "../../../src/sdl/bouton.c"
   var $25=$24; //@line 66 "../../../src/sdl/bouton.c"
   var $26=($25)+($21); //@line 66 "../../../src/sdl/bouton.c"
   var $27=$26; //@line 66 "../../../src/sdl/bouton.c"
   HEAPF32[(($23)>>2)]=$27; //@line 66 "../../../src/sdl/bouton.c"
   var $28=$1; //@line 67 "../../../src/sdl/bouton.c"
   var $29=(($28+16)|0); //@line 67 "../../../src/sdl/bouton.c"
   var $30=HEAPF32[(($29)>>2)]; //@line 67 "../../../src/sdl/bouton.c"
   var $31=$1; //@line 67 "../../../src/sdl/bouton.c"
   var $32=(($31+8)|0); //@line 67 "../../../src/sdl/bouton.c"
   var $33=HEAPF32[(($32)>>2)]; //@line 67 "../../../src/sdl/bouton.c"
   var $34=($30)-($33); //@line 67 "../../../src/sdl/bouton.c"
   var $35=$34; //@line 67 "../../../src/sdl/bouton.c"
   var $36=($35)*((0.1)); //@line 67 "../../../src/sdl/bouton.c"
   var $37=$1; //@line 67 "../../../src/sdl/bouton.c"
   var $38=(($37+8)|0); //@line 67 "../../../src/sdl/bouton.c"
   var $39=HEAPF32[(($38)>>2)]; //@line 67 "../../../src/sdl/bouton.c"
   var $40=$39; //@line 67 "../../../src/sdl/bouton.c"
   var $41=($40)+($36); //@line 67 "../../../src/sdl/bouton.c"
   var $42=$41; //@line 67 "../../../src/sdl/bouton.c"
   HEAPF32[(($38)>>2)]=$42; //@line 67 "../../../src/sdl/bouton.c"
    //@line 68 "../../../src/sdl/bouton.c"
  }
 } while(0);
 var $44=$1; //@line 69 "../../../src/sdl/bouton.c"
 var $45=(($44+32)|0); //@line 69 "../../../src/sdl/bouton.c"
 var $46=HEAPF32[(($45)>>2)]; //@line 69 "../../../src/sdl/bouton.c"
 var $47=$46>0; //@line 69 "../../../src/sdl/bouton.c"
  //@line 69 "../../../src/sdl/bouton.c"
 if (!($47)) {
  STACKTOP=sp;return; //@line 75 "../../../src/sdl/bouton.c"
 }
 var $49=$2; //@line 70 "../../../src/sdl/bouton.c"
 var $50=$1; //@line 70 "../../../src/sdl/bouton.c"
 var $51=(($50+32)|0); //@line 70 "../../../src/sdl/bouton.c"
 var $52=HEAPF32[(($51)>>2)]; //@line 70 "../../../src/sdl/bouton.c"
 var $53=$52; //@line 70 "../../../src/sdl/bouton.c"
 var $54=($53)-($49); //@line 70 "../../../src/sdl/bouton.c"
 var $55=$54; //@line 70 "../../../src/sdl/bouton.c"
 HEAPF32[(($51)>>2)]=$55; //@line 70 "../../../src/sdl/bouton.c"
 var $56=$1; //@line 71 "../../../src/sdl/bouton.c"
 var $57=(($56+32)|0); //@line 71 "../../../src/sdl/bouton.c"
 var $58=HEAPF32[(($57)>>2)]; //@line 71 "../../../src/sdl/bouton.c"
 var $59=$58<0; //@line 71 "../../../src/sdl/bouton.c"
  //@line 71 "../../../src/sdl/bouton.c"
 if ($59) {
  var $61=$1; //@line 72 "../../../src/sdl/bouton.c"
  var $62=(($61+32)|0); //@line 72 "../../../src/sdl/bouton.c"
  HEAPF32[(($62)>>2)]=0; //@line 72 "../../../src/sdl/bouton.c"
   //@line 73 "../../../src/sdl/bouton.c"
 }
  //@line 74 "../../../src/sdl/bouton.c"
 STACKTOP=sp;return; //@line 75 "../../../src/sdl/bouton.c"
}


function _utiliser_event_bouton($bouton,$event){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $event; $event=STACKTOP;STACKTOP = (STACKTOP + 48)|0;(assert((STACKTOP|0) < (STACK_MAX|0))|0);(_memcpy($event, tempParam, 48)|0);
 var $1;
 $1=$bouton;
 var $2=$1; //@line 79 "../../../src/sdl/bouton.c"
 var $3=(($2+36)|0); //@line 79 "../../../src/sdl/bouton.c"
 var $4=HEAP8[($3)]; //@line 79 "../../../src/sdl/bouton.c"
 var $5=(($4)&1); //@line 79 "../../../src/sdl/bouton.c"
  //@line 79 "../../../src/sdl/bouton.c"
 if (!($5)) {
   //@line 80 "../../../src/sdl/bouton.c"
  STACKTOP=sp;return; //@line 111 "../../../src/sdl/bouton.c"
 }
 var $8=$event; //@line 84 "../../../src/sdl/bouton.c"
 var $9=HEAP32[(($8)>>2)]; //@line 84 "../../../src/sdl/bouton.c"
 var $10=($9|0)==1024; //@line 84 "../../../src/sdl/bouton.c"
  //@line 84 "../../../src/sdl/bouton.c"
 if ($10) {
  var $12=$1; //@line 85 "../../../src/sdl/bouton.c"
  var $13=(($12+4)|0); //@line 85 "../../../src/sdl/bouton.c"
  var $14=HEAPF32[(($13)>>2)]; //@line 85 "../../../src/sdl/bouton.c"
  var $15=$event; //@line 85 "../../../src/sdl/bouton.c"
  var $16=(($15+12)|0); //@line 85 "../../../src/sdl/bouton.c"
  var $17=HEAP32[(($16)>>2)]; //@line 85 "../../../src/sdl/bouton.c"
  var $18=($17|0); //@line 85 "../../../src/sdl/bouton.c"
  var $19=$14<$18; //@line 85 "../../../src/sdl/bouton.c"
   //@line 85 "../../../src/sdl/bouton.c"
  do {
   if ($19) {
    var $21=$event; //@line 85 "../../../src/sdl/bouton.c"
    var $22=(($21+12)|0); //@line 85 "../../../src/sdl/bouton.c"
    var $23=HEAP32[(($22)>>2)]; //@line 85 "../../../src/sdl/bouton.c"
    var $24=($23|0); //@line 85 "../../../src/sdl/bouton.c"
    var $25=$1; //@line 85 "../../../src/sdl/bouton.c"
    var $26=(($25+4)|0); //@line 85 "../../../src/sdl/bouton.c"
    var $27=HEAPF32[(($26)>>2)]; //@line 85 "../../../src/sdl/bouton.c"
    var $28=$1; //@line 85 "../../../src/sdl/bouton.c"
    var $29=(($28+20)|0); //@line 85 "../../../src/sdl/bouton.c"
    var $30=HEAP32[(($29)>>2)]; //@line 85 "../../../src/sdl/bouton.c"
    var $31=($30|0); //@line 85 "../../../src/sdl/bouton.c"
    var $32=($27)+($31); //@line 85 "../../../src/sdl/bouton.c"
    var $33=$24<$32; //@line 85 "../../../src/sdl/bouton.c"
     //@line 85 "../../../src/sdl/bouton.c"
    if (!($33)) {
     label = 9;
     break;
    }
    var $35=$1; //@line 85 "../../../src/sdl/bouton.c"
    var $36=(($35+8)|0); //@line 85 "../../../src/sdl/bouton.c"
    var $37=HEAPF32[(($36)>>2)]; //@line 85 "../../../src/sdl/bouton.c"
    var $38=$event; //@line 85 "../../../src/sdl/bouton.c"
    var $39=(($38+16)|0); //@line 85 "../../../src/sdl/bouton.c"
    var $40=HEAP32[(($39)>>2)]; //@line 85 "../../../src/sdl/bouton.c"
    var $41=($40|0); //@line 85 "../../../src/sdl/bouton.c"
    var $42=$37<$41; //@line 85 "../../../src/sdl/bouton.c"
     //@line 85 "../../../src/sdl/bouton.c"
    if (!($42)) {
     label = 9;
     break;
    }
    var $44=$event; //@line 85 "../../../src/sdl/bouton.c"
    var $45=(($44+16)|0); //@line 85 "../../../src/sdl/bouton.c"
    var $46=HEAP32[(($45)>>2)]; //@line 85 "../../../src/sdl/bouton.c"
    var $47=($46|0); //@line 85 "../../../src/sdl/bouton.c"
    var $48=$1; //@line 85 "../../../src/sdl/bouton.c"
    var $49=(($48+8)|0); //@line 85 "../../../src/sdl/bouton.c"
    var $50=HEAPF32[(($49)>>2)]; //@line 85 "../../../src/sdl/bouton.c"
    var $51=$1; //@line 85 "../../../src/sdl/bouton.c"
    var $52=(($51+24)|0); //@line 85 "../../../src/sdl/bouton.c"
    var $53=HEAP32[(($52)>>2)]; //@line 85 "../../../src/sdl/bouton.c"
    var $54=($53|0); //@line 85 "../../../src/sdl/bouton.c"
    var $55=($50)+($54); //@line 85 "../../../src/sdl/bouton.c"
    var $56=$47<$55; //@line 85 "../../../src/sdl/bouton.c"
     //@line 85 "../../../src/sdl/bouton.c"
    if (!($56)) {
     label = 9;
     break;
    }
    var $58=$1; //@line 86 "../../../src/sdl/bouton.c"
    var $59=(($58+48)|0); //@line 86 "../../../src/sdl/bouton.c"
    HEAP8[($59)]=1; //@line 86 "../../../src/sdl/bouton.c"
     //@line 87 "../../../src/sdl/bouton.c"
   } else {
    label = 9;
   }
  } while(0);
  if (label == 9) {
   var $61=$1; //@line 88 "../../../src/sdl/bouton.c"
   var $62=(($61+48)|0); //@line 88 "../../../src/sdl/bouton.c"
   HEAP8[($62)]=0; //@line 88 "../../../src/sdl/bouton.c"
  }
  var $64=$1; //@line 90 "../../../src/sdl/bouton.c"
  var $65=(($64+49)|0); //@line 90 "../../../src/sdl/bouton.c"
  var $66=HEAP8[($65)]; //@line 90 "../../../src/sdl/bouton.c"
  var $67=(($66)&1); //@line 90 "../../../src/sdl/bouton.c"
   //@line 90 "../../../src/sdl/bouton.c"
  if ($67) {
   var $69=$event; //@line 91 "../../../src/sdl/bouton.c"
   var $70=(($69+20)|0); //@line 91 "../../../src/sdl/bouton.c"
   var $71=HEAP32[(($70)>>2)]; //@line 91 "../../../src/sdl/bouton.c"
   var $72=($71|0); //@line 91 "../../../src/sdl/bouton.c"
   var $73=$1; //@line 91 "../../../src/sdl/bouton.c"
   var $74=(($73+4)|0); //@line 91 "../../../src/sdl/bouton.c"
   var $75=HEAPF32[(($74)>>2)]; //@line 91 "../../../src/sdl/bouton.c"
   var $76=($75)+($72); //@line 91 "../../../src/sdl/bouton.c"
   HEAPF32[(($74)>>2)]=$76; //@line 91 "../../../src/sdl/bouton.c"
   var $77=$event; //@line 92 "../../../src/sdl/bouton.c"
   var $78=(($77+24)|0); //@line 92 "../../../src/sdl/bouton.c"
   var $79=HEAP32[(($78)>>2)]; //@line 92 "../../../src/sdl/bouton.c"
   var $80=($79|0); //@line 92 "../../../src/sdl/bouton.c"
   var $81=$1; //@line 92 "../../../src/sdl/bouton.c"
   var $82=(($81+8)|0); //@line 92 "../../../src/sdl/bouton.c"
   var $83=HEAPF32[(($82)>>2)]; //@line 92 "../../../src/sdl/bouton.c"
   var $84=($83)+($80); //@line 92 "../../../src/sdl/bouton.c"
   HEAPF32[(($82)>>2)]=$84; //@line 92 "../../../src/sdl/bouton.c"
    //@line 93 "../../../src/sdl/bouton.c"
  }
   //@line 94 "../../../src/sdl/bouton.c"
  STACKTOP=sp;return; //@line 111 "../../../src/sdl/bouton.c"
 }
 var $87=$event; //@line 94 "../../../src/sdl/bouton.c"
 var $88=HEAP32[(($87)>>2)]; //@line 94 "../../../src/sdl/bouton.c"
 var $89=($88|0)==1025; //@line 94 "../../../src/sdl/bouton.c"
  //@line 94 "../../../src/sdl/bouton.c"
 if ($89) {
  var $91=$1; //@line 95 "../../../src/sdl/bouton.c"
  var $92=(($91+4)|0); //@line 95 "../../../src/sdl/bouton.c"
  var $93=HEAPF32[(($92)>>2)]; //@line 95 "../../../src/sdl/bouton.c"
  var $94=$event; //@line 95 "../../../src/sdl/bouton.c"
  var $95=(($94+12)|0); //@line 95 "../../../src/sdl/bouton.c"
  var $96=HEAP32[(($95)>>2)]; //@line 95 "../../../src/sdl/bouton.c"
  var $97=($96|0); //@line 95 "../../../src/sdl/bouton.c"
  var $98=$93<$97; //@line 95 "../../../src/sdl/bouton.c"
   //@line 95 "../../../src/sdl/bouton.c"
  do {
   if ($98) {
    var $100=$event; //@line 95 "../../../src/sdl/bouton.c"
    var $101=(($100+12)|0); //@line 95 "../../../src/sdl/bouton.c"
    var $102=HEAP32[(($101)>>2)]; //@line 95 "../../../src/sdl/bouton.c"
    var $103=($102|0); //@line 95 "../../../src/sdl/bouton.c"
    var $104=$1; //@line 95 "../../../src/sdl/bouton.c"
    var $105=(($104+4)|0); //@line 95 "../../../src/sdl/bouton.c"
    var $106=HEAPF32[(($105)>>2)]; //@line 95 "../../../src/sdl/bouton.c"
    var $107=$1; //@line 95 "../../../src/sdl/bouton.c"
    var $108=(($107+20)|0); //@line 95 "../../../src/sdl/bouton.c"
    var $109=HEAP32[(($108)>>2)]; //@line 95 "../../../src/sdl/bouton.c"
    var $110=($109|0); //@line 95 "../../../src/sdl/bouton.c"
    var $111=($106)+($110); //@line 95 "../../../src/sdl/bouton.c"
    var $112=$103<$111; //@line 95 "../../../src/sdl/bouton.c"
     //@line 95 "../../../src/sdl/bouton.c"
    if (!($112)) {
     break;
    }
    var $114=$1; //@line 95 "../../../src/sdl/bouton.c"
    var $115=(($114+8)|0); //@line 95 "../../../src/sdl/bouton.c"
    var $116=HEAPF32[(($115)>>2)]; //@line 95 "../../../src/sdl/bouton.c"
    var $117=$event; //@line 95 "../../../src/sdl/bouton.c"
    var $118=(($117+16)|0); //@line 95 "../../../src/sdl/bouton.c"
    var $119=HEAP32[(($118)>>2)]; //@line 95 "../../../src/sdl/bouton.c"
    var $120=($119|0); //@line 95 "../../../src/sdl/bouton.c"
    var $121=$116<$120; //@line 95 "../../../src/sdl/bouton.c"
     //@line 95 "../../../src/sdl/bouton.c"
    if (!($121)) {
     break;
    }
    var $123=$event; //@line 95 "../../../src/sdl/bouton.c"
    var $124=(($123+16)|0); //@line 95 "../../../src/sdl/bouton.c"
    var $125=HEAP32[(($124)>>2)]; //@line 95 "../../../src/sdl/bouton.c"
    var $126=($125|0); //@line 95 "../../../src/sdl/bouton.c"
    var $127=$1; //@line 95 "../../../src/sdl/bouton.c"
    var $128=(($127+8)|0); //@line 95 "../../../src/sdl/bouton.c"
    var $129=HEAPF32[(($128)>>2)]; //@line 95 "../../../src/sdl/bouton.c"
    var $130=$1; //@line 95 "../../../src/sdl/bouton.c"
    var $131=(($130+24)|0); //@line 95 "../../../src/sdl/bouton.c"
    var $132=HEAP32[(($131)>>2)]; //@line 95 "../../../src/sdl/bouton.c"
    var $133=($132|0); //@line 95 "../../../src/sdl/bouton.c"
    var $134=($129)+($133); //@line 95 "../../../src/sdl/bouton.c"
    var $135=$126<$134; //@line 95 "../../../src/sdl/bouton.c"
     //@line 95 "../../../src/sdl/bouton.c"
    if (!($135)) {
     break;
    }
    var $137=$event; //@line 96 "../../../src/sdl/bouton.c"
    var $138=(($137+8)|0); //@line 96 "../../../src/sdl/bouton.c"
    var $139=HEAP8[($138)]; //@line 96 "../../../src/sdl/bouton.c"
    var $140=($139&255); //@line 96 "../../../src/sdl/bouton.c"
    var $141=($140|0)==3; //@line 96 "../../../src/sdl/bouton.c"
     //@line 96 "../../../src/sdl/bouton.c"
    if ($141) {
     var $143=$1; //@line 97 "../../../src/sdl/bouton.c"
     var $144=(($143+49)|0); //@line 97 "../../../src/sdl/bouton.c"
     HEAP8[($144)]=1; //@line 97 "../../../src/sdl/bouton.c"
      //@line 98 "../../../src/sdl/bouton.c"
    }
     //@line 99 "../../../src/sdl/bouton.c"
   }
  } while(0);
   //@line 100 "../../../src/sdl/bouton.c"
 } else {
  var $148=$event; //@line 100 "../../../src/sdl/bouton.c"
  var $149=HEAP32[(($148)>>2)]; //@line 100 "../../../src/sdl/bouton.c"
  var $150=($149|0)==1026; //@line 100 "../../../src/sdl/bouton.c"
   //@line 100 "../../../src/sdl/bouton.c"
  if ($150) {
   var $152=$1; //@line 101 "../../../src/sdl/bouton.c"
   var $153=(($152+4)|0); //@line 101 "../../../src/sdl/bouton.c"
   var $154=HEAPF32[(($153)>>2)]; //@line 101 "../../../src/sdl/bouton.c"
   var $155=$event; //@line 101 "../../../src/sdl/bouton.c"
   var $156=(($155+12)|0); //@line 101 "../../../src/sdl/bouton.c"
   var $157=HEAP32[(($156)>>2)]; //@line 101 "../../../src/sdl/bouton.c"
   var $158=($157|0); //@line 101 "../../../src/sdl/bouton.c"
   var $159=$154<$158; //@line 101 "../../../src/sdl/bouton.c"
    //@line 101 "../../../src/sdl/bouton.c"
   do {
    if ($159) {
     var $161=$event; //@line 101 "../../../src/sdl/bouton.c"
     var $162=(($161+12)|0); //@line 101 "../../../src/sdl/bouton.c"
     var $163=HEAP32[(($162)>>2)]; //@line 101 "../../../src/sdl/bouton.c"
     var $164=($163|0); //@line 101 "../../../src/sdl/bouton.c"
     var $165=$1; //@line 101 "../../../src/sdl/bouton.c"
     var $166=(($165+4)|0); //@line 101 "../../../src/sdl/bouton.c"
     var $167=HEAPF32[(($166)>>2)]; //@line 101 "../../../src/sdl/bouton.c"
     var $168=$1; //@line 101 "../../../src/sdl/bouton.c"
     var $169=(($168+20)|0); //@line 101 "../../../src/sdl/bouton.c"
     var $170=HEAP32[(($169)>>2)]; //@line 101 "../../../src/sdl/bouton.c"
     var $171=($170|0); //@line 101 "../../../src/sdl/bouton.c"
     var $172=($167)+($171); //@line 101 "../../../src/sdl/bouton.c"
     var $173=$164<$172; //@line 101 "../../../src/sdl/bouton.c"
      //@line 101 "../../../src/sdl/bouton.c"
     if (!($173)) {
      break;
     }
     var $175=$1; //@line 101 "../../../src/sdl/bouton.c"
     var $176=(($175+8)|0); //@line 101 "../../../src/sdl/bouton.c"
     var $177=HEAPF32[(($176)>>2)]; //@line 101 "../../../src/sdl/bouton.c"
     var $178=$event; //@line 101 "../../../src/sdl/bouton.c"
     var $179=(($178+16)|0); //@line 101 "../../../src/sdl/bouton.c"
     var $180=HEAP32[(($179)>>2)]; //@line 101 "../../../src/sdl/bouton.c"
     var $181=($180|0); //@line 101 "../../../src/sdl/bouton.c"
     var $182=$177<$181; //@line 101 "../../../src/sdl/bouton.c"
      //@line 101 "../../../src/sdl/bouton.c"
     if (!($182)) {
      break;
     }
     var $184=$event; //@line 101 "../../../src/sdl/bouton.c"
     var $185=(($184+16)|0); //@line 101 "../../../src/sdl/bouton.c"
     var $186=HEAP32[(($185)>>2)]; //@line 101 "../../../src/sdl/bouton.c"
     var $187=($186|0); //@line 101 "../../../src/sdl/bouton.c"
     var $188=$1; //@line 101 "../../../src/sdl/bouton.c"
     var $189=(($188+8)|0); //@line 101 "../../../src/sdl/bouton.c"
     var $190=HEAPF32[(($189)>>2)]; //@line 101 "../../../src/sdl/bouton.c"
     var $191=$1; //@line 101 "../../../src/sdl/bouton.c"
     var $192=(($191+24)|0); //@line 101 "../../../src/sdl/bouton.c"
     var $193=HEAP32[(($192)>>2)]; //@line 101 "../../../src/sdl/bouton.c"
     var $194=($193|0); //@line 101 "../../../src/sdl/bouton.c"
     var $195=($190)+($194); //@line 101 "../../../src/sdl/bouton.c"
     var $196=$187<$195; //@line 101 "../../../src/sdl/bouton.c"
      //@line 101 "../../../src/sdl/bouton.c"
     if (!($196)) {
      break;
     }
     var $198=$event; //@line 102 "../../../src/sdl/bouton.c"
     var $199=(($198+8)|0); //@line 102 "../../../src/sdl/bouton.c"
     var $200=HEAP8[($199)]; //@line 102 "../../../src/sdl/bouton.c"
     var $201=($200&255); //@line 102 "../../../src/sdl/bouton.c"
     var $202=($201|0)==1; //@line 102 "../../../src/sdl/bouton.c"
      //@line 102 "../../../src/sdl/bouton.c"
     if ($202) {
      var $204=$1; //@line 103 "../../../src/sdl/bouton.c"
      var $205=(($204+40)|0); //@line 103 "../../../src/sdl/bouton.c"
      var $206=HEAP32[(($205)>>2)]; //@line 103 "../../../src/sdl/bouton.c"
      var $207=$1; //@line 103 "../../../src/sdl/bouton.c"
      var $208=$1; //@line 103 "../../../src/sdl/bouton.c"
      var $209=(($208+44)|0); //@line 103 "../../../src/sdl/bouton.c"
      var $210=HEAP32[(($209)>>2)]; //@line 103 "../../../src/sdl/bouton.c"
      FUNCTION_TABLE[$206]($207,$210); //@line 103 "../../../src/sdl/bouton.c"
       //@line 104 "../../../src/sdl/bouton.c"
     } else {
      var $212=$event; //@line 104 "../../../src/sdl/bouton.c"
      var $213=(($212+8)|0); //@line 104 "../../../src/sdl/bouton.c"
      var $214=HEAP8[($213)]; //@line 104 "../../../src/sdl/bouton.c"
      var $215=($214&255); //@line 104 "../../../src/sdl/bouton.c"
      var $216=($215|0)==3; //@line 104 "../../../src/sdl/bouton.c"
       //@line 104 "../../../src/sdl/bouton.c"
      if ($216) {
       var $218=$1; //@line 105 "../../../src/sdl/bouton.c"
       var $219=(($218+49)|0); //@line 105 "../../../src/sdl/bouton.c"
       HEAP8[($219)]=0; //@line 105 "../../../src/sdl/bouton.c"
       var $220=$1; //@line 106 "../../../src/sdl/bouton.c"
       var $221=(($220+32)|0); //@line 106 "../../../src/sdl/bouton.c"
       HEAPF32[(($221)>>2)]=1; //@line 106 "../../../src/sdl/bouton.c"
        //@line 107 "../../../src/sdl/bouton.c"
      }
     }
      //@line 108 "../../../src/sdl/bouton.c"
    }
   } while(0);
    //@line 109 "../../../src/sdl/bouton.c"
  }
 }
 STACKTOP=sp;return; //@line 111 "../../../src/sdl/bouton.c"
}


function _detruire_bouton($bouton){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$bouton;
 var $2=$1; //@line 115 "../../../src/sdl/bouton.c"
 var $3=(($2)|0); //@line 115 "../../../src/sdl/bouton.c"
 var $4=HEAP32[(($3)>>2)]; //@line 115 "../../../src/sdl/bouton.c"
 _SDL_FreeSurface($4); //@line 115 "../../../src/sdl/bouton.c"
 var $5=$1; //@line 116 "../../../src/sdl/bouton.c"
 var $6=$5; //@line 116 "../../../src/sdl/bouton.c"
 _gosh_free($6); //@line 116 "../../../src/sdl/bouton.c"
 STACKTOP=sp;return; //@line 117 "../../../src/sdl/bouton.c"
}


function _lesYeuxDeLaChaine($chaine,$plateau){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+40)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $yeux;
 var $couleur_chaine;
 var $position_chaine=sp;
 var $it=(sp)+(8);
 var $voisins=(sp)+(16);
 var $i;
 var $position=(sp)+(32);
 var $territoire;
 var $couleur;
 $1=$chaine;
 $2=$plateau;
 var $3=_creer_ensemble_position(); //@line 32 "../../../src/go/chaine.c"
 $yeux=$3; //@line 32 "../../../src/go/chaine.c"
 var $4=$1; //@line 33 "../../../src/go/chaine.c"
 var $5=_ensemble_colore_couleur($4); //@line 33 "../../../src/go/chaine.c"
 $couleur_chaine=$5; //@line 33 "../../../src/go/chaine.c"
 var $6=$1; //@line 37 "../../../src/go/chaine.c"
 var $7=(($6+4)|0); //@line 37 "../../../src/go/chaine.c"
 var $8=HEAP32[(($7)>>2)]; //@line 37 "../../../src/go/chaine.c"
 FUNCTION_TABLE[$8]($it); //@line 37 "../../../src/go/chaine.c"
  //@line 37 "../../../src/go/chaine.c"
 while(1) {
  var $10=$1; //@line 37 "../../../src/go/chaine.c"
  var $11=(($10)|0); //@line 37 "../../../src/go/chaine.c"
  var $12=HEAP32[(($11)>>2)]; //@line 37 "../../../src/go/chaine.c"
  var $13=$1; //@line 37 "../../../src/go/chaine.c"
  var $14=FUNCTION_TABLE[$12]($it,$13,$position_chaine); //@line 37 "../../../src/go/chaine.c"
  var $15=($14|0)!=0; //@line 37 "../../../src/go/chaine.c"
   //@line 37 "../../../src/go/chaine.c"
  if (!($15)) {
   break;
  }
  var $17=(($voisins)|0); //@line 38 "../../../src/go/chaine.c"
  _position_gauche($17,$position_chaine); //@line 38 "../../../src/go/chaine.c"
  var $18=(($17+4)|0); //@line 38 "../../../src/go/chaine.c"
  _position_droite($18,$position_chaine); //@line 38 "../../../src/go/chaine.c"
  var $19=(($18+4)|0); //@line 38 "../../../src/go/chaine.c"
  _position_haut($19,$position_chaine); //@line 38 "../../../src/go/chaine.c"
  var $20=(($19+4)|0); //@line 38 "../../../src/go/chaine.c"
  _position_bas($20,$position_chaine); //@line 38 "../../../src/go/chaine.c"
  $i=0; //@line 39 "../../../src/go/chaine.c"
   //@line 39 "../../../src/go/chaine.c"
  while(1) {
   var $22=$i; //@line 39 "../../../src/go/chaine.c"
   var $23=($22|0)<4; //@line 39 "../../../src/go/chaine.c"
    //@line 39 "../../../src/go/chaine.c"
   if (!($23)) {
    break;
   }
   var $25=$i; //@line 40 "../../../src/go/chaine.c"
   var $26=(($voisins+($25<<2))|0); //@line 40 "../../../src/go/chaine.c"
   var $27=$position; //@line 40 "../../../src/go/chaine.c"
   var $28=$26; //@line 40 "../../../src/go/chaine.c"
   assert(4 % 1 === 0);HEAP8[($27)]=HEAP8[($28)];HEAP8[((($27)+(1))|0)]=HEAP8[((($28)+(1))|0)];HEAP8[((($27)+(2))|0)]=HEAP8[((($28)+(2))|0)];HEAP8[((($27)+(3))|0)]=HEAP8[((($28)+(3))|0)]; //@line 40 "../../../src/go/chaine.c"
   var $29=_position_est_valide($position); //@line 42 "../../../src/go/chaine.c"
    //@line 42 "../../../src/go/chaine.c"
   if ($29) {
    var $31=$2; //@line 45 "../../../src/go/chaine.c"
    var $32=_determiner_territoire($31,$position); //@line 45 "../../../src/go/chaine.c"
    $territoire=$32; //@line 45 "../../../src/go/chaine.c"
    var $33=$territoire; //@line 46 "../../../src/go/chaine.c"
    var $34=(($33+20)|0); //@line 46 "../../../src/go/chaine.c"
    var $35=HEAP32[(($34)>>2)]; //@line 46 "../../../src/go/chaine.c"
    var $36=$territoire; //@line 46 "../../../src/go/chaine.c"
    var $37=FUNCTION_TABLE[$35]($36); //@line 46 "../../../src/go/chaine.c"
    var $38=($37|0)==1; //@line 46 "../../../src/go/chaine.c"
     //@line 46 "../../../src/go/chaine.c"
    if ($38) {
     var $40=$territoire; //@line 47 "../../../src/go/chaine.c"
     var $41=_ensemble_colore_couleur($40); //@line 47 "../../../src/go/chaine.c"
     $couleur=$41; //@line 47 "../../../src/go/chaine.c"
     var $42=$couleur; //@line 48 "../../../src/go/chaine.c"
     var $43=$couleur_chaine; //@line 48 "../../../src/go/chaine.c"
     var $44=($42|0)==($43|0); //@line 48 "../../../src/go/chaine.c"
      //@line 48 "../../../src/go/chaine.c"
     if ($44) {
      var $46=$yeux; //@line 49 "../../../src/go/chaine.c"
      var $47=(($46+12)|0); //@line 49 "../../../src/go/chaine.c"
      var $48=HEAP32[(($47)>>2)]; //@line 49 "../../../src/go/chaine.c"
      var $49=$yeux; //@line 49 "../../../src/go/chaine.c"
      FUNCTION_TABLE[$48]($49,$position); //@line 49 "../../../src/go/chaine.c"
       //@line 50 "../../../src/go/chaine.c"
     }
      //@line 51 "../../../src/go/chaine.c"
    }
    var $52=$territoire; //@line 53 "../../../src/go/chaine.c"
    _detruire_ensemble_colore($52); //@line 53 "../../../src/go/chaine.c"
     //@line 54 "../../../src/go/chaine.c"
   }
    //@line 55 "../../../src/go/chaine.c"
   var $55=$i; //@line 39 "../../../src/go/chaine.c"
   var $56=((($55)+(1))|0); //@line 39 "../../../src/go/chaine.c"
   $i=$56; //@line 39 "../../../src/go/chaine.c"
    //@line 39 "../../../src/go/chaine.c"
  }
   //@line 56 "../../../src/go/chaine.c"
 }
 var $59=$yeux; //@line 58 "../../../src/go/chaine.c"
 var $60=(($59+8)|0); //@line 58 "../../../src/go/chaine.c"
 var $61=HEAP32[(($60)>>2)]; //@line 58 "../../../src/go/chaine.c"
 var $62=$yeux; //@line 58 "../../../src/go/chaine.c"
 var $63=FUNCTION_TABLE[$61]($62); //@line 58 "../../../src/go/chaine.c"
  //@line 58 "../../../src/go/chaine.c"
 if (!($63)) {
  var $67=$yeux; //@line 62 "../../../src/go/chaine.c"
  STACKTOP=sp;return $67; //@line 62 "../../../src/go/chaine.c"
 }
 var $65=$yeux; //@line 59 "../../../src/go/chaine.c"
 _detruire_ensemble_position($65); //@line 59 "../../../src/go/chaine.c"
 $yeux=0; //@line 60 "../../../src/go/chaine.c"
  //@line 61 "../../../src/go/chaine.c"
 var $67=$yeux; //@line 62 "../../../src/go/chaine.c"
 STACKTOP=sp;return $67; //@line 62 "../../../src/go/chaine.c"
}


function _creer_ensemble_colore($couleur){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $ptrEnsemble;
 var $ensemble;
 $1=$couleur;
 var $2=_gosh_alloc_size(28); //@line 29 "../../../src/go/ensemble_colore.c"
 var $3=$2; //@line 29 "../../../src/go/ensemble_colore.c"
 $ptrEnsemble=$3; //@line 29 "../../../src/go/ensemble_colore.c"
 var $4=_gosh_alloc_size(8); //@line 30 "../../../src/go/ensemble_colore.c"
 var $5=$4; //@line 30 "../../../src/go/ensemble_colore.c"
 var $6=$ptrEnsemble; //@line 30 "../../../src/go/ensemble_colore.c"
 var $7=(($6+24)|0); //@line 30 "../../../src/go/ensemble_colore.c"
 HEAP32[(($7)>>2)]=$5; //@line 30 "../../../src/go/ensemble_colore.c"
 var $8=$ptrEnsemble; //@line 31 "../../../src/go/ensemble_colore.c"
 var $9=(($8+24)|0); //@line 31 "../../../src/go/ensemble_colore.c"
 var $10=HEAP32[(($9)>>2)]; //@line 31 "../../../src/go/ensemble_colore.c"
 $ensemble=$10; //@line 31 "../../../src/go/ensemble_colore.c"
 var $11=$1; //@line 33 "../../../src/go/ensemble_colore.c"
 var $12=$ensemble; //@line 33 "../../../src/go/ensemble_colore.c"
 var $13=(($12+4)|0); //@line 33 "../../../src/go/ensemble_colore.c"
 HEAP32[(($13)>>2)]=$11; //@line 33 "../../../src/go/ensemble_colore.c"
 var $14=_creer_ensemble_position(); //@line 34 "../../../src/go/ensemble_colore.c"
 var $15=$ensemble; //@line 34 "../../../src/go/ensemble_colore.c"
 var $16=(($15)|0); //@line 34 "../../../src/go/ensemble_colore.c"
 HEAP32[(($16)>>2)]=$14; //@line 34 "../../../src/go/ensemble_colore.c"
 var $17=$ptrEnsemble; //@line 36 "../../../src/go/ensemble_colore.c"
 var $18=(($17)|0); //@line 36 "../../../src/go/ensemble_colore.c"
 HEAP32[(($18)>>2)]=12; //@line 36 "../../../src/go/ensemble_colore.c"
 var $19=$ptrEnsemble; //@line 37 "../../../src/go/ensemble_colore.c"
 var $20=(($19+4)|0); //@line 37 "../../../src/go/ensemble_colore.c"
 HEAP32[(($20)>>2)]=6; //@line 37 "../../../src/go/ensemble_colore.c"
 var $21=$ptrEnsemble; //@line 38 "../../../src/go/ensemble_colore.c"
 var $22=(($21+8)|0); //@line 38 "../../../src/go/ensemble_colore.c"
 HEAP32[(($22)>>2)]=92; //@line 38 "../../../src/go/ensemble_colore.c"
 var $23=$ptrEnsemble; //@line 39 "../../../src/go/ensemble_colore.c"
 var $24=(($23+12)|0); //@line 39 "../../../src/go/ensemble_colore.c"
 HEAP32[(($24)>>2)]=160; //@line 39 "../../../src/go/ensemble_colore.c"
 var $25=$ptrEnsemble; //@line 40 "../../../src/go/ensemble_colore.c"
 var $26=(($25+16)|0); //@line 40 "../../../src/go/ensemble_colore.c"
 HEAP32[(($26)>>2)]=322; //@line 40 "../../../src/go/ensemble_colore.c"
 var $27=$ptrEnsemble; //@line 41 "../../../src/go/ensemble_colore.c"
 var $28=(($27+20)|0); //@line 41 "../../../src/go/ensemble_colore.c"
 HEAP32[(($28)>>2)]=110; //@line 41 "../../../src/go/ensemble_colore.c"
 var $29=$ptrEnsemble; //@line 43 "../../../src/go/ensemble_colore.c"
 STACKTOP=sp;return $29; //@line 43 "../../../src/go/ensemble_colore.c"
}


function _ensemble_colore_next($it,$ptrEnsemble,$position){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 $1=$it;
 $2=$ptrEnsemble;
 $3=$position;
 var $4=$2; //@line 74 "../../../src/go/ensemble_colore.c"
 var $5=(($4+24)|0); //@line 74 "../../../src/go/ensemble_colore.c"
 var $6=HEAP32[(($5)>>2)]; //@line 74 "../../../src/go/ensemble_colore.c"
 var $7=(($6)|0); //@line 74 "../../../src/go/ensemble_colore.c"
 var $8=HEAP32[(($7)>>2)]; //@line 74 "../../../src/go/ensemble_colore.c"
 var $9=(($8)|0); //@line 74 "../../../src/go/ensemble_colore.c"
 var $10=HEAP32[(($9)>>2)]; //@line 74 "../../../src/go/ensemble_colore.c"
 var $11=$1; //@line 74 "../../../src/go/ensemble_colore.c"
 var $12=$2; //@line 74 "../../../src/go/ensemble_colore.c"
 var $13=(($12+24)|0); //@line 74 "../../../src/go/ensemble_colore.c"
 var $14=HEAP32[(($13)>>2)]; //@line 74 "../../../src/go/ensemble_colore.c"
 var $15=(($14)|0); //@line 74 "../../../src/go/ensemble_colore.c"
 var $16=HEAP32[(($15)>>2)]; //@line 74 "../../../src/go/ensemble_colore.c"
 var $17=$3; //@line 74 "../../../src/go/ensemble_colore.c"
 var $18=FUNCTION_TABLE[$10]($11,$16,$17); //@line 74 "../../../src/go/ensemble_colore.c"
 STACKTOP=sp;return $18; //@line 74 "../../../src/go/ensemble_colore.c"
}


function _ensemble_colore_createIterateur($agg_result){
 var label=0;

 _ensemble_position_createIterateur($agg_result); //@line 69 "../../../src/go/ensemble_colore.c"
 return; //@line 69 "../../../src/go/ensemble_colore.c"
}


function _ensemble_colore_vide($ptrEnsemble){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$ptrEnsemble;
 var $2=$1; //@line 79 "../../../src/go/ensemble_colore.c"
 var $3=(($2+24)|0); //@line 79 "../../../src/go/ensemble_colore.c"
 var $4=HEAP32[(($3)>>2)]; //@line 79 "../../../src/go/ensemble_colore.c"
 var $5=(($4)|0); //@line 79 "../../../src/go/ensemble_colore.c"
 var $6=HEAP32[(($5)>>2)]; //@line 79 "../../../src/go/ensemble_colore.c"
 var $7=(($6+8)|0); //@line 79 "../../../src/go/ensemble_colore.c"
 var $8=HEAP32[(($7)>>2)]; //@line 79 "../../../src/go/ensemble_colore.c"
 var $9=$1; //@line 79 "../../../src/go/ensemble_colore.c"
 var $10=(($9+24)|0); //@line 79 "../../../src/go/ensemble_colore.c"
 var $11=HEAP32[(($10)>>2)]; //@line 79 "../../../src/go/ensemble_colore.c"
 var $12=(($11)|0); //@line 79 "../../../src/go/ensemble_colore.c"
 var $13=HEAP32[(($12)>>2)]; //@line 79 "../../../src/go/ensemble_colore.c"
 var $14=FUNCTION_TABLE[$8]($13); //@line 79 "../../../src/go/ensemble_colore.c"
 STACKTOP=sp;return $14; //@line 79 "../../../src/go/ensemble_colore.c"
}


function _ensemble_colore_ajouter($ptrEnsemble,$position){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $position; $position=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($position)>>2)]=HEAP32[((tempParam)>>2)];
 var $1;
 $1=$ptrEnsemble;
 var $2=$1; //@line 84 "../../../src/go/ensemble_colore.c"
 var $3=(($2+24)|0); //@line 84 "../../../src/go/ensemble_colore.c"
 var $4=HEAP32[(($3)>>2)]; //@line 84 "../../../src/go/ensemble_colore.c"
 var $5=(($4)|0); //@line 84 "../../../src/go/ensemble_colore.c"
 var $6=HEAP32[(($5)>>2)]; //@line 84 "../../../src/go/ensemble_colore.c"
 var $7=(($6+12)|0); //@line 84 "../../../src/go/ensemble_colore.c"
 var $8=HEAP32[(($7)>>2)]; //@line 84 "../../../src/go/ensemble_colore.c"
 var $9=$1; //@line 84 "../../../src/go/ensemble_colore.c"
 var $10=(($9+24)|0); //@line 84 "../../../src/go/ensemble_colore.c"
 var $11=HEAP32[(($10)>>2)]; //@line 84 "../../../src/go/ensemble_colore.c"
 var $12=(($11)|0); //@line 84 "../../../src/go/ensemble_colore.c"
 var $13=HEAP32[(($12)>>2)]; //@line 84 "../../../src/go/ensemble_colore.c"
 FUNCTION_TABLE[$8]($13,$position); //@line 84 "../../../src/go/ensemble_colore.c"
 STACKTOP=sp;return; //@line 85 "../../../src/go/ensemble_colore.c"
}


function _ensemble_colore_appartient($ptrEnsemble,$position){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $position; $position=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($position)>>2)]=HEAP32[((tempParam)>>2)];
 var $1;
 $1=$ptrEnsemble;
 var $2=$1; //@line 89 "../../../src/go/ensemble_colore.c"
 var $3=(($2+24)|0); //@line 89 "../../../src/go/ensemble_colore.c"
 var $4=HEAP32[(($3)>>2)]; //@line 89 "../../../src/go/ensemble_colore.c"
 var $5=(($4)|0); //@line 89 "../../../src/go/ensemble_colore.c"
 var $6=HEAP32[(($5)>>2)]; //@line 89 "../../../src/go/ensemble_colore.c"
 var $7=(($6+16)|0); //@line 89 "../../../src/go/ensemble_colore.c"
 var $8=HEAP32[(($7)>>2)]; //@line 89 "../../../src/go/ensemble_colore.c"
 var $9=$1; //@line 89 "../../../src/go/ensemble_colore.c"
 var $10=(($9+24)|0); //@line 89 "../../../src/go/ensemble_colore.c"
 var $11=HEAP32[(($10)>>2)]; //@line 89 "../../../src/go/ensemble_colore.c"
 var $12=(($11)|0); //@line 89 "../../../src/go/ensemble_colore.c"
 var $13=HEAP32[(($12)>>2)]; //@line 89 "../../../src/go/ensemble_colore.c"
 var $14=FUNCTION_TABLE[$8]($13,$position); //@line 89 "../../../src/go/ensemble_colore.c"
 STACKTOP=sp;return $14; //@line 89 "../../../src/go/ensemble_colore.c"
}


function _ensemble_colore_nombre_elements($ptrEnsemble){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$ptrEnsemble;
 var $2=$1; //@line 94 "../../../src/go/ensemble_colore.c"
 var $3=(($2+24)|0); //@line 94 "../../../src/go/ensemble_colore.c"
 var $4=HEAP32[(($3)>>2)]; //@line 94 "../../../src/go/ensemble_colore.c"
 var $5=(($4)|0); //@line 94 "../../../src/go/ensemble_colore.c"
 var $6=HEAP32[(($5)>>2)]; //@line 94 "../../../src/go/ensemble_colore.c"
 var $7=(($6+24)|0); //@line 94 "../../../src/go/ensemble_colore.c"
 var $8=HEAP32[(($7)>>2)]; //@line 94 "../../../src/go/ensemble_colore.c"
 var $9=$1; //@line 94 "../../../src/go/ensemble_colore.c"
 var $10=(($9+24)|0); //@line 94 "../../../src/go/ensemble_colore.c"
 var $11=HEAP32[(($10)>>2)]; //@line 94 "../../../src/go/ensemble_colore.c"
 var $12=(($11)|0); //@line 94 "../../../src/go/ensemble_colore.c"
 var $13=HEAP32[(($12)>>2)]; //@line 94 "../../../src/go/ensemble_colore.c"
 var $14=FUNCTION_TABLE[$8]($13); //@line 94 "../../../src/go/ensemble_colore.c"
 STACKTOP=sp;return $14; //@line 94 "../../../src/go/ensemble_colore.c"
}


function _detruire_ensemble_colore($ptrEnsemble){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$ptrEnsemble;
 var $2=$1; //@line 48 "../../../src/go/ensemble_colore.c"
 var $3=(($2+24)|0); //@line 48 "../../../src/go/ensemble_colore.c"
 var $4=HEAP32[(($3)>>2)]; //@line 48 "../../../src/go/ensemble_colore.c"
 var $5=(($4)|0); //@line 48 "../../../src/go/ensemble_colore.c"
 var $6=HEAP32[(($5)>>2)]; //@line 48 "../../../src/go/ensemble_colore.c"
 _detruire_ensemble_position($6); //@line 48 "../../../src/go/ensemble_colore.c"
 var $7=$1; //@line 49 "../../../src/go/ensemble_colore.c"
 var $8=(($7+24)|0); //@line 49 "../../../src/go/ensemble_colore.c"
 var $9=HEAP32[(($8)>>2)]; //@line 49 "../../../src/go/ensemble_colore.c"
 var $10=$9; //@line 49 "../../../src/go/ensemble_colore.c"
 _gosh_free($10); //@line 49 "../../../src/go/ensemble_colore.c"
 var $11=$1; //@line 50 "../../../src/go/ensemble_colore.c"
 var $12=$11; //@line 50 "../../../src/go/ensemble_colore.c"
 _gosh_free($12); //@line 50 "../../../src/go/ensemble_colore.c"
 STACKTOP=sp;return; //@line 51 "../../../src/go/ensemble_colore.c"
}


function _ensemble_colore_couleur($ptrEnsemble){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$ptrEnsemble;
 var $2=$1; //@line 55 "../../../src/go/ensemble_colore.c"
 var $3=(($2+24)|0); //@line 55 "../../../src/go/ensemble_colore.c"
 var $4=HEAP32[(($3)>>2)]; //@line 55 "../../../src/go/ensemble_colore.c"
 var $5=(($4+4)|0); //@line 55 "../../../src/go/ensemble_colore.c"
 var $6=HEAP32[(($5)>>2)]; //@line 55 "../../../src/go/ensemble_colore.c"
 STACKTOP=sp;return $6; //@line 55 "../../../src/go/ensemble_colore.c"
}


function _ensemble_colore_positions($ptrEnsemble){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$ptrEnsemble;
 var $2=$1; //@line 59 "../../../src/go/ensemble_colore.c"
 var $3=(($2+24)|0); //@line 59 "../../../src/go/ensemble_colore.c"
 var $4=HEAP32[(($3)>>2)]; //@line 59 "../../../src/go/ensemble_colore.c"
 var $5=(($4)|0); //@line 59 "../../../src/go/ensemble_colore.c"
 var $6=HEAP32[(($5)>>2)]; //@line 59 "../../../src/go/ensemble_colore.c"
 STACKTOP=sp;return $6; //@line 59 "../../../src/go/ensemble_colore.c"
}


function _ensemble_colore_set_couleur($ptrEnsemble,$couleur){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 $1=$ptrEnsemble;
 $2=$couleur;
 var $3=$2; //@line 64 "../../../src/go/ensemble_colore.c"
 var $4=$1; //@line 64 "../../../src/go/ensemble_colore.c"
 var $5=(($4+24)|0); //@line 64 "../../../src/go/ensemble_colore.c"
 var $6=HEAP32[(($5)>>2)]; //@line 64 "../../../src/go/ensemble_colore.c"
 var $7=(($6+4)|0); //@line 64 "../../../src/go/ensemble_colore.c"
 HEAP32[(($7)>>2)]=$3; //@line 64 "../../../src/go/ensemble_colore.c"
 STACKTOP=sp;return; //@line 65 "../../../src/go/ensemble_colore.c"
}


function _ensemble_position_createIterateur($agg_result){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $it=sp;
 var $1=$it; //@line 39 "../../../src/gosh_ensemble.c"
 HEAP32[(($1)>>2)]=0; //@line 39 "../../../src/gosh_ensemble.c"
 var $2=$agg_result; //@line 40 "../../../src/gosh_ensemble.c"
 var $3=$it; //@line 40 "../../../src/gosh_ensemble.c"
 assert(4 % 1 === 0);HEAP32[(($2)>>2)]=HEAP32[(($3)>>2)]; //@line 40 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return; //@line 40 "../../../src/gosh_ensemble.c"
}


function _ensemble_position_next($it,$ptrContainer,$element){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $ptrNode;
 var $ptrElement;
 $1=$it;
 $2=$ptrContainer;
 $3=$element;
 var $4=$1; //@line 47 "../../../src/gosh_ensemble.c"
 var $5=(($4)|0); //@line 47 "../../../src/gosh_ensemble.c"
 var $6=HEAP32[(($5)>>2)]; //@line 47 "../../../src/gosh_ensemble.c"
 var $7=($6|0)!=0; //@line 47 "../../../src/gosh_ensemble.c"
  //@line 47 "../../../src/gosh_ensemble.c"
 if ($7) {
  var $15=$1; //@line 50 "../../../src/gosh_ensemble.c"
  var $16=(($15)|0); //@line 50 "../../../src/gosh_ensemble.c"
  var $17=HEAP32[(($16)>>2)]; //@line 50 "../../../src/gosh_ensemble.c"
  var $18=$17; //@line 50 "../../../src/gosh_ensemble.c"
  var $19=(($18+4)|0); //@line 50 "../../../src/gosh_ensemble.c"
  var $20=HEAP32[(($19)>>2)]; //@line 50 "../../../src/gosh_ensemble.c"
  $ptrNode=$20; //@line 50 "../../../src/gosh_ensemble.c"
 } else {
  var $9=$2; //@line 48 "../../../src/gosh_ensemble.c"
  var $10=(($9+32)|0); //@line 48 "../../../src/gosh_ensemble.c"
  var $11=HEAP32[(($10)>>2)]; //@line 48 "../../../src/gosh_ensemble.c"
  var $12=(($11)|0); //@line 48 "../../../src/gosh_ensemble.c"
  var $13=HEAP32[(($12)>>2)]; //@line 48 "../../../src/gosh_ensemble.c"
  $ptrNode=$13; //@line 48 "../../../src/gosh_ensemble.c"
   //@line 48 "../../../src/gosh_ensemble.c"
 }
 $ptrElement=0; //@line 52 "../../../src/gosh_ensemble.c"
 var $22=$ptrNode; //@line 54 "../../../src/gosh_ensemble.c"
 var $23=$22; //@line 54 "../../../src/gosh_ensemble.c"
 var $24=$1; //@line 54 "../../../src/gosh_ensemble.c"
 var $25=(($24)|0); //@line 54 "../../../src/gosh_ensemble.c"
 HEAP32[(($25)>>2)]=$23; //@line 54 "../../../src/gosh_ensemble.c"
 var $26=$ptrNode; //@line 55 "../../../src/gosh_ensemble.c"
 var $27=($26|0)!=0; //@line 55 "../../../src/gosh_ensemble.c"
  //@line 55 "../../../src/gosh_ensemble.c"
 if ($27) {
  var $29=$ptrNode; //@line 56 "../../../src/gosh_ensemble.c"
  var $30=(($29)|0); //@line 56 "../../../src/gosh_ensemble.c"
  $ptrElement=$30; //@line 56 "../../../src/gosh_ensemble.c"
   //@line 56 "../../../src/gosh_ensemble.c"
 }
 var $32=$3; //@line 58 "../../../src/gosh_ensemble.c"
 var $33=($32|0)!=0; //@line 58 "../../../src/gosh_ensemble.c"
  //@line 58 "../../../src/gosh_ensemble.c"
 if (!($33)) {
  var $43=$ptrElement; //@line 60 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $43; //@line 60 "../../../src/gosh_ensemble.c"
 }
 var $35=$ptrElement; //@line 58 "../../../src/gosh_ensemble.c"
 var $36=($35|0)!=0; //@line 58 "../../../src/gosh_ensemble.c"
  //@line 58 "../../../src/gosh_ensemble.c"
 if (!($36)) {
  var $43=$ptrElement; //@line 60 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $43; //@line 60 "../../../src/gosh_ensemble.c"
 }
 var $38=$3; //@line 59 "../../../src/gosh_ensemble.c"
 var $39=$ptrElement; //@line 59 "../../../src/gosh_ensemble.c"
 var $40=$38; //@line 59 "../../../src/gosh_ensemble.c"
 var $41=$39; //@line 59 "../../../src/gosh_ensemble.c"
 assert(4 % 1 === 0);HEAP8[($40)]=HEAP8[($41)];HEAP8[((($40)+(1))|0)]=HEAP8[((($41)+(1))|0)];HEAP8[((($40)+(2))|0)]=HEAP8[((($41)+(2))|0)];HEAP8[((($40)+(3))|0)]=HEAP8[((($41)+(3))|0)]; //@line 59 "../../../src/gosh_ensemble.c"
  //@line 59 "../../../src/gosh_ensemble.c"
 var $43=$ptrElement; //@line 60 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $43; //@line 60 "../../../src/gosh_ensemble.c"
}


function _creer_ensemble_position(){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $ptrContainer;
 var $1=_gosh_alloc_size(36); //@line 65 "../../../src/gosh_ensemble.c"
 var $2=$1; //@line 65 "../../../src/gosh_ensemble.c"
 $ptrContainer=$2; //@line 65 "../../../src/gosh_ensemble.c"
 var $3=_gosh_alloc_size(4); //@line 66 "../../../src/gosh_ensemble.c"
 var $4=$3; //@line 66 "../../../src/gosh_ensemble.c"
 var $5=$ptrContainer; //@line 66 "../../../src/gosh_ensemble.c"
 var $6=(($5+32)|0); //@line 66 "../../../src/gosh_ensemble.c"
 HEAP32[(($6)>>2)]=$4; //@line 66 "../../../src/gosh_ensemble.c"
 var $7=$ptrContainer; //@line 67 "../../../src/gosh_ensemble.c"
 var $8=(($7+32)|0); //@line 67 "../../../src/gosh_ensemble.c"
 var $9=HEAP32[(($8)>>2)]; //@line 67 "../../../src/gosh_ensemble.c"
 var $10=(($9)|0); //@line 67 "../../../src/gosh_ensemble.c"
 HEAP32[(($10)>>2)]=0; //@line 67 "../../../src/gosh_ensemble.c"
 var $11=$ptrContainer; //@line 69 "../../../src/gosh_ensemble.c"
 var $12=(($11)|0); //@line 69 "../../../src/gosh_ensemble.c"
 var $13=$12; //@line 69 "../../../src/gosh_ensemble.c"
 HEAP32[(($13)>>2)]=182; //@line 69 "../../../src/gosh_ensemble.c"
 var $14=$ptrContainer; //@line 70 "../../../src/gosh_ensemble.c"
 var $15=(($14+4)|0); //@line 70 "../../../src/gosh_ensemble.c"
 HEAP32[(($15)>>2)]=142; //@line 70 "../../../src/gosh_ensemble.c"
 var $16=$ptrContainer; //@line 71 "../../../src/gosh_ensemble.c"
 var $17=(($16+8)|0); //@line 71 "../../../src/gosh_ensemble.c"
 HEAP32[(($17)>>2)]=86; //@line 71 "../../../src/gosh_ensemble.c"
 var $18=$ptrContainer; //@line 72 "../../../src/gosh_ensemble.c"
 var $19=(($18+12)|0); //@line 72 "../../../src/gosh_ensemble.c"
 HEAP32[(($19)>>2)]=134; //@line 72 "../../../src/gosh_ensemble.c"
 var $20=$ptrContainer; //@line 73 "../../../src/gosh_ensemble.c"
 var $21=(($20+16)|0); //@line 73 "../../../src/gosh_ensemble.c"
 HEAP32[(($21)>>2)]=206; //@line 73 "../../../src/gosh_ensemble.c"
 var $22=$ptrContainer; //@line 74 "../../../src/gosh_ensemble.c"
 var $23=(($22+20)|0); //@line 74 "../../../src/gosh_ensemble.c"
 HEAP32[(($23)>>2)]=118; //@line 74 "../../../src/gosh_ensemble.c"
 var $24=$ptrContainer; //@line 75 "../../../src/gosh_ensemble.c"
 var $25=(($24+24)|0); //@line 75 "../../../src/gosh_ensemble.c"
 HEAP32[(($25)>>2)]=22; //@line 75 "../../../src/gosh_ensemble.c"
 var $26=$ptrContainer; //@line 76 "../../../src/gosh_ensemble.c"
 var $27=(($26+28)|0); //@line 76 "../../../src/gosh_ensemble.c"
 HEAP32[(($27)>>2)]=186; //@line 76 "../../../src/gosh_ensemble.c"
 var $28=$ptrContainer; //@line 78 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $28; //@line 78 "../../../src/gosh_ensemble.c"
}


function _ensemble_position_vide($ptrContainer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$ptrContainer;
 var $2=$1; //@line 99 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 99 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 99 "../../../src/gosh_ensemble.c"
 var $5=(($4)|0); //@line 99 "../../../src/gosh_ensemble.c"
 var $6=HEAP32[(($5)>>2)]; //@line 99 "../../../src/gosh_ensemble.c"
 var $7=($6|0)==0; //@line 99 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $7; //@line 99 "../../../src/gosh_ensemble.c"
}


function _ensemble_position_ajouter($ptrContainer,$element){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $element; $element=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($element)>>2)]=HEAP32[((tempParam)>>2)];
 var $1;
 var $ensemble;
 var $nouveau;
 $1=$ptrContainer;
 var $2=$1; //@line 104 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 104 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 104 "../../../src/gosh_ensemble.c"
 $ensemble=$4; //@line 104 "../../../src/gosh_ensemble.c"
 var $5=_gosh_alloc_size(8); //@line 105 "../../../src/gosh_ensemble.c"
 var $6=$5; //@line 105 "../../../src/gosh_ensemble.c"
 $nouveau=$6; //@line 105 "../../../src/gosh_ensemble.c"
 var $7=$nouveau; //@line 106 "../../../src/gosh_ensemble.c"
 var $8=(($7)|0); //@line 106 "../../../src/gosh_ensemble.c"
 var $9=$8; //@line 106 "../../../src/gosh_ensemble.c"
 var $10=$element; //@line 106 "../../../src/gosh_ensemble.c"
 assert(4 % 1 === 0);HEAP8[($9)]=HEAP8[($10)];HEAP8[((($9)+(1))|0)]=HEAP8[((($10)+(1))|0)];HEAP8[((($9)+(2))|0)]=HEAP8[((($10)+(2))|0)];HEAP8[((($9)+(3))|0)]=HEAP8[((($10)+(3))|0)]; //@line 106 "../../../src/gosh_ensemble.c"
 var $11=$ensemble; //@line 107 "../../../src/gosh_ensemble.c"
 var $12=(($11)|0); //@line 107 "../../../src/gosh_ensemble.c"
 var $13=HEAP32[(($12)>>2)]; //@line 107 "../../../src/gosh_ensemble.c"
 var $14=$nouveau; //@line 107 "../../../src/gosh_ensemble.c"
 var $15=(($14+4)|0); //@line 107 "../../../src/gosh_ensemble.c"
 HEAP32[(($15)>>2)]=$13; //@line 107 "../../../src/gosh_ensemble.c"
 var $16=$nouveau; //@line 108 "../../../src/gosh_ensemble.c"
 var $17=$ensemble; //@line 108 "../../../src/gosh_ensemble.c"
 var $18=(($17)|0); //@line 108 "../../../src/gosh_ensemble.c"
 HEAP32[(($18)>>2)]=$16; //@line 108 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return; //@line 109 "../../../src/gosh_ensemble.c"
}


function _ensemble_position_appartient($ptrContainer,$element){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $element; $element=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($element)>>2)]=HEAP32[((tempParam)>>2)];
 var $1;
 var $2;
 var $noeud;
 $2=$ptrContainer;
 var $3=$2; //@line 123 "../../../src/gosh_ensemble.c"
 var $4=(($3+32)|0); //@line 123 "../../../src/gosh_ensemble.c"
 var $5=HEAP32[(($4)>>2)]; //@line 123 "../../../src/gosh_ensemble.c"
 var $6=(($5)|0); //@line 123 "../../../src/gosh_ensemble.c"
 var $7=HEAP32[(($6)>>2)]; //@line 123 "../../../src/gosh_ensemble.c"
 $noeud=$7; //@line 123 "../../../src/gosh_ensemble.c"
  //@line 124 "../../../src/gosh_ensemble.c"
 while(1) {
  var $9=$noeud; //@line 124 "../../../src/gosh_ensemble.c"
  var $10=($9|0)!=0; //@line 124 "../../../src/gosh_ensemble.c"
   //@line 124 "../../../src/gosh_ensemble.c"
  if (!($10)) {
   label = 6;
   break;
  }
  var $12=$noeud; //@line 125 "../../../src/gosh_ensemble.c"
  var $13=(($12)|0); //@line 125 "../../../src/gosh_ensemble.c"
  var $14=$13; //@line 125 "../../../src/gosh_ensemble.c"
  var $15=$element; //@line 125 "../../../src/gosh_ensemble.c"
  var $16=_memcmp($14,$15,4); //@line 125 "../../../src/gosh_ensemble.c"
  var $17=($16|0)!=0; //@line 125 "../../../src/gosh_ensemble.c"
   //@line 125 "../../../src/gosh_ensemble.c"
  if (!($17)) {
   label = 4;
   break;
  }
  var $20=$noeud; //@line 128 "../../../src/gosh_ensemble.c"
  var $21=(($20+4)|0); //@line 128 "../../../src/gosh_ensemble.c"
  var $22=HEAP32[(($21)>>2)]; //@line 128 "../../../src/gosh_ensemble.c"
  $noeud=$22; //@line 128 "../../../src/gosh_ensemble.c"
   //@line 129 "../../../src/gosh_ensemble.c"
 }
 if (label == 4) {
  $1=1; //@line 126 "../../../src/gosh_ensemble.c"
   //@line 126 "../../../src/gosh_ensemble.c"
  var $25=$1; //@line 131 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $25; //@line 131 "../../../src/gosh_ensemble.c"
 }
 else if (label == 6) {
  $1=0; //@line 130 "../../../src/gosh_ensemble.c"
   //@line 130 "../../../src/gosh_ensemble.c"
  var $25=$1; //@line 131 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $25; //@line 131 "../../../src/gosh_ensemble.c"
 }
}


function _ensemble_position_supprimer_tete($agg_result,$ptrContainer){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $ensemble;
 var $pos=sp;
 var $vieux;
 $1=$ptrContainer;
 var $2=$1; //@line 113 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 113 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 113 "../../../src/gosh_ensemble.c"
 $ensemble=$4; //@line 113 "../../../src/gosh_ensemble.c"
 var $5=$ensemble; //@line 114 "../../../src/gosh_ensemble.c"
 var $6=(($5)|0); //@line 114 "../../../src/gosh_ensemble.c"
 var $7=HEAP32[(($6)>>2)]; //@line 114 "../../../src/gosh_ensemble.c"
 var $8=(($7)|0); //@line 114 "../../../src/gosh_ensemble.c"
 var $9=$pos; //@line 114 "../../../src/gosh_ensemble.c"
 var $10=$8; //@line 114 "../../../src/gosh_ensemble.c"
 assert(4 % 1 === 0);HEAP8[($9)]=HEAP8[($10)];HEAP8[((($9)+(1))|0)]=HEAP8[((($10)+(1))|0)];HEAP8[((($9)+(2))|0)]=HEAP8[((($10)+(2))|0)];HEAP8[((($9)+(3))|0)]=HEAP8[((($10)+(3))|0)]; //@line 114 "../../../src/gosh_ensemble.c"
 var $11=$ensemble; //@line 115 "../../../src/gosh_ensemble.c"
 var $12=(($11)|0); //@line 115 "../../../src/gosh_ensemble.c"
 var $13=HEAP32[(($12)>>2)]; //@line 115 "../../../src/gosh_ensemble.c"
 $vieux=$13; //@line 115 "../../../src/gosh_ensemble.c"
 var $14=$ensemble; //@line 116 "../../../src/gosh_ensemble.c"
 var $15=(($14)|0); //@line 116 "../../../src/gosh_ensemble.c"
 var $16=HEAP32[(($15)>>2)]; //@line 116 "../../../src/gosh_ensemble.c"
 var $17=(($16+4)|0); //@line 116 "../../../src/gosh_ensemble.c"
 var $18=HEAP32[(($17)>>2)]; //@line 116 "../../../src/gosh_ensemble.c"
 var $19=$ensemble; //@line 116 "../../../src/gosh_ensemble.c"
 var $20=(($19)|0); //@line 116 "../../../src/gosh_ensemble.c"
 HEAP32[(($20)>>2)]=$18; //@line 116 "../../../src/gosh_ensemble.c"
 var $21=$vieux; //@line 117 "../../../src/gosh_ensemble.c"
 var $22=$21; //@line 117 "../../../src/gosh_ensemble.c"
 _gosh_free($22); //@line 117 "../../../src/gosh_ensemble.c"
 var $23=$agg_result; //@line 118 "../../../src/gosh_ensemble.c"
 var $24=$pos; //@line 118 "../../../src/gosh_ensemble.c"
 assert(4 % 1 === 0);HEAP8[($23)]=HEAP8[($24)];HEAP8[((($23)+(1))|0)]=HEAP8[((($24)+(1))|0)];HEAP8[((($23)+(2))|0)]=HEAP8[((($24)+(2))|0)];HEAP8[((($23)+(3))|0)]=HEAP8[((($24)+(3))|0)]; //@line 118 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return; //@line 118 "../../../src/gosh_ensemble.c"
}


function _ensemble_position_nombre_elements($ptrContainer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $noeud;
 var $nb;
 $1=$ptrContainer;
 var $2=$1; //@line 135 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 135 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 135 "../../../src/gosh_ensemble.c"
 var $5=(($4)|0); //@line 135 "../../../src/gosh_ensemble.c"
 var $6=HEAP32[(($5)>>2)]; //@line 135 "../../../src/gosh_ensemble.c"
 $noeud=$6; //@line 135 "../../../src/gosh_ensemble.c"
 $nb=0; //@line 136 "../../../src/gosh_ensemble.c"
  //@line 137 "../../../src/gosh_ensemble.c"
 while(1) {
  var $8=$noeud; //@line 137 "../../../src/gosh_ensemble.c"
  var $9=($8|0)!=0; //@line 137 "../../../src/gosh_ensemble.c"
   //@line 137 "../../../src/gosh_ensemble.c"
  if (!($9)) {
   break;
  }
  var $11=$nb; //@line 138 "../../../src/gosh_ensemble.c"
  var $12=((($11)+(1))|0); //@line 138 "../../../src/gosh_ensemble.c"
  $nb=$12; //@line 138 "../../../src/gosh_ensemble.c"
  var $13=$noeud; //@line 139 "../../../src/gosh_ensemble.c"
  var $14=(($13+4)|0); //@line 139 "../../../src/gosh_ensemble.c"
  var $15=HEAP32[(($14)>>2)]; //@line 139 "../../../src/gosh_ensemble.c"
  $noeud=$15; //@line 139 "../../../src/gosh_ensemble.c"
   //@line 140 "../../../src/gosh_ensemble.c"
 }
 var $17=$nb; //@line 141 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $17; //@line 141 "../../../src/gosh_ensemble.c"
}


function _ensemble_position_get($agg_result,$ptrContainer,$n){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $noeud;
 var $nb;
 $1=$ptrContainer;
 $2=$n;
 var $3=$1; //@line 146 "../../../src/gosh_ensemble.c"
 var $4=(($3+32)|0); //@line 146 "../../../src/gosh_ensemble.c"
 var $5=HEAP32[(($4)>>2)]; //@line 146 "../../../src/gosh_ensemble.c"
 var $6=(($5)|0); //@line 146 "../../../src/gosh_ensemble.c"
 var $7=HEAP32[(($6)>>2)]; //@line 146 "../../../src/gosh_ensemble.c"
 $noeud=$7; //@line 146 "../../../src/gosh_ensemble.c"
 $nb=0; //@line 147 "../../../src/gosh_ensemble.c"
  //@line 148 "../../../src/gosh_ensemble.c"
 while(1) {
  var $9=$noeud; //@line 148 "../../../src/gosh_ensemble.c"
  var $10=($9|0)!=0; //@line 148 "../../../src/gosh_ensemble.c"
   //@line 148 "../../../src/gosh_ensemble.c"
  if ($10) {
   var $12=$nb; //@line 148 "../../../src/gosh_ensemble.c"
   var $13=$2; //@line 148 "../../../src/gosh_ensemble.c"
   var $14=($12|0)<($13|0); //@line 148 "../../../src/gosh_ensemble.c"
   var $16=$14;
  } else {
   var $16=0;
  }
  var $16;
  if (!($16)) {
   break;
  }
  var $18=$nb; //@line 149 "../../../src/gosh_ensemble.c"
  var $19=((($18)+(1))|0); //@line 149 "../../../src/gosh_ensemble.c"
  $nb=$19; //@line 149 "../../../src/gosh_ensemble.c"
  var $20=$noeud; //@line 150 "../../../src/gosh_ensemble.c"
  var $21=(($20+4)|0); //@line 150 "../../../src/gosh_ensemble.c"
  var $22=HEAP32[(($21)>>2)]; //@line 150 "../../../src/gosh_ensemble.c"
  $noeud=$22; //@line 150 "../../../src/gosh_ensemble.c"
   //@line 151 "../../../src/gosh_ensemble.c"
 }
 var $24=$noeud; //@line 152 "../../../src/gosh_ensemble.c"
 var $25=($24|0)!=0; //@line 152 "../../../src/gosh_ensemble.c"
  //@line 152 "../../../src/gosh_ensemble.c"
 if ($25) {
  var $29=1;
 } else {
  ___assert_fail(184,912,152,1400); //@line 152 "../../../src/gosh_ensemble.c"
  throw "Reached an unreachable!"; //@line 152 "../../../src/gosh_ensemble.c"
   //@line 152 "../../../src/gosh_ensemble.c"
 }
 var $29;
 var $30=($29&1); //@line 152 "../../../src/gosh_ensemble.c"
 var $31=$noeud; //@line 153 "../../../src/gosh_ensemble.c"
 var $32=(($31)|0); //@line 153 "../../../src/gosh_ensemble.c"
 var $33=$agg_result; //@line 153 "../../../src/gosh_ensemble.c"
 var $34=$32; //@line 153 "../../../src/gosh_ensemble.c"
 assert(4 % 1 === 0);HEAP8[($33)]=HEAP8[($34)];HEAP8[((($33)+(1))|0)]=HEAP8[((($34)+(1))|0)];HEAP8[((($33)+(2))|0)]=HEAP8[((($34)+(2))|0)];HEAP8[((($33)+(3))|0)]=HEAP8[((($34)+(3))|0)]; //@line 153 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return; //@line 153 "../../../src/gosh_ensemble.c"
}


function _detruire_ensemble_position($ptrContainer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $ensemble;
 var $noeud;
 var $suivant;
 $1=$ptrContainer;
 var $2=$1; //@line 83 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 83 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 83 "../../../src/gosh_ensemble.c"
 $ensemble=$4; //@line 83 "../../../src/gosh_ensemble.c"
 var $5=$ensemble; //@line 84 "../../../src/gosh_ensemble.c"
 var $6=(($5)|0); //@line 84 "../../../src/gosh_ensemble.c"
 var $7=HEAP32[(($6)>>2)]; //@line 84 "../../../src/gosh_ensemble.c"
 $noeud=$7; //@line 84 "../../../src/gosh_ensemble.c"
  //@line 85 "../../../src/gosh_ensemble.c"
 while(1) {
  var $9=$noeud; //@line 85 "../../../src/gosh_ensemble.c"
  var $10=($9|0)!=0; //@line 85 "../../../src/gosh_ensemble.c"
   //@line 85 "../../../src/gosh_ensemble.c"
  if (!($10)) {
   break;
  }
  var $12=$noeud; //@line 86 "../../../src/gosh_ensemble.c"
  var $13=(($12+4)|0); //@line 86 "../../../src/gosh_ensemble.c"
  var $14=HEAP32[(($13)>>2)]; //@line 86 "../../../src/gosh_ensemble.c"
  $suivant=$14; //@line 86 "../../../src/gosh_ensemble.c"
  var $15=$noeud; //@line 90 "../../../src/gosh_ensemble.c"
  var $16=$15; //@line 90 "../../../src/gosh_ensemble.c"
  _gosh_free($16); //@line 90 "../../../src/gosh_ensemble.c"
  var $17=$suivant; //@line 91 "../../../src/gosh_ensemble.c"
  $noeud=$17; //@line 91 "../../../src/gosh_ensemble.c"
   //@line 92 "../../../src/gosh_ensemble.c"
 }
 var $19=$ensemble; //@line 93 "../../../src/gosh_ensemble.c"
 var $20=$19; //@line 93 "../../../src/gosh_ensemble.c"
 _gosh_free($20); //@line 93 "../../../src/gosh_ensemble.c"
 var $21=$1; //@line 94 "../../../src/gosh_ensemble.c"
 var $22=$21; //@line 94 "../../../src/gosh_ensemble.c"
 _gosh_free($22); //@line 94 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return; //@line 95 "../../../src/gosh_ensemble.c"
}


function _determiner_libertes($plateau,$chaine){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+40)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $libertes;
 var $pos=sp;
 var $it=(sp)+(8);
 var $a_tester=(sp)+(16);
 var $i;
 var $p=(sp)+(32);
 $2=$plateau;
 $3=$chaine;
 var $4=$3; //@line 30 "../../../src/go/libertes.c"
 var $5=($4|0)!=0; //@line 30 "../../../src/go/libertes.c"
  //@line 30 "../../../src/go/libertes.c"
 if (!($5)) {
  $1=0; //@line 31 "../../../src/go/libertes.c"
   //@line 31 "../../../src/go/libertes.c"
  var $54=$1; //@line 48 "../../../src/go/libertes.c"
  STACKTOP=sp;return $54; //@line 48 "../../../src/go/libertes.c"
 }
 var $8=_creer_ensemble_position(); //@line 33 "../../../src/go/libertes.c"
 $libertes=$8; //@line 33 "../../../src/go/libertes.c"
 var $9=$3; //@line 36 "../../../src/go/libertes.c"
 var $10=_ensemble_colore_positions($9); //@line 36 "../../../src/go/libertes.c"
 var $11=(($10+4)|0); //@line 36 "../../../src/go/libertes.c"
 var $12=HEAP32[(($11)>>2)]; //@line 36 "../../../src/go/libertes.c"
 FUNCTION_TABLE[$12]($it); //@line 36 "../../../src/go/libertes.c"
  //@line 36 "../../../src/go/libertes.c"
 while(1) {
  var $14=$3; //@line 36 "../../../src/go/libertes.c"
  var $15=_ensemble_colore_positions($14); //@line 36 "../../../src/go/libertes.c"
  var $16=(($15)|0); //@line 36 "../../../src/go/libertes.c"
  var $17=HEAP32[(($16)>>2)]; //@line 36 "../../../src/go/libertes.c"
  var $18=$3; //@line 36 "../../../src/go/libertes.c"
  var $19=_ensemble_colore_positions($18); //@line 36 "../../../src/go/libertes.c"
  var $20=FUNCTION_TABLE[$17]($it,$19,$pos); //@line 36 "../../../src/go/libertes.c"
  var $21=($20|0)!=0; //@line 36 "../../../src/go/libertes.c"
   //@line 36 "../../../src/go/libertes.c"
  if (!($21)) {
   break;
  }
  var $23=(($a_tester)|0); //@line 37 "../../../src/go/libertes.c"
  _position_gauche($23,$pos); //@line 37 "../../../src/go/libertes.c"
  var $24=(($23+4)|0); //@line 37 "../../../src/go/libertes.c"
  _position_droite($24,$pos); //@line 37 "../../../src/go/libertes.c"
  var $25=(($24+4)|0); //@line 37 "../../../src/go/libertes.c"
  _position_haut($25,$pos); //@line 37 "../../../src/go/libertes.c"
  var $26=(($25+4)|0); //@line 37 "../../../src/go/libertes.c"
  _position_bas($26,$pos); //@line 37 "../../../src/go/libertes.c"
  $i=0; //@line 38 "../../../src/go/libertes.c"
   //@line 38 "../../../src/go/libertes.c"
  while(1) {
   var $28=$i; //@line 38 "../../../src/go/libertes.c"
   var $29=($28|0)<4; //@line 38 "../../../src/go/libertes.c"
    //@line 38 "../../../src/go/libertes.c"
   if (!($29)) {
    break;
   }
   var $31=$i; //@line 39 "../../../src/go/libertes.c"
   var $32=(($a_tester+($31<<2))|0); //@line 39 "../../../src/go/libertes.c"
   var $33=$p; //@line 39 "../../../src/go/libertes.c"
   var $34=$32; //@line 39 "../../../src/go/libertes.c"
   assert(4 % 1 === 0);HEAP8[($33)]=HEAP8[($34)];HEAP8[((($33)+(1))|0)]=HEAP8[((($34)+(1))|0)];HEAP8[((($33)+(2))|0)]=HEAP8[((($34)+(2))|0)];HEAP8[((($33)+(3))|0)]=HEAP8[((($34)+(3))|0)]; //@line 39 "../../../src/go/libertes.c"
   var $35=_position_est_valide($p); //@line 40 "../../../src/go/libertes.c"
    //@line 40 "../../../src/go/libertes.c"
   do {
    if ($35) {
     var $37=$2; //@line 40 "../../../src/go/libertes.c"
     var $38=_plateau_get_at($37,$p); //@line 40 "../../../src/go/libertes.c"
     var $39=($38|0)==0; //@line 40 "../../../src/go/libertes.c"
      //@line 40 "../../../src/go/libertes.c"
     if (!($39)) {
      break;
     }
     var $41=$libertes; //@line 41 "../../../src/go/libertes.c"
     var $42=_ensemble_position_appartient($41,$p); //@line 41 "../../../src/go/libertes.c"
      //@line 41 "../../../src/go/libertes.c"
     if (!($42)) {
      var $44=$libertes; //@line 42 "../../../src/go/libertes.c"
      _ensemble_position_ajouter($44,$p); //@line 42 "../../../src/go/libertes.c"
       //@line 43 "../../../src/go/libertes.c"
     }
      //@line 44 "../../../src/go/libertes.c"
    }
   } while(0);
    //@line 45 "../../../src/go/libertes.c"
   var $48=$i; //@line 38 "../../../src/go/libertes.c"
   var $49=((($48)+(1))|0); //@line 38 "../../../src/go/libertes.c"
   $i=$49; //@line 38 "../../../src/go/libertes.c"
    //@line 38 "../../../src/go/libertes.c"
  }
   //@line 46 "../../../src/go/libertes.c"
 }
 var $52=$libertes; //@line 47 "../../../src/go/libertes.c"
 $1=$52; //@line 47 "../../../src/go/libertes.c"
  //@line 47 "../../../src/go/libertes.c"
 var $54=$1; //@line 48 "../../../src/go/libertes.c"
 STACKTOP=sp;return $54; //@line 48 "../../../src/go/libertes.c"
}


function _charger_ordinateur($name){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $dlptr;
 var $initialiser;
 var $ordidata;
 var $jouer;
 var $remplacer_plateau;
 var $notification_coup;
 var $ordi;
 $2=$name;
 $dlptr=0; //@line 55 "../../../src/go/ordinateur.c"
 var $3=_dlopen(0,1); //@line 58 "../../../src/go/ordinateur.c"
 $dlptr=$3; //@line 58 "../../../src/go/ordinateur.c"
 var $4=$dlptr; //@line 84 "../../../src/go/ordinateur.c"
 var $5=_recuperer_fonction($4,112,1); //@line 84 "../../../src/go/ordinateur.c"
 var $6=$5; //@line 84 "../../../src/go/ordinateur.c"
 $initialiser=$6; //@line 84 "../../../src/go/ordinateur.c"
 var $7=$initialiser; //@line 85 "../../../src/go/ordinateur.c"
 var $8=($7|0)==0; //@line 85 "../../../src/go/ordinateur.c"
  //@line 85 "../../../src/go/ordinateur.c"
 if ($8) {
  $1=0; //@line 86 "../../../src/go/ordinateur.c"
   //@line 86 "../../../src/go/ordinateur.c"
  var $61=$1; //@line 110 "../../../src/go/ordinateur.c"
  STACKTOP=sp;return $61; //@line 110 "../../../src/go/ordinateur.c"
 }
 var $11=$initialiser; //@line 88 "../../../src/go/ordinateur.c"
 var $12=$11; //@line 88 "../../../src/go/ordinateur.c"
 var $13=FUNCTION_TABLE[$12](); //@line 88 "../../../src/go/ordinateur.c"
 $ordidata=$13; //@line 88 "../../../src/go/ordinateur.c"
 var $14=$ordidata; //@line 89 "../../../src/go/ordinateur.c"
 var $15=($14|0)==0; //@line 89 "../../../src/go/ordinateur.c"
  //@line 89 "../../../src/go/ordinateur.c"
 if ($15) {
  $1=0; //@line 90 "../../../src/go/ordinateur.c"
   //@line 90 "../../../src/go/ordinateur.c"
  var $61=$1; //@line 110 "../../../src/go/ordinateur.c"
  STACKTOP=sp;return $61; //@line 110 "../../../src/go/ordinateur.c"
 }
 var $18=$dlptr; //@line 93 "../../../src/go/ordinateur.c"
 var $19=_recuperer_fonction($18,824,1); //@line 93 "../../../src/go/ordinateur.c"
 var $20=$19; //@line 93 "../../../src/go/ordinateur.c"
 $jouer=$20; //@line 93 "../../../src/go/ordinateur.c"
 var $21=$jouer; //@line 94 "../../../src/go/ordinateur.c"
 var $22=($21|0)==0; //@line 94 "../../../src/go/ordinateur.c"
  //@line 94 "../../../src/go/ordinateur.c"
 if ($22) {
  $1=0; //@line 95 "../../../src/go/ordinateur.c"
   //@line 95 "../../../src/go/ordinateur.c"
  var $61=$1; //@line 110 "../../../src/go/ordinateur.c"
  STACKTOP=sp;return $61; //@line 110 "../../../src/go/ordinateur.c"
 } else {
  var $25=$dlptr; //@line 98 "../../../src/go/ordinateur.c"
  var $26=_recuperer_fonction($25,600,0); //@line 98 "../../../src/go/ordinateur.c"
  var $27=$26; //@line 98 "../../../src/go/ordinateur.c"
  $remplacer_plateau=$27; //@line 98 "../../../src/go/ordinateur.c"
  var $28=$dlptr; //@line 99 "../../../src/go/ordinateur.c"
  var $29=_recuperer_fonction($28,432,0); //@line 99 "../../../src/go/ordinateur.c"
  var $30=$29; //@line 99 "../../../src/go/ordinateur.c"
  $notification_coup=$30; //@line 99 "../../../src/go/ordinateur.c"
  var $31=_gosh_alloc_size(24); //@line 101 "../../../src/go/ordinateur.c"
  var $32=$31; //@line 101 "../../../src/go/ordinateur.c"
  $ordi=$32; //@line 101 "../../../src/go/ordinateur.c"
  var $33=$dlptr; //@line 102 "../../../src/go/ordinateur.c"
  var $34=$ordi; //@line 102 "../../../src/go/ordinateur.c"
  var $35=(($34+4)|0); //@line 102 "../../../src/go/ordinateur.c"
  HEAP32[(($35)>>2)]=$33; //@line 102 "../../../src/go/ordinateur.c"
  var $36=$jouer; //@line 103 "../../../src/go/ordinateur.c"
  var $37=$ordi; //@line 103 "../../../src/go/ordinateur.c"
  var $38=(($37+8)|0); //@line 103 "../../../src/go/ordinateur.c"
  HEAP32[(($38)>>2)]=$36; //@line 103 "../../../src/go/ordinateur.c"
  var $39=$ordidata; //@line 104 "../../../src/go/ordinateur.c"
  var $40=$ordi; //@line 104 "../../../src/go/ordinateur.c"
  var $41=(($40+20)|0); //@line 104 "../../../src/go/ordinateur.c"
  HEAP32[(($41)>>2)]=$39; //@line 104 "../../../src/go/ordinateur.c"
  var $42=$remplacer_plateau; //@line 105 "../../../src/go/ordinateur.c"
  var $43=$ordi; //@line 105 "../../../src/go/ordinateur.c"
  var $44=(($43+12)|0); //@line 105 "../../../src/go/ordinateur.c"
  HEAP32[(($44)>>2)]=$42; //@line 105 "../../../src/go/ordinateur.c"
  var $45=$notification_coup; //@line 106 "../../../src/go/ordinateur.c"
  var $46=$ordi; //@line 106 "../../../src/go/ordinateur.c"
  var $47=(($46+16)|0); //@line 106 "../../../src/go/ordinateur.c"
  HEAP32[(($47)>>2)]=$45; //@line 106 "../../../src/go/ordinateur.c"
  var $48=$2; //@line 107 "../../../src/go/ordinateur.c"
  var $49=_strlen($48); //@line 107 "../../../src/go/ordinateur.c"
  var $50=((($49)+(1))|0); //@line 107 "../../../src/go/ordinateur.c"
  var $51=_malloc($50); //@line 107 "../../../src/go/ordinateur.c"
  var $52=$ordi; //@line 107 "../../../src/go/ordinateur.c"
  var $53=(($52)|0); //@line 107 "../../../src/go/ordinateur.c"
  HEAP32[(($53)>>2)]=$51; //@line 107 "../../../src/go/ordinateur.c"
  var $54=$ordi; //@line 108 "../../../src/go/ordinateur.c"
  var $55=(($54)|0); //@line 108 "../../../src/go/ordinateur.c"
  var $56=HEAP32[(($55)>>2)]; //@line 108 "../../../src/go/ordinateur.c"
  var $57=$2; //@line 108 "../../../src/go/ordinateur.c"
  var $58=_strcpy($56,$57); //@line 108 "../../../src/go/ordinateur.c"
  var $59=$ordi; //@line 109 "../../../src/go/ordinateur.c"
  $1=$59; //@line 109 "../../../src/go/ordinateur.c"
   //@line 109 "../../../src/go/ordinateur.c"
  var $61=$1; //@line 110 "../../../src/go/ordinateur.c"
  STACKTOP=sp;return $61; //@line 110 "../../../src/go/ordinateur.c"
 }
}


function _recuperer_fonction($dlptr,$nom,$importante){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $func;
 $1=$dlptr;
 $2=$nom;
 var $4=($importante&1);
 $3=$4;
 var $5=$1; //@line 45 "../../../src/go/ordinateur.c"
 var $6=$2; //@line 45 "../../../src/go/ordinateur.c"
 var $7=_dlsym($5,$6); //@line 45 "../../../src/go/ordinateur.c"
 $func=$7; //@line 45 "../../../src/go/ordinateur.c"
 var $8=$func; //@line 46 "../../../src/go/ordinateur.c"
 var $9=($8|0)==0; //@line 46 "../../../src/go/ordinateur.c"
  //@line 46 "../../../src/go/ordinateur.c"
 do {
  if ($9) {
   var $11=$3; //@line 46 "../../../src/go/ordinateur.c"
   var $12=(($11)&1); //@line 46 "../../../src/go/ordinateur.c"
    //@line 46 "../../../src/go/ordinateur.c"
   if (!($12)) {
    break;
   }
   var $14=$2; //@line 47 "../../../src/go/ordinateur.c"
   var $15=_printf(296,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$14,tempVarArgs)); STACKTOP=tempVarArgs; //@line 47 "../../../src/go/ordinateur.c"
   var $16=$1; //@line 48 "../../../src/go/ordinateur.c"
   var $17=_dlclose($16); //@line 48 "../../../src/go/ordinateur.c"
    //@line 49 "../../../src/go/ordinateur.c"
  }
 } while(0);
 var $19=$func; //@line 50 "../../../src/go/ordinateur.c"
 STACKTOP=sp;return $19; //@line 50 "../../../src/go/ordinateur.c"
}


function _ordinateur_remplacer_plateau($ordi,$plateau){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 $1=$ordi;
 $2=$plateau;
 var $3=$1; //@line 114 "../../../src/go/ordinateur.c"
 var $4=(($3+12)|0); //@line 114 "../../../src/go/ordinateur.c"
 var $5=HEAP32[(($4)>>2)]; //@line 114 "../../../src/go/ordinateur.c"
 var $6=($5|0)!=0; //@line 114 "../../../src/go/ordinateur.c"
  //@line 114 "../../../src/go/ordinateur.c"
 if (!($6)) {
  STACKTOP=sp;return; //@line 117 "../../../src/go/ordinateur.c"
 }
 var $8=$1; //@line 115 "../../../src/go/ordinateur.c"
 var $9=(($8+12)|0); //@line 115 "../../../src/go/ordinateur.c"
 var $10=HEAP32[(($9)>>2)]; //@line 115 "../../../src/go/ordinateur.c"
 var $11=$1; //@line 115 "../../../src/go/ordinateur.c"
 var $12=(($11+20)|0); //@line 115 "../../../src/go/ordinateur.c"
 var $13=HEAP32[(($12)>>2)]; //@line 115 "../../../src/go/ordinateur.c"
 var $14=$2; //@line 115 "../../../src/go/ordinateur.c"
 FUNCTION_TABLE[$10]($13,$14); //@line 115 "../../../src/go/ordinateur.c"
  //@line 116 "../../../src/go/ordinateur.c"
 STACKTOP=sp;return; //@line 117 "../../../src/go/ordinateur.c"
}


function _ordinateur_notifier_coup($ordi,$partie,$couleur,$coup){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $coup; $coup=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($coup)>>2)]=HEAP32[((tempParam)>>2)];
 var $1;
 var $2;
 var $3;
 $1=$ordi;
 $2=$partie;
 $3=$couleur;
 var $4=$1; //@line 121 "../../../src/go/ordinateur.c"
 var $5=(($4+16)|0); //@line 121 "../../../src/go/ordinateur.c"
 var $6=HEAP32[(($5)>>2)]; //@line 121 "../../../src/go/ordinateur.c"
 var $7=($6|0)!=0; //@line 121 "../../../src/go/ordinateur.c"
  //@line 121 "../../../src/go/ordinateur.c"
 if (!($7)) {
  STACKTOP=sp;return; //@line 124 "../../../src/go/ordinateur.c"
 }
 var $9=$1; //@line 122 "../../../src/go/ordinateur.c"
 var $10=(($9+16)|0); //@line 122 "../../../src/go/ordinateur.c"
 var $11=HEAP32[(($10)>>2)]; //@line 122 "../../../src/go/ordinateur.c"
 var $12=$1; //@line 122 "../../../src/go/ordinateur.c"
 var $13=(($12+20)|0); //@line 122 "../../../src/go/ordinateur.c"
 var $14=HEAP32[(($13)>>2)]; //@line 122 "../../../src/go/ordinateur.c"
 var $15=$2; //@line 122 "../../../src/go/ordinateur.c"
 var $16=$3; //@line 122 "../../../src/go/ordinateur.c"
 FUNCTION_TABLE[$11]($14,$15,$16,$coup); //@line 122 "../../../src/go/ordinateur.c"
  //@line 123 "../../../src/go/ordinateur.c"
 STACKTOP=sp;return; //@line 124 "../../../src/go/ordinateur.c"
}


function _ordinateur_jouer_coup($ordi,$partie,$couleur){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 $1=$ordi;
 $2=$partie;
 $3=$couleur;
 var $4=$1; //@line 128 "../../../src/go/ordinateur.c"
 var $5=(($4+8)|0); //@line 128 "../../../src/go/ordinateur.c"
 var $6=HEAP32[(($5)>>2)]; //@line 128 "../../../src/go/ordinateur.c"
 var $7=$1; //@line 128 "../../../src/go/ordinateur.c"
 var $8=(($7+20)|0); //@line 128 "../../../src/go/ordinateur.c"
 var $9=HEAP32[(($8)>>2)]; //@line 128 "../../../src/go/ordinateur.c"
 var $10=$2; //@line 128 "../../../src/go/ordinateur.c"
 var $11=$3; //@line 128 "../../../src/go/ordinateur.c"
 FUNCTION_TABLE[$6]($9,$10,$11); //@line 128 "../../../src/go/ordinateur.c"
 STACKTOP=sp;return; //@line 129 "../../../src/go/ordinateur.c"
}


function _creer_partie(){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $partie;
 var $1=_gosh_alloc_size(64); //@line 35 "../../../src/go/partie.c"
 var $2=$1; //@line 35 "../../../src/go/partie.c"
 $partie=$2; //@line 35 "../../../src/go/partie.c"
 var $3=$partie; //@line 36 "../../../src/go/partie.c"
 var $4=(($3+48)|0); //@line 36 "../../../src/go/partie.c"
 HEAP8[($4)]=0; //@line 36 "../../../src/go/partie.c"
 var $5=_creer_ensemble_plateau(); //@line 37 "../../../src/go/partie.c"
 var $6=$partie; //@line 37 "../../../src/go/partie.c"
 var $7=(($6+56)|0); //@line 37 "../../../src/go/partie.c"
 HEAP32[(($7)>>2)]=$5; //@line 37 "../../../src/go/partie.c"
 var $8=_creer_ensemble_plateau(); //@line 38 "../../../src/go/partie.c"
 var $9=$partie; //@line 38 "../../../src/go/partie.c"
 var $10=(($9+60)|0); //@line 38 "../../../src/go/partie.c"
 HEAP32[(($10)>>2)]=$8; //@line 38 "../../../src/go/partie.c"
 var $11=$partie; //@line 39 "../../../src/go/partie.c"
 var $12=(($11+44)|0); //@line 39 "../../../src/go/partie.c"
 HEAP32[(($12)>>2)]=0; //@line 39 "../../../src/go/partie.c"
 var $13=$partie; //@line 40 "../../../src/go/partie.c"
 var $14=(($13+49)|0); //@line 40 "../../../src/go/partie.c"
 HEAP8[($14)]=0; //@line 40 "../../../src/go/partie.c"
 var $15=$partie; //@line 41 "../../../src/go/partie.c"
 STACKTOP=sp;return $15; //@line 41 "../../../src/go/partie.c"
}


function _detruire_partie($partie){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$partie;
 var $2=$1; //@line 46 "../../../src/go/partie.c"
 var $3=(($2+56)|0); //@line 46 "../../../src/go/partie.c"
 var $4=HEAP32[(($3)>>2)]; //@line 46 "../../../src/go/partie.c"
 var $5=($4|0)!=0; //@line 46 "../../../src/go/partie.c"
  //@line 46 "../../../src/go/partie.c"
 if ($5) {
  var $7=$1; //@line 47 "../../../src/go/partie.c"
  var $8=(($7+56)|0); //@line 47 "../../../src/go/partie.c"
  var $9=HEAP32[(($8)>>2)]; //@line 47 "../../../src/go/partie.c"
  _detruire_ensemble_plateau($9); //@line 47 "../../../src/go/partie.c"
   //@line 47 "../../../src/go/partie.c"
 }
 var $11=$1; //@line 48 "../../../src/go/partie.c"
 var $12=(($11+60)|0); //@line 48 "../../../src/go/partie.c"
 var $13=HEAP32[(($12)>>2)]; //@line 48 "../../../src/go/partie.c"
 var $14=($13|0)!=0; //@line 48 "../../../src/go/partie.c"
  //@line 48 "../../../src/go/partie.c"
 if ($14) {
  var $16=$1; //@line 49 "../../../src/go/partie.c"
  var $17=(($16+60)|0); //@line 49 "../../../src/go/partie.c"
  var $18=HEAP32[(($17)>>2)]; //@line 49 "../../../src/go/partie.c"
  _detruire_ensemble_plateau($18); //@line 49 "../../../src/go/partie.c"
   //@line 49 "../../../src/go/partie.c"
 }
 var $20=$1; //@line 50 "../../../src/go/partie.c"
 var $21=(($20)|0); //@line 50 "../../../src/go/partie.c"
 var $22=HEAP32[(($21)>>2)]; //@line 50 "../../../src/go/partie.c"
 var $23=($22|0)!=0; //@line 50 "../../../src/go/partie.c"
  //@line 50 "../../../src/go/partie.c"
 if (!($23)) {
  var $29=$1; //@line 52 "../../../src/go/partie.c"
  var $30=$29; //@line 52 "../../../src/go/partie.c"
  _gosh_free($30); //@line 52 "../../../src/go/partie.c"
  STACKTOP=sp;return; //@line 53 "../../../src/go/partie.c"
 }
 var $25=$1; //@line 51 "../../../src/go/partie.c"
 var $26=(($25)|0); //@line 51 "../../../src/go/partie.c"
 var $27=HEAP32[(($26)>>2)]; //@line 51 "../../../src/go/partie.c"
 _detruire_plateau($27); //@line 51 "../../../src/go/partie.c"
  //@line 51 "../../../src/go/partie.c"
 var $29=$1; //@line 52 "../../../src/go/partie.c"
 var $30=$29; //@line 52 "../../../src/go/partie.c"
 _gosh_free($30); //@line 52 "../../../src/go/partie.c"
 STACKTOP=sp;return; //@line 53 "../../../src/go/partie.c"
}


function _question_coherante($idQuestion,$partie){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 $2=$idQuestion;
 $3=$partie;
 var $4=$2; //@line 57 "../../../src/go/partie.c"
 do {
  if (($4|0)==2) {
   var $15=$3; //@line 64 "../../../src/go/partie.c"
   var $16=(($15+4)|0); //@line 64 "../../../src/go/partie.c"
   var $17=(($16+20)|0); //@line 64 "../../../src/go/partie.c"
   var $18=(($17)|0); //@line 64 "../../../src/go/partie.c"
   var $19=HEAP32[(($18)>>2)]; //@line 64 "../../../src/go/partie.c"
   var $20=($19|0)!=1; //@line 64 "../../../src/go/partie.c"
    //@line 64 "../../../src/go/partie.c"
   if ($20) {
    $1=0; //@line 65 "../../../src/go/partie.c"
     //@line 65 "../../../src/go/partie.c"
    break;
   } else {
     //@line 66 "../../../src/go/partie.c"
    label = 9;
    break;
   }
  } else if (($4|0)==5) {
   var $6=$3; //@line 59 "../../../src/go/partie.c"
   var $7=(($6+4)|0); //@line 59 "../../../src/go/partie.c"
   var $8=(($7)|0); //@line 59 "../../../src/go/partie.c"
   var $9=(($8)|0); //@line 59 "../../../src/go/partie.c"
   var $10=HEAP32[(($9)>>2)]; //@line 59 "../../../src/go/partie.c"
   var $11=($10|0)!=1; //@line 59 "../../../src/go/partie.c"
    //@line 59 "../../../src/go/partie.c"
   if ($11) {
    $1=0; //@line 60 "../../../src/go/partie.c"
     //@line 60 "../../../src/go/partie.c"
    break;
   } else {
     //@line 61 "../../../src/go/partie.c"
    label = 9;
    break;
   }
  } else {
   $1=1; //@line 69 "../../../src/go/partie.c"
    //@line 69 "../../../src/go/partie.c"
  }
 } while(0);
 if (label == 9) {
  $1=1; //@line 71 "../../../src/go/partie.c"
   //@line 71 "../../../src/go/partie.c"
 }
 var $26=$1; //@line 72 "../../../src/go/partie.c"
 STACKTOP=sp;return $26; //@line 72 "../../../src/go/partie.c"
}


function _initialisation_partie($partie,$fonctionQuestions,$userdata){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $idQuestion;
 $1=$partie;
 $2=$fonctionQuestions;
 $3=$userdata;
 $idQuestion=0; //@line 76 "../../../src/go/partie.c"
  //@line 78 "../../../src/go/partie.c"
 while(1) {
  var $5=$idQuestion; //@line 78 "../../../src/go/partie.c"
  var $6=($5|0)<8; //@line 78 "../../../src/go/partie.c"
   //@line 78 "../../../src/go/partie.c"
  if (!($6)) {
   break;
  }
  var $8=$idQuestion; //@line 79 "../../../src/go/partie.c"
  var $9=$1; //@line 79 "../../../src/go/partie.c"
  var $10=_question_coherante($8,$9); //@line 79 "../../../src/go/partie.c"
   //@line 79 "../../../src/go/partie.c"
  if ($10) {
   var $12=$2; //@line 79 "../../../src/go/partie.c"
   var $13=$idQuestion; //@line 79 "../../../src/go/partie.c"
   var $14=$1; //@line 79 "../../../src/go/partie.c"
   var $15=$3; //@line 79 "../../../src/go/partie.c"
   var $16=FUNCTION_TABLE[$12]($13,$14,$15); //@line 79 "../../../src/go/partie.c"
    //@line 79 "../../../src/go/partie.c"
   if (!($16)) {
    label = 5;
    break;
   }
  }
  var $19=$idQuestion; //@line 82 "../../../src/go/partie.c"
  var $20=((($19)+(1))|0); //@line 82 "../../../src/go/partie.c"
  $idQuestion=$20; //@line 82 "../../../src/go/partie.c"
   //@line 83 "../../../src/go/partie.c"
 }
 if (label == 5) {
   //@line 80 "../../../src/go/partie.c"
 }
 var $22=$idQuestion; //@line 85 "../../../src/go/partie.c"
 var $23=($22|0)==8; //@line 85 "../../../src/go/partie.c"
  //@line 85 "../../../src/go/partie.c"
 if (!($23)) {
  STACKTOP=sp;return; //@line 90 "../../../src/go/partie.c"
 }
 var $25=$1; //@line 86 "../../../src/go/partie.c"
 var $26=(($25+48)|0); //@line 86 "../../../src/go/partie.c"
 HEAP8[($26)]=1; //@line 86 "../../../src/go/partie.c"
 var $27=$1; //@line 87 "../../../src/go/partie.c"
 var $28=(($27+52)|0); //@line 87 "../../../src/go/partie.c"
 HEAP32[(($28)>>2)]=1; //@line 87 "../../../src/go/partie.c"
 var $29=$1; //@line 88 "../../../src/go/partie.c"
 _partie_informer_ordinateur($29); //@line 88 "../../../src/go/partie.c"
  //@line 89 "../../../src/go/partie.c"
 STACKTOP=sp;return; //@line 90 "../../../src/go/partie.c"
}


function _partie_informer_ordinateur($partie){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+24)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $j;
 var $joueur=sp;
 $1=$partie;
 $j=0; //@line 103 "../../../src/go/partie.c"
  //@line 103 "../../../src/go/partie.c"
 while(1) {
  var $3=$j; //@line 103 "../../../src/go/partie.c"
  var $4=($3|0)<2; //@line 103 "../../../src/go/partie.c"
   //@line 103 "../../../src/go/partie.c"
  if (!($4)) {
   break;
  }
  var $6=$j; //@line 104 "../../../src/go/partie.c"
  var $7=$1; //@line 104 "../../../src/go/partie.c"
  var $8=(($7+4)|0); //@line 104 "../../../src/go/partie.c"
  var $9=(($8+((($6)*(20))&-1))|0); //@line 104 "../../../src/go/partie.c"
  var $10=$joueur; //@line 104 "../../../src/go/partie.c"
  var $11=$9; //@line 104 "../../../src/go/partie.c"
  assert(20 % 1 === 0);HEAP32[(($10)>>2)]=HEAP32[(($11)>>2)];HEAP32[((($10)+(4))>>2)]=HEAP32[((($11)+(4))>>2)];HEAP32[((($10)+(8))>>2)]=HEAP32[((($11)+(8))>>2)];HEAP32[((($10)+(12))>>2)]=HEAP32[((($11)+(12))>>2)];HEAP32[((($10)+(16))>>2)]=HEAP32[((($11)+(16))>>2)]; //@line 104 "../../../src/go/partie.c"
  var $12=(($joueur)|0); //@line 105 "../../../src/go/partie.c"
  var $13=HEAP32[(($12)>>2)]; //@line 105 "../../../src/go/partie.c"
  var $14=($13|0)==1; //@line 105 "../../../src/go/partie.c"
   //@line 105 "../../../src/go/partie.c"
  if ($14) {
   var $16=(($joueur+16)|0); //@line 106 "../../../src/go/partie.c"
   var $17=HEAP32[(($16)>>2)]; //@line 106 "../../../src/go/partie.c"
   var $18=$1; //@line 106 "../../../src/go/partie.c"
   var $19=(($18)|0); //@line 106 "../../../src/go/partie.c"
   var $20=HEAP32[(($19)>>2)]; //@line 106 "../../../src/go/partie.c"
   _ordinateur_remplacer_plateau($17,$20); //@line 106 "../../../src/go/partie.c"
    //@line 107 "../../../src/go/partie.c"
  }
   //@line 108 "../../../src/go/partie.c"
  var $23=$j; //@line 103 "../../../src/go/partie.c"
  var $24=((($23)+(1))|0); //@line 103 "../../../src/go/partie.c"
  $j=$24; //@line 103 "../../../src/go/partie.c"
   //@line 103 "../../../src/go/partie.c"
 }
 STACKTOP=sp;return; //@line 109 "../../../src/go/partie.c"
}


function _partie_annuler_coup($partie){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $nouveau;
 $2=$partie;
 var $3=$2; //@line 208 "../../../src/go/partie.c"
 var $4=(($3+56)|0); //@line 208 "../../../src/go/partie.c"
 var $5=HEAP32[(($4)>>2)]; //@line 208 "../../../src/go/partie.c"
 var $6=(($5+8)|0); //@line 208 "../../../src/go/partie.c"
 var $7=HEAP32[(($6)>>2)]; //@line 208 "../../../src/go/partie.c"
 var $8=$2; //@line 208 "../../../src/go/partie.c"
 var $9=(($8+56)|0); //@line 208 "../../../src/go/partie.c"
 var $10=HEAP32[(($9)>>2)]; //@line 208 "../../../src/go/partie.c"
 var $11=FUNCTION_TABLE[$7]($10); //@line 208 "../../../src/go/partie.c"
  //@line 208 "../../../src/go/partie.c"
 if ($11) {
  $1=0; //@line 209 "../../../src/go/partie.c"
   //@line 209 "../../../src/go/partie.c"
  var $83=$1; //@line 227 "../../../src/go/partie.c"
  STACKTOP=sp;return $83; //@line 227 "../../../src/go/partie.c"
 }
 var $14=$2; //@line 212 "../../../src/go/partie.c"
 var $15=(($14+56)|0); //@line 212 "../../../src/go/partie.c"
 var $16=HEAP32[(($15)>>2)]; //@line 212 "../../../src/go/partie.c"
 var $17=(($16+20)|0); //@line 212 "../../../src/go/partie.c"
 var $18=HEAP32[(($17)>>2)]; //@line 212 "../../../src/go/partie.c"
 var $19=$2; //@line 212 "../../../src/go/partie.c"
 var $20=(($19+56)|0); //@line 212 "../../../src/go/partie.c"
 var $21=HEAP32[(($20)>>2)]; //@line 212 "../../../src/go/partie.c"
 var $22=FUNCTION_TABLE[$18]($21); //@line 212 "../../../src/go/partie.c"
 $nouveau=$22; //@line 212 "../../../src/go/partie.c"
 var $23=$2; //@line 213 "../../../src/go/partie.c"
 var $24=(($23+60)|0); //@line 213 "../../../src/go/partie.c"
 var $25=HEAP32[(($24)>>2)]; //@line 213 "../../../src/go/partie.c"
 var $26=(($25+12)|0); //@line 213 "../../../src/go/partie.c"
 var $27=HEAP32[(($26)>>2)]; //@line 213 "../../../src/go/partie.c"
 var $28=$2; //@line 213 "../../../src/go/partie.c"
 var $29=(($28+60)|0); //@line 213 "../../../src/go/partie.c"
 var $30=HEAP32[(($29)>>2)]; //@line 213 "../../../src/go/partie.c"
 var $31=$2; //@line 213 "../../../src/go/partie.c"
 var $32=(($31)|0); //@line 213 "../../../src/go/partie.c"
 var $33=HEAP32[(($32)>>2)]; //@line 213 "../../../src/go/partie.c"
 FUNCTION_TABLE[$27]($30,$33); //@line 213 "../../../src/go/partie.c"
 var $34=$nouveau; //@line 214 "../../../src/go/partie.c"
 var $35=$2; //@line 214 "../../../src/go/partie.c"
 var $36=(($35)|0); //@line 214 "../../../src/go/partie.c"
 HEAP32[(($36)>>2)]=$34; //@line 214 "../../../src/go/partie.c"
 var $37=$2; //@line 215 "../../../src/go/partie.c"
 var $38=(($37+52)|0); //@line 215 "../../../src/go/partie.c"
 var $39=HEAP32[(($38)>>2)]; //@line 215 "../../../src/go/partie.c"
 var $40=($39|0)==0; //@line 215 "../../../src/go/partie.c"
 var $41=($40?1:0); //@line 215 "../../../src/go/partie.c"
 var $42=$2; //@line 215 "../../../src/go/partie.c"
 var $43=(($42+52)|0); //@line 215 "../../../src/go/partie.c"
 HEAP32[(($43)>>2)]=$41; //@line 215 "../../../src/go/partie.c"
 var $44=$2; //@line 217 "../../../src/go/partie.c"
 var $45=_partie_en_cours_de_handicap($44); //@line 217 "../../../src/go/partie.c"
  //@line 217 "../../../src/go/partie.c"
 do {
  if ($45) {
   var $47=$2; //@line 217 "../../../src/go/partie.c"
   var $48=(($47+52)|0); //@line 217 "../../../src/go/partie.c"
   var $49=HEAP32[(($48)>>2)]; //@line 217 "../../../src/go/partie.c"
   var $50=($49|0)==0; //@line 217 "../../../src/go/partie.c"
    //@line 217 "../../../src/go/partie.c"
   if (!($50)) {
    label = 6;
    break;
   }
   var $52=$2; //@line 218 "../../../src/go/partie.c"
   var $53=_partie_annuler_coup($52); //@line 218 "../../../src/go/partie.c"
    //@line 219 "../../../src/go/partie.c"
  } else {
   label = 6;
  }
 } while(0);
 if (label == 6) {
  var $55=$2; //@line 219 "../../../src/go/partie.c"
  var $56=(($55+52)|0); //@line 219 "../../../src/go/partie.c"
  var $57=HEAP32[(($56)>>2)]; //@line 219 "../../../src/go/partie.c"
  var $58=$2; //@line 219 "../../../src/go/partie.c"
  var $59=(($58+4)|0); //@line 219 "../../../src/go/partie.c"
  var $60=(($59+((($57)*(20))&-1))|0); //@line 219 "../../../src/go/partie.c"
  var $61=(($60)|0); //@line 219 "../../../src/go/partie.c"
  var $62=HEAP32[(($61)>>2)]; //@line 219 "../../../src/go/partie.c"
  var $63=($62|0)==1; //@line 219 "../../../src/go/partie.c"
   //@line 219 "../../../src/go/partie.c"
  do {
   if ($63) {
    var $65=$2; //@line 219 "../../../src/go/partie.c"
    var $66=(($65+52)|0); //@line 219 "../../../src/go/partie.c"
    var $67=HEAP32[(($66)>>2)]; //@line 219 "../../../src/go/partie.c"
    var $68=($67|0)==0; //@line 219 "../../../src/go/partie.c"
    var $69=($68?1:0); //@line 219 "../../../src/go/partie.c"
    var $70=$2; //@line 219 "../../../src/go/partie.c"
    var $71=(($70+4)|0); //@line 219 "../../../src/go/partie.c"
    var $72=(($71+((($69)*(20))&-1))|0); //@line 219 "../../../src/go/partie.c"
    var $73=(($72)|0); //@line 219 "../../../src/go/partie.c"
    var $74=HEAP32[(($73)>>2)]; //@line 219 "../../../src/go/partie.c"
    var $75=($74|0)==0; //@line 219 "../../../src/go/partie.c"
     //@line 219 "../../../src/go/partie.c"
    if (!($75)) {
     break;
    }
    var $77=$2; //@line 222 "../../../src/go/partie.c"
    var $78=_partie_annuler_coup($77); //@line 222 "../../../src/go/partie.c"
     //@line 223 "../../../src/go/partie.c"
   }
  } while(0);
 }
 var $81=$2; //@line 225 "../../../src/go/partie.c"
 _partie_informer_ordinateur($81); //@line 225 "../../../src/go/partie.c"
 $1=1; //@line 226 "../../../src/go/partie.c"
  //@line 226 "../../../src/go/partie.c"
 var $83=$1; //@line 227 "../../../src/go/partie.c"
 STACKTOP=sp;return $83; //@line 227 "../../../src/go/partie.c"
}


function _partie_jouer_coup($partie,$coup){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+64)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $coup; $coup=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($coup)>>2)]=HEAP32[((tempParam)>>2)];
 var $1;
 var $2;
 var $valide=sp;
 var $passer_son_tour;
 var $copie;
 var $pion=(sp)+(8);
 var $capturees;
 var $p=(sp)+(16);
 var $it=(sp)+(24);
 var $old;
 var $couleur;
 var $j;
 var $joueur=(sp)+(32);
 var $p1;
 var $passer=(sp)+(56);
 var $n2;
 var $n1;
 $2=$partie;
 var $3=$2; //@line 118 "../../../src/go/partie.c"
 var $4=(($3+49)|0); //@line 118 "../../../src/go/partie.c"
 var $5=HEAP8[($4)]; //@line 118 "../../../src/go/partie.c"
 var $6=(($5)&1); //@line 118 "../../../src/go/partie.c"
  //@line 118 "../../../src/go/partie.c"
 if ($6) {
  $1=0; //@line 119 "../../../src/go/partie.c"
   //@line 119 "../../../src/go/partie.c"
  var $220=$1; //@line 193 "../../../src/go/partie.c"
  STACKTOP=sp;return $220; //@line 193 "../../../src/go/partie.c"
 }
 HEAP8[($valide)]=0; //@line 120 "../../../src/go/partie.c"
 var $9=(($coup)|0); //@line 121 "../../../src/go/partie.c"
 var $10=_position_est_valide($9); //@line 121 "../../../src/go/partie.c"
 var $11=($10&1); //@line 121 "../../../src/go/partie.c"
 var $12=($11|0)==0; //@line 121 "../../../src/go/partie.c"
 var $13=($12&1); //@line 121 "../../../src/go/partie.c"
 $passer_son_tour=$13; //@line 121 "../../../src/go/partie.c"
 var $14=$2; //@line 122 "../../../src/go/partie.c"
 var $15=(($14)|0); //@line 122 "../../../src/go/partie.c"
 var $16=HEAP32[(($15)>>2)]; //@line 122 "../../../src/go/partie.c"
 var $17=_plateau_clone($16); //@line 122 "../../../src/go/partie.c"
 $copie=$17; //@line 122 "../../../src/go/partie.c"
 var $18=$passer_son_tour; //@line 123 "../../../src/go/partie.c"
 var $19=(($18)&1); //@line 123 "../../../src/go/partie.c"
  //@line 123 "../../../src/go/partie.c"
 if ($19) {
  HEAP8[($valide)]=1; //@line 125 "../../../src/go/partie.c"
   //@line 126 "../../../src/go/partie.c"
 } else {
  var $22=(($pion+4)|0); //@line 129 "../../../src/go/partie.c"
  var $23=(($coup)|0); //@line 129 "../../../src/go/partie.c"
  var $24=$22; //@line 129 "../../../src/go/partie.c"
  var $25=$23; //@line 129 "../../../src/go/partie.c"
  assert(4 % 1 === 0);HEAP8[($24)]=HEAP8[($25)];HEAP8[((($24)+(1))|0)]=HEAP8[((($25)+(1))|0)];HEAP8[((($24)+(2))|0)]=HEAP8[((($25)+(2))|0)];HEAP8[((($24)+(3))|0)]=HEAP8[((($25)+(3))|0)]; //@line 129 "../../../src/go/partie.c"
  var $26=$2; //@line 130 "../../../src/go/partie.c"
  var $27=(($26+52)|0); //@line 130 "../../../src/go/partie.c"
  var $28=HEAP32[(($27)>>2)]; //@line 130 "../../../src/go/partie.c"
  var $29=($28|0)==0; //@line 130 "../../../src/go/partie.c"
  var $30=($29?1:2); //@line 130 "../../../src/go/partie.c"
  var $31=(($pion)|0); //@line 130 "../../../src/go/partie.c"
  HEAP32[(($31)>>2)]=$30; //@line 130 "../../../src/go/partie.c"
  var $32=$2; //@line 131 "../../../src/go/partie.c"
  var $33=(($32)|0); //@line 131 "../../../src/go/partie.c"
  var $34=HEAP32[(($33)>>2)]; //@line 131 "../../../src/go/partie.c"
  var $35=_plateau_capture_chaines($34,$pion,$valide); //@line 131 "../../../src/go/partie.c"
  $capturees=$35; //@line 131 "../../../src/go/partie.c"
  var $36=$capturees; //@line 132 "../../../src/go/partie.c"
  var $37=($36|0)!=0; //@line 132 "../../../src/go/partie.c"
   //@line 132 "../../../src/go/partie.c"
  if ($37) {
   var $39=$capturees; //@line 133 "../../../src/go/partie.c"
   _detruire_ensemble_chaine($39); //@line 133 "../../../src/go/partie.c"
    //@line 133 "../../../src/go/partie.c"
  }
 }
 var $42=HEAP8[($valide)]; //@line 137 "../../../src/go/partie.c"
 var $43=(($42)&1); //@line 137 "../../../src/go/partie.c"
  //@line 137 "../../../src/go/partie.c"
 do {
  if ($43) {
   var $45=$passer_son_tour; //@line 137 "../../../src/go/partie.c"
   var $46=(($45)&1); //@line 137 "../../../src/go/partie.c"
    //@line 137 "../../../src/go/partie.c"
   if ($46) {
    break;
   }
   var $48=$2; //@line 139 "../../../src/go/partie.c"
   var $49=(($48+56)|0); //@line 139 "../../../src/go/partie.c"
   var $50=HEAP32[(($49)>>2)]; //@line 139 "../../../src/go/partie.c"
   var $51=(($50+4)|0); //@line 139 "../../../src/go/partie.c"
   var $52=HEAP32[(($51)>>2)]; //@line 139 "../../../src/go/partie.c"
   FUNCTION_TABLE[$52]($it); //@line 139 "../../../src/go/partie.c"
    //@line 139 "../../../src/go/partie.c"
   while(1) {
    var $54=$2; //@line 139 "../../../src/go/partie.c"
    var $55=(($54+56)|0); //@line 139 "../../../src/go/partie.c"
    var $56=HEAP32[(($55)>>2)]; //@line 139 "../../../src/go/partie.c"
    var $57=(($56)|0); //@line 139 "../../../src/go/partie.c"
    var $58=HEAP32[(($57)>>2)]; //@line 139 "../../../src/go/partie.c"
    var $59=$2; //@line 139 "../../../src/go/partie.c"
    var $60=(($59+56)|0); //@line 139 "../../../src/go/partie.c"
    var $61=HEAP32[(($60)>>2)]; //@line 139 "../../../src/go/partie.c"
    var $62=FUNCTION_TABLE[$58]($it,$61,$p); //@line 139 "../../../src/go/partie.c"
    var $63=($62|0)!=0; //@line 139 "../../../src/go/partie.c"
     //@line 139 "../../../src/go/partie.c"
    if (!($63)) {
     break;
    }
    var $65=$2; //@line 140 "../../../src/go/partie.c"
    var $66=(($65)|0); //@line 140 "../../../src/go/partie.c"
    var $67=HEAP32[(($66)>>2)]; //@line 140 "../../../src/go/partie.c"
    var $68=HEAP32[(($p)>>2)]; //@line 140 "../../../src/go/partie.c"
    var $69=_plateau_est_identique($67,$68); //@line 140 "../../../src/go/partie.c"
     //@line 140 "../../../src/go/partie.c"
    if ($69) {
     label = 13;
     break;
    }
     //@line 145 "../../../src/go/partie.c"
   }
   if (label == 13) {
    var $71=_printf(56,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=760,HEAP32[(((tempVarArgs)+(8))>>2)]=141,tempVarArgs)); STACKTOP=tempVarArgs; //@line 141 "../../../src/go/partie.c"
    HEAP8[($valide)]=0; //@line 142 "../../../src/go/partie.c"
     //@line 143 "../../../src/go/partie.c"
   }
   var $74=HEAP8[($valide)]; //@line 147 "../../../src/go/partie.c"
   var $75=(($74)&1); //@line 147 "../../../src/go/partie.c"
    //@line 147 "../../../src/go/partie.c"
   if (!($75)) {
    var $77=$2; //@line 148 "../../../src/go/partie.c"
    var $78=(($77)|0); //@line 148 "../../../src/go/partie.c"
    var $79=HEAP32[(($78)>>2)]; //@line 148 "../../../src/go/partie.c"
    $old=$79; //@line 148 "../../../src/go/partie.c"
    var $80=$copie; //@line 149 "../../../src/go/partie.c"
    var $81=$2; //@line 149 "../../../src/go/partie.c"
    var $82=(($81)|0); //@line 149 "../../../src/go/partie.c"
    HEAP32[(($82)>>2)]=$80; //@line 149 "../../../src/go/partie.c"
    var $83=$old; //@line 150 "../../../src/go/partie.c"
    $copie=$83; //@line 150 "../../../src/go/partie.c"
     //@line 151 "../../../src/go/partie.c"
   }
    //@line 152 "../../../src/go/partie.c"
  }
 } while(0);
 var $86=HEAP8[($valide)]; //@line 154 "../../../src/go/partie.c"
 var $87=(($86)&1); //@line 154 "../../../src/go/partie.c"
  //@line 154 "../../../src/go/partie.c"
 if ($87) {
  var $89=$2; //@line 156 "../../../src/go/partie.c"
  var $90=(($89+52)|0); //@line 156 "../../../src/go/partie.c"
  var $91=HEAP32[(($90)>>2)]; //@line 156 "../../../src/go/partie.c"
  $couleur=$91; //@line 156 "../../../src/go/partie.c"
  $j=0; //@line 157 "../../../src/go/partie.c"
   //@line 157 "../../../src/go/partie.c"
  while(1) {
   var $93=$j; //@line 157 "../../../src/go/partie.c"
   var $94=($93|0)<2; //@line 157 "../../../src/go/partie.c"
    //@line 157 "../../../src/go/partie.c"
   if (!($94)) {
    break;
   }
   var $96=$j; //@line 158 "../../../src/go/partie.c"
   var $97=$2; //@line 158 "../../../src/go/partie.c"
   var $98=(($97+4)|0); //@line 158 "../../../src/go/partie.c"
   var $99=(($98+((($96)*(20))&-1))|0); //@line 158 "../../../src/go/partie.c"
   var $100=$joueur; //@line 158 "../../../src/go/partie.c"
   var $101=$99; //@line 158 "../../../src/go/partie.c"
   assert(20 % 1 === 0);HEAP32[(($100)>>2)]=HEAP32[(($101)>>2)];HEAP32[((($100)+(4))>>2)]=HEAP32[((($101)+(4))>>2)];HEAP32[((($100)+(8))>>2)]=HEAP32[((($101)+(8))>>2)];HEAP32[((($100)+(12))>>2)]=HEAP32[((($101)+(12))>>2)];HEAP32[((($100)+(16))>>2)]=HEAP32[((($101)+(16))>>2)]; //@line 158 "../../../src/go/partie.c"
   var $102=(($joueur)|0); //@line 159 "../../../src/go/partie.c"
   var $103=HEAP32[(($102)>>2)]; //@line 159 "../../../src/go/partie.c"
   var $104=($103|0)==1; //@line 159 "../../../src/go/partie.c"
    //@line 159 "../../../src/go/partie.c"
   if ($104) {
    var $106=(($joueur+16)|0); //@line 160 "../../../src/go/partie.c"
    var $107=HEAP32[(($106)>>2)]; //@line 160 "../../../src/go/partie.c"
    var $108=$2; //@line 160 "../../../src/go/partie.c"
    var $109=$couleur; //@line 160 "../../../src/go/partie.c"
    _ordinateur_notifier_coup($107,$108,$109,$coup); //@line 160 "../../../src/go/partie.c"
     //@line 161 "../../../src/go/partie.c"
   }
    //@line 162 "../../../src/go/partie.c"
   var $112=$j; //@line 157 "../../../src/go/partie.c"
   var $113=((($112)+(1))|0); //@line 157 "../../../src/go/partie.c"
   $j=$113; //@line 157 "../../../src/go/partie.c"
    //@line 157 "../../../src/go/partie.c"
  }
  var $115=$2; //@line 164 "../../../src/go/partie.c"
  var $116=(($115+52)|0); //@line 164 "../../../src/go/partie.c"
  var $117=HEAP32[(($116)>>2)]; //@line 164 "../../../src/go/partie.c"
  var $118=($117|0)==0; //@line 164 "../../../src/go/partie.c"
  var $119=($118?1:0); //@line 164 "../../../src/go/partie.c"
  var $120=$2; //@line 164 "../../../src/go/partie.c"
  var $121=(($120+52)|0); //@line 164 "../../../src/go/partie.c"
  HEAP32[(($121)>>2)]=$119; //@line 164 "../../../src/go/partie.c"
  var $122=$2; //@line 167 "../../../src/go/partie.c"
  var $123=(($122+56)|0); //@line 167 "../../../src/go/partie.c"
  var $124=HEAP32[(($123)>>2)]; //@line 167 "../../../src/go/partie.c"
  var $125=(($124+12)|0); //@line 167 "../../../src/go/partie.c"
  var $126=HEAP32[(($125)>>2)]; //@line 167 "../../../src/go/partie.c"
  var $127=$2; //@line 167 "../../../src/go/partie.c"
  var $128=(($127+56)|0); //@line 167 "../../../src/go/partie.c"
  var $129=HEAP32[(($128)>>2)]; //@line 167 "../../../src/go/partie.c"
  var $130=$copie; //@line 167 "../../../src/go/partie.c"
  FUNCTION_TABLE[$126]($129,$130); //@line 167 "../../../src/go/partie.c"
   //@line 169 "../../../src/go/partie.c"
  while(1) {
   var $132=$2; //@line 169 "../../../src/go/partie.c"
   var $133=(($132+60)|0); //@line 169 "../../../src/go/partie.c"
   var $134=HEAP32[(($133)>>2)]; //@line 169 "../../../src/go/partie.c"
   var $135=(($134+8)|0); //@line 169 "../../../src/go/partie.c"
   var $136=HEAP32[(($135)>>2)]; //@line 169 "../../../src/go/partie.c"
   var $137=$2; //@line 169 "../../../src/go/partie.c"
   var $138=(($137+60)|0); //@line 169 "../../../src/go/partie.c"
   var $139=HEAP32[(($138)>>2)]; //@line 169 "../../../src/go/partie.c"
   var $140=FUNCTION_TABLE[$136]($139); //@line 169 "../../../src/go/partie.c"
   var $141=$140^1; //@line 169 "../../../src/go/partie.c"
    //@line 169 "../../../src/go/partie.c"
   if (!($141)) {
    break;
   }
   var $143=$2; //@line 170 "../../../src/go/partie.c"
   var $144=(($143+60)|0); //@line 170 "../../../src/go/partie.c"
   var $145=HEAP32[(($144)>>2)]; //@line 170 "../../../src/go/partie.c"
   var $146=(($145+20)|0); //@line 170 "../../../src/go/partie.c"
   var $147=HEAP32[(($146)>>2)]; //@line 170 "../../../src/go/partie.c"
   var $148=$2; //@line 170 "../../../src/go/partie.c"
   var $149=(($148+60)|0); //@line 170 "../../../src/go/partie.c"
   var $150=HEAP32[(($149)>>2)]; //@line 170 "../../../src/go/partie.c"
   var $151=FUNCTION_TABLE[$147]($150); //@line 170 "../../../src/go/partie.c"
   $p1=$151; //@line 170 "../../../src/go/partie.c"
   var $152=$p1; //@line 171 "../../../src/go/partie.c"
   _detruire_plateau($152); //@line 171 "../../../src/go/partie.c"
    //@line 172 "../../../src/go/partie.c"
  }
   //@line 173 "../../../src/go/partie.c"
 } else {
  var $155=$copie; //@line 174 "../../../src/go/partie.c"
  _detruire_plateau($155); //@line 174 "../../../src/go/partie.c"
 }
 var $157=$2; //@line 178 "../../../src/go/partie.c"
 var $158=_partie_en_cours_de_handicap($157); //@line 178 "../../../src/go/partie.c"
  //@line 178 "../../../src/go/partie.c"
 do {
  if ($158) {
   var $160=$2; //@line 178 "../../../src/go/partie.c"
   var $161=(($160+52)|0); //@line 178 "../../../src/go/partie.c"
   var $162=HEAP32[(($161)>>2)]; //@line 178 "../../../src/go/partie.c"
   var $163=($162|0)==0; //@line 178 "../../../src/go/partie.c"
    //@line 178 "../../../src/go/partie.c"
   if (!($163)) {
    break;
   }
   var $165=(($passer)|0); //@line 179 "../../../src/go/partie.c"
   var $166=$165; //@line 179 "../../../src/go/partie.c"
   assert(4 % 1 === 0);HEAP8[($166)]=HEAP8[(1488)];HEAP8[((($166)+(1))|0)]=HEAP8[(1489)];HEAP8[((($166)+(2))|0)]=HEAP8[(1490)];HEAP8[((($166)+(3))|0)]=HEAP8[(1491)]; //@line 179 "../../../src/go/partie.c"
   var $167=$2; //@line 180 "../../../src/go/partie.c"
   var $168=_partie_jouer_coup($167,$passer); //@line 180 "../../../src/go/partie.c"
    //@line 181 "../../../src/go/partie.c"
  }
 } while(0);
 var $170=$passer_son_tour; //@line 184 "../../../src/go/partie.c"
 var $171=(($170)&1); //@line 184 "../../../src/go/partie.c"
  //@line 184 "../../../src/go/partie.c"
 do {
  if ($171) {
   var $173=$2; //@line 184 "../../../src/go/partie.c"
   var $174=(($173+56)|0); //@line 184 "../../../src/go/partie.c"
   var $175=HEAP32[(($174)>>2)]; //@line 184 "../../../src/go/partie.c"
   var $176=(($175+24)|0); //@line 184 "../../../src/go/partie.c"
   var $177=HEAP32[(($176)>>2)]; //@line 184 "../../../src/go/partie.c"
   var $178=$2; //@line 184 "../../../src/go/partie.c"
   var $179=(($178+56)|0); //@line 184 "../../../src/go/partie.c"
   var $180=HEAP32[(($179)>>2)]; //@line 184 "../../../src/go/partie.c"
   var $181=FUNCTION_TABLE[$177]($180); //@line 184 "../../../src/go/partie.c"
   var $182=($181|0)>=2; //@line 184 "../../../src/go/partie.c"
    //@line 184 "../../../src/go/partie.c"
   if (!($182)) {
    break;
   }
   var $184=$2; //@line 185 "../../../src/go/partie.c"
   var $185=(($184+56)|0); //@line 185 "../../../src/go/partie.c"
   var $186=HEAP32[(($185)>>2)]; //@line 185 "../../../src/go/partie.c"
   var $187=(($186+28)|0); //@line 185 "../../../src/go/partie.c"
   var $188=HEAP32[(($187)>>2)]; //@line 185 "../../../src/go/partie.c"
   var $189=$2; //@line 185 "../../../src/go/partie.c"
   var $190=(($189+56)|0); //@line 185 "../../../src/go/partie.c"
   var $191=HEAP32[(($190)>>2)]; //@line 185 "../../../src/go/partie.c"
   var $192=FUNCTION_TABLE[$188]($191,1); //@line 185 "../../../src/go/partie.c"
   $n2=$192; //@line 185 "../../../src/go/partie.c"
   var $193=$2; //@line 186 "../../../src/go/partie.c"
   var $194=(($193+56)|0); //@line 186 "../../../src/go/partie.c"
   var $195=HEAP32[(($194)>>2)]; //@line 186 "../../../src/go/partie.c"
   var $196=(($195+28)|0); //@line 186 "../../../src/go/partie.c"
   var $197=HEAP32[(($196)>>2)]; //@line 186 "../../../src/go/partie.c"
   var $198=$2; //@line 186 "../../../src/go/partie.c"
   var $199=(($198+56)|0); //@line 186 "../../../src/go/partie.c"
   var $200=HEAP32[(($199)>>2)]; //@line 186 "../../../src/go/partie.c"
   var $201=FUNCTION_TABLE[$197]($200,0); //@line 186 "../../../src/go/partie.c"
   $n1=$201; //@line 186 "../../../src/go/partie.c"
   var $202=$n1; //@line 187 "../../../src/go/partie.c"
   var $203=$n2; //@line 187 "../../../src/go/partie.c"
   var $204=_plateau_est_identique($202,$203); //@line 187 "../../../src/go/partie.c"
    //@line 187 "../../../src/go/partie.c"
   do {
    if ($204) {
     var $206=$2; //@line 187 "../../../src/go/partie.c"
     var $207=(($206)|0); //@line 187 "../../../src/go/partie.c"
     var $208=HEAP32[(($207)>>2)]; //@line 187 "../../../src/go/partie.c"
     var $209=$n1; //@line 187 "../../../src/go/partie.c"
     var $210=_plateau_est_identique($208,$209); //@line 187 "../../../src/go/partie.c"
      //@line 187 "../../../src/go/partie.c"
     if (!($210)) {
      break;
     }
     var $212=_printf(520,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=760,HEAP32[(((tempVarArgs)+(8))>>2)]=188,tempVarArgs)); STACKTOP=tempVarArgs; //@line 188 "../../../src/go/partie.c"
     var $213=$2; //@line 189 "../../../src/go/partie.c"
     var $214=(($213+49)|0); //@line 189 "../../../src/go/partie.c"
     HEAP8[($214)]=1; //@line 189 "../../../src/go/partie.c"
      //@line 190 "../../../src/go/partie.c"
    }
   } while(0);
    //@line 191 "../../../src/go/partie.c"
  }
 } while(0);
 var $217=HEAP8[($valide)]; //@line 192 "../../../src/go/partie.c"
 var $218=(($217)&1); //@line 192 "../../../src/go/partie.c"
 $1=$218; //@line 192 "../../../src/go/partie.c"
  //@line 192 "../../../src/go/partie.c"
 var $220=$1; //@line 193 "../../../src/go/partie.c"
 STACKTOP=sp;return $220; //@line 193 "../../../src/go/partie.c"
}


function _partie_en_cours_de_handicap($partie){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$partie;
 var $2=$1; //@line 203 "../../../src/go/partie.c"
 var $3=(($2+56)|0); //@line 203 "../../../src/go/partie.c"
 var $4=HEAP32[(($3)>>2)]; //@line 203 "../../../src/go/partie.c"
 var $5=(($4+24)|0); //@line 203 "../../../src/go/partie.c"
 var $6=HEAP32[(($5)>>2)]; //@line 203 "../../../src/go/partie.c"
 var $7=$1; //@line 203 "../../../src/go/partie.c"
 var $8=(($7+56)|0); //@line 203 "../../../src/go/partie.c"
 var $9=HEAP32[(($8)>>2)]; //@line 203 "../../../src/go/partie.c"
 var $10=FUNCTION_TABLE[$6]($9); //@line 203 "../../../src/go/partie.c"
 var $11=(((($10|0))/(2))&-1); //@line 203 "../../../src/go/partie.c"
 var $12=$1; //@line 203 "../../../src/go/partie.c"
 var $13=(($12+44)|0); //@line 203 "../../../src/go/partie.c"
 var $14=HEAP32[(($13)>>2)]; //@line 203 "../../../src/go/partie.c"
 var $15=((($14)-(1))|0); //@line 203 "../../../src/go/partie.c"
 var $16=($11|0)<($15|0); //@line 203 "../../../src/go/partie.c"
 STACKTOP=sp;return $16; //@line 203 "../../../src/go/partie.c"
}


function _partie_jouer_ordinateur($partie){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $ordi;
 $1=$partie;
 var $2=$1; //@line 197 "../../../src/go/partie.c"
 var $3=(($2+52)|0); //@line 197 "../../../src/go/partie.c"
 var $4=HEAP32[(($3)>>2)]; //@line 197 "../../../src/go/partie.c"
 var $5=$1; //@line 197 "../../../src/go/partie.c"
 var $6=(($5+4)|0); //@line 197 "../../../src/go/partie.c"
 var $7=(($6+((($4)*(20))&-1))|0); //@line 197 "../../../src/go/partie.c"
 var $8=(($7+16)|0); //@line 197 "../../../src/go/partie.c"
 var $9=HEAP32[(($8)>>2)]; //@line 197 "../../../src/go/partie.c"
 $ordi=$9; //@line 197 "../../../src/go/partie.c"
 var $10=$ordi; //@line 198 "../../../src/go/partie.c"
 var $11=$1; //@line 198 "../../../src/go/partie.c"
 var $12=$1; //@line 198 "../../../src/go/partie.c"
 var $13=(($12+52)|0); //@line 198 "../../../src/go/partie.c"
 var $14=HEAP32[(($13)>>2)]; //@line 198 "../../../src/go/partie.c"
 _ordinateur_jouer_coup($10,$11,$14); //@line 198 "../../../src/go/partie.c"
 STACKTOP=sp;return; //@line 199 "../../../src/go/partie.c"
}


function _partie_rejouer_coup($partie){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $nouveau;
 $2=$partie;
 var $3=$2; //@line 231 "../../../src/go/partie.c"
 var $4=(($3+60)|0); //@line 231 "../../../src/go/partie.c"
 var $5=HEAP32[(($4)>>2)]; //@line 231 "../../../src/go/partie.c"
 var $6=(($5+8)|0); //@line 231 "../../../src/go/partie.c"
 var $7=HEAP32[(($6)>>2)]; //@line 231 "../../../src/go/partie.c"
 var $8=$2; //@line 231 "../../../src/go/partie.c"
 var $9=(($8+60)|0); //@line 231 "../../../src/go/partie.c"
 var $10=HEAP32[(($9)>>2)]; //@line 231 "../../../src/go/partie.c"
 var $11=FUNCTION_TABLE[$7]($10); //@line 231 "../../../src/go/partie.c"
  //@line 231 "../../../src/go/partie.c"
 if ($11) {
  $1=0; //@line 232 "../../../src/go/partie.c"
   //@line 232 "../../../src/go/partie.c"
  var $83=$1; //@line 250 "../../../src/go/partie.c"
  STACKTOP=sp;return $83; //@line 250 "../../../src/go/partie.c"
 }
 var $14=$2; //@line 235 "../../../src/go/partie.c"
 var $15=(($14+60)|0); //@line 235 "../../../src/go/partie.c"
 var $16=HEAP32[(($15)>>2)]; //@line 235 "../../../src/go/partie.c"
 var $17=(($16+20)|0); //@line 235 "../../../src/go/partie.c"
 var $18=HEAP32[(($17)>>2)]; //@line 235 "../../../src/go/partie.c"
 var $19=$2; //@line 235 "../../../src/go/partie.c"
 var $20=(($19+60)|0); //@line 235 "../../../src/go/partie.c"
 var $21=HEAP32[(($20)>>2)]; //@line 235 "../../../src/go/partie.c"
 var $22=FUNCTION_TABLE[$18]($21); //@line 235 "../../../src/go/partie.c"
 $nouveau=$22; //@line 235 "../../../src/go/partie.c"
 var $23=$2; //@line 236 "../../../src/go/partie.c"
 var $24=(($23+56)|0); //@line 236 "../../../src/go/partie.c"
 var $25=HEAP32[(($24)>>2)]; //@line 236 "../../../src/go/partie.c"
 var $26=(($25+12)|0); //@line 236 "../../../src/go/partie.c"
 var $27=HEAP32[(($26)>>2)]; //@line 236 "../../../src/go/partie.c"
 var $28=$2; //@line 236 "../../../src/go/partie.c"
 var $29=(($28+56)|0); //@line 236 "../../../src/go/partie.c"
 var $30=HEAP32[(($29)>>2)]; //@line 236 "../../../src/go/partie.c"
 var $31=$2; //@line 236 "../../../src/go/partie.c"
 var $32=(($31)|0); //@line 236 "../../../src/go/partie.c"
 var $33=HEAP32[(($32)>>2)]; //@line 236 "../../../src/go/partie.c"
 FUNCTION_TABLE[$27]($30,$33); //@line 236 "../../../src/go/partie.c"
 var $34=$nouveau; //@line 237 "../../../src/go/partie.c"
 var $35=$2; //@line 237 "../../../src/go/partie.c"
 var $36=(($35)|0); //@line 237 "../../../src/go/partie.c"
 HEAP32[(($36)>>2)]=$34; //@line 237 "../../../src/go/partie.c"
 var $37=$2; //@line 238 "../../../src/go/partie.c"
 var $38=(($37+52)|0); //@line 238 "../../../src/go/partie.c"
 var $39=HEAP32[(($38)>>2)]; //@line 238 "../../../src/go/partie.c"
 var $40=($39|0)==0; //@line 238 "../../../src/go/partie.c"
 var $41=($40?1:0); //@line 238 "../../../src/go/partie.c"
 var $42=$2; //@line 238 "../../../src/go/partie.c"
 var $43=(($42+52)|0); //@line 238 "../../../src/go/partie.c"
 HEAP32[(($43)>>2)]=$41; //@line 238 "../../../src/go/partie.c"
 var $44=$2; //@line 240 "../../../src/go/partie.c"
 var $45=_partie_en_cours_de_handicap($44); //@line 240 "../../../src/go/partie.c"
  //@line 240 "../../../src/go/partie.c"
 do {
  if ($45) {
   var $47=$2; //@line 240 "../../../src/go/partie.c"
   var $48=(($47+52)|0); //@line 240 "../../../src/go/partie.c"
   var $49=HEAP32[(($48)>>2)]; //@line 240 "../../../src/go/partie.c"
   var $50=($49|0)==0; //@line 240 "../../../src/go/partie.c"
    //@line 240 "../../../src/go/partie.c"
   if (!($50)) {
    label = 6;
    break;
   }
   var $52=$2; //@line 241 "../../../src/go/partie.c"
   var $53=_partie_rejouer_coup($52); //@line 241 "../../../src/go/partie.c"
    //@line 242 "../../../src/go/partie.c"
  } else {
   label = 6;
  }
 } while(0);
 if (label == 6) {
  var $55=$2; //@line 242 "../../../src/go/partie.c"
  var $56=(($55+52)|0); //@line 242 "../../../src/go/partie.c"
  var $57=HEAP32[(($56)>>2)]; //@line 242 "../../../src/go/partie.c"
  var $58=$2; //@line 242 "../../../src/go/partie.c"
  var $59=(($58+4)|0); //@line 242 "../../../src/go/partie.c"
  var $60=(($59+((($57)*(20))&-1))|0); //@line 242 "../../../src/go/partie.c"
  var $61=(($60)|0); //@line 242 "../../../src/go/partie.c"
  var $62=HEAP32[(($61)>>2)]; //@line 242 "../../../src/go/partie.c"
  var $63=($62|0)==1; //@line 242 "../../../src/go/partie.c"
   //@line 242 "../../../src/go/partie.c"
  do {
   if ($63) {
    var $65=$2; //@line 242 "../../../src/go/partie.c"
    var $66=(($65+52)|0); //@line 242 "../../../src/go/partie.c"
    var $67=HEAP32[(($66)>>2)]; //@line 242 "../../../src/go/partie.c"
    var $68=($67|0)==0; //@line 242 "../../../src/go/partie.c"
    var $69=($68?1:0); //@line 242 "../../../src/go/partie.c"
    var $70=$2; //@line 242 "../../../src/go/partie.c"
    var $71=(($70+4)|0); //@line 242 "../../../src/go/partie.c"
    var $72=(($71+((($69)*(20))&-1))|0); //@line 242 "../../../src/go/partie.c"
    var $73=(($72)|0); //@line 242 "../../../src/go/partie.c"
    var $74=HEAP32[(($73)>>2)]; //@line 242 "../../../src/go/partie.c"
    var $75=($74|0)==0; //@line 242 "../../../src/go/partie.c"
     //@line 242 "../../../src/go/partie.c"
    if (!($75)) {
     break;
    }
    var $77=$2; //@line 245 "../../../src/go/partie.c"
    var $78=_partie_rejouer_coup($77); //@line 245 "../../../src/go/partie.c"
     //@line 246 "../../../src/go/partie.c"
   }
  } while(0);
 }
 var $81=$2; //@line 248 "../../../src/go/partie.c"
 _partie_informer_ordinateur($81); //@line 248 "../../../src/go/partie.c"
 $1=1; //@line 249 "../../../src/go/partie.c"
  //@line 249 "../../../src/go/partie.c"
 var $83=$1; //@line 250 "../../../src/go/partie.c"
 STACKTOP=sp;return $83; //@line 250 "../../../src/go/partie.c"
}


function _partie_score_joueurs($partie,$scores,$valKomi){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $taille;
 var $y;
 var $x;
 var $pos=sp;
 var $c;
 var $territoire;
 $1=$partie;
 $2=$scores;
 $3=$valKomi;
 var $4=$2; //@line 256 "../../../src/go/partie.c"
 var $5=(($4+4)|0); //@line 256 "../../../src/go/partie.c"
 HEAPF32[(($5)>>2)]=0; //@line 256 "../../../src/go/partie.c"
 var $6=$1; //@line 257 "../../../src/go/partie.c"
 var $7=(($6+44)|0); //@line 257 "../../../src/go/partie.c"
 var $8=HEAP32[(($7)>>2)]; //@line 257 "../../../src/go/partie.c"
 var $9=($8|0)<=1; //@line 257 "../../../src/go/partie.c"
  //@line 257 "../../../src/go/partie.c"
 if ($9) {
   //@line 257 "../../../src/go/partie.c"
  var $15=0.5;
 } else {
  var $12=$3; //@line 257 "../../../src/go/partie.c"
  var $13=$12; //@line 257 "../../../src/go/partie.c"
   //@line 257 "../../../src/go/partie.c"
  var $15=$13;
 }
 var $15; //@line 257 "../../../src/go/partie.c"
 var $16=$15; //@line 257 "../../../src/go/partie.c"
 var $17=$2; //@line 257 "../../../src/go/partie.c"
 var $18=(($17)|0); //@line 257 "../../../src/go/partie.c"
 HEAPF32[(($18)>>2)]=$16; //@line 257 "../../../src/go/partie.c"
 var $19=$1; //@line 258 "../../../src/go/partie.c"
 var $20=(($19)|0); //@line 258 "../../../src/go/partie.c"
 var $21=HEAP32[(($20)>>2)]; //@line 258 "../../../src/go/partie.c"
 var $22=_plateau_get_taille($21); //@line 258 "../../../src/go/partie.c"
 $taille=$22; //@line 258 "../../../src/go/partie.c"
 $y=0; //@line 259 "../../../src/go/partie.c"
  //@line 259 "../../../src/go/partie.c"
 while(1) {
  var $24=$y; //@line 259 "../../../src/go/partie.c"
  var $25=$taille; //@line 259 "../../../src/go/partie.c"
  var $26=($24|0)<($25|0); //@line 259 "../../../src/go/partie.c"
   //@line 259 "../../../src/go/partie.c"
  if (!($26)) {
   break;
  }
  $x=0; //@line 260 "../../../src/go/partie.c"
   //@line 260 "../../../src/go/partie.c"
  while(1) {
   var $29=$x; //@line 260 "../../../src/go/partie.c"
   var $30=$taille; //@line 260 "../../../src/go/partie.c"
   var $31=($29|0)<($30|0); //@line 260 "../../../src/go/partie.c"
    //@line 260 "../../../src/go/partie.c"
   if (!($31)) {
    break;
   }
   var $33=$x; //@line 261 "../../../src/go/partie.c"
   var $34=$y; //@line 261 "../../../src/go/partie.c"
   var $35=$taille; //@line 261 "../../../src/go/partie.c"
   _position($pos,$33,$34,$35); //@line 261 "../../../src/go/partie.c"
   var $36=$1; //@line 262 "../../../src/go/partie.c"
   var $37=(($36)|0); //@line 262 "../../../src/go/partie.c"
   var $38=HEAP32[(($37)>>2)]; //@line 262 "../../../src/go/partie.c"
   var $39=_plateau_get_at($38,$pos); //@line 262 "../../../src/go/partie.c"
   $c=$39; //@line 262 "../../../src/go/partie.c"
   var $40=$c; //@line 263 "../../../src/go/partie.c"
   var $41=($40|0)==2; //@line 263 "../../../src/go/partie.c"
    //@line 263 "../../../src/go/partie.c"
   if ($41) {
    var $43=$2; //@line 264 "../../../src/go/partie.c"
    var $44=(($43+4)|0); //@line 264 "../../../src/go/partie.c"
    var $45=HEAPF32[(($44)>>2)]; //@line 264 "../../../src/go/partie.c"
    var $46=($45)+(1); //@line 264 "../../../src/go/partie.c"
    HEAPF32[(($44)>>2)]=$46; //@line 264 "../../../src/go/partie.c"
     //@line 265 "../../../src/go/partie.c"
   } else {
    var $48=$c; //@line 265 "../../../src/go/partie.c"
    var $49=($48|0)==1; //@line 265 "../../../src/go/partie.c"
     //@line 265 "../../../src/go/partie.c"
    if ($49) {
     var $51=$2; //@line 266 "../../../src/go/partie.c"
     var $52=(($51)|0); //@line 266 "../../../src/go/partie.c"
     var $53=HEAPF32[(($52)>>2)]; //@line 266 "../../../src/go/partie.c"
     var $54=($53)+(1); //@line 266 "../../../src/go/partie.c"
     HEAPF32[(($52)>>2)]=$54; //@line 266 "../../../src/go/partie.c"
      //@line 267 "../../../src/go/partie.c"
    } else {
     var $56=$1; //@line 268 "../../../src/go/partie.c"
     var $57=(($56)|0); //@line 268 "../../../src/go/partie.c"
     var $58=HEAP32[(($57)>>2)]; //@line 268 "../../../src/go/partie.c"
     var $59=_determiner_territoire($58,$pos); //@line 268 "../../../src/go/partie.c"
     $territoire=$59; //@line 268 "../../../src/go/partie.c"
     var $60=$territoire; //@line 269 "../../../src/go/partie.c"
     var $61=_ensemble_colore_couleur($60); //@line 269 "../../../src/go/partie.c"
     var $62=($61|0)==2; //@line 269 "../../../src/go/partie.c"
      //@line 269 "../../../src/go/partie.c"
     if ($62) {
      var $64=$2; //@line 270 "../../../src/go/partie.c"
      var $65=(($64+4)|0); //@line 270 "../../../src/go/partie.c"
      var $66=HEAPF32[(($65)>>2)]; //@line 270 "../../../src/go/partie.c"
      var $67=($66)+(1); //@line 270 "../../../src/go/partie.c"
      HEAPF32[(($65)>>2)]=$67; //@line 270 "../../../src/go/partie.c"
       //@line 271 "../../../src/go/partie.c"
     } else {
      var $69=$territoire; //@line 271 "../../../src/go/partie.c"
      var $70=_ensemble_colore_couleur($69); //@line 271 "../../../src/go/partie.c"
      var $71=($70|0)==1; //@line 271 "../../../src/go/partie.c"
       //@line 271 "../../../src/go/partie.c"
      if ($71) {
       var $73=$2; //@line 272 "../../../src/go/partie.c"
       var $74=(($73)|0); //@line 272 "../../../src/go/partie.c"
       var $75=HEAPF32[(($74)>>2)]; //@line 272 "../../../src/go/partie.c"
       var $76=($75)+(1); //@line 272 "../../../src/go/partie.c"
       HEAPF32[(($74)>>2)]=$76; //@line 272 "../../../src/go/partie.c"
        //@line 273 "../../../src/go/partie.c"
      }
     }
     var $79=$territoire; //@line 274 "../../../src/go/partie.c"
     _detruire_ensemble_colore($79); //@line 274 "../../../src/go/partie.c"
    }
   }
    //@line 276 "../../../src/go/partie.c"
   var $83=$x; //@line 260 "../../../src/go/partie.c"
   var $84=((($83)+(1))|0); //@line 260 "../../../src/go/partie.c"
   $x=$84; //@line 260 "../../../src/go/partie.c"
    //@line 260 "../../../src/go/partie.c"
  }
   //@line 277 "../../../src/go/partie.c"
  var $87=$y; //@line 259 "../../../src/go/partie.c"
  var $88=((($87)+(1))|0); //@line 259 "../../../src/go/partie.c"
  $y=$88; //@line 259 "../../../src/go/partie.c"
   //@line 259 "../../../src/go/partie.c"
 }
 STACKTOP=sp;return; //@line 278 "../../../src/go/partie.c"
}


function _impl_get_nbCases($taille){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $tailleCasesEnBits;
 var $tailleUneCaseEnBits;
 var $nbCases;
 $1=$taille;
 var $2=$1; //@line 51 "../../../src/go/plateau.c"
 var $3=$1; //@line 51 "../../../src/go/plateau.c"
 var $4=(Math_imul($2,$3)|0); //@line 51 "../../../src/go/plateau.c"
 var $5=($4<<1); //@line 51 "../../../src/go/plateau.c"
 $tailleCasesEnBits=$5; //@line 51 "../../../src/go/plateau.c"
 $tailleUneCaseEnBits=32; //@line 52 "../../../src/go/plateau.c"
 var $6=$tailleCasesEnBits; //@line 53 "../../../src/go/plateau.c"
 var $7=$tailleUneCaseEnBits; //@line 53 "../../../src/go/plateau.c"
 var $8=((($6)+($7))|0); //@line 53 "../../../src/go/plateau.c"
 var $9=((($8)-(1))|0); //@line 53 "../../../src/go/plateau.c"
 var $10=$tailleUneCaseEnBits; //@line 53 "../../../src/go/plateau.c"
 var $11=(((($9>>>0))/(($10>>>0)))&-1); //@line 53 "../../../src/go/plateau.c"
 $nbCases=$11; //@line 53 "../../../src/go/plateau.c"
 var $12=$nbCases; //@line 54 "../../../src/go/plateau.c"
 STACKTOP=sp;return $12; //@line 54 "../../../src/go/plateau.c"
}


function _plateau_data_size($taille){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$taille;
 var $2=$1; //@line 59 "../../../src/go/plateau.c"
 var $3=_impl_get_nbCases($2); //@line 59 "../../../src/go/plateau.c"
 var $4=($3<<2); //@line 59 "../../../src/go/plateau.c"
 STACKTOP=sp;return $4; //@line 59 "../../../src/go/plateau.c"
}


function _creer_plateau($taille){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $plateau;
 var $nbCases;
 $1=$taille;
 var $2=_gosh_alloc_size(8); //@line 64 "../../../src/go/plateau.c"
 var $3=$2; //@line 64 "../../../src/go/plateau.c"
 $plateau=$3; //@line 64 "../../../src/go/plateau.c"
 var $4=$1; //@line 65 "../../../src/go/plateau.c"
 var $5=$plateau; //@line 65 "../../../src/go/plateau.c"
 var $6=(($5+4)|0); //@line 65 "../../../src/go/plateau.c"
 HEAP32[(($6)>>2)]=$4; //@line 65 "../../../src/go/plateau.c"
 var $7=$1; //@line 66 "../../../src/go/plateau.c"
 var $8=_impl_get_nbCases($7); //@line 66 "../../../src/go/plateau.c"
 $nbCases=$8; //@line 66 "../../../src/go/plateau.c"
 var $9=$nbCases; //@line 67 "../../../src/go/plateau.c"
 var $10=($9<<2); //@line 67 "../../../src/go/plateau.c"
 var $11=_gosh_alloc_size($10); //@line 67 "../../../src/go/plateau.c"
 var $12=$11; //@line 67 "../../../src/go/plateau.c"
 var $13=$plateau; //@line 67 "../../../src/go/plateau.c"
 var $14=(($13)|0); //@line 67 "../../../src/go/plateau.c"
 HEAP32[(($14)>>2)]=$12; //@line 67 "../../../src/go/plateau.c"
 var $15=$plateau; //@line 68 "../../../src/go/plateau.c"
 var $16=(($15)|0); //@line 68 "../../../src/go/plateau.c"
 var $17=HEAP32[(($16)>>2)]; //@line 68 "../../../src/go/plateau.c"
 var $18=$17; //@line 68 "../../../src/go/plateau.c"
 var $19=$nbCases; //@line 68 "../../../src/go/plateau.c"
 var $20=($19<<2); //@line 68 "../../../src/go/plateau.c"
 _memset($18, 0, $20)|0; //@line 68 "../../../src/go/plateau.c"
 var $21=$plateau; //@line 69 "../../../src/go/plateau.c"
 STACKTOP=sp;return $21; //@line 69 "../../../src/go/plateau.c"
}


function _detruire_plateau($plateau){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$plateau;
 var $2=$1; //@line 74 "../../../src/go/plateau.c"
 var $3=(($2)|0); //@line 74 "../../../src/go/plateau.c"
 var $4=HEAP32[(($3)>>2)]; //@line 74 "../../../src/go/plateau.c"
 var $5=$4; //@line 74 "../../../src/go/plateau.c"
 _gosh_free($5); //@line 74 "../../../src/go/plateau.c"
 var $6=$1; //@line 75 "../../../src/go/plateau.c"
 var $7=$6; //@line 75 "../../../src/go/plateau.c"
 _gosh_free($7); //@line 75 "../../../src/go/plateau.c"
 STACKTOP=sp;return; //@line 76 "../../../src/go/plateau.c"
}


function _plateau_get($plateau,$i,$j){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $pos;
 var $offset;
 var $partie;
 $1=$plateau;
 $2=$i;
 $3=$j;
 var $4=$2; //@line 82 "../../../src/go/plateau.c"
 var $5=($4|0)>=0; //@line 82 "../../../src/go/plateau.c"
  //@line 82 "../../../src/go/plateau.c"
 if ($5) {
  var $9=0;
 } else {
  ___assert_fail(1304,1272,82,1384); //@line 82 "../../../src/go/plateau.c"
  throw "Reached an unreachable!"; //@line 82 "../../../src/go/plateau.c"
   //@line 82 "../../../src/go/plateau.c"
 }
 var $9;
 var $10=($9&1); //@line 82 "../../../src/go/plateau.c"
 var $11=$3; //@line 83 "../../../src/go/plateau.c"
 var $12=($11|0)>=0; //@line 83 "../../../src/go/plateau.c"
  //@line 83 "../../../src/go/plateau.c"
 if ($12) {
  var $16=1;
 } else {
  ___assert_fail(704,1272,83,1384); //@line 83 "../../../src/go/plateau.c"
  throw "Reached an unreachable!"; //@line 83 "../../../src/go/plateau.c"
   //@line 83 "../../../src/go/plateau.c"
 }
 var $16;
 var $17=($16&1); //@line 83 "../../../src/go/plateau.c"
 var $18=$2; //@line 84 "../../../src/go/plateau.c"
 var $19=$1; //@line 84 "../../../src/go/plateau.c"
 var $20=(($19+4)|0); //@line 84 "../../../src/go/plateau.c"
 var $21=HEAP32[(($20)>>2)]; //@line 84 "../../../src/go/plateau.c"
 var $22=($18|0)<($21|0); //@line 84 "../../../src/go/plateau.c"
  //@line 84 "../../../src/go/plateau.c"
 if ($22) {
  var $26=1;
 } else {
  ___assert_fail(488,1272,84,1384); //@line 84 "../../../src/go/plateau.c"
  throw "Reached an unreachable!"; //@line 84 "../../../src/go/plateau.c"
   //@line 84 "../../../src/go/plateau.c"
 }
 var $26;
 var $27=($26&1); //@line 84 "../../../src/go/plateau.c"
 var $28=$3; //@line 85 "../../../src/go/plateau.c"
 var $29=$1; //@line 85 "../../../src/go/plateau.c"
 var $30=(($29+4)|0); //@line 85 "../../../src/go/plateau.c"
 var $31=HEAP32[(($30)>>2)]; //@line 85 "../../../src/go/plateau.c"
 var $32=($28|0)<($31|0); //@line 85 "../../../src/go/plateau.c"
  //@line 85 "../../../src/go/plateau.c"
 if ($32) {
  var $36=1;
 } else {
  ___assert_fail(376,1272,85,1384); //@line 85 "../../../src/go/plateau.c"
  throw "Reached an unreachable!"; //@line 85 "../../../src/go/plateau.c"
   //@line 85 "../../../src/go/plateau.c"
 }
 var $36;
 var $37=($36&1); //@line 85 "../../../src/go/plateau.c"
 var $38=$2; //@line 86 "../../../src/go/plateau.c"
 var $39=$1; //@line 86 "../../../src/go/plateau.c"
 var $40=(($39+4)|0); //@line 86 "../../../src/go/plateau.c"
 var $41=HEAP32[(($40)>>2)]; //@line 86 "../../../src/go/plateau.c"
 var $42=(Math_imul($38,$41)|0); //@line 86 "../../../src/go/plateau.c"
 var $43=$3; //@line 86 "../../../src/go/plateau.c"
 var $44=((($42)+($43))|0); //@line 86 "../../../src/go/plateau.c"
 var $45=(($44)&65535); //@line 86 "../../../src/go/plateau.c"
 $pos=$45; //@line 86 "../../../src/go/plateau.c"
 var $46=$pos; //@line 87 "../../../src/go/plateau.c"
 var $47=($46&65535); //@line 87 "../../../src/go/plateau.c"
 var $48=HEAP32[((16)>>2)]; //@line 87 "../../../src/go/plateau.c"
 var $49=(((($47>>>0))/(($48>>>0)))&-1); //@line 87 "../../../src/go/plateau.c"
 $offset=$49; //@line 87 "../../../src/go/plateau.c"
 var $50=$offset; //@line 88 "../../../src/go/plateau.c"
 var $51=$1; //@line 88 "../../../src/go/plateau.c"
 var $52=(($51)|0); //@line 88 "../../../src/go/plateau.c"
 var $53=HEAP32[(($52)>>2)]; //@line 88 "../../../src/go/plateau.c"
 var $54=(($53+($50<<2))|0); //@line 88 "../../../src/go/plateau.c"
 var $55=HEAP32[(($54)>>2)]; //@line 88 "../../../src/go/plateau.c"
 $partie=$55; //@line 88 "../../../src/go/plateau.c"
 var $56=$offset; //@line 89 "../../../src/go/plateau.c"
 var $57=HEAP32[((16)>>2)]; //@line 89 "../../../src/go/plateau.c"
 var $58=(Math_imul($56,$57)|0); //@line 89 "../../../src/go/plateau.c"
 var $59=$pos; //@line 89 "../../../src/go/plateau.c"
 var $60=($59&65535); //@line 89 "../../../src/go/plateau.c"
 var $61=((($60)-($58))|0); //@line 89 "../../../src/go/plateau.c"
 var $62=(($61)&65535); //@line 89 "../../../src/go/plateau.c"
 $pos=$62; //@line 89 "../../../src/go/plateau.c"
 var $63=$partie; //@line 90 "../../../src/go/plateau.c"
 var $64=$pos; //@line 90 "../../../src/go/plateau.c"
 var $65=($64&65535); //@line 90 "../../../src/go/plateau.c"
 var $66=($65<<1); //@line 90 "../../../src/go/plateau.c"
 var $67=3<<$66; //@line 90 "../../../src/go/plateau.c"
 var $68=$63&$67; //@line 90 "../../../src/go/plateau.c"
 var $69=$pos; //@line 90 "../../../src/go/plateau.c"
 var $70=($69&65535); //@line 90 "../../../src/go/plateau.c"
 var $71=($70<<1); //@line 90 "../../../src/go/plateau.c"
 var $72=$68>>>($71>>>0); //@line 90 "../../../src/go/plateau.c"
 STACKTOP=sp;return $72; //@line 90 "../../../src/go/plateau.c"
}


function _plateau_get_at($plateau,$pos){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $pos; $pos=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($pos)>>2)]=HEAP32[((tempParam)>>2)];
 var $1;
 $1=$plateau;
 var $2=$1; //@line 95 "../../../src/go/plateau.c"
 var $3=(($pos)|0); //@line 95 "../../../src/go/plateau.c"
 var $4=HEAP8[($3)]; //@line 95 "../../../src/go/plateau.c"
 var $5=(($4<<24)>>24); //@line 95 "../../../src/go/plateau.c"
 var $6=(($pos+1)|0); //@line 95 "../../../src/go/plateau.c"
 var $7=HEAP8[($6)]; //@line 95 "../../../src/go/plateau.c"
 var $8=(($7<<24)>>24); //@line 95 "../../../src/go/plateau.c"
 var $9=_plateau_get($2,$5,$8); //@line 95 "../../../src/go/plateau.c"
 STACKTOP=sp;return $9; //@line 95 "../../../src/go/plateau.c"
}


function _plateau_set($plateau,$i,$j,$couleur){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $4;
 var $pos;
 var $offset;
 var $partie;
 $1=$plateau;
 $2=$i;
 $3=$j;
 $4=$couleur;
 var $5=$2; //@line 101 "../../../src/go/plateau.c"
 var $6=($5|0)>=0; //@line 101 "../../../src/go/plateau.c"
  //@line 101 "../../../src/go/plateau.c"
 if ($6) {
  var $10=0;
 } else {
  ___assert_fail(1304,1272,101,1368); //@line 101 "../../../src/go/plateau.c"
  throw "Reached an unreachable!"; //@line 101 "../../../src/go/plateau.c"
   //@line 101 "../../../src/go/plateau.c"
 }
 var $10;
 var $11=($10&1); //@line 101 "../../../src/go/plateau.c"
 var $12=$3; //@line 102 "../../../src/go/plateau.c"
 var $13=($12|0)>=0; //@line 102 "../../../src/go/plateau.c"
  //@line 102 "../../../src/go/plateau.c"
 if ($13) {
  var $17=1;
 } else {
  ___assert_fail(704,1272,102,1368); //@line 102 "../../../src/go/plateau.c"
  throw "Reached an unreachable!"; //@line 102 "../../../src/go/plateau.c"
   //@line 102 "../../../src/go/plateau.c"
 }
 var $17;
 var $18=($17&1); //@line 102 "../../../src/go/plateau.c"
 var $19=$2; //@line 103 "../../../src/go/plateau.c"
 var $20=$1; //@line 103 "../../../src/go/plateau.c"
 var $21=(($20+4)|0); //@line 103 "../../../src/go/plateau.c"
 var $22=HEAP32[(($21)>>2)]; //@line 103 "../../../src/go/plateau.c"
 var $23=($19|0)<($22|0); //@line 103 "../../../src/go/plateau.c"
  //@line 103 "../../../src/go/plateau.c"
 if ($23) {
  var $27=1;
 } else {
  ___assert_fail(488,1272,103,1368); //@line 103 "../../../src/go/plateau.c"
  throw "Reached an unreachable!"; //@line 103 "../../../src/go/plateau.c"
   //@line 103 "../../../src/go/plateau.c"
 }
 var $27;
 var $28=($27&1); //@line 103 "../../../src/go/plateau.c"
 var $29=$3; //@line 104 "../../../src/go/plateau.c"
 var $30=$1; //@line 104 "../../../src/go/plateau.c"
 var $31=(($30+4)|0); //@line 104 "../../../src/go/plateau.c"
 var $32=HEAP32[(($31)>>2)]; //@line 104 "../../../src/go/plateau.c"
 var $33=($29|0)<($32|0); //@line 104 "../../../src/go/plateau.c"
  //@line 104 "../../../src/go/plateau.c"
 if ($33) {
  var $37=1;
 } else {
  ___assert_fail(376,1272,104,1368); //@line 104 "../../../src/go/plateau.c"
  throw "Reached an unreachable!"; //@line 104 "../../../src/go/plateau.c"
   //@line 104 "../../../src/go/plateau.c"
 }
 var $37;
 var $38=($37&1); //@line 104 "../../../src/go/plateau.c"
 var $39=$2; //@line 105 "../../../src/go/plateau.c"
 var $40=$1; //@line 105 "../../../src/go/plateau.c"
 var $41=(($40+4)|0); //@line 105 "../../../src/go/plateau.c"
 var $42=HEAP32[(($41)>>2)]; //@line 105 "../../../src/go/plateau.c"
 var $43=(Math_imul($39,$42)|0); //@line 105 "../../../src/go/plateau.c"
 var $44=$3; //@line 105 "../../../src/go/plateau.c"
 var $45=((($43)+($44))|0); //@line 105 "../../../src/go/plateau.c"
 var $46=(($45)&65535); //@line 105 "../../../src/go/plateau.c"
 $pos=$46; //@line 105 "../../../src/go/plateau.c"
 var $47=$pos; //@line 106 "../../../src/go/plateau.c"
 var $48=($47&65535); //@line 106 "../../../src/go/plateau.c"
 var $49=HEAP32[((8)>>2)]; //@line 106 "../../../src/go/plateau.c"
 var $50=(((($48>>>0))/(($49>>>0)))&-1); //@line 106 "../../../src/go/plateau.c"
 $offset=$50; //@line 106 "../../../src/go/plateau.c"
 var $51=$1; //@line 107 "../../../src/go/plateau.c"
 var $52=(($51)|0); //@line 107 "../../../src/go/plateau.c"
 var $53=HEAP32[(($52)>>2)]; //@line 107 "../../../src/go/plateau.c"
 var $54=$offset; //@line 107 "../../../src/go/plateau.c"
 var $55=(($53+($54<<2))|0); //@line 107 "../../../src/go/plateau.c"
 $partie=$55; //@line 107 "../../../src/go/plateau.c"
 var $56=$offset; //@line 108 "../../../src/go/plateau.c"
 var $57=HEAP32[((8)>>2)]; //@line 108 "../../../src/go/plateau.c"
 var $58=(Math_imul($56,$57)|0); //@line 108 "../../../src/go/plateau.c"
 var $59=$pos; //@line 108 "../../../src/go/plateau.c"
 var $60=($59&65535); //@line 108 "../../../src/go/plateau.c"
 var $61=((($60)-($58))|0); //@line 108 "../../../src/go/plateau.c"
 var $62=(($61)&65535); //@line 108 "../../../src/go/plateau.c"
 $pos=$62; //@line 108 "../../../src/go/plateau.c"
 var $63=$partie; //@line 110 "../../../src/go/plateau.c"
 var $64=HEAP32[(($63)>>2)]; //@line 110 "../../../src/go/plateau.c"
 var $65=$64^-1; //@line 110 "../../../src/go/plateau.c"
 var $66=$pos; //@line 110 "../../../src/go/plateau.c"
 var $67=($66&65535); //@line 110 "../../../src/go/plateau.c"
 var $68=($67<<1); //@line 110 "../../../src/go/plateau.c"
 var $69=3<<$68; //@line 110 "../../../src/go/plateau.c"
 var $70=$65|$69; //@line 110 "../../../src/go/plateau.c"
 var $71=$70^-1; //@line 110 "../../../src/go/plateau.c"
 var $72=$partie; //@line 110 "../../../src/go/plateau.c"
 HEAP32[(($72)>>2)]=$71; //@line 110 "../../../src/go/plateau.c"
 var $73=$4; //@line 111 "../../../src/go/plateau.c"
 var $74=$pos; //@line 111 "../../../src/go/plateau.c"
 var $75=($74&65535); //@line 111 "../../../src/go/plateau.c"
 var $76=($75<<1); //@line 111 "../../../src/go/plateau.c"
 var $77=$73<<$76; //@line 111 "../../../src/go/plateau.c"
 var $78=$partie; //@line 111 "../../../src/go/plateau.c"
 var $79=HEAP32[(($78)>>2)]; //@line 111 "../../../src/go/plateau.c"
 var $80=$79^$77; //@line 111 "../../../src/go/plateau.c"
 HEAP32[(($78)>>2)]=$80; //@line 111 "../../../src/go/plateau.c"
 STACKTOP=sp;return; //@line 112 "../../../src/go/plateau.c"
}


function _plateau_set_at($plateau,$pos,$couleur){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $pos; $pos=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($pos)>>2)]=HEAP32[((tempParam)>>2)];
 var $1;
 var $2;
 $1=$plateau;
 $2=$couleur;
 var $3=$1; //@line 116 "../../../src/go/plateau.c"
 var $4=(($pos)|0); //@line 116 "../../../src/go/plateau.c"
 var $5=HEAP8[($4)]; //@line 116 "../../../src/go/plateau.c"
 var $6=(($5<<24)>>24); //@line 116 "../../../src/go/plateau.c"
 var $7=(($pos+1)|0); //@line 116 "../../../src/go/plateau.c"
 var $8=HEAP8[($7)]; //@line 116 "../../../src/go/plateau.c"
 var $9=(($8<<24)>>24); //@line 116 "../../../src/go/plateau.c"
 var $10=$2; //@line 116 "../../../src/go/plateau.c"
 _plateau_set($3,$6,$9,$10); //@line 116 "../../../src/go/plateau.c"
 STACKTOP=sp;return; //@line 117 "../../../src/go/plateau.c"
}


function _plateau_get_taille($plateau){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$plateau;
 var $2=$1; //@line 121 "../../../src/go/plateau.c"
 var $3=(($2+4)|0); //@line 121 "../../../src/go/plateau.c"
 var $4=HEAP32[(($3)>>2)]; //@line 121 "../../../src/go/plateau.c"
 STACKTOP=sp;return $4; //@line 121 "../../../src/go/plateau.c"
}


function _plateau_determiner_chaine($plateau,$pos){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+24)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $pos; $pos=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($pos)>>2)]=HEAP32[((tempParam)>>2)];
 var $1;
 var $2;
 var $couleur;
 var $chaine;
 var $positions_chaine;
 var $possibles;
 var $courante=sp;
 var $a_tester=(sp)+(8);
 var $p;
 $2=$plateau;
 var $3=$2; //@line 126 "../../../src/go/plateau.c"
 var $4=_plateau_get_at($3,$pos); //@line 126 "../../../src/go/plateau.c"
 $couleur=$4; //@line 126 "../../../src/go/plateau.c"
 var $5=$couleur; //@line 128 "../../../src/go/plateau.c"
 var $6=($5|0)==0; //@line 128 "../../../src/go/plateau.c"
  //@line 128 "../../../src/go/plateau.c"
 if ($6) {
  $1=0; //@line 129 "../../../src/go/plateau.c"
   //@line 129 "../../../src/go/plateau.c"
  var $71=$1; //@line 154 "../../../src/go/plateau.c"
  STACKTOP=sp;return $71; //@line 154 "../../../src/go/plateau.c"
 }
 var $9=$couleur; //@line 131 "../../../src/go/plateau.c"
 var $10=_creer_ensemble_colore($9); //@line 131 "../../../src/go/plateau.c"
 $chaine=$10; //@line 131 "../../../src/go/plateau.c"
 var $11=$chaine; //@line 132 "../../../src/go/plateau.c"
 var $12=_ensemble_colore_positions($11); //@line 132 "../../../src/go/plateau.c"
 $positions_chaine=$12; //@line 132 "../../../src/go/plateau.c"
 var $13=_creer_ensemble_position(); //@line 135 "../../../src/go/plateau.c"
 $possibles=$13; //@line 135 "../../../src/go/plateau.c"
 var $14=$possibles; //@line 136 "../../../src/go/plateau.c"
 var $15=(($14+12)|0); //@line 136 "../../../src/go/plateau.c"
 var $16=HEAP32[(($15)>>2)]; //@line 136 "../../../src/go/plateau.c"
 var $17=$possibles; //@line 136 "../../../src/go/plateau.c"
 FUNCTION_TABLE[$16]($17,$pos); //@line 136 "../../../src/go/plateau.c"
  //@line 137 "../../../src/go/plateau.c"
 while(1) {
  var $19=$possibles; //@line 137 "../../../src/go/plateau.c"
  var $20=(($19+8)|0); //@line 137 "../../../src/go/plateau.c"
  var $21=HEAP32[(($20)>>2)]; //@line 137 "../../../src/go/plateau.c"
  var $22=$possibles; //@line 137 "../../../src/go/plateau.c"
  var $23=FUNCTION_TABLE[$21]($22); //@line 137 "../../../src/go/plateau.c"
  var $24=$23^1; //@line 137 "../../../src/go/plateau.c"
   //@line 137 "../../../src/go/plateau.c"
  if (!($24)) {
   break;
  }
  var $26=$possibles; //@line 138 "../../../src/go/plateau.c"
  _ensemble_position_supprimer_tete($courante,$26); //@line 138 "../../../src/go/plateau.c"
  var $27=$2; //@line 139 "../../../src/go/plateau.c"
  var $28=_plateau_get_at($27,$courante); //@line 139 "../../../src/go/plateau.c"
  var $29=$couleur; //@line 139 "../../../src/go/plateau.c"
  var $30=($28|0)==($29|0); //@line 139 "../../../src/go/plateau.c"
   //@line 139 "../../../src/go/plateau.c"
  if ($30) {
   var $32=$positions_chaine; //@line 140 "../../../src/go/plateau.c"
   var $33=(($32+16)|0); //@line 140 "../../../src/go/plateau.c"
   var $34=HEAP32[(($33)>>2)]; //@line 140 "../../../src/go/plateau.c"
   var $35=$positions_chaine; //@line 140 "../../../src/go/plateau.c"
   var $36=FUNCTION_TABLE[$34]($35,$courante); //@line 140 "../../../src/go/plateau.c"
    //@line 140 "../../../src/go/plateau.c"
   if (!($36)) {
    var $38=$positions_chaine; //@line 141 "../../../src/go/plateau.c"
    var $39=(($38+12)|0); //@line 141 "../../../src/go/plateau.c"
    var $40=HEAP32[(($39)>>2)]; //@line 141 "../../../src/go/plateau.c"
    var $41=$positions_chaine; //@line 141 "../../../src/go/plateau.c"
    FUNCTION_TABLE[$40]($41,$courante); //@line 141 "../../../src/go/plateau.c"
    var $42=(($a_tester)|0); //@line 143 "../../../src/go/plateau.c"
    _position_gauche($42,$courante); //@line 143 "../../../src/go/plateau.c"
    var $43=(($42+4)|0); //@line 143 "../../../src/go/plateau.c"
    _position_droite($43,$courante); //@line 143 "../../../src/go/plateau.c"
    var $44=(($43+4)|0); //@line 143 "../../../src/go/plateau.c"
    _position_haut($44,$courante); //@line 143 "../../../src/go/plateau.c"
    var $45=(($44+4)|0); //@line 143 "../../../src/go/plateau.c"
    _position_bas($45,$courante); //@line 143 "../../../src/go/plateau.c"
    $p=0; //@line 144 "../../../src/go/plateau.c"
     //@line 144 "../../../src/go/plateau.c"
    while(1) {
     var $47=$p; //@line 144 "../../../src/go/plateau.c"
     var $48=($47|0)<4; //@line 144 "../../../src/go/plateau.c"
      //@line 144 "../../../src/go/plateau.c"
     if (!($48)) {
      break;
     }
     var $50=$p; //@line 145 "../../../src/go/plateau.c"
     var $51=(($a_tester+($50<<2))|0); //@line 145 "../../../src/go/plateau.c"
     var $52=_position_est_valide($51); //@line 145 "../../../src/go/plateau.c"
      //@line 145 "../../../src/go/plateau.c"
     if ($52) {
      var $54=$possibles; //@line 146 "../../../src/go/plateau.c"
      var $55=(($54+12)|0); //@line 146 "../../../src/go/plateau.c"
      var $56=HEAP32[(($55)>>2)]; //@line 146 "../../../src/go/plateau.c"
      var $57=$possibles; //@line 146 "../../../src/go/plateau.c"
      var $58=$p; //@line 146 "../../../src/go/plateau.c"
      var $59=(($a_tester+($58<<2))|0); //@line 146 "../../../src/go/plateau.c"
      FUNCTION_TABLE[$56]($57,$59); //@line 146 "../../../src/go/plateau.c"
       //@line 146 "../../../src/go/plateau.c"
     }
      //@line 147 "../../../src/go/plateau.c"
     var $62=$p; //@line 144 "../../../src/go/plateau.c"
     var $63=((($62)+(1))|0); //@line 144 "../../../src/go/plateau.c"
     $p=$63; //@line 144 "../../../src/go/plateau.c"
      //@line 144 "../../../src/go/plateau.c"
    }
     //@line 148 "../../../src/go/plateau.c"
   }
    //@line 149 "../../../src/go/plateau.c"
  }
   //@line 150 "../../../src/go/plateau.c"
 }
 var $68=$possibles; //@line 151 "../../../src/go/plateau.c"
 _detruire_ensemble_position($68); //@line 151 "../../../src/go/plateau.c"
 var $69=$chaine; //@line 153 "../../../src/go/plateau.c"
 $1=$69; //@line 153 "../../../src/go/plateau.c"
  //@line 153 "../../../src/go/plateau.c"
 var $71=$1; //@line 154 "../../../src/go/plateau.c"
 STACKTOP=sp;return $71; //@line 154 "../../../src/go/plateau.c"
}


function _plateau_realiser_capture($plateau,$chaine){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $position=sp;
 var $it=(sp)+(8);
 $1=$plateau;
 $2=$chaine;
 var $3=$2; //@line 159 "../../../src/go/plateau.c"
 var $4=(($3+4)|0); //@line 159 "../../../src/go/plateau.c"
 var $5=HEAP32[(($4)>>2)]; //@line 159 "../../../src/go/plateau.c"
 FUNCTION_TABLE[$5]($it); //@line 159 "../../../src/go/plateau.c"
  //@line 159 "../../../src/go/plateau.c"
 while(1) {
  var $7=$2; //@line 159 "../../../src/go/plateau.c"
  var $8=(($7)|0); //@line 159 "../../../src/go/plateau.c"
  var $9=HEAP32[(($8)>>2)]; //@line 159 "../../../src/go/plateau.c"
  var $10=$2; //@line 159 "../../../src/go/plateau.c"
  var $11=FUNCTION_TABLE[$9]($it,$10,$position); //@line 159 "../../../src/go/plateau.c"
  var $12=($11|0)!=0; //@line 159 "../../../src/go/plateau.c"
   //@line 159 "../../../src/go/plateau.c"
  if (!($12)) {
   break;
  }
  var $14=$1; //@line 160 "../../../src/go/plateau.c"
  _plateau_set_at($14,$position,0); //@line 160 "../../../src/go/plateau.c"
   //@line 161 "../../../src/go/plateau.c"
 }
 STACKTOP=sp;return; //@line 162 "../../../src/go/plateau.c"
}


function _plateau_est_identique($plateau,$ancienPlateau){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 $2=$plateau;
 $3=$ancienPlateau;
 var $4=$2; //@line 166 "../../../src/go/plateau.c"
 var $5=(($4+4)|0); //@line 166 "../../../src/go/plateau.c"
 var $6=HEAP32[(($5)>>2)]; //@line 166 "../../../src/go/plateau.c"
 var $7=$3; //@line 166 "../../../src/go/plateau.c"
 var $8=(($7+4)|0); //@line 166 "../../../src/go/plateau.c"
 var $9=HEAP32[(($8)>>2)]; //@line 166 "../../../src/go/plateau.c"
 var $10=($6|0)!=($9|0); //@line 166 "../../../src/go/plateau.c"
  //@line 166 "../../../src/go/plateau.c"
 if ($10) {
  $1=0; //@line 167 "../../../src/go/plateau.c"
   //@line 167 "../../../src/go/plateau.c"
  var $29=$1; //@line 172 "../../../src/go/plateau.c"
  STACKTOP=sp;return $29; //@line 172 "../../../src/go/plateau.c"
 } else {
  var $13=$2; //@line 169 "../../../src/go/plateau.c"
  var $14=(($13)|0); //@line 169 "../../../src/go/plateau.c"
  var $15=HEAP32[(($14)>>2)]; //@line 169 "../../../src/go/plateau.c"
  var $16=$15; //@line 169 "../../../src/go/plateau.c"
  var $17=$3; //@line 169 "../../../src/go/plateau.c"
  var $18=(($17)|0); //@line 169 "../../../src/go/plateau.c"
  var $19=HEAP32[(($18)>>2)]; //@line 169 "../../../src/go/plateau.c"
  var $20=$19; //@line 169 "../../../src/go/plateau.c"
  var $21=$2; //@line 171 "../../../src/go/plateau.c"
  var $22=(($21+4)|0); //@line 171 "../../../src/go/plateau.c"
  var $23=HEAP32[(($22)>>2)]; //@line 171 "../../../src/go/plateau.c"
  var $24=_plateau_data_size($23); //@line 171 "../../../src/go/plateau.c"
  var $25=_memcmp($16,$20,$24); //@line 171 "../../../src/go/plateau.c"
  var $26=($25|0)!=0; //@line 171 "../../../src/go/plateau.c"
  var $27=$26^1; //@line 171 "../../../src/go/plateau.c"
  $1=$27; //@line 171 "../../../src/go/plateau.c"
   //@line 171 "../../../src/go/plateau.c"
  var $29=$1; //@line 172 "../../../src/go/plateau.c"
  STACKTOP=sp;return $29; //@line 172 "../../../src/go/plateau.c"
 }
}


function _plateau_copie($from,$to){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $nbCases;
 $1=$from;
 $2=$to;
 var $3=$2; //@line 176 "../../../src/go/plateau.c"
 var $4=(($3+4)|0); //@line 176 "../../../src/go/plateau.c"
 var $5=HEAP32[(($4)>>2)]; //@line 176 "../../../src/go/plateau.c"
 var $6=$1; //@line 176 "../../../src/go/plateau.c"
 var $7=(($6+4)|0); //@line 176 "../../../src/go/plateau.c"
 var $8=HEAP32[(($7)>>2)]; //@line 176 "../../../src/go/plateau.c"
 var $9=($5|0)!=($8|0); //@line 176 "../../../src/go/plateau.c"
  //@line 176 "../../../src/go/plateau.c"
 if ($9) {
  var $11=$1; //@line 177 "../../../src/go/plateau.c"
  var $12=(($11+4)|0); //@line 177 "../../../src/go/plateau.c"
  var $13=HEAP32[(($12)>>2)]; //@line 177 "../../../src/go/plateau.c"
  var $14=_impl_get_nbCases($13); //@line 177 "../../../src/go/plateau.c"
  $nbCases=$14; //@line 177 "../../../src/go/plateau.c"
  var $15=$1; //@line 178 "../../../src/go/plateau.c"
  var $16=(($15+4)|0); //@line 178 "../../../src/go/plateau.c"
  var $17=HEAP32[(($16)>>2)]; //@line 178 "../../../src/go/plateau.c"
  var $18=$2; //@line 178 "../../../src/go/plateau.c"
  var $19=(($18+4)|0); //@line 178 "../../../src/go/plateau.c"
  HEAP32[(($19)>>2)]=$17; //@line 178 "../../../src/go/plateau.c"
  var $20=$2; //@line 179 "../../../src/go/plateau.c"
  var $21=(($20)|0); //@line 179 "../../../src/go/plateau.c"
  var $22=HEAP32[(($21)>>2)]; //@line 179 "../../../src/go/plateau.c"
  var $23=$22; //@line 179 "../../../src/go/plateau.c"
  var $24=$nbCases; //@line 179 "../../../src/go/plateau.c"
  var $25=($24<<2); //@line 179 "../../../src/go/plateau.c"
  var $26=_gosh_realloc_size($23,$25); //@line 179 "../../../src/go/plateau.c"
   //@line 180 "../../../src/go/plateau.c"
 }
 var $28=$2; //@line 181 "../../../src/go/plateau.c"
 var $29=(($28)|0); //@line 181 "../../../src/go/plateau.c"
 var $30=HEAP32[(($29)>>2)]; //@line 181 "../../../src/go/plateau.c"
 var $31=$30; //@line 181 "../../../src/go/plateau.c"
 var $32=$1; //@line 181 "../../../src/go/plateau.c"
 var $33=(($32)|0); //@line 181 "../../../src/go/plateau.c"
 var $34=HEAP32[(($33)>>2)]; //@line 181 "../../../src/go/plateau.c"
 var $35=$34; //@line 181 "../../../src/go/plateau.c"
 var $36=$1; //@line 181 "../../../src/go/plateau.c"
 var $37=(($36+4)|0); //@line 181 "../../../src/go/plateau.c"
 var $38=HEAP32[(($37)>>2)]; //@line 181 "../../../src/go/plateau.c"
 var $39=_plateau_data_size($38); //@line 181 "../../../src/go/plateau.c"
 assert($39 % 1 === 0);(_memcpy($31, $35, $39)|0); //@line 181 "../../../src/go/plateau.c"
 STACKTOP=sp;return; //@line 182 "../../../src/go/plateau.c"
}


function _plateau_clone($from){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $clone;
 $1=$from;
 var $2=$1; //@line 185 "../../../src/go/plateau.c"
 var $3=(($2+4)|0); //@line 185 "../../../src/go/plateau.c"
 var $4=HEAP32[(($3)>>2)]; //@line 185 "../../../src/go/plateau.c"
 var $5=_creer_plateau($4); //@line 185 "../../../src/go/plateau.c"
 $clone=$5; //@line 185 "../../../src/go/plateau.c"
 var $6=$1; //@line 186 "../../../src/go/plateau.c"
 var $7=$clone; //@line 186 "../../../src/go/plateau.c"
 _plateau_copie($6,$7); //@line 186 "../../../src/go/plateau.c"
 var $8=$clone; //@line 187 "../../../src/go/plateau.c"
 STACKTOP=sp;return $8; //@line 187 "../../../src/go/plateau.c"
}


function _plateau_capture_chaines($plateau,$pion,$valide){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+56)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $pion; $pion=STACKTOP;STACKTOP = (STACKTOP + 8)|0;(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($pion)>>2)]=HEAP32[((tempParam)>>2)];HEAP32[((($pion)+(4))>>2)]=HEAP32[(((tempParam)+(4))>>2)];
 var $1;
 var $2;
 var $3;
 var $chaines_menacees;
 var $chaines_amies;
 var $autour;
 var $a_tester=sp;
 var $i;
 var $p=(sp)+(16);
 var $c;
 var $autre_couleur;
 var $chaine_tmp;
 var $chaines_capturees;
 var $chaine_menacee;
 var $lib;
 var $territoire;
 var $bloquant;
 var $amie;
 var $lib1;
 var $chaine=(sp)+(24);
 var $it=(sp)+(32);
 var $pos=(sp)+(40);
 var $it2=(sp)+(48);
 $2=$plateau;
 $3=$valide;
 var $4=$3; //@line 232 "../../../src/go/plateau.c"
 HEAP8[($4)]=0; //@line 232 "../../../src/go/plateau.c"
 var $5=$2; //@line 235 "../../../src/go/plateau.c"
 var $6=(($pion+4)|0); //@line 235 "../../../src/go/plateau.c"
 var $7=_plateau_get_at($5,$6); //@line 235 "../../../src/go/plateau.c"
 var $8=($7|0)!=0; //@line 235 "../../../src/go/plateau.c"
  //@line 235 "../../../src/go/plateau.c"
 if ($8) {
  $1=0; //@line 236 "../../../src/go/plateau.c"
   //@line 236 "../../../src/go/plateau.c"
  var $227=$1; //@line 334 "../../../src/go/plateau.c"
  STACKTOP=sp;return $227; //@line 334 "../../../src/go/plateau.c"
 }
 var $11=_creer_ensemble_chaine(); //@line 240 "../../../src/go/plateau.c"
 $chaines_menacees=$11; //@line 240 "../../../src/go/plateau.c"
 var $12=_creer_ensemble_chaine(); //@line 241 "../../../src/go/plateau.c"
 $chaines_amies=$12; //@line 241 "../../../src/go/plateau.c"
 var $13=_creer_ensemble_chaine(); //@line 243 "../../../src/go/plateau.c"
 $autour=$13; //@line 243 "../../../src/go/plateau.c"
 var $14=(($a_tester)|0); //@line 244 "../../../src/go/plateau.c"
 var $15=(($pion+4)|0); //@line 244 "../../../src/go/plateau.c"
 _position_gauche($14,$15); //@line 244 "../../../src/go/plateau.c"
 var $16=(($14+4)|0); //@line 244 "../../../src/go/plateau.c"
 var $17=(($pion+4)|0); //@line 244 "../../../src/go/plateau.c"
 _position_droite($16,$17); //@line 244 "../../../src/go/plateau.c"
 var $18=(($16+4)|0); //@line 244 "../../../src/go/plateau.c"
 var $19=(($pion+4)|0); //@line 244 "../../../src/go/plateau.c"
 _position_haut($18,$19); //@line 244 "../../../src/go/plateau.c"
 var $20=(($18+4)|0); //@line 244 "../../../src/go/plateau.c"
 var $21=(($pion+4)|0); //@line 244 "../../../src/go/plateau.c"
 _position_bas($20,$21); //@line 244 "../../../src/go/plateau.c"
 $i=0; //@line 245 "../../../src/go/plateau.c"
  //@line 245 "../../../src/go/plateau.c"
 while(1) {
  var $23=$i; //@line 245 "../../../src/go/plateau.c"
  var $24=($23|0)<4; //@line 245 "../../../src/go/plateau.c"
   //@line 245 "../../../src/go/plateau.c"
  if (!($24)) {
   break;
  }
  var $26=$i; //@line 246 "../../../src/go/plateau.c"
  var $27=(($a_tester+($26<<2))|0); //@line 246 "../../../src/go/plateau.c"
  var $28=$p; //@line 246 "../../../src/go/plateau.c"
  var $29=$27; //@line 246 "../../../src/go/plateau.c"
  assert(4 % 1 === 0);HEAP8[($28)]=HEAP8[($29)];HEAP8[((($28)+(1))|0)]=HEAP8[((($29)+(1))|0)];HEAP8[((($28)+(2))|0)]=HEAP8[((($29)+(2))|0)];HEAP8[((($28)+(3))|0)]=HEAP8[((($29)+(3))|0)]; //@line 246 "../../../src/go/plateau.c"
  var $30=_position_est_valide($p); //@line 247 "../../../src/go/plateau.c"
   //@line 247 "../../../src/go/plateau.c"
  if ($30) {
   var $32=$2; //@line 248 "../../../src/go/plateau.c"
   var $33=_plateau_determiner_chaine($32,$p); //@line 248 "../../../src/go/plateau.c"
   $c=$33; //@line 248 "../../../src/go/plateau.c"
   var $34=$c; //@line 249 "../../../src/go/plateau.c"
   var $35=($34|0)!=0; //@line 249 "../../../src/go/plateau.c"
    //@line 249 "../../../src/go/plateau.c"
   if ($35) {
    var $37=$autour; //@line 250 "../../../src/go/plateau.c"
    var $38=(($37+12)|0); //@line 250 "../../../src/go/plateau.c"
    var $39=HEAP32[(($38)>>2)]; //@line 250 "../../../src/go/plateau.c"
    var $40=$autour; //@line 250 "../../../src/go/plateau.c"
    var $41=$c; //@line 250 "../../../src/go/plateau.c"
    FUNCTION_TABLE[$39]($40,$41); //@line 250 "../../../src/go/plateau.c"
     //@line 250 "../../../src/go/plateau.c"
   }
    //@line 251 "../../../src/go/plateau.c"
  }
   //@line 252 "../../../src/go/plateau.c"
  var $45=$i; //@line 245 "../../../src/go/plateau.c"
  var $46=((($45)+(1))|0); //@line 245 "../../../src/go/plateau.c"
  $i=$46; //@line 245 "../../../src/go/plateau.c"
   //@line 245 "../../../src/go/plateau.c"
 }
 var $48=(($pion)|0); //@line 254 "../../../src/go/plateau.c"
 var $49=HEAP32[(($48)>>2)]; //@line 254 "../../../src/go/plateau.c"
 var $50=($49|0)==1; //@line 254 "../../../src/go/plateau.c"
 var $51=($50?2:1); //@line 254 "../../../src/go/plateau.c"
 $autre_couleur=$51; //@line 254 "../../../src/go/plateau.c"
  //@line 255 "../../../src/go/plateau.c"
 while(1) {
  var $53=$autour; //@line 255 "../../../src/go/plateau.c"
  var $54=(($53+8)|0); //@line 255 "../../../src/go/plateau.c"
  var $55=HEAP32[(($54)>>2)]; //@line 255 "../../../src/go/plateau.c"
  var $56=$autour; //@line 255 "../../../src/go/plateau.c"
  var $57=FUNCTION_TABLE[$55]($56); //@line 255 "../../../src/go/plateau.c"
  var $58=$57^1; //@line 255 "../../../src/go/plateau.c"
   //@line 255 "../../../src/go/plateau.c"
  if (!($58)) {
   break;
  }
  var $60=$autour; //@line 258 "../../../src/go/plateau.c"
  var $61=(($60+20)|0); //@line 258 "../../../src/go/plateau.c"
  var $62=HEAP32[(($61)>>2)]; //@line 258 "../../../src/go/plateau.c"
  var $63=$autour; //@line 258 "../../../src/go/plateau.c"
  var $64=FUNCTION_TABLE[$62]($63); //@line 258 "../../../src/go/plateau.c"
  $chaine_tmp=$64; //@line 258 "../../../src/go/plateau.c"
  var $65=$chaine_tmp; //@line 259 "../../../src/go/plateau.c"
  var $66=_ensemble_colore_couleur($65); //@line 259 "../../../src/go/plateau.c"
  var $67=$autre_couleur; //@line 259 "../../../src/go/plateau.c"
  var $68=($66|0)==($67|0); //@line 259 "../../../src/go/plateau.c"
   //@line 259 "../../../src/go/plateau.c"
  if ($68) {
   var $70=$chaines_menacees; //@line 260 "../../../src/go/plateau.c"
   var $71=(($70+12)|0); //@line 260 "../../../src/go/plateau.c"
   var $72=HEAP32[(($71)>>2)]; //@line 260 "../../../src/go/plateau.c"
   var $73=$chaines_menacees; //@line 260 "../../../src/go/plateau.c"
   var $74=$chaine_tmp; //@line 260 "../../../src/go/plateau.c"
   FUNCTION_TABLE[$72]($73,$74); //@line 260 "../../../src/go/plateau.c"
    //@line 261 "../../../src/go/plateau.c"
  } else {
   var $76=$chaine_tmp; //@line 261 "../../../src/go/plateau.c"
   var $77=_ensemble_colore_couleur($76); //@line 261 "../../../src/go/plateau.c"
   var $78=(($pion)|0); //@line 261 "../../../src/go/plateau.c"
   var $79=HEAP32[(($78)>>2)]; //@line 261 "../../../src/go/plateau.c"
   var $80=($77|0)==($79|0); //@line 261 "../../../src/go/plateau.c"
    //@line 261 "../../../src/go/plateau.c"
   if ($80) {
    var $82=$chaines_amies; //@line 262 "../../../src/go/plateau.c"
    var $83=(($82+12)|0); //@line 262 "../../../src/go/plateau.c"
    var $84=HEAP32[(($83)>>2)]; //@line 262 "../../../src/go/plateau.c"
    var $85=$chaines_amies; //@line 262 "../../../src/go/plateau.c"
    var $86=$chaine_tmp; //@line 262 "../../../src/go/plateau.c"
    FUNCTION_TABLE[$84]($85,$86); //@line 262 "../../../src/go/plateau.c"
     //@line 263 "../../../src/go/plateau.c"
   }
  }
   //@line 264 "../../../src/go/plateau.c"
 }
 var $90=$autour; //@line 265 "../../../src/go/plateau.c"
 _detruire_ensemble_chaine($90); //@line 265 "../../../src/go/plateau.c"
 var $91=_creer_ensemble_chaine(); //@line 267 "../../../src/go/plateau.c"
 $chaines_capturees=$91; //@line 267 "../../../src/go/plateau.c"
  //@line 270 "../../../src/go/plateau.c"
 while(1) {
  var $93=$chaines_menacees; //@line 270 "../../../src/go/plateau.c"
  var $94=(($93+8)|0); //@line 270 "../../../src/go/plateau.c"
  var $95=HEAP32[(($94)>>2)]; //@line 270 "../../../src/go/plateau.c"
  var $96=$chaines_menacees; //@line 270 "../../../src/go/plateau.c"
  var $97=FUNCTION_TABLE[$95]($96); //@line 270 "../../../src/go/plateau.c"
  var $98=$97^1; //@line 270 "../../../src/go/plateau.c"
   //@line 270 "../../../src/go/plateau.c"
  if (!($98)) {
   break;
  }
  var $100=$chaines_menacees; //@line 271 "../../../src/go/plateau.c"
  var $101=(($100+20)|0); //@line 271 "../../../src/go/plateau.c"
  var $102=HEAP32[(($101)>>2)]; //@line 271 "../../../src/go/plateau.c"
  var $103=$chaines_menacees; //@line 271 "../../../src/go/plateau.c"
  var $104=FUNCTION_TABLE[$102]($103); //@line 271 "../../../src/go/plateau.c"
  $chaine_menacee=$104; //@line 271 "../../../src/go/plateau.c"
  var $105=$2; //@line 272 "../../../src/go/plateau.c"
  var $106=$chaine_menacee; //@line 272 "../../../src/go/plateau.c"
  var $107=_determiner_libertes($105,$106); //@line 272 "../../../src/go/plateau.c"
  $lib=$107; //@line 272 "../../../src/go/plateau.c"
  var $108=$lib; //@line 273 "../../../src/go/plateau.c"
  var $109=(($108+24)|0); //@line 273 "../../../src/go/plateau.c"
  var $110=HEAP32[(($109)>>2)]; //@line 273 "../../../src/go/plateau.c"
  var $111=$lib; //@line 273 "../../../src/go/plateau.c"
  var $112=FUNCTION_TABLE[$110]($111); //@line 273 "../../../src/go/plateau.c"
  var $113=($112|0)==1; //@line 273 "../../../src/go/plateau.c"
   //@line 273 "../../../src/go/plateau.c"
  if ($113) {
   var $115=$2; //@line 274 "../../../src/go/plateau.c"
   var $116=$chaine_menacee; //@line 274 "../../../src/go/plateau.c"
   _plateau_realiser_capture($115,$116); //@line 274 "../../../src/go/plateau.c"
   var $117=$chaines_capturees; //@line 275 "../../../src/go/plateau.c"
   var $118=(($117+12)|0); //@line 275 "../../../src/go/plateau.c"
   var $119=HEAP32[(($118)>>2)]; //@line 275 "../../../src/go/plateau.c"
   var $120=$chaines_capturees; //@line 275 "../../../src/go/plateau.c"
   var $121=$chaine_menacee; //@line 275 "../../../src/go/plateau.c"
   FUNCTION_TABLE[$119]($120,$121); //@line 275 "../../../src/go/plateau.c"
    //@line 276 "../../../src/go/plateau.c"
  } else {
   var $123=$chaine_menacee; //@line 277 "../../../src/go/plateau.c"
   _detruire_ensemble_colore($123); //@line 277 "../../../src/go/plateau.c"
  }
  var $125=$lib; //@line 279 "../../../src/go/plateau.c"
  _detruire_ensemble_position($125); //@line 279 "../../../src/go/plateau.c"
   //@line 280 "../../../src/go/plateau.c"
 }
 var $127=$chaines_menacees; //@line 281 "../../../src/go/plateau.c"
 _detruire_ensemble_chaine($127); //@line 281 "../../../src/go/plateau.c"
 var $128=$2; //@line 284 "../../../src/go/plateau.c"
 var $129=(($pion+4)|0); //@line 284 "../../../src/go/plateau.c"
 var $130=_determiner_territoire($128,$129); //@line 284 "../../../src/go/plateau.c"
 $territoire=$130; //@line 284 "../../../src/go/plateau.c"
 var $131=$territoire; //@line 287 "../../../src/go/plateau.c"
 var $132=(($131+20)|0); //@line 287 "../../../src/go/plateau.c"
 var $133=HEAP32[(($132)>>2)]; //@line 287 "../../../src/go/plateau.c"
 var $134=$territoire; //@line 287 "../../../src/go/plateau.c"
 var $135=FUNCTION_TABLE[$133]($134); //@line 287 "../../../src/go/plateau.c"
 var $136=($135|0)==1; //@line 287 "../../../src/go/plateau.c"
  //@line 287 "../../../src/go/plateau.c"
 L35: do {
  if ($136) {
   var $138=$chaines_amies; //@line 289 "../../../src/go/plateau.c"
   var $139=(($138+8)|0); //@line 289 "../../../src/go/plateau.c"
   var $140=HEAP32[(($139)>>2)]; //@line 289 "../../../src/go/plateau.c"
   var $141=$chaines_amies; //@line 289 "../../../src/go/plateau.c"
   var $142=FUNCTION_TABLE[$140]($141); //@line 289 "../../../src/go/plateau.c"
    //@line 289 "../../../src/go/plateau.c"
   do {
    if ($142) {
      //@line 290 "../../../src/go/plateau.c"
    } else {
     $bloquant=1; //@line 293 "../../../src/go/plateau.c"
      //@line 294 "../../../src/go/plateau.c"
     while(1) {
      var $146=$chaines_amies; //@line 294 "../../../src/go/plateau.c"
      var $147=(($146+8)|0); //@line 294 "../../../src/go/plateau.c"
      var $148=HEAP32[(($147)>>2)]; //@line 294 "../../../src/go/plateau.c"
      var $149=$chaines_amies; //@line 294 "../../../src/go/plateau.c"
      var $150=FUNCTION_TABLE[$148]($149); //@line 294 "../../../src/go/plateau.c"
      var $151=$150^1; //@line 294 "../../../src/go/plateau.c"
       //@line 294 "../../../src/go/plateau.c"
      if (!($151)) {
       break;
      }
      var $153=$chaines_amies; //@line 295 "../../../src/go/plateau.c"
      var $154=(($153+20)|0); //@line 295 "../../../src/go/plateau.c"
      var $155=HEAP32[(($154)>>2)]; //@line 295 "../../../src/go/plateau.c"
      var $156=$chaines_amies; //@line 295 "../../../src/go/plateau.c"
      var $157=FUNCTION_TABLE[$155]($156); //@line 295 "../../../src/go/plateau.c"
      $amie=$157; //@line 295 "../../../src/go/plateau.c"
      var $158=$2; //@line 296 "../../../src/go/plateau.c"
      var $159=$amie; //@line 296 "../../../src/go/plateau.c"
      var $160=_determiner_libertes($158,$159); //@line 296 "../../../src/go/plateau.c"
      $lib1=$160; //@line 296 "../../../src/go/plateau.c"
      var $161=$lib1; //@line 297 "../../../src/go/plateau.c"
      var $162=(($161+24)|0); //@line 297 "../../../src/go/plateau.c"
      var $163=HEAP32[(($162)>>2)]; //@line 297 "../../../src/go/plateau.c"
      var $164=$lib1; //@line 297 "../../../src/go/plateau.c"
      var $165=FUNCTION_TABLE[$163]($164); //@line 297 "../../../src/go/plateau.c"
      var $166=($165|0)!=1; //@line 297 "../../../src/go/plateau.c"
       //@line 297 "../../../src/go/plateau.c"
      if ($166) {
       $bloquant=0; //@line 298 "../../../src/go/plateau.c"
        //@line 299 "../../../src/go/plateau.c"
      }
      var $169=$lib1; //@line 300 "../../../src/go/plateau.c"
      _detruire_ensemble_position($169); //@line 300 "../../../src/go/plateau.c"
      var $170=$amie; //@line 301 "../../../src/go/plateau.c"
      _detruire_ensemble_colore($170); //@line 301 "../../../src/go/plateau.c"
       //@line 302 "../../../src/go/plateau.c"
     }
     var $172=$bloquant; //@line 305 "../../../src/go/plateau.c"
     var $173=(($172)&1); //@line 305 "../../../src/go/plateau.c"
      //@line 305 "../../../src/go/plateau.c"
     if ($173) {
       //@line 306 "../../../src/go/plateau.c"
      break;
     }
      //@line 308 "../../../src/go/plateau.c"
     if (0) {
       //@line 309 "../../../src/go/plateau.c"
      break;
     }
      //@line 323 "../../../src/go/plateau.c"
     break L35;
    }
   } while(0);
   var $178=$chaines_capturees; //@line 311 "../../../src/go/plateau.c"
   var $179=(($178+4)|0); //@line 311 "../../../src/go/plateau.c"
   var $180=HEAP32[(($179)>>2)]; //@line 311 "../../../src/go/plateau.c"
   FUNCTION_TABLE[$180]($it); //@line 311 "../../../src/go/plateau.c"
    //@line 311 "../../../src/go/plateau.c"
   while(1) {
    var $182=$chaines_capturees; //@line 311 "../../../src/go/plateau.c"
    var $183=(($182)|0); //@line 311 "../../../src/go/plateau.c"
    var $184=HEAP32[(($183)>>2)]; //@line 311 "../../../src/go/plateau.c"
    var $185=$chaines_capturees; //@line 311 "../../../src/go/plateau.c"
    var $186=FUNCTION_TABLE[$184]($it,$185,$chaine); //@line 311 "../../../src/go/plateau.c"
    var $187=($186|0)!=0; //@line 311 "../../../src/go/plateau.c"
     //@line 311 "../../../src/go/plateau.c"
    if (!($187)) {
     break;
    }
    var $189=HEAP32[(($chaine)>>2)]; //@line 313 "../../../src/go/plateau.c"
    var $190=(($189+4)|0); //@line 313 "../../../src/go/plateau.c"
    var $191=HEAP32[(($190)>>2)]; //@line 313 "../../../src/go/plateau.c"
    FUNCTION_TABLE[$191]($it2); //@line 313 "../../../src/go/plateau.c"
     //@line 313 "../../../src/go/plateau.c"
    while(1) {
     var $193=HEAP32[(($chaine)>>2)]; //@line 313 "../../../src/go/plateau.c"
     var $194=(($193)|0); //@line 313 "../../../src/go/plateau.c"
     var $195=HEAP32[(($194)>>2)]; //@line 313 "../../../src/go/plateau.c"
     var $196=HEAP32[(($chaine)>>2)]; //@line 313 "../../../src/go/plateau.c"
     var $197=FUNCTION_TABLE[$195]($it2,$196,$pos); //@line 313 "../../../src/go/plateau.c"
     var $198=($197|0)!=0; //@line 313 "../../../src/go/plateau.c"
      //@line 313 "../../../src/go/plateau.c"
     if (!($198)) {
      break;
     }
     var $200=$2; //@line 314 "../../../src/go/plateau.c"
     var $201=$autre_couleur; //@line 314 "../../../src/go/plateau.c"
     _plateau_set_at($200,$pos,$201); //@line 314 "../../../src/go/plateau.c"
      //@line 315 "../../../src/go/plateau.c"
    }
     //@line 316 "../../../src/go/plateau.c"
   }
   var $204=$chaines_amies; //@line 317 "../../../src/go/plateau.c"
   _detruire_ensemble_chaine($204); //@line 317 "../../../src/go/plateau.c"
   var $205=$chaines_capturees; //@line 318 "../../../src/go/plateau.c"
   _detruire_ensemble_chaine($205); //@line 318 "../../../src/go/plateau.c"
   var $206=$territoire; //@line 319 "../../../src/go/plateau.c"
   _detruire_ensemble_colore($206); //@line 319 "../../../src/go/plateau.c"
   $1=0; //@line 320 "../../../src/go/plateau.c"
    //@line 320 "../../../src/go/plateau.c"
   var $227=$1; //@line 334 "../../../src/go/plateau.c"
   STACKTOP=sp;return $227; //@line 334 "../../../src/go/plateau.c"
  }
 } while(0);
 var $210=$territoire; //@line 324 "../../../src/go/plateau.c"
 _detruire_ensemble_colore($210); //@line 324 "../../../src/go/plateau.c"
 var $211=$chaines_amies; //@line 325 "../../../src/go/plateau.c"
 _detruire_ensemble_chaine($211); //@line 325 "../../../src/go/plateau.c"
 var $212=$3; //@line 327 "../../../src/go/plateau.c"
 HEAP8[($212)]=1; //@line 327 "../../../src/go/plateau.c"
 var $213=$2; //@line 328 "../../../src/go/plateau.c"
 var $214=(($pion+4)|0); //@line 328 "../../../src/go/plateau.c"
 var $215=(($pion)|0); //@line 328 "../../../src/go/plateau.c"
 var $216=HEAP32[(($215)>>2)]; //@line 328 "../../../src/go/plateau.c"
 _plateau_set_at($213,$214,$216); //@line 328 "../../../src/go/plateau.c"
 var $217=$chaines_capturees; //@line 329 "../../../src/go/plateau.c"
 var $218=(($217+8)|0); //@line 329 "../../../src/go/plateau.c"
 var $219=HEAP32[(($218)>>2)]; //@line 329 "../../../src/go/plateau.c"
 var $220=$chaines_capturees; //@line 329 "../../../src/go/plateau.c"
 var $221=FUNCTION_TABLE[$219]($220); //@line 329 "../../../src/go/plateau.c"
  //@line 329 "../../../src/go/plateau.c"
 if ($221) {
  var $223=$chaines_capturees; //@line 330 "../../../src/go/plateau.c"
  _detruire_ensemble_chaine($223); //@line 330 "../../../src/go/plateau.c"
  $1=0; //@line 331 "../../../src/go/plateau.c"
   //@line 331 "../../../src/go/plateau.c"
  var $227=$1; //@line 334 "../../../src/go/plateau.c"
  STACKTOP=sp;return $227; //@line 334 "../../../src/go/plateau.c"
 } else {
  var $225=$chaines_capturees; //@line 333 "../../../src/go/plateau.c"
  $1=$225; //@line 333 "../../../src/go/plateau.c"
   //@line 333 "../../../src/go/plateau.c"
  var $227=$1; //@line 334 "../../../src/go/plateau.c"
  STACKTOP=sp;return $227; //@line 334 "../../../src/go/plateau.c"
 }
}


function _plateau_data($p){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$p;
 var $2=$1; //@line 338 "../../../src/go/plateau.c"
 var $3=(($2)|0); //@line 338 "../../../src/go/plateau.c"
 var $4=HEAP32[(($3)>>2)]; //@line 338 "../../../src/go/plateau.c"
 STACKTOP=sp;return $4; //@line 338 "../../../src/go/plateau.c"
}


function _plateau_load_data($plateau,$data){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 $1=$plateau;
 $2=$data;
 var $3=$1; //@line 344 "../../../src/go/plateau.c"
 var $4=(($3)|0); //@line 344 "../../../src/go/plateau.c"
 var $5=HEAP32[(($4)>>2)]; //@line 344 "../../../src/go/plateau.c"
 var $6=$5; //@line 344 "../../../src/go/plateau.c"
 var $7=$2; //@line 344 "../../../src/go/plateau.c"
 var $8=$7; //@line 344 "../../../src/go/plateau.c"
 var $9=$1; //@line 344 "../../../src/go/plateau.c"
 var $10=(($9+4)|0); //@line 344 "../../../src/go/plateau.c"
 var $11=HEAP32[(($10)>>2)]; //@line 344 "../../../src/go/plateau.c"
 var $12=_impl_get_nbCases($11); //@line 344 "../../../src/go/plateau.c"
 var $13=($12<<2); //@line 344 "../../../src/go/plateau.c"
 assert($13 % 1 === 0);(_memcpy($6, $8, $13)|0); //@line 344 "../../../src/go/plateau.c"
 STACKTOP=sp;return; //@line 345 "../../../src/go/plateau.c"
}


function _position($agg_result,$x,$y,$taille){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $p=sp;
 $1=$x;
 $2=$y;
 $3=$taille;
 var $4=$1; //@line 22 "../../../src/go/position.c"
 var $5=($4|0)<0; //@line 22 "../../../src/go/position.c"
  //@line 22 "../../../src/go/position.c"
 do {
  if (!($5)) {
   var $7=$2; //@line 22 "../../../src/go/position.c"
   var $8=($7|0)<0; //@line 22 "../../../src/go/position.c"
    //@line 22 "../../../src/go/position.c"
   if ($8) {
    break;
   }
   var $10=$1; //@line 22 "../../../src/go/position.c"
   var $11=$3; //@line 22 "../../../src/go/position.c"
   var $12=($10|0)>=($11|0); //@line 22 "../../../src/go/position.c"
    //@line 22 "../../../src/go/position.c"
   if ($12) {
    break;
   }
   var $14=$2; //@line 22 "../../../src/go/position.c"
   var $15=$3; //@line 22 "../../../src/go/position.c"
   var $16=($14|0)>=($15|0); //@line 22 "../../../src/go/position.c"
    //@line 22 "../../../src/go/position.c"
   if ($16) {
    break;
   }
   var $20=(($p)|0); //@line 24 "../../../src/go/position.c"
   var $21=$1; //@line 24 "../../../src/go/position.c"
   var $22=(($21)&255); //@line 24 "../../../src/go/position.c"
   HEAP8[($20)]=$22; //@line 24 "../../../src/go/position.c"
   var $23=(($p+1)|0); //@line 24 "../../../src/go/position.c"
   var $24=$2; //@line 24 "../../../src/go/position.c"
   var $25=(($24)&255); //@line 24 "../../../src/go/position.c"
   HEAP8[($23)]=$25; //@line 24 "../../../src/go/position.c"
   var $26=(($p+2)|0); //@line 24 "../../../src/go/position.c"
   var $27=$3; //@line 24 "../../../src/go/position.c"
   var $28=(($27)&255); //@line 24 "../../../src/go/position.c"
   HEAP8[($26)]=$28; //@line 24 "../../../src/go/position.c"
   var $29=(($p+3)|0); //@line 24 "../../../src/go/position.c"
   HEAP8[($29)]=1; //@line 24 "../../../src/go/position.c"
   var $30=$agg_result; //@line 25 "../../../src/go/position.c"
   var $31=$p; //@line 25 "../../../src/go/position.c"
   assert(4 % 1 === 0);HEAP8[($30)]=HEAP8[($31)];HEAP8[((($30)+(1))|0)]=HEAP8[((($31)+(1))|0)];HEAP8[((($30)+(2))|0)]=HEAP8[((($31)+(2))|0)];HEAP8[((($30)+(3))|0)]=HEAP8[((($31)+(3))|0)]; //@line 25 "../../../src/go/position.c"
    //@line 25 "../../../src/go/position.c"
   STACKTOP=sp;return; //@line 26 "../../../src/go/position.c"
  }
 } while(0);
 var $18=$agg_result; //@line 23 "../../../src/go/position.c"
 assert(4 % 1 === 0);HEAP8[($18)]=HEAP8[(1488)];HEAP8[((($18)+(1))|0)]=HEAP8[(1489)];HEAP8[((($18)+(2))|0)]=HEAP8[(1490)];HEAP8[((($18)+(3))|0)]=HEAP8[(1491)]; //@line 23 "../../../src/go/position.c"
  //@line 23 "../../../src/go/position.c"
 STACKTOP=sp;return; //@line 26 "../../../src/go/position.c"
}


function _position_est_valide($pos){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $pos; $pos=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($pos)>>2)]=HEAP32[((tempParam)>>2)];
 var $1=(($pos+3)|0); //@line 30 "../../../src/go/position.c"
 var $2=HEAP8[($1)]; //@line 30 "../../../src/go/position.c"
 var $3=(($2)&1); //@line 30 "../../../src/go/position.c"
 STACKTOP=sp;return $3; //@line 30 "../../../src/go/position.c"
}


function _position_gauche($agg_result,$pos){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $pos; $pos=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($pos)>>2)]=HEAP32[((tempParam)>>2)];
 var $1=_position_est_valide($pos); //@line 35 "../../../src/go/position.c"
  //@line 35 "../../../src/go/position.c"
 if (!($1)) {
  var $3=$agg_result; //@line 36 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($3)]=HEAP8[(1488)];HEAP8[((($3)+(1))|0)]=HEAP8[(1489)];HEAP8[((($3)+(2))|0)]=HEAP8[(1490)];HEAP8[((($3)+(3))|0)]=HEAP8[(1491)]; //@line 36 "../../../src/go/position.c"
   //@line 36 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 41 "../../../src/go/position.c"
 }
 var $5=(($pos)|0); //@line 37 "../../../src/go/position.c"
 var $6=HEAP8[($5)]; //@line 37 "../../../src/go/position.c"
 var $7=(($6<<24)>>24); //@line 37 "../../../src/go/position.c"
 var $8=($7|0)==0; //@line 37 "../../../src/go/position.c"
  //@line 37 "../../../src/go/position.c"
 if ($8) {
  var $10=$agg_result; //@line 38 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($10)]=HEAP8[(1488)];HEAP8[((($10)+(1))|0)]=HEAP8[(1489)];HEAP8[((($10)+(2))|0)]=HEAP8[(1490)];HEAP8[((($10)+(3))|0)]=HEAP8[(1491)]; //@line 38 "../../../src/go/position.c"
   //@line 38 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 41 "../../../src/go/position.c"
 } else {
  var $12=(($pos)|0); //@line 39 "../../../src/go/position.c"
  var $13=HEAP8[($12)]; //@line 39 "../../../src/go/position.c"
  var $14=(($13<<24)>>24); //@line 39 "../../../src/go/position.c"
  var $15=((($14)-(1))|0); //@line 39 "../../../src/go/position.c"
  var $16=(($15)&255); //@line 39 "../../../src/go/position.c"
  HEAP8[($12)]=$16; //@line 39 "../../../src/go/position.c"
  var $17=$agg_result; //@line 40 "../../../src/go/position.c"
  var $18=$pos; //@line 40 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($17)]=HEAP8[($18)];HEAP8[((($17)+(1))|0)]=HEAP8[((($18)+(1))|0)];HEAP8[((($17)+(2))|0)]=HEAP8[((($18)+(2))|0)];HEAP8[((($17)+(3))|0)]=HEAP8[((($18)+(3))|0)]; //@line 40 "../../../src/go/position.c"
   //@line 40 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 41 "../../../src/go/position.c"
 }
}


function _position_droite($agg_result,$pos){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $pos; $pos=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($pos)>>2)]=HEAP32[((tempParam)>>2)];
 var $1=_position_est_valide($pos); //@line 45 "../../../src/go/position.c"
  //@line 45 "../../../src/go/position.c"
 if (!($1)) {
  var $3=$agg_result; //@line 46 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($3)]=HEAP8[(1488)];HEAP8[((($3)+(1))|0)]=HEAP8[(1489)];HEAP8[((($3)+(2))|0)]=HEAP8[(1490)];HEAP8[((($3)+(3))|0)]=HEAP8[(1491)]; //@line 46 "../../../src/go/position.c"
   //@line 46 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 51 "../../../src/go/position.c"
 }
 var $5=(($pos)|0); //@line 47 "../../../src/go/position.c"
 var $6=HEAP8[($5)]; //@line 47 "../../../src/go/position.c"
 var $7=(($6<<24)>>24); //@line 47 "../../../src/go/position.c"
 var $8=(($pos+2)|0); //@line 47 "../../../src/go/position.c"
 var $9=HEAP8[($8)]; //@line 47 "../../../src/go/position.c"
 var $10=(($9<<24)>>24); //@line 47 "../../../src/go/position.c"
 var $11=((($10)-(1))|0); //@line 47 "../../../src/go/position.c"
 var $12=($7|0)==($11|0); //@line 47 "../../../src/go/position.c"
  //@line 47 "../../../src/go/position.c"
 if ($12) {
  var $14=$agg_result; //@line 48 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($14)]=HEAP8[(1488)];HEAP8[((($14)+(1))|0)]=HEAP8[(1489)];HEAP8[((($14)+(2))|0)]=HEAP8[(1490)];HEAP8[((($14)+(3))|0)]=HEAP8[(1491)]; //@line 48 "../../../src/go/position.c"
   //@line 48 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 51 "../../../src/go/position.c"
 } else {
  var $16=(($pos)|0); //@line 49 "../../../src/go/position.c"
  var $17=HEAP8[($16)]; //@line 49 "../../../src/go/position.c"
  var $18=(($17<<24)>>24); //@line 49 "../../../src/go/position.c"
  var $19=((($18)+(1))|0); //@line 49 "../../../src/go/position.c"
  var $20=(($19)&255); //@line 49 "../../../src/go/position.c"
  HEAP8[($16)]=$20; //@line 49 "../../../src/go/position.c"
  var $21=$agg_result; //@line 50 "../../../src/go/position.c"
  var $22=$pos; //@line 50 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($21)]=HEAP8[($22)];HEAP8[((($21)+(1))|0)]=HEAP8[((($22)+(1))|0)];HEAP8[((($21)+(2))|0)]=HEAP8[((($22)+(2))|0)];HEAP8[((($21)+(3))|0)]=HEAP8[((($22)+(3))|0)]; //@line 50 "../../../src/go/position.c"
   //@line 50 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 51 "../../../src/go/position.c"
 }
}


function _position_haut($agg_result,$pos){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $pos; $pos=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($pos)>>2)]=HEAP32[((tempParam)>>2)];
 var $1=_position_est_valide($pos); //@line 55 "../../../src/go/position.c"
  //@line 55 "../../../src/go/position.c"
 if (!($1)) {
  var $3=$agg_result; //@line 56 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($3)]=HEAP8[(1488)];HEAP8[((($3)+(1))|0)]=HEAP8[(1489)];HEAP8[((($3)+(2))|0)]=HEAP8[(1490)];HEAP8[((($3)+(3))|0)]=HEAP8[(1491)]; //@line 56 "../../../src/go/position.c"
   //@line 56 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 61 "../../../src/go/position.c"
 }
 var $5=(($pos+1)|0); //@line 57 "../../../src/go/position.c"
 var $6=HEAP8[($5)]; //@line 57 "../../../src/go/position.c"
 var $7=(($6<<24)>>24); //@line 57 "../../../src/go/position.c"
 var $8=($7|0)==0; //@line 57 "../../../src/go/position.c"
  //@line 57 "../../../src/go/position.c"
 if ($8) {
  var $10=$agg_result; //@line 58 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($10)]=HEAP8[(1488)];HEAP8[((($10)+(1))|0)]=HEAP8[(1489)];HEAP8[((($10)+(2))|0)]=HEAP8[(1490)];HEAP8[((($10)+(3))|0)]=HEAP8[(1491)]; //@line 58 "../../../src/go/position.c"
   //@line 58 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 61 "../../../src/go/position.c"
 } else {
  var $12=(($pos+1)|0); //@line 59 "../../../src/go/position.c"
  var $13=HEAP8[($12)]; //@line 59 "../../../src/go/position.c"
  var $14=(($13<<24)>>24); //@line 59 "../../../src/go/position.c"
  var $15=((($14)-(1))|0); //@line 59 "../../../src/go/position.c"
  var $16=(($15)&255); //@line 59 "../../../src/go/position.c"
  HEAP8[($12)]=$16; //@line 59 "../../../src/go/position.c"
  var $17=$agg_result; //@line 60 "../../../src/go/position.c"
  var $18=$pos; //@line 60 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($17)]=HEAP8[($18)];HEAP8[((($17)+(1))|0)]=HEAP8[((($18)+(1))|0)];HEAP8[((($17)+(2))|0)]=HEAP8[((($18)+(2))|0)];HEAP8[((($17)+(3))|0)]=HEAP8[((($18)+(3))|0)]; //@line 60 "../../../src/go/position.c"
   //@line 60 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 61 "../../../src/go/position.c"
 }
}


function _position_bas($agg_result,$pos){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $pos; $pos=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($pos)>>2)]=HEAP32[((tempParam)>>2)];
 var $1=_position_est_valide($pos); //@line 65 "../../../src/go/position.c"
  //@line 65 "../../../src/go/position.c"
 if (!($1)) {
  var $3=$agg_result; //@line 66 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($3)]=HEAP8[(1488)];HEAP8[((($3)+(1))|0)]=HEAP8[(1489)];HEAP8[((($3)+(2))|0)]=HEAP8[(1490)];HEAP8[((($3)+(3))|0)]=HEAP8[(1491)]; //@line 66 "../../../src/go/position.c"
   //@line 66 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 71 "../../../src/go/position.c"
 }
 var $5=(($pos+1)|0); //@line 67 "../../../src/go/position.c"
 var $6=HEAP8[($5)]; //@line 67 "../../../src/go/position.c"
 var $7=(($6<<24)>>24); //@line 67 "../../../src/go/position.c"
 var $8=(($pos+2)|0); //@line 67 "../../../src/go/position.c"
 var $9=HEAP8[($8)]; //@line 67 "../../../src/go/position.c"
 var $10=(($9<<24)>>24); //@line 67 "../../../src/go/position.c"
 var $11=((($10)-(1))|0); //@line 67 "../../../src/go/position.c"
 var $12=($7|0)==($11|0); //@line 67 "../../../src/go/position.c"
  //@line 67 "../../../src/go/position.c"
 if ($12) {
  var $14=$agg_result; //@line 68 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($14)]=HEAP8[(1488)];HEAP8[((($14)+(1))|0)]=HEAP8[(1489)];HEAP8[((($14)+(2))|0)]=HEAP8[(1490)];HEAP8[((($14)+(3))|0)]=HEAP8[(1491)]; //@line 68 "../../../src/go/position.c"
   //@line 68 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 71 "../../../src/go/position.c"
 } else {
  var $16=(($pos+1)|0); //@line 69 "../../../src/go/position.c"
  var $17=HEAP8[($16)]; //@line 69 "../../../src/go/position.c"
  var $18=(($17<<24)>>24); //@line 69 "../../../src/go/position.c"
  var $19=((($18)+(1))|0); //@line 69 "../../../src/go/position.c"
  var $20=(($19)&255); //@line 69 "../../../src/go/position.c"
  HEAP8[($16)]=$20; //@line 69 "../../../src/go/position.c"
  var $21=$agg_result; //@line 70 "../../../src/go/position.c"
  var $22=$pos; //@line 70 "../../../src/go/position.c"
  assert(4 % 1 === 0);HEAP8[($21)]=HEAP8[($22)];HEAP8[((($21)+(1))|0)]=HEAP8[((($22)+(1))|0)];HEAP8[((($21)+(2))|0)]=HEAP8[((($22)+(2))|0)];HEAP8[((($21)+(3))|0)]=HEAP8[((($22)+(3))|0)]; //@line 70 "../../../src/go/position.c"
   //@line 70 "../../../src/go/position.c"
  STACKTOP=sp;return; //@line 71 "../../../src/go/position.c"
 }
}


function _sauvegarder_partie_fichier($filename,$partie){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $file;
 var $retour;
 $2=$filename;
 $3=$partie;
 var $4=$2; //@line 61 "../../../src/go/sauvegarde.c"
 var $5=_fopen($4,1024); //@line 61 "../../../src/go/sauvegarde.c"
 $file=$5; //@line 61 "../../../src/go/sauvegarde.c"
 var $6=$file; //@line 62 "../../../src/go/sauvegarde.c"
 var $7=($6|0)!=0; //@line 62 "../../../src/go/sauvegarde.c"
  //@line 62 "../../../src/go/sauvegarde.c"
 if ($7) {
  var $10=$3; //@line 64 "../../../src/go/sauvegarde.c"
  var $11=$file; //@line 64 "../../../src/go/sauvegarde.c"
  var $12=_sauvegarder_partie($10,$11); //@line 64 "../../../src/go/sauvegarde.c"
  var $13=($12&1); //@line 64 "../../../src/go/sauvegarde.c"
  $retour=$13; //@line 64 "../../../src/go/sauvegarde.c"
  var $14=$file; //@line 65 "../../../src/go/sauvegarde.c"
  var $15=_fclose($14); //@line 65 "../../../src/go/sauvegarde.c"
  var $16=$retour; //@line 66 "../../../src/go/sauvegarde.c"
  var $17=(($16)&1); //@line 66 "../../../src/go/sauvegarde.c"
  $1=$17; //@line 66 "../../../src/go/sauvegarde.c"
   //@line 66 "../../../src/go/sauvegarde.c"
  var $19=$1; //@line 67 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $19; //@line 67 "../../../src/go/sauvegarde.c"
 } else {
  $1=0; //@line 63 "../../../src/go/sauvegarde.c"
   //@line 63 "../../../src/go/sauvegarde.c"
  var $19=$1; //@line 67 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $19; //@line 67 "../../../src/go/sauvegarde.c"
 }
}


function _sauvegarder_partie($partie,$file){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+24)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $i;
 var $p=sp;
 var $it=(sp)+(8);
 var $it1=(sp)+(16);
 $1=$partie;
 $2=$file;
 var $3=$1; //@line 71 "../../../src/go/sauvegarde.c"
 var $4=(($3)|0); //@line 71 "../../../src/go/sauvegarde.c"
 var $5=HEAP32[(($4)>>2)]; //@line 71 "../../../src/go/sauvegarde.c"
 var $6=$2; //@line 71 "../../../src/go/sauvegarde.c"
 var $7=_sauvegarder_plateau($5,$6); //@line 71 "../../../src/go/sauvegarde.c"
 var $8=$1; //@line 73 "../../../src/go/sauvegarde.c"
 var $9=(($8+48)|0); //@line 73 "../../../src/go/sauvegarde.c"
 var $10=HEAP8[($9)]; //@line 73 "../../../src/go/sauvegarde.c"
 var $11=(($10)&1); //@line 73 "../../../src/go/sauvegarde.c"
 var $12=($11?49:48); //@line 73 "../../../src/go/sauvegarde.c"
 var $13=$2; //@line 73 "../../../src/go/sauvegarde.c"
 var $14=_fputc($12,$13); //@line 73 "../../../src/go/sauvegarde.c"
 var $15=$1; //@line 74 "../../../src/go/sauvegarde.c"
 var $16=(($15+49)|0); //@line 74 "../../../src/go/sauvegarde.c"
 var $17=HEAP8[($16)]; //@line 74 "../../../src/go/sauvegarde.c"
 var $18=(($17)&1); //@line 74 "../../../src/go/sauvegarde.c"
 var $19=($18?49:48); //@line 74 "../../../src/go/sauvegarde.c"
 var $20=$2; //@line 74 "../../../src/go/sauvegarde.c"
 var $21=_fputc($19,$20); //@line 74 "../../../src/go/sauvegarde.c"
 var $22=$1; //@line 75 "../../../src/go/sauvegarde.c"
 var $23=(($22+52)|0); //@line 75 "../../../src/go/sauvegarde.c"
 var $24=HEAP32[(($23)>>2)]; //@line 75 "../../../src/go/sauvegarde.c"
 var $25=((($24)+(48))|0); //@line 75 "../../../src/go/sauvegarde.c"
 var $26=$2; //@line 75 "../../../src/go/sauvegarde.c"
 var $27=_fputc($25,$26); //@line 75 "../../../src/go/sauvegarde.c"
 var $28=$2; //@line 76 "../../../src/go/sauvegarde.c"
 var $29=_fputc(10,$28); //@line 76 "../../../src/go/sauvegarde.c"
 $i=0; //@line 78 "../../../src/go/sauvegarde.c"
  //@line 78 "../../../src/go/sauvegarde.c"
 while(1) {
  var $31=$i; //@line 78 "../../../src/go/sauvegarde.c"
  var $32=($31|0)<2; //@line 78 "../../../src/go/sauvegarde.c"
   //@line 78 "../../../src/go/sauvegarde.c"
  if (!($32)) {
   break;
  }
  var $34=$2; //@line 79 "../../../src/go/sauvegarde.c"
  var $35=$i; //@line 79 "../../../src/go/sauvegarde.c"
  var $36=$1; //@line 79 "../../../src/go/sauvegarde.c"
  var $37=(($36+4)|0); //@line 79 "../../../src/go/sauvegarde.c"
  var $38=(($37+((($35)*(20))&-1))|0); //@line 79 "../../../src/go/sauvegarde.c"
  var $39=(($38)|0); //@line 79 "../../../src/go/sauvegarde.c"
  var $40=HEAP32[(($39)>>2)]; //@line 79 "../../../src/go/sauvegarde.c"
  var $41=((($40)+(48))|0); //@line 79 "../../../src/go/sauvegarde.c"
  var $42=$i; //@line 79 "../../../src/go/sauvegarde.c"
  var $43=$1; //@line 79 "../../../src/go/sauvegarde.c"
  var $44=(($43+4)|0); //@line 79 "../../../src/go/sauvegarde.c"
  var $45=(($44+((($42)*(20))&-1))|0); //@line 79 "../../../src/go/sauvegarde.c"
  var $46=(($45+4)|0); //@line 79 "../../../src/go/sauvegarde.c"
  var $47=(($46)|0); //@line 79 "../../../src/go/sauvegarde.c"
  var $48=$i; //@line 79 "../../../src/go/sauvegarde.c"
  var $49=$1; //@line 79 "../../../src/go/sauvegarde.c"
  var $50=(($49+4)|0); //@line 79 "../../../src/go/sauvegarde.c"
  var $51=(($50+((($48)*(20))&-1))|0); //@line 79 "../../../src/go/sauvegarde.c"
  var $52=(($51+16)|0); //@line 79 "../../../src/go/sauvegarde.c"
  var $53=HEAP32[(($52)>>2)]; //@line 79 "../../../src/go/sauvegarde.c"
  var $54=($53|0)!=0; //@line 79 "../../../src/go/sauvegarde.c"
   //@line 79 "../../../src/go/sauvegarde.c"
  if ($54) {
   var $56=$i; //@line 79 "../../../src/go/sauvegarde.c"
   var $57=$1; //@line 79 "../../../src/go/sauvegarde.c"
   var $58=(($57+4)|0); //@line 79 "../../../src/go/sauvegarde.c"
   var $59=(($58+((($56)*(20))&-1))|0); //@line 79 "../../../src/go/sauvegarde.c"
   var $60=(($59+16)|0); //@line 79 "../../../src/go/sauvegarde.c"
   var $61=HEAP32[(($60)>>2)]; //@line 79 "../../../src/go/sauvegarde.c"
   var $62=(($61)|0); //@line 79 "../../../src/go/sauvegarde.c"
   var $63=HEAP32[(($62)>>2)]; //@line 79 "../../../src/go/sauvegarde.c"
    //@line 79 "../../../src/go/sauvegarde.c"
   var $66=$63;
  } else {
    //@line 79 "../../../src/go/sauvegarde.c"
   var $66=1568;
  }
  var $66; //@line 79 "../../../src/go/sauvegarde.c"
  var $67=_fprintf($34,1256,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 24)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$41,HEAP32[(((tempVarArgs)+(8))>>2)]=$47,HEAP32[(((tempVarArgs)+(16))>>2)]=$66,tempVarArgs)); STACKTOP=tempVarArgs; //@line 79 "../../../src/go/sauvegarde.c"
   //@line 84 "../../../src/go/sauvegarde.c"
  var $69=$i; //@line 78 "../../../src/go/sauvegarde.c"
  var $70=((($69)+(1))|0); //@line 78 "../../../src/go/sauvegarde.c"
  $i=$70; //@line 78 "../../../src/go/sauvegarde.c"
   //@line 78 "../../../src/go/sauvegarde.c"
 }
 var $72=$2; //@line 87 "../../../src/go/sauvegarde.c"
 var $73=$1; //@line 87 "../../../src/go/sauvegarde.c"
 var $74=(($73+56)|0); //@line 87 "../../../src/go/sauvegarde.c"
 var $75=HEAP32[(($74)>>2)]; //@line 87 "../../../src/go/sauvegarde.c"
 var $76=(($75+24)|0); //@line 87 "../../../src/go/sauvegarde.c"
 var $77=HEAP32[(($76)>>2)]; //@line 87 "../../../src/go/sauvegarde.c"
 var $78=$1; //@line 87 "../../../src/go/sauvegarde.c"
 var $79=(($78+56)|0); //@line 87 "../../../src/go/sauvegarde.c"
 var $80=HEAP32[(($79)>>2)]; //@line 87 "../../../src/go/sauvegarde.c"
 var $81=FUNCTION_TABLE[$77]($80); //@line 87 "../../../src/go/sauvegarde.c"
 var $82=_fprintf($72,480,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$81,tempVarArgs)); STACKTOP=tempVarArgs; //@line 87 "../../../src/go/sauvegarde.c"
 var $83=$1; //@line 88 "../../../src/go/sauvegarde.c"
 var $84=(($83+56)|0); //@line 88 "../../../src/go/sauvegarde.c"
 var $85=HEAP32[(($84)>>2)]; //@line 88 "../../../src/go/sauvegarde.c"
 var $86=(($85+4)|0); //@line 88 "../../../src/go/sauvegarde.c"
 var $87=HEAP32[(($86)>>2)]; //@line 88 "../../../src/go/sauvegarde.c"
 FUNCTION_TABLE[$87]($it); //@line 88 "../../../src/go/sauvegarde.c"
  //@line 88 "../../../src/go/sauvegarde.c"
 while(1) {
  var $89=$1; //@line 88 "../../../src/go/sauvegarde.c"
  var $90=(($89+56)|0); //@line 88 "../../../src/go/sauvegarde.c"
  var $91=HEAP32[(($90)>>2)]; //@line 88 "../../../src/go/sauvegarde.c"
  var $92=(($91)|0); //@line 88 "../../../src/go/sauvegarde.c"
  var $93=HEAP32[(($92)>>2)]; //@line 88 "../../../src/go/sauvegarde.c"
  var $94=$1; //@line 88 "../../../src/go/sauvegarde.c"
  var $95=(($94+56)|0); //@line 88 "../../../src/go/sauvegarde.c"
  var $96=HEAP32[(($95)>>2)]; //@line 88 "../../../src/go/sauvegarde.c"
  var $97=FUNCTION_TABLE[$93]($it,$96,$p); //@line 88 "../../../src/go/sauvegarde.c"
  var $98=($97|0)!=0; //@line 88 "../../../src/go/sauvegarde.c"
   //@line 88 "../../../src/go/sauvegarde.c"
  if (!($98)) {
   break;
  }
  var $100=HEAP32[(($p)>>2)]; //@line 89 "../../../src/go/sauvegarde.c"
  var $101=$2; //@line 89 "../../../src/go/sauvegarde.c"
  var $102=_sauvegarder_plateau($100,$101); //@line 89 "../../../src/go/sauvegarde.c"
   //@line 90 "../../../src/go/sauvegarde.c"
 }
 var $104=$2; //@line 92 "../../../src/go/sauvegarde.c"
 var $105=$1; //@line 92 "../../../src/go/sauvegarde.c"
 var $106=(($105+60)|0); //@line 92 "../../../src/go/sauvegarde.c"
 var $107=HEAP32[(($106)>>2)]; //@line 92 "../../../src/go/sauvegarde.c"
 var $108=(($107+24)|0); //@line 92 "../../../src/go/sauvegarde.c"
 var $109=HEAP32[(($108)>>2)]; //@line 92 "../../../src/go/sauvegarde.c"
 var $110=$1; //@line 92 "../../../src/go/sauvegarde.c"
 var $111=(($110+60)|0); //@line 92 "../../../src/go/sauvegarde.c"
 var $112=HEAP32[(($111)>>2)]; //@line 92 "../../../src/go/sauvegarde.c"
 var $113=FUNCTION_TABLE[$109]($112); //@line 92 "../../../src/go/sauvegarde.c"
 var $114=_fprintf($104,480,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$113,tempVarArgs)); STACKTOP=tempVarArgs; //@line 92 "../../../src/go/sauvegarde.c"
 var $115=$1; //@line 93 "../../../src/go/sauvegarde.c"
 var $116=(($115+60)|0); //@line 93 "../../../src/go/sauvegarde.c"
 var $117=HEAP32[(($116)>>2)]; //@line 93 "../../../src/go/sauvegarde.c"
 var $118=(($117+4)|0); //@line 93 "../../../src/go/sauvegarde.c"
 var $119=HEAP32[(($118)>>2)]; //@line 93 "../../../src/go/sauvegarde.c"
 FUNCTION_TABLE[$119]($it1); //@line 93 "../../../src/go/sauvegarde.c"
  //@line 93 "../../../src/go/sauvegarde.c"
 while(1) {
  var $121=$1; //@line 93 "../../../src/go/sauvegarde.c"
  var $122=(($121+60)|0); //@line 93 "../../../src/go/sauvegarde.c"
  var $123=HEAP32[(($122)>>2)]; //@line 93 "../../../src/go/sauvegarde.c"
  var $124=(($123)|0); //@line 93 "../../../src/go/sauvegarde.c"
  var $125=HEAP32[(($124)>>2)]; //@line 93 "../../../src/go/sauvegarde.c"
  var $126=$1; //@line 93 "../../../src/go/sauvegarde.c"
  var $127=(($126+60)|0); //@line 93 "../../../src/go/sauvegarde.c"
  var $128=HEAP32[(($127)>>2)]; //@line 93 "../../../src/go/sauvegarde.c"
  var $129=FUNCTION_TABLE[$125]($it1,$128,$p); //@line 93 "../../../src/go/sauvegarde.c"
  var $130=($129|0)!=0; //@line 93 "../../../src/go/sauvegarde.c"
   //@line 93 "../../../src/go/sauvegarde.c"
  if (!($130)) {
   break;
  }
  var $132=HEAP32[(($p)>>2)]; //@line 94 "../../../src/go/sauvegarde.c"
  var $133=$2; //@line 94 "../../../src/go/sauvegarde.c"
  var $134=_sauvegarder_plateau($132,$133); //@line 94 "../../../src/go/sauvegarde.c"
   //@line 95 "../../../src/go/sauvegarde.c"
 }
 STACKTOP=sp;return 1; //@line 97 "../../../src/go/sauvegarde.c"
}


function _sauvegarder_plateau($plateau,$file){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+32)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $longueur;
 var $version=sp;
 var $taille=(sp)+(8);
 var $format=(sp)+(16);
 var $nbElement;
 var $data;
 var $i;
 var $toWrite=(sp)+(24);
 $2=$plateau;
 $3=$file;
 var $4=$2; //@line 178 "../../../src/go/sauvegarde.c"
 var $5=_plateau_get_taille($4); //@line 178 "../../../src/go/sauvegarde.c"
 $longueur=$5; //@line 178 "../../../src/go/sauvegarde.c"
 var $6=_htonl(0); //@line 180 "../../../src/go/sauvegarde.c"
 HEAP32[(($version)>>2)]=$6; //@line 180 "../../../src/go/sauvegarde.c"
 var $7=$longueur; //@line 181 "../../../src/go/sauvegarde.c"
 var $8=_htonl($7); //@line 181 "../../../src/go/sauvegarde.c"
 HEAP32[(($taille)>>2)]=$8; //@line 181 "../../../src/go/sauvegarde.c"
 HEAP8[($format)]=66; //@line 182 "../../../src/go/sauvegarde.c"
 var $9=$3; //@line 184 "../../../src/go/sauvegarde.c"
 var $10=_fwrite($format,1,1,$9); //@line 184 "../../../src/go/sauvegarde.c"
 var $11=($10|0)!=0; //@line 184 "../../../src/go/sauvegarde.c"
  //@line 184 "../../../src/go/sauvegarde.c"
 do {
  if ($11) {
   var $13=$version; //@line 185 "../../../src/go/sauvegarde.c"
   var $14=$3; //@line 185 "../../../src/go/sauvegarde.c"
   var $15=_fwrite($13,4,1,$14); //@line 185 "../../../src/go/sauvegarde.c"
   var $16=($15|0)!=0; //@line 185 "../../../src/go/sauvegarde.c"
    //@line 185 "../../../src/go/sauvegarde.c"
   if (!($16)) {
    break;
   }
   var $18=$taille; //@line 186 "../../../src/go/sauvegarde.c"
   var $19=$3; //@line 186 "../../../src/go/sauvegarde.c"
   var $20=_fwrite($18,4,1,$19); //@line 186 "../../../src/go/sauvegarde.c"
   var $21=($20|0)!=0; //@line 186 "../../../src/go/sauvegarde.c"
    //@line 186 "../../../src/go/sauvegarde.c"
   if (!($21)) {
    break;
   }
   var $24=$longueur; //@line 192 "../../../src/go/sauvegarde.c"
   var $25=_plateau_data_size($24); //@line 192 "../../../src/go/sauvegarde.c"
   var $26=(((($25>>>0))/(4))&-1); //@line 192 "../../../src/go/sauvegarde.c"
   $nbElement=$26; //@line 192 "../../../src/go/sauvegarde.c"
   var $27=$2; //@line 193 "../../../src/go/sauvegarde.c"
   var $28=_plateau_data($27); //@line 193 "../../../src/go/sauvegarde.c"
   $data=$28; //@line 193 "../../../src/go/sauvegarde.c"
   $i=0; //@line 195 "../../../src/go/sauvegarde.c"
    //@line 195 "../../../src/go/sauvegarde.c"
   while(1) {
    var $30=$i; //@line 195 "../../../src/go/sauvegarde.c"
    var $31=$nbElement; //@line 195 "../../../src/go/sauvegarde.c"
    var $32=($30>>>0)<($31>>>0); //@line 195 "../../../src/go/sauvegarde.c"
     //@line 195 "../../../src/go/sauvegarde.c"
    if (!($32)) {
     label = 11;
     break;
    }
    var $34=$i; //@line 196 "../../../src/go/sauvegarde.c"
    var $35=$data; //@line 196 "../../../src/go/sauvegarde.c"
    var $36=(($35+($34<<2))|0); //@line 196 "../../../src/go/sauvegarde.c"
    var $37=HEAP32[(($36)>>2)]; //@line 196 "../../../src/go/sauvegarde.c"
    var $38=_htonl($37); //@line 196 "../../../src/go/sauvegarde.c"
    HEAP32[(($toWrite)>>2)]=$38; //@line 196 "../../../src/go/sauvegarde.c"
    var $39=$toWrite; //@line 197 "../../../src/go/sauvegarde.c"
    var $40=$3; //@line 197 "../../../src/go/sauvegarde.c"
    var $41=_fwrite($39,4,1,$40); //@line 197 "../../../src/go/sauvegarde.c"
    var $42=($41|0)!=0; //@line 197 "../../../src/go/sauvegarde.c"
     //@line 197 "../../../src/go/sauvegarde.c"
    if (!($42)) {
     label = 8;
     break;
    }
     //@line 199 "../../../src/go/sauvegarde.c"
    var $46=$i; //@line 195 "../../../src/go/sauvegarde.c"
    var $47=((($46)+(1))|0); //@line 195 "../../../src/go/sauvegarde.c"
    $i=$47; //@line 195 "../../../src/go/sauvegarde.c"
     //@line 195 "../../../src/go/sauvegarde.c"
   }
   if (label == 8) {
    $1=0; //@line 198 "../../../src/go/sauvegarde.c"
     //@line 198 "../../../src/go/sauvegarde.c"
    var $50=$1; //@line 202 "../../../src/go/sauvegarde.c"
    STACKTOP=sp;return $50; //@line 202 "../../../src/go/sauvegarde.c"
   }
   else if (label == 11) {
    $1=1; //@line 201 "../../../src/go/sauvegarde.c"
     //@line 201 "../../../src/go/sauvegarde.c"
    var $50=$1; //@line 202 "../../../src/go/sauvegarde.c"
    STACKTOP=sp;return $50; //@line 202 "../../../src/go/sauvegarde.c"
   }
  }
 } while(0);
 $1=0; //@line 189 "../../../src/go/sauvegarde.c"
  //@line 189 "../../../src/go/sauvegarde.c"
 var $50=$1; //@line 202 "../../../src/go/sauvegarde.c"
 STACKTOP=sp;return $50; //@line 202 "../../../src/go/sauvegarde.c"
}


function _charger_partie_fichier($filename){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $file;
 var $partie;
 $2=$filename;
 var $3=$2; //@line 102 "../../../src/go/sauvegarde.c"
 var $4=_fopen($3,368); //@line 102 "../../../src/go/sauvegarde.c"
 $file=$4; //@line 102 "../../../src/go/sauvegarde.c"
 var $5=$file; //@line 103 "../../../src/go/sauvegarde.c"
 var $6=($5|0)!=0; //@line 103 "../../../src/go/sauvegarde.c"
  //@line 103 "../../../src/go/sauvegarde.c"
 if ($6) {
  var $9=$file; //@line 105 "../../../src/go/sauvegarde.c"
  var $10=_charger_partie($9); //@line 105 "../../../src/go/sauvegarde.c"
  $partie=$10; //@line 105 "../../../src/go/sauvegarde.c"
  var $11=$file; //@line 106 "../../../src/go/sauvegarde.c"
  var $12=_fclose($11); //@line 106 "../../../src/go/sauvegarde.c"
  var $13=$partie; //@line 107 "../../../src/go/sauvegarde.c"
  $1=$13; //@line 107 "../../../src/go/sauvegarde.c"
   //@line 107 "../../../src/go/sauvegarde.c"
  var $15=$1; //@line 108 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $15; //@line 108 "../../../src/go/sauvegarde.c"
 } else {
  $1=0; //@line 104 "../../../src/go/sauvegarde.c"
   //@line 104 "../../../src/go/sauvegarde.c"
  var $15=$1; //@line 108 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $15; //@line 108 "../../../src/go/sauvegarde.c"
 }
}


function _charger_partie($file){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+4120)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $p;
 var $i;
 var $nom;
 var $name=sp;
 var $number_buffer=(sp)+(4096);
 var $number;
 var $i1;
 var $i2;
 $2=$file;
 var $3=_creer_partie(); //@line 112 "../../../src/go/sauvegarde.c"
 $p=$3; //@line 112 "../../../src/go/sauvegarde.c"
 var $4=$2; //@line 113 "../../../src/go/sauvegarde.c"
 var $5=_charger_plateau($4); //@line 113 "../../../src/go/sauvegarde.c"
 var $6=$p; //@line 113 "../../../src/go/sauvegarde.c"
 var $7=(($6)|0); //@line 113 "../../../src/go/sauvegarde.c"
 HEAP32[(($7)>>2)]=$5; //@line 113 "../../../src/go/sauvegarde.c"
 var $8=$2; //@line 114 "../../../src/go/sauvegarde.c"
 var $9=_fgetc($8); //@line 114 "../../../src/go/sauvegarde.c"
 var $10=($9|0)!=48; //@line 114 "../../../src/go/sauvegarde.c"
 var $11=$p; //@line 114 "../../../src/go/sauvegarde.c"
 var $12=(($11+48)|0); //@line 114 "../../../src/go/sauvegarde.c"
 var $13=($10&1); //@line 114 "../../../src/go/sauvegarde.c"
 HEAP8[($12)]=$13; //@line 114 "../../../src/go/sauvegarde.c"
 var $14=$2; //@line 115 "../../../src/go/sauvegarde.c"
 var $15=_fgetc($14); //@line 115 "../../../src/go/sauvegarde.c"
 var $16=($15|0)!=48; //@line 115 "../../../src/go/sauvegarde.c"
 var $17=$p; //@line 115 "../../../src/go/sauvegarde.c"
 var $18=(($17+49)|0); //@line 115 "../../../src/go/sauvegarde.c"
 var $19=($16&1); //@line 115 "../../../src/go/sauvegarde.c"
 HEAP8[($18)]=$19; //@line 115 "../../../src/go/sauvegarde.c"
 var $20=$2; //@line 116 "../../../src/go/sauvegarde.c"
 var $21=_fgetc($20); //@line 116 "../../../src/go/sauvegarde.c"
 var $22=((($21)-(48))|0); //@line 116 "../../../src/go/sauvegarde.c"
 var $23=$p; //@line 116 "../../../src/go/sauvegarde.c"
 var $24=(($23+52)|0); //@line 116 "../../../src/go/sauvegarde.c"
 HEAP32[(($24)>>2)]=$22; //@line 116 "../../../src/go/sauvegarde.c"
 var $25=$2; //@line 117 "../../../src/go/sauvegarde.c"
 var $26=_fgetc($25); //@line 117 "../../../src/go/sauvegarde.c"
 $i=0; //@line 119 "../../../src/go/sauvegarde.c"
  //@line 119 "../../../src/go/sauvegarde.c"
 while(1) {
  var $28=$i; //@line 119 "../../../src/go/sauvegarde.c"
  var $29=($28|0)<2; //@line 119 "../../../src/go/sauvegarde.c"
   //@line 119 "../../../src/go/sauvegarde.c"
  if (!($29)) {
   break;
  }
  var $31=$2; //@line 120 "../../../src/go/sauvegarde.c"
  var $32=_fgetc($31); //@line 120 "../../../src/go/sauvegarde.c"
  var $33=((($32)-(48))|0); //@line 120 "../../../src/go/sauvegarde.c"
  var $34=$i; //@line 120 "../../../src/go/sauvegarde.c"
  var $35=$p; //@line 120 "../../../src/go/sauvegarde.c"
  var $36=(($35+4)|0); //@line 120 "../../../src/go/sauvegarde.c"
  var $37=(($36+((($34)*(20))&-1))|0); //@line 120 "../../../src/go/sauvegarde.c"
  var $38=(($37)|0); //@line 120 "../../../src/go/sauvegarde.c"
  HEAP32[(($38)>>2)]=$33; //@line 120 "../../../src/go/sauvegarde.c"
  var $39=$i; //@line 122 "../../../src/go/sauvegarde.c"
  var $40=$p; //@line 122 "../../../src/go/sauvegarde.c"
  var $41=(($40+4)|0); //@line 122 "../../../src/go/sauvegarde.c"
  var $42=(($41+((($39)*(20))&-1))|0); //@line 122 "../../../src/go/sauvegarde.c"
  var $43=(($42+4)|0); //@line 122 "../../../src/go/sauvegarde.c"
  var $44=(($43)|0); //@line 122 "../../../src/go/sauvegarde.c"
  $nom=$44; //@line 122 "../../../src/go/sauvegarde.c"
  var $45=$nom; //@line 123 "../../../src/go/sauvegarde.c"
  var $46=$2; //@line 123 "../../../src/go/sauvegarde.c"
  var $47=_fgets($45,11,$46); //@line 123 "../../../src/go/sauvegarde.c"
  var $48=$nom; //@line 124 "../../../src/go/sauvegarde.c"
  var $49=_strlen($48); //@line 124 "../../../src/go/sauvegarde.c"
  var $50=((($49)-(1))|0); //@line 124 "../../../src/go/sauvegarde.c"
  var $51=$nom; //@line 124 "../../../src/go/sauvegarde.c"
  var $52=(($51+$50)|0); //@line 124 "../../../src/go/sauvegarde.c"
  var $53=HEAP8[($52)]; //@line 124 "../../../src/go/sauvegarde.c"
  var $54=(($53<<24)>>24); //@line 124 "../../../src/go/sauvegarde.c"
  var $55=($54|0)==10; //@line 124 "../../../src/go/sauvegarde.c"
   //@line 124 "../../../src/go/sauvegarde.c"
  if ($55) {
   var $57=$nom; //@line 125 "../../../src/go/sauvegarde.c"
   var $58=_strlen($57); //@line 125 "../../../src/go/sauvegarde.c"
   var $59=((($58)-(1))|0); //@line 125 "../../../src/go/sauvegarde.c"
   var $60=$nom; //@line 125 "../../../src/go/sauvegarde.c"
   var $61=(($60+$59)|0); //@line 125 "../../../src/go/sauvegarde.c"
   HEAP8[($61)]=0; //@line 125 "../../../src/go/sauvegarde.c"
    //@line 125 "../../../src/go/sauvegarde.c"
  } else {
   var $63=$2; //@line 127 "../../../src/go/sauvegarde.c"
   var $64=_fgetc($63); //@line 127 "../../../src/go/sauvegarde.c"
  }
  var $66=(($name)|0); //@line 129 "../../../src/go/sauvegarde.c"
  var $67=$2; //@line 129 "../../../src/go/sauvegarde.c"
  var $68=_fgets($66,4095,$67); //@line 129 "../../../src/go/sauvegarde.c"
  var $69=(($name)|0); //@line 130 "../../../src/go/sauvegarde.c"
  var $70=_strlen($69); //@line 130 "../../../src/go/sauvegarde.c"
  var $71=((($70)-(1))|0); //@line 130 "../../../src/go/sauvegarde.c"
  var $72=(($name+$71)|0); //@line 130 "../../../src/go/sauvegarde.c"
  var $73=HEAP8[($72)]; //@line 130 "../../../src/go/sauvegarde.c"
  var $74=(($73<<24)>>24); //@line 130 "../../../src/go/sauvegarde.c"
  var $75=($74|0)==10; //@line 130 "../../../src/go/sauvegarde.c"
   //@line 130 "../../../src/go/sauvegarde.c"
  if ($75) {
   var $77=(($name)|0); //@line 131 "../../../src/go/sauvegarde.c"
   var $78=_strlen($77); //@line 131 "../../../src/go/sauvegarde.c"
   var $79=((($78)-(1))|0); //@line 131 "../../../src/go/sauvegarde.c"
   var $80=(($name+$79)|0); //@line 131 "../../../src/go/sauvegarde.c"
   HEAP8[($80)]=0; //@line 131 "../../../src/go/sauvegarde.c"
    //@line 131 "../../../src/go/sauvegarde.c"
  } else {
   var $82=$2; //@line 133 "../../../src/go/sauvegarde.c"
   var $83=_fgetc($82); //@line 133 "../../../src/go/sauvegarde.c"
  }
  var $85=(($name)|0); //@line 134 "../../../src/go/sauvegarde.c"
  var $86=HEAP8[($85)]; //@line 134 "../../../src/go/sauvegarde.c"
  var $87=(($86<<24)>>24)!=0; //@line 134 "../../../src/go/sauvegarde.c"
   //@line 134 "../../../src/go/sauvegarde.c"
  if ($87) {
   var $89=(($name)|0); //@line 135 "../../../src/go/sauvegarde.c"
   var $90=_charger_ordinateur($89); //@line 135 "../../../src/go/sauvegarde.c"
   var $91=$i; //@line 135 "../../../src/go/sauvegarde.c"
   var $92=$p; //@line 135 "../../../src/go/sauvegarde.c"
   var $93=(($92+4)|0); //@line 135 "../../../src/go/sauvegarde.c"
   var $94=(($93+((($91)*(20))&-1))|0); //@line 135 "../../../src/go/sauvegarde.c"
   var $95=(($94+16)|0); //@line 135 "../../../src/go/sauvegarde.c"
   HEAP32[(($95)>>2)]=$90; //@line 135 "../../../src/go/sauvegarde.c"
    //@line 135 "../../../src/go/sauvegarde.c"
  } else {
   var $97=$i; //@line 137 "../../../src/go/sauvegarde.c"
   var $98=$p; //@line 137 "../../../src/go/sauvegarde.c"
   var $99=(($98+4)|0); //@line 137 "../../../src/go/sauvegarde.c"
   var $100=(($99+((($97)*(20))&-1))|0); //@line 137 "../../../src/go/sauvegarde.c"
   var $101=(($100+16)|0); //@line 137 "../../../src/go/sauvegarde.c"
   HEAP32[(($101)>>2)]=0; //@line 137 "../../../src/go/sauvegarde.c"
  }
   //@line 138 "../../../src/go/sauvegarde.c"
  var $104=$i; //@line 119 "../../../src/go/sauvegarde.c"
  var $105=((($104)+(1))|0); //@line 119 "../../../src/go/sauvegarde.c"
  $i=$105; //@line 119 "../../../src/go/sauvegarde.c"
   //@line 119 "../../../src/go/sauvegarde.c"
 }
 var $107=(($number_buffer)|0); //@line 142 "../../../src/go/sauvegarde.c"
 var $108=$2; //@line 142 "../../../src/go/sauvegarde.c"
 var $109=_fgets($107,19,$108); //@line 142 "../../../src/go/sauvegarde.c"
 var $110=(($number_buffer)|0); //@line 143 "../../../src/go/sauvegarde.c"
 var $111=_strlen($110); //@line 143 "../../../src/go/sauvegarde.c"
 var $112=((($111)-(1))|0); //@line 143 "../../../src/go/sauvegarde.c"
 var $113=(($number_buffer+$112)|0); //@line 143 "../../../src/go/sauvegarde.c"
 HEAP8[($113)]=0; //@line 143 "../../../src/go/sauvegarde.c"
 var $114=(($number_buffer)|0); //@line 144 "../../../src/go/sauvegarde.c"
 var $115=_atoi($114); //@line 144 "../../../src/go/sauvegarde.c"
 $number=$115; //@line 144 "../../../src/go/sauvegarde.c"
 $i1=0; //@line 146 "../../../src/go/sauvegarde.c"
  //@line 146 "../../../src/go/sauvegarde.c"
 while(1) {
  var $117=$i1; //@line 146 "../../../src/go/sauvegarde.c"
  var $118=$number; //@line 146 "../../../src/go/sauvegarde.c"
  var $119=($117|0)<($118|0); //@line 146 "../../../src/go/sauvegarde.c"
   //@line 146 "../../../src/go/sauvegarde.c"
  if (!($119)) {
   break;
  }
  var $121=$p; //@line 147 "../../../src/go/sauvegarde.c"
  var $122=(($121+56)|0); //@line 147 "../../../src/go/sauvegarde.c"
  var $123=HEAP32[(($122)>>2)]; //@line 147 "../../../src/go/sauvegarde.c"
  var $124=(($123+12)|0); //@line 147 "../../../src/go/sauvegarde.c"
  var $125=HEAP32[(($124)>>2)]; //@line 147 "../../../src/go/sauvegarde.c"
  var $126=$p; //@line 147 "../../../src/go/sauvegarde.c"
  var $127=(($126+56)|0); //@line 147 "../../../src/go/sauvegarde.c"
  var $128=HEAP32[(($127)>>2)]; //@line 147 "../../../src/go/sauvegarde.c"
  var $129=$2; //@line 147 "../../../src/go/sauvegarde.c"
  var $130=_charger_plateau($129); //@line 147 "../../../src/go/sauvegarde.c"
  FUNCTION_TABLE[$125]($128,$130); //@line 147 "../../../src/go/sauvegarde.c"
   //@line 147 "../../../src/go/sauvegarde.c"
  var $132=$i1; //@line 146 "../../../src/go/sauvegarde.c"
  var $133=((($132)+(1))|0); //@line 146 "../../../src/go/sauvegarde.c"
  $i1=$133; //@line 146 "../../../src/go/sauvegarde.c"
   //@line 146 "../../../src/go/sauvegarde.c"
 }
 var $135=(($number_buffer)|0); //@line 149 "../../../src/go/sauvegarde.c"
 var $136=$2; //@line 149 "../../../src/go/sauvegarde.c"
 var $137=_fgets($135,19,$136); //@line 149 "../../../src/go/sauvegarde.c"
 var $138=(($number_buffer)|0); //@line 150 "../../../src/go/sauvegarde.c"
 var $139=_strlen($138); //@line 150 "../../../src/go/sauvegarde.c"
 var $140=((($139)-(1))|0); //@line 150 "../../../src/go/sauvegarde.c"
 var $141=(($number_buffer+$140)|0); //@line 150 "../../../src/go/sauvegarde.c"
 HEAP8[($141)]=0; //@line 150 "../../../src/go/sauvegarde.c"
 var $142=(($number_buffer)|0); //@line 151 "../../../src/go/sauvegarde.c"
 var $143=_atoi($142); //@line 151 "../../../src/go/sauvegarde.c"
 $number=$143; //@line 151 "../../../src/go/sauvegarde.c"
 $i2=0; //@line 153 "../../../src/go/sauvegarde.c"
  //@line 153 "../../../src/go/sauvegarde.c"
 while(1) {
  var $145=$i2; //@line 153 "../../../src/go/sauvegarde.c"
  var $146=$number; //@line 153 "../../../src/go/sauvegarde.c"
  var $147=($145|0)<($146|0); //@line 153 "../../../src/go/sauvegarde.c"
   //@line 153 "../../../src/go/sauvegarde.c"
  if (!($147)) {
   break;
  }
  var $149=$p; //@line 154 "../../../src/go/sauvegarde.c"
  var $150=(($149+60)|0); //@line 154 "../../../src/go/sauvegarde.c"
  var $151=HEAP32[(($150)>>2)]; //@line 154 "../../../src/go/sauvegarde.c"
  var $152=(($151+12)|0); //@line 154 "../../../src/go/sauvegarde.c"
  var $153=HEAP32[(($152)>>2)]; //@line 154 "../../../src/go/sauvegarde.c"
  var $154=$p; //@line 154 "../../../src/go/sauvegarde.c"
  var $155=(($154+60)|0); //@line 154 "../../../src/go/sauvegarde.c"
  var $156=HEAP32[(($155)>>2)]; //@line 154 "../../../src/go/sauvegarde.c"
  var $157=$2; //@line 154 "../../../src/go/sauvegarde.c"
  var $158=_charger_plateau($157); //@line 154 "../../../src/go/sauvegarde.c"
  FUNCTION_TABLE[$153]($156,$158); //@line 154 "../../../src/go/sauvegarde.c"
   //@line 154 "../../../src/go/sauvegarde.c"
  var $160=$i2; //@line 153 "../../../src/go/sauvegarde.c"
  var $161=((($160)+(1))|0); //@line 153 "../../../src/go/sauvegarde.c"
  $i2=$161; //@line 153 "../../../src/go/sauvegarde.c"
   //@line 153 "../../../src/go/sauvegarde.c"
 }
 var $163=$p; //@line 156 "../../../src/go/sauvegarde.c"
 var $164=(($163)|0); //@line 156 "../../../src/go/sauvegarde.c"
 var $165=HEAP32[(($164)>>2)]; //@line 156 "../../../src/go/sauvegarde.c"
 var $166=($165|0)!=0; //@line 156 "../../../src/go/sauvegarde.c"
  //@line 156 "../../../src/go/sauvegarde.c"
 if ($166) {
  var $170=$p; //@line 161 "../../../src/go/sauvegarde.c"
  _partie_informer_ordinateur($170); //@line 161 "../../../src/go/sauvegarde.c"
  var $171=$p; //@line 163 "../../../src/go/sauvegarde.c"
  $1=$171; //@line 163 "../../../src/go/sauvegarde.c"
   //@line 163 "../../../src/go/sauvegarde.c"
  var $173=$1; //@line 164 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $173; //@line 164 "../../../src/go/sauvegarde.c"
 } else {
  var $168=$p; //@line 157 "../../../src/go/sauvegarde.c"
  _detruire_partie($168); //@line 157 "../../../src/go/sauvegarde.c"
  $1=0; //@line 158 "../../../src/go/sauvegarde.c"
   //@line 158 "../../../src/go/sauvegarde.c"
  var $173=$1; //@line 164 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $173; //@line 164 "../../../src/go/sauvegarde.c"
 }
}


function _charger_plateau($file){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $format=sp;
 $2=$file;
 var $3=$2; //@line 299 "../../../src/go/sauvegarde.c"
 var $4=_fread($format,1,1,$3); //@line 299 "../../../src/go/sauvegarde.c"
 var $5=($4|0)!=0; //@line 299 "../../../src/go/sauvegarde.c"
  //@line 299 "../../../src/go/sauvegarde.c"
 do {
  if ($5) {
   var $8=HEAP8[($format)]; //@line 301 "../../../src/go/sauvegarde.c"
   var $9=(($8<<24)>>24); //@line 301 "../../../src/go/sauvegarde.c"
   var $10=($9|0)==66; //@line 301 "../../../src/go/sauvegarde.c"
    //@line 301 "../../../src/go/sauvegarde.c"
   if ($10) {
    var $12=$2; //@line 302 "../../../src/go/sauvegarde.c"
    var $13=_charger_plateau_binaire($12); //@line 302 "../../../src/go/sauvegarde.c"
    $1=$13; //@line 302 "../../../src/go/sauvegarde.c"
     //@line 302 "../../../src/go/sauvegarde.c"
    break;
   }
   var $15=HEAP8[($format)]; //@line 303 "../../../src/go/sauvegarde.c"
   var $16=(($15<<24)>>24); //@line 303 "../../../src/go/sauvegarde.c"
   var $17=($16|0)==84; //@line 303 "../../../src/go/sauvegarde.c"
    //@line 303 "../../../src/go/sauvegarde.c"
   if ($17) {
    var $19=$2; //@line 304 "../../../src/go/sauvegarde.c"
    var $20=_charger_plateau_texte($19); //@line 304 "../../../src/go/sauvegarde.c"
    $1=$20; //@line 304 "../../../src/go/sauvegarde.c"
     //@line 304 "../../../src/go/sauvegarde.c"
    break;
   } else {
    var $22=___errno_location(); //@line 306 "../../../src/go/sauvegarde.c"
    HEAP32[(($22)>>2)]=95; //@line 306 "../../../src/go/sauvegarde.c"
    $1=0; //@line 307 "../../../src/go/sauvegarde.c"
     //@line 307 "../../../src/go/sauvegarde.c"
    break;
   }
  } else {
   $1=0; //@line 300 "../../../src/go/sauvegarde.c"
    //@line 300 "../../../src/go/sauvegarde.c"
  }
 } while(0);
 var $24=$1; //@line 309 "../../../src/go/sauvegarde.c"
 STACKTOP=sp;return $24; //@line 309 "../../../src/go/sauvegarde.c"
}


function _charger_plateau_texte($file){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $taille=sp;
 var $plateau;
 var $c=(sp)+(8);
 var $y;
 var $x;
 var $couleur;
 $2=$file;
 var $3=$2; //@line 222 "../../../src/go/sauvegarde.c"
 var $4=_fscanf($3,480,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$taille,tempVarArgs)); STACKTOP=tempVarArgs; //@line 222 "../../../src/go/sauvegarde.c"
 var $5=HEAP32[(($taille)>>2)]; //@line 223 "../../../src/go/sauvegarde.c"
 var $6=_creer_plateau($5); //@line 223 "../../../src/go/sauvegarde.c"
 $plateau=$6; //@line 223 "../../../src/go/sauvegarde.c"
 $y=0; //@line 226 "../../../src/go/sauvegarde.c"
  //@line 226 "../../../src/go/sauvegarde.c"
 L1: while(1) {
  var $8=$y; //@line 226 "../../../src/go/sauvegarde.c"
  var $9=HEAP32[(($taille)>>2)]; //@line 226 "../../../src/go/sauvegarde.c"
  var $10=($8|0)<($9|0); //@line 226 "../../../src/go/sauvegarde.c"
   //@line 226 "../../../src/go/sauvegarde.c"
  if (!($10)) {
   label = 24;
   break;
  }
  $x=0; //@line 227 "../../../src/go/sauvegarde.c"
   //@line 227 "../../../src/go/sauvegarde.c"
  while(1) {
   var $13=$x; //@line 227 "../../../src/go/sauvegarde.c"
   var $14=HEAP32[(($taille)>>2)]; //@line 227 "../../../src/go/sauvegarde.c"
   var $15=($13|0)<($14|0); //@line 227 "../../../src/go/sauvegarde.c"
    //@line 227 "../../../src/go/sauvegarde.c"
   if (!($15)) {
    break;
   }
    //@line 228 "../../../src/go/sauvegarde.c"
   while(1) {
    var $18=$2; //@line 229 "../../../src/go/sauvegarde.c"
    var $19=_fscanf($18,280,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$c,tempVarArgs)); STACKTOP=tempVarArgs; //@line 229 "../../../src/go/sauvegarde.c"
     //@line 230 "../../../src/go/sauvegarde.c"
    var $21=HEAP8[($c)]; //@line 230 "../../../src/go/sauvegarde.c"
    var $22=(($21<<24)>>24); //@line 230 "../../../src/go/sauvegarde.c"
    var $23=($22|0)==32; //@line 230 "../../../src/go/sauvegarde.c"
     //@line 230 "../../../src/go/sauvegarde.c"
    if (!($23)) {
     break;
    }
   }
   $couleur=0; //@line 231 "../../../src/go/sauvegarde.c"
   var $25=HEAP8[($c)]; //@line 232 "../../../src/go/sauvegarde.c"
   var $26=(($25<<24)>>24); //@line 232 "../../../src/go/sauvegarde.c"
   var $27=($26|0)==78; //@line 232 "../../../src/go/sauvegarde.c"
    //@line 232 "../../../src/go/sauvegarde.c"
   if ($27) {
    $couleur=2; //@line 233 "../../../src/go/sauvegarde.c"
     //@line 234 "../../../src/go/sauvegarde.c"
   } else {
    var $30=HEAP8[($c)]; //@line 234 "../../../src/go/sauvegarde.c"
    var $31=(($30<<24)>>24); //@line 234 "../../../src/go/sauvegarde.c"
    var $32=($31|0)==66; //@line 234 "../../../src/go/sauvegarde.c"
     //@line 234 "../../../src/go/sauvegarde.c"
    if ($32) {
     $couleur=1; //@line 235 "../../../src/go/sauvegarde.c"
      //@line 236 "../../../src/go/sauvegarde.c"
    } else {
     var $35=HEAP8[($c)]; //@line 236 "../../../src/go/sauvegarde.c"
     var $36=(($35<<24)>>24); //@line 236 "../../../src/go/sauvegarde.c"
     var $37=($36|0)==46; //@line 236 "../../../src/go/sauvegarde.c"
      //@line 236 "../../../src/go/sauvegarde.c"
     if (!($37)) {
      label = 14;
      break L1;
     }
     $couleur=0; //@line 237 "../../../src/go/sauvegarde.c"
      //@line 238 "../../../src/go/sauvegarde.c"
    }
   }
   var $50=$plateau; //@line 243 "../../../src/go/sauvegarde.c"
   var $51=$x; //@line 243 "../../../src/go/sauvegarde.c"
   var $52=$y; //@line 243 "../../../src/go/sauvegarde.c"
   var $53=$couleur; //@line 243 "../../../src/go/sauvegarde.c"
   _plateau_set($50,$51,$52,$53); //@line 243 "../../../src/go/sauvegarde.c"
    //@line 244 "../../../src/go/sauvegarde.c"
   var $55=$x; //@line 227 "../../../src/go/sauvegarde.c"
   var $56=((($55)+(1))|0); //@line 227 "../../../src/go/sauvegarde.c"
   $x=$56; //@line 227 "../../../src/go/sauvegarde.c"
    //@line 227 "../../../src/go/sauvegarde.c"
  }
   //@line 245 "../../../src/go/sauvegarde.c"
  while(1) {
   var $59=$2; //@line 246 "../../../src/go/sauvegarde.c"
   var $60=_fscanf($59,280,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 8)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$c,tempVarArgs)); STACKTOP=tempVarArgs; //@line 246 "../../../src/go/sauvegarde.c"
    //@line 247 "../../../src/go/sauvegarde.c"
   var $62=HEAP8[($c)]; //@line 247 "../../../src/go/sauvegarde.c"
   var $63=(($62<<24)>>24); //@line 247 "../../../src/go/sauvegarde.c"
   var $64=($63|0)!=10; //@line 247 "../../../src/go/sauvegarde.c"
    //@line 247 "../../../src/go/sauvegarde.c"
   if (!($64)) {
    break;
   }
  }
   //@line 248 "../../../src/go/sauvegarde.c"
  var $67=$y; //@line 226 "../../../src/go/sauvegarde.c"
  var $68=((($67)+(1))|0); //@line 226 "../../../src/go/sauvegarde.c"
  $y=$68; //@line 226 "../../../src/go/sauvegarde.c"
   //@line 226 "../../../src/go/sauvegarde.c"
 }
 if (label == 14) {
  var $40=HEAP32[((_stderr)>>2)]; //@line 239 "../../../src/go/sauvegarde.c"
  var $41=HEAP8[($c)]; //@line 239 "../../../src/go/sauvegarde.c"
  var $42=(($41<<24)>>24); //@line 239 "../../../src/go/sauvegarde.c"
  var $43=$x; //@line 239 "../../../src/go/sauvegarde.c"
  var $44=$y; //@line 239 "../../../src/go/sauvegarde.c"
  var $45=_fprintf($40,216,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 24)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=$42,HEAP32[(((tempVarArgs)+(8))>>2)]=$43,HEAP32[(((tempVarArgs)+(16))>>2)]=$44,tempVarArgs)); STACKTOP=tempVarArgs; //@line 239 "../../../src/go/sauvegarde.c"
  var $46=___errno_location(); //@line 240 "../../../src/go/sauvegarde.c"
  HEAP32[(($46)>>2)]=95; //@line 240 "../../../src/go/sauvegarde.c"
  $1=0; //@line 241 "../../../src/go/sauvegarde.c"
   //@line 241 "../../../src/go/sauvegarde.c"
  var $72=$1; //@line 251 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $72; //@line 251 "../../../src/go/sauvegarde.c"
 }
 else if (label == 24) {
  var $70=$plateau; //@line 250 "../../../src/go/sauvegarde.c"
  $1=$70; //@line 250 "../../../src/go/sauvegarde.c"
   //@line 250 "../../../src/go/sauvegarde.c"
  var $72=$1; //@line 251 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $72; //@line 251 "../../../src/go/sauvegarde.c"
 }
}


function _charger_plateau_binaire($file){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $version=sp;
 var $taille=(sp)+(8);
 var $plateau;
 var $nbElement;
 var $data;
 var $i;
 $2=$file;
 var $3=$version; //@line 261 "../../../src/go/sauvegarde.c"
 var $4=$2; //@line 261 "../../../src/go/sauvegarde.c"
 var $5=_fread($3,4,1,$4); //@line 261 "../../../src/go/sauvegarde.c"
 var $6=($5|0)!=0; //@line 261 "../../../src/go/sauvegarde.c"
  //@line 261 "../../../src/go/sauvegarde.c"
 if (!($6)) {
  $1=0; //@line 262 "../../../src/go/sauvegarde.c"
   //@line 262 "../../../src/go/sauvegarde.c"
  var $66=$1; //@line 293 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $66; //@line 293 "../../../src/go/sauvegarde.c"
 }
 var $9=HEAP32[(($version)>>2)]; //@line 263 "../../../src/go/sauvegarde.c"
 var $10=_htonl($9); //@line 263 "../../../src/go/sauvegarde.c"
 HEAP32[(($version)>>2)]=$10; //@line 263 "../../../src/go/sauvegarde.c"
 var $11=HEAP32[(($version)>>2)]; //@line 265 "../../../src/go/sauvegarde.c"
 var $12=($11>>>0)>0; //@line 265 "../../../src/go/sauvegarde.c"
  //@line 265 "../../../src/go/sauvegarde.c"
 if ($12) {
  var $14=___errno_location(); //@line 266 "../../../src/go/sauvegarde.c"
  HEAP32[(($14)>>2)]=95; //@line 266 "../../../src/go/sauvegarde.c"
  $1=0; //@line 267 "../../../src/go/sauvegarde.c"
   //@line 267 "../../../src/go/sauvegarde.c"
  var $66=$1; //@line 293 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $66; //@line 293 "../../../src/go/sauvegarde.c"
 }
 var $16=$taille; //@line 273 "../../../src/go/sauvegarde.c"
 var $17=$2; //@line 273 "../../../src/go/sauvegarde.c"
 var $18=_fread($16,4,1,$17); //@line 273 "../../../src/go/sauvegarde.c"
 var $19=($18|0)!=0; //@line 273 "../../../src/go/sauvegarde.c"
  //@line 273 "../../../src/go/sauvegarde.c"
 if (!($19)) {
  $1=0; //@line 274 "../../../src/go/sauvegarde.c"
   //@line 274 "../../../src/go/sauvegarde.c"
  var $66=$1; //@line 293 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $66; //@line 293 "../../../src/go/sauvegarde.c"
 }
 var $22=HEAP32[(($taille)>>2)]; //@line 275 "../../../src/go/sauvegarde.c"
 var $23=_htonl($22); //@line 275 "../../../src/go/sauvegarde.c"
 HEAP32[(($taille)>>2)]=$23; //@line 275 "../../../src/go/sauvegarde.c"
 var $24=HEAP32[(($taille)>>2)]; //@line 277 "../../../src/go/sauvegarde.c"
 var $25=_creer_plateau($24); //@line 277 "../../../src/go/sauvegarde.c"
 $plateau=$25; //@line 277 "../../../src/go/sauvegarde.c"
 var $26=HEAP32[(($taille)>>2)]; //@line 279 "../../../src/go/sauvegarde.c"
 var $27=_plateau_data_size($26); //@line 279 "../../../src/go/sauvegarde.c"
 var $28=(((($27>>>0))/(4))&-1); //@line 279 "../../../src/go/sauvegarde.c"
 $nbElement=$28; //@line 279 "../../../src/go/sauvegarde.c"
 var $29=$nbElement; //@line 280 "../../../src/go/sauvegarde.c"
 var $30=($29<<2); //@line 280 "../../../src/go/sauvegarde.c"
 var $31=_gosh_alloc_size($30); //@line 280 "../../../src/go/sauvegarde.c"
 var $32=$31; //@line 280 "../../../src/go/sauvegarde.c"
 $data=$32; //@line 280 "../../../src/go/sauvegarde.c"
 var $33=$data; //@line 281 "../../../src/go/sauvegarde.c"
 var $34=$33; //@line 281 "../../../src/go/sauvegarde.c"
 var $35=$nbElement; //@line 281 "../../../src/go/sauvegarde.c"
 var $36=$2; //@line 281 "../../../src/go/sauvegarde.c"
 var $37=_fread($34,$35,4,$36); //@line 281 "../../../src/go/sauvegarde.c"
 var $38=($37|0)!=0; //@line 281 "../../../src/go/sauvegarde.c"
  //@line 281 "../../../src/go/sauvegarde.c"
 if (!($38)) {
  var $40=$data; //@line 282 "../../../src/go/sauvegarde.c"
  var $41=$40; //@line 282 "../../../src/go/sauvegarde.c"
  _free($41); //@line 282 "../../../src/go/sauvegarde.c"
  $1=0; //@line 283 "../../../src/go/sauvegarde.c"
   //@line 283 "../../../src/go/sauvegarde.c"
  var $66=$1; //@line 293 "../../../src/go/sauvegarde.c"
  STACKTOP=sp;return $66; //@line 293 "../../../src/go/sauvegarde.c"
 }
 $i=0; //@line 286 "../../../src/go/sauvegarde.c"
  //@line 286 "../../../src/go/sauvegarde.c"
 while(1) {
  var $44=$i; //@line 286 "../../../src/go/sauvegarde.c"
  var $45=$nbElement; //@line 286 "../../../src/go/sauvegarde.c"
  var $46=($44>>>0)<($45>>>0); //@line 286 "../../../src/go/sauvegarde.c"
   //@line 286 "../../../src/go/sauvegarde.c"
  if (!($46)) {
   break;
  }
  var $48=$i; //@line 287 "../../../src/go/sauvegarde.c"
  var $49=$data; //@line 287 "../../../src/go/sauvegarde.c"
  var $50=(($49+($48<<2))|0); //@line 287 "../../../src/go/sauvegarde.c"
  var $51=HEAP32[(($50)>>2)]; //@line 287 "../../../src/go/sauvegarde.c"
  var $52=_htonl($51); //@line 287 "../../../src/go/sauvegarde.c"
  var $53=$i; //@line 287 "../../../src/go/sauvegarde.c"
  var $54=$data; //@line 287 "../../../src/go/sauvegarde.c"
  var $55=(($54+($53<<2))|0); //@line 287 "../../../src/go/sauvegarde.c"
  HEAP32[(($55)>>2)]=$52; //@line 287 "../../../src/go/sauvegarde.c"
   //@line 287 "../../../src/go/sauvegarde.c"
  var $57=$i; //@line 286 "../../../src/go/sauvegarde.c"
  var $58=((($57)+(1))|0); //@line 286 "../../../src/go/sauvegarde.c"
  $i=$58; //@line 286 "../../../src/go/sauvegarde.c"
   //@line 286 "../../../src/go/sauvegarde.c"
 }
 var $60=$plateau; //@line 289 "../../../src/go/sauvegarde.c"
 var $61=$data; //@line 289 "../../../src/go/sauvegarde.c"
 _plateau_load_data($60,$61); //@line 289 "../../../src/go/sauvegarde.c"
 var $62=$data; //@line 291 "../../../src/go/sauvegarde.c"
 var $63=$62; //@line 291 "../../../src/go/sauvegarde.c"
 _free($63); //@line 291 "../../../src/go/sauvegarde.c"
 var $64=$plateau; //@line 292 "../../../src/go/sauvegarde.c"
 $1=$64; //@line 292 "../../../src/go/sauvegarde.c"
  //@line 292 "../../../src/go/sauvegarde.c"
 var $66=$1; //@line 293 "../../../src/go/sauvegarde.c"
 STACKTOP=sp;return $66; //@line 293 "../../../src/go/sauvegarde.c"
}


function _determiner_territoire($plateau,$position){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+24)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $position; $position=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($position)>>2)]=HEAP32[((tempParam)>>2)];
 var $1;
 var $territoire;
 var $territoire_positions;
 var $possibles;
 var $couleur;
 var $couleur_connue;
 var $courante=sp;
 var $c;
 var $a_tester=(sp)+(8);
 var $p;
 $1=$plateau;
 var $2=_creer_ensemble_colore(0); //@line 29 "../../../src/go/territoire.c"
 $territoire=$2; //@line 29 "../../../src/go/territoire.c"
 var $3=$territoire; //@line 30 "../../../src/go/territoire.c"
 var $4=_ensemble_colore_positions($3); //@line 30 "../../../src/go/territoire.c"
 $territoire_positions=$4; //@line 30 "../../../src/go/territoire.c"
 var $5=_creer_ensemble_position(); //@line 32 "../../../src/go/territoire.c"
 $possibles=$5; //@line 32 "../../../src/go/territoire.c"
 $couleur_connue=0; //@line 34 "../../../src/go/territoire.c"
 var $6=$possibles; //@line 36 "../../../src/go/territoire.c"
 _ensemble_position_ajouter($6,$position); //@line 36 "../../../src/go/territoire.c"
  //@line 39 "../../../src/go/territoire.c"
 while(1) {
  var $8=$possibles; //@line 39 "../../../src/go/territoire.c"
  var $9=_ensemble_position_vide($8); //@line 39 "../../../src/go/territoire.c"
  var $10=$9^1; //@line 39 "../../../src/go/territoire.c"
   //@line 39 "../../../src/go/territoire.c"
  if (!($10)) {
   break;
  }
  var $12=$possibles; //@line 40 "../../../src/go/territoire.c"
  _ensemble_position_supprimer_tete($courante,$12); //@line 40 "../../../src/go/territoire.c"
  var $13=$1; //@line 42 "../../../src/go/territoire.c"
  var $14=_plateau_get_at($13,$courante); //@line 42 "../../../src/go/territoire.c"
  $c=$14; //@line 42 "../../../src/go/territoire.c"
  var $15=$c; //@line 43 "../../../src/go/territoire.c"
  var $16=($15|0)==0; //@line 43 "../../../src/go/territoire.c"
   //@line 43 "../../../src/go/territoire.c"
  if ($16) {
   var $18=$territoire; //@line 44 "../../../src/go/territoire.c"
   var $19=_territoire_appartient($18,$courante); //@line 44 "../../../src/go/territoire.c"
    //@line 44 "../../../src/go/territoire.c"
   if (!($19)) {
    var $21=$territoire_positions; //@line 45 "../../../src/go/territoire.c"
    _ensemble_position_ajouter($21,$courante); //@line 45 "../../../src/go/territoire.c"
    var $22=(($a_tester)|0); //@line 52 "../../../src/go/territoire.c"
    _position_gauche($22,$courante); //@line 48 "../../../src/go/territoire.c"
    var $23=(($22+4)|0); //@line 48 "../../../src/go/territoire.c"
    _position_droite($23,$courante); //@line 49 "../../../src/go/territoire.c"
    var $24=(($23+4)|0); //@line 49 "../../../src/go/territoire.c"
    _position_haut($24,$courante); //@line 50 "../../../src/go/territoire.c"
    var $25=(($24+4)|0); //@line 50 "../../../src/go/territoire.c"
    _position_bas($25,$courante); //@line 51 "../../../src/go/territoire.c"
    $p=0; //@line 53 "../../../src/go/territoire.c"
     //@line 53 "../../../src/go/territoire.c"
    while(1) {
     var $27=$p; //@line 53 "../../../src/go/territoire.c"
     var $28=($27|0)<4; //@line 53 "../../../src/go/territoire.c"
      //@line 53 "../../../src/go/territoire.c"
     if (!($28)) {
      break;
     }
     var $30=$p; //@line 54 "../../../src/go/territoire.c"
     var $31=(($a_tester+($30<<2))|0); //@line 54 "../../../src/go/territoire.c"
     var $32=_position_est_valide($31); //@line 54 "../../../src/go/territoire.c"
      //@line 54 "../../../src/go/territoire.c"
     if ($32) {
      var $34=$possibles; //@line 55 "../../../src/go/territoire.c"
      var $35=$p; //@line 55 "../../../src/go/territoire.c"
      var $36=(($a_tester+($35<<2))|0); //@line 55 "../../../src/go/territoire.c"
      _ensemble_position_ajouter($34,$36); //@line 55 "../../../src/go/territoire.c"
       //@line 55 "../../../src/go/territoire.c"
     }
      //@line 56 "../../../src/go/territoire.c"
     var $39=$p; //@line 53 "../../../src/go/territoire.c"
     var $40=((($39)+(1))|0); //@line 53 "../../../src/go/territoire.c"
     $p=$40; //@line 53 "../../../src/go/territoire.c"
      //@line 53 "../../../src/go/territoire.c"
    }
     //@line 57 "../../../src/go/territoire.c"
   }
    //@line 58 "../../../src/go/territoire.c"
  } else {
   var $44=$couleur_connue; //@line 61 "../../../src/go/territoire.c"
   var $45=(($44)&1); //@line 61 "../../../src/go/territoire.c"
    //@line 61 "../../../src/go/territoire.c"
   if ($45) {
    var $49=$couleur; //@line 64 "../../../src/go/territoire.c"
    var $50=$c; //@line 64 "../../../src/go/territoire.c"
    var $51=($49|0)!=($50|0); //@line 64 "../../../src/go/territoire.c"
     //@line 64 "../../../src/go/territoire.c"
    if ($51) {
     $couleur=0; //@line 65 "../../../src/go/territoire.c"
      //@line 65 "../../../src/go/territoire.c"
    }
   } else {
    var $47=$c; //@line 62 "../../../src/go/territoire.c"
    $couleur=$47; //@line 62 "../../../src/go/territoire.c"
    $couleur_connue=1; //@line 63 "../../../src/go/territoire.c"
     //@line 64 "../../../src/go/territoire.c"
   }
  }
   //@line 67 "../../../src/go/territoire.c"
 }
 var $57=$territoire; //@line 69 "../../../src/go/territoire.c"
 var $58=$couleur; //@line 69 "../../../src/go/territoire.c"
 _ensemble_colore_set_couleur($57,$58); //@line 69 "../../../src/go/territoire.c"
 var $59=$possibles; //@line 70 "../../../src/go/territoire.c"
 _detruire_ensemble_position($59); //@line 70 "../../../src/go/territoire.c"
 var $60=$territoire; //@line 71 "../../../src/go/territoire.c"
 STACKTOP=sp;return $60; //@line 71 "../../../src/go/territoire.c"
}


function _territoire_appartient($territoire,$position){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var tempParam = $position; $position=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);HEAP32[(($position)>>2)]=HEAP32[((tempParam)>>2)];
 var $1;
 $1=$territoire;
 var $2=$1; //@line 102 "../../../src/go/territoire.c"
 var $3=_ensemble_colore_positions($2); //@line 102 "../../../src/go/territoire.c"
 var $4=(($3+16)|0); //@line 102 "../../../src/go/territoire.c"
 var $5=HEAP32[(($4)>>2)]; //@line 102 "../../../src/go/territoire.c"
 var $6=$1; //@line 102 "../../../src/go/territoire.c"
 var $7=_ensemble_colore_positions($6); //@line 102 "../../../src/go/territoire.c"
 var $8=FUNCTION_TABLE[$5]($7,$position); //@line 102 "../../../src/go/territoire.c"
 STACKTOP=sp;return $8; //@line 102 "../../../src/go/territoire.c"
}


function _ensemble_chaine_createIterateur($agg_result){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $it=sp;
 var $1=$it; //@line 39 "../../../src/gosh_ensemble.c"
 HEAP32[(($1)>>2)]=0; //@line 39 "../../../src/gosh_ensemble.c"
 var $2=$agg_result; //@line 40 "../../../src/gosh_ensemble.c"
 var $3=$it; //@line 40 "../../../src/gosh_ensemble.c"
 assert(4 % 1 === 0);HEAP32[(($2)>>2)]=HEAP32[(($3)>>2)]; //@line 40 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return; //@line 40 "../../../src/gosh_ensemble.c"
}


function _ensemble_chaine_next($it,$ptrContainer,$element){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $ptrNode;
 var $ptrElement;
 $1=$it;
 $2=$ptrContainer;
 $3=$element;
 var $4=$1; //@line 47 "../../../src/gosh_ensemble.c"
 var $5=(($4)|0); //@line 47 "../../../src/gosh_ensemble.c"
 var $6=HEAP32[(($5)>>2)]; //@line 47 "../../../src/gosh_ensemble.c"
 var $7=($6|0)!=0; //@line 47 "../../../src/gosh_ensemble.c"
  //@line 47 "../../../src/gosh_ensemble.c"
 if ($7) {
  var $15=$1; //@line 50 "../../../src/gosh_ensemble.c"
  var $16=(($15)|0); //@line 50 "../../../src/gosh_ensemble.c"
  var $17=HEAP32[(($16)>>2)]; //@line 50 "../../../src/gosh_ensemble.c"
  var $18=$17; //@line 50 "../../../src/gosh_ensemble.c"
  var $19=(($18+4)|0); //@line 50 "../../../src/gosh_ensemble.c"
  var $20=HEAP32[(($19)>>2)]; //@line 50 "../../../src/gosh_ensemble.c"
  $ptrNode=$20; //@line 50 "../../../src/gosh_ensemble.c"
 } else {
  var $9=$2; //@line 48 "../../../src/gosh_ensemble.c"
  var $10=(($9+32)|0); //@line 48 "../../../src/gosh_ensemble.c"
  var $11=HEAP32[(($10)>>2)]; //@line 48 "../../../src/gosh_ensemble.c"
  var $12=(($11)|0); //@line 48 "../../../src/gosh_ensemble.c"
  var $13=HEAP32[(($12)>>2)]; //@line 48 "../../../src/gosh_ensemble.c"
  $ptrNode=$13; //@line 48 "../../../src/gosh_ensemble.c"
   //@line 48 "../../../src/gosh_ensemble.c"
 }
 $ptrElement=0; //@line 52 "../../../src/gosh_ensemble.c"
 var $22=$ptrNode; //@line 54 "../../../src/gosh_ensemble.c"
 var $23=$22; //@line 54 "../../../src/gosh_ensemble.c"
 var $24=$1; //@line 54 "../../../src/gosh_ensemble.c"
 var $25=(($24)|0); //@line 54 "../../../src/gosh_ensemble.c"
 HEAP32[(($25)>>2)]=$23; //@line 54 "../../../src/gosh_ensemble.c"
 var $26=$ptrNode; //@line 55 "../../../src/gosh_ensemble.c"
 var $27=($26|0)!=0; //@line 55 "../../../src/gosh_ensemble.c"
  //@line 55 "../../../src/gosh_ensemble.c"
 if ($27) {
  var $29=$ptrNode; //@line 56 "../../../src/gosh_ensemble.c"
  var $30=(($29)|0); //@line 56 "../../../src/gosh_ensemble.c"
  $ptrElement=$30; //@line 56 "../../../src/gosh_ensemble.c"
   //@line 56 "../../../src/gosh_ensemble.c"
 }
 var $32=$3; //@line 58 "../../../src/gosh_ensemble.c"
 var $33=($32|0)!=0; //@line 58 "../../../src/gosh_ensemble.c"
  //@line 58 "../../../src/gosh_ensemble.c"
 if (!($33)) {
  var $42=$ptrElement; //@line 60 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $42; //@line 60 "../../../src/gosh_ensemble.c"
 }
 var $35=$ptrElement; //@line 58 "../../../src/gosh_ensemble.c"
 var $36=($35|0)!=0; //@line 58 "../../../src/gosh_ensemble.c"
  //@line 58 "../../../src/gosh_ensemble.c"
 if (!($36)) {
  var $42=$ptrElement; //@line 60 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $42; //@line 60 "../../../src/gosh_ensemble.c"
 }
 var $38=$ptrElement; //@line 59 "../../../src/gosh_ensemble.c"
 var $39=HEAP32[(($38)>>2)]; //@line 59 "../../../src/gosh_ensemble.c"
 var $40=$3; //@line 59 "../../../src/gosh_ensemble.c"
 HEAP32[(($40)>>2)]=$39; //@line 59 "../../../src/gosh_ensemble.c"
  //@line 59 "../../../src/gosh_ensemble.c"
 var $42=$ptrElement; //@line 60 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $42; //@line 60 "../../../src/gosh_ensemble.c"
}


function _creer_ensemble_chaine(){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $ptrContainer;
 var $1=_gosh_alloc_size(36); //@line 65 "../../../src/gosh_ensemble.c"
 var $2=$1; //@line 65 "../../../src/gosh_ensemble.c"
 $ptrContainer=$2; //@line 65 "../../../src/gosh_ensemble.c"
 var $3=_gosh_alloc_size(4); //@line 66 "../../../src/gosh_ensemble.c"
 var $4=$3; //@line 66 "../../../src/gosh_ensemble.c"
 var $5=$ptrContainer; //@line 66 "../../../src/gosh_ensemble.c"
 var $6=(($5+32)|0); //@line 66 "../../../src/gosh_ensemble.c"
 HEAP32[(($6)>>2)]=$4; //@line 66 "../../../src/gosh_ensemble.c"
 var $7=$ptrContainer; //@line 67 "../../../src/gosh_ensemble.c"
 var $8=(($7+32)|0); //@line 67 "../../../src/gosh_ensemble.c"
 var $9=HEAP32[(($8)>>2)]; //@line 67 "../../../src/gosh_ensemble.c"
 var $10=(($9)|0); //@line 67 "../../../src/gosh_ensemble.c"
 HEAP32[(($10)>>2)]=0; //@line 67 "../../../src/gosh_ensemble.c"
 var $11=$ptrContainer; //@line 69 "../../../src/gosh_ensemble.c"
 var $12=(($11)|0); //@line 69 "../../../src/gosh_ensemble.c"
 var $13=$12; //@line 69 "../../../src/gosh_ensemble.c"
 HEAP32[(($13)>>2)]=102; //@line 69 "../../../src/gosh_ensemble.c"
 var $14=$ptrContainer; //@line 70 "../../../src/gosh_ensemble.c"
 var $15=(($14+4)|0); //@line 70 "../../../src/gosh_ensemble.c"
 HEAP32[(($15)>>2)]=228; //@line 70 "../../../src/gosh_ensemble.c"
 var $16=$ptrContainer; //@line 71 "../../../src/gosh_ensemble.c"
 var $17=(($16+8)|0); //@line 71 "../../../src/gosh_ensemble.c"
 HEAP32[(($17)>>2)]=238; //@line 71 "../../../src/gosh_ensemble.c"
 var $18=$ptrContainer; //@line 72 "../../../src/gosh_ensemble.c"
 var $19=(($18+12)|0); //@line 72 "../../../src/gosh_ensemble.c"
 HEAP32[(($19)>>2)]=58; //@line 72 "../../../src/gosh_ensemble.c"
 var $20=$ptrContainer; //@line 73 "../../../src/gosh_ensemble.c"
 var $21=(($20+16)|0); //@line 73 "../../../src/gosh_ensemble.c"
 HEAP32[(($21)>>2)]=260; //@line 73 "../../../src/gosh_ensemble.c"
 var $22=$ptrContainer; //@line 74 "../../../src/gosh_ensemble.c"
 var $23=(($22+20)|0); //@line 74 "../../../src/gosh_ensemble.c"
 HEAP32[(($23)>>2)]=8; //@line 74 "../../../src/gosh_ensemble.c"
 var $24=$ptrContainer; //@line 75 "../../../src/gosh_ensemble.c"
 var $25=(($24+24)|0); //@line 75 "../../../src/gosh_ensemble.c"
 HEAP32[(($25)>>2)]=320; //@line 75 "../../../src/gosh_ensemble.c"
 var $26=$ptrContainer; //@line 76 "../../../src/gosh_ensemble.c"
 var $27=(($26+28)|0); //@line 76 "../../../src/gosh_ensemble.c"
 HEAP32[(($27)>>2)]=68; //@line 76 "../../../src/gosh_ensemble.c"
 var $28=$ptrContainer; //@line 78 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $28; //@line 78 "../../../src/gosh_ensemble.c"
}


function _ensemble_chaine_vide($ptrContainer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$ptrContainer;
 var $2=$1; //@line 99 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 99 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 99 "../../../src/gosh_ensemble.c"
 var $5=(($4)|0); //@line 99 "../../../src/gosh_ensemble.c"
 var $6=HEAP32[(($5)>>2)]; //@line 99 "../../../src/gosh_ensemble.c"
 var $7=($6|0)==0; //@line 99 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $7; //@line 99 "../../../src/gosh_ensemble.c"
}


function _ensemble_chaine_ajouter($ptrContainer,$element){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $ensemble;
 var $nouveau;
 $1=$ptrContainer;
 $2=$element;
 var $3=$1; //@line 104 "../../../src/gosh_ensemble.c"
 var $4=(($3+32)|0); //@line 104 "../../../src/gosh_ensemble.c"
 var $5=HEAP32[(($4)>>2)]; //@line 104 "../../../src/gosh_ensemble.c"
 $ensemble=$5; //@line 104 "../../../src/gosh_ensemble.c"
 var $6=_gosh_alloc_size(8); //@line 105 "../../../src/gosh_ensemble.c"
 var $7=$6; //@line 105 "../../../src/gosh_ensemble.c"
 $nouveau=$7; //@line 105 "../../../src/gosh_ensemble.c"
 var $8=$2; //@line 106 "../../../src/gosh_ensemble.c"
 var $9=$nouveau; //@line 106 "../../../src/gosh_ensemble.c"
 var $10=(($9)|0); //@line 106 "../../../src/gosh_ensemble.c"
 HEAP32[(($10)>>2)]=$8; //@line 106 "../../../src/gosh_ensemble.c"
 var $11=$ensemble; //@line 107 "../../../src/gosh_ensemble.c"
 var $12=(($11)|0); //@line 107 "../../../src/gosh_ensemble.c"
 var $13=HEAP32[(($12)>>2)]; //@line 107 "../../../src/gosh_ensemble.c"
 var $14=$nouveau; //@line 107 "../../../src/gosh_ensemble.c"
 var $15=(($14+4)|0); //@line 107 "../../../src/gosh_ensemble.c"
 HEAP32[(($15)>>2)]=$13; //@line 107 "../../../src/gosh_ensemble.c"
 var $16=$nouveau; //@line 108 "../../../src/gosh_ensemble.c"
 var $17=$ensemble; //@line 108 "../../../src/gosh_ensemble.c"
 var $18=(($17)|0); //@line 108 "../../../src/gosh_ensemble.c"
 HEAP32[(($18)>>2)]=$16; //@line 108 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return; //@line 109 "../../../src/gosh_ensemble.c"
}


function _ensemble_chaine_appartient($ptrContainer,$element){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3=sp;
 var $noeud;
 $2=$ptrContainer;
 HEAP32[(($3)>>2)]=$element;
 var $4=$2; //@line 123 "../../../src/gosh_ensemble.c"
 var $5=(($4+32)|0); //@line 123 "../../../src/gosh_ensemble.c"
 var $6=HEAP32[(($5)>>2)]; //@line 123 "../../../src/gosh_ensemble.c"
 var $7=(($6)|0); //@line 123 "../../../src/gosh_ensemble.c"
 var $8=HEAP32[(($7)>>2)]; //@line 123 "../../../src/gosh_ensemble.c"
 $noeud=$8; //@line 123 "../../../src/gosh_ensemble.c"
  //@line 124 "../../../src/gosh_ensemble.c"
 while(1) {
  var $10=$noeud; //@line 124 "../../../src/gosh_ensemble.c"
  var $11=($10|0)!=0; //@line 124 "../../../src/gosh_ensemble.c"
   //@line 124 "../../../src/gosh_ensemble.c"
  if (!($11)) {
   label = 6;
   break;
  }
  var $13=$noeud; //@line 125 "../../../src/gosh_ensemble.c"
  var $14=(($13)|0); //@line 125 "../../../src/gosh_ensemble.c"
  var $15=$14; //@line 125 "../../../src/gosh_ensemble.c"
  var $16=$3; //@line 125 "../../../src/gosh_ensemble.c"
  var $17=_memcmp($15,$16,4); //@line 125 "../../../src/gosh_ensemble.c"
  var $18=($17|0)!=0; //@line 125 "../../../src/gosh_ensemble.c"
   //@line 125 "../../../src/gosh_ensemble.c"
  if (!($18)) {
   label = 4;
   break;
  }
  var $21=$noeud; //@line 128 "../../../src/gosh_ensemble.c"
  var $22=(($21+4)|0); //@line 128 "../../../src/gosh_ensemble.c"
  var $23=HEAP32[(($22)>>2)]; //@line 128 "../../../src/gosh_ensemble.c"
  $noeud=$23; //@line 128 "../../../src/gosh_ensemble.c"
   //@line 129 "../../../src/gosh_ensemble.c"
 }
 if (label == 4) {
  $1=1; //@line 126 "../../../src/gosh_ensemble.c"
   //@line 126 "../../../src/gosh_ensemble.c"
  var $26=$1; //@line 131 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $26; //@line 131 "../../../src/gosh_ensemble.c"
 }
 else if (label == 6) {
  $1=0; //@line 130 "../../../src/gosh_ensemble.c"
   //@line 130 "../../../src/gosh_ensemble.c"
  var $26=$1; //@line 131 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $26; //@line 131 "../../../src/gosh_ensemble.c"
 }
}


function _ensemble_chaine_supprimer_tete($ptrContainer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $ensemble;
 var $pos;
 var $vieux;
 $1=$ptrContainer;
 var $2=$1; //@line 113 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 113 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 113 "../../../src/gosh_ensemble.c"
 $ensemble=$4; //@line 113 "../../../src/gosh_ensemble.c"
 var $5=$ensemble; //@line 114 "../../../src/gosh_ensemble.c"
 var $6=(($5)|0); //@line 114 "../../../src/gosh_ensemble.c"
 var $7=HEAP32[(($6)>>2)]; //@line 114 "../../../src/gosh_ensemble.c"
 var $8=(($7)|0); //@line 114 "../../../src/gosh_ensemble.c"
 var $9=HEAP32[(($8)>>2)]; //@line 114 "../../../src/gosh_ensemble.c"
 $pos=$9; //@line 114 "../../../src/gosh_ensemble.c"
 var $10=$ensemble; //@line 115 "../../../src/gosh_ensemble.c"
 var $11=(($10)|0); //@line 115 "../../../src/gosh_ensemble.c"
 var $12=HEAP32[(($11)>>2)]; //@line 115 "../../../src/gosh_ensemble.c"
 $vieux=$12; //@line 115 "../../../src/gosh_ensemble.c"
 var $13=$ensemble; //@line 116 "../../../src/gosh_ensemble.c"
 var $14=(($13)|0); //@line 116 "../../../src/gosh_ensemble.c"
 var $15=HEAP32[(($14)>>2)]; //@line 116 "../../../src/gosh_ensemble.c"
 var $16=(($15+4)|0); //@line 116 "../../../src/gosh_ensemble.c"
 var $17=HEAP32[(($16)>>2)]; //@line 116 "../../../src/gosh_ensemble.c"
 var $18=$ensemble; //@line 116 "../../../src/gosh_ensemble.c"
 var $19=(($18)|0); //@line 116 "../../../src/gosh_ensemble.c"
 HEAP32[(($19)>>2)]=$17; //@line 116 "../../../src/gosh_ensemble.c"
 var $20=$vieux; //@line 117 "../../../src/gosh_ensemble.c"
 var $21=$20; //@line 117 "../../../src/gosh_ensemble.c"
 _gosh_free($21); //@line 117 "../../../src/gosh_ensemble.c"
 var $22=$pos; //@line 118 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $22; //@line 118 "../../../src/gosh_ensemble.c"
}


function _ensemble_chaine_nombre_elements($ptrContainer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $noeud;
 var $nb;
 $1=$ptrContainer;
 var $2=$1; //@line 135 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 135 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 135 "../../../src/gosh_ensemble.c"
 var $5=(($4)|0); //@line 135 "../../../src/gosh_ensemble.c"
 var $6=HEAP32[(($5)>>2)]; //@line 135 "../../../src/gosh_ensemble.c"
 $noeud=$6; //@line 135 "../../../src/gosh_ensemble.c"
 $nb=0; //@line 136 "../../../src/gosh_ensemble.c"
  //@line 137 "../../../src/gosh_ensemble.c"
 while(1) {
  var $8=$noeud; //@line 137 "../../../src/gosh_ensemble.c"
  var $9=($8|0)!=0; //@line 137 "../../../src/gosh_ensemble.c"
   //@line 137 "../../../src/gosh_ensemble.c"
  if (!($9)) {
   break;
  }
  var $11=$nb; //@line 138 "../../../src/gosh_ensemble.c"
  var $12=((($11)+(1))|0); //@line 138 "../../../src/gosh_ensemble.c"
  $nb=$12; //@line 138 "../../../src/gosh_ensemble.c"
  var $13=$noeud; //@line 139 "../../../src/gosh_ensemble.c"
  var $14=(($13+4)|0); //@line 139 "../../../src/gosh_ensemble.c"
  var $15=HEAP32[(($14)>>2)]; //@line 139 "../../../src/gosh_ensemble.c"
  $noeud=$15; //@line 139 "../../../src/gosh_ensemble.c"
   //@line 140 "../../../src/gosh_ensemble.c"
 }
 var $17=$nb; //@line 141 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $17; //@line 141 "../../../src/gosh_ensemble.c"
}


function _ensemble_chaine_get($ptrContainer,$n){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $noeud;
 var $nb;
 $1=$ptrContainer;
 $2=$n;
 var $3=$1; //@line 146 "../../../src/gosh_ensemble.c"
 var $4=(($3+32)|0); //@line 146 "../../../src/gosh_ensemble.c"
 var $5=HEAP32[(($4)>>2)]; //@line 146 "../../../src/gosh_ensemble.c"
 var $6=(($5)|0); //@line 146 "../../../src/gosh_ensemble.c"
 var $7=HEAP32[(($6)>>2)]; //@line 146 "../../../src/gosh_ensemble.c"
 $noeud=$7; //@line 146 "../../../src/gosh_ensemble.c"
 $nb=0; //@line 147 "../../../src/gosh_ensemble.c"
  //@line 148 "../../../src/gosh_ensemble.c"
 while(1) {
  var $9=$noeud; //@line 148 "../../../src/gosh_ensemble.c"
  var $10=($9|0)!=0; //@line 148 "../../../src/gosh_ensemble.c"
   //@line 148 "../../../src/gosh_ensemble.c"
  if ($10) {
   var $12=$nb; //@line 148 "../../../src/gosh_ensemble.c"
   var $13=$2; //@line 148 "../../../src/gosh_ensemble.c"
   var $14=($12|0)<($13|0); //@line 148 "../../../src/gosh_ensemble.c"
   var $16=$14;
  } else {
   var $16=0;
  }
  var $16;
  if (!($16)) {
   break;
  }
  var $18=$nb; //@line 149 "../../../src/gosh_ensemble.c"
  var $19=((($18)+(1))|0); //@line 149 "../../../src/gosh_ensemble.c"
  $nb=$19; //@line 149 "../../../src/gosh_ensemble.c"
  var $20=$noeud; //@line 150 "../../../src/gosh_ensemble.c"
  var $21=(($20+4)|0); //@line 150 "../../../src/gosh_ensemble.c"
  var $22=HEAP32[(($21)>>2)]; //@line 150 "../../../src/gosh_ensemble.c"
  $noeud=$22; //@line 150 "../../../src/gosh_ensemble.c"
   //@line 151 "../../../src/gosh_ensemble.c"
 }
 var $24=$noeud; //@line 152 "../../../src/gosh_ensemble.c"
 var $25=($24|0)!=0; //@line 152 "../../../src/gosh_ensemble.c"
  //@line 152 "../../../src/gosh_ensemble.c"
 if ($25) {
  var $29=1;
  var $29;
  var $30=($29&1); //@line 152 "../../../src/gosh_ensemble.c"
  var $31=$noeud; //@line 153 "../../../src/gosh_ensemble.c"
  var $32=(($31)|0); //@line 153 "../../../src/gosh_ensemble.c"
  var $33=HEAP32[(($32)>>2)]; //@line 153 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $33; //@line 153 "../../../src/gosh_ensemble.c"
 }
 ___assert_fail(976,1224,152,1448); //@line 152 "../../../src/gosh_ensemble.c"
 throw "Reached an unreachable!"; //@line 152 "../../../src/gosh_ensemble.c"
  //@line 152 "../../../src/gosh_ensemble.c"
 var $29;
 var $30=($29&1); //@line 152 "../../../src/gosh_ensemble.c"
 var $31=$noeud; //@line 153 "../../../src/gosh_ensemble.c"
 var $32=(($31)|0); //@line 153 "../../../src/gosh_ensemble.c"
 var $33=HEAP32[(($32)>>2)]; //@line 153 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $33; //@line 153 "../../../src/gosh_ensemble.c"
}


function _detruire_ensemble_chaine($ptrContainer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $ensemble;
 var $noeud;
 var $suivant;
 $1=$ptrContainer;
 var $2=$1; //@line 83 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 83 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 83 "../../../src/gosh_ensemble.c"
 $ensemble=$4; //@line 83 "../../../src/gosh_ensemble.c"
 var $5=$ensemble; //@line 84 "../../../src/gosh_ensemble.c"
 var $6=(($5)|0); //@line 84 "../../../src/gosh_ensemble.c"
 var $7=HEAP32[(($6)>>2)]; //@line 84 "../../../src/gosh_ensemble.c"
 $noeud=$7; //@line 84 "../../../src/gosh_ensemble.c"
  //@line 85 "../../../src/gosh_ensemble.c"
 while(1) {
  var $9=$noeud; //@line 85 "../../../src/gosh_ensemble.c"
  var $10=($9|0)!=0; //@line 85 "../../../src/gosh_ensemble.c"
   //@line 85 "../../../src/gosh_ensemble.c"
  if (!($10)) {
   break;
  }
  var $12=$noeud; //@line 86 "../../../src/gosh_ensemble.c"
  var $13=(($12+4)|0); //@line 86 "../../../src/gosh_ensemble.c"
  var $14=HEAP32[(($13)>>2)]; //@line 86 "../../../src/gosh_ensemble.c"
  $suivant=$14; //@line 86 "../../../src/gosh_ensemble.c"
  var $15=$noeud; //@line 88 "../../../src/gosh_ensemble.c"
  var $16=(($15)|0); //@line 88 "../../../src/gosh_ensemble.c"
  var $17=HEAP32[(($16)>>2)]; //@line 88 "../../../src/gosh_ensemble.c"
  _detruire_ensemble_colore($17); //@line 88 "../../../src/gosh_ensemble.c"
  var $18=$noeud; //@line 90 "../../../src/gosh_ensemble.c"
  var $19=$18; //@line 90 "../../../src/gosh_ensemble.c"
  _gosh_free($19); //@line 90 "../../../src/gosh_ensemble.c"
  var $20=$suivant; //@line 91 "../../../src/gosh_ensemble.c"
  $noeud=$20; //@line 91 "../../../src/gosh_ensemble.c"
   //@line 92 "../../../src/gosh_ensemble.c"
 }
 var $22=$ensemble; //@line 93 "../../../src/gosh_ensemble.c"
 var $23=$22; //@line 93 "../../../src/gosh_ensemble.c"
 _gosh_free($23); //@line 93 "../../../src/gosh_ensemble.c"
 var $24=$1; //@line 94 "../../../src/gosh_ensemble.c"
 var $25=$24; //@line 94 "../../../src/gosh_ensemble.c"
 _gosh_free($25); //@line 94 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return; //@line 95 "../../../src/gosh_ensemble.c"
}


function _ensemble_plateau_createIterateur($agg_result){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $it=sp;
 var $1=$it; //@line 39 "../../../src/gosh_ensemble.c"
 HEAP32[(($1)>>2)]=0; //@line 39 "../../../src/gosh_ensemble.c"
 var $2=$agg_result; //@line 40 "../../../src/gosh_ensemble.c"
 var $3=$it; //@line 40 "../../../src/gosh_ensemble.c"
 assert(4 % 1 === 0);HEAP32[(($2)>>2)]=HEAP32[(($3)>>2)]; //@line 40 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return; //@line 40 "../../../src/gosh_ensemble.c"
}


function _ensemble_plateau_next($it,$ptrContainer,$element){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $ptrNode;
 var $ptrElement;
 $1=$it;
 $2=$ptrContainer;
 $3=$element;
 var $4=$1; //@line 47 "../../../src/gosh_ensemble.c"
 var $5=(($4)|0); //@line 47 "../../../src/gosh_ensemble.c"
 var $6=HEAP32[(($5)>>2)]; //@line 47 "../../../src/gosh_ensemble.c"
 var $7=($6|0)!=0; //@line 47 "../../../src/gosh_ensemble.c"
  //@line 47 "../../../src/gosh_ensemble.c"
 if ($7) {
  var $15=$1; //@line 50 "../../../src/gosh_ensemble.c"
  var $16=(($15)|0); //@line 50 "../../../src/gosh_ensemble.c"
  var $17=HEAP32[(($16)>>2)]; //@line 50 "../../../src/gosh_ensemble.c"
  var $18=$17; //@line 50 "../../../src/gosh_ensemble.c"
  var $19=(($18+4)|0); //@line 50 "../../../src/gosh_ensemble.c"
  var $20=HEAP32[(($19)>>2)]; //@line 50 "../../../src/gosh_ensemble.c"
  $ptrNode=$20; //@line 50 "../../../src/gosh_ensemble.c"
 } else {
  var $9=$2; //@line 48 "../../../src/gosh_ensemble.c"
  var $10=(($9+32)|0); //@line 48 "../../../src/gosh_ensemble.c"
  var $11=HEAP32[(($10)>>2)]; //@line 48 "../../../src/gosh_ensemble.c"
  var $12=(($11)|0); //@line 48 "../../../src/gosh_ensemble.c"
  var $13=HEAP32[(($12)>>2)]; //@line 48 "../../../src/gosh_ensemble.c"
  $ptrNode=$13; //@line 48 "../../../src/gosh_ensemble.c"
   //@line 48 "../../../src/gosh_ensemble.c"
 }
 $ptrElement=0; //@line 52 "../../../src/gosh_ensemble.c"
 var $22=$ptrNode; //@line 54 "../../../src/gosh_ensemble.c"
 var $23=$22; //@line 54 "../../../src/gosh_ensemble.c"
 var $24=$1; //@line 54 "../../../src/gosh_ensemble.c"
 var $25=(($24)|0); //@line 54 "../../../src/gosh_ensemble.c"
 HEAP32[(($25)>>2)]=$23; //@line 54 "../../../src/gosh_ensemble.c"
 var $26=$ptrNode; //@line 55 "../../../src/gosh_ensemble.c"
 var $27=($26|0)!=0; //@line 55 "../../../src/gosh_ensemble.c"
  //@line 55 "../../../src/gosh_ensemble.c"
 if ($27) {
  var $29=$ptrNode; //@line 56 "../../../src/gosh_ensemble.c"
  var $30=(($29)|0); //@line 56 "../../../src/gosh_ensemble.c"
  $ptrElement=$30; //@line 56 "../../../src/gosh_ensemble.c"
   //@line 56 "../../../src/gosh_ensemble.c"
 }
 var $32=$3; //@line 58 "../../../src/gosh_ensemble.c"
 var $33=($32|0)!=0; //@line 58 "../../../src/gosh_ensemble.c"
  //@line 58 "../../../src/gosh_ensemble.c"
 if (!($33)) {
  var $42=$ptrElement; //@line 60 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $42; //@line 60 "../../../src/gosh_ensemble.c"
 }
 var $35=$ptrElement; //@line 58 "../../../src/gosh_ensemble.c"
 var $36=($35|0)!=0; //@line 58 "../../../src/gosh_ensemble.c"
  //@line 58 "../../../src/gosh_ensemble.c"
 if (!($36)) {
  var $42=$ptrElement; //@line 60 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $42; //@line 60 "../../../src/gosh_ensemble.c"
 }
 var $38=$ptrElement; //@line 59 "../../../src/gosh_ensemble.c"
 var $39=HEAP32[(($38)>>2)]; //@line 59 "../../../src/gosh_ensemble.c"
 var $40=$3; //@line 59 "../../../src/gosh_ensemble.c"
 HEAP32[(($40)>>2)]=$39; //@line 59 "../../../src/gosh_ensemble.c"
  //@line 59 "../../../src/gosh_ensemble.c"
 var $42=$ptrElement; //@line 60 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $42; //@line 60 "../../../src/gosh_ensemble.c"
}


function _creer_ensemble_plateau(){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $ptrContainer;
 var $1=_gosh_alloc_size(36); //@line 65 "../../../src/gosh_ensemble.c"
 var $2=$1; //@line 65 "../../../src/gosh_ensemble.c"
 $ptrContainer=$2; //@line 65 "../../../src/gosh_ensemble.c"
 var $3=_gosh_alloc_size(4); //@line 66 "../../../src/gosh_ensemble.c"
 var $4=$3; //@line 66 "../../../src/gosh_ensemble.c"
 var $5=$ptrContainer; //@line 66 "../../../src/gosh_ensemble.c"
 var $6=(($5+32)|0); //@line 66 "../../../src/gosh_ensemble.c"
 HEAP32[(($6)>>2)]=$4; //@line 66 "../../../src/gosh_ensemble.c"
 var $7=$ptrContainer; //@line 67 "../../../src/gosh_ensemble.c"
 var $8=(($7+32)|0); //@line 67 "../../../src/gosh_ensemble.c"
 var $9=HEAP32[(($8)>>2)]; //@line 67 "../../../src/gosh_ensemble.c"
 var $10=(($9)|0); //@line 67 "../../../src/gosh_ensemble.c"
 HEAP32[(($10)>>2)]=0; //@line 67 "../../../src/gosh_ensemble.c"
 var $11=$ptrContainer; //@line 69 "../../../src/gosh_ensemble.c"
 var $12=(($11)|0); //@line 69 "../../../src/gosh_ensemble.c"
 var $13=$12; //@line 69 "../../../src/gosh_ensemble.c"
 HEAP32[(($13)>>2)]=242; //@line 69 "../../../src/gosh_ensemble.c"
 var $14=$ptrContainer; //@line 70 "../../../src/gosh_ensemble.c"
 var $15=(($14+4)|0); //@line 70 "../../../src/gosh_ensemble.c"
 HEAP32[(($15)>>2)]=30; //@line 70 "../../../src/gosh_ensemble.c"
 var $16=$ptrContainer; //@line 71 "../../../src/gosh_ensemble.c"
 var $17=(($16+8)|0); //@line 71 "../../../src/gosh_ensemble.c"
 HEAP32[(($17)>>2)]=264; //@line 71 "../../../src/gosh_ensemble.c"
 var $18=$ptrContainer; //@line 72 "../../../src/gosh_ensemble.c"
 var $19=(($18+12)|0); //@line 72 "../../../src/gosh_ensemble.c"
 HEAP32[(($19)>>2)]=152; //@line 72 "../../../src/gosh_ensemble.c"
 var $20=$ptrContainer; //@line 73 "../../../src/gosh_ensemble.c"
 var $21=(($20+16)|0); //@line 73 "../../../src/gosh_ensemble.c"
 HEAP32[(($21)>>2)]=114; //@line 73 "../../../src/gosh_ensemble.c"
 var $22=$ptrContainer; //@line 74 "../../../src/gosh_ensemble.c"
 var $23=(($22+20)|0); //@line 74 "../../../src/gosh_ensemble.c"
 HEAP32[(($23)>>2)]=172; //@line 74 "../../../src/gosh_ensemble.c"
 var $24=$ptrContainer; //@line 75 "../../../src/gosh_ensemble.c"
 var $25=(($24+24)|0); //@line 75 "../../../src/gosh_ensemble.c"
 HEAP32[(($25)>>2)]=20; //@line 75 "../../../src/gosh_ensemble.c"
 var $26=$ptrContainer; //@line 76 "../../../src/gosh_ensemble.c"
 var $27=(($26+28)|0); //@line 76 "../../../src/gosh_ensemble.c"
 HEAP32[(($27)>>2)]=100; //@line 76 "../../../src/gosh_ensemble.c"
 var $28=$ptrContainer; //@line 78 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $28; //@line 78 "../../../src/gosh_ensemble.c"
}


function _ensemble_plateau_vide($ptrContainer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$ptrContainer;
 var $2=$1; //@line 99 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 99 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 99 "../../../src/gosh_ensemble.c"
 var $5=(($4)|0); //@line 99 "../../../src/gosh_ensemble.c"
 var $6=HEAP32[(($5)>>2)]; //@line 99 "../../../src/gosh_ensemble.c"
 var $7=($6|0)==0; //@line 99 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $7; //@line 99 "../../../src/gosh_ensemble.c"
}


function _ensemble_plateau_ajouter($ptrContainer,$element){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $ensemble;
 var $nouveau;
 $1=$ptrContainer;
 $2=$element;
 var $3=$1; //@line 104 "../../../src/gosh_ensemble.c"
 var $4=(($3+32)|0); //@line 104 "../../../src/gosh_ensemble.c"
 var $5=HEAP32[(($4)>>2)]; //@line 104 "../../../src/gosh_ensemble.c"
 $ensemble=$5; //@line 104 "../../../src/gosh_ensemble.c"
 var $6=_gosh_alloc_size(8); //@line 105 "../../../src/gosh_ensemble.c"
 var $7=$6; //@line 105 "../../../src/gosh_ensemble.c"
 $nouveau=$7; //@line 105 "../../../src/gosh_ensemble.c"
 var $8=$2; //@line 106 "../../../src/gosh_ensemble.c"
 var $9=$nouveau; //@line 106 "../../../src/gosh_ensemble.c"
 var $10=(($9)|0); //@line 106 "../../../src/gosh_ensemble.c"
 HEAP32[(($10)>>2)]=$8; //@line 106 "../../../src/gosh_ensemble.c"
 var $11=$ensemble; //@line 107 "../../../src/gosh_ensemble.c"
 var $12=(($11)|0); //@line 107 "../../../src/gosh_ensemble.c"
 var $13=HEAP32[(($12)>>2)]; //@line 107 "../../../src/gosh_ensemble.c"
 var $14=$nouveau; //@line 107 "../../../src/gosh_ensemble.c"
 var $15=(($14+4)|0); //@line 107 "../../../src/gosh_ensemble.c"
 HEAP32[(($15)>>2)]=$13; //@line 107 "../../../src/gosh_ensemble.c"
 var $16=$nouveau; //@line 108 "../../../src/gosh_ensemble.c"
 var $17=$ensemble; //@line 108 "../../../src/gosh_ensemble.c"
 var $18=(($17)|0); //@line 108 "../../../src/gosh_ensemble.c"
 HEAP32[(($18)>>2)]=$16; //@line 108 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return; //@line 109 "../../../src/gosh_ensemble.c"
}


function _ensemble_plateau_appartient($ptrContainer,$element){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3=sp;
 var $noeud;
 $2=$ptrContainer;
 HEAP32[(($3)>>2)]=$element;
 var $4=$2; //@line 123 "../../../src/gosh_ensemble.c"
 var $5=(($4+32)|0); //@line 123 "../../../src/gosh_ensemble.c"
 var $6=HEAP32[(($5)>>2)]; //@line 123 "../../../src/gosh_ensemble.c"
 var $7=(($6)|0); //@line 123 "../../../src/gosh_ensemble.c"
 var $8=HEAP32[(($7)>>2)]; //@line 123 "../../../src/gosh_ensemble.c"
 $noeud=$8; //@line 123 "../../../src/gosh_ensemble.c"
  //@line 124 "../../../src/gosh_ensemble.c"
 while(1) {
  var $10=$noeud; //@line 124 "../../../src/gosh_ensemble.c"
  var $11=($10|0)!=0; //@line 124 "../../../src/gosh_ensemble.c"
   //@line 124 "../../../src/gosh_ensemble.c"
  if (!($11)) {
   label = 6;
   break;
  }
  var $13=$noeud; //@line 125 "../../../src/gosh_ensemble.c"
  var $14=(($13)|0); //@line 125 "../../../src/gosh_ensemble.c"
  var $15=$14; //@line 125 "../../../src/gosh_ensemble.c"
  var $16=$3; //@line 125 "../../../src/gosh_ensemble.c"
  var $17=_memcmp($15,$16,4); //@line 125 "../../../src/gosh_ensemble.c"
  var $18=($17|0)!=0; //@line 125 "../../../src/gosh_ensemble.c"
   //@line 125 "../../../src/gosh_ensemble.c"
  if (!($18)) {
   label = 4;
   break;
  }
  var $21=$noeud; //@line 128 "../../../src/gosh_ensemble.c"
  var $22=(($21+4)|0); //@line 128 "../../../src/gosh_ensemble.c"
  var $23=HEAP32[(($22)>>2)]; //@line 128 "../../../src/gosh_ensemble.c"
  $noeud=$23; //@line 128 "../../../src/gosh_ensemble.c"
   //@line 129 "../../../src/gosh_ensemble.c"
 }
 if (label == 4) {
  $1=1; //@line 126 "../../../src/gosh_ensemble.c"
   //@line 126 "../../../src/gosh_ensemble.c"
  var $26=$1; //@line 131 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $26; //@line 131 "../../../src/gosh_ensemble.c"
 }
 else if (label == 6) {
  $1=0; //@line 130 "../../../src/gosh_ensemble.c"
   //@line 130 "../../../src/gosh_ensemble.c"
  var $26=$1; //@line 131 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $26; //@line 131 "../../../src/gosh_ensemble.c"
 }
}


function _ensemble_plateau_supprimer_tete($ptrContainer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $ensemble;
 var $pos;
 var $vieux;
 $1=$ptrContainer;
 var $2=$1; //@line 113 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 113 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 113 "../../../src/gosh_ensemble.c"
 $ensemble=$4; //@line 113 "../../../src/gosh_ensemble.c"
 var $5=$ensemble; //@line 114 "../../../src/gosh_ensemble.c"
 var $6=(($5)|0); //@line 114 "../../../src/gosh_ensemble.c"
 var $7=HEAP32[(($6)>>2)]; //@line 114 "../../../src/gosh_ensemble.c"
 var $8=(($7)|0); //@line 114 "../../../src/gosh_ensemble.c"
 var $9=HEAP32[(($8)>>2)]; //@line 114 "../../../src/gosh_ensemble.c"
 $pos=$9; //@line 114 "../../../src/gosh_ensemble.c"
 var $10=$ensemble; //@line 115 "../../../src/gosh_ensemble.c"
 var $11=(($10)|0); //@line 115 "../../../src/gosh_ensemble.c"
 var $12=HEAP32[(($11)>>2)]; //@line 115 "../../../src/gosh_ensemble.c"
 $vieux=$12; //@line 115 "../../../src/gosh_ensemble.c"
 var $13=$ensemble; //@line 116 "../../../src/gosh_ensemble.c"
 var $14=(($13)|0); //@line 116 "../../../src/gosh_ensemble.c"
 var $15=HEAP32[(($14)>>2)]; //@line 116 "../../../src/gosh_ensemble.c"
 var $16=(($15+4)|0); //@line 116 "../../../src/gosh_ensemble.c"
 var $17=HEAP32[(($16)>>2)]; //@line 116 "../../../src/gosh_ensemble.c"
 var $18=$ensemble; //@line 116 "../../../src/gosh_ensemble.c"
 var $19=(($18)|0); //@line 116 "../../../src/gosh_ensemble.c"
 HEAP32[(($19)>>2)]=$17; //@line 116 "../../../src/gosh_ensemble.c"
 var $20=$vieux; //@line 117 "../../../src/gosh_ensemble.c"
 var $21=$20; //@line 117 "../../../src/gosh_ensemble.c"
 _gosh_free($21); //@line 117 "../../../src/gosh_ensemble.c"
 var $22=$pos; //@line 118 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $22; //@line 118 "../../../src/gosh_ensemble.c"
}


function _ensemble_plateau_nombre_elements($ptrContainer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $noeud;
 var $nb;
 $1=$ptrContainer;
 var $2=$1; //@line 135 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 135 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 135 "../../../src/gosh_ensemble.c"
 var $5=(($4)|0); //@line 135 "../../../src/gosh_ensemble.c"
 var $6=HEAP32[(($5)>>2)]; //@line 135 "../../../src/gosh_ensemble.c"
 $noeud=$6; //@line 135 "../../../src/gosh_ensemble.c"
 $nb=0; //@line 136 "../../../src/gosh_ensemble.c"
  //@line 137 "../../../src/gosh_ensemble.c"
 while(1) {
  var $8=$noeud; //@line 137 "../../../src/gosh_ensemble.c"
  var $9=($8|0)!=0; //@line 137 "../../../src/gosh_ensemble.c"
   //@line 137 "../../../src/gosh_ensemble.c"
  if (!($9)) {
   break;
  }
  var $11=$nb; //@line 138 "../../../src/gosh_ensemble.c"
  var $12=((($11)+(1))|0); //@line 138 "../../../src/gosh_ensemble.c"
  $nb=$12; //@line 138 "../../../src/gosh_ensemble.c"
  var $13=$noeud; //@line 139 "../../../src/gosh_ensemble.c"
  var $14=(($13+4)|0); //@line 139 "../../../src/gosh_ensemble.c"
  var $15=HEAP32[(($14)>>2)]; //@line 139 "../../../src/gosh_ensemble.c"
  $noeud=$15; //@line 139 "../../../src/gosh_ensemble.c"
   //@line 140 "../../../src/gosh_ensemble.c"
 }
 var $17=$nb; //@line 141 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $17; //@line 141 "../../../src/gosh_ensemble.c"
}


function _ensemble_plateau_get($ptrContainer,$n){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $noeud;
 var $nb;
 $1=$ptrContainer;
 $2=$n;
 var $3=$1; //@line 146 "../../../src/gosh_ensemble.c"
 var $4=(($3+32)|0); //@line 146 "../../../src/gosh_ensemble.c"
 var $5=HEAP32[(($4)>>2)]; //@line 146 "../../../src/gosh_ensemble.c"
 var $6=(($5)|0); //@line 146 "../../../src/gosh_ensemble.c"
 var $7=HEAP32[(($6)>>2)]; //@line 146 "../../../src/gosh_ensemble.c"
 $noeud=$7; //@line 146 "../../../src/gosh_ensemble.c"
 $nb=0; //@line 147 "../../../src/gosh_ensemble.c"
  //@line 148 "../../../src/gosh_ensemble.c"
 while(1) {
  var $9=$noeud; //@line 148 "../../../src/gosh_ensemble.c"
  var $10=($9|0)!=0; //@line 148 "../../../src/gosh_ensemble.c"
   //@line 148 "../../../src/gosh_ensemble.c"
  if ($10) {
   var $12=$nb; //@line 148 "../../../src/gosh_ensemble.c"
   var $13=$2; //@line 148 "../../../src/gosh_ensemble.c"
   var $14=($12|0)<($13|0); //@line 148 "../../../src/gosh_ensemble.c"
   var $16=$14;
  } else {
   var $16=0;
  }
  var $16;
  if (!($16)) {
   break;
  }
  var $18=$nb; //@line 149 "../../../src/gosh_ensemble.c"
  var $19=((($18)+(1))|0); //@line 149 "../../../src/gosh_ensemble.c"
  $nb=$19; //@line 149 "../../../src/gosh_ensemble.c"
  var $20=$noeud; //@line 150 "../../../src/gosh_ensemble.c"
  var $21=(($20+4)|0); //@line 150 "../../../src/gosh_ensemble.c"
  var $22=HEAP32[(($21)>>2)]; //@line 150 "../../../src/gosh_ensemble.c"
  $noeud=$22; //@line 150 "../../../src/gosh_ensemble.c"
   //@line 151 "../../../src/gosh_ensemble.c"
 }
 var $24=$noeud; //@line 152 "../../../src/gosh_ensemble.c"
 var $25=($24|0)!=0; //@line 152 "../../../src/gosh_ensemble.c"
  //@line 152 "../../../src/gosh_ensemble.c"
 if ($25) {
  var $29=1;
  var $29;
  var $30=($29&1); //@line 152 "../../../src/gosh_ensemble.c"
  var $31=$noeud; //@line 153 "../../../src/gosh_ensemble.c"
  var $32=(($31)|0); //@line 153 "../../../src/gosh_ensemble.c"
  var $33=HEAP32[(($32)>>2)]; //@line 153 "../../../src/gosh_ensemble.c"
  STACKTOP=sp;return $33; //@line 153 "../../../src/gosh_ensemble.c"
 }
 ___assert_fail(968,1192,152,1424); //@line 152 "../../../src/gosh_ensemble.c"
 throw "Reached an unreachable!"; //@line 152 "../../../src/gosh_ensemble.c"
  //@line 152 "../../../src/gosh_ensemble.c"
 var $29;
 var $30=($29&1); //@line 152 "../../../src/gosh_ensemble.c"
 var $31=$noeud; //@line 153 "../../../src/gosh_ensemble.c"
 var $32=(($31)|0); //@line 153 "../../../src/gosh_ensemble.c"
 var $33=HEAP32[(($32)>>2)]; //@line 153 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return $33; //@line 153 "../../../src/gosh_ensemble.c"
}


function _detruire_ensemble_plateau($ptrContainer){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $ensemble;
 var $noeud;
 var $suivant;
 $1=$ptrContainer;
 var $2=$1; //@line 83 "../../../src/gosh_ensemble.c"
 var $3=(($2+32)|0); //@line 83 "../../../src/gosh_ensemble.c"
 var $4=HEAP32[(($3)>>2)]; //@line 83 "../../../src/gosh_ensemble.c"
 $ensemble=$4; //@line 83 "../../../src/gosh_ensemble.c"
 var $5=$ensemble; //@line 84 "../../../src/gosh_ensemble.c"
 var $6=(($5)|0); //@line 84 "../../../src/gosh_ensemble.c"
 var $7=HEAP32[(($6)>>2)]; //@line 84 "../../../src/gosh_ensemble.c"
 $noeud=$7; //@line 84 "../../../src/gosh_ensemble.c"
  //@line 85 "../../../src/gosh_ensemble.c"
 while(1) {
  var $9=$noeud; //@line 85 "../../../src/gosh_ensemble.c"
  var $10=($9|0)!=0; //@line 85 "../../../src/gosh_ensemble.c"
   //@line 85 "../../../src/gosh_ensemble.c"
  if (!($10)) {
   break;
  }
  var $12=$noeud; //@line 86 "../../../src/gosh_ensemble.c"
  var $13=(($12+4)|0); //@line 86 "../../../src/gosh_ensemble.c"
  var $14=HEAP32[(($13)>>2)]; //@line 86 "../../../src/gosh_ensemble.c"
  $suivant=$14; //@line 86 "../../../src/gosh_ensemble.c"
  var $15=$noeud; //@line 88 "../../../src/gosh_ensemble.c"
  var $16=(($15)|0); //@line 88 "../../../src/gosh_ensemble.c"
  var $17=HEAP32[(($16)>>2)]; //@line 88 "../../../src/gosh_ensemble.c"
  _detruire_plateau($17); //@line 88 "../../../src/gosh_ensemble.c"
  var $18=$noeud; //@line 90 "../../../src/gosh_ensemble.c"
  var $19=$18; //@line 90 "../../../src/gosh_ensemble.c"
  _gosh_free($19); //@line 90 "../../../src/gosh_ensemble.c"
  var $20=$suivant; //@line 91 "../../../src/gosh_ensemble.c"
  $noeud=$20; //@line 91 "../../../src/gosh_ensemble.c"
   //@line 92 "../../../src/gosh_ensemble.c"
 }
 var $22=$ensemble; //@line 93 "../../../src/gosh_ensemble.c"
 var $23=$22; //@line 93 "../../../src/gosh_ensemble.c"
 _gosh_free($23); //@line 93 "../../../src/gosh_ensemble.c"
 var $24=$1; //@line 94 "../../../src/gosh_ensemble.c"
 var $25=$24; //@line 94 "../../../src/gosh_ensemble.c"
 _gosh_free($25); //@line 94 "../../../src/gosh_ensemble.c"
 STACKTOP=sp;return; //@line 95 "../../../src/gosh_ensemble.c"
}


function _gosh_alloc_size($size){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $ptr;
 $1=$size;
 var $2=$1; //@line 31 "../../src/gosh_alloc.c"
 var $3=_malloc($2); //@line 31 "../../src/gosh_alloc.c"
 $ptr=$3; //@line 31 "../../src/gosh_alloc.c"
 var $4=$ptr; //@line 32 "../../src/gosh_alloc.c"
 var $5=$1; //@line 32 "../../src/gosh_alloc.c"
 _memset($4, 0, $5)|0; //@line 32 "../../src/gosh_alloc.c"
 var $6=$ptr; //@line 33 "../../src/gosh_alloc.c"
 STACKTOP=sp;return $6; //@line 33 "../../src/gosh_alloc.c"
}


function _gosh_free($ptr){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 $1=$ptr;
 var $2=$1; //@line 38 "../../src/gosh_alloc.c"
 _free($2); //@line 38 "../../src/gosh_alloc.c"
 STACKTOP=sp;return; //@line 39 "../../src/gosh_alloc.c"
}


function _gosh_realloc_size($ptr,$size){
 var label=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 $1=$ptr;
 $2=$size;
 var $3=$1; //@line 43 "../../src/gosh_alloc.c"
 var $4=$2; //@line 43 "../../src/gosh_alloc.c"
 var $5=_realloc($3,$4); //@line 43 "../../src/gosh_alloc.c"
 STACKTOP=sp;return $5; //@line 43 "../../src/gosh_alloc.c"
}


function _jouer_coup_ordi($data,$partie,$couleur){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $1;
 var $2;
 var $3;
 var $taille;
 var $coup=sp;
 var $essais_restants;
 var $x;
 var $y;
 var $4=(sp)+(8);
 $1=$data;
 $2=$partie;
 $3=$couleur;
 var $5=$1; //@line 40 "../../../src/ordinateurs/random/main.c"
 var $6=$3; //@line 41 "../../../src/ordinateurs/random/main.c"
 var $7=$2; //@line 43 "../../../src/ordinateurs/random/main.c"
 var $8=(($7)|0); //@line 43 "../../../src/ordinateurs/random/main.c"
 var $9=HEAP32[(($8)>>2)]; //@line 43 "../../../src/ordinateurs/random/main.c"
 var $10=_plateau_get_taille($9); //@line 43 "../../../src/ordinateurs/random/main.c"
 $taille=$10; //@line 43 "../../../src/ordinateurs/random/main.c"
 $essais_restants=1000; //@line 45 "../../../src/ordinateurs/random/main.c"
  //@line 46 "../../../src/ordinateurs/random/main.c"
 while(1) {
  var $12=_rand(); //@line 47 "../../../src/ordinateurs/random/main.c"
  var $13=$taille; //@line 47 "../../../src/ordinateurs/random/main.c"
  var $14=(((($12>>>0))%(($13>>>0)))&-1); //@line 47 "../../../src/ordinateurs/random/main.c"
  $x=$14; //@line 47 "../../../src/ordinateurs/random/main.c"
  var $15=_rand(); //@line 48 "../../../src/ordinateurs/random/main.c"
  var $16=$taille; //@line 48 "../../../src/ordinateurs/random/main.c"
  var $17=(((($15>>>0))%(($16>>>0)))&-1); //@line 48 "../../../src/ordinateurs/random/main.c"
  $y=$17; //@line 48 "../../../src/ordinateurs/random/main.c"
  var $18=(($coup)|0); //@line 49 "../../../src/ordinateurs/random/main.c"
  var $19=$x; //@line 49 "../../../src/ordinateurs/random/main.c"
  var $20=$y; //@line 49 "../../../src/ordinateurs/random/main.c"
  var $21=$taille; //@line 49 "../../../src/ordinateurs/random/main.c"
  _position($4,$19,$20,$21); //@line 49 "../../../src/ordinateurs/random/main.c"
  var $22=$18; //@line 49 "../../../src/ordinateurs/random/main.c"
  var $23=$4; //@line 49 "../../../src/ordinateurs/random/main.c"
  assert(4 % 1 === 0);HEAP8[($22)]=HEAP8[($23)];HEAP8[((($22)+(1))|0)]=HEAP8[((($23)+(1))|0)];HEAP8[((($22)+(2))|0)]=HEAP8[((($23)+(2))|0)];HEAP8[((($22)+(3))|0)]=HEAP8[((($23)+(3))|0)]; //@line 49 "../../../src/ordinateurs/random/main.c"
  var $24=$essais_restants; //@line 50 "../../../src/ordinateurs/random/main.c"
  var $25=((($24)-(1))|0); //@line 50 "../../../src/ordinateurs/random/main.c"
  $essais_restants=$25; //@line 50 "../../../src/ordinateurs/random/main.c"
   //@line 51 "../../../src/ordinateurs/random/main.c"
  var $27=$2; //@line 51 "../../../src/ordinateurs/random/main.c"
  var $28=(($27)|0); //@line 51 "../../../src/ordinateurs/random/main.c"
  var $29=HEAP32[(($28)>>2)]; //@line 51 "../../../src/ordinateurs/random/main.c"
  var $30=(($coup)|0); //@line 51 "../../../src/ordinateurs/random/main.c"
  var $31=_plateau_get_at($29,$30); //@line 51 "../../../src/ordinateurs/random/main.c"
  var $32=($31|0)!=0; //@line 51 "../../../src/ordinateurs/random/main.c"
   //@line 51 "../../../src/ordinateurs/random/main.c"
  if ($32) {
   label = 5;
  } else {
   var $34=$2; //@line 52 "../../../src/ordinateurs/random/main.c"
   var $35=_partie_jouer_coup($34,$coup); //@line 52 "../../../src/ordinateurs/random/main.c"
    //@line 52 "../../../src/ordinateurs/random/main.c"
   if ($35) {
    var $40=0;
   } else {
    label = 5;
   }
  }
  if (label == 5) {
   label = 0;
   var $37=$essais_restants; //@line 52 "../../../src/ordinateurs/random/main.c"
   var $38=($37|0)>0; //@line 52 "../../../src/ordinateurs/random/main.c"
   var $40=$38;
  }
  var $40;
  if (!($40)) {
   break;
  }
 }
 var $42=$essais_restants; //@line 53 "../../../src/ordinateurs/random/main.c"
 var $43=($42|0)==0; //@line 53 "../../../src/ordinateurs/random/main.c"
  //@line 53 "../../../src/ordinateurs/random/main.c"
 if (!($43)) {
  STACKTOP=sp;return; //@line 57 "../../../src/ordinateurs/random/main.c"
 }
 var $45=(($coup)|0); //@line 54 "../../../src/ordinateurs/random/main.c"
 var $46=$45; //@line 54 "../../../src/ordinateurs/random/main.c"
 assert(4 % 1 === 0);HEAP8[($46)]=HEAP8[(1488)];HEAP8[((($46)+(1))|0)]=HEAP8[(1489)];HEAP8[((($46)+(2))|0)]=HEAP8[(1490)];HEAP8[((($46)+(3))|0)]=HEAP8[(1491)]; //@line 54 "../../../src/ordinateurs/random/main.c"
 var $47=$2; //@line 55 "../../../src/ordinateurs/random/main.c"
 var $48=_partie_jouer_coup($47,$coup); //@line 55 "../../../src/ordinateurs/random/main.c"
  //@line 56 "../../../src/ordinateurs/random/main.c"
 STACKTOP=sp;return; //@line 57 "../../../src/ordinateurs/random/main.c"
}
Module["_jouer_coup_ordi"] = _jouer_coup_ordi;

function _initialiser_ordi(){
 var label=0;
 var tempVarArgs=0;
 var sp=STACKTOP; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $data;
 var $1=_time(0); //@line 61 "../../../src/ordinateurs/random/main.c"
 _srand($1); //@line 61 "../../../src/ordinateurs/random/main.c"
 var $2=_gosh_alloc_size(0); //@line 62 "../../../src/ordinateurs/random/main.c"
 var $3=$2; //@line 62 "../../../src/ordinateurs/random/main.c"
 $data=$3; //@line 62 "../../../src/ordinateurs/random/main.c"
 var $4=_printf(872,(tempVarArgs=STACKTOP,STACKTOP = (STACKTOP + 16)|0,(assert((STACKTOP|0) < (STACK_MAX|0))|0),HEAP32[((tempVarArgs)>>2)]=1152,HEAP32[(((tempVarArgs)+(8))>>2)]=63,tempVarArgs)); STACKTOP=tempVarArgs; //@line 63 "../../../src/ordinateurs/random/main.c"
 var $5=$data; //@line 64 "../../../src/ordinateurs/random/main.c"
 var $6=$5; //@line 64 "../../../src/ordinateurs/random/main.c"
 STACKTOP=sp;return $6; //@line 64 "../../../src/ordinateurs/random/main.c"
}
Module["_initialiser_ordi"] = _initialiser_ordi;

function _malloc($bytes){
 var label=0;

 var $1=($bytes>>>0)<245;
 do {
  if ($1) {
   var $3=($bytes>>>0)<11;
   if ($3) {
    var $8=16;
   } else {
    var $5=((($bytes)+(11))|0);
    var $6=$5&-8;
    var $8=$6;
   }
   var $8;
   var $9=$8>>>3;
   var $10=HEAP32[((1576)>>2)];
   var $11=$10>>>($9>>>0);
   var $12=$11&3;
   var $13=($12|0)==0;
   if (!($13)) {
    var $15=$11&1;
    var $16=$15^1;
    var $17=((($16)+($9))|0);
    var $18=$17<<1;
    var $19=((1616+($18<<2))|0);
    var $20=$19;
    var $_sum111=((($18)+(2))|0);
    var $21=((1616+($_sum111<<2))|0);
    var $22=HEAP32[(($21)>>2)];
    var $23=(($22+8)|0);
    var $24=HEAP32[(($23)>>2)];
    var $25=($20|0)==($24|0);
    do {
     if ($25) {
      var $27=1<<$17;
      var $28=$27^-1;
      var $29=$10&$28;
      HEAP32[((1576)>>2)]=$29;
     } else {
      var $31=$24;
      var $32=HEAP32[((1592)>>2)];
      var $33=($31>>>0)<($32>>>0);
      if ($33) {
       _abort();
       throw "Reached an unreachable!";
      }
      var $35=(($24+12)|0);
      var $36=HEAP32[(($35)>>2)];
      var $37=($36|0)==($22|0);
      if ($37) {
       HEAP32[(($35)>>2)]=$20;
       HEAP32[(($21)>>2)]=$24;
       break;
      } else {
       _abort();
       throw "Reached an unreachable!";
      }
     }
    } while(0);
    var $40=$17<<3;
    var $41=$40|3;
    var $42=(($22+4)|0);
    HEAP32[(($42)>>2)]=$41;
    var $43=$22;
    var $_sum113114=$40|4;
    var $44=(($43+$_sum113114)|0);
    var $45=$44;
    var $46=HEAP32[(($45)>>2)];
    var $47=$46|1;
    HEAP32[(($45)>>2)]=$47;
    var $48=$23;
    var $mem_0=$48;
    var $mem_0;
    return $mem_0;
   }
   var $50=HEAP32[((1584)>>2)];
   var $51=($8>>>0)>($50>>>0);
   if (!($51)) {
    var $nb_0=$8;
    break;
   }
   var $53=($11|0)==0;
   if (!($53)) {
    var $55=$11<<$9;
    var $56=2<<$9;
    var $57=(((-$56))|0);
    var $58=$56|$57;
    var $59=$55&$58;
    var $60=(((-$59))|0);
    var $61=$59&$60;
    var $62=((($61)-(1))|0);
    var $63=$62>>>12;
    var $64=$63&16;
    var $65=$62>>>($64>>>0);
    var $66=$65>>>5;
    var $67=$66&8;
    var $68=$67|$64;
    var $69=$65>>>($67>>>0);
    var $70=$69>>>2;
    var $71=$70&4;
    var $72=$68|$71;
    var $73=$69>>>($71>>>0);
    var $74=$73>>>1;
    var $75=$74&2;
    var $76=$72|$75;
    var $77=$73>>>($75>>>0);
    var $78=$77>>>1;
    var $79=$78&1;
    var $80=$76|$79;
    var $81=$77>>>($79>>>0);
    var $82=((($80)+($81))|0);
    var $83=$82<<1;
    var $84=((1616+($83<<2))|0);
    var $85=$84;
    var $_sum104=((($83)+(2))|0);
    var $86=((1616+($_sum104<<2))|0);
    var $87=HEAP32[(($86)>>2)];
    var $88=(($87+8)|0);
    var $89=HEAP32[(($88)>>2)];
    var $90=($85|0)==($89|0);
    do {
     if ($90) {
      var $92=1<<$82;
      var $93=$92^-1;
      var $94=$10&$93;
      HEAP32[((1576)>>2)]=$94;
     } else {
      var $96=$89;
      var $97=HEAP32[((1592)>>2)];
      var $98=($96>>>0)<($97>>>0);
      if ($98) {
       _abort();
       throw "Reached an unreachable!";
      }
      var $100=(($89+12)|0);
      var $101=HEAP32[(($100)>>2)];
      var $102=($101|0)==($87|0);
      if ($102) {
       HEAP32[(($100)>>2)]=$85;
       HEAP32[(($86)>>2)]=$89;
       break;
      } else {
       _abort();
       throw "Reached an unreachable!";
      }
     }
    } while(0);
    var $105=$82<<3;
    var $106=((($105)-($8))|0);
    var $107=$8|3;
    var $108=(($87+4)|0);
    HEAP32[(($108)>>2)]=$107;
    var $109=$87;
    var $110=(($109+$8)|0);
    var $111=$110;
    var $112=$106|1;
    var $_sum106107=$8|4;
    var $113=(($109+$_sum106107)|0);
    var $114=$113;
    HEAP32[(($114)>>2)]=$112;
    var $115=(($109+$105)|0);
    var $116=$115;
    HEAP32[(($116)>>2)]=$106;
    var $117=HEAP32[((1584)>>2)];
    var $118=($117|0)==0;
    if (!($118)) {
     var $120=HEAP32[((1596)>>2)];
     var $121=$117>>>3;
     var $122=$121<<1;
     var $123=((1616+($122<<2))|0);
     var $124=$123;
     var $125=HEAP32[((1576)>>2)];
     var $126=1<<$121;
     var $127=$125&$126;
     var $128=($127|0)==0;
     do {
      if ($128) {
       var $130=$125|$126;
       HEAP32[((1576)>>2)]=$130;
       var $_sum109_pre=((($122)+(2))|0);
       var $_pre=((1616+($_sum109_pre<<2))|0);
       var $F4_0=$124;var $_pre_phi=$_pre;
      } else {
       var $_sum110=((($122)+(2))|0);
       var $132=((1616+($_sum110<<2))|0);
       var $133=HEAP32[(($132)>>2)];
       var $134=$133;
       var $135=HEAP32[((1592)>>2)];
       var $136=($134>>>0)<($135>>>0);
       if (!($136)) {
        var $F4_0=$133;var $_pre_phi=$132;
        break;
       }
       _abort();
       throw "Reached an unreachable!";
      }
     } while(0);
     var $_pre_phi;
     var $F4_0;
     HEAP32[(($_pre_phi)>>2)]=$120;
     var $139=(($F4_0+12)|0);
     HEAP32[(($139)>>2)]=$120;
     var $140=(($120+8)|0);
     HEAP32[(($140)>>2)]=$F4_0;
     var $141=(($120+12)|0);
     HEAP32[(($141)>>2)]=$124;
    }
    HEAP32[((1584)>>2)]=$106;
    HEAP32[((1596)>>2)]=$111;
    var $143=$88;
    var $mem_0=$143;
    var $mem_0;
    return $mem_0;
   }
   var $145=HEAP32[((1580)>>2)];
   var $146=($145|0)==0;
   if ($146) {
    var $nb_0=$8;
    break;
   }
   var $148=(((-$145))|0);
   var $149=$145&$148;
   var $150=((($149)-(1))|0);
   var $151=$150>>>12;
   var $152=$151&16;
   var $153=$150>>>($152>>>0);
   var $154=$153>>>5;
   var $155=$154&8;
   var $156=$155|$152;
   var $157=$153>>>($155>>>0);
   var $158=$157>>>2;
   var $159=$158&4;
   var $160=$156|$159;
   var $161=$157>>>($159>>>0);
   var $162=$161>>>1;
   var $163=$162&2;
   var $164=$160|$163;
   var $165=$161>>>($163>>>0);
   var $166=$165>>>1;
   var $167=$166&1;
   var $168=$164|$167;
   var $169=$165>>>($167>>>0);
   var $170=((($168)+($169))|0);
   var $171=((1880+($170<<2))|0);
   var $172=HEAP32[(($171)>>2)];
   var $173=(($172+4)|0);
   var $174=HEAP32[(($173)>>2)];
   var $175=$174&-8;
   var $176=((($175)-($8))|0);
   var $t_0_i=$172;var $v_0_i=$172;var $rsize_0_i=$176;
   while(1) {
    var $rsize_0_i;
    var $v_0_i;
    var $t_0_i;
    var $178=(($t_0_i+16)|0);
    var $179=HEAP32[(($178)>>2)];
    var $180=($179|0)==0;
    if ($180) {
     var $182=(($t_0_i+20)|0);
     var $183=HEAP32[(($182)>>2)];
     var $184=($183|0)==0;
     if ($184) {
      break;
     } else {
      var $185=$183;
     }
    } else {
     var $185=$179;
    }
    var $185;
    var $186=(($185+4)|0);
    var $187=HEAP32[(($186)>>2)];
    var $188=$187&-8;
    var $189=((($188)-($8))|0);
    var $190=($189>>>0)<($rsize_0_i>>>0);
    var $_rsize_0_i=($190?$189:$rsize_0_i);
    var $_v_0_i=($190?$185:$v_0_i);
    var $t_0_i=$185;var $v_0_i=$_v_0_i;var $rsize_0_i=$_rsize_0_i;
   }
   var $192=$v_0_i;
   var $193=HEAP32[((1592)>>2)];
   var $194=($192>>>0)<($193>>>0);
   if ($194) {
    _abort();
    throw "Reached an unreachable!";
   }
   var $196=(($192+$8)|0);
   var $197=$196;
   var $198=($192>>>0)<($196>>>0);
   if (!($198)) {
    _abort();
    throw "Reached an unreachable!";
   }
   var $200=(($v_0_i+24)|0);
   var $201=HEAP32[(($200)>>2)];
   var $202=(($v_0_i+12)|0);
   var $203=HEAP32[(($202)>>2)];
   var $204=($203|0)==($v_0_i|0);
   do {
    if ($204) {
     var $220=(($v_0_i+20)|0);
     var $221=HEAP32[(($220)>>2)];
     var $222=($221|0)==0;
     if ($222) {
      var $224=(($v_0_i+16)|0);
      var $225=HEAP32[(($224)>>2)];
      var $226=($225|0)==0;
      if ($226) {
       var $R_1_i=0;
       break;
      } else {
       var $R_0_i=$225;var $RP_0_i=$224;
      }
     } else {
      var $R_0_i=$221;var $RP_0_i=$220;
     }
     while(1) {
      var $RP_0_i;
      var $R_0_i;
      var $227=(($R_0_i+20)|0);
      var $228=HEAP32[(($227)>>2)];
      var $229=($228|0)==0;
      if (!($229)) {
       var $R_0_i=$228;var $RP_0_i=$227;
       continue;
      }
      var $231=(($R_0_i+16)|0);
      var $232=HEAP32[(($231)>>2)];
      var $233=($232|0)==0;
      if ($233) {
       break;
      } else {
       var $R_0_i=$232;var $RP_0_i=$231;
      }
     }
     var $235=$RP_0_i;
     var $236=($235>>>0)<($193>>>0);
     if ($236) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      HEAP32[(($RP_0_i)>>2)]=0;
      var $R_1_i=$R_0_i;
      break;
     }
    } else {
     var $206=(($v_0_i+8)|0);
     var $207=HEAP32[(($206)>>2)];
     var $208=$207;
     var $209=($208>>>0)<($193>>>0);
     if ($209) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $211=(($207+12)|0);
     var $212=HEAP32[(($211)>>2)];
     var $213=($212|0)==($v_0_i|0);
     if (!($213)) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $215=(($203+8)|0);
     var $216=HEAP32[(($215)>>2)];
     var $217=($216|0)==($v_0_i|0);
     if ($217) {
      HEAP32[(($211)>>2)]=$203;
      HEAP32[(($215)>>2)]=$207;
      var $R_1_i=$203;
      break;
     } else {
      _abort();
      throw "Reached an unreachable!";
     }
    }
   } while(0);
   var $R_1_i;
   var $240=($201|0)==0;
   L78: do {
    if (!($240)) {
     var $242=(($v_0_i+28)|0);
     var $243=HEAP32[(($242)>>2)];
     var $244=((1880+($243<<2))|0);
     var $245=HEAP32[(($244)>>2)];
     var $246=($v_0_i|0)==($245|0);
     do {
      if ($246) {
       HEAP32[(($244)>>2)]=$R_1_i;
       var $cond_i=($R_1_i|0)==0;
       if (!($cond_i)) {
        break;
       }
       var $248=HEAP32[(($242)>>2)];
       var $249=1<<$248;
       var $250=$249^-1;
       var $251=HEAP32[((1580)>>2)];
       var $252=$251&$250;
       HEAP32[((1580)>>2)]=$252;
       break L78;
      } else {
       var $254=$201;
       var $255=HEAP32[((1592)>>2)];
       var $256=($254>>>0)<($255>>>0);
       if ($256) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $258=(($201+16)|0);
       var $259=HEAP32[(($258)>>2)];
       var $260=($259|0)==($v_0_i|0);
       if ($260) {
        HEAP32[(($258)>>2)]=$R_1_i;
       } else {
        var $263=(($201+20)|0);
        HEAP32[(($263)>>2)]=$R_1_i;
       }
       var $266=($R_1_i|0)==0;
       if ($266) {
        break L78;
       }
      }
     } while(0);
     var $268=$R_1_i;
     var $269=HEAP32[((1592)>>2)];
     var $270=($268>>>0)<($269>>>0);
     if ($270) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $272=(($R_1_i+24)|0);
     HEAP32[(($272)>>2)]=$201;
     var $273=(($v_0_i+16)|0);
     var $274=HEAP32[(($273)>>2)];
     var $275=($274|0)==0;
     do {
      if (!($275)) {
       var $277=$274;
       var $278=HEAP32[((1592)>>2)];
       var $279=($277>>>0)<($278>>>0);
       if ($279) {
        _abort();
        throw "Reached an unreachable!";
       } else {
        var $281=(($R_1_i+16)|0);
        HEAP32[(($281)>>2)]=$274;
        var $282=(($274+24)|0);
        HEAP32[(($282)>>2)]=$R_1_i;
        break;
       }
      }
     } while(0);
     var $285=(($v_0_i+20)|0);
     var $286=HEAP32[(($285)>>2)];
     var $287=($286|0)==0;
     if ($287) {
      break;
     }
     var $289=$286;
     var $290=HEAP32[((1592)>>2)];
     var $291=($289>>>0)<($290>>>0);
     if ($291) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      var $293=(($R_1_i+20)|0);
      HEAP32[(($293)>>2)]=$286;
      var $294=(($286+24)|0);
      HEAP32[(($294)>>2)]=$R_1_i;
      break;
     }
    }
   } while(0);
   var $298=($rsize_0_i>>>0)<16;
   if ($298) {
    var $300=((($rsize_0_i)+($8))|0);
    var $301=$300|3;
    var $302=(($v_0_i+4)|0);
    HEAP32[(($302)>>2)]=$301;
    var $_sum4_i=((($300)+(4))|0);
    var $303=(($192+$_sum4_i)|0);
    var $304=$303;
    var $305=HEAP32[(($304)>>2)];
    var $306=$305|1;
    HEAP32[(($304)>>2)]=$306;
   } else {
    var $308=$8|3;
    var $309=(($v_0_i+4)|0);
    HEAP32[(($309)>>2)]=$308;
    var $310=$rsize_0_i|1;
    var $_sum_i137=$8|4;
    var $311=(($192+$_sum_i137)|0);
    var $312=$311;
    HEAP32[(($312)>>2)]=$310;
    var $_sum1_i=((($rsize_0_i)+($8))|0);
    var $313=(($192+$_sum1_i)|0);
    var $314=$313;
    HEAP32[(($314)>>2)]=$rsize_0_i;
    var $315=HEAP32[((1584)>>2)];
    var $316=($315|0)==0;
    if (!($316)) {
     var $318=HEAP32[((1596)>>2)];
     var $319=$315>>>3;
     var $320=$319<<1;
     var $321=((1616+($320<<2))|0);
     var $322=$321;
     var $323=HEAP32[((1576)>>2)];
     var $324=1<<$319;
     var $325=$323&$324;
     var $326=($325|0)==0;
     do {
      if ($326) {
       var $328=$323|$324;
       HEAP32[((1576)>>2)]=$328;
       var $_sum2_pre_i=((($320)+(2))|0);
       var $_pre_i=((1616+($_sum2_pre_i<<2))|0);
       var $F1_0_i=$322;var $_pre_phi_i=$_pre_i;
      } else {
       var $_sum3_i=((($320)+(2))|0);
       var $330=((1616+($_sum3_i<<2))|0);
       var $331=HEAP32[(($330)>>2)];
       var $332=$331;
       var $333=HEAP32[((1592)>>2)];
       var $334=($332>>>0)<($333>>>0);
       if (!($334)) {
        var $F1_0_i=$331;var $_pre_phi_i=$330;
        break;
       }
       _abort();
       throw "Reached an unreachable!";
      }
     } while(0);
     var $_pre_phi_i;
     var $F1_0_i;
     HEAP32[(($_pre_phi_i)>>2)]=$318;
     var $337=(($F1_0_i+12)|0);
     HEAP32[(($337)>>2)]=$318;
     var $338=(($318+8)|0);
     HEAP32[(($338)>>2)]=$F1_0_i;
     var $339=(($318+12)|0);
     HEAP32[(($339)>>2)]=$322;
    }
    HEAP32[((1584)>>2)]=$rsize_0_i;
    HEAP32[((1596)>>2)]=$197;
   }
   var $342=(($v_0_i+8)|0);
   var $343=$342;
   var $344=($342|0)==0;
   if ($344) {
    var $nb_0=$8;
    break;
   } else {
    var $mem_0=$343;
   }
   var $mem_0;
   return $mem_0;
  } else {
   var $346=($bytes>>>0)>4294967231;
   if ($346) {
    var $nb_0=-1;
    break;
   }
   var $348=((($bytes)+(11))|0);
   var $349=$348&-8;
   var $350=HEAP32[((1580)>>2)];
   var $351=($350|0)==0;
   if ($351) {
    var $nb_0=$349;
    break;
   }
   var $353=(((-$349))|0);
   var $354=$348>>>8;
   var $355=($354|0)==0;
   do {
    if ($355) {
     var $idx_0_i=0;
    } else {
     var $357=($349>>>0)>16777215;
     if ($357) {
      var $idx_0_i=31;
      break;
     }
     var $359=((($354)+(1048320))|0);
     var $360=$359>>>16;
     var $361=$360&8;
     var $362=$354<<$361;
     var $363=((($362)+(520192))|0);
     var $364=$363>>>16;
     var $365=$364&4;
     var $366=$365|$361;
     var $367=$362<<$365;
     var $368=((($367)+(245760))|0);
     var $369=$368>>>16;
     var $370=$369&2;
     var $371=$366|$370;
     var $372=(((14)-($371))|0);
     var $373=$367<<$370;
     var $374=$373>>>15;
     var $375=((($372)+($374))|0);
     var $376=$375<<1;
     var $377=((($375)+(7))|0);
     var $378=$349>>>($377>>>0);
     var $379=$378&1;
     var $380=$379|$376;
     var $idx_0_i=$380;
    }
   } while(0);
   var $idx_0_i;
   var $382=((1880+($idx_0_i<<2))|0);
   var $383=HEAP32[(($382)>>2)];
   var $384=($383|0)==0;
   L126: do {
    if ($384) {
     var $v_2_i=0;var $rsize_2_i=$353;var $t_1_i=0;
    } else {
     var $386=($idx_0_i|0)==31;
     if ($386) {
      var $391=0;
     } else {
      var $388=$idx_0_i>>>1;
      var $389=(((25)-($388))|0);
      var $391=$389;
     }
     var $391;
     var $392=$349<<$391;
     var $v_0_i118=0;var $rsize_0_i117=$353;var $t_0_i116=$383;var $sizebits_0_i=$392;var $rst_0_i=0;
     while(1) {
      var $rst_0_i;
      var $sizebits_0_i;
      var $t_0_i116;
      var $rsize_0_i117;
      var $v_0_i118;
      var $394=(($t_0_i116+4)|0);
      var $395=HEAP32[(($394)>>2)];
      var $396=$395&-8;
      var $397=((($396)-($349))|0);
      var $398=($397>>>0)<($rsize_0_i117>>>0);
      if ($398) {
       var $400=($396|0)==($349|0);
       if ($400) {
        var $v_2_i=$t_0_i116;var $rsize_2_i=$397;var $t_1_i=$t_0_i116;
        break L126;
       } else {
        var $v_1_i=$t_0_i116;var $rsize_1_i=$397;
       }
      } else {
       var $v_1_i=$v_0_i118;var $rsize_1_i=$rsize_0_i117;
      }
      var $rsize_1_i;
      var $v_1_i;
      var $402=(($t_0_i116+20)|0);
      var $403=HEAP32[(($402)>>2)];
      var $404=$sizebits_0_i>>>31;
      var $405=(($t_0_i116+16+($404<<2))|0);
      var $406=HEAP32[(($405)>>2)];
      var $407=($403|0)==0;
      var $408=($403|0)==($406|0);
      var $or_cond_i=$407|$408;
      var $rst_1_i=($or_cond_i?$rst_0_i:$403);
      var $409=($406|0)==0;
      var $410=$sizebits_0_i<<1;
      if ($409) {
       var $v_2_i=$v_1_i;var $rsize_2_i=$rsize_1_i;var $t_1_i=$rst_1_i;
       break;
      } else {
       var $v_0_i118=$v_1_i;var $rsize_0_i117=$rsize_1_i;var $t_0_i116=$406;var $sizebits_0_i=$410;var $rst_0_i=$rst_1_i;
      }
     }
    }
   } while(0);
   var $t_1_i;
   var $rsize_2_i;
   var $v_2_i;
   var $411=($t_1_i|0)==0;
   var $412=($v_2_i|0)==0;
   var $or_cond21_i=$411&$412;
   if ($or_cond21_i) {
    var $414=2<<$idx_0_i;
    var $415=(((-$414))|0);
    var $416=$414|$415;
    var $417=$350&$416;
    var $418=($417|0)==0;
    if ($418) {
     var $nb_0=$349;
     break;
    }
    var $420=(((-$417))|0);
    var $421=$417&$420;
    var $422=((($421)-(1))|0);
    var $423=$422>>>12;
    var $424=$423&16;
    var $425=$422>>>($424>>>0);
    var $426=$425>>>5;
    var $427=$426&8;
    var $428=$427|$424;
    var $429=$425>>>($427>>>0);
    var $430=$429>>>2;
    var $431=$430&4;
    var $432=$428|$431;
    var $433=$429>>>($431>>>0);
    var $434=$433>>>1;
    var $435=$434&2;
    var $436=$432|$435;
    var $437=$433>>>($435>>>0);
    var $438=$437>>>1;
    var $439=$438&1;
    var $440=$436|$439;
    var $441=$437>>>($439>>>0);
    var $442=((($440)+($441))|0);
    var $443=((1880+($442<<2))|0);
    var $444=HEAP32[(($443)>>2)];
    var $t_2_ph_i=$444;
   } else {
    var $t_2_ph_i=$t_1_i;
   }
   var $t_2_ph_i;
   var $445=($t_2_ph_i|0)==0;
   if ($445) {
    var $rsize_3_lcssa_i=$rsize_2_i;var $v_3_lcssa_i=$v_2_i;
   } else {
    var $t_228_i=$t_2_ph_i;var $rsize_329_i=$rsize_2_i;var $v_330_i=$v_2_i;
    while(1) {
     var $v_330_i;
     var $rsize_329_i;
     var $t_228_i;
     var $446=(($t_228_i+4)|0);
     var $447=HEAP32[(($446)>>2)];
     var $448=$447&-8;
     var $449=((($448)-($349))|0);
     var $450=($449>>>0)<($rsize_329_i>>>0);
     var $_rsize_3_i=($450?$449:$rsize_329_i);
     var $t_2_v_3_i=($450?$t_228_i:$v_330_i);
     var $451=(($t_228_i+16)|0);
     var $452=HEAP32[(($451)>>2)];
     var $453=($452|0)==0;
     if (!($453)) {
      var $t_228_i=$452;var $rsize_329_i=$_rsize_3_i;var $v_330_i=$t_2_v_3_i;
      continue;
     }
     var $454=(($t_228_i+20)|0);
     var $455=HEAP32[(($454)>>2)];
     var $456=($455|0)==0;
     if ($456) {
      var $rsize_3_lcssa_i=$_rsize_3_i;var $v_3_lcssa_i=$t_2_v_3_i;
      break;
     } else {
      var $t_228_i=$455;var $rsize_329_i=$_rsize_3_i;var $v_330_i=$t_2_v_3_i;
     }
    }
   }
   var $v_3_lcssa_i;
   var $rsize_3_lcssa_i;
   var $457=($v_3_lcssa_i|0)==0;
   if ($457) {
    var $nb_0=$349;
    break;
   }
   var $459=HEAP32[((1584)>>2)];
   var $460=((($459)-($349))|0);
   var $461=($rsize_3_lcssa_i>>>0)<($460>>>0);
   if (!($461)) {
    var $nb_0=$349;
    break;
   }
   var $463=$v_3_lcssa_i;
   var $464=HEAP32[((1592)>>2)];
   var $465=($463>>>0)<($464>>>0);
   if ($465) {
    _abort();
    throw "Reached an unreachable!";
   }
   var $467=(($463+$349)|0);
   var $468=$467;
   var $469=($463>>>0)<($467>>>0);
   if (!($469)) {
    _abort();
    throw "Reached an unreachable!";
   }
   var $471=(($v_3_lcssa_i+24)|0);
   var $472=HEAP32[(($471)>>2)];
   var $473=(($v_3_lcssa_i+12)|0);
   var $474=HEAP32[(($473)>>2)];
   var $475=($474|0)==($v_3_lcssa_i|0);
   do {
    if ($475) {
     var $491=(($v_3_lcssa_i+20)|0);
     var $492=HEAP32[(($491)>>2)];
     var $493=($492|0)==0;
     if ($493) {
      var $495=(($v_3_lcssa_i+16)|0);
      var $496=HEAP32[(($495)>>2)];
      var $497=($496|0)==0;
      if ($497) {
       var $R_1_i122=0;
       break;
      } else {
       var $R_0_i120=$496;var $RP_0_i119=$495;
      }
     } else {
      var $R_0_i120=$492;var $RP_0_i119=$491;
     }
     while(1) {
      var $RP_0_i119;
      var $R_0_i120;
      var $498=(($R_0_i120+20)|0);
      var $499=HEAP32[(($498)>>2)];
      var $500=($499|0)==0;
      if (!($500)) {
       var $R_0_i120=$499;var $RP_0_i119=$498;
       continue;
      }
      var $502=(($R_0_i120+16)|0);
      var $503=HEAP32[(($502)>>2)];
      var $504=($503|0)==0;
      if ($504) {
       break;
      } else {
       var $R_0_i120=$503;var $RP_0_i119=$502;
      }
     }
     var $506=$RP_0_i119;
     var $507=($506>>>0)<($464>>>0);
     if ($507) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      HEAP32[(($RP_0_i119)>>2)]=0;
      var $R_1_i122=$R_0_i120;
      break;
     }
    } else {
     var $477=(($v_3_lcssa_i+8)|0);
     var $478=HEAP32[(($477)>>2)];
     var $479=$478;
     var $480=($479>>>0)<($464>>>0);
     if ($480) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $482=(($478+12)|0);
     var $483=HEAP32[(($482)>>2)];
     var $484=($483|0)==($v_3_lcssa_i|0);
     if (!($484)) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $486=(($474+8)|0);
     var $487=HEAP32[(($486)>>2)];
     var $488=($487|0)==($v_3_lcssa_i|0);
     if ($488) {
      HEAP32[(($482)>>2)]=$474;
      HEAP32[(($486)>>2)]=$478;
      var $R_1_i122=$474;
      break;
     } else {
      _abort();
      throw "Reached an unreachable!";
     }
    }
   } while(0);
   var $R_1_i122;
   var $511=($472|0)==0;
   L176: do {
    if (!($511)) {
     var $513=(($v_3_lcssa_i+28)|0);
     var $514=HEAP32[(($513)>>2)];
     var $515=((1880+($514<<2))|0);
     var $516=HEAP32[(($515)>>2)];
     var $517=($v_3_lcssa_i|0)==($516|0);
     do {
      if ($517) {
       HEAP32[(($515)>>2)]=$R_1_i122;
       var $cond_i123=($R_1_i122|0)==0;
       if (!($cond_i123)) {
        break;
       }
       var $519=HEAP32[(($513)>>2)];
       var $520=1<<$519;
       var $521=$520^-1;
       var $522=HEAP32[((1580)>>2)];
       var $523=$522&$521;
       HEAP32[((1580)>>2)]=$523;
       break L176;
      } else {
       var $525=$472;
       var $526=HEAP32[((1592)>>2)];
       var $527=($525>>>0)<($526>>>0);
       if ($527) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $529=(($472+16)|0);
       var $530=HEAP32[(($529)>>2)];
       var $531=($530|0)==($v_3_lcssa_i|0);
       if ($531) {
        HEAP32[(($529)>>2)]=$R_1_i122;
       } else {
        var $534=(($472+20)|0);
        HEAP32[(($534)>>2)]=$R_1_i122;
       }
       var $537=($R_1_i122|0)==0;
       if ($537) {
        break L176;
       }
      }
     } while(0);
     var $539=$R_1_i122;
     var $540=HEAP32[((1592)>>2)];
     var $541=($539>>>0)<($540>>>0);
     if ($541) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $543=(($R_1_i122+24)|0);
     HEAP32[(($543)>>2)]=$472;
     var $544=(($v_3_lcssa_i+16)|0);
     var $545=HEAP32[(($544)>>2)];
     var $546=($545|0)==0;
     do {
      if (!($546)) {
       var $548=$545;
       var $549=HEAP32[((1592)>>2)];
       var $550=($548>>>0)<($549>>>0);
       if ($550) {
        _abort();
        throw "Reached an unreachable!";
       } else {
        var $552=(($R_1_i122+16)|0);
        HEAP32[(($552)>>2)]=$545;
        var $553=(($545+24)|0);
        HEAP32[(($553)>>2)]=$R_1_i122;
        break;
       }
      }
     } while(0);
     var $556=(($v_3_lcssa_i+20)|0);
     var $557=HEAP32[(($556)>>2)];
     var $558=($557|0)==0;
     if ($558) {
      break;
     }
     var $560=$557;
     var $561=HEAP32[((1592)>>2)];
     var $562=($560>>>0)<($561>>>0);
     if ($562) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      var $564=(($R_1_i122+20)|0);
      HEAP32[(($564)>>2)]=$557;
      var $565=(($557+24)|0);
      HEAP32[(($565)>>2)]=$R_1_i122;
      break;
     }
    }
   } while(0);
   var $569=($rsize_3_lcssa_i>>>0)<16;
   do {
    if ($569) {
     var $571=((($rsize_3_lcssa_i)+($349))|0);
     var $572=$571|3;
     var $573=(($v_3_lcssa_i+4)|0);
     HEAP32[(($573)>>2)]=$572;
     var $_sum19_i=((($571)+(4))|0);
     var $574=(($463+$_sum19_i)|0);
     var $575=$574;
     var $576=HEAP32[(($575)>>2)];
     var $577=$576|1;
     HEAP32[(($575)>>2)]=$577;
    } else {
     var $579=$349|3;
     var $580=(($v_3_lcssa_i+4)|0);
     HEAP32[(($580)>>2)]=$579;
     var $581=$rsize_3_lcssa_i|1;
     var $_sum_i125136=$349|4;
     var $582=(($463+$_sum_i125136)|0);
     var $583=$582;
     HEAP32[(($583)>>2)]=$581;
     var $_sum1_i126=((($rsize_3_lcssa_i)+($349))|0);
     var $584=(($463+$_sum1_i126)|0);
     var $585=$584;
     HEAP32[(($585)>>2)]=$rsize_3_lcssa_i;
     var $586=$rsize_3_lcssa_i>>>3;
     var $587=($rsize_3_lcssa_i>>>0)<256;
     if ($587) {
      var $589=$586<<1;
      var $590=((1616+($589<<2))|0);
      var $591=$590;
      var $592=HEAP32[((1576)>>2)];
      var $593=1<<$586;
      var $594=$592&$593;
      var $595=($594|0)==0;
      do {
       if ($595) {
        var $597=$592|$593;
        HEAP32[((1576)>>2)]=$597;
        var $_sum15_pre_i=((($589)+(2))|0);
        var $_pre_i127=((1616+($_sum15_pre_i<<2))|0);
        var $F5_0_i=$591;var $_pre_phi_i128=$_pre_i127;
       } else {
        var $_sum18_i=((($589)+(2))|0);
        var $599=((1616+($_sum18_i<<2))|0);
        var $600=HEAP32[(($599)>>2)];
        var $601=$600;
        var $602=HEAP32[((1592)>>2)];
        var $603=($601>>>0)<($602>>>0);
        if (!($603)) {
         var $F5_0_i=$600;var $_pre_phi_i128=$599;
         break;
        }
        _abort();
        throw "Reached an unreachable!";
       }
      } while(0);
      var $_pre_phi_i128;
      var $F5_0_i;
      HEAP32[(($_pre_phi_i128)>>2)]=$468;
      var $606=(($F5_0_i+12)|0);
      HEAP32[(($606)>>2)]=$468;
      var $_sum16_i=((($349)+(8))|0);
      var $607=(($463+$_sum16_i)|0);
      var $608=$607;
      HEAP32[(($608)>>2)]=$F5_0_i;
      var $_sum17_i=((($349)+(12))|0);
      var $609=(($463+$_sum17_i)|0);
      var $610=$609;
      HEAP32[(($610)>>2)]=$591;
      break;
     }
     var $612=$467;
     var $613=$rsize_3_lcssa_i>>>8;
     var $614=($613|0)==0;
     do {
      if ($614) {
       var $I7_0_i=0;
      } else {
       var $616=($rsize_3_lcssa_i>>>0)>16777215;
       if ($616) {
        var $I7_0_i=31;
        break;
       }
       var $618=((($613)+(1048320))|0);
       var $619=$618>>>16;
       var $620=$619&8;
       var $621=$613<<$620;
       var $622=((($621)+(520192))|0);
       var $623=$622>>>16;
       var $624=$623&4;
       var $625=$624|$620;
       var $626=$621<<$624;
       var $627=((($626)+(245760))|0);
       var $628=$627>>>16;
       var $629=$628&2;
       var $630=$625|$629;
       var $631=(((14)-($630))|0);
       var $632=$626<<$629;
       var $633=$632>>>15;
       var $634=((($631)+($633))|0);
       var $635=$634<<1;
       var $636=((($634)+(7))|0);
       var $637=$rsize_3_lcssa_i>>>($636>>>0);
       var $638=$637&1;
       var $639=$638|$635;
       var $I7_0_i=$639;
      }
     } while(0);
     var $I7_0_i;
     var $641=((1880+($I7_0_i<<2))|0);
     var $_sum2_i=((($349)+(28))|0);
     var $642=(($463+$_sum2_i)|0);
     var $643=$642;
     HEAP32[(($643)>>2)]=$I7_0_i;
     var $_sum3_i129=((($349)+(16))|0);
     var $644=(($463+$_sum3_i129)|0);
     var $_sum4_i130=((($349)+(20))|0);
     var $645=(($463+$_sum4_i130)|0);
     var $646=$645;
     HEAP32[(($646)>>2)]=0;
     var $647=$644;
     HEAP32[(($647)>>2)]=0;
     var $648=HEAP32[((1580)>>2)];
     var $649=1<<$I7_0_i;
     var $650=$648&$649;
     var $651=($650|0)==0;
     if ($651) {
      var $653=$648|$649;
      HEAP32[((1580)>>2)]=$653;
      HEAP32[(($641)>>2)]=$612;
      var $654=$641;
      var $_sum5_i=((($349)+(24))|0);
      var $655=(($463+$_sum5_i)|0);
      var $656=$655;
      HEAP32[(($656)>>2)]=$654;
      var $_sum6_i=((($349)+(12))|0);
      var $657=(($463+$_sum6_i)|0);
      var $658=$657;
      HEAP32[(($658)>>2)]=$612;
      var $_sum7_i=((($349)+(8))|0);
      var $659=(($463+$_sum7_i)|0);
      var $660=$659;
      HEAP32[(($660)>>2)]=$612;
      break;
     }
     var $662=HEAP32[(($641)>>2)];
     var $663=($I7_0_i|0)==31;
     if ($663) {
      var $668=0;
     } else {
      var $665=$I7_0_i>>>1;
      var $666=(((25)-($665))|0);
      var $668=$666;
     }
     var $668;
     var $669=$rsize_3_lcssa_i<<$668;
     var $K12_0_i=$669;var $T_0_i=$662;
     while(1) {
      var $T_0_i;
      var $K12_0_i;
      var $671=(($T_0_i+4)|0);
      var $672=HEAP32[(($671)>>2)];
      var $673=$672&-8;
      var $674=($673|0)==($rsize_3_lcssa_i|0);
      if ($674) {
       break;
      }
      var $676=$K12_0_i>>>31;
      var $677=(($T_0_i+16+($676<<2))|0);
      var $678=HEAP32[(($677)>>2)];
      var $679=($678|0)==0;
      var $680=$K12_0_i<<1;
      if ($679) {
       label = 151;
       break;
      } else {
       var $K12_0_i=$680;var $T_0_i=$678;
      }
     }
     if (label == 151) {
      var $682=$677;
      var $683=HEAP32[((1592)>>2)];
      var $684=($682>>>0)<($683>>>0);
      if ($684) {
       _abort();
       throw "Reached an unreachable!";
      } else {
       HEAP32[(($677)>>2)]=$612;
       var $_sum12_i=((($349)+(24))|0);
       var $686=(($463+$_sum12_i)|0);
       var $687=$686;
       HEAP32[(($687)>>2)]=$T_0_i;
       var $_sum13_i=((($349)+(12))|0);
       var $688=(($463+$_sum13_i)|0);
       var $689=$688;
       HEAP32[(($689)>>2)]=$612;
       var $_sum14_i=((($349)+(8))|0);
       var $690=(($463+$_sum14_i)|0);
       var $691=$690;
       HEAP32[(($691)>>2)]=$612;
       break;
      }
     }
     var $694=(($T_0_i+8)|0);
     var $695=HEAP32[(($694)>>2)];
     var $696=$T_0_i;
     var $697=HEAP32[((1592)>>2)];
     var $698=($696>>>0)<($697>>>0);
     if ($698) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $700=$695;
     var $701=($700>>>0)<($697>>>0);
     if ($701) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      var $703=(($695+12)|0);
      HEAP32[(($703)>>2)]=$612;
      HEAP32[(($694)>>2)]=$612;
      var $_sum9_i=((($349)+(8))|0);
      var $704=(($463+$_sum9_i)|0);
      var $705=$704;
      HEAP32[(($705)>>2)]=$695;
      var $_sum10_i=((($349)+(12))|0);
      var $706=(($463+$_sum10_i)|0);
      var $707=$706;
      HEAP32[(($707)>>2)]=$T_0_i;
      var $_sum11_i=((($349)+(24))|0);
      var $708=(($463+$_sum11_i)|0);
      var $709=$708;
      HEAP32[(($709)>>2)]=0;
      break;
     }
    }
   } while(0);
   var $711=(($v_3_lcssa_i+8)|0);
   var $712=$711;
   var $713=($711|0)==0;
   if ($713) {
    var $nb_0=$349;
    break;
   } else {
    var $mem_0=$712;
   }
   var $mem_0;
   return $mem_0;
  }
 } while(0);
 var $nb_0;
 var $714=HEAP32[((1584)>>2)];
 var $715=($nb_0>>>0)>($714>>>0);
 if (!($715)) {
  var $717=((($714)-($nb_0))|0);
  var $718=HEAP32[((1596)>>2)];
  var $719=($717>>>0)>15;
  if ($719) {
   var $721=$718;
   var $722=(($721+$nb_0)|0);
   var $723=$722;
   HEAP32[((1596)>>2)]=$723;
   HEAP32[((1584)>>2)]=$717;
   var $724=$717|1;
   var $_sum102=((($nb_0)+(4))|0);
   var $725=(($721+$_sum102)|0);
   var $726=$725;
   HEAP32[(($726)>>2)]=$724;
   var $727=(($721+$714)|0);
   var $728=$727;
   HEAP32[(($728)>>2)]=$717;
   var $729=$nb_0|3;
   var $730=(($718+4)|0);
   HEAP32[(($730)>>2)]=$729;
  } else {
   HEAP32[((1584)>>2)]=0;
   HEAP32[((1596)>>2)]=0;
   var $732=$714|3;
   var $733=(($718+4)|0);
   HEAP32[(($733)>>2)]=$732;
   var $734=$718;
   var $_sum101=((($714)+(4))|0);
   var $735=(($734+$_sum101)|0);
   var $736=$735;
   var $737=HEAP32[(($736)>>2)];
   var $738=$737|1;
   HEAP32[(($736)>>2)]=$738;
  }
  var $740=(($718+8)|0);
  var $741=$740;
  var $mem_0=$741;
  var $mem_0;
  return $mem_0;
 }
 var $743=HEAP32[((1588)>>2)];
 var $744=($nb_0>>>0)<($743>>>0);
 if ($744) {
  var $746=((($743)-($nb_0))|0);
  HEAP32[((1588)>>2)]=$746;
  var $747=HEAP32[((1600)>>2)];
  var $748=$747;
  var $749=(($748+$nb_0)|0);
  var $750=$749;
  HEAP32[((1600)>>2)]=$750;
  var $751=$746|1;
  var $_sum=((($nb_0)+(4))|0);
  var $752=(($748+$_sum)|0);
  var $753=$752;
  HEAP32[(($753)>>2)]=$751;
  var $754=$nb_0|3;
  var $755=(($747+4)|0);
  HEAP32[(($755)>>2)]=$754;
  var $756=(($747+8)|0);
  var $757=$756;
  var $mem_0=$757;
  var $mem_0;
  return $mem_0;
 }
 var $759=HEAP32[((1520)>>2)];
 var $760=($759|0)==0;
 do {
  if ($760) {
   var $762=_sysconf(30);
   var $763=((($762)-(1))|0);
   var $764=$763&$762;
   var $765=($764|0)==0;
   if ($765) {
    HEAP32[((1528)>>2)]=$762;
    HEAP32[((1524)>>2)]=$762;
    HEAP32[((1532)>>2)]=-1;
    HEAP32[((1536)>>2)]=-1;
    HEAP32[((1540)>>2)]=0;
    HEAP32[((2020)>>2)]=0;
    var $767=_time(0);
    var $768=$767&-16;
    var $769=$768^1431655768;
    HEAP32[((1520)>>2)]=$769;
    break;
   } else {
    _abort();
    throw "Reached an unreachable!";
   }
  }
 } while(0);
 var $771=((($nb_0)+(48))|0);
 var $772=HEAP32[((1528)>>2)];
 var $773=((($nb_0)+(47))|0);
 var $774=((($772)+($773))|0);
 var $775=(((-$772))|0);
 var $776=$774&$775;
 var $777=($776>>>0)>($nb_0>>>0);
 if (!($777)) {
  var $mem_0=0;
  var $mem_0;
  return $mem_0;
 }
 var $779=HEAP32[((2016)>>2)];
 var $780=($779|0)==0;
 do {
  if (!($780)) {
   var $782=HEAP32[((2008)>>2)];
   var $783=((($782)+($776))|0);
   var $784=($783>>>0)<=($782>>>0);
   var $785=($783>>>0)>($779>>>0);
   var $or_cond1_i=$784|$785;
   if ($or_cond1_i) {
    var $mem_0=0;
   } else {
    break;
   }
   var $mem_0;
   return $mem_0;
  }
 } while(0);
 var $787=HEAP32[((2020)>>2)];
 var $788=$787&4;
 var $789=($788|0)==0;
 L268: do {
  if ($789) {
   var $791=HEAP32[((1600)>>2)];
   var $792=($791|0)==0;
   L270: do {
    if ($792) {
     label = 181;
    } else {
     var $794=$791;
     var $sp_0_i_i=2024;
     while(1) {
      var $sp_0_i_i;
      var $796=(($sp_0_i_i)|0);
      var $797=HEAP32[(($796)>>2)];
      var $798=($797>>>0)>($794>>>0);
      if (!($798)) {
       var $800=(($sp_0_i_i+4)|0);
       var $801=HEAP32[(($800)>>2)];
       var $802=(($797+$801)|0);
       var $803=($802>>>0)>($794>>>0);
       if ($803) {
        break;
       }
      }
      var $805=(($sp_0_i_i+8)|0);
      var $806=HEAP32[(($805)>>2)];
      var $807=($806|0)==0;
      if ($807) {
       label = 181;
       break L270;
      } else {
       var $sp_0_i_i=$806;
      }
     }
     var $808=($sp_0_i_i|0)==0;
     if ($808) {
      label = 181;
      break;
     }
     var $838=HEAP32[((1588)>>2)];
     var $839=((($774)-($838))|0);
     var $840=$839&$775;
     var $841=($840>>>0)<2147483647;
     if (!($841)) {
      var $tsize_0303639_i=0;
      break;
     }
     var $843=_sbrk($840);
     var $844=HEAP32[(($796)>>2)];
     var $845=HEAP32[(($800)>>2)];
     var $846=(($844+$845)|0);
     var $847=($843|0)==($846|0);
     var $_3_i=($847?$840:0);
     var $_4_i=($847?$843:-1);
     var $tbase_0_i=$_4_i;var $tsize_0_i=$_3_i;var $br_0_i=$843;var $ssize_1_i=$840;
     label = 190;
    }
   } while(0);
   do {
    if (label == 181) {
     var $809=_sbrk(0);
     var $810=($809|0)==-1;
     if ($810) {
      var $tsize_0303639_i=0;
      break;
     }
     var $812=$809;
     var $813=HEAP32[((1524)>>2)];
     var $814=((($813)-(1))|0);
     var $815=$814&$812;
     var $816=($815|0)==0;
     if ($816) {
      var $ssize_0_i=$776;
     } else {
      var $818=((($814)+($812))|0);
      var $819=(((-$813))|0);
      var $820=$818&$819;
      var $821=((($776)-($812))|0);
      var $822=((($821)+($820))|0);
      var $ssize_0_i=$822;
     }
     var $ssize_0_i;
     var $824=HEAP32[((2008)>>2)];
     var $825=((($824)+($ssize_0_i))|0);
     var $826=($ssize_0_i>>>0)>($nb_0>>>0);
     var $827=($ssize_0_i>>>0)<2147483647;
     var $or_cond_i131=$826&$827;
     if (!($or_cond_i131)) {
      var $tsize_0303639_i=0;
      break;
     }
     var $829=HEAP32[((2016)>>2)];
     var $830=($829|0)==0;
     if (!($830)) {
      var $832=($825>>>0)<=($824>>>0);
      var $833=($825>>>0)>($829>>>0);
      var $or_cond2_i=$832|$833;
      if ($or_cond2_i) {
       var $tsize_0303639_i=0;
       break;
      }
     }
     var $835=_sbrk($ssize_0_i);
     var $836=($835|0)==($809|0);
     var $ssize_0__i=($836?$ssize_0_i:0);
     var $__i=($836?$809:-1);
     var $tbase_0_i=$__i;var $tsize_0_i=$ssize_0__i;var $br_0_i=$835;var $ssize_1_i=$ssize_0_i;
     label = 190;
    }
   } while(0);
   L290: do {
    if (label == 190) {
     var $ssize_1_i;
     var $br_0_i;
     var $tsize_0_i;
     var $tbase_0_i;
     var $849=(((-$ssize_1_i))|0);
     var $850=($tbase_0_i|0)==-1;
     if (!($850)) {
      var $tsize_244_i=$tsize_0_i;var $tbase_245_i=$tbase_0_i;
      label = 201;
      break L268;
     }
     var $852=($br_0_i|0)!=-1;
     var $853=($ssize_1_i>>>0)<2147483647;
     var $or_cond5_i=$852&$853;
     var $854=($ssize_1_i>>>0)<($771>>>0);
     var $or_cond6_i=$or_cond5_i&$854;
     do {
      if ($or_cond6_i) {
       var $856=HEAP32[((1528)>>2)];
       var $857=((($773)-($ssize_1_i))|0);
       var $858=((($857)+($856))|0);
       var $859=(((-$856))|0);
       var $860=$858&$859;
       var $861=($860>>>0)<2147483647;
       if (!($861)) {
        var $ssize_2_i=$ssize_1_i;
        break;
       }
       var $863=_sbrk($860);
       var $864=($863|0)==-1;
       if ($864) {
        var $868=_sbrk($849);
        var $tsize_0303639_i=$tsize_0_i;
        break L290;
       } else {
        var $866=((($860)+($ssize_1_i))|0);
        var $ssize_2_i=$866;
        break;
       }
      } else {
       var $ssize_2_i=$ssize_1_i;
      }
     } while(0);
     var $ssize_2_i;
     var $870=($br_0_i|0)==-1;
     if ($870) {
      var $tsize_0303639_i=$tsize_0_i;
     } else {
      var $tsize_244_i=$ssize_2_i;var $tbase_245_i=$br_0_i;
      label = 201;
      break L268;
     }
    }
   } while(0);
   var $tsize_0303639_i;
   var $871=HEAP32[((2020)>>2)];
   var $872=$871|4;
   HEAP32[((2020)>>2)]=$872;
   var $tsize_1_i=$tsize_0303639_i;
   label = 198;
  } else {
   var $tsize_1_i=0;
   label = 198;
  }
 } while(0);
 do {
  if (label == 198) {
   var $tsize_1_i;
   var $874=($776>>>0)<2147483647;
   if (!($874)) {
    break;
   }
   var $876=_sbrk($776);
   var $877=_sbrk(0);
   var $notlhs_i=($876|0)!=-1;
   var $notrhs_i=($877|0)!=-1;
   var $or_cond8_not_i=$notrhs_i&$notlhs_i;
   var $878=($876>>>0)<($877>>>0);
   var $or_cond9_i=$or_cond8_not_i&$878;
   if (!($or_cond9_i)) {
    break;
   }
   var $879=$877;
   var $880=$876;
   var $881=((($879)-($880))|0);
   var $882=((($nb_0)+(40))|0);
   var $883=($881>>>0)>($882>>>0);
   var $_tsize_1_i=($883?$881:$tsize_1_i);
   var $_tbase_1_i=($883?$876:-1);
   var $884=($_tbase_1_i|0)==-1;
   if (!($884)) {
    var $tsize_244_i=$_tsize_1_i;var $tbase_245_i=$_tbase_1_i;
    label = 201;
   }
  }
 } while(0);
 do {
  if (label == 201) {
   var $tbase_245_i;
   var $tsize_244_i;
   var $885=HEAP32[((2008)>>2)];
   var $886=((($885)+($tsize_244_i))|0);
   HEAP32[((2008)>>2)]=$886;
   var $887=HEAP32[((2012)>>2)];
   var $888=($886>>>0)>($887>>>0);
   if ($888) {
    HEAP32[((2012)>>2)]=$886;
   }
   var $890=HEAP32[((1600)>>2)];
   var $891=($890|0)==0;
   L310: do {
    if ($891) {
     var $893=HEAP32[((1592)>>2)];
     var $894=($893|0)==0;
     var $895=($tbase_245_i>>>0)<($893>>>0);
     var $or_cond10_i=$894|$895;
     if ($or_cond10_i) {
      HEAP32[((1592)>>2)]=$tbase_245_i;
     }
     HEAP32[((2024)>>2)]=$tbase_245_i;
     HEAP32[((2028)>>2)]=$tsize_244_i;
     HEAP32[((2036)>>2)]=0;
     var $897=HEAP32[((1520)>>2)];
     HEAP32[((1612)>>2)]=$897;
     HEAP32[((1608)>>2)]=-1;
     var $i_02_i_i=0;
     while(1) {
      var $i_02_i_i;
      var $899=$i_02_i_i<<1;
      var $900=((1616+($899<<2))|0);
      var $901=$900;
      var $_sum_i_i=((($899)+(3))|0);
      var $902=((1616+($_sum_i_i<<2))|0);
      HEAP32[(($902)>>2)]=$901;
      var $_sum1_i_i=((($899)+(2))|0);
      var $903=((1616+($_sum1_i_i<<2))|0);
      HEAP32[(($903)>>2)]=$901;
      var $904=((($i_02_i_i)+(1))|0);
      var $905=($904>>>0)<32;
      if ($905) {
       var $i_02_i_i=$904;
      } else {
       break;
      }
     }
     var $906=((($tsize_244_i)-(40))|0);
     var $907=(($tbase_245_i+8)|0);
     var $908=$907;
     var $909=$908&7;
     var $910=($909|0)==0;
     if ($910) {
      var $914=0;
     } else {
      var $912=(((-$908))|0);
      var $913=$912&7;
      var $914=$913;
     }
     var $914;
     var $915=(($tbase_245_i+$914)|0);
     var $916=$915;
     var $917=((($906)-($914))|0);
     HEAP32[((1600)>>2)]=$916;
     HEAP32[((1588)>>2)]=$917;
     var $918=$917|1;
     var $_sum_i14_i=((($914)+(4))|0);
     var $919=(($tbase_245_i+$_sum_i14_i)|0);
     var $920=$919;
     HEAP32[(($920)>>2)]=$918;
     var $_sum2_i_i=((($tsize_244_i)-(36))|0);
     var $921=(($tbase_245_i+$_sum2_i_i)|0);
     var $922=$921;
     HEAP32[(($922)>>2)]=40;
     var $923=HEAP32[((1536)>>2)];
     HEAP32[((1604)>>2)]=$923;
    } else {
     var $sp_067_i=2024;
     while(1) {
      var $sp_067_i;
      var $924=(($sp_067_i)|0);
      var $925=HEAP32[(($924)>>2)];
      var $926=(($sp_067_i+4)|0);
      var $927=HEAP32[(($926)>>2)];
      var $928=(($925+$927)|0);
      var $929=($tbase_245_i|0)==($928|0);
      if ($929) {
       label = 213;
       break;
      }
      var $931=(($sp_067_i+8)|0);
      var $932=HEAP32[(($931)>>2)];
      var $933=($932|0)==0;
      if ($933) {
       break;
      } else {
       var $sp_067_i=$932;
      }
     }
     do {
      if (label == 213) {
       var $934=(($sp_067_i+12)|0);
       var $935=HEAP32[(($934)>>2)];
       var $936=$935&8;
       var $937=($936|0)==0;
       if (!($937)) {
        break;
       }
       var $939=$890;
       var $940=($939>>>0)>=($925>>>0);
       var $941=($939>>>0)<($tbase_245_i>>>0);
       var $or_cond47_i=$940&$941;
       if (!($or_cond47_i)) {
        break;
       }
       var $943=((($927)+($tsize_244_i))|0);
       HEAP32[(($926)>>2)]=$943;
       var $944=HEAP32[((1600)>>2)];
       var $945=HEAP32[((1588)>>2)];
       var $946=((($945)+($tsize_244_i))|0);
       var $947=$944;
       var $948=(($944+8)|0);
       var $949=$948;
       var $950=$949&7;
       var $951=($950|0)==0;
       if ($951) {
        var $955=0;
       } else {
        var $953=(((-$949))|0);
        var $954=$953&7;
        var $955=$954;
       }
       var $955;
       var $956=(($947+$955)|0);
       var $957=$956;
       var $958=((($946)-($955))|0);
       HEAP32[((1600)>>2)]=$957;
       HEAP32[((1588)>>2)]=$958;
       var $959=$958|1;
       var $_sum_i18_i=((($955)+(4))|0);
       var $960=(($947+$_sum_i18_i)|0);
       var $961=$960;
       HEAP32[(($961)>>2)]=$959;
       var $_sum2_i19_i=((($946)+(4))|0);
       var $962=(($947+$_sum2_i19_i)|0);
       var $963=$962;
       HEAP32[(($963)>>2)]=40;
       var $964=HEAP32[((1536)>>2)];
       HEAP32[((1604)>>2)]=$964;
       break L310;
      }
     } while(0);
     var $965=HEAP32[((1592)>>2)];
     var $966=($tbase_245_i>>>0)<($965>>>0);
     if ($966) {
      HEAP32[((1592)>>2)]=$tbase_245_i;
     }
     var $968=(($tbase_245_i+$tsize_244_i)|0);
     var $sp_160_i=2024;
     while(1) {
      var $sp_160_i;
      var $970=(($sp_160_i)|0);
      var $971=HEAP32[(($970)>>2)];
      var $972=($971|0)==($968|0);
      if ($972) {
       label = 223;
       break;
      }
      var $974=(($sp_160_i+8)|0);
      var $975=HEAP32[(($974)>>2)];
      var $976=($975|0)==0;
      if ($976) {
       break;
      } else {
       var $sp_160_i=$975;
      }
     }
     do {
      if (label == 223) {
       var $977=(($sp_160_i+12)|0);
       var $978=HEAP32[(($977)>>2)];
       var $979=$978&8;
       var $980=($979|0)==0;
       if (!($980)) {
        break;
       }
       HEAP32[(($970)>>2)]=$tbase_245_i;
       var $982=(($sp_160_i+4)|0);
       var $983=HEAP32[(($982)>>2)];
       var $984=((($983)+($tsize_244_i))|0);
       HEAP32[(($982)>>2)]=$984;
       var $985=(($tbase_245_i+8)|0);
       var $986=$985;
       var $987=$986&7;
       var $988=($987|0)==0;
       if ($988) {
        var $993=0;
       } else {
        var $990=(((-$986))|0);
        var $991=$990&7;
        var $993=$991;
       }
       var $993;
       var $994=(($tbase_245_i+$993)|0);
       var $_sum93_i=((($tsize_244_i)+(8))|0);
       var $995=(($tbase_245_i+$_sum93_i)|0);
       var $996=$995;
       var $997=$996&7;
       var $998=($997|0)==0;
       if ($998) {
        var $1003=0;
       } else {
        var $1000=(((-$996))|0);
        var $1001=$1000&7;
        var $1003=$1001;
       }
       var $1003;
       var $_sum94_i=((($1003)+($tsize_244_i))|0);
       var $1004=(($tbase_245_i+$_sum94_i)|0);
       var $1005=$1004;
       var $1006=$1004;
       var $1007=$994;
       var $1008=((($1006)-($1007))|0);
       var $_sum_i21_i=((($993)+($nb_0))|0);
       var $1009=(($tbase_245_i+$_sum_i21_i)|0);
       var $1010=$1009;
       var $1011=((($1008)-($nb_0))|0);
       var $1012=$nb_0|3;
       var $_sum1_i22_i=((($993)+(4))|0);
       var $1013=(($tbase_245_i+$_sum1_i22_i)|0);
       var $1014=$1013;
       HEAP32[(($1014)>>2)]=$1012;
       var $1015=HEAP32[((1600)>>2)];
       var $1016=($1005|0)==($1015|0);
       do {
        if ($1016) {
         var $1018=HEAP32[((1588)>>2)];
         var $1019=((($1018)+($1011))|0);
         HEAP32[((1588)>>2)]=$1019;
         HEAP32[((1600)>>2)]=$1010;
         var $1020=$1019|1;
         var $_sum46_i_i=((($_sum_i21_i)+(4))|0);
         var $1021=(($tbase_245_i+$_sum46_i_i)|0);
         var $1022=$1021;
         HEAP32[(($1022)>>2)]=$1020;
        } else {
         var $1024=HEAP32[((1596)>>2)];
         var $1025=($1005|0)==($1024|0);
         if ($1025) {
          var $1027=HEAP32[((1584)>>2)];
          var $1028=((($1027)+($1011))|0);
          HEAP32[((1584)>>2)]=$1028;
          HEAP32[((1596)>>2)]=$1010;
          var $1029=$1028|1;
          var $_sum44_i_i=((($_sum_i21_i)+(4))|0);
          var $1030=(($tbase_245_i+$_sum44_i_i)|0);
          var $1031=$1030;
          HEAP32[(($1031)>>2)]=$1029;
          var $_sum45_i_i=((($1028)+($_sum_i21_i))|0);
          var $1032=(($tbase_245_i+$_sum45_i_i)|0);
          var $1033=$1032;
          HEAP32[(($1033)>>2)]=$1028;
          break;
         }
         var $_sum2_i23_i=((($tsize_244_i)+(4))|0);
         var $_sum95_i=((($_sum2_i23_i)+($1003))|0);
         var $1035=(($tbase_245_i+$_sum95_i)|0);
         var $1036=$1035;
         var $1037=HEAP32[(($1036)>>2)];
         var $1038=$1037&3;
         var $1039=($1038|0)==1;
         if ($1039) {
          var $1041=$1037&-8;
          var $1042=$1037>>>3;
          var $1043=($1037>>>0)<256;
          L355: do {
           if ($1043) {
            var $_sum3940_i_i=$1003|8;
            var $_sum105_i=((($_sum3940_i_i)+($tsize_244_i))|0);
            var $1045=(($tbase_245_i+$_sum105_i)|0);
            var $1046=$1045;
            var $1047=HEAP32[(($1046)>>2)];
            var $_sum41_i_i=((($tsize_244_i)+(12))|0);
            var $_sum106_i=((($_sum41_i_i)+($1003))|0);
            var $1048=(($tbase_245_i+$_sum106_i)|0);
            var $1049=$1048;
            var $1050=HEAP32[(($1049)>>2)];
            var $1051=$1042<<1;
            var $1052=((1616+($1051<<2))|0);
            var $1053=$1052;
            var $1054=($1047|0)==($1053|0);
            do {
             if (!($1054)) {
              var $1056=$1047;
              var $1057=HEAP32[((1592)>>2)];
              var $1058=($1056>>>0)<($1057>>>0);
              if ($1058) {
               _abort();
               throw "Reached an unreachable!";
              }
              var $1060=(($1047+12)|0);
              var $1061=HEAP32[(($1060)>>2)];
              var $1062=($1061|0)==($1005|0);
              if ($1062) {
               break;
              }
              _abort();
              throw "Reached an unreachable!";
             }
            } while(0);
            var $1063=($1050|0)==($1047|0);
            if ($1063) {
             var $1065=1<<$1042;
             var $1066=$1065^-1;
             var $1067=HEAP32[((1576)>>2)];
             var $1068=$1067&$1066;
             HEAP32[((1576)>>2)]=$1068;
             break;
            }
            var $1070=($1050|0)==($1053|0);
            do {
             if ($1070) {
              var $_pre56_i_i=(($1050+8)|0);
              var $_pre_phi57_i_i=$_pre56_i_i;
             } else {
              var $1072=$1050;
              var $1073=HEAP32[((1592)>>2)];
              var $1074=($1072>>>0)<($1073>>>0);
              if ($1074) {
               _abort();
               throw "Reached an unreachable!";
              }
              var $1076=(($1050+8)|0);
              var $1077=HEAP32[(($1076)>>2)];
              var $1078=($1077|0)==($1005|0);
              if ($1078) {
               var $_pre_phi57_i_i=$1076;
               break;
              }
              _abort();
              throw "Reached an unreachable!";
             }
            } while(0);
            var $_pre_phi57_i_i;
            var $1079=(($1047+12)|0);
            HEAP32[(($1079)>>2)]=$1050;
            HEAP32[(($_pre_phi57_i_i)>>2)]=$1047;
           } else {
            var $1081=$1004;
            var $_sum34_i_i=$1003|24;
            var $_sum96_i=((($_sum34_i_i)+($tsize_244_i))|0);
            var $1082=(($tbase_245_i+$_sum96_i)|0);
            var $1083=$1082;
            var $1084=HEAP32[(($1083)>>2)];
            var $_sum5_i_i=((($tsize_244_i)+(12))|0);
            var $_sum97_i=((($_sum5_i_i)+($1003))|0);
            var $1085=(($tbase_245_i+$_sum97_i)|0);
            var $1086=$1085;
            var $1087=HEAP32[(($1086)>>2)];
            var $1088=($1087|0)==($1081|0);
            do {
             if ($1088) {
              var $_sum67_i_i=$1003|16;
              var $_sum103_i=((($_sum2_i23_i)+($_sum67_i_i))|0);
              var $1106=(($tbase_245_i+$_sum103_i)|0);
              var $1107=$1106;
              var $1108=HEAP32[(($1107)>>2)];
              var $1109=($1108|0)==0;
              if ($1109) {
               var $_sum104_i=((($_sum67_i_i)+($tsize_244_i))|0);
               var $1111=(($tbase_245_i+$_sum104_i)|0);
               var $1112=$1111;
               var $1113=HEAP32[(($1112)>>2)];
               var $1114=($1113|0)==0;
               if ($1114) {
                var $R_1_i_i=0;
                break;
               } else {
                var $R_0_i_i=$1113;var $RP_0_i_i=$1112;
               }
              } else {
               var $R_0_i_i=$1108;var $RP_0_i_i=$1107;
              }
              while(1) {
               var $RP_0_i_i;
               var $R_0_i_i;
               var $1115=(($R_0_i_i+20)|0);
               var $1116=HEAP32[(($1115)>>2)];
               var $1117=($1116|0)==0;
               if (!($1117)) {
                var $R_0_i_i=$1116;var $RP_0_i_i=$1115;
                continue;
               }
               var $1119=(($R_0_i_i+16)|0);
               var $1120=HEAP32[(($1119)>>2)];
               var $1121=($1120|0)==0;
               if ($1121) {
                break;
               } else {
                var $R_0_i_i=$1120;var $RP_0_i_i=$1119;
               }
              }
              var $1123=$RP_0_i_i;
              var $1124=HEAP32[((1592)>>2)];
              var $1125=($1123>>>0)<($1124>>>0);
              if ($1125) {
               _abort();
               throw "Reached an unreachable!";
              } else {
               HEAP32[(($RP_0_i_i)>>2)]=0;
               var $R_1_i_i=$R_0_i_i;
               break;
              }
             } else {
              var $_sum3637_i_i=$1003|8;
              var $_sum98_i=((($_sum3637_i_i)+($tsize_244_i))|0);
              var $1090=(($tbase_245_i+$_sum98_i)|0);
              var $1091=$1090;
              var $1092=HEAP32[(($1091)>>2)];
              var $1093=$1092;
              var $1094=HEAP32[((1592)>>2)];
              var $1095=($1093>>>0)<($1094>>>0);
              if ($1095) {
               _abort();
               throw "Reached an unreachable!";
              }
              var $1097=(($1092+12)|0);
              var $1098=HEAP32[(($1097)>>2)];
              var $1099=($1098|0)==($1081|0);
              if (!($1099)) {
               _abort();
               throw "Reached an unreachable!";
              }
              var $1101=(($1087+8)|0);
              var $1102=HEAP32[(($1101)>>2)];
              var $1103=($1102|0)==($1081|0);
              if ($1103) {
               HEAP32[(($1097)>>2)]=$1087;
               HEAP32[(($1101)>>2)]=$1092;
               var $R_1_i_i=$1087;
               break;
              } else {
               _abort();
               throw "Reached an unreachable!";
              }
             }
            } while(0);
            var $R_1_i_i;
            var $1129=($1084|0)==0;
            if ($1129) {
             break;
            }
            var $_sum31_i_i=((($tsize_244_i)+(28))|0);
            var $_sum99_i=((($_sum31_i_i)+($1003))|0);
            var $1131=(($tbase_245_i+$_sum99_i)|0);
            var $1132=$1131;
            var $1133=HEAP32[(($1132)>>2)];
            var $1134=((1880+($1133<<2))|0);
            var $1135=HEAP32[(($1134)>>2)];
            var $1136=($1081|0)==($1135|0);
            do {
             if ($1136) {
              HEAP32[(($1134)>>2)]=$R_1_i_i;
              var $cond_i_i=($R_1_i_i|0)==0;
              if (!($cond_i_i)) {
               break;
              }
              var $1138=HEAP32[(($1132)>>2)];
              var $1139=1<<$1138;
              var $1140=$1139^-1;
              var $1141=HEAP32[((1580)>>2)];
              var $1142=$1141&$1140;
              HEAP32[((1580)>>2)]=$1142;
              break L355;
             } else {
              var $1144=$1084;
              var $1145=HEAP32[((1592)>>2)];
              var $1146=($1144>>>0)<($1145>>>0);
              if ($1146) {
               _abort();
               throw "Reached an unreachable!";
              }
              var $1148=(($1084+16)|0);
              var $1149=HEAP32[(($1148)>>2)];
              var $1150=($1149|0)==($1081|0);
              if ($1150) {
               HEAP32[(($1148)>>2)]=$R_1_i_i;
              } else {
               var $1153=(($1084+20)|0);
               HEAP32[(($1153)>>2)]=$R_1_i_i;
              }
              var $1156=($R_1_i_i|0)==0;
              if ($1156) {
               break L355;
              }
             }
            } while(0);
            var $1158=$R_1_i_i;
            var $1159=HEAP32[((1592)>>2)];
            var $1160=($1158>>>0)<($1159>>>0);
            if ($1160) {
             _abort();
             throw "Reached an unreachable!";
            }
            var $1162=(($R_1_i_i+24)|0);
            HEAP32[(($1162)>>2)]=$1084;
            var $_sum3233_i_i=$1003|16;
            var $_sum100_i=((($_sum3233_i_i)+($tsize_244_i))|0);
            var $1163=(($tbase_245_i+$_sum100_i)|0);
            var $1164=$1163;
            var $1165=HEAP32[(($1164)>>2)];
            var $1166=($1165|0)==0;
            do {
             if (!($1166)) {
              var $1168=$1165;
              var $1169=HEAP32[((1592)>>2)];
              var $1170=($1168>>>0)<($1169>>>0);
              if ($1170) {
               _abort();
               throw "Reached an unreachable!";
              } else {
               var $1172=(($R_1_i_i+16)|0);
               HEAP32[(($1172)>>2)]=$1165;
               var $1173=(($1165+24)|0);
               HEAP32[(($1173)>>2)]=$R_1_i_i;
               break;
              }
             }
            } while(0);
            var $_sum101_i=((($_sum2_i23_i)+($_sum3233_i_i))|0);
            var $1176=(($tbase_245_i+$_sum101_i)|0);
            var $1177=$1176;
            var $1178=HEAP32[(($1177)>>2)];
            var $1179=($1178|0)==0;
            if ($1179) {
             break;
            }
            var $1181=$1178;
            var $1182=HEAP32[((1592)>>2)];
            var $1183=($1181>>>0)<($1182>>>0);
            if ($1183) {
             _abort();
             throw "Reached an unreachable!";
            } else {
             var $1185=(($R_1_i_i+20)|0);
             HEAP32[(($1185)>>2)]=$1178;
             var $1186=(($1178+24)|0);
             HEAP32[(($1186)>>2)]=$R_1_i_i;
             break;
            }
           }
          } while(0);
          var $_sum9_i_i=$1041|$1003;
          var $_sum102_i=((($_sum9_i_i)+($tsize_244_i))|0);
          var $1190=(($tbase_245_i+$_sum102_i)|0);
          var $1191=$1190;
          var $1192=((($1041)+($1011))|0);
          var $oldfirst_0_i_i=$1191;var $qsize_0_i_i=$1192;
         } else {
          var $oldfirst_0_i_i=$1005;var $qsize_0_i_i=$1011;
         }
         var $qsize_0_i_i;
         var $oldfirst_0_i_i;
         var $1194=(($oldfirst_0_i_i+4)|0);
         var $1195=HEAP32[(($1194)>>2)];
         var $1196=$1195&-2;
         HEAP32[(($1194)>>2)]=$1196;
         var $1197=$qsize_0_i_i|1;
         var $_sum10_i_i=((($_sum_i21_i)+(4))|0);
         var $1198=(($tbase_245_i+$_sum10_i_i)|0);
         var $1199=$1198;
         HEAP32[(($1199)>>2)]=$1197;
         var $_sum11_i_i=((($qsize_0_i_i)+($_sum_i21_i))|0);
         var $1200=(($tbase_245_i+$_sum11_i_i)|0);
         var $1201=$1200;
         HEAP32[(($1201)>>2)]=$qsize_0_i_i;
         var $1202=$qsize_0_i_i>>>3;
         var $1203=($qsize_0_i_i>>>0)<256;
         if ($1203) {
          var $1205=$1202<<1;
          var $1206=((1616+($1205<<2))|0);
          var $1207=$1206;
          var $1208=HEAP32[((1576)>>2)];
          var $1209=1<<$1202;
          var $1210=$1208&$1209;
          var $1211=($1210|0)==0;
          do {
           if ($1211) {
            var $1213=$1208|$1209;
            HEAP32[((1576)>>2)]=$1213;
            var $_sum27_pre_i_i=((($1205)+(2))|0);
            var $_pre_i24_i=((1616+($_sum27_pre_i_i<<2))|0);
            var $F4_0_i_i=$1207;var $_pre_phi_i25_i=$_pre_i24_i;
           } else {
            var $_sum30_i_i=((($1205)+(2))|0);
            var $1215=((1616+($_sum30_i_i<<2))|0);
            var $1216=HEAP32[(($1215)>>2)];
            var $1217=$1216;
            var $1218=HEAP32[((1592)>>2)];
            var $1219=($1217>>>0)<($1218>>>0);
            if (!($1219)) {
             var $F4_0_i_i=$1216;var $_pre_phi_i25_i=$1215;
             break;
            }
            _abort();
            throw "Reached an unreachable!";
           }
          } while(0);
          var $_pre_phi_i25_i;
          var $F4_0_i_i;
          HEAP32[(($_pre_phi_i25_i)>>2)]=$1010;
          var $1222=(($F4_0_i_i+12)|0);
          HEAP32[(($1222)>>2)]=$1010;
          var $_sum28_i_i=((($_sum_i21_i)+(8))|0);
          var $1223=(($tbase_245_i+$_sum28_i_i)|0);
          var $1224=$1223;
          HEAP32[(($1224)>>2)]=$F4_0_i_i;
          var $_sum29_i_i=((($_sum_i21_i)+(12))|0);
          var $1225=(($tbase_245_i+$_sum29_i_i)|0);
          var $1226=$1225;
          HEAP32[(($1226)>>2)]=$1207;
          break;
         }
         var $1228=$1009;
         var $1229=$qsize_0_i_i>>>8;
         var $1230=($1229|0)==0;
         do {
          if ($1230) {
           var $I7_0_i_i=0;
          } else {
           var $1232=($qsize_0_i_i>>>0)>16777215;
           if ($1232) {
            var $I7_0_i_i=31;
            break;
           }
           var $1234=((($1229)+(1048320))|0);
           var $1235=$1234>>>16;
           var $1236=$1235&8;
           var $1237=$1229<<$1236;
           var $1238=((($1237)+(520192))|0);
           var $1239=$1238>>>16;
           var $1240=$1239&4;
           var $1241=$1240|$1236;
           var $1242=$1237<<$1240;
           var $1243=((($1242)+(245760))|0);
           var $1244=$1243>>>16;
           var $1245=$1244&2;
           var $1246=$1241|$1245;
           var $1247=(((14)-($1246))|0);
           var $1248=$1242<<$1245;
           var $1249=$1248>>>15;
           var $1250=((($1247)+($1249))|0);
           var $1251=$1250<<1;
           var $1252=((($1250)+(7))|0);
           var $1253=$qsize_0_i_i>>>($1252>>>0);
           var $1254=$1253&1;
           var $1255=$1254|$1251;
           var $I7_0_i_i=$1255;
          }
         } while(0);
         var $I7_0_i_i;
         var $1257=((1880+($I7_0_i_i<<2))|0);
         var $_sum12_i26_i=((($_sum_i21_i)+(28))|0);
         var $1258=(($tbase_245_i+$_sum12_i26_i)|0);
         var $1259=$1258;
         HEAP32[(($1259)>>2)]=$I7_0_i_i;
         var $_sum13_i_i=((($_sum_i21_i)+(16))|0);
         var $1260=(($tbase_245_i+$_sum13_i_i)|0);
         var $_sum14_i_i=((($_sum_i21_i)+(20))|0);
         var $1261=(($tbase_245_i+$_sum14_i_i)|0);
         var $1262=$1261;
         HEAP32[(($1262)>>2)]=0;
         var $1263=$1260;
         HEAP32[(($1263)>>2)]=0;
         var $1264=HEAP32[((1580)>>2)];
         var $1265=1<<$I7_0_i_i;
         var $1266=$1264&$1265;
         var $1267=($1266|0)==0;
         if ($1267) {
          var $1269=$1264|$1265;
          HEAP32[((1580)>>2)]=$1269;
          HEAP32[(($1257)>>2)]=$1228;
          var $1270=$1257;
          var $_sum15_i_i=((($_sum_i21_i)+(24))|0);
          var $1271=(($tbase_245_i+$_sum15_i_i)|0);
          var $1272=$1271;
          HEAP32[(($1272)>>2)]=$1270;
          var $_sum16_i_i=((($_sum_i21_i)+(12))|0);
          var $1273=(($tbase_245_i+$_sum16_i_i)|0);
          var $1274=$1273;
          HEAP32[(($1274)>>2)]=$1228;
          var $_sum17_i_i=((($_sum_i21_i)+(8))|0);
          var $1275=(($tbase_245_i+$_sum17_i_i)|0);
          var $1276=$1275;
          HEAP32[(($1276)>>2)]=$1228;
          break;
         }
         var $1278=HEAP32[(($1257)>>2)];
         var $1279=($I7_0_i_i|0)==31;
         if ($1279) {
          var $1284=0;
         } else {
          var $1281=$I7_0_i_i>>>1;
          var $1282=(((25)-($1281))|0);
          var $1284=$1282;
         }
         var $1284;
         var $1285=$qsize_0_i_i<<$1284;
         var $K8_0_i_i=$1285;var $T_0_i27_i=$1278;
         while(1) {
          var $T_0_i27_i;
          var $K8_0_i_i;
          var $1287=(($T_0_i27_i+4)|0);
          var $1288=HEAP32[(($1287)>>2)];
          var $1289=$1288&-8;
          var $1290=($1289|0)==($qsize_0_i_i|0);
          if ($1290) {
           break;
          }
          var $1292=$K8_0_i_i>>>31;
          var $1293=(($T_0_i27_i+16+($1292<<2))|0);
          var $1294=HEAP32[(($1293)>>2)];
          var $1295=($1294|0)==0;
          var $1296=$K8_0_i_i<<1;
          if ($1295) {
           label = 296;
           break;
          } else {
           var $K8_0_i_i=$1296;var $T_0_i27_i=$1294;
          }
         }
         if (label == 296) {
          var $1298=$1293;
          var $1299=HEAP32[((1592)>>2)];
          var $1300=($1298>>>0)<($1299>>>0);
          if ($1300) {
           _abort();
           throw "Reached an unreachable!";
          } else {
           HEAP32[(($1293)>>2)]=$1228;
           var $_sum24_i_i=((($_sum_i21_i)+(24))|0);
           var $1302=(($tbase_245_i+$_sum24_i_i)|0);
           var $1303=$1302;
           HEAP32[(($1303)>>2)]=$T_0_i27_i;
           var $_sum25_i_i=((($_sum_i21_i)+(12))|0);
           var $1304=(($tbase_245_i+$_sum25_i_i)|0);
           var $1305=$1304;
           HEAP32[(($1305)>>2)]=$1228;
           var $_sum26_i_i=((($_sum_i21_i)+(8))|0);
           var $1306=(($tbase_245_i+$_sum26_i_i)|0);
           var $1307=$1306;
           HEAP32[(($1307)>>2)]=$1228;
           break;
          }
         }
         var $1310=(($T_0_i27_i+8)|0);
         var $1311=HEAP32[(($1310)>>2)];
         var $1312=$T_0_i27_i;
         var $1313=HEAP32[((1592)>>2)];
         var $1314=($1312>>>0)<($1313>>>0);
         if ($1314) {
          _abort();
          throw "Reached an unreachable!";
         }
         var $1316=$1311;
         var $1317=($1316>>>0)<($1313>>>0);
         if ($1317) {
          _abort();
          throw "Reached an unreachable!";
         } else {
          var $1319=(($1311+12)|0);
          HEAP32[(($1319)>>2)]=$1228;
          HEAP32[(($1310)>>2)]=$1228;
          var $_sum21_i_i=((($_sum_i21_i)+(8))|0);
          var $1320=(($tbase_245_i+$_sum21_i_i)|0);
          var $1321=$1320;
          HEAP32[(($1321)>>2)]=$1311;
          var $_sum22_i_i=((($_sum_i21_i)+(12))|0);
          var $1322=(($tbase_245_i+$_sum22_i_i)|0);
          var $1323=$1322;
          HEAP32[(($1323)>>2)]=$T_0_i27_i;
          var $_sum23_i_i=((($_sum_i21_i)+(24))|0);
          var $1324=(($tbase_245_i+$_sum23_i_i)|0);
          var $1325=$1324;
          HEAP32[(($1325)>>2)]=0;
          break;
         }
        }
       } while(0);
       var $_sum1819_i_i=$993|8;
       var $1326=(($tbase_245_i+$_sum1819_i_i)|0);
       var $mem_0=$1326;
       var $mem_0;
       return $mem_0;
      }
     } while(0);
     var $1327=$890;
     var $sp_0_i_i_i=2024;
     while(1) {
      var $sp_0_i_i_i;
      var $1329=(($sp_0_i_i_i)|0);
      var $1330=HEAP32[(($1329)>>2)];
      var $1331=($1330>>>0)>($1327>>>0);
      if (!($1331)) {
       var $1333=(($sp_0_i_i_i+4)|0);
       var $1334=HEAP32[(($1333)>>2)];
       var $1335=(($1330+$1334)|0);
       var $1336=($1335>>>0)>($1327>>>0);
       if ($1336) {
        break;
       }
      }
      var $1338=(($sp_0_i_i_i+8)|0);
      var $1339=HEAP32[(($1338)>>2)];
      var $sp_0_i_i_i=$1339;
     }
     var $_sum_i15_i=((($1334)-(47))|0);
     var $_sum1_i16_i=((($1334)-(39))|0);
     var $1340=(($1330+$_sum1_i16_i)|0);
     var $1341=$1340;
     var $1342=$1341&7;
     var $1343=($1342|0)==0;
     if ($1343) {
      var $1348=0;
     } else {
      var $1345=(((-$1341))|0);
      var $1346=$1345&7;
      var $1348=$1346;
     }
     var $1348;
     var $_sum2_i17_i=((($_sum_i15_i)+($1348))|0);
     var $1349=(($1330+$_sum2_i17_i)|0);
     var $1350=(($890+16)|0);
     var $1351=$1350;
     var $1352=($1349>>>0)<($1351>>>0);
     var $1353=($1352?$1327:$1349);
     var $1354=(($1353+8)|0);
     var $1355=$1354;
     var $1356=((($tsize_244_i)-(40))|0);
     var $1357=(($tbase_245_i+8)|0);
     var $1358=$1357;
     var $1359=$1358&7;
     var $1360=($1359|0)==0;
     if ($1360) {
      var $1364=0;
     } else {
      var $1362=(((-$1358))|0);
      var $1363=$1362&7;
      var $1364=$1363;
     }
     var $1364;
     var $1365=(($tbase_245_i+$1364)|0);
     var $1366=$1365;
     var $1367=((($1356)-($1364))|0);
     HEAP32[((1600)>>2)]=$1366;
     HEAP32[((1588)>>2)]=$1367;
     var $1368=$1367|1;
     var $_sum_i_i_i=((($1364)+(4))|0);
     var $1369=(($tbase_245_i+$_sum_i_i_i)|0);
     var $1370=$1369;
     HEAP32[(($1370)>>2)]=$1368;
     var $_sum2_i_i_i=((($tsize_244_i)-(36))|0);
     var $1371=(($tbase_245_i+$_sum2_i_i_i)|0);
     var $1372=$1371;
     HEAP32[(($1372)>>2)]=40;
     var $1373=HEAP32[((1536)>>2)];
     HEAP32[((1604)>>2)]=$1373;
     var $1374=(($1353+4)|0);
     var $1375=$1374;
     HEAP32[(($1375)>>2)]=27;
     assert(16 % 1 === 0);HEAP32[(($1354)>>2)]=HEAP32[((2024)>>2)];HEAP32[((($1354)+(4))>>2)]=HEAP32[((2028)>>2)];HEAP32[((($1354)+(8))>>2)]=HEAP32[((2032)>>2)];HEAP32[((($1354)+(12))>>2)]=HEAP32[((2036)>>2)];
     HEAP32[((2024)>>2)]=$tbase_245_i;
     HEAP32[((2028)>>2)]=$tsize_244_i;
     HEAP32[((2036)>>2)]=0;
     HEAP32[((2032)>>2)]=$1355;
     var $1376=(($1353+28)|0);
     var $1377=$1376;
     HEAP32[(($1377)>>2)]=7;
     var $1378=(($1353+32)|0);
     var $1379=($1378>>>0)<($1335>>>0);
     if ($1379) {
      var $1380=$1377;
      while(1) {
       var $1380;
       var $1381=(($1380+4)|0);
       HEAP32[(($1381)>>2)]=7;
       var $1382=(($1380+8)|0);
       var $1383=$1382;
       var $1384=($1383>>>0)<($1335>>>0);
       if ($1384) {
        var $1380=$1381;
       } else {
        break;
       }
      }
     }
     var $1385=($1353|0)==($1327|0);
     if ($1385) {
      break;
     }
     var $1387=$1353;
     var $1388=$890;
     var $1389=((($1387)-($1388))|0);
     var $1390=(($1327+$1389)|0);
     var $_sum3_i_i=((($1389)+(4))|0);
     var $1391=(($1327+$_sum3_i_i)|0);
     var $1392=$1391;
     var $1393=HEAP32[(($1392)>>2)];
     var $1394=$1393&-2;
     HEAP32[(($1392)>>2)]=$1394;
     var $1395=$1389|1;
     var $1396=(($890+4)|0);
     HEAP32[(($1396)>>2)]=$1395;
     var $1397=$1390;
     HEAP32[(($1397)>>2)]=$1389;
     var $1398=$1389>>>3;
     var $1399=($1389>>>0)<256;
     if ($1399) {
      var $1401=$1398<<1;
      var $1402=((1616+($1401<<2))|0);
      var $1403=$1402;
      var $1404=HEAP32[((1576)>>2)];
      var $1405=1<<$1398;
      var $1406=$1404&$1405;
      var $1407=($1406|0)==0;
      do {
       if ($1407) {
        var $1409=$1404|$1405;
        HEAP32[((1576)>>2)]=$1409;
        var $_sum11_pre_i_i=((($1401)+(2))|0);
        var $_pre_i_i=((1616+($_sum11_pre_i_i<<2))|0);
        var $F_0_i_i=$1403;var $_pre_phi_i_i=$_pre_i_i;
       } else {
        var $_sum12_i_i=((($1401)+(2))|0);
        var $1411=((1616+($_sum12_i_i<<2))|0);
        var $1412=HEAP32[(($1411)>>2)];
        var $1413=$1412;
        var $1414=HEAP32[((1592)>>2)];
        var $1415=($1413>>>0)<($1414>>>0);
        if (!($1415)) {
         var $F_0_i_i=$1412;var $_pre_phi_i_i=$1411;
         break;
        }
        _abort();
        throw "Reached an unreachable!";
       }
      } while(0);
      var $_pre_phi_i_i;
      var $F_0_i_i;
      HEAP32[(($_pre_phi_i_i)>>2)]=$890;
      var $1418=(($F_0_i_i+12)|0);
      HEAP32[(($1418)>>2)]=$890;
      var $1419=(($890+8)|0);
      HEAP32[(($1419)>>2)]=$F_0_i_i;
      var $1420=(($890+12)|0);
      HEAP32[(($1420)>>2)]=$1403;
      break;
     }
     var $1422=$890;
     var $1423=$1389>>>8;
     var $1424=($1423|0)==0;
     do {
      if ($1424) {
       var $I1_0_i_i=0;
      } else {
       var $1426=($1389>>>0)>16777215;
       if ($1426) {
        var $I1_0_i_i=31;
        break;
       }
       var $1428=((($1423)+(1048320))|0);
       var $1429=$1428>>>16;
       var $1430=$1429&8;
       var $1431=$1423<<$1430;
       var $1432=((($1431)+(520192))|0);
       var $1433=$1432>>>16;
       var $1434=$1433&4;
       var $1435=$1434|$1430;
       var $1436=$1431<<$1434;
       var $1437=((($1436)+(245760))|0);
       var $1438=$1437>>>16;
       var $1439=$1438&2;
       var $1440=$1435|$1439;
       var $1441=(((14)-($1440))|0);
       var $1442=$1436<<$1439;
       var $1443=$1442>>>15;
       var $1444=((($1441)+($1443))|0);
       var $1445=$1444<<1;
       var $1446=((($1444)+(7))|0);
       var $1447=$1389>>>($1446>>>0);
       var $1448=$1447&1;
       var $1449=$1448|$1445;
       var $I1_0_i_i=$1449;
      }
     } while(0);
     var $I1_0_i_i;
     var $1451=((1880+($I1_0_i_i<<2))|0);
     var $1452=(($890+28)|0);
     var $I1_0_c_i_i=$I1_0_i_i;
     HEAP32[(($1452)>>2)]=$I1_0_c_i_i;
     var $1453=(($890+20)|0);
     HEAP32[(($1453)>>2)]=0;
     var $1454=(($890+16)|0);
     HEAP32[(($1454)>>2)]=0;
     var $1455=HEAP32[((1580)>>2)];
     var $1456=1<<$I1_0_i_i;
     var $1457=$1455&$1456;
     var $1458=($1457|0)==0;
     if ($1458) {
      var $1460=$1455|$1456;
      HEAP32[((1580)>>2)]=$1460;
      HEAP32[(($1451)>>2)]=$1422;
      var $1461=(($890+24)|0);
      var $_c_i_i=$1451;
      HEAP32[(($1461)>>2)]=$_c_i_i;
      var $1462=(($890+12)|0);
      HEAP32[(($1462)>>2)]=$890;
      var $1463=(($890+8)|0);
      HEAP32[(($1463)>>2)]=$890;
      break;
     }
     var $1465=HEAP32[(($1451)>>2)];
     var $1466=($I1_0_i_i|0)==31;
     if ($1466) {
      var $1471=0;
     } else {
      var $1468=$I1_0_i_i>>>1;
      var $1469=(((25)-($1468))|0);
      var $1471=$1469;
     }
     var $1471;
     var $1472=$1389<<$1471;
     var $K2_0_i_i=$1472;var $T_0_i_i=$1465;
     while(1) {
      var $T_0_i_i;
      var $K2_0_i_i;
      var $1474=(($T_0_i_i+4)|0);
      var $1475=HEAP32[(($1474)>>2)];
      var $1476=$1475&-8;
      var $1477=($1476|0)==($1389|0);
      if ($1477) {
       break;
      }
      var $1479=$K2_0_i_i>>>31;
      var $1480=(($T_0_i_i+16+($1479<<2))|0);
      var $1481=HEAP32[(($1480)>>2)];
      var $1482=($1481|0)==0;
      var $1483=$K2_0_i_i<<1;
      if ($1482) {
       label = 331;
       break;
      } else {
       var $K2_0_i_i=$1483;var $T_0_i_i=$1481;
      }
     }
     if (label == 331) {
      var $1485=$1480;
      var $1486=HEAP32[((1592)>>2)];
      var $1487=($1485>>>0)<($1486>>>0);
      if ($1487) {
       _abort();
       throw "Reached an unreachable!";
      } else {
       HEAP32[(($1480)>>2)]=$1422;
       var $1489=(($890+24)|0);
       var $T_0_c8_i_i=$T_0_i_i;
       HEAP32[(($1489)>>2)]=$T_0_c8_i_i;
       var $1490=(($890+12)|0);
       HEAP32[(($1490)>>2)]=$890;
       var $1491=(($890+8)|0);
       HEAP32[(($1491)>>2)]=$890;
       break;
      }
     }
     var $1494=(($T_0_i_i+8)|0);
     var $1495=HEAP32[(($1494)>>2)];
     var $1496=$T_0_i_i;
     var $1497=HEAP32[((1592)>>2)];
     var $1498=($1496>>>0)<($1497>>>0);
     if ($1498) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $1500=$1495;
     var $1501=($1500>>>0)<($1497>>>0);
     if ($1501) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      var $1503=(($1495+12)|0);
      HEAP32[(($1503)>>2)]=$1422;
      HEAP32[(($1494)>>2)]=$1422;
      var $1504=(($890+8)|0);
      var $_c7_i_i=$1495;
      HEAP32[(($1504)>>2)]=$_c7_i_i;
      var $1505=(($890+12)|0);
      var $T_0_c_i_i=$T_0_i_i;
      HEAP32[(($1505)>>2)]=$T_0_c_i_i;
      var $1506=(($890+24)|0);
      HEAP32[(($1506)>>2)]=0;
      break;
     }
    }
   } while(0);
   var $1507=HEAP32[((1588)>>2)];
   var $1508=($1507>>>0)>($nb_0>>>0);
   if (!($1508)) {
    break;
   }
   var $1510=((($1507)-($nb_0))|0);
   HEAP32[((1588)>>2)]=$1510;
   var $1511=HEAP32[((1600)>>2)];
   var $1512=$1511;
   var $1513=(($1512+$nb_0)|0);
   var $1514=$1513;
   HEAP32[((1600)>>2)]=$1514;
   var $1515=$1510|1;
   var $_sum_i134=((($nb_0)+(4))|0);
   var $1516=(($1512+$_sum_i134)|0);
   var $1517=$1516;
   HEAP32[(($1517)>>2)]=$1515;
   var $1518=$nb_0|3;
   var $1519=(($1511+4)|0);
   HEAP32[(($1519)>>2)]=$1518;
   var $1520=(($1511+8)|0);
   var $1521=$1520;
   var $mem_0=$1521;
   var $mem_0;
   return $mem_0;
  }
 } while(0);
 var $1522=___errno_location();
 HEAP32[(($1522)>>2)]=12;
 var $mem_0=0;
 var $mem_0;
 return $mem_0;
}
Module["_malloc"] = _malloc;

function _free($mem){
 var label=0;

 var $1=($mem|0)==0;
 if ($1) {
  return;
 }
 var $3=((($mem)-(8))|0);
 var $4=$3;
 var $5=HEAP32[((1592)>>2)];
 var $6=($3>>>0)<($5>>>0);
 if ($6) {
  _abort();
  throw "Reached an unreachable!";
 }
 var $8=((($mem)-(4))|0);
 var $9=$8;
 var $10=HEAP32[(($9)>>2)];
 var $11=$10&3;
 var $12=($11|0)==1;
 if ($12) {
  _abort();
  throw "Reached an unreachable!";
 }
 var $14=$10&-8;
 var $_sum=((($14)-(8))|0);
 var $15=(($mem+$_sum)|0);
 var $16=$15;
 var $17=$10&1;
 var $18=($17|0)==0;
 L10: do {
  if ($18) {
   var $20=$3;
   var $21=HEAP32[(($20)>>2)];
   var $22=($11|0)==0;
   if ($22) {
    return;
   }
   var $_sum232=(((-8)-($21))|0);
   var $24=(($mem+$_sum232)|0);
   var $25=$24;
   var $26=((($21)+($14))|0);
   var $27=($24>>>0)<($5>>>0);
   if ($27) {
    _abort();
    throw "Reached an unreachable!";
   }
   var $29=HEAP32[((1596)>>2)];
   var $30=($25|0)==($29|0);
   if ($30) {
    var $_sum233=((($14)-(4))|0);
    var $176=(($mem+$_sum233)|0);
    var $177=$176;
    var $178=HEAP32[(($177)>>2)];
    var $179=$178&3;
    var $180=($179|0)==3;
    if (!($180)) {
     var $p_0=$25;var $psize_0=$26;
     break;
    }
    HEAP32[((1584)>>2)]=$26;
    var $182=HEAP32[(($177)>>2)];
    var $183=$182&-2;
    HEAP32[(($177)>>2)]=$183;
    var $184=$26|1;
    var $_sum264=((($_sum232)+(4))|0);
    var $185=(($mem+$_sum264)|0);
    var $186=$185;
    HEAP32[(($186)>>2)]=$184;
    var $187=$15;
    HEAP32[(($187)>>2)]=$26;
    return;
   }
   var $32=$21>>>3;
   var $33=($21>>>0)<256;
   if ($33) {
    var $_sum276=((($_sum232)+(8))|0);
    var $35=(($mem+$_sum276)|0);
    var $36=$35;
    var $37=HEAP32[(($36)>>2)];
    var $_sum277=((($_sum232)+(12))|0);
    var $38=(($mem+$_sum277)|0);
    var $39=$38;
    var $40=HEAP32[(($39)>>2)];
    var $41=$32<<1;
    var $42=((1616+($41<<2))|0);
    var $43=$42;
    var $44=($37|0)==($43|0);
    do {
     if (!($44)) {
      var $46=$37;
      var $47=($46>>>0)<($5>>>0);
      if ($47) {
       _abort();
       throw "Reached an unreachable!";
      }
      var $49=(($37+12)|0);
      var $50=HEAP32[(($49)>>2)];
      var $51=($50|0)==($25|0);
      if ($51) {
       break;
      }
      _abort();
      throw "Reached an unreachable!";
     }
    } while(0);
    var $52=($40|0)==($37|0);
    if ($52) {
     var $54=1<<$32;
     var $55=$54^-1;
     var $56=HEAP32[((1576)>>2)];
     var $57=$56&$55;
     HEAP32[((1576)>>2)]=$57;
     var $p_0=$25;var $psize_0=$26;
     break;
    }
    var $59=($40|0)==($43|0);
    do {
     if ($59) {
      var $_pre305=(($40+8)|0);
      var $_pre_phi306=$_pre305;
     } else {
      var $61=$40;
      var $62=($61>>>0)<($5>>>0);
      if ($62) {
       _abort();
       throw "Reached an unreachable!";
      }
      var $64=(($40+8)|0);
      var $65=HEAP32[(($64)>>2)];
      var $66=($65|0)==($25|0);
      if ($66) {
       var $_pre_phi306=$64;
       break;
      }
      _abort();
      throw "Reached an unreachable!";
     }
    } while(0);
    var $_pre_phi306;
    var $67=(($37+12)|0);
    HEAP32[(($67)>>2)]=$40;
    HEAP32[(($_pre_phi306)>>2)]=$37;
    var $p_0=$25;var $psize_0=$26;
    break;
   }
   var $69=$24;
   var $_sum266=((($_sum232)+(24))|0);
   var $70=(($mem+$_sum266)|0);
   var $71=$70;
   var $72=HEAP32[(($71)>>2)];
   var $_sum267=((($_sum232)+(12))|0);
   var $73=(($mem+$_sum267)|0);
   var $74=$73;
   var $75=HEAP32[(($74)>>2)];
   var $76=($75|0)==($69|0);
   do {
    if ($76) {
     var $_sum269=((($_sum232)+(20))|0);
     var $93=(($mem+$_sum269)|0);
     var $94=$93;
     var $95=HEAP32[(($94)>>2)];
     var $96=($95|0)==0;
     if ($96) {
      var $_sum268=((($_sum232)+(16))|0);
      var $98=(($mem+$_sum268)|0);
      var $99=$98;
      var $100=HEAP32[(($99)>>2)];
      var $101=($100|0)==0;
      if ($101) {
       var $R_1=0;
       break;
      } else {
       var $R_0=$100;var $RP_0=$99;
      }
     } else {
      var $R_0=$95;var $RP_0=$94;
     }
     while(1) {
      var $RP_0;
      var $R_0;
      var $102=(($R_0+20)|0);
      var $103=HEAP32[(($102)>>2)];
      var $104=($103|0)==0;
      if (!($104)) {
       var $R_0=$103;var $RP_0=$102;
       continue;
      }
      var $106=(($R_0+16)|0);
      var $107=HEAP32[(($106)>>2)];
      var $108=($107|0)==0;
      if ($108) {
       break;
      } else {
       var $R_0=$107;var $RP_0=$106;
      }
     }
     var $110=$RP_0;
     var $111=($110>>>0)<($5>>>0);
     if ($111) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      HEAP32[(($RP_0)>>2)]=0;
      var $R_1=$R_0;
      break;
     }
    } else {
     var $_sum273=((($_sum232)+(8))|0);
     var $78=(($mem+$_sum273)|0);
     var $79=$78;
     var $80=HEAP32[(($79)>>2)];
     var $81=$80;
     var $82=($81>>>0)<($5>>>0);
     if ($82) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $84=(($80+12)|0);
     var $85=HEAP32[(($84)>>2)];
     var $86=($85|0)==($69|0);
     if (!($86)) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $88=(($75+8)|0);
     var $89=HEAP32[(($88)>>2)];
     var $90=($89|0)==($69|0);
     if ($90) {
      HEAP32[(($84)>>2)]=$75;
      HEAP32[(($88)>>2)]=$80;
      var $R_1=$75;
      break;
     } else {
      _abort();
      throw "Reached an unreachable!";
     }
    }
   } while(0);
   var $R_1;
   var $115=($72|0)==0;
   if ($115) {
    var $p_0=$25;var $psize_0=$26;
    break;
   }
   var $_sum270=((($_sum232)+(28))|0);
   var $117=(($mem+$_sum270)|0);
   var $118=$117;
   var $119=HEAP32[(($118)>>2)];
   var $120=((1880+($119<<2))|0);
   var $121=HEAP32[(($120)>>2)];
   var $122=($69|0)==($121|0);
   do {
    if ($122) {
     HEAP32[(($120)>>2)]=$R_1;
     var $cond=($R_1|0)==0;
     if (!($cond)) {
      break;
     }
     var $124=HEAP32[(($118)>>2)];
     var $125=1<<$124;
     var $126=$125^-1;
     var $127=HEAP32[((1580)>>2)];
     var $128=$127&$126;
     HEAP32[((1580)>>2)]=$128;
     var $p_0=$25;var $psize_0=$26;
     break L10;
    } else {
     var $130=$72;
     var $131=HEAP32[((1592)>>2)];
     var $132=($130>>>0)<($131>>>0);
     if ($132) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $134=(($72+16)|0);
     var $135=HEAP32[(($134)>>2)];
     var $136=($135|0)==($69|0);
     if ($136) {
      HEAP32[(($134)>>2)]=$R_1;
     } else {
      var $139=(($72+20)|0);
      HEAP32[(($139)>>2)]=$R_1;
     }
     var $142=($R_1|0)==0;
     if ($142) {
      var $p_0=$25;var $psize_0=$26;
      break L10;
     }
    }
   } while(0);
   var $144=$R_1;
   var $145=HEAP32[((1592)>>2)];
   var $146=($144>>>0)<($145>>>0);
   if ($146) {
    _abort();
    throw "Reached an unreachable!";
   }
   var $148=(($R_1+24)|0);
   HEAP32[(($148)>>2)]=$72;
   var $_sum271=((($_sum232)+(16))|0);
   var $149=(($mem+$_sum271)|0);
   var $150=$149;
   var $151=HEAP32[(($150)>>2)];
   var $152=($151|0)==0;
   do {
    if (!($152)) {
     var $154=$151;
     var $155=HEAP32[((1592)>>2)];
     var $156=($154>>>0)<($155>>>0);
     if ($156) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      var $158=(($R_1+16)|0);
      HEAP32[(($158)>>2)]=$151;
      var $159=(($151+24)|0);
      HEAP32[(($159)>>2)]=$R_1;
      break;
     }
    }
   } while(0);
   var $_sum272=((($_sum232)+(20))|0);
   var $162=(($mem+$_sum272)|0);
   var $163=$162;
   var $164=HEAP32[(($163)>>2)];
   var $165=($164|0)==0;
   if ($165) {
    var $p_0=$25;var $psize_0=$26;
    break;
   }
   var $167=$164;
   var $168=HEAP32[((1592)>>2)];
   var $169=($167>>>0)<($168>>>0);
   if ($169) {
    _abort();
    throw "Reached an unreachable!";
   } else {
    var $171=(($R_1+20)|0);
    HEAP32[(($171)>>2)]=$164;
    var $172=(($164+24)|0);
    HEAP32[(($172)>>2)]=$R_1;
    var $p_0=$25;var $psize_0=$26;
    break;
   }
  } else {
   var $p_0=$4;var $psize_0=$14;
  }
 } while(0);
 var $psize_0;
 var $p_0;
 var $189=$p_0;
 var $190=($189>>>0)<($15>>>0);
 if (!($190)) {
  _abort();
  throw "Reached an unreachable!";
 }
 var $_sum263=((($14)-(4))|0);
 var $192=(($mem+$_sum263)|0);
 var $193=$192;
 var $194=HEAP32[(($193)>>2)];
 var $195=$194&1;
 var $phitmp=($195|0)==0;
 if ($phitmp) {
  _abort();
  throw "Reached an unreachable!";
 }
 var $197=$194&2;
 var $198=($197|0)==0;
 do {
  if ($198) {
   var $200=HEAP32[((1600)>>2)];
   var $201=($16|0)==($200|0);
   if ($201) {
    var $203=HEAP32[((1588)>>2)];
    var $204=((($203)+($psize_0))|0);
    HEAP32[((1588)>>2)]=$204;
    HEAP32[((1600)>>2)]=$p_0;
    var $205=$204|1;
    var $206=(($p_0+4)|0);
    HEAP32[(($206)>>2)]=$205;
    var $207=HEAP32[((1596)>>2)];
    var $208=($p_0|0)==($207|0);
    if (!($208)) {
     return;
    }
    HEAP32[((1596)>>2)]=0;
    HEAP32[((1584)>>2)]=0;
    return;
   }
   var $211=HEAP32[((1596)>>2)];
   var $212=($16|0)==($211|0);
   if ($212) {
    var $214=HEAP32[((1584)>>2)];
    var $215=((($214)+($psize_0))|0);
    HEAP32[((1584)>>2)]=$215;
    HEAP32[((1596)>>2)]=$p_0;
    var $216=$215|1;
    var $217=(($p_0+4)|0);
    HEAP32[(($217)>>2)]=$216;
    var $218=(($189+$215)|0);
    var $219=$218;
    HEAP32[(($219)>>2)]=$215;
    return;
   }
   var $221=$194&-8;
   var $222=((($221)+($psize_0))|0);
   var $223=$194>>>3;
   var $224=($194>>>0)<256;
   L113: do {
    if ($224) {
     var $226=(($mem+$14)|0);
     var $227=$226;
     var $228=HEAP32[(($227)>>2)];
     var $_sum257258=$14|4;
     var $229=(($mem+$_sum257258)|0);
     var $230=$229;
     var $231=HEAP32[(($230)>>2)];
     var $232=$223<<1;
     var $233=((1616+($232<<2))|0);
     var $234=$233;
     var $235=($228|0)==($234|0);
     do {
      if (!($235)) {
       var $237=$228;
       var $238=HEAP32[((1592)>>2)];
       var $239=($237>>>0)<($238>>>0);
       if ($239) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $241=(($228+12)|0);
       var $242=HEAP32[(($241)>>2)];
       var $243=($242|0)==($16|0);
       if ($243) {
        break;
       }
       _abort();
       throw "Reached an unreachable!";
      }
     } while(0);
     var $244=($231|0)==($228|0);
     if ($244) {
      var $246=1<<$223;
      var $247=$246^-1;
      var $248=HEAP32[((1576)>>2)];
      var $249=$248&$247;
      HEAP32[((1576)>>2)]=$249;
      break;
     }
     var $251=($231|0)==($234|0);
     do {
      if ($251) {
       var $_pre303=(($231+8)|0);
       var $_pre_phi304=$_pre303;
      } else {
       var $253=$231;
       var $254=HEAP32[((1592)>>2)];
       var $255=($253>>>0)<($254>>>0);
       if ($255) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $257=(($231+8)|0);
       var $258=HEAP32[(($257)>>2)];
       var $259=($258|0)==($16|0);
       if ($259) {
        var $_pre_phi304=$257;
        break;
       }
       _abort();
       throw "Reached an unreachable!";
      }
     } while(0);
     var $_pre_phi304;
     var $260=(($228+12)|0);
     HEAP32[(($260)>>2)]=$231;
     HEAP32[(($_pre_phi304)>>2)]=$228;
    } else {
     var $262=$15;
     var $_sum235=((($14)+(16))|0);
     var $263=(($mem+$_sum235)|0);
     var $264=$263;
     var $265=HEAP32[(($264)>>2)];
     var $_sum236237=$14|4;
     var $266=(($mem+$_sum236237)|0);
     var $267=$266;
     var $268=HEAP32[(($267)>>2)];
     var $269=($268|0)==($262|0);
     do {
      if ($269) {
       var $_sum239=((($14)+(12))|0);
       var $287=(($mem+$_sum239)|0);
       var $288=$287;
       var $289=HEAP32[(($288)>>2)];
       var $290=($289|0)==0;
       if ($290) {
        var $_sum238=((($14)+(8))|0);
        var $292=(($mem+$_sum238)|0);
        var $293=$292;
        var $294=HEAP32[(($293)>>2)];
        var $295=($294|0)==0;
        if ($295) {
         var $R7_1=0;
         break;
        } else {
         var $R7_0=$294;var $RP9_0=$293;
        }
       } else {
        var $R7_0=$289;var $RP9_0=$288;
       }
       while(1) {
        var $RP9_0;
        var $R7_0;
        var $296=(($R7_0+20)|0);
        var $297=HEAP32[(($296)>>2)];
        var $298=($297|0)==0;
        if (!($298)) {
         var $R7_0=$297;var $RP9_0=$296;
         continue;
        }
        var $300=(($R7_0+16)|0);
        var $301=HEAP32[(($300)>>2)];
        var $302=($301|0)==0;
        if ($302) {
         break;
        } else {
         var $R7_0=$301;var $RP9_0=$300;
        }
       }
       var $304=$RP9_0;
       var $305=HEAP32[((1592)>>2)];
       var $306=($304>>>0)<($305>>>0);
       if ($306) {
        _abort();
        throw "Reached an unreachable!";
       } else {
        HEAP32[(($RP9_0)>>2)]=0;
        var $R7_1=$R7_0;
        break;
       }
      } else {
       var $271=(($mem+$14)|0);
       var $272=$271;
       var $273=HEAP32[(($272)>>2)];
       var $274=$273;
       var $275=HEAP32[((1592)>>2)];
       var $276=($274>>>0)<($275>>>0);
       if ($276) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $278=(($273+12)|0);
       var $279=HEAP32[(($278)>>2)];
       var $280=($279|0)==($262|0);
       if (!($280)) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $282=(($268+8)|0);
       var $283=HEAP32[(($282)>>2)];
       var $284=($283|0)==($262|0);
       if ($284) {
        HEAP32[(($278)>>2)]=$268;
        HEAP32[(($282)>>2)]=$273;
        var $R7_1=$268;
        break;
       } else {
        _abort();
        throw "Reached an unreachable!";
       }
      }
     } while(0);
     var $R7_1;
     var $310=($265|0)==0;
     if ($310) {
      break;
     }
     var $_sum250=((($14)+(20))|0);
     var $312=(($mem+$_sum250)|0);
     var $313=$312;
     var $314=HEAP32[(($313)>>2)];
     var $315=((1880+($314<<2))|0);
     var $316=HEAP32[(($315)>>2)];
     var $317=($262|0)==($316|0);
     do {
      if ($317) {
       HEAP32[(($315)>>2)]=$R7_1;
       var $cond298=($R7_1|0)==0;
       if (!($cond298)) {
        break;
       }
       var $319=HEAP32[(($313)>>2)];
       var $320=1<<$319;
       var $321=$320^-1;
       var $322=HEAP32[((1580)>>2)];
       var $323=$322&$321;
       HEAP32[((1580)>>2)]=$323;
       break L113;
      } else {
       var $325=$265;
       var $326=HEAP32[((1592)>>2)];
       var $327=($325>>>0)<($326>>>0);
       if ($327) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $329=(($265+16)|0);
       var $330=HEAP32[(($329)>>2)];
       var $331=($330|0)==($262|0);
       if ($331) {
        HEAP32[(($329)>>2)]=$R7_1;
       } else {
        var $334=(($265+20)|0);
        HEAP32[(($334)>>2)]=$R7_1;
       }
       var $337=($R7_1|0)==0;
       if ($337) {
        break L113;
       }
      }
     } while(0);
     var $339=$R7_1;
     var $340=HEAP32[((1592)>>2)];
     var $341=($339>>>0)<($340>>>0);
     if ($341) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $343=(($R7_1+24)|0);
     HEAP32[(($343)>>2)]=$265;
     var $_sum251=((($14)+(8))|0);
     var $344=(($mem+$_sum251)|0);
     var $345=$344;
     var $346=HEAP32[(($345)>>2)];
     var $347=($346|0)==0;
     do {
      if (!($347)) {
       var $349=$346;
       var $350=HEAP32[((1592)>>2)];
       var $351=($349>>>0)<($350>>>0);
       if ($351) {
        _abort();
        throw "Reached an unreachable!";
       } else {
        var $353=(($R7_1+16)|0);
        HEAP32[(($353)>>2)]=$346;
        var $354=(($346+24)|0);
        HEAP32[(($354)>>2)]=$R7_1;
        break;
       }
      }
     } while(0);
     var $_sum252=((($14)+(12))|0);
     var $357=(($mem+$_sum252)|0);
     var $358=$357;
     var $359=HEAP32[(($358)>>2)];
     var $360=($359|0)==0;
     if ($360) {
      break;
     }
     var $362=$359;
     var $363=HEAP32[((1592)>>2)];
     var $364=($362>>>0)<($363>>>0);
     if ($364) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      var $366=(($R7_1+20)|0);
      HEAP32[(($366)>>2)]=$359;
      var $367=(($359+24)|0);
      HEAP32[(($367)>>2)]=$R7_1;
      break;
     }
    }
   } while(0);
   var $371=$222|1;
   var $372=(($p_0+4)|0);
   HEAP32[(($372)>>2)]=$371;
   var $373=(($189+$222)|0);
   var $374=$373;
   HEAP32[(($374)>>2)]=$222;
   var $375=HEAP32[((1596)>>2)];
   var $376=($p_0|0)==($375|0);
   if (!($376)) {
    var $psize_1=$222;
    break;
   }
   HEAP32[((1584)>>2)]=$222;
   return;
  } else {
   var $379=$194&-2;
   HEAP32[(($193)>>2)]=$379;
   var $380=$psize_0|1;
   var $381=(($p_0+4)|0);
   HEAP32[(($381)>>2)]=$380;
   var $382=(($189+$psize_0)|0);
   var $383=$382;
   HEAP32[(($383)>>2)]=$psize_0;
   var $psize_1=$psize_0;
  }
 } while(0);
 var $psize_1;
 var $385=$psize_1>>>3;
 var $386=($psize_1>>>0)<256;
 if ($386) {
  var $388=$385<<1;
  var $389=((1616+($388<<2))|0);
  var $390=$389;
  var $391=HEAP32[((1576)>>2)];
  var $392=1<<$385;
  var $393=$391&$392;
  var $394=($393|0)==0;
  do {
   if ($394) {
    var $396=$391|$392;
    HEAP32[((1576)>>2)]=$396;
    var $_sum248_pre=((($388)+(2))|0);
    var $_pre=((1616+($_sum248_pre<<2))|0);
    var $F16_0=$390;var $_pre_phi=$_pre;
   } else {
    var $_sum249=((($388)+(2))|0);
    var $398=((1616+($_sum249<<2))|0);
    var $399=HEAP32[(($398)>>2)];
    var $400=$399;
    var $401=HEAP32[((1592)>>2)];
    var $402=($400>>>0)<($401>>>0);
    if (!($402)) {
     var $F16_0=$399;var $_pre_phi=$398;
     break;
    }
    _abort();
    throw "Reached an unreachable!";
   }
  } while(0);
  var $_pre_phi;
  var $F16_0;
  HEAP32[(($_pre_phi)>>2)]=$p_0;
  var $405=(($F16_0+12)|0);
  HEAP32[(($405)>>2)]=$p_0;
  var $406=(($p_0+8)|0);
  HEAP32[(($406)>>2)]=$F16_0;
  var $407=(($p_0+12)|0);
  HEAP32[(($407)>>2)]=$390;
  return;
 }
 var $409=$p_0;
 var $410=$psize_1>>>8;
 var $411=($410|0)==0;
 do {
  if ($411) {
   var $I18_0=0;
  } else {
   var $413=($psize_1>>>0)>16777215;
   if ($413) {
    var $I18_0=31;
    break;
   }
   var $415=((($410)+(1048320))|0);
   var $416=$415>>>16;
   var $417=$416&8;
   var $418=$410<<$417;
   var $419=((($418)+(520192))|0);
   var $420=$419>>>16;
   var $421=$420&4;
   var $422=$421|$417;
   var $423=$418<<$421;
   var $424=((($423)+(245760))|0);
   var $425=$424>>>16;
   var $426=$425&2;
   var $427=$422|$426;
   var $428=(((14)-($427))|0);
   var $429=$423<<$426;
   var $430=$429>>>15;
   var $431=((($428)+($430))|0);
   var $432=$431<<1;
   var $433=((($431)+(7))|0);
   var $434=$psize_1>>>($433>>>0);
   var $435=$434&1;
   var $436=$435|$432;
   var $I18_0=$436;
  }
 } while(0);
 var $I18_0;
 var $438=((1880+($I18_0<<2))|0);
 var $439=(($p_0+28)|0);
 var $I18_0_c=$I18_0;
 HEAP32[(($439)>>2)]=$I18_0_c;
 var $440=(($p_0+20)|0);
 HEAP32[(($440)>>2)]=0;
 var $441=(($p_0+16)|0);
 HEAP32[(($441)>>2)]=0;
 var $442=HEAP32[((1580)>>2)];
 var $443=1<<$I18_0;
 var $444=$442&$443;
 var $445=($444|0)==0;
 do {
  if ($445) {
   var $447=$442|$443;
   HEAP32[((1580)>>2)]=$447;
   HEAP32[(($438)>>2)]=$409;
   var $448=(($p_0+24)|0);
   var $_c=$438;
   HEAP32[(($448)>>2)]=$_c;
   var $449=(($p_0+12)|0);
   HEAP32[(($449)>>2)]=$p_0;
   var $450=(($p_0+8)|0);
   HEAP32[(($450)>>2)]=$p_0;
  } else {
   var $452=HEAP32[(($438)>>2)];
   var $453=($I18_0|0)==31;
   if ($453) {
    var $458=0;
   } else {
    var $455=$I18_0>>>1;
    var $456=(((25)-($455))|0);
    var $458=$456;
   }
   var $458;
   var $459=$psize_1<<$458;
   var $K19_0=$459;var $T_0=$452;
   while(1) {
    var $T_0;
    var $K19_0;
    var $461=(($T_0+4)|0);
    var $462=HEAP32[(($461)>>2)];
    var $463=$462&-8;
    var $464=($463|0)==($psize_1|0);
    if ($464) {
     break;
    }
    var $466=$K19_0>>>31;
    var $467=(($T_0+16+($466<<2))|0);
    var $468=HEAP32[(($467)>>2)];
    var $469=($468|0)==0;
    var $470=$K19_0<<1;
    if ($469) {
     label = 129;
     break;
    } else {
     var $K19_0=$470;var $T_0=$468;
    }
   }
   if (label == 129) {
    var $472=$467;
    var $473=HEAP32[((1592)>>2)];
    var $474=($472>>>0)<($473>>>0);
    if ($474) {
     _abort();
     throw "Reached an unreachable!";
    } else {
     HEAP32[(($467)>>2)]=$409;
     var $476=(($p_0+24)|0);
     var $T_0_c245=$T_0;
     HEAP32[(($476)>>2)]=$T_0_c245;
     var $477=(($p_0+12)|0);
     HEAP32[(($477)>>2)]=$p_0;
     var $478=(($p_0+8)|0);
     HEAP32[(($478)>>2)]=$p_0;
     break;
    }
   }
   var $481=(($T_0+8)|0);
   var $482=HEAP32[(($481)>>2)];
   var $483=$T_0;
   var $484=HEAP32[((1592)>>2)];
   var $485=($483>>>0)<($484>>>0);
   if ($485) {
    _abort();
    throw "Reached an unreachable!";
   }
   var $487=$482;
   var $488=($487>>>0)<($484>>>0);
   if ($488) {
    _abort();
    throw "Reached an unreachable!";
   } else {
    var $490=(($482+12)|0);
    HEAP32[(($490)>>2)]=$409;
    HEAP32[(($481)>>2)]=$409;
    var $491=(($p_0+8)|0);
    var $_c244=$482;
    HEAP32[(($491)>>2)]=$_c244;
    var $492=(($p_0+12)|0);
    var $T_0_c=$T_0;
    HEAP32[(($492)>>2)]=$T_0_c;
    var $493=(($p_0+24)|0);
    HEAP32[(($493)>>2)]=0;
    break;
   }
  }
 } while(0);
 var $495=HEAP32[((1608)>>2)];
 var $496=((($495)-(1))|0);
 HEAP32[((1608)>>2)]=$496;
 var $497=($496|0)==0;
 if ($497) {
  var $sp_0_in_i=2032;
 } else {
  return;
 }
 while(1) {
  var $sp_0_in_i;
  var $sp_0_i=HEAP32[(($sp_0_in_i)>>2)];
  var $498=($sp_0_i|0)==0;
  var $499=(($sp_0_i+8)|0);
  if ($498) {
   break;
  } else {
   var $sp_0_in_i=$499;
  }
 }
 HEAP32[((1608)>>2)]=-1;
 return;
}
Module["_free"] = _free;

function _realloc($oldmem,$bytes){
 var label=0;

 var $1=($oldmem|0)==0;
 if ($1) {
  var $3=_malloc($bytes);
  var $mem_0=$3;
  var $mem_0;
  return $mem_0;
 }
 var $5=($bytes>>>0)>4294967231;
 if ($5) {
  var $7=___errno_location();
  HEAP32[(($7)>>2)]=12;
  var $mem_0=0;
  var $mem_0;
  return $mem_0;
 }
 var $9=($bytes>>>0)<11;
 if ($9) {
  var $14=16;
 } else {
  var $11=((($bytes)+(11))|0);
  var $12=$11&-8;
  var $14=$12;
 }
 var $14;
 var $15=((($oldmem)-(8))|0);
 var $16=$15;
 var $17=_try_realloc_chunk($16,$14);
 var $18=($17|0)==0;
 if (!($18)) {
  var $20=(($17+8)|0);
  var $21=$20;
  var $mem_0=$21;
  var $mem_0;
  return $mem_0;
 }
 var $23=_malloc($bytes);
 var $24=($23|0)==0;
 if ($24) {
  var $mem_0=0;
  var $mem_0;
  return $mem_0;
 }
 var $26=((($oldmem)-(4))|0);
 var $27=$26;
 var $28=HEAP32[(($27)>>2)];
 var $29=$28&-8;
 var $30=$28&3;
 var $31=($30|0)==0;
 var $32=($31?8:4);
 var $33=((($29)-($32))|0);
 var $34=($33>>>0)<($bytes>>>0);
 var $35=($34?$33:$bytes);
 assert($35 % 1 === 0);(_memcpy($23, $oldmem, $35)|0);
 _free($oldmem);
 var $mem_0=$23;
 var $mem_0;
 return $mem_0;
}
Module["_realloc"] = _realloc;

function _try_realloc_chunk($p,$nb){
 var label=0;

 var $1=(($p+4)|0);
 var $2=HEAP32[(($1)>>2)];
 var $3=$2&-8;
 var $4=$p;
 var $5=(($4+$3)|0);
 var $6=$5;
 var $7=HEAP32[((1592)>>2)];
 var $8=($4>>>0)<($7>>>0);
 if ($8) {
  _abort();
  throw "Reached an unreachable!";
 }
 var $10=$2&3;
 var $11=($10|0)!=1;
 var $12=($4>>>0)<($5>>>0);
 var $or_cond=$11&$12;
 if (!($or_cond)) {
  _abort();
  throw "Reached an unreachable!";
 }
 var $_sum3334=$3|4;
 var $14=(($4+$_sum3334)|0);
 var $15=$14;
 var $16=HEAP32[(($15)>>2)];
 var $17=$16&1;
 var $phitmp=($17|0)==0;
 if ($phitmp) {
  _abort();
  throw "Reached an unreachable!";
 }
 var $19=($10|0)==0;
 if ($19) {
  var $21=($nb>>>0)<256;
  if ($21) {
   var $newp_0=0;
   var $newp_0;
   return $newp_0;
  }
  var $23=((($nb)+(4))|0);
  var $24=($3>>>0)<($23>>>0);
  do {
   if (!($24)) {
    var $26=((($3)-($nb))|0);
    var $27=HEAP32[((1528)>>2)];
    var $28=$27<<1;
    var $29=($26>>>0)>($28>>>0);
    if ($29) {
     break;
    } else {
     var $newp_0=$p;
    }
    var $newp_0;
    return $newp_0;
   }
  } while(0);
  var $newp_0=0;
  var $newp_0;
  return $newp_0;
 }
 var $32=($3>>>0)<($nb>>>0);
 if (!($32)) {
  var $34=((($3)-($nb))|0);
  var $35=($34>>>0)>15;
  if (!($35)) {
   var $newp_0=$p;
   var $newp_0;
   return $newp_0;
  }
  var $37=(($4+$nb)|0);
  var $38=$37;
  var $39=$2&1;
  var $40=$39|$nb;
  var $41=$40|2;
  HEAP32[(($1)>>2)]=$41;
  var $_sum29=((($nb)+(4))|0);
  var $42=(($4+$_sum29)|0);
  var $43=$42;
  var $44=$34|3;
  HEAP32[(($43)>>2)]=$44;
  var $45=HEAP32[(($15)>>2)];
  var $46=$45|1;
  HEAP32[(($15)>>2)]=$46;
  _dispose_chunk($38,$34);
  var $newp_0=$p;
  var $newp_0;
  return $newp_0;
 }
 var $48=HEAP32[((1600)>>2)];
 var $49=($6|0)==($48|0);
 if ($49) {
  var $51=HEAP32[((1588)>>2)];
  var $52=((($51)+($3))|0);
  var $53=($52>>>0)>($nb>>>0);
  if (!($53)) {
   var $newp_0=0;
   var $newp_0;
   return $newp_0;
  }
  var $55=((($52)-($nb))|0);
  var $56=(($4+$nb)|0);
  var $57=$56;
  var $58=$2&1;
  var $59=$58|$nb;
  var $60=$59|2;
  HEAP32[(($1)>>2)]=$60;
  var $_sum28=((($nb)+(4))|0);
  var $61=(($4+$_sum28)|0);
  var $62=$61;
  var $63=$55|1;
  HEAP32[(($62)>>2)]=$63;
  HEAP32[((1600)>>2)]=$57;
  HEAP32[((1588)>>2)]=$55;
  var $newp_0=$p;
  var $newp_0;
  return $newp_0;
 }
 var $65=HEAP32[((1596)>>2)];
 var $66=($6|0)==($65|0);
 if ($66) {
  var $68=HEAP32[((1584)>>2)];
  var $69=((($68)+($3))|0);
  var $70=($69>>>0)<($nb>>>0);
  if ($70) {
   var $newp_0=0;
   var $newp_0;
   return $newp_0;
  }
  var $72=((($69)-($nb))|0);
  var $73=($72>>>0)>15;
  if ($73) {
   var $75=(($4+$nb)|0);
   var $76=$75;
   var $77=(($4+$69)|0);
   var $78=$2&1;
   var $79=$78|$nb;
   var $80=$79|2;
   HEAP32[(($1)>>2)]=$80;
   var $_sum25=((($nb)+(4))|0);
   var $81=(($4+$_sum25)|0);
   var $82=$81;
   var $83=$72|1;
   HEAP32[(($82)>>2)]=$83;
   var $84=$77;
   HEAP32[(($84)>>2)]=$72;
   var $_sum26=((($69)+(4))|0);
   var $85=(($4+$_sum26)|0);
   var $86=$85;
   var $87=HEAP32[(($86)>>2)];
   var $88=$87&-2;
   HEAP32[(($86)>>2)]=$88;
   var $storemerge=$76;var $storemerge27=$72;
  } else {
   var $90=$2&1;
   var $91=$90|$69;
   var $92=$91|2;
   HEAP32[(($1)>>2)]=$92;
   var $_sum23=((($69)+(4))|0);
   var $93=(($4+$_sum23)|0);
   var $94=$93;
   var $95=HEAP32[(($94)>>2)];
   var $96=$95|1;
   HEAP32[(($94)>>2)]=$96;
   var $storemerge=0;var $storemerge27=0;
  }
  var $storemerge27;
  var $storemerge;
  HEAP32[((1584)>>2)]=$storemerge27;
  HEAP32[((1596)>>2)]=$storemerge;
  var $newp_0=$p;
  var $newp_0;
  return $newp_0;
 }
 var $99=$16&2;
 var $100=($99|0)==0;
 if (!($100)) {
  var $newp_0=0;
  var $newp_0;
  return $newp_0;
 }
 var $102=$16&-8;
 var $103=((($102)+($3))|0);
 var $104=($103>>>0)<($nb>>>0);
 if ($104) {
  var $newp_0=0;
  var $newp_0;
  return $newp_0;
 }
 var $106=((($103)-($nb))|0);
 var $107=$16>>>3;
 var $108=($16>>>0)<256;
 L52: do {
  if ($108) {
   var $_sum17=((($3)+(8))|0);
   var $110=(($4+$_sum17)|0);
   var $111=$110;
   var $112=HEAP32[(($111)>>2)];
   var $_sum18=((($3)+(12))|0);
   var $113=(($4+$_sum18)|0);
   var $114=$113;
   var $115=HEAP32[(($114)>>2)];
   var $116=$107<<1;
   var $117=((1616+($116<<2))|0);
   var $118=$117;
   var $119=($112|0)==($118|0);
   do {
    if (!($119)) {
     var $121=$112;
     var $122=($121>>>0)<($7>>>0);
     if ($122) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $124=(($112+12)|0);
     var $125=HEAP32[(($124)>>2)];
     var $126=($125|0)==($6|0);
     if ($126) {
      break;
     }
     _abort();
     throw "Reached an unreachable!";
    }
   } while(0);
   var $127=($115|0)==($112|0);
   if ($127) {
    var $129=1<<$107;
    var $130=$129^-1;
    var $131=HEAP32[((1576)>>2)];
    var $132=$131&$130;
    HEAP32[((1576)>>2)]=$132;
    break;
   }
   var $134=($115|0)==($118|0);
   do {
    if ($134) {
     var $_pre=(($115+8)|0);
     var $_pre_phi=$_pre;
    } else {
     var $136=$115;
     var $137=($136>>>0)<($7>>>0);
     if ($137) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $139=(($115+8)|0);
     var $140=HEAP32[(($139)>>2)];
     var $141=($140|0)==($6|0);
     if ($141) {
      var $_pre_phi=$139;
      break;
     }
     _abort();
     throw "Reached an unreachable!";
    }
   } while(0);
   var $_pre_phi;
   var $142=(($112+12)|0);
   HEAP32[(($142)>>2)]=$115;
   HEAP32[(($_pre_phi)>>2)]=$112;
  } else {
   var $144=$5;
   var $_sum=((($3)+(24))|0);
   var $145=(($4+$_sum)|0);
   var $146=$145;
   var $147=HEAP32[(($146)>>2)];
   var $_sum2=((($3)+(12))|0);
   var $148=(($4+$_sum2)|0);
   var $149=$148;
   var $150=HEAP32[(($149)>>2)];
   var $151=($150|0)==($144|0);
   do {
    if ($151) {
     var $_sum4=((($3)+(20))|0);
     var $168=(($4+$_sum4)|0);
     var $169=$168;
     var $170=HEAP32[(($169)>>2)];
     var $171=($170|0)==0;
     if ($171) {
      var $_sum3=((($3)+(16))|0);
      var $173=(($4+$_sum3)|0);
      var $174=$173;
      var $175=HEAP32[(($174)>>2)];
      var $176=($175|0)==0;
      if ($176) {
       var $R_1=0;
       break;
      } else {
       var $R_0=$175;var $RP_0=$174;
      }
     } else {
      var $R_0=$170;var $RP_0=$169;
     }
     while(1) {
      var $RP_0;
      var $R_0;
      var $177=(($R_0+20)|0);
      var $178=HEAP32[(($177)>>2)];
      var $179=($178|0)==0;
      if (!($179)) {
       var $R_0=$178;var $RP_0=$177;
       continue;
      }
      var $181=(($R_0+16)|0);
      var $182=HEAP32[(($181)>>2)];
      var $183=($182|0)==0;
      if ($183) {
       break;
      } else {
       var $R_0=$182;var $RP_0=$181;
      }
     }
     var $185=$RP_0;
     var $186=($185>>>0)<($7>>>0);
     if ($186) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      HEAP32[(($RP_0)>>2)]=0;
      var $R_1=$R_0;
      break;
     }
    } else {
     var $_sum14=((($3)+(8))|0);
     var $153=(($4+$_sum14)|0);
     var $154=$153;
     var $155=HEAP32[(($154)>>2)];
     var $156=$155;
     var $157=($156>>>0)<($7>>>0);
     if ($157) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $159=(($155+12)|0);
     var $160=HEAP32[(($159)>>2)];
     var $161=($160|0)==($144|0);
     if (!($161)) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $163=(($150+8)|0);
     var $164=HEAP32[(($163)>>2)];
     var $165=($164|0)==($144|0);
     if ($165) {
      HEAP32[(($159)>>2)]=$150;
      HEAP32[(($163)>>2)]=$155;
      var $R_1=$150;
      break;
     } else {
      _abort();
      throw "Reached an unreachable!";
     }
    }
   } while(0);
   var $R_1;
   var $190=($147|0)==0;
   if ($190) {
    break;
   }
   var $_sum11=((($3)+(28))|0);
   var $192=(($4+$_sum11)|0);
   var $193=$192;
   var $194=HEAP32[(($193)>>2)];
   var $195=((1880+($194<<2))|0);
   var $196=HEAP32[(($195)>>2)];
   var $197=($144|0)==($196|0);
   do {
    if ($197) {
     HEAP32[(($195)>>2)]=$R_1;
     var $cond=($R_1|0)==0;
     if (!($cond)) {
      break;
     }
     var $199=HEAP32[(($193)>>2)];
     var $200=1<<$199;
     var $201=$200^-1;
     var $202=HEAP32[((1580)>>2)];
     var $203=$202&$201;
     HEAP32[((1580)>>2)]=$203;
     break L52;
    } else {
     var $205=$147;
     var $206=HEAP32[((1592)>>2)];
     var $207=($205>>>0)<($206>>>0);
     if ($207) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $209=(($147+16)|0);
     var $210=HEAP32[(($209)>>2)];
     var $211=($210|0)==($144|0);
     if ($211) {
      HEAP32[(($209)>>2)]=$R_1;
     } else {
      var $214=(($147+20)|0);
      HEAP32[(($214)>>2)]=$R_1;
     }
     var $217=($R_1|0)==0;
     if ($217) {
      break L52;
     }
    }
   } while(0);
   var $219=$R_1;
   var $220=HEAP32[((1592)>>2)];
   var $221=($219>>>0)<($220>>>0);
   if ($221) {
    _abort();
    throw "Reached an unreachable!";
   }
   var $223=(($R_1+24)|0);
   HEAP32[(($223)>>2)]=$147;
   var $_sum12=((($3)+(16))|0);
   var $224=(($4+$_sum12)|0);
   var $225=$224;
   var $226=HEAP32[(($225)>>2)];
   var $227=($226|0)==0;
   do {
    if (!($227)) {
     var $229=$226;
     var $230=HEAP32[((1592)>>2)];
     var $231=($229>>>0)<($230>>>0);
     if ($231) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      var $233=(($R_1+16)|0);
      HEAP32[(($233)>>2)]=$226;
      var $234=(($226+24)|0);
      HEAP32[(($234)>>2)]=$R_1;
      break;
     }
    }
   } while(0);
   var $_sum13=((($3)+(20))|0);
   var $237=(($4+$_sum13)|0);
   var $238=$237;
   var $239=HEAP32[(($238)>>2)];
   var $240=($239|0)==0;
   if ($240) {
    break;
   }
   var $242=$239;
   var $243=HEAP32[((1592)>>2)];
   var $244=($242>>>0)<($243>>>0);
   if ($244) {
    _abort();
    throw "Reached an unreachable!";
   } else {
    var $246=(($R_1+20)|0);
    HEAP32[(($246)>>2)]=$239;
    var $247=(($239+24)|0);
    HEAP32[(($247)>>2)]=$R_1;
    break;
   }
  }
 } while(0);
 var $251=($106>>>0)<16;
 if ($251) {
  var $253=HEAP32[(($1)>>2)];
  var $254=$253&1;
  var $255=$103|$254;
  var $256=$255|2;
  HEAP32[(($1)>>2)]=$256;
  var $_sum910=$103|4;
  var $257=(($4+$_sum910)|0);
  var $258=$257;
  var $259=HEAP32[(($258)>>2)];
  var $260=$259|1;
  HEAP32[(($258)>>2)]=$260;
  var $newp_0=$p;
  var $newp_0;
  return $newp_0;
 } else {
  var $262=(($4+$nb)|0);
  var $263=$262;
  var $264=HEAP32[(($1)>>2)];
  var $265=$264&1;
  var $266=$265|$nb;
  var $267=$266|2;
  HEAP32[(($1)>>2)]=$267;
  var $_sum5=((($nb)+(4))|0);
  var $268=(($4+$_sum5)|0);
  var $269=$268;
  var $270=$106|3;
  HEAP32[(($269)>>2)]=$270;
  var $_sum78=$103|4;
  var $271=(($4+$_sum78)|0);
  var $272=$271;
  var $273=HEAP32[(($272)>>2)];
  var $274=$273|1;
  HEAP32[(($272)>>2)]=$274;
  _dispose_chunk($263,$106);
  var $newp_0=$p;
  var $newp_0;
  return $newp_0;
 }
}


function _dispose_chunk($p,$psize){
 var label=0;

 var $1=$p;
 var $2=(($1+$psize)|0);
 var $3=$2;
 var $4=(($p+4)|0);
 var $5=HEAP32[(($4)>>2)];
 var $6=$5&1;
 var $7=($6|0)==0;
 L1: do {
  if ($7) {
   var $9=(($p)|0);
   var $10=HEAP32[(($9)>>2)];
   var $11=$5&3;
   var $12=($11|0)==0;
   if ($12) {
    return;
   }
   var $14=(((-$10))|0);
   var $15=(($1+$14)|0);
   var $16=$15;
   var $17=((($10)+($psize))|0);
   var $18=HEAP32[((1592)>>2)];
   var $19=($15>>>0)<($18>>>0);
   if ($19) {
    _abort();
    throw "Reached an unreachable!";
   }
   var $21=HEAP32[((1596)>>2)];
   var $22=($16|0)==($21|0);
   if ($22) {
    var $_sum=((($psize)+(4))|0);
    var $168=(($1+$_sum)|0);
    var $169=$168;
    var $170=HEAP32[(($169)>>2)];
    var $171=$170&3;
    var $172=($171|0)==3;
    if (!($172)) {
     var $_0=$16;var $_0277=$17;
     break;
    }
    HEAP32[((1584)>>2)]=$17;
    var $174=HEAP32[(($169)>>2)];
    var $175=$174&-2;
    HEAP32[(($169)>>2)]=$175;
    var $176=$17|1;
    var $_sum24=(((4)-($10))|0);
    var $177=(($1+$_sum24)|0);
    var $178=$177;
    HEAP32[(($178)>>2)]=$176;
    var $179=$2;
    HEAP32[(($179)>>2)]=$17;
    return;
   }
   var $24=$10>>>3;
   var $25=($10>>>0)<256;
   if ($25) {
    var $_sum35=(((8)-($10))|0);
    var $27=(($1+$_sum35)|0);
    var $28=$27;
    var $29=HEAP32[(($28)>>2)];
    var $_sum36=(((12)-($10))|0);
    var $30=(($1+$_sum36)|0);
    var $31=$30;
    var $32=HEAP32[(($31)>>2)];
    var $33=$24<<1;
    var $34=((1616+($33<<2))|0);
    var $35=$34;
    var $36=($29|0)==($35|0);
    do {
     if (!($36)) {
      var $38=$29;
      var $39=($38>>>0)<($18>>>0);
      if ($39) {
       _abort();
       throw "Reached an unreachable!";
      }
      var $41=(($29+12)|0);
      var $42=HEAP32[(($41)>>2)];
      var $43=($42|0)==($16|0);
      if ($43) {
       break;
      }
      _abort();
      throw "Reached an unreachable!";
     }
    } while(0);
    var $44=($32|0)==($29|0);
    if ($44) {
     var $46=1<<$24;
     var $47=$46^-1;
     var $48=HEAP32[((1576)>>2)];
     var $49=$48&$47;
     HEAP32[((1576)>>2)]=$49;
     var $_0=$16;var $_0277=$17;
     break;
    }
    var $51=($32|0)==($35|0);
    do {
     if ($51) {
      var $_pre62=(($32+8)|0);
      var $_pre_phi63=$_pre62;
     } else {
      var $53=$32;
      var $54=($53>>>0)<($18>>>0);
      if ($54) {
       _abort();
       throw "Reached an unreachable!";
      }
      var $56=(($32+8)|0);
      var $57=HEAP32[(($56)>>2)];
      var $58=($57|0)==($16|0);
      if ($58) {
       var $_pre_phi63=$56;
       break;
      }
      _abort();
      throw "Reached an unreachable!";
     }
    } while(0);
    var $_pre_phi63;
    var $59=(($29+12)|0);
    HEAP32[(($59)>>2)]=$32;
    HEAP32[(($_pre_phi63)>>2)]=$29;
    var $_0=$16;var $_0277=$17;
    break;
   }
   var $61=$15;
   var $_sum26=(((24)-($10))|0);
   var $62=(($1+$_sum26)|0);
   var $63=$62;
   var $64=HEAP32[(($63)>>2)];
   var $_sum27=(((12)-($10))|0);
   var $65=(($1+$_sum27)|0);
   var $66=$65;
   var $67=HEAP32[(($66)>>2)];
   var $68=($67|0)==($61|0);
   do {
    if ($68) {
     var $_sum28=(((16)-($10))|0);
     var $_sum29=((($_sum28)+(4))|0);
     var $85=(($1+$_sum29)|0);
     var $86=$85;
     var $87=HEAP32[(($86)>>2)];
     var $88=($87|0)==0;
     if ($88) {
      var $90=(($1+$_sum28)|0);
      var $91=$90;
      var $92=HEAP32[(($91)>>2)];
      var $93=($92|0)==0;
      if ($93) {
       var $R_1=0;
       break;
      } else {
       var $R_0=$92;var $RP_0=$91;
      }
     } else {
      var $R_0=$87;var $RP_0=$86;
     }
     while(1) {
      var $RP_0;
      var $R_0;
      var $94=(($R_0+20)|0);
      var $95=HEAP32[(($94)>>2)];
      var $96=($95|0)==0;
      if (!($96)) {
       var $R_0=$95;var $RP_0=$94;
       continue;
      }
      var $98=(($R_0+16)|0);
      var $99=HEAP32[(($98)>>2)];
      var $100=($99|0)==0;
      if ($100) {
       break;
      } else {
       var $R_0=$99;var $RP_0=$98;
      }
     }
     var $102=$RP_0;
     var $103=($102>>>0)<($18>>>0);
     if ($103) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      HEAP32[(($RP_0)>>2)]=0;
      var $R_1=$R_0;
      break;
     }
    } else {
     var $_sum33=(((8)-($10))|0);
     var $70=(($1+$_sum33)|0);
     var $71=$70;
     var $72=HEAP32[(($71)>>2)];
     var $73=$72;
     var $74=($73>>>0)<($18>>>0);
     if ($74) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $76=(($72+12)|0);
     var $77=HEAP32[(($76)>>2)];
     var $78=($77|0)==($61|0);
     if (!($78)) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $80=(($67+8)|0);
     var $81=HEAP32[(($80)>>2)];
     var $82=($81|0)==($61|0);
     if ($82) {
      HEAP32[(($76)>>2)]=$67;
      HEAP32[(($80)>>2)]=$72;
      var $R_1=$67;
      break;
     } else {
      _abort();
      throw "Reached an unreachable!";
     }
    }
   } while(0);
   var $R_1;
   var $107=($64|0)==0;
   if ($107) {
    var $_0=$16;var $_0277=$17;
    break;
   }
   var $_sum30=(((28)-($10))|0);
   var $109=(($1+$_sum30)|0);
   var $110=$109;
   var $111=HEAP32[(($110)>>2)];
   var $112=((1880+($111<<2))|0);
   var $113=HEAP32[(($112)>>2)];
   var $114=($61|0)==($113|0);
   do {
    if ($114) {
     HEAP32[(($112)>>2)]=$R_1;
     var $cond=($R_1|0)==0;
     if (!($cond)) {
      break;
     }
     var $116=HEAP32[(($110)>>2)];
     var $117=1<<$116;
     var $118=$117^-1;
     var $119=HEAP32[((1580)>>2)];
     var $120=$119&$118;
     HEAP32[((1580)>>2)]=$120;
     var $_0=$16;var $_0277=$17;
     break L1;
    } else {
     var $122=$64;
     var $123=HEAP32[((1592)>>2)];
     var $124=($122>>>0)<($123>>>0);
     if ($124) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $126=(($64+16)|0);
     var $127=HEAP32[(($126)>>2)];
     var $128=($127|0)==($61|0);
     if ($128) {
      HEAP32[(($126)>>2)]=$R_1;
     } else {
      var $131=(($64+20)|0);
      HEAP32[(($131)>>2)]=$R_1;
     }
     var $134=($R_1|0)==0;
     if ($134) {
      var $_0=$16;var $_0277=$17;
      break L1;
     }
    }
   } while(0);
   var $136=$R_1;
   var $137=HEAP32[((1592)>>2)];
   var $138=($136>>>0)<($137>>>0);
   if ($138) {
    _abort();
    throw "Reached an unreachable!";
   }
   var $140=(($R_1+24)|0);
   HEAP32[(($140)>>2)]=$64;
   var $_sum31=(((16)-($10))|0);
   var $141=(($1+$_sum31)|0);
   var $142=$141;
   var $143=HEAP32[(($142)>>2)];
   var $144=($143|0)==0;
   do {
    if (!($144)) {
     var $146=$143;
     var $147=HEAP32[((1592)>>2)];
     var $148=($146>>>0)<($147>>>0);
     if ($148) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      var $150=(($R_1+16)|0);
      HEAP32[(($150)>>2)]=$143;
      var $151=(($143+24)|0);
      HEAP32[(($151)>>2)]=$R_1;
      break;
     }
    }
   } while(0);
   var $_sum32=((($_sum31)+(4))|0);
   var $154=(($1+$_sum32)|0);
   var $155=$154;
   var $156=HEAP32[(($155)>>2)];
   var $157=($156|0)==0;
   if ($157) {
    var $_0=$16;var $_0277=$17;
    break;
   }
   var $159=$156;
   var $160=HEAP32[((1592)>>2)];
   var $161=($159>>>0)<($160>>>0);
   if ($161) {
    _abort();
    throw "Reached an unreachable!";
   } else {
    var $163=(($R_1+20)|0);
    HEAP32[(($163)>>2)]=$156;
    var $164=(($156+24)|0);
    HEAP32[(($164)>>2)]=$R_1;
    var $_0=$16;var $_0277=$17;
    break;
   }
  } else {
   var $_0=$p;var $_0277=$psize;
  }
 } while(0);
 var $_0277;
 var $_0;
 var $181=HEAP32[((1592)>>2)];
 var $182=($2>>>0)<($181>>>0);
 if ($182) {
  _abort();
  throw "Reached an unreachable!";
 }
 var $_sum1=((($psize)+(4))|0);
 var $184=(($1+$_sum1)|0);
 var $185=$184;
 var $186=HEAP32[(($185)>>2)];
 var $187=$186&2;
 var $188=($187|0)==0;
 do {
  if ($188) {
   var $190=HEAP32[((1600)>>2)];
   var $191=($3|0)==($190|0);
   if ($191) {
    var $193=HEAP32[((1588)>>2)];
    var $194=((($193)+($_0277))|0);
    HEAP32[((1588)>>2)]=$194;
    HEAP32[((1600)>>2)]=$_0;
    var $195=$194|1;
    var $196=(($_0+4)|0);
    HEAP32[(($196)>>2)]=$195;
    var $197=HEAP32[((1596)>>2)];
    var $198=($_0|0)==($197|0);
    if (!($198)) {
     return;
    }
    HEAP32[((1596)>>2)]=0;
    HEAP32[((1584)>>2)]=0;
    return;
   }
   var $201=HEAP32[((1596)>>2)];
   var $202=($3|0)==($201|0);
   if ($202) {
    var $204=HEAP32[((1584)>>2)];
    var $205=((($204)+($_0277))|0);
    HEAP32[((1584)>>2)]=$205;
    HEAP32[((1596)>>2)]=$_0;
    var $206=$205|1;
    var $207=(($_0+4)|0);
    HEAP32[(($207)>>2)]=$206;
    var $208=$_0;
    var $209=(($208+$205)|0);
    var $210=$209;
    HEAP32[(($210)>>2)]=$205;
    return;
   }
   var $212=$186&-8;
   var $213=((($212)+($_0277))|0);
   var $214=$186>>>3;
   var $215=($186>>>0)<256;
   L100: do {
    if ($215) {
     var $_sum20=((($psize)+(8))|0);
     var $217=(($1+$_sum20)|0);
     var $218=$217;
     var $219=HEAP32[(($218)>>2)];
     var $_sum21=((($psize)+(12))|0);
     var $220=(($1+$_sum21)|0);
     var $221=$220;
     var $222=HEAP32[(($221)>>2)];
     var $223=$214<<1;
     var $224=((1616+($223<<2))|0);
     var $225=$224;
     var $226=($219|0)==($225|0);
     do {
      if (!($226)) {
       var $228=$219;
       var $229=($228>>>0)<($181>>>0);
       if ($229) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $231=(($219+12)|0);
       var $232=HEAP32[(($231)>>2)];
       var $233=($232|0)==($3|0);
       if ($233) {
        break;
       }
       _abort();
       throw "Reached an unreachable!";
      }
     } while(0);
     var $234=($222|0)==($219|0);
     if ($234) {
      var $236=1<<$214;
      var $237=$236^-1;
      var $238=HEAP32[((1576)>>2)];
      var $239=$238&$237;
      HEAP32[((1576)>>2)]=$239;
      break;
     }
     var $241=($222|0)==($225|0);
     do {
      if ($241) {
       var $_pre60=(($222+8)|0);
       var $_pre_phi61=$_pre60;
      } else {
       var $243=$222;
       var $244=($243>>>0)<($181>>>0);
       if ($244) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $246=(($222+8)|0);
       var $247=HEAP32[(($246)>>2)];
       var $248=($247|0)==($3|0);
       if ($248) {
        var $_pre_phi61=$246;
        break;
       }
       _abort();
       throw "Reached an unreachable!";
      }
     } while(0);
     var $_pre_phi61;
     var $249=(($219+12)|0);
     HEAP32[(($249)>>2)]=$222;
     HEAP32[(($_pre_phi61)>>2)]=$219;
    } else {
     var $251=$2;
     var $_sum2=((($psize)+(24))|0);
     var $252=(($1+$_sum2)|0);
     var $253=$252;
     var $254=HEAP32[(($253)>>2)];
     var $_sum3=((($psize)+(12))|0);
     var $255=(($1+$_sum3)|0);
     var $256=$255;
     var $257=HEAP32[(($256)>>2)];
     var $258=($257|0)==($251|0);
     do {
      if ($258) {
       var $_sum5=((($psize)+(20))|0);
       var $275=(($1+$_sum5)|0);
       var $276=$275;
       var $277=HEAP32[(($276)>>2)];
       var $278=($277|0)==0;
       if ($278) {
        var $_sum4=((($psize)+(16))|0);
        var $280=(($1+$_sum4)|0);
        var $281=$280;
        var $282=HEAP32[(($281)>>2)];
        var $283=($282|0)==0;
        if ($283) {
         var $R7_1=0;
         break;
        } else {
         var $R7_0=$282;var $RP9_0=$281;
        }
       } else {
        var $R7_0=$277;var $RP9_0=$276;
       }
       while(1) {
        var $RP9_0;
        var $R7_0;
        var $284=(($R7_0+20)|0);
        var $285=HEAP32[(($284)>>2)];
        var $286=($285|0)==0;
        if (!($286)) {
         var $R7_0=$285;var $RP9_0=$284;
         continue;
        }
        var $288=(($R7_0+16)|0);
        var $289=HEAP32[(($288)>>2)];
        var $290=($289|0)==0;
        if ($290) {
         break;
        } else {
         var $R7_0=$289;var $RP9_0=$288;
        }
       }
       var $292=$RP9_0;
       var $293=($292>>>0)<($181>>>0);
       if ($293) {
        _abort();
        throw "Reached an unreachable!";
       } else {
        HEAP32[(($RP9_0)>>2)]=0;
        var $R7_1=$R7_0;
        break;
       }
      } else {
       var $_sum18=((($psize)+(8))|0);
       var $260=(($1+$_sum18)|0);
       var $261=$260;
       var $262=HEAP32[(($261)>>2)];
       var $263=$262;
       var $264=($263>>>0)<($181>>>0);
       if ($264) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $266=(($262+12)|0);
       var $267=HEAP32[(($266)>>2)];
       var $268=($267|0)==($251|0);
       if (!($268)) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $270=(($257+8)|0);
       var $271=HEAP32[(($270)>>2)];
       var $272=($271|0)==($251|0);
       if ($272) {
        HEAP32[(($266)>>2)]=$257;
        HEAP32[(($270)>>2)]=$262;
        var $R7_1=$257;
        break;
       } else {
        _abort();
        throw "Reached an unreachable!";
       }
      }
     } while(0);
     var $R7_1;
     var $297=($254|0)==0;
     if ($297) {
      break;
     }
     var $_sum15=((($psize)+(28))|0);
     var $299=(($1+$_sum15)|0);
     var $300=$299;
     var $301=HEAP32[(($300)>>2)];
     var $302=((1880+($301<<2))|0);
     var $303=HEAP32[(($302)>>2)];
     var $304=($251|0)==($303|0);
     do {
      if ($304) {
       HEAP32[(($302)>>2)]=$R7_1;
       var $cond53=($R7_1|0)==0;
       if (!($cond53)) {
        break;
       }
       var $306=HEAP32[(($300)>>2)];
       var $307=1<<$306;
       var $308=$307^-1;
       var $309=HEAP32[((1580)>>2)];
       var $310=$309&$308;
       HEAP32[((1580)>>2)]=$310;
       break L100;
      } else {
       var $312=$254;
       var $313=HEAP32[((1592)>>2)];
       var $314=($312>>>0)<($313>>>0);
       if ($314) {
        _abort();
        throw "Reached an unreachable!";
       }
       var $316=(($254+16)|0);
       var $317=HEAP32[(($316)>>2)];
       var $318=($317|0)==($251|0);
       if ($318) {
        HEAP32[(($316)>>2)]=$R7_1;
       } else {
        var $321=(($254+20)|0);
        HEAP32[(($321)>>2)]=$R7_1;
       }
       var $324=($R7_1|0)==0;
       if ($324) {
        break L100;
       }
      }
     } while(0);
     var $326=$R7_1;
     var $327=HEAP32[((1592)>>2)];
     var $328=($326>>>0)<($327>>>0);
     if ($328) {
      _abort();
      throw "Reached an unreachable!";
     }
     var $330=(($R7_1+24)|0);
     HEAP32[(($330)>>2)]=$254;
     var $_sum16=((($psize)+(16))|0);
     var $331=(($1+$_sum16)|0);
     var $332=$331;
     var $333=HEAP32[(($332)>>2)];
     var $334=($333|0)==0;
     do {
      if (!($334)) {
       var $336=$333;
       var $337=HEAP32[((1592)>>2)];
       var $338=($336>>>0)<($337>>>0);
       if ($338) {
        _abort();
        throw "Reached an unreachable!";
       } else {
        var $340=(($R7_1+16)|0);
        HEAP32[(($340)>>2)]=$333;
        var $341=(($333+24)|0);
        HEAP32[(($341)>>2)]=$R7_1;
        break;
       }
      }
     } while(0);
     var $_sum17=((($psize)+(20))|0);
     var $344=(($1+$_sum17)|0);
     var $345=$344;
     var $346=HEAP32[(($345)>>2)];
     var $347=($346|0)==0;
     if ($347) {
      break;
     }
     var $349=$346;
     var $350=HEAP32[((1592)>>2)];
     var $351=($349>>>0)<($350>>>0);
     if ($351) {
      _abort();
      throw "Reached an unreachable!";
     } else {
      var $353=(($R7_1+20)|0);
      HEAP32[(($353)>>2)]=$346;
      var $354=(($346+24)|0);
      HEAP32[(($354)>>2)]=$R7_1;
      break;
     }
    }
   } while(0);
   var $358=$213|1;
   var $359=(($_0+4)|0);
   HEAP32[(($359)>>2)]=$358;
   var $360=$_0;
   var $361=(($360+$213)|0);
   var $362=$361;
   HEAP32[(($362)>>2)]=$213;
   var $363=HEAP32[((1596)>>2)];
   var $364=($_0|0)==($363|0);
   if (!($364)) {
    var $_1=$213;
    break;
   }
   HEAP32[((1584)>>2)]=$213;
   return;
  } else {
   var $367=$186&-2;
   HEAP32[(($185)>>2)]=$367;
   var $368=$_0277|1;
   var $369=(($_0+4)|0);
   HEAP32[(($369)>>2)]=$368;
   var $370=$_0;
   var $371=(($370+$_0277)|0);
   var $372=$371;
   HEAP32[(($372)>>2)]=$_0277;
   var $_1=$_0277;
  }
 } while(0);
 var $_1;
 var $374=$_1>>>3;
 var $375=($_1>>>0)<256;
 if ($375) {
  var $377=$374<<1;
  var $378=((1616+($377<<2))|0);
  var $379=$378;
  var $380=HEAP32[((1576)>>2)];
  var $381=1<<$374;
  var $382=$380&$381;
  var $383=($382|0)==0;
  do {
   if ($383) {
    var $385=$380|$381;
    HEAP32[((1576)>>2)]=$385;
    var $_sum13_pre=((($377)+(2))|0);
    var $_pre=((1616+($_sum13_pre<<2))|0);
    var $F16_0=$379;var $_pre_phi=$_pre;
   } else {
    var $_sum14=((($377)+(2))|0);
    var $387=((1616+($_sum14<<2))|0);
    var $388=HEAP32[(($387)>>2)];
    var $389=$388;
    var $390=HEAP32[((1592)>>2)];
    var $391=($389>>>0)<($390>>>0);
    if (!($391)) {
     var $F16_0=$388;var $_pre_phi=$387;
     break;
    }
    _abort();
    throw "Reached an unreachable!";
   }
  } while(0);
  var $_pre_phi;
  var $F16_0;
  HEAP32[(($_pre_phi)>>2)]=$_0;
  var $394=(($F16_0+12)|0);
  HEAP32[(($394)>>2)]=$_0;
  var $395=(($_0+8)|0);
  HEAP32[(($395)>>2)]=$F16_0;
  var $396=(($_0+12)|0);
  HEAP32[(($396)>>2)]=$379;
  return;
 }
 var $398=$_0;
 var $399=$_1>>>8;
 var $400=($399|0)==0;
 do {
  if ($400) {
   var $I19_0=0;
  } else {
   var $402=($_1>>>0)>16777215;
   if ($402) {
    var $I19_0=31;
    break;
   }
   var $404=((($399)+(1048320))|0);
   var $405=$404>>>16;
   var $406=$405&8;
   var $407=$399<<$406;
   var $408=((($407)+(520192))|0);
   var $409=$408>>>16;
   var $410=$409&4;
   var $411=$410|$406;
   var $412=$407<<$410;
   var $413=((($412)+(245760))|0);
   var $414=$413>>>16;
   var $415=$414&2;
   var $416=$411|$415;
   var $417=(((14)-($416))|0);
   var $418=$412<<$415;
   var $419=$418>>>15;
   var $420=((($417)+($419))|0);
   var $421=$420<<1;
   var $422=((($420)+(7))|0);
   var $423=$_1>>>($422>>>0);
   var $424=$423&1;
   var $425=$424|$421;
   var $I19_0=$425;
  }
 } while(0);
 var $I19_0;
 var $427=((1880+($I19_0<<2))|0);
 var $428=(($_0+28)|0);
 var $I19_0_c=$I19_0;
 HEAP32[(($428)>>2)]=$I19_0_c;
 var $429=(($_0+20)|0);
 HEAP32[(($429)>>2)]=0;
 var $430=(($_0+16)|0);
 HEAP32[(($430)>>2)]=0;
 var $431=HEAP32[((1580)>>2)];
 var $432=1<<$I19_0;
 var $433=$431&$432;
 var $434=($433|0)==0;
 if ($434) {
  var $436=$431|$432;
  HEAP32[((1580)>>2)]=$436;
  HEAP32[(($427)>>2)]=$398;
  var $437=(($_0+24)|0);
  var $_c=$427;
  HEAP32[(($437)>>2)]=$_c;
  var $438=(($_0+12)|0);
  HEAP32[(($438)>>2)]=$_0;
  var $439=(($_0+8)|0);
  HEAP32[(($439)>>2)]=$_0;
  return;
 }
 var $441=HEAP32[(($427)>>2)];
 var $442=($I19_0|0)==31;
 if ($442) {
  var $447=0;
 } else {
  var $444=$I19_0>>>1;
  var $445=(((25)-($444))|0);
  var $447=$445;
 }
 var $447;
 var $448=$_1<<$447;
 var $K20_0=$448;var $T_0=$441;
 while(1) {
  var $T_0;
  var $K20_0;
  var $450=(($T_0+4)|0);
  var $451=HEAP32[(($450)>>2)];
  var $452=$451&-8;
  var $453=($452|0)==($_1|0);
  if ($453) {
   break;
  }
  var $455=$K20_0>>>31;
  var $456=(($T_0+16+($455<<2))|0);
  var $457=HEAP32[(($456)>>2)];
  var $458=($457|0)==0;
  var $459=$K20_0<<1;
  if ($458) {
   label = 126;
   break;
  } else {
   var $K20_0=$459;var $T_0=$457;
  }
 }
 if (label == 126) {
  var $461=$456;
  var $462=HEAP32[((1592)>>2)];
  var $463=($461>>>0)<($462>>>0);
  if ($463) {
   _abort();
   throw "Reached an unreachable!";
  }
  HEAP32[(($456)>>2)]=$398;
  var $465=(($_0+24)|0);
  var $T_0_c10=$T_0;
  HEAP32[(($465)>>2)]=$T_0_c10;
  var $466=(($_0+12)|0);
  HEAP32[(($466)>>2)]=$_0;
  var $467=(($_0+8)|0);
  HEAP32[(($467)>>2)]=$_0;
  return;
 }
 var $470=(($T_0+8)|0);
 var $471=HEAP32[(($470)>>2)];
 var $472=$T_0;
 var $473=HEAP32[((1592)>>2)];
 var $474=($472>>>0)<($473>>>0);
 if ($474) {
  _abort();
  throw "Reached an unreachable!";
 }
 var $476=$471;
 var $477=($476>>>0)<($473>>>0);
 if ($477) {
  _abort();
  throw "Reached an unreachable!";
 }
 var $479=(($471+12)|0);
 HEAP32[(($479)>>2)]=$398;
 HEAP32[(($470)>>2)]=$398;
 var $480=(($_0+8)|0);
 var $_c9=$471;
 HEAP32[(($480)>>2)]=$_c9;
 var $481=(($_0+12)|0);
 var $T_0_c=$T_0;
 HEAP32[(($481)>>2)]=$T_0_c;
 var $482=(($_0+24)|0);
 HEAP32[(($482)>>2)]=0;
 return;
}



// EMSCRIPTEN_END_FUNCS
// EMSCRIPTEN_END_FUNCS

// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;

// === Auto-generated postamble setup entry stuff ===

if (memoryInitializer) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    applyData(Module['readBinary'](memoryInitializer));
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      applyData(data);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}

function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  args = args || [];

  if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
    Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
  }

  ensureInitRuntime();

  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);

  initialStackTop = STACKTOP;

  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}




function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    ensureInitRuntime();

    preMain();

    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;

function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;

  // exit the runtime
  exitRuntime();

  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371

  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;

function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }

  ABORT = true;
  EXITSTATUS = 1;

  throw 'abort() at ' + stackTrace();
}
Module['abort'] = Module.abort = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}

run();

// {{POST_RUN_ADDITIONS}}






// {{MODULE_ADDITIONS}}



//@ sourceMappingURL=goshsdl.js.map