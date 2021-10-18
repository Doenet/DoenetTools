import { c as createCommonjsModule, g as getDefaultExportFromCjs } from '../common/_commonjsHelpers-b3efd043.js';
import { r as react } from '../common/index-61a7c514.js';
import { r as reactDom } from '../common/index-f174fb43.js';
import { _ as _objectWithoutPropertiesLoose, a as _extends } from '../common/setPrototypeOf-ac807fbe.js';
import { _ as _inheritsLoose } from '../common/inheritsLoose-90c3012b.js';
import '../common/index-01840a39.js';
import { i as index } from '../common/ResizeObserver.es-a52566ff.js';
import '../common/_polyfill-node:global-acbc543a.js';

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
var NS = "bp4";
if (typeof BLUEPRINT_NAMESPACE !== "undefined") {
    NS = BLUEPRINT_NAMESPACE;
}
else if (typeof REACT_APP_BLUEPRINT_NAMESPACE !== "undefined") {
    NS = REACT_APP_BLUEPRINT_NAMESPACE;
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
var MENU_ITEM_LABEL = MENU_ITEM + "-label";
var MENU_SUBMENU = NS + "-submenu";
var OVERLAY = NS + "-overlay";
var OVERLAY_BACKDROP = OVERLAY + "-backdrop";
var OVERLAY_CONTENT = OVERLAY + "-content";
var OVERLAY_INLINE = OVERLAY + "-inline";
var OVERLAY_OPEN = OVERLAY + "-open";
var POPOVER = NS + "-popover";
var POPOVER_ARROW = POPOVER + "-arrow";
var POPOVER_BACKDROP = POPOVER + "-backdrop";
var POPOVER_CAPTURING_DISMISS = POPOVER + "-capturing-dismiss";
var POPOVER_CONTENT = POPOVER + "-content";
var POPOVER_CONTENT_PLACEMENT = POPOVER + "-placement";
var POPOVER_DISMISS = POPOVER + "-dismiss";
var POPOVER_DISMISS_OVERRIDE = POPOVER_DISMISS + "-override";
var POPOVER_OPEN = POPOVER + "-open";
var POPOVER_TARGET = POPOVER + "-target";
var POPOVER_TRANSITION_CONTAINER = POPOVER + "-transition-container";
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
 * Customize this namespace at build time by defining it with `webpack.DefinePlugin`.
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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var POPOVER_REQUIRES_TARGET = ns + " <Popover> requires renderTarget prop or a child element.";
var POPOVER_HAS_BACKDROP_INTERACTION = ns + " <Popover hasBackdrop={true}> requires interactionKind=\"click\".";
var POPOVER_WARN_TOO_MANY_CHILDREN = ns + " <Popover> supports only one child which is rendered as its target; additional children are ignored.";
var POPOVER_WARN_DOUBLE_TARGET = ns + " <Popover> with children ignores renderTarget prop; use either prop or children.";
var POPOVER_WARN_EMPTY_CONTENT = ns + " Disabling <Popover> with empty/whitespace content...";
var POPOVER_WARN_HAS_BACKDROP_INLINE = ns + " <Popover usePortal={false}> ignores hasBackdrop";
var POPOVER_WARN_PLACEMENT_AND_POSITION_MUTEX = ns + " <Popover> supports either placement or position prop, not both.";
var POPOVER_WARN_UNCONTROLLED_ONINTERACTION = ns + " <Popover> onInteraction is ignored when uncontrolled.";
var PORTAL_CONTEXT_CLASS_NAME_STRING = ns + " <Portal> context blueprintPortalClassName must be string";
var SPINNER_WARN_CLASSES_SIZE = ns + " <Spinner> Classes.SMALL/LARGE are ignored if size prop is set.";

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
/** Returns whether bundler-injected variable `NODE_ENV` equals `env`. */
function isNodeEnv(env) {
    return typeof NODE_ENV !== "undefined" && NODE_ENV === env;
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
 * Utility for merging refs into one singular callback ref.
 * If using in a functional component, would recomend using `useMemo` to preserve function identity.
 */
function mergeRefs() {
    var refs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        refs[_i] = arguments[_i];
    }
    return function (value) {
        refs.forEach(function (ref) {
            setRef(ref, value);
        });
    };
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
var AbstractPureComponent = /** @class */ (function (_super) {
    __extends(AbstractPureComponent, _super);
    function AbstractPureComponent(props) {
        var _this = _super.call(this, props) || this;
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
    AbstractPureComponent.prototype.componentDidUpdate = function (_prevProps, _prevState, _snapshot) {
        if (!isNodeEnv("production")) {
            this.validateProps(this.props);
        }
    };
    AbstractPureComponent.prototype.componentWillUnmount = function () {
        this.clearTimeouts();
        this.cancelAnimationFrames();
    };
    /**
     * Request an animation frame and remember its ID.
     * All pending requests will be canceled when component unmounts.
     *
     * @returns a "cancel" function that will cancel the request when invoked.
     */
    AbstractPureComponent.prototype.requestAnimationFrame = function (callback) {
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
    AbstractPureComponent.prototype.setTimeout = function (callback, timeout) {
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
    AbstractPureComponent.prototype.validateProps = function (_props) {
        // implement in subclass
    };
    return AbstractPureComponent;
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
var DISPLAYNAME_PREFIX = "Blueprint3";
/** A collection of curated prop keys used across our Components which are not valid HTMLElement props. */
var INVALID_PROPS = [
    "active",
    "alignText",
    "asyncControl",
    "containerRef",
    "current",
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

var _a;
var BlueprintIcons_16;
(function (BlueprintIcons_16) {
    BlueprintIcons_16["AddColumnLeft"] = "add-column-left";
    BlueprintIcons_16["AddColumnRight"] = "add-column-right";
    BlueprintIcons_16["AddLocation"] = "add-location";
    BlueprintIcons_16["AddRowBottom"] = "add-row-bottom";
    BlueprintIcons_16["AddRowTop"] = "add-row-top";
    BlueprintIcons_16["AddToArtifact"] = "add-to-artifact";
    BlueprintIcons_16["AddToFolder"] = "add-to-folder";
    BlueprintIcons_16["Add"] = "add";
    BlueprintIcons_16["Airplane"] = "airplane";
    BlueprintIcons_16["AlignCenter"] = "align-center";
    BlueprintIcons_16["AlignJustify"] = "align-justify";
    BlueprintIcons_16["AlignLeft"] = "align-left";
    BlueprintIcons_16["AlignRight"] = "align-right";
    BlueprintIcons_16["AlignmentBottom"] = "alignment-bottom";
    BlueprintIcons_16["AlignmentHorizontalCenter"] = "alignment-horizontal-center";
    BlueprintIcons_16["AlignmentLeft"] = "alignment-left";
    BlueprintIcons_16["AlignmentRight"] = "alignment-right";
    BlueprintIcons_16["AlignmentTop"] = "alignment-top";
    BlueprintIcons_16["AlignmentVerticalCenter"] = "alignment-vertical-center";
    BlueprintIcons_16["Annotation"] = "annotation";
    BlueprintIcons_16["AppHeader"] = "app-header";
    BlueprintIcons_16["Application"] = "application";
    BlueprintIcons_16["Applications"] = "applications";
    BlueprintIcons_16["Archive"] = "archive";
    BlueprintIcons_16["ArrayBoolean"] = "array-boolean";
    BlueprintIcons_16["ArrayDate"] = "array-date";
    BlueprintIcons_16["ArrayNumeric"] = "array-numeric";
    BlueprintIcons_16["ArrayString"] = "array-string";
    BlueprintIcons_16["ArrayTimestamp"] = "array-timestamp";
    BlueprintIcons_16["Array"] = "array";
    BlueprintIcons_16["ArrowBottomLeft"] = "arrow-bottom-left";
    BlueprintIcons_16["ArrowBottomRight"] = "arrow-bottom-right";
    BlueprintIcons_16["ArrowDown"] = "arrow-down";
    BlueprintIcons_16["ArrowLeft"] = "arrow-left";
    BlueprintIcons_16["ArrowRight"] = "arrow-right";
    BlueprintIcons_16["ArrowTopLeft"] = "arrow-top-left";
    BlueprintIcons_16["ArrowTopRight"] = "arrow-top-right";
    BlueprintIcons_16["ArrowUp"] = "arrow-up";
    BlueprintIcons_16["ArrowsHorizontal"] = "arrows-horizontal";
    BlueprintIcons_16["ArrowsVertical"] = "arrows-vertical";
    BlueprintIcons_16["Asterisk"] = "asterisk";
    BlueprintIcons_16["AutomaticUpdates"] = "automatic-updates";
    BlueprintIcons_16["Backlink"] = "backlink";
    BlueprintIcons_16["Badge"] = "badge";
    BlueprintIcons_16["BanCircle"] = "ban-circle";
    BlueprintIcons_16["BankAccount"] = "bank-account";
    BlueprintIcons_16["Barcode"] = "barcode";
    BlueprintIcons_16["Blank"] = "blank";
    BlueprintIcons_16["BlockedPerson"] = "blocked-person";
    BlueprintIcons_16["Bold"] = "bold";
    BlueprintIcons_16["Book"] = "book";
    BlueprintIcons_16["Bookmark"] = "bookmark";
    BlueprintIcons_16["Box"] = "box";
    BlueprintIcons_16["Briefcase"] = "briefcase";
    BlueprintIcons_16["BringData"] = "bring-data";
    BlueprintIcons_16["Build"] = "build";
    BlueprintIcons_16["Calculator"] = "calculator";
    BlueprintIcons_16["Calendar"] = "calendar";
    BlueprintIcons_16["Camera"] = "camera";
    BlueprintIcons_16["CaretDown"] = "caret-down";
    BlueprintIcons_16["CaretLeft"] = "caret-left";
    BlueprintIcons_16["CaretRight"] = "caret-right";
    BlueprintIcons_16["CaretUp"] = "caret-up";
    BlueprintIcons_16["CellTower"] = "cell-tower";
    BlueprintIcons_16["Changes"] = "changes";
    BlueprintIcons_16["Chart"] = "chart";
    BlueprintIcons_16["Chat"] = "chat";
    BlueprintIcons_16["ChevronBackward"] = "chevron-backward";
    BlueprintIcons_16["ChevronDown"] = "chevron-down";
    BlueprintIcons_16["ChevronForward"] = "chevron-forward";
    BlueprintIcons_16["ChevronLeft"] = "chevron-left";
    BlueprintIcons_16["ChevronRight"] = "chevron-right";
    BlueprintIcons_16["ChevronUp"] = "chevron-up";
    BlueprintIcons_16["CircleArrowDown"] = "circle-arrow-down";
    BlueprintIcons_16["CircleArrowLeft"] = "circle-arrow-left";
    BlueprintIcons_16["CircleArrowRight"] = "circle-arrow-right";
    BlueprintIcons_16["CircleArrowUp"] = "circle-arrow-up";
    BlueprintIcons_16["Circle"] = "circle";
    BlueprintIcons_16["Citation"] = "citation";
    BlueprintIcons_16["Clean"] = "clean";
    BlueprintIcons_16["Clipboard"] = "clipboard";
    BlueprintIcons_16["CloudDownload"] = "cloud-download";
    BlueprintIcons_16["CloudUpload"] = "cloud-upload";
    BlueprintIcons_16["Cloud"] = "cloud";
    BlueprintIcons_16["CodeBlock"] = "code-block";
    BlueprintIcons_16["Code"] = "code";
    BlueprintIcons_16["Cog"] = "cog";
    BlueprintIcons_16["CollapseAll"] = "collapse-all";
    BlueprintIcons_16["ColumnLayout"] = "column-layout";
    BlueprintIcons_16["Comment"] = "comment";
    BlueprintIcons_16["Comparison"] = "comparison";
    BlueprintIcons_16["Compass"] = "compass";
    BlueprintIcons_16["Compressed"] = "compressed";
    BlueprintIcons_16["Confirm"] = "confirm";
    BlueprintIcons_16["Console"] = "console";
    BlueprintIcons_16["Contrast"] = "contrast";
    BlueprintIcons_16["Control"] = "control";
    BlueprintIcons_16["CreditCard"] = "credit-card";
    BlueprintIcons_16["Cross"] = "cross";
    BlueprintIcons_16["Crown"] = "crown";
    BlueprintIcons_16["CubeAdd"] = "cube-add";
    BlueprintIcons_16["CubeRemove"] = "cube-remove";
    BlueprintIcons_16["Cube"] = "cube";
    BlueprintIcons_16["CurvedRangeChart"] = "curved-range-chart";
    BlueprintIcons_16["Cut"] = "cut";
    BlueprintIcons_16["Cycle"] = "cycle";
    BlueprintIcons_16["Dashboard"] = "dashboard";
    BlueprintIcons_16["DataConnection"] = "data-connection";
    BlueprintIcons_16["DataLineage"] = "data-lineage";
    BlueprintIcons_16["Database"] = "database";
    BlueprintIcons_16["Delete"] = "delete";
    BlueprintIcons_16["Delta"] = "delta";
    BlueprintIcons_16["DeriveColumn"] = "derive-column";
    BlueprintIcons_16["Desktop"] = "desktop";
    BlueprintIcons_16["Diagnosis"] = "diagnosis";
    BlueprintIcons_16["DiagramTree"] = "diagram-tree";
    BlueprintIcons_16["DirectionLeft"] = "direction-left";
    BlueprintIcons_16["DirectionRight"] = "direction-right";
    BlueprintIcons_16["Disable"] = "disable";
    BlueprintIcons_16["DocumentOpen"] = "document-open";
    BlueprintIcons_16["DocumentShare"] = "document-share";
    BlueprintIcons_16["Document"] = "document";
    BlueprintIcons_16["Dollar"] = "dollar";
    BlueprintIcons_16["Dot"] = "dot";
    BlueprintIcons_16["DoubleCaretHorizontal"] = "double-caret-horizontal";
    BlueprintIcons_16["DoubleCaretVertical"] = "double-caret-vertical";
    BlueprintIcons_16["DoubleChevronDown"] = "double-chevron-down";
    BlueprintIcons_16["DoubleChevronLeft"] = "double-chevron-left";
    BlueprintIcons_16["DoubleChevronRight"] = "double-chevron-right";
    BlueprintIcons_16["DoubleChevronUp"] = "double-chevron-up";
    BlueprintIcons_16["DoughnutChart"] = "doughnut-chart";
    BlueprintIcons_16["Download"] = "download";
    BlueprintIcons_16["DragHandleHorizontal"] = "drag-handle-horizontal";
    BlueprintIcons_16["DragHandleVertical"] = "drag-handle-vertical";
    BlueprintIcons_16["Draw"] = "draw";
    BlueprintIcons_16["DrawerLeftFilled"] = "drawer-left-filled";
    BlueprintIcons_16["DrawerLeft"] = "drawer-left";
    BlueprintIcons_16["DrawerRightFilled"] = "drawer-right-filled";
    BlueprintIcons_16["DrawerRight"] = "drawer-right";
    BlueprintIcons_16["DriveTime"] = "drive-time";
    BlueprintIcons_16["Duplicate"] = "duplicate";
    BlueprintIcons_16["Edit"] = "edit";
    BlueprintIcons_16["Eject"] = "eject";
    BlueprintIcons_16["Emoji"] = "emoji";
    BlueprintIcons_16["Endorsed"] = "endorsed";
    BlueprintIcons_16["Envelope"] = "envelope";
    BlueprintIcons_16["Equals"] = "equals";
    BlueprintIcons_16["Eraser"] = "eraser";
    BlueprintIcons_16["Error"] = "error";
    BlueprintIcons_16["Euro"] = "euro";
    BlueprintIcons_16["Exchange"] = "exchange";
    BlueprintIcons_16["ExcludeRow"] = "exclude-row";
    BlueprintIcons_16["ExpandAll"] = "expand-all";
    BlueprintIcons_16["Export"] = "export";
    BlueprintIcons_16["EyeOff"] = "eye-off";
    BlueprintIcons_16["EyeOn"] = "eye-on";
    BlueprintIcons_16["EyeOpen"] = "eye-open";
    BlueprintIcons_16["FastBackward"] = "fast-backward";
    BlueprintIcons_16["FastForward"] = "fast-forward";
    BlueprintIcons_16["FeedSubscribed"] = "feed-subscribed";
    BlueprintIcons_16["Feed"] = "feed";
    BlueprintIcons_16["Film"] = "film";
    BlueprintIcons_16["FilterKeep"] = "filter-keep";
    BlueprintIcons_16["FilterList"] = "filter-list";
    BlueprintIcons_16["FilterOpen"] = "filter-open";
    BlueprintIcons_16["FilterRemove"] = "filter-remove";
    BlueprintIcons_16["Filter"] = "filter";
    BlueprintIcons_16["Flag"] = "flag";
    BlueprintIcons_16["Flame"] = "flame";
    BlueprintIcons_16["Flash"] = "flash";
    BlueprintIcons_16["FloppyDisk"] = "floppy-disk";
    BlueprintIcons_16["FlowBranch"] = "flow-branch";
    BlueprintIcons_16["FlowEnd"] = "flow-end";
    BlueprintIcons_16["FlowLinear"] = "flow-linear";
    BlueprintIcons_16["FlowReviewBranch"] = "flow-review-branch";
    BlueprintIcons_16["FlowReview"] = "flow-review";
    BlueprintIcons_16["Flows"] = "flows";
    BlueprintIcons_16["FolderClose"] = "folder-close";
    BlueprintIcons_16["FolderNew"] = "folder-new";
    BlueprintIcons_16["FolderOpen"] = "folder-open";
    BlueprintIcons_16["FolderSharedOpen"] = "folder-shared-open";
    BlueprintIcons_16["FolderShared"] = "folder-shared";
    BlueprintIcons_16["Follower"] = "follower";
    BlueprintIcons_16["Following"] = "following";
    BlueprintIcons_16["Font"] = "font";
    BlueprintIcons_16["Fork"] = "fork";
    BlueprintIcons_16["Form"] = "form";
    BlueprintIcons_16["FullCircle"] = "full-circle";
    BlueprintIcons_16["FullStackedChart"] = "full-stacked-chart";
    BlueprintIcons_16["Fullscreen"] = "fullscreen";
    BlueprintIcons_16["Function"] = "function";
    BlueprintIcons_16["GanttChart"] = "gantt-chart";
    BlueprintIcons_16["Geofence"] = "geofence";
    BlueprintIcons_16["Geolocation"] = "geolocation";
    BlueprintIcons_16["Geosearch"] = "geosearch";
    BlueprintIcons_16["GitBranch"] = "git-branch";
    BlueprintIcons_16["GitCommit"] = "git-commit";
    BlueprintIcons_16["GitMerge"] = "git-merge";
    BlueprintIcons_16["GitNewBranch"] = "git-new-branch";
    BlueprintIcons_16["GitPull"] = "git-pull";
    BlueprintIcons_16["GitPush"] = "git-push";
    BlueprintIcons_16["GitRepo"] = "git-repo";
    BlueprintIcons_16["Glass"] = "glass";
    BlueprintIcons_16["GlobeNetwork"] = "globe-network";
    BlueprintIcons_16["Globe"] = "globe";
    BlueprintIcons_16["GraphRemove"] = "graph-remove";
    BlueprintIcons_16["Graph"] = "graph";
    BlueprintIcons_16["GreaterThanOrEqualTo"] = "greater-than-or-equal-to";
    BlueprintIcons_16["GreaterThan"] = "greater-than";
    BlueprintIcons_16["GridView"] = "grid-view";
    BlueprintIcons_16["Grid"] = "grid";
    BlueprintIcons_16["GroupObjects"] = "group-objects";
    BlueprintIcons_16["GroupedBarChart"] = "grouped-bar-chart";
    BlueprintIcons_16["HandDown"] = "hand-down";
    BlueprintIcons_16["HandLeft"] = "hand-left";
    BlueprintIcons_16["HandRight"] = "hand-right";
    BlueprintIcons_16["HandUp"] = "hand-up";
    BlueprintIcons_16["Hand"] = "hand";
    BlueprintIcons_16["Hat"] = "hat";
    BlueprintIcons_16["HeaderOne"] = "header-one";
    BlueprintIcons_16["HeaderTwo"] = "header-two";
    BlueprintIcons_16["Header"] = "header";
    BlueprintIcons_16["Headset"] = "headset";
    BlueprintIcons_16["HeartBroken"] = "heart-broken";
    BlueprintIcons_16["Heart"] = "heart";
    BlueprintIcons_16["HeatGrid"] = "heat-grid";
    BlueprintIcons_16["Heatmap"] = "heatmap";
    BlueprintIcons_16["Help"] = "help";
    BlueprintIcons_16["HelperManagement"] = "helper-management";
    BlueprintIcons_16["HighPriority"] = "high-priority";
    BlueprintIcons_16["Highlight"] = "highlight";
    BlueprintIcons_16["History"] = "history";
    BlueprintIcons_16["Home"] = "home";
    BlueprintIcons_16["HorizontalBarChartAsc"] = "horizontal-bar-chart-asc";
    BlueprintIcons_16["HorizontalBarChartDesc"] = "horizontal-bar-chart-desc";
    BlueprintIcons_16["HorizontalBarChart"] = "horizontal-bar-chart";
    BlueprintIcons_16["HorizontalDistribution"] = "horizontal-distribution";
    BlueprintIcons_16["IdNumber"] = "id-number";
    BlueprintIcons_16["ImageRotateLeft"] = "image-rotate-left";
    BlueprintIcons_16["ImageRotateRight"] = "image-rotate-right";
    BlueprintIcons_16["Import"] = "import";
    BlueprintIcons_16["InboxFiltered"] = "inbox-filtered";
    BlueprintIcons_16["InboxGeo"] = "inbox-geo";
    BlueprintIcons_16["InboxSearch"] = "inbox-search";
    BlueprintIcons_16["InboxUpdate"] = "inbox-update";
    BlueprintIcons_16["Inbox"] = "inbox";
    BlueprintIcons_16["InfoSign"] = "info-sign";
    BlueprintIcons_16["Inheritance"] = "inheritance";
    BlueprintIcons_16["InheritedGroup"] = "inherited-group";
    BlueprintIcons_16["InnerJoin"] = "inner-join";
    BlueprintIcons_16["Insert"] = "insert";
    BlueprintIcons_16["Intersection"] = "intersection";
    BlueprintIcons_16["IpAddress"] = "ip-address";
    BlueprintIcons_16["IssueClosed"] = "issue-closed";
    BlueprintIcons_16["IssueNew"] = "issue-new";
    BlueprintIcons_16["Issue"] = "issue";
    BlueprintIcons_16["Italic"] = "italic";
    BlueprintIcons_16["JoinTable"] = "join-table";
    BlueprintIcons_16["KeyBackspace"] = "key-backspace";
    BlueprintIcons_16["KeyCommand"] = "key-command";
    BlueprintIcons_16["KeyControl"] = "key-control";
    BlueprintIcons_16["KeyDelete"] = "key-delete";
    BlueprintIcons_16["KeyEnter"] = "key-enter";
    BlueprintIcons_16["KeyEscape"] = "key-escape";
    BlueprintIcons_16["KeyOption"] = "key-option";
    BlueprintIcons_16["KeyShift"] = "key-shift";
    BlueprintIcons_16["KeyTab"] = "key-tab";
    BlueprintIcons_16["Key"] = "key";
    BlueprintIcons_16["KnownVehicle"] = "known-vehicle";
    BlueprintIcons_16["LabTest"] = "lab-test";
    BlueprintIcons_16["Label"] = "label";
    BlueprintIcons_16["LayerOutline"] = "layer-outline";
    BlueprintIcons_16["Layer"] = "layer";
    BlueprintIcons_16["Layers"] = "layers";
    BlueprintIcons_16["LayoutAuto"] = "layout-auto";
    BlueprintIcons_16["LayoutBalloon"] = "layout-balloon";
    BlueprintIcons_16["LayoutCircle"] = "layout-circle";
    BlueprintIcons_16["LayoutGrid"] = "layout-grid";
    BlueprintIcons_16["LayoutGroupBy"] = "layout-group-by";
    BlueprintIcons_16["LayoutHierarchy"] = "layout-hierarchy";
    BlueprintIcons_16["LayoutLinear"] = "layout-linear";
    BlueprintIcons_16["LayoutSkewGrid"] = "layout-skew-grid";
    BlueprintIcons_16["LayoutSortedClusters"] = "layout-sorted-clusters";
    BlueprintIcons_16["Layout"] = "layout";
    BlueprintIcons_16["Learning"] = "learning";
    BlueprintIcons_16["LeftJoin"] = "left-join";
    BlueprintIcons_16["LessThanOrEqualTo"] = "less-than-or-equal-to";
    BlueprintIcons_16["LessThan"] = "less-than";
    BlueprintIcons_16["Lifesaver"] = "lifesaver";
    BlueprintIcons_16["Lightbulb"] = "lightbulb";
    BlueprintIcons_16["Link"] = "link";
    BlueprintIcons_16["ListColumns"] = "list-columns";
    BlueprintIcons_16["ListDetailView"] = "list-detail-view";
    BlueprintIcons_16["List"] = "list";
    BlueprintIcons_16["Locate"] = "locate";
    BlueprintIcons_16["Lock"] = "lock";
    BlueprintIcons_16["LogIn"] = "log-in";
    BlueprintIcons_16["LogOut"] = "log-out";
    BlueprintIcons_16["Manual"] = "manual";
    BlueprintIcons_16["ManuallyEnteredData"] = "manually-entered-data";
    BlueprintIcons_16["MapCreate"] = "map-create";
    BlueprintIcons_16["MapMarker"] = "map-marker";
    BlueprintIcons_16["Map"] = "map";
    BlueprintIcons_16["Maximize"] = "maximize";
    BlueprintIcons_16["Media"] = "media";
    BlueprintIcons_16["MenuClosed"] = "menu-closed";
    BlueprintIcons_16["MenuOpen"] = "menu-open";
    BlueprintIcons_16["Menu"] = "menu";
    BlueprintIcons_16["MergeColumns"] = "merge-columns";
    BlueprintIcons_16["MergeLinks"] = "merge-links";
    BlueprintIcons_16["Minimize"] = "minimize";
    BlueprintIcons_16["Minus"] = "minus";
    BlueprintIcons_16["MobilePhone"] = "mobile-phone";
    BlueprintIcons_16["MobileVideo"] = "mobile-video";
    BlueprintIcons_16["ModalFilled"] = "modal-filled";
    BlueprintIcons_16["Modal"] = "modal";
    BlueprintIcons_16["Moon"] = "moon";
    BlueprintIcons_16["More"] = "more";
    BlueprintIcons_16["Mountain"] = "mountain";
    BlueprintIcons_16["Move"] = "move";
    BlueprintIcons_16["Mugshot"] = "mugshot";
    BlueprintIcons_16["MultiSelect"] = "multi-select";
    BlueprintIcons_16["Music"] = "music";
    BlueprintIcons_16["NewDrawing"] = "new-drawing";
    BlueprintIcons_16["NewGridItem"] = "new-grid-item";
    BlueprintIcons_16["NewLayer"] = "new-layer";
    BlueprintIcons_16["NewLayers"] = "new-layers";
    BlueprintIcons_16["NewLink"] = "new-link";
    BlueprintIcons_16["NewObject"] = "new-object";
    BlueprintIcons_16["NewPerson"] = "new-person";
    BlueprintIcons_16["NewPrescription"] = "new-prescription";
    BlueprintIcons_16["NewTextBox"] = "new-text-box";
    BlueprintIcons_16["Ninja"] = "ninja";
    BlueprintIcons_16["NotEqualTo"] = "not-equal-to";
    BlueprintIcons_16["NotificationsSnooze"] = "notifications-snooze";
    BlueprintIcons_16["NotificationsUpdated"] = "notifications-updated";
    BlueprintIcons_16["Notifications"] = "notifications";
    BlueprintIcons_16["NumberedList"] = "numbered-list";
    BlueprintIcons_16["Numerical"] = "numerical";
    BlueprintIcons_16["Office"] = "office";
    BlueprintIcons_16["Offline"] = "offline";
    BlueprintIcons_16["OilField"] = "oil-field";
    BlueprintIcons_16["OneColumn"] = "one-column";
    BlueprintIcons_16["Outdated"] = "outdated";
    BlueprintIcons_16["PageLayout"] = "page-layout";
    BlueprintIcons_16["PanelStats"] = "panel-stats";
    BlueprintIcons_16["PanelTable"] = "panel-table";
    BlueprintIcons_16["Paperclip"] = "paperclip";
    BlueprintIcons_16["Paragraph"] = "paragraph";
    BlueprintIcons_16["PathSearch"] = "path-search";
    BlueprintIcons_16["Path"] = "path";
    BlueprintIcons_16["Pause"] = "pause";
    BlueprintIcons_16["People"] = "people";
    BlueprintIcons_16["Percentage"] = "percentage";
    BlueprintIcons_16["Person"] = "person";
    BlueprintIcons_16["Phone"] = "phone";
    BlueprintIcons_16["PieChart"] = "pie-chart";
    BlueprintIcons_16["Pin"] = "pin";
    BlueprintIcons_16["PivotTable"] = "pivot-table";
    BlueprintIcons_16["Pivot"] = "pivot";
    BlueprintIcons_16["Play"] = "play";
    BlueprintIcons_16["Plus"] = "plus";
    BlueprintIcons_16["PolygonFilter"] = "polygon-filter";
    BlueprintIcons_16["Power"] = "power";
    BlueprintIcons_16["PredictiveAnalysis"] = "predictive-analysis";
    BlueprintIcons_16["Prescription"] = "prescription";
    BlueprintIcons_16["Presentation"] = "presentation";
    BlueprintIcons_16["Print"] = "print";
    BlueprintIcons_16["Projects"] = "projects";
    BlueprintIcons_16["Properties"] = "properties";
    BlueprintIcons_16["Property"] = "property";
    BlueprintIcons_16["PublishFunction"] = "publish-function";
    BlueprintIcons_16["Pulse"] = "pulse";
    BlueprintIcons_16["Random"] = "random";
    BlueprintIcons_16["Record"] = "record";
    BlueprintIcons_16["Redo"] = "redo";
    BlueprintIcons_16["Refresh"] = "refresh";
    BlueprintIcons_16["RegressionChart"] = "regression-chart";
    BlueprintIcons_16["RemoveColumnLeft"] = "remove-column-left";
    BlueprintIcons_16["RemoveColumnRight"] = "remove-column-right";
    BlueprintIcons_16["RemoveColumn"] = "remove-column";
    BlueprintIcons_16["RemoveRowBottom"] = "remove-row-bottom";
    BlueprintIcons_16["RemoveRowTop"] = "remove-row-top";
    BlueprintIcons_16["Remove"] = "remove";
    BlueprintIcons_16["Repeat"] = "repeat";
    BlueprintIcons_16["Reset"] = "reset";
    BlueprintIcons_16["Resolve"] = "resolve";
    BlueprintIcons_16["Rig"] = "rig";
    BlueprintIcons_16["RightJoin"] = "right-join";
    BlueprintIcons_16["Ring"] = "ring";
    BlueprintIcons_16["RotateDocument"] = "rotate-document";
    BlueprintIcons_16["RotatePage"] = "rotate-page";
    BlueprintIcons_16["Route"] = "route";
    BlueprintIcons_16["Satellite"] = "satellite";
    BlueprintIcons_16["Saved"] = "saved";
    BlueprintIcons_16["ScatterPlot"] = "scatter-plot";
    BlueprintIcons_16["SearchAround"] = "search-around";
    BlueprintIcons_16["SearchTemplate"] = "search-template";
    BlueprintIcons_16["SearchText"] = "search-text";
    BlueprintIcons_16["Search"] = "search";
    BlueprintIcons_16["SegmentedControl"] = "segmented-control";
    BlueprintIcons_16["Select"] = "select";
    BlueprintIcons_16["Selection"] = "selection";
    BlueprintIcons_16["SendMessage"] = "send-message";
    BlueprintIcons_16["SendToGraph"] = "send-to-graph";
    BlueprintIcons_16["SendToMap"] = "send-to-map";
    BlueprintIcons_16["SendTo"] = "send-to";
    BlueprintIcons_16["SeriesAdd"] = "series-add";
    BlueprintIcons_16["SeriesConfiguration"] = "series-configuration";
    BlueprintIcons_16["SeriesDerived"] = "series-derived";
    BlueprintIcons_16["SeriesFiltered"] = "series-filtered";
    BlueprintIcons_16["SeriesSearch"] = "series-search";
    BlueprintIcons_16["Settings"] = "settings";
    BlueprintIcons_16["Shapes"] = "shapes";
    BlueprintIcons_16["Share"] = "share";
    BlueprintIcons_16["SharedFilter"] = "shared-filter";
    BlueprintIcons_16["Shield"] = "shield";
    BlueprintIcons_16["Shop"] = "shop";
    BlueprintIcons_16["ShoppingCart"] = "shopping-cart";
    BlueprintIcons_16["SignalSearch"] = "signal-search";
    BlueprintIcons_16["SimCard"] = "sim-card";
    BlueprintIcons_16["Slash"] = "slash";
    BlueprintIcons_16["SmallCross"] = "small-cross";
    BlueprintIcons_16["SmallMinus"] = "small-minus";
    BlueprintIcons_16["SmallPlus"] = "small-plus";
    BlueprintIcons_16["SmallTick"] = "small-tick";
    BlueprintIcons_16["Snowflake"] = "snowflake";
    BlueprintIcons_16["SocialMedia"] = "social-media";
    BlueprintIcons_16["SortAlphabeticalDesc"] = "sort-alphabetical-desc";
    BlueprintIcons_16["SortAlphabetical"] = "sort-alphabetical";
    BlueprintIcons_16["SortAsc"] = "sort-asc";
    BlueprintIcons_16["SortDesc"] = "sort-desc";
    BlueprintIcons_16["SortNumericalDesc"] = "sort-numerical-desc";
    BlueprintIcons_16["SortNumerical"] = "sort-numerical";
    BlueprintIcons_16["Sort"] = "sort";
    BlueprintIcons_16["SplitColumns"] = "split-columns";
    BlueprintIcons_16["Square"] = "square";
    BlueprintIcons_16["StackedChart"] = "stacked-chart";
    BlueprintIcons_16["StarEmpty"] = "star-empty";
    BlueprintIcons_16["Star"] = "star";
    BlueprintIcons_16["StepBackward"] = "step-backward";
    BlueprintIcons_16["StepChart"] = "step-chart";
    BlueprintIcons_16["StepForward"] = "step-forward";
    BlueprintIcons_16["Stop"] = "stop";
    BlueprintIcons_16["Stopwatch"] = "stopwatch";
    BlueprintIcons_16["Strikethrough"] = "strikethrough";
    BlueprintIcons_16["Style"] = "style";
    BlueprintIcons_16["SwapHorizontal"] = "swap-horizontal";
    BlueprintIcons_16["SwapVertical"] = "swap-vertical";
    BlueprintIcons_16["Switch"] = "switch";
    BlueprintIcons_16["SymbolCircle"] = "symbol-circle";
    BlueprintIcons_16["SymbolCross"] = "symbol-cross";
    BlueprintIcons_16["SymbolDiamond"] = "symbol-diamond";
    BlueprintIcons_16["SymbolSquare"] = "symbol-square";
    BlueprintIcons_16["SymbolTriangleDown"] = "symbol-triangle-down";
    BlueprintIcons_16["SymbolTriangleUp"] = "symbol-triangle-up";
    BlueprintIcons_16["Tag"] = "tag";
    BlueprintIcons_16["TakeAction"] = "take-action";
    BlueprintIcons_16["Taxi"] = "taxi";
    BlueprintIcons_16["TextHighlight"] = "text-highlight";
    BlueprintIcons_16["ThDerived"] = "th-derived";
    BlueprintIcons_16["ThDisconnect"] = "th-disconnect";
    BlueprintIcons_16["ThFiltered"] = "th-filtered";
    BlueprintIcons_16["ThList"] = "th-list";
    BlueprintIcons_16["Th"] = "th";
    BlueprintIcons_16["ThumbsDown"] = "thumbs-down";
    BlueprintIcons_16["ThumbsUp"] = "thumbs-up";
    BlueprintIcons_16["TickCircle"] = "tick-circle";
    BlueprintIcons_16["Tick"] = "tick";
    BlueprintIcons_16["Time"] = "time";
    BlueprintIcons_16["TimelineAreaChart"] = "timeline-area-chart";
    BlueprintIcons_16["TimelineBarChart"] = "timeline-bar-chart";
    BlueprintIcons_16["TimelineEvents"] = "timeline-events";
    BlueprintIcons_16["TimelineLineChart"] = "timeline-line-chart";
    BlueprintIcons_16["Tint"] = "tint";
    BlueprintIcons_16["Torch"] = "torch";
    BlueprintIcons_16["Tractor"] = "tractor";
    BlueprintIcons_16["Train"] = "train";
    BlueprintIcons_16["Translate"] = "translate";
    BlueprintIcons_16["Trash"] = "trash";
    BlueprintIcons_16["Tree"] = "tree";
    BlueprintIcons_16["TrendingDown"] = "trending-down";
    BlueprintIcons_16["TrendingUp"] = "trending-up";
    BlueprintIcons_16["Truck"] = "truck";
    BlueprintIcons_16["TwoColumns"] = "two-columns";
    BlueprintIcons_16["Unarchive"] = "unarchive";
    BlueprintIcons_16["Underline"] = "underline";
    BlueprintIcons_16["Undo"] = "undo";
    BlueprintIcons_16["UngroupObjects"] = "ungroup-objects";
    BlueprintIcons_16["UnknownVehicle"] = "unknown-vehicle";
    BlueprintIcons_16["Unlock"] = "unlock";
    BlueprintIcons_16["Unpin"] = "unpin";
    BlueprintIcons_16["Unresolve"] = "unresolve";
    BlueprintIcons_16["Updated"] = "updated";
    BlueprintIcons_16["Upload"] = "upload";
    BlueprintIcons_16["User"] = "user";
    BlueprintIcons_16["Variable"] = "variable";
    BlueprintIcons_16["VerticalBarChartAsc"] = "vertical-bar-chart-asc";
    BlueprintIcons_16["VerticalBarChartDesc"] = "vertical-bar-chart-desc";
    BlueprintIcons_16["VerticalDistribution"] = "vertical-distribution";
    BlueprintIcons_16["Video"] = "video";
    BlueprintIcons_16["Virus"] = "virus";
    BlueprintIcons_16["VolumeDown"] = "volume-down";
    BlueprintIcons_16["VolumeOff"] = "volume-off";
    BlueprintIcons_16["VolumeUp"] = "volume-up";
    BlueprintIcons_16["Walk"] = "walk";
    BlueprintIcons_16["WarningSign"] = "warning-sign";
    BlueprintIcons_16["WaterfallChart"] = "waterfall-chart";
    BlueprintIcons_16["WidgetButton"] = "widget-button";
    BlueprintIcons_16["WidgetFooter"] = "widget-footer";
    BlueprintIcons_16["WidgetHeader"] = "widget-header";
    BlueprintIcons_16["Widget"] = "widget";
    BlueprintIcons_16["Wrench"] = "wrench";
    BlueprintIcons_16["ZoomIn"] = "zoom-in";
    BlueprintIcons_16["ZoomOut"] = "zoom-out";
    BlueprintIcons_16["ZoomToFit"] = "zoom-to-fit";
})(BlueprintIcons_16 || (BlueprintIcons_16 = {}));
var BLUEPRINT_ICONS_16_CODEPOINTS = (_a = {},
    _a[BlueprintIcons_16.AddColumnLeft] = "61697",
    _a[BlueprintIcons_16.AddColumnRight] = "61698",
    _a[BlueprintIcons_16.AddLocation] = "61699",
    _a[BlueprintIcons_16.AddRowBottom] = "61700",
    _a[BlueprintIcons_16.AddRowTop] = "61701",
    _a[BlueprintIcons_16.AddToArtifact] = "61702",
    _a[BlueprintIcons_16.AddToFolder] = "61703",
    _a[BlueprintIcons_16.Add] = "61704",
    _a[BlueprintIcons_16.Airplane] = "61705",
    _a[BlueprintIcons_16.AlignCenter] = "61706",
    _a[BlueprintIcons_16.AlignJustify] = "61707",
    _a[BlueprintIcons_16.AlignLeft] = "61708",
    _a[BlueprintIcons_16.AlignRight] = "61709",
    _a[BlueprintIcons_16.AlignmentBottom] = "61710",
    _a[BlueprintIcons_16.AlignmentHorizontalCenter] = "61711",
    _a[BlueprintIcons_16.AlignmentLeft] = "61712",
    _a[BlueprintIcons_16.AlignmentRight] = "61713",
    _a[BlueprintIcons_16.AlignmentTop] = "61714",
    _a[BlueprintIcons_16.AlignmentVerticalCenter] = "61715",
    _a[BlueprintIcons_16.Annotation] = "61716",
    _a[BlueprintIcons_16.AppHeader] = "61717",
    _a[BlueprintIcons_16.Application] = "61718",
    _a[BlueprintIcons_16.Applications] = "61719",
    _a[BlueprintIcons_16.Archive] = "61720",
    _a[BlueprintIcons_16.ArrayBoolean] = "61721",
    _a[BlueprintIcons_16.ArrayDate] = "61722",
    _a[BlueprintIcons_16.ArrayNumeric] = "61723",
    _a[BlueprintIcons_16.ArrayString] = "61724",
    _a[BlueprintIcons_16.ArrayTimestamp] = "61725",
    _a[BlueprintIcons_16.Array] = "61726",
    _a[BlueprintIcons_16.ArrowBottomLeft] = "61727",
    _a[BlueprintIcons_16.ArrowBottomRight] = "61728",
    _a[BlueprintIcons_16.ArrowDown] = "61729",
    _a[BlueprintIcons_16.ArrowLeft] = "61730",
    _a[BlueprintIcons_16.ArrowRight] = "61731",
    _a[BlueprintIcons_16.ArrowTopLeft] = "61732",
    _a[BlueprintIcons_16.ArrowTopRight] = "61733",
    _a[BlueprintIcons_16.ArrowUp] = "61734",
    _a[BlueprintIcons_16.ArrowsHorizontal] = "61735",
    _a[BlueprintIcons_16.ArrowsVertical] = "61736",
    _a[BlueprintIcons_16.Asterisk] = "61737",
    _a[BlueprintIcons_16.AutomaticUpdates] = "61738",
    _a[BlueprintIcons_16.Backlink] = "61739",
    _a[BlueprintIcons_16.Badge] = "61740",
    _a[BlueprintIcons_16.BanCircle] = "61741",
    _a[BlueprintIcons_16.BankAccount] = "61742",
    _a[BlueprintIcons_16.Barcode] = "61743",
    _a[BlueprintIcons_16.Blank] = "61744",
    _a[BlueprintIcons_16.BlockedPerson] = "61745",
    _a[BlueprintIcons_16.Bold] = "61746",
    _a[BlueprintIcons_16.Book] = "61747",
    _a[BlueprintIcons_16.Bookmark] = "61748",
    _a[BlueprintIcons_16.Box] = "61749",
    _a[BlueprintIcons_16.Briefcase] = "61750",
    _a[BlueprintIcons_16.BringData] = "61751",
    _a[BlueprintIcons_16.Build] = "61752",
    _a[BlueprintIcons_16.Calculator] = "61753",
    _a[BlueprintIcons_16.Calendar] = "61754",
    _a[BlueprintIcons_16.Camera] = "61755",
    _a[BlueprintIcons_16.CaretDown] = "61756",
    _a[BlueprintIcons_16.CaretLeft] = "61757",
    _a[BlueprintIcons_16.CaretRight] = "61758",
    _a[BlueprintIcons_16.CaretUp] = "61759",
    _a[BlueprintIcons_16.CellTower] = "61760",
    _a[BlueprintIcons_16.Changes] = "61761",
    _a[BlueprintIcons_16.Chart] = "61762",
    _a[BlueprintIcons_16.Chat] = "61763",
    _a[BlueprintIcons_16.ChevronBackward] = "61764",
    _a[BlueprintIcons_16.ChevronDown] = "61765",
    _a[BlueprintIcons_16.ChevronForward] = "61766",
    _a[BlueprintIcons_16.ChevronLeft] = "61767",
    _a[BlueprintIcons_16.ChevronRight] = "61768",
    _a[BlueprintIcons_16.ChevronUp] = "61769",
    _a[BlueprintIcons_16.CircleArrowDown] = "61770",
    _a[BlueprintIcons_16.CircleArrowLeft] = "61771",
    _a[BlueprintIcons_16.CircleArrowRight] = "61772",
    _a[BlueprintIcons_16.CircleArrowUp] = "61773",
    _a[BlueprintIcons_16.Circle] = "61774",
    _a[BlueprintIcons_16.Citation] = "61775",
    _a[BlueprintIcons_16.Clean] = "61776",
    _a[BlueprintIcons_16.Clipboard] = "61777",
    _a[BlueprintIcons_16.CloudDownload] = "61778",
    _a[BlueprintIcons_16.CloudUpload] = "61779",
    _a[BlueprintIcons_16.Cloud] = "61780",
    _a[BlueprintIcons_16.CodeBlock] = "61781",
    _a[BlueprintIcons_16.Code] = "61782",
    _a[BlueprintIcons_16.Cog] = "61783",
    _a[BlueprintIcons_16.CollapseAll] = "61784",
    _a[BlueprintIcons_16.ColumnLayout] = "61785",
    _a[BlueprintIcons_16.Comment] = "61786",
    _a[BlueprintIcons_16.Comparison] = "61787",
    _a[BlueprintIcons_16.Compass] = "61788",
    _a[BlueprintIcons_16.Compressed] = "61789",
    _a[BlueprintIcons_16.Confirm] = "61790",
    _a[BlueprintIcons_16.Console] = "61791",
    _a[BlueprintIcons_16.Contrast] = "61792",
    _a[BlueprintIcons_16.Control] = "61793",
    _a[BlueprintIcons_16.CreditCard] = "61794",
    _a[BlueprintIcons_16.Cross] = "61795",
    _a[BlueprintIcons_16.Crown] = "61796",
    _a[BlueprintIcons_16.CubeAdd] = "61797",
    _a[BlueprintIcons_16.CubeRemove] = "61798",
    _a[BlueprintIcons_16.Cube] = "61799",
    _a[BlueprintIcons_16.CurvedRangeChart] = "61800",
    _a[BlueprintIcons_16.Cut] = "61801",
    _a[BlueprintIcons_16.Cycle] = "61802",
    _a[BlueprintIcons_16.Dashboard] = "61803",
    _a[BlueprintIcons_16.DataConnection] = "61804",
    _a[BlueprintIcons_16.DataLineage] = "61805",
    _a[BlueprintIcons_16.Database] = "61806",
    _a[BlueprintIcons_16.Delete] = "61807",
    _a[BlueprintIcons_16.Delta] = "61808",
    _a[BlueprintIcons_16.DeriveColumn] = "61809",
    _a[BlueprintIcons_16.Desktop] = "61810",
    _a[BlueprintIcons_16.Diagnosis] = "61811",
    _a[BlueprintIcons_16.DiagramTree] = "61812",
    _a[BlueprintIcons_16.DirectionLeft] = "61813",
    _a[BlueprintIcons_16.DirectionRight] = "61814",
    _a[BlueprintIcons_16.Disable] = "61815",
    _a[BlueprintIcons_16.DocumentOpen] = "61816",
    _a[BlueprintIcons_16.DocumentShare] = "61817",
    _a[BlueprintIcons_16.Document] = "61818",
    _a[BlueprintIcons_16.Dollar] = "61819",
    _a[BlueprintIcons_16.Dot] = "61820",
    _a[BlueprintIcons_16.DoubleCaretHorizontal] = "61821",
    _a[BlueprintIcons_16.DoubleCaretVertical] = "61822",
    _a[BlueprintIcons_16.DoubleChevronDown] = "61823",
    _a[BlueprintIcons_16.DoubleChevronLeft] = "61824",
    _a[BlueprintIcons_16.DoubleChevronRight] = "61825",
    _a[BlueprintIcons_16.DoubleChevronUp] = "61826",
    _a[BlueprintIcons_16.DoughnutChart] = "61827",
    _a[BlueprintIcons_16.Download] = "61828",
    _a[BlueprintIcons_16.DragHandleHorizontal] = "61829",
    _a[BlueprintIcons_16.DragHandleVertical] = "61830",
    _a[BlueprintIcons_16.Draw] = "61831",
    _a[BlueprintIcons_16.DrawerLeftFilled] = "61832",
    _a[BlueprintIcons_16.DrawerLeft] = "61833",
    _a[BlueprintIcons_16.DrawerRightFilled] = "61834",
    _a[BlueprintIcons_16.DrawerRight] = "61835",
    _a[BlueprintIcons_16.DriveTime] = "61836",
    _a[BlueprintIcons_16.Duplicate] = "61837",
    _a[BlueprintIcons_16.Edit] = "61838",
    _a[BlueprintIcons_16.Eject] = "61839",
    _a[BlueprintIcons_16.Emoji] = "61840",
    _a[BlueprintIcons_16.Endorsed] = "61841",
    _a[BlueprintIcons_16.Envelope] = "61842",
    _a[BlueprintIcons_16.Equals] = "61843",
    _a[BlueprintIcons_16.Eraser] = "61844",
    _a[BlueprintIcons_16.Error] = "61845",
    _a[BlueprintIcons_16.Euro] = "61846",
    _a[BlueprintIcons_16.Exchange] = "61847",
    _a[BlueprintIcons_16.ExcludeRow] = "61848",
    _a[BlueprintIcons_16.ExpandAll] = "61849",
    _a[BlueprintIcons_16.Export] = "61850",
    _a[BlueprintIcons_16.EyeOff] = "61851",
    _a[BlueprintIcons_16.EyeOn] = "61852",
    _a[BlueprintIcons_16.EyeOpen] = "61853",
    _a[BlueprintIcons_16.FastBackward] = "61854",
    _a[BlueprintIcons_16.FastForward] = "61855",
    _a[BlueprintIcons_16.FeedSubscribed] = "61856",
    _a[BlueprintIcons_16.Feed] = "61857",
    _a[BlueprintIcons_16.Film] = "61858",
    _a[BlueprintIcons_16.FilterKeep] = "61859",
    _a[BlueprintIcons_16.FilterList] = "61860",
    _a[BlueprintIcons_16.FilterOpen] = "61861",
    _a[BlueprintIcons_16.FilterRemove] = "61862",
    _a[BlueprintIcons_16.Filter] = "61863",
    _a[BlueprintIcons_16.Flag] = "61864",
    _a[BlueprintIcons_16.Flame] = "61865",
    _a[BlueprintIcons_16.Flash] = "61866",
    _a[BlueprintIcons_16.FloppyDisk] = "61867",
    _a[BlueprintIcons_16.FlowBranch] = "61868",
    _a[BlueprintIcons_16.FlowEnd] = "61869",
    _a[BlueprintIcons_16.FlowLinear] = "61870",
    _a[BlueprintIcons_16.FlowReviewBranch] = "61871",
    _a[BlueprintIcons_16.FlowReview] = "61872",
    _a[BlueprintIcons_16.Flows] = "61873",
    _a[BlueprintIcons_16.FolderClose] = "61874",
    _a[BlueprintIcons_16.FolderNew] = "61875",
    _a[BlueprintIcons_16.FolderOpen] = "61876",
    _a[BlueprintIcons_16.FolderSharedOpen] = "61877",
    _a[BlueprintIcons_16.FolderShared] = "61878",
    _a[BlueprintIcons_16.Follower] = "61879",
    _a[BlueprintIcons_16.Following] = "61880",
    _a[BlueprintIcons_16.Font] = "61881",
    _a[BlueprintIcons_16.Fork] = "61882",
    _a[BlueprintIcons_16.Form] = "61883",
    _a[BlueprintIcons_16.FullCircle] = "61884",
    _a[BlueprintIcons_16.FullStackedChart] = "61885",
    _a[BlueprintIcons_16.Fullscreen] = "61886",
    _a[BlueprintIcons_16.Function] = "61887",
    _a[BlueprintIcons_16.GanttChart] = "61888",
    _a[BlueprintIcons_16.Geofence] = "61889",
    _a[BlueprintIcons_16.Geolocation] = "61890",
    _a[BlueprintIcons_16.Geosearch] = "61891",
    _a[BlueprintIcons_16.GitBranch] = "61892",
    _a[BlueprintIcons_16.GitCommit] = "61893",
    _a[BlueprintIcons_16.GitMerge] = "61894",
    _a[BlueprintIcons_16.GitNewBranch] = "61895",
    _a[BlueprintIcons_16.GitPull] = "61896",
    _a[BlueprintIcons_16.GitPush] = "61897",
    _a[BlueprintIcons_16.GitRepo] = "61898",
    _a[BlueprintIcons_16.Glass] = "61899",
    _a[BlueprintIcons_16.GlobeNetwork] = "61900",
    _a[BlueprintIcons_16.Globe] = "61901",
    _a[BlueprintIcons_16.GraphRemove] = "61902",
    _a[BlueprintIcons_16.Graph] = "61903",
    _a[BlueprintIcons_16.GreaterThanOrEqualTo] = "61904",
    _a[BlueprintIcons_16.GreaterThan] = "61905",
    _a[BlueprintIcons_16.GridView] = "61906",
    _a[BlueprintIcons_16.Grid] = "61907",
    _a[BlueprintIcons_16.GroupObjects] = "61908",
    _a[BlueprintIcons_16.GroupedBarChart] = "61909",
    _a[BlueprintIcons_16.HandDown] = "61910",
    _a[BlueprintIcons_16.HandLeft] = "61911",
    _a[BlueprintIcons_16.HandRight] = "61912",
    _a[BlueprintIcons_16.HandUp] = "61913",
    _a[BlueprintIcons_16.Hand] = "61914",
    _a[BlueprintIcons_16.Hat] = "61915",
    _a[BlueprintIcons_16.HeaderOne] = "61916",
    _a[BlueprintIcons_16.HeaderTwo] = "61917",
    _a[BlueprintIcons_16.Header] = "61918",
    _a[BlueprintIcons_16.Headset] = "61919",
    _a[BlueprintIcons_16.HeartBroken] = "61920",
    _a[BlueprintIcons_16.Heart] = "61921",
    _a[BlueprintIcons_16.HeatGrid] = "61922",
    _a[BlueprintIcons_16.Heatmap] = "61923",
    _a[BlueprintIcons_16.Help] = "61924",
    _a[BlueprintIcons_16.HelperManagement] = "61925",
    _a[BlueprintIcons_16.HighPriority] = "61926",
    _a[BlueprintIcons_16.Highlight] = "61927",
    _a[BlueprintIcons_16.History] = "61928",
    _a[BlueprintIcons_16.Home] = "61929",
    _a[BlueprintIcons_16.HorizontalBarChartAsc] = "61930",
    _a[BlueprintIcons_16.HorizontalBarChartDesc] = "61931",
    _a[BlueprintIcons_16.HorizontalBarChart] = "61932",
    _a[BlueprintIcons_16.HorizontalDistribution] = "61933",
    _a[BlueprintIcons_16.IdNumber] = "61934",
    _a[BlueprintIcons_16.ImageRotateLeft] = "61935",
    _a[BlueprintIcons_16.ImageRotateRight] = "61936",
    _a[BlueprintIcons_16.Import] = "61937",
    _a[BlueprintIcons_16.InboxFiltered] = "61938",
    _a[BlueprintIcons_16.InboxGeo] = "61939",
    _a[BlueprintIcons_16.InboxSearch] = "61940",
    _a[BlueprintIcons_16.InboxUpdate] = "61941",
    _a[BlueprintIcons_16.Inbox] = "61942",
    _a[BlueprintIcons_16.InfoSign] = "61943",
    _a[BlueprintIcons_16.Inheritance] = "61944",
    _a[BlueprintIcons_16.InheritedGroup] = "61945",
    _a[BlueprintIcons_16.InnerJoin] = "61946",
    _a[BlueprintIcons_16.Insert] = "61947",
    _a[BlueprintIcons_16.Intersection] = "61948",
    _a[BlueprintIcons_16.IpAddress] = "61949",
    _a[BlueprintIcons_16.IssueClosed] = "61950",
    _a[BlueprintIcons_16.IssueNew] = "61951",
    _a[BlueprintIcons_16.Issue] = "61952",
    _a[BlueprintIcons_16.Italic] = "61953",
    _a[BlueprintIcons_16.JoinTable] = "61954",
    _a[BlueprintIcons_16.KeyBackspace] = "61955",
    _a[BlueprintIcons_16.KeyCommand] = "61956",
    _a[BlueprintIcons_16.KeyControl] = "61957",
    _a[BlueprintIcons_16.KeyDelete] = "61958",
    _a[BlueprintIcons_16.KeyEnter] = "61959",
    _a[BlueprintIcons_16.KeyEscape] = "61960",
    _a[BlueprintIcons_16.KeyOption] = "61961",
    _a[BlueprintIcons_16.KeyShift] = "61962",
    _a[BlueprintIcons_16.KeyTab] = "61963",
    _a[BlueprintIcons_16.Key] = "61964",
    _a[BlueprintIcons_16.KnownVehicle] = "61965",
    _a[BlueprintIcons_16.LabTest] = "61966",
    _a[BlueprintIcons_16.Label] = "61967",
    _a[BlueprintIcons_16.LayerOutline] = "61968",
    _a[BlueprintIcons_16.Layer] = "61969",
    _a[BlueprintIcons_16.Layers] = "61970",
    _a[BlueprintIcons_16.LayoutAuto] = "61971",
    _a[BlueprintIcons_16.LayoutBalloon] = "61972",
    _a[BlueprintIcons_16.LayoutCircle] = "61973",
    _a[BlueprintIcons_16.LayoutGrid] = "61974",
    _a[BlueprintIcons_16.LayoutGroupBy] = "61975",
    _a[BlueprintIcons_16.LayoutHierarchy] = "61976",
    _a[BlueprintIcons_16.LayoutLinear] = "61977",
    _a[BlueprintIcons_16.LayoutSkewGrid] = "61978",
    _a[BlueprintIcons_16.LayoutSortedClusters] = "61979",
    _a[BlueprintIcons_16.Layout] = "61980",
    _a[BlueprintIcons_16.Learning] = "61981",
    _a[BlueprintIcons_16.LeftJoin] = "61982",
    _a[BlueprintIcons_16.LessThanOrEqualTo] = "61983",
    _a[BlueprintIcons_16.LessThan] = "61984",
    _a[BlueprintIcons_16.Lifesaver] = "61985",
    _a[BlueprintIcons_16.Lightbulb] = "61986",
    _a[BlueprintIcons_16.Link] = "61987",
    _a[BlueprintIcons_16.ListColumns] = "61988",
    _a[BlueprintIcons_16.ListDetailView] = "61989",
    _a[BlueprintIcons_16.List] = "61990",
    _a[BlueprintIcons_16.Locate] = "61991",
    _a[BlueprintIcons_16.Lock] = "61992",
    _a[BlueprintIcons_16.LogIn] = "61993",
    _a[BlueprintIcons_16.LogOut] = "61994",
    _a[BlueprintIcons_16.Manual] = "61995",
    _a[BlueprintIcons_16.ManuallyEnteredData] = "61996",
    _a[BlueprintIcons_16.MapCreate] = "61997",
    _a[BlueprintIcons_16.MapMarker] = "61998",
    _a[BlueprintIcons_16.Map] = "61999",
    _a[BlueprintIcons_16.Maximize] = "62000",
    _a[BlueprintIcons_16.Media] = "62001",
    _a[BlueprintIcons_16.MenuClosed] = "62002",
    _a[BlueprintIcons_16.MenuOpen] = "62003",
    _a[BlueprintIcons_16.Menu] = "62004",
    _a[BlueprintIcons_16.MergeColumns] = "62005",
    _a[BlueprintIcons_16.MergeLinks] = "62006",
    _a[BlueprintIcons_16.Minimize] = "62007",
    _a[BlueprintIcons_16.Minus] = "62008",
    _a[BlueprintIcons_16.MobilePhone] = "62009",
    _a[BlueprintIcons_16.MobileVideo] = "62010",
    _a[BlueprintIcons_16.ModalFilled] = "62011",
    _a[BlueprintIcons_16.Modal] = "62012",
    _a[BlueprintIcons_16.Moon] = "62013",
    _a[BlueprintIcons_16.More] = "62014",
    _a[BlueprintIcons_16.Mountain] = "62015",
    _a[BlueprintIcons_16.Move] = "62016",
    _a[BlueprintIcons_16.Mugshot] = "62017",
    _a[BlueprintIcons_16.MultiSelect] = "62018",
    _a[BlueprintIcons_16.Music] = "62019",
    _a[BlueprintIcons_16.NewDrawing] = "62020",
    _a[BlueprintIcons_16.NewGridItem] = "62021",
    _a[BlueprintIcons_16.NewLayer] = "62022",
    _a[BlueprintIcons_16.NewLayers] = "62023",
    _a[BlueprintIcons_16.NewLink] = "62024",
    _a[BlueprintIcons_16.NewObject] = "62025",
    _a[BlueprintIcons_16.NewPerson] = "62026",
    _a[BlueprintIcons_16.NewPrescription] = "62027",
    _a[BlueprintIcons_16.NewTextBox] = "62028",
    _a[BlueprintIcons_16.Ninja] = "62029",
    _a[BlueprintIcons_16.NotEqualTo] = "62030",
    _a[BlueprintIcons_16.NotificationsSnooze] = "62031",
    _a[BlueprintIcons_16.NotificationsUpdated] = "62032",
    _a[BlueprintIcons_16.Notifications] = "62033",
    _a[BlueprintIcons_16.NumberedList] = "62034",
    _a[BlueprintIcons_16.Numerical] = "62035",
    _a[BlueprintIcons_16.Office] = "62036",
    _a[BlueprintIcons_16.Offline] = "62037",
    _a[BlueprintIcons_16.OilField] = "62038",
    _a[BlueprintIcons_16.OneColumn] = "62039",
    _a[BlueprintIcons_16.Outdated] = "62040",
    _a[BlueprintIcons_16.PageLayout] = "62041",
    _a[BlueprintIcons_16.PanelStats] = "62042",
    _a[BlueprintIcons_16.PanelTable] = "62043",
    _a[BlueprintIcons_16.Paperclip] = "62044",
    _a[BlueprintIcons_16.Paragraph] = "62045",
    _a[BlueprintIcons_16.PathSearch] = "62046",
    _a[BlueprintIcons_16.Path] = "62047",
    _a[BlueprintIcons_16.Pause] = "62048",
    _a[BlueprintIcons_16.People] = "62049",
    _a[BlueprintIcons_16.Percentage] = "62050",
    _a[BlueprintIcons_16.Person] = "62051",
    _a[BlueprintIcons_16.Phone] = "62052",
    _a[BlueprintIcons_16.PieChart] = "62053",
    _a[BlueprintIcons_16.Pin] = "62054",
    _a[BlueprintIcons_16.PivotTable] = "62055",
    _a[BlueprintIcons_16.Pivot] = "62056",
    _a[BlueprintIcons_16.Play] = "62057",
    _a[BlueprintIcons_16.Plus] = "62058",
    _a[BlueprintIcons_16.PolygonFilter] = "62059",
    _a[BlueprintIcons_16.Power] = "62060",
    _a[BlueprintIcons_16.PredictiveAnalysis] = "62061",
    _a[BlueprintIcons_16.Prescription] = "62062",
    _a[BlueprintIcons_16.Presentation] = "62063",
    _a[BlueprintIcons_16.Print] = "62064",
    _a[BlueprintIcons_16.Projects] = "62065",
    _a[BlueprintIcons_16.Properties] = "62066",
    _a[BlueprintIcons_16.Property] = "62067",
    _a[BlueprintIcons_16.PublishFunction] = "62068",
    _a[BlueprintIcons_16.Pulse] = "62069",
    _a[BlueprintIcons_16.Random] = "62070",
    _a[BlueprintIcons_16.Record] = "62071",
    _a[BlueprintIcons_16.Redo] = "62072",
    _a[BlueprintIcons_16.Refresh] = "62073",
    _a[BlueprintIcons_16.RegressionChart] = "62074",
    _a[BlueprintIcons_16.RemoveColumnLeft] = "62075",
    _a[BlueprintIcons_16.RemoveColumnRight] = "62076",
    _a[BlueprintIcons_16.RemoveColumn] = "62077",
    _a[BlueprintIcons_16.RemoveRowBottom] = "62078",
    _a[BlueprintIcons_16.RemoveRowTop] = "62079",
    _a[BlueprintIcons_16.Remove] = "62080",
    _a[BlueprintIcons_16.Repeat] = "62081",
    _a[BlueprintIcons_16.Reset] = "62082",
    _a[BlueprintIcons_16.Resolve] = "62083",
    _a[BlueprintIcons_16.Rig] = "62084",
    _a[BlueprintIcons_16.RightJoin] = "62085",
    _a[BlueprintIcons_16.Ring] = "62086",
    _a[BlueprintIcons_16.RotateDocument] = "62087",
    _a[BlueprintIcons_16.RotatePage] = "62088",
    _a[BlueprintIcons_16.Route] = "62089",
    _a[BlueprintIcons_16.Satellite] = "62090",
    _a[BlueprintIcons_16.Saved] = "62091",
    _a[BlueprintIcons_16.ScatterPlot] = "62092",
    _a[BlueprintIcons_16.SearchAround] = "62093",
    _a[BlueprintIcons_16.SearchTemplate] = "62094",
    _a[BlueprintIcons_16.SearchText] = "62095",
    _a[BlueprintIcons_16.Search] = "62096",
    _a[BlueprintIcons_16.SegmentedControl] = "62097",
    _a[BlueprintIcons_16.Select] = "62098",
    _a[BlueprintIcons_16.Selection] = "62099",
    _a[BlueprintIcons_16.SendMessage] = "62100",
    _a[BlueprintIcons_16.SendToGraph] = "62101",
    _a[BlueprintIcons_16.SendToMap] = "62102",
    _a[BlueprintIcons_16.SendTo] = "62103",
    _a[BlueprintIcons_16.SeriesAdd] = "62104",
    _a[BlueprintIcons_16.SeriesConfiguration] = "62105",
    _a[BlueprintIcons_16.SeriesDerived] = "62106",
    _a[BlueprintIcons_16.SeriesFiltered] = "62107",
    _a[BlueprintIcons_16.SeriesSearch] = "62108",
    _a[BlueprintIcons_16.Settings] = "62109",
    _a[BlueprintIcons_16.Shapes] = "62110",
    _a[BlueprintIcons_16.Share] = "62111",
    _a[BlueprintIcons_16.SharedFilter] = "62112",
    _a[BlueprintIcons_16.Shield] = "62113",
    _a[BlueprintIcons_16.Shop] = "62114",
    _a[BlueprintIcons_16.ShoppingCart] = "62115",
    _a[BlueprintIcons_16.SignalSearch] = "62116",
    _a[BlueprintIcons_16.SimCard] = "62117",
    _a[BlueprintIcons_16.Slash] = "62118",
    _a[BlueprintIcons_16.SmallCross] = "62119",
    _a[BlueprintIcons_16.SmallMinus] = "62120",
    _a[BlueprintIcons_16.SmallPlus] = "62121",
    _a[BlueprintIcons_16.SmallTick] = "62122",
    _a[BlueprintIcons_16.Snowflake] = "62123",
    _a[BlueprintIcons_16.SocialMedia] = "62124",
    _a[BlueprintIcons_16.SortAlphabeticalDesc] = "62125",
    _a[BlueprintIcons_16.SortAlphabetical] = "62126",
    _a[BlueprintIcons_16.SortAsc] = "62127",
    _a[BlueprintIcons_16.SortDesc] = "62128",
    _a[BlueprintIcons_16.SortNumericalDesc] = "62129",
    _a[BlueprintIcons_16.SortNumerical] = "62130",
    _a[BlueprintIcons_16.Sort] = "62131",
    _a[BlueprintIcons_16.SplitColumns] = "62132",
    _a[BlueprintIcons_16.Square] = "62133",
    _a[BlueprintIcons_16.StackedChart] = "62134",
    _a[BlueprintIcons_16.StarEmpty] = "62135",
    _a[BlueprintIcons_16.Star] = "62136",
    _a[BlueprintIcons_16.StepBackward] = "62137",
    _a[BlueprintIcons_16.StepChart] = "62138",
    _a[BlueprintIcons_16.StepForward] = "62139",
    _a[BlueprintIcons_16.Stop] = "62140",
    _a[BlueprintIcons_16.Stopwatch] = "62141",
    _a[BlueprintIcons_16.Strikethrough] = "62142",
    _a[BlueprintIcons_16.Style] = "62143",
    _a[BlueprintIcons_16.SwapHorizontal] = "62144",
    _a[BlueprintIcons_16.SwapVertical] = "62145",
    _a[BlueprintIcons_16.Switch] = "62146",
    _a[BlueprintIcons_16.SymbolCircle] = "62147",
    _a[BlueprintIcons_16.SymbolCross] = "62148",
    _a[BlueprintIcons_16.SymbolDiamond] = "62149",
    _a[BlueprintIcons_16.SymbolSquare] = "62150",
    _a[BlueprintIcons_16.SymbolTriangleDown] = "62151",
    _a[BlueprintIcons_16.SymbolTriangleUp] = "62152",
    _a[BlueprintIcons_16.Tag] = "62153",
    _a[BlueprintIcons_16.TakeAction] = "62154",
    _a[BlueprintIcons_16.Taxi] = "62155",
    _a[BlueprintIcons_16.TextHighlight] = "62156",
    _a[BlueprintIcons_16.ThDerived] = "62157",
    _a[BlueprintIcons_16.ThDisconnect] = "62158",
    _a[BlueprintIcons_16.ThFiltered] = "62159",
    _a[BlueprintIcons_16.ThList] = "62160",
    _a[BlueprintIcons_16.Th] = "62161",
    _a[BlueprintIcons_16.ThumbsDown] = "62162",
    _a[BlueprintIcons_16.ThumbsUp] = "62163",
    _a[BlueprintIcons_16.TickCircle] = "62164",
    _a[BlueprintIcons_16.Tick] = "62165",
    _a[BlueprintIcons_16.Time] = "62166",
    _a[BlueprintIcons_16.TimelineAreaChart] = "62167",
    _a[BlueprintIcons_16.TimelineBarChart] = "62168",
    _a[BlueprintIcons_16.TimelineEvents] = "62169",
    _a[BlueprintIcons_16.TimelineLineChart] = "62170",
    _a[BlueprintIcons_16.Tint] = "62171",
    _a[BlueprintIcons_16.Torch] = "62172",
    _a[BlueprintIcons_16.Tractor] = "62173",
    _a[BlueprintIcons_16.Train] = "62174",
    _a[BlueprintIcons_16.Translate] = "62175",
    _a[BlueprintIcons_16.Trash] = "62176",
    _a[BlueprintIcons_16.Tree] = "62177",
    _a[BlueprintIcons_16.TrendingDown] = "62178",
    _a[BlueprintIcons_16.TrendingUp] = "62179",
    _a[BlueprintIcons_16.Truck] = "62180",
    _a[BlueprintIcons_16.TwoColumns] = "62181",
    _a[BlueprintIcons_16.Unarchive] = "62182",
    _a[BlueprintIcons_16.Underline] = "62183",
    _a[BlueprintIcons_16.Undo] = "62184",
    _a[BlueprintIcons_16.UngroupObjects] = "62185",
    _a[BlueprintIcons_16.UnknownVehicle] = "62186",
    _a[BlueprintIcons_16.Unlock] = "62187",
    _a[BlueprintIcons_16.Unpin] = "62188",
    _a[BlueprintIcons_16.Unresolve] = "62189",
    _a[BlueprintIcons_16.Updated] = "62190",
    _a[BlueprintIcons_16.Upload] = "62191",
    _a[BlueprintIcons_16.User] = "62192",
    _a[BlueprintIcons_16.Variable] = "62193",
    _a[BlueprintIcons_16.VerticalBarChartAsc] = "62194",
    _a[BlueprintIcons_16.VerticalBarChartDesc] = "62195",
    _a[BlueprintIcons_16.VerticalDistribution] = "62196",
    _a[BlueprintIcons_16.Video] = "62197",
    _a[BlueprintIcons_16.Virus] = "62198",
    _a[BlueprintIcons_16.VolumeDown] = "62199",
    _a[BlueprintIcons_16.VolumeOff] = "62200",
    _a[BlueprintIcons_16.VolumeUp] = "62201",
    _a[BlueprintIcons_16.Walk] = "62202",
    _a[BlueprintIcons_16.WarningSign] = "62203",
    _a[BlueprintIcons_16.WaterfallChart] = "62204",
    _a[BlueprintIcons_16.WidgetButton] = "62205",
    _a[BlueprintIcons_16.WidgetFooter] = "62206",
    _a[BlueprintIcons_16.WidgetHeader] = "62207",
    _a[BlueprintIcons_16.Widget] = "62208",
    _a[BlueprintIcons_16.Wrench] = "62209",
    _a[BlueprintIcons_16.ZoomIn] = "62210",
    _a[BlueprintIcons_16.ZoomOut] = "62211",
    _a[BlueprintIcons_16.ZoomToFit] = "62212",
    _a);

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
var ICON_SIZE_STANDARD = 16;
var ICON_SIZE_LARGE = 20;

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
/**
 * Wraps an async task with a performance timer. Only logs to console in development.
 */
function wrapWithTimer(taskDescription, task) {
    return __awaiter(this, void 0, void 0, function () {
        var shouldMeasure, start, time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shouldMeasure = NODE_ENV === "development" && typeof performance !== "undefined";
                    /* eslint-disable no-console */
                    if (shouldMeasure) {
                        start = performance.now();
                        console.info("Started '" + taskDescription + "'...");
                    }
                    return [4 /*yield*/, task()];
                case 1:
                    _a.sent();
                    if (shouldMeasure) {
                        time = Math.round(performance.now() - start);
                        console.info("Finished '" + taskDescription + "' in " + time + "ms");
                    }
                    return [2 /*return*/];
            }
        });
    });
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
/**
 * The default icon contents loader implementation, optimized for webpack.
 *
 * @see https://webpack.js.org/api/module-methods/#magic-comments for dynamic import() reference
 */
var defaultIconContentsLoader = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, import(
                /* webpackInclude: /\.js$/ */
                /* webpackMode: "lazy-once" */
                "./generated/components/" + name)];
            case 1: return [2 /*return*/, (_a.sent()).default];
        }
    });
}); };
/**
 * Blueprint icons loader.
 */
var Icons = /** @class */ (function () {
    function Icons() {
        /** @internal */
        this.loadedIcons = new Map();
    }
    Icons.load = function (icons, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Array.isArray(icons)) {
                            icons = [icons];
                        }
                        return [4 /*yield*/, Promise.all(icons.map(function (icon) { return _this.loadImpl(icon, options); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load all available icons for use in Blueprint components.
     */
    Icons.loadAll = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var allIcons;
            var _this = this;
            return __generator(this, function (_a) {
                allIcons = Object.values(BlueprintIcons_16);
                wrapWithTimer("[Blueprint] loading all icons", function () { return _this.load(allIcons, options); });
                return [2 /*return*/];
            });
        });
    };
    /**
     * Get the icon SVG component.
     */
    Icons.getComponent = function (icon) {
        if (!this.isValidIconName(icon)) {
            // don't warn, since this.load() will have warned already
            return undefined;
        }
        else if (!singleton.loadedIcons.has(icon)) {
            console.error("[Blueprint] Icon '" + icon + "' not loaded yet, did you call Icons.load('" + icon + "')?");
            return undefined;
        }
        return singleton.loadedIcons.get(icon);
    };
    Icons.loadImpl = function (icon, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var load, component, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.isValidIconName(icon)) {
                            console.error("[Blueprint] Unknown icon '" + icon + "'");
                            return [2 /*return*/];
                        }
                        else if (singleton.loadedIcons.has(icon)) {
                            // already loaded, no-op
                            return [2 /*return*/];
                        }
                        load = (_a = options === null || options === void 0 ? void 0 : options.loader) !== null && _a !== void 0 ? _a : defaultIconContentsLoader;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, load(icon)];
                    case 2:
                        component = _b.sent();
                        singleton.loadedIcons.set(icon, component);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        console.error("[Blueprint] Unable to load icon '" + icon + "'", e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Icons.isValidIconName = function (icon) {
        var allIcons = Object.values(BlueprintIcons_16);
        return allIcons.indexOf(icon) >= 0;
    };
    return Icons;
}());
var singleton = new Icons();

/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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
var NS$1 = "bp4";
var ICON$1 = NS$1 + "-icon";

/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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
var CaretRight = function (_a) {
    var className = _a.className, color = _a.color, _b = _a.size, size = _b === void 0 ? ICON_SIZE_STANDARD : _b, _c = _a.title, title = _c === void 0 ? "caret-right" : _c, _d = _a.htmlTitle, htmlTitle = _d === void 0 ? title : _d, _e = _a.tagName, tagName = _e === void 0 ? "span" : _e, htmlProps = __rest(_a, ["className", "color", "size", "title", "htmlTitle", "tagName"]);
    var isLarge = size >= ICON_SIZE_LARGE;
    var pixelGridSize = isLarge ? ICON_SIZE_LARGE : ICON_SIZE_STANDARD;
    var viewBox = "0 0 " + pixelGridSize + " " + pixelGridSize;
    var path = (react.createElement("path", { d: isLarge
            ? "M14 10C14 10.31 13.85 10.57 13.63 10.76L13.64 10.77L7.64 15.77L7.63 15.76C7.46 15.9 7.24 16 7 16C6.45 16 6 15.55 6 15V5C6 4.45 6.45 4 7 4C7.24 4 7.46 4.1 7.63 4.24L7.64 4.23L13.64 9.23L13.63 9.24C13.85 9.43 14 9.69 14 10z"
            : "M11 8C11 8.15 10.93 8.28 10.83 8.37L10.83 8.37L6.83 11.87L6.83 11.87C6.74 11.95 6.63 12 6.5 12C6.22 12 6 11.78 6 11.5V4.5C6 4.22 6.22 4 6.5 4C6.63 4 6.74 4.05 6.83 4.13C6.83 4.13 6.83 4.13 6.83 4.13L10.83 7.63L10.83 7.63C10.93 7.72 11 7.85 11 8z", fillRule: "evenodd" }));
    if (tagName === null) {
        return (react.createElement("svg", __assign({ fill: color, "data-icon": "caret-right", width: size, height: size, viewBox: viewBox }, htmlProps),
            title && react.createElement("desc", null, title),
            path));
    }
    else {
        return react.createElement(tagName, __assign(__assign({}, htmlProps), { className: className + " " + ICON$1, title: htmlTitle }), react.createElement("svg", { fill: color, "data-icon": "caret-right", width: size, height: size, viewBox: viewBox },
            title && react.createElement("desc", null, title),
            path));
    }
};

/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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
var ChevronLeft = function (_a) {
    var className = _a.className, color = _a.color, _b = _a.size, size = _b === void 0 ? ICON_SIZE_STANDARD : _b, _c = _a.title, title = _c === void 0 ? "chevron-left" : _c, _d = _a.htmlTitle, htmlTitle = _d === void 0 ? title : _d, _e = _a.tagName, tagName = _e === void 0 ? "span" : _e, htmlProps = __rest(_a, ["className", "color", "size", "title", "htmlTitle", "tagName"]);
    var isLarge = size >= ICON_SIZE_LARGE;
    var pixelGridSize = isLarge ? ICON_SIZE_LARGE : ICON_SIZE_STANDARD;
    var viewBox = "0 0 " + pixelGridSize + " " + pixelGridSize;
    var path = (react.createElement("path", { d: isLarge
            ? "M8.41 10L13.7 15.29C13.89 15.47 14 15.72 14 16C14 16.55 13.55 17 13 17C12.72 17 12.47 16.89 12.29 16.71L6.29 10.71C6.11 10.53 6 10.28 6 10C6 9.72 6.11 9.47 6.29 9.29L12.29 3.29C12.47 3.11 12.72 3 13 3C13.55 3 14 3.45 14 4C14 4.28 13.89 4.53 13.71 4.71L8.41 10z"
            : "M7.41 8L10.7 11.29C10.89 11.47 11 11.72 11 12C11 12.55 10.55 13 10 13C9.72 13 9.47 12.89 9.29 12.71L5.29 8.71C5.11 8.53 5 8.28 5 8C5 7.72 5.11 7.47 5.29 7.29L9.29 3.29C9.47 3.11 9.72 3 10 3C10.55 3 11 3.45 11 4C11 4.28 10.89 4.53 10.71 4.71L7.41 8z", fillRule: "evenodd" }));
    if (tagName === null) {
        return (react.createElement("svg", __assign({ fill: color, "data-icon": "chevron-left", width: size, height: size, viewBox: viewBox }, htmlProps),
            title && react.createElement("desc", null, title),
            path));
    }
    else {
        return react.createElement(tagName, __assign(__assign({}, htmlProps), { className: className + " " + ICON$1, title: htmlTitle }), react.createElement("svg", { fill: color, "data-icon": "chevron-left", width: size, height: size, viewBox: viewBox },
            title && react.createElement("desc", null, title),
            path));
    }
};

/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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
var ChevronRight = function (_a) {
    var className = _a.className, color = _a.color, _b = _a.size, size = _b === void 0 ? ICON_SIZE_STANDARD : _b, _c = _a.title, title = _c === void 0 ? "chevron-right" : _c, _d = _a.htmlTitle, htmlTitle = _d === void 0 ? title : _d, _e = _a.tagName, tagName = _e === void 0 ? "span" : _e, htmlProps = __rest(_a, ["className", "color", "size", "title", "htmlTitle", "tagName"]);
    var isLarge = size >= ICON_SIZE_LARGE;
    var pixelGridSize = isLarge ? ICON_SIZE_LARGE : ICON_SIZE_STANDARD;
    var viewBox = "0 0 " + pixelGridSize + " " + pixelGridSize;
    var path = (react.createElement("path", { d: isLarge
            ? "M13.71 10.71L7.71 16.71C7.53 16.89 7.28 17 7 17C6.45 17 6 16.55 6 16C6 15.72 6.11 15.47 6.29 15.29L11.59 10L6.3 4.71C6.11 4.53 6 4.28 6 4C6 3.45 6.45 3 7 3C7.28 3 7.53 3.11 7.71 3.29L13.71 9.29C13.89 9.47 14 9.72 14 10C14 10.28 13.89 10.53 13.71 10.71z"
            : "M10.71 8.71L6.71 12.71C6.53 12.89 6.28 13 6 13C5.45 13 5 12.55 5 12C5 11.72 5.11 11.47 5.29 11.29L8.59 8L5.3 4.71C5.11 4.53 5 4.28 5 4C5 3.45 5.45 3 6 3C6.28 3 6.53 3.11 6.71 3.29L10.71 7.29C10.89 7.47 11 7.72 11 8C11 8.28 10.89 8.53 10.71 8.71z", fillRule: "evenodd" }));
    if (tagName === null) {
        return (react.createElement("svg", __assign({ fill: color, "data-icon": "chevron-right", width: size, height: size, viewBox: viewBox }, htmlProps),
            title && react.createElement("desc", null, title),
            path));
    }
    else {
        return react.createElement(tagName, __assign(__assign({}, htmlProps), { className: className + " " + ICON$1, title: htmlTitle }), react.createElement("svg", { fill: color, "data-icon": "chevron-right", width: size, height: size, viewBox: viewBox },
            title && react.createElement("desc", null, title),
            path));
    }
};

/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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
var DoubleCaretVertical = function (_a) {
    var className = _a.className, color = _a.color, _b = _a.size, size = _b === void 0 ? ICON_SIZE_STANDARD : _b, _c = _a.title, title = _c === void 0 ? "double-caret-vertical" : _c, _d = _a.htmlTitle, htmlTitle = _d === void 0 ? title : _d, _e = _a.tagName, tagName = _e === void 0 ? "span" : _e, htmlProps = __rest(_a, ["className", "color", "size", "title", "htmlTitle", "tagName"]);
    var isLarge = size >= ICON_SIZE_LARGE;
    var pixelGridSize = isLarge ? ICON_SIZE_LARGE : ICON_SIZE_STANDARD;
    var viewBox = "0 0 " + pixelGridSize + " " + pixelGridSize;
    var path = (react.createElement("path", { d: isLarge
            ? "M5 11H15C15.55 11 16 11.45 16 12C16 12.24 15.9 12.46 15.76 12.63L15.77 12.64L10.77 18.64L10.76 18.63C10.57 18.85 10.31 19 10 19S9.43 18.85 9.24 18.63L9.23 18.64L4.23 12.64L4.24 12.63C4.1 12.46 4 12.24 4 12C4 11.45 4.45 11 5 11zM15 9H5C4.45 9 4 8.55 4 8C4 7.76 4.1 7.54 4.24 7.37L4.23 7.36L9.23 1.36L9.24 1.37C9.43 1.15 9.69 1 10 1S10.57 1.15 10.76 1.37L10.77 1.36L15.77 7.36L15.76 7.37C15.9 7.54 16 7.76 16 8C16 8.55 15.55 9 15 9z"
            : "M5 9H11C11.55 9 12 9.45 12 10C12 10.28 11.89 10.53 11.71 10.71L8.71 13.71C8.53 13.89 8.28 14 8 14S7.47 13.89 7.29 13.71L4.29 10.71C4.11 10.53 4 10.28 4 10C4 9.45 4.45 9 5 9zM11 7H5C4.45 7 4 6.55 4 6C4 5.72 4.11 5.47 4.29 5.29L7.29 2.29C7.47 2.11 7.72 2 8 2S8.53 2.11 8.71 2.29L11.71 5.29C11.89 5.47 12 5.72 12 6C12 6.55 11.55 7 11 7z", fillRule: "evenodd" }));
    if (tagName === null) {
        return (react.createElement("svg", __assign({ fill: color, "data-icon": "double-caret-vertical", width: size, height: size, viewBox: viewBox }, htmlProps),
            title && react.createElement("desc", null, title),
            path));
    }
    else {
        return react.createElement(tagName, __assign(__assign({}, htmlProps), { className: className + " " + ICON$1, title: htmlTitle }), react.createElement("svg", { fill: color, "data-icon": "double-caret-vertical", width: size, height: size, viewBox: viewBox },
            title && react.createElement("desc", null, title),
            path));
    }
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
var Icon = /** @class */ (function (_super) {
    __extends(Icon, _super);
    function Icon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            iconComponent: undefined,
        };
        // this component may have unmounted by the time iconContents load, so make sure we don't try to setState
        _this.hasUnmounted = false;
        return _this;
    }
    Icon.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var icon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.hasUnmounted = false;
                        icon = this.props.icon;
                        if (!(typeof icon === "string")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadIconComponentModule(icon)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Icon.prototype.componentDidUpdate = function (prevProps, _prevState) {
        return __awaiter(this, void 0, void 0, function () {
            var icon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        icon = this.props.icon;
                        if (!(prevProps.icon !== icon && typeof icon === "string")) return [3 /*break*/, 2];
                        // reload the module to get the component, but it will be cached if it's the same icon
                        return [4 /*yield*/, this.loadIconComponentModule(icon)];
                    case 1:
                        // reload the module to get the component, but it will be cached if it's the same icon
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Icon.prototype.componentWillUnmount = function () {
        this.hasUnmounted = true;
    };
    Icon.prototype.render = function () {
        var icon = this.props.icon;
        if (icon == null || typeof icon === "boolean") {
            return null;
        }
        else if (typeof icon !== "string") {
            return icon;
        }
        // strip out props we don't want rendered to the DOM
        var _a = this.props, autoLoad = _a.autoLoad, className = _a.className, color = _a.color, size = _a.size, _icon = _a.icon, intent = _a.intent, tagName = _a.tagName, _b = _a.title, title = _b === void 0 ? icon : _b, _c = _a.htmlTitle, htmlTitle = _c === void 0 ? title : _c, htmlProps = __rest(_a, ["autoLoad", "className", "color", "size", "icon", "intent", "tagName", "title", "htmlTitle"]);
        var Component = this.state.iconComponent;
        if (Component == null) {
            // fall back to icon font if unloaded or unable to load SVG implementation
            return react.createElement(tagName, __assign(__assign({}, htmlProps), { className: classnames(ICON, iconClass(icon), intentClass(intent), className), title: htmlTitle }));
        }
        else {
            return (react.createElement(Component, __assign({ className: classnames(intentClass(intent), className), color: color, size: size, tagName: tagName, title: title, htmlTitle: htmlTitle }, htmlProps)));
        }
    };
    Icon.prototype.loadIconComponentModule = function (iconName) {
        return __awaiter(this, void 0, void 0, function () {
            var iconComponent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.props.autoLoad && !this.hasUnmounted)) return [3 /*break*/, 2];
                        // if it's already been loaded, this is a no-op
                        return [4 /*yield*/, Icons.load(iconName)];
                    case 1:
                        // if it's already been loaded, this is a no-op
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        iconComponent = Icons.getComponent(iconName);
                        this.setState({ iconComponent: iconComponent });
                        return [2 /*return*/];
                }
            });
        });
    };
    Icon.displayName = DISPLAYNAME_PREFIX + ".Icon";
    Icon.defaultProps = {
        autoLoad: true,
        tagName: "span",
    };
    Icon.SIZE_STANDARD = ICON_SIZE_STANDARD;
    Icon.SIZE_LARGE = ICON_SIZE_LARGE;
    return Icon;
}(AbstractPureComponent));

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
        var strokeWidth = Math.min(MIN_STROKE_WIDTH, (STROKE_WIDTH * Spinner.SIZE_LARGE) / size);
        var strokeOffset = PATH_LENGTH - PATH_LENGTH * (value == null ? 0.25 : clamp(value, 0, 1));
        // multiple DOM elements around SVG are necessary to properly isolate animation:
        // - SVG elements in IE do not support anim/trans so they must be set on a parent HTML element.
        // - SPINNER_ANIMATION isolates svg from parent display and is always centered inside root element.
        return react.createElement(tagName, { className: classes }, react.createElement(tagName, { className: SPINNER_ANIMATION }, react.createElement("svg", { width: size, height: size, strokeWidth: strokeWidth.toFixed(2), viewBox: this.getViewBox(strokeWidth) },
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
                return Spinner.SIZE_SMALL;
            }
            else if (className.indexOf(LARGE) >= 0) {
                return Spinner.SIZE_LARGE;
            }
            return Spinner.SIZE_STANDARD;
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
    Spinner.SIZE_SMALL = 20;
    Spinner.SIZE_STANDARD = 50;
    Spinner.SIZE_LARGE = 100;
    return Spinner;
}(AbstractPureComponent));

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
var Button = react.forwardRef(function (props, ref) {
    var commonAttributes = useSharedButtonAttributes(props, ref);
    return (react.createElement("button", __assign({ type: "button" }, removeNonHTMLProps(props), commonAttributes), renderButtonContents(props)));
});
Button.displayName = DISPLAYNAME_PREFIX + ".Button";
var AnchorButton = react.forwardRef(function (props, ref) {
    var href = props.href, _a = props.tabIndex, tabIndex = _a === void 0 ? 0 : _a;
    var commonProps = useSharedButtonAttributes(props, ref);
    return (react.createElement("a", __assign({ role: "button" }, removeNonHTMLProps(props), commonProps, { href: commonProps.disabled ? undefined : href, tabIndex: commonProps.disabled ? -1 : tabIndex }), renderButtonContents(props)));
});
AnchorButton.displayName = DISPLAYNAME_PREFIX + ".AnchorButton";
/**
 * Most of the button logic lives in this shared hook.
 */
function useSharedButtonAttributes(props, ref) {
    var _a;
    var active = props.active, alignText = props.alignText, fill = props.fill, large = props.large, loading = props.loading, outlined = props.outlined, minimal = props.minimal, small = props.small, tabIndex = props.tabIndex;
    var disabled = props.disabled || loading;
    // the current key being pressed
    var _b = react.useState(), currentKeyDown = _b[0], setCurrentKeyDown = _b[1];
    // whether the button is in "active" state
    var _c = react.useState(false), isActive = _c[0], setIsActive = _c[1];
    // our local ref for the button element, merged with the consumer's own ref (if supplied) in this hook's return value
    var buttonRef = react.useRef(null);
    var handleBlur = react.useCallback(function (e) {
        var _a;
        if (isActive) {
            setIsActive(false);
        }
        (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props, e);
    }, [isActive, props.onBlur]);
    var handleKeyDown = react.useCallback(function (e) {
        var _a;
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        /* eslint-disable deprecation/deprecation */
        if (isKeyboardClick(e.which)) {
            e.preventDefault();
            if (e.which !== currentKeyDown) {
                setIsActive(true);
            }
        }
        setCurrentKeyDown(e.which);
        (_a = props.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(props, e);
    }, [currentKeyDown, props.onKeyDown]);
    var handleKeyUp = react.useCallback(function (e) {
        var _a, _b;
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        /* eslint-disable deprecation/deprecation */
        if (isKeyboardClick(e.which)) {
            setIsActive(false);
            (_a = buttonRef.current) === null || _a === void 0 ? void 0 : _a.click();
        }
        setCurrentKeyDown(undefined);
        (_b = props.onKeyUp) === null || _b === void 0 ? void 0 : _b.call(props, e);
    }, [props.onKeyUp]);
    var className = classnames(BUTTON, (_a = {},
        _a[ACTIVE] = !disabled && (active || isActive),
        _a[DISABLED] = disabled,
        _a[FILL] = fill,
        _a[LARGE] = large,
        _a[LOADING] = loading,
        _a[MINIMAL] = minimal,
        _a[OUTLINED] = outlined,
        _a[SMALL] = small,
        _a), alignmentClass(alignText), intentClass(props.intent), props.className);
    return {
        className: className,
        disabled: disabled,
        onBlur: handleBlur,
        onClick: disabled ? undefined : props.onClick,
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
        ref: mergeRefs(buttonRef, ref),
        tabIndex: disabled ? -1 : tabIndex,
    };
}
/**
 * Shared rendering code for button contents.
 */
function renderButtonContents(props) {
    var children = props.children, icon = props.icon, loading = props.loading, rightIcon = props.rightIcon, text = props.text;
    var hasTextContent = !isReactNodeEmpty(text) || !isReactNodeEmpty(children);
    return (react.createElement(react.Fragment, null,
        loading && react.createElement(Spinner, { key: "loading", className: BUTTON_SPINNER, size: Icon.SIZE_LARGE }),
        react.createElement(Icon, { key: "leftIcon", icon: icon }),
        hasTextContent && (react.createElement("span", { key: "text", className: BUTTON_TEXT },
            text,
            children)),
        react.createElement(Icon, { key: "rightIcon", icon: rightIcon })));
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
  _inheritsLoose(Transition, _React$Component);

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
        childProps = _objectWithoutPropertiesLoose(_this$props, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]);

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
  _inheritsLoose(CSSTransition, _React$Component);

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
        props = _objectWithoutPropertiesLoose(_this$props, ["classNames"]);

    return /*#__PURE__*/react.createElement(Transition, _extends({}, props, {
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

function _assertThisInitialized(self) {
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
  _inheritsLoose(TransitionGroup, _React$Component);

  function TransitionGroup(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this;

    var handleExited = _this.handleExited.bind(_assertThisInitialized(_this)); // Initial children should all be entering, dependent on appear


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
        var children = _extends({}, state.children);

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
        props = _objectWithoutPropertiesLoose(_this$props, ["component", "childFactory"]);

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
        if (typeof document === "undefined" || !this.state.hasMounted || this.portalElement === null) {
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
    };
    Portal.prototype.componentDidUpdate = function (prevProps) {
        // update className prop on portal DOM element
        if (this.portalElement != null && prevProps.className !== this.props.className) {
            if (prevProps.className !== undefined) {
                this.portalElement.classList.remove(prevProps.className);
            }
            maybeAddClass(this.portalElement.classList, this.props.className);
        }
    };
    Portal.prototype.componentWillUnmount = function () {
        if (this.portalElement != null) {
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
    Portal.displayName = DISPLAYNAME_PREFIX + ".Portal";
    Portal.contextTypes = REACT_CONTEXT_TYPES;
    Portal.defaultProps = {
        container: typeof document !== "undefined" ? document.body : undefined,
    };
    return Portal;
}(react.Component));
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
        _this.state = {
            hasEverOpened: _this.props.isOpen,
        };
        /** Ref for container element, containing all children and the backdrop */
        _this.containerElement = react.createRef();
        _this.maybeRenderChild = function (child) {
            if (isFunction(child)) {
                child = child();
            }
            if (child == null) {
                return null;
            }
            // decorate the child with a few injected props
            var tabIndex = _this.props.enforceFocus || _this.props.autoFocus ? 0 : undefined;
            var decoratedChild = typeof child === "object" ? (react.cloneElement(child, {
                className: classnames(child.props.className, OVERLAY_CONTENT),
                tabIndex: tabIndex,
            })) : (react.createElement("span", { className: OVERLAY_CONTENT, tabIndex: tabIndex }, child));
            var _a = _this.props, onOpening = _a.onOpening, onOpened = _a.onOpened, onClosing = _a.onClosing, onClosed = _a.onClosed, transitionDuration = _a.transitionDuration, transitionName = _a.transitionName;
            return (react.createElement(CSSTransition, { classNames: transitionName, onEntering: onOpening, onEntered: onOpened, onExiting: onClosing, onExited: onClosed, timeout: transitionDuration, addEndListener: _this.handleTransitionAddEnd }, decoratedChild));
        };
        _this.handleBackdropMouseDown = function (e) {
            var _a;
            var _b = _this.props, backdropProps = _b.backdropProps, canOutsideClickClose = _b.canOutsideClickClose, enforceFocus = _b.enforceFocus, onClose = _b.onClose;
            if (canOutsideClickClose) {
                onClose === null || onClose === void 0 ? void 0 : onClose(e);
            }
            if (enforceFocus) {
                // make sure document.activeElement is updated before bringing the focus back
                _this.bringFocusInsideOverlay();
            }
            (_a = backdropProps === null || backdropProps === void 0 ? void 0 : backdropProps.onMouseDown) === null || _a === void 0 ? void 0 : _a.call(backdropProps, e);
        };
        _this.handleDocumentClick = function (e) {
            var _a = _this.props, canOutsideClickClose = _a.canOutsideClickClose, isOpen = _a.isOpen, onClose = _a.onClose;
            // get the actual target even if we are in a Shadow DOM
            // see https://github.com/palantir/blueprint/issues/4220
            var eventTarget = (e.composed ? e.composedPath()[0] : e.target);
            var stackIndex = Overlay.openStack.indexOf(_this);
            var isClickInThisOverlayOrDescendant = Overlay.openStack
                .slice(stackIndex)
                .some(function (_a) {
                var _b;
                var elem = _a.containerElement;
                // `elem` is the container of backdrop & content, so clicking directly on that container
                // should not count as being "inside" the overlay.
                return ((_b = elem.current) === null || _b === void 0 ? void 0 : _b.contains(eventTarget)) && !elem.current.isSameNode(eventTarget);
            });
            if (isOpen && canOutsideClickClose && !isClickInThisOverlayOrDescendant) {
                // casting to any because this is a native event
                onClose === null || onClose === void 0 ? void 0 : onClose(e);
            }
        };
        _this.handleDocumentFocus = function (e) {
            // get the actual target even if we are in a Shadow DOM
            // see https://github.com/palantir/blueprint/issues/4220
            var eventTarget = e.composed ? e.composedPath()[0] : e.target;
            if (_this.props.enforceFocus &&
                _this.containerElement.current != null &&
                eventTarget instanceof Node &&
                !_this.containerElement.current.contains(eventTarget)) {
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
        var _c = this.props, children = _c.children, className = _c.className, usePortal = _c.usePortal, isOpen = _c.isOpen;
        // TransitionGroup types require single array of children; does not support nested arrays.
        // So we must collapse backdrop and children into one array, and every item must be wrapped in a
        // Transition element (no ReactText allowed).
        var childrenWithTransitions = isOpen ? (_b = react.Children.map(children, this.maybeRenderChild)) !== null && _b !== void 0 ? _b : [] : [];
        var maybeBackdrop = this.maybeRenderBackdrop();
        if (maybeBackdrop !== null) {
            childrenWithTransitions.unshift(maybeBackdrop);
        }
        var containerClasses = classnames(OVERLAY, (_a = {},
            _a[OVERLAY_OPEN] = isOpen,
            _a[OVERLAY_INLINE] = !usePortal,
            _a), className);
        var transitionGroup = (react.createElement("div", { className: containerClasses, onKeyDown: this.handleKeyDown, ref: this.containerElement },
            react.createElement(TransitionGroup, { appear: true, component: null }, childrenWithTransitions)));
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
            // container element may be undefined between component mounting and Portal rendering
            // activeElement may be undefined in some rare cases in IE
            if (_this.containerElement.current == null || document.activeElement == null || !_this.props.isOpen) {
                return;
            }
            var container = _this.containerElement.current;
            var isFocusOutsideModal = !container.contains(document.activeElement);
            if (isFocusOutsideModal) {
                // element marked autofocus has higher priority than other attributes
                var autofocusElement = container.querySelector("[autofocus]");
                var wrapperElement = container.querySelector("[tabindex]");
                if (autofocusElement != null) {
                    autofocusElement.focus();
                }
                else if (wrapperElement != null) {
                    wrapperElement.focus();
                }
            }
        });
    };
    Overlay.prototype.maybeRenderBackdrop = function () {
        var _a = this.props, backdropClassName = _a.backdropClassName, backdropProps = _a.backdropProps, canOutsideClickClose = _a.canOutsideClickClose, hasBackdrop = _a.hasBackdrop, isOpen = _a.isOpen, transitionDuration = _a.transitionDuration, transitionName = _a.transitionName;
        if (hasBackdrop && isOpen) {
            return (react.createElement(CSSTransition, { classNames: transitionName, key: "__backdrop", timeout: transitionDuration, addEndListener: this.handleTransitionAddEnd },
                react.createElement("div", __assign({}, backdropProps, { className: classnames(OVERLAY_BACKDROP, backdropClassName, backdropProps === null || backdropProps === void 0 ? void 0 : backdropProps.className), onMouseDown: this.handleBackdropMouseDown, tabIndex: canOutsideClickClose ? 0 : undefined }))));
        }
        else {
            return null;
        }
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
                if (lastOpenedOverlay.props.enforceFocus) {
                    document.addEventListener("focus", lastOpenedOverlay.handleDocumentFocus, /* useCapture */ true);
                }
            }
            if (openStack.filter(function (o) { return o.props.usePortal && o.props.hasBackdrop; }).length === 0) {
                document.body.classList.remove(OVERLAY_OPEN);
            }
        }
    };
    Overlay.prototype.overlayWillOpen = function () {
        var openStack = Overlay.openStack;
        if (openStack.length > 0) {
            document.removeEventListener("focus", Overlay.getLastOpened().handleDocumentFocus, /* useCapture */ true);
        }
        openStack.push(this);
        if (this.props.autoFocus) {
            this.bringFocusInsideOverlay();
        }
        if (this.props.enforceFocus) {
            document.addEventListener("focus", this.handleDocumentFocus, /* useCapture */ true);
        }
        if (this.props.canOutsideClickClose && !this.props.hasBackdrop) {
            document.addEventListener("mousedown", this.handleDocumentClick);
        }
        if (this.props.hasBackdrop && this.props.usePortal) {
            // add a class to the body to prevent scrolling of content below the overlay
            document.body.classList.add(OVERLAY_OPEN);
        }
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
        transitionDuration: 300,
        transitionName: OVERLAY,
        usePortal: true,
    };
    Overlay.openStack = [];
    Overlay.getLastOpened = function () { return Overlay.openStack[Overlay.openStack.length - 1]; };
    return Overlay;
}(AbstractPureComponent));

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
}(AbstractPureComponent));

var ManagerReferenceNodeContext = react.createContext();
var ManagerReferenceNodeSetterContext = react.createContext();
function Manager(_ref) {
  var children = _ref.children;

  var _React$useState = react.useState(null),
      referenceNode = _React$useState[0],
      setReferenceNode = _React$useState[1];

  var hasUnmounted = react.useRef(false);
  react.useEffect(function () {
    return function () {
      hasUnmounted.current = true;
    };
  }, []);
  var handleSetReferenceNode = react.useCallback(function (node) {
    if (!hasUnmounted.current) {
      setReferenceNode(node);
    }
  }, []);
  return /*#__PURE__*/react.createElement(ManagerReferenceNodeContext.Provider, {
    value: referenceNode
  }, /*#__PURE__*/react.createElement(ManagerReferenceNodeSetterContext.Provider, {
    value: handleSetReferenceNode
  }, children));
}

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
  if (typeof fn === 'function') {
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
  if (typeof ref === 'function') {
    return safeInvoke(ref, node);
  } // otherwise we should treat it as a ref object
  else if (ref != null) {
      ref.current = node;
    }
};
/**
 * Simple ponyfill for Object.fromEntries
 */

var fromEntries = function fromEntries(entries) {
  return entries.reduce(function (acc, _ref) {
    var key = _ref[0],
        value = _ref[1];
    acc[key] = value;
    return acc;
  }, {});
};
/**
 * Small wrapper around `useLayoutEffect` to get rid of the warning on SSR envs
 */

var useIsomorphicLayoutEffect = typeof window !== 'undefined' && window.document && window.document.createElement ? react.useLayoutEffect : react.useEffect;

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
};

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

var round = Math.round;
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
    // Fallback to 1 in case both values are `0`

    if (offsetWidth > 0) {
      scaleX = rect.width / offsetWidth || 1;
    }

    if (offsetHeight > 0) {
      scaleY = rect.height / offsetHeight || 1;
    }
  }

  return {
    width: round(rect.width / scaleX),
    height: round(rect.height / scaleY),
    top: round(rect.top / scaleY),
    right: round(rect.right / scaleX),
    bottom: round(rect.bottom / scaleY),
    left: round(rect.left / scaleX),
    x: round(rect.left / scaleX),
    y: round(rect.top / scaleY)
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

var max = Math.max;
var min = Math.min;
var round$1 = Math.round;

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getVariation(placement) {
  return placement.split('-')[1];
}

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round$1(round$1(x * dpr) / dpr) || 0,
    y: round$1(round$1(y * dpr) / dpr) || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets;

  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
      _ref3$x = _ref3.x,
      x = _ref3$x === void 0 ? 0 : _ref3$x,
      _ref3$y = _ref3.y,
      y = _ref3$y === void 0 ? 0 : _ref3$y;

  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom; // $FlowFixMe[prop-missing]

      y -= offsetParent[heightProp] - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right; // $FlowFixMe[prop-missing]

      x -= offsetParent[widthProp] - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref4) {
  var state = _ref4.state,
      options = _ref4.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect$2(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect$2,
  data: {}
};

var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

var hash$1 = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash$1[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
  // can be obscured underneath it.
  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
  // if it isn't open, so if this isn't available, the popper will be detected
  // to overflow the bottom of the screen too early.

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    // Feature detection fails in mobile emulation mode in Chrome.
    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
    // 0.001
    // Fallback here: "Not Safari" userAgent

    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis || checkAltAxis) {
    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
    var max$1 = popperOffsets[mainAxis] - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
    var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

    if (checkMainAxis) {
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset;
    }

    if (checkAltAxis) {
      var _mainSide = mainAxis === 'x' ? top : left;

      var _altSide = mainAxis === 'x' ? bottom : right;

      var _offset = popperOffsets[altAxis];

      var _min = _offset + overflow[_mainSide];

      var _max = _offset - overflow[_altSide];

      var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);

      popperOffsets[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = rect.width / element.offsetWidth || 1;
  var scaleY = rect.height / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

/* global Map:readonly, Set:readonly, ArrayBuffer:readonly */

var hasElementType = typeof Element !== 'undefined';
var hasMap = typeof Map === 'function';
var hasSet = typeof Set === 'function';
var hasArrayBuffer = typeof ArrayBuffer === 'function' && !!ArrayBuffer.isView;

// Note: We **don't** need `envHasBigInt64Array` in fde es6/index.js

function equal(a, b) {
  // START: fast-deep-equal es6/index.js 3.1.1
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }

    // START: Modifications:
    // 1. Extra `has<Type> &&` helpers in initial condition allow es6 code
    //    to co-exist with es5.
    // 2. Replace `for of` with es5 compliant iteration using `for`.
    //    Basically, take:
    //
    //    ```js
    //    for (i of a.entries())
    //      if (!b.has(i[0])) return false;
    //    ```
    //
    //    ... and convert to:
    //
    //    ```js
    //    it = a.entries();
    //    while (!(i = it.next()).done)
    //      if (!b.has(i.value[0])) return false;
    //    ```
    //
    //    **Note**: `i` access switches to `i.value`.
    var it;
    if (hasMap && (a instanceof Map) && (b instanceof Map)) {
      if (a.size !== b.size) return false;
      it = a.entries();
      while (!(i = it.next()).done)
        if (!b.has(i.value[0])) return false;
      it = a.entries();
      while (!(i = it.next()).done)
        if (!equal(i.value[1], b.get(i.value[0]))) return false;
      return true;
    }

    if (hasSet && (a instanceof Set) && (b instanceof Set)) {
      if (a.size !== b.size) return false;
      it = a.entries();
      while (!(i = it.next()).done)
        if (!b.has(i.value[0])) return false;
      return true;
    }
    // END: Modifications

    if (hasArrayBuffer && ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (a[i] !== b[i]) return false;
      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    // END: fast-deep-equal

    // START: react-fast-compare
    // custom handling for DOM elements
    if (hasElementType && a instanceof Element) return false;

    // custom handling for React/Preact
    for (i = length; i-- !== 0;) {
      if ((keys[i] === '_owner' || keys[i] === '__v' || keys[i] === '__o') && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner
        // Preact-specific: avoid traversing Preact elements' __v and __o
        //    __v = $_original / $_vnode
        //    __o = $_owner
        // These properties contain circular references and are not needed when
        // comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of elements

        continue;
      }

      // all other properties should be traversed as usual
      if (!equal(a[keys[i]], b[keys[i]])) return false;
    }
    // END: react-fast-compare

    // START: fast-deep-equal
    return true;
  }

  return a !== a && b !== b;
}
// end fast-deep-equal

var reactFastCompare = function isEqual(a, b) {
  try {
    return equal(a, b);
  } catch (error) {
    if (((error.message || '').match(/stack|recursion/i))) {
      // warn on circular references, don't crash
      // browsers give this different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      console.warn('react-fast-compare cannot handle circular refs');
      return false;
    }
    // some other error. we should definitely know about these
    throw error;
  }
};

var EMPTY_MODIFIERS = [];
var usePopper = function usePopper(referenceElement, popperElement, options) {
  if (options === void 0) {
    options = {};
  }

  var prevOptions = react.useRef(null);
  var optionsWithDefaults = {
    onFirstUpdate: options.onFirstUpdate,
    placement: options.placement || 'bottom',
    strategy: options.strategy || 'absolute',
    modifiers: options.modifiers || EMPTY_MODIFIERS
  };

  var _React$useState = react.useState({
    styles: {
      popper: {
        position: optionsWithDefaults.strategy,
        left: '0',
        top: '0'
      },
      arrow: {
        position: 'absolute'
      }
    },
    attributes: {}
  }),
      state = _React$useState[0],
      setState = _React$useState[1];

  var updateStateModifier = react.useMemo(function () {
    return {
      name: 'updateState',
      enabled: true,
      phase: 'write',
      fn: function fn(_ref) {
        var state = _ref.state;
        var elements = Object.keys(state.elements);
        setState({
          styles: fromEntries(elements.map(function (element) {
            return [element, state.styles[element] || {}];
          })),
          attributes: fromEntries(elements.map(function (element) {
            return [element, state.attributes[element]];
          }))
        });
      },
      requires: ['computeStyles']
    };
  }, []);
  var popperOptions = react.useMemo(function () {
    var newOptions = {
      onFirstUpdate: optionsWithDefaults.onFirstUpdate,
      placement: optionsWithDefaults.placement,
      strategy: optionsWithDefaults.strategy,
      modifiers: [].concat(optionsWithDefaults.modifiers, [updateStateModifier, {
        name: 'applyStyles',
        enabled: false
      }])
    };

    if (reactFastCompare(prevOptions.current, newOptions)) {
      return prevOptions.current || newOptions;
    } else {
      prevOptions.current = newOptions;
      return newOptions;
    }
  }, [optionsWithDefaults.onFirstUpdate, optionsWithDefaults.placement, optionsWithDefaults.strategy, optionsWithDefaults.modifiers, updateStateModifier]);
  var popperInstanceRef = react.useRef();
  useIsomorphicLayoutEffect(function () {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.setOptions(popperOptions);
    }
  }, [popperOptions]);
  useIsomorphicLayoutEffect(function () {
    if (referenceElement == null || popperElement == null) {
      return;
    }

    var createPopper$1 = options.createPopper || createPopper;
    var popperInstance = createPopper$1(referenceElement, popperElement, popperOptions);
    popperInstanceRef.current = popperInstance;
    return function () {
      popperInstance.destroy();
      popperInstanceRef.current = null;
    };
  }, [referenceElement, popperElement, options.createPopper]);
  return {
    state: popperInstanceRef.current ? popperInstanceRef.current.state : null,
    styles: state.styles,
    attributes: state.attributes,
    update: popperInstanceRef.current ? popperInstanceRef.current.update : null,
    forceUpdate: popperInstanceRef.current ? popperInstanceRef.current.forceUpdate : null
  };
};

var NOOP = function NOOP() {
  return void 0;
};

var NOOP_PROMISE = function NOOP_PROMISE() {
  return Promise.resolve(null);
};

var EMPTY_MODIFIERS$1 = [];
function Popper(_ref) {
  var _ref$placement = _ref.placement,
      placement = _ref$placement === void 0 ? 'bottom' : _ref$placement,
      _ref$strategy = _ref.strategy,
      strategy = _ref$strategy === void 0 ? 'absolute' : _ref$strategy,
      _ref$modifiers = _ref.modifiers,
      modifiers = _ref$modifiers === void 0 ? EMPTY_MODIFIERS$1 : _ref$modifiers,
      referenceElement = _ref.referenceElement,
      onFirstUpdate = _ref.onFirstUpdate,
      innerRef = _ref.innerRef,
      children = _ref.children;
  var referenceNode = react.useContext(ManagerReferenceNodeContext);

  var _React$useState = react.useState(null),
      popperElement = _React$useState[0],
      setPopperElement = _React$useState[1];

  var _React$useState2 = react.useState(null),
      arrowElement = _React$useState2[0],
      setArrowElement = _React$useState2[1];

  react.useEffect(function () {
    setRef$1(innerRef, popperElement);
  }, [innerRef, popperElement]);
  var options = react.useMemo(function () {
    return {
      placement: placement,
      strategy: strategy,
      onFirstUpdate: onFirstUpdate,
      modifiers: [].concat(modifiers, [{
        name: 'arrow',
        enabled: arrowElement != null,
        options: {
          element: arrowElement
        }
      }])
    };
  }, [placement, strategy, onFirstUpdate, modifiers, arrowElement]);

  var _usePopper = usePopper(referenceElement || referenceNode, popperElement, options),
      state = _usePopper.state,
      styles = _usePopper.styles,
      forceUpdate = _usePopper.forceUpdate,
      update = _usePopper.update;

  var childrenProps = react.useMemo(function () {
    return {
      ref: setPopperElement,
      style: styles.popper,
      placement: state ? state.placement : placement,
      hasPopperEscaped: state && state.modifiersData.hide ? state.modifiersData.hide.hasPopperEscaped : null,
      isReferenceHidden: state && state.modifiersData.hide ? state.modifiersData.hide.isReferenceHidden : null,
      arrowProps: {
        style: styles.arrow,
        ref: setArrowElement
      },
      forceUpdate: forceUpdate || NOOP,
      update: update || NOOP_PROMISE
    };
  }, [setPopperElement, setArrowElement, placement, state, styles, update, forceUpdate]);
  return unwrapArray(children)(childrenProps);
}

function Reference(_ref) {
  var children = _ref.children,
      innerRef = _ref.innerRef;
  var setReferenceNode = react.useContext(ManagerReferenceNodeSetterContext);
  var refHandler = react.useCallback(function (node) {
    setRef$1(innerRef, node);
    safeInvoke(setReferenceNode, node);
  }, [innerRef, setReferenceNode]); // ran on unmount

  react.useEffect(function () {
    return function () {
      return setRef$1(innerRef, null);
    };
  });
  react.useEffect(function () {
  }, [setReferenceNode]);
  return unwrapArray(children)({
    ref: refHandler
  });
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
var ResizeSensor = /** @class */ (function (_super) {
    __extends(ResizeSensor, _super);
    function ResizeSensor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.targetRef = react.createRef();
        _this.prevElement = undefined;
        _this.observer = new index(function (entries) { var _a, _b; return (_b = (_a = _this.props).onResize) === null || _b === void 0 ? void 0 : _b.call(_a, entries); });
        return _this;
    }
    ResizeSensor.prototype.render = function () {
        var onlyChild = react.Children.only(this.props.children);
        // if we're provided a ref to the child already, we don't need to attach one ourselves
        if (this.props.targetRef !== undefined) {
            return onlyChild;
        }
        return react.cloneElement(onlyChild, { ref: this.targetRef });
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
        if (!(this.targetRef.current instanceof Element)) {
            // stop everything if not defined
            this.observer.disconnect();
            return;
        }
        if (this.targetRef.current === this.prevElement && !force) {
            // quit if given same element -- nothing to update (unless forced)
            return;
        }
        else {
            // clear observer list if new element
            this.observer.disconnect();
            // remember element reference for next time
            this.prevElement = this.targetRef.current;
        }
        // observer callback is invoked immediately when observing new elements
        this.observer.observe(this.targetRef.current);
        if (this.props.observeParents) {
            var parent_1 = this.targetRef.current.parentElement;
            while (parent_1 != null) {
                this.observer.observe(parent_1);
                parent_1 = parent_1.parentElement;
            }
        }
    };
    ResizeSensor.displayName = DISPLAYNAME_PREFIX + ".ResizeSensor";
    return ResizeSensor;
}(AbstractPureComponent));

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
// Popper placement utils
// ======================
/** Converts a full placement to one of the four positions by stripping text after the `-`. */
function getBasePlacement$1(placement) {
    return placement.split("-")[0];
}
/** Returns true if position is left or right. */
function isVerticalPlacement(side) {
    return ["left", "right"].indexOf(side) !== -1;
}
/** Returns the opposite position. */
function getOppositePlacement$1(side) {
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
function getTransformOrigin(placement, arrowStyles) {
    var basePlacement = getBasePlacement$1(placement);
    if (arrowStyles === undefined) {
        return isVerticalPlacement(basePlacement)
            ? getOppositePlacement$1(basePlacement) + " " + getAlignment(basePlacement)
            : getAlignment(basePlacement) + " " + getOppositePlacement$1(basePlacement);
    }
    else {
        // const arrowSizeShift = state.elements.arrow.clientHeight / 2;
        var arrowSizeShift = 30 / 2;
        // can use keyword for dimension without the arrow, to ease computation burden.
        // move origin by half arrow's height to keep it centered.
        return isVerticalPlacement(basePlacement)
            ? getOppositePlacement$1(basePlacement) + " " + (parseInt(arrowStyles.top, 10) + arrowSizeShift) + "px"
            : parseInt(arrowStyles.left, 10) + arrowSizeShift + "px " + getOppositePlacement$1(basePlacement);
    }
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
// these paths come from the Core Kit Sketch file
// https://github.com/palantir/blueprint/blob/develop/resources/sketch/Core%20Kit.sketch
var SVG_SHADOW_PATH = "M8.11 6.302c1.015-.936 1.887-2.922 1.887-4.297v26c0-1.378" +
    "-.868-3.357-1.888-4.297L.925 17.09c-1.237-1.14-1.233-3.034 0-4.17L8.11 6.302z";
var SVG_ARROW_PATH = "M8.787 7.036c1.22-1.125 2.21-3.376 2.21-5.03V0v30-2.005" +
    "c0-1.654-.983-3.9-2.21-5.03l-7.183-6.616c-.81-.746-.802-1.96 0-2.7l7.183-6.614z";
// additional space between arrow and edge of target
var ARROW_SPACING = 4;
var POPOVER_ARROW_SVG_SIZE = 30;
var TOOLTIP_ARROW_SVG_SIZE = 22;
/* istanbul ignore next */
/** Modifier helper function to compute arrow rotate() transform */
function getArrowAngle(placement) {
    if (placement == null) {
        return 0;
    }
    // can only be top/left/bottom/right - auto is resolved internally
    switch (getBasePlacement$1(placement)) {
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
/* istanbul ignore next */
/**
 * Popper's builtin "arrow" modifier options.padding doesn't seem to work for us, so we
 * need to compute our own offset in the direction of the popover relative to the reference.
 */
function getArrowReferenceOffsetStyle(placement) {
    var offset = POPOVER_ARROW_SVG_SIZE / 2 - ARROW_SPACING;
    switch (getBasePlacement$1(placement)) {
        case "top":
            return { bottom: -offset };
        case "left":
            return { right: -offset };
        case "bottom":
            return { top: -offset };
        default:
            return { left: -offset };
    }
}
var PopoverArrow = function (_a) {
    var _b = _a.arrowProps, ref = _b.ref, style = _b.style, placement = _a.placement;
    return (
    // data attribute allows popper.js to position the arrow
    react.createElement("div", { className: POPOVER_ARROW, "data-popper-arrow": true, ref: ref, style: __assign(__assign({}, style), getArrowReferenceOffsetStyle(placement)) },
        react.createElement("svg", { viewBox: "0 0 " + POPOVER_ARROW_SVG_SIZE + " " + POPOVER_ARROW_SVG_SIZE, style: { transform: "rotate(" + getArrowAngle(placement) + "deg)" } },
            react.createElement("path", { className: POPOVER_ARROW + "-border", d: SVG_SHADOW_PATH }),
            react.createElement("path", { className: POPOVER_ARROW + "-fill", d: SVG_ARROW_PATH }))));
};
PopoverArrow.displayName = DISPLAYNAME_PREFIX + ".PopoverArrow";

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
var Tooltip = /** @class */ (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.popover = null;
        return _this;
    }
    Tooltip.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, children = _b.children, intent = _b.intent, popoverClassName = _b.popoverClassName, restProps = __rest(_b, ["children", "intent", "popoverClassName"]);
        var classes = classnames(TOOLTIP, (_a = {}, _a[MINIMAL] = this.props.minimal, _a), intentClass(intent), popoverClassName);
        return (react.createElement(Popover, __assign({ interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY, modifiers: {
                arrow: {
                    enabled: !this.props.minimal,
                },
                offset: {
                    options: {
                        offset: [0, TOOLTIP_ARROW_SVG_SIZE / 2],
                    },
                },
            } }, restProps, { autoFocus: false, canEscapeKeyClose: false, enforceFocus: false, lazy: true, popoverClassName: classes, portalContainer: this.props.portalContainer, ref: function (ref) { return (_this.popover = ref); } }), children));
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
}(react.PureComponent));

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
var PopoverPosition = __assign(__assign({}, Position), { AUTO: "auto", AUTO_END: "auto-end", AUTO_START: "auto-start" });

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
/**
 * Convert a position to a placement.
 *
 * @param position the position to convert
 */
function positionToPlacement(position) {
    /* istanbul ignore next */
    switch (position) {
        case PopoverPosition.TOP_LEFT:
            return "top-start";
        case PopoverPosition.TOP:
            return "top";
        case PopoverPosition.TOP_RIGHT:
            return "top-end";
        case PopoverPosition.RIGHT_TOP:
            return "right-start";
        case PopoverPosition.RIGHT:
            return "right";
        case PopoverPosition.RIGHT_BOTTOM:
            return "right-end";
        case PopoverPosition.BOTTOM_RIGHT:
            return "bottom-end";
        case PopoverPosition.BOTTOM:
            return "bottom";
        case PopoverPosition.BOTTOM_LEFT:
            return "bottom-start";
        case PopoverPosition.LEFT_BOTTOM:
            return "left-end";
        case PopoverPosition.LEFT:
            return "left";
        case PopoverPosition.LEFT_TOP:
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
var PopoverInteractionKind = {
    CLICK: "click",
    CLICK_TARGET_ONLY: "click-target",
    HOVER: "hover",
    HOVER_TARGET_ONLY: "hover-target",
};
/**
 * @template T target component props inteface
 */
var Popover = /** @class */ (function (_super) {
    __extends(Popover, _super);
    function Popover() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hasDarkParent: false,
            isOpen: _this.getIsOpen(_this.props),
        };
        /**
         * DOM element that contains the popover.
         * When `usePortal={true}`, this element will be portaled outside the usual DOM flow,
         * so this reference can be very useful for testing.
         */
        _this.popoverElement = null;
        /** DOM element that contains the target. */
        _this.targetElement = null;
        /** Popover ref handler */
        _this.popoverRef = refHandler(_this, "popoverElement", _this.props.popoverRef);
        /** Target ref handler */
        _this.targetRef = function (el) { return (_this.targetElement = el); };
        // a flag that lets us detect mouse movement between the target and popover,
        // now that mouseleave is triggered when you cross the gap between the two.
        _this.isMouseInTargetOrPopover = false;
        // a flag that indicates whether the target previously lost focus to another
        // element on the same page.
        _this.lostFocusOnSamePage = true;
        _this.isControlled = function () { return _this.props.isOpen !== undefined; };
        // arrow is disabled if minimal, or if the arrow modifier was explicitly disabled
        _this.isArrowEnabled = function () { var _a, _b; return !_this.props.minimal && ((_b = (_a = _this.props.modifiers) === null || _a === void 0 ? void 0 : _a.arrow) === null || _b === void 0 ? void 0 : _b.enabled) !== false; };
        _this.isHoverInteractionKind = function () {
            return (_this.props.interactionKind === PopoverInteractionKind.HOVER ||
                _this.props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY);
        };
        /**
         * Instance method to instruct the `Popover` to recompute its position.
         *
         * This method should only be used if you are updating the target in a way
         * that does not cause it to re-render, such as changing its _position_
         * without changing its _size_ (since `Popover` already repositions when it
         * detects a resize).
         */
        _this.reposition = function () { var _a; return (_a = _this.popperScheduleUpdate) === null || _a === void 0 ? void 0 : _a.call(_this); };
        _this.renderTarget = function (_a) {
            var _b, _c;
            var _d;
            var popperChildRef = _a.ref;
            var _e = _this.props, children = _e.children, className = _e.className, fill = _e.fill, openOnTargetFocus = _e.openOnTargetFocus, renderTarget = _e.renderTarget;
            var isOpen = _this.state.isOpen;
            var isControlled = _this.isControlled();
            var isHoverInteractionKind = _this.isHoverInteractionKind();
            var targetTagName = _this.props.targetTagName;
            if (fill) {
                targetTagName = "div";
            }
            var ref = mergeRefs(popperChildRef, _this.targetRef);
            var targetEventHandlers = isHoverInteractionKind
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
            // Ensure target is focusable if relevant prop enabled
            var targetTabIndex = openOnTargetFocus && isHoverInteractionKind ? 0 : undefined;
            var targetProps = __assign({ 
                // N.B. this.props.className is passed along to renderTarget even though the user would have access to it.
                // If, instead, renderTarget is undefined and the target is provided as a child, this.props.className is
                // applied to the generated target wrapper element.
                className: classnames(className, POPOVER_TARGET, (_b = {},
                    _b[POPOVER_OPEN] = isOpen,
                    // this class is mainly useful for button targets
                    _b[ACTIVE] = !isControlled && isOpen && !isHoverInteractionKind,
                    _b)), ref: ref }, targetEventHandlers);
            var target;
            if (renderTarget !== undefined) {
                target = renderTarget(__assign(__assign({}, targetProps), { 
                    // if the consumer renders a tooltip target, it's their responsibility to disable that tooltip
                    // when *this* popover is open
                    isOpen: isOpen, tabIndex: targetTabIndex }));
            }
            else {
                var childTarget = ensureElement(react.Children.toArray(children)[0]);
                if (childTarget === undefined) {
                    return null;
                }
                var targetModifierClasses = (_c = {},
                    // this class is mainly useful for Blueprint <Button> targets; we should only apply it for
                    // uncontrolled popovers when they are opened by a user interaction
                    _c[ACTIVE] = isOpen && !isControlled && !isHoverInteractionKind,
                    // similarly, this class is mainly useful for targets like <Button>, <InputGroup>, etc.
                    _c[FILL] = fill,
                    _c);
                var clonedTarget = react.cloneElement(childTarget, {
                    className: classnames(childTarget.props.className, targetModifierClasses),
                    // force disable single Tooltip child when popover is open
                    disabled: isOpen && isElementOfType(childTarget, Tooltip) ? true : childTarget.props.disabled,
                    tabIndex: (_d = childTarget.props.tabIndex) !== null && _d !== void 0 ? _d : targetTabIndex,
                });
                var wrappedTarget = react.createElement(targetTagName, targetProps, clonedTarget);
                target = wrappedTarget;
            }
            return (react.createElement(ResizeSensor, { targetRef: ref, onResize: _this.reposition }, target));
        };
        _this.renderPopover = function (popperProps) {
            var _a;
            var _b = _this.props, interactionKind = _b.interactionKind, usePortal = _b.usePortal;
            var isOpen = _this.state.isOpen;
            // compute an appropriate transform origin so the scale animation points towards target
            var transformOrigin = getTransformOrigin(popperProps.placement, _this.isArrowEnabled() ? popperProps.arrowProps.style : undefined);
            // need to update our reference to this function on every render as it will change.
            _this.popperScheduleUpdate = popperProps.update;
            var popoverHandlers = {
                // always check popover clicks for dismiss class
                onClick: _this.handlePopoverClick,
            };
            if (interactionKind === PopoverInteractionKind.HOVER ||
                (!usePortal && interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY)) {
                popoverHandlers.onMouseEnter = _this.handleMouseEnter;
                popoverHandlers.onMouseLeave = _this.handleMouseLeave;
            }
            var basePlacement = getBasePlacement$1(popperProps.placement);
            var popoverClasses = classnames(POPOVER, (_a = {},
                _a[DARK] = _this.props.inheritDarkTheme && _this.state.hasDarkParent,
                _a[MINIMAL] = _this.props.minimal,
                _a[POPOVER_CAPTURING_DISMISS] = _this.props.captureDismiss,
                _a), POPOVER_CONTENT_PLACEMENT + "-" + basePlacement, _this.props.popoverClassName);
            return (react.createElement(Overlay, { autoFocus: _this.props.autoFocus, backdropClassName: POPOVER_BACKDROP, backdropProps: _this.props.backdropProps, canEscapeKeyClose: _this.props.canEscapeKeyClose, canOutsideClickClose: _this.props.interactionKind === PopoverInteractionKind.CLICK, enforceFocus: _this.props.enforceFocus, hasBackdrop: _this.props.hasBackdrop, isOpen: isOpen, onClose: _this.handleOverlayClose, onClosed: _this.props.onClosed, onClosing: _this.props.onClosing, onOpened: _this.props.onOpened, onOpening: _this.props.onOpening, transitionDuration: _this.props.transitionDuration, transitionName: POPOVER, usePortal: _this.props.usePortal, portalClassName: _this.props.portalClassName, portalContainer: _this.props.portalContainer },
                react.createElement("div", { className: POPOVER_TRANSITION_CONTAINER, ref: popperProps.ref, style: popperProps.style },
                    react.createElement(ResizeSensor, { onResize: _this.reposition, targetRef: _this.popoverRef },
                        react.createElement("div", __assign({ className: popoverClasses, style: { transformOrigin: transformOrigin }, ref: _this.popoverRef }, popoverHandlers),
                            _this.isArrowEnabled() && (react.createElement(PopoverArrow, { arrowProps: popperProps.arrowProps, placement: popperProps.placement })),
                            react.createElement("div", { className: POPOVER_CONTENT }, _this.props.content))))));
        };
        _this.handleTargetFocus = function (e) {
            if (_this.props.openOnTargetFocus && _this.isHoverInteractionKind()) {
                if (e.relatedTarget == null && !_this.lostFocusOnSamePage) {
                    // ignore this focus event -- the target was already focused but the page itself
                    // lost focus (e.g. due to switching tabs).
                    return;
                }
                _this.handleMouseEnter(e);
            }
        };
        _this.handleTargetBlur = function (e) {
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
        };
        _this.handleMouseEnter = function (e) {
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
        };
        _this.handleMouseLeave = function (e) {
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
        };
        _this.handlePopoverClick = function (e) {
            var eventTarget = e.target;
            var eventPopover = eventTarget.closest("." + POPOVER);
            var isEventFromSelf = eventPopover === _this.popoverElement;
            var isEventPopoverCapturing = eventPopover === null || eventPopover === void 0 ? void 0 : eventPopover.classList.contains(POPOVER_CAPTURING_DISMISS);
            // an OVERRIDE inside a DISMISS does not dismiss, and a DISMISS inside an OVERRIDE will dismiss.
            var dismissElement = eventTarget.closest("." + POPOVER_DISMISS + ", ." + POPOVER_DISMISS_OVERRIDE);
            var shouldDismiss = dismissElement === null || dismissElement === void 0 ? void 0 : dismissElement.classList.contains(POPOVER_DISMISS);
            // dismiss selectors from the "V1" version of Popover in the core pacakge
            // we expect these to be rendered by MenuItem, which at this point has no knowledge of Popover
            // this can be removed once Popover is merged into core in v4.0
            var dismissElementV1 = eventTarget.closest("." + POPOVER_DISMISS + ", ." + POPOVER_DISMISS_OVERRIDE);
            var shouldDismissV1 = dismissElementV1 === null || dismissElementV1 === void 0 ? void 0 : dismissElementV1.classList.contains(POPOVER_DISMISS);
            var isDisabled = eventTarget.closest(":disabled, ." + DISABLED) != null;
            if ((shouldDismiss || shouldDismissV1) && !isDisabled && (!isEventPopoverCapturing || isEventFromSelf)) {
                _this.setOpenState(false, e);
            }
        };
        _this.handleOverlayClose = function (e) {
            if (_this.targetElement === null || e === undefined) {
                return;
            }
            var eventTarget = e.target;
            var isClickInsideTarget = elementIsOrContains(_this.targetElement, eventTarget);
            // if click was in target, target event listener will handle things, so don't close here
            if (!isClickInsideTarget || e.nativeEvent instanceof KeyboardEvent) {
                _this.setOpenState(false, e);
            }
        };
        _this.handleTargetClick = function (e) {
            // ensure click did not originate from within inline popover before closing
            if (!_this.props.disabled && !_this.isElementInPopover(e.target)) {
                if (_this.props.isOpen == null) {
                    _this.setState(function (prevState) { return ({ isOpen: !prevState.isOpen }); });
                }
                else {
                    _this.setOpenState(!_this.props.isOpen, e);
                }
            }
        };
        return _this;
    }
    Popover.prototype.getIsOpen = function (props) {
        var _a;
        // disabled popovers should never be allowed to open.
        if (props.disabled) {
            return false;
        }
        else {
            return (_a = props.isOpen) !== null && _a !== void 0 ? _a : props.defaultIsOpen;
        }
    };
    Popover.prototype.render = function () {
        var _a = this.props, disabled = _a.disabled, content = _a.content, placement = _a.placement, _b = _a.position, position = _b === void 0 ? "auto" : _b, positioningStrategy = _a.positioningStrategy;
        var isOpen = this.state.isOpen;
        var isContentEmpty = content == null || (typeof content === "string" && content.trim() === "");
        if (isContentEmpty) {
            // need to do this check in render(), because `isOpen` is derived from
            // state, and state can't necessarily be accessed in validateProps.
            if (!disabled && isOpen !== false && !isNodeEnv("production")) {
                console.warn(POPOVER_WARN_EMPTY_CONTENT);
            }
            // just render the target without a content overlay if there is no content to display
            return this.renderTarget({ ref: noop$1 });
        }
        return (react.createElement(Manager, null,
            react.createElement(Reference, null, this.renderTarget),
            react.createElement(Popper, { innerRef: this.popoverRef, placement: placement !== null && placement !== void 0 ? placement : positionToPlacement(position), strategy: positioningStrategy, modifiers: this.computePopperModifiers() }, this.renderPopover)));
    };
    Popover.prototype.componentDidMount = function () {
        this.updateDarkParent();
    };
    Popover.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
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
        if (prevProps.popoverRef !== this.props.popoverRef) {
            setRef(prevProps.popoverRef, null);
            this.popoverRef = refHandler(this, "popoverElement", this.props.popoverRef);
            setRef(this.props.popoverRef, this.popoverElement);
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
            console.warn(POPOVER_HAS_BACKDROP_INTERACTION);
        }
        if (props.placement !== undefined && props.position !== undefined) {
            console.warn(POPOVER_WARN_PLACEMENT_AND_POSITION_MUTEX);
        }
        var childrenCount = react.Children.count(props.children);
        var hasRenderTargetPropp = props.renderTarget !== undefined;
        if (childrenCount === 0 && !hasRenderTargetPropp) {
            console.warn(POPOVER_REQUIRES_TARGET);
        }
        if (childrenCount > 1) {
            console.warn(POPOVER_WARN_TOO_MANY_CHILDREN);
        }
        if (childrenCount > 0 && hasRenderTargetPropp) {
            console.warn(POPOVER_WARN_DOUBLE_TARGET);
        }
    };
    Popover.prototype.computePopperModifiers = function () {
        var _a, _b, _c, _d;
        var modifiers = this.props.modifiers;
        return [
            __assign({ enabled: this.isArrowEnabled(), name: "arrow" }, modifiers === null || modifiers === void 0 ? void 0 : modifiers.arrow),
            __assign(__assign({ name: "computeStyles" }, modifiers === null || modifiers === void 0 ? void 0 : modifiers.computeStyles), { options: __assign({ adaptive: true, 
                    // We disable the built-in gpuAcceleration so that
                    // Popper.js will return us easy to interpolate values
                    // (top, left instead of transform: translate3d)
                    // We'll then use these values to generate the needed
                    // css transform values blended with the react-spring values
                    gpuAcceleration: false }, (_a = modifiers === null || modifiers === void 0 ? void 0 : modifiers.computeStyles) === null || _a === void 0 ? void 0 : _a.options) }),
            __assign(__assign({ enabled: this.isArrowEnabled(), name: "offset" }, modifiers === null || modifiers === void 0 ? void 0 : modifiers.offset), { options: __assign({ offset: [0, POPOVER_ARROW_SVG_SIZE / 2] }, (_b = modifiers === null || modifiers === void 0 ? void 0 : modifiers.offset) === null || _b === void 0 ? void 0 : _b.options) }),
            __assign(__assign({ name: "flip" }, modifiers === null || modifiers === void 0 ? void 0 : modifiers.flip), { options: __assign({ boundary: this.props.boundary, rootBoundary: this.props.rootBoundary }, (_c = modifiers === null || modifiers === void 0 ? void 0 : modifiers.flip) === null || _c === void 0 ? void 0 : _c.options) }),
            __assign(__assign({ name: "preventOverflow" }, modifiers === null || modifiers === void 0 ? void 0 : modifiers.preventOverflow), { options: __assign({ boundary: this.props.boundary, rootBoundary: this.props.rootBoundary }, (_d = modifiers === null || modifiers === void 0 ? void 0 : modifiers.preventOverflow) === null || _d === void 0 ? void 0 : _d.options) }),
        ];
    };
    // a wrapper around setState({ isOpen }) that will call props.onInteraction instead when in controlled mode.
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
    Popover.prototype.updateDarkParent = function () {
        if (this.props.usePortal && this.state.isOpen) {
            var hasDarkParent = this.targetElement != null && this.targetElement.closest("." + DARK) != null;
            this.setState({ hasDarkParent: hasDarkParent });
        }
    };
    Popover.prototype.isElementInPopover = function (element) {
        return this.popoverElement != null && this.popoverElement.contains(element);
    };
    Popover.displayName = DISPLAYNAME_PREFIX + ".Popover";
    Popover.defaultProps = {
        boundary: "clippingParents",
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
        openOnTargetFocus: true,
        // N.B. we don't set a default for `placement` or `position` here because that would trigger
        // a warning in validateProps if the other prop is specified by a user of this component
        positioningStrategy: "absolute",
        renderTarget: undefined,
        targetTagName: "span",
        transitionDuration: 300,
        usePortal: true,
    };
    return Popover;
}(AbstractPureComponent));
function noop$1() {
    // no-op
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
        var classes = classnames((_a = {},
            _a[TEXT_OVERFLOW_ELLIPSIS] = this.props.ellipsize,
            _a), this.props.className);
        var _b = this.props, children = _b.children, tagName = _b.tagName, title = _b.title;
        return react.createElement(tagName, {
            className: classes,
            ref: function (ref) { return (_this.textRef = ref); },
            title: title !== null && title !== void 0 ? title : (this.state.isContentOverflowing ? this.state.textContent : undefined),
        }, children);
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
        tagName: "div",
    };
    return Text;
}(AbstractPureComponent));

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
        var _c = this.props, active = _c.active, className = _c.className, children = _c.children, disabled = _c.disabled, icon = _c.icon, intent = _c.intent, labelClassName = _c.labelClassName, labelElement = _c.labelElement, multiline = _c.multiline, popoverProps = _c.popoverProps, shouldDismissPopover = _c.shouldDismissPopover, text = _c.text, textClassName = _c.textClassName, _d = _c.tagName, tagName = _d === void 0 ? "a" : _d, htmlTitle = _c.htmlTitle, htmlProps = __rest(_c, ["active", "className", "children", "disabled", "icon", "intent", "labelClassName", "labelElement", "multiline", "popoverProps", "shouldDismissPopover", "text", "textClassName", "tagName", "htmlTitle"]);
        var hasSubmenu = children != null;
        var intentClass$1 = intentClass(intent);
        var anchorClasses = classnames(MENU_ITEM, intentClass$1, (_a = {},
            _a[ACTIVE] = active,
            _a[INTENT_PRIMARY] = active && intentClass$1 == null,
            _a[DISABLED] = disabled,
            // prevent popover from closing when clicking on submenu trigger or disabled item
            _a[POPOVER_DISMISS] = shouldDismissPopover && !disabled && !hasSubmenu,
            _a), className);
        var target = react.createElement(tagName, __assign(__assign(__assign({}, htmlProps), (disabled ? DISABLED_PROPS : {})), { className: anchorClasses }), react.createElement(Icon, { icon: icon }), react.createElement(Text, { className: classnames(FILL, textClassName), ellipsize: !multiline, title: htmlTitle }, text), this.maybeRenderLabel(labelElement), hasSubmenu ? react.createElement(CaretRight, null) : undefined);
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
        return (react.createElement(Popover, __assign({ autoFocus: false, captureDismiss: false, disabled: disabled, enforceFocus: false, hoverCloseDelay: 0, interactionKind: "hover", modifiers: {
                // 20px padding - scrollbar width + a bit
                flip: { options: { padding: 20 } },
                // shift popover up 5px so MenuItems align
                offset: { options: { offset: [undefined, -5] } },
                preventOverflow: { options: { padding: 20 } },
            }, placement: "right-start", usePortal: false }, popoverProps, { content: react.createElement(Menu, null, children), minimal: true, popoverClassName: classnames(MENU_SUBMENU, popoverProps === null || popoverProps === void 0 ? void 0 : popoverProps.popoverClassName) }), target));
    };
    MenuItem.defaultProps = {
        disabled: false,
        multiline: false,
        popoverProps: {},
        shouldDismissPopover: true,
        text: "",
    };
    MenuItem.displayName = DISPLAYNAME_PREFIX + ".MenuItem";
    return MenuItem;
}(AbstractPureComponent));
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
}(AbstractPureComponent));

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
}(AbstractPureComponent));

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
var HTMLSelect = react.forwardRef(function (props, ref) {
    var _a;
    var className = props.className, children = props.children, disabled = props.disabled, fill = props.fill, iconProps = props.iconProps, large = props.large, minimal = props.minimal, _b = props.options, options = _b === void 0 ? [] : _b, htmlProps = __rest(props, ["className", "children", "disabled", "fill", "iconProps", "large", "minimal", "options"]);
    var classes = classnames(HTML_SELECT, (_a = {},
        _a[DISABLED] = disabled,
        _a[FILL] = fill,
        _a[LARGE] = large,
        _a[MINIMAL] = minimal,
        _a), className);
    var optionChildren = options.map(function (option) {
        var optionProps = typeof option === "object" ? option : { value: option };
        return react.createElement("option", __assign({}, optionProps, { key: optionProps.value, children: optionProps.label || optionProps.value }));
    });
    return (react.createElement("div", { className: classes },
        react.createElement("select", __assign({ disabled: disabled, ref: ref }, htmlProps, { multiple: false }),
            optionChildren,
            children),
        react.createElement(DoubleCaretVertical, __assign({}, iconProps))));
});
HTMLSelect.displayName = DISPLAYNAME_PREFIX + ".HTMLSelect";

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
var NS$2 = getClassNamespace();
var DATEINPUT = NS$2 + "-dateinput";
var DATEINPUT_POPOVER = DATEINPUT + "-popover";
var DATEPICKER = NS$2 + "-datepicker";
var DATEPICKER_CAPTION = DATEPICKER + "-caption";
var DATEPICKER_CAPTION_MEASURE = DATEPICKER_CAPTION + "-measure";
var DATEPICKER_DAY = "DayPicker-Day";
var DATEPICKER_DAY_WRAPPER = DATEPICKER + "-day-wrapper";
var DATEPICKER_FOOTER = DATEPICKER + "-footer";
var DATEPICKER_MONTH_SELECT = DATEPICKER + "-month-select";
var DATEPICKER_YEAR_SELECT = DATEPICKER + "-year-select";
var DATEPICKER_NAVBAR = DATEPICKER + "-navbar";
var DATEPICKER_NAVBUTTON = "DayPicker-NavButton";
var DATEPICKER_TIMEPICKER_WRAPPER = DATEPICKER + "-timepicker-wrapper";
var DATERANGEPICKER = NS$2 + "-daterangepicker";
var DATERANGEPICKER_SHORTCUTS = DATERANGEPICKER + "-shortcuts";
var TIMEPICKER = NS$2 + "-timepicker";
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
    return TimeUnitMetadataStore[unit].className;
}
function getTimeUnitMax(unit) {
    return TimeUnitMetadataStore[unit].max;
}
function getTimeUnitMin(unit) {
    return TimeUnitMetadataStore[unit].min;
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
var TimeUnitMetadataStore = (_a$1 = {},
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
        var rightOffset = Math.max(2, monthSelectWidth - monthTextWidth - Icon.SIZE_STANDARD - 2);
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
}(AbstractPureComponent));

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
            this.props.hideLeftNavButton || (react.createElement(Button, { className: classes.navButtonPrev, disabled: areSameMonth(month, minDate), icon: react.createElement(ChevronLeft, null), minimal: true, onClick: this.handlePreviousClick })),
            this.props.hideRightNavButton || (react.createElement(Button, { className: classes.navButtonNext, disabled: areSameMonth(month, maxDate), icon: react.createElement(ChevronRight, null), minimal: true, onClick: this.handleNextClick }))));
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
    function TimePicker(props) {
        var _this = _super.call(this, props) || this;
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
        var value = props.minTime;
        if (props.value != null) {
            value = props.value;
        }
        else if (props.defaultValue != null) {
            value = props.defaultValue;
        }
        _this.state = _this.getFullStateFromValue(value, props.useAmPm);
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
        var shouldStateUpdate = didMinTimeChange || didMaxTimeChange || didBoundsChange || didPropValueChange;
        var value = this.state.value;
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
            react.createElement(Icon, { icon: isDirectionUp ? "chevron-up" : "chevron-down" })));
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
     * Generates a full TimePickerState object with all text fields set to formatted strings based on value
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
    function DatePicker(props) {
        var _this = _super.call(this, props) || this;
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
            (_b = (_a = _this.props.timePickerProps).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, time);
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
        if (timePrecision == null && timePickerProps === DatePicker.defaultProps.timePickerProps) {
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
        timePickerProps: {},
        todayButtonText: "Today",
    };
    DatePicker.displayName = DISPLAYNAME_PREFIX + ".DatePicker";
    return DatePicker;
}(AbstractPureComponent));
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
        // Last element in popover that is tabbable, and the one that triggers popover closure
        // when the user press TAB on it
        _this.lastTabbableElement = null;
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
            _this.registerPopoverBlurHandler();
            _this.safeInvokeInputProp("onBlur", e);
        };
        _this.handleInputKeyDown = function (e) {
            var _a;
            // HACKHACK: https://github.com/palantir/blueprint/issues/4165
            /* eslint-disable deprecation/deprecation */
            if (e.which === ENTER) {
                var nextDate = _this.parseDate(_this.state.valueString);
                _this.handleDateChange(nextDate, true, true);
            }
            else if (e.which === TAB) {
                _this.setState({ isOpen: false });
            }
            else if (e.which === ESCAPE) {
                _this.setState({ isOpen: false });
                (_a = _this.inputElement) === null || _a === void 0 ? void 0 : _a.blur();
            }
            _this.safeInvokeInputProp("onKeyDown", e);
        };
        _this.getLastTabbableElement = function () {
            var _a, _b;
            // Popover contents are well structured, but the selector will need
            // to be updated if more focusable components are added in the future
            var tabbableElements = (_a = _this.popoverContentElement) === null || _a === void 0 ? void 0 : _a.querySelectorAll("input, [tabindex]:not([tabindex='-1'])");
            var numOfElements = (_b = tabbableElements === null || tabbableElements === void 0 ? void 0 : tabbableElements.length) !== null && _b !== void 0 ? _b : 0;
            // Keep track of the last focusable element in popover and add
            // a blur handler, so that when:
            // * user tabs to the next element, popover closes
            // * focus moves to element within popover, popover stays open
            var lastTabbableElement = numOfElements > 0 ? tabbableElements[numOfElements - 1] : null;
            return lastTabbableElement;
        };
        // focus DOM event listener (not React event)
        _this.handlePopoverBlur = function (e) {
            var _a;
            var relatedTarget = e.relatedTarget;
            if (relatedTarget == null) {
                // Support IE11 (#2924)
                relatedTarget = document.activeElement;
            }
            var eventTarget = e.target;
            // Beware: this.popoverContentElement is sometimes null under Chrome
            if (relatedTarget == null ||
                (_this.popoverContentElement != null && !_this.popoverContentElement.contains(relatedTarget))) {
                // Exclude the following blur operations that makes "body" the activeElement
                // and would close the Popover unexpectedly
                // - On disabled change months buttons
                // - DayPicker day elements, their "blur" will be managed at its own onKeyDown
                var isChangeMonthEvt = eventTarget.classList.contains(DATEPICKER_NAVBUTTON);
                var isChangeMonthButtonDisabled = isChangeMonthEvt && eventTarget.disabled;
                var isDayPickerDayEvt = eventTarget.classList.contains(DATEPICKER_DAY);
                if (!isChangeMonthButtonDisabled && !isDayPickerDayEvt) {
                    _this.handleClosePopover();
                }
            }
            else if (relatedTarget != null) {
                _this.unregisterPopoverBlurHandler();
                _this.lastTabbableElement = _this.getLastTabbableElement();
                (_a = _this.lastTabbableElement) === null || _a === void 0 ? void 0 : _a.addEventListener("blur", _this.handlePopoverBlur);
            }
        };
        _this.registerPopoverBlurHandler = function () {
            var _a;
            if (_this.popoverContentElement != null) {
                _this.unregisterPopoverBlurHandler();
                _this.lastTabbableElement = _this.getLastTabbableElement();
                (_a = _this.lastTabbableElement) === null || _a === void 0 ? void 0 : _a.addEventListener("blur", _this.handlePopoverBlur);
            }
        };
        _this.unregisterPopoverBlurHandler = function () {
            var _a;
            (_a = _this.lastTabbableElement) === null || _a === void 0 ? void 0 : _a.removeEventListener("blur", _this.handlePopoverBlur);
        };
        _this.handleShortcutChange = function (_, selectedShortcutIndex) {
            _this.setState({ selectedShortcutIndex: selectedShortcutIndex });
        };
        return _this;
    }
    DateInput.prototype.componentWillUnmount = function () {
        this.unregisterPopoverBlurHandler();
    };
    DateInput.prototype.render = function () {
        var _this = this;
        var _a = this.state, value = _a.value, valueString = _a.valueString;
        var dateString = this.state.isInputFocused ? valueString : getFormattedDateString(value, this.props);
        var dateValue = isDateValid(value) ? value : null;
        var dayPickerProps = __assign(__assign({}, this.props.dayPickerProps), { 
            // If the user presses the TAB key on a DayPicker Day element and the lastTabbableElement is also a DayPicker Day
            // element, the popover should be closed
            onDayKeyDown: function (day, modifiers, e) {
                var _a, _b, _c;
                if (e.key === "Tab" &&
                    !e.shiftKey && ((_a = _this.lastTabbableElement) === null || _a === void 0 ? void 0 : _a.classList.contains(DATEPICKER_DAY))) {
                    _this.setState({ isOpen: false });
                }
                (_c = (_b = _this.props.dayPickerProps).onDayKeyDown) === null || _c === void 0 ? void 0 : _c.call(_b, day, modifiers, e);
            }, 
            // dom elements for the updated month is not available when
            // onMonthChange is called. setTimeout is necessary to wait
            // for the updated month to be rendered
            onMonthChange: function (month) {
                var _a, _b;
                (_b = (_a = _this.props.dayPickerProps).onMonthChange) === null || _b === void 0 ? void 0 : _b.call(_a, month);
                _this.setTimeout(_this.registerPopoverBlurHandler);
            } });
        var wrappedPopoverContent = (react.createElement("div", { ref: this.handlePopoverContentRef },
            react.createElement(DatePicker, __assign({}, this.props, { dayPickerProps: dayPickerProps, onChange: this.handleDateChange, value: dateValue, onShortcutChange: this.handleShortcutChange, selectedShortcutIndex: this.state.selectedShortcutIndex }))));
        // assign default empty object here to prevent mutation
        var _b = this.props, _c = _b.inputProps, inputProps = _c === void 0 ? {} : _c, _d = _b.popoverProps, popoverProps = _d === void 0 ? {} : _d;
        var isErrorState = value != null && (!isDateValid(value) || !this.isDateInRange(value));
        return (react.createElement(Popover, __assign({ isOpen: this.state.isOpen && !this.props.disabled, fill: this.props.fill }, popoverProps, { autoFocus: false, className: classnames(popoverProps.className, this.props.className), content: wrappedPopoverContent, enforceFocus: false, onClose: this.handleClosePopover, popoverClassName: classnames(DATEINPUT_POPOVER, popoverProps.popoverClassName) }),
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
}(AbstractPureComponent));

export { DateInput, TimePicker, TimePrecision };
