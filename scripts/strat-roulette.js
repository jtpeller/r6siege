// =================================================================
// = strat-roulette.js
// =  Description   : initializes strat-roulette.html
// =  Author        : jtpeller
// =  Date          : September 26, 2022
// =================================================================

let header, content;

window.onload = function() {
    // get d3 elements
    header = d3.select('#header');
    content = d3.select('#content');

    // build header
    initNavbar(header, 2);

    // build content
    content.append('div')
        .text('This site is under construction...');
}
