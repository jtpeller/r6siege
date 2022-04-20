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
	fid = "#footer"

var content
	header
	footer;

// data
window.primaries = []
window.secondaries = [];

//
// build the page
//
document.addEventListener("DOMContentLoaded", function() {
	// load all data w/ d3 utils
	Promise.all([
		d3.json('data/primary.json'),
		d3.json('data/secondary.json')
	]).then(function(values) {
		// select all elements
		header = d3.select(hid);
		content = d3.select(cid);
		footer = d3.select(fid);

		// set all necessary data
		window.primaries = values[0].primary
		window.secondaries = values[1].secondary

		init();
	})
})

function init() {
	console.log('primary', window.primaries)
	console.log('secondary', window.secondaries)

	//
	// initialize the page
	//

	// initialize header
    initNavbar(header);

	// randomized guns (guns meeting some criteria)
	initGuns();
	
    // initialize the tiny little footer
    initFooter(footer);
}

function initGuns() { 
	//
	// section for randomizing operators
	//
	var guns = content.append('div')
		.classed('row section', true)
		.attr('id', 'r-guns')
	
	// title and separator
	guns.append('h2')
		.html("Randomize guns")
		.append('hr');

	// guns left side
	let left = guns.append('div')
		.classed('col', true)

	// guns right side
	let right = guns.append('div')
		.classed('col', true)

	// form for conditions
	let rgun_form = left.append('div')
		.attr('id', 'r-gun-form')

	// add a checkbox for each filter
	rgun_form.append("h4")
		.text('Filters')
	for (var i = 0; i < gcond.length; i++) {
		var div = rgun_form.append('div')
			.classed('form-check form-switch', true);
		div.append('input')
			.classed('form-check-input', true)
			.attr('type', 'checkbox')
			.attr('value', '')
			.attr('id', 'r-gun-check-'+i)
			.property('checked', true)  // set all as selected
		div.append('label')
			.classed('form-check-label', true)
			.attr('for', 'r-gun-check-'+i)
			.text(gcond[i]);
	}

	// button and selected gun button
	let rgun_submit = left.append('div')
		.attr('id', 'r-gun-submit')

	rgun_submit.append('p')
		.text("Hit the button to RNG an gun!");

	// add the part after the submission (the output)
	let rgun_output = right.append('div')
		.attr('id', 'r-gun-output');

	rgun_submit.append('button')
		.text('Generate a gun!')
		.classed('btn btn-light', true)
		.on('click', function() {
			//
			// first, get the conditions
			//
			var elems = rgun_form.selectAll('.form-check-input')._groups[0]
			//console.log(elems);
			
			// use these options to make an object
            let cond = [];
            for (var j = 0; j < elems.length; j++) {
                cond.push({
                    idx: gcond[j],
                    val: elems[j].checked
                })
            }
            console.log(cond);

            //
			// use the filters to modify the gun-set for rng
            // 
            let p = window.primaries;
            let s = window.secondaries

            // filter based on types of primaries
            let data = [];
            var conds_to_check = [];        // use a subset to speed up runtime
            if (cond[0].val && cond[1].val) {   // primary && secondary
                data = [...p, ...s];
                conds_to_check = cond.slice(4);
            } else if (cond[0].val) {
                data = [...p];
                conds_to_check = cond.slice(4, 10);
            } else if (cond[1].val) {
                data = [...s];
                conds_to_check = cond.slice(11);
            }
            console.log('conds_to_check', conds_to_check);

            // TODO: filter based on atk/def as well
            
            // filter based on conds_to_check
            for (var j = 0; j < data.length; j++) {
                for (var k = 0; k < conds_to_check.length; k++) {
                    if (data[j].type.includes(conds_to_check[k].idx) && !conds_to_check[k].val) { 
                        data.splice(j, 1);
                        j--;
                        if (j <= 0) {
                            break;
                        }
                    }
                }
            }
            console.log(data);

			if (data.length <= 0) {
				rgun_output.text("No guns match this filter/option set. Try another combination.");
			} else {
				// generate rng for selected guns
				var rng = Math.floor(Math.random() * data.length);

				var selected = data[rng];
				//rchosenop.text('Here is your selected gun');
				rgun_output.html('');

				// now, format the card accordingly
				rgun_output.style('width', '50rem');
					
				// add the card's image
				rgun_output.append('img')
					.classed('center gun-img', true)
					.style('width', '10rem')
					.attr('src', fetchGunImage(selected.name.includes(".44 Mag") ? selected.name.slice(1) : selected.name))
					.attr('alt', selected.name + "_logo.png")

				var body = rgun_output.append('div')
					.classed('card-body', true)
				
				body.append('h3')
					.text(selected.name)
					.classed('text-center', true)
					.append('hr')

                // format properties
                var props = selected.properties;
                var ptext = `
                    <ul>
                        <li><b>Damage</b>: ${props.damage} (${props.suppressed_dmg == -1 ? "N/A" : props.suppressed_dmg})<br></li>
                        <li><b>Firerate</b>: ${props.firerate == -1 ? "N/A" : props.firerate}<br></li>
                        <li><b>Mobility</b>: ${props.mobility}<br></li>
                        <li><b>Capacity</b>: ${props.capacity}<br></li>
                    </ul>
                `

                // format ops
                var ops = selected.ops.split('/');
                
                var body_text = `
                	<b>Type</b>: ${selected.type}<br>
                	<b>Properties</b>: <br>
                		${ptext}
                    <b>Operators with this gun</b>: <br>
                `
                
                body.append('p')
                	.html(body_text)

                // append the ops image
                for (var i = 0; i < ops.length; i++) {
                    var imgdiv = body.append('div')
                        .style('display', 'inline-block')
                        .classed('text-center', true)
                    imgdiv.append('img')
                        //.classed('center', true)
                        .style('width', '4rem')
                        .attr('src', buildLink(`resources/ops/png/${ops[i]}.png`))
                        .attr('alt', ops[i] + "_logo.png")
                }
                
                // make some nice changes
                rgun_output.classed('my-card', true)
			}
		}.bind(this))
	
}
