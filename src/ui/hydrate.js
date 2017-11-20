const walk = (node, map) =>
  map(
    node.tagName.toLowerCase(),
    node
      ? [...node.childNodes].map(node =>
          node.nodeType === Node.TEXT_NODE
            ? node.nodeValue.trim() && node.nodeValue
            : walk(node, map)
        )
      : node
  )

const toVDOM = element =>
  walk(element, (nodeName, children) => ({ tag: nodeName, data: {}, children }))

export default element => {
  const firstChild = element.children[0]
  
  return { element: firstChild, oldNode: firstChild ? toVDOM(firstChild) : firstChild }
}