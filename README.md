# Serializify

Serializify is a Javascript library for serializing self-referencing objects. One use case this library solves is the ability to serialize the redux undo/redo state and store it in the cloud.

## Installation

```bash
yarn add serializify
```

## Usage

```javascript
import { serialize, deserialize } from 'serializify';

// Take an object that references itself
const obj = {};
obj.a = {
  b: 123
};
obj.c = {
  d: obj.a
};
obj.d = obj;
obj.e = [obj.a, obj, obj.d];
obj.f = 1;

// Serialize it for storage
const serialized = JSON.stringify(serialize(obj));

// Deserialize it to the original state
const unserialized = deserialize(JSON.parse(serialized)); 
```

## How it works
This library will assign an id to every unique object and map it. It uses an opinionated data structure that nests a tree of object references and primitive data types. The serialized object will have a root id and a map of objects.

## Contributing
Pull requests are welcome. Open an issue first to discuss for major changes.

## License
[MIT](https://choosealicense.com/licenses/mit/)