// =================================================================
// = guns-roulette.js
// =  Description   : Builds guns-roulette.html
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================

/* GLOBALS */
let content, header;

// data (embedded on window for ease of access)
window.primaries = []
window.secondaries = [];
window.classes = [];
window.data = [];

//
// build the page
//
document.addEventListener("DOMContentLoaded", function() {
    // create header
    header = d3.select('header');
    initNavbar(header, 1);

    // page content
    content = d3.select('main').append('div');
	var guns = content.append('div').classed('row', true);
    addTitle(guns, 'Gun Roulette');     // page title
    guns.append('p')                    // description
        .classed('standout', true)
        .html("Want to play a random gun? Bored of the same ol' guns? Want a new favorite gun? Press your luck!");

	// load all data w/ d3 utils
	Promise.all([
		d3.json('data/primary.json'),
		d3.json('data/secondary.json')
	]).then(function(values) {
		// set all necessary data
		window.primaries = values[0].primary
		window.secondaries = values[1].secondary

        setMaxValues(window.primaries, window.secondaries);
		initGuns(guns);
	})
})

function initGuns(guns) {
    let generate_div = guns.append('div');
    guns.append('hr');

    // roulette body
    let body = guns.append('div').classed('row', true);

    //
    // filters
    //
    let filtercol = body.append('div')
        .classed('col-sm-12 col-lg-4', true);

    let filter_acc = filtercol.append('div')
        .classed('accordion accordion-flush', true)
        .attr('id', 'filter-list')
        .append('div')
        .classed('accordion-item no-bkgd', true)

    // filter header
    filter_acc.append('h2')
        .classed('accordion-header no-border', true)
        .append('button')
        .classed('accordion-button siege-uppercase collapsed', true)
        .attr('type', 'button')
        .attr('data-bs-toggle', 'collapse')
        .attr('data-bs-target', '#filters-acc')
        .attr('aria-expanded', 'false')
        .attr('aria-controls', 'filters-acc')
        .text('Filters');

    // filter body
    var filter_content = filter_acc.append('div')
        .classed('accordion-collapse collapse', true)
        .attr('id', 'filters-acc')
        .attr('data-bs-parent', '#filters-list')

    let filter_body = filter_content.append('div')
        .classed('accordion-body', true);

    // filter accordion organized into grid
    var row = filter_body.append('div')
        .classed('row', true);  // row for filters / op-card

    var form = row.append('div')
        .classed('row', true);  // row inside filters accordion

    // form for conditions
    // first: primary/secondary/both selection menu
    addHeader(form, "Gun Type");

    let type_select = form.append('select')
        .classed('form-select bg-dark text-white siege-bold', true)
        .attr('id', 'gun-type-select')
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
        buildData();        // filter out data
        buildChecklist(d3.select('#class-form'), window.classes, true, buildData, 'class');
        d3.select('#generate').node().click();  // force new selection
    })

    //
    // side form
    //
    addHeader(form, "Team");
    var team = form.append('div').classed('uppercase', true)
    buildChecklist(team, ['Attacker', 'Defender'], true, buildData, 'team')

	// gun class form
    addHeader(form, "Gun Class");
    let gunclass = form.append('div')
        .classed('uppercase', true)
        .attr('id', 'class-form');      // note to me: keep this

    buildChecklist(gunclass, window.classes, true, buildData, 'class', 0);

    // add horizontal line after final filters category
    form.append('hr');

    // toggle all filters button
    let submit = row.append('div');
    submit.append('button')
        .text('Toggle All Filters')
        .classed('site-btn w-100 siege-uppercase gradient-transparent border-highlight', true)
        .on('click', function() {
            var x = form.selectAll('input[type=checkbox]').property('checked');
            form.selectAll('input[type=checkbox]').property('checked', !x)  // this makes me feel smart
            if (x) {    // if x was true, then all the filters have just been unchecked, so data is now empty
                window.data = [];
                setEnabled('#generate', false);     // disable button
            } else {
                setEnabled('#generate', true);
                buildData();
            }
        })

    //
    // div for the rng'd gun
    //
	let main = body.append('div')
		.classed('col', true);

    let output = main.append('div');
    
    // generation button
	let generate = generate_div.append('div')
        .classed('text-center', true)
        .append('button')
        .text('Generate')
        .classed('site-btn w-75 siege-uppercase gradient-transparent border-highlight', true)
        .attr('id', 'generate')
        .on('click', function() {
            // generate rng for selected guns
            var rng = Math.floor(Math.random() * window.data.length);
            var gun = window.data[rng];
            transitionGunCard(gun, output, isPrimary(gun.name));
        }.bind(this));
    
    // generate a gun on page load.
    var rng = Math.floor(Math.random() * window.data.length);
    var gun = window.data[rng];
    buildGunCard(gun, output, isPrimary(gun.name));

    // make the header a link
    d3.select(`#gun-name`)
        .html('')
        .append('a')
        .classed('link', true)
        .html(gun.name + '&#128279;')
        .attr('href', `guns.html#${gun.name}`);
    
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
        var temp = team.selectAll('input[type=checkbox]')._groups[0];
        var options = [];
        for (var i = 0; i < temp.length; i++) {
            options.push(temp[i].checked);
        }
        var list = ["Attacker", "Defender"]
        filterIncludes(options, 'team', list);

        // filter based on selected gun class
        var temp = gunclass.selectAll('input[type=checkbox]')._groups[0];
        var options = [];
        for (var i = 0; i < temp.length; i++) {
            options.push(temp[i].checked);
        }
        filter(options, 'type', window.classes);

        // enable/disable site button as needed
        if (window.data.length <= 0) {
            setEnabled('#generate', false);
        } else {
            setEnabled('#generate', true);
        }
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
