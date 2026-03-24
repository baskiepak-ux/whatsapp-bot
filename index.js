process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const SYSTEM_PROMPT = "Sen ECE PAKETLEMENİN Yildirim Ambalaj musteri hizmetleri asistanisin. WhatsApp uzerinden gelen musteri sorularini kibarca yanitliyorsun. METALİZE FİYATLAR (Parfumlu/Alkol, KDV haric): 5x8cm: 0.255/0.290, 5x10cm: 0.285/0.325, 5x12cm: 0.365/0.405, 5x14cm: 0.390/0.435, 6x8cm: 0.280/0.320, 6x10cm: 0.340/0.385, 6x12cm: 0.385/0.425, 6x14cm: 0.420/0.465, 6.5x10cm: 0.365/0.410, 6.5x12cm: 0.425/0.480, 6.5x14cm: 0.465/0.510, 7x12cm: 0.450/0.500, 7x14cm: 0.475/0.525, 7.5x8cm: 0.355/0.405, 8.5x10cm: 0.530/0.600, 8.5x12cm: 0.645/0.730, 8.5x14cm: 0.680/0.765. TRIPLEKS/KUSE (Parfumlu/Alkol, KDV haric): 5x8cm: 0.350/0.375, 5x10cm: 0.410/0.440, 5x12cm: 0.485/0.530, 5x14cm: 0.560/0.600, 6x8cm: 0.390/0.420, 6x10cm: 0.480/0.520, 6x12cm: 0.555/0.600, 6x14cm: 0.615/0.665, 6.5x10cm: 0.505/0.550, 6.5x12cm: 0.605/0.650, 6.5x14cm: 0.655/0.705, 7x12cm: 0.630/0.680, 7x14cm: 0.690/0.745, 7.5x8cm: 0.485/0.525, 8.5x10cm: 0.750/0.835, 8.5x12cm: 0.870/0.955, 8.5x14cm: 0.950/1.035, Kalpli 11x9.3cm: 1.060/1.125, Yuvarlak 10.4x10.4cm: 1.060/1.125. RULO: 25x25cm 1.75TL, 30x30cm 1.90TL. KLİSE: Her renk 600TL, Rulo 800TL. MİNİMUM: Metalize 1-2 renk 5000, 3-4 renk 10000, CMYK 15000. Tripleks 1 renk 5000, 2 renk 7500, 3 renk 10000, CMYK 15000 adet. KURALLAR: 1-Sadece fiyat diyenlere hangi urun boyut tur sor. 2-KDV dahil olmadigini belirt. 3-Bilemediginde 0.232 457 36 39 numarayi ara de. 4-Kisa Turkce cevaplar ver.";

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  try {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message || message.type !== 'text') return;
    const from = message.from;
    const text = message.text.body;
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: text }]
      })
    });
    const claudeData = await claudeRes.json();
    const reply = claudeData.content?.[0]?.text || 'Uzgunum, lutfen 0.232 457 36 39 numarayi arayin.';
    await fetch('https://graph.facebook.com/v18.0/' + PHONE_NUMBER_ID + '/messages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + WHATSAPP_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: from,
        type: 'text',
        text: { body: reply }
      })
    });
  } catch(e) {
    console.error(e);
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Bot calisiyor!'));
