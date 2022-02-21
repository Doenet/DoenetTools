import { c as createCommonjsModule, a as commonjsGlobal } from '../common/_commonjsHelpers-f5d70792.js';
import { c as core } from '../common/core-bf5b3132.js';

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
