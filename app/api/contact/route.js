
// import axios from 'axios';
// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// // Hardcoded values (for local testing only – not secure)
// const GMAIL_USER = "aryanpatil9700@gmail.com";
// const GMAIL_PASS = "zjzl lpwl iruu xdel";
// const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
// const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// // Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: GMAIL_USER,
//     pass: GMAIL_PASS,
//   },
// });

// // Telegram message sender
// async function sendTelegramMessage(token, chat_id, message) {
//   const url = `https://api.telegram.org/bot${token}/sendMessage`;
//   try {
//     const res = await axios.post(url, {
//       chat_id,
//       text: message,
//     });
//     return res.data.ok;
//   } catch (error) {
//     console.error('Error sending Telegram message:', error.response?.data || error.message);
//     return false;
//   }
// }

// // HTML email template
// const generateEmailTemplate = (name, email, userMessage) => `
//   <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
//     <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
//       <h2 style="color: #007BFF;">New Message Received</h2>
//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Message:</strong></p>
//       <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
//         ${userMessage}
//       </blockquote>
//       <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
//     </div>
//   </div>
// `;

// // Nodemailer email sender
// async function sendEmail(payload, message) {
//   const { name, email, message: userMessage } = payload;

//   const mailOptions = {
//     from: "Portfolio <" + GMAIL_USER + ">",
//     to: GMAIL_USER,
//     subject: `New Message From ${name}`,
//     text: message,
//     html: generateEmailTemplate(name, email, userMessage),
//     replyTo: email,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.error('Error while sending email:', error.message);
//     return false;
//   }
// }

// // API Handler
// export async function POST(request) {
//   try {
//     const payload = await request.json();
//     const { name, email, message: userMessage } = payload;

//     const formattedMessage = `📩 New message from ${name}\n\n📧 Email: ${email}\n📝 Message:\n${userMessage}`;

//     const telegramSuccess = await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, formattedMessage);
//     const emailSuccess = await sendEmail(payload, formattedMessage);

//     if (telegramSuccess && emailSuccess) {
//       return NextResponse.json({
//         success: true,
//         message: 'Message and email sent successfully!',
//       }, { status: 200 });
//     }

//     return NextResponse.json({
//       success: false,
//       message: 'Failed to send message or email.',
//     }, { status: 500 });

//   } catch (error) {
//     console.error('API Error:', error.message);
//     return NextResponse.json({
//       success: false,
//       message: 'Server error occurred.',
//     }, { status: 500 });
//   }
// };

import axios from 'axios';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Load sensitive data from environment variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// HTML email template
const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

// Send message to Telegram
async function sendTelegramMessage(token, chat_id, message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await axios.post(url, {
      chat_id,
      text: message,
    });
    return res.data.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    return false;
  }
}

// Send email using Nodemailer
async function sendEmail(payload, message) {
  const { name, email, message: userMessage } = payload;

  const mailOptions = {
    from: `Portfolio <${GMAIL_USER}>`,
    to: GMAIL_USER,
    subject: `New Message From ${name}`,
    text: message,
    html: generateEmailTemplate(name, email, userMessage),
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error while sending email:', error.message);
    return false;
  }
}

// API Route Handler
export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, message: userMessage } = payload;

    const formattedMessage = `📩 New message from ${name}\n\n📧 Email: ${email}\n📝 Message:\n${userMessage}`;

    const telegramSuccess = await sendTelegramMessage(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, formattedMessage);
    const emailSuccess = await sendEmail(payload, formattedMessage);

    if (telegramSuccess && emailSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Message and email sent successfully!',
      }, { status: 200 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to send message or email.',
    }, { status: 500 });

  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Server error occurred.',
    }, { status: 500 });
  }
}
