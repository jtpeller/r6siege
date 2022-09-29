// =================================================================
// = ops.js
// =  Description   : initializes ops.html
// =  Author        : jtpeller
// =  Date          : September 26, 2022
// =================================================================

let header, content;

// embedded data
window.atk = [];
window.def = [];
window.gadgets = [];

window.onload = function () {
    // get d3 elements
    header = d3.select('#header');
    content = d3.select('#content');

    // build header
    initNavbar(header, 3);

    // load all data
    Promise.all([
        d3.json('data/atk.json'),
        d3.json('data/def.json'),
        d3.json('data/gadgets.json')
    ]).then(function (values) {
        // set the data
        window.atk = values[0].atk;
        window.def = values[1].def;
        window.gadgets = values[2];

        initOps();
        
        // scroll to the right point for hash link
        setTimeout( () => {location.href = location.href; }, 500);
    })
}

function initOps() {
    // init site
    content.classed('container', true);

    content.append('h2')
        .text('Operators');

    // attackers
    var loc = content.append('div')
        .attr('id', 'attackers')

    loc.append('h4')
        .classed('my-header', true)
        .text('Attackers');

    buildOpCards(window.atk, loc);

    // defenders
    loc = content.append('div')
        .attr('id', 'defenders')

    loc.append('h4')
        .classed('my-header', true)
        .text('Defenders');

    buildOpCards(window.def, loc);
}

function buildOpCards(arr, loc) {
    // loop thru arr and make a neat looking card about each op
    for (var i = 0; i < arr.length; i++) {
        let op = arr[i];

        var carddiv = loc.append('div')
            .attr('id', op.name)
            .classed('my-card op-card', true)

        var rowdiv = carddiv.append('div')
            .classed('row card-body', true);

        //
        // 2 columns: name/icon/description, loadout
        //

        // column 1: name/icon
        var col1 = rowdiv.append('div')
            .classed('col my-auto', true);

        col1.append('img')
            .classed('center op-img', true)
            .attr('src', fetchOpImage(op.name))
            .attr('alt', op.name + '.svg');

        col1.append('h3')
            .classed('text-center', true)
            .text(op.name);

        col1.append('h4')
            .classed('my-header', true)
            .text('General Info');

        // speed
        var speed = col1.append('div')
        speed.append('h6')
            .classed('my-header', true)
            .text('Speed');

        speed.append('span').text(op.speed);

        // role
        var role = col1.append('div')
        role.append('h6')
            .classed('my-header', true)
            .text('Role')

        role.append('span')
            .text(op.role);

        // gender
        var gender = col1.append('div')
        gender.append('h6')
            .classed('my-header', true)
            .text('Gender');

        gender.append('span')
            .text(op.gender);

        // organization
        var org = col1.append('div');
        org.append('h6')
            .classed('my-header', true)
            .text('Organization');

        org.append('span')
            .text(op.organization);

        //
        // column 3: loadout, gadgets, special
        //
        var col3 = rowdiv.append('div')
            .classed('col', true);

        col3.append('h4')
            .classed('my-header', true)
            .text('Loadout');

        // primaries
        col3.append('h6')
            .classed('my-header', true)
            .text('Primaries');

        buildLoadoutList(op.primary, col3);

        // secondaries
        col3.append('h6')
            .classed('my-header', true)
            .text('Secondaries');

        buildLoadoutList(op.secondary, col3);

        // gadgets
        col3.append('h6')
            .classed('my-header', true)
            .text('Gadgets');

        buildGadgetList(op.gadget, col3);
    }
}

function buildLoadoutList(list, loc) {
    var ul = loc.append('ul')
        .classed('list-group', true);
    for (var j = 0; j < list.length; j++) {
        var gun = list[j];

        var li = ul.append('li')
            .classed('list-group-item dark-item no-border', true);

        var lirow = li.append('div')
            .classed('row', true);

        var img = lirow.append('div')
            .classed('col', true)
            
        img.append('a')
            .attr('href', `guns.html#${list[j].name}`)
            .append('img')
            .classed('center gun-img', true)
            .attr('src', fetchGunImage(gun.name.includes(".44 Mag") ? gun.name.slice(1) : gun.name))
            .attr('alt', list[j].name)
    }
}

function buildGadgetList(list, loc) {
    var ul = loc.append('ul')
        .classed('list-group', true);

    for (var j = 0; j < list.length; j++) {
        var gadget = list[j].name;

        ul.append('li')
            .classed('list-group-item dark-item no-border', true)
            .text(`${gadget} x${getGadgetCount(gadget)}`)
    }

    function getGadgetCount(g) {
        return gadgets[g.toLowerCase().replaceAll(' ', '_')];
    }    
}