// =================================================================
// = common.js
// =  Description   : utility functions
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================

/**
 * initHeader() -- initializes the navbar for navigating the site
 */
 function initNavbar(header) {
    let nav = header.append('nav')
    nav.classed('navbar navbar-expand-lg navbar-dark my-bg-dark', true)

    let navdiv = nav.append('div')
        .classed('container-fluid', true);
    
    let brand = navdiv.append('a')
        .classed('navbar-brand', true)
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
    let links = [
        {
            html: 'ops.html',
            link: 'Operator Roulette'
        },
        {
            html: 'guns.html',
            link: 'Gun Roulette'
        }
    ]

    for (var i = 0; i < links.length; i++) {
        ul.append('li')
            .classed('nav-item', true)
            .append('a')
            .classed('nav-link active', true)
            .attr('aria-current', 'page')
            .attr('href', links[i].html)
            .text(links[i].link);
    }
}

function initFooter(footer) {
    let elem = footer.append('footer')
        .classed('footer text-center text-lg-start mt-auto my-bg-dark', true)
        .style('height', '5em');

    let div = elem.append('div')
        .classed('text-center p-4 container', true)
        .text('Written by: ')

    div.append('a')
        .attr('href', 'https://www.github.com/jtpeller')
        .classed('text-light', true)
        .text('jtpeller')
}

/**
 * fetchOpImage() -- grabs an image link using buildLink
 * @param op        the op i'm trying to fetch
 * @return link         the link for this image
 */
function fetchOpImage(op) {
    return `resources/ops/svg/${op.toLowerCase()}.svg`;
}

/**
 * fetchGunImage() -- grabs an image link using buildLink
 * @param gun       the gun i'm trying to fetch
 * @return link     the link for this image
 */
function fetchGunImage(gun) {
    return `resources/guns/${gun}.png`;
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
            .attr('id', `${id_prefix}-${i*offset}`)
            .property('checked', checked)
            .on('click', callback);

        div.append('label')
            .classed('form-check-label', true)
            .attr('for', `${id_prefix}-${i*offset}`)
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
