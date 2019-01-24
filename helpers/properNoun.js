module.exports = (field) => {
    return field.split('').map((e, i, arr) => {
        if (i === 0 || arr[i - 1] === ' ' || arr[i - 1] === '-') {
            return e.toUpperCase();
        } return e.toLowerCase();
    }).join('');
};
