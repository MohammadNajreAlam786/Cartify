import Order from '../models/orderModel.js';
import PDFDocument from 'pdfkit';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const order = new Order({
        orderItems: orderItems.map((x) => ({
          ...x,
          product: x._id,
          _id: undefined,
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate PDF invoice
// @route   GET /api/orders/:id/invoice
// @access  Private
const generateInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check if user is admin or the order belongs to the user
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error('Not authorized to view this invoice');
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${order._id}.pdf"`);

    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .text('Cartify Invoice', { align: 'center' })
      .moveDown();
      
    // Order Info
    doc
      .fontSize(10)
      .text(`Order ID: ${order._id}`)
      .text(`Date: ${order.createdAt.toString().substring(0, 10)}`)
      .text(`Status: ${order.isPaid ? 'Paid' : 'Unpaid'}`)
      .moveDown();

    // Customer Info
    doc
      .fontSize(12)
      .text('Billed To:', { underline: true })
      .fontSize(10)
      .text(order.user.name)
      .text(order.user.email)
      .text(`${order.shippingAddress.address}, ${order.shippingAddress.city}`)
      .text(`${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`)
      .moveDown();

    // Items Header
    const tableTop = 250;
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Item', 50, tableTop)
      .text('Qty', 300, tableTop, { width: 50, align: 'right' })
      .text('Price', 400, tableTop, { width: 50, align: 'right' })
      .text('Total', 500, tableTop, { width: 50, align: 'right' });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Items
    let position = tableTop + 30;
    doc.font('Helvetica');
    order.orderItems.forEach((item) => {
      doc
        .text(item.name.substring(0, 40) + (item.name.length > 40 ? '...' : ''), 50, position)
        .text(item.qty.toString(), 300, position, { width: 50, align: 'right' })
        .text(`$${item.price}`, 400, position, { width: 50, align: 'right' })
        .text(`$${(item.qty * item.price).toFixed(2)}`, 500, position, { width: 50, align: 'right' });
      position += 20;
    });

    doc.moveTo(50, position).lineTo(550, position).stroke();

    // Totals
    doc
      .font('Helvetica-Bold')
      .text('Subtotal:', 400, position + 10, { width: 50, align: 'right' })
      .text(`$${order.itemsPrice}`, 500, position + 10, { width: 50, align: 'right' })
      
      .text('Tax:', 400, position + 30, { width: 50, align: 'right' })
      .text(`$${order.taxPrice}`, 500, position + 30, { width: 50, align: 'right' })

      .text('Shipping:', 400, position + 50, { width: 50, align: 'right' })
      .text(`$${order.shippingPrice}`, 500, position + 50, { width: 50, align: 'right' })
      
      .fontSize(12)
      .text('Total:', 400, position + 70, { width: 50, align: 'right' })
      .text(`$${order.totalPrice}`, 500, position + 70, { width: 50, align: 'right' });

    doc.end();

  } catch (error) {
    next(error);
  }
};

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  generateInvoice,
};
