import { Stream, MemoryStream } from "xstream";

import { IFunctor, IApply, IBind } from "../../protocols";

import _debounce from 'xstream/extra/debounce';
import _throttle from 'xstream/extra/throttle';
import _dropRepeats from 'xstream/extra/dropRepeats';

IFunctor(Stream, { map: function map(self, f) {
    return self.map(f);
  }
});

IApply(Stream, { ap: function ap(self, xs) {
    return IBind.andThen(self, function (f) {
      return IFunctor.map(xs, f);
    });
  }
});

IBind(Stream, { andThen: function andThen(self, f) {
    return self.map(f).flatten();
  }
});

IFunctor(MemoryStream, { map: function map(self, f) {
    return self.map(f);
  }
});

IApply(MemoryStream, { ap: function ap(self, xs) {
    return IBind.andThen(self, function (f) {
      return IFunctor.map(xs, f);
    });
  }
});

IBind(MemoryStream, { andThen: function andThen(self, f) {
    return self.map(f).flatten();
  }
});

export var addListener = function addListener(self, listener) {
  return self.addListener(listener);
};

export var removeListener = function removeListener(self, listener) {
  return self.removeListener(listener);
};

export var sendNext = function sendNext(stream, value) {
  return stream.shamefullySendNext(value);
};

export var sendError = function sendError(stream, error) {
  return stream.shamefullySendError(error);
};

export var sendComplete = function sendComplete(stream) {
  return stream.shamefullySendComplete();
};

export var startWith = function startWith(self, val) {
  return self.startWith(val);
};

export var throttle = function throttle(stream, ms) {
  return stream.compose(_throttle(ms));
};

export var debounce = function debounce(stream, ms) {
  return stream.compose(_debounce(ms));
};

export var dropRepeats = function dropRepeats(stream, matcher) {
  return stream.compose(matcher ? _dropRepeats(matcher) : _dropRepeats());
};

export { Stream } from "xstream";