const fs = require('fs');
const path = require('path');

const loadVideo = (request, response, contentType, mediaFile) => {
  const file = path.resolve(__dirname, `../client/${mediaFile}`);
  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }
    let { range } = request.headers;
    if (!range) {
      range = 'bytes=0-';
    }
    const positions = range.replace(/bytes=/, '').split('-');

    let start = parseInt(positions[0], 10);
    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }
    const chunksize = (end - start) + 1;
    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accepted-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    });

    const stream = fs.createReadStream(file, { start, end });

    stream.on('open', () => {
      stream.pipe(response);
    });
    stream.on('error', (streamErr) => {
      stream.end(streamErr);
    });
    return stream;
  });
};
const getParty = (request, response) => {
  // load party video
  loadVideo(request, response, 'video/mp4', 'party.mp4');
};
const getBling = (request, response) => {
  // load wii audio
  loadVideo(request, response, 'audio/mpeg', 'bling.mp3');
};
const getBird = (request, response) => {
  // load bird video
  loadVideo(request, response, 'video/mp4', 'bird.mp4');
};
const getMedia = (request, response, contentType, mediaFile) => {
  // try it anyway
  loadVideo(request, response, contentType, mediaFile);
};
// START SAVE
// const getParty = (request, response) => {
//   const file = path.resolve(__dirname, '../client/party.mp4');

//   fs.stat(file, (err, stats) => {
//     if (err) {
//       if (err.code === 'ENOENT') {
//         response.writeHead(404);
//       }
//       return response.end(err);
//     }
//     let { range } = request.headers;
//     if (!range) {
//       range = 'bytes=0-';
//     }
//     const positions = range.replace(/bytes=/, '').split('-');

//     let start = parseInt(positions[0], 10);
//     const total = stats.size;
//     const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

//     if (start > end) {
//       start = end - 1;
//     }
//     const chunksize = (end - start) + 1;
//     response.writeHead(206, {
//       'Content-Range': `bytes ${start}-${end}/${total}`,
//       'Accepted-Ranges': 'bytes',
//       'Content-Length': chunksize,
//       'Content-Type': 'video/mp4',
//     });

//     const stream = fs.createReadStream(file, { start, end });

//     stream.on('open', () => {
//       stream.pipe(response);
//     });
//     stream.on('error', (streamErr) => {
//       stream.end(streamErr);
//     });
//     return stream;
//   });
//   // console.log(request.url);
//   // response.write(sponge);
//   // response.end();
// };
// END SAVE

module.exports.getMedia = getMedia;
module.exports.getParty = getParty;
module.exports.getBling = getBling;
module.exports.getBird = getBird;
