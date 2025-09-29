const sgMail = require('@sendgrid/mail');
// const moment = require('moment-timezone');

exports.sendBuyerEmail = (order) => {
    console.log('***** sendBuyerEmail called')    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    console.log('sendBuyerEmail order', order);

    if(!order.deliveryAddress.email) return

    const msg = {
        to: 'kkwilson852@gmail.com',
        from: 'cat_man_shadow@hotmail.com',
        subject: 'Your Order No. ' + order._id, 
        text: 'Dear ' + order.deliveryAddress.firstName + ', \n\n' +
        'We are pleased to inform you that your order for ' + order.deliveryAddress.firstName + 
        order.deliveryAddress.lastName +  
        // ' placed on ' + moment.tz(order.created_on, 'America/Toronto').format('MM-DD-YYYY') + 
        ' was successfully placed.\n We look forward to serving you again soon.\n\n Kind regards,\n\n Wannet Global, Inc.',
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    try {
        sgMail.send(msg);    
    } catch(error) {
        console.log('errorX sendBuyerEmail', error);
        error.message = 'Problem sending buyer confirmation email`.';
        error.status = '500';
        throw error;
    }
    
}