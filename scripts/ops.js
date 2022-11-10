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
window.rows = [];
window.last = {
    name: '',
    row: -1,
}

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
        
        // save the hash name for later
        var sav = location.hash;
        if (sav.length > 1) {
            location.hash = '';
            location.hash = sav;
        }

        window.last.name = sav.replaceAll('#', '');

        initOps();
        
        // scroll to the right point for hash link
        setTimeout( () => {
            var sav = location.hash;
            if (sav.length > 1) {
                location.hash = '';
                location.hash = sav;
            }
        }, 750);

        // click the specified operator
        console.log(window.last);
        if (window.last.name != '' && window.last.row === -1) {
            d3.select(`#${window.last.name}`).node().click();
            console.log('clicked button', `${window.last.name}`)
        }
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
        .classed('d-block', true);

    loc.append('h4')
        .classed('my-header', true)
        .attr('id', 'Attackers')
        .text('Attackers');

    buildOpCards(window.atk, loc, true);

    // defenders
    loc = content.append('div')
        .attr('id', 'defenders')
        .classed('d-block', true);

    loc.append('h4')
        .classed('my-header', true)
        .attr('id', 'Defenders')
        .text('Defenders');

    buildOpCards(window.def, loc, false);

    // now, add navigation arrows
    var loc = d3.select('#main-content')
    navigationArrows(loc);
}

function buildOpCards(arr, loc, atk) {
    let offset;
    if (atk) {
        offset = 0;
    } else {
        offset = 5;     // row count
    }
    // break up array into chunks (of 8)
    const size = 8;
    for (let i = 0; i < arr.length; i += size) {
        var chunk = arr.slice(i, i + size);

        var row = loc.append('div')
            .attr('id', `img-row-${i/size + offset}`)
            .classed('row img-row', true);

        // loop thru chunk & build the card
        for (let j = 0; j < chunk.length; j++) {
            let op = chunk[j];

            var cardcol = row.append('div')
                .classed('card-col col-auto', true);

            var carddiv = cardcol.append('button')
                .attr('id', `${op.name}`)
                .attr('rownum', i/size+offset)
                .classed('card-button btn', true)
                .on('mouseover', function() {
                    d3.select(this)
                        .select('.op-footer')
                        .classed('op-highlighted', true);
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .select('.op-footer')
                        .classed('op-highlighted', false);
                })
                .on('click', function() {
                    // collapse the last row
                    if (window.last.row != -1) {
                        collapse(window.last.row);
                    }

                    // set this button as highlighted
                    d3.selectAll('.op-clicked')
                        .classed('op-clicked', false);

                    d3.select(this)
                        .select('.op-footer')
                        .classed('op-clicked', true);

                    // get which operator was clicked
                    var name = d3.select(this).attr('id');
                    var rownum = +d3.select(this).attr('rownum');
                    console.log(name, rownum);

                    // check if last op is this op
                    console.log('last', window.last.name, 'current', name)
                    if (window.last.name == name && window.last.row != -1) {
                        // they clicked the same operator. collapse
                        collapse(window.last.row);

                        // reset buttons n stuff
                        d3.selectAll('.op-clicked')
                            .classed('op-clicked', false);

                        window.last.name = '';

                        return;
                    }

                    // now, get that row's desc
                    let desc = d3.select(`#desc-row-${rownum}`);

                    // get the operator object
                    ops = [...window.atk, ...window.def];
                    obj = {};
                    for (var k = 0; k < ops.length; k++) {
                        if (ops[k].name == name) {
                            obj = ops[k];
                            break;
                        }
                    }
                    buildOpCard(obj, desc);

                    // show this row
                    expand(rownum);

                    window.last.row = rownum;
                    window.last.name = name;

                    function collapse(idx) {
                        var temp = d3.select(`#desc-row-${idx}`)
                        temp.classed('visible', false);
                        temp.html('').style('height', 0);
                    }

                    function expand(idx) {
                        var temp = d3.select(`#desc-row-${idx}`)
                        temp.classed('visible', true);
                        temp.style('height', 'fit-content');
                    }
                })
                .append('div')
                .attr('id', op.name)
                .classed('card op-card no-border', true)

            // name & logo are listed
            carddiv.append('img')    
                .classed('card-img-top', true)
                .attr('src', fetchOpImage(op.name))
                .attr('alt', op.name);

            var body = carddiv.append('div')
                .classed('card-footer op-footer no-radius', true)

            body.append('h4')
                .classed('op-title', true)
                .text(op.name);
        }

        loc.append('div')
            .classed('desc-row', true)
            .attr('id', `desc-row-${i/size + offset}`)
    }
}

/**
 * navigationArrows() -- builds navigation buttons to be placed on the side of the 
 * page for users to click to quickly move around the page.
 * 
 * @param loc       the d3 element to place these buttons.
 */
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
