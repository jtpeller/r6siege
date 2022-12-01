// =================================================================
// = guns.js
// =  Description   : initializes guns.html
// =  Author        : jtpeller
// =  Date          : September 26, 2022
// =================================================================

let header, content;

window.pri = [];
window.sec = [];

window.onload = function() {
    // get d3 elements
    header = d3.select('#header');
    content = d3.select('#content');

    // build header
    initNavbar(header, 4);

    // load all data
    Promise.all([
        d3.json('data/primary.json'),
        d3.json('data/secondary.json')
    ]).then(function(values) {
        // set the data
        window.pri = values[0].primary;
        window.sec = values[1].secondary;

        // sort the data
        window.pri.sort(function (a, b) {
            return ('' + a.name).localeCompare(b.name);
        })
        
        window.sec.sort(function (a, b) {
            return ('' + a.name).localeCompare(b.name);
        })

        // calculate the max values
        setMaxValues(window.pri, window.sec);
        
        // build the page
        initGuns();

        // scroll to the right point for hash link
        setTimeout( () => {
            var sav = location.hash;
            if (sav.length > 1) {
                location.hash = '';
                location.hash = sav;
            }
        }, 750);
    })
}

function initGuns() {
    // init page
    content.classed('container', true);

    content.append('h2').text('Guns');

    // primaries
    var loc = content.append('div')
        .attr('id', 'primaries')

    loc.append('h4')
        .classed('my-header', true)
        .text('Primaries');

    buildGunCards(window.pri, loc, true);

    // secondaries
    loc = content.append('div')
        .attr('id', 'secondaries')

    loc.append('h4')
        .classed('my-header', true)
        .text('Secondaries');

    buildGunCards(window.sec, loc, false);

    // add nav arrows
    var loc = d3.select('#main-content');
    navigationArrows(loc);
}

function buildGunCards(arr, loc, pri) {
    for (var i = 0; i < arr.length; i++) {
        buildGunCard(arr[i], loc, pri);
    }

    d3.selectAll('.gun-roulette-card')
        .classed('gun-roulette-card', false)
        .classed('gun-output-card', true);
}

function navigationArrows(loc) {
    var parent = loc.append('div')
        .classed('nav-arrows', true)

    var atk = parent.append('div')
    .classed('gradient border-highlight', true)

    atk.append('a')
        .attr('href', '#primaries')
        .attr('title', 'Jump to primaries')
        .classed('btn rect', true)
        .append('img')
        .classed('center img-svg', true)
        .attr('src', 'resources/guns/MP5K.png')
        .attr('alt', 'PRIMARIES');

    var def = parent.append('div')
        .classed('gradient border-highlight mt-3', true)

    def.append('a')
        .attr('href', '#secondaries')
        .attr('title', 'Jump to secondaries')
        .classed('btn rect', true)
        .append('img')
        .classed('center img-svg', true)
        .attr('src', 'resources/guns/D-50.png')
        .attr('alt', 'SECONDARIES');

    var top = parent.append('div')
        .classed('gradient border-highlight mt-3', true)

    top.append('a')
        .attr('href', '#')
        .attr('title', 'Jump to top')
        .classed('btn rect', true)
        .append('img')
        .classed('center img-svg', true)
        .attr('src', 'resources/up.svg')
        .attr('alt', 'TOP');
}
