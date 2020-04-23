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

This library has a side effect, it will mutate the state being serialized by adding a `__id__` property to every object. It does so because browsers will not make the address of objects accessible, so it's used as an alternative solution. 

**Important:** If you already have an `__id__` key in any of your objects, it will be overriden during the serialization process. In future updates, you will be able to modify the name of that property and have it removed after the serialization and deserialization are complete. The property name character length will not affect the serialized object, so it will be safe to use a long and unique name for the id.

## TODOs

* Support modifying the id key
* Support deleting key after serialization and deserialization
* Support incremental serialization and deserialization (will only work if the id key is not deleted)

## Contributing
Pull requests are welcome. Open an issue first to discuss for major changes.

## License
[MIT](https://choosealicense.com/licenses/mit/)