//Para trabajar Factory
 import { userService } from '../services/factory.js';

// Para trabajar Repository
// import { UserService } from '../services/repository.js';
import UsersDto from '../services/dto/user.dto.js';

export async function currentUser(req, res) {
    try {
        console.log("ses", req.session)
        let currentUser = req.session.user;
        let usersDto = new UsersDto(currentUser);
        res.send(usersDto)
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener el usuario activo." });
    }
}

export async function getAllUsers(req, res) {
    try {
        let users = await userService.getAll();
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los usuarios." });
    }
}


export async function saveUser(req, res) {
    try {
        // const userDto = new UserDto(req.body);
        // let result = await userService.save(userDto);
        let result = await userService.save(req.body)
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo guardar el estudiante." });
    }
}