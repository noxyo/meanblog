'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Oferta Schema
 */
var OfertaSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Oferta name',
    trim: true
  },
  /*
  OfTipo: {
    type: String,
    default: '',
    required: 'Selecione o Tipo de Oferta',
    trim: true
  },*/
  categoria: {
    type: String,
    default: '',
    trim: true
  },
  descricao: {
    type: String,
    default: '',
    trim: true
  },
  valor: {
    type: String,
    default: '',
    trim: true
  },
  preco: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Oferta', OfertaSchema);
