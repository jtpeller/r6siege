// =================================================================
// = common.js
// =  Description   : utility functions
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================

window.max = {
    pri: 0,     // primary damage
    sec: 0,     // secondary damage
    fir: 0,     // fire rate
    cap: 0,     // capacity
    mob: 0      // mobility
}

// constant SVG values
const margin = { top: 10, left: 0, bottom: 10, right: 0 }
const width = 250;
const height = 30;

// dimensions for inner chart (the g element)
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

let ll = [
    {
        html: 'op-roulette.html',
        link: 'Operator Roulette'
    },
    {
        html: 'gun-roulette.html',
        link: 'Gun Roulette'
    },
    {
        html: 'strat-roulette.html',
        link: 'Strat Roulette'
    },
    {
        html: 'ops.html',
        link: 'Operators'
    },
    {
        html: 'guns.html',
        link: 'Guns'
    },
    {
        html: 'more-info.html',
        link: 'More Info'
    }
]

/**
 * initNavbar() -- initializes the navbar for navigating the site
 */
function initNavbar(header, idx) {
    let nav = d3.create('nav')
        .classed('navbar navbar-expand-lg navbar-dark', true)

    let navdiv = nav.append('div')
        .classed('container-fluid', true);

    let brand = navdiv.append('a')
        .classed('navbar-brand siege-uppercase gradient-transparent border-highlight', true)
        .attr('href', 'index.html')
        .text('R6S Roulette');

    //
    // add the hamburger menu button for mobile/thin
    //
    let menu = navdiv.append('button')
        .classed('navbar-toggler', true)
        .attr('type', 'button')
        .attr('data-bs-toggle', 'collapse')
        .attr('data-bs-target', '#navbar-content')
        .attr('aria-controls', 'navbar-content')
        .attr('aria-expanded', 'false')
        .attr('aria-label', 'Toggle navigation');

    menu.append('span')
        .classed('navbar-toggler-icon', true);

    //
    // build the links
    //
    let linkdiv = navdiv.append('div')
        .classed('collapse navbar-collapse', true)
        .attr('id', 'navbar-content');

    let ul = linkdiv.append('ul')
        .classed('navbar-nav me-auto mb-2 mb-lg-0', true);

    // iteratively add the links
    for (var i = 0; i < ll.length; i++) {
        if (idx == i) {
            ul.append('li')
                .classed('nav-item siege-bold gradient-transparent', true)
                .append('a')
                .classed('nav-link active border-highlighted', true)
                .attr('aria-current', 'page')
                .attr('href', ll[i].html)
                .text(ll[i].link);
        } else {
            ul.append('li')
                .classed('nav-item siege-bold gradient-transparent', true)
                .append('a')
                .classed('nav-link active border-highlight', true)
                .attr('aria-current', 'page')
                .attr('href', ll[i].html)
                .text(ll[i].link);
        }
    }

    header.append(() => nav.node());
}

/**
 * fetchOpImage() -- grabs an image link
 * @param op        the op to fetch
 * @return link     the link for this op
 */
function fetchOpImage(op) {
    return `resources/ops/${op.toLowerCase()}.svg`;
}

/**
 * fetchGunImage() -- grabs an image link
 * @param gun       the gun to fetch
 * @return link     the link for this gun
 */
function fetchGunImage(gun) {
    if (gun.includes('.44 Mag')) {
        gun = gun.slice(1); // remove the pesky punctuation
    }
    return `resources/guns/${gun}.webp`;
}

/**
 * fetchGadgetImage() -- grabs an image link of a gadget
 * @param gadget    the gadget to fetch
 * @return link     the link for this gadget
 */
function fetchGadgetImage(gadget) {
    return `resources/gadgets/${gadget.toLowerCase().replaceAll(' ', '_')}.webp`;
}

/**
 * fetchSpecialImage() -- grabs an image link of the op's special
 * @param op        the op's name
 * @return link     the link for the image of op's special
 */
function fetchSpecialImage(op) {
    return `resources/special/${op.toLowerCase()}.webp`
}

/**
 * buildOpCard() -- creates the operator card for op roulette & operator pages
 * @param op    the operator JSON data
 * @param loc   the d3 object to build the card at
 */
function buildOpCard(op, loc) {
    // note to me: do not clear loc, built repetitively in ops.js
    var carddiv = d3.create('div')
        .classed('card output-card', true)

    var row = carddiv.append('div')


    //
    // 2 col: Overview (op + gen info) & Loadout
    //

    // ROW 1: OVERVIEW
    var overview = carddiv.append('div')
        .classed('row', true);

    var opprev = overview.append('div')
        .classed('col-sm-12 col-md-6 col-lg-6', true);

    var opcard_div = opprev.append('div')
        .classed('card w-50 center no-bkgd no-border', true);

    opcard_div.append('img')
        .classed('card-img-top center', true)
        .attr('id', 'op-img')
        .attr('src', fetchOpImage(op.name))
        .attr('alt', op.name + '.svg')
        .attr('loading', 'lazy');

    opcard_div.append('div')
        .classed('card-title', true)
        .append('h3')
        .classed('card-title text-center siege-uppercase subheader no-border', true)
        .attr('id', 'op-name')
        .text(op.name);

    var geninfo = overview.append('div')
        .classed('col-sm-12 col-md-6 col-lg-6', true)
    addHeader(geninfo, "General Info");

    var geninfodiv = geninfo.append('div')
        .attr('id', 'gen-info');
    
    var titles = ["Speed", "Role", "Gender"];
    buildGenInfo(titles, op, geninfodiv);

    carddiv.append('hr');

    // LOADOUT
    buildAccordion(carddiv, 'Loadout');
    let loadout_body = carddiv.select('#Loadout-body');

    // primaries
    var primaries = loadout_body.append('div');
    addHeader(primaries, "Primaries");
    var pri_div = primaries.append('div')
        .attr('id', 'pri-div');
    buildLoadoutList(op.primary, pri_div);

    // secondaries
    var secondaries = loadout_body.append('div');
    addHeader(secondaries, "Secondaries");
    var sec_div = secondaries.append('div')
        .attr('id', 'sec-div');
    buildLoadoutList(op.secondary, sec_div);

    // gadgets
    var gadget = loadout_body.append('div');
    addHeader(gadget, "Gadget")
    var gadget_div = gadget.append('div')
        .attr('id', 'gadget-div');
    buildGadgetList(op.gadget, gadget_div);

    // specialty
    var special = loadout_body.append('div')
        .attr('id', 'special-div');
    buildSpecial(op, special);

    loc.html('').append(() => carddiv.node());
}

function buildGenInfo(list, op, loc) {
    for (var i = 0; i < list.length; i++) {
        var prop = list[i].toLowerCase();

        var row = loc.append('div')
            .classed(i != list.length - 1 ? 'row my-span mx-auto' : 'row my-span no-border mx-auto', true)

        var div = row.append('div')
            .classed('my-auto col', true)

        div.append('h6')
            .classed('siege-uppercase text-end', true)
            .text(list[i]);

        // handle special formatting
        var contents = row.append('div')
            .classed('col h6 uppercase', true);

        if (list[i] == "Role") {
            contents.html(formatAsList(op[prop]));
        } else if (list[i] == 'Speed') {
            // add the svg circle elements
            for (var j = 0; j < 3; j++) {
                contents.append('img')
                    .attr('src', 'resources/speed.svg')
                    .attr('id', `speed-${j}`)
                    .classed('speed-icon', true)
                    .attr('loading', 'lazy');
            }

            var speedval = op[prop]
            for (var j = 0; j < speedval; j++) {
                contents.select(`#speed-${j}`)
                    .attr('src', 'resources/speed-fill.svg')
            }
        } else {
            contents.html(op[prop])
        }
    }

    function formatAsList(list) {
        if (list.length <= 1 || typeof list == 'string') {
            return list;
        } else {
            var html = '';
            for (var j = 0; j < list.length; j++) {
                html += list[j] + "<br>";
            }
            return html;
        }
    }
}

function buildLoadoutList(list, loc) {
    var row = d3.create('div')
        .classed('row', true);

    for (var j = 0; j < list.length; j++) {
        var gun = list[j];

        var col = row.append('div')

        if (list.length == 3) {
            col.classed('col-sm-12 col-lg-6', true)
        } else if (list.length == 2) {
            col.classed('col-sm-12 col-md-6 col-lg-6', true)
        } else {
            col.classed('col-12', true)
        }


        var card = col.append('div')
            .classed('card center gun-card no-radius', true);

        card.append('a')
            .attr('href', `guns.html#${list[j].name}`)
            .append('img')
            .classed('center card-img-top gun-img', true)
            .attr('src', fetchGunImage(gun.name.includes(".44 Mag") ? gun.name.slice(1) : gun.name))
            .attr('alt', list[j].name)
            .attr('title', `${gun.name} -- Click me!`)
            .attr('loading', 'lazy');

        var body = card.append('div')
            .classed('card-body text-center', true);

        body.append('h6')
            .classed('card-title siege-bold', true)
            .text(gun.name);
    }

    loc.html('').append(() => row.node());
}

function buildGadgetList(list, loc) {
    var row = d3.create('div')
        .classed('row', true);

    for (var j = 0; j < list.length; j++) {
        var gadget = list[j];
        var col = row.append('div')

        if (list.length == 3) {
            col.classed('col-sm-12 col-lg-6', true)
        } else if (list.length == 2) {
            col.classed('col-sm-6 col-md-6 col-lg-6', true)
        } else {
            col.classed('col-12', true)
        }

        var card = col.append('div')
            .classed('card gun-card no-radius', true);

        card.append('img')
            .classed('center card-img-top gun-img', true)
            .attr('src', fetchGadgetImage(gadget))
            .attr('alt', gadget)
            .attr('title', gadget)
            .attr('loading', 'lazy');

        var body = card.append('div')
            .classed('card-body text-center', true);

        body.append('h6')
            .classed('card-title siege-bold', true)
            .text(`${gadget} x${getGadgetCount(gadget)}`)
    }

    function getGadgetCount(g) {
        return gadgets[g.toLowerCase().replaceAll(' ', '_')];
    }

    loc.html('').append(() => row.node());
}

/**
 * buildSpecial() -- builds the special gadget list
 * @param op    operator object
 * @param loc   location where it will be built
 */
function buildSpecial(op, loc) {
    var special = d3.create('div')
    var title = special.append('h3')
        .classed('siege-uppercase subheader', true);

    // handle recruit vs specialty ops
    if (typeof op.special !== "string") {
        title.text('Secondary Gadget');
        buildGadgetList(op.special, special);

    } else {
        title.text('Special');

        var card = special.append('div')
            .classed('card gun-card no-radius', true);

        card.append('img')
            .classed('center card-img-top gun-img', true)
            .attr('src', fetchSpecialImage(op.name))
            .attr('alt', op.special)
            .attr('title', op.special)
            .attr('loading', 'lazy');

        var body = card.append('div')
            .classed('card-body text-center', true);

        body.append('h6')
            .classed('card-title siege-bold', true)
            .text(op.special);
    }
    
    loc.html('').append(() => special.node());
}

/**
 * transitionOpCard() -- transitions the op card to the new state
 * @param op        op to replace
 * @param loc       location where the card is at
 */
function transitionOpCard(op, loc) {
    // update the icon
    loc.select('#op-img')
        .attr('src', fetchOpImage(op.name))
        .attr('alt', op.name + '.svg')

    // update op name
    loc.select('#op-name')
        .html('')
        .append('a')
        .classed('link', true)
        .html(op.name + '&#128279;')
        .attr('href', `ops.html#${op.name}`);

    // update general info
    var geninfo = loc.select('#gen-info').html('');
    buildGenInfo(["Speed", "Role", "Gender"], op, geninfo)

    //
    // update loadout
    //
    // update primaries
    buildLoadoutList(op.primary, loc.select('#pri-div'));

    // update secondaries
    buildLoadoutList(op.secondary, loc.select('#sec-div'));

    // update gadgets
    buildGadgetList(op.gadget, loc.select('#gadget-div'));

    // update special
    buildSpecial(op, loc.select('#special-div'));
}


/**
 * Builds a neatly organized gun card.
 * used for guns.html & gun-roulette.html
 */
function buildGunCard(gun, loc, pri) {
    // note to me: do not clear loc, built repetitively in guns.js
    var carddiv = d3.create('div')
        .classed('card output-card', true)
        .attr('id', gun.name);      // used for nav on guns.html

    // overview
    var overview = carddiv.append('div')
        .classed('pb-3', true);

    // gun icon
    var gun_card = overview.append('div')
        .classed('card gun-card no-bkgd no-border', true);

    gun_card.append('img')
        .classed('center card-img-top gun-img-lg', true)
        .attr('id', 'gun-img')
        .attr('src', fetchGunImage(gun.name))
        .attr('alt', gun.name)
        .attr('title', gun.name)
        .attr('loading', 'lazy');

    // gun name
    overview.append('h3')
        .classed('card-title text-center siege-uppercase', true)
        .attr('id', 'gun-name')
        .text(gun.name);

    // gun type
    overview.append('div')
        .classed('card-body', true)
        .append('h6')
        .classed('text-center siege-bold', true)
        .attr('id', 'gun-type')
        .text(gun.type);

    // properties
    var prop = carddiv.append('div')
        .classed('col-12', true);

    var idx = ['damage', 'firerate', 'mobility', 'capacity'];
    var title = ['Damage', 'Fire Rate', 'Mobility', 'Capacity'];

    buildGunProps(gun.properties, idx, title, prop, pri);

    // append all ops
    var imgs = carddiv.append('div')
        .classed('text-center', true)
        .attr('id', 'op-imgs')
        .attr('loading', 'lazy');

    buildOpImgs(imgs, gun.ops);

    // append into DOM
    loc.append(() => carddiv.node());
}

function buildGunProps(props, idx, headers, loc, primary) {
    for (var i = 0; i < idx.length; i++) {
        var row = loc.append('div')
            .classed('row', true)

        var title = row.append('div')
            .classed('col-3', true)
            .append('h6')
            .classed('text-end siege-bold', true)
            .text(headers[i])

        var get = ['', 'fir', 'mob', 'cap'];
        if (primary) {
            get[0] = 'pri'
        } else {
            get[0] = 'sec'
        }

        var chart = row.append('div')
            .classed('col-7', true)
            .attr('id', idx[i]);

        buildChart(props[idx[i]], window.max[get[i]], chart);

        // then add damage in final col
        var val = row.append('div')
            .classed('col-2', true)
            .append('h6')
            .attr('id', `val-${idx[i]}`)
            .classed('siege-bold', true)

        if (idx[i] == 'firerate' && props[idx[i]] == -1) {
            val.text('N/A');
        } else {
            val.text(props[idx[i]]);
        }
    }
}

function setMaxValues(pri, sec) {
    window.max.pri = getMax(pri, "damage");
    window.max.sec = getMax(sec, "damage");

    temp = [...pri, ...sec];
    window.max.fir = getMax(temp, "firerate");
    window.max.cap = getMax(temp, "capacity");
    window.max.mob = getMax(temp, "mobility");
}

function getMax(list, name) {
    var max = 0;
    for (var i = 0; i < list.length; i++) {
        var prop = list[i].properties;
        var val = prop[name];

        if (val > max) {
            max = val;
        }
    }
    return max;
}


function buildChart(val, max, loc) {
    // SVG dims. viewbox helps its responsiveness
    const svg = d3.create('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .classed('my-svg', true);

    const x_scale = d3.scaleLinear()
        .domain([0, max])
        .range([0, innerWidth]);

    const g = svg.append('g')
        .attr('id', 'g-bar');

    g.append('rect')
        .classed('bar-blank', true)
        .attr('height', innerHeight)
        .attr('width', innerWidth);

    g.append('rect')
        .classed('bar', true)
        .attr('id', 'val-bar')
        .attr('height', innerHeight)
        .transition()
        .delay(100)     // wait for the page to load
        .duration(750)
        .attr('width', x_scale(val));

    // append chart
    loc.append(() => svg.node());
}

/**
 * buildOpImgs() -- adds op icons. used for building gun cards (and transitioning gun cards)
 * @param loc   where to add the op images
 * @param ops   the ops to add
 */
function buildOpImgs(loc, ops) {
    var temp = d3.create('div');
    for (var j = 0; j < ops.length; j++) {
        let op = ops[j];
        var imgdiv = temp.append('div')
            .style('display', 'inline-block');

        imgdiv.append('a')
            .attr('href', `ops.html#${op}`)
            .append('img')
            .style('width', '4rem')
            .attr('src', fetchOpImage(op))
            .attr('alt', op)
            .attr('title', op)
            .attr('loading', 'lazy');
    }

    loc.html('').append(() => temp.node());
}

/**
 * transitionGunCard() -- transitions a gun card from one to another.
 *  Used on gun-roulette after generating a new gun-card.
 * @param gun   new gun obj to transition to.
 * @param loc   location of the gun card to transition
 * @param pri   primary (T) or secondary (F)
 */
function transitionGunCard(gun, loc, pri) {
    // update img
    loc.select('#gun-img').attr('src', fetchGunImage(gun.name))

    // update name and make it a link
    loc.select('#gun-name')
        .html('')
        .append('a')
        .classed('link', true)
        .html(gun.name + '&#128279;')
        .attr('href', `guns.html#${gun.name}`);

    // update type
    loc.select('#gun-type').html(gun.type)

    // update charts
    var idx = ['damage', 'firerate', 'mobility', 'capacity'];
    var get = ['', 'fir', 'mob', 'cap'];
    if (pri) {
        get[0] = 'pri'
    } else {
        get[0] = 'sec'
    }

    for (var i = 0; i < idx.length; i++) {
        var x_scale = d3.scaleLinear()
            .domain([0, window.max[get[i]]])
            .range([0, innerWidth]);

        loc.select(`#${idx[i]}`)
            .selectAll('#val-bar')
            .transition()
            .duration(750)
            .attr('width', x_scale(gun.properties[idx[i]]))
            
        // update chart vals
        var val = loc.select(`#val-${idx[i]}`)
        if (idx[i] == 'firerate' && gun.properties[idx[i]] == -1) {
            val.text('N/A');
        } else {
            val.text(gun.properties[idx[i]])
        }
    }

    // update ops
    var imgs = loc.select('#op-imgs');
    buildOpImgs(imgs, gun.ops);
}


/**
 * buildColumnChecklist() -- creates a column'd checklist
 *  (name) in conditions
 * @param conditions  the list of conditions, each entry is of the form {idx: "", val: ""}
 * @param name        the condition to check (this is the idx)
 */
function buildColumnChecklist(loc, list, col_count, checked, callback, id_prefix) {
    if (col_count === undefined || col_count <= 0 || col_count > list.length) {
        return;     // don't call the function wrong
    } else {
        var div = d3.create('div')
            .classed('row', true);

        var chunks = chunkify(list, col_count, true);

        for (var i = 0; i < chunks.length; i++) {
            var newloc = div.append('div')
                .classed('col', true);
            buildChecklist(newloc, chunks[i], checked, callback, id_prefix, i)
        }
        loc.html('').append(() => div.node());
    }
}

function buildChecklist(loc, list, checked, callback, id_prefix, offset) {
    var temp = d3.create('div')
    list.sort();
    for (var i = 0; i < list.length; i++) {
        var div = temp.append('div')
            .classed('form-check form-switch', true);

        div.append('input')
            .classed('form-check-input', true)
            .attr('type', 'checkbox')
            .attr('value', '')
            .attr('id', `${id_prefix}-${i + list.length * offset}`)
            .property('checked', checked)
            .on('click', callback);

        div.append('label')
            .classed('form-check-label', true)
            .attr('for', `${id_prefix}-${i + list.length * offset}`)
            .text(list[i]);
    }

    loc.html('')
    loc.append(() => temp.node());
}

function buildAccordion(loc, id_prefix) {
    let acc = d3.create('div')
        .classed('accordion accordion-flush', true);

    acc.attr('id', `${id_prefix}-list`)
        .append('div')
        .classed('accordion-item no-bkgd no-border', true)

    // header
    acc.append('h2')
        .classed('accordion-header no-border', true)
        .append('button')
        .classed('accordion-button siege-uppercase collapsed', true)
        .attr('type', 'button')
        .attr('data-bs-toggle', 'collapse')
        .attr('data-bs-target', `#${id_prefix}-acc`)
        .attr('aria-expanded', 'false')
        .attr('aria-controls', `${id_prefix}-acc`)
        .text(id_prefix);

    // body
    var content = acc.append('div')
        .classed('accordion-collapse collapse', true)
        .attr('id', `${id_prefix}-acc`)
        .attr('data-bs-parent', `#${id_prefix}-list`)

    content.append('div')
        .classed('accordion-body', true)
        .attr('id', `${id_prefix}-body`)

    loc.append(() => acc.node())
}

function filter(options, idx, filter_list) {
    if (options.includes(false)) {
        for (var i = 0; i < window.data.length; i++) {
            // loop thru filter_list and remove those which do not match
            for (var j = 0; j < filter_list.length; j++) {
                if (window.data[i][idx] === filter_list[j] && !options[j]) {
                    window.data.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    }
}

// same function as filter(), except this works for filtering lists
function filterIncludes(options, idx, filter_list) {
    if (options.includes(false)) {      // there's something to filter out
        for (var i = 0; i < window.data.length; i++) {
            var opmatches = false;

            // if this op's list doesn't have any found in filter list, remove
            var list = window.data[i][idx]

            // loop thru this op's list
            for (var j = 0; j < list.length; j++) {
                var k = filter_list.indexOf(list[j]);
                if (k >= 0 && options[k]) {
                    opmatches = true;
                    j = list.length + 1;      // this op matches, move on
                }
            }

            if (opmatches === true) {
                opmatches = false;  // toggle and do nothing
            } else {        // op does not match, remove it.
                window.data.splice(i, 1);
                i--;
            }
        }
    }
}

// helps find the needle(s) in the haystack
function findOne(haystack, needles) {
    return needles.some(v => haystack.includes(v));
}

/**
 * setEnabled() -- sets a button enabled/disabled
 * @param {string} id           id of the button
 * @param {boolean} enabled     enabled (T) or disabled (F)
 */
function setEnabled(id, enabled) {
    if (enabled) {
        d3.select(id)
            .classed('disabled site-btn-disabled', false)
            .classed('gradient-transparent border-highlight', true)
    } else {
        d3.select(id)
            .classed('disabled site-btn-disabled', true)
            .classed('gradient-transparent border-highlight', false)
    }
}

/**
 * addHeader() -- adds a header to the DOM
 * @param loc   d3js selection where the header will be added
 * @param text  what text should the header have
 */
function addHeader(loc, text, id = '') {
    if (id != '') {
        loc.append('h3')
            .classed('siege-uppercase subheader', true)
            .attr('id', id)
            .text(text);
    } else {
        loc.append('h3')
            .classed('siege-uppercase subheader', true)
            .text(text);
    }
}

/**
 * addTitle() -- adds a title to the DOM
 * @param loc   d3js selection where the header will be added
 * @param text  what text should the header have
 */
function addTitle(loc, text, id = '') {
    if (id != '') {
        loc.append('h2')
            .classed('siege-uppercase page-title', true)
            .attr('id', id)
            .text(text);
    } else {
        loc.append('h2')
            .classed('siege-uppercase page-title', true)
            .text(text);
    }
}

// pulled from: https://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays
function chunkify(a, n, balanced) {
    if (n < 2)
        return [a];

    var len = a.length,
        out = [],
        i = 0,
        size;

    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    } else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    } else {
        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
            size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));
    }
    return out;
}
