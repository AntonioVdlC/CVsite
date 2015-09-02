"use strict";

var MainView = Object.create(View, {
	// Data Queries
	queries: {
		value: ["infos"]
	},

	// Template
	template: {
		value: ({infos}) => _t`
			<div id="header">
				<img id="picture" src="img/${infos.picture}" alt="Profile Picture" />
				<a id="mail" href="mailto:${infos.mail}"  target="_blank"><img src="img/logo/mail.png" alt="Mail" /></a>
				<div id="links">
					${infos.links.map(link => _t`
						<a id="${link.type}" href="${link.link}"  target="_blank"><img class="logo" src="img/logo/${link.type}.png" alt="${link.type}" /></a>
					`)}
				</div>
				<div id="vertical-separator"></div>
				<h1 id="name">${infos.name}</h1>
				<h2 id="title">${infos.title}</h2>
			</div>

			<div id="menu">
				<p id="main-menu">
					<a href="#" id="a-timeline">Timeline</a> 
					| 
					<a href="#" id="a-skills">Skills</a> 
					| 
					<a href="#" id="a-random-facts">Random Facts</a>
				</p>
				<p id="skills-menu">
					<a href='#' id='a-hard-skills'>Technical Skills</a> 
					| 
					<a href='#' id='a-soft-skills'>Soft Skills</a>
				</p>
			</div>

			<div id="content">
				<div id="timeline"></div>
				<div id="skills"></div>
				<div id="random-facts"></div>
			</div>
			
			<div id="footer">
				<p>
					<span id="copyright"> 
						Copyright © 2015 Antonio Villagra De La Cruz.
					</span>
					<span id="license">
						This work is licensed under the <a href="https://github.com/AntonioVdlC/CVsite" target="_blank">MIT License</a>.
					</span>
				</p>
			</div>
		`
	},

	// Events
	events: {
		value: {
			// TODO - Router?
			"click #a-timeline": function showTimeline () {
				document.getElementById("timeline").style.display = "block";
				document.getElementById("skills").style.display = "none";
				document.getElementById("random-facts").style.display = "none";
			},
			"click #a-skills": function showSkills () {
				document.getElementById("timeline").style.display = "none";
				document.getElementById("skills").style.display = "block";
				document.getElementById("random-facts").style.display = "none";
			},
			"click #a-random-facts": function showRandomFacts () {
				document.getElementById("timeline").style.display = "none";
				document.getElementById("skills").style.display = "none";
				document.getElementById("random-facts").style.display = "block";
			}
		}
	}
});

MainView.render = function () {
	// Render the template
	this.$el.innerHTML = this.template(this.data);

	// Attach the event listeners
	this.attachEventListeners(this.events);

	// Initialize sub-views
	TimelineView.init({el: "timeline", parent: this});
	SkillsView.init({el: "skills", parent: this});
	RandomFactsView.init({el: "random-facts", parent: this});
};


document.addEventListener("DOMContentLoaded", function () {
	MainView.init();
});