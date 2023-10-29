// =================================================================
// = index.js
// =  Description   : initializes index.html
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================

document.addEventListener("DOMContentLoaded", function () {
    let linkdiv = d3.select('#btn-loc')

    let chunks = chunkify(ll, 2, true);

    for (var i = 0; i < chunks.length; i++) {
        var col = linkdiv.append('div')
            .classed('link-list col', true);

        var temp = chunks[i];

        for (var j = 0; j < temp.length; j++) {
            col.append('a')
                .classed('btn btn-item gradient siege-uppercase', true)
                .attr('href', temp[j].html)
                .append('a')
                .classed('btn-link', true)
                .attr('href', temp[j].html)
                .text(temp[j].link);
        }
    }
})
