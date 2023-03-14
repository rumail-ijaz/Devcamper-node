const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    console.log(req.query,'request');
    // copy req.query
    const reqQuery= {...req.query}

    // Fields to exclude
    const removeFields= ['select', 'sort', 'page', 'limit']

    // loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])
    console.log(reqQuery,'reqQuery');

    // create query string 
    let queryStr = JSON.stringify(reqQuery)

    // create operators ($gt, $lt, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    console.log(queryStr,'queryreplace')
 
    // finding resource
    query = model.find(JSON.parse(queryStr))

    console.log(query,'full');
    // select fields
    if(req.query.select){
        const fields= req.query.select.split(',').join(' ')
        query=query.select(fields)
    }
    // sort
    if(req.query.sort){
        const sortBy=  req.query.sort.split(',').join(' ')
        query= query.sort(sortBy)
    }
    else{
        query= query.sort('-createdAt')
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    console.log(startIndex, "skips", endIndex)
    const total = await model.countDocuments()
    console.log(total, "total")

    query = query.skip(startIndex).limit(limit)

    if(populate){
        query= query.populate(populate)
    }

    // executing query 
    const results= await query

    // pagination result
    const pagination = {}
    if (endIndex < total)
    {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0)
    {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults= {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next()
}

module.exports= advancedResults