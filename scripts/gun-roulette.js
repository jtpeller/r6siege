// =================================================================
// = guns-roulette.js
// =  Description   : Builds guns-roulette.html
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================
"use strict";

document.addEventListener("DOMContentLoaded", function() {
    const utils = new Utils();

    // datasets
    let pri = []
    let sec = [];
    let maxes = {};
    let classes = [];
    let data = [];
    let pri_types, sec_types, both_types = [];

    // create header
    utils.initNavbar(utils.select('#header'), 1);

    // page content
    let content = utils.select('#main');
    let guns = utils.append(content, 'div', {classList: 'row'});
    utils.addPageTitle(guns, 'Gun Roulette');     // page title

    // add heading/main content
    utils.append(guns, 'p', {
        classList: 'standout',
        textContent: "Want to play a random gun? Bored of the same ol' guns? Want a new favorite gun? Press your luck!"
    });

	// load all data w/ d3 utils
	Promise.all([
		fetch('data/primary.json'),
		fetch('data/secondary.json')
	]).then(function (responses) {
        return Promise.all(responses.map(function(response) {
            return response.json();
        }));
    }).then(function(values) {
		// set all necessary data
		pri = values[0].primary
		sec = values[1].secondary
        
        // set all other values from this data
        // on page load, it'll be both primaries/secondaries
        maxes = utils.setMaxValues(pri, sec);
        data = [...pri, ...sec];

        // extract gun classes
        [both_types, pri_types, sec_types] = utils.generateSets(structuredClone(pri), structuredClone(sec), "type", false)
        classes = [...pri_types, ...sec_types]

        // build the page
		initGuns(guns);
	})

    function initGuns(guns) {
        // build generate_div
        guns.append(buildGenerateDiv());
        utils.append(guns, 'hr');

        // build the body
        let body = utils.append(guns, 'div', {classList: 'row'});
        body.append(buildFilters());
        body.append(buildOutput());

        function buildGenerateDiv() {
            // create the div where it will sit
            let generator = utils.create('div')

            // create a center div and the button
            let btn_div = utils.append(generator, 'div', {classList: 'text-center'});
            utils.append(btn_div, 'button', {
                classList: 'site-btn w-75 siege-uppercase gradient-transparent border-highlight',
                id: 'generate',
                textContent: 'Generate',
                onclick: () => {
                    // RNG a new gun & update
                    let rng = Math.floor(Math.random() * data.length);
                    let gun = data[rng];
                    utils.transitionGunCard(utils.select('#output'), gun, isPrimary(gun.name), maxes);
                }
            });

            return generator;
        }

        // builds the filters accordion, populates it, and adds all behaviors
        function buildFilters() {
            // add the filters
            let filtercol = utils.create('div', {classList: 'col-sm-12 col-lg-4'});
            utils.buildAccordion(filtercol, "Filters");

            let acc_body = filtercol.querySelector('#Filters-body');

            // the filter accordion is organized into a grid
            let row = utils.append(acc_body, 'div', {classList: 'row'});
            let form = utils.append(row, 'div', {id: 'form'});

            // conditions:
            // ... build operator side selection
            utils.addHeader(form, "Operator Side");
            let type_select = utils.buildSelect({
                classList: 'form-select bg-dark text-white siege-bold',
                id: 'gun-type-select',
                ariaLabel: 'Gun Type Select',
                onchange: () => {
                    buildData();            // get new dataset
                    buildChecklist(utils.select('#gun-class'), classes, true, buildData, 'class');
                    utils.select('#generate').click();
                }
            }, [
                {value: 3, text: "Both"},
                {value: 1, text: "Primaries only"},
                {value: 2, text: "Secondaries only"}
            ]);
            form.append(type_select);

            // ... build atk or def form
            utils.buildFilterForm(form, ["Attacker", "Defender"], buildData, "Team", "team");
            utils.buildFilterForm(form, classes, buildData, "Gun Class", "gun-class");

            // separate toggler button from rest of form
            utils.append(form, 'hr');

            // ... build toggle all filters button
            utils.buildToggleButton(row, buildData);

            return filtercol;
        }

        // creates the output div that holds the gun card
        function buildOutput() {
            let output_div = utils.create('div', {classList: 'col', id: 'output'});
            let gun_div = utils.append(output_div, 'div');

            let rng = Math.floor(Math.random() * data.length);
            let gun = data[rng];
            utils.buildGunCard(gun_div, gun, isPrimary(gun.name), maxes, true);

            return output_div;
        }

        // builds the dataset based on the user-selected conditions / filters.
        function buildData() {
            // get selected gun type (if statement handles first time page loading)
            let temp = 3;
            if (utils.select('#gun-type-select') != null) {
                temp = utils.select('#gun-type-select').value;
            }

            // init data based on type
            switch (temp) {
                case '1':   // primary
                    data = [...pri];
                    classes = [...pri_types];
                    break;
                case '2':   // secondary
                    data = [...sec];
                    classes = [...sec_types];
                    break;
                default:    // both primary/secondaries
                    data = [...pri, ...sec];
                    classes = [...pri_types, ...sec_types];
            }
            classes.sort();
            
            // filter based on selected attacker/defender
            let checked = utils.extractCheckedValues(utils.select('#team-form'))
            utils.filterList(data, checked, 'team', ["Attacker", "Defender"]);

            // filter based on selected gun class
            checked = utils.extractCheckedValues(utils.select('#gun-class-form'))
            utils.filter(data, checked, 'type', classes);

            // enable/disable site button as needed
            if (data.length <= 0) {
                utils.setEnabled('#generate', false);
            } else {
                utils.setEnabled('#generate', true);
            }
        }
    }

    // returns true if gun {string} is a primary weapon, false otherwise.
    function isPrimary(gun) {
        for (let i = 0; i < pri.length; i++) {
            if (pri[i].name == gun) {
                return true;
            }
        }
        return false;
    }
})
