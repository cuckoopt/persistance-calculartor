# persistance-calculartor
### Requirements
 - node

#### Running
```bash
node --expose_gc peristance.js 
```
##### To increase the heap size 
```bash
node --expose_gc --max_old_space_size=(mem in KB) peristance.js 
```
##### There is a minified version that works the same (should be somewhat faster)
```bash
node --expose_gc --max_old_space_size=10240 peristance.min.js 
```
