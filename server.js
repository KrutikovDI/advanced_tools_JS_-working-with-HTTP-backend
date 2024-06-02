
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

let notes = [
  {description: 'Поменять краску в принтере, ком. 401', detailed: 'Поменять краску в принтере, ком. 401Поменять краску в принтере, ком. 401Поменять краску в принтере, ком. 401Поменять краску в принтере, ком. 401Поменять краску в принтере, ком. 401Поменять краску в принтере, ком. 401', date: '2024-05-06 16:53'},
  {description: 'Обновление', detailed: 'Поменять краску в принтере, Поменять краску в принтереПоменять краску в принтереПоменять краску в принтереПоменять краску в принтереПоменять краску в принтереПоменять краску в принтере', date: '2024-05-06 16:53'}
];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use((ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    next();
    return;
  }
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
  ctx.response.status = 204;
  ctx.response.body = 'server request'
});

app.use((ctx, next) => {
  if (ctx.request.method !== 'POST') {
    next();
    return;
  }
  const now = new Date();
  const date = now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes();
  const { description, detailed } = ctx.request.body
  // console.log("метод POST");
  // console.log(ctx.request.body);
  notes.push({ description, detailed, date: date })
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.body = notes;
  next();
});

app.use((ctx, next) => {
  if (ctx.request.method !== 'DELETE') {
    next();
    return;
  }
  ctx.response.set('Access-Control-Allow-Origin', '*');
  const noteDelete = Object.assign({}, ctx.request.query)
  if (notes.every(note => note.description !== noteDelete.description)) {
    ctx.response.status = 400;
    ctx.response.body = 'Deleted note is missing';
    return;
  }
  notes = notes.filter(note => {
    if (note.description !== noteDelete.description || note.detailed !== noteDelete.detailed || note.date !== noteDelete.date) {
      return true
    } else {
      return false}
  });
  ctx.response.body = notes;
  next();
});

app.use((ctx, next) => {
  if (ctx.request.method !== 'PUT') {
    next();
    return;
  }
  const noteCorrect = ctx.request.body
  for (let index = 0; index < notes.length; index++) {
    const note = notes[index];
    if (note.description == noteCorrect.descriptionOld && note.detailed == noteCorrect.detailedOld && note.date == noteCorrect.dateOld) {
      note.description = noteCorrect.descriptionNew;
      note.detailed = noteCorrect.detailedNew;
    }
  }
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.body = notes;
  next();
});

// app.use((ctx) => {
//   ctx.response.body = 'server request'
// });

/*создаем сервер для обработки запросов*/
// const server = http.createServer((req, res) => {
//   const buffer = [];
//   req.on('data', (chunk) => {
//     buffer.push(chunk)
//   });
//   req.on('end', () => {
//     const data = Buffer.concat(buffer).toString();
//     console.log(data);
//   })
//   res.end('server response');
// });

const server = http.createServer(app.callback());
const port = 9090;
server.listen(port, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Server is listening to ' + port);
  });