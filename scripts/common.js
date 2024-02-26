// =================================================================
// = common.js
// =  Description   : utility functions
// =  Author        : jtpeller
// =  Date          : March 29, 2022
// =================================================================
'use strict';

class Utils {
    // these are SVG values that are specific for the building of gun charts
    // these must be extracted to the utils due to transitioning of the charts
    // in, say, transitionGunCard()
    #MARGIN = { top: 10, left: 0, bottom: 10, right: 0 }
    #WIDTH = 250;
    #HEIGHT = 30;
    #INNER_WIDTH = this.#WIDTH - this.#MARGIN.left - this.#MARGIN.right;
    #INNER_HEIGHT = this.#HEIGHT - this.#MARGIN.top - this.#MARGIN.bottom;

    // list of links used for the navbar and homepage
    #ll = [
        {
            href: 'op-roulette.html',
            text: 'Operator Roulette'
        },
        {
            href: 'gun-roulette.html',
            text: 'Gun Roulette'
        },
        {
            href: 'strat-roulette.html',
            text: 'Strat Roulette'
        },
        {
            href: 'ops.html',
            text: 'Operators'
        },
        {
            href: 'guns.html',
            text: 'Guns'
        },
        {
            href: 'more-info.html',
            text: 'More Info'
        }
    ];

    /**
     * addHeader() -- adds a header to loc with text = text
     * @param {Element} loc     where to put the header
     * @param {string} text     header's text
     * @param {string} id       header's optional ID
     */
    addHeader(loc, text, id = '') {
        loc.append(this.create('h3', {
            classList: 'siege-uppercase subheader',
            id: id,
            textContent: text
        }))
    }
    
    /**
     * addHeader() -- adds a page title to loc with text = text
     * @param {Element} loc     where to put the title
     * @param {string} text     title's text
     * @param {string} id       title's optional ID
     */
    addPageTitle(loc, text, id = '') {
        loc.append(this.create('h2', {
            classList: 'siege-uppercase page-title',
            id: id,
            textContent: text,
        }))
    }
        
    /**
     * append() - wrapper for Element.appendChild()
     * @param {Element} appendee    which element to append to
     * @param {string} elem         what type of Element to create
     * @param {object} options      properties to assign to elem
     * @return {Element}
     */
    append(appendee, elem, options={}) {
        return appendee.appendChild(this.create(elem, options));
    }

    /**
     * buildAccordion() - builds a generic accordion (empty)
     * @param {Element} loc         where to place accordion
     * @param {string} id_prefix    prefix of id to uniquely ID accordion
     */
    buildAccordion(loc, id_prefix) {
        let acc = this.create('div', {
            classList: 'accordion accordion-flush',
            id: `${id_prefix}-list`,
        });
        acc.append(this.create('div', {classList: 'accordion-item no-bkgd no-border'}));

        // header / button (which controls opening/closing)
        let acc_header = this.create('h2', {
            classList: 'accordion-header no-border',
        })

        let acc_btn = this.create('button', {
            classList: 'accordion-button siege-uppercase collapsed',
            type: 'button',
            ariaExpanded: false,
            ariaControls: `${id_prefix}-acc`,
            textContent: id_prefix
        })
        acc_btn.dataset.bsToggle = 'collapse';
        acc_btn.dataset.bsTarget = `#${id_prefix}-acc`;

        // body
        let content = this.create('div', {
            classList: 'accordion-collapse collapse',
            id: `${id_prefix}-acc`,
        })
        content.dataset.bsParent = `#${id_prefix}-list`;

        content.append(this.create('div', {
            classList: 'accordion-body',
            id: `${id_prefix}-body`,
        }));

        // append everything
        acc_header.append(acc_btn);
        acc.append(acc_header);
        acc.append(content);
        loc.append(acc);
    }

    /**
     * buildChecklist() - builds checkboxes at Element loc
     * @param {Element} loc     where to place these checkboxes
     * @param {Array} list      list of type number of string; labels for each checkbox
     * @param {Boolean} checked     what value the checkbox should have
     * @param {function} callback   what function to call upon checkbox change
     * @param {string} id_prefix    prefix for unique ID'ing
     */
    buildChecklist(loc, list, checked, callback, id_prefix) {
        let temp = this.create('div', {classList: 'row mb-3'});
        list.sort();

        // check list length and change classes based on it
        let classes = 'col-sm-12 col-md-6 col-lg-12'
        if (list.length == 3) {
            classes = 'col-sm-12 col-md-4 col-lg-12'
        }

        // loop through list
        for (let i = 0; i < list.length; i++) {
            let col = this.append(temp, 'div', {classList: classes});
            let div = this.append(col, 'div', {classList: 'form-check form-switch'});

            this.append(div, 'input', {
                classList: 'form-check-input',
                type: 'checkbox',
                value: '',
                id: `${id_prefix}-${list[i]}`,
                checked: checked,
                onclick: callback
            });

            this.append(div, 'label', {
                classList: 'form-check-label',
                for: `${id_prefix}-${list[i]}`,
                textContent: list[i]
            });
        }
        loc.innerHTML = '';
        loc.append(temp);
    }

    /**
     * buildFilterForm() - creates a filter form, to be used on the roulette pages
     * @param {Element} loc     where to place this form
     * @param {Array} list      list of type number of string; labels for each checkbox
     * @param {function} callback   what function to call upon checkbox change
     * @param {string} name     header string value
     * @param {string} id_prefix    prefix for unique ID'ing
     */
    buildFilterForm(loc, list, callback, name, id_prefix) {
        this.addHeader(loc, name);
        let filter_form = this.append(loc, 'div', {
            classList: 'uppercase',
            id: `${id_prefix}-form`,
        })
        this.buildChecklist(filter_form, list, true, callback, id_prefix);
    }

    /**
     * buildGunCard() - builds a neatly organized gun card for guns & gun-roulette.html
     * @param {Element} loc     where to place this card
     * @param {object} gun      gun object
     * @param {Boolean} pri     whether this is a primary (true) or secondary (false)
     * @param {object} maxes    maxes created by setMaxValues()
     * @param {Boolean} link    whether or not this is a link (true) or not (false)
     */
    buildGunCard(loc, gun, pri, maxes, link=false) {
        // card div
        let card_div = this.append(loc, 'div', {classList: 'card output-card', id: gun.name});

        // overview
        let overview = this.append(card_div, 'div', {classList: 'pb-3'});

        // gun icon
        let gun_card = this.append(overview, 'div', {
            classList: 'card gun-card no-bkgd no-border'
        })
        this.append(gun_card, 'img', {
            classList: 'center card-img-top gun-img-lg',
            id: 'gun-img',
            src: this.fetchGunImage(gun.name),
            alt: gun.name,
            title: gun.name,
            loading: 'lazy'
        });
    
        // gun name
        let header = this.append(overview, 'h3', {
            classList: 'card-title text-center siege-uppercase',
            id: 'gun-name',
            textContent: gun.name
        })
        if (link) {     // decide whether to be a link (or no link)
            header.innerHTML = '';
            this.append(header, 'a', {
                classList: 'link',
                href: `guns.html#${gun.name}`,
                id: 'gun-name',
                innerHTML: gun.name + '&#128279;',
            });
        }
    
        // gun type
        let card_body = this.append(overview, 'div', {classList: 'card-body'})
        this.append(card_body, 'h6', {
            classList: 'text-center siege-bold',
            id: 'gun-type',
            textContent: gun.type
        })
    
        // properties
        let prop = this.append(card_div, 'div', {classList: 'col-12'});
        let idx = ['damage', 'firerate', 'mobility', 'capacity'];
        let title = ['Damage', 'Fire Rate', 'Mobility', 'Capacity'];
        this.#buildGunProps(prop, gun.properties, idx, title, pri, maxes);
    
        // append all ops
        let imgs = this.append(card_div, 'div', {
            classList: 'text-center',
            id: 'op-imgs',
            loading: 'lazy'
        })
        this.#buildOpImgs(imgs, gun.ops);
    }

    /**
     * buildHomeLinks() - builds the navigation links for the homepage
     * @param {Element} loc     where to build the buttons
     */
    buildHomeLinks(loc) {
        // loop thru chunks and build the link buttons
        for (let i = 0; i < this.#ll.length; i++) {
            let col = this.create('div', {classList: 'col-xs-12 col-lg-6 link-list'})
            let abtn = this.create('a', {
                classList: 'btn btn-item gradient siege-uppercase',
                href: this.#ll[i].href,
            })
            abtn.append(this.create('a', {
                classList: 'btn-link',
                href: this.#ll[i].href,
                href: this.#ll[i].href,
                textContent: this.#ll[i].text,
            }))
            col.append(abtn);
            loc.append(col);
        }
    }

    /**
     * buildNavigationArrows() - adds 3 buttons to the bottom left of the page
     * @param {Element} loc     where to add the buttons
     * @param {object[]} list   array of objects with the values needed to build the btns
     */
    buildNavigationArrows(loc, list) {
        let parent = this.append(loc, 'div', {classList: 'nav-arrows'});
        for (let i = 0; i < list.length; i++) {
            const title = list[i].title;
            const src = list[i].src;
            let btn = this.append(parent, 'div', {
                classList: 'gradient border-highlight mt-3',
            });

            let a = this.append(btn, 'a', {
                classList: 'btn square',
                title: `Jump to ${title}`,
                href: title == "Top" ? '#' : `#${title}`
            });

            this.append(a, 'img', {
                classList: 'center img-svg',
                src: src,
                alt: title,
                loading: 'lazy'
            })
        }
        loc.append(parent);
    }

    /**
     * buildOpCard() -- creates the operator card for op roulette & operator pages
     * @param {Element} loc Element to build the card in
     * @param {object} op   operator object
     */
    buildOpCard(loc, op) {
        let card_div = this.create('div', {classList: 'card output-card'});

        // overview:
        let overview = this.append(card_div, 'div', {classList: 'row'});

        // ... operator preview; image, name | general info
        let op_prev = this.append(overview, 'div', {classList: 'col-sm-12 col-md-6 col-lg-6'});

        // ... add image
        let opcard_div = this.append(op_prev, 'div', {
            classList: 'card w-50 center no-bkgd no-border'
        });
        this.append(opcard_div, 'img', {
            classList: 'card-img-top center',
            id: 'op-img',
            src: this.fetchOpImage(op.name),
            alt: `${op.name}.svg`,
            loading: 'lazy',
        });

        // ... add title
        let opcard_title = this.append(op_prev, 'div', {classList: 'card-title'});
        opcard_title.append(this.create('h3', {
            classList: 'card-title text-center siege-uppercase subheader no-border',
            id: 'op-name',
            textContent: op.name
        }));

        // ... add general info
        let gen_info = this.append(overview, 'div', {classList: 'col-sm-12 col-md-6 col-lg-6'});
        this.addHeader(gen_info, "General Info");

        let geninfo_div = this.append(gen_info, 'div', {id: 'gen-info'});
        this.#buildGenInfo(geninfo_div, ["Speed", "Role", "Gender"], op);

        // add a horizontal line
        this.append(card_div, 'hr');

        // ... loadout accordion: primaries, secondaries, gadgets, and special
        this.buildAccordion(card_div, 'Loadout');
        let loadout_body = card_div.querySelector("#Loadout-body");

        // primaries
        let pri = this.append(loadout_body, 'div', {'id': 'pri-div'});
        this.#buildLoadoutList(pri, op.primary, "Primaries");

        // secondaries
        let sec = this.append(loadout_body, 'div', {'id': 'sec-div'});
        this.#buildLoadoutList(sec, op.secondary, "Secondaries");

        // gadgets
        let gad = this.append(loadout_body, 'div', {'id': 'gadget-div'});
        this.#buildGadgetList(gad, op.gadget, "Gadgets");

        // special
        let spe = this.append(loadout_body, 'div', {'id': 'special-div'});
        this.#buildSpecial(spe, op);

        // append card_div
        loc.innerHTML = '';
        loc.append(card_div);
    }

    /** 
     * buildSearchBar() - builds a search bar at loc
     * @param {Element} loc     where to add the search bar
     * @param {function} keydown    callback for onkeydown
     * @param {function} submit     callback for submit btn click
     * @param {string[]} list   list of strings for the datalist
     * @param {string} id_prefix    for unique IDs
     */
    buildSearchBar(loc, keydown, submit, list, id_prefix) {
        let group = this.append(loc, 'div', {classList: 'input-group mb-3'});
        let div = this.append(group, 'div', {classList: 'form-floating'});

        // search bar input
        let input = this.append(div, 'input', {
            type: "text",
            classList: 'form-control',
            id: `${id_prefix}-search-bar`,
            placeholder: "Search",
            onkeydown: keydown
        });
        input.setAttribute('list', `${id_prefix}-list`);

        // add the floating label for the input
        this.append(div, 'label', {
            classList: 'siege-uppercase',
            for: `${id_prefix}-search-bar`,
            textContent: "Search"
        });

        // create the datalist
        let datalist = this.append(div, 'datalist', {id: `${id_prefix}-list`})
        for (let i = 0; i < list.length; i++) {
            this.append(datalist, 'option', {value: list[i]})
        }

        // search button (on the right side)
        let btn = this.append(group, 'button', {
            classList: 'btn btn-primary search-btn',
            type: 'submit',
            onclick: submit
        })
        this.append(btn, 'img', {
            classList: 'search-icon',
            src: 'resources/search.svg',
        })
    }

    /**
     * buildSelect() - builds a selection dropdown element
     * @param {object} args     options for this.create()
     * @param {object[]} options    selection options object Array, requires .value & .text
     */
    buildSelect(args, options) { 
        let select = this.create('select', args);
        for (let i = 0; i < options.length; i++) {
            this.append(select, 'option', {
                value: options[i].value,
                textContent: options[i].text
            });
        }
        return select;
    }

    /**
     * buildToggleButton() - builds a "Toggle All Filters" button for the roulette pages
     * @param {Element} loc     where to build the toggle button
     * @param {function} callback   callback function to update the dataset
     */
    buildToggleButton(loc, callback) {
        let btn_div = this.append(loc, 'div', {id: 'toggle-div'});
        this.append(btn_div, 'button', {
            classList: 'site-btn w-100 siege-uppercase gradient-transparent border-highlight',
            textContent: 'Toggle All Filters',
            onclick: () => {
                let form = this.select('#form')
                form.querySelectorAll('input[type=checkbox]').forEach((elem) => {
                    elem.checked = !elem.checked;
                }); 
                callback();
            }
        });
    }

    /**
     * create() -- wrapper for Object.assign(document.createElement(), options)
     * @param {string} elem     the type of HTML element to make
     * @param {object} options  what properties to assign to it
     * @returns {Element}
     */
    create(elem, options={}) {
        return Object.assign(document.createElement(elem), options)
    }
    
    /**
     * extractCheckedValues() - extract all checked values from the provided Element
     * @param {Element} loc     element to pull checked values from.
     */
    extractCheckedValues(loc) {
        let checked = [];
        loc.querySelectorAll('input[type=checkbox]').forEach((elem) => {
            checked.push(elem.checked);
        })
        return checked;
    }

    /**
     * fetchOpImage() - returns the relative path for the op's name
     * @param {string} op   name of the operator to grab
     */
    fetchOpImage(op) {
        if (op.match(/^[a-zA-Z]+$/)) {      // ensure only A-Z
            return `resources/ops/${op.toLowerCase()}.svg`;
        }
    }
    
    /**
     * fetchGunImage() - returns the relative path for the gun
     * @param {string} gun      name of the gun to fetch
     */
    fetchGunImage(gun) {
        if (gun.includes('.44 Mag')) {
            gun = gun.slice(1); // remove the pesky punctuation
        }
        return `resources/guns/${gun}.webp`;
    }
    
    /**
     * #fetchGadgetImage() - returns the relative path for the gadget.
     * @param {string} gadget   name of the gadget to fetch
     */
    #fetchGadgetImage(gadget) {
        return `resources/gadgets/${gadget.toLowerCase().replaceAll(' ', '_')}.webp`;
    }
    
    /**
     * fetchSpecialImage()  - returns the relative path for the special 
     * provided the operator's name
     * @param {string} op   name of the operator
     */
    #fetchSpecialImage(op) {
        return `resources/special/${op.toLowerCase()}.webp`
    }

    /**
     * filter() - filters dataset data based on provided options
     * @param {object[]} data       dataset to filter
     * @param {Boolean[]} options   true = keep, false = eliminate. aligns with filter_list
     * @param {string} idx          accessor for the object at data[i], e.g.: data[i][idx]
     * @param {string | number} filter_list     list of filters for data[i][idx]
     */
    filter(data, options, idx, filter_list) {
        if (options.includes(false)) {          // there's something to filter out
            for (let i = 0; i < data.length; i++) {
                // loop thru filter_list and remove those which do not match
                for (let j = 0; j < filter_list.length; j++) {
                    if (typeof data[i][idx] == "number") {
                        if (data[i][idx] == filter_list[j]
                            && options[j] == false) 
                        {
                            data.splice(i, 1);  // remove it
                            i--;                // account for removal
                            break;
                        }
                    } else if (typeof data[i][idx] == "string") {
                        if (data[i][idx].toLowerCase() == filter_list[j].toLowerCase()
                            && options[j] == false) 
                        {
                            data.splice(i, 1);  // remove it
                            i--;                // account for removal
                            break;
                        }
                    }
                }
            }
        }
    }
    
    /**
     * filterList() - filters dataset data based on provided options (but data[i][idx] is a list)
     * @param {object[]} data       dataset to filter
     * @param {Boolean[]} options   true = keep, false = eliminate. aligns with filter_list
     * @param {string} idx          accessor for the object at data[i], e.g.: data[i][idx]
     * @param {string | number} filter_list     list of filters for data[i][idx]
     */
    filterList(data, options, idx, filter_list) {
        if (options.includes(false)) {      // there's something to filter out
            for (let i = 0; i < data.length; i++) {
                let opmatches = false;
    
                // if this op's list doesn't have any found in filter list, remove
                let list = data[i][idx]
    
                // loop thru this op's list
                for (let j = 0; j < list.length; j++) {
                    let k = filter_list.indexOf(list[j]);
                    if (k >= 0 && options[k]) {
                        opmatches = true;
                        j = list.length + 1;      // this op matches, move on
                    }
                }
    
                if (opmatches === true) {
                    opmatches = false;      // toggle and do nothing
                } else {        // does not match, remove it.
                    data.splice(i, 1);
                    i--;
                }
            }
        }
    }

    /**
     * generateSets() - creates 3 sets from arrays a & b:
     * @param {object[]} a
     * @param {object[]} b
     * @param {string} idx          accessor for both a & b (e.g. a[idx])
     * @param {Boolean} isArray     whether or not a[idx] or b[idx] is an array
     * 
     * @returns {Set<string>[]}
     * Array[0] : set of both: a[idx] and b[idx]
     * Array[1] : set of idx exclusive to a[idx]
     * Array[2] : set of idx exclusive to b[idx]
     */
    generateSets(a, b, idx, isArray) {
        // loop thru a and build a array
        let a_idx = [];
        for (let i = 0; i < a.length; i++) {
            if (isArray) {
                a_idx.push(...a[i][idx])
            } else {
                a_idx.push(a[i][idx])
            }
        }

        // loop through b and generate b array
        let b_idx = [];
        for (let i = 0; i < b.length; i++) {
            if (isArray) {
                b_idx.push(...b[i][idx])
            } else {
                b_idx.push(b[i][idx])
            }
        }

        // eliminate duplicates by creating a Set
        let a_set = new Set(a_idx);
        let b_set = new Set(b_idx);

        // figure out which are unique to each
        let a_only = this.#setDifference(a_set, b_set);
        let b_only = this.#setDifference(b_set, a_set);
        let both = this.#setIntersection(a_set, b_set);

        // return each of these new sets as arrays
        return [Array.from(both), Array.from(a_only), Array.from(b_only)]
    }

    /**
     * initNavbar() -- initializes the navbar to be used across all pages
     * @param {Element} header  where to put the navbar
     * @param {number} idx      which link to highlight; indicates "which page am I on?"
     */
    initNavbar(header, idx) {
        // <nav> & nav container
        let nav = this.append(header, "nav", {
            classList: 'navbar navbar-dark navbar-expand-lg fixed-top',
        });

        let navdiv = this.append(nav, 'div', {classList: 'container-fluid'});

        // hamburger menu title (hidden when page is large)
        this.append(navdiv, 'a', {
            classList: 'navbar-brand siege-uppercase gradient-transparent border-highlight',
            href: 'index.html',
            textContent: 'R6S Roulette',
        });

        // hamburger menu for mobile:
        let menu = this.append(navdiv, 'button', {
            classList: 'navbar-toggler',
            type: 'button',
            ariaControls: 'offcanvas-content',
            ariaExpanded: 'false',
            ariaLabel: 'Toggle navigation',
        });
        menu.dataset.bsToggle = 'offcanvas'
        menu.dataset.bsTarget = '#offcanvas-content'

        // ... hamburger menu icon
        this.append(menu, 'span', {classList: 'navbar-toggler-icon'});

        // build the offcanvas
        let oc_div = this.append(navdiv, 'div', {
            classList: 'offcanvas offcanvas-end navbar-dark',
            tabindex: -1,
            id: 'offcanvas-content',
            ariaLabelledBy: 'offcanvas-navbar-label'
        });
        oc_div.dataset.bsTheme = "dark";

        // add the offcanvas header & close btn
        let oc_header = this.append(oc_div, 'div', {
            classList: 'offcanvas-header',
        });
        this.append(oc_header, 'a', {
            classList: 'offcanvas-title navbar-brand siege-uppercase gradient-transparent border-highlight',
            href: 'index.html',
            id: 'offcanvas-navbar-label',
            textContent: "R6S Roulette"
        });

        let close_btn = this.append(oc_header, 'button', {
            type: 'button',
            classList: 'btn-close btn-close-white',
            ariaLabel: "Close"
        });
        close_btn.dataset.bsDismiss = 'offcanvas';

        // create the offcanvas body
        let oc_body = this.append(oc_div, 'div', {classList: 'offcanvas-body'});

        // list of links
        let ul = this.append(oc_body, 'ul', {
            classList: 'navbar-nav justify-content-start flex-grow-1 pe-3',
        });

        // all links from ll
        for (let i = 0; i < this.#ll.length; i++) {
            this.append(ul, 'li', {classList: 'nav-item siege-bold gradient-transparent'})
                .append(this.create('a', {
                    classList: idx == i ? 'nav-link active border-highlighted' : 'nav-link active border-highlight',
                    ariaCurrent: 'page',
                    href: this.#ll[i].href,
                    textContent: this.#ll[i].text,
                }));
        }

        header.append(nav);     // append to header
    }

    /**
     * saveData() - saves the parameters locally for access
     * @param {object[]} atk        array of objects (attacker ops)
     * @param {object[]} def        array of objects (defender ops)
     * @param {object[]} gadgets    array of objects (gadgets & their counts)
     */
    saveData(atk, def, gadgets) { 
        this.atk = atk;
        this.def = def;
        this.gadgets = gadgets;
    }

    /**
     * select() is a wrapper for querySelector (makes it look more JQuery-ish)
     * @param {string} val      what to select (e.g., an id: "#element-id" or a class ".element-class")
     * @param {Element} origin  source Element to select from (default: document)
     * @returns {Element}
     */
    select(val, origin=document) {
        return origin.querySelector(val);
    }

    /**
     * setEnabled() - sets given element identified by id depending on enabled
     * @param {string} id       id of the element (NOTE: INCLUDE THE #)
     * @param {Boolean} enabled whether to enable (true) or disable (false)
     */
    setEnabled(id, enabled) {
        let elem = this.select(id);
        if (enabled) {
            elem.classList.add('gradient-transparent', 'border-highlight');
            elem.classList.remove('disabled', 'site-btn-disabled')
        } else {
            elem.classList.add('disabled', 'site-btn-disabled')
            elem.classList.remove('gradient-transparent', 'border-highlight');
        }
    }
    
    /**
     * setMaxValues() - computes the max values given pri & sec. These
     * max values are used for building the charts properly
     * @param {Object[]} pri    array of objs
     * @param {Object[]} sec    array of objs
     * 
     * @return {object}     object with pri, sec, fir, cap, and mob max values
    */
    setMaxValues(pri, sec) {
        let temp = [...pri, ...sec];
        return {
            pri: this.#getMax(pri, "damage"),
            sec: this.#getMax(sec, "damage"),
            fir: this.#getMax(temp, "firerate"),
            cap: this.#getMax(temp, "capacity"),
            mob: this.#getMax(temp, "mobility"),
        }
    }

    /**
     * transitionGunCard() -- transitions a gun card from one to another.
     *  Used by gun-roulette after generating a new gun-card.
     * @param {Element} loc  location of the gun card to transition
     * @param {object} gun   new gun obj to transition to.
     * @param {Boolean} pri  primary (true) or secondary (false)
     * @param {object} max   maximum object created by setMaxValues
     */
    transitionGunCard(loc, gun, pri, max) {
        // update img src, alt, and title
        let img = this.select('#gun-img', loc);
        img.setAttribute('src', this.fetchGunImage(gun.name));
        img.setAttribute('alt', gun.name);
        img.setAttribute('title', gun.name);
    
        // update name and make it a link
        let name = this.select('#gun-name', loc);
        name.innerHTML = '';
        this.append(name, 'a', {
            classList: 'link',
            innerHTML: gun.name + '&#128279;',
            href: `guns.html#${gun.name}`,
        })
    
        // update type
        this.select('#gun-type').innerHTML = gun.type;
    
        // update charts
        let idx = ['damage', 'firerate', 'mobility', 'capacity'];
        let get = ['pri', 'fir', 'mob', 'cap'];
        if (!pri) {
            get[0] = 'sec'
        }
    
        // loop through each idx (each gun's attributes from the OBJ)
        for (let i = 0; i < idx.length; i++) {
            let x_scale = d3.scaleLinear()
                .domain([0, max[get[i]]])
                .range([0, this.#INNER_WIDTH]);
    
            let d3loc = d3.select(loc);
            d3loc.select(`#${idx[i]}`)
                .selectAll('#val-bar')
                .transition()
                .duration(750)
                .attr('width', x_scale(gun.properties[idx[i]]))
                
            // update chart vals
            let val = d3loc.select(`#val-${idx[i]}`)
            if (idx[i] == 'firerate' && gun.properties[idx[i]] == -1) {
                val.text('N/A');
            } else {
                val.text(gun.properties[idx[i]])
            }
        }
    
        // update ops
        let imgs = this.select('#op-imgs', loc);
        this.#buildOpImgs(imgs, gun.ops);
    }

    /**
     * transitionOpCard() - transitions the existing op card to a new state
     * @param {object} op       the new state to transition to
     */
    transitionOpCard(op) {
        // update the icon
        this.select('#op-img').setAttribute('src', this.fetchOpImage(op.name));
        this.select('#op-img').setAttribute('alt', op.name + '.svg');
    
        // update op name
        let opname = this.select('#op-name');
        opname.innerHTML = '';
        opname.append(this.create('a', {
            classList: 'link',
            innerHTML: op.name + '&#128279;',
            href: `ops.html#${op.name}`
        }))

        // update general info
        let geninfo = this.select('#gen-info');
        geninfo.innerHTML = '';
        this.#buildGenInfo(geninfo, ["Speed", "Role", "Gender"], op)
    
        // update primaries
        this.#buildLoadoutList(this.select('#pri-div'), op.primary, "Primaries");
    
        // update secondaries
        this.#buildLoadoutList(this.select('#sec-div'), op.secondary, "Secondaries");
    
        // update gadgets
        this.#buildGadgetList(this.select('#gadget-div'), op.gadget, "Gadgets");
    
        // update special
        this.#buildSpecial(this.select('#special-div'), op);
    }

    /**
     * capitalizeFirstLetter() - 
     * @tutorial capitalizeFirstLetter("foo") returns "Foo"
     * @param {string} str - string to capitalize
     * @returns {string}
     */
    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    // ==================================
    // =       PRIVATE FUNCTIONS        =
    // ==================================

    /**
     * #buildChart() - builds the chart for the guns
     * @requires D3JS library
     * @param d3_loc    D3JS location object for where to build the chart
     * @param val       value of the bar chart
     * @param max       maximum value possible for this property
     */
    #buildChart(d3_loc, val, max) {
        // SVG dims. viewbox helps its responsiveness
        const svg = d3.create('svg')
            .attr('viewBox', `0 0 ${this.#WIDTH} ${this.#HEIGHT}`)
            .classed('my-svg', true);
    
        const x_scale = d3.scaleLinear()
            .domain([0, max])
            .range([0, this.#INNER_WIDTH]);
    
        const g = svg.append('g')
            .attr('id', 'g-bar');
    
        g.append('rect')
            .classed('bar-blank', true)
            .attr('height', this.#INNER_HEIGHT)
            .attr('width', this.#INNER_WIDTH);
    
        g.append('rect')
            .classed('bar', true)
            .attr('id', 'val-bar')
            .attr('height', this.#INNER_HEIGHT)
            .transition()
            .delay(100)     // wait for the page to load
            .duration(750)
            .attr('width', x_scale(val));
    
        // append chart
        d3_loc.append(() => svg.node());
    }
        
    /**
     * buildGadgetList() - builds the list of gadgets
     * @param {Element} loc     where to build the gadget list
     * @param {string[]} list   list of gadgets (strings)
     * @param {string} title    header value
     */
    #buildGadgetList(loc, list, title) {
        loc.innerHTML = '';
        // add the header based on the title
        this.addHeader(loc, title);

        let row = this.create('div', {classList: 'row'})
        for (let j = 0; j < list.length; j++) {
            const gadget = list[j];
            let col = this.create('div');
            this.#classifyColumn(col, list.length);

            let card = this.create('div', {classList: 'card gun-card no-radius'})
            card.append(this.create('img', {
                classList: 'center card-img-top gun-img',
                src: this.#fetchGadgetImage(gadget),
                alt: gadget,
                title: gadget,
                loading: 'lazy',
            }));

            // card body
            let body = this.create('div', {classList: 'card-body text-center'})
            body.append(this.create('h6', {
                classList: 'card-title siege-bold',
                textContent: `${gadget} x${this.#getGadgetCount(gadget)}`
            }))

            card.append(body);
            col.append(card);
            row.append(col);
        }
        loc.append(row);
    }
    
    /**
     * buildGenInfo() - builds the general info for the op (used only by this.buildOpCard)
     * @param {Element} loc     where to build this information
     * @param {string} list     list of properties of the object op
     * @param {object} op       object with properties in list
     */
    #buildGenInfo(loc, list, op) {
        for (let i = 0; i < list.length; i++) {
            let prop = list[i].toLowerCase();

            let row = this.create('div', {
                classList: i != list.length - 1 ? 'row my-span mx-auto' : 'row my-span no-border mx-auto'
            });

            let div = this.create('div', {classList: 'my-auto col'});
            div.append(this.create('h6', {
                classList: 'siege-uppercase text-end',
                textContent: list[i]
            }))

            // special formatting; role/speed/etc.
            let contents = this.create('div', {classList: 'col h6 uppercase'});
            if (list[i] == "Role") {
                contents.innerHTML = formatAsList(op[prop]);
            } else if (list[i] == "Speed") {
                // add SVG circle elements:
                for (let j = 0; j < 3; j++) {
                    contents.append(this.create('img', {
                        src: 'resources/speed.svg',
                        id: `speed-${j}`,
                        classList: 'speed-icon',
                        loading: 'lazy',
                    }))
                }

                let speedval = op[prop];
                for (let j = 0; j < speedval; j++) {
                    contents.querySelector(`#speed-${j}`)
                        .setAttribute('src', 'resources/speed-fill.svg');
                }
            } else {
                contents.innerHTML = op[prop];
            }

            row.append(div);
            row.append(contents);
            loc.append(row);
        }

        function formatAsList(list) {
            if (list.length <= 1 || typeof list == 'string') {
                return list;
            } else {
                let html = '';
                for (let j = 0; j < list.length; j++) {
                    html += list[j] + "<br>";
                }
                return html;
            }
        }
    }

    /**
     * buildGunProps() - builds the gun properties (damage, firerate, mobility, capacity)
     * @param {object} props    properties of the gun (e.g., gun.properties)
     * @param {string[]} idx    list of properties in props (e.g., props[idx[i]])
     * @param {string[]} headers    labels for the charts
     * @param {Element} loc     where to put the gun properties
     * @param {Boolean} pri     primary (true) or secondary (false)
     * @param {object} maxes    maximum values computed by setMaxValues()
     */
    #buildGunProps(loc, props, idx, headers, pri, maxes) {
        // loop through each of the idx
        for (let i = 0; i < idx.length; i++) {
            let row = this.create('div', {classList: 'row'});
            let title = this.append(row, 'div', {classList: 'col-3'});
            this.append(title, 'h6', {classList: 'text-end siege-bold', textContent: headers[i]});

            // setup getters
            let get = ['pri', 'fir', 'mob', 'cap'];
            if (!pri) {
                get[0] = 'sec'
            }

            // build chart
            let chart = this.append(row, 'div', {classList: 'col-7', id: idx[i]})
            this.#buildChart(d3.select(chart), props[idx[i]], maxes[get[i]]);

            // add value in final column
            let valdiv = this.append(row, 'div', {classList: 'col-2'});
            let val = this.append(valdiv, 'h6', {classList: 'siege-bold', id: `val-${idx[i]}`});
            if (idx[i] == 'firerate' && props[idx[i]] == -1) {
                val.innerText = 'N/A';
            } else {
                val.innerText = props[idx[i]];
            }

            // append row to DOM
            loc.append(row);
        }
    }
    
    /**
     * buildLoadoutList() - used to build either primaries or secondaries.
     * used only by this.buildOpCard()
     * @param {Element} loc     where to put this loadout
     * @param {object} list     list of gun objects
     * @param {string} title    title of this loadout (e.g. "Primaries")
     */
    #buildLoadoutList(loc, list, title) {
        loc.innerHTML = '';

        // add the header based on the title
        this.addHeader(loc, title);

        // build the row
        let row = this.create('div', {classList: 'row'})
        for (let j = 0; j < list.length; j++) {
            const gun = list[j];
            let col = this.create('div');
            this.#classifyColumn(col, list.length);

            // gun img that's also a link
            let card = this.create('div', {classList: 'card center gun-card no-radius'});
            let link = this.create('a', {href: `guns.html#${gun.name}`})
            link.append(this.create('img', {
                classList: 'center card-img-top gun-img',
                src: this.fetchGunImage(gun.name),
                alt: gun.name,
                title: `${gun.name} | Click for More Details`,
                loading: 'lazy',
            }))
            card.append(link);

            // card body & title
            let body = this.create('div', {classList: 'card-body text-center'})
            body.append(this.create('h6', {
                classList: 'card-title siege-bold',
                textContent: gun.name,
            }))
            card.append(body);

            col.append(card);
            row.append(col);
        }
        loc.append(row);
    }

    /**
     * #buildOpImgs() - adds all images of the operators who use a gun,
     * used for building / transitioning gun cards
     * @param {Element} loc     where to add these images
     * @param {string[]} ops    list of ops to add
     */
    #buildOpImgs(loc, ops) {
        let temp = this.create('div');
        for (let i = 0; i < ops.length; i++) {
            let op = ops[i];
            let imgdiv = this.append(temp, 'div', {classList: 'd-inline-block'});
            let imglink = this.append(imgdiv, 'a', {href: `ops.html#${op}`});
            this.append(imglink, 'img', {
                style: 'width: 4rem;',
                src: this.fetchOpImage(op),
                alt: op,
                title: op,
                loading: 'lazy'
            });
        }
        loc.innerHTML = '';
        loc.append(temp);
    }

    /**
     * buildSpecial() - builds the special gadget given the operator & where to build it.
     * @param {Element} loc where to build this special gadget
     * @param {object} op   operator object
     */
    #buildSpecial(loc, op) {
        let special = this.create('div');
        let title = this.create('h3', {classList: 'siege-uppercase subheader'});

        // handle recruit vs specialty ops
        if (typeof op.special !== "string") {
            title.textContent = 'Secondary Gadget';
            special.append(title);
            this.#buildGadgetList(special, op.special);
        } else {
            title.textContent = 'Special';

            // card div
            let card = this.create('div', {classList: 'card gun-card no-radius'});
            card.append(this.create('img', {
                classList: 'center card-img-top gun-img',
                src: this.#fetchSpecialImage(op.name),
                alt: op.special,
                title: op.special,
                loading: 'lazy',
            }))

            // card body
            let body = this.create('div', {classList: 'card-body text-center'});
            body.append(this.create('h6', {
                classList: 'card-title siege-bold',
                textContent: op.special
            }));
            card.append(body);
            special.append(title);
            special.append(card);
        }
        loc.innerHTML = '';     // clear it first
        loc.append(special);
    }

    // classify column based on len for loadouts & gadgets
    #classifyColumn(col, len) {
        if (len == 3) {
            col.classList.add('col-sm-12', 'col-lg-6');
        } else if (len == 2) {
            col.classList.add('col-sm-12', 'col-md-6');
        } else {
            col.classList.add('col-12');
        }
    }

    // quick helper function to grab the count of gadgets
    #getGadgetCount(g) {
        return this.gadgets[g.toLowerCase().replaceAll(' ', '_')];
    }

    // retrieves the maximum value from the {object[]} list
    #getMax(list, name) {
        let max = 0;
        for (let i = 0; i < list.length; i++) {
            let prop = list[i].properties;
            let val = prop[name];
    
            if (val > max) {
                max = val;
            }
        }
        return max;
    }

    // returns the set difference (what's in A & not in B)
    #setDifference(a, b) {
        return new Set(Array.from(a).filter(item => !b.has(item)));
    }

    // returns the set intersection (what's in both A & B)
    #setIntersection(a, b) {
        return new Set(Array.from(a).filter(item => b.has(item)));
    }
}
