// =================================================================
// = guns.js
// =  Description   : initializes guns.html
// =  Author        : jtpeller
// =  Date          : September 26, 2022
// =================================================================

let header, content;

window.pri = [];
window.sec = [];

document.addEventListener("DOMContentLoaded", function() {
    // build header
    header = d3.select('header');
    initNavbar(header, 4);
    
    content = d3.select('main')
        .append('div');
    
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
                d3.select(sav).node().scrollIntoView(true)
            }
        }, 500);
    })
})

function initGuns() {
    // primaries
    var loc = content.append('div')
        .attr('id', 'primaries')        // used for href
        .classed('row', true);
    addTitle(loc, "Primaries");
    buildGunCards(window.pri, loc, true);

    // secondaries
    loc = content.append('div')
        .attr('id', 'secondaries')        // used for href
        .classed('row', true);
    addTitle(loc, "Secondaries");
    buildGunCards(window.sec, loc, false);

    // add nav arrows
    navigationArrows(content);
}

function buildGunCards(arr, loc, pri) {
    for (var i = 0; i < arr.length; i++) {
        var col = loc.append('div')
            .classed('col-sm-12 col-lg-6', true)
        buildGunCard(arr[i], col, pri);
    }
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
        .attr('src', fetchGunImage('MP5K'))
        .attr('alt', 'PRIMARIES')
        .attr('loading', 'lazy');

    var def = parent.append('div')
        .classed('gradient border-highlight mt-3', true)

    def.append('a')
        .attr('href', '#secondaries')
        .attr('title', 'Jump to secondaries')
        .classed('btn rect', true)
        .append('img')
        .classed('center img-svg', true)
        .attr('src', fetchGunImage('D-50'))
        .attr('alt', 'SECONDARIES')
        .attr('loading', 'lazy');

    var top = parent.append('div')
        .classed('gradient border-highlight mt-3', true)

    top.append('a')
        .attr('href', '#')
        .attr('title', 'Jump to top')
        .classed('btn rect', true)
        .append('img')
        .classed('center img-svg', true)
        .attr('src', 'resources/up.svg')
        .attr('alt', 'TOP')
        .attr('loading', 'lazy');
}
