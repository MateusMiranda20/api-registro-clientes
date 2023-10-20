const express = require('express');
const uuid = require('uuid');
const cors = require('cors')

const app = express()
const porta = 3005
app.use(express.json())
app.use(cors())


const users = []

const MyMiddleware = (request, response, next) => {

    const {id} = request.params
    
    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json({message: "Usuario não encontrado"})
    }

    request.userIndex = index
    request.idUser = id

    next()
}   

const urlChamando = (request, response, next) => {

    const {url, metho} = request
    console.log(`Url ${url}, Metho ${metho}`)

    next()

}


app.get('/pedido', (request, response) => {
    return response.json(users)
})

app.post('/pedido', (request, response) => {
    const { snack, name, valoDoPedido, status } = request.body

    const user = {id: uuid.v4(), snack, name, valoDoPedido, status}

    users.push(user)


    return response.status(201).json(user)
});

app.put('/pedido/:id', MyMiddleware, (request, response) => {
    const {snack, name, valoDoPedido, status} = request.body
    const index = request.userIndex
    const id = request.idUser

    const atualizar = {id, snack, name, valoDoPedido, status};

    users[index] = atualizar

    return response.json(atualizar)
    
});

app.delete('/pedido/:id', MyMiddleware, (request, response) => {
    const index = request.userIndex

    users.splice(index,1)

    return response.status(204).json()
})

app.get('/pedido/:id', MyMiddleware, urlChamando, (request, response) => {
    return response.json(users)
})
app.patch('/pedido/:id', MyMiddleware, urlChamando, (request, response) => {
    
    const {id} = request.params

    const index = users.findIndex( user => user.id === id)

    users[index]. status = "Pedido Pronto"

    return response.json(users[index])
})



app.listen(porta, () => {
    console.log(`Porta ${porta} rodando 😁`)
})