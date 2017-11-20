import 
  { Stream
  , MemoryStream
  } from "xstream"

import
  { IFunctor
  , IApply
  , IBind
  } from "../../protocols"

import _debounce    from 'xstream/extra/debounce'
import _throttle    from 'xstream/extra/throttle'
import _dropRepeats from 'xstream/extra/dropRepeats'


IFunctor(Stream,
  { map: (self, f) =>
      self.map(f)
  }
)

IApply(Stream,
  { ap: (self, xs) =>
      IBind.andThen(self, f => IFunctor.map(xs, f))
  }
)

IBind(Stream,
  { andThen: (self, f) =>
      self.map(f).flatten()
  }
)

IFunctor(MemoryStream,
  { map: (self, f) =>
      self.map(f)
  }
)

IApply(MemoryStream,
  { ap: (self, xs) =>
      IBind.andThen(self, f => IFunctor.map(xs, f))
  }
)

IBind(MemoryStream,
  { andThen: (self, f) =>
      self.map(f).flatten()
  }
)

export const addListener = (self, listener) =>
  self.addListener(listener)

export const removeListener = (self, listener) =>
  self.removeListener(listener)

export const sendNext = (stream, value) =>
  stream.shamefullySendNext(value)

export const sendError = (stream, error) =>
  stream.shamefullySendError(error)

export const sendComplete = stream =>
  stream.shamefullySendComplete()

export const startWith = (self, val) =>
  self.startWith(val)

export const throttle = (stream, ms) =>
  stream.compose(_throttle(ms))

export const debounce = (stream, ms) =>
  stream.compose(_debounce(ms))

export const dropRepeats = (stream, matcher) => 
  stream.compose(matcher ? _dropRepeats(matcher) : _dropRepeats())

export { Stream } from "xstream"
