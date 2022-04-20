// =================================================================
// = home.js
// =  Description   : initializes home.html
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================

// constants
var hid = '#header'
    fid = '#footer'
    cid = '#content'


// d3 selections
var header
var footer
var content

document.addEventListener("DOMContentLoaded", function() {
    header = d3.select(hid);
    footer = d3.select(fid);
    content = d3.select(cid);
    initHome();
})

function initHome() { 
    initNavbar(header);
    initContent(content)
    initFooter(footer);
}

function initContent(content) {
    content.append('p')
        .text('ayo this is a home page lol');
}