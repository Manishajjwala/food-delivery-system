const nodemailer = require('nodemailer');

const sendOrderConfirmation = async (order, user) => {
  // Use Ethereal for dummy testing or real SMTP if env vars exist
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER || 'mock_user',
      pass: process.env.EMAIL_PASS || 'mock_pass',
    },
  });

  const mailOptions = {
    from: '"Hungry Delivery" <orders@hungry.com>',
    to: user.email,
    subject: `Order Confirmed! #${order._id.toString().slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #f7e8da; border-radius: 20px; overflow: hidden;">
        <div style="background-color: #f97316; padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Your Order!</h1>
        </div>
        <div style="padding: 30px; background-color: #fffcf9;">
          <h2 style="color: #333;">Order #${order._id.toString().slice(-6).toUpperCase()}</h2>
          <p style="color: #666;">Hi ${user.name}, we've received your order and are preparing it with love.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            ${order.orderItems.map(item => `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold;">${item.name}</span> x ${item.quantity}
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
                  ₹${item.price * item.quantity}
                </td>
              </tr>
            `).join('')}
          </table>
          
          <div style="text-align: right; font-size: 18px; font-weight: bold; color: #f97316; padding: 10px 0;">
            Total Amount: ₹${order.totalPrice}
          </div>
          
          <hr style="border: 0; border-top: 1px solid #f7e8da; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="color: #999; font-size: 12px;">Delivery to: ${order.shippingAddress || 'Your Address'}</p>
            <p style="color: #f97316; font-weight: bold;">Track your order live on the Hungry App!</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    // Only send if we have real credentials or for logging in development
    console.log(`[EmailService] Attempting to send confirmation to ${user.email}...`);
    // const info = await transporter.sendMail(mailOptions);
    // console.log("[EmailService] Message sent: %s", info.messageId);
    console.log(`[EmailService] SUCCESS: MOCK email sent for Order #${order._id.toString().slice(-6).toUpperCase()}`);
  } catch (error) {
    console.error('[EmailService] Error sending email:', error);
  }
};

module.exports = { sendOrderConfirmation };
