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

	// guns left side
	let left = guns.append('div')
		.classed('col', true)

	// guns right side
	let right = guns.append('div')
		.classed('col', true)

	// form for conditions
	let rgun_form = left.append('div')
		.attr('id', 'r-gun-form')

    // selection form for gun type (primary v. secondary)
    rgun_form.append('h4')
        .classed('my-header', true)
        .text('Gun Type');

    let rgun_type_select = rgun_form.append('select')
        .classed('form-select bg-dark text-white', true)
        .style('width', '75%')
        .attr('aria-label', 'Gun Type Select');

    rgun_type_select.append('option')
        .attr('value', '3')
        .text("Both Primaries and Secondaries");

    rgun_type_select.append('option')
        .attr('value', '1')
        .text("Primaries only");
    
    rgun_type_select.append('option')
        .attr('value', '2')
        .text('Secondaries only');

    // on page load, it'll be both primaries/secondaries
    window.data = [...window.primaries, ...window.secondaries];
    window.classes = [...primary_types, ...secondary_types];

    // on user change:
    rgun_type_select.on('change', function() {
        buildData();

        // update roles
        d3.select('#class-form').html('');
        buildColumnChecklist(d3.select('#class-form'), window.classes, 2, true, buildData, 'class');

        // force new selection
        d3.select('#generate').node().click();
    })

    //
    // side form
    //
    rgun_form.append('h4')
        .classed('my-header', true)
        .text('Side');

    let rgun_side = rgun_form.append('select')
        .classed('form-select bg-dark text-white', true)
        .style('width', '75%')
        .attr('aria-label', 'Side Select');

    rgun_side.append('option')
        .attr('value', '3')
        .text("Both Attackers and Defenders");

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
	rgun_form.append("h4")
        .classed('my-header', true)
		.text('Gun Class');

    let rgun_class = rgun_form.append('div')
        .attr('id', 'class-form');
    buildColumnChecklist(rgun_class, window.classes, 2, true, buildData, 'class');

    // make sure data is built
    buildData();

    left.append('hr');

	// button and selected gun button
	let rgun_submit = left.append('div')
		.attr('id', 'r-gun-submit')

	// add the part after the submission (the output)
	let rgun_output = right.append('div')
		.attr('id', 'r-gun-output');

	let generate = rgun_submit.append('button')
		.text('Generate')
		.classed('btn btn-outline-light', true)
		.on('click', function() {
			if (window.data.length <= 0) {
                rgun_output.text('');
                rgun_output.append('p')
                    .text("No ops match this filter/option set. Try another combination.")
                    .classed('no-match', true);
			} else {
				// generate rng for selected guns
				var rng = Math.floor(Math.random() * window.data.length);

				var selected = window.data[rng];
				rgun_output.html('');

				// now, format the card accordingly
				rgun_output.classed('output-card', true);
					
				// add the card's image
				rgun_output.append('img')
					.classed('center gun-img', true)
					.attr('src', fetchGunImage(selected.name))
					.attr('alt', selected.name + "_logo.png")

				var body = rgun_output.append('div')
					.classed('card-body', true)
				
				body.append('h3')
					.text(selected.name)
					.classed('text-center', true);

                body.append('h5')
                    .text(isPrimary(selected.name) ? 'Primary' : 'Secondary')
                    .classed('text-center', true)
					.append('hr')

                // format properties
                var props = selected.properties;
                var ptext = `
                    <ul>
                        <li><b>Damage</b>: ${props.damage} (${props.suppressed_dmg == -1 ? "N/A" : props.suppressed_dmg})*<br></li>
                        <li><b>Firerate</b>: ${props.firerate == -1 ? "N/A" : props.firerate}<br></li>
                        <li><b>Mobility</b>: ${props.mobility}<br></li>
                        <li><b>Capacity</b>: ${props.capacity}<br></li>
                    </ul>
                    <br>
                    <p><i>*Note: Update Y7S3 removed the suppressor damage penalty.</i></p>
                `

                // format ops
                var body_text = `
                	<b>Type</b>: ${selected.type}<br>
                	<b>Properties</b>: <br>
                		${ptext}
                    <b>Operators with this gun</b>: <br>
                `
                
                body.append('p')
                    .classed('card-body', true)
                	.html(body_text);

                // append the ops image
                for (var i = 0; i < selected.ops.length; i++) {
                    var imgdiv = body.append('div')
                        .style('display', 'inline-block')
                        .classed('text-center', true)

                    imgdiv.append('a')
                        .attr('href', `ops.html#${selected.ops[j]}`)
                        .append('img')
                        .style('width', '4rem')
                        .attr('src', fetchOpImage(selected.ops[i]))
                        .attr('alt', selected.ops[i] + "_logo.png")
                }
                
                // make some nice changes
                rgun_output.classed('my-card', true)
			}
		}.bind(this));

    generate.node().click();    // generate a gun on page load.
	
    
    rgun_submit.append('button')
        .text('Toggle All Filters')
		.classed('btn btn-outline-light', true)
        .on('click', function() {
            var x = rgun_form.selectAll('input[type=checkbox]').property('checked');
            rgun_form.selectAll('input[type=checkbox]').property('checked', !x)  // this makes me feel smart
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
        var temp = rgun_type_select.property('value');

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
