module.exports = async function (context, myQueueItem) {
    context.log('JavaScript queue trigger function processed work item', myQueueItem);
    context.log('The value of the secret is: ' , process.env.secret3 );
};
