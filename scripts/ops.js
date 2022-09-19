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
window.data = [];       // subset of ops to be built based on filters
window.roles = [];      // subset of roles to be built based on op-type selection

//
// build the page
//
document.addEventListener("DOMContentLoaded", function () {
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
    ]).then(function (values) {
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
        .attr('id', 'r-ops');

    // title and separator
    ops.append('h2')
        .html("Operator Roulette");

    // ops left side
    let left = ops.append('div')
        .classed('col', true);

    // ops right side
    let right = ops.append('div')
        .classed('col', true);

    // form for conditions
    let rop_form = left.append('div')
        .attr('id', 'r-op-form');

    // first: attacker/defender/both selection menu
    rop_form.append('h4')
        .classed('my-h4', true)
        .text('Operator Type');

    let rop_type_select = rop_form.append("select")
        .classed('form-select bg-dark text-white', true)
        .style('width', '75%')
        .attr('aria-label', 'Op Type Select');

    rop_type_select.append('option')
        .attr('value', '3')
        .text("Both Attackers and Defenders");

    rop_type_select.append('option')
        .attr('value', '1')
        .text("Attackers only");

    rop_type_select.append('option')
        .attr('value', '2')
        .text("Defenders only");

    // on page load, it will be both atk/def
    window.data = [...atkops, ...defops];
    window.roles = [...gen_roles, ...atk_roles, ...def_roles];
    window.roles.sort();

    // but when the user changes it, the data will need to be updated
    rop_type_select.on('change', function () {
        buildData();

        // update roles
        d3.select('#role-form').html('');
        buildColumnChecklist(d3.select('#role-form'), window.roles, 2, true, buildData, 'role');

        // force new selection
        d3.select('#generate').node().click();
    });

    //
    // role filter
    //
    rop_form.append('h4')
        .classed('my-h4', true)
        .text('Role')

    let rop_role = rop_form.append('div')
        .attr('id', 'role-form');
    buildColumnChecklist(rop_role, window.roles, 2, true, buildData, 'role');

    //
    // three main filter types: gender, role, speed
    //
    rop_form.append('h4')
        .classed('my-h4', true)
        .text('Gender');

    let rop_gender = rop_form.append('div')
        .attr('id', 'gender-form');

    buildColumnChecklist(rop_gender, genders, 3, true, buildData, 'gender');

    //
    // speed filter
    //
    rop_form.append('h4')
        .classed('my-h4', true)
        .text('Speed');

    let rop_speed = rop_form.append('div')
        .attr('id', 'speed-form');
    buildColumnChecklist(rop_speed, [1, 2, 3], 3, true, buildData, 'speed');

    // end left side
    left.append('hr');

    // button and selected op button
    let rop_submit = left.append('div')
        .attr('id', 'r-op-submit')

    // add the part after the submission (the output)
    let rop_output = right.append('div')
        .attr('id', 'r-op-output');

    let generate = rop_submit.append('button')
        .text('Generate')
        .classed('btn btn-outline-light', true)
        .attr('id', 'generate')
        .on('click', function () {
            if (window.data.length <= 0) {
                rop_output.text('');
                rop_output.append('p')
                    .text("No ops match this filter/option set. Try another combination.")
                    .classed('no-match', true);
            } else {
                // generate rng for selected ops
                var rng = Math.floor(Math.random() * window.data.length);

                var selected = window.data[rng];
                // y7s3console.log(selected);
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

                //<b>Organization</b>: ${selected.organization}<br></br>
                var body_text = `
                    <b>Roles</b>: ${selected.role.sort()}<br>
                    <b>Speed</b>: ${selected.speed}<br>
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

    generate.node().click();

    rop_submit.append('button')
        .text('Toggle All Filters')
        .classed('btn btn-outline-light', true)
        .on('click', function () {
            var x = rop_form.selectAll('input[type=checkbox]').property('checked');
            rop_form.selectAll('input[type=checkbox]').property('checked', !x)  // this makes me feel smart
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
        // get op type
        var temp = rop_type_select.property('value');

        // update data based on type
        switch (temp) {
            case '1':       // attacker
                window.data = [...atkops];
                window.roles = [...gen_roles, ...atk_roles];
                break;
            case '2':       // defender
                window.data = [...defops];
                window.roles = [...gen_roles, ...def_roles];
                break;
            default:       // both atk/def
                window.data = [...atkops, ...defops];
                window.roles = [...gen_roles, ...atk_roles, ...def_roles];
        }
        window.roles.sort();

        // now, filter based on gender, role, and speed

        //
        // filtering gender
        //

        // get gender checklist states
        var temp = rop_gender.selectAll('input[type=checkbox]')._groups[0];
        var options = [];        // order is: female, male, non-binary
        for (var i = 0; i < temp.length; i++) {
            options.push(temp[i].checked);
        }
        //console.log(options);

        // filter
        filter(options, 'gender', genders);

        //
        // filtering role
        //

        // get role checklist states
        temp = rop_role.selectAll('input[type=checkbox]')._groups[0];
        options = [];
        for (var i = 0; i < temp.length; i++) {
            options.push(temp[i].checked);
        }
        filterIncludes(options, 'role', window.roles);

        //
        // filtering speed
        //

        // get speed checklist states
        temp = rop_speed.selectAll('input[type=checkbox]')._groups[0];
        options = [];
        for (var i = 0; i < temp.length; i++) {
            options.push(temp[i].checked);
        }
        filter(options, 'speed', [1, 2, 3]);

        //console.log(window.data);
    }
}

function getGadgetCount(gadget) {
    return gadgets[gadget.toLowerCase().replaceAll(' ', '_')];
}
