
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

async function creditWallet(req, res) {
  const { client_id, amount } = req.body;

  if (!client_id || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Valid client_id and positive amount required' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [wallets] = await conn.execute(
      'SELECT id FROM wallets WHERE client_id = ? FOR UPDATE',
      [client_id]
    );

    if (wallets.length === 0) throw new Error('Wallet not found');

    const walletId = wallets[0].id;

    await conn.execute(
      'UPDATE wallets SET balance = balance + ? WHERE id = ?',
      [amount, walletId]
    );

    const entryId = uuidv4();
    await conn.execute(
      'INSERT INTO ledger_entries (id, client_id, wallet_id, type, amount) VALUES (?,?,?,?,?)',
      [entryId, client_id, walletId, 'credit', amount]
    );

    await conn.commit();
    res.json({ message: 'Credit successful', entryId });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
}

async function debitWallet(req, res) {
  const { client_id, amount } = req.body;

  if (!client_id || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Valid client_id and positive amount required' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.execute(
      'SELECT id, balance FROM wallets WHERE client_id = ? FOR UPDATE',
      [client_id]
    );

    if (rows.length === 0) throw new Error('Wallet not found');
    if (rows[0].balance < amount) throw new Error('Insufficient balance');

    await conn.execute(
      'UPDATE wallets SET balance = balance - ? WHERE id = ?',
      [amount, rows[0].id]
    );

    const entryId = uuidv4();
    await conn.execute(
      'INSERT INTO ledger_entries (id, client_id, wallet_id, type, amount) VALUES (?,?,?,?,?)',
      [entryId, client_id, rows[0].id, 'debit', amount]
    );

    await conn.commit();
    res.json({ message: 'Debit successful', entryId });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
}

async function getBalance(req, res) {
  const clientId = req.clientId;

  try {
    const [rows] = await pool.execute(
      'SELECT balance FROM wallets WHERE client_id = ?',
      [clientId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Wallet not found' });
    res.json({ balance: Number(rows[0].balance) });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
}

module.exports = { creditWallet, debitWallet, getBalance };