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

var content
    header;

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

    // init navbar
    initNavbar(header, 0);

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

    let body = ops.append('div')
        .attr('id', 'body')
        .classed('row', true);

    // aside for filters
    let asidecol = body.append('div')
        .classed('col-3', true);

    asidecol.append('h4')
        .classed('my-header text-center', true)
        .text('Filters');

    let aside = asidecol.append('aside')
        .classed('sidebar', true);

    // div for the rng'd op
    let main = body.append('div')
        .attr('id', 'output-main')
        .classed('col', true);

    let output = main.append('div');

    // generation button
    let generate = main.append('div')
        .classed('text-center', true)
        .append('button')
        .text('Generate')
        .classed('site-btn w-75 mx-auto gradient-transparent border-highlight', true)
        .attr('id', 'generate')
        .on('click', function () {
            if (window.data.length <= 0) {
                output.text('');
                output.append('p')
                    .text("No ops match this filter/option set. Try another combination.")
                    .classed('no-match', true);
            } else {
                // generate rng for selected ops
                var rng = Math.floor(Math.random() * window.data.length);

                var op = window.data[rng];

                buildOpCard(op, output);

                // set the card-div height
                d3.select('#carddiv')
                    .classed('roulette-card', true);

                // make the op name a link
                d3.select('#op-name')
                    .html('')
                    .append('a')
                    .html(op.name + '&#128279;')
                    .attr('href', `ops.html#${op.name}`);

                // shift the opimg to the left
                d3.select('#opimg')
                    .classed('output-op-img-sm', true)
                    .classed('output-op-img', false);
            }
        })

    // ops left side
    let filters = aside.append('div')
        .classed('my-sidebar', true);

    // form for conditions
    let form = filters.append('div')
        .attr('id', 'r-op-form');

    // first: attacker/defender/both selection menu
    form.append('h5')
        .classed('my-header', true)
        .text('Operator Type');

    let rop_type_select = form.append("select")
        .classed('form-select bg-dark text-white', true)
        .attr('aria-label', 'Op Type Select');

    rop_type_select.append('option')
        .attr('value', '3')
        .text("Both");

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
        buildColumnChecklist(d3.select('#role-form'), window.roles, 1, true, buildData, 'role');

        // force new selection
        d3.select('#generate').node().click();
    });

    //
    // role filter
    //
    form.append('h5')
        .classed('my-header', true)
        .text('Role')

    let rop_role = form.append('div')
        .attr('id', 'role-form');
    buildColumnChecklist(rop_role, window.roles, 1, true, buildData, 'role');

    //
    // three main filter types: gender, role, speed
    //
    form.append('h5')
        .classed('my-header', true)
        .text('Gender');

    let rop_gender = form.append('div')
        .attr('id', 'gender-form');

    buildColumnChecklist(rop_gender, genders, 1, true, buildData, 'gender');

    //
    // speed filter
    //
    form.append('h5')
        .classed('my-header', true)
        .text('Speed');

    let rop_speed = form.append('div')
        .attr('id', 'speed-form');
    buildColumnChecklist(rop_speed, [1, 2, 3], 1, true, buildData, 'speed');

    // end left side
    filters.append('hr');

    // button and selected op button
    let rop_submit = filters.append('div')
        .attr('id', 'r-op-submit')

    generate.node().click();

    rop_submit.append('button')
        .text('Toggle All Filters')
        .classed('site-btn w-100 gradient-transparent border-highlight', true)
        .on('click', function () {
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
