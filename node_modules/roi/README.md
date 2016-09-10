# roi

A basic and fast REST http-client library.

[![npm package](https://nodei.co/npm/roi.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/roi/)

[![Build Status](https://travis-ci.org/bucharest-gold/roi.svg?branch=master)](https://travis-ci.org/bucharest-gold/roi) [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

> _Node.js 4,5,6_

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)

## Usage:

    -- General example:
    roi.get(options)
    .then(x => {
       console.log(x.statusCode);
       console.log(x.headers);
       console.log(x.body);
       console.log(JSON.parse(x.body).foo);
     })
    .catch(e => console.log(e));

    -- GET:
    const options = {
      'endpoint': 'http://localhost:3000/posts'
    };

    roi.get(options)
    .then(x => console.log(x))
    .catch(e => console.log(e));

    -- POST:
    const options = {
      'endpoint': 'http://localhost:3000/posts'
    };

    const foo = {
      title: 'foo-json',
      author: 'bgold'
    };

    roi.post(options, foo)
    .then(x => console.log(x))
    .catch(e => console.log(e));

    -- PUT:
    const options = {
      'endpoint': 'http://localhost:3000/posts/2'
    };

    const foo = {
      title: 'foo-json2',
      author: 'bgold'
    };

    roi.put(options, foo)
    .then(x => console.log(x))
    .catch(e => console.log(e));

    -- DELETE:
    const options = {
      'endpoint': 'http://localhost:3000/posts/3'
    };

    roi.del(options)
    .then(x => console.log(x))
    .catch(e => console.log(e));

    -- EXISTS:
    const options = {
      'endpoint': 'http://localhost:3000/posts/3'
    };

    roi.exists(options)
    .then(x => console.log(x.statusCode === 200))
    .catch(e => console.log(e));

    -- DOWNLOAD:
    const opts = {
      'endpoint': 'http://central.maven.org/maven2/org/jboss/aesh/aesh/0.66.8/aesh-0.66.8.jar'
    };

    roi.download(opts, '/tmp/aesh.jar')
    .then(x => console.log(x))
    .catch(e => console.log(e));


## Benchmarks

    Scores: (bigger is better)

    roiGET
    Raw:
    > 1.1398601398601398
    > 1.1838161838161838
    > 1.170829170829171
    > 1.1808191808191808
    Average (mean) 1.1688311688311688

    requestGET
    Raw:
    > 0.8211788211788211
    > 0.8881118881118881
    > 0.8911088911088911
    > 0.8311688311688312
    Average (mean) 0.857892107892108

    requestPromiseGET
    Raw:
    > 0.8731268731268731
    > 0.7982017982017982
    > 0.8792415169660679
    > 0.8761238761238761
    Average (mean) 0.8566735161046539

    Winner: roiGET
    Compared with next highest (requestGET), it's:
    26.6% faster
    1.36 times as fast
    0.13 order(s) of magnitude faster
    A LITTLE FASTER

    Compared with the slowest (requestPromiseGET), it's:
    26.71% faster
    1.36 times as fast
    0.13 order(s) of magnitude faster
