export const create = async ({ model, data }) => {
    return await model.create(data)
}

export const find = async ({ model, filter = {}, options = {} }) => {
    const doc = model.find(filter)
    if (options.select) doc.select(options.select)
    if (options.populate) doc.populate(options.populate)
    if (options.sort) doc.sort(options.sort)
    if (options.skip) doc.skip(options.skip)
    if (options.limit) doc.limit(options.limit)
    return await doc.exec()
}

export const findOne = async ({ model, filter }) => {
    return await model.findOne(filter)
}

export const findById = async ({ model, id }) => {
    return await model.findById(id)
}

export const findByIdAndUpdate = async ({ model, id, data }) => {
    return await model.findByIdAndUpdate(id, data, { new: true })
}

export const findOneAndReplace = async ({ model, filter, data }) => {
    return await model.findOneAndReplace(filter, data, { new: true })
}

export const updateMany = async ({ model, filter, data }) => {
    return await model.updateMany(filter, data)
}

export const findByIdAndDelete = async ({ model, id }) => {
    return await model.findByIdAndDelete(id);
}

export const deleteMany = async ({ model, filter }) => {
    return await model.deleteMany(filter);
}

export const aggregate = async ({ model, pipeline = [] }) => {
    return await model.aggregate(pipeline)
}