console.log("Loading server middleware...")

const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
// const path = require('path');
const express = require('express');

module.exports = (app) => {
    app.use(express.json());
    app.use(morgan('common'));
    app.use(cors({
      credentials: true,
      origin: ['http://localhost:4200']
    }));
    app.use(helmet({
        contentSecurityPolicy: false,
      }));

    
}