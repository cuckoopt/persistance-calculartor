# persistance-calculartor
### Requirements
 - node

#### Running
```bash
node --expose_gc persistance.js 
```
##### To increase the heap size 
```bash
node --expose_gc --max_old_space_size=(mem in KB) persistance.js 
```
##### There is a simplified version that works the same that is faster and less memory hungry
```bash
node persistance-minimal.js 
```
##### Both versions have been minified (should be somewhat faster)
```bash
node --expose_gc --max_old_space_size=10240 persistance.min.js 
node persistance-minimal.min.js 
```
