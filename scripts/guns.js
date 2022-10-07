// =================================================================
// = guns.js
// =  Description   : initializes guns.html
// =  Author        : jtpeller
// =  Date          : September 26, 2022
// =================================================================

let header, content;

window.pri = [];
window.sec = [];

window.onload = function() {
    // get d3 elements
    header = d3.select('#header');
    content = d3.select('#content');

    // build header
    initNavbar(header, 4);

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

        // build the page
        initGuns();

        // scroll to the right point for hash link
        setTimeout( () => {
            console.log(location.hash);
            var sav = location.hash;
            if (sav.length > 1) {
                location.hash = '';
                location.hash = sav;
            }
        }, 750);
    })
}

function initGuns() {
    // init page
    content.classed('container', true);

    content.append('h2').text('Guns');

    // primaries
    var loc = content.append('div')
        .attr('id', 'primaries')

    loc.append('h4')
        .classed('my-header', true)
        .text('Primaries');

    buildGunCards(window.pri, loc);

    // secondaries
    loc = content.append('div')
        .attr('id', 'secondaries')

    loc.append('h4')
        .classed('my-header', true)
        .text('Secondaries');

    buildGunCards(window.sec, loc);

    // add nav arrows
    var loc = d3.select('#main-content');
    navigationArrows(loc);
}

function buildGunCards(arr, loc) {
    // loop thru arr and make a neat looking card for each gun
    for (var i = 0; i < arr.length; i++) {
        let gun = arr[i];

        var carddiv = loc.append('div')
            .attr('id', gun.name)
            .classed('my-card op-card', true);

        var rowdiv = carddiv.append('div')
            .classed('row card-body', true);

        //
        // 2 columns: name/icon/type, properties
        //

        // column 1: name/icon/type
        var col1 = rowdiv.append('div')
            .classed('col my-auto', true);

        col1.append('img')
            .classed('center gun-img-lg', true)
            .attr('src', fetchGunImage(gun.name))
            .attr('alt', gun.name);

        col1.append('h3')
            .classed('text-center', true)
            .text(gun.name);

        col1.append('h6')
            .classed('text-center italic', true)
            .text(gun.type);

        col1.append('h6')
            .classed('my-header', true)
            .text('Operators');

        for (var j = 0; j < gun.ops.length; j++) {
            var imgdiv = col1.append('div')
                .style('display', 'inline-block')
                .classed('text-center', true)
            
            imgdiv.append('a')
                .attr('href', `ops.html#${gun.ops[j]}`)
                .append('img')
                .classed('mx-auto', true)
                .style('width', '4rem')
                .attr('src', fetchOpImage(gun.ops[j]))
                .attr('alt', gun.ops[j])
        }

        // column 2: properties
        var col2 = rowdiv.append('div')
            .classed('col', true);

        var prop = col2.append('ul')
            .classed('list-group list-group-flush', true);

        // damage
        prop.append('h6')
            .text('Damage')
            .classed('my-header', true);

        prop.append('p').text(gun.properties.damage);

        // firerate
        prop.append('h6')
            .text('Fire Rate')
            .classed('my-header', true);

        if (gun.properties.firerate == -1) {
            prop.append('p').text('Semi-Auto')
        } else {
            prop.append('p').text(gun.properties.firerate)
        }

        // capacity
        prop.append('h6')
            .text('Capacity')
            .classed('my-header', true);

        prop.append('p').text(gun.properties.capacity)

        // mobility
        prop.append('h6')
            .text('Mobility')
            .classed('my-header', true);

        prop.append('p').text(gun.properties.mobility)
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
        .attr('src', 'resources/guns/MP5K.png')
        .attr('alt', 'PRIMARIES');

    var def = parent.append('div')
        .classed('gradient border-highlight mt-3', true)

    def.append('a')
        .attr('href', '#secondaries')
        .attr('title', 'Jump to secondaries')
        .classed('btn rect', true)
        .append('img')
        .classed('center img-svg', true)
        .attr('src', 'resources/guns/D-50.png')
        .attr('alt', 'SECONDARIES');

    var top = parent.append('div')
        .classed('gradient border-highlight mt-3', true)

    top.append('a')
        .attr('href', '#')
        .attr('title', 'Back to top')
        .classed('btn rect', true)
        .append('img')
        .classed('center img-svg', true)
        .attr('src', 'resources/up.svg')
        .attr('alt', 'TOP');
}

