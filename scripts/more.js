// =================================================================
// = more.js
// =  Description   : initializes more-info.html
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================

// constants
var hid = '#header'
    fid = '#footer'

var header, footer;

document.addEventListener("DOMContentLoaded", function() {
    header = d3.select(hid);
    footer = d3.select(fid);
    initNavbar(header, 2);
    initFooter(footer, false);
})
