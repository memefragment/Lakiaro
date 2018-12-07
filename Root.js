class Root {

    constructor(y, x, root, offset) {
        if (root) {
            this.initialPoint = [y, x];
            this.direction = null;
            this.head = true;
            this.segments = [];

            switch(y) {
                case (offset - 1):
                    this.direction = [-1, 0];
                    break;
                case (offset + 4):
                    this.direction = [1, 0];
                    break;
            }

            switch(x) {
                case (offset - 1):
                    this.direction = [0, -1];
                    break;
                case (offset + 4):
                    this.direction = [0, 1];
                    break;
            }

            this.segments.push([y, x]);
            this.setType(0, this.direction);
        }
    }

    setType (from, to, length, end = false) {
        var from = from.toString();
        var to = to.toString();
        var type = from + to;
        var type = type.replace(/\,/g, '').replace(/\-/g, 'm');

        if (length === 5) {
            type += ' thinning';
        }

        if (length > 5 && length < 9) {
            type += ' thin';
        }

        if (length === 9) {
            type += ' end';
        }

        if (end) {
            type += ' end';
        }

        if (to === 0) {
            type += ' end';
        }

        this.image_type = type;
    }
}