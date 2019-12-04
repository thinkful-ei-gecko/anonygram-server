const ImagesService = {
  getSubmissions: (db, sort = 'new', page = null) => {
    const PAGINATION_VALUE = 10;
    const pageNum = parseInt(page) - 1;
    if (!page) {
      if (sort === 'new') {
        return db('submission')
          .select('*')
          .orderBy('create_timestamp', 'DESC');
      } else {
        return db('submission')
          .select('*')
          .orderBy('karma_total', 'DESC');
      }
    } else {
      console.log(PAGINATION_VALUE * pageNum);
      if (sort === 'new') {
        return db('submission')
          .select('*')
          .limit(PAGINATION_VALUE)
          .offset(PAGINATION_VALUE * pageNum)
          .orderBy('create_timestamp', 'DESC');
      } else {
        return db('submission')
          .select('*')
          .limit(PAGINATION_VALUE)
          .offset(PAGINATION_VALUE * pageNum)
          .orderBy('karma_total', 'DESC');
      }
    }
  },

  getSingleSubmission: (db, id) => {
    return db('submission')
      .select('*')
      .where({ id })
      .first();
  },

  updateSingleSubmission: (db, id, data) => {
    const karma_total = data.karma_total;
    return db('submission')
      .where({ id: id })
      .update({ karma_total: karma_total })
      .then(() => ImagesService.getSingleSubmission(db, id));
  },

  createSubmission(db, submission) {
    return db
      .insert(submission)
      .into('submission')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
};

module.exports = ImagesService;
