import Window from "../"

test("payload should be an instance of Window", done => {
  Window.getWindow(win => win).fork(() => {}, win => {
    expect(win instanceof Window).toBe(true)
    done()
  })
})

test("payload should contain window dimensions", done => {
  updateWindowProps()
  Window.getWindow(win => win).fork(() => {}, win => {
    expect(win.dimensions).toEqual({ inner: { width: 1920, height: 1024 }, outer: { width: 1920, height: 1024 } })
    resetWindowProps()
    done()
  })
})

test("payload should contain scroll dimensions", done => {
  updateWindowProps()
  Window.getWindow(win => win).fork(() => {}, win => {
    expect(win.scroll).toEqual({ x: 20, y: 10 })
    resetWindowProps()
    done()
  })
})




//******************************************************************************
// UTILS
//******************************************************************************

const { innerHeight, innerWidth, outerHeight, outerWidth, scrollX, scrollY } = window

const updateWindowProps = () => {
  window.innerHeight = 1024; window.innerWidth = 1920; 
  window.outerHeight = 1024; window.outerWidth = 1920;
  window.scrollX     = 20  ; window.scrollY    = 10 
}

const resetWindowProps = () => {
  window.innerHeight = innerHeight; window.innerWidth = innerWidth; 
  window.outerHeight = outerHeight; window.outerWidth = outerWidth;
  window.scrollX     = scrollX    ; window.scrollY    = scrollY   ;
}