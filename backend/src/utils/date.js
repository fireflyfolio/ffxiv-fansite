function format (value) {
  const date = new Date(value);

  return date.toLocaleString();
}

export {
  format,
};

