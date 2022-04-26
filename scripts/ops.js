// =================================================================
// = ops.js
// =  Description   : Builds ops.html
// =  Author        : jtpeller
// =  Date          : March 28, 2022
// =================================================================

/* GLOBALS */
// ids
var cid = "#content"
	hid = "#header"
	fid = "#footer"

var content
	header
	footer;

// data
var atkops, defops, gadgets;
window.data = [];       // subset of ops to be built based on conditions

//
// build the page
//
document.addEventListener("DOMContentLoaded", function() {
    // select all elements
    header = d3.select(hid);
    content = d3.select(cid);
    footer = d3.select(fid);

    // init the navbar and footer first (data promise delays load times)
    initNavbar(header);
    initFooter(footer);

	// load all data w/ d3 utils
	Promise.all([
		d3.json('data/atk.json'),
		d3.json('data/def.json'),
        d3.json('data/gadgets.json')
	]).then(function(values) {
		// set all necessary data
		atkops = values[0].atk
		defops = values[1].def
        gadgets = values[2]
		initRandomOps();
	})
})

function initRandomOps() { 
	//
	// section for randomizing operators
	//
	var ops = content.append('div')
		.classed('row section', true)
		.attr('id', 'r-ops')
	
	// title and separator
	ops.append('h2')
		.html("Operator Roulette")
		.append('hr');

	// ops left side
	let left = ops.append('div')
		.classed('col', true)

	// ops right side
	let right = ops.append('div')
		.classed('col', true)

	// form for conditions
	let rop_form = left.append('div')
		.attr('id', 'r-op-form')
		//.classed('conditions', true)

	// add a checkbox for each filter
	rop_form.append("h4")
		.text('Filters')
	for (var i = 0; i < conditions.length; i++) {
		var div = rop_form.append('div')
			.classed('form-check form-switch', true);
		div.append('input')
			.classed('form-check-input', true)
			.attr('type', 'checkbox')
			.attr('value', '')
			.attr('id', 'r-op-check-'+i)
			.property('checked', true)  // set all as selected
            .on('click', buildData)
		div.append('label')
			.classed('form-check-label', true)
			.attr('for', 'r-op-check-'+i)
			.text(conditions[i]);
	}
    buildData();

    left.append('hr');

	// button and selected op button
	let rop_submit = left.append('div')
		.attr('id', 'r-op-submit')

	rop_submit.append('p')
		.text("Hit the button to RNG an op!");

	// add the part after the submission (the output)
	let rop_output = right.append('div')
		.attr('id', 'r-op-output');

	rop_submit.append('button')
		.text('Generate')
		.classed('btn btn-outline-light', true)
		.on('click', function() {
			if (window.data.length <= 0) {
				rop_output.text("No ops match this filter/option set. Try another combination.");
			} else {
				// generate rng for selected ops
				var rng = Math.floor(Math.random() * window.data.length);

				var selected = window.data[rng];
				//rchosenop.text('Here is your selected op');
				rop_output.html('');

				// now, format the card accordingly
				rop_output.style('width', '50rem');
					
				// add the card's image
				rop_output.append('img')
					.classed('center', true)
					.style('width', '10rem')
					.style('height', '10rem')
					.attr('src', fetchOpImage(selected.name))
					.attr('alt', selected.name + "_logo.svg")

				var body = rop_output.append('div')
					.classed('card-body', true)
				
				body.append('h3')
					.text(selected.name)
					.classed('text-center', true)
					.append('hr')

				// format primaries
				var primaries = selected.primary;
				var ptext = "<ul>";
				for (var i = 0; i < primaries.length; i++) {
					ptext += "<li>" + primaries[i].name + ": "
					ptext += primaries[i].type + "<br></li>"
				}
				ptext += "</ul>";

				// format secondaries
				var secondaries = selected.secondary;
				var stext = "<ul>";
				for (var i = 0; i < secondaries.length; i++) { 
					stext += "<li>" + secondaries[i].name + ": "
					stext += secondaries[i].type + "<br></li>"
				}
				stext += "</ul>";

				// format gadgets
				var gg = selected.gadget;
				var gtext = "<ul>";
				for (var i = 0; i < gg.length; i++) {
					gtext += "<li>" + gg[i].name + " x"
					gtext += getGadgetCount(gg[i].name) + "<br></li>"
				}
				gtext += "</ul>";
				
				var body_text = `
					<b>Organization</b>: ${selected.organization}<br>
					<b>Gender</b>: ${selected.gender}<br>
					<b>Primaries</b>: <br>
						${ptext}
					<b>Secondaries</b>: <br>
						${stext}
					<b>Gadgets</b>: <br>
						${gtext}
					<b>Special</b>: ${selected.special}<br>
				`
				
				body.append('p')
					.html(body_text)

				// make some nice changes
				rop_output.classed('my-card', true)
			}
		})
	
    /**
     * this function builds the dataset based on the selected conditions
     * and filters the user can modify.
     */
    function buildData() {
        //
        // first, get the conditions
        //
        var elems = rop_form.selectAll('.form-check-input')._groups[0]
        //console.log(elems);
        
        // use these options to make an object
        var cond = {
            atk: elems[0].checked,
            def: elems[1].checked,
            male: elems[2].checked,
            female: elems[3].checked,
        }
        console.log(cond);

        //
        // use the filters to modify the op-set for rng
        // 

        // filter with atk/def
        if (cond.atk && cond.def) {
            window.data = [...atkops, ...defops];
        } else if (cond.atk) {
            window.data = [...atkops];
        } else if (cond.def) {
            window.data = [...defops];
        } else {
            window.data = [];
        }

        // remove other filters
        for (var i = 0; i < data.length; i++) { 
            if ( window.data[i].gender.includes('Male') && !cond.male ) {
                window.data.splice(i, 1);
                i--;
            } else if ( window.data[i].gender.includes('Female') && !cond.female) {
                window.data.splice(i, 1);
                i--;
            }
        }
        console.log(window.data);
    }
}

function getGadgetCount(gadget) {
    return gadgets[gadget.toLowerCase().replaceAll(' ', '_')];
}