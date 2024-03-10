import nodemailer from "nodemailer";
import * as ticketController from "../controllers/ticket.controller.js";
import config from "../config/config.js";
import ticketModel from "./mongo/models/ticket.model.js";
import { ProductManager } from "./ProductManager.js";

class TicketManager {
  constructor() {
    this.model = ticketModel;
    this.productManager = new ProductManager();
  }

  async addTicket(ticket) {
    try {
      return await ticketController.saveTicket(ticket);
    } catch (err) {
      throw err;
    }
  }

  async addTicketFromCart(cartItems, purchaseTotal, user) {
    try {
      let ticketItems = [];
      await Promise.all(
        cartItems.map(async (item) => {
          let product = await this.productManager.getProductById(
            item.productId
          );
          console.log('ticketManager - product:', product);
          let ticketItem = {
            id: product.id,
            name: product.title,
            price: product.price,
            quantity: item.quantity,
          };
          ticketItems.push(ticketItem);
        })
      );
        let ticket = {
          purchaser: user,
          amount: purchaseTotal,
          ticketItems: ticketItems,
          purchase_datetime: new Date(),
          code: Math.random().toString(36).slice(2, 11)
        };

      console.log("ticketManager - Ticket:", ticket);
      const result = await this.addTicket(ticket);
      const emailResult = sendEmail(ticket)
      return {result, emailResult};
    } catch (error) {
      throw error;
    }
  }
}

//Configuracion de transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmailAccount,
    pass: config.gmailAppPassword,
  },
});

//Verificamos conexion con gmail
transporter.verify(function (error, success) {
  if (error) {
    console.log("Error verificando gmail", error);
  } else {
    console.log("Servidor pronto para enviar mails");
  }
});

  const sendEmail = (ticket) => {
console.log('ticketItems', ticket.ticketItems)
  const mailOptions = {
    from: `${config.gmailAccount}`,
    to: ` ${ticket.purchaser.email}`,
    subject: "Confirmación de tu compra",
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007bff;">¡Gracias por tu compra!</h2>
          <p>Hola, <strong>${ticket.purchaser.name}</strong>,</p>
          <p>Hemos recibido tu pedido y está siendo procesado. Aquí están los detalles de tu compra:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h4>Resumen de la Compra</h4>
            <p><strong>ID de la Compra:</strong> ${ticket.code}</p>
            <p><strong>Fecha:</strong> ${new Date(
              ticket.purchase_datetime
            ).toLocaleDateString()}</p>
            <p><strong>Total:</strong> $${ticket.amount}</p>
          </div>
          
          <h4>Productos:</h4>
          <ul>
            ${ticket.ticketItems
              .map(
                (item) =>
                  `<li>${item.quantity} x ${item.name} - $${item.price}</li>`
              )
              .join("")}
          </ul>
          
          <p>Si tienes alguna pregunta, no dudes en responder este correo.</p>
          <p>¡Gracias por confiar en nosotros!</p>
        </div>
      `,
    attachments: [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: %s", info.messageId);
    }
  });
};

export { TicketManager }
