const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app=express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.port || 5000;


app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1pxon9n.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const categoryOptionproduct=client.db('BikeSell').collection('categoryOption');
        const ProductCollection=client.db('BikeSell').collection('productOption');
        const bookingProduct=client.db('BikeSell').collection('bookings');
        const userCollection=client.db('BikeSell').collection('users');
        const addproductCollection=client.db('BikeSell').collection('addproduct');
        app.get('/category',async(req,res)=>{
            const query={}
            const result=await categoryOptionproduct.find(query).toArray()
            res.send(result)
        })
        app.get('/category/:id',async(req,res)=>{
            const id=req.params.id
          const a=parseInt(id)
            const query={service_id:a}
            
            const result= await ProductCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/booking',async(req,res)=>{
            const email=req.query.email;
            const query={
                email:email
            }
          
            const result=await bookingProduct.find(query).toArray()
            res.send(result)
        });
        app.get('/allbookings',async(req,res)=>{
            const query={ 
            }
            const result=await bookingProduct.find(query).toArray()
            res.send(result)
        })
        app.post('/bookings',async(req,res)=>{
            const booking=req.body;
            const result=await bookingProduct.insertOne(booking)
          
            res.send(result)

        });
        app.post('/product',async(req,res)=>{
            const product=req.body;
            console.log(product)
            const result=await ProductCollection.insertOne(product)
          
            res.send(result)

        });
       

        app.get('/myproduct/:email',async(req,res)=>{
            const email=req.params.email
            const query={email}
          
            const result=await ProductCollection.find(query).toArray()
            res.send(result)
        })
      
        app.delete('/usersbuyer/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
         
            const result=await userCollection.deleteOne(query)
            res.send(result)
        })
      
        app.post('/users',async(req,res)=>{
            const users=req.body;
            const doc= {
                role: "buyer",
                email:users.email,
                name:users.name
               
        }
            const result=await userCollection.insertOne(doc)
         
            res.send(result)
        })
        app.post('/sellers',async(req,res)=>{
            const users=req.body;
            const doc= {
                role: "seller",
                email:users.email,
                name:users.name
               
        }
         
              const result= await userCollection.insertOne(doc)
              console.log(result)
              res.send(result)

        })
        app.put('/users/admin/:id',async(req,res)=>{
            const id=req.params.id;
            const filter={_id:ObjectId(id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                      role:"admin"
                },
              };
       const result = await userCollection.updateOne(filter, updateDoc, options);
       console.log(result)
       res.send(result)
        });
        app.get('/allusers',async(req,res)=>{
            const query={
                role:'seller'
            }
            const user=await userCollection.find(query).toArray()
            res.send(user);
        });
        app.get('/Buyer',async(req,res)=>{
            const query={
                role:'buyer'
            }
            const user=await userCollection.find(query).toArray()
            res.send(user);
        });
        app.get('/users/admin/:email',async(req,res)=>{
            const email=req.params.email;
            const query={email}
            const user= await userCollection.findOne(query)
          
            res.send({isAdmin: user?.role==='admin'});
        })
         app.get('/users/sellers/:email',async(req,res)=>{
            const email=req.params.email;
            const query={email}
            const user=await userCollection.findOne(query)
            res.send({isSeller: user?.role==='seller'});

         })
         
        
         app.put('/advertize/:id',async(req,res)=>{
            const id=req.params.id;
            const filter={_id:ObjectId(id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    advertise:true
                },
              };
       const result = await ProductCollection.updateOne(filter, updateDoc, options);
       console.log(result)
       res.send(result)
        });
        app.get('/advertize',async(req,res)=>{
            const query={
                advertise:true
            }
            const result=await ProductCollection.find(query).toArray()
            res.send(result)
        })
        app.delete('/mybookings/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
         
            const result=await bookingProduct.deleteOne(query)
            res.send(result)
        })
        app.delete('/allseller/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
         
            const result=await userCollection.deleteOne(query)
            res.send(result)
        });
        app.delete('/myproduct/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            console.log(query)
         
            const result=await ProductCollection.deleteOne(query)
            res.send(result)
        });
        app.get('/ordersadd/:id',async(req,res)=>{
            const id=req.params.id
            const query={ _id: ObjectId(id)}
            const booking=await bookingProduct.findOne(query)
            res.send(booking)
        })
       

    }
    finally{

    }

}
run().catch(console.dir);


app.get('/',async(req,res)=>{
    res.send('Bike sell server is runnoing')
})

app.listen(port,()=>{
    console.log(`Bike portal server on ${port}`)
})