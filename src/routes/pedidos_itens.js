const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

var pedidosItensDB = loadPedidosItens();

function loadPedidosItens() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/pedidos_itens.json', 'utf8'));
  } catch (error) {
    console.error('Erro ao carregar pedidos itens:', error);
    return [];
  }
}

function savePedidosItens() {
  fs.writeFileSync('./src/db/pedidos_itens.json', JSON.stringify(pedidosItensDB, null, 2));
}

//get
router.get('/', (req, res) => {
  pedidosItensDB = loadPedidosItens();
  return res.json(pedidosItensDB);
});

//get by id
router.get('/:id', (req, res) => {
  pedidosItensDB = loadPedidosItens();
  const pedidoItem = pedidosItensDB.find((p) => p.id === req.params.id);
  if (!pedidoItem) {
    return res.status(404).json({ message: 'Pedido item não encontrado' });
  }
  return res.json(pedidoItem);
});

//post
router.post('/', (req, res) => {
  pedidosItensDB = loadPedidosItens();
  const { pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total } = req.body;
  const pedidoItem = { id: uuidv4(), pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total };
  pedidosItensDB.push(pedidoItem);
  savePedidosItens();
  return res.status(201).json(pedidoItem);
});

//put
router.put('/:id', (req, res) => {
  pedidosItensDB = loadPedidosItens();
  const { pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total } = req.body;
  const index = pedidosItensDB.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Pedido item não encontrado' });
  }
  pedidosItensDB[index] = { ...pedidosItensDB[index], pedido_id, tipo_roupa_id, quantidade, descricao, status, valor_total };
  savePedidosItens();
  return res.json(pedidosItensDB[index]);
});

//delete
router.delete('/:id', (req, res) => {
  pedidosItensDB = loadPedidosItens();
  const index = pedidosItensDB.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Pedido item não encontrado' });
  }
  pedidosItensDB.splice(index, 1);
  savePedidosItens();
  return res.json({ message: 'Pedido item removido com sucesso' });
});

module.exports = router;
