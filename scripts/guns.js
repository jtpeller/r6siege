// =================================================================
// = guns.js
// =  Description   : initializes guns.html
// =  Author        : jtpeller
// =  Date          : September 26, 2022
// =================================================================
"use strict";

document.addEventListener("DOMContentLoaded", function() {
    // initializations
    const utils = new Utils();
    utils.initNavbar(utils.select('#header'), 4);
    const content = utils.select('#main');

    // data
    let pri = [];       // primary weapons
    let sec = [];       // secondary weapons
    let data = [];
    let maxes = {};       // maximum values
    
    // load all data
    Promise.all([
        fetch('data/primary.json'),
        fetch('data/secondary.json')
    ]).then(function (responses) {
        return Promise.all(responses.map(function(response) {
            return response.json();
        }));
    }).then(function(values) {
        // set the data
        pri = values[0].primary;
        sec = values[1].secondary;

        // sort each of the data arrays
        function sort(a, b) {
            return ('' + a.name).localeCompare(b.name);
        }
        pri.sort(sort);
        sec.sort(sort);

        // build data
        [...pri, ...sec].forEach((val) => {
            data.push(val.name);
        })
        data.sort((a, b) => { return ('' + a).localeCompare(b)});

        // calculate the max values
        maxes = utils.setMaxValues(pri, sec);
        
        // build the page
        initGuns();

        // scroll to the right point for hash link, if it exists
        setTimeout( () => {
            let sav = location.hash;
            if (sav.length > 1) {
                sav = sav.replaceAll("%20", " ");   // clean up URL
                utils.select(sav).scrollIntoView(true)
            }
        }, 500);
    })

    function initGuns() {
        // add main title
        utils.addPageTitle(content, "Guns List")
        utils.append(content, 'p', {
            classList: 'standout',
            textContent: 'Each and every gun from the game is listed below. You can take a look at their stats or just look at the operators who have that gun. Start a search or get scrolling!'
        })

        // add search bar
        utils.buildSearchBar(content, enter, submit, data, 'guns')
        function enter(e) {
            if (e.key === 'Enter') {
                submit(e)
            }
        }

        function submit(e) {
            let value = utils.capitalizeFirstLetter(utils.select('#guns-search-bar').value);
            if (data.includes(value)) {
                location.href = `#${value}`;
            }
        }

        // primaries
        let loc = utils.append(content, 'div', {classList: 'row'});
        utils.addHeader(loc, "Primaries", "Primaries");
        buildGunCards(pri, loc, true, maxes);
    
        // secondaries
        loc = utils.append(content, 'div', {classList: 'row'});
        utils.addHeader(loc, "Secondaries", "Secondaries");
        buildGunCards(sec, loc, false, maxes);
    
        // add nav arrows
        utils.buildNavigationArrows(content, getNavArrowList());
    }
    
    // calls the buildGunCard function for each gun in arr
    function buildGunCards(arr, loc, isPrimary, max) {
        for (let i = 0; i < arr.length; i++) {
            let col = utils.append(loc, 'div', {classList: 'col-sm-12 col-lg-6'})
            utils.buildGunCard(col, arr[i], isPrimary, max);
        }
    }
    
    // gets the list used when building navigation arrows
    function getNavArrowList() {
        return [{
            title: "Primaries",
            src: utils.fetchGunImage('MP5K'),
        }, {
            title: "Secondaries",
            src: utils.fetchGunImage('D-50'),
        }, {
            title: "Top",
            src: 'resources/up.svg',
        }];
    }
})