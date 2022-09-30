const getParentNodeOfTree = (tree, id, parent) => {
	let parentData = null;
	for (let i = 0; i < tree.length; i++) {
		if (tree[i].id == id) {
			parentData = parent;
			break;
		} else {
			if (tree[i].children && tree[i].children.length > 0) {
				parentData = getParentNodeOfTree(tree[i].children, id, tree[i]);
				if (parentData != null && parentData != undefined) {
					break;
				}
			}
		}
	}
	return parentData;
};
export default getParentNodeOfTree