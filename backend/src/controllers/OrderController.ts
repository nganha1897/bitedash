import Order from "../models/Order";

export class OrderController {
  static async placeOrder(req, res, next) {
    const data = req.body;
    const user_id = req.user.aud;
    const restaurant = req.restaurant;
    try {
      let orderData: any = {
        user_id,
        restaurant_id: data.restaurant_id,
        order: data.order,
        address: data.address,
        status: data.status,
        payment_status: data.payment_status,
        payment_mode: data.payment_mode,
        total: data.total,
        grandTotal: data.grandTotal,
        deliveryCharge: data.deliveryCharge,
      };
      if (data.instruction)
        orderData = { ...orderData, instruction: data.instruction };
      if (data.payment_id)
        orderData = { ...orderData, payment_id: data.payment_id };
      const order = await new Order(orderData).save();
      let response_order: any = {
        restaurant_id: restaurant,
        address: order.address,
        order: JSON.parse(order.order),
        instruction: order.instruction || null,
        grandTotal: order.grandTotal,
        total: order.total,
        deliveryCharge: order.deliveryCharge,
        status: order.status,
        payment_status: order.payment_status,
        payment_mode: order.payment_mode,
        created_at: order.created_at,
        updated_at: order.updated_at,
      };
      if (order.payment_id)
        response_order = { ...response_order, payment_id: order.payment_id };
      res.send(response_order);
    } catch (e) {
      next(e);
    }
  }

  static async getUserOrders(req, res, next) {
    const user_id = req.user.aud;
    const perPage = 5;
    const currentPage = parseInt(req.query.page) || 1;
    const prevPage = currentPage == 1 ? null : currentPage - 1;
    let nextPage = currentPage + 1;
    try {
      const orders_doc_count = await Order.countDocuments({ user_id: user_id });
      if (!orders_doc_count) {
        res.json({
          orders: [],
          perPage,
          currentPage,
          prevPage,
          nextPage: null,
          totalPages: 0,
        });
      }
      const totalPages = Math.ceil(orders_doc_count / perPage);
      if (totalPages == 0 || totalPages == currentPage) {
        nextPage = null;
      }
      if (totalPages < currentPage) {
        throw "No more Orders available";
      }
      const orders = await Order.find({ user_id }, { user_id: 0, __v: 0 })
        .skip(perPage * currentPage - perPage)
        .limit(perPage)
        .sort({ created_at: -1 })
        .populate("restaurant_id")
        .exec();
      res.json({
        orders,
        perPage,
        currentPage,
        prevPage,
        nextPage,
        totalPages,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getUserRecentOrders(req, res, next) {
    const user_id = req.user.aud;
    const limit = req.query.limit;
    try {
      const orders = await Order.find({ user_id }, { user_id: 0, __v: 0 })
        .limit(limit)
        .sort({ created_at: -1 })
        .populate("restaurant_id")
        .exec();
      res.json({
        orders,
      });
    } catch (e) {
      next(e);
    }
  }
}
