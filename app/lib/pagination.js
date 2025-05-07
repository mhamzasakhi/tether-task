exports.paginate = (query, page = 1, pageSize = 10) => {
	const offset = (page - 1) * pageSize;
	/* console.log({
    ...query,
    offset,
    limit: pageSize,
  });*/
	return {
		...query,
		offset,
		limit: pageSize,
	};
};

exports.getPages = (total, size) => Math.ceil(total / size);
