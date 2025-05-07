exports.updateOrCreate = async (model, where, newItem) => {
	const foundItem = await model.findOne({ where });
	if (!foundItem) {
		const item = await model.create({ ...where, ...newItem });
		return { item, created: true };
	}
	const item = await model.update(newItem, { where });
	return { item, created: false };
};
