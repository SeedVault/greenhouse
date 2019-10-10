const mongoose = require('mongoose');
const moment = require('moment')
const db = require('../domain/services/database.js')
const { WalletService } = require('../domain/wallet/services/WalletService');
const { BotSubscription } = require('../domain/greenhouse/entities/Bot.js')


async function main() {

    db()

    const oneMonthAgo = moment().subtract(1, 'months').toDate()

    const SubscriptionPaymentsSchema = mongoose.Schema({
        subscriptionId: 'ObjectId',
        lastPaymentDate: 'Date'
    });
    SubscriptionPaymentsModel = mongoose.model('subscription_payments', SubscriptionPaymentsSchema)

    //Find bot subscriptions with payments from more than on month ago (or no payments at all) on bot subscription types eq month  
    let bss = await BotSubscription.aggregate([
        {$match: {'subscriptionType': {$eq: 'month'}}},
        {$lookup: {
                from: "bots",
                localField: "bot",
                foreignField: "_id",
                as: "bot"
            }
        }, 
        {$unwind: '$bot'},
        {$lookup: {
            from: "subscription_payments",
            localField: "_id",
            foreignField: "subscriptionId",
            as: "subscription_payments"
            }
        },        
        {$unwind: {
            "path": "$subscription_payments",
            "preserveNullAndEmptyArrays": true}},//this makes it work even when there is no subscription_payments join
        {$match: {$or: [{"subscription_payments.lastPaymentDate": {$lt: oneMonthAgo}}, {"subscription_payments": {$exists: false}}]}},
        
   ])

    let bs
    for (let i = 0; i < bss.length; i++) {
        bs = bss[i]

        //console.dir(bs, { depth: null });
        if (!bs.subscription_payments) {
            bs.subscription_payments = {}
        }
        
        if (bs.username == bs.bot.username) {
            //console.log('Subscriber and bot owner are the same user. No need to do payment.')
            continue
        }
        if (bs.bot.pricePerMonth == 0) {
            //console.log('Price per month is 0. No need to do payment.')
            continue
        }

        console.log('----------------------------------------------------------------------------------------------------------------------------')
        console.log('Token: ' + bs.token + ' - lastPayment: ' + bs.subscription_payments.lastPaymentDate)        
        console.log('Trying to make month payment from bot subscriber (' + bs.username + ') to bot owner (' + bs.bot.username + ') - ' + bs.bot.pricePerMonth + ' tokens...')
        

        try {
            let tx = await WalletService.send(bs.username, bs.bot.username, bs.bot.pricePerMonth) //use await to avoid hammering the node            
            console.log('TX hash: ' + tx.toWalletAddress)
            
            let q
            if (bs.subscription_payments._id) { //I'm forced to do this instead of doing upsert: https://jira.mongodb.org/browse/CSHARP-1805
                console.log('updating')
                q = await SubscriptionPayments.updateOne(
                    {_id: bs.subscription_payments._id}, 
                    {lastPaymentDate: moment().toDate()}).exec()
            } else {
                console.log('inserting')
                let subscriptionPayments = new SubscriptionPaymentsModel(
                    {             
                        subscriptionId: bs._id,                
                        lastPaymentDate: moment().toDate()
                    })
                q = await subscriptionPayments.save()
            }
            console.log(q)
        } catch(e) {
            console.log(e)
        }
    }

}
main().then(() => {
    console.log('Process done.')
    process.exit()
})


