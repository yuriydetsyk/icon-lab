module.exports = {
  handleError: (e) => {
    console.error(e);
    return Promise.reject(e);
  },
};
