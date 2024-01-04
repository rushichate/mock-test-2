const jsonServer = require("json-server")
const server = jsonServer.create()
const router = jsonServer.router("db.json")
const middleware = jsonServer.defaults()
const cors = require("cors")
require("dotenv").config()

const PORT = process.env.PORT || 3000

server.use(middleware)
server.use(jsonServer.bodyParser)
server.use(cors())


server.use((req,res,next)=>{
    setTimeout(next,1000)
})

server.get("/cars",(req,res)=>{
    const cars = router.db.get("cars").value();
    res.status(200).json(cars)
})

server.post("/carad",(req,res)=>{
    const { brand,type,year,kms,description,price} = req.body
    const ads = router.db.get("cars");
    const highestId = Math.max(...ads.map(car => car.id), 0);
    const newAd = {
        id:highestId+1,brand,type,year,kms,description,price
    }
    ads.push(newAd).write()
     res.status(201).json("Ad Posted Successfully")
    console.log("recived post request for add")
})

server.delete("/cars/:id",(req,res)=>{
    const carId = parseInt(req.params.id)

    router.db.get("cars").remove({id:carId}).write()
    res.status(200).json("Car deleted Successfully")
})

server.put("/cars/:id",(req,res)=>{
    const carId = parseInt(req.params.id)
    const { brand,type,year,kms,description,price} = req.body
    const edited = {
        id:carId,brand,type,year,kms,description,price
    }

    router.db.get("cars").find({id:carId}).assign(edited).write()
    res.status(200).json("Car Updated")
})

server.post("/wishlist",(req,res)=>{
    const car = req.body
    const wish = router.db.get("wishlist");
    wish.push(car).write()
     res.status(201).json("Added to wishlist")
    console.log("recived post request for add")
})

server.get("/wishlist",(req,res)=>{
    const wish = router.db.get("wishlist").value();
    res.status(200).json(wish)
})

server.delete("/wishlist/:id",(req,res)=>{
    const carId = parseInt(req.params.id)

    router.db.get("wishlist").remove({id:carId}).write()
    res.status(200).json("Car deleted Successfully")
})


server.use(router)

server.listen(PORT,()=>{
    console.log("server is running")
})



