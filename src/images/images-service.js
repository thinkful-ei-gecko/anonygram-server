const ImagesService = {
  getSubmissionsSorted: (db, sort = 'new') => {
    if (sort === 'new') {
      return db('submission')
        .select('*')
        .orderBy('create_timestamp', 'DESC')
    } else {
      return db('submission')
        .select('*')
        .orderBy('karma_total', 'DESC')
    }
      
  },
  createSubmission(db, submission) {
    return db
      .insert(submission)
      .into('submission')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = ImagesService;
