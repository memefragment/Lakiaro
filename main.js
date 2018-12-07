$(function() {

    window.rocks = [];
    window.roots = [];
    window.max_tries = 10000;

    window.render = function (field_with_roots) {
        if (!field_with_roots) {
            console.log("Can not generate.");
            return;
        }

        var cont = window.field.container;
        $(cont).html('');

        for (var y = 0; y < window.field.size; y++) {
            for (var x = 0; x < window.field.size; x++) {
                var cur_tile = field_with_roots[y][x];
                $(cont).append('<div class="tile ' + cur_tile.constructor.name + ' t' + cur_tile.image_type + '" data-y=' + y + ' data-x=' + x + '></div>');
            }
        }
    };

    window.prepare = function (custom_data = []) {
        window.i = 0;
        var field_with_roots = false;
        while (field_with_roots === false) {
            window.base_field = window.field.prepare_field();

            for (var i = 0; i < custom_data.length; i++) {
                window.base_field[custom_data[i][0]][custom_data[i][1]] = new Marked_soil;
            }

            window.i++;
            field_with_roots = window.field.add_roots(window.base_field, i);
        }

        console.log(window.i);
        if (window.i >= window.max_tries) {
            return false;
        } else {
            return field_with_roots;
        }
    };

    window.add_game_overlay = function () {
        $(field.game_overlay).html('');
        for (var y = 0; y < window.field.size; y++) {
            for (var x = 0; x < window.field.size; x++) {
                var rnd = Math.floor((Math.random() * 3) + 1);
                var plant = '';
                if ((y > 3) && (y < 8) && (x > 3) && (x < 8)) {
                    plant += ' plant';
                }
                $(field.game_overlay).append('<div class="tile game grass' + rnd + plant + '" data-y=' + y + ' data-x=' + x + '></div>');
            }
        }
        $("#roots_number span").html(window.field.roots_number);
    }

    window.start_game = function () {
        args = window.getRoots();
        window.field = new Field(args);
        console.log(window.field.roots_number);
        window.game_field = window.prepare(false);
        window.render(window.game_field);
        window.add_game_overlay();
    };

    window.getRoots = function () {
        return $("#roots_number").val();
    };

    var args = [];
    window.start_game();

    $("#refresh").click(function () {
        window.start_game();
    });

    $("#undo").click(function () {
        window.rocks.splice(-1,1);
    });

    $(field.solve_overlay).on('click', '.tile', function () {
        var y = $(this).data("y");
        var x = $(this).data("x");

        window.rocks.push([y, x]);

        var arr = window.rocks;
        var filteredArray = arr.map(JSON.stringify).reverse()
            .filter(function(item, index, arr){ return arr.indexOf(item, index + 1) === -1; })
            .reverse().map(JSON.parse);

        window.rocks = filteredArray;

        window.render(window.prepare(window.rocks));
    });

    $(field.solve_overlay).on('contextmenu', '.tile', function(e) {
        event.preventDefault();

        var y = $(this).data("y");
        var x = $(this).data("x");

        $(this).addClass("Marked_root");

        window.roots.push([y, x]);

        window.render(window.prepare(window.rocks));
    });

    $(field.game_overlay).on('click', '.tile', function () {
        if ($(this).hasClass("revealed"))
            return;

        var y = $(this).data("y");
        var x = $(this).data("x");

        var cur_tile = window.game_field[y][x].constructor.name;
        if (cur_tile == "Root") {
            $(this).css('background', '#ff000052')
            $(this).addClass('damaged')
        } else {
            $(this).addClass('revealed')
        }

        var arounds = [-1, 0, 1];
        var around_tiles = [];

        for (var i = 0; i < arounds.length; i++) {
            for (var k = 0; k < arounds.length; k++) {
                if (
                    typeof window.game_field[y + arounds[i]] !== 'undefined' &&
                    typeof window.game_field[y + arounds[i]][x + arounds[k]] !== 'undefined'
                ) {
                    around_tiles.push([y + arounds[i], x + arounds[k]]);
                }
            }
        }

        around_tiles = around_tiles.sort(() => .5 - Math.random());

        if (around_tiles.length > 8)
            around_tiles = around_tiles.slice(0, 8)

        for (var i = 0; i < around_tiles.length; i++) {
            if (window.game_field[around_tiles[i][0]][around_tiles[i][1]].constructor.name === "Soil") {
                $(field.game_overlay).find('[data-y="' + around_tiles[i][0] + '"][data-x="' + around_tiles[i][1] + '"]').addClass('revealed');
            }
        }

        var plant_status = parseInt(100 - ($(field.game_overlay).find('.damaged').length / field.roots_number) * 100);
        $("#plant_status span").html(plant_status);

        var soil_left = (field.size * field.size) - (16 + field.roots_number + $(field.game_overlay).find('.revealed').length);
        if (soil_left === 0) {
            $(field.game_overlay).find('.game').addClass('revealed');
            $("#victory").show();
        }

    });

    $(field.game_overlay).on('contextmenu', '.tile', function(e) {
        event.preventDefault();

        var y = $(this).data("y");
        var x = $(this).data("x");

        if (window.game_field[y][x].constructor.name === "Soil") {
            $(this).css('opacity', '0.7')
        } else {
            $(this).addClass('revealed')
        }
    });

    for (var y = 0; y < window.field.size; y++) {
        for (var x = 0; x < window.field.size; x++) {
            $(field.solve_overlay).append('<div class="tile" data-y=' + y + ' data-x=' + x + '></div>');
        }
    }


});