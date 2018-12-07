class Field {

    constructor(args) {
        console.log(args);
        this.size = 12;
        this.max_lenght = 9;
        // this.roots_number = 30 + Math.floor((Math.random() * 30) + 1);
        this.roots_number = parseInt(args);
        this.container = "#field";
        this.solve_overlay = "#solve_overlay";
        this.game_overlay = "#game_overlay";
    }


    add_roots (field, try_num) {

        if (window.i >= window.max_tries) {
            return true;
        }

        var of = (this.size - 4) / 2;
        var starting_locations = [
            [of - 1, of], [of - 1, of + 1], [of - 1, of + 2], [of - 1, of + 3],
            [of, of + 4], [of + 1, of + 4], [of + 2, of + 4], [of + 3, of + 4],
            [of + 4, of], [of + 4, of + 1], [of + 4, of + 2], [of + 4, of + 3],
            [of, of - 1], [of + 1, of - 1], [of + 2, of - 1], [of + 3, of - 1]
        ];
        starting_locations  = starting_locations.sort(() => .5 - Math.random());

        var temp_starting_locations = [];
        for (var i = 0; i < starting_locations.length; i++) {
            if (field[starting_locations[i][0]][starting_locations[i][1]].constructor.name === "Soil") {
                temp_starting_locations.push(starting_locations[i]);
            }
        }
        starting_locations = temp_starting_locations;

        this.possible_directions = [[1, 0], [-1, 0], [0, 1], [0, -1]].sort(() => .5 - Math.random());

        this.current_roots = 0;

        var roots_quantity = (this.roots_number - 2) / 7;
        if (roots_quantity > 9)
            roots_quantity = 9;


        var shuffled = starting_locations.sort(() => .5 - Math.random());
        var selected = shuffled.slice(0, roots_quantity);

        for (var i = 0; i < selected.length; i++) {
            if (field[selected[i][0]][selected[i][1]].constructor.name === "Soil") {
                field[selected[i][0]][selected[i][1]] = new Root(selected[i][0], selected[i][1], true, of);
                this.current_roots++;
            }
        }

        for (var k = 0; k < selected.length; k++) {
            for (var n = 0; n < 5; n++) {
                this.expand_root([selected[k]], field);
            }

            if (field[selected[k][0]][selected[k][1]].segments.length < 6) {
                // console.table(field, i);
                return false;
            }
        }

        var expandable = true;
        while ((this.current_roots < this.roots_number) && expandable) {
            expandable = this.expand_root(selected, field);
        }

        if (!expandable)
            return false;

        /** add style to last segments */
        if (this.current_roots === this.roots_number) {
            for (var m = 0; m < selected.length; m++) {
                var root = field[selected[m][0]][selected[m][1]];
                var last_segment = root.segments.slice(-1)[0];
                var a2nd_last_segment = root.segments.slice(-2)[0];
                var direction = [(last_segment[0] - a2nd_last_segment[0]), (last_segment[1] - a2nd_last_segment[1])];
                last_segment = field[last_segment[0]][last_segment[1]];
                last_segment.setType(direction, direction, 0, true);
            }

            console.log("Roots added");

            var root_check = true;
            for (var r = 0; r < window.roots.length; r++) {
                if (field[window.roots[r][0]][window.roots[r][1]].constructor.name !== "Root") {
                    root_check = false;
                }
            }


            if (root_check) {
                return field;
            } else {
                return false;
            }


        } else {
            console.log("Restarting...");
            return false;
        }
    }

    expand_root (selected, field) {
        var rnd = Math.floor(Math.random()*selected.length);
        var random_root = selected[rnd];

        random_root = field[random_root[0]][random_root[1]];

        if (random_root.segments.length === 9 || random_root.segments.direction === false) {
            // selected.splice( rnd, 1 );
            return true;
        }

        var last_segment = random_root.segments.slice(-1)[0];
        var direction = field[last_segment[0]][last_segment[1]].direction;
        if (direction === false)
            return false;

        var next_crd = [(last_segment[0] + direction[0]), (last_segment[1] + direction[1])];

        if (field[next_crd[0]][next_crd[1]].constructor.name === "Soil") {
            var possible_steps = [];

            this.possible_directions = this.possible_directions.sort(() => .5 - Math.random());
            for (var i = 0; i < this.possible_directions.length; i++) {
                var possible_step = [(next_crd[0] + this.possible_directions[i][0]), (next_crd[1] + this.possible_directions[i][1])];

                if (
                    (possible_step[0] >= 0 && possible_step[0] < this.size) &&
                    (possible_step[1] >= 0 && possible_step[1] < this.size)
                ) {
                    if (field[possible_step[0]][possible_step[1]].constructor.name === "Soil") {
                        possible_steps.push([this.possible_directions[i][0], this.possible_directions[i][1]]);
                    }
                }
            }

            if (possible_steps.length) {
                field[next_crd[0]][next_crd[1]] = new Root(next_crd[0], next_crd[1], false, 0);
                random_root.segments.push([next_crd[0], next_crd[1]]);
                var next_step = possible_steps[Math.floor(Math.random()*possible_steps.length)];
                field[next_crd[0]][next_crd[1]].direction = next_step;
                field[next_crd[0]][next_crd[1]].setType(direction, next_step, random_root.segments.length);
            } else {
                field[next_crd[0]][next_crd[1]] = new Root(next_crd[0], next_crd[1], false, 0);
                random_root.segments.push([next_crd[0], next_crd[1]]);
                field[next_crd[0]][next_crd[1]].direction = false;
                field[next_crd[0]][next_crd[1]].setType(direction, 0, random_root.segments.length);
            }
        } else {
            return false;
        }

        this.current_roots++;
        return true;
    }

    prepare_field () {

        let tempField = [];

        for (var y = 0; y < this.size; y++) {
            var xArr = [];
            for (var x = 0; x < this.size; x++) {
                xArr[x] = new Soil();
            }
            tempField[y] = xArr;
        }

        var plant_offset = (this.size - 4) / 2;
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                tempField[y + plant_offset][x + plant_offset] = new Plant;
            }
        }

        return tempField;

    }

    add_rocks (number) {
        var rows = [];

        for (var y = 0; y < this.size; y++) {
            rows = rows.concat(this.field[y]);
        }

        var i = 0;

        while (i < number) {
            var rnd = Math.floor(Math.random()*rows.length);
            var random_tile = rows[rnd];
            console.log(random_tile);

            if (random_tile.constructor.name === "Soil") {
                rows[rnd] = new Rock;
                i++;
            }
        }

        var newField = [];

        for (var j = 0; j < this.size; j++) {
            var rowX = [];
            for (var k = 0; k < this.size; k++) {
                rowX.push(rows[(j * this.size) + k]);
            }
            newField.push(rowX);
        }

        this.field = newField;
    }

}