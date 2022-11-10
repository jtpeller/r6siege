// =================================================================
// = guns.js
// =  Description   : Builds guns.html
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================

/* GLOBALS */
// ids
var cid = "#content"
	hid = "#header"

var content, header;

// data (embedded on window for ease of access)
window.primaries = []
window.secondaries = [];
window.classes = [];
window.data = [];

//
// build the page
//
document.addEventListener("DOMContentLoaded", function() {
    // select all elements
    header = d3.select(hid);
    content = d3.select(cid);

    // init the navbar and footer first (data promise delays load times)
    initNavbar(header, 1);

	// load all data w/ d3 utils
	Promise.all([
		d3.json('data/primary.json'),
		d3.json('data/secondary.json')
	]).then(function(values) {
		// set all necessary data
		window.primaries = values[0].primary
		window.secondaries = values[1].secondary

        setMaxValues(window.primaries, window.secondaries);
		initGuns();
	})
})

function initGuns() { 
	//
	// section for randomizing operators
	//
	var guns = content.append('div')
		.classed('row section', true)
		.attr('id', 'r-guns')
	
	// title and separator
	guns.append('h2')
		.html("Gun Roulette");

    let body = guns.append('div')
        .attr('id', 'body')
        .classed('row', true);

	// guns left side
	let asidecol = body.append('div')
		.classed('col-3', true);

    asidecol.append('h4')
        .classed('my-header text-center', true)
        .text('Filters');

    let aside = asidecol.append('aside')
        .classed('sidebar', true);

	// guns right side
	let main = body.append('div')
        .attr('id', 'output-main')
		.classed('col', true);

    let output = main.append('div');
    
	let generate = main.append('div')
        .classed('text-center', true)
        .append('button')
        .text('Generate')
        .classed('site-btn w-75 gradient-transparent border-highlight', true)
        .attr('id', 'generate')
        .on('click', function() {
            if (window.data.length <= 0) {
                output.text('');
                output.append('p')
                    .text("No ops match this filter/option set. Try another combination.")
                    .classed('no-match', true);
            } else {
                // generate rng for selected guns
                var rng = Math.floor(Math.random() * window.data.length);

                var gun = window.data[rng];
                output.html('');
                buildGunCard(gun, output, isPrimary(gun));

                // set card-div height
                d3.select('#carddiv')
                    .classed('roulette-card', true);

                // make the header a link
                d3.select(`#gun-name`)
                    .html('')
                    .append('a')
                    .html(gun.name + '&#128279;')
                    .attr('href', `guns.html#${gun.name}`);
            }
        }.bind(this));

	// form for conditions
    let filters = aside.append('div')
        .classed('my-sidebar', true);

	let form = filters.append('div')
		.attr('id', 'r-gun-form')

    // selection form for gun type (primary v. secondary)
    form.append('h4')
        .classed('my-header', true)
        .text('Gun Type');

    let type_select = form.append('select')
        .classed('form-select bg-dark text-white', true)
        .style('width', '75%')
        .attr('aria-label', 'Gun Type Select');

    type_select.append('option')
        .attr('value', '3')
        .text("Both");

    type_select.append('option')
        .attr('value', '1')
        .text("Primaries only");
    
    type_select.append('option')
        .attr('value', '2')
        .text('Secondaries only');

    // on page load, it'll be both primaries/secondaries
    window.data = [...window.primaries, ...window.secondaries];
    window.classes = [...primary_types, ...secondary_types];

    // on user change:
    type_select.on('change', function() {
        buildData();

        // update roles
        d3.select('#class-form').html('');
        buildChecklist(d3.select('#class-form'), window.classes, true, buildData, 'class');

        // force new selection
        d3.select('#generate').node().click();
    })

    //
    // side form
    //
    form.append('h4')
        .classed('my-header', true)
        .text('Side');

    let rgun_side = form.append('select')
        .classed('form-select bg-dark text-white', true)
        .style('width', '75%')
        .attr('aria-label', 'Side Select');

    rgun_side.append('option')
        .attr('value', '3')
        .text("Both");

    rgun_side.append('option')
        .attr('value', '1')
        .text("Attackers");
    
    rgun_side.append('option')
        .attr('value', '2')
        .text('Defenders');

    rgun_side.on('change', function() {
        buildData();

        // force new selection
        d3.select('#generate').node().click();
    })

	// gun class form
	form.append("h4")
        .classed('my-header', true)
		.text('Gun Class');

    let rgun_class = form.append('div')
        .attr('id', 'class-form');
    buildChecklist(rgun_class, window.classes, true, buildData, 'class');

    // make sure data is built
    buildData();

    generate.node().click();    // generate a gun on page load.
    
    filters.append('button')
        .text('Toggle All Filters')
        .classed('site-btn gradient-transparent border-highlight', true)
        .on('click', function() {
            var x = form.selectAll('input[type=checkbox]').property('checked');
            form.selectAll('input[type=checkbox]').property('checked', !x)  // this makes me feel smart
            if (x) {    // if x was true, then all the filters have just been unchecked, so data is now empty
                window.data = [];
            } else {
                buildData();
            }
        })


    /**
     * this function builds the dataset based on the selected conditions
     * and filters the user can modify.
     */
    function buildData() {
        // get selected gun type
        var temp = type_select.property('value');

        // init data based on type
        switch (temp) {
            case '1':   // primary
                window.data = [...window.primaries];
                window.classes = [...primary_types];
                break;
            case '2':   // secondary
                window.data = [...window.secondaries];
                window.classes = [...secondary_types];
                break;
            default:    // both primary/secondaries
                window.data = [...window.primaries, ...window.secondaries];
                window.classes = [...primary_types, ...secondary_types];
        }
        window.classes.sort();
        
        // filter based on selected attacker/defender
        temp = rgun_side.property('value');
        var list = ["Attacker", "Defender"]
        switch (temp) {
            case '1':   // attacker only
                filterIncludes([true, false], 'team', list);
                break;
            case '2':   // secondary
                filterIncludes([false, true], 'team', list);
                break;
            default:    // both primary/secondaries
                filterIncludes([true, true], 'team', list);
        }

        // filter based on selected gun class
        var temp = rgun_class.selectAll('input[type=checkbox]')._groups[0];
        var options = [];
        for (var i = 0; i < temp.length; i++) {
            options.push(temp[i].checked);
        }
        filter(options, 'type', window.classes);
    }
}

function isPrimary(gun) {
    for (var i = 0; i < window.primaries.length; i++) {
        if (window.primaries[i].name == gun) {
            return true;
        }
    }
    return false;
}
