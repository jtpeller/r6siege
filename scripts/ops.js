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

document.addEventListener("DOMContentLoaded", function() {
    // build header
    header = d3.select('header');
    initNavbar(header, 3);
    
    content = d3.select('main')
        .append('div');

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
        window.last.name = sav.replaceAll('#', '');

        // initialize the page
        initOps();
        
        // scroll to the right point for hash link
        setTimeout( () => {
            if (sav.length > 1) {
                d3.select(sav).node().scrollIntoView(true)
            }
        }, 500);

        // click the specified operator
        if (window.last.name != '' && window.last.row === -1) {
            d3.select(`#${window.last.name}`).node().click();
        }
    })
})

function initOps() {
    buildModal(content);

    // attackers
    var loc = content.append('div');
    addTitle(loc, 'Attackers', 'Attackers');
    buildOpCards(window.atk, loc);

    // defenders
    loc = content.append('div');
    addTitle(loc, 'Defenders', 'Defenders');
    buildOpCards(window.def, loc);

    // navigation arrows
    navigationArrows(content);
}

function buildOpCards(arr, loc) {
    // populate the row
    var row = d3.create('div').classed('row', true)
    for (let i = 0; i < arr.length; i++) {
        let op = arr[i];
        var cardcol = row.append('div')
            .classed('col-sm-6 col-md-3 col-lg-3 col-xl-2', true);

        // this button creates the modal
        var carddiv = cardcol.append('button')
            .attr('type', 'button')
            .attr('id', `${op.name}`)
            .classed('card-button btn', true)
            .attr('data-bs-toggle', 'modal')
            .attr('data-bs-target', '#op-modal')
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
                var modal_body = d3.select('#modal-body');
                modal_body.html('');
                buildOpCard(op, modal_body);
            })
            .append('div')
            .attr('id', op.name)
            .classed('card op-card no-border', true)

        // name & logo are listed
        carddiv.append('img')    
            .classed('card-img-top center op-img', true)
            .attr('src', fetchOpImage(op.name))
            .attr('alt', op.name);

        var body = carddiv.append('div')
            .classed('card-footer op-footer no-radius', true)

        body.append('h6')
            .classed('op-title siege-uppercase', true)
            .text(op.name);
    }
    loc.append(() => row.node());
}

/**
 * buildModal() -- builds the op modal
 * @param loc       the d3 element to place these buttons.
 * @param op        the JSON obj holding the op
 */
function buildModal(loc) {
    var modal = d3.create('div')
        .classed('modal fade', true)
        .attr('id', 'op-modal')
        .attr('aria-hidden', 'true')
        .attr('tabindex', -1);

    var modal_content = modal.append('div')
        .classed('modal-dialog modal-dialog-centered modal-dialog-scrollable', true)
        .append('div')
        .classed('modal-content', true)

    var modal_header = modal_content.append('div')
        .classed('modal-header', true)

    modal_header.append('button')
        .classed('btn-close', true)
        .attr('data-bs-dismiss', 'modal')
        .attr('aria-label', 'Close');

    modal_content.append('div')
                .classed('modal-body', true)
                .attr('id', 'modal-body');

    loc.append(() => modal.node());
}

/**
 * navigationArrows() -- builds navigation buttons to be placed on the side of the 
 * page for users to click to quickly move around the page.
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
