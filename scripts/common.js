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
 * initHeader() -- initializes the navbar for navigating the site
 */
 function initNavbar(header, idx) {
    let nav = header.append('nav')
    nav.classed('navbar navbar-expand-lg navbar-dark my-bg-dark', true)

    let navdiv = nav.append('div')
        .classed('container-fluid', true);
    
    let brand = navdiv.append('a')
        .classed('navbar-brand gradient-transparent border-highlight', true)
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
                .classed('nav-item gradient-transparent', true)
                .append('a')
                .classed('nav-link active border-highlighted', true)
                .attr('aria-current', 'page')
                .attr('href', ll[i].html)
                .text(ll[i].link);
        } else {
            ul.append('li')
                .classed('nav-item gradient-transparent', true)
                .append('a')
                .classed('nav-link active border-highlight', true)
                .attr('aria-current', 'page')
                .attr('href', ll[i].html)
                .text(ll[i].link);
        }
    }
}

/**
 * fetchOpImage() -- grabs an image link
 * @param op        the op to fetch
 * @return link     the link for this op
 */
function fetchOpImage(op) {
    return `resources/ops/svg/${op.toLowerCase()}.svg`;
}

/**
 * fetchOpBackground() -- grabs image link of op background image
 * @param op        the op's name to fetch
 * @return link     the link for this op's background image
 */
function fetchOpBackground(op) {
    return `resources/ops/bkgd/${op.toLowerCase()}.webp`;
}

/**
 * fetchGunImage() -- grabs an image link
 * @param gun       the gun to fetch
 * @return link     the link for this gun
 */
function fetchGunImage(gun) {
    if (gun.includes('.44 Mag')) {
        gun = gun.slice(1);
    }
    return `resources/guns/${gun}.png`;
}

/**
 * fetchGadgetImage() -- grabs an image link of a gadget
 * @param gadget    the gadget to fetch
 * @return link     the link for this gadget
 */
function fetchGadgetImage(gadget) {
    return `resources/gadgets/${gadget.toLowerCase().replaceAll(' ', '_')}.png`;
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
    loc.html('');

    var carddiv = loc.append('div')
        .attr('id', 'carddiv')
        .classed('output-card', true)

    
    
    // add the op's image
    var opimgdiv = carddiv.append('div')
        .classed('output-op-div', true);

    var opimg = opimgdiv.append('img')
        .attr('id', 'opimg')
        .classed('output-op-img', true)
        .attr('src', fetchOpBackground(op.name))

    var rowdiv = carddiv.append('div')
        .classed('row p-3 front', true);


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
        .attr('id', 'op-name')
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
    buildSpecial(op, col3);
}

function buildGenInfo(list, op, loc) {
    for (var i = 0; i < list.length; i++) {
        var row = loc.append('div')
            .classed(i != list.length - 1 ? 'row my-span mx-auto' : 'row my-span no-border mx-auto', true)

        var div = row.append('div')
            .classed('col-4', true)
        
        div.append('h6')
            .classed('text-end', true)
            .text(list[i] == "Organization" ? 'Org' : list[i]);

        // handle special formatting
        if (list[i] == "Role") {
            row.append('div')
                .classed('col h6', true)
                .html(formatAsList(op[list[i].toLowerCase()]));
        } else if (list[i] == "Organization") {
            row.append('div')
                .classed('col h6', true)
                .html(formatAsList(op[list[i].toLowerCase()].split('/')));
        } else {
            row.append('div')
                .classed('col h6', true)
                .html(op[list[i].toLowerCase()])
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
    var row = loc.append('div')
        .classed('row', true);
    for (var j = 0; j < list.length; j++) {
        var gun = list[j];

        var col = row.append('div')
            .classed('col my-auto', true);

        var card = col.append('div')
            .classed('center card gun-card no-border no-radius', true);
            
        card.append('a')
            .attr('href', `guns.html#${list[j].name}`)
            .append('img')
            .classed('center card-img-top gun-img', true)
            .attr('src', fetchGunImage(gun.name.includes(".44 Mag") ? gun.name.slice(1) : gun.name))
            .attr('alt', list[j].name)
            .attr('title', `${gun.name} -- Click me!`);

        var body = card.append('div')
            .classed('card-footer p-0 no-border no-radius', true);

        body.append('h4')
            .classed('gun-title', true)
            .text(gun.name);
    }
}

function buildGadgetList(list, loc) {
    var row = loc.append('div')
        .classed('row', true);

    for (var j = 0; j < list.length; j++) {
        var gadget = list[j];

        var col = row.append('div')
            .classed('col my-auto', true);

        var card = col.append('div')
            .classed('center card gadget-card no-bg no-border no-radius', true);

        card.append('img')
            .classed('center card-img-top gadget-img', true)
            .attr('src', fetchGadgetImage(gadget))
            .attr('alt', gadget)
            .attr('title', gadget);

        var body = card.append('div')
            .classed('card-footer p-0 no-border no-radius', true);

        body.append('h4')
            .classed('gun-title', true)
            .text(`${gadget} x${getGadgetCount(gadget)}`)
    }

    function getGadgetCount(g) {
        return gadgets[g.toLowerCase().replaceAll(' ', '_')];
    }    
}

/**
 * buildSpecial() -- builds the special gadget list
 * @param op    operator object
 * @param loc   location where it will be built
 */
function buildSpecial(op, loc) {
    if (typeof op.special !== "string") { 
        loc.append('h6')
            .classed('my-header', true)
            .text('Secondary Gadget');

        buildGadgetList(op.special, loc);
    } else {

        loc.append('h6')
            .classed('my-header', true)
            .text('Special');

        var card = loc.append('div')
            .classed('card no-bg no-border', true);
        
        card.append('img')
            .classed('center gadget-img', true)
            .attr('src', fetchSpecialImage(op.name))
            .attr('alt', op.special)
            .attr('title', op.special);

        var body = card.append('div')
            .classed('card-footer no-border', true)

        body.append('h6')
            .classed('gun-title', true)
            .text(op.special);
    }
}

function buildGunCard(gun, loc, pri) {
    var carddiv = loc.append('div')
        .attr('id', gun.name)
        .classed('output-card gun-roulette-card', true);

    var centerdiv = carddiv.append('div')
        .classed('p-auto', true);

    var rowdiv = centerdiv.append('div')
        .classed('row', true);

    //
    // 2 columns: name/icon/type, properties
    //

    // column 1: name/icon/type
    var col1 = rowdiv.append('div')
        .classed('col-4 my-auto', true);

    // gun icon
    col1.append('img')
        .classed('center gun-img-lg', true)
        .attr('src', fetchGunImage(gun.name))
        .attr('alt', gun.name)
        .attr('title', gun.name);

    // gun type
    col1.append('h3')
        .classed('text-center', true)
        .attr('id', 'gun-name')
        .text(gun.name);

    // gun type
    col1.append('h6')
        .classed('text-center italic', true)
        .text(gun.type);

    // append all ops
    //col1.append('h6')
    //    .classed('my-header', true)
    //    .text('Operators');

    var imgs = col1.append('div')
        .classed('text-center', true);

    for (var j = 0; j < gun.ops.length; j++) {
        var imgdiv = imgs.append('div')
            .style('display', 'inline-block')
            .classed('text-center', true)
        
        imgdiv.append('a')
            .attr('href', `ops.html#${gun.ops[j]}`)
            .append('img')
            .classed('mx-auto', true)
            .style('width', '4rem')
            .attr('src', fetchOpImage(gun.ops[j]))
            .attr('alt', gun.ops[j])
            .attr('title', gun.ops[j])
    }

    // column 2: properties
    var prop = rowdiv.append('div')
        .classed('col my-auto', true);

    var idx = ['damage', 'firerate', 'mobility', 'capacity'];
    var title = ['Damage', 'Fire Rate', 'Mobility', 'Capacity'];

    buildGunProps(gun.properties, idx, title, prop, pri);
}

function buildGunProps(props, idx, headers, loc, primary) {
    for (var i = 0; i < idx.length; i++) {
        var row = loc.append('div')
            .classed('row my-span no-border', true)

        var title = row.append('div')
            .classed('col-3', true);

        title.append('h6')
            .classed('text-end', true)
            .text(headers[i])

        var chart = row.append('div')
            .classed('col', true);

        var get = ['', 'fir', 'mob', 'cap'];
        if (primary) {
            get[0] = 'pri'
        } else {
            get[0] = 'sec'
        }

        buildChart(props[idx[i]], window.max[get[i]], chart);
        
        // then add damage in final col
        var val = row.append('div')
            .classed('col-2', true);

        if (idx[i] == 'firerate' && props[idx[i]] == -1) {
            val.append('h6')
                .text('N/A');
        } else {
            val.append('h6')
                .text(props[idx[i]]);
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
    var svg = loc.append('svg')
        .classed('my-svg', true);

    // margins & widths
    let margin = {top: 5, left: 5, bottom: 5, right: 5}
    const width = svg.style('width').replaceAll('px', '');
    let innerWidth = width - margin.left - margin.right;
    
    const height = 10;

    const x_scale = d3.scaleLinear()
        .domain([0, max])
        .range([0, innerWidth]);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('id', 'g-bar');

    g.append('rect')
        .classed('bar-blank', true)
        .attr('height', height)
        .attr('width', innerWidth);

    g.append('rect')
        .classed('bar', true)
        .attr('height', height)
        .attr('width', x_scale(val));
}

/**
 * getCondition() -- returns the state (t/f) of the condition
 *  (name) in conditions
 * @param conditions  the list of conditions, each entry is of the form {idx: "", val: ""}
 * @param name        the condition to check (this is the idx)
 */
function getCondition(conditions, name) {
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i].idx === name) {
            return conditions[i].val;
        }
    }
}

function buildColumnChecklist(loc, list, col_count, checked, callback, id_prefix) {
    if (col_count === undefined || col_count <= 0 || col_count > list.length) {
        console.log("the person who wrote this is stupid lol");
        return;     // don't call the function wrong
    } else {
        var div = loc.append('div')
            .classed('row', true);
        
        var chunks = chunkify(list, col_count, true);
        
        for (var i = 0; i < chunks.length; i++) {
            var newloc = div.append('div')
                .classed('col', true);
            buildChecklist(newloc, chunks[i], checked, callback, id_prefix, i)
        }
    }
}

function buildChecklist(loc, list, checked, callback, id_prefix, offset) {
    list.sort();
    for (var i = 0; i < list.length; i++) {
        var div = loc.append('div')
            .classed('form-check form-switch', true);

        div.append('input')
            .classed('form-check-input', true)
            .attr('type', 'checkbox')
            .attr('value', '')
            .attr('id', `${id_prefix}-${i+list.length*offset}`)
            .property('checked', checked)
            .on('click', callback);

        div.append('label')
            .classed('form-check-label', true)
            .attr('for', `${id_prefix}-${i+list.length*offset}`)
            .text(list[i]);
    }
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
                    j = list.length+1;      // this op matches, move on
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
    }

    else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    }

    else {

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
