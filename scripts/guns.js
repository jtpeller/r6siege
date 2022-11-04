// =================================================================
// = guns.js
// =  Description   : initializes guns.html
// =  Author        : jtpeller
// =  Date          : September 26, 2022
// =================================================================

let header, content;

window.pri = [];
window.sec = [];

window.max = {
    pri: 0,     // primary damage
    sec: 0,     // secondary damage
    fir: 0,     // fire rate
    cap: 0,     // capacity
    mob: 0      // mobility
}

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

        // calculate the max values
        temp = [...window.pri, ...window.sec];

        window.max.pri = getMax(window.pri, "damage");
        window.max.sec = getMax(window.sec, "damage");
        window.max.fir = getMax(temp, "firerate");
        window.max.cap = getMax(temp, "capacity");
        window.max.mob = getMax(temp, "mobility");

        // build the page
        initGuns();

        // scroll to the right point for hash link
        setTimeout( () => {
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

    buildGunCards(window.pri, loc, true);

    // secondaries
    loc = content.append('div')
        .attr('id', 'secondaries')

    loc.append('h4')
        .classed('my-header', true)
        .text('Secondaries');

    buildGunCards(window.sec, loc, false);

    // add nav arrows
    var loc = d3.select('#main-content');
    navigationArrows(loc);
}

function buildGunCards(arr, loc, pri) {
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

        // gun icon
        col1.append('img')
            .classed('center gun-img-lg', true)
            .attr('src', fetchGunImage(gun.name))
            .attr('alt', gun.name)
            .attr('title', gun.name);

        // gun type
        col1.append('h3')
            .classed('text-center', true)
            .text(gun.name);

        // gun type
        col1.append('h6')
            .classed('text-center italic', true)
            .text(gun.type);

        // append all ops
        col1.append('h6')
            .classed('my-header', true)
            .text('Operators');

        var imgs = col1.append('div')
            .classed('text-center', true);

        for (var j = 0; j < gun.ops.length; j++) {
            var imgdiv = imgs.append('div')
                .style('display', 'inline-block')
                .classed('text-center', true)
            
            imgdiv.append('a')
                .attr('href', `ops.html#${gun.ops[j]}`)
                .append('img')
                .classed('mx-auto', true)
                .style('width', '4rem')
                .attr('src', fetchOpImage(gun.ops[j]))
                .attr('alt', gun.ops[j])
                .attr('title', gun.ops[j])
        }

        // column 2: properties
        var prop = rowdiv.append('div')
            .classed('col', true);

        var idx = ['damage', 'firerate', 'mobility', 'capacity'];
        var title = ['Damage', 'Fire Rate', 'Mobility', 'Capacity'];

        buildGunProps(gun.properties, idx, title, prop, pri);
    }
}

function buildGunProps(props, idx, headers, loc, primary) {
    for (var i = 0; i < idx.length; i++) {
        var row = loc.append('div')
            .classed('row my-span no-border mx-auto', true)

        var title = row.append('div')
            .classed('col-3', true);

        title.append('h6')
            .classed('text-end', true)
            .text(headers[i])

        var chart = row.append('div')
            .classed('col-auto', true);

        var get = ['', 'fir', 'mob', 'cap'];
        if (primary) {
            get[0] = 'pri'
        } else {
            get[0] = 'sec'
        }

        buildChart(props[idx[i]], window.max[get[i]], chart);
        
        // then add damage in final col
        var val = row.append('div')
            .classed('col-2', true);

        if (idx[i] == 'firerate' && props[idx[i]] == -1) {
            val.append('p')
                .text('-1')     // TODO: this should be that symbol from the game
        } else {
            val.append('p')
                .text(props[idx[i]]);
        }
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
        .attr('title', 'Jump to top')
        .classed('btn rect', true)
        .append('img')
        .classed('center img-svg', true)
        .attr('src', 'resources/up.svg')
        .attr('alt', 'TOP');
}

function getMax(list, name) {
    var max = 0;
    for (var i = 0; i < list.length; i++) {
        var prop = list[i].properties;
        var val = prop[name];
        
        if (val > max) {
            max = val;
        }
    }
    return max;
}

function buildChart(val, max, loc) {
    var svg = loc.append('svg')
        .classed('my-svg', true);

    // margins & widths
    let margin = {top: 5, left: 5, bottom: 5, right: 5}
    const width = 250;
    let innerWidth = width - margin.left - margin.right;
    
    const height = 10;

    const x_scale = d3.scaleLinear()
        .domain([0, max])
        .range([0, innerWidth]);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('id', 'g-bar');

    g.append('rect')
        .classed('bar-blank', true)
        .attr('height', height)
        .attr('width', innerWidth);

    g.append('rect')
        .classed('bar', true)
        .attr('height', height)
        .attr('width', x_scale(val));
}