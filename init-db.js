require('babel-core/register')({
    presets: ['stage-3']
});

const model = require('./model.js');

model.sync().then(() => {
    console.log('Init database OK!')
    process.exit(0)
}).catch((e) => {
    console.log(e)
})
