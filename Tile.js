class Tile {

    constructor(type) {

        switch(type) {
            case "Plant":
                var tile = new Plant;
                break;
            case "Root":
                var tile = new Root;
                break;
            default:
                var tile = new Soil;
        }

        return tile;
    }

}

class Marked_soil {

    constructor() {

    }

}