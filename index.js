process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const SYSTEM_PROMPT = "Sen ECE PAKETLEMENİN Yildirim Ambalaj musteri hizmetleri asistanisin. WhatsApp uzerinden gelen musteri sorularini kibarca yanitliyorsun. METALİZE FİYATLAR (Parfumlu/Alkol, KDV haric): 5x8cm: 0.255/0.290, 5x10cm: 0.285/0.325, 5x12cm: 0.365/0.405, 5x14cm: 0.390/0.435, 6x8cm: 0.280/0.320, 6x10cm: 0.340/0.385, 6x12cm: 0.385/0.425, 6x14cm: 0.420/0.465, 6.5x10cm: 0.365/0.410, 6.5x12cm: 0.425/0.480, 6.5x14cm: 0.465/0.510, 7x12cm: 0.450/0.500, 7x14cm: 0.475/0.525, 7.5x8cm: 0.355/0.405, 8.5x10cm: 0.530/0.600, 8.5x12cm: 0.645/0.730, 8.5x14cm: 0.680/0.765. TRIPLEKS/KUSE (Parfumlu/Alkol, KDV haric): 5x8cm: 0.350/0.375, 5x10cm: 0.410/0.440, 5x12cm: 0.485/0.530, 5x14cm: 0.560/0.600, 6x8cm: 0.390/0.420, 6x10cm: 0.480/0.520, 6x12cm: 0.555/0.600, 6x14cm: 0.615/0.665, 6.5x10cm: 0.505/0.550, 6.5x12cm: 0.605/0.650, 6.5x14cm: 0.655/0.705, 7x12cm: 0.630/0.680, 7x14cm: 0.690/0.745, 7.5x8cm: 0.485/0.525, 8.5x10cm
