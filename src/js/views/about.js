// -- About Page -- \\

export default {
	events: events
};

// View events
function events () {
	// Close all the details
	closeContentDetails(document);

	// Open the first one of each category
	Array
		.from(document.querySelectorAll(".about-container"))
		.forEach((category) => {
			let section = category.querySelector("li");
			openContentDetails(section);
		});

	// Open section on click
	Array
		.from(document.querySelectorAll(".about-container li"))
		.forEach((section) => {
			section.addEventListener("click", (e) => {
				if (e.target.className !== "about-container-content") {
					openContentDetails(section);
				}
			});
		});
}

// Close the content details of a given category
function closeContentDetails (category) {
	Array
		.from(category.querySelectorAll(".about-container-content"))
		.forEach((element) => {
			element.classList.remove("open");
			element.classList.add("closed");
		});
}

// Open the content details of a given section
function openContentDetails (section) {
	let content = section.querySelector(".about-container-content");

	if (content.className.indexOf("closed") > -1) {
		closeContentDetails(section.parentNode);

		content.classList.remove("closed");
		content.classList.add("open");
	}
}
