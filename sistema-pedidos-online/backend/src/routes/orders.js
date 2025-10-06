import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import pool from '../config/database.js';
import { z } from 'zod';

const router = express.Router();

const orderSchema = z.object({
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  estimated_budget: z.number().min(0, 'Orçamento não pode ser negativo')
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { description, category, estimated_budget } = orderSchema.parse({
      ...req.body,
      estimated_budget: parseFloat(req.body.estimated_budget)
    });
    
    const result = await pool.query(
      `INSERT INTO orders (user_id, description, category, estimated_budget, status) 
       VALUES ($1, $2, $3, $4, 'Em análise') 
       RETURNING *`,
      [req.user.userId, description, category, estimated_budget]
    );
    
    res.status(201).json({
      message: 'Pedido criado com sucesso',
      order: result.rows[0]
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Dados inválidos', 
        errors: error.errors 
      });
    }
    
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.name as user_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.user_id = $1 
       ORDER BY o.created_at DESC`,
      [req.user.userId]
    );
    
    res.json({ orders: result.rows });
    
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
    `;
    let countQuery = `SELECT COUNT(*) FROM orders o JOIN users u ON o.user_id = u.id`;
    const queryParams = [];
    
    if (status) {
      query += ` WHERE o.status = $1`;
      countQuery += ` WHERE o.status = $1`;
      queryParams.push(status);
    }
    
    query += ` ORDER BY o.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, (page - 1) * limit);
    
    const [ordersResult, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(countQuery, status ? [status] : [])
    ]);
    
    res.json({
      orders: ordersResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
    
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['Em análise', 'Aprovado', 'Rejeitado', 'Em andamento', 'Concluído'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }
    
    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    res.json({
      message: 'Status atualizado com sucesso',
      order: result.rows[0]
    });
    
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;