// =================================================================
// = ops.js
// =  Description   : Builds ops.html
// =  Author        : jtpeller
// =  Date          : March 28, 2022
// =================================================================

/* GLOBALS */
let content, header;

// data
let atkops, defops, gadgets;
window.data = [];       // subset of ops to be built based on filters
window.roles = [];      // subset of roles to be built based on op-type selection

//
// build the page
//
document.addEventListener("DOMContentLoaded", function () {
    // create header
    header = d3.select('header');
    initNavbar(header, 0);

    // create content
    content = d3.select('main')
        .append('div');

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
    // page content
    var ops = content.append('div')
        .classed('row', true);

    // title and separator
    ops.append('h2')
        .classed('siege-uppercase page-title', true)
        .html("Operator Roulette");

    // description & generation button
    ops.append('p')
        .classed('standout', true)
        .html("Don't know what operator to play? Bored of playing the same 3 operators? Want to find a new main? Press your luck!")

    let generate_div = ops.append('div');

    ops.append('hr');

    // roulette body
    let body = ops.append('div')
        .classed('row', true);

    //
    // filters
    //
    let filtercol = body.append('div')
        .classed('col-sm-12 col-lg-4', true);

    buildAccordion(filtercol, 'Filters');
    let acc_body = filtercol.select("#Filters-body");

    // filter accordion organized into grid
    var row = acc_body.append('div')
        .classed('row', true);  // row for filters / op-card

    var form = row.append('div')
        .classed('row', true);  // row inside filters accordion

    // form for conditions
    // first: attacker/defender/both selection menu
    addHeader(form, "Operator Side");

    let optype_select = form.append("select")
        .classed('form-select bg-dark text-white siege-bold', true)
        .attr('aria-label', 'Op Type Select');

    optype_select.append('option')
        .attr('value', '3')
        .text("Both");

    optype_select.append('option')
        .attr('value', '1')
        .text("Attackers only");

    optype_select.append('option')
        .attr('value', '2')
        .text("Defenders only");

    // on page load, it will be both atk/def
    window.data = [...atkops, ...defops];
    window.roles = [...gen_roles, ...atk_roles, ...def_roles];
    window.roles.sort();

    // but when the user changes it, the data will need to be updated
    optype_select.on('change', function () {
        buildData();
        buildColumnChecklist(d3.select('#role-form'), window.roles, 1, true, buildData, 'role');
        d3.select('#generate').node().click();
    });

    //
    // three main filter types: gender, role, speed
    //
    // ROLE
    var rolecol = form.append('div')
        .classed('col-sm-12 col-md-6 col-lg-12', true);

    addHeader(rolecol, "Role");
    let role = rolecol.append('div')
        .classed('uppercase', true)
        .attr('id', 'role-form');
    
    buildColumnChecklist(role, window.roles, 1, true, buildData, 'role');

    // GENDER
    var col2 = form.append('div')
        .classed('col-sm-12 col-md-6 col-lg-12', true);
    
    addHeader(col2, "Gender");
    let gender = col2.append('div')
        .classed('uppercase', true)
        .attr('id', 'gender-form');

    buildColumnChecklist(gender, genders, 1, true, buildData, 'gender');

    // SPEED
    addHeader(col2, "Speed");
    let speed = col2.append('div')
        .classed('uppercase', true)
        .attr('id', 'speed-form');
    
    buildColumnChecklist(speed, [1, 2, 3], 1, true, buildData, 'speed');

    // add horizontal line after final filters category
    form.append('hr');

    // add the toggle button
    let submit = row.append('div');
    submit.append('button')
        .text('Toggle All Filters')
        .classed('site-btn w-100 siege-uppercase gradient-transparent border-highlight', true)
        .on('click', function () {
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
    // div for the rng'd op
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
        .on('click', function () {
            // generate rng for selected ops
            var rng = Math.floor(Math.random() * window.data.length);
            var op = window.data[rng];
            transitionOpCard(op, output);
        }.bind(this));
        
    // generate an op on page load.
    var rng = Math.floor(Math.random() * window.data.length);
    var op = window.data[rng];
    buildOpCard(op, output);
    
    // make the op name a link
    d3.select('#op-name')
        .html('')
        .append('a')
        .classed('link', true)
        .html(op.name + '&#128279;')
        .attr('href', `ops.html#${op.name}`);

    /**
     * this function builds the dataset based on the selected conditions
     * and filters the user can modify.
     */
    function buildData() {
        // get op type
        var temp = optype_select.property('value');

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
        // filter gender
        var temp = gender.selectAll('input[type=checkbox]')._groups[0];
        var options = [];        // order is: female, male, non-binary
        for (var i = 0; i < temp.length; i++) {
            options.push(temp[i].checked);
        }

        // filter
        filter(options, 'gender', genders);

        // filter role
        temp = role.selectAll('input[type=checkbox]')._groups[0];
        options = [];
        for (var i = 0; i < temp.length; i++) {
            options.push(temp[i].checked);
        }
        filterIncludes(options, 'role', window.roles);

        // filter speed
        temp = speed.selectAll('input[type=checkbox]')._groups[0];
        options = [];
        for (var i = 0; i < temp.length; i++) {
            options.push(temp[i].checked);
        }
        filter(options, 'speed', [1, 2, 3]);
        
        // enable/disable site button as needed
        if (window.data.length <= 0) {
            setEnabled('#generate', false);
        } else {
            setEnabled('#generate', true);
        }
    }
}

function getGadgetCount(gadget) {
    return gadgets[gadget.toLowerCase().replaceAll(' ', '_')];
}
