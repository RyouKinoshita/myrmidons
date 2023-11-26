const Order = require("../models/order");
const Service = require("../models/service");

const nodemailer = require("nodemailer");
const { jsPDF } = require("jspdf");
const { update } = require("../models/order");

exports.newOrder = async (req, res, next) => {
  const generateInvoice = (order) => {
    const pdf = new jsPDF();

    // Set font size
    pdf.setFontSize(12);

    // Add content to the PDF (order details, items, etc.)
    pdf.text("Invoice", 10, 10);

    // User's Name and Contact No
    pdf.text(`User's Name: ${req.user.name}`, 10, 20);
    pdf.text(`Contact No: ${req.body.eventInfo.phoneNo}`, 10, 30);

    // Event Address
    pdf.text(
      `Event Address: ${req.body.eventInfo.address}, ${req.body.eventInfo.city}, ${req.body.eventInfo.country}, ${req.body.eventInfo.postalCode}`,
      10,
      40
    );

    // Items Ordered
    pdf.text("Items Ordered:", 10, 50);
    req.body.orderItems.forEach((item, index) => {
      pdf.text(
        `${index + 1}. ${item.name} - Date: ${item.date} - Price: ${
          item.price
        }`,
        15,
        60 + index * 10
      );
    });

    // Subtotal
    pdf.text(
      `Subtotal: ${req.body.itemsPrice}`,
      10,
      60 + (req.body.orderItems.length + 1) * 10
    );

    pdf.text(
      `Tax: ${req.body.taxPrice}`,
      10,
      70 + (req.body.orderItems.length + 1) * 10
    );

    // Total Price
    pdf.text(
      `Total Price: ${req.body.totalPrice}`,
      10,
      80 + (req.body.orderItems.length + 1) * 10
    );

    // ... add more content as needed

    // Save the PDF or send it as an attachment
    return pdf.output("datauristring").split(",")[1];
  };

  const sendEmail = async (order) => {
    // Replace these with your Mailtrap SMTP credentials
    const gmailConfig = {
      service: "gmail",
      auth: {
        user: "myrmiproductions@gmail.com",
        pass: "bkkg uqoq dbrh qhxm", // Generate an app-specific password for better security
      },
    };

    // Create a Nodemailer transporter using Gmail
    const transporter = nodemailer.createTransport(gmailConfig);

    const mailOptions = {
      from: "myrmiproductions@gmail.com", // Replace with your sender email
      to: "myrmiproductions@gmail.com", // Replace with recipient email
      subject: "Order Invoice",
      html: `
          <p>Invoice attached. Click the button below to confirm:</p>
          <a href="${confirmationLink}">Confirm Order</a>
        `,
      attachments: [
        {
          filename: "invoice.pdf",
          content: generateInvoice(order),
          encoding: "base64",
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  const {
    orderItems,
    eventInfo,
    itemsPrice,
    taxPrice,
    date,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    eventInfo,
    itemsPrice,
    taxPrice,
    date,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });
  const confirmationLink = `http://localhost:4001/api/v1/order/${order._id}/confirm`;
  sendEmail(order, confirmationLink);
  res.status(200).json({
    success: true,
    order,
  });
};
exports.confirmOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const users = await Order.findById(orderId).populate("user");
    const userEmail = users.user.email;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: "Confirmed" }, // Assuming 'status' is the field in your Order model representing order status
      { new: true } // To return the updated order after the update is applied
    );
    const order = await Order.findById(orderId);
    const generateInvoice = (order) => {
      const pdf = new jsPDF();

      // Set font size
      pdf.setFontSize(12);

      // Add content to the PDF (order details, items, etc.)
      pdf.text("Invoice:", 10, 10);

      // User's Name and Contact No
      pdf.text(`User's Name: ${users.user.name}`, 10, 20);
      pdf.text(`Contact No: ${order.eventInfo.phoneNo}`, 10, 30);

      // Event Address
      pdf.text(
        `Event Address: ${order.eventInfo.address}, ${order.eventInfo.city}, ${order.eventInfo.country}, ${order.eventInfo.postalCode}`,
        10,
        40
      );

      // Items Ordered
      pdf.text("Items Ordered:", 10, 50);
      order.orderItems.forEach((item, index) => {
        pdf.text(
          `${index + 1}. ${item.name} - Date: ${item.date} - Price: ${
            item.price
          }`,
          15,
          60 + index * 10
        );
      });

      // Subtotal
      pdf.text(
        `Subtotal: ${order.itemsPrice}`,
        10,
        60 + (order.orderItems.length + 1) * 10
      );

      pdf.text(
        `Tax: ${order.taxPrice}`,
        10,
        70 + (order.orderItems.length + 1) * 10
      );

      // Total Price
      pdf.text(
        `Total Price: ${order.totalPrice}`,
        10,
        80 + (order.orderItems.length + 1) * 10
      );

      // ... add more content as needed

      // Save the PDF or send it as an attachment
      return pdf.output("datauristring").split(",")[1];
    };
    const sendEmail = async (order) => {
      // Replace these with your Mailtrap SMTP credentials
      const gmailConfig = {
        service: "gmail",
        auth: {
          user: "myrmiproductions@gmail.com",
          pass: "bkkg uqoq dbrh qhxm", // Generate an app-specific password for better security
        },
      };

      // Create a Nodemailer transporter using Gmail
      const transporter = nodemailer.createTransport(gmailConfig);

      const mailOptions = {
        from: "myrmiproductions@gmail.com", // Replace with your sender email
        to: userEmail, // Replace with recipient email
        subject: "Order Invoice",
        html: `
        <p>Invoice attached. </p>
       
      `,
        attachments: [
          {
            filename: "invoice.pdf",
            content: generateInvoice(order),
            encoding: "base64",
          },
        ],
      };

      try {
        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error);
      }
    };
    // Fetch the order details from the database using orderId

    // Send an email to the user confirming the order
    await sendEmail(order);

    res.status(200).json({ success: true, message: "Order confirmed" });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ success: false, error: "Failed to confirm order" });
  }
};

exports.getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({ message: `No Order found with this ID` });
  }

  res.status(200).json({
    success: true,
    order,
  });
};

exports.myOrders = async (req, res, next) => {
  try {
    // Retrieve orders for the logged-in user only
    const orders = await Order.find({ user: req.user._id }).populate("user");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

exports.allOrders = async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "Order already delivered" });
    }

    // Update order status to 'Confirmed'
    order.orderStatus = "Finished";
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: `No Order found with this ID` });
  }
  await order.remove();

  res.status(200).json({
    success: true,
  });
};

// async function updateStock(id, quantity) {
//     const product = await Product.findById(id);
//     product.stock = product.stock - quantity;
//     await product.save({ validateBeforeSave: false })
// }

// exports.deleteOrder = async (req, res, next) => {
//     const order = await Order.findById(req.params.id)

//     if (!order) {
//         return res.status(404).json({ message: `No Order found with this ID` })

//     }
//     await order.remove()

//     res.status(200).json({
//         success: true
//     })
// }

exports.totalOrders = async (req, res, next) => {
  const totalOrders = await Order.aggregate([
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ]);
  if (!totalOrders) {
    return res.status(404).json({
      message: "error total orders",
    });
  }
  res.status(200).json({
    success: true,
    totalOrders,
  });
};

exports.totalSales = async (req, res, next) => {
  const totalSales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  if (!totalSales) {
    return res.status(404).json({
      message: "error total sales",
    });
  }
  res.status(200).json({
    success: true,
    totalSales,
  });
};

exports.customerSales = async (req, res, next) => {
  const customerSales = await Order.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },

    { $unwind: "$userDetails" },

    {
      $group: {
        _id: "$userDetails.name",
        total: { $sum: "$totalPrice" },
      },
    },

    { $sort: { total: -1 } },
  ]);
  console.log(customerSales);
  if (!customerSales) {
    return res.status(404).json({
      message: "error customer sales",
    });
  }
  // return console.log(customerSales)
  res.status(200).json({
    success: true,
    customerSales,
  });
};
exports.salesPerMonth = async (req, res, next) => {
  const salesPerMonth = await Order.aggregate([
    {
      $group: {
        // _id: {month: { $month: "$paidAt" } },
        _id: {
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
        },
        total: { $sum: "$totalPrice" },
      },
    },

    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: [
                ,
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sept",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            in: {
              $arrayElemAt: ["$$monthsInString", "$_id.month"],
            },
          },
        },
      },
    },
    { $sort: { "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        month: 1,
        total: 1,
      },
    },
  ]);
  if (!salesPerMonth) {
    return res.status(404).json({
      message: "error sales per month",
    });
  }
  // return console.log(customerSales)
  res.status(200).json({
    success: true,
    salesPerMonth,
  });
};

exports.serviceSales = async (req, res, next) => {
  try {
    const serviceSales = await Service.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "orderItems.service",
          as: "serviceOrders",
        },
      },
      {
        $group: {
          _id: "$name",
          totalSales: { $sum: "$price" },
        },
      },
      { $sort: { totalSales: -1 } },
    ]);

    if (!serviceSales) {
      return res.status(404).json({
        message: "error service sales",
      });
    }

    res.status(200).json({
      success: true,
      serviceSales,
    });
  } catch (error) {
    console.error("Error fetching service sales:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch service sales",
    });
  }
};
