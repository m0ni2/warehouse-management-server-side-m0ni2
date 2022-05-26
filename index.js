const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@groceteria-warehouse.sowbq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const productCollection = client.db("groceteriaWarehouse").collection("product");

        // get all products
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
            console.log('all products data send');
        });

        // get single product
        app.get('/product/:id', async (req, res) => {
            let product;
            const id = req.params.id;
            const delivered = parseInt(req.query.delivered);
            const reStock = parseInt(req.query.reStock);
            const options = { upsert: true };
            const query = { _id: ObjectId(id) };
            if (delivered) {
                const updateDoc = {
                    $inc: { quantity: -delivered },
                };
                product = await productCollection.updateOne(query, updateDoc, options);
            }
            if (reStock) {
                const updateDoc = {
                    $inc: { quantity: reStock },
                };
                product = await productCollection.updateOne(query, updateDoc, options);
            }
            else {
                product = await productCollection.findOne(query);
            }

            res.send(product);
            console.log('single product data send', delivered);
        });


    }
    finally {
        // client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Groceteria Warehouse Server Is Running');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});