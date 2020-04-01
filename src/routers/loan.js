const router = require('express').Router();
const firebase = require('../firebase/firebase');
const db = firebase.database();
const auth = require('../middleware/auth');

// Requerimento dos emprestimos
router.get('loans', async (req, res) => {});

// Modelo de um emprestimo
function Loan(body) {
  try {
    const loan = {
      idCliente: body.idCliente,
      status: body.status,
      geolocation: body.geolocation,
      value: body.value,
      description: body.description
    };

    return loan;
  } catch (e) {
    throw new Error(e.message);
  }
}

// Criar solicitação de emprestimo
router.post('/loans', auth, async (req, res) => {
  try {
    const loan = Loan(req.body);

    // Get a key for a new Loan.
    var newLoanKey = firebase
      .database()
      .ref()
      .child('loans')
      .push().key;

    // Write new Loan
    var updates = {};
    updates['/loans/' + newLoanKey] = loan;

    await firebase
      .database()
      .ref()
      .update(updates);

    res.send('Loan successfully created!');
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.delete('/loans', async (req, res) => {
  try {
    const loansRef = db.ref('loans');

    await loansRef.remove();

    res.send('Loans deleted!');
  } catch (e) {
    res.send({ error: e.message });
  }
});

// Aceitação de empréstimo
router.patch('loans/accepted/:key', async (req, res) => {
  try {
    const key = req.params.key;

    // Set status as accepted (3)
    db.ref('loans/' + key + '/status').set('3');

    res.send('Status successfully updated');
  } catch (e) {
    res.send({ error: e.message });
  }
});

module.exports = router;
