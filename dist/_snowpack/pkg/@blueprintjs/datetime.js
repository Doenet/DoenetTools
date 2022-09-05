import { c as createCommonjsModule, g as getDefaultExportFromCjs, a as commonjsGlobal } from '../common/_commonjsHelpers-f5d70792.js';
import { r as react } from '../common/index-56a88a1e.js';
import { p as process } from '../common/process-e9e98960.js';
import { _ as _defineProperty, a as _objectWithoutPropertiesLoose, b as _extends$1 } from '../common/defineProperty-42ace2b1.js';
import { g as global } from '../common/_polyfill-node:global-acbc543a.js';
import { p as propTypes } from '../common/index-d3677bfe.js';
import { r as reactDom } from '../common/index-c4ac9922.js';
import { _ as _extends$2 } from '../common/extends-b13c3e88.js';
import { _ as _objectWithoutPropertiesLoose$1 } from '../common/setPrototypeOf-e07fe23a.js';
import { _ as _inheritsLoose$1, i as index } from '../common/ResizeObserver.es-442b921f.js';

/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Alignment along the horizontal axis. */
var Alignment = {
    CENTER: "center",
    LEFT: "left",
    RIGHT: "right",
};

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// tslint:disable:object-literal-sort-keys
/**
 * The four basic intents.
 */
var Intent = {
    NONE: "none",
    PRIMARY: "primary",
    SUCCESS: "success",
    WARNING: "warning",
    DANGER: "danger",
};

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Position = {
    BOTTOM: "bottom",
    BOTTOM_LEFT: "bottom-left",
    BOTTOM_RIGHT: "bottom-right",
    LEFT: "left",
    LEFT_BOTTOM: "left-bottom",
    LEFT_TOP: "left-top",
    RIGHT: "right",
    RIGHT_BOTTOM: "right-bottom",
    RIGHT_TOP: "right-top",
    TOP: "top",
    TOP_LEFT: "top-left",
    TOP_RIGHT: "top-right",
};

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _a, _b, _c, _d;
var NS = "bp4";
if (typeof process !== "undefined") {
    NS = (_d = (_b = (_a = process.env) === null || _a === void 0 ? void 0 : _a.BLUEPRINT_NAMESPACE) !== null && _b !== void 0 ? _b : (_c = process.env) === null || _c === void 0 ? void 0 : _c.REACT_APP_BLUEPRINT_NAMESPACE) !== null && _d !== void 0 ? _d : NS;
}
// modifiers
var ACTIVE = NS + "-active";
var ALIGN_LEFT = NS + "-align-left";
var ALIGN_RIGHT = NS + "-align-right";
var DARK = NS + "-dark";
var DISABLED = NS + "-disabled";
var FILL = NS + "-fill";
var LARGE = NS + "-large";
var LOADING = NS + "-loading";
var MINIMAL = NS + "-minimal";
var OUTLINED = NS + "-outlined";
var ROUND = NS + "-round";
var SELECTED = NS + "-selected";
var SMALL = NS + "-small";
var INTENT_PRIMARY = intentClass(Intent.PRIMARY);
var INTENT_SUCCESS = intentClass(Intent.SUCCESS);
var INTENT_WARNING = intentClass(Intent.WARNING);
var INTENT_DANGER = intentClass(Intent.DANGER);
var TEXT_OVERFLOW_ELLIPSIS = NS + "-text-overflow-ellipsis";
var BUTTON = NS + "-button";
var BUTTON_SPINNER = BUTTON + "-spinner";
var BUTTON_TEXT = BUTTON + "-text";
var DIVIDER = NS + "-divider";
var HTML_SELECT = NS + "-html-select";
var INPUT = NS + "-input";
var INPUT_GROUP = INPUT + "-group";
var INPUT_LEFT_CONTAINER = INPUT + "-left-container";
var INPUT_ACTION = INPUT + "-action";
var MENU = NS + "-menu";
var MENU_ITEM = MENU + "-item";
var MENU_ITEM_ICON = MENU_ITEM + "-icon";
var MENU_ITEM_LABEL = MENU_ITEM + "-label";
var MENU_SUBMENU = NS + "-submenu";
var MENU_SUBMENU_ICON = MENU_SUBMENU + "-icon";
var OVERLAY = NS + "-overlay";
var OVERLAY_BACKDROP = OVERLAY + "-backdrop";
var OVERLAY_CONTENT = OVERLAY + "-content";
var OVERLAY_INLINE = OVERLAY + "-inline";
var OVERLAY_OPEN = OVERLAY + "-open";
var OVERLAY_START_FOCUS_TRAP = OVERLAY + "-start-focus-trap";
var OVERLAY_END_FOCUS_TRAP = OVERLAY + "-end-focus-trap";
var POPOVER = NS + "-popover";
var POPOVER_ARROW = POPOVER + "-arrow";
var POPOVER_BACKDROP = POPOVER + "-backdrop";
var POPOVER_CAPTURING_DISMISS = POPOVER + "-capturing-dismiss";
var POPOVER_CONTENT = POPOVER + "-content";
var POPOVER_DISMISS = POPOVER + "-dismiss";
var POPOVER_DISMISS_OVERRIDE = POPOVER_DISMISS + "-override";
var POPOVER_OPEN = POPOVER + "-open";
var POPOVER_TARGET = POPOVER + "-target";
var POPOVER_WRAPPER = POPOVER + "-wrapper";
var TRANSITION_CONTAINER = NS + "-transition-container";
var PORTAL = NS + "-portal";
var SPINNER = NS + "-spinner";
var SPINNER_ANIMATION = SPINNER + "-animation";
var SPINNER_HEAD = SPINNER + "-head";
var SPINNER_NO_SPIN = NS + "-no-spin";
var SPINNER_TRACK = SPINNER + "-track";
var TOOLTIP = NS + "-tooltip";
var ICON = NS + "-icon";
/**
 * Returns the namespace prefix for all Blueprint CSS classes.
 * Customize this namespace at build time with the `process.env.BLUEPRINT_NAMESPACE` environment variable.
 */
function getClassNamespace() {
    return NS;
}
/** Return CSS class for alignment. */
function alignmentClass(alignment) {
    switch (alignment) {
        case Alignment.LEFT:
            return ALIGN_LEFT;
        case Alignment.RIGHT:
            return ALIGN_RIGHT;
        default:
            return undefined;
    }
}
function iconClass(iconName) {
    if (iconName == null) {
        return undefined;
    }
    return iconName.indexOf(NS + "-icon-") === 0 ? iconName : NS + "-icon-" + iconName;
}
function intentClass(intent) {
    if (intent == null || intent === Intent.NONE) {
        return undefined;
    }
    return NS + "-intent-" + intent.toLowerCase();
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function elementIsOrContains(element, testElement) {
    return element === testElement || element.contains(testElement);
}

/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Returns whether the value is a function. Acts as a type guard. */
/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/ban-types
function isFunction(value) {
    return typeof value === "function";
}

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ns = "[Blueprint]";
var CLAMP_MIN_MAX = ns + " clamp: max cannot be less than min";
var INPUT_WARN_LEFT_ELEMENT_LEFT_ICON_MUTEX = ns + " <InputGroup> leftElement and leftIcon prop are mutually exclusive, with leftElement taking priority.";
var POPOVER_REQUIRES_TARGET = ns + " <Popover> requires target prop or at least one child element.";
var POPOVER_HAS_BACKDROP_INTERACTION = ns + " <Popover hasBackdrop={true}> requires interactionKind={PopoverInteractionKind.CLICK}.";
var POPOVER_WARN_TOO_MANY_CHILDREN = ns +
    " <Popover> supports one or two children; additional children are ignored." +
    " First child is the target, second child is the content. You may instead supply these two as props.";
var POPOVER_WARN_DOUBLE_CONTENT = ns + " <Popover> with two children ignores content prop; use either prop or children.";
var POPOVER_WARN_DOUBLE_TARGET = ns + " <Popover> with children ignores target prop; use either prop or children.";
var POPOVER_WARN_EMPTY_CONTENT = ns + " Disabling <Popover> with empty/whitespace content...";
var POPOVER_WARN_HAS_BACKDROP_INLINE = ns + " <Popover usePortal={false}> ignores hasBackdrop";
var POPOVER_WARN_PLACEMENT_AND_POSITION_MUTEX = ns + " <Popover> supports either placement or position prop, not both.";
var POPOVER_WARN_UNCONTROLLED_ONINTERACTION = ns + " <Popover> onInteraction is ignored when uncontrolled.";
var PORTAL_CONTEXT_CLASS_NAME_STRING = ns + " <Portal> context blueprintPortalClassName must be string";
var SPINNER_WARN_CLASSES_SIZE = ns + " <Spinner> Classes.SMALL/LARGE are ignored if size prop is set.";

/** Returns whether `"production"` exists and equals `env`. */
function isNodeEnv(env) {
    return typeof process !== "undefined" && process.env && "production" === env;
}
/**
 * Clamps the given number between min and max values. Returns value if within
 * range, or closest bound.
 */
function clamp(val, min, max) {
    if (val == null) {
        return val;
    }
    if (max < min) {
        throw new Error(CLAMP_MIN_MAX);
    }
    return Math.min(Math.max(val, min), max);
}

/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns true if `node` is null/undefined, false, empty string, or an array
 * composed of those. If `node` is an array, only one level of the array is
 * checked, for performance reasons.
 */
function isReactNodeEmpty(node, skipArray) {
    if (skipArray === void 0) { skipArray = false; }
    return (node == null ||
        node === "" ||
        node === false ||
        (!skipArray &&
            Array.isArray(node) &&
            // only recurse one level through arrays, for performance
            (node.length === 0 || node.every(function (n) { return isReactNodeEmpty(n, true); }))));
}
/**
 * Converts a React node to an element: non-empty string or number or
 * `React.Fragment` (React 16.3+) is wrapped in given tag name; empty strings
 * and booleans are discarded.
 */
function ensureElement(child, tagName) {
    if (tagName === void 0) { tagName = "span"; }
    if (child == null || typeof child === "boolean") {
        return undefined;
    }
    else if (typeof child === "string") {
        // cull whitespace strings
        return child.trim().length > 0 ? react.createElement(tagName, {}, child) : undefined;
    }
    else if (typeof child === "number" || typeof child.type === "symbol" || Array.isArray(child)) {
        // React.Fragment has a symbol type, ReactNodeArray extends from Array
        return react.createElement(tagName, {}, child);
    }
    else if (isReactElement(child)) {
        return child;
    }
    else {
        // child is inferred as {}
        return undefined;
    }
}
function isReactElement(child) {
    return (typeof child === "object" &&
        typeof child.type !== "undefined" &&
        typeof child.props !== "undefined");
}
/**
 * Returns true if the given JSX element matches the given component type.
 *
 * NOTE: This function only checks equality of `displayName` for performance and
 * to tolerate multiple minor versions of a component being included in one
 * application bundle.
 *
 * @param element JSX element in question
 * @param ComponentType desired component type of element
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function isElementOfType(element, ComponentType) {
    return (element != null &&
        element.type != null &&
        element.type.displayName != null &&
        element.type.displayName === ComponentType.displayName);
}

/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function isRefObject(value) {
    return value != null && typeof value !== "function";
}
function isRefCallback(value) {
    return typeof value === "function";
}
/**
 * Assign the given ref to a target, either a React ref object or a callback which takes the ref as its first argument.
 */
function setRef(refTarget, ref) {
    if (isRefObject(refTarget)) {
        refTarget.current = ref;
    }
    else if (isRefCallback(refTarget)) {
        refTarget(ref);
    }
}
/**
 * Creates a ref handler which assigns the ref returned by React for a mounted component to a field on the target object.
 * The target object is usually a component class.
 *
 * If provided, it will also update the given `refProp` with the value of the ref.
 */
function refHandler(refTargetParent, refTargetKey, refProp) {
    return function (ref) {
        refTargetParent[refTargetKey] = ref;
        setRef(refProp, ref);
    };
}

/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An abstract component that Blueprint components can extend
 * in order to add some common functionality like runtime props validation.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
var AbstractPureComponent2 = /** @class */ (function (_super) {
    __extends(AbstractPureComponent2, _super);
    function AbstractPureComponent2(props, context) {
        var _this = _super.call(this, props, context) || this;
        // Not bothering to remove entries when their timeouts finish because clearing invalid ID is a no-op
        _this.timeoutIds = [];
        _this.requestIds = [];
        /**
         * Clear all known timeouts.
         */
        _this.clearTimeouts = function () {
            if (_this.timeoutIds.length > 0) {
                for (var _i = 0, _a = _this.timeoutIds; _i < _a.length; _i++) {
                    var timeoutId = _a[_i];
                    window.clearTimeout(timeoutId);
                }
                _this.timeoutIds = [];
            }
        };
        /**
         * Clear all known animation frame requests.
         */
        _this.cancelAnimationFrames = function () {
            if (_this.requestIds.length > 0) {
                for (var _i = 0, _a = _this.requestIds; _i < _a.length; _i++) {
                    var requestId = _a[_i];
                    window.cancelAnimationFrame(requestId);
                }
                _this.requestIds = [];
            }
        };
        if (!isNodeEnv("production")) {
            _this.validateProps(_this.props);
        }
        return _this;
    }
    AbstractPureComponent2.prototype.componentDidUpdate = function (_prevProps, _prevState, _snapshot) {
        if (!isNodeEnv("production")) {
            this.validateProps(this.props);
        }
    };
    AbstractPureComponent2.prototype.componentWillUnmount = function () {
        this.clearTimeouts();
        this.cancelAnimationFrames();
    };
    /**
     * Request an animation frame and remember its ID.
     * All pending requests will be canceled when component unmounts.
     *
     * @returns a "cancel" function that will cancel the request when invoked.
     */
    AbstractPureComponent2.prototype.requestAnimationFrame = function (callback) {
        var handle = window.requestAnimationFrame(callback);
        this.requestIds.push(handle);
        return function () { return window.cancelAnimationFrame(handle); };
    };
    /**
     * Set a timeout and remember its ID.
     * All pending timeouts will be cleared when component unmounts.
     *
     * @returns a "cancel" function that will clear timeout when invoked.
     */
    AbstractPureComponent2.prototype.setTimeout = function (callback, timeout) {
        var handle = window.setTimeout(callback, timeout);
        this.timeoutIds.push(handle);
        return function () { return window.clearTimeout(handle); };
    };
    /**
     * Ensures that the props specified for a component are valid.
     * Implementations should check that props are valid and usually throw an Error if they are not.
     * Implementations should not duplicate checks that the type system already guarantees.
     *
     * This method should be used instead of React's
     * [propTypes](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) feature.
     * Like propTypes, these runtime checks run only in development mode.
     */
    AbstractPureComponent2.prototype.validateProps = function (_props) {
        // implement in subclass
    };
    return AbstractPureComponent2;
}(react.PureComponent));

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var DISPLAYNAME_PREFIX = "Blueprint4";
/** A collection of curated prop keys used across our Components which are not valid HTMLElement props. */
var INVALID_PROPS = [
    "active",
    "alignText",
    "asyncControl",
    "containerRef",
    "current",
    "elementRef",
    "fill",
    "icon",
    "inputRef",
    "intent",
    "inline",
    "large",
    "loading",
    "leftElement",
    "leftIcon",
    "minimal",
    "onRemove",
    "outlined",
    "panel",
    "panelClassName",
    "popoverProps",
    "rightElement",
    "rightIcon",
    "round",
    "small",
    "text",
];
/**
 * Typically applied to HTMLElements to filter out disallowed props. When applied to a Component,
 * can filter props from being passed down to the children. Can also filter by a combined list of
 * supplied prop keys and the denylist (only appropriate for HTMLElements).
 *
 * @param props The original props object to filter down.
 * @param {string[]} invalidProps If supplied, overwrites the default denylist.
 * @param {boolean} shouldMerge If true, will merge supplied invalidProps and denylist together.
 */
function removeNonHTMLProps(props, invalidProps, shouldMerge) {
    if (invalidProps === void 0) { invalidProps = INVALID_PROPS; }
    if (shouldMerge === void 0) { shouldMerge = false; }
    if (shouldMerge) {
        invalidProps = invalidProps.concat(INVALID_PROPS);
    }
    return invalidProps.reduce(function (prev, curr) {
        // Props with hyphens (e.g. data-*) are always considered html props
        if (curr.indexOf("-") !== -1) {
            return prev;
        }
        if (prev.hasOwnProperty(curr)) {
            delete prev[curr];
        }
        return prev;
    }, __assign({}, props));
}

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var TAB = 9;
var ENTER = 13;
var ESCAPE = 27;
var SPACE = 32;
var ARROW_UP = 38;
var ARROW_DOWN = 40;
/** Returns whether the key code is `enter` or `space`, the two keys that can click a button. */
function isKeyboardClick(keyCode) {
    return keyCode === ENTER || keyCode === SPACE;
}

var classnames = createCommonjsModule(function (module) {
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if ( module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else {
		window.classNames = classNames;
	}
}());
});

var setPrototypeOf = createCommonjsModule(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var inheritsLoose = createCommonjsModule(function (module) {
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  setPrototypeOf(subClass, superClass);
}

module.exports = _inheritsLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _inheritsLoose = /*@__PURE__*/getDefaultExportFromCjs(inheritsLoose);

var assertThisInitialized = createCommonjsModule(function (module) {
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _assertThisInitialized = /*@__PURE__*/getDefaultExportFromCjs(assertThisInitialized);

var toStr = Object.prototype.toString;

var isArguments = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

var keysShim;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr$1 = Object.prototype.toString;
	var isArgs = isArguments; // eslint-disable-line global-require
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr$1.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr$1.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
var implementation = keysShim;

var slice = Array.prototype.slice;


var origKeys = Object.keys;
var keysShim$1 = origKeys ? function keys(o) { return origKeys(o); } : implementation;

var originalKeys = Object.keys;

keysShim$1.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArguments(object)) {
					return originalKeys(slice.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim$1;
	}
	return Object.keys || keysShim$1;
};

var objectKeys = keysShim$1;

/* eslint complexity: [2, 18], max-statements: [2, 33] */
var shams = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

var shams$1 = function hasToStringTagShams() {
	return shams() && !!Symbol.toStringTag;
};

var origSymbol = typeof Symbol !== 'undefined' && Symbol;


var hasSymbols = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return shams();
};

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice$1 = Array.prototype.slice;
var toStr$2 = Object.prototype.toString;
var funcType = '[object Function]';

var implementation$1 = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr$2.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice$1.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice$1.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice$1.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

var functionBind = Function.prototype.bind || implementation$1;

var src = functionBind.call(Function.call, Object.prototype.hasOwnProperty);

var undefined$1;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols$1 = hasSymbols();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined$1 : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols$1 ? getProto([][Symbol.iterator]()) : undefined$1,
	'%AsyncFromSyncIteratorPrototype%': undefined$1,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols$1 ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
	'%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols$1 ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols$1 ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols$1 ? getProto(''[Symbol.iterator]()) : undefined$1,
	'%Symbol%': hasSymbols$1 ? Symbol : undefined$1,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};



var $concat = functionBind.call(Function.call, Array.prototype.concat);
var $spliceApply = functionBind.call(Function.apply, Array.prototype.splice);
var $replace = functionBind.call(Function.call, String.prototype.replace);
var $strSlice = functionBind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (src(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (src(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

var getIntrinsic = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (src(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined$1;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = src(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

var callBind = createCommonjsModule(function (module) {




var $apply = getIntrinsic('%Function.prototype.apply%');
var $call = getIntrinsic('%Function.prototype.call%');
var $reflectApply = getIntrinsic('%Reflect.apply%', true) || functionBind.call($call, $apply);

var $gOPD = getIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = getIntrinsic('%Object.defineProperty%', true);
var $max = getIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(functionBind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(functionBind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}
});

var $indexOf = callBind(getIntrinsic('String.prototype.indexOf'));

var callBound = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = getIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

var hasToStringTag = shams$1();


var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

var isArguments$1 = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

var hasSymbols$2 = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

var toStr$3 = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction$1 = function (fn) {
	return typeof fn === 'function' && toStr$3.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		origDefineProperty(obj, 'x', { enumerable: false, value: obj });
		// eslint-disable-next-line no-unused-vars, no-restricted-syntax
		for (var _ in obj) { // jscs:ignore disallowUnusedVariables
			return false;
		}
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction$1(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		origDefineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = objectKeys(map);
	if (hasSymbols$2) {
		props = concat.call(props, Object.getOwnPropertySymbols(map));
	}
	for (var i = 0; i < props.length; i += 1) {
		defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	}
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

var defineProperties_1 = defineProperties;

var numberIsNaN = function (value) {
	return value !== value;
};

var implementation$2 = function is(a, b) {
	if (a === 0 && b === 0) {
		return 1 / a === 1 / b;
	}
	if (a === b) {
		return true;
	}
	if (numberIsNaN(a) && numberIsNaN(b)) {
		return true;
	}
	return false;
};

var polyfill = function getPolyfill() {
	return typeof Object.is === 'function' ? Object.is : implementation$2;
};

var shim = function shimObjectIs() {
	var polyfill$1 = polyfill();
	defineProperties_1(Object, { is: polyfill$1 }, {
		is: function testObjectIs() {
			return Object.is !== polyfill$1;
		}
	});
	return polyfill$1;
};

var polyfill$1 = callBind(polyfill(), Object);

defineProperties_1(polyfill$1, {
	getPolyfill: polyfill,
	implementation: implementation$2,
	shim: shim
});

var objectIs = polyfill$1;

var hasToStringTag$1 = shams$1();
var has$1;
var $exec;
var isRegexMarker;
var badStringifier;

if (hasToStringTag$1) {
	has$1 = callBound('Object.prototype.hasOwnProperty');
	$exec = callBound('RegExp.prototype.exec');
	isRegexMarker = {};

	var throwRegexMarker = function () {
		throw isRegexMarker;
	};
	badStringifier = {
		toString: throwRegexMarker,
		valueOf: throwRegexMarker
	};

	if (typeof Symbol.toPrimitive === 'symbol') {
		badStringifier[Symbol.toPrimitive] = throwRegexMarker;
	}
}

var $toString$1 = callBound('Object.prototype.toString');
var gOPD = Object.getOwnPropertyDescriptor;
var regexClass = '[object RegExp]';

var isRegex = hasToStringTag$1
	// eslint-disable-next-line consistent-return
	? function isRegex(value) {
		if (!value || typeof value !== 'object') {
			return false;
		}

		var descriptor = gOPD(value, 'lastIndex');
		var hasLastIndexDataProperty = descriptor && has$1(descriptor, 'value');
		if (!hasLastIndexDataProperty) {
			return false;
		}

		try {
			$exec(value, badStringifier);
		} catch (e) {
			return e === isRegexMarker;
		}
	}
	: function isRegex(value) {
		// In older browsers, typeof regex incorrectly returns 'function'
		if (!value || (typeof value !== 'object' && typeof value !== 'function')) {
			return false;
		}

		return $toString$1(value) === regexClass;
	};

var $Object = Object;
var $TypeError$1 = TypeError;

var implementation$3 = function flags() {
	if (this != null && this !== $Object(this)) {
		throw new $TypeError$1('RegExp.prototype.flags getter called on non-object');
	}
	var result = '';
	if (this.global) {
		result += 'g';
	}
	if (this.ignoreCase) {
		result += 'i';
	}
	if (this.multiline) {
		result += 'm';
	}
	if (this.dotAll) {
		result += 's';
	}
	if (this.unicode) {
		result += 'u';
	}
	if (this.sticky) {
		result += 'y';
	}
	return result;
};

var supportsDescriptors$1 = defineProperties_1.supportsDescriptors;
var $gOPD$1 = Object.getOwnPropertyDescriptor;
var $TypeError$2 = TypeError;

var polyfill$2 = function getPolyfill() {
	if (!supportsDescriptors$1) {
		throw new $TypeError$2('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
	}
	if ((/a/mig).flags === 'gim') {
		var descriptor = $gOPD$1(RegExp.prototype, 'flags');
		if (descriptor && typeof descriptor.get === 'function' && typeof (/a/).dotAll === 'boolean') {
			return descriptor.get;
		}
	}
	return implementation$3;
};

var supportsDescriptors$2 = defineProperties_1.supportsDescriptors;

var gOPD$1 = Object.getOwnPropertyDescriptor;
var defineProperty$1 = Object.defineProperty;
var TypeErr = TypeError;
var getProto$1 = Object.getPrototypeOf;
var regex = /a/;

var shim$1 = function shimFlags() {
	if (!supportsDescriptors$2 || !getProto$1) {
		throw new TypeErr('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
	}
	var polyfill = polyfill$2();
	var proto = getProto$1(regex);
	var descriptor = gOPD$1(proto, 'flags');
	if (!descriptor || descriptor.get !== polyfill) {
		defineProperty$1(proto, 'flags', {
			configurable: true,
			enumerable: false,
			get: polyfill
		});
	}
	return polyfill;
};

var flagsBound = callBind(implementation$3);

defineProperties_1(flagsBound, {
	getPolyfill: polyfill$2,
	implementation: implementation$3,
	shim: shim$1
});

var regexp_prototype_flags = flagsBound;

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateGetDayCall(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr$4 = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag$2 = shams$1();

var isDateObject = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	return hasToStringTag$2 ? tryDateObject(value) : toStr$4.call(value) === dateClass;
};

var getTime = Date.prototype.getTime;

function deepEqual(actual, expected, options) {
  var opts = options || {};

  // 7.1. All identical values are equivalent, as determined by ===.
  if (opts.strict ? objectIs(actual, expected) : actual === expected) {
    return true;
  }

  // 7.3. Other pairs that do not both pass typeof value == 'object', equivalence is determined by ==.
  if (!actual || !expected || (typeof actual !== 'object' && typeof expected !== 'object')) {
    return opts.strict ? objectIs(actual, expected) : actual == expected;
  }

  /*
   * 7.4. For all other Object pairs, including Array objects, equivalence is
   * determined by having the same number of owned properties (as verified
   * with Object.prototype.hasOwnProperty.call), the same set of keys
   * (although not necessarily the same order), equivalent values for every
   * corresponding key, and an identical 'prototype' property. Note: this
   * accounts for both named and indexed properties on Arrays.
   */
  // eslint-disable-next-line no-use-before-define
  return objEquiv(actual, expected, opts);
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer(x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') {
    return false;
  }
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') {
    return false;
  }
  return true;
}

function objEquiv(a, b, opts) {
  /* eslint max-statements: [2, 50] */
  var i, key;
  if (typeof a !== typeof b) { return false; }
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) { return false; }

  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) { return false; }

  if (isArguments$1(a) !== isArguments$1(b)) { return false; }

  var aIsRegex = isRegex(a);
  var bIsRegex = isRegex(b);
  if (aIsRegex !== bIsRegex) { return false; }
  if (aIsRegex || bIsRegex) {
    return a.source === b.source && regexp_prototype_flags(a) === regexp_prototype_flags(b);
  }

  if (isDateObject(a) && isDateObject(b)) {
    return getTime.call(a) === getTime.call(b);
  }

  var aIsBuffer = isBuffer(a);
  var bIsBuffer = isBuffer(b);
  if (aIsBuffer !== bIsBuffer) { return false; }
  if (aIsBuffer || bIsBuffer) { // && would work too, because both are true or both false here
    if (a.length !== b.length) { return false; }
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) { return false; }
    }
    return true;
  }

  if (typeof a !== typeof b) { return false; }

  try {
    var ka = objectKeys(a);
    var kb = objectKeys(b);
  } catch (e) { // happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates hasOwnProperty)
  if (ka.length !== kb.length) { return false; }

  // the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  // ~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) { return false; }
  }
  // equivalent values for every corresponding key, and ~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) { return false; }
  }

  return true;
}

var deepEqual_1 = deepEqual;

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.16.1
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';

var timeoutDuration = function () {
  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      return 1;
    }
  }
  return 0;
}();

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction$2(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

/**
 * Returns the reference node of the reference object, or the reference object itself.
 * @method
 * @memberof Popper.Utils
 * @param {Element|Object} reference - the reference element (the popper will be relative to this)
 * @returns {Element} parent
 */
function getReferenceNode(reference) {
  return reference && reference.referenceNode ? reference.referenceNode : reference;
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent || null;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width']) + parseFloat(styles['border' + sideB + 'Width']);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty$2 = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.width;
  var height = sizes.height || element.clientHeight || result.height;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop);
    var marginLeft = parseFloat(styles.marginLeft);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction$2(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicitly asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);

  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;

  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized]);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width']);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty$2(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty$2(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

    // flips variation if reference element overflows boundaries
    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    // flips variation if popper content overflows boundaries
    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);

    var flippedVariation = flippedVariationByRef || flippedVariationByContent;

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty$2({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty$2({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty$2({}, side, reference[side]),
      end: defineProperty$2({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport',
    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,
    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {Element|referenceObject} reference - The reference element used to position the popper
   * @param {Element} popper - The HTML / XML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction$2(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

var key = '__global_unique_id__';

var gud = function() {
  return commonjsGlobal[key] = (commonjsGlobal[key] || 0) + 1;
};

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var warning = function() {};

var warning_1 = warning;

var implementation$4 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;



var _react2 = _interopRequireDefault(react);



var _propTypes2 = _interopRequireDefault(propTypes);



var _gud2 = _interopRequireDefault(gud);



var _warning2 = _interopRequireDefault(warning_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MAX_SIGNED_31_BIT_INT = 1073741823;

// Inlined Object.is polyfill.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function objectIs(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function createEventEmitter(value) {
  var handlers = [];
  return {
    on: function on(handler) {
      handlers.push(handler);
    },
    off: function off(handler) {
      handlers = handlers.filter(function (h) {
        return h !== handler;
      });
    },
    get: function get() {
      return value;
    },
    set: function set(newValue, changedBits) {
      value = newValue;
      handlers.forEach(function (handler) {
        return handler(value, changedBits);
      });
    }
  };
}

function onlyChild(children) {
  return Array.isArray(children) ? children[0] : children;
}

function createReactContext(defaultValue, calculateChangedBits) {
  var _Provider$childContex, _Consumer$contextType;

  var contextProp = '__create-react-context-' + (0, _gud2.default)() + '__';

  var Provider = function (_Component) {
    _inherits(Provider, _Component);

    function Provider() {
      var _temp, _this, _ret;

      _classCallCheck(this, Provider);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.emitter = createEventEmitter(_this.props.value), _temp), _possibleConstructorReturn(_this, _ret);
    }

    Provider.prototype.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[contextProp] = this.emitter, _ref;
    };

    Provider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        var oldValue = this.props.value;
        var newValue = nextProps.value;
        var changedBits = void 0;

        if (objectIs(oldValue, newValue)) {
          changedBits = 0; // No change
        } else {
          changedBits = typeof calculateChangedBits === 'function' ? calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;

          changedBits |= 0;

          if (changedBits !== 0) {
            this.emitter.set(nextProps.value, changedBits);
          }
        }
      }
    };

    Provider.prototype.render = function render() {
      return this.props.children;
    };

    return Provider;
  }(react.Component);

  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[contextProp] = _propTypes2.default.object.isRequired, _Provider$childContex);

  var Consumer = function (_Component2) {
    _inherits(Consumer, _Component2);

    function Consumer() {
      var _temp2, _this2, _ret2;

      _classCallCheck(this, Consumer);

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, _Component2.call.apply(_Component2, [this].concat(args))), _this2), _this2.state = {
        value: _this2.getValue()
      }, _this2.onUpdate = function (newValue, changedBits) {
        var observedBits = _this2.observedBits | 0;
        if ((observedBits & changedBits) !== 0) {
          _this2.setState({ value: _this2.getValue() });
        }
      }, _temp2), _possibleConstructorReturn(_this2, _ret2);
    }

    Consumer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var observedBits = nextProps.observedBits;

      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
      : observedBits;
    };

    Consumer.prototype.componentDidMount = function componentDidMount() {
      if (this.context[contextProp]) {
        this.context[contextProp].on(this.onUpdate);
      }
      var observedBits = this.props.observedBits;

      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
      : observedBits;
    };

    Consumer.prototype.componentWillUnmount = function componentWillUnmount() {
      if (this.context[contextProp]) {
        this.context[contextProp].off(this.onUpdate);
      }
    };

    Consumer.prototype.getValue = function getValue() {
      if (this.context[contextProp]) {
        return this.context[contextProp].get();
      } else {
        return defaultValue;
      }
    };

    Consumer.prototype.render = function render() {
      return onlyChild(this.props.children)(this.state.value);
    };

    return Consumer;
  }(react.Component);

  Consumer.contextTypes = (_Consumer$contextType = {}, _Consumer$contextType[contextProp] = _propTypes2.default.object, _Consumer$contextType);


  return {
    Provider: Provider,
    Consumer: Consumer
  };
}

exports.default = createReactContext;
module.exports = exports['default'];
});

var lib = createCommonjsModule(function (module, exports) {

exports.__esModule = true;



var _react2 = _interopRequireDefault(react);



var _implementation2 = _interopRequireDefault(implementation$4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createContext || _implementation2.default;
module.exports = exports['default'];
});

var createContext = /*@__PURE__*/getDefaultExportFromCjs(lib);

var ManagerReferenceNodeContext = createContext();
var ManagerReferenceNodeSetterContext = createContext();

var Manager =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Manager, _React$Component);

  function Manager() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "referenceNode", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setReferenceNode", function (newReferenceNode) {
      if (newReferenceNode && _this.referenceNode !== newReferenceNode) {
        _this.referenceNode = newReferenceNode;

        _this.forceUpdate();
      }
    });

    return _this;
  }

  var _proto = Manager.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.referenceNode = null;
  };

  _proto.render = function render() {
    return react.createElement(ManagerReferenceNodeContext.Provider, {
      value: this.referenceNode
    }, react.createElement(ManagerReferenceNodeSetterContext.Provider, {
      value: this.setReferenceNode
    }, this.props.children));
  };

  return Manager;
}(react.Component);

/**
 * Takes an argument and if it's an array, returns the first item in the array,
 * otherwise returns the argument. Used for Preact compatibility.
 */
var unwrapArray = function unwrapArray(arg) {
  return Array.isArray(arg) ? arg[0] : arg;
};
/**
 * Takes a maybe-undefined function and arbitrary args and invokes the function
 * only if it is defined.
 */

var safeInvoke = function safeInvoke(fn) {
  if (typeof fn === "function") {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return fn.apply(void 0, args);
  }
};
/**
 * Sets a ref using either a ref callback or a ref object
 */

var setRef$1 = function setRef(ref, node) {
  // if its a function call it
  if (typeof ref === "function") {
    return safeInvoke(ref, node);
  } // otherwise we should treat it as a ref object
  else if (ref != null) {
      ref.current = node;
    }
};

var initialStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0,
  pointerEvents: 'none'
};
var initialArrowStyle = {};
var InnerPopper =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(InnerPopper, _React$Component);

  function InnerPopper() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      data: undefined,
      placement: undefined
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "popperInstance", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "popperNode", null);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "arrowNode", null);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setPopperNode", function (popperNode) {
      if (!popperNode || _this.popperNode === popperNode) return;
      setRef$1(_this.props.innerRef, popperNode);
      _this.popperNode = popperNode;

      _this.updatePopperInstance();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setArrowNode", function (arrowNode) {
      _this.arrowNode = arrowNode;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "updateStateModifier", {
      enabled: true,
      order: 900,
      fn: function fn(data) {
        var placement = data.placement;

        _this.setState({
          data: data,
          placement: placement
        });

        return data;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getOptions", function () {
      return {
        placement: _this.props.placement,
        eventsEnabled: _this.props.eventsEnabled,
        positionFixed: _this.props.positionFixed,
        modifiers: _extends$1({}, _this.props.modifiers, {
          arrow: _extends$1({}, _this.props.modifiers && _this.props.modifiers.arrow, {
            enabled: !!_this.arrowNode,
            element: _this.arrowNode
          }),
          applyStyle: {
            enabled: false
          },
          updateStateModifier: _this.updateStateModifier
        })
      };
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getPopperStyle", function () {
      return !_this.popperNode || !_this.state.data ? initialStyle : _extends$1({
        position: _this.state.data.offsets.popper.position
      }, _this.state.data.styles);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getPopperPlacement", function () {
      return !_this.state.data ? undefined : _this.state.placement;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getArrowStyle", function () {
      return !_this.arrowNode || !_this.state.data ? initialArrowStyle : _this.state.data.arrowStyles;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getOutOfBoundariesState", function () {
      return _this.state.data ? _this.state.data.hide : undefined;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "destroyPopperInstance", function () {
      if (!_this.popperInstance) return;

      _this.popperInstance.destroy();

      _this.popperInstance = null;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "updatePopperInstance", function () {
      _this.destroyPopperInstance();

      var _assertThisInitialize = _assertThisInitialized(_assertThisInitialized(_this)),
          popperNode = _assertThisInitialize.popperNode;

      var referenceElement = _this.props.referenceElement;
      if (!referenceElement || !popperNode) return;
      _this.popperInstance = new Popper(referenceElement, popperNode, _this.getOptions());
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "scheduleUpdate", function () {
      if (_this.popperInstance) {
        _this.popperInstance.scheduleUpdate();
      }
    });

    return _this;
  }

  var _proto = InnerPopper.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    // If the Popper.js options have changed, update the instance (destroy + create)
    if (this.props.placement !== prevProps.placement || this.props.referenceElement !== prevProps.referenceElement || this.props.positionFixed !== prevProps.positionFixed || !deepEqual_1(this.props.modifiers, prevProps.modifiers, {
      strict: true
    })) {

      this.updatePopperInstance();
    } else if (this.props.eventsEnabled !== prevProps.eventsEnabled && this.popperInstance) {
      this.props.eventsEnabled ? this.popperInstance.enableEventListeners() : this.popperInstance.disableEventListeners();
    } // A placement difference in state means popper determined a new placement
    // apart from the props value. By the time the popper element is rendered with
    // the new position Popper has already measured it, if the place change triggers
    // a size change it will result in a misaligned popper. So we schedule an update to be sure.


    if (prevState.placement !== this.state.placement) {
      this.scheduleUpdate();
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    setRef$1(this.props.innerRef, null);
    this.destroyPopperInstance();
  };

  _proto.render = function render() {
    return unwrapArray(this.props.children)({
      ref: this.setPopperNode,
      style: this.getPopperStyle(),
      placement: this.getPopperPlacement(),
      outOfBoundaries: this.getOutOfBoundariesState(),
      scheduleUpdate: this.scheduleUpdate,
      arrowProps: {
        ref: this.setArrowNode,
        style: this.getArrowStyle()
      }
    });
  };

  return InnerPopper;
}(react.Component);

_defineProperty(InnerPopper, "defaultProps", {
  placement: 'bottom',
  eventsEnabled: true,
  referenceElement: undefined,
  positionFixed: false
});
function Popper$1(_ref) {
  var referenceElement = _ref.referenceElement,
      props = _objectWithoutPropertiesLoose(_ref, ["referenceElement"]);

  return react.createElement(ManagerReferenceNodeContext.Consumer, null, function (referenceNode) {
    return react.createElement(InnerPopper, _extends$1({
      referenceElement: referenceElement !== undefined ? referenceElement : referenceNode
    }, props));
  });
}

var InnerReference =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(InnerReference, _React$Component);

  function InnerReference() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "refHandler", function (node) {
      setRef$1(_this.props.innerRef, node);
      safeInvoke(_this.props.setReferenceNode, node);
    });

    return _this;
  }

  var _proto = InnerReference.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {
    setRef$1(this.props.innerRef, null);
  };

  _proto.render = function render() {
    warning_1(Boolean(this.props.setReferenceNode));
    return unwrapArray(this.props.children)({
      ref: this.refHandler
    });
  };

  return InnerReference;
}(react.Component);

function Reference(props) {
  return react.createElement(ManagerReferenceNodeSetterContext.Consumer, null, function (setReferenceNode) {
    return react.createElement(InnerReference, _extends$1({
      setReferenceNode: setReferenceNode
    }, props));
  });
}

/**
 * Checks if a given element has a CSS class.
 * 
 * @param element the element
 * @param className the CSS class name
 */
function hasClass(element, className) {
  if (element.classList) return !!className && element.classList.contains(className);
  return (" " + (element.className.baseVal || element.className) + " ").indexOf(" " + className + " ") !== -1;
}

/**
 * Adds a CSS class to a given element.
 * 
 * @param element the element
 * @param className the CSS class name
 */

function addClass(element, className) {
  if (element.classList) element.classList.add(className);else if (!hasClass(element, className)) if (typeof element.className === 'string') element.className = element.className + " " + className;else element.setAttribute('class', (element.className && element.className.baseVal || '') + " " + className);
}

function replaceClassName(origClass, classToRemove) {
  return origClass.replace(new RegExp("(^|\\s)" + classToRemove + "(?:\\s|$)", 'g'), '$1').replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '');
}
/**
 * Removes a CSS class from a given element.
 * 
 * @param element the element
 * @param className the CSS class name
 */


function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else if (typeof element.className === 'string') {
    element.className = replaceClassName(element.className, className);
  } else {
    element.setAttribute('class', replaceClassName(element.className && element.className.baseVal || '', className));
  }
}

var config = {
  disabled: false
};

var TransitionGroupContext = react.createContext(null);

var UNMOUNTED = 'unmounted';
var EXITED = 'exited';
var ENTERING = 'entering';
var ENTERED = 'entered';
var EXITING = 'exiting';
/**
 * The Transition component lets you describe a transition from one component
 * state to another _over time_ with a simple declarative API. Most commonly
 * it's used to animate the mounting and unmounting of a component, but can also
 * be used to describe in-place transition states as well.
 *
 * ---
 *
 * **Note**: `Transition` is a platform-agnostic base component. If you're using
 * transitions in CSS, you'll probably want to use
 * [`CSSTransition`](https://reactcommunity.org/react-transition-group/css-transition)
 * instead. It inherits all the features of `Transition`, but contains
 * additional features necessary to play nice with CSS transitions (hence the
 * name of the component).
 *
 * ---
 *
 * By default the `Transition` component does not alter the behavior of the
 * component it renders, it only tracks "enter" and "exit" states for the
 * components. It's up to you to give meaning and effect to those states. For
 * example we can add styles to a component when it enters or exits:
 *
 * ```jsx
 * import { Transition } from 'react-transition-group';
 *
 * const duration = 300;
 *
 * const defaultStyle = {
 *   transition: `opacity ${duration}ms ease-in-out`,
 *   opacity: 0,
 * }
 *
 * const transitionStyles = {
 *   entering: { opacity: 1 },
 *   entered:  { opacity: 1 },
 *   exiting:  { opacity: 0 },
 *   exited:  { opacity: 0 },
 * };
 *
 * const Fade = ({ in: inProp }) => (
 *   <Transition in={inProp} timeout={duration}>
 *     {state => (
 *       <div style={{
 *         ...defaultStyle,
 *         ...transitionStyles[state]
 *       }}>
 *         I'm a fade Transition!
 *       </div>
 *     )}
 *   </Transition>
 * );
 * ```
 *
 * There are 4 main states a Transition can be in:
 *  - `'entering'`
 *  - `'entered'`
 *  - `'exiting'`
 *  - `'exited'`
 *
 * Transition state is toggled via the `in` prop. When `true` the component
 * begins the "Enter" stage. During this stage, the component will shift from
 * its current transition state, to `'entering'` for the duration of the
 * transition and then to the `'entered'` stage once it's complete. Let's take
 * the following example (we'll use the
 * [useState](https://reactjs.org/docs/hooks-reference.html#usestate) hook):
 *
 * ```jsx
 * function App() {
 *   const [inProp, setInProp] = useState(false);
 *   return (
 *     <div>
 *       <Transition in={inProp} timeout={500}>
 *         {state => (
 *           // ...
 *         )}
 *       </Transition>
 *       <button onClick={() => setInProp(true)}>
 *         Click to Enter
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * When the button is clicked the component will shift to the `'entering'` state
 * and stay there for 500ms (the value of `timeout`) before it finally switches
 * to `'entered'`.
 *
 * When `in` is `false` the same thing happens except the state moves from
 * `'exiting'` to `'exited'`.
 */

var Transition = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose$1(Transition, _React$Component);

  function Transition(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this;
    var parentGroup = context; // In the context of a TransitionGroup all enters are really appears

    var appear = parentGroup && !parentGroup.isMounting ? props.enter : props.appear;
    var initialStatus;
    _this.appearStatus = null;

    if (props.in) {
      if (appear) {
        initialStatus = EXITED;
        _this.appearStatus = ENTERING;
      } else {
        initialStatus = ENTERED;
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED;
      } else {
        initialStatus = EXITED;
      }
    }

    _this.state = {
      status: initialStatus
    };
    _this.nextCallback = null;
    return _this;
  }

  Transition.getDerivedStateFromProps = function getDerivedStateFromProps(_ref, prevState) {
    var nextIn = _ref.in;

    if (nextIn && prevState.status === UNMOUNTED) {
      return {
        status: EXITED
      };
    }

    return null;
  } // getSnapshotBeforeUpdate(prevProps) {
  //   let nextStatus = null
  //   if (prevProps !== this.props) {
  //     const { status } = this.state
  //     if (this.props.in) {
  //       if (status !== ENTERING && status !== ENTERED) {
  //         nextStatus = ENTERING
  //       }
  //     } else {
  //       if (status === ENTERING || status === ENTERED) {
  //         nextStatus = EXITING
  //       }
  //     }
  //   }
  //   return { nextStatus }
  // }
  ;

  var _proto = Transition.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.updateStatus(true, this.appearStatus);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var nextStatus = null;

    if (prevProps !== this.props) {
      var status = this.state.status;

      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING;
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING;
        }
      }
    }

    this.updateStatus(false, nextStatus);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.cancelNextCallback();
  };

  _proto.getTimeouts = function getTimeouts() {
    var timeout = this.props.timeout;
    var exit, enter, appear;
    exit = enter = appear = timeout;

    if (timeout != null && typeof timeout !== 'number') {
      exit = timeout.exit;
      enter = timeout.enter; // TODO: remove fallback for next major

      appear = timeout.appear !== undefined ? timeout.appear : enter;
    }

    return {
      exit: exit,
      enter: enter,
      appear: appear
    };
  };

  _proto.updateStatus = function updateStatus(mounting, nextStatus) {
    if (mounting === void 0) {
      mounting = false;
    }

    if (nextStatus !== null) {
      // nextStatus will always be ENTERING or EXITING.
      this.cancelNextCallback();

      if (nextStatus === ENTERING) {
        this.performEnter(mounting);
      } else {
        this.performExit();
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({
        status: UNMOUNTED
      });
    }
  };

  _proto.performEnter = function performEnter(mounting) {
    var _this2 = this;

    var enter = this.props.enter;
    var appearing = this.context ? this.context.isMounting : mounting;

    var _ref2 = this.props.nodeRef ? [appearing] : [reactDom.findDOMNode(this), appearing],
        maybeNode = _ref2[0],
        maybeAppearing = _ref2[1];

    var timeouts = this.getTimeouts();
    var enterTimeout = appearing ? timeouts.appear : timeouts.enter; // no enter animation skip right to ENTERED
    // if we are mounting and running this it means appear _must_ be set

    if (!mounting && !enter || config.disabled) {
      this.safeSetState({
        status: ENTERED
      }, function () {
        _this2.props.onEntered(maybeNode);
      });
      return;
    }

    this.props.onEnter(maybeNode, maybeAppearing);
    this.safeSetState({
      status: ENTERING
    }, function () {
      _this2.props.onEntering(maybeNode, maybeAppearing);

      _this2.onTransitionEnd(enterTimeout, function () {
        _this2.safeSetState({
          status: ENTERED
        }, function () {
          _this2.props.onEntered(maybeNode, maybeAppearing);
        });
      });
    });
  };

  _proto.performExit = function performExit() {
    var _this3 = this;

    var exit = this.props.exit;
    var timeouts = this.getTimeouts();
    var maybeNode = this.props.nodeRef ? undefined : reactDom.findDOMNode(this); // no exit animation skip right to EXITED

    if (!exit || config.disabled) {
      this.safeSetState({
        status: EXITED
      }, function () {
        _this3.props.onExited(maybeNode);
      });
      return;
    }

    this.props.onExit(maybeNode);
    this.safeSetState({
      status: EXITING
    }, function () {
      _this3.props.onExiting(maybeNode);

      _this3.onTransitionEnd(timeouts.exit, function () {
        _this3.safeSetState({
          status: EXITED
        }, function () {
          _this3.props.onExited(maybeNode);
        });
      });
    });
  };

  _proto.cancelNextCallback = function cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  };

  _proto.safeSetState = function safeSetState(nextState, callback) {
    // This shouldn't be necessary, but there are weird race conditions with
    // setState callbacks and unmounting in testing, so always make sure that
    // we can cancel any pending setState callbacks after we unmount.
    callback = this.setNextCallback(callback);
    this.setState(nextState, callback);
  };

  _proto.setNextCallback = function setNextCallback(callback) {
    var _this4 = this;

    var active = true;

    this.nextCallback = function (event) {
      if (active) {
        active = false;
        _this4.nextCallback = null;
        callback(event);
      }
    };

    this.nextCallback.cancel = function () {
      active = false;
    };

    return this.nextCallback;
  };

  _proto.onTransitionEnd = function onTransitionEnd(timeout, handler) {
    this.setNextCallback(handler);
    var node = this.props.nodeRef ? this.props.nodeRef.current : reactDom.findDOMNode(this);
    var doesNotHaveTimeoutOrListener = timeout == null && !this.props.addEndListener;

    if (!node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0);
      return;
    }

    if (this.props.addEndListener) {
      var _ref3 = this.props.nodeRef ? [this.nextCallback] : [node, this.nextCallback],
          maybeNode = _ref3[0],
          maybeNextCallback = _ref3[1];

      this.props.addEndListener(maybeNode, maybeNextCallback);
    }

    if (timeout != null) {
      setTimeout(this.nextCallback, timeout);
    }
  };

  _proto.render = function render() {
    var status = this.state.status;

    if (status === UNMOUNTED) {
      return null;
    }

    var _this$props = this.props,
        children = _this$props.children,
        _in = _this$props.in,
        _mountOnEnter = _this$props.mountOnEnter,
        _unmountOnExit = _this$props.unmountOnExit,
        _appear = _this$props.appear,
        _enter = _this$props.enter,
        _exit = _this$props.exit,
        _timeout = _this$props.timeout,
        _addEndListener = _this$props.addEndListener,
        _onEnter = _this$props.onEnter,
        _onEntering = _this$props.onEntering,
        _onEntered = _this$props.onEntered,
        _onExit = _this$props.onExit,
        _onExiting = _this$props.onExiting,
        _onExited = _this$props.onExited,
        _nodeRef = _this$props.nodeRef,
        childProps = _objectWithoutPropertiesLoose$1(_this$props, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]);

    return (
      /*#__PURE__*/
      // allows for nested Transitions
      react.createElement(TransitionGroupContext.Provider, {
        value: null
      }, typeof children === 'function' ? children(status, childProps) : react.cloneElement(react.Children.only(children), childProps))
    );
  };

  return Transition;
}(react.Component);

Transition.contextType = TransitionGroupContext;
Transition.propTypes =  {}; // Name the function so it is clearer in the documentation

function noop() {}

Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,
  onEnter: noop,
  onEntering: noop,
  onEntered: noop,
  onExit: noop,
  onExiting: noop,
  onExited: noop
};
Transition.UNMOUNTED = UNMOUNTED;
Transition.EXITED = EXITED;
Transition.ENTERING = ENTERING;
Transition.ENTERED = ENTERED;
Transition.EXITING = EXITING;

var _addClass = function addClass$1(node, classes) {
  return node && classes && classes.split(' ').forEach(function (c) {
    return addClass(node, c);
  });
};

var removeClass$1 = function removeClass$1(node, classes) {
  return node && classes && classes.split(' ').forEach(function (c) {
    return removeClass(node, c);
  });
};
/**
 * A transition component inspired by the excellent
 * [ng-animate](https://docs.angularjs.org/api/ngAnimate) library, you should
 * use it if you're using CSS transitions or animations. It's built upon the
 * [`Transition`](https://reactcommunity.org/react-transition-group/transition)
 * component, so it inherits all of its props.
 *
 * `CSSTransition` applies a pair of class names during the `appear`, `enter`,
 * and `exit` states of the transition. The first class is applied and then a
 * second `*-active` class in order to activate the CSS transition. After the
 * transition, matching `*-done` class names are applied to persist the
 * transition state.
 *
 * ```jsx
 * function App() {
 *   const [inProp, setInProp] = useState(false);
 *   return (
 *     <div>
 *       <CSSTransition in={inProp} timeout={200} classNames="my-node">
 *         <div>
 *           {"I'll receive my-node-* classes"}
 *         </div>
 *       </CSSTransition>
 *       <button type="button" onClick={() => setInProp(true)}>
 *         Click to Enter
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * When the `in` prop is set to `true`, the child component will first receive
 * the class `example-enter`, then the `example-enter-active` will be added in
 * the next tick. `CSSTransition` [forces a
 * reflow](https://github.com/reactjs/react-transition-group/blob/5007303e729a74be66a21c3e2205e4916821524b/src/CSSTransition.js#L208-L215)
 * between before adding the `example-enter-active`. This is an important trick
 * because it allows us to transition between `example-enter` and
 * `example-enter-active` even though they were added immediately one after
 * another. Most notably, this is what makes it possible for us to animate
 * _appearance_.
 *
 * ```css
 * .my-node-enter {
 *   opacity: 0;
 * }
 * .my-node-enter-active {
 *   opacity: 1;
 *   transition: opacity 200ms;
 * }
 * .my-node-exit {
 *   opacity: 1;
 * }
 * .my-node-exit-active {
 *   opacity: 0;
 *   transition: opacity 200ms;
 * }
 * ```
 *
 * `*-active` classes represent which styles you want to animate **to**, so it's
 * important to add `transition` declaration only to them, otherwise transitions
 * might not behave as intended! This might not be obvious when the transitions
 * are symmetrical, i.e. when `*-enter-active` is the same as `*-exit`, like in
 * the example above (minus `transition`), but it becomes apparent in more
 * complex transitions.
 *
 * **Note**: If you're using the
 * [`appear`](http://reactcommunity.org/react-transition-group/transition#Transition-prop-appear)
 * prop, make sure to define styles for `.appear-*` classes as well.
 */


var CSSTransition = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose$1(CSSTransition, _React$Component);

  function CSSTransition() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.appliedClasses = {
      appear: {},
      enter: {},
      exit: {}
    };

    _this.onEnter = function (maybeNode, maybeAppearing) {
      var _this$resolveArgument = _this.resolveArguments(maybeNode, maybeAppearing),
          node = _this$resolveArgument[0],
          appearing = _this$resolveArgument[1];

      _this.removeClasses(node, 'exit');

      _this.addClass(node, appearing ? 'appear' : 'enter', 'base');

      if (_this.props.onEnter) {
        _this.props.onEnter(maybeNode, maybeAppearing);
      }
    };

    _this.onEntering = function (maybeNode, maybeAppearing) {
      var _this$resolveArgument2 = _this.resolveArguments(maybeNode, maybeAppearing),
          node = _this$resolveArgument2[0],
          appearing = _this$resolveArgument2[1];

      var type = appearing ? 'appear' : 'enter';

      _this.addClass(node, type, 'active');

      if (_this.props.onEntering) {
        _this.props.onEntering(maybeNode, maybeAppearing);
      }
    };

    _this.onEntered = function (maybeNode, maybeAppearing) {
      var _this$resolveArgument3 = _this.resolveArguments(maybeNode, maybeAppearing),
          node = _this$resolveArgument3[0],
          appearing = _this$resolveArgument3[1];

      var type = appearing ? 'appear' : 'enter';

      _this.removeClasses(node, type);

      _this.addClass(node, type, 'done');

      if (_this.props.onEntered) {
        _this.props.onEntered(maybeNode, maybeAppearing);
      }
    };

    _this.onExit = function (maybeNode) {
      var _this$resolveArgument4 = _this.resolveArguments(maybeNode),
          node = _this$resolveArgument4[0];

      _this.removeClasses(node, 'appear');

      _this.removeClasses(node, 'enter');

      _this.addClass(node, 'exit', 'base');

      if (_this.props.onExit) {
        _this.props.onExit(maybeNode);
      }
    };

    _this.onExiting = function (maybeNode) {
      var _this$resolveArgument5 = _this.resolveArguments(maybeNode),
          node = _this$resolveArgument5[0];

      _this.addClass(node, 'exit', 'active');

      if (_this.props.onExiting) {
        _this.props.onExiting(maybeNode);
      }
    };

    _this.onExited = function (maybeNode) {
      var _this$resolveArgument6 = _this.resolveArguments(maybeNode),
          node = _this$resolveArgument6[0];

      _this.removeClasses(node, 'exit');

      _this.addClass(node, 'exit', 'done');

      if (_this.props.onExited) {
        _this.props.onExited(maybeNode);
      }
    };

    _this.resolveArguments = function (maybeNode, maybeAppearing) {
      return _this.props.nodeRef ? [_this.props.nodeRef.current, maybeNode] // here `maybeNode` is actually `appearing`
      : [maybeNode, maybeAppearing];
    };

    _this.getClassNames = function (type) {
      var classNames = _this.props.classNames;
      var isStringClassNames = typeof classNames === 'string';
      var prefix = isStringClassNames && classNames ? classNames + "-" : '';
      var baseClassName = isStringClassNames ? "" + prefix + type : classNames[type];
      var activeClassName = isStringClassNames ? baseClassName + "-active" : classNames[type + "Active"];
      var doneClassName = isStringClassNames ? baseClassName + "-done" : classNames[type + "Done"];
      return {
        baseClassName: baseClassName,
        activeClassName: activeClassName,
        doneClassName: doneClassName
      };
    };

    return _this;
  }

  var _proto = CSSTransition.prototype;

  _proto.addClass = function addClass(node, type, phase) {
    var className = this.getClassNames(type)[phase + "ClassName"];

    var _this$getClassNames = this.getClassNames('enter'),
        doneClassName = _this$getClassNames.doneClassName;

    if (type === 'appear' && phase === 'done' && doneClassName) {
      className += " " + doneClassName;
    } // This is to force a repaint,
    // which is necessary in order to transition styles when adding a class name.


    if (phase === 'active') {
      /* eslint-disable no-unused-expressions */
      node && node.scrollTop;
    }

    if (className) {
      this.appliedClasses[type][phase] = className;

      _addClass(node, className);
    }
  };

  _proto.removeClasses = function removeClasses(node, type) {
    var _this$appliedClasses$ = this.appliedClasses[type],
        baseClassName = _this$appliedClasses$.base,
        activeClassName = _this$appliedClasses$.active,
        doneClassName = _this$appliedClasses$.done;
    this.appliedClasses[type] = {};

    if (baseClassName) {
      removeClass$1(node, baseClassName);
    }

    if (activeClassName) {
      removeClass$1(node, activeClassName);
    }

    if (doneClassName) {
      removeClass$1(node, doneClassName);
    }
  };

  _proto.render = function render() {
    var _this$props = this.props,
        _ = _this$props.classNames,
        props = _objectWithoutPropertiesLoose$1(_this$props, ["classNames"]);

    return /*#__PURE__*/react.createElement(Transition, _extends$2({}, props, {
      onEnter: this.onEnter,
      onEntered: this.onEntered,
      onEntering: this.onEntering,
      onExit: this.onExit,
      onExiting: this.onExiting,
      onExited: this.onExited
    }));
  };

  return CSSTransition;
}(react.Component);

CSSTransition.defaultProps = {
  classNames: ''
};
CSSTransition.propTypes =  {};

function _assertThisInitialized$1(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/**
 * Given `this.props.children`, return an object mapping key to child.
 *
 * @param {*} children `this.props.children`
 * @return {object} Mapping of key to child
 */

function getChildMapping(children, mapFn) {
  var mapper = function mapper(child) {
    return mapFn && react.isValidElement(child) ? mapFn(child) : child;
  };

  var result = Object.create(null);
  if (children) react.Children.map(children, function (c) {
    return c;
  }).forEach(function (child) {
    // run the map function here instead so that the key is the computed one
    result[child.key] = mapper(child);
  });
  return result;
}
/**
 * When you're adding or removing children some may be added or removed in the
 * same render pass. We want to show *both* since we want to simultaneously
 * animate elements in and out. This function takes a previous set of keys
 * and a new set of keys and merges them with its best guess of the correct
 * ordering. In the future we may expose some of the utilities in
 * ReactMultiChild to make this easy, but for now React itself does not
 * directly have this concept of the union of prevChildren and nextChildren
 * so we implement it here.
 *
 * @param {object} prev prev children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @param {object} next next children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @return {object} a key set that contains all keys in `prev` and all keys
 * in `next` in a reasonable order.
 */

function mergeChildMappings(prev, next) {
  prev = prev || {};
  next = next || {};

  function getValueForKey(key) {
    return key in next ? next[key] : prev[key];
  } // For each key of `next`, the list of keys to insert before that key in
  // the combined list


  var nextKeysPending = Object.create(null);
  var pendingKeys = [];

  for (var prevKey in prev) {
    if (prevKey in next) {
      if (pendingKeys.length) {
        nextKeysPending[prevKey] = pendingKeys;
        pendingKeys = [];
      }
    } else {
      pendingKeys.push(prevKey);
    }
  }

  var i;
  var childMapping = {};

  for (var nextKey in next) {
    if (nextKeysPending[nextKey]) {
      for (i = 0; i < nextKeysPending[nextKey].length; i++) {
        var pendingNextKey = nextKeysPending[nextKey][i];
        childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
      }
    }

    childMapping[nextKey] = getValueForKey(nextKey);
  } // Finally, add the keys which didn't appear before any key in `next`


  for (i = 0; i < pendingKeys.length; i++) {
    childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
  }

  return childMapping;
}

function getProp(child, prop, props) {
  return props[prop] != null ? props[prop] : child.props[prop];
}

function getInitialChildMapping(props, onExited) {
  return getChildMapping(props.children, function (child) {
    return react.cloneElement(child, {
      onExited: onExited.bind(null, child),
      in: true,
      appear: getProp(child, 'appear', props),
      enter: getProp(child, 'enter', props),
      exit: getProp(child, 'exit', props)
    });
  });
}
function getNextChildMapping(nextProps, prevChildMapping, onExited) {
  var nextChildMapping = getChildMapping(nextProps.children);
  var children = mergeChildMappings(prevChildMapping, nextChildMapping);
  Object.keys(children).forEach(function (key) {
    var child = children[key];
    if (!react.isValidElement(child)) return;
    var hasPrev = (key in prevChildMapping);
    var hasNext = (key in nextChildMapping);
    var prevChild = prevChildMapping[key];
    var isLeaving = react.isValidElement(prevChild) && !prevChild.props.in; // item is new (entering)

    if (hasNext && (!hasPrev || isLeaving)) {
      // console.log('entering', key)
      children[key] = react.cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: true,
        exit: getProp(child, 'exit', nextProps),
        enter: getProp(child, 'enter', nextProps)
      });
    } else if (!hasNext && hasPrev && !isLeaving) {
      // item is old (exiting)
      // console.log('leaving', key)
      children[key] = react.cloneElement(child, {
        in: false
      });
    } else if (hasNext && hasPrev && react.isValidElement(prevChild)) {
      // item hasn't changed transition states
      // copy over the last transition props;
      // console.log('unchanged', key)
      children[key] = react.cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: prevChild.props.in,
        exit: getProp(child, 'exit', nextProps),
        enter: getProp(child, 'enter', nextProps)
      });
    }
  });
  return children;
}

var values = Object.values || function (obj) {
  return Object.keys(obj).map(function (k) {
    return obj[k];
  });
};

var defaultProps = {
  component: 'div',
  childFactory: function childFactory(child) {
    return child;
  }
};
/**
 * The `<TransitionGroup>` component manages a set of transition components
 * (`<Transition>` and `<CSSTransition>`) in a list. Like with the transition
 * components, `<TransitionGroup>` is a state machine for managing the mounting
 * and unmounting of components over time.
 *
 * Consider the example below. As items are removed or added to the TodoList the
 * `in` prop is toggled automatically by the `<TransitionGroup>`.
 *
 * Note that `<TransitionGroup>`  does not define any animation behavior!
 * Exactly _how_ a list item animates is up to the individual transition
 * component. This means you can mix and match animations across different list
 * items.
 */

var TransitionGroup = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose$1(TransitionGroup, _React$Component);

  function TransitionGroup(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this;

    var handleExited = _this.handleExited.bind(_assertThisInitialized$1(_this)); // Initial children should all be entering, dependent on appear


    _this.state = {
      contextValue: {
        isMounting: true
      },
      handleExited: handleExited,
      firstRender: true
    };
    return _this;
  }

  var _proto = TransitionGroup.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.mounted = true;
    this.setState({
      contextValue: {
        isMounting: false
      }
    });
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.mounted = false;
  };

  TransitionGroup.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, _ref) {
    var prevChildMapping = _ref.children,
        handleExited = _ref.handleExited,
        firstRender = _ref.firstRender;
    return {
      children: firstRender ? getInitialChildMapping(nextProps, handleExited) : getNextChildMapping(nextProps, prevChildMapping, handleExited),
      firstRender: false
    };
  } // node is `undefined` when user provided `nodeRef` prop
  ;

  _proto.handleExited = function handleExited(child, node) {
    var currentChildMapping = getChildMapping(this.props.children);
    if (child.key in currentChildMapping) return;

    if (child.props.onExited) {
      child.props.onExited(node);
    }

    if (this.mounted) {
      this.setState(function (state) {
        var children = _extends$2({}, state.children);

        delete children[child.key];
        return {
          children: children
        };
      });
    }
  };

  _proto.render = function render() {
    var _this$props = this.props,
        Component = _this$props.component,
        childFactory = _this$props.childFactory,
        props = _objectWithoutPropertiesLoose$1(_this$props, ["component", "childFactory"]);

    var contextValue = this.state.contextValue;
    var children = values(this.state.children).map(childFactory);
    delete props.appear;
    delete props.enter;
    delete props.exit;

    if (Component === null) {
      return /*#__PURE__*/react.createElement(TransitionGroupContext.Provider, {
        value: contextValue
      }, children);
    }

    return /*#__PURE__*/react.createElement(TransitionGroupContext.Provider, {
      value: contextValue
    }, /*#__PURE__*/react.createElement(Component, props, children));
  };

  return TransitionGroup;
}(react.Component);

TransitionGroup.propTypes =  {};
TransitionGroup.defaultProps = defaultProps;

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Detect if `React.createPortal()` API method does not exist. */
var cannotCreatePortal = !isFunction(reactDom.createPortal);
var REACT_CONTEXT_TYPES = {
    blueprintPortalClassName: function (obj, key) {
        if (obj[key] != null && typeof obj[key] !== "string") {
            return new Error(PORTAL_CONTEXT_CLASS_NAME_STRING);
        }
        return undefined;
    },
};
/**
 * This component detaches its contents and re-attaches them to document.body.
 * Use it when you need to circumvent DOM z-stacking (for dialogs, popovers, etc.).
 * Any class names passed to this element will be propagated to the new container element on document.body.
 */
var Portal = /** @class */ (function (_super) {
    __extends(Portal, _super);
    function Portal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.context = {};
        _this.state = { hasMounted: false };
        _this.portalElement = null;
        return _this;
    }
    Portal.prototype.render = function () {
        // Only render `children` once this component has mounted in a browser environment, so they are
        // immediately attached to the DOM tree and can do DOM things like measuring or `autoFocus`.
        // See long comment on componentDidMount in https://reactjs.org/docs/portals.html#event-bubbling-through-portals
        if (cannotCreatePortal ||
            typeof document === "undefined" ||
            !this.state.hasMounted ||
            this.portalElement === null) {
            return null;
        }
        else {
            return reactDom.createPortal(this.props.children, this.portalElement);
        }
    };
    Portal.prototype.componentDidMount = function () {
        if (!this.props.container) {
            return;
        }
        this.portalElement = this.createContainerElement();
        this.props.container.appendChild(this.portalElement);
        /* eslint-disable-next-line react/no-did-mount-set-state */
        this.setState({ hasMounted: true }, this.props.onChildrenMount);
        if (cannotCreatePortal) {
            this.unstableRenderNoPortal();
        }
    };
    Portal.prototype.componentDidUpdate = function (prevProps) {
        // update className prop on portal DOM element
        if (this.portalElement != null && prevProps.className !== this.props.className) {
            maybeRemoveClass(this.portalElement.classList, prevProps.className);
            maybeAddClass(this.portalElement.classList, this.props.className);
        }
        if (cannotCreatePortal) {
            this.unstableRenderNoPortal();
        }
    };
    Portal.prototype.componentWillUnmount = function () {
        if (this.portalElement != null) {
            if (cannotCreatePortal) {
                reactDom.unmountComponentAtNode(this.portalElement);
            }
            this.portalElement.remove();
        }
    };
    Portal.prototype.createContainerElement = function () {
        var container = document.createElement("div");
        container.classList.add(PORTAL);
        maybeAddClass(container.classList, this.props.className);
        if (this.context != null) {
            maybeAddClass(container.classList, this.context.blueprintPortalClassName);
        }
        return container;
    };
    Portal.prototype.unstableRenderNoPortal = function () {
        if (this.portalElement === null) {
            return;
        }
        reactDom.unstable_renderSubtreeIntoContainer(
        /* parentComponent */ this, react.createElement("div", null, this.props.children), this.portalElement);
    };
    Portal.displayName = DISPLAYNAME_PREFIX + ".Portal";
    Portal.contextTypes = REACT_CONTEXT_TYPES;
    Portal.defaultProps = {
        container: typeof document !== "undefined" ? document.body : undefined,
    };
    return Portal;
}(react.Component));
function maybeRemoveClass(classList, className) {
    if (className != null && className !== "") {
        classList.remove.apply(classList, className.split(" "));
    }
}
function maybeAddClass(classList, className) {
    if (className != null && className !== "") {
        classList.add.apply(classList, className.split(" "));
    }
}

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Overlay = /** @class */ (function (_super) {
    __extends(Overlay, _super);
    function Overlay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isAutoFocusing = false;
        _this.state = {
            hasEverOpened: _this.props.isOpen,
        };
        // an HTMLElement that contains the backdrop and any children, to query for focus target
        _this.containerElement = null;
        // An empty, keyboard-focusable div at the beginning of the Overlay content
        _this.startFocusTrapElement = null;
        // An empty, keyboard-focusable div at the end of the Overlay content
        _this.endFocusTrapElement = null;
        _this.refHandlers = {
            // HACKHACK: see https://github.com/palantir/blueprint/issues/3979
            /* eslint-disable-next-line react/no-find-dom-node */
            container: function (ref) { return (_this.containerElement = reactDom.findDOMNode(ref)); },
            endFocusTrap: function (ref) { return (_this.endFocusTrapElement = ref); },
            startFocusTrap: function (ref) { return (_this.startFocusTrapElement = ref); },
        };
        _this.maybeRenderChild = function (child) {
            if (isFunction(child)) {
                child = child();
            }
            if (child == null) {
                return null;
            }
            // add a special class to each child element that will automatically set the appropriate
            // CSS position mode under the hood.
            var decoratedChild = typeof child === "object" ? (react.cloneElement(child, {
                className: classnames(child.props.className, OVERLAY_CONTENT),
            })) : (react.createElement("span", { className: OVERLAY_CONTENT }, child));
            var _a = _this.props, onOpening = _a.onOpening, onOpened = _a.onOpened, onClosing = _a.onClosing, transitionDuration = _a.transitionDuration, transitionName = _a.transitionName;
            return (react.createElement(CSSTransition, { classNames: transitionName, onEntering: onOpening, onEntered: onOpened, onExiting: onClosing, onExited: _this.handleTransitionExited, timeout: transitionDuration, addEndListener: _this.handleTransitionAddEnd }, decoratedChild));
        };
        /**
         * Ensures repeatedly pressing shift+tab keeps focus inside the Overlay. Moves focus to
         * the `endFocusTrapElement` or the first keyboard-focusable element in the Overlay (excluding
         * the `startFocusTrapElement`), depending on whether the element losing focus is inside the
         * Overlay.
         */
        _this.handleStartFocusTrapElementFocus = function (e) {
            var _a;
            if (!_this.props.enforceFocus || _this.isAutoFocusing) {
                return;
            }
            // e.relatedTarget will not be defined if this was a programmatic focus event, as is the
            // case when we call this.bringFocusInsideOverlay() after a user clicked on the backdrop.
            // Otherwise, we're handling a user interaction, and we should wrap around to the last
            // element in this transition group.
            if (e.relatedTarget != null &&
                _this.containerElement.contains(e.relatedTarget) &&
                e.relatedTarget !== _this.endFocusTrapElement) {
                (_a = _this.endFocusTrapElement) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
            }
        };
        /**
         * Wrap around to the end of the dialog if `enforceFocus` is enabled.
         */
        _this.handleStartFocusTrapElementKeyDown = function (e) {
            var _a;
            if (!_this.props.enforceFocus) {
                return;
            }
            // HACKHACK: https://github.com/palantir/blueprint/issues/4165
            /* eslint-disable-next-line deprecation/deprecation */
            if (e.shiftKey && e.which === TAB) {
                var lastFocusableElement = _this.getKeyboardFocusableElements().pop();
                if (lastFocusableElement != null) {
                    lastFocusableElement.focus();
                }
                else {
                    (_a = _this.endFocusTrapElement) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
                }
            }
        };
        /**
         * Ensures repeatedly pressing tab keeps focus inside the Overlay. Moves focus to the
         * `startFocusTrapElement` or the last keyboard-focusable element in the Overlay (excluding the
         * `startFocusTrapElement`), depending on whether the element losing focus is inside the
         * Overlay.
         */
        _this.handleEndFocusTrapElementFocus = function (e) {
            var _a, _b;
            // No need for this.props.enforceFocus check here because this element is only rendered
            // when that prop is true.
            // During user interactions, e.relatedTarget will be defined, and we should wrap around to the
            // "start focus trap" element.
            // Otherwise, we're handling a programmatic focus event, which can only happen after a user
            // presses shift+tab from the first focusable element in the overlay.
            if (e.relatedTarget != null &&
                _this.containerElement.contains(e.relatedTarget) &&
                e.relatedTarget !== _this.startFocusTrapElement) {
                var firstFocusableElement = _this.getKeyboardFocusableElements().shift();
                // ensure we don't re-focus an already active element by comparing against e.relatedTarget
                if (!_this.isAutoFocusing && firstFocusableElement != null && firstFocusableElement !== e.relatedTarget) {
                    firstFocusableElement.focus();
                }
                else {
                    (_a = _this.startFocusTrapElement) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
                }
            }
            else {
                var lastFocusableElement = _this.getKeyboardFocusableElements().pop();
                if (lastFocusableElement != null) {
                    lastFocusableElement.focus();
                }
                else {
                    // Keeps focus within Overlay even if there are no keyboard-focusable children
                    (_b = _this.startFocusTrapElement) === null || _b === void 0 ? void 0 : _b.focus({ preventScroll: true });
                }
            }
        };
        _this.handleTransitionExited = function (node) {
            var _a, _b;
            if (_this.props.shouldReturnFocusOnClose && _this.lastActiveElementBeforeOpened instanceof HTMLElement) {
                _this.lastActiveElementBeforeOpened.focus();
            }
            (_b = (_a = _this.props).onClosed) === null || _b === void 0 ? void 0 : _b.call(_a, node);
        };
        _this.handleBackdropMouseDown = function (e) {
            var _a;
            var _b = _this.props, backdropProps = _b.backdropProps, canOutsideClickClose = _b.canOutsideClickClose, enforceFocus = _b.enforceFocus, onClose = _b.onClose;
            if (canOutsideClickClose) {
                onClose === null || onClose === void 0 ? void 0 : onClose(e);
            }
            if (enforceFocus) {
                _this.bringFocusInsideOverlay();
            }
            (_a = backdropProps === null || backdropProps === void 0 ? void 0 : backdropProps.onMouseDown) === null || _a === void 0 ? void 0 : _a.call(backdropProps, e);
        };
        _this.handleDocumentClick = function (e) {
            var _a = _this.props, canOutsideClickClose = _a.canOutsideClickClose, isOpen = _a.isOpen, onClose = _a.onClose;
            // get the actual target even in the Shadow DOM
            var eventTarget = (e.composed ? e.composedPath()[0] : e.target);
            var stackIndex = Overlay.openStack.indexOf(_this);
            var isClickInThisOverlayOrDescendant = Overlay.openStack
                .slice(stackIndex)
                .some(function (_a) {
                var elem = _a.containerElement;
                // `elem` is the container of backdrop & content, so clicking on that container
                // should not count as being "inside" the overlay.
                return elem && elem.contains(eventTarget) && !elem.isSameNode(eventTarget);
            });
            if (isOpen && !isClickInThisOverlayOrDescendant && canOutsideClickClose) {
                // casting to any because this is a native event
                onClose === null || onClose === void 0 ? void 0 : onClose(e);
            }
        };
        /**
         * When multiple Overlays are open, this event handler is only active for the most recently
         * opened one to avoid Overlays competing with each other for focus.
         */
        _this.handleDocumentFocus = function (e) {
            // get the actual target even in the Shadow DOM
            var eventTarget = e.composed ? e.composedPath()[0] : e.target;
            if (_this.props.enforceFocus &&
                _this.containerElement != null &&
                eventTarget instanceof Node &&
                !_this.containerElement.contains(eventTarget)) {
                // prevent default focus behavior (sometimes auto-scrolls the page)
                e.preventDefault();
                e.stopImmediatePropagation();
                _this.bringFocusInsideOverlay();
            }
        };
        _this.handleKeyDown = function (e) {
            var _a = _this.props, canEscapeKeyClose = _a.canEscapeKeyClose, onClose = _a.onClose;
            // HACKHACK: https://github.com/palantir/blueprint/issues/4165
            /* eslint-disable-next-line deprecation/deprecation */
            if (e.which === ESCAPE && canEscapeKeyClose) {
                onClose === null || onClose === void 0 ? void 0 : onClose(e);
                // prevent browser-specific escape key behavior (Safari exits fullscreen)
                e.preventDefault();
            }
        };
        _this.handleTransitionAddEnd = function () {
            // no-op
        };
        return _this;
    }
    Overlay.getDerivedStateFromProps = function (_a) {
        var hasEverOpened = _a.isOpen;
        if (hasEverOpened) {
            return { hasEverOpened: hasEverOpened };
        }
        return null;
    };
    Overlay.prototype.render = function () {
        var _a;
        var _b;
        // oh snap! no reason to render anything at all if we're being truly lazy
        if (this.props.lazy && !this.state.hasEverOpened) {
            return null;
        }
        var _c = this.props, autoFocus = _c.autoFocus, children = _c.children, className = _c.className, enforceFocus = _c.enforceFocus, usePortal = _c.usePortal, isOpen = _c.isOpen;
        // TransitionGroup types require single array of children; does not support nested arrays.
        // So we must collapse backdrop and children into one array, and every item must be wrapped in a
        // Transition element (no ReactText allowed).
        var childrenWithTransitions = isOpen ? (_b = react.Children.map(children, this.maybeRenderChild)) !== null && _b !== void 0 ? _b : [] : [];
        var maybeBackdrop = this.maybeRenderBackdrop();
        if (maybeBackdrop !== null) {
            childrenWithTransitions.unshift(maybeBackdrop);
        }
        if (isOpen && (autoFocus || enforceFocus) && childrenWithTransitions.length > 0) {
            childrenWithTransitions.unshift(this.renderDummyElement("__start", {
                className: OVERLAY_START_FOCUS_TRAP,
                onFocus: this.handleStartFocusTrapElementFocus,
                onKeyDown: this.handleStartFocusTrapElementKeyDown,
                ref: this.refHandlers.startFocusTrap,
            }));
            if (enforceFocus) {
                childrenWithTransitions.push(this.renderDummyElement("__end", {
                    className: OVERLAY_END_FOCUS_TRAP,
                    onFocus: this.handleEndFocusTrapElementFocus,
                    ref: this.refHandlers.endFocusTrap,
                }));
            }
        }
        var containerClasses = classnames(OVERLAY, (_a = {},
            _a[OVERLAY_OPEN] = isOpen,
            _a[OVERLAY_INLINE] = !usePortal,
            _a), className);
        var transitionGroup = (react.createElement(TransitionGroup, { appear: true, "aria-live": "polite", className: containerClasses, component: "div", onKeyDown: this.handleKeyDown, ref: this.refHandlers.container }, childrenWithTransitions));
        if (usePortal) {
            return (react.createElement(Portal, { className: this.props.portalClassName, container: this.props.portalContainer }, transitionGroup));
        }
        else {
            return transitionGroup;
        }
    };
    Overlay.prototype.componentDidMount = function () {
        if (this.props.isOpen) {
            this.overlayWillOpen();
        }
    };
    Overlay.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.isOpen && !this.props.isOpen) {
            this.overlayWillClose();
        }
        else if (!prevProps.isOpen && this.props.isOpen) {
            this.overlayWillOpen();
        }
    };
    Overlay.prototype.componentWillUnmount = function () {
        this.overlayWillClose();
    };
    /**
     * @public for testing
     * @internal
     */
    Overlay.prototype.bringFocusInsideOverlay = function () {
        var _this = this;
        // always delay focus manipulation to just before repaint to prevent scroll jumping
        return this.requestAnimationFrame(function () {
            var _a;
            // container ref may be undefined between component mounting and Portal rendering
            // activeElement may be undefined in some rare cases in IE
            if (_this.containerElement == null || document.activeElement == null || !_this.props.isOpen) {
                return;
            }
            var isFocusOutsideModal = !_this.containerElement.contains(document.activeElement);
            if (isFocusOutsideModal) {
                (_a = _this.startFocusTrapElement) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
                _this.isAutoFocusing = false;
            }
        });
    };
    Overlay.prototype.maybeRenderBackdrop = function () {
        var _a = this.props, backdropClassName = _a.backdropClassName, backdropProps = _a.backdropProps, hasBackdrop = _a.hasBackdrop, isOpen = _a.isOpen, transitionDuration = _a.transitionDuration, transitionName = _a.transitionName;
        if (hasBackdrop && isOpen) {
            return (react.createElement(CSSTransition, { classNames: transitionName, key: "__backdrop", timeout: transitionDuration, addEndListener: this.handleTransitionAddEnd },
                react.createElement("div", __assign({}, backdropProps, { className: classnames(OVERLAY_BACKDROP, backdropClassName, backdropProps === null || backdropProps === void 0 ? void 0 : backdropProps.className), onMouseDown: this.handleBackdropMouseDown }))));
        }
        else {
            return null;
        }
    };
    Overlay.prototype.renderDummyElement = function (key, props) {
        var _a = this.props, transitionDuration = _a.transitionDuration, transitionName = _a.transitionName;
        return (react.createElement(CSSTransition, { classNames: transitionName, key: key, addEndListener: this.handleTransitionAddEnd, timeout: transitionDuration, unmountOnExit: true },
            react.createElement("div", __assign({ tabIndex: 0 }, props))));
    };
    Overlay.prototype.getKeyboardFocusableElements = function () {
        var focusableElements = this.containerElement !== null
            ? Array.from(
            // Order may not be correct if children elements use tabindex values > 0.
            // Selectors derived from this SO question:
            // https://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus
            this.containerElement.querySelectorAll([
                'a[href]:not([tabindex="-1"])',
                'button:not([disabled]):not([tabindex="-1"])',
                'details:not([tabindex="-1"])',
                'input:not([disabled]):not([tabindex="-1"])',
                'select:not([disabled]):not([tabindex="-1"])',
                'textarea:not([disabled]):not([tabindex="-1"])',
                '[tabindex]:not([tabindex="-1"])',
            ].join(",")))
            : [];
        return focusableElements.filter(function (el) {
            return !el.classList.contains(OVERLAY_START_FOCUS_TRAP) &&
                !el.classList.contains(OVERLAY_END_FOCUS_TRAP);
        });
    };
    Overlay.prototype.overlayWillClose = function () {
        document.removeEventListener("focus", this.handleDocumentFocus, /* useCapture */ true);
        document.removeEventListener("mousedown", this.handleDocumentClick);
        var openStack = Overlay.openStack;
        var stackIndex = openStack.indexOf(this);
        if (stackIndex !== -1) {
            openStack.splice(stackIndex, 1);
            if (openStack.length > 0) {
                var lastOpenedOverlay = Overlay.getLastOpened();
                // Only bring focus back to last overlay if it had autoFocus _and_ enforceFocus enabled.
                // If `autoFocus={false}`, it's likely that the overlay never received focus in the first place,
                // so it would be surprising for us to send it there. See https://github.com/palantir/blueprint/issues/4921
                if (lastOpenedOverlay.props.autoFocus && lastOpenedOverlay.props.enforceFocus) {
                    lastOpenedOverlay.bringFocusInsideOverlay();
                    document.addEventListener("focus", lastOpenedOverlay.handleDocumentFocus, /* useCapture */ true);
                }
            }
            if (openStack.filter(function (o) { return o.props.usePortal && o.props.hasBackdrop; }).length === 0) {
                document.body.classList.remove(OVERLAY_OPEN);
            }
        }
    };
    Overlay.prototype.overlayWillOpen = function () {
        var getLastOpened = Overlay.getLastOpened, openStack = Overlay.openStack;
        if (openStack.length > 0) {
            document.removeEventListener("focus", getLastOpened().handleDocumentFocus, /* useCapture */ true);
        }
        openStack.push(this);
        if (this.props.autoFocus) {
            this.isAutoFocusing = true;
            this.bringFocusInsideOverlay();
        }
        if (this.props.enforceFocus) {
            // Focus events do not bubble, but setting useCapture allows us to listen in and execute
            // our handler before all others
            document.addEventListener("focus", this.handleDocumentFocus, /* useCapture */ true);
        }
        if (this.props.canOutsideClickClose && !this.props.hasBackdrop) {
            document.addEventListener("mousedown", this.handleDocumentClick);
        }
        if (this.props.hasBackdrop && this.props.usePortal) {
            // add a class to the body to prevent scrolling of content below the overlay
            document.body.classList.add(OVERLAY_OPEN);
        }
        this.lastActiveElementBeforeOpened = document.activeElement;
    };
    Overlay.displayName = DISPLAYNAME_PREFIX + ".Overlay";
    Overlay.defaultProps = {
        autoFocus: true,
        backdropProps: {},
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        hasBackdrop: true,
        isOpen: false,
        lazy: true,
        shouldReturnFocusOnClose: true,
        transitionDuration: 300,
        transitionName: OVERLAY,
        usePortal: true,
    };
    Overlay.openStack = [];
    Overlay.getLastOpened = function () { return Overlay.openStack[Overlay.openStack.length - 1]; };
    return Overlay;
}(AbstractPureComponent2));

/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** `ResizeSensor` requires a single DOM element child and will error otherwise. */
var ResizeSensor = /** @class */ (function (_super) {
    __extends(ResizeSensor, _super);
    function ResizeSensor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = null;
        _this.observer = new index(function (entries) { var _a, _b; return (_b = (_a = _this.props).onResize) === null || _b === void 0 ? void 0 : _b.call(_a, entries); });
        return _this;
    }
    ResizeSensor.prototype.render = function () {
        // pass-through render of single child
        return react.Children.only(this.props.children);
    };
    ResizeSensor.prototype.componentDidMount = function () {
        this.observeElement();
    };
    ResizeSensor.prototype.componentDidUpdate = function (prevProps) {
        this.observeElement(this.props.observeParents !== prevProps.observeParents);
    };
    ResizeSensor.prototype.componentWillUnmount = function () {
        this.observer.disconnect();
    };
    /**
     * Observe the DOM element, if defined and different from the currently
     * observed element. Pass `force` argument to skip element checks and always
     * re-observe.
     */
    ResizeSensor.prototype.observeElement = function (force) {
        if (force === void 0) { force = false; }
        var element = this.getElement();
        if (!(element instanceof Element)) {
            // stop everything if not defined
            this.observer.disconnect();
            return;
        }
        if (element === this.element && !force) {
            // quit if given same element -- nothing to update (unless forced)
            return;
        }
        else {
            // clear observer list if new element
            this.observer.disconnect();
            // remember element reference for next time
            this.element = element;
        }
        // observer callback is invoked immediately when observing new elements
        this.observer.observe(element);
        if (this.props.observeParents) {
            var parent_1 = element.parentElement;
            while (parent_1 != null) {
                this.observer.observe(parent_1);
                parent_1 = parent_1.parentElement;
            }
        }
    };
    ResizeSensor.prototype.getElement = function () {
        try {
            // using findDOMNode for two reasons:
            // 1. cloning to insert a ref is unwieldy and not performant.
            // 2. ensure that we resolve to an actual DOM node (instead of any JSX ref instance).
            // HACKHACK: see https://github.com/palantir/blueprint/issues/3979
            /* eslint-disable-next-line react/no-find-dom-node */
            return reactDom.findDOMNode(this);
        }
        catch (_a) {
            // swallow error if findDOMNode is run on unmounted component.
            return null;
        }
    };
    ResizeSensor.displayName = DISPLAYNAME_PREFIX + ".ResizeSensor";
    return ResizeSensor;
}(AbstractPureComponent2));

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** @deprecated use { Tooltip2 } from "@blueprintjs/popover2" */
var Tooltip = /** @class */ (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // eslint-disable-next-line deprecation/deprecation
        _this.popover = null;
        return _this;
    }
    Tooltip.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, children = _b.children, intent = _b.intent, popoverClassName = _b.popoverClassName, restProps = __rest(_b, ["children", "intent", "popoverClassName"]);
        var classes = classnames(TOOLTIP, (_a = {}, _a[MINIMAL] = this.props.minimal, _a), intentClass(intent), popoverClassName);
        return (
        /* eslint-disable deprecation/deprecation */
        react.createElement(Popover, __assign({ interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY, modifiers: { arrow: { enabled: !this.props.minimal } } }, restProps, { autoFocus: false, canEscapeKeyClose: false, enforceFocus: false, lazy: true, popoverClassName: classes, portalContainer: this.props.portalContainer, ref: function (ref) { return (_this.popover = ref); } }), children));
    };
    Tooltip.prototype.reposition = function () {
        if (this.popover != null) {
            this.popover.reposition();
        }
    };
    Tooltip.displayName = DISPLAYNAME_PREFIX + ".Tooltip";
    Tooltip.defaultProps = {
        hoverCloseDelay: 0,
        hoverOpenDelay: 100,
        minimal: false,
        transitionDuration: 100,
    };
    return Tooltip;
}(AbstractPureComponent2));

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Popper placement utils
// ======================
/** Converts a full placement to one of the four positions by stripping text after the `-`. */
function getPosition(placement) {
    return placement.split("-")[0];
}
/** Returns true if position is left or right. */
function isVerticalPosition(side) {
    return ["left", "right"].indexOf(side) !== -1;
}
/** Returns the opposite position. */
function getOppositePosition(side) {
    switch (side) {
        case "top":
            return "bottom";
        case "left":
            return "right";
        case "bottom":
            return "top";
        default:
            return "left";
    }
}
/** Returns the CSS alignment keyword corresponding to given placement. */
function getAlignment(placement) {
    var align = placement.split("-")[1];
    switch (align) {
        case "start":
            return "left";
        case "end":
            return "right";
        default:
            return "center";
    }
}
// Popper modifiers
// ================
/** Modifier helper function to compute popper transform-origin based on arrow position */
function getTransformOrigin(data) {
    var position = getPosition(data.placement);
    if (data.arrowElement == null) {
        return isVerticalPosition(position)
            ? getOppositePosition(position) + " " + getAlignment(position)
            : getAlignment(position) + " " + getOppositePosition(position);
    }
    else {
        var arrowSizeShift = data.arrowElement.clientHeight / 2;
        var arrow = data.offsets.arrow;
        // can use keyword for dimension without the arrow, to ease computation burden.
        // move origin by half arrow's height to keep it centered.
        return isVerticalPosition(position)
            ? getOppositePosition(position) + " " + (arrow.top + arrowSizeShift) + "px"
            : arrow.left + arrowSizeShift + "px " + getOppositePosition(position);
    }
}
// additional space between arrow and edge of target
var ARROW_SPACING = 4;
/** Popper modifier that offsets popper and arrow so arrow points out of the correct side */
var arrowOffsetModifier = function (data) {
    if (data.arrowElement == null) {
        return data;
    }
    // our arrows have equal width and height
    var arrowSize = data.arrowElement.clientWidth;
    // this logic borrowed from original Popper arrow modifier itself
    var position = getPosition(data.placement);
    var isVertical = isVerticalPosition(position);
    var len = isVertical ? "width" : "height";
    var offsetSide = isVertical ? "left" : "top";
    var arrowOffsetSize = Math.round(arrowSize / 2 / Math.sqrt(2));
    // offset popover by arrow size, offset arrow in the opposite direction
    if (position === "top" || position === "left") {
        // the "up & back" directions require negative popper offsets
        data.offsets.popper[offsetSide] -= arrowOffsetSize + ARROW_SPACING;
        // can only use left/top on arrow so gotta get clever with 100% + X
        data.offsets.arrow[offsetSide] = data.offsets.popper[len] - arrowSize + arrowOffsetSize;
    }
    else {
        data.offsets.popper[offsetSide] += arrowOffsetSize + ARROW_SPACING;
        data.offsets.arrow[offsetSide] = -arrowOffsetSize;
    }
    return data;
};

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// these paths come from the Core Kit Sketch file
// https://github.com/palantir/blueprint/blob/develop/resources/sketch/Core%20Kit.sketch
var SVG_SHADOW_PATH = "M8.11 6.302c1.015-.936 1.887-2.922 1.887-4.297v26c0-1.378" +
    "-.868-3.357-1.888-4.297L.925 17.09c-1.237-1.14-1.233-3.034 0-4.17L8.11 6.302z";
var SVG_ARROW_PATH = "M8.787 7.036c1.22-1.125 2.21-3.376 2.21-5.03V0v30-2.005" +
    "c0-1.654-.983-3.9-2.21-5.03l-7.183-6.616c-.81-.746-.802-1.96 0-2.7l7.183-6.614z";
/** Modifier helper function to compute arrow rotate() transform */
function getArrowAngle(placement) {
    if (placement == null) {
        return 0;
    }
    // can only be top/left/bottom/right - auto is resolved internally
    switch (getPosition(placement)) {
        case "top":
            return -90;
        case "left":
            return 180;
        case "bottom":
            return 90;
        default:
            return 0;
    }
}
var PopoverArrow = function (_a) {
    var _b = _a.arrowProps, ref = _b.ref, style = _b.style, placement = _a.placement;
    return (react.createElement("div", { className: POPOVER_ARROW, ref: ref, style: style.left == null || isNaN(+style.left) ? {} : style },
        react.createElement("svg", { viewBox: "0 0 30 30", style: { transform: "rotate(" + getArrowAngle(placement) + "deg)" } },
            react.createElement("path", { className: POPOVER_ARROW + "-border", d: SVG_SHADOW_PATH }),
            react.createElement("path", { className: POPOVER_ARROW + "-fill", d: SVG_ARROW_PATH }))));
};
PopoverArrow.displayName = DISPLAYNAME_PREFIX + ".PopoverArrow";

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Convert a position to a placement.
 *
 * @param position the position to convert
 */
function positionToPlacement(position) {
    /* istanbul ignore next */
    switch (position) {
        case Position.TOP_LEFT:
            return "top-start";
        case Position.TOP:
            return "top";
        case Position.TOP_RIGHT:
            return "top-end";
        case Position.RIGHT_TOP:
            return "right-start";
        case Position.RIGHT:
            return "right";
        case Position.RIGHT_BOTTOM:
            return "right-end";
        case Position.BOTTOM_RIGHT:
            return "bottom-end";
        case Position.BOTTOM:
            return "bottom";
        case Position.BOTTOM_LEFT:
            return "bottom-start";
        case Position.LEFT_BOTTOM:
            return "left-end";
        case Position.LEFT:
            return "left";
        case Position.LEFT_TOP:
            return "left-start";
        case "auto":
        case "auto-start":
        case "auto-end":
            // Return the string unchanged.
            return position;
        default:
            return assertNever(position);
    }
}
/* istanbul ignore next */
function assertNever(x) {
    throw new Error("Unexpected position: " + x);
}

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var PopoverInteractionKind = {
    CLICK: "click",
    CLICK_TARGET_ONLY: "click-target",
    HOVER: "hover",
    HOVER_TARGET_ONLY: "hover-target",
};
/** @deprecated use { Popover2 } from "@blueprintjs/popover2" */
var Popover = /** @class */ (function (_super) {
    __extends(Popover, _super);
    function Popover() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // eslint-disable-next-line deprecation/deprecation
        _this.popoverRef = react.createRef();
        /**
         * DOM element that contains the popover.
         * When `usePortal={true}`, this element will be portaled outside the usual DOM flow,
         * so this reference can be very useful for testing.
         */
        _this.popoverElement = null;
        /** DOM element that contains the target. */
        _this.targetElement = null;
        _this.state = {
            hasDarkParent: false,
            isOpen: _this.getIsOpen(_this.props),
            transformOrigin: "",
        };
        // a flag that lets us detect mouse movement between the target and popover,
        // now that mouseleave is triggered when you cross the gap between the two.
        _this.isMouseInTargetOrPopover = false;
        // a flag that indicates whether the target previously lost focus to another
        // element on the same page.
        _this.lostFocusOnSamePage = true;
        _this.handlePopoverRef = refHandler(_this, "popoverElement", _this.props.popoverRef);
        _this.handleTargetRef = function (ref) { return (_this.targetElement = ref); };
        /**
         * Instance method to instruct the `Popover` to recompute its position.
         *
         * This method should only be used if you are updating the target in a way
         * that does not cause it to re-render, such as changing its _position_
         * without changing its _size_ (since `Popover` already repositions when it
         * detects a resize).
         */
        _this.reposition = function () { var _a; return (_a = _this.popperScheduleUpdate) === null || _a === void 0 ? void 0 : _a.call(_this); };
        _this.renderPopover = function (popperProps) {
            var _a;
            var _b = _this.props, interactionKind = _b.interactionKind, usePortal = _b.usePortal;
            var transformOrigin = _this.state.transformOrigin;
            // Need to update our reference to this on every render as it will change.
            _this.popperScheduleUpdate = popperProps.scheduleUpdate;
            var popoverHandlers = {
                // always check popover clicks for dismiss class
                onClick: _this.handlePopoverClick,
            };
            if (interactionKind === PopoverInteractionKind.HOVER ||
                (!usePortal && interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY)) {
                popoverHandlers.onMouseEnter = _this.handleMouseEnter;
                popoverHandlers.onMouseLeave = _this.handleMouseLeave;
            }
            var popoverClasses = classnames(POPOVER, (_a = {},
                _a[DARK] = _this.props.inheritDarkTheme && _this.state.hasDarkParent,
                _a[MINIMAL] = _this.props.minimal,
                _a[POPOVER_CAPTURING_DISMISS] = _this.props.captureDismiss,
                _a), _this.props.popoverClassName);
            return (react.createElement("div", { className: TRANSITION_CONTAINER, ref: popperProps.ref, style: popperProps.style },
                react.createElement(ResizeSensor, { onResize: _this.reposition },
                    react.createElement("div", __assign({ className: popoverClasses, style: { transformOrigin: transformOrigin }, ref: _this.popoverRef }, popoverHandlers),
                        _this.isArrowEnabled() && (react.createElement(PopoverArrow, { arrowProps: popperProps.arrowProps, placement: popperProps.placement })),
                        react.createElement("div", { className: POPOVER_CONTENT }, _this.understandChildren().content)))));
        };
        _this.renderTarget = function (referenceProps) {
            var _a, _b;
            var _c = _this.props, fill = _c.fill, openOnTargetFocus = _c.openOnTargetFocus, targetClassName = _c.targetClassName, _d = _c.targetProps, targetProps = _d === void 0 ? {} : _d;
            var isOpen = _this.state.isOpen;
            var isControlled = _this.isControlled();
            var isHoverInteractionKind = _this.isHoverInteractionKind();
            var targetTagName = _this.props.targetTagName;
            if (fill) {
                targetTagName = "div";
            }
            var finalTargetProps = isHoverInteractionKind
                ? {
                    // HOVER handlers
                    onBlur: _this.handleTargetBlur,
                    onFocus: _this.handleTargetFocus,
                    onMouseEnter: _this.handleMouseEnter,
                    onMouseLeave: _this.handleMouseLeave,
                }
                : {
                    // CLICK needs only one handler
                    onClick: _this.handleTargetClick,
                };
            finalTargetProps["aria-haspopup"] = "true";
            finalTargetProps.className = classnames(POPOVER_TARGET, (_a = {}, _a[POPOVER_OPEN] = isOpen, _a), targetProps.className, targetClassName);
            finalTargetProps.ref = referenceProps.ref;
            var rawTarget = ensureElement(_this.understandChildren().target);
            if (rawTarget === undefined) {
                return null;
            }
            var rawTabIndex = rawTarget.props.tabIndex;
            // ensure target is focusable if relevant prop enabled
            var tabIndex = rawTabIndex == null && openOnTargetFocus && isHoverInteractionKind ? 0 : rawTabIndex;
            var clonedTarget = react.cloneElement(rawTarget, {
                className: classnames(rawTarget.props.className, (_b = {},
                    // this class is mainly useful for button targets; we should only apply it for uncontrolled popovers
                    // when they are opened by a user interaction
                    _b[ACTIVE] = isOpen && !isControlled && !isHoverInteractionKind,
                    _b)),
                // force disable single Tooltip child when popover is open (BLUEPRINT-552)
                /* eslint-disable-next-line deprecation/deprecation */
                disabled: isOpen && isElementOfType(rawTarget, Tooltip) ? true : rawTarget.props.disabled,
                tabIndex: tabIndex,
            });
            var target = react.createElement(targetTagName, __assign(__assign({}, targetProps), finalTargetProps), clonedTarget);
            return react.createElement(ResizeSensor, { onResize: _this.reposition }, target);
        };
        _this.isControlled = function () { return _this.props.isOpen !== undefined; };
        _this.handleTargetFocus = function (e) {
            var _a, _b;
            if (_this.props.openOnTargetFocus && _this.isHoverInteractionKind()) {
                if (e.relatedTarget == null && !_this.lostFocusOnSamePage) {
                    // ignore this focus event -- the target was already focused but the page itself
                    // lost focus (e.g. due to switching tabs).
                    return;
                }
                _this.handleMouseEnter(e);
            }
            (_b = (_a = _this.props.targetProps) === null || _a === void 0 ? void 0 : _a.onFocus) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        };
        _this.handleTargetBlur = function (e) {
            var _a, _b;
            if (_this.props.openOnTargetFocus && _this.isHoverInteractionKind()) {
                // if the next element to receive focus is within the popover, we'll want to leave the
                // popover open. e.relatedTarget ought to tell us the next element to receive focus, but if the user just
                // clicked on an element which is not focusable (either by default or with a tabIndex attribute),
                // it won't be set. So, we filter those out here and assume that a click handler somewhere else will
                // close the popover if necessary.
                if (e.relatedTarget != null && !_this.isElementInPopover(e.relatedTarget)) {
                    _this.handleMouseLeave(e);
                }
            }
            _this.lostFocusOnSamePage = e.relatedTarget != null;
            (_b = (_a = _this.props.targetProps) === null || _a === void 0 ? void 0 : _a.onBlur) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        };
        _this.handleMouseEnter = function (e) {
            var _a, _b;
            _this.isMouseInTargetOrPopover = true;
            // if we're entering the popover, and the mode is set to be HOVER_TARGET_ONLY, we want to manually
            // trigger the mouse leave event, as hovering over the popover shouldn't count.
            if (!_this.props.usePortal &&
                _this.isElementInPopover(e.target) &&
                _this.props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY &&
                !_this.props.openOnTargetFocus) {
                _this.handleMouseLeave(e);
            }
            else if (!_this.props.disabled) {
                // only begin opening popover when it is enabled
                _this.setOpenState(true, e, _this.props.hoverOpenDelay);
            }
            (_b = (_a = _this.props.targetProps) === null || _a === void 0 ? void 0 : _a.onMouseEnter) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        };
        _this.handleMouseLeave = function (e) {
            var _a, _b;
            _this.isMouseInTargetOrPopover = false;
            // wait until the event queue is flushed, because we want to leave the
            // popover open if the mouse entered the popover immediately after
            // leaving the target (or vice versa).
            _this.setTimeout(function () {
                if (_this.isMouseInTargetOrPopover) {
                    return;
                }
                // user-configurable closing delay is helpful when moving mouse from target to popover
                _this.setOpenState(false, e, _this.props.hoverCloseDelay);
            });
            (_b = (_a = _this.props.targetProps) === null || _a === void 0 ? void 0 : _a.onMouseLeave) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        };
        _this.handlePopoverClick = function (e) {
            var eventTarget = e.target;
            var eventPopover = eventTarget.closest("." + POPOVER);
            var isEventFromSelf = eventPopover === _this.popoverRef.current;
            var isEventPopoverCapturing = eventPopover === null || eventPopover === void 0 ? void 0 : eventPopover.classList.contains(POPOVER_CAPTURING_DISMISS);
            // an OVERRIDE inside a DISMISS does not dismiss, and a DISMISS inside an OVERRIDE will dismiss.
            var dismissElement = eventTarget.closest("." + POPOVER_DISMISS + ", ." + POPOVER_DISMISS_OVERRIDE);
            var shouldDismiss = dismissElement != null && dismissElement.classList.contains(POPOVER_DISMISS);
            var isDisabled = eventTarget.closest(":disabled, ." + DISABLED) != null;
            if (shouldDismiss && !isDisabled && (!isEventPopoverCapturing || isEventFromSelf)) {
                _this.setOpenState(false, e);
            }
        };
        _this.handleOverlayClose = function (e) {
            if (_this.targetElement === null || e === undefined) {
                return;
            }
            var eventTarget = e.target;
            // if click was in target, target event listener will handle things, so don't close
            if (!elementIsOrContains(_this.targetElement, eventTarget) || e.nativeEvent instanceof KeyboardEvent) {
                _this.setOpenState(false, e);
            }
        };
        _this.handleTargetClick = function (e) {
            var _a, _b;
            // ensure click did not originate from within inline popover before closing
            if (!_this.props.disabled && !_this.isElementInPopover(e.target)) {
                if (_this.props.isOpen == null) {
                    _this.setState(function (prevState) { return ({ isOpen: !prevState.isOpen }); });
                }
                else {
                    _this.setOpenState(!_this.props.isOpen, e);
                }
            }
            (_b = (_a = _this.props.targetProps) === null || _a === void 0 ? void 0 : _a.onClick) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        };
        /** Popper modifier that updates React state (for style properties) based on latest data. */
        _this.updatePopoverState = function (data) {
            // always set string; let shouldComponentUpdate determine if update is necessary
            _this.setState({ transformOrigin: getTransformOrigin(data) });
            return data;
        };
        return _this;
    }
    Popover.prototype.render = function () {
        var _a;
        var _b;
        // rename wrapper tag to begin with uppercase letter so it's recognized
        // as JSX component instead of intrinsic element. but because of its
        // type, tsc actually recognizes that it is _any_ intrinsic element, so
        // it can typecheck the HTML props!!
        var _c = this.props, className = _c.className, disabled = _c.disabled, fill = _c.fill, placement = _c.placement, _d = _c.position, position = _d === void 0 ? "auto" : _d, shouldReturnFocusOnClose = _c.shouldReturnFocusOnClose;
        var isOpen = this.state.isOpen;
        var wrapperTagName = this.props.wrapperTagName;
        if (fill) {
            wrapperTagName = "div";
        }
        var isContentEmpty = ensureElement(this.understandChildren().content) == null;
        // need to do this check in render(), because `isOpen` is derived from
        // state, and state can't necessarily be accessed in validateProps.
        if (isContentEmpty && !disabled && isOpen !== false && !isNodeEnv("production")) {
            console.warn(POPOVER_WARN_EMPTY_CONTENT);
        }
        var wrapperClasses = classnames(POPOVER_WRAPPER, className, (_a = {},
            _a[FILL] = fill,
            _a));
        var defaultAutoFocus = this.isHoverInteractionKind() ? false : undefined;
        var wrapper = react.createElement(wrapperTagName, { className: wrapperClasses }, react.createElement(Reference, { innerRef: this.handleTargetRef }, this.renderTarget), react.createElement(Overlay, { autoFocus: (_b = this.props.autoFocus) !== null && _b !== void 0 ? _b : defaultAutoFocus, backdropClassName: POPOVER_BACKDROP, backdropProps: this.props.backdropProps, canEscapeKeyClose: this.props.canEscapeKeyClose, canOutsideClickClose: this.props.interactionKind === PopoverInteractionKind.CLICK, className: this.props.portalClassName, enforceFocus: this.props.enforceFocus, hasBackdrop: this.props.hasBackdrop, isOpen: isOpen && !isContentEmpty, onClose: this.handleOverlayClose, onClosed: this.props.onClosed, onClosing: this.props.onClosing, onOpened: this.props.onOpened, onOpening: this.props.onOpening, transitionDuration: this.props.transitionDuration, transitionName: POPOVER, usePortal: this.props.usePortal, portalContainer: this.props.portalContainer, 
            // if hover interaciton, it doesn't make sense to take over focus control
            shouldReturnFocusOnClose: this.isHoverInteractionKind() ? false : shouldReturnFocusOnClose },
            react.createElement(Popper$1, { innerRef: this.handlePopoverRef, placement: placement !== null && placement !== void 0 ? placement : positionToPlacement(position), modifiers: this.getPopperModifiers() }, this.renderPopover)));
        return react.createElement(Manager, null, wrapper);
    };
    Popover.prototype.componentDidMount = function () {
        this.updateDarkParent();
    };
    Popover.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        if (prevProps.popoverRef !== this.props.popoverRef) {
            setRef(prevProps.popoverRef, null);
            this.handlePopoverRef = refHandler(this, "popoverElement", this.props.popoverRef);
            setRef(this.props.popoverRef, this.popoverElement);
        }
        this.updateDarkParent();
        var nextIsOpen = this.getIsOpen(this.props);
        if (this.props.isOpen != null && nextIsOpen !== this.state.isOpen) {
            this.setOpenState(nextIsOpen);
            // tricky: setOpenState calls setState only if this.props.isOpen is
            // not controlled, so we need to invoke setState manually here.
            this.setState({ isOpen: nextIsOpen });
        }
        else if (this.props.disabled && this.state.isOpen && this.props.isOpen == null) {
            // special case: close an uncontrolled popover when disabled is set to true
            this.setOpenState(false);
        }
    };
    Popover.prototype.validateProps = function (props) {
        if (props.isOpen == null && props.onInteraction != null) {
            console.warn(POPOVER_WARN_UNCONTROLLED_ONINTERACTION);
        }
        if (props.hasBackdrop && !props.usePortal) {
            console.warn(POPOVER_WARN_HAS_BACKDROP_INLINE);
        }
        if (props.hasBackdrop && props.interactionKind !== PopoverInteractionKind.CLICK) {
            console.error(POPOVER_HAS_BACKDROP_INTERACTION);
        }
        if (props.placement !== undefined && props.position !== undefined) {
            console.warn(POPOVER_WARN_PLACEMENT_AND_POSITION_MUTEX);
        }
        var childrenCount = react.Children.count(props.children);
        var hasContentProp = props.content !== undefined;
        var hasTargetProp = props.target !== undefined;
        if (childrenCount === 0 && !hasTargetProp) {
            console.error(POPOVER_REQUIRES_TARGET);
        }
        if (childrenCount > 2) {
            console.warn(POPOVER_WARN_TOO_MANY_CHILDREN);
        }
        if (childrenCount > 0 && hasTargetProp) {
            console.warn(POPOVER_WARN_DOUBLE_TARGET);
        }
        if (childrenCount === 2 && hasContentProp) {
            console.warn(POPOVER_WARN_DOUBLE_CONTENT);
        }
    };
    Popover.prototype.updateDarkParent = function () {
        if (this.props.usePortal && this.state.isOpen) {
            var hasDarkParent = this.targetElement != null && this.targetElement.closest("." + DARK) != null;
            this.setState({ hasDarkParent: hasDarkParent });
        }
    };
    // content and target can be specified as props or as children. this method
    // normalizes the two approaches, preferring child over prop.
    Popover.prototype.understandChildren = function () {
        var _a = this.props, children = _a.children, contentProp = _a.content, targetProp = _a.target;
        // #validateProps asserts that 1 <= children.length <= 2 so content is optional
        var _b = react.Children.toArray(children), targetChild = _b[0], contentChild = _b[1];
        return {
            content: contentChild == null ? contentProp : contentChild,
            target: targetChild == null ? targetProp : targetChild,
        };
    };
    Popover.prototype.getIsOpen = function (props) {
        // disabled popovers should never be allowed to open.
        if (props.disabled) {
            return false;
        }
        else if (props.isOpen != null) {
            return props.isOpen;
        }
        else {
            return props.defaultIsOpen;
        }
    };
    Popover.prototype.getPopperModifiers = function () {
        var _a = this.props, boundary = _a.boundary, modifiers = _a.modifiers;
        var _b = modifiers, _c = _b.flip, flip = _c === void 0 ? {} : _c, _d = _b.preventOverflow, preventOverflow = _d === void 0 ? {} : _d;
        return __assign(__assign({}, modifiers), { arrowOffset: {
                enabled: this.isArrowEnabled(),
                fn: arrowOffsetModifier,
                order: 510,
            }, flip: __assign({ boundariesElement: boundary }, flip), preventOverflow: __assign({ boundariesElement: boundary }, preventOverflow), updatePopoverState: {
                enabled: true,
                fn: this.updatePopoverState,
                order: 900,
            } });
    };
    // a wrapper around setState({isOpen}) that will call props.onInteraction instead when in controlled mode.
    // starts a timeout to delay changing the state if a non-zero duration is provided.
    Popover.prototype.setOpenState = function (isOpen, e, timeout) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        // cancel any existing timeout because we have new state
        (_a = this.cancelOpenTimeout) === null || _a === void 0 ? void 0 : _a.call(this);
        if (timeout !== undefined && timeout > 0) {
            this.cancelOpenTimeout = this.setTimeout(function () { return _this.setOpenState(isOpen, e); }, timeout);
        }
        else {
            if (this.props.isOpen == null) {
                this.setState({ isOpen: isOpen });
            }
            else {
                (_c = (_b = this.props).onInteraction) === null || _c === void 0 ? void 0 : _c.call(_b, isOpen, e);
            }
            if (!isOpen) {
                // non-null assertion because the only time `e` is undefined is when in controlled mode
                // or the rare special case in uncontrolled mode when the `disabled` flag is toggled true
                (_e = (_d = this.props).onClose) === null || _e === void 0 ? void 0 : _e.call(_d, e);
            }
        }
    };
    Popover.prototype.isArrowEnabled = function () {
        var _a = this.props, minimal = _a.minimal, modifiers = _a.modifiers;
        // omitting `arrow` from `modifiers` uses Popper default, which does show an arrow.
        return !minimal && ((modifiers === null || modifiers === void 0 ? void 0 : modifiers.arrow) == null || modifiers.arrow.enabled);
    };
    Popover.prototype.isElementInPopover = function (element) {
        var _a;
        return (_a = this.popoverElement) === null || _a === void 0 ? void 0 : _a.contains(element);
    };
    Popover.prototype.isHoverInteractionKind = function () {
        return (this.props.interactionKind === PopoverInteractionKind.HOVER ||
            this.props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY);
    };
    Popover.displayName = DISPLAYNAME_PREFIX + ".Popover";
    Popover.defaultProps = {
        boundary: "scrollParent",
        captureDismiss: false,
        defaultIsOpen: false,
        disabled: false,
        fill: false,
        hasBackdrop: false,
        hoverCloseDelay: 300,
        hoverOpenDelay: 150,
        inheritDarkTheme: true,
        interactionKind: PopoverInteractionKind.CLICK,
        minimal: false,
        modifiers: {},
        openOnTargetFocus: true,
        shouldReturnFocusOnClose: false,
        // N.B. we don't set a default for `placement` or `position` here because that would trigger
        // a warning in validateProps if the other prop is specified by a user of this component
        targetTagName: "span",
        transitionDuration: 300,
        usePortal: true,
        wrapperTagName: "span",
    };
    return Popover;
}(AbstractPureComponent2));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign$1 = function() {
    __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};

/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
/**
 * Lower case as a function.
 */
function lowerCase(str) {
    return str.toLowerCase();
}

// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
var DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
// Remove all non-word characters.
var DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
/**
 * Normalize the string into something other libraries can manipulate easier.
 */
function noCase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitRegexp, splitRegexp = _a === void 0 ? DEFAULT_SPLIT_REGEXP : _a, _b = options.stripRegexp, stripRegexp = _b === void 0 ? DEFAULT_STRIP_REGEXP : _b, _c = options.transform, transform = _c === void 0 ? lowerCase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
    var start = 0;
    var end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === "\0")
        start++;
    while (result.charAt(end - 1) === "\0")
        end--;
    // Transform each token independently.
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof RegExp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}

function pascalCaseTransform(input, index) {
    var firstChar = input.charAt(0);
    var lowerChars = input.substr(1).toLowerCase();
    if (index > 0 && firstChar >= "0" && firstChar <= "9") {
        return "_" + firstChar + lowerChars;
    }
    return "" + firstChar.toUpperCase() + lowerChars;
}
function pascalCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, __assign$1({ delimiter: "", transform: pascalCaseTransform }, options));
}

/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
var IconSvgPaths16 = require("./generated/16px/paths");
var IconSvgPaths20 = require("./generated/20px/paths");
/* eslint-enable @typescript-eslint/no-var-requires */
/**
 * Type safe string literal conversion of snake-case icon names to PascalCase icon names,
 * useful for indexing into the SVG paths record to extract a single icon's SVG path definition.
 */
function iconNameToPathsRecordKey(name) {
    return pascalCase(name);
}

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var IconSize;
(function (IconSize) {
    IconSize[IconSize["STANDARD"] = 16] = "STANDARD";
    IconSize[IconSize["LARGE"] = 20] = "LARGE";
})(IconSize || (IconSize = {}));
var Icon = /** @class */ (function (_super) {
    __extends(Icon, _super);
    function Icon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Icon.prototype.render = function () {
        var icon = this.props.icon;
        if (icon == null || typeof icon === "boolean") {
            return null;
        }
        else if (typeof icon !== "string") {
            return icon;
        }
        var _a = this.props, className = _a.className, color = _a.color, htmlTitle = _a.htmlTitle, 
        // eslint-disable-next-line deprecation/deprecation
        iconSize = _a.iconSize, intent = _a.intent, _b = _a.size, size = _b === void 0 ? iconSize !== null && iconSize !== void 0 ? iconSize : IconSize.STANDARD : _b, title = _a.title, _c = _a.tagName, tagName = _c === void 0 ? "span" : _c, htmlprops = __rest(_a, ["className", "color", "htmlTitle", "iconSize", "intent", "size", "title", "tagName"]);
        // choose which pixel grid is most appropriate for given icon size
        var pixelGridSize = size >= IconSize.LARGE ? IconSize.LARGE : IconSize.STANDARD;
        // render path elements, or nothing if icon name is unknown.
        var paths = this.renderSvgPaths(pixelGridSize, icon);
        var classes = classnames(ICON, iconClass(icon), intentClass(intent), className);
        var viewBox = "0 0 " + pixelGridSize + " " + pixelGridSize;
        return react.createElement(tagName, __assign(__assign({}, htmlprops), { "aria-hidden": title ? undefined : true, className: classes, title: htmlTitle }), react.createElement("svg", { fill: color, "data-icon": icon, width: size, height: size, viewBox: viewBox },
            title && react.createElement("desc", null, title),
            paths));
    };
    /** Render `<path>` elements for the given icon name. Returns `null` if name is unknown. */
    Icon.prototype.renderSvgPaths = function (pathsSize, iconName) {
        var svgPathsRecord = pathsSize === IconSize.STANDARD ? IconSvgPaths16 : IconSvgPaths20;
        var paths = svgPathsRecord[iconNameToPathsRecordKey(iconName)];
        if (paths == null) {
            return null;
        }
        return paths.map(function (path, i) { return react.createElement("path", { key: i, d: path, fillRule: "evenodd" }); });
    };
    Icon.displayName = DISPLAYNAME_PREFIX + ".Icon";
    return Icon;
}(AbstractPureComponent2));

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var SpinnerSize;
(function (SpinnerSize) {
    SpinnerSize[SpinnerSize["SMALL"] = 20] = "SMALL";
    SpinnerSize[SpinnerSize["STANDARD"] = 50] = "STANDARD";
    SpinnerSize[SpinnerSize["LARGE"] = 100] = "LARGE";
})(SpinnerSize || (SpinnerSize = {}));
// see http://stackoverflow.com/a/18473154/3124288 for calculating arc path
var R = 45;
var SPINNER_TRACK$1 = "M 50,50 m 0,-" + R + " a " + R + "," + R + " 0 1 1 0," + R * 2 + " a " + R + "," + R + " 0 1 1 0,-" + R * 2;
// unitless total length of SVG path, to which stroke-dash* properties are relative.
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pathLength
// this value is the result of `<path d={SPINNER_TRACK} />.getTotalLength()` and works in all browsers:
var PATH_LENGTH = 280;
var MIN_SIZE = 10;
var STROKE_WIDTH = 4;
var MIN_STROKE_WIDTH = 16;
var Spinner = /** @class */ (function (_super) {
    __extends(Spinner, _super);
    function Spinner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Spinner.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.value !== this.props.value) {
            // IE/Edge: re-render after changing value to force SVG update
            this.forceUpdate();
        }
    };
    Spinner.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, intent = _b.intent, value = _b.value, _c = _b.tagName, tagName = _c === void 0 ? "div" : _c;
        var size = this.getSize();
        var classes = classnames(SPINNER, intentClass(intent), (_a = {}, _a[SPINNER_NO_SPIN] = value != null, _a), className);
        // keep spinner track width consistent at all sizes (down to about 10px).
        var strokeWidth = Math.min(MIN_STROKE_WIDTH, (STROKE_WIDTH * SpinnerSize.LARGE) / size);
        var strokeOffset = PATH_LENGTH - PATH_LENGTH * (value == null ? 0.25 : clamp(value, 0, 1));
        // multiple DOM elements around SVG are necessary to properly isolate animation:
        // - SVG elements in IE do not support anim/trans so they must be set on a parent HTML element.
        // - SPINNER_ANIMATION isolates svg from parent display and is always centered inside root element.
        return react.createElement(tagName, {
            className: classes,
            role: "progressbar",
        }, react.createElement(tagName, { className: SPINNER_ANIMATION }, react.createElement("svg", { width: size, height: size, strokeWidth: strokeWidth.toFixed(2), viewBox: this.getViewBox(strokeWidth) },
            react.createElement("path", { className: SPINNER_TRACK, d: SPINNER_TRACK$1 }),
            react.createElement("path", { className: SPINNER_HEAD, d: SPINNER_TRACK$1, pathLength: PATH_LENGTH, strokeDasharray: PATH_LENGTH + " " + PATH_LENGTH, strokeDashoffset: strokeOffset }))));
    };
    Spinner.prototype.validateProps = function (_a) {
        var _b = _a.className, className = _b === void 0 ? "" : _b, size = _a.size;
        if (size != null && (className.indexOf(SMALL) >= 0 || className.indexOf(LARGE) >= 0)) {
            console.warn(SPINNER_WARN_CLASSES_SIZE);
        }
    };
    /**
     * Resolve size to a pixel value.
     * Size can be set by className, props, default, or minimum constant.
     */
    Spinner.prototype.getSize = function () {
        var _a = this.props, _b = _a.className, className = _b === void 0 ? "" : _b, size = _a.size;
        if (size == null) {
            // allow Classes constants to determine default size.
            if (className.indexOf(SMALL) >= 0) {
                return SpinnerSize.SMALL;
            }
            else if (className.indexOf(LARGE) >= 0) {
                return SpinnerSize.LARGE;
            }
            return SpinnerSize.STANDARD;
        }
        return Math.max(MIN_SIZE, size);
    };
    /** Compute viewbox such that stroked track sits exactly at edge of image frame. */
    Spinner.prototype.getViewBox = function (strokeWidth) {
        var radius = R + strokeWidth / 2;
        var viewBoxX = (50 - radius).toFixed(2);
        var viewBoxWidth = (radius * 2).toFixed(2);
        return viewBoxX + " " + viewBoxX + " " + viewBoxWidth + " " + viewBoxWidth;
    };
    Spinner.displayName = DISPLAYNAME_PREFIX + ".Spinner";
    return Spinner;
}(AbstractPureComponent2));

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var AbstractButton = /** @class */ (function (_super) {
    __extends(AbstractButton, _super);
    function AbstractButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isActive: false,
        };
        // we're casting as `any` to get around a somewhat opaque safeInvoke error
        // that "Type argument candidate 'KeyboardEvent<T>' is not a valid type
        // argument because it is not a supertype of candidate
        // 'KeyboardEvent<HTMLElement>'."
        _this.handleKeyDown = function (e) {
            var _a, _b;
            // HACKHACK: https://github.com/palantir/blueprint/issues/4165
            /* eslint-disable deprecation/deprecation */
            if (isKeyboardClick(e.which)) {
                e.preventDefault();
                if (e.which !== _this.currentKeyDown) {
                    _this.setState({ isActive: true });
                }
            }
            _this.currentKeyDown = e.which;
            (_b = (_a = _this.props).onKeyDown) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        };
        _this.handleKeyUp = function (e) {
            var _a, _b, _c;
            // HACKHACK: https://github.com/palantir/blueprint/issues/4165
            /* eslint-disable deprecation/deprecation */
            if (isKeyboardClick(e.which)) {
                _this.setState({ isActive: false });
                (_a = _this.buttonRef) === null || _a === void 0 ? void 0 : _a.click();
            }
            _this.currentKeyDown = undefined;
            (_c = (_b = _this.props).onKeyUp) === null || _c === void 0 ? void 0 : _c.call(_b, e);
        };
        _this.handleBlur = function (e) {
            var _a, _b;
            if (_this.state.isActive) {
                _this.setState({ isActive: false });
            }
            (_b = (_a = _this.props).onBlur) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        };
        return _this;
    }
    AbstractButton.prototype.getCommonButtonProps = function () {
        var _a;
        var _b = this.props, active = _b.active, alignText = _b.alignText, fill = _b.fill, large = _b.large, loading = _b.loading, outlined = _b.outlined, minimal = _b.minimal, small = _b.small, tabIndex = _b.tabIndex;
        var disabled = this.props.disabled || loading;
        var className = classnames(BUTTON, (_a = {},
            _a[ACTIVE] = !disabled && (active || this.state.isActive),
            _a[DISABLED] = disabled,
            _a[FILL] = fill,
            _a[LARGE] = large,
            _a[LOADING] = loading,
            _a[MINIMAL] = minimal,
            _a[OUTLINED] = outlined,
            _a[SMALL] = small,
            _a), alignmentClass(alignText), intentClass(this.props.intent), this.props.className);
        return {
            className: className,
            disabled: disabled,
            onBlur: this.handleBlur,
            onClick: disabled ? undefined : this.props.onClick,
            onKeyDown: this.handleKeyDown,
            onKeyUp: this.handleKeyUp,
            tabIndex: disabled ? -1 : tabIndex,
        };
    };
    AbstractButton.prototype.renderChildren = function () {
        var _a = this.props, children = _a.children, icon = _a.icon, loading = _a.loading, rightIcon = _a.rightIcon, text = _a.text;
        return [
            loading && react.createElement(Spinner, { key: "loading", className: BUTTON_SPINNER, size: IconSize.LARGE }),
            react.createElement(Icon, { key: "leftIcon", icon: icon }),
            (!isReactNodeEmpty(text) || !isReactNodeEmpty(children)) && (react.createElement("span", { key: "text", className: BUTTON_TEXT },
                text,
                children)),
            react.createElement(Icon, { key: "rightIcon", icon: rightIcon }),
        ];
    };
    return AbstractButton;
}(AbstractPureComponent2));

/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // need to keep this ref so that we can access it in AbstractButton#handleKeyUp
        _this.buttonRef = null;
        _this.handleRef = refHandler(_this, "buttonRef", _this.props.elementRef);
        return _this;
    }
    Button.prototype.render = function () {
        return (react.createElement("button", __assign({ type: "button", ref: this.handleRef }, removeNonHTMLProps(this.props), this.getCommonButtonProps()), this.renderChildren()));
    };
    Button.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.elementRef !== this.props.elementRef) {
            setRef(prevProps.elementRef, null);
            this.handleRef = refHandler(this, "buttonRef", this.props.elementRef);
            setRef(this.props.elementRef, this.buttonRef);
        }
    };
    Button.displayName = DISPLAYNAME_PREFIX + ".Button";
    return Button;
}(AbstractButton));
var AnchorButton = /** @class */ (function (_super) {
    __extends(AnchorButton, _super);
    function AnchorButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // need to keep this ref so that we can access it in AbstractButton#handleKeyUp
        _this.buttonRef = null;
        _this.handleRef = refHandler(_this, "buttonRef", _this.props.elementRef);
        return _this;
    }
    AnchorButton.prototype.render = function () {
        var _a = this.props, href = _a.href, _b = _a.tabIndex, tabIndex = _b === void 0 ? 0 : _b;
        var commonProps = this.getCommonButtonProps();
        return (react.createElement("a", __assign({ role: "button", ref: this.handleRef }, removeNonHTMLProps(this.props), commonProps, { href: commonProps.disabled ? undefined : href, tabIndex: commonProps.disabled ? -1 : tabIndex }), this.renderChildren()));
    };
    AnchorButton.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.elementRef !== this.props.elementRef) {
            setRef(prevProps.elementRef, null);
            this.handleRef = refHandler(this, "buttonRef", this.props.elementRef);
            setRef(this.props.elementRef, this.buttonRef);
        }
    };
    AnchorButton.displayName = DISPLAYNAME_PREFIX + ".AnchorButton";
    return AnchorButton;
}(AbstractButton));

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Menu.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, children = _b.children, large = _b.large, ulRef = _b.ulRef, htmlProps = __rest(_b, ["className", "children", "large", "ulRef"]);
        var classes = classnames(MENU, (_a = {}, _a[LARGE] = large, _a), className);
        return (react.createElement("ul", __assign({}, htmlProps, { className: classes, ref: ulRef }), children));
    };
    Menu.displayName = DISPLAYNAME_PREFIX + ".Menu";
    return Menu;
}(AbstractPureComponent2));

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isContentOverflowing: false,
            textContent: "",
        };
        _this.textRef = null;
        return _this;
    }
    Text.prototype.componentDidMount = function () {
        this.update();
    };
    Text.prototype.componentDidUpdate = function () {
        this.update();
    };
    Text.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, children = _b.children, className = _b.className, ellipsize = _b.ellipsize, _c = _b.tagName, tagName = _c === void 0 ? "div" : _c, title = _b.title, htmlProps = __rest(_b, ["children", "className", "ellipsize", "tagName", "title"]);
        var classes = classnames(className, (_a = {},
            _a[TEXT_OVERFLOW_ELLIPSIS] = ellipsize,
            _a));
        return react.createElement(tagName, __assign(__assign({}, htmlProps), { className: classes, ref: function (ref) { return (_this.textRef = ref); }, title: title !== null && title !== void 0 ? title : (this.state.isContentOverflowing ? this.state.textContent : undefined) }), children);
    };
    Text.prototype.update = function () {
        var _a;
        if (((_a = this.textRef) === null || _a === void 0 ? void 0 : _a.textContent) == null) {
            return;
        }
        var newState = {
            isContentOverflowing: this.props.ellipsize && this.textRef.scrollWidth > this.textRef.clientWidth,
            textContent: this.textRef.textContent,
        };
        this.setState(newState);
    };
    Text.displayName = DISPLAYNAME_PREFIX + ".Text";
    Text.defaultProps = {
        ellipsize: false,
    };
    return Text;
}(AbstractPureComponent2));

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var MenuItem = /** @class */ (function (_super) {
    __extends(MenuItem, _super);
    function MenuItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuItem.prototype.render = function () {
        var _a, _b;
        var _c = this.props, 
        // eslint-disable-next-line deprecation/deprecation
        active = _c.active, className = _c.className, children = _c.children, disabled = _c.disabled, icon = _c.icon, intent = _c.intent, labelClassName = _c.labelClassName, labelElement = _c.labelElement, multiline = _c.multiline, popoverProps = _c.popoverProps, selected = _c.selected, shouldDismissPopover = _c.shouldDismissPopover, text = _c.text, textClassName = _c.textClassName, _d = _c.tagName, tagName = _d === void 0 ? "a" : _d, htmlTitle = _c.htmlTitle, htmlProps = __rest(_c, ["active", "className", "children", "disabled", "icon", "intent", "labelClassName", "labelElement", "multiline", "popoverProps", "selected", "shouldDismissPopover", "text", "textClassName", "tagName", "htmlTitle"]);
        var hasIcon = icon != null;
        var hasSubmenu = children != null;
        var intentClass$1 = intentClass(intent);
        var anchorClasses = classnames(MENU_ITEM, intentClass$1, (_a = {},
            _a[ACTIVE] = active,
            _a[DISABLED] = disabled,
            // prevent popover from closing when clicking on submenu trigger or disabled item
            _a[POPOVER_DISMISS] = shouldDismissPopover && !disabled && !hasSubmenu,
            _a[SELECTED] = selected || (active && intentClass$1 === undefined),
            _a), className);
        var target = react.createElement(tagName, __assign(__assign(__assign({ tabIndex: 0 }, htmlProps), (disabled ? DISABLED_PROPS : {})), { className: anchorClasses }), hasIcon ? (
        // wrap icon in a <span> in case `icon` is a custom element rather than a built-in icon identifier,
        // so that we always render this class
        react.createElement("span", { className: MENU_ITEM_ICON },
            react.createElement(Icon, { icon: icon }))) : undefined, react.createElement(Text, { className: classnames(FILL, textClassName), ellipsize: !multiline, title: htmlTitle }, text), this.maybeRenderLabel(labelElement), hasSubmenu ? (react.createElement(Icon, { className: MENU_SUBMENU_ICON, title: "Open sub menu", icon: "caret-right" })) : undefined);
        var liClasses = classnames((_b = {}, _b[MENU_SUBMENU] = hasSubmenu, _b));
        return react.createElement("li", { className: liClasses }, this.maybeRenderPopover(target, children));
    };
    MenuItem.prototype.maybeRenderLabel = function (labelElement) {
        var _a = this.props, label = _a.label, labelClassName = _a.labelClassName;
        if (label == null && labelElement == null) {
            return null;
        }
        return (react.createElement("span", { className: classnames(MENU_ITEM_LABEL, labelClassName) },
            label,
            labelElement));
    };
    MenuItem.prototype.maybeRenderPopover = function (target, children) {
        if (children == null) {
            return target;
        }
        var _a = this.props, disabled = _a.disabled, popoverProps = _a.popoverProps;
        return (
        /* eslint-disable-next-line deprecation/deprecation */
        react.createElement(Popover, __assign({ autoFocus: false, captureDismiss: false, disabled: disabled, enforceFocus: false, hoverCloseDelay: 0, interactionKind: PopoverInteractionKind.HOVER, modifiers: SUBMENU_POPOVER_MODIFIERS, position: Position.RIGHT_TOP, usePortal: false }, popoverProps, { content: react.createElement(Menu, null, children), minimal: true, popoverClassName: classnames(MENU_SUBMENU, popoverProps === null || popoverProps === void 0 ? void 0 : popoverProps.popoverClassName), target: target })));
    };
    MenuItem.defaultProps = {
        active: false,
        disabled: false,
        multiline: false,
        popoverProps: {},
        selected: false,
        shouldDismissPopover: true,
        text: "",
    };
    MenuItem.displayName = DISPLAYNAME_PREFIX + ".MenuItem";
    return MenuItem;
}(AbstractPureComponent2));
var SUBMENU_POPOVER_MODIFIERS = {
    // 20px padding - scrollbar width + a bit
    flip: { boundariesElement: "viewport", padding: 20 },
    // shift popover up 5px so MenuItems align
    offset: { offset: -5 },
    preventOverflow: { boundariesElement: "viewport", padding: 20 },
};
// props to ignore when disabled
var DISABLED_PROPS = {
    href: undefined,
    onClick: undefined,
    onMouseDown: undefined,
    onMouseEnter: undefined,
    onMouseLeave: undefined,
    tabIndex: -1,
};

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var Divider = /** @class */ (function (_super) {
    __extends(Divider, _super);
    function Divider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Divider.prototype.render = function () {
        var _a = this.props, className = _a.className, _b = _a.tagName, tagName = _b === void 0 ? "div" : _b, htmlProps = __rest(_a, ["className", "tagName"]);
        var classes = classnames(DIVIDER, className);
        return react.createElement(tagName, __assign(__assign({}, htmlProps), { className: classes }));
    };
    Divider.displayName = DISPLAYNAME_PREFIX + ".Divider";
    return Divider;
}(AbstractPureComponent2));

/* !
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A stateful wrapper around the low-level <input> component which works around a
 * [React bug](https://github.com/facebook/react/issues/3926). This bug is reproduced when an input
 * receives CompositionEvents (for example, through IME composition) and has its value prop updated
 * asychronously. This might happen if a component chooses to do async validation of a value
 * returned by the input's `onChange` callback.
 *
 * Note: this component does not apply any Blueprint-specific styling.
 */
var AsyncControllableInput = /** @class */ (function (_super) {
    __extends(AsyncControllableInput, _super);
    function AsyncControllableInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hasPendingUpdate: false,
            isComposing: false,
            nextValue: _this.props.value,
            value: _this.props.value,
        };
        _this.handleCompositionStart = function (e) {
            var _a, _b;
            _this.setState({
                isComposing: true,
                // Make sure that localValue matches externalValue, in case externalValue
                // has changed since the last onChange event.
                nextValue: _this.state.value,
            });
            (_b = (_a = _this.props).onCompositionStart) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        };
        _this.handleCompositionEnd = function (e) {
            var _a, _b;
            _this.setState({ isComposing: false });
            (_b = (_a = _this.props).onCompositionEnd) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        };
        _this.handleChange = function (e) {
            var _a, _b;
            var value = e.target.value;
            _this.setState({ nextValue: value });
            (_b = (_a = _this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        };
        return _this;
    }
    AsyncControllableInput.getDerivedStateFromProps = function (nextProps, nextState) {
        if (nextState.isComposing || nextProps.value === undefined) {
            // don't derive anything from props if:
            // - in uncontrolled mode, OR
            // - currently composing, since we'll do that after composition ends
            return null;
        }
        var userTriggeredUpdate = nextState.nextValue !== nextState.value;
        if (userTriggeredUpdate) {
            if (nextProps.value === nextState.nextValue) {
                // parent has processed and accepted our update
                if (nextState.hasPendingUpdate) {
                    return { value: nextProps.value, hasPendingUpdate: false };
                }
                else {
                    return { value: nextState.nextValue };
                }
            }
            else {
                if (nextProps.value === nextState.value) {
                    // we have sent the update to our parent, but it has not been processed yet. just wait.
                    // DO NOT set nextValue here, since that will temporarily render a potentially stale controlled value,
                    // causing the cursor to jump once the new value is accepted
                    return { hasPendingUpdate: true };
                }
                // accept controlled update overriding user action
                return { value: nextProps.value, nextValue: nextProps.value, hasPendingUpdate: false };
            }
        }
        else {
            // accept controlled update, could be confirming or denying user action
            return { value: nextProps.value, nextValue: nextProps.value, hasPendingUpdate: false };
        }
    };
    AsyncControllableInput.prototype.render = function () {
        var _a = this.state, isComposing = _a.isComposing, hasPendingUpdate = _a.hasPendingUpdate, value = _a.value, nextValue = _a.nextValue;
        var _b = this.props, inputRef = _b.inputRef, restProps = __rest(_b, ["inputRef"]);
        return (react.createElement("input", __assign({}, restProps, { ref: inputRef, 
            // render the pending value even if it is not confirmed by a parent's async controlled update
            // so that the cursor does not jump to the end of input as reported in
            // https://github.com/palantir/blueprint/issues/4298
            value: isComposing || hasPendingUpdate ? nextValue : value, onCompositionStart: this.handleCompositionStart, onCompositionEnd: this.handleCompositionEnd, onChange: this.handleChange })));
    };
    AsyncControllableInput.displayName = DISPLAYNAME_PREFIX + ".AsyncControllableInput";
    return AsyncControllableInput;
}(react.PureComponent));

/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var InputGroup = /** @class */ (function (_super) {
    __extends(InputGroup, _super);
    function InputGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {};
        _this.leftElement = null;
        _this.rightElement = null;
        _this.refHandlers = {
            leftElement: function (ref) { return (_this.leftElement = ref); },
            rightElement: function (ref) { return (_this.rightElement = ref); },
        };
        return _this;
    }
    InputGroup.prototype.render = function () {
        var _a;
        var _b = this.props, _c = _b.asyncControl, asyncControl = _c === void 0 ? false : _c, className = _b.className, disabled = _b.disabled, fill = _b.fill, inputRef = _b.inputRef, intent = _b.intent, large = _b.large, small = _b.small, round = _b.round;
        var inputGroupClasses = classnames(INPUT_GROUP, intentClass(intent), (_a = {},
            _a[DISABLED] = disabled,
            _a[FILL] = fill,
            _a[LARGE] = large,
            _a[SMALL] = small,
            _a[ROUND] = round,
            _a), className);
        var style = __assign(__assign({}, this.props.style), { paddingLeft: this.state.leftElementWidth, paddingRight: this.state.rightElementWidth });
        var inputProps = __assign(__assign({ type: "text" }, removeNonHTMLProps(this.props)), { className: INPUT, style: style });
        return (react.createElement("div", { className: inputGroupClasses },
            this.maybeRenderLeftElement(),
            asyncControl ? (react.createElement(AsyncControllableInput, __assign({}, inputProps, { inputRef: inputRef }))) : (react.createElement("input", __assign({}, inputProps, { ref: inputRef }))),
            this.maybeRenderRightElement()));
    };
    InputGroup.prototype.componentDidMount = function () {
        this.updateInputWidth();
    };
    InputGroup.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, leftElement = _a.leftElement, rightElement = _a.rightElement;
        if (prevProps.leftElement !== leftElement || prevProps.rightElement !== rightElement) {
            this.updateInputWidth();
        }
    };
    InputGroup.prototype.validateProps = function (props) {
        if (props.leftElement != null && props.leftIcon != null) {
            console.warn(INPUT_WARN_LEFT_ELEMENT_LEFT_ICON_MUTEX);
        }
    };
    InputGroup.prototype.maybeRenderLeftElement = function () {
        var _a = this.props, leftElement = _a.leftElement, leftIcon = _a.leftIcon;
        if (leftElement != null) {
            return (react.createElement("span", { className: INPUT_LEFT_CONTAINER, ref: this.refHandlers.leftElement }, leftElement));
        }
        else if (leftIcon != null) {
            return react.createElement(Icon, { icon: leftIcon });
        }
        return undefined;
    };
    InputGroup.prototype.maybeRenderRightElement = function () {
        var rightElement = this.props.rightElement;
        if (rightElement == null) {
            return undefined;
        }
        return (react.createElement("span", { className: INPUT_ACTION, ref: this.refHandlers.rightElement }, rightElement));
    };
    InputGroup.prototype.updateInputWidth = function () {
        var _a = this.state, leftElementWidth = _a.leftElementWidth, rightElementWidth = _a.rightElementWidth;
        if (this.leftElement != null) {
            var clientWidth = this.leftElement.clientWidth;
            // small threshold to prevent infinite loops
            if (leftElementWidth === undefined || Math.abs(clientWidth - leftElementWidth) > 2) {
                this.setState({ leftElementWidth: clientWidth });
            }
        }
        else {
            this.setState({ leftElementWidth: undefined });
        }
        if (this.rightElement != null) {
            var clientWidth = this.rightElement.clientWidth;
            // small threshold to prevent infinite loops
            if (rightElementWidth === undefined || Math.abs(clientWidth - rightElementWidth) > 2) {
                this.setState({ rightElementWidth: clientWidth });
            }
        }
        else {
            this.setState({ rightElementWidth: undefined });
        }
    };
    InputGroup.displayName = DISPLAYNAME_PREFIX + ".InputGroup";
    return InputGroup;
}(AbstractPureComponent2));

/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var HTMLSelect = /** @class */ (function (_super) {
    __extends(HTMLSelect, _super);
    function HTMLSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLSelect.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, disabled = _b.disabled, elementRef = _b.elementRef, fill = _b.fill, iconProps = _b.iconProps, large = _b.large, minimal = _b.minimal, _c = _b.options, options = _c === void 0 ? [] : _c, htmlProps = __rest(_b, ["className", "disabled", "elementRef", "fill", "iconProps", "large", "minimal", "options"]);
        var classes = classnames(HTML_SELECT, (_a = {},
            _a[DISABLED] = disabled,
            _a[FILL] = fill,
            _a[LARGE] = large,
            _a[MINIMAL] = minimal,
            _a), className);
        var optionChildren = options.map(function (option) {
            var props = typeof option === "object" ? option : { value: option };
            return react.createElement("option", __assign({}, props, { key: props.value, children: props.label || props.value }));
        });
        return (react.createElement("div", { className: classes },
            react.createElement("select", __assign({ disabled: disabled, ref: elementRef }, htmlProps, { multiple: false }),
                optionChildren,
                htmlProps.children),
            react.createElement(Icon, __assign({ icon: "double-caret-vertical", title: "Open dropdown" }, iconProps))));
    };
    return HTMLSelect;
}(AbstractPureComponent2));

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var NS$1 = getClassNamespace();
var DATEINPUT = NS$1 + "-dateinput";
var DATEINPUT_POPOVER = DATEINPUT + "-popover";
var DATEPICKER = NS$1 + "-datepicker";
var DATEPICKER_CAPTION = DATEPICKER + "-caption";
var DATEPICKER_CAPTION_MEASURE = DATEPICKER_CAPTION + "-measure";
var DATEPICKER_DAY_WRAPPER = DATEPICKER + "-day-wrapper";
var DATEPICKER_FOOTER = DATEPICKER + "-footer";
var DATEPICKER_MONTH_SELECT = DATEPICKER + "-month-select";
var DATEPICKER_YEAR_SELECT = DATEPICKER + "-year-select";
var DATEPICKER_NAVBAR = DATEPICKER + "-navbar";
var DATEPICKER_TIMEPICKER_WRAPPER = DATEPICKER + "-timepicker-wrapper";
var DATERANGEPICKER = NS$1 + "-daterangepicker";
var DATERANGEPICKER_SHORTCUTS = DATERANGEPICKER + "-shortcuts";
var TIMEPICKER = NS$1 + "-timepicker";
var TIMEPICKER_ARROW_BUTTON = TIMEPICKER + "-arrow-button";
var TIMEPICKER_ARROW_ROW = TIMEPICKER + "-arrow-row";
var TIMEPICKER_DIVIDER_TEXT = TIMEPICKER + "-divider-text";
var TIMEPICKER_HOUR = TIMEPICKER + "-hour";
var TIMEPICKER_INPUT = TIMEPICKER + "-input";
var TIMEPICKER_INPUT_ROW = TIMEPICKER + "-input-row";
var TIMEPICKER_MILLISECOND = TIMEPICKER + "-millisecond";
var TIMEPICKER_MINUTE = TIMEPICKER + "-minute";
var TIMEPICKER_SECOND = TIMEPICKER + "-second";
var TIMEPICKER_AMPM_SELECT = TIMEPICKER + "-ampm-select";

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Enumeration of calendar months.
 *
 * Note that the enum values are numbers (with January as `0`) so they can be
 * easily compared to `date.getMonth()`.
 */
var Months;
(function (Months) {
    Months[Months["JANUARY"] = 0] = "JANUARY";
    Months[Months["FEBRUARY"] = 1] = "FEBRUARY";
    Months[Months["MARCH"] = 2] = "MARCH";
    Months[Months["APRIL"] = 3] = "APRIL";
    Months[Months["MAY"] = 4] = "MAY";
    Months[Months["JUNE"] = 5] = "JUNE";
    Months[Months["JULY"] = 6] = "JULY";
    Months[Months["AUGUST"] = 7] = "AUGUST";
    Months[Months["SEPTEMBER"] = 8] = "SEPTEMBER";
    Months[Months["OCTOBER"] = 9] = "OCTOBER";
    Months[Months["NOVEMBER"] = 10] = "NOVEMBER";
    Months[Months["DECEMBER"] = 11] = "DECEMBER";
})(Months || (Months = {}));

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function isDateValid(date) {
    return date instanceof Date && !isNaN(date.valueOf());
}
function areSameDay(date1, date2) {
    return areSameMonth(date1, date2) && date1.getDate() === date2.getDate();
}
function areSameMonth(date1, date2) {
    return (date1 != null &&
        date2 != null &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear());
}
function areSameTime(date1, date2) {
    return (date1 != null &&
        date2 != null &&
        date1.getHours() === date2.getHours() &&
        date1.getMinutes() === date2.getMinutes() &&
        date1.getSeconds() === date2.getSeconds() &&
        date1.getMilliseconds() === date2.getMilliseconds());
}
function clone(d) {
    return new Date(d.getTime());
}
function isDayInRange(date, dateRange, exclusive) {
    if (exclusive === void 0) { exclusive = false; }
    if (date == null) {
        return false;
    }
    var day = clone(date);
    var start = clone(dateRange[0]);
    var end = clone(dateRange[1]);
    day.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return start <= day && day <= end && (!exclusive || (!areSameDay(start, day) && !areSameDay(day, end)));
}
function isDayRangeInRange(innerRange, outerRange) {
    return ((innerRange[0] == null || isDayInRange(innerRange[0], outerRange)) &&
        (innerRange[1] == null || isDayInRange(innerRange[1], outerRange)));
}
function isMonthInRange(date, dateRange) {
    if (date == null) {
        return false;
    }
    var day = clone(date);
    var start = clone(dateRange[0]);
    var end = clone(dateRange[1]);
    day.setDate(1);
    start.setDate(1);
    end.setDate(1);
    day.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return start <= day && day <= end;
}
var isTimeEqualOrGreaterThan = function (time, timeToCompare) { return time.getTime() >= timeToCompare.getTime(); };
var isTimeEqualOrSmallerThan = function (time, timeToCompare) { return time.getTime() <= timeToCompare.getTime(); };
function isTimeInRange(date, minDate, maxDate) {
    var time = getDateOnlyWithTime(date);
    var minTime = getDateOnlyWithTime(minDate);
    var maxTime = getDateOnlyWithTime(maxDate);
    var isTimeGreaterThanMinTime = isTimeEqualOrGreaterThan(time, minTime);
    var isTimeSmallerThanMaxTime = isTimeEqualOrSmallerThan(time, maxTime);
    if (isTimeEqualOrSmallerThan(maxTime, minTime)) {
        return isTimeGreaterThanMinTime || isTimeSmallerThanMaxTime;
    }
    return isTimeGreaterThanMinTime && isTimeSmallerThanMaxTime;
}
function getTimeInRange(time, minTime, maxTime) {
    if (areSameTime(minTime, maxTime)) {
        return maxTime;
    }
    else if (isTimeInRange(time, minTime, maxTime)) {
        return time;
    }
    else if (isTimeSameOrAfter(time, maxTime)) {
        return maxTime;
    }
    return minTime;
}
/**
 * Returns true if the time part of `date` is later than or equal to the time
 * part of `dateToCompare`. The day, month, and year parts will not be compared.
 */
function isTimeSameOrAfter(date, dateToCompare) {
    var time = getDateOnlyWithTime(date);
    var timeToCompare = getDateOnlyWithTime(dateToCompare);
    return isTimeEqualOrGreaterThan(time, timeToCompare);
}
/**
 * @returns a Date at the exact time-wise midpoint between startDate and endDate
 */
function getDateBetween(dateRange) {
    var start = dateRange[0].getTime();
    var end = dateRange[1].getTime();
    var middle = start + (end - start) * 0.5;
    return new Date(middle);
}
function getDateTime(date, time) {
    if (date == null) {
        return null;
    }
    else if (time == null) {
        // cannot use default argument because `null` is a common value in this package.
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    }
    else {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
    }
}
function getDateOnlyWithTime(date) {
    return new Date(0, 0, 0, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}
function convert24HourMeridiem(hour, toPm) {
    if (hour < 0 || hour > 23) {
        throw new Error("hour must be between [0,23] inclusive: got " + hour);
    }
    return toPm ? (hour % 12) + 12 : hour % 12;
}
function getIsPmFrom24Hour(hour) {
    if (hour < 0 || hour > 23) {
        throw new Error("hour must be between [0,23] inclusive: got " + hour);
    }
    return hour >= 12;
}
function get12HourFrom24Hour(hour) {
    if (hour < 0 || hour > 23) {
        throw new Error("hour must be between [0,23] inclusive: got " + hour);
    }
    var newHour = hour % 12;
    return newHour === 0 ? 12 : newHour;
}
function get24HourFrom12Hour(hour, isPm) {
    if (hour < 1 || hour > 12) {
        throw new Error("hour must be between [1,12] inclusive: got " + hour);
    }
    var newHour = hour === 12 ? 0 : hour;
    return isPm ? newHour + 12 : newHour;
}
function isToday(date) {
    return areSameDay(date, new Date());
}

/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _a$1;
/** describes a component of time. `H:MM:SS.MS` */
var TimeUnit;
(function (TimeUnit) {
    // NOTE: string enum so we can use it in Record<> type at the end of this file, which requires string keys
    TimeUnit["HOUR_24"] = "hour24";
    TimeUnit["HOUR_12"] = "hour12";
    TimeUnit["MINUTE"] = "minute";
    TimeUnit["SECOND"] = "second";
    TimeUnit["MS"] = "ms";
})(TimeUnit || (TimeUnit = {}));
/** Returns the given time unit component of the date. */
function getTimeUnit(unit, date) {
    switch (unit) {
        case TimeUnit.HOUR_24:
            return date.getHours();
        case TimeUnit.HOUR_12:
            return get12HourFrom24Hour(date.getHours());
        case TimeUnit.MINUTE:
            return date.getMinutes();
        case TimeUnit.SECOND:
            return date.getSeconds();
        case TimeUnit.MS:
            return date.getMilliseconds();
        default:
            throw Error("Invalid TimeUnit");
    }
}
/** Sets the given time unit to the given time in date object. Modifies given `date` object and returns it. */
function setTimeUnit(unit, time, date, isPm) {
    switch (unit) {
        case TimeUnit.HOUR_24:
            date.setHours(time);
            break;
        case TimeUnit.HOUR_12:
            date.setHours(get24HourFrom12Hour(time, isPm));
            break;
        case TimeUnit.MINUTE:
            date.setMinutes(time);
            break;
        case TimeUnit.SECOND:
            date.setSeconds(time);
            break;
        case TimeUnit.MS:
            date.setMilliseconds(time);
            break;
        default:
            throw Error("Invalid TimeUnit");
    }
    return date;
}
/** Returns true if `time` is a valid value */
function isTimeUnitValid(unit, time) {
    return time != null && !isNaN(time) && getTimeUnitMin(unit) <= time && time <= getTimeUnitMax(unit);
}
/** If unit of time is greater than max, returns min. If less than min, returns max. Otherwise, returns time. */
function wrapTimeAtUnit(unit, time) {
    var max = getTimeUnitMax(unit);
    var min = getTimeUnitMin(unit);
    if (time > max) {
        return min;
    }
    else if (time < min) {
        return max;
    }
    return time;
}
function getTimeUnitClassName(unit) {
    return TimeUnitMetadata[unit].className;
}
function getTimeUnitMax(unit) {
    return TimeUnitMetadata[unit].max;
}
function getTimeUnitMin(unit) {
    return TimeUnitMetadata[unit].min;
}
function getDefaultMinTime() {
    return new Date(0, 0, 0, DEFAULT_MIN_HOUR, DEFAULT_MIN_MINUTE, DEFAULT_MIN_SECOND, DEFAULT_MIN_MILLISECOND);
}
function getDefaultMaxTime() {
    return new Date(0, 0, 0, DEFAULT_MAX_HOUR, DEFAULT_MAX_MINUTE, DEFAULT_MAX_SECOND, DEFAULT_MAX_MILLISECOND);
}
var DEFAULT_MIN_HOUR = 0;
var MERIDIEM_MIN_HOUR = 1;
var DEFAULT_MIN_MINUTE = 0;
var DEFAULT_MIN_SECOND = 0;
var DEFAULT_MIN_MILLISECOND = 0;
var DEFAULT_MAX_HOUR = 23;
var MERIDIEM_MAX_HOUR = 12;
var DEFAULT_MAX_MINUTE = 59;
var DEFAULT_MAX_SECOND = 59;
var DEFAULT_MAX_MILLISECOND = 999;
/**
 * A datastore (internal to this file) mapping TimeUnits to useful information about them.
 * Use the `get*` methods above to access these fields.
 */
var TimeUnitMetadata = (_a$1 = {},
    _a$1[TimeUnit.HOUR_24] = {
        className: TIMEPICKER_HOUR,
        max: DEFAULT_MAX_HOUR,
        min: DEFAULT_MIN_HOUR,
    },
    _a$1[TimeUnit.HOUR_12] = {
        className: TIMEPICKER_HOUR,
        max: MERIDIEM_MAX_HOUR,
        min: MERIDIEM_MIN_HOUR,
    },
    _a$1[TimeUnit.MINUTE] = {
        className: TIMEPICKER_MINUTE,
        max: DEFAULT_MAX_MINUTE,
        min: DEFAULT_MIN_MINUTE,
    },
    _a$1[TimeUnit.SECOND] = {
        className: TIMEPICKER_SECOND,
        max: DEFAULT_MAX_SECOND,
        min: DEFAULT_MIN_SECOND,
    },
    _a$1[TimeUnit.MS] = {
        className: TIMEPICKER_MILLISECOND,
        max: DEFAULT_MAX_MILLISECOND,
        min: DEFAULT_MIN_MILLISECOND,
    },
    _a$1);

/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function getFormattedDateString(date, props, ignoreRange) {
    if (ignoreRange === void 0) { ignoreRange = false; }
    if (date == null) {
        return "";
    }
    else if (!isDateValid(date)) {
        return props.invalidDateMessage;
    }
    else if (ignoreRange || isDayInRange(date, [props.minDate, props.maxDate])) {
        return props.formatDate(date, props.locale);
    }
    else {
        return props.outOfRangeMessage;
    }
}

var LocaleUtils = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDay = formatDay;
exports.formatMonthTitle = formatMonthTitle;
exports.formatWeekdayShort = formatWeekdayShort;
exports.formatWeekdayLong = formatWeekdayLong;
exports.getFirstDayOfWeek = getFirstDayOfWeek;
exports.getMonths = getMonths;
var WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var WEEKDAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatDay(day) {
  return day.toDateString();
}

function formatMonthTitle(d) {
  return MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

function formatWeekdayShort(i) {
  return WEEKDAYS_SHORT[i];
}

function formatWeekdayLong(i) {
  return WEEKDAYS_LONG[i];
}

function getFirstDayOfWeek() {
  return 0;
}

function getMonths() {
  return MONTHS;
}

exports.default = {
  formatDay: formatDay,
  formatMonthTitle: formatMonthTitle,
  formatWeekdayShort: formatWeekdayShort,
  formatWeekdayLong: formatWeekdayLong,
  getFirstDayOfWeek: getFirstDayOfWeek,
  getMonths: getMonths
};

});

var keys = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var LEFT = exports.LEFT = 37;
var UP = exports.UP = 38;
var RIGHT = exports.RIGHT = 39;
var DOWN = exports.DOWN = 40;
var ENTER = exports.ENTER = 13;
var SPACE = exports.SPACE = 32;
var ESC = exports.ESC = 27;
var TAB = exports.TAB = 9;

});

var Caption_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(react);



var _LocaleUtils2 = _interopRequireDefault(LocaleUtils);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Caption = function (_Component) {
  _inherits(Caption, _Component);

  function Caption(props) {
    _classCallCheck(this, Caption);

    var _this = _possibleConstructorReturn(this, (Caption.__proto__ || Object.getPrototypeOf(Caption)).call(this, props));

    _this.handleKeyUp = _this.handleKeyUp.bind(_this);
    return _this;
  }

  _createClass(Caption, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.locale !== this.props.locale || nextProps.classNames !== this.props.classNames || nextProps.date.getMonth() !== this.props.date.getMonth() || nextProps.date.getFullYear() !== this.props.date.getFullYear();
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp(e) {
      if (e.keyCode === keys.ENTER) {
        this.props.onClick(e);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          classNames = _props.classNames,
          date = _props.date,
          months = _props.months,
          locale = _props.locale,
          localeUtils = _props.localeUtils,
          onClick = _props.onClick;

      return _react2.default.createElement(
        'div',
        { className: classNames.caption, role: 'heading', 'aria-live': 'polite' },
        _react2.default.createElement(
          'div',
          { onClick: onClick, onKeyUp: this.handleKeyUp },
          months ? months[date.getMonth()] + ' ' + date.getFullYear() : localeUtils.formatMonthTitle(date, locale)
        )
      );
    }
  }]);

  return Caption;
}(react.Component);

Caption.defaultProps = {
  localeUtils: _LocaleUtils2.default
};
exports.default = Caption;

});

var classNames = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Proxy object to map classnames when css modules are not used

exports.default = {
  container: 'DayPicker',
  wrapper: 'DayPicker-wrapper',
  interactionDisabled: 'DayPicker--interactionDisabled',
  months: 'DayPicker-Months',
  month: 'DayPicker-Month',

  navBar: 'DayPicker-NavBar',
  navButtonPrev: 'DayPicker-NavButton DayPicker-NavButton--prev',
  navButtonNext: 'DayPicker-NavButton DayPicker-NavButton--next',
  navButtonInteractionDisabled: 'DayPicker-NavButton--interactionDisabled',

  caption: 'DayPicker-Caption',
  weekdays: 'DayPicker-Weekdays',
  weekdaysRow: 'DayPicker-WeekdaysRow',
  weekday: 'DayPicker-Weekday',
  body: 'DayPicker-Body',
  week: 'DayPicker-Week',
  weekNumber: 'DayPicker-WeekNumber',
  day: 'DayPicker-Day',
  footer: 'DayPicker-Footer',
  todayButton: 'DayPicker-TodayButton',

  // default modifiers
  today: 'today',
  selected: 'selected',
  disabled: 'disabled',
  outside: 'outside'
};

});

var Navbar_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(react);



var _classNames2 = _interopRequireDefault(classNames);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Navbar = function (_Component) {
  _inherits(Navbar, _Component);

  function Navbar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Navbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Navbar.__proto__ || Object.getPrototypeOf(Navbar)).call.apply(_ref, [this].concat(args))), _this), _this.handleNextClick = function () {
      if (_this.props.onNextClick) {
        _this.props.onNextClick();
      }
    }, _this.handlePreviousClick = function () {
      if (_this.props.onPreviousClick) {
        _this.props.onPreviousClick();
      }
    }, _this.handleNextKeyDown = function (e) {
      if (e.keyCode !== keys.ENTER && e.keyCode !== keys.SPACE) {
        return;
      }
      e.preventDefault();
      _this.handleNextClick();
    }, _this.handlePreviousKeyDown = function (e) {
      if (e.keyCode !== keys.ENTER && e.keyCode !== keys.SPACE) {
        return;
      }
      e.preventDefault();
      _this.handlePreviousClick();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Navbar, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.labels !== this.props.labels || nextProps.dir !== this.props.dir || this.props.showPreviousButton !== nextProps.showPreviousButton || this.props.showNextButton !== nextProps.showNextButton;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          classNames = _props.classNames,
          className = _props.className,
          showPreviousButton = _props.showPreviousButton,
          showNextButton = _props.showNextButton,
          labels = _props.labels,
          dir = _props.dir;


      var previousClickHandler = void 0;
      var nextClickHandler = void 0;
      var previousKeyDownHandler = void 0;
      var nextKeyDownHandler = void 0;
      var shouldShowPrevious = void 0;
      var shouldShowNext = void 0;

      if (dir === 'rtl') {
        previousClickHandler = this.handleNextClick;
        nextClickHandler = this.handlePreviousClick;
        previousKeyDownHandler = this.handleNextKeyDown;
        nextKeyDownHandler = this.handlePreviousKeyDown;
        shouldShowNext = showPreviousButton;
        shouldShowPrevious = showNextButton;
      } else {
        previousClickHandler = this.handlePreviousClick;
        nextClickHandler = this.handleNextClick;
        previousKeyDownHandler = this.handlePreviousKeyDown;
        nextKeyDownHandler = this.handleNextKeyDown;
        shouldShowNext = showNextButton;
        shouldShowPrevious = showPreviousButton;
      }

      var previousClassName = shouldShowPrevious ? classNames.navButtonPrev : classNames.navButtonPrev + ' ' + classNames.navButtonInteractionDisabled;

      var nextClassName = shouldShowNext ? classNames.navButtonNext : classNames.navButtonNext + ' ' + classNames.navButtonInteractionDisabled;

      var previousButton = _react2.default.createElement('span', {
        tabIndex: '0',
        role: 'button',
        'aria-label': labels.previousMonth,
        key: 'previous',
        className: previousClassName,
        onKeyDown: shouldShowPrevious ? previousKeyDownHandler : undefined,
        onClick: shouldShowPrevious ? previousClickHandler : undefined
      });

      var nextButton = _react2.default.createElement('span', {
        tabIndex: '0',
        role: 'button',
        'aria-label': labels.nextMonth,
        key: 'right',
        className: nextClassName,
        onKeyDown: shouldShowNext ? nextKeyDownHandler : undefined,
        onClick: shouldShowNext ? nextClickHandler : undefined
      });

      return _react2.default.createElement(
        'div',
        { className: className || classNames.navBar },
        dir === 'rtl' ? [nextButton, previousButton] : [previousButton, nextButton]
      );
    }
  }]);

  return Navbar;
}(react.Component);

Navbar.defaultProps = {
  classNames: _classNames2.default,
  dir: 'ltr',
  labels: {
    previousMonth: 'Previous Month',
    nextMonth: 'Next Month'
  },
  showPreviousButton: true,
  showNextButton: true
};
exports.default = Navbar;

});

var Weekdays_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Weekdays = function (_Component) {
  _inherits(Weekdays, _Component);

  function Weekdays() {
    _classCallCheck(this, Weekdays);

    return _possibleConstructorReturn(this, (Weekdays.__proto__ || Object.getPrototypeOf(Weekdays)).apply(this, arguments));
  }

  _createClass(Weekdays, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props !== nextProps;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          classNames = _props.classNames,
          firstDayOfWeek = _props.firstDayOfWeek,
          showWeekNumbers = _props.showWeekNumbers,
          weekdaysLong = _props.weekdaysLong,
          weekdaysShort = _props.weekdaysShort,
          locale = _props.locale,
          localeUtils = _props.localeUtils,
          weekdayElement = _props.weekdayElement;

      var days = [];
      for (var i = 0; i < 7; i += 1) {
        var weekday = (i + firstDayOfWeek) % 7;
        var elementProps = {
          key: i,
          className: classNames.weekday,
          weekday: weekday,
          weekdaysLong: weekdaysLong,
          weekdaysShort: weekdaysShort,
          localeUtils: localeUtils,
          locale: locale
        };
        var element = _react2.default.isValidElement(weekdayElement) ? _react2.default.cloneElement(weekdayElement, elementProps) : _react2.default.createElement(weekdayElement, elementProps);
        days.push(element);
      }

      return _react2.default.createElement(
        'div',
        { className: classNames.weekdays, role: 'rowgroup' },
        _react2.default.createElement(
          'div',
          { className: classNames.weekdaysRow, role: 'row' },
          showWeekNumbers && _react2.default.createElement('div', { className: classNames.weekday }),
          days
        )
      );
    }
  }]);

  return Weekdays;
}(react.Component);

exports.default = Weekdays;

});

var DateUtils = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.isDate = isDate;
exports.addMonths = addMonths;
exports.isSameDay = isSameDay;
exports.isSameMonth = isSameMonth;
exports.isDayBefore = isDayBefore;
exports.isDayAfter = isDayAfter;
exports.isPastDay = isPastDay;
exports.isFutureDay = isFutureDay;
exports.isDayBetween = isDayBetween;
exports.addDayToRange = addDayToRange;
exports.isDayInRange = isDayInRange;
exports.getWeekNumber = getWeekNumber;
/**
 * Clone a date object.
 *
 * @export
 * @param  {Date} d The date to clone
 * @return {Date} The cloned date
 */
function clone(d) {
  return new Date(d.getTime());
}

/**
 * Return `true` if the passed value is a valid JavaScript Date object.
 *
 * @export
 * @param {any} value
 * @returns {Boolean}
 */
function isDate(value) {
  return value instanceof Date && !isNaN(value.valueOf());
}

/**
 * Return `d` as a new date with `n` months added.
 *
 * @export
 * @param {Date} d
 * @param {number} n
 */
function addMonths(d, n) {
  var newDate = clone(d);
  newDate.setMonth(d.getMonth() + n);
  return newDate;
}

/**
 * Return `true` if two dates are the same day, ignoring the time.
 *
 * @export
 * @param  {Date}  d1
 * @param  {Date}  d2
 * @return {Boolean}
 */
function isSameDay(d1, d2) {
  if (!d1 || !d2) {
    return false;
  }
  return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
}

/**
 * Return `true` if two dates fall in the same month.
 *
 * @export
 * @param  {Date}  d1
 * @param  {Date}  d2
 * @return {Boolean}
 */
function isSameMonth(d1, d2) {
  if (!d1 || !d2) {
    return false;
  }
  return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
}

/**
 * Returns `true` if the first day is before the second day.
 *
 * @export
 * @param {Date} d1
 * @param {Date} d2
 * @returns {Boolean}
 */
function isDayBefore(d1, d2) {
  var day1 = clone(d1).setHours(0, 0, 0, 0);
  var day2 = clone(d2).setHours(0, 0, 0, 0);
  return day1 < day2;
}

/**
 * Returns `true` if the first day is after the second day.
 *
 * @export
 * @param {Date} d1
 * @param {Date} d2
 * @returns {Boolean}
 */
function isDayAfter(d1, d2) {
  var day1 = clone(d1).setHours(0, 0, 0, 0);
  var day2 = clone(d2).setHours(0, 0, 0, 0);
  return day1 > day2;
}

/**
 * Return `true` if a day is in the past, e.g. yesterday or any day
 * before yesterday.
 *
 * @export
 * @param  {Date}  d
 * @return {Boolean}
 */
function isPastDay(d) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return isDayBefore(d, today);
}

/**
 * Return `true` if a day is in the future, e.g. tomorrow or any day
 * after tomorrow.
 *
 * @export
 * @param  {Date}  d
 * @return {Boolean}
 */
function isFutureDay(d) {
  var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(0, 0, 0, 0);
  return d >= tomorrow;
}

/**
 * Return `true` if day `d` is between days `d1` and `d2`,
 * without including them.
 *
 * @export
 * @param  {Date}  d
 * @param  {Date}  d1
 * @param  {Date}  d2
 * @return {Boolean}
 */
function isDayBetween(d, d1, d2) {
  var date = clone(d);
  date.setHours(0, 0, 0, 0);
  return isDayAfter(date, d1) && isDayBefore(date, d2) || isDayAfter(date, d2) && isDayBefore(date, d1);
}

/**
 * Add a day to a range and return a new range. A range is an object with
 * `from` and `to` days.
 *
 * @export
 * @param {Date} day
 * @param {Object} range
 * @return {Object} Returns a new range object
 */
function addDayToRange(day) {
  var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { from: null, to: null };
  var from = range.from,
      to = range.to;

  if (!from) {
    from = day;
  } else if (from && to && isSameDay(from, to) && isSameDay(day, from)) {
    from = null;
    to = null;
  } else if (to && isDayBefore(day, from)) {
    from = day;
  } else if (to && isSameDay(day, to)) {
    from = day;
    to = day;
  } else {
    to = day;
    if (isDayBefore(to, from)) {
      to = from;
      from = day;
    }
  }

  return { from: from, to: to };
}

/**
 * Return `true` if a day is included in a range of days.
 *
 * @export
 * @param  {Date}  day
 * @param  {Object}  range
 * @return {Boolean}
 */
function isDayInRange(day, range) {
  var from = range.from,
      to = range.to;

  return from && isSameDay(day, from) || to && isSameDay(day, to) || from && to && isDayBetween(day, from, to);
}

/**
 * Return the year's week number (as per ISO, i.e. with the week starting from monday)
 * for the given day.
 *
 * @export
 * @param {Date} day
 * @returns {Number}
 */
function getWeekNumber(day) {
  var date = clone(day);
  date.setHours(0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  return Math.ceil(((date - new Date(date.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
}

exports.default = {
  addDayToRange: addDayToRange,
  addMonths: addMonths,
  clone: clone,
  getWeekNumber: getWeekNumber,
  isDate: isDate,
  isDayAfter: isDayAfter,
  isDayBefore: isDayBefore,
  isDayBetween: isDayBetween,
  isDayInRange: isDayInRange,
  isFutureDay: isFutureDay,
  isPastDay: isPastDay,
  isSameDay: isSameDay,
  isSameMonth: isSameMonth
};

});

var Helpers = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.cancelEvent = cancelEvent;
exports.getFirstDayOfMonth = getFirstDayOfMonth;
exports.getDaysInMonth = getDaysInMonth;
exports.getModifiersFromProps = getModifiersFromProps;
exports.getFirstDayOfWeekFromProps = getFirstDayOfWeekFromProps;
exports.isRangeOfDates = isRangeOfDates;
exports.getMonthsDiff = getMonthsDiff;
exports.getWeekArray = getWeekArray;
exports.startOfMonth = startOfMonth;
exports.getDayNodes = getDayNodes;
exports.nodeListToArray = nodeListToArray;
exports.hasOwnProp = hasOwnProp;







var _classNames2 = _interopRequireDefault(classNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cancelEvent(e) {
  e.preventDefault();
  e.stopPropagation();
}

function getFirstDayOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 12);
}

function getDaysInMonth(d) {
  var resultDate = getFirstDayOfMonth(d);

  resultDate.setMonth(resultDate.getMonth() + 1);
  resultDate.setDate(resultDate.getDate() - 1);

  return resultDate.getDate();
}

function getModifiersFromProps(props) {
  var modifiers = _extends({}, props.modifiers);
  if (props.selectedDays) {
    modifiers[props.classNames.selected] = props.selectedDays;
  }
  if (props.disabledDays) {
    modifiers[props.classNames.disabled] = props.disabledDays;
  }
  return modifiers;
}

function getFirstDayOfWeekFromProps(props) {
  var firstDayOfWeek = props.firstDayOfWeek,
      _props$locale = props.locale,
      locale = _props$locale === undefined ? 'en' : _props$locale,
      _props$localeUtils = props.localeUtils,
      localeUtils = _props$localeUtils === undefined ? {} : _props$localeUtils;

  if (!isNaN(firstDayOfWeek)) {
    return firstDayOfWeek;
  }
  if (localeUtils.getFirstDayOfWeek) {
    return localeUtils.getFirstDayOfWeek(locale);
  }
  return 0;
}

function isRangeOfDates(value) {
  return !!(value && value.from && value.to);
}

function getMonthsDiff(d1, d2) {
  return d2.getMonth() - d1.getMonth() + 12 * (d2.getFullYear() - d1.getFullYear());
}

function getWeekArray(d) {
  var firstDayOfWeek = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, LocaleUtils.getFirstDayOfWeek)();
  var fixedWeeks = arguments[2];

  var daysInMonth = getDaysInMonth(d);
  var dayArray = [];

  var week = [];
  var weekArray = [];

  for (var i = 1; i <= daysInMonth; i += 1) {
    dayArray.push(new Date(d.getFullYear(), d.getMonth(), i, 12));
  }

  dayArray.forEach(function (day) {
    if (week.length > 0 && day.getDay() === firstDayOfWeek) {
      weekArray.push(week);
      week = [];
    }
    week.push(day);
    if (dayArray.indexOf(day) === dayArray.length - 1) {
      weekArray.push(week);
    }
  });

  // unshift days to start the first week
  var firstWeek = weekArray[0];
  for (var _i = 7 - firstWeek.length; _i > 0; _i -= 1) {
    var outsideDate = (0, DateUtils.clone)(firstWeek[0]);
    outsideDate.setDate(firstWeek[0].getDate() - 1);
    firstWeek.unshift(outsideDate);
  }

  // push days until the end of the last week
  var lastWeek = weekArray[weekArray.length - 1];
  for (var _i2 = lastWeek.length; _i2 < 7; _i2 += 1) {
    var _outsideDate = (0, DateUtils.clone)(lastWeek[lastWeek.length - 1]);
    _outsideDate.setDate(lastWeek[lastWeek.length - 1].getDate() + 1);
    lastWeek.push(_outsideDate);
  }

  // add extra weeks to reach 6 weeks
  if (fixedWeeks && weekArray.length < 6) {
    var lastExtraWeek = void 0;

    for (var _i3 = weekArray.length; _i3 < 6; _i3 += 1) {
      lastExtraWeek = weekArray[weekArray.length - 1];
      var lastDay = lastExtraWeek[lastExtraWeek.length - 1];
      var extraWeek = [];

      for (var j = 0; j < 7; j += 1) {
        var _outsideDate2 = (0, DateUtils.clone)(lastDay);
        _outsideDate2.setDate(lastDay.getDate() + j + 1);
        extraWeek.push(_outsideDate2);
      }

      weekArray.push(extraWeek);
    }
  }

  return weekArray;
}

function startOfMonth(d) {
  var newDate = (0, DateUtils.clone)(d);
  newDate.setDate(1);
  newDate.setHours(12, 0, 0, 0); // always set noon to avoid time zone issues
  return newDate;
}

function getDayNodes(node, classNames) {
  var outsideClassName = void 0;
  if (classNames === _classNames2.default) {
    // When using CSS modules prefix the modifier as required by the BEM syntax
    outsideClassName = classNames.day + '--' + classNames.outside;
  } else {
    outsideClassName = '' + classNames.outside;
  }
  var dayQuery = classNames.day.replace(/ /g, '.');
  var outsideDayQuery = outsideClassName.replace(/ /g, '.');
  var selector = '.' + dayQuery + ':not(.' + outsideDayQuery + ')';
  return node.querySelectorAll(selector);
}

function nodeListToArray(nodeList) {
  return Array.prototype.slice.call(nodeList, 0);
}

function hasOwnProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

});

var Day_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(react);







var _classNames2 = _interopRequireDefault(classNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable jsx-a11y/no-static-element-interactions, react/forbid-prop-types */

function handleEvent(handler, day, modifiers) {
  if (!handler) {
    return undefined;
  }
  return function (e) {
    e.persist();
    handler(day, modifiers, e);
  };
}

var Day = function (_Component) {
  _inherits(Day, _Component);

  function Day() {
    _classCallCheck(this, Day);

    return _possibleConstructorReturn(this, (Day.__proto__ || Object.getPrototypeOf(Day)).apply(this, arguments));
  }

  _createClass(Day, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      var propNames = Object.keys(this.props);
      var nextPropNames = Object.keys(nextProps);
      if (propNames.length !== nextPropNames.length) {
        return true;
      }
      return propNames.some(function (name) {
        if (name === 'modifiers' || name === 'modifiersStyles' || name === 'classNames') {
          var prop = _this2.props[name];
          var nextProp = nextProps[name];
          var modifiers = Object.keys(prop);
          var nextModifiers = Object.keys(nextProp);
          if (modifiers.length !== nextModifiers.length) {
            return true;
          }
          return modifiers.some(function (mod) {
            return !(0, Helpers.hasOwnProp)(nextProp, mod) || prop[mod] !== nextProp[mod];
          });
        }
        if (name === 'day') {
          return !(0, DateUtils.isSameDay)(_this2.props[name], nextProps[name]);
        }
        return !(0, Helpers.hasOwnProp)(nextProps, name) || _this2.props[name] !== nextProps[name];
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          classNames = _props.classNames,
          modifiersStyles = _props.modifiersStyles,
          day = _props.day,
          tabIndex = _props.tabIndex,
          empty = _props.empty,
          modifiers = _props.modifiers,
          onMouseEnter = _props.onMouseEnter,
          onMouseLeave = _props.onMouseLeave,
          onMouseUp = _props.onMouseUp,
          onMouseDown = _props.onMouseDown,
          onClick = _props.onClick,
          onKeyDown = _props.onKeyDown,
          onTouchStart = _props.onTouchStart,
          onTouchEnd = _props.onTouchEnd,
          onFocus = _props.onFocus,
          ariaLabel = _props.ariaLabel,
          ariaDisabled = _props.ariaDisabled,
          ariaSelected = _props.ariaSelected,
          children = _props.children;


      var className = classNames.day;
      if (classNames !== _classNames2.default) {
        // When using CSS modules prefix the modifier as required by the BEM syntax
        className += ' ' + Object.keys(modifiers).join(' ');
      } else {
        className += Object.keys(modifiers).map(function (modifier) {
          return ' ' + className + '--' + modifier;
        }).join('');
      }

      var style = void 0;
      if (modifiersStyles) {
        Object.keys(modifiers).filter(function (modifier) {
          return !!modifiersStyles[modifier];
        }).forEach(function (modifier) {
          style = _extends({}, style, modifiersStyles[modifier]);
        });
      }

      if (empty) {
        return _react2.default.createElement('div', { 'aria-disabled': true, className: className, style: style });
      }
      return _react2.default.createElement(
        'div',
        {
          className: className,
          tabIndex: tabIndex,
          style: style,
          role: 'gridcell',
          'aria-label': ariaLabel,
          'aria-disabled': ariaDisabled,
          'aria-selected': ariaSelected,
          onClick: handleEvent(onClick, day, modifiers),
          onKeyDown: handleEvent(onKeyDown, day, modifiers),
          onMouseEnter: handleEvent(onMouseEnter, day, modifiers),
          onMouseLeave: handleEvent(onMouseLeave, day, modifiers),
          onMouseUp: handleEvent(onMouseUp, day, modifiers),
          onMouseDown: handleEvent(onMouseDown, day, modifiers),
          onTouchEnd: handleEvent(onTouchEnd, day, modifiers),
          onTouchStart: handleEvent(onTouchStart, day, modifiers),
          onFocus: handleEvent(onFocus, day, modifiers)
        },
        children
      );
    }
  }]);

  return Day;
}(react.Component);

Day.defaultProps = {
  tabIndex: -1
};
Day.defaultProps = {
  modifiers: {},
  modifiersStyles: {},
  empty: false
};
exports.default = Day;

});

var ModifiersUtils = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dayMatchesModifier = dayMatchesModifier;
exports.getModifiersForDay = getModifiersForDay;





/**
 * Return `true` if a date matches the specified modifier.
 *
 * @export
 * @param {Date} day
 * @param {Any} modifier
 * @return {Boolean}
 */
function dayMatchesModifier(day, modifier) {
  if (!modifier) {
    return false;
  }
  var arr = Array.isArray(modifier) ? modifier : [modifier];
  return arr.some(function (mod) {
    if (!mod) {
      return false;
    }
    if (mod instanceof Date) {
      return (0, DateUtils.isSameDay)(day, mod);
    }
    if ((0, Helpers.isRangeOfDates)(mod)) {
      return (0, DateUtils.isDayInRange)(day, mod);
    }
    if (mod.after && mod.before && (0, DateUtils.isDayAfter)(mod.before, mod.after)) {
      return (0, DateUtils.isDayAfter)(day, mod.after) && (0, DateUtils.isDayBefore)(day, mod.before);
    }
    if (mod.after && mod.before && ((0, DateUtils.isDayAfter)(mod.after, mod.before) || (0, DateUtils.isSameDay)(mod.after, mod.before))) {
      return (0, DateUtils.isDayAfter)(day, mod.after) || (0, DateUtils.isDayBefore)(day, mod.before);
    }
    if (mod.after) {
      return (0, DateUtils.isDayAfter)(day, mod.after);
    }
    if (mod.before) {
      return (0, DateUtils.isDayBefore)(day, mod.before);
    }
    if (mod.daysOfWeek) {
      return mod.daysOfWeek.some(function (dayOfWeek) {
        return day.getDay() === dayOfWeek;
      });
    }
    if (typeof mod === 'function') {
      return mod(day);
    }
    return false;
  });
}

/**
 * Return the modifiers matching the given day for the given
 * object of modifiers.
 *
 * @export
 * @param {Date} day
 * @param {Object} [modifiersObj={}]
 * @return {Array}
 */
function getModifiersForDay(day) {
  var modifiersObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return Object.keys(modifiersObj).reduce(function (modifiers, modifierName) {
    var value = modifiersObj[modifierName];
    if (dayMatchesModifier(day, value)) {
      modifiers.push(modifierName);
    }
    return modifiers;
  }, []);
}

exports.default = { dayMatchesModifier: dayMatchesModifier, getModifiersForDay: getModifiersForDay };

});

var Month_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(react);



var _Weekdays2 = _interopRequireDefault(Weekdays_1);



var _Day2 = _interopRequireDefault(Day_1);





var ModifiersUtils$1 = _interopRequireWildcard(ModifiersUtils);



var Helpers$1 = _interopRequireWildcard(Helpers);



var DateUtils$1 = _interopRequireWildcard(DateUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Month = function (_Component) {
  _inherits(Month, _Component);

  function Month() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Month);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Month.__proto__ || Object.getPrototypeOf(Month)).call.apply(_ref, [this].concat(args))), _this), _this.renderDay = function (day) {
      var monthNumber = _this.props.month.getMonth();
      var propModifiers = Helpers$1.getModifiersFromProps(_this.props);
      var dayModifiers = ModifiersUtils$1.getModifiersForDay(day, propModifiers);
      if (DateUtils$1.isSameDay(day, new Date()) && !Object.prototype.hasOwnProperty.call(propModifiers, _this.props.classNames.today)) {
        dayModifiers.push(_this.props.classNames.today);
      }
      if (day.getMonth() !== monthNumber) {
        dayModifiers.push(_this.props.classNames.outside);
      }

      var isOutside = day.getMonth() !== monthNumber;
      var tabIndex = -1;
      // Focus on the first day of the month
      if (_this.props.onDayClick && !isOutside && day.getDate() === 1) {
        tabIndex = _this.props.tabIndex; // eslint-disable-line prefer-destructuring
      }
      var key = '' + day.getFullYear() + day.getMonth() + day.getDate();
      var modifiers = {};
      dayModifiers.forEach(function (modifier) {
        modifiers[modifier] = true;
      });

      return _react2.default.createElement(
        _Day2.default,
        {
          key: '' + (isOutside ? 'outside-' : '') + key,
          classNames: _this.props.classNames,
          day: day,
          modifiers: modifiers,
          modifiersStyles: _this.props.modifiersStyles,
          empty: isOutside && !_this.props.showOutsideDays && !_this.props.fixedWeeks,
          tabIndex: tabIndex,
          ariaLabel: _this.props.localeUtils.formatDay(day, _this.props.locale),
          ariaDisabled: isOutside || dayModifiers.indexOf(_this.props.classNames.disabled) > -1,
          ariaSelected: dayModifiers.indexOf(_this.props.classNames.selected) > -1,
          onClick: _this.props.onDayClick,
          onFocus: _this.props.onDayFocus,
          onKeyDown: _this.props.onDayKeyDown,
          onMouseEnter: _this.props.onDayMouseEnter,
          onMouseLeave: _this.props.onDayMouseLeave,
          onMouseDown: _this.props.onDayMouseDown,
          onMouseUp: _this.props.onDayMouseUp,
          onTouchEnd: _this.props.onDayTouchEnd,
          onTouchStart: _this.props.onDayTouchStart
        },
        _this.props.renderDay(day, modifiers)
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Month, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          classNames = _props.classNames,
          month = _props.month,
          months = _props.months,
          fixedWeeks = _props.fixedWeeks,
          captionElement = _props.captionElement,
          weekdayElement = _props.weekdayElement,
          locale = _props.locale,
          localeUtils = _props.localeUtils,
          weekdaysLong = _props.weekdaysLong,
          weekdaysShort = _props.weekdaysShort,
          firstDayOfWeek = _props.firstDayOfWeek,
          onCaptionClick = _props.onCaptionClick,
          showWeekNumbers = _props.showWeekNumbers,
          showWeekDays = _props.showWeekDays,
          onWeekClick = _props.onWeekClick;


      var captionProps = {
        date: month,
        classNames: classNames,
        months: months,
        localeUtils: localeUtils,
        locale: locale,
        onClick: onCaptionClick ? function (e) {
          return onCaptionClick(month, e);
        } : undefined
      };
      var caption = _react2.default.isValidElement(captionElement) ? _react2.default.cloneElement(captionElement, captionProps) : _react2.default.createElement(captionElement, captionProps);

      var weeks = Helpers$1.getWeekArray(month, firstDayOfWeek, fixedWeeks);
      return _react2.default.createElement(
        'div',
        { className: classNames.month, role: 'grid' },
        caption,
        showWeekDays && _react2.default.createElement(_Weekdays2.default, {
          classNames: classNames,
          weekdaysShort: weekdaysShort,
          weekdaysLong: weekdaysLong,
          firstDayOfWeek: firstDayOfWeek,
          showWeekNumbers: showWeekNumbers,
          locale: locale,
          localeUtils: localeUtils,
          weekdayElement: weekdayElement
        }),
        _react2.default.createElement(
          'div',
          { className: classNames.body, role: 'rowgroup' },
          weeks.map(function (week) {
            var weekNumber = void 0;
            if (showWeekNumbers) {
              weekNumber = DateUtils$1.getWeekNumber(week[6]);
            }
            return _react2.default.createElement(
              'div',
              {
                key: week[0].getTime(),
                className: classNames.week,
                role: 'row'
              },
              showWeekNumbers && _react2.default.createElement(
                'div',
                {
                  className: classNames.weekNumber,
                  tabIndex: onWeekClick ? 0 : -1,
                  role: 'gridcell',
                  onClick: onWeekClick ? function (e) {
                    return onWeekClick(weekNumber, week, e);
                  } : undefined,
                  onKeyUp: onWeekClick ? function (e) {
                    return e.keyCode === keys.ENTER && onWeekClick(weekNumber, week, e);
                  } : undefined
                },
                _this2.props.renderWeek(weekNumber, week, month)
              ),
              week.map(_this2.renderDay)
            );
          })
        )
      );
    }
  }]);

  return Month;
}(react.Component);

exports.default = Month;

});

var Weekday_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Weekday = function (_Component) {
  _inherits(Weekday, _Component);

  function Weekday() {
    _classCallCheck(this, Weekday);

    return _possibleConstructorReturn(this, (Weekday.__proto__ || Object.getPrototypeOf(Weekday)).apply(this, arguments));
  }

  _createClass(Weekday, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props !== nextProps;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          weekday = _props.weekday,
          className = _props.className,
          weekdaysLong = _props.weekdaysLong,
          weekdaysShort = _props.weekdaysShort,
          localeUtils = _props.localeUtils,
          locale = _props.locale;

      var title = void 0;
      if (weekdaysLong) {
        title = weekdaysLong[weekday];
      } else {
        title = localeUtils.formatWeekdayLong(weekday, locale);
      }
      var content = void 0;
      if (weekdaysShort) {
        content = weekdaysShort[weekday];
      } else {
        content = localeUtils.formatWeekdayShort(weekday, locale);
      }

      return _react2.default.createElement(
        'div',
        { className: className, role: 'columnheader' },
        _react2.default.createElement(
          'abbr',
          { title: title },
          content
        )
      );
    }
  }]);

  return Weekday;
}(react.Component);

exports.default = Weekday;

});

var DayPicker_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModifiersUtils = exports.LocaleUtils = exports.DateUtils = exports.DayPicker = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(react);



var _Caption2 = _interopRequireDefault(Caption_1);



var _Navbar2 = _interopRequireDefault(Navbar_1);



var _Month2 = _interopRequireDefault(Month_1);



var _Weekday2 = _interopRequireDefault(Weekday_1);



var Helpers$1 = _interopRequireWildcard(Helpers);



var DateUtils$1 = _interopRequireWildcard(DateUtils);



var LocaleUtils$1 = _interopRequireWildcard(LocaleUtils);



var ModifiersUtils$1 = _interopRequireWildcard(ModifiersUtils);



var _classNames2 = _interopRequireDefault(classNames);



function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DayPicker = exports.DayPicker = function (_Component) {
  _inherits(DayPicker, _Component);

  function DayPicker(props) {
    _classCallCheck(this, DayPicker);

    var _this = _possibleConstructorReturn(this, (DayPicker.__proto__ || Object.getPrototypeOf(DayPicker)).call(this, props));

    _this.dayPicker = null;

    _this.showNextMonth = function (callback) {
      if (!_this.allowNextMonth()) {
        return;
      }
      var deltaMonths = _this.props.pagedNavigation ? _this.props.numberOfMonths : 1;
      var nextMonth = DateUtils$1.addMonths(_this.state.currentMonth, deltaMonths);
      _this.showMonth(nextMonth, callback);
    };

    _this.showPreviousMonth = function (callback) {
      if (!_this.allowPreviousMonth()) {
        return;
      }
      var deltaMonths = _this.props.pagedNavigation ? _this.props.numberOfMonths : 1;
      var previousMonth = DateUtils$1.addMonths(_this.state.currentMonth, -deltaMonths);
      _this.showMonth(previousMonth, callback);
    };

    _this.handleKeyDown = function (e) {
      e.persist();

      switch (e.keyCode) {
        case keys.LEFT:
          if (_this.props.dir === 'rtl') {
            _this.showNextMonth();
          } else {
            _this.showPreviousMonth();
          }
          Helpers$1.cancelEvent(e);
          break;
        case keys.RIGHT:
          if (_this.props.dir === 'rtl') {
            _this.showPreviousMonth();
          } else {
            _this.showNextMonth();
          }
          Helpers$1.cancelEvent(e);
          break;
        case keys.UP:
          _this.showPreviousYear();
          Helpers$1.cancelEvent(e);
          break;
        case keys.DOWN:
          _this.showNextYear();
          Helpers$1.cancelEvent(e);
          break;
      }

      if (_this.props.onKeyDown) {
        _this.props.onKeyDown(e);
      }
    };

    _this.handleDayKeyDown = function (day, modifiers, e) {
      e.persist();

      switch (e.keyCode) {
        case keys.LEFT:
          Helpers$1.cancelEvent(e);
          if (_this.props.dir === 'rtl') {
            _this.focusNextDay(e.target);
          } else {
            _this.focusPreviousDay(e.target);
          }
          break;
        case keys.RIGHT:
          Helpers$1.cancelEvent(e);
          if (_this.props.dir === 'rtl') {
            _this.focusPreviousDay(e.target);
          } else {
            _this.focusNextDay(e.target);
          }
          break;
        case keys.UP:
          Helpers$1.cancelEvent(e);
          _this.focusPreviousWeek(e.target);
          break;
        case keys.DOWN:
          Helpers$1.cancelEvent(e);
          _this.focusNextWeek(e.target);
          break;
        case keys.ENTER:
        case keys.SPACE:
          Helpers$1.cancelEvent(e);
          if (_this.props.onDayClick) {
            _this.handleDayClick(day, modifiers, e);
          }
          break;
      }
      if (_this.props.onDayKeyDown) {
        _this.props.onDayKeyDown(day, modifiers, e);
      }
    };

    _this.handleDayClick = function (day, modifiers, e) {
      e.persist();

      if (modifiers[_this.props.classNames.outside] && _this.props.enableOutsideDaysClick) {
        _this.handleOutsideDayClick(day);
      }
      if (_this.props.onDayClick) {
        _this.props.onDayClick(day, modifiers, e);
      }
    };

    _this.handleTodayButtonClick = function (e) {
      var today = new Date();
      var month = new Date(today.getFullYear(), today.getMonth());
      _this.showMonth(month);
      e.target.blur();
      if (_this.props.onTodayButtonClick) {
        e.persist();
        _this.props.onTodayButtonClick(new Date(today.getFullYear(), today.getMonth(), today.getDate()), ModifiersUtils$1.getModifiersForDay(today, _this.props.modifiers), e);
      }
    };

    var currentMonth = _this.getCurrentMonthFromProps(props);
    _this.state = { currentMonth: currentMonth };
    return _this;
  }

  _createClass(DayPicker, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      // Changing the `month` props means changing the current displayed month
      if (prevProps.month !== this.props.month && !DateUtils$1.isSameMonth(prevProps.month, this.props.month)) {
        var currentMonth = this.getCurrentMonthFromProps(this.props);
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ currentMonth: currentMonth });
      }
    }
  }, {
    key: 'getCurrentMonthFromProps',


    /**
     * Return the month to be shown in the calendar based on the component props.
     *
     * @param {Object} props
     * @returns Date
     * @memberof DayPicker
     * @private
     */
    value: function getCurrentMonthFromProps(props) {
      var initialMonth = Helpers$1.startOfMonth(props.month || props.initialMonth || new Date());
      var currentMonth = initialMonth;

      if (props.pagedNavigation && props.numberOfMonths > 1 && props.fromMonth) {
        var fromMonth = Helpers$1.startOfMonth(props.fromMonth);
        var diffInMonths = Helpers$1.getMonthsDiff(fromMonth, currentMonth);
        currentMonth = DateUtils$1.addMonths(fromMonth, Math.floor(diffInMonths / props.numberOfMonths) * props.numberOfMonths);
      } else if (props.toMonth && props.numberOfMonths > 1 && Helpers$1.getMonthsDiff(currentMonth, props.toMonth) <= 0) {
        currentMonth = DateUtils$1.addMonths(Helpers$1.startOfMonth(props.toMonth), 1 - this.props.numberOfMonths);
      }
      return currentMonth;
    }
  }, {
    key: 'getNextNavigableMonth',
    value: function getNextNavigableMonth() {
      return DateUtils$1.addMonths(this.state.currentMonth, this.props.numberOfMonths);
    }
  }, {
    key: 'getPreviousNavigableMonth',
    value: function getPreviousNavigableMonth() {
      return DateUtils$1.addMonths(this.state.currentMonth, -1);
    }
  }, {
    key: 'allowPreviousMonth',
    value: function allowPreviousMonth() {
      var previousMonth = DateUtils$1.addMonths(this.state.currentMonth, -1);
      return this.allowMonth(previousMonth);
    }
  }, {
    key: 'allowNextMonth',
    value: function allowNextMonth() {
      var nextMonth = DateUtils$1.addMonths(this.state.currentMonth, this.props.numberOfMonths);
      return this.allowMonth(nextMonth);
    }
  }, {
    key: 'allowMonth',
    value: function allowMonth(d) {
      var _props = this.props,
          fromMonth = _props.fromMonth,
          toMonth = _props.toMonth,
          canChangeMonth = _props.canChangeMonth;

      if (!canChangeMonth || fromMonth && Helpers$1.getMonthsDiff(fromMonth, d) < 0 || toMonth && Helpers$1.getMonthsDiff(toMonth, d) > 0) {
        return false;
      }
      return true;
    }
  }, {
    key: 'allowYearChange',
    value: function allowYearChange() {
      return this.props.canChangeMonth;
    }
  }, {
    key: 'showMonth',
    value: function showMonth(d, callback) {
      var _this2 = this;

      if (!this.allowMonth(d)) {
        return;
      }
      this.setState({ currentMonth: Helpers$1.startOfMonth(d) }, function () {
        if (callback) {
          callback();
        }
        if (_this2.props.onMonthChange) {
          _this2.props.onMonthChange(_this2.state.currentMonth);
        }
      });
    }
  }, {
    key: 'showNextYear',
    value: function showNextYear() {
      if (!this.allowYearChange()) {
        return;
      }
      var nextMonth = DateUtils$1.addMonths(this.state.currentMonth, 12);
      this.showMonth(nextMonth);
    }
  }, {
    key: 'showPreviousYear',
    value: function showPreviousYear() {
      if (!this.allowYearChange()) {
        return;
      }
      var nextMonth = DateUtils$1.addMonths(this.state.currentMonth, -12);
      this.showMonth(nextMonth);
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.wrapper.focus();
    }
  }, {
    key: 'focusFirstDayOfMonth',
    value: function focusFirstDayOfMonth() {
      Helpers$1.getDayNodes(this.dayPicker, this.props.classNames)[0].focus();
    }
  }, {
    key: 'focusLastDayOfMonth',
    value: function focusLastDayOfMonth() {
      var dayNodes = Helpers$1.getDayNodes(this.dayPicker, this.props.classNames);
      dayNodes[dayNodes.length - 1].focus();
    }
  }, {
    key: 'focusPreviousDay',
    value: function focusPreviousDay(dayNode) {
      var _this3 = this;

      var dayNodes = Helpers$1.getDayNodes(this.dayPicker, this.props.classNames);
      var dayNodeIndex = Helpers$1.nodeListToArray(dayNodes).indexOf(dayNode);
      if (dayNodeIndex === -1) return;
      if (dayNodeIndex === 0) {
        this.showPreviousMonth(function () {
          return _this3.focusLastDayOfMonth();
        });
      } else {
        dayNodes[dayNodeIndex - 1].focus();
      }
    }
  }, {
    key: 'focusNextDay',
    value: function focusNextDay(dayNode) {
      var _this4 = this;

      var dayNodes = Helpers$1.getDayNodes(this.dayPicker, this.props.classNames);
      var dayNodeIndex = Helpers$1.nodeListToArray(dayNodes).indexOf(dayNode);
      if (dayNodeIndex === -1) return;
      if (dayNodeIndex === dayNodes.length - 1) {
        this.showNextMonth(function () {
          return _this4.focusFirstDayOfMonth();
        });
      } else {
        dayNodes[dayNodeIndex + 1].focus();
      }
    }
  }, {
    key: 'focusNextWeek',
    value: function focusNextWeek(dayNode) {
      var _this5 = this;

      var dayNodes = Helpers$1.getDayNodes(this.dayPicker, this.props.classNames);
      var dayNodeIndex = Helpers$1.nodeListToArray(dayNodes).indexOf(dayNode);
      var isInLastWeekOfMonth = dayNodeIndex > dayNodes.length - 8;

      if (isInLastWeekOfMonth) {
        this.showNextMonth(function () {
          var daysAfterIndex = dayNodes.length - dayNodeIndex;
          var nextMonthDayNodeIndex = 7 - daysAfterIndex;
          Helpers$1.getDayNodes(_this5.dayPicker, _this5.props.classNames)[nextMonthDayNodeIndex].focus();
        });
      } else {
        dayNodes[dayNodeIndex + 7].focus();
      }
    }
  }, {
    key: 'focusPreviousWeek',
    value: function focusPreviousWeek(dayNode) {
      var _this6 = this;

      var dayNodes = Helpers$1.getDayNodes(this.dayPicker, this.props.classNames);
      var dayNodeIndex = Helpers$1.nodeListToArray(dayNodes).indexOf(dayNode);
      var isInFirstWeekOfMonth = dayNodeIndex <= 6;

      if (isInFirstWeekOfMonth) {
        this.showPreviousMonth(function () {
          var previousMonthDayNodes = Helpers$1.getDayNodes(_this6.dayPicker, _this6.props.classNames);
          var startOfLastWeekOfMonth = previousMonthDayNodes.length - 7;
          var previousMonthDayNodeIndex = startOfLastWeekOfMonth + dayNodeIndex;
          previousMonthDayNodes[previousMonthDayNodeIndex].focus();
        });
      } else {
        dayNodes[dayNodeIndex - 7].focus();
      }
    }

    // Event handlers

  }, {
    key: 'handleOutsideDayClick',
    value: function handleOutsideDayClick(day) {
      var currentMonth = this.state.currentMonth;
      var numberOfMonths = this.props.numberOfMonths;

      var diffInMonths = Helpers$1.getMonthsDiff(currentMonth, day);
      if (diffInMonths > 0 && diffInMonths >= numberOfMonths) {
        this.showNextMonth();
      } else if (diffInMonths < 0) {
        this.showPreviousMonth();
      }
    }
  }, {
    key: 'renderNavbar',
    value: function renderNavbar() {
      var _props2 = this.props,
          labels = _props2.labels,
          locale = _props2.locale,
          localeUtils = _props2.localeUtils,
          canChangeMonth = _props2.canChangeMonth,
          navbarElement = _props2.navbarElement,
          attributes = _objectWithoutProperties(_props2, ['labels', 'locale', 'localeUtils', 'canChangeMonth', 'navbarElement']);

      if (!canChangeMonth) return null;

      var props = {
        month: this.state.currentMonth,
        classNames: this.props.classNames,
        className: this.props.classNames.navBar,
        nextMonth: this.getNextNavigableMonth(),
        previousMonth: this.getPreviousNavigableMonth(),
        showPreviousButton: this.allowPreviousMonth(),
        showNextButton: this.allowNextMonth(),
        onNextClick: this.showNextMonth,
        onPreviousClick: this.showPreviousMonth,
        dir: attributes.dir,
        labels: labels,
        locale: locale,
        localeUtils: localeUtils
      };
      return _react2.default.isValidElement(navbarElement) ? _react2.default.cloneElement(navbarElement, props) : _react2.default.createElement(navbarElement, props);
    }
  }, {
    key: 'renderMonths',
    value: function renderMonths() {
      var months = [];
      var firstDayOfWeek = Helpers$1.getFirstDayOfWeekFromProps(this.props);
      for (var i = 0; i < this.props.numberOfMonths; i += 1) {
        var month = DateUtils$1.addMonths(this.state.currentMonth, i);
        months.push(_react2.default.createElement(_Month2.default, _extends({
          key: i
        }, this.props, {
          month: month,
          firstDayOfWeek: firstDayOfWeek,
          onDayKeyDown: this.handleDayKeyDown,
          onDayClick: this.handleDayClick
        })));
      }

      if (this.props.reverseMonths) {
        months.reverse();
      }
      return months;
    }
  }, {
    key: 'renderFooter',
    value: function renderFooter() {
      if (this.props.todayButton) {
        return _react2.default.createElement(
          'div',
          { className: this.props.classNames.footer },
          this.renderTodayButton()
        );
      }
      return null;
    }
  }, {
    key: 'renderTodayButton',
    value: function renderTodayButton() {
      return _react2.default.createElement(
        'button',
        {
          type: 'button',
          tabIndex: 0,
          className: this.props.classNames.todayButton,
          'aria-label': this.props.todayButton,
          onClick: this.handleTodayButtonClick
        },
        this.props.todayButton
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var className = this.props.classNames.container;

      if (!this.props.onDayClick) {
        className = className + ' ' + this.props.classNames.interactionDisabled;
      }
      if (this.props.className) {
        className = className + ' ' + this.props.className;
      }
      return _react2.default.createElement(
        'div',
        _extends({}, this.props.containerProps, {
          className: className,
          ref: function ref(el) {
            return _this7.dayPicker = el;
          },
          lang: this.props.locale
        }),
        _react2.default.createElement(
          'div',
          {
            className: this.props.classNames.wrapper,
            ref: function ref(el) {
              return _this7.wrapper = el;
            },
            tabIndex: this.props.canChangeMonth && typeof this.props.tabIndex !== 'undefined' ? this.props.tabIndex : -1,
            onKeyDown: this.handleKeyDown,
            onFocus: this.props.onFocus,
            onBlur: this.props.onBlur
          },
          this.renderNavbar(),
          _react2.default.createElement(
            'div',
            { className: this.props.classNames.months },
            this.renderMonths()
          ),
          this.renderFooter()
        )
      );
    }
  }]);

  return DayPicker;
}(react.Component);

DayPicker.defaultProps = {
  classNames: _classNames2.default,
  tabIndex: 0,
  numberOfMonths: 1,
  labels: {
    previousMonth: 'Previous Month',
    nextMonth: 'Next Month'
  },
  locale: 'en',
  localeUtils: LocaleUtils$1,
  showOutsideDays: false,
  enableOutsideDaysClick: true,
  fixedWeeks: false,
  canChangeMonth: true,
  reverseMonths: false,
  pagedNavigation: false,
  showWeekNumbers: false,
  showWeekDays: true,
  renderDay: function renderDay(day) {
    return day.getDate();
  },
  renderWeek: function renderWeek(weekNumber) {
    return weekNumber;
  },
  weekdayElement: _react2.default.createElement(_Weekday2.default, null),
  navbarElement: _react2.default.createElement(_Navbar2.default, { classNames: _classNames2.default }),
  captionElement: _react2.default.createElement(_Caption2.default, { classNames: _classNames2.default })
};
DayPicker.VERSION = '7.4.8';


DayPicker.DateUtils = DateUtils$1;
DayPicker.LocaleUtils = LocaleUtils$1;
DayPicker.ModifiersUtils = ModifiersUtils$1;

exports.DateUtils = DateUtils$1;
exports.LocaleUtils = LocaleUtils$1;
exports.ModifiersUtils = ModifiersUtils$1;
exports.default = DayPicker;

});

var build = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});



Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(DayPicker_1).default;
  }
});



Object.defineProperty(exports, 'DateUtils', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(DateUtils).default;
  }
});



Object.defineProperty(exports, 'LocaleUtils', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(LocaleUtils).default;
  }
});



Object.defineProperty(exports, 'ModifiersUtils', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(ModifiersUtils).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

});

var DayPicker = /*@__PURE__*/getDefaultExportFromCjs(build);

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ns$1 = "[Blueprint]";
var DATEPICKER_DEFAULT_VALUE_INVALID = ns$1 + " <DatePicker> defaultValue must be within minDate and maxDate bounds.";
var DATEPICKER_INITIAL_MONTH_INVALID = ns$1 + " <DatePicker> initialMonth must be within minDate and maxDate bounds.";
var DATEPICKER_MAX_DATE_INVALID = ns$1 + " <DatePicker> maxDate must be later than minDate.";
var DATEPICKER_VALUE_INVALID = ns$1 + " <DatePicker> value prop must be within minDate and maxDate bounds.";
var DATERANGEPICKER_DEFAULT_VALUE_INVALID = DATEPICKER_DEFAULT_VALUE_INVALID.replace("DatePicker", "DateRangePicker");
var DATERANGEPICKER_INITIAL_MONTH_INVALID = DATEPICKER_INITIAL_MONTH_INVALID.replace("DatePicker", "DateRangePicker");
var DATERANGEPICKER_MAX_DATE_INVALID = DATEPICKER_MAX_DATE_INVALID.replace("DatePicker", "DateRangePicker");
var DATERANGEPICKER_VALUE_INVALID = DATEPICKER_VALUE_INVALID.replace("DatePicker", "DateRangePicker");

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Measure width in pixels of a string displayed with styles provided by `className`.
 * Should only be used if measuring can't be done with existing DOM elements.
 */
function measureTextWidth(text, className, containerElement) {
    if (className === void 0) { className = ""; }
    if (containerElement === void 0) { containerElement = document.body; }
    if (containerElement == null) {
        return 0;
    }
    var span = document.createElement("span");
    span.classList.add(className);
    span.textContent = text;
    containerElement.appendChild(span);
    var spanWidth = span.offsetWidth;
    span.remove();
    return spanWidth;
}
function padWithZeroes(str, minLength) {
    if (str.length < minLength) {
        return "" + stringRepeat("0", minLength - str.length) + str;
    }
    else {
        return str;
    }
}
function stringRepeat(str, numTimes) {
    return new Array(numTimes + 1).join(str);
}

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var DatePickerCaption = /** @class */ (function (_super) {
    __extends(DatePickerCaption, _super);
    function DatePickerCaption() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { monthRightOffset: 0 };
        _this.handleMonthSelectChange = _this.dateChangeHandler(function (d, month) { return d.setMonth(month); }, _this.props.onMonthChange);
        _this.handleYearSelectChange = _this.dateChangeHandler(function (d, year) { return d.setFullYear(year); }, _this.props.onYearChange);
        return _this;
    }
    DatePickerCaption.prototype.render = function () {
        var _this = this;
        var _a = this.props, date = _a.date, locale = _a.locale, localeUtils = _a.localeUtils, minDate = _a.minDate, maxDate = _a.maxDate, _b = _a.months, months = _b === void 0 ? localeUtils.getMonths(locale) : _b;
        var minYear = minDate.getFullYear();
        var maxYear = maxDate.getFullYear();
        var displayMonth = date.getMonth();
        var displayYear = date.getFullYear();
        // build the list of available months, limiting based on minDate and maxDate as necessary
        var startMonth = displayYear === minYear ? minDate.getMonth() : 0;
        var endMonth = displayYear === maxYear ? maxDate.getMonth() + 1 : undefined;
        var monthOptionElements = months
            .map(function (month, i) { return ({ label: month, value: i }); })
            .slice(startMonth, endMonth);
        var years = [minYear];
        for (var year = minYear + 1; year <= maxYear; ++year) {
            years.push(year);
        }
        // allow out-of-bounds years but disable the option. this handles the Dec 2016 case in #391.
        if (displayYear > maxYear) {
            years.push({ value: displayYear, disabled: true });
        }
        this.displayedMonthText = months[displayMonth];
        var monthSelect = (react.createElement(HTMLSelect, { iconProps: { style: { right: this.state.monthRightOffset } }, className: DATEPICKER_MONTH_SELECT, key: "month", minimal: true, onChange: this.handleMonthSelectChange, value: displayMonth, options: monthOptionElements }));
        var yearSelect = (react.createElement(HTMLSelect, { className: DATEPICKER_YEAR_SELECT, key: "year", minimal: true, onChange: this.handleYearSelectChange, value: displayYear, options: years }));
        var orderedSelects = this.props.reverseMonthAndYearMenus
            ? [yearSelect, monthSelect]
            : [monthSelect, yearSelect];
        return (react.createElement("div", { className: this.props.classNames.caption },
            react.createElement("div", { className: DATEPICKER_CAPTION, ref: function (ref) { return (_this.containerElement = ref); } }, orderedSelects),
            react.createElement(Divider, null)));
    };
    DatePickerCaption.prototype.componentDidMount = function () {
        var _this = this;
        this.requestAnimationFrame(function () { return _this.positionArrows(); });
    };
    DatePickerCaption.prototype.componentDidUpdate = function () {
        this.positionArrows();
    };
    DatePickerCaption.prototype.positionArrows = function () {
        // measure width of text as rendered inside our container element.
        var monthTextWidth = measureTextWidth(this.displayedMonthText, DATEPICKER_CAPTION_MEASURE, this.containerElement);
        var monthSelectWidth = this.containerElement == null ? 0 : this.containerElement.firstElementChild.clientWidth;
        var rightOffset = Math.max(2, monthSelectWidth - monthTextWidth - IconSize.STANDARD - 2);
        this.setState({ monthRightOffset: rightOffset });
    };
    DatePickerCaption.prototype.dateChangeHandler = function (updater, handler) {
        var _this = this;
        return function (e) {
            var _a, _b;
            var value = parseInt(e.target.value, 10);
            // ignore change events with invalid values to prevent crash on iOS Safari (#4178)
            if (isNaN(value)) {
                return;
            }
            var newDate = clone(_this.props.date);
            updater(newDate, value);
            (_b = (_a = _this.props).onDateChange) === null || _b === void 0 ? void 0 : _b.call(_a, newDate);
            handler === null || handler === void 0 ? void 0 : handler(value);
        };
    };
    return DatePickerCaption;
}(AbstractPureComponent2));

/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function getDefaultMaxDate() {
    var date = new Date();
    date.setFullYear(date.getFullYear());
    date.setMonth(Months.DECEMBER, 31);
    return date;
}
function getDefaultMinDate() {
    var date = new Date();
    date.setFullYear(date.getFullYear() - 20);
    date.setMonth(Months.JANUARY, 1);
    return date;
}

/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var DatePickerNavbar = /** @class */ (function (_super) {
    __extends(DatePickerNavbar, _super);
    function DatePickerNavbar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleNextClick = function () { return _this.props.onNextClick(); };
        _this.handlePreviousClick = function () { return _this.props.onPreviousClick(); };
        return _this;
    }
    DatePickerNavbar.prototype.render = function () {
        var _a = this.props, classes = _a.classNames, month = _a.month, maxDate = _a.maxDate, minDate = _a.minDate;
        return (react.createElement("div", { className: classnames(DATEPICKER_NAVBAR, classes.navBar) },
            this.props.hideLeftNavButton || (react.createElement(Button, { className: classes.navButtonPrev, disabled: areSameMonth(month, minDate), icon: "chevron-left", minimal: true, onClick: this.handlePreviousClick })),
            this.props.hideRightNavButton || (react.createElement(Button, { className: classes.navButtonNext, disabled: areSameMonth(month, maxDate), icon: "chevron-right", minimal: true, onClick: this.handleNextClick }))));
    };
    return DatePickerNavbar;
}(react.PureComponent));

/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Shortcuts = /** @class */ (function (_super) {
    __extends(Shortcuts, _super);
    function Shortcuts() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getShorcutClickHandler = function (shortcut, index) { return function () {
            var onShortcutClick = _this.props.onShortcutClick;
            onShortcutClick(shortcut, index);
        }; };
        _this.isShortcutInRange = function (shortcutDateRange) {
            var _a = _this.props, minDate = _a.minDate, maxDate = _a.maxDate;
            return isDayRangeInRange(shortcutDateRange, [minDate, maxDate]);
        };
        return _this;
    }
    Shortcuts.prototype.render = function () {
        var _this = this;
        var shortcuts = this.props.shortcuts === true
            ? createDefaultShortcuts(this.props.allowSingleDayRange, this.props.timePrecision !== undefined, this.props.useSingleDateShortcuts === true)
            : this.props.shortcuts;
        var shortcutElements = shortcuts.map(function (shortcut, index) { return (react.createElement(MenuItem, { active: _this.props.selectedShortcutIndex === index, className: POPOVER_DISMISS_OVERRIDE, disabled: !_this.isShortcutInRange(shortcut.dateRange), key: index, onClick: _this.getShorcutClickHandler(shortcut, index), text: shortcut.label })); });
        return (react.createElement(Menu, { className: DATERANGEPICKER_SHORTCUTS, tabIndex: 0 }, shortcutElements));
    };
    Shortcuts.defaultProps = {
        selectedShortcutIndex: -1,
    };
    return Shortcuts;
}(react.PureComponent));
function createShortcut(label, dateRange) {
    return { dateRange: dateRange, label: label };
}
function createDefaultShortcuts(allowSingleDayRange, hasTimePrecision, useSingleDateShortcuts) {
    var today = new Date();
    var makeDate = function (action) {
        var returnVal = clone(today);
        action(returnVal);
        returnVal.setDate(returnVal.getDate() + 1);
        return returnVal;
    };
    var tomorrow = makeDate(function () { return null; });
    var yesterday = makeDate(function (d) { return d.setDate(d.getDate() - 2); });
    var oneWeekAgo = makeDate(function (d) { return d.setDate(d.getDate() - 7); });
    var oneMonthAgo = makeDate(function (d) { return d.setMonth(d.getMonth() - 1); });
    var threeMonthsAgo = makeDate(function (d) { return d.setMonth(d.getMonth() - 3); });
    var sixMonthsAgo = makeDate(function (d) { return d.setMonth(d.getMonth() - 6); });
    var oneYearAgo = makeDate(function (d) { return d.setFullYear(d.getFullYear() - 1); });
    var twoYearsAgo = makeDate(function (d) { return d.setFullYear(d.getFullYear() - 2); });
    var singleDayShortcuts = allowSingleDayRange || useSingleDateShortcuts
        ? [
            createShortcut("Today", [today, hasTimePrecision ? tomorrow : today]),
            createShortcut("Yesterday", [yesterday, hasTimePrecision ? today : yesterday]),
        ]
        : [];
    return __spreadArrays(singleDayShortcuts, [
        createShortcut(useSingleDateShortcuts ? "1 week ago" : "Past week", [oneWeekAgo, today]),
        createShortcut(useSingleDateShortcuts ? "1 month ago" : "Past month", [oneMonthAgo, today]),
        createShortcut(useSingleDateShortcuts ? "3 months ago" : "Past 3 months", [threeMonthsAgo, today])
    ], (useSingleDateShortcuts ? [] : [createShortcut("Past 6 months", [sixMonthsAgo, today])]), [
        createShortcut(useSingleDateShortcuts ? "1 year ago" : "Past year", [oneYearAgo, today])
    ], (useSingleDateShortcuts ? [] : [createShortcut("Past 2 years", [twoYearsAgo, today])]));
}

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var TimePrecision = {
    MILLISECOND: "millisecond",
    MINUTE: "minute",
    SECOND: "second",
};
var TimePicker = /** @class */ (function (_super) {
    __extends(TimePicker, _super);
    function TimePicker(props, context) {
        var _this = _super.call(this, props, context) || this;
        // begin method definitions: event handlers
        _this.getInputChangeHandler = function (unit) { return function (e) {
            var text = getStringValueFromInputEvent(e);
            switch (unit) {
                case TimeUnit.HOUR_12:
                case TimeUnit.HOUR_24:
                    _this.setState({ hourText: text });
                    break;
                case TimeUnit.MINUTE:
                    _this.setState({ minuteText: text });
                    break;
                case TimeUnit.SECOND:
                    _this.setState({ secondText: text });
                    break;
                case TimeUnit.MS:
                    _this.setState({ millisecondText: text });
                    break;
            }
        }; };
        _this.getInputBlurHandler = function (unit) { return function (e) {
            var _a, _b;
            var text = getStringValueFromInputEvent(e);
            _this.updateTime(parseInt(text, 10), unit);
            (_b = (_a = _this.props).onBlur) === null || _b === void 0 ? void 0 : _b.call(_a, e, unit);
        }; };
        _this.getInputFocusHandler = function (unit) { return function (e) {
            var _a, _b;
            if (_this.props.selectAllOnFocus) {
                e.currentTarget.select();
            }
            (_b = (_a = _this.props).onFocus) === null || _b === void 0 ? void 0 : _b.call(_a, e, unit);
        }; };
        _this.getInputKeyDownHandler = function (unit) { return function (e) {
            var _a;
            var _b, _c;
            handleKeyEvent(e, (_a = {},
                _a[ARROW_UP] = function () { return _this.incrementTime(unit); },
                _a[ARROW_DOWN] = function () { return _this.decrementTime(unit); },
                _a[ENTER] = function () {
                    e.currentTarget.blur();
                },
                _a));
            (_c = (_b = _this.props).onKeyDown) === null || _c === void 0 ? void 0 : _c.call(_b, e, unit);
        }; };
        _this.getInputKeyUpHandler = function (unit) { return function (e) {
            var _a, _b;
            (_b = (_a = _this.props).onKeyUp) === null || _b === void 0 ? void 0 : _b.call(_a, e, unit);
        }; };
        _this.handleAmPmChange = function (e) {
            var isNextPm = e.currentTarget.value === "pm";
            if (isNextPm !== _this.state.isPm) {
                var hour_1 = convert24HourMeridiem(_this.state.value.getHours(), isNextPm);
                _this.setState({ isPm: isNextPm }, function () { return _this.updateTime(hour_1, TimeUnit.HOUR_24); });
            }
        };
        _this.incrementTime = function (unit) { return _this.shiftTime(unit, 1); };
        _this.decrementTime = function (unit) { return _this.shiftTime(unit, -1); };
        _this.state = _this.getFullStateFromValue(_this.getInitialValue(), props.useAmPm);
        return _this;
    }
    TimePicker.prototype.render = function () {
        var _a;
        var shouldRenderMilliseconds = this.props.precision === TimePrecision.MILLISECOND;
        var shouldRenderSeconds = shouldRenderMilliseconds || this.props.precision === TimePrecision.SECOND;
        var hourUnit = this.props.useAmPm ? TimeUnit.HOUR_12 : TimeUnit.HOUR_24;
        var classes = classnames(TIMEPICKER, this.props.className, (_a = {},
            _a[DISABLED] = this.props.disabled,
            _a));
        return (react.createElement("div", { className: classes },
            react.createElement("div", { className: TIMEPICKER_ARROW_ROW },
                this.maybeRenderArrowButton(true, hourUnit),
                this.maybeRenderArrowButton(true, TimeUnit.MINUTE),
                shouldRenderSeconds && this.maybeRenderArrowButton(true, TimeUnit.SECOND),
                shouldRenderMilliseconds && this.maybeRenderArrowButton(true, TimeUnit.MS)),
            react.createElement("div", { className: TIMEPICKER_INPUT_ROW },
                this.renderInput(TIMEPICKER_HOUR, hourUnit, this.state.hourText),
                this.renderDivider(),
                this.renderInput(TIMEPICKER_MINUTE, TimeUnit.MINUTE, this.state.minuteText),
                shouldRenderSeconds && this.renderDivider(),
                shouldRenderSeconds &&
                    this.renderInput(TIMEPICKER_SECOND, TimeUnit.SECOND, this.state.secondText),
                shouldRenderMilliseconds && this.renderDivider("."),
                shouldRenderMilliseconds &&
                    this.renderInput(TIMEPICKER_MILLISECOND, TimeUnit.MS, this.state.millisecondText)),
            this.maybeRenderAmPm(),
            react.createElement("div", { className: TIMEPICKER_ARROW_ROW },
                this.maybeRenderArrowButton(false, hourUnit),
                this.maybeRenderArrowButton(false, TimeUnit.MINUTE),
                shouldRenderSeconds && this.maybeRenderArrowButton(false, TimeUnit.SECOND),
                shouldRenderMilliseconds && this.maybeRenderArrowButton(false, TimeUnit.MS))));
    };
    TimePicker.prototype.componentDidUpdate = function (prevProps) {
        var didMinTimeChange = prevProps.minTime !== this.props.minTime;
        var didMaxTimeChange = prevProps.maxTime !== this.props.maxTime;
        var didBoundsChange = didMinTimeChange || didMaxTimeChange;
        var didPropValueChange = prevProps.value !== this.props.value;
        var shouldStateUpdate = didBoundsChange || didPropValueChange;
        var value = this.state.value;
        if (this.props.value == null) {
            value = this.getInitialValue();
        }
        if (didBoundsChange) {
            value = getTimeInRange(this.state.value, this.props.minTime, this.props.maxTime);
        }
        if (this.props.value != null && !areSameTime(this.props.value, prevProps.value)) {
            value = this.props.value;
        }
        if (shouldStateUpdate) {
            this.setState(this.getFullStateFromValue(value, this.props.useAmPm));
        }
    };
    // begin method definitions: rendering
    TimePicker.prototype.maybeRenderArrowButton = function (isDirectionUp, timeUnit) {
        var _this = this;
        if (!this.props.showArrowButtons) {
            return null;
        }
        var classes = classnames(TIMEPICKER_ARROW_BUTTON, getTimeUnitClassName(timeUnit));
        var onClick = function () { return (isDirectionUp ? _this.incrementTime : _this.decrementTime)(timeUnit); };
        // set tabIndex=-1 to ensure a valid FocusEvent relatedTarget when focused
        return (react.createElement("span", { tabIndex: -1, className: classes, onClick: onClick },
            react.createElement(Icon, { icon: isDirectionUp ? "chevron-up" : "chevron-down", title: isDirectionUp ? "Increase" : "Decrease" })));
    };
    TimePicker.prototype.renderDivider = function (text) {
        if (text === void 0) { text = ":"; }
        return react.createElement("span", { className: TIMEPICKER_DIVIDER_TEXT }, text);
    };
    TimePicker.prototype.renderInput = function (className, unit, value) {
        var _a;
        var isValid = isTimeUnitValid(unit, parseInt(value, 10));
        var isHour = unit === TimeUnit.HOUR_12 || unit === TimeUnit.HOUR_24;
        return (react.createElement("input", { className: classnames(TIMEPICKER_INPUT, (_a = {}, _a[intentClass(Intent.DANGER)] = !isValid, _a), className), onBlur: this.getInputBlurHandler(unit), onChange: this.getInputChangeHandler(unit), onFocus: this.getInputFocusHandler(unit), onKeyDown: this.getInputKeyDownHandler(unit), onKeyUp: this.getInputKeyUpHandler(unit), value: value, disabled: this.props.disabled, autoFocus: isHour && this.props.autoFocus }));
    };
    TimePicker.prototype.maybeRenderAmPm = function () {
        if (!this.props.useAmPm) {
            return null;
        }
        return (react.createElement(HTMLSelect, { className: TIMEPICKER_AMPM_SELECT, disabled: this.props.disabled, onChange: this.handleAmPmChange, value: this.state.isPm ? "pm" : "am" },
            react.createElement("option", { value: "am" }, "AM"),
            react.createElement("option", { value: "pm" }, "PM")));
    };
    // begin method definitions: state modification
    /**
     * Generates a full ITimePickerState object with all text fields set to formatted strings based on value
     */
    TimePicker.prototype.getFullStateFromValue = function (value, useAmPm) {
        var timeInRange = getTimeInRange(value, this.props.minTime, this.props.maxTime);
        var hourUnit = useAmPm ? TimeUnit.HOUR_12 : TimeUnit.HOUR_24;
        /* tslint:disable:object-literal-sort-keys */
        return {
            hourText: formatTime(timeInRange.getHours(), hourUnit),
            minuteText: formatTime(timeInRange.getMinutes(), TimeUnit.MINUTE),
            secondText: formatTime(timeInRange.getSeconds(), TimeUnit.SECOND),
            millisecondText: formatTime(timeInRange.getMilliseconds(), TimeUnit.MS),
            value: timeInRange,
            isPm: getIsPmFrom24Hour(timeInRange.getHours()),
        };
        /* tslint:enable:object-literal-sort-keys */
    };
    TimePicker.prototype.shiftTime = function (unit, amount) {
        if (this.props.disabled) {
            return;
        }
        var newTime = getTimeUnit(unit, this.state.value) + amount;
        this.updateTime(wrapTimeAtUnit(unit, newTime), unit);
    };
    TimePicker.prototype.updateTime = function (time, unit) {
        var newValue = clone(this.state.value);
        if (isTimeUnitValid(unit, time)) {
            setTimeUnit(unit, time, newValue, this.state.isPm);
            if (isTimeInRange(newValue, this.props.minTime, this.props.maxTime)) {
                this.updateState({ value: newValue });
            }
            else {
                this.updateState(this.getFullStateFromValue(this.state.value, this.props.useAmPm));
            }
        }
        else {
            this.updateState(this.getFullStateFromValue(this.state.value, this.props.useAmPm));
        }
    };
    TimePicker.prototype.updateState = function (state) {
        var _a, _b;
        var newState = state;
        var hasNewValue = newState.value != null && !areSameTime(newState.value, this.state.value);
        if (this.props.value == null) {
            // component is uncontrolled
            if (hasNewValue) {
                newState = this.getFullStateFromValue(newState.value, this.props.useAmPm);
            }
            this.setState(newState);
        }
        else {
            // component is controlled, and there's a new value
            // so set inputs' text based off of _old_ value and later fire onChange with new value
            if (hasNewValue) {
                this.setState(this.getFullStateFromValue(this.state.value, this.props.useAmPm));
            }
            else {
                // no new value, this means only text has changed (from user typing)
                // we want inputs to change, so update state with new text for the inputs
                // but don't change actual value
                this.setState(__assign(__assign({}, newState), { value: clone(this.state.value) }));
            }
        }
        if (hasNewValue) {
            (_b = (_a = this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, newState.value);
        }
    };
    TimePicker.prototype.getInitialValue = function () {
        var value = this.props.minTime;
        if (this.props.value != null) {
            value = this.props.value;
        }
        else if (this.props.defaultValue != null) {
            value = this.props.defaultValue;
        }
        return value;
    };
    TimePicker.defaultProps = {
        autoFocus: false,
        disabled: false,
        maxTime: getDefaultMaxTime(),
        minTime: getDefaultMinTime(),
        precision: TimePrecision.MINUTE,
        selectAllOnFocus: false,
        showArrowButtons: false,
        useAmPm: false,
    };
    TimePicker.displayName = DISPLAYNAME_PREFIX + ".TimePicker";
    return TimePicker;
}(react.Component));
function formatTime(time, unit) {
    switch (unit) {
        case TimeUnit.HOUR_24:
            return time.toString();
        case TimeUnit.HOUR_12:
            return get12HourFrom24Hour(time).toString();
        case TimeUnit.MINUTE:
        case TimeUnit.SECOND:
            return padWithZeroes(time.toString(), 2);
        case TimeUnit.MS:
            return padWithZeroes(time.toString(), 3);
        default:
            throw Error("Invalid TimeUnit");
    }
}
function getStringValueFromInputEvent(e) {
    return e.target.value;
}
function handleKeyEvent(e, actions, preventDefault) {
    if (preventDefault === void 0) { preventDefault = true; }
    for (var _i = 0, _a = Object.keys(actions); _i < _a.length; _i++) {
        var k = _a[_i];
        var key = Number(k);
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        // eslint-disable-next-line deprecation/deprecation
        if (e.which === key) {
            if (preventDefault) {
                e.preventDefault();
            }
            actions[key]();
        }
    }
}

/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var DatePicker = /** @class */ (function (_super) {
    __extends(DatePicker, _super);
    function DatePicker(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.ignoreNextMonthChange = false;
        _this.shouldHighlightCurrentDay = function (date) {
            var highlightCurrentDay = _this.props.highlightCurrentDay;
            return highlightCurrentDay && isToday(date);
        };
        _this.getDatePickerModifiers = function () {
            var modifiers = _this.props.modifiers;
            return __assign({ isToday: _this.shouldHighlightCurrentDay }, modifiers);
        };
        _this.renderDay = function (day) {
            var date = day.getDate();
            return react.createElement("div", { className: DATEPICKER_DAY_WRAPPER }, date);
        };
        _this.disabledDays = function (day) { return !isDayInRange(day, [_this.props.minDate, _this.props.maxDate]); };
        _this.getDisabledDaysModifier = function () {
            var disabledDays = _this.props.dayPickerProps.disabledDays;
            return Array.isArray(disabledDays) ? __spreadArrays([_this.disabledDays], disabledDays) : [_this.disabledDays, disabledDays];
        };
        _this.renderCaption = function (props) { return (react.createElement(DatePickerCaption, __assign({}, props, { maxDate: _this.props.maxDate, minDate: _this.props.minDate, onDateChange: _this.handleMonthChange, reverseMonthAndYearMenus: _this.props.reverseMonthAndYearMenus }))); };
        _this.renderNavbar = function (props) { return (react.createElement(DatePickerNavbar, __assign({}, props, { maxDate: _this.props.maxDate, minDate: _this.props.minDate }))); };
        _this.handleDayClick = function (day, modifiers, e) {
            var _a, _b;
            (_b = (_a = _this.props.dayPickerProps).onDayClick) === null || _b === void 0 ? void 0 : _b.call(_a, day, modifiers, e);
            if (modifiers.disabled) {
                return;
            }
            _this.updateDay(day);
            // allow toggling selected date by clicking it again (if prop enabled)
            var newValue = _this.props.canClearSelection && modifiers.selected ? null : getDateTime(day, _this.state.value);
            _this.updateValue(newValue, true);
        };
        _this.handleShortcutClick = function (shortcut, selectedShortcutIndex) {
            var _a = _this.props, onShortcutChange = _a.onShortcutChange, currentShortcutIndex = _a.selectedShortcutIndex;
            var dateRange = shortcut.dateRange, includeTime = shortcut.includeTime;
            var newDate = dateRange[0];
            var newValue = includeTime ? newDate : getDateTime(newDate, _this.state.value);
            _this.updateDay(newDate);
            _this.updateValue(newValue, true);
            if (currentShortcutIndex === undefined) {
                _this.setState({ selectedShortcutIndex: selectedShortcutIndex });
            }
            var datePickerShortcut = __assign(__assign({}, shortcut), { date: shortcut.dateRange[0] });
            onShortcutChange === null || onShortcutChange === void 0 ? void 0 : onShortcutChange(datePickerShortcut, selectedShortcutIndex);
        };
        _this.updateDay = function (day) {
            if (_this.props.value === undefined) {
                // set now if uncontrolled, otherwise they'll be updated in `componentDidUpdate`
                _this.setState({
                    displayMonth: day.getMonth(),
                    displayYear: day.getFullYear(),
                    selectedDay: day.getDate(),
                });
            }
            if (_this.state.value != null && _this.state.value.getMonth() !== day.getMonth()) {
                _this.ignoreNextMonthChange = true;
            }
        };
        _this.handleClearClick = function () { return _this.updateValue(null, true); };
        _this.handleMonthChange = function (newDate) {
            var _a, _b;
            var date = _this.computeValidDateInSpecifiedMonthYear(newDate.getFullYear(), newDate.getMonth());
            _this.setState({ displayMonth: date.getMonth(), displayYear: date.getFullYear() });
            if (_this.state.value !== null) {
                // if handleDayClick just got run (so this flag is set), then the
                // user selected a date in a new month, so don't invoke onChange a
                // second time
                _this.updateValue(date, false, _this.ignoreNextMonthChange);
                _this.ignoreNextMonthChange = false;
            }
            (_b = (_a = _this.props.dayPickerProps).onMonthChange) === null || _b === void 0 ? void 0 : _b.call(_a, date);
        };
        _this.handleTodayClick = function () {
            var value = new Date();
            var displayMonth = value.getMonth();
            var displayYear = value.getFullYear();
            var selectedDay = value.getDate();
            _this.setState({ displayMonth: displayMonth, displayYear: displayYear, selectedDay: selectedDay });
            _this.updateValue(value, true);
        };
        _this.handleTimeChange = function (time) {
            var _a, _b;
            (_b = (_a = _this.props.timePickerProps) === null || _a === void 0 ? void 0 : _a.onChange) === null || _b === void 0 ? void 0 : _b.call(_a, time);
            var value = _this.state.value;
            var newValue = getDateTime(value != null ? value : new Date(), time);
            _this.updateValue(newValue, true);
        };
        var value = getInitialValue(props);
        var initialMonth = getInitialMonth(props, value);
        _this.state = {
            displayMonth: initialMonth.getMonth(),
            displayYear: initialMonth.getFullYear(),
            selectedDay: value == null ? null : value.getDate(),
            selectedShortcutIndex: _this.props.selectedShortcutIndex !== undefined ? _this.props.selectedShortcutIndex : -1,
            value: value,
        };
        return _this;
    }
    DatePicker.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, dayPickerProps = _b.dayPickerProps, locale = _b.locale, localeUtils = _b.localeUtils, maxDate = _b.maxDate, minDate = _b.minDate, showActionsBar = _b.showActionsBar;
        var _c = this.state, displayMonth = _c.displayMonth, displayYear = _c.displayYear;
        return (react.createElement("div", { className: classnames(DATEPICKER, className) },
            this.maybeRenderShortcuts(),
            react.createElement("div", null,
                react.createElement(DayPicker, __assign({ showOutsideDays: true, locale: locale, localeUtils: localeUtils, modifiers: this.getDatePickerModifiers() }, dayPickerProps, { canChangeMonth: true, captionElement: this.renderCaption, navbarElement: this.renderNavbar, disabledDays: this.getDisabledDaysModifier(), fromMonth: minDate, month: new Date(displayYear, displayMonth), onDayClick: this.handleDayClick, onMonthChange: this.handleMonthChange, selectedDays: this.state.value, toMonth: maxDate, renderDay: (_a = dayPickerProps === null || dayPickerProps === void 0 ? void 0 : dayPickerProps.renderDay) !== null && _a !== void 0 ? _a : this.renderDay })),
                this.maybeRenderTimePicker(),
                showActionsBar && this.renderOptionsBar())));
    };
    DatePicker.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        var value = this.props.value;
        if (value === prevProps.value) {
            // no action needed
            return;
        }
        else if (value == null) {
            // clear the value
            this.setState({ value: value });
        }
        else {
            this.setState({
                displayMonth: value.getMonth(),
                displayYear: value.getFullYear(),
                selectedDay: value.getDate(),
                value: value,
            });
        }
        if (this.props.selectedShortcutIndex !== prevProps.selectedShortcutIndex) {
            this.setState({ selectedShortcutIndex: this.props.selectedShortcutIndex });
        }
    };
    DatePicker.prototype.validateProps = function (props) {
        var defaultValue = props.defaultValue, initialMonth = props.initialMonth, maxDate = props.maxDate, minDate = props.minDate, value = props.value;
        if (defaultValue != null && !isDayInRange(defaultValue, [minDate, maxDate])) {
            console.error(DATEPICKER_DEFAULT_VALUE_INVALID);
        }
        if (initialMonth != null && !isMonthInRange(initialMonth, [minDate, maxDate])) {
            console.error(DATEPICKER_INITIAL_MONTH_INVALID);
        }
        if (maxDate != null && minDate != null && maxDate < minDate && !areSameDay(maxDate, minDate)) {
            console.error(DATEPICKER_MAX_DATE_INVALID);
        }
        if (value != null && !isDayInRange(value, [minDate, maxDate])) {
            console.error(DATEPICKER_VALUE_INVALID);
        }
    };
    DatePicker.prototype.renderOptionsBar = function () {
        var _a = this.props, clearButtonText = _a.clearButtonText, todayButtonText = _a.todayButtonText;
        return [
            react.createElement(Divider, { key: "div" }),
            react.createElement("div", { className: DATEPICKER_FOOTER, key: "footer" },
                react.createElement(Button, { minimal: true, onClick: this.handleTodayClick, text: todayButtonText }),
                react.createElement(Button, { minimal: true, onClick: this.handleClearClick, text: clearButtonText })),
        ];
    };
    DatePicker.prototype.maybeRenderTimePicker = function () {
        var _a = this.props, timePrecision = _a.timePrecision, timePickerProps = _a.timePickerProps, minDate = _a.minDate, maxDate = _a.maxDate;
        if (timePrecision == null && timePickerProps === undefined) {
            return null;
        }
        var applyMin = areSameDay(this.state.value, minDate);
        var applyMax = areSameDay(this.state.value, maxDate);
        return (react.createElement("div", { className: DATEPICKER_TIMEPICKER_WRAPPER },
            react.createElement(TimePicker, __assign({ precision: timePrecision, minTime: applyMin ? minDate : undefined, maxTime: applyMax ? maxDate : undefined }, timePickerProps, { onChange: this.handleTimeChange, value: this.state.value }))));
    };
    DatePicker.prototype.maybeRenderShortcuts = function () {
        var shortcuts = this.props.shortcuts;
        if (shortcuts == null || shortcuts === false) {
            return null;
        }
        var selectedShortcutIndex = this.state.selectedShortcutIndex;
        var _a = this.props, maxDate = _a.maxDate, minDate = _a.minDate, timePrecision = _a.timePrecision;
        // Reuse the existing date range shortcuts and only care about start date
        var dateRangeShortcuts = shortcuts === true
            ? true
            : shortcuts.map(function (shortcut) { return (__assign(__assign({}, shortcut), { dateRange: [shortcut.date, undefined] })); });
        return [
            react.createElement(Shortcuts, __assign({ key: "shortcuts" }, {
                allowSingleDayRange: true,
                maxDate: maxDate,
                minDate: minDate,
                selectedShortcutIndex: selectedShortcutIndex,
                shortcuts: dateRangeShortcuts,
                timePrecision: timePrecision,
            }, { onShortcutClick: this.handleShortcutClick, useSingleDateShortcuts: true })),
            react.createElement(Divider, { key: "div" }),
        ];
    };
    DatePicker.prototype.computeValidDateInSpecifiedMonthYear = function (displayYear, displayMonth) {
        var _a = this.props, minDate = _a.minDate, maxDate = _a.maxDate;
        var selectedDay = this.state.selectedDay;
        // month is 0-based, date is 1-based. date 0 is last day of previous month.
        var maxDaysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
        var displayDate = selectedDay == null ? 1 : Math.min(selectedDay, maxDaysInMonth);
        // 12:00 matches the underlying react-day-picker timestamp behavior
        var value = getDateTime(new Date(displayYear, displayMonth, displayDate, 12), this.state.value);
        // clamp between min and max dates
        if (value < minDate) {
            return minDate;
        }
        else if (value > maxDate) {
            return maxDate;
        }
        return value;
    };
    /**
     * Update `value` by invoking `onChange` (always) and setting state (if uncontrolled).
     */
    DatePicker.prototype.updateValue = function (value, isUserChange, skipOnChange) {
        var _a, _b;
        if (skipOnChange === void 0) { skipOnChange = false; }
        if (!skipOnChange) {
            (_b = (_a = this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, value, isUserChange);
        }
        if (this.props.value === undefined) {
            this.setState({ value: value });
        }
    };
    DatePicker.defaultProps = {
        canClearSelection: true,
        clearButtonText: "Clear",
        dayPickerProps: {},
        highlightCurrentDay: false,
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        reverseMonthAndYearMenus: false,
        shortcuts: false,
        showActionsBar: false,
        todayButtonText: "Today",
    };
    DatePicker.displayName = DISPLAYNAME_PREFIX + ".DatePicker";
    return DatePicker;
}(AbstractPureComponent2));
function getInitialValue(props) {
    // !== because `null` is a valid value (no date)
    if (props.value !== undefined) {
        return props.value;
    }
    if (props.defaultValue !== undefined) {
        return props.defaultValue;
    }
    return null;
}
function getInitialMonth(props, value) {
    var today = new Date();
    // != because we must have a real `Date` to begin the calendar on.
    if (props.initialMonth != null) {
        return props.initialMonth;
    }
    else if (value != null) {
        return value;
    }
    else if (isDayInRange(today, [props.minDate, props.maxDate])) {
        return today;
    }
    else {
        return getDateBetween([props.minDate, props.maxDate]);
    }
}

/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var DateInput = /** @class */ (function (_super) {
    __extends(DateInput, _super);
    function DateInput() {
        var _a;
        var _this = _super.apply(this, arguments) || this;
        _this.state = {
            isInputFocused: false,
            isOpen: false,
            value: _this.props.value !== undefined ? _this.props.value : _this.props.defaultValue,
            valueString: null,
        };
        _this.inputElement = null;
        _this.popoverContentElement = null;
        _this.handleInputRef = refHandler(_this, "inputElement", (_a = _this.props.inputProps) === null || _a === void 0 ? void 0 : _a.inputRef);
        _this.handlePopoverContentRef = refHandler(_this, "popoverContentElement");
        _this.handleClosePopover = function (e) {
            var _a;
            var _b = _this.props.popoverProps, popoverProps = _b === void 0 ? {} : _b;
            (_a = popoverProps.onClose) === null || _a === void 0 ? void 0 : _a.call(popoverProps, e);
            _this.setState({ isOpen: false });
        };
        _this.handleDateChange = function (newDate, isUserChange, didSubmitWithEnter) {
            var _a, _b;
            if (didSubmitWithEnter === void 0) { didSubmitWithEnter = false; }
            var prevDate = _this.state.value;
            // this change handler was triggered by a change in month, day, or (if
            // enabled) time. for UX purposes, we want to close the popover only if
            // the user explicitly clicked a day within the current month.
            var isOpen = !isUserChange ||
                !_this.props.closeOnSelection ||
                (prevDate != null && (_this.hasMonthChanged(prevDate, newDate) || _this.hasTimeChanged(prevDate, newDate)));
            // if selecting a date via click or Tab, the input will already be
            // blurred by now, so sync isInputFocused to false. if selecting via
            // Enter, setting isInputFocused to false won't do anything by itself,
            // plus we want the field to retain focus anyway.
            // (note: spelling out the ternary explicitly reads more clearly.)
            var isInputFocused = didSubmitWithEnter ? true : false;
            if (_this.props.value === undefined) {
                var valueString = getFormattedDateString(newDate, _this.props);
                _this.setState({ isInputFocused: isInputFocused, isOpen: isOpen, value: newDate, valueString: valueString });
            }
            else {
                _this.setState({ isInputFocused: isInputFocused, isOpen: isOpen });
            }
            (_b = (_a = _this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, newDate, isUserChange);
        };
        _this.handleInputFocus = function (e) {
            var valueString = _this.state.value == null ? "" : _this.formatDate(_this.state.value);
            _this.setState({ isInputFocused: true, isOpen: true, valueString: valueString });
            _this.safeInvokeInputProp("onFocus", e);
        };
        _this.handleInputClick = function (e) {
            // stop propagation to the Popover's internal handleTargetClick handler;
            // otherwise, the popover will flicker closed as soon as it opens.
            e.stopPropagation();
            _this.safeInvokeInputProp("onClick", e);
        };
        _this.handleInputChange = function (e) {
            var _a, _b, _c, _d;
            var valueString = e.target.value;
            var value = _this.parseDate(valueString);
            if (isDateValid(value) && _this.isDateInRange(value)) {
                if (_this.props.value === undefined) {
                    _this.setState({ value: value, valueString: valueString });
                }
                else {
                    _this.setState({ valueString: valueString });
                }
                (_b = (_a = _this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, value, true);
            }
            else {
                if (valueString.length === 0) {
                    (_d = (_c = _this.props).onChange) === null || _d === void 0 ? void 0 : _d.call(_c, null, true);
                }
                _this.setState({ valueString: valueString });
            }
            _this.safeInvokeInputProp("onChange", e);
        };
        _this.handleInputBlur = function (e) {
            var _a, _b, _c, _d, _e, _f;
            var valueString = _this.state.valueString;
            var date = _this.parseDate(valueString);
            if (valueString.length > 0 &&
                valueString !== getFormattedDateString(_this.state.value, _this.props) &&
                (!isDateValid(date) || !_this.isDateInRange(date))) {
                if (_this.props.value === undefined) {
                    _this.setState({ isInputFocused: false, value: date, valueString: null });
                }
                else {
                    _this.setState({ isInputFocused: false });
                }
                if (isNaN(date.valueOf())) {
                    (_b = (_a = _this.props).onError) === null || _b === void 0 ? void 0 : _b.call(_a, new Date(undefined));
                }
                else if (!_this.isDateInRange(date)) {
                    (_d = (_c = _this.props).onError) === null || _d === void 0 ? void 0 : _d.call(_c, date);
                }
                else {
                    (_f = (_e = _this.props).onChange) === null || _f === void 0 ? void 0 : _f.call(_e, date, true);
                }
            }
            else {
                if (valueString.length === 0) {
                    _this.setState({ isInputFocused: false, value: null, valueString: null });
                }
                else {
                    _this.setState({ isInputFocused: false });
                }
            }
            _this.safeInvokeInputProp("onBlur", e);
        };
        _this.handleInputKeyDown = function (e) {
            var _a, _b;
            // HACKHACK: https://github.com/palantir/blueprint/issues/4165
            /* eslint-disable deprecation/deprecation */
            if (e.which === ENTER) {
                var nextDate = _this.parseDate(_this.state.valueString);
                _this.handleDateChange(nextDate, true, true);
            }
            else if (e.which === TAB && e.shiftKey) {
                // close popover on SHIFT+TAB key press
                _this.handleClosePopover();
            }
            else if (e.which === TAB && _this.state.isOpen) {
                (_a = _this.getKeyboardFocusableElements().shift()) === null || _a === void 0 ? void 0 : _a.focus();
                // necessary to prevent focusing the second focusable element
                e.preventDefault();
            }
            else if (e.which === ESCAPE) {
                _this.setState({ isOpen: false });
                (_b = _this.inputElement) === null || _b === void 0 ? void 0 : _b.blur();
            }
            _this.safeInvokeInputProp("onKeyDown", e);
        };
        _this.getKeyboardFocusableElements = function () {
            var _a;
            var elements = Array.from((_a = _this.popoverContentElement) === null || _a === void 0 ? void 0 : _a.querySelectorAll("button:not([disabled]),input,[tabindex]:not([tabindex='-1'])"));
            // Remove focus boundary div elements
            elements.pop();
            elements.shift();
            return elements;
        };
        _this.handleStartFocusBoundaryFocusIn = function (e) {
            var _a, _b;
            if (_this.popoverContentElement.contains(_this.getRelatedTarget(e))) {
                // Not closing Popover to allow user to freely switch between manually entering a date
                // string in the input and selecting one via the Popover
                (_a = _this.inputElement) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else {
                (_b = _this.getKeyboardFocusableElements().shift()) === null || _b === void 0 ? void 0 : _b.focus();
            }
        };
        _this.handleEndFocusBoundaryFocusIn = function (e) {
            var _a, _b;
            if (_this.popoverContentElement.contains(_this.getRelatedTarget(e))) {
                (_a = _this.inputElement) === null || _a === void 0 ? void 0 : _a.focus();
                _this.handleClosePopover();
            }
            else {
                (_b = _this.getKeyboardFocusableElements().pop()) === null || _b === void 0 ? void 0 : _b.focus();
            }
        };
        _this.handleShortcutChange = function (_, selectedShortcutIndex) {
            _this.setState({ selectedShortcutIndex: selectedShortcutIndex });
        };
        return _this;
    }
    DateInput.prototype.render = function () {
        var _this = this;
        var _a = this.state, value = _a.value, valueString = _a.valueString;
        var dateString = this.state.isInputFocused ? valueString : getFormattedDateString(value, this.props);
        var dateValue = isDateValid(value) ? value : null;
        var dayPickerProps = __assign(__assign({}, this.props.dayPickerProps), { onDayKeyDown: function (day, modifiers, e) {
                var _a, _b;
                (_b = (_a = _this.props.dayPickerProps).onDayKeyDown) === null || _b === void 0 ? void 0 : _b.call(_a, day, modifiers, e);
            }, onMonthChange: function (month) {
                var _a, _b;
                (_b = (_a = _this.props.dayPickerProps).onMonthChange) === null || _b === void 0 ? void 0 : _b.call(_a, month);
            } });
        // React's onFocus prop listens to the focusin browser event under the hood, so it's safe to
        // provide it the focusIn event handlers instead of using a ref and manually adding the
        // event listeners ourselves.
        var wrappedPopoverContent = (react.createElement("div", { ref: this.handlePopoverContentRef },
            react.createElement("div", { onFocus: this.handleStartFocusBoundaryFocusIn, tabIndex: 0 }),
            react.createElement(DatePicker, __assign({}, this.props, { dayPickerProps: dayPickerProps, onChange: this.handleDateChange, value: dateValue, onShortcutChange: this.handleShortcutChange, selectedShortcutIndex: this.state.selectedShortcutIndex })),
            react.createElement("div", { onFocus: this.handleEndFocusBoundaryFocusIn, tabIndex: 0 })));
        // assign default empty object here to prevent mutation
        var _b = this.props, _c = _b.inputProps, inputProps = _c === void 0 ? {} : _c, _d = _b.popoverProps, popoverProps = _d === void 0 ? {} : _d;
        var isErrorState = value != null && (!isDateValid(value) || !this.isDateInRange(value));
        return (
        /* eslint-disable-next-line deprecation/deprecation */
        react.createElement(Popover, __assign({ isOpen: this.state.isOpen && !this.props.disabled, fill: this.props.fill }, popoverProps, { autoFocus: false, className: classnames(popoverProps.className, this.props.className), content: wrappedPopoverContent, enforceFocus: false, onClose: this.handleClosePopover, popoverClassName: classnames(DATEINPUT_POPOVER, popoverProps.popoverClassName) }),
            react.createElement(InputGroup, __assign({ autoComplete: "off", intent: isErrorState ? Intent.DANGER : Intent.NONE, placeholder: this.props.placeholder, rightElement: this.props.rightElement, type: "text" }, inputProps, { disabled: this.props.disabled, inputRef: this.handleInputRef, onBlur: this.handleInputBlur, onChange: this.handleInputChange, onClick: this.handleInputClick, onFocus: this.handleInputFocus, onKeyDown: this.handleInputKeyDown, value: dateString }))));
    };
    DateInput.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a, _b, _c, _d, _e;
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        if (((_a = prevProps.inputProps) === null || _a === void 0 ? void 0 : _a.inputRef) !== ((_b = this.props.inputProps) === null || _b === void 0 ? void 0 : _b.inputRef)) {
            setRef((_c = prevProps.inputProps) === null || _c === void 0 ? void 0 : _c.inputRef, null);
            this.handleInputRef = refHandler(this, "inputElement", (_d = this.props.inputProps) === null || _d === void 0 ? void 0 : _d.inputRef);
            setRef((_e = this.props.inputProps) === null || _e === void 0 ? void 0 : _e.inputRef, this.inputElement);
        }
        if (prevProps.value !== this.props.value) {
            this.setState({ value: this.props.value });
        }
    };
    DateInput.prototype.isDateInRange = function (value) {
        return isDayInRange(value, [this.props.minDate, this.props.maxDate]);
    };
    DateInput.prototype.hasMonthChanged = function (prevDate, nextDate) {
        return (prevDate == null) !== (nextDate == null) || nextDate.getMonth() !== prevDate.getMonth();
    };
    DateInput.prototype.hasTimeChanged = function (prevDate, nextDate) {
        if (this.props.timePrecision == null) {
            return false;
        }
        return ((prevDate == null) !== (nextDate == null) ||
            nextDate.getHours() !== prevDate.getHours() ||
            nextDate.getMinutes() !== prevDate.getMinutes() ||
            nextDate.getSeconds() !== prevDate.getSeconds() ||
            nextDate.getMilliseconds() !== prevDate.getMilliseconds());
    };
    DateInput.prototype.getRelatedTarget = function (e) {
        var _a;
        // Support IE11 (#2924)
        return ((_a = e.relatedTarget) !== null && _a !== void 0 ? _a : document.activeElement);
    };
    /** safe wrapper around invoking input props event handler (prop defaults to undefined) */
    DateInput.prototype.safeInvokeInputProp = function (name, e) {
        var _a;
        var _b = this.props.inputProps, inputProps = _b === void 0 ? {} : _b;
        (_a = inputProps[name]) === null || _a === void 0 ? void 0 : _a.call(inputProps, e);
    };
    DateInput.prototype.parseDate = function (dateString) {
        if (dateString === this.props.outOfRangeMessage || dateString === this.props.invalidDateMessage) {
            return null;
        }
        var _a = this.props, locale = _a.locale, parseDate = _a.parseDate;
        var newDate = parseDate(dateString, locale);
        return newDate === false ? new Date(undefined) : newDate;
    };
    DateInput.prototype.formatDate = function (date) {
        if (!isDateValid(date) || !this.isDateInRange(date)) {
            return "";
        }
        var _a = this.props, locale = _a.locale, formatDate = _a.formatDate;
        return formatDate(date, locale);
    };
    DateInput.displayName = DISPLAYNAME_PREFIX + ".DateInput";
    DateInput.defaultProps = {
        closeOnSelection: true,
        dayPickerProps: {},
        disabled: false,
        invalidDateMessage: "Invalid date",
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        outOfRangeMessage: "Out of range",
        reverseMonthAndYearMenus: false,
    };
    return DateInput;
}(AbstractPureComponent2));

export { DateInput, TimePicker, TimePrecision };
