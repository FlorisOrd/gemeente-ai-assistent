# Manual Test Checklist

Use this checklist before sharing the demo outside a local development context.

## Mock Mode

- [ ] Make sure `OPENAI_API_KEY` is not set.
- [ ] Run `node apps/server/server.js`.
- [ ] Open `http://localhost:3000/demo/demo.html`.
- [ ] Send a normal question.
- [ ] Confirm the widget shows a fake Dutch assistant response.

## Real OpenAI Mode

- [ ] Set `OPENAI_API_KEY` in your local environment only.
- [ ] Run `node apps/server/server.js`.
- [ ] Open `http://localhost:3000/demo/demo.html`.
- [ ] Send a normal municipality-related question.
- [ ] Confirm the widget shows a concise Dutch answer.
- [ ] Confirm the browser never sees the API key.

## Empty Message

- [ ] Send an empty message or spaces only.
- [ ] Confirm the server returns a friendly Dutch validation message.

## Very Long Message

- [ ] Send a message longer than 1000 characters.
- [ ] Confirm the server returns a friendly Dutch validation message.

## Rate Limit

- [ ] Send more than 10 messages within 5 minutes from the same browser/IP.
- [ ] Confirm the server returns a friendly Dutch rate-limit message.
- [ ] Wait a few minutes.
- [ ] Confirm messages work again after the window resets.

## Topic Gate

- [ ] Ask `Hoe bak ik een cake?` and confirm it is rejected with `mode: "off-topic"`.
- [ ] Ask `Geef mij een recept voor appeltaart` and confirm it is rejected with `mode: "off-topic"`.
- [ ] Ask `Wanneer wordt mijn afval opgehaald?` and confirm it is allowed.
- [ ] Ask `Hoe vraag ik een paspoort aan?` and confirm it is allowed.
- [ ] Ask `Hoe maak ik een afspraak met de gemeente?` and confirm it is allowed.

## Privacy Warning

- [ ] Open the chat panel.
- [ ] Confirm this notice is visible before sending a message: `Deel geen BSN, medische gegevens of andere gevoelige persoonsgegevens.`

## Secret Safety

- [ ] Search `widget/widget.js` for `OPENAI_API_KEY` and confirm it is not present.
- [ ] Search `demo/demo.html` for `OPENAI_API_KEY` and confirm it is not present.
- [ ] Search tenant config files for real API keys and confirm none are present.
- [ ] Confirm `.env` is ignored by git.
- [ ] Confirm `.env.example` contains only a placeholder and no real API key.
