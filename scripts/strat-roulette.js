// =================================================================
// = strat-roulette.js
// =  Description   : initializes strat-roulette.html
// =  Author        : jtpeller
// =  Date          : September 26, 2022
// =================================================================

let header, content;

window.onload = function() {
    // get d3 elements
    header = d3.select('header');
    initNavbar(header, 2);

    content = d3.select('main')
        .append('div');
    
    // build content
    content.append('div')
        .text('This page is under construction...');
}
