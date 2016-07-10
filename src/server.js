export default function scuttlebuttServer(server) {
  // primus server

  var primusServer = new (require('primus'))(server, {}),
      Dispatcher = require('./dispatcher').default,
      gossip = new Dispatcher(),
      gossipStream = gossip.createStream()

  gossipStream.on('data', (data) => {
    console.log('[gossip]', data)
  })

  primusServer.on('connection', (spark) => {
    var stream = gossip.createStream()

    console.log('[io] connection', spark.address, spark.id)

    spark.on('data', function recv(data) {
      console.log('[io]', spark.id, '<-', data);
      stream.write(data)
    });

    stream.on('data', (data) => {
      console.log('[io]', spark.id, '->', data);
      spark.write(data)
    })

    stream.on('error', (error) => {
      console.log('[io]', spark.id, 'ERROR:', error);
    })
  })

}
