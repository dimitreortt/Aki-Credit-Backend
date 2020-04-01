const router = require('express').Router();
const firebase = require('../firebase/firebase');
const db = firebase.database();
const auth = require('../middleware/auth');

// const ESCmodel = new Model('esc')
function Esc(body) {
  try {
    const esc = {
      cpf: body.cpf,
      nomeResponsavel: body.nomeResponsavel,
      cnpj: body.cnpj,
      nomeESC: body.nomeESC,
      email: body.email,
      cep: body.cep,
      telefone: body.telefone,
      cidadesLimites: body.cidadesLimites,
      limiteDeCredito: body.limiteDeCredito,
      linhaDeCredito: body.linhaDeCredito
    };

    return esc;
  } catch (e) {
    throw new Error({ error: e.message });
  }
}

router.post('/esc/create', auth, async (req, res) => {
  try {
    const esc = Esc(req.body);
    const escID = req.user.uid;

    await db.ref('escs/' + escID).set(esc);

    res.send('Esc created.');
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.get('/esc', auth, async (req, res) => {
  try {
    const escID = req.user.uid;

    const escRef = db.ref('escs/');

    escRef.on('value', function(snapshot) {
      res.send(snapshot.val());
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.get('/esc/loanReqs', auth, async (req, res) => {
  try {
    const escID = req.user.uid;

    const escRef = db.ref('escs/' + escID);

    escRef.on('value', function(snapshot) {
      var esc = snapshot.val();

      const loansRef = db.ref('loans/');

      loansRef.once('value', function(snapshot) {
        var loans = snapshot.val();
        var loansKeys = Object.keys(loans);

        var loanReqs = {};

        loansKeys.forEach(key => {
          var loan = loans[key];

          if (loan.status === '1') {
            if (esc.cidadesLimites.includes(loan.geolocation.city)) {
              // Update loan status
              db.ref('loans/' + key + '/status').set('2'); // essa linha é muito insegura --> POSSIVEL BUG
              // Add loan to the list of loans of the esc
              loanReqs[key] = loan;
            }
          }
        });

        res.send(loanReqs);
      });
    });
  } catch (e) {
    res.status(400).send();
  }
});

router.patch('/esc', auth, async (req, res) => {
  try {
    const escID = req.user.uid;
    const updateData = Object.keys(req.body);

    var updates = {};

    updateData.forEach(update => {
      updates[`escs/${escID}/${update}`] = req.body[update];
    });

    await db.ref().update(updates);

    res.send('Successfully updated');
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.delete('/esc', auth, async (req, res) => {
  try {
    const escID = req.user.uid;

    const escRef = db.ref('escs/' + escID);

    escRef.remove();

    res.send('Successfully deleted!');
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
