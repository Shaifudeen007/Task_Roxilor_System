// validation helpers
const nameValid = (name) => typeof name === 'string' && name.trim().length >= 20 && name.trim().length <= 60;
const addressValid = (address) => typeof address === 'string' && address.length <= 400;
const emailValid = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};
const passwordValid = (password) => {
  if (typeof password !== 'string') return false;
  // 8-16 characters, at least 1 uppercase, at least 1 special char
  const re = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
  return re.test(password);
};

module.exports = { nameValid, addressValid, emailValid, passwordValid };
