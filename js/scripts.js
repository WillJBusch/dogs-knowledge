(function() {


    var pokemonRepository = (function() {
        var repository = [ ];
        var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

        // add additional pokemon to object array repository
        function add(pokemon) {
            repository.push(pokemon);
        }
        //returning pokedex object array
        function getAll() {
            return repository;
        }

        function loadList() {
            return $.ajax(apiUrl, {dataType: 'json'})
                .then(function(item) {
                    //using Ajax instead of fetch
                    $.each(item.results, (function(item) {
                        var pokemon = {
                            name: item.name,
                            detailsUrl: item.url
                        };
                        add(pokemon);
                    }));
                })
                .catch(function(e) {
                    console.error(e);
                });
        }

        function loadDetails(item) {
            var url = item.detailsUrl;
            return $.ajax(url)
                .then(function(details) {
                    item.imageUrl = details.sprites.front_default;
                    item.height = details.height;
                    item.types = Object.values(details.types);
                })
                .catch(function(e) {
                    console.error(e);
                });
        }

        // returning functions inside pokemonRepository to reference outside of IIFE

        return {
            add: add,
            getAll: getAll,
            loadList: loadList,
            loadDetails: loadDetails
        };
        
    })();
    
    pokemonRepository.loadList().then(function() {
        
        pokemonRepository.getAll().forEach(function(pokemon) {
            addListItem(pokemon);
        });
    });

    function addListItem(pokemon) {
        var pokeList = $('.pokemon-list');
        var button = $('<button class = buttonToStyle></button');
        var listItem = $('<li class="pokemon-list"></li>');
        $(pokeList).append(listItem);
        $(button).text(pokemon.name);
        $(listItem).append(button);

        button.on('click', () => {
            showDetails(pokemon);
        });

    }

    function showDetails(item) {
        // creating variables and HTML-elements
        var $modalContainer = $('#modal-container');
        var modal = $('<div class="modal"</div>');
        var img = $('<img class="pokemon-img"</img>');
        var name = $('<h1 class="pokemon-name"></h1>');
        var height = $('<p class="pokemon-height"></p>');
        var types = $('<p class="pokemon-types"></p>');
        var closeButtonElement = $('<button class="modal-close"</button>');
        var exists = $('.modal');
        var pokemonDiv = $('<div class="pokemon-img-block"</div>');

        //appending img to pokeomDiv for styling in css
        $(pokemonDiv).append(img);

        //close button
        $(closeButtonElement).text('Close');
        closeButtonElement.on('click', hideModal);

        // loading pokemondetails into variable
        pokemonRepository.loadDetails(item).then(function () {
            img.setAttribute('src'. item.imageUrl);
            $(name).text(item.name);
            $(height).text('Height - ' + item.height);

            span = types.innerHTML= item.types.map(item => {  // not sure how to do it in jquery
                return item.type.name;
            })
        });

        // avoid creating another modal everytime another button is clicked
        if(exists) $modalContainer.removeChild(exists);

        //appending elements
        $(modal).append(name);
        $(modal).append(pokemonDiv);
        $(modal).append(height);
        $(modal).append(types);
        $(modal).append(closeButtonElement);

        $($modalContainer).append(modal);

        //adding is visible class to make modal visible
        $($modalContainer).addClass('is-visible');

    }
    //defining $modalContainer as modal-container again
    var $modalContainer = $('#modal-container');

    //close modal esc
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });

    // close modal by clicking outside of it    
    $modalContainer.addEventListener('click', (e) => {
        var target = e.target;
        if (target === $modalContainer) {
            hideModal();
        }
    });

    // declaring hidemodal function to remove modal
    function hideModal() {
        $('#modal-container').removeClass('is-visible');
    }

    // referencing HTML ul-tag pokemon-list
    var $pokemonList = $('.pokemon-list');

    // declaring function to print pokemon
    pokemonRepository.catchAll().each(function(podekomDetails) {
        addListItem(pokemonDetails);
    });


});
