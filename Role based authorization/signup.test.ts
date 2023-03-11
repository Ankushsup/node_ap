// const supertest = require('supertest')
import { SuperTest } from "supertest";
import { bodyParser } from "..";
import { signup } from "./signup";
const express = require('express')
// const app = express();
import { response } from "express";
import * as supertest from "supertest"

describe('user', () => {
    it('Run the api', async () => {
        const response = await supertest(signup).post('localhost:3000/MLA/signup')
            .send({
                "id": 105,
                "name": "AB",
                "role": "admin",
                "password": "hey1"
            })
        expect(response.statusCode).toBe(200)
    }

    )
})

