const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
            console.log('products data send');
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