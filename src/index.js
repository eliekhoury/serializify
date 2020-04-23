const config = {
  idKey: "__id__",
};

function generateId() {
  const random = Math.random().toString(16).slice(2, 10);
  return `0x${random}`;
}

function scan(obj, map = {}) {
  if (typeof obj === "object") {
    if (!obj.hasOwnProperty(config.idKey)) {
      let id = generateId();
      while (map.hasOwnProperty(id)) {
        id = generateId();
      }
      obj[config.idKey] = id;

      const content = Object.keys(obj).filter((key) => key !== config.idKey);
      const type = obj.constructor && obj.constructor.name;
      const children = content.map((key) => {
        const child = obj[key];
        const value = scan(child, map);
        return type === "Array" ? value : [key, value];
      });

      map[id] = [obj.constructor && obj.constructor.name, children];
    }
    return [obj[config.idKey]];
  } else {
    return obj;
  }
}

const resolve = (cursor, map, resolved) => {
  // primitive data type
  if (typeof cursor !== "object") {
    // resolved value
    return cursor;
  }

  // value is a reference
  if (cursor.length == 1) {
    const [root] = cursor;
    // already resolved, stop recursion
    if (!resolved.hasOwnProperty(root)) {
      // not resolved yet
      if (map.hasOwnProperty(root)) {
        const type = map[root];
        resolved[root] = type === "Array" ? [] : {};
        resolved[root][config.idKey] = root;
        const object = resolve(map[root], map, resolved);
        if (type === "Array") resolved[root].push(...object);
        else Object.assign(resolved[root], object);
      }
    }

    return resolved[root];
  }

  // value is an object or array
  if (cursor.length == 2) {
    // object
    const [type, values] = cursor;
    const temp = type === "Array" ? [] : {};
    values.forEach((value) => {
      if (type === "Array") {
        temp.push(resolve(value, map, resolved));
      } else {
        const [key, val] = value;
        temp[key] = resolve(val, map, resolved);
      }
    });
    return temp;
  }
};

export const serialize = (obj) => {
  const map = {};
  const root = scan(obj, map);
  return [root, map];
};

export const deserialize = (data) => {
  const [root, map] = data;
  const resolved = {};
  return resolve(root, map, resolved);
};
