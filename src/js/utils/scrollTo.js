// -- ScrollTo -- \\
// Simple smooth scrolling to an element on the page

export default function scrollTo (element, duration = 200) {
	if (duration <= 0) return;

	let difference = element.offsetTop - document.body.scrollTop;
	let perTick = difference / duration * 10;

	setTimeout(function () {
		document.body.scrollTop = document.body.scrollTop + perTick;
		if (element.offsetTop === document.body.scrollTop) return;
		scrollTo(element, duration - 10);
	}, 10);
}
