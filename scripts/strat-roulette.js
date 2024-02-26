// =================================================================
// = strat-roulette.js
// =  Description   : initializes strat-roulette.html
// =  Author        : jtpeller
// =  Date          : September 26, 2022
// =================================================================
"use strict";

window.onload = function() {
    // utils, header, select content div
    const utils = new Utils();
    utils.initNavbar(utils.select('#header'), 2)
    
    // data
    let atk, def = [];
    let data = [];

    // page content
    const content = utils.select('#main');
    let strats_div = utils.append(content, 'div', {classList: 'row'});
    utils.addPageTitle(strats_div, 'Strat Roulette');

    // add heading / main content
    utils.append(strats_div, 'p', {
        classList: 'standout',
        textContent: "Bored of the same ol' same ol'? Want a challenge? Want to do something that's probably extremely stupid? Press your luck!",
    });

    utils.append(strats_div, 'i', {
        classList: 'text-center mb-2',
        textContent: "[Warning: this is very much a work-in-progress]"
    })
    
    // load all data
    Promise.all([
        fetch('data/strats.json')
    ]).then(function (responses) {
        return Promise.all(responses.map(function(response) {
            return response.json();
        }));
    }).then(function (values) {
        // set the data
        atk = values[0]["atk-strat"];
        def = values[0]["def-strat"];
        data = [...atk, ...def];

        initStrats();
    });

    function initStrats() {
        strats_div.append(buildGenerateDiv());
        utils.append(strats_div, "hr");

        // build the body, which just has the output card for now
        let body = utils.append(strats_div, 'div', {classList: 'row'});
        body.append(buildOutput());

        // creates the Generate button
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
                    let strat = data[rng];
                    utils.select('#output').innerHTML = strat;
                }
            });

            return generator;
        }

        // creates the output div that holds the gun card
        function buildOutput() {
            let output_div = utils.create('div', {classList: 'col'});
            let div = utils.append(output_div, 'div', {
                classList: 'standout', 
                id: 'output'
            });

            let rng = Math.floor(Math.random() * data.length);
            let strat = data[rng];
            div.innerHTML = strat;

            return output_div;
        }
    }
}
