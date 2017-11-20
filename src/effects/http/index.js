import
  { Type
  , Union
  , Any
  , Task
  , map
  } from "../.."

export const Response = Type("HTTP.Response",
  { url     : String
  , status  : { code : Number, message : String }
  , headers : Object
  , body    : Any
  }
)

export const Error = Union("HTTP.Error",
  { NetworkError : [ Any      ]
  , BadStatus    : [ Response ]
  , BadPayload   : [ Response ]
  }
)

export const Request = Union("HTTP.Request", 
  { Inactive : [       ]
  , Pending  : [       ]
  , Done     : [ Any   ]
  , Error    : [ Any   ]
  }
)


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
export const get = (url, params = {}) =>
  request(url, "json", params)

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
export const getText = (url, params = {}) =>
  request(url, "text", params)


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
export const getBlob = (url, params = {}) =>
  map(request(url, "blob", params), blob => URL.createObjectURL(blob))

/* post(url: String, params: Optional(Object)) => HTTP.Request(Object, Error)
 *
 * Posts json to an api endpoint
 * 
 * Example:
 * 
 *   Http.post("/posts", { body: { title: "My post", body: "This is a good post" } })
 *
 */
export const post = (url, params = {}) => {
  params = 
    { ...params
    , headers: 
        { 'Accept'       : 'application/json'
        , 'Content-Type' : 'application/json'
        , ...(params.headers || {})
        }
    , method : "post"
    , body   : typeof(params.body) === "object" ? JSON.stringify(params.body) : params.body 
    }
  
  return request(url, "json", params)
}

/* put(url: String, params: Optional(Object)) => HTTP.Request(Object, Error)
 *
 * Puts json to an api endpoint
 * 
 * Example:
 * 
 *   Http.put("/posts/1", { body: { id: 123, title: "My post", body: "This is a good post" } })
 *
 */
export const put = (url, params = {}) => {
  params = 
    { ...params
    , method : "put"
    , body   : typeof(params.body) === "object" ? JSON.stringify(params.body) : params.body 
    }
  
  return request(url, "json", params)
}

/* patch(url: String, params: Optional(Object)) => HTTP.Request(Object, Error)
 *
 * Patches the resource at an api endpoint
 * 
 * Example:
 * 
 *   Http.patch("/posts/1", { body: { title: "My post" } })
 *
 */
export const patch = (url, params = {}) => {
  params = 
    { ...params
    , method : "patch"
    , body   : typeof(params.body) === "object" ? JSON.stringify(params.body) : params.body 
    }
  
  return request(url, "json", params)
}

/* destroy(url: String, params: Optional(Object)) => HTTP.Request(Object, Error)
 *
 * Deletes the resource at an api endpoint
 * 
 * Example:
 * 
 *   Http.destroy("/posts/1")
 *
 */
export const destroy = (url, params = {}) =>
  request(url, "json", { ...params, method : "delete" })


export const send = (task, msg) =>
  Task.perform(task, error => msg(Request.Error(error)), data => msg(Request.Done(data)))


export default { Response, Error, Request, get, getText, getBlob, post, put, patch, destroy, send }


// -- UTILS

const createResponse = (resp, body = {}) => {
  let headers    = {}
  
  if (typeof(resp.headers.keys) === "function") {
    for (const key of resp.headers.keys())
      headers[key] = resp.headers.get(key)
  } else {
    headers = resp.headers
  }
  
  return Response(resp.url, { code: resp.status, message: resp.statusText }, headers, body)
}

const request = (url, contentType, params) => {
  return Task((fail, succeed) => {
    fetch(url, params)
      .then(resp => {
        if (!resp.ok)
          return fail(Error.BadStatus(createResponse(resp)))
          
        resp[contentType]()
          .then  (json => succeed(createResponse(resp, json)))
          .catch (ex   => (console.err(ex), fail(Error.BadPayload(createResponse(resp)))))
        }
      )
      .catch(ex => fail(Error.NetworkError(ex)))
  })
}
