function isUsername(name) {
    return /^[a-zA-Z0-9_\.-]+$/.test(name);
}

function isRate(rate) {
    return Number.isInteger(rate) && rate >= 1 && rate <= 5;
}

function isId(id) {
    return true;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function isName(name) {
    return /^[A-Za-z ]*$/.test(name);
}

function isDescription(description) {
    return /^[A-Za-z0-9,.-_'"\?\! ]*$/.test(description);
}

function isUrl(url) {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
    );
    return pattern.test(url) || url === "";
}

function isDate(date) {
    return /^[0-9]{1,2}\.[0-9]{2}.[0-9]{4}$/.test(date);
}

function isPositive(value) {
    return Number.isFinite(value) && value >= 0;
}

function isPositiveInt(value) {
    return Number.isInteger(value) && value >= 0;
}

export function validateFullTrip(trip) {
    if (isId(trip.id) &&
        isName(trip.name) &&
        isName(trip.country) &&
        isDate(trip.start) &&
        isDate(trip.end) &&
        isPositive(trip.cost) &&
        isPositive(trip.rating) &&
        isPositiveInt(trip.capacity) &&
        isPositiveInt(trip.available) &&
        isDescription(trip.description) &&
        isUrl(trip.img)) {
        return true;
    }
    throw new Error("Invalid trip data");
}

export function validateTripElements(trip) {
    if (!trip.id &&
        (!trip.name || isName(trip.name)) &&
        (!trip.country || isName(trip.country)) &&
        (!trip.start || isDate(trip.start)) &&
        (!trip.end || isDate(trip.end)) &&
        (!trip.cost || isPositive(trip.cost)) &&
        (!trip.capacity || isPositiveInt(trip.capacity)) &&
        (!trip.available || isPositiveInt(trip.available)) &&
        (!trip.description || isDescription(trip.description)) &&
        (!trip.img || isUrl(trip.img))) {
        return true;
    }
    throw new Error("Invalid trip data!");
}

export function validateId(id) {
    if (isId(id)) return true;
    throw new Error("Invalid id");
}

export function validateUsername(id) {
    if (isUsername(username)) return true;
    throw new Error("Invalid username");
}

export function validateFullReview(review) {
    if (isId(review.id) && isRate(review.rate) && isUsername(review.username)) return true;
    throw new Error("Invalid review data");
}

export function validateCartElement(value) {
    if (isId(value.id) && isUsername(value.username)) return true;
    throw new Error("Invalid cart data");
}

