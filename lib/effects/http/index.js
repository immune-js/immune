var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Type, Union, Any, Task, map } from "../..";

export var Response = Type("HTTP.Response", { url: String,
  status: { code: Number, message: String },
  headers: Object,
  body: Any
});

export var Error = Union("HTTP.Error", { NetworkError: [Any],
  BadStatus: [Response],
  BadPayload: [Response]
});

export var Request = Union("HTTP.Request", { Inactive: [],
  Pending: [],
  Done: [Any],
  Error: [Any]
});

/* get(url: String, params: Optional(Object)) => HTTP.Request(Object, Error)
 *
 * Returns a task that will, when forked, fetch data from a JSON endpoint.
 *
 * Example:
 *
 *   Http.get("/existing-endpoint", {}).fork(() => {}, data => 
 *     console.log(data)
 *   ) //=> { foo: "bar" }
 *
 *   Http.get("/nonexisting-endpoint", {}).fork(err => 
 *     console.log(err)
 *   , () => {}) //=> Http.NetworkError(Response)
 *
 */
export var get = function get(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return request(url, "json", params);
};

/* getText(url: String, params: Optional(Object)) => HTTP.Request(Object, Error)
 *
 * Returns a task that will, when forked, fetch text from an API endpoint.
 *
 * Example:
 *
 *   Http.get("/existing-endpoint", {}).fork(() => {}, data => 
 *     console.log(data)
 *   ) //=> "foo bar"
 *
 *   Http.get("/nonexisting-endpoint", {}).fork(err => 
 *     console.log(err)
 *   , () => {}) //=> Http.NetworkError(Response)
 *
 */
export var getText = function getText(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return request(url, "text", params);
};

/* getBlob(url: String, params: Optional(Object)) // => HTTP.Request(Object, Error)
 *
 * Fetches a binary resource, like an image, and converts it into an object url
 *
 * Example:
 *
 *   Http.getBlob("/image.png", {}).fork(() => {}, data => 
 *     console.log(data)
 *   ) //=> "blob:/42f652bf-770e-4058-8b4b-c67a2a501c90"
 */
export var getBlob = function getBlob(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return map(request(url, "blob", params), function (blob) {
    return URL.createObjectURL(blob);
  });
};

/* post(url: String, params: Optional(Object)) => HTTP.Request(Object, Error)
 *
 * Posts json to an api endpoint
 * 
 * Example:
 * 
 *   Http.post("/posts", { body: { title: "My post", body: "This is a good post" } })
 *
 */
export var post = function post(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  params = _extends({}, params, { headers: _extends({ 'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, params.headers || {}),
    method: "post",
    body: _typeof(params.body) === "object" ? JSON.stringify(params.body) : params.body
  });

  return request(url, "json", params);
};

/* put(url: String, params: Optional(Object)) => HTTP.Request(Object, Error)
 *
 * Puts json to an api endpoint
 * 
 * Example:
 * 
 *   Http.put("/posts/1", { body: { id: 123, title: "My post", body: "This is a good post" } })
 *
 */
export var put = function put(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  params = _extends({}, params, { method: "put",
    body: _typeof(params.body) === "object" ? JSON.stringify(params.body) : params.body
  });

  return request(url, "json", params);
};

/* patch(url: String, params: Optional(Object)) => HTTP.Request(Object, Error)
 *
 * Patches the resource at an api endpoint
 * 
 * Example:
 * 
 *   Http.patch("/posts/1", { body: { title: "My post" } })
 *
 */
export var patch = function patch(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  params = _extends({}, params, { method: "patch",
    body: _typeof(params.body) === "object" ? JSON.stringify(params.body) : params.body
  });

  return request(url, "json", params);
};

/* destroy(url: String, params: Optional(Object)) => HTTP.Request(Object, Error)
 *
 * Deletes the resource at an api endpoint
 * 
 * Example:
 * 
 *   Http.destroy("/posts/1")
 *
 */
export var destroy = function destroy(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return request(url, "json", _extends({}, params, { method: "delete" }));
};

export var send = function send(task, msg) {
  return Task.perform(task, function (error) {
    return msg(Request.Error(error));
  }, function (data) {
    return msg(Request.Done(data));
  });
};

export default { Response: Response, Error: Error, Request: Request, get: get, getText: getText, getBlob: getBlob, post: post, put: put, patch: patch, destroy: destroy, send: send

  // -- UTILS

};var createResponse = function createResponse(resp) {
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var headers = {};

  if (typeof resp.headers.keys === "function") {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = resp.headers.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        headers[key] = resp.headers.get(key);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else {
    headers = resp.headers;
  }

  return Response(resp.url, { code: resp.status, message: resp.statusText }, headers, body);
};

var request = function request(url, contentType, params) {
  return Task(function (fail, succeed) {
    fetch(url, params).then(function (resp) {
      if (!resp.ok) return fail(Error.BadStatus(createResponse(resp)));

      resp[contentType]().then(function (json) {
        return succeed(createResponse(resp, json));
      }).catch(function (ex) {
        return console.err(ex), fail(Error.BadPayload(createResponse(resp)));
      });
    }).catch(function (ex) {
      return fail(Error.NetworkError(ex));
    });
  });
};