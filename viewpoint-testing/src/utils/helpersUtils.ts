import React, { useEffect, useState } from "react";
import {
  patternNotContainEmoji,
  patternNotContainsSpecialCharacters,
} from "./regExp";

export const getUser = () => {
  return localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
};

export const checkIfDuplicateExists = (arr) => {
  return new Set(arr).size !== arr.length;
};

export const deepDiffMapper = (function () {
  return {
    VALUE_CREATED: "created",
    VALUE_UPDATED: "updated",
    VALUE_DELETED: "deleted",
    VALUE_UNCHANGED: "unchanged",
    map: function (obj1, obj2) {
      if (this.isFunction(obj1) || this.isFunction(obj2)) {
        throw "Invalid argument. Function given, object expected.";
      }
      if (this.isValue(obj1) || this.isValue(obj2)) {
        const newType = this.compareValues(obj1, obj2);
        return {
          typeCompare: newType,
          // data: obj1 === undefined ? obj2 : obj1,
          data1: obj1,
          data2: obj2,
        };
      }

      const diff = {};
      for (const key in obj1) {
        if (this.isFunction(obj1[key])) {
          continue;
        }
        let value2 = undefined;
        if (obj2[key] !== undefined) {
          value2 = obj2[key];
        }

        diff[key] = this.map(obj1[key], value2);
      }
      for (const key in obj2) {
        if (this.isFunction(obj2[key]) || diff[key] !== undefined) {
          continue;
        }

        diff[key] = this.map(undefined, obj2[key]);
      }

      return diff;
    },
    compareValues: function (value1, value2) {
      if (value1 === value2) {
        return this.VALUE_UNCHANGED;
      }
      if (
        this.isDate(value1) &&
        this.isDate(value2) &&
        value1.getTime() === value2.getTime()
      ) {
        return this.VALUE_UNCHANGED;
      }
      if (value1 === undefined) {
        return this.VALUE_CREATED;
      }
      if (value2 === undefined) {
        return this.VALUE_DELETED;
      }
      return this.VALUE_UPDATED;
    },
    isFunction: function (x) {
      return Object.prototype.toString.call(x) === "[object Function]";
    },
    isArray: function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    },
    isDate: function (x) {
      return Object.prototype.toString.call(x) === "[object Date]";
    },
    isObject: function (x) {
      return Object.prototype.toString.call(x) === "[object Object]";
    },
    isValue: function (x) {
      return !this.isObject(x) && !this.isArray(x);
    },
  };
})();

export const checkContainsSpecialCharacter = (values) => {
  if (typeof values === "string") {
    return patternNotContainsSpecialCharacters.test(values.trim());
  }
  return false;
};

export const removeEmoji = (value: string) => {
  if (typeof value === "string") {
    return patternNotContainEmoji.test(value.trim());
  }
  return false;
};

export const debounce = (callback, wait) => {
  let timeoutId = null;
  return () => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback();
    }, wait);
  };
};

export const deepFind = (obj, path) => {
  const paths = path.split(".");
  let current = obj;
  if (!obj) {
    return null;
  }

  for (let i = 0; i < paths.length; ++i) {
    if (current[paths[i]] == undefined) {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }
  return current;
};

export const deepCopy = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};

export const deleteMultiObjectByListObject = (arrayOfObjects, listToDelete) => {
  const temp = [...arrayOfObjects];
  for (let i = 0; i < arrayOfObjects.length; i++) {
    const id = arrayOfObjects[i];

    if (listToDelete.indexOf(id) !== -1) {
      temp.splice(i, 1);
    }
  }
  return temp;
};

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const loop = (data, key: React.Key, callback) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === key) {
      return callback(data[i], i, data);
    }

    if (data[i].children) {
      loop(data[i].children, key, callback);
    }
  }
};

export const loopAllChildren = (data, callback) => {
  for (let i = 0; i < data.length; i++) {
    callback(data[i], i, data);

    if (data[i].children) {
      loopAllChildren(data[i].children, callback);
    }
  }
};

export const loopAllChildrenParamsObject = (object, callback) => {
  for (let i = 0; i < object.children.length; i++) {
    callback(object.children[i], i, object);

    if (object.children[i].children) {
      loopAllChildrenParamsObject(object.children[i], callback);
    }
  }
};

export const loopAllChildrenFindIdMatch = (data, listId, callback) => {
  for (let i = 0; i < data.length; i++) {
    for (let index = 0; index < listId.length; index++) {
      const element = listId[index];
      if (listId.includes(data?.[i]?.key)) {
        callback(data?.[i], i, data, element, index, listId);
      }
    }

    if (data?.[i] && data?.[i]?.children) {
      loopAllChildrenFindIdMatch(data?.[i]?.children, listId, callback);
    }
  }
};

export const sortDomains = (array) => {
  if (array) {
    let firstObject;
    const sortedArray = [];
    for (let i = 0; i < array?.length; i++) {
      if (!array[i]?.parentId) {
        sortedArray.push(array[i]);
        firstObject = array[i];
        break;
      }
    }
    while (array.length > sortedArray.length) {
      for (let i = 0; i < array?.length; i++) {
        if (array[i].parentId === firstObject.id) {
          firstObject = array[i];
          sortedArray.push(array[i]);
          break;
        }
      }
    }
    return sortedArray;
  }
  return [];
};
