const models = require('../models');

const Account = models.Account;

// Renders login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// Destroys session and redirects to login page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Login request to the database. Authenicates user and returns error if credentials are wrong
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/default' });
  });
};

// Signup request to the database. Creates a user with a password,
// sends error if username is taken
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/default' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

// ChangePassword request to API. Returns error if the user credentials are wrong
const changePass = (request, response) => {
  const req = request;
  const res = response;

  const user = req.body.username;
  const oldPassword = req.body.oldPass;
  const newPassword = req.body.newPass;

  return Account.AccountModel.changePassword(user, oldPassword, newPassword, (err, doc) => {
    if (err || !doc) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    return res.json({ redirect: '/login' });
  });
};

// Get Csrf token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.changePassword = changePass;
module.exports.signup = signup;
module.exports.getToken = getToken;
