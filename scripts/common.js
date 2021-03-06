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
        .text('R6 Roulette');
    
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