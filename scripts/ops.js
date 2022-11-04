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
        setTimeout( () => {
            console.log(location.hash);
            var sav = location.hash;
            if (sav.length > 1) {
                location.hash = '';
                location.hash = sav;
            }
        }, 750);
    })
}

function initOps() {
    // init site
    content.classed('container', true);

    content.append('h2')
        .text('Operators')
        .attr('id', 'Operators');

    // attackers
    var loc = content.append('div')
        .attr('id', 'attackers')

    loc.append('h4')
        .classed('my-header', true)
        .attr('id', 'Attackers')
        .text('Attackers');

    buildOpCards(window.atk, loc);

    // defenders
    loc = content.append('div')
        .attr('id', 'defenders')

    loc.append('h4')
        .classed('my-header', true)
        .attr('id', 'Defenders')
        .text('Defenders');

    buildOpCards(window.def, loc);

    // now, add navigation arrows
    var loc = d3.select('#main-content')
    navigationArrows(loc);
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

        // column 1: name/icon/info

        var col1 = rowdiv.append('div')
            .classed('col-4 my-auto', true);

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

        var titles = ["Speed", "Role", "Gender", "Organization"];
        buildGenInfo(titles, op, col1);

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

        // special
        if (typeof op.special !== "string") { 
            col3.append('h6')
                .classed('my-header', true)
                .text('Secondary Gadget');

            buildGadgetList(op.special, col3);
        } else {
            col3.append('h6')
                .classed('my-header', true)
                .text('Special');

            col3.append('span')
                .text(op.special);
        }
    }
}

function buildGenInfo(list, op, col) {
    for (var i = 0; i < list.length; i++) {
        var row = col.append('div')
            .classed(i != list.length - 1 ? 'row my-span mx-auto' : 'row my-span no-border mx-auto', true)

        var div = row.append('div')
            .classed('col', true)
        
        div.append('h6')
            .classed('text-end', true)
            .text(list[i]);

        var right = row.append('div')
            .classed('col h6', true)
            .html(list[i] != "Role" ? op[list[i].toLowerCase()] : formatRoles(op));
    }

    function formatRoles(o) {
        var roles = o.role;
        if (roles.length <= 1) {
            return roles;
        } else {
            var html = '';
            for (var j = 0; j < roles.length; j++) {
                html += roles[j] + "<br>";
            }
            return html;
        }
    }
}

function buildLoadoutList(list, loc) {
    var row = loc.append('div')
        .classed('row', true);
    for (var j = 0; j < list.length; j++) {
        var gun = list[j];

        var col = row.append('div')
            .classed('col', true);

        var img = col.append('div')
            
        img.append('a')
            .attr('href', `guns.html#${list[j].name}`)
            .append('img')
            .classed('center gun-img', true)
            .attr('src', fetchGunImage(gun.name.includes(".44 Mag") ? gun.name.slice(1) : gun.name))
            .attr('alt', list[j].name)
            .attr('title', `${gun.name} -- Click me!`);
    }
}

function buildGadgetList(list, loc) {
    var row = loc.append('div')
        .classed('row', true);

    for (var j = 0; j < list.length; j++) {
        var gadget = list[j];

        var col = row.append('div')
            .classed('col', true);

        var stupidrow = col.append('row')
            .classed('row', true);

        var img = stupidrow.append('img')
            .classed('col center gadget-img', true)
            .attr('src', fetchGadgetImage(gadget))
            .attr('alt', gadget)
            .attr('title', gadget);

        stupidrow.append('div')
            .classed('col my-auto', true)
            .text(`x${getGadgetCount(gadget)}`)
    }

    function getGadgetCount(g) {
        return gadgets[g.toLowerCase().replaceAll(' ', '_')];
    }    
}

function navigationArrows(loc) {
    var parent = loc.append('div')
        .classed('nav-arrows', true)

    var atk = parent.append('div')
    .classed('gradient border-highlight', true)

    atk.append('a')
        .attr('href', '#Attackers')
        .attr('title', 'Jump to attackers')
        .classed('btn square', true)
        .append('img')
        .classed('center img-svg', true)
        .attr('src', 'resources/atk.svg')
        .attr('alt', 'ATK');

    var def = parent.append('div')
        .classed('gradient border-highlight mt-3', true)

    def.append('a')
        .attr('href', '#Defenders')
        .attr('title', 'Jump to defenders')
        .classed('btn square', true)
        .append('img')
        .classed('center img-svg', true)
        .attr('src', 'resources/def.svg')
        .attr('alt', 'DEF');

    var top = parent.append('div')
        .classed('gradient border-highlight mt-3', true)

    top.append('a')
        .attr('href', '#')
        .attr('title', 'Back to top')
        .classed('btn square', true)
        .append('img')
        .classed('center img-svg', true)
        .attr('src', 'resources/up.svg')
        .attr('alt', 'TOP');
}
