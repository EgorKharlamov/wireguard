const fs = require('fs');

let ENV_OBJECT;

const getArguments = () => {
  const res = [];
  process.argv.forEach((val, i) => {
    if (i >=2) res.push(val);
  })
  return res
}

const isItGet = () => {
  return getArguments()[0]?.toLowerCase() === 'get';
}

const isItSet = () => {
  return getArguments()[0]?.toLowerCase() === 'set';
}

const isItRemove = () => {
  return getArguments()[0]?.toLowerCase() === 'remove';
}

const buildObjectFromArray = array => {
  const res = {};
  for (const item of array) {
    const key = item.split('=')[0];
    const values = item.split('=')[1]?.split(',').filter(el => el);
    if (key && values.length) {
      res[key] = values;
    }
  }
  return res;
}

const getMappedPeers = peers => peers.map(el => el.replace(/[^A-Za-z0-9]/gmi, '')).map(el => el.charAt(0).toUpperCase().trim() + el.slice(1).trim());

const setPeers = (peers) => {
  const peersMapped =  getMappedPeers(peers);
  const newPeers = [];
  if (!peersMapped.length) return;
  peersMapped.forEach(el => {
    const isExistsInEnv = ENV_OBJECT.PEERS?.includes(el);
      if (!isExistsInEnv) {
        newPeers.push(el);
      }
    });
  if (!newPeers.length) return;
  let content;
  if (ENV_OBJECT.PEERS?.length) {
    content = `PEERS=${ENV_OBJECT.PEERS?.join(',')},${newPeers.join(',')}`;
  } else {
    content = `PEERS=${newPeers.join(',')}`;
  }
  fs.writeFile('./.env', content, err => {
    if (err) {
      console.error(err);
    }
  });
}

const removePeers = (peers) => {
  const peersMapped =  getMappedPeers(peers);
  if (!peersMapped.length) return;
  const updatedPeers = ENV_OBJECT.PEERS?.filter(el => !peersMapped.includes(el));
  let content;
  if (!updatedPeers.length) {
    content = 'PEERS=';
  } else {
    content = `PEERS=${updatedPeers.join(',')}`;
  }
  fs.writeFile('./.env', content, err => {
    if (err) {
      console.error(err);
    }
  });
}

const parser = (data) => {
  const rows = data.split('\n');
  ENV_OBJECT = buildObjectFromArray(rows);
  if (isItSet()) {
    setPeers(getArguments()?.slice(1));
  } else if (isItGet()) {
    console.log('peers:',ENV_OBJECT.PEERS);
    return ENV_OBJECT.PEERS;
  } else if (isItRemove()) {
    removePeers(getArguments()?.slice(1));
  } else {
    console.log('unknown command');
    return;
  }
}

const readFileHandler = (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  parser(data);
}

fs.readFile('./.env', 'utf8', readFileHandler);
