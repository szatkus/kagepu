kagepu - incomplete, incorrect and bug-ridden implementation of WebGPU over standard HTML canvas. 
=================================================

To get things working after installing npm modules as usual you just need to execute:

`$ npm start`

At the moment only `/examples/hello_triangle.html` works.

To inject kagepu into existing WebGPU code you should declare these things in HTML:
```
  <script src="../kagepu.js"></script>
  <script>
    kagepu.monkeyPatch();
  </script>
```

In the current state the library should work in most modern browsers (maybe even in IE).

**Progress**:
 - most of WebGPU interfaces are at least stubbed
 - basic implementation of SPIR-V interpreter
 - it can draw a triangle (with horrible performance)
 - simple compute
 - some tests from the Conformance Test Suite pass (290/425)
 - not much else

WSL or MSL isn't supported, just pure SPIR-V, so you better use GLSlang.
