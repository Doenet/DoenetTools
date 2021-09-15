import { c as createCommonjsModule, a as commonjsGlobal } from '../common/_commonjsHelpers-b3efd043.js';
import { c as core } from '../common/core-acf8b131.js';

var encHex = createCommonjsModule(function (module, exports) {
(function (root, factory) {
	{
		// CommonJS
		module.exports = factory(core);
	}
}(commonjsGlobal, function (CryptoJS) {

	return CryptoJS.enc.Hex;

}));
});

export default encHex;
