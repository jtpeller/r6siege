// =================================================================
// = ops.js
// =  Description   : Builds ops.html
// =  Author        : jtpeller
// =  Date          : March 28, 2022
// =================================================================
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // utils, header, select content div
    const utils = new Utils();
    utils.initNavbar(utils.select('#header'), 0);
    const content = utils.select('#main');

    // data
    let atk, def, gadgets;
    let data = [];       // subset of ops to be built based on filters
    let roles = [];      // subset of roles to be built based on op-type selection
    let gen_roles, atk_roles, def_roles;    // roles built from ops dataset
    const genders = ["Female", "Male", "Non-Binary"];
    
    // introductory part of the page
    let ops = utils.append(content, 'div', {classList: 'row'});
    utils.addPageTitle(ops, "Operator Roulette");
    utils.append(ops, 'p', {
        classList: 'standout',
        innerHTML: "Don't know what operator to play? Bored of playing the same 3 operators? Want to find a new main? Press your luck!",
    });

    // load all data w/ d3 utils
    Promise.all([
        fetch('data/atk.json'),
        fetch('data/def.json'),
        fetch('data/gadgets.json')
    ]).then(function (responses) {
        return Promise.all(responses.map(function(response) {
            return response.json();
        }));
    }).then(function (values) {
        // set all necessary data
        atk = values[0].atk
        def = values[1].def
        gadgets = values[2];
        utils.saveData(atk, def, gadgets);  // save so utils can use this properly

        // build datasets from this data
        data = [...atk, ...def];
        [gen_roles, atk_roles, def_roles] = utils.generateSets(atk, def, "role", true)
        roles = [...gen_roles, ...atk_roles, ...def_roles];
        roles.sort();

        // initialize the page
        initOps();
    })

    function initOps() {
        // where the generation button will go.
        ops.append(buildGenerateDiv());
        utils.append(ops, 'hr');
    
        // roulette body
        let body = utils.append(ops, 'div', {classList: 'row'});
        body.append(buildFilters());
        body.append(buildOutput());
        
        // build the generation div, where the btn will sit
        function buildGenerateDiv() {
            let generator = utils.create('div');

            let btn_div = utils.append(generator, 'div', {classList: 'text-center'});
            utils.append(btn_div, 'button', {
                classList: 'site-btn w-75 siege-uppercase gradient-transparent border-highlight',
                id: 'generate',
                textContent: 'Generate',
                onclick: () => {
                    // RNG 
                    let rng = Math.floor(Math.random() * data.length);
                    let op = data[rng];
                    utils.transitionOpCard(op);
                }
            })

            return generator;
        }

        // builds filters accordion, populates it, and adds behaviors.
        function buildFilters() {
            // add filters
            let filtercol = utils.create('div', {classList: 'col-sm-12 col-lg-4'});
            utils.buildAccordion(filtercol, "Filters");

            let acc_body = utils.select('#Filters-body', filtercol);

            // organize into grid
            let row = utils.append(acc_body, 'div', {classList: 'row'});
            let form = utils.append(row, 'div', {id: 'form'});

            // conditions:
            // ... build operator side selection menu
            utils.addHeader(form, "Operator Side");

            let optype_select = utils.buildSelect({
                classList: 'form-select bg-dark text-white siege-bold',
                id: 'op-type-select',
                ariaLabel: 'Operator Type Select',
                onchange: () => {
                    buildData();
                    utils.buildChecklist(utils.select('#role-form'), roles, true, buildData, 'role');
                    utils.select('#generate').click();
                }
            }, [
                {value: 3, text: "Both"},
                {value: 1, text: "Attackers only"},
                {value: 2, text: "Defenders only"}
            ])
            form.append(optype_select);

            // build checklist filters:
            utils.buildFilterForm(form, roles, buildData, "Role", "role");
            utils.buildFilterForm(form, genders, buildData, "Gender", "gender");
            utils.buildFilterForm(form, [1, 2, 3], buildData, "Speed", "speed");

            // add separator
            utils.append(form, 'hr');

            // build toggle-all-filters btn
            utils.buildToggleButton(row, buildData);

            return filtercol;
        }

        // creates the output div that holds the op card
        function buildOutput() {
            let output_div = utils.create('div', {classList: 'col'});
            let op_div = utils.append(output_div, 'div');

            let rng = Math.floor(Math.random() * data.length);
            let op = data[rng];
            utils.buildOpCard(op_div, op);

            return output_div; 
        }
    
        // builds the dataset based on the user-selected conditions and filters
        function buildData() {
            // get op type
            let optype_select = utils.select('#op-type-select')
            let temp = optype_select.value;
    
            // update data based on type
            switch (temp) {
                case '1':       // attacker
                    data = [...atk];
                    roles = [...gen_roles, ...atk_roles];
                    break;
                case '2':       // defender
                    data = [...def];
                    roles = [...gen_roles, ...def_roles];
                    break;
                default:       // both atk/def
                    data = [...atk, ...def];
                    roles = [...gen_roles, ...atk_roles, ...def_roles];
            }
            roles.sort();
    
            // now, filter based on gender, role, and speed
            // filter gender
            let checked = utils.extractCheckedValues(utils.select('#gender-form'));
            utils.filter(data, checked, 'gender', genders);
    
            // filter role
            checked = utils.extractCheckedValues(utils.select('#role-form'));
            utils.filterList(data, checked, 'role', roles);
    
            // filter speed
            checked = utils.extractCheckedValues(utils.select('#speed-form'));
            utils.filter(data, checked, 'speed', [1, 2, 3]);
            
            // enable/disable site button as needed
            if (data.length <= 0) {
                utils.setEnabled('#generate', false);
            } else {
                utils.setEnabled('#generate', true);
            }
        }
    }
})
