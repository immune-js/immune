var babelTemplate = require("babel-template")
var path          = require("path")

const IMMUNE_PATH = "immune"

var utils =
  { 
  
  // Types
  
    Any           : true
  , OneOf         : true
  , Null          : true
  , Maybe         : true
    , Some        : true
    , None        : true
    , maybe       : true
    , getOrElse   : true
  , Result        : true
    , Ok          : true
    , Err         : true
    , result      : true
  , Task          : true
  
  // Protocols
    
  , IShow         : true
    , show        : true
  , IEqual        : true
    , equals      : true
  , ICollection   : true
    , first       : true
    , rest        : true
    , conj        : true
  , IAssociative  : true
    , get         : true
    , assoc       : true
    , keys        : true
    , vals        : true
  , IKeyed        : true
    , dissoc      : true
  , IIndexed      : true
    , nth         : true
  , IFlatten      : true
    , flatten     : true
  , IMonoid       : true
    , empty       : true
    , concat      : true
  , IFunctor      : true
    , map         : true
  , IFoldable     : true
    , fold        : true
  , IApply        : true
    , ap          : true
  , iBind         : true
    , andThen     : true
    
  // Utils
  
  , Protocol      : true
    , augments    : true
  , Type          : true
  , Union         : true
    , caseOf      : true
  
  // Functions
  
  , is            : true
  , eq            : true
  , identity      : true
  , constant      : true
  , compose       : true
  , lift          : true
  , curry         : true
  , add           : true
  , inc           : true
  , subtract      : true
  , dec           : true
  , divide        : true
  , multiply      : true
  , last          : true
  , butLast       : true
  , slice         : true
  , split         : true
  , join          : true
  , match         : true
  , startsWith    : true
  , assocIn       : true
  , dissocIn      : true
  , mergeDeep     : true
  , get_          : true
  , getIn         : true
  , getIn_        : true
  , sum           : true
  , product       : true
  , avg           : true
  , foldl         : true
  , foldr         : true
  , foldValues    : true
  , foldKV        : true
  , mapKV         : true
  , mapKeys       : true
  , filter        : true
  , some          : true
  , every         : true
  , count         : true
  , find          : true
  , into          : true
  , evolve        : true
  }

module.exports = function (babel) {
  var t = babel.types

  function curry (t, node, args, scope) {
    args = args.map(function (node) { return scope.generateUidIdentifierBasedOnNode(node) })

    var n = 0
    var newArgs = node.arguments.map(function (arg) {
      if (arg.name === '__')
        return args[n++]
      else
        return arg
    })

    return t.functionExpression(null, args, t.blockStatement([
      t.returnStatement(t.callExpression(node.callee, newArgs))
    ]))
  }
  
  const isType = node => (
    node.init && node.init.callee && node.init.callee.name === "Type"
    ||
    node.value && node.value.callee && node.value.callee.name === "Type"
  )

  const isUnion = node => (
    node.init && node.init.callee && node.init.callee.name === "Union"
    ||
    node.value && node.value.callee && node.value.callee.name === "Union"
  )
  
  const isProtocol = node => (
    node.init && node.init.callee && node.init.callee.name === "Protocol"
    ||
    node.value && node.value.callee && node.value.callee.name === "Protocol"
  )
  
  const isFun = node => (
    node.init && node.init.callee && node.init.callee.name === "fun"
    ||
    node.value && node.value.callee && node.value.callee.name === "fun"
  )


  return {
    visitor: {
      Program: {
        enter: (path, env) => {
          env.file.set("bind-imports", [])
        },

        exit: (path, env) => {
          if(env.file.get("bind-imports").length)
            path.node.body = [
              t.importDeclaration(env.file.get("bind-imports").map(function(name) {
                return t.importSpecifier(t.identifier(name), t.identifier(name))
              }), t.stringLiteral(IMMUNE_PATH)),
            ].concat(path.node.body)
            
            // if (process.env.NODE_ENV !== "production") {
            //   const fnameParts = env.file.opts.filename.split("/")
            //   const fname      = fnameParts[fnameParts.length - 1].replace(/\..*/, "")
            //   path.node.body = path.node.body.concat([
            //     t.exportNamedDeclaration(
            //   		t.variableDeclaration("var", 
		        //         [ t.variableDeclarator(t.identifier("__IMMUNE__MODULE__NAME__"), t.stringLiteral(fname))
          	// 		    ]
            //   		)
            // 		, [])
            //   ])
            // }
        }
      },
      Identifier : (path, env) => {
        var node  = path.node
          , scope = path.scope
        
        if (!scope.hasBinding(node.name) && utils[node.name] && !env.file.get("bind-imports").some(imp => imp === node.name)) {
          env.file.set("bind-imports", env.file.get("bind-imports").concat(node.name))
        }
      },

      CallExpression: (path, env) => {
        var node  = path.node
          , scope = path.scope
        
        if (t.isBindExpression(node.callee))
          path.replaceWith(t.callExpression(node.callee.callee, [node.callee.object, ...(node.arguments || [])].concat([])))

        var args;

        if ((args = path.node.arguments.filter(function (arg) { return arg.name === "__" })).length)
          path.replaceWith(curry(t, path.node, args, path.scope))
      },

      BindExpression: (path, env) => {
        if (path.node.object.name === "__") {
          var uuid = path.scope.generateUidIdentifierBasedOnNode(path.node.object)
            , rest = path.scope.generateUidIdentifierBasedOnNode(t.identifier("rest"))


          path.replaceWith(
            t.functionExpression(t.identifier("__" + path.node.callee.name), [uuid, t.restElement(rest)], t.blockStatement([
              t.returnStatement(t.callExpression(path.node.callee, [uuid, t.spreadElement(rest)]))
            ]))
          )
        }
      },
      
      VariableDeclaration(path, env) {
				const node = path.node.declarations[0]
        
        if (!node.init) return;
        
        if (node.init.arguments && (node.init.arguments.length === 0 || isType(node) || isUnion(node) || isFun(node) || isProtocol(node))) {
          if (node.init.arguments[0] && node.init.arguments[0].type !== "StringLiteral")
            node.init.arguments.unshift(t.stringLiteral(node.id.name))
        }
      },
      
      ObjectProperty (path, env) {
        const node = path.node
			  if (isType(node) || isUnion(node) || isFun(node) || isProtocol(node)) {
          if (path.node.value.arguments && (path.node.value.arguments.length === 0 || path.node.value.arguments[0].type !== "StringLiteral"))
            path.node.value.arguments.unshift(t.stringLiteral(path.node.key.name))
        }
      }
    }
  }
}
