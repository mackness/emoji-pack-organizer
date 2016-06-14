import $ from 'jquery';

export default function makeArray(obj) {
  return $.map(obj, (item, index)=> {
    return item
  });
}