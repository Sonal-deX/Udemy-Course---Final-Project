const mongoose = require('mongoose')
const Review = require('./review')

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new mongoose.Schema({
    title: {
        type: 'string',
        required: true
    },
    img: [
        {
            url: String,
            filename: String
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: 'number',
        required: true
    },
    description: String,
    location: {
        type: 'string',
        required: true
    },
    state: {
        type: 'string',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)


campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <a href="/campgrounds/${this._id}" style="text-decoration: none; color:#51BBD6;">${this.title}</a><br>
    <p style="font-size:13px; color:black;">${this.location}, ${this.state}</p>
    `;
})

campgroundSchema.virtual('imgEdit').get(function () {
    let y = []
    this.img.forEach(function(img,i){
        y.push(img.url.replace("/upload","/upload/w_200"))
    })
    return y;
});

campgroundSchema.virtual('imgFile').get(function () {
    let y = []
    this.img.forEach(function(img,i){
        y.push(img.filename)
    })
    return y;
});

campgroundSchema.virtual('imgTrans').get(function () {
    let y = []
    this.img.forEach(function(img,i){
        y.push(img.url.replace("/upload","/upload/q_100/h_200,w_220"))
    })
    return y;
})

campgroundSchema.virtual('imgMain').get(function () {
    let y = []
    this.img.forEach(function(img,i){
        y.push(img.url.replace("/upload","/upload/q_100/h_170,w_220"))
    })
    return y;
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)