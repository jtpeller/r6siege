// =================================================================
// = index.js
// =  Description   : initializes index.html
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================

let header, footer;

document.addEventListener("DOMContentLoaded", function() {
    // get d3 objects
    content = d3.select('#content');
    footer = d3.select('#footer');

    //
    // initialize site
    //
    let banner = content.append('div')
        .classed('banner', true);

    let title = banner.append('span')
        .classed('title-box', true)
        .append('h1')
        .classed('title-card', true)
        .text('R6S Roulette');

    // links
    let links = content.append('div')
        .classed('d-flex justify-content-center link-card', true);

    let ul = links.append('div')
        .classed('link-list', true);

    for (var i = 0; i < ll.length; i++) {
        ul.append('a')
            .classed('btn btn-item gradient', true)
            .attr('href', ll[i].html)
            .append('a')
            .classed('btn-link', true)
            .attr('href', ll[i].html)
            .text(ll[i].link);
    }

    // initialize footer
    initFooter(footer, true);
})
