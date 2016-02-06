// -- Info Page -- \\

import scrollTo from "./../utils/scrollTo.js";

export default {
	events: events
};

// View events
function events () {
	// Scroll to the about page when 
	// clicking on the about link
	document
		.querySelector(".about-link a")
		.addEventListener("click", (e) => {
			e.preventDefault();
			scrollTo(document.getElementById("about"));
		});
}
