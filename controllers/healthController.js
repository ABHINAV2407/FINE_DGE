function healthHandler(req,res) {
  return res.status(200).send({
    message : `Server is running.`
   })  
}

module.exports={
  healthHandler
}