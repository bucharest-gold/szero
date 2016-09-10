/**
 * Copyright 2016 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @module roi
 */
module.exports = exports = {
  get: get,
  post: post,
  put: put,
  del: del,
  exists: exists,
  download: download,
  upload: upload
};

const Fidelity = require('fidelity');
const url = require('url');
const http = require('http');
const fs = require('fs');
const https = require('https');

const maxRedirects = 3;
let redirects = 0;

function hasRedirect (response) {
  return response.statusCode >= 300 && response.statusCode < 400;
}

function goodToGo (response) {
  return response.statusCode < 400;
}

function notFound (response) {
  return response.statusCode === 404;
}

function selectProtocol (options) {
  return url.parse(options.endpoint).protocol === 'http:' ? http : https;
}

function extract (options) {
  options.hostname = url.parse(options.endpoint).hostname;
  options.port = url.parse(options.endpoint).port;
  options.path = url.parse(options.endpoint).path;
  return options;
}

function auth (options) {
  if (options.username) {
    return 'Basic ' + new Buffer(options.username + ':' + options.password).toString('base64');
  }
  return '';
}

function addDefaultHeaders (options) {
  options.headers = {
    'Accept': 'application/json,text/plain',
    'Content-type': 'application/json',
    'Authorization': auth(options)
  };
  return options;
}

function validate (reject, response) {
  validateMaxRedirect(reject);
  validateGoodToGo(reject, response);
}

function validateMaxRedirect (reject) {
  if (redirects >= maxRedirects) {
    redirects = 0;
    return reject(new Error('Maximum redirects reached.'));
  } else {
    redirects++;
  }
}

function validateGoodToGo (reject, response) {
  if (!goodToGo(response)) {
    throw new Error(`[${response.statusCode}] - ${response.statusMessage}`);
  }
}

function coolResponse (body, response) {
  let res = {
    'statusCode': response.statusCode,
    'headers': response.headers,
    'body': body
  };
  return res;
}

function get (options) {
  const protocol = selectProtocol(options);
  options = extract(options);
  options = addDefaultHeaders(options);
  return new Fidelity((resolve, reject) => {
    const req = protocol.request(options, (response) => {
      let body = [];
      response.setEncoding('utf8');
      response.on('data', d => body.push(d));
      if ((goodToGo(response) && !hasRedirect(response)) || notFound(response)) {
        redirects = 0;
        response.on('end', () => {
          body = body.join('');
          resolve(coolResponse(body, response));
        });
      } else if (!goodToGo(response)) {
        reject(body);
      } else {
        validate(reject, response);
        options.endpoint = response.headers.location;
        resolve(get(options));
      }
    });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

function post (options, data) {
  data = data || {};
  const protocol = selectProtocol(options);
  options = extract(options);
  options.method = 'POST';
  const jsonData = JSON.stringify(data);
  options = addDefaultHeaders(options);
  options.headers['Content-Length'] = jsonData.length;
  return new Fidelity((resolve, reject) => {
    const req = protocol.request(options, (response) => {
      let body = [];
      response.setEncoding('utf8');
      response.on('data', d => body.push(d));
      if ((goodToGo(response) && !hasRedirect(response)) || notFound(response)) {
        redirects = 0;
        response.on('end', () => {
          body = body.join('');
          resolve(coolResponse(body, response));
        });
      } else if (!goodToGo(response)) {
        reject(body);
      } else {
        validate(reject, response);
        options.endpoint = response.headers.location;
        resolve(post(options, data));
      }
    });
    req.on('error', (e) => reject(e));
    req.write(jsonData);
    req.end();
  });
}

function put (options, data) {
  data = data || {};
  const protocol = selectProtocol(options);
  options = extract(options);
  options.method = 'PUT';
  const jsonData = JSON.stringify(data);
  options = addDefaultHeaders(options);
  options.headers['Content-Length'] = jsonData.length;
  return new Fidelity((resolve, reject) => {
    const req = protocol.request(options, (response) => {
      let body = [];
      response.setEncoding('utf8');
      response.on('data', d => body.push(d));
      if ((goodToGo(response) && !hasRedirect(response)) || notFound(response)) {
        redirects = 0;
        response.on('end', () => {
          body = body.join('');
          resolve(coolResponse(body, response));
        });
      } else if (!goodToGo(response)) {
        reject(body);
      } else {
        validate(reject, response);
        options.endpoint = response.headers.location;
        resolve(put(options, data));
      }
    });
    req.on('error', (e) => reject(e));
    req.write(jsonData);
    req.end();
  });
}

function del (options) {
  const protocol = selectProtocol(options);
  options = extract(options);
  options = addDefaultHeaders(options);
  options.method = 'DELETE';
  return new Fidelity((resolve, reject) => {
    const req = protocol.request(options, (response) => {
      let body = [];
      response.setEncoding('utf8');
      response.on('data', d => body.push(d));
      if ((goodToGo(response) && !hasRedirect(response)) || notFound(response)) {
        redirects = 0;
        response.on('end', () => {
          body = body.join('');
          resolve(coolResponse(body, response));
        });
      } else if (!goodToGo(response)) {
        reject(body);
      } else {
        validate(reject, response);
        options.endpoint = response.headers.location;
        resolve(del(options));
      }
    });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

function exists (options) {
  const protocol = selectProtocol(options);
  options = extract(options);
  options.method = 'HEAD';
  return new Fidelity((resolve, reject) => {
    const req = protocol.request(options, (response) => {
      let body = [];
      response.setEncoding('utf8');
      response.on('data', d => body.push(d));
      if ((goodToGo(response) && !hasRedirect(response)) || notFound(response)) {
        redirects = 0;
        response.on('end', () => {
          body = body.join('');
          resolve(coolResponse(body, response));
        });
      } else if (!goodToGo(response)) {
        reject(body);
      } else {
        validate(reject, response);
        options.endpoint = response.headers.location;
        resolve(exists(options));
      }
    });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

function download (options, file) {
  const protocol = selectProtocol(options);
  options = extract(options);
  options = addDefaultHeaders(options);
  return new Fidelity((resolve, reject) => {
    const stream = fs.createWriteStream(file);
    const req = protocol.request(options, (response) => {
      if ((goodToGo(response) && !hasRedirect(response)) || notFound(response)) {
        redirects = 0;
        response.pipe(stream);
        stream.on('finish', () => {
          resolve(response);
          stream.close();
        });
      } else {
        validate(reject, response);
        options.endpoint = response.headers.location;
        resolve(download(options, file));
      }
    });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

function upload (options, file) {
  const protocol = selectProtocol(options);
  options = extract(options);
  options.method = 'POST';
  options = addDefaultHeaders(options);
  options.headers.filename = file;
  return new Fidelity((resolve, reject) => {
    const req = protocol.request(options, (response) => {
      let body = [];
      response.setEncoding('utf8');
      response.on('data', d => body.push(d));
      if ((goodToGo(response) && !hasRedirect(response)) || notFound(response)) {
        redirects = 0;
        response.on('end', () => {
          body = body.join('');
          resolve(coolResponse(body, response));
        });
      } else if (!goodToGo(response)) {
        reject(body);
      } else {
        validate(reject, response);
        options.endpoint = response.headers.location;
        resolve(upload(options, file));
      }
    });
    req.on('error', (e) => reject(e));
    const stream = fs.ReadStream(file);
    stream.pipe(req);
    stream.on('close', (res) => {
      req.end();
    });
  });
}
