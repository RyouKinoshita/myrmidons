const Order = require('../models/order');
const Service = require('../models/service');

const nodemailer = require('nodemailer');
const { jsPDF } = require('jspdf');


exports.newOrder = async (req, res, next) => {
    
    const generateInvoice = (order) => {
        const pdf = new jsPDF();
    
        // Set font size
        pdf.setFontSize(12);
    
        // Add content to the PDF (order details, items, etc.)
        pdf.text('Invoice', 10, 10);
        
        // User's Name and Contact No
        pdf.text(`User's Name: ${req.user.name}`, 10, 20);
        pdf.text(`Contact No: ${req.body.eventInfo.phoneNo}`, 10, 30);
        
        // Event Address
        pdf.text(`Event Address: ${req.body.eventInfo.address}, ${req.body.eventInfo.city}, ${req.body.eventInfo.country}, ${req.body.eventInfo.postalCode}`, 10, 40);
    
        // Items Ordered
        pdf.text('Items Ordered:', 10, 50);
        req.body.orderItems.forEach((item, index) => {
            pdf.text(`${index + 1}. ${item.name} - Date: ${item.date} - Price: ${item.price}`, 15, 60 + (index * 10));
        });
    
        // Subtotal
        pdf.text(`Subtotal: ${req.body.itemsPrice}`, 10, 60 + ((req.body.orderItems.length + 1) * 10));

        pdf.text(`Tax: ${req.body.taxPrice}`, 10, 60 + ((req.body.orderItems.length + 1) * 10));
    
        // Total Price
        pdf.text(`Total Price: ${req.body.totalPrice}`, 10, 70 + ((req.body.orderItems.length + 1) * 10));
    
        // ... add more content as needed
    
        // Save the PDF or send it as an attachment
        return pdf.output('datauristring').split(',')[1];
    };
      
      
      const sendEmail = async (order) => {
        // Replace these with your Mailtrap SMTP credentials
        const mailtrapConfig = {
          host: 'sandbox.smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: '13e96728922f7e',
            pass: 'bab0043009cfd9',
          },
        };
      
        const transporter = nodemailer.createTransport(mailtrapConfig);
      
        const mailOptions = {
          from: 'myrmidons@gmail.com', // Replace with your sender email
          to: req.user.email, // Replace with recipient email
          subject: 'Order Invoice',
          text: 'Invoice attached.',
          attachments: [
            {
              filename: 'invoice.pdf',
              content: generateInvoice(order),
              encoding: 'base64',
            },
          ],
        };
      
        try {
          await transporter.sendMail(mailOptions);
          console.log('Email sent successfully');
        } catch (error) {
          console.error('Error sending email:', error);
        }
      };
    const {
        orderItems,
        eventInfo,
        itemsPrice,
        taxPrice,
        date,
        totalPrice,
        paymentInfo

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
        user: req.user._id
    })
    sendEmail(order);
    res.status(200).json({
        success: true,
        order
    })
}

// exports.getSingleOrder = async (req, res, next) => {
//     const order = await Order.findById(req.params.id).populate('user', 'name email')

//     if (!order) {
//         return res.status(404).json({ message: `No Order found with this ID` })

//     }

//     res.status(200).json({
//         success: true,
//         order
//     })
// }

// exports.myOrders = async (req, res, next) => {
//     const orders = await Order.find({ user: req.user.id })

//     res.status(200).json({
//         success: true,
//         orders
//     })
// }

// exports.allOrders = async (req, res, next) => {
//     const orders = await Order.find()

//     let totalAmount = 0;

//     orders.forEach(order => {
//         totalAmount += order.totalPrice
//     })

//     res.status(200).json({
//         success: true,
//         totalAmount,
//         orders
//     })
// }

// exports.updateOrder = async (req, res, next) => {
//     const order = await Order.findById(req.params.id)

//     if (order.orderStatus === 'Delivered') {
//         return res.status(404).json({ message: `You have already delivered this order` })

//     }

//     order.orderItems.forEach(async item => {
//         await updateStock(item.product, item.quantity)
//     })

//     order.orderStatus = req.body.status
//     order.deliveredAt = Date.now()
//     await order.save()

//     res.status(200).json({
//         success: true,
//     })
// }

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

// exports.totalOrders = async (req, res, next) => {
//     const totalOrders = await Order.aggregate([
//         {
//             $group: {
//                 _id: null,
//                 count: { $sum: 1 }
//             }
//         }
//     ])
//     if (!totalOrders) {
//         return res.status(404).json({
//             message: 'error total orders',
//         })
//     }
//     res.status(200).json({
//         success: true,
//         totalOrders
//     })

// }

// exports.totalSales = async (req, res, next) => {
//     const totalSales = await Order.aggregate([
//         {
//             $group: {
//                 _id: null,
//                 totalSales: { $sum: "$totalPrice" }
//             }
//         }
//     ])
//     if (!totalSales) {
//         return res.status(404).json({
//             message: 'error total sales',
//         })
//     }
//     res.status(200).json({
//         success: true,
//         totalSales
//     })
// }

// exports.customerSales = async (req, res, next) => {
//     const customerSales = await Order.aggregate([
//         {
//             $lookup: {
//                 from: 'users',
//                 localField: 'user',
//                 foreignField: '_id',
//                 as: 'userDetails'
//             },
//         },
//         // {
//         //     $group: {
//         //         _id: "$user",
//         //         total: { $sum: "$totalPrice" },
//         //     }
//         // },

//         { $unwind: "$userDetails" },
//         // {
//         //     $group: {
//         //         _id: "$user",
//         //         total: { $sum: "$totalPrice" },
//         //         doc: { "$first": "$$ROOT" },

//         //     }
//         // },

//         // {
//         //     $replaceRoot: {
//         //         newRoot: { $mergeObjects: [{ total: '$total' }, '$doc'] },
//         //     },
//         // },
//         {
//             $group: {
//                 _id: "$userDetails.name",
//                 total: { $sum: "$totalPrice" }
//             }
//         },
//         // {
//         //     $project: {
//         //         _id: 0,
//         //         "userDetails.name": 1,
//         //         total: 1,
//         //     }
//         // },
//         { $sort: { total: -1 } },

//     ])
//     console.log(customerSales)
//     if (!customerSales) {
//         return res.status(404).json({
//             message: 'error customer sales',
//         })
//     }
//     // return console.log(customerSales)
//     res.status(200).json({
//         success: true,
//         customerSales
//     })

// }
// exports.salesPerMonth = async (req, res, next) => {
//     const salesPerMonth = await Order.aggregate([
//         {
//             $group: {
//                 // _id: {month: { $month: "$paidAt" } },
//                 _id: {
//                     year: { $year: "$paidAt" },
//                     month: { $month: "$paidAt" }
//                 },
//                 total: { $sum: "$totalPrice" },
//             },
//         },

//         {
//             $addFields: {
//                 month: {
//                     $let: {
//                         vars: {
//                             monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', ' Sept', 'Oct', 'Nov', 'Dec']
//                         },
//                         in: {
//                             $arrayElemAt: ['$$monthsInString', "$_id.month"]
//                         }
//                     }
//                 }
//             }
//         },
//         { $sort: { "_id.month": 1 } },
//         {
//             $project: {
//                 _id: 0,
//                 month: 1,
//                 total: 1,
//             }
//         }

//     ])
//     if (!salesPerMonth) {
//         return res.status(404).json({
//             message: 'error sales per month',
//         })
//     }
//     // return console.log(customerSales)
//     res.status(200).json({
//         success: true,
//         salesPerMonth
//     })

// }