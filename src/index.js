const path = require('path');
const express = require('express');
const userRouter = require('./routers/user');
const localizationRouter = require('./routers/localization');
const escRouter = require('./routers/esc');
const loanRouter = require('./routers/loan');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(localizationRouter);
app.use(escRouter);
app.use(loanRouter);

app.get('/', async (req, res) => {
  //res.send('oi')
  res.sendFile(path.join(__dirname, './public/index.html'));
});

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      document.write(`Hello ${user.displayName}`);
      console.log(user);
    })
    .catch(console.log);
}

app.listen(3000, () => {
  console.log('Listening on port ' + port);
});
