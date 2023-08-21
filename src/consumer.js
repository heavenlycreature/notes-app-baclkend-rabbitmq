require('dotenv').config();
const amqp = require('amqplib');
const NotesService = require('./notesService');
const MailSender = require('./mailSender');
const Listener = require('./listener');

const init = async () => {
    const notesService = new NotesService();
    const mailSender = new MailSender();
    const listener = new Listener(notesService, mailSender);
    const queue = 'exports:notes';

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
        durable: true,
    })
    channel.consume(queue, listener.listen, {
        noAck: true,
    });
    console.log(`server berjalan!`);
};
init();