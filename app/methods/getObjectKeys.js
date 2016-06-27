
export default function getObjectKeys(obj) {
	var keys = [];
	for(var k in obj) {
		keys.push({key: k, obj: obj[k]})
	} 
	return keys
}