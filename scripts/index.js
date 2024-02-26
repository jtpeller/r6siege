// =================================================================
// = index.js
// =  Description   : initializes index.html
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================

document.addEventListener("DOMContentLoaded", function () {
    const utils = new Utils();
    let row = utils.select('#btn-loc')
    utils.buildHomeLinks(row);
})
