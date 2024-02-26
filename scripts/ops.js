// =================================================================
// = ops.js
// =  Description   : initializes ops.html
// =  Author        : jtpeller
// =  Date          : September 26, 2022
// =================================================================
"use strict";

document.addEventListener("DOMContentLoaded", function() {
    // init header & utils
    const utils = new Utils();
    utils.initNavbar(utils.select('#header'), 3);
    const content = utils.select('#main');

    // data
    let atk = [];
    let def = [];
    let data = [];
    let gadgets = [];
    let last = {
        name: '',
        row: -1,
    }

    // load all data
    Promise.all([
        fetch('data/atk.json'),
        fetch('data/def.json'),
        fetch('data/gadgets.json')
    ]).then(function (responses) {
        return Promise.all(responses.map(function(response) {
            return response.json();
        }));
    }).then(function (values) {
        // set the data
        atk = values[0].atk;
        def = values[1].def;
        gadgets = values[2];
        utils.saveData(atk, def, gadgets);

        // build list of op names (for search)
        [...atk, ...def].forEach((val) => {
            data.push(val.name);
        });
        data.sort((a, b) => { return ('' + a).localeCompare(b)});

        // initialize the page
        initOps();
        
        // scroll to the right point for hash link
        let sav = location.hash;
        last.name = sav.replaceAll('#', '');
        setTimeout( () => {
            if (sav.length > 1) {
                utils.select(sav).scrollIntoView(true)
            }
        }, 500);

        // click the specified operator to trigger the modal
        if (last.name != '' && last.row === -1) {
            utils.select(`#${last.name}`).click();
        }
    })
    
    function initOps() {
        // add main title, standout
        utils.addPageTitle(content, "Operators List")
        utils.append(content, 'p', {
            classList: 'standout',
            textContent: 'Each and every operator from the game is listed below. You can take a look at their stats by clicking on their card. Start a search or get scrolling!'
        })

        // add search bar
        utils.buildSearchBar(content, enter, submit, data, 'op')
        function enter(e) {
            if (e.key === 'Enter') {
                submit(e)
            }
        }

        function submit(e) {
            const value = utils.capitalizeFirstLetter(utils.select('#op-search-bar').value);
            if (data.includes(value)) {
                let opcard = utils.select(`#${value}`)
                opcard.scrollIntoView(true);
                setTimeout( () => {
                    opcard.click();
                }, 500);        // delay, to scroll before opening modal

            }
        }

        // build the modal
        buildModal(content);

        // attackers
        let loc = utils.create('div', {id: 'attacker-div'});
        utils.addHeader(loc, 'Attackers', 'Attackers');
        buildOpCards(atk, loc);
        content.append(loc);

        // defenders
        loc = utils.create('div', {id: 'defender-div'});
        utils.addHeader(loc, 'Defenders', 'Defenders');
        buildOpCards(def, loc);
        content.append(loc);

        // navigation arrows
        utils.buildNavigationArrows(content, getNavArrowList());
    }

    // builds each of the op cards on the page in a Bootstrap row
    function buildOpCards(arr, loc) {
        // populate the row
        let row = utils.create('div', {classList: 'row'});

        for (let i = 0; i < arr.length; i++) {
            const op = arr[i];
            let card_col = utils.create('div', {
                classList: 'col-sm-6 col-md-3 col-lg-3 col-xl-2'
            })

            // button to trigger the modal
            let card_btn = utils.create('button', {
                type: 'button',
                id: op.name,
                classList: 'card-button btn',
            })
            card_btn.dataset.bsToggle = 'modal';
            card_btn.dataset.bsTarget = '#op-modal';
            card_btn.addEventListener('mouseover', (e) => {
                let mod = e.currentTarget.querySelector('.op-footer');
                mod.classList.add('op-highlighted');
            })

            card_btn.addEventListener('mouseout', (e) => {
                let mod = e.currentTarget.querySelector('.op-footer');
                mod.classList.remove('op-highlighted');
            })

            card_btn.addEventListener('click', (e) => {
                let modal_body = utils.select('#modal-body');
                modal_body.innerHTML = '';
                utils.buildOpCard(modal_body, op);
            })

            // div which is the actual bootstrap card
            let card_div = utils.create('div', {
                classList: 'card op-card no-border',
                id: op.name
            })

            card_div.append(utils.create('img', {
                classList: 'card-img-top center op-img',
                src: utils.fetchOpImage(op.name),
                alt: op.name
            }))

            // card body containing the operator name
            let card_body = utils.create('div', { classList: 'card-footer op-footer no-radius'});
            card_body.append(utils.create('h6', {
                classList: 'op-title siege-uppercase',
                textContent: op.name,
            }))

            // append everything
            card_div.append(card_body);
            card_btn.append(card_div);
            card_col.append(card_btn);
            row.append(card_col);
        }
        loc.append(row);
    }

    // builds the op modal at ({Element} loc)
    function buildModal(loc) {
        let modal = utils.create('div', {
            classList: 'modal fade',
            id: 'op-modal',
            ariaHidden: true,
            tabindex: -1
        })

        let modal_dialog = utils.create('div', {
            classList: 'modal-dialog modal-dialog-centered modal-dialog-scrollable'
        })

        let modal_content = utils.create('div', {classList: 'modal-content'});
        let modal_header = utils.create('div', {classList: 'modal-header'})
        let modal_close = utils.create('div', {
            classList: 'btn-close btn-close-white',
            ariaLabel: 'Close'
        });
        modal_close.dataset.bsDismiss = 'modal';

        // append it all together
        modal_header.append(modal_close);
        modal_content.append(modal_header);
        modal_content.append(utils.create('div', {
            classList: 'modal-body',
            id: 'modal-body'
        }))
        modal_dialog.append(modal_content);
        modal.append(modal_dialog);
        loc.append(modal);
    }

    // gets the list used when building navigation arrows
    function getNavArrowList() {
        return [{
            title: 'Attackers',
            src: 'resources/atk.svg',
        }, {
            title: 'Defenders',
            src: 'resources/def.svg',
        }, {
            title: "Top",
            src: 'resources/up.svg',
        }];
    }

})
