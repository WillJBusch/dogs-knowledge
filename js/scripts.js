(function() {


    var pokemonRepository = (function() {
        var repository = [];
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
                    $.each(item.results, (function(index, item) {
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
        
        pokemonRepository.getAll().forEach(function(pokemon) {console.log(pokemon)
            addListItem(pokemon);
        });
    });

    function addListItem(pokemon) {
        var button = $('<button type="button" id="pokemon-button" class="btn btn-outline-dark" data-toggle="modal" data-target="#modal-container"></button>');
        var listItem = $('<li></li>');
        $($pokemonList).append(listItem);
        $(button).text(pokemon.name);
        $(listItem).append(button);

        button.on('click', () => {
            showDetails(pokemon);
        });

    }

    function showDetails(item) {
        // referencing HTML elements and modal classes
        var modal = $('.modal-body');
        var name = $('.modal-title');
        
        // creating variables and HTML-elements        
        var img =  $('<img class="pokemon-img">');       
        var height = $('<p class="pokemon-height"></p>');
        var types = $('<p class="pokemon-types"></p>');        
        var pokemonDiv = $('<div class="pokemon-img-block"></div>');

        //appending img to pokeomDiv for styling in css
        $(pokemonDiv).append(img);

        // loading pokemondetails into variable
        pokemonRepository.loadDetails(item).then(function () {
            img.attr('src', item.imageUrl);
            $(name).text(item.name);
            $(height).text('Height - ' + item.height);

            types.text('Type - ' + item.types.map(item => item.type.name));
        });

        // avoid creating another modal everytime another button is clicked
        if(modal.children().length) {
            modal.children().remove();
        }


        //appending elements
        $(modal).append(height)
                .append(types)
                .append(pokemonDiv)

    }
    // referencing HTML ul-tag pokemon-list
    var $pokemonList = $('.pokemon-list');

})();
