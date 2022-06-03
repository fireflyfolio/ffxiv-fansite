function prefixZero (value) {
  return value < 10 ? '0' + value : value;
}

function format (value) {
  const date = new Date(value);

  return date.toLocaleString();
}

function dateOnly (value) {
  const date = new Date(value);

  return prefixZero(date.getDate()) + '/' + prefixZero(date.getMonth() + 1) + '/' + date.getFullYear();
}

export {
  prefixZero,
  format,
  dateOnly,
};

