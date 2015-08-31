(function (root) {
	"use strict";
	
	function _t (literals, ...substs) {
		return literals.raw.reduce((acc, lit, i) => {
			var subst = substs[i-1];
			
			if (Array.isArray(subst)) {
				subst = subst.join("");
			} else {
				subst = htmlEscape(subst);
			}

			return acc + subst + lit;
		});
	}

	function htmlEscape (str) {
		return str.toString()
			.replace(/&/g, "&amp;")
			.replace(/>/g, "&gt;")
			.replace(/</g, "&lt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;")
			.replace(/`/g, "&#96;");
	}

	// Save a reference to the global object
	root._t = _t;

}(this));