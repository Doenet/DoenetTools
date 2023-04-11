"use strict";
/**
 * MathQuillGGB is a fork of MathQuill used and incorporated in
 * the mobile, touch and web versions of GeoGebra.
 * 
 * 
 * Information on the original license of MathQuill:
 * Copyleft 2010-2011 Jay and Han (laughinghan@gmail.com)
 *   under the GNU Lesser General Public License
 *     http://www.gnu.org/licenses/lgpl.html
 * Project Website: http://mathquill.com
 *
 *
 * Information on MathQuillGGB:
 * This file was modified by the colleagues at GeoGebra Inc.
 * The file became part of the web version of the software GeoGebra.
 * Appropriate license terms apply.
 * 
 * This is a minimal version without editing, events, etc. 
 */

window['$ggbQ'] = window.minQuery;

(function() {

var minQuery = $ggbQ;

var mqCmdId = 'mathquillggb-command-id',
  mqBlockId = 'mathquillggb-block-id',
  min = Math.min,
  max = Math.max;
	
function noop() {}

/**
 * A utility higher-order function that makes defining variadic
 * functions more convenient by letting you essentially define functions
 * with the last argument as a splat, i.e. the last argument "gathers up"
 * remaining arguments to the function:
 *   var doStuff = variadic(function(first, rest) { return rest; });
 *   doStuff(1, 2, 3); // => [2, 3]
 */
var __slice = [].slice;
function variadic(fn) {
  var numFixedArgs = fn.length - 1;
  return function() {
    var args = __slice.call(arguments, 0, numFixedArgs);
    var varArg = __slice.call(arguments, numFixedArgs);
    return fn.apply(this, args.concat([ varArg ]));
  };
}

/**
 * A utility higher-order function that makes combining object-oriented
 * programming and functional programming techniques more convenient:
 * given a method name and any number of arguments to be bound, returns
 * a function that calls it's first argument's method of that name (if
 * it exists) with the bound arguments and any additional arguments that
 * are passed:
 *   var sendMethod = send('method', 1, 2);
 *   var obj = { method: function() { return Array.apply(this, arguments); } };
 *   sendMethod(obj, 3, 4); // => [1, 2, 3, 4]
 *   // or more specifically,
 *   var obj2 = { method: function(one, two, three) { return one*two + three; } };
 *   sendMethod(obj2, 3); // => 5
 *   sendMethod(obj2, 4); // => 6
 */
var send = variadic(function(method, args) {
  return variadic(function(obj, moreArgs) {
    if (method in obj) return obj[method].apply(obj, args.concat(moreArgs));
  });
});

/**
 * A utility higher-order function that creates "implicit iterators"
 * from "generators": given a function that takes in a sole argument,
 * a "yield" function, that calls "yield" repeatedly with an object as
 * a sole argument (presumably objects being iterated over), returns
 * a function that calls it's first argument on each of those objects
 * (if the first argument is a function, it is called repeatedly with
 * each object as the first argument, otherwise it is stringified and
 * the method of that name is called on each object (if such a method
 * exists)), passing along all additional arguments:
 *   var a = [
 *     { method: function(list) { list.push(1); } },
 *     { method: function(list) { list.push(2); } },
 *     { method: function(list) { list.push(3); } }
 *   ];
 *   a.each = iterator(function(yield) {
 *     for (var i in this) yield(this[i]);
 *   });
 *   var list = [];
 *   a.each('method', list);
 *   list; // => [1, 2, 3]
 *   // Note that the for-in loop will yield 'each', but 'each' maps to
 *   // the function object created by iterator() which does not have a
 *   // .method() method, so that just fails silently.
 */
function iterator(generator) {
  return variadic(function(fn, args) {
    if (typeof fn !== 'function') fn = send(fn);
    var yield0 = function(obj) { return fn.apply(obj, [ obj ].concat(args)); };
    return generator.call(this, yield0);
  });
}

/**
 * sugar to make defining lots of commands easier.
 * TODO: rethink this.
 */
function bind(cons /*, args... */) {
  var args = __slice.call(arguments, 1);
  return function() {
    return cons.apply(this, args);
  };
}

var P = (function(prototype, ownProperty, undefined) {
  // helper functions that also help minification
  function isObject(o) { return typeof o === 'object'; }
  function isFunction(f) { return typeof f === 'function'; }

  function P(_superclass /* = Object */, definition) {
    // handle the case where no superclass is given
    if (definition === undefined) {
      definition = _superclass;
      _superclass = Object;
    }

    // C is the class to be returned.
    // There are three ways C will be called:
    //
    // 1) We call `new C` to create a new uninitialized object.
    //    The behavior is similar to Object.create, where the prototype
    //    relationship is set up, but the ::init method is not run.
    //    Note that in this case we have `this instanceof C`, so we don't
    //    spring the first trap. Also, `args` is undefined, so the initializer
    //    doesn't get run.
    //
    // 2) A user will simply call C(a, b, c, ...) to create a new object with
    //    initialization.  This allows the user to create objects without `new`,
    //    and in particular to initialize objects with variable arguments, which
    //    is impossible with the `new` keyword.  Note that in this case,
    //    !(this instanceof C) springs the return trap at the beginning, and
    //    C is called with the `new` keyword and one argument, which is the
    //    Arguments object passed in.
    //
    // 3) For internal use only, if new C(args) is called, where args is an
    //    Arguments object.  In this case, the presence of `new` means the
    //    return trap is not sprung, but the initializer is called if present.
    //
    //    You can also call `new C([a, b, c])`, which is equivalent to `C(a, b, c)`.
    //
    //  TODO: the Chrome inspector shows all created objects as `C` rather than `Object`.
    //        Setting the .name property seems to have no effect.  Is there a way to override
    //        this behavior?
    function C(args) {
      var self = this;
      if (!(self instanceof C)) return new C(arguments);
      if (args && isFunction(self.init)) self.init.apply(self, args);
    }

    // set up the prototype of the new class
    // note that this resolves to `new Object`
    // if the superclass isn't given
    var proto = C[prototype] = new _superclass();

    // other variables, as a minifier optimization
    var _super = _superclass[prototype];
    var extensions;

    // set the constructor property on the prototype, for convenience
    proto.constructor = C;

    C.mixin = function(def) {
      C[prototype] = P(C, def)[prototype];
      return C;
    }

    return (C.open = function(def) {
      extensions = {};

      if (isFunction(def)) {
        // call the defining function with all the arguments you need
        // extensions captures the return value.
        extensions = def.call(C, proto, _super, C, _superclass);
      }
      else if (isObject(def)) {
        // if you passed an object instead, we'll take it
        extensions = def;
      }

      // ...and extend it
      if (isObject(extensions)) {
        for (var ext in extensions) {
          if (ownProperty.call(extensions, ext)) {
            proto[ext] = extensions[ext];
          }
        }
      }

      // if there's no init, we assume we're inheriting a non-pjs class, so
      // we default to applying the superclass's constructor.
      if (!isFunction(proto.init)) {
        proto.init = function() { _superclass.apply(this, arguments); };
      }

      return C;
    })(definition);
  }

  // ship it
  return P;

  // as a minifier optimization, we've closured in a few helper functions
  // and the string 'prototype' (C[p] is much shorter than C.prototype)
})('prototype', ({}).hasOwnProperty);

var Parser = P(function(_, _super, Parser) {
  // The Parser object is a wrapper for a parser function.
  // Externally, you use one to parse a string by calling
  //   var result = SomeParser.parse('Me Me Me! Parse Me!');
  // You should never call the constructor, rather you should
  // construct your Parser from the base parsers and the
  // parser combinator methods.

  function parseError(stream, message) {
    if (stream) {
      stream = "'"+stream+"'";
    }
    else {
      stream = 'EOF';
    }

    throw 'Parse Error: '+message+' at '+stream;
  }

  _.init = function(body) { this._ = body; };

  _.parse = function(stream) {
    return this.skip(eof)._(stream, success, parseError);

    function success(stream, result) { return result; }
  };

  // -*- primitive combinators -*- //
  _.or = function(alternative) {
    var self = this;

    return Parser(function(stream, onSuccess, onFailure) {
      return self._(stream, onSuccess, failure);

      function failure(newStream) {
        return alternative._(stream, onSuccess, onFailure);
      }
    });
  };

  _.then = function(next) {
    var self = this;

    return Parser(function(stream, onSuccess, onFailure) {
      return self._(stream, success, onFailure);

      function success(newStream, result) {
        var nextParser = (next instanceof Parser ? next : next(result));
        return nextParser._(newStream, onSuccess, onFailure);
      }
    });
  };

  // -*- optimized iterative combinators -*- //
  _.many = function() {
    var self = this;

    return Parser(function(stream, onSuccess, onFailure) {
      var xs = [];
      while (self._(stream, success, failure)) {
          //
      }
      return onSuccess(stream, xs);

      function success(newStream, x) {
        stream = newStream;
        xs.push(x);
        return true;
      }

      function failure() {
        return false;
      }
    });
  };

  _.times = function(min, max) {
    if (arguments.length < 2) max = min;
    var self = this;

    return Parser(function(stream, onSuccess, onFailure) {
      var xs = [];
      var result = true;
      var failure;

      for (var i = 0; i < min; i += 1) {
        result = self._(stream, success, firstFailure);
        if (!result) return onFailure(stream, failure);
      }

      for (; i < max && result; i += 1) {
        result = self._(stream, success, secondFailure);
      }

      return onSuccess(stream, xs);

      function success(newStream, x) {
        xs.push(x);
        stream = newStream;
        return true;
      }

      function firstFailure(newStream, msg) {
        failure = msg;
        stream = newStream;
        return false;
      }

      function secondFailure(newStream, msg) {
        return false;
      }
    });
  };

  // -*- higher-level combinators -*- //
  _.result = function(res) { return this.then(succeed(res)); };
  _.atMost = function(n) { return this.times(0, n); };
  _.atLeast = function(n) {
    var self = this;
    return self.times(n).then(function(start) {
      return self.many().map(function(end) {
        return start.concat(end);
      });
    });
  };

  _.map = function(fn) {
    return this.then(function(result) { return succeed(fn(result)); });
  };

  _.skip = function(two) {
    return this.then(function(result) { return two.result(result); });
  };

  // -*- primitive parsers -*- //
  var string = this.string = function(str) {
    var len = str.length;
    var expected = "expected '"+str+"'";

    return Parser(function(stream, onSuccess, onFailure) {
      var head = stream.slice(0, len);

      if (head === str) {
        return onSuccess(stream.slice(len), head);
      }
      else {
        return onFailure(stream, expected);
      }
    });
  };

  var regex = this.regex = function(re) {
    var expected = 'expected '+re;

    return Parser(function(stream, onSuccess, onFailure) {
      var match = re.exec(stream);

      if (match) {
        var result = match[0];
        return onSuccess(stream.slice(result.length), result);
      }
      else {
        return onFailure(stream, expected);
      }
    });
  };

  var succeed = Parser.succeed = function(result) {
    return Parser(function(stream, onSuccess) {
      return onSuccess(stream, result);
    });
  };

  var fail = Parser.fail = function(msg) {
    return Parser(function(stream, _, onFailure) {
      return onFailure(stream, msg);
    });
  };

  var letter = Parser.letter = regex(/^[a-z]/i);
  var letters = Parser.letters = regex(/^[a-z]*/i);
  var digit = Parser.digit = regex(/^[0-9]/);
  var digits = Parser.digits = regex(/^[0-9]*/);
  var whitespace = Parser.whitespace = regex(/^\s+/);
  var optWhitespace = Parser.optWhitespace = regex(/^\s*/);

  var any = Parser.any = Parser(function(stream, onSuccess, onFailure) {
    if (!stream) return onFailure(stream, 'expected any character');

    return onSuccess(stream.slice(1), stream.charAt(0));
  });

  var all = Parser.all = Parser(function(stream, onSuccess, onFailure) {
    return onSuccess('', stream);
  });

  var eof = Parser.eof = Parser(function(stream, onSuccess, onFailure) {
    if (stream) return onFailure(stream, 'expected EOF');

    return onSuccess(stream, stream);
  });
});
/*************************************************
 * Base classes of the MathQuillGGB virtual DOM tree
 *
 * Only doing tree node manipulation via these
 * adopt/ disown methods guarantees well-formedness
 * of the tree.
 ************************************************/

// L = 'left'
// R = 'right'
//
// the contract is that they can be used as object properties
// and (-L) === R, and (-R) === L.
var L = -1;
var R = 1;

// directionalizable versions of common jQuery traversals
function jQinsertAdjacent(dir, el, target) {
  return (
    dir === L ?
    el.ggbInsertBefore(target) :
    el.ggbInsertAfter(target)
  );
}

function jQappendDir(dir, el, target) {
  return (
    dir === L ?
    el.ggbPrependTo(target) :
    el.ggbAppendTo(target)
  );
}

function jQgetExtreme(dir, el) {
  return (
    dir === L ?
    el.ggbFirst() :
    el.ggbLast()
  )
}

var Point = P(function(_) {
  _.parent = 0;
  _[L] = 0;
  _[R] = 0;

  _.init = function(parent, prev, next) {
    this.parent = parent;
    this[L] = prev;
    this[R] = next;
  };
});

/**
 * MathQuillGGB virtual-DOM tree-node abstract base class
 */
var Node = P(function(_) {
  _[L] = 0;
  _[R] = 0
  _.parent = 0;
  _.textTemplate = [''];
  //_.text = function() { return ''; };// dummy default (maybe for bugfix)

  var id = 0;
  function uniqueNodeId() { return id += 1; }
  this.byId = {};

  _.init = function() {
    this.id = uniqueNodeId();
    Node.byId[this.id] = this;

    this.ch = {};
    this.ch[L] = 0;
    this.ch[R] = 0;
  };

  _.dispose = function() { delete Node.byId[this.id]; };

  _.toString = function() { return '{{ MathQuillGGB Node #'+this.id+' }}'; };

  _.jQ = minQuery();
  _.jQadd = function(jQ) { this.jQ = this.jQ.ggbAdd(jQ); };
  _.jQize = function() {
    // jQuery-ifies this.html() and links up the .jQ of all corresponding Nodes
    var jQ = minQuery.ggbHTML(this.html());

    // find is OK now, andSelf will be solved by variables/add,
    // each will be emulated by Array.forEach, etc.

    jQ.ggbFind('*').ggbAdd(jQ).forEach(function(el, ind, arr) {
      var jQq = minQuery(el);// this was called var jQ before

      if (el.getAttribute) {
        // avoiding non-Element nodes
        var cmdId = el.getAttribute('mathquillggb-command-id');

        var blockId = el.getAttribute('mathquillggb-block-id');

        if (cmdId) {
          Node.byId[cmdId].jQadd(jQq);
        }
        if (blockId) {
          Node.byId[blockId].jQadd(jQq);
        }
      }
    });
    // now it's a good question what should jQ mean,
    // but it's probably good to keep what is the
    // beginning of this method
    return jQ;
  };

  _.createDir = function(dir, cursor) {
    var node = this;
    node.jQize();
    jQinsertAdjacent(dir, node.jQ, cursor.jQ);
    cursor[dir] = node.adopt(cursor.parent, cursor[L], cursor[R]);
    return node;
  };
  _.createBefore = function(el) { return this.createDir(L, el); };

  _.respace = noop;

  _.bubble = iterator(function(yield0) {
    for (var ancestor = this; ancestor; ancestor = ancestor.parent) {
      var result = yield0(ancestor);
      if (result === false) break;
    }

    return this;
  });

  _.postOrder = iterator(function(yield0) {
    (function recurse(descendant) {
      descendant.eachChild(recurse);
      yield0(descendant);
    })(this);

    return this;
  });

  _.children = function() {
    return Fragment(this.ch[L], this.ch[R]);
  };

  _.eachChild = function() {
    var children = this.children();
    children.each.apply(children, arguments);
    return this;
  };

  _.foldChildren = function(fold, fn) {
    return this.children().fold(fold, fn);
  };

  _.adopt = function(parent, prev, next) {
    Fragment(this, this).adopt(parent, prev, next);
    return this;
  };

  _.disown = function() {
    Fragment(this, this).disown();
    return this;
  };

  _.remove = function() {
    this.jQ.ggbDetach();
    this.postOrder('dispose');
    return this.disown();
  };
});

/**
 * An entity outside the virtual tree with one-way pointers (so it's only a
 * "view" of part of the tree, not an actual node/entity in the tree) that
 * delimits a doubly-linked list of sibling nodes.
 * It's like a fanfic love-child between HTML DOM DocumentFragment and the Range
 * classes: like DocumentFragment, its contents must be sibling nodes
 * (unlike Range, whose contents are arbitrary contiguous pieces of subtrees),
 * but like Range, it has only one-way pointers to its contents, its contents
 * have no reference to it and in fact may still be in the visible tree (unlike
 * DocumentFragment, whose contents must be detached from the visible tree
 * and have their 'parent' pointers set to the DocumentFragment).
 */
var Fragment = P(function(_) {
  //_.text = function() { return ''; };// dummy default (maybe for bugfix)
  _.init = function(first, last) {
    this.ends = {};

    if (!first) return;

    this.ends[L] = first;
    this.ends[R] = last;

    this.jQ = this.fold(this.jQ, function(jQ, el) { return jQ.ggbAdd(el.jQ); });
  };
  _.jQ = minQuery();

  _.adopt = function(parent, prev, next) {
    var self = this;
    self.disowned = false;

    var first = self.ends[L];
    if (!first) return this;

    var last = self.ends[R];

    if (prev) {
      // NB: this is handled in the ::each() block
      // prev[R] = first
    } else {
      parent.ch[L] = first;
    }

    if (next) {
      next[L] = last;
    } else {
      parent.ch[R] = last;
    }

    self.ends[R][R] = next;

    self.each(function(el) {
      el[L] = prev;
      el.parent = parent;
      if (prev) prev[R] = el;

      prev = el;
    });

    return self;
  };

  _.disown = function() {
    var self = this;
    var first = self.ends[L];

    // guard for empty and already-disowned fragments
    if (!first || self.disowned) return self;

    self.disowned = true;

    var last = self.ends[R]
    var parent = first.parent;

    if (first[L]) {
      first[L][R] = last[R];
    } else {
      parent.ch[L] = last[R];
    }

    if (last[R]) {
      last[R][L] = first[L];
    } else {
      parent.ch[R] = first[L];
    }

    return self;
  };

  _.remove = function() {
    this.jQ.ggbDetach();
    this.each('postOrder', 'dispose');
    return this.disown();
  };

  _.each = iterator(function(yield0) {
    var self = this;
    var el = self.ends[L];
    if (!el) return self;

    for (; el !== self.ends[R][R]; el = el[R]) {
      var result = yield0(el);
      if (result === false) break;
    }

    return self;
  });

  _.fold = function(fold, fn) {
    this.each(function(el) {
      fold = fn.call(this, fold, el);
    });

    return fold;
  };

  // create and return the Fragment between Point A and Point B, or if they
  // don't share a parent, between the ancestor of A and the ancestor of B
  // who share a common parent (which would be the lowest common ancestor (LCA)
  // of A and B)
  // There must exist an LCA, i.e., A and B must be in the same tree, and A
  // and B must not be the same Point.
  this.between = function(A, B) {
    var ancA = A; // an ancestor of A
    var ancB = B; // an ancestor of B
    var ancMapA = {}; // a map from the id of each ancestor of A visited
    // so far, to the child of that ancestor who is also an ancestor of B, e.g.
    // the LCA's id maps to the ancestor of the cursor whose parent is the LCA
    var ancMapB = {}; // a map of the castle and school grounds magically
    // displaying the current location of everyone within the covered area,
    // activated by pointing one's wand at it and saying "I solemnly swear
    // that I am up to no good".
    // What do you mean, you expected it to be the same as ancMapA, but
    // ancestors of B instead? That's a complete non sequitur.

    do {
      ancMapA[ancA.parent.id] = ancA;
      ancMapB[ancB.parent.id] = ancB;

      if (ancB.parent.id in ancMapA) {
        ancA = ancMapA[ancB.parent.id];
        break;
      }
      if (ancA.parent.id in ancMapB) {
        ancB = ancMapB[ancA.parent.id];
        break;
      }

      if (ancA.parent) ancA = ancA.parent;
      if (ancB.parent) ancB = ancB.parent;
    } while (ancA.parent || ancB.parent);
    // the only way for this condition to fail is if A and B are in separate
    // trees, which should be impossible, but infinite loops must never happen,
    // even under error conditions.

    // Now we have two either Nodes or Points, guaranteed to have a common
    // parent and guaranteed that if both are Points, they are not the same,
    // and we have to figure out which is on the left and which on the right
    // of the selection.
    var left, right;

    // This is an extremely subtle algorithm.
    // As a special case, ancA could be a Point and ancB a Node immediately
    // to ancA's left.
    // In all other cases,
    // - both Nodes
    // - ancA a Point and ancB a Node
    // - ancA a Node and ancB a Point
    // ancB[R] === next[R] for some next that is ancA or to its right if and
    // only if anticursorA is to the right of cursorA.
    if (ancA[L] !== ancB) {
      for (var next = ancA; next; next = next[R]) {
        if (next[R] === ancB[R]) {
          left = ancA;
          right = ancB;
          break;
        }
      }
    }
    if (!left) {
      left = ancB;
      right = ancA;
    }

    // only want to select Nodes up to Points, can't select Points themselves
    if (left instanceof Point) left = left[R];
    if (right instanceof Point) right = right[L];

    return Fragment(left, right);
  };
});
/*************************************************
 * Abstract classes of math blocks and commands.
 ************************************************/

/**
 * Math tree node base class.
 * Some math-tree-specific extensions to Node.
 * Both MathBlock's and MathCommand's descend from it.
 */
var MathElement = P(Node, function(_, _super) {
  _.finalizeInsert = function() {
    var self = this;
    self.postOrder('finalizeTree');

    // note: this order is important.
    // empty elements need the empty box provided by blur to
    // be present in order for their dimensions to be measured
    // correctly in redraw.
    self.postOrder('blur');

    // adjust context-sensitive spacing
    self.postOrder('respace');
    if (self[R].respace) self[R].respace();
    if (self[L].respace) self[L].respace();

    self.postOrder('redraw');
    self.bubble('redraw');
  };
});

/**
 * Commands and operators, like subscripts, exponents, or fractions.
 * Descendant commands are organized into blocks.
 */
var MathCommand = P(MathElement, function(_, _super) {
  _.init = function(ctrlSeq, htmlTemplate, textTemplate) {
    var cmd = this;
    _super.init.call(cmd);

    if (!cmd.ctrlSeq) cmd.ctrlSeq = ctrlSeq;
    if (htmlTemplate) cmd.htmlTemplate = htmlTemplate;
    if (textTemplate) cmd.textTemplate = textTemplate;
  };

  // obvious methods
  _.replaces = function(replacedFragment) {
    replacedFragment.disown();
    this.replacedFragment = replacedFragment;
  };
  _.isEmpty = function() {
    return this.foldChildren(true, function(isEmpty, child) {
      return isEmpty && child.isEmpty();
    });
  };

  _.parser = function() {
    var block = latexMathParser.block;
    var self = this;

    return block.times(self.numBlocks()).map(function(blocks) {
      self.blocks = blocks;

      for (var i = 0; i < blocks.length; i += 1) {
        blocks[i].adopt(self, self.ch[R], 0);
      }

      return self;
    });
  };

  // createBefore(cursor) and the methods it calls
  _.createBefore = function(cursor) {
    var cmd = this;
    var replacedFragment = cmd.replacedFragment;

    cmd.createBlocks();
    _super.createBefore.call(cmd, cursor);
    if (replacedFragment) {
      replacedFragment.adopt(cmd.ch[L], 0, 0);
      replacedFragment.jQ.ggbAppendTo(cmd.ch[L].jQ);
    }
    cmd.finalizeInsert(cursor);
    cmd.placeCursor(cursor);
  };
  _.createBlocks = function() {
    var cmd = this,
      numBlocks = cmd.numBlocks(),
      blocks = cmd.blocks = Array(numBlocks);

    for (var i = 0; i < numBlocks; i += 1) {
      var newBlock = blocks[i] = MathBlock();
      newBlock.adopt(cmd, cmd.ch[R], 0);
    }
  };
  _.placeCursor = function(cursor) {
    //append the cursor to the first empty child, or if none empty, the last one
    cursor.appendTo(this.foldChildren(this.ch[L], function(prev, child) {
      return prev.isEmpty() ? prev : child;
    }));
  };

  // editability methods: called by the cursor for editing, cursor movements,
  // and selection of the MathQuillGGB tree, these all take in a direction and
  // the cursor
  _.moveTowards = function(dir, cursor) { cursor.appendDir(-dir, this.ch[-dir]); };

  function placeCursorInDir(self, dir, cursor) {
    cursor[-dir] = self;
    cursor[dir] = self[dir];
  }

  _.createSelection = function(dir, cursor) {
    placeCursorInDir(this, dir, cursor);
    cursor.hide().selection = Selection(this);
  }

  _.clearSelection = function(dir, cursor) {
    placeCursorInDir(this, dir, cursor);
    cursor.clearSelection().show();
  };

  _.retractSelection = function(dir, cursor) {
    var self = this, seln = cursor.selection;

    placeCursorInDir(self, dir, cursor);
    jQinsertAdjacent(-dir, self.jQ, seln.jQ);
    seln.ends[-dir] = self[dir];
  };

  _.deleteTowards = _.createSelection;
  _.seek = function(pageX, cursor) {
    cursor.insertAfter(this).seekHoriz(pageX, this.parent);
  };

  // methods involved in creating and cross-linking with HTML DOM nodes
  /*
    They all expect an .htmlTemplate like
      '<span>&0</span>'
    or
      '<span><span>&0</span><span>&1</span></span>'

    See html.test.js for more examples.

    Requirements:
    - For each block of the command, there must be exactly one "block content
      marker" of the form '&<number>' where <number> is the 0-based index of the
      block. (Like the LaTeX \newcommand syntax, but with a 0-based rather than
      1-based index, because JavaScript because C because Dijkstra.)
    - The block content marker must be the sole contents of the containing
      element, there can't even be surrounding whitespace, or else we can't
      guarantee sticking to within the bounds of the block content marker when
      mucking with the HTML DOM.
    - The HTML not only must be well-formed HTML (of course), but also must
      conform to the XHTML requirements on tags, specifically all tags must
      either be self-closing (like '<br/>') or come in matching pairs.
      Close tags are never optional.

    Note that &<number> isn't well-formed HTML; if you wanted a literal '&123',
    your HTML template would have to have '&amp;123'.
  */
  _.numBlocks = function() {
    var matches = this.htmlTemplate.match(/&\d+/g);
    return matches ? matches.length : 0;
  };
  _.html = function() {
    // Render the entire math subtree rooted at this command, as HTML.
    // Expects .createBlocks() to have been called already, since it uses the
    // .blocks array of child blocks.
    //
    // See html.test.js for example templates and intended outputs.
    //
    // Given an .htmlTemplate as described above,
    // - insert the mathquillggb-command-id attribute into all top-level tags,
    //   which will be used to set this.jQ in .jQize().
    //   This is straightforward:
    //     * tokenize into tags and non-tags
    //     * loop through top-level tokens:
    //         * add #cmdId attribute macro to top-level self-closing tags
    //         * else add #cmdId attribute macro to top-level open tags
    //             * skip the matching top-level close tag and all tag pairs
    //               in between
    // - for each block content marker,
    //     + replace it with the contents of the corresponding block,
    //       rendered as HTML
    //     + insert the mathquillggb-block-id attribute into the containing tag
    //   This is even easier, a quick regex replace, since block tags cannot
    //   contain anything besides the block content marker.
    //
    // Two notes:
    // - The outermost loop through top-level tokens should never encounter any
    //   top-level close tags, because we should have first encountered a
    //   matching top-level open tag, all inner tags should have appeared in
    //   matching pairs and been skipped, and then we should have skipped the
    //   close tag in question.
    // - All open tags should have matching close tags, which means our inner
    //   loop should always encounter a close tag and drop nesting to 0. If
    //   a close tag is missing, the loop will continue until i >= tokens.length
    //   and token becomes undefined. This will not infinite loop, even in
    //   production without pray(), because it will then TypeError on .slice().

    var cmd = this;
    var blocks = cmd.blocks;
    var cmdId = ' mathquillggb-command-id=' + cmd.id;
    var tokens = cmd.htmlTemplate.match(/<[^<>]+>|[^<>]+/g);

    // add cmdId to all top-level tags
    for (var i = 0, token = tokens[0]; token; i += 1, token = tokens[i]) {
      // top-level self-closing tags
      if (token.slice(-2) === '/>') {
        tokens[i] = token.slice(0,-2) + cmdId + '/>';
      }
      // top-level open tags
      else if (token.charAt(0) === '<') {
        tokens[i] = token.slice(0,-1) + cmdId + '>';

        // skip matching top-level close tag and all tag pairs in between
        var nesting = 1;
        do {
          i += 1, token = tokens[i];
          // close tags
          if (token.slice(0,2) === '</') {
            nesting -= 1;
          }
          // non-self-closing open tags
          else if (token.charAt(0) === '<' && token.slice(-2) !== '/>') {
            nesting += 1;
          }
        } while (nesting > 0);
      }
    }
    return tokens.join('').replace(/>&(\d+)/g, function($0, $1) {
      return ' mathquillggb-block-id=' + blocks[$1].id + '>' + blocks[$1].join('html');
    });
  };

  // methods to export a string representation of the math tree
  _.latex = function() {
    return this.foldChildren(this.ctrlSeq, function(latex, child) {
      return latex + '{' + (child.latex() || ' ') + '}';
    });
  };
  _.textTemplate = [''];
  _.text = function() {
    var i = 0;
    var thisMathCommand = this;
    return this.foldChildren(this.textTemplate[i], function(text, child) {
      i += 1;
      var child_text = child.text();
      if (text && thisMathCommand.textTemplate[i] === '('
          && child_text[0] === '(' && child_text.slice(-1) === ')')
        return text + child_text.slice(1, -1) + thisMathCommand.textTemplate[i];
      return text + child.text() + (thisMathCommand.textTemplate[i] || '');
    });
  };
});

/**
 * Lightweight command without blocks or children.
 */
var Symbol = P(MathCommand, function(_, _super) {
  _.init = function(ctrlSeq, html, text) {
    if (!text) text = ctrlSeq && ctrlSeq.length > 1 ? ctrlSeq.slice(1) : ctrlSeq;

    _super.init.call(this, ctrlSeq, html, [ text ]);
  };

  _.parser = function() { return Parser.succeed(this); };
  _.numBlocks = function() { return 0; };

  _.replaces = function(replacedFragment) {
    replacedFragment.remove();
  };
  _.createBlocks = noop;

  _.moveTowards = function(dir, cursor) {
    jQinsertAdjacent(dir, cursor.jQ, jQgetExtreme(dir, this.jQ));
    cursor[-dir] = this;
    cursor[dir] = this[dir];
  };
  _.deleteTowards = function(dir, cursor) {
    cursor[dir] = this.remove()[dir];
  };
  _.seek = function(pageX, cursor) {
    
    // jQuery can be substituted until now
    
    // insert at whichever side the click was closer to
    if (pageX - this.jQ.ggbOffsetLeft() < this.jQ.ggbOuterWidth()/2)
      cursor.insertBefore(this);
    else
      cursor.insertAfter(this);
  };

  _.latex = function(){ return this.ctrlSeq; };
  _.text = function() {
	  return this.textTemplate[0];
  };
  _.placeCursor = noop;
  _.isEmpty = function(){ return true; };
});

/**
 * Children and parent of MathCommand's. Basically partitions all the
 * symbols and operators that descend (in the Math DOM tree) from
 * ancestor operators.
 */
var MathBlock = P(MathElement, function(_) {
  _.join = function(methodName) {
    return this.foldChildren('', function(fold, child) {
      return fold + child[methodName]();
    });
  };
  _.html = function() { return this.join('html'); };
  _.latex = function() { return this.join('latex'); };
  _.text = function() {
    return this.ch[L] === this.ch[R] ?
      this.ch[L].text() :
      '(' + this.join('text') + ')'
    ;
  };
  _.isEmpty = function() {
    return this.ch[L] === 0 && this.ch[R] === 0;
  };

  // editability methods: called by the cursor for editing, cursor movements,
  // and selection of the MathQuillGGB tree, these all take in a direction and
  // the cursor
  _.moveOutOf = function(dir, cursor) {
    if (this[dir]) cursor.appendDir(-dir, this[dir]);
    else cursor.insertAdjacent(dir, this.parent);
  };
  _.selectOutOf = function(dir, cursor) {
    var cmd = this.parent;
    cursor.insertAdjacent(dir, cmd);

    var seln = cursor.selection;
    // no selection, create one
    if (!seln) cursor.hide().selection = Selection(cmd);
    // else "level up" selection
    else {
      seln.ends[L] = seln.ends[R] = cmd;
      seln.clear().jQwrap(cmd.jQ);
    }
  };
  _.deleteOutOf = function(dir, cursor) {
    cursor.unwrapGramp();
  };
  _.seek = function(pageX, cursor) {
    cursor.appendTo(this).seekHoriz(pageX, this);
  };
  _.write = function(cursor, ch, replacedFragment) {
    var cmd;
    //if (ch.match(/^[a-eg-zA-Z]$/)) //exclude f because want florin
    if (ch.match(/^[a-zA-Z]$/)) //GeoGebra probably doesn't want florin
      cmd = Variable(ch);
    else if (cmd = CharCmds[ch] || LatexCmds[ch])
      cmd = cmd(ch);
    else
      cmd = VanillaSymbol(ch);

    if (replacedFragment) cmd.replaces(replacedFragment);

    cmd.createBefore(cursor);
  };

  _.focus = function() {
    this.jQ.ggbAddClass('hasCursor');
    this.jQ.ggbRemoveClass('empty');

    return this;
  };
  _.blur = function() {
    this.jQ.ggbRemoveClass('hasCursor');
    if (this.isEmpty())
      this.jQ.ggbAddClass('empty');

    return this;
  };
});

/*********************************************
 * Root math elements with event delegation.
 ********************************************/

function createRoot(jQ, root) {
  var mQ = minQuery(jQ);

  var contents = mQ.ggbContents().ggbDetach();

  mQ.ggbAddClass('mathquillggb-rendered-math');
  mQ.ggbSetAttribute(mqBlockId, root.id);

  root.jQ = mQ;
  root.revert = function() {

    mQ.ggbContents().ggbDetach();
    mQ.ggbRemoveClass('mathquillggb-rendered-math')
      .ggbAppend(contents);

    // unbind is only in jQuery, difficult to implement
    // and it's probably unnecessary, as jQuery's bind is not used
    // here except this.redraw.bind(this); but jQ is the main
    // object and where it is used are minor objects
  };

  var cursor = root.cursor = Cursor(root);

  // domobject.textContent, not the same as jquery.text() in case of script, style, and maybe input
  root.renderLatex(contents.ggbText());

  // Arpad: some other things are needed here, otherwise the LaTeX would be duplicated!

  //textarea stuff
  var textareaSpan = root.textarea = minQuery.ggbHTML('<span class="textarea"><textarea></textarea></span>');
  var textarea = textareaSpan.ggbChildren();// or ggbContents(), doesn't matter as it's only textarea

  mQ.ggbPrepend(minQuery.ggbHTML('<span class="selectable">$'+root.latex()+'$</span>'));

  textarea[0].onblur = function() {
    cursor.clearSelection();
    setTimeout(detach); //detaching during blur explodes in WebKit
  };
  function detach() {
    textareaSpan.ggbDetach();
  }
  return;
}

var RootMathBlock = P(MathBlock, function(_, _super) {
  _.latex = function() {
    return _super.latex.call(this).replace(/(\\[a-z]+) (?![a-z])/ig,'$1');
  };
  _.text = function() {
    return this.foldChildren('', function(text, child) {
      return text + child.text();
    });
  };
  _.renderLatex = function(latex) {
    var mQ = this.jQ;

    // not exactly the same, but should work in theory
    // the goal is that this.jQ should contain only one element
    // and this change should be done in the DOM as well
    minQuery(mQ.ggbChildren().slice(1)).ggbDetach();
    //minQuery(mQ.ggbChildren().splice(1)).ggbDetach();

    // DOM is OK, but this.jQ should be changed as well... TODO: or not?
    //this.jQ = minQuery(mQ.ggbChildren().slice(0,1));//minQuery(this.jQ[0]);
    //this.jQ = minQuery(this.jQ[0]);

    this.ch[L] = this.ch[R] = 0;

    this.cursor.appendTo(this).writeLatex(latex);
  };
  _.onText = function(ch) {
    this.cursor.write(ch);
    return false;
  };
});

/***************************
 * Commands and Operators.
 **************************/

var CharCmds = {}, LatexCmds = {}; //single character commands, LaTeX commands

var scale, // = function(jQ, x, y) { ... }
//will use a CSS 2D transform to scale the jQuery-wrapped HTML elements,
//or the filter matrix transform fallback for IE 5.5-8, or gracefully degrade to
//increasing the fontSize to match the vertical Y scaling factor.

//ideas from http://github.com/louisremi/jquery.transform.js
//see also http://msdn.microsoft.com/en-us/library/ms533014(v=vs.85).aspx

  forceIERedraw = noop,
  div = document.createElement('div'),
  div_style = div.style,
  transformPropNames = [
    'transform',
    //'-webkit-transform',
    'webkitTransform',
    'WebkitTransform',
    //'-moz-transform',
    'mozTransform',
    'MozTransform',
    //'-o-transform',
    'oTransform',
    'OTransform',
    //'-ms-transform',
    'msTransform',
    'MsTransform'
  ],
  transformPropName;

for (var iii = 0; iii < transformPropNames.length; iii++) {
  if (transformPropNames[iii] in div_style) {
    transformPropName = transformPropNames[iii];
    break;
  }
}

if (transformPropName) {
  scale = function(jQ, x, y) {
    jQ.ggbCSS(transformPropName, 'scale('+x+','+y+')');
  };
} else {
  scale = function(jQ, x, y) {
    jQ.ggbCSS('fontSize', y + 'em');
  };
}

var Style = P(MathCommand, function(_, _super) {
  _.init = function(ctrlSeq, tagName, attrs) {
    _super.init.call(this, ctrlSeq, '<'+tagName+' '+attrs+'>&0</'+tagName+'>');
  };
  _.text = function() {
    var i = 0;
    var thisMathCommand = this;
    return this.foldChildren(this.textTemplate[i], function(text, child) {
      i += 1;
      var child_text = child.text();
      if (child_text[0] === '(' && child_text.slice(-1) === ')') {
    	// There may be cases when the '(' and ')' are harmful!
    	// Only one pair of '(' and ')' should remain,
    	// and this is OK at the parent node of this Style.
    	// But if the parent node of this Style is RootMathBlock,
    	// then there will be no '(' and ')', so OK.
      	child_text = child_text.slice(1, -1);
        //return text + child_text.slice(1, -1) + thisMathCommand.textTemplate[i];
      }
      return text + child_text + (thisMathCommand.textTemplate[i] || '');
    });
  };
});

//fonts
LatexCmds.mathrm = bind(Style, '\\mathrm', 'span', 'class="roman font"');
LatexCmds.mathit = bind(Style, '\\mathit', 'i', 'class="font"');
LatexCmds.mathbf = bind(Style, '\\mathbf', 'b', 'class="font"');
LatexCmds.mathsf = bind(Style, '\\mathsf', 'span', 'class="sans-serif font"');
LatexCmds.mathtt = bind(Style, '\\mathtt', 'span', 'class="monospace font"');
//text-decoration
LatexCmds.underline = bind(Style, '\\underline', 'span', 'class="non-leaf underline"');
LatexCmds.overline = LatexCmds.bar = bind(Style, '\\overline', 'span', 'class="non-leaf overline"');

// colors
LatexCmds.lightviolet = bind(Style, '\\lightviolet', 'span', 'style="color:#E0B0FF"');
LatexCmds.lightyellow = bind(Style, '\\lightyellow', 'span', 'style="color:#FFFACD"');
LatexCmds.lightgreen = bind(Style, '\\lightgreen', 'span', 'style="color:#D0F0C0"');
LatexCmds.lightorange = bind(Style, '\\lightorange', 'span', 'style="color:#FFEFD5"');
LatexCmds.yellow = bind(Style, '\\yellow', 'span', 'style="color:#FFFF00"');
LatexCmds.darkblue = bind(Style, '\\darkblue', 'span', 'style="color:#1C39BB"');
LatexCmds.lightpurple = bind(Style, '\\lightpurple', 'span', 'style="color:#CCCCFF"');
LatexCmds.lightblue = bind(Style, '\\lightblue', 'span', 'style="color:#7D7DFF"');
LatexCmds.maroon = bind(Style, '\\maroon', 'span', 'style="color:#800000"');
LatexCmds.lightgray = bind(Style, '\\lightgray', 'span', 'style="color:#A0A0A0"');
LatexCmds.pink = bind(Style, '\\pink', 'span', 'style="color:#FFC0CB"');
LatexCmds.gold = bind(Style, '\\gold', 'span', 'style="color:#FFD700"');
LatexCmds.black = bind(Style, '\\black', 'span', 'style="color:#000000"');
LatexCmds.orange = bind(Style, '\\orange', 'span', 'style="color:#FF7F00"');
LatexCmds.indigo = bind(Style, '\\indigo', 'span', 'style="color:#4B0082"');
LatexCmds.purple = bind(Style, '\\purple', 'span', 'style="color:#800080"');
LatexCmds.darkgray = bind(Style, '\\darkgray', 'span', 'style="color:#202020"');
LatexCmds.green = bind(Style, '\\green', 'span', 'style="color:#00FF00"');
LatexCmds.silver = bind(Style, '\\silver', 'span', 'style="color:#404040"');
LatexCmds.white = bind(Style, '\\white', 'span', 'style="color:#FFFFFF"');
LatexCmds.lime = bind(Style, '\\lime', 'span', 'style="color:#BFFF00"');
LatexCmds.gray = bind(Style, '\\gray', 'span', 'style="color:#808080"');
LatexCmds.darkgreen = bind(Style, '\\darkgreen', 'span', 'style="color:#006400"');
LatexCmds.magenta = bind(Style, '\\magenta', 'span', 'style="color:#FF00FF"');
LatexCmds.cyan = bind(Style, '\\cyan', 'span', 'style="color:#00FFFF"');
LatexCmds.red = bind(Style, '\\red', 'span', 'style="color:#FF0000"');
LatexCmds.crimson = bind(Style, '\\crimson', 'span', 'style="color:#DC143C"');
LatexCmds.turquoise = bind(Style, '\\turquoise', 'span', 'style="color:#AFEEEE"');
LatexCmds.blue = bind(Style, '\\blue', 'span', 'style="color:#0000FF"');
LatexCmds.violet = bind(Style, '\\violet', 'span', 'style="color:#7F00FF"');
LatexCmds.brown = bind(Style, '\\brown', 'span', 'style="color:#993300"');
LatexCmds.aqua = bind(Style, '\\aqua', 'span', 'style="color:#BCD4E6"');

var SomethingHTML = P(MathCommand, function(_, _super) {
  _.init = function(ctrlSeq, HTML) {
   _super.init.call(this, ctrlSeq, HTML);
  };
});

var scbHTML = '<span><span style="display: none;">&0</span><span>&1</span></span>';
LatexCmds.scalebox = bind(SomethingHTML, '\\scalebox', scbHTML);

var gapHTML = '<span style="visibility: hidden;">&0</span>';
LatexCmds.phantom = bind(SomethingHTML, '\\phantom', gapHTML);

// this is like \\cr but it has an argument that is currently neglected
var brHTML = '<span><span style="display: none;">&0</span><br/></span>';
LatexCmds.vspace = bind(SomethingHTML, '\\vspace', brHTML);

var hatHTML = '<span class="array non-leaf vbottom"><span class="hat">^</span><span>&0</span></span>';
LatexCmds.hat = bind(SomethingHTML, '\\hat', hatHTML);

// MathQuillGGB hacks by GeoGebra
var vecHTML = '<table style="display:inline-table;vertical-align:middle;" cellpadding="0" cellspacing="0"><tr><td class="hackedmq"><span class="down">&rarr;</span></td></tr><tr><td class="hackedmq"><span class="up">&0</span></td></tr></table>';
LatexCmds.overrightarrow = bind(SomethingHTML, '\\overrightarrow', vecHTML);
LatexCmds.vec = bind(SomethingHTML, '\\vec', vecHTML);
LatexCmds.cr = bind(Symbol, '\\cr', '<div style="display:block;height:1px;width:1px;"> </div>');
LatexCmds.equals = bind(Symbol, '\\equals', ' <span>=</span> ');// to be different from simple "="

var ggbtableHTML = '<table style="display:inline-table;vertical-align:middle;" cellpadding="0" cellspacing="0">&0</table>';
var ggbtrHTML = '<tr>&0</tr>';
var ggbtrlHTML = '<tr style="border-top: black solid 2px; border-bottom: black solid 2px;">&0</tr>';
var ggbtrltHTML = '<tr style="border-top: black solid 2px;">&0</tr>';
var ggbtrlbHTML = '<tr style="border-bottom: black solid 2px;">&0</tr>';

var ggbtdRHTML = '<td style="min-width: 1em; text-align: right; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';
var ggbtdlRHTML = '<td style="border-left: black solid 2px; border-right: black solid 2px; min-width: 1em; text-align: right; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';
var ggbtdllRHTML = '<td style="border-left: black solid 2px; min-width: 1em; text-align: right; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';
var ggbtdlrRHTML = '<td style="border-right: black solid 2px; min-width: 1em; text-align: right; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';

var ggbtdCHTML = '<td style="min-width: 1em; text-align: center; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';
var ggbtdlCHTML = '<td style="border-left: black solid 2px; border-right: black solid 2px; min-width: 1em; text-align: center; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';
var ggbtdllCHTML = '<td style="border-left: black solid 2px; min-width: 1em; text-align: center; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';
var ggbtdlrCHTML = '<td style="border-right: black solid 2px; min-width: 1em; text-align: center; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';

var ggbtdLHTML = '<td style="min-width: 1em; text-align: left; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';
var ggbtdlLHTML = '<td style="border-left: black solid 2px; border-right: black solid 2px; min-width: 1em; text-align: left; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';
var ggbtdllLHTML = '<td style="border-left: black solid 2px; min-width: 1em; text-align: left; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';
var ggbtdlrLHTML = '<td style="border-right: black solid 2px; min-width: 1em; text-align: left; vertical-align: middle; padding-left: 4px; padding-right: 4px;">&0</td>';

LatexCmds.ggbtable = bind(SomethingHTML, '\\ggbtable', ggbtableHTML);
LatexCmds.ggbtr = bind(SomethingHTML, '\\ggbtr', ggbtrHTML);
LatexCmds.ggbtrl = bind(SomethingHTML, '\\ggbtrl', ggbtrlHTML);
LatexCmds.ggbtrlt = bind(SomethingHTML, '\\ggbtrlt', ggbtrltHTML);
LatexCmds.ggbtrlb = bind(SomethingHTML, '\\ggbtrlb', ggbtrlbHTML);

LatexCmds.ggbtdR = bind(SomethingHTML, '\\ggbtdR', ggbtdRHTML);
LatexCmds.ggbtdlR = bind(SomethingHTML, '\\ggbtdlR', ggbtdlRHTML);
LatexCmds.ggbtdllR = bind(SomethingHTML, '\\ggbtdllR', ggbtdllRHTML);
LatexCmds.ggbtdlrR = bind(SomethingHTML, '\\ggbtdlrR', ggbtdlrRHTML);

LatexCmds.ggbtd = bind(SomethingHTML, '\\ggbtd', ggbtdCHTML);
LatexCmds.ggbtdl = bind(SomethingHTML, '\\ggbtdl', ggbtdlCHTML);
LatexCmds.ggbtdll = bind(SomethingHTML, '\\ggbtdll', ggbtdllCHTML);
LatexCmds.ggbtdlr = bind(SomethingHTML, '\\ggbtdlr', ggbtdlrCHTML);

LatexCmds.ggbtdL = bind(SomethingHTML, '\\ggbtdL', ggbtdLHTML);
LatexCmds.ggbtdlL = bind(SomethingHTML, '\\ggbtdlL', ggbtdlLHTML);
LatexCmds.ggbtdllL = bind(SomethingHTML, '\\ggbtdllL', ggbtdllLHTML);
LatexCmds.ggbtdlrL = bind(SomethingHTML, '\\ggbtdlrL', ggbtdlrLHTML);

// `\textcolor{color}{math}` will apply a color to the given math content, where
// `color` is any valid CSS Color Value (see [SitePoint docs][] (recommended),
// [Mozilla docs][], or [W3C spec][]).
//
// [SitePoint docs]: http://reference.sitepoint.com/css/colorvalues
// [Mozilla docs]: https://developer.mozilla.org/en-US/docs/CSS/color_value#Values
// [W3C spec]: http://dev.w3.org/csswg/css3-color/#colorunits
var TextColor = LatexCmds.textcolor = P(MathCommand, function(_, _super) {
  _.htmlTemplate = '<span>&0</span>';
  _.jQadd = function() {
    _super.jQadd.apply(this, arguments);
    this.jQ.ggbCSS('color', this.color);
  };

  _.parser = function() {
    var self = this;
    var optWhitespace = Parser.optWhitespace;
    var string = Parser.string;
    var regex = Parser.regex;

    return optWhitespace
      .then(string('{'))
      .then(regex(/^[^{}]*/))
      .skip(string('}'))
      .then(function(color) {
        self.color = color;
        return _super.parser.call(self);
      })
    ;
  };
});

var ForeGroundColor = LatexCmds.fgcolor = P(TextColor, function(_, _super) {
  _.jQadd = function() {
    _super.jQadd.apply(this, arguments);
    this.jQ.ggbCSS('color', '#'+this.color);
  };
});

var BackGroundColor = LatexCmds.bgcolor = P(TextColor, function(_, _super) {
  _.jQadd = function() {
    _super.jQadd.apply(this, arguments);
    this.jQ.ggbCSS('backgroundColor', '#'+this.color);
  };
});

var SupSub = P(MathCommand, function(_, _super) {
  _.init = function(ctrlSeq, tag, text) {
    _super.init.call(this, ctrlSeq, '<'+tag+' class="non-leaf">&0</'+tag+'>', [ text ]);
  };
  _.finalizeTree = function() {
    //TODO: use inheritance
    if (this.ctrlSeq === '_') {
      this.downInto = this.ch[L];
      this.ch[L].upOutOf = insertBeforeUnlessAtEnd;
    }
    else {
      this.upInto = this.ch[L];
      this.ch[L].downOutOf = insertBeforeUnlessAtEnd;
    }
    function insertBeforeUnlessAtEnd(cursor) {
      // cursor.insertBefore(cmd), unless cursor at the end of block, and every
      // ancestor cmd is at the end of every ancestor block
      var cmd = this.parent, ancestorCmd = cursor;
      do {
        if (ancestorCmd[R]) {
          cursor.insertBefore(cmd);
          return false;
        }
        ancestorCmd = ancestorCmd.parent.parent;
      } while (ancestorCmd !== cmd);
      cursor.insertAfter(cmd);
      return false;
    }
  };
  _.latex = function() {
    var latex = this.ch[L].latex();
    if (latex.length === 1)
      return this.ctrlSeq + latex;
    else
      return this.ctrlSeq + '{' + (latex || ' ') + '}';
  };
  _.redraw = function() {
    if (this[L])
      this[L].respace();
    //SupSub::respace recursively calls respace on all the following SupSubs
    //so if prev is a SupSub, no need to call respace on this or following nodes
    if (!(this[L] instanceof SupSub)) {
      this.respace();
      //and if next is a SupSub, then this.respace() will have already called
      //this[R].respace()
      if (this[R] && !(this[R] instanceof SupSub))
        this[R].respace();
    }
  };
  _.respace = function() {
    if (
      this[L].ctrlSeq === '\\int ' || (
        this[L] instanceof SupSub && this[L].ctrlSeq != this.ctrlSeq
        && this[L][L] && this[L][L].ctrlSeq === '\\int '
      )
    ) {
      if (!this.limit) {
        this.limit = true;
        this.jQ.ggbAddClass('limit');
      }
    }
    else {
      if (this.limit) {
        this.limit = false;
        this.jQ.ggbRemoveClass('limit');
      }
    }

    this.respaced = this[L] instanceof SupSub && this[L].ctrlSeq != this.ctrlSeq && !this[L].respaced;
    if (this.respaced) {
      var fontSize = +this.jQ.ggbCSS('font-size').slice(0,-2),
        prevWidth = this[L].jQ.ggbOuterWidth(),
        thisWidth = this.jQ.ggbOuterWidth();
      this.jQ.ggbCSS('left', (this.limit && this.ctrlSeq === '_' ? -.25 : 0) - prevWidth/fontSize + 'em');
      this.jQ.ggbCSS('marginRight', .1 - min(thisWidth, prevWidth)/fontSize + 'em');
    }
    else if (this.limit && this.ctrlSeq === '_') {
      this.jQ.ggbCSS('left', '-.25em');
      this.jQ.ggbCSS('marginRight', '');
    }
    else {
      this.jQ.ggbCSS('left', '');
      this.jQ.ggbCSS('marginRight', '');
    }

    if (this[R] instanceof SupSub)
      this[R].respace();

    return this;
  };
});

LatexCmds.subscript =
LatexCmds._ = bind(SupSub, '_', 'sub', '_');

LatexCmds.superscript =
LatexCmds.supscript =
LatexCmds['^'] = bind(SupSub, '^', 'sup', '^');

var Fraction =
	LatexCmds.frac =
	LatexCmds.dfrac =
	LatexCmds.cfrac =
	LatexCmds.fraction = P(MathCommand, function(_, _super) {
	  _.ctrlSeq = '\\frac';
	  _.htmlTemplate =
	      '<span class="fraction non-leaf">'
	    +   '<span class="numerator">&0</span>'
	    +   '<span class="denominator">&1</span>'
	    +   '<span style="display:inline-block;width:0">&nbsp;</span>'
	    + '</span>'
	  ;
	  _.textTemplate = ['(', '/', ')'];
	  _.finalizeTree = function() {
	    this.upInto = this.ch[R].upOutOf = this.ch[L];
	    this.downInto = this.ch[L].downOutOf = this.ch[R];
	  };
	});

// eg FormulaText["\lim_{x \to 33} \left( x^2 \right)"]
var Limit =
	LatexCmds.lim =
	LatexCmds.lim_ = P(MathCommand, function(_, _super) {
	  _.ctrlSeq = '\\lim_';
	  _.htmlTemplate =
	      '<span class="limit non-leaf">'
	    +   '<span class="limittop">lim</span>'
	    +   '<span class="limitbottom">&0</span>'
	    +   '<span style="display:inline-block;width:0">&nbsp;</span>'
	    + '</span>'
	  ;
	  _.textTemplate = ['(', '/', ')'];
	  _.finalizeTree = function() {
	    this.upInto = this.ch[R].upOutOf = this.ch[L];
	    this.downInto = this.ch[L].downOutOf = this.ch[R];
	  };
	});

var LiveFraction =
LatexCmds.over =
CharCmds['/'] = P(Fraction, function(_, _super) {
  _.createBefore = function(cursor) {
    if (!this.replacedFragment) {
      var prev = cursor[L];
      while (prev &&
        !(
          prev instanceof BinaryOperator ||
          prev instanceof TextBlock ||
          prev instanceof BigSymbol
        ) //lookbehind for operator
      )
        prev = prev[L];

      if (prev instanceof BigSymbol && prev[R] instanceof SupSub) {
        prev = prev[R];
        if (prev[R] instanceof SupSub && prev[R].ctrlSeq != prev.ctrlSeq)
          prev = prev[R];
      }

      if (prev !== cursor[L]) {
        this.replaces(Fragment(prev[R] || cursor.parent.ch[L], cursor[L]));
        cursor[L] = prev;
      }
    }
    _super.createBefore.call(this, cursor);
  };
});

var SquareRoot =
LatexCmds.Sqrt =
LatexCmds.sqrt =
LatexCmds['\u221a'] = P(MathCommand, function(_, _super) {
  _.ctrlSeq = '\\sqrt';
  _.htmlTemplate =
      '<span class="non-leaf sqrt-parent">'
    +   '<span class="scaled sqrt-prefix">&radic;</span>'
    +   '<span class="non-leaf sqrt-stem">&0</span>'
    + '</span>'
  ;
  _.textTemplate = ['sqrt(', ')'];
  _.parser = function() {
    return latexMathParser.optBlock.then(function(optBlock) {
      return latexMathParser.block.map(function(block) {
        var nthroot = NthRoot();
        nthroot.blocks = [ optBlock, block ];
        optBlock.adopt(nthroot, 0, 0);
        block.adopt(nthroot, optBlock, 0);
        return nthroot;
      });
    }).or(_super.parser.call(this));
  };
  _.redraw = function() {
    var block = this.ch[R].jQ;

    var bh = block.ggbOuterHeight();
    var bo = block.ggbCSS('border-bottom-width');
    if (bo) {
      if (bo.length > 2 && bo.substr(-2) == "px") {
        bh -= bo.slice(0,-2);  
      } else {
        bh -= parseInt(bo);
      }
    }
    bo = block.ggbCSS('border-top-width');
    if (bo) {
      if (bo.length > 2 && bo.substr(-2) == "px") {
        bh -= bo.slice(0,-2);  
      } else {
        bh -= parseInt(bo);
      }
    }

    var fs = 0;
    if (block.ggbCSS('font-size').length > 2) {
      if (block.ggbCSS('font-size').substr(-2) == "px") {
        fs = block.ggbCSS('font-size').slice(0,-2);
      }
    }
    if ((fs > 0) && (bh > 0)) {
        if (block.ggbPrev) {
            scale(block.ggbPrev(), 1, bh/fs);
        }
      if (this.tries) {
        delete this.tries;
      }
    } else if (fs > 0) {
      if (this.tries) {
        this.tries--;
      } else {
        this.tries = 20;
      }
      if (this.tries > 0) {
        var thisfunction = this.redraw.bind(this);

        // assume 60 FPS refresh rate; meaning refresh
        // in every 0.0166 seconds, or 16.6 milliseconds
        // 60 ms is probably good, almost in every third frame
        // this way "tries" is no more than 20
        setTimeout(thisfunction, 60);
      } else {
        delete this.tries;
      }
    }
  };
});


var NthRoot =
LatexCmds.nroot =
LatexCmds.nthroot = P(SquareRoot, function(_, _super) {
  _.htmlTemplate =
      '<sup class="nthroot non-leaf">&0</sup>'
    + '<span class="scaled sqrt-parent">'
    +   '<span class="sqrt-prefix scaled">&radic;</span>'
    +   '<span class="sqrt-stem non-leaf">&1</span>'
    + '</span>'
  ;
  _.textTemplate = ['nroot(', ',', ')'];
  _.text = function() {
     return 'nroot('+
        this.ch[R].text()+
        ','+
        this.ch[L].text()+
        ')';
  };
  _.latex = function() {
    return '\\sqrt['+this.ch[L].latex()+']{'+this.ch[R].latex()+'}';
  };
});


var HalfBracket = P(MathCommand, function(_, _super) {
  _.init = function(open, close, ctrlSeq) {
    _super.init.call(this, ctrlSeq,
      '<span class="non-leaf paren-parent">'
      +   '<span class="scaled paren">'+open+'</span>'
      +   '<span class="non-leaf">&0</span>'
      +   '<span class="scaled paren">'+close+'</span>'
      + '</span>',
    [open, close]);

    // note that either open or close should be empty,
    // or this makes a different syntax to brackets!
    // different syntax was created for making it easier
    // to use different kinds of brackets for opening and closing...
  };

  _.jQadd = function() {
    _super.jQadd.apply(this, arguments);
    var jQ = this.jQ;
    this.bracketjQs = jQ.ggbChildren(':first').ggbAdd(jQ.ggbChildren(':last'));
  };

  _.latex = function() {
    return this.ctrlSeq + "{" + this.ch[L].latex() + "}";
  };

  _.redraw = function() {
	var blockjQ = this.ch[L].jQ;
    var bh = blockjQ.ggbOuterHeight();
    var fs = 0;
    if (blockjQ.ggbCSS('font-size').length > 2) {
      if (blockjQ.ggbCSS('font-size').substr(-2) == "px") {
        fs = blockjQ.ggbCSS('font-size').slice(0,-2);
      }
    }
    if ((fs > 0) && (bh > 0)) {
      var height = bh/+fs;
      scale(this.bracketjQs, min(1 + .2*(height - 1), 1.2), 0.9 * height);
      if (this.tries) {
        delete this.tries;
      }
    } else if (fs > 0) {
      if (this.tries) {
        this.tries--;
      } else {
        this.tries = 20;
      }
      if (this.tries > 0) {
        var thisfunction = this.redraw.bind(this);

        // assume 60 FPS refresh rate; meaning refresh
        // in every 0.0166 seconds, or 16.6 milliseconds
        // 60 ms is probably good, almost in every third frame
        // this way "tries" is no more than 20
        setTimeout(thisfunction, 60);
      } else {
        delete this.tries;
      }
    }
  };
});

LatexCmds.openbraceonly = bind(HalfBracket, '{', '', '\\openbraceonly');
LatexCmds.closebraceonly = bind(HalfBracket, '', '}', '\\closebraceonly');

LatexCmds.openbracketonly = bind(HalfBracket, '[', '', '\\openbracketonly');
LatexCmds.closebracketonly = bind(HalfBracket, '', ']', '\\closebracketonly');

LatexCmds.openparenonly = bind(HalfBracket, '(', '', '\\openparenonly');
LatexCmds.closeparenonly = bind(HalfBracket, '', ')', '\\closeparenonly');

LatexCmds.openlineonly = bind(HalfBracket, '|', '', '\\openlineonly');
LatexCmds.closelineonly = bind(HalfBracket, '', '|', '\\closelineonly');

LatexCmds.opendoubleonly = bind(HalfBracket, '||', '', '\\opendoubleonly');
LatexCmds.closedoubleonly = bind(HalfBracket, '', '||', '\\closedoubleonly');

// In theory, it's possible to add mixed brackets, but why?


// Round/Square/Curly/Angle Brackets (aka Parens/Brackets/Braces)
var Bracket = P(MathCommand, function(_, _super) {
  _.init = function(open, close, ctrlSeq, end) {
    _super.init.call(this, '\\left'+ctrlSeq,
        '<span class="non-leaf paren-parent">'
      +   '<span class="scaled paren">'+open+'</span>'
      +   '<span class="non-leaf">&0</span>'
      +   '<span class="scaled paren">'+close+'</span>'
      + '</span>',
      [open, close]);
    this.end = '\\right'+end;
  };
  _.jQadd = function() {
    _super.jQadd.apply(this, arguments);
    var jQ = this.jQ;
    this.bracketjQs = jQ.ggbChildren(':first').ggbAdd(jQ.ggbChildren(':last'));
  };
  _.latex = function() {
    return this.ctrlSeq + this.ch[L].latex() + this.end;
  };
  _.redraw = function() {
    var blockjQ = this.ch[L].jQ;
    var bh = blockjQ.ggbOuterHeight();
    var fs = 0;
    if (blockjQ.ggbCSS('font-size').length > 2) {
      if (blockjQ.ggbCSS('font-size').substr(-2) == "px") {
        fs = blockjQ.ggbCSS('font-size').slice(0,-2);
      }
    }
    if ((fs > 0) && (bh > 0)) {
      var height = bh/+fs;
      scale(this.bracketjQs, min(1 + .2*(height - 1), 1.2), 0.9 * height);
      if (this.tries) {
        delete this.tries;
      }
    } else if (fs > 0) {
      if (this.tries) {
        this.tries--;
      } else {
        this.tries = 20;
      }
      if (this.tries > 0) {
        var thisfunction = this.redraw.bind(this);

        // assume 60 FPS refresh rate; meaning refresh
        // in every 0.0166 seconds, or 16.6 milliseconds
        // 60 ms is probably good, almost in every third frame
        // this way "tries" is no more than 20
        setTimeout(thisfunction, 60);
      } else {
        delete this.tries;
      }
    }
  };
});

LatexCmds.left = P(MathCommand, function(_) {
  _.parser = function() {
    var regex = Parser.regex;
    var string = Parser.string;
    var regex = Parser.regex;
    var succeed = Parser.succeed;
    var block = latexMathParser.block;
    var optWhitespace = Parser.optWhitespace;

    return optWhitespace.then(regex(/^(?:[([|]|\\\{)/))
      .then(function(open) {
        if (open.charAt(0) === '\\') open = open.slice(1);

        var cmd = CharCmds[open]();

        return latexMathParser
          .map(function (block) {
            cmd.blocks = [ block ];
            block.adopt(cmd, 0, 0);
          })
          .then(string('\\right'))
          .skip(optWhitespace)
          .then(regex(/^(?:[\])|]|\\\})/))
          .then(function(close) {
            if (close.slice(-1) !== cmd.end.slice(-1)) {
              return Parser.fail('open doesn\'t match close');
            }

            return succeed(cmd);
          })
        ;
      })
    ;
  };
});

LatexCmds.right = P(MathCommand, function(_) {
  _.parser = function() {
    return Parser.fail('unmatched \\right');
  };
});

LatexCmds.lbrace =
CharCmds['{'] = bind(Bracket, '{', '}', '\\{', '\\}');
LatexCmds.langle =
LatexCmds.lang = bind(Bracket, '&lang;','&rang;','\\langle ','\\rangle ');

// Closing bracket matching opening bracket above
var CloseBracket = P(Bracket, function(_, _super) {
  _.createBefore = function(cursor) {
    // if I'm at the end of my parent who is a matching open-paren,
    // and I am not replacing a selection fragment, don't create me,
    // just put cursor after my parent
    if (!cursor[R] && cursor.parent.parent && cursor.parent.parent.end === this.end && !this.replacedFragment)
      cursor.insertAfter(cursor.parent.parent);
    else
      _super.createBefore.call(this, cursor);
  };
  _.placeCursor = function(cursor) {
    this.ch[L].blur();
    cursor.insertAfter(this);
  };
});

LatexCmds.rbrace =
CharCmds['}'] = bind(CloseBracket, '{','}','\\{','\\}');
LatexCmds.rangle =
LatexCmds.rang = bind(CloseBracket, '&lang;','&rang;','\\langle ','\\rangle ');

var parenMixin = function(_, _super) {
  _.init = function(open, close) {
    _super.init.call(this, open, close, open, close);
  };
};

var Paren = P(Bracket, parenMixin);

LatexCmds.lparen =
CharCmds['('] = bind(Paren, '(', ')');
LatexCmds.lbrack =
LatexCmds.lbracket =
CharCmds['['] = bind(Paren, '[', ']');

var CloseParen = P(CloseBracket, parenMixin);

LatexCmds.rparen =
CharCmds[')'] = bind(CloseParen, '(', ')');
LatexCmds.rbrack =
LatexCmds.rbracket =
CharCmds[']'] = bind(CloseParen, '[', ']');

var Pipes =
LatexCmds.lpipe =
LatexCmds.rpipe =
CharCmds['|'] = P(Paren, function(_, _super) {
  _.init = function() {
    _super.init.call(this, '|', '|');
  }

  _.createBefore = CloseBracket.prototype.createBefore;
});

// input box to type a variety of LaTeX commands beginning with a backslash
var LatexCommandInput =
CharCmds['\\'] = P(MathCommand, function(_, _super) {
  _.ctrlSeq = '\\';
  _.replaces = function(replacedFragment) {
    this._replacedFragment = replacedFragment.disown();
    this.isEmpty = function() { return false; };
  };
  _.htmlTemplate = '<span class="latex-command-input non-leaf">\\<span>&0</span></span>';
  _.textTemplate = ['\\'];
  _.createBlocks = function() {
    _super.createBlocks.call(this);
    this.ch[L].focus = function() {
      this.parent.jQ.ggbAddClass('hasCursor');
      if (this.isEmpty())
        this.parent.jQ.ggbRemoveClass('empty');

      return this;
    };
    this.ch[L].blur = function() {
      this.parent.jQ.ggbRemoveClass('hasCursor');
      if (this.isEmpty())
        this.parent.jQ.ggbAddClass('empty');

      return this;
    };
  };
  _.createBefore = function(cursor) {
    _super.createBefore.call(this, cursor);

    this.cursor = cursor.appendTo(this.ch[L]);

    if (this._replacedFragment) {
      // Arpad: I guess this part of the code never runs, but I'm not sure
      var el = this.jQ[0];
      this.jQ = this._replacedFragment.jQ.ggbAddClass('blur').ggbInsertBefore(this.jQ).ggbAdd(this.jQ);
    }

    this.ch[L].write = function(cursor, ch, replacedFragment) {
      if (replacedFragment) replacedFragment.remove();

      if (ch.match(/[a-z]/i)) VanillaSymbol(ch).createBefore(cursor);
      else {
        this.parent.renderCommand();
        if (ch !== '\\' || !this.isEmpty()) this.parent.parent.write(cursor, ch);
      }
    };
  };
  _.latex = function() {
    return '\\' + this.ch[L].latex() + ' ';
  };
  _.renderCommand = function() {
    this.jQ = this.jQ.ggbLast();
    this.remove();
    if (this[R]) {
      this.cursor.insertBefore(this[R]);
    } else {
      this.cursor.appendTo(this.parent);
    }

    var latex = this.ch[L].latex(), cmd;
    if (!latex) latex = 'backslash';
    this.cursor.insertCmd(latex, this._replacedFragment);
  };
});

var Binomial =
LatexCmds.binom =
LatexCmds.binomial = P(MathCommand, function(_, _super) {
  _.ctrlSeq = '\\binom';
  _.htmlTemplate =
      '<span class="paren scaled">(</span>'
    + '<span class="non-leaf">'
    +   '<span class="array non-leaf">'
    +     '<span>&0</span>'
    +     '<span>&1</span>'
    +   '</span>'
    + '</span>'
    + '<span class="paren scaled">)</span>'
  ;
  _.textTemplate = ['choose(',',',')'];
  _.redraw = function() {
    var blockjQ = minQuery(this.jQ[1]);
    var bh = blockjQ.ggbOuterHeight();
    var fs = 0;
    if (blockjQ.ggbCSS('font-size').length > 2) {
      if (blockjQ.ggbCSS('font-size').substr(-2) == "px") {
        fs = blockjQ.ggbCSS('font-size').slice(0,-2);
      }
    }
    if ((fs > 0) && (bh > 0)) {
      var height = bh/+fs;
      var parens = this.jQ.ggbFilter('.paren');
      scale(parens, min(1 + .2*(height - 1), 1.2), 1.05*height);
      if (this.tries) {
        delete this.tries;
      }
    } else if (fs > 0) {
      if (this.tries) {
        this.tries--;
      } else {
        this.tries = 20;
      }
      if (this.tries > 0) {
        var thisfunction = this.redraw.bind(this);

        // assume 60 FPS refresh rate; meaning refresh
        // in every 0.0166 seconds, or 16.6 milliseconds
        // 60 ms is probably good, almost in every third frame
        // this way "tries" is no more than 20
        setTimeout(thisfunction, 60);
      } else {
        delete this.tries;
      }
    }
  };
});

var Choose =
LatexCmds.choose = P(Binomial, function(_) {
  _.createBefore = LiveFraction.prototype.createBefore;
});

var Vector =
LatexCmds.vector = P(MathCommand, function(_, _super) {
  _.ctrlSeq = '\\vector';
  _.htmlTemplate = '<span class="array"><span>&0</span></span>';
  _.latex = function() {
    return '\\begin{matrix}' + this.foldChildren([], function(latex, child) {
      latex.push(child.latex());
      return latex;
    }).join('\\\\') + '\\end{matrix}';
  };
  _.text = function() {
    return '[' + this.foldChildren([], function(text, child) {
      text.push(child.text());
      return text;
    }).join() + ']';
  }
  _.createBefore = function(cursor) {
    _super.createBefore.call(this, this.cursor = cursor);
  };
});

/**********************************
 * Symbols and Special Characters
 *********************************/

//LatexCmds.f = bind(Symbol, 'f', '<var class="florin">&fnof;</var><span style="display:inline-block;width:0">&nbsp;</span>');

var Variable = P(Symbol, function(_, _super) {
  _.init = function(ch, html) {
    _super.init.call(this, ch, '<var>'+(html || ch)+'</var>');
  }
  _.createBefore = function(cursor) {
	//want the longest possible autocommand, so assemble longest series of letters (Variables) first
	var ctrlSeq = this.ctrlSeq;

	// only join characters which are entered now;
	// so that it should still be possible to enter e.g. "sin" as three variables
	// if we enter "in" and go to the start and enter "s"...
	for (var i = 0, prev = cursor[L]; i < MAX_AUTOCMD_LEN - 1 && prev && prev instanceof Variable; i += 1, prev = prev[L])
		ctrlSeq = prev.ctrlSeq + ctrlSeq;
	//then test if there's an autocommand here, starting with the longest possible and slicing
	while (ctrlSeq.length) {
		if (AutoCmds.hasOwnProperty(ctrlSeq) || UnItalicizedCmds.hasOwnProperty(ctrlSeq)) {
			for (var i = 1; i < ctrlSeq.length; i += 1) cursor.backspace();
			var command = LatexCmds[ctrlSeq](ctrlSeq);
			command.createBefore(cursor);
			if (!AutoCmds.hasOwnProperty(ctrlSeq)) {
				// TODO: what about two-parameter functions?
				var command2 = LatexCmds["lparen"]();
				command2.createBefore(cursor);
			}
			return;
		}
		ctrlSeq = ctrlSeq.slice(1);
	}
	_super.createBefore.call(this, cursor);
  };
  _.text = function() {
    var text = this.ctrlSeq;
	if (this[L] && !(this[L] instanceof Variable)
		&& !(this[L].ctrlSeq === ' ')
		&& !(this[L].ctrlSeq === '(')
		&& !(this[L].ctrlSeq === '\\left(')
        && !(this[L] instanceof BinaryOperator))
      text = '*' + text;

    // skip spaces
    var nex = this;
    while ((nex[R]) && (nex[R].ctrlSeq === ' '))
	  nex = nex[R];

    if (nex[R] && !(nex[R] instanceof BinaryOperator)
        && !(nex.jQ.ggbHasClass('un-italicized'))
        && !(nex[R].ctrlSeq === '(')
        && !(nex[R].ctrlSeq === '\\left(')
        && !(nex[R].ctrlSeq === ')')
        && !(nex[R].ctrlSeq === '\\right)')
        && !(nex[R].ctrlSeq === '^'))
	  text += '*';
	return text;
  };
});

var VanillaSymbol = P(Symbol, function(_, _super) {
  _.init = function(ch, html) {
    _super.init.call(this, ch, '<span>'+(html || ch)+'</span>');
  };
});

//LatexCmds.lbrace = CharCmds['{'] =
//  bind(VanillaSymbol, '\\lbrace ', '{');
//LatexCmds.rbrace = CharCmds['}'] =
//  bind(VanillaSymbol, '\\rbrace ', '}');

CharCmds[' '] = bind(VanillaSymbol, ' ', ' ');

LatexCmds.prime = CharCmds["'"] = bind(VanillaSymbol, "'", '&prime;');

// does not use Symbola font
var NonSymbolaSymbol = P(Symbol, function(_, _super) {
  _.init = function(ch, html) {
    _super.init.call(this, ch, '<span class="nonSymbola">'+(html || ch)+'</span>');
  };
});

LatexCmds['@'] = NonSymbolaSymbol;
LatexCmds['&'] = LatexCmds.amp = bind(NonSymbolaSymbol, '\\&', '&amp;');
LatexCmds['%'] = bind(NonSymbolaSymbol, '\\%', '%');
LatexCmds['\u00a9'] = LatexCmds.copyright = bind(NonSymbolaSymbol, '\\copyright', '&copy;');

//the following are all Greek to me, but this helped a lot: http://www.ams.org/STIX/ion/stixsig03.html

//lowercase Greek letter variables
LatexCmds.alpha =
LatexCmds.beta =
LatexCmds.gamma =
LatexCmds.delta =
LatexCmds.zeta =
LatexCmds.eta =
LatexCmds.theta =
LatexCmds.iota =
LatexCmds.kappa =
LatexCmds.mu =
LatexCmds.nu =
LatexCmds.xi =
LatexCmds.rho =
LatexCmds.sigma =
LatexCmds.tau =
LatexCmds.chi =
LatexCmds.psi =
LatexCmds.omega = P(Variable, function(_, _super) {
  _.init = function(latex) {
    _super.init.call(this,'\\'+latex+' ','&'+latex+';');
  };
});

LatexCmds.checkmark =  
  bind(Variable,'\\checkmark ','&#x2713;'); 

//GeoGebra's '==' 
LatexCmds.questeq = 
  bind(Variable,'\\questeq ','&#8799;');

//why can't anybody agree on these
LatexCmds.phi = //W3C or Unicode?
  bind(Variable,'\\phi ','&#981;');

LatexCmds.phiv = //Elsevier and 9573-13
LatexCmds.varphi = //AMS and LaTeX
  bind(Variable,'\\varphi ','&phi;');

LatexCmds.epsilon = //W3C or Unicode?
  bind(Variable,'\\epsilon ','&#1013;');

LatexCmds.epsiv = //Elsevier and 9573-13
LatexCmds.varepsilon = //AMS and LaTeX
  bind(Variable,'\\varepsilon ','&epsilon;');

LatexCmds.piv = //W3C/Unicode and Elsevier and 9573-13
LatexCmds.varpi = //AMS and LaTeX
  bind(Variable,'\\varpi ','&piv;');

LatexCmds.sigmaf = //W3C/Unicode
LatexCmds.sigmav = //Elsevier
LatexCmds.varsigma = //LaTeX
  bind(Variable,'\\varsigma ','&sigmaf;');

LatexCmds.thetav = //Elsevier and 9573-13
LatexCmds.vartheta = //AMS and LaTeX
LatexCmds.thetasym = //W3C/Unicode
  bind(Variable,'\\vartheta ','&thetasym;');

LatexCmds.upsilon = //AMS and LaTeX and W3C/Unicode
LatexCmds.upsi = //Elsevier and 9573-13
  bind(Variable,'\\upsilon ','&upsilon;');

//these aren't even mentioned in the HTML character entity references
LatexCmds.gammad = //Elsevier
LatexCmds.Gammad = //9573-13 -- WTF, right? I dunno if this was a typo in the reference (see above)
LatexCmds.digamma = //LaTeX
  bind(Variable,'\\digamma ','&#989;');

LatexCmds.kappav = //Elsevier
LatexCmds.varkappa = //AMS and LaTeX
  bind(Variable,'\\varkappa ','&#1008;');

LatexCmds.rhov = //Elsevier and 9573-13
LatexCmds.varrho = //AMS and LaTeX
  bind(Variable,'\\varrho ','&#1009;');

//Greek constants, look best in un-italicised Times New Roman
LatexCmds.pi = LatexCmds['\u03c0'] = bind(NonSymbolaSymbol,'\\pi ','&pi;');
LatexCmds.lambda = bind(NonSymbolaSymbol,'\\lambda ','&lambda;');

//uppercase greek letters

LatexCmds.Upsilon = //LaTeX
LatexCmds.Upsi = //Elsevier and 9573-13
LatexCmds.upsih = //W3C/Unicode "upsilon with hook"
LatexCmds.Upsih = //'cos it makes sense to me
  bind(Symbol,'\\Upsilon ','<var style="font-family: geogebra-serif, serif">&upsih;</var>'); //Symbola's 'upsilon with a hook' is a capital Y without hooks :(

//other symbols with the same LaTeX command and HTML character entity reference
LatexCmds.Gamma =
LatexCmds.Delta =
LatexCmds.Theta =
LatexCmds.Lambda =
LatexCmds.Xi =
LatexCmds.Pi =
LatexCmds.Sigma =
LatexCmds.Phi =
LatexCmds.Psi =
LatexCmds.Omega =
LatexCmds.forall = P(VanillaSymbol, function(_, _super) {
  _.init = function(latex) {
    _super.init.call(this,'\\'+latex+' ','&'+latex+';');
  };
});

// symbols that aren't a single MathCommand, but are instead a whole
// Fragment. Creates the Fragment from a LaTeX string
var LatexFragment = P(MathCommand, function(_) {
  _.init = function(latex) { this.latex = latex; };
  _.createBefore = function(cursor) { cursor.writeLatex(this.latex); };
  _.parser = function() {
    var frag = latexMathParser.parse(this.latex).children();
    return Parser.succeed(frag);
  };
});

// for what seems to me like [stupid reasons][1], Unicode provides
// subscripted and superscripted versions of all ten Arabic numerals,
// as well as [so-called "vulgar fractions"][2].
// Nobody really cares about most of them, but some of them actually
// predate Unicode, dating back to [ISO-8859-1][3], apparently also
// known as "Latin-1", which among other things [Windows-1252][4]
// largely coincides with, so Microsoft Word sometimes inserts them
// and they get copy-pasted into MathQuillGGB.
//
// (Irrelevant but funny story: Windows-1252 is actually a strict
// superset of the "closely related but distinct"[3] "ISO 8859-1" --
// see the lack of a dash after "ISO"? Completely different character
// set, like elephants vs elephant seals, or "Zombies" vs "Zombie
// Redneck Torture Family". What kind of idiot would get them confused.
// People in fact got them confused so much, it was so common to
// mislabel Windows-1252 text as ISO-8859-1, that most modern web
// browsers and email clients treat the MIME charset of ISO-8859-1
// as actually Windows-1252, behavior now standard in the HTML5 spec.)
//
// [1]: http://en.wikipedia.org/wiki/Unicode_subscripts_and_superscripts
// [2]: http://en.wikipedia.org/wiki/Number_Forms
// [3]: http://en.wikipedia.org/wiki/ISO/IEC_8859-1
// [4]: http://en.wikipedia.org/wiki/Windows-1252
LatexCmds['\u00b9'] = bind(LatexFragment, '^1');
LatexCmds['\u00b2'] = bind(LatexFragment, '^2');
LatexCmds['\u00b3'] = bind(LatexFragment, '^3');
LatexCmds['\u00bc'] = bind(LatexFragment, '\\frac14');
LatexCmds['\u00bd'] = bind(LatexFragment, '\\frac12');
LatexCmds['\u00be'] = bind(LatexFragment, '\\frac34');

var BinaryOperator = P(Symbol, function(_, _super) {
  _.init = function(ctrlSeq, html, text) {
    _super.init.call(this,
      ctrlSeq, '<span class="binary-operator">'+html+'</span>', text
    );
  };
});

var PlusMinus = P(BinaryOperator, function(_) {
  _.init = VanillaSymbol.prototype.init;

  _.respace = function() {
    if (!this[L]) {
      if (this.jQ[0]) {
        this.jQ[0].className = '';
      }
    }
    else if (
      this[L] instanceof BinaryOperator &&
      this[R] && !(this[R] instanceof BinaryOperator)
    ) {
      if (this.jQ[0]) {
        this.jQ[0].className = 'unary-operator';
      }
    }
    else {
      // TODO: quick workaround, cause of bug is unknown!
      if (this.jQ[0]) {
        this.jQ[0].className = 'binary-operator';
      }
    }
    return this;
  };
});

LatexCmds['+'] = bind(PlusMinus, '+', '+');
//yes, these are different dashes, I think one is an en dash and the other is a hyphen
LatexCmds['\u2013'] = LatexCmds['-'] = bind(PlusMinus, '-', '&minus;');
LatexCmds['\u00b1'] = LatexCmds.pm = LatexCmds.plusmn = LatexCmds.plusminus =
  bind(PlusMinus,'\\pm ','&plusmn;');
LatexCmds.mp = LatexCmds.mnplus = LatexCmds.minusplus =
  bind(PlusMinus,'\\mp ','&#8723;');

CharCmds['*'] = LatexCmds.sdot = LatexCmds.cdot =
  bind(BinaryOperator, '\\cdot ', '&middot;', '*');
//semantically should be &sdot;, but &middot; looks better

LatexCmds['='] = bind(BinaryOperator, '=', '=');
LatexCmds['<'] = bind(BinaryOperator, '<', '&lt;');
LatexCmds['>'] = bind(BinaryOperator, '>', '&gt;');

LatexCmds.notin =
LatexCmds.sim =
LatexCmds.cong =
LatexCmds.equiv =
LatexCmds.oplus =
LatexCmds.otimes = P(BinaryOperator, function(_, _super) {
  _.init = function(latex) {
    _super.init.call(this, '\\'+latex+' ', '&'+latex+';');
  };
});

LatexCmds.times = bind(BinaryOperator, '\\times ', '&times;', '[x]');

LatexCmds['\u00f7'] = LatexCmds.div = LatexCmds.divide = LatexCmds.divides =
  bind(BinaryOperator,'\\div ','&divide;', '[/]');

LatexCmds['\u2260'] = LatexCmds.ne = LatexCmds.neq = bind(BinaryOperator,'\\ne ','&ne;');

LatexCmds.ast = LatexCmds.star = LatexCmds.loast = LatexCmds.lowast =
  bind(BinaryOperator,'\\ast ','&lowast;');
  //case 'there4 = // a special exception for this one, perhaps?
LatexCmds.therefor = LatexCmds.therefore =
  bind(BinaryOperator,'\\therefore ','&there4;');

LatexCmds.cuz = // l33t
LatexCmds.because = bind(BinaryOperator,'\\because ','&#8757;');

LatexCmds.prop = LatexCmds.propto = bind(BinaryOperator,'\\propto ','&prop;');

LatexCmds['\u2248'] = LatexCmds.asymp = LatexCmds.approx = bind(BinaryOperator,'\\approx ','&asymp;');

LatexCmds.lt = bind(BinaryOperator,'<','&lt;');

LatexCmds.gt = bind(BinaryOperator,'>','&gt;');

LatexCmds['\u2264'] = LatexCmds.le = LatexCmds.leq = bind(BinaryOperator,'\\le ','&le;');

LatexCmds['\u2265'] = LatexCmds.ge = LatexCmds.geq = bind(BinaryOperator,'\\ge ','&ge;');

LatexCmds.isin = LatexCmds['in'] = bind(BinaryOperator,'\\in ','&isin;');

LatexCmds.ni = LatexCmds.contains = bind(BinaryOperator,'\\ni ','&ni;');

LatexCmds.notni = LatexCmds.niton = LatexCmds.notcontains = LatexCmds.doesnotcontain =
  bind(BinaryOperator,'\\not\\ni ','&#8716;');

LatexCmds.sub = LatexCmds.subset = bind(BinaryOperator,'\\subset ','&sub;');

LatexCmds.sup = LatexCmds.supset = LatexCmds.superset =
  bind(BinaryOperator,'\\supset ','&sup;');

LatexCmds.nsub = LatexCmds.notsub =
LatexCmds.nsubset = LatexCmds.notsubset =
  bind(BinaryOperator,'\\not\\subset ','&#8836;');

LatexCmds.nsup = LatexCmds.notsup =
LatexCmds.nsupset = LatexCmds.notsupset =
LatexCmds.nsuperset = LatexCmds.notsuperset =
  bind(BinaryOperator,'\\not\\supset ','&#8837;');

LatexCmds.sube = LatexCmds.subeq = LatexCmds.subsete = LatexCmds.subseteq =
  bind(BinaryOperator,'\\subseteq ','&sube;');

LatexCmds.supe = LatexCmds.supeq =
LatexCmds.supsete = LatexCmds.supseteq =
LatexCmds.supersete = LatexCmds.superseteq =
  bind(BinaryOperator,'\\supseteq ','&supe;');

LatexCmds.nsube = LatexCmds.nsubeq =
LatexCmds.notsube = LatexCmds.notsubeq =
LatexCmds.nsubsete = LatexCmds.nsubseteq =
LatexCmds.notsubsete = LatexCmds.notsubseteq =
  bind(BinaryOperator,'\\not\\subseteq ','&#8840;');

LatexCmds.nsupe = LatexCmds.nsupeq =
LatexCmds.notsupe = LatexCmds.notsupeq =
LatexCmds.nsupsete = LatexCmds.nsupseteq =
LatexCmds.notsupsete = LatexCmds.notsupseteq =
LatexCmds.nsupersete = LatexCmds.nsuperseteq =
LatexCmds.notsupersete = LatexCmds.notsuperseteq =
  bind(BinaryOperator,'\\not\\supseteq ','&#8841;');


//sum, product, coproduct, integral
var BigSymbol = P(Symbol, function(_, _super) {
  _.init = function(ch, html) {
    _super.init.call(this, ch, '<big>'+html+'</big>');
  };
});

LatexCmds['\u2211'] = LatexCmds.sum = LatexCmds.summation = bind(BigSymbol,'\\sum ','&sum;');
LatexCmds['\u220f'] = LatexCmds.prod = LatexCmds.product = bind(BigSymbol,'\\prod ','&prod;');
LatexCmds.coprod = LatexCmds.coproduct = bind(BigSymbol,'\\coprod ','&#8720;');
LatexCmds['\u222b'] = LatexCmds['int'] = LatexCmds.integral = bind(BigSymbol,'\\int ','&int;');



//the canonical sets of numbers
//LatexCmds.N =
LatexCmds.naturals = LatexCmds.Naturals =
  bind(VanillaSymbol,'\\mathbb{N}','&#8469;');

//LatexCmds.P =
LatexCmds.primes = LatexCmds.Primes =
LatexCmds.projective = LatexCmds.Projective =
LatexCmds.probability = LatexCmds.Probability =
  bind(VanillaSymbol,'\\mathbb{P}','&#8473;');

//LatexCmds.Z =
LatexCmds.integers = LatexCmds.Integers =
  bind(VanillaSymbol,'\\mathbb{Z}','&#8484;');

//LatexCmds.Q =
LatexCmds.rationals = LatexCmds.Rationals =
  bind(VanillaSymbol,'\\mathbb{Q}','&#8474;');

//LatexCmds.R =
LatexCmds.reals = LatexCmds.Reals =
  bind(VanillaSymbol,'\\mathbb{R}','&#8477;');

//LatexCmds.C =
LatexCmds.complex = LatexCmds.Complex =
LatexCmds.complexes = LatexCmds.Complexes =
LatexCmds.complexplane = LatexCmds.Complexplane = LatexCmds.ComplexPlane =
  bind(VanillaSymbol,'\\mathbb{C}','&#8450;');

//LatexCmds.H =
LatexCmds.Hamiltonian = LatexCmds.quaternions = LatexCmds.Quaternions =
  bind(VanillaSymbol,'\\mathbb{H}','&#8461;');

//spacing
LatexCmds.quad = LatexCmds.emsp = bind(VanillaSymbol,'\\quad ','    ');
LatexCmds.qquad = bind(VanillaSymbol,'\\qquad ','        ');
/* spacing special characters, gonna have to implement this in LatexCommandInput::onText somehow
case ',':
  return VanillaSymbol('\\, ',' ');
case ':':
  return VanillaSymbol('\\: ','  ');
case ';':
  return VanillaSymbol('\\; ','   ');
case '!':
  return Symbol('\\! ','<span style="margin-right:-.2em"></span>');
*/

//binary operators
LatexCmds.diamond = bind(VanillaSymbol, '\\diamond ', '&#9671;');
LatexCmds.bigtriangleup = bind(VanillaSymbol, '\\bigtriangleup ', '&#9651;');
LatexCmds.ominus = bind(VanillaSymbol, '\\ominus ', '&#8854;');
LatexCmds.uplus = bind(VanillaSymbol, '\\uplus ', '&#8846;');
LatexCmds.bigtriangledown = bind(VanillaSymbol, '\\bigtriangledown ', '&#9661;');
LatexCmds.sqcap = bind(VanillaSymbol, '\\sqcap ', '&#8851;');
LatexCmds.triangleleft = bind(VanillaSymbol, '\\triangleleft ', '&#8882;');
LatexCmds.sqcup = bind(VanillaSymbol, '\\sqcup ', '&#8852;');
LatexCmds.triangleright = bind(VanillaSymbol, '\\triangleright ', '&#8883;');
LatexCmds.odot = bind(VanillaSymbol, '\\odot ', '&#8857;');
LatexCmds.bigcirc = bind(VanillaSymbol, '\\bigcirc ', '&#9711;');
LatexCmds.dagger = bind(VanillaSymbol, '\\dagger ', '&#0134;');
LatexCmds.ddagger = bind(VanillaSymbol, '\\ddagger ', '&#135;');
LatexCmds.wr = bind(VanillaSymbol, '\\wr ', '&#8768;');
LatexCmds.amalg = bind(VanillaSymbol, '\\amalg ', '&#8720;');

//relationship symbols
LatexCmds.models = bind(VanillaSymbol, '\\models ', '&#8872;');
LatexCmds.prec = bind(VanillaSymbol, '\\prec ', '&#8826;');
LatexCmds.succ = bind(VanillaSymbol, '\\succ ', '&#8827;');
LatexCmds.preceq = bind(VanillaSymbol, '\\preceq ', '&#8828;');
LatexCmds.succeq = bind(VanillaSymbol, '\\succeq ', '&#8829;');
LatexCmds.simeq = bind(VanillaSymbol, '\\simeq ', '&#8771;');
LatexCmds.mid = bind(VanillaSymbol, '\\mid ', '&#8739;');
//LatexCmds.ll = bind(VanillaSymbol, '\\ll ', '&#8810;');//disturbing in GeoGebraWeb
//LatexCmds.gg = bind(VanillaSymbol, '\\gg ', '&#8811;');//disturbing in GeoGebraWeb
LatexCmds.parallel = bind(VanillaSymbol, '\\parallel ', '&#8741;');
LatexCmds.bowtie = bind(VanillaSymbol, '\\bowtie ', '&#8904;');
LatexCmds.sqsubset = bind(VanillaSymbol, '\\sqsubset ', '&#8847;');
LatexCmds.sqsupset = bind(VanillaSymbol, '\\sqsupset ', '&#8848;');
LatexCmds.smile = bind(VanillaSymbol, '\\smile ', '&#8995;');
LatexCmds.sqsubseteq = bind(VanillaSymbol, '\\sqsubseteq ', '&#8849;');
LatexCmds.sqsupseteq = bind(VanillaSymbol, '\\sqsupseteq ', '&#8850;');
LatexCmds.doteq = bind(VanillaSymbol, '\\doteq ', '&#8784;');
LatexCmds.frown = bind(VanillaSymbol, '\\frown ', '&#8994;');
LatexCmds.vdash = bind(VanillaSymbol, '\\vdash ', '&#8870;');
LatexCmds.dashv = bind(VanillaSymbol, '\\dashv ', '&#8867;');

//GeogebraWeb or previous MathQuillGGB ?
LatexCmds.space = bind(VanillaSymbol, '\\space ', '&nbsp;');

//arrows
LatexCmds.longleftarrow = bind(VanillaSymbol, '\\longleftarrow ', '&#8592;');
LatexCmds.longrightarrow = bind(VanillaSymbol, '\\longrightarrow ', '&#8594;');
LatexCmds.Longleftarrow = bind(VanillaSymbol, '\\Longleftarrow ', '&#8656;');
LatexCmds.Longrightarrow = bind(VanillaSymbol, '\\Longrightarrow ', '&#8658;');
LatexCmds.longleftrightarrow = bind(VanillaSymbol, '\\longleftrightarrow ', '&#8596;');
LatexCmds.updownarrow = bind(VanillaSymbol, '\\updownarrow ', '&#8597;');
LatexCmds.Longleftrightarrow = bind(VanillaSymbol, '\\Longleftrightarrow ', '&#8660;');
LatexCmds.Updownarrow = bind(VanillaSymbol, '\\Updownarrow ', '&#8661;');
LatexCmds.mapsto = bind(VanillaSymbol, '\\mapsto ', '&#8614;');
LatexCmds.nearrow = bind(VanillaSymbol, '\\nearrow ', '&#8599;');
LatexCmds.hookleftarrow = bind(VanillaSymbol, '\\hookleftarrow ', '&#8617;');
LatexCmds.hookrightarrow = bind(VanillaSymbol, '\\hookrightarrow ', '&#8618;');
LatexCmds.searrow = bind(VanillaSymbol, '\\searrow ', '&#8600;');
LatexCmds.leftharpoonup = bind(VanillaSymbol, '\\leftharpoonup ', '&#8636;');
LatexCmds.rightharpoonup = bind(VanillaSymbol, '\\rightharpoonup ', '&#8640;');
LatexCmds.swarrow = bind(VanillaSymbol, '\\swarrow ', '&#8601;');
LatexCmds.leftharpoondown = bind(VanillaSymbol, '\\leftharpoondown ', '&#8637;');
LatexCmds.rightharpoondown = bind(VanillaSymbol, '\\rightharpoondown ', '&#8641;');
LatexCmds.nwarrow = bind(VanillaSymbol, '\\nwarrow ', '&#8598;');

//Misc
LatexCmds.ldots = bind(VanillaSymbol, '\\ldots ', '&#8230;');
LatexCmds.cdots = bind(VanillaSymbol, '\\cdots ', '&#8943;');
LatexCmds.vdots = bind(VanillaSymbol, '\\vdots ', '&#8942;');
LatexCmds.ddots = bind(VanillaSymbol, '\\ddots ', '&#8944;');
LatexCmds.surd = bind(VanillaSymbol, '\\surd ', '&#8730;');
LatexCmds.triangle = bind(VanillaSymbol, '\\triangle ', '&#9653;');
LatexCmds.ell = bind(VanillaSymbol, '\\ell ', '&#8467;');
LatexCmds.top = bind(VanillaSymbol, '\\top ', '&#8868;');
LatexCmds.flat = bind(VanillaSymbol, '\\flat ', '&#9837;');
LatexCmds.natural = bind(VanillaSymbol, '\\natural ', '&#9838;');
LatexCmds.sharp = bind(VanillaSymbol, '\\sharp ', '&#9839;');
LatexCmds.wp = bind(VanillaSymbol, '\\wp ', '&#8472;');
LatexCmds.bot = bind(VanillaSymbol, '\\bot ', '&#8869;');
LatexCmds.clubsuit = bind(VanillaSymbol, '\\clubsuit ', '&#9827;');
LatexCmds.diamondsuit = bind(VanillaSymbol, '\\diamondsuit ', '&#9826;');
LatexCmds.heartsuit = bind(VanillaSymbol, '\\heartsuit ', '&#9825;');
LatexCmds.spadesuit = bind(VanillaSymbol, '\\spadesuit ', '&#9824;');

//variable-sized
LatexCmds.oint = bind(VanillaSymbol, '\\oint ', '&#8750;');
LatexCmds.bigcap = bind(VanillaSymbol, '\\bigcap ', '&#8745;');
LatexCmds.bigcup = bind(VanillaSymbol, '\\bigcup ', '&#8746;');
LatexCmds.bigsqcup = bind(VanillaSymbol, '\\bigsqcup ', '&#8852;');
LatexCmds.bigvee = bind(VanillaSymbol, '\\bigvee ', '&#8744;');
LatexCmds.bigwedge = bind(VanillaSymbol, '\\bigwedge ', '&#8743;');
LatexCmds.bigodot = bind(VanillaSymbol, '\\bigodot ', '&#8857;');
LatexCmds.bigotimes = bind(VanillaSymbol, '\\bigotimes ', '&#8855;');
LatexCmds.bigoplus = bind(VanillaSymbol, '\\bigoplus ', '&#8853;');
LatexCmds.biguplus = bind(VanillaSymbol, '\\biguplus ', '&#8846;');

//delimiters
LatexCmds.lfloor = bind(VanillaSymbol, '\\lfloor ', '&#8970;');
LatexCmds.rfloor = bind(VanillaSymbol, '\\rfloor ', '&#8971;');
LatexCmds.lceil = bind(VanillaSymbol, '\\lceil ', '&#8968;');
LatexCmds.rceil = bind(VanillaSymbol, '\\rceil ', '&#8969;');
LatexCmds.slash = bind(VanillaSymbol, '\\slash ', '&#47;');
LatexCmds.opencurlybrace = bind(VanillaSymbol, '\\opencurlybrace ', '&#123;');
LatexCmds.closecurlybrace = bind(VanillaSymbol, '\\closecurlybrace ', '&#125;');

//various symbols

LatexCmds.caret = bind(VanillaSymbol,'\\caret ','^');
LatexCmds.underscore = bind(VanillaSymbol,'\\underscore ','_');
LatexCmds.backslash = bind(VanillaSymbol,'\\backslash ','\\');
LatexCmds.vert = bind(VanillaSymbol,'|');
LatexCmds.perp = LatexCmds.perpendicular = bind(VanillaSymbol,'\\perp ','&perp;');
LatexCmds.nabla = LatexCmds.del = bind(VanillaSymbol,'\\nabla ','&nabla;');
LatexCmds.hbar = bind(VanillaSymbol,'\\hbar ','&#8463;');

LatexCmds.AA = LatexCmds.Angstrom = LatexCmds.angstrom =
  bind(VanillaSymbol,'\\text\\AA ','&#8491;');

LatexCmds.ring = LatexCmds.circ = LatexCmds.circle =
  bind(VanillaSymbol,'\\circ ','&#8728;');

LatexCmds.bull = LatexCmds.bullet = bind(VanillaSymbol,'\\bullet ','&bull;');

LatexCmds.setminus = LatexCmds.smallsetminus =
  bind(VanillaSymbol,'\\setminus ','&#8726;');

LatexCmds.not = //bind(Symbol,'\\not ','<span class="not">/</span>');
LatexCmds['\u00ac'] = LatexCmds.neg = bind(VanillaSymbol,'\\neg ','&not;');

LatexCmds['\u2026'] = LatexCmds.dots = LatexCmds.ellip = LatexCmds.hellip =
LatexCmds.ellipsis = LatexCmds.hellipsis =
  bind(VanillaSymbol,'\\dots ','&hellip;');

LatexCmds.converges =
LatexCmds.darr = LatexCmds.dnarr = LatexCmds.dnarrow = LatexCmds.downarrow =
  bind(VanillaSymbol,'\\downarrow ','&darr;');

LatexCmds.dArr = LatexCmds.dnArr = LatexCmds.dnArrow = LatexCmds.Downarrow =
  bind(VanillaSymbol,'\\Downarrow ','&dArr;');

LatexCmds.diverges = LatexCmds.uarr = LatexCmds.uparrow =
  bind(VanillaSymbol,'\\uparrow ','&uarr;');

LatexCmds.uArr = LatexCmds.Uparrow = bind(VanillaSymbol,'\\Uparrow ','&uArr;');

LatexCmds.to = bind(BinaryOperator,'\\to ','&rarr;');

LatexCmds.rarr = LatexCmds.rightarrow = bind(VanillaSymbol,'\\rightarrow ','&rarr;');

LatexCmds.implies = bind(BinaryOperator,'\\Rightarrow ','&rArr;');

LatexCmds.rArr = LatexCmds.Rightarrow = bind(VanillaSymbol,'\\Rightarrow ','&rArr;');

LatexCmds.gets = bind(BinaryOperator,'\\gets ','&larr;');

LatexCmds.larr = LatexCmds.leftarrow = bind(VanillaSymbol,'\\leftarrow ','&larr;');

LatexCmds.impliedby = bind(BinaryOperator,'\\Leftarrow ','&lArr;');

LatexCmds.lArr = LatexCmds.Leftarrow = bind(VanillaSymbol,'\\Leftarrow ','&lArr;');

LatexCmds.harr = LatexCmds.lrarr = LatexCmds.leftrightarrow =
  bind(VanillaSymbol,'\\leftrightarrow ','&harr;');

LatexCmds.iff = bind(BinaryOperator,'\\Leftrightarrow ','&hArr;');

LatexCmds.hArr = LatexCmds.lrArr = LatexCmds.Leftrightarrow =
  bind(VanillaSymbol,'\\Leftrightarrow ','&hArr;');

LatexCmds.Re = LatexCmds.Real = LatexCmds.real = bind(VanillaSymbol,'\\Re ','&real;');

LatexCmds.Im = LatexCmds.imag =
LatexCmds.image = LatexCmds.imagin = LatexCmds.imaginary = LatexCmds.Imaginary =
  bind(VanillaSymbol,'\\Im ','&image;');

LatexCmds.part = LatexCmds.partial = bind(VanillaSymbol,'\\partial ','&part;');

LatexCmds.inf = LatexCmds.infin = LatexCmds.infty = LatexCmds.infinity =
  bind(VanillaSymbol,'\\infty ','&infin;');

LatexCmds.alef = LatexCmds.alefsym = LatexCmds.aleph = LatexCmds.alephsym =
  bind(VanillaSymbol,'\\aleph ','&alefsym;');

LatexCmds.xist = //LOL
LatexCmds.xists = LatexCmds.exist = LatexCmds.exists =
  bind(VanillaSymbol,'\\exists ','&exist;');

LatexCmds.and = LatexCmds.land = LatexCmds.wedge =
  bind(VanillaSymbol,'\\wedge ','&and;');

LatexCmds.or = LatexCmds.lor = LatexCmds.vee = bind(VanillaSymbol,'\\vee ','&or;');

//LatexCmds.o = LatexCmds.O =
LatexCmds.empty = LatexCmds.emptyset =
LatexCmds.oslash = LatexCmds.Oslash =
LatexCmds.nothing = LatexCmds.varnothing =
  bind(BinaryOperator,'\\varnothing ','&empty;');

LatexCmds.cup = LatexCmds.union = bind(BinaryOperator,'\\cup ','&cup;');

LatexCmds.cap = LatexCmds.intersect = LatexCmds.intersection =
  bind(BinaryOperator,'\\cap ','&cap;');

// \deg is actually a latex function LatexCmds.deg = LatexCmds.degree = bind(VanillaSymbol,'^\\circ ','&deg;');

LatexCmds.ang = LatexCmds.angle = bind(VanillaSymbol,'\\angle ','&ang;');


var NonItalicizedFunction = P(Symbol, function(_, _super) {
  _.init = function(fn) {
    _super.init.call(this, '\\'+fn+' ', '<span>'+fn+'</span>');
  };
  _.respace = function()
  {
    if (this.jQ[0]) {
      this.jQ[0].className =
        (this[R] instanceof SupSub || this[R] instanceof Bracket) ?
        '' : 'non-italicized-function';
    }
  };
});

//backslashless commands, words where adjacent letters (Variables)
//that form them automatically are turned into commands
var UnItalicizedCmds = {

// Proper LaTeX functions
// http://amath.colorado.edu/documentation/LaTeX/Symbols.pdf

arccos : 1, // numbers "1" don't mean anything, currently
arcsin : 1,
arctan : 1,
arg : 1,
cos : 1,
cosh : 1,
cot : 1,
coth : 1,
csc : 1,
deg : 1,
det : 1,
dim : 1,
exp : 1,
gcd : 1,
hom : 1,
inf : 1,
ker : 1,
lg : 1,
//lim : 1,
ln : 1,
log : 1,
max : 1,
min : 1,
sec : 1,
sin : 1,
sinh : 1,
sup : 1,
tan : 1,
tanh : 1,

// Portugese
cossech: 1,

// Romanian special
arcsh: 1,
arcch: 1,
arcth: 1,

// French special
argsh: 1,
argch: 1,
argth: 1,

// Spanish special
arcos: 1,
arcosh: 1,

// German special
arsinh: 1,
artanh: 1,

// Hungarian (??)
arch: 1,
arsh: 1,
arth: 1,
ch: 1,
sh: 1,
th: 1,
cth: 1,

// special GeoGebra functions
sgn : 1,
round : 1,
erf : 1,
Ci : 1,
Si : 1,
Ei : 1,
real : 1,
imaginary : 1,
fractionalPart : 1
}, AutoCmds = {
// GeoGebra+MathQuillGGB
sqrt: 1,
Sqrt: 1,
nthroot: 2,
nroot: 2,
// MathQuillGGB
//sum: 1,
pi: 1
//theta: 1,
//int: 1
}, MAX_AUTOCMD_LEN = 16;

(function() {
  var trigs = {
    sin: 1, cos: 1, tan: 1, sen: 1, tg: 1
    // capital/ar forms not needed, GeoGebra won't serialise to them
    // and users don't need them
    // although it can parse them
    //,Sin: 1, Cos: 1, Tan: 1
    };
  for (var trig in trigs) {
	UnItalicizedCmds[trig] =
	UnItalicizedCmds['a'+trig] =
	UnItalicizedCmds['arc'+trig] =
	UnItalicizedCmds[trig+'h'] =
	UnItalicizedCmds['arc'+trig+'h'] =
	UnItalicizedCmds['a'+trig+'h'] = 1;
  }
  trigs = {
	sec: 1, cosec: 1, csc: 1
	//,Sec: 1, Cosec: 1, Csc: 1,
	,cotan: 1, cot: 1, ctg: 1
	//,Cotan: 1, Cot: 1, Ctg: 1
	,cotg : 1
	};
  for (var trig in trigs) {
	UnItalicizedCmds[trig] =
	UnItalicizedCmds[trig+'h'] = 1;
  }

  /*var trig = ['sin', 'cos', 'tan', 'sec', 'cosec', 'csc', 'cotan', 'cot'];
  for (var i in trig) {
    LatexCmds[trig[i]] =
    LatexCmds[trig[i]+'h'] =
    LatexCmds['a'+trig[i]] = LatexCmds['arc'+trig[i]] =
    LatexCmds['a'+trig[i]+'h'] = LatexCmds['arc'+trig[i]+'h'] =
      NonItalicizedFunction;
  }*/

  for (var fn in UnItalicizedCmds)
    LatexCmds[fn] = NonItalicizedFunction;
}());

/*************************************************
 * Abstract classes of text blocks
 ************************************************/

/**
 * Blocks of plain text, with one or two TextPiece's as children.
 * Represents flat strings of typically serif-font Roman characters, as
 * opposed to hierchical, nested, tree-structured math.
 * Wraps a single HTMLSpanElement.
 */
var TextBlock = P(Node, function(_, _super) {
  _.ctrlSeq = '\\text';

  _.replaces = function(replacedText) {
    if (replacedText instanceof Fragment)
      this.replacedText = replacedText.remove().jQ.ggbText();
    else if (typeof replacedText === 'string')
      this.replacedText = replacedText;
  };

  _.jQadd = function(jQ) {
    _super.jQadd.call(this, jQ);
    if (this.ch[L]) this.ch[L].jQadd(this.jQ[0].firstChild);
  };

  _.createBefore = function(cursor) {
    var textBlock = this;
    _super.createBefore.call(this, cursor);

    if (textBlock[R].respace) textBlock[R].respace();
    if (textBlock[L].respace) textBlock[L].respace();

    textBlock.bubble('redraw');

    cursor.appendTo(textBlock);

    if (textBlock.replacedText)
      for (var i = 0; i < textBlock.replacedText.length; i += 1)
        textBlock.ch[L].write(cursor, textBlock.replacedText.charAt(i));
  };

  _.parser = function() {
    var textBlock = this;

    // TODO: correctly parse text mode
    var string = Parser.string;
    var regex = Parser.regex;
    var optWhitespace = Parser.optWhitespace;
    return optWhitespace
      .then(string('{')).then(regex(/^[^}]*/)).skip(string('}'))
      .map(function(text) {
        // TODO: is this the correct behavior when parsing
        // the latex \text{} ?  This violates the requirement that
        // the text contents are always nonempty.  Should we just
        // disown the parent node instead?
        TextPiece(text).adopt(textBlock, 0, 0);
        return textBlock;
      })
    ;
  };

  _.textContents = function() {
    return this.foldChildren('', function(text, child) {
      return text + child.text2;
    });
  };
  _.text = function() { return '"' + this.textContents() + '"'; };
  _.latex = function() {
	  if (this.ctrlSeq == '\\textsf') {
		  // not clear what other things should be allowed here
		  return this.ctrlSeq + '{' + this.textContents() + '}';
	  }
	  return '\\text{' + this.textContents() + '}';
  };
  _.html = function() {
	// FIXME: it's unclear why htmlTemplate is not used here
	// from makeTextBlock, so are all makeTextBlock commands void?
	if (this.ctrlSeq == '\\textsf') {
		// manual hack
		return (
				'<span class="sans-serif text" mathquillggb-command-id='+this.id+'>'
				+   this.textContents()
				+ '</span>'
		);
	}
    return (
        '<span class="text" mathquillggb-command-id='+this.id+'>'
      +   this.textContents()
      + '</span>'
    );
  };

  _.moveTowards = function(dir, cursor) { cursor.appendDir(-dir, this); };
  _.moveOutOf = function(dir, cursor) { cursor.insertAdjacent(dir, this); };

  // TODO: make these methods part of a shared mixin or something.
  _.createSelection = MathCommand.prototype.createSelection;
  _.clearSelection = MathCommand.prototype.clearSelection;
  _.retractSelection = MathCommand.prototype.retractSelection;

  _.selectOutOf = function(dir, cursor) {
    var cmd = this;
    cursor.clearSelection().hide().insertAdjacent(dir, cmd)
    .selection = Selection(cmd);
  };
  _.deleteTowards = _.createSelection;
  _.deleteOutOf = function(dir, cursor) {
    // backspace and delete at ends of block don't unwrap
    if (this.isEmpty()) cursor.insertAfter(this);
  };
  _.write = function(cursor, ch, replacedFragment) {
    if (replacedFragment) replacedFragment.remove();

    if (ch !== '$') {
      if (!cursor[L]) TextPiece(ch).createBefore(cursor);
      else cursor[L].appendText(ch);
    }
    else if (this.isEmpty()) {
      cursor.insertAfter(this);
      VanillaSymbol('\\$','$').createBefore(cursor);
    }
    else if (!cursor[R]) cursor.insertAfter(this);
    else if (!cursor[L]) cursor.insertBefore(this);
    else { // split apart
      var prevBlock = TextBlock();
      var prevPc = this.ch[L];
      prevPc.disown();
      prevPc.adopt(prevBlock, 0, 0);

      cursor.insertBefore(this);
      _super.createBefore.call(prevBlock, cursor);
    }
    return false;
  };

  _.seek = function() {
    consolidateChildren(this);
    MathBlock.prototype.seek.apply(this, arguments);
  };

  _.blur = function() {
    MathBlock.prototype.blur.call(this);
    consolidateChildren(this);
  };

  function consolidateChildren(self) {
    var firstChild = self.ch[L];

    while (firstChild[R]) {
      firstChild.combineDir(R);
    }
  }

  _.focus = MathBlock.prototype.focus;
  _.isEmpty = MathBlock.prototype.isEmpty;
});

/**
 * Piece of plain text, with a TextBlock as a parent and no children.
 * Wraps a single DOMTextNode.
 * For convenience, has a .text property that's just a JavaScript string
 * mirroring the text contents of the DOMTextNode.
 * Text contents must always be nonempty.
 */
var TextPiece = P(Node, function(_, _super) {
  _.init = function(text) {
    _super.init.call(this);
    this.text2 = text;
  };
  _.jQadd = function(dom) { this.dom = dom; this.jQ = minQuery(dom); };
  _.jQize = function() {
    return this.jQadd(document.createTextNode(this.text2));
  };
  _.appendText = function(text) {
    this.text2 += text;
    this.dom.appendData(text);
  };
  _.prependText = function(text) {
    this.text2 = text + this.text2;
    this.dom.insertData(0, text);
  };
  _.appendTextInDir = function(text, dir) {
    if (dir === R) this.appendText(text);
    else this.prependText(text);
  };

  function endChar(dir, text) {
    return text.charAt(dir === L ? 0 : -1 + text.length);
  }

  _.moveTowards = function(dir, cursor) {
    var ch = endChar(-dir, this.text2)

    var from = this[-dir];
    if (from) from.appendTextInDir(ch, dir);
    else TextPiece(ch).createDir(-dir, cursor);

    return this.deleteTowards(dir, cursor);
  };

  _.combineDir = function(dir) {
    var toCombine = this[dir];

    this.appendTextInDir(toCombine.text2, dir);
    toCombine.remove();
  };

  _.latex = function() { return this.text2; };

  _.deleteTowards = function(dir, cursor) {
    if (this.text2.length > 1) {
      if (dir === R) {
        this.dom.deleteData(0, 1);
        this.text2 = this.text2.slice(1);
      }
      else {
        // note that the order of these 2 lines is annoyingly important
        // (the second line mutates this.text.length)
        this.dom.deleteData(-1 + this.text2.length, 1);
        this.text2 = this.text2.slice(0, -1);
      }
    }
    else {
      this.remove();
      this.jQ.ggbDetach();
      cursor[dir] = 0;
    }
  };

  // -*- selection methods -*- //

  // there's gotta be a better way to move the cursor...
  function insertCursorAdjacent(dir, cursor, el) {
    cursor[-dir] = el;
    cursor[dir] = el[dir];
    cursor.hide().show();
  }

  _.createSelection = function(dir, cursor) {
    var selectedPiece = TextPiece(endChar(-dir, this.text2));
    this.deleteTowards(dir, cursor);
    selectedPiece.createDir(dir, cursor);

    cursor.selection = Selection(selectedPiece);

    insertCursorAdjacent(dir, cursor, selectedPiece);
  }

  _.clearSelection = function(dir, cursor) {
    // cursor calls our clearSelection every time because the selection
    // only every contains one Node.
    if (this.text2.length > 1) return this.retractSelection(dir, cursor);

    var cursorSibling = this;

    if (this[-dir]) {
      cursorSibling = this[-dir];
      cursorSibling.combineDir(dir);
    }

    insertCursorAdjacent(dir, cursor, cursorSibling);

    cursor.clearSelection();
  };

  _.retractSelection = function(dir, cursor) {
    var deselectChar = endChar(-dir, this.text2);

    if (this[-dir]) {
      this[-dir].appendTextInDir(deselectChar, dir);
    }
    else {
      TextPiece(deselectChar).createDir(-dir, cursor);
    }

    this.deleteTowards(dir, cursor);
  };
});

CharCmds.$ =
LatexCmds.text =
LatexCmds.textnormal =
LatexCmds.textrm =
LatexCmds.textup =
LatexCmds.textmd = TextBlock;

function makeTextBlock(latex, tagName, attrs) {
  return P(TextBlock, {
    ctrlSeq: latex,
    htmlTemplate: '<'+tagName+' '+attrs+'>&0</'+tagName+'>'
  });
}

LatexCmds.em = LatexCmds.italic = LatexCmds.italics =
LatexCmds.emph = LatexCmds.textit = LatexCmds.textsl =
  makeTextBlock('\\textit', 'i', 'class="text"');
LatexCmds.strong = LatexCmds.bold = LatexCmds.textbf =
  makeTextBlock('\\textbf', 'b', 'class="text"');
LatexCmds.sf = LatexCmds.textsf =
  makeTextBlock('\\textsf', 'span', 'class="sans-serif text"');
LatexCmds.tt = LatexCmds.texttt =
  makeTextBlock('\\texttt', 'span', 'class="monospace text"');
LatexCmds.textsc =
  makeTextBlock('\\textsc', 'span', 'style="font-variant:small-caps" class="text"');
LatexCmds.uppercase =
  makeTextBlock('\\uppercase', 'span', 'style="text-transform:uppercase" class="text"');
LatexCmds.lowercase =
  makeTextBlock('\\lowercase', 'span', 'style="text-transform:lowercase" class="text"');
// Parser MathCommand
var latexMathParser = (function() {
  function commandToBlock(cmd) {
    var block = MathBlock();
    cmd.adopt(block, 0, 0);
    return block;
  }
  function joinBlocks(blocks) {
    var firstBlock = blocks[0] || MathBlock();

    for (var i = 1; i < blocks.length; i += 1) {
      blocks[i].children().adopt(firstBlock, firstBlock.ch[R], 0);
    }

    return firstBlock;
  }

  var string = Parser.string;
  var regex = Parser.regex;
  var letter = Parser.letter;
  var any = Parser.any;
  var optWhitespace = Parser.optWhitespace;
  var succeed = Parser.succeed;
  var fail = Parser.fail;

  // Parsers yielding MathCommands
  var variable = letter.map(Variable);
  var symbol = regex(/^[^${}\\_^]/).map(VanillaSymbol);

  var controlSequence =
    regex(/^[^\\]/)
    .or(string('\\').then(
      regex(/^[a-z]+/i)
      .or(regex(/^\s+/).result(' '))
      .or(any)
    )).then(function(ctrlSeq) {
      var cmdKlass = LatexCmds[ctrlSeq];

      if (cmdKlass) {
        return cmdKlass(ctrlSeq).parser();
      }
      else {
        return fail('unknown command: \\'+ctrlSeq);
      }
    })
  ;

  var command =
    controlSequence
    .or(variable)
    .or(symbol)
  ;

  // Parsers yielding MathBlocks
  var mathGroup = string('{').then(function() { return mathSequence; }).skip(string('}'));
  var mathBlock = optWhitespace.then(mathGroup.or(command.map(commandToBlock)));
  var mathSequence = mathBlock.many().map(joinBlocks).skip(optWhitespace);

  var optMathBlock =
    string('[').then(
      mathBlock.then(function(block) {
        return block.join('latex') !== ']' ? succeed(block) : fail();
      })
      .many().map(joinBlocks).skip(optWhitespace)
    ).skip(string(']'))
  ;

  var latexMath = mathSequence;

  latexMath.block = mathBlock;
  latexMath.optBlock = optMathBlock;
  return latexMath;
})();
/********************************************
 * Cursor and Selection "singleton" classes
 *******************************************/

/* The main thing that manipulates the Math DOM. Makes sure to manipulate the
HTML DOM to match. */

/* Sort of singletons, since there should only be one per editable math
textbox, but any one HTML document can contain many such textboxes, so any one
JS environment could actually contain many instances. */

//A fake cursor in the fake textbox that the math is rendered in.
var Cursor = P(Point, function(_) {
  _.init = function(root) {
    this.parent = this.root = root;
    var jQ = this.jQ = this._jQ = minQuery.ggbHTML('<span class="cursor">&zwj;</span>');

    //closured for setInterval
    this.blink = function(){ jQ.ggbToggleClass('blink'); }

    this.upDownCache = {};
  };

  _.show = function() {
    this.jQ = this._jQ.ggbRemoveClass('blink');
    if ('intervalId' in this) //already was shown, just restart interval
      clearInterval(this.intervalId);
    else { //was hidden and detached, insert this.jQ back into HTML DOM
      if (this[R]) {
        if (this.selection && this.selection.ends[L][L] === this[L])
          this.jQ.ggbInsertBefore(this.selection.jQ);
        else
          this.jQ.ggbInsertBefore(this[R].jQ.ggbFirst());
      }
      else
        this.jQ.ggbAppendTo(this.parent.jQ);
      this.parent.focus();
    }
    this.intervalId = setInterval(this.blink, 500);
    return this;
  };
  _.hide = function() {
    if ('intervalId' in this)
      clearInterval(this.intervalId);
    delete this.intervalId;
    this.jQ.ggbDetach();
    return this;
  };

  _.withDirInsertAt = function(dir, parent, withDir, oppDir) {
    var oldParent = this.parent;
    this.parent = parent;
    this[dir] = withDir;
    this[-dir] = oppDir;
    oldParent.blur();
  };
  _.insertAdjacent = function(dir, el) {
    this.withDirInsertAt(dir, el.parent, el[dir], el);
    this.parent.jQ.ggbAddClass('hasCursor');
    jQinsertAdjacent(dir, this.jQ, jQgetExtreme(dir, el.jQ));
    return this;
  };
  _.insertBefore = function(el) { return this.insertAdjacent(L, el); };
  _.insertAfter = function(el) { return this.insertAdjacent(R, el); };

  _.appendDir = function(dir, el) {
    this.withDirInsertAt(dir, el, 0, el.ch[dir]);

    // never insert before textarea
    if (dir === L && el.textarea) {
        jQinsertAdjacent(-dir, this.jQ, el.textarea);
    }
    else {
        jQappendDir(dir, this.jQ, el.jQ);
    }

    el.focus();

    return this;
  };
  _.prependTo = function(el) { return this.appendDir(L, el); };
  _.appendTo = function(el) { return this.appendDir(R, el); };

  _.moveDirWithin = function(dir, block) {
    if (this[dir]) this[dir].moveTowards(dir, this);
    else if (this.parent !== block) this.parent.moveOutOf(dir, this);
  };
  _.moveLeftWithin = function(block) {
    return this.moveDirWithin(L, block);
  };
  _.moveRightWithin = function(block) {
    return this.moveDirWithin(R, block);
  };
  _.moveDir = function(dir) {
    clearUpDownCache(this);

    if (this.selection)  {
      this.insertAdjacent(dir, this.selection.ends[dir]).clearSelection();
    }
    else {
      this.moveDirWithin(dir, this.root);
    }

    return this.show();
  };
  _.moveLeft = function() { return this.moveDir(L); };
  _.moveRight = function() { return this.moveDir(R); };

  /**
   * moveUp and moveDown have almost identical algorithms:
   * - first check next and prev, if so prepend/appendTo them
   * - else check the parent's 'upOutOf'/'downOutOf' property:
   *   + if it's a function, call it with the cursor as the sole argument and
   *     use the return value as if it were the value of the property
   *   + if it's undefined, bubble up to the next ancestor.
   *   + if it's false, stop bubbling.
   *   + if it's a Node, jump up or down to it
   */
  _.moveUp = function() { return moveUpDown(this, 'up'); };
  _.moveDown = function() { return moveUpDown(this, 'down'); };
  function moveUpDown(self, dir) {
    var dirInto = dir+'Into', dirOutOf = dir+'OutOf';
    if (self[R][dirInto]) self.prependTo(self[R][dirInto]);
    else if (self[L][dirInto]) self.appendTo(self[L][dirInto]);
    else {
      var ancestor = self.parent;
      do {
        var prop = ancestor[dirOutOf];
        if (prop) {
          if (typeof prop === 'function') prop = ancestor[dirOutOf](self);
          if (prop === false) break;
          if (prop instanceof Node) {
            self.jumpUpDown(ancestor, prop);
            break;
          }
        }
        ancestor = ancestor.parent;
      } while (ancestor !== self.root);
    }

    return self.clearSelection().show();
  }
  /**
   * jump up or down from one block Node to another:
   * - cache the current Point in the node we're jumping from
   * - check if there's a Point in it cached for the node we're jumping to
   *   + if so put the cursor there,
   *   + if not seek a position in the node that is horizontally closest to
   *     the cursor's current position
   */
  _.jumpUpDown = function(from, to) {
    var self = this;
    self.upDownCache[from.id] = Point(self.parent, self[L], self[R]);
    var cached = self.upDownCache[to.id];
    if (cached) {
      cached[R] ? self.insertBefore(cached[R]) : self.appendTo(cached.parent);
    }
    else {
      var pageX = offset(self).left;
      self.appendTo(to).seekHoriz(pageX, to);
    }
  };

  _.seek = function(target, pageX, pageY) {
    var cursor = this;
    clearUpDownCache(cursor);

    var nodeId = target.attr(mqBlockId) || target.attr(mqCmdId);
    if (!nodeId) {
      var targetParent = target.parent();
      nodeId = targetParent.attr(mqBlockId) || targetParent.attr(mqCmdId);
    }
    var node = nodeId ? Node.byId[nodeId] : cursor.root;
    // target could've been selection span, so get node from target before
    // clearing selection
    cursor.clearSelection().show();

    node.seek(pageX, cursor);

    return cursor;
  };
  _.seekHoriz = function(pageX, block) {
    //move cursor to position closest to click
    var cursor = this;
    var dist = offset(cursor).left - pageX;
    var prevDist;

    do {
      cursor.moveLeftWithin(block);
      prevDist = dist;
      dist = offset(cursor).left - pageX;
    }
    while (dist > 0 && (cursor[L] || cursor.parent !== block));

    if (-dist > prevDist) cursor.moveRightWithin(block);

    return cursor;
  };
  function offset(self) {
    //in Opera 11.62, .getBoundingClientRect() and hence jQuery::offset()
    //returns all 0's on inline elements with negative margin-right (like
    //the cursor) at the end of their parent, so temporarily remove the
    //negative margin-right when calling jQuery::offset()
    //Opera bug DSK-360043
    //http://bugs.jquery.com/ticket/11523
    //https://github.com/jquery/jquery/pull/717

    // this offset() call was not in attention when creating min.js,
    // so a quick workaround is made until better fix...
    //var offset = self.jQ.ggbRemoveClass('cursor').offset();
    var offset = self.jQ.ggbRemoveClass('cursor').ggbFirst().getBoundingClientRect();
    self.jQ.ggbAddClass('cursor');
    return offset;
  }
  _.writeLatex = function(latex) {
    var self = this;
    clearUpDownCache(self);
    self.show().deleteSelection();

    var all = Parser.all;
    var eof = Parser.eof;

    var block = latexMathParser.skip(eof).or(all.result(false)).parse(latex);

    if (block) {
      block.children().adopt(self.parent, self[L], self[R]);
      block.jQize().ggbInsertBefore(self.jQ);
      self[L] = block.ch[R];
      block.finalizeInsert();
      self.parent.bubble('redraw');
    }

    return this.hide();
  };
  _.write = function(ch) {
    var seln = this.prepareWrite();
    return this.insertCh(ch, seln);
  };
  _.insertCh = function(ch, replacedFragment) {
    this.parent.write(this, ch, replacedFragment);
    return this;
  };
  _.insertCmd = function(latexCmd, replacedFragment) {
    var cmd = LatexCmds[latexCmd];
    if (cmd) {
      cmd = cmd(latexCmd);
      if (replacedFragment) cmd.replaces(replacedFragment);
      cmd.createBefore(this);
    }
    else {
      cmd = TextBlock();
      cmd.replaces(latexCmd);
      cmd.ch[L].focus = function(){ delete this.focus; return this; };
      cmd.createBefore(this);
      this.insertAfter(cmd);
      if (replacedFragment)
        replacedFragment.remove();
    }
    return this;
  };
  _.unwrapGramp = function() {
    var gramp = this.parent.parent;
    var greatgramp = gramp.parent;
    var next = gramp[R];
    var cursor = this;

    var prev = gramp[L];
    gramp.disown().eachChild(function(uncle) {
      if (uncle.isEmpty()) return;

      uncle.children()
        .adopt(greatgramp, prev, next)
        .each(function(cousin) {
          cousin.jQ.ggbInsertBefore(gramp.jQ.ggbFirst());
        })
      ;

      prev = uncle.ch[R];
    });

    if (!this[R]) { //then find something to be next to insertBefore
      if (this[L])
        this[R] = this[L][R];
      else {
        while (!this[R]) {
          this.parent = this.parent[R];
          if (this.parent)
            this[R] = this.parent.ch[L];
          else {
            this[R] = gramp[R];
            this.parent = greatgramp;
            break;
          }
        }
      }
    }
    if (this[R])
      this.insertBefore(this[R]);
    else
      this.appendTo(greatgramp);

    gramp.jQ.ggbDetach();

    if (gramp[L])
      gramp[L].respace();
    if (gramp[R])
      gramp[R].respace();
  };
  _.deleteDir = function(dir) {
    clearUpDownCache(this);
    this.show();

    if (this.deleteSelection()) {
        // pass
    } else if (this[dir]) {
        this[dir].deleteTowards(dir, this);
    } else if (this.parent !== this.root) {
        this.parent.deleteOutOf(dir, this);
    }

    if (this[L])
      this[L].respace();
    if (this[R])
      this[R].respace();
    this.parent.bubble('redraw');

    return this;
  };
  _.backspace = function() { return this.deleteDir(L); };
  _.deleteForward = function() { return this.deleteDir(R); };

  function clearUpDownCache(self) {
    self.upDownCache = {};
  }

  _.prepareMove = function() {
    clearUpDownCache(this);
    return this.show().clearSelection();
  };
  _.prepareWrite = function() {
    clearUpDownCache(this);
    return this.show().replaceSelection();
  };

  _.clearSelection = function() {
    if (this.selection) {
      this.selection.clear();
      delete this.selection;
      this.root.selectionChanged();
    }
    return this;
  };
  _.deleteSelection = function() {
    if (!this.selection) return false;

    this[L] = this.selection.ends[L][L];
    this[R] = this.selection.ends[R][R];
    this.selection.remove();
    this.root.selectionChanged();
    return delete this.selection;
  };
  _.replaceSelection = function() {
    var seln = this.selection;
    if (seln) {
      this[L] = seln.ends[L][L];
      this[R] = seln.ends[R][R];
      delete this.selection;
    }
    return seln;
  };
});

var Selection = P(Fragment, function(_, _super) {
  _.init = function(first, last) {
    var seln = this;

    // just select one thing if only one argument
    _super.init.call(seln, first, last || first);

    seln.jQwrap(seln.jQ);
  };
  _.jQwrap = function(children) {
    this.jQ = children.ggbWrapAll(minQuery.ggbHTML('<span class="selection"></span>')).ggbParent();
      //can't do wrapAll(this.jQ = $(...)) because wrapAll will clone it
  };
  _.adopt = function() {
    this.jQ.ggbReplaceWith(this.jQq = this.jQ.ggbChildren() );// TODO: maybe buggy?
    this.jQ = this.jQq;
    return _super.adopt.apply(this, arguments);
  };
  _.clear = function() {
    // using the browser's native .childNodes property so that we
    // don't discard text nodes.
    this.jQ.ggbReplaceWith(minQuery().ggbAdd(this.jQ[0].childNodes));
    return this;
  };
});

minQuery["mathquillggb"] = function(domobj, cmd, latex) {
  // Entry method for the rest of the code (instead of jQuery plugin)
  // As GeoGebra* only uses this for one DOM node at a time,
  // it was simplified to support only one DOM Element object in "domobj",
  // and also, this cannot be chained like .mathquillggb().mathquillggb()
  switch (cmd) {
    case 'latex':
      var blockId = domobj.getAttribute(mqBlockId),
        block = blockId && Node.byId[blockId];

      if (arguments.length > 2) {
        if (block) {
          block.renderLatex(latex);
        }
        return;
      }

      if (block) {
        block.latex();
      }
      return;

    default:
      createRoot(domobj, RootMathBlock());
  }
};

}());
