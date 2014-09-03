var app = {
	data: null,

	initialize: function () {
		var self = this;

		//Load JSON data
		$.getJSON("data/data.json")
        .done(function(json) {
            //console.log(json);
            self.data = json;

            self.buildViews();
        })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
	},

    buildViews: function () {
        this.headerView();
        this.menuView();
        this.timelineView();
        this.skillsView();
        this.randomFactsView();
        this.footerView();
    },

	headerView: function () {
        var infos = this.data.infos;

        //Load Template
        $("#header").load("tpl/header.html", function () {

            //Populate Template
            $("#picture").prop('src', 'img/' + infos.picture);
            $("#name").html(infos.name);
            $("#title").html(infos.title);

            for (var i = 0; i < infos.links.length; i++)
                $("#" + infos.links[i].type).prop('href', infos.links[i].link);

            $("#mail").prop('href', 'mailto:' + infos.mail);
        });
	},

    menuView: function () {
        $("#menu").load("tpl/menu.html");
    },

	timelineView: function () {
        var timeline = this.data.timeline;

        var self = this;

        //Load Template
        $.get("tpl/timeline.html", function(template) {
            $("#timeline").append("<div id='tl-line'></div>");
            $("#timeline").append("<ul id='tl'></ul>");
            
            //Render Template
            for (var i = 0; i < timeline.length; i++) {
                $("#tl").append("<div class='tl-date' id='" + timeline[i].date + "'>" + timeline[i].date + "</div>");

                //Populate Template
                var el = timeline[i].elements;

                for (var j = 0; j < el.length; j++) {
                    $("#tl").append("<li id='" + i + j + "' class='tl-element'></li>");
                    $("#" + i + j).append(template); 

                    $("#" + i + j).addClass(el[j].type);   

                    $("#" + i + j + " .tl-title").html(el[j].title);
                    $("#" + i + j + " .tl-at").html(el[j].at);
                    $("#" + i + j + " .tl-description").html(el[j].description);

                    $("#" + i + j + " .tl-flag-img").prop('src', 'img/flag/' + el[j].flag + '.svg');
                }
            }

            self.showTimeline();
        });
	},

	skillsView: function () {
        var skills = this.data.skills;

		//Load Template
        $.get("tpl/skills.html", function(template) {
            
            //Skills containers
            $("#skills").append("<div id='hard-skills'></div>");
            $("#skills").append("<div id='soft-skills'></div>");

            //Render Template
            var hard = skills[0].list;
            var soft = skills[1].list;

            //Hard Skills
            for (var i = 0; i < hard.length; i++) {
                $("#hard-skills").append(
                    "<ul id='hard-" + i + "'>"+
                        "<span class='skill-label' onclick='app.showHideSkills(\"hard-"+ i +"\")'>" + hard[i].type +  "</span>" +
                        "<img src='img/icon/radar-view.png'  class='radar-view-icon' onclick='app.showHideSkills(\"hard-"+ i +"\", \"radar\")' alt='Radar View' />"+
                        "<img src='img/icon/list-view.png' class='list-view-icon' onclick='app.showHideSkills(\"hard-"+ i +"\", \"list\")' alt='List View' />"+
                    "</ul>");

                var list = hard[i].list;

                //Radar Data Object
                var radarData = {
                    labels:[],
                    datasets:[
                        {
                            label: hard[i].type,
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: []
                        }
                    ]
                };

                //List View
                $("#hard-" + i).append("<div id='hard-" + i + "-list' class='list-view'></div>");
                    
                for (var j = 0; j < list.length; j++) {
                    $("#hard-" + i + "-list").append("<li id='hard-" + i + j + "' class='skill-element'></li>");
                    $("#hard-" + i + j).append(template);
                    
                    //List View
                    $("#hard-" + i + j + " .skill-name").html(list[j].name);
                    $("#hard-" + i + j + " .skill-description").html(list[j].description);
                    $("#hard-" + i + j + " .skill-icon").prop('src', 'img/icon/skills/' + list[j].icon + '.png');

                    var full = Math.floor(list[j].level / 2);
                    var k = 0;
                    for (; k < full; k++)
                        $("#hard-" + i + j + " #star-" + k).prop('src', 'img/star/full.png');

                    if(list[j].level % 2)
                        $("#hard-" + i + j + " #star-" + k).prop('src', 'img/star/half.png');

                    //Radar View Data
                    radarData.labels.push(list[j].name);
                    radarData.datasets[0].data.push(list[j].level);
                }

                //Radar View
                $("#hard-" + i).append("<div id='hard-" + i + "-radar' class='radar-view'></div>");  
                $("#hard-" + i + " .radar-view").append("<canvas class='skill-radar' height='300px'></canvas>");

                //Create Radar Chart
                var ctx = $("#hard-" + i + "-radar .skill-radar").get(0).getContext("2d");
                window.myRadar = new Chart(ctx).Radar(radarData, {
                    // Boolean - If we want to override with a hard coded scale
                    scaleOverride: true,

                    // ** Required if scaleOverride is true **
                    // Number - The number of steps in a hard coded scale
                    scaleSteps: 5,
                    // Number - The value jump in the hard coded scale
                    scaleStepWidth: 2,
                    // Number - The scale starting value
                    scaleStartValue: 0,
                    
                    // String - Template string for single tooltips
                    tooltipTemplate: "<%=label%>",
                });
            }

            //Soft Skills
            for (var i = 0; i < soft.length; i++) {
                $("#soft-skills").append(
                    "<ul id='soft-" + i + "'>"+
                        "<span class='skill-label'  onclick='app.showHideSkills(\"soft-"+ i +"\")'>" + soft[i].type + "</span>"+
                        "<img src='img/icon/radar-view.png' class='radar-view-icon' onclick='app.showHideSkills(\"soft-"+ i +"\", \"radar\")' alt='Radar View' />"+
                        "<img src='img/icon/list-view.png' class='list-view-icon' onclick='app.showHideSkills(\"soft-"+ i +"\", \"list\")' alt='List View' />"+
                    "</ul>");

                if(i != 0)
                    $("#soft-skills").append("<span class='soft-"+i+"-pers-traits'><i>Personality Traits by </i><a href='http://www.talentoday.com' target='_blank'>Talentoday</a>.</span>");

                var list = soft[i].list;

                //Radar Data Object
                var radarData = {
                    labels:[],
                    datasets:[
                        {
                            label: hard[i].type,
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: []
                        }
                    ]
                };

                //List View
                $("#soft-" + i).append("<div id='soft-" + i + "-list' class='list-view'></div>");

                for (var j = 0; j < list.length; j++) {
                    $("#soft-" + i + "-list").append("<li id='soft-" + i + j + "' class='skill-element'></li>");
                    $("#soft-" + i + j).append(template);

                    //List View
                    $("#soft-" + i + j + " .skill-name").html(list[j].name);
                    $("#soft-" + i + j + " .skill-description").html(list[j].description);
                    $("#soft-" + i + j + " .skill-icon").prop('src', 'img/icon/skills/' + list[j].icon + '.png');

                    var full = Math.floor(list[j].level / 2);
                    var k = 0;
                    for (; k < full; k++)
                        $("#soft-" + i + j + " #star-" + k).prop('src', 'img/star/full.png');

                    if(list[j].level % 2)
                        $("#soft-" + i + j + " #star-" + k).prop('src', 'img/star/half.png');

                    //Radar View Data
                    radarData.labels.push(list[j].name);
                    radarData.datasets[0].data.push(list[j].level);
                }

                //Radar View
                $("#soft-" + i).append("<div id='soft-" + i + "-radar' class='radar-view'></div>");  
                $("#soft-" + i + " .radar-view").append("<canvas class='skill-radar' height='300px'></canvas>");

                //Create Radar Chart
                var ctx = $("#soft-" + i + "-radar .skill-radar").get(0).getContext("2d");
                window.myRadar = new Chart(ctx).Radar(radarData, {
                    // Boolean - If we want to override with a hard coded scale
                    scaleOverride: true,

                    // ** Required if scaleOverride is true **
                    // Number - The number of steps in a hard coded scale
                    scaleSteps: 5,
                    // Number - The value jump in the hard coded scale
                    scaleStepWidth: 2,
                    // Number - The scale starting value
                    scaleStartValue: 0,
                    
                    // String - Template string for single tooltips
                    tooltipTemplate: "<%=label%>",
                });
            }
        });
	},

	randomFactsView: function () {
        //Load Template
        $.get("tpl/randomFacts.html", function(template) {
            $("#randomFacts").append(template);
        });
	},

    footerView: function () {
        $("#footer").load("tpl/footer.html");
    },

    showTimeline: function () {
        //Update Menu
        $("#a-timeline").css({'text-decoration': 'underline','color': 'blue'});
        $("#a-skills").css({'text-decoration': 'none','color': 'black'});
        $("#a-randomFacts").css({'text-decoration': 'none','color': 'black'});

        //Update content
        $("#timeline").show();
        $("#skills").hide();
        $("#randomFacts").hide();

        //Menu bar
        $("#skills-menu").hide();


        //Calculate line height
        $("#tl-line").css('height', $("#tl").height() - 5);

        //Hide the timeline elements that are outside the viewport
        $('.tl-element').each(function(i, el){
            if($(el).offset().top > $(window).scrollTop()+$(window).height()*0.9 && $(el).css('opacity') == 1) {
                $(el).css('opacity', 0);
            }
        });

        //Show the timeline elements that appear in the viewport on scrolling
        $("#content").on('scroll', function(){
            $('.tl-element').each(function(i, el){
                if($(el).offset().top <= $(window).scrollTop()+$(window).height()*0.9 && $(el).css('opacity') == 0) {
                    $(el).animate({'opacity': '1'}, 500);
                }
            });
        });
    },

    showSkills: function () {
        //Update Menu
        $("#a-timeline").css({'text-decoration': 'none','color': 'black'});
        $("#a-skills").css({'text-decoration': 'underline','color': 'blue'});
        $("#a-randomFacts").css({'text-decoration': 'none','color': 'black'});

        //Update content
        $("#timeline").hide();
        $("#skills").show();
        $("#randomFacts").hide();

        //Menu bar
        $("#skills-menu").show();
    },

    showRandomFacts: function () {
        //Update Menu
        $("#a-timeline").css({'text-decoration': 'none','color': 'black'});
        $("#a-skills").css({'text-decoration': 'none','color': 'black'});
        $("#a-randomFacts").css({'text-decoration': 'underline','color': 'blue'});

        //Update content
        $("#timeline").hide();
        $("#skills").hide();
        $("#randomFacts").show();

        //Menu bar
        $("#skills-menu").hide();


        var randomFacts = this.data.randomFacts;

        //Select a random fact
        var range = randomFacts.length;
        var i = Math.floor(Math.random() * range);

        //Add it to the template
        $("#randomFact").html(randomFacts[i].text);
    },

    showHardSkills: function () {
        //Update Menu
        $("#a-hard-skills").css({'text-decoration': 'underline','color': 'blue'});
        $("#a-soft-skills").css({'text-decoration': 'none','color': 'black'});

        //Update content
        $("#hard-skills").show();
        $("#soft-skills").hide();
    },

    showSoftSkills: function () {
        //Update Menu
        $("#a-hard-skills").css({'text-decoration': 'none','color': 'black'});
        $("#a-soft-skills").css({'text-decoration': 'underline','color': 'blue'});

        //Update content
        $("#hard-skills").hide();
        $("#soft-skills").show();  
    },

    showHideSkills: function (id, view) {
        //List View
        if (view == "list"){
            if($("#" + id + " .list-view").css('display') == 'none'){
                $("#" + id + " .list-view").show();
                $("#" + id + " .radar-view").hide();

                $("#" + id + " .list-view-icon").css('opacity', 1);
                $("#" + id + " .radar-view-icon").css('opacity', 0.5);

                $("." + id + "-pers-traits").hide();
            }
            else{
                $("#" + id + " .list-view").hide();
                $("#" + id + " .radar-view").hide();

                $("#" + id + " .list-view-icon").css('opacity', 0.5);
                $("#" + id + " .radar-view-icon").css('opacity', 0.5);

                $("." + id + "-pers-traits").show();
            }
        }

        //Radar View
        else if(view == "radar") {
            if($("#" + id + " .radar-view").css('display') == 'none'){
                $("#" + id + " .list-view").hide();
                $("#" + id + " .radar-view").show();

                $("#" + id + " .radar-view-icon").css('opacity', 1);
                $("#" + id + " .list-view-icon").css('opacity', 0.5);

                $("." + id + "-pers-traits").hide();
            }
            else{
                $("#" + id + " .list-view").hide();
                $("#" + id + " .radar-view").hide();

                $("#" + id + " .list-view-icon").css('opacity', 0.5);
                $("#" + id + " .radar-view-icon").css('opacity', 0.5);

                $("." + id + "-pers-traits").show();
            }
        }

        else {
            if($("#" + id + " .list-view").css('display') == 'none' && $("#" + id + " .radar-view").css('display') == 'none'){
                $("#" + id + " .list-view").show();
                $("#" + id + " .radar-view").hide();

                $("#" + id + " .list-view-icon").css('opacity', 1);
                $("#" + id + " .radar-view-icon").css('opacity', 0.5);

                $("." + id + "-pers-traits").hide();
            }
            else {
                $("#" + id + " .list-view").hide();
                $("#" + id + " .radar-view").hide();

                $("#" + id + " .list-view-icon").css('opacity', 0.5);
                $("#" + id + " .radar-view-icon").css('opacity', 0.5);

                $("." + id + "-pers-traits").show();
            }
        }
    }
};

$(document).ready(function() {
    app.initialize();
});