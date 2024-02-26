// =================================================================
// = more.js
// =  Description   : initializes more-info.html
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================

// load the navbar
document.addEventListener("DOMContentLoaded", function() {
    const utils = new Utils();
    utils.initNavbar(utils.select('#header'), 5);
})
