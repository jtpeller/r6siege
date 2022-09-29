// =================================================================
// = more.js
// =  Description   : initializes more-info.html
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================

// constants
var hid = '#header'

var header;

document.addEventListener("DOMContentLoaded", function() {
    header = d3.select(hid);
    initNavbar(header, 5);
})
