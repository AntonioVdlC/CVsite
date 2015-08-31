"use strict";

var TimelineView = Object.create(View, {
	queries: {
		value: ["timeline"]
	},

	template: {
		// TODO - Calculate tl-line height dynamically
		value: data => _t`
			<div id="tl-line" style="height: 4800px;"></div> 
			<ul id="tl">
				${data.timeline.map(year => _t`
					<div class="tl-date" id="${year.date}">${year.date}</div>
					${year.elements.map(element => _t`
						<li class="tl-element ${element.type}">
							<span class="tl-flag">
								<img class="tl-flag-img" src="img/flag/${element.flag}.svg" alt="Flag">
							</span>
							<h2 class="tl-title">${element.title}</h2>
							<p class="tl-at">${element.at}</p>
							<p class="tl-description">${element.description}</p>
						</li>
					`)}
				`)}
			</ul>
		`
	},

	events: {
		value: {}
	}
});